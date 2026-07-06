// Battlefield editor — dev-only (?bfedit=1 behind import.meta.env.DEV).
// Overlays + panel edit a working copy of BF via _setBF(); Save (Task 6)
// writes src/battlefield-layout.js through the vite dev endpoint.
import { ENEMIES, ASPECTS } from '../data.js';
import { bfRaw, _setBF, bfResolve, bfActor, bfSlots, bfEnemySize } from '../battlefield.js';
import { stageEl, stageW, stageH, stageScale, stageInfo } from '../stage.js';

const SHAPES = ['phone-portrait', 'phone-landscape', 'pad-portrait', 'pad-landscape', 'desktop-landscape'];
const LAYERS = ['backdrop', 'mid', 'ledge'];
const clone = (o) => JSON.parse(JSON.stringify(o));
const state = { working: null, sel: null, dirty: false, scenario: null };

const q = () => new URLSearchParams(location.search);
function scenarioFromUrl() {
  const p = q();
  return {
    act: Math.min(2, Math.max(0, Number(p.get('bfa') ?? 0))),
    aspect: Math.min(ASPECTS.length - 1, Math.max(0, Number(p.get('bfh') ?? 0))),
    ids: (p.get('bft') ?? 'duskfang,sporeling').split(',').filter((k) => ENEMIES[k]),
  };
}
function pushScenarioToUrl() {
  const p = q();
  p.set('bfedit', '1');
  p.set('bfa', state.scenario.act);
  p.set('bfh', state.scenario.aspect);
  p.set('bft', state.scenario.ids.join(','));
  history.replaceState(null, '', `?${p}`);
}

function startSandbox() {
  const sp = window.spirebound;
  sp.S.run = sp.E.newRun(20260706, { aspect: state.scenario.aspect });
  sp.S.run.act = state.scenario.act;
  sp.startCombatUI(state.scenario.ids, 'normal');
  // player turn never ends in the sandbox, so the scene sits still
  requestAnimationFrame(() => { syncOverlays(); renderPanel(); });
}

// ---------------------------------------------------------------- overlays
// Boxes are computed from the WORKING LAYOUT (pure stage px), never measured
// from the DOM — breathe/drift animations must not wobble the outlines.
function overlayRects() {
  const shape = stageInfo().shape;
  const L = bfResolve(shape);
  const rects = [];
  const hero = bfActor('heroes', ASPECTS[state.scenario.aspect].id);
  const hw = Math.round(L.hero.w * hero.scale), hh = Math.round(L.hero.h * hero.scale);
  rects.push({ id: 'hero', x: L.hero.x - hw / 2, w: hw, h: hh, bottom: L.groundY + hero.footY });
  const slots = bfSlots(L, state.scenario.ids.length);
  state.scenario.ids.forEach((key, i) => {
    const d = ENEMIES[key];
    const tier = d.boss ? 'boss' : d.elite ? 'elite' : 'normal';
    const size = bfEnemySize(L, key, tier, slots[i], stageW(), stageH());
    rects.push({ id: `enemy-${i}`, x: slots[i].x - size / 2, w: size, h: size, bottom: L.groundY + bfActor('enemies', key).footY });
  });
  LAYERS.forEach((name) => {
    const p = L.layers[name];
    rects.push({ id: `layer-${name}`, x: 0, w: stageW(), h: p.h, bottom: p.y, layer: true });
  });
  rects.push({ id: 'ground', x: 0, w: stageW(), h: 2, bottom: L.groundY, ground: true, label: `ground ${L.groundY}px` });
  return rects;
}

