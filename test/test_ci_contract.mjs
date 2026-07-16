import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import {
  resolveCiMode,
  requiredCiLanes,
  verifyCiGate,
  isRound5StandingRef,
  FULL_E2E_LANES,
} from '../tools/ci-contract.mjs';
import {
  buildSlices,
  partitionSlices,
  bucketInvocations,
  flattenReportTests,
  mergeRecordedTimings,
  loadTimings,
  SLICE_TARGET_SECONDS,
  FALLBACK_TEST_SECONDS,
  POOL_PROJECTS,
} from '../tools/e2e-shard.mjs';
import { e2eServerSettings } from '../playwright-server.js';
import { STANDING_GATE_PROFILES } from '../tools/run-round5-standing-gates.mjs';

assert.equal(isRound5StandingRef('jamesto/round5-production-engineering-continuation'), true);
assert.equal(isRound5StandingRef('cursor/round5-foo'), true);
assert.equal(isRound5StandingRef('cursor/entrance-progressive-delivery-0e31'), false);
assert.equal(isRound5StandingRef('main'), false);

assert.equal(resolveCiMode('push', ''), 'full');
assert.equal(resolveCiMode('push', '', 'main'), 'full');
assert.equal(resolveCiMode('pull_request', true), 'smoke');
assert.equal(resolveCiMode('pull_request', true, 'feature/x'), 'smoke');
assert.equal(resolveCiMode('pull_request', 'true'), 'smoke');
assert.equal(resolveCiMode('pull_request', true, 'jamesto/round5-production-engineering-continuation'), 'p2-base');
assert.equal(resolveCiMode('pull_request', false, 'jamesto/round5-x'), 'full');
assert.equal(resolveCiMode('pull_request', false), 'full');
assert.equal(resolveCiMode('pull_request', 'false'), 'full');
assert.throws(() => resolveCiMode('workflow_dispatch', false), /Unsupported CI event/);

assert.deepEqual(FULL_E2E_LANES, [
  'changes', 'e2e-aux', 'e2e-random', 'e2e-pool',
  'e2e-webkit', 'e2e-leak', 'e2e-visual',
]);

assert.deepEqual(requiredCiLanes('unit', false, 'smoke'), ['changes']);
assert.deepEqual(requiredCiLanes('unit', true, 'smoke'), ['changes', 'unit-tests', 'build-dist']);
assert.deepEqual(requiredCiLanes('e2e', true, 'smoke'), ['changes', 'smoke-e2e']);
assert.deepEqual(requiredCiLanes('e2e', true, 'p2-base'), [
  'changes', 'e2e-aux', 'e2e-random', 'e2e-pool',
]);
assert.deepEqual(requiredCiLanes('p2-base', true, 'p2-base'), [
  'changes', 'unit', 'e2e-nonvisual', 'progression',
]);
assert.deepEqual(requiredCiLanes('p2-base', true, 'full'), [
  'changes', 'unit', 'e2e-nonvisual', 'progression',
]);
assert.deepEqual(requiredCiLanes('p2-base', false, 'p2-base'), ['changes']);
assert.deepEqual(requiredCiLanes('p2-base', false, 'full'), ['changes']);
assert.throws(() => requiredCiLanes('p2-base', true, 'smoke'), /Unsupported p2-base CI mode/);
assert.throws(() => requiredCiLanes('p2-base', false, 'smoke'), /Unsupported p2-base CI mode/);
assert.deepEqual(requiredCiLanes('e2e', true, 'full'), [
  'changes', 'e2e-aux', 'e2e-random', 'e2e-pool',
  'e2e-webkit', 'e2e-leak', 'e2e-visual',
]);

