// UI chrome layout resolver. Data lives in ui-chrome-layout.js (the file the
// ?bfuiedit editor rewrites); this module only merges it.
// Imports nothing DOM-touching; Node-importable (test_engine.js gates it).
import { UIC as INITIAL_UIC } from './ui-chrome-layout.js';

let fileUIC = INITIAL_UIC;
let UIC = fileUIC;
const _listeners = new Set();

/** Soft-apply hook — bfuiedit / combat re-paint without a full page reload. */
export function onUICChange(fn) {
  _listeners.add(fn);
  return () => _listeners.delete(fn);
}
function notifyUIC() {
  for (const fn of _listeners) {
    try { fn(); } catch { /* listener errors must not break the layout */ }
  }
}

/** Editor/test hook: override the layout in effect (null = back to the file). */
export function _setUIC(uic, { silent = false } = {}) {
  UIC = uic || fileUIC;
  if (!silent) notifyUIC();
}
export function uicRaw() { return UIC; }

if (import.meta.hot) {
  import.meta.hot.accept('./ui-chrome-layout.js', (mod) => {
    if (!mod?.UIC) return;
    fileUIC = mod.UIC;
    _setUIC(mod.UIC);
  });
}

const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);
function merge(base, over) {
  if (over === undefined) return base;
  if (!isObj(base) || !isObj(over)) return over;
  const out = { ...base };
  for (const k of Object.keys(over)) out[k] = merge(base[k], over[k]);
  return out;
}

/** Deep-merged chrome layout for a stage shape (unknown shape ⇒ base only). */
export function uicResolve(shape) {
  return merge(UIC.base, UIC.shapes?.[shape]);
}
