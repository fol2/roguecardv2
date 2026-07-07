// Battlefield layout resolver. Data lives in battlefield-layout.js (the file
// the ?bfedit editor rewrites); this module only merges and defaults it.
// Imports nothing DOM-touching; Node-importable (test_engine.js gates it).
import { BF as FILE_BF } from './battlefield-layout.js';

let BF = FILE_BF;
/** Editor/test hook: override the layout in effect (null = back to the file). */
export function _setBF(bf) { BF = bf || FILE_BF; }
export function bfRaw() { return BF; }

const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);
// objects merge key-wise; arrays and scalars replace wholesale (a shape that
// overrides a formation must supply the complete slot array)
function merge(base, over) {
  if (over === undefined) return base;
  if (!isObj(base) || !isObj(over)) return over;
  const out = { ...base };
  for (const k of Object.keys(over)) out[k] = merge(base[k], over[k]);
  return out;
}

// per-layer defaults: x = horizontal offset px from centered, posY =
// object-position Y (crop anchor), drift = idle parallax amplitude px
// (0 = still — the ground must not slide underfoot)
const LAYER_DEFAULTS = {
  backdrop: { x: 0, posY: 100, drift: 6 },
  mid: { x: 0, posY: 100, drift: 3 },
  ledge: { x: 0, posY: 0, drift: 0 },
};

/** Layout chunk for a shape without nested act buckets (acts merge separately). */
function stripActs(chunk) {
  if (!chunk || typeof chunk !== 'object') return chunk;
  const { acts, ...rest } = chunk;
  return rest;
}

/** Per-shape act override; legacy base.acts / top-level BF.acts are read-only fallbacks. */
function actOver(shape, act) {
  const a = String(act);
  return BF.shapes?.[shape]?.acts?.[a]
    ?? (shape === 'pad-landscape' ? BF.base?.acts?.[a] : undefined)
    ?? BF.acts?.[a];
}

/** Deep-merged layout for a stage shape and act (unknown shape ⇒ base only). */
export function bfResolve(shape, act = 0) {
  const shapeChunk = stripActs(BF.shapes?.[shape]);
  const layout = merge(merge(stripActs(BF.base), shapeChunk), actOver(shape, act));
  const layers = {};
  for (const name of ['backdrop', 'mid', 'ledge']) {
    layers[name] = { ...LAYER_DEFAULTS[name], ...(layout.layers?.[name] ?? {}) };
  }
  return { ...layout, layers, shared: BF.shared };
}

/** Hero lift from the ground line (layout scope); art feet correction is bfActor footY. */
export function bfHeroY(layout) {
  return layout.hero?.y ?? 0;
}

/** Per-actor shared modifiers with defaults. kind: 'enemies' | 'heroes'. */
export function bfActor(kind, id) {
  return { scale: 1, footX: 0, footY: 0, ...(BF.shared?.[kind]?.[id] ?? {}) };
}

/** Formation for an enemy count; missing counts interpolate the widest authored one.
 *  Slot: x center, s size multiplier, y lift from the ground line (+up, default 0). */
export function bfSlots(layout, count) {
  const authored = layout.slots?.[count];
  if (authored) return authored;
  const counts = Object.keys(layout.slots ?? {}).map(Number).filter(Number.isFinite).sort((a, b) => a - b);
  if (!counts.length) return Array.from({ length: count }, (_, i) => ({ x: 200 + i * 200, s: 1 }));
  const src = layout.slots[counts[counts.length - 1]];
  const lo = src[0], hi = src[src.length - 1];
  return Array.from({ length: count }, (_, i) => {
    const t = count === 1 ? 1 : i / (count - 1);
    return {
      x: Math.round(lo.x + (hi.x - lo.x) * t),
      s: Math.min(lo.s ?? 1, hi.s ?? 1),
      y: Math.round((lo.y ?? 0) + ((hi.y ?? 0) - (lo.y ?? 0)) * t),
    };
  });
}

/** Per-slot feet offset: slot override wins, else the mob type's shared value. */
export function bfEnemyFootX(slot, key) {
  return slot?.footX ?? bfActor('enemies', key).footX;
}
export function bfEnemyFootY(slot, key) {
  return slot?.footY ?? bfActor('enemies', key).footY;
}

/** Depth sort indices: lower on screen (smaller slot bottom lift) draws in front. */
export function bfEnemyZOrder(slots, keys) {
  const order = slots.map((s, i) => ({ i, bottom: (s?.y ?? 0) + bfEnemyFootY(s, keys[i]) }));
  order.sort((a, b) => b.bottom - a.bottom); // back (high bottom) first → low z
  const z = new Array(slots.length);
  order.forEach((d, rank) => { z[d.i] = rank + 1; });
  return z;
}

/** Art box px for an enemy: tier size × type scale × slot s, typo-guarded. */
export function bfEnemySize(layout, key, tier, slot, stgW, stgH) {
  const t = bfActor('enemies', key);
  const raw = (layout.shared.sizes?.[tier] ?? 185) * t.scale * (slot?.s ?? 1);
  void stgW; void stgH; // kept for call-site stability; no stage-frame clamp
  return Math.round(Math.max(8, raw));
}
