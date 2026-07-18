import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { MAP_ROWS } from '../../src/engine.js';
import { POOL_GATE } from '../../src/data.js';
import { playRun } from './play-run.mjs';
import { makePolicy as makeGreedyPolicy } from './policies/greedy.mjs';
import { makePolicy as makeRandomPolicy } from './policies/random.mjs';
import { finalise, merge, reduce, serialise } from './telemetry.mjs';

export const SMOKE_RUNS = 300;
export const SMOKE_SEED = 1;

const PROFILES = Object.freeze(['revealed', 'fresh']);
const POLICY_FACTORIES = Object.freeze({
  greedy: makeGreedyPolicy,
  random: makeRandomPolicy,
});

function playMatrix(runs, seed) {
  return Object.fromEntries(Object.entries(POLICY_FACTORIES).map(([policy, makePolicy]) => [
    policy,
    Object.fromEntries(PROFILES.map((profile) => [
      profile,
      Array.from({ length: runs }, (_, index) => playRun(seed + index, makePolicy, { profile })),
    ])),
  ]));
}

const flattenPolicy = (matrix, policy) => PROFILES.flatMap((profile) => matrix[policy][profile]);
const wins = (records) => records.filter((record) => record.outcome === 'win').length;
const averageFightLength = (records) => {
  let fights = 0;
  let turns = 0;
  for (const record of records) {
    for (const fight of record.fights) {
      fights += 1;
      turns += fight.turns;
    }
  }
  assert.ok(fights > 0, 'smoke fixture must reach combat');
  return turns / fights;
};

function assertRecordsHealthy(matrix) {
  const records = Object.values(matrix).flatMap((profiles) => Object.values(profiles).flat());
  for (const record of records) {
    assert.ok(record.outcome === 'win' || record.outcome === 'death',
      `seed ${record.seed} (${record.profile}) did not terminate: ${record.outcome}`);
    const engineIssues = record.issues.filter((issue) =>
      issue.kind === 'engine-error' || issue.kind === 'invariant');
    assert.deepEqual(engineIssues, [],
      `seed ${record.seed} (${record.profile}) captured engine/invariant issues`);
  }
  for (const profile of PROFILES) {
    const illegal = matrix.greedy[profile].flatMap((record) =>
      record.issues.filter((issue) => issue.kind === 'policy-illegal'));
    assert.deepEqual(illegal, [], `greedy policy must stay legal in the ${profile} smoke sweep`);
  }
}

function assertGreedyQuality(matrix) {
  for (const profile of PROFILES) {
    const randomWins = wins(matrix.random[profile]);
    const greedyWins = wins(matrix.greedy[profile]);
    assert.ok(greedyWins > randomWins,
      `greedy must beat random for ${profile}: ${greedyWins} <= ${randomWins}`);
    const randomFightLength = averageFightLength(matrix.random[profile]);
    const greedyFightLength = averageFightLength(matrix.greedy[profile]);
    assert.ok(greedyFightLength < randomFightLength,
      `greedy fights must be shorter for ${profile}: ${greedyFightLength} >= ${randomFightLength}`);
  }
}

function assertDeterminism(seed) {
  const first = playMatrix(50, seed);
  const second = playMatrix(50, seed);
  for (const policy of Object.keys(POLICY_FACTORIES)) {
    for (const profile of PROFILES) {
      const meta = { policy, profile };
      const records = first[policy][profile];
      const direct = reduce(records, meta);
      const repeat = reduce(second[policy][profile], meta);
      const reportBytes = serialise(finalise(direct));
      assert.equal(reportBytes, serialise(finalise(repeat)),
        `${policy}/${profile} 50-run report repeat must be byte-identical`);
      const midpoint = records.length / 2;
      const split = merge(
        reduce(records.slice(0, midpoint), meta),
        reduce(records.slice(midpoint), meta),
      );
      assert.equal(serialise(finalise(split)), reportBytes,
        `${policy}/${profile} split/merge report must equal direct report bytes`);
      const reproSeed = seed + 17;
      assert.deepEqual(
        playRun(reproSeed, POLICY_FACTORIES[policy], { profile }),
        playRun(reproSeed, POLICY_FACTORIES[policy], { profile }),
        `${policy}/${profile} same-seed record must be identical`,
      );
    }
  }
}

