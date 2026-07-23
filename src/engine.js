// SPIREBOUND engine — pure game logic, no DOM. UI consumes cb.queue for animation.
import { PLAYER, ACTS, ASPECTS, VOWS, CARDS, CARD_POOLS, STATUS_INFO, RELICS, RELIC_POOLS, POTIONS, ENEMIES, ENCOUNTERS, EVENTS, REWARD_GOLD, SHOP, ARTS, OMENS, AFFIXES, REVEALS, POOL_GATE, PROGRESSION, QUEST_IDS, WHISPERS, QUESTS, QUEST_STATES, QUEST_ACTIVE_STATES, TERMINAL_OUTCOMES, RUN_ID_RE, VARIANTS, SHADE_KITS, BOONS, DEEDS } from './data.js';


// ---------------------------------------------------------------- run→content seam (Task 12B)
const RUN_CONTENT = new WeakMap();
const EPHEMERAL_RUNS = new WeakSet();

/** Frozen core engine view built only from the 28 data.js content imports. */
const CORE_ENGINE_CONTENT = Object.freeze({
  id: 'core',
  localeToken: 'en',
  player: PLAYER,
  acts: ACTS,
  cards: CARDS,
  cardPools: CARD_POOLS,
  statuses: STATUS_INFO,
  relics: RELICS,
  relicPools: RELIC_POOLS,
  potions: POTIONS,
  enemies: ENEMIES,
  encounters: ENCOUNTERS,
  events: EVENTS,
  rewardGold: REWARD_GOLD,
  shop: SHOP,
  omens: OMENS,
  affixes: AFFIXES,
  arts: ARTS,
  deeds: DEEDS,
  progression: PROGRESSION,
  reveals: REVEALS,
  poolGate: POOL_GATE,
  questIds: QUEST_IDS,
  whispers: WHISPERS,
  quests: QUESTS,
  shadeKits: SHADE_KITS,
  variants: VARIANTS,
  aspects: ASPECTS,
  vows: VOWS,
  boons: BOONS,
  themeOrder: Object.freeze(ACTS.map((_, i) => `act${i + 1}`)),
});

function assertEngineContent(content) {
  if (!content || typeof content !== 'object' || Object.isFrozen(content) !== true) {
    throw new TypeError('engine content must be a recursively frozen content context');
  }
  if (typeof content.id !== 'string' || !content.id.trim()) {
    throw new TypeError('engine content requires a non-empty id');
  }
  for (const key of [
    'cards', 'relics', 'potions', 'enemies', 'events', 'omens', 'arts', 'aspects', 'vows',
    'boons', 'quests', 'questIds', 'progression', 'variants', 'encounters', 'rewardGold', 'acts',
  ]) {
    if (content[key] == null) throw new TypeError(`engine content missing domain: ${key}`);
  }
  return content;
}

function resolveNewRunContent(opts = {}) {
  if (opts.content != null) return assertEngineContent(opts.content);
  return CORE_ENGINE_CONTENT;
}

function engineContentFor(run) {
  if (run == null) return CORE_ENGINE_CONTENT;
  return RUN_CONTENT.get(run) || CORE_ENGINE_CONTENT;
}

/** @private short alias used throughout run-capable paths */
const T = engineContentFor;

export function contentIdFor(run) {
  return engineContentFor(run).id;
}

export function isEphemeralRun(run) {
  return !!run && EPHEMERAL_RUNS.has(run);
}

export function themeCount(run) {
  const content = engineContentFor(run);
  return content.themeOrder?.length ?? content.acts?.length ?? 0;
}

export function isFinalTheme(run) {
  return Number.isInteger(run?.act) && run.act >= 0 && run.act === themeCount(run) - 1;
}

