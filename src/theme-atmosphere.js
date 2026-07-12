// Pure theme atmosphere resolve — Node-safe (no three.js / DOM).

export const ATMOSPHERES = Object.freeze(['ash', 'mire', 'astral']);

/** @param {unknown} value */
export function isAtmosphere(value) {
  return value === 'ash' || value === 'mire' || value === 'astral';
}

/**
 * Prefer explicit theme.atmosphere; fall back to weather.vy heuristics only when missing.
 * Rising (both vy < 0) → astral; slow fall (max |vy| < 20) → mire; else ash.
 * @param {{ atmosphere?: string, weather?: { vy?: number[] } }|null|undefined} theme
 * @returns {'ash'|'mire'|'astral'}
 */
export function resolveAtmosphere(theme) {
  if (isAtmosphere(theme?.atmosphere)) return theme.atmosphere;
  const vy = theme?.weather?.vy;
  const rising = Array.isArray(vy) && vy[0] < 0 && vy[1] < 0;
  const slow = Array.isArray(vy) && Math.max(...vy.map(Math.abs)) < 20 && !rising;
  return rising ? 'astral' : slow ? 'mire' : 'ash';
}
