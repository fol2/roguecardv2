// Soft client-side navigation for Observatory full-rail shells.
// Soft clique: Dev Hub, Content doctor, Content Manager.
// Everything else (lab, sim, exclusiveBoot editors, overlays, screens) hard-navigates.
// Node-safe to import: no DOM until installDevSoftNav() runs.

import { ROUTES } from './routes.js';
import { unmountRailDrawer } from './chrome.js';

const RAIL_SCROLL_KEY = 'spirebound_dev_rail_scroll_v1';
const SOFT_ROOT_SELECTOR = '[data-dev-shell], [data-content-doctor], [data-content-manager]';

/** Shell routes that can tear down + remount without a document reload. */
export function isSoftNavRoute(param) {
  const route = ROUTES.find((r) => r.param === param);
  if (!route || route.kind !== 'shell') return false;
  if (route.exclusiveBoot || route.preAudio) return false;
  // Lab boots the full game stack and freezes localStorage — not remount-safe.
  if (route.param === 'lab') return false;
  return true;
}

function paramFromSearch(search) {
  const qs = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  for (const route of ROUTES) {
    if (qs.has(route.param)) return route.param;
  }
  return null;
}

function paramFromHref(href) {
  try {
    const url = new URL(href, location.href);
    if (url.origin !== location.origin) return null;
    // Dev tools are root query routes (`?lab=1`), not path routes.
    if (url.pathname !== location.pathname) return null;
    return paramFromSearch(url.search);
  } catch {
    return null;
  }
}

function softToolUrl(param) {
  return `?${param}=1`;
}

function rememberRailScroll() {
  const nav = document.querySelector('.dev-shell > .dev-rail .dev-rail-nav');
  if (nav) sessionStorage.setItem(RAIL_SCROLL_KEY, String(nav.scrollTop));
}

function restoreRailScroll() {
  const y = Number(sessionStorage.getItem(RAIL_SCROLL_KEY) || 0);
  if (!y) return;
  const nav = document.querySelector('.dev-shell > .dev-rail .dev-rail-nav');
  if (nav) nav.scrollTop = y;
}

export function teardownSoftShell() {
  rememberRailScroll();
  unmountRailDrawer();
  document.querySelectorAll(SOFT_ROOT_SELECTOR).forEach((el) => el.remove());
  try { delete window.__contentManager; } catch { /* ignore */ }
}

let currentParam = null;
let navSeq = 0;
let installed = false;

async function softNavigate(param, { historyMode = 'push', url = null } = {}) {
  if (!isSoftNavRoute(param)) {
    location.assign(url || softToolUrl(param));
    return;
  }
  const nextUrl = url || softToolUrl(param);
  const nextSearch = new URL(nextUrl, location.href).search;
  if (param === currentParam && historyMode === 'push' && nextSearch === location.search) return;

  const seq = ++navSeq;
  teardownSoftShell();

  if (historyMode === 'push') {
    history.pushState({ softDev: param }, '', nextUrl);
  } else if (historyMode === 'replace') {
    history.replaceState({ softDev: param }, '', nextUrl);
  }

  currentParam = param;
  const route = ROUTES.find((r) => r.param === param);
  const init = await route.load();
  if (seq !== navSeq) return;
  await init();
  if (seq !== navSeq) return;
  restoreRailScroll();
}

function onDocClick(event) {
  if (event.defaultPrevented || event.button !== 0) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const anchor = event.target.closest?.('a[href]');
  if (!anchor || anchor.target === '_blank') return;
  // Stay inside the capture root — ignore downloads / non-http.
  const href = anchor.getAttribute('href');
  if (!href || href.startsWith('#')) return;

  const param = paramFromHref(anchor.href);
  if (!param) return; // e.g. back-to-game `?` — full navigation

  if (!isSoftNavRoute(param) || !isSoftNavRoute(currentParam)) {
    // Leaving the soft clique (or targeting a hard tool) — real navigation.
    return;
  }

  event.preventDefault();
  const abs = new URL(anchor.href);
  softNavigate(param, {
    historyMode: 'push',
    url: `${abs.pathname}${abs.search}${abs.hash}`,
  });
}

function onPopState() {
  const param = paramFromSearch(location.search);
  if (param && isSoftNavRoute(param) && isSoftNavRoute(currentParam)) {
    softNavigate(param, { historyMode: 'none' });
    return;
  }
  // History left the soft clique (game, lab, sim, …) — let the document match URL.
  location.reload();
}

/**
 * Enable soft-nav click + history handling while a soft-safe shell is active.
 * Safe to call on every soft-tool mount (idempotent listeners).
 * @param {string} activeParam
 */
export function installDevSoftNav(activeParam) {
  currentParam = activeParam;
  if (installed) {
    restoreRailScroll();
    return;
  }
  installed = true;
  document.addEventListener('click', onDocClick, true);
  window.addEventListener('popstate', onPopState);
  restoreRailScroll();
}
