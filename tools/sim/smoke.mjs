import assert from 'node:assert/strict';

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

export function runSmoke({ runs = SMOKE_RUNS, seed = SMOKE_SEED } = {}) {
  assert.equal(runs, SMOKE_RUNS, `smoke must run exactly ${SMOKE_RUNS} seeds per policy/profile`);
  assert.equal(seed, SMOKE_SEED, `smoke seed must stay fixed at ${SMOKE_SEED}`);
  const matrix = playMatrix(runs, seed);
  assertRecordsHealthy(matrix);
  assertGreedyQuality(matrix);
  assertDeterminism(seed);
  assertFaultProbe(seed);
  assertFreshOffersStayCore(matrix);

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