assert.deepEqual(verifyCiGate({
  gate: 'unit', relevant: false, mode: 'smoke', results: { changes: 'success' },
}).required, ['changes']);
assert.deepEqual(verifyCiGate({
  gate: 'e2e', relevant: true, mode: 'smoke',
  results: { changes: 'success', 'smoke-e2e': 'success' },
}).required, ['changes', 'smoke-e2e']);
assert.deepEqual(verifyCiGate({
  gate: 'e2e', relevant: true, mode: 'full',
  results: {
    changes: 'success', 'e2e-aux': 'success', 'e2e-random': 'success',
    'e2e-pool': 'success', 'e2e-webkit': 'success',
    'e2e-leak': 'success', 'e2e-visual': 'success',
  },
}).required.length, 7);
assert.deepEqual(verifyCiGate({
  gate: 'e2e', relevant: true, mode: 'p2-base',
  results: {
    changes: 'success', 'e2e-aux': 'success', 'e2e-random': 'success',
    'e2e-pool': 'success',
  },
}).required, ['changes', 'e2e-aux', 'e2e-random', 'e2e-pool']);
assert.throws(() => verifyCiGate({
  gate: 'e2e', relevant: true, mode: 'p2-base',
  results: { changes: 'success', 'e2e-aux': 'success', 'e2e-random': 'success' },
}), /e2e-pool=missing/);
assert.deepEqual(verifyCiGate({
  gate: 'p2-base', relevant: true, mode: 'p2-base',
  results: {
    changes: 'success', unit: 'success', 'e2e-nonvisual': 'success', progression: 'success',
  },
}).required, ['changes', 'unit', 'e2e-nonvisual', 'progression']);
assert.deepEqual(verifyCiGate({
  gate: 'p2-base', relevant: true, mode: 'full',
  results: {
    changes: 'success', unit: 'success', 'e2e-nonvisual': 'success', progression: 'success',
  },
}).required, ['changes', 'unit', 'e2e-nonvisual', 'progression']);
assert.throws(() => verifyCiGate({
  gate: 'p2-base', relevant: true, mode: 'smoke',
  results: { changes: 'success' },
}), /Unsupported p2-base CI mode/);
assert.throws(() => verifyCiGate({
  gate: 'p2-base', relevant: false, mode: 'smoke',
  results: { changes: 'success' },
}), /Unsupported p2-base CI mode/);
assert.throws(() => verifyCiGate({
  gate: 'p2-base', relevant: true, mode: 'p2-base',
  results: {
    changes: 'success', unit: 'success', 'e2e-nonvisual': 'success',
  },
}), /progression=missing/);

for (const result of ['failure', 'cancelled', 'skipped', undefined]) {
  assert.throws(() => verifyCiGate({
    gate: 'e2e', relevant: true, mode: 'smoke',
    results: { changes: 'success', 'smoke-e2e': result },
  }), /smoke-e2e/);
}
assert.throws(() => verifyCiGate({
  gate: 'unit', relevant: true, mode: 'full',
  results: { changes: 'success', 'unit-tests': 'success', 'build-dist': 'failure' },
}), /build-dist=failure/);
assert.throws(() => requiredCiLanes('e2e', true, 'unknown'), /Unsupported CI mode/);

// --- pool partitioner: the plan must be deterministic, complete and balanced.

assert.deepEqual(POOL_PROJECTS, ['desktop', 'portrait', 'landscape']);

