// SPIREBOUND enemy/hero attack choreography — pure DOM keyframe animations.
// Extracted from combat.js (behaviour-preserving); consumed through the frozen
// drainHandlers surface. Imports only the reduced-motion policy flag and the
// mesh flash helper — no closure capture, no combat state.
import { REDUCED } from './policy.js';
import { meshFlash } from '../mesh.js';

const HEAVY_KINDS = new Set(['golem', 'treeboss', 'leviathan', 'crab']);
const FLOATY_KINDS = new Set(['wisp', 'shade', 'siren', 'eye', 'cultist']);
export function choreoAttack(el, dir = 1, kind = 'humanoid') {
  if (REDUCED || !el) return Promise.resolve();
  const heavy = HEAVY_KINDS.has(kind), floaty = FLOATY_KINDS.has(kind);
  const kf = heavy ? [
    { transform: 'translateX(0) scale(1,1)' },
    { transform: 'translateX(0) scale(1.08,0.86)', offset: 0.35 },
    { transform: 'translateX(0) scale(1,1)' },
  ] : floaty ? [
    { transform: 'translateX(0) translateY(0) scale(1,1)' },
    { transform: `translateX(${6 * dir}px) translateY(-5px) scale(0.98,1.02)`, offset: 0.4 },
    { transform: `translateX(${10 * dir}px) translateY(-2px) scale(1,1)`, offset: 0.7 },
    { transform: 'translateX(0) translateY(0) scale(1,1)' },
  ] : [
    { transform: 'translateX(0) scale(1,1)' },
    { transform: `translateX(${-8 * dir}px) scale(0.97,1.02)`, offset: 0.3 },
    { transform: `translateX(${34 * dir}px) scale(1.02,0.99)`, offset: 0.62 },
    { transform: 'translateX(0) scale(1,1)' },
  ];
  el.dataset.choreo = 'attack';
  return el.animate(kf, { duration: heavy ? 420 : floaty ? 380 : 330, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }).finished
    .finally(() => { delete el.dataset.choreo; })
    .catch(() => {});
}
export function choreoHit(el, dir = 1) {
  if (REDUCED || !el) return;
  meshFlash(el);
  el.animate(
    [
      { transform: 'translateX(0) scale(1,1)', filter: 'brightness(1)' },
      { transform: `translateX(${9 * dir}px) scale(0.97,1.03)`, filter: 'brightness(1.9)', offset: 0.25 },
      { transform: 'translateX(0) scale(1,1)', filter: 'brightness(1)' },
    ],
    { duration: 300, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
  );
}
export function choreoStagger(el) {
  if (REDUCED || !el) return Promise.resolve();
  return el.animate(
    [
      { transform: 'translateY(0) rotate(0deg)', filter: 'brightness(1)' },
      { transform: 'translateY(5px) rotate(-2.5deg)', filter: 'brightness(0.6)' },
    ],
    { duration: 360, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'forwards' }
  ).finished.catch(() => {});
}
