#!/usr/bin/env node
import {
  mkdirSync, readFileSync, renameSync, statSync, unlinkSync, writeFileSync,
} from 'node:fs';
import { availableParallelism } from 'node:os';
import { dirname, isAbsolute, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Worker } from 'node:worker_threads';
import { execFileSync } from 'node:child_process';

import { finalise, merge, serialise } from './telemetry.mjs';

const POLICY_VALUES = Object.freeze(['random', 'greedy']);
const PROFILE_VALUES = Object.freeze(['revealed', 'fresh']);
const SMOKE_RUNS = 300;
const SMOKE_SEED = 1;
const REPORT_DIR = resolve('.sim-reports');
const STATUS_PATH = resolve(REPORT_DIR, '.status.json');
const STATUS_TMP_PATH = resolve(REPORT_DIR, `.status.${process.pid}.json.tmp`);
const LABEL_RE = /^[A-Za-z0-9._-]+$/;

const usage = `Usage: npm run sim -- [options]

  --runs N                 Runs per policy/profile sweep (default 10000)
  --policy random|greedy|both
  --profile revealed|fresh|both
  --seed N                 First seed (default 1)
  --workers auto|N         Concurrent worker threads (default auto)
  --label NAME             Report filename label
  --out PATH               Explicit report path
  --smoke                  Fixed-seed assert gate: 300 runs/policy/profile
`;

const integer = (name, value, { min = 0 } = {}) => {
  if (!/^-?\d+$/.test(String(value))) throw new TypeError(`${name} must be an integer`);
  const n = Number(value);
  if (!Number.isSafeInteger(n) || n < min) throw new RangeError(`${name} must be >= ${min}`);
  return n;
};

function optionValue(args, index, name) {
  const arg = args[index];
  const prefix = `${name}=`;
  if (arg.startsWith(prefix)) return { value: arg.slice(prefix.length), consumed: 1 };
  if (arg === name && index + 1 < args.length) return { value: args[index + 1], consumed: 2 };
  if (arg === name) throw new TypeError(`${name} requires a value`);
  return null;
}

export function parseArgs(args) {
  const out = {
    runs: 10_000,
    policy: 'greedy',
    profile: 'revealed',
    seed: 1,
    workers: 'auto',
    label: 'proving-grounds',
    out: null,
    smoke: false,
  };
  for (let i = 0; i < args.length;) {
    const arg = args[i];
    if (arg === '--help' || arg === '-h') return { ...out, help: true };
    if (arg === '--smoke') { out.smoke = true; i++; continue; }
    let hit = null;
    for (const name of ['--runs', '--policy', '--profile', '--seed', '--workers', '--label', '--out']) {
      hit = optionValue(args, i, name);
      if (!hit) continue;
      const key = name.slice(2);
      out[key] = hit.value;
      i += hit.consumed;
      break;
    }
    if (!hit) throw new TypeError(`unknown option: ${arg}`);
  }
  if (out.smoke) {
    out.runs = SMOKE_RUNS;
    out.policy = 'both';
    out.profile = 'both';
    out.seed = SMOKE_SEED;
    out.label = out.label === 'proving-grounds' ? 'smoke' : out.label;
  }
  out.runs = integer('--runs', out.runs, { min: 1 });
  out.seed = integer('--seed', out.seed, { min: 0 });
  if (![...POLICY_VALUES, 'both'].includes(out.policy)) throw new TypeError(`unknown policy: ${out.policy}`);
  if (![...PROFILE_VALUES, 'both'].includes(out.profile)) throw new TypeError(`unknown profile: ${out.profile}`);
  if (out.workers !== 'auto') out.workers = integer('--workers', out.workers, { min: 1 });
  if (!LABEL_RE.test(out.label)) throw new TypeError('--label must match [A-Za-z0-9._-]+');
  if (out.out != null && (!String(out.out).trim() || String(out.out).includes('\0'))) {
    throw new TypeError('--out must be a non-empty path');
  }
  return out;
}

const expanded = (value, all) => value === 'both' ? [...all] : [value];

function workerCount(value) {
  const requested = value === 'auto' ? availableParallelism() : value;
  return Math.max(1, Math.min(requested, 32));
}

