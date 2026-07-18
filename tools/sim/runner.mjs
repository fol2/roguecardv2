#!/usr/bin/env node
import {
  mkdirSync, readFileSync, renameSync, statSync, unlinkSync, writeFileSync,
} from 'node:fs';
import { availableParallelism } from 'node:os';
import { dirname, isAbsolute, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Worker } from 'node:worker_threads';
import { execFileSync } from 'node:child_process';

import {
  legacyRoundPolicyIds, policyIdsForMode, policyMetadata,
} from './policies/registry.mjs';
import { triggerIds } from './triggers.mjs';
import { finaliseCycles, mergeCycleAggregates, serialiseCycles } from './cycle-telemetry.mjs';
import { finalise, merge, serialise } from './telemetry.mjs';

const POLICY_VALUES = Object.freeze(policyIdsForMode('round'));
const LEGACY_ROUND_SWEEP = Object.freeze(legacyRoundPolicyIds());
const PROFILE_VALUES = Object.freeze(['revealed', 'fresh']);
const MODE_VALUES = Object.freeze(['round', 'cycle']);
const CYCLE_POLICY_VALUES = Object.freeze(policyIdsForMode('cycle'));
const DEFAULT_RUNS = 10_000;
const DEFAULT_CYCLES = 100;
const DEFAULT_MAX_ROUNDS = 100;
const MAX_ROUNDS_LIMIT = 1_000;
const MAX_RUNS_LIMIT = 1_000_000;
const MAX_CYCLES_LIMIT = 1_000_000;
const MAX_WORKERS_LIMIT = 32;
const MAX_CYCLE_ROUND_WORK = 100_000;
const MAX_SUFFIX_BOOTSTRAP_DRAWS = 100_000_000;
const SMOKE_RUNS = 300;
const SMOKE_SEED = 1;
const REPORT_DIR = resolve('.sim-reports');
const STATUS_PATH = resolve(REPORT_DIR, '.status.json');
const STATUS_TMP_PATH = resolve(REPORT_DIR, `.status.${process.pid}.json.tmp`);
const LABEL_RE = /^[A-Za-z0-9._-]+$/;

const usage = `Usage: npm run sim -- [options]

  --mode round|cycle       Simulation population (default round)
  --runs N                 Runs per policy/profile sweep (default 10000)
  --cycles N               Full Cycles (cycle mode; default 100)
  --max-rounds N           Round cap per cycle (default 100; max ${MAX_ROUNDS_LIMIT})
                           cycles * max-rounds must be <= ${MAX_CYCLE_ROUND_WORK}
  --policy ${POLICY_VALUES.join('|')}|both  (round)
           ${CYCLE_POLICY_VALUES.join('|')}              (cycle)
  --profile revealed|fresh|both
  --target TRIGGER_ID      Coverage-only explicit target (rotation by default)
  --seed N                 First seed (default 1)
  --workers auto|N         Concurrent worker threads (default auto)
  --label NAME             Report filename label
  --out PATH               Explicit report path
  --smoke                  Fixed-seed assert gate: 300 runs/policy/profile
`;

export function runnerMetadata() {
  const registry = policyMetadata();
  return {
    ...registry,
    schemaVersion: 2,
    modes: [...MODE_VALUES],
    defaults: {
      ...registry.defaults, mode: 'round', runs: DEFAULT_RUNS, cycles: DEFAULT_CYCLES,
      maxRounds: DEFAULT_MAX_ROUNDS, profile: 'revealed', workers: 'auto', label: 'proving-grounds',
    },
    limits: {
      maxRounds: MAX_ROUNDS_LIMIT,
      runs: MAX_RUNS_LIMIT,
      cycles: MAX_CYCLES_LIMIT,
      workers: MAX_WORKERS_LIMIT,
      cycleRounds: MAX_CYCLE_ROUND_WORK,
      suffixBootstrapDraws: MAX_SUFFIX_BOOTSTRAP_DRAWS,
    },
    targets: triggerIds(),
  };
}

const integer = (name, value, { min = 0, max = Number.MAX_SAFE_INTEGER } = {}) => {
  if (!/^-?\d+$/.test(String(value))) throw new TypeError(`${name} must be an integer`);
  const n = Number(value);
  if (!Number.isSafeInteger(n) || n < min) throw new RangeError(`${name} must be >= ${min}`);
  if (n > max) throw new RangeError(`${name} must be <= ${max}`);
  return n;
};

