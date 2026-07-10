// THE VIGIL — what persists between climbs: deeds, unlocks, vows, and the
// monument of the last fall. Storage is Node-safe: without localStorage
// (tests) it keeps the ledger in memory so callers can still assert on it.
import { DEEDS, CARDS, RELICS, REVEALS, QUEST_IDS, QUESTS, WHISPERS, PROGRESSION } from './data.js';

const KEY = 'spirebound_vigil_v2';
const KEY_V1 = 'spirebound_vigil_v1'; // read-only: migration source, never written
const STATS_KEY = 'spirebound_stats_v1'; // pre-vigil ledger; seeds runs/wins once

let store = null;
let memory = new Map();
function getStore() {
  if (store) return store;
  try {
    if (typeof localStorage !== 'undefined') return (store = localStorage);
  } catch { /* private mode */ }
  return (store = {
    getItem: (k) => (memory.has(k) ? memory.get(k) : null),
    setItem: (k, v) => memory.set(k, v),
    removeItem: (k) => memory.delete(k),
  });
}
// test hook: pass null to start over on a fresh in-memory store
export function _setStore(s) { store = s; memory = new Map(); }

const QUEST_STATES = ['dormant', 'armed', 'revealed', 'complete'];
const RUN_ID_RE = /^(?:run|legacy)-[a-z0-9]+(?:-[a-z0-9]+){1,3}$/;
let armRng = Math.random;
export function _setRng(fn) { armRng = typeof fn === 'function' ? fn : Math.random; }

const blankQuest = () => ({ state: 'dormant', progress: 0, memory: {} });
const cloneQuest = (q) => ({
  state: QUEST_STATES.includes(q?.state) ? q.state : 'dormant',
  progress: Math.max(0, Math.floor(Number(q?.progress) || 0)),
  memory: q?.memory && typeof q.memory === 'object' && !Array.isArray(q.memory) ? { ...q.memory } : {},
});
const plainObject = (x) => x && typeof x === 'object' && !Array.isArray(x);
const exactKeys = (x, keys) => plainObject(x) && Object.keys(x).length === keys.length && keys.every((k) => Object.hasOwn(x, k));
const validRunId = (id) => typeof id === 'string' && RUN_ID_RE.test(id);
const validQuestIds = (ids) => Array.isArray(ids) && ids.every((id) => QUEST_IDS.includes(id));
const cleanDeedReceipt = (receipt) => exactKeys(receipt, ['runId', 'won', 'newUnlocks']) &&
  validRunId(receipt.runId) && typeof receipt.won === 'boolean' &&
  Array.isArray(receipt.newUnlocks) && receipt.newUnlocks.every((id) => typeof id === 'string')
  ? { runId: receipt.runId, won: receipt.won, newUnlocks: [...receipt.newUnlocks] }
  : null;
const cleanRunEndReceipt = (receipt) => exactKeys(receipt, ['runId', 'outcome', 'whisper', 'armed', 'completed', 'newShards']) &&
  validRunId(receipt.runId) && ['win', 'death', 'abandon'].includes(receipt.outcome) &&
  (receipt.whisper == null || typeof receipt.whisper === 'string') &&
  validQuestIds(receipt.armed) && validQuestIds(receipt.completed) && validQuestIds(receipt.newShards)
  ? {
      runId: receipt.runId, outcome: receipt.outcome, whisper: receipt.whisper ?? null,
      armed: [...receipt.armed], completed: [...receipt.completed], newShards: [...receipt.newShards],
    }
  : null;

function hydrateReceipts(v) {
  const source = plainObject(v.receipts) ? v.receipts : {};
  const receipts = {
    deeds: cleanDeedReceipt(source.deeds),
    runEnd: cleanRunEndReceipt(source.runEnd),
  };
  const changed = !exactKeys(source, ['deeds', 'runEnd']) || JSON.stringify(source) !== JSON.stringify(receipts);
  v.receipts = receipts;
  return changed;
}

function hydrateV2(v) {
  let changed = false;
  const quests = {};
  for (const id of QUEST_IDS) {
    quests[id] = cloneQuest(v.quests?.[id] || blankQuest());
    const normalisedProgress = quests[id].progress;
    quests[id].progress = Math.min(QUESTS[id].target, quests[id].progress);
    if (quests[id].progress !== normalisedProgress) changed = true;
    if (!v.quests?.[id]) changed = true;
  }
  v.quests = quests;
  if ((v.deeds?.wins || 0) >= 1 && v.quests.paleOnes.state === 'dormant') {
    v.quests.paleOnes.state = 'armed';
    v.news = true;
    changed = true;
  }
  v.shards = [...new Set((Array.isArray(v.shards) ? v.shards : []).filter((id) => QUEST_IDS.includes(id)))];
  v.whispers = Math.max(0, Math.floor(Number(v.whispers) || 0));
  if (hydrateReceipts(v)) changed = true;
  return changed;
}

