// Current base design tokens + Node-pure experience-token API (Task 13).
// Task 21 adds owner-approved ROUND5_TOKENS and switches the boot injection.

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

/** Fixed CSS custom-property map for experience tokens (`--r5-*`). */
export const R5_CSS_VARIABLE_MAP = Object.freeze({
  gold: '--r5-gold',
  'gold-dim': '--r5-gold-dim',
  ink: '--r5-ink',
  parchment: '--r5-parchment',
  text: '--r5-text',
  'text-dim': '--r5-text-dim',
  good: '--r5-good',
  bad: '--r5-bad',
  atk: '--r5-atk',
  blk: '--r5-blk',
  hp: '--r5-hp',
  'ease-out-soft': '--r5-ease-out-soft',
  'ease-spring': '--r5-ease-spring',
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
