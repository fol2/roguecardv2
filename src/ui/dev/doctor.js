// Content doctor dashboard — DEV-only thin view over doctorContentRegistrations (?dashboard=1).
// Uses the compiled development manifest + Lab fixture selection; never owns a pack list.

import {
  doctorContentRegistrations,
} from '../../content-registration.js';
import {
  CONTENT_REGISTRATION_MANIFEST as DEVELOPMENT_CONTENT_REGISTRATION_MANIFEST,
} from '../../packs/compiled/development.js';
import { STATIC_REFERENCE_CATALOGUES } from '../../content-resources.js';
import { CONTENT_SCHEMAS, formatContentReport, MERGE_POLICIES } from '../../registry.js';
import { iconSvg } from '../../art.js';

const ASSET_MODULES = import.meta.glob(
  ['../../assets/*/*.{png,jpg,jpeg,webp}'],
  { eager: true, query: '?url', import: 'default' },
);

function liveAssetManifest() {
  const keys = new Set();
  for (const path of Object.keys(ASSET_MODULES)) {
    const match = path.match(/\/assets\/([^/]+)\/([^/]+)\.(?:png|jpg|jpeg|webp)$/i);
    if (match) keys.add(`${match[1]}/${match[2]}`);
  }
  return keys;
}

function esc(value) {
  return String(value).replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[ch]));
}

function linkHref(route, domain, id) {
  const q = new URLSearchParams();
  q.set(route, '1');
  if (domain) q.set('domain', domain);
  if (id) q.set('id', id);
  return `?${q.toString()}`;
}

function badgeHtml(name, badge) {
  const status = badge?.status || 'not-applicable';
  return `<span class="doctor-badge" data-badge="${esc(name)}" data-status="${esc(status)}">${esc(name)}:${esc(status)}</span>`;
}

const DOCTOR_STYLE = `
[data-content-doctor] {
  position: absolute; inset: 0; z-index: 80; overflow: auto;
  background: linear-gradient(165deg, #1a1410 0%, #0e0b09 55%, #16110d 100%);
  color: #f2e8d5; font-family: Cinzel, serif; padding: 16px 18px 32px;
}
[data-content-doctor] * { box-sizing: border-box; }
[data-content-doctor] h1 { margin: 0 0 8px; font-size: 20px; letter-spacing: 0.08em; display: flex; gap: 8px; align-items: center; }
[data-content-doctor] h2 { margin: 18px 0 8px; font-size: 14px; letter-spacing: 0.06em; color: #d4af78; }
[data-content-doctor] h3 { margin: 0 0 6px; font-size: 13px; }
[data-content-doctor] a { color: #e8c98a; }
[data-content-doctor] pre {
  background: rgba(0,0,0,0.35); border: 1px solid rgba(212,175,120,0.25);
  padding: 8px 10px; overflow: auto; font-family: ui-monospace, monospace; font-size: 11px;
  white-space: pre-wrap;
}
[data-doctor-domain] {
  border: 1px solid rgba(212,175,120,0.28); background: rgba(24,18,14,0.85);
  padding: 10px 12px; margin: 8px 0; border-radius: 4px;
}
[data-doctor-domain] .doctor-meta { font-size: 12px; opacity: 0.9; margin-bottom: 6px; }
.doctor-badge {
  display: inline-block; margin: 2px 4px 2px 0; padding: 1px 6px;
  border: 1px solid rgba(212,175,120,0.35); font-size: 10px; letter-spacing: 0.04em;
}
.doctor-badge[data-status="complete"] { color: #b7e0a8; }
.doctor-badge[data-status="missing"] { color: #ff8a7a; }
.doctor-badge[data-status="not-applicable"] { color: #9a8f7e; }
[data-doctor-entry] { font-size: 12px; margin: 4px 0; padding: 4px 0; border-top: 1px solid rgba(255,255,255,0.06); }
[data-doctor-registration] {
  font-size: 12px; margin: 4px 0; padding: 6px 8px;
  border: 1px solid rgba(212,175,120,0.22); background: rgba(0,0,0,0.2);
}
[data-doctor-schema-field] {
  display: inline-block; margin: 2px 4px 2px 0; padding: 1px 6px;
  border: 1px solid rgba(212,175,120,0.3); font-size: 10px;
}
[data-doctor-schema-field][data-source="locale"] { color: #9ec9ff; }
[data-doctor-schema-field][data-source="pack"] { color: #e8c98a; }
[data-doctor-problems] { font-size: 12px; }
[data-doctor-problems] li { margin: 2px 0; }
`;

