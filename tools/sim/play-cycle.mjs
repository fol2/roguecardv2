import { ASPECTS, BOONS, QUEST_ACTIVE_STATES, QUEST_IDS } from '../../src/data.js';
import {
  clearSave,
  commitRunStats,
  saveRun,
} from '../../src/engine.js';
import { createTerminalCoordinator } from '../../src/run-lifecycle.js';
import {
  claimAct4Promise,
  clearBequest,
  commitTerminalVigil,
  isRevealed,
  loadVigil,
  questSnapshot,
  revealSnapshot,
  setBequest,
} from '../../src/vigil.js';
import { playRun, mulberry32 } from './play-run.mjs';
import { makeWalkerPolicyFactory } from './policy-adapter.mjs';
import { getPolicyDefinition } from './policies/registry.mjs';
import { createMemoryStore, withSimulatorRuntime } from './runtime-session.mjs';
import { getTriggerDefinition, triggerIds } from './triggers.mjs';

const DEFAULT_MAX_ROUNDS = 100;
const PROMISE_TARGET = 'act4Reveal.staged';
const QUEST_TARGETS = Object.freeze({
  paleOnes: 'pale.kill',
  ownShade: 'shade.qualifying-fall',
  usurper: 'usurper.buy',
  eighthOmen: 'eighth.final-attempt',
  unreadablePage: 'page.take',
  hollowLamplighter: 'hollow.paid',
});
const TARGET_QUEST = Object.freeze({
  pale: 'paleOnes',
  shade: 'ownShade',
  usurper: 'usurper',
  eighth: 'eighthOmen',
  page: 'unreadablePage',
  hollow: 'hollowLamplighter',
});
const BOON_IDS = Object.freeze(Object.keys(BOONS));

const clone = (value) => value == null ? value : structuredClone(value);
const compactError = (error) => ({
  message: String(error?.message ?? error),
  ...(typeof error?.stack === 'string' ? { stack: error.stack.trim().slice(0, 8_192) } : {}),
});

function requireSeed(seed) {
  if (!Number.isSafeInteger(seed) || seed < 0) throw new RangeError('cycleSeed must be a non-negative safe integer');
  return seed;
}

function requireMaxRounds(value) {
  if (!Number.isSafeInteger(value) || value < 1) throw new RangeError('maxRounds must be a positive safe integer');
  return value;
}

// Stable 32-bit lane derivation. Every stochastic input for a Round owns a
// distinct salt, so adding policy deliberation cannot perturb engine/quest RNG.
function deriveCycleSeed(cycleSeed, ordinal, salt) {
  let value = (cycleSeed >>> 0) ^ Math.imul(ordinal >>> 0, 0x9e3779b1) ^ (salt >>> 0);
  value = Math.imul(value ^ (value >>> 16), 0x21f0aaad);
  value = Math.imul(value ^ (value >>> 15), 0x735a2d97);
  return (value ^ (value >>> 15)) >>> 0;
}

function runIdFor(cycleSeed, ordinal, runSeed) {
  return `run-${(cycleSeed >>> 0).toString(36)}-${ordinal.toString(36)}-${runSeed.toString(36)}`;
}

function questVisibleActive(vigil, id) {
  return vigil?.quests?.[id]?.state === 'revealed';
}

function targetEligibility(vigil, targetId) {
  if (targetId === PROMISE_TARGET) return vigil?.act4Promise?.status === 'pending';
  if (targetId === 'shard.threshold') {
    return (vigil?.shards?.length || 0) === QUEST_IDS.length - 1 &&
      QUEST_IDS.some((id) => questVisibleActive(vigil, id));
  }
  if (targetId.startsWith('shade.standing') || targetId === 'shade.duel' || targetId === 'shade.win') {
    return vigil?.lastFall?.standing === true && questVisibleActive(vigil, 'ownShade');
  }
  if (targetId === 'shade.qualifying-fall') {
    return questVisibleActive(vigil, 'ownShade') && vigil?.lastFall?.standing !== true;
  }
  if (targetId.startsWith('hollow.')) {
    const quest = vigil?.quests?.hollowLamplighter;
    if (quest?.state !== 'revealed') return false;
    if (targetId === 'hollow.progressed') return quest.memory?.emberDebt > 0 || quest.progress < 5;
    return !quest.memory?.emberDebt;
  }
  const prefix = targetId.split('.')[0];
  const questId = TARGET_QUEST[prefix];
  return questId ? questVisibleActive(vigil, questId) : false;
}

