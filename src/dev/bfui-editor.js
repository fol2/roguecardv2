// UI chrome layout editor — dev-only (?bfuiedit=1 behind import.meta.env.DEV).
// Drag overlays edit a working copy of UIC via _setUIC(); Save → POST /__bfui-save.
import { serializeUIC, validateUIC } from './bfui-serialize.js';
import { uicRaw, _setUIC, onUICChange, uicResolve } from '../uic.js';
import { stageEl, stageInfo, toStage } from '../stage.js';

const SHAPES = ['phone-portrait', 'phone-landscape', 'pad-portrait', 'pad-landscape', 'desktop-landscape'];
const POS = ['energy', 'lantern', 'endTurn', 'draw', 'discard', 'ashes'];
const LABELS = {
  energy: 'energy', lantern: 'lantern', endTurn: 'end turn',
  draw: 'draw', discard: 'discard', ashes: 'ashes', hud: 'HUD',
};
const clone = (o) => JSON.parse(JSON.stringify(o));
const state = { working: null, dirty: false, sel: null };

const q = () => new URLSearchParams(location.search);
function pushUrl() {
  const p = q();
  p.set('bfuiedit', '1');
  history.replaceState(null, '', `?${p}`);
}

function resolved() { return uicResolve(stageInfo().shape); }

function markDirty() {
  state.dirty = true;
  const d = document.getElementById('bfui-dirty');
  if (d) d.textContent = '● unsaved';
}

function applyWorking({ drag } = {}) {
  _setUIC(state.working, { silent: true });
  window.spirebound.refitCombat();
  markDirty();
  syncOverlays();
  if (!drag) renderPanel();
}

function ensureShapeBucket(shape) {
  state.working.shapes ??= {};
  state.working.shapes[shape] ??= {};
  return state.working.shapes[shape];
}

/** Write a widget field into the current shape override (copy-on-write from resolve). */
function writeWidget(id, patch, { drag } = {}) {
  const shape = stageInfo().shape;
  const bucket = ensureShapeBucket(shape);
  const cur = { ...resolved()[id], ...(bucket[id] || {}) };
  Object.assign(cur, patch);
  // keep exactly one horizontal anchor
  if (patch.left !== undefined) delete cur.right;
  if (patch.right !== undefined) delete cur.left;
  bucket[id] = cur;
  applyWorking({ drag });
}

function clearWidget(id) {
  const shape = stageInfo().shape;
  const bucket = state.working.shapes?.[shape];
  if (bucket?.[id]) delete bucket[id];
  if (bucket && !Object.keys(bucket).length) delete state.working.shapes[shape];
  applyWorking();
}

function startSandbox() {
  const sp = window.spirebound;
  sp.S.run = sp.E.newRun(20260709, { aspect: 0 });
  sp.startCombatUI(['duskfang', 'sporeling'], 'normal');
  document.querySelector('.combat-screen')?.classList.add('bfui-editing');
  requestAnimationFrame(() => { syncOverlays(); renderPanel(); });
}

function overlayHost() { return document.querySelector('.combat-screen') ?? stageEl(); }

function boxFor(id, L) {
  const w = L[id];
  if (!w) return null;
  const stg = stageInfo();
  const width = w.w ?? (id === 'energy' ? 120 : 80);
  const height = w.h ?? (id === 'energy' ? 90 : 80);
  const left = w.left !== undefined ? w.left : stg.w - (w.right ?? 0) - width;
  const top = stg.h - (w.bottom ?? 0) - height;
  return { left, top, width, height, anchor: w.left !== undefined ? 'left' : 'right' };
}

