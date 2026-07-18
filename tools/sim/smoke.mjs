import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import {
  MAP_ROWS,
  _captureQuestRngAdapter,
  _restoreQuestRngAdapter,
  _setQuestRng,
  advanceQuest,
  beginShadeDuel,
  gainEmbers,
  genMap,
  journalTerminalOutcome,
  markShadeFall,
  newRun,
  payHollowPrice,
  stageHollowExit,
  startCombat,
  visitNode,
} from '../../src/engine.js';
import { POOL_GATE, QUEST_ACTIVE_STATES, QUEST_IDS, QUESTS } from '../../src/data.js';
import {
  _captureRuntimeAdapters,
  _restoreRuntimeAdapters,
  _setRng,
  _setStore,
  isRevealed,
  revealSnapshot,
} from '../../src/vigil.js';
import { objectiveForRoundRun, objectiveForVigil, playCycle } from './play-cycle.mjs';
import { playRun } from './play-run.mjs';
import { makeWalkerPolicyFactory } from './policy-adapter.mjs';
import { createObservation } from './policies/observation.mjs';
import { getPolicyDefinition, legacyRoundPolicyIds } from './policies/registry.mjs';
import { createMemoryStore } from './runtime-session.mjs';
import {
  CYCLE_SCHEMA_VERSION,
  finaliseCycles,
  mergeCycleAggregates,
  newCycleAggregate,
  reduceCycle,
  serialiseCycles,
} from './cycle-telemetry.mjs';
import { finalise, merge, reduce, serialise } from './telemetry.mjs';
import {
  TRIGGER_CATALOGUE,
  TRIGGER_CATALOGUE_VERSION,
  assertTriggerFunnels,
  createTriggerObserver,
} from './triggers.mjs';

export const SMOKE_RUNS = 300;
export const SMOKE_SEED = 1;

const PROFILES = Object.freeze(['revealed', 'fresh']);
const POLICY_FACTORIES = Object.freeze(Object.fromEntries(
  legacyRoundPolicyIds().map((id) => [id, makeWalkerPolicyFactory(getPolicyDefinition(id))]),
));
const makeGreedyPolicy = POLICY_FACTORIES.greedy;
const makeRandomPolicy = POLICY_FACTORIES.random;

function scriptedRoundExecutor({ completeActive = true, sixthShardFall = false } = {}) {
  return (seed, _makePolicy, config) => {
    const { round } = config;
    const run = newRun(seed, round.start);
    if (completeActive) {
      for (const id of QUEST_IDS) {
        if (!QUEST_ACTIVE_STATES.includes(run.quests[id]?.state)) continue;
        advanceQuest(run, id, QUESTS[id].target);
      }
    }
    const crossesThreshold = run.shards.length === QUEST_IDS.length - 1 && run.questCompletions.length > 0;
    const outcome = sixthShardFall && crossesThreshold ? 'death' : 'win';
    run.act = 2;
    run.floorsClimbed = MAP_ROWS;
    journalTerminalOutcome(run, outcome);
    const result = round.terminal.finalise(run, { revealThreshold: QUEST_IDS.length });
    return {
      seed,
      outcome: result.accepted ? (outcome === 'win' ? 'win' : 'death') : 'error',
      actReached: run.act,
      floorsReached: run.act * MAP_ROWS + run.floorsClimbed,
      issues: result.accepted ? [] : [{ kind: 'engine-error', phase: 'terminal', message: 'scripted terminal rejected' }],
      terminal: {
        intent: outcome === 'win' ? 'dawn' : 'fall',
        accepted: result.accepted,
        outcome,
        newUnlocks: [...result.newUnlocks],
        newShards: [...result.ledger.newShards],
      },
    };
  };
}

function scriptedTerminalRecord(run, round, outcome, fixture = {}) {
  journalTerminalOutcome(run, outcome);
  const result = round.terminal.finalise(run, { revealThreshold: QUEST_IDS.length });
  return {
    seed: run.seed,
    outcome: result.accepted ? (outcome === 'win' ? 'win' : 'death') : 'error',
    actReached: run.act,
    floorsReached: run.act * MAP_ROWS + run.floorsClimbed,
    issues: result.accepted ? [] : [{ kind: 'engine-error', phase: 'terminal', message: 'scripted terminal rejected' }],
    terminal: {
      intent: outcome === 'win' ? 'dawn' : 'fall',
      accepted: result.accepted,
      outcome,
      newUnlocks: [...result.newUnlocks],
      newShards: [...result.ledger.newShards],
    },
    fixture,
  };
}

function shadeCrossRoundExecutor() {
  let setupComplete = false;
  return (seed, _makePolicy, { round }) => {
    const run = newRun(seed, round.start);
    const shade = run.quests.ownShade;
    if (!setupComplete && QUEST_ACTIVE_STATES.includes(shade?.state) && !round.embark.standingMonument) {
      run.act = 1;
      run.floorsClimbed = 6;
      assert.equal(markShadeFall(run, 1, 5), true, 'Shade fixture must use the canonical qualifying-Fall hook');
      const record = scriptedTerminalRecord(run, round, 'death', { shadeSetup: true });
      assert.equal(round.setBequest(1, 5, { kind: 'gold', amount: 50 }), true,
        'Shade fixture must add its bequest through the canonical Vigil port');
      setupComplete = true;
      return record;
    }
    if (round.embark.standingMonument) {
      const transaction = beginShadeDuel(run, round.clearStandingBequest);
      assert.equal(transaction.status, 'ready', 'standing monument must enter the canonical Shade transaction');
      advanceQuest(run, 'ownShade', QUESTS.ownShade.target);
      run.act = Math.min(2, run.act);
      return scriptedTerminalRecord(run, round, 'win', {
        shadeStanding: true,
        transaction: transaction.status,
      });
    }
    run.act = 2;
    return scriptedTerminalRecord(run, round, 'win');
  };
}

function hollowCrossRoundExecutor() {
  let debtCreated = false;
  return (seed, _makePolicy, { round }) => {
    const run = newRun(seed, round.start);
    const hollow = run.quests.hollowLamplighter;
    if (hollow?.memory?.emberDebt > 0) {
      const debt = hollow.memory.emberDebt;
      const combat = startCombat(run, ['sporeling']);
      gainEmbers(run, combat, debt);
      run.act = 2;
      return scriptedTerminalRecord(run, round, 'win', {
        hollowDebtAtStart: debt,
        hollowDebtAfterTithe: run.quests.hollowLamplighter.memory.emberDebt || 0,
      });
    }
    if (!debtCreated && QUEST_ACTIVE_STATES.includes(hollow?.state) &&
        run.questScratch.hollowLamplighter?.due) {
      let node = run.map.nodes.find((candidate) => candidate.unlit);
      for (let act = 1; !node && act <= 2; act += 1) {
        run.act = act;
        run.map = genMap(run);
        node = run.map.nodes.find((candidate) => candidate.unlit);
      }
      assert.ok(node, 'Hollow fixture must find a canonical Unlit Way');
      const visit = visitNode(run, node);
      assert.equal(visit.hollow, true, 'Hollow fixture must enter through visitNode');
      const payment = payHollowPrice(run);
      assert.equal(payment.ok, true, 'Hollow fixture must use the canonical price API');
      assert.equal(payment.deferred, true, 'first Hollow price must create cross-Round ember debt');
      assert.ok(stageHollowExit(run), 'Hollow fixture must stage the canonical routed continuation');
      debtCreated = true;
      run.act = Math.min(run.act, 2);
      return scriptedTerminalRecord(run, round, 'win', {
        hollowDebtCreated: run.quests.hollowLamplighter.memory.emberDebt,
      });
    }
    run.act = 2;
    return scriptedTerminalRecord(run, round, 'win');
  };
}

