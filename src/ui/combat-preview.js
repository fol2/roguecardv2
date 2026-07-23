// SPIREBOUND combat hand-preview display values.
// Pure preview mirror extracted from combat.js (behaviour-preserving): reads the
// engine preview + shared UI state and returns plain display descriptors that
// buildHandModel folds into the Pixi hand model. Imports only the engine and the
// shared UI state singleton — no closure capture, no DOM.
import * as E from '../engine.js';
import { S } from './context.js';

/** Which foe the hand preview resolves against (drives vulnerable). Explicit
 *  targeting selection wins; otherwise auto-lock a lone survivor; else null
 *  (str/weak still apply, vulnerable does not). */
export function previewTargetIdx(cb) {
  const sel = S.selectedEnemyIndex;
  if (Number.isInteger(sel) && cb.enemies[sel]?.hp > 0) return sel;
  const alive = [];
  cb.enemies.forEach((e, i) => { if (e.hp > 0) alive.push(i); });
  return alive.length === 1 ? alive[0] : null;
}

const VALUE_MARKER_RE = /([@#])(\d+)\1/g;
/**
 * Preview-resolve each @n@ (damage) / #n# (ward) body marker for a hand card
 * so the face shows Strength/Weak/relic-adjusted numbers, tinted green/red —
 * the same treatment the cost already gets. Returns a `{value,state}` list in
 * body-marker order (null entries = neutral/base), or null when nothing
 * differs from the authored base (keeps the authored face + cache key stable).
 */
export function handCardDisplayValues(cb, inst, text, targetIdx) {
  const src = String(text ?? '');
  const markers = [];
  VALUE_MARKER_RE.lastIndex = 0;
  let m;
  while ((m = VALUE_MARKER_RE.exec(src))) markers.push({ marker: m[1], base: Number(m[2]) });
  if (!markers.length) return null;
  let preview = null;
  try { preview = E.previewPlay(S.run, cb, inst, targetIdx); } catch { preview = null; }
  if (!preview) return null;
  const hits = Array.isArray(preview.hits) ? preview.hits : [];
  let hitIdx = 0;
  let blockUsed = false;
  let overrode = false;
  // '@' markers walk the damage hits in effect order; '#' markers take the
  // (single) resolved ward. Unmatched markers stay neutral on the base value.
  const values = markers.map(({ marker, base }) => {
    let resolved = null;
    if (marker === '@') {
      if (hitIdx < hits.length) { resolved = hits[hitIdx].dmg; hitIdx += 1; }
    } else if (!blockUsed && preview.block > 0) {
      resolved = preview.block;
      blockUsed = true;
    }
    if (resolved == null || resolved === base) return null;
    overrode = true;
    return { value: resolved, state: resolved > base ? 'boosted' : 'reduced' };
  });
  return overrode ? values : null;
}
