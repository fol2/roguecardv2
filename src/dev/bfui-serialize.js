// Deterministic serializer + validator for src/ui-chrome-layout.js.
// Shared by the editor (browser) and the vite save plugin (node): imports nothing.
const SHAPES = ['phone-portrait', 'phone-landscape', 'pad-portrait', 'pad-landscape', 'desktop-landscape'];
const POS_WIDGETS = ['energy', 'lantern', 'endTurn', 'draw', 'discard', 'ashes'];
const POS_KEYS = ['left', 'right', 'bottom', 'w', 'h'];
const HUD_KEYS = ['height', 'scale'];

const HEADER = `// UI chrome layout — owned by the chrome editor (?bfuiedit=1 on the dev
// server), hand edits welcome: keep the shape, keep numbers finite.
// All values are STAGE px for their shape (see src/stage.js). Safe-area is
// baked into these numbers (no + var(--sa*) at apply-time).
// Conventions:
//   left / right — CSS edge anchors (exactly one of left|right per widget)
//   bottom       — distance from stage bottom
//   w / h        — optional box size (lantern, end-turn, piles)
//   hud.height   — .hud-bar content height unit
//   hud.scale    — uniform scale on .hud-bar (1 = authored size)
// Imports nothing; imported by src/uic.js only.
`;

const num = (v) => {
  const r = Math.round(v * 1000) / 1000;
  return Object.is(r, -0) ? '0' : String(r);
};
function inline(obj, keyOrder) {
  const keys = keyOrder.filter((k) => obj[k] !== undefined);
  return `{ ${keys.map((k) => `${k}: ${num(obj[k])}`).join(', ')} }`;
}
function widgetBlock(widgets, indent) {
  const out = [];
  for (const id of POS_WIDGETS) {
    if (widgets[id]) out.push(`${indent}${id}: ${inline(widgets[id], POS_KEYS)},`);
  }
  if (widgets.hud) out.push(`${indent}hud: ${inline(widgets.hud, HUD_KEYS)},`);
  return out.join('\n');
}

export function serializeUIC(uic) {
  const out = [HEADER, 'export const UIC = {', '  base: {', widgetBlock(uic.base, '    '), '  },', '  shapes: {'];
  for (const sh of SHAPES) {
    const o = uic.shapes?.[sh];
    if (o && Object.keys(o).length) out.push(`    '${sh}': {`, widgetBlock(o, '      '), '    },');
    else out.push(`    '${sh}': {},`);
  }
  out.push('  },', '};', '');
  return out.join('\n');
}

function checkPos(w, name, problems, requireFull) {
  if (!w || typeof w !== 'object') {
    if (requireFull) problems.push(`${name} missing`);
    return;
  }
  const hasL = w.left !== undefined;
  const hasR = w.right !== undefined;
  if (requireFull || hasL || hasR || w.bottom !== undefined) {
    if (hasL === hasR) problems.push(`${name}: need exactly one of left|right`);
    if (w.bottom === undefined && requireFull) problems.push(`${name}.bottom missing`);
  }
  for (const k of Object.keys(w)) {
    if (![...POS_KEYS].includes(k)) problems.push(`${name}.${k}: unknown key`);
    else if (!Number.isFinite(w[k])) problems.push(`${name}.${k} is not a finite number (${w[k]})`);
  }
}

function checkHud(h, name, problems, requireFull) {
  if (!h || typeof h !== 'object') {
    if (requireFull) problems.push(`${name} missing`);
    return;
  }
  if (requireFull) {
    if (!Number.isFinite(h.height)) problems.push(`${name}.height is not a finite number`);
    if (!Number.isFinite(h.scale)) problems.push(`${name}.scale is not a finite number`);
  }
  for (const k of Object.keys(h)) {
    if (!HUD_KEYS.includes(k)) problems.push(`${name}.${k}: unknown key`);
    else if (!Number.isFinite(h[k])) problems.push(`${name}.${k} is not a finite number (${h[k]})`);
  }
}

export function validateUIC(uic) {
  const problems = [];
  if (!uic || typeof uic !== 'object') return { ok: false, problems: ['payload is not an object'] };
  if (!uic.base) return { ok: false, problems: ['missing base'] };
  for (const id of POS_WIDGETS) checkPos(uic.base[id], `base.${id}`, problems, true);
  checkHud(uic.base.hud, 'base.hud', problems, true);
  for (const [sh, o] of Object.entries(uic.shapes ?? {})) {
    if (!SHAPES.includes(sh)) problems.push(`shapes.${sh}: unknown shape`);
    else if (o && typeof o === 'object') {
      for (const id of POS_WIDGETS) {
        if (o[id] !== undefined) checkPos(o[id], `shapes.${sh}.${id}`, problems, false);
      }
      if (o.hud !== undefined) checkHud(o.hud, `shapes.${sh}.hud`, problems, false);
      for (const k of Object.keys(o)) {
        if (![...POS_WIDGETS, 'hud'].includes(k)) problems.push(`shapes.${sh}.${k}: unknown widget`);
      }
    }
  }
  return { ok: problems.length === 0, problems };
}
