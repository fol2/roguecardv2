// Content Lab — DEV-only ephemeral scenario sandbox (?lab=1).
// Stages through newRun + bindRunContent + probe drivers; never touches durable saves.

import {
  encodeLabScenario, decodeLabScenario, validateLabScenario,
  encodeReplayDescriptor, decodeReplayDescriptor,
} from './lab-scenario.js';
import { esc, ensureDevStyle, mountRailDrawer, setDevTitle } from './chrome.js';
import { bindRunContent, contentViewFor, themeForRun } from '../ui/content.js';
import { renderReplayPreview, supportedReplayKinds } from './replay-preview.js';


const LAB_STYLE = `

[data-lab-root] {
  position: absolute; inset: 0; z-index: 80; pointer-events: none;
  font-family: var(--dev-font); color: var(--dev-text); -webkit-font-smoothing: antialiased;
}
[data-lab-root] * { box-sizing: border-box; }
[data-lab-chrome] {
  position: absolute; top: 0; left: 0; right: 0; z-index: 2; pointer-events: auto;
  display: flex; align-items: center; gap: 12px; height: 48px; margin: 0; padding: 0 16px;
  background: var(--dev-bg); border-bottom: 1px solid var(--dev-border);
}
[data-lab-chrome] .lab-title { font-size: 14px; font-weight: 700; color: var(--dev-text); }
[data-lab-chrome] .lab-param { font: 400 11px var(--dev-mono); color: var(--dev-faint); }
[data-lab-chrome] a[data-dev-home] {
  margin-left: auto; font-size: 12px; color: var(--dev-muted); text-decoration: none;
  transition: color 0.14s ease;
}
[data-lab-chrome] a[data-dev-home]:hover { color: var(--dev-accent-light); }
[data-lab-panel], [data-lab-god], [data-lab-trace], [data-lab-result-host],
[data-replay-preview-host] {
  pointer-events: auto;
}
[data-lab-panel] {
  position: absolute; top: 56px; left: 12px; width: min(300px, 42%);
  max-height: calc(100% - 68px); overflow: auto;
  background: var(--dev-rail); border: 1px solid var(--dev-border);
  padding: 14px; border-radius: 10px; font-size: 12px;
}
[data-lab-panel] h2 { margin: 0 0 4px; font-size: 10px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--dev-faint); }
[data-lab-panel] strong { display: block; margin: 12px 0 4px; font-size: 10px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--dev-accent); }
[data-lab-panel] label { display: block; margin: 6px 0; color: var(--dev-dim); font-size: 10px; letter-spacing: 0.04em; }
[data-lab-panel] select, [data-lab-panel] input[type="number"] {
  width: 100%; margin-top: 3px; font: 400 11px var(--dev-mono); color: var(--dev-text);
  background: var(--dev-input-bg); border: 1px solid var(--dev-input-border);
  border-radius: 6px; padding: 5px 8px;
}
[data-lab-panel] input[type="checkbox"] { width: auto; accent-color: var(--dev-accent); }
[data-lab-panel] button {
  margin: 6px 6px 0 0; font: 600 12px var(--dev-font); color: var(--dev-muted);
  background: var(--dev-input-bg); border: 1px solid var(--dev-input-border);
  border-radius: 6px; padding: 6px 12px; cursor: pointer; transition: border-color 0.14s ease, color 0.14s ease;
}
[data-lab-panel] button:hover { border-color: var(--dev-accent-border); color: var(--dev-text); }
[data-lab-panel] button[data-lab-start] { border: 0; color: #fff; background: linear-gradient(90deg, #8b7cf6, #6d5ce8); }
[data-lab-panel] button[data-lab-start]:hover { filter: brightness(1.08); color: #fff; }
[data-lab-panel] button:disabled { opacity: 0.45; cursor: not-allowed; }
[data-lab-errors] { color: var(--dev-red); margin-top: 8px; white-space: pre-wrap; font: 400 11px var(--dev-mono); }
[data-lab-god] {
  position: absolute; top: 56px; right: 12px; width: 190px;
  background: var(--dev-rail); border: 1px solid var(--dev-border);
  padding: 12px; border-radius: 10px; font-size: 12px;
}
[data-lab-god] strong { display: block; margin-bottom: 8px; font-size: 10px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--dev-accent); }
[data-lab-god] label { display: flex; justify-content: space-between; align-items: center; gap: 8px; margin: 6px 0; color: var(--dev-dim); }
[data-lab-god] input, [data-lab-god] select {
  width: 80px; font: 400 11px var(--dev-mono); color: var(--dev-text);
  background: var(--dev-input-bg); border: 1px solid var(--dev-input-border); border-radius: 6px; padding: 3px 6px;
}
[data-lab-god] button {
  display: block; width: 100%; margin-top: 8px; font: 600 12px var(--dev-font); color: var(--dev-muted);
  background: var(--dev-input-bg); border: 1px solid var(--dev-input-border); border-radius: 6px; padding: 6px 10px; cursor: pointer;
}
[data-lab-god] button:hover { border-color: var(--dev-accent-border); color: var(--dev-text); }
[data-lab-trace] {
  position: absolute; bottom: 12px; left: 324px; right: 12px; height: 100px;
  background: var(--dev-panel); border: 1px solid var(--dev-border);
  padding: 8px 12px; overflow: auto; font-family: var(--dev-mono); font-size: 10px; line-height: 1.7; color: var(--dev-dim);
  border-radius: 10px; pointer-events: none; white-space: pre-wrap;
}
[data-replay-preview-host] {
  position: absolute; top: 40%; left: 50%; transform: translate(-50%, -50%);
  min-width: 160px; min-height: 40px; pointer-events: none;
}
[data-lab-result-host] {
  position: absolute; top: 28%; left: 50%; transform: translateX(-50%);
  background: var(--dev-panel); border: 1px solid var(--dev-accent-border);
  padding: 12px 18px; border-radius: 10px; text-align: center; color: var(--dev-text);
}
.lab-replay-card-flight { opacity: 0; transform: translateY(8px); transition: 280ms ease; }
.lab-replay-card-flight.lab-replay-run { opacity: 1; transform: none; }
.lab-replay-card {
  background: linear-gradient(160deg, #241f38, #12131c);
  border: 1px solid var(--dev-accent-border); padding: 16px 20px; border-radius: 10px;
  text-align: center; color: var(--dev-accent-light); pointer-events: none;
}
`;