function deepCopyJson(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

// ---------------------------------------------------------------- RNG (mulberry32)
export function makeRng(state) {
  const rng = () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  rng.getState = () => state;
  return rng;
}
const pick = (rng, arr) => arr[Math.floor(rng() * arr.length)];
const irange = (rng, [a, b]) => a + Math.floor(rng() * (b - a + 1));
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
let runSequence = 0;
let questRngOverride = null;
export function _setQuestRng(fn) { questRngOverride = typeof fn === 'function' ? fn : null; }
const questRngSnapshots = new WeakSet();
export function _captureQuestRngAdapter() {
  const snapshot = Object.freeze({ questRngOverride });
  questRngSnapshots.add(snapshot);
  return snapshot;
}
export function _restoreQuestRngAdapter(snapshot) {
  if (!questRngSnapshots.has(snapshot)) throw new TypeError('invalid quest RNG adapter snapshot');
  questRngOverride = snapshot.questRngOverride;
}
const freshRunId = (seed, startedAt) =>
  `run-${startedAt.toString(36)}-${(seed >>> 0).toString(36)}-${(++runSequence).toString(36)}`;
const legacyRunId = (run) =>
  `legacy-${(Number(run.seed) >>> 0).toString(36)}-${Math.max(0, Math.floor(Number(run.stats?.start) || 0)).toString(36)}`;
const validRunId = (id) => typeof id === 'string' && RUN_ID_RE.test(id);
const continuedTerminalRuns = new WeakSet();
const RECEIPT_CACHE_KEYS = Object.freeze([
  'vigilCommitted', 'vigilWon', 'vigilResult',
  'runEndCommitted', 'runEndOutcome', 'runEndResult',
]);

const copyLifecycleEvents = (events) => Array.isArray(events)
  ? events.map((event) => ({ ...event }))
  : [];

export function pendingDawnSnapshot(run, events, newUnlocks = []) {
  if (!run || typeof run !== 'object' || run?.pendingRunEnd?.outcome !== 'win' ||
      run.pendingDawn != null || !validRunId(run.runId)) return null;
  const pendingDawn = {
    events: copyLifecycleEvents(events),
    cursor: 0,
    newUnlocks: Array.isArray(newUnlocks) ? [...newUnlocks] : [],
  };
  const snapshot = { ...run, pendingRunEnd: null, pendingDawn };
  for (const key of RECEIPT_CACHE_KEYS) delete snapshot[key];
  return snapshot;
}

export function applyPendingDawnSnapshot(run, snapshot) {
  run.pendingRunEnd = null;
  run.pendingDawn = snapshot.pendingDawn;
  for (const key of RECEIPT_CACHE_KEYS) delete run[key];
}

export function advancedDawnSnapshot(run, nextCursor) {
  const pending = run?.pendingDawn;
  if (!pending || !Array.isArray(pending.events) || !Number.isInteger(pending.cursor) ||
      !Number.isInteger(nextCursor) || nextCursor !== pending.cursor + 1 ||
      nextCursor > pending.events.length) return null;
  return {
    ...run,
    pendingDawn: { ...pending, events: copyLifecycleEvents(pending.events), cursor: nextCursor },
  };
}

export function savedRunRequiresFinalisation(run) {
  return TERMINAL_OUTCOMES.includes(run?.pendingRunEnd?.outcome) || run?.pendingDawn != null;
}

export function journalTerminalOutcome(run, outcome) {
  if (!TERMINAL_OUTCOMES.includes(outcome)) throw new Error(`invalid terminal outcome: ${outcome}`);
  if (run.pendingDawn != null) throw new Error('a staged dawn cannot be replaced by another terminal outcome');
  const current = run.pendingRunEnd?.outcome;
  if (current != null) {
    if (current !== outcome) throw new Error(`terminal outcome cannot change from ${current} to ${outcome}`);
    return run.pendingRunEnd;
  }
  run.pendingReward = null;
  run.pendingCombat = null;
  run.pendingEnemyIds = null;
  run.pendingQuestId = null;
  run.pendingHollow = null;
  run.pendingHollowRoute = null;
  run.pendingRunEnd = { outcome };
  return run.pendingRunEnd;
}

export function finaliseTerminalOutbox(run, persist, onFailure, onFinalised) {
  if (continuedTerminalRuns.has(run)) return true;
  let result = null;
  let failure = null;
  try {
    result = persist();
  } catch (error) {
    failure = error;
  }
  if (failure || result?.accepted !== true) {
    onFailure(failure);
    return false;
  }
  continuedTerminalRuns.add(run);
  onFinalised(result);
  return true;
}

// ---------------------------------------------------------------- run lifecycle
// opts: { aspect, vow, unlocks (vigil snapshot), reveals (vigil snapshot; null/absent = fully revealed), monument (last fall), lamplighter, quests, shards }
export function newRun(seed = (Math.random() * 2 ** 31) | 0, opts = {}) {
  const content = resolveNewRunContent(opts);
  // Reject unknown catalogue ids before RNG consumption or run mutation.
  if (opts.art != null && !Object.hasOwn(content.arts, opts.art)) {
    throw new Error(`unknown art: ${opts.art}`);
  }
  if (opts.boon != null && !Object.hasOwn(content.boons, opts.boon)) {
    throw new Error(`unknown boon: ${opts.boon}`);
  }
  const startedAt = Date.now();
  const aspect = clamp(opts.aspect || 0, 0, content.aspects.length - 1);
  const A = content.aspects[aspect];
  const vow = clamp(opts.vow || 0, 0, content.vows.length);
  const run = {
    v: 2, runId: opts.runId || freshRunId(seed, startedAt), seed, rngState: seed, uid: 1, act: 0, nodeId: null, floorsClimbed: 0, bossRelicAct: -1, orphanRewardClaimed: false, orphanRewardResolving: false,
    aspect, vow, art: opts.art || A.art || 'flare', omens: [], boon: opts.boon || null, boonReceipt: null,
    unlocks: [...(opts.unlocks || [])],
    reveals: opts.reveals ? [...opts.reveals] : null,
    monument: opts.monument ? { ...opts.monument, claimed: false } : null,
    quests: opts.quests
      ? Object.fromEntries(content.questIds.map((id) => [id, {
          state: opts.quests[id]?.state || 'dormant',
          progress: Math.min(content.quests[id].target,
            Math.max(0, Math.floor(Number(opts.quests[id]?.progress) || 0))),
          memory: { ...(opts.quests[id]?.memory || {}) },
        }]))
      : {},
    shards: [...(opts.shards || [])],
    questScratch: {},
    questCompletions: [],
    endQueue: [],
    pendingCombat: null,
    pendingEnemyIds: null,
    pendingQuestId: null,
    pendingReward: null,
    pendingRunEnd: null,
    pendingDawn: null,
    pendingHollow: null,
    pendingHollowRoute: null,
    player: {
      hp: A.maxHp, maxHp: A.maxHp, gold: A.startGold, energyMax: A.energy,
      relics: [A.startRelic], potions: Array(A.potionSlots || 3).fill(null), deck: [],
    },
    stats: {
      slain: 0, elites: 0, bosses: 0, dmgDealt: 0, dmgTaken: 0, cardsPlayed: 0, goldEarned: 0,
      shatters: 0, kindles: 0, perfects: 0, smolderKills: 0, unlitVisited: 0, embersSpent: 0, start: startedAt,
    },
    map: null,
  };
  RUN_CONTENT.set(run, content);
  if (opts.ephemeral) EPHEMERAL_RUNS.add(run);
  if (opts.lamplighter) run.pendingLamplighter = true;
  for (const id of A.startDeck) run.player.deck.push(makeCard(run, id));
  if (vowMods(run).startHex) run.player.deck.push(makeCard(run, 'hex'));
  prepareEighthOmen(run);
  run.omens.push(omenEnabled(run) ? rollOmen(run) : null);
  preparePaleRun(run);
  prepareHollowLamplighter(run);
  run.map = genMap(run);
  return run;
}
export function questRecord(run, id) {
  return run.quests && T(run).questIds.includes(id) ? run.quests[id] || null : null;
}

export function revealQuest(run, id, queue = run.endQueue) {
  const q = questRecord(run, id);
  if (!q || q.state === 'dormant') return q;
  if (q.state === 'armed') {
    q.state = 'revealed';
    queue?.push({ t: 'questReveal', id });
  }
  return q;
}

export function questProgressTarget(state, id, progress = questRecord(state, id)?.progress ?? 0) {
  const { progression, quests } = T(state);
  if (id === 'paleOnes' && !state?.unlocks?.includes('insight:witchlightLens') &&
      progress <= progression.emberglass.paleOnes.lensAt) {
    return progression.emberglass.paleOnes.lensAt;
  }
  return quests[id]?.target ?? 0;
}

export function questProgressName(id, target, run = null) {
  const { progression, quests } = T(run);
  if (id === 'paleOnes' && target === progression.emberglass.paleOnes.lensAt) {
    return quests.paleOnes.huntName;
  }
  return quests[id]?.name ?? id;
}

export function questDisclosure(state, id) {
  const { progression, quests } = T(state);
  const quest = quests[id];
  const progress = questRecord(state, id)?.progress ?? 0;
  const huntingPaleOnes = id === 'paleOnes' &&
    !state?.unlocks?.includes('insight:witchlightLens') &&
    progress <= progression.emberglass.paleOnes.lensAt;
  return {
    name: huntingPaleOnes ? quest.huntName : quest.name,
    inscription: huntingPaleOnes ? quest.huntInscription : quest.inscription,
    progress,
    target: questProgressTarget(state, id, progress),
  };
}

export function advanceQuest(run, id, n = 1, queue = run.endQueue) {
  const q = revealQuest(run, id, queue);
  if (!q || q.state === 'dormant' || q.state === 'complete' || n <= 0) return q;
  q.progress = Math.min(T(run).quests[id].target, q.progress + n);
  queue?.push({ t: 'questProgress', id, progress: q.progress, target: questProgressTarget(run, id, q.progress) });
  if (q.progress >= T(run).quests[id].target) {
    q.state = 'complete';
    if (id === 'hollowLamplighter') q.memory = {};
    if (!run.questCompletions.includes(id)) run.questCompletions.push(id);
    queue?.push({ t: 'questComplete', id });
  }
  return q;
}

const questRoll = (run) => questRngOverride ? questRngOverride() : runRng(run)();
function prepareEighthOmen(run) {
  const q = questRecord(run, 'eighthOmen');
  if (!q || !QUEST_ACTIVE_STATES.includes(q.state)) return;
  const due = q.memory.dueIn;
  const guaranteeRuns = Math.max(1, Math.floor(T(run).progression.emberglass.eighthOmen.guaranteeRuns));
  let active = false;
  if (Number.isInteger(due) && due >= 1 && due <= guaranteeRuns) {
    active = due === 1 || questRoll(run) < T(run).progression.emberglass.eighthOmen.recurrenceChance;
    if (!active) q.memory.dueIn = due - 1;
  } else if (q.memory.seen) {
    active = questRoll(run) < T(run).progression.emberglass.eighthOmen.recurrenceChance;
  }
  run.questScratch.eighthOmen = { active };
  if (active) {
    q.memory.seen = true;
    delete q.memory.dueIn;
    revealQuest(run, 'eighthOmen', run.endQueue);
  }
}

export function markShadeFall(run, act, row) {
  const q = questRecord(run, 'ownShade');
  if (!q || q.state === 'dormant' || q.state === 'complete') return false;
  if (act < T(run).progression.emberglass.ownShade.minDeathAct) return false;
  run.questScratch.ownShade ||= {};
  const bequest = run.questScratch.ownShade.pendingBequest ?? null;
  run.questScratch.ownShade.fall = { act, row, shadeAspect: run.aspect, bequest };
  return true;
}

export function setPendingEncounter(run, kind, enemyIds, questId = null) {
  run.pendingCombat = kind;
  run.pendingEnemyIds = [...enemyIds];
  run.pendingQuestId = questId ??
    enemyIds.map((id) => T(run).variants[id]?.drop?.quest).find((id) => T(run).questIds.includes(id)) ?? null;
}

export function clearPendingEncounter(run) {
  run.pendingCombat = null;
  run.pendingEnemyIds = null;
  run.pendingQuestId = null;
}

export function setPendingReward(run, kind, rewards, perfect = false) {
  run.pendingReward = {
    kind,
    rewards: {
      gold: rewards.gold,
      cards: [...rewards.cards],
      potion: rewards.potion ?? null,
      relic: rewards.relic ?? null,
    },
    taken: { gold: false, potion: false, relic: false, card: false },
    perfect: !!perfect,
  };
  return run.pendingReward;
}

export function takePendingReward(run, key, cardId = null) {
  const pending = run.pendingReward;
  if (!pending || !Object.hasOwn(pending.taken, key) || pending.taken[key]) return false;
  if (key === 'gold') {
    run.player.gold += pending.rewards.gold;
    run.stats.goldEarned += pending.rewards.gold;
  } else if (key === 'potion') {
    if (!pending.rewards.potion || !gainPotion(run, pending.rewards.potion)) return false;
  } else if (key === 'relic') {
    if (!pending.rewards.relic) return false;
    gainRelic(run, pending.rewards.relic);
  } else if (key === 'card') {
    if (cardId != null && !pending.rewards.cards.includes(cardId)) return false;
    if (cardId != null) addCardToDeck(run, cardId);
  } else return false;
  pending.taken[key] = true;
  return true;
}

export function clearPendingReward(run) {
  run.pendingReward = null;
}

/** True when the victory panel still has an offered reward row left untaken. */
export function pendingRewardHasUntaken(run) {
  const pending = run.pendingReward;
  if (!pending) return false;
  const { rewards, taken } = pending;
  if (!taken.gold || !taken.card) return true;
  if (rewards.potion && !taken.potion) return true;
  if (rewards.relic && !taken.relic) return true;
  return false;
}
// vows stack: at Vow N, vows 1..N are all in force. Reads T(run).vows[i].mods.
export function vowMods(run) {
  const m = { hpMult: 1, enemyDmgBonus: 0, bossFacetDelta: 0, startHex: false };
  const lvl = clamp(run.vow || 0, 0, T(run).vows.length);
  for (let i = 0; i < lvl; i++) {
    const vm = T(run).vows[i].mods;
    if (vm.hpMult) m.hpMult *= vm.hpMult;
    if (vm.enemyDmgBonus) m.enemyDmgBonus += vm.enemyDmgBonus;
    if (vm.bossFacetDelta) m.bossFacetDelta += vm.bossFacetDelta;
    if (vm.startHex) m.startHex = true;
    if (vm.restHealFrac != null) m.restHealFrac = Math.min(m.restHealFrac ?? 1, vm.restHealFrac);
  }
  return m;
}
// omens: one rule per act, imposed on everyone
export const omenEnabled = (run) => runRevealed(run, 'omens') || !!run.questScratch.eighthOmen?.active;
export function rollOmen(run) {
  if (run.questScratch.eighthOmen?.active) return 'eighthOmen';
  return pick(runRng(run), Object.keys(T(run).omens).filter((id) => id !== 'eighthOmen'));
}
export function omenMods(run) { return T(run).omens[run.omens?.[run.act]]?.mods || {}; }
export function restHealFrac(run) { return Math.min(0.3, omenMods(run).restHealFrac ?? 0.3, vowMods(run).restHealFrac ?? 0.3); }
const LIVE_ACT_SUCCESSOR = new Map([[0, 1], [1, 2]]);

/** Canonical live Act I -> II / Act II -> III transition. There is no playable Act IV. */
export function advanceAct(run) {
  if (!run || !Number.isInteger(run.act) ||
      run.pendingCombat != null || run.pendingReward != null ||
      run.pendingRunEnd != null || run.pendingDawn != null ||
      run.pendingHollow != null || run.pendingHollowRoute != null) return false;
  const nextAct = LIVE_ACT_SUCCESSOR.get(run.act);
  if (!Number.isInteger(nextAct) || !T(run).acts[nextAct]) return false;

  run.act = nextAct;
  run.omens ??= [];
  run.omens.length = nextAct;
  run.omens.push(omenEnabled(run) ? rollOmen(run) : null);
  run.nodeId = null;
  run.map = genMap(run);
  healPlayer(run, Math.round(run.player.maxHp * 0.35));
  return true;
}

export function makeCard(run, id, up = false) {
  return { uid: run.uid++, id, up, bonus: 0 };
}
export function cardData(inst, run = null) {
  const base = T(run).cards[inst.id];
  return inst.up && base.up ? { ...base, ...base.up, name: base.name + '+' } : base;
}
export function runRng(run) {
  const rng = makeRng(run.rngState);
  return () => { const v = rng(); run.rngState = rng.getState(); return v; };
}

const PALE_BY_ACT = ['paleDuskfang', 'paleDrownedOne', 'paleVoidWisp'];
export const paleVariantForAct = (act) => PALE_BY_ACT[clamp(act | 0, 0, PALE_BY_ACT.length - 1)];

/** Theme-index mark schedule for Pale Ones (no digit equality on run.act). */
function paleMarkCount(run) {
  const pale = run.questScratch?.paleOnes;
  if (!run.unlocks.includes('insight:witchlightLens') || !pale) return 0;
  const cfg = T(run).progression.emberglass.paleOnes;
  const schedule = [
    Math.max(0, Math.floor(cfg.markedAct1)),
    pale.markedAct2 ? 1 : 0,
  ];
  return schedule.at(run.act) ?? 0;
}

/** Sole shards-gated reveal id (legacy key lives in progression tables, not call sites). */
export function sealedSummitRevealId(run) {
  const thresholds = T(run).progression?.revealThresholds || {};
  for (const [id, trigger] of Object.entries(thresholds)) {
    if (Number.isFinite(trigger?.shards)) return id;
  }
  return null;
}

export function sealedSummitShardThreshold(run) {
  const id = sealedSummitRevealId(run);
  if (!id) return 0;
  return Math.max(0, Math.floor(T(run).progression.revealThresholds[id].shards));
}

function preparePaleRun(run) {
  const q = questRecord(run, 'paleOnes');
  if (!q || !QUEST_ACTIVE_STATES.includes(q.state)) return;
  const lens = run.unlocks.includes('insight:witchlightLens');
  const hiddenRemaining = !lens && q.progress < T(run).progression.emberglass.paleOnes.lensAt
    ? Math.max(0, Math.floor(T(run).progression.emberglass.paleOnes.hiddenPerRun))
    : 0;
  run.questScratch.paleOnes = {
    hiddenDue: hiddenRemaining > 0,
    hiddenRemaining,
    markedAct2: lens && runRng(run)() < T(run).progression.emberglass.paleOnes.markedAct2Chance,
  };
}

function prepareHollowLamplighter(run) {
  const hq = questRecord(run, 'hollowLamplighter');
  if (!hq || !QUEST_ACTIVE_STATES.includes(hq.state)) return;
  if (hq.memory.emberDebt > 0) {
    run.questScratch.hollowLamplighter = { due: false, met: false, meetings: 0, debtActive: true };
    return;
  }
  const misses = hq.memory.eligibleMisses || 0;
  const due = misses >= T(run).progression.emberglass.hollowLamplighter.pityEligibleRuns - 1 ||
    runRng(run)() < T(run).progression.emberglass.hollowLamplighter.appearanceChance;
  run.questScratch.hollowLamplighter = { due, met: false, meetings: 0, debtActive: false };
}

// ---------------------------------------------------------------- map generation
export const MAP_ROWS = 15, MAP_COLS = 7;
export function genMap(run) {
  const rng = runRng(run);
  const grid = {}; // 'r,c' -> node
  const key = (r, c) => `${r},${c}`;
  const nodeAt = (r, c) => {
    if (!grid[key(r, c)]) grid[key(r, c)] = { id: key(r, c), row: r, col: c, type: 'monster', next: [], jx: (rng() - 0.5) * 0.5, jy: (rng() - 0.5) * 0.4 };
    return grid[key(r, c)];
  };
  const paths = 6;
  const usedStart = new Set();
  for (let p = 0; p < paths; p++) {
    let c;
    do { c = Math.floor(rng() * MAP_COLS); } while (p < 2 && usedStart.has(c));
    usedStart.add(c);
    let cur = nodeAt(0, c);
    for (let r = 1; r < MAP_ROWS - 1; r++) {
      const dc = clamp(cur.col + (Math.floor(rng() * 3) - 1), 0, MAP_COLS - 1);
      const nxt = nodeAt(r, dc);
      if (!cur.next.includes(nxt.id)) cur.next.push(nxt.id);
      cur = nxt;
    }
    const boss = nodeAt(MAP_ROWS - 1, 3);
    if (!cur.next.includes(boss.id)) cur.next.push(boss.id);
  }
  const nodes = Object.values(grid);
  let hasShop = false;
  for (const n of nodes) {
    if (n.row === 0) n.type = 'monster';
    else if (n.row === MAP_ROWS - 1) n.type = 'boss';
    else if (n.row === MAP_ROWS - 2) n.type = 'rest';
    else if (n.row === 8) n.type = 'treasure';
    else {
      const r = rng();
      if (r < 0.46) n.type = 'monster';
      else if (r < 0.68) n.type = 'event';
      else if (r < 0.81 && n.row >= 5) n.type = 'elite';
      else if (r < 0.91 && n.row >= 4 && n.row < MAP_ROWS - 3) n.type = 'rest';
      else if (n.row >= 4) n.type = 'shop';
      else n.type = 'monster';
    }
    if (n.type === 'shop') hasShop = true;
  }
  if (!hasShop) {
    const cand = nodes.filter((n) => n.type === 'monster' && n.row >= 5 && n.row <= 11);
    if (cand.length) pick(rng, cand).type = 'shop';
  }
  // some lanterns hang dark: their keeper is unknown until you step to them,
  // but first light always pays a bounty
  for (const n of nodes) {
    if (n.row === 0 || n.row === 8 || n.row >= MAP_ROWS - 2) continue;
    if (rng() < 0.15) {
      n.unlit = true;
      n.bounty = irange(rng, [12, 22]) + run.act * 6;
    }
  }
  // the monument of the last fall stands in the act where that climber died,
  // near the row of the fall — never on rows 0/8/rest/boss, never the sole shop
  if (run.monument && !run.monument.claimed && run.monument.act === run.act) {
    const targetRow = clamp(run.monument.row || 5, 1, MAP_ROWS - 3);
    const onlyShop = nodes.filter((n) => n.type === 'shop').length === 1;
    const cand = nodes.filter((n) =>
      n.row > 0 && n.row < MAP_ROWS - 2 && n.row !== 8 && n.type !== 'boss' && !(onlyShop && n.type === 'shop'));
    if (cand.length) {
      const best = cand.reduce((a, b) => (Math.abs(b.row - targetRow) < Math.abs(a.row - targetRow) ? b : a));
      best.type = 'monument';
      delete best.unlit; delete best.bounty;
    }
  }
  const markCount = paleMarkCount(run);
  if (markCount > 0) {
    const candidates = nodes.filter((n) => n.row === 0 && n.type === 'monster');
    for (let i = 0; i < markCount && candidates.length; i++) {
      const [marked] = candidates.splice(Math.floor(rng() * candidates.length), 1);
      marked.questVariantId = paleVariantForAct(run.act);
      marked.questMarked = true;
    }
  }
  return { nodes, visited: [] };
}
export function availableNodes(run) {
  const { nodes, visited } = run.map;
  if (!run.nodeId) return nodes.filter((n) => n.row === 0);
  const cur = nodes.find((n) => n.id === run.nodeId);
  return nodes.filter((n) => cur.next.includes(n.id));
}
// stepping onto a node: bookkeeping + unlit bounty. Returns the node's true face.
export function visitNode(run, node) {
  const wasUnlit = !!node.unlit;
  run.nodeId = node.id;
  if (run.orphanRewardClaimed) {
    node.rewardClaimed = true;
    run.orphanRewardClaimed = false;
  }
  if (run.orphanRewardResolving) {
    node.rewardResolving = true;
    run.orphanRewardResolving = false;
  }
  run.floorsClimbed = node.row + 1;
  if (!run.map.visited.includes(node.id)) run.map.visited.push(node.id);
  let bounty = 0;
  if (node.unlit) {
    delete node.unlit;
    bounty = (node.bounty || 0) * (hasRelic(run, 'thiefOfWicks') ? 2 : 1);
    delete node.bounty;
    run.player.gold += bounty;
    run.stats.goldEarned += bounty;
    run.stats.unlitVisited++;
  }
  const hollow = run.questScratch?.hollowLamplighter;
  const maxMeetings = Math.max(0, Math.floor(T(run).progression.emberglass.hollowLamplighter.maxMeetingsPerRun));
  const storedMeetings = Number.isInteger(hollow?.meetings)
    ? hollow.meetings
    : hollow?.met ? maxMeetings : 0;
  const meetings = Math.min(storedMeetings, maxMeetings);
  const hollowQuest = questRecord(run, 'hollowLamplighter');
  const hollowActive = QUEST_ACTIVE_STATES.includes(hollowQuest?.state);
  const hollowDebt = hollowQuest?.memory?.emberDebt || 0;
  if (wasUnlit && hollow?.due && hollowActive && !hollowDebt && meetings < maxMeetings) {
    hollow.meetings = storedMeetings + 1;
    hollow.met = true;
    revealQuest(run, 'hollowLamplighter', run.endQueue);
    run.pendingHollow = {
      nodeId: node.id, type: node.type, paid: false, deferred: false, answer: null,
    };
    return { type: node.type, bounty, hollow: true };
  }
  return { type: node.type, bounty };
}
const HOLLOW_DESTINATION_TYPES = ['rest', 'shop', 'event'];
export function stageHollowExit(run) {
  const pending = run.pendingHollow;
  if (!pending || run.pendingHollowRoute || run.pendingCombat || run.pendingReward || run.pendingRunEnd) return null;
  const node = run.map?.nodes?.find((candidate) => candidate.id === pending.nodeId);
  if (!node || node.type !== pending.type || run.nodeId !== node.id || !run.map.visited.includes(node.id)) return null;
  const { nodeId, type } = pending;
  if (['monster', 'elite', 'boss'].includes(type)) {
    const enemyIds = rollEncounter(run, type, node.row, node);
    setPendingEncounter(run, type, enemyIds);
    run.pendingHollow = null;
    return { kind: 'combat', nodeId, type, enemyIds: [...enemyIds] };
  }
  if (!HOLLOW_DESTINATION_TYPES.includes(type)) return null;
  const eventId = type === 'event' ? rollEvent(run) : null;
  run.pendingHollowRoute = { nodeId, type, eventId };
  run.pendingHollow = null;
  return { kind: 'destination', nodeId, type, eventId };
}
export function completePendingHollowRoute(run) {
  const held = run?.pendingHollowRoute;
  if (!held) return true;
  run.pendingHollowRoute = null;
  if (saveRun(run)) return true;
  run.pendingHollowRoute = held;
  return false;
}
export function grantBequest(run, bequest, queue = null) {
  if (!bequest) return false;
  if (bequest.kind === 'card') addCardToDeck(run, bequest.id, bequest.up);
  else if (bequest.kind === 'relic') gainRelic(run, bequest.id);
  else if (bequest.kind === 'gold') {
    run.player.gold += bequest.amount;
    run.stats.goldEarned += bequest.amount;
  } else return false;
  queue?.push({ t: 'monumentGift', bequest });
  return true;
}

// recover what the last Duskblade left in the stone
export function claimMonument(run) {
  const m = run.monument;
  if (!m || m.claimed || (!m.standing && !m.bequest)) return null;
  m.claimed = true;
  if (m.standing) {
    run.questScratch.ownShade ||= {};
    run.questScratch.ownShade.pendingBequest = m.bequest ?? null;
    const progress = questRecord(run, 'ownShade')?.progress || 0;
    const tierIds = Object.keys(T(run).variants)
      .filter((id) => /^ownShade[1-9]\d*$/.test(id))
      .sort((a, b) => Number(a.slice('ownShade'.length)) - Number(b.slice('ownShade'.length)));
    const tierCount = Math.min(
      T(run).progression.emberglass.ownShade.tiers.length,
      T(run).quests.ownShade.target,
      tierIds.length,
    );
    if (tierCount < 1) throw new Error('Your Own Shade has no authored combat tier');
    return {
      kind: 'shadeDuel',
      variantId: tierIds[Math.min(tierCount, progress + 1) - 1],
      bequest: m.bequest ?? null,
    };
  }
  grantBequest(run, m.bequest);
  return m.bequest;
}

export const SHADE_DUEL_TX = Object.freeze({
  READY: 'ready',
  RETRY_CLAIM: 'retryClaim',
  RETRY_CLEAR: 'retryClear',
  RELOAD_PENDING: 'reloadPending',
});

function shadeClaimSnapshot(run) {
  const hadScratch = Object.hasOwn(run.questScratch, 'ownShade');
  return {
    monumentClaimed: run.monument?.claimed,
    pendingCombat: run.pendingCombat,
    pendingEnemyIds: run.pendingEnemyIds == null ? null : [...run.pendingEnemyIds],
    pendingQuestId: run.pendingQuestId,
    hadScratch,
    scratch: hadScratch ? { ...run.questScratch.ownShade } : null,
  };
}

function restoreShadeClaim(run, snapshot) {
  if (run.monument) run.monument.claimed = snapshot.monumentClaimed;
  run.pendingCombat = snapshot.pendingCombat;
  run.pendingEnemyIds = snapshot.pendingEnemyIds == null ? null : [...snapshot.pendingEnemyIds];
  run.pendingQuestId = snapshot.pendingQuestId;
  if (snapshot.hadScratch) run.questScratch.ownShade = snapshot.scratch;
  else delete run.questScratch.ownShade;
}

export function beginShadeDuel(run, clearStandingBequest) {
  if (!run?.monument?.standing || run.monument.claimed) {
    return { status: SHADE_DUEL_TX.RETRY_CLAIM, durablePending: false, duel: null };
  }
  const before = shadeClaimSnapshot(run);
  const duel = claimMonument(run);
  if (duel?.kind !== 'shadeDuel') {
    restoreShadeClaim(run, before);
    return { status: SHADE_DUEL_TX.RETRY_CLAIM, durablePending: false, duel: null };
  }
  setPendingEncounter(run, 'monster', [duel.variantId], 'ownShade');
  if (!saveRun(run)) {
    restoreShadeClaim(run, before);
    return { status: SHADE_DUEL_TX.RETRY_CLAIM, durablePending: false, duel: null };
  }
  if (clearStandingBequest() === true) {
    return { status: SHADE_DUEL_TX.READY, durablePending: true, duel };
  }
  restoreShadeClaim(run, before);
  if (saveRun(run)) {
    return { status: SHADE_DUEL_TX.RETRY_CLAIM, durablePending: false, duel: null };
  }
  return { status: SHADE_DUEL_TX.RELOAD_PENDING, durablePending: true, duel: null };
}

export function resumeShadeDuel(run, clearStandingBequest) {
  if (run?.pendingQuestId !== 'ownShade') {
    return { status: SHADE_DUEL_TX.READY, durablePending: false };
  }
  return clearStandingBequest() === true
    ? { status: SHADE_DUEL_TX.READY, durablePending: true }
    : { status: SHADE_DUEL_TX.RETRY_CLEAR, durablePending: true };
}

export function shadeVictorySkipsRewards(run) {
  return run?.pendingQuestId === 'ownShade';
}

export function shadeLossBequestState(run) {
  const unpaidBequest = run?.questScratch?.ownShade?.fall?.bequest != null;
  return { unpaidBequest, offerNewBequest: !unpaidBequest };
}

// ---------------------------------------------------------------- helpers
export const hasRelic = (run, id) => run.player.relics.includes(id);
// structural reveals: run.reveals is a snapshot of vigil reveal ids taken at
// newRun time; null (tests, dev hooks, pre-reveal saves) means fully revealed.
export const runRevealed = (run, id) => run.reveals == null || run.reveals.includes(id);
// content pools honor the run's vigil unlocks ('card:id' / 'relic:id' tokens);
// unknown ids are ignored so deeds can promise content before it ships
export function cardPool(run, tier) {
  const extra = (run.unlocks || [])
    .filter((u) => u.startsWith('card:')).map((u) => u.slice(5))
    .filter((id) => T(run).cards[id] && T(run).cards[id].rarity === tier);
  let base = T(run).cardPools[tier];
  if (run.reveals != null) base = base.filter((id) => !T(run).poolGate.cards[id] || run.reveals.includes(T(run).poolGate.cards[id]));
  return extra.length ? [...base, ...extra] : base;
}
export function relicPool(run, tier) {
  const extra = (run.unlocks || [])
    .filter((u) => u.startsWith('relic:')).map((u) => u.slice(6))
    .filter((id) => T(run).relics[id] && T(run).relics[id].rarity === tier);
  let base = T(run).relicPools[tier];
  if (run.reveals != null) base = base.filter((id) => !T(run).poolGate.relics[id] || run.reveals.includes(T(run).poolGate.relics[id]));
  return extra.length ? [...base, ...extra] : base;
}
export function healPlayer(run, n, cb = null) {
  if (hasRelic(run, 'sunBlossom')) n = Math.round(n * 1.5);
  const p = cb ? cb.player : run.player;
  const before = p.hp;
  p.hp = clamp(p.hp + n, 0, p.maxHp);
  const healed = p.hp - before;
  if (cb && healed > 0) cb.queue.push({ t: 'heal', who: 'player', n: healed });
  return healed;
}
export function gainRelic(run, id, cb = null) {
  const r = T(run).relics[id];
  if (!r) return;
  if (r.replaces) {
    const i = run.player.relics.indexOf(r.replaces);
    if (i >= 0) run.player.relics.splice(i, 1);
  }
  run.player.relics.push(id);
  // instant / permanent pickup effects
  if (id === 'sweetRoot') { run.player.maxHp += 8; run.player.hp += 8; }
  if (id === 'hollowCrown') {
    run.player.energyMax += 1;
    run.player.maxHp = Math.max(1, run.player.maxHp - 10);
    run.player.hp = Math.min(run.player.hp, run.player.maxHp);
  }
}
export function randomRelic(run, weights = { common: 0.5, uncommon: 0.35, rare: 0.15 }) {
  const rng = runRng(run);
  const owned = new Set(run.player.relics);
  const order = ['common', 'uncommon', 'rare'];
  let r = rng(), tier = 'common', acc = 0;
  for (const t of order) { acc += weights[t] || 0; if (r < acc) { tier = t; break; } }
  const idx = order.indexOf(tier);
  for (let i = 0; i < order.length; i++) {
    const t = order[(idx + i) % order.length];
    const avail = relicPool(run, t).filter((id) => !owned.has(id));
    if (avail.length) return pick(rng, avail);
  }
  return null;
}
function currentNode(run) {
  if (!run.nodeId || !run.map?.nodes) return null;
  return run.map.nodes.find((n) => n.id === run.nodeId) || null;
}
function isNodeRewardClaimed(run) {
  const node = currentNode(run);
  if (node) return !!node.rewardClaimed;
  return !!run.orphanRewardClaimed;
}
function isNodeEventInFlight(run) {
  const node = currentNode(run);
  if (node) return !!node.rewardResolving;
  return !!run.orphanRewardResolving;
}
function isNodeRewardLocked(run) {
  return isNodeRewardClaimed(run) || isNodeEventInFlight(run);
}
function markNodeEventResolving(run) {
  const node = currentNode(run);
  if (node) node.rewardResolving = true;
  else run.orphanRewardResolving = true;
}
function markNodeRewardClaimed(run) {
  const node = currentNode(run);
  if (node) {
    node.rewardClaimed = true;
    delete node.rewardResolving;
  } else {
    run.orphanRewardClaimed = true;
    run.orphanRewardResolving = false;
  }
}
export function nodeRewardClaimed(run) {
  return isNodeRewardClaimed(run);
}
export function nodeEventInFlight(run) {
  return isNodeEventInFlight(run);
}
export function finalizeNodeEventChoice(run) {
  markNodeRewardClaimed(run);
}
// One reward per map node — UI guards are the first line; this is the engine backstop.
export function claimTreasure(run, weights = { common: 0.55, uncommon: 0.35, rare: 0.1 }) {
  if (isNodeRewardClaimed(run)) return { already: true, relicId: null, gold: 0 };
  const relicId = randomRelic(run, weights);
  if (relicId) gainRelic(run, relicId);
  else run.player.gold += 60;
  markNodeRewardClaimed(run);
  return { already: false, relicId, gold: relicId ? 0 : 60 };
}
// Sync ops run immediately; interactive pending finishes in the UI, then finalizeNodeEventChoice.
export function applyNodeEventChoice(run, ops, rng = runRng(run)) {
  if (isNodeRewardLocked(run)) return { pending: [], log: [], already: true };
  const { pending, log } = applyEventOps(run, ops, rng);
  markNodeEventResolving(run);
  return { pending, log, already: false };
}
export function claimBossRelic(run, id) {
  if (run.bossRelicAct === run.act) return { already: true, id: null };
  run.bossRelicAct = run.act;
  if (id) gainRelic(run, id);
  return { already: false, id: id || null };
}
export function hasPendingBossRelic(run) {
  if (!run || isFinalTheme(run) || run.pendingCombat || run.pendingReward || run.pendingRunEnd) return false;
  const node = run.map?.nodes?.find((candidate) => candidate.id === run.nodeId);
  return node?.type === 'boss' && run.map.visited?.includes(node.id) === true;
}
export function gainPotion(run, id) {
  if (!runRevealed(run, 'phials')) return false;
  if (id === 'random') id = pick(runRng(run), Object.keys(T(run).potions));
  const i = run.player.potions.indexOf(null);
  if (i < 0) return false;
  run.player.potions[i] = id;
  return true;
}
export function rollCardReward(run, kind = 'normal') {
  const rng = runRng(run);
  const n = 3 + (hasRelic(run, 'seersOrb') ? 1 : 0) + (omenMods(run).rewardChoiceBonus || 0);
  const out = [];
  const guard = new Set();
  while (out.length < n && guard.size < 40) {
    let pool;
    if (kind === 'boss') pool = 'rare';
    else {
      const r = rng();
      pool = kind === 'elite'
        ? (r < 0.45 ? 'common' : r < 0.85 ? 'uncommon' : 'rare')
        : (r < 0.6 ? 'common' : r < 0.92 ? 'uncommon' : 'rare');
    }
    const id = pick(rng, cardPool(run, pool));
    guard.add(id + Math.floor(rng() * 4));
    if (!out.includes(id)) out.push(id);
  }
  const pageQuest = questRecord(run, 'unreadablePage');
  const isFinalBossReward = kind === 'boss' && isFinalTheme(run);
  if (!isFinalBossReward && pageQuest && QUEST_ACTIVE_STATES.includes(pageQuest.state) &&
      pageQuest.progress < T(run).quests.unreadablePage.target) {
    const scratch = (run.questScratch.unreadablePage ||= {});
    scratch.rewardOrdinal = (scratch.rewardOrdinal || 0) + 1;
    if (!scratch.offered &&
        scratch.rewardOrdinal === T(run).progression.emberglass.unreadablePage.offerRewardOrdinal && out.length) {
      out[out.length - 1] = 'unreadablePage';
      scratch.offered = true;
      revealQuest(run, 'unreadablePage', run.endQueue);
    }
  }
  return out;
}
// events that offer cards draw from the same unlock-aware pools
export function rollEventCards(run, n) {
  const rng = runRng(run);
  const all = [
    ...cardPool(run, 'common'), ...cardPool(run, 'common'),
    ...cardPool(run, 'uncommon'), ...cardPool(run, 'uncommon'), ...cardPool(run, 'rare'),
  ];
  const out = [];
  let guard = 0;
  while (out.length < n && guard++ < 60) {
    const id = all[Math.floor(rng() * all.length)];
    if (!out.includes(id)) out.push(id);
  }
  return out;
}
export function genCombatRewards(run, kind, affix = null) {
  const rng = runRng(run);
  let gold = irange(rng, T(run).rewardGold[run.act][kind === 'boss' ? 'boss' : kind === 'elite' ? 'elite' : 'normal']);
  gold = Math.round(gold * (omenMods(run).goldMult || 1) * (T(run).affixes[affix]?.mods.goldMult || 1));
  const rw = { gold, cards: rollCardReward(run, kind), potion: null, relic: null };
  if (kind !== 'boss' && rng() < 0.4 && runRevealed(run, 'phials')) rw.potion = pick(rng, Object.keys(T(run).potions));
  if (kind === 'elite') rw.relic = randomRelic(run);
  return rw;
}
export function rollBossRelics(run) {
  const rng = runRng(run);
  const owned = new Set(run.player.relics);
  const avail = relicPool(run, 'boss').filter((id) => !owned.has(id));
  const out = [];
  while (out.length < Math.min(3, avail.length)) {
    const id = pick(rng, avail);
    if (!out.includes(id)) out.push(id);
  }
  return out;
}
export function genShop(run) {
  const rng = runRng(run);
  const price = ([a, b], disc) => Math.round(irange(rng, [a, b]) * disc);
  const disc = (hasRelic(run, 'merchantsMark') ? 0.75 : 1) * (omenMods(run).shopMult || 1);
  const questItems = [];
  const usurper = questRecord(run, 'usurper');
  if (usurper && QUEST_ACTIVE_STATES.includes(usurper.state) &&
      run.act >= T(run).progression.emberglass.usurper.minShopAct &&
      !run.questScratch?.usurper?.bought) {
    revealQuest(run, 'usurper');
    questItems.push({
      id: 'flamelessLantern',
      name: T(run).quests.usurper.itemName,
      text: T(run).quests.usurper.itemText,
      price: T(run).progression.emberglass.usurper.price,
      sold: false,
    });
  }
  const cardIds = [];
  const wants = ['common', 'common', 'uncommon', 'uncommon', 'rare'];
  for (const t of wants) {
    let id, tries = 0;
    do { id = pick(rng, cardPool(run, t)); } while (cardIds.some((c) => c.id === id) && ++tries < 20);
    cardIds.push({ id, price: price(T(run).shop.cardPrice[t], disc), sold: false });
  }
  const owned = new Set(run.player.relics);
  const relics = [];
  for (const t of ['common', 'uncommon']) {
    const avail = relicPool(run, t).filter((id) => !owned.has(id) && !relics.some((r) => r.id === id));
    if (avail.length) relics.push({ id: pick(rng, avail), price: price(T(run).shop.relicPrice[t], disc), sold: false });
  }
  const potions = [];
  if (runRevealed(run, 'phials')) {
    for (let i = 0; i < 2; i++) potions.push({ id: pick(rng, Object.keys(T(run).potions)), price: price(T(run).shop.potionPrice, disc), sold: false });
  }
  return { cards: cardIds, relics, potions, questItems, removeCost: Math.round(T(run).shop.removeCost * disc), removed: false };
}
export function shopSessionKey(run) {
  return `${run.runId}:${run.act}:${run.nodeId ?? ''}`;
}
export function shopStockForSession(session, run) {
  const key = shopSessionKey(run);
  if (!session.stock || session.key !== key) {
    session.stock = genShop(run);
    session.key = key;
  }
  return session.stock;
}
export function buyQuestItem(run, itemId) {
  if (itemId !== 'flamelessLantern') return { ok: false, reason: 'unknown' };
  const q = questRecord(run, 'usurper');
  if (!q || !QUEST_ACTIVE_STATES.includes(q.state)) return { ok: false, reason: 'inactive' };
  if (run.act < T(run).progression.emberglass.usurper.minShopAct) return { ok: false, reason: 'act' };
  if (run.questScratch?.usurper?.bought) return { ok: false, reason: 'bought' };
  const price = T(run).progression.emberglass.usurper.price;
  if (run.player.gold < price) return { ok: false, reason: 'gold' };
  run.player.gold -= price;
  run.questScratch.usurper = { bought: true };
  return { ok: true, reason: null };
}
export function rollEvent(run) {
  const rng = runRng(run);
  const seen = (run.seenEvents ||= []);
  let ids = Object.keys(T(run).events).filter((id) => !seen.includes(id));
  if (!ids.length) { run.seenEvents = []; ids = Object.keys(T(run).events); }
  const id = pick(rng, ids);
  seen.push(id);
  return id;
}
export function rollEncounter(run, type, row, node) {
  if (node?.questVariantId) return [node.questVariantId];
  const pale = run.questScratch?.paleOnes;
  const savedHiddenRemaining = Number.isInteger(pale?.hiddenRemaining)
    ? pale.hiddenRemaining
    : pale?.hiddenDue ? 1 : 0;
  const hiddenRemaining = Math.min(savedHiddenRemaining,
    Math.max(0, Math.floor(T(run).progression.emberglass.paleOnes.hiddenPerRun)));
  if (pale) {
    pale.hiddenRemaining = hiddenRemaining;
    pale.hiddenDue = hiddenRemaining > 0;
  }
  if (type === 'monster' && hiddenRemaining > 0) {
    pale.hiddenRemaining = hiddenRemaining - 1;
    pale.hiddenDue = pale.hiddenRemaining > 0;
    return [paleVariantForAct(run.act)];
  }
  if (type === 'boss' && isFinalTheme(run) && run.questScratch?.usurper?.bought) {
    return ['usurpedSovereign'];
  }
  const rng = runRng(run);
  const pools = T(run).encounters[run.act];
  const pool = type === 'boss' ? pools.boss : type === 'elite' ? pools.elite : row < 3 ? pools.weak : pools.normal;
  const last = run.lastEnc;
  let enc, tries = 0;
  do { enc = pick(rng, pool); } while (pool.length > 1 && enc.join() === last && ++tries < 8);
  run.lastEnc = enc.join();
  return enc;
}

// ---------------------------------------------------------------- combat
const scaleMoveDamage = (move, mult) => ({
  ...move,
  ...(move.dmg == null ? {} : { dmg: Math.max(0, Math.round(move.dmg * mult)) }),
});

export function makeVariant(baseDef, variantDef) {
  const mods = variantDef.statMods || {};
  const hpMult = mods.hpMult ?? 1;
  const dmgMult = mods.dmgMult ?? 1;
  return {
    ...baseDef,
    name: variantDef.name,
    hp: baseDef.hp.map((n) => Math.max(1, Math.round(n * hpMult))),
    moves: Object.fromEntries(Object.entries(baseDef.moves).map(([id, move]) => [id, scaleMoveDamage(move, dmgMult)])),
    startStatus: { ...(baseDef.startStatus || {}), ...(mods.addStatuses || {}) },
    variantId: variantDef.id,
    dialogue: [...variantDef.dialogue],
    deathDialogue: variantDef.deathDialogue ?? null,
    drop: variantDef.drop,
  };
}

function heroShadeBase(run) {
  const aspectIndex = run.monument?.shadeAspect ?? run.aspect ?? 0;
  const aspect = T(run).aspects[aspectIndex] || T(run).aspects[0];
  const kit = T(run).shadeKits[aspect.id];
  return {
    name: aspect.name + ' Shade', hp: [110, 110], facets: 6, boss: true,
    art: T(run).enemies.shade.art, moves: kit.moves, ai: kit.ai,
    presentation: {
      artCategory: 'heroes', artId: aspect.id, layoutKey: 'shade',
      kind: 'humanoid', hue: aspect.hue || 0,
    },
  };
}

export function resolveCombatant(run, id) {
  const variant = T(run).variants[id];
  if (!variant) {
    const def = T(run).enemies[id];
    return {
      def, baseKey: id, variantId: null,
      presentation: {
        artCategory: 'enemies', artId: id, layoutKey: id,
        kind: def.art.kind, hue: def.art.hue, tint: null, scale: 1,
      },
    };
  }
  const base = variant.base === 'hero' ? heroShadeBase(run) : T(run).enemies[variant.base];
  const def = makeVariant(base, variant);
  const basePresentation = base.presentation || {
    artCategory: 'enemies', artId: variant.base, layoutKey: variant.base,
    kind: base.art.kind, hue: base.art.hue,
  };
  return {
    def, baseKey: variant.base === 'hero' ? 'shade' : variant.base, variantId: variant.id,
    presentation: { ...basePresentation, tint: variant.tint, scale: variant.scale },
  };
}

export function startCombat(run, enemyIds, kind = 'normal', opts = {}) {
  const rng = runRng(run);
  const om = omenMods(run);
  const vm = vowMods(run);
  // every elite arrives wearing a title; the title is a promise
  const affixed = kind === 'elite' || (om.allCombatsAffixed && kind !== 'boss');
  const affix = affixed ? (opts.affix || pick(rng, Object.keys(T(run).affixes))) : null;
  const af = affix ? T(run).affixes[affix].mods : {};
  const cb = {
    kind, affix, turn: 0, over: false, result: null, queue: [],
    player: {
      hp: run.player.hp, maxHp: run.player.maxHp, block: 0, energy: 0, energyMax: run.player.energyMax,
      statuses: {},
    },
    enemies: enemyIds.map((id, i) => {
      const resolved = resolveCombatant(run, id);
      const d = resolved.def;
      return {
        key: resolved.baseKey, variantId: resolved.variantId, def: d, presentation: resolved.presentation,
        idx: i, name: d.name,
        maxHp: Math.round(irange(rng, d.hp) * (om.hpMult || 1) * (af.hpMult || 1) * (vm.hpMult || 1)), block: af.startBlock || 0,
        statuses: { ...(d.startStatus || {}) }, flags: af.adamant ? { adamant: true } : {}, lastMoves: [], moveKey: null,
        elite: !!d.elite, boss: !!d.boss,
        // every creature is glass: fill its facet gauge and it shatters
        facetMax: Math.max(2, (d.facets ?? (d.boss ? 6 : d.elite ? 5 : 4)) + (om.facetDelta || 0) + (af.facetDelta || 0) + (d.boss ? (vm.bossFacetDelta || 0) : 0)), chips: 0,
      };
    }),
    draw: [], hand: [], discard: [], exhaust: [],
    embers: 0, emberCap: 9, artUsedTurn: 0, kindledTurn: 0, kindlesThisTurn: 0, pendingChips: null,
    counters: { played: 0, attacks: 0, firstCardPlayed: false, hpLost: 0 },
  };
  cb.enemies.forEach((e) => (e.hp = e.maxHp));
  for (const questId of new Set(cb.enemies.map((enemy) => enemy.def.drop?.quest))) {
    if (questId === 'paleOnes' || questId === 'ownShade') revealQuest(run, questId, cb.queue);
  }
  if (kind === 'boss' && cb.enemies[0]) cb.queue.push({ t: 'bossIntro', name: cb.enemies[0].name });
  const aspectName = T(run).aspects[run.aspect].name.replace(/^The\s+/, '');
  for (const e of cb.enemies) {
    for (const line of e.def.dialogue || []) {
      cb.queue.push({ t: 'variantDialogue', idx: e.idx, text: line.replace(/\{aspect\}/g, aspectName) });
    }
  }
  // what the night and the title impose on the glass
  for (const e of cb.enemies) {
    for (const [sid, n] of Object.entries({ ...(om.enemyStartStatus || {}), ...(af.startStatus || {}) })) {
      e.statuses[sid] = (e.statuses[sid] || 0) + n;
    }
  }
  if (om.startEmbers) cb.embers = clamp(om.startEmbers, 0, cb.emberCap);
  // deck
  cb.draw = run.player.deck.map((c) => ({ ...c, bonus: 0 }));
  shuffle(rng, cb.draw);
  // relic combat-start hooks
  const P = cb.player;
  if (hasRelic(run, 'basaltIdol')) { P.block += 10; proc(cb, 'basaltIdol'); }
  if (hasRelic(run, 'warFetish')) { addStatus(cb, P, 'str', 1); proc(cb, 'warFetish'); }
  if (hasRelic(run, 'riverPearl')) { addStatus(cb, P, 'dex', 1); proc(cb, 'riverPearl'); }
  if (hasRelic(run, 'thornBand')) { addStatus(cb, P, 'thorns', 2); proc(cb, 'thornBand'); }
  if (hasRelic(run, 'vialOfLife')) { healPlayer(run, 2, cb); proc(cb, 'vialOfLife'); }
  if (hasRelic(run, 'crownOfCinders')) { cb.emberCap = 12; cb.embers = clamp(cb.embers + 2, 0, cb.emberCap); proc(cb, 'crownOfCinders'); }
  if (hasRelic(run, 'shatterersCrown')) {
    cb.enemies.forEach((e) => { e.facetMax = Math.max(2, e.facetMax - 1); e.statuses.str = (e.statuses.str || 0) + 1; });
    proc(cb, 'shatterersCrown');
  }
  if (hasRelic(run, 'smolderingCoal')) {
    cb.enemies.forEach((e) => (e.statuses.poison = (e.statuses.poison || 0) + 2));
    proc(cb, 'smolderingCoal');
  }
  if (hasRelic(run, 'ashenCore')) {
    cb.enemies.forEach((e) => (e.statuses.poison = (e.statuses.poison || 0) + 3));
    proc(cb, 'ashenCore');
  }
  computeIntents(run, cb);
  startPlayerTurn(run, cb);
  return cb;
}
function shuffle(rng, arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
function proc(cb, relicId) { cb.queue.push({ t: 'relicProc', id: relicId }); }
export function addStatus(cb, who, id, n) {
  who.statuses[id] = (who.statuses[id] || 0) + n;
  if (who.statuses[id] === 0) delete who.statuses[id];
  cb.queue.push({ t: 'status', who: who === cb.player ? 'player' : who.idx, id, n });
}
function computeIntents(run, cb) {
  const rng = runRng(run);
  for (const e of cb.enemies) {
    if (e.hp <= 0) continue;
    e.moveKey = e.def.ai({
      turn: cb.turn + 1, last: e.lastMoves[e.lastMoves.length - 1], prev: e.lastMoves[e.lastMoves.length - 2],
      rng, hpFrac: e.hp / e.maxHp, self: e,
    });
    cb.queue.push({ t: 'intent', idx: e.idx, move: e.moveKey });
  }
}
export function enemyMove(e) { return e.def.moves[e.moveKey]; }

// ---------------------------------------------------------------- shatter & embers
// spilled fire, caught by your lantern. Negative n = spent.
export function gainEmbers(run, cb, n) {
  if (n > 0) {
    const q = questRecord(run, 'hollowLamplighter');
    const debt = q?.state === 'revealed' && q.progress === 0 ? q.memory.emberDebt || 0 : 0;
    const tithe = Math.min(n, debt);
    if (tithe > 0) {
      q.memory.emberDebt -= tithe;
      const remaining = q.memory.emberDebt;
      const event = { t: 'hollowTithe', n: tithe, remaining };
      if (remaining === 0) {
        delete q.memory.emberDebt;
        event.paid = T(run).quests.hollowLamplighter.meetings[0].paid;
      }
      cb.queue.push(event);
      if (remaining === 0) advanceQuest(run, 'hollowLamplighter', 1, cb.queue);
      n -= tithe;
    }
  }
  const next = clamp(cb.embers + n, 0, cb.emberCap);
  const delta = next - cb.embers;
  if (!delta) return 0;
  cb.embers = next;
  cb.queue.push({ t: 'ember', n: delta, total: cb.embers });
  return delta;
}
// facet chips land after the card that earned them resolves (see playCard);
// overflow carries into the next, harder pane
function applyChips(run, cb, e, n) {
  if (cb.over || e.hp <= 0 || n <= 0) return;
  e.chips += n;
  cb.queue.push({ t: 'chip', idx: e.idx, n, chips: Math.min(e.chips, e.facetMax), facetMax: e.facetMax });
  while (e.chips >= e.facetMax && e.hp > 0) {
    e.chips -= e.facetMax;
    shatterEnemy(run, cb, e);
  }
}
function shatterEnemy(run, cb, e) {
  e.facetMax += 1; // annealed: each pane reseams harder than the last
  if (e.flags.adamant && !e.flags.adamantSpent) {
    e.flags.adamantSpent = true;
    cb.queue.push({ t: 'adamantHold', idx: e.idx });
    return;
  }
  run.stats.shatters++;
  e.flags.staggered = true;
  cb.queue.push({ t: 'shatter', idx: e.idx, facetMax: e.facetMax });
  addStatus(cb, e, 'vulnerable', 2);
  gainEmbers(run, cb, 2);
  if (hasRelic(run, 'prismCharm') && !cb.prismProcd) {
    cb.prismProcd = true;
    gainEmbers(run, cb, 2);
    proc(cb, 'prismCharm');
  }
  const sm = e.statuses.poison || 0;
  if (sm && cb.enemies.some((o) => o !== e && o.hp > 0)) {
    delete e.statuses.poison;
    jumpSmolder(run, cb, e, sm);
  }
  if (hasRelic(run, 'bellOfEndings')) {
    proc(cb, 'bellOfEndings');
    for (const o of cb.enemies.filter((x) => x !== e && x.hp > 0)) {
      if (cb.over) break;
      hitEnemy(run, cb, o, 4, { isAttack: false });
    }
  }
}
// smolder is faithful to the fire, not the vessel: when its host shatters or
// dies, it leaps to another living enemy (or is lost with the last one)
function jumpSmolder(run, cb, from, amount) {
  if (!amount) return;
  const others = cb.enemies.filter((x) => x !== from && x.hp > 0);
  if (!others.length) return;
  const to = pick(runRng(run), others);
  addStatus(cb, to, 'poison', amount);
  cb.queue.push({ t: 'smolderJump', from: from.idx, to: to.idx, n: amount });
}
// the Lantern Art: the hero's one always-available answer, paid in embers
export function canUseArt(run, cb) {
  const art = T(run).arts[run.art];
  return !!art && !cb.over && cb.artUsedTurn !== cb.turn && cb.embers >= art.cost;
}
export function useArt(run, cb) {
  if (!canUseArt(run, cb)) return false;
  const art = T(run).arts[run.art];
  cb.artUsedTurn = cb.turn;
  run.stats.embersSpent += art.cost;
  gainEmbers(run, cb, -art.cost);
  cb.queue.push({ t: 'art', id: run.art });
  for (const fx of art.effects) {
    if (cb.over) break;
    applyArtEffect(run, cb, fx);
  }
  return true;
}
// lantern fire is not a blade: it ignores Fervor/Dimmed/Cracked and strikes everyone
function applyArtEffect(run, cb, fx) {
  const P = cb.player;
  const living = () => cb.enemies.filter((e) => e.hp > 0);
  switch (fx.kind) {
    case 'dmg': for (const e of living()) { if (!cb.over) hitEnemy(run, cb, e, fx.n, { isAttack: false }); } break;
    case 'status': {
      if (fx.who === 'self') addStatus(cb, P, fx.id, fx.n);
      else for (const e of living()) addStatus(cb, e, fx.id, fx.n);
      break;
    }
    case 'block': gainBlock(run, cb, P, fx.n, false); break;
    case 'heal': healPlayer(run, fx.n, cb); break;
    case 'energy': P.energy += fx.n; cb.queue.push({ t: 'energy', n: P.energy }); break;
    case 'draw': drawCards(run, cb, fx.n); break;
    case 'chip': for (const e of living()) applyChips(run, cb, e, fx.n); break;
    case 'ember': gainEmbers(run, cb, fx.n); break;
  }
}
// the universal rite: once per turn, feed any hand card to the lantern
export function canKindle(run, cb, inst) {
  if (!inst || cb.over) return false;
  if (cardData(inst, run).type === 'curse') return false; // hexes cling to the hand
  return !(cb.kindledTurn === cb.turn && cb.kindlesThisTurn >= kindleLimit(run));
}
function kindleLimit(run) { return hasRelic(run, 'crownOfTithes') ? 2 : 1; }
export function kindleFromHand(run, cb, uid) {
  const i = cb.hand.findIndex((c) => c.uid === uid);
  if (i < 0) return false;
  const inst = cb.hand[i];
  if (!canKindle(run, cb, inst)) return false;
  if (cb.kindledTurn !== cb.turn) { cb.kindledTurn = cb.turn; cb.kindlesThisTurn = 0; }
  cb.kindlesThisTurn++;
  cb.hand.splice(i, 1);
  run.stats.kindles++;
  cb.queue.push({ t: 'kindle', uid: inst.uid, id: inst.id });
  exhaustCard(run, cb, inst);
  if (hasRelic(run, 'crownOfTithes')) { gainBlock(run, cb, cb.player, 3, false); proc(cb, 'crownOfTithes'); }
  return true;
}

// damage an enemy from the player. returns actual hp loss
function hitEnemy(run, cb, e, base, { isAttack = true, mult = 1 } = {}) {
  if (e.hp <= 0 || cb.over) return 0;
  const P = cb.player;
  let dmg = base;
  if (isAttack) {
    dmg += P.statuses.str || 0;
    if (P.statuses.weak) dmg = Math.floor(dmg * 0.75);
    if (e.statuses.vulnerable) dmg = Math.floor(dmg * 1.5);
  }
  dmg = Math.max(0, Math.floor(dmg * mult));
  const blocked = Math.min(e.block, dmg);
  e.block -= blocked;
  const loss = dmg - blocked;
  e.hp -= loss;
  run.stats.dmgDealt += loss;
  cb.queue.push({
    t: 'hitEnemy', idx: e.idx, amount: loss, blocked, hpAfter: Math.max(0, e.hp), dead: e.hp <= 0,
    killingBlow: e.hp <= 0 && loss > 0, overkill: Math.max(0, -e.hp),
  });
  // an attack card that draws unblocked blood earns its facet chip (once per card)
  if (cb.pendingChips && isAttack && loss > 0) {
    const rec = cb.pendingChips.get(e.idx) || { hit: false, extra: 0 };
    rec.hit = true;
    cb.pendingChips.set(e.idx, rec);
  }
  if (isAttack && e.statuses.thorns && e.hp > 0) damagePlayer(run, cb, e.statuses.thorns, { source: 'thorns', isAttack: false });
  if (e.hp <= 0) onEnemyDeath(run, cb, e);
  return loss;
}
function onEnemyDeath(run, cb, e) {
  e.hp = 0;
  const smolder = e.statuses.poison || 0; // capture before the vessel empties
  e.statuses = {};
  e.flags.staggered = false;
  cb.queue.push({ t: 'die', idx: e.idx });
  run.stats.slain++;
  if (e.elite) run.stats.elites++;
  if (e.boss) run.stats.bosses++;
  if (e.def.drop?.quest === 'paleOnes') {
    const q = advanceQuest(run, 'paleOnes', e.def.drop.n, cb.queue);
    if (q && q.progress >= T(run).progression.emberglass.paleOnes.lensAt &&
        !run.unlocks.includes('insight:witchlightLens')) {
      run.unlocks.push('insight:witchlightLens');
      cb.queue.push({ t: 'questUnlock', id: 'insight:witchlightLens' });
    }
  }
  if (e.def.drop?.quest === 'ownShade') {
    if (e.def.deathDialogue) {
      cb.queue.push({ t: 'variantDialogue', idx: e.idx, text: e.def.deathDialogue });
    }
    const before = questRecord(run, 'ownShade');
    const wasComplete = before?.state === 'complete';
    const q = advanceQuest(run, 'ownShade', e.def.drop.n, cb.queue);
    const scratch = run.questScratch?.ownShade;
    if (scratch && Object.hasOwn(scratch, 'pendingBequest')) {
      grantBequest(run, scratch.pendingBequest, cb.queue);
      delete scratch.pendingBequest;
    }
    if (!wasComplete && q?.state === 'complete' &&
        !run.endQueue.some((event) => event.t === 'shadeResolved')) {
      run.endQueue.push({ t: 'shadeResolved', text: T(run).quests.ownShade.final });
    }
  }
  if (e.def.drop?.quest === 'usurper') {
    const wasComplete = questRecord(run, 'usurper')?.state === 'complete';
    const q = advanceQuest(run, 'usurper', e.def.drop.n, cb.queue);
    if (!wasComplete && q?.state === 'complete') {
      cb.queue.push({ t: 'variantDialogue', idx: e.idx, text: T(run).quests.usurper.death });
    }
  }
  if (cb.enemies.every((x) => x.hp <= 0)) { winCombat(run, cb); return; }
  gainEmbers(run, cb, 1); // the fire inside spills to your lantern
  jumpSmolder(run, cb, e, smolder);
  if (hasRelic(run, 'reapersBell')) {
    cb.player.energy += 1;
    drawCards(run, cb, 1);
    proc(cb, 'reapersBell');
    cb.queue.push({ t: 'energy', n: cb.player.energy });
  }
}
// damage the player. source: enemy idx | 'thorns' | 'poison' | 'burn' | 'self'
function damagePlayer(run, cb, base, { source = 'self', isAttack = false, attacker = null } = {}) {
  if (cb.over) return 0;
  const P = cb.player;
  let dmg = base;
  if (isAttack && attacker) {
    dmg += (attacker.statuses.str || 0) + (attacker.flags.rampBonus || 0) + (omenMods(run).enemyDmgBonus || 0) + (vowMods(run).enemyDmgBonus || 0);
    if (attacker.statuses.weak) dmg = Math.floor(dmg * 0.75);
    if (P.statuses.vulnerable) dmg = Math.floor(dmg * 1.5);
    if (hasRelic(run, 'wardingCharm') && dmg <= 5 && dmg > 0) { dmg = 1; proc(cb, 'wardingCharm'); }
  }
  dmg = Math.max(0, dmg);
  let blocked = 0;
  if (isAttack || source === 'thorns') { // poison/burn/self ignore block
    blocked = Math.min(P.block, dmg);
    P.block -= blocked;
  }
  const loss = dmg - blocked;
  P.hp -= loss;
  run.stats.dmgTaken += Math.max(0, loss);
  cb.counters.hpLost += Math.max(0, loss);
  cb.queue.push({ t: 'hitPlayer', amount: loss, blocked, hpAfter: Math.max(0, P.hp), source });
  if (P.hp <= 0) { loseCombat(run, cb); return loss; }
  if (isAttack && attacker) {
    // what clings to their blows: omen ash, affix cinders
    const applies = { ...(omenMods(run).playerHitApplies || {}), ...(cb.affix ? T(run).affixes[cb.affix].mods.attackApplies || {} : {}) };
    for (const [sid, n] of Object.entries(applies)) addStatus(cb, P, sid, n);
    if (P.statuses.thorns && attacker.hp > 0) hitEnemy(run, cb, attacker, P.statuses.thorns, { isAttack: false });
  }
  return loss;
}
function gainBlock(run, cb, who, base, withDex = true) {
  let b = base;
  if (who === cb.player && withDex) {
    b += who.statuses.dex || 0;
    if (who.statuses.frail) b = Math.floor(b * 0.75);
  }
  b = Math.round(Math.max(0, b) * (omenMods(run).wardMult || 1)); // heavy air holds the light
  who.block += b;
  cb.queue.push({ t: 'blockGain', who: who === cb.player ? 'player' : who.idx, n: b, total: who.block });
  return b;
}
export function drawCards(run, cb, n) {
  const rng = runRng(run);
  for (let i = 0; i < n; i++) {
    if (cb.hand.length >= 10) break;
    if (!cb.draw.length) {
      if (!cb.discard.length) break;
      const n = cb.discard.length;
      cb.draw = cb.discard;
      cb.discard = [];
      shuffle(rng, cb.draw);
      cb.queue.push({ t: 'reshuffle', n });
    }
    const c = cb.draw.pop();
    cb.hand.push(c);
    cb.queue.push({ t: 'draw', uid: c.uid, id: c.id });
  }
}
function exhaustCard(run, cb, inst) {
  cb.exhaust.push(inst);
  cb.queue.push({ t: 'exhaust', uid: inst.uid });
  gainEmbers(run, cb, 1); // everything burned feeds the lantern
  if (hasRelic(run, 'verdantBranch')) { drawCards(run, cb, 1); proc(cb, 'verdantBranch'); }
}

function startPlayerTurn(run, cb) {
  if (cb.over) return;
  cb.turn++;
  const P = cb.player;
  cb.queue.push({ t: 'turn', n: cb.turn });
  // poison ticks at the start of your turn
  if (P.statuses.poison) {
    damagePlayer(run, cb, P.statuses.poison, { source: 'poison' });
    P.statuses.poison--;
    if (!P.statuses.poison) delete P.statuses.poison;
    if (cb.over) return;
  }
  if (!P.statuses.barricade) P.block = 0;
  if (P.statuses.ritual) addStatus(cb, P, 'str', P.statuses.ritual);
  if (P.statuses.emberflow) gainEmbers(run, cb, P.statuses.emberflow);
  let energy = P.energyMax + (P.statuses.energized || 0);
  if (cb.turn === 1 && hasRelic(run, 'emberLantern')) { energy += 1; proc(cb, 'emberLantern'); }
  P.energy = (hasRelic(run, 'frozenCore') ? P.energy : 0) + energy;
  cb.counters.firstCardPlayed = false;
  cb.queue.push({ t: 'energy', n: P.energy });
  let draws = 5 + (P.statuses.nightsight || 0) + (omenMods(run).drawDelta || 0);
  if (cb.turn === 1 && hasRelic(run, 'travelersPack')) { draws += 2; proc(cb, 'travelersPack'); }
  drawCards(run, cb, Math.max(1, draws));
}

export function effCost(run, cb, inst) {
  const d = cardData(inst, run);
  if (d.cost == null) return null;
  if (hasRelic(run, 'duskmirror') && !cb.counters.firstCardPlayed) return 0;
  if (omenMods(run).firstCardDiscount && !cb.counters.firstCardPlayed) {
    return Math.max(0, d.cost - omenMods(run).firstCardDiscount); // the waning moon's last light
  }
  return d.cost;
}
export function canPlay(run, cb, inst, targetIdx) {
  if (cb.over) return false;
  const d = cardData(inst, run);
  if (d.unplayable) return false;
  const cost = effCost(run, cb, inst);
  if (cost > cb.player.energy) return false;
  if (d.target === 'enemy' && (targetIdx == null || !cb.enemies[targetIdx] || cb.enemies[targetIdx].hp <= 0)) return false;
  return true;
}

export function playCard(run, cb, uid, targetIdx = null) {
  const i = cb.hand.findIndex((c) => c.uid === uid);
  if (i < 0) return false;
  const inst = cb.hand[i];
  const d = cardData(inst, run);
  if (!canPlay(run, cb, inst, targetIdx)) return false;
  const P = cb.player;
  const cost = effCost(run, cb, inst);
  P.energy -= cost;
  if (hasRelic(run, 'duskmirror') && !cb.counters.firstCardPlayed && d.cost > 0) proc(cb, 'duskmirror');
  cb.counters.firstCardPlayed = true;
  cb.hand.splice(i, 1);
  cb.counters.played++;
  run.stats.cardsPlayed++;
  cb.queue.push({ t: 'play', uid: inst.uid, id: inst.id, targetIdx });
  cb.queue.push({ t: 'energy', n: P.energy });

  let sealMult = 1;
  if (d.type === 'attack') {
    cb.counters.attacks++;
    if (hasRelic(run, 'ironTalisman') && cb.counters.attacks % 3 === 0) { addStatus(cb, P, 'str', 1); proc(cb, 'ironTalisman'); }
    if (hasRelic(run, 'executionersSeal') && cb.counters.attacks % 10 === 0) { sealMult = 2; proc(cb, 'executionersSeal'); }
  }
  const target = targetIdx != null ? cb.enemies[targetIdx] : null;
  const livingTargets = () => cb.enemies.filter((e) => e.hp > 0);

  cb.pendingChips = new Map(); // facet chips land after the whole card resolves
  for (const fx of d.effects) {
    if (cb.over) break;
    applyEffect(run, cb, inst, d, fx, target, sealMult);
  }
  if (cb.pendingChips && !cb.over) {
    const per = d.type === 'attack' ? 1 + (d.chip || 0) + (P.statuses.beacon || 0) : 0;
    for (const [idx, rec] of cb.pendingChips) {
      const e = cb.enemies[idx];
      if (!e || e.hp <= 0 || cb.over) continue;
      const n = (rec.hit ? per : 0) + rec.extra;
      if (n > 0) applyChips(run, cb, e, n);
    }
  }
  cb.pendingChips = null;
  // venomous power: attacks apply poison
  if (!cb.over && d.type === 'attack' && P.statuses.venomous) {
    const vs = d.target === 'allEnemies' ? livingTargets() : target && target.hp > 0 ? [target] : [];
    for (const e of vs) addStatus(cb, e, 'poison', P.statuses.venomous);
  }
  // silk fan
  if (!cb.over && hasRelic(run, 'silkFan') && cb.counters.played % 3 === 0) { gainBlock(run, cb, P, 3, false); proc(cb, 'silkFan'); }

  if (d.type === 'power') cb.queue.push({ t: 'powerConsumed', uid: inst.uid });
  else if (d.exhaust) exhaustCard(run, cb, inst);
  else {
    cb.discard.push(inst);
    cb.queue.push({ t: 'toDiscard', uid: inst.uid });
  }
  return true;
}

function applyEffect(run, cb, inst, d, fx, target, sealMult) {
  const P = cb.player;
  const each = d.target === 'allEnemies' ? cb.enemies.filter((e) => e.hp > 0) : target ? [target] : [];
  switch (fx.kind) {
    case 'dmg': {
      const times = fx.times || 1;
      for (let t = 0; t < times; t++) {
        for (const e of d.target === 'allEnemies' ? cb.enemies.filter((x) => x.hp > 0) : each) {
          if (cb.over) return;
          hitEnemy(run, cb, e, fx.n, { mult: sealMult });
        }
      }
      break;
    }
    case 'block': gainBlock(run, cb, P, fx.n); break;
    case 'draw': drawCards(run, cb, fx.n); break;
    case 'energy': P.energy += fx.n; cb.queue.push({ t: 'energy', n: P.energy }); break;
    case 'heal': healPlayer(run, fx.n, cb); break;
    case 'loseHp': damagePlayer(run, cb, fx.n, { source: 'self' }); break;
    case 'status': {
      if (fx.who === 'self') addStatus(cb, P, fx.id, fx.n);
      else if (fx.who === 'allEnemies') for (const e of cb.enemies.filter((x) => x.hp > 0)) addStatus(cb, e, fx.id, fx.n);
      else if (target && target.hp > 0) addStatus(cb, target, fx.id, fx.n);
      break;
    }
    case 'addCard': {
      for (let i = 0; i < (fx.n || 1); i++) {
        const c = { uid: run.uid++, id: fx.id, up: false, bonus: 0 };
        const where = fx.where === 'hand' && cb.hand.length < 10 ? 'hand' : 'discard';
        (where === 'hand' ? cb.hand : cb.discard).push(c);
        cb.queue.push({ t: 'addCard', id: fx.id, where });
      }
      break;
    }
    case 'chip': { // strikes at the glass itself, no blood needed
      for (const e of each) {
        if (e.hp <= 0) continue;
        if (cb.pendingChips) {
          const rec = cb.pendingChips.get(e.idx) || { hit: false, extra: 0 };
          rec.extra += fx.n;
          cb.pendingChips.set(e.idx, rec);
        } else applyChips(run, cb, e, fx.n); // arts/phials chip immediately
      }
      break;
    }
    case 'ember': gainEmbers(run, cb, fx.n); break;
    case 'special': applySpecial(run, cb, inst, d, fx, target, sealMult);
  }
}

function applySpecial(run, cb, inst, d, fx, target, sealMult) {
  const P = cb.player;
  switch (fx.id) {
    case 'leech': {
      const loss = hitEnemy(run, cb, target, fx.n, { mult: sealMult });
      if (loss > 0) healPlayer(run, Math.floor(loss / 2), cb);
      break;
    }
    case 'execute': {
      const bonus = target.statuses.vulnerable ? fx.bonus : 0;
      hitEnemy(run, cb, target, fx.n + bonus, { mult: sealMult });
      break;
    }
    case 'momentum': {
      hitEnemy(run, cb, target, fx.n + inst.bonus, { mult: sealMult });
      inst.bonus += fx.grow;
      break;
    }
    case 'phantom': hitEnemy(run, cb, target, fx.n * cb.hand.length, { mult: sealMult }); break;
    case 'devour': { // swallow the fire of whatever this kills
      hitEnemy(run, cb, target, fx.n, { mult: sealMult });
      if (target.hp <= 0) {
        if (!cb.over) { gainEmbers(run, cb, fx.embers); healPlayer(run, fx.heal, cb); }
        else healPlayer(run, fx.heal); // the kill ended the fight; the warmth still lands
      }
      break;
    }
    case 'doubleBlock': gainBlock(run, cb, P, P.block, false); break;
    case 'catalyst': if (target.statuses.poison) addStatus(cb, target, 'poison', target.statuses.poison * (fx.n - 1)); break;
    case 'shatterEcho': { // rings loudest against broken glass
      const echo = target.flags.staggered || target.statuses.vulnerable ? 2 : 1;
      hitEnemy(run, cb, target, fx.n * echo, { mult: sealMult });
      break;
    }
    case 'emberNova': hitEnemy(run, cb, target, fx.n * cb.embers, { mult: sealMult }); break;
    case 'pyreTithe': { // burn the rest of the hand; every pane feeds the lantern
      for (const c of [...cb.hand]) {
        if (c === inst) continue;
        const i = cb.hand.indexOf(c);
        cb.hand.splice(i, 1);
        cb.queue.push({ t: 'kindle', uid: c.uid, id: c.id });
        exhaustCard(run, cb, c);
      }
      drawCards(run, cb, fx.draw);
      break;
    }
    case 'flawless': {
      gainBlock(run, cb, P, fx.n);
      if (cb.counters.hpLost === 0) gainBlock(run, cb, P, fx.n);
      break;
    }
    case 'emberdance': { // spill the lantern into held light
      const spent = cb.embers;
      if (spent > 0) {
        run.stats.embersSpent += spent;
        gainEmbers(run, cb, -spent);
        gainBlock(run, cb, P, fx.n * spent, false);
      }
      break;
    }
  }
}

export function usePotion(run, cb, slot, targetIdx = null) {
  const id = run.player.potions[slot];
  if (!id) return false;
  const p = T(run).potions[id];
  if (p.combatOnly && (!cb || cb.over)) return false;
  if (p.needsTarget && (targetIdx == null || !cb.enemies[targetIdx] || cb.enemies[targetIdx].hp <= 0)) return false;
  run.player.potions[slot] = null;
  if (cb) cb.queue.push({ t: 'potion', id });
  switch (id) {
    case 'healing': healPlayer(run, 20, cb); if (!cb) run.player.hp = clamp(run.player.hp, 0, run.player.maxHp); break;
    case 'strength': addStatus(cb, cb.player, 'str', 2); break;
    case 'swift': drawCards(run, cb, 3); break;
    case 'block': gainBlock(run, cb, cb.player, 12, false); break;
    case 'fire': hitEnemy(run, cb, cb.enemies[targetIdx], 20, { isAttack: false }); break;
    case 'venom': addStatus(cb, cb.enemies[targetIdx], 'poison', 7); break;
    case 'energy': gainEmbers(run, cb, 3); break; // the Emberphial feeds the lantern
  }
  return true;
}

export function endTurn(run, cb) {
  if (cb.over) return;
  const P = cb.player;
  cb.queue.push({ t: 'endTurn' });
  // hand end-of-turn penalties
  for (const c of [...cb.hand]) {
    const d = cardData(c, run);
    if (d.endTurnDmg) damagePlayer(run, cb, d.endTurnDmg, { source: 'burn' });
    if (d.endTurnLoseHp) damagePlayer(run, cb, d.endTurnLoseHp, { source: 'burn' });
    if (cb.over) return;
  }
  if (P.statuses.metallicize) gainBlock(run, cb, P, P.statuses.metallicize, false);
  if (P.statuses.regen) healPlayer(run, P.statuses.regen, cb);
  // discard hand
  const uids = cb.hand.map((c) => c.uid);
  cb.discard.push(...cb.hand);
  cb.hand = [];
  cb.queue.push({ t: 'discardHand', uids });
  // player debuffs (and turn-scoped buffs) tick down at end of your turn
  for (const s of ['vulnerable', 'weak', 'frail', 'beacon']) {
    if (P.statuses[s]) { P.statuses[s]--; if (!P.statuses[s]) delete P.statuses[s]; }
  }
  // ---- enemy phase
  for (const e of cb.enemies) {
    if (e.hp <= 0 || cb.over) continue;
    if (e.statuses.poison) {
      const pd = e.statuses.poison;
      e.hp -= pd;
      run.stats.dmgDealt += pd;
      cb.queue.push({ t: 'hitEnemy', idx: e.idx, amount: pd, blocked: 0, hpAfter: Math.max(0, e.hp), dead: e.hp <= 0, poison: true });
      e.statuses.poison--;
      if (!e.statuses.poison) delete e.statuses.poison;
      if (e.hp <= 0) { run.stats.smolderKills++; onEnemyDeath(run, cb, e); continue; }
    }
    e.block = 0;
    if (e.flags.staggered) {
      // a shattered pane spends its turn reseaming: the move is skipped, but
      // its key still enters lastMoves so rotation scripts don't repeat-lock
      e.flags.staggered = false;
      e.lastMoves.push(e.moveKey);
      cb.queue.push({ t: 'staggered', idx: e.idx });
    } else {
      const mv = enemyMove(e);
      cb.queue.push({ t: 'enemyAct', idx: e.idx, move: e.moveKey, name: mv.name });
      e.lastMoves.push(e.moveKey);
      if (mv.dmg != null) {
        for (let t = 0; t < (mv.times || 1); t++) {
          if (cb.over) break;
          damagePlayer(run, cb, mv.dmg, { source: e.idx, isAttack: true, attacker: e });
        }
        if (mv.ramp) e.flags.rampBonus = (e.flags.rampBonus || 0) + mv.ramp;
      }
      if (cb.over) return;
      if (mv.block) gainBlock(run, cb, e, mv.block, false);
      if (mv.heal) { e.hp = Math.min(e.maxHp, e.hp + mv.heal); cb.queue.push({ t: 'heal', who: e.idx, n: mv.heal }); }
      if (mv.fx) {
        for (const s of mv.fx) {
          if (s.who === 'player') addStatus(cb, P, s.id, s.n);
          else if (s.who === 'self') addStatus(cb, e, s.id, s.n);
          else if (s.who === 'allies') for (const a of cb.enemies.filter((x) => x.hp > 0)) addStatus(cb, a, s.id, s.n);
        }
      }
      if (mv.addCards) {
        for (let i = 0; i < mv.addCards.n; i++) {
          cb.discard.push({ uid: run.uid++, id: mv.addCards.id, up: false, bonus: 0 });
          cb.queue.push({ t: 'addCard', id: mv.addCards.id, where: 'discard' });
        }
      }
    }
    // enemy end-of-action: ritual, debuff tick (a staggered turn still ticks)
    if (e.statuses.ritual) addStatus(cb, e, 'str', e.statuses.ritual);
    for (const s of ['vulnerable', 'weak']) {
      if (e.statuses[s]) { e.statuses[s]--; if (!e.statuses[s]) delete e.statuses[s]; }
    }
  }
  if (cb.over) return;
  computeIntents(run, cb);
  startPlayerTurn(run, cb);
}

function winCombat(run, cb) {
  cb.over = true;
  cb.result = 'win';
  if (cb.kind === 'boss' && isFinalTheme(run) && run.questScratch?.eighthOmen?.active) {
    const wasComplete = questRecord(run, 'eighthOmen')?.state === 'complete';
    const q = advanceQuest(run, 'eighthOmen', 1, run.endQueue);
    if (!wasComplete && q?.state === 'complete' &&
        !run.endQueue.some((event) => event.t === 'eighthResolved')) {
      run.endQueue.push({ t: 'eighthResolved', text: T(run).quests.eighthOmen.resolved });
    }
  }
  const pageQuest = questRecord(run, 'unreadablePage');
  if (cb.kind === 'boss' && isFinalTheme(run) &&
      run.player.deck.some((card) => card.id === 'unreadablePage') &&
      pageQuest && QUEST_ACTIVE_STATES.includes(pageQuest.state) &&
      pageQuest.progress < T(run).quests.unreadablePage.target &&
      !run.endQueue.some((event) => event.t === 'pageRead')) {
    const q = advanceQuest(run, 'unreadablePage', 1, run.endQueue);
    run.endQueue.push({
      t: 'pageRead',
      index: q.progress,
      text: T(run).quests.unreadablePage.pages[q.progress - 1],
    });
  }
  // write back
  run.player.hp = clamp(cb.player.hp, 1, run.player.maxHp);
  if (hasRelic(run, 'emberHeart')) { healPlayer(run, 6); proc(cb, 'emberHeart'); }
  if (hasRelic(run, 'crownOfTheHearth') && cb.embers > 0) { healPlayer(run, cb.embers * 3); proc(cb, 'crownOfTheHearth'); }
  if (hasRelic(run, 'gravebloom') && run.player.hp <= run.player.maxHp * 0.5) { healPlayer(run, 10); proc(cb, 'gravebloom'); }
  run.player.hp = clamp(run.player.hp, 1, run.player.maxHp);
  cb.queue.push({ t: 'victory', perfect: cb.counters.hpLost === 0 }); // an untouched fight is worth saying so
}
function loseCombat(run, cb) {
  cb.over = true;
  cb.result = 'loss';
  cb.player.hp = 0;
  run.player.hp = 0;
  cb.queue.push({ t: 'defeat' });
}

// UI display helpers -------------------------------------------------------
export function previewAttack(cb, base, targetIdx = null) {
  const P = cb.player;
  let dmg = base + (P.statuses.str || 0);
  if (P.statuses.weak) dmg = Math.floor(dmg * 0.75);
  const e = targetIdx != null ? cb.enemies[targetIdx] : null;
  if (e && e.statuses.vulnerable) dmg = Math.floor(dmg * 1.5);
  return Math.max(0, dmg);
}
export function previewBlock(run, cb, base) {
  const P = cb.player;
  let b = base + (P.statuses.dex || 0);
  if (P.statuses.frail) b = Math.floor(b * 0.75);
  return Math.round(Math.max(0, b) * (omenMods(run).wardMult || 1));
}
export function previewEnemyDmg(run, cb, e) {
  const mv = enemyMove(e);
  if (mv.dmg == null) return null;
  let dmg = mv.dmg + (e.statuses.str || 0) + (e.flags.rampBonus || 0) + (omenMods(run).enemyDmgBonus || 0) + (vowMods(run).enemyDmgBonus || 0);
  if (e.statuses.weak) dmg = Math.floor(dmg * 0.75);
  if (cb.player.statuses.vulnerable) dmg = Math.floor(dmg * 1.5);
  return { dmg: Math.max(0, dmg), times: mv.times || 1 };
}
// what would this card actually do to this target? pure arithmetic mirroring
// hitEnemy/gainBlock (str, weak, vulnerable, seal, specials) — no state touched
export function previewPlay(run, cb, inst, targetIdx = null) {
  const d = cardData(inst, run);
  const P = cb.player;
  const target = targetIdx != null ? cb.enemies[targetIdx] : null;
  const sealMult = hasRelic(run, 'executionersSeal') && d.type === 'attack' && (cb.counters.attacks + 1) % 10 === 0 ? 2 : 1;
  const hit = (base) => {
    let dmg = base + (P.statuses.str || 0);
    if (P.statuses.weak) dmg = Math.floor(dmg * 0.75);
    if (target && target.statuses.vulnerable) dmg = Math.floor(dmg * 1.5);
    return Math.max(0, Math.floor(dmg * sealMult));
  };
  const hits = [];
  let block = 0;
  for (const fx of d.effects) {
    if (fx.kind === 'dmg') hits.push({ dmg: hit(fx.n), times: fx.times || 1 });
    else if (fx.kind === 'block') block += previewBlock(run, cb, fx.n);
    else if (fx.kind === 'special') {
      if (fx.id === 'leech' || fx.id === 'devour') hits.push({ dmg: hit(fx.n), times: 1 });
      else if (fx.id === 'execute') hits.push({ dmg: hit(fx.n + (target?.statuses.vulnerable ? fx.bonus : 0)), times: 1 });
      else if (fx.id === 'momentum') hits.push({ dmg: hit(fx.n + (inst.bonus || 0)), times: 1 });
      else if (fx.id === 'phantom') hits.push({ dmg: hit(fx.n * Math.max(0, cb.hand.length - (cb.hand.includes(inst) ? 1 : 0))), times: 1 });
      else if (fx.id === 'shatterEcho') hits.push({ dmg: hit(fx.n * (target && (target.flags.staggered || target.statuses.vulnerable) ? 2 : 1)), times: 1 });
      else if (fx.id === 'emberNova') hits.push({ dmg: hit(fx.n * cb.embers), times: 1 });
      else if (fx.id === 'doubleBlock') block += P.block;
      else if (fx.id === 'flawless') block += previewBlock(run, cb, fx.n) * (cb.counters.hpLost === 0 ? 2 : 1);
      else if (fx.id === 'emberdance') block += fx.n * cb.embers;
    }
  }
  let fxChips = 0;
  for (const fx of d.effects) if (fx.kind === 'chip') fxChips += fx.n;
  if (!hits.length && !block && !fxChips) return null;
  const total = hits.reduce((s, h) => s + h.dmg * h.times, 0);
  let loss = total, lethal = false, chips = 0, willShatter = false;
  if (target) {
    let b = target.block;
    loss = 0;
    for (const h of hits) for (let i = 0; i < h.times; i++) {
      const soak = Math.min(b, h.dmg);
      b -= soak;
      loss += h.dmg - soak;
    }
    lethal = loss >= target.hp;
    // facet arithmetic mirrors playCard: an attack that draws unblocked blood
    // chips once (plus card/beacon bonuses); explicit chip effects always land
    const per = d.type === 'attack' ? 1 + (d.chip || 0) + (P.statuses.beacon || 0) : 0;
    chips = (hits.length && loss > 0 ? per : 0) + fxChips;
    willShatter = chips > 0 && target.chips + chips >= target.facetMax && !lethal;
  }
  return { hits, total, loss, lethal, block, chips, willShatter };
}

// deck ops -----------------------------------------------------------------
export function addCardToDeck(run, id, up = false) {
  const c = makeCard(run, id, up);
  run.player.deck.push(c);
  return c;
}
export const removableCards = (run) => run.player.deck.filter((c) => !cardData(c, run).unremovable);
export function removeCardFromDeck(run, uid) {
  const i = run.player.deck.findIndex((c) => c.uid === uid);
  if (i < 0 || cardData(run.player.deck[i], run).unremovable) return false;
  run.player.deck.splice(i, 1);
  return true;
}
export function upgradeCardInDeck(run, uid) {
  const c = run.player.deck.find((c) => c.uid === uid);
  if (c) c.up = true;
}
export function duplicateCardInDeck(run, uid) {
  const c = run.player.deck.find((c) => c.uid === uid);
  if (c) run.player.deck.push(makeCard(run, c.id, c.up));
}

// save / load ---------------------------------------------------------------
const SAVE_KEY = 'spirebound_save_v2';
const STATS_KEY = 'spirebound_stats_v1';
const DAWN_UNLOCKS = new Set(Object.values(DEEDS).flatMap((deed) => deed.unlocks));
const isPlainRecord = (value) => value && typeof value === 'object' && !Array.isArray(value);
const hasExactRecordKeys = (value, keys) => isPlainRecord(value) &&
  Object.keys(value).length === keys.length && keys.every((key) => Object.hasOwn(value, key));
const validAspectIndex = (value, content = CORE_ENGINE_CONTENT) => Number.isInteger(value) && value >= 0 && value < content.aspects.length;
const DAWN_EVENT_TYPES = new Set([
  'whisper', 'questReveal', 'questProgress', 'questUnlock', 'pageRead',
  'eighthResolved', 'shadeResolved', 'questComplete', 'shardGrant', 'act4Reveal',
]);
const END_EVENT_TYPES = new Set([
  'questReveal', 'questProgress', 'questUnlock', 'pageRead',
  'eighthResolved', 'shadeResolved', 'questComplete',
]);
const validRunEvent = (event, allowedTypes, content = CORE_ENGINE_CONTENT) => {
  if (!isPlainRecord(event) || typeof event.t !== 'string' || !allowedTypes.has(event.t)) return false;
  if (event.t === 'whisper') {
    return hasExactRecordKeys(event, ['t', 'text']) && typeof event.text === 'string';
  }
  if (['questReveal', 'questComplete', 'shardGrant'].includes(event.t)) {
    return hasExactRecordKeys(event, ['t', 'id']) && content.questIds.includes(event.id);
  }
  if (event.t === 'questProgress') {
    const validTargets = event.id === 'paleOnes'
      ? [content.progression.emberglass.paleOnes.lensAt, content.quests.paleOnes.target]
      : [content.quests[event.id]?.target];
    return hasExactRecordKeys(event, ['t', 'id', 'progress', 'target']) &&
      content.questIds.includes(event.id) && Number.isInteger(event.progress) && event.progress >= 0 &&
      validTargets.includes(event.target) && event.progress <= event.target;
  }
  if (event.t === 'questUnlock') {
    return hasExactRecordKeys(event, ['t', 'id']) && event.id === 'insight:witchlightLens';
  }
  if (event.t === 'pageRead') {
    return hasExactRecordKeys(event, ['t', 'index', 'text']) &&
      Number.isInteger(event.index) && event.index >= 1 &&
      event.index <= content.quests.unreadablePage.target && typeof event.text === 'string';
  }
  if (event.t === 'eighthResolved' || event.t === 'shadeResolved') {
    return hasExactRecordKeys(event, ['t', 'text']) && typeof event.text === 'string';
  }
  return event.t === 'act4Reveal' && hasExactRecordKeys(event, ['t']);
};
const validDawnEvent = (event, content = CORE_ENGINE_CONTENT) => validRunEvent(event, DAWN_EVENT_TYPES, content);
const validPendingDawn = (pending, content = CORE_ENGINE_CONTENT) => pending == null || (
  hasExactRecordKeys(pending, ['events', 'cursor', 'newUnlocks']) &&
  Array.isArray(pending.events) && pending.events.every((event) => validDawnEvent(event, content)) &&
  Number.isInteger(pending.cursor) && pending.cursor >= 0 && pending.cursor <= pending.events.length &&
  Array.isArray(pending.newUnlocks) &&
  pending.newUnlocks.every((id) => typeof id === 'string' && DAWN_UNLOCKS.has(id)) &&
  new Set(pending.newUnlocks).size === pending.newUnlocks.length
);
export function saveRun(run) {
  if (isEphemeralRun(run)) return true;
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(run));
    return true;
  } catch {
    return false;
  }
}
function normaliseRunSnapshot(run, content) {
  try {
    if (!run || run.v !== 2 || !run.player || !run.map) return null;
    // Bind for validation/additive fills so omen rolls read the explicit view.
    RUN_CONTENT.set(run, content);
    const hasOwn = (registry, id) => Object.hasOwn(registry, id);
    // stale-content shield: a save referencing ids this build no longer ships
    // (dev churn, old versions) is unresumable — drop it rather than crash mid-run
    if (!run.player.deck.every((c) => hasOwn(content.cards, c.id))) return null;
    if (!run.player.relics.every((id) => hasOwn(content.relics, id))) return null;
    if (!run.player.potions.every((id) => id == null || hasOwn(content.potions, id))) return null;
    if (run.art != null && !hasOwn(content.arts, run.art)) return null;
    if (!(run.omens || []).every((id) => id == null || hasOwn(content.omens, id))) return null;
    // additive fields self-heal: a save from an older v2 build stays playable
    run.art ??= 'flare';
    run.aspect = clamp(run.aspect ?? 0, 0, content.aspects.length - 1); run.vow = clamp(run.vow ?? 0, 0, content.vows.length);
    run.runId ??= legacyRunId(run);
    run.unlocks ??= []; run.omens ??= []; run.boon ??= null; run.bossRelicAct ??= -1; run.orphanRewardClaimed ??= false; run.orphanRewardResolving ??= false;
    run.reveals ??= null;
    run.quests ??= {};
    run.shards ??= [];
    run.questScratch ??= {};
    run.questCompletions ??= [];
    run.endQueue ??= [];
    run.pendingEnemyIds ??= null;
    run.pendingQuestId ??= null;
    run.pendingReward ??= null;
    run.pendingRunEnd ??= null;
    run.pendingDawn ??= null;
    run.pendingHollow ??= null;
    run.pendingHollowRoute ??= null;
    run.boonReceipt ??= null;
    if (run.reveals != null && !(Array.isArray(run.reveals) && run.reveals.every((id) => content.reveals.some((r) => r.id === id)))) return null;
    const onlyKeys = (x, keys) => Object.keys(x).every((k) => keys.includes(k));
    const optionalBool = (x, k) => x[k] == null || typeof x[k] === 'boolean';
    const validBequest = (b) => b == null || (isPlainRecord(b) && (
      (b.kind === 'card' && hasOwn(content.cards, b.id) && optionalBool(b, 'up')) ||
      (b.kind === 'relic' && hasOwn(content.relics, b.id)) ||
      (b.kind === 'gold' && Number.isFinite(b.amount) && b.amount >= 0)
    ));
    const themeBound = (content.themeOrder?.length ?? content.acts.length) - 1;
    const validMonument = (monument) => monument == null || (
      Number.isInteger(monument.act) && monument.act >= 0 && monument.act <= themeBound &&
      Number.isInteger(monument.row) && monument.row >= 0 &&
      validBequest(monument.bequest) && typeof monument.claimed === 'boolean' && (
        hasExactRecordKeys(monument, ['act', 'row', 'bequest', 'claimed']) ||
        (hasExactRecordKeys(monument, ['act', 'row', 'bequest', 'standing', 'claimed']) && monument.standing === false) ||
        (hasExactRecordKeys(monument, ['act', 'row', 'bequest', 'standing', 'shadeAspect', 'claimed']) &&
          monument.standing === true && validAspectIndex(monument.shadeAspect, content))
      )
    );
    const validMemory = (id, q) => {
      const m = q.memory;
      if (!isPlainRecord(m)) return false;
      if (id === 'eighthOmen') {
        if (q.state === 'dormant') return onlyKeys(m, []);
        if (q.state === 'complete') return onlyKeys(m, ['seen']) && (m.seen == null || m.seen === true);
        const dueMax = Math.max(
          1,
          Math.floor(content.progression.emberglass.eighthOmen.guaranteeRuns),
          Math.floor(content.progression.emberglass.eighthOmen.saveDueInMax),
        );
        const dueValid = Number.isInteger(m.dueIn) && m.dueIn >= 1 && m.dueIn <= dueMax;
        return onlyKeys(m, ['dueIn', 'seen']) && optionalBool(m, 'seen') &&
          (m.seen === true ? m.dueIn == null : dueValid);
      }
      if (id === 'hollowLamplighter') {
        if (q.state === 'dormant') return onlyKeys(m, []);
        if (q.state === 'complete') return onlyKeys(m, ['eligibleMisses']) &&
          (m.eligibleMisses == null || (Number.isInteger(m.eligibleMisses) && m.eligibleMisses >= 0));
        const debtMax = Math.max(
          1,
          Math.floor(content.progression.emberglass.hollowLamplighter.emberDebt),
          Math.floor(content.progression.emberglass.hollowLamplighter.saveEmberDebtMax),
        );
        return onlyKeys(m, ['eligibleMisses', 'emberDebt']) &&
          (m.eligibleMisses == null || (Number.isInteger(m.eligibleMisses) && m.eligibleMisses >= 0)) &&
          (m.emberDebt == null || (q.state === 'revealed' && q.progress === 0 &&
            Number.isInteger(m.emberDebt) && m.emberDebt >= 1 && m.emberDebt <= debtMax));
      }
      return onlyKeys(m, []);
    };
    const validQuest = (id, q) => {
      if (!isPlainRecord(q) || !QUEST_STATES.includes(q.state) ||
        !Number.isInteger(q.progress) || q.progress < 0 || q.progress > content.quests[id].target) return false;
      const coherentProgress = q.state === 'dormant'
        ? q.progress === 0
        : q.state === 'complete'
          ? q.progress === content.quests[id].target
          : q.progress < content.quests[id].target;
      return coherentProgress && validMemory(id, q);
    };
    const validEnemyId = (id) => hasOwn(content.enemies, id) || hasOwn(content.variants, id);
    const validPendingReward = (pending) => {
      if (pending == null) return true;
      if (!hasExactRecordKeys(pending, ['kind', 'rewards', 'taken', 'perfect']) ||
        !['monster', 'elite', 'boss'].includes(pending.kind) || typeof pending.perfect !== 'boolean') return false;
      const rewards = pending.rewards;
      if (!hasExactRecordKeys(rewards, ['gold', 'cards', 'potion', 'relic']) ||
        !Number.isInteger(rewards.gold) || rewards.gold < 0 ||
        !Array.isArray(rewards.cards) || !rewards.cards.length ||
        rewards.cards.some((id) => !hasOwn(content.cards, id)) || new Set(rewards.cards).size !== rewards.cards.length ||
        (rewards.potion != null && !hasOwn(content.potions, rewards.potion)) ||
        (rewards.relic != null && !hasOwn(content.relics, rewards.relic))) return false;
      return hasExactRecordKeys(pending.taken, ['gold', 'potion', 'relic', 'card']) &&
        Object.values(pending.taken).every((value) => typeof value === 'boolean');
    };
    const validPendingRunEnd = (pending) =>
      pending == null || (hasExactRecordKeys(pending, ['outcome']) && TERMINAL_OUTCOMES.includes(pending.outcome));
    const validPendingHollow = (pending) => {
      if (pending == null) return true;
      if (!hasExactRecordKeys(pending, ['nodeId', 'type', 'paid', 'deferred', 'answer']) ||
        typeof pending.paid !== 'boolean' || typeof pending.deferred !== 'boolean') return false;
      const node = run.map.nodes.find((n) => n.id === pending.nodeId);
      if (!node || pending.type !== node.type || run.nodeId !== node.id || !run.map.visited.includes(node.id)) return false;
      if (!pending.paid) return pending.deferred === false && pending.answer === null;
      return typeof pending.answer === 'string';
    };
    const validPendingHollowRoute = (pending) => {
      if (pending == null) return true;
      if (!hasExactRecordKeys(pending, ['nodeId', 'type', 'eventId']) ||
        !HOLLOW_DESTINATION_TYPES.includes(pending.type)) return false;
      const node = run.map.nodes.find((candidate) => candidate.id === pending.nodeId);
      if (!node || node.type !== pending.type || run.nodeId !== node.id || !run.map.visited.includes(node.id)) return false;
      if (pending.type === 'event') return hasOwn(content.events, pending.eventId);
      return pending.eventId === null;
    };
    const validBoonReceipt = (receipt) => {
      if (receipt == null) return true;
      if (!hasExactRecordKeys(receipt, ['id', 'playerDelta', 'statsGoldEarned', 'relicsAdded', 'potionSlotsAdded']) ||
        !hasOwn(content.boons, receipt.id) || receipt.id !== run.boon) return false;
      const delta = receipt.playerDelta;
      if (!hasExactRecordKeys(delta, ['gold', 'hp', 'maxHp', 'energyMax']) ||
        Object.values(delta).some((n) => !Number.isFinite(n)) ||
        !Number.isFinite(receipt.statsGoldEarned) || receipt.statsGoldEarned < 0 ||
        !Array.isArray(receipt.relicsAdded) || receipt.relicsAdded.some((id) => !hasOwn(content.relics, id)) ||
        !Array.isArray(receipt.potionSlotsAdded)) return false;
      return receipt.potionSlotsAdded.every((slot) =>
        hasExactRecordKeys(slot, ['index', 'id']) && Number.isInteger(slot.index) &&
        slot.index >= 0 && slot.index < run.player.potions.length && hasOwn(content.potions, slot.id));
    };

    const validScratch = (scratch) => {
      if (!isPlainRecord(scratch) || Object.keys(scratch).some((id) => !content.questIds.includes(id))) return false;
      for (const [id, x] of Object.entries(scratch)) {
        if (!isPlainRecord(x)) return false;
        if (id === 'paleOnes' && !(onlyKeys(x, ['hiddenDue', 'hiddenRemaining', 'markedAct2']) &&
          optionalBool(x, 'hiddenDue') && optionalBool(x, 'markedAct2') &&
          (x.hiddenRemaining == null || (Number.isInteger(x.hiddenRemaining) && x.hiddenRemaining >= 0 &&
            typeof x.hiddenDue === 'boolean' && x.hiddenDue === (x.hiddenRemaining > 0))))) return false;
        if (id === 'usurper' && !(onlyKeys(x, ['bought']) && optionalBool(x, 'bought'))) return false;
        if (id === 'eighthOmen' && !(onlyKeys(x, ['active']) && optionalBool(x, 'active'))) return false;
        if (id === 'unreadablePage' && !(onlyKeys(x, ['rewardOrdinal', 'offered']) &&
          (x.rewardOrdinal == null || (Number.isInteger(x.rewardOrdinal) && x.rewardOrdinal >= 0)) && optionalBool(x, 'offered'))) return false;
        if (id === 'hollowLamplighter' && !(onlyKeys(x, ['due', 'met', 'meetings', 'debtActive']) &&
          optionalBool(x, 'due') && optionalBool(x, 'met') && optionalBool(x, 'debtActive') &&
          !(x.met === true && x.due !== true) &&
          !(x.debtActive === true && (x.due === true || x.met === true || (x.meetings || 0) > 0)) &&
          (x.meetings == null || (Number.isInteger(x.meetings) && x.meetings >= 0 &&
            typeof x.met === 'boolean' && x.met === (x.meetings > 0) &&
            (x.meetings === 0 || x.due === true))))) return false;
        if (id === 'ownShade') {
          const fall = x.fall;
          const validFall = fall == null || (isPlainRecord(fall) && onlyKeys(fall, ['act', 'row', 'shadeAspect', 'bequest']) &&
            Number.isInteger(fall.act) && fall.act >= 0 && fall.act <= themeBound && Number.isInteger(fall.row) && fall.row >= 0 &&
            validAspectIndex(fall.shadeAspect, content) && validBequest(fall.bequest));
          if (!(onlyKeys(x, ['fall', 'pendingBequest']) && validFall && validBequest(x.pendingBequest))) return false;
        }
      }
      return true;
    };

    const validEndEvent = (event) => validRunEvent(event, END_EVENT_TYPES, content);

    if (!isPlainRecord(run.quests)) return null;
    if (!validRunId(run.runId)) return null;
    if (run.boon != null && !hasOwn(content.boons, run.boon)) return null;
    if (!validMonument(run.monument)) return null;
    if (Object.keys(run.quests).some((id) => !content.questIds.includes(id))) return null;
    if (Object.entries(run.quests).some(([id, q]) => !validQuest(id, q))) return null;
    if (!(Array.isArray(run.shards) && run.shards.every((id) => content.questIds.includes(id)) && new Set(run.shards).size === run.shards.length)) return null;
    if (!validScratch(run.questScratch)) return null;
    if (!(Array.isArray(run.questCompletions) && run.questCompletions.every((id) => content.questIds.includes(id)) && new Set(run.questCompletions).size === run.questCompletions.length)) return null;
    if (!(Array.isArray(run.endQueue) && run.endQueue.every(validEndEvent))) return null;
    if (run.pendingCombat != null && !['monster', 'elite', 'boss'].includes(run.pendingCombat)) return null;
    if (run.pendingEnemyIds != null && !(Array.isArray(run.pendingEnemyIds) && run.pendingEnemyIds.length && run.pendingEnemyIds.every(validEnemyId))) return null;
    if (run.pendingQuestId != null && !content.questIds.includes(run.pendingQuestId)) return null;
    if (run.pendingEnemyIds != null && run.pendingCombat == null) return null;
    if (run.pendingQuestId != null && run.pendingCombat == null) return null;
    if (!validPendingReward(run.pendingReward)) return null;
    if (!validPendingRunEnd(run.pendingRunEnd)) return null;
    if (!validPendingDawn(run.pendingDawn, content)) return null;
    if (!validPendingHollow(run.pendingHollow)) return null;
    if (!validPendingHollowRoute(run.pendingHollowRoute)) return null;
    if (!validBoonReceipt(run.boonReceipt)) return null;
    if (run.pendingHollow != null &&
      (run.pendingHollowRoute != null || run.pendingCombat != null || run.pendingReward != null ||
        run.pendingRunEnd != null || run.pendingDawn != null)) return null;
    if (run.pendingHollowRoute != null &&
      (run.pendingHollow != null || run.pendingCombat != null || run.pendingReward != null ||
        run.pendingRunEnd != null || run.pendingDawn != null)) return null;
    if (run.pendingReward != null && run.pendingCombat != null) return null;
    if (run.pendingRunEnd != null && (run.pendingCombat != null || run.pendingReward != null || run.pendingDawn != null)) return null;
    if (run.pendingDawn != null &&
      (run.pendingCombat != null || run.pendingReward != null || run.pendingRunEnd != null ||
        run.pendingHollow != null || run.pendingHollowRoute != null)) return null;
    if (!run.map.nodes.every((n) =>
      (n.questVariantId == null || hasOwn(content.variants, n.questVariantId)) &&
      (n.questMarked == null || typeof n.questMarked === 'boolean'))) return null;
    // The immediately preceding Phase 2 build could persist the final
    // Hollow completion before run-end reconciliation removed its pity
    // counter. Accept that exact legacy residue and return the canonical
    // completed shape so an in-flight dawn remains resumable.
    if (run.quests.hollowLamplighter?.state === 'complete') {
      run.quests.hollowLamplighter.memory = {};
    }
    while (run.omens.length <= run.act) run.omens.push(omenEnabled(run) ? rollOmen(run) : null);
    for (const k of ['shatters', 'kindles', 'perfects', 'smolderKills', 'unlitVisited', 'embersSpent']) run.stats[k] ??= 0;
    return run;
  } catch { return null; }
}
export function _normaliseRunSnapshotForTest(raw, content) {
  assertEngineContent(content);
  if (raw == null || typeof raw !== 'object') return null;
  const normalised = normaliseRunSnapshot(deepCopyJson(raw), content);
  if (normalised) RUN_CONTENT.set(normalised, content);
  return normalised;
}
export function loadRun() {
  try {
    const s = localStorage.getItem(SAVE_KEY);
    if (!s) return null;
    // Production load stays core-only and binds no custom context.
    const run = normaliseRunSnapshot(JSON.parse(s), CORE_ENGINE_CONTENT);
    if (run) RUN_CONTENT.delete(run);
    return run;
  } catch { return null; }
}
export function clearSave(runId = null) {
  // Ephemeral Lab runs never touch storage; predecessor success shape is true.
  try {
    if (runId != null) {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return true;
      let current = null;
      try { current = JSON.parse(raw); } catch { /* an unreadable save is not this run */ }
      if (current?.runId !== runId) return true;
    }
    localStorage.removeItem('spirebound_save_v1'); // pre-vigil saves are unresumable
    localStorage.removeItem(SAVE_KEY); // current run last: a failed cleanup remains resumable
    return true;
  } catch {
    return false;
  }
}
export function loadStats() {
  try {
    const raw = JSON.parse(localStorage.getItem(STATS_KEY)) || {};
    return { runs: 0, wins: 0, best: 0, lastRunId: null, ...raw };
  } catch { return { runs: 0, wins: 0, best: 0, lastRunId: null }; }
}
export function commitRunStats(run, won) {
  if (isEphemeralRun(run)) return true;
  const s = loadStats();
  if (s.lastRunId !== run.runId) {
    s.runs++;
    if (won) s.wins++;
    s.best = Math.max(s.best, run.act * MAP_ROWS + run.floorsClimbed);
    s.lastRunId = run.runId;
    try { localStorage.setItem(STATS_KEY, JSON.stringify(s)); }
    catch { return false; }
  }
  return true;
}
export function recordRunEnd(run, won) {
  if (isEphemeralRun(run)) return true;
  if (!commitRunStats(run, won)) return false;
  return clearSave(run.runId);
}

