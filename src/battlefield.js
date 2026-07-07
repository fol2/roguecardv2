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

/** Deep-merged layout for a stage shape (unknown shape ⇒ base). */
export function bfResolve(shape) {
  const layout = merge(BF.base, BF.shapes?.[shape]);
  const layers = {};
  for (const name of ['backdrop', 'mid', 'ledge']) {
    layers[name] = { ...LAYER_DEFAULTS[name], ...(layout.layers?.[name] ?? {}) };
  }
  return { ...layout, layers, shared: BF.shared };
}

/** Per-actor shared modifiers with defaults. kind: 'enemies' | 'heroes'. */
export function bfActor(kind, id) {
  return { scale: 1, footY: 0, ...(BF.shared?.[kind]?.[id] ?? {}) };
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

/** Depth sort indices: lower on screen (smaller slot bottom lift) draws in front. */
export function bfEnemyZOrder(slots, footYs) {
  const order = slots.map((s, i) => ({ i, bottom: (s?.y ?? 0) + (footYs[i] ?? 0) }));
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
