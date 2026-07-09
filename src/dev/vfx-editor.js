// Mesh Ward shell preview — dev-only (?vfxedit=1).
// Boots stage + mesh warp, binds a hero/enemy sprite, Grow / Hold / Clear the gemstone Ward.
// Live knobs call meshWardSetParams so look updates without leaving the editor.
import { ENEMIES, ASPECTS } from '../data.js';
import { assetUrl } from '../art.js';
import { charLayout } from '../char-meta.js';
import { bfResolve, bfEnemySize } from '../battlefield.js';
import { initStage } from '../stage.js';
import {
  initMesh, meshBind, meshClear, meshEnabled, meshWard, meshWardClear, meshDebug,
  WARD_DEFAULTS, meshWardParams, meshWardSetParams, meshWardResetParams, meshWardCommitDefaults,
} from '../mesh.js';
import { validateWardParams } from './ward-serialize.js';

const HERO_IDS = ASPECTS.map((a) => a.id);
const ENEMY_IDS = Object.keys(ENEMIES).sort();
const ALL_IDS = [...HERO_IDS, ...ENEMY_IDS];
const EDITOR_SHAPE = 'desktop-landscape';

/** Slider defs: key → label, min/max/step, optional format. */
const PARAM_SLIDERS = [
  { key: 'refraction', label: 'refraction', min: 0, max: 2, step: 0.05 },
  { key: 'transmission', label: 'transmission', min: 0, max: 1, step: 0.05 },
  { key: 'thickness', label: 'thickness', min: 0, max: 0.6, step: 0.01 },
  { key: 'ior', label: 'IOR', min: 1, max: 2.4, step: 0.05 },
  { key: 'normalScale', label: 'facets (N)', min: 0, max: 3, step: 0.05 },
  { key: 'transparency', label: 'transparency', min: 0, max: 1, step: 0.05 },
  { key: 'opacity', label: 'opacity', min: 0, max: 1, step: 0.05 },
  { key: 'edgeSoftness', label: 'edge soft', min: 0, max: 0.5, step: 0.01 },
  { key: 'centerDip', label: 'center dip', min: 0, max: 1, step: 0.05 },
  { key: 'envMapIntensity', label: 'env reflect', min: 0, max: 1, step: 0.02 },
  { key: 'roughness', label: 'roughness', min: 0, max: 0.5, step: 0.01 },
  { key: 'pad', label: 'pad size', min: 1, max: 1.8, step: 0.02 },
  { key: 'growMs', label: 'grow ms', min: 80, max: 2000, step: 20 },
  { key: 'sites', label: 'sites', min: 4, max: 32, step: 1 },
];

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

