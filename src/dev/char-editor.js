// Character presentation editor — dev-only (?charedit=1).
// Edits src/char-meta.js: layout (scale/foot*), cast shadow, mesh/float overrides.
// Preview runs mesh warp + CSS idle float. Actor size also editable in ?bfedit=1.
import { ENEMIES, ASPECTS } from '../data.js';
import { assetUrl } from '../art.js';
import {
  CHAR_LAYOUT_DEFAULT, CHAR_SHADOW_DEFAULT, CHAR_AIM_DEFAULT,
  charMetaTable, _setCharMeta, charLayout, charShadow, onCharMetaChange,
} from '../char-meta.js';
import {
  validateCharMeta, pruneCharMeta,
  LAYOUT_KEYS, SHADOW_KEYS, MESH_KEYS, AIM_KEYS, AIM_STYLES,
  LAYOUT_RANGES, SHADOW_RANGES, MESH_RANGES, AIM_SPEED_RANGE, AIM_WIDTH_RANGE, AIM_COUNT_RANGE, CSS_FLOAT_RANGE,
} from './char-serialize.js';
import { bfResolve, bfEnemySize } from '../battlefield.js';
import { initStage } from '../stage.js';
import { initMesh, meshBind, meshClear, meshEnabled, meshLift, meshProfileFor, meshAim, meshAimClear } from '../mesh.js';
import { scanShadowOrigin } from './char-feet-scan.js';
import { ensureDevStyle, mountRailDrawer, setDevTitle } from './chrome.js';