export function assertCycleOrchestratorContract() {
  const completeExecutor = scriptedRoundExecutor();
  const completed = playCycle(7301, 'progression', { maxRounds: 20, roundExecutor: completeExecutor });
  assert.equal(completed.terminal.status, 'completed', 'scripted fresh cycle must reach the Act IV promise');
  assert.equal(completed.terminal.endpoint, 'Act IV promise', 'completed endpoint must not claim an Act IV victory');
  assert.equal(completed.stagedRound, completed.rounds.length, 'cycle must stop immediately after durable staging');
  assert.equal(completed.stagedRunId, completed.rounds.at(-1).runId,
    'runtime staging must belong to the completing Round run id');
  assert.ok(completed.thresholdRound != null && completed.thresholdRound <= completed.stagedRound,
    'cycle must retain the separate six-Shard threshold Round');
  assert.ok(completed.rounds.every(({ record }) => record.actReached <= 2),
    'no scripted Round may reach a playable Act index above 2');
  for (const round of completed.rounds) {
    assert.deepEqual(round.embark.questSnapshot, round.vigilBefore.quests,
      `Round ${round.ordinal} must start with the complete live quest snapshot`);
    assert.deepEqual(round.embark.revealSnapshot, revealSnapshot(round.vigilBefore),
      `Round ${round.ordinal} must start with the live reveal snapshot`);
    assert.deepEqual(round.embark.unlocks, round.vigilBefore.unlocks);
    assert.deepEqual(round.embark.shards, round.vigilBefore.shards);
    assert.deepEqual(round.embark.lastFall, round.vigilBefore.lastFall);
    assert.equal(round.embark.standingMonument, round.vigilBefore.lastFall?.standing === true);
    assert.equal(round.embark.lamplighter, isRevealed(round.vigilBefore, 'lamplighter'));
    assert.equal(round.embark.runId, round.runId);
  }
  assert.deepEqual(
    playCycle(7301, 'progression', { maxRounds: 20, roundExecutor: scriptedRoundExecutor() }),
    completed,
    'same-seed scripted cycle must repeat byte-for-byte',
  );
  const completedTelemetry = finaliseCycles(reduceCycle(newCycleAggregate({
    mode: 'cycle', policy: 'progression', seed: 7301, maxRounds: 20,
    bootstrapResamples: 32,
  }), completed));
  assert.deepEqual(completedTelemetry.completion.counts, {
    started: 1, completed: 1, censored: 0, failed: 0, timingPopulation: 1,
  }, 'schema-2 telemetry must consume the U4 cycle record without an adapter');
  assert.equal(completedTelemetry.completion.delivery.histogram[0]?.round, completed.stagedRound);

  const censored = playCycle(81, 'progression', {
    maxRounds: 2,
    roundExecutor: scriptedRoundExecutor({ completeActive: false }),
  });
  assert.deepEqual(censored.terminal, { status: 'censored', reason: 'max-rounds', round: 2 });
  assert.equal(censored.rounds.length, 2, 'censored cycle must retain every attempted Round');

  const failed = playCycle(82, 'progression', {
    maxRounds: 5,
    roundExecutor() { throw new Error('__cycle_round_throw__'); },
  });
  assert.equal(failed.terminal.status, 'failed', 'thrown Round must fail its cycle');
  assert.equal(failed.rounds.length, 1, 'failed cycle must not start a later Round from partial state');
  assert.match(failed.rounds[0].record.issues[0].message, /__cycle_round_throw__/);
  assert.equal(failed.terminal.reproduction.cycleSeed, 82);
  assert.equal(failed.terminal.reproduction.roundOrdinal, 1);

  const delayed = playCycle(7302, 'progression', {
    maxRounds: 20,
    roundExecutor: scriptedRoundExecutor({ sixthShardFall: true }),
  });
  assert.equal(delayed.terminal.status, 'completed', 'sixth-Shard Fall fixture must later complete');
  assert.equal(delayed.rounds[delayed.thresholdRound - 1].record.outcome, 'death',
    'sixth Shard must be allowed to land on a Fall');
  assert.equal(delayed.stagedRound, delayed.thresholdRound + 1,
    'sixth Shard on Fall must delay promise staging until the next Dawn');
  assert.equal(delayed.rounds[delayed.stagedRound - 1].record.outcome, 'win');
  assert.equal(delayed.rounds.length, delayed.stagedRound,
    'delayed completion must stop without starting another Round');

  const shade = playCycle(7303, 'progression', {
    maxRounds: 20,
    roundExecutor: shadeCrossRoundExecutor(),
  });
  const shadeSetupIndex = shade.rounds.findIndex(({ record }) => record.fixture?.shadeSetup);
  assert.ok(shadeSetupIndex >= 0, 'Shade fixture must produce a qualifying Fall');
  const shadeDuelRound = shade.rounds[shadeSetupIndex + 1];
  assert.equal(shadeDuelRound.embark.standingMonument, true,
    'the next Round must receive the standing monument in its complete Embark snapshot');
  assert.equal(shadeDuelRound.record.fixture?.shadeStanding, true,
    'the next Round must consume the standing monument through the Shade transaction');
  assert.equal(shadeDuelRound.vigilAfter.lastFall, null,
    'Shade transaction must clear the durable standing monument');

  const hollow = playCycle(7304, 'progression', {
    maxRounds: 20,
    roundExecutor: hollowCrossRoundExecutor(),
  });
  const hollowDebtIndex = hollow.rounds.findIndex(({ record }) => record.fixture?.hollowDebtCreated > 0);
  assert.ok(hollowDebtIndex >= 0, 'Hollow fixture must create the deferred first price');
  const hollowTitheRound = hollow.rounds[hollowDebtIndex + 1];
  assert.ok(hollowTitheRound.embark.questSnapshot.hollowLamplighter.memory.emberDebt > 0,
    'the next Round must receive Hollow debt through the canonical quest snapshot');
  assert.ok(hollowTitheRound.record.fixture?.hollowDebtAtStart > 0,
    'the next Round must observe the carried Hollow debt');
  assert.equal(hollowTitheRound.record.fixture?.hollowDebtAfterTithe, 0,
    'the carried debt must clear through the canonical ember-tithe API');

  const explicitCoverage = playCycle(7305, 'coverage', {
    maxRounds: 2,
    targetId: 'hollow.paid',
    roundExecutor: scriptedRoundExecutor({ completeActive: false }),
  });
  assert.equal(explicitCoverage.targetSelection, 'explicit');
  assert.ok(explicitCoverage.rounds.every((round) =>
    round.targetId === 'hollow.paid'),
  'the reported explicit coverage target must persist through the whole cycle');
  const rotatedA = playCycle(7306, 'coverage', {
    maxRounds: 1,
    roundExecutor: scriptedRoundExecutor({ completeActive: false }),
  });
  const rotatedB = playCycle(7306, 'coverage', {
    maxRounds: 1,
    roundExecutor: scriptedRoundExecutor({ completeActive: false }),
  });
  assert.equal(rotatedA.targetSelection, 'rotation');
  assert.equal(rotatedA.targetId, rotatedB.targetId, 'coverage rotation must be deterministic by cycle seed');

  const workerUrl = new URL('./worker.mjs', import.meta.url).href;
  const workerSource = `
    import { Worker } from 'node:worker_threads';
    const result = await new Promise((resolve, reject) => {
      const worker = new Worker(new URL(${JSON.stringify(workerUrl)}), {
        type: 'module',
        execArgv: [],
        workerData: { mode: 'cycle', policy: 'progression', startSeed: 91, cycles: 2, maxRounds: 1 },
      });
      worker.on('message', (message) => {
        if (message?.type === 'result') resolve(message.partial);
        if (message?.type === 'worker-error') reject(new Error(message.message));
      });
      worker.on('error', reject);
      worker.on('exit', (code) => { if (code !== 0) reject(new Error('worker exit ' + code)); });
    });
    process.stdout.write(JSON.stringify(result));
  `;
  const workerBatch = JSON.parse(execFileSync(process.execPath,
    ['--input-type=module', '--eval', workerSource], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }));
  assert.equal(workerBatch.meta.mode, 'cycle');
  assert.deepEqual(workerBatch.suffixClusters.map(({ cycleSeed }) => cycleSeed), [91, 92],
    'worker batch must retain contiguous whole-cycle seeds');
  assert.ok(workerBatch.suffixClusters.every(({ outcomes }) => outcomes.length === 1),
    'worker must keep every Round of each cycle inside the cycle atom');

  const originalVigilAdapters = _captureRuntimeAdapters();
  const originalQuestAdapter = _captureQuestRngAdapter();
  const originalLocalStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  const outerStore = createMemoryStore({ sentinel: 'outer' });
  const outerArmingRng = () => 0.125;
  const outerQuestRng = () => 0.875;
  try {
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true, enumerable: false, writable: true, value: outerStore,
    });
    _setStore(outerStore);
    _setRng(outerArmingRng);
    _setQuestRng(outerQuestRng);
    const expectedVigilAdapters = _captureRuntimeAdapters();
    const expectedQuestAdapter = _captureQuestRngAdapter();
    for (const cycleSeed of [83, 84]) {
      playCycle(cycleSeed, 'progression', {
        maxRounds: 1,
        roundExecutor: scriptedRoundExecutor({ completeActive: false }),
      });
      const actualVigilAdapters = _captureRuntimeAdapters();
      const actualQuestAdapter = _captureQuestRngAdapter();
      assert.equal(actualVigilAdapters.store, expectedVigilAdapters.store,
        'consecutive cycles must restore the exact prior Vigil store');
      assert.equal(actualVigilAdapters.memory, expectedVigilAdapters.memory,
        'consecutive cycles must restore the exact prior Vigil memory map');
      assert.equal(actualVigilAdapters.armRng, expectedVigilAdapters.armRng,
        'consecutive cycles must restore the exact prior arming RNG');
      assert.equal(actualQuestAdapter.questRngOverride, expectedQuestAdapter.questRngOverride,
        'consecutive cycles must restore the exact prior quest RNG');
      assert.equal(globalThis.localStorage, outerStore,
        'consecutive cycles must restore the exact prior engine storage adapter');
    }
    const thrown = playCycle(85, 'progression', {
      maxRounds: 2,
      roundExecutor() { throw new Error('__restore_after_throw__'); },
    });
    assert.equal(thrown.terminal.status, 'failed');
    assert.equal(_captureRuntimeAdapters().store, outerStore,
      'failed cycle must restore a preinstalled custom Vigil adapter');
    assert.equal(_captureQuestRngAdapter().questRngOverride, outerQuestRng,
      'failed cycle must restore a preinstalled custom quest RNG');
    assert.equal(globalThis.localStorage, outerStore,
      'failed cycle must restore a preinstalled custom engine storage adapter');
  } finally {
    _restoreQuestRngAdapter(originalQuestAdapter);
    _restoreRuntimeAdapters(originalVigilAdapters);
    if (originalLocalStorage) Object.defineProperty(globalThis, 'localStorage', originalLocalStorage);
    else delete globalThis.localStorage;
  }
}

