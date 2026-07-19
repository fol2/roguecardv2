// Dev launcher shell — DEV-only static route list (?dev=1).
// Existing tool URLs unchanged; availability labels only.

import { iconSvg } from '../art.js';

const ROUTES = Object.freeze([
  { id: 'gallery', href: '?gallery=1', label: 'Art gallery', available: true },
  { id: 'audio', href: '?audio=1', label: 'Audio gallery', available: true },
  { id: 'bfedit', href: '?bfedit=1', label: 'Battlefield editor', available: true },
  { id: 'bfuiedit', href: '?bfuiedit=1', label: 'UI chrome editor', available: true },
  { id: 'charedit', href: '?charedit=1', label: 'Character editor', available: true },
  { id: 'vfxedit', href: '?vfxedit=1', label: 'VFX editor', available: true },
  { id: 'lab', href: '?lab=1', label: 'Content Lab', available: true },
  { id: 'dashboard', href: '?dashboard=1', label: 'Content doctor', available: true },
  { id: 'contentedit', href: '?contentedit=1', label: 'Content Manager', available: true },
]);

const SHELL_STYLE = `
[data-dev-shell] {
  position: absolute; inset: 0; z-index: 80; overflow: auto;
  background: linear-gradient(160deg, #17120e 0%, #0c0a08 60%, #14100c 100%);
  color: #f2e8d5; font-family: Cinzel, serif; padding: 20px 22px 40px;
}
[data-dev-shell] h1 { margin: 0 0 12px; font-size: 22px; letter-spacing: 0.08em; display: flex; gap: 10px; align-items: center; }
[data-dev-shell] p { margin: 0 0 16px; opacity: 0.85; font-size: 13px; }
[data-dev-shell] ul { list-style: none; margin: 0; padding: 0; max-width: 520px; }
[data-dev-shell] li {
  margin: 0 0 8px; border: 1px solid rgba(212,175,120,0.3);
  background: rgba(22,16,12,0.9); border-radius: 4px;
}
[data-dev-shell] a {
  display: flex; align-items: center; gap: 10px; padding: 10px 12px;
  color: #f2e8d5; text-decoration: none;
}
[data-dev-shell] a:hover { background: rgba(212,175,120,0.08); }
[data-dev-availability] {
  margin-left: auto; font-size: 10px; letter-spacing: 0.06em;
  padding: 2px 8px; border: 1px solid rgba(212,175,120,0.35);
}
[data-dev-availability="available"] { color: #b7e0a8; }
[data-dev-availability="planned"] { color: #9a8f7e; }
`;

function esc(value) {
  return String(value).replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[ch]));
}

export async function initDevShell() {
  const style = document.createElement('style');
  style.textContent = SHELL_STYLE;
  document.head.appendChild(style);

  const host = document.getElementById('stage') || document.body;
  const root = document.createElement('div');
  root.setAttribute('data-dev-shell', '1');
  const items = ROUTES.map((route) => {
    const avail = route.available ? 'available' : 'planned';
    return `<li>
      <a data-dev-route="${esc(route.id)}" href="${esc(route.href)}">
        ${iconSvg('lantern', 18)}
        <span>${esc(route.label)}</span>
        <span data-dev-availability="${avail}">${avail}</span>
      </a>
    </li>`;
  }).join('');

  root.innerHTML = `
    <h1>${iconSvg('menu', 22)} Dev tools</h1>
    <p>Static launcher — existing editor and gallery URLs unchanged.</p>
    <ul>${items}</ul>
    <p><a href="?">back to game</a></p>
  `;
  host.appendChild(root);
}