// Observatory chrome shared by the exclusive/overlay editors: drawer + menu-btn
// + topbar tokens. Injected once per page alongside each editor's own CSS.
const DEV_SHELL_CSS = `
`;

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
  outline: false, // off by default — silhouette ring clutters feet/shadow edits
  aimDefault: { ...CHAR_AIM_DEFAULT },
  // per-field write target; scope select chooses where the next edit writes
  aimScope: Object.fromEntries(AIM_KEYS.map((k) => [k, 'global'])),
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
  _setCharMeta(state.meta, { silent: true });
  return charLayout(id);
}
function shadowOf(id) {
  _setCharMeta(state.meta, { silent: true });
  return charShadow(id);
}
function meshOf(id) {
  return meshProfileFor(kindOf(id), id);
}
function aimOf(id) {
  return { ...state.aimDefault, ...((state.meta[id] || {}).aim || {}) };
}
function aimOverridden(id, key) {
  const a = (state.meta[id] || {}).aim;
  return !!(a && a[key] !== undefined);
}
function syncAimScopes(id) {
  for (const k of AIM_KEYS) {
    state.aimScope[k] = aimOverridden(id, k) ? 'character' : 'global';
  }
}
function previewAimCfg(id) {
  return aimOf(id);
}
function applyAimPreview() {
  const sprite = document.querySelector('.ce-sprite');
  if (!state.outline || !sprite?.classList.contains('mesh-live')) {
    if (!state.outline) meshAimClear();
    return;
  }
  meshAim(sprite, true, previewAimCfg(state.id));
}
function writeAim(id, key, value) {
  const was = aimOverridden(id, key);
  if (state.aimScope[key] === 'character') {
    const ent = ensureEntry(id);
    ent.aim ??= {};
    ent.aim[key] = value;
  } else {
    state.aimDefault[key] = value;
  }
  state.dirty = true;
  syncDirty();
  applyAimPreview();
  return was !== aimOverridden(id, key);
}
function actorParams(id) {
  _setCharMeta(state.meta, { silent: true });
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
  _setCharMeta(state.meta, { silent: true });
  syncDirty();
  paintActor();
}
function syncDirty() {
  const d = document.getElementById('ce-dirty');
  if (!d) return;
  d.textContent = state.dirty ? '● unsaved' : 'clean';
  d.classList.toggle('is-warn', state.dirty);
  d.classList.toggle('is-ok', !state.dirty);
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

function applyShadowCss(shadowEl, id, lift, zoom = 1) {
  // Same as combat syncCastShadow: layout foot*/scale move the art box
  // (upstream); shadow is a child and follows. dx/dy are shadow-only.
  const c = shadowOf(id);
  const max = 16;
  const t = Math.min(1, lift / max);
  const sx = c.sx * (1 - t * 0.26);
  const sy = c.sy * (1 - t * 0.5);
  const o = c.opacity * (1 - t * 0.55);
  const blur = (c.blur + t * 2.8) * zoom;
  const skew = c.skew * (1 - t * 0.35);
  const dx = (c.dx + c.skew * 0.35 * (1 - t * 0.5)) * zoom;
  const dy = c.dy * zoom;
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
  const footX = Math.round(ap.footX * z);
  const c = shadowOf(id);
  const entry = entryOf(id);
  const idle = state.anim && FLOAT_KINDS.has(kind) ? ` idle-${kind}` : '';
  const cssFloat = entry.cssFloat;
  const floatAmp = Math.round((cssFloat != null ? cssFloat : 12) * z);

  // Layout is upstream (same as combat): box at ground + foot*; shadow is a
  // child so it follows. Cast-shadow dx/dy are fine-tunes only.
  host.innerHTML = `
    <div class="ce-ground"></div>
    <div class="ce-actor" style="width:${w}px;height:${h}px;bottom:calc(14% + ${footY}px);margin-left:${footX}px">
      <div class="ce-shadow cast-shadow"></div>
      <div class="ce-sprite${idle}" style="${idle ? `--float-y:${floatAmp}px` : ''}">
        ${url ? `<img class="raster-art" src="${url}" alt="">` : '<div class="ce-missing">no art</div>'}
      </div>
      <div class="ce-feet" style="left:${c.ox}%;top:${c.oy}%" title="ox/oy on the art box"></div>
    </div>
    <div class="ce-meta">${labelOf(id)} · ${kind} · combat ${ap.w}×${ap.h} · zoom ×${z}${state.anim ? ' · anim on' : ' · anim off'}${ap.footY || ap.footX ? ` · foot ${ap.footX},${ap.footY}` : ''}</div>`;

  const shadow = host.querySelector('.ce-shadow');
  if (url) {
    const img = document.createElement('img');
    img.src = url;
    img.alt = '';
    shadow.appendChild(img);
  } else shadow.classList.add('cast-shadow-blob');
  applyShadowCss(shadow, id, 0, z);

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
    if (state.outline) meshAim(sprite, true, previewAimCfg(id));
    else meshAimClear();
  } else {
    meshAimClear();
  }

  const tick = () => {
    if (!sprite.isConnected) return;
    let lift = 0;
    if (state.anim) {
      lift = spriteLiftPx(sprite);
      if (sprite.classList.contains('mesh-live')) lift += meshLift(sprite);
    }
    applyShadowCss(shadow, id, lift / z, z);
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
  const aim = aimOf(id);
  const [spdLo, spdHi] = AIM_SPEED_RANGE;
  const [wLo, wHi] = AIM_WIDTH_RANGE;

  const aimRows = AIM_KEYS.map((k) => {
    const over = aimOverridden(id, k);
    const scope = state.aimScope[k] || (over ? 'character' : 'global');
    const scopeSel = `<select data-aim-scope="${k}" title="scope chooses where the next edit writes">
      <option value="global"${scope === 'global' ? ' selected' : ''}>global</option>
      <option value="character"${scope === 'character' ? ' selected' : ''}>character</option>
    </select>`;
    const clear = over
      ? `<button type="button" data-clear-aim="${k}" title="clear character override">×</button>`
      : '<span></span>';
    if (k === 'style') {
      return `<label class="ce-aim-row${over ? ' on' : ''}">
        <span>style${over ? ' ●' : ''}</span>
        <select data-aim="style">${AIM_STYLES.map((s) =>
          `<option value="${s}"${aim.style === s ? ' selected' : ''}>${s}</option>`).join('')}
        </select>
        ${scopeSel}${clear}
      </label>`;
    }
    if (k === 'speed') {
      return `<label class="ce-aim-row${over ? ' on' : ''}">
        <span>speed${over ? ' ●' : ''}</span>
        <span class="ce-aim-pair">
          <input type="range" min="${spdLo}" max="${spdHi}" step="0.05" data-aim="speed" value="${aim.speed}">
          <input type="number" min="${spdLo}" max="${spdHi}" step="0.05" data-aim="speed" value="${aim.speed}">
        </span>
        ${scopeSel}${clear}
      </label>`;
    }
    if (k === 'width') {
      return `<label class="ce-aim-row${over ? ' on' : ''}">
        <span>width${over ? ' ●' : ''}</span>
        <span class="ce-aim-pair">
          <input type="range" min="${wLo}" max="${wHi}" step="0.001" data-aim="width" value="${aim.width}">
          <input type="number" min="${wLo}" max="${wHi}" step="0.001" data-aim="width" value="${aim.width}">
        </span>
        ${scopeSel}${clear}
      </label>`;
    }
    if (k === 'beams' || k === 'dashes') {
      const [lo, hi] = AIM_COUNT_RANGE;
      return `<label class="ce-aim-row${over ? ' on' : ''}">
        <span>${k}${over ? ' ●' : ''}</span>
        <span class="ce-aim-pair">
          <input type="range" min="${lo}" max="${hi}" step="1" data-aim="${k}" value="${aim[k]}">
          <input type="number" min="${lo}" max="${hi}" step="1" data-aim="${k}" value="${aim[k]}">
        </span>
        ${scopeSel}${clear}
      </label>`;
    }
    return `<label class="ce-aim-row${over ? ' on' : ''}">
      <span>color${over ? ' ●' : ''}</span>
      <input type="color" data-aim="color" value="${aim.color}">
      ${scopeSel}${clear}
    </label>`;
  }).join('');

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
      <label class="ce-check"><input type="checkbox" id="ce-outline" ${state.outline ? 'checked' : ''} ${state.anim && meshEnabled() ? '' : 'disabled'}> aim outline preview</label>
    </div>
    <h4>aim outline</h4>
    <p class="ce-sub">beams → chase; dashes → spin (1–4). Scope chooses where the next edit writes. × clears character override.</p>
    <div class="ce-fields ce-aim">${aimRows}</div>
    <h4>layout</h4>
    <div class="ce-fields">${layoutRows}</div>
    <h4>cast shadow</h4>
    <div class="ce-shadow-tools">
      <button type="button" id="ce-autodetect" title="Scan PNG alpha for feet → ox/oy">Auto-detect feet</button>
    </div>
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
    <p class="ce-hint">Layout (scale/footX/footY) moves the art box — shadow follows as a child (same as combat). Click / auto-detect plant ox/oy; dx/dy are shadow-only fine-tunes. Saves to <code>char-meta.js</code> (aim default + per-id overrides).</p>`;

  panel.querySelector('#ce-id').onchange = (e) => {
    state.id = e.target.value;
    syncAimScopes(state.id);
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
    if (!state.anim) state.outline = false;
    paintActor();
    renderPanel();
  };
  panel.querySelector('#ce-outline').onchange = (e) => {
    state.outline = e.target.checked;
    const sprite = document.querySelector('.ce-sprite');
    if (!sprite?.classList.contains('mesh-live')) { paintActor(); return; }
    applyAimPreview();
  };

  panel.querySelectorAll('[data-aim-scope]').forEach((sel) => {
    sel.onchange = () => {
      const k = sel.dataset.aimScope;
      const next = sel.value;
      if (next === 'character' && !aimOverridden(id, k)) {
        const ent = ensureEntry(id);
        ent.aim ??= {};
        ent.aim[k] = aimOf(id)[k];
        state.dirty = true;
        syncDirty();
      }
      state.aimScope[k] = next;
      renderPanel();
      applyAimPreview();
    };
  });
  panel.querySelectorAll('[data-aim]').forEach((inp) => {
    const apply = () => {
      const k = inp.dataset.aim;
      let v = inp.value;
      if (k === 'speed' || k === 'width' || k === 'beams' || k === 'dashes') {
        v = Number(v);
        if (!Number.isFinite(v)) return;
        if (k === 'beams' || k === 'dashes') v = Math.min(4, Math.max(1, Math.round(v)));
        if (k === 'width') v = Math.min(0.06, Math.max(0.006, Math.round(v * 1000) / 1000));
        panel.querySelectorAll(`input[data-aim="${k}"]`).forEach((n) => { if (n !== inp) n.value = String(v); });
      }
      if (writeAim(id, k, v)) renderPanel();
    };
    inp.oninput = apply;
    inp.onchange = apply;
  });
  panel.querySelectorAll('[data-clear-aim]').forEach((b) => {
    b.onclick = () => {
      const k = b.dataset.clearAim;
      const ent = ensureEntry(id);
      if (ent.aim) delete ent.aim[k];
      if (ent.aim && !Object.keys(ent.aim).length) delete ent.aim;
      state.aimScope[k] = 'global';
      markDirty();
      renderPanel();
      applyAimPreview();
    };
  });

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

  panel.querySelector('#ce-autodetect').onclick = () => autoDetectFeet();
  panel.querySelector('#ce-reset').onclick = () => {
    delete state.meta[id];
    syncAimScopes(id);
    markDirty();
    renderPanel();
  };
  panel.querySelector('#ce-save').onclick = () => saveMeta();
}

async function autoDetectFeet() {
  const id = state.id;
  const url = urlOf(id);
  const ap = actorParams(id); // keep current scale/foot* — ox/oy are art-box %
  const btn = document.getElementById('ce-autodetect');
  if (btn) { btn.disabled = true; btn.textContent = 'Scanning…'; }
  const hit = await scanShadowOrigin(url, ap.w, ap.h);
  if (btn) { btn.disabled = false; btn.textContent = 'Auto-detect feet'; }
  if (!hit) return alert('Auto-detect failed — no opaque pixels (or missing art).');
  const ent = ensureEntry(id);
  ent.shadow ??= {};
  ent.shadow.ox = hit.ox;
  ent.shadow.oy = hit.oy;
  markDirty();
  renderPanel();
}

async function saveMeta() {
  const pruned = pruneCharMeta(state.meta, {
    layout: CHAR_LAYOUT_DEFAULT,
    shadow: CHAR_SHADOW_DEFAULT,
    aim: state.aimDefault,
  });
  const problems = validateCharMeta(pruned, { heroes: HERO_IDS, enemies: ENEMY_IDS });
  if (problems.length) return alert(`char-meta invalid:\n${problems.join('\n')}`);
  const r = await fetch('/__char-save', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ meta: pruned, aim: state.aimDefault }),
  });
  const j = await r.json();
  if (!j.ok) return alert(`save failed:\n${(j.problems ?? []).join('\n')}`);
  state.meta = pruned;
  Object.assign(CHAR_AIM_DEFAULT, state.aimDefault);
  _setCharMeta(state.meta, { silent: true });
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

  ensureDevStyle();
  const bar = document.createElement('header');
  bar.id = 'ce-bar';
  bar.setAttribute('data-charedit-root', '1');
  bar.innerHTML = `<button type="button" class="dev-menu-btn" id="ce-menu" title="Dev tools" aria-label="Dev tools">☰</button>
    <span class="ce-title">Character editor</span><span class="ce-param">?charedit=1</span>
    <span id="ce-dirty" class="dev-chip is-ok">clean</span>
    <a href="/?vfxedit=1">vfxedit</a><a href="/?bfedit=1">bfedit</a><a href="/">← game</a>`;

  const panel = document.createElement('aside');
  panel.id = 'ce-panel';

  const host = document.createElement('div');
  host.id = 'ce-stage';
  screen.appendChild(host);

  document.body.append(bar, panel);

  const style = document.createElement('style');
  style.textContent = DEV_SHELL_CSS + CSS;
  document.head.appendChild(style);

  const drawer = mountRailDrawer('charedit');
  bar.querySelector('#ce-menu').onclick = () => drawer.toggle();
}

const CSS = `
#ce-bar { position: fixed; top: 0; left: 0; right: 0; z-index: 400; display: flex; gap: 12px; align-items: center; height: 48px;
  padding: 0 16px; background: var(--dev-bg); color: var(--dev-text); font-family: var(--dev-font); font-size: 13px;
  border-bottom: 1px solid var(--dev-border); -webkit-font-smoothing: antialiased; }
#ce-bar .ce-title { font-size: 14px; font-weight: 700; color: var(--dev-text); }
#ce-bar .ce-param { font: 400 11px var(--dev-mono); color: var(--dev-faint); }
#ce-bar a { color: var(--dev-muted); text-decoration: none; font-size: 12px; margin-left: 12px; transition: color 0.14s ease; }
#ce-bar a:hover { color: var(--dev-accent-light); }
#ce-bar a:first-of-type { margin-left: auto; }
#ce-dirty { font-family: var(--dev-font); }
#ce-panel { position: fixed; top: 48px; right: 0; bottom: 0; width: 320px; z-index: 400; overflow: auto;
  border-left: 1px solid var(--dev-border); background: var(--dev-rail); padding: 14px;
  font-family: var(--dev-font); font-size: 12px; color: var(--dev-text); -webkit-font-smoothing: antialiased; }