export function assertTriggerObserverContract() {
  assert.equal(TRIGGER_CATALOGUE_VERSION, 1, 'trigger catalogue version must be explicit');
  assert.ok(TRIGGER_CATALOGUE.length >= 26, 'catalogue must cover every required Emberglass funnel');
  const observer = createTriggerObserver({
    policy: 'coverage', cycleSeed: 73, roundOrdinal: 2, runSeed: 701,
    targetId: 'usurper.buy', vigil: { shards: [], act4Promise: { status: 'locked' } },
  });
  const evidence = observer.observe('usurper.buy', {
    unitId: 'shop:1,4', phase: 'shop',
    before: { eligible: true, value: false },
    intent: { action: 'buy' },
    after: { value: true },
  });
  assert.equal(evidence.succeeded, 1, 'observer must derive success from the engine delta');
  assert.deepEqual(observer.funnels()['usurper.buy'], {
    eligible: 1, attempted: 1, succeeded: 1, missed: 0, reasons: {},
  });
  assertTriggerFunnels(observer.funnels());

  for (const definition of TRIGGER_CATALOGUE) {
    const probe = createTriggerObserver({ policy: 'coverage', cycleSeed: 1, roundOrdinal: 1, runSeed: 1 });
    const action = definition.attempt.mode === 'automatic'
      ? { automatic: true }
      : { action: definition.attempt.actions[0] };
    const event = probe.observe(definition.id, {
      unitId: `probe:${definition.id}`, phase: 'probe',
      before: { eligible: true, value: false }, intent: action, after: { value: true },
    });
    assert.equal(event.succeeded, 1, `${definition.id} success delta must be observable`);
    assertTriggerFunnels(probe.funnels());
  }

  const missCases = [
    ['usurper.buy', { action: 'skip', reason: 'insufficient-gold' }, 'insufficient-gold'],
    ['page.take', { action: 'skip', reason: 'skipped' }, 'skipped'],
    ['hollow.paid', { action: 'leave', reason: 'left-unpaid' }, 'left-unpaid'],
    ['shade.standing-monument', { automatic: true }, 'monument-not-reached'],
    ['shade.win', { automatic: true }, 'duel-fall'],
    ['eighth.final-attempt', { automatic: true }, 'final-fall'],
  ];
  for (const [id, intent, reason] of missCases) {
    const probe = createTriggerObserver({ policy: 'coverage', runSeed: 2 });
    const event = probe.observe(id, {
      unitId: `miss:${id}`, phase: 'probe', before: { eligible: true, value: 0 },
      intent, after: { value: 0, reason },
    });
    assert.equal(event.reason, reason, `${id} must retain its closed miss reason`);
    assertTriggerFunnels(probe.funnels());
  }
}