export function stagePendingDawn(run, events, newUnlocks = []) {
  if (run?.pendingRunEnd?.outcome !== 'win' || run.pendingDawn != null ||
      run.pendingCombat != null || run.pendingReward != null ||
      run.pendingHollow != null || run.pendingHollowRoute != null) return false;
  const snapshot = pendingDawnSnapshot(run, events, newUnlocks);
  if (!snapshot || !validPendingDawn(snapshot.pendingDawn, engineContentFor(run)) ||
      !commitRunStats(run, true) || !saveRun(snapshot)) return false;
  applyPendingDawnSnapshot(run, snapshot);
  return true;
}

export function advancePendingDawn(run, nextCursor) {
  const snapshot = advancedDawnSnapshot(run, nextCursor);
  if (!snapshot || !validPendingDawn(snapshot.pendingDawn, engineContentFor(run)) ||
      !saveRun(snapshot)) return false;
  run.pendingDawn.cursor = nextCursor;
  return true;
}

export function completePendingDawn(run) {
  const pending = run?.pendingDawn;
  if (!validPendingDawn(pending, engineContentFor(run)) || pending == null || pending.cursor !== pending.events.length) return false;
  if (!clearSave(run.runId)) return false;
  run.pendingDawn = null;
  return true;
}

// event op executor (interactive picks handled by UI; returns list of pending picks)
export function applyEventOps(run, ops, rng = runRng(run)) {
  const pending = [];
  const log = [];
  for (const op of ops) {
    if (op.gold) { run.player.gold = Math.max(0, run.player.gold + op.gold); if (op.gold > 0) run.stats.goldEarned += op.gold; }
    if (op.hp) run.player.hp = clamp(run.player.hp + op.hp, 1, run.player.maxHp);
    if (op.maxHp) { run.player.maxHp = Math.max(1, run.player.maxHp + op.maxHp); run.player.hp = clamp(run.player.hp + Math.max(0, op.maxHp), 1, run.player.maxHp); }
    if (op.heal) healPlayer(run, Math.round(run.player.maxHp * op.heal));
    if (op.addCard) addCardToDeck(run, op.addCard);
    if (op.addRelic) {
      const id = op.addRelic === 'random' ? randomRelic(run) : op.addRelic;
      if (id) { gainRelic(run, id); log.push({ relic: id }); }
      else { run.player.gold += 50; log.push({ text: 'You find 50 gold instead.' }); }
    }
    if (op.potion) gainPotion(run, op.potion);
    if (op.pickRemove) pending.push('remove');
    if (op.pickUpgrade) pending.push('upgrade');
    if (op.pickDuplicate) pending.push('duplicate');
    if (op.pickCard) pending.push({ pickCard: op.pickCard });
    if (op.roll) {
      let r = rng(), acc = 0;
      for (const branch of op.roll) {
        acc += branch.p;
        if (r < acc) {
          if (branch.text) log.push({ text: branch.text });
          const sub = applyEventOps(run, branch.ops, rng);
          pending.push(...sub.pending);
          log.push(...sub.log);
          break;
        }
      }
    }
  }
  return { pending, log };
}

