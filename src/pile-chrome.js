export const PILE_IDS = ['draw', 'discard', 'ashes'];

export function pileTier(count) {
  const n = Math.max(0, Math.floor(Number(count) || 0));
  if (n <= 0) return 0;
  if (n >= 5) return 5;
  return n;
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
