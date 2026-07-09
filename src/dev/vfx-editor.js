// Mesh Ward shell preview — dev-only (?vfxedit=1).
// Boots stage + mesh warp, binds a hero/enemy sprite, Grow / Hold / Clear the gemstone Ward.
import { ENEMIES, ASPECTS } from '../data.js';
import { assetUrl } from '../art.js';
import { charLayout } from '../char-meta.js';
import { bfResolve, bfEnemySize } from '../battlefield.js';
import { initStage } from '../stage.js';
import { initMesh, meshBind, meshClear, meshEnabled, meshWard, meshWardClear, meshDebug } from '../mesh.js';

const HERO_IDS = ASPECTS.map((a) => a.id);
const ENEMY_IDS = Object.keys(ENEMIES).sort();
const ALL_IDS = [...HERO_IDS, ...ENEMY_IDS];
const EDITOR_SHAPE = 'desktop-landscape';

const state = {
  id: HERO_IDS[0] || ENEMY_IDS[0],
  zoom: 2.5,
  ward: 'off', // 'off' | 'grow' | 'hold'
};

const q = () => new URLSearchParams(location.search);
function idFromUrl() {
  const id = q().get('char') || '';
  return ALL_IDS.includes(id) ? id : ALL_IDS[0];
}
function pushUrl() {
  const p = q();
  p.set('vfxedit', '1');
  p.set('char', state.id);
  history.replaceState(null, '', `?${p}`);
}

function isHero(id) { return HERO_IDS.includes(id); }
function kindOf(id) {
  if (isHero(id)) return 'humanoid';
  return ENEMIES[id]?.art?.kind || 'humanoid';
}
function urlOf(id) {
  return assetUrl(isHero(id) ? 'heroes' : 'enemies', id) || '';
}
function labelOf(id) {
  if (isHero(id)) return ASPECTS.find((a) => a.id === id)?.name || id;
  return ENEMIES[id]?.name || id;
}
function tierOf(id) {
  if (isHero(id)) return null;
  const d = ENEMIES[id];
  return d.boss ? 'boss' : d.elite ? 'elite' : 'normal';
}

function actorParams(id) {
  const a = charLayout(id);
  const L = bfResolve(EDITOR_SHAPE, 0);
  let w, h;
  if (isHero(id)) {
    w = Math.round(L.hero.w * a.scale);
    h = Math.round(L.hero.h * a.scale);
  } else {
    const s = bfEnemySize(L, id, tierOf(id), { s: 1 }, L.hero.w, L.hero.h);
    w = h = s;
  }
  return { scale: a.scale, footX: a.footX || 0, footY: a.footY || 0, w, h };
}

function spriteEl() {
  return document.querySelector('.vx-sprite');
}

function applyWard() {
  const sprite = spriteEl();
  if (!sprite?.classList.contains('mesh-live')) return false;
  if (state.ward === 'off') {
    meshWard(sprite, false);
    return true;
  }
  meshWard(sprite, true, { grow: state.ward === 'grow' });
  return true;
}

function setWard(mode) {
  state.ward = mode;
  applyWard();
  syncBar();
  syncPanelStatus();
}

function grow() {
  // always re-trigger grow-in (even if already warded) so Grow vs Hold is obvious
  state.ward = 'grow';
  const sprite = spriteEl();
  if (sprite?.classList.contains('mesh-live')) meshWard(sprite, true, { grow: true });
  syncBar();
  syncPanelStatus();
}
function hold() {
  // snap / stay at full — no grow animation
  state.ward = 'hold';
  const sprite = spriteEl();
  if (sprite?.classList.contains('mesh-live')) meshWard(sprite, true, { grow: false });
  syncBar();
  syncPanelStatus();
}
function clear() {
  meshWardClear();
  state.ward = 'off';
  syncBar();
  syncPanelStatus();
}

function syncBar() {
  const el = document.getElementById('vx-status');
  if (el) el.textContent = `${labelOf(state.id)} · ward ${state.ward}`;
}

function syncPanelStatus() {
  const el = document.getElementById('vx-ward-status');
  if (el) el.textContent = state.ward;
  const mesh = document.getElementById('vx-mesh-status');
  if (mesh) {
    const d = meshDebug();
    mesh.textContent = d.enabled ? `mesh on · ${d.planes} plane(s)` : 'mesh off (LITE / WebGL)';
  }
}

