// Proving Grounds — dev-only deterministic simulation report lab (?sim=1).
// This module is deliberately self-contained and is lazy-loaded only by the
// import.meta.env.DEV branch in main.js. It consumes persisted report JSON; it
// never imports the browser game or the Node simulation harness.

const TABS = Object.freeze([
  ['headline', 'Headline'],
  ['deaths', 'Deaths'],
  ['cards', 'Cards & Relics'],
  ['economy', 'Economy'],
  ['issues', 'Issues'],
  ['compare', 'Compare'],
]);

const state = {
  reports: [],
  cache: new Map(),
  file: null,
  report: null,
  policy: null,
  tab: 'headline',
  compareA: null,
  compareB: null,
  comparePolicy: 'greedy',
  sort: { table: 'cards', key: 'offered', direction: -1 },
  running: false,
  sawRunning: false,
  lastOutput: null,
  error: null,
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const esc = (value) => String(value ?? '')
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;').replaceAll("'", '&#39;');
const finite = (value, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback;
const count = (value) => Math.round(finite(value)).toLocaleString('en-GB');
const pct = (value, digits = 1) => `${(finite(value) * 100).toFixed(digits)}%`;
const signedPct = (value) => `${finite(value) >= 0 ? '+' : ''}${(finite(value) * 100).toFixed(1)} pp`;
const duration = (ms) => {
  const seconds = Math.max(0, Math.round(finite(ms) / 1000));
  return seconds < 60 ? `${seconds}s` : `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
};
const entries = (value) => Object.entries(value && typeof value === 'object' ? value : {});
const firstPolicy = (report, preferred = 'greedy') => {
  const keys = Object.keys(report?.policies || {});
  return keys.includes(preferred) ? preferred : keys[0] || null;
};
const sectionFor = (report, preferred = state.policy) => {
  const policy = firstPolicy(report, preferred);
  return { policy, section: policy ? report?.policies?.[policy] : null };
};

async function json(url, options) {
  const response = await fetch(url, options);
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const message = payload?.problems?.join('; ') || `${response.status} ${response.statusText}`;
    throw new Error(message);
  }
  return payload;
}

function installStyles() {
  const style = document.createElement('style');
  style.dataset.simLab = '1';
  style.textContent = `
    :root { color-scheme: dark; }
    html, body { min-width: 320px; min-height: 100%; overflow: auto; background: #080b15; }
    body.sim-lab { margin: 0; color: #eee8d7; font-family: 'Alegreya', Georgia, serif; }
    body.sim-lab::before { content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 0;
      background:
        radial-gradient(circle at 76% 18%, rgba(108,72,168,.22), transparent 35%),
        radial-gradient(circle at 18% 82%, rgba(20,128,139,.18), transparent 38%),
        linear-gradient(128deg, rgba(255,255,255,.025) 1px, transparent 1px),
        #080b15; background-size: auto, auto, 42px 42px, auto; }
    .pg { --gold: #f2c14e; --gold-dim: #9c7c34; --lead: #37415a; --panel: rgba(13,18,31,.92);
      --violet: #aa82e8; --teal: #5bd2cf; --rose: #ef778a; --muted: #a39e91;
      position: relative; z-index: 1; display: grid; grid-template-columns: 260px minmax(0,1fr);
      grid-template-rows: auto minmax(0,1fr); min-height: 100vh; }
    .pg button, .pg input, .pg select { font: inherit; }
    .pg button, .pg select, .pg input { color: #eee8d7; border: 1px solid var(--lead); background: #111827; }
    .pg button { cursor: pointer; }
    .pg button:disabled { cursor: wait; opacity: .5; }
    .pg button:focus-visible, .pg input:focus-visible, .pg select:focus-visible { outline: 2px solid var(--gold); outline-offset: 2px; }
    .pg-rail { grid-row: 1 / -1; border-right: 1px solid rgba(242,193,78,.28); background: rgba(7,10,18,.94);
      padding: 22px 14px; position: sticky; top: 0; height: 100vh; box-sizing: border-box; overflow: auto; }
    .pg-brand { padding: 3px 8px 18px; border-bottom: 1px solid rgba(242,193,78,.22); }
    .pg-kicker, .pg-eyebrow { color: var(--gold); letter-spacing: .18em; text-transform: uppercase; font: 600 10px/1.4 'Cinzel', serif; }
    .pg-brand h1 { margin: 6px 0 3px; color: #fff5cc; font: 600 24px/1.1 'Cinzel', serif; letter-spacing: .05em; }
    .pg-brand p { margin: 0; color: var(--muted); font-size: 13px; }
    .pg-rail-title { display: flex; justify-content: space-between; align-items: center; margin: 20px 7px 8px; color: #c8c1ae; font-size: 12px; }
    .pg-report-list { display: grid; gap: 7px; }
    .pg-report { width: 100%; padding: 11px 10px; text-align: left; border-radius: 8px; position: relative; overflow: hidden; }
    .pg-report::before { content: ''; position: absolute; inset: 0 auto 0 0; width: 3px; background: transparent; }
    .pg-report:hover { border-color: #74644b; }
    .pg-report.active { border-color: var(--gold-dim); background: linear-gradient(110deg, rgba(87,65,27,.4), #111827 70%); }
    .pg-report.active::before { background: var(--gold); box-shadow: 0 0 12px var(--gold); }
    .pg-report strong, .pg-report small { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .pg-report strong { font-weight: 600; color: #f3ecd9; }
    .pg-report small { margin-top: 3px; color: var(--muted); font-size: 11px; }
    .pg-empty-rail { color: var(--muted); padding: 18px 8px; border: 1px dashed var(--lead); border-radius: 8px; text-align: center; }
    .pg-top { grid-column: 2; padding: 20px 26px 16px; border-bottom: 1px solid rgba(242,193,78,.22);
      background: linear-gradient(180deg, rgba(18,23,40,.96), rgba(10,14,25,.84)); position: sticky; top: 0; z-index: 4; }
    .pg-top-line { display: flex; align-items: flex-start; gap: 18px; }
    .pg-title { min-width: 0; flex: 1; }
    .pg-title h2 { margin: 3px 0 0; color: #fff4c3; font: 600 clamp(18px,2vw,26px)/1.2 'Cinzel', serif; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .pg-meta { display: flex; flex-wrap: wrap; gap: 7px 14px; margin-top: 7px; color: var(--muted); font-size: 12px; }
    .pg-meta b { color: #e5ddc8; font-weight: 600; }
    .pg-controls { display: flex; align-items: end; gap: 8px; flex-wrap: wrap; justify-content: flex-end; }
    .pg-field { display: grid; gap: 3px; color: var(--muted); font-size: 10px; text-transform: uppercase; letter-spacing: .08em; }
    .pg-field input, .pg-field select { border-radius: 6px; padding: 7px 8px; min-width: 68px; box-sizing: border-box; }
    .pg-field input { width: 84px; }
    .pg-field.label input { width: 128px; }
    .pg-run { padding: 8px 13px; border-radius: 6px; border-color: var(--gold-dim)!important; color: #171106!important;
      background: linear-gradient(#f5d67b,#bd8627)!important; font: 600 12px 'Cinzel', serif!important; }
    .pg-status { margin-top: 12px; display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 9px; }
    .pg-progress { height: 5px; background: #20283a; overflow: hidden; border-radius: 999px; }
    .pg-progress > i { display: block; height: 100%; background: linear-gradient(90deg,var(--teal),var(--gold)); width: 0; transition: width .25s; }
    .pg-status-copy { color: var(--muted); font-size: 11px; font-variant-numeric: tabular-nums; }
    .pg-banner { margin-top: 10px; padding: 9px 12px; border-radius: 6px; font-size: 12px; }
    .pg-banner.error { border: 1px solid rgba(239,119,138,.58); background: rgba(92,28,43,.55); color: #ffc0c8; }
    .pg-banner.flags { border: 1px solid rgba(242,193,78,.38); background: rgba(89,59,15,.35); color: #f5dda2; }
    .pg-tabs { display: flex; gap: 2px; margin-top: 15px; overflow-x: auto; scrollbar-width: thin; }
    .pg-tab { padding: 8px 11px; border: 0!important; border-bottom: 2px solid transparent!important; background: transparent!important;
      color: var(--muted)!important; white-space: nowrap; font: 600 11px 'Cinzel',serif!important; }
    .pg-tab.active { color: #fff0ba!important; border-bottom-color: var(--gold)!important; }
    .pg-content { grid-column: 2; padding: 24px 26px 42px; min-width: 0; }
    .pg-grid { display: grid; grid-template-columns: repeat(12,minmax(0,1fr)); gap: 14px; }
    .pg-card { grid-column: span 6; min-width: 0; padding: 17px; border: 1px solid var(--lead); border-radius: 10px;
      background: linear-gradient(152deg,rgba(27,34,56,.91),rgba(10,14,25,.94)); box-shadow: inset 0 0 0 1px rgba(242,193,78,.06), 0 16px 40px rgba(0,0,0,.22); }
    .pg-card.wide { grid-column: 1 / -1; }
    .pg-card.third { grid-column: span 4; }
    .pg-card h3 { margin: 0 0 13px; color: #e9ddbb; font: 600 13px 'Cinzel',serif; letter-spacing: .07em; }
    .pg-metrics { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 8px; }
    .pg-metric { padding: 13px 12px; border: 1px solid #30384d; border-radius: 8px; background: rgba(6,9,17,.45); }
    .pg-metric span { display: block; color: var(--muted); font-size: 10px; text-transform: uppercase; letter-spacing: .09em; }
    .pg-metric strong { display: block; margin-top: 4px; color: #fff1bb; font: 600 22px/1 'Cinzel',serif; font-variant-numeric: tabular-nums; }
    .pg-metric small { color: #aaa491; }
    .pg-chart { width: 100%; min-height: 120px; display: block; overflow: visible; }
    .pg-chart text { fill: #bcb5a2; font: 11px 'Alegreya',serif; }
    .pg-chart .label { fill: #eee4cc; }
    .pg-chart .grid { stroke: #313a50; stroke-width: 1; }
    .pg-chart .bar { fill: #5a3b83; }
    .pg-chart .accent { fill: var(--teal); }
    .pg-chart .ci { stroke: #ffe29a; stroke-width: 2; }
    .pg-chart .overlay { stroke: var(--rose); stroke-width: 2; stroke-dasharray: 4 3; }
    .pg-table-wrap { overflow: auto; max-height: min(62vh,650px); border: 1px solid #2d3549; border-radius: 7px; }
    .pg-table { border-collapse: collapse; width: 100%; min-width: 650px; font-size: 12px; font-variant-numeric: tabular-nums; }
    .pg-table th { position: sticky; top: 0; z-index: 1; padding: 9px 10px; text-align: right; color: #d7cba9; background: #161d2d; border-bottom: 1px solid #47516b; }
    .pg-table th:first-child, .pg-table td:first-child { text-align: left; }
    .pg-table th button { border: 0; background: none; color: inherit; padding: 0; font-weight: 600; }
    .pg-table td { padding: 8px 10px; text-align: right; border-bottom: 1px solid rgba(55,65,90,.55); }
    .pg-table tbody tr:hover { background: rgba(91,210,207,.055); }
    .pg-positive { color: #7de0b1; } .pg-negative { color: #ff9ba8; } .pg-muted { color: var(--muted); }
    .pg-flags { display: grid; gap: 7px; }
    .pg-flag { padding: 9px 11px; border-left: 3px solid var(--gold); background: rgba(242,193,78,.07); }
    .pg-issue { display: grid; grid-template-columns: auto 1fr auto; gap: 11px; align-items: start; padding: 11px 0; border-bottom: 1px solid #30384d; }
    .pg-issue code { color: #f4d888; }
    .pg-copy { padding: 5px 8px; border-radius: 5px; color: #ddd3bb!important; }
    .pg-compare-controls { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 14px; }
    .pg-compare-controls select { min-width: 190px; padding: 7px; border-radius: 6px; }
    .pg-neutral { min-height: 280px; display: grid; place-items: center; text-align: center; color: var(--muted); border: 1px dashed #37415a; border-radius: 10px; padding: 30px; }
    .pg-neutral strong { display: block; color: #dfd5bb; font: 600 17px 'Cinzel',serif; margin-bottom: 6px; }
    .pg-heat { display: grid; grid-template-columns: 42px repeat(5,minmax(34px,1fr)); gap: 5px; align-items: stretch; }
    .pg-heat b, .pg-heat span { min-height: 38px; display: grid; place-items: center; border-radius: 5px; font-size: 11px; }
    .pg-heat b { color: #bdb5a1; font-weight: 400; }
    .pg-heat span { border: 1px solid rgba(239,119,138,.18); color: #fff1e8; }
    @media (max-width: 980px) {
      .pg { grid-template-columns: minmax(0,1fr); grid-template-rows: auto auto 1fr; width: 100%; overflow: hidden; }
      .pg-rail { grid-row: 1; height: auto; position: static; border-right: 0; border-bottom: 1px solid rgba(242,193,78,.25); padding: 12px 14px; }
      .pg-rail, .pg-top, .pg-content { min-width: 0; width: 100%; box-sizing: border-box; }
      .pg-brand { padding: 2px 2px 10px; } .pg-brand p { display:none; }
      .pg-rail-title { display:none; } .pg-report-list { display:flex; overflow-x:auto; padding-top:10px; }
      .pg-report { min-width: 180px; } .pg-empty-rail { margin-top: 10px; }
      .pg-top, .pg-content { grid-column: 1; } .pg-top { top:0; padding:14px; }
      .pg-top-line { display:grid; } .pg-controls { justify-content:flex-start; }
      .pg-content { padding:14px 14px 34px; } .pg-card, .pg-card.third { grid-column: 1 / -1; }
    }
    @media (max-width: 620px) {
      .pg-title h2 { white-space: normal; } .pg-field.label { display:grid; grid-column:span 2; }
      .pg-controls { display:grid; grid-template-columns: repeat(3,1fr); width:100%; }
      .pg-field input, .pg-field select, .pg-field.label input { width:100%; min-width:0; } .pg-run { align-self:end; }
      .pg-metrics { grid-template-columns: repeat(2,1fr); } .pg-card { padding:13px; }
      .pg-status { grid-template-columns:1fr; } .pg-meta { display:none; }
    }
    @media (prefers-reduced-motion: reduce) { .pg *, .pg *::before, .pg *::after { transition: none!important; animation: none!important; } }
  `;
  document.head.append(style);
}

function shell() {
  document.body.className = 'sim-lab';
  document.body.innerHTML = `
    <main class="pg">
      <aside class="pg-rail" aria-label="Simulation reports">
        <div class="pg-brand"><div class="pg-kicker">Glassvow instrument</div><h1>Proving Grounds</h1><p>Deterministic balance observatory</p></div>
        <div class="pg-rail-title"><span>REPORT VAULT</span><span id="pg-report-count">0</span></div>
        <div class="pg-report-list" id="pg-report-list"><div class="pg-empty-rail">Reading the archive…</div></div>
      </aside>
      <header class="pg-top">
        <div class="pg-top-line">
          <div class="pg-title"><div class="pg-eyebrow">Selected report</div><h2 id="pg-heading">No report loaded</h2><div class="pg-meta" id="pg-meta"></div></div>
          <form class="pg-controls" id="pg-run-form">
            <label class="pg-field">Runs<input name="runs" type="number" min="1" max="1000000" value="2000" required></label>
            <label class="pg-field">Seed<input name="seed" type="number" min="0" value="1" required></label>
            <label class="pg-field">Policy<select name="policy"><option value="both">Both</option><option value="greedy">Greedy</option><option value="random">Random</option></select></label>
            <label class="pg-field">Profile<select name="profile"><option value="both">Both</option><option value="revealed">Revealed</option><option value="fresh">Fresh</option></select></label>
            <label class="pg-field">Workers<select name="workers"><option value="auto">Auto</option><option>1</option><option>2</option><option>4</option><option>8</option></select></label>
            <label class="pg-field label">Label<input name="label" value="sim-lab" pattern="[A-Za-z0-9._-]+" required></label>
            <button class="pg-run" type="submit">Run sweep</button>
          </form>
        </div>
        <div class="pg-status" id="pg-status" hidden><div class="pg-progress"><i></i></div><span class="pg-status-copy"></span></div>
        <div id="pg-message"></div>
        <nav class="pg-tabs" aria-label="Report sections">${TABS.map(([id, label]) => `<button class="pg-tab" data-tab="${id}" type="button">${label}</button>`).join('')}</nav>
      </header>
      <section class="pg-content" id="pg-content"><div class="pg-neutral"><div><strong>The observatory is opening</strong>Loading simulation reports…</div></div></section>
    </main>`;
}

function reportMeta() {
  const meta = state.report?.meta;
  $('#pg-heading').textContent = meta?.label || state.file || 'No report loaded';
  $('#pg-meta').innerHTML = meta ? [
    `<span><b>${count(meta.runs)}</b> plays</span>`,
    `<span><b>${duration(meta.durationMs)}</b> elapsed</span>`,
    `<span>rev <b>${esc(meta.gitRev || 'unknown')}</b>${meta.dirty ? ' · dirty' : ''}</span>`,
    `<span>${esc(meta.date ? new Date(meta.date).toLocaleString('en-GB') : '')}</span>`,
  ].join('') : '';
}

function renderRail() {
  $('#pg-report-count').textContent = String(state.reports.length);
  $('#pg-report-list').innerHTML = state.reports.length ? state.reports.map((report) => `
    <button class="pg-report${report.name === state.file ? ' active' : ''}" data-report="${esc(report.name)}" type="button">
      <strong>${esc(report.label || report.name)}</strong>
      <small>${count(report.runs)} plays · ${report.winRate == null ? '—' : pct(report.winRate)} win</small>
    </button>`).join('') : '<div class="pg-empty-rail">No reports yet.<br>Launch a sweep to kindle one.</div>';
}

function policyPicker() {
  const policies = Object.keys(state.report?.policies || {});
  if (policies.length < 2) return '';
  return `<label class="pg-field">Policy view<select id="pg-policy">${policies.map((policy) => `<option value="${esc(policy)}"${policy === state.policy ? ' selected' : ''}>${esc(policy)}</option>`).join('')}</select></label>`;
}

function flagsBanner(section) {
  const flags = Array.isArray(section?.flags) ? section.flags : [];
  if (!flags.length) return '';
  return `<div class="pg-banner flags"><b>${flags.length} balance signal${flags.length === 1 ? '' : 's'}</b> in this policy · inspect Headline and Issues.</div>`;
}

function metric(label, value, detail = '') {
  return `<div class="pg-metric"><span>${esc(label)}</span><strong>${esc(value)}</strong>${detail ? `<small>${esc(detail)}</small>` : ''}</div>`;
}

function wilsonBars(cells, title = 'Win rate with 95% Wilson interval') {
  const rows = entries(cells).sort(([a], [b]) => a.localeCompare(b));
  if (!rows.length) return '<div class="pg-neutral">No slice data in this report.</div>';
  const height = 34 + rows.length * 29;
  const x = (value) => 116 + finite(value) * 420;
  return `<svg class="pg-chart" viewBox="0 0 570 ${height}" role="img" aria-label="${esc(title)}">
    ${[0,.25,.5,.75,1].map((n) => `<line class="grid" x1="${x(n)}" x2="${x(n)}" y1="18" y2="${height - 8}"/><text x="${x(n)}" y="12" text-anchor="middle">${pct(n,0)}</text>`).join('')}
    ${rows.map(([label, cell], index) => {
      const y = 31 + index * 29;
      const lo = finite(cell.wilson95?.[0]); const hi = finite(cell.wilson95?.[1]); const wr = finite(cell.winRate);
      return `<text class="label" x="108" y="${y + 5}" text-anchor="end">${esc(label)} · n=${count(cell.n)}</text>
        <rect class="bar" x="116" y="${y - 8}" width="${Math.max(1, wr * 420)}" height="14" rx="3"/>
        <line class="ci" x1="${x(lo)}" x2="${x(hi)}" y1="${y - 1}" y2="${y - 1}"/>
        <circle class="accent" cx="${x(wr)}" cy="${y - 1}" r="4"/><text x="${Math.min(548, x(wr) + 8)}" y="${y + 5}">${pct(wr)}</text>`;
    }).join('')}
  </svg>`;
}

function aspectVowMatrix(cells) {
  const parsed = entries(cells).map(([key, value]) => ({ key, value, parts: key.split('|') }));
  const aspects = [...new Set(parsed.map((item) => item.parts[0]))].sort();
  const vows = [...new Set(parsed.map((item) => item.parts[1]))].sort();
  if (!aspects.length || !vows.length) return '<div class="pg-neutral">No aspect × vow cells.</div>';
  const lookup = new Map(parsed.map((item) => [item.key, item.value]));
  const cellW = 74, cellH = 46, left = 70, top = 32;
  const width = left + vows.length * cellW + 12, height = top + aspects.length * cellH + 18;
  return `<svg class="pg-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="Aspect by vow win rate matrix">
    ${vows.map((vow, index) => `<text x="${left + index * cellW + cellW / 2}" y="18" text-anchor="middle">Vow ${esc(vow)}</text>`).join('')}
    ${aspects.map((aspect, row) => `<text class="label" x="${left - 8}" y="${top + row * cellH + 28}" text-anchor="end">Aspect ${esc(aspect)}</text>${vows.map((vow, col) => {
      const cell = lookup.get(`${aspect}|${vow}`) || {}; const rate = finite(cell.winRate);
      const hue = 5 + rate * 170; const x = left + col * cellW; const y = top + row * cellH;
      return `<rect x="${x + 2}" y="${y + 2}" width="${cellW - 5}" height="${cellH - 5}" rx="5" fill="hsla(${hue},55%,38%,.72)"/><text x="${x + cellW / 2}" y="${y + 23}" text-anchor="middle" fill="#fff">${pct(rate)}</text><text x="${x + cellW / 2}" y="${y + 36}" text-anchor="middle">n=${count(cell.n)}</text>`;
    }).join('')}`).join('')}
  </svg>`;
}

function funnel(values) {
  const labels = ['Start', 'Act II', 'Act III', 'Vow kept'];
  const max = Math.max(1, ...values.map(finite));
  return `<svg class="pg-chart" viewBox="0 0 560 170" role="img" aria-label="Act reach funnel">
    ${values.map((value, index) => {
      const w = Math.max(4, finite(value) / max * 430); const x = (560 - w) / 2; const y = 9 + index * 39;
      return `<path d="M ${x} ${y} H ${x + w} L ${x + w - 12} ${y + 29} H ${x + 12} Z" fill="hsla(${185 + index * 18},48%,${36 + index * 3}%,.78)"/><text class="label" x="280" y="${y + 19}" text-anchor="middle">${labels[index]} · ${count(value)} · ${pct(finite(value) / max)}</text>`;
    }).join('')}
  </svg>`;
}

function renderHeadline(section) {
  const h = section.headline || {};
  return `<div class="pg-grid">
    <section class="pg-card wide"><div style="display:flex;justify-content:space-between;gap:12px;align-items:end"><h3>Run verdict</h3>${policyPicker()}</div>
      <div class="pg-metrics">${metric('Wins', count(h.wins))}${metric('Win rate', pct(h.winRate), `95% CI ${pct(h.wilson95?.[0])}–${pct(h.wilson95?.[1])}`)}${metric('Avg floors', finite(h.avgFloorsReached).toFixed(2))}${metric('Issues', count(section.issues?.total), section.issues?.total ? 'reproducible seeds captured' : 'no engine or invariant issues')}</div>
      ${flagsBanner(section)}
    </section>
    <section class="pg-card"><h3>Aspect confidence</h3>${wilsonBars(h.byAspect)}</section>
    <section class="pg-card"><h3>Vow confidence</h3>${wilsonBars(h.byVow)}</section>
    <section class="pg-card"><h3>Act reach funnel</h3>${funnel(h.actReach || [])}</section>
    <section class="pg-card"><h3>Aspect × vow stained glass</h3>${aspectVowMatrix(h.byAspectVow)}</section>
    <section class="pg-card wide"><h3>Balance signals</h3>${(section.flags || []).length ? `<div class="pg-flags">${section.flags.map((flag) => `<div class="pg-flag"><b>${esc(flag.kind)}</b> · ${esc(flag.message || flag.id || '')}</div>`).join('')}</div>` : '<div class="pg-muted">No automatic thresholds fired.</div>'}</section>
  </div>`;
}

function deathHeatmap(rows) {
  const lookup = new Map((rows || []).map(([act, row, value]) => [`${act}|${row}`, finite(value)]));
  const max = Math.max(1, ...lookup.values());
  return `<div class="pg-heat"><b></b>${[0,1,2,3,4].map((row) => `<b>Row ${row + 1}</b>`).join('')}${[0,1,2].map((act) => `<b>Act ${act + 1}</b>${[0,1,2,3,4].map((row) => { const value = lookup.get(`${act}|${row}`) || 0; const alpha = .08 + .82 * value / max; return `<span style="background:rgba(198,52,77,${alpha.toFixed(3)})" title="Act ${act + 1}, row ${row + 1}: ${count(value)} deaths">${count(value)}</span>`; }).join('')}`).join('')}</div>`;
}

function enemyBars(deaths) {
  const kills = deaths.byEnemy || {}; const encounters = deaths.encountersByEnemy || {};
  const ids = [...new Set([...Object.keys(kills), ...Object.keys(encounters)])].sort((a, b) => finite(kills[b]) - finite(kills[a]));
  const killTotal = Math.max(1, Object.values(kills).reduce((sum, n) => sum + finite(n), 0));
  const encTotal = Math.max(1, Object.values(encounters).reduce((sum, n) => sum + finite(n), 0));
  const height = 25 + ids.length * 27;
  return ids.length ? `<svg class="pg-chart" viewBox="0 0 620 ${height}" role="img" aria-label="Enemy kill share and encounter share">
    ${ids.map((id, index) => { const y = 15 + index * 27; const ks = finite(kills[id]) / killTotal; const es = finite(encounters[id]) / encTotal; return `<text class="label" x="132" y="${y + 11}" text-anchor="end">${esc(id)}</text><rect class="bar" x="140" y="${y}" width="${Math.max(1,ks * 420)}" height="14" rx="3"/><line class="overlay" x1="${140 + es * 420}" x2="${140 + es * 420}" y1="${y - 3}" y2="${y + 18}"/><text x="568" y="${y + 11}">${pct(ks)} / ${pct(es)}</text>`; }).join('')}
  </svg>` : '<div class="pg-neutral">No enemy death data.</div>';
}

function renderDeaths(section) {
  const d = section.deaths || {};
  return `<div class="pg-grid">
    <section class="pg-card wide"><div style="display:flex;justify-content:space-between;gap:12px;align-items:end"><h3>Fifteen-floor death silhouette</h3>${policyPicker()}</div>${deathHeatmap(d.byActRow)}</section>
    <section class="pg-card wide"><h3>Enemy lethality · kill share / encounter share</h3>${enemyBars(d)}</section>
    <section class="pg-card"><h3>Death kind</h3>${wilsonBars(Object.fromEntries(entries(d.byKind).map(([key, n]) => [key, { n, winRate: finite(n) / Math.max(1, entries(d.byKind).reduce((s,[,v]) => s + finite(v),0)), wilson95: [0,0] }])),'Death kind share')}</section>
    <section class="pg-card"><h3>HP lost per fight</h3>${simpleRows(d.avgHpLostPerFight, (n) => finite(n).toFixed(2))}</section>
  </div>`;
}

function simpleRows(object, format = count) {
  const rows = entries(object).sort(([,a],[,b]) => finite(b) - finite(a));
  return rows.length ? `<div class="pg-table-wrap"><table class="pg-table"><tbody>${rows.map(([key,value]) => `<tr><td>${esc(key)}</td><td>${esc(format(value))}</td></tr>`).join('')}</tbody></table></div>` : '<div class="pg-muted">No data.</div>';
}

function sortRows(table, rows) {
  const { key, direction } = state.sort.table === table ? state.sort : { key: 'id', direction: 1 };
  return [...rows].sort((a,b) => {
    const av = a[key], bv = b[key];
    const cmp = typeof av === 'string' || typeof bv === 'string' ? String(av ?? '').localeCompare(String(bv ?? '')) : finite(av,-Infinity) - finite(bv,-Infinity);
    return cmp * direction || String(a.id).localeCompare(String(b.id));
  });
}

function sortableHead(table, columns) {
  return `<thead><tr>${columns.map(([key,label]) => `<th><button type="button" data-sort-table="${table}" data-sort-key="${key}">${esc(label)}${state.sort.table === table && state.sort.key === key ? (state.sort.direction > 0 ? ' ↑' : ' ↓') : ''}</button></th>`).join('')}</tr></thead>`;
}

function renderCards(section) {
  const cardRows = sortRows('cards', entries(section.cards).map(([id,c]) => ({ id, ...c, pickRate: finite(c.picked) / Math.max(1,finite(c.offered)) })));
  const relicRows = sortRows('relics', entries(section.relics).map(([id,r]) => ({ id, ...r, takeRate: finite(r.taken) / Math.max(1,finite(r.seen)) })));
  return `<div class="pg-grid">
    <section class="pg-card wide"><div style="display:flex;justify-content:space-between;gap:12px;align-items:end"><h3>Card draft ledger</h3>${policyPicker()}</div><div class="pg-table-wrap"><table class="pg-table">${sortableHead('cards',[['id','Card'],['offered','Offered'],['picked','Picked'],['pickRate','Pick rate'],['winRateWhenDrafted','Win when drafted'],['avgCopiesWin','Copies · wins'],['avgCopiesLoss','Copies · losses']])}<tbody>${cardRows.map((r) => `<tr><td>${esc(r.id)}</td><td>${count(r.offered)}</td><td>${count(r.picked)}</td><td>${pct(r.pickRate)}</td><td>${r.winRateWhenDrafted == null ? '—' : pct(r.winRateWhenDrafted)}</td><td>${r.avgCopiesWin == null ? '—' : finite(r.avgCopiesWin).toFixed(2)}</td><td>${r.avgCopiesLoss == null ? '—' : finite(r.avgCopiesLoss).toFixed(2)}</td></tr>`).join('')}</tbody></table></div></section>
    <section class="pg-card wide"><h3>Relic conversion ledger</h3><div class="pg-table-wrap"><table class="pg-table">${sortableHead('relics',[['id','Relic'],['seen','Seen'],['taken','Taken'],['takeRate','Take rate'],['winRateWhenTaken','Win when taken']])}<tbody>${relicRows.map((r) => `<tr><td>${esc(r.id)}</td><td>${count(r.seen)}</td><td>${count(r.taken)}</td><td>${pct(r.takeRate)}</td><td>${r.winRateWhenTaken == null ? '—' : pct(r.winRateWhenTaken)}</td></tr>`).join('')}</tbody></table></div></section>
  </div>`;
}

function renderEconomy(section) {
  const e = section.economy || {};
  return `<div class="pg-grid">
    <section class="pg-card wide"><div style="display:flex;justify-content:space-between;gap:12px;align-items:end"><h3>Combat economy</h3>${policyPicker()}</div><div class="pg-metrics">${metric('Damage / turn', finite(e.dmgDealtPerTurn).toFixed(2))}${metric('Damage taken / turn', finite(e.dmgTakenPerTurn).toFixed(2))}${metric('Energy waste / turn', finite(e.energyWastePerTurn).toFixed(2))}${metric('Avg overkill', finite(e.avgOverkill).toFixed(2))}${metric('Kindle rate', pct(e.kindleRate))}${metric('Lantern art rate', pct(e.artRate))}${metric('Potions / run', finite(e.potionsUsed).toFixed(2))}${metric('Deaths holding potion', pct(e.potionsHeldAtDeath))}</div></section>
    <section class="pg-card wide"><h3>Fight length by enemy</h3>${simpleRows(e.avgTurnsPerFight,(n)=>`${finite(n).toFixed(2)} turns`)}</section>
  </div>`;
}

function reproCommand(issue) {
  return `npm run sim -- --runs 1 --policy ${state.policy || 'greedy'} --profile ${issue.profile || 'revealed'} --seed ${finite(issue.seed)} --workers 1 --label repro-${finite(issue.seed)}`;
}

function renderIssues(section) {
  const issues = section.issues || {};
  return `<div class="pg-grid">
    <section class="pg-card wide"><div style="display:flex;justify-content:space-between;gap:12px;align-items:end"><h3>Captured engine and invariant issues · ${count(issues.total)}</h3>${policyPicker()}</div>
      ${issues.detail?.length ? issues.detail.map((issue) => `<article class="pg-issue"><code>${esc(issue.kind)}</code><div><b>seed ${count(issue.seed)} · ${esc(issue.profile)} · ${esc(issue.phase)}</b><br><span class="pg-muted">${esc(issue.message)}</span><br><code>${esc(reproCommand(issue))}</code></div><button class="pg-copy" data-copy="${esc(reproCommand(issue))}" type="button">Copy repro</button></article>`).join('') : '<div class="pg-neutral"><div><strong>No captured issues</strong>Every run terminated without an engine-error or invariant signature.</div></div>'}
    </section>
    <section class="pg-card wide"><h3>Issue signatures</h3>${simpleRows(issues.countsBySignature)}</section>
  </div>`;
}

function deltaCell(value, format = signedPct) {
  const className = finite(value) > 0 ? 'pg-positive' : finite(value) < 0 ? 'pg-negative' : 'pg-muted';
  return `<span class="${className}">${esc(format(value))}</span>`;
}

function compareOptions(selected) {
  return state.reports.map((r) => `<option value="${esc(r.name)}"${r.name === selected ? ' selected' : ''}>${esc(r.label || r.name)}</option>`).join('');
}

function renderCompare() {
  if (state.reports.length < 2) return '<div class="pg-neutral"><div><strong>Two panes make a comparison</strong>Run or retain at least two reports to unlock signed deltas.</div></div>';
  const reportA = state.cache.get(state.compareA); const reportB = state.cache.get(state.compareB);
  if (!reportA || !reportB) return '<div class="pg-neutral">Loading comparison reports…</div>';
  const a = sectionFor(reportA, state.comparePolicy); const b = sectionFor(reportB, state.comparePolicy);
  if (!a.section || !b.section) return '<div class="pg-neutral">The selected policy is not present in both reports.</div>';
  const ah = a.section.headline || {}, bh = b.section.headline || {};
  const ae = a.section.economy || {}, be = b.section.economy || {};
  const rows = [
    ['Win rate', pct(ah.winRate), pct(bh.winRate), bh.winRate - ah.winRate, signedPct],
    ['Average floors', finite(ah.avgFloorsReached).toFixed(2), finite(bh.avgFloorsReached).toFixed(2), bh.avgFloorsReached - ah.avgFloorsReached, (n)=>`${finite(n)>=0?'+':''}${finite(n).toFixed(2)}`],
    ['Damage / turn', finite(ae.dmgDealtPerTurn).toFixed(2), finite(be.dmgDealtPerTurn).toFixed(2), be.dmgDealtPerTurn - ae.dmgDealtPerTurn, (n)=>`${finite(n)>=0?'+':''}${finite(n).toFixed(2)}`],
    ['Damage taken / turn', finite(ae.dmgTakenPerTurn).toFixed(2), finite(be.dmgTakenPerTurn).toFixed(2), be.dmgTakenPerTurn - ae.dmgTakenPerTurn, (n)=>`${finite(n)>=0?'+':''}${finite(n).toFixed(2)}`],
    ['Energy waste / turn', finite(ae.energyWastePerTurn).toFixed(2), finite(be.energyWastePerTurn).toFixed(2), be.energyWastePerTurn - ae.energyWastePerTurn, (n)=>`${finite(n)>=0?'+':''}${finite(n).toFixed(2)}`],
    ['Issues', count(a.section.issues?.total), count(b.section.issues?.total), finite(b.section.issues?.total)-finite(a.section.issues?.total), (n)=>`${finite(n)>=0?'+':''}${count(n)}`],
  ];
  return `<div class="pg-grid"><section class="pg-card wide"><h3>A/B balance glass</h3><div class="pg-compare-controls">
    <label class="pg-field">Report A<select id="pg-compare-a">${compareOptions(state.compareA)}</select></label>
    <label class="pg-field">Report B<select id="pg-compare-b">${compareOptions(state.compareB)}</select></label>
    <label class="pg-field">Policy<select id="pg-compare-policy">${['greedy','random'].map((p)=>`<option${p===state.comparePolicy?' selected':''}>${p}</option>`).join('')}</select></label>
  </div><div class="pg-table-wrap"><table class="pg-table"><thead><tr><th>Measure</th><th>A</th><th>B</th><th>Δ B − A</th></tr></thead><tbody>${rows.map(([label,av,bv,d,format])=>`<tr><td>${esc(label)}</td><td>${esc(av)}</td><td>${esc(bv)}</td><td>${deltaCell(d,format)}</td></tr>`).join('')}</tbody></table></div></section>
  <section class="pg-card"><h3>A · ${esc(a.policy)}</h3>${wilsonBars(ah.byProfile)}</section><section class="pg-card"><h3>B · ${esc(b.policy)}</h3>${wilsonBars(bh.byProfile)}</section></div>`;
}

function renderContent() {
  reportMeta(); renderRail();
  $$('.pg-tab').forEach((button) => button.classList.toggle('active', button.dataset.tab === state.tab));
  if (!state.report) {
    $('#pg-content').innerHTML = `<div class="pg-neutral"><div><strong>No report in the vault</strong>Use Run sweep above. Progress will appear here and the finished report will open automatically.</div></div>`;
    return;
  }
  const { section } = sectionFor(state.report);
  if (!section) { $('#pg-content').innerHTML = '<div class="pg-neutral">This report has no policy sections.</div>'; return; }
  const renderers = { headline: renderHeadline, deaths: renderDeaths, cards: renderCards, economy: renderEconomy, issues: renderIssues };
  $('#pg-content').innerHTML = state.tab === 'compare' ? renderCompare() : renderers[state.tab](section);
}

async function loadReport(file) {
  if (!file) return;
  try {
    const report = state.cache.get(file) || await json(`/__sim-report?f=${encodeURIComponent(file)}`);
    state.cache.set(file, report);
    state.file = file; state.report = report; state.policy = firstPolicy(report, state.policy);
    state.error = null; renderMessage(); renderContent();
  } catch (error) {
    state.error = `Could not open report: ${error.message}`; renderMessage();
  }
}

async function ensureCompareReports() {
  if (state.reports.length < 2) return;
  state.compareA ||= state.reports[1]?.name || state.reports[0].name;
  state.compareB ||= state.reports[0].name;
  await Promise.all([state.compareA, state.compareB].map(async (file) => {
    if (!state.cache.has(file)) state.cache.set(file, await json(`/__sim-report?f=${encodeURIComponent(file)}`));
  }));
}

async function refreshReports({ loadLatest = false } = {}) {
  try {
    state.reports = await json('/__sim-reports');
    renderRail();
    if (!state.reports.length) {
      state.file = null;
      state.report = null;
      renderContent();
      return;
    }
    if (loadLatest && state.reports[0]) await loadReport(state.reports[0].name);
    if (!state.report && state.reports[0]) await loadReport(state.reports[0].name);
    if (!state.compareA && state.reports.length > 1) {
      state.compareA = state.reports[1].name; state.compareB = state.reports[0].name;
    }
    if (state.tab === 'compare' && state.reports.length > 1) {
      await ensureCompareReports();
      renderContent();
    }
  } catch (error) {
    state.error = `Could not list reports: ${error.message}`; renderMessage(); renderContent();
  }
}

function renderMessage() {
  $('#pg-message').innerHTML = state.error ? `<div class="pg-banner error" role="alert">${esc(state.error)}</div>` : '';
}

function renderStatus(status) {
  const node = $('#pg-status'); const button = $('.pg-run');
  state.running = Boolean(status.running); button.disabled = state.running;
  if (state.running) state.sawRunning = true;
  const total = finite(status.total); const done = finite(status.done); const ratio = total ? Math.min(1, done / total) : 0;
  node.hidden = !state.running && !state.sawRunning;
  $('.pg-progress > i', node).style.width = `${ratio * 100}%`;
  $('.pg-status-copy', node).textContent = state.running ? `${count(done)} / ${total ? count(total) : '…'} plays · ${pct(ratio,0)}` : (status.error ? 'Sweep failed' : 'Sweep complete');
}

async function pollStatus() {
  try {
    const status = await json('/__sim-status');
    const wasRunning = state.running;
    renderStatus(status);
    if (status.error) { state.error = `Runner: ${status.error}`; renderMessage(); }
    if (wasRunning && !status.running && !status.error && status.output !== state.lastOutput) {
      state.lastOutput = status.output || null;
      await refreshReports({ loadLatest: true });
    }
  } catch (error) {
    state.error = `Status check failed: ${error.message}`; state.running = false; $('.pg-run').disabled = false; renderMessage();
  }
}

async function launchRun(form) {
  const data = new FormData(form);
  const workersRaw = data.get('workers');
  const payload = {
    runs: Number(data.get('runs')), seed: Number(data.get('seed')),
    policy: data.get('policy'), profile: data.get('profile'),
    workers: workersRaw === 'auto' ? 'auto' : Number(workersRaw), label: data.get('label'),
  };
  try {
    state.error = null; state.sawRunning = true; state.running = true; renderMessage(); $('.pg-run').disabled = true;
    await json('/__sim-run', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
    await pollStatus();
  } catch (error) {
    state.running = false; $('.pg-run').disabled = false; state.error = `Could not start sweep: ${error.message}`; renderMessage();
  }
}

function bind() {
  document.addEventListener('click', async (event) => {
    const reportButton = event.target.closest('[data-report]');
    if (reportButton) { await loadReport(reportButton.dataset.report); return; }
    const tabButton = event.target.closest('[data-tab]');
    if (tabButton) { state.tab = tabButton.dataset.tab; if (state.tab === 'compare') await ensureCompareReports(); renderContent(); return; }
    const sortButton = event.target.closest('[data-sort-key]');
    if (sortButton) {
      const table = sortButton.dataset.sortTable, key = sortButton.dataset.sortKey;
      state.sort = state.sort.table === table && state.sort.key === key ? { table, key, direction: -state.sort.direction } : { table, key, direction: 1 };
      renderContent(); return;
    }
    const copyButton = event.target.closest('[data-copy]');
    if (copyButton) {
      try { await navigator.clipboard.writeText(copyButton.dataset.copy); copyButton.textContent = 'Copied'; }
      catch { state.error = 'Clipboard permission was denied; select the repro command manually.'; renderMessage(); }
    }
  });
  document.addEventListener('change', async (event) => {
    if (event.target.id === 'pg-policy') { state.policy = event.target.value; renderContent(); }
    if (event.target.id === 'pg-compare-a' || event.target.id === 'pg-compare-b') {
      if (event.target.id.endsWith('-a')) state.compareA = event.target.value; else state.compareB = event.target.value;
      await ensureCompareReports(); renderContent();
    }
    if (event.target.id === 'pg-compare-policy') { state.comparePolicy = event.target.value; renderContent(); }
  });
  $('#pg-run-form').addEventListener('submit', (event) => { event.preventDefault(); launchRun(event.currentTarget); });
}

export async function initSimLab() {
  document.title = 'Proving Grounds · Glassvow';
  installStyles(); shell(); bind();
  await refreshReports();
  await pollStatus();
  window.setInterval(pollStatus, 1000);
}