function splitSweep(policy, profile, runs, seed, partitions) {
  const tasks = [];
  const base = Math.floor(runs / partitions);
  let remainder = runs % partitions;
  let startSeed = seed;
  for (let index = 0; index < partitions; index++) {
    const size = base + (remainder-- > 0 ? 1 : 0);
    if (!size) continue;
    tasks.push({ policy, profile, startSeed, runs: size, partition: index });
    startSeed += size;
  }
  return tasks;
}

function makeTasks(config, concurrency) {
  const policies = expanded(config.policy, POLICY_VALUES);
  const profiles = expanded(config.profile, PROFILE_VALUES);
  const partitions = Math.min(concurrency, config.runs);
  const tasks = [];
  for (const policy of policies) {
    for (const profile of profiles) {
      tasks.push(...splitSweep(policy, profile, config.runs, config.seed, partitions));
    }
  }
  return { tasks, policies, profiles };
}

function writeStatus(status) {
  mkdirSync(REPORT_DIR, { recursive: true });
  writeFileSync(STATUS_TMP_PATH, `${JSON.stringify(status, null, 2)}\n`);
  renameSync(STATUS_TMP_PATH, STATUS_PATH);
}

function gitMeta() {
  const readGit = (args) => execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  try {
    return {
      gitRev: readGit(['rev-parse', '--short', 'HEAD']),
      dirty: readGit(['status', '--porcelain', '--untracked-files=no']).length > 0,
    };
  } catch {
    return { gitRev: null, dirty: null };
  }
}

function runWorker(task, onProgress, activeWorkers, poolState) {
  return new Promise((resolveWorker, rejectWorker) => {
    const worker = new Worker(new URL('./worker.mjs', import.meta.url), { type: 'module', workerData: task });
    activeWorkers.add(worker);
    let settled = false;
    const resolveOnce = (value) => {
      if (settled) return;
      settled = true;
      activeWorkers.delete(worker);
      resolveWorker(value);
    };
    const rejectOnce = (error) => {
      if (settled) return;
      settled = true;
      poolState.failed = true;
      activeWorkers.delete(worker);
      rejectWorker(error);
    };
    worker.on('message', (message) => {
      if (message?.type === 'progress') {
        if (!poolState.failed) onProgress(message.delta);
      }
      else if (message?.type === 'result') {
        resolveOnce({ task, partial: message.partial });
      } else if (message?.type === 'worker-error') {
        const error = new Error(message.message);
        if (message.stack) error.stack = message.stack;
        rejectOnce(error);
      }
    });
    worker.on('error', rejectOnce);
    worker.on('exit', (code) => {
      if (!settled && code !== 0) rejectOnce(new Error(`worker exited with code ${code}`));
      else if (!settled) rejectOnce(new Error('worker exited without a result'));
    });
  });
}

async function runPool(tasks, concurrency, onProgress) {
  const results = [];
  const activeWorkers = new Set();
  const poolState = { failed: false };
  let cursor = 0;
  async function lane() {
    while (!poolState.failed && cursor < tasks.length) {
      const index = cursor++;
      results[index] = await runWorker(tasks[index], onProgress, activeWorkers, poolState);
    }
  }
  try {
    await Promise.all(Array.from({ length: Math.min(concurrency, tasks.length) }, lane));
    return results;
  } catch (error) {
    poolState.failed = true;
    await Promise.allSettled([...activeWorkers].map((worker) => worker.terminate()));
    throw error;
  }
}

function outputPath(config, startedAt) {
  if (config.out) return isAbsolute(config.out) ? config.out : resolve(config.out);
  const stamp = startedAt.toISOString().replace(/[:.]/g, '-');
  return resolve(REPORT_DIR, `${stamp}-${config.label}.json`);
}

function removeVolatileStatusTemp() {
  try { unlinkSync(STATUS_TMP_PATH); } catch {}
}

function publishReport(destination, report) {
  const tempPath = `${destination}.${process.pid}.tmp`;
  try {
    writeFileSync(tempPath, serialise(report));
    renameSync(tempPath, destination);
  } finally {
    try { unlinkSync(tempPath); } catch {}
  }
}

