// Test Impact Analysis — select the smallest safe local verification set for
// the current git diff. Specs drive the browser and do not import src modules,
// so e2e selection uses a curated touchpoint map (CHANGED files only) plus a
// static import-graph reverse closure over src/**/*.js (rule (b) cores only).
//
//   node tools/affected-specs.mjs [--base <ref>] [--list] [--run] [--watch]
//
// Default base: origin/main. --list prints one command per line; --run executes
// the plan (npm test first if selected, then one desktop Playwright invocation).
// --watch (with --run) fs.watch()s src/ + test/, debounces ~300ms, and re-runs
// the plan for each burst (plain `npm test` when the engine rule fires).
// --watch and --list are mutually exclusive. Unmapped or out-of-scope files
// print FULL SUITE REQUIRED and --run exits 2.

import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync, watch } from 'node:fs';
import { dirname, join, normalize, relative, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/** Core engine / content owners — always pull the Node suite + battle/stage. */
export const ENGINE_CORE_RE = /^(?:src\/(?:engine|data|content|registry|content-registration|vigil)\.js|src\/packs(?:\/|$))/;

/**
 * Curated module-prefix → e2e specs. Longest prefix wins.
 * Derived from src/ layout + test/e2e/*.spec.js headers (not guessed).
 * Every top-level src module/dir must appear; gaps fall through to FULL SUITE.
 */
export const TOUCHPOINT_MAP = Object.freeze([
  // --- screens (specific before src/ui/) ---
  ['src/ui/screens/reward', ['test/e2e/rewards.spec.js']],
  ['src/ui/screens/shop', ['test/e2e/rewards.spec.js']],
  ['src/ui/screens/event', ['test/e2e/rewards.spec.js']],
  ['src/ui/screens/rest', ['test/e2e/rewards.spec.js', 'test/e2e/stage.spec.js']],
  ['src/ui/screens/lamplighter', ['test/e2e/hollow-transaction.spec.js']],
  ['src/ui/screens/end', ['test/e2e/end-ceremony.spec.js', 'test/e2e/emberglass.spec.js']],
  ['src/ui/screens/embark', ['test/e2e/production-profile.spec.js', 'test/e2e/p6-screens.spec.js']],
  ['src/ui/screens/title', ['test/e2e/production-profile.spec.js', 'test/e2e/p6-screens.spec.js']],
  ['src/ui/screens/vigil', ['test/e2e/emberglass.spec.js', 'test/e2e/emberglass-persistence.spec.js', 'test/e2e/p6-screens.spec.js']],
  ['src/ui/screens/map', ['test/e2e/stage.spec.js', 'test/e2e/visual.spec.js']],
  ['src/ui/screens/audio-gallery', ['test/e2e/audio.spec.js']],
  ['src/ui/screens/gallery', ['test/e2e/dev-tools.spec.js']],
  ['src/ui/screens/run', ['test/e2e/emberglass.spec.js', 'test/e2e/end-ceremony.spec.js']],

  // --- ui subsystem modules ---
  // trace-production.spec.js is testIgnore'd in the main config (own config +
  // vite build) — it stays a CI-full concern, not part of the seconds loop.
  ['src/ui/behaviour-trace', ['test/e2e/trace.spec.js']],
  ['src/ui/cardface', ['test/e2e/cardface.spec.js', 'test/e2e/contrast.spec.js', 'test/e2e/leak.spec.js']],
  ['src/ui/pixi-app', ['test/e2e/pixi.spec.js']],
  ['src/ui/combat-gl', ['test/e2e/pixi.spec.js', 'test/e2e/battle.spec.js', 'test/e2e/leak.spec.js']],
  ['src/ui/combat-presentation', ['test/e2e/presentation.spec.js']],
  ['src/ui/presentation', ['test/e2e/presentation.spec.js']],
  ['src/ui/pointer', ['test/e2e/input-router.spec.js']],
  ['src/ui/hand-layout', ['test/e2e/input-router.spec.js', 'test/e2e/cardface.spec.js']],
  ['src/ui/screen-layout-projection', ['test/e2e/p6-layout-projection.spec.js']],
  ['src/ui/tokens', ['test/e2e/contrast.spec.js']],
  ['src/ui/combat', ['test/e2e/battle.spec.js', 'test/e2e/input-router.spec.js']],
  ['src/ui/drain', ['test/e2e/battle.spec.js', 'test/e2e/presentation.spec.js']],
  ['src/ui/probe', ['test/e2e/battle.spec.js', 'test/e2e/geometry.spec.js']],
  ['src/ui/overlay', ['test/e2e/rewards.spec.js', 'test/e2e/battle.spec.js']],
  ['src/ui/run-effects', ['test/e2e/emberglass.spec.js', 'test/e2e/end-ceremony.spec.js']],
  ['src/ui/rose', ['test/e2e/emberglass.spec.js']],
  ['src/ui/navigation', ['test/e2e/p6-screens.spec.js', 'test/e2e/production-profile.spec.js']],
  ['src/ui/fonts', ['test/e2e/p6-screens.spec.js', 'test/e2e/contrast.spec.js']],
  ['src/ui/shipfront-assets', ['test/e2e/visual.spec.js']],
  ['src/ui/assets', ['test/e2e/visual.spec.js']],
  ['src/ui/content', ['test/e2e/content-context.spec.js']],
  ['src/ui/context', ['test/e2e/production-profile.spec.js', 'test/e2e/p6-screens.spec.js']],
  ['src/ui/commands', ['test/e2e/battle.spec.js', 'test/e2e/input-router.spec.js']],
  ['src/ui/policy', ['test/e2e/battle.spec.js']],
  ['src/ui/format', ['test/e2e/p6-screens.spec.js']],
  ['src/ui/tooltip', ['test/e2e/battle.spec.js']],
  ['src/ui/tween', ['test/e2e/presentation.spec.js']],
  ['src/ui/widgets', ['test/e2e/geometry.spec.js', 'test/e2e/battle.spec.js']],
  ['src/ui/index', ['test/e2e/battle.spec.js', 'test/e2e/stage.spec.js', 'test/e2e/p6-screens.spec.js']],
  ['src/ui/', ['test/e2e/battle.spec.js', 'test/e2e/stage.spec.js', 'test/e2e/p6-screens.spec.js']],
  ['src/ui.js', ['test/e2e/battle.spec.js', 'test/e2e/stage.spec.js', 'test/e2e/p6-screens.spec.js']],

  // --- dev tooling ---
  ['src/dev/content-manager', ['test/e2e/content-manager.spec.js', 'test/e2e/dev-tools.spec.js']],
  ['src/dev/content-serialize', ['test/e2e/content-manager.spec.js']],
  ['src/dev/lab', ['test/e2e/lab.spec.js']],
  ['src/dev/sim-lab', ['test/e2e/sim-lab.spec.js']],
  ['src/dev/bf-', ['test/e2e/bfeditor.spec.js']],
  ['src/dev/bfui-', ['test/e2e/bfuieditor.spec.js']],
  ['src/dev/char-', ['test/e2e/bfeditor.spec.js', 'test/e2e/dev-tools.spec.js']],
  ['src/dev/vfx-', ['test/e2e/dev-tools.spec.js', 'test/e2e/geometry.spec.js']],
  ['src/dev/audio-selection', ['test/e2e/audio.spec.js']],
  ['src/dev/', ['test/e2e/dev-tools.spec.js', 'test/e2e/lab.spec.js', 'test/e2e/sim-lab.spec.js']],

  // --- audio / music ---
  ['src/audio', ['test/e2e/audio.spec.js']],
  ['src/music', ['test/e2e/audio.spec.js', 'test/e2e/trace.spec.js']],

  // --- battlefield / chrome editors ---
  ['src/battlefield', ['test/e2e/bfeditor.spec.js', 'test/e2e/battle.spec.js', 'test/e2e/geometry.spec.js']],
  ['src/char-meta', ['test/e2e/bfeditor.spec.js', 'test/e2e/geometry.spec.js']],
  ['src/ui-chrome', ['test/e2e/bfuieditor.spec.js']],
  ['src/uic.js', ['test/e2e/bfuieditor.spec.js']],

  // --- stage / 3d / vfx / mesh ---
  ['src/scene3d.js', ['test/e2e/geometry.spec.js', 'test/e2e/visual.spec.js']],
  ['src/vfx.js', ['test/e2e/geometry.spec.js', 'test/e2e/visual.spec.js']],
  ['src/mesh.js', ['test/e2e/geometry.spec.js', 'test/e2e/visual.spec.js', 'test/e2e/battle.spec.js']],
  ['src/stage.js', ['test/e2e/geometry.spec.js', 'test/e2e/stage.spec.js', 'test/e2e/visual.spec.js']],
  ['src/ward-params', ['test/e2e/geometry.spec.js', 'test/e2e/visual.spec.js']],

  // --- presentation / lifecycle / theme ---
  ['src/pile-chrome', ['test/e2e/presentation.spec.js']],
  ['src/presentation-catalog', ['test/e2e/presentation.spec.js', 'test/e2e/content-context.spec.js']],
  ['src/theme-atmosphere', ['test/e2e/theme-profile.spec.js']],
  ['src/run-lifecycle', ['test/e2e/emberglass.spec.js', 'test/e2e/end-ceremony.spec.js']],
  ['src/choice-latch', ['test/e2e/rewards.spec.js']],

  // --- content adjacency (rule b covers cores via impact; map direct hits) ---
  ['src/content-protocol', ['test/e2e/battle.spec.js', 'test/e2e/stage.spec.js']],
  ['src/content-resources', ['test/e2e/content-context.spec.js', 'test/e2e/content-manager.spec.js']],
  ['src/content-registration', ['test/e2e/battle.spec.js', 'test/e2e/stage.spec.js']],
  ['src/content.js', ['test/e2e/battle.spec.js', 'test/e2e/stage.spec.js']],
  ['src/registry.js', ['test/e2e/battle.spec.js', 'test/e2e/stage.spec.js']],
  ['src/data.js', ['test/e2e/battle.spec.js', 'test/e2e/stage.spec.js']],
  ['src/engine.js', ['test/e2e/battle.spec.js', 'test/e2e/stage.spec.js']],
  ['src/vigil.js', ['test/e2e/emberglass.spec.js', 'test/e2e/battle.spec.js', 'test/e2e/stage.spec.js']],
  ['src/packs/', ['test/e2e/battle.spec.js', 'test/e2e/stage.spec.js', 'test/e2e/content-context.spec.js']],

  // --- art / assets / styles / i18n / entry ---
  ['src/art.js', ['test/e2e/contrast.spec.js', 'test/e2e/visual.spec.js']],
  ['src/assets-legacy', ['test/e2e/visual.spec.js']],
  ['src/assets/', ['test/e2e/visual.spec.js']],
  ['src/styles.css', ['test/e2e/visual.spec.js', 'test/e2e/p6-screens.spec.js', 'test/e2e/contrast.spec.js']],
  ['src/styles/', ['test/e2e/visual.spec.js', 'test/e2e/p6-screens.spec.js', 'test/e2e/contrast.spec.js']],
  ['src/i18n/', ['test/e2e/content-manager.spec.js', 'test/e2e/p6-screens.spec.js']],
  ['src/main.js', ['test/e2e/stage.spec.js', 'test/e2e/production-profile.spec.js', 'test/e2e/pixi.spec.js']],
  ['src/version.js', ['test/e2e/production-profile.spec.js', 'test/e2e/p6-screens.spec.js']],
]);

const IMPORT_FROM_RE = /(?:^|\n)\s*(?:import\s+(?:type\s+)?(?:[^'"\n]*?\s+from\s+)?|export\s+(?:type\s+)?[^'"\n]*?\s+from\s+)['"](\.[^'"]+)['"]/g;
const SIDE_EFFECT_IMPORT_RE = /(?:^|\n)\s*import\s+['"](\.[^'"]+)['"]/g;

const toPosix = (p) => p.split(sep).join('/');

/** List every JS file under src/ as repo-relative posix paths. */
export function listSrcJsFiles(root = REPO_ROOT) {
  const out = [];
  const walk = (absDir) => {
    for (const name of readdirSync(absDir)) {
      if (name === 'node_modules' || name === 'dist') continue;
      const abs = join(absDir, name);
      const st = statSync(abs);
      if (st.isDirectory()) walk(abs);
      else if (name.endsWith('.js')) out.push(toPosix(relative(root, abs)));
    }
  };
  walk(join(root, 'src'));
  return out.sort();
}

/** Resolve a relative specifier from an importer to a repo-relative .js path. */
export function resolveSpecifier(importer, specifier, { fileExists = existsSync, root = REPO_ROOT } = {}) {
  if (!specifier.startsWith('.')) return null;
  const importerAbs = resolve(root, importer);
  let abs = normalize(resolve(dirname(importerAbs), specifier));
  const candidates = [];
  if (abs.endsWith('.js')) candidates.push(abs);
  else {
    candidates.push(`${abs}.js`, join(abs, 'index.js'));
  }
  for (const cand of candidates) {
    if (fileExists(cand)) {
      let rel = toPosix(relative(root, cand));
      // Stable re-export: src/ui.js → src/ui/index.js (already an edge when parsed;
      // also accept either form as the same module id for lookups).
      return rel;
    }
  }
  return null;
}

function parseImportSpecifiers(source) {
  const specs = new Set();
  for (const re of [IMPORT_FROM_RE, SIDE_EFFECT_IMPORT_RE]) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(source))) specs.add(m[1]);
  }
  return [...specs];
}

/**
 * Static import graph over every JS module under src/.
 * @returns {{ forward: Map<string, Set<string>>, reverse: Map<string, Set<string>>, nodes: string[] }}
 */
export function buildImportGraph({
  root = REPO_ROOT,
  files = null,
  readFile = (p) => readFileSync(join(root, p), 'utf8'),
  fileExists = (abs) => existsSync(abs),
} = {}) {
  const nodes = files ?? listSrcJsFiles(root);
  const forward = new Map(nodes.map((n) => [n, new Set()]));
  const reverse = new Map(nodes.map((n) => [n, new Set()]));

  const ensure = (map, key) => {
    if (!map.has(key)) map.set(key, new Set());
    return map.get(key);
  };

  for (const file of nodes) {
    let source;
    try {
      source = readFile(file);
    } catch {
      continue;
    }
    for (const spec of parseImportSpecifiers(source)) {
      const resolved = resolveSpecifier(file, spec, { fileExists, root });
      if (!resolved || !resolved.startsWith('src/')) continue;
      ensure(forward, file).add(resolved);
      ensure(reverse, resolved).add(file);
      ensure(forward, resolved);
      ensure(reverse, file);
    }
  }

  // Explicit ui.js → ui/index.js link if the re-export parse missed somehow.
  if (forward.has('src/ui.js') && forward.has('src/ui/index.js')) {
    forward.get('src/ui.js').add('src/ui/index.js');
    reverse.get('src/ui/index.js').add('src/ui.js');
  }

  return { forward, reverse, nodes };
}

/** Reverse-transitive closure: seeds + every module that transitively imports them. */
export function impactSet(seeds, reverse) {
  const out = new Set();
  const queue = [];
  for (const seed of seeds) {
    if (!out.has(seed)) {
      out.add(seed);
      queue.push(seed);
    }
  }
  while (queue.length) {
    const cur = queue.shift();
    for (const importer of reverse.get(cur) ?? []) {
      if (out.has(importer)) continue;
      out.add(importer);
      queue.push(importer);
    }
  }
  return out;
}

/** Longest-prefix touchpoint match. */
export function matchTouchpoints(file, map = TOUCHPOINT_MAP) {
  let best = null;
  let bestLen = -1;
  for (const [prefix, specs] of map) {
    if (file === prefix || file.startsWith(prefix)) {
      if (prefix.length > bestLen) {
        best = specs;
        bestLen = prefix.length;
      }
    }
  }
  return best;
}

function isE2eSpec(file) {
  return /^test\/e2e\/[^/]+\.spec\.js$/.test(file);
}

function isUnitTestFile(file) {
  return /^test\/test_[^/]+\.(js|mjs)$/.test(file);
}

function isTestHelper(file) {
  if (!file.startsWith('test/')) return false;
  if (isE2eSpec(file) || isUnitTestFile(file)) return false;
  return true;
}

function isSrcOrTest(file) {
  return file.startsWith('src/') || file.startsWith('test/');
}

/** Docs / prose outside src+test — ignored (do not expand or FULL). */
function isIgnorableOutside(file) {
  if (isSrcOrTest(file)) return false;
  if (file.startsWith('docs/')) return true;
  if (/\.(md|mdc)$/i.test(file)) return true;
  if (file === 'LICENSE' || file === 'CLAUDE.md' || file === 'AGENTS.md') return true;
  return false;
}

/**
 * Build a verification plan from changed paths + import graph.
 *
 * Rules (a) test files, (c) curated touchpoints, and (d) FULL SUITE fallback
 * apply to CHANGED files only. The import-graph impact set feeds rule (b)
 * alone: any file in changed ∪ impact matching ENGINE_CORE_RE pulls npm test
 * + battle + stage. Impacted-only modules must not fire the curated map or
 * FULL SUITE — otherwise composition roots (ui/index, main) cascade on every
 * localized src edit.
 *
 * @returns {{
 *   npmTest: boolean,
 *   testCi: boolean,
 *   specs: string[],
 *   fullSuiteFor: string|null,
 *   commands: string[],
 *   impact: string[],
 * }}
 */
export function selectPlan(changedFiles, {
  graph = null,
  touchpoints = TOUCHPOINT_MAP,
  root = REPO_ROOT,
} = {}) {
  const changed = [...new Set(changedFiles.map(toPosix).filter(Boolean))].sort();
  const g = graph ?? buildImportGraph({ root });
  const srcSeeds = changed.filter((f) => f.startsWith('src/') && f.endsWith('.js'));
  // Only .js seeds participate in the import-graph closure.
  const impact = impactSet(srcSeeds, g.reverse);

  let npmTest = false;
  let testCi = false;
  const specs = new Set();
  let fullSuiteFor = null;

  const markFull = (file) => {
    if (!fullSuiteFor) fullSuiteFor = file;
  };

  // (b) engine / content core — changed ∪ impact
  for (const file of new Set([...changed, ...impact])) {
    if (ENGINE_CORE_RE.test(file)) {
      npmTest = true;
      specs.add('test/e2e/battle.spec.js');
      specs.add('test/e2e/stage.spec.js');
    }
  }

  // (a), (c), (d) — CHANGED files only
  for (const file of changed) {
    if (isIgnorableOutside(file)) continue;

    let matched = false;

    // (a) test files
    if (isE2eSpec(file)) {
      specs.add(file);
      matched = true;
    } else if (isUnitTestFile(file) || isTestHelper(file)) {
      npmTest = true;
      testCi = true;
      matched = true;
    }

    // (b) also counts as matched on a direct edit (already applied above)
    if (ENGINE_CORE_RE.test(file)) {
      matched = true;
    }

    // (c) curated touchpoints
    const tp = matchTouchpoints(file, touchpoints);
    if (tp) {
      for (const s of tp) specs.add(s);
      matched = true;
    }

    // (d) nothing matched → full suite (never silently under-select)
    if (!matched) {
      markFull(file);
    }
  }

  // Empty diff (or only ignorable docs) → empty plan (not a full suite).
  const actionable = changed.filter((f) => !isIgnorableOutside(f));
  if (actionable.length === 0) {
    return {
      npmTest: false,
      testCi: false,
      specs: [],
      fullSuiteFor: null,
      commands: [],
      impact: [...impact].sort(),
    };
  }

  if (fullSuiteFor) {
    return {
      npmTest: false,
      testCi: false,
      specs: [],
      fullSuiteFor,
      commands: [`FULL SUITE REQUIRED (${fullSuiteFor})`],
      impact: [...impact].sort(),
    };
  }

  const orderedSpecs = [...specs].sort();
  const commands = [];
  if (npmTest) commands.push('npm test');
  if (testCi) commands.push('npm run test:ci');
  if (orderedSpecs.length) {
    commands.push(
      `npx playwright test ${orderedSpecs.join(' ')} --project=desktop --no-deps`,
    );
  }

  return {
    npmTest,
    testCi,
    specs: orderedSpecs,
    fullSuiteFor: null,
    commands,
    impact: [...impact].sort(),
  };
}

export function collectChangedFiles({
  base = 'origin/main',
  cwd = REPO_ROOT,
  git = (args) => spawnSync('git', args, { cwd, encoding: 'utf8' }),
} = {}) {
  const lines = (result) => {
    if (result.status !== 0 && result.status != null) {
      // Missing base ref still allows working-tree diffs; surface stderr only
      // when both branch and tree queries fail later.
    }
    return (result.stdout || '').split('\n').map((l) => l.trim()).filter(Boolean);
  };
  const files = new Set([
    ...lines(git(['diff', '--name-only', `${base}...HEAD`])),
    ...lines(git(['diff', '--name-only', 'HEAD'])),
    ...lines(git(['ls-files', '--others', '--exclude-standard'])),
  ]);
  return [...files].map(toPosix).sort();
}

export function formatPlan(plan) {
  return `${plan.commands.join('\n')}${plan.commands.length ? '\n' : ''}`;
}

export function runPlan(plan, {
  cwd = REPO_ROOT,
  spawn = spawnSync,
  env = process.env,
} = {}) {
  if (plan.fullSuiteFor) {
    process.stderr.write(`${formatPlan(plan)}`);
    return 2;
  }
  let status = 0;
  if (plan.npmTest) {
    process.stdout.write('> npm test\n');
    const child = spawn('npm', ['test'], { cwd, env, shell: false, stdio: 'inherit' });
    status = Math.max(status, Number.isInteger(child?.status) ? child.status : 1);
    if (status !== 0) return status;
  }
  if (plan.testCi) {
    process.stdout.write('> npm run test:ci\n');
    const child = spawn('npm', ['run', 'test:ci'], { cwd, env, shell: false, stdio: 'inherit' });
    status = Math.max(status, Number.isInteger(child?.status) ? child.status : 1);
    if (status !== 0) return status;
  }
  if (plan.specs.length) {
    const args = ['playwright', 'test', ...plan.specs, '--project=desktop', '--no-deps'];
    process.stdout.write(`> npx ${args.join(' ')}\n`);
    const child = spawn('npx', args, { cwd, env, shell: false, stdio: 'inherit' });
    status = Math.max(status, Number.isInteger(child?.status) ? child.status : 1);
  }
  return status;
}

const WATCH_IGNORE_RE = /(?:^|\/)(?:test-results|dist|node_modules|\.git)(?:\/|$)/;
const WATCH_DEBOUNCE_MS = 300;

/** True when a watch event path should be ignored. */
export function isWatchIgnored(relPath) {
  return WATCH_IGNORE_RE.test(toPosix(relPath));
}

/**
 * Continuous loop: watch src/ + test/, debounce bursts, select+run plan.
 * Returns a handle with close() for tests; CLI keeps the process alive.
 */
export function startWatch({
  cwd = REPO_ROOT,
  debounceMs = WATCH_DEBOUNCE_MS,
  onCycle = null,
  spawn = spawnSync,
  env = process.env,
  watchFn = watch,
} = {}) {
  let timer = null;
  let pending = new Set();
  let running = false;
  let queued = null;
  const watchers = [];

  const summarise = (files, plan, ms, status) => {
    const n = files.length;
    const label = plan.fullSuiteFor
      ? `FULL SUITE (${plan.fullSuiteFor})`
      : (plan.commands.length ? plan.commands.join(' && ') : 'nothing');
    return `watch: ${n} file${n === 1 ? '' : 's'} → ${label} (${(ms / 1000).toFixed(1)}s, exit ${status})`;
  };

  const runBurst = (files) => {
    const sorted = [...files].sort();
    const plan = selectPlan(sorted, { root: cwd });
    const t0 = Date.now();
    const status = runPlan(plan, { cwd, spawn, env });
    const ms = Date.now() - t0;
    const line = summarise(sorted, plan, ms, status);
    process.stdout.write(`${line}\n`);
    if (onCycle) onCycle({ files: sorted, plan, ms, status, line });
    return status;
  };

  const flush = () => {
    timer = null;
    const files = pending;
    pending = new Set();
    if (!files.size) return;
    if (running) {
      queued = new Set([...(queued || []), ...files]);
      return;
    }
    running = true;
    try {
      runBurst(files);
    } finally {
      running = false;
      if (queued?.size) {
        pending = new Set([...pending, ...queued]);
        queued = null;
        timer = setTimeout(flush, debounceMs);
      }
    }
  };

  const onEvent = (dirLabel, filename) => {
    if (!filename) return;
    const rel = toPosix(join(dirLabel, filename));
    if (isWatchIgnored(rel)) return;
    if (!rel.startsWith('src/') && !rel.startsWith('test/')) return;
    pending.add(rel);
    if (timer) clearTimeout(timer);
    timer = setTimeout(flush, debounceMs);
  };

  for (const dir of ['src', 'test']) {
    const abs = join(cwd, dir);
    if (!existsSync(abs)) continue;
    watchers.push(watchFn(abs, { recursive: true }, (_event, filename) => {
      onEvent(dir, filename == null ? '' : String(filename));
    }));
  }

  process.stdout.write(`watching src/ + test/ (debounce ${debounceMs}ms); Ctrl-C to exit\n`);

  return {
    close() {
      if (timer) clearTimeout(timer);
      for (const w of watchers) {
        try { w.close(); } catch { /* ignore */ }
      }
    },
  };
}

function parseArgs(argv) {
  let base = 'origin/main';
  let list = false;
  let run = false;
  let watchMode = false;
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--base') {
      base = argv[++i];
      if (!base) throw new Error('--base requires a ref');
    } else if (a === '--list') list = true;
    else if (a === '--run') run = true;
    else if (a === '--watch') watchMode = true;
    else if (a === '--help' || a === '-h') {
      throw new Error('Usage: node tools/affected-specs.mjs [--base <ref>] [--list | --run [--watch]]');
    } else {
      throw new Error(`Unknown arg ${a}\nUsage: node tools/affected-specs.mjs [--base <ref>] [--list | --run [--watch]]`);
    }
  }
  if (watchMode && list) {
    throw new Error('--watch and --list are mutually exclusive');
  }
  if (watchMode && !run) {
    throw new Error('--watch requires --run');
  }
  return { base, list, run, watchMode };
}

function runCli(argv = process.argv.slice(2)) {
  const { base, list, run, watchMode } = parseArgs(argv);
  if (watchMode) {
    startWatch();
    return;
  }
  const changed = collectChangedFiles({ base });
  const plan = selectPlan(changed);
  if (run) {
    if (list) process.stdout.write(formatPlan(plan));
    process.exitCode = runPlan(plan);
    return;
  }
  process.stdout.write(formatPlan(plan));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    runCli();
  } catch (err) {
    process.stderr.write(`${err.message || err}\n`);
    process.exitCode = 1;
  }
}
