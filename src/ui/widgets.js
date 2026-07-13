// Round 5 Pixi widget primitives. Every primitive owns `setState`, `layout`,
// `readBounds` and `destroy`; when a texture is missing the widget draws a
// token-driven vector fallback that stays interactive.
//
// `snapStage(value, resolution)` snaps a stage-px value to the nearest
// device-pixel-integral position at the pinned baseline DPR so texture and
// text rendering stay crisp.

import {
  Container,
  Graphics,
  NineSliceSprite,
  Sprite,
  Text,
  Texture,
} from 'pixi.js';

import { COLOUR, ROUND5_TOKENS } from './tokens.js';

const DEFAULT_BOUNDS = Object.freeze({ x: 0, y: 0, width: 32, height: 32 });

function coerceBounds(bounds) {
  return {
    x: Number(bounds?.x) || 0,
    y: Number(bounds?.y) || 0,
    width: Math.max(1, Number(bounds?.width) || DEFAULT_BOUNDS.width),
    height: Math.max(1, Number(bounds?.height) || DEFAULT_BOUNDS.height),
  };
}

export function snapStage(value, resolution = 1) {
  const numeric = Number(value);
  const res = Math.max(0.5, Number(resolution) || 1);
  if (!Number.isFinite(numeric)) return 0;
  return Math.round(numeric * res) / res;
}