function fmt(v) {
  if (typeof v === 'boolean') return v ? 'on' : 'off';
  if (typeof v === 'string') return v;
  const n = Number(v);
  if (!Number.isFinite(n)) return String(v);
  return Number.isInteger(n) || Math.abs(n) >= 100 ? String(Math.round(n)) : n.toFixed(2).replace(/\.?0+$/, '');
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

function grow() {
  state.ward = 'grow';
  const sprite = spriteEl();
  if (sprite?.classList.contains('mesh-live')) meshWard(sprite, true, { grow: true });
  syncBar();
  syncPanelStatus();
}
function hold() {
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

function setParams(partial) {
  const next = meshWardSetParams(partial);
  syncParamUI(next);
  return next;
}
function resetParams() {
  const next = meshWardResetParams();
  syncParamUI(next);
  return next;
}

async function saveParams() {
  const params = meshWardParams();
  const problems = validateWardParams(params);
  if (problems.length) return alert(`ward params invalid:\n${problems.join('\n')}`);
  const r = await fetch('/__ward-save', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(params),
  });
  const j = await r.json().catch(() => ({ ok: false, problems: [`HTTP ${r.status}`] }));
  if (!j.ok) return alert(`save failed:\n${(j.problems ?? []).join('\n')}`);
  meshWardCommitDefaults(params);
  syncParamUI(meshWardParams());
  const status = document.getElementById('vx-status');
  if (status) status.textContent = `${labelOf(state.id)} · ward ${state.ward} · saved ✓`;
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

function syncParamUI(params = meshWardParams()) {
  for (const { key } of PARAM_SLIDERS) {
    const range = document.getElementById(`vx-p-${key}`);
    const num = document.getElementById(`vx-n-${key}`);
    const em = document.getElementById(`vx-e-${key}`);
    const v = params[key];
    if (range && Number(range.value) !== Number(v)) range.value = v;
    if (num && Number(num.value) !== Number(v)) num.value = v;
    if (em) em.textContent = fmt(v);
  }
  const tint = document.getElementById('vx-tint');
  if (tint && tint.value !== params.tint) tint.value = params.tint;
  const wobble = document.getElementById('vx-wobble');
  if (wobble) wobble.checked = !!params.idleWobble;
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
    if (state.ward !== 'off') {
      meshWard(sprite, true, { grow: state.ward === 'grow' });
    }
  }
  syncBar();
  syncPanelStatus();
}

function sliderRow({ key, label, min, max, step }, params) {
  const v = params[key];
  return `<label class="vx-row" title="${key}">
    <span>${label}</span>
    <input type="range" id="vx-p-${key}" data-key="${key}" min="${min}" max="${max}" step="${step}" value="${v}">
    <input type="number" id="vx-n-${key}" data-key="${key}" min="${min}" max="${max}" step="${step}" value="${v}">
  </label>`;
}

function renderPanel() {
  const panel = document.getElementById('vx-panel');
  if (!panel) return;
  const params = meshWardParams();
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
      <button type="button" id="vx-grow" title="Grow = alpha + facets 0→full (no zoom)">Grow</button>
      <button type="button" id="vx-hold" title="Hold = instant full, no anim">Hold</button>
      <button type="button" id="vx-clear" title="Clear = reverse fade (same growMs)">Clear</button>
    </div>
    <h4>look</h4>
    <p class="vx-sub">facets (N) = normalScale · grow ramps opacity + facets · pad fixed</p>
    ${PARAM_SLIDERS.map((d) => sliderRow(d, params)).join('')}
    <label class="vx-row vx-tint-row"><span>tint</span>
      <input type="color" id="vx-tint" value="${params.tint}">
      <em id="vx-tint-em">${params.tint}</em>
    </label>
    <label class="vx-check"><input type="checkbox" id="vx-wobble" ${params.idleWobble ? 'checked' : ''}> idle wobble</label>
    <div class="vx-actions">
      <button type="button" id="vx-reset" title="Restore WARD_DEFAULTS">Reset</button>
      <button type="button" id="vx-save" title="Write WARD_DEFAULTS to src/ward-params.js">Save</button>
    </div>
    <h4>preview</h4>
    <label class="vx-row"><span>zoom</span>
      <input type="range" id="vx-zoom" min="1" max="4" step="0.25" value="${state.zoom}">
      <em id="vx-zoom-em">×${state.zoom}</em>
    </label>
    <p class="vx-hint"><b>Grow</b> = alpha + facets in (no zoom). <b>Hold</b> = instant full.
      <b>Clear</b> = reverse fade. <b>Save</b> writes <code>ward-params.js</code>.</p>
    <p class="vx-hint">Open: <code>?vfxedit=1&amp;char=${state.id}</code>
      · console: <code>__vfxEditor.getParams()</code></p>`;

  panel.querySelector('#vx-id').onchange = (e) => {
    state.id = e.target.value;
    pushUrl();
    paintActor();
  };
  panel.querySelector('#vx-grow').onclick = () => grow();
  panel.querySelector('#vx-hold').onclick = () => hold();
  panel.querySelector('#vx-clear').onclick = () => clear();
  panel.querySelector('#vx-reset').onclick = () => resetParams();
  panel.querySelector('#vx-save').onclick = () => { saveParams(); };
  panel.querySelector('#vx-zoom').oninput = (e) => {
    state.zoom = Number(e.target.value);
    const em = document.getElementById('vx-zoom-em');
    if (em) em.textContent = `×${state.zoom}`;
    paintActor();
  };
  panel.querySelector('#vx-tint').oninput = (e) => {
    const tint = e.target.value;
    const em = document.getElementById('vx-tint-em');
    if (em) em.textContent = tint;
    setParams({ tint });
  };
  panel.querySelector('#vx-wobble').onchange = (e) => {
    setParams({ idleWobble: !!e.target.checked });
  };

  for (const { key } of PARAM_SLIDERS) {
    const range = panel.querySelector(`#vx-p-${key}`);
    const num = panel.querySelector(`#vx-n-${key}`);
    const apply = (raw) => {
      const v = key === 'sites' || key === 'growMs' ? Math.round(Number(raw)) : Number(raw);
      if (!Number.isFinite(v)) return;
      setParams({ [key]: v });
    };
    range.oninput = () => apply(range.value);
    num.onchange = () => apply(num.value);
    num.onkeydown = (e) => { if (e.key === 'Enter') apply(num.value); };
  }
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
#vx-panel { position: fixed; top: 44px; right: 0; bottom: 0; width: 320px; z-index: 400; overflow: auto;
  border-left: 1px solid #333a55; background: #0b0d18f2; padding: 12px;
  font: 13px/1.4 ui-monospace, SFMono-Regular, Menlo, monospace; color: #cdd3ea; }
#vx-panel h4 { margin: 14px 0 8px; color: #f0c56a; font: inherit; letter-spacing: 0.08em; text-transform: uppercase; font-size: 11px; }
.vx-sub { color: #6a7288; font-size: 11px; margin: 4px 0 8px; }
.vx-sub em { color: #f0c56a; font-style: normal; }
.vx-pick label { display: grid; gap: 4px; color: #9aa7c8; }
.vx-pick select { width: 100%; background: #1a2036; color: inherit; border: 1px solid #3a4266; border-radius: 3px; }
.vx-actions { display: flex; flex-wrap: wrap; gap: 8px; margin: 8px 0 4px; }
.vx-actions button {
  font: inherit; background: #1a2036; color: inherit; border: 1px solid #3a4266; border-radius: 4px; padding: 6px 14px; cursor: pointer; }
.vx-actions button:hover { border-color: #9fd4ff; color: #9fd4ff; }
.vx-row { display: grid; grid-template-columns: 72px 1fr 58px; gap: 6px; align-items: center; color: #9aa7c8; margin: 5px 0; }
.vx-row em { color: #f0c56a; font-style: normal; text-align: right; font-size: 11px; }
.vx-row input[type=range] { width: 100%; }
.vx-row input[type=number] {
  width: 100%; background: #1a2036; color: #f0c56a; border: 1px solid #3a4266; border-radius: 3px;
  font: inherit; font-size: 11px; padding: 2px 4px; text-align: right; }
.vx-tint-row input[type=color] { width: 100%; height: 24px; border: 1px solid #3a4266; background: #1a2036; padding: 0; cursor: pointer; }
.vx-check { display: flex; align-items: center; gap: 8px; color: #9aa7c8; margin: 8px 0; cursor: pointer; }
.vx-check input { accent-color: #9fd4ff; }
.vx-hint { color: #6a7288; font-size: 11px; margin-top: 14px; }
.vx-hint code { color: #9fb4ff; }
.vx-hint b { color: #cdd3ea; font-weight: 600; }
html.vfx-edit #mesh { z-index: 8; }
#vx-stage {
  position: absolute; inset: 0; padding-right: 320px; box-sizing: border-box;
  background:
    radial-gradient(ellipse at 50% 70%, #1a2036 0%, #0b0d18 70%),
    repeating-linear-gradient(90deg, transparent, transparent 39px, #1a203622 40px);
  overflow: hidden;
}
.vx-ground {
  position: absolute; left: 8%; right: calc(320px + 8%); bottom: 18%; height: 2px;
  background: linear-gradient(90deg, transparent, #9fd4ff66 20%, #9fd4ff66 80%, transparent);
  z-index: 0;
}
.vx-actor {
  position: absolute; left: calc(50% - 160px); translate: -50% 0;
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
    getParams: meshWardParams,
    setParams,
    resetParams,
    saveParams,
    defaults: () => ({ ...WARD_DEFAULTS }),
  };
}
