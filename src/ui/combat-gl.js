// Task 22a — combat Pixi renderer seam (scaffold).
//
// This module owns the eventual Pixi-side combat presenter. Round 5 Task 22
// is delivered in three slices; this file lands 22a:
//
//   - Freezes the interface (`createCombatRenderer`) so PR16/PR17 can build on
//     a stable seam without further churn.
//   - Registers/preloads the 27 ui/*.png + 3 piles/*.png textures through the
//     Pixi asset system and gates a `textured-ready` promise on the 17
//     combat-blocking chrome ids plus the 3 piles. If a texture fails to
//     load, the renderer emits a trace warning and keeps going — the vector
//     fallback in `widgets.js` covers the missing face.
//   - Bridges freeze / loseContextForTest / unfreezeForTest through the
//     Task 21 `pixiLayer`, so tests can drive the combat renderer via the
//     same handles used elsewhere.
//
// The scaffold does NOT yet paint combat chrome — DOM still owns visuals
// (dual-write). `readUI()` mirrors DOM geometry (via `uicResolve` and the
// battlefield resolver) so callers can already query the seam in stage px.
// `sync(presentationModel)` deep-freezes and stashes the model — PR16 fills
// the model shape, PR17 turns it into Pixi display objects.

import { Assets, Container } from 'pixi.js';

import { assetUrl } from '../art.js';
import {
  bfActor, bfEnemyFrame, bfHeroY, bfResolve, bfSlots,
} from '../battlefield.js';
import { stageH, stageInfo, stageRect, stageW } from '../stage.js';
import { relicBarLayout, uicResolve } from '../uic.js';

/** 17 combat-blocking chrome ids (`node-*` are map-only, non-blocking). */
export const COMBAT_BLOCKING_UI_IDS = Object.freeze([
  'candle-lit', 'candle-spent',
  'facet-empty', 'facet-chipped',
  'hp-vial-frame', 'heart', 'coin', 'deck', 'menu', 'ward',
  'end-turn', 'lantern',
  'intent-attack', 'intent-block', 'intent-buff', 'intent-debuff', 'intent-heal',
]);

/** Full 27-icon ui/ atlas (blocking + 10 map-node icons). Kept in one place so
 *  the renderer preloads the same set the DOM chrome falls back to. */
export const COMBAT_UI_TEXTURE_IDS = Object.freeze([
  ...COMBAT_BLOCKING_UI_IDS,
  'node-frame', 'node-monster', 'node-elite', 'node-event', 'node-rest',
  'node-shop', 'node-treasure', 'node-boss', 'node-monument', 'node-unlit',
]);

/** Pile faces; all three are combat-blocking (draw/discard/ashes seats). */
export const COMBAT_PILE_TEXTURE_IDS = Object.freeze(['draw', 'discard', 'ashes']);

/** Presentation model version — probe surface must observe `version === 2`. */
export const COMBAT_RENDERER_VERSION = 2;

const RENDERER_ID = 'combat-gl';

function deepFreeze(value, seen = new WeakSet()) {
  if (value === null || typeof value !== 'object') return value;
  if (seen.has(value)) return value;
  seen.add(value);
  if (Array.isArray(value)) {
    for (const item of value) deepFreeze(item, seen);
    return Object.freeze(value);
  }
  const proto = Object.getPrototypeOf(value);
  if (proto !== Object.prototype && proto !== null) {
    throw new TypeError('combat-gl presentation model must contain plain data only');
  }
  for (const key of Object.keys(value)) deepFreeze(value[key], seen);
  return Object.freeze(value);
}

function cloneImmutable(value) {
  if (value === undefined) return null;
  return deepFreeze(JSON.parse(JSON.stringify(value)));
}

function rectOf(r) {
  if (!r) return null;
  return Object.freeze({
    left: r.left, top: r.top, right: r.right, bottom: r.bottom,
    width: r.width, height: r.height,
  });
}