function hexToInt(hex, fallback = 0xffffff) {
  if (typeof hex !== 'string') return fallback;
  const clean = hex.trim().replace(/^#/, '');
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return fallback;
  return Number.parseInt(clean, 16);
}

function usableTexture(texture) {
  if (!texture) return false;
  if (texture === Texture.EMPTY) return false;
  return Number.isFinite(texture.width) && texture.width > 0
    && Number.isFinite(texture.height) && texture.height > 0;
}

function drawVectorFallback(graphics, bounds, { fill, stroke, radius = 6 } = {}) {
  graphics.clear();
  graphics
    .roundRect(0, 0, bounds.width, bounds.height, radius)
    .fill({ color: hexToInt(fill || COLOUR.ink, 0x0b0e1a), alpha: 0.94 })
    .stroke({ color: hexToInt(stroke || COLOUR.gold, 0xf2c14e), width: 2 });
}

function positionContainer(container, bounds, resolution) {
  const x = snapStage(bounds.x, resolution);
  const y = snapStage(bounds.y, resolution);
  container.position.set(x, y);
  return { x, y };
}

/**
 * Nine-slice sprite. When `texture` is a real texture, a Pixi NineSliceSprite
 * renders it; otherwise a token-driven `Graphics` panel fills the same bounds.
 */
export function createNineSlice({ texture, fallback, bounds, resolution = 1 } = {}) {
  const container = new Container();
  const box = coerceBounds(bounds);
  let currentBounds = { ...box };
  const useTexture = usableTexture(texture);
  let sprite = null;
  const fallbackGraphics = new Graphics();

  const paint = () => {
    if (useTexture) {
      sprite = sprite || new NineSliceSprite({
        texture,
        leftWidth: 12,
        rightWidth: 12,
        topHeight: 12,
        bottomHeight: 12,
        width: currentBounds.width,
        height: currentBounds.height,
        roundPixels: true,
      });
      sprite.width = currentBounds.width;
      sprite.height = currentBounds.height;
      if (sprite.parent !== container) container.addChild(sprite);
    } else {
      drawVectorFallback(fallbackGraphics, currentBounds, fallback);
      if (fallbackGraphics.parent !== container) container.addChild(fallbackGraphics);
    }
  };
  paint();
  positionContainer(container, currentBounds, resolution);

  return Object.freeze({
    container,
    kind: 'nine-slice',
    hasTexture: useTexture,
    setState() {},
    layout(nextBounds) {
      currentBounds = coerceBounds({ ...currentBounds, ...nextBounds });
      paint();
      positionContainer(container, currentBounds, resolution);
    },
    readBounds() {
      return {
        x: container.x,
        y: container.y,
        width: currentBounds.width,
        height: currentBounds.height,
      };
    },
    destroy() {
      container.destroy({ children: true });
    },
  });
}

/** Horizontal value meter (HP / Ward). Uses tokens for fill/track colours. */
export function createMeter({ bounds, value = 0, max = 1, colours = {}, resolution = 1 } = {}) {
  const container = new Container();
  let currentBounds = coerceBounds(bounds);
  let currentValue = Math.max(0, Number(value) || 0);
  let currentMax = Math.max(1, Number(max) || 1);
  const track = new Graphics();
  const fill = new Graphics();
  container.addChild(track, fill);

  const trackColour = colours.track || COLOUR.ink;
  const fillColour = colours.fill || COLOUR.hp || '#ff5964';

  const paint = () => {
    const ratio = Math.max(0, Math.min(1, currentValue / currentMax));
    track.clear()
      .roundRect(0, 0, currentBounds.width, currentBounds.height, 3)
      .fill({ color: hexToInt(trackColour, 0x0b0e1a), alpha: 0.92 })
      .stroke({ color: hexToInt(COLOUR.goldDim, 0x9c7c34), width: 1 });
    fill.clear()
      .roundRect(2, 2, Math.max(0, (currentBounds.width - 4) * ratio), currentBounds.height - 4, 2)
      .fill({ color: hexToInt(fillColour, 0xff5964), alpha: 0.96 });
  };
  paint();
  positionContainer(container, currentBounds, resolution);

  return Object.freeze({
    container,
    kind: 'meter',
    setState({ value: nextValue, max: nextMax } = {}) {
      if (nextValue !== undefined) currentValue = Math.max(0, Number(nextValue) || 0);
      if (nextMax !== undefined) currentMax = Math.max(1, Number(nextMax) || 1);
      paint();
    },
    layout(nextBounds) {
      currentBounds = coerceBounds({ ...currentBounds, ...nextBounds });
      paint();
      positionContainer(container, currentBounds, resolution);
    },
    readBounds() {
      return {
        x: container.x, y: container.y,
        width: currentBounds.width, height: currentBounds.height,
      };
    },
    destroy() {
      container.destroy({ children: true });
    },
  });
}

/** Counter widget (numeric label + optional icon). */
export function createCounter({ bounds, value = 0, icon = null, resolution = 1 } = {}) {
  const container = new Container();
  let currentBounds = coerceBounds(bounds);
  let currentValue = value;

  const background = new Graphics();
  const label = new Text({
    text: String(currentValue),
    style: {
      fontFamily: 'Cinzel',
      fontSize: 14,
      fontWeight: '700',
      fill: hexToInt(COLOUR.gold, 0xf2c14e),
      align: 'center',
    },
  });
  label.anchor?.set?.(0.5, 0.5);
  container.addChild(background, label);
  let iconSprite = null;
  if (icon && usableTexture(icon)) {
    iconSprite = new Sprite(icon);
    iconSprite.width = 14;
    iconSprite.height = 14;
    container.addChild(iconSprite);
  }

  const paint = () => {
    background.clear()
      .roundRect(0, 0, currentBounds.width, currentBounds.height, 6)
      .fill({ color: hexToInt(COLOUR.ink, 0x0b0e1a), alpha: 0.88 })
      .stroke({ color: hexToInt(COLOUR.goldDim, 0x9c7c34), width: 1 });
    label.text = String(currentValue);
    label.position.set(currentBounds.width / 2, currentBounds.height / 2);
    if (iconSprite) iconSprite.position.set(4, currentBounds.height / 2 - 7);
  };
  paint();
  positionContainer(container, currentBounds, resolution);

  return Object.freeze({
    container,
    kind: 'counter',
    setState({ value: nextValue } = {}) {
      if (nextValue !== undefined) currentValue = nextValue;
      paint();
    },
    layout(nextBounds) {
      currentBounds = coerceBounds({ ...currentBounds, ...nextBounds });
      paint();
      positionContainer(container, currentBounds, resolution);
    },
    readBounds() {
      return {
        x: container.x, y: container.y,
        width: currentBounds.width, height: currentBounds.height,
      };
    },
    destroy() {
      container.destroy({ children: true });
    },
  });
}

const BUTTON_STATE_ALIASES = Object.freeze({
  rest: 'rest', hover: 'hover', pressed: 'pressed',
  disabled: 'disabled', ready: 'ready', loading: 'loading',
});

/** Button widget with rest/hover/pressed/disabled/ready/loading states. */
export function createButton({ bounds, states = {}, onActivate, resolution = 1 } = {}) {
  const container = new Container();
  let currentBounds = coerceBounds(bounds);
  let currentState = 'rest';
  const background = new Graphics();
  const label = new Text({
    text: states.label || '',
    style: {
      fontFamily: 'Cinzel',
      fontSize: 14,
      fontWeight: '700',
      fill: hexToInt(COLOUR.text, 0xece7df),
    },
  });
  label.anchor?.set?.(0.5, 0.5);
  container.addChild(background, label);
  container.eventMode = 'static';
  container.cursor = 'pointer';

  const styleForState = (name) => {
    const state = states[name] || {};
    return {
      fill: state.fill || (name === 'disabled' ? COLOUR.ink : COLOUR.goldDim),
      stroke: state.stroke || COLOUR.gold,
      alpha: name === 'disabled' ? 0.5 : (name === 'pressed' ? 0.85 : 1),
      label: state.label ?? states.label ?? '',
      textColour: state.textColour || COLOUR.text,
    };
  };

  const paint = () => {
    const style = styleForState(currentState);
    background.clear()
      .roundRect(0, 0, currentBounds.width, currentBounds.height, 6)
      .fill({ color: hexToInt(style.fill, 0x9c7c34), alpha: style.alpha })
      .stroke({ color: hexToInt(style.stroke, 0xf2c14e), width: 2 });
    label.text = style.label;
    label.style.fill = hexToInt(style.textColour, 0xece7df);
    label.position.set(currentBounds.width / 2, currentBounds.height / 2);
    container.alpha = currentState === 'disabled' ? 0.6 : 1;
    container.eventMode = currentState === 'disabled' || currentState === 'loading'
      ? 'none' : 'static';
  };

  const activate = () => {
    if (currentState === 'disabled' || currentState === 'loading') return;
    if (typeof onActivate === 'function') onActivate();
  };
  container.on('pointertap', activate);
  container.on('pointerover', () => { if (currentState === 'rest') { currentState = 'hover'; paint(); } });
  container.on('pointerout', () => { if (currentState === 'hover' || currentState === 'pressed') { currentState = 'rest'; paint(); } });
  container.on('pointerdown', () => { currentState = 'pressed'; paint(); });
  container.on('pointerup', () => { if (currentState === 'pressed') { currentState = 'hover'; paint(); } });

  paint();
  positionContainer(container, currentBounds, resolution);

  return Object.freeze({
    container,
    kind: 'button',
    setState(next) {
      const key = typeof next === 'string' ? next : next?.state;
      const resolved = BUTTON_STATE_ALIASES[key];
      if (resolved) currentState = resolved;
      paint();
    },
    layout(nextBounds) {
      currentBounds = coerceBounds({ ...currentBounds, ...nextBounds });
      paint();
      positionContainer(container, currentBounds, resolution);
    },
    readBounds() {
      return {
        x: container.x, y: container.y,
        width: currentBounds.width, height: currentBounds.height,
      };
    },
    destroy() {
      container.destroy({ children: true });
    },
    currentState: () => currentState,
    activate,
  });
}

/** Multi-state sprite. Missing textures fall back to a vector state marker. */
export function createStateSprite({ bounds, states = {}, initial = null, resolution = 1 } = {}) {
  const container = new Container();
  let currentBounds = coerceBounds(bounds);
  const stateKeys = Object.keys(states);
  let currentKey = stateKeys.includes(initial) ? initial : (stateKeys[0] || null);
  const graphics = new Graphics();
  let sprite = null;

  const paint = () => {
    const stateValue = currentKey ? states[currentKey] : null;
    const texture = stateValue?.texture ?? stateValue ?? null;
    if (usableTexture(texture)) {
      if (!sprite) {
        sprite = new Sprite(texture);
        container.addChild(sprite);
      } else {
        sprite.texture = texture;
      }
      sprite.width = currentBounds.width;
      sprite.height = currentBounds.height;
      graphics.parent && graphics.parent.removeChild(graphics);
    } else {
      if (sprite && sprite.parent) sprite.parent.removeChild(sprite);
      drawVectorFallback(graphics, currentBounds, {
        fill: stateValue?.fallbackFill || COLOUR.ink,
        stroke: stateValue?.fallbackStroke || COLOUR.gold,
      });
      if (graphics.parent !== container) container.addChild(graphics);
    }
  };
  paint();
  positionContainer(container, currentBounds, resolution);

  return Object.freeze({
    container,
    kind: 'state-sprite',
    setState(next) {
      const key = typeof next === 'string' ? next : next?.state;
      if (key && Object.hasOwn(states, key)) currentKey = key;
      paint();
    },
    layout(nextBounds) {
      currentBounds = coerceBounds({ ...currentBounds, ...nextBounds });
      paint();
      positionContainer(container, currentBounds, resolution);
    },
    readBounds() {
      return {
        x: container.x, y: container.y,
        width: currentBounds.width, height: currentBounds.height,
      };
    },
    destroy() {
      container.destroy({ children: true });
    },
    currentState: () => currentKey,
  });
}

/** Convenience: shared token accessor for widget-authoring callers. */
export const WIDGET_TOKENS = Object.freeze({
  colour: COLOUR,
  raw: ROUND5_TOKENS,
});
