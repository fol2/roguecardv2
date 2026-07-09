import { defineConfig } from "vite";
import { writeFileSync, renameSync } from "node:fs";
import { resolve } from "node:path";

const BF_SAVE_PORT = 5174;
const BF_SAVE_HOSTS = ["localhost", "127.0.0.1", "macm4.tail55e87e.ts.net"];
const BF_LAYOUT_PATH = resolve("src/battlefield-layout.js");
const BF_LAYOUT_TMP = `${BF_LAYOUT_PATH}.tmp`;
const CHAR_META_PATH = resolve("src/char-meta.js");
const CHAR_META_TMP = `${CHAR_META_PATH}.tmp`;
const WARD_PARAMS_PATH = resolve("src/ward-params.js");
const WARD_PARAMS_TMP = `${WARD_PARAMS_PATH}.tmp`;

/** Reject cross-origin POSTs — only the dev server (or allowedHosts) may write. */
function bfSaveOriginOk(req) {
  const host = String(req.headers.host ?? "");
  if (!BF_SAVE_HOSTS.some((h) => host === `${h}:${BF_SAVE_PORT}`)) return false;
  const origin = req.headers.origin;
  if (!origin) return true; // local tools (curl/node) with a trusted Host
  return BF_SAVE_HOSTS.some(
    (h) => origin === `http://${h}:${BF_SAVE_PORT}` || origin === `https://${h}:${BF_SAVE_PORT}`,
  );
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
    allowedHosts: [BF_SAVE_HOSTS[2]],
  },
});
