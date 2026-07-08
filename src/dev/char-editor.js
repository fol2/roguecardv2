// Character presentation editor — dev-only (?charedit=1).
// Edits src/char-meta.js: layout (scale/foot*), cast shadow, mesh/float overrides.
// Preview runs mesh warp + CSS idle float. Actor size also editable in ?bfedit=1.
import { ENEMIES, ASPECTS } from '../data.js';
import { assetUrl } from '../art.js';
import {
  CHAR_LAYOUT_DEFAULT, CHAR_SHADOW_DEFAULT,
  charMetaTable, _setCharMeta, charLayout, charShadow,
} from '../char-meta.js';
import {
  validateCharMeta, pruneCharMeta,
  LAYOUT_KEYS, SHADOW_KEYS, MESH_KEYS,
  LAYOUT_RANGES, SHADOW_RANGES, MESH_RANGES, CSS_FLOAT_RANGE,
} from './char-serialize.js';
import { bfResolve, bfEnemySize } from '../battlefield.js';
import { initStage } from '../stage.js';
import { initMesh, meshBind, meshClear, meshEnabled, meshLift, meshProfileFor } from '../mesh.js';

const clone = (o) => JSON.parse(JSON.stringify(o));
const HERO_IDS = ASPECTS.map((a) => a.id);
const ENEMY_IDS = Object.keys(ENEMIES).sort();
const ALL_IDS = [...HERO_IDS, ...ENEMY_IDS];
const EDITOR_SHAPE = 'desktop-landscape';
const FLOAT_KINDS = new Set(['wisp', 'eye', 'siren', 'shade', 'plant', 'slime', 'serpent']);

const state = {
  meta: clone(charMetaTable()),
  id: HERO_IDS[0] || ENEMY_IDS[0],
  dirty: false,
  zoom: 2.5, // preview-only; ox/oy are % so they transfer
  anim: true,
};

