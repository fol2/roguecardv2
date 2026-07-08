// Deterministic serializer + validator for src/char-meta.js.
// Shared by the char editor (browser) and the vite save plugin (node).

export const LAYOUT_KEYS = ['scale', 'footX', 'footY'];
export const SHADOW_KEYS = ['ox', 'oy', 'sx', 'sy', 'skew', 'blur', 'opacity', 'dx', 'dy'];
export const MESH_KEYS = ['sway', 'bob', 'breathe', 'head', 'cloth', 'pin', 'float'];

export const LAYOUT_RANGES = {
  scale: [0.2, 6], footX: [-300, 300], footY: [-300, 200],
};
export const SHADOW_RANGES = {
  ox: [0, 100], oy: [0, 100], sx: [0.2, 2], sy: [0.05, 1],
  skew: [-30, 30], blur: [0, 12], opacity: [0, 1], dx: [-80, 80], dy: [-40, 80],
};
export const MESH_RANGES = {
  sway: [0, 3], bob: [0, 3], breathe: [0, 3], head: [0, 3],
  cloth: [0, 3], pin: [0.5, 2], float: [0, 3],
};
export const CSS_FLOAT_RANGE = [0, 40];

const HEADER = `// Per-character presentation meta — owned by ?charedit=1 (also scale/foot* from ?bfedit=1).
// Layout (scale/footX/footY), cast shadow, and mesh/float overrides live here.
// Missing keys use defaults; mesh keys override the kind PROFILE in mesh.js.
// Imports nothing; imported by battlefield.js, mesh.js, ui.js, and the char editor.
`;

const num = (v) => {
  const r = Math.round(v * 1000) / 1000;
  return Object.is(r, -0) ? '0' : String(r);
};

function idKey(id) {
  return /^[a-zA-Z_$][\w$]*$/.test(id) ? id : JSON.stringify(id);
}

function inlineObj(obj, keys) {
  const ks = keys.filter((k) => obj[k] !== undefined);
  return `{ ${ks.map((k) => `${k}: ${num(obj[k])}`).join(', ')} }`;
}

function entryLine(id, entry) {
  const parts = [];
  for (const k of LAYOUT_KEYS) {
    if (entry[k] !== undefined) parts.push(`${k}: ${num(entry[k])}`);
  }
  if (entry.shadow && Object.keys(entry.shadow).length) {
    parts.push(`shadow: ${inlineObj(entry.shadow, SHADOW_KEYS)}`);
  }
  if (entry.mesh && Object.keys(entry.mesh).length) {
    parts.push(`mesh: ${inlineObj(entry.mesh, MESH_KEYS)}`);
  }
  if (entry.cssFloat !== undefined) parts.push(`cssFloat: ${num(entry.cssFloat)}`);
  return `  ${idKey(id)}: { ${parts.join(', ')} },`;
}

/** Drop empty nested objects / default-only layout noise before save. */
export function pruneCharMeta(table, defaults = {}) {
  const layoutDef = defaults.layout || { scale: 1, footX: 0, footY: 0 };
  const shadowDef = defaults.shadow || {};
  const out = {};
  for (const [id, raw] of Object.entries(table || {})) {
    if (!raw || typeof raw !== 'object') continue;
    const e = {};
    for (const k of LAYOUT_KEYS) {
      if (raw[k] !== undefined && raw[k] !== layoutDef[k]) e[k] = raw[k];
    }
    if (raw.shadow && typeof raw.shadow === 'object') {
      const sh = {};
      for (const k of SHADOW_KEYS) {
        if (raw.shadow[k] !== undefined && raw.shadow[k] !== shadowDef[k]) sh[k] = raw.shadow[k];
      }
      if (Object.keys(sh).length) e.shadow = sh;
    }
    if (raw.mesh && typeof raw.mesh === 'object') {
      const m = {};
      for (const k of MESH_KEYS) {
        if (raw.mesh[k] !== undefined) m[k] = raw.mesh[k];
      }
      if (Object.keys(m).length) e.mesh = m;
    }
    if (raw.cssFloat !== undefined) e.cssFloat = raw.cssFloat;
    if (Object.keys(e).length) out[id] = e;
  }
  return out;
}

