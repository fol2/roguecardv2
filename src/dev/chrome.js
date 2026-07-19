// Observatory — the shared dark design system for all Glassvow dev tools.
// One injected <style> (tokens + shared classes) + rail/topbar/chrome builders.
// Later phases (sim-lab, doctor, content-manager, editors) adopt this purely by
// using the .dev-* classes and --dev-* vars declared here.

import { ROUTES } from './routes.js';

const STYLE_ID = 'dev-observatory-style';
const FONTS_ID = 'dev-observatory-fonts';

// Rail nav is grouped in this order; entries come from ROUTES (group === name).
const GROUP_ORDER = Object.freeze(['Simulation', 'Editors', 'Content', 'Art & Audio']);

const FONT_UI = "'Space Grotesk', system-ui, -apple-system, sans-serif";
const FONT_MONO = "'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace";

const OBSERVATORY_STYLE = `
:root {
  --dev-bg: #12131c;
  --dev-rail: #141522;
  --dev-panel: #181a26;
  --dev-border: #262a3d;
  --dev-input-bg: #1c1e2e;
  --dev-input-border: #2c3048;
  --dev-text: #e4e5f0;
  --dev-muted: #a7aabd;
  --dev-dim: #8286a0;
  --dev-faint: #5d6178;
  --dev-accent: #8b7cf6;
  --dev-accent-light: #c9c1fb;
  --dev-accent-border: #4a3d7a;
  --dev-accent-fill: #241f38;
  --dev-teal: #2dd4bf;
  --dev-teal-border: #1e5148;
  --dev-teal-fill: #1c2e2b;
  --dev-amber: #e2b04f;
  --dev-red: #f4716a;
  --dev-pink: #f0a8c8;
  --dev-font: ${FONT_UI};
  --dev-mono: ${FONT_MONO};
}

/* ---- shell + rail ---- */
.dev-shell {
  position: absolute; inset: 0; z-index: 80;
  display: flex; overflow: hidden;
  background: var(--dev-bg);
  color: var(--dev-text); font-family: var(--dev-font);
  -webkit-font-smoothing: antialiased;
}
.dev-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.dev-scroll { flex: 1; overflow: auto; padding: 22px; }

.dev-rail {
  width: 240px; flex-shrink: 0;
  background: var(--dev-rail); border-right: 1px solid var(--dev-border);
  display: flex; flex-direction: column; min-height: 0;
  font-family: var(--dev-font);
}
.dev-rail-header { padding: 16px; border-bottom: 1px solid var(--dev-border); }
.dev-rail-brand {
  font-size: 15px; font-weight: 700; letter-spacing: 0.02em; color: var(--dev-text);
  display: flex; align-items: center; gap: 7px;
}
.dev-rail-brand .dev-diamond { color: var(--dev-accent); font-size: 12px; line-height: 1; }
.dev-rail-sub {
  margin-top: 3px; font: 400 10px var(--dev-mono); color: var(--dev-faint);
}
.dev-rail-nav {
  flex: 1; overflow: auto; padding: 10px;
  display: flex; flex-direction: column; gap: 2px; font-size: 13px;
}
.dev-nav-group-label {
  padding: 12px 12px 4px; font-size: 10px; font-weight: 600;
  letter-spacing: 0.14em; text-transform: uppercase; color: var(--dev-faint);
}
.dev-nav-item {
  padding: 8px 12px; border-radius: 8px; color: var(--dev-muted);
  text-decoration: none; display: block;
  transition: background 0.14s ease, color 0.14s ease;
}
.dev-nav-item:hover { background: rgba(139,124,246,0.10); color: var(--dev-text); }
.dev-nav-item.is-active {
  background: linear-gradient(90deg, rgba(139,124,246,0.22), rgba(45,212,191,0.10));
  color: var(--dev-accent-light); font-weight: 600;
}
.dev-hub-back {
  border-top: 1px solid var(--dev-border); padding: 12px 16px;
  font-size: 12px; color: var(--dev-faint); text-decoration: none;
  transition: color 0.14s ease;
}
.dev-hub-back:hover { color: var(--dev-muted); }
.dev-menu-rail { display: none; }
@media (max-width: 980px) {
  .dev-shell > .dev-rail { display: none; }
  .dev-menu-rail { display: inline-flex; }
}

/* ---- topbar ---- */
.dev-topbar {
  height: 48px; flex-shrink: 0;
  border-bottom: 1px solid var(--dev-border);
  display: flex; align-items: center; gap: 14px; padding: 0 22px;
}
.dev-topbar-title { font-size: 14px; font-weight: 700; color: var(--dev-text); }
.dev-topbar-param { font: 400 11px var(--dev-mono); color: var(--dev-faint); }
.dev-topbar-right {
  margin-left: auto; display: flex; align-items: center; gap: 10px; font-size: 12px;
}
.dev-drawer-back {
  border-top: 1px solid var(--dev-border); padding: 12px 16px;
  font-size: 12px; color: var(--dev-faint); text-decoration: none;
  transition: color 0.14s ease;
}
.dev-drawer-back:hover { color: var(--dev-muted); }
.dev-topbar-home {
  font-size: 12px; color: var(--dev-muted); text-decoration: none;
  transition: color 0.14s ease;
}
.dev-topbar-home:hover { color: var(--dev-accent-light); }
.dev-topbar .dev-hub-back {
  border-top: 0; padding: 0; font-size: 12px; color: var(--dev-muted);
}
.dev-topbar .dev-hub-back:hover { color: var(--dev-accent-light); }

/* ---- buttons ---- */
.dev-btn {
  font-family: var(--dev-font); font-size: 12px; line-height: 1;
  border-radius: 6px; padding: 7px 14px; cursor: pointer;
  border: 1px solid var(--dev-input-border); background: var(--dev-input-bg);
  color: var(--dev-muted); text-decoration: none; display: inline-flex;
  align-items: center; gap: 6px; transition: border-color 0.14s ease, color 0.14s ease;
}
.dev-btn:hover { border-color: var(--dev-accent-border); color: var(--dev-text); }
.dev-btn-primary {
  border: none; font-weight: 600; color: #fff;
  background: linear-gradient(90deg, #8b7cf6, #6d5ce8);
}
.dev-btn-primary:hover { filter: brightness(1.08); color: #fff; }

/* ---- inputs ---- */
.dev-input, .dev-select {
  font: 400 12px var(--dev-mono); color: var(--dev-text);
  background: var(--dev-input-bg); border: 1px solid var(--dev-input-border);
  border-radius: 6px; padding: 5px 9px; outline: none;
}
.dev-input:focus, .dev-select:focus { border-color: var(--dev-accent); }

/* ---- chips ---- */
.dev-chip {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 11px; line-height: 1.4; border-radius: 6px; padding: 2px 10px;
  border: 1px solid var(--dev-input-border); color: var(--dev-muted);
  background: var(--dev-input-bg);
}
.dev-chip.is-ok { color: var(--dev-teal); border-color: var(--dev-teal-border); background: var(--dev-teal-fill); }
.dev-chip.is-warn { color: var(--dev-amber); border-color: #59394a; background: #2e2330; }
.dev-chip.is-error { color: var(--dev-red); border-color: #59394a; background: #3a2530; }
.dev-chip.is-accent { color: var(--dev-accent-light); border-color: var(--dev-accent-border); background: var(--dev-accent-fill); }

/* ---- panels / cards / labels ---- */
.dev-panel, .dev-card {
  background: var(--dev-panel); border: 1px solid var(--dev-border); border-radius: 10px;
}
.dev-label {
  font-size: 10px; font-weight: 600; letter-spacing: 0.12em;
  text-transform: uppercase; color: var(--dev-faint);
}

/* ---- launch-card grid (hub) ---- */
.dev-group { margin: 0 0 22px; }
.dev-group > h2 {
  margin: 0 0 12px; padding: 0 2px;
  font-size: 10px; font-weight: 600; letter-spacing: 0.14em;
  text-transform: uppercase; color: var(--dev-faint);
}
.dev-card-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 12px;
}
.dev-launch {
  padding: 16px; display: flex; flex-direction: column; gap: 6px;
  color: var(--dev-text); text-decoration: none; min-height: 120px;
  transition: border-color 0.16s ease, box-shadow 0.16s ease, transform 0.16s ease, background 0.16s ease;
}
.dev-launch:hover {
  border-color: var(--dev-accent-border); background: #1b1d2c;
  transform: translateY(-2px);
  box-shadow: 0 0 0 1px rgba(139,124,246,0.18), 0 10px 26px rgba(0,0,0,0.35);
}
.dev-launch-head { display: flex; justify-content: space-between; align-items: center; gap: 10px; }
.dev-launch-name { display: flex; align-items: center; gap: 8px; min-width: 0; }
.dev-launch-name svg { flex-shrink: 0; color: var(--dev-accent); opacity: 0.85; }
.dev-launch:hover .dev-launch-name svg { opacity: 1; }
.dev-launch-title { font-size: 14px; font-weight: 600; color: var(--dev-accent-light); }
.dev-launch-param { font: 400 10px var(--dev-mono); color: var(--dev-faint); white-space: nowrap; }
.dev-launch-desc { margin: 0; font-size: 12px; line-height: 1.5; color: var(--dev-dim); }
.dev-launch-go { margin-top: auto; font-size: 11px; color: var(--dev-teal); }
.dev-launch-go.is-faint { color: var(--dev-faint); }

/* ---- ☰ slide-over rail drawer (stage-centric tools) ---- */
.dev-drawer { position: fixed; inset: 0; z-index: 600; display: none; }
.dev-drawer.is-open { display: block; }
.dev-drawer-backdrop { position: absolute; inset: 0; background: rgba(6,7,12,0.55); }
.dev-drawer-rail { position: absolute; inset: 0 auto 0 0; width: 240px; box-shadow: 24px 0 60px rgba(0,0,0,0.5); animation: dev-drawer-in 0.16s ease; }
.dev-drawer-rail .dev-rail { height: 100%; }
@keyframes dev-drawer-in { from { transform: translateX(-16px); opacity: 0; } to { transform: none; opacity: 1; } }
.dev-menu-btn { background: none; border: 0; color: var(--dev-muted); font-size: 16px; line-height: 1; cursor: pointer; padding: 4px 6px; border-radius: 6px; }
.dev-menu-btn:hover { background: rgba(139,124,246,0.14); color: var(--dev-text); }

/* ---- scrollbars, selection, focus ---- */
.dev-shell, .dev-drawer-rail,
.dev-shell *, .dev-drawer-rail * {
  scrollbar-width: thin;
  scrollbar-color: #2c3048 transparent;
}
.dev-shell::-webkit-scrollbar, .dev-drawer-rail::-webkit-scrollbar,
.dev-shell *::-webkit-scrollbar, .dev-drawer-rail *::-webkit-scrollbar { width: 10px; height: 10px; }
.dev-shell::-webkit-scrollbar-track, .dev-drawer-rail::-webkit-scrollbar-track,
.dev-shell *::-webkit-scrollbar-track, .dev-drawer-rail *::-webkit-scrollbar-track { background: transparent; }
.dev-shell::-webkit-scrollbar-thumb, .dev-drawer-rail::-webkit-scrollbar-thumb,
.dev-shell *::-webkit-scrollbar-thumb, .dev-drawer-rail *::-webkit-scrollbar-thumb {
  background: #2c3048; border-radius: 5px;
}
.dev-shell::-webkit-scrollbar-thumb:hover, .dev-drawer-rail::-webkit-scrollbar-thumb:hover,
.dev-shell *::-webkit-scrollbar-thumb:hover, .dev-drawer-rail *::-webkit-scrollbar-thumb:hover {
  background: #4a3d7a;
}
.dev-shell ::selection, .dev-drawer-rail ::selection { background: rgba(139,124,246,0.35); }
.dev-shell :focus-visible, .dev-drawer-rail :focus-visible, .dev-menu-btn:focus-visible {
  outline: 2px solid #8b7cf6; outline-offset: 2px;
}

/* ---- standalone header (renderDevChrome, pre-migration tool shells) ---- */
[data-dev-chrome] {
  display: flex; align-items: center; justify-content: space-between;
  gap: 16px; flex-wrap: wrap;
  margin: 0 0 14px; padding: 0 0 12px;
  border-bottom: 1px solid var(--dev-border);
  color: var(--dev-text); font-family: var(--dev-font);
  pointer-events: auto;
}
[data-dev-chrome] .dev-chrome-title {
  margin: 0; font-size: 16px; font-weight: 700; letter-spacing: 0.02em;
  display: flex; gap: 8px; align-items: center; color: var(--dev-text);
}
[data-dev-chrome] .dev-chrome-title .dev-diamond { color: var(--dev-accent); font-size: 12px; }
[data-dev-chrome] a[data-dev-home] {
  font-size: 12px; color: var(--dev-muted); text-decoration: none;
  padding: 4px 0; border-bottom: 1px solid transparent;
  transition: color 0.14s ease, border-color 0.14s ease;
}
[data-dev-chrome] a[data-dev-home]:hover {
  color: var(--dev-accent-light); border-bottom-color: var(--dev-accent-border);
}
`;