{
  const counts = new Map([
    ['desktop|test/e2e/big.spec.js', 10],
    ['desktop|test/e2e/small.spec.js', 2],
    ['portrait|test/e2e/small.spec.js', 2],
    ['landscape|test/e2e/new.spec.js', 3],
  ]);
  const timings = {
    'desktop|test/e2e/big.spec.js': SLICE_TARGET_SECONDS * 2.5,
    'desktop|test/e2e/small.spec.js': 40,
    'portrait|test/e2e/small.spec.js': 50,
  };
  const slices = buildSlices(counts, timings);
  const big = slices.filter((s) => s.key === 'desktop|test/e2e/big.spec.js');
  assert.equal(big.length, 3, 'heavy units split into ceil(weight/target) slices');
  assert.ok(big.every((s) => s.slices === 3 && s.weight === (SLICE_TARGET_SECONDS * 2.5) / 3));
  const fallback = slices.find((s) => s.key === 'landscape|test/e2e/new.spec.js');
  assert.equal(fallback.weight, 3 * FALLBACK_TEST_SECONDS, 'unknown units use the per-test fallback');
  assert.equal(fallback.slices, 1);

  const buckets = partitionSlices(slices, 3);
  assert.deepEqual(buckets, partitionSlices(slices, 3), 'partition is deterministic');
  const placed = buckets.flatMap((b) => b.slices.map((s) => `${s.key}#${s.slice}`)).sort();
  const expected = slices.map((s) => `${s.key}#${s.slice}`).sort();
  assert.deepEqual(placed, expected, 'every slice lands in exactly one bucket');
  const weights = buckets.map((b) => b.weight);
  const maxSlice = Math.max(...slices.map((s) => s.weight));
  assert.ok(Math.max(...weights) - Math.min(...weights) <= maxSlice,
    'LPT keeps bucket spread within one slice');

  const invocations = bucketInvocations({
    slices: [
      { key: 'portrait|test/e2e/a.spec.js', project: 'portrait', file: 'test/e2e/a.spec.js', slice: 1, slices: 1, weight: 10 },
      { key: 'desktop|test/e2e/b.spec.js', project: 'desktop', file: 'test/e2e/b.spec.js', slice: 2, slices: 3, weight: 100 },
      { key: 'desktop|test/e2e/a.spec.js', project: 'desktop', file: 'test/e2e/a.spec.js', slice: 1, slices: 1, weight: 10 },
      { key: 'desktop|test/e2e/c.spec.js', project: 'desktop', file: 'test/e2e/c.spec.js', slice: 1, slices: 1, weight: 10 },
    ],
  });
  assert.deepEqual(invocations, [
    { project: 'desktop', files: ['test/e2e/a.spec.js', 'test/e2e/c.spec.js'] },
    { project: 'desktop', files: ['test/e2e/b.spec.js'], shard: '2/3' },
    { project: 'portrait', files: ['test/e2e/a.spec.js'] },
  ], 'whole files batch per project; slices shard inside one file');

  assert.throws(() => partitionSlices(slices, 0), /invalid bucket count/);
}

{
  const report = {
    suites: [{
      file: 'foo.spec.js',
      specs: [{
        file: 'foo.spec.js',
        tests: [
          { projectName: 'desktop', results: [{ duration: 1500 }] },
          { projectName: 'portrait', results: [{ duration: 500 }, { duration: 250 }] },
        ],
      }],
      suites: [{
        file: 'foo.spec.js',
        specs: [{
          file: 'foo.spec.js',
          tests: [{ projectName: 'desktop', results: [{ duration: 2500 }] }],
        }],
      }],
    }],
  };
  const tests = flattenReportTests(report);
  assert.equal(tests.length, 3, 'nested suites flatten fully');
  assert.ok(tests.every((t) => t.file === 'test/e2e/foo.spec.js'), 'testDir-relative files are normalised');
  const merged = mergeRecordedTimings({ 'landscape|test/e2e/foo.spec.js': 9 }, tests);
  assert.deepEqual(merged, {
    'desktop|test/e2e/foo.spec.js': 4,
    'landscape|test/e2e/foo.spec.js': 9,
    'portrait|test/e2e/foo.spec.js': 0.8,
  }, 'recording sums durations per unit and keeps unseen keys');
}

{
  const timings = loadTimings();
  const keys = Object.keys(timings);
  assert.ok(keys.length >= 40, 'seed timings cover the pool');
  for (const key of keys) {
    const [project, file] = key.split('|');
    assert.ok(POOL_PROJECTS.includes(project), `${key} uses a pool project`);
    assert.match(file, /^test\/e2e\/[\w./-]+\.spec\.js$/, `${key} points at a spec file`);
    assert.doesNotMatch(file, /(visual|leak|perf|trace-production)\.spec\.js$/,
      `${key} stays out of the pool peel`);
    assert.ok(Number.isFinite(timings[key]) && timings[key] > 0, `${key} has a positive weight`);
  }
}

const workflow = readFileSync(new URL('../.github/workflows/ci.yml', import.meta.url), 'utf8');
assert.match(workflow, /CI_REF_NAME: \$\{\{ github\.head_ref \|\| github\.ref_name \}\}/);
assert.match(workflow, /name: p2-base/);
assert.match(workflow, /p2-base:[\s\S]*?if: always\(\) && \(needs\.changes\.outputs\.mode == 'full' \|\| needs\.changes\.outputs\.mode == 'p2-base'\)/);
assert.match(workflow, /name: e2e nonvisual/);
assert.match(workflow, /name: progression/);
assert.match(workflow, /name: e2e aux/);
assert.match(workflow, /npm run test:progression/);
assert.match(workflow, /npm run test:e2e:disk/);
assert.match(workflow, /npm run test:e2e:trace-production/);
assert.match(workflow, /npm run test:e2e:serial/);
assert.match(workflow, /\.\/\.github\/actions\/setup-playwright/);
assert.match(workflow, /ffmpeg-n8\.1\.2-22-g94138f6973-linux64-gpl-8\.1/);
assert.match(workflow, /autobuild-2026-07-11-13-13/);
assert.match(workflow, /e2e_slow:/);

