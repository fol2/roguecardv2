// Per-character presentation meta — owned by ?charedit=1 (also scale/foot* from ?bfedit=1).
// Layout (scale/footX/footY), cast shadow, mesh/float, and aim-outline defaults live here.
// Missing keys use defaults; mesh keys override the kind PROFILE in mesh.js.
// Imports nothing; imported by battlefield.js, mesh.js, ui.js, and the char editor.

export const CHAR_LAYOUT_DEFAULT = { scale: 1, footX: 0, footY: 0 };

export const CHAR_SHADOW_DEFAULT = { ox: 50, oy: 100, sx: 1, sy: 0.24, skew: 0, blur: 1.5, opacity: 0.62, dx: 0, dy: 0 };

/** Card-hover aim outline — global default; per-id `aim` overrides partially. */
export const CHAR_AIM_DEFAULT = { style: "solid", speed: 2.55, color: "#e4d5fb", width: 0.018, beams: 4, dashes: 2 };

/** Mesh profile keys (absolute overrides on top of art.kind PROFILE). */
export const CHAR_MESH_KEYS = ["sway","bob","breathe","head","cloth","pin","float"];

/**
 * @typedef {{
 *   scale?: number, footX?: number, footY?: number,
 *   shadow?: Partial<typeof CHAR_SHADOW_DEFAULT>,
 *   mesh?: Partial<Record<(typeof CHAR_MESH_KEYS)[number], number>>,
 *   cssFloat?: number,
 *   aim?: Partial<typeof CHAR_AIM_DEFAULT>,
 * }} CharMetaEntry
 */

/** @type {Record<string, CharMetaEntry>} */
export const CHAR_META = {
  abyssalKnight: { scale: 1.3, footY: -20, shadow: { ox: 38, oy: 87 } },
  alphaFang: { scale: 2, footX: -30, footY: -60, shadow: { ox: 47, oy: 83, sy: 0.33 } },
  ashAcolyte: { scale: 0.95, shadow: { oy: 91 } },
  ashwarden: { shadow: { ox: 54, oy: 93, skew: 5 }, aim: { color: "#f9bd95" } },
  chaosHound: { scale: 1.05, shadow: { ox: 53, oy: 87 } },
  deepmaw: { scale: 1.14, shadow: { ox: 48, oy: 87 } },
  drownedOne: { scale: 0.8, shadow: { ox: 51, oy: 88 } },
  duskblade: { footY: -30, shadow: { ox: 47, oy: 95, skew: 5 }, aim: { color: "#6d9edf" } },
  duskfang: { scale: 0.95, shadow: { ox: 46, oy: 87 } },
  gloomslime: { scale: 0.95, shadow: { ox: 52, oy: 86 } },
  gravewarden: { scale: 2.5, footX: -40, footY: -50, shadow: { ox: 51, oy: 88 } },
  heraldOfEnd: { scale: 2.3, footX: -50, shadow: { ox: 53, oy: 94 } },
  leviathan: { scale: 4, footX: -150, footY: -200, shadow: { ox: 49.4, oy: 84 } },
  mirelurker: { scale: 0.9, shadow: { ox: 43.2, oy: 87 } },
  obsidianGolem: { scale: 1.3, shadow: { ox: 50.8, oy: 85.2 } },
  rootheart: { scale: 2.6, footX: -50, footY: -70, shadow: { ox: 45.9, oy: 93.4 } },
  shade: { scale: 1.1, shadow: { ox: 49.8, dy: 16 } },
  shellback: { scale: 1.09, shadow: { ox: 56, oy: 78.1 } },
  siren: { scale: 1.6, footX: -10, footY: -20, shadow: { ox: 48, oy: 99 } },
  sovereign: { scale: 1.45, footX: -100, footY: 50, shadow: { ox: 49.7, oy: 97 } },
  sporeling: { scale: 0.62, shadow: { ox: 54.8, dy: 10 } },
  starCultist: { shadow: { ox: 56.6, oy: 95.3 } },
  thornling: { scale: 0.81, shadow: { ox: 51, oy: 91 } },
  tidecaller: { shadow: { ox: 56, oy: 89.5 } },
  voidColossus: { scale: 2.5, footX: -50, shadow: { ox: 46.6, oy: 97.3 } },
  voidWisp: { scale: 0.67, shadow: { ox: 51.3, dy: 9 } },
  voltEel: { scale: 1.1, shadow: { dy: 13 }, mesh: { float: 1.1 } },
  watcherEye: { scale: 1.1, shadow: { ox: 50.4, dy: 24 } },
  waylayer: { scale: 0.9, shadow: { ox: 56, oy: 91 } },
};

let _live = CHAR_META;
const _listeners = new Set();

/** Soft-apply hook — charedit / combat re-paint without a full page reload. */
export function onCharMetaChange(fn) {
  _listeners.add(fn);
  return () => _listeners.delete(fn);
}
function notifyCharMeta() {
  for (const fn of _listeners) {
    try { fn(); } catch { /* listener errors must not break the table */ }
  }
}

/** Test/editor hook — replace the live table without a reload. */
export function _setCharMeta(map, { silent = false } = {}) {
  _live = map || CHAR_META;
  if (!silent) notifyCharMeta();
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

/** Resolved aim outline config (global default + per-id partial). */
export function charAim(id) {
  return { ...CHAR_AIM_DEFAULT, ...((_live[id] || {}).aim || {}) };
}

// Vite HMR: swap the live table in place so importers keep working without a full reload.
if (import.meta.hot) {
  import.meta.hot.accept((mod) => {
    if (!mod?.CHAR_META) return;
    Object.assign(CHAR_LAYOUT_DEFAULT, mod.CHAR_LAYOUT_DEFAULT);
    Object.assign(CHAR_SHADOW_DEFAULT, mod.CHAR_SHADOW_DEFAULT);
    if (mod.CHAR_AIM_DEFAULT) Object.assign(CHAR_AIM_DEFAULT, mod.CHAR_AIM_DEFAULT);
    _setCharMeta(mod.CHAR_META);
  });
}
