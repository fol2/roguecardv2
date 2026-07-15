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
  typeTintCss,
} from './cardface-layout.js';
import { COLOUR, resolveTier } from './tokens.js';

function hexToInt(hex, fallback = 0xffffff) {
  if (typeof hex !== 'string') return fallback;
  const clean = hex.trim().replace(/^#/, '');
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return fallback;
  return Number.parseInt(clean, 16);
}

function parseRgb(css) {
  if (typeof css !== 'string') return null;
  const hex = css.trim().replace(/^#/, '');
  if (/^[0-9a-fA-F]{6}$/.test(hex)) {
    return {
      r: Number.parseInt(hex.slice(0, 2), 16),
      g: Number.parseInt(hex.slice(2, 4), 16),
      b: Number.parseInt(hex.slice(4, 6), 16),
    };
  }
  const m = /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i.exec(css);
  if (!m) return null;
  return { r: +m[1], g: +m[2], b: +m[3] };
}

function mixCss(a, b, t) {
  const A = parseRgb(a);
  const B = parseRgb(b);
  if (!A || !B) return a;
  const u = Math.max(0, Math.min(1, t));
  const r = Math.round(A.r + (B.r - A.r) * u);
  const g = Math.round(A.g + (B.g - A.g) * u);
  const bch = Math.round(A.b + (B.b - A.b) * u);
  return `#${[r, g, bch].map((n) => n.toString(16).padStart(2, '0')).join('')}`;
}

/** Production parchment / body / upgraded-name (styles.css), not Round5 COLOUR drift. */
const PROD = Object.freeze({
  parchment: '#e8dfc8',
  body: '#c6ccdf',
  nameUp: '#9be8a8',
  lead: '#05070e',
  costInk: '#241a05',
  paneTop: 'rgba(16, 20, 36, 0.9)',
  paneBot: 'rgba(9, 11, 20, 0.94)',
});

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

function clipHexPath(ctx, cx, cy, size) {
  const pts = hexGemPoints(cx, cy, size);
  ctx.beginPath();
  pts.forEach(([px, py], i) => {
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  });
  ctx.closePath();
}

/** Production `.card-cost` gold / free green hex gem (conic approximated). */
function drawHexGemCanvas(ctx, cx, cy, size, { free = false } = {}) {
  ctx.save();
  clipHexPath(ctx, cx, cy, size);
  ctx.clip();
  const g = ctx.createLinearGradient(cx - size / 2, cy - size / 2, cx + size / 2, cy + size / 2);
  if (free) {
    g.addColorStop(0, '#d9fbe7');
    g.addColorStop(0.35, '#37d67a');
    g.addColorStop(0.7, '#17703e');
    g.addColorStop(1, '#37d67a');
  } else {
    g.addColorStop(0, '#ffe9ac');
    g.addColorStop(0.35, '#f2c14e');
    g.addColorStop(0.7, '#b3831f');
    g.addColorStop(1, '#f2c14e');
  }
  ctx.fillStyle = g;
  ctx.fill();
  const shine = ctx.createLinearGradient(cx - size / 2, cy - size / 2, cx + size / 2, cy + size / 2);
  shine.addColorStop(0, 'rgba(255,255,255,0.55)');
  shine.addColorStop(0.28, 'transparent');
  ctx.fillStyle = shine;
  ctx.fill();
  const shade = ctx.createLinearGradient(cx + size / 2, cy + size / 2, cx - size / 2, cy - size / 2);
  shade.addColorStop(0, free ? 'rgba(19,91,50,0.8)' : 'rgba(122,84,23,0.75)');
  shade.addColorStop(0.3, 'transparent');
  ctx.fillStyle = shade;
  ctx.fill();
  ctx.restore();

  ctx.save();
  clipHexPath(ctx, cx, cy, size * 0.78);
  ctx.clip();
  const inset = ctx.createLinearGradient(cx, cy - size / 2, cx, cy + size / 2);
  inset.addColorStop(0, 'rgba(255,255,255,0.35)');
  inset.addColorStop(0.42, 'transparent');
  inset.addColorStop(0.88, 'rgba(0,0,0,0.22)');
  ctx.fillStyle = inset;
  ctx.fill();
  ctx.restore();
}

function drawHexGemPixi(graphics, cx, cy, size, fill, stroke) {
  const pts = hexGemPoints(cx, cy, size).flat();
  graphics.poly(pts)
    .fill({ color: fill })
    .stroke({ color: stroke, width: 1.5 });
}

function drawRarityChipPixi(graphics, region, colour, alpha = 1) {
  const r = region.radius ?? 3;
  graphics.roundRect(region.x, region.y, region.w, region.h, r)
    .fill({ color: colour, alpha });
}

function drawRarityChipCanvas(ctx, region, colourCss, rarity) {
  const r = region.radius ?? 3;
  roundRectPath(ctx, region.x, region.y, region.w, region.h, r);
  if (rarity === 'uncommon') {
    const g = ctx.createLinearGradient(region.x, region.y, region.x + region.w, region.y);
    g.addColorStop(0, '#47c2e0');
    g.addColorStop(1, '#7fe3f2');
    ctx.fillStyle = g;
  } else if (rarity === 'rare' || rarity === 'boss') {
    const g = ctx.createLinearGradient(region.x, region.y, region.x + region.w, region.y);
    g.addColorStop(0, COLOUR.gold);
    g.addColorStop(1, '#ffe9ac');
    ctx.fillStyle = g;
  } else {
    ctx.fillStyle = colourCss;
  }
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

  /**
   * Production-parity face bake. Canvas2d is the sole paint authority so combat
   * textures and shop/deck exportImage share one raster that mirrors styles.css.
   */
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
    const tint = typeTintCss(layout.type);
    const lead = PROD.lead;

    // `.card-inner` pane — radius 11, lead border, type-tinted glass gradient.
    ctx.save();
    roundRectPath(ctx, 0, 0, width, height, 11);
    ctx.clip();
    const pane = ctx.createLinearGradient(0, 0, width * 0.15, height);
    pane.addColorStop(0, mixCss(tint, '#101424', 0.85));
    pane.addColorStop(0.58, '#090b14');
    ctx.fillStyle = pane;
    ctx.fillRect(0, 0, width, height);
    // Inset tint rim (approx inset box-shadow).
    ctx.strokeStyle = mixCss(tint, 'rgba(0,0,0,0)', 0.4);
    ctx.globalAlpha = 0.4;
    ctx.lineWidth = 1;
    roundRectPath(ctx, 1, 1, width - 2, height - 2, 10);
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.restore();

    ctx.strokeStyle = layout.rarity === 'rare' || layout.rarity === 'boss' ? '#1a1408' : lead;
    ctx.lineWidth = 2;
    roundRectPath(ctx, 1, 1, width - 2, height - 2, 11);
    ctx.stroke();

    // `.card-art` — full-width 43% band + radial tint wash + art image.
    ctx.save();
    ctx.beginPath();
    ctx.rect(regions.art.x, regions.art.y, regions.art.w, regions.art.h);
    ctx.clip();
    const artWash = ctx.createRadialGradient(
      regions.art.x + regions.art.w / 2,
      regions.art.y + regions.art.h * 0.45,
      4,
      regions.art.x + regions.art.w / 2,
      regions.art.y + regions.art.h * 0.45,
      regions.art.w * 0.55,
    );
    artWash.addColorStop(0, mixCss(tint, 'rgba(0,0,0,0)', 0.14));
    artWash.addColorStop(0.75, 'rgba(0,0,0,0)');
    ctx.fillStyle = artWash;
    ctx.fillRect(regions.art.x, regions.art.y, regions.art.w, regions.art.h);

    const artImg = assets?.cardArtImage?.(layout.id) || null;
    if (artImg && artImg.complete && artImg.naturalWidth > 0) {
      try {
        ctx.drawImage(
          artImg,
          regions.art.x, regions.art.y, regions.art.w, regions.art.h,
        );
      } catch { /* tainted / stub */ }
    }
    ctx.restore();
    ctx.strokeStyle = lead;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, regions.art.y + regions.art.h);
    ctx.lineTo(width, regions.art.y + regions.art.h);
    ctx.stroke();

    // Name band gold hairlines + Cinzel 13.5 (upgraded → #9be8a8).
    const nameCy = regions.name.y + regions.name.h / 2;
    ctx.strokeStyle = 'rgba(242,193,78,0.22)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(width * 0.04, regions.name.y + 1);
    ctx.lineTo(width * 0.96, regions.name.y + 1);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(242,193,78,0.14)';
    ctx.beginPath();
    ctx.moveTo(width * 0.10, regions.name.y + regions.name.h - 1);
    ctx.lineTo(width * 0.90, regions.name.y + regions.name.h - 1);
    ctx.stroke();
    ctx.fillStyle = layout.up ? PROD.nameUp : PROD.parchment;
    ctx.font = '700 13.5px Cinzel, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(layout.name, width / 2, nameCy, regions.name.w);

    // `.card-type` — uppercase tracked tint label.
    ctx.fillStyle = tint;
    ctx.globalAlpha = 0.9;
    ctx.font = '500 10px Alegreya, serif';
    if (typeof ctx.letterSpacing === 'string' || typeof ctx.letterSpacing === 'number') {
      ctx.letterSpacing = '0.28em';
    }
    ctx.fillText(String(layout.type || '').toUpperCase(), width / 2, regions.type.y + regions.type.h / 2);
    ctx.letterSpacing = '0px';
    ctx.globalAlpha = 1;

    // Body — production keyword tint + parchment values (no inline icons).
    const body = layout.body;
    const lineHeight = body.fontSize * 1.32;
    const bodyTop = regions.body.y
      + Math.max(0, (regions.body.h - body.lines.length * lineHeight) / 2);
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    body.lines.forEach((line, index) => {
      const y = bodyTop + index * lineHeight;
      const advances = line.map((tok) => {
        if (tok.kind === 'value') return approximateMeasure(String(tok.value), body.fontSize, 'body') * 1.05;
        if (tok.kind === 'ellipsis') return approximateMeasure('…', body.fontSize, 'body');
        return approximateMeasure(tok.text || '', body.fontSize, 'body');
      });
      const total = advances.reduce((a, b) => a + b, 0);
      let x = regions.body.x + (regions.body.w - total) / 2;
      line.forEach((tok, ti) => {
        const text = tok.kind === 'value' ? String(tok.value)
          : tok.kind === 'ellipsis' ? '…'
            : (tok.text || '');
        if (!text) return;
        if (tok.kind === 'keyword') {
          ctx.fillStyle = tint;
          ctx.font = `${body.fontSize}px Alegreya, serif`;
          ctx.fillText(text, x, y);
          ctx.strokeStyle = mixCss(tint, 'rgba(0,0,0,0)', 0.6);
          ctx.globalAlpha = 0.6;
          ctx.beginPath();
          ctx.moveTo(x, y + body.fontSize + 1);
          ctx.lineTo(x + advances[ti], y + body.fontSize + 1);
          ctx.stroke();
          ctx.globalAlpha = 1;
        } else if (tok.kind === 'value') {
          ctx.fillStyle = PROD.parchment;
          ctx.font = `700 ${body.fontSize}px Alegreya, serif`;
          ctx.fillText(text, x, y);
        } else {
          ctx.fillStyle = PROD.body;
          ctx.font = `${body.fontSize}px Alegreya, serif`;
          ctx.fillText(text, x, y);
        }
        x += advances[ti];
      });
    });

    drawRarityChipCanvas(ctx, regions.rarityRail, rarityRailColour(layout.rarity), layout.rarity);

    // Cost gem last so it sits above the art (production z-index 4).
    if (layout.cost != null) {
      const cx = regions.cost.x + regions.cost.size / 2;
      const cy = regions.cost.y + regions.cost.size / 2;
      drawHexGemCanvas(ctx, cx, cy, regions.cost.size, { free: layout.cost === 0 });
      ctx.fillStyle = PROD.costInk;
      ctx.font = '800 17px Cinzel, serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(layout.cost), cx, cy);
    }

    return canvas;
  }

  /** Pixi display list mirroring the canvas bake (extract fallback / live preview). */
  function paintFace(layout) {
    const root = new Container();
    const { width, height, regions } = layout;
    const tint = hexToInt(typeTintCss(layout.type), 0x8fa3d8);

    const frame = new Graphics();
    frame.roundRect(0, 0, width, height, 11)
      .fill({ color: hexToInt(mixCss(typeTintCss(layout.type), '#101424', 0.85), ink), alpha: 0.96 })
      .stroke({ color: hexToInt(PROD.lead, 0x05070e), width: 2 });
    frame.roundRect(1, 1, width - 2, height - 2, 10)
      .stroke({ color: tint, width: 1, alpha: 0.4 });
    root.addChild(frame);

    const artBg = new Graphics();
    artBg.rect(regions.art.x, regions.art.y, regions.art.w, regions.art.h)
      .fill({ color: tint, alpha: 0.14 });
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
    const artRule = new Graphics();
    artRule.rect(0, regions.art.y + regions.art.h - 1, width, 1)
      .fill({ color: hexToInt(PROD.lead, 0x05070e) });
    root.addChild(artRule);

    if (layout.cost != null) {
      const gem = new Graphics();
      const cx = regions.cost.x + regions.cost.size / 2;
      const cy = regions.cost.y + regions.cost.size / 2;
      const gemFill = layout.cost === 0 ? 0x37d67a : gold;
      drawHexGemPixi(gem, cx, cy, regions.cost.size, gemFill, hexToInt(PROD.lead, ink));
      root.addChild(gem);
      const costText = new Text({
        text: String(layout.cost),
        style: {
          fontFamily: 'Cinzel',
          fontSize: 17,
          fontWeight: '800',
          fill: hexToInt(PROD.costInk, 0x241a05),
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
        fontSize: 13.5,
        fontWeight: '700',
        fill: layout.up ? hexToInt(PROD.nameUp, 0x9be8a8) : hexToInt(PROD.parchment, parchment),
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

    const typeText = new Text({
      text: String(layout.type || '').toUpperCase(),
      style: {
        fontFamily: 'Alegreya',
        fontSize: 10,
        fill: tint,
        align: 'center',
        letterSpacing: 2.8,
      },
    });
    typeText.alpha = 0.9;
    typeText.anchor?.set?.(0.5, 0.5);
    typeText.x = regions.type.x + regions.type.w / 2;
    typeText.y = regions.type.y + regions.type.h / 2;
    root.addChild(typeText);

    const body = layout.body;
    const lineHeight = body.fontSize * 1.32;
    const bodyTop = regions.body.y
      + Math.max(0, (regions.body.h - body.lines.length * lineHeight) / 2);
    body.lines.forEach((line, index) => {
      // Pixi path: one coloured line as plain text (canvas path is authoritative for export).
      const plain = linePlainText(line);
      if (!plain) return;
      const lineText = new Text({
        text: plain,
        style: {
          fontFamily: 'Alegreya',
          fontSize: body.fontSize,
          fill: hexToInt(PROD.body, textColour),
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
      hexToInt(rarityRailColour(layout.rarity), 0x5d6a88),
      tier === 'lite' ? 0.82 : 1,
    );
    root.addChild(chip);
    return root;
  }

  function bakeTexture(layout) {
    if (typeof bakeFace === 'function') {
      return bakeFace(layout);
    }
    // Prefer the production-parity canvas bake so combat == shop/deck.
    const canvas = paintFaceCanvas2d(layout);
    if (canvas && typeof Texture.from === 'function') {
      try {
        return Texture.from(canvas);
      } catch { /* fall through to Pixi generateTexture */ }
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