export function questSnapshot(vigil) {
  return Object.fromEntries(QUEST_IDS.map((id) => [id, cloneQuest(vigil.quests[id])]));
}

export function whisperAt(count) {
  if (count <= 0) return null;
  return WHISPERS[Math.min(count, WHISPERS.length) - 1];
}

const DEFAULT_DEEDS = {
  runs: 0, wins: 0, slain: 0, shatters: 0, kindles: 0, perfects: 0,
  smolderKills: 0, unlitVisited: 0, embersSpent: 0, bestVow: 0, bestFloor: 0,
};

export function loadVigil() {
  let raw = null;
  try { raw = getStore().getItem(KEY); } catch { /* private mode */ }
  let v = null;
  try { v = JSON.parse(raw); } catch { /* corrupted */ }
  if (!v) v = migrateToV2();
  const out = {
    v: 2, deeds: {}, unlocks: [], vowUnlocked: 0, lastFall: null,
    runsPlayed: 0, quests: {}, shards: [], whispers: 0, news: false,
    receipts: { deeds: null, runEnd: null },
    ...(v || {}),
  };
  out.v = 2;
  out.deeds = { ...DEFAULT_DEEDS, ...(out.deeds || {}) };
  if (!Array.isArray(out.unlocks)) out.unlocks = [];
  if (!Array.isArray(out.shards)) out.shards = [];
  if (!out.quests || typeof out.quests !== 'object') out.quests = {};
  if (hydrateV2(out)) {
    try { getStore().setItem(KEY, JSON.stringify(out)); } catch { /* full */ }
  }
  return out;
}

// one-way, idempotent: v1 (or the pre-vigil stats ledger) seeds v2 exactly
// once; the v1 key is left in place as a backup and never written again.
function migrateToV2() {
  let v1 = null, stats = null;
  try { v1 = JSON.parse(getStore().getItem(KEY_V1)); } catch { /* none */ }
  try { stats = JSON.parse(getStore().getItem(STATS_KEY)); } catch { /* none */ }
  const out = {
    v: 2, deeds: { ...DEFAULT_DEEDS }, unlocks: [], vowUnlocked: 0, lastFall: null,
    runsPlayed: 0, quests: {}, shards: [], whispers: 0, news: false,
    receipts: { deeds: null, runEnd: null },
  };
  if (v1) {
    out.deeds = { ...DEFAULT_DEEDS, ...(v1.deeds || {}) };
    out.unlocks = Array.isArray(v1.unlocks) ? [...v1.unlocks] : [];
    out.vowUnlocked = v1.vowUnlocked || 0;
    out.lastFall = v1.lastFall || null;
    out.news = true; // a veteran's first look at the new Vigil
  } else if (stats) {
    out.deeds.runs = stats.runs || 0;
    out.deeds.wins = stats.wins || 0;
    if (out.deeds.wins > 0) out.vowUnlocked = 1;
  }
  out.runsPlayed = Math.max(out.deeds.runs || 0, stats?.runs || 0);
  saveVigil(out);
  return out;
}
export function saveVigil(v) {
  try {
    getStore().setItem(KEY, JSON.stringify(v));
    return true;
  } catch {
    return false;
  }
}

/** Debug / settings: wipe Vigil meta + legacy stats. Does not touch audio prefs. */
export function clearVigil() {
  try {
    const s = getStore();
    s.removeItem(KEY);
    s.removeItem(KEY_V1);
    s.removeItem(STATS_KEY);
  } catch { /* noop */ }
}

// deed thresholds crossed → content ids owed but not yet granted
export function evaluateDeeds(vigil) {
  const owed = [];
  for (const d of Object.values(DEEDS)) {
    if ((vigil.deeds[d.stat] || 0) >= d.n) {
      for (const u of d.unlocks) if (!vigil.unlocks.includes(u) && !owed.includes(u)) owed.push(u);
    }
  }
  return owed;
}

// reconcile owed unlocks (e.g. deeds seeded from the old ledger) and persist
export function syncVigil() {
  const v = loadVigil();
  const owed = evaluateDeeds(v);
  if (owed.length) { v.unlocks.push(...owed); v.news = true; saveVigil(v); }
  return v;
}

// ---------------------------------------------------------------- reveals
// The structural ladder (REVEALS in data.js) evaluated against the ledger.
export function isRevealed(vigil, id) {
  const r = REVEALS.find((x) => x.id === id);
  if (!r) return false;
  const t = r.trigger;
  if (t.runsPlayed != null && (vigil.runsPlayed || 0) < t.runsPlayed) return false;
  if (t.wins != null && (vigil.deeds.wins || 0) < t.wins) return false;
  if (t.shards != null && (vigil.shards || []).length < t.shards) return false;
  return true;
}
export function revealSnapshot(vigil) {
  return REVEALS.filter((r) => isRevealed(vigil, r.id)).map((r) => r.id);
}

