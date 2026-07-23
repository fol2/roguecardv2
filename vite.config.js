import { defineConfig } from "vite";
import { readdirSync, writeFileSync, renameSync, readFileSync, unlinkSync, statSync } from "node:fs";
import { basename, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { execSync, spawn } from "node:child_process";
import { cycleWorkProblem, runnerMetadata } from "./tools/sim/runner.mjs";

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
const SIM_REPORT_DIR = resolve(".sim-reports");
const SIM_STATUS_PATH = resolve(SIM_REPORT_DIR, ".status.json");
const SIM_LABEL_RE = /^[A-Za-z0-9._-]+$/;

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

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("content-type", "application/json");
  res.setHeader("cache-control", "no-store");
  res.end(JSON.stringify(payload));
}

function readSimStatus() {
  try {
    const status = JSON.parse(readFileSync(SIM_STATUS_PATH, "utf8"));
    return status && typeof status === "object" && !Array.isArray(status)
      ? status
      : { running: false };
  } catch {
    return { running: false };
  }
}

function processAlive(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function reportSummary(name) {
  const path = resolve(SIM_REPORT_DIR, name);
  const report = JSON.parse(readFileSync(path, "utf8"));
  const section = report.policies?.greedy
    || Object.values(report.policies || {})[0]
    || report;
  const stat = statSync(path);
  return {
    name,
    mtime: stat.mtime.toISOString(),
    size: stat.size,
    label: report.meta?.label || name.replace(/\.json$/, ""),
    schema: report.meta?.schema ?? 1,
    mode: report.meta?.mode ?? section.meta?.mode ?? "round",
    policy: report.meta?.config?.policy ?? section.meta?.policyId ?? null,
    balanceEligible: section.meta?.interpretation?.balanceEligible ?? true,
    runs: report.meta?.runs ?? section.meta?.runs ?? 0,
    cycles: report.meta?.cycles ?? section.meta?.cycles ?? 0,
    totalRounds: report.meta?.totalRounds ?? section.meta?.totalRounds ?? 0,
    winRate: section.headline?.winRate ?? null,
  };
}

function validateSimRunBody(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { problems: ["body must be an object"] };
  }
  const metadata = runnerMetadata();
  const allowed = new Set(["mode", "runs", "cycles", "maxRounds", "seed", "policy", "profile", "target", "workers", "label"]);
  const problems = Object.keys(value)
    .filter((key) => !allowed.has(key))
    .map((key) => `unexpected field: ${key}`);
  const positiveInt = (name, input, fallback, max) => {
    if (input == null) return fallback;
    if (!Number.isSafeInteger(input) || input < 1) {
      problems.push(`${name}: need a positive integer`);
      return fallback;
    }
    if (input > max) {
      problems.push(`${name}: must be <= ${max}`);
      return fallback;
    }
    return input;
  };
  const mode = value.mode ?? metadata.defaults.mode;
  if (!metadata.modes.includes(mode)) problems.push("mode: invalid value");
  const seed = value.seed == null ? 1 : value.seed;
  if (!Number.isSafeInteger(seed) || seed < 0) problems.push("seed: need a non-negative integer");
  const policy = value.policy ?? metadata.defaults[mode] ?? metadata.defaults.round;
  const definition = metadata.policies.find((item) => item.id === policy);
  const legacyBoth = mode === "round" && policy === "both";
  if (!legacyBoth && (!definition || !definition.modes.includes(mode))) problems.push("policy: invalid for mode");
  let runs = null; let cycles = null; let maxRounds = null; let profile = null; let target = null;
  if (mode === "cycle") {
    if (Object.hasOwn(value, "runs")) problems.push("runs: available only in round mode");
    if (Object.hasOwn(value, "profile")) problems.push("profile: unavailable in cycle mode");
    cycles = positiveInt("cycles", value.cycles, metadata.defaults.cycles, metadata.limits.cycles);
    maxRounds = positiveInt("maxRounds", value.maxRounds, metadata.defaults.maxRounds, metadata.limits.maxRounds);
    const workProblem = cycleWorkProblem(cycles, maxRounds);
    if (workProblem) problems.push(workProblem);
    target = value.target ?? null;
    if (target != null && policy !== "coverage") problems.push("target: available only for coverage");
    if (target != null && !metadata.targets.includes(target)) problems.push("target: unknown trigger");
  } else {
    for (const key of ["cycles", "maxRounds", "target"]) {
      if (Object.hasOwn(value, key)) problems.push(`${key}: available only in cycle mode`);
    }
    runs = positiveInt("runs", value.runs, metadata.defaults.runs, metadata.limits.runs);
    profile = value.profile ?? metadata.defaults.profile;
    if (!["revealed", "fresh", "both"].includes(profile)) problems.push("profile: invalid value");
  }
  let workers = value.workers ?? "auto";
  if (workers !== "auto") workers = positiveInt("workers", workers, 1, metadata.limits.workers);
  const label = value.label ?? "proving-grounds";
  if (typeof label !== "string" || !SIM_LABEL_RE.test(label)) {
    problems.push("label: use only letters, numbers, dot, underscore, or hyphen");
  }
  return { problems, config: { mode, runs, cycles, maxRounds, seed, policy, profile, target, workers, label } };
}

