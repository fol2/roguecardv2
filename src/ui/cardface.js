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
  // `.card-text .val.boosted` / `.val.reduced` — preview-resolved value tint.
  valBoosted: '#8fe8a0',
  valReduced: '#ff8d8d',
});

/**
 * Real per-glyph advance via `ctx.measureText` in the browser (fixes the
 * heuristic mis-centering / underline drift). Falls back to the Node-pure
 * `approximateMeasure` when there is no DOM so `cardface-layout.js` stays the
 * single headless authority and its tests keep passing.
 */
let _measureCtx = null;
function browserMeasure(text, fontSize, family = 'body') {
  if (typeof document === 'undefined' || typeof document.createElement !== 'function') {
    return approximateMeasure(text, fontSize, family);
  }
  if (_measureCtx === null) {
    const c = document.createElement('canvas');
    _measureCtx = c.getContext('2d') || false;
  }
  if (!_measureCtx) return approximateMeasure(text, fontSize, family);
  _measureCtx.font = family === 'display'
    ? `700 ${fontSize}px Cinzel, serif`
    : `${fontSize}px Alegreya, serif`;
  return _measureCtx.measureText(String(text ?? '')).width;
}

/** Body value-marker overrides (@n@/#n#) → sanitised {value, state} list. */
function normalizeValues(raw) {
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const out = raw.map((v) => {
    if (v == null) return {};
    if (typeof v === 'number' || typeof v === 'string') return { value: v };
    const state = v.state === 'boosted' || v.state === 'reduced' ? v.state : null;
    return { value: v.value, state };
  });
  return out;
}

function valuesSignature(values) {
  return values.map((v) => `${v?.value ?? ''}:${v?.state ?? ''}`).join(',');
}

/** Type → art hue, mirroring art.js cardArtSvg (kept inline: art.js top-level
 *  `import.meta.glob` throws under raw Node, and cardface.js must stay Node-importable). */
function typeArtHue(type) {
  return { attack: 356, skill: 205, power: 268, status: 160, curse: 300 }[type] ?? 205;
}

function hashArtId(s) {
  let h = 9;
  for (const ch of String(s)) h = Math.imul(h ^ ch.charCodeAt(0), 387420489);
  return (h ^ (h >>> 9)) >>> 0;
}

/**
 * Synchronous procedural art painted straight to canvas2d — no raster, no
 * async decode — so a face is never a blank band on a cold cache and the
 * raster-less `unreadablePage` curse still renders. Motif language mirrors
 * art.js `cardArtSvg` (backlit glass base + a struck-glass sigil per type).
 */