const multisetAdded = (after, before) => {
  const left = new Map();
  for (const id of before) left.set(id, (left.get(id) || 0) + 1);
  return after.filter((id) => {
    const n = left.get(id) || 0;
    if (n) { left.set(id, n - 1); return false; }
    return true;
  });
};

export function applyBoon(run, id) {
  if (!Object.hasOwn(T(run).boons, id)) throw new Error('unknown boon: ' + id);
  const before = {
    gold: run.player.gold, hp: run.player.hp, maxHp: run.player.maxHp,
    energyMax: run.player.energyMax, goldEarned: run.stats.goldEarned,
    relics: [...run.player.relics], potions: [...run.player.potions],
  };
  applyEventOps(run, T(run).boons[id].ops);
  run.boon = id;
  run.boonReceipt = {
    id,
    playerDelta: {
      gold: run.player.gold - before.gold,
      hp: run.player.hp - before.hp,
      maxHp: run.player.maxHp - before.maxHp,
      energyMax: run.player.energyMax - before.energyMax,
    },
    statsGoldEarned: run.stats.goldEarned - before.goldEarned,
    relicsAdded: multisetAdded(run.player.relics, before.relics),
    potionSlotsAdded: run.player.potions.flatMap((potionId, index) =>
      potionId && before.potions[index] !== potionId ? [{ index, id: potionId }] : []),
  };
  return run.boonReceipt;
}

