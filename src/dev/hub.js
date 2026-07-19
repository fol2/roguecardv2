// Dev Hub — Observatory launcher (?dev=1).
// Rail + topbar + launch-card grid, built from ROUTES (query params unchanged).

import { iconSvg } from '../art.js';
import { esc, ensureDevStyle, renderShellRail, renderDevTopbar, mountRailDrawer, setDevTitle } from './chrome.js';
import { installDevSoftNav } from './nav.js';
import { ROUTES } from './routes.js';

const GROUP_ORDER = Object.freeze(['Simulation', 'Editors', 'Content', 'Art & Audio']);

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

function launchFooter(route) {
  if (route.exclusiveBoot) return '<span class="dev-launch-go is-faint">exclusive boot · Launch →</span>';
  if (route.kind === 'overlay') return '<span class="dev-launch-go is-faint">overlay · Launch →</span>';
  return '<span class="dev-launch-go">Launch →</span>';
}

function renderCard(route) {
  const href = `?${route.param}=1`;
  return `<a class="dev-card dev-launch" data-dev-route="${esc(route.param)}" href="${esc(href)}">
    <div class="dev-launch-head">
      <span class="dev-launch-name">${iconSvg('lantern', 16)}<span class="dev-launch-title">${esc(route.label)}</span></span>
      <span class="dev-launch-param">${esc(href)}</span>
    </div>
    <p class="dev-launch-desc">${esc(route.description)}</p>
    ${launchFooter(route)}
  </a>`;
}

function renderGroup(section) {
  const cards = section.routes.map(renderCard).join('');
  return `<section class="dev-group" data-dev-group="${esc(section.name)}">
    <h2>${esc(section.name)}</h2>
    <div class="dev-card-grid">${cards}</div>
  </section>`;
}

export async function initDevShell() {
  ensureDevStyle();
  setDevTitle('Dev Hub');

  const host = document.getElementById('stage') || document.body;
  const root = document.createElement('div');
  root.setAttribute('data-dev-shell', '1');
  root.className = 'dev-shell';

  const sections = groupedRoutes().map(renderGroup).join('');
  root.innerHTML = `
    ${renderShellRail({ activeParam: 'dev' })}
    <div class="dev-main">
      ${renderDevTopbar({ title: 'Dev Hub', param: 'dev', menu: true, home: false })}
      <div class="dev-scroll">${sections}</div>
    </div>
  `;
  host.appendChild(root);

  const drawer = mountRailDrawer('dev');
  root.querySelector('[data-dev-menu]').addEventListener('click', () => drawer.toggle());
  installDevSoftNav('dev');
}
