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
const CYCLE_TABS = Object.freeze([
  ['headline', 'Headline'], ['cycle', 'Cycle / Progress'], ['issues', 'Issues'], ['compare', 'Compare'],
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
  launching: false,
  sawRunning: false,
  lastOutput: null,
  error: null,
  loadRequest: 0,
  statusGeneration: 0,
  pollTimer: null,
  pollStopped: false,
  metadata: null,
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
const reportMode = (report) => report?.meta?.mode || (Number(report?.meta?.schema) >= 2 ? 'cycle' : 'round');
const reportSchema = (report) => Number(report?.meta?.schema || 1);
const policyDefinition = (id) => state.metadata?.policies?.find((item) => item.id === id) || null;
const isCoverage = (report = state.report, policy = state.policy) => {
  const section = report?.policies?.[policy];
  return section?.meta?.knowledgeClass === 'coverage-only' || policy === 'coverage';
};
function visibleTabs(report = state.report) {
  if (!report || reportSchema(report) === 1) return TABS;
  return isCoverage(report) ? CYCLE_TABS.filter(([id]) => id !== 'compare') : CYCLE_TABS;
}

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
    .pg-control-group { display: contents; border: 0; padding: 0; margin: 0; }
    .pg-control-group legend { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
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
    .pg-badge { display: inline-block; margin: 0 0 10px; padding: 4px 8px; border: 1px solid var(--gold-dim); border-radius: 999px; color: #f5dda2; font: 600 10px 'Cinzel',serif; text-transform: uppercase; letter-spacing: .08em; }
    .pg-badge.qa { border-color: var(--rose); color: #ffc0c8; }
    .pg-interpretation { margin: 0 0 14px; color: #d8d0bc; }
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
    .pg-heat-wrap { overflow-x: auto; }
    .pg-heat { display: grid; grid-template-columns: 48px repeat(15,minmax(34px,1fr)); gap: 5px; align-items: stretch; min-width: 650px; }
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
      .pg-control-group { display: contents; }
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
          <form class="pg-controls" id="pg-run-form" aria-label="Run simulation">
            <fieldset class="pg-control-group"><legend>Simulation population and machine policy</legend><span id="pg-mode-controls"></span></fieldset>
            <label class="pg-field">Workers<select name="workers"><option value="auto">Auto</option><option>1</option><option>2</option><option>4</option><option>8</option></select></label>
            <label class="pg-field label">Label<input name="label" value="${esc(state.metadata?.defaults?.label || 'proving-grounds')}" pattern="[A-Za-z0-9._-]+" required></label>
            <button class="pg-run" type="submit">Run simulation</button>
          </form>
        </div>
        <div class="pg-status" id="pg-status" role="status" aria-live="polite" hidden><div class="pg-progress"><i></i></div><span class="pg-status-copy"></span></div>
        <div id="pg-message"></div>
        <nav class="pg-tabs" aria-label="Report sections" role="tablist"></nav>
      </header>
      <section class="pg-content" id="pg-content"><div class="pg-neutral"><div><strong>The observatory is opening</strong>Loading simulation reports…</div></div></section>
    </main>`;
}

function renderRunControls(mode = 'round', policy = null) {
  const metadata = state.metadata;
  const defaults = metadata.defaults;
  const policies = metadata.policies.filter((item) => item.modes.includes(mode));
  const profiles = ['revealed', 'fresh', 'both'];
  const chosen = policies.some((item) => item.id === policy) ? policy : defaults[mode];
  const targets = chosen === 'coverage' ? `<label class="pg-field">Target<select name="target" aria-describedby="pg-target-help"><option value="">Deterministic rotation</option>${metadata.targets.map((id) => `<option value="${esc(id)}">${esc(id)}</option>`).join('')}</select><small id="pg-target-help">Coverage only</small></label>` : '';
  $('#pg-mode-controls').outerHTML = `<span id="pg-mode-controls" style="display:contents">
    <label class="pg-field">Mode<select name="mode" aria-label="Simulation mode">${metadata.modes.map((id) => `<option value="${id}"${id === mode ? ' selected' : ''}>${id === 'cycle' ? 'Full Cycle' : 'Round'}</option>`).join('')}</select></label>
    ${mode === 'cycle'
      ? `<label class="pg-field">Cycles<input name="cycles" type="number" min="1" max="${metadata.limits.cycles}" value="${defaults.cycles}" required></label><label class="pg-field">Max Rounds<input name="maxRounds" type="number" min="1" max="${metadata.limits.maxRounds}" value="${defaults.maxRounds}" required></label>`
      : `<label class="pg-field">Runs<input name="runs" type="number" min="1" max="${metadata.limits.runs}" value="${defaults.runs}" required></label><label class="pg-field">Profile<select name="profile">${profiles.map((id) => `<option value="${id}"${id === defaults.profile ? ' selected' : ''}>${id[0].toUpperCase()}${id.slice(1)}</option>`).join('')}</select></label>`}
    <label class="pg-field">Policy<select name="policy">${mode === 'round' ? '<option value="both">Both legacy policies</option>' : ''}${policies.map((item) => `<option value="${esc(item.id)}"${item.id === chosen ? ' selected' : ''}>${esc(item.id)}</option>`).join('')}</select></label>
    <label class="pg-field">Seed<input name="seed" type="number" min="0" value="1" required></label>${targets}
  </span>`;
}

function validateCycleWork(form) {
  const cycles = form.elements.cycles;
  const maxRounds = form.elements.maxRounds;
  if (!cycles || !maxRounds) return true;
  const budget = state.metadata.limits.cycleRounds;
  const valid = Number(cycles.value) * Number(maxRounds.value) <= budget;
  cycles.setCustomValidity(valid ? '' : `Cycles times Max Rounds must be ${budget} or fewer`);
  return valid;
}

function renderTabs() {
  const tabs = visibleTabs();
  if (!tabs.some(([id]) => id === state.tab)) state.tab = 'headline';
  $('.pg-tabs').innerHTML = tabs.map(([id, label]) => `<button class="pg-tab${id === state.tab ? ' active' : ''}" data-tab="${id}" type="button" role="tab" aria-selected="${id === state.tab}" aria-controls="pg-content">${label}</button>`).join('');
}

function reportMeta() {
  const meta = state.report?.meta;
  $('#pg-heading').textContent = meta?.label || state.file || 'No report loaded';
  $('#pg-meta').innerHTML = meta ? [
    reportMode(state.report) === 'cycle'
      ? `<span><b>${count(meta.cycles)}</b> cycles · <b>${count(meta.totalRounds)}</b> Rounds</span>`
      : `<span><b>${count(meta.runs)}</b> plays</span>`,
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
      <small>${report.mode === 'cycle' ? `${count(report.cycles)} cycles · ${count(report.totalRounds)} Rounds` : `${count(report.runs)} plays · ${report.winRate == null ? '—' : pct(report.winRate)} win`}</small>
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
  if (reportMode(state.report) === 'cycle') {
    const c = section.completion || {}; const counts = c.counts || {};
    const interpretation = section.meta?.interpretation || policyDefinition(state.policy)?.reportInterpretation || {};
    const coverage = isCoverage();
    return `<div class="pg-grid"><section class="pg-card wide">
      <span class="pg-badge${coverage ? ' qa' : ''}">${coverage ? 'QA operational context' : 'Machine-policy evidence'}</span>
      <h3>Full Cycle verdict</h3><p class="pg-interpretation">${esc(interpretation.label || (coverage ? 'QA-only operational evidence' : 'Goal-directed machine-policy evidence'))}. ${coverage ? 'This evidence is excluded from balance Compare.' : 'This is not observed player win-rate proof.'}</p>
      <div class="pg-metrics">${metric('Cycles', count(counts.started))}${metric('Rounds', count(section.meta?.totalRounds))}${metric('Completed', count(counts.completed), pct(c.rates?.completion))}${metric('Censored', count(counts.censored), pct(c.rates?.censoring))}${metric('Failed', count(counts.failed), pct(c.rates?.failure))}${metric('Issues', count(section.issues?.length || 0))}</div>
    </section><section class="pg-card wide"><h3>Endpoint</h3><p>Completion means the durable <b>Act IV promise</b> was staged to a specific Round/run id. It does not mean an Act IV victory.</p></section></div>`;
  }
  const h = section.headline || {};
  const interpretation = section.meta?.interpretation ||
    policyDefinition(state.policy)?.reportInterpretation || {};
  const goalDirected = interpretation.id === 'goal-directed-machine';
  return `<div class="pg-grid">
    <section class="pg-card wide">${goalDirected ? `<span class="pg-badge">Machine-policy evidence</span>
      <p class="pg-interpretation">${esc(interpretation.label)}. This is not observed player win-rate proof.</p>` : ''}<div style="display:flex;justify-content:space-between;gap:12px;align-items:end"><h3>Run verdict</h3>${policyPicker()}</div>
      <div class="pg-metrics">${metric('Wins', count(h.wins))}${metric('Win rate', pct(h.winRate), `95% CI ${pct(h.wilson95?.[0])}–${pct(h.wilson95?.[1])}`)}${metric('Avg floors', finite(h.avgFloorsReached).toFixed(2))}${metric('Issues', count(section.issues?.total), section.issues?.total ? 'reproducible seeds captured' : 'no engine or invariant issues')}</div>
      ${flagsBanner(section)}
    </section>
    <section class="pg-card"><h3>Aspect confidence</h3>${wilsonBars(h.byAspect)}</section>
    <section class="pg-card"><h3>Vow confidence</h3>${wilsonBars(h.byVow)}</section>
    <section class="pg-card"><h3>Act reach funnel</h3>${funnel(h.actReach || [])}</section>
    <section class="pg-card"><h3>Aspect × vow stained glass</h3>${aspectVowMatrix(h.byAspectVow)}</section>
    <section class="pg-card wide"><h3>${goalDirected ? 'Machine-policy signals' : 'Balance signals'}</h3>${(section.flags || []).length ? `<div class="pg-flags">${section.flags.map((flag) => `<div class="pg-flag"><b>${esc(flag.kind)}</b> · ${esc(flag.message || flag.id || '')}</div>`).join('')}</div>` : '<div class="pg-muted">No automatic thresholds fired.</div>'}</section>
  </div>`;
}

function cycleRoundTable(rounds) {
  return `<div class="pg-table-wrap"><table class="pg-table"><caption>Round ordinal Dawn rates and at-risk population</caption><thead><tr><th>Round</th><th>At risk</th><th>Dawns</th><th>Falls</th><th>Errors</th><th>Dawn rate</th><th>95% Wilson interval</th></tr></thead><tbody>${(rounds || []).map((row) => `<tr><td>${count(row.ordinal)}</td><td>${count(row.atRisk)}</td><td>${count(row.dawns)}</td><td>${count(row.falls)}</td><td>${count(row.errors)}</td><td>${pct(row.winRate)}</td><td>${pct(row.wilson95?.[0])}–${pct(row.wilson95?.[1])}</td></tr>`).join('')}</tbody></table></div>`;
}

function cycleRoundCurve(rounds) {
  if (!rounds?.length) return '';
  const width = 560; const height = 150; const left = 42; const right = 16; const top = 14; const bottom = 28;
  const x = (index) => left + index * (width - left - right) / Math.max(1, rounds.length - 1);
  const y = (rate) => top + (1 - finite(rate)) * (height - top - bottom);
  const points = rounds.map((row, index) => `${x(index)},${y(row.winRate)}`).join(' ');
  return `<svg class="pg-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="Round ordinal Dawn-rate curve; exact values follow in the table">
    ${[0,.5,1].map((rate) => `<line class="grid" x1="${left}" x2="${width-right}" y1="${y(rate)}" y2="${y(rate)}"/><text x="${left-7}" y="${y(rate)+4}" text-anchor="end">${pct(rate,0)}</text>`).join('')}
    <polyline points="${points}" fill="none" stroke="var(--teal)" stroke-width="3"/>
    ${rounds.map((row,index) => `<circle class="accent" cx="${x(index)}" cy="${y(row.winRate)}" r="4"><title>Round ${row.ordinal}: ${pct(row.winRate)}, at risk ${row.atRisk}</title></circle>`).join('')}
    <text x="${left}" y="${height-6}">Round 1</text><text x="${width-right}" y="${height-6}" text-anchor="end">Round ${count(rounds.at(-1).ordinal)}</text>
  </svg>`;
}

function histogramTable(distribution, empty = 'No completed cycles') {
  const rows = distribution?.histogram || [];
  return rows.length ? `<div class="pg-table-wrap"><table class="pg-table"><caption>${esc(distribution.label || 'Round distribution')}</caption><thead><tr><th>Round</th><th>Cycles</th></tr></thead><tbody>${rows.map((row) => `<tr><td>${count(row.round)}</td><td>${count(row.count)}</td></tr>`).join('')}</tbody></table></div>` : `<div class="pg-neutral"><div><strong>${esc(empty)}</strong>Completion-only values are unavailable; censor and at-risk evidence remains above.</div></div>`;
}

function triggerTable(triggers, coverage) {
  const rows = entries(triggers?.funnels).filter(([, row]) => coverage || row.eligible || row.attempted || row.succeeded || row.missed);
  return `<div class="pg-table-wrap"><table class="pg-table"><caption>Version ${count(triggers?.catalogueVersion)} trigger funnel</caption><thead><tr><th>Trigger</th><th>Context</th><th>Eligible</th><th>Attempted</th><th>Succeeded</th><th>Missed</th><th>Miss reasons</th></tr></thead><tbody>${rows.map(([id, row]) => `<tr><td>${esc(id)}</td><td>${coverage ? '<span class="pg-badge qa">QA only</span>' : 'Quest edge'}</td><td>${count(row.eligible)}</td><td>${count(row.attempted)}</td><td>${count(row.succeeded)}</td><td>${count(row.missed)}</td><td>${esc(entries(row.reasons).map(([reason, n]) => `${reason}: ${count(n)}`).join(', ') || '—')}</td></tr>`).join('')}</tbody></table></div>`;
}

function suffixTable(progressiveSuffix) {
  const rows = progressiveSuffix?.rounds || [];
  return `<div class="pg-table-wrap"><table class="pg-table"><caption>Progressive suffix Dawn rate with whole-cycle cluster-bootstrap interval</caption><thead><tr><th>From Round</th><th>Cycles</th><th>Attempts</th><th>Dawns</th><th>Dawn rate</th><th>Bootstrap 95%</th></tr></thead><tbody>${rows.map((row) => `<tr><td>${count(row.ordinal)}</td><td>${count(row.clusters)}</td><td>${count(row.n)}</td><td>${count(row.wins)}</td><td>${pct(row.winRate)}</td><td>${pct(row.clusterBootstrap95?.[0])}–${pct(row.clusterBootstrap95?.[1])}</td></tr>`).join('')}</tbody></table></div>`;
}

function renderCycle(section) {
  const completion = section.completion || {}; const completed = completion.completedOnly || {};
  const coverage = isCoverage();
  const triggerCard = `<section class="pg-card wide"><span class="pg-badge${coverage ? ' qa' : ''}">${coverage ? 'QA operational evidence' : 'Auditable quest edges'}</span><h3>Quest and trigger funnels</h3>${triggerTable(section.triggers, coverage)}</section>`;
  const body = `<section class="pg-card wide"><h3>Round Dawn rate</h3>${cycleRoundCurve(section.rounds)}${cycleRoundTable(section.rounds)}</section>
    <section class="pg-card wide"><h3>Act IV promise completion and censoring</h3><div class="pg-metrics">${metric('Started', count(completion.counts?.started))}${metric('Completed', count(completion.counts?.completed), pct(completion.rates?.completion))}${metric('Censored', count(completion.counts?.censored), pct(completion.rates?.censoring))}${metric('Failed', count(completion.counts?.failed), 'excluded from timing')}${metric('Completed mean', completed.meanRounds == null ? 'Unavailable' : finite(completed.meanRounds).toFixed(2), completed.label || '')}${metric('Restricted mean', completion.kaplanMeier?.restrictedMeanRounds?.value == null ? 'Unavailable' : finite(completion.kaplanMeier.restrictedMeanRounds.value).toFixed(2), `through Round ${count(completion.kaplanMeier?.restrictedMeanRounds?.through)}`)}</div></section>
    <section class="pg-card"><h3>Round of six-Shard threshold</h3>${histogramTable(completion.threshold, 'No threshold crossings')}</section>
    <section class="pg-card"><h3>Rounds to the Act IV promise</h3>${histogramTable(completion.delivery)}</section>
    <section class="pg-card wide"><h3>Progressive suffix</h3>${suffixTable(section.progressiveSuffix)}<p class="pg-muted">Perfect suffix start: p10 ${completedValue(section.progressiveSuffix?.perfectSuffixStart?.p10)}, p50 ${completedValue(section.progressiveSuffix?.perfectSuffixStart?.p50)}, p90 ${completedValue(section.progressiveSuffix?.perfectSuffixStart?.p90)}.</p></section>`;
  return `<div class="pg-grid">${coverage ? triggerCard + body : body + triggerCard}</div>`;
}

function completedValue(value) { return value == null ? 'unavailable' : `Round ${count(value)}`; }

function deathHeatmap(rows) {
  const lookup = new Map((rows || []).map(([act, row, value]) => [`${act}|${row}`, finite(value)]));
  const max = Math.max(1, ...lookup.values());
  const acts = [0, 1, 2];
  const mapRows = Array.from({ length: 15 }, (_, row) => row);
  return `<div class="pg-heat-wrap"><div class="pg-heat"><b></b>${mapRows.map((row) => `<b>F${row + 1}</b>`).join('')}${acts.map((act) => `<b>Act ${act + 1}</b>${mapRows.map((row) => { const value = lookup.get(`${act}|${row}`) || 0; const alpha = .08 + .82 * value / max; return `<span style="background:rgba(198,52,77,${alpha.toFixed(3)})" title="Act ${act + 1}, floor ${row + 1}: ${count(value)} deaths">${count(value)}</span>`; }).join('')}`).join('')}</div></div>`;
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
  if (Array.isArray(section.issues)) {
    const coverage = isCoverage();
    return `<div class="pg-grid"><section class="pg-card wide"><span class="pg-badge${coverage ? ' qa' : ''}">${coverage ? 'QA operational outcomes' : 'Cycle reproduction evidence'}</span><h3>Cycle issues · ${count(section.issues.length)}</h3>${section.issues.length ? section.issues.map((issue) => {
      const command = issue.reproduction?.command || '';
      return `<article class="pg-issue"><code>${esc(issue.kind)}</code><div>${coverage ? '<span class="pg-badge qa">QA only</span>' : ''}<b>cycle ${count(issue.reproduction?.cycleSeed)} · Round ${count(issue.reproduction?.roundOrdinal)} · run seed ${count(issue.reproduction?.runSeed)}</b><br><span class="pg-muted">${esc(issue.message)}</span><br><code>${esc(command)}</code></div><button class="pg-copy" data-copy="${esc(command)}" type="button" aria-label="Copy reproduction for cycle ${esc(issue.reproduction?.cycleSeed)}">Copy repro</button></article>`;
    }).join('') : '<div class="pg-neutral"><div><strong>No cycle issues</strong>No failed target or simulator error was retained.</div></div>'}</section></div>`;
  }
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

function sharedComparePolicies(reportA, reportB) {
  const shared = Object.keys(reportA?.policies || {}).filter((id) => reportB?.policies?.[id]);
  const order = new Map((state.metadata?.policies || []).map((item, index) => [item.id, index]));
  return shared.sort((left, right) => {
    const leftIndex = order.get(left) ?? Number.MAX_SAFE_INTEGER;
    const rightIndex = order.get(right) ?? Number.MAX_SAFE_INTEGER;
    return leftIndex - rightIndex || left.localeCompare(right);
  });
}

function compareCardRows(sectionA, sectionB) {
  const cardsA = sectionA.cards || {}, cardsB = sectionB.cards || {};
  const ids = [...new Set([...Object.keys(cardsA), ...Object.keys(cardsB)])];
  return ids.map((id) => {
    const a = cardsA[id] || {}, b = cardsB[id] || {};
    const pickA = finite(a.picked) / Math.max(1, finite(a.offered));
    const pickB = finite(b.picked) / Math.max(1, finite(b.offered));
    const winA = a.winRateWhenDrafted == null ? null : finite(a.winRateWhenDrafted);
    const winB = b.winRateWhenDrafted == null ? null : finite(b.winRateWhenDrafted);
    return { id, pickA, pickB, pickDelta: pickB - pickA, winA, winB, winDelta: winA == null || winB == null ? null : winB - winA };
  }).sort((a, b) => Math.abs(b.pickDelta) - Math.abs(a.pickDelta) || a.id.localeCompare(b.id));
}

function compareDeathRows(sectionA, sectionB) {
  const cells = (section) => new Map((section.deaths?.byActRow || []).map(([act, row, value]) => [`${act}|${row}`, finite(value)]));
  const cellsA = cells(sectionA), cellsB = cells(sectionB);
  return [...new Set([...cellsA.keys(), ...cellsB.keys()])].map((key) => {
    const [act, row] = key.split('|').map(Number);
    const a = cellsA.get(key) || 0, b = cellsB.get(key) || 0;
    return { key, label: `Act ${act + 1}, floor ${row + 1}`, a, b, delta: b - a };
  }).sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta) || a.key.localeCompare(b.key));
}

function renderCompare() {
  if (state.reports.length < 2) return '<div class="pg-neutral"><div><strong>Two panes make a comparison</strong>Run or retain at least two reports to unlock signed deltas.</div></div>';
  const reportA = state.cache.get(state.compareA); const reportB = state.cache.get(state.compareB);
  if (!reportA || !reportB) return '<div class="pg-neutral">Loading comparison reports…</div>';
  if (reportSchema(reportA) !== reportSchema(reportB) || reportMode(reportA) !== reportMode(reportB)) {
    return '<div class="pg-neutral"><div><strong>Incompatible populations</strong>Compare requires the same report schema and mode; Round and Full Cycle evidence is never subtracted.</div></div>';
  }
  const sharedPolicies = sharedComparePolicies(reportA, reportB);
  if (!sharedPolicies.includes(state.comparePolicy)) {
    return '<div class="pg-neutral"><div><strong>Policy provenance differs</strong>Select a policy present in both reports.</div></div>';
  }
  const a = sectionFor(reportA, state.comparePolicy); const b = sectionFor(reportB, state.comparePolicy);
  if (!a.section || !b.section) return '<div class="pg-neutral">The selected policy is not present in both reports.</div>';
  const aInterpretation = a.section.meta?.interpretation; const bInterpretation = b.section.meta?.interpretation;
  if (aInterpretation?.balanceEligible === false || bInterpretation?.balanceEligible === false || a.policy === 'coverage' || b.policy === 'coverage') {
    return '<div class="pg-neutral"><div><strong>QA evidence cannot enter balance Compare</strong>Coverage outcomes remain operational trigger evidence only; no deltas were calculated.</div></div>';
  }
  const provenanceA = [a.section.meta?.policyId || a.policy, a.section.meta?.policyVersion, a.section.meta?.knowledgeClass, aInterpretation?.id].join('|');
  const provenanceB = [b.section.meta?.policyId || b.policy, b.section.meta?.policyVersion, b.section.meta?.knowledgeClass, bInterpretation?.id].join('|');
  if (provenanceA !== provenanceB) return '<div class="pg-neutral"><div><strong>Policy provenance differs</strong>Compare requires matching policy version, knowledge class, and interpretation.</div></div>';
  if (reportMode(reportA) === 'cycle') {
    const ac = a.section.completion || {}; const bc = b.section.completion || {};
    const rows = [
      ['Completion rate', ac.rates?.completion, bc.rates?.completion],
      ['Censoring rate', ac.rates?.censoring, bc.rates?.censoring],
      ['Failure rate', ac.rates?.failure, bc.rates?.failure],
    ];
    return `<div class="pg-grid"><section class="pg-card wide"><span class="pg-badge">Goal-directed machine-policy evidence</span><h3>Compatible Full Cycle comparison</h3><p class="pg-interpretation">Not observed player win-rate proof.</p><div class="pg-table-wrap"><table class="pg-table"><thead><tr><th>Measure</th><th>A</th><th>B</th><th>Δ B − A</th></tr></thead><tbody>${rows.map(([label, av, bv]) => `<tr><td>${label}</td><td>${pct(av)}</td><td>${pct(bv)}</td><td>${deltaCell(finite(bv) - finite(av))}</td></tr>`).join('')}</tbody></table></div></section></div>`;
  }
  const ah = a.section.headline || {}, bh = b.section.headline || {};
  const ae = a.section.economy || {}, be = b.section.economy || {};
  const cardRows = compareCardRows(a.section, b.section);
  const deathRows = compareDeathRows(a.section, b.section);
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
    <label class="pg-field">Policy<select id="pg-compare-policy">${sharedPolicies.map((policy) => `<option value="${esc(policy)}"${policy === state.comparePolicy ? ' selected' : ''}>${esc(policy)}</option>`).join('')}</select></label>
  </div><div class="pg-table-wrap"><table class="pg-table"><thead><tr><th>Measure</th><th>A</th><th>B</th><th>Δ B − A</th></tr></thead><tbody>${rows.map(([label,av,bv,d,format])=>`<tr><td>${esc(label)}</td><td>${esc(av)}</td><td>${esc(bv)}</td><td>${deltaCell(d,format)}</td></tr>`).join('')}</tbody></table></div></section>
  <section class="pg-card wide"><h3>Card deltas</h3><div class="pg-table-wrap"><table class="pg-table"><thead><tr><th>Card</th><th>Pick A</th><th>Pick B</th><th>Δ pick</th><th>Win A</th><th>Win B</th><th>Δ win</th></tr></thead><tbody>${cardRows.map((row) => `<tr><td>${esc(row.id)}</td><td>${pct(row.pickA)}</td><td>${pct(row.pickB)}</td><td>${deltaCell(row.pickDelta)}</td><td>${row.winA == null ? '—' : pct(row.winA)}</td><td>${row.winB == null ? '—' : pct(row.winB)}</td><td>${row.winDelta == null ? '<span class="pg-muted">—</span>' : deltaCell(row.winDelta)}</td></tr>`).join('')}</tbody></table></div></section>
  <section class="pg-card wide"><h3>Death deltas by act and floor</h3><div class="pg-table-wrap"><table class="pg-table"><thead><tr><th>Cell</th><th>Deaths A</th><th>Deaths B</th><th>Δ deaths</th></tr></thead><tbody>${deathRows.map((row) => `<tr><td>${esc(row.label)}</td><td>${count(row.a)}</td><td>${count(row.b)}</td><td>${deltaCell(row.delta, (value) => `${finite(value) >= 0 ? '+' : ''}${count(value)}`)}</td></tr>`).join('')}</tbody></table></div></section>
  <section class="pg-card"><h3>A · ${esc(a.policy)}</h3>${wilsonBars(ah.byProfile)}</section><section class="pg-card"><h3>B · ${esc(b.policy)}</h3>${wilsonBars(bh.byProfile)}</section></div>`;
}

function renderContent() {
  reportMeta(); renderRail();
  renderTabs();
  if (!state.report) {
    $('#pg-content').innerHTML = `<div class="pg-neutral"><div><strong>No report in the vault</strong>Use Run sweep above. Progress will appear here and the finished report will open automatically.</div></div>`;
    return;
  }
  const { section } = sectionFor(state.report);
  if (!section) { $('#pg-content').innerHTML = '<div class="pg-neutral">This report has no policy sections.</div>'; return; }
  const renderers = { headline: renderHeadline, deaths: renderDeaths, cards: renderCards, economy: renderEconomy, issues: renderIssues, cycle: renderCycle };
  $('#pg-content').innerHTML = state.tab === 'compare' ? renderCompare() : renderers[state.tab](section);
}

async function loadReport(file) {
  if (!file) return;
  const request = ++state.loadRequest;
  try {
    const report = state.cache.get(file) || await json(`/__sim-report?f=${encodeURIComponent(file)}`);
    state.cache.set(file, report);
    if (request !== state.loadRequest) return;
    state.file = file; state.report = report; state.policy = firstPolicy(report, state.policy);
    if (reportMode(report) === 'cycle') state.comparePolicy = state.policy;
    if (isCoverage(report)) state.tab = 'cycle';
    else if (!visibleTabs(report).some(([id]) => id === state.tab)) state.tab = 'headline';
    state.error = null; renderMessage(); renderContent();
  } catch (error) {
    if (request !== state.loadRequest) return;
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
  const sharedPolicies = sharedComparePolicies(state.cache.get(state.compareA), state.cache.get(state.compareB));
  if (!sharedPolicies.includes(state.comparePolicy)) state.comparePolicy = sharedPolicies[0] || null;
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
  const unit = status.config?.mode === 'cycle' ? 'cycles' : 'plays';
  const details = status.config?.mode === 'cycle'
    ? ` · ${count(status.roundsPlayed)} Rounds · ${count(status.promisesStaged)} promises · ${count(status.censoredCycles)} censored · ${count(status.failedCycles)} failed${status.currentTarget ? ` · target ${status.currentTarget}` : ''}`
    : '';
  let copy = 'Simulation complete';
  if (status.error) copy = 'Simulation failed';
  if (state.running) copy = `${count(done)} / ${total ? count(total) : '…'} ${unit} · ${pct(ratio,0)}${details}`;
  $('.pg-status-copy', node).textContent = copy;
}

async function pollStatus() {
  if (state.launching) return;
  const generation = state.statusGeneration;
  try {
    const status = await json('/__sim-status');
    if (generation !== state.statusGeneration) return;
    const wasRunning = state.running;
    renderStatus(status);
    if (status.error) { state.error = `Runner: ${status.error}`; renderMessage(); }
    if (wasRunning && !status.running && !status.error && status.output !== state.lastOutput) {
      state.lastOutput = status.output || null;
      await refreshReports({ loadLatest: true });
    }
  } catch (error) {
    if (generation !== state.statusGeneration) return;
    state.error = `Status check failed: ${error.message}`; state.running = false; $('.pg-run').disabled = false; renderMessage();
  }
}

function scheduleStatusPoll() {
  if (state.pollStopped) return;
  window.clearTimeout(state.pollTimer);
  state.pollTimer = window.setTimeout(async () => {
    await pollStatus();
    scheduleStatusPoll();
  }, 1000);
}

async function launchRun(form) {
  const data = new FormData(form);
  const workersRaw = data.get('workers');
  const mode = data.get('mode');
  const payload = {
    mode, seed: Number(data.get('seed')), policy: data.get('policy'),
    workers: workersRaw === 'auto' ? 'auto' : Number(workersRaw), label: data.get('label'),
  };
  if (mode === 'cycle') {
    payload.cycles = Number(data.get('cycles'));
    payload.maxRounds = Number(data.get('maxRounds'));
    if (data.get('target')) payload.target = data.get('target');
  } else {
    payload.runs = Number(data.get('runs'));
    payload.profile = data.get('profile');
  }
  try {
    state.statusGeneration++;
    state.launching = true; state.error = null; state.sawRunning = true; state.running = true; renderMessage(); $('.pg-run').disabled = true;
    await json('/__sim-run', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
    state.launching = false;
    await pollStatus();
  } catch (error) {
    state.launching = false; state.running = false; $('.pg-run').disabled = false; state.error = `Could not start sweep: ${error.message}`; renderMessage();
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
    if (event.target.name === 'mode') { renderRunControls(event.target.value); return; }
    if (event.target.name === 'policy') {
      const mode = $('[name="mode"]').value;
      if (mode === 'cycle') { renderRunControls(mode, event.target.value); return; }
    }
    if (event.target.id === 'pg-policy') { state.policy = event.target.value; renderContent(); }
    if (event.target.id === 'pg-compare-a' || event.target.id === 'pg-compare-b') {
      if (event.target.id.endsWith('-a')) state.compareA = event.target.value; else state.compareB = event.target.value;
      await ensureCompareReports(); renderContent();
    }
    if (event.target.id === 'pg-compare-policy') { state.comparePolicy = event.target.value; renderContent(); }
  });
  document.addEventListener('input', (event) => {
    if (event.target.name === 'cycles' || event.target.name === 'maxRounds') {
      validateCycleWork($('#pg-run-form'));
    }
  });
  $('#pg-run-form').addEventListener('submit', (event) => {
    event.preventDefault();
    if (!validateCycleWork(event.currentTarget)) {
      event.currentTarget.reportValidity();
      return;
    }
    launchRun(event.currentTarget);
  });
}

export async function initSimLab() {
  document.title = 'Proving Grounds · Glassvow';
  state.metadata = await json('/__sim-metadata');
  installStyles(); shell(); renderRunControls(); bind();
  await refreshReports();
  await pollStatus();
  scheduleStatusPoll();
  window.addEventListener('pagehide', () => {
    state.pollStopped = true;
    window.clearTimeout(state.pollTimer);
  });
  window.addEventListener('pageshow', (event) => {
    if (!event.persisted) return;
    state.pollStopped = false;
    pollStatus().then(scheduleStatusPoll);
  });
}