function syncOverlays() {
  const host = overlayHost();
  if (!host) return;
  let ov = host.querySelector('#bfui-overlay');
  if (!ov) {
    ov = document.createElement('div');
    ov.id = 'bfui-overlay';
    host.appendChild(ov);
  }
  const L = resolved();
  const stg = stageInfo();
  ov.innerHTML = '';
  for (const id of POS) {
    const b = boxFor(id, L);
    if (!b) continue;
    const el = document.createElement('div');
    el.className = `bfui-box${state.sel === id ? ' bfui-sel' : ''}`;
    el.dataset.id = id;
    el.style.left = `${b.left}px`;
    el.style.top = `${b.top}px`;
    el.style.width = `${b.width}px`;
    el.style.height = `${b.height}px`;
    el.innerHTML = `<span class="bfui-tag">${LABELS[id]}</span>${id === 'energy' ? '' : '<span class="bfui-handle"></span>'}`;
    ov.appendChild(el);
    bindDrag(el, id, b);
  }
  // HUD unit strip at top
  const hud = L.hud;
  if (hud) {
    const el = document.createElement('div');
    el.className = `bfui-box bfui-hud${state.sel === 'hud' ? ' bfui-sel' : ''}`;
    el.dataset.id = 'hud';
    el.style.left = '0';
    el.style.top = '0';
    el.style.width = `${stg.w}px`;
    el.style.height = `${hud.height}px`;
    el.style.transform = hud.scale === 1 ? '' : `scale(${hud.scale})`;
    el.style.transformOrigin = 'top center';
    el.innerHTML = `<span class="bfui-tag">HUD · h${hud.height} ×${hud.scale}</span><span class="bfui-handle bfui-hud-handle"></span>`;
    ov.appendChild(el);
    el.addEventListener('pointerdown', (e) => {
      if (e.target.classList.contains('bfui-hud-handle')) return;
      e.preventDefault();
      state.sel = 'hud';
      syncOverlays();
      renderPanel();
    });
    const handle = el.querySelector('.bfui-hud-handle');
    handle.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      state.sel = 'hud';
      const startY = e.clientY;
      const startH = resolved().hud.height;
      const move = (ev) => {
        const dy = toStage(0, ev.clientY).y - toStage(0, startY).y;
        writeWidget('hud', { height: Math.max(28, Math.round(startH + dy)) }, { drag: true });
      };
      const up = () => {
        removeEventListener('pointermove', move);
        removeEventListener('pointerup', up);
        renderPanel();
      };
      addEventListener('pointermove', move);
      addEventListener('pointerup', up);
    });
  }
}

function bindDrag(el, id, box) {
  el.addEventListener('pointerdown', (e) => {
    if (e.target.classList.contains('bfui-handle')) return;
    e.preventDefault();
    state.sel = id;
    const start = toStage(e.clientX, e.clientY);
    const L0 = resolved()[id];
    const startLeft = L0.left;
    const startRight = L0.right;
    const startBottom = L0.bottom;
    const move = (ev) => {
      const p = toStage(ev.clientX, ev.clientY);
      const dx = Math.round(p.x - start.x);
      const dy = Math.round(p.y - start.y);
      const patch = { bottom: Math.max(0, startBottom - dy) };
      if (startLeft !== undefined) patch.left = Math.max(0, startLeft + dx);
      else patch.right = Math.max(0, startRight - dx);
      writeWidget(id, patch, { drag: true });
    };
    const up = () => {
      removeEventListener('pointermove', move);
      removeEventListener('pointerup', up);
      renderPanel();
    };
    addEventListener('pointermove', move);
    addEventListener('pointerup', up);
    syncOverlays();
    renderPanel();
  });
  const handle = el.querySelector('.bfui-handle');
  if (!handle) return;
  handle.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    e.stopPropagation();
    state.sel = id;
    const start = toStage(e.clientX, e.clientY);
    const L0 = resolved()[id];
    const startW = L0.w ?? box.width;
    const startH = L0.h ?? box.height;
    const move = (ev) => {
      const p = toStage(ev.clientX, ev.clientY);
      writeWidget(id, {
        w: Math.max(24, Math.round(startW + (p.x - start.x))),
        h: Math.max(24, Math.round(startH + (p.y - start.y))),
      }, { drag: true });
    };
    const up = () => {
      removeEventListener('pointermove', move);
      removeEventListener('pointerup', up);
      renderPanel();
    };
    addEventListener('pointermove', move);
    addEventListener('pointerup', up);
  });
}

