// Node-pure card-face layout contract (Round 5 Task 26).
// Canonical face is 152×216 stage px. Body tries 13 → 12 → 11 px, max six
// lines; keyword icon runs never split; overflow ellipsises and emits a
// diagnostic. Cache keys include the real getLocale() token. Allocation uses
// Math.ceil(w*dpr)*Math.ceil(h*dpr)*4*1.33 with LRU caps below.

import { COLOUR, contrastRatio, resolveTier } from './tokens.js';

export const CARD_FACE_WIDTH = 152;
export const CARD_FACE_HEIGHT = 216;
export const BODY_FONT_STEPS = Object.freeze([13, 12, 11]);
export const BODY_MAX_LINES = 6;
export const FACE_CACHE_MAX_ENTRIES = 24;
export const FACE_CACHE_BYTE_CAPS = Object.freeze({
  lite: 4_191_990,
  full: 16_767_960,
});

/** Keywords that travel with an inline icon and must not break across lines. */
export const CARD_KEYWORDS = Object.freeze([
  'Cracked', 'Dimmed', 'Brittle', 'Smolder', 'Fervor', 'Poise',
  'Kindle', 'Ward', 'Energy', 'Embers', 'Ember', 'Chip',
  'Facets', 'Facet', 'Shatters', 'Shatter', 'Staggered',
  'Unplayable', 'Shard', 'Hex', 'Cinder',
]);

const KEYWORD_RE = new RegExp(
  `\\b(${CARD_KEYWORDS.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`,
  'g',
);