// dev-only battlefield editor save endpoint (?bfedit=1 → POST /__bf-save)
function bfSavePlugin() {
  return {
    name: "bf-save",
    apply: "serve",
    configureServer(server) {
      let activeSimPid = null;
      let activeSimConfig = null;

      server.middlewares.use("/__sim-metadata", (req, res) => {
        if (req.method !== "GET") return sendJson(res, 405, { ok: false, problems: ["method not allowed"] });
        return sendJson(res, 200, runnerMetadata());
      });

      server.middlewares.use("/__sim-reports", (req, res) => {
        if (req.method !== "GET") return sendJson(res, 405, { ok: false, problems: ["method not allowed"] });
        try {
          const reports = readdirSync(SIM_REPORT_DIR, { withFileTypes: true })
            .filter((entry) => entry.isFile() && entry.name.endsWith(".json") && entry.name !== ".status.json")
            .flatMap((entry) => {
              try { return [reportSummary(entry.name)]; } catch { return []; }
            })
            .sort((a, b) => b.mtime.localeCompare(a.mtime));
          return sendJson(res, 200, reports);
        } catch {
          return sendJson(res, 200, []);
        }
      });

      server.middlewares.use("/__sim-report", (req, res) => {
        if (req.method !== "GET") return sendJson(res, 405, { ok: false, problems: ["method not allowed"] });
        const name = new URL(req.url || "/", "http://sim.local").searchParams.get("f") || "";
        if (!name || basename(name) !== name || !name.endsWith(".json") || name === ".status.json") {
          return sendJson(res, 400, { ok: false, problems: ["invalid report name"] });
        }
        try {
          res.statusCode = 200;
          res.setHeader("content-type", "application/json");
          res.setHeader("cache-control", "no-store");
          return res.end(readFileSync(resolve(SIM_REPORT_DIR, name)));
        } catch {
          return sendJson(res, 404, { ok: false, problems: ["report not found"] });
        }
      });

      server.middlewares.use("/__sim-status", (req, res) => {
        if (req.method !== "GET") return sendJson(res, 405, { ok: false, problems: ["method not allowed"] });
        const status = readSimStatus();
        if (status.running && !processAlive(status.pid)) {
          return sendJson(res, 200, {
            ...status,
            running: false,
            error: status.error || "runner process is no longer alive",
          });
        }
        if (!status.running && processAlive(activeSimPid)) {
          const cycle = activeSimConfig?.mode === "cycle";
          return sendJson(res, 200, {
            running: true,
            pid: activeSimPid,
            done: 0,
            total: cycle ? activeSimConfig.cycles : null,
            config: activeSimConfig,
            ...(cycle ? {
              roundsPlayed: 0,
              promisesStaged: 0,
              censoredCycles: 0,
              failedCycles: 0,
              currentTarget: activeSimConfig.target,
            } : {}),
          });
        }
        return sendJson(res, 200, status);
      });

      server.middlewares.use("/__sim-run", async (req, res) => {
        if (req.method !== "POST") return sendJson(res, 405, { ok: false, problems: ["method not allowed"] });
        if (!bfSaveOriginOk(req)) return sendJson(res, 403, { ok: false, problems: ["forbidden origin"] });
        const body = await readJsonBody(req, res, 65_536);
        if (body == null) return;
        let payload;
        try { payload = JSON.parse(body); } catch {
          return sendJson(res, 400, { ok: false, problems: ["invalid JSON"] });
        }
        const { problems, config } = validateSimRunBody(payload);
        if (problems.length) return sendJson(res, 400, { ok: false, problems });
        const status = readSimStatus();
        if (processAlive(activeSimPid) || (status.running && processAlive(status.pid))) {
          return sendJson(res, 409, { ok: false, problems: ["simulation already running"] });
        }
        const args = [
          resolve("tools/sim/runner.mjs"),
          "--mode", config.mode,
          "--seed", String(config.seed),
          "--policy", config.policy,
          "--workers", String(config.workers),
          "--label", config.label,
        ];
        if (config.mode === "cycle") {
          args.push("--cycles", String(config.cycles), "--max-rounds", String(config.maxRounds));
          if (config.target) args.push("--target", config.target);
        } else {
          args.push("--runs", String(config.runs), "--profile", config.profile);
        }
        try {
          const child = spawn(process.execPath, args, {
            cwd: resolve("."),
            detached: true,
            shell: false,
            stdio: "ignore",
          });
          activeSimPid = child.pid;
          activeSimConfig = { ...config };
          child.once("exit", () => {
            if (activeSimPid !== child.pid) return;
            activeSimPid = null;
            activeSimConfig = null;
          });
          child.unref();
          return sendJson(res, 202, { ok: true, pid: child.pid, config });
        } catch (error) {
          activeSimPid = null;
          activeSimConfig = null;
          return sendJson(res, 500, { ok: false, problems: [String(error?.message ?? error)] });
        }
      });

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
          res.end(JSON.stringify({ ok: true, hot: true }));
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

      // ?contentedit=1 → POST /__content-save writes core mechanics + English locale domains
      server.middlewares.use("/__content-save", async (req, res) => {
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
          const [
            contentSerialize,
            { definePack },
            {
              defineContentRegistration, withContentRegistration,
              compileContentRegistrations, doctorContentRegistrations,
            },
            { CONTENT_REGISTRATION_MANIFEST },
            { createCoreAuthoring },
            englishCatalogue,
          ] = await Promise.all([
            import("./src/dev/content-serialize.js"),
            import("./src/registry.js"),
            import("./src/content-registration.js"),
            import("./src/packs/compiled/development.js"),
            import("./src/packs/core/index.js"),
            import("./src/i18n/en/content.js"),
          ]);
          const payload = JSON.parse(body);
          const root = resolve(".");
          const result = await contentSerialize.runContentSaveTransaction(payload, {
            root,
            readFileSync,
            writeFileSync,
            renameSync,
            unlinkSync,
            importModule: async (filePath) => {
              const href = `${pathToFileURL(filePath).href}?content-save=${Date.now()}-${Math.random()}`;
              return import(href);
            },
            definePack,
            defineContentRegistration,
            withContentRegistration,
            compileContentRegistrations,
            doctorContentRegistrations,
            developmentManifest: CONTENT_REGISTRATION_MANIFEST,
            createCoreAuthoring,
            englishCatalogue,
          });
          if (!result.ok) {
            res.statusCode = result.status || 400;
            return res.end(JSON.stringify({ ok: false, problems: result.problems || ["save failed"] }));
          }
          const { DOMAIN_MECHANICS_PATH, DOMAIN_LOCALE_PATH } = contentSerialize;
          if (result.wrote?.mechanics) {
            const mechPath = resolve(DOMAIN_MECHANICS_PATH[payload.domain]);
            const mods = server.moduleGraph.getModulesByFile(mechPath);
            if (mods) for (const m of mods) server.moduleGraph.invalidateModule(m);
          }
          if (result.wrote?.locale) {
            const locPath = resolve(DOMAIN_LOCALE_PATH[payload.domain]);
            const mods = server.moduleGraph.getModulesByFile(locPath);
            if (mods) for (const m of mods) server.moduleGraph.invalidateModule(m);
          }
          res.end(JSON.stringify({ ok: true, wrote: result.wrote, reload: false }));
        } catch (e) {
          res.statusCode = 500;
          res.end(JSON.stringify({ ok: false, problems: [String(e?.message ?? e)] }));
        }
      });
    },
  };
}

