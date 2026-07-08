// Deterministic serializer + validator for src/cast-shadow.js.
// Shared by the char editor (browser) and the vite save plugin (node).
const KEYS = ['ox', 'oy', 'sx', 'sy', 'skew', 'blur', 'opacity', 'dx', 'dy'];
const RANGES = {
  ox: [0, 100], oy: [0, 100], sx: [0.2, 2], sy: [0.05, 1],
  skew: [-30, 30], blur: [0, 12], opacity: [0, 1], dx: [-80, 80], dy: [-40, 80],
};

const HEADER = `// Per-character cast-shadow overrides — owned by ?charedit=1.
// Values are fractions of the art box unless noted. Missing keys use DEFAULT.
//   ox, oy   — transform-origin % (feet contact in the art box)
//   sx, sy   — base squash (sy << 1 flattens onto the ground)
//   skew     — degrees (light direction hint)
//   blur     — px
//   opacity  — 0..1 at rest (float lift still fades it)
//   dx, dy   — px offset of the whole shadow (+dy = further below the box)
// Imports nothing; imported by ui.js + the char editor.
`;

const num = (v) => {
  const r = Math.round(v * 1000) / 1000;
  return Object.is(r, -0) ? '0' : String(r);
};

function inline(obj) {
  const keys = KEYS.filter((k) => obj[k] !== undefined);
  return `{ ${keys.map((k) => `${k}: ${num(obj[k])}`).join(', ')} }`;
}

export function validateCastShadow(table, { heroes = [], enemies = [] } = {}) {
  const problems = [];
  if (!table || typeof table !== 'object' || Array.isArray(table)) {
    return ['root must be an object of id → override'];
  }
  const known = new Set([...heroes, ...enemies]);
  for (const [id, o] of Object.entries(table)) {
    if (!known.has(id)) problems.push(`unknown id: ${id}`);
    if (!o || typeof o !== 'object') { problems.push(`${id}: override must be object`); continue; }
    for (const k of Object.keys(o)) {
      if (!KEYS.includes(k)) problems.push(`${id}: unknown key ${k}`);
      else if (!Number.isFinite(o[k])) problems.push(`${id}.${k}: not finite`);
      else {
        const [lo, hi] = RANGES[k];
        if (o[k] < lo || o[k] > hi) problems.push(`${id}.${k}: ${o[k]} out of [${lo},${hi}]`);
      }
    }
  }
  return problems;
}

export function serializeCastShadow(table, defaults) {
  const ids = Object.keys(table).sort();
  const rows = ids.map((id) => `  ${/^[a-zA-Z_$][\w$]*$/.test(id) ? id : JSON.stringify(id)}: ${inline(table[id])},`).join('\n');
  const def = inline(defaults);
  return `${HEADER}
export const CAST_SHADOW_DEFAULT = ${def};

/** @type {Record<string, Partial<typeof CAST_SHADOW_DEFAULT>>} */
export const CAST_SHADOW = {
${rows}
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
`;
}

export const CAST_SHADOW_KEYS = KEYS;
export const CAST_SHADOW_RANGES = RANGES;
