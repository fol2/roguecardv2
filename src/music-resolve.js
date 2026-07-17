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

/**
 * Quest override → Eighth Omen (non-boss) → theme Music record.
 * @param {string} kind
 * @param {{ combat?: string, boss?: string }|null|undefined} themeMusic
 */
export function resolveCombatCue(kind, themeMusic, { questId = null, omenId = null } = {}) {
  if (questId && QUEST_COMBAT_CUES[questId]) return QUEST_COMBAT_CUES[questId];
  if (omenId === 'eighthOmen' && kind !== 'boss') return 'eighthOmen';
  if (kind === 'boss') return themeMusic?.boss || null;
  if (kind === 'elite') return 'elite';
  return themeMusic?.combat || null;
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
