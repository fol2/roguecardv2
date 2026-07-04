// THE VIGIL — what persists between climbs: deeds, unlocks, vows, and the
// monument of the last fall. Storage is Node-safe: without localStorage
// (tests) it keeps the ledger in memory so callers can still assert on it.
import { DEEDS, CARDS, RELICS } from './data.js';

const KEY = 'spirebound_vigil_v1';
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
  const out = { v: 1, deeds: {}, unlocks: [], vowUnlocked: 0, lastFall: null, ...(v || {}) };
  out.deeds = { ...DEFAULT_DEEDS, ...(out.deeds || {}) };
  if (!Array.isArray(out.unlocks)) out.unlocks = [];
  if (raw == null) {
    // first vigil: honor what the old stats ledger already knew
    try {
      const s = JSON.parse(getStore().getItem(STATS_KEY));
      if (s) { out.deeds.runs = s.runs || 0; out.deeds.wins = s.wins || 0; }
    } catch { /* none */ }
    if (out.deeds.wins > 0) out.vowUnlocked = 1;
  }
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
  if (owed.length) { v.unlocks.push(...owed); saveVigil(v); }
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