function optionsHtml(ids, selected) {
  return ids.map((id) =>
    `<option value="${esc(id)}"${id === selected ? ' selected' : ''}>${esc(id)}</option>`).join('');
}

function defaultModel(content) {
  const aspects = (content.aspects || []).map((a) => a.id);
  const themes = content.themeOrder?.length
    ? [...content.themeOrder]
    : Object.keys(content.themes || {});
  const omens = Object.keys(content.omens || {});
  const enemies = Object.keys(content.enemies || {});
  const cards = Object.keys(content.cards || {});
  const firstTheme = themes.find(() => true);
  const firstOmen = omens.find((id) => id === 'thinGlass') || omens.find(() => true);
  const firstAspect = aspects.find((id) => id === 'duskblade') || aspects.find(() => true);
  const deckIds = cards.includes('strike')
    ? ['strike', 'defend'].filter((id) => cards.includes(id))
    : cards.filter((_, i) => i < 2);
  return {
    mode: 'combat',
    seed: 1,
    aspectId: firstAspect,
    themeId: firstTheme,
    omenId: firstOmen,
    kind: 'normal',
    enemies: [],
    deck: deckIds.map((id) => ({ id, up: false })),
    hand: [],
  };
}

function combatKind(kind) {
  if (kind === 'elite' || kind === 'boss' || kind === 'monster') return kind;
  return 'normal';
}

function writeQuery(patch) {
  const url = new URL(location.href);
  for (const [key, value] of Object.entries(patch)) {
    if (value == null || value === '') url.searchParams.delete(key);
    else url.searchParams.set(key, value);
  }
  history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
}