const STATE_RANK = { dormant: 0, armed: 1, revealed: 2, complete: 3 };

function mergeRunQuests(v, run) {
  const completed = [];
  for (const id of QUEST_IDS) {
    if (!run.quests?.[id]) continue;
    const from = cloneQuest(run.quests[id]);
    const to = v.quests[id];
    if (STATE_RANK[from.state] > STATE_RANK[to.state]) to.state = from.state;
    to.progress = Math.max(to.progress, from.progress);
    // A run receives the whole memory snapshot. Treat it as authoritative so
    // deleting dueIn or emberDebt survives the cross-run merge.
    to.memory = { ...from.memory };
    if (to.state === 'complete' && !v.shards.includes(id)) completed.push(id);
  }
  const ordered = [
    ...(run.questCompletions || []).filter((id) => completed.includes(id)),
    ...QUEST_IDS.filter((id) => completed.includes(id) && !(run.questCompletions || []).includes(id)),
  ];
  return ordered;
}

export function commitRunEnd(run, outcome = 'abandon') {
  if (!['win', 'death', 'abandon'].includes(outcome)) throw new Error('invalid run outcome: ' + outcome);
  if (run.runEndResult) {
    if (run.runEndOutcome !== outcome) throw new Error('run end outcome does not match durable receipt');
    return run.runEndResult;
  }

  const v = loadVigil();
  const prior = v.receipts.runEnd;
  if (prior?.runId === run.runId) {
    if (prior.outcome !== outcome) throw new Error('run end outcome does not match durable receipt');
    run.runEndCommitted = true;
    run.runEndOutcome = outcome;
    run.runEndResult = {
      vigil: v, whisper: prior.whisper, armed: [...prior.armed], completed: [...prior.completed], newShards: [...prior.newShards],
    };
    return run.runEndResult;
  }
  const beforeRevealCount = revealSnapshot(v).length;
  const before = JSON.stringify({
    quests: v.quests, shards: v.shards, unlocks: v.unlocks, whispers: v.whispers,
  });
  const completed = mergeRunQuests(v, run);
  const hs = run.questScratch?.hollowLamplighter;
  const persistedHollow = v.quests.hollowLamplighter;
  if (hs && !hs.debtActive && ['armed', 'revealed'].includes(persistedHollow.state)) {
    persistedHollow.memory.eligibleMisses = hs.met
      ? 0
      : (persistedHollow.memory.eligibleMisses || 0) + 1;
  }
  if (persistedHollow.state === 'complete') delete persistedHollow.memory.eligibleMisses;
  for (const id of completed) v.shards.push(id);
  for (const id of run.unlocks || []) if (!v.unlocks.includes(id)) v.unlocks.push(id);
  const fall = run.questScratch?.ownShade?.fall;
  if (outcome === 'death' && fall) {
    v.lastFall = {
      act: fall.act,
      row: fall.row,
      bequest: fall.bequest ?? null,
      standing: true,
      shadeAspect: fall.shadeAspect,
    };
  }

  v.runsPlayed++;
  const armed = [];
  let whisper = null;
  if (outcome === 'win') {
    v.whispers++;
    whisper = whisperAt(v.whispers);
    const wins = v.deeds.wins || 0;
    const dormant = QUEST_IDS.slice(1).filter((id) => v.quests[id].state === 'dormant');
    const armWins = PROGRESSION.emberglass.armWins;
    const catchUp = wins > armWins.at(-1) && dormant.length > 0;
    if (armWins.includes(wins) || catchUp) {
      if (dormant.length) {
        const id = dormant[Math.min(dormant.length - 1, Math.floor(armRng() * dormant.length))];
        v.quests[id].state = 'armed';
        if (id === 'eighthOmen') v.quests[id].memory.dueIn = PROGRESSION.emberglass.eighthOmen.guaranteeRuns;
        armed.push(id);
      }
    }
  }

  const after = JSON.stringify({
    quests: v.quests, shards: v.shards, unlocks: v.unlocks, whispers: v.whispers,
  });
  const revealLanded = revealSnapshot(v).length > beforeRevealCount;
  if (before !== after || revealLanded) v.news = true;
  v.receipts.runEnd = {
    runId: run.runId, outcome, whisper, armed: [...armed], completed: [...completed], newShards: [...completed],
  };
  if (!saveVigil(v)) throw new Error('Vigil storage rejected the run end; retry when storage is available');
  run.runEndCommitted = true;
  run.runEndOutcome = outcome;
  run.runEndResult = { vigil: v, whisper, armed, completed, newShards: completed };
  return run.runEndResult;
}