export function reverseBoon(run) {
  const receipt = run.boonReceipt;
  if (!receipt || run.boon !== receipt.id) return false;
  const d = receipt.playerDelta;
  if (d.gold > 0 && run.player.gold < d.gold) return false;
  const needed = new Map();
  for (const id of receipt.relicsAdded) needed.set(id, (needed.get(id) || 0) + 1);
  for (const [id, n] of needed) {
    if (run.player.relics.filter((x) => x === id).length < n) return false;
  }
  if (receipt.potionSlotsAdded.some(({ index, id }) => run.player.potions[index] !== id)) return false;

  for (const id of receipt.relicsAdded) {
    const index = run.player.relics.lastIndexOf(id);
    run.player.relics.splice(index, 1);
  }
  for (const { index } of receipt.potionSlotsAdded) run.player.potions[index] = null;
  run.player.gold -= d.gold;
  run.player.energyMax = Math.max(1, run.player.energyMax - d.energyMax);
  run.player.maxHp = Math.max(1, run.player.maxHp - d.maxHp);
  run.player.hp = clamp(run.player.hp - d.hp, 1, run.player.maxHp);
  run.stats.goldEarned = Math.max(0, run.stats.goldEarned - receipt.statsGoldEarned);
  run.boon = null;
  run.boonReceipt = null;
  return true;
}