export function assertIntegrationRegressionContracts() {
  const progressionDefinition = getPolicyDefinition('progression');
  const progression = progressionDefinition.factory(() => 0.5);
  const objective = { targetId: 'page.take', currentEligibility: true, disclosed: true };
  const observation = (phase, state, legalActions, selectedObjective = objective) => createObservation({
    phase,
    state,
    legalActions,
    objective: selectedObjective,
    knowledgeClass: 'player-visible',
  });

  const pageDecision = progression.decide(observation('card-reward', { draftFloor: 0 }, [
    { key: 'card:rare', kind: 'card', genericScore: 100, order: 0 },
    { key: 'card:unreadablePage', kind: 'card', genericScore: -5,
      objectivePriority: 'active', order: 1 },
    { key: 'skip', kind: 'skip', genericScore: 0, order: 2 },
  ]));
  assert.equal(pageDecision, 'card:unreadablePage',
    'Page reward must outrank a generically stronger draft while its disclosed goal is active');

  const usurperObjective = { targetId: 'usurper.buy', currentEligibility: true, disclosed: true };
  const affordableUsurper = progression.decide(observation('shop', { gold: 700 }, [
    { key: 'relic:cheap', kind: 'relic', price: 100, sold: false, genericScore: 100, order: 0 },
    { key: 'quest:flamelessLantern', kind: 'quest-item', price: 650, sold: false,
      genericScore: -5, objectivePriority: 'active', order: 1 },
  ], usurperObjective));
  assert.deepEqual(affordableUsurper, ['quest:flamelessLantern'],
    'Usurper shop objective must preserve all 650 gold and buy only the quest item when affordable');
  assert.deepEqual(progression.decide(observation('shop', { gold: 649 }, [
    { key: 'relic:cheap', kind: 'relic', price: 100, sold: false, genericScore: 100, order: 0 },
    { key: 'quest:flamelessLantern', kind: 'quest-item', price: 650, sold: false,
      genericScore: -5, objectivePriority: 'active', order: 1 },
  ], usurperObjective)), [],
  'an unaffordable Usurper objective must preserve gold instead of spending away from 650');
  assert.deepEqual(progression.decide(observation('shop', { gold: 649 }, [
    { key: 'relic:cheap', kind: 'relic', price: 100, sold: false, genericScore: 100, order: 0 },
    { key: 'quest:flamelessLantern', kind: 'quest-item', price: 650, sold: false,
      genericScore: -5, objectivePriority: 'prepare', order: 1 },
  ], { targetId: 'usurper.kill', currentEligibility: false, disclosed: true })), [],
  'a downstream Usurper target must preserve 650 gold while preparing its purchase prerequisite');

  assert.equal(progression.decide(observation('terminal', {}, [
    { key: 'dawn', kind: 'dawn', genericScore: 1, order: 0 },
    { key: 'fall', kind: 'fall', genericScore: 2, order: 1 },
  ])), 'fall', 'Fall remains a legal terminal action after the Run Outcome is already known');

  const disclosedVigil = {
    act4Promise: { status: 'locked' }, lastFall: null,
    quests: Object.fromEntries(QUEST_IDS.map((id) => [id, {
      state: id === 'unreadablePage' ? 'revealed' : 'sealed', progress: 0, memory: {},
    }])),
  };
  const visibleObjective = objectiveForVigil(disclosedVigil);
  assert.deepEqual(visibleObjective, objective,
    'progression receives only the disclosed player-visible goal and current eligibility');
  assert.equal(Object.hasOwn(visibleObjective, 'priority'), false,
    'player-visible objectives must not expose internal arbitration priority');
  assert.deepEqual(objectiveForVigil(disclosedVigil, 'page.read', 'coverage-only'), {
    targetId: 'page.take', currentEligibility: true,
  }, 'coverage must pursue Page acquisition before its requested summit read target');
  const revealedRunState = {
    quests: Object.fromEntries(QUEST_IDS.map((id) => [id, {
      state: 'revealed', progress: 0, memory: {},
    }])),
    lastFall: null,
  };
  assert.deepEqual(new Set(Array.from({ length: QUEST_IDS.length }, (_, seed) =>
    objectiveForRoundRun(revealedRunState, seed)?.targetId)), new Set([
    'pale.kill', 'shade.qualifying-fall', 'usurper.buy',
    'eighth.final-attempt', 'page.take', 'hollow.paid',
  ]), 'Round progression must rotate through every disclosed quest objective');
  const roundProgressionFactory = makeWalkerPolicyFactory(progressionDefinition, {
    objectiveForRun: (run, { seed }) =>
      objectiveForRoundRun(run, seed, progressionDefinition.knowledgeClass),
  });
  const pageRound = playRun(4, roundProgressionFactory, {
    profile: 'revealed', policyId: 'progression', purposefulQuests: true,
  });
  assert.equal(pageRound.triggerFunnels['page.take'].succeeded, 1,
    'Round progression must execute its disclosed Page objective through live flow');
  assert.throws(() => createObservation({
    phase: 'node', state: {}, knowledgeClass: 'player-visible',
    objective: { ...objective, priority: 1 },
    legalActions: [{ key: 'node:one', kind: 'node' }],
  }), /player-visible objective exposes only/,
  'the observation boundary must reject an internal objective priority');

  const shadeStart = { ephemeral: true, quests: {
    ownShade: { state: 'revealed', progress: 0, memory: {} },
  } };
  const shadeRecord = (currentEligibility) => playRun(1,
    makeWalkerPolicyFactory(progressionDefinition, {
      objective: {
        targetId: 'shade.qualifying-fall', currentEligibility, disclosed: true,
      },
    }),
    { policyId: 'progression', round: { start: shadeStart } });
  const eligibleShade = shadeRecord(true);
  const ineligibleShade = shadeRecord(false);
  const intentionalFight = eligibleShade.fights.find(({ act, result }) => act === 1 && result === 'loss');
  assert.equal(eligibleShade.outcome, 'death');
  assert.ok(intentionalFight?.turns > 1 && intentionalFight.energyWaste > 0,
    'eligible Shade setup must repeat the legal end-turn path until the qualifying Fall');
  assert.deepEqual(eligibleShade.issues, [], 'intentional Shade end turns must stay policy-legal');
  assert.equal(eligibleShade.triggerFunnels['shade.qualifying-fall']?.succeeded, 1);
  assert.equal(ineligibleShade.outcome, 'win',
    'the same seed must not intentionally Fall when Shade setup is ineligible');
  assert.deepEqual(ineligibleShade.issues, []);

  const missingPage = playRun(1, makeWalkerPolicyFactory(getPolicyDefinition('greedy')), {
    policyId: 'greedy',
    round: { start: { ephemeral: true, quests: {
      unreadablePage: { state: 'revealed', progress: 0, memory: {} },
    } } },
  });
  assert.equal(missingPage.outcome, 'win', 'Page denominator fixture must reach the summit Dawn');
  assert.deepEqual(missingPage.triggerFunnels['page.carry'], {
    eligible: 1, attempted: 1, succeeded: 0, missed: 1,
    reasons: { 'page-not-held': 1 },
  }, 'an eligible summit without the Page must remain in the carry denominator');
  assert.deepEqual(missingPage.triggerFunnels['page.read'], {
    eligible: 1, attempted: 1, succeeded: 0, missed: 1,
    reasons: { 'page-not-held': 1 },
  }, 'an eligible Dawn without the Page must retain the page-not-held miss reason');

  const missedHollow = playRun(69, makeWalkerPolicyFactory(getPolicyDefinition('greedy')), {
    policyId: 'greedy',
    round: { start: { ephemeral: true, quests: {
      hollowLamplighter: {
        state: 'revealed', progress: 0, memory: { eligibleMisses: 2 },
      },
    } } },
  });
  assert.equal(missedHollow.triggerFunnels['hollow.reachable'].succeeded, 1,
    'Hollow denominator fixture must expose a reachable Unlit choice');
  assert.deepEqual(missedHollow.triggerFunnels['hollow.entered'], {
    eligible: 2, attempted: 0, succeeded: 0, missed: 2,
    reasons: { 'unlit-not-chosen': 2 },
  }, 'every reachable Unlit choice that is not selected must remain in the Hollow entry denominator');
  assert.equal(missedHollow.triggerEvents.find(({ triggerId }) =>
    triggerId === 'hollow.entered')?.repro?.run?.runId, 'run-sim-1x-1',
  'standalone Round trigger evidence must retain a seed-derived reproducible run id');
}