function centerOf(r) {
  if (!r) return null;
  return Object.freeze({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
}

function domRect(selector, root = null) {
  if (typeof document === 'undefined') return null;
  const scope = root || document;
  const node = scope.querySelector?.(selector);
  if (!node) return null;
  const r = stageRect(node);
  return r.width > 0 && r.height > 0 ? r : null;
}

/**
 * Boot the combat Pixi renderer seam.
 *
 * @param {object} deps
 * @param {HTMLCanvasElement} [deps.canvas]        Optional canvas reference
 *   (kept for parity with the Task 22b/22c signature; the scaffold does not
 *   own its own canvas — the Task 21 layer owns `#uigl`).
 * @param {object} [deps.actions]                  Engine action bag reserved
 *   for PR17 input plumbing (`play`, `endTurn`, `useArt`, …). Unused in 22a.
 * @param {object} [deps.tooltip]                  Tooltip owner reserved for
 *   PR17. Unused in 22a.
 * @param {{ emit?:Function }} [deps.trace]        Behaviour-trace sink.
 * @param {object} [deps.tokens]                   Design tokens (colour /
 *   type / duration). Unused in 22a but validated so callers pass the
 *   frozen table PR16/PR17 expect.
 * @param {object} [deps.pixiLayer]                Optional Task 21 lifecycle
 *   handle. When omitted, resolves from `globalThis.spirebound.pixi` so the
 *   frozen plan signature `{ canvas, actions, tooltip, trace, tokens }` still
 *   boots after `createPixiLayer`.
 * @returns {Promise<object>} the frozen renderer handle.
 */
export async function createCombatRenderer({
  canvas = null,
  actions = null,
  tooltip = null,
  trace = null,
  tokens = null,
  pixiLayer: pixiLayerArg = null,
} = {}) {
  const pixiLayer = pixiLayerArg
    || globalThis.spirebound?.pixi
    || null;
  if (!pixiLayer || typeof pixiLayer.root !== 'function') {
    throw new TypeError('createCombatRenderer requires a Pixi lifecycle handle (pass pixiLayer or boot createPixiLayer first)');
  }

  // Optional parameters are stashed for later slices; capturing them here
  // keeps the eventual `{ actions, tooltip, tokens }` wiring one edit away.
  void canvas; void actions; void tooltip; void tokens;

  const container = new Container();
  container.label = 'combat-gl-root';
  // Scaffold: DOM chrome still owns paint; keep the root hidden until 22b.
  container.visible = false;
  container.eventMode = 'none';
  const layerRoot = pixiLayer.root();
  if (layerRoot && layerRoot.addChild) layerRoot.addChild(container);

  const transitions = [];
  let state = 'idle';
  let generation = 0;
  let interactionMode = 'off';
  let presentationModel = null;
  let hitTestBias = null;
  const textureAliases = new Map();
  const textureErrors = [];
  let blockingLoaded = 0;
  const blockingExpected = COMBAT_BLOCKING_UI_IDS.length + COMBAT_PILE_TEXTURE_IDS.length;
  let texturedReady = false;
  let destroyed = false;

  const setState = (next) => {
    state = next;
    transitions.push(next);
    trace?.emit?.('renderer.state', {
      outcome: next === 'failed' ? 'failed' : 'completed',
      attributes: { rendererId: RENDERER_ID, state: next, generation },
    });
  };

  const bump = () => { generation += 1; };

  const preloadOne = async (alias, src, blocking) => {
    try {
      const texture = await Assets.load({ alias, src });
      if (!texture) throw new Error('empty-texture');
      textureAliases.set(alias, texture);
      if (blocking) blockingLoaded += 1;
      return { alias, ok: true };
    } catch (error) {
      const message = (error && error.message) || 'load-failed';
      if (textureErrors.length < 4) textureErrors.push({ alias, message });
      trace?.emit?.('renderer.texture-missing', {
        outcome: 'failed',
        attributes: {
          rendererId: RENDERER_ID,
          alias,
          code: message,
        },
      });
      return { alias, ok: false };
    }
  };

  const preload = async () => {
    const manifest = [];
    for (const id of COMBAT_UI_TEXTURE_IDS) {
      const url = assetUrl('ui', id);
      const blocking = COMBAT_BLOCKING_UI_IDS.includes(id);
      if (url) manifest.push({ alias: `combat-gl:ui/${id}`, src: url, blocking });
      else if (blocking) {
        trace?.emit?.('renderer.texture-missing', {
          outcome: 'failed',
          attributes: { rendererId: RENDERER_ID, alias: `ui/${id}`, code: 'no-url' },
        });
      }
    }
    for (const id of COMBAT_PILE_TEXTURE_IDS) {
      const url = assetUrl('piles', id);
      if (url) manifest.push({ alias: `combat-gl:pile/${id}`, src: url, blocking: true });
      else {
        trace?.emit?.('renderer.texture-missing', {
          outcome: 'failed',
          attributes: { rendererId: RENDERER_ID, alias: `pile/${id}`, code: 'no-url' },
        });
      }
    }
    await Promise.all(manifest.map(({ alias, src, blocking }) => preloadOne(alias, src, blocking)));
    texturedReady = blockingLoaded === blockingExpected;
    trace?.emit?.('renderer.textured-ready', {
      outcome: texturedReady ? 'completed' : 'failed',
      attributes: {
        rendererId: RENDERER_ID,
        blockingLoaded,
        blockingExpected,
      },
    });
    return { texturedReady, blockingLoaded, blockingExpected };
  };

  const texturedReadyPromise = preload();

  const sync = (model) => {
    if (model === undefined) return presentationModel;
    if (model === null) { presentationModel = null; bump(); return null; }
    presentationModel = cloneImmutable(model);
    bump();
    return presentationModel;
  };

  const mount = (model) => {
    if (model !== undefined) sync(model);
    else bump();
    trace?.emit?.('renderer.mount', {
      outcome: 'completed',
      attributes: { rendererId: RENDERER_ID, generation, texturedReady },
    });
    return stats();
  };

  const layout = () => {
    bump();
    return readUI();
  };

  const hitTest = (x, y) => {
    // Placeholder: PR17 owns real Pixi hit-testing; the scaffold defers to the
    // DOM by returning null so combat.js input handlers keep working.
    hitTestBias = { x: Number(x) || 0, y: Number(y) || 0 };
    void hitTestBias;
    return null;
  };

  const setInteraction = (mode) => {
    const next = typeof mode === 'string' ? mode : (mode?.mode || 'off');
    interactionMode = next;
    trace?.emit?.('renderer.interaction', {
      outcome: 'accepted',
      attributes: { rendererId: RENDERER_ID, mode: next },
    });
    return interactionMode;
  };

  function readUI() {
    const info = stageInfo();
    const chrome = uicResolve(info.shape);
    const bfLayout = bfResolve(info.shape, 0);
    const hasCombat = typeof document !== 'undefined'
      && document.querySelector?.('.combat-screen');
    if (!hasCombat) {
      // Combat is not on stage — still return a stage-px shell so PR17 can
      // reason about the frame before the first mount.
      const hero = bfLayout.hero || {};
      const heroActor = bfActor('heroes', 'anon') || { footY: 0 };
      const heroBottom = bfHeroY(bfLayout) + (heroActor.footY || 0);
      return deepFreeze({
        version: COMBAT_RENDERER_VERSION,
        rendererId: RENDERER_ID,
        stage: { shape: info.shape, w: info.w, h: info.h },
        chrome: {
          energy: chrome.energy ?? null,
          lantern: chrome.lantern ?? null,
          endTurn: chrome.endTurn ?? null,
          draw: chrome.draw ?? null,
          discard: chrome.discard ?? null,
          ashes: chrome.ashes ?? null,
          hand: chrome.hand ?? null,
          hud: chrome.hud ?? null,
          omen: chrome.omen ?? null,
          relics: relicBarLayout(chrome, false),
        },
        candleFrame: chrome.energy
          ? {
            bounds: {
              left: chrome.energy.left ?? null,
              right: chrome.energy.right ?? null,
              bottom: chrome.energy.bottom ?? null,
              w: chrome.energy.w ?? null,
              h: chrome.energy.h ?? null,
            },
            slots: [],
          }
          : null,
        hero: {
          layoutX: hero.x ?? null,
          layoutY: heroBottom,
          bounds: null,
          plateBounds: null,
          topChromeBounds: null,
        },
        enemies: [],
        restingHandFloor: chrome.hand?.bottom ?? null,
        pending: true,
      });
    }
    const heroRect = domRect('.hero-wrap');
    const heroPlate = domRect('.player-zone .cplate');
    const heroTop = domRect('.player-zone .top-chrome');
    const enemyBoxes = document.querySelectorAll('.enemy');
    const enemies = [];
    enemyBoxes.forEach((box, index) => {
      const art = box.querySelector('.enemy-art');
      const plate = box.querySelector('.cplate');
      const top = box.querySelector('.top-chrome');
      if (!art) return;
      const artR = stageRect(art);
      enemies.push({
        index,
        artBounds: rectOf(artR),
        artCenter: centerOf(artR),
        plateBounds: plate ? rectOf(stageRect(plate)) : null,
        topChromeBounds: top ? rectOf(stageRect(top)) : null,
      });
    });
    const handRect = domRect('.hand-zone');
    const candleContainer = domRect('.energy-orb .candles');
    const candleSlots = [];
    const candleNodes = document.querySelectorAll('.energy-orb .candles .candle');
    candleNodes.forEach((node, i) => {
      const cr = stageRect(node);
      candleSlots.push({
        index: i,
        state: node.dataset.state || (node.classList.contains('lit') ? 'lit' : 'spent'),
        bounds: rectOf(cr),
      });
    });
    return deepFreeze({
      version: COMBAT_RENDERER_VERSION,
      rendererId: RENDERER_ID,
      stage: { shape: info.shape, w: info.w, h: info.h, viewport: { w: stageW(), h: stageH() } },
      chrome: {
        energy: chrome.energy ?? null,
        lantern: chrome.lantern ?? null,
        endTurn: chrome.endTurn ?? null,
        draw: chrome.draw ?? null,
        discard: chrome.discard ?? null,
        ashes: chrome.ashes ?? null,
        hand: chrome.hand ?? null,
        hud: chrome.hud ?? null,
        omen: chrome.omen ?? null,
        relics: relicBarLayout(chrome, false),
      },
      candleFrame: candleContainer
        ? { bounds: rectOf(candleContainer), slots: candleSlots }
        : null,
      hero: {
        layoutX: bfLayout.hero?.x ?? null,
        layoutY: bfHeroY(bfLayout),
        bounds: rectOf(heroRect),
        center: centerOf(heroRect),
        plateBounds: rectOf(heroPlate),
        topChromeBounds: rectOf(heroTop),
      },
      enemies: enemies.map((entry) => Object.freeze(entry)),
      restingHandFloor: handRect ? handRect.top : (chrome.hand?.bottom ?? null),
      handBounds: rectOf(handRect),
      pending: false,
      bf: {
        shape: info.shape,
        groundY: bfLayout.groundY ?? null,
        slotCount: bfSlots(bfLayout, enemies.length || 1).length,
      },
    });
  }

  function stats() {
    const pixiStats = pixiLayer.stats?.() || {};
    return Object.freeze({
      rendererId: RENDERER_ID,
      kind: 'pixi',
      state,
      generation,
      transitions: Object.freeze([...transitions]),
      texturedReady,
      blockingLoaded,
      blockingExpected,
      textureAliasCount: textureAliases.size,
      textureErrors: Object.freeze(textureErrors.map((entry) => Object.freeze({ ...entry }))),
      interactionMode,
      hasModel: presentationModel !== null,
      modelVersion: presentationModel?.version ?? null,
      frozen: pixiStats.frozen === true,
      frozenTick: pixiStats.frozen === true ? (pixiStats.frozenTick ?? null) : null,
      pixiGeneration: pixiStats.generation ?? null,
      pixiState: pixiStats.status ?? null,
    });
  }

  const loseContextForTest = async () => {
    if (typeof pixiLayer.loseContextForTest !== 'function') {
      throw new Error('pixiLayer does not expose loseContextForTest');
    }
    const result = await pixiLayer.loseContextForTest();
    bump();
    return result;
  };

  const freezeForTest = async (options = {}) => {
    if (typeof pixiLayer.freezeForTest !== 'function') {
      throw new Error('pixiLayer does not expose freezeForTest');
    }
    const result = await pixiLayer.freezeForTest(options);
    return result;
  };

  const unfreezeForTest = () => {
    if (typeof pixiLayer.unfreezeForTest !== 'function') {
      throw new Error('pixiLayer does not expose unfreezeForTest');
    }
    return pixiLayer.unfreezeForTest();
  };

  const destroy = () => {
    if (destroyed) return;
    destroyed = true;
    try { container.destroy({ children: true }); } catch { /* container already reaped */ }
    textureAliases.clear();
    presentationModel = null;
    setState('idle');
  };

  setState('ready');

  return Object.freeze({
    // presentation seam
    mount, sync, layout, hitTest, setInteraction, readUI, stats,
    // lifecycle bridge (Task 21 pixiLayer)
    loseContextForTest, freezeForTest, unfreezeForTest, destroy,
    // scaffold introspection (not part of the frozen public seam; PR16 will
    // stabilise these once the renderer actually paints)
    root: () => container,
    texturedReadyPromise: () => texturedReadyPromise,
    version: COMBAT_RENDERER_VERSION,
    blockingIds: COMBAT_BLOCKING_UI_IDS,
    pileIds: COMBAT_PILE_TEXTURE_IDS,
  });
}
