// Battlefield editor — dev-only (?bfedit=1 behind import.meta.env.DEV).
// Overlays + panel edit a working copy of BF via _setBF(); Save writes
// src/battlefield-layout.js through the vite dev endpoint.
import { ENEMIES, ASPECTS } from '../data.js';
import { serializeBF, validateBF } from './bf-serialize.js';
import { bfRaw, _setBF, bfResolve, bfActor, bfSlots, bfEnemySize } from '../battlefield.js';
import { stageEl, stageW, stageH, stageScale, stageInfo } from '../stage.js';

const SHAPES = ['phone-portrait', 'phone-landscape', 'pad-portrait', 'pad-landscape', 'desktop-landscape'];
const LAYERS = ['backdrop', 'mid', 'ledge'];
const LAYER_UI = { backdrop: 'backdrop', mid: 'mid', ledge: 'ground' }; // ledge PNG = the ground plate
const LAYER_FIELDS = { h: 'height', y: 'bottom offset', x: 'x offset', zoom: 'zoom', posX: 'crop X %', posY: 'crop Y %', opacity: 'opacity', drift: 'drift px' };
const clone = (o) => JSON.parse(JSON.stringify(o));
const getPath = (obj, path) => path.reduce((o, k) => o?.[k], obj);
function setPath(obj, path, value) {
  let o = obj;
  for (const k of path.slice(0, -1)) o = o[k] ??= {};
  o[path.at(-1)] = value;
}
function delPath(obj, path) {
  const parent = getPath(obj, path.slice(0, -1));
  if (parent) delete parent[path.at(-1)];
}
function applyWorking() {
  _setBF(state.working);
  window.spirebound.refitCombat();
  state.dirty = true;
  const d = document.getElementById('bf-dirty');
  if (d) d.textContent = '● unsaved';
  syncOverlays();
  renderPanel();
}
const isActorSharedPath = (path) => path[0] === 'sizes' || path[0] === 'heroes' || path[0] === 'enemies';
function mutateField(scope, path, value) {
  const shape = stageInfo().shape;
  if (scope === 'shared' && !isActorSharedPath(path)) scope = defaultScope(path);
  if (scope === 'shared') setPath(state.working.shared, path, value);
  else if (scope === 'base') setPath(state.working.base, path, value);
  else {
    // shape scope; formations copy-on-write (arrays replace wholesale on merge)
    if (path[0] === 'slots' && getPath(state.working.shapes?.[shape] ?? {}, ['slots', path[1]]) === undefined) {
      setPath(state.working, ['shapes', shape, 'slots', path[1]], clone(bfResolve(shape).slots[path[1]] ?? bfSlots(bfResolve(shape), Number(path[1]))));
    }
    setPath(state.working, ['shapes', shape, ...path], value);
  }
}
function writeField(scope, path, value, { drag } = {}) {
  mutateField(scope, path, value);
  if (drag) {
    _setBF(state.working);
    state.dirty = true;
    const d = document.getElementById('bf-dirty');
    if (d) d.textContent = '● unsaved';
    syncOverlays();
    return;
  }
  applyWorking();
}
const defaultScope = (path) => (path[0] === 'sizes' || path[0] === 'heroes' || path[0] === 'enemies') ? 'shared'
  : (stageInfo().shape === 'pad-landscape' ? 'base' : 'shape');
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
  document.querySelector('.combat-screen')?.classList.add('bf-editing');
  // player turn never ends in the sandbox, so the scene sits still
  requestAnimationFrame(() => { syncOverlays(); renderPanel(); });
}

// ---------------------------------------------------------------- overlays
// Boxes are computed from the WORKING LAYOUT (pure stage px), never measured
// from the DOM — breathe/drift animations must not wobble the outlines.
// (Layer imgs are only consulted for static facts: src + natural size + alpha.)
function overlayHost() { return document.querySelector('.combat-screen') ?? stageEl(); }

