// Duration-balanced sharding for the nonvisual Playwright pool.
//
// CI runs one `e2e pool k/N` matrix instead of hand-peeled per-suite lanes.
// The plan is a pure function of three inputs every matrix job shares — the
// `--list` output for the pool, tools/e2e-shard-timings.json and N — so all
// jobs compute identical buckets and their union is exactly the pool.
//
//   node tools/e2e-shard.mjs --shard <k>/<n>      run bucket k of the n-way plan
//   node tools/e2e-shard.mjs --plan <n>           print the plan without running
//   node tools/e2e-shard.mjs --record <report...> fold Playwright JSON report(s)
//                                                 into the timings file
//
// Timings hold summed per-test seconds per "<project>|<file>" unit. Units
// heavier than SLICE_TARGET_SECONDS are pre-split with Playwright's native
// `--shard` inside that one file, so no single spec file can skew a bucket.
// Unknown units (new spec files) fall back to a per-test estimate — stale
// timings degrade balance, never coverage. Refresh with --record after a run
// with PLAYWRIGHT_JSON_OUTPUT_NAME set, or from CI logs.

import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export const POOL_PROJECTS = Object.freeze(['desktop', 'portrait', 'landscape']);
export const POOL_GREP_INVERT = 'random-agent mini-run|@serial';
export const SLICE_TARGET_SECONDS = 300;
export const FALLBACK_TEST_SECONDS = 8;
const TIMINGS_URL = new URL('./e2e-shard-timings.json', import.meta.url);

const poolEnv = (env) => ({ ...env, SPIREBOUND_E2E_SUITE: 'pool' });

const baseArgs = (project) => [
  `--project=${project}`, '--no-deps', '--grep-invert', POOL_GREP_INVERT,
];

/** Walk a Playwright JSON report/list tree into flat {file, project} tests. */
export function flattenReportTests(report) {
  const tests = [];
  const walk = (suite) => {
    for (const child of suite.suites ?? []) walk(child);
    for (const spec of suite.specs ?? []) {
      const file = spec.file.startsWith('test/e2e/') ? spec.file : `test/e2e/${spec.file}`;
      for (const test of spec.tests ?? []) {
        tests.push({
          file,
          project: test.projectName ?? test.projectId,
          durationMs: (test.results ?? []).reduce((sum, r) => sum + (r.duration ?? 0), 0),
        });
      }
    }
  };
  for (const suite of report.suites ?? []) walk(suite);
  return tests;
}

