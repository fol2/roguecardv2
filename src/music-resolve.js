// Pure Music Cue resolve — Node-safe, no AudioContext / localStorage.

/** Quest id → combat Music Cue. ownShade maps to shadeDuel (ledger name). */
export const QUEST_COMBAT_CUES = {
  paleOnes: 'paleOnes',
  ownShade: 'shadeDuel',
  usurper: 'usurper',
};

export const SCREEN_CUES = {
  title: 'title',
  embark: 'embark',
  vigil: 'vigil',
  map: 'map',
  shop: 'safeNodes',
  rest: 'safeNodes',
  treasure: 'safeNodes',
  event: 'map',
  lamplighter: 'map',
  hollow: 'hollowLamplighter',
};

/** Quest override → Eighth Omen (non-boss) → act defaults. */
export function resolveCombatCue(kind, actIdx, { questId = null, omenId = null } = {}) {
  if (questId && QUEST_COMBAT_CUES[questId]) return QUEST_COMBAT_CUES[questId];
  if (omenId === 'eighthOmen' && kind !== 'boss') return 'eighthOmen';
  const act = Math.max(0, Math.min(2, actIdx | 0)) + 1;
  if (kind === 'boss') return `act${act}Boss`;
  if (kind === 'elite') return 'elite';
  return `act${act}Combat`;
}

export function resolveScreenCue(name, overrideCue = null) {
  if (overrideCue) return overrideCue;
  return SCREEN_CUES[name] || null;
}

/** Dawn ceremony panels that temporarily own BGM. */
export function dawnEventCue(event) {
  if (!event) return null;
  if (event.t === 'pageRead') return 'unreadablePage';
  if (event.t === 'act4Reveal') return 'sealedDoor';
  return null;
}