function renderProvenance(provenance) {
  const rows = (provenance.registrations || []).map((row) => `
    <div data-doctor-registration="${esc(row.id)}">
      <strong>${esc(row.id)}</strong>
      <div>mechanics <span data-doctor-mechanics-pack>${esc(row.mechanicsPackId)}</span></div>
      <div>source <span data-doctor-source-path>${esc(row.sourcePath || '—')}</span></div>
      <div>targets <span data-doctor-targets>${esc(JSON.stringify(row.targets || {}))}</span></div>
      <div>locales ${esc((row.localeCodes || []).join(', ') || '—')}</div>
    </div>`).join('');
  return `<section data-doctor-provenance>
    <h2>${iconSvg('lantern', 16)} Registration provenance</h2>
    <div>target: ${esc(provenance.target)} · ids: ${esc((provenance.registrationIds || []).join(', '))}</div>
    ${rows}
  </section>`;
}

function renderSchemaOwnership() {
  const blocks = Object.entries(CONTENT_SCHEMAS).map(([domain, schema]) => {
    const fields = Object.entries(schema.fields || {}).map(([name, field]) =>
      `<span data-doctor-schema-field data-domain="${esc(domain)}" data-field="${esc(name)}" data-source="${esc(field.source)}">${esc(domain)}.${esc(name)}:${esc(field.source)}</span>`).join('');
    return `<div data-doctor-schema-domain="${esc(domain)}"><h3>${esc(domain)}</h3>${fields || '<span class="doctor-badge" data-status="not-applicable">no fields</span>'}</div>`;
  }).join('');
  return `<section data-doctor-schema>
    <h2>${iconSvg('cards', 16)} Schema field ownership</h2>
    ${blocks}
  </section>`;
}

function renderDomain(domain, row) {
  const entries = (row.entries || []).map((entry) => {
    const badges = Object.entries(entry.badges || {}).map(([name, badge]) => badgeHtml(name, badge)).join('');
    const gallery = entry.links?.gallery;
    const lab = entry.links?.lab;
    const galleryHref = gallery ? linkHref(gallery.route, gallery.domain, gallery.id) : '#';
    const labHref = lab ? linkHref(lab.route, lab.domain, lab.id) : '#';
    const problemLinks = (entry.problems || []).map((p) =>
      `<li data-doctor-problem="${esc(p.code || '')}">${esc(p.severity)} ${esc(p.code)} ${esc(p.field)}</li>`).join('');
    return `<div data-doctor-entry="${esc(entry.id)}">
      <strong>${esc(entry.id)}</strong> · pack ${esc(entry.packId)} · ${entry.complete ? 'complete' : 'incomplete'}
      <div>${badges}</div>
      <div>
        <a data-doctor-link="gallery" href="${esc(galleryHref)}">gallery preview</a>
        ·
        <a data-doctor-link="lab" href="${esc(labHref)}">Lab launch</a>
      </div>
      ${problemLinks ? `<ul>${problemLinks}</ul>` : ''}
    </div>`;
  }).join('');
  return `<section data-doctor-domain="${esc(domain)}">
    <h3>${esc(domain)}</h3>
    <div class="doctor-meta">
      total <span data-doctor-total>${row.total}</span>
      · complete <span data-doctor-complete>${row.complete}</span>
    </div>
    ${entries}
  </section>`;
}

function renderProblems(problems) {
  const items = (problems || []).map((p) =>
    `<li data-doctor-problem="${esc(p.code || '')}">
      <a href="#domain-${esc(p.domain || '')}">${esc(p.severity)}</a>
      ${esc(p.code)} ${esc(p.field)} — expected ${esc(p.expected)}; got ${esc(p.actual)}
    </li>`).join('');
  return `<section data-doctor-problems>
    <h2>${iconSvg('question', 16)} Problems</h2>
    ${items ? `<ul>${items}</ul>` : '<p>No problems.</p>'}
  </section>`;
}

export async function initDoctor() {
  const resources = {
    ...STATIC_REFERENCE_CATALOGUES,
    assetManifest: liveAssetManifest(),
  };
  const doctor = doctorContentRegistrations(DEVELOPMENT_CONTENT_REGISTRATION_MANIFEST, {
    id: 'content-doctor',
    resources,
    localeToken: 'en',
    fixtures: ['sample'],
  });
  const { report, provenance } = doctor;
  const text = formatContentReport(report);

  const style = document.createElement('style');
  style.textContent = DOCTOR_STYLE;
  document.head.appendChild(style);

  const host = document.getElementById('stage') || document.body;
  const root = document.createElement('div');
  root.setAttribute('data-content-doctor', '1');
  const domainHtml = Object.keys(MERGE_POLICIES)
    .map((domain) => renderDomain(domain, report.domains[domain] || { total: 0, complete: 0, entries: [] }))
    .join('');

  root.innerHTML = `
    <h1>${iconSvg('lantern', 22)} Content doctor</h1>
    <p>Development registration manifest · fixtures sample · ${report.ok ? 'ok' : 'problems'}</p>
    <pre data-doctor-report-text>${esc(text)}</pre>
    ${renderProvenance(provenance)}
    ${renderSchemaOwnership()}
    <h2>${iconSvg('chest', 16)} Domains</h2>
    ${domainHtml}
    ${renderProblems(report.problems)}
    <p><a href="?dev=1">dev shell</a> · <a href="?">game</a></p>
  `;
  host.appendChild(root);
}
