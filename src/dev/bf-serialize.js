// Deterministic serializer + validator for src/battlefield-layout.js.
// Shared by the editor (browser) and the vite save plugin (node): imports nothing.
const SHAPES = ['phone-portrait', 'phone-landscape', 'pad-portrait', 'pad-landscape', 'desktop-landscape'];
const LAYER_KEYS = ['h', 'y', 'x', 'zoom', 'posX', 'posY', 'opacity', 'drift'];
// resolver-defaulted layer keys: legal to omit anywhere, bfResolve fills them in
const LAYER_OPTIONAL = ['x', 'posY', 'drift'];

const HEADER = `// Battlefield layout — owned by the battlefield editor (?bfedit=1 on the dev
// server), hand edits welcome: keep the shape, keep numbers finite.
// All values are STAGE px for their shape (see src/stage.js). Conventions:
//   x       — actor's horizontal CENTER
//   footY   — feet offset from the ground line (art whose feet aren't at the
//             sprite's bottom edge), + is up
//   scale   — multiplies the tier size (sizes.normal/elite/boss)
//   slot.s  — per-formation size multiplier (keeps wide lineups on-ledge)
//   slot.y  — per-formation lift from the ground line (+up, default 0)
//   layers  — h: plate height; y: plate bottom offset from stage bottom (+up);
//             x: horizontal offset from centered (+right); zoom: image scale;
//             posX/posY: crop focus % (object-position); opacity;
//             drift: idle parallax amplitude px (0 = still).
//             Internal key "ledge" = the ground PNG plate (actN-ledge.png).
// Imports nothing; imported by src/battlefield.js only.
`;

const num = (v) => {
  const r = Math.round(v * 1000) / 1000;
  return Object.is(r, -0) ? '0' : String(r);
};
// one actor/slot/layer per line, keys in insertion-stable fixed order
function inline(obj, keyOrder = null) {
  const keys = keyOrder ? keyOrder.filter((k) => obj[k] !== undefined) : Object.keys(obj);
  const rest = Object.keys(obj).filter((k) => !keys.includes(k)); // preserves e.g. parts:{}
  return `{ ${[...keys, ...rest].map((k) => `${JSON.stringify(k).match(/^"[a-zA-Z_$][\w$]*"$/) ? k : JSON.stringify(k)}: ${typeof obj[k] === 'number' ? num(obj[k]) : JSON.stringify(obj[k])}`).join(', ')} }`;
}
function actorsBlock(map, indent) {
  return Object.keys(map).sort().map((id) => `${indent}${/^[a-zA-Z_$][\w$]*$/.test(id) ? id : JSON.stringify(id)}: ${inline(map[id], ['scale', 'footY'])},`).join('\n');
}
function layoutBlock(layout, indent) {
  const out = [];
  if (layout.groundY !== undefined) out.push(`${indent}groundY: ${num(layout.groundY)},`);
  if (layout.ledgeLip !== undefined) out.push(`${indent}ledgeLip: ${num(layout.ledgeLip)},`);
  if (layout.hero) out.push(`${indent}hero: ${inline(layout.hero, ['x', 'w', 'h'])},`);
  if (layout.slots) {
    out.push(`${indent}slots: {`);
    for (const n of Object.keys(layout.slots).sort((a, b) => a - b)) {
      out.push(`${indent}  ${n}: [${layout.slots[n].map((s) => inline(s, ['x', 'y', 's'])).join(', ')}],`);
    }
    out.push(`${indent}},`);
  }
  if (layout.layers) {
    out.push(`${indent}layers: {`);
    for (const l of ['backdrop', 'mid', 'ledge']) {
      if (layout.layers[l]) out.push(`${indent}  ${l}: ${inline(layout.layers[l], LAYER_KEYS)},`);
    }
    out.push(`${indent}},`);
  }
  return out.join('\n');
}

export function serializeBF(bf) {
  const out = [HEADER, 'export const BF = {', '  shared: {'];
  out.push(`    sizes: ${inline(bf.shared.sizes, ['normal', 'elite', 'boss'])},`);
  out.push('    heroes: {', actorsBlock(bf.shared.heroes, '      '), '    },');
  out.push('    enemies: {', actorsBlock(bf.shared.enemies, '      '), '    },');
  out.push('  },', '  base: {', layoutBlock(bf.base, '    '), '  },', '  shapes: {');
  for (const sh of SHAPES) {
    const o = bf.shapes?.[sh];
    if (o && Object.keys(o).length) out.push(`    '${sh}': {`, layoutBlock(o, '      '), '    },');
  }
  out.push('  },', '};', '');
  return out.join('\n');
}

export function validateBF(bf, ids = null) {
  const problems = [];
  const finite = (v, name) => { if (!Number.isFinite(v)) problems.push(`${name} is not a finite number (${v})`); };
  if (!bf || typeof bf !== 'object') return ['payload is not an object'];
  if (!bf.shared?.sizes || !bf.base) return ['missing shared.sizes or base'];
  for (const t of ['normal', 'elite', 'boss']) finite(bf.shared.sizes[t], `shared.sizes.${t}`);
  for (const kind of ['heroes', 'enemies']) {
    for (const [id, a] of Object.entries(bf.shared[kind] ?? {})) {
      finite(a.scale, `shared.${kind}.${id}.scale`);
      finite(a.footY, `shared.${kind}.${id}.footY`);
      if (ids && !ids[kind].includes(id)) problems.push(`shared.${kind}.${id}: unknown id`);
    }
  }
  const checkLayout = (layout, name, isBase) => {
    if (isBase) {
      finite(layout.groundY, `${name}.groundY`);
      finite(layout.ledgeLip, `${name}.ledgeLip`);
      for (const n of [1, 2, 3]) if (!Array.isArray(layout.slots?.[n])) problems.push(`${name}.slots.${n} missing`);
    }
    if (layout.groundY !== undefined) finite(layout.groundY, `${name}.groundY`);
    if (!isBase && layout.ledgeLip !== undefined) finite(layout.ledgeLip, `${name}.ledgeLip`);
    if (layout.hero) for (const k of Object.keys(layout.hero)) finite(layout.hero[k], `${name}.hero.${k}`);
    for (const [n, arr] of Object.entries(layout.slots ?? {})) {
      if (!Array.isArray(arr) || arr.length !== Number(n)) problems.push(`${name}.slots.${n}: needs exactly ${n} entries`);
      else arr.forEach((s, i) => {
        finite(s.x, `${name}.slots.${n}[${i}].x`);
        finite(s.s, `${name}.slots.${n}[${i}].s`);
        if (s.y !== undefined) finite(s.y, `${name}.slots.${n}[${i}].y`); // per-slot lift, optional
      });
    }
    for (const [l, p] of Object.entries(layout.layers ?? {})) {
      if (!['backdrop', 'mid', 'ledge'].includes(l)) problems.push(`${name}.layers.${l}: unknown layer`);
      // shape overrides merge key-wise, so partial layer objects are legal there
      else for (const k of LAYER_KEYS) {
        if (p[k] === undefined && (!isBase || LAYER_OPTIONAL.includes(k))) continue;
        finite(p[k], `${name}.layers.${l}.${k}`);
      }
    }
  };
  checkLayout(bf.base, 'base', true);
  for (const [sh, o] of Object.entries(bf.shapes ?? {})) {
    if (!SHAPES.includes(sh)) problems.push(`shapes.${sh}: unknown shape`);
    else checkLayout(o, `shapes.${sh}`, false);
  }
  return problems;
}