function assertFaultProbe(seed) {
  const makeFaultyPolicy = (rng) => {
    const base = makeRandomPolicy(rng);
    let injected = false;
    return {
      ...base,
      combatAction(ctx, cb) {
        if (!injected) {
          injected = true;
          return { kind: 'play', uid: '__smoke_fault__', target: 0 };
        }
        return base.combatAction(ctx, cb);
      },
    };
  };
  const record = playRun(seed, makeFaultyPolicy, { profile: 'revealed' });
  assert.ok(record.outcome === 'win' || record.outcome === 'death',
    'faulty-policy probe must still terminate');
  const illegal = record.issues.filter((issue) => issue.kind === 'policy-illegal');
  assert.equal(illegal.length, 1, 'faulty-policy probe must capture exactly one policy-illegal issue');
  assert.match(illegal[0].message, /__smoke_fault__/,
    'faulty-policy probe must capture the injected action');
}

function assertFreshOffersStayCore(matrix) {
  for (const [policy, profiles] of Object.entries(matrix)) {
    for (const record of profiles.fresh) {
      const cardOffers = [
        ...record.drafts.flatMap((draft) => draft.offered),
        ...record.shops.flatMap((shop) => shop.offered.cards),
      ];
      const relicOffers = [
        ...record.bossRelics.flatMap((reward) => reward.offered),
        ...record.shops.flatMap((shop) => shop.offered.relics),
      ];
      assert.deepEqual(cardOffers.filter((id) => POOL_GATE.cards[id]), [],
        `${policy} fresh seed ${record.seed} offered a reveal-gated card`);
      assert.deepEqual(relicOffers.filter((id) => POOL_GATE.relics[id]), [],
        `${policy} fresh seed ${record.seed} offered a reveal-gated relic`);
    }
  }
}

function assertRunRecordParity(matrix) {
  const records = Object.values(matrix).flatMap((profiles) => Object.values(profiles).flat());
  const laterActRecords = records.filter((record) => record.actReached > 0);
  assert.ok(laterActRecords.length > 0, 'smoke fixture must reach a later act');
  for (const record of laterActRecords) {
    assert.ok(record.floorsReached >= record.actReached * MAP_ROWS,
      `seed ${record.seed} must retain completed-act floors`);
  }

  let eventOffer = null;
  const capturingPolicy = (rng) => {
    const base = makeRandomPolicy(rng);
    return {
      ...base,
      eventPending(ctx, pending) {
        if (pending.op === 'pickCard' && !eventOffer) eventOffer = [...pending.options];
        return base.eventPending(ctx, pending);
      },
    };
  };
  for (let seed = 1; seed <= 600 && !eventOffer; seed++) {
    playRun(seed, capturingPolicy, { profile: 'fresh' });
  }
  assert.equal(eventOffer?.length, 5, 'event card choice must use the live five-card offer');
  assert.equal(new Set(eventOffer).size, eventOffer.length, 'event card choice must not contain duplicates');
  assert.deepEqual(eventOffer.filter((id) => POOL_GATE.cards[id]), [],
    'fresh event card choice must stay unlock-aware');

  const stackPolicy = (rng) => {
    const base = makeRandomPolicy(rng);
    let injected = false;
    return {
      ...base,
      combatAction(ctx, cb) {
        if (injected) return base.combatAction(ctx, cb);
        injected = true;
        return Object.defineProperty({}, 'kind', {
          get() { throw new Error('__smoke_stack_probe__'); },
        });
      },
    };
  };
  const stackRecord = playRun(7, stackPolicy, { profile: 'revealed' });
  const stackIssue = stackRecord.issues.find((issue) => issue.message === '__smoke_stack_probe__');
  assert.ok(stackIssue?.stack?.includes('\n'), 'retained engine issue must include the full multi-line stack');
}

function stableReport(report) {
  const copy = structuredClone(report);
  delete copy.meta.date;
  delete copy.meta.durationMs;
  delete copy.meta.workers;
  delete copy.meta.config.workers;
  return serialise(copy);
}