export function esc(value) {
  return String(value).replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[ch]));
}

/** Inject the shared Observatory tokens/classes and Google Fonts once. */
export function ensureDevStyle() {
  if (!document.getElementById(FONTS_ID)) {
    const pre = document.createElement('link');
    pre.rel = 'preconnect'; pre.href = 'https://fonts.gstatic.com'; pre.crossOrigin = '';
    document.head.appendChild(pre);
    const link = document.createElement('link');
    link.id = FONTS_ID; link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Space+Grotesk:wght@400;500;600;700&display=swap';
    document.head.appendChild(link);
  }
  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = OBSERVATORY_STYLE;
    document.head.appendChild(style);
  }
}

/** Rail routes grouped in GROUP_ORDER (skips the null-group Dev Hub entry). */
function railGroups() {
  const byGroup = new Map(GROUP_ORDER.map((name) => [name, []]));
  for (const route of ROUTES) {
    const bucket = route.group == null ? null : byGroup.get(route.group);
    if (bucket) bucket.push(route);
  }
  return GROUP_ORDER
    .map((name) => ({ name, routes: byGroup.get(name) || [] }))
    .filter((section) => section.routes.length > 0);
}

/**
 * Full Observatory sidebar rail. Nav items are plain anchors (no data-dev-route,
 * so they never collide with the hub's launch-card contract).
 * @param {{ activeParam?: string }} [opts]
 */