export function objectiveForVigil(vigil, explicitTargetId = null, knowledgeClass = 'player-visible') {
  const visibleObjective = (targetId, currentEligibility) => Object.freeze({
    targetId,
    currentEligibility,
    ...(knowledgeClass === 'player-visible' ? { disclosed: true } : {}),
  });
  if (explicitTargetId) return visibleObjective(
    explicitTargetId,
    targetEligibility(vigil, explicitTargetId),
  );
  if (vigil?.act4Promise?.status === 'pending') return Object.freeze({
    ...visibleObjective(PROMISE_TARGET, true),
  });
  if (vigil?.lastFall?.standing === true && questVisibleActive(vigil, 'ownShade')) {
    return visibleObjective('shade.duel', true);
  }
  const hollow = vigil?.quests?.hollowLamplighter;
  if (hollow?.state === 'revealed' && hollow.memory?.emberDebt > 0) {
    return visibleObjective('hollow.progressed', true);
  }
  for (const id of QUEST_IDS) {
    if (!questVisibleActive(vigil, id)) continue;
    const targetId = QUEST_TARGETS[id];
    return visibleObjective(targetId, targetEligibility(vigil, targetId));
  }
  return null;
}

function explicitOrRotatedTarget(cycleSeed, policy, requested) {
  if (requested != null) {
    if (policy !== 'coverage') throw new TypeError('explicit target is available only to coverage cycles');
    if (!getTriggerDefinition(requested)) throw new TypeError(`unknown coverage target: ${requested}`);
    return requested;
  }
  if (policy !== 'coverage') return null;
  const ids = triggerIds();
  return ids[deriveCycleSeed(cycleSeed, 0, 0x74617267) % ids.length];
}

function cellForRound(vigil, cycleSeed, ordinal) {
  const cellSeed = deriveCycleSeed(cycleSeed, ordinal, 0x63656c6c);
  const aspect = vigil.unlocks.includes('aspect2') ? cellSeed % ASPECTS.length : 0;
  const vow = deriveCycleSeed(cycleSeed, ordinal, 0x766f7700) % ((vigil.vowUnlocked || 0) + 1);
  return Object.freeze({
    seed: cellSeed,
    aspect,
    vow,
    boon: BOON_IDS[deriveCycleSeed(cycleSeed, ordinal, 0x626f6f6e) % BOON_IDS.length],
    monument: vigil.lastFall != null,
  });
}

function embarkForRound(vigil, cell, runId) {
  const quests = questSnapshot(vigil);
  const reveals = revealSnapshot(vigil);
  const lastFall = clone(vigil.lastFall);
  const embark = {
    questSnapshot: clone(quests),
    revealSnapshot: [...reveals],
    unlocks: [...vigil.unlocks],
    shards: [...vigil.shards],
    lastFall,
    standingMonument: lastFall?.standing === true,
    lamplighter: isRevealed(vigil, 'lamplighter'),
    aspect: cell.aspect,
    vow: cell.vow,
    boonInput: cell.boon,
    runId,
  };
  return Object.freeze({
    snapshot: embark,
    runOptions: {
      runId,
      aspect: cell.aspect,
      vow: cell.vow,
      lamplighter: embark.lamplighter,
      monument: clone(lastFall),
      unlocks: [...embark.unlocks],
      reveals: [...embark.revealSnapshot],
      quests: clone(embark.questSnapshot),
      shards: [...embark.shards],
      ephemeral: false,
    },
  });
}

