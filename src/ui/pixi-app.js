// Round 5 production Pixi lifecycle. Owns one `Application`, wires the shake
// offset onto the root, and exposes a deterministic freeze/lose/restore
// surface. The engine and the DOM never see Pixi through this module; the UI
// composition root is the sole caller of `createPixiLayer`.
//
// Lifecycle states: 'idle' → 'ready' → ('lost' → 'rebuilding' → 'ready') |
// 'failed'. `snapshot` is immutable plain data — never `run`, `cb`, DOM or
// Pixi references.

import {
  Application,
  ColorMatrixFilter,
  Container,
  GlProgram,
  UPDATE_PRIORITY,
  VERSION as PIXI_VERSION,
  getTestContext,
} from 'pixi.js';

import { readShakeOffset, subscribeShake } from '../vfx.js';

const RENDERER_PREFERENCE = Object.freeze(['webgl']);

const FULL_TIER_MAX_RESOLUTION = 2;
const LITE_TIER_MAX_RESOLUTION = 1;

function resolveTierCap(policy) {
  return policy?.tier === 'lite' ? LITE_TIER_MAX_RESOLUTION : FULL_TIER_MAX_RESOLUTION;
}

function deepFreeze(value) {
  if (value === null || typeof value !== 'object') return value;
  for (const key of Object.keys(value)) deepFreeze(value[key]);
  return Object.freeze(value);
}

function cloneImmutable(value) {
  return deepFreeze(JSON.parse(JSON.stringify(value ?? null)));
}

async function loseDetachedTestContext() {
  // Pixi's `getTestContext` returns a lazily created WebGL context on a
  // detached canvas that it uses to compile shader programs. If we leave it
  // live, the eventual `uigl` context becomes the *fourth* live WebGL owner
  // on WebKit's ~4-context ceiling. We explicitly lose it here so `uigl` is
  // always the third and final live owner at steady state.
  let context;
  try {
    context = getTestContext();
  } catch (error) {
    return { used: false, reason: error?.message || 'getTestContext-threw' };
  }
  if (!context || typeof context.getExtension !== 'function') {
    return { used: false, reason: 'no-test-context' };
  }
  if (context.isContextLost()) return { used: false, reason: 'already-lost' };
  const extension = context.getExtension('WEBGL_lose_context');
  if (!extension) return { used: false, reason: 'no-lose-context-ext' };
  const canvas = context.canvas;
  const lost = canvas && typeof canvas.addEventListener === 'function'
    ? new Promise((resolve) => {
      const handler = (event) => {
        event.preventDefault?.();
        resolve();
      };
      canvas.addEventListener('webglcontextlost', handler, { once: true });
    })
    : Promise.resolve();
  extension.loseContext();
  await Promise.race([
    lost,
    new Promise((_, reject) => setTimeout(
      () => reject(new Error('detached test context loss timed out')),
      5000,
    )),
  ]);
  return { used: true, contextLost: context.isContextLost() };
}

async function prewarmDetachedShaderContext({ observer, trace }) {
  // Force Pixi to compile at least one filter program on a detached context
  // and then explicitly lose it. This guarantees the eventual uigl context is
  // the third and final live WebGL owner while ColorMatrixFilter's shader
  // program is already cached.
  const foil = new ColorMatrixFilter();
  foil.hue(18, false);
  foil.brightness(1.08, true);
  if (!(foil instanceof ColorMatrixFilter) || !(foil.glProgram instanceof GlProgram)) {
    throw new Error('ColorMatrixFilter is not backed by a real GlProgram');
  }
  if (observer) {
    try {
      const info = await observer.loseSingleDetachedContext();
      trace?.emit?.('renderer.prewarm', {
        outcome: 'completed',
        attributes: {
          stage: 'shader-prewarm',
          via: 'observer',
          contextLost: info.contextLost === true,
        },
      });
      return { filterClass: 'ColorMatrixFilter', detachedContext: info };
    } catch (error) {
      trace?.emit?.('renderer.prewarm', {
        outcome: 'failed',
        attributes: { code: error.message },
      });
      return { filterClass: 'ColorMatrixFilter', prewarmError: error.message };
    }
  }
  try {
    const info = await loseDetachedTestContext();
    trace?.emit?.('renderer.prewarm', {
      outcome: info.used ? 'completed' : 'skipped',
      attributes: {
        stage: 'shader-prewarm',
        via: 'getTestContext',
        used: info.used === true,
        contextLost: info.contextLost === true,
        reason: info.reason || null,
      },
    });
    return { filterClass: 'ColorMatrixFilter', detachedContext: info };
  } catch (error) {
    trace?.emit?.('renderer.prewarm', {
      outcome: 'failed',
      attributes: { code: error.message },
    });
    return { filterClass: 'ColorMatrixFilter', prewarmError: error.message };
  }
}