export function renderDevRail({ activeParam = '' } = {}) {
  ensureDevStyle();
  const hubActive = activeParam === 'dev' ? ' is-active' : '';
  const nav = [`<a class="dev-nav-item${hubActive}" data-dev-home href="?dev=1">Dev Hub</a>`];
  for (const section of railGroups()) {
    nav.push(`<div class="dev-nav-group-label">${esc(section.name)}</div>`);
    for (const route of section.routes) {
      const active = route.param === activeParam ? ' is-active' : '';
      nav.push(`<a class="dev-nav-item${active}" href="?${esc(route.param)}=1">${esc(route.label)}</a>`);
    }
  }
  return `<nav class="dev-rail" aria-label="Dev tools">
    <div class="dev-rail-header">
      <div class="dev-rail-brand"><span class="dev-diamond">◆</span> Glassvow Dev</div>
      <div class="dev-rail-sub">local · vite dev</div>
    </div>
    <div class="dev-rail-nav">${nav.join('')}</div>
    <a class="dev-hub-back" href="?">↩ Back to game</a>
  </nav>`;
}

/**
 * Full-rail shells park the home/back anchors in the always-visible topbar (the
 * rail collapses ≤980px, and e2e asserts their visibility across viewports) —
 * strip those anchors from the persistent rail so each page has exactly one.
 */
