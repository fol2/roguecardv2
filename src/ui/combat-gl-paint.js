// SPIREBOUND combat-gl pure paint-support helpers.
// Extracted from combat-gl.js (behaviour-preserving): stateless stage-px rect
// geometry, DOM plate-widget measurement, and card-face descriptor shaping used
// by the combat renderer's paint pass. No Pixi objects, no renderer caches — the
// stateful paint bodies stay in combat-gl.js where they own the render caches.
import { stageRect } from '../stage.js';

export function rectOf(r) {
  if (!r) return null;
  return Object.freeze({
    left: r.left, top: r.top, right: r.right, bottom: r.bottom,
    width: r.width, height: r.height,
  });
}

/** Centre of a measured stageRect, or null when the host is missing. */
export function seatCenter(r) {
  if (!r || !(r.width > 0) || !(r.height > 0)) return null;
  return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height };
}

export function unionBounds(...parts) {
  const rs = parts.filter((b) => b && b.right > b.left && b.bottom > b.top);
  if (!rs.length) return null;
  const left = Math.min(...rs.map((r) => r.left));
  const right = Math.max(...rs.map((r) => r.right));
  const top = Math.min(...rs.map((r) => r.top));
  const bottom = Math.max(...rs.map((r) => r.bottom));
  return rectOf({ left, right, top, bottom, width: right - left, height: bottom - top });
}

/** Measure per-widget plate chrome seats that still exist as layout hosts. */
export function measurePlateWidgets(plateEl, topEl) {
  if (!plateEl) {
    return {
      wrapBounds: null, blockBounds: null, iconBounds: null,
      vialBounds: null, labelBounds: null, intentBounds: null,
      wrapClientWidth: 0, wrapScrollWidth: 0,
    };
  }
  const wrap = plateEl.querySelector('.hpbar-wrap');
  const block = plateEl.querySelector('.block-chip');
  const icon = block?.querySelector('.ui-icon,.gicon');
  const vial = plateEl.querySelector('.hp-vial');
  const label = plateEl.querySelector('.hp-label');
  const intent = topEl?.querySelector('.intent');
  const nodeRect = (node) => {
    if (!node) return null;
    const r = stageRect(node);
    return r.width > 0 && r.height > 0 ? rectOf(r) : null;
  };
  return {
    wrapBounds: nodeRect(wrap),
    blockBounds: nodeRect(block),
    iconBounds: nodeRect(icon),
    vialBounds: nodeRect(vial),
    labelBounds: nodeRect(label),
    intentBounds: nodeRect(intent),
    wrapClientWidth: wrap ? wrap.clientWidth : 0,
    wrapScrollWidth: wrap ? wrap.scrollWidth : 0,
  };
}

export function faceDescriptor(card) {
  return {
    id: card.id,
    name: card.name,
    text: card.text,
    cost: card.cost,
    rarity: card.rarity,
    type: card.type,
    up: card.up,
  };
}

export function faceDisplayState(card) {
  return {
    up: !!card.upgraded,
    effectiveCost: card.effectiveCost,
    effectiveText: card.effectiveText,
    // Preview-resolved @n@/#n# body values (boosted=green/reduced=red),
    // computed in combat.js buildHandModel via engine previewPlay. Folded into
    // the face cache key by faceCacheKeyFor so the bake splits per value set.
    values: card.values || null,
  };
}
