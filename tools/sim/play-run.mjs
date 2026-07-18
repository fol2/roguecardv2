// THE walker: drives one full run start→win/death through the pure engine.
// It owns ALL game flow, legality, guards, invariants, and telemetry capture;
// policies are pure decision callbacks (spec 2026-07-17 proving-grounds, KTD6).
// Flow mirrors randomAgentRun in test/test_engine.js — the proven-terminating
// reference — with its asserts recorded as `issues`, never thrown (KTD9).
//
// Policy contract (a policy module exports `makePolicy(rng) → policy`):
//   pickNode(ctx, nodes)           → node (one of `nodes`)
//   combatAction(ctx, cb)          → { kind: 'play', uid, target }
//                                  | { kind: 'kindle', uid } | { kind: 'art' }
//                                  | { kind: 'potion', slot, target }
//                                  | { kind: 'end' }
//   pickCardReward(ctx, cards)     → cardId | null (null = skip)
//   pickBossRelic(ctx, relicIds)   → relicId
//   restDecision(ctx)              → { kind: 'heal' } | { kind: 'upgrade', uid }
//   eventChoice(ctx, event, valid) → choice (one of `valid`)
//   eventPending(ctx, pending)     → uid | cardId | null; pending is
//                                    { op: 'remove'|'upgrade'|'duplicate', options: [card] }
//                                    or { op: 'pickCard', n, options: [cardId] }
//   shopPlan(ctx, shop)            → array of shop item refs to buy, in order
//   lamplighterDecision(ctx, offer) → { boon, art }
//   hollowDecision(ctx, pending)    → { kind: 'pay'|'leave' }
//   terminalIntent(ctx, actions)    → 'dawn' | 'fall'
//   pickBequest(ctx, offers)        → bequest | null
// ctx is { run, cb } (cb null outside combat). Policies see visible state and
// their own rng only; engine randomness is never consumed by deliberation.
import {
  newRun, applyBoon, availableNodes, visitNode, rollEncounter, startCombat,
  canPlay, playCard, canKindle, kindleFromHand, canUseArt, useArt, usePotion,
  endTurn, genCombatRewards, addCardToDeck, gainPotion, gainRelic,
  rollBossRelics, upgradeCardInDeck, removeCardFromDeck,
  removableCards, rollEvent, rollEventCards, applyNodeEventChoice, finalizeNodeEventChoice,
  genShop, claimTreasure, claimMonument, beginShadeDuel,
  stageHollowExit, completePendingHollowRoute, payHollowPrice, buyQuestItem,
  claimBossRelic, advanceAct, restHealFrac, healPlayer, clearPendingEncounter,
  journalTerminalOutcome, markShadeFall, questRecord, runRevealed, runRng,
  sealedSummitShardThreshold, MAP_ROWS,
} from '../../src/engine.js';
import {
  ASPECTS, VOWS, ARTS, BOONS, CARDS, EVENTS, PROGRESSION,
  QUEST_ACTIVE_STATES, QUEST_IDS,
} from '../../src/data.js';
import { _setStore, loadVigil, revealSnapshot, bequestOptions, setBequest } from '../../src/vigil.js';
import { TRIGGER_CATALOGUE_VERSION, createTriggerObserver } from './triggers.mjs';

const NODE_GUARD = 400; // node loop cap (mirrors randomAgentRun)
const TURN_GUARD = 200; // combat turn cap
const ACTION_GUARD = 40; // policy actions per turn cap
const POLICY_RNG_SALT = 0x51ab; // KTD7: the policy stream, distinct from runRng
const STACK_LIMIT = 8_192;
const BOON_IDS = Object.keys(BOONS);
const ART_IDS = Object.keys(ARTS);
const COMBAT_TYPES = new Set(['monster', 'elite', 'boss']);
const PALE_VARIANTS = new Set(['paleDuskfang', 'paleDrownedOne', 'paleVoidWisp']);

const compactRun = (run) => run ? ({
  runId: run.runId, act: run.act, floor: run.floorsClimbed,
  hp: run.player.hp, maxHp: run.player.maxHp, gold: run.player.gold,
  shards: [...(run.shards || [])],
  quests: Object.fromEntries(Object.entries(run.quests || {}).map(([id, q]) =>
    [id, { state: q.state, progress: q.progress }])),
}) : null;