#ce-panel h4 { margin: 16px 0 8px; color: var(--dev-accent); font: 600 10px var(--dev-font); letter-spacing: 0.12em; text-transform: uppercase; }
#ce-panel h4 .ce-kind { color: var(--dev-dim); font-weight: 400; letter-spacing: 0; text-transform: none; margin-left: 6px; font-family: var(--dev-mono); }
.ce-sub { color: var(--dev-faint); font-size: 11px; margin: -2px 0 8px; }
.ce-shadow-tools { margin-bottom: 8px; }
.ce-shadow-tools button { font: 600 12px var(--dev-font); background: var(--dev-input-bg); color: var(--dev-muted); border: 1px solid var(--dev-input-border); border-radius: 6px; padding: 6px 12px; cursor: pointer; transition: border-color 0.14s ease, color 0.14s ease; }
.ce-shadow-tools button:hover { border-color: var(--dev-accent-border); color: var(--dev-text); }
.ce-shadow-tools button:disabled { opacity: 0.5; cursor: wait; }
#ce-stage {
  position: absolute; inset: 0; padding-right: 320px; box-sizing: border-box;
  background:
    radial-gradient(ellipse at 50% 72%, #1a1c30 0%, #10111c 70%),
    repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(139,124,246,0.05) 40px);
  overflow: hidden;
}
.ce-ground {
  position: absolute; left: 8%; right: 8%; bottom: 14%; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(45,212,191,0.5) 20%, rgba(45,212,191,0.5) 80%, transparent);
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
  border: 2px solid var(--dev-teal); background: rgba(45,212,191,0.28); z-index: 2; pointer-events: none;
}
.ce-meta { position: absolute; left: 14px; top: 14px; color: var(--dev-faint); font: 400 10px var(--dev-mono); z-index: 3; pointer-events: none; }
.ce-missing { display: grid; place-items: center; height: 100%; color: var(--dev-faint); }
.ce-pick { display: grid; gap: 10px; margin-bottom: 4px; }
.ce-pick label { display: grid; gap: 4px; color: var(--dev-dim); font-size: 10px; letter-spacing: 0.04em; }
.ce-pick label em { color: var(--dev-accent-light); font-style: normal; font-family: var(--dev-mono); }
.ce-pick select { width: 100%; font: 400 12px var(--dev-mono); color: var(--dev-text); background: var(--dev-input-bg); border: 1px solid var(--dev-input-border); border-radius: 6px; padding: 6px 9px; }
.ce-pick input[type=range] { width: 100%; accent-color: var(--dev-accent); }
.ce-check { display: flex !important; align-items: center; gap: 8px; grid-template-columns: none !important; color: var(--dev-muted); font-size: 11px; }
.ce-check input { width: auto; accent-color: var(--dev-accent); }
.ce-size { display: grid; grid-template-columns: auto 1fr; gap: 6px 10px; padding: 10px; border: 1px solid var(--dev-border); border-radius: 8px; background: var(--dev-panel); color: var(--dev-dim); align-items: center; }
.ce-size b { color: var(--dev-text); font-family: var(--dev-mono); }
.ce-size-note { grid-column: 1 / -1; font-size: 10px; color: var(--dev-faint); font-family: var(--dev-mono); }
.ce-fields { display: grid; gap: 7px; }
.ce-row { display: grid; grid-template-columns: 72px 1fr 58px 18px; gap: 8px; align-items: center; color: var(--dev-dim); font-size: 11px; margin: 0; }
.ce-row.on span { color: var(--dev-accent-light); }
.ce-row input[type=range] { accent-color: var(--dev-accent); }
.ce-row input[type=number] { width: 58px; font: 400 11px var(--dev-mono); background: var(--dev-input-bg); color: var(--dev-text); border: 1px solid var(--dev-input-border); border-radius: 5px; padding: 3px 5px; text-align: right; }
.ce-row button { background: var(--dev-input-bg); color: var(--dev-pink); border: 1px solid var(--dev-input-border); border-radius: 5px; cursor: pointer; padding: 0; }
.ce-row button:hover { border-color: var(--dev-red); }
.ce-aim-row { display: grid; grid-template-columns: 72px 1fr 88px 18px; gap: 8px; align-items: center; color: var(--dev-dim); font-size: 11px; margin: 0; }
.ce-aim-row.on > span:first-child { color: var(--dev-accent-light); }
.ce-aim-row input[type=range] { accent-color: var(--dev-teal); }
.ce-aim-row select { width: 100%; font: 400 11px var(--dev-mono); background: var(--dev-input-bg); color: var(--dev-text); border: 1px solid var(--dev-input-border); border-radius: 5px; padding: 3px 5px; }
.ce-aim-row input[type=color] { width: 100%; height: 28px; padding: 0; cursor: pointer; background: var(--dev-input-bg); border: 1px solid var(--dev-input-border); border-radius: 5px; }
.ce-aim-pair { display: grid; grid-template-columns: 1fr 58px; gap: 6px; align-items: center; }
.ce-aim-pair input[type=number] { width: 58px; font: 400 11px var(--dev-mono); background: var(--dev-input-bg); color: var(--dev-text); border: 1px solid var(--dev-input-border); border-radius: 5px; padding: 3px 5px; text-align: right; }
.ce-aim-row button { background: var(--dev-input-bg); color: var(--dev-pink); border: 1px solid var(--dev-input-border); border-radius: 5px; cursor: pointer; padding: 0; }
.ce-actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
.ce-actions button { font: 600 12px var(--dev-font); background: var(--dev-input-bg); color: var(--dev-muted); border: 1px solid var(--dev-input-border); border-radius: 6px; padding: 7px 14px; cursor: pointer; transition: border-color 0.14s ease, color 0.14s ease; }
.ce-actions button:hover { border-color: var(--dev-accent-border); color: var(--dev-text); }
.ce-actions button#ce-save { border: 0; color: #fff; font-weight: 600; background: linear-gradient(90deg, #8b7cf6, #6d5ce8); }
.ce-actions button#ce-save:hover { filter: brightness(1.08); color: #fff; }
.ce-hint { color: var(--dev-faint); font-size: 10px; line-height: 1.6; margin-top: 16px; font-family: var(--dev-mono); }
.ce-hint code { color: var(--dev-accent-light); }
@media (max-width: 800px) {
  #ce-panel { width: 100%; top: auto; height: 42vh; border-left: 0; border-top: 1px solid var(--dev-border); }
  #ce-stage { padding-right: 0; padding-bottom: 42vh; }
}
`;

export function initCharEditor() {
  setDevTitle('Character editor');
  initStage();
  initMesh();
  state.meta = clone(charMetaTable());
  state.aimDefault = { ...CHAR_AIM_DEFAULT };
  _setCharMeta(state.meta, { silent: true });
  state.id = idFromUrl();
  syncAimScopes(state.id);
  pushUrl();
  mountChrome();
  paintActor();
  renderPanel();
  // File save / external edit → soft-apply without wiping unsaved slider work
  onCharMetaChange(() => {
    if (state.dirty) return;
    state.meta = clone(charMetaTable());
    state.aimDefault = { ...CHAR_AIM_DEFAULT };
    syncAimScopes(state.id);
    paintActor();
    renderPanel();
    syncDirty();
  });
  window.__charEditor = {
    id: () => state.id,
    meta: () => entryOf(state.id),
    shadow: () => shadowOf(state.id),
    layout: () => layoutOf(state.id),
    mesh: () => meshOf(state.id),
    aim: () => aimOf(state.id),
    aimDefault: () => ({ ...state.aimDefault }),
    actor: () => actorParams(state.id),
  };
}