function vigilDelta(before, after) {
  const questChanges = {};
  for (const id of QUEST_IDS) {
    if (JSON.stringify(before.quests?.[id]) === JSON.stringify(after.quests?.[id])) continue;
    questChanges[id] = { before: clone(before.quests?.[id]), after: clone(after.quests?.[id]) };
  }
  return {
    runsPlayed: (after.runsPlayed || 0) - (before.runsPlayed || 0),
    wins: (after.deeds?.wins || 0) - (before.deeds?.wins || 0),
    newShards: after.shards.filter((id) => !before.shards.includes(id)),
    newUnlocks: after.unlocks.filter((id) => !before.unlocks.includes(id)),
    quests: questChanges,
    lastFall: JSON.stringify(before.lastFall) === JSON.stringify(after.lastFall)
      ? null : { before: clone(before.lastFall), after: clone(after.lastFall) },
    act4Promise: JSON.stringify(before.act4Promise) === JSON.stringify(after.act4Promise)
      ? null : { before: clone(before.act4Promise), after: clone(after.act4Promise) },
  };
}

function terminalPorts() {
  const coordinator = createTerminalCoordinator({
    commitVigil: (run, outcome) => commitTerminalVigil(run, outcome),
    commitStats: (run, won) => commitRunStats(run, won),
    saveRun: (run) => saveRun(run),
    clearSave: (runId) => clearSave(runId),
    loadVigil: () => loadVigil(),
    claimAct4Promise: (runId) => claimAct4Promise(runId),
  });
  return Object.freeze({
    ...coordinator,
    finalise(run, options) {
      const result = coordinator.finalise(run, options);
      if (result.accepted !== true || result.outcome !== 'win') return result;
      while (run.pendingDawn && run.pendingDawn.cursor < run.pendingDawn.events.length) {
        if (!coordinator.advanceDawn(run, run.pendingDawn.cursor + 1)) return { ...result, accepted: false };
      }
      return coordinator.completeDawn(run) ? result : { ...result, accepted: false };
    },
  });
}

function failedRoundRecord(error, identity) {
  const failure = compactError(error);
  return {
    seed: identity.runSeed,
    outcome: 'error',
    actReached: 0,
    issues: [{
      kind: 'engine-error', phase: 'cycle', ...failure,
      repro: { ...identity, phase: 'cycle', triggerId: identity.targetId, reason: 'simulator-error' },
    }],
  };
}

function failureReproduction(cycleSeed, policy, round, targetId) {
  const issue = round.record?.issues?.[0];
  return {
    policy,
    cycleSeed,
    roundOrdinal: round.ordinal,
    runSeed: round.runSeed,
    phase: issue?.phase || 'cycle',
    triggerId: issue?.repro?.triggerId || targetId || null,
    reason: issue?.kind || 'simulator-error',
    targetId,
    vigil: {
      shards: [...round.vigilAfter.shards],
      promise: round.vigilAfter.act4Promise?.status || null,
      lastFallStanding: round.vigilAfter.lastFall?.standing === true,
    },
    run: issue?.repro?.run || null,
  };
}