export function assertCoveragePrerequisiteCanary() {
  for (const { id: targetId } of TRIGGER_CATALOGUE) {
    const cycle = playCycle(1, 'coverage', { maxRounds: 45, targetId });
    const succeeded = cycle.rounds.reduce((sum, { record }) =>
      sum + (record.triggerFunnels?.[targetId]?.succeeded || 0), 0);
    assert.ok(succeeded > 0,
      `explicit coverage target ${targetId} must reach its prerequisite chain through live playCycle flow`);
  }
}

export function assertNaturalProgressionCanary() {
  const cycle = playCycle(1, 'progression', { maxRounds: 40 });
  assert.equal(cycle.terminal.status, 'completed',
    'fixed-seed unrigged progression canary must complete fresh-to-promise within 40 Rounds');
  assert.equal(cycle.stagedRound, 36,
    'fixed-seed unrigged progression canary stages the Act IV promise on Round 36');
  assert.equal(cycle.rounds.reduce((sum, { record }) =>
    sum + (record.triggerFunnels?.['act4Reveal.staged']?.succeeded || 0), 0), 1,
  'natural progression canary must observe its same-Round Act IV staging transition once');
  assert.equal(cycle.rounds.flatMap(({ record }) => record.issues || []).length, 0,
    'fixed-seed unrigged progression canary must retain zero simulator issues');
  assert.ok(cycle.rounds.every(({ record }) => record.actReached <= 2),
    'natural progression canary must never create playable Act IV');
}

const cycleRound = (ordinal, outcome, options = {}) => ({
  ordinal,
  runSeed: options.runSeed ?? 10_000 + ordinal,
  record: {
    outcome,
    issues: options.issues || [],
    triggerCatalogueVersion: TRIGGER_CATALOGUE_VERSION,
    triggerFunnels: options.triggerFunnels || {},
    triggerEvents: options.triggerEvents || [],
  },
  vigilAfter: options.vigilAfter || {
    shards: [], act4Promise: { status: 'locked' }, lastFall: null,
  },
});

function syntheticCycle({
  cycleSeed, outcomes, status = 'completed', maxRounds = outcomes.length,
  thresholdRound = null, stagedRound = status === 'completed' ? outcomes.length : null,
  policy = 'progression', targetId = null, targetSelection = null, roundOptions = {},
}) {
  const terminalRound = status === 'censored' ? maxRounds : outcomes.length;
  return {
    cycleSeed, policy, maxRounds, targetId, targetSelection,
    rounds: outcomes.map((outcome, index) => cycleRound(index + 1, outcome, roundOptions[index + 1])),
    thresholdRound,
    stagedRound,
    stagedRunId: stagedRound == null ? null : `run-${cycleSeed}-${stagedRound}`,
    terminal: {
      status,
      reason: status === 'completed' ? 'act4-promise-staged'
        : status === 'censored' ? 'max-rounds' : 'simulator-error',
      round: terminalRound,
    },
  };
}