export function mulberry32(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Sweep cell is a pure function of the seed (KTD10), so
// `--runs 1 --seed K` replays the exact cell of the original run (R3).
// vow is a 0..VOWS.length level, 0 = none.
export function cellForSeed(seed) {
  return {
    aspect: seed % ASPECTS.length,
    vow: Math.floor(seed / ASPECTS.length) % (VOWS.length + 1),
    boon: BOON_IDS[seed % BOON_IDS.length],
    monument: seed % 4 === 0,
  };
}

// Fresh-profile reveal snapshot: what a brand-new vigil has revealed (nothing
// yet), computed once via the emberglass-pacing pattern. `revealed` passes
// reveals: null (the engine treats null as fully revealed).
let freshRevealsCache = null;
function freshReveals() {
  if (!freshRevealsCache) {
    _setStore(null);
    freshRevealsCache = revealSnapshot(loadVigil());
    _setStore(null);
  }
  return freshRevealsCache;
}

function disclosedQuestSnapshot() {
  return Object.fromEntries(QUEST_IDS.map((id) => [id, {
    state: 'revealed', progress: 0,
    memory: id === 'eighthOmen' ? { seen: true }
      : id === 'hollowLamplighter'
        ? { eligibleMisses: PROGRESSION.emberglass.hollowLamplighter.pityEligibleRuns - 1 }
        : {},
  }]));
}

const errMsg = (err) => String((err && err.message) || err);
const issueStack = (err) => typeof err?.stack === 'string'
  ? err.stack.trim().slice(0, STACK_LIMIT)
  : '';

export function playRun(seed, makePolicy, config = {}) {
  const profile = config.profile || 'revealed';
  if (profile !== 'revealed' && profile !== 'fresh') throw new TypeError(`unknown profile: ${profile}`);
  const round = config.round || null;
  const start = round?.start || config.runOptions || null;
  const cell = { ...cellForSeed(seed), ...(round?.cell || {}) };
  let policy = null;
  const triggerObserver = createTriggerObserver({
    policy: config.policyId || round?.policyId || 'unknown',
    cycleSeed: config.cycleSeed ?? round?.cycleSeed ?? seed,
    roundOrdinal: config.roundOrdinal ?? round?.ordinal ?? 1,
    runSeed: seed,
    targetId: config.targetId ?? round?.targetId ?? null,
    vigil: round?.vigil || null,
  });
  const rec = {
    seed, profile, cell,
    outcome: null, death: null, actReached: 0, floorsReached: 0,
    fights: [], drafts: [], bossRelics: [], shops: [], events: [], rests: [], actTransitions: [],
    lamplighter: null, hollow: [], monuments: [], terminal: null,
    triggerCatalogueVersion: TRIGGER_CATALOGUE_VERSION,
    triggerEvents: [], triggerFunnels: {},
    deck: [], relics: [], potions: [], potionsHeldAtDeath: 0,
    gold: 0, hp: 0, maxHp: 0, issues: [],
  };
  let run = null;
  let phase = 'node';
  const reproduction = (phaseName, triggerId = null, reason = null) => ({
    policy: config.policyId || round?.policyId || 'unknown',
    cycleSeed: config.cycleSeed ?? round?.cycleSeed ?? seed,
    roundOrdinal: config.roundOrdinal ?? round?.ordinal ?? 1,
    runSeed: seed,
    phase: phaseName,
    triggerId,
    reason,
    targetId: config.targetId ?? round?.targetId ?? null,
    vigil: {
      shards: [...(round?.vigil?.shards || [])],
      promise: round?.vigil?.act4Promise?.status || null,
    },
    run: compactRun(run),
  });
  const issue = (kind, phaseName, message, stack) => {
    const target = config.targetId ?? round?.targetId ?? null;
    const entry = { seed, phase: phaseName, kind, message,
      repro: reproduction(phaseName, target, kind) };
    if (stack) entry.stack = stack;
    rec.issues.push(entry);
  };
  // a throwing policy is a policy bug, not an engine bug: flag it and let the
  // call site apply its deterministic fallback (R2)
  const THREW = Symbol('policy-threw');
  const ask = (phaseName, what, fn) => {
    try { return fn(); } catch (err) {
      issue('policy-illegal', phaseName, `${what} threw: ${errMsg(err)}`);
      return THREW;
    }
  };
  const ctxOf = (run, cb = null) => ({ run, cb });
  const observe = (id, sample) => triggerObserver.observe(id, {
    ...sample,
    runSummary: compactRun(run),
  });
  try {
    const legacy = !start;
    const simulationRunId = `run-sim-${(seed >>> 0).toString(36)}-${Math.max(1, config.roundOrdinal ?? round?.ordinal ?? 1).toString(36)}`;
    run = newRun(seed, legacy ? {
      aspect: cell.aspect, vow: cell.vow, ephemeral: true,
      runId: config.runId || simulationRunId,
      reveals: profile === 'fresh' ? freshReveals() : null,
      quests: config.purposefulQuests && profile === 'revealed'
        ? disclosedQuestSnapshot()
        : undefined,
      monument: cell.monument ? { act: 0, row: 5, bequest: { kind: 'gold', amount: 40 } } : null,
    } : {
      ...start,
      runId: start.runId || config.runId || simulationRunId,
      aspect: start.aspect ?? cell.aspect,
      vow: start.vow ?? cell.vow,
      ephemeral: start.ephemeral ?? !round?.terminal,
    });
    policy = makePolicy(mulberry32(seed ^ POLICY_RNG_SALT), { run, seed, profile });
    if (legacy) applyBoon(run, cell.boon); // legacy PR31 cell compatibility

    if (run.pendingLamplighter) {
      phase = 'lamplighter';
      const pool = BOON_IDS.filter((id) => runRevealed(run, 'phials') ||
        !BOONS[id].ops.some((op) => op.potion));
      const boons = [];
      const rng = runRng(run);
      while (boons.length < 3 && pool.length) boons.push(pool.splice(Math.floor(rng() * pool.length), 1)[0]);
      let choice = ask('lamplighter', 'lamplighterDecision', () =>
        policy.lamplighterDecision(ctxOf(run), { boons, arts: ART_IDS, currentArt: run.art }));
      if (choice === THREW || !boons.includes(choice?.boon) || !ART_IDS.includes(choice?.art)) {
        if (choice !== THREW) issue('policy-illegal', 'lamplighter', 'lamplighterDecision: invalid boon or Art');
        choice = { boon: boons[0], art: run.art };
      }
      run.art = choice.art;
      applyBoon(run, choice.boon);
      delete run.pendingLamplighter;
      rec.lamplighter = { offeredBoons: [...boons], boon: choice.boon, art: choice.art };
    }

    const eighthActive = run.questScratch?.eighthOmen?.active === true;
    const eighthProgressAtStart = questRecord(run, 'eighthOmen')?.progress || 0;
    const hollowScratch = run.questScratch?.hollowLamplighter;
    const hollowQuest = questRecord(run, 'hollowLamplighter');
    observe('eighth.active', {
      unitId: `round:${rec.seed}`, phase: 'embark',
      before: { eligible: QUEST_ACTIVE_STATES.includes(questRecord(run, 'eighthOmen')?.state), value: false },
      intent: { automatic: true },
      after: { value: eighthActive, ...(eighthActive ? {} : { reason: 'omen-inactive' }) },
    });
    observe('hollow.due', {
      unitId: `round:${rec.seed}`, phase: 'embark',
      before: {
        eligible: !!hollowQuest && QUEST_ACTIVE_STATES.includes(hollowQuest.state) && !hollowScratch?.debtActive,
        value: false,
      },
      intent: { automatic: true },
      after: {
        value: hollowScratch?.due === true,
        ...(hollowScratch?.due ? {} : { reason: hollowScratch?.debtActive ? 'debt-active' : hollowQuest ? 'not-due' : 'quest-inactive' }),
      },
    });

    const runCombat = (cb, enc, kind, node) => {
      const combatUnit = `act:${run.act}:node:${node.id}`;
      const questBefore = Object.fromEntries([
        'paleOnes', 'ownShade', 'usurper', 'eighthOmen', 'unreadablePage', 'hollowLamplighter',
      ].map((id) => [id, questRecord(run, id)?.progress || 0]));
      const finalBoss = kind === 'boss' && run.act === 2;
      const pageQuestActive = finalBoss &&
        QUEST_ACTIVE_STATES.includes(questRecord(run, 'unreadablePage')?.state);
      const carriesPage = pageQuestActive &&
        run.player.deck.some((card) => card.id === 'unreadablePage');
      if (pageQuestActive) observe('page.carry', {
        unitId: combatUnit, phase: 'combat-start',
        before: { eligible: true, value: false }, intent: { automatic: true },
        after: { value: carriesPage, ...(carriesPage ? {} : { reason: 'page-not-held' }) },
      });
      const fight = {
        enemies: [...enc], kind, affix: cb.affix, act: run.act, row: node.row,
        turns: 0, dmgDealt: 0, dmgTaken: 0, overkill: 0, energyWaste: 0,
        kindles: 0, arts: 0, potionsUsed: 0, result: null,
      };
      const dealt0 = run.stats.dmgDealt, taken0 = run.stats.dmgTaken;
      let lastHitSource = null;
      let turnGuard = 0;
      while (!cb.over && turnGuard++ < TURN_GUARD) {
        let ended = false, actions = 0;
        const endFallback = () => { // deterministic fallback: end the turn
          fight.energyWaste += cb.player.energy;
          endTurn(run, cb);
          ended = true;
        };
        const forceEnd = (why) => { issue('policy-illegal', 'combat', why); endFallback(); };
        while (!cb.over && !ended && actions++ < ACTION_GUARD) {
          const action = ask('combat', 'combatAction', () => policy.combatAction(ctxOf(run, cb), cb));
          if (action === THREW) { endFallback(); continue; }
          const k = action && action.kind;
          if (k === 'end' || k === 'fall') {
            endFallback();
          } else if (k === 'play') {
            const inst = cb.hand.find((c) => c.uid === action.uid);
            const target = action.target ?? null;
            const badTarget = target !== null &&
              !(Number.isInteger(target) && cb.enemies[target] && cb.enemies[target].hp > 0);
            if (!inst || badTarget || !canPlay(run, cb, inst, target) || !playCard(run, cb, inst.uid, target)) {
              forceEnd(`illegal play (uid=${action.uid}, target=${action.target})`);
            }
          } else if (k === 'kindle') {
            const inst = cb.hand.find((c) => c.uid === action.uid);
            if (!inst || !canKindle(run, cb, inst) || !kindleFromHand(run, cb, inst.uid)) {
              forceEnd(`illegal kindle (uid=${action.uid})`);
            } else fight.kindles++;
          } else if (k === 'art') {
            if (!canUseArt(run, cb) || !useArt(run, cb)) forceEnd('illegal art');
            else fight.arts++;
          } else if (k === 'potion') {
            const ok = Number.isInteger(action.slot) && usePotion(run, cb, action.slot, action.target ?? null);
            if (!ok) forceEnd(`illegal potion (slot=${action.slot})`);
            else fight.potionsUsed++;
          } else {
            forceEnd(`unknown combat action kind: ${String(k)}`);
          }
        }
        if (!cb.over && !ended) forceEnd(`action guard exhausted (${ACTION_GUARD}/turn)`);
        // invariants at the same points the monte-carlo asserts them (KTD9)
        if (!(cb.embers >= 0 && cb.embers <= cb.emberCap)) {
          issue('invariant', 'combat', `embers out of range: ${cb.embers}/${cb.emberCap}`);
        }
        for (const e of cb.enemies) {
          if (e.hp > 0 && !(e.chips < e.facetMax)) {
            issue('invariant', 'combat', `chips >= facetMax on ${e.key}: ${e.chips}/${e.facetMax}`);
          }
        }
        if (cb.player.energy < 0) issue('invariant', 'combat', `negative energy: ${cb.player.energy}`);
        // harvest telemetry, then drain the queue exactly like the monte-carlo
        for (const ev of cb.queue) {
          if (ev.t === 'hitEnemy' && ev.overkill) fight.overkill += ev.overkill;
          else if (ev.t === 'hitPlayer') lastHitSource = ev.source;
        }
        cb.queue.length = 0;
      }
      fight.turns = cb.turn;
      fight.dmgDealt = run.stats.dmgDealt - dealt0;
      fight.dmgTaken = run.stats.dmgTaken - taken0;
      fight.result = cb.result;
      rec.fights.push(fight);
      if (!cb.over) {
        issue('invariant', 'combat', `combat did not terminate (${enc.join()},turns=${turnGuard})`);
        rec.outcome = 'error';
        return;
      }
      if (cb.result === 'loss') {
        const killer = Number.isInteger(lastHitSource)
          ? (cb.enemies[lastHitSource]?.variantId || cb.enemies[lastHitSource]?.key || enc[0])
          : (lastHitSource || enc[0]);
        rec.outcome = 'death';
        rec.death = { act: run.act, row: node.row, enemy: killer, kind };
        rec.potionsHeldAtDeath = run.player.potions.filter(Boolean).length;
      }
      const questAfter = (id) => questRecord(run, id)?.progress || 0;
      if (enc.some((id) => PALE_VARIANTS.has(id))) observe('pale.kill', {
        unitId: combatUnit, phase: 'combat',
        before: { eligible: true, value: questBefore.paleOnes }, intent: { automatic: true },
        after: { value: questAfter('paleOnes'), ...(cb.result === 'win' ? {} : { reason: 'combat-fall' }) },
      });
      if (enc.some((id) => /^ownShade[1-9]\d*$/.test(id))) observe('shade.win', {
        unitId: combatUnit, phase: 'combat',
        before: { eligible: true, value: questBefore.ownShade }, intent: { automatic: true },
        after: { value: questAfter('ownShade'), ...(cb.result === 'win' ? {} : { reason: 'duel-fall' }) },
      });
      if (enc.includes('usurpedSovereign')) observe('usurper.kill', {
        unitId: combatUnit, phase: 'combat',
        before: { eligible: true, value: questBefore.usurper }, intent: { automatic: true },
        after: { value: questAfter('usurper'), ...(cb.result === 'win' ? {} : { reason: 'combat-fall' }) },
      });
      if (questAfter('hollowLamplighter') !== questBefore.hollowLamplighter) observe('hollow.progressed', {
        unitId: combatUnit, phase: 'combat',
        before: { eligible: true, value: questBefore.hollowLamplighter }, intent: { action: 'pay' },
        after: { value: questAfter('hollowLamplighter') },
      });
      if (finalBoss && eighthActive) observe('eighth.final-attempt', {
        unitId: combatUnit, phase: 'combat',
        before: { eligible: true, value: false }, intent: { automatic: true },
        after: { value: questAfter('eighthOmen') > questBefore.eighthOmen,
          ...(cb.result === 'win' ? {} : { reason: 'final-fall' }) },
      });
      if (pageQuestActive) observe('page.read', {
        unitId: `round:${rec.seed}`, phase: 'combat',
        before: { eligible: true, value: questBefore.unreadablePage },
        intent: { action: cb.result === 'win' ? 'dawn' : 'fall' },
        after: {
          value: questAfter('unreadablePage'),
          ...(cb.result !== 'win' ? { reason: 'fall' }
            : carriesPage ? {} : { reason: 'page-not-held' }),
        },
      });
      if (cb.result === 'win' && run.pendingCombat) clearPendingEncounter(run);
    };

    const resolvePendingOp = (p, evRec) => {
      let desc = null;
      if (p === 'remove') desc = { op: 'remove', options: run.player.deck.length > 1 ? removableCards(run) : [] };
      else if (p === 'upgrade') desc = { op: 'upgrade', options: run.player.deck.filter((c) => !c.up && CARDS[c.id].up) };
      else if (p === 'duplicate') desc = { op: 'duplicate', options: [...run.player.deck] };
      else if (p && p.pickCard) desc = { op: 'pickCard', n: p.pickCard, options: rollEventCards(run, p.pickCard) };
      if (!desc) return;
      if (!desc.options.length) { evRec.pending.push({ op: desc.op, resolved: null }); return; }
      let pick = ask('event', `eventPending(${desc.op})`, () => policy.eventPending(ctxOf(run), desc));
      if (pick === THREW) pick = null;
      let resolved = null;
      if (pick != null) {
        if (desc.op === 'pickCard') {
          if (desc.options.includes(pick)) { addCardToDeck(run, pick); resolved = pick; }
          else issue('policy-illegal', 'event', `eventPending(pickCard): ${pick} not offered`);
        } else {
          const inst = desc.options.find((c) => c.uid === pick);
          if (!inst) issue('policy-illegal', 'event', `eventPending(${desc.op}): uid not an option`);
          else if (desc.op === 'remove') { removeCardFromDeck(run, inst.uid); resolved = inst.id; }
          else if (desc.op === 'upgrade') { upgradeCardInDeck(run, inst.uid); resolved = inst.id; }
          else { addCardToDeck(run, inst.id); resolved = inst.id; } // duplicate (copy lands unupgraded, as in the monte-carlo)
        }
      }
      evRec.pending.push({ op: desc.op, resolved });
    };

    const standingAtStart = run.monument?.standing === true;
    let hollowReachable = false;
    let guard = 0;
    while (rec.outcome === null && guard++ < NODE_GUARD) {
      phase = 'node';
      const options = availableNodes(run);
      if (!options.length) { issue('invariant', 'node', 'no available nodes'); rec.outcome = 'error'; break; }
      const hollowOptions = hollowScratch?.due
        ? options.filter((candidate) => candidate.unlit)
        : [];
      if (hollowOptions.length) hollowReachable = true;
      let node = ask('node', 'pickNode', () => policy.pickNode(ctxOf(run), options));
      if (node === THREW) node = options[0];
      else if (!options.includes(node)) {
        issue('policy-illegal', 'node', 'pickNode: node not on offer');
        node = options[0];
      }
      const selectedUnlit = node.unlit === true;
      const hiddenBefore = run.questScratch?.paleOnes?.hiddenRemaining || 0;
      let { type, hollow } = visitNode(run, node);
      let routedEnemyIds = null;
      let routedEventId = null;
      const hollowOpportunity = hollowOptions.length
        ? (selectedUnlit ? node : hollowOptions[0])
        : null;
      const hollowUnit = hollowOpportunity
        ? `act:${run.act}:node:${hollowOpportunity.id}`
        : null;
      if (hollowUnit) observe('hollow.entered', {
        unitId: hollowUnit, phase: 'hollow',
        before: { eligible: true, value: false }, intent: { automatic: true },
        after: {
          value: !!hollow,
          ...(hollow ? {} : { reason: selectedUnlit ? 'meeting-cap' : 'unlit-not-chosen' }),
        },
      });
      if (hollow) {
        const progressBefore = questRecord(run, 'hollowLamplighter')?.progress || 0;
        let decision = ask('hollow', 'hollowDecision', () => policy.hollowDecision(ctxOf(run), run.pendingHollow));
        if (decision === THREW || !['pay', 'leave'].includes(decision?.kind)) {
          if (decision !== THREW) issue('policy-illegal', 'hollow', 'hollowDecision: invalid decision');
          decision = { kind: 'leave' };
        }
        let payment = null;
        if (decision.kind === 'pay') payment = payHollowPrice(run);
        const paid = run.pendingHollow?.paid === true;
        const payReason = decision.kind === 'leave' ? 'left-unpaid'
          : payment?.ok ? null : 'price-unaffordable';
        observe('hollow.paid', {
          unitId: hollowUnit, phase: 'hollow',
          before: { eligible: true, value: false },
          intent: { action: decision.kind, ...(payReason ? { reason: payReason } : {}) },
          after: { value: paid, ...(payReason ? { reason: payReason } : {}) },
        });
        const progressAfter = questRecord(run, 'hollowLamplighter')?.progress || 0;
        observe('hollow.progressed', {
          unitId: hollowUnit, phase: 'hollow',
          before: { eligible: true, value: progressBefore },
          intent: { action: decision.kind, ...(payReason ? { reason: payReason } : {}) },
          after: { value: progressAfter, ...(progressAfter > progressBefore ? {} : {
            reason: payment?.deferred ? 'deferred-ember-debt' : payReason || 'payment-rejected',
          }) },
        });
        const route = stageHollowExit(run);
        if (!route) {
          issue('engine-error', 'hollow', 'Hollow continuation could not be staged');
          rec.outcome = 'error';
          continue;
        }
        type = route.type;
        routedEnemyIds = route.kind === 'combat' ? route.enemyIds : null;
        routedEventId = route.kind === 'destination' ? route.eventId : null;
        rec.hollow.push({ act: run.act, nodeId: node.id, decision: decision.kind,
          paid, deferred: !!payment?.deferred, route: route.kind, type: route.type });
      }
      if (COMBAT_TYPES.has(type)) {
        phase = 'combat';
        const enc = routedEnemyIds ? [...routedEnemyIds] : rollEncounter(run, type, node.row, node);
        const encounterUnit = `act:${run.act}:node:${node.id}`;
        if (node.questVariantId && PALE_VARIANTS.has(node.questVariantId)) observe('pale.marked-encounter', {
          unitId: encounterUnit, phase: 'encounter',
          before: { eligible: true, value: false }, intent: { automatic: true },
          after: { value: enc.includes(node.questVariantId) },
        });
        if (hiddenBefore > 0 && !node.questVariantId && type === 'monster') observe('pale.hidden-encounter', {
          unitId: encounterUnit, phase: 'encounter',
          before: { eligible: true, value: false }, intent: { automatic: true },
          after: { value: enc.some((id) => PALE_VARIANTS.has(id)),
            ...(enc.some((id) => PALE_VARIANTS.has(id)) ? {} : { reason: 'wrong-face' }) },
        });
        if (type === 'boss' && run.act === 2 && run.questScratch?.usurper?.bought) observe('usurper.transformed-summit', {
          unitId: encounterUnit, phase: 'encounter',
          before: { eligible: true, value: false }, intent: { automatic: true },
          after: { value: enc.includes('usurpedSovereign'), ...(enc.includes('usurpedSovereign') ? {} : { reason: 'wrong-enemy' }) },
        });
        const cb = startCombat(run, enc, type);
        runCombat(cb, enc, type, node);
        if (rec.outcome !== null) continue; // death or non-terminating combat
        phase = 'reward';
        const pageQuest = questRecord(run, 'unreadablePage');
        const pageOfferEligible = type !== 'boss' || run.act !== 2
          ? !!pageQuest && QUEST_ACTIVE_STATES.includes(pageQuest.state) &&
            (run.questScratch?.unreadablePage?.rewardOrdinal || 0) + 1 ===
              PROGRESSION.emberglass.unreadablePage.offerRewardOrdinal
          : false;
        const rw = genCombatRewards(run, type, cb.affix);
        const rewardUnit = `act:${run.act}:node:${node.id}`;
        if (pageOfferEligible) observe('page.offer', {
          unitId: rewardUnit, phase: 'reward',
          before: { eligible: true, value: false }, intent: { automatic: true },
          after: { value: rw.cards.includes('unreadablePage'),
            ...(rw.cards.includes('unreadablePage') ? {} : { reason: 'wrong-reward-ordinal' }) },
        });
        run.player.gold += rw.gold;
        if (rw.cards.length) {
          const pageCountBefore = run.player.deck.filter((card) => card.id === 'unreadablePage').length;
          let pick = ask('reward', 'pickCardReward', () => policy.pickCardReward(ctxOf(run), rw.cards));
          if (pick === THREW) pick = null;
          else if (pick != null && !rw.cards.includes(pick)) {
            issue('policy-illegal', 'reward', `pickCardReward: ${pick} not offered`);
            pick = null; // deterministic fallback: skip
          }
          if (pick) addCardToDeck(run, pick);
          if (rw.cards.includes('unreadablePage')) observe('page.take', {
            unitId: rewardUnit, phase: 'reward',
            before: { eligible: true, value: pageCountBefore },
            intent: { action: pick === 'unreadablePage' ? 'take' : 'skip',
              ...(pick === 'unreadablePage' ? {} : { reason: 'skipped' }) },
            after: { value: run.player.deck.filter((card) => card.id === 'unreadablePage').length,
              ...(pick === 'unreadablePage' ? {} : { reason: 'skipped' }) },
          });
          rec.drafts.push({ offered: [...rw.cards], picked: pick ?? null, kind: type, act: run.act });
        }
        if (rw.potion) gainPotion(run, rw.potion); // full slots legally leave it untaken
        if (rw.relic) gainRelic(run, rw.relic);
        if (type === 'boss') {
          if (run.act >= 2) { rec.outcome = 'win'; continue; }
          const bosses = rollBossRelics(run);
          if (bosses.length) {
            let pick = ask('reward', 'pickBossRelic', () => policy.pickBossRelic(ctxOf(run), bosses));
            if (pick === THREW) pick = bosses[0];
            else if (pick != null && !bosses.includes(pick)) {
              issue('policy-illegal', 'reward', `pickBossRelic: ${pick} not offered`);
              pick = bosses[0];
            }
            rec.bossRelics.push({ offered: [...bosses], picked: pick, act: run.act });
            claimBossRelic(run, pick);
          }
          const transitionBefore = { act: run.act, hp: run.player.hp, maxHp: run.player.maxHp };
          if (!advanceAct(run)) {
            issue('engine-error', 'reward', 'canonical act transition rejected');
            rec.outcome = 'error';
          } else {
            rec.actTransitions.push({
              from: transitionBefore.act, to: run.act,
              hpBefore: transitionBefore.hp, hpAfter: run.player.hp,
              maxHp: transitionBefore.maxHp,
              expectedHeal: Math.round(transitionBefore.maxHp * 0.35),
              omen: run.omens[run.act],
            });
          }
        }
      } else if (type === 'rest') {
        const hpBefore = run.player.hp;
        const healFrac = restHealFrac(run);
        const d = ask('node', 'restDecision', () => policy.restDecision(ctxOf(run)));
        const upgradable = run.player.deck.filter((c) => !c.up && CARDS[c.id].up);
        const inst = d !== THREW && d?.kind === 'upgrade' ? upgradable.find((c) => c.uid === d.uid) : null;
        if (inst) upgradeCardInDeck(run, inst.uid);
        else {
          if (d !== THREW && !(d && d.kind === 'heal')) issue('policy-illegal', 'node', 'restDecision: invalid decision');
          healPlayer(run, Math.round(run.player.maxHp * restHealFrac(run))); // live rest contract
        }
        rec.rests.push({ act: run.act, hpBefore, hpAfter: run.player.hp, maxHp: run.player.maxHp, healFrac,
          healRequested: Math.round(run.player.maxHp * healFrac),
          decision: inst ? 'upgrade' : 'heal' });
      } else if (type === 'event') {
        phase = 'event';
        const evId = routedEventId || rollEvent(run);
        const ev = EVENTS[evId];
        const offered = ev.choices.filter((choice) => runRevealed(run, 'phials') ||
          !choice.ops.some((op) => op.potion));
        const valid = offered.filter((c) => !c.needGold || run.player.gold >= c.needGold);
        if (!valid.length) rec.events.push({ id: evId, choice: -1, pending: [] });
        else {
          let choice = ask('event', 'eventChoice', () => policy.eventChoice(ctxOf(run), ev, valid));
          if (choice === THREW) choice = valid[0];
          else if (!valid.includes(choice)) {
            issue('policy-illegal', 'event', 'eventChoice: choice not offered');
            choice = valid[0];
          }
          const { pending } = applyNodeEventChoice(run, choice.ops);
          const evRec = { id: evId, choice: ev.choices.indexOf(choice), pending: [] };
          for (const p of pending) resolvePendingOp(p, evRec);
          finalizeNodeEventChoice(run);
          rec.events.push(evRec);
        }
      } else if (type === 'shop') {
        phase = 'shop';
        const usurper = questRecord(run, 'usurper');
        const usurperEligible = !!usurper && QUEST_ACTIVE_STATES.includes(usurper.state) &&
          run.act >= PROGRESSION.emberglass.usurper.minShopAct && !run.questScratch?.usurper?.bought;
        const shop = genShop(run);
        const shopUnit = `act:${run.act}:node:${node.id}`;
        const questItem = shop.questItems.find((item) => item.id === 'flamelessLantern') || null;
        if (usurperEligible) {
          observe('usurper.offer', {
            unitId: shopUnit, phase: 'shop',
            before: { eligible: true, value: false }, intent: { automatic: true },
            after: { value: !!questItem, ...(!questItem ? { reason: 'quest-inactive' } : {}) },
          });
          if (questItem) observe('usurper.afford', {
            unitId: shopUnit, phase: 'shop',
            before: { eligible: true, value: run.player.gold >= questItem.price }, intent: { automatic: true },
            after: { value: run.player.gold >= questItem.price,
              ...(run.player.gold >= questItem.price ? {} : { reason: 'insufficient-gold' }) },
          });
        }
        let plan = ask('shop', 'shopPlan', () => policy.shopPlan(ctxOf(run), shop));
        if (plan === THREW) plan = [];
        else if (!Array.isArray(plan)) { issue('policy-illegal', 'shop', 'shopPlan: not an array'); plan = []; }
        const bought = [];
        const goldBefore = run.player.gold;
        const potionSlotsBefore = run.player.potions.filter(Boolean).length;
        let failedPotionPurchases = 0;
        for (const it of plan) {
          if (it?._simKind === 'quest-item') {
            const beforeBought = run.questScratch?.usurper?.bought === true;
            const result = buyQuestItem(run, it.id);
            observe('usurper.buy', {
              unitId: shopUnit, phase: 'shop',
              before: { eligible: !!questItem, value: beforeBought }, intent: { action: 'buy' },
              after: { value: run.questScratch?.usurper?.bought === true,
                ...(!result.ok ? { reason: result.reason === 'gold' ? 'insufficient-gold' : 'purchase-rejected' } : {}) },
            });
            if (result.ok) {
              questItem.sold = true;
              bought.push({ kind: 'quest-item', id: it.id, price: questItem.price });
            }
            continue;
          }
          if (it?._simKind === 'remove') {
            const inst = removableCards(run).find((card) => card.uid === it.uid);
            if (shop.removed || !inst || run.player.gold < shop.removeCost) continue;
            if (removeCardFromDeck(run, inst.uid)) {
              run.player.gold -= shop.removeCost;
              shop.removed = true;
              bought.push({ kind: 'remove', id: inst.id, price: shop.removeCost });
            }
            continue;
          }
          const bucket = shop.cards.includes(it) ? 'card'
            : shop.relics.includes(it) ? 'relic'
            : shop.potions.includes(it) ? 'potion' : null;
          if (!bucket || it.sold || it.price > run.player.gold) {
            issue('policy-illegal', 'shop', `shopPlan: illegal purchase (${it && it.id})`);
            continue;
          }
          run.player.gold -= it.price;
          if (bucket === 'potion' && !gainPotion(run, it.id)) {
            run.player.gold += it.price;
            failedPotionPurchases++;
            continue;
          }
          it.sold = true;
          if (bucket === 'card') addCardToDeck(run, it.id);
          else if (bucket === 'relic') gainRelic(run, it.id);
          bought.push({ kind: bucket, id: it.id, price: it.price });
        }
        if (questItem && !run.questScratch?.usurper?.bought) observe('usurper.buy', {
          unitId: shopUnit, phase: 'shop',
          before: { eligible: true, value: false },
          intent: { action: 'skip', reason: run.player.gold < questItem.price ? 'insufficient-gold' : 'not-selected' },
          after: { value: false, reason: run.player.gold < questItem.price ? 'insufficient-gold' : 'not-selected' },
        });
        rec.shops.push({
          act: run.act,
          offered: {
            cards: shop.cards.map((i) => i.id),
            relics: shop.relics.map((i) => i.id),
            potions: shop.potions.map((i) => i.id),
            questItems: shop.questItems.map((i) => i.id),
          },
          removeCost: shop.removeCost, removed: shop.removed, bought,
          goldBefore, goldAfter: run.player.gold,
          potionSlotsBefore, potionSlotsAfter: run.player.potions.filter(Boolean).length,
          failedPotionPurchases,
        });
      } else if (type === 'treasure') {
        claimTreasure(run);
      } else if (type === 'monument') {
        if (run.monument?.standing && !run.monument.claimed) {
          let decision = ask('monument', 'monumentDecision', () => policy.monumentDecision(ctxOf(run), ['duel']));
          if (decision === THREW || decision !== 'duel') {
            if (decision !== THREW) issue('policy-illegal', 'monument', 'monumentDecision: invalid decision');
            decision = 'duel';
          }
          const transaction = beginShadeDuel(run,
            round?.clearStandingBequest || (() => start?.ephemeral === true));
          const ready = transaction.status === 'ready' && !!transaction.duel;
          observe('shade.duel', {
            unitId: `act:${run.act}:node:${node.id}`, phase: 'monument',
            before: { eligible: true, value: false }, intent: { action: decision },
            after: { value: ready, ...(!ready ? { reason: transaction.status === 'reloadPending'
              ? 'reload-pending' : transaction.status === 'retryClear' ? 'clear-retry' : 'claim-retry' } : {}) },
          });
          rec.monuments.push({ act: run.act, nodeId: node.id, standing: true,
            transaction: transaction.status, duel: transaction.duel?.variantId || null });
          if (!ready) {
            issue('engine-error', 'monument', `Shade duel transaction: ${transaction.status}`);
            rec.outcome = 'error';
          } else {
            const cb = startCombat(run, [transaction.duel.variantId], 'monster');
            runCombat(cb, [transaction.duel.variantId], 'monster', node);
          }
        } else {
          const gift = claimMonument(run);
          rec.monuments.push({ act: run.act, nodeId: node.id, standing: false, gift: gift || null });
        }
      }
      if (run.pendingHollowRoute && !COMBAT_TYPES.has(type) && !completePendingHollowRoute(run)) {
        issue('engine-error', 'hollow', 'Hollow destination completion rejected');
        rec.outcome = 'error';
      }
      if (rec.outcome === null) {
        // node invariants (mirror randomAgentRun's post-node asserts, plus R3's bounds)
        if (!(run.player.hp > 0)) { issue('invariant', 'node', `hp <= 0 after node (${run.player.hp})`); rec.outcome = 'error'; }
        if (run.player.hp > run.player.maxHp) issue('invariant', 'node', `hp > maxHp (${run.player.hp}/${run.player.maxHp})`);
        if (run.player.gold < 0) issue('invariant', 'node', `negative gold: ${run.player.gold}`);
        if (!run.player.deck.length) issue('invariant', 'node', 'deck is empty');
        const uids = new Set(run.player.deck.map((c) => c.uid));
        if (uids.size !== run.player.deck.length) issue('invariant', 'node', 'duplicate deck uids');
      }
    }
    if (rec.outcome === null) {
      issue('invariant', 'node', `run did not terminate within ${NODE_GUARD} nodes`);
      rec.outcome = 'error';
    }
    if (hollowScratch?.due) observe('hollow.reachable', {
      unitId: `round:${rec.seed}`, phase: 'terminal',
      before: { eligible: true, value: false }, intent: { automatic: true },
      after: { value: hollowReachable, ...(hollowReachable ? {} : { reason: 'no-unlit-route' }) },
    });
    if (standingAtStart) observe('shade.standing-monument', {
      unitId: `round:${rec.seed}`, phase: 'terminal',
      before: { eligible: true, value: false }, intent: { automatic: true },
      after: { value: run.monument?.claimed === true,
        ...(run.monument?.claimed ? {} : { reason: 'monument-not-reached' }) },
    });

    if (rec.outcome === 'win' || rec.outcome === 'death') {
      phase = 'terminal';
      const expectedIntent = rec.outcome === 'win' ? 'dawn' : 'fall';
      let intent = ask('terminal', 'terminalIntent', () => policy.terminalIntent(ctxOf(run), [expectedIntent]));
      if (intent === THREW || intent !== expectedIntent) {
        if (intent !== THREW) issue('policy-illegal', 'terminal', `terminalIntent: expected ${expectedIntent}`);
        intent = expectedIntent;
      }
      const fallNode = run.map.nodes.find((candidate) => candidate.id === run.nodeId);
      const fallRow = fallNode?.row ?? Math.max(1, run.floorsClimbed - 1);
      const shade = questRecord(run, 'ownShade');
      const shadeEligible = expectedIntent === 'fall' && !!shade &&
        QUEST_ACTIVE_STATES.includes(shade.state) && run.act >= PROGRESSION.emberglass.ownShade.minDeathAct;
      const markedFall = expectedIntent === 'fall' ? markShadeFall(run, run.act, fallRow) : false;
      if (shadeEligible) observe('shade.qualifying-fall', {
        unitId: `round:${rec.seed}`, phase: 'terminal',
        before: { eligible: true, value: false }, intent: { action: intent },
        after: { value: markedFall, ...(!markedFall ? { reason: 'quest-inactive' } : {}) },
      });

      const eighthBefore = eighthProgressAtStart;
      const shardsBefore = run.shards?.length || 0;
      const promiseBefore = round?.vigil?.act4Promise?.status || null;
      journalTerminalOutcome(run, rec.outcome === 'win' ? 'win' : 'death');
      let terminalResult = null;
      if (round?.terminal?.finalise) {
        terminalResult = round.terminal.finalise(run, { revealThreshold: sealedSummitShardThreshold(run) });
        if (!terminalResult?.accepted) {
          issue('engine-error', 'terminal', 'terminal coordinator rejected the Run Outcome');
          rec.outcome = 'error';
        }
      }
      const vigilAfter = round?.readVigil?.() || terminalResult?.ledger?.vigil || null;
      rec.terminal = {
        intent,
        accepted: terminalResult ? terminalResult.accepted === true : true,
        outcome: terminalResult?.outcome || (intent === 'dawn' ? 'win' : 'death'),
        newUnlocks: [...(terminalResult?.newUnlocks || [])],
        newShards: [...(terminalResult?.ledger?.newShards || [])],
      };
      if (eighthActive) observe('eighth.dawn', {
        unitId: `round:${rec.seed}`, phase: 'terminal',
        before: { eligible: true, value: eighthBefore }, intent: { action: intent },
        after: { value: questRecord(run, 'eighthOmen')?.progress || 0,
          ...(intent === 'dawn' ? {} : { reason: 'fall' }) },
      });
      const shardsAfter = vigilAfter?.shards?.length ?? shardsBefore;
      if (shardsBefore < sealedSummitShardThreshold(run) &&
          shardsAfter >= sealedSummitShardThreshold(run)) observe('shard.threshold', {
        unitId: `round:${rec.seed}`, phase: 'terminal',
        before: { eligible: true, value: shardsBefore }, intent: { automatic: true },
        after: { value: shardsAfter },
      });
      const promiseAfter = vigilAfter?.act4Promise?.status || null;
      const act4StagingEligible = intent === 'dawn' && promiseBefore !== 'staged' &&
        (promiseBefore === 'pending' || shardsAfter >= sealedSummitShardThreshold(run));
      if (act4StagingEligible) observe('act4Reveal.staged', {
        unitId: `round:${rec.seed}`, phase: 'terminal',
        before: { eligible: true, value: promiseBefore === 'staged' }, intent: { action: intent },
        after: { value: promiseAfter === 'staged',
          ...(promiseAfter === 'staged' ? {} : { reason: terminalResult?.accepted === false
            ? 'terminal-rejected' : 'promise-locked' }) },
      });

      if (intent === 'fall' && round?.terminal && !run.questScratch?.ownShade?.fall?.bequest) {
        const offers = bequestOptions(run);
        if (offers.length) {
          let choice = ask('terminal', 'pickBequest', () => policy.pickBequest(ctxOf(run), offers));
          if (choice === THREW) choice = null;
          else if (choice != null && !offers.includes(choice)) {
            issue('policy-illegal', 'terminal', 'pickBequest: bequest not offered');
            choice = null;
          }
          if (choice) {
            const accepted = round.setBequest
              ? round.setBequest(run.act, fallRow, choice)
              : setBequest(run.act, fallRow, choice);
            rec.terminal.bequest = accepted ? { ...choice } : null;
            if (!accepted) issue('engine-error', 'terminal', 'bequest persistence rejected');
          }
        }
      }
    }
  } catch (err) {
    issue('engine-error', phase, errMsg(err), issueStack(err));
    rec.outcome = 'error';
  }
  if (run) {
    rec.actReached = run.act;
    rec.floorsReached = run.act * MAP_ROWS + run.floorsClimbed;
    rec.deck = run.player.deck.map((c) => ({ id: c.id, up: !!c.up }));
    rec.relics = [...run.player.relics];
    rec.potions = run.player.potions.filter(Boolean);
    rec.gold = run.player.gold;
    rec.hp = Math.max(0, run.player.hp);
    rec.maxHp = run.player.maxHp;
  }
  rec.triggerEvents = triggerObserver.events();
  rec.triggerFunnels = triggerObserver.funnels();
  return rec;
}