function drawProceduralArt(ctx, region, id, type) {
  const hue = typeArtHue(type);
  const h = hashArtId(id);
  const midY = region.y + region.h * 0.42;
  const cx = region.x + region.w / 2;
  const cy = region.y + region.h / 2;
  ctx.save();
  ctx.beginPath();
  ctx.rect(region.x, region.y, region.w, region.h);
  ctx.clip();
  const base = ctx.createRadialGradient(cx, midY, 4, cx, midY, region.w * 0.62);
  base.addColorStop(0, `hsl(${hue}, 46%, 20%)`);
  base.addColorStop(1, `hsl(${hue}, 52%, 7%)`);
  ctx.fillStyle = base;
  ctx.fillRect(region.x, region.y, region.w, region.h);

  const lit = `hsl(${hue}, 82%, 64%)`;
  const lit2 = `hsl(${(hue + 34) % 360}, 78%, 58%)`;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.translate(cx, cy);
  ctx.rotate((((h % 17) - 8) * Math.PI) / 180);
  const u = region.h / 150; // motif authored in the ~180×150 art viewBox
  ctx.scale(u, u);
  if (type === 'attack') {
    const arc = (off, col, w, a) => {
      ctx.strokeStyle = col; ctx.globalAlpha = a; ctx.lineWidth = w;
      ctx.beginPath();
      ctx.moveTo(-58, 32 + off);
      ctx.quadraticCurveTo(2, -34 + off, 74, -46 + off);
      ctx.stroke();
    };
    arc(0, lit, 7, 0.9); arc(-22, lit2, 4, 0.6); arc(18, lit, 3, 0.4);
  } else if (type === 'power') {
    ctx.globalAlpha = 0.82;
    for (let i = 0; i < 8; i += 1) {
      const a = ((i * 45 + (h % 360)) * Math.PI) / 180;
      ctx.strokeStyle = i % 2 ? lit2 : lit;
      ctx.lineWidth = i % 2 ? 3 : 5;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * 22, Math.sin(a) * 22);
      ctx.lineTo(Math.cos(a) * 50, Math.sin(a) * 50);
      ctx.stroke();
    }
    ctx.globalAlpha = 1; ctx.strokeStyle = lit; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(0, 0, 18, 0, Math.PI * 2); ctx.stroke();
  } else if (type === 'skill') {
    ctx.globalAlpha = 0.85; ctx.strokeStyle = lit; ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(0, -52);
    ctx.quadraticCurveTo(52, -34, 52, 8);
    ctx.quadraticCurveTo(52, 50, 0, 66);
    ctx.quadraticCurveTo(-52, 50, -52, 8);
    ctx.quadraticCurveTo(-52, -34, 0, -52);
    ctx.stroke();
    ctx.globalAlpha = 0.6; ctx.strokeStyle = lit2; ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(0, -32);
    ctx.quadraticCurveTo(32, -18, 32, 12);
    ctx.stroke();
  } else {
    ctx.globalAlpha = 0.8; ctx.strokeStyle = lit; ctx.lineWidth = 5;
    ctx.setLineDash([16, 10]);
    ctx.beginPath(); ctx.arc(0, 0, 38, 0, Math.PI * 2); ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 0.7; ctx.strokeStyle = lit2; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(-28, 28); ctx.lineTo(28, -28); ctx.stroke();
  }
  ctx.restore();
}

/**
 * Static rarity foil / glare on the baked face (the golden DOM card's
 * `.card-inner::before/::after` + rare holographic wash, non-animated — the
 * living cursor-tracked sweep stays a later combat-gl phase). Very low alpha
 * so glyph contrast keeps its wide margin.
 */