assert.match(workflow, /name: e2e pool \$\{\{ matrix\.shard \}\}\/\$\{\{ strategy\.job-total \}\}/);
assert.match(workflow, /node tools\/e2e-shard\.mjs --shard \$\{\{ matrix\.shard \}\}\/\$\{\{ strategy\.job-total \}\}/);
assert.match(workflow, /shard: \[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20\]/);
assert.match(workflow,
  /SPIREBOUND_E2E_SKIP_SLOW: \$\{\{ needs\.changes\.outputs\.e2e_slow == 'true' && '0' \|\| '1' \}\}/,
  'the pool narrows to fast specs when slow suites cannot be affected');
assert.match(workflow, /fail-fast: false/);
assert.doesNotMatch(workflow, /fail-fast: true/,
  'leaves must all finish so one run reports the complete failure list');
assert.doesNotMatch(workflow, /CI_SLOW_RELEVANT/, 'slow relevance narrows the pool, not the lanes');
assert.doesNotMatch(workflow, /e2e_battle|e2e_audio|e2e_heavy|e2e_emberglass|e2e_pixi|e2e_trace|e2e_screens|e2e_lab|e2e_editors|e2e_main|E2E_MAIN_PEEL/,
  'hand-peeled suite lanes must not reappear; rebalance via e2e-shard-timings.json');

assert.match(workflow, /e2e_nonvisual:[\s\S]*?CI_GATE: e2e[\s\S]*?CI_MODE: p2-base/);
assert.match(workflow, /needs: \[changes, e2e_aux, e2e_random, e2e_pool\]/);
assert.match(workflow, /needs: \[changes, smoke_e2e, e2e_aux, e2e_random, e2e_pool, e2e_webkit, e2e_leak, e2e_visual\]/);
assert.match(workflow, /"e2e-pool":"\$\{\{ needs\.e2e_pool\.result \}\}"/);
assert.doesNotMatch(workflow, /name: e2e disk/);
assert.doesNotMatch(workflow, /name: e2e serial/);
assert.doesNotMatch(workflow, /name: e2e trace-production/);

assert.match(workflow, /name: e2e webkit/);
assert.match(workflow, /e2e_webkit:/);
assert.match(workflow, /npm run test:e2e:webkit/);
assert.match(workflow, /"e2e-webkit":"\$\{\{ needs\.e2e_webkit\.result \}\}"/);
assert.match(workflow, /"e2e-leak":"\$\{\{ needs\.e2e_leak\.result \}\}"/);
assert.match(workflow, /name: e2e leak/);
assert.match(workflow, /npm run test:e2e:leak/);
assert.match(workflow, /e2e_leak:/);
assert.match(workflow, /unit_tests:[\s\S]*?npm run test:content-registrations/);
assert.match(workflow, /build_dist:[\s\S]*?node tools\/check-bundle-budget\.mjs/);
assert.match(workflow, /name: unit\b/);
assert.match(workflow, /name: e2e\b/);
assert.doesNotMatch(workflow, /self-hosted/);
assert.doesNotMatch(workflow, /exit.?75|exit-75/i);

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
assert.equal(pkg.scripts['test:budget'], 'node tools/check-bundle-budget.mjs');
assert.equal(pkg.scripts['test:e2e'], 'npm run test:e2e:nonvisual && npm run test:e2e:visual');
assert.equal(pkg.scripts['test:e2e:nonvisual'],
  'npm run test:e2e:disk && npm run test:e2e:random-agent && npm run test:e2e:pool && npm run test:e2e:serial');