const q = () => new URLSearchParams(location.search);
function idFromUrl() {
  const id = q().get('char') || '';
  return ALL_IDS.includes(id) ? id : ALL_IDS[0];
}
function pushUrl() {
  const p = q();
  p.set('charedit', '1');
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

function ensureEntry(id) {
  state.meta[id] ??= {};
  return state.meta[id];
}
function entryOf(id) {
  return state.meta[id] || {};
}
function layoutOf(id) {
  _setCharMeta(state.meta);
  return charLayout(id);
}
function shadowOf(id) {
  _setCharMeta(state.meta);
  return charShadow(id);
}
function meshOf(id) {
  return meshProfileFor(kindOf(id), id);
}
function actorParams(id) {
  _setCharMeta(state.meta);
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

function markDirty() {
  state.dirty = true;
  _setCharMeta(state.meta);
  syncDirty();
  paintActor();
}
function syncDirty() {
  const d = document.getElementById('ce-dirty');
  if (d) d.textContent = state.dirty ? '● unsaved' : 'clean';
}

function spriteLiftPx(el) {
  const m = getComputedStyle(el).transform;
  if (!m || m === 'none') return 0;
  const a = m.match(/matrix(?:3d)?\(([^)]+)\)/);
  if (!a) return 0;
  const v = a[1].split(',').map((s) => parseFloat(s.trim()));
  const ty = v.length === 16 ? v[13] : v[5];
  return Math.max(0, -ty);
}

function applyShadowCss(shadowEl, id, lift, footY, zoom) {
  const c = shadowOf(id);
  const max = 16;
  const t = Math.min(1, lift / max);
  const sx = c.sx * (1 - t * 0.26);
  const sy = c.sy * (1 - t * 0.5);
  const o = c.opacity * (1 - t * 0.55);
  const blur = (c.blur + t * 2.8) * zoom;
  const skew = c.skew * (1 - t * 0.35);
  const dx = (c.dx + c.skew * 0.35 * (1 - t * 0.5)) * zoom;
  const dy = (c.dy + footY) * zoom;
  shadowEl.style.setProperty('--foot-ox', `${c.ox}%`);
  shadowEl.style.setProperty('--foot-oy', `${c.oy}%`);
  shadowEl.style.setProperty('--sh-sx', String(sx));
  shadowEl.style.setProperty('--sh-sy', String(sy));
  shadowEl.style.setProperty('--sh-o', String(o));
  shadowEl.style.setProperty('--sh-blur', `${blur}px`);
  shadowEl.style.setProperty('--sh-skew', `${skew}deg`);
  shadowEl.style.setProperty('--sh-x', `${dx}px`);
  shadowEl.style.setProperty('--sh-y', `${dy}px`);
}

function paintActor() {
  const host = document.getElementById('ce-stage');
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
  const c = shadowOf(id);
  const entry = entryOf(id);
  const idle = state.anim && FLOAT_KINDS.has(kind) ? ` idle-${kind}` : '';
  const cssFloat = entry.cssFloat;
  const floatAmp = Math.round((cssFloat != null ? cssFloat : 12) * z);

  host.innerHTML = `
    <div class="ce-ground"></div>
    <div class="ce-actor" style="width:${w}px;height:${h}px;bottom:calc(14% + ${footY}px)">
      <div class="ce-shadow cast-shadow"></div>
      <div class="ce-sprite${idle}" style="${idle ? `--float-y:${floatAmp}px` : ''}">
        ${url ? `<img class="raster-art" src="${url}" alt="">` : '<div class="ce-missing">no art</div>'}
      </div>
      <div class="ce-feet" style="left:${c.ox}%;top:${c.oy}%"></div>
    </div>
    <div class="ce-meta">${labelOf(id)} · ${kind} · combat ${ap.w}×${ap.h} · zoom ×${z}${state.anim ? ' · anim on' : ' · anim off'}</div>`;

  const shadow = host.querySelector('.ce-shadow');
  if (url) {
    const img = document.createElement('img');
    img.src = url;
    img.alt = '';
    shadow.appendChild(img);
  } else shadow.classList.add('cast-shadow-blob');
  applyShadowCss(shadow, id, 0, ap.footY, z);

  const sprite = host.querySelector('.ce-sprite');
  const actor = host.querySelector('.ce-actor');
  actor.onclick = (e) => {
    const r = actor.getBoundingClientRect();
    const ox = Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100));
    const oy = Math.max(0, Math.min(100, ((e.clientY - r.top) / r.height) * 100));
    const ent = ensureEntry(id);
    ent.shadow ??= {};
    ent.shadow.ox = Math.round(ox * 10) / 10;
    ent.shadow.oy = Math.round(oy * 10) / 10;
    markDirty();
    renderPanel();
  };

  if (state.anim && meshEnabled() && url) {
    meshBind([{ el: sprite, url, kind, id }]);
  }

  const tick = () => {
    if (!sprite.isConnected) return;
    let lift = 0;
    if (state.anim) {
      lift = spriteLiftPx(sprite);
      if (sprite.classList.contains('mesh-live')) lift += meshLift(sprite);
    }
    applyShadowCss(shadow, id, lift / z, ap.footY, z);
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function rangeRow(k, value, [lo, hi], step, overridden, dataAttr) {
  return `<label class="ce-row${overridden ? ' on' : ''}">
    <span>${k}${overridden ? ' ●' : ''}</span>
    <input type="range" min="${lo}" max="${hi}" step="${step}" ${dataAttr}="${k}" value="${value}">
    <input type="number" min="${lo}" max="${hi}" step="${step}" ${dataAttr}="${k}" value="${value}">
    ${overridden ? `<button type="button" data-clear="${dataAttr.slice(5)}" data-key="${k}" title="clear">×</button>` : '<span></span>'}
  </label>`;
}

function renderPanel() {
  const panel = document.getElementById('ce-panel');
  if (!panel) return;
  const id = state.id;
  const entry = entryOf(id);
  const lay = layoutOf(id);
  const sh = shadowOf(id);
  const mesh = meshOf(id);
  const ap = actorParams(id);

  const layoutRows = LAYOUT_KEYS.map((k) => {
    const step = k === 'scale' ? 0.05 : 1;
    return rangeRow(k, lay[k], LAYOUT_RANGES[k], step, entry[k] !== undefined, 'data-lay');
  }).join('');

  const shadowRows = SHADOW_KEYS.map((k) => {
    const step = (k === 'sx' || k === 'sy' || k === 'opacity') ? 0.01 : 1;
    return rangeRow(k, sh[k], SHADOW_RANGES[k], step, entry.shadow?.[k] !== undefined, 'data-sh');
  }).join('');

  const meshRows = MESH_KEYS.map((k) => {
    const overridden = entry.mesh?.[k] !== undefined;
    return rangeRow(k, mesh[k] ?? 0, MESH_RANGES[k], 0.05, overridden, 'data-mesh');
  }).join('');

  const cssOver = entry.cssFloat !== undefined;
  const cssVal = entry.cssFloat ?? 12;

  panel.innerHTML = `
    <div class="ce-pick">
      <label>character
        <select id="ce-id">${ALL_IDS.map((x) =>
          `<option value="${x}" ${x === id ? 'selected' : ''}>${isHero(x) ? '★ ' : ''}${labelOf(x)}</option>`).join('')}
        </select>
      </label>
      <div class="ce-size">
        <span>combat box</span><b>${ap.w}×${ap.h}</b>
        <span class="ce-size-note">from scale · also editable in ?bfedit=1</span>
      </div>
      <label>preview zoom <em>×${state.zoom}</em>
        <input type="range" id="ce-zoom" min="1" max="4" step="0.25" value="${state.zoom}">
      </label>
      <label class="ce-check"><input type="checkbox" id="ce-anim" ${state.anim ? 'checked' : ''}> mesh + float anim</label>
    </div>
    <h4>layout</h4>
    <div class="ce-fields">${layoutRows}</div>
    <h4>cast shadow</h4>
    <div class="ce-fields">${shadowRows}</div>
    <h4>mesh / float <em class="ce-kind">kind ${kindOf(id)}</em></h4>
    <p class="ce-sub">Overrides kind PROFILE (base shown). Clear = use kind default.</p>
    <div class="ce-fields">${meshRows}</div>
    <label class="ce-row${cssOver ? ' on' : ''}">
      <span>cssFloat${cssOver ? ' ●' : ''}</span>
      <input type="range" min="${CSS_FLOAT_RANGE[0]}" max="${CSS_FLOAT_RANGE[1]}" step="1" data-css="cssFloat" value="${cssVal}">
      <input type="number" min="${CSS_FLOAT_RANGE[0]}" max="${CSS_FLOAT_RANGE[1]}" step="1" data-css="cssFloat" value="${cssVal}">
      ${cssOver ? '<button type="button" data-clear-css title="clear">×</button>' : '<span></span>'}
    </label>
    <div class="ce-actions">
      <button type="button" id="ce-reset">Reset character</button>
      <button type="button" id="ce-save">Save char-meta</button>
    </div>
    <p class="ce-hint">Click sprite → plant shadow ox/oy. Zoom is preview-only. All knobs write <code>char-meta.js</code>.</p>`;

  panel.querySelector('#ce-id').onchange = (e) => {
    state.id = e.target.value;
    pushUrl();
    paintActor();
    renderPanel();
  };
  panel.querySelector('#ce-zoom').oninput = (e) => {
    state.zoom = Number(e.target.value);
    const em = e.target.closest('label')?.querySelector('em');
    if (em) em.textContent = `×${state.zoom}`;
    paintActor();
  };
  panel.querySelector('#ce-anim').onchange = (e) => {
    state.anim = e.target.checked;
    paintActor();
    renderPanel();
  };

  panel.querySelectorAll('input[data-lay]').forEach((inp) => {
    inp.oninput = () => {
      const k = inp.dataset.lay;
      const v = Number(inp.value);
      if (!Number.isFinite(v)) return;
      ensureEntry(id)[k] = v;
      markDirty();
      panel.querySelectorAll(`input[data-lay="${k}"]`).forEach((n) => { if (n !== inp) n.value = String(v); });
      const sizeB = panel.querySelector('.ce-size b');
      if (sizeB) {
        const ap2 = actorParams(id);
        sizeB.textContent = `${ap2.w}×${ap2.h}`;
      }
    };
  });
  panel.querySelectorAll('input[data-sh]').forEach((inp) => {
    inp.oninput = () => {
      const k = inp.dataset.sh;
      const v = Number(inp.value);
      if (!Number.isFinite(v)) return;
      const ent = ensureEntry(id);
      ent.shadow ??= {};
      ent.shadow[k] = v;
      markDirty();
      panel.querySelectorAll(`input[data-sh="${k}"]`).forEach((n) => { if (n !== inp) n.value = String(v); });
    };
  });
  panel.querySelectorAll('input[data-mesh]').forEach((inp) => {
    inp.oninput = () => {
      const k = inp.dataset.mesh;
      const v = Number(inp.value);
      if (!Number.isFinite(v)) return;
      const ent = ensureEntry(id);
      ent.mesh ??= {};
      ent.mesh[k] = v;
      markDirty();
      panel.querySelectorAll(`input[data-mesh="${k}"]`).forEach((n) => { if (n !== inp) n.value = String(v); });
    };
  });
  panel.querySelectorAll('input[data-css]').forEach((inp) => {
    inp.oninput = () => {
      const v = Number(inp.value);
      if (!Number.isFinite(v)) return;
      ensureEntry(id).cssFloat = v;
      markDirty();
      panel.querySelectorAll('input[data-css]').forEach((n) => { if (n !== inp) n.value = String(v); });
    };
  });

  panel.querySelectorAll('[data-clear="lay"]').forEach((b) => {
    b.onclick = () => { delete ensureEntry(id)[b.dataset.key]; markDirty(); renderPanel(); };
  });
  panel.querySelectorAll('[data-clear="sh"]').forEach((b) => {
    b.onclick = () => {
      const ent = ensureEntry(id);
      if (ent.shadow) delete ent.shadow[b.dataset.key];
      if (ent.shadow && !Object.keys(ent.shadow).length) delete ent.shadow;
      markDirty();
      renderPanel();
    };
  });
  panel.querySelectorAll('[data-clear="mesh"]').forEach((b) => {
    b.onclick = () => {
      const ent = ensureEntry(id);
      if (ent.mesh) delete ent.mesh[b.dataset.key];
      if (ent.mesh && !Object.keys(ent.mesh).length) delete ent.mesh;
      markDirty();
      renderPanel();
    };
  });
  panel.querySelector('[data-clear-css]')?.addEventListener('click', () => {
    delete ensureEntry(id).cssFloat;
    markDirty();
    renderPanel();
  });

  panel.querySelector('#ce-reset').onclick = () => {
    delete state.meta[id];
    markDirty();
    renderPanel();
  };
  panel.querySelector('#ce-save').onclick = () => saveMeta();
}

async function saveMeta() {
  const pruned = pruneCharMeta(state.meta, {
    layout: CHAR_LAYOUT_DEFAULT,
    shadow: CHAR_SHADOW_DEFAULT,
  });
  const problems = validateCharMeta(pruned, { heroes: HERO_IDS, enemies: ENEMY_IDS });
  if (problems.length) return alert(`char-meta invalid:\n${problems.join('\n')}`);
  const r = await fetch('/__char-save', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(pruned),
  });
  const j = await r.json();
  if (!j.ok) return alert(`save failed:\n${(j.problems ?? []).join('\n')}`);
  state.meta = pruned;
  _setCharMeta(state.meta);
  state.dirty = false;
  syncDirty();
  renderPanel();
}