function assertRunnerIntegration() {
  const root = mkdtempSync(join(tmpdir(), 'glassvow-sim-smoke-'));
  const runnerPath = fileURLToPath(new URL('./runner.mjs', import.meta.url));
  const statusPath = join(root, '.sim-reports', '.status.json');
  const run = (workers, filename) => {
    const output = join(root, filename);
    execFileSync(process.execPath, [runnerPath,
      '--runs', '8', '--policy', 'both', '--profile', 'both', '--seed', '31',
      '--workers', String(workers), '--label', 'runner-smoke', '--out', output,
    ], { cwd: root, stdio: 'pipe' });
    const report = JSON.parse(readFileSync(output, 'utf8'));
    const status = JSON.parse(readFileSync(statusPath, 'utf8'));
    assert.equal(status.running, false, `workers=${workers} status must be terminal`);
    assert.equal(status.done, status.total, `workers=${workers} status must reach done === total`);
    return report;
  };
  try {
    const serial = run(1, 'serial.json');
    const parallel = run(4, 'parallel.json');
    assert.equal(stableReport(serial), stableReport(parallel),
      'runner report aggregates must be independent of worker count');
    assert.deepEqual(readdirSync(root).filter((name) => name.endsWith('.tmp')), [],
      'runner must not leave a report publication temp file');

    const concurrentSource = `
      const { spawn } = require('node:child_process');
      const runner = ${JSON.stringify(runnerPath)};
      const launch = (seed, output) => new Promise((resolve, reject) => {
        const child = spawn(process.execPath, [runner,
          '--runs', '2', '--policy', 'random', '--profile', 'revealed',
          '--seed', String(seed), '--workers', '1', '--label', 'concurrent-smoke', '--out', output,
        ], { cwd: process.cwd(), stdio: 'pipe' });
        let stderr = '';
        child.stderr.on('data', (chunk) => { stderr += chunk; });
        child.once('error', reject);
        child.once('exit', (code) => code === 0 ? resolve() : reject(new Error(stderr || \`runner exited \${code}\`)));
      });
      Promise.all([
        launch(51, ${JSON.stringify(join(root, 'concurrent-a.json'))}),
        launch(61, ${JSON.stringify(join(root, 'concurrent-b.json'))}),
      ]).catch((error) => { console.error(error.message); process.exitCode = 1; });
    `;
    execFileSync(process.execPath, ['--eval', concurrentSource], { cwd: root, stdio: 'pipe' });
    assert.deepEqual(readdirSync(join(root, '.sim-reports')).filter((name) => name.endsWith('.tmp')), [],
      'concurrent runners must not share or leave status temp files');

    const runnerUrl = pathToFileURL(runnerPath).href;
    const faultSource = `(async () => {
      const { runSimulation } = await import(${JSON.stringify(runnerUrl)});
      try {
        await runSimulation({ runs: 2, policy: '__smoke_fault__', profile: 'revealed', seed: 1, workers: 2, label: 'fault', out: null });
        process.exitCode = 2;
      } catch {}
    })();`;
    execFileSync(process.execPath, ['--eval', faultSource], { cwd: root, stdio: 'pipe' });
    const failedStatus = JSON.parse(readFileSync(statusPath, 'utf8'));
    assert.equal(failedStatus.running, false, 'worker rejection must leave terminal status');
    assert.match(String(failedStatus.error), /unknown policy/,
      `worker rejection must retain its failure reason: ${failedStatus.error}`);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

export function runSmoke({ runs = SMOKE_RUNS, seed = SMOKE_SEED } = {}) {
  assert.equal(runs, SMOKE_RUNS, `smoke must run exactly ${SMOKE_RUNS} seeds per policy/profile`);
  assert.equal(seed, SMOKE_SEED, `smoke seed must stay fixed at ${SMOKE_SEED}`);
  const matrix = playMatrix(runs, seed);
  assertRecordsHealthy(matrix);
  assertGreedyQuality(matrix);
  assertDeterminism(seed);
  assertFaultProbe(seed);
  assertFreshOffersStayCore(matrix);
  assertRunRecordParity(matrix);
  assertRunnerIntegration();

  return {
    seed,
    runsPerPolicyProfile: runs,
    policies: Object.fromEntries(Object.keys(POLICY_FACTORIES).map((policy) => {
      const records = flattenPolicy(matrix, policy);
      return [policy, {
        runs: records.length,
        wins: wins(records),
        avgTurnsPerFight: averageFightLength(records),
      }];
    })),
  };
}
