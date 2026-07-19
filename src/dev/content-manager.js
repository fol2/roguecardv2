// Content Manager — DEV-only schema-driven joined editor (?contentedit=1).
// Forms and ownership come from CONTENT_SCHEMAS + compiled development provenance.

import {
  CONTENT_REGISTRATION_MANIFEST as DEVELOPMENT_CONTENT_REGISTRATION_MANIFEST,
} from '../packs/compiled/development.js';
import {
  compileContentRegistrations, doctorContentRegistrations,
} from '../content-registration.js';
import { STATIC_REFERENCE_CATALOGUES } from '../content-resources.js';
import { iconSvg } from '../art.js';
import { ensureDevChromeStyle, renderDevChrome } from './chrome.js';
import {
  EDITABLE_DOMAINS, CONTENT_SAVE_VERSION,
  DOMAIN_LOCALE_EXPORT, fieldOwnership, splitBySource, joinBySource,
} from './content-serialize.js';

const MANAGER_STYLE = `
[data-content-manager] {
  position: absolute; inset: 0; z-index: 80; overflow: auto;
  background: linear-gradient(165deg, #1a1410 0%, #0e0b09 55%, #16110d 100%);
  color: #f2e8d5; font-family: Cinzel, serif; padding: 16px 18px 40px;
}
[data-content-manager] * { box-sizing: border-box; }
[data-content-manager] h1 { margin: 0 0 8px; font-size: 20px; letter-spacing: 0.08em; display: flex; gap: 8px; align-items: center; }
[data-content-manager] h2 { margin: 16px 0 8px; font-size: 14px; letter-spacing: 0.06em; color: #d4af78; }
[data-content-manager] label { display: block; margin: 6px 0 2px; font-size: 12px; }
[data-content-manager] select, [data-content-manager] input, [data-content-manager] textarea {
  width: min(520px, 100%); background: #1c1713; color: #f2e8d5;
  border: 1px solid #5a4a38; padding: 4px 6px; font-family: ui-monospace, monospace; font-size: 12px;
}
[data-content-manager] textarea { min-height: 64px; }
[data-content-manager] button {
  margin: 8px 6px 0 0; background: #3a2c1f; color: #f2e8d5;
  border: 1px solid #8a6a3e; padding: 6px 12px; cursor: pointer;
}
[data-content-manager] button:disabled { opacity: 0.45; cursor: not-allowed; }
[data-manager-registration] {
  font-size: 12px; margin: 4px 0; padding: 6px 8px;
  border: 1px solid rgba(212,175,120,0.22); background: rgba(0,0,0,0.2);
}
[data-manager-schema-field] {
  display: inline-block; margin: 2px 4px 2px 0; padding: 1px 6px;
  border: 1px solid rgba(212,175,120,0.3); font-size: 10px;
}
[data-manager-schema-field][data-source="locale"] { color: #9ec9ff; }
[data-manager-schema-field][data-source="pack"] { color: #e8c98a; }
[data-manager-field] { margin: 8px 0; max-width: 560px; }
[data-manager-source] {
  margin-left: 6px; font-size: 10px; letter-spacing: 0.04em;
  padding: 1px 6px; border: 1px solid rgba(212,175,120,0.35);
}
[data-manager-source="pack"] { color: #e8c98a; }
[data-manager-source="locale"] { color: #9ec9ff; }
[data-manager-source="extension"] { color: #c9a0ff; }
[data-manager-warnings] { color: #ffcc8a; font-size: 12px; white-space: pre-wrap; }
[data-manager-status] { margin-top: 10px; font-size: 12px; }
[data-manager-status][data-ok="1"] { color: #b7e0a8; }
[data-manager-status][data-ok="0"] { color: #ff8a7a; }
`;

function esc(value) {
  return String(value).replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[ch]));
}

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

  const style = document.createElement('style');
  style.textContent = MANAGER_STYLE;
  document.head.appendChild(style);
  ensureDevChromeStyle();

  const host = document.getElementById('stage') || document.body;
  const root = document.createElement('div');
  root.setAttribute('data-content-manager', '1');
  host.appendChild(root);

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
    return `<section data-manager-provenance>
      <h2>${iconSvg('lantern', 16)} Registration provenance</h2>
      <div>target: ${esc(provenance.target)} · ids: ${esc((provenance.registrationIds || []).join(', '))}</div>
      ${rows}
    </section>`;
  }

  function renderSchema() {
    const fields = fieldOwnership(state.domain).map((field) =>
      `<span data-manager-schema-field data-domain="${esc(state.domain)}" data-field="${esc(field.name)}" data-source="${esc(field.source)}">${esc(state.domain)}.${esc(field.name)}:${esc(field.source)}</span>`).join('');
    return `<section data-manager-schema>
      <h2>${iconSvg('cards', 16)} Schema field ownership</h2>
      ${fields}
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
        <label>${esc(key)} <span data-manager-source="extension">extension</span></label>
        <textarea data-field="${esc(key)}" data-kind="raw" data-source="extension" readonly>${esc(JSON.stringify(joined[key], null, 2))}</textarea>
      </div>`).join('');

    return `
      <section data-manager-form>
        <h2>${iconSvg('menu', 16)} Edit ${esc(state.domain)}.${esc(state.entryId)}</h2>
        <div data-manager-warnings>${warnings.map(esc).join('\n')}</div>
        ${fieldHtml}
        ${extHtml}
        <button type="button" data-manager-save>Save</button>
        <div data-manager-status></div>
      </section>`;
  }

  function render() {
    const order = Object.keys(state.mechanics[state.domain]);
    if (!order.includes(state.entryId)) state.entryId = order[0];
    writeQuery();
    root.innerHTML = `
      ${renderDevChrome({ title: 'Content Manager' })}
      <p>Schema-driven core editor · cards / relics / potions / themes · doctor ok=${doctor.report.ok ? 'yes' : 'no'}</p>
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
      ${renderProvenance()}
      ${renderSchema()}
      ${renderForm()}
      <p><a href="?dev=1">dev shell</a> · <a href="?dashboard=1">doctor</a> · <a href="?">game</a></p>
    `;

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