function mountChrome() {
  for (const id of ['bg3d', 'vignette', 'grain', 'lantern', 'hud', 'aim', 'vfx', 'floaties', 'overlay', 'wipe', 'transit', 'tooltip']) {
    document.getElementById(id)?.remove();
  }
  const screen = document.getElementById('screen');
  screen.innerHTML = '';
  screen.className = 'ce-screen';

  const bar = document.createElement('header');
  bar.id = 'ce-bar';
  bar.innerHTML = `<b>char meta</b><span id="ce-dirty">clean</span><a href="/?bfedit=1">bfedit</a><a href="/">← game</a>`;

  const panel = document.createElement('aside');
  panel.id = 'ce-panel';

  const host = document.createElement('div');
  host.id = 'ce-stage';
  screen.appendChild(host);

  document.body.append(bar, panel);

  const style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);
}

const CSS = `
#ce-bar { position: fixed; top: 0; left: 0; right: 0; z-index: 400; display: flex; gap: 14px; align-items: center;
  padding: 8px 12px; background: #0b0d18f2; color: #cdd3ea; font: 13px/1.4 ui-monospace, SFMono-Regular, Menlo, monospace;
  border-bottom: 1px solid #333a55; }
#ce-bar a { color: #9fb4ff; text-decoration: none; margin-left: 12px; }
#ce-bar a:last-of-type { margin-left: auto; }
#ce-dirty { color: #f0c56a; }
#ce-panel { position: fixed; top: 44px; right: 0; bottom: 0; width: 320px; z-index: 400; overflow: auto;
  border-left: 1px solid #333a55; background: #0b0d18f2; padding: 12px;
  font: 13px/1.4 ui-monospace, SFMono-Regular, Menlo, monospace; color: #cdd3ea; }
#ce-panel h4 { margin: 14px 0 8px; color: #f0c56a; font: inherit; letter-spacing: 0.08em; text-transform: uppercase; font-size: 11px; }
#ce-panel h4 .ce-kind { color: #9aa7c8; font-style: normal; letter-spacing: 0; text-transform: none; margin-left: 6px; }
.ce-sub { color: #6a7288; font-size: 11px; margin: -4px 0 8px; }
#ce-stage {
  position: absolute; inset: 0; padding-right: 320px; box-sizing: border-box;
  background:
    radial-gradient(ellipse at 50% 70%, #1a2036 0%, #0b0d18 70%),
    repeating-linear-gradient(90deg, transparent, transparent 39px, #1a203622 40px);
  overflow: hidden;
}
.ce-ground {
  position: absolute; left: 8%; right: 8%; bottom: 14%; height: 2px;
  background: linear-gradient(90deg, transparent, #ff6f9e88 20%, #ff6f9e88 80%, transparent);
}
.ce-actor { position: absolute; left: 50%; translate: -50% 0; cursor: crosshair; }
.ce-shadow {
  position: absolute; inset: 0; z-index: 0; pointer-events: none;
  transform-origin: var(--foot-ox, 50%) var(--foot-oy, 100%);
  transform: translate(var(--sh-x, 0), var(--sh-y, 0)) scale(var(--sh-sx, 1), var(--sh-sy, 0.24)) skewX(var(--sh-skew, 0deg));
  opacity: var(--sh-o, 0.62); filter: blur(var(--sh-blur, 1.5px)); mix-blend-mode: multiply;
}
.ce-shadow img { width: 100%; height: 100%; object-fit: contain; object-position: center bottom; display: block; filter: brightness(0) contrast(1.2); }
.ce-sprite { position: absolute; inset: 0; z-index: 1; width: 100%; height: 100%; }
.ce-sprite img { width: 100%; height: 100%; object-fit: contain; object-position: center bottom; display: block; }
.ce-feet {
  position: absolute; width: 14px; height: 14px; margin: -7px 0 0 -7px; border-radius: 50%;
  border: 2px solid #ffd76f; background: #ffd76f55; z-index: 2; pointer-events: none;
}
.ce-meta { position: absolute; left: 12px; top: 12px; color: #9aa7c8; z-index: 3; pointer-events: none; }
.ce-missing { display: grid; place-items: center; height: 100%; color: #664; }
.ce-pick { display: grid; gap: 8px; margin-bottom: 4px; }
.ce-pick label { display: grid; gap: 4px; color: #9aa7c8; }
.ce-pick label em { color: #f0c56a; font-style: normal; }
.ce-pick select, .ce-pick input[type=range] { width: 100%; }
.ce-check { display: flex !important; align-items: center; gap: 8px; grid-template-columns: none !important; }
.ce-check input { width: auto; }
.ce-size { display: grid; grid-template-columns: auto 1fr; gap: 6px 10px; padding: 8px; border: 1px solid #333a55; border-radius: 6px; color: #9aa7c8; align-items: center; }
.ce-size b { color: #cdd3ea; }
.ce-size-note { grid-column: 1 / -1; font-size: 11px; color: #6a7288; }
.ce-fields { display: grid; gap: 6px; }
.ce-row { display: grid; grid-template-columns: 72px 1fr 58px 18px; gap: 6px; align-items: center; color: #9aa7c8; margin: 0; }
.ce-row.on span { color: #f0c56a; }
.ce-row input[type=number] { width: 58px; background: #1a2036; color: inherit; border: 1px solid #3a4266; border-radius: 3px; }
.ce-row button { background: #3a2030; color: #ff9ebd; border: 1px solid #664455; border-radius: 3px; cursor: pointer; padding: 0; }
.ce-actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; }
.ce-actions button { font: inherit; background: #1a2036; color: inherit; border: 1px solid #3a4266; border-radius: 4px; padding: 4px 10px; cursor: pointer; }
.ce-actions button:hover { border-color: #f0c56a; color: #f0c56a; }
.ce-hint { color: #6a7288; font-size: 11px; margin-top: 14px; }
.ce-hint code { color: #9fb4ff; }
@media (max-width: 800px) {
  #ce-panel { width: 100%; top: auto; height: 42vh; border-left: 0; border-top: 1px solid #333a55; }
  #ce-stage { padding-right: 0; padding-bottom: 42vh; }
}
`;

export function initCharEditor() {
  initStage();
  initMesh();
  state.meta = clone(charMetaTable());
  _setCharMeta(state.meta);
  state.id = idFromUrl();
  pushUrl();
  mountChrome();
  paintActor();
  renderPanel();
  window.__charEditor = {
    id: () => state.id,
    meta: () => entryOf(state.id),
    shadow: () => shadowOf(state.id),
    layout: () => layoutOf(state.id),
    mesh: () => meshOf(state.id),
    actor: () => actorParams(state.id),
  };
}