function paintActor() {
  const host = document.getElementById('vx-stage');
  if (!host) return;
  meshClear();
  const id = state.id;
  const url = urlOf(id);
  const kind = kindOf(id);
  const ap = actorParams(id);
  const z = state.zoom;
  const w = Math.round(ap.w * z);
  const h = Math.round(ap.h * z);
  const footY = Math.round(ap.footY * z);
  const footX = Math.round(ap.footX * z);

  host.innerHTML = `
    <div class="vx-ground"></div>
    <div class="vx-actor" style="width:${w}px;height:${h}px;bottom:calc(18% + ${footY}px);margin-left:${footX}px">
      <div class="vx-sprite">
        ${url ? `<img class="raster-art" src="${url}" alt="">` : '<div class="vx-missing">no art</div>'}
      </div>
    </div>
    <div class="vx-meta">${labelOf(id)} · ${kind} · combat ${ap.w}×${ap.h} · zoom ×${z} · ward ${state.ward}</div>`;

  const sprite = host.querySelector('.vx-sprite');
  if (meshEnabled() && url) {
    meshBind([{ el: sprite, url, kind, id }]);
    // re-apply after bind so Grow/Hold survive character swaps
    if (state.ward !== 'off') {
      meshWard(sprite, true, { grow: state.ward === 'grow' });
    }
  }
  syncBar();
  syncPanelStatus();
}

function renderPanel() {
  const panel = document.getElementById('vx-panel');
  if (!panel) return;
  panel.innerHTML = `
    <div class="vx-pick">
      <label>character
        <select id="vx-id">
          <optgroup label="aspects">
            ${HERO_IDS.map((id) =>
              `<option value="${id}" ${id === state.id ? 'selected' : ''}>${labelOf(id)}</option>`).join('')}
          </optgroup>
          <optgroup label="enemies">
            ${ENEMY_IDS.map((id) =>
              `<option value="${id}" ${id === state.id ? 'selected' : ''}>${labelOf(id)}</option>`).join('')}
          </optgroup>
        </select>
      </label>
      <p class="vx-sub" id="vx-mesh-status">…</p>
    </div>
    <h4>ward shell</h4>
    <p class="vx-sub">status: <em id="vx-ward-status">${state.ward}</em></p>
    <div class="vx-actions">
      <button type="button" id="vx-grow" title="Grow = animate in from small">Grow</button>
      <button type="button" id="vx-hold" title="Hold = instant full, no anim">Hold</button>
      <button type="button" id="vx-clear" title="meshWard off">Clear</button>
    </div>
    <h4>preview</h4>
    <label class="vx-row"><span>zoom</span>
      <input type="range" id="vx-zoom" min="1" max="4" step="0.25" value="${state.zoom}">
      <em id="vx-zoom-em">×${state.zoom}</em>
    </label>
    <p class="vx-hint"><b>Grow</b> = animate in (scale small→full; re-click restarts).
      <b>Hold</b> = instant full, no grow anim.
      <b>Clear</b> fades it off via <code>meshWardClear</code>.</p>
    <p class="vx-hint">Open: <code>?vfxedit=1&amp;char=${state.id}</code></p>`;

  panel.querySelector('#vx-id').onchange = (e) => {
    state.id = e.target.value;
    pushUrl();
    paintActor();
  };
  panel.querySelector('#vx-grow').onclick = () => grow();
  panel.querySelector('#vx-hold').onclick = () => hold();
  panel.querySelector('#vx-clear').onclick = () => clear();
  panel.querySelector('#vx-zoom').oninput = (e) => {
    state.zoom = Number(e.target.value);
    const em = document.getElementById('vx-zoom-em');
    if (em) em.textContent = `×${state.zoom}`;
    paintActor();
  };
  syncPanelStatus();
}

function mountChrome() {
  for (const id of ['bg3d', 'vignette', 'grain', 'lantern', 'hud', 'aim', 'vfx', 'floaties', 'overlay', 'wipe', 'transit', 'tooltip']) {
    document.getElementById(id)?.remove();
  }
  document.documentElement.classList.add('vfx-edit');
  const screen = document.getElementById('screen');
  screen.innerHTML = '';
  screen.className = 'vx-screen';

  const bar = document.createElement('header');
  bar.id = 'vx-bar';
  bar.innerHTML = `<b>vfx edit</b><span id="vx-status">…</span>
    <a href="/?gallery=1">gallery</a>
    <a href="/?charedit=1">charedit</a>
    <a href="/">← game</a>`;

  const panel = document.createElement('aside');
  panel.id = 'vx-panel';

  const host = document.createElement('div');
  host.id = 'vx-stage';
  screen.appendChild(host);

  document.body.append(bar, panel);

  const style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  window.addEventListener('keydown', (e) => {
    if (e.target.matches?.('input, select, textarea')) return;
    if (e.key === 'g') { e.preventDefault(); grow(); }
    else if (e.key === 'h') { e.preventDefault(); hold(); }
    else if (e.key === 'c' || e.key === 'Escape') { e.preventDefault(); clear(); }
  });
}

