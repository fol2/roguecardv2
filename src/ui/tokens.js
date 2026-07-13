// Node-pure experience-token API. Owner-approved Round 5 values live here as
// ROUND5_TOKENS (Task 21) while the P2 base identifiers stay in place so themes
// keep resolving. This module has no DOM, no globals and no Vite globs; it can
// be imported by tests and the browser boot alike.

export const BASE_COLOUR = Object.freeze({
  gold: '#f2c14e',
  'gold-dim': '#9c7c34',
  ink: '#0b0e1a',
  parchment: '#e8dfc8',
  text: '#d7dcea',
  'text-dim': '#8b93ad',
  panel: 'rgba(14, 18, 34, 0.86)',
  'panel-line': 'rgba(242, 193, 78, 0.28)',
  atk: '#ff5964',
  skl: '#4ea8de',
  pwr: '#b388ff',
  sts: '#7fae9c',
  hp: '#ff5964',
  blk: '#7fd4ff',
  good: '#7ddb8f',
  bad: '#ff7847',
  lead: '#05070e',
  'glass-fill': 'linear-gradient(168deg, rgba(26, 32, 52, 0.92), rgba(10, 13, 22, 0.94) 60%)',
  'gold-line': 'color-mix(in srgb, var(--gold) 55%, transparent)',
});

export const BASE_TYPE = Object.freeze({
  'font-body': "'Alegreya', Georgia, serif",
  'font-display': "'Cinzel', 'Alegreya', serif",
});

export const BASE_EASING = Object.freeze({
  'ease-out-soft': 'cubic-bezier(0.22, 1, 0.36, 1)',
  'ease-spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
});

/** Current UI token table (colour + type + easing). */
export const UI_TOKENS = Object.freeze({
  ...BASE_EASING,
  ...BASE_COLOUR,
  ...BASE_TYPE,
});

export const UI_TOKEN_IDS = Object.freeze(Object.keys(UI_TOKENS));
export const TOKEN_IDS = Object.freeze(new Set(UI_TOKEN_IDS));

// --- Owner-approved Round 5 experience values (P4/P5/P6 contract) ----------

/** Structured aliases mirroring the owner-approved FE record shape. */
export const EASING = Object.freeze({
  outSoft: Object.freeze([0.22, 1, 0.36, 1]),
  spring: Object.freeze([0.34, 1.56, 0.64, 1]),
});

export const DURATION_MS = Object.freeze({
  micro: 120,
  quick: 180,
  standard: 320,
  screen: 450,
  ceremony: 640,
});

export const COLOUR = Object.freeze({
  gold: '#f2c14e',
  goldDim: '#9c7c34',
  ink: '#0b0e1a',
  parchment: '#f4e7c5',
  text: '#ece7df',
  textDim: '#aaa6b8',
  danger: '#ff7060',
  ward: '#8fd0ff',
  ember: '#ff9a4d',
});

export const TYPE = Object.freeze({
  display: 'Cinzel',
  body: 'Alegreya',
});

function easingCubicBezier(curve) {
  const [x1, y1, x2, y2] = curve;
  return `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`;
}

/** Owner-approved flat token map projected from the structured aliases. */
export const ROUND5_TOKENS = Object.freeze({
  gold: COLOUR.gold,
  'gold-dim': COLOUR.goldDim,
  ink: COLOUR.ink,
  parchment: COLOUR.parchment,
  text: COLOUR.text,
  'text-dim': COLOUR.textDim,
  danger: COLOUR.danger,
  ward: COLOUR.ward,
  ember: COLOUR.ember,
  'ease-out-soft': easingCubicBezier(EASING.outSoft),
  'ease-spring': easingCubicBezier(EASING.spring),
  'dur-micro': `${DURATION_MS.micro}ms`,
  'dur-quick': `${DURATION_MS.quick}ms`,
  'dur-standard': `${DURATION_MS.standard}ms`,
  'dur-screen': `${DURATION_MS.screen}ms`,
  'dur-ceremony': `${DURATION_MS.ceremony}ms`,
  'font-body': `'${TYPE.body}', Georgia, serif`,
  'font-display': `'${TYPE.display}', '${TYPE.body}', serif`,
});