/** Enumerate pool units ("project|file" → test count) via `--list`. */
export function listPoolUnits({ spawn = spawnSync, env = process.env } = {}) {
  const args = [
    'playwright', 'test', '--list', '--reporter=json',
    ...POOL_PROJECTS.map((p) => `--project=${p}`),
    '--no-deps', '--grep-invert', POOL_GREP_INVERT,
  ];
  // The listing parses --reporter=json from stdout; PLAYWRIGHT_JSON_OUTPUT_NAME
  // would silently redirect it to a file, so it must not reach this spawn.
  const { PLAYWRIGHT_JSON_OUTPUT_NAME: _drop, ...listEnv } = poolEnv(env);
  const child = spawn('npx', args, {
    shell: false, encoding: 'utf8', env: listEnv, maxBuffer: 256 * 1024 * 1024,
  });
  if (child.status !== 0) {
    throw new Error(`playwright --list failed (${child.status}): ${child.stderr}`);
  }
  const counts = new Map();
  for (const test of flattenReportTests(JSON.parse(child.stdout))) {
    const key = `${test.project}|${test.file}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

/** Expand units into slices no heavier than SLICE_TARGET_SECONDS. */
export function buildSlices(unitCounts, timings) {
  const slices = [];
  for (const [key, testCount] of unitCounts) {
    const [project, file] = key.split('|');
    const weight = timings[key] ?? testCount * FALLBACK_TEST_SECONDS;
    const parts = Math.max(1, Math.ceil(weight / SLICE_TARGET_SECONDS));
    for (let slice = 1; slice <= parts; slice += 1) {
      slices.push({ key, project, file, slice, slices: parts, weight: weight / parts });
    }
  }
  return slices;
}

/** Deterministic LPT bin-packing: heaviest slice to the least-loaded bucket. */
export function partitionSlices(slices, bucketCount) {
  if (!Number.isInteger(bucketCount) || bucketCount < 1) {
    throw new Error(`invalid bucket count ${bucketCount}`);
  }
  const ordered = [...slices].sort((a, b) =>
    b.weight - a.weight || a.key.localeCompare(b.key) || a.slice - b.slice);
  const buckets = Array.from({ length: bucketCount }, () => ({ weight: 0, slices: [] }));
  for (const slice of ordered) {
    const bucket = buckets.reduce((min, b) => (b.weight < min.weight ? b : min));
    bucket.weight += slice.weight;
    bucket.slices.push(slice);
  }
  return buckets;
}

/** One invocation per sliced item; whole files batch per project. */
export function bucketInvocations(bucket) {
  const invocations = [];
  for (const project of POOL_PROJECTS) {
    const whole = bucket.slices
      .filter((s) => s.project === project && s.slices === 1)
      .map((s) => s.file).sort();
    if (whole.length) invocations.push({ project, files: whole });
    const sliced = bucket.slices
      .filter((s) => s.project === project && s.slices > 1)
      .sort((a, b) => a.file.localeCompare(b.file) || a.slice - b.slice);
    for (const s of sliced) {
      invocations.push({ project, files: [s.file], shard: `${s.slice}/${s.slices}` });
    }
  }
  return invocations;
}

export function loadTimings(url = TIMINGS_URL) {
  try {
    return JSON.parse(readFileSync(url, 'utf8'));
  } catch {
    return {};
  }
}

export function planBuckets(bucketCount, { unitCounts, timings } = {}) {
  const counts = unitCounts ?? listPoolUnits();
  const known = timings ?? loadTimings();
  return partitionSlices(buildSlices(counts, known), bucketCount);
}

function describeBucket(index, bucket) {
  const parts = bucket.slices.map((s) => s.slices > 1 ? `${s.key}#${s.slice}/${s.slices}` : s.key);
  return `pool bucket ${index}: ~${Math.round(bucket.weight)}s summed — ${parts.join(', ')}`;
}

export function runBucket(shard, { spawn = spawnSync, env = process.env, plan } = {}) {
  const match = /^(\d+)\/(\d+)$/.exec(shard ?? '');
  if (!match) throw new Error('Usage: node tools/e2e-shard.mjs --shard <k>/<n>');
  const [index, total] = [Number(match[1]), Number(match[2])];
  if (index < 1 || index > total) throw new Error(`shard ${shard} out of range`);
  const buckets = plan ?? planBuckets(total);
  const bucket = buckets[index - 1];
  process.stdout.write(`${describeBucket(index, bucket)}\n`);
  if (!bucket.slices.length) {
    process.stdout.write(`pool bucket ${index}: empty, nothing to run\n`);
    return 0;
  }
  let status = 0;
  let invocationIndex = 0;
  for (const invocation of bucketInvocations(bucket)) {
    invocationIndex += 1;
    const args = [
      'playwright', 'test', ...invocation.files, ...baseArgs(invocation.project),
      ...(invocation.shard ? [`--shard=${invocation.shard}`] : []),
    ];
    const runEnv = poolEnv(env);
    // A bucket runs several invocations; each needs its own JSON report file
    // and outputDir, or later invocations would overwrite/wipe earlier ones.
    runEnv.PLAYWRIGHT_OUTPUT_DIR = `test-results/pool-inv-${invocationIndex}`;
    if (runEnv.PLAYWRIGHT_JSON_OUTPUT_NAME) {
      runEnv.PLAYWRIGHT_JSON_OUTPUT_NAME = runEnv.PLAYWRIGHT_JSON_OUTPUT_NAME
        .replace(/(\.json)?$/, `-${invocationIndex}.json`);
    }
    process.stdout.write(`\n> npx ${args.join(' ')}\n`);
    const child = spawn('npx', args, { shell: false, stdio: 'inherit', env: runEnv });
    status = Math.max(status, Number.isInteger(child?.status) ? child.status : 1);
  }
  return status;
}

export function mergeRecordedTimings(existing, tests) {
  const sums = new Map();
  for (const test of tests) {
    if (!test.durationMs) continue;
    const key = `${test.project}|${test.file}`;
    sums.set(key, (sums.get(key) ?? 0) + test.durationMs / 1000);
  }
  const merged = { ...existing };
  for (const [key, secs] of sums) {
    // A unit whose tests all skipped on this project sums to ~0ms; keep the
    // prior weight rather than writing a 0 the plan (and its contract test)
    // would reject.
    const rounded = Math.round(secs * 10) / 10;
    if (rounded > 0) merged[key] = rounded;
  }
  return Object.fromEntries(Object.entries(merged).sort(([a], [b]) => a.localeCompare(b)));
}

function runCli() {
  const [command, ...rest] = process.argv.slice(2);
  if (command === '--shard') {
    process.exitCode = runBucket(rest[0]);
    return;
  }
  if (command === '--plan') {
    const buckets = planBuckets(Number(rest[0]));
    buckets.forEach((bucket, i) => process.stdout.write(`${describeBucket(i + 1, bucket)}\n`));
    return;
  }
  if (command === '--record' && rest.length) {
    const tests = rest.flatMap((path) => flattenReportTests(JSON.parse(readFileSync(path, 'utf8'))));
    writeFileSync(TIMINGS_URL, `${JSON.stringify(mergeRecordedTimings(loadTimings(), tests), null, 2)}\n`);
    process.stdout.write(`recorded ${rest.length} report(s) into tools/e2e-shard-timings.json\n`);
    return;
  }
  throw new Error('Usage: node tools/e2e-shard.mjs --shard <k>/<n> | --plan <n> | --record <report.json...>');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  runCli();
}
