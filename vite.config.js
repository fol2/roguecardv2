import { defineConfig } from "vite";
import { writeFileSync, renameSync } from "node:fs";

// dev-only battlefield editor save endpoint (?bfedit=1 → POST /__bf-save)
function bfSavePlugin() {
  return {
    name: "bf-save",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/__bf-save", (req, res) => {
        if (req.method !== "POST") { res.statusCode = 405; return res.end(); }
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
            writeFileSync("src/battlefield-layout.js.tmp", serializeBF(bf)); // never half-written
            renameSync("src/battlefield-layout.js.tmp", "src/battlefield-layout.js");
            res.end(JSON.stringify({ ok: true }));
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
    port: 5174,
    allowedHosts: ["macm4.tail55e87e.ts.net"],
  },
});
