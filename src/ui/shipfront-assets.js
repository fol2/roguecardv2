// Pure Round 5 ship-front asset resolution.
// Node-importable: no DOM, no Vite, no audio/stage.

export const BOSS_PLATE_LAYERS = Object.freeze(['backdrop', 'mid', 'ledge']);
export const TITLE_LAYER_IDS = Object.freeze([
  'round5-back', 'round5-mid', 'round5-foreground',
]);
export const TITLE_FALLBACK_ID = 'title';
export const UNLOCK_TOAST_FRAME_ID = 'unlock-toast-frame';

const STORE_SHOT_IDS = Object.freeze([
  'title', 'combat', 'map', 'rose-window', 'boss',
]);

function hasAsset(available, id) {
  if (!id) return false;
  if (typeof available === 'function') return !!available(id);
  if (available && typeof available.has === 'function') return available.has(id);
  if (available && typeof available === 'object') return !!available[id];
  return false;
}

/**
 * Resolve combat stage plate ids for the active encounter.
 * Boss overrides apply only when kind === 'boss' and a bossId override exists
 * with every requested layer available; otherwise act-standard theme.plates.
 * Never maps act numbers to boss names.
 */
export function resolveCombatPlates(theme, encounter = {}, available) {
  const base = theme?.plates || {};
  const { kind = 'normal', bossId = null } = encounter;
  const override = (kind === 'boss' && bossId)
    ? theme?.bossPlates?.[bossId]
    : null;
  const out = {};
  for (const layer of BOSS_PLATE_LAYERS) {
    const overrideId = override?.[layer];
    if (overrideId && hasAsset(available, overrideId)) {
      out[layer] = overrideId;
    } else {
      out[layer] = base[layer] || null;
    }
  }
  return out;
}

/** Resolve title parallax layer ids; missing layers fall back to legacy title. */
export function resolveTitleLayers(available) {
  return TITLE_LAYER_IDS.map((id) => (
    hasAsset(available, id) ? id : TITLE_FALLBACK_ID
  ));
}

/** Unlock toast frame id when present; otherwise null (CSS / illustration fallback). */
export function resolveUnlockToastFrame(available) {
  return hasAsset(available, UNLOCK_TOAST_FRAME_ID) ? UNLOCK_TOAST_FRAME_ID : null;
}

/**
 * Validate the store shot-list schema: exactly the five declared ids, each with
 * seed/shape/profile fields.
 */
export function validateStoreShotList(shots) {
  if (!Array.isArray(shots)) {
    return { ok: false, error: 'shots must be an array' };
  }
  if (shots.length !== STORE_SHOT_IDS.length) {
    return { ok: false, error: `expected ${STORE_SHOT_IDS.length} shots` };
  }
  const seen = new Set();
  for (const shot of shots) {
    if (!shot || typeof shot !== 'object') {
      return { ok: false, error: 'shot must be an object' };
    }
    const { id, seed, shape, profile } = shot;
    if (!STORE_SHOT_IDS.includes(id)) {
      return { ok: false, error: `unexpected shot id: ${id}` };
    }
    if (seen.has(id)) return { ok: false, error: `duplicate shot id: ${id}` };
    seen.add(id);
    if (seed == null || seed === '') {
      return { ok: false, error: `${id}: missing seed` };
    }
    if (!shape) return { ok: false, error: `${id}: missing shape` };
    if (!profile) return { ok: false, error: `${id}: missing profile` };
  }
  for (const id of STORE_SHOT_IDS) {
    if (!seen.has(id)) return { ok: false, error: `missing shot id: ${id}` };
  }
  return { ok: true };
}

export const STORE_SHOT_LIST_IDS = STORE_SHOT_IDS;
