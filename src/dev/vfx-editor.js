// VFX sprite-strip editor — dev-only (?vfxedit=1).
// Frame-by-frame scrub + onion skin + crosshair to validate strip drift.
import { assetUrl } from '../art.js';
import { initStage } from '../stage.js';

const STRIPS = [
  { id: 'ward-loop', frames: 4, note: 'persistent Ward shell' },
  { id: 'ward-gain', frames: 4, note: 'one-shot Ward gain' },
];

const state = {
  id: STRIPS[0].id,
  frames: STRIPS[0].frames,
  frame: 0,
  playing: false,
  fps: 4,
  onion: true,
  zoom: 2,
  blend: 'screen',
  url: null,
  naturalW: 0,
  naturalH: 0,
  raf: 0,
  lastTick: 0,
};

const q = () => new URLSearchParams(location.search);
function pushUrl() {
  const p = q();
  p.set('vfxedit', '1');
  p.set('vfx', state.id);
  p.set('frame', String(state.frame));
  history.replaceState(null, '', `?${p}`);
}

function stripMeta(id) {
  return STRIPS.find((s) => s.id === id) || STRIPS[0];
}

function cellSize() {
  if (!state.naturalW || !state.frames) return { cw: 256, ch: 256 };
  return {
    cw: state.naturalW / state.frames,
    ch: state.naturalH,
  };
}

function framePos(i) {
  const { cw } = cellSize();
  return `${(-i * cw * state.zoom)}px 0`;
}

function loadStrip(id) {
  const meta = stripMeta(id);
  state.id = meta.id;
  state.frames = meta.frames;
  state.frame = Math.min(state.frame, meta.frames - 1);
  state.url = assetUrl('vfx', meta.id);
  state.naturalW = 0;
  state.naturalH = 0;
  if (!state.url) {
    paint();
    renderPanel();
    return;
  }
  const img = new Image();
  img.onload = () => {
    state.naturalW = img.naturalWidth;
    state.naturalH = img.naturalHeight;
    // infer frame count from square cells when possible
    if (img.naturalHeight > 0 && img.naturalWidth % img.naturalHeight === 0) {
      const n = img.naturalWidth / img.naturalHeight;
      if (n >= 2 && n <= 16) state.frames = n;
    }
    paint();
    renderPanel();
  };
  img.src = state.url;
  paint();
  renderPanel();
}

function paint() {
  const stage = document.getElementById('vx-stage');
  if (!stage) return;
  const { cw, ch } = cellSize();
  const w = cw * state.zoom;
  const h = ch * state.zoom;
  const missing = !state.url
    ? `<div class="vx-missing">missing asset: vfx/${state.id}.png</div>`
    : '';

  const onion = [];
  if (state.onion && state.url && state.frames > 1) {
    const prev = (state.frame - 1 + state.frames) % state.frames;
    const next = (state.frame + 1) % state.frames;
    onion.push(`<div class="vx-sprite vx-onion prev" style="width:${w}px;height:${h}px;background-image:url(${state.url});background-size:${w * state.frames}px ${h}px;background-position:${framePos(prev)};mix-blend-mode:${state.blend}"></div>`);
    onion.push(`<div class="vx-sprite vx-onion next" style="width:${w}px;height:${h}px;background-image:url(${state.url});background-size:${w * state.frames}px ${h}px;background-position:${framePos(next)};mix-blend-mode:${state.blend}"></div>`);
  }

  const main = state.url
    ? `<div class="vx-sprite" style="width:${w}px;height:${h}px;background-image:url(${state.url});background-size:${w * state.frames}px ${h}px;background-position:${framePos(state.frame)};mix-blend-mode:${state.blend}"></div>`
    : '';

  stage.innerHTML = `
    <div class="vx-ground"></div>
    <div class="vx-actor" style="width:${w}px;height:${h}px">
      <div class="vx-guides" aria-hidden="true"></div>
      ${onion.join('')}
      ${main}
      ${missing}
    </div>
    <div class="vx-meta">${state.id} · frame ${state.frame + 1}/${state.frames}${state.naturalW ? ` · sheet ${state.naturalW}×${state.naturalH}` : ''}${state.playing ? ' · playing' : ''}</div>`;
}

function setFrame(i) {
  const n = state.frames;
  state.frame = ((i % n) + n) % n;
  pushUrl();
  paint();
  syncPanelFrame();
}

function syncPanelFrame() {
  const panel = document.getElementById('vx-panel');
  if (!panel) return;
  const slider = panel.querySelector('#vx-frame');
  const num = panel.querySelector('#vx-frame-num');
  const label = panel.querySelector('#vx-frame-label');
  if (slider) { slider.max = String(state.frames - 1); slider.value = String(state.frame); }
  if (num) { num.max = String(state.frames - 1); num.value = String(state.frame); }
  if (label) label.textContent = `${state.frame + 1} / ${state.frames}`;
}