export function clearNews() {
  const v = loadVigil();
  if (v.news) { v.news = false; saveVigil(v); }
  return v;
}

// fold a finished (or fallen) run into the vigil; idempotent per run
export function commitRunToVigil(run, won) {
  if (run.vigilResult) {
    if (run.vigilWon !== !!won) throw new Error('run win state does not match durable deed receipt');
    return run.vigilResult;
  }
  const v = loadVigil();
  const prior = v.receipts.deeds;
  if (prior?.runId === run.runId) {
    if (prior.won !== !!won) throw new Error('run win state does not match durable deed receipt');
    run.vigilCommitted = true;
    run.vigilWon = !!won;
    run.vigilResult = { vigil: v, newUnlocks: [...prior.newUnlocks] };
    return run.vigilResult;
  }
  const beforeDeeds = { ...v.deeds };
  v.deeds.runs++;
  if (won) {
    v.deeds.wins++;
    v.deeds.bestVow = Math.max(v.deeds.bestVow, run.vow || 0);
    v.vowUnlocked = Math.max(v.vowUnlocked, Math.min(5, (run.vow || 0) + 1));
  }
  v.deeds.bestFloor = Math.max(v.deeds.bestFloor, run.act * 15 + run.floorsClimbed);
  v.deeds.slain += run.stats.slain || 0;
  for (const k of ['shatters', 'kindles', 'perfects', 'smolderKills', 'unlitVisited', 'embersSpent']) {
    v.deeds[k] += run.stats[k] || 0;
  }
  const newUnlocks = evaluateDeeds(v);
  v.unlocks.push(...newUnlocks);
  // pulse on any deed-bar movement (not only threshold unlocks) — design §3
  const deedProgressed = Object.keys(DEFAULT_DEEDS).some((k) => v.deeds[k] !== beforeDeeds[k]);
  if (deedProgressed || newUnlocks.length) v.news = true;
  v.receipts.deeds = { runId: run.runId, won: !!won, newUnlocks: [...newUnlocks] };
  if (!saveVigil(v)) throw new Error('Vigil storage rejected the deed commit; retry when storage is available');
  run.vigilCommitted = true;
  run.vigilWon = !!won;
  run.vigilResult = { vigil: v, newUnlocks };
  return run.vigilResult;
}

export function commitPendingRunEnd(run, recordRunEnd) {
  const outcome = run.pendingRunEnd?.outcome;
  if (!['win', 'death', 'abandon'].includes(outcome)) throw new Error('run has no valid pending outcome');
  if (typeof recordRunEnd !== 'function') throw new Error('run cleanup acknowledgement is required');
  const won = outcome === 'win';
  const deedResult = outcome === 'abandon' ? { newUnlocks: [] } : commitRunToVigil(run, won);
  const ledger = commitRunEnd(run, outcome);
  return {
    accepted: recordRunEnd(run, won) === true,
    newUnlocks: [...deedResult.newUnlocks],
    ledger,
    outcome,
  };
}

// the monument of the last fall
export function setBequest(act, row, bequest) {
  const v = loadVigil();
  if (v.lastFall?.standing === true && v.lastFall.act === act && v.lastFall.row === row) {
    v.lastFall = {
      ...v.lastFall,
      bequest: v.lastFall.bequest ?? bequest,
    };
  } else {
    v.lastFall = { act, row, bequest, standing: false };
  }
  return saveVigil(v);
}
export function clearBequest() {
  const v = loadVigil();
  v.lastFall = null;
  return saveVigil(v);
}

// what the dark keeps: up to three things worth carving into the stone
const RARITY_RANK = { starter: 0, special: 0, common: 1, uncommon: 2, rare: 3, boss: 4 };
export function bequestOptions(run) {
  const out = [];
  const relics = run.player.relics.filter((id) => RELICS[id] && RELICS[id].rarity !== 'starter');
  if (relics.length) {
    const best = [...relics].sort((a, b) => RARITY_RANK[RELICS[b].rarity] - RARITY_RANK[RELICS[a].rarity])[0];
    out.push({ kind: 'relic', id: best });
  }
  const cards = run.player.deck.filter((c) => {
    const d = CARDS[c.id];
    return d && d.rarity !== 'starter' && d.rarity !== 'special';
  });
  if (cards.length) {
    const best = [...cards].sort((a, b) =>
      (RARITY_RANK[CARDS[b.id].rarity] - RARITY_RANK[CARDS[a.id].rarity]) || (b.up === a.up ? 0 : b.up ? 1 : -1))[0];
    out.push({ kind: 'card', id: best.id, up: !!best.up });
  }
  if (run.player.gold >= 25) out.push({ kind: 'gold', amount: Math.min(run.player.gold, 75) });
  return out;
}
