// Round 5 ticker-driven tween primitive. Node-safe: it uses only a supplied
// clock (`now`) and callbacks; no DOM, no Pixi, no matchMedia at import time.
// Under REDUCED motion policy the tween applies `endState` once and reports
// `motion:'reduced'` — every ceremony still terminates deterministically.

import { EASING, isReducedTier } from './tokens.js';

const easingLookup = Object.freeze({
  outSoft: EASING.outSoft,
  spring: EASING.spring,
});

function normaliseEasing(easing) {
  if (Array.isArray(easing) && easing.length === 4) return easing;
  if (typeof easing === 'string' && easingLookup[easing]) return easingLookup[easing];
  return EASING.outSoft;
}

// Robertson cubic-bezier sampler with binary search over t.
function cubicBezier(curve) {
  const [x1, y1, x2, y2] = curve;
  const bezier = (t, p1, p2) => {
    const c = 3 * p1;
    const b = 3 * (p2 - p1) - c;
    const a = 1 - c - b;
    return ((a * t + b) * t + c) * t;
  };
  return (progress) => {
    if (progress <= 0) return 0;
    if (progress >= 1) return 1;
    let lo = 0;
    let hi = 1;
    for (let i = 0; i < 20; i += 1) {
      const mid = (lo + hi) / 2;
      const x = bezier(mid, x1, x2);
      if (x < progress) lo = mid;
      else hi = mid;
    }
    return bezier((lo + hi) / 2, y1, y2);
  };
}

/**
 * Interpolate between `from` and `to` — numbers or plain objects with numeric
 * leaf values. Non-number leaves in `to` snap without interpolation.
 */
function interpolate(from, to, ratio) {
  if (typeof to === 'number' && typeof from === 'number') {
    return from + (to - from) * ratio;
  }
  if (to && typeof to === 'object' && !Array.isArray(to)) {
    const out = {};
    for (const key of Object.keys(to)) {
      out[key] = interpolate(from?.[key], to[key], ratio);
    }
    return out;
  }
  return to;
}

const defaultClock = () => (typeof performance !== 'undefined' && performance.now
  ? performance.now()
  : Date.now());

/**
 * Start a tween.
 *
 * @param {object} opts
 * @param {*} opts.from - starting value (numeric or plain object of numerics)
 * @param {*} opts.to - target value
 * @param {number} opts.duration - target duration in milliseconds
 * @param {string|number[]} [opts.easing] - `outSoft` | `spring` | 4-tuple
 * @param {(value:*)=>void} [opts.onUpdate] - called on every settle tick
 * @param {*} [opts.endState] - final value applied on completion (defaults to `to`)
 * @param {object} [opts.policy] - `{ motion:'reduced' }` collapses the tween
 * @param {(cb:(t:number)=>void)=>void} [opts.schedule] - test-injectable scheduler
 * @param {()=>number} [opts.now] - test-injectable clock
 * @returns {{ cancel:()=>void, done:Promise<{outcome:'settled'|'cancelled', motion:'normal'|'reduced'}> }}
 */
export function tween({
  from,
  to,
  duration,
  easing,
  onUpdate,
  endState,
  policy,
  schedule,
  now,
} = {}) {
  const clock = typeof now === 'function' ? now : defaultClock;
  const runSchedule = typeof schedule === 'function'
    ? schedule
    : (cb) => (typeof requestAnimationFrame === 'function'
      ? requestAnimationFrame(cb)
      : setTimeout(() => cb(clock()), 16));
  const reducedTerminal = endState === undefined ? to : endState;
  const normalTerminal = to;
  const reduced = isReducedTier(policy);
  let cancelled = false;
  let resolve;
  const done = new Promise((r) => { resolve = r; });

  if (reduced) {
    if (onUpdate) onUpdate(reducedTerminal);
    resolve({ outcome: 'settled', motion: 'reduced' });
    return Object.freeze({ cancel() {}, done });
  }

  const totalMs = Math.max(0, Number(duration) || 0);
  if (!(totalMs > 0)) {
    if (onUpdate) onUpdate(normalTerminal);
    resolve({ outcome: 'settled', motion: 'normal' });
    return Object.freeze({ cancel() {}, done });
  }

  const ease = cubicBezier(normaliseEasing(easing));
  const start = clock();
  const step = () => {
    if (cancelled) {
      resolve({ outcome: 'cancelled', motion: 'normal' });
      return;
    }
    const elapsed = clock() - start;
    if (elapsed >= totalMs) {
      if (onUpdate) onUpdate(normalTerminal);
      resolve({ outcome: 'settled', motion: 'normal' });
      return;
    }
    const ratio = ease(elapsed / totalMs);
    if (onUpdate) onUpdate(interpolate(from, to, ratio));
    runSchedule(step);
  };

  runSchedule(step);

  return Object.freeze({
    cancel() {
      cancelled = true;
    },
    done,
  });
}