function tick(now) {
  if (!state.playing) return;
  state.raf = requestAnimationFrame(tick);
  const interval = 1000 / Math.max(0.5, state.fps);
  if (now - state.lastTick < interval) return;
  state.lastTick = now;
  setFrame(state.frame + 1);
}

function play(on) {
  state.playing = on;
  cancelAnimationFrame(state.raf);
  if (on) {
    state.lastTick = performance.now();
    state.raf = requestAnimationFrame(tick);
  }
  paint();
  const btn = document.getElementById('vx-play');
  if (btn) btn.textContent = on ? 'Pause' : 'Play';
}

function renderPanel() {
  const panel = document.getElementById('vx-panel');
  if (!panel) return;
  const meta = stripMeta(state.id);
  panel.innerHTML = `
    <div class="vx-pick">
      <label>strip
        <select id="vx-id">${STRIPS.map((s) =>
          `<option value="${s.id}" ${s.id === state.id ? 'selected' : ''}>${s.id} — ${s.note}</option>`).join('')}
        </select>
      </label>
      <p class="vx-sub">${state.url ? 'asset loaded' : 'asset missing — place PNG under src/assets/vfx/'}</p>
    </div>
    <h4>frame</h4>
    <div class="vx-frame-row">
      <button type="button" id="vx-prev" title="prev">◀</button>
      <span id="vx-frame-label">${state.frame + 1} / ${state.frames}</span>
      <button type="button" id="vx-next" title="next">▶</button>
    </div>
    <label class="vx-row">
      <span>scrub</span>
      <input type="range" id="vx-frame" min="0" max="${state.frames - 1}" step="1" value="${state.frame}">
      <input type="number" id="vx-frame-num" min="0" max="${state.frames - 1}" step="1" value="${state.frame}">
    </label>
    <div class="vx-actions">
      <button type="button" id="vx-play">${state.playing ? 'Pause' : 'Play'}</button>
      <button type="button" id="vx-first">First</button>
      <button type="button" id="vx-last">Last</button>
    </div>
    <h4>preview</h4>
    <label class="vx-row"><span>fps</span>
      <input type="range" id="vx-fps" min="1" max="24" step="1" value="${state.fps}">
      <em id="vx-fps-em">${state.fps}</em>
    </label>
    <label class="vx-row"><span>zoom</span>
      <input type="range" id="vx-zoom" min="1" max="4" step="0.25" value="${state.zoom}">
      <em id="vx-zoom-em">×${state.zoom}</em>
    </label>
    <label class="vx-check"><input type="checkbox" id="vx-onion" ${state.onion ? 'checked' : ''}> onion skin (prev/next)</label>
    <label class="vx-row">blend
      <select id="vx-blend">
        ${['screen', 'normal', 'plus-lighter', 'lighten'].map((b) =>
          `<option value="${b}" ${b === state.blend ? 'selected' : ''}>${b}</option>`).join('')}
      </select>
    </label>
    <p class="vx-hint">Crosshair marks the cell centre. Scrub frames to spot <b>drift</b> — the shell should stay registered on the guides. Onion skin ghosts neighbours at low opacity.</p>
    <p class="vx-hint">Open: <code>?vfxedit=1&amp;vfx=${meta.id}&amp;frame=0</code></p>`;

  panel.querySelector('#vx-id').onchange = (e) => {
    play(false);
    state.frame = 0;
    loadStrip(e.target.value);
    pushUrl();
  };
  panel.querySelector('#vx-prev').onclick = () => { play(false); setFrame(state.frame - 1); };
  panel.querySelector('#vx-next').onclick = () => { play(false); setFrame(state.frame + 1); };
  panel.querySelector('#vx-first').onclick = () => { play(false); setFrame(0); };
  panel.querySelector('#vx-last').onclick = () => { play(false); setFrame(state.frames - 1); };
  panel.querySelector('#vx-play').onclick = () => play(!state.playing);
  const onScrub = (e) => {
    play(false);
    setFrame(Number(e.target.value));
  };
  panel.querySelector('#vx-frame').oninput = onScrub;
  panel.querySelector('#vx-frame-num').onchange = onScrub;
  panel.querySelector('#vx-fps').oninput = (e) => {
    state.fps = Number(e.target.value);
    const em = document.getElementById('vx-fps-em');
    if (em) em.textContent = String(state.fps);
  };
  panel.querySelector('#vx-zoom').oninput = (e) => {
    state.zoom = Number(e.target.value);
    const em = document.getElementById('vx-zoom-em');
    if (em) em.textContent = `×${state.zoom}`;
    paint();
  };
  panel.querySelector('#vx-onion').onchange = (e) => {
    state.onion = e.target.checked;
    paint();
  };
  panel.querySelector('#vx-blend').onchange = (e) => {
    state.blend = e.target.value;
    paint();
  };
}

