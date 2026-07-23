// Task 22a scaffold + Task 22b-1 bottom-chrome paint + Task 22b-2 HUD/plates.
//
// This module owns the Pixi-side combat presenter. Round 5 Task 22 is
// delivered in three slices; this file lands 22a, 22b-1, AND 22b-2:
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
//     Interaction lives on the stage pointer router (Task 23); this module
//     owns the visuals only.
//   - Task 22b-2: paints HUD (HP/gold/deck/menu/potions/relics/omen) and
//     under-own-foe / hero plate chrome (names, affix, statuses, HP/Ward/
//     facets, intents). Geometry still comes from `uicResolve()` + the
//     existing PR17 packer in combat.js (DOM anchors); Pixi mirrors the
//     resulting stage-px boxes via `readUI()`.
//
// Task 27 — hand faces + targeting aim arc are Pixi; combatants/mesh stay DOM.
// `#aim` and `.hand-zone` remain empty structural hosts for geometry/tests.

import {
  Assets, ColorMatrixFilter, Container, FillGradient, Graphics, Sprite, Text,
  Texture,
} from 'pixi.js';

import { assetUrl } from '../art.js';
import {
  bfActor, bfEnemyFrame, bfHeroY, bfResolve, bfSlots,
} from '../battlefield.js';
import { pileFanAngleDeg, pileFanLayers } from '../pile-chrome.js';
import { stageH, stageInfo, stageRect, stageW } from '../stage.js';
import { energySlotStates } from '../ui-chrome.js';
import { relicBarLayout, uicResolve } from '../uic.js';
import { snapStage } from './widgets.js';
import { createCardFaceComposer } from './cardface.js';
import {
  CARD_FACE_HEIGHT, CARD_FACE_WIDTH,
} from './cardface-layout.js';
import {
  handSeatCenter as pureHandSeatCenter,
  handSeatOffset,
} from './hand-layout.js';
import { CARDS } from '../data.js';
import { getLocale } from '../i18n/index.js';
import {
  DURATION_MS, EASING, ROUND5_TOKENS, isReducedTier,
} from './tokens.js';
import { createCombatPresentation } from './combat-presentation.js';
import { presentationBarrier } from './context.js';
import {
  faceDescriptor, faceDisplayState, measurePlateWidgets, rectOf,
  seatCenter, unionBounds,
} from './combat-gl-paint.js';

/** Task 21 formula: min(max(dpr * stage.scale, 0.5), tierCap). Prefer the
 *  live Pixi renderer resolution when the layer is already booted. */
function paintResolution(pixiLayer) {
  const appRes = Number(pixiLayer?.application?.()?.renderer?.resolution);
  if (Number.isFinite(appRes) && appRes > 0) return appRes;
  const dpr = (typeof window !== 'undefined' && window.devicePixelRatio) || 1;
  const scale = stageInfo().scale || 1;
  const cap = pixiLayer?.policy?.tier === 'lite' ? 1 : 2;
  return Math.min(Math.max(dpr * scale, 0.5), cap);
}

/** Snap a stage-px rect so left/top/width/height are device-pixel integral. */
function snapRect(rect, resolution) {
  if (!rect) return null;
  const left = snapStage(rect.left ?? rect.x ?? 0, resolution);
  const top = snapStage(rect.top ?? rect.y ?? 0, resolution);
  const width = snapStage(
    rect.width ?? ((rect.right ?? 0) - (rect.left ?? 0)),
    resolution,
  );
  const height = snapStage(
    rect.height ?? ((rect.bottom ?? 0) - (rect.top ?? 0)),
    resolution,
  );
  return Object.freeze({
    left,
    top,
    right: left + width,
    bottom: top + height,
    width,
    height,
  });
}

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
 * Card-art loader for the face composer — resolves `assetUrl('cards', id)`
 * the same way DOM rasterOr / art.js does, and warms HTMLImageElements so
 * canvas2d export can paint real art into shop/reward cardEl faces.
 */
