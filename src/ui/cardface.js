// Single card-face composer + bounded LRU texture cache (Round 5 Task 26).
// Preview/lethal/hover tint and foil are live overlays — never cached.
// DOM grids consume `exportImage`; combat acquires textures via `acquire`.

import {
  Container, Graphics, Sprite, Text, Texture,
} from 'pixi.js';

import {
  CARD_FACE_HEIGHT,
  CARD_FACE_WIDTH,
  FACE_CACHE_MAX_ENTRIES,
  approximateMeasure,
  estimateFaceBytes,
  faceCacheByteCap,
  faceDprCap,
  layoutCardFace,
  rarityRailColour,
} from './cardface-layout.js';
import { COLOUR, resolveTier } from './tokens.js';

function hexToInt(hex, fallback = 0xffffff) {
  if (typeof hex !== 'string') return fallback;
  const clean = hex.trim().replace(/^#/, '');
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return fallback;
  return Number.parseInt(clean, 16);
}

function typeTint(type) {
  if (type === 'attack') return 0x7e3040;
  if (type === 'skill') return 0x2f5a80;
  if (type === 'power') return 0x5c3f8f;
  if (type === 'curse') return 0x5c3a5c;
  return 0x47584f;
}

/** Flat hex vertices matching `.card-cost` clip-path polygon (stage-local). */
function hexGemPoints(cx, cy, size) {
  const x = cx - size / 2;
  const y = cy - size / 2;
  const pairs = [
    [0.50, 0.00], [0.93, 0.25], [0.93, 0.75],
    [0.50, 1.00], [0.07, 0.75], [0.07, 0.25],
  ];
  return pairs.map(([px, py]) => [x + px * size, y + py * size]);
}

function drawHexGemPixi(graphics, cx, cy, size, fill, stroke) {
  const pts = hexGemPoints(cx, cy, size).flat();
  graphics.poly(pts)
    .fill({ color: fill })
    .stroke({ color: stroke, width: 1.5 });
}

function drawHexGemCanvas(ctx, cx, cy, size, fillCss, strokeCss) {
  const pts = hexGemPoints(cx, cy, size);
  ctx.beginPath();
  pts.forEach(([px, py], i) => {
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  });
  ctx.closePath();
  ctx.fillStyle = fillCss;
  ctx.fill();
  ctx.strokeStyle = strokeCss;
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

function drawRarityChipPixi(graphics, region, colour, alpha = 1) {
  const r = region.radius ?? 3;
  graphics.roundRect(region.x, region.y, region.w, region.h, r)
    .fill({ color: colour, alpha });
}

function drawRarityChipCanvas(ctx, region, colourCss) {
  const r = region.radius ?? 3;
  roundRectPath(ctx, region.x, region.y, region.w, region.h, r);
  ctx.fillStyle = colourCss;
  ctx.fill();
}

function roundRectPath(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function resolveCard(registries, descriptor) {
  if (!descriptor || typeof descriptor !== 'object') {
    throw new TypeError('card descriptor required');
  }
  const id = descriptor.id;
  const table = registries?.cards || registries?.CARDS || null;
  const base = descriptor.name != null && descriptor.text != null
    ? descriptor
    : (table && id != null ? table[id] : null);
  if (!base) throw new TypeError(`unknown card id: ${id}`);
  return {
    id,
    name: base.name,
    text: base.text,
    cost: base.cost,
    rarity: base.rarity,
    type: base.type,
    up: base.up,
  };
}

function displayFields(card, displayState = {}) {
  const up = !!(displayState.up ?? displayState.upgraded);
  const text = displayState.effectiveText != null
    ? String(displayState.effectiveText)
    : (up && card.up?.text != null ? String(card.up.text) : String(card.text ?? ''));
  const cost = displayState.effectiveCost !== undefined
    ? displayState.effectiveCost
    : (up && card.up && card.up.cost !== undefined ? card.up.cost : card.cost);
  return { up, text, cost };
}

function linePlainText(line) {
  return line.map((t) => {
    if (t.kind === 'value') return String(t.value);
    if (t.kind === 'ellipsis') return '…';
    return t.text || '';
  }).join('');
}

/** Convert a canvas (or data-URL) into a non-empty PNG Blob for object URLs. */
function canvasToPngBlob(canvas) {
  if (!canvas || typeof Blob === 'undefined') return null;
  if (typeof canvas.toDataURL !== 'function') return null;
  let dataUrl;
  try {
    dataUrl = canvas.toDataURL('image/png');
  } catch {
    return null;
  }
  return dataUrlToPngBlob(dataUrl);
}

function dataUrlToPngBlob(dataUrl) {
  if (typeof dataUrl !== 'string' || !dataUrl.startsWith('data:') || typeof Blob === 'undefined') {
    return null;
  }
  const comma = dataUrl.indexOf(',');
  if (comma < 0) return null;
  const header = dataUrl.slice(0, comma);
  const payload = dataUrl.slice(comma + 1);
  const mimeMatch = /^data:([^;,]+)/.exec(header);
  const mime = mimeMatch?.[1] || 'image/png';
  try {
    if (/;base64/i.test(header)) {
      const bin = atob(payload);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i += 1) bytes[i] = bin.charCodeAt(i);
      if (!bytes.length) return null;
      return new Blob([bytes], { type: mime });
    }
    const decoded = decodeURIComponent(payload);
    if (!decoded.length) return null;
    return new Blob([decoded], { type: mime });
  } catch {
    return null;
  }
}

/** Tiny valid PNG used only when extract is unavailable (Node/stub) but Blob URLs exist. */
function stubPngBlob() {
  if (typeof Blob === 'undefined') return null;
  // 1×1 transparent PNG
  const b64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
  try {
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i += 1) bytes[i] = bin.charCodeAt(i);
    return new Blob([bytes], { type: 'image/png' });
  } catch {
    return null;
  }
}

function objectUrlFromBlob(blob) {
  if (!blob || !(blob.size > 0)) return null;
  if (typeof URL === 'undefined' || typeof URL.createObjectURL !== 'function') return null;
  try {
    return URL.createObjectURL(blob);
  } catch {
    return null;
  }
}

function revokeEntryUrl(entry) {
  if (!entry?.url || typeof entry.url !== 'string') return;
  if (entry.url.startsWith('blob:') && typeof URL !== 'undefined' && URL.revokeObjectURL) {
    try { URL.revokeObjectURL(entry.url); } catch { /* best-effort */ }
  }
  entry.url = null;
}

/**
 * @param {object} deps
 * @param {object} deps.renderer Pixi renderer (extract.canvas / generateTexture)
 * @param {object} deps.registries content registries ({ cards })
 * @param {object} [deps.assets] optional { cardArt(id) → Texture|null }
 * @param {object} deps.tokens experience tokens
 * @param {() => string} deps.getLocale real PR #7 locale token reader
 * @param {object} [deps.policy] { tier: 'lite'|'full'|… }
 * @param {Function} [deps.bakeFace] test seam: (layout) → texture
 */
export function createCardFaceComposer({
  renderer: rendererArg,
  registries,
  assets = null,
  tokens,
  getLocale,
  policy = null,
  bakeFace = null,
} = {}) {
  if (!rendererArg || typeof rendererArg !== 'object') {
    throw new TypeError('createCardFaceComposer requires a renderer');
  }
  if (typeof getLocale !== 'function') {
    throw new TypeError('createCardFaceComposer requires getLocale()');
  }
  if (!registries || typeof registries !== 'object') {
    throw new TypeError('createCardFaceComposer requires registries');
  }

  let renderer = rendererArg;
  const tier = resolveTier(policy);
  const dprCap = faceDprCap(policy);
  const byteCap = faceCacheByteCap(policy);
  const ink = hexToInt(tokens?.ink || COLOUR.ink, 0x0b0e1a);
  const gold = hexToInt(tokens?.gold || COLOUR.gold, 0xf2c14e);
  const goldDim = hexToInt(tokens?.['gold-dim'] || COLOUR.goldDim, 0x9c7c34);
  const parchment = hexToInt(tokens?.parchment || COLOUR.parchment, 0xf4e7c5);
  const textColour = hexToInt(tokens?.text || COLOUR.text, 0xece7df);
  const ember = hexToInt(tokens?.ember || COLOUR.ember, 0xff9a4d);

  /** @type {Map<string, object>} */
  const entries = new Map();
  /** @type {string[]} */
  const lru = [];
  let bytesUsed = 0;
  let destroyed = false;
  const diagnostics = [];

  const resolution = () => {
    const live = Number(renderer.resolution);
    if (Number.isFinite(live) && live > 0) return Math.min(live, dprCap);
    return dprCap;
  };

  function touch(key) {
    const idx = lru.indexOf(key);
    if (idx >= 0) lru.splice(idx, 1);
    lru.push(key);
  }

  function disposeEntry(entry) {
    if (!entry) return;
    try { entry.texture?.destroy?.(true); } catch { /* best-effort */ }
    revokeEntryUrl(entry);
    bytesUsed = Math.max(0, bytesUsed - (entry.bytes || 0));
  }

  function evictIfNeeded(nextBytes) {
    let guard = lru.length + 2;
    while (
      (lru.length >= FACE_CACHE_MAX_ENTRIES || bytesUsed + nextBytes > byteCap)
      && lru.length
      && guard > 0
    ) {
      guard -= 1;
      const victimKey = lru.shift();
      const victim = entries.get(victimKey);
      if (!victim) continue;
      if (victim.refs > 0) {
        lru.push(victimKey);
        if (lru.every((k) => (entries.get(k)?.refs || 0) > 0)) break;
        continue;
      }
      entries.delete(victimKey);
      disposeEntry(victim);
    }
  }

  function buildDisplay(card, displayState) {
    const dpr = resolution();
    const fields = displayFields(card, displayState);
    const layout = layoutCardFace(card, {
      getLocale,
      dpr,
      up: fields.up,
      effectiveCost: fields.cost,
      effectiveText: fields.text,
      measure: approximateMeasure,
    });
    if (layout.body.diagnostic) diagnostics.push(layout.body.diagnostic);
    return { layout, dpr, fields };
  }

  function paintFace(layout) {
    const root = new Container();
    const { width, height, regions } = layout;

    const frame = new Graphics();
    frame.roundRect(0, 0, width, height, 14)
      .fill({ color: ink, alpha: 0.96 })
      .stroke({ color: ink, width: 2, alpha: 0.96 });
    frame.roundRect(3, 3, width - 6, height - 6, 12)
      .stroke({ color: goldDim, width: 1, alpha: 0.66 });
    frame.roundRect(1, 1, width - 2, height - 2, 13)
      .stroke({ color: typeTint(layout.type), width: 2, alpha: 0.55 });
    root.addChild(frame);

    const artBg = new Graphics();
    artBg.roundRect(regions.art.x, regions.art.y, regions.art.w, regions.art.h, 10)
      .fill({ color: typeTint(layout.type), alpha: 0.35 });
    root.addChild(artBg);
    const artTex = assets?.cardArt?.(layout.id) || assets?.getCardArt?.(layout.id) || null;
    if (artTex && artTex !== Texture.EMPTY) {
      const sprite = new Sprite(artTex);
      sprite.x = regions.art.x;
      sprite.y = regions.art.y;
      sprite.width = regions.art.w;
      sprite.height = regions.art.h;
      root.addChild(sprite);
    }

    if (layout.cost != null) {
      const gem = new Graphics();
      const cx = regions.cost.x + regions.cost.size / 2;
      const cy = regions.cost.y + regions.cost.size / 2;
      drawHexGemPixi(gem, cx, cy, regions.cost.size, gold, ink);
      root.addChild(gem);
      const costText = new Text({
        text: String(layout.cost),
        style: {
          fontFamily: 'Cinzel',
          fontSize: 18,
          fontWeight: '800',
          fill: ink,
          align: 'center',
        },
      });
      costText.anchor?.set?.(0.5, 0.5);
      costText.x = cx;
      costText.y = cy;
      root.addChild(costText);
    }

    const nameText = new Text({
      text: layout.name,
      style: {
        fontFamily: 'Cinzel',
        fontSize: 17,
        fontWeight: '700',
        fill: layout.up ? ember : parchment,
        align: 'center',
        letterSpacing: 0.3,
      },
    });
    nameText.anchor?.set?.(0.5, 0.5);
    nameText.x = regions.name.x + regions.name.w / 2;
    nameText.y = regions.name.y + regions.name.h / 2;
    if (nameText.width > regions.name.w) {
      nameText.scale.x = regions.name.w / Math.max(1, nameText.width);
      nameText.scale.y = nameText.scale.x;
    }
    root.addChild(nameText);

    const body = layout.body;
    const lineHeight = body.fontSize * 1.25;
    const bodyTop = regions.body.y
      + Math.max(0, (regions.body.h - body.lines.length * lineHeight) / 2);
    body.lines.forEach((line, index) => {
      const plain = linePlainText(line);
      if (!plain) return;
      const lineText = new Text({
        text: plain,
        style: {
          fontFamily: 'Alegreya',
          fontSize: body.fontSize,
          fill: textColour,
          align: 'center',
          wordWrap: false,
        },
      });
      lineText.anchor?.set?.(0.5, 0);
      lineText.x = regions.body.x + regions.body.w / 2;
      lineText.y = bodyTop + index * lineHeight;
      root.addChild(lineText);
    });

    const chip = new Graphics();
    drawRarityChipPixi(
      chip,
      regions.rarityRail,
      hexToInt(rarityRailColour(layout.rarity), 0xaaa6b8),
      tier === 'lite' ? 0.82 : 1,
    );
    root.addChild(chip);

    if (layout.up) {
      const mark = new Graphics();
      mark.circle(width - 18, 18, 11)
        .fill({ color: ember, alpha: 0.92 })
        .stroke({ color: ink, width: 1 });
      root.addChild(mark);
      const plus = new Text({
        text: '+',
        style: { fontFamily: 'Cinzel', fontSize: 14, fontWeight: '700', fill: ink },
      });
      plus.anchor?.set?.(0.5, 0.5);
      plus.x = width - 18;
      plus.y = 18;
      root.addChild(plus);
    }

    return root;
  }

  function bakeTexture(layout) {
    if (typeof bakeFace === 'function') {
      return bakeFace(layout);
    }
    const canGenerate = typeof renderer.generateTexture === 'function'
      || typeof renderer.textureGenerator?.generateTexture === 'function';
    if (!canGenerate) {
      return {
        width: CARD_FACE_WIDTH,
        height: CARD_FACE_HEIGHT,
        destroy() {},
        __stub: true,
        key: layout.key,
      };
    }
    const display = paintFace(layout);
    let texture;
    try {
      if (typeof renderer.generateTexture === 'function') {
        texture = renderer.generateTexture({
          target: display,
          resolution: resolution(),
        });
      } else {
        texture = renderer.textureGenerator.generateTexture(display);
      }
    } finally {
      try { display.destroy({ children: true, context: true }); } catch { /* ignore */ }
    }
    return texture;
  }

  function ensureEntry(cardDescriptor, displayState) {
    if (destroyed) throw new Error('card-face composer destroyed');
    const card = resolveCard(registries, cardDescriptor);
    const { layout, dpr } = buildDisplay(card, displayState);
    const key = layout.key;
    let entry = entries.get(key);
    if (entry) {
      touch(key);
      return entry;
    }
    const bytes = estimateFaceBytes(CARD_FACE_WIDTH, CARD_FACE_HEIGHT, dpr);
    evictIfNeeded(bytes);
    const texture = bakeTexture(layout);
    entry = {
      key,
      texture,
      bytes,
      refs: 0,
      layout,
      url: null,
    };
    entries.set(key, entry);
    touch(key);
    bytesUsed += bytes;
    return entry;
  }

  function releaseRef(entry) {
    entry.refs = Math.max(0, entry.refs - 1);
    // Object URLs are scoped to live consumers; revoke on close (refs→0) or eviction.
    if (entry.refs === 0) revokeEntryUrl(entry);
  }

  function acquire(cardDescriptor, displayState = {}) {
    const entry = ensureEntry(cardDescriptor, displayState);
    entry.refs += 1;
    return Object.freeze({
      key: entry.key,
      texture: entry.texture,
      release() { releaseRef(entry); },
    });
  }

  function paintFaceCanvas2d(layout) {
    if (typeof document === 'undefined' || typeof document.createElement !== 'function') {
      return null;
    }
    const canvas = document.createElement('canvas');
    canvas.width = CARD_FACE_WIDTH;
    canvas.height = CARD_FACE_HEIGHT;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    const { width, height, regions } = layout;
    const inkCss = tokens?.ink || COLOUR.ink;
    const goldCss = tokens?.gold || COLOUR.gold;
    const goldDimCss = tokens?.['gold-dim'] || COLOUR.goldDim;
    const parchmentCss = tokens?.parchment || COLOUR.parchment;
    const textCss = tokens?.text || COLOUR.text;
    const emberCss = tokens?.ember || COLOUR.ember;
    const typeFill = layout.type === 'attack' ? '#7e3040'
      : layout.type === 'skill' ? '#2f5a80'
        : layout.type === 'power' ? '#5c3f8f'
          : layout.type === 'curse' ? '#5c3a5c' : '#47584f';

    ctx.fillStyle = inkCss;
    roundRectPath(ctx, 0, 0, width, height, 14);
    ctx.fill();
    ctx.strokeStyle = goldDimCss;
    ctx.lineWidth = 1;
    roundRectPath(ctx, 3, 3, width - 6, height - 6, 12);
    ctx.stroke();
    ctx.fillStyle = typeFill;
    ctx.globalAlpha = 0.35;
    roundRectPath(ctx, regions.art.x, regions.art.y, regions.art.w, regions.art.h, 10);
    ctx.fill();
    ctx.globalAlpha = 1;

    const artImg = assets?.cardArtImage?.(layout.id) || null;
    if (artImg && artImg.complete && artImg.naturalWidth > 0) {
      try {
        ctx.drawImage(
          artImg,
          regions.art.x, regions.art.y, regions.art.w, regions.art.h,
        );
      } catch { /* tainted / stub */ }
    }

    if (layout.cost != null) {
      const cx = regions.cost.x + regions.cost.size / 2;
      const cy = regions.cost.y + regions.cost.size / 2;
      drawHexGemCanvas(ctx, cx, cy, regions.cost.size, goldCss, inkCss);
      ctx.fillStyle = inkCss;
      ctx.font = '800 18px Cinzel, serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(layout.cost), cx, cy);
    }

    ctx.fillStyle = layout.up ? emberCss : parchmentCss;
    ctx.font = '700 17px Cinzel, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      layout.name,
      regions.name.x + regions.name.w / 2,
      regions.name.y + regions.name.h / 2,
      regions.name.w,
    );

    const body = layout.body;
    const lineHeight = body.fontSize * 1.25;
    const bodyTop = regions.body.y
      + Math.max(0, (regions.body.h - body.lines.length * lineHeight) / 2);
    ctx.fillStyle = textCss;
    ctx.font = `${body.fontSize}px Alegreya, serif`;
    ctx.textBaseline = 'top';
    body.lines.forEach((line, index) => {
      const plain = linePlainText(line);
      if (!plain) return;
      ctx.fillText(
        plain,
        regions.body.x + regions.body.w / 2,
        bodyTop + index * lineHeight,
        regions.body.w,
      );
    });

    drawRarityChipCanvas(ctx, regions.rarityRail, rarityRailColour(layout.rarity));
    return canvas;
  }

  function roundRect(ctx, x, y, w, h, r) {
    roundRectPath(ctx, x, y, w, h, r);
  }

  function exportImage(cardDescriptor, displayState = {}) {
    const entry = ensureEntry(cardDescriptor, displayState);
    entry.refs += 1;
    const artImg = assets?.cardArtImage?.(entry.layout.id) || null;
    const artUrl = assets?.cardArtUrl?.(entry.layout.id) || null;
    const artReady = !!(artImg && artImg.complete && artImg.naturalWidth > 0);
    // Re-bake once art finishes decoding so shop/reward faces pick up real art.
    if (entry.url && artUrl && artReady && !entry.artBaked) {
      revokeEntryUrl(entry);
    }
    if (!entry.url) {
      let blob = null;
      // Prefer canvas2d when the art loader is warm so shop/reward exports
      // include real card art even before Pixi textures finish decoding.
      const canvas2d = paintFaceCanvas2d(entry.layout);
      if (canvas2d) blob = canvasToPngBlob(canvas2d);
      if (!blob && typeof renderer.extract?.canvas === 'function') {
        const display = paintFace(entry.layout);
        let canvas = null;
        try {
          canvas = renderer.extract.canvas(display);
        } finally {
          try { display.destroy({ children: true, context: true }); } catch { /* ignore */ }
        }
        blob = canvasToPngBlob(canvas);
      }
      // Prefer a real object URL of a non-empty Blob (plan contract). Never empty Blob.
      entry.url = objectUrlFromBlob(blob)
        || objectUrlFromBlob(stubPngBlob())
        || `cardface:${entry.key}`;
      entry.artBaked = artReady || !artUrl;
    }
    return Object.freeze({
      key: entry.key,
      url: entry.url,
      release() { releaseRef(entry); },
    });
  }

  /**
   * Drop baked entries. Empty criteria / `{ all: true }` / `{ localeChanged: true }`
   * / `{ text: true }` clears every cached face (locale switch path).
   * `{ locale: 'xx' }` drops keys whose cache-key prefix matches that locale.
   */
  function invalidate(criteria = {}) {
    const clearAll = !criteria
      || Object.keys(criteria).length === 0
      || criteria.all === true
      || criteria.localeChanged === true
      || criteria.text === true
      || criteria.allText === true;
    const localeNow = getLocale();
    let removed = 0;
    for (const key of [...entries.keys()]) {
      const entry = entries.get(key);
      if (!entry) continue;
      let drop = clearAll;
      if (!drop && criteria.key != null) drop = key === criteria.key;
      if (!drop && criteria.id != null) drop = entry.layout?.id === criteria.id;
      if (!drop && criteria.locale != null) {
        // Prefix match drops matching keys (not the inverse).
        drop = key.startsWith(`${criteria.locale}\u001f`);
      }
      // Stale locale prefix vs live getLocale() always drops.
      if (!key.startsWith(`${localeNow}\u001f`)) drop = true;
      if (!drop) continue;
      entries.delete(key);
      const idx = lru.indexOf(key);
      if (idx >= 0) lru.splice(idx, 1);
      disposeEntry(entry);
      removed += 1;
    }
    return removed;
  }

  function rebuild(nextRenderer) {
    if (!nextRenderer) throw new TypeError('rebuild requires a renderer');
    renderer = nextRenderer;
    for (const key of [...entries.keys()]) {
      const entry = entries.get(key);
      entries.delete(key);
      disposeEntry(entry);
    }
    lru.length = 0;
    bytesUsed = 0;
  }

  function stats() {
    return Object.freeze({
      entries: entries.size,
      bytes: bytesUsed,
      byteCap,
      maxEntries: FACE_CACHE_MAX_ENTRIES,
      tier,
      dprCap,
      diagnostics: Object.freeze([...diagnostics]),
      keys: Object.freeze([...entries.keys()]),
    });
  }

  function destroy() {
    if (destroyed) return;
    destroyed = true;
    for (const key of [...entries.keys()]) {
      disposeEntry(entries.get(key));
      entries.delete(key);
    }
    lru.length = 0;
    bytesUsed = 0;
  }

  return Object.freeze({
    acquire,
    exportImage,
    invalidate,
    rebuild,
    stats,
    destroy,
    faceCacheKeyFor(cardDescriptor, displayState = {}) {
      const card = resolveCard(registries, cardDescriptor);
      const { layout } = buildDisplay(card, displayState);
      return layout.key;
    },
    paintFace,
  });
}

export {
  CARD_FACE_WIDTH,
  CARD_FACE_HEIGHT,
  estimateFaceBytes,
};