export function cycleWorkProblem(cycles, maxRounds) {
  if (!Number.isSafeInteger(cycles) || !Number.isSafeInteger(maxRounds)) return null;
  const total = cycles * maxRounds;
  return total > MAX_CYCLE_ROUND_WORK
    ? `cycles * maxRounds must be <= ${MAX_CYCLE_ROUND_WORK}`
    : null;
}

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
    mode: 'round', runs: null, cycles: null, maxRounds: null,
    policy: null, profile: null, target: null,
    seed: 1,
    workers: 'auto',
    label: 'proving-grounds',
    out: null,
    smoke: false,
  };
  const supplied = new Set();
  for (let i = 0; i < args.length;) {
    const arg = args[i];
    if (arg === '--help' || arg === '-h') return { ...out, help: true };
    if (arg === '--smoke') { out.smoke = true; i++; continue; }
    let hit = null;
    for (const name of ['--mode', '--runs', '--cycles', '--max-rounds', '--policy', '--profile', '--target', '--seed', '--workers', '--label', '--out']) {
      hit = optionValue(args, i, name);
      if (!hit) continue;
      const key = name.slice(2);
      out[key === 'max-rounds' ? 'maxRounds' : key] = hit.value;
      supplied.add(name);
      i += hit.consumed;
      break;
    }
    if (!hit) throw new TypeError(`unknown option: ${arg}`);
  }
  if (out.smoke) {
    if (supplied.has('--mode') && out.mode !== 'round') throw new TypeError('--smoke supports round mode only');
    out.mode = 'round';
    out.runs = SMOKE_RUNS;
    out.policy = 'both';
    out.profile = 'both';
    out.seed = SMOKE_SEED;
    out.label = out.label === 'proving-grounds' ? 'smoke' : out.label;
  }
  if (!MODE_VALUES.includes(out.mode)) throw new TypeError(`unknown mode: ${out.mode}`);
  const metadata = runnerMetadata();
  const { defaults, limits } = metadata;
  out.policy ??= defaults[out.mode];
  if (out.mode === 'round') {
    for (const flag of ['--cycles', '--max-rounds', '--target']) {
      if (supplied.has(flag)) throw new TypeError(`${flag} is available only in cycle mode`);
    }
    out.runs = integer('--runs', out.runs ?? defaults.runs, { min: 1, max: limits.runs });
    out.profile ??= defaults.profile;
    if (![...POLICY_VALUES, 'both'].includes(out.policy)) throw new TypeError(`unknown round policy: ${out.policy}`);
    if (![...PROFILE_VALUES, 'both'].includes(out.profile)) throw new TypeError(`unknown profile: ${out.profile}`);
  } else {
    if (supplied.has('--runs')) throw new TypeError('--runs is available only in round mode; use --cycles');
    if (supplied.has('--profile')) throw new TypeError('--profile is not available in cycle mode');
    if (out.policy === 'both' || !CYCLE_POLICY_VALUES.includes(out.policy)) throw new TypeError(`unknown cycle policy: ${out.policy}`);
    out.cycles = integer('--cycles', out.cycles ?? defaults.cycles, { min: 1, max: limits.cycles });
    out.maxRounds = integer('--max-rounds', out.maxRounds ?? defaults.maxRounds, {
      min: 1, max: limits.maxRounds,
    });
    const workProblem = cycleWorkProblem(out.cycles, out.maxRounds);
    if (workProblem) throw new RangeError(workProblem);
    if (out.target != null) {
      if (out.policy !== 'coverage') throw new TypeError('--target is available only with cycle coverage policy');
      if (!triggerIds().includes(out.target)) throw new TypeError(`unknown coverage target: ${out.target}`);
    }
    out.profile = null;
    out.runs = null;
  }
  out.seed = integer('--seed', out.seed, { min: 0 });
  if (out.workers !== 'auto') {
    out.workers = integer('--workers', out.workers, { min: 1, max: limits.workers });
  }
  if (!LABEL_RE.test(out.label)) throw new TypeError('--label must match [A-Za-z0-9._-]+');
  if (out.out != null && (!String(out.out).trim() || String(out.out).includes('\0'))) {
    throw new TypeError('--out must be a non-empty path');
  }
  return out;
}

const expanded = (value, all) => value === 'both' ? [...all] : [value];

