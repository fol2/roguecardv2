#!/usr/bin/env node
// Dispatch update-baselines.yml (or similar), wait for exactly one *new*
// workflow_dispatch run on the expected commit, then download its artifact.
// P5/P6/P7 reuse this helper; never select --limit=1 immediately after dispatch.

import { mkdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';

const DEFAULT_TIMEOUT_MS = 45 * 60 * 1000;
const DEFAULT_POLL_MS = 10_000;

export function sleep(ms, { setTimeoutFn = setTimeout } = {}) {
  return new Promise((resolveSleep) => setTimeoutFn(resolveSleep, ms));
}

/**
 * Pure polling core — injectable for unit tests.
 * @param {object} opts
 * @param {() => Promise<object[]>} opts.listRuns  returns runs with {databaseId, headSha, event, status, ...}
 * @param {Set<string|number>|Array} opts.previousIds
 * @param {string} opts.expectSha
 * @param {number} [opts.timeoutMs]
 * @param {number} [opts.pollMs]
 * @param {() => number} [opts.now]
 * @param {(ms:number) => Promise<void>} [opts.sleepFn]
 */
export async function waitForNewDispatchRun({
  listRuns,
  previousIds,
  expectSha,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  pollMs = DEFAULT_POLL_MS,
  now = Date.now,
  sleepFn = sleep,
} = {}) {
  const expect = String(expectSha || '').trim().toLowerCase();
  if (!/^[0-9a-f]{7,40}$/i.test(expect)) {
    throw new Error(`invalid expectSha: ${expectSha}`);
  }
  const prior = new Set([...(previousIds || [])].map((id) => String(id)));
  const deadline = now() + timeoutMs;
  let lastError = null;

  while (now() <= deadline) {
    let runs;
    try {
      runs = await listRuns();
    } catch (error) {
      lastError = error;
      await sleepFn(pollMs);
      continue;
    }
    if (!Array.isArray(runs)) {
      throw new TypeError('listRuns must resolve to an array');
    }

    const fresh = [];
    for (const run of runs) {
      const id = String(run.databaseId ?? run.id ?? '');
      if (!id || prior.has(id)) continue;
      fresh.push(run);
    }

    const headOf = (run) => String(run.headSha || run.head_sha || '').trim().toLowerCase();
    const headMatches = (head) => !head
      || head === expect
      || expect.startsWith(head)
      || head.startsWith(expect);

    for (const run of fresh) {
      const head = headOf(run);
      if (head && !headMatches(head)) {
        throw new Error(`dispatch run headSha mismatch: got ${head}, expected ${expect}`);
      }
    }

    const matching = fresh.filter((run) => headMatches(headOf(run)));

    if (matching.length > 1) {
      const ids = matching.map((r) => r.databaseId ?? r.id).join(', ');
      throw new Error(`concurrent duplicate dispatch runs for ${expect}: ${ids}`);
    }
    if (matching.length === 1) {
      return matching[0];
    }
    await sleepFn(pollMs);
  }

  const detail = lastError ? `: last list error ${lastError.message || lastError}` : '';
  throw new Error(`timed out waiting for new workflow_dispatch run on ${expect}${detail}`);
}

function runGh(argv, { cwd } = {}) {
  const result = spawnSync('gh', argv, {
    cwd,
    encoding: 'utf8',
    shell: false,
  });
  if (result.status !== 0) {
    const detail = (result.stderr || result.stdout || '').trim();
    throw new Error(`gh ${argv.join(' ')} failed${detail ? `: ${detail}` : ''}`);
  }
  return (result.stdout || '').trim();
}

function parseRunList(jsonText) {
  if (!jsonText) return [];
  const parsed = JSON.parse(jsonText);
  return Array.isArray(parsed) ? parsed : [];
}

export async function runBaselineWorkflow({
  workflow = 'update-baselines.yml',
  ref,
  sha,
  out,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  pollMs = DEFAULT_POLL_MS,
  gh = runGh,
  sleepFn = sleep,
  now = Date.now,
} = {}) {
  if (!ref || !sha || !out) {
    throw new Error('--workflow/--ref/--sha/--out require ref, sha and out');
  }
  const expectSha = String(sha).trim().toLowerCase();
  const outDir = resolve(out);
  mkdirSync(outDir, { recursive: true });

  const listArgs = [
    'run', 'list',
    '--workflow', workflow,
    '--commit', expectSha,
    '--event', 'workflow_dispatch',
    '--json', 'databaseId,headSha,status,conclusion,event,displayTitle,url',
    '--limit', '20',
  ];
  const previous = parseRunList(gh(listArgs));
  const previousIds = previous.map((run) => run.databaseId);

  // GitHub CLI verb is `workflow run` (not `workflow dispatch`).
  gh(['workflow', 'run', workflow, '--ref', ref]);

  const run = await waitForNewDispatchRun({
    listRuns: async () => parseRunList(gh(listArgs)),
    previousIds,
    expectSha,
    timeoutMs,
    pollMs,
    now,
    sleepFn,
  });

  const runId = String(run.databaseId);
  gh(['run', 'watch', runId, '--exit-status']);

  // Fresh download directory
  for (const name of ['visual-baselines-linux', '.']) {
    // download into outDir; gh puts artifact folder(s) inside
  }
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });
  gh(['run', 'download', runId, '--dir', outDir]);

  return { runId, headSha: expectSha, outDir };
}

function parseArgs(argv) {
  const out = {
    workflow: 'update-baselines.yml',
    ref: null,
    sha: null,
    out: null,
    timeoutMs: DEFAULT_TIMEOUT_MS,
    pollMs: DEFAULT_POLL_MS,
    help: false,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--workflow') out.workflow = argv[++i];
    else if (arg === '--ref') out.ref = argv[++i];
    else if (arg === '--sha') out.sha = argv[++i];
    else if (arg === '--out') out.out = argv[++i];
    else if (arg === '--timeout-ms') out.timeoutMs = Number(argv[++i]);
    else if (arg === '--poll-ms') out.pollMs = Number(argv[++i]);
    else if (arg === '--help' || arg === '-h') out.help = true;
    else throw new Error(`unknown argument: ${arg}`);
  }
  return out;
}

async function main(argv) {
  const args = parseArgs(argv);
  if (args.help) {
    process.stdout.write(
      'Usage: node tools/run-baseline-workflow.mjs --workflow update-baselines.yml --ref <branch> --sha <sha> --out <dir>\n',
    );
    return;
  }
  const result = await runBaselineWorkflow(args);
  process.stdout.write(`downloaded run ${result.runId} → ${result.outDir}\n`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href
    || process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).catch((error) => {
    process.stderr.write(`${error.message || error}\n`);
    process.exitCode = 1;
  });
}