export function createCardFaceAssets({ cardIds = Object.keys(CARDS) } = {}) {
  const images = new Map();
  const textures = new Map();

  const warmImage = (id) => {
    if (images.has(id)) return images.get(id);
    const url = assetUrl('cards', id);
    if (!url || typeof Image === 'undefined') {
      images.set(id, null);
      return null;
    }
    const img = new Image();
    img.decoding = 'async';
    img.src = url;
    images.set(id, img);
    return img;
  };

  for (const id of cardIds) warmImage(id);

  return Object.freeze({
    cardArtUrl(id) {
      return assetUrl('cards', id);
    },
    cardArtImage(id) {
      return warmImage(id);
    },
    cardArt(id) {
      if (textures.has(id)) return textures.get(id);
      const img = warmImage(id);
      if (!img || !(img.complete && img.naturalWidth > 0)) {
        // Defer Pixi texture until decode completes — avoids Assets cache warnings
        // from Texture.from(url) and lets canvas2d export use the HTMLImageElement.
        return null;
      }
      try {
        const tex = Texture.from(img);
        textures.set(id, tex);
        return tex;
      } catch {
        textures.set(id, null);
        return null;
      }
    },
  });
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
  // keeps the eventual `{ actions, tooltip }` wiring one edit away.
  void canvas; void actions; void tooltip;

  // Task 26 — single card-face composer shared by combat acquire + DOM export.
  const experienceTokens = tokens || ROUND5_TOKENS;
  const appRenderer = pixiLayer.application?.()?.renderer || null;
  const cardFace = createCardFaceComposer({
    renderer: appRenderer || {
      resolution: paintResolution(pixiLayer),
      generateTexture: null,
      extract: null,
    },
    registries: { cards: CARDS },
    assets: createCardFaceAssets(),
    tokens: experienceTokens,
    getLocale,
    policy: pixiLayer.policy || { tier: 'full' },
  });

  const container = new Container();
  container.label = 'combat-gl-root';
  // Task 22b-1: bottom interactive chrome is Pixi-painted (DOM chrome hidden).
  // Task 22b-2: HUD + plates join that paint surface.
  container.visible = true;
  container.eventMode = 'none';
  // Root transform stays device-pixel integral (identity at origin).
  container.position.set(
    snapStage(0, paintResolution(pixiLayer)),
    snapStage(0, paintResolution(pixiLayer)),
  );
  const layerRoot = pixiLayer.root();
  if (layerRoot && layerRoot.addChild) layerRoot.addChild(container);

  // Sub-containers own one chrome region each. Rebuilding a widget on sync
  // only touches its own sub-container so the rest of the frame stays stable.
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
  const hudLayer = new Container(); hudLayer.label = 'combat-gl-hud';
  const platesLayer = new Container(); platesLayer.label = 'combat-gl-plates';
  // Task 27 — hand above chrome so seats paint over piles; aim above hand.
  const handLayer = new Container(); handLayer.label = 'combat-gl-hand';
  const aimLayer = new Container(); aimLayer.label = 'combat-gl-aim';
  // Transient chrome micro-feedback beats (energy/lantern/piles/block/facet).
  const pulseLayer = new Container(); pulseLayer.label = 'combat-gl-pulse';
  pulseLayer.eventMode = 'none';
  const ceremonyLayer = new Container(); ceremonyLayer.label = 'combat-gl-ceremony';
  container.addChild(
    candlesLayer, energyNumLayer, lanternLayer, endTurnLayer,
    pileLayers.draw, pileLayers.discard, pileLayers.ashes,
    platesLayer, hudLayer, handLayer, aimLayer, pulseLayer, ceremonyLayer,
  );

  // Task 28 — floaters / banners / pile flights / shatter live above chrome.
  const presentation = createCombatPresentation({
    parent: ceremonyLayer,
    trace,
    presentationBarrier,
    policy: () => {
      const p = pixiLayer.policy || {};
      const reduced = !!(p.reducedMotion || isReducedTier(p));
      return {
        tier: p.tier || 'full',
        motion: reduced ? 'reduced' : (p.motion || 'full'),
      };
    },
    cardFace,
    canvas: typeof document !== 'undefined' ? document.getElementById('uigl') : null,
    pixiApp: pixiLayer.application?.() || null,
  });

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
  // Latest Pixi-derived chrome geometry (read through readUI()).
  let candleFrameCache = null;
  let lanternBoundsCache = null;
  let endTurnBoundsCache = null;
  let pileBoundsCache = Object.freeze({ draw: null, discard: null, ashes: null });
  let bottomChromeReady = false;
  let bottomChromePainted = 0;
  let hudReady = false;
  let hudPainted = 0;
  let hudCache = null;
  let platesReady = false;
  let platesPainted = 0;
  let platesCache = null;
  /** @type {Map<string, { root:Container, face:object|null, sprite:object|null, desatFilter:object|null, fx:object|null, anim:object|null, target:object|null, hovered:boolean, dragging:boolean, foil:boolean, playable:boolean, faceW:number, faceH:number, phase:number, release:Function|null, seatBounds:object|null, faceKey:string|null }>} */
  const handNodes = new Map();
  let handCache = null;
  let handReady = false;
  let handPainted = 0;
  let aimPathCache = null;
  // Live chrome micro-feedback beats — { g, t, dur }, ticked + reaped in place.
  const pulses = [];
  // Living-card animation clock — drives the always-on holographic sweep.
  let holoClock = 0;
  // Pixi Application ticker handle for the per-frame hand animation.
  let handTicker = null;
  let handTickHandler = null;

  // --- Incremental repaint (aim/drag de-thrash) ------------------------------
  // combat.js always calls sync() with the FULL presentation model, even when a
  // single pointermove only nudged the aim arc or a dragged card. Repainting
  // every region per move destroys+recreates dozens of Pixi Text/Graphics (GPU +
  // layout thrash). The DOM-free regions (bottom chrome, hand, aim) paint as a
  // pure function of their model slice plus stage shape/resolution, so we memoise
  // a per-region signature and repaint only the slices that actually changed.
  // Shape + resolution ride in every signature, so a resize (which also arrives
  // through sync via refitCombat) forces a full repaint. HUD and plates mirror
  // live DOM anchors that settle asynchronously and can move without a model
  // change, so they always repaint. layout()/mount()/the context-rebuild reset
  // the cache to force a full repaint.
  const paintSig = { bottom: null, hand: null, aim: null };
  const resetPaintSigs = () => {
    paintSig.bottom = null; paintSig.hand = null; paintSig.aim = null;
  };
  const repaintRegions = (force = false) => {
    const m = presentationModel;
    const base = `${m?.stage?.shape ?? ''}|${paintResolution(pixiLayer)}`;
    const sig = (slice) => `${base}|${JSON.stringify(slice ?? null)}`;
    const bottomSig = sig([m?.bottomChrome, m?.hero?.energy, m?.hero?.energyMax, m?.embers, m?.piles]);
    if (force || bottomSig !== paintSig.bottom) { paintBottomChrome(); paintSig.bottom = bottomSig; }
    // HUD + plates read live DOM geometry — always repaint (cheap relative to a
    // stale-geometry bug; still coalesced to one call per frame by pointer.js).
    paintHudChrome();
    paintPlatesChrome();
    const handSig = sig(m?.hand);
    if (force || handSig !== paintSig.hand) { paintHand(); paintSig.hand = handSig; }
    const aimSig = sig(m?.aim);
    if (force || aimSig !== paintSig.aim) { paintAim(); paintSig.aim = aimSig; }
  };

  const isLite = () => (pixiLayer.policy?.tier === 'lite');
  // REDUCED wins over LITE — snap transforms, no tilt/glare/holo.
  const reducedMotion = () => {
    const p = pixiLayer.policy || {};
    return !!(p.reducedMotion || isReducedTier(p));
  };

  // --- Living-card motion tuning (calibration knobs — feel, not correctness) --
  // Lift is a damped spring whose overshoot embodies EASING.spring (the
  // 1.56 control point) and whose rate comes from DURATION_MS.quick; tilt/glare
  // track the cursor with a faster, critically-damped spring (no wobble).
  const LIFT_OMEGA = (2 * Math.PI) / (DURATION_MS.quick / 1000);
  const LIFT_ZETA = 1 / EASING.spring[1]; // 1.56 overshoot → ζ≈0.64
  const TILT_OMEGA = (2 * Math.PI) / (DURATION_MS.micro / 1000);
  const TILT_ZETA = 1;
  const TILT_MAX = 0.14; // radians of fake-3D skew at the card edge
  const GLARE_MAX = 1; // multiplier on the additive specular hotspot
  const HOLO_ALPHA = 0.1; // resting holo-sweep peak (subtle, premium)
  const HOLO_ANGLE = -0.36; // diagonal streak tilt
  const HOLO_SPEED = 1 / 2600; // sweep cycles per ms (~2.6s per pass)
  const FACE_CORNER = 10; // baked face outer radius in 152-px face space

  // Frame-rate-independent damped-spring step (semi-implicit Euler).
  const springTo = (s, target, dt, omega, zeta) => {
    const k = omega * omega;
    const c = 2 * zeta * omega;
    s.v += (-k * (s.p - target) - c * s.v) * dt;
    s.p += s.v * dt;
    return s.p;
  };
  const chan = (p) => ({ p, v: 0 });
  const clamp1 = (v) => (v < -1 ? -1 : (v > 1 ? 1 : v));

  // Small HSL→int for the iridescent holo tint cycle.
  const hslInt = (h, s, l) => {
    const a = s * Math.min(l, 1 - l);
    const f = (n) => {
      const kk = (n + h / 30) % 12;
      const col = l - a * Math.max(-1, Math.min(kk - 3, 9 - kk, 1));
      return Math.round(255 * col);
    };
    return (f(0) << 16) | (f(8) << 8) | f(4);
  };

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
    lanternBoundsCache = null;
    endTurnBoundsCache = null;
    pileBoundsCache = Object.freeze({ draw: null, discard: null, ashes: null });
    hudCache = null;
      platesCache = null;
      handCache = null;
      aimPathCache = null;
      bottomChromeReady = false;
      hudReady = false;
      platesReady = false;
      handReady = false;
      clearBottomChromePaint();
      clearHudPaint();
      clearPlatesPaint();
      clearHandPaint();
      clearAimPaint();
      clearPulses();
      resetPaintSigs();
      bump();
      return null;
    }
    presentationModel = cloneImmutable(model);
    repaintRegions(false);
    bump();
    return presentationModel;
  };

  const mount = (model) => {
    if (model !== undefined) sync(model);
    else {
      repaintRegions(true);
      bump();
    }
    trace?.emit?.('renderer.mount', {
      outcome: 'completed',
      attributes: { rendererId: RENDERER_ID, generation, texturedReady },
    });
    return stats();
  };

  const layout = () => {
    repaintRegions(true);
    bump();
    return readUI();
  };

  // Pixi Text/Graphics retain canvas textures after detach; removeChildren alone
  // orphans them across every sync/paint and trips the P5 heap gate.
  // Pixi 8 footgun: destroy({ children: true }) does NOT destroy owned
  // GraphicsContext unless `context: true` is also set (see Graphics.destroy).
  function destroyLayerChildren(layer) {
    if (!layer) return;
    const kids = layer.removeChildren();
    for (const child of kids) {
      try {
        // context:true required for Graphics; omit texture:true so shared
        // Assets chrome sprites keep their atlas textures alive.
        child.destroy({ children: true, context: true });
      } catch { /* already reaped */ }
    }
  }

  function clearBottomChromePaint() {
    destroyLayerChildren(candlesLayer);
    destroyLayerChildren(energyNumLayer);
    destroyLayerChildren(lanternLayer);
    destroyLayerChildren(endTurnLayer);
    for (const key of Object.keys(pileLayers)) destroyLayerChildren(pileLayers[key]);
    bottomChromePainted = 0;
  }

  function clearHudPaint() {
    destroyLayerChildren(hudLayer);
    hudPainted = 0;
  }

  function clearPlatesPaint() {
    destroyLayerChildren(platesLayer);
    platesPainted = 0;
  }

  function makeHandEntry(root, uid) {
    // Deterministic phase offset per uid so rare cards never sweep in lockstep.
    let hash = 0;
    const s = String(uid);
    for (let i = 0; i < s.length; i += 1) hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
    return {
      root,
      face: null,
      sprite: null,
      desatFilter: null,
      fx: null,
      anim: null,
      target: null,
      hovered: false,
      dragging: false,
      foil: false,
      playable: true,
      faceW: CARD_FACE_WIDTH,
      faceH: CARD_FACE_HEIGHT,
      phase: (hash % 1000) / 1000,
      release: null,
      seatBounds: null,
      faceKey: null,
    };
  }

  // Tear down one hand seat's GPU resources (fx graphics/masks, the desaturate
  // filter, the composer ref, and the container). Filters/masks must never
  // outlive their GL context, so every disposal path routes through here.
  function disposeHandEntry(entry) {
    if (!entry) return;
    destroyCardFx(entry);
    if (entry.desatFilter) {
      if (entry.face) { try { entry.face.filters = null; } catch { /* ignore */ } }
      try { entry.desatFilter.destroy?.(); } catch { /* ignore */ }
      entry.desatFilter = null;
    }
    try { entry.release?.(); } catch { /* ignore */ }
    try { entry.root?.destroy?.({ children: true, context: true }); } catch { /* ignore */ }
  }

  function clearHandPaint() {
    for (const entry of handNodes.values()) disposeHandEntry(entry);
    handNodes.clear();
    destroyLayerChildren(handLayer);
    handPainted = 0;
    handReady = false;
    handCache = null;
  }

  function clearAimPaint() {
    destroyLayerChildren(aimLayer);
    aimPathCache = null;
  }

  // Opaque unplayable desaturation — mirrors the pre-pixi CSS
  // `saturate(.35) brightness(.7)` (alpha stays 1 so the battlefield never
  // bleeds through). One reused matrix per seat; toggled, never rebuilt.
  function makeDesatFilter() {
    const f = new ColorMatrixFilter();
    f.saturate(-0.975, false); // → ~35% saturation
    f.brightness(0.7, true); // ×0.7 luminance
    return f;
  }

  // Face-clipped FX layer: a rounded-rect mask matching the baked card
  // silhouette, plus a container that holds the holo band + specular glare so
  // both share a single mask. Rebuilt only when the face size changes.
  function ensureCardFx(entry) {
    const w = entry.faceW;
    const h = entry.faceH;
    const fx = entry.fx;
    if (fx && fx.layer && fx.w === w && fx.h === h) return fx;
    destroyCardFx(entry);
    const r = FACE_CORNER * (w / CARD_FACE_WIDTH);
    const mask = new Graphics();
    mask.roundRect(-w / 2, -h / 2, w, h, r).fill(0xffffff);
    mask.eventMode = 'none';
    const layer = new Container();
    layer.eventMode = 'none';
    layer.mask = mask;
    entry.root.addChild(mask, layer);
    entry.fx = {
      layer, mask, holo: null, glare: null, w, h,
    };
    return entry.fx;
  }

  function destroyCardFx(entry) {
    const fx = entry?.fx;
    if (!fx) return;
    // Detach masks first so Pixi does not try to reap them twice; layer
    // destroy(children) reaps holo + glare with it.
    for (const o of [fx.glare, fx.holo, fx.layer, fx.mask]) {
      if (!o) continue;
      try { o.mask = null; } catch { /* ignore */ }
      try { o.destroy?.({ children: true, context: true }); } catch { /* ignore */ }
    }
    entry.fx = null;
  }

  // Soft additive specular hotspot that follows the cursor over a hovered card.
  function ensureGlare(entry) {
    const fx = ensureCardFx(entry);
    if (fx.glare) return fx.glare;
    const R = Math.min(entry.faceW, entry.faceH) * 0.55;
    const g = new Graphics();
    g.circle(0, 0, R).fill({ color: 0xfff6dc, alpha: 0.1 });
    g.circle(0, 0, R * 0.62).fill({ color: 0xfff9ea, alpha: 0.16 });
    g.circle(0, 0, R * 0.3).fill({ color: 0xffffff, alpha: 0.26 });
    g.blendMode = 'add';
    g.eventMode = 'none';
    g.visible = false;
    fx.layer.addChild(g);
    fx.glare = g;
    return g;
  }

  // Diagonal iridescent band that sweeps across rare/boss faces on a time loop.
  function ensureHolo(entry) {
    const fx = ensureCardFx(entry);
    if (fx.holo) return fx.holo;
    const w = entry.faceW;
    const h = entry.faceH;
    const grad = new FillGradient({
      type: 'linear',
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 },
      textureSpace: 'local',
      colorStops: [
        { offset: 0, color: 'rgba(255,255,255,0)' },
        { offset: 0.5, color: 'rgba(255,255,255,1)' },
        { offset: 1, color: 'rgba(255,255,255,0)' },
      ],
    });
    const band = new Graphics();
    band.rect(-w * 0.21, -h * 0.85, w * 0.42, h * 1.7).fill(grad);
    band.rotation = HOLO_ANGLE;
    band.blendMode = 'add';
    band.eventMode = 'none';
    band.visible = false;
    fx.layer.addChild(band);
    fx.holo = band;
    return band;
  }

  const applyEntryTransform = (entry) => {
    const a = entry.anim;
    if (!a) return;
    const root = entry.root;
    root.position.set(a.x.p, a.y.p);
    root.rotation = a.rot.p;
    root.scale.set(a.scale.p);
    if (root.skew) root.skew.set(a.skewX.p, a.skewY.p);
  };

  // Store the resting/target transform for a seat and snap-initialise the
  // animated channels. Dragging + REDUCED bypass the spring (1:1 with input).
  const setEntryTarget = (entry, target, snap) => {
    entry.target = target;
    if (!entry.anim) {
      entry.anim = {
        x: chan(target.x),
        y: chan(target.y),
        rot: chan(target.rot),
        scale: chan(target.scale),
        skewX: chan(0),
        skewY: chan(0),
        glare: chan(0),
      };
      return;
    }
    if (snap) {
      const a = entry.anim;
      a.x.p = target.x; a.x.v = 0;
      a.y.p = target.y; a.y.v = 0;
      a.rot.p = target.rot; a.rot.v = 0;
      a.scale.p = target.scale; a.scale.v = 0;
      a.skewX.p = 0; a.skewX.v = 0;
      a.skewY.p = 0; a.skewY.v = 0;
      a.glare.p = 0; a.glare.v = 0;
    }
  };

  function applyPlayableFilter(entry, playable) {
    const face = entry.face;
    if (!face) return;
    if (playable) {
      if (face.filters) face.filters = null;
      return;
    }
    if (!entry.desatFilter) entry.desatFilter = makeDesatFilter();
    face.filters = [entry.desatFilter];
  }

  // Per-frame juice: spring the lift, cursor-track the tilt + glare, and sweep
  // the holo band. Runs off the Pixi Application ticker (see attachHandTicker).
  function tickHand(ticker) {
    if (destroyed) return;
    if (reducedMotion()) return; // transforms already snapped in paintHand
    const ms = Math.min(ticker?.deltaMS ?? 16.7, 40);
    const dt = ms / 1000;
    holoClock += ms;
    const lite = isLite();
    const bias = hitTestBias;
    for (const entry of handNodes.values()) {
      const t = entry.target;
      const a = entry.anim;
      if (!t || !a || !entry.root?.visible) continue;

      if (entry.dragging) {
        // Drag must stay glued to the finger — no spring lag, no fx.
        a.x.p = t.x; a.x.v = 0;
        a.y.p = t.y; a.y.v = 0;
        a.rot.p = t.rot; a.rot.v = 0;
        a.scale.p = t.scale; a.scale.v = 0;
        springTo(a.skewX, 0, dt, TILT_OMEGA, TILT_ZETA);
        springTo(a.skewY, 0, dt, TILT_OMEGA, TILT_ZETA);
        springTo(a.glare, 0, dt, TILT_OMEGA, TILT_ZETA);
        applyEntryTransform(entry);
        updateEntryFx(entry, 0, 0, lite);
        continue;
      }

      // Cursor-tracked 3D tilt + glare on the hovered, playable card (full tier).
      let skewX = 0;
      let skewY = 0;
      let glare = 0;
      let gx = 0;
      let gy = 0;
      if (!lite && entry.hovered && entry.playable && bias) {
        const halfW = (entry.faceW * t.scale) / 2 || 1;
        const halfH = (entry.faceH * t.scale) / 2 || 1;
        const dx = clamp1((bias.x - a.x.p) / halfW);
        const dy = clamp1((bias.y - a.y.p) / halfH);
        skewX = dy * TILT_MAX;
        skewY = -dx * TILT_MAX;
        glare = GLARE_MAX;
        gx = dx * entry.faceW * 0.42;
        gy = dy * entry.faceH * 0.42;
      }
      springTo(a.x, t.x, dt, LIFT_OMEGA, LIFT_ZETA);
      springTo(a.y, t.y, dt, LIFT_OMEGA, LIFT_ZETA);
      springTo(a.rot, t.rot, dt, LIFT_OMEGA, LIFT_ZETA);
      springTo(a.scale, t.scale, dt, LIFT_OMEGA, LIFT_ZETA);
      springTo(a.skewX, skewX, dt, TILT_OMEGA, TILT_ZETA);
      springTo(a.skewY, skewY, dt, TILT_OMEGA, TILT_ZETA);
      springTo(a.glare, glare, dt, TILT_OMEGA, TILT_ZETA);
      applyEntryTransform(entry);
      updateEntryFx(entry, gx, gy, lite);
    }
  }

  function updateEntryFx(entry, gx, gy, lite) {
    const a = entry.anim;
    // Specular glare — any playable card, faded in on hover.
    if (a.glare.p > 0.003) {
      const g = ensureGlare(entry);
      g.visible = true;
      g.alpha = a.glare.p;
      g.position.set(gx, gy);
    } else if (entry.fx?.glare) {
      entry.fx.glare.visible = false;
    }
    // Holo sweep — rare/boss only. Always-on at full tier; hover-only on LITE.
    const wantHolo = entry.foil && (!lite || entry.hovered);
    if (wantHolo) {
      const band = ensureHolo(entry);
      band.visible = true;
      const range = entry.faceW * 1.15;
      const phase = (holoClock * HOLO_SPEED + entry.phase) % 1;
      band.x = -range / 2 + phase * range;
      band.alpha = HOLO_ALPHA * (entry.hovered ? 1.7 : 1);
      band.tint = hslInt((holoClock * 0.018 + entry.phase * 140) % 360, 0.5, 0.85);
    } else if (entry.fx?.holo) {
      entry.fx.holo.visible = false;
    }
  }

  // The Pixi Application owns the frame loop; a rebuild (context loss) mints a
  // fresh Application + ticker, so attach is idempotent and re-run on rebuild.
  function attachHandTicker() {
    const ticker = pixiLayer.application?.()?.ticker;
    if (!ticker) return;
    if (handTicker === ticker && handTickHandler) return;
    detachHandTicker();
    handTickHandler = (tk) => { tickHand(tk); tickPulses(tk); };
    try {
      ticker.add(handTickHandler);
      handTicker = ticker;
    } catch {
      handTicker = null;
      handTickHandler = null;
    }
  }

  function detachHandTicker() {
    if (handTicker && handTickHandler) {
      try { handTicker.remove(handTickHandler); } catch { /* ignore */ }
    }
    handTicker = null;
    handTickHandler = null;
  }

  // --- Chrome micro-feedback pulse (Task: dead pops) --------------------------
  // A brief additive glow beat that blooms + fades out from a chrome widget's
  // centre when its value ticks. Decoupled from the painted chrome (which is
  // rebuilt each sync), so it never fights the widget's own repaint.
  const PULSE_MS = DURATION_MS.quick || 360;
  const PULSE_MAX = 24; // hard cap so a rapid event storm can't pile up GPU objects

  /** Resolve a pulse target keyword / plate descriptor / raw rect → bounds. */
  function resolvePulseBounds(target) {
    if (!target) return null;
    if (typeof target === 'string') {
      switch (target) {
        case 'energy': return candleFrameCache?.bounds || null;
        case 'lantern': return lanternBoundsCache;
        case 'end-turn': return endTurnBoundsCache;
        case 'draw': case 'discard': case 'ashes':
          return pileBoundsCache?.[target] || null;
        default: return null;
      }
    }
    if (typeof target === 'object') {
      if (target.width != null && (target.left != null || target.x != null)) return target;
      const isPlayer = target.who === 'player' || target.enemy == null;
      const plate = isPlayer ? platesCache?.hero : platesCache?.enemies?.[target.enemy];
      if (!plate) return null;
      if (target.kind === 'block') return plate.blockBounds || plate.plateBounds || null;
      return plate.plateBounds || null; // facet / generic plate beat
    }
    return null;
  }

  function spawnPulse(bounds, opts = {}) {
    if (destroyed || reducedMotion() || !bounds) return false;
    const width = bounds.width ?? ((bounds.right ?? 0) - (bounds.left ?? 0));
    const height = bounds.height ?? ((bounds.bottom ?? 0) - (bounds.top ?? 0));
    if (!(width > 0) || !(height > 0)) return false;
    const resolution = paintResolution(pixiLayer);
    const cx = (bounds.left ?? bounds.x ?? 0) + width / 2;
    const cy = (bounds.top ?? bounds.y ?? 0) + height / 2;
    const tone = Number.isFinite(opts.tone) ? opts.tone : 0xffd8a0;
    const R = Math.max(12, Math.min(width, height) * 0.62);
    const g = new Graphics();
    g.circle(0, 0, R * 0.72).fill({ color: tone, alpha: 0.14 });
    g.circle(0, 0, R * 0.42).fill({ color: tone, alpha: 0.20 });
    g.circle(0, 0, R).stroke({ width: 3, color: tone, alpha: 0.85 });
    g.blendMode = 'add';
    g.eventMode = 'none';
    g.position.set(snapStage(cx, resolution), snapStage(cy, resolution));
    g.scale.set(0.5);
    pulseLayer.addChild(g);
    if (pulses.length >= PULSE_MAX) {
      const old = pulses.shift();
      try { old.g.destroy({ children: true, context: true }); } catch { /* ignore */ }
    }
    pulses.push({ g, t: 0, dur: Math.max(160, opts.dur || PULSE_MS) });
    attachHandTicker();
    return true;
  }

  function tickPulses(ticker) {
    if (destroyed || !pulses.length) return;
    const ms = Math.min(ticker?.deltaMS ?? 16.7, 40);
    for (let i = pulses.length - 1; i >= 0; i -= 1) {
      const pz = pulses[i];
      pz.t += ms;
      const k = pz.t / pz.dur;
      if (k >= 1) {
        try { pz.g.destroy({ children: true, context: true }); } catch { /* ignore */ }
        pulses.splice(i, 1);
        continue;
      }
      const inv = 1 - k;
      pz.g.scale.set(0.5 + (1 - inv * inv * inv) * 0.85); // easeOutCubic bloom
      pz.g.alpha = inv * inv; // easeOut fade
    }
  }

  function clearPulses() {
    for (const pz of pulses) {
      try { pz.g.destroy({ children: true, context: true }); } catch { /* ignore */ }
    }
    pulses.length = 0;
  }

  function ensureHandFace(entry, card, faceW, faceH) {
    const nextKey = typeof cardFace.faceCacheKeyFor === 'function'
      ? cardFace.faceCacheKeyFor(faceDescriptor(card), faceDisplayState(card))
      : `${card.id}:${card.effectiveCost}:${card.upgraded ? 1 : 0}`;
    if (entry.faceKey === nextKey && entry.face) return;

    try { entry.release?.(); } catch { /* ignore */ }
    entry.release = null;
    entry.faceKey = null;
    if (entry.face) {
      try { entry.root.removeChild(entry.face); } catch { /* ignore */ }
      try { entry.face.destroy?.({ children: true }); } catch { /* ignore */ }
      entry.face = null;
    }
    entry.sprite = null;

    let texture = null;
    try {
      // Preview-resolved value tint rides on faceDisplayState().values (set in
      // combat.js buildHandModel) — acquire() bakes it, faceCacheKeyFor() above
      // folds it into nextKey so a value change re-bakes.
      const acquired = cardFace.acquire(faceDescriptor(card), faceDisplayState(card));
      entry.release = acquired.release;
      entry.faceKey = acquired.key;
      texture = acquired.texture;
    } catch {
      texture = null;
    }

    if (texture && !texture.__stub) {
      const sprite = new Sprite(texture);
      sprite.width = faceW;
      sprite.height = faceH;
      sprite.anchor?.set?.(0.5, 0.5);
      sprite.eventMode = 'none';
      entry.root.addChildAt(sprite, 0);
      entry.face = sprite;
      entry.sprite = sprite;
    } else {
      const fallback = new Graphics();
      fallback.roundRect(-faceW / 2, -faceH / 2, faceW, faceH, 10)
        .fill({ color: 0x1a2034, alpha: 0.92 })
        .stroke({ color: 0xf2c14e, width: 2, alpha: 0.7 });
      fallback.eventMode = 'none';
      entry.root.addChildAt(fallback, 0);
      entry.face = fallback;
      entry.sprite = null;
      entry.faceKey = nextKey;
    }
  }

  function paintHand() {
    const model = presentationModel?.hand;
    if (!model || !Array.isArray(model.cards)) {
      clearHandPaint();
      return;
    }
    const resolution = paintResolution(pixiLayer);
    const faceW = model.face?.w || CARD_FACE_WIDTH;
    const faceH = model.face?.h || CARD_FACE_HEIGHT;
    const zone = model.zone || {};
    const zoneCenterX = zone.centerX ?? (stageW() / 2);
    const baseBottom = zone.baseBottom ?? (stageH() - (zone.cardInset ?? 8));
    const stageWidth = stageW();
    const fanCards = model.cards.filter((c) => !c.pending);
    const fanN = fanCards.length;
    const want = new Set(model.cards.map((c) => String(c.uid)));

    // Membership change only — release departed seats; keep survivors.
    for (const [uid, entry] of [...handNodes.entries()]) {
      if (!want.has(uid)) {
        disposeHandEntry(entry);
        handNodes.delete(uid);
      }
    }

    const seats = [];
    let painted = 0;
    fanCards.forEach((card, fanIndex) => {
      const uid = String(card.uid);
      const seat = pureHandSeatCenter(fanIndex, fanN, {
        stageW: stageWidth,
        cardW: faceW,
        cardH: faceH,
        zoneCenterX,
        baseBottom,
      });
      const armed = model.targetingUid != null && String(model.targetingUid) === uid;
      const hovered = model.hoveredUid != null && String(model.hoveredUid) === uid
        && !model.busy && !armed;
      const selected = model.selectedUid != null && String(model.selectedUid) === uid;
      const dragging = model.draggingUid != null && String(model.draggingUid) === uid;
      const off = handSeatOffset(fanIndex, fanN, stageWidth);
      let x = seat.x;
      let y = seat.y;
      let rot = seat.rot;
      let scale = 1;
      // Armed (targeting) compresses fan toward centre — matches P4 layoutHand.
      if (armed && !dragging) {
        x = zoneCenterX + off.x * 0.4;
        rot = off.rot * 0.5;
        scale = 1.08;
        y = seat.y - 24;
      } else if (hovered || selected) {
        // FE Hand hover: y -20, scale 1.08, rotation 0°.
        y = seat.y - 20;
        rot = 0;
        scale = 1.08;
      }
      if (dragging && model.drag) {
        x = model.drag.x ?? x;
        y = model.drag.y ?? y;
        rot = model.drag.rot ?? 0;
        scale = model.drag.scale ?? 1.12;
      }

      let entry = handNodes.get(uid);
      if (!entry) {
        const root = new Container();
        root.label = `hand-card:${uid}`;
        root.eventMode = 'none';
        handLayer.addChild(root);
        entry = makeHandEntry(root, uid);
        handNodes.set(uid, entry);
      }

      entry.faceW = faceW;
      entry.faceH = faceH;
      entry.hovered = !!(hovered || selected);
      entry.dragging = !!dragging;
      entry.foil = card.rarity === 'rare' || card.rarity === 'boss';
      entry.playable = !!card.playable;

      ensureHandFace(entry, card, faceW, faceH);
      applyPlayableFilter(entry, card.playable);

      const root = entry.root;
      // Opaque desaturation (not alpha) now conveys unplayable — Task 2.
      root.alpha = 1;
      const sx = snapStage(x, resolution);
      const sy = snapStage(y, resolution);
      // Visual transform springs toward this target on the ticker (Task 1);
      // hit-test geometry below stays snapped to the resting/lifted seat.
      setEntryTarget(entry, {
        x, y, rot: (rot * Math.PI) / 180, scale,
      }, dragging || reducedMotion());
      applyEntryTransform(entry);
      root.zIndex = (hovered || armed || selected || dragging) ? 40 : 20 + fanIndex;
      root.visible = true;

      const seatBounds = Object.freeze({
        left: seat.left,
        top: seat.top,
        right: seat.right,
        bottom: seat.bottom,
        width: seat.width,
        height: seat.height,
      });
      entry.seatBounds = seatBounds;
      seats.push(Object.freeze({
        uid: card.uid,
        id: card.id,
        seatBounds,
        bounds: dragging && model.drag?.bounds
          ? Object.freeze({ ...model.drag.bounds })
          : Object.freeze({
            left: sx - (faceW * scale) / 2,
            top: sy - (faceH * scale) / 2,
            right: sx + (faceW * scale) / 2,
            bottom: sy + (faceH * scale) / 2,
            width: faceW * scale,
            height: faceH * scale,
          }),
        playable: !!card.playable,
        pending: false,
        hovered: !!hovered,
        armed: !!armed,
        selected: !!selected,
        dragging: !!dragging,
        foil: !isLite() && (card.rarity === 'rare' || card.rarity === 'boss'),
        sheen: isLite() ? 'flat' : 'foil',
        faceKey: entry.faceKey,
      }));
      painted += 1;
    });

    // Pending (draw-in-flight) seats stay invisible but reserved in engine hand.
    for (const card of model.cards) {
      if (!card.pending) continue;
      const uid = String(card.uid);
      let entry = handNodes.get(uid);
      if (!entry) {
        const root = new Container();
        root.label = `hand-card:${uid}`;
        root.eventMode = 'none';
        root.visible = false;
        handLayer.addChild(root);
        entry = makeHandEntry(root, uid);
        handNodes.set(uid, entry);
      } else {
        entry.root.visible = false;
      }
      seats.push(Object.freeze({
        uid: card.uid,
        id: card.id,
        seatBounds: entry.seatBounds,
        bounds: entry.seatBounds,
        playable: !!card.playable,
        pending: true,
        hovered: false,
        armed: false,
        selected: false,
        dragging: false,
        foil: !isLite() && (card.rarity === 'rare' || card.rarity === 'boss'),
        sheen: isLite() ? 'flat' : 'foil',
        faceKey: entry.faceKey,
      }));
      painted += 1;
    }

    handLayer.sortableChildren = true;
    handPainted = painted;
    // Ready only when every engine hand uid has a seat row (strict membership).
    handReady = painted === model.cards.length;
    handCache = Object.freeze({
      seats: Object.freeze(seats),
      face: Object.freeze({ w: faceW, h: faceH }),
      zone: Object.freeze({
        centerX: zoneCenterX,
        baseBottom,
        left: zone.left ?? null,
        top: zone.top ?? null,
        width: zone.width ?? null,
        height: zone.height ?? null,
        bottom: zone.bottom ?? null,
      }),
      restingHandFloor: zone.top ?? (baseBottom - faceH + 26),
      hoveredUid: model.hoveredUid ?? null,
      targetingUid: model.targetingUid ?? null,
      selectedUid: model.selectedUid ?? null,
      selectedEnemyIndex: model.selectedEnemyIndex ?? null,
      draggingUid: model.draggingUid ?? null,
    });
  }

  function paintAim() {
    clearAimPaint();
    const aim = presentationModel?.aim;
    if (!aim || aim.from == null || aim.to == null) {
      aimPathCache = null;
      return;
    }
    const from = aim.from;
    const to = aim.to;
    const cx = (from.x + to.x) / 2;
    const cy = Math.min(from.y, to.y) - 120;
    // Quadratic control points (P0 = card, C = apex, P1 = reticle).
    const p0x = from.x;
    const p0y = from.y - 80;
    const bez = (t) => {
      const u = 1 - t;
      return {
        x: u * u * p0x + 2 * u * t * cx + t * t * to.x,
        y: u * u * p0y + 2 * u * t * cy + t * t * to.y,
      };
    };
    const g = new Graphics();
    // Sample the curve into ~10 round-capped dashes (62% ink / 38% gap per cell)
    // for the targeting-reticle look. Two passes: a soft wide glow under crisp ink.
    const DASHES = 10;
    const INK = 0.62;
    const drawDashes = () => {
      for (let i = 0; i < DASHES; i += 1) {
        const a = bez(i / DASHES);
        const b = bez((i + INK) / DASHES);
        g.moveTo(a.x, a.y).lineTo(b.x, b.y);
      }
    };
    drawDashes();
    g.stroke({
      width: 9, color: 0xff5964, alpha: 0.16, cap: 'round', pixelLine: false,
    });
    drawDashes();
    g.stroke({
      width: 4, color: 0xff8a92, alpha: 0.92, cap: 'round', pixelLine: false,
    });
    // Reticle: a ringed crosshair at the aim point.
    g.circle(to.x, to.y, 11).stroke({ width: 2.5, color: 0xff5964, alpha: 0.95 });
    g.circle(to.x, to.y, 3).fill({ color: 0xff8a92, alpha: 0.9 });
    g.eventMode = 'none';
    aimLayer.addChild(g);
    aimPathCache = Object.freeze({
      from: Object.freeze({ ...from }),
      to: Object.freeze({ ...to }),
      control: Object.freeze({ x: cx, y: cy }),
    });
  }

  function paintBottomChrome() {
    const info = stageInfo();
    const chrome = uicResolve(info.shape);
    const resolution = paintResolution(pixiLayer);
    let painted = 0;
    painted += paintCandles(chrome, resolution) ? 1 : 0;
    painted += paintEnergyNumber(chrome, resolution) ? 1 : 0;
    painted += paintLantern(chrome, resolution) ? 1 : 0;
    painted += paintEndTurn(chrome, resolution) ? 1 : 0;
    painted += paintPile('draw', chrome.draw, resolution) ? 1 : 0;
    painted += paintPile('discard', chrome.discard, resolution) ? 1 : 0;
    painted += paintPile('ashes', chrome.ashes, resolution) ? 1 : 0;
    bottomChromePainted = painted;
    bottomChromeReady = painted >= 4; // candles + lantern + end-turn + 3 piles = 6; count anything ≥4 as steady
  }

  function paintCandles(chrome, resolution) {
    destroyLayerChildren(candlesLayer);
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
    const frameLeft = snapStage(
      Number.isFinite(chromeEnergy.left) ? chromeEnergy.left : 0,
      resolution,
    );
    const frameBottom = Number.isFinite(chromeEnergy.bottom) ? chromeEnergy.bottom : 0;
    const frameH = snapStage(frame.h, resolution);
    const frameW = snapStage(frame.w, resolution);
    const stageHeight = stageH();
    const frameTop = snapStage(stageHeight - frameBottom - frame.h, resolution);
    const n = states.length || Math.max(1, energyMax || 3);
    const pitch = frameW / n;
    const slotW = snapStage(Math.min(CANDLE_SLOT_MAX_W, pitch), resolution);
    const slots = [];
    for (let i = 0; i < n; i += 1) {
      const st = states[i] || 'spent';
      const cx = snapStage(frameLeft + (i + 0.5) * pitch, resolution);
      const alias = st === 'lit' ? 'combat-gl:ui/candle-lit' : 'combat-gl:ui/candle-spent';
      const tex = pixiTextureForAlias(textureAliases, alias);
      const cy = snapStage(frameTop + frameH, resolution);
      if (tex) {
        const sprite = new Sprite(tex);
        sprite.anchor.set(0.5, 1);
        sprite.width = slotW;
        sprite.height = frameH;
        sprite.x = cx;
        sprite.y = cy;
        candlesLayer.addChild(sprite);
      } else {
        const g = new Graphics();
        g.roundRect(-slotW / 2, -frameH, slotW * 0.85, frameH, 4)
          .fill({ color: st === 'lit' ? 0xffc95e : 0x232a40, alpha: st === 'lit' ? 0.95 : 0.75 });
        g.x = cx;
        g.y = cy;
        candlesLayer.addChild(g);
      }
      slots.push(Object.freeze({
        index: i,
        state: st,
        bounds: Object.freeze({
          left: snapStage(cx - slotW / 2, resolution),
          top: frameTop,
          right: snapStage(cx + slotW / 2, resolution),
          bottom: snapStage(frameTop + frameH, resolution),
          width: slotW,
          height: frameH,
        }),
      }));
    }
    candleFrameCache = Object.freeze({
      bounds: Object.freeze({
        left: frameLeft,
        top: frameTop,
        right: snapStage(frameLeft + frameW, resolution),
        bottom: snapStage(frameTop + frameH, resolution),
        width: frameW,
        height: frameH,
      }),
      slots: Object.freeze(slots),
    });
    return true;
  }

  function paintEnergyNumber(chrome, resolution) {
    destroyLayerChildren(energyNumLayer);
    const chromeEnergy = chrome.energy;
    if (!chromeEnergy) return false;
    const bottomState = presentationModel?.bottomChrome;
    const energy = Number(bottomState?.energy ?? presentationModel?.hero?.energy ?? 0) | 0;
    const info = stageInfo();
    const frame = candleFrameFor(info.shape);
    const frameLeft = snapStage(
      Number.isFinite(chromeEnergy.left) ? chromeEnergy.left : 0,
      resolution,
    );
    const frameBottom = Number.isFinite(chromeEnergy.bottom) ? chromeEnergy.bottom : 0;
    const frameTop = snapStage(stageH() - frameBottom - frame.h, resolution);
    const frameW = snapStage(frame.w, resolution);
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
    label.x = snapStage(frameLeft + frameW / 2, resolution);
    label.y = snapStage(frameTop - 4, resolution);
    energyNumLayer.addChild(label);
    return true;
  }

  function paintLantern(chrome, resolution) {
    destroyLayerChildren(lanternLayer);
    const w = chrome.lantern;
    if (!w) { lanternBoundsCache = null; return false; }
    const width = snapStage(w.w ?? 104, resolution);
    const height = snapStage(w.h ?? 104, resolution);
    const bx = snapStage(
      Number.isFinite(w.left) ? w.left : (stageW() - (w.right ?? 0) - (w.w ?? 0)),
      resolution,
    );
    const by = snapStage(stageH() - (w.bottom ?? 0) - (w.h ?? 0), resolution);
    lanternBoundsCache = Object.freeze({
      left: bx, top: by, right: bx + width, bottom: by + height, width, height,
    });
    const bottomState = presentationModel?.bottomChrome;
    const embers = Math.max(0, Number(bottomState?.embers ?? presentationModel?.embers ?? 0) | 0);
    const cap = Math.max(embers, Number(bottomState?.emberCap ?? 9) | 0);
    const ready = !!bottomState?.lanternReady;
    const artSpent = !!bottomState?.lanternArtSpent;
    const cx = snapStage(bx + width / 2, resolution);
    const cy = snapStage(by + height / 2, resolution);
    const tex = pixiTextureForAlias(textureAliases, 'combat-gl:ui/lantern');
    if (tex) {
      const s = new Sprite(tex);
      s.anchor.set(0.5, 0.5);
      s.width = width;
      s.height = height;
      s.x = cx;
      s.y = cy;
      s.alpha = artSpent ? 0.65 : (embers === 0 ? 0.7 : 1);
      lanternLayer.addChild(s);
    } else {
      const g = new Graphics();
      g.circle(cx, cy, Math.min(width, height) * 0.44)
        .fill({ color: 0x9c7c34, alpha: 0.9 })
        .stroke({ color: 0xf2c14e, width: 2 });
      lanternLayer.addChild(g);
    }
    // ember pips: ring around the lantern face
    if (cap > 0) {
      const pipsRadius = Math.min(width, height) * 0.5 + 6;
      for (let i = 0; i < cap; i += 1) {
        const angle = (Math.PI / 180) * (Math.round((i / Math.max(cap - 1, 1)) * 280 - 140));
        const px = snapStage(cx + pipsRadius * Math.cos(angle), resolution);
        const py = snapStage(cy + pipsRadius * Math.sin(angle), resolution);
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
    count.x = cx;
    count.y = snapStage(cy + height * 0.28, resolution);
    lanternLayer.addChild(count);
    // ready halo
    if (ready) {
      const halo = new Graphics();
      halo.circle(cx, cy, Math.min(width, height) * 0.56)
        .stroke({ color: 0xf2c14e, width: 2, alpha: 0.6 });
      lanternLayer.addChild(halo);
    }
    return true;
  }

  function paintEndTurn(chrome, resolution) {
    destroyLayerChildren(endTurnLayer);
    const w = chrome.endTurn;
    if (!w) { endTurnBoundsCache = null; return false; }
    const width = snapStage(w.w ?? 120, resolution);
    const height = snapStage(w.h ?? 120, resolution);
    const bx = snapStage(
      Number.isFinite(w.left)
        ? w.left
        : (stageW() - (Number(w.right) || 0) - (w.w ?? 120)),
      resolution,
    );
    const by = snapStage(stageH() - (w.bottom ?? 0) - (w.h ?? 120), resolution);
    endTurnBoundsCache = Object.freeze({
      left: bx, top: by, right: bx + width, bottom: by + height, width, height,
    });
    const enabled = presentationModel?.bottomChrome?.endTurnEnabled ?? false;
    const cx = snapStage(bx + width / 2, resolution);
    const cy = snapStage(by + height / 2, resolution);
    const tex = pixiTextureForAlias(textureAliases, 'combat-gl:ui/end-turn');
    if (tex) {
      const s = new Sprite(tex);
      s.anchor.set(0.5, 0.5);
      s.width = width;
      s.height = height;
      s.x = cx;
      s.y = cy;
      s.alpha = enabled ? 1 : 0.9;
      endTurnLayer.addChild(s);
    } else {
      const g = new Graphics();
      g.roundRect(bx, by, width, height, 12)
        .fill({ color: 0x9c7c34, alpha: 0.85 })
        .stroke({ color: 0xf2c14e, width: 2 });
      endTurnLayer.addChild(g);
    }
    const endLabel = presentationModel?.bottomChrome?.endTurnLabel ?? 'End';
    const label = new Text({
      text: String(endLabel),
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
    label.x = cx;
    label.y = snapStage(cy + height * 0.32, resolution);
    endTurnLayer.addChild(label);
    return true;
  }

  function paintPile(pileKey, widget, resolution) {
    const layer = pileLayers[pileKey];
    if (!layer) return false;
    destroyLayerChildren(layer);
    if (!widget) {
      pileBoundsCache = Object.freeze({ ...pileBoundsCache, [pileKey]: null });
      return false;
    }
    const width = snapStage(widget.w ?? 96, resolution);
    const height = snapStage(widget.h ?? 148, resolution);
    const bx = snapStage(
      Number.isFinite(widget.left)
        ? widget.left
        : (stageW() - (Number(widget.right) || 0) - (widget.w ?? 96)),
      resolution,
    );
    const by = snapStage(stageH() - (widget.bottom ?? 0) - (widget.h ?? 148), resolution);
    pileBoundsCache = Object.freeze({
      ...pileBoundsCache,
      [pileKey]: Object.freeze({
        left: bx, top: by, right: bx + width, bottom: by + height, width, height,
      }),
    });
    const bottomState = presentationModel?.bottomChrome;
    const pileState = bottomState?.piles?.[pileKey]
      || (presentationModel?.piles ? { count: presentationModel.piles[pileKey] } : { count: 0 });
    const count = Math.max(0, Number(pileState?.count ?? 0) | 0);
    const layers = pileFanLayers(count);
    const alias = `combat-gl:pile/${pileKey}`;
    const tex = pixiTextureForAlias(textureAliases, alias);
    const stackBottomInset = snapStage(18, resolution);
    const cx = snapStage(bx + width / 2, resolution);
    if (count > 0 && tex && layers > 0) {
      for (let i = 0; i < layers; i += 1) {
        const s = new Sprite(tex);
        s.anchor.set(0.5, 1);
        s.width = width;
        s.height = snapStage(height - stackBottomInset, resolution);
        s.x = cx;
        s.y = snapStage(by + height - stackBottomInset, resolution);
        s.rotation = (Math.PI / 180) * pileFanAngleDeg(i, layers);
        layer.addChild(s);
      }
    } else if (count === 0) {
      // Empty pile — skip plate; leave count/label only.
    } else {
      const g = new Graphics();
      g.roundRect(bx, by, width, snapStage(height - stackBottomInset, resolution), 8)
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
    cnt.x = snapStage(bx + width - 2, resolution);
    cnt.y = snapStage(by + height - 16, resolution);
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
    label.x = cx;
    label.y = snapStage(by + height, resolution);
    layer.addChild(label);
    return true;
  }

  function addIconOrFallback(parent, alias, x, y, size, color = 0xf2c14e, resolution = 1) {
    const sx = snapStage(x, resolution);
    const sy = snapStage(y, resolution);
    const sz = snapStage(size, resolution);
    const tex = pixiTextureForAlias(textureAliases, alias);
    if (tex) {
      const s = new Sprite(tex);
      s.anchor.set(0.5, 0.5);
      s.width = sz;
      s.height = sz;
      s.x = sx;
      s.y = sy;
      parent.addChild(s);
      return s;
    }
    const g = new Graphics();
    g.roundRect(-sz / 2, -sz / 2, sz, sz, 4)
      .fill({ color, alpha: 0.9 });
    g.x = sx;
    g.y = sy;
    parent.addChild(g);
    return g;
  }

  /**
   * Paint HUD chrome from live DOM seats / uicResolve fallbacks — same dual-read
   * pattern as plates — so paint and hit proxies share stage-px coordinates.
   */
  function paintHudChrome() {
    clearHudPaint();
    const hudState = presentationModel?.hud;
    if (!hudState) {
      hudCache = null;
      hudReady = false;
      return;
    }
    const info = stageInfo();
    const chrome = uicResolve(info.shape);
    const resolution = paintResolution(pixiLayer);
    const stageWidth = stageW();
    let painted = 0;

    // Prefer the live `.hud-bar` layout box (safe-area + shape scale baked in).
    const barDom = domRect('#hud .hud-bar');
    const hudCfg = chrome.hud || { height: 56, scale: 1 };
    const barH = snapStage(barDom?.height
      || ((hudCfg.height || 56) * (hudCfg.scale || 1)), resolution);
    const barTop = snapStage(barDom?.top ?? 0, resolution);
    const barLeft = snapStage(barDom?.left ?? 0, resolution);
    const barWidth = snapStage(barDom?.width || stageWidth, resolution);

    const barBg = new Graphics();
    barBg.rect(barLeft, barTop, barWidth, barH)
      .fill({ color: 0x080a16, alpha: 0.82 });
    hudLayer.addChild(barBg);
    painted += 1;

    // HP seat
    const hpWrap = seatCenter(domRect('#hud .hud-hp-wrap'));
    if (hpWrap) {
      const heart = seatCenter(domRect('#hud .hud-hp-wrap .ui-icon, #hud .hud-hp-wrap .gicon'))
        || { x: hpWrap.x - hpWrap.w * 0.35, y: hpWrap.y - 4, w: 14, h: 14 };
      addIconOrFallback(hudLayer, 'combat-gl:ui/heart', heart.x, heart.y, Math.max(12, heart.w || 14), 0xff7060, resolution);
      const hpNum = seatCenter(domRect('#hud .hud-hp-wrap .hp-num'));
      const hpText = new Text({
        text: `${hudState.hp} / ${hudState.maxHp}`,
        style: {
          fontFamily: 'Cinzel', fontSize: 15, fontWeight: '700',
          fill: 0xff9aa0,
        },
      });
      if (hpNum) {
        hpText.anchor?.set?.(0, 0.5);
        hpText.x = snapStage(hpNum.x - hpNum.w / 2, resolution);
        hpText.y = snapStage(hpNum.y, resolution);
      } else {
        hpText.x = snapStage(hpWrap.x - hpWrap.w * 0.2, resolution);
        hpText.y = snapStage(hpWrap.y - 10, resolution);
      }
      hudLayer.addChild(hpText);
      const barSeat = domRect('#hud .hud-hpbar');
      if (barSeat) {
        const snapped = snapRect(barSeat, resolution);
        const hpTrack = new Graphics();
        hpTrack.roundRect(snapped.left, snapped.top, snapped.width, Math.max(4, snapped.height), 3)
          .fill({ color: 0xffffff, alpha: 0.12 });
        const fillW = snapStage(Math.max(0, Math.min(barSeat.width,
          barSeat.width * (hudState.hp / Math.max(1, hudState.maxHp)))), resolution);
        hpTrack.roundRect(snapped.left, snapped.top, fillW, Math.max(4, snapped.height), 3)
          .fill({ color: 0xff7060, alpha: 0.95 });
        hudLayer.addChild(hpTrack);
      }
      painted += 1;
    }

    // Gold seat — second `.hud-stat` in the bar (after HP wrap).
    const goldStat = (() => {
      if (typeof document === 'undefined') return null;
      const stats = document.querySelectorAll('#hud .hud-bar > .hud-stat');
      return stats.length ? seatCenter(stageRect(stats[0])) : null;
    })();
    const goldNum = seatCenter(domRect('#hud .gold-num'));
    if (goldNum || goldStat) {
      const coin = seatCenter(domRect('#hud .hud-bar > .hud-stat .ui-icon, #hud .hud-bar > .hud-stat .gicon'))
        || (goldStat ? { x: goldStat.x - 20, y: goldStat.y, w: 14, h: 14 } : null);
      if (coin) {
        addIconOrFallback(hudLayer, 'combat-gl:ui/coin', coin.x, coin.y, Math.max(12, coin.w || 14), 0xf2c14e, resolution);
      }
      const goldText = new Text({
        text: String(hudState.gold ?? 0),
        style: {
          fontFamily: 'Cinzel', fontSize: 15, fontWeight: '700',
          fill: 0xf2c14e,
        },
      });
      if (goldNum) {
        goldText.anchor?.set?.(0, 0.5);
        goldText.x = snapStage(goldNum.x - goldNum.w / 2, resolution);
        goldText.y = snapStage(goldNum.y, resolution);
      } else if (goldStat) {
        goldText.x = snapStage(goldStat.x, resolution);
        goldText.y = snapStage(goldStat.y - 8, resolution);
      }
      hudLayer.addChild(goldText);
    }

    // Mid act label — DOM seat is the source of truth: narrow shapes hide
    // .hud-mid (act & floor live on the map title), so no seat = no paint.
    const midSeat = seatCenter(domRect('#hud .hud-mid'));
    if (midSeat) {
      const mid = new Text({
        text: `${String(hudState.actName || '').toUpperCase()}  ·  Act ${hudState.act ?? 1}  ·  Floor ${hudState.floor ?? 0}  ·  ${hudState.bossName || ''}`,
        style: {
          fontFamily: 'Cinzel', fontSize: 12, fontWeight: '600',
          fill: 0xb8b4a8, letterSpacing: 1.5,
          // Wrap inside the DOM seat like .hud-mid does — an unwrapped line
          // spills over the gold/phial widgets on pad portrait.
          wordWrap: true, wordWrapWidth: Math.max(60, midSeat.w), align: 'center',
        },
      });
      mid.anchor?.set?.(0.5, 0.5);
      mid.x = snapStage(midSeat.x, resolution);
      mid.y = snapStage(midSeat.y, resolution);
      hudLayer.addChild(mid);
    }

    // Deck + menu — paint into the same seats the hit proxies cover.
    const deckSeat = seatCenter(domRect('#hud [data-act="deck"]'));
    const menuSeat = seatCenter(domRect('#hud [data-act="menu"]'));
    if (deckSeat) {
      addIconOrFallback(hudLayer, 'combat-gl:ui/deck', deckSeat.x, deckSeat.y,
        Math.max(28, Math.min(deckSeat.w, deckSeat.h) * 0.85), 0x9c7c34, resolution);
      const deckCount = new Text({
        text: String(hudState.deckCount ?? 0),
        style: {
          fontFamily: 'Cinzel', fontSize: 18, fontWeight: '800',
          fill: 0xffffff,
          stroke: { color: 0x000000, width: 2, join: 'round' },
        },
      });
      deckCount.anchor?.set?.(0.5, 0.5);
      deckCount.x = snapStage(deckSeat.x, resolution);
      deckCount.y = snapStage(deckSeat.y, resolution);
      hudLayer.addChild(deckCount);
      painted += 1;
    }
    if (menuSeat) {
      addIconOrFallback(hudLayer, 'combat-gl:ui/menu', menuSeat.x, menuSeat.y,
        Math.max(16, Math.min(menuSeat.w, menuSeat.h) * 0.7), 0xe8dfc8, resolution);
    }

    // Potion slots from live DOM seats (shared with potion proxies).
    if (typeof document !== 'undefined') {
      document.querySelectorAll('#hud .potion-slot').forEach((slot) => {
        const r = stageRect(slot);
        if (!(r.width > 0 && r.height > 0)) return;
        const cx = snapStage(r.left + r.width / 2, resolution);
        const cy = snapStage(r.top + r.height / 2, resolution);
        const rw = snapStage(r.width, resolution);
        const rh = snapStage(r.height, resolution);
        const full = slot.classList.contains('full');
        const g = new Graphics();
        g.roundRect(-rw / 2, -rh / 2, rw, rh, 6)
          .fill({ color: 0x12162a, alpha: 0.85 })
          .stroke({ color: full ? 0xf2c14e : 0x445, width: 1.5, alpha: full ? 0.8 : 0.4 });
        g.x = cx;
        g.y = cy;
        hudLayer.addChild(g);
        if (full) {
          const mark = new Text({
            text: '◇',
            style: { fontFamily: 'Cinzel', fontSize: 16, fill: 0xf2c14e },
          });
          mark.anchor?.set?.(0.5, 0.5);
          mark.x = cx;
          mark.y = cy;
          hudLayer.addChild(mark);
        }
      });
    }

    // Omen — live chip seat, else uicResolve omen widget.
    const omenChip = seatCenter(domRect('#hud #omen-slot > *'))
      || seatCenter(domRect('#hud #omen-slot'));
    if (hudState.omen) {
      const omenW = chrome.omen;
      const size = snapStage(omenChip
        ? Math.max(24, Math.min(omenChip.w, omenChip.h))
        : 36 * (omenW?.scale ?? 1), resolution);
      const ox = snapStage(omenChip ? omenChip.x - size / 2 : (omenW?.left ?? 16), resolution);
      const oy = snapStage(omenChip ? omenChip.y - size / 2 : (omenW?.top ?? 62), resolution);
      const g = new Graphics();
      g.roundRect(0, 0, size, size, 8)
        .fill({ color: 0x1a1430, alpha: 0.9 })
        .stroke({ color: 0xc99aff, width: 1.5 });
      g.x = ox;
      g.y = oy;
      hudLayer.addChild(g);
      const mark = new Text({
        text: '✦',
        style: { fontFamily: 'Cinzel', fontSize: 16, fill: 0xc99aff },
      });
      mark.anchor?.set?.(0.5, 0.5);
      mark.x = snapStage(ox + size / 2, resolution);
      mark.y = snapStage(oy + size / 2, resolution);
      hudLayer.addChild(mark);
    }

    // Relics — live `.hud-relic` seats, else uicResolve relic bar fallback.
    const relicNodes = typeof document !== 'undefined'
      ? [...document.querySelectorAll('#hud .hud-relic')]
      : [];
    if (relicNodes.length) {
      relicNodes.forEach((chip) => {
        const r = stageRect(chip);
        if (!(r.width > 0 && r.height > 0)) return;
        const snapped = snapRect(r, resolution);
        const g = new Graphics();
        g.roundRect(0, 0, snapped.width, snapped.height, 8)
          .fill({ color: 0x141828, alpha: 0.9 })
          .stroke({ color: 0xf2c14e, width: 1, alpha: 0.55 });
        g.x = snapped.left;
        g.y = snapped.top;
        hudLayer.addChild(g);
        const mark = new Text({
          text: '◈',
          style: { fontFamily: 'Cinzel', fontSize: 14, fill: 0xf2c14e },
        });
        mark.anchor?.set?.(0.5, 0.5);
        mark.x = snapStage(snapped.left + snapped.width / 2, resolution);
        mark.y = snapStage(snapped.top + snapped.height / 2, resolution);
        hudLayer.addChild(mark);
      });
    } else {
      const relicLayout = relicBarLayout(chrome, !!hudState.omen);
      const relics = Array.isArray(hudState.relics) ? hudState.relics : [];
      if (relicLayout && relics.length) {
        const scale = relicLayout.scale ?? 1;
        const size = snapStage(36 * scale, resolution);
        relics.forEach((relic, i) => {
          const rx = snapStage((relicLayout.left ?? 66) + i * (size + 2), resolution);
          const ry = snapStage(relicLayout.top ?? 62, resolution);
          const g = new Graphics();
          g.roundRect(0, 0, size, size, 8)
            .fill({ color: 0x141828, alpha: 0.9 })
            .stroke({ color: 0xf2c14e, width: 1, alpha: 0.55 });
          g.x = rx;
          g.y = ry;
          hudLayer.addChild(g);
          const mark = new Text({
            text: '◈',
            style: { fontFamily: 'Cinzel', fontSize: 14, fill: 0xf2c14e },
          });
          mark.anchor?.set?.(0.5, 0.5);
          mark.x = snapStage(rx + size / 2, resolution);
          mark.y = snapStage(ry + size / 2, resolution);
          hudLayer.addChild(mark);
          void relic;
        });
      }
    }

    // Potion / relic / omen seats for Task 23 hit-testing (stage px).
    const potionSeats = [];
    if (typeof document !== 'undefined') {
      document.querySelectorAll('#hud .potion-slot').forEach((slot) => {
        const r = stageRect(slot);
        if (!(r.width > 0 && r.height > 0)) return;
        potionSeats.push(Object.freeze({
          slot: Number(slot.dataset.slot),
          bounds: snapRect({
            left: r.left, top: r.top, right: r.right, bottom: r.bottom,
            width: r.width, height: r.height,
          }, resolution),
        }));
      });
    }
    const relicSeats = [];
    if (typeof document !== 'undefined') {
      document.querySelectorAll('#hud .hud-relic').forEach((chip, index) => {
        const r = stageRect(chip);
        if (!(r.width > 0 && r.height > 0)) return;
        const rid = chip.dataset.relic || `relic-${index}`;
        relicSeats.push(Object.freeze({
          id: rid,
          bounds: snapRect({
            left: r.left, top: r.top, right: r.right, bottom: r.bottom,
            width: r.width, height: r.height,
          }, resolution),
        }));
      });
    }
    let omenSeat = null;
    if (typeof document !== 'undefined') {
      const omenNode = document.querySelector('#omen-slot')?.firstElementChild
        || document.querySelector('#omen-slot');
      if (omenNode) {
        const r = stageRect(omenNode);
        if (r.width > 0 && r.height > 0) {
          omenSeat = snapRect({
            left: r.left, top: r.top, right: r.right, bottom: r.bottom,
            width: r.width, height: r.height,
          }, resolution);
        }
      }
    }

    hudCache = Object.freeze({
      bounds: Object.freeze({
        left: barLeft, top: barTop, right: barLeft + barWidth, bottom: barTop + barH,
        width: barWidth, height: barH,
      }),
      seats: Object.freeze({
        deck: deckSeat ? snapRect({
          left: deckSeat.x - deckSeat.w / 2, top: deckSeat.y - deckSeat.h / 2,
          right: deckSeat.x + deckSeat.w / 2, bottom: deckSeat.y + deckSeat.h / 2,
          width: deckSeat.w, height: deckSeat.h,
        }, resolution) : null,
        menu: menuSeat ? snapRect({
          left: menuSeat.x - menuSeat.w / 2, top: menuSeat.y - menuSeat.h / 2,
          right: menuSeat.x + menuSeat.w / 2, bottom: menuSeat.y + menuSeat.h / 2,
          width: menuSeat.w, height: menuSeat.h,
        }, resolution) : null,
        omen: omenSeat,
        potions: Object.freeze(potionSeats),
        relics: Object.freeze(relicSeats),
      }),
      hp: hudState.hp,
      maxHp: hudState.maxHp,
      gold: hudState.gold,
      deckCount: hudState.deckCount,
    });
    hudPainted = painted;
    hudReady = painted >= 2;
  }

  function paintOnePlate(parent, plateRect, topRect, plateState, { isHero = false, resolution = 1 } = {}) {
    if (!plateRect || !plateState) return 0;
    let painted = 0;
    const plate = new Container();
    plate.x = snapStage(plateRect.left, resolution);
    plate.y = snapStage(plateRect.top, resolution);
    parent.addChild(plate);

    if (!isHero && plateState.name) {
      const affix = plateState.affix?.name ? `${String(plateState.affix.name).toUpperCase()} ` : '';
      const name = new Text({
        text: `${affix}${String(plateState.name).toUpperCase()}`,
        style: {
          fontFamily: 'Cinzel', fontSize: 11, fontWeight: '700',
          fill: plateState.affix?.tone ? 0xf2c14e : 0xe8dfc8,
          letterSpacing: 1,
        },
      });
      name.anchor?.set?.(0.5, 0);
      name.x = snapStage(plateRect.width / 2, resolution);
      name.y = 0;
      plate.addChild(name);
      painted += 1;
    }

    const rowY = snapStage(isHero ? 4 : 16, resolution);
    const wrapW = snapStage(Math.max(80, Math.min(150, plateRect.width || 150)), resolution);
    const wrapX = snapStage((plateRect.width - wrapW) / 2, resolution);

    if ((plateState.ward || 0) > 0) {
      addIconOrFallback(plate, 'combat-gl:ui/ward', wrapX + 12, rowY + 8, 22, 0x7ec8ff, resolution);
      const wardTxt = new Text({
        text: String(plateState.ward),
        style: {
          fontFamily: 'Cinzel', fontSize: 12, fontWeight: '800',
          fill: 0xbfe0ff,
        },
      });
      wardTxt.x = snapStage(wrapX + 24, resolution);
      wardTxt.y = snapStage(rowY + 2, resolution);
      plate.addChild(wardTxt);
    }

    const vialX = snapStage(wrapX + ((plateState.ward || 0) > 0 ? 48 : 0), resolution);
    const vialW = snapStage(wrapW - ((plateState.ward || 0) > 0 ? 70 : 36), resolution);
    const vial = new Graphics();
    vial.roundRect(vialX, snapStage(rowY + 4, resolution), Math.max(24, vialW), snapStage(10, resolution), 3)
      .fill({ color: 0x0a0e18, alpha: 0.85 })
      .stroke({ color: 0xffffff, width: 1, alpha: 0.18 });
    const fillW = snapStage(Math.max(0, Math.min(vialW, vialW * (Math.max(0, plateState.hp) / Math.max(1, plateState.maxHp)))), resolution);
    vial.roundRect(vialX, snapStage(rowY + 4, resolution), fillW, snapStage(10, resolution), 3)
      .fill({ color: isHero ? 0xc22f43 : 0xd94a4a, alpha: 0.95 });
    plate.addChild(vial);

    const hpLabel = new Text({
      text: `${Math.max(0, plateState.hp)}/${plateState.maxHp}`,
      style: {
        fontFamily: 'Cinzel', fontSize: 11, fontWeight: '700',
        fill: 0xffe8e8,
        stroke: { color: 0x000000, width: 2, join: 'round' },
      },
    });
    hpLabel.x = snapStage(vialX + Math.max(24, vialW) + 4, resolution);
    hpLabel.y = snapStage(rowY + 1, resolution);
    plate.addChild(hpLabel);
    painted += 1;

    if (!isHero && (plateState.facetMax || 0) > 0 && plateState.alive !== false) {
      const maxShow = Math.min(plateState.facetMax, 8);
      const startX = plateRect.width / 2 - (maxShow * 10) / 2;
      for (let i = 0; i < maxShow; i += 1) {
        const filled = i < (plateState.chips || 0);
        addIconOrFallback(
          plate,
          filled ? 'combat-gl:ui/facet-empty' : 'combat-gl:ui/facet-chipped',
          startX + i * 10 + 5,
          rowY + 28,
          10,
          filled ? 0xff7060 : 0x6a738a,
          resolution,
        );
      }
    }

    if (topRect && plateState.intent && plateState.alive !== false) {
      const top = new Container();
      top.x = snapStage(topRect.left, resolution);
      top.y = snapStage(topRect.top, resolution);
      parent.addChild(top);
      const icons = plateState.intent.icons || [];
      icons.forEach((id, i) => {
        addIconOrFallback(top, `combat-gl:ui/${id}`, 16 + i * 22, 16, i === 0 ? 28 : 20, 0xffe8c0, resolution);
      });
      if (plateState.intent.text) {
        const num = new Text({
          text: String(plateState.intent.text),
          style: {
            fontFamily: 'Cinzel', fontSize: 14, fontWeight: '800',
            fill: 0xfff6ec,
            stroke: { color: 0x000000, width: 2, join: 'round' },
          },
        });
        num.x = snapStage(16 + icons.length * 22, resolution);
        num.y = snapStage(6, resolution);
        top.addChild(num);
      }
      painted += 1;
    }

    // Status chips under top chrome / above plate
    const statuses = Array.isArray(plateState.statuses) ? plateState.statuses : [];
    if (statuses.length && topRect) {
      statuses.slice(0, 6).forEach((st, i) => {
        const chip = new Graphics();
        const chipSize = snapStage(22, resolution);
        chip.roundRect(0, 0, chipSize, chipSize, 4)
          .fill({ color: 0x161a2a, alpha: 0.9 })
          .stroke({ color: 0x8b93ad, width: 1, alpha: 0.5 });
        chip.x = snapStage(topRect.left + i * 24, resolution);
        chip.y = snapStage(topRect.bottom - 2, resolution);
        parent.addChild(chip);
        if (Math.abs(st.n) >= 2) {
          const n = new Text({
            text: String(st.n),
            style: { fontFamily: 'Cinzel', fontSize: 10, fontWeight: '700', fill: 0xffffff },
          });
          n.x = snapStage(chip.x + 12, resolution);
          n.y = snapStage(chip.y + 5, resolution);
          n.anchor?.set?.(0.5, 0);
          parent.addChild(n);
        }
      });
    }

    return painted;
  }

  function paintPlatesChrome() {
    clearPlatesPaint();
    const platesState = presentationModel?.plates;
    if (!platesState) {
      platesCache = null;
      platesReady = false;
      return;
    }
    const resolution = paintResolution(pixiLayer);
    // Geometry comes from the PR17 packer via live DOM anchors (combat.js
    // still owns clampCombatChrome). Pixi mirrors those stage-px boxes.
    const heroPlateEl = typeof document !== 'undefined'
      ? document.querySelector('.player-zone .cplate') : null;
    const heroTopEl = typeof document !== 'undefined'
      ? document.querySelector('.player-zone .top-chrome') : null;
    const heroPlate = heroPlateEl ? stageRect(heroPlateEl) : null;
    const heroTop = heroTopEl ? stageRect(heroTopEl) : null;
    const heroPlateBounds = heroPlate && heroPlate.width > 0 ? snapRect(rectOf(heroPlate), resolution) : null;
    const heroTopBounds = heroTop && heroTop.width > 0 ? snapRect(rectOf(heroTop), resolution) : null;
    const heroWidgets = measurePlateWidgets(heroPlateEl, heroTopEl);
    let painted = 0;
    painted += paintOnePlate(platesLayer, heroPlateBounds, heroTopBounds, platesState.hero, { isHero: true, resolution });

    const enemyBoxes = typeof document !== 'undefined'
      ? document.querySelectorAll('.enemy')
      : [];
    const enemiesOut = [];
    enemyBoxes.forEach((box, index) => {
      const state = platesState.enemies?.[index];
      if (!state || state.alive === false) {
        enemiesOut.push(Object.freeze({
          index,
          plateBounds: null,
          topChromeBounds: null,
          visibleBounds: null,
          wrapBounds: null,
          blockBounds: null,
          iconBounds: null,
          vialBounds: null,
          labelBounds: null,
          intentBounds: null,
          wrapClientWidth: 0,
          wrapScrollWidth: 0,
        }));
        return;
      }
      const plate = box.querySelector('.cplate');
      const top = box.querySelector('.top-chrome');
      const plateR = plate ? stageRect(plate) : null;
      const topR = top ? stageRect(top) : null;
      const plateBounds = plateR && plateR.width > 0 ? snapRect(rectOf(plateR), resolution) : null;
      const topBounds = topR && topR.width > 0 ? snapRect(rectOf(topR), resolution) : null;
      const widgets = measurePlateWidgets(plate, top);
      painted += paintOnePlate(platesLayer, plateBounds, topBounds, state, { isHero: false, resolution });
      enemiesOut.push(Object.freeze({
        index,
        plateBounds,
        topChromeBounds: topBounds,
        visibleBounds: snapRect(unionBounds(
          plateBounds,
          widgets.wrapBounds,
          widgets.blockBounds,
          widgets.vialBounds,
          widgets.labelBounds,
          widgets.intentBounds,
          topBounds,
        ) || plateBounds, resolution),
        wrapBounds: snapRect(widgets.wrapBounds, resolution),
        blockBounds: snapRect(widgets.blockBounds, resolution),
        iconBounds: snapRect(widgets.iconBounds, resolution),
        vialBounds: snapRect(widgets.vialBounds, resolution),
        labelBounds: snapRect(widgets.labelBounds, resolution),
        intentBounds: snapRect(widgets.intentBounds, resolution),
        wrapClientWidth: widgets.wrapClientWidth,
        wrapScrollWidth: widgets.wrapScrollWidth,
        hp: state.hp,
        maxHp: state.maxHp,
        name: state.name,
      }));
    });

    platesCache = Object.freeze({
      hero: Object.freeze({
        plateBounds: heroPlateBounds,
        topChromeBounds: heroTopBounds,
        wrapBounds: snapRect(heroWidgets.wrapBounds, resolution),
        blockBounds: snapRect(heroWidgets.blockBounds, resolution),
        iconBounds: snapRect(heroWidgets.iconBounds, resolution),
        vialBounds: snapRect(heroWidgets.vialBounds, resolution),
        labelBounds: snapRect(heroWidgets.labelBounds, resolution),
        intentBounds: snapRect(heroWidgets.intentBounds, resolution),
        wrapClientWidth: heroWidgets.wrapClientWidth,
        wrapScrollWidth: heroWidgets.wrapScrollWidth,
        hp: platesState.hero?.hp ?? null,
        maxHp: platesState.hero?.maxHp ?? null,
        ward: platesState.hero?.ward ?? null,
      }),
      enemies: Object.freeze(enemiesOut),
    });
    platesPainted = painted;
    platesReady = painted >= 1;
  }

  const pointIn = (px, py, rect) => {
    if (!rect) return false;
    const left = rect.left ?? rect.x ?? 0;
    const top = rect.top ?? rect.y ?? 0;
    const right = rect.right ?? (left + (rect.width ?? 0));
    const bottom = rect.bottom ?? (top + (rect.height ?? 0));
    return px >= left && px <= right && py >= top && py <= bottom;
  };

  const tipFromModel = (kind, detail = {}) => {
    const tips = presentationModel?.tips || {};
    if (kind === 'lantern') return tips.lantern || null;
    if (kind === 'omen') return tips.omen || null;
    if (kind === 'potion') return tips.potions?.[detail.slot] || null;
    if (kind === 'relic') return tips.relics?.[detail.id] || null;
    if (kind === 'card') {
      const uid = detail.uid != null ? String(detail.uid) : null;
      if (uid && tips.cards?.[uid]) return tips.cards[uid];
      const handCard = presentationModel?.hand?.cards?.find((c) => String(c.uid) === uid);
      if (handCard?.tip) return handCard.tip;
      return null;
    }
    return null;
  };

  const hitTest = (x, y) => {
    hitTestBias = { x: Number(x) || 0, y: Number(y) || 0 };
    void hitTestBias;
    const px = Number(x) || 0;
    const py = Number(y) || 0;
    // Front-to-back priority matches interactive chrome importance.
    if (pointIn(px, py, endTurnBoundsCache)) {
      return Object.freeze({
        kind: 'end-turn', type: 'end-turn', bounds: endTurnBoundsCache,
        tip: tipFromModel('end-turn'),
      });
    }
    if (pointIn(px, py, lanternBoundsCache)) {
      return Object.freeze({
        kind: 'lantern', type: 'lantern', bounds: lanternBoundsCache,
        tip: tipFromModel('lantern'),
      });
    }
    for (const key of ['draw', 'discard', 'ashes']) {
      const bounds = pileBoundsCache?.[key];
      if (pointIn(px, py, bounds)) {
        return Object.freeze({ kind: key, type: key, bounds, tip: null });
      }
    }
    const seats = hudCache?.seats;
    if (pointIn(px, py, seats?.deck)) {
      return Object.freeze({ kind: 'deck', type: 'deck', bounds: seats.deck, tip: null });
    }
    if (pointIn(px, py, seats?.menu)) {
      return Object.freeze({ kind: 'menu', type: 'menu', bounds: seats.menu, tip: null });
    }
    if (pointIn(px, py, seats?.omen)) {
      return Object.freeze({
        kind: 'omen', type: 'omen', bounds: seats.omen, tip: tipFromModel('omen'),
      });
    }
    const potions = seats?.potions || [];
    for (const seat of potions) {
      if (pointIn(px, py, seat.bounds)) {
        return Object.freeze({
          kind: 'potion', type: 'potion', slot: seat.slot, bounds: seat.bounds,
          tip: tipFromModel('potion', { slot: seat.slot }),
        });
      }
    }
    const relics = seats?.relics || [];
    for (const seat of relics) {
      if (pointIn(px, py, seat.bounds)) {
        return Object.freeze({
          kind: 'relic', type: 'relic', id: seat.id, bounds: seat.bounds,
          tip: tipFromModel('relic', { id: seat.id }),
        });
      }
    }
    // Hand seats after chrome (matches Task 23 Pixi→hand order). Topmost first.
    const handSeats = handCache?.seats || [];
    for (let i = handSeats.length - 1; i >= 0; i -= 1) {
      const seat = handSeats[i];
      if (!seat || seat.pending) continue;
      const bounds = seat.seatBounds || seat.bounds;
      if (pointIn(px, py, bounds)) {
        return Object.freeze({
          kind: 'card',
          type: 'card',
          uid: seat.uid,
          id: seat.id,
          bounds,
          seatBounds: seat.seatBounds || bounds,
          tip: tipFromModel('card', { uid: seat.uid, id: seat.id }) || null,
        });
      }
    }
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
        energy: candleFrameCache?.bounds ?? null,
        lantern: lanternBoundsCache,
        endTurn: endTurnBoundsCache,
        piles: pileBoundsCache,
        hud: hudCache,
        plates: platesCache,
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
    const heroPlate = platesCache?.hero?.plateBounds || rectOf(domRect('.player-zone .cplate'));
    const heroTop = platesCache?.hero?.topChromeBounds || rectOf(domRect('.player-zone .top-chrome'));
    const enemyBoxes = document.querySelectorAll('.enemy');
    const enemies = [];
    enemyBoxes.forEach((box, index) => {
      const cached = platesCache?.enemies?.[index];
      const art = box.querySelector('.enemy-art');
      if (!art) return;
      const artR = stageRect(art);
      const plate = box.querySelector('.cplate');
      const top = box.querySelector('.top-chrome');
      enemies.push({
        index,
        artBounds: rectOf(artR),
        artCenter: centerOf(artR),
        plateBounds: cached?.plateBounds || (plate ? rectOf(stageRect(plate)) : null),
        topChromeBounds: cached?.topChromeBounds || (top ? rectOf(stageRect(top)) : null),
        visibleBounds: cached?.visibleBounds || null,
      });
    });
    const handRect = handCache?.zone
      ? {
        left: handCache.zone.left ?? 0,
        top: handCache.zone.top ?? handCache.restingHandFloor,
        right: (handCache.zone.left ?? 0) + (handCache.zone.width ?? 0),
        bottom: (handCache.zone.top ?? 0) + (handCache.zone.height ?? 0),
        width: handCache.zone.width ?? 0,
        height: handCache.zone.height ?? 0,
      }
      : domRect('.hand-zone');
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
        relics: relicBarLayout(chrome, !!presentationModel?.hud?.omen),
      },
      candleFrame: candleFrameCache,
      energy: candleFrameCache?.bounds ?? null,
      lantern: lanternBoundsCache,
      endTurn: endTurnBoundsCache,
      piles: pileBoundsCache,
      hud: hudCache,
      plates: platesCache,
      hero: {
        layoutX: bfLayout.hero?.x ?? null,
        layoutY: bfHeroY(bfLayout),
        bounds: rectOf(heroRect),
        center: centerOf(heroRect),
        plateBounds: heroPlate,
        topChromeBounds: heroTop,
      },
      enemies: enemies.map((entry) => Object.freeze(entry)),
      restingHandFloor: handCache?.restingHandFloor
        ?? (handRect ? handRect.top : (chrome.hand?.bottom ?? null)),
      handBounds: rectOf(handRect),
      hand: handCache,
      aim: aimPathCache,
      pending: false,
      bf: {
        shape: info.shape,
        groundY: bfLayout.groundY ?? null,
        slotCount: bfSlots(bfLayout, enemies.length || 1).length,
      },
    });
  }

  /**
   * Task 29 — sample contrast from the live P5 chrome paint via the combat
   * root extract cropped to Pixi `readUI()` bounds (not holdForSample proxies).
   * Text-alone extract is transparent under Pixi 8 GPU text; the composed
   * frame is the honest painted surface.
   */
  async function sampleLiveChromeContrast() {
    const read = readUI();
    const renderer = pixiLayer.application?.()?.renderer;
    if (!renderer?.extract || !read) {
      return [{ label: 'chrome', measured: false, reason: 'missing-extract' }];
    }
    try { renderer.render?.(pixiLayer.application?.()?.stage); } catch { /* */ }

    let canvas = null;
    try {
      if (typeof renderer.extract.canvas === 'function') {
        canvas = renderer.extract.canvas(container);
      }
    } catch { /* */ }
    if (!canvas?.width || !canvas?.height) {
      return [{ label: 'chrome', measured: false, reason: 'extract-failed' }];
    }
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return [{ label: 'chrome', measured: false, reason: 'no-2d' }];

    const resolution = Number(renderer.resolution) || 1;
    const jobs = [
      { label: 'energy', bounds: read.candleFrame?.bounds || read.energy },
      { label: 'end-turn', bounds: read.endTurn },
      { label: 'lantern', bounds: read.lantern },
      { label: 'pile-draw', bounds: read.piles?.draw },
      { label: 'hud-status', bounds: read.hud?.bounds },
    ];

    const relativeLuminance = (rgb) => {
      const channel = (c) => {
        const v = c / 255;
        return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
      };
      return 0.2126 * channel(rgb[0]) + 0.7152 * channel(rgb[1]) + 0.0722 * channel(rgb[2]);
    };
    const contrastOf = (a, b) => {
      const l1 = relativeLuminance(a);
      const l2 = relativeLuminance(b);
      const light = Math.max(l1, l2);
      const dark = Math.min(l1, l2);
      return (light + 0.05) / (dark + 0.05);
    };

    const out = [];
    for (const job of jobs) {
      const b = job.bounds;
      if (!b || !(b.width > 0 && b.height > 0)) {
        out.push({ label: job.label, measured: false, reason: 'missing-readUI-bounds' });
        continue;
      }
      const x = Math.max(0, Math.floor(b.left * resolution));
      const y = Math.max(0, Math.floor(b.top * resolution));
      const w = Math.max(1, Math.min(canvas.width - x, Math.ceil(b.width * resolution)));
      const h = Math.max(1, Math.min(canvas.height - y, Math.ceil(b.height * resolution)));
      let image;
      try { image = ctx.getImageData(x, y, w, h); } catch {
        out.push({ label: job.label, measured: false, reason: 'crop-failed' });
        continue;
      }
      let bright = null;
      let brightLum = -1;
      let dark = null;
      let darkLum = 2;
      for (let i = 0; i < image.data.length; i += 4) {
        if (image.data[i + 3] < 90) continue;
        const rgb = [image.data[i], image.data[i + 1], image.data[i + 2]];
        const L = relativeLuminance(rgb);
        if (L > brightLum) { brightLum = L; bright = rgb; }
        if (L < darkLum) { darkLum = L; dark = rgb; }
      }
      const ratio = (bright && dark) ? contrastOf(bright, dark) : 0;
      out.push({
        label: job.label,
        measured: ratio > 0,
        source: 'pixels',
        sampleContract: 'readUI-crop',
        ratio,
        fg: bright,
        bg: dark,
        readUI: true,
        bounds: { left: b.left, top: b.top, width: b.width, height: b.height },
      });
    }
    return out;
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
      hud: Object.freeze({
        ready: hudReady,
        painted: hudPainted,
      }),
      plates: Object.freeze({
        ready: platesReady,
        painted: platesPainted,
      }),
      hand: Object.freeze({
        ready: handReady,
        painted: handPainted,
        seats: handCache?.seats?.length ?? 0,
      }),
      cardFace: cardFace.stats?.() || null,
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
    // Drop hand display objects before the Application reaps GPU resources —
    // reused seats must not keep ColorMatrixFilter/Sprite textures across loss.
    detachHandTicker();
    clearHandPaint();
    clearAimPaint();
    clearPulses();
    // Detach before teardown so Application.destroy does not reap combat chrome.
    const layerRoot = pixiLayer.root?.();
    if (layerRoot && container.parent === layerRoot) {
      try { layerRoot.removeChild(container); } catch { /* already detached */ }
    }
    const result = await pixiLayer.loseContextForTest();
    bump();
    return result;
  };

  // Re-attach the combat container to the freshly rebuilt Pixi layer and force a
  // full resync. Shared by the test rebuild seam AND the production
  // webglcontextrestored path (pixiLayer.setOnContextRestored below), so a real
  // GPU context loss recovers the same way the probe drives it.
  const reattachAfterRebuild = () => {
    const nextRoot = pixiLayer.root?.();
    if (nextRoot && typeof nextRoot.addChild === 'function' && container.parent !== nextRoot) {
      nextRoot.addChild(container);
    }
    const nextRenderer = pixiLayer.application?.()?.renderer;
    if (nextRenderer) {
      try { cardFace.rebuild(nextRenderer); } catch { /* best-effort */ }
    }
    // GPU resources died with the old context — clear reused hand/aim nodes and
    // reset the region cache so the resync repaints every chrome/HUD/plate slice
    // (otherwise reused sprites/text would show with dead textures).
    clearHandPaint();
    clearAimPaint();
    resetPaintSigs();
    // New Application → new ticker; re-attach the living-card frame loop.
    attachHandTicker();
    if (presentationModel) {
      try { sync(presentationModel); } catch { /* remount best-effort */ }
    }
    bump();
  };

  const rebuildAfterLossForTest = async () => {
    if (typeof pixiLayer.rebuild !== 'function') {
      throw new Error('pixiLayer does not expose rebuild');
    }
    const result = await pixiLayer.rebuild();
    reattachAfterRebuild();
    return result;
  };

  // Production context-loss recovery: pixiLayer rebuilds the renderer on a real
  // webglcontextrestored, then calls back here to re-attach + resync combat.
  pixiLayer.setOnContextRestored?.(reattachAfterRebuild);

  /** Full lose → rebuild → remount recovery seam used by Probe / P4 gates. */
  const recoverContextForTest = async () => {
    await loseContextForTest();
    return rebuildAfterLossForTest();
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
    detachHandTicker();
    clearHandPaint();
    clearAimPaint();
    clearPulses();
    try { presentation.destroy(); } catch { /* already gone */ }
    try { cardFace.destroy(); } catch { /* already gone */ }
    try { container.destroy({ children: true, context: true }); } catch { /* container already reaped */ }
    textureAliases.clear();
    presentationModel = null;
    setState('idle');
  };

  setState('ready');
  attachHandTicker();

  return Object.freeze({
    // presentation seam
    mount, sync, layout, hitTest, setInteraction, readUI, stats,
    sampleLiveChromeContrast,
    // chrome micro-feedback beat (energy/lantern/piles/block/facet)
    pulse: (target, opts) => spawnPulse(resolvePulseBounds(target), opts || {}),
    // lifecycle bridge (Task 21 pixiLayer)
    loseContextForTest, rebuildAfterLossForTest, recoverContextForTest,
    freezeForTest, unfreezeForTest, destroy,
    // Task 26 — single card-face composer
    cardFace,
    // Task 28 — combat floaters / banners / pile flights / shatter
    presentation,
    // scaffold introspection (not part of the frozen public seam; PR16 will
    // stabilise these once the renderer actually paints)
    root: () => container,
    texturedReadyPromise: () => texturedReadyPromise,
    version: COMBAT_RENDERER_VERSION,
    blockingIds: COMBAT_BLOCKING_UI_IDS,
    pileIds: COMBAT_PILE_TEXTURE_IDS,
  });
}
