// UI chrome layout — owned by the chrome editor (?bfuiedit=1 on the dev
// server), hand edits welcome: keep the shape, keep numbers finite.
// All values are STAGE px for their shape (see src/stage.js). Safe-area is
// baked into these numbers (no + var(--sa*) at apply-time).
// Conventions:
//   left / right — CSS edge anchors (exactly one of left|right per widget);
//                  for hand, left/right is offset from the centred fan box
//   bottom       — distance from stage bottom (combat chrome + hand)
//   top          — distance from stage top (omen + relics)
//   w / h        — optional box size (lantern, end-turn, piles)
//   scale        — uniform scale (1 = authored size); omen / relics / hand
//   hud.height   — .hud-bar content height unit
//   hud.scale    — uniform scale on .hud-bar (1 = authored size)
// Imports nothing; imported by src/uic.js only.

// Editor-owned authored data. The exported UIC applies a pile de-overlap clamp
// (resolver logic below) so stacked draw/discard/ashes widgets never collide on
// narrow shapes — the numbers here stay as authored; the clamp derives the fix.
const UIC_DATA = {
  base: {
    energy: { left: 24, bottom: 148 },
    lantern: { left: 42, bottom: 262, w: 104, h: 104 },
    endTurn: { right: 22, bottom: 128, w: 120, h: 120 },
    draw: { left: 16, bottom: 14, w: 96, h: 148 },
    discard: { right: 22, bottom: 14, w: 96, h: 148 },
    ashes: { right: 132, bottom: 14, w: 96, h: 148 },
    hud: { height: 56, scale: 1 },
    omen: { left: 16, top: 62, scale: 1 },
    relics: { left: 66, top: 62, scale: 1 },
    hand: { left: 0, bottom: -12, scale: 1 },
  },
  shapes: {
    'phone-portrait': {
      energy: { left: 5, bottom: 575 },
      lantern: { left: 5, bottom: 476, w: 78, h: 78 },
      endTurn: { right: 296, bottom: 359, w: 96, h: 96 },
      draw: { left: 317, bottom: 634, w: 68, h: 108 },
      discard: { right: 5, bottom: 526, w: 68, h: 108 },
      ashes: { right: 5, bottom: 418, w: 68, h: 108 },
      hud: { height: 47, scale: 1 },
      omen: { left: 10, top: 52, scale: 1 },
      relics: { left: 52, top: 52, scale: 1 },
      hand: { left: 0, bottom: -6, scale: 1 },
    },
    'phone-landscape': {
      energy: { left: 0, bottom: 133 },
      lantern: { left: 2, bottom: 236, w: 68, h: 68 },
      endTurn: { right: 0, bottom: 264, w: 84, h: 84 },
      draw: { left: 5, bottom: 5, w: 64, h: 102 },
      discard: { right: 5, bottom: 105, w: 64, h: 102 },
      ashes: { right: 5, bottom: 5, w: 64, h: 102 },
      hud: { height: 34, scale: 1 },
      omen: { left: 12, top: 40, scale: 1 },
      relics: { left: 56, top: 40, scale: 1 },
      hand: { left: 0, bottom: -33, scale: 1 },
    },
    'pad-portrait': {
      energy: { left: 6, bottom: 665 },
      lantern: { left: 10, bottom: 772, w: 94, h: 94 },
      endTurn: { right: 9, bottom: 654, w: 104, h: 104 },
      draw: { left: 0, bottom: 140, w: 96, h: 148 },
      discard: { right: 0, bottom: 140, w: 96, h: 148 },
      ashes: { right: 0, bottom: 0, w: 96, h: 148 },
    },
    'pad-landscape': {
      energy: { left: 0, bottom: 162 },
      lantern: { left: 18, bottom: 268, w: 104, h: 104 },
      endTurn: { right: 0, bottom: 163, w: 120, h: 120 },
    },
    'desktop-landscape': {
      energy: { left: 4, bottom: 161 },
      lantern: { left: 18, bottom: 267, w: 104, h: 104 },
      endTurn: { right: 7, bottom: 162, w: 120, h: 120 },
      draw: { left: 17, bottom: 14, w: 96, h: 148 },
    },
  },
};

// ---- Pile de-overlap clamp (resolver logic, not rebaked coordinates) --------
// draw/discard/ashes are bottom-anchored boxes; two of them collide only when
// they sit in the same stage column (same edge anchor, overlapping widths) and
// their vertical spans overlap. When that happens, lift the upper widget so its
// box just clears the lower one — stays within the safe-area (moves up, away
// from the stage bottom). Same-column detection is width-space only, so it needs
// no stage width (keeps this file import-free / Node-safe).
const PILES = ['draw', 'discard', 'ashes'];

function pileSpan(p) {
  if (!p || !Number.isFinite(p.w)) return null;
  const side = p.left !== undefined ? 'left' : (p.right !== undefined ? 'right' : null);
  if (!side) return null;
  return { side, lo: p[side], hi: p[side] + p.w };
}

function sameColumn(a, b) {
  const sa = pileSpan(a);
  const sb = pileSpan(b);
  return !!sa && !!sb && sa.side === sb.side && Math.min(sa.hi, sb.hi) > Math.max(sa.lo, sb.lo);
}

/** Resolve overlaps within one scope's own piles by lifting the upper widget. */
function deoverlapScope(w) {
  if (!w) return w;
  for (let i = 0; i < PILES.length; i += 1) {
    for (let j = i + 1; j < PILES.length; j += 1) {
      const a = w[PILES[i]];
      const b = w[PILES[j]];
      if (!a || !b || !sameColumn(a, b)) continue;
      if (!Number.isFinite(a.bottom) || !Number.isFinite(b.bottom)
        || !Number.isFinite(a.h) || !Number.isFinite(b.h)) continue;
      const lower = a.bottom <= b.bottom ? a : b;
      const upper = lower === a ? b : a;
      const clearBottom = lower.bottom + lower.h; // touch the lower box, no overlap
      if (upper.bottom < clearBottom) upper.bottom = clearBottom;
    }
  }
  return w;
}

function clampPiles(uic) {
  deoverlapScope(uic.base);
  for (const shape of Object.values(uic.shapes ?? {})) deoverlapScope(shape);
  return uic;
}

export const UIC = clampPiles(UIC_DATA);
