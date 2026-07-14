// Round 5 Task 28 — Pixi combat presentation ceremonies.
// Owns combat floaters, banners, mote flights, card-flight pile ceremonies and
// shatter fragments. Non-combat screens keep DOM `#floaties` / `.turn-banner`.

import { Container, Graphics, Sprite, Text, Texture, Assets } from 'pixi.js';
import { iconSvg } from '../art.js';
import {
  CEREMONY_BUDGET_MS, flightSchedule,
} from '../pile-chrome.js';
import { COLOUR, DURATION_MS, isReducedTier } from './tokens.js';
import { tween } from './tween.js';

const TIER_STYLE = Object.freeze({
  normal: { size: 34, fill: COLOUR.text, dur: 450, rise: 34, easing: 'outSoft' },
  heavy: { size: 42, fill: COLOUR.ember, dur: 640, rise: 42, easing: 'spring' },
  kill: { size: 54, fill: COLOUR.gold, dur: 640, rise: 52, easing: 'spring' },
  overkill: { size: 64, fill: COLOUR.danger, dur: 640, rise: 62, easing: 'spring' },
  // Legacy class aliases from drain.js
  dmg: null,
  'dmg-big': null,
  'dmg-kill': null,
  'dmg-overkill': null,
});

function resolveDamageTier(cls) {
  if (cls === 'dmg' || cls === 'normal') return 'normal';
  if (cls === 'dmg-big' || cls === 'heavy') return 'heavy';
  if (cls === 'dmg-kill' || cls === 'kill') return 'kill';
  if (cls === 'dmg-overkill' || cls === 'overkill') return 'overkill';
  return null;
}

function hexToNum(hex) {
  if (typeof hex === 'number') return hex;
  const s = String(hex || '').replace('#', '');
  if (s.length === 6) return parseInt(s, 16);
  return 0xece7df;
}

function relativeLuminance(rgb) {
  const channel = (c) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(rgb[0]) + 0.7152 * channel(rgb[1]) + 0.0722 * channel(rgb[2]);
}

function contrastOf(a, b) {
  const l1 = relativeLuminance(a);
  const l2 = relativeLuminance(b);
  const light = Math.max(l1, l2);
  const dark = Math.min(l1, l2);
  return (light + 0.05) / (dark + 0.05);
}

/**
 * @param {object} deps
 * @param {import('pixi.js').Container} deps.parent
 * @param {object} deps.trace
 * @param {object} deps.presentationBarrier
 * @param {() => object} deps.policy
 * @param {object} [deps.cardFace]
 * @param {HTMLCanvasElement} [deps.canvas]
 */
