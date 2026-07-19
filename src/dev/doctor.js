// Content doctor dashboard — DEV-only thin view over doctorContentRegistrations (?dashboard=1).
// Uses the compiled development manifest + Lab fixture selection; never owns a pack list.

import {
  doctorContentRegistrations,
} from '../content-registration.js';
import {
  CONTENT_REGISTRATION_MANIFEST as DEVELOPMENT_CONTENT_REGISTRATION_MANIFEST,
} from '../packs/compiled/development.js';
import { STATIC_REFERENCE_CATALOGUES } from '../content-resources.js';
import { CONTENT_SCHEMAS, formatContentReport, MERGE_POLICIES } from '../registry.js';
import { esc, ensureDevStyle, renderDevRail, renderDevTopbar, mountRailDrawer, setDevTitle } from './chrome.js';

const ASSET_MODULES = import.meta.glob(
  ['../assets/*/*.{png,jpg,jpeg,webp}'],
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

function linkHref(route, domain, id) {
  const q = new URLSearchParams();
  q.set(route, '1');
  if (domain) q.set('domain', domain);
  if (id) q.set('id', id);
  return `?${q.toString()}`;
}

const BADGE_CLASS = { complete: 'is-ok', missing: 'is-error', 'not-applicable': '' };

function badgeHtml(name, badge) {
  const status = badge?.status || 'not-applicable';
  return `<span class="dev-chip doctor-badge ${BADGE_CLASS[status] || ''}" data-badge="${esc(name)}" data-status="${esc(status)}">${esc(name)} · ${esc(status)}</span>`;
}

const DOCTOR_STYLE = `
[data-content-doctor] .dev-scroll { display: grid; gap: 14px; align-content: start;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); }
[data-content-doctor] .doctor-wide { grid-column: 1 / -1; }
[data-content-doctor] .dev-panel { padding: 14px 16px; }
[data-content-doctor] .dev-panel > h2 { margin: 0 0 12px; font-size: 13px; font-weight: 600;
  letter-spacing: 0.02em; color: var(--dev-text); display: flex; gap: 8px; align-items: center; }
[data-content-doctor] .dev-panel > h2 .dev-diamond { color: var(--dev-accent); font-size: 11px; }
[data-content-doctor] pre[data-doctor-report-text] {
  margin: 0; padding: 12px 14px; border-radius: 8px; max-height: 220px; overflow: auto;
  background: var(--dev-input-bg); border: 1px solid var(--dev-input-border);
  color: var(--dev-muted); font: 400 11px/1.6 var(--dev-mono); white-space: pre-wrap;
}
[data-content-doctor] .doctor-badge { font-size: 9px; padding: 1px 7px; margin: 0; }
[data-content-doctor] [data-doctor-domain] {
  padding: 11px 0; border-top: 1px solid var(--dev-border);
}
[data-content-doctor] [data-doctor-domain]:first-of-type { border-top: 0; padding-top: 0; }
[data-content-doctor] .doctor-domain-head { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
[data-content-doctor] .doctor-domain-head h3 { margin: 0; font: 500 13px/1 var(--dev-mono); color: var(--dev-accent-light); }
[data-content-doctor] .doctor-meta { font: 400 11px var(--dev-mono); color: var(--dev-dim); }
[data-content-doctor] .doctor-meter { flex: 1; min-width: 90px; height: 5px; border-radius: 3px;
  background: #22243a; overflow: hidden; }
[data-content-doctor] .doctor-meter > i { display: block; height: 100%;
  background: linear-gradient(90deg, var(--dev-accent), var(--dev-teal)); }
[data-content-doctor] [data-doctor-entry] { margin: 8px 0 0; padding: 8px 10px; border-radius: 8px;
  background: var(--dev-input-bg); border: 1px solid var(--dev-input-border); font-size: 12px; color: var(--dev-muted); }
[data-content-doctor] [data-doctor-entry] strong { font: 500 11px var(--dev-mono); color: var(--dev-accent-light); }
[data-content-doctor] .doctor-badges { display: flex; flex-wrap: wrap; gap: 4px; margin: 6px 0; }
[data-content-doctor] .doctor-links { display: flex; flex-wrap: wrap; gap: 12px; font-size: 11px; }
[data-content-doctor] a[data-doctor-link] { color: var(--dev-teal); text-decoration: none; }
[data-content-doctor] a[data-doctor-link]:hover { color: var(--dev-accent-light); }
[data-content-doctor] [data-doctor-entry] ul { margin: 6px 0 0; padding-left: 16px; }
[data-content-doctor] [data-doctor-schema-domain] { margin: 0 0 10px; }
[data-content-doctor] [data-doctor-schema-domain] h3 { margin: 0 0 5px; font: 500 11px var(--dev-mono); color: var(--dev-dim); }
[data-content-doctor] .doctor-fields { display: flex; flex-wrap: wrap; gap: 4px; }
[data-content-doctor] [data-doctor-schema-field] { display: inline-flex; padding: 2px 7px; border-radius: 5px;
  font: 400 9px var(--dev-mono); border: 1px solid var(--dev-input-border); color: var(--dev-muted); }
[data-content-doctor] [data-doctor-schema-field][data-source="locale"] { color: var(--dev-teal); border-color: var(--dev-teal-border); }
[data-content-doctor] [data-doctor-schema-field][data-source="pack"] { color: var(--dev-accent-light); border-color: var(--dev-accent-border); }
[data-content-doctor] [data-doctor-registration] { margin: 8px 0 0; padding: 8px 10px; border-radius: 8px;
  background: var(--dev-input-bg); border: 1px solid var(--dev-input-border); font-size: 12px; color: var(--dev-dim); }
[data-content-doctor] [data-doctor-registration] strong { font: 700 11px var(--dev-mono); color: var(--dev-accent-light); }
[data-content-doctor] [data-doctor-registration] span,
[data-content-doctor] [data-doctor-provenance] .doctor-meta span { font-family: var(--dev-mono); color: var(--dev-muted); }
[data-content-doctor] [data-doctor-problems] ul { margin: 0; padding: 0; list-style: none; display: grid; gap: 6px; }
[data-content-doctor] [data-doctor-problem] { padding: 8px 10px; border-radius: 8px; font-size: 11px;
  background: var(--dev-input-bg); border: 1px solid var(--dev-input-border); color: var(--dev-muted); }
[data-content-doctor] [data-doctor-problem] a { color: var(--dev-red); font-weight: 600; text-decoration: none; text-transform: uppercase; font-size: 10px; letter-spacing: 0.06em; }
`;

function meter(complete, total) {
  const pct = total > 0 ? Math.round((complete / total) * 100) : 100;
  return `<div class="doctor-meter"><i style="width:${pct}%"></i></div>`;
}

function renderProvenance(provenance) {
  const rows = (provenance.registrations || []).map((row) => `
    <div data-doctor-registration="${esc(row.id)}">
      <strong>${esc(row.id)}</strong>
      <div>mechanics <span data-doctor-mechanics-pack>${esc(row.mechanicsPackId)}</span></div>
      <div>source <span data-doctor-source-path>${esc(row.sourcePath || '—')}</span></div>
      <div>targets <span data-doctor-targets>${esc(JSON.stringify(row.targets || {}))}</span></div>
      <div>locales ${esc((row.localeCodes || []).join(', ') || '—')}</div>
    </div>`).join('');
  return `<section class="dev-panel" data-doctor-provenance>
    <h2><span class="dev-diamond">◆</span> Registration provenance</h2>
    <div class="doctor-meta">target: <span>${esc(provenance.target)}</span> · ids: <span>${esc((provenance.registrationIds || []).join(', '))}</span></div>
    ${rows}
  </section>`;
}

function renderSchemaOwnership() {
  const blocks = Object.entries(CONTENT_SCHEMAS).map(([domain, schema]) => {
    const fields = Object.entries(schema.fields || {}).map(([name, field]) =>
      `<span data-doctor-schema-field data-domain="${esc(domain)}" data-field="${esc(name)}" data-source="${esc(field.source)}">${esc(domain)}.${esc(name)}:${esc(field.source)}</span>`).join('');
    return `<div data-doctor-schema-domain="${esc(domain)}"><h3>${esc(domain)}</h3><div class="doctor-fields">${fields || '<span class="dev-chip">no fields</span>'}</div></div>`;
  }).join('');
  return `<section class="dev-panel" data-doctor-schema>
    <h2><span class="dev-diamond">◆</span> Schema field ownership</h2>
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
      <div class="doctor-badges">${badges}</div>
      <div class="doctor-links">
        <a data-doctor-link="gallery" href="${esc(galleryHref)}">gallery preview →</a>
        <a data-doctor-link="lab" href="${esc(labHref)}">Lab launch →</a>
      </div>
      ${problemLinks ? `<ul>${problemLinks}</ul>` : ''}
    </div>`;
  }).join('');
  return `<section data-doctor-domain="${esc(domain)}">
    <div class="doctor-domain-head">
      <h3>${esc(domain)}</h3>
      ${meter(row.complete, row.total)}
      <span class="doctor-meta">complete <span data-doctor-complete>${row.complete}</span> / <span data-doctor-total>${row.total}</span></span>
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
  return `<section class="dev-panel" data-doctor-problems>
    <h2><span class="dev-diamond">◆</span> Problems</h2>
    ${items ? `<ul>${items}</ul>` : '<p class="doctor-meta">No problems.</p>'}
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

  ensureDevStyle();
  setDevTitle('Content doctor');
  const style = document.createElement('style');
  style.textContent = DOCTOR_STYLE;
  document.head.appendChild(style);

  const host = document.getElementById('stage') || document.body;
  const root = document.createElement('div');
  root.setAttribute('data-content-doctor', '1');
  root.className = 'dev-shell';
  const domainHtml = Object.keys(MERGE_POLICIES)
    .map((domain) => renderDomain(domain, report.domains[domain] || { total: 0, complete: 0, entries: [] }))
    .join('');

  const problemCount = (report.problems || []).length;
  const status = `<span class="dev-chip ${report.ok ? 'is-ok' : 'is-warn'}">${report.ok ? 'no problems' : `${problemCount} problem${problemCount === 1 ? '' : 's'}`}</span>
    <span class="dev-topbar-param">manifest development · fixtures sample · locale en</span>`;

  root.innerHTML = `
    ${renderDevRail({ activeParam: 'dashboard' })}
    <div class="dev-main">
      ${renderDevTopbar({ title: 'Content doctor', param: 'dashboard', status, menu: true })}
      <div class="dev-scroll">
        <section class="dev-panel doctor-wide" data-doctor-domains>
          <h2><span class="dev-diamond">◆</span> Domains</h2>
          ${domainHtml}
        </section>
        ${renderProblems(report.problems)}
        ${renderSchemaOwnership()}
        ${renderProvenance(provenance)}
        <section class="dev-panel doctor-wide">
          <h2><span class="dev-diamond">◆</span> Report projection</h2>
          <pre data-doctor-report-text>${esc(text)}</pre>
        </section>
      </div>
    </div>
  `;
  host.appendChild(root);

  const drawer = mountRailDrawer('dashboard');
  root.querySelector('[data-dev-menu]').addEventListener('click', () => drawer.toggle());
}