function renderToolbar() {
  document.getElementById('bfui-toolbar')?.remove();
  const bar = document.createElement('div');
  bar.id = 'bfui-toolbar';
  const shape = stageInfo().shape;
  bar.innerHTML = `
    <strong>bfuiedit</strong>
    <span class="bfui-grp">shape
      <select id="bfui-shape">${SHAPES.map((s) => `<option value="${s}"${s === shape ? ' selected' : ''}>${s}</option>`).join('')}</select>
    </span>
    <span id="bfui-dirty">${state.dirty ? '● unsaved' : 'saved'}</span>
    <span class="bfui-right">
      <button type="button" id="bfui-save">Save</button>
      <button type="button" id="bfui-revert">Revert</button>
      <button type="button" id="bfui-copy">Copy JS</button>
    </span>`;
  document.body.appendChild(bar);
  bar.querySelector('#bfui-shape').onchange = (e) => {
    if (state.dirty && !confirm('Switch shape? Unsaved edits stay in memory until Save.')) {
      e.target.value = shape;
      return;
    }
    const p = q();
    p.set('bfuiedit', '1');
    p.set('shape', e.target.value);
    location.search = p.toString();
  };
  bar.querySelector('#bfui-save').onclick = async () => {
    const { ok, problems } = validateUIC(state.working);
    if (!ok) return alert(`invalid layout:\n${problems.join('\n')}`);
    const r = await fetch('/__bfui-save', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(state.working),
    });
    const j = await r.json().catch(() => ({ ok: false, problems: [`HTTP ${r.status}`] }));
    if (!j.ok) return alert(`save failed:\n${(j.problems ?? []).join('\n')}`);
    state.dirty = false;
    document.getElementById('bfui-dirty').textContent = 'saved ✓';
  };
  bar.querySelector('#bfui-revert').onclick = () => {
    if (state.dirty && !confirm('Discard unsaved changes?')) return;
    location.reload();
  };
  bar.querySelector('#bfui-copy').onclick = async () => {
    await navigator.clipboard.writeText(serializeUIC(state.working));
    const d = document.getElementById('bfui-dirty');
    if (d) {
      const prev = d.textContent;
      d.textContent = 'copied ✓';
      setTimeout(() => { if (d.textContent === 'copied ✓') d.textContent = prev; }, 1500);
    }
  };
}

function renderPanel() {
  document.getElementById('bfui-panel')?.remove();
  const panel = document.createElement('div');
  panel.id = 'bfui-panel';
  const L = resolved();
  const shape = stageInfo().shape;
  const overridden = (id) => !!state.working.shapes?.[shape]?.[id];
  const rows = [];
  rows.push(`<div id="bfui-select">${[...POS, 'hud'].map((id) =>
    `<button type="button" data-sel="${id}" class="${state.sel === id ? 'on' : ''}">${LABELS[id]}</button>`).join('')}</div>`);
  const id = state.sel || 'energy';
  const w = L[id];
  rows.push(`<div class="bfui-hint">${shape}${overridden(id) ? ' · shape override' : ' · from base'}</div>`);
  if (id === 'hud') {
    for (const k of ['height', 'scale']) {
      rows.push(`<label>${k}<span><input type="number" step="${k === 'scale' ? 0.05 : 1}" data-k="${k}" value="${w[k]}"></span></label>`);
    }
  } else {
    const edge = w.left !== undefined ? 'left' : 'right';
    rows.push(`<label>anchor<span><select data-anchor><option value="left"${edge === 'left' ? ' selected' : ''}>left</option><option value="right"${edge === 'right' ? ' selected' : ''}>right</option></select></span></label>`);
    rows.push(`<label>${edge}<span><input type="number" data-k="${edge}" value="${w[edge]}"></span></label>`);
    rows.push(`<label>bottom<span><input type="number" data-k="bottom" value="${w.bottom}"></span></label>`);
    if (id !== 'energy') {
      rows.push(`<label>w<span><input type="number" data-k="w" value="${w.w ?? ''}"></span></label>`);
      rows.push(`<label>h<span><input type="number" data-k="h" value="${w.h ?? ''}"></span></label>`);
    }
  }
  if (overridden(id)) rows.push(`<button type="button" data-clear>clear shape override</button>`);
  panel.innerHTML = rows.join('');
  document.body.appendChild(panel);
  panel.querySelectorAll('[data-sel]').forEach((b) => {
    b.onclick = () => { state.sel = b.dataset.sel; syncOverlays(); renderPanel(); };
  });
  panel.querySelector('[data-anchor]')?.addEventListener('change', (e) => {
    const cur = resolved()[id];
    const stg = stageInfo();
    const width = cur.w ?? 80;
    if (e.target.value === 'left') {
      writeWidget(id, { left: cur.left ?? Math.round(stg.w - (cur.right ?? 0) - width) });
    } else {
      writeWidget(id, { right: cur.right ?? Math.round(stg.w - (cur.left ?? 0) - width) });
    }
  });
  panel.querySelectorAll('input[data-k]').forEach((inp) => {
    inp.onchange = () => {
      const k = inp.dataset.k;
      const v = Number(inp.value);
      if (!Number.isFinite(v)) return;
      writeWidget(id, { [k]: v });
    };
  });
  panel.querySelector('[data-clear]')?.addEventListener('click', () => clearWidget(id));
}