/**
 * Boot the production Pixi UI layer.
 *
 * @param {object} deps
 * @param {HTMLCanvasElement} deps.canvas         The `#uigl` canvas element.
 * @param {{ width():number, height():number, resolution():number }} deps.stage
 *   Callable accessors so the layer can refit on stage changes without
 *   coupling to a specific module.
 * @param {object} [deps.policy]                  Renderer/motion tier policy.
 * @param {{ emit?:Function }} [deps.trace]       Behaviour-trace sink.
 * @param {*} [deps.snapshot]                     Optional restore snapshot.
 * @param {object} [deps.observer]                Test-only context observer.
 * @param {() => void} [deps.onContextLoss]       Cancel pointer/tooltip on loss.
 * @returns {Promise<object>} the frozen lifecycle handle.
 */
export async function createPixiLayer({
  canvas: initialCanvas,
  stage,
  policy,
  trace,
  snapshot: initialSnapshot,
  observer,
  settle,
  onContextLoss,
} = {}) {
  let canvas = initialCanvas;
  if (!canvas || typeof canvas.getContext !== 'function') {
    throw new TypeError('createPixiLayer requires a canvas element');
  }
  if (!stage || typeof stage.width !== 'function' || typeof stage.height !== 'function') {
    throw new TypeError('createPixiLayer requires a stage descriptor');
  }
  const resolutionFn = typeof stage.resolution === 'function'
    ? stage.resolution
    : () => 1;
  const awaitSettle = typeof settle === 'function' ? settle : async () => true;

  let status = 'idle';
  let generation = 0;
  const transitions = [];
  let currentSnapshot = initialSnapshot ? cloneImmutable(initialSnapshot) : null;
  let frozen = false;
  let frozenTick = 0;
  let clockTick = 0;
  let renderer = null;
  let application = null;
  let worldRoot = null;
  let lossExtension = null;
  let shakeHandler = null;
  let contextLossResolve = null;
  let recoveryJourney = null;
  let shakeSyncLatched = false;
  let shakeUnsubscribe = null;
  let onContextLossHandler = typeof onContextLoss === 'function' ? onContextLoss : null;

  const setStatus = (next) => {
    status = next;
    transitions.push(next);
    trace?.emit?.('renderer.state', {
      outcome: next === 'failed' ? 'failed' : 'completed',
      attributes: { rendererId: 'pixi', state: next, generation },
    });
  };

  const emitContextRecovery = (state, { reason = 'webglcontextlost' } = {}) => {
    const details = {
      outcome: state === 'failed' ? 'failed' : 'completed',
      reason,
      attributes: {
        rendererId: 'pixi',
        state,
        generation,
        cause: reason,
      },
    };
    if (recoveryJourney?.correlationId) {
      details.correlationId = recoveryJourney.correlationId;
    }
    if (recoveryJourney?.lastSeq) {
      details.causeSeq = recoveryJourney.lastSeq;
    }
    const record = trace?.emit?.('renderer.context-recovery', details);
    if (record?.seq) {
      recoveryJourney = {
        correlationId: details.correlationId || recoveryJourney?.correlationId
          || `ctx-recovery-${generation}-${record.seq}`,
        lastSeq: record.seq,
      };
      // Ensure the first record also carries the correlation id in text.
      if (!details.correlationId && recoveryJourney.correlationId) {
        // already emitted; subsequent rows share the id
      }
    }
    return record;
  };

  const beginContextRecovery = (reason = 'webglcontextlost') => {
    recoveryJourney = {
      correlationId: `ctx-recovery-${generation}-${Date.now()}`,
      lastSeq: null,
    };
    return emitContextRecovery('lost', { reason });
  };

  const attachShakeSync = () => {
    if (!application || !worldRoot) return;
    shakeHandler = () => {
      if (frozen) return;
      clockTick += 1;
      const offset = readShakeOffset();
      worldRoot.position.set(offset.x, offset.y);
      const active = offset.x !== 0 || offset.y !== 0;
      if (active && !shakeSyncLatched) {
        shakeSyncLatched = true;
        trace?.emit?.('presentation.shake-sync', {
          outcome: 'completed',
          attributes: {
            rendererId: 'pixi',
            shakeX: offset.x,
            shakeY: offset.y,
          },
        });
      } else if (!active) {
        shakeSyncLatched = false;
      }
    };
    application.ticker.add(shakeHandler, undefined, UPDATE_PRIORITY.HIGH);
    // Activation-time emit so a single V.shake() is observable even before the
    // next VFX rAF writes non-zero offsets (freeze is one-way on the VFX loop).
    shakeUnsubscribe?.();
    shakeUnsubscribe = subscribeShake(({ power, reduced }) => {
      if (frozen || shakeSyncLatched) return;
      shakeSyncLatched = true;
      trace?.emit?.('presentation.shake-sync', {
        outcome: 'completed',
        attributes: {
          rendererId: 'pixi',
          power: power ?? 0,
          reduced: reduced === true,
          shakeX: 0,
          shakeY: 0,
        },
      });
    });
  };

  const detachShakeSync = () => {
    if (shakeHandler && application?.ticker) {
      application.ticker.remove(shakeHandler);
    }
    shakeHandler = null;
    shakeUnsubscribe?.();
    shakeUnsubscribe = null;
  };

  const computeResolution = () => {
    const raw = Number(resolutionFn()) || 1;
    const cap = resolveTierCap(policy);
    return Math.min(Math.max(raw, 0.5), cap);
  };

  const buildRenderer = async () => {
    application = new Application();
    await application.init({
      canvas,
      width: stage.width(),
      height: stage.height(),
      resolution: computeResolution(),
      autoDensity: false,
      antialias: false,
      backgroundAlpha: 0,
      preference: RENDERER_PREFERENCE,
      powerPreference: 'high-performance',
    });
    renderer = application.renderer;
    if (!renderer?.gl) {
      throw new Error('createPixiLayer received a non-WebGL renderer');
    }
    lossExtension = renderer.gl.getExtension('WEBGL_lose_context');
    worldRoot = new Container();
    application.stage.addChild(worldRoot);
    canvas.addEventListener('webglcontextlost', handleContextLoss);
    attachShakeSync();
    generation += 1;
  };

  const handleContextLoss = (event) => {
    event.preventDefault();
    if (status !== 'ready') return;
    setStatus('lost');
    beginContextRecovery('webglcontextlost');
    try { onContextLossHandler?.(); } catch { /* cancel best-effort */ }
    if (contextLossResolve) {
      contextLossResolve();
      contextLossResolve = null;
    }
  };

  const readSnapshot = () => currentSnapshot;

  const writeSnapshot = (value) => {
    currentSnapshot = value === null || value === undefined
      ? null
      : cloneImmutable(value);
    return currentSnapshot;
  };

  const stats = () => ({
    status,
    generation,
    rendererKind: renderer ? 'pixi' : null,
    rendererPreference: [...RENDERER_PREFERENCE],
    pixiVersion: PIXI_VERSION,
    tick: clockTick,
    frozen,
    frozenTick: frozen ? frozenTick : null,
    transitions: [...transitions],
    hasSnapshot: currentSnapshot !== null,
  });

  const boot = async () => {
    try {
      await prewarmDetachedShaderContext({ observer, trace });
      await buildRenderer();
      setStatus('ready');
    } catch (error) {
      setStatus('failed');
      trace?.emit?.('renderer.init', {
        outcome: 'failed',
        attributes: { rendererId: 'pixi', code: error.message },
      });
      throw error;
    }
  };

  const teardownRenderer = ({ preserveCanvas = true } = {}) => {
    detachShakeSync();
    if (application) {
      application.stop();
      application.destroy({ removeView: false }, { children: true });
    }
    application = null;
    worldRoot = null;
    renderer = null;
    lossExtension = null;
    if (!preserveCanvas) canvas.remove();
  };

  const loseContextForTest = async () => {
    if (!lossExtension) throw new Error('WEBGL_lose_context is unavailable');
    if (status !== 'ready') throw new Error(`cannot lose Pixi context from ${status}`);
    const lost = new Promise((resolve) => { contextLossResolve = resolve; });
    lossExtension.loseContext();
    await Promise.race([
      lost,
      new Promise((_, reject) => setTimeout(() => reject(new Error('Pixi context loss timed out')), 5000)),
    ]);
    return stats();
  };

  const rebuild = async () => {
    if (status !== 'lost') throw new Error(`cannot rebuild Pixi from ${status}`);
    setStatus('rebuilding');
    emitContextRecovery('rebuilding', { reason: 'webglcontextlost' });
    try {
      const oldCanvas = canvas;
      // Stop the ticker before touching GL so Pixi does not try to render
      // into the lost context during teardown.
      application?.stop?.();
      // The context is already dead (WEBGL_lose_context.loseContext or a real
      // browser-initiated loss). Rather than try to restore-then-re-lose the
      // orphaned context on the same host — which is racy in headless
      // Chromium — we destroy the old Application and swap in a fresh clone
      // of the canvas element. This preserves the DOM slot ordering and
      // guarantees the observer never sees two live `uigl` contexts.
      teardownRenderer({ preserveCanvas: true });
      const replacement = oldCanvas.cloneNode(false);
      oldCanvas.replaceWith(replacement);
      canvas = replacement;
      await buildRenderer();
      // A rebuild while frozen must keep the new ticker stopped at the same
      // named tick until unfreezeForTest runs.
      if (frozen) {
        clockTick = frozenTick;
        application?.ticker?.stop?.();
        writeSnapshot({
          ...(currentSnapshot && typeof currentSnapshot === 'object' ? currentSnapshot : {}),
          frozen: true,
          frozenTick,
          generation,
        });
      }
      setStatus('ready');
      emitContextRecovery('ready', { reason: 'webglcontextlost' });
      recoveryJourney = null;
    } catch (error) {
      setStatus('failed');
      emitContextRecovery('failed', { reason: error.message || 'rebuild-failed' });
      recoveryJourney = null;
      trace?.emit?.('renderer.rebuild', {
        outcome: 'failed',
        attributes: { rendererId: 'pixi', code: error.message },
      });
      throw error;
    }
    return stats();
  };

  const freezeForTest = async ({ atTick = 0 } = {}) => {
    await awaitSettle();
    frozen = true;
    frozenTick = Number.isFinite(atTick) ? Number(atTick) : 0;
    clockTick = frozenTick;
    application?.ticker?.stop?.();
    writeSnapshot({
      ...(currentSnapshot && typeof currentSnapshot === 'object' ? currentSnapshot : {}),
      frozen: true,
      frozenTick,
      generation,
    });
    return stats();
  };
  const unfreezeForTest = () => {
    frozen = false;
    application?.ticker?.start?.();
    if (currentSnapshot && typeof currentSnapshot === 'object') {
      const next = { ...currentSnapshot, frozen: false };
      delete next.frozenTick;
      writeSnapshot(next);
    }
    return stats();
  };

  await boot();

  return Object.freeze({
    // lifecycle
    status: () => status,
    generation: () => generation,
    stats,
    snapshot: readSnapshot,
    writeSnapshot,
    destroy() {
      detachShakeSync();
      teardownRenderer({ preserveCanvas: false });
      setStatus('idle');
    },
    // roots
    application: () => application,
    root: () => worldRoot,
    // testing hooks
    loseContextForTest,
    rebuild,
    freezeForTest,
    unfreezeForTest,
    setOnContextLoss(handler) {
      onContextLossHandler = typeof handler === 'function' ? handler : null;
    },
    // metadata
    policy: policy ? Object.freeze({ ...policy }) : Object.freeze({}),
    pixiVersion: PIXI_VERSION,
    rendererPreference: RENDERER_PREFERENCE,
  });
}