export function renderShellRail({ activeParam = '' } = {}) {
  return renderDevRail({ activeParam })
    .replace(/\sdata-dev-home/g, '')
    .replace(/<a class="dev-hub-back"[^>]*>[^<]*<\/a>/, '');
}

/**
 * Tool-column topbar: bold title, mono ?param=1 chip, optional status/actions html.
 * menu:true prepends the responsive ☰ control (visible ≤980px, where the rail
 * collapses and the drawer takes over) and appends the back-to-game anchor;
 * home (defaults to menu) appends the data-dev-home Dev Hub link — pass
 * home:false on the hub itself, where a self-link would be noise.
 * @param {{ title: string, param: string, status?: string, actions?: string, menu?: boolean, home?: boolean }} opts
 */
export function renderDevTopbar({ title, param, status = '', actions = '', menu = false, home = menu }) {
  ensureDevStyle();
  const menuBtn = menu
    ? `<button type="button" class="dev-menu-btn dev-menu-rail" data-dev-menu title="Dev tools" aria-label="Dev tools">☰</button>`
    : '';
  const homeLink = home
    ? `<a data-dev-home href="?dev=1" class="dev-topbar-home">Dev Hub ↩</a>`
    : '';
  const back = menu
    ? `<a class="dev-hub-back" href="?">↩ Back to game</a>`
    : '';
  const right = (status || actions || homeLink || back)
    ? `<div class="dev-topbar-right">${status}${actions}${homeLink}${back}</div>`
    : '';
  return `<div class="dev-topbar">
    ${menuBtn}
    <span class="dev-topbar-title">${esc(title)}</span>
    <span class="dev-topbar-param">?${esc(param)}=1</span>
    ${right}
  </div>`;
}

