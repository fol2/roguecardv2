// Content Manager — DEV-only schema-driven joined editor (?contentedit=1).
// Forms and ownership come from CONTENT_SCHEMAS + compiled development provenance.

import {
  CONTENT_REGISTRATION_MANIFEST as DEVELOPMENT_CONTENT_REGISTRATION_MANIFEST,
} from '../packs/compiled/development.js';
import {
  compileContentRegistrations, doctorContentRegistrations,
} from '../content-registration.js';
import { STATIC_REFERENCE_CATALOGUES } from '../content-resources.js';
import { esc, ensureDevStyle, renderDevRail, renderDevTopbar, mountRailDrawer, setDevTitle } from './chrome.js';
import {
  EDITABLE_DOMAINS, CONTENT_SAVE_VERSION,
  DOMAIN_LOCALE_EXPORT, fieldOwnership, splitBySource, joinBySource,
} from './content-serialize.js';

const MANAGER_STYLE = `
[data-content-manager] .dev-scroll { display: grid; gap: 14px; align-content: start; max-width: 960px; }
[data-content-manager] .dev-panel { padding: 14px 16px; }
[data-content-manager] .dev-panel > h2 { margin: 0 0 12px; font-size: 13px; font-weight: 600;
  letter-spacing: 0.02em; color: var(--dev-text); display: flex; gap: 8px; align-items: center; }
[data-content-manager] .dev-panel > h2 .dev-diamond { color: var(--dev-accent); font-size: 11px; }
[data-content-manager] .cm-picker { display: flex; gap: 16px; flex-wrap: wrap; }
[data-content-manager] .cm-picker label { display: flex; flex-direction: column; gap: 4px;
  font: 600 10px var(--dev-font); letter-spacing: 0.1em; text-transform: uppercase; color: var(--dev-faint); }
[data-content-manager] select, [data-content-manager] input, [data-content-manager] textarea {
  font: 400 12px var(--dev-mono); color: var(--dev-text); background: var(--dev-input-bg);
  border: 1px solid var(--dev-input-border); border-radius: 6px; padding: 6px 10px; outline: none;
  width: 100%; box-sizing: border-box;
}
[data-content-manager] select:focus, [data-content-manager] input:focus, [data-content-manager] textarea:focus { border-color: var(--dev-accent); }
[data-content-manager] textarea { min-height: 72px; resize: vertical; white-space: pre; }
[data-content-manager] .cm-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 18px; }
[data-content-manager] [data-manager-field] { margin: 0; }
[data-content-manager] [data-manager-field][data-extension="1"],
[data-content-manager] [data-manager-field]:has(textarea) { grid-column: 1 / -1; }
[data-content-manager] [data-manager-field] > label { display: flex; align-items: center; gap: 7px;
  margin: 0 0 5px; font: 500 11px var(--dev-font); color: var(--dev-muted); }
[data-content-manager] [data-manager-source] { display: inline-flex; padding: 1px 6px; border-radius: 4px;
  font: 400 9px var(--dev-mono); border: 1px solid var(--dev-input-border); color: var(--dev-muted); }
[data-content-manager] [data-manager-source="pack"] { color: var(--dev-accent-light); border-color: var(--dev-accent-border); }
[data-content-manager] [data-manager-source="locale"] { color: var(--dev-teal); border-color: var(--dev-teal-border); }
[data-content-manager] [data-manager-source="extension"] { color: var(--dev-pink); border-color: #59394a; }
[data-content-manager] [data-manager-field][data-extension="1"] textarea { border-style: dashed; color: var(--dev-dim); background: #171825; }
[data-content-manager] [data-manager-schema-field] { display: inline-flex; padding: 2px 7px; border-radius: 5px;
  font: 400 9px var(--dev-mono); border: 1px solid var(--dev-input-border); color: var(--dev-muted); margin: 0; }
[data-content-manager] [data-manager-schema-field][data-source="locale"] { color: var(--dev-teal); border-color: var(--dev-teal-border); }
[data-content-manager] [data-manager-schema-field][data-source="pack"] { color: var(--dev-accent-light); border-color: var(--dev-accent-border); }
[data-content-manager] .cm-chips { display: flex; flex-wrap: wrap; gap: 4px; }
[data-content-manager] [data-manager-registration] { margin: 8px 0 0; padding: 8px 10px; border-radius: 8px;
  background: var(--dev-input-bg); border: 1px solid var(--dev-input-border); font-size: 12px; color: var(--dev-dim); }
[data-content-manager] [data-manager-registration] strong { font: 700 11px var(--dev-mono); color: var(--dev-accent-light); }
[data-content-manager] [data-manager-registration] span,
[data-content-manager] [data-manager-provenance] .cm-meta span { font-family: var(--dev-mono); color: var(--dev-muted); }
[data-content-manager] .cm-meta { font: 400 11px var(--dev-mono); color: var(--dev-dim); }
[data-content-manager] [data-manager-warnings] { color: var(--dev-amber); font-size: 12px;
  white-space: pre-wrap; margin: 0 0 12px; }
[data-content-manager] [data-manager-warnings]:empty { display: none; }
[data-content-manager] button[data-manager-save] { margin-top: 14px; border: none; border-radius: 6px;
  padding: 8px 18px; font: 600 12px var(--dev-font); color: #fff; cursor: pointer;
  background: linear-gradient(90deg, #8b7cf6, #6d5ce8); }
[data-content-manager] button[data-manager-save]:hover { filter: brightness(1.08); }
[data-content-manager] button[data-manager-save]:disabled { opacity: 0.45; cursor: not-allowed; }
[data-content-manager] [data-manager-status] { margin-top: 10px; font: 400 12px var(--dev-mono); }
[data-content-manager] [data-manager-status][data-ok="1"] { color: var(--dev-teal); }
[data-content-manager] [data-manager-status][data-ok="0"] { color: var(--dev-red); }
[data-content-manager] .cm-note { font: 400 10px var(--dev-mono); color: var(--dev-faint); margin: 14px 0 0; }
[data-content-manager] .cm-note span { color: var(--dev-muted); }
`;

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function localeTableFor(domain, localeContent, order) {
  const key = DOMAIN_LOCALE_EXPORT[domain];
  const rows = localeContent[key] || {};
  if (domain === 'themes') {
    const out = {};
    for (let index = 0; index < order.length; index++) {
      out[order[index]] = clone(rows[index] ?? rows[String(index)] ?? {});
    }
    return out;
  }
  const out = {};
  for (const id of order) out[id] = clone(rows[id] || {});
  return out;
}