export function validateCharMeta(table, { heroes = [], enemies = [] } = {}) {
  const problems = [];
  if (!table || typeof table !== 'object' || Array.isArray(table)) {
    return ['root must be an object of id → meta'];
  }
  const known = new Set([...heroes, ...enemies]);
  for (const [id, e] of Object.entries(table)) {
    if (!known.has(id)) problems.push(`unknown id: ${id}`);
    if (!e || typeof e !== 'object' || Array.isArray(e)) {
      problems.push(`${id}: meta must be object`);
      continue;
    }
    for (const k of Object.keys(e)) {
      if (![...LAYOUT_KEYS, 'shadow', 'mesh', 'cssFloat'].includes(k)) {
        problems.push(`${id}: unknown key ${k}`);
      }
    }
    for (const k of LAYOUT_KEYS) {
      if (e[k] === undefined) continue;
      if (!Number.isFinite(e[k])) problems.push(`${id}.${k}: not finite`);
      else {
        const [lo, hi] = LAYOUT_RANGES[k];
        if (e[k] < lo || e[k] > hi) problems.push(`${id}.${k}: ${e[k]} out of [${lo},${hi}]`);
      }
    }
    if (e.shadow !== undefined) {
      if (!e.shadow || typeof e.shadow !== 'object') problems.push(`${id}.shadow: must be object`);
      else {
        for (const [k, v] of Object.entries(e.shadow)) {
          if (!SHADOW_KEYS.includes(k)) problems.push(`${id}.shadow: unknown key ${k}`);
          else if (!Number.isFinite(v)) problems.push(`${id}.shadow.${k}: not finite`);
          else {
            const [lo, hi] = SHADOW_RANGES[k];
            if (v < lo || v > hi) problems.push(`${id}.shadow.${k}: ${v} out of [${lo},${hi}]`);
          }
        }
      }
    }
    if (e.mesh !== undefined) {
      if (!e.mesh || typeof e.mesh !== 'object') problems.push(`${id}.mesh: must be object`);
      else {
        for (const [k, v] of Object.entries(e.mesh)) {
          if (!MESH_KEYS.includes(k)) problems.push(`${id}.mesh: unknown key ${k}`);
          else if (!Number.isFinite(v)) problems.push(`${id}.mesh.${k}: not finite`);
          else {
            const [lo, hi] = MESH_RANGES[k];
            if (v < lo || v > hi) problems.push(`${id}.mesh.${k}: ${v} out of [${lo},${hi}]`);
          }
        }
      }
    }
    if (e.cssFloat !== undefined) {
      if (!Number.isFinite(e.cssFloat)) problems.push(`${id}.cssFloat: not finite`);
      else {
        const [lo, hi] = CSS_FLOAT_RANGE;
        if (e.cssFloat < lo || e.cssFloat > hi) problems.push(`${id}.cssFloat: ${e.cssFloat} out of [${lo},${hi}]`);
      }
    }
  }
  return problems;
}

export function serializeCharMeta(table, defaults = {}) {
  const pruned = pruneCharMeta(table, defaults);
  const ids = Object.keys(pruned).sort();
  const rows = ids.map((id) => entryLine(id, pruned[id])).join('\n');
  const shadowDef = defaults.shadow || {
    ox: 50, oy: 100, sx: 1, sy: 0.24, skew: 0, blur: 1.5, opacity: 0.62, dx: 0, dy: 0,
  };
  const layoutDef = defaults.layout || { scale: 1, footX: 0, footY: 0 };
  return `${HEADER}
export const CHAR_LAYOUT_DEFAULT = ${inlineObj(layoutDef, LAYOUT_KEYS)};

export const CHAR_SHADOW_DEFAULT = ${inlineObj(shadowDef, SHADOW_KEYS)};

/** Mesh profile keys (absolute overrides on top of art.kind PROFILE). */
export const CHAR_MESH_KEYS = ${JSON.stringify(MESH_KEYS)};

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
${rows}
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

/** Optional CSS idle \`--float-y\` px; null = leave kind stylesheet default. */
export function charCssFloat(id) {
  const v = (_live[id] || {}).cssFloat;
  return Number.isFinite(v) ? v : null;
}

// Vite HMR: swap the live table in place so importers keep working without a full reload.
if (import.meta.hot) {
  import.meta.hot.accept((mod) => {
    if (!mod?.CHAR_META) return;
    Object.assign(CHAR_LAYOUT_DEFAULT, mod.CHAR_LAYOUT_DEFAULT);
    Object.assign(CHAR_SHADOW_DEFAULT, mod.CHAR_SHADOW_DEFAULT);
    _setCharMeta(mod.CHAR_META);
  });
}
`;
}