// Alpha-scan a layer PNG (downscaled, cached by src) so its overlay box can
// frame the visible art instead of the plate — transparent padding in the
// asset would otherwise make the outline lie about what's on screen.
const artBoundsCache = new Map();
function artBounds(img) {
  if (!img?.complete || !img.naturalWidth) return null;
  if (artBoundsCache.has(img.src)) return artBoundsCache.get(img.src);
  const nw = img.naturalWidth, nh = img.naturalHeight;
  const sw = 128, sh = Math.max(1, Math.round(nh * (sw / nw)));
  const c = document.createElement('canvas');
  c.width = sw; c.height = sh;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, sw, sh);
  let bounds = null;
  try {
    const d = ctx.getImageData(0, 0, sw, sh).data;
    let t = sh, b = -1, l = sw, r = -1;
    for (let y = 0; y < sh; y++) for (let x = 0; x < sw; x++) {
      if (d[(y * sw + x) * 4 + 3] > 16) { if (y < t) t = y; if (y > b) b = y; if (x < l) l = x; if (x > r) r = x; }
    }
    bounds = b < 0 ? { empty: true } : { t: t / sh, b: (b + 1) / sh, l: l / sw, r: (r + 1) / sw };
  } catch { /* tainted canvas — keep the plate box */ }
  artBoundsCache.set(img.src, bounds);
  return bounds;
}
// Stage-px rect of the opaque art: mirrors the layer img CSS (height:h,
// width:auto + min-width:100%, object-fit:cover, object-position posX/posY,
// left:50%+x with translateX(-50%), scale zoom about origin 0 100% — which
// multiplies the translate too, keeping the plate center-anchored).
function layerArtRect(name, p, plateBottom) {
  const img = document.querySelector(`.combat-screen .sl-${name}`);
  const bounds = img && artBounds(img);
  if (!bounds) {
    if (img && !img.complete) img.addEventListener('load', () => syncOverlays(), { once: true });
    return null;
  }
  if (bounds.empty) return { empty: true };
  const nw = img.naturalWidth, nh = img.naturalHeight;
  const elemW = Math.max(stageW(), nw * (p.h / nh));
  const s = Math.max(elemW / nw, p.h / nh);
  const offX = (elemW - nw * s) * (p.posX / 100);
  const offY = (p.h - nh * s) * (p.posY / 100);
  // object-fit: cover clips to the element box
  const x0 = Math.max(0, offX + bounds.l * nw * s), x1 = Math.min(elemW, offX + bounds.r * nw * s);
  const y0 = Math.max(0, offY + bounds.t * nh * s), y1 = Math.min(p.h, offY + bounds.b * nh * s);
  if (x1 <= x0 || y1 <= y0) return { empty: true };
  const zoom = p.zoom ?? 1;
  const cx = stageW() / 2 + (p.x ?? 0);
  return {
    x: cx + (x0 - elemW / 2) * zoom,
    w: (x1 - x0) * zoom,
    h: (y1 - y0) * zoom,
    bottom: plateBottom + (p.h - y1) * zoom,
  };
}
function overlayRects() {
  const shape = stageInfo().shape;
  const L = bfResolve(shape);
  const rects = [];
  // layers first so hero/enemy boxes stack above and receive drags
  LAYERS.forEach((name) => {
    const p = L.layers[name];
    const bottom = name === 'ledge' ? Math.max(0, L.groundY + L.ledgeLip - p.h + p.y) : p.y;
    const zoom = p.zoom ?? 1;
    const art = layerArtRect(name, p, bottom);
    if (art?.empty) {
      rects.push({ id: `layer-${name}`, x: 0, w: stageW(), h: p.h, bottom, layer: true, label: `${LAYER_UI[name]} — art fully transparent in view!` });
    } else if (art) {
      const label = zoom !== 1 ? `zoom ${zoom}×` : undefined;
      rects.push({ id: `layer-${name}`, x: art.x, w: art.w, h: art.h, bottom: art.bottom, layer: true, label });
    } else {
      // image not decoded yet — plate box until the load listener resyncs
      rects.push({ id: `layer-${name}`, x: 0, w: stageW(), h: p.h, bottom, layer: true });
    }
  });
  rects.push({ id: 'ground', x: 0, w: stageW(), h: 12, bottom: L.groundY - 5, ground: true, label: `ground ${L.groundY}px` });
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
  return rects;
}

