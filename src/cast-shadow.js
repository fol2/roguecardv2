// Per-character cast-shadow overrides — owned by ?charedit=1.
// Values are fractions of the art box unless noted. Missing keys use DEFAULT.
//   ox, oy   — transform-origin % (feet contact in the art box)
//   sx, sy   — base squash (sy << 1 flattens onto the ground)
//   skew     — degrees (light direction hint)
//   blur     — px
//   opacity  — 0..1 at rest (float lift still fades it)
//   dx, dy   — px offset of the whole shadow (+dy = further below the box)
// Imports nothing; imported by ui.js + the char editor.

export const CAST_SHADOW_DEFAULT = {
  ox: 50, oy: 100, sx: 1, sy: 0.24, skew: 0, blur: 1.5, opacity: 0.62, dx: 0, dy: 0,
};

/** @type {Record<string, Partial<typeof CAST_SHADOW_DEFAULT>>} */
export const CAST_SHADOW = {
  // heroes
  duskblade: { ox: 48, oy: 96, skew: 5 },
  ashwarden: { ox: 50, oy: 98, skew: 5 },
  // enemies — empty until tuned in ?charedit=1
};

export function castShadowFor(id) {
  return { ...CAST_SHADOW_DEFAULT, ...(CAST_SHADOW[id] || {}) };
}

/** Test/editor hook — replace the live table without a reload. */
let _live = CAST_SHADOW;
export function _setCastShadow(map) {
  _live = map || CAST_SHADOW;
}
export function castShadowLive(id) {
  return { ...CAST_SHADOW_DEFAULT, ...(_live[id] || {}) };
}
export function castShadowTable() {
  return _live;
}
