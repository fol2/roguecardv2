import { defineConfig } from "vite";
import { writeFileSync, renameSync } from "node:fs";
import { resolve } from "node:path";

const BF_SAVE_PORT = 5174;
const BF_SAVE_HOSTS = ["localhost", "127.0.0.1", "macm4.tail55e87e.ts.net"];
const BF_LAYOUT_PATH = resolve("src/battlefield-layout.js");
const BF_LAYOUT_TMP = `${BF_LAYOUT_PATH}.tmp`;
let suppressBFHotUpdateUntil = 0;

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

// dev-only battlefield editor save endpoint (?bfedit=1 → POST /__bf-save)
function bfSavePlugin() {
  return {
    name: "bf-save",
    apply: "serve",
    handleHotUpdate({ file }) {
      if (file === BF_LAYOUT_PATH && Date.now() < suppressBFHotUpdateUntil) return [];
    },
    configureServer(server) {
      server.middlewares.use("/__bf-save", (req, res) => {
        if (req.method !== "POST") { res.statusCode = 405; return res.end(); }
        if (!bfSaveOriginOk(req)) {
          res.statusCode = 403;
          res.setHeader("content-type", "application/json");
          return res.end(JSON.stringify({ ok: false, problems: ["forbidden origin"] }));
        }
        let body = "";
        req.on("data", (c) => { body += c; });
        req.on("end", async () => {
          res.setHeader("content-type", "application/json");
          try {
            const [{ serializeBF, validateBF }, { ENEMIES, ASPECTS }] = await Promise.all([
              import("./src/dev/bf-serialize.js"),
              import("./src/data.js"),
            ]);
            const bf = JSON.parse(body);
            const problems = validateBF(bf, { enemies: Object.keys(ENEMIES), heroes: ASPECTS.map((a) => a.id) });
            if (problems.length) { res.statusCode = 400; return res.end(JSON.stringify({ ok: false, problems })); }
            // The editor reloads only itself after this endpoint invalidates
            // the module graph; hand edits outside this endpoint still flow
            // through Vite's normal watcher.
            suppressBFHotUpdateUntil = Date.now() + 1500;
            writeFileSync(BF_LAYOUT_TMP, serializeBF(bf)); // never half-written
            renameSync(BF_LAYOUT_TMP, BF_LAYOUT_PATH);
            server.moduleGraph.invalidateAll();
            res.end(JSON.stringify({ ok: true, reload: true }));
          } catch (e) {
            res.statusCode = 400;
            res.end(JSON.stringify({ ok: false, problems: [String(e?.message ?? e)] }));
          }
        });
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