let overlayEl = null;
function syncOverlays() {
  const host = overlayHost();
  if (!overlayEl) {
    overlayEl = document.createElement('div');
    overlayEl.id = 'bf-overlay';
    host.appendChild(overlayEl);
  } else if (overlayEl.parentElement !== host) host.appendChild(overlayEl);
  overlayEl.innerHTML = '';
  for (const r of overlayRects()) {
    const b = document.createElement('div');
    b.className = `bf-box${r.layer ? ' bf-layer' : ''}${r.ground ? ' bf-ground' : ''}${state.sel === r.id ? ' bf-sel' : ''}`;
    b.dataset.bf = r.id;
    b.style.cssText = `left:${r.x}px;bottom:${r.bottom}px;width:${r.w}px;height:${r.h}px;z-index:${r.layer ? 1 : r.ground ? 11 : 12};pointer-events:${r.layer && state.sel !== r.id ? 'none' : 'auto'};`;
    if (r.label) b.innerHTML = `<span class="bf-tag">${r.label}</span>`;
    if (state.sel === r.id && !r.ground) b.innerHTML += '<span class="bf-handle"></span>';
    b.addEventListener('pointerdown', (e) => onBoxPointerDown(e, r.id));
    overlayEl.appendChild(b);
  }
}
function onBoxPointerDown(e, id) {
  select(id);
  e.preventDefault();
  const onHandle = e.target.classList.contains('bf-handle');
  const shape = stageInfo().shape;
  // snapshot EVERYTHING at drag start; every move event writes L0 + total
  // delta, so repeated events never compound
  const L0 = clone(bfResolve(shape));
  const heroId = ASPECTS[state.scenario.aspect].id;
  const heroFoot0 = bfActor('heroes', heroId).footY;
  const enemyFoot0 = state.scenario.ids.map((k) => bfActor('enemies', k).footY);
  const start = { x: e.clientX, y: e.clientY };
  const sc = stageScale();
  const count = state.scenario.ids.length;
  const slots0 = L0.slots[count] ?? bfSlots(L0, count);
  let axis = null; // body drags lock to the dominant axis of the first decisive move
  let wrote = false; // a plain click writes nothing and must not dirty the layout
  const w = (scope, path, value) => { wrote = true; writeField(scope, path, value, { drag: true }); };
  const move = (ev) => {
    const dx = Math.round((ev.clientX - start.x) / sc);
    const dy = Math.round((ev.clientY - start.y) / sc); // screen-down = stage-down
    if (!axis && Math.abs(dx) + Math.abs(dy) >= 3) axis = Math.abs(dx) >= Math.abs(dy) ? 'x' : 'y';
    const posScope = defaultScope(['hero']);
    if (id === 'ground') w(posScope, ['groundY'], Math.max(0, L0.groundY - dy));
    else if (id === 'hero') {
      if (onHandle) {
        w(posScope, ['hero', 'w'], Math.max(24, L0.hero.w + dx));
        w(posScope, ['hero', 'h'], Math.max(24, L0.hero.h - dy));
      } else if (axis === 'x') w(posScope, ['hero', 'x'], L0.hero.x + dx);
      else if (axis === 'y') w('shared', ['heroes', heroId, 'footY'], heroFoot0 - dy);
    } else if (id.startsWith('enemy-')) {
      const i = Number(id.slice(6));
      const key = state.scenario.ids[i];
      if (onHandle) w(posScope, ['slots', String(count), i, 's'], Math.max(0.1, +((slots0[i].s ?? 1) + dx / 200).toFixed(2)));
      else if (axis === 'x') w(posScope, ['slots', String(count), i, 'x'], slots0[i].x + dx);
      else if (axis === 'y') w('shared', ['enemies', key, 'footY'], enemyFoot0[i] - dy);
    } else if (id.startsWith('layer-')) {
      const name = id.slice(6);
      if (onHandle) w(posScope, ['layers', name, 'h'], Math.max(10, L0.layers[name].h - dy));
      else if (axis === 'x') w(posScope, ['layers', name, 'x'], (L0.layers[name].x ?? 0) + dx);
      else if (axis === 'y') w(posScope, ['layers', name, 'y'], L0.layers[name].y - dy);
    }
  };
  const up = () => {
    removeEventListener('pointermove', move);
    removeEventListener('pointerup', up);
    if (wrote) applyWorking();
  };
  addEventListener('pointermove', move);
  addEventListener('pointerup', up);
}
function select(id) {
  state.sel = id;
  syncOverlays();
  renderPanel(); // re-renders the sidebar object list with the new highlight
}