assert.equal(
  pkg.scripts['test:e2e:bfuieditor-disk'],
  'playwright test bfuieditor --project=bfuieditor-disk --workers=1',
);
assert.equal(
  pkg.scripts['test:e2e:disk'],
  'playwright test bfeditor --project=bfeditor-disk --workers=1 && node tools/run-with-strict-e2e-port.mjs -- npm run test:e2e:bfuieditor-disk',
);
assert.equal(
  pkg.scripts['test:e2e:pool'],
  'SPIREBOUND_E2E_SUITE=pool playwright test --project=desktop --project=portrait --project=landscape --no-deps --grep-invert "random-agent mini-run|@serial"',
);
for (const removed of [
  'test:e2e:audio', 'test:e2e:battle', 'test:e2e:emberglass', 'test:e2e:pixi',
  'test:e2e:trace', 'test:e2e:screens', 'test:e2e:lab', 'test:e2e:editors',
  'test:e2e:heavy', 'test:e2e:main',
]) {
  assert.equal(pkg.scripts[removed], undefined,
    `${removed} must stay deleted — the pool owns suite balance now`);
}

assert.equal(pkg.scripts['test:boundaries'], 'node test/test_module_boundaries.mjs');
assert.match(pkg.scripts['test:ci'], /npm run test:boundaries/);
assert.equal(pkg.scripts['content:compile'], 'node tools/compile-content-registrations.mjs');
assert.equal(pkg.scripts['test:content-registrations'], 'node tools/compile-content-registrations.mjs --check');
assert.equal(
  pkg.scripts['test:e2e:webkit'],
  'playwright test trace stage lab theme-profile production-profile p6-screens --project=iphone-webkit --project=ipad-webkit --workers=1 --no-deps',
);
assert.equal(
  pkg.scripts['test:e2e:leak'],
  'playwright test leak --project=desktop --project=iphone-webkit --project=ipad-webkit --workers=1 --no-deps',
);
assert.equal(
  pkg.scripts['test:e2e:update'],
  'playwright test visual --update-snapshots --project=desktop --project=portrait --project=landscape --workers=1 --no-deps',
);
assert.match(pkg.scripts['test:e2e:perf:full'] || '', /PERF_TIER=full/);

const playwright = readFileSync(new URL('../playwright.config.js', import.meta.url), 'utf8');
assert.match(playwright, /SPIREBOUND_E2E_SUITE/);
assert.match(playwright, /E2E_POOL_PEEL/);
assert.match(playwright, /visual\|leak\|perf/);
assert.match(playwright, /SPIREBOUND_E2E_SKIP_SLOW/);
assert.match(playwright, /audio\|hollow-transaction\|rewards\|stage/);
assert.doesNotMatch(playwright, /E2E_MAIN_PEEL/,
  'the main peel is retired; the pool covers every nonvisual spec');