export function playCycle(cycleSeed, policy, config = {}) {
  requireSeed(cycleSeed);
  const maxRounds = requireMaxRounds(config.maxRounds ?? DEFAULT_MAX_ROUNDS);
  const definition = getPolicyDefinition(policy);
  if (!definition) throw new TypeError(`unknown policy: ${policy}`);
  if (!definition.modes.includes('cycle')) throw new TypeError(`policy ${policy} does not support cycle mode`);
  const requestedTarget = config.targetId ?? config.target ?? null;
  const targetId = explicitOrRotatedTarget(cycleSeed, policy, requestedTarget);
  const roundExecutor = config.roundExecutor || playRun;
  if (typeof roundExecutor !== 'function') throw new TypeError('roundExecutor must be a function');

  const sessionSeed = deriveCycleSeed(cycleSeed, 0, 0x73657373);
  return withSimulatorRuntime({
    store: config.store || createMemoryStore(),
    armingRng: mulberry32(deriveCycleSeed(sessionSeed, 0, 0x61726d00)),
    questRng: mulberry32(deriveCycleSeed(sessionSeed, 0, 0x71756573)),
  }, (session) => {
    // Loading the empty isolated store creates the canonical fresh Vigil.
    const initialVigil = clone(loadVigil());
    const rounds = [];
    let thresholdRound = null;
    let stagedRound = null;
    let stagedRunId = null;
    let terminal = null;

    for (let ordinal = 1; ordinal <= maxRounds; ordinal += 1) {
      const runSeed = deriveCycleSeed(cycleSeed, ordinal, 0x72756e00);
      const policySeed = deriveCycleSeed(cycleSeed, ordinal, 0x706f6c00);
      const armingSeed = deriveCycleSeed(cycleSeed, ordinal, 0x61726d00);
      const questSeed = deriveCycleSeed(cycleSeed, ordinal, 0x71756573);
      const runId = runIdFor(cycleSeed, ordinal, runSeed);
      session.installRoundRng({ armingRng: mulberry32(armingSeed), questRng: mulberry32(questSeed) });

      const vigilBefore = clone(loadVigil());
      const cell = cellForRound(vigilBefore, cycleSeed, ordinal);
      const embark = embarkForRound(vigilBefore, cell, runId);
      const objective = objectiveForVigil(vigilBefore, targetId, definition.knowledgeClass);
      const baseFactory = makeWalkerPolicyFactory(definition, {
        objective,
        cycleSeed,
        roundOrdinal: ordinal,
        targetId,
      });
      const makePolicy = () => baseFactory(mulberry32(policySeed));
      const ports = terminalPorts();
      const identity = { policy, cycleSeed, roundOrdinal: ordinal, runSeed, targetId };
      let record;
      try {
        record = roundExecutor(runSeed, makePolicy, {
          profile: 'fresh',
          policyId: policy,
          cycleSeed,
          roundOrdinal: ordinal,
          targetId,
          round: {
            ordinal,
            cycleSeed,
            policyId: policy,
            targetId,
            objective,
            vigil: clone(vigilBefore),
            embark: clone(embark.snapshot),
            start: clone(embark.runOptions),
            cell: { ...cell },
            terminal: ports,
            readVigil: () => loadVigil(),
            clearStandingBequest: () => clearBequest(),
            setBequest: (act, row, bequest) => setBequest(act, row, bequest),
          },
        });
      } catch (error) {
        record = failedRoundRecord(error, identity);
      }
      if (!record || typeof record !== 'object') {
        record = failedRoundRecord(new TypeError('Round executor returned no record'), identity);
      }
      if (Number(record.actReached) > 2) {
        record = clone(record);
        record.outcome = 'error';
        record.issues ||= [];
        record.issues.push({
          kind: 'invariant', phase: 'cycle', message: `playable Act index exceeded 2: ${record.actReached}`,
          repro: { ...identity, phase: 'cycle', triggerId: targetId, reason: 'act-index' },
        });
      }

      const vigilAfter = clone(loadVigil());
      const round = {
        ordinal,
        runSeed,
        policySeed,
        armingSeed,
        questSeed,
        runId,
        cell: { ...cell },
        targetId,
        objective: clone(objective),
        embark: clone(embark.snapshot),
        record,
        vigilBefore,
        vigilAfter,
        vigilDelta: vigilDelta(vigilBefore, vigilAfter),
      };
      rounds.push(round);

      if (thresholdRound == null && !isRevealed(vigilBefore, 'act4') && isRevealed(vigilAfter, 'act4')) {
        thresholdRound = ordinal;
      }
      const promise = vigilAfter.act4Promise;
      if (promise?.status === 'staged' && promise.provenance === 'runtime') {
        stagedRound = ordinal;
        stagedRunId = promise.runId;
      }
      if (record.outcome === 'error') {
        terminal = {
          status: 'failed', reason: 'simulator-error', round: ordinal,
          reproduction: failureReproduction(cycleSeed, policy, round, targetId),
        };
        break;
      }
      if (stagedRound != null) {
        terminal = {
          status: 'completed', reason: 'act4-promise-staged', endpoint: 'Act IV promise',
          round: stagedRound, runId: stagedRunId,
        };
        break;
      }
    }

    terminal ||= { status: 'censored', reason: 'max-rounds', round: maxRounds };
    return {
      cycleSeed,
      policy,
      maxRounds,
      targetId,
      targetSelection: policy === 'coverage' ? (requestedTarget ? 'explicit' : 'rotation') : null,
      initialVigil,
      rounds,
      thresholdRound,
      stagedRound,
      stagedRunId,
      terminal,
    };
  });
}
