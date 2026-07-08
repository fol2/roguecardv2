import { defineConfig } from "vite";
import { readFileSync, writeFileSync, renameSync } from "node:fs";
import { resolve } from "node:path";

const BF_SAVE_PORT = 5174;
const BF_SAVE_HOSTS = ["localhost", "127.0.0.1", "macm4.tail55e87e.ts.net"];
const BF_LAYOUT_PATH = resolve("src/battlefield-layout.js");
const BF_LAYOUT_TMP = `${BF_LAYOUT_PATH}.tmp`;
const CHAR_SHADOW_PATH = resolve("src/cast-shadow.js");
const CHAR_SHADOW_TMP = `${CHAR_SHADOW_PATH}.tmp`;
let suppressBFHotUpdateUntil = 0;
let suppressBFHotUpdateText = "";
let suppressCharHotUntil = 0;
let suppressCharHotText = "";

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
    handleHotUpdate({ file }) {
      if (file === BF_LAYOUT_PATH && suppressBFHotUpdateText && Date.now() < suppressBFHotUpdateUntil) {
        try {
          if (readFileSync(file, "utf8") === suppressBFHotUpdateText) return [];
        } catch {}
      }
      if (file === CHAR_SHADOW_PATH && suppressCharHotText && Date.now() < suppressCharHotUntil) {
        try {
          if (readFileSync(file, "utf8") === suppressCharHotText) return [];
        } catch {}
      }
    },
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
          suppressBFHotUpdateText = nextBF;
          suppressBFHotUpdateUntil = Date.now() + 10000;
          writeFileSync(BF_LAYOUT_TMP, nextBF);
          renameSync(BF_LAYOUT_TMP, BF_LAYOUT_PATH);
          server.moduleGraph.invalidateAll();
          res.end(JSON.stringify({ ok: true, reload: true }));
        } catch (e) {
          res.statusCode = 400;
          res.end(JSON.stringify({ ok: false, problems: [String(e?.message ?? e)] }));
        }
      });

      // ?charedit=1 → POST /__char-save writes src/cast-shadow.js
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
          const [{ serializeCastShadow, validateCastShadow }, { CAST_SHADOW_DEFAULT }, { ENEMIES, ASPECTS }] = await Promise.all([
            import("./src/dev/char-serialize.js"),
            import("./src/cast-shadow.js"),
            import("./src/data.js"),
          ]);
          const table = JSON.parse(body);
          const problems = validateCastShadow(table, {
            enemies: Object.keys(ENEMIES),
            heroes: ASPECTS.map((a) => a.id),
          });
          if (problems.length) { res.statusCode = 400; return res.end(JSON.stringify({ ok: false, problems })); }
          const next = serializeCastShadow(table, CAST_SHADOW_DEFAULT);
          suppressCharHotText = next;
          suppressCharHotUntil = Date.now() + 10000;
          writeFileSync(CHAR_SHADOW_TMP, next);
          renameSync(CHAR_SHADOW_TMP, CHAR_SHADOW_PATH);
          server.moduleGraph.invalidateAll();
          res.end(JSON.stringify({ ok: true }));
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
