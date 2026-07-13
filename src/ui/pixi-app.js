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
} from 'pixi.js';

import { readShakeOffset } from '../vfx.js';

const RENDERER_PREFERENCE = Object.freeze(['webgl']);

function deepFreeze(value) {
  if (value === null || typeof value !== 'object') return value;
  for (const key of Object.keys(value)) deepFreeze(value[key]);
  return Object.freeze(value);
}

function cloneImmutable(value) {
  return deepFreeze(JSON.parse(JSON.stringify(value ?? null)));
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
  if (!observer) return { filterClass: 'ColorMatrixFilter' };
  try {
    const info = await observer.loseSingleDetachedContext();
    trace?.emit?.('renderer.prewarm', {
      outcome: 'completed',
      attributes: {
        stage: 'shader-prewarm',
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
 * @returns {Promise<object>} the frozen lifecycle handle.
 */
export async function createPixiLayer({
  canvas,
  stage,
  policy,
  trace,
  snapshot: initialSnapshot,
  observer,
} = {}) {
  if (!canvas || typeof canvas.getContext !== 'function') {
    throw new TypeError('createPixiLayer requires a canvas element');
  }
  if (!stage || typeof stage.width !== 'function' || typeof stage.height !== 'function') {
    throw new TypeError('createPixiLayer requires a stage descriptor');
  }
  const resolutionFn = typeof stage.resolution === 'function'
    ? stage.resolution
    : () => 1;

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

  const setStatus = (next) => {
    status = next;
    transitions.push(next);
    trace?.emit?.('renderer.state', {
      outcome: next === 'failed' ? 'failed' : 'completed',
      attributes: { rendererId: 'pixi', state: next, generation },
    });
  };

  const attachShakeSync = () => {
    if (!application || !worldRoot) return;
    shakeHandler = () => {
      if (frozen) return;
      clockTick += 1;
      const offset = readShakeOffset();
      worldRoot.position.set(offset.x, offset.y);
    };
    application.ticker.add(shakeHandler, undefined, UPDATE_PRIORITY.HIGH);
  };

  const detachShakeSync = () => {
    if (shakeHandler && application?.ticker) {
      application.ticker.remove(shakeHandler);
    }
    shakeHandler = null;
  };

  const buildRenderer = async () => {
    application = new Application();
    await application.init({
      canvas,
      width: stage.width(),
      height: stage.height(),
      resolution: resolutionFn(),
      autoDensity: false,
      antialias: true,
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
    try {
      const oldExtension = lossExtension;
      const oldContext = renderer?.gl;
      const restored = new Promise((resolve) => {
        canvas.addEventListener('webglcontextrestored', resolve, { once: true });
      });
      if (oldExtension) {
        oldExtension.restoreContext();
        await Promise.race([
          restored,
          new Promise((_, reject) => setTimeout(() => reject(new Error('Pixi context restore timed out')), 5000)),
        ]);
      }
      if (oldContext && !oldContext.isContextLost()) {
        oldExtension?.loseContext();
      }
      teardownRenderer({ preserveCanvas: true });
      await buildRenderer();
      setStatus('ready');
    } catch (error) {
      setStatus('failed');
      trace?.emit?.('renderer.rebuild', {
        outcome: 'failed',
        attributes: { rendererId: 'pixi', code: error.message },
      });
      throw error;
    }
    return stats();
  };

  const freezeForTest = async ({ atTick = 0 } = {}) => {
    frozen = true;
    frozenTick = Number.isFinite(atTick) ? Number(atTick) : 0;
    application?.ticker?.stop?.();
    return stats();
  };
  const unfreezeForTest = () => {
    frozen = false;
    application?.ticker?.start?.();
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
    // testing hooks (Task 21 Step 8)
    loseContextForTest,
    rebuild,
    freezeForTest,
    unfreezeForTest,
    // metadata
    policy: policy ? Object.freeze({ ...policy }) : Object.freeze({}),
    pixiVersion: PIXI_VERSION,
    rendererPreference: RENDERER_PREFERENCE,
  });
}