function workerCount(value) {
  const requested = value === 'auto' ? availableParallelism() : value;
  return Math.max(1, Math.min(requested, MAX_WORKERS_LIMIT));
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
  if (config.mode === 'cycle') {
    const partitions = Math.min(concurrency, config.cycles);
    const tasks = splitSweep(config.policy, null, config.cycles, config.seed, partitions)
      .map(({ runs, ...task }) => ({
        ...task, mode: 'cycle', cycles: runs, maxRounds: config.maxRounds, targetId: config.target,
      }));
    return { tasks, policies: [config.policy], profiles: [] };
  }
  const policies = config.policy === 'both' ? [...LEGACY_ROUND_SWEEP] : [config.policy];
  const profiles = expanded(config.profile, PROFILE_VALUES);
  const partitions = Math.min(concurrency, config.runs);
  const tasks = [];
  for (const policy of policies) {
    for (const profile of profiles) {
      tasks.push(...splitSweep(policy, profile, config.runs, config.seed, partitions)
        .map((task) => ({ ...task, mode: 'round' })));
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

function publishReport(destination, report, serialiser = serialise) {
  const tempPath = `${destination}.${process.pid}.tmp`;
  try {
    writeFileSync(tempPath, serialiser(report));
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
  const total = config.mode === 'cycle' ? config.cycles : config.runs * policies.length * profiles.length;
  const status = {
    running: true,
    pid: process.pid,
    done: 0,
    total,
    startedAt: startedAt.toISOString(),
    config: {
      mode: config.mode, runs: config.runs, cycles: config.cycles, maxRounds: config.maxRounds,
      policy: config.policy, profile: config.profile, target: config.target,
      seed: config.seed, workers: config.workers, label: config.label,
    },
    ...(config.mode === 'cycle' ? {
      roundsPlayed: 0, promisesStaged: 0, censoredCycles: 0, failedCycles: 0,
      currentTarget: config.target,
    } : {}),
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
      status.done += delta.completed;
      if (config.mode === 'cycle') {
        status.roundsPlayed += delta.rounds || 0;
        status.promisesStaged += delta.promisesStaged || 0;
        status.censoredCycles += delta.censored || 0;
        status.failedCycles += delta.failed || 0;
        if (delta.currentTarget) status.currentTarget = delta.currentTarget;
      }
      writeStatus(status);
    });
    const byPolicy = Object.fromEntries(policies.map((policy) => [policy, []]));
    for (const result of results) byPolicy[result.task.policy].push(result);
    const sections = {};
    for (const policy of policies) {
      const ordered = byPolicy[policy].sort((a, b) =>
        (config.mode === 'round' ? PROFILE_VALUES.indexOf(a.task.profile) - PROFILE_VALUES.indexOf(b.task.profile) : 0)
        || a.task.startSeed - b.task.startSeed);
      let aggregate = ordered[0].partial;
      for (const item of ordered.slice(1)) aggregate = config.mode === 'cycle'
        ? mergeCycleAggregates(aggregate, item.partial) : merge(aggregate, item.partial);
      sections[policy] = config.mode === 'cycle' ? finaliseCycles(aggregate) : finalise(aggregate);
    }
    const durationMs = Date.now() - startedAt.getTime();
    const report = {
      meta: {
        schema: config.mode === 'cycle' ? 2 : 1,
        mode: config.mode,
        date: startedAt.toISOString(),
        durationMs,
        workers: concurrency,
        ...(config.mode === 'cycle'
          ? { cycles: config.cycles, totalRounds: sections[config.policy].meta.totalRounds }
          : { runs: total }),
        label: config.label,
        config: {
          mode: config.mode, runs: config.runs, cycles: config.cycles, maxRounds: config.maxRounds,
          policy: config.policy, profile: config.profile, target: config.target,
          seed: config.seed, workers: config.workers,
        },
        ...gitMeta(),
      },
      policies: sections,
    };
    mkdirSync(dirname(destination), { recursive: true });
    publishReport(destination, report, config.mode === 'cycle' ? serialiseCycles : serialise);
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
    const summary = Object.fromEntries(Object.entries(report.policies).map(([policy, section]) => [policy,
      report.meta.mode === 'cycle' ? {
        cycles: section.meta.cycles, rounds: section.meta.totalRounds,
        completed: section.completion.counts.completed, censored: section.completion.counts.censored,
        failed: section.completion.counts.failed, issues: section.issues.length,
      } : {
        runs: section.meta.runs, wins: section.headline.wins,
        winRate: section.headline.winRate, issues: section.issues.total,
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