// ---------------------------------------------------------------- panel
function fieldRows() {
  if (!state.sel) return [];
  const shape = stageInfo().shape;
  const L = bfResolve(shape);
  const over = state.working.shapes?.[shape] ?? {};
  const posScopes = shape === 'pad-landscape' ? ['base'] : ['base', 'shape']; // no self-shadowing override on the base shape
  const pos = (label, path, value) => ({ label, path, value, scope: defaultScope(path), scopes: posScopes, overridden: getPath(over, path) !== undefined });
  const sh = (label, path, value) => ({ label, path, value, scope: 'shared', scopes: ['shared'], overridden: false });
  if (state.sel === 'ground') return [pos('groundY', ['groundY'], L.groundY), pos('ledgeLip', ['ledgeLip'], L.ledgeLip)];
  if (state.sel === 'hero') {
    const id = ASPECTS[state.scenario.aspect].id;
    const a = bfActor('heroes', id);
    return [
      pos('x', ['hero', 'x'], L.hero.x),
      pos('w', ['hero', 'w'], L.hero.w),
      pos('h', ['hero', 'h'], L.hero.h),
      sh(`scale · ${id}`, ['heroes', id, 'scale'], a.scale),
      sh(`footY · ${id}`, ['heroes', id, 'footY'], a.footY),
    ];
  }
  if (state.sel.startsWith('enemy-')) {
    const i = Number(state.sel.slice(6));
    const key = state.scenario.ids[i];
    const d = ENEMIES[key];
    const tier = d.boss ? 'boss' : d.elite ? 'elite' : 'normal';
    const count = String(state.scenario.ids.length);
    const slot = bfSlots(L, state.scenario.ids.length)[i];
    const a = bfActor('enemies', key);
    return [
      pos(`slot x`, ['slots', count, i, 'x'], slot.x),
      pos(`slot s`, ['slots', count, i, 's'], slot.s ?? 1),
      sh(`scale · ${key}`, ['enemies', key, 'scale'], a.scale),
      sh(`footY · ${key}`, ['enemies', key, 'footY'], a.footY),
      sh(`size · tier ${tier}`, ['sizes', tier], L.shared.sizes[tier]),
    ];
  }
  if (state.sel.startsWith('layer-')) {
    const name = state.sel.slice(6);
    return ['h', 'y', 'x', 'zoom', 'posX', 'posY', 'opacity', 'drift'].map((k) => pos(`${LAYER_UI[name] ?? name}.${LAYER_FIELDS[k]}`, ['layers', name, k], L.layers[name][k]));
  }
  return [];
}
let panelEl = null;
// Sidebar object list: big/overlapping overlay boxes (a full-stage layer, say)
// otherwise shadow everything beneath them and make scene clicks useless.
function selectorItems() {
  return [
    ['layer-backdrop', 'backdrop'],
    ['layer-mid', 'mid'],
    ['layer-ledge', 'ground plate'],
    ['ground', 'ground line'],
    ['hero', 'hero'],
    ...state.scenario.ids.map((k, i) => [`enemy-${i}`, `foe ${i + 1} · ${k}`]),
  ];
}
function renderPanel() {
  if (!panelEl) { panelEl = document.createElement('div'); panelEl.id = 'bf-panel'; document.body.appendChild(panelEl); }
  const shape = stageInfo().shape;
  const rows = fieldRows();
  const selLabel = state.sel?.startsWith('layer-') ? LAYER_UI[state.sel.slice(6)] ?? state.sel : (state.sel ?? 'select something');
  const selector = selectorItems()
    .map(([id, label]) => `<button data-select="${id}"${state.sel === id ? ' class="on"' : ''}>${label}</button>`).join('');
  panelEl.innerHTML = `<div id="bf-select">${selector}</div>
    <h3>${selLabel}</h3>
    <div class="bf-scope">shape: <b>${shape}</b>${shape === 'pad-landscape' ? ' (base)' : ''}</div>
    ${rows.map((f, i) => `<label>${f.label}
      <span>
        <select data-scope="${i}"${f.scopes.length === 1 ? ' disabled' : ''}>
          ${f.scopes.map((s) => `<option${s === f.scope ? ' selected' : ''}>${s}</option>`).join('')}
        </select>
        <input type="number" step="any" data-row="${i}" data-path="${f.path.at(-1)}" value="${f.value}">
        ${f.overridden ? `<button data-clear="${i}" title="clear this shape's override">×</button>` : ''}
      </span></label>`).join('')}`;
  panelEl.onchange = (e) => {
    const t = e.target;
    if (t.dataset.row != null) {
      const f = fieldRows()[Number(t.dataset.row)];
      const scopeSel = panelEl.querySelector(`select[data-scope="${t.dataset.row}"]`);
      const v = Number(t.value);
      if (Number.isFinite(v)) writeField(scopeSel?.value ?? f.scope, f.path, v);
    }
  };
  panelEl.onclick = (e) => {
    const sel = e.target.dataset?.select;
    if (sel) { select(sel); return; }
    const c = e.target.dataset?.clear;
    if (c != null) {
      const f = fieldRows()[Number(c)];
      // slots overrides are whole arrays (replace wholesale on merge): clear
      // the entire formation override, never a leaf key inside it
      const path = f.path[0] === 'slots' ? ['slots', f.path[1]] : f.path;
      delPath(state.working, ['shapes', stageInfo().shape, ...path]);
      applyWorking();
    }
  };
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
      if (state.dirty && !confirm('Discard unsaved changes?')) return;
      pushScenarioToUrl();
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
  bar.querySelector('#bf-save').onclick = async () => {
    const problems = validateBF(state.working);
    if (problems.length) return alert(`invalid layout:\n${problems.join('\n')}`);
    const r = await fetch('/__bf-save', { method: 'POST', body: JSON.stringify(state.working) });
    const j = await r.json().catch(() => ({ ok: false, problems: [`HTTP ${r.status}`] }));
    if (!j.ok) return alert(`save failed:\n${(j.problems ?? []).join('\n')}`);
    state.dirty = false;
    document.getElementById('bf-dirty').textContent = 'saved ✓';
    if (j.reload) location.reload(); // scenario survives in the URL
  };
  bar.querySelector('#bf-revert').onclick = () => {
    if (state.dirty && !confirm('Discard unsaved changes?')) return;
    location.reload();
  };
  bar.querySelector('#bf-copy').onclick = async () => {
    await navigator.clipboard.writeText(serializeBF(state.working));
    const d = document.getElementById('bf-dirty');
    if (d) {
      const prev = d.textContent;
      d.textContent = 'copied ✓';
      setTimeout(() => { if (d.textContent === 'copied ✓') d.textContent = prev; }, 1500);
    }
  };
}

