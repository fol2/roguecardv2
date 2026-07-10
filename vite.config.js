import { defineConfig } from "vite";
import { readdirSync, writeFileSync, renameSync } from "node:fs";
import { resolve } from "node:path";

const BF_SAVE_PORT = 5174;
// Vite Host header gate for loading the page over Tailscale / LAN.
// localhost + 127.0.0.1 are always allowed by Vite. `.ts.net` is a suffix
// match (any MagicDNS name on the tailnet). Prefer MagicDNS over raw 100.x
// IPs — IPs are not covered. Save itself uses same-origin checks below.
const DEV_ALLOWED_HOSTS = [".ts.net"];
const BF_LAYOUT_PATH = resolve("src/battlefield-layout.js");
const BF_LAYOUT_TMP = `${BF_LAYOUT_PATH}.tmp`;
const UIC_LAYOUT_PATH = resolve("src/ui-chrome-layout.js");
const UIC_LAYOUT_TMP = `${UIC_LAYOUT_PATH}.tmp`;
const CHAR_META_PATH = resolve("src/char-meta.js");
const CHAR_META_TMP = `${CHAR_META_PATH}.tmp`;
const WARD_PARAMS_PATH = resolve("src/ward-params.js");
const WARD_PARAMS_TMP = `${WARD_PARAMS_PATH}.tmp`;
const AUDIO_SELECTION_PATH = resolve("public/audio-selection.json");
const AUDIO_SELECTION_TMP = `${AUDIO_SELECTION_PATH}.tmp`;

function readAudioInventory(baseVersions) {
  const roots = {
    music: resolve("src/assets/musics"),
    sfx: resolve("src/assets/sfx"),
  };
  const isAudioFile = (name) => /^[A-Za-z0-9][A-Za-z0-9._-]*\.mp3$/.test(name);
  return Object.fromEntries(Object.entries(roots).map(([kind, root]) => {
    const refs = [];
    for (const entry of readdirSync(root, { withFileTypes: true })) {
      if (entry.isFile() && isAudioFile(entry.name)) {
        refs.push(`${baseVersions[kind]}/${entry.name}`);
      } else if (entry.isDirectory() && /^[a-z0-9][a-z0-9-]*$/.test(entry.name)) {
        if (entry.name === baseVersions[kind]) throw new Error(`${kind}: base version id is reserved for root files`);
        for (const file of readdirSync(resolve(root, entry.name), { withFileTypes: true })) {
          if (file.isFile() && isAudioFile(file.name)) refs.push(`${entry.name}/${file.name}`);
        }
      }
    }
    return [kind, refs.sort()];
  }));
}

/**
 * DEV save endpoints: allow any host that can already reach this server, but
 * reject cross-origin browser POSTs (Origin must match Host). curl/node with
 * no Origin still work — this middleware is serve-only.
 */