const CSS = `
#vx-bar { position: fixed; top: 0; left: 0; right: 0; z-index: 400; display: flex; gap: 14px; align-items: center;
  padding: 8px 12px; background: #0b0d18f2; color: #cdd3ea; font: 13px/1.4 ui-monospace, SFMono-Regular, Menlo, monospace;
  border-bottom: 1px solid #333a55; }
#vx-bar a { color: #9fb4ff; text-decoration: none; }
#vx-bar a:last-of-type { margin-left: auto; }
#vx-status { color: #f0c56a; }
#vx-panel { position: fixed; top: 44px; right: 0; bottom: 0; width: 300px; z-index: 400; overflow: auto;
  border-left: 1px solid #333a55; background: #0b0d18f2; padding: 12px;
  font: 13px/1.4 ui-monospace, SFMono-Regular, Menlo, monospace; color: #cdd3ea; }
#vx-panel h4 { margin: 14px 0 8px; color: #f0c56a; font: inherit; letter-spacing: 0.08em; text-transform: uppercase; font-size: 11px; }
.vx-sub { color: #6a7288; font-size: 11px; margin: 4px 0 0; }
.vx-sub em { color: #f0c56a; font-style: normal; }
.vx-pick label { display: grid; gap: 4px; color: #9aa7c8; }
.vx-pick select { width: 100%; background: #1a2036; color: inherit; border: 1px solid #3a4266; border-radius: 3px; }
.vx-actions { display: flex; flex-wrap: wrap; gap: 8px; margin: 8px 0 4px; }
.vx-actions button {
  font: inherit; background: #1a2036; color: inherit; border: 1px solid #3a4266; border-radius: 4px; padding: 6px 14px; cursor: pointer; }
.vx-actions button:hover { border-color: #9fd4ff; color: #9fd4ff; }
.vx-row { display: grid; grid-template-columns: 56px 1fr 58px; gap: 6px; align-items: center; color: #9aa7c8; margin: 6px 0; }
.vx-row em { color: #f0c56a; font-style: normal; text-align: right; }
.vx-row input[type=range] { width: 100%; }
.vx-hint { color: #6a7288; font-size: 11px; margin-top: 14px; }
.vx-hint code { color: #9fb4ff; }
.vx-hint b { color: #cdd3ea; font-weight: 600; }
/* #mesh (sibling of #screen) must sit above the DOM preview so Ward draws in front */
html.vfx-edit #mesh { z-index: 8; }
#vx-stage {
  position: absolute; inset: 0; padding-right: 300px; box-sizing: border-box;
  background:
    radial-gradient(ellipse at 50% 70%, #1a2036 0%, #0b0d18 70%),
    repeating-linear-gradient(90deg, transparent, transparent 39px, #1a203622 40px);
  overflow: hidden;
}
.vx-ground {
  position: absolute; left: 8%; right: calc(300px + 8%); bottom: 18%; height: 2px;
  background: linear-gradient(90deg, transparent, #9fd4ff66 20%, #9fd4ff66 80%, transparent);
  z-index: 0;
}
.vx-actor {
  position: absolute; left: calc(50% - 150px); translate: -50% 0;
  z-index: 1;
}
.vx-sprite { position: absolute; inset: 0; width: 100%; height: 100%; }
.vx-sprite img { width: 100%; height: 100%; object-fit: contain; object-position: center bottom; display: block; }
.vx-meta { position: absolute; left: 12px; top: 12px; color: #9aa7c8; z-index: 3; pointer-events: none; }
.vx-missing { position: absolute; inset: 0; display: grid; place-items: center; color: #664; z-index: 6; text-align: center; padding: 12px; }
@media (max-width: 800px) {
  #vx-panel { width: 100%; top: auto; height: 42vh; border-left: 0; border-top: 1px solid #333a55; }
  #vx-stage { padding-right: 0; padding-bottom: 42vh; }
  .vx-ground { right: 8%; }
  .vx-actor { left: 50%; }
}
`;

export function initVfxEditor() {
  initStage();
  initMesh();
  state.id = idFromUrl();
  pushUrl();
  mountChrome();
  renderPanel();
  paintActor();
  window.__vfxEditor = {
    id: () => state.id,
    ward: () => state.ward,
    grow,
    hold,
    clear,
    on: () => hold(),
    off: () => clear(),
    paint: paintActor,
    mesh: meshDebug,
  };
}