function paintFoilOverlay(ctx, layout, tint) {
  const { width, height } = layout;
  const rare = layout.rarity === 'rare' || layout.rarity === 'boss';
  ctx.save();
  roundRectPath(ctx, 1, 1, width - 2, height - 2, 10);
  ctx.clip();
  // Fixed diagonal glare band (leaded-glass catch of the light).
  const glare = ctx.createLinearGradient(0, 0, width, height);
  glare.addColorStop(0.30, 'rgba(255,255,255,0)');
  glare.addColorStop(0.46, 'rgba(255,255,255,0.05)');
  glare.addColorStop(0.52, 'rgba(255,255,255,0.07)');
  glare.addColorStop(0.66, 'rgba(255,255,255,0)');
  ctx.fillStyle = glare;
  ctx.fillRect(0, 0, width, height);
  if (rare) {
    // Holographic foil — pink → cyan → green, faint.
    const holo = ctx.createLinearGradient(0, height, width, 0);
    holo.addColorStop(0.26, 'rgba(255,95,180,0)');
    holo.addColorStop(0.40, 'rgba(255,95,180,0.10)');
    holo.addColorStop(0.50, 'rgba(90,220,255,0.12)');
    holo.addColorStop(0.60, 'rgba(140,255,170,0.10)');
    holo.addColorStop(0.74, 'rgba(140,255,170,0)');
    ctx.fillStyle = holo;
    ctx.fillRect(0, 0, width, height);
  }
  ctx.restore();
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
      // Line-breaking stays on the Node-pure heuristic so line count/positions
      // are identical across Node/Chromium/WebKit; the paint loop below re-flows
      // each line's centering + keyword underlines with real ctx.measureText.
      measure: approximateMeasure,
    });
    if (layout.body.diagnostic) diagnostics.push(layout.body.diagnostic);
    return { layout, dpr, fields };
  }

  /**
   * Production-parity face bake. Canvas2d is the sole paint authority so combat
   * textures and shop/deck exportImage share one raster that mirrors styles.css.
   *
   * @param {object} layout          pure layout model
   * @param {number} [scale=1]       device-scale of the backing store (dpr ×
   *   stage-scale, capped) — logical drawing stays in 152×216 stage px, so a
   *   hand/grid texture stays crisp when the stage upscales on HiDPI.
   * @param {HTMLCanvasElement} [targetCanvas]  reuse for in-place re-bake.
   * @param {Array<{value,state}>|null} [values]  optional preview-resolved
   *   value-marker overrides (SPINE consumer) — boosted=green, reduced=red.
   */
  function paintFaceCanvas2d(layout, scale = 1, targetCanvas = null, values = null) {
    if (typeof document === 'undefined' || typeof document.createElement !== 'function') {
      return null;
    }
    const s = Math.max(1, Number(scale) || 1);
    const canvas = targetCanvas || document.createElement('canvas');
    canvas.width = Math.round(CARD_FACE_WIDTH * s);
    canvas.height = Math.round(CARD_FACE_HEIGHT * s);
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    // Logical coords stay 152×216; the backing store is `s`× denser.
    ctx.setTransform(s, 0, 0, s, 0, 0);
    const { width, height, regions } = layout;
    const tint = typeTintCss(layout.type);
    const lead = PROD.lead;
    const rare = layout.rarity === 'rare' || layout.rarity === 'boss';
    const uncommon = layout.rarity === 'uncommon';

    // `.card-inner` pane — radius 11, lead border, type-tinted glass gradient.
    ctx.save();
    roundRectPath(ctx, 0, 0, width, height, 11);
    ctx.clip();
    const pane = ctx.createLinearGradient(0, 0, width * 0.15, height);
    pane.addColorStop(0, mixCss(tint, '#101424', 0.85));
    pane.addColorStop(0.58, '#090b14');
    ctx.fillStyle = pane;
    ctx.fillRect(0, 0, width, height);
    // Light falling from the top (golden inset 0 16px 30px -14px tint/gold).
    const topGlow = ctx.createLinearGradient(0, 0, 0, height * 0.34);
    const glowCss = rare ? COLOUR.gold : uncommon ? '#a8d8ee' : tint;
    topGlow.addColorStop(0, mixCss(glowCss, 'rgba(0,0,0,0)', rare ? 0.42 : 0.34));
    topGlow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = topGlow;
    ctx.fillRect(0, 0, width, height * 0.34);
    // Lit inner rim — gilt on rares, silvered on uncommons, else type-tint.
    const rimCss = rare ? COLOUR.gold : uncommon ? '#a8d8ee' : tint;
    ctx.strokeStyle = mixCss(rimCss, 'rgba(0,0,0,0)', rare ? 0.8 : uncommon ? 0.6 : 0.4);
    ctx.globalAlpha = rare ? 0.8 : uncommon ? 0.6 : 0.4;
    ctx.lineWidth = 1;
    roundRectPath(ctx, 1, 1, width - 2, height - 2, 10);
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.restore();

    ctx.strokeStyle = rare ? '#1a1408' : lead;
    ctx.lineWidth = 2;
    roundRectPath(ctx, 1, 1, width - 2, height - 2, 11);
    ctx.stroke();

    // `.card-art` — full-width 43% band + radial tint wash + art image.
    ctx.save();
    ctx.beginPath();
    ctx.rect(regions.art.x, regions.art.y, regions.art.w, regions.art.h);
    ctx.clip();
    const artImg = assets?.cardArtImage?.(layout.id) || null;
    if (artImg && artImg.complete && artImg.naturalWidth > 0) {
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
      try {
        ctx.drawImage(
          artImg,
          regions.art.x, regions.art.y, regions.art.w, regions.art.h,
        );
      } catch { /* tainted / stub → procedural fallback */ }
    } else {
      // No raster ready (cold cache) or none exists (unreadablePage curse):
      // never a blank band — paint procedural art; re-bake upgrades to raster.
      drawProceduralArt(ctx, regions.art, layout.id, layout.type);
    }
    // `.card-art::after` — top light line, bottom score, inner vignette.
    ctx.strokeStyle = 'rgba(255,255,255,0.09)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(regions.art.x, regions.art.y + 0.5);
    ctx.lineTo(regions.art.x + regions.art.w, regions.art.y + 0.5);
    ctx.stroke();
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

    // Body — real-metrics centering; keyword tint + parchment/preview values.
    const body = layout.body;
    const lineHeight = body.fontSize * 1.32;
    const bodyTop = regions.body.y
      + Math.max(0, (regions.body.h - body.lines.length * lineHeight) / 2);
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    let valueSeq = 0;
    body.lines.forEach((line, index) => {
      const y = bodyTop + index * lineHeight;
      // Resolve display text, colour and real advance per token in one pass so
      // the preview value index stays aligned with the centering maths.
      const items = line.map((tok) => {
        if (tok.kind === 'value') {
          const ov = values ? values[valueSeq] : null;
          valueSeq += 1;
          const text = ov && ov.value != null ? String(ov.value) : String(tok.value);
          const colour = ov?.state === 'boosted' ? PROD.valBoosted
            : ov?.state === 'reduced' ? PROD.valReduced : PROD.parchment;
          return {
            kind: 'value', text, colour, advance: browserMeasure(text, body.fontSize, 'body') * 1.05,
          };
        }
        if (tok.kind === 'ellipsis') {
          return {
            kind: 'ellipsis', text: '…', colour: PROD.body, advance: browserMeasure('…', body.fontSize, 'body'),
          };
        }
        const text = tok.text || '';
        return {
          kind: tok.kind,
          text,
          colour: tok.kind === 'keyword' ? tint : PROD.body,
          advance: browserMeasure(text, body.fontSize, 'body'),
        };
      });
      const total = items.reduce((a, b) => a + b.advance, 0);
      let x = regions.body.x + (regions.body.w - total) / 2;
      for (const it of items) {
        if (!it.text) { x += it.advance; continue; }
        ctx.fillStyle = it.colour;
        ctx.font = it.kind === 'value'
          ? `700 ${body.fontSize}px Alegreya, serif`
          : `${body.fontSize}px Alegreya, serif`;
        ctx.fillText(it.text, x, y);
        if (it.kind === 'keyword') {
          ctx.strokeStyle = mixCss(tint, 'rgba(0,0,0,0)', 0.6);
          ctx.globalAlpha = 0.6;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x, y + body.fontSize + 1);
          ctx.lineTo(x + it.advance, y + body.fontSize + 1);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
        x += it.advance;
      }
    });

    drawRarityChipCanvas(ctx, regions.rarityRail, rarityRailColour(layout.rarity), layout.rarity);

    // Static rarity foil / glare over the pane (under the corner gem).
    paintFoilOverlay(ctx, layout, tint);

    // Cost gem last so it sits above the art (production z-index 4). Clamp the
    // centre inward so the -8,-8 hex + bevel is never clipped by the face edge.
    if (layout.cost != null) {
      const half = regions.cost.size / 2;
      const cx = Math.max(half, regions.cost.x + half);
      const cy = Math.max(half, regions.cost.y + half);
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
      const half = regions.cost.size / 2;
      const cx = Math.max(half, regions.cost.x + half);
      const cy = Math.max(half, regions.cost.y + half);
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

  function bakeTexture(layout, values) {
    if (typeof bakeFace === 'function') {
      return { texture: bakeFace(layout), canvas: null, scale: 1 };
    }
    // Prefer the production-parity canvas bake so combat == shop/deck. The
    // backing store is `scale`× denser (dpr × stage-scale) so hand/grid text
    // stays crisp when the stage upscales — logical coords remain 152×216.
    const scale = resolution();
    const canvas = paintFaceCanvas2d(layout, scale, null, values);
    if (canvas && typeof Texture.from === 'function') {
      try {
        return { texture: Texture.from(canvas), canvas, scale };
      } catch { /* fall through to Pixi generateTexture */ }
    }
    const canGenerate = typeof renderer.generateTexture === 'function'
      || typeof renderer.textureGenerator?.generateTexture === 'function';
    if (!canGenerate) {
      return {
        texture: {
          width: CARD_FACE_WIDTH,
          height: CARD_FACE_HEIGHT,
          destroy() {},
          __stub: true,
          key: layout.key,
        },
        canvas: null,
        scale,
      };
    }
    const display = paintFace(layout);
    let texture;
    try {
      if (typeof renderer.generateTexture === 'function') {
        texture = renderer.generateTexture({
          target: display,
          resolution: scale,
        });
      } else {
        texture = renderer.textureGenerator.generateTexture(display);
      }
    } finally {
      try { display.destroy({ children: true, context: true }); } catch { /* ignore */ }
    }
    return { texture, canvas: null, scale };
  }

  /**
   * Re-paint a cached face in place once its art image finishes decoding —
   * upgrades the procedural fallback to the real raster with no key churn and
   * no new Texture object (combat holds the same reference), then drops the
   * export URL so the next exportImage re-encodes with real art.
   */
  function redrawEntry(entry) {
    if (destroyed || entries.get(entry.key) !== entry || !entry.canvas) return;
    paintFaceCanvas2d(entry.layout, entry.scale || 1, entry.canvas, entry.values || null);
    try { entry.texture?.source?.update?.(); } catch { /* best-effort refresh */ }
    revokeEntryUrl(entry);
    entry.artBaked = true;
  }

  /** Watch a fresh entry's card art; re-bake when the raster decodes. */
  function watchArt(entry) {
    if (typeof Image === 'undefined' || !entry.canvas) { entry.artBaked = true; return; }
    const raster = assets?.cardArtImage?.(entry.layout.id) || null;
    const ready = !!(raster && raster.complete && raster.naturalWidth > 0);
    if (ready || !raster) { entry.artBaked = true; return; }
    // Raster still decoding — procedural art shows now; upgrade on decode.
    const done = () => redrawEntry(entry);
    if (typeof raster.decode === 'function') {
      raster.decode().then(done).catch(() => {});
    } else if (typeof raster.addEventListener === 'function') {
      raster.addEventListener('load', done, { once: true });
    }
    entry.artBaked = false;
  }

  function ensureEntry(cardDescriptor, displayState) {
    if (destroyed) throw new Error('card-face composer destroyed');
    const card = resolveCard(registries, cardDescriptor);
    const { layout, dpr } = buildDisplay(card, displayState);
    const values = normalizeValues(displayState?.values);
    // Additive: value overrides split the cache so previews never collide with
    // the default (no-override) face combat-gl bakes.
    const key = values ? `${layout.key}${valuesSignature(values)}` : layout.key;
    let entry = entries.get(key);
    if (entry) {
      touch(key);
      return entry;
    }
    const bytes = estimateFaceBytes(CARD_FACE_WIDTH, CARD_FACE_HEIGHT, dpr);
    evictIfNeeded(bytes);
    const { texture, canvas, scale } = bakeTexture(layout, values);
    entry = {
      key,
      texture,
      canvas,
      scale,
      values,
      bytes,
      refs: 0,
      layout,
      url: null,
    };
    entries.set(key, entry);
    touch(key);
    bytesUsed += bytes;
    watchArt(entry);
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
      // Exports stay 1× (152×216 natural) — the DOM `<img>` box and the
      // fixed-coordinate export readers both assume the canonical face size.
      const canvas2d = paintFaceCanvas2d(entry.layout, 1, null, entry.values || null);
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

  // measureText is only correct once the web fonts (Cinzel/Alegreya) load; a
  // face baked before then uses fallback-font metrics. Re-bake once fonts are
  // ready so centering/underlines land right (no-op if already loaded).
  if (typeof document !== 'undefined' && document.fonts && document.fonts.status !== 'loaded') {
    document.fonts.ready.then(() => {
      if (!destroyed && entries.size) invalidate({ all: true });
    }).catch(() => {});
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
      const values = normalizeValues(displayState?.values);
      return values ? `${layout.key}${valuesSignature(values)}` : layout.key;
    },
    paintFace,
  });
}

export {
  CARD_FACE_WIDTH,
  CARD_FACE_HEIGHT,
  estimateFaceBytes,
};
