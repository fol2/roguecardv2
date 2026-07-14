// Task 22a scaffold + Task 22b-1 bottom-chrome paint.
//
// This module owns the Pixi-side combat presenter. Round 5 Task 22 is
// delivered in three slices; this file lands 22a AND 22b-1:
//
//   - Freezes the interface (`createCombatRenderer`) so PR16/PR17 can build on
//     a stable seam without further churn.
//   - Registers/preloads the 27 ui/*.png + 3 piles/*.png textures through the
//     Pixi asset system and gates a `textured-ready` promise on the 17
//     combat-blocking chrome ids plus the 3 piles. If a texture fails to
//     load, the renderer emits a trace warning and keeps going — the vector
//     fallback (widgets.js / Graphics) covers the missing face.
//   - Bridges freeze / loseContextForTest / unfreezeForTest through the
//     Task 21 `pixiLayer`, so tests can drive the combat renderer via the
//     same handles used elsewhere.
//   - Task 22b-1: paints the bottom interactive chrome (energy candles +
//     count, lantern face + ember pips + count, end-turn button, and the
//     three pile stacks). Interaction lives on transparent DOM proxies
//     inside `#combat-hit-proxies`; this module owns the visuals only.
//
// HUD, potions/relics/omen, plates, hand, statuses, intents, aim/mesh — all
// still live in DOM. 22b-2 migrates them.

import {
  Assets, Container, Graphics, Sprite, Text,
} from 'pixi.js';

import { assetUrl } from '../art.js';
import {
  bfActor, bfEnemyFrame, bfHeroY, bfResolve, bfSlots,
} from '../battlefield.js';
import { pileFanAngleDeg, pileFanLayers } from '../pile-chrome.js';
import { stageH, stageInfo, stageRect, stageW } from '../stage.js';
import { energySlotStates } from '../ui-chrome.js';
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

/** Fixed candle-frame extent per stage shape (matches CSS `.energy-orb .candles`
 *  width per shape; height matches the largest candle raster). geometry.spec
 *  reads the resulting bounds directly through `readUI().candleFrame`. */
const CANDLE_FRAME = Object.freeze({
  'desktop-landscape': { w: 120, h: 56 },
  'pad-landscape': { w: 120, h: 56 },
  'pad-portrait': { w: 102, h: 56 },
  'phone-portrait': { w: 84, h: 44 },
  'phone-landscape': { w: 72, h: 40 },
});
const CANDLE_FRAME_FALLBACK = { w: 120, h: 56 };

/** Slot width cap so the frame stays fixed while individual candles shrink. */
const CANDLE_SLOT_MAX_W = 40;

function candleFrameFor(shape) {
  return CANDLE_FRAME[shape] || CANDLE_FRAME_FALLBACK;
}