let overlayEl = null;
function syncOverlays() {
  if (!overlayEl) {
    overlayEl = document.createElement('div');
    overlayEl.id = 'bf-overlay';
    stageEl().appendChild(overlayEl);
  }
  overlayEl.innerHTML = '';
  for (const r of overlayRects()) {
    const b = document.createElement('div');
    b.className = `bf-box${r.layer ? ' bf-layer' : ''}${r.ground ? ' bf-ground' : ''}${state.sel === r.id ? ' bf-sel' : ''}`;
    b.dataset.bf = r.id;
    b.style.cssText = `left:${r.x}px;bottom:${r.bottom}px;width:${r.w}px;height:${r.h}px;`;
    if (r.label) b.innerHTML = `<span class="bf-tag">${r.label}</span>`;
    if (state.sel === r.id && !r.ground) b.innerHTML += '<span class="bf-handle"></span>';
    b.addEventListener('pointerdown', (e) => onBoxPointerDown(e, r.id)); // drag lands in Task 5
    overlayEl.appendChild(b);
  }
}
function onBoxPointerDown(e, id) { select(id); } // replaced with drag logic in Task 5
function select(id) { state.sel = id; syncOverlays(); renderPanel(); }

// ---------------------------------------------------------------- panel
function fieldRows() {
  // returns [{label, get()}] for the current selection, read-only for now
  const shape = stageInfo().shape;
  const L = bfResolve(shape);
  if (!state.sel) return [];
  if (state.sel === 'hero') {
    const id = ASPECTS[state.scenario.aspect].id;
    const a = bfActor('heroes', id);
    return [
      { label: 'x (layout)', get: () => L.hero.x },
      { label: 'w (layout)', get: () => L.hero.w },
      { label: 'h (layout)', get: () => L.hero.h },
      { label: `scale (shared:${id})`, get: () => a.scale },
      { label: `footY (shared:${id})`, get: () => a.footY },
    ];
  }
  if (state.sel === 'ground') {
    return [
      { label: 'groundY (layout)', get: () => L.groundY },
      { label: 'ledgeLip (layout)', get: () => L.ledgeLip },
    ];
  }
  if (state.sel.startsWith('enemy-')) {
    const i = Number(state.sel.slice(6));
    const key = state.scenario.ids[i];
    const slots = bfSlots(L, state.scenario.ids.length);
    const a = bfActor('enemies', key);
    return [
      { label: `slot ${i} x (layout)`, get: () => slots[i].x },
      { label: `slot ${i} s (layout)`, get: () => slots[i].s },
      { label: `scale (shared:${key})`, get: () => a.scale },
      { label: `footY (shared:${key})`, get: () => a.footY },
    ];
  }
  if (state.sel.startsWith('layer-')) {
    const name = state.sel.slice(6);
    const p = L.layers[name];
    return ['h', 'y', 'zoom', 'posX', 'opacity'].map((k) => ({ label: `${name}.${k} (layout)`, get: () => p[k] }));
  }
  return [];
}
let panelEl = null;
function renderPanel() {
  if (!panelEl) {
    panelEl = document.createElement('div');
    panelEl.id = 'bf-panel';
    document.body.appendChild(panelEl);
  }
  const shape = stageInfo().shape;
  panelEl.innerHTML = `<h3>${state.sel ?? 'select something'}</h3>
    <div class="bf-scope">shape: <b>${shape}</b>${shape === 'pad-landscape' ? ' (base)' : ''}</div>
    ${fieldRows().map((f, i) => `<label>${f.label}<input type="number" step="any" data-f="${i}" value="${f.get()}" disabled></label>`).join('')}`;
}