export async function runSimulation(config) {
  const requestedConcurrency = workerCount(config.workers);
  const { tasks, policies, profiles } = makeTasks(config, requestedConcurrency);
  const concurrency = Math.min(requestedConcurrency, tasks.length);
  const startedAt = new Date();
  const destination = outputPath(config, startedAt);
  const total = config.runs * policies.length * profiles.length;
  const status = {
    running: true,
    pid: process.pid,
    done: 0,
    total,
    startedAt: startedAt.toISOString(),
    config: {
      runs: config.runs, policy: config.policy, profile: config.profile,
      seed: config.seed, workers: config.workers, label: config.label,
    },
  };
  let terminal = false;
  writeStatus(status);
  const stop = (signal) => {
    terminal = true;
    writeStatus({ ...status, running: false, error: `interrupted by ${signal}`, finishedAt: new Date().toISOString() });
    process.exit(128 + (signal === 'SIGINT' ? 2 : 15));
  };
  process.once('SIGINT', stop);
  process.once('SIGTERM', stop);
  try {
    const results = await runPool(tasks, concurrency, (delta) => {
      if (terminal) return;
      status.done += delta;
      writeStatus(status);
    });
    const byPolicy = Object.fromEntries(policies.map((policy) => [policy, []]));
    for (const result of results) byPolicy[result.task.policy].push(result);
    const sections = {};
    for (const policy of policies) {
      const ordered = byPolicy[policy].sort((a, b) =>
        PROFILE_VALUES.indexOf(a.task.profile) - PROFILE_VALUES.indexOf(b.task.profile)
        || a.task.startSeed - b.task.startSeed);
      let aggregate = ordered[0].partial;
      for (const item of ordered.slice(1)) aggregate = merge(aggregate, item.partial);
      sections[policy] = finalise(aggregate);
    }
    const durationMs = Date.now() - startedAt.getTime();
    const report = {
      meta: {
        schema: 1,
        date: startedAt.toISOString(),
        durationMs,
        workers: concurrency,
        runs: total,
        label: config.label,
        config: {
          runs: config.runs, policy: config.policy, profile: config.profile,
          seed: config.seed, workers: config.workers,
        },
        ...gitMeta(),
      },
      policies: sections,
    };
    mkdirSync(dirname(destination), { recursive: true });
    publishReport(destination, report);
    status.done = total;
    terminal = true;
    writeStatus({
      ...status,
      running: false,
      finishedAt: new Date().toISOString(),
      output: destination,
      durationMs,
    });
    return { report, output: destination };
  } catch (error) {
    terminal = true;
    writeStatus({
      ...status,
      running: false,
      finishedAt: new Date().toISOString(),
      error: String(error?.message ?? error),
    });
    throw error;
  } finally {
    process.removeListener('SIGINT', stop);
    process.removeListener('SIGTERM', stop);
    removeVolatileStatusTemp();
  }
}

async function main() {
  let config;
  try {
    config = parseArgs(process.argv.slice(2));
    if (config.help) { process.stdout.write(usage); return; }
    if (config.smoke) {
      const { runSmoke } = await import('./smoke.mjs');
      process.stdout.write(`${JSON.stringify({ smoke: 'passed', ...runSmoke(config) })}\n`);
      return;
    }
    const { report, output } = await runSimulation(config);
    const summary = Object.fromEntries(Object.entries(report.policies).map(([policy, section]) => [policy, {
      runs: section.meta.runs,
      wins: section.headline.wins,
      winRate: section.headline.winRate,
      issues: section.issues.total,
    }]));
    process.stdout.write(`${JSON.stringify({ output, ...summary })}\n`);
  } catch (error) {
    process.stderr.write(`sim: ${String(error?.message ?? error)}\n`);
    process.exitCode = 1;
  }
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : null;
if (invokedPath === fileURLToPath(import.meta.url)) await main();

export function readStatus() {
  try {
    const status = JSON.parse(readFileSync(STATUS_PATH, 'utf8'));
    statSync(STATUS_PATH);
    return status;
  } catch {
    return { running: false };
  }
}
