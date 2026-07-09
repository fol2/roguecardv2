export const PILE_IDS = ['draw', 'discard', 'ashes'];

/** Preferred degrees between successive fan layers. */
export const PILE_FAN_DEG = 5;
/** Whole fan span cap — when (layers-1)*PILE_FAN_DEG exceeds this, step averages down. */
export const PILE_FAN_MAX_DEG = 30;
/** DOM cap for visible faces (count text stays the true size). */
export const PILE_FAN_MAX_LAYERS = 16;

export function pileTier(count) {
  const n = Math.max(0, Math.floor(Number(count) || 0));
  if (n <= 0) return 0;
  if (n >= 5) return 5;
  return n;
}

/** How many card faces to draw for a fan spread (1..PILE_FAN_MAX_LAYERS). */
export function pileFanLayers(count) {
  const n = Math.max(0, Math.floor(Number(count) || 0));
  if (n <= 0) return 0;
  return Math.min(n, PILE_FAN_MAX_LAYERS);
}

/** Rotation for layer i (0 = bottom). Flat centered fan; step averages when span hits max. */
export function pileFanAngleDeg(i, layers) {
  const n = Math.max(0, Math.floor(layers) || 0);
  const idx = Math.max(0, Math.floor(i) || 0);
  if (n <= 1) return 0;
  const span = Math.min((n - 1) * PILE_FAN_DEG, PILE_FAN_MAX_DEG);
  const step = span / (n - 1);
  return -span / 2 + idx * step;
}

export function pileMasterId(pile) {
  return PILE_IDS.includes(pile) ? pile : 'draw';
}

/** Parallel flight timing: every card flies; wall-clock capped by budgetMs. */
export function flightSchedule(n, budgetMs, {
  maxStagger = 48,
  minStagger = 8,
  flightDur,
} = {}) {
  const count = Math.max(0, Math.floor(n) || 0);
  const budget = Math.max(120, budgetMs | 0);
  if (count <= 0) return { stagger: 0, flightDur: 0, awaitMs: 0 };
  const stagger = count === 1
    ? 0
    : Math.max(minStagger, Math.min(maxStagger, Math.floor(budget / count)));
  const dur = flightDur != null
    ? flightDur
    : Math.max(160, Math.min(420, budget - stagger * Math.min(count - 1, 6)));
  const awaitMs = Math.min(budget + 80, stagger * (count - 1) + dur);
  return { stagger, flightDur: dur, awaitMs };
}

/** Draw-batch timing: arrivals evenly spaced (e.g. 5 cards / 500ms → 100ms stagger). */
export function drawBatchSchedule(n, budgetMs = 500) {
  const count = Math.max(0, Math.floor(n) || 0);
  const budget = Math.max(160, budgetMs | 0);
  if (count <= 0) return { stagger: 0, flightDur: 0, awaitMs: 0 };
  if (count === 1) {
    const flightDur = Math.min(280, budget);
    return { stagger: 0, flightDur, awaitMs: flightDur };
  }
  const stagger = Math.max(40, Math.floor(budget / count));
  const flightDur = Math.max(160, Math.min(280, budget - stagger));
  return { stagger, flightDur, awaitMs: flightDur + stagger * (count - 1) };
}