// ---------------------------------------------------------------- toolbar
function renderToolbar() {
  const bar = document.createElement('div');
  bar.id = 'bf-toolbar';
  const shapeBtns = SHAPES.map((s) => `<button data-shape="${s}"${stageInfo().shape === s ? ' class="on"' : ''}>${s.replace('-', ' ')}</button>`).join('');
  const typeSel = (i) => `<select data-slot="${i}">${Object.keys(ENEMIES).map((k) => `<option${state.scenario.ids[i] === k ? ' selected' : ''}>${k}</option>`).join('')}</select>`;
  bar.innerHTML = `
    <span class="bf-grp">${shapeBtns}</span>
    <span class="bf-grp">act <select id="bf-act">${[0, 1, 2].map((a) => `<option value="${a}"${state.scenario.act === a ? ' selected' : ''}>${a + 1}</option>`).join('')}</select></span>
    <span class="bf-grp">hero <select id="bf-hero">${ASPECTS.map((a, i) => `<option value="${i}"${state.scenario.aspect === i ? ' selected' : ''}>${a.id}</option>`).join('')}</select></span>
    <span class="bf-grp">foes <select id="bf-count">${[1, 2, 3].map((n) => `<option${state.scenario.ids.length === n ? ' selected' : ''}>${n}</option>`).join('')}</select>
      <span id="bf-types">${state.scenario.ids.map((_, i) => typeSel(i)).join('')}</span></span>
    <span class="bf-grp bf-right"><span id="bf-dirty"></span>
      <button id="bf-copy">Copy JS</button><button id="bf-revert">Revert</button><button id="bf-save">Save</button></span>`;
  document.body.appendChild(bar);
  bar.addEventListener('click', (e) => {
    const sh = e.target.dataset?.shape;
    if (sh) {
      const p = q(); p.set('shape', sh); pushScenarioToUrl();
      const p2 = new URLSearchParams(location.search); p2.set('shape', sh);
      location.search = `?${p2}`; // stage shape is picked at boot: honest reload
    }
  });
  bar.addEventListener('change', (e) => {
    const t = e.target;
    if (t.id === 'bf-act') state.scenario.act = Number(t.value);
    else if (t.id === 'bf-hero') state.scenario.aspect = Number(t.value);
    else if (t.id === 'bf-count') {
      const n = Number(t.value);
      const pool = Object.keys(ENEMIES);
      while (state.scenario.ids.length < n) state.scenario.ids.push(pool[0]);
      state.scenario.ids.length = n;
    } else if (t.dataset.slot != null) state.scenario.ids[Number(t.dataset.slot)] = t.value;
    else return;
    pushScenarioToUrl();
    bar.remove(); renderToolbar(); // re-render selects
    startSandbox();
  });
  // Save/Revert/Copy wired in Task 6
}

const CSS = `
#bf-toolbar { position: fixed; top: 0; left: 0; right: 0; z-index: 400; display: flex; gap: 14px; align-items: center; padding: 6px 10px; background: #0b0d18f2; color: #cdd3ea; font: 12px/1.4 monospace; border-bottom: 1px solid #333a55; }
#bf-toolbar .bf-grp { display: flex; gap: 4px; align-items: center; }
#bf-toolbar .bf-right { margin-left: auto; }
#bf-toolbar button, #bf-toolbar select { font: inherit; background: #1a2036; color: inherit; border: 1px solid #3a4266; border-radius: 4px; padding: 2px 7px; cursor: pointer; }
#bf-toolbar button.on { background: #34406e; }
#bf-panel { position: fixed; top: 44px; right: 0; z-index: 400; width: 250px; max-height: calc(100vh - 60px); overflow: auto; background: #0b0d18f2; color: #cdd3ea; font: 12px/1.5 monospace; border: 1px solid #333a55; border-right: 0; padding: 10px; }
#bf-panel label { display: flex; justify-content: space-between; gap: 6px; margin: 4px 0; }
#bf-panel input { width: 76px; font: inherit; background: #1a2036; color: inherit; border: 1px solid #3a4266; border-radius: 3px; }
#bf-overlay { position: absolute; inset: 0; z-index: 300; pointer-events: none; }
#bf-overlay .bf-box { position: absolute; pointer-events: auto; border: 1px dashed #6fe3ff88; cursor: move; }
#bf-overlay .bf-box.bf-sel { border-color: #ffd76f; box-shadow: 0 0 0 1px #ffd76f44; }
#bf-overlay .bf-layer { border-color: #b98bff55; }
#bf-overlay .bf-ground { border: 0; border-top: 2px solid #ff6f9e; cursor: ns-resize; }
#bf-overlay .bf-tag { position: absolute; left: 8px; top: -18px; color: #ff9ebd; font: 11px monospace; }
#bf-overlay .bf-handle { position: absolute; right: -6px; bottom: -6px; width: 12px; height: 12px; background: #ffd76f; border-radius: 2px; cursor: nwse-resize; }
`;

export function initBfEditor() {
  const style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);
  state.working = clone(bfRaw());
  _setBF(state.working);
  state.scenario = scenarioFromUrl();
  pushScenarioToUrl();
  renderToolbar();
  startSandbox();
}