function spirePackageVersion() {
  try {
    return JSON.parse(readFileSync(resolve("package.json"), "utf8")).version || "0.0.0";
  } catch {
    return "0.0.0";
  }
}

function spireGitSha() {
  try {
    return execSync("git rev-parse --short HEAD", {
      cwd: resolve("."),
      stdio: ["ignore", "pipe", "ignore"],
      encoding: "utf8",
    }).trim() || "unknown";
  } catch {
    return "unknown";
  }
}

// Live git SHA in a production bundle breaks the CI "committed dist is
// current" check: the SHA baked before `git commit` never matches HEAD after.
// Dev (`vite` serve) always embeds the real short SHA; `vite build` keeps a
// stable placeholder unless SPIRE_EMBED_SHA=1 (local +sha smoke only).
export default defineConfig(({ command }) => {
  const SPIRE_VERSION = spirePackageVersion();
  const SPIRE_RELEASE = process.env.SPIRE_RELEASE === "1";
  const embedSha = command === "serve" || process.env.SPIRE_EMBED_SHA === "1";
  const SPIRE_GIT_SHA = embedSha ? spireGitSha() : "unknown";
  return {
    plugins: [bfSavePlugin()],
    define: {
      __SPIRE_VERSION__: JSON.stringify(SPIRE_VERSION),
      __SPIRE_GIT_SHA__: JSON.stringify(SPIRE_GIT_SHA),
      __SPIRE_RELEASE__: JSON.stringify(SPIRE_RELEASE),
    },
    server: {
      host: "0.0.0.0",
      port: BF_SAVE_PORT,
      allowedHosts: DEV_ALLOWED_HOSTS,
      // Under the strict-port e2e server (SPIREBOUND_E2E_PORT set), don't HMR-restart
      // on the editor-written source files the bfeditor/bfuieditor disk tests Save —
      // the tests reload the page and only need the on-disk change, and the HMR
      // restart was racing their 90s timeout on slow CI runners (aux-lane flake).
      // Normal `npm run dev` (no SPIREBOUND_E2E_PORT) keeps full HMR for the editors.
      // Vite merges server.watch.ignored with its defaults (node_modules/.git stay ignored).
      ...(process.env.SPIREBOUND_E2E_PORT ? {
        watch: { ignored: [/src[\\/]battlefield-layout\.js$/, /src[\\/]char-meta\.js$/, /src[\\/]ui-chrome-layout\.js$/] },
      } : {}),
    },
  };
});