export function assertCycleTelemetryContract() {
  const meta = {
    mode: 'cycle', policy: 'progression', policyVersion: 1,
    knowledgeClass: 'player-visible', seed: 71, maxRounds: 30,
    bootstrapResamples: 128,
  };
  const ae1 = syntheticCycle({
    cycleSeed: 71,
    outcomes: ['death', 'death', ...Array(8).fill('win')],
    maxRounds: 30, thresholdRound: 9, stagedRound: 10,
  });
  const ae1Report = finaliseCycles(reduceCycle(newCycleAggregate(meta), ae1));
  assert.equal(CYCLE_SCHEMA_VERSION, 2, 'cycle telemetry must be an additive schema-2 source');
  assert.deepEqual(ae1Report.rounds.find(({ ordinal }) => ordinal === 1), {
    ordinal: 1, atRisk: 1, started: 1, dawns: 0, falls: 1, errors: 0,
    winRate: 0, wilson95: [0, 0.793457],
  }, 'AE1 per-ordinal cells must use one reached cycle as their denominator');
  assert.deepEqual(ae1Report.progressiveSuffix.rounds.find(({ ordinal }) => ordinal === 3), {
    ordinal: 3, clusters: 1, n: 8, wins: 8, winRate: 1,
    clusterBootstrap95: [1, 1],
  }, 'AE1 suffix Round 3 must pool the eight attempted Dawns from Round 3 onward');
  assert.deepEqual(ae1Report.progressiveSuffix.perfectSuffixStart, {
    label: 'Descriptive among completed cycles only',
    n: 1,
    histogram: [{ round: 3, count: 1 }],
    p10: 3, p50: 3, p90: 3,
    availability: 'available', message: null,
  }, 'AE1 exact perfect suffix must begin at Round 3');

  const censored = syntheticCycle({
    cycleSeed: 72, outcomes: Array(30).fill('death'), status: 'censored',
    maxRounds: 30, thresholdRound: null, stagedRound: null,
  });
  const failedIssue = {
    kind: 'engine-error', phase: 'combat', message: 'synthetic failure',
    repro: {
      policy: 'progression', cycleSeed: 73, roundOrdinal: 3, runSeed: 10_003,
      phase: 'combat', triggerId: null, reason: 'engine-error', targetId: null,
      vigil: { shards: ['paleOnes'], promise: 'locked' }, run: { act: 1, hp: 0 },
    },
  };
  const failed = syntheticCycle({
    cycleSeed: 73, outcomes: ['win', 'death', 'error'], status: 'failed', maxRounds: 30,
    stagedRound: null, roundOptions: { 3: { issues: [failedIssue] } },
  });
  const early = syntheticCycle({
    cycleSeed: 74, outcomes: Array(4).fill('win'), maxRounds: 30,
    thresholdRound: 4, stagedRound: 4,
  });
  const shadeAndDelayed = syntheticCycle({
    cycleSeed: 75, outcomes: ['win', 'death', 'win'], maxRounds: 30,
    thresholdRound: 2, stagedRound: 3,
    roundOptions: {
      2: { triggerFunnels: {
        'shade.qualifying-fall': {
          eligible: 1, attempted: 1, succeeded: 1, missed: 0, reasons: {},
        },
        'shard.threshold': {
          eligible: 1, attempted: 1, succeeded: 1, missed: 0, reasons: {},
        },
      } },
      3: { triggerFunnels: {
        'act4Reveal.staged': {
          eligible: 1, attempted: 1, succeeded: 1, missed: 0, reasons: {},
        },
      } },
    },
  });
  const usurper = syntheticCycle({
    cycleSeed: 76, policy: 'coverage', targetId: 'usurper.buy', targetSelection: 'explicit',
    outcomes: Array(30).fill('death'), status: 'censored', maxRounds: 30, stagedRound: null,
    roundOptions: { 1: { triggerFunnels: {
      'usurper.offer': { eligible: 1, attempted: 1, succeeded: 1, missed: 0, reasons: {} },
      'usurper.afford': {
        eligible: 1, attempted: 1, succeeded: 0, missed: 1,
        reasons: { 'insufficient-gold': 1 },
      },
      'usurper.buy': {
        eligible: 1, attempted: 0, succeeded: 0, missed: 1,
        reasons: { 'insufficient-gold': 1 },
      },
    }, triggerEvents: [{
      triggerId: 'usurper.buy', phase: 'shop', missed: 1,
      reason: 'insufficient-gold',
      repro: {
        policy: 'coverage', cycleSeed: 76, roundOrdinal: 1, runSeed: 10_001,
        phase: 'shop', triggerId: 'usurper.buy', reason: 'insufficient-gold',
        targetId: 'usurper.buy',
      },
    }] } },
  });

  const cycles = [ae1, censored, failed, early, shadeAndDelayed, usurper];
  const direct = newCycleAggregate(meta);
  for (const cycle of cycles) reduceCycle(direct, cycle);
  const directReport = finaliseCycles(direct);
  const left = newCycleAggregate(meta);
  for (const cycle of cycles.slice(0, 2)) reduceCycle(left, cycle);
  const right = newCycleAggregate(meta);
  for (const cycle of cycles.slice(2)) reduceCycle(right, cycle);
  const split = finaliseCycles(mergeCycleAggregates(left, right));
  const reversed = finaliseCycles(mergeCycleAggregates(right, left));
  const volatileLeft = newCycleAggregate({ ...meta, workers: 1, date: 'partition-a' });
  for (const cycle of cycles.slice(0, 3)) reduceCycle(volatileLeft, cycle);
  const volatileRight = newCycleAggregate({ ...meta, workers: 8, date: 'partition-b' });
  for (const cycle of cycles.slice(3)) reduceCycle(volatileRight, cycle);
  const volatileMerged = finaliseCycles(mergeCycleAggregates(volatileLeft, volatileRight));
  const directBytes = serialiseCycles(directReport);
  assert.equal(serialiseCycles(split), directBytes,
    'cycle telemetry direct reduction must equal split/merge bytes');
  assert.equal(serialiseCycles(reversed), directBytes,
    'cycle aggregate merge order must not affect report bytes');
  assert.equal(serialiseCycles(volatileMerged), directBytes,
    'worker count and wall-clock partition metadata must not affect cycle source bytes');
  assert.equal(serialiseCycles(finaliseCycles(direct)), directBytes,
    'cycle finalisation and deterministic bootstrap must repeat byte-for-byte');

  assert.deepEqual(directReport.completion.counts, {
    started: 6, completed: 3, censored: 2, failed: 1, timingPopulation: 5,
  });
  assert.deepEqual(directReport.completion.rates, {
    completion: 0.5, censoring: 0.333333, failure: 0.166667,
  });
  assert.deepEqual(directReport.completion.completedOnly, {
    label: 'Descriptive among completed cycles only',
    n: 3,
    histogram: [
      { round: 3, count: 1 }, { round: 4, count: 1 }, { round: 10, count: 1 },
    ],
    meanRounds: 5.666667, p10: 3, p50: 4, p90: 10,
    availability: 'available', message: null,
  }, 'completed-only timing must exclude censored and failed cycles');
  assert.deepEqual(directReport.completion.threshold.histogram, [
    { round: 2, count: 1 }, { round: 4, count: 1 }, { round: 9, count: 1 },
  ], 'six-Shard threshold timing must remain separate from delivery timing');
  assert.deepEqual(directReport.completion.delivery.histogram,
    directReport.completion.completedOnly.histogram,
  'delivery timing must use the staged Act IV promise Round');
  assert.equal(directReport.completion.kaplanMeier.population.failedExcluded, 1,
    'failed cycles must be excluded from the completion-time population');
  assert.ok(directReport.completion.kaplanMeier.cells.some((cell) =>
    cell.round === 30 && cell.censored > 0),
  'AE2 max-Round censoring must contribute a Kaplan-Meier censor cell');
  assert.equal(Number.isFinite(directReport.completion.kaplanMeier.restrictedMeanRounds.value), true,
    'restricted mean through maxRounds must remain finite');
  assert.deepEqual(directReport.completion.kaplanMeier.quantiles, {
    p10: 3, p50: 10, p90: null,
  }, 'Kaplan-Meier quantiles must be unavailable when the event curve never reaches them');
  assert.deepEqual(directReport.completion.kaplanMeier.restrictedMeanRounds, {
    through: 30, value: 15.4,
  }, 'restricted mean must integrate completed events and max-Round censors');
  assert.deepEqual(directReport.progressiveSuffix.metadata, {
    method: 'whole-cycle cluster bootstrap percentile 95%',
    resamples: 128,
    seed: directReport.progressiveSuffix.metadata.seed,
    unit: 'cycle',
  }, 'suffix interval metadata must name its whole-cycle cluster method and resample count');
  assert.deepEqual(directReport.triggers.funnels['usurper.buy'], {
    eligible: 1, attempted: 0, succeeded: 0, missed: 1,
    reasons: { 'insufficient-gold': 1 },
  }, 'AE3 unaffordable offer must not fabricate a purchase attempt');
  assert.equal(directReport.triggers.funnels['shade.qualifying-fall'].succeeded, 1,
    'AE4 intentional Shade Fall remains a successful setup trigger');
  assert.equal(directReport.triggers.funnels['act4Reveal.staged'].succeeded, 1,
    'AE5 delayed Dawn must record durable staging independently of threshold');
  assert.ok(directReport.issues.some(({ reproduction }) =>
    reproduction?.cycleSeed === 73 && reproduction?.roundOrdinal === 3 &&
    reproduction?.command.includes('--cycles 1')),
  'cycle issues must retain a copyable one-cycle reproduction command');
  assert.ok(directReport.issues.some(({ kind, triggerId, reproduction }) =>
    kind === 'target-missed' && triggerId === 'usurper.buy' &&
    reproduction?.command.includes('--target usurper.buy')),
  'failed explicit coverage targets must retain target-specific reproduction');
  assert.ok(directReport.issues.some(({ kind, reproduction }) =>
    kind === 'target-missed' && reproduction?.roundOrdinal === 1 &&
    reproduction?.runSeed === 10_001 && reproduction?.phase === 'shop' &&
    reproduction?.reason === 'insufficient-gold'),
  'failed explicit targets must reproduce the Round and phase of an observed miss');

  const allCensored = finaliseCycles(reduceCycle(newCycleAggregate(meta), censored));
  assert.equal(allCensored.completion.rates.completion, 0, 'AE7 completion rate is zero');
  assert.deepEqual(allCensored.completion.completedOnly, {
    label: 'Descriptive among completed cycles only', n: 0, histogram: [],
    meanRounds: null, p10: null, p50: null, p90: null,
    availability: 'unavailable', message: 'No completed cycles',
  }, 'AE7 all-censored completion-only statistics must be unavailable, never zero/NaN');
  assert.deepEqual(allCensored.progressiveSuffix.perfectSuffixStart, {
    label: 'Descriptive among completed cycles only', n: 0, histogram: [],
    p10: null, p50: null, p90: null,
    availability: 'unavailable', message: 'No completed cycles',
  });
  assert.equal(JSON.stringify(allCensored).includes('NaN'), false);

  const badOrdering = syntheticCycle({
    cycleSeed: 80, outcomes: ['death'], status: 'censored', maxRounds: 1, stagedRound: null,
    roundOptions: { 1: { triggerFunnels: {
      'page.take': { eligible: 0, attempted: 1, succeeded: 1, missed: 0, reasons: {} },
    } } },
  });
  assert.throws(() => reduceCycle(newCycleAggregate({ ...meta, maxRounds: 1 }), badOrdering),
    /succeeded <= attempted <= eligible/,
  'invalid funnel ordering must fail at the telemetry boundary');
  const badReason = syntheticCycle({
    cycleSeed: 81, outcomes: ['death'], status: 'censored', maxRounds: 1, stagedRound: null,
    roundOptions: { 1: { triggerFunnels: {
      'page.take': {
        eligible: 1, attempted: 0, succeeded: 0, missed: 1,
        reasons: { invented: 1 },
      },
    } } },
  });
  assert.throws(() => reduceCycle(newCycleAggregate({ ...meta, maxRounds: 1 }), badReason), /unknown miss reason/,
    'open-ended trigger miss reasons must fail at the telemetry boundary');
}