export function createCombatPresentation({
  parent,
  trace = null,
  presentationBarrier = null,
  policy = () => ({}),
  cardFace = null,
  canvas = null,
  pixiApp = null,
} = {}) {
  if (!parent || typeof parent.addChild !== 'function') {
    throw new TypeError('createCombatPresentation requires a Pixi parent container');
  }

  const root = new Container();
  root.label = 'combat-presentation';
  root.eventMode = 'none';
  parent.addChild(root);

  const floatLayer = new Container(); floatLayer.label = 'pres-floaters';
  const bannerLayer = new Container(); bannerLayer.label = 'pres-banners';
  const flightLayer = new Container(); flightLayer.label = 'pres-flights';
  const moteLayer = new Container(); moteLayer.label = 'pres-motes';
  const shatterLayer = new Container(); shatterLayer.label = 'pres-shatter';
  const artCastLayer = new Container(); artCastLayer.label = 'pres-art-cast';
  root.addChild(floatLayer, bannerLayer, flightLayer, moteLayer, shatterLayer, artCastLayer);

  let held = null;
  let destroyed = false;
  const hooks = { failNextFlight: false };

  const reduced = () => isReducedTier(policy());

  function beginBarrier(kind) {
    return presentationBarrier?.begin?.(kind) || {
      finish() {},
      cancel() {},
    };
  }

  function beginSpan(name, details = {}) {
    if (!trace?.begin) {
      return { finish() {}, seq: null };
    }
    const span = trace.begin(name, details);
    let seq = null;
    try {
      const records = trace.read?.({ format: 'records' })?.records;
      if (Array.isArray(records)) {
        for (let i = records.length - 1; i >= 0; i -= 1) {
          if (records[i].eventName === name && records[i].phase === 'start') {
            seq = records[i].seq;
            break;
          }
        }
      }
    } catch { /* trace optional */ }
    return {
      finish: (...args) => span.finish?.(...args),
      seq,
    };
  }

  function makeLabel(text, {
    size = 28, fill = COLOUR.text, weight = '800', maxWidth = 0,
  } = {}) {
    const label = new Text({
      text: String(text ?? ''),
      style: {
        fontFamily: 'Cinzel',
        fontSize: size,
        fontWeight: weight,
        fill: hexToNum(fill),
        stroke: { color: 0x0b0e1a, width: 3, join: 'round' },
        align: 'center',
        wordWrap: maxWidth > 0,
        wordWrapWidth: maxWidth || 600,
      },
    });
    label.anchor?.set?.(0.5, 0.5);
    return label;
  }

  /** Build a coloured SVG data-URL for an art.js icon. */
  function iconDataUrl(name, size, fill = COLOUR.parchment) {
    const raw = iconSvg(name, size);
    if (!raw) return null;
    const colored = raw
      .replace(/currentColor/g, fill)
      .replace(/stroke="currentColor"/g, `stroke="${fill}"`);
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(colored)}`;
  }

  /**
   * Floater content: optional icon + plain text in a centered container.
   * HTML from legacy iconSvg embeds is stripped; pass `opts.icon` instead.
   */
  function composeFloaterContent(text, style, fill, opts = {}) {
    const plain = String(text ?? '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    const iconSize = opts.iconSize || Math.max(16, Math.round((style.size || 28) * 0.72));
    const row = new Container();
    let cursor = 0;
    if (opts.iconTexture) {
      const icon = new Sprite(opts.iconTexture);
      icon.anchor.set(0, 0.5);
      icon.width = iconSize;
      icon.height = iconSize;
      icon.x = cursor;
      icon.y = 0;
      row.addChild(icon);
      cursor += iconSize + 6;
    }
    const label = makeLabel(plain, { size: style.size, fill });
    label.anchor.set(0, 0.5);
    label.x = cursor;
    label.y = 0;
    row.addChild(label);
    const bounds = row.getLocalBounds();
    row.pivot.set(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
    return { root: row, label };
  }

  async function floatText(x, y, text, cls = 'normal', opts = {}) {
    if (destroyed) return { outcome: 'skipped' };
    const damageTier = resolveDamageTier(cls);
    const tier = damageTier || (TIER_STYLE[cls] ? cls : null);
    const style = tier
      ? TIER_STYLE[tier] || TIER_STYLE.normal
      : {
        size: cls.includes('notice') ? 20 : 28,
        fill: COLOUR.parchment,
        dur: 450,
        rise: 40,
        easing: 'outSoft',
      };
    const fill = opts.tint || style.fill;
    let iconTexture = null;
    if (opts.icon) {
      const url = iconDataUrl(opts.icon, opts.iconSize || Math.max(16, Math.round(style.size * 0.72)), fill);
      if (url) {
        try { iconTexture = await Assets.load(url); } catch { iconTexture = null; }
      }
    }
    const { root: content, label } = composeFloaterContent(text, style, fill, {
      ...opts,
      iconTexture,
    });
    // holdForSample: ink-plate contract — glyph sampled against plate (documented).
    if (opts.holdForSample) {
      const plate = new Container();
      const bg = new Graphics();
      const pad = Math.max(56, style.size * 1.8);
      bg.roundRect(-pad, -pad * 0.7, pad * 2, pad * 1.4, 4)
        .fill({ color: hexToNum(COLOUR.ink), alpha: 1 });
      content.x = 0;
      content.y = 0;
      plate.addChild(bg, content);
      plate.x = (Number(x) || 0) + (Number(opts.dx) || 0);
      plate.y = Number(y) || 0;
      plate.alpha = 1;
      plate.scale.set(0.92);
      floatLayer.addChild(plate);
      held = {
        kind: 'floater',
        tier: tier || 'normal',
        node: plate,
        glyph: label,
        sampleContract: 'ink-plate',
      };
      return { outcome: 'held', motion: 'normal' };
    }
    content.x = (Number(x) || 0) + (Number(opts.dx) || 0);
    content.y = Number(y) || 0;
    content.alpha = 1;
    content.scale.set(0.92);
    floatLayer.addChild(content);

    const token = beginBarrier('floater');
    const span = beginSpan('presentation.floater', {
      attributes: { tier: tier || cls || 'notice' },
    });
    const pol = policy();
    const endState = { y: content.y - style.rise, alpha: 0, scale: 1 };
    try {
      const runner = tween({
        from: { y: content.y, alpha: 1, scale: 0.92 },
        to: endState,
        duration: style.dur,
        easing: style.easing,
        endState,
        policy: pol,
        onUpdate(v) {
          if (!content || content.destroyed) return;
          content.y = v.y;
          content.alpha = v.alpha;
          if (content.scale) content.scale.set(v.scale);
        },
      });
      const result = await runner.done;
      content.destroy({ children: true, context: true });
      span.finish?.('settled', {
        attributes: { motion: result.motion, endState: `floater-cleared-${tier || 'notice'}` },
      });
      token.finish?.();
      return result;
    } catch (error) {
      try { content.destroy({ children: true, context: true }); } catch { /* */ }
      span.finish?.('failed', { reason: 'presentation-error' });
      token.cancel?.();
      throw error;
    }
  }

  async function banner(text, opts = {}) {
    if (destroyed) return { outcome: 'skipped' };
    const kind = opts.kind || 'turn';
    const plain = String(text).replace(/<[^>]+>/g, '');
    // Probe/e2e transient capture — never put dialogue body into the behaviour trace.
    try {
      if (typeof globalThis !== 'undefined' && Array.isArray(globalThis.__seenTransientText)) {
        globalThis.__seenTransientText.push(plain);
      }
    } catch { /* optional probe hook */ }
    const token = beginBarrier('banner');
    const span = beginSpan('presentation.banner', {
      attributes: { kind },
    });
    const plate = new Container();
    const bg = new Graphics();
    const lines = plain.split(/\n/).filter(Boolean);
    const longest = lines.reduce((n, line) => Math.max(n, line.length), plain.length);
    const w = Math.min(640, Math.max(280, longest * 18));
    const h = kind === 'boss' || lines.length > 1 ? 72 : 56;
    bg.roundRect(-w / 2, -h / 2, w, h, 6)
      .fill({ color: 0x0b0e1a, alpha: 0.88 });
    const railColor = kind === 'boss' || kind === 'defeat' || kind === 'guard-shattered'
      ? hexToNum(COLOUR.danger)
      : kind === 'victory' || kind === 'perfect' ? hexToNum(COLOUR.gold)
        : hexToNum(COLOUR.gold);
    const rail = new Graphics();
    rail.rect(-w / 2, h / 2 - 3, w, 2).fill({ color: railColor, alpha: 1 });
    rail.rect(-w / 2, -h / 2 + 1, w, 2).fill({ color: railColor, alpha: 1 });
    const label = makeLabel(plain, {
      size: kind === 'boss' ? 32 : kind === 'victory' || kind === 'defeat' || kind === 'perfect' ? 34 : 28,
      fill: COLOUR.parchment,
    });
    plate.addChild(bg, rail, label);
    const stageWidth = typeof opts.stageW === 'number' ? opts.stageW : 800;
    const stageHeight = typeof opts.stageH === 'number' ? opts.stageH : 600;
    plate.x = typeof opts.x === 'number' ? opts.x : stageWidth / 2;
    plate.y = typeof opts.y === 'number' ? opts.y : stageHeight * 0.38;
    plate.alpha = 1;
    plate.scale.set(kind === 'boss' ? 0.92 : 1);
    bannerLayer.addChild(plate);

    if (opts.holdForSample) {
      held = { kind: 'banner', bannerKind: kind, node: plate, glyph: label, sampleContract: 'banner-plate' };
      // Keep barrier open until clearHeld; finish span on clear.
      held.token = token;
      held.span = span;
      return { outcome: 'held', motion: 'normal' };
    }

    const pol = policy();
    const endState = { x: plate.x, alpha: 1, scale: 1, rail: 1 };
    try {
      const runner = tween({
        from: { x: plate.x - 24, alpha: 0, scale: plate.scale.x, rail: 0 },
        to: { x: plate.x, alpha: 1, scale: 1, rail: 1 },
        duration: DURATION_MS.ceremony,
        easing: kind === 'boss' || kind === 'victory' || kind === 'perfect' || kind === 'guard-shattered' ? 'spring' : 'outSoft',
        endState,
        policy: pol,
        onUpdate(v) {
          if (!plate || plate.destroyed) return;
          plate.x = v.x;
          plate.alpha = v.alpha;
          if (plate.scale) plate.scale.set(v.scale);
          if (rail && !rail.destroyed && rail.scale) rail.scale.set(Math.max(0.01, v.rail), 1);
        },
      });
      const result = await runner.done;
      const holdMs = typeof opts.holdMs === 'number'
        ? opts.holdMs
        : (reduced() ? 16 : 420);
      await new Promise((r) => setTimeout(r, Math.max(0, holdMs)));
      plate.destroy({ children: true, context: true });
      span.finish?.('settled', {
        attributes: { kind, motion: result.motion, endState: `banner-held-${kind}` },
      });
      token.finish?.();
      return result;
    } catch (error) {
      try { plate.destroy({ children: true, context: true }); } catch { /* */ }
      span.finish?.('failed', { reason: 'presentation-error' });
      token.cancel?.();
      throw error;
    }
  }

  async function flyTo(x0, y0, x1, y1, {
    n = 6, color = '#ffe9ac', size = 8, dur = 640, done = null,
  } = {}) {
    if (destroyed || n <= 0) { done?.(); return; }
    const token = beginBarrier('mote-flight');
    const pol = policy();
    const motes = [];
    try {
      for (let i = 0; i < n; i += 1) {
        const g = new Graphics();
        g.circle(0, 0, size / 2).fill({ color: hexToNum(color), alpha: 1 });
        g.x = x0;
        g.y = y0;
        g.alpha = 0;
        moteLayer.addChild(g);
        motes.push(g);
      }
      if (reduced()) {
        for (const m of motes) m.destroy();
        token.finish?.();
        done?.();
        return;
      }
      // Stagger tween *start* (not only the await) so later motes leave later.
      const jobs = motes.map((m, i) => new Promise((resolve, reject) => {
        setTimeout(() => {
          const mx = (x0 + x1) / 2 + (Math.random() - 0.5) * 140;
          const my = Math.min(y0, y1) - 50 - Math.random() * 80;
          tween({
            from: { t: 0 },
            to: { t: 1 },
            duration: dur,
            easing: 'outSoft',
            policy: pol,
            onUpdate(v) {
              if (!m || m.destroyed) return;
              const t = v.t;
              const ox = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * mx + t * t * x1;
              const oy = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * my + t * t * y1;
              m.x = ox;
              m.y = oy;
              m.alpha = t < 0.85 ? Math.min(1, t * 2) : 1 - (t - 0.85) / 0.15;
              m.scale.set(0.5 + t * 0.55);
            },
          }).done.then(() => {
            try { m.destroy(); } catch { /* */ }
            resolve();
          }).catch(reject);
        }, i * 46);
      }));
      await Promise.all(jobs);
      token.finish?.();
      done?.();
    } catch (error) {
      for (const m of motes) {
        try { m.destroy(); } catch { /* */ }
      }
      token.cancel?.();
      throw error;
    }
  }

  async function flyCardBacks(fromList, dest, opts = {}) {
    if (destroyed) return 0;
    if (hooks.failNextFlight) {
      hooks.failNextFlight = false;
      try { globalThis.__forcedDrawAnimationFailure = true; } catch { /* */ }
      throw new Error('forced-draw-wave-animation-failure');
    }
    const list = Array.isArray(fromList) ? fromList : [];
    const n = list.length;
    const ceremony = opts.ceremony || 'discard';
    const budget = opts.budgetMs
      ?? CEREMONY_BUDGET_MS[ceremony]
      ?? 440;
    const sched = opts.schedule || flightSchedule(n, budget, { ceremony });
    const uids = opts.uids || list.map((s, i) => s.uid ?? i);
    const pol = opts.policy || policy();
    const motionReduced = isReducedTier(pol);

    const token = beginBarrier('card-flight');
    const parentSpan = beginSpan('presentation.card-flight', {
      attributes: {
        ceremony,
        role: 'parent',
        count: n,
        motion: motionReduced ? 'reduced' : 'full',
      },
      replay: list[0]?.inst ? {
        v: 1,
        kind: 'card-flight',
        subject: {
          kind: 'card',
          contentId: list[0].inst.id,
          upgraded: !!list[0].inst.up,
        },
        parameters: {
          destination: ceremony === 'reshuffle' ? 'draw' : 'discard',
          motion: motionReduced ? 'reduced' : 'full',
          count: n,
        },
        endState: {
          destination: ceremony === 'reshuffle' ? 'draw' : 'discard',
          visible: false,
        },
      } : undefined,
    });
    const parentSeq = parentSpan?.seq ?? null;

    const land = typeof dest === 'object' && dest
      ? { x: dest.x ?? dest.cx ?? 0, y: dest.y ?? dest.cy ?? 0 }
      : { x: 0, y: 0 };

    const childSpans = [];
    const sprites = [];

    try {
      if (n === 0 || motionReduced) {
        for (const uid of uids) {
          const child = beginSpan('presentation.card-flight', {
            ...(Number.isInteger(parentSeq) && parentSeq > 0 ? { causeSeq: parentSeq } : {}),
            attributes: {
              ceremony,
              role: 'child',
              uid: String(uid),
              motion: 'reduced',
            },
          });
          child.finish?.('settled', {
            attributes: {
              ceremony,
              role: 'child',
              uid: String(uid),
              motion: 'reduced',
              endState: `pile-count-settled-${ceremony}`,
            },
          });
          childSpans.push(child);
        }
        parentSpan.finish?.('settled', {
          attributes: {
            ceremony,
            role: 'parent',
            motion: 'reduced',
            endState: `pile-count-settled-${ceremony}`,
          },
        });
        token.finish?.();
        return sched.awaitMs || 0;
      }

      const childJobs = [];
      for (let i = 0; i < n; i += 1) {
        const src = list[i];
        const uid = uids[i];
        const child = beginSpan('presentation.card-flight', {
          ...(Number.isInteger(parentSeq) && parentSeq > 0 ? { causeSeq: parentSeq } : {}),
          attributes: {
            ceremony,
            role: 'child',
            uid: String(uid),
            motion: 'full',
          },
        });
        childSpans.push(child);

        let sprite;
        if (opts.face === 'card' && src?.inst && cardFace?.acquire) {
          try {
            const entry = cardFace.acquire(src.inst, { up: !!src.inst.up });
            sprite = new Sprite(entry?.texture || Texture.WHITE);
          } catch {
            sprite = null;
          }
        }
        if (!sprite) {
          const g = new Graphics();
          const w = src.w || 48;
          const h = src.h || 66;
          g.roundRect(-w / 2, -h / 2, w, h, 6)
            .fill({ color: 0x1d2440, alpha: 1 })
            .stroke({ color: hexToNum(COLOUR.gold), width: 1.5 });
          sprite = g;
        } else {
          sprite.anchor?.set?.(0.5, 0.5);
          const w = src.w || 96;
          if (sprite.texture?.width) {
            sprite.width = w;
            sprite.height = w * 1.42;
          }
        }
        sprite.x = src.x;
        sprite.y = src.y;
        sprite.alpha = 1;
        flightLayer.addChild(sprite);
        sprites.push(sprite);

        const land = src.dest || dest;
        const alt = (i % 2 === 0 ? 1 : -1) * (ceremony === 'reshuffle' ? 32 : 18);
        const delay = i * sched.stagger;
        // Delay tween *start*; parent awaits last child settle (honest wall-clock).
        childJobs.push(new Promise((resolve) => {
          setTimeout(() => {
            const landPt = src.dest
              ? { x: src.dest.x, y: src.dest.y }
              : land;
            const mx2 = src.x + (landPt.x - src.x) * 0.45 + alt;
            const my2 = Math.min(src.y, landPt.y) - (ceremony === 'reshuffle' ? 28 : 24);
            tween({
              from: { t: 0 },
              to: { t: 1 },
              duration: sched.flightDur,
              easing: 'outSoft',
              policy: pol,
              onUpdate(v) {
                if (!sprite || sprite.destroyed) return;
                const t = v.t;
                sprite.x = (1 - t) * (1 - t) * src.x + 2 * (1 - t) * t * mx2 + t * t * landPt.x;
                sprite.y = (1 - t) * (1 - t) * src.y + 2 * (1 - t) * t * my2 + t * t * landPt.y;
                sprite.alpha = 1 - t * 0.08;
                if (sprite.scale) sprite.scale.set(1 - t * 0.25);
              },
            }).done.then(() => {
              try { if (sprite && !sprite.destroyed) sprite.destroy(); } catch { /* */ }
              child.finish?.('settled', {
                attributes: {
                  ceremony, role: 'child', motion: 'full', uid: String(uid),
                },
              });
              resolve();
            }).catch(() => {
              try { if (sprite && !sprite.destroyed) sprite.destroy(); } catch { /* */ }
              child.finish?.('cancelled', {
                attributes: { ceremony, role: 'child', uid: String(uid) },
              });
              resolve();
            });
          }, delay);
        }));
      }

      await Promise.all(childJobs);
      for (const s of sprites) {
        if (s && !s.destroyed) {
          try { s.destroy(); } catch { /* */ }
        }
      }
      parentSpan.finish?.('settled', {
        attributes: {
          ceremony,
          role: 'parent',
          motion: 'full',
          endState: `pile-count-settled-${ceremony}`,
        },
      });
      token.finish?.();
      return sched.awaitMs;
    } catch (error) {
      for (const s of sprites) {
        try { s.destroy(); } catch { /* */ }
      }
      for (const child of childSpans) {
        try { child.finish?.('failed', { reason: 'animation-error' }); } catch { /* */ }
      }
      parentSpan.finish?.('failed', { reason: 'animation-error' });
      token.cancel?.();
      throw error;
    }
  }

  /**
   * Lantern art cast ghost — sprite rises from the hero and fades.
   * Full/LITE: 900ms scale/opacity keyframes. REDUCED: settle cleared immediately.
   */
  async function artCast({
    x = 0, y = 0, url = null, size = 110, artId = null, policy: polOverride = null,
  } = {}) {
    if (destroyed) return { outcome: 'skipped' };
    const token = beginBarrier('art-cast');
    const span = beginSpan('presentation.art-cast', {
      attributes: { artId: artId || 'unknown' },
    });
    const pol = polOverride || policy();
    if (!url) {
      span.finish?.('skipped', { reason: 'no-asset', attributes: { endState: 'art-cast-cleared' } });
      token.finish?.();
      return { outcome: 'skipped', motion: isReducedTier(pol) ? 'reduced' : 'full' };
    }
    if (isReducedTier(pol)) {
      span.finish?.('settled', {
        attributes: { motion: 'reduced', endState: 'art-cast-cleared' },
      });
      token.finish?.();
      return { outcome: 'settled', motion: 'reduced' };
    }

    let sprite = null;
    try {
      const texture = await Assets.load(url);
      if (destroyed) {
        span.finish?.('skipped', { reason: 'destroyed' });
        token.finish?.();
        return { outcome: 'skipped' };
      }
      sprite = new Sprite(texture);
      sprite.anchor.set(0.5);
      sprite.x = Number(x) || 0;
      sprite.y = (Number(y) || 0) - 30;
      sprite.alpha = 0;
      const setSize = (s) => {
        sprite.width = size * s;
        sprite.height = size * s;
      };
      setSize(0.4);
      artCastLayer.addChild(sprite);

      const y0 = sprite.y;
      const endState = { visible: false, cleared: true };
      const runner = tween({
        from: { t: 0 },
        to: { t: 1 },
        duration: 900,
        easing: 'outSoft',
        endState,
        policy: pol,
        onUpdate(v) {
          if (!sprite || sprite.destroyed) return;
          const t = v.t;
          if (t <= 0.3) {
            const u = t / 0.3;
            setSize(0.4 + u * 0.6);
            sprite.alpha = u;
            sprite.y = y0 - u * 8;
          } else {
            const u = (t - 0.3) / 0.7;
            setSize(1 + u * 0.05);
            sprite.alpha = 1 - u;
            sprite.y = y0 - 8 - u * 32;
          }
        },
      });
      const result = await runner.done;
      try { sprite.destroy(); } catch { /* */ }
      span.finish?.('settled', {
        attributes: { motion: result.motion, endState: 'art-cast-cleared' },
      });
      token.finish?.();
      return result;
    } catch (error) {
      try { sprite?.destroy(); } catch { /* */ }
      span.finish?.('failed', { reason: 'presentation-error' });
      token.cancel?.();
      throw error;
    }
  }

  /**
   * Consume a mesh handoff canvas (or image URL) as a temporary texture,
   * animate radial shards, destroy on settle.
   */
  async function shatter(source, opts = {}) {
    if (destroyed) return;
    if (reduced()) {
      if (source?.style) source.style.visibility = 'hidden';
      return;
    }
    const token = beginBarrier('shatter');
    const r = opts.rect || { left: 0, top: 0, width: 120, height: 120 };
    let texture = null;
    let url = null;
    try {
      if (opts.capture) {
        url = opts.capture;
        texture = Texture.from(url);
      } else if (source?.tagName === 'CANVAS') {
        texture = Texture.from(source);
      }
      const shards = [];
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      for (let i = 0; i < 12; i += 1) {
        const g = new Graphics();
        const ang = (i / 12) * Math.PI * 2;
        g.moveTo(0, 0)
          .lineTo(Math.cos(ang) * 40, Math.sin(ang) * 40)
          .lineTo(Math.cos(ang + 0.4) * 40, Math.sin(ang + 0.4) * 40)
          .closePath()
          .fill({ color: 0x9fd4ff, alpha: 0.85 });
        if (texture) {
          const spr = new Sprite(texture);
          spr.anchor.set(0.5);
          spr.width = r.width * 0.35;
          spr.height = r.height * 0.35;
          spr.x = cx;
          spr.y = cy;
          shatterLayer.addChild(spr);
          shards.push({ node: spr, ang, speed: 120 + Math.random() * 180 });
        } else {
          g.x = cx;
          g.y = cy;
          shatterLayer.addChild(g);
          shards.push({ node: g, ang, speed: 120 + Math.random() * 180 });
        }
      }
      if (source?.style) source.style.visibility = 'hidden';
      await tween({
        from: { t: 0 },
        to: { t: 1 },
        duration: 640,
        easing: 'spring',
        policy: policy(),
        onUpdate(v) {
          for (const s of shards) {
            s.node.x = cx + Math.cos(s.ang) * s.speed * v.t;
            s.node.y = cy + Math.sin(s.ang) * s.speed * v.t + v.t * v.t * 180;
            s.node.alpha = 1 - v.t;
            s.node.scale?.set?.(0.82 + v.t * 0.24);
          }
        },
      }).done;
      for (const s of shards) {
        try { s.node.destroy(); } catch { /* */ }
      }
      if (texture && texture !== Texture.WHITE) {
        try { texture.destroy(true); } catch { /* */ }
      }
      token.finish?.();
    } catch (error) {
      token.cancel?.();
      throw error;
    }
  }

  async function sampleContrast({ kind, tier, bannerKind, target, glyphStroke = false } = {}) {
    const sampleTarget = target || held?.node;
    if (!sampleTarget || sampleTarget.destroyed) {
      return { ratio: 0, measured: false, source: 'none' };
    }
    // Token-pair standing floor (still reported); e2e asserts measured pixels.
    const tokenPairs = {
      normal: [COLOUR.text, COLOUR.ink],
      heavy: [COLOUR.ember, COLOUR.ink],
      kill: [COLOUR.gold, COLOUR.ink],
      overkill: [COLOUR.danger, COLOUR.ink],
      turn: [COLOUR.parchment, COLOUR.ink],
      boss: [COLOUR.parchment, COLOUR.ink],
      variant: [COLOUR.parchment, COLOUR.ink],
      perfect: [COLOUR.parchment, COLOUR.ink],
      victory: [COLOUR.parchment, COLOUR.ink],
      'guard-shattered': [COLOUR.ember, COLOUR.ink],
      chrome: [COLOUR.text, COLOUR.ink],
      hud: [COLOUR.parchment, COLOUR.ink],
    };
    const key = kind === 'banner' ? (bannerKind || held?.bannerKind) : (tier || held?.tier || kind || 'chrome');
    const pair = tokenPairs[key] || [COLOUR.text, COLOUR.ink];
    const parse = (hex) => {
      const s = String(hex).replace('#', '');
      return [parseInt(s.slice(0, 2), 16), parseInt(s.slice(2, 4), 16), parseInt(s.slice(4, 6), 16)];
    };
    const tokenFloor = contrastOf(parse(pair[0]), parse(pair[1]));

    const readPixelBuffer = () => {
      const renderer = pixiApp?.renderer;
      if (!renderer?.extract) return null;
      try {
        pixiApp?.renderer?.render?.(pixiApp.stage);
      } catch { /* best-effort */ }
      try {
        if (typeof renderer.extract.canvas === 'function') {
          const c = renderer.extract.canvas(sampleTarget);
          if (!c || !c.width || !c.height) return null;
          const ctx = c.getContext('2d', { willReadFrequently: true });
          if (!ctx) return null;
          const image = ctx.getImageData(0, 0, c.width, c.height);
          return { data: image.data, width: c.width, height: c.height };
        }
      } catch { /* fall through to pixels */ }
      try {
        if (typeof renderer.extract.pixels === 'function') {
          const extracted = renderer.extract.pixels({ target: sampleTarget });
          if (!extracted) return null;
          if (extracted.pixels && extracted.width && extracted.height) {
            return {
              data: extracted.pixels,
              width: extracted.width,
              height: extracted.height,
            };
          }
          if (extracted instanceof Uint8Array || extracted instanceof Uint8ClampedArray) {
            const bounds = sampleTarget.getBounds?.() || { width: 0, height: 0 };
            const width = Math.max(1, Math.round(bounds.width || 0));
            const height = Math.max(1, Math.round(extracted.length / 4 / width));
            return { data: extracted, width, height };
          }
        }
      } catch { /* keep token floor */ }
      return null;
    };

    const buffer = readPixelBuffer();
    if (!buffer) {
      return {
        ratio: tokenFloor,
        fg: parse(pair[0]),
        bg: parse(pair[1]),
        kind,
        tier: key,
        measured: false,
        source: 'token',
        tokenFloor,
      };
    }

    const { data, width, height } = buffer;
    const at = (px, py) => {
      const ix = Math.max(0, Math.min(width - 1, Math.round(px)));
      const iy = Math.max(0, Math.min(height - 1, Math.round(py)));
      const i = (iy * width + ix) * 4;
      return [data[i], data[i + 1], data[i + 2], data[i + 3]];
    };
    const lum = (rgb) => relativeLuminance(rgb);
    const alphaFloor = glyphStroke ? 90 : 200;
    // Conservative contract: brightest opaque in the glyph window vs darkest
    // opaque on the plate rim — not max-of-all-pairs across the whole scan.
    let glyph = null;
    let glyphLum = -1;
    const x0 = Math.floor(width * 0.28);
    const x1 = Math.ceil(width * 0.72);
    const y0 = Math.floor(height * 0.28);
    const y1 = Math.ceil(height * 0.72);
    for (let y = y0; y <= y1; y += 2) {
      for (let x = x0; x <= x1; x += 2) {
        const g = at(x, y);
        if (g[3] < alphaFloor) continue;
        const rgb = [g[0], g[1], g[2]];
        const L = lum(rgb);
        if (L > glyphLum) {
          glyphLum = L;
          glyph = rgb;
        }
      }
    }
    let bg = null;
    let bgLum = 2;
    if (glyphStroke) {
      // Stroked chrome labels: darkest near-opaque texel is the ink stroke.
      for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
          const b = at(x, y);
          if (b[3] < alphaFloor) continue;
          const rgb = [b[0], b[1], b[2]];
          const L = lum(rgb);
          if (L < bgLum) {
            bgLum = L;
            bg = rgb;
          }
        }
      }
    } else {
      const rim = [];
      const rimPad = Math.max(2, Math.floor(Math.min(width, height) * 0.08));
      for (let x = rimPad; x < width - rimPad; x += 3) {
        rim.push([x, rimPad], [x, height - rimPad - 1]);
      }
      for (let y = rimPad; y < height - rimPad; y += 3) {
        rim.push([rimPad, y], [width - rimPad - 1, y]);
      }
      for (const [bx, by] of rim) {
        const b = at(bx, by);
        if (b[3] < alphaFloor) continue;
        const rgb = [b[0], b[1], b[2]];
        const L = lum(rgb);
        if (L < bgLum) {
          bgLum = L;
          bg = rgb;
        }
      }
    }
    const measured = (glyph && bg) ? contrastOf(glyph, bg) : 0;

    return {
      ratio: measured,
      fg: glyph || parse(pair[0]),
      bg: bg || parse(pair[1]),
      kind,
      tier: key,
      measured: measured > 0,
      source: 'pixels',
      sampleContract: held?.sampleContract
        || (glyphStroke ? 'glyph-stroke' : (kind === 'banner' || held?.kind === 'banner' ? 'banner-plate' : 'ink-plate')),
      tokenFloor,
    };
  }

  async function clearHeld() {
    if (!held) return;
    try { held.node.destroy({ children: true, context: true }); } catch { /* */ }
    held.span?.finish?.('settled', { attributes: { motion: 'normal' } });
    held.token?.finish?.();
    held = null;
  }

  function destroy() {
    if (destroyed) return;
    destroyed = true;
    try { root.destroy({ children: true, context: true }); } catch { /* */ }
  }

  return Object.freeze({
    floatText,
    banner,
    flyTo,
    flyCardBacks,
    artCast,
    shatter,
    sampleContrast,
    clearHeld,
    armFlightFailure() { hooks.failNextFlight = true; },
    destroy,
    root: () => root,
  });
}
