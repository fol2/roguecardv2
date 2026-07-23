// Pure resting-hand fan layout (Round 5 Task 27).
// Ported from the P4 DOM seat math — hover/cast lifts never feed this module.

export const HAND_MAX_GAP = 112;
export const HAND_SPAN = 640;
export const HAND_EDGE_RESERVE = 246;
export const HAND_MAX_STEP_DEG = 5;
export const HAND_TOTAL_DEG = 42;
export const HAND_SAG_PER_DEG = 3.2;
export const HAND_MAX_CARDS = 10;
/** Resting translateY base shared with the P4 DOM fan (`+ 26`). */
export const HAND_BASE_Y = 26;
/**
 * Single source for the resting-hand bottom inset: the deepest a resting card
 * may tuck below the stage bottom before the whole fan is lifted to keep it
 * readable. The fanned "cards rise from the bottom edge" look is preserved up
 * to this budget; anything past it is clamped (see `handFanLift`). Tunable.
 */
export const HAND_BOTTOM_INSET = 40;

/**
 * Fan gap for `n` visible seats on a stage of width `stageW`.
 * Matches P4: `Math.min(112, 640 / n, (stageW - 246) / (n - 1))`.
 */
export function handGap(n, stageW) {
  const count = Math.max(1, n | 0);
  return Math.min(
    HAND_MAX_GAP,
    HAND_SPAN / Math.max(count, 1),
    (stageW - HAND_EDGE_RESERVE) / Math.max(count - 1, 1),
  );
}

/** Degrees of fan rotation for seat `i` of `n` (0-based). */
export function handRotationDeg(i, n) {
  const count = Math.max(1, n | 0);
  if (count <= 1) return 0;
  return (i - (count - 1) / 2) * Math.min(HAND_MAX_STEP_DEG, HAND_TOTAL_DEG / count);
}

/** Downward offset (base + widest sag) of the lowest seat in an `n`-card fan. */
export function handMaxDrop(n) {
  const count = Math.max(1, Math.min(HAND_MAX_CARDS, n | 0));
  return Math.abs(handRotationDeg(0, count)) * HAND_SAG_PER_DEG + HAND_BASE_Y;
}

/**
 * Upward lift for the whole resting fan so its lowest card never tucks more than
 * `HAND_BOTTOM_INSET` below the stage bottom. Returns 0 when `stageH` is not a
 * finite number — callers that don't supply a stage bottom keep the frozen P4
 * seat math untouched, so this is a no-op unless the clamp is opted into.
 */
export function handFanLift(n, baseBottom, stageH) {
  if (!Number.isFinite(stageH) || !Number.isFinite(baseBottom)) return 0;
  const deepest = baseBottom + handMaxDrop(n);
  return Math.max(0, deepest - (stageH + HAND_BOTTOM_INSET));
}

/**
 * Resting seat offset relative to the hand-zone centre.
 * `x` is horizontal from centre; `y` is downward sag + base (positive Y down).
 */
export function handSeatOffset(i, n, stageW) {
  const count = Math.max(1, Math.min(HAND_MAX_CARDS, n | 0));
  const index = Math.max(0, Math.min(count - 1, i | 0));
  const gap = handGap(count, stageW);
  const rot = handRotationDeg(index, count);
  const x = (index - (count - 1) / 2) * gap;
  const sagY = Math.abs(rot) * HAND_SAG_PER_DEG;
  return Object.freeze({
    index,
    count,
    gap,
    rot,
    x,
    y: sagY + HAND_BASE_Y,
  });
}

/**
 * Absolute stage-px centre of a resting seat (matches P4 `handSeatCenter`).
 *
 * @param {number} i fan index
 * @param {number} n fan count
 * @param {{ stageW:number, cardW:number, cardH:number, zoneCenterX:number, baseBottom:number, stageH?:number }} opts
 *   `stageH` is optional: when a finite stage height is supplied the fan is
 *   lifted (uniformly, arc intact) to stay within the stage; when omitted the
 *   frozen P4 seat math is returned unchanged.
 */
export function handSeatCenter(i, n, opts) {
  const {
    stageW, cardW, cardH, zoneCenterX, baseBottom, stageH,
  } = opts;
  const off = handSeatOffset(i, n, stageW);
  const lift = handFanLift(off.count, baseBottom, stageH);
  return Object.freeze({
    index: off.index,
    count: off.count,
    gap: off.gap,
    rot: off.rot,
    x: zoneCenterX + off.x,
    y: baseBottom - cardH / 2 + off.y - lift,
    width: cardW,
    height: cardH,
    left: zoneCenterX + off.x - cardW / 2,
    top: baseBottom - cardH + off.y - lift,
    right: zoneCenterX + off.x + cardW / 2,
    bottom: baseBottom + off.y - lift,
  });
}

/**
 * Layout every resting seat for a fan of `n` cards (capped at HAND_MAX_CARDS).
 * @returns {ReadonlyArray<object>}
 */
export function layoutHandSeats(n, opts) {
  const count = Math.max(0, Math.min(HAND_MAX_CARDS, n | 0));
  const seats = [];
  for (let i = 0; i < count; i += 1) {
    seats.push(handSeatCenter(i, count, opts));
  }
  return Object.freeze(seats);
}

/** Hand-zone width that hugs the fan (matches P4 `handZoneWidth`). */
export function handZoneWidth(n, stageW, cardW) {
  const count = Math.max(1, n | 0);
  const gap = handGap(count, stageW);
  const span = count <= 1 ? cardW : (count - 1) * gap + cardW;
  return Math.min(stageW - 24, Math.max(cardW + 16, Math.ceil(span + 20)));
}