/** Fixed CSS custom-property map for experience tokens (`--r5-*`). */
export const R5_CSS_VARIABLE_MAP = Object.freeze({
  gold: '--r5-gold',
  'gold-dim': '--r5-gold-dim',
  ink: '--r5-ink',
  parchment: '--r5-parchment',
  text: '--r5-text',
  'text-dim': '--r5-text-dim',
  danger: '--r5-danger',
  ward: '--r5-ward',
  ember: '--r5-ember',
  good: '--r5-good',
  bad: '--r5-bad',
  atk: '--r5-atk',
  blk: '--r5-blk',
  hp: '--r5-hp',
  'ease-out-soft': '--r5-ease-out-soft',
  'ease-spring': '--r5-ease-spring',
  'dur-micro': '--r5-dur-micro',
  'dur-quick': '--r5-dur-quick',
  'dur-standard': '--r5-dur-standard',
  'dur-screen': '--r5-dur-screen',
  'dur-ceremony': '--r5-dur-ceremony',
  'font-body': '--r5-font-body',
  'font-display': '--r5-font-display',
});

export function createExperienceTokens(values) {
  if (!values || typeof values !== 'object' || Array.isArray(values)) {
    throw new TypeError('experience tokens must be a plain object');
  }
  const out = {};
  for (const [key, value] of Object.entries(values)) {
    if (typeof key !== 'string' || !key.trim()) throw new TypeError('token ids must be non-empty strings');
    if (typeof value !== 'string' || !value.trim()) throw new TypeError(`token ${key} must be a non-empty string`);
    out[key] = value;
  }
  return Object.freeze(out);
}

export function cssVariables(tokens) {
  if (!tokens || typeof tokens !== 'object') throw new TypeError('tokens required');
  const vars = {};
  for (const [tokenId, cssName] of Object.entries(R5_CSS_VARIABLE_MAP)) {
    if (Object.hasOwn(tokens, tokenId)) vars[cssName] = tokens[tokenId];
  }
  return Object.freeze(vars);
}

/** Apply `--r5-*` variables to a style-bearing root (no top-level DOM access). */
export function applyExperienceTokens(root, tokens) {
  if (!root || typeof root.style?.setProperty !== 'function') {
    throw new TypeError('applyExperienceTokens requires a style-bearing root');
  }
  const vars = cssVariables(tokens);
  for (const [name, value] of Object.entries(vars)) root.style.setProperty(name, value);
  return vars;
}

/** Resolve a token id to its current base colour/value string. */
export function tokenValue(id, tokens = UI_TOKENS) {
  return tokens?.[id] ?? null;
}

// --- Contrast (WCAG 2.1 relative luminance) --------------------------------

function parseHexColour(input) {
  if (typeof input !== 'string') throw new TypeError('hex colour must be a string');
  const trimmed = input.trim().replace(/^#/, '');
  const hex = trimmed.length === 3
    ? trimmed.split('').map((c) => c + c).join('')
    : trimmed;
  if (!/^[0-9a-fA-F]{6}$/.test(hex)) {
    throw new TypeError(`invalid hex colour: ${input}`);
  }
  return [
    Number.parseInt(hex.slice(0, 2), 16),
    Number.parseInt(hex.slice(2, 4), 16),
    Number.parseInt(hex.slice(4, 6), 16),
  ];
}

function channelLuminance(channel) {
  const c = channel / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance([r, g, b]) {
  return 0.2126 * channelLuminance(r)
    + 0.7152 * channelLuminance(g)
    + 0.0722 * channelLuminance(b);
}

/** WCAG relative-luminance contrast ratio for two `#rrggbb` colours. */
export function contrastRatio(foreground, background) {
  const l1 = relativeLuminance(parseHexColour(foreground));
  const l2 = relativeLuminance(parseHexColour(background));
  const light = Math.max(l1, l2);
  const dark = Math.min(l1, l2);
  return (light + 0.05) / (dark + 0.05);
}

// --- Policy helpers --------------------------------------------------------

/** Named tiers Round 5 recognises for renderer + presentation policy. */
export const POLICY_TIERS = Object.freeze(['full', 'lite', 'reduced']);

/** Resolve a renderer/presentation tier from a raw policy object. */
export function resolveTier(policy) {
  if (!policy) return 'full';
  if (policy.motion === 'reduced' || policy.reduced === true) return 'reduced';
  if (policy.lite === true) return 'lite';
  const tier = typeof policy.tier === 'string' ? policy.tier.toLowerCase() : '';
  if (POLICY_TIERS.includes(tier)) return tier;
  return 'full';
}

/** True when the resolved tier is `reduced` (motion policy). */
export function isReducedTier(policy) {
  return resolveTier(policy) === 'reduced';
}
