// Dev Hub — registry-driven launcher (?dev=1).
// Renders every ROUTES entry with a non-null group; query params unchanged.

import { iconSvg } from '../art.js';
import { esc } from './chrome.js';
import { ROUTES } from './routes.js';

const GROUP_ORDER = Object.freeze([
  'Simulation',
  'Editors',
  'Content',
  'Art & Audio',
]);

const HUB_STYLE = `
[data-dev-shell] {
  position: absolute; inset: 0; z-index: 80; overflow: auto;
  background:
    radial-gradient(ellipse 80% 50% at 20% 0%, rgba(212,175,120,0.07), transparent 55%),
    radial-gradient(ellipse 60% 40% at 90% 100%, rgba(120,80,40,0.08), transparent 50%),
    linear-gradient(160deg, #17120e 0%, #0c0a08 55%, #14100c 100%);
  color: #f2e8d5; font-family: Cinzel, Georgia, serif;
  padding: 28px 28px 56px;
}
[data-dev-shell] .dev-hub-header {
  display: flex; align-items: baseline; justify-content: space-between;
  gap: 16px; flex-wrap: wrap;
  max-width: 640px; margin: 0 0 8px;
  padding-bottom: 14px;
  border-bottom: 1px solid rgba(212,175,120,0.22);
}
[data-dev-shell] .dev-hub-header .dev-chrome-title {
  margin: 0; font-size: 24px; font-weight: 600;
  letter-spacing: 0.1em; display: flex; gap: 12px; align-items: center;
  color: #f5ecd8;
}
[data-dev-shell] .dev-hub-header .dev-chrome-title svg { color: #d4af78; flex-shrink: 0; }
[data-dev-shell] .dev-hub-back {
  font-size: 12px; letter-spacing: 0.06em;
  color: rgba(212,175,120,0.85); text-decoration: none;
  padding: 4px 0; border-bottom: 1px solid transparent;
  transition: color 0.15s ease, border-color 0.15s ease;
}
[data-dev-shell] .dev-hub-back:hover {
  color: #f2e8d5; border-bottom-color: rgba(212,175,120,0.55);
}
[data-dev-shell] .dev-hub-lede {
  margin: 0 0 28px; max-width: 640px;
  opacity: 0.72; font-size: 13px; letter-spacing: 0.02em;
  line-height: 1.45;
}
[data-dev-shell] .dev-hub-group {
  max-width: 640px; margin: 0 0 28px;
}
[data-dev-shell] .dev-hub-group h2 {
  margin: 0 0 10px; padding: 0 2px;
  font-size: 11px; font-weight: 600;
  letter-spacing: 0.18em; text-transform: uppercase;
  color: rgba(212,175,120,0.7);
}
[data-dev-shell] .dev-hub-list {
  list-style: none; margin: 0; padding: 0;
  display: flex; flex-direction: column; gap: 8px;
}
[data-dev-shell] .dev-hub-list li {
  margin: 0; border: 1px solid rgba(212,175,120,0.28);
  background: rgba(22,16,12,0.88); border-radius: 5px;
  transition: border-color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease;
}
[data-dev-shell] .dev-hub-list li:hover {
  border-color: rgba(212,175,120,0.55);
  background: rgba(36,26,18,0.95);
  box-shadow: 0 0 0 1px rgba(212,175,120,0.08), 0 6px 18px rgba(0,0,0,0.28);
}
[data-dev-shell] .dev-hub-list a {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: start; gap: 12px 14px;
  padding: 12px 14px;
  color: #f2e8d5; text-decoration: none;
}
[data-dev-shell] .dev-hub-list a > svg {
  margin-top: 2px; color: #d4af78; opacity: 0.9;
}
[data-dev-shell] .dev-hub-route-body {
  display: flex; flex-direction: column; gap: 4px; min-width: 0;
}
[data-dev-shell] .dev-hub-route-label {
  font-size: 15px; letter-spacing: 0.04em; line-height: 1.25;
}
[data-dev-shell] .dev-hub-route-desc {
  font-size: 12px; letter-spacing: 0.01em; line-height: 1.4;
  color: rgba(242,232,213,0.62);
  font-family: Georgia, 'Times New Roman', serif;
}
[data-dev-shell] .dev-hub-param {
  align-self: start; margin-top: 2px;
  font-size: 10px; letter-spacing: 0.06em;
  padding: 3px 8px;
  border: 1px solid rgba(212,175,120,0.35);
  border-radius: 3px;
  color: rgba(212,175,120,0.9);
  background: rgba(212,175,120,0.06);
  white-space: nowrap;
}
`;

function groupedRoutes() {
  const byGroup = new Map(GROUP_ORDER.map((name) => [name, []]));
  for (const route of ROUTES) {
    if (route.group == null) continue;
    const bucket = byGroup.get(route.group);
    if (bucket) bucket.push(route);
  }
  return GROUP_ORDER
    .map((name) => ({ name, routes: byGroup.get(name) || [] }))
    .filter((section) => section.routes.length > 0);
}

function renderRoute(route) {
  const href = `?${route.param}=1`;
  const badge = `?${route.param}=1`;
  return `<li>
    <a data-dev-route="${esc(route.param)}" href="${esc(href)}">
      ${iconSvg('lantern', 18)}
      <span class="dev-hub-route-body">
        <span class="dev-hub-route-label">${esc(route.label)}</span>
        <span class="dev-hub-route-desc">${esc(route.description)}</span>
      </span>
      <span class="dev-hub-param">${esc(badge)}</span>
    </a>
  </li>`;
}

function renderGroup(section) {
  const items = section.routes.map(renderRoute).join('');
  return `<section class="dev-hub-group" data-dev-group="${esc(section.name)}">
    <h2>${esc(section.name)}</h2>
    <ul class="dev-hub-list">${items}</ul>
  </section>`;
}

export async function initDevShell() {
  const style = document.createElement('style');
  style.textContent = HUB_STYLE;
  document.head.appendChild(style);

  const host = document.getElementById('stage') || document.body;
  const root = document.createElement('div');
  root.setAttribute('data-dev-shell', '1');

  const sections = groupedRoutes().map(renderGroup).join('');
  root.innerHTML = `
    <header class="dev-hub-header">
      <h1 class="dev-chrome-title">${iconSvg('menu', 20)} Dev Hub</h1>
      <a class="dev-hub-back" href="?">back to game</a>
    </header>
    <p class="dev-hub-lede">Editors, labs, and galleries — existing query-param URLs unchanged.</p>
    ${sections}
  `;
  host.appendChild(root);
}