function bfSaveOriginOk(req) {
  const host = String(req.headers.host ?? "").trim();
  if (!host) return false;
  const origin = req.headers.origin;
  if (!origin) return true;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

function readJsonBody(req, res, limit = 1_048_576) {
  return new Promise((resolveBody) => {
    let body = "";
    let bytes = 0;
    req.on("data", (c) => {
      if (res.writableEnded) return;
      bytes += c.length;
      if (bytes > limit) {
        body = "";
        res.statusCode = 413;
        res.setHeader("content-type", "application/json");
        res.end(JSON.stringify({ ok: false, problems: ["payload too large"] }));
        return;
      }
      body += c;
    });
    req.on("end", () => resolveBody(res.writableEnded ? null : body));
  });
}

// dev-only battlefield editor save endpoint (?bfedit=1 → POST /__bf-save)
function bfSavePlugin() {
  return {
    name: "bf-save",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/audio-selection.json", (req, res, next) => {
        res.setHeader("cache-control", "no-store");
        next();
      });

      // ?audio=1 backend controls → runtime JSON. Production remains read-only.
      server.middlewares.use("/__audio-save", async (req, res) => {
        if (req.method !== "POST") { res.statusCode = 405; return res.end(); }
        if (!bfSaveOriginOk(req)) {
          res.statusCode = 403;
          res.setHeader("content-type", "application/json");
          return res.end(JSON.stringify({ ok: false, problems: ["forbidden origin"] }));
        }
        const body = await readJsonBody(req, res);
        if (body == null) return;
        res.setHeader("content-type", "application/json");
        try {
          const [{ BASE_AUDIO_VERSIONS, validateAudioSelection }, { serializeAudioSelection }] = await Promise.all([
            import("./src/audio-packs.js"),
            import("./src/dev/audio-selection-serialize.js"),
          ]);
          const selection = JSON.parse(body);
          const inventory = readAudioInventory(BASE_AUDIO_VERSIONS);
          const problems = validateAudioSelection(selection, inventory);
          if (problems.length) { res.statusCode = 400; return res.end(JSON.stringify({ ok: false, problems })); }
          writeFileSync(AUDIO_SELECTION_TMP, serializeAudioSelection(selection));
          renameSync(AUDIO_SELECTION_TMP, AUDIO_SELECTION_PATH);
          res.end(JSON.stringify({ ok: true, reload: true }));
        } catch (e) {
          res.statusCode = 400;
          res.end(JSON.stringify({ ok: false, problems: [String(e?.message ?? e)] }));
        }
      });

      server.middlewares.use("/__bf-save", async (req, res) => {
        if (req.method !== "POST") { res.statusCode = 405; return res.end(); }
        if (!bfSaveOriginOk(req)) {
          res.statusCode = 403;
          res.setHeader("content-type", "application/json");
          return res.end(JSON.stringify({ ok: false, problems: ["forbidden origin"] }));
        }
        const body = await readJsonBody(req, res);
        if (body == null) return;
        res.setHeader("content-type", "application/json");
        try {
          const [{ serializeBF, validateBF }, { ENEMIES, ASPECTS }] = await Promise.all([
            import("./src/dev/bf-serialize.js"),
            import("./src/data.js"),
          ]);
          const bf = JSON.parse(body);
          const problems = validateBF(bf, { enemies: Object.keys(ENEMIES), heroes: ASPECTS.map((a) => a.id) });
          if (problems.length) { res.statusCode = 400; return res.end(JSON.stringify({ ok: false, problems })); }
          const nextBF = serializeBF(bf);
          writeFileSync(BF_LAYOUT_TMP, nextBF);
          renameSync(BF_LAYOUT_TMP, BF_LAYOUT_PATH);
          // Invalidate only the layout module — battlefield.js accepts it via
          // import.meta.hot and soft-applies via onBFChange (no full reload).
          const mods = server.moduleGraph.getModulesByFile(BF_LAYOUT_PATH);
          if (mods) for (const m of mods) server.moduleGraph.invalidateModule(m);
          res.end(JSON.stringify({ ok: true, reload: false }));
        } catch (e) {
          res.statusCode = 400;
          res.end(JSON.stringify({ ok: false, problems: [String(e?.message ?? e)] }));
        }
      });

      // ?charedit=1 / ?bfedit=1 actor fields → POST /__char-save writes src/char-meta.js
      server.middlewares.use("/__char-save", async (req, res) => {
        if (req.method !== "POST") { res.statusCode = 405; return res.end(); }
        if (!bfSaveOriginOk(req)) {
          res.statusCode = 403;
          res.setHeader("content-type", "application/json");
          return res.end(JSON.stringify({ ok: false, problems: ["forbidden origin"] }));
        }
        const body = await readJsonBody(req, res);
        if (body == null) return;
        res.setHeader("content-type", "application/json");
        try {
          const [{ serializeCharMeta, validateCharMeta }, { CHAR_LAYOUT_DEFAULT, CHAR_SHADOW_DEFAULT, CHAR_AIM_DEFAULT }, { ENEMIES, ASPECTS }] = await Promise.all([
            import("./src/dev/char-serialize.js"),
            import("./src/char-meta.js"),
            import("./src/data.js"),
          ]);
          const payload = JSON.parse(body);
          const table = payload?.meta && typeof payload.meta === "object" && !Array.isArray(payload.meta)
            ? payload.meta
            : payload;
          const aimIn = payload?.aim && typeof payload.aim === "object" ? payload.aim : null;
          const problems = validateCharMeta(table, {
            enemies: Object.keys(ENEMIES),
            heroes: ASPECTS.map((a) => a.id),
          });
          if (problems.length) { res.statusCode = 400; return res.end(JSON.stringify({ ok: false, problems })); }
          const aimDefault = aimIn ? { ...CHAR_AIM_DEFAULT, ...aimIn } : { ...CHAR_AIM_DEFAULT };
          if (!["spin", "chase", "solid"].includes(aimDefault.style)) {
            res.statusCode = 400;
            return res.end(JSON.stringify({ ok: false, problems: [`aim.style: invalid ${aimDefault.style}`] }));
          }
          for (const k of ["beams", "dashes"]) {
            const v = aimDefault[k];
            if (!Number.isInteger(v) || v < 1 || v > 4) {
              res.statusCode = 400;
              return res.end(JSON.stringify({ ok: false, problems: [`aim.${k}: need integer 1..4`] }));
            }
          }
          if (!Number.isFinite(aimDefault.width) || aimDefault.width < 0.006 || aimDefault.width > 0.06) {
            res.statusCode = 400;
            return res.end(JSON.stringify({ ok: false, problems: ["aim.width: need number in [0.006,0.06]"] }));
          }
          const next = serializeCharMeta(table, {
            layout: CHAR_LAYOUT_DEFAULT,
            shadow: CHAR_SHADOW_DEFAULT,
            aim: aimDefault,
          });
          writeFileSync(CHAR_META_TMP, next);
          renameSync(CHAR_META_TMP, CHAR_META_PATH);
          // Invalidate only this module — char-meta.js self-accepts HMR and
          // soft-applies via onCharMetaChange (no full page reload).
          const mods = server.moduleGraph.getModulesByFile(CHAR_META_PATH);
          if (mods) for (const m of mods) server.moduleGraph.invalidateModule(m);
          res.end(JSON.stringify({ ok: true, reload: false }));
        } catch (e) {
          res.statusCode = 400;
          res.end(JSON.stringify({ ok: false, problems: [String(e?.message ?? e)] }));
        }
      });

      // ?bfuiedit=1 → POST /__bfui-save writes src/ui-chrome-layout.js
      server.middlewares.use("/__bfui-save", async (req, res) => {
        if (req.method !== "POST") { res.statusCode = 405; return res.end(); }
        if (!bfSaveOriginOk(req)) {
          res.statusCode = 403;
          res.setHeader("content-type", "application/json");
          return res.end(JSON.stringify({ ok: false, problems: ["forbidden origin"] }));
        }
        const body = await readJsonBody(req, res);
        if (body == null) return;
        res.setHeader("content-type", "application/json");
        try {
          const { serializeUIC, validateUIC } = await import("./src/dev/bfui-serialize.js");
          const uic = JSON.parse(body);
          const { ok, problems } = validateUIC(uic);
          if (!ok) { res.statusCode = 400; return res.end(JSON.stringify({ ok: false, problems })); }
          writeFileSync(UIC_LAYOUT_TMP, serializeUIC(uic));
          renameSync(UIC_LAYOUT_TMP, UIC_LAYOUT_PATH);
          const mods = server.moduleGraph.getModulesByFile(UIC_LAYOUT_PATH);
          if (mods) for (const m of mods) server.moduleGraph.invalidateModule(m);
          res.end(JSON.stringify({ ok: true, reload: false }));
        } catch (e) {
          res.statusCode = 400;
          res.end(JSON.stringify({ ok: false, problems: [String(e?.message ?? e)] }));
        }
      });

      // ?vfxedit=1 → POST /__ward-save writes src/ward-params.js (WARD_DEFAULTS)
      server.middlewares.use("/__ward-save", async (req, res) => {
        if (req.method !== "POST") { res.statusCode = 405; return res.end(); }
        if (!bfSaveOriginOk(req)) {
          res.statusCode = 403;
          res.setHeader("content-type", "application/json");
          return res.end(JSON.stringify({ ok: false, problems: ["forbidden origin"] }));
        }
        const body = await readJsonBody(req, res);
        if (body == null) return;
        res.setHeader("content-type", "application/json");
        try {
          const { serializeWardParams, validateWardParams } = await import("./src/dev/ward-serialize.js");
          const params = JSON.parse(body);
          const problems = validateWardParams(params);
          if (problems.length) { res.statusCode = 400; return res.end(JSON.stringify({ ok: false, problems })); }
          const next = serializeWardParams(params);
          writeFileSync(WARD_PARAMS_TMP, next);
          renameSync(WARD_PARAMS_TMP, WARD_PARAMS_PATH);
          const mods = server.moduleGraph.getModulesByFile(WARD_PARAMS_PATH);
          if (mods) for (const m of mods) server.moduleGraph.invalidateModule(m);
          res.end(JSON.stringify({ ok: true, reload: false }));
        } catch (e) {
          res.statusCode = 400;
          res.end(JSON.stringify({ ok: false, problems: [String(e?.message ?? e)] }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [bfSavePlugin()],
  server: {
    host: "0.0.0.0",
    port: BF_SAVE_PORT,
    allowedHosts: DEV_ALLOWED_HOSTS,
  },
});