function assertRoundParityFixture() {
  const quests = Object.fromEntries([
    'paleOnes', 'ownShade', 'usurper', 'eighthOmen', 'unreadablePage', 'hollowLamplighter',
  ].map((id) => [id, {
    state: 'revealed', progress: 0,
    memory: id === 'hollowLamplighter' ? { eligibleMisses: 2 }
      : id === 'eighthOmen' ? { dueIn: 1 } : {},
  }]));
  const scriptedFactory = (rng) => {
    const base = makeGreedyPolicy(rng);
    return {
      ...base,
      pickNode(ctx, nodes) {
        return nodes.find((node) => node.type === 'monument')
          || nodes.find((node) => node.unlit)
          || nodes.find((node) => node.type === 'shop')
          || nodes.find((node) => node.type === 'rest')
          || base.pickNode(ctx, nodes);
      },
      pickBossRelic() { return null; },
      pickCardReward(ctx, ids) {
        return ids.includes('unreadablePage') ? 'unreadablePage' : base.pickCardReward(ctx, ids);
      },
      shopPlan(ctx, shop) {
        let gold = ctx.run.player.gold;
        const plan = [];
        const questItem = shop.questItems?.[0];
        if (questItem && questItem.price <= gold) {
          plan.push({ _simKind: 'quest-item', id: questItem.id });
          gold -= questItem.price;
        }
        const removable = ctx.run.player.deck.find((card) => card.id === 'strike');
        if (removable && shop.removeCost <= gold) {
          plan.push({ _simKind: 'remove', uid: removable.uid });
          gold -= shop.removeCost;
        }
        for (const potion of shop.potions) {
          if (potion.price > gold) continue;
          plan.push(potion);
          gold -= potion.price;
        }
        return plan;
      },
      hollowDecision() { return { kind: 'pay' }; },
      monumentDecision() { return 'duel'; },
      terminalIntent(_ctx, actions) { return actions[0]; },
      pickBequest(_ctx, offers) { return offers[0] || null; },
    };
  };
  const records = Array.from({ length: 100 }, (_, index) => playRun(index + 1, scriptedFactory, {
    policyId: 'coverage',
    round: {
      start: {
        ephemeral: true, lamplighter: true, quests,
        monument: { act: 1, row: 5, bequest: { kind: 'gold', amount: 40 }, standing: true, shadeAspect: 0 },
      },
      terminal: { finalise: (_run, _options) => ({ accepted: true, outcome: _run.pendingRunEnd.outcome, newUnlocks: [], ledger: { newShards: [], vigil: { shards: [], act4Promise: { status: 'locked' } } } }) },
      setBequest: () => true,
    },
  }));
  assert.ok(records.every((record) => record.lamplighter?.boon && record.lamplighter?.art),
    'scripted Round must make a first-class Lamplighter boon/Art choice');
  assert.ok(records.flatMap((record) => record.shops).some((shop) => shop.removed),
    'scripted Round cohort must exercise live shop removal');
  assert.ok(records.flatMap((record) => record.shops).some((shop) =>
    shop.bought.some((item) => item.kind === 'quest-item')),
  'scripted Round cohort must buy the live Usurper quest item');
  assert.ok(records.flatMap((record) => record.shops).some((shop) => shop.failedPotionPurchases > 0),
    'full potion slots must reject a purchase without spending gold');
  assert.ok(records.flatMap((record) => record.bossRelics).some((reward) => reward.picked === null),
    'boss relic skip must be a legal first-class action');
  assert.ok(records.flatMap((record) => record.hollow).some((meeting) => meeting.paid),
    'Hollow pay and routed continuation must execute through engine calls');
  assert.ok(records.flatMap((record) => record.monuments).some((monument) => monument.duel),
    'standing monument must route into the Shade duel');
  assert.ok(records.every((record) => record.terminal?.intent),
    'every completed scripted Round must retain terminal intent evidence');
  for (const record of records) {
    assert.deepEqual(record.issues, [], `scripted seed ${record.seed} must stay legal`);
    for (const rest of record.rests.filter(({ decision }) => decision === 'heal')) {
      assert.equal(rest.healRequested, Math.round(rest.maxHp * rest.healFrac),
        `seed ${record.seed} rest must use restHealFrac`);
    }
    for (const transition of record.actTransitions) {
      assert.equal(transition.to, transition.from + 1, 'act transition must use the canonical successor');
      assert.ok(Object.hasOwn(transition, 'omen'), 'act transition must roll the next Omen');
      assert.equal(transition.expectedHeal, Math.round(transition.maxHp * 0.35),
        'act transition must request canonical 35% healing');
    }
    assertTriggerFunnels(record.triggerFunnels);
  }
  const triggerIds = new Set(records.flatMap((record) => record.triggerEvents.map(({ triggerId }) => triggerId)));
  for (const id of [
    'pale.hidden-encounter', 'shade.duel', 'shade.win', 'usurper.offer', 'usurper.buy',
    'usurper.transformed-summit', 'usurper.kill', 'eighth.final-attempt', 'eighth.dawn',
    'page.offer', 'page.take', 'page.carry', 'page.read', 'hollow.entered', 'hollow.paid',
    'hollow.progressed',
  ]) assert.ok(triggerIds.has(id), `scripted Round cohort must observe ${id}`);
}

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

