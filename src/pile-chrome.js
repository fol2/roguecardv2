export const PILE_IDS = ['draw', 'discard', 'ashes'];

/**
 * Experience-contract wall-clock budgets (Full) for pile ceremonies.
 * E2E asserts discardHand / reshuffle parent settle windows at CPU 4×.
 */
export const CEREMONY_BUDGET_MS = Object.freeze({
  draw: 260,
  discard: 320,
  discardHand: 440,
  exhaust: 500,
  reshuffle: 600,
});

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

/**
 * Ceremony-aware stagger caps from the P5 pile-flight contract.
 * @param {'draw'|'discard'|'discardHand'|'exhaust'|'reshuffle'|string} [ceremony]
 */
export function ceremonyStaggerCap(ceremony, budgetMs) {
  const budget = Math.max(120, budgetMs | 0);
  const caps = {
    draw: Math.min(24, budget),
    discard: Math.min(28, budget),
    discardHand: Math.min(24, budget),
    exhaust: 0,
    reshuffle: Math.min(22, budget),
  };
  if (ceremony && caps[ceremony] != null) return caps[ceremony];
  return Math.min(48, budget);
}

/** Parallel flight timing: every card flies; wall-clock capped by budgetMs. */
export function flightSchedule(n, budgetMs, {
  maxStagger = 48,
  minStagger = 8,
  flightDur,
  ceremony,
} = {}) {
  const count = Math.max(0, Math.floor(n) || 0);
  const budget = Math.max(120, budgetMs | 0);
  if (count <= 0) return { stagger: 0, flightDur: 0, awaitMs: 0 };
  const cap = ceremony != null ? ceremonyStaggerCap(ceremony, budget) : maxStagger;
  const stagger = count === 1
    ? 0
    : Math.max(minStagger, Math.min(cap, Math.floor(budget / count)));
  const dur = flightDur != null
    ? flightDur
    : Math.max(160, Math.min(budget, budget - stagger * Math.min(count - 1, 6)));
  // Parent await equals the ceremony budget so CPU-throttled wall clocks stay
  // inside the Task 28 assertion windows (discardHand 320–480, reshuffle 450–650).
  const awaitMs = ceremony && CEREMONY_BUDGET_MS[ceremony]
    ? CEREMONY_BUDGET_MS[ceremony]
    : Math.min(budget + 80, stagger * (count - 1) + dur);
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