const VALUE_RE = /([@#])(\d+)\1/g;

/** Icon slot reserved ahead of a keyword run (stage px at 13px body). */
export const KEYWORD_ICON_WIDTH_AT_13 = 11;

export function estimateFaceBytes(width = CARD_FACE_WIDTH, height = CARD_FACE_HEIGHT, dpr = 1) {
  const w = Math.ceil(Number(width) * Number(dpr));
  const h = Math.ceil(Number(height) * Number(dpr));
  return w * h * 4 * 1.33;
}

/** Cap resolution used for cache accounting (LITE → 1, otherwise → 2). */
export function faceDprCap(policy) {
  return resolveTier(policy) === 'lite' ? 1 : 2;
}

export function faceCacheByteCap(policy) {
  return resolveTier(policy) === 'lite'
    ? FACE_CACHE_BYTE_CAPS.lite
    : FACE_CACHE_BYTE_CAPS.full;
}

/**
 * Deterministic cache key. Always reads the live locale via `getLocale`
 * when provided — no fictional locale constant.
 */
export function faceCacheKey({
  getLocale,
  locale,
  id,
  up = false,
  cost = null,
  text = '',
  dpr = 1,
  rarity = '',
  type = '',
} = {}) {
  const localeToken = typeof getLocale === 'function'
    ? String(getLocale() ?? '')
    : String(locale ?? '');
  return [
    localeToken,
    String(id ?? ''),
    up ? '1' : '0',
    cost == null ? 'x' : String(cost),
    String(text),
    String(dpr),
    String(rarity),
    String(type),
  ].join('\u001f');
}

/** Geometry boxes in stage px for the canonical 152×216 face (PE DOM parity). */
export function layoutRegions(width = CARD_FACE_WIDTH, height = CARD_FACE_HEIGHT) {
  const w = Number(width) || CARD_FACE_WIDTH;
  const h = Number(height) || CARD_FACE_HEIGHT;
  // Art band mirrors DOM `.card-art` (~43% tall) with side insets for margins.
  const artH = h * 0.43;
  const artY = h * 0.07;
  const chipW = 24;
  const chipH = 5;
  return Object.freeze({
    width: w,
    height: h,
    art: Object.freeze({
      x: w * 0.07, y: artY, w: w * 0.86, h: artH,
    }),
    // Hex cost gem — matches `.card-cost` clip-path polygon footprint.
    cost: Object.freeze({ x: 6, y: 6, size: 34 }),
    name: Object.freeze({
      x: w * 0.09, y: h * 0.58, w: w * 0.82, h: h * 0.11,
    }),
    body: Object.freeze({
      x: w * 0.10, y: h * 0.70, w: w * 0.80, h: h * 0.20,
    }),
    // Rarity chip matching `.card-rarity` (not a 2px full-width rail).
    rarityRail: Object.freeze({
      x: (w - chipW) / 2,
      y: h - chipH - 5,
      w: chipW,
      h: chipH,
      radius: 3,
    }),
    upgradeMark: Object.freeze({ size: 22 }),
  });
}

export function rarityRailColour(rarity) {
  if (rarity === 'uncommon') return COLOUR.ward;
  if (rarity === 'rare' || rarity === 'boss') return COLOUR.gold;
  return COLOUR.textDim;
}

/** Approximate glyph advance for Node-pure layout (slightly conservative). */
export function approximateMeasure(text, fontSize, family = 'body') {
  const s = String(text ?? '');
  const size = Math.max(1, Number(fontSize) || 12);
  const unit = family === 'display' ? 0.58 : 0.50;
  let width = 0;
  for (const ch of s) {
    if (ch === ' ') width += size * 0.28;
    else if (/[iIlj1.'|]/.test(ch)) width += size * 0.28;
    else if (/[mwMW@#%&]/.test(ch)) width += size * 0.72;
    else width += size * unit;
  }
  return width;
}

function keywordIconWidth(fontSize) {
  return KEYWORD_ICON_WIDTH_AT_13 * (Number(fontSize) / 13);
}

/**
 * Tokenise body copy into unsplittable runs. Value markers (@n@ / #n#) and
 * keyword(+icon) runs are atomic.
 */
export function tokenizeBody(text) {
  const source = String(text ?? '');
  const marks = [];
  let match;
  VALUE_RE.lastIndex = 0;
  while ((match = VALUE_RE.exec(source))) {
    marks.push({
      start: match.index,
      end: match.index + match[0].length,
      kind: 'value',
      text: match[0],
      value: Number(match[2]),
      marker: match[1],
    });
  }
  KEYWORD_RE.lastIndex = 0;
  while ((match = KEYWORD_RE.exec(source))) {
    marks.push({
      start: match.index,
      end: match.index + match[0].length,
      kind: 'keyword',
      text: match[0],
    });
  }
  marks.sort((a, b) => a.start - b.start || b.end - a.end);

  const tokens = [];
  let cursor = 0;
  const pushPlain = (slice) => {
    if (!slice) return;
    const parts = slice.split(/(\s+)/);
    for (const part of parts) {
      if (!part) continue;
      if (/^\s+$/.test(part)) tokens.push({ kind: 'space', text: part });
      else tokens.push({ kind: 'word', text: part });
    }
  };
  for (const mark of marks) {
    if (mark.start < cursor) continue;
    pushPlain(source.slice(cursor, mark.start));
    tokens.push(mark);
    cursor = mark.end;
  }
  pushPlain(source.slice(cursor));
  return tokens;
}

function tokenAdvance(token, fontSize, measure) {
  if (token.kind === 'space') return measure(token.text, fontSize, 'body');
  if (token.kind === 'keyword') {
    return keywordIconWidth(fontSize) + measure(token.text, fontSize, 'body');
  }
  if (token.kind === 'value') {
    return measure(String(token.value), fontSize, 'body') * 1.05;
  }
  return measure(token.text, fontSize, 'body');
}

/**
 * Wrap tokens into ≤ maxLines at fontSize. Keyword/value runs never split.
 * On overflow, the final line ends with an ellipsis and `diagnostic` is set.
 */
export function wrapBodyTokens(tokens, {
  fontSize = 13,
  maxWidth,
  maxLines = BODY_MAX_LINES,
  measure = approximateMeasure,
} = {}) {
  const lines = [];
  let current = [];
  let currentWidth = 0;
  let ellipsized = false;
  let diagnostic = null;

  const flush = () => {
    while (current.length && current[current.length - 1].kind === 'space') current.pop();
    lines.push(current);
    current = [];
    currentWidth = 0;
  };

  const pushToken = (token) => {
    const advance = tokenAdvance(token, fontSize, measure);
    const isSpace = token.kind === 'space';
    if (!current.length && isSpace) return;
    if (current.length && currentWidth + advance > maxWidth + 0.01) {
      if (lines.length + 1 >= maxLines) {
        // Emergency: fit what we can and ellipsis.
        const ellipsis = '…';
        const ellipsisW = measure(ellipsis, fontSize, 'body');
        while (current.length && currentWidth + ellipsisW > maxWidth) {
          const removed = current.pop();
          currentWidth -= tokenAdvance(removed, fontSize, measure);
        }
        current.push({ kind: 'ellipsis', text: ellipsis });
        flush();
        ellipsized = true;
        diagnostic = Object.freeze({
          code: 'cardface-body-overflow',
          fontSize,
          maxLines,
          maxWidth,
          message: 'card body exceeded max lines; ellipsis applied',
        });
        return 'overflow';
      }
      flush();
      if (isSpace) return;
    }
    current.push(token);
    currentWidth += advance;
    return null;
  };

  for (const token of tokens) {
    if (ellipsized) break;
    if (pushToken(token) === 'overflow') break;
  }
  if (!ellipsized && current.length) flush();
  if (!lines.length) lines.push([]);

  return Object.freeze({
    lines: Object.freeze(lines.map((line) => Object.freeze([...line]))),
    fontSize,
    ellipsized,
    diagnostic,
  });
}

/**
 * Try body font steps 13 → 12 → 11. Returns the first fit without ellipsis,
 * else the 11px ellipsized result (emergency fallback).
 */
export function layoutCardBody(text, {
  maxWidth,
  maxLines = BODY_MAX_LINES,
  measure = approximateMeasure,
  steps = BODY_FONT_STEPS,
} = {}) {
  const tokens = tokenizeBody(text);
  let last = null;
  for (const fontSize of steps) {
    const wrapped = wrapBodyTokens(tokens, { fontSize, maxWidth, maxLines, measure });
    last = wrapped;
    if (!wrapped.ellipsized) return wrapped;
  }
  return last;
}

/**
 * Character ranges in `upText` that differ from `baseText` (upgrade emphasis).
 * Uses a simple LCS-free walk: contiguous mismatched spans.
 */
export function upgradeDiffRanges(baseText, upText) {
  const a = String(baseText ?? '');
  const b = String(upText ?? '');
  if (a === b) return Object.freeze([]);
  const ranges = [];
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      i += 1;
      j += 1;
      continue;
    }
    // Prefer numeric / value-token drift: consume until digits/markers align again.
    const start = j;
    const aRest = a.slice(i);
    while (j < b.length) {
      const rest = b.slice(j);
      if (aRest.startsWith(rest) || rest.length === 0) break;
      // Advance b until a suffix of remaining-a matches remaining-b, or digit run ends.
      j += 1;
      if (j < b.length && a[i] === b[j]) break;
    }
    if (j === start) {
      // Single-char mismatch: skip one on each side.
      j += 1;
      i += 1;
    } else {
      // Also advance base past the mismatched run.
      while (i < a.length && !b.slice(j).startsWith(a.slice(i))) i += 1;
    }
    if (j > start) ranges.push(Object.freeze({ start, end: j }));
  }
  if (j < b.length) ranges.push(Object.freeze({ start: j, end: b.length }));
  return Object.freeze(ranges);
}

/** Cost / name / body token pairs that must clear WCAG AA (≥4.5:1). */
export function faceContrastPairs() {
  return Object.freeze([
    Object.freeze({ role: 'cost', fg: COLOUR.ink, bg: COLOUR.gold }),
    Object.freeze({ role: 'name', fg: COLOUR.parchment, bg: COLOUR.ink }),
    Object.freeze({ role: 'body', fg: COLOUR.text, bg: COLOUR.ink }),
    Object.freeze({ role: 'name-upgraded', fg: COLOUR.ember, bg: COLOUR.ink }),
    Object.freeze({ role: 'rarity-common', fg: COLOUR.textDim, bg: COLOUR.ink }),
    Object.freeze({ role: 'rarity-uncommon', fg: COLOUR.ward, bg: COLOUR.ink }),
    Object.freeze({ role: 'rarity-rare', fg: COLOUR.gold, bg: COLOUR.ink }),
    Object.freeze({ role: 'rarity-boss', fg: COLOUR.gold, bg: COLOUR.ink }),
  ]);
}

export function assertFaceContrast(minRatio = 4.5) {
  const failures = [];
  for (const pair of faceContrastPairs()) {
    const ratio = contrastRatio(pair.fg, pair.bg);
    if (ratio < minRatio) {
      failures.push({ ...pair, ratio });
    }
  }
  return Object.freeze({ ok: failures.length === 0, failures: Object.freeze(failures) });
}

/**
 * Full pure layout model for one card face.
 * `card` is registry-shaped: { id, name, text, cost, rarity, type, up? }.
 */
export function layoutCardFace(card, {
  measure = approximateMeasure,
  getLocale,
  locale,
  dpr = 1,
  up = false,
  effectiveCost,
  effectiveText,
  width = CARD_FACE_WIDTH,
  height = CARD_FACE_HEIGHT,
} = {}) {
  if (!card || typeof card !== 'object') {
    throw new TypeError('layoutCardFace requires a card descriptor');
  }
  const regions = layoutRegions(width, height);
  const baseText = String(card.text ?? '');
  const upText = card.up && typeof card.up === 'object'
    ? String(card.up.text ?? baseText)
    : baseText;
  const text = effectiveText != null
    ? String(effectiveText)
    : (up ? upText : baseText);
  const name = up && card.name
    ? (String(card.name).endsWith('+') ? String(card.name) : `${card.name}+`)
    : String(card.name ?? '');
  const cost = effectiveCost !== undefined
    ? effectiveCost
    : (up && card.up && card.up.cost !== undefined ? card.up.cost : card.cost);
  const body = layoutCardBody(text, {
    maxWidth: regions.body.w,
    maxLines: BODY_MAX_LINES,
    measure,
  });
  const diffs = up ? upgradeDiffRanges(baseText, text) : Object.freeze([]);
  const key = faceCacheKey({
    getLocale,
    locale,
    id: card.id,
    up,
    cost,
    text,
    dpr,
    rarity: card.rarity,
    type: card.type,
  });
  return Object.freeze({
    key,
    width,
    height,
    regions,
    id: card.id,
    name,
    cost,
    rarity: card.rarity || 'common',
    type: card.type || 'skill',
    up: !!up,
    text,
    body,
    upgradeDiffs: diffs,
    rarityColour: rarityRailColour(card.rarity),
    bytes: estimateFaceBytes(width, height, dpr),
    contrast: assertFaceContrast(),
  });
}