const sha256 = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');

// Characterised before the U2 policy-boundary refactor. These hashes freeze
// both the chosen-action trace and complete records for unchanged PR31 legal
// surfaces; named U3 live-flow additions may replace this fixture deliberately.
const GREEDY_CHARACTERISATION = Object.freeze({
  fresh: Object.freeze({
    dawns: 20,
    issues: 0,
    actionCount: 13_822,
    traceDigest: '8e6a927690e96c180d161afdb3b088ce24e61800ea927d1dda7ff074d6ddfe34',
    recordDigest: '730f40d75f2b60f955629f21fb8d96cce86afa9afe19911b32e55c03276f5025',
  }),
  revealed: Object.freeze({
    dawns: 22,
    issues: 0,
    actionCount: 13_690,
    traceDigest: '964ff9fce165a0a8d7da8aab7d68d60c87e21d53bce3eb3cce9d50307e6cef27',
    recordDigest: '2a72352c2501c09ed838c988e7a65a283a36a6f0a6820dc8179115949ed9e97c',
  }),
});

function assertGreedyCharacterisation() {
  for (const profile of PROFILES) {
    const traces = [];
    const records = [];
    for (let seed = 1; seed <= 24; seed++) {
      const trace = [];
      const captureFactory = (rng) => {
        const policy = makeGreedyPolicy(rng);
        return Object.fromEntries(Object.entries(policy).map(([name, decide]) => [name, (...args) => {
          const result = decide(...args);
          let action = result;
          if (name === 'pickNode') action = result?.id ?? null;
          else if (name === 'eventChoice') action = args[2].indexOf(result);
          else if (name === 'shopPlan') action = result.map((item) => ({ id: item.id, price: item.price }));
          trace.push([name, action]);
          return result;
        }]));
      };
      records.push(playRun(seed, captureFactory, { profile }));
      traces.push(trace);
    }
    const actual = {
      dawns: wins(records),
      issues: records.flatMap(({ issues }) => issues).length,
      actionCount: traces.reduce((sum, trace) => sum + trace.length, 0),
      traceDigest: sha256(traces),
      recordDigest: sha256(records),
    };
    assert.deepEqual(actual, GREEDY_CHARACTERISATION[profile],
      `greedy ${profile} fixed-seed trace/report cohort must stay characterised`);
  }
}

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

function stableReport(report, serialiser = serialise) {
  const copy = structuredClone(report);
  delete copy.meta.date;
  delete copy.meta.durationMs;
  delete copy.meta.workers;
  delete copy.meta.config.workers;
  return serialiser(copy);
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
  const runCycle = (workers, filename) => {
    const output = join(root, filename);
    execFileSync(process.execPath, [runnerPath,
      '--mode', 'cycle', '--cycles', '2', '--max-rounds', '1',
      '--policy', 'progression', '--seed', '31', '--workers', String(workers),
      '--label', 'cycle-runner-smoke', '--out', output,
    ], { cwd: root, stdio: 'pipe' });
    const report = JSON.parse(readFileSync(output, 'utf8'));
    const status = JSON.parse(readFileSync(statusPath, 'utf8'));
    assert.equal(status.running, false, `cycle workers=${workers} status must be terminal`);
    assert.equal(status.done, status.total, `cycle workers=${workers} status must reach done === total`);
    assert.equal(report.meta.schema, CYCLE_SCHEMA_VERSION);
    assert.equal(report.policies.progression.completion.counts.started, 2);
    return report;
  };
  const runRoundProgression = () => {
    const output = join(root, 'round-progression.json');
    execFileSync(process.execPath, [runnerPath,
      '--mode', 'round', '--runs', '2', '--policy', 'progression',
      '--profile', 'revealed', '--seed', '4', '--workers', '1',
      '--label', 'round-progression-smoke', '--out', output,
    ], { cwd: root, stdio: 'pipe' });
    return JSON.parse(readFileSync(output, 'utf8'));
  };
  try {
    const runnerUrl = pathToFileURL(runnerPath).href;
    const parserSource = `
      import assert from 'node:assert/strict';
      import { parseArgs } from ${JSON.stringify(runnerUrl)};
      assert.throws(() => parseArgs(['--mode', 'cycle', '--runs', '1']), /--runs/);
      assert.throws(() => parseArgs(['--mode', 'cycle', '--profile', 'fresh']), /--profile/);
      assert.throws(() => parseArgs(['--mode', 'round', '--cycles', '1']), /--cycles/);
      assert.throws(() => parseArgs(['--mode', 'round', '--target', 'usurper.buy']), /--target/);
      assert.throws(() => parseArgs(['--mode', 'round', '--runs', '1000001']), /--runs must be <= 1000000/);
      assert.throws(() => parseArgs(['--mode', 'cycle', '--cycles', '1000001']), /--cycles must be <= 1000000/);
      assert.throws(() => parseArgs([
        '--mode', 'cycle', '--cycles', '101', '--max-rounds', '1000', '--policy', 'progression',
      ]), /cycles \\* maxRounds must be <= 100000/);
      assert.throws(() => parseArgs(['--workers', '33']), /--workers must be <= 32/);
      assert.equal(parseArgs([
        '--mode', 'cycle', '--cycles', '1', '--max-rounds', '1',
        '--policy', 'coverage', '--target', 'usurper.buy',
      ]).target, 'usurper.buy');
    `;
    execFileSync(process.execPath, ['--input-type=module', '--eval', parserSource], {
      cwd: root, stdio: 'pipe',
    });

    const serial = run(1, 'serial.json');
    const parallel = run(4, 'parallel.json');
    assert.equal(stableReport(serial), stableReport(parallel),
      'runner report aggregates must be independent of worker count');
    assert.deepEqual(readdirSync(root).filter((name) => name.endsWith('.tmp')), [],
      'runner must not leave a report publication temp file');

    const cycleSerial = runCycle(1, 'cycle-serial.json');
    const cycleParallel = runCycle(2, 'cycle-parallel.json');
    assert.equal(stableReport(cycleSerial, serialiseCycles),
      stableReport(cycleParallel, serialiseCycles),
    'cycle runner reports must be byte-stable independent of worker count');

    const roundProgression = runRoundProgression();
    assert.deepEqual(roundProgression.policies.progression.meta, {
      interpretation: {
        balanceEligible: true,
        id: 'goal-directed-machine',
        label: 'Goal-directed machine-policy evidence',
      },
      knowledgeClass: 'player-visible',
      mode: 'round',
      policyId: 'progression',
      policyVersion: 1,
      runs: 2,
      schema: 1,
    }, 'Round reports must retain machine-policy provenance and interpretation');

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
  assertTriggerObserverContract();
  assertIntegrationRegressionContracts();
  assertCycleTelemetryContract();
  assert.equal(typeof playCycle, 'function', 'Full Cycle orchestrator must be available to smoke');
  assertCycleOrchestratorContract();
  assertCoveragePrerequisiteCanary();
  assertNaturalProgressionCanary();
  assertRoundParityFixture();
  const matrix = playMatrix(runs, seed);
  assertRecordsHealthy(matrix);
  assertGreedyQuality(matrix);
  assertGreedyCharacterisation();
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