const CSS = `
#bfui-toolbar { position: fixed; top: 0; left: 0; right: 0; z-index: 400; display: flex; gap: 14px; align-items: center; padding: 6px 10px; background: #0b0d18f2; color: #cdd3ea; font: 12px/1.4 monospace; border-bottom: 1px solid #333a55; }
#bfui-toolbar .bfui-grp { display: flex; gap: 4px; align-items: center; }
#bfui-toolbar .bfui-right { margin-left: auto; display: flex; gap: 6px; }
#bfui-toolbar button, #bfui-toolbar select { font: inherit; background: #1a2036; color: inherit; border: 1px solid #3a4266; border-radius: 4px; padding: 2px 7px; cursor: pointer; }
#bfui-panel { position: fixed; top: 44px; right: 0; z-index: 400; width: 230px; max-height: calc(100vh - 60px); overflow: auto; background: #0b0d18f2; color: #cdd3ea; font: 12px/1.5 monospace; border: 1px solid #333a55; border-right: 0; padding: 10px; }
#bfui-select { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid #333a55; }
#bfui-select button { font: inherit; background: #1a2036; color: inherit; border: 1px solid #3a4266; border-radius: 4px; padding: 1px 7px; cursor: pointer; }
#bfui-select button.on { background: #34406e; border-color: #6fe3ff88; }
#bfui-panel label { display: flex; justify-content: space-between; gap: 6px; margin: 4px 0; }
#bfui-panel input, #bfui-panel select { width: 72px; font: inherit; background: #1a2036; color: inherit; border: 1px solid #3a4266; border-radius: 3px; }
#bfui-panel button[data-clear] { font: inherit; background: #3a2030; color: #ff9ebd; border: 1px solid #664455; border-radius: 3px; padding: 2px 7px; cursor: pointer; margin-top: 8px; }
#bfui-panel .bfui-hint { color: #6a7288; font-size: 10px; margin-bottom: 6px; }
#bfui-overlay { position: absolute; inset: 0; z-index: 50; pointer-events: none; }
.bfui-editing .hand-zone { pointer-events: none !important; z-index: 5 !important; }
.bfui-editing .player-zone, .bfui-editing .enemy { pointer-events: none !important; }
#bfui-overlay .bfui-box { position: absolute; pointer-events: auto; border: 1px dashed #6fe3ff88; cursor: move; box-sizing: border-box; }
#bfui-overlay .bfui-box.bfui-sel { border-color: #ffd76f; box-shadow: 0 0 0 1px #ffd76f44; }
#bfui-overlay .bfui-hud { border-color: #b98bff88; cursor: default; background: #b98bff18; }
#bfui-overlay .bfui-tag { position: absolute; left: 4px; top: -16px; color: #9fd4ff; font: 11px monospace; white-space: nowrap; }
#bfui-overlay .bfui-handle { position: absolute; right: -6px; bottom: -6px; width: 12px; height: 12px; background: #ffd76f; border-radius: 2px; cursor: nwse-resize; }
#bfui-overlay .bfui-hud-handle { left: 50%; right: auto; bottom: -6px; transform: translateX(-50%); cursor: ns-resize; }
`;

export function initBfuiEditor() {
  const style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);
  state.working = clone(uicRaw());
  _setUIC(state.working, { silent: true });
  pushUrl();
  renderToolbar();
  // wait for initUI to expose spirebound
  const boot = () => {
    if (!window.spirebound?.startCombatUI) return requestAnimationFrame(boot);
    startSandbox();
  };
  boot();
  onUICChange(() => {
    if (state.dirty) return;
    state.working = clone(uicRaw());
    _setUIC(state.working, { silent: true });
    window.spirebound?.refitCombat?.();
    syncOverlays();
    renderPanel();
  });
  addEventListener('keydown', (e) => {
    if (!state.sel || state.sel === 'hud' || /INPUT|SELECT/.test(document.activeElement?.tagName ?? '')) return;
    const step = e.shiftKey ? 10 : 1;
    const dx = e.key === 'ArrowRight' ? step : e.key === 'ArrowLeft' ? -step : 0;
    const dy = e.key === 'ArrowUp' ? step : e.key === 'ArrowDown' ? -step : 0;
    if (!dx && !dy) { if (e.key === 'Escape') { state.sel = null; syncOverlays(); renderPanel(); } return; }
    e.preventDefault();
    const w = resolved()[state.sel];
    const patch = { bottom: Math.max(0, w.bottom + (dy ? -dy : 0)) };
    if (w.left !== undefined) patch.left = Math.max(0, w.left + dx);
    else patch.right = Math.max(0, w.right - dx);
    writeWidget(state.sel, patch);
  });
  window.__bfuiEditor = { resolved, working: () => state.working };
}