assert.match(
  playwright,
  /name:\s*'iphone-webkit',\s*use:\s*\{\s*\.\.\.devices\['iPhone 17 Pro'\],\s*browserName:\s*'webkit'\s*\}/,
);
assert.match(
  playwright,
  /name:\s*'ipad-webkit',\s*use:\s*\{\s*\.\.\.devices\['iPad Mini landscape'\],\s*browserName:\s*'webkit'\s*\}/,
);
assert.match(playwright, /name:\s*'desktop'/);
assert.match(playwright, /name:\s*'portrait'/);
assert.match(playwright, /name:\s*'landscape'/);
assert.match(playwright, /name:\s*'bfeditor-disk'/);
assert.match(playwright, /name:\s*'bfuieditor-disk'/);
assert.match(playwright, /testMatch:\s*\/bfuieditor\\.spec\\.js\//);
assert.doesNotMatch(
  playwright,
  /name:\s*'desktop',\s*dependencies:\s*\[[^\]]*bfuieditor-disk/,
  'bfuieditor-disk must not be a dependency of desktop (nested under test:e2e:disk only)',
);

const strict = e2eServerSettings('59123');
assert.equal(strict.port, 59123);
assert.equal(strict.isolated, true);
assert.equal(strict.origin, 'http://127.0.0.1:59123');
assert.match(strict.command, /--strictPort/);
assert.equal(strict.reuseExistingServer, false);

const setupPlaywright = readFileSync(
  new URL('../.github/actions/setup-playwright/action.yml', import.meta.url),
  'utf8',
);
assert.match(setupPlaywright, /playwright install(?: --with-deps)? chromium webkit/);
assert.match(setupPlaywright, /npx playwright install chromium webkit/);
assert.match(setupPlaywright, /npx playwright install --with-deps chromium webkit/);

for (const profile of ['p2', 'p3', 'p4', 'p5', 'p6', 'full']) {
  const rows = STANDING_GATE_PROFILES[profile];
  assert.ok(rows, `standing profile ${profile} must exist`);
  assert.ok(
    rows.some((row) => row.argv.join(' ') === 'npm run test:content-registrations'),
    `P2+ standing profile ${profile} must run test:content-registrations`,
  );
}

const workflowsDir = new URL('../.github/workflows/', import.meta.url);
const workflowFiles = readdirSync(workflowsDir).filter((name) => name.endsWith('.yml'));
const browserRunRe = /(?:^|\n)\s*-\s*run:\s*(.+?)(?=\n\s*(?:-\s|uses:|if:|with:|env:|name:)|$)/gs;
const browserCmdRe = /(?:npm run test:e2e\b|(?:npx\s+)?playwright test\b|tools\/e2e-shard\.mjs --shard)/;
const strictWrapper = 'tools/run-with-strict-e2e-port.mjs';
const bareBrowserRuns = [];
for (const name of workflowFiles) {
  const text = readFileSync(new URL(name, workflowsDir), 'utf8');
  for (const match of text.matchAll(browserRunRe)) {
    const command = match[1].replace(/\n\s+/g, ' ').trim();
    if (!browserCmdRe.test(command)) continue;
    if (!command.includes(strictWrapper)) {
      bareBrowserRuns.push(`${name}: ${command}`);
    }
  }
}
assert.deepEqual(
  bareBrowserRuns,
  [],
  `every workflow browser command must invoke ${strictWrapper} in the same run step; bare:\n${bareBrowserRuns.join('\n')}`,
);

const updateBaselines = readFileSync(
  new URL('../.github/workflows/update-baselines.yml', import.meta.url),
  'utf8',
);
assert.match(
  updateBaselines,
  /node tools\/run-with-strict-e2e-port\.mjs -- npm run test:e2e:update/,
);
assert.match(updateBaselines, /playwright install(?: --with-deps)? chromium/);
assert.match(updateBaselines, /write-baseline-manifest\.mjs/);
assert.match(updateBaselines, /baseline-manifest\.json/);
assert.match(updateBaselines, /GITHUB_SHA/);

const perfWorkflow = readFileSync(new URL('../.github/workflows/perf.yml', import.meta.url), 'utf8');
assert.match(perfWorkflow, /node tools\/run-with-strict-e2e-port\.mjs -- npm run test:e2e:perf/);
assert.match(perfWorkflow, /test:e2e:perf:full|PERF_TIER=full/);
assert.match(perfWorkflow, /PERF_WARNING|valid performance measurement|invalid perf metrics/);
assert.match(perfWorkflow, /perf-metrics-full\.json/);
assert.match(perfWorkflow, /npm run test:e2e:leak/);

assert.match(
  pkg.scripts['test:e2e:webkit'],
  /production-profile/,
  'test:e2e:webkit must include production-profile',
);
assert.match(
  pkg.scripts['test:e2e:webkit'],
  /p6-screens/,
  'test:e2e:webkit must include p6-screens',
);
for (const token of ['trace', 'stage', 'lab', 'theme-profile', 'production-profile', 'p6-screens']) {
  assert.match(
    pkg.scripts['test:e2e:webkit'],
    new RegExp(`\\b${token}\\b`),
    `test:e2e:webkit must retain cumulative token ${token}`,
  );
}
assert.match(pkg.scripts['test:e2e:webkit'], /--project=iphone-webkit/);
assert.match(pkg.scripts['test:e2e:webkit'], /--project=ipad-webkit/);
assert.match(pkg.scripts['test:e2e:webkit'], /--workers=1/);

const agents = readFileSync(new URL('../AGENTS.md', import.meta.url), 'utf8');
assert.match(agents, /test:e2e:perf\s+# performance reference; warns on target misses/);
assert.match(agents, /disk-writing[\s\S]*random-agent[\s\S]*pool[\s\S]*serial-heavy[\s\S]*visual/);
assert.match(agents, /e2e-shard\.mjs/);
assert.match(agents, /browser smoke[\s\S]*Draft PRs/);
assert.match(agents, /Ready PRs[\s\S]*complete parallel Playwright gate/);
assert.match(agents, /stable aggregate check names are `unit` and `e2e`/);

console.log('ci contract checks passed');