/**
 * Convenience wrapper for cases where the caller only needs the final result
 * (returns a Promise that resolves to the outcome descriptor).
 */
export function tweenTo(opts) {
  return tween(opts).done;
}

/**
 * Run a named screen ceremony: barrier + presentation span + tween, settling
 * on a stable `endState` attribute (REDUCED collapses via `tween` policy).
 *
 * @returns {{ cancel:()=>void, done: Promise<{outcome:'settled'|'cancelled'|'failed', motion:'normal'|'reduced'}> }}
 */
export function runNamedCeremony({
  name,
  endState,
  barrier,
  trace,
  from,
  to,
  duration,
  easing,
  onUpdate,
  policy,
  schedule,
  now,
} = {}) {
  if (typeof name !== 'string' || !name.trim()) {
    throw new TypeError('runNamedCeremony requires a non-empty name');
  }
  if (typeof endState !== 'string' || !endState.trim()) {
    throw new TypeError('runNamedCeremony requires a named endState');
  }
  const token = barrier?.begin?.(name) || { finish() {}, cancel() {} };
  const span = trace?.begin?.(`presentation.${name}`, {
    attributes: { endState },
  }) || { finish() {} };
  const runner = tween({
    from: from ?? 0,
    to: to ?? 1,
    duration: duration ?? 0,
    easing,
    onUpdate,
    endState: to ?? 1,
    policy,
    schedule,
    now,
  });
  const done = runner.done.then((result) => {
    if (result.outcome === 'cancelled') {
      span.finish?.('cancelled', { attributes: { motion: result.motion, endState } });
      token.cancel?.();
      return result;
    }
    span.finish?.('settled', {
      attributes: { motion: result.motion, endState },
    });
    token.finish?.();
    return result;
  }, (error) => {
    span.finish?.('failed', { reason: 'presentation-error' });
    token.cancel?.();
    throw error;
  });
  return Object.freeze({
    cancel() { runner.cancel?.(); },
    done,
  });
}

/**
 * Run ordered ceremony phases under one parent presentation span.
 * REDUCED collapses to a single terminal parent span with `endState` and
 * applies each phase's terminal `to` value once (no intermediate motion).
 *
 * @returns {{ cancel:()=>void, done: Promise<{outcome:'settled'|'cancelled'|'failed', motion:'normal'|'reduced', phases:string[]}> }}
 */