export async function initLab() {
  const { createDevRegistry: build } = await import('../packs/dev.js');
  const registry = build({ fixtures: ['sample'] });
  const content = registry.context;

  // Capture + freeze durable keys BEFORE importing ui/vigil — importing ui.js
  // evaluates loadVigil, which migrates non-JSON Lab sentinels to a real ledger.
  const durableKeys = {
    save: localStorage.getItem('spirebound_save_v2'),
    stats: localStorage.getItem('spirebound_stats_v1'),
    vigil: localStorage.getItem('spirebound_vigil_v2'),
  };
  const DURABLE_STORAGE = Object.freeze({
    spirebound_save_v2: durableKeys.save,
    spirebound_stats_v1: durableKeys.stats,
    spirebound_vigil_v2: durableKeys.vigil,
  });
  const rawSetItem = Storage.prototype.setItem;
  const rawRemoveItem = Storage.prototype.removeItem;
  function restoreDurableKey(key) {
    const value = DURABLE_STORAGE[key];
    if (value != null) rawSetItem.call(localStorage, key, value);
    else rawRemoveItem.call(localStorage, key);
  }
  Storage.prototype.setItem = function labFreezeSetItem(key, value) {
    if (this === localStorage && Object.prototype.hasOwnProperty.call(DURABLE_STORAGE, key)) {
      restoreDurableKey(key);
      return;
    }
    return rawSetItem.call(this, key, value);
  };
  Storage.prototype.removeItem = function labFreezeRemoveItem(key) {
    if (this === localStorage && Object.prototype.hasOwnProperty.call(DURABLE_STORAGE, key)) {
      restoreDurableKey(key);
      return;
    }
    return rawRemoveItem.call(this, key);
  };

  // Boot the normal stage/UI stack so probe drivers and combat renderers exist.
  const { initStage } = await import('../stage.js');
  const { initScene } = await import('../scene3d.js');
  const { initVfx } = await import('../vfx.js');
  const { initMesh } = await import('../mesh.js');
  const { initUI } = await import('../ui.js');
  initStage();
  initScene();
  initVfx();
  initMesh();
  // Must await: initUI is async (fonts + Pixi). Restoring before it finishes lets
  // late show('title') → syncVigil clobber combat and durable sentinels.
  await initUI();
  for (const key of Object.keys(DURABLE_STORAGE)) restoreDurableKey(key);

  const stage = document.getElementById('stage') || document.body;
  ensureDevStyle();
  setDevTitle('Content Lab');
  const style = document.createElement('style');
  style.textContent = LAB_STYLE;
  document.head.appendChild(style);

  const root = document.createElement('div');
  root.setAttribute('data-lab-root', '1');
  root.insertAdjacentHTML('afterbegin', `<header data-lab-chrome>
    <button type="button" class="dev-menu-btn" data-lab-menu title="Dev tools" aria-label="Dev tools">☰</button>
    <span class="lab-title">Content Lab</span><span class="lab-param">?lab=1</span>
    <span class="dev-chip is-accent" data-lab-status>editor</span>
    <a data-dev-home href="?dev=1">Dev Hub ↩</a>
  </header>`);
  stage.appendChild(root);

  const railDrawer = mountRailDrawer('lab');
  root.querySelector('[data-lab-menu]').addEventListener('click', () => railDrawer.toggle());
  function syncLabStatus() {
    const chip = root.querySelector('[data-lab-status]');
    if (!chip) return;
    const staged = root.getAttribute('data-lab-staged');
    chip.textContent = staged ? `sandbox staged · ${staged}` : 'editor';
    chip.classList.toggle('is-ok', !!staged);
    chip.classList.toggle('is-accent', !staged);
  }

  let model = defaultModel(content);
  let replayPublicationArmed = false;
  let hydratedReplay = null;
  let replayDisabledReason = null;
  let previewDispose = null;
  let staging = false;
  let formDirty = false;
  let lastErrors = [];
  let publishSeq = 0;

  function publishReplay(descriptor) {
    if (!replayPublicationArmed) return;
    if (!descriptor || descriptor.presentationId) return; // Lab codec only
    try {
      publishSeq += 1;
      const stamped = {
        ...descriptor,
        parameters: { ...(descriptor.parameters || {}), n: publishSeq },
      };
      const token = encodeReplayDescriptor(stamped);
      hydratedReplay = stamped;
      replayDisabledReason = null;
      writeQuery({ replay: token });
      syncReplayButton();
    } catch {
      /* ignore invalid sink payloads */
    }
  }

  const panel = document.createElement('aside');
  panel.setAttribute('data-lab-panel', '1');
  root.appendChild(panel);

  const god = document.createElement('aside');
  god.setAttribute('data-lab-god', '1');
  god.innerHTML = `<strong>God</strong>
    <label>HP <input data-lab-god-hp type="number" min="1" value="70"></label>
    <label>Energy <input data-lab-god-energy type="number" min="0" value="3"></label>
    <label>Embers <input data-lab-god-embers type="number" min="0" value="0"></label>
    <label>Add card
      <select data-lab-god-card>${optionsHtml(Object.keys(content.cards || {}), 'strike')}</select>
    </label>
    <button type="button" data-lab-god-apply>Apply</button>
    <button type="button" data-lab-god-add-card>Add card to hand</button>`;
  root.appendChild(god);

  const replayHost = document.createElement('div');
  replayHost.setAttribute('data-replay-preview-host', '1');
  const previewEl = document.createElement('div');
  previewEl.setAttribute('data-replay-preview', '1');
  replayHost.appendChild(previewEl);
  root.appendChild(replayHost);

  const resultHost = document.createElement('div');
  resultHost.setAttribute('data-lab-result-host', '1');
  resultHost.hidden = true;
  root.appendChild(resultHost);

  const tracePanel = document.createElement('div');
  tracePanel.setAttribute('data-lab-trace', '1');
  root.appendChild(tracePanel);

  function variantsFor(baseId) {
    const rows = [];
    for (const [id, variant] of Object.entries(content.variants || {})) {
      if (!variant) continue;
      if (baseId === 'shade' && /^ownShade[1-9]\d*$/.test(id) && variant.base === 'hero') {
        rows.push(id);
      } else if (variant.base === baseId) {
        rows.push(id);
      }
    }
    return rows;
  }

  function gatherForm() {
    const mode = panel.querySelector('[data-lab-mode]')?.value || 'combat';
    const seed = Number(panel.querySelector('[data-lab-seed]')?.value || 0);
    const aspectId = panel.querySelector('[data-lab-aspect]')?.value;
    const themeId = panel.querySelector('[data-lab-theme]')?.value;
    const omenId = panel.querySelector('[data-lab-omen]')?.value;
    const kind = panel.querySelector('[data-lab-kind]')?.value || 'normal';
    const enemies = [...panel.querySelectorAll('[data-lab-enemy-row]')].map((row, i) => {
      const id = row.querySelector(`[data-lab-enemy-id="${i}"]`)?.value;
      const variantRaw = row.querySelector(`[data-lab-enemy-variant="${i}"]`)?.value;
      return { id, variantId: variantRaw ? variantRaw : null };
    });
    const deck = [...panel.querySelectorAll('[data-lab-deck-row]')].map((row, i) => ({
      id: row.querySelector(`[data-lab-deck-id="${i}"]`)?.value,
      up: row.querySelector(`[data-lab-deck-up="${i}"]`)?.checked === true,
    }));
    const hand = [...panel.querySelectorAll('[data-lab-hand-row]')].map((row, i) => ({
      id: row.querySelector(`[data-lab-hand-id="${i}"]`)?.value,
      up: row.querySelector(`[data-lab-hand-up="${i}"]`)?.checked === true,
    }));
    return {
      v: 1, mode, seed, aspectId, themeId, omenId, kind, enemies, deck, hand,
    };
  }

  function renderEditor() {
    const aspects = (content.aspects || []).map((a) => a.id);
    const themes = content.themeOrder || Object.keys(content.themes || {});
    const omens = Object.keys(content.omens || {});
    const enemies = Object.keys(content.enemies || {});
    const cards = Object.keys(content.cards || {});
    const kinds = ['normal', 'elite', 'boss'];

    const enemyRows = model.enemies.map((row, i) => {
      const variants = variantsFor(row.id);
      return `<div data-lab-enemy-row="${i}">
        <label>Enemy ${i + 1}
          <select data-lab-enemy-id="${i}">${optionsHtml(enemies, row.id)}</select>
        </label>
        <label>Variant
          <select data-lab-enemy-variant="${i}">
            <option value="">(none)</option>
            ${optionsHtml(variants, row.variantId || '')}
          </select>
        </label>
        <button type="button" data-lab-enemy-remove="${i}">Remove</button>
      </div>`;
    }).join('');

    const deckRows = model.deck.map((row, i) => `<div data-lab-deck-row="${i}">
      <select data-lab-deck-id="${i}">${optionsHtml(cards, row.id)}</select>
      <label><input type="checkbox" data-lab-deck-up="${i}"${row.up ? ' checked' : ''}> up</label>
      <button type="button" data-lab-deck-remove="${i}">Remove</button>
    </div>`).join('');

    const handRows = model.hand.map((row, i) => `<div data-lab-hand-row="${i}">
      <select data-lab-hand-id="${i}">${optionsHtml(cards, row.id)}</select>
      <label><input type="checkbox" data-lab-hand-up="${i}"${row.up ? ' checked' : ''}> up</label>
      <button type="button" data-lab-hand-remove="${i}">Remove</button>
    </div>`).join('');

    panel.innerHTML = `<h2>Scenario</h2>
      <button type="button" data-lab-start>Start sandbox</button>
      <button type="button" data-lab-replay disabled data-disabled-reason="">Replay last beat</button>
      <button type="button" data-lab-trace-copy>Copy transcript</button>
      <label>Mode <select data-lab-mode>${optionsHtml(['combat', 'climb'], model.mode)}</select></label>
      <label>Seed <input data-lab-seed type="number" value="${esc(model.seed)}"></label>
      <label>Aspect <select data-lab-aspect>${optionsHtml(aspects, model.aspectId)}</select></label>
      <label>Theme <select data-lab-theme>${optionsHtml(themes, model.themeId)}</select></label>
      <label>Omen <select data-lab-omen>${optionsHtml(omens, model.omenId)}</select></label>
      <label>Combat kind <select data-lab-kind>${optionsHtml(kinds, model.kind)}</select></label>
      <div><strong>Enemies</strong>
        <button type="button" data-lab-enemy-add>Add enemy</button>
        ${enemyRows}
      </div>
      <div><strong>Deck</strong>
        <button type="button" data-lab-deck-add>Add card</button>
        <button type="button" data-lab-deck-clear>Clear</button>
        ${deckRows}
      </div>
      <div><strong>Hand</strong>
        <button type="button" data-lab-hand-add>Add card</button>
        <button type="button" data-lab-hand-clear>Clear</button>
        ${handRows}
      </div>
      <div data-lab-errors>${lastErrors.map((e) => esc(e.message || e)).join('\\n')}</div>`;

    syncReplayButton();
    bindEditorEvents();
  }

  function syncReplayButton() {
    const btn = panel.querySelector('[data-lab-replay]');
    if (!btn) return;
    const ready = !!hydratedReplay && !replayDisabledReason;
    btn.disabled = !ready;
    btn.setAttribute('data-disabled-reason', replayDisabledReason || (ready ? '' : 'missing-replay'));
  }

  function bindEditorEvents() {
    panel.querySelector('[data-lab-start]')?.addEventListener('click', () => {
      model = gatherForm();
      formDirty = false;
      startSandbox(model, { writeUrl: true, auto: false });
    });
    panel.querySelector('[data-lab-replay]')?.addEventListener('click', () => runReplayPreview());
    panel.querySelector('[data-lab-trace-copy]')?.addEventListener('click', async () => {
      const text = window.__probe?.behaviourTrace({ format: 'text' })?.text
        || JSON.stringify(window.__probe?.behaviourTrace()?.records || [], null, 2);
      try {
        await navigator.clipboard?.writeText(text);
      } catch { /* clipboard may be denied in some hosts */ }
    });
    panel.querySelector('[data-lab-enemy-add]')?.addEventListener('click', () => {
      model = gatherForm();
      if (model.enemies.length >= 4) return;
      const id = Object.keys(content.enemies || {})[0];
      model.enemies.push({ id, variantId: null });
      formDirty = true;
      renderEditor();
    });
    panel.querySelectorAll('[data-lab-enemy-remove]').forEach((btn) => {
      btn.addEventListener('click', () => {
        model = gatherForm();
        model.enemies.splice(Number(btn.getAttribute('data-lab-enemy-remove')), 1);
        formDirty = true;
        renderEditor();
      });
    });
    panel.querySelectorAll('[data-lab-enemy-id]').forEach((sel) => {
      sel.addEventListener('change', () => {
        model = gatherForm();
        const i = Number(sel.getAttribute('data-lab-enemy-id'));
        model.enemies[i].variantId = null;
        formDirty = true;
        renderEditor();
      });
    });
    panel.querySelector('[data-lab-deck-add]')?.addEventListener('click', () => {
      model = gatherForm();
      const id = Object.keys(content.cards || {})[0];
      model.deck.push({ id, up: false });
      formDirty = true;
      renderEditor();
    });
    panel.querySelector('[data-lab-deck-clear]')?.addEventListener('click', () => {
      model = gatherForm();
      model.deck = [];
      formDirty = true;
      renderEditor();
    });
    panel.querySelectorAll('[data-lab-deck-remove]').forEach((btn) => {
      btn.addEventListener('click', () => {
        model = gatherForm();
        model.deck.splice(Number(btn.getAttribute('data-lab-deck-remove')), 1);
        formDirty = true;
        renderEditor();
      });
    });
    panel.querySelector('[data-lab-hand-add]')?.addEventListener('click', () => {
      model = gatherForm();
      const id = Object.keys(content.cards || {})[0];
      model.hand.push({ id, up: false });
      formDirty = true;
      renderEditor();
    });
    panel.querySelector('[data-lab-hand-clear]')?.addEventListener('click', () => {
      model = gatherForm();
      model.hand = [];
      formDirty = true;
      renderEditor();
    });
    panel.querySelectorAll('[data-lab-hand-remove]').forEach((btn) => {
      btn.addEventListener('click', () => {
        model = gatherForm();
        model.hand.splice(Number(btn.getAttribute('data-lab-hand-remove')), 1);
        formDirty = true;
        renderEditor();
      });
    });
    panel.querySelectorAll('select, input').forEach((el) => {
      if (el.closest('[data-lab-start],[data-lab-replay]')) return;
      el.addEventListener('change', () => { formDirty = true; });
    });
  }

  god.querySelector('[data-lab-god-apply]')?.addEventListener('click', () => {
    const probe = window.__probe;
    if (!probe?.state()?.player) return;
    const hp = Number(god.querySelector('[data-lab-god-hp]').value);
    const energy = Number(god.querySelector('[data-lab-god-energy]').value);
    const embers = Number(god.querySelector('[data-lab-god-embers]').value);
    probe.setPlayerHp?.(hp);
    probe.setEnergy(energy);
    probe.setEmbers(embers);
  });
  god.querySelector('[data-lab-god-add-card]')?.addEventListener('click', () => {
    const id = god.querySelector('[data-lab-god-card]').value;
    const probe = window.__probe;
    const hand = probe.state()?.hand?.map((c) => c.id) || [];
    probe.forceHand([...hand, id]);
  });

  function runReplayPreview() {
    if (!hydratedReplay) return;
    if (previewDispose) {
      try { previewDispose(); } catch { /* ignore */ }
      previewDispose = null;
    }
    previewEl.replaceChildren();
    const span = window.__labTrace?.begin?.('presentation.replay-preview', {
      attributes: { kind: hydratedReplay.kind },
    }) || { finish: () => null };
    const result = renderReplayPreview(previewEl, hydratedReplay);
    if (!result.ok) {
      replayDisabledReason = result.reason;
      syncReplayButton();
      span.finish('failed', { reason: result.reason });
      return;
    }
    previewDispose = result.dispose;
    // Finish the trace only after Pixi settles (or fails with a durable stub).
    Promise.resolve(result.ready)
      .then((phase) => {
        if (phase === 'failed') span.finish('failed');
        else span.finish('settled');
      })
      .catch(() => span.finish('failed'));
  }

  function showLabResult(descriptor) {
    resultHost.hidden = false;
    const outcome = descriptor?.outcome || 'ready';
    resultHost.innerHTML = `<div data-lab-result="${esc(outcome)}">Lab ${esc(outcome)}</div>
      <div>${esc(descriptor?.contentId || '')}</div>`;
  }

  async function startSandbox(raw, { writeUrl, auto }) {
    if (staging) return;
    staging = true;
    lastErrors = [];
    root.removeAttribute('data-lab-staged');
    syncLabStatus();
    try {
      let validated;
      try {
        validated = validateLabScenario(raw, content);
      } catch (err) {
        lastErrors = err.problems || [{ message: err.message }];
        renderEditor();
        return;
      }
      const token = encodeLabScenario(validated);
      if (writeUrl) writeQuery({ scenario: token });
      model = {
        mode: validated.mode,
        seed: validated.seed,
        aspectId: validated.aspectId,
        themeId: validated.themeId,
        omenId: validated.omenId,
        kind: validated.kind,
        enemies: validated.enemies.map((r) => ({ ...r })),
        deck: validated.deck.map((r) => ({ ...r })),
        hand: validated.hand.map((r) => ({ ...r })),
      };
      renderEditor();

      const E = window.spirebound?.E || (await import('../engine.js'));
      const S = window.spirebound?.S;
      const show = window.spirebound?.show;
      const aspectIndex = content.aspects.findIndex((row) => row.id === validated.aspectId);
      const themeIndex = content.themeOrder.indexOf(validated.themeId);
      const run = E.newRun(validated.seed, {
        aspect: aspectIndex,
        ephemeral: true,
        content,
      });
      run.act = themeIndex;
      while (run.omens.length <= themeIndex) run.omens.push(null);
      run.omens[themeIndex] = validated.omenId;
      run.rngState = validated.seed;
      run.map = E.genMap(run);
      run.player.deck = validated.deck.map((row) => E.makeCard(run, row.id, row.up));
      bindRunContent(run, content);
      if (contentViewFor(run)?.id !== content.id) {
        throw new Error('Lab content context id mismatch after bind');
      }
      S.run = run;
      S.cb = null;
      resultHost.hidden = true;

      const probe = window.__probe;
      if (validated.mode === 'climb') {
        show('map');
        await probe.settle();
      } else {
        const ids = validated.enemies.map((row) => row.variantId ?? row.id);
        if (!ids.length) throw new Error('combat mode requires at least one enemy');
        window.spirebound.startCombatUI(ids, combatKind(validated.kind));
        await probe.settle();
        if (validated.hand.length) {
          probe.forceHand(validated.hand.map((row) => row.id));
        }
        await probe.settle();
      }

      await probe.settle();
      replayPublicationArmed = true;
      root.setAttribute('data-lab-staged', validated.mode);
      syncLabStatus();
      syncReplayButton();
      void auto;
    } finally {
      staging = false;
    }
  }

  // Decode incoming replay before scenario hydration; do not auto-run.
  // Unsupported presentation kinds disable at hydrate (stable reason), not on click.
  const bootQuery = new URLSearchParams(location.search);
  replayPublicationArmed = false;
  if (bootQuery.has('replay')) {
    try {
      hydratedReplay = decodeReplayDescriptor(bootQuery.get('replay'));
      const kinds = supportedReplayKinds();
      if (!kinds.includes(hydratedReplay.kind)) {
        replayDisabledReason = 'unsupported-presentation';
      } else {
        replayDisabledReason = null;
        if (Number.isFinite(hydratedReplay.parameters?.n)) {
          publishSeq = Number(hydratedReplay.parameters.n);
        }
      }
    } catch {
      hydratedReplay = null;
      replayDisabledReason = 'invalid-replay';
    }
  }

  // Wire trace replay sink + Lab commands after UI probe exists.
  const waitProbe = async () => {
    for (let i = 0; i < 200; i += 1) {
      if (window.__probe?.settle && window.spirebound?.E) return;
      await new Promise((r) => setTimeout(r, 16));
    }
    throw new Error('Lab boot: probe unavailable');
  };
  await waitProbe();

  // Expose module trace for replay-preview spans.
  const { trace } = await import('../ui/context.js');
  window.__labTrace = trace;
  trace.setOnReplayable?.(publishReplay);

  const { bindUICommands } = await import('../ui/commands.js');
  bindUICommands({ showLabResult });

  // Extend probe with Lab-only readers/drivers (frozen merge).
  const baseProbe = window.__probe;
  const labProbe = Object.freeze({
    ...baseProbe,
    contentSummary() {
      const run = window.spirebound.S.run;
      if (!run) return null;
      const view = contentViewFor(run);
      const theme = themeForRun(run);
      return Object.freeze({
        contextId: view.id,
        themeId: theme?.id || view.themeOrder?.[run.act] || null,
        themeIndex: run.act,
        themeCount: (view.themeOrder || []).length,
      });
    },
    labThemeMeta() {
      const theme = themeForRun(window.spirebound.S.run);
      return Object.freeze({
        weather: theme?.weather || null,
        music: Object.freeze({ ...(theme?.music || {}) }),
      });
    },
    async labSelectFirstNode() {
      const E = window.spirebound.E;
      const S = window.spirebound.S;
      const avail = E.availableNodes(S.run);
      const node = avail[0];
      if (!node) throw new Error('no available map nodes');
      if (node.type !== 'monster' && node.type !== 'elite' && node.type !== 'boss') {
        node.type = 'monster';
      }
      const el = document.querySelector(`.mnode.avail[data-node="${node.id}"]`)
        || document.querySelector(`.mnode[data-node="${node.id}"]`);
      if (el) {
        el.dispatchEvent(new PointerEvent('pointerdown', {
          bubbles: true, cancelable: true, pointerId: 1, pointerType: 'mouse', isPrimary: true,
        }));
      } else {
        E.visitNode(S.run, node);
        const ids = model.enemies.map((row) => row.variantId ?? row.id);
        window.spirebound.startCombatUI(ids.length ? ids : [model.enemies[0]?.id].filter(Boolean), 'monster');
      }
      await baseProbe.settle();
      if (window.__probe.state().screen !== 'combat') {
        // Ensure the registered sample encounter when the map node was non-combat.
        const ids = model.enemies.map((row) => row.variantId ?? row.id);
        if (ids.length) {
          window.spirebound.startCombatUI(ids, 'monster');
          await baseProbe.settle();
        }
      }
      if (model.hand.length) baseProbe.forceHand(model.hand.map((r) => r.id));
      await baseProbe.settle();
    },
    setPlayerHp(hp) {
      baseProbe.setPlayerHp?.(hp);
    },
    async labForceOutcome(outcome) {
      const S = window.spirebound.S;
      const E = window.spirebound.E;
      const run = S.run;
      if (!run) return;
      const { createRunEffects } = await import('../ui/run-effects.js');
      const Vigil = await import('../vigil.js');
      const effects = createRunEffects({ engine: E, vigil: Vigil });
      effects.journalRunEnd(run, outcome);
      const result = effects.finaliseRunEnd(run, {
        revealThreshold: E.sealedSummitShardThreshold?.(run) ?? 0,
        persist: (action) => action(),
        onPersistenceFailure: () => {},
        onFinalised: () => {},
      });
      S.cb = null;
      showLabResult(result?.kind === 'lab-result' ? result : {
        kind: 'lab-result', outcome, contentId: content.id, accepted: true, ephemeral: true,
      });
    },
  });
  window.__probe = labProbe;

  // Refresh transcript periodically while Lab is open.
  setInterval(() => {
    try {
      const text = window.__probe?.behaviourTrace({ format: 'text' });
      tracePanel.textContent = text?.text || '';
    } catch {
      /* ignore */
    }
  }, 500);

  renderEditor();
  // Interactivity signal for tests/tooling: the launcher chrome exists and
  // window.__probe is the Lab probe. [data-lab-root] alone appears earlier,
  // before the context/commands imports resolve.
  root.setAttribute('data-lab-ready', '1');

  if (bootQuery.has('scenario')) {
    try {
      const decoded = decodeLabScenario(bootQuery.get('scenario'));
      const validated = validateLabScenario(decoded, content);
      model = {
        mode: validated.mode,
        seed: validated.seed,
        aspectId: validated.aspectId,
        themeId: validated.themeId,
        omenId: validated.omenId,
        kind: validated.kind,
        enemies: validated.enemies.map((r) => ({ ...r })),
        deck: validated.deck.map((r) => ({ ...r })),
        hand: validated.hand.map((r) => ({ ...r })),
      };
      renderEditor();
      await startSandbox(validated, { writeUrl: false, auto: true });
    } catch (err) {
      lastErrors = err.problems || [{ message: err.message }];
      renderEditor();
    }
  } else {
    // No scenario: editor only; explicit Start required.
    syncReplayButton();
  }

  void formDirty;
}