function pixiTextureForAlias(aliases, alias) {
  return aliases.get(alias) || null;
}

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
  // Task 22b-1: bottom interactive chrome is Pixi-painted (DOM chrome hidden).
  // Higher-layer widgets (HUD, plates, hand, mesh/aim) still live in DOM.
  container.visible = true;
  container.eventMode = 'none';
  const layerRoot = pixiLayer.root();
  if (layerRoot && layerRoot.addChild) layerRoot.addChild(container);

  // Sub-containers own one bottom-chrome widget each. Rebuilding a widget on
  // sync only touches its own sub-container so the rest of the frame stays
  // stable across draws.
  const candlesLayer = new Container(); candlesLayer.label = 'combat-gl-candles';
  const energyNumLayer = new Container(); energyNumLayer.label = 'combat-gl-energy-num';
  const lanternLayer = new Container(); lanternLayer.label = 'combat-gl-lantern';
  const endTurnLayer = new Container(); endTurnLayer.label = 'combat-gl-end-turn';
  const pileLayers = {
    draw: new Container(),
    discard: new Container(),
    ashes: new Container(),
  };
  pileLayers.draw.label = 'combat-gl-pile-draw';
  pileLayers.discard.label = 'combat-gl-pile-discard';
  pileLayers.ashes.label = 'combat-gl-pile-ashes';
  container.addChild(
    candlesLayer, energyNumLayer, lanternLayer, endTurnLayer,
    pileLayers.draw, pileLayers.discard, pileLayers.ashes,
  );

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
  // Latest Pixi-derived bottom-chrome geometry (read through readUI()).
  let candleFrameCache = null;
  let bottomChromeReady = false;
  let bottomChromePainted = 0;

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
    if (model === null) {
      presentationModel = null;
      candleFrameCache = null;
      bottomChromeReady = false;
      clearBottomChromePaint();
      bump();
      return null;
    }
    presentationModel = cloneImmutable(model);
    paintBottomChrome();
    bump();
    return presentationModel;
  };

  const mount = (model) => {
    if (model !== undefined) sync(model);
    else { paintBottomChrome(); bump(); }
    trace?.emit?.('renderer.mount', {
      outcome: 'completed',
      attributes: { rendererId: RENDERER_ID, generation, texturedReady },
    });
    return stats();
  };

  const layout = () => {
    paintBottomChrome();
    bump();
    return readUI();
  };

  function clearBottomChromePaint() {
    candlesLayer.removeChildren();
    energyNumLayer.removeChildren();
    lanternLayer.removeChildren();
    endTurnLayer.removeChildren();
    for (const key of Object.keys(pileLayers)) pileLayers[key].removeChildren();
    bottomChromePainted = 0;
  }

  function paintBottomChrome() {
    const info = stageInfo();
    const chrome = uicResolve(info.shape);
    let painted = 0;
    painted += paintCandles(chrome, info) ? 1 : 0;
    painted += paintEnergyNumber(chrome, info) ? 1 : 0;
    painted += paintLantern(chrome, info) ? 1 : 0;
    painted += paintEndTurn(chrome, info) ? 1 : 0;
    painted += paintPile('draw', chrome.draw, chrome, info) ? 1 : 0;
    painted += paintPile('discard', chrome.discard, chrome, info) ? 1 : 0;
    painted += paintPile('ashes', chrome.ashes, chrome, info) ? 1 : 0;
    bottomChromePainted = painted;
    bottomChromeReady = painted >= 4; // candles + lantern + end-turn + 3 piles = 6; count anything ≥4 as steady
  }

  function paintCandles(chrome) {
    candlesLayer.removeChildren();
    const info = stageInfo();
    const chromeEnergy = chrome.energy;
    if (!chromeEnergy) { candleFrameCache = null; return false; }
    const bottomState = presentationModel?.bottomChrome;
    const energy = Math.max(0, Number(bottomState?.energy ?? presentationModel?.hero?.energy ?? 0) | 0);
    const energyMax = Math.max(energy, Number(bottomState?.energyMax ?? presentationModel?.hero?.energyMax ?? 0) | 0);
    const states = bottomState?.candles && Array.isArray(bottomState.candles)
      ? bottomState.candles
      : energySlotStates(energy, energyMax);
    const frame = candleFrameFor(info.shape);
    const frameLeft = Number.isFinite(chromeEnergy.left) ? chromeEnergy.left : 0;
    const frameBottom = Number.isFinite(chromeEnergy.bottom) ? chromeEnergy.bottom : 0;
    const stageHeight = stageH();
    const frameTop = stageHeight - frameBottom - frame.h;
    const n = states.length || Math.max(1, energyMax || 3);
    const pitch = frame.w / n;
    const slotW = Math.min(CANDLE_SLOT_MAX_W, pitch);
    const slots = [];
    for (let i = 0; i < n; i += 1) {
      const st = states[i] || 'spent';
      const cx = frameLeft + (i + 0.5) * pitch;
      const alias = st === 'lit' ? 'combat-gl:ui/candle-lit' : 'combat-gl:ui/candle-spent';
      const tex = pixiTextureForAlias(textureAliases, alias);
      if (tex) {
        const sprite = new Sprite(tex);
        sprite.anchor.set(0.5, 1);
        sprite.width = slotW;
        sprite.height = frame.h;
        sprite.x = cx;
        sprite.y = frameTop + frame.h;
        candlesLayer.addChild(sprite);
      } else {
        const g = new Graphics();
        g.roundRect(-slotW / 2, -frame.h, slotW * 0.85, frame.h, 4)
          .fill({ color: st === 'lit' ? 0xffc95e : 0x232a40, alpha: st === 'lit' ? 0.95 : 0.75 });
        g.x = cx;
        g.y = frameTop + frame.h;
        candlesLayer.addChild(g);
      }
      slots.push(Object.freeze({
        index: i,
        state: st,
        bounds: Object.freeze({
          left: cx - slotW / 2,
          top: frameTop,
          right: cx + slotW / 2,
          bottom: frameTop + frame.h,
          width: slotW,
          height: frame.h,
        }),
      }));
    }
    candleFrameCache = Object.freeze({
      bounds: Object.freeze({
        left: frameLeft,
        top: frameTop,
        right: frameLeft + frame.w,
        bottom: frameTop + frame.h,
        width: frame.w,
        height: frame.h,
      }),
      slots: Object.freeze(slots),
    });
    return true;
  }

  function paintEnergyNumber(chrome) {
    energyNumLayer.removeChildren();
    const chromeEnergy = chrome.energy;
    if (!chromeEnergy) return false;
    const bottomState = presentationModel?.bottomChrome;
    const energy = Number(bottomState?.energy ?? presentationModel?.hero?.energy ?? 0) | 0;
    const info = stageInfo();
    const frame = candleFrameFor(info.shape);
    const frameLeft = Number.isFinite(chromeEnergy.left) ? chromeEnergy.left : 0;
    const frameBottom = Number.isFinite(chromeEnergy.bottom) ? chromeEnergy.bottom : 0;
    const frameTop = stageH() - frameBottom - frame.h;
    const label = new Text({
      text: String(Math.max(0, energy)),
      style: {
        fontFamily: 'Cinzel',
        fontSize: info.shape === 'phone-portrait' || info.shape === 'phone-landscape' ? 32 : 44,
        fontWeight: '800',
        fill: 0xfff8e8,
        stroke: { color: 0x000000, width: 2, join: 'round' },
        align: 'center',
      },
    });
    label.anchor?.set?.(0.5, 1);
    label.x = frameLeft + frame.w / 2;
    label.y = frameTop - 4;
    energyNumLayer.addChild(label);
    return true;
  }

  function paintLantern(chrome) {
    lanternLayer.removeChildren();
    const w = chrome.lantern;
    if (!w) return false;
    const bx = Number.isFinite(w.left) ? w.left : (stageW() - (w.right ?? 0) - (w.w ?? 0));
    const by = stageH() - (w.bottom ?? 0) - (w.h ?? 0);
    const width = w.w ?? 104;
    const height = w.h ?? 104;
    const bottomState = presentationModel?.bottomChrome;
    const embers = Math.max(0, Number(bottomState?.embers ?? presentationModel?.embers ?? 0) | 0);
    const cap = Math.max(embers, Number(bottomState?.emberCap ?? 9) | 0);
    const ready = !!bottomState?.lanternReady;
    const artSpent = !!bottomState?.lanternArtSpent;
    const tex = pixiTextureForAlias(textureAliases, 'combat-gl:ui/lantern');
    if (tex) {
      const s = new Sprite(tex);
      s.anchor.set(0.5, 0.5);
      s.width = width;
      s.height = height;
      s.x = bx + width / 2;
      s.y = by + height / 2;
      s.alpha = artSpent ? 0.65 : (embers === 0 ? 0.7 : 1);
      lanternLayer.addChild(s);
    } else {
      const g = new Graphics();
      g.circle(bx + width / 2, by + height / 2, Math.min(width, height) * 0.44)
        .fill({ color: 0x9c7c34, alpha: 0.9 })
        .stroke({ color: 0xf2c14e, width: 2 });
      lanternLayer.addChild(g);
    }
    // ember pips: ring around the lantern face
    if (cap > 0) {
      const pipsRadius = Math.min(width, height) * 0.5 + 6;
      for (let i = 0; i < cap; i += 1) {
        const angle = (Math.PI / 180) * (Math.round((i / Math.max(cap - 1, 1)) * 280 - 140));
        const px = bx + width / 2 + pipsRadius * Math.cos(angle);
        const py = by + height / 2 + pipsRadius * Math.sin(angle);
        const pip = new Graphics();
        pip.circle(0, 0, 3.4)
          .fill({ color: i < embers ? 0xffb35a : 0x2c2c3a, alpha: i < embers ? 1 : 0.55 });
        pip.x = px; pip.y = py;
        lanternLayer.addChild(pip);
      }
    }
    // ember count label
    const count = new Text({
      text: String(embers),
      style: {
        fontFamily: 'Cinzel',
        fontSize: 22,
        fontWeight: '800',
        fill: 0xfff6ec,
        stroke: { color: 0x000000, width: 2, join: 'round' },
      },
    });
    count.anchor?.set?.(0.5, 0.5);
    count.x = bx + width / 2;
    count.y = by + height / 2 + height * 0.28;
    lanternLayer.addChild(count);
    // ready halo
    if (ready) {
      const halo = new Graphics();
      halo.circle(bx + width / 2, by + height / 2, Math.min(width, height) * 0.56)
        .stroke({ color: 0xf2c14e, width: 2, alpha: 0.6 });
      lanternLayer.addChild(halo);
    }
    return true;
  }

  function paintEndTurn(chrome) {
    endTurnLayer.removeChildren();
    const w = chrome.endTurn;
    if (!w) return false;
    const width = w.w ?? 120;
    const height = w.h ?? 120;
    const bx = Number.isFinite(w.left)
      ? w.left
      : (stageW() - (Number(w.right) || 0) - width);
    const by = stageH() - (w.bottom ?? 0) - height;
    const enabled = presentationModel?.bottomChrome?.endTurnEnabled ?? false;
    const tex = pixiTextureForAlias(textureAliases, 'combat-gl:ui/end-turn');
    if (tex) {
      const s = new Sprite(tex);
      s.anchor.set(0.5, 0.5);
      s.width = width;
      s.height = height;
      s.x = bx + width / 2;
      s.y = by + height / 2;
      s.alpha = enabled ? 1 : 0.9;
      endTurnLayer.addChild(s);
    } else {
      const g = new Graphics();
      g.roundRect(bx, by, width, height, 12)
        .fill({ color: 0x9c7c34, alpha: 0.85 })
        .stroke({ color: 0xf2c14e, width: 2 });
      endTurnLayer.addChild(g);
    }
    const label = new Text({
      text: 'END',
      style: {
        fontFamily: 'Cinzel',
        fontSize: 18,
        fontWeight: '800',
        fill: 0xfff8e8,
        stroke: { color: 0x000000, width: 2, join: 'round' },
        letterSpacing: 3,
      },
    });
    label.anchor?.set?.(0.5, 0.5);
    label.x = bx + width / 2;
    label.y = by + height / 2 + height * 0.32;
    endTurnLayer.addChild(label);
    return true;
  }

  function paintPile(pileKey, widget) {
    const layer = pileLayers[pileKey];
    if (!layer) return false;
    layer.removeChildren();
    if (!widget) return false;
    const width = widget.w ?? 96;
    const height = widget.h ?? 148;
    const bx = Number.isFinite(widget.left)
      ? widget.left
      : (stageW() - (Number(widget.right) || 0) - width);
    const by = stageH() - (widget.bottom ?? 0) - height;
    const bottomState = presentationModel?.bottomChrome;
    const pileState = bottomState?.piles?.[pileKey]
      || (presentationModel?.piles ? { count: presentationModel.piles[pileKey] } : { count: 0 });
    const count = Math.max(0, Number(pileState?.count ?? 0) | 0);
    const layers = pileFanLayers(count);
    const alias = `combat-gl:pile/${pileKey}`;
    const tex = pixiTextureForAlias(textureAliases, alias);
    const stackBottomInset = 18;
    if (count > 0 && tex && layers > 0) {
      for (let i = 0; i < layers; i += 1) {
        const s = new Sprite(tex);
        s.anchor.set(0.5, 1);
        s.width = width;
        s.height = height - stackBottomInset;
        s.x = bx + width / 2;
        s.y = by + height - stackBottomInset;
        s.rotation = (Math.PI / 180) * pileFanAngleDeg(i, layers);
        layer.addChild(s);
      }
    } else if (count === 0) {
      // Empty pile — skip plate; leave count/label only.
    } else {
      const g = new Graphics();
      g.roundRect(bx, by, width, height - stackBottomInset, 8)
        .fill({ color: 0x111832, alpha: 0.65 })
        .stroke({ color: 0xf2c14e, width: 1, alpha: 0.4 });
      layer.addChild(g);
    }
    const cnt = new Text({
      text: String(count),
      style: {
        fontFamily: 'Cinzel',
        fontSize: 16,
        fontWeight: '800',
        fill: 0xe8dfc8,
        stroke: { color: 0x05070e, width: 2, join: 'round' },
      },
    });
    cnt.anchor?.set?.(1, 1);
    cnt.x = bx + width - 2;
    cnt.y = by + height - 16;
    layer.addChild(cnt);
    const label = new Text({
      text: pileKey === 'ashes' ? 'ASHES' : (pileKey === 'draw' ? 'DRAW' : 'DISCARD'),
      style: {
        fontFamily: 'Cinzel',
        fontSize: 9.5,
        fontWeight: '700',
        fill: 0x8b93ad,
        letterSpacing: 1.5,
      },
    });
    label.anchor?.set?.(0.5, 1);
    label.x = bx + width / 2;
    label.y = by + height;
    layer.addChild(label);
    return true;
  }

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
        candleFrame: candleFrameCache,
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
      candleFrame: candleFrameCache,
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
      bottomChrome: Object.freeze({
        ready: bottomChromeReady,
        painted: bottomChromePainted,
        hasCandleFrame: candleFrameCache !== null,
      }),
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