export function runPhasedCeremony({
  name,
  phases = [],
  endState,
  barrier,
  trace,
  policy,
  schedule,
  now,
  onPhase,
} = {}) {
  if (typeof name !== 'string' || !name.trim()) {
    throw new TypeError('runPhasedCeremony requires a non-empty name');
  }
  if (typeof endState !== 'string' || !endState.trim()) {
    throw new TypeError('runPhasedCeremony requires a named endState');
  }
  const list = Array.isArray(phases) ? phases : [];
  const phaseIds = list.map((phase) => {
    if (typeof phase === 'string') return phase;
    return phase?.id;
  }).filter((id) => typeof id === 'string' && id.trim());

  const reduced = isReducedTier(policy);
  const token = barrier?.begin?.(name) || { finish() {}, cancel() {} };
  let cancelled = false;
  let resolve;
  const done = new Promise((r) => { resolve = r; });

  const finishParent = (outcome, motion) => {
    const span = trace?.begin?.(`presentation.${name}`, {
      attributes: { endState, phase: phaseIds[phaseIds.length - 1] || null },
    }) || { finish() {} };
    // Parent start was deferred for REDUCED — emit start+end as one terminal beat.
    span.finish?.(outcome, { attributes: { motion, endState } });
    if (outcome === 'settled') token.finish?.();
    else token.cancel?.();
  };

  const run = async () => {
    const invokePhaseHook = async (id, value, motion) => {
      if (typeof onPhase === 'function') {
        await onPhase(id, value, { motion });
      }
    };

    if (reduced) {
      for (const phase of list) {
        if (cancelled) break;
        const id = typeof phase === 'string' ? phase : phase?.id;
        const to = typeof phase === 'object' && phase ? phase.to : 1;
        const stepSpan = trace?.begin?.(`presentation.${name}`, {
          attributes: { phase: id, endState },
        }) || { finish() {} };
        try {
          await invokePhaseHook(id, to, 'reduced');
          if (typeof phase === 'object' && typeof phase.run === 'function') {
            await phase.run({ motion: 'reduced' });
          } else if (typeof phase === 'object' && phase?.onUpdate) {
            phase.onUpdate(to);
          }
          stepSpan.finish?.('settled', { attributes: { motion: 'reduced', endState, phase: id } });
        } catch (error) {
          stepSpan.finish?.('failed', { reason: 'presentation-error', attributes: { phase: id } });
          finishParent('failed', 'reduced');
          resolve({ outcome: 'failed', motion: 'reduced', phases: phaseIds });
          throw error;
        }
      }
      if (cancelled) {
        finishParent('cancelled', 'reduced');
        resolve({ outcome: 'cancelled', motion: 'reduced', phases: phaseIds });
        return;
      }
      finishParent('settled', 'reduced');
      resolve({ outcome: 'settled', motion: 'reduced', phases: phaseIds });
      return;
    }

    const parentSpan = trace?.begin?.(`presentation.${name}`, {
      attributes: { endState },
    }) || { finish() {} };
    try {
      for (const phase of list) {
        if (cancelled) break;
        const id = typeof phase === 'string' ? phase : phase?.id;
        const stepSpan = trace?.begin?.(`presentation.${name}`, {
          attributes: {
            phase: id,
            endState: (typeof phase === 'object' && phase?.endState) || endState,
          },
        }) || { finish() {} };
        await invokePhaseHook(id, typeof phase === 'object' ? phase.to : 1, 'normal');
        if (typeof phase === 'object' && typeof phase.run === 'function') {
          await phase.run({ motion: 'normal' });
          stepSpan.finish?.('settled', {
            attributes: { motion: 'normal', phase: id, endState },
          });
          continue;
        }
        const duration = typeof phase === 'object' ? (phase.duration ?? 0) : 0;
        const runner = tween({
          from: (typeof phase === 'object' ? phase.from : 0) ?? 0,
          to: (typeof phase === 'object' ? phase.to : 1) ?? 1,
          duration,
          easing: (typeof phase === 'object' ? phase.easing : undefined) || 'outSoft',
          onUpdate: typeof phase === 'object' ? phase.onUpdate : undefined,
          policy,
          schedule,
          now,
        });
        const result = await runner.done;
        if (cancelled || result.outcome === 'cancelled') {
          stepSpan.finish?.('cancelled', { attributes: { motion: result.motion, phase: id, endState } });
          parentSpan.finish?.('cancelled', { attributes: { motion: result.motion, endState } });
          token.cancel?.();
          resolve({ outcome: 'cancelled', motion: result.motion, phases: phaseIds });
          return;
        }
        stepSpan.finish?.('settled', {
          attributes: { motion: result.motion, phase: id, endState },
        });
      }
      if (cancelled) {
        parentSpan.finish?.('cancelled', { attributes: { motion: 'normal', endState } });
        token.cancel?.();
        resolve({ outcome: 'cancelled', motion: 'normal', phases: phaseIds });
        return;
      }
      parentSpan.finish?.('settled', { attributes: { motion: 'normal', endState } });
      token.finish?.();
      resolve({ outcome: 'settled', motion: 'normal', phases: phaseIds });
    } catch (error) {
      parentSpan.finish?.('failed', { reason: 'presentation-error' });
      token.cancel?.();
      resolve({ outcome: 'failed', motion: 'normal', phases: phaseIds });
      throw error;
    }
  };

  void run();
  return Object.freeze({
    cancel() { cancelled = true; },
    done,
  });
}
