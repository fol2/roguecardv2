import { getLocale } from '../i18n/index.js';
import { getVersionInfo } from '../version.js';
import { createBehaviourTrace } from './behaviour-trace.js';
import { createPresentationBarrier } from './presentation-barrier.js';
import { REDUCED } from './policy.js';

export const S = { run: null, cb: null, screen: 'title', targeting: null, busy: false, hoveredCard: null, ce: null, drag: null };
export const FORCE_INPUT = new URLSearchParams(location.search).get('input');
export const COARSE = FORCE_INPUT ? FORCE_INPUT === 'touch' : matchMedia('(pointer: coarse)').matches;
export const FINE = FORCE_INPUT ? FORCE_INPUT === 'mouse' : matchMedia('(hover: hover) and (pointer: fine)').matches;
export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
export const screenEl = () => $('#screen');

/** Task 26 — revoke composer object URLs / cache refs before a DOM root is wiped. */
export function releaseCardFacesIn(root) {
  if (!root) return;
  const seen = new Set();
  const releaseHost = (node) => {
    if (!node) return;
    const host = (typeof node.closest === 'function' && node.closest('.card')) || node;
    if (seen.has(host)) return;
    seen.add(host);
    if (typeof host._cardFaceRelease !== 'function') return;
    try { host._cardFaceRelease(); } catch { /* ignore */ }
    host._cardFaceRelease = null;
  };
  $$('[data-card-face-key]', root).forEach(releaseHost);
  // Belt: hosts that hold release ownership without the attribute (transferred faces).
  if (typeof root.querySelectorAll === 'function') {
    root.querySelectorAll('.card, .flycard-face').forEach(releaseHost);
  }
}
export const terminalNavigationLocked = () => S.screen === 'end' ||
  S.run?.pendingRunEnd != null || S.run?.pendingDawn != null;
export function el(tag, cls = '', html = '') {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (html) node.innerHTML = html;
  return node;
}
export const escHtml = (value) => String(value).replace(/[&<>"']/g, (ch) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[ch]));

const query = new URLSearchParams(location.search);
const traceBuild = import.meta.env.DEV
  || import.meta.env.MODE === 'test'
  || import.meta.env.VITE_QA_TRACE === '1';

export const presentationBarrier = createPresentationBarrier();
export const trace = createBehaviourTrace({
  enabled: traceBuild && (query.has('trace') || query.has('lab')),
  identity: () => {
    const version = getVersionInfo();
    return {
      appVersion: version.version,
      buildKind: version.release ? 'release' : version.gitSha === 'unknown' ? 'ordinary' : 'dev',
      gitSha: version.gitSha,
      locale: getLocale(),
    };
  },
  policy: () => ({
    screen: S.screen,
    renderer: 'dom',
    motion: REDUCED ? 'reduced' : 'full',
    tier: COARSE ? 'lite' : 'full',
  }),
});
