// THE VIGIL — what persists between climbs: deeds, unlocks, vows, and the
// monument of the last fall. Storage is Node-safe: without localStorage
// (tests) it keeps the ledger in memory so callers can still assert on it.
import { DEEDS, CARDS, RELICS, REVEALS } from './data.js';

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
    ...(v || {}),
  };
  out.v = 2;
  out.deeds = { ...DEFAULT_DEEDS, ...(out.deeds || {}) };
  if (!Array.isArray(out.unlocks)) out.unlocks = [];
  if (!Array.isArray(out.shards)) out.shards = [];
  if (!out.quests || typeof out.quests !== 'object') out.quests = {};
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
  try { getStore().setItem(KEY, JSON.stringify(v)); } catch { /* full */ }
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
  return true;
}
export function revealSnapshot(vigil) {
  return REVEALS.filter((r) => isRevealed(vigil, r.id)).map((r) => r.id);
}

// every run end — win, fall, or abandon — advances the ledger that paces the
// reveals. Separate from commitRunToVigil so deed semantics (win/fall only)
// stay untouched. Idempotent per run.
// Wins-gated reveals pulse via commitRunToVigil's unlock path (deeds.wins
// moves there), so this before/after diff only needs to watch runsPlayed.
export function commitRunEnd(run) {
  if (run.runEndCommitted) return loadVigil();
  run.runEndCommitted = true;
  const v = loadVigil();
  const before = revealSnapshot(v).length;
  v.runsPlayed++;
  if (revealSnapshot(v).length > before) v.news = true;
  saveVigil(v);
  return v;
}

export function clearNews() {
  const v = loadVigil();
  if (v.news) { v.news = false; saveVigil(v); }
  return v;
}

// fold a finished (or fallen) run into the vigil; idempotent per run
export function commitRunToVigil(run, won) {
  if (run.vigilCommitted) return { vigil: loadVigil(), newUnlocks: [] };
  run.vigilCommitted = true;
  const v = loadVigil();
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
  if (newUnlocks.length) v.news = true;
  saveVigil(v);
  return { vigil: v, newUnlocks };
}

// the monument of the last fall
export function setBequest(act, row, bequest) {
  const v = loadVigil();
  v.lastFall = { act, row, bequest };
  saveVigil(v);
}
export function clearBequest() {
  const v = loadVigil();
  v.lastFall = null;
  saveVigil(v);
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
