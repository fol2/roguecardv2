// Node-pure Round 5 commercial smoke storage fixtures (Task 24).
// Fresh clears run/stats/Vigil keys. Veteran emits a save-compatible post-Phase2
// Vigil/stats profile. Both are validated through the real load/migration APIs
// before any browser journey injects them.

import { QUEST_IDS } from '../../src/data.js';
import {
  _setStore, loadVigil, revealSnapshot, isRevealed,
} from '../../src/vigil.js';

export const RUN_KEY = 'spirebound_save_v2';
export const STATS_KEY = 'spirebound_stats_v1';
export const VIGIL_KEY = 'spirebound_vigil_v2';
export const VIGIL_V1_KEY = 'spirebound_vigil_v1';

const TARGET = Object.freeze({
  paleOnes: 9,
  ownShade: 3,
  usurper: 1,
  eighthOmen: 1,
  unreadablePage: 5,
  hollowLamplighter: 5,
});

function memoryStore(seed = {}) {
  const mem = new Map(Object.entries(seed));
  return {
    getItem: (k) => (mem.has(k) ? mem.get(k) : null),
    setItem: (k, v) => { mem.set(k, String(v)); },
    removeItem: (k) => { mem.delete(k); },
    _mem: mem,
  };
}

function deeds(wins = 24) {
  return {
    runs: Math.max(wins, 24),
    wins,
    slain: 120,
    shatters: 20,
    kindles: 25,
    perfects: 4,
    smolderKills: 12,
    unlitVisited: 8,
    embersSpent: 40,
    bestVow: 2,
    bestFloor: 18,
  };
}

function quest(state, progress = 0, memory = {}) {
  return { state, progress, memory };
}

/** Fresh profile: no run, no stats, no Vigil (all climb keys removed). */
export function buildFreshProfileStorage() {
  return Object.freeze({
    [RUN_KEY]: null,
    [STATS_KEY]: null,
    [VIGIL_KEY]: null,
    [VIGIL_V1_KEY]: null,
  });
}

/**
 * Veteran profile: every reveal active, all Rose Window shards complete,
 * unlocked second aspect, non-zero Vow, grown title/Vigil surfaces.
 */
export function buildVeteranProfileStorage() {
  const vigil = {
    v: 2,
    deeds: deeds(24),
    unlocks: ['aspect2'],
    vowUnlocked: 2,
    lastFall: null,
    runsPlayed: 24,
    quests: Object.fromEntries(
      QUEST_IDS.map((id) => [id, quest('complete', TARGET[id] || 1)]),
    ),
    shards: [...QUEST_IDS],
    whispers: 24,
    news: true,
    receipts: { deeds: null, runEnd: null },
  };
  const stats = {
    runs: 24,
    wins: 24,
    best: 18,
    lastRunId: null,
  };
  return Object.freeze({
    [RUN_KEY]: null,
    [STATS_KEY]: JSON.stringify(stats),
    [VIGIL_KEY]: JSON.stringify(vigil),
    [VIGIL_V1_KEY]: null,
  });
}

/** Apply a storage blob through the real Vigil load/migration path. */
export function validateProfileStorage(storageBlob) {
  const store = memoryStore();
  for (const [key, value] of Object.entries(storageBlob || {})) {
    if (value == null) store.removeItem(key);
    else store.setItem(key, value);
  }
  _setStore(store);
  try {
    const vigil = loadVigil();
    const reveals = revealSnapshot(vigil);
    return Object.freeze({
      vigil,
      reveals,
      statsRaw: store.getItem(STATS_KEY),
      runRaw: store.getItem(RUN_KEY),
    });
  } finally {
    _setStore(null);
  }
}

export function assertFreshProfile(validated) {
  if (!validated?.vigil) throw new Error('fresh profile missing vigil');
  if ((validated.vigil.runsPlayed || 0) !== 0) {
    throw new Error(`fresh profile runsPlayed=${validated.vigil.runsPlayed}`);
  }
  if ((validated.vigil.deeds?.wins || 0) !== 0) {
    throw new Error(`fresh profile wins=${validated.vigil.deeds.wins}`);
  }
  if ((validated.vigil.shards || []).length !== 0) {
    throw new Error('fresh profile must have no shards');
  }
  if ((validated.vigil.unlocks || []).includes('aspect2')) {
    throw new Error('fresh profile must not unlock aspect2');
  }
  if ((validated.vigil.vowUnlocked || 0) !== 0) {
    throw new Error('fresh profile must not unlock Vow');
  }
  return true;
}

export function assertVeteranProfile(validated) {
  if (!validated?.vigil) throw new Error('veteran profile missing vigil');
  const v = validated.vigil;
  if ((v.runsPlayed || 0) < 6) throw new Error('veteran runsPlayed too low for poolFull');
  if ((v.deeds?.wins || 0) < 1) throw new Error('veteran needs at least one win');
  if ((v.shards || []).length < 6) throw new Error('veteran needs all six Rose shards');
  if (!(v.unlocks || []).includes('aspect2')) throw new Error('veteran must unlock aspect2');
  if ((v.vowUnlocked || 0) < 1) throw new Error('veteran must unlock a non-zero Vow');
  for (const id of [
    'lamplighter', 'phials', 'omens', 'poolWave2', 'poolWave3', 'poolFull', 'emberglass', 'act4',
  ]) {
    if (!isRevealed(v, id)) throw new Error(`veteran missing reveal ${id}`);
  }
  for (const id of QUEST_IDS) {
    if (v.quests?.[id]?.state !== 'complete') {
      throw new Error(`veteran quest ${id} not complete`);
    }
  }
  return true;
}

/** Convenience used by Node unit tests. */
export function buildAndValidateProfiles() {
  const freshBlob = buildFreshProfileStorage();
  const fresh = validateProfileStorage(freshBlob);
  assertFreshProfile(fresh);

  const veteranBlob = buildVeteranProfileStorage();
  const veteran = validateProfileStorage(veteranBlob);
  assertVeteranProfile(veteran);

  return { freshBlob, veteranBlob, fresh, veteran };
}
