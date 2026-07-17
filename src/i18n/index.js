// Locale lookup — Node-safe, no DOM / localStorage / audio / stage.
import en from './en/index.js';
import { hydrateContent as hydrateExplicitContent } from './hydrate-content.js';

const catalogs = { en };

let locale = 'en';
let bundle = catalogs.en;

function dig(obj, parts) {
  let cur = obj;
  for (const p of parts) {
    if (cur == null || typeof cur !== 'object') return undefined;
    cur = cur[p];
  }
  return cur;
}

/** Resolve a dotted key against the active bundle (content + ui). */
export function lookup(key) {
  const parts = key.split('.');
  if (parts[0] === 'ui') return dig(bundle.ui, parts.slice(1));
  return dig(bundle.content, parts);
}

/**
 * Translate a key. Optional `{param}` interpolation.
 * Missing keys return the key string (never throw).
 */
export function t(key, params) {
  let s = lookup(key);
  if (typeof s !== 'string') return key;
  if (params) {
    s = s.replace(/\{(\w+)\}/g, (_, k) => (params[k] != null ? String(params[k]) : `{${k}}`));
  }
  return s;
}

export function getLocale() {
  return locale;
}

/** Swap active catalogue. Unknown codes are ignored. */
export function setLocale(code) {
  if (!catalogs[code]) return false;
  locale = code;
  bundle = catalogs[code];
  return true;
}

/** Register a catalogue (tests / future locales). */
export function registerLocale(code, catalog) {
  catalogs[code] = catalog;
}

export function hydrateContent(tables, content = bundle.content) {
  return hydrateExplicitContent(tables, content);
}

export function getContent() {
  return bundle.content;
}
