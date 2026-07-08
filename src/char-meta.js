// Per-character presentation meta — owned by ?charedit=1 (also scale/foot* from ?bfedit=1).
// Layout (scale/footX/footY), cast shadow, and mesh/float overrides live here.
// Missing keys use defaults; mesh keys override the kind PROFILE in mesh.js.
// Imports nothing; imported by battlefield.js, mesh.js, ui.js, and the char editor.

export const CHAR_LAYOUT_DEFAULT = { scale: 1, footX: 0, footY: 0 };

export const CHAR_SHADOW_DEFAULT = {
  ox: 50, oy: 100, sx: 1, sy: 0.24, skew: 0, blur: 1.5, opacity: 0.62, dx: 0, dy: 0,
};

/** Mesh profile keys (absolute overrides on top of art.kind PROFILE). */
export const CHAR_MESH_KEYS = ['sway', 'bob', 'breathe', 'head', 'cloth', 'pin', 'float'];

/**
 * @typedef {{
 *   scale?: number, footX?: number, footY?: number,
 *   shadow?: Partial<typeof CHAR_SHADOW_DEFAULT>,
 *   mesh?: Partial<Record<(typeof CHAR_MESH_KEYS)[number], number>>,
 *   cssFloat?: number,
 * }} CharMetaEntry
 */

/** @type {Record<string, CharMetaEntry>} */
export const CHAR_META = {
  abyssalKnight: { scale: 1.3, footY: -20 },
  alphaFang: { scale: 2, footX: -30, footY: -60 },
  ashAcolyte: { scale: 0.95 },
  ashwarden: { shadow: { oy: 98, skew: 5 } },
  chaosHound: { scale: 1.05 },
  deepmaw: { scale: 1.14 },
  drownedOne: { scale: 0.8 },
  duskblade: { footY: -30, shadow: { ox: 48, oy: 96, skew: 5 } },
  duskfang: { scale: 0.95 },
  gloomslime: { scale: 0.95 },
  gravewarden: { scale: 2.5, footX: -40, footY: -50 },
  heraldOfEnd: { scale: 2.3, footX: -50 },
  leviathan: { scale: 4, footX: -150, footY: -200 },
  mirelurker: { scale: 0.9 },
  obsidianGolem: { scale: 1.3 },
  rootheart: { scale: 2.6, footX: -50, footY: -70 },
  shade: { scale: 1.1 },
  shellback: { scale: 1.09 },
  siren: { scale: 1.6, footX: -10, footY: -20 },
  sovereign: { scale: 1.45, footX: -100, footY: 50 },
  sporeling: { scale: 0.62 },
  thornling: { scale: 0.81 },
  voidColossus: { scale: 2.5, footX: -50 },
  voidWisp: { scale: 0.67 },
  voltEel: { scale: 1.1 },
  watcherEye: { scale: 1.1 },
  waylayer: { scale: 0.9 },
};

let _live = CHAR_META;

/** Test/editor hook — replace the live table without a reload. */
export function _setCharMeta(map) {
  _live = map || CHAR_META;
}
export function charMetaTable() {
  return _live;
}
export function charMetaEntry(id) {
  return _live[id] || {};
}

export function charLayout(id) {
  const e = _live[id] || {};
  return {
    scale: e.scale ?? CHAR_LAYOUT_DEFAULT.scale,
    footX: e.footX ?? CHAR_LAYOUT_DEFAULT.footX,
    footY: e.footY ?? CHAR_LAYOUT_DEFAULT.footY,
  };
}

export function charShadow(id) {
  return { ...CHAR_SHADOW_DEFAULT, ...((_live[id] || {}).shadow || {}) };
}
/** Live alias used by combat UI (respects editor _setCharMeta). */
export function charShadowLive(id) {
  return charShadow(id);
}

export function charMesh(id) {
  return { ...((_live[id] || {}).mesh || {}) };
}

/** Optional CSS idle `--float-y` px; null = leave kind stylesheet default. */
export function charCssFloat(id) {
  const v = (_live[id] || {}).cssFloat;
  return Number.isFinite(v) ? v : null;
}
