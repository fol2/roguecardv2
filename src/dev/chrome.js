// Shared Dev Hub chrome — parchment header + home link for standalone shells.
// Sim-lab keeps its own palette; use renderDevHomeLink() only there.

import { iconSvg } from '../art.js';

const STYLE_ID = 'dev-chrome-style';

export const DEV_CHROME_STYLE = `
[data-dev-chrome] {
  --dev-gold: #d4af78;
  --dev-ink: #f2e8d5;
  --dev-muted: rgba(212,175,120,0.85);
  --dev-line: rgba(212,175,120,0.22);
  display: flex; align-items: baseline; justify-content: space-between;
  gap: 16px; flex-wrap: wrap;
  margin: 0 0 12px; padding: 0 0 12px;
  border-bottom: 1px solid var(--dev-line);
  color: var(--dev-ink); font-family: Cinzel, Georgia, serif;
  pointer-events: auto;
}
[data-dev-chrome] .dev-chrome-title {
  margin: 0; font-size: 18px; font-weight: 600;
  letter-spacing: 0.08em; display: flex; gap: 10px; align-items: center;
  color: #f5ecd8;
}
[data-dev-chrome] .dev-chrome-title svg { color: var(--dev-gold); flex-shrink: 0; }
[data-dev-chrome] a[data-dev-home] {
  font-size: 12px; letter-spacing: 0.06em;
  color: var(--dev-muted); text-decoration: none;
  padding: 4px 0; border-bottom: 1px solid transparent;
  transition: color 0.15s ease, border-color 0.15s ease;
}
[data-dev-chrome] a[data-dev-home]:hover {
  color: var(--dev-ink); border-bottom-color: rgba(212,175,120,0.55);
}
`;

function esc(value) {
  return String(value).replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[ch]));
}

/** Inject shared parchment chrome CSS once. */
export function ensureDevChromeStyle() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = DEV_CHROME_STYLE;
  document.head.appendChild(style);
}

/**
 * Shared header: tool title + optional Dev Hub back-link.
 * @param {{ title: string, home?: boolean, wrap?: boolean }} opts
 *   home=false → title only (hub); wrap=false → inner markup for an outer header.
 */
export function renderDevChrome({ title, home = true, wrap = true }) {
  const titleHtml = `<h1 class="dev-chrome-title">${iconSvg('menu', 20)} ${esc(title)}</h1>`;
  const homeHtml = home
    ? `<a data-dev-home href="?dev=1">Dev Hub</a>`
    : '';
  const inner = `${titleHtml}${homeHtml}`;
  if (!wrap) return inner;
  return `<header data-dev-chrome>${inner}</header>`;
}

/**
 * Compact Dev Hub link for sim-lab's observatory chrome (no parchment vars).
 * @param {{ className?: string }} [opts]
 */
export function renderDevHomeLink({ className = '' } = {}) {
  const cls = className ? ` class="${esc(className)}"` : '';
  return `<a data-dev-home href="?dev=1"${cls}>Dev Hub</a>`;
}
