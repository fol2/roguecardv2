// Deterministic serializer + validator for src/ward-params.js.
// Shared by the vfx editor (browser) and the vite save plugin (node).

export const WARD_KEYS = [
  'pad', 'opacity', 'transparency', 'growMs', 'sites',
  'edgeSoftness', 'centerDip', 'refraction', 'transmission', 'ior',
  'thickness', 'normalScale', 'roughness', 'envMapIntensity', 'tint', 'idleWobble',
];

export const WARD_RANGES = {
  pad: [1, 1.8],
  opacity: [0, 1],
  transparency: [0, 1],
  growMs: [80, 2000],
  sites: [4, 32],
  edgeSoftness: [0, 0.5],
  centerDip: [0, 1],
  refraction: [0, 2],
  transmission: [0, 1],
  ior: [1, 2.4],
  thickness: [0, 0.6],
  normalScale: [0, 3],
  roughness: [0, 0.5],
  envMapIntensity: [0, 1],
};

const HEADER = `// Ward shell defaults — owned by ?vfxedit=1 Save (POST /__ward-save).
// Imported by mesh.js; Reset restores from these values.
`;

const num = (v) => {
  const r = Math.round(v * 1000) / 1000;
  return Object.is(r, -0) ? '0' : String(r);
};

const str = (v) => JSON.stringify(String(v));

export function validateWardParams(params) {
  const problems = [];
  if (!params || typeof params !== 'object' || Array.isArray(params)) {
    return ['root must be a ward params object'];
  }
  for (const k of Object.keys(params)) {
    if (!WARD_KEYS.includes(k)) problems.push(`unknown key: ${k}`);
  }
  for (const k of WARD_KEYS) {
    if (params[k] === undefined) {
      problems.push(`missing key: ${k}`);
      continue;
    }
    const v = params[k];
    if (k === 'tint') {
      if (typeof v !== 'string' || !/^#[0-9a-fA-F]{6}$/.test(v)) {
        problems.push('tint: need #RRGGBB');
      }
      continue;
    }
    if (k === 'idleWobble') {
      if (typeof v !== 'boolean') problems.push('idleWobble: need boolean');
      continue;
    }
    if (!Number.isFinite(v)) {
      problems.push(`${k}: not finite`);
      continue;
    }
    if (k === 'sites' || k === 'growMs') {
      if (!Number.isInteger(v)) problems.push(`${k}: need integer`);
    }
    const range = WARD_RANGES[k];
    if (range) {
      const [lo, hi] = range;
      if (v < lo || v > hi) problems.push(`${k}: ${v} out of [${lo},${hi}]`);
    }
  }
  return problems;
}

function inlineDefaults(params) {
  const lines = WARD_KEYS.map((k) => {
    const v = params[k];
    if (k === 'tint') return `  ${k}: ${str(v)},`;
    if (k === 'idleWobble') return `  ${k}: ${v ? 'true' : 'false'},`;
    return `  ${k}: ${num(v)},`;
  });
  return `{\n${lines.join('\n')}\n}`;
}

/** Full src/ward-params.js source from a params object. */
export function serializeWardParams(params) {
  return `${HEADER}export const WARD_DEFAULTS = ${inlineDefaults(params)};

/** Soft-apply after Save / HMR — mutates the shared defaults object in place. */
export function _setWardDefaults(next) {
  if (!next || typeof next !== 'object') return;
  Object.assign(WARD_DEFAULTS, next);
}

if (import.meta.hot) {
  import.meta.hot.accept((mod) => {
    if (!mod?.WARD_DEFAULTS) return;
    _setWardDefaults(mod.WARD_DEFAULTS);
  });
}
`;
}