function mountChrome() {
  for (const id of ['bg3d', 'vignette', 'grain', 'lantern', 'hud', 'aim', 'vfx', 'floaties', 'overlay', 'wipe', 'transit', 'tooltip']) {
    document.getElementById(id)?.remove();
  }
  const screen = document.getElementById('screen');
  screen.innerHTML = '';
  screen.className = 'vx-screen';

  const bar = document.createElement('header');
  bar.id = 'vx-bar';
  bar.innerHTML = `<b>vfx edit</b><span id="vx-strip">${state.id}</span>
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
    if (e.key === 'ArrowLeft' || e.key === 'a') { e.preventDefault(); play(false); setFrame(state.frame - 1); }
    else if (e.key === 'ArrowRight' || e.key === 'd') { e.preventDefault(); play(false); setFrame(state.frame + 1); }
    else if (e.key === ' ') { e.preventDefault(); play(!state.playing); }
    else if (e.key === 'o') { state.onion = !state.onion; renderPanel(); paint(); }
  });
}

const CSS = `
#vx-bar { position: fixed; top: 0; left: 0; right: 0; z-index: 400; display: flex; gap: 14px; align-items: center;
  padding: 8px 12px; background: #0b0d18f2; color: #cdd3ea; font: 13px/1.4 ui-monospace, SFMono-Regular, Menlo, monospace;
  border-bottom: 1px solid #333a55; }
#vx-bar a { color: #9fb4ff; text-decoration: none; }
#vx-bar a:last-of-type { margin-left: auto; }
#vx-strip { color: #f0c56a; }
#vx-panel { position: fixed; top: 44px; right: 0; bottom: 0; width: 300px; z-index: 400; overflow: auto;
  border-left: 1px solid #333a55; background: #0b0d18f2; padding: 12px;
  font: 13px/1.4 ui-monospace, SFMono-Regular, Menlo, monospace; color: #cdd3ea; }
#vx-panel h4 { margin: 14px 0 8px; color: #f0c56a; font: inherit; letter-spacing: 0.08em; text-transform: uppercase; font-size: 11px; }
.vx-sub { color: #6a7288; font-size: 11px; margin: 4px 0 0; }
.vx-pick label { display: grid; gap: 4px; color: #9aa7c8; }
.vx-pick select { width: 100%; background: #1a2036; color: inherit; border: 1px solid #3a4266; border-radius: 3px; }
.vx-frame-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 8px; }
.vx-frame-row button, .vx-actions button {
  font: inherit; background: #1a2036; color: inherit; border: 1px solid #3a4266; border-radius: 4px; padding: 4px 10px; cursor: pointer; }
.vx-frame-row button:hover, .vx-actions button:hover { border-color: #f0c56a; color: #f0c56a; }
.vx-actions { display: flex; flex-wrap: wrap; gap: 8px; margin: 8px 0 4px; }
.vx-row { display: grid; grid-template-columns: 56px 1fr 58px; gap: 6px; align-items: center; color: #9aa7c8; margin: 6px 0; }
.vx-row em { color: #f0c56a; font-style: normal; text-align: right; }
.vx-row input[type=range] { width: 100%; }
.vx-row input[type=number] { width: 58px; background: #1a2036; color: inherit; border: 1px solid #3a4266; border-radius: 3px; }
.vx-row select { grid-column: 2 / -1; width: 100%; background: #1a2036; color: inherit; border: 1px solid #3a4266; border-radius: 3px; }
.vx-check { display: flex; align-items: center; gap: 8px; color: #9aa7c8; margin: 8px 0; }
.vx-hint { color: #6a7288; font-size: 11px; margin-top: 14px; }
.vx-hint code { color: #9fb4ff; }
.vx-hint b { color: #cdd3ea; font-weight: 600; }
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
}
.vx-actor {
  position: absolute; left: calc(50% - 150px); top: 50%; translate: -50% -50%;
}
.vx-sprite {
  position: absolute; inset: 0; background-repeat: no-repeat; image-rendering: auto;
}
.vx-onion { opacity: 0.28; }
.vx-onion.prev { filter: hue-rotate(-40deg); }
.vx-onion.next { filter: hue-rotate(40deg); }
.vx-guides {
  position: absolute; inset: 0; z-index: 5; pointer-events: none;
  background:
    linear-gradient(#ff6f9e88, #ff6f9e88) center/1px 100% no-repeat,
    linear-gradient(#ff6f9e88, #ff6f9e88) center/100% 1px no-repeat,
    radial-gradient(circle at center, transparent 18%, #ffd76f33 19%, transparent 20%);
}
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
  const id = q().get('vfx') || STRIPS[0].id;
  const fr = Number(q().get('frame'));
  state.frame = Number.isFinite(fr) && fr >= 0 ? Math.floor(fr) : 0;
  mountChrome();
  loadStrip(stripMeta(id).id);
  pushUrl();
  window.__vfxEditor = {
    id: () => state.id,
    frame: () => state.frame,
    frames: () => state.frames,
    setFrame,
    play: () => play(true),
    pause: () => play(false),
  };
}