export function payHollowPrice(run) {
  const pending = run.pendingHollow;
  if (!pending) return { ok: false, deferred: false, message: '' };
  if (pending.paid) {
    return { ok: true, deferred: pending.deferred, message: pending.answer };
  }
  const q = questRecord(run, 'hollowLamplighter');
  if (!q || !QUEST_ACTIVE_STATES.includes(q.state)) {
    return { ok: false, deferred: false, message: '' };
  }
  const meeting = T(run).quests.hollowLamplighter.meetings[q.progress];
  const fail = () => ({ ok: false, deferred: false, message: meeting.cannot });
  const accept = (deferred, message) => {
    pending.paid = true;
    pending.deferred = deferred;
    pending.answer = message;
    return { ok: true, deferred, message };
  };
  if (q.progress === 0) {
    q.memory.emberDebt = T(run).progression.emberglass.hollowLamplighter.emberDebt;
    return accept(true, meeting.accepted);
  }
  if (q.progress === 1) {
    const price = T(run).progression.emberglass.hollowLamplighter.gold;
    if (run.player.gold < price) return fail();
    run.player.gold -= price;
  } else if (q.progress === 2) {
    const price = T(run).progression.emberglass.hollowLamplighter.maxHp;
    if (run.player.maxHp - price < T(run).progression.emberglass.hollowLamplighter.minMaxHpAfter) return fail();
    run.player.maxHp -= price;
    run.player.hp = Math.min(run.player.hp, run.player.maxHp);
  } else if (q.progress === 3) {
    if (!reverseBoon(run)) return fail();
  } else if (q.progress === 4) {
    run.player.hp = T(run).progression.emberglass.hollowLamplighter.finalHp;
  } else return fail();
  advanceQuest(run, 'hollowLamplighter', 1, run.endQueue);
  return accept(false, meeting.paid);
}