/** Per-tool document.title: "<label> · Glassvow Dev". */
export function setDevTitle(title) {
  document.title = title + ' · Glassvow Dev';
}

/** @type {{ wrap: HTMLElement | null, onKey: (e: KeyboardEvent) => void } | null} */
let railDrawerState = null;

/** Tear down the ☰ drawer and its capture-phase Escape listener (soft-nav safe). */
export function unmountRailDrawer() {
  if (!railDrawerState) return;
  window.removeEventListener('keydown', railDrawerState.onKey, true);
  railDrawerState.wrap?.remove();
  railDrawerState = null;
}

/**
 * ☰ slide-over rail drawer for stage-centric tools (lab + editors). Floats over
 * the live stage; never shifts geometry. Lazily mounts on first toggle so
 * full-rail shells do not duplicate .dev-hub-back in the DOM while closed.
 * Capture-phase Esc closes the drawer before a tool's own Escape handler
 * (e.g. deselect) fires. The rail's data-dev-home marker is stripped so each
 * tool keeps exactly one such link.
 * Remount replaces any prior drawer (no stacked Escape listeners on soft-nav).
 * @param {string} param active route param, e.g. 'lab'
 * @returns {{ toggle: () => void, close: () => void }}
 */
export function mountRailDrawer(param) {
  ensureDevStyle();
  unmountRailDrawer();
  let wrap = null;
  const close = () => wrap?.classList.remove('is-open');
  const onKey = (e) => {
    if (e.key === 'Escape' && wrap?.classList.contains('is-open')) { e.stopImmediatePropagation(); close(); }
  };
  window.addEventListener('keydown', onKey, true);
  railDrawerState = { wrap: null, onKey };
  const ensure = () => {
    if (wrap) return wrap;
    wrap = document.createElement('div');
    wrap.className = 'dev-drawer';
    const rail = renderDevRail({ activeParam: param })
    .replace(/\sdata-dev-home/g, '')
    .replace('class="dev-hub-back"', 'class="dev-drawer-back"');
    wrap.innerHTML = `<div class="dev-drawer-backdrop"></div><div class="dev-drawer-rail">${rail}</div>`;
    document.body.appendChild(wrap);
    wrap.querySelector('.dev-drawer-backdrop').addEventListener('click', close);
    railDrawerState = { wrap, onKey };
    return wrap;
  };
  return {
    toggle: () => { ensure().classList.toggle('is-open'); },
    close,
  };
}

/**
 * Shared header for pre-migration standalone shells: tool title + Dev Hub link.
 * @param {{ title: string }} opts
 */
export function renderDevChrome({ title }) {
  ensureDevStyle();
  const titleHtml = `<h1 class="dev-chrome-title"><span class="dev-diamond">◆</span> ${esc(title)}</h1>`;
  const homeHtml = `<a data-dev-home href="?dev=1">Dev Hub ↩</a>`;
  return `<header data-dev-chrome>${titleHtml}${homeHtml}</header>`;
}

/**
 * Compact Dev Hub link for sim-lab's own chrome.
 * @param {{ className?: string }} [opts]
 */
export function renderDevHomeLink({ className = '' } = {}) {
  ensureDevStyle();
  const cls = className ? ` class="${esc(className)}"` : '';
  return `<a data-dev-home href="?dev=1"${cls}>Dev Hub</a>`;
}