const CSS = `
#bf-toolbar { position: fixed; top: 0; left: 0; right: 0; z-index: 400; display: flex; gap: 14px; align-items: center; padding: 6px 10px; background: #0b0d18f2; color: #cdd3ea; font: 12px/1.4 monospace; border-bottom: 1px solid #333a55; }
#bf-toolbar .bf-grp { display: flex; gap: 4px; align-items: center; }
#bf-toolbar .bf-right { margin-left: auto; }
#bf-toolbar button, #bf-toolbar select { font: inherit; background: #1a2036; color: inherit; border: 1px solid #3a4266; border-radius: 4px; padding: 2px 7px; cursor: pointer; }
#bf-toolbar button.on { background: #34406e; }
#bf-panel { position: fixed; top: 44px; right: 0; z-index: 400; width: 250px; max-height: calc(100vh - 60px); overflow: auto; background: #0b0d18f2; color: #cdd3ea; font: 12px/1.5 monospace; border: 1px solid #333a55; border-right: 0; padding: 10px; }
#bf-select { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid #333a55; }
#bf-select button { font: inherit; background: #1a2036; color: inherit; border: 1px solid #3a4266; border-radius: 4px; padding: 1px 7px; cursor: pointer; }
#bf-select button.on { background: #34406e; border-color: #6fe3ff88; }
#bf-panel label { display: flex; justify-content: space-between; gap: 6px; margin: 4px 0; }
#bf-panel label > span { display: flex; gap: 4px; align-items: center; }
#bf-panel input { width: 56px; font: inherit; background: #1a2036; color: inherit; border: 1px solid #3a4266; border-radius: 3px; }
#bf-panel select { font: inherit; background: #1a2036; color: inherit; border: 1px solid #3a4266; border-radius: 3px; }
#bf-panel button[data-clear] { font: inherit; background: #3a2030; color: #ff9ebd; border: 1px solid #664455; border-radius: 3px; padding: 0 5px; cursor: pointer; }
#bf-overlay { position: absolute; inset: 0; z-index: 6; pointer-events: none; }
.bf-editing .player-zone, .bf-editing .enemy, .bf-editing .hand-zone { pointer-events: none !important; }
.bf-editing .energy-orb, .bf-editing .end-turn,
.bf-editing .pile-btn, .bf-editing .lantern-btn { z-index: 10 !important; pointer-events: auto !important; }
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
  addEventListener('keydown', (e) => {
    if (!state.sel || /INPUT|SELECT/.test(document.activeElement?.tagName ?? '')) return;
    const step = e.shiftKey ? 10 : 1;
    const dx = e.key === 'ArrowRight' ? step : e.key === 'ArrowLeft' ? -step : 0;
    const dy = e.key === 'ArrowUp' ? step : e.key === 'ArrowDown' ? -step : 0;
    if (!dx && !dy) { if (e.key === 'Escape') select(null); return; }
    e.preventDefault();
    const L = bfResolve(stageInfo().shape);
    const scope = defaultScope(['hero']);
    const count = state.scenario.ids.length;
    if (state.sel === 'ground' && dy) writeField(scope, ['groundY'], L.groundY + dy);
    else if (state.sel === 'hero' && dx) writeField(scope, ['hero', 'x'], L.hero.x + dx);
    else if (state.sel === 'hero' && dy) writeField('shared', ['heroes', ASPECTS[state.scenario.aspect].id, 'footY'], bfActor('heroes', ASPECTS[state.scenario.aspect].id).footY + dy);
    else if (state.sel.startsWith('enemy-')) {
      const i = Number(state.sel.slice(6));
      if (dx) writeField(scope, ['slots', String(count), i, 'x'], bfSlots(L, count)[i].x + dx);
      else writeField('shared', ['enemies', state.scenario.ids[i], 'footY'], bfActor('enemies', state.scenario.ids[i]).footY + dy);
    } else if (state.sel.startsWith('layer-')) {
      const name = state.sel.slice(6);
      if (dx) writeField(scope, ['layers', name, 'x'], (L.layers[name].x ?? 0) + dx);
      if (dy) writeField(scope, ['layers', name, 'y'], L.layers[name].y + dy);
    }
  });
  window.__bfEditor = { resolved: () => bfResolve(stageInfo().shape), working: () => state.working };
}