function parseFieldValue(kind, raw) {
  if (kind === 'number') {
    if (raw.trim() === '') return null;
    const n = Number(raw);
    if (!Number.isFinite(n)) throw new Error(`invalid number: ${raw}`);
    return n;
  }
  if (kind === 'object' || kind === 'array') return JSON.parse(raw);
  return raw;
}

function formatFieldValue(kind, value) {
  if (kind === 'object' || kind === 'array') return JSON.stringify(value ?? (kind === 'array' ? [] : {}), null, 2);
  if (value == null) return '';
  return String(value);
}

export async function initContentManager() {
  const compiled = compileContentRegistrations(DEVELOPMENT_CONTENT_REGISTRATION_MANIFEST, {
    id: 'content-manager',
    resources: STATIC_REFERENCE_CATALOGUES,
    localeToken: 'en',
    fixtures: ['sample'],
  });
  const doctor = doctorContentRegistrations(DEVELOPMENT_CONTENT_REGISTRATION_MANIFEST, {
    id: 'content-manager-doctor',
    fixtures: ['sample'],
  });
  const { provenance } = compiled;
  // Core mechanics/locale only — Manager edits core, not sample.
  const coreReg = DEVELOPMENT_CONTENT_REGISTRATION_MANIFEST.registrations
    .find((row) => row.id === 'core');
  const coreMechanics = coreReg.mechanics;
  const coreLocale = coreReg.locales.en;

  const qs = new URLSearchParams(location.search);
  let domain = EDITABLE_DOMAINS.includes(qs.get('domain')) ? qs.get('domain') : 'cards';
  let entryId = qs.get('id') || Object.keys(coreMechanics[domain] || {})[0];

  ensureDevStyle();
  setDevTitle('Content Manager');
  const style = document.createElement('style');
  style.textContent = MANAGER_STYLE;
  document.head.appendChild(style);

  const host = document.getElementById('stage') || document.body;
  const root = document.createElement('div');
  root.setAttribute('data-content-manager', '1');
  root.className = 'dev-shell';
  host.appendChild(root);

  const drawer = mountRailDrawer('contentedit');

  const state = {
    domain,
    entryId,
    mechanics: Object.fromEntries(EDITABLE_DOMAINS.map((d) => [d, clone(coreMechanics[d] || {})])),
    display: {},
    warnings: {},
  };
  for (const d of EDITABLE_DOMAINS) {
    const order = Object.keys(state.mechanics[d]);
    state.display[d] = localeTableFor(d, coreLocale, order);
    state.warnings[d] = {};
    for (const id of order) {
      const split = splitBySource(d, joinBySource(d, state.mechanics[d][id], state.display[d][id]));
      state.warnings[d][id] = split.warnings || [];
      // Preserve unknown extension keys already in mechanics.
      state.mechanics[d][id] = split.mechanics;
      state.display[d][id] = split.display;
    }
  }

  function writeQuery() {
    const url = new URL(location.href);
    url.searchParams.set('contentedit', '1');
    url.searchParams.set('domain', state.domain);
    url.searchParams.set('id', state.entryId);
    history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
  }

  function renderProvenance() {
    const rows = (provenance.registrations || []).map((row) => `
      <div data-manager-registration="${esc(row.id)}">
        <strong>${esc(row.id)}</strong>
        <div>mechanics <span data-manager-mechanics-pack>${esc(row.mechanicsPackId)}</span></div>
        <div>source <span data-manager-source-path>${esc(row.sourcePath || '—')}</span></div>
        <div>targets <span data-manager-targets>${esc(JSON.stringify(row.targets || {}))}</span></div>
      </div>`).join('');
    return `<section class="dev-panel" data-manager-provenance>
      <h2><span class="dev-diamond">◆</span> Registration provenance</h2>
      <div class="cm-meta">target: <span>${esc(provenance.target)}</span> · ids: <span>${esc((provenance.registrationIds || []).join(', '))}</span></div>
      ${rows}
    </section>`;
  }

  function renderSchema() {
    const fields = fieldOwnership(state.domain).map((field) =>
      `<span data-manager-schema-field data-domain="${esc(state.domain)}" data-field="${esc(field.name)}" data-source="${esc(field.source)}">${esc(state.domain)}.${esc(field.name)}:${esc(field.source)}</span>`).join('');
    return `<section class="dev-panel" data-manager-schema>
      <h2><span class="dev-diamond">◆</span> Schema field ownership</h2>
      <div class="cm-chips">${fields}</div>
    </section>`;
  }

  function renderForm() {
    const mech = state.mechanics[state.domain][state.entryId] || {};
    const disp = state.display[state.domain][state.entryId] || {};
    const joined = joinBySource(state.domain, mech, disp);
    const fields = fieldOwnership(state.domain).filter((f) => f.kind !== 'function');
    const known = new Set(fields.map((f) => f.name));
    const extensionKeys = Object.keys(joined).filter((key) => !known.has(key));
    const warnings = state.warnings[state.domain][state.entryId] || [];

    const fieldHtml = fields.map((field) => {
      const value = joined[field.name];
      const raw = formatFieldValue(field.kind, value);
      const control = (field.kind === 'object' || field.kind === 'array')
        ? `<textarea data-field="${esc(field.name)}" data-kind="${esc(field.kind)}" data-source="${esc(field.source)}">${esc(raw)}</textarea>`
        : `<input data-field="${esc(field.name)}" data-kind="${esc(field.kind)}" data-source="${esc(field.source)}" value="${esc(raw)}" />`;
      return `<div data-manager-field="${esc(field.name)}">
        <label>${esc(field.name)} <span data-manager-source="${esc(field.source)}">${esc(field.source)}</span></label>
        ${control}
      </div>`;
    }).join('');

    const extHtml = extensionKeys.map((key) => `
      <div data-manager-field="${esc(key)}" data-extension="1">
        <label>${esc(key)} <span data-manager-source="extension">extension</span> · read-only</label>
        <textarea data-field="${esc(key)}" data-kind="raw" data-source="extension" readonly>${esc(JSON.stringify(joined[key], null, 2))}</textarea>
      </div>`).join('');

    return `
      <section class="dev-panel" data-manager-form>
        <h2><span class="dev-diamond">◆</span> Edit ${esc(state.domain)}.${esc(state.entryId)}</h2>
        <div data-manager-warnings>${warnings.map(esc).join('\n')}</div>
        <div class="cm-fields">${fieldHtml}${extHtml}</div>
        <button type="button" data-manager-save>Save</button>
        <div data-manager-status></div>
        <p class="cm-note">Saving writes core mechanics + en locale via <span>/__content-save</span> · pack/locale split is automatic</p>
      </section>`;
  }

  function render() {
    const order = Object.keys(state.mechanics[state.domain]);
    if (!order.includes(state.entryId)) state.entryId = order[0];
    writeQuery();
    const status = `<span class="dev-chip ${doctor.report.ok ? 'is-ok' : 'is-warn'}">doctor ${doctor.report.ok ? 'ok' : 'problems'}</span>`;
    root.innerHTML = `
      ${renderDevRail({ activeParam: 'contentedit' })}
      <div class="dev-main">
        ${renderDevTopbar({ title: 'Content Manager', param: 'contentedit', status, menu: true })}
        <div class="dev-scroll">
          <section class="dev-panel">
            <div class="cm-picker">
              <label>Domain
                <select data-manager-domain>
                  ${EDITABLE_DOMAINS.map((d) => `<option value="${esc(d)}"${d === state.domain ? ' selected' : ''}>${esc(d)}</option>`).join('')}
                </select>
              </label>
              <label>Entry
                <select data-manager-entry>
                  ${order.map((id) => `<option value="${esc(id)}"${id === state.entryId ? ' selected' : ''}>${esc(id)}</option>`).join('')}
                </select>
              </label>
            </div>
          </section>
          ${renderForm()}
          ${renderSchema()}
          ${renderProvenance()}
        </div>
      </div>
    `;

    root.querySelector('[data-dev-menu]').onclick = () => drawer.toggle();
    root.querySelector('[data-manager-domain]').onchange = (event) => {
      state.domain = event.target.value;
      state.entryId = Object.keys(state.mechanics[state.domain])[0];
      render();
    };
    root.querySelector('[data-manager-entry]').onchange = (event) => {
      state.entryId = event.target.value;
      render();
    };
    root.querySelector('[data-manager-save]').onclick = () => save();
  }

  async function save() {
    const status = root.querySelector('[data-manager-status]');
    const fields = [...root.querySelectorAll('[data-manager-form] input[data-field], [data-manager-form] textarea[data-field]')];
    const nextJoined = joinBySource(
      state.domain,
      state.mechanics[state.domain][state.entryId],
      state.display[state.domain][state.entryId],
    );
    try {
      for (const el of fields) {
        if (el.getAttribute('data-source') === 'extension') continue;
        const name = el.getAttribute('data-field');
        const kind = el.getAttribute('data-kind');
        nextJoined[name] = parseFieldValue(kind, el.value);
      }
    } catch (error) {
      status.dataset.ok = '0';
      status.textContent = String(error?.message ?? error);
      return;
    }
    const split = splitBySource(state.domain, nextJoined);
    state.mechanics[state.domain][state.entryId] = split.mechanics;
    state.display[state.domain][state.entryId] = split.display;
    state.warnings[state.domain][state.entryId] = split.warnings || [];

    const order = Object.keys(state.mechanics[state.domain]);
    const payload = {
      v: CONTENT_SAVE_VERSION,
      packId: 'core',
      locale: 'en',
      domain: state.domain,
      order,
      mechanics: state.mechanics[state.domain],
      display: state.display[state.domain],
    };
    status.textContent = 'saving…';
    try {
      const response = await fetch('/__content-save', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await response.json();
      if (!response.ok || !json.ok) {
        status.dataset.ok = '0';
        status.textContent = (json.problems || ['save failed']).join('; ');
        return;
      }
      status.dataset.ok = '1';
      status.textContent = `saved ✓ mechanics=${json.wrote?.mechanics ? 'yes' : 'no'} locale=${json.wrote?.locale ? 'yes' : 'no'}`;
    } catch (error) {
      status.dataset.ok = '0';
      status.textContent = String(error?.message ?? error);
    }
  }

  render();
  window.__contentManager = {
    domain: () => state.domain,
    entryId: () => state.entryId,
    provenance: () => provenance,
    save,
  };
}
