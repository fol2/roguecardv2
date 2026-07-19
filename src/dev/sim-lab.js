// Proving Grounds — dev-only deterministic simulation report lab (?sim=1).
// This module is deliberately self-contained and is lazy-loaded only by the
// import.meta.env.DEV branch in main.js. It consumes persisted report JSON; it
// never imports the browser game or the Node simulation harness.

import { ensureDevStyle, renderShellRail, renderDevHomeLink, mountRailDrawer, setDevTitle } from './chrome.js';

const TABS = Object.freeze([
  ['headline', 'Headline'],
  ['explorer', 'Explorer'],
  ['deaths', 'Deaths'],
  ['cards', 'Cards & Relics'],
  ['economy', 'Economy'],
  ['issues', 'Issues'],
  ['compare', 'Compare'],
]);
const CYCLE_TABS = Object.freeze([
  ['headline', 'Headline'], ['explorer', 'Explorer'], ['cycle', 'Cycle / Progress'], ['issues', 'Issues'], ['compare', 'Compare'],
]);

const ASPECT_LABELS = Object.freeze({ 0: 'Duskblade', 1: 'Ashwarden' });
const SAVED_VIEWS_KEY = 'spirebound_sim_views_v1';
const NONE = 'none';

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
  explorer: {
    dataset: null,
    rows: null,
    columns: null,
    filter: '',
    measure: null,
    candidate: '',
    selected: null,
  },
  savedViews: [],
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
const signedPct = (value) => {
  const number = finite(value);
  const sign = number > 0 ? '+' : number < 0 ? '−' : '';
  return `${sign}${(Math.abs(number) * 100).toFixed(1)} pp`;
};
const duration = (ms) => {
  const seconds = Math.max(0, Math.round(finite(ms) / 1000));
  return seconds < 60 ? `${seconds}s` : `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
};
const entries = (value) => Object.entries(value && typeof value === 'object' ? value : {});
const ratio = (numerator, denominator) => {
  const n = Number(numerator); const d = Number(denominator);
  return Number.isFinite(n) && Number.isFinite(d) && d > 0 ? n / d : null;
};
const aspectLabel = (id) => ASPECT_LABELS[id] || `Aspect ${id}`;
const dimensionLabel = (dimension, value) => {
  if (dimension === 'aspect') return aspectLabel(value);
  if (dimension === 'vow') return `Vow ${value}`;
  if (dimension === 'profile') return String(value)[0]?.toUpperCase() + String(value).slice(1);
  if (dimension === 'ordinal') return `Round ${value}`;
  return String(value);
};
const namedCells = (cells, dimension) => Object.fromEntries(entries(cells).map(([key, value]) => [dimensionLabel(dimension, key), value]));
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
    html, body { min-width: 320px; min-height: 100%; background: var(--dev-bg); }
    html { overflow-x:hidden; overflow-y:auto; }
    body.sim-lab { margin: 0; overflow:visible; color: var(--dev-text); font-family: var(--dev-font); }
    body.sim-lab::before { content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 0;
      background:
        radial-gradient(circle at 76% 18%, rgba(139,124,246,.16), transparent 38%),
        radial-gradient(circle at 18% 82%, rgba(45,212,191,.12), transparent 40%),
        var(--dev-bg); }
    .pg { --gold: var(--dev-accent); --gold-dim: var(--dev-accent-border); --lead: var(--dev-border); --panel: var(--dev-panel);
      --violet: var(--dev-accent); --teal: var(--dev-teal); --rose: var(--dev-red); --muted: var(--dev-muted);
      position: relative; z-index: 1; display: grid; grid-template-columns: 260px minmax(0,1fr);
      grid-template-rows: auto minmax(0,1fr); min-height: 100vh; }
    .pg button, .pg input, .pg select { font: inherit; }
    .pg button, .pg select, .pg input { color: var(--dev-text); border: 1px solid var(--dev-input-border); background: var(--dev-input-bg); }
    .pg button { cursor: pointer; }
    .pg button:disabled { cursor: wait; opacity: .5; }
    .pg button:focus-visible, .pg input:focus-visible, .pg select:focus-visible { outline: 2px solid var(--gold); outline-offset: 2px; }
    .pg-rail { grid-row: 1 / -1; border-right: 1px solid rgba(139,124,246,.28); background: rgba(7,10,18,.94);
      padding: 22px 14px; position: sticky; top: 0; height: 100vh; box-sizing: border-box; overflow: auto; }
    .pg-brand { padding: 3px 8px 18px; border-bottom: 1px solid rgba(139,124,246,.22); }
    .pg-kicker, .pg-eyebrow { color: var(--gold); letter-spacing: .18em; text-transform: uppercase; font: 600 10px/1.4 var(--dev-font); }
    .pg-brand h1 { margin: 6px 0 3px; color: #c9c1fb; font: 600 24px/1.1 var(--dev-font); letter-spacing: .05em; }
    .pg-brand p { margin: 0; color: var(--muted); font-size: 13px; }
    .pg-dev-home {
      display: inline-block; margin-top: 10px; font: 600 11px/1.3 var(--dev-font);
      letter-spacing: .08em; color: var(--gold); text-decoration: none;
      border-bottom: 1px solid transparent; transition: color .15s ease, border-color .15s ease;
    }
    .pg-dev-home:hover { color: #c9c1fb; border-bottom-color: rgba(139,124,246,.45); }
    .pg-rail-title { display: flex; justify-content: space-between; align-items: center; margin: 20px 7px 8px; color: #a7aabd; font-size: 12px; }
    .pg-report-list { display: grid; gap: 7px; }
    .pg-report { width: 100%; padding: 11px 10px; text-align: left; border-radius: 8px; position: relative; overflow: hidden; }
    .pg-report::before { content: ''; position: absolute; inset: 0 auto 0 0; width: 3px; background: transparent; }
    .pg-report:hover { border-color: #2c3048; }
    .pg-report.active { border-color: var(--gold-dim); background: linear-gradient(110deg, rgba(139,124,246,.20), rgba(45,212,191,.06) 70%); }
    .pg-report.active::before { background: var(--gold); box-shadow: 0 0 12px var(--gold); }
    .pg-report strong, .pg-report small { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .pg-report strong { font-weight: 600; color: #e4e5f0; }
    .pg-report small { margin-top: 3px; color: var(--muted); font-size: 11px; }
    .pg-empty-rail { color: var(--muted); padding: 18px 8px; border: 1px dashed var(--lead); border-radius: 8px; text-align: center; }
    .pg-top { grid-column: 2; padding: 20px 26px 16px; border-bottom: 1px solid rgba(139,124,246,.22);
      background: linear-gradient(180deg, rgba(18,23,40,.96), rgba(10,14,25,.84)); position: sticky; top: 0; z-index: 4; }
    .pg-topbar { display: flex; align-items: center; gap: 12px; margin: -20px -26px 14px; padding: 0 22px; height: 48px; border-bottom: 1px solid var(--dev-border); }
    .pg-topbar-title { margin: 0; font: 700 14px var(--dev-font); color: var(--dev-text); letter-spacing: 0.01em; }
    .pg-topbar-param { font: 400 11px var(--dev-mono); color: var(--dev-faint); }
    .pg-topbar .pg-dev-home { margin-top: 0; margin-left: auto; }
    .pg-top-line { display: flex; align-items: center; gap: 18px; }
    .pg-title { min-width: 0; flex: 1; }
    .pg-title h2 { margin: 3px 0 0; color: #c9c1fb; font: 600 clamp(18px,2vw,26px)/1.2 var(--dev-font); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .pg-meta { display: flex; flex-wrap: wrap; gap: 7px 14px; margin-top: 7px; color: var(--muted); font-size: 12px; }
    .pg-meta b { color: #e4e5f0; font-weight: 600; }
    .pg-top-actions { display:flex; align-items:center; justify-content:flex-end; gap:9px; flex-wrap:wrap; }
    .pg-universe { padding:6px 9px; border:1px solid #35405a; border-radius:999px; color:#a7aabd; font-size:10px;
      letter-spacing:.09em; text-transform:uppercase; white-space:nowrap; }
    .pg-secondary, .pg-action { padding:8px 12px; border-radius:7px; color:#e4e5f0!important; }
    .pg-action { border-color:var(--gold-dim)!important; background:linear-gradient(180deg,rgba(139,124,246,.24),rgba(45,212,191,.10))!important; }
    .pg-controls { display: flex; align-items: end; gap: 8px; flex-wrap: wrap; justify-content: flex-end; }
    .pg-control-group { display: contents; border: 0; padding: 0; margin: 0; }
    .pg-control-group legend { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
    .pg-field { display: grid; gap: 3px; color: var(--muted); font-size: 10px; text-transform: uppercase; letter-spacing: .08em; }
    .pg-field input, .pg-field select { border-radius: 6px; padding: 7px 8px; min-width: 68px; box-sizing: border-box; }
    .pg-field input { width: 84px; }
    .pg-field.label input { width: 128px; }
    .pg-run { padding: 8px 13px; border-radius: 6px; border: none!important; color: #fff!important;
      background: linear-gradient(90deg,#8b7cf6,#6d5ce8)!important; font: 600 12px var(--dev-font)!important; }
    .pg-drawer { width:min(820px,calc(100vw - 24px)); max-height:min(88vh,760px); margin:auto; padding:0; color:#eee8d7;
      border:1px solid var(--gold-dim); border-radius:14px; background:linear-gradient(150deg,#171d31,#090d18 72%);
      box-shadow:0 28px 100px rgba(0,0,0,.72); }
    .pg-drawer::backdrop { background:rgba(2,4,9,.78); backdrop-filter:blur(4px); }
    .pg-drawer-head { display:flex; align-items:flex-start; justify-content:space-between; gap:18px; padding:19px 21px;
      border-bottom:1px solid rgba(139,124,246,.24); }
    .pg-drawer-head h2 { margin:3px 0 0; color:#c9c1fb; font:600 20px var(--dev-font); }
    .pg-drawer-body { padding:20px 21px 22px; overflow:auto; }
    .pg-drawer .pg-controls { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); justify-content:stretch; }
    .pg-drawer .pg-field input, .pg-drawer .pg-field select, .pg-drawer .pg-field.label input { width:100%; min-width:0; }
    .pg-drawer .pg-run { align-self:end; }
    .pg-status { margin-top: 12px; display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 9px; }
    .pg-progress { height: 5px; background: #20283a; overflow: hidden; border-radius: 999px; }
    .pg-progress > i { display: block; height: 100%; background: linear-gradient(90deg,var(--teal),var(--gold)); width: 0; transition: width .25s; }
    .pg-status-copy { color: var(--muted); font-size: 11px; font-variant-numeric: tabular-nums; }
    .pg-banner { margin-top: 10px; padding: 9px 12px; border-radius: 6px; font-size: 12px; }
    .pg-banner.error { border: 1px solid rgba(239,119,138,.58); background: rgba(92,28,43,.55); color: #ffc0c8; }
    .pg-banner.flags { border: 1px solid rgba(139,124,246,.38); background: rgba(89,59,15,.35); color: #c9c1fb; }
    .pg-tabs { display: flex; gap: 2px; margin-top: 15px; overflow-x: auto; scrollbar-width: thin; }
    .pg-tab { padding: 8px 11px; border: 0!important; border-bottom: 2px solid transparent!important; background: transparent!important;
      color: var(--muted)!important; white-space: nowrap; font: 600 11px var(--dev-font)!important; }
    .pg-tab.active { color: #c9c1fb!important; border-bottom-color: var(--gold)!important; }
    .pg-content { grid-column: 2; padding: 24px 26px 42px; min-width: 0; }
    .pg-grid { display: grid; grid-template-columns: repeat(12,minmax(0,1fr)); gap: 14px; }
    .pg-card { grid-column: span 6; min-width: 0; padding: 17px; border: 1px solid var(--lead); border-radius: 10px;
      background: linear-gradient(152deg,rgba(27,34,56,.91),rgba(10,14,25,.94)); box-shadow: inset 0 0 0 1px rgba(139,124,246,.06), 0 16px 40px rgba(0,0,0,.22); }
    .pg-card.wide { grid-column: 1 / -1; }
    .pg-card.third { grid-column: span 4; }
    .pg-card h3 { margin: 0 0 13px; color: #c9c1fb; font: 600 13px var(--dev-font); letter-spacing: .07em; }
    .pg-card h2 { margin:0 0 9px; color:#c9c1fb; font:600 clamp(18px,2vw,25px) var(--dev-font); }
    .pg-metrics { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 8px; }
    .pg-metric { padding: 13px 12px; border: 1px solid #30384d; border-radius: 8px; background: rgba(6,9,17,.45); }
    .pg-metric span { display: block; color: var(--muted); font-size: 10px; text-transform: uppercase; letter-spacing: .09em; }
    .pg-metric strong { display: block; margin-top: 4px; color: #c9c1fb; font: 600 22px/1 var(--dev-mono); font-variant-numeric: tabular-nums; }
    .pg-metric small { color: #8286a0; }
    .pg-chart { width: 100%; min-height: 120px; display: block; overflow: visible; }
    .pg-chart text { fill: #a7aabd; font: 11px var(--dev-font); }
    .pg-chart .label { fill: #e4e5f0; }
    .pg-chart .grid { stroke: #313a50; stroke-width: 1; }
    .pg-chart .bar { fill: #5a3b83; }
    .pg-chart .accent { fill: var(--teal); }
    .pg-chart .ci { stroke: #c9c1fb; stroke-width: 2; }
    .pg-chart .overlay { stroke: var(--rose); stroke-width: 2; stroke-dasharray: 4 3; }
    .pg-table-wrap { overflow: auto; max-height: min(62vh,650px); border: 1px solid #2d3549; border-radius: 7px; }
    .pg-table { border-collapse: collapse; width: 100%; min-width: 650px; font-family: var(--dev-mono); font-size: 12px; font-variant-numeric: tabular-nums; }
    .pg-table th { position: sticky; top: 0; z-index: 1; padding: 9px 10px; text-align: right; color: #e4e5f0; background: #161d2d; border-bottom: 1px solid #47516b; }
    .pg-table th:first-child, .pg-table td:first-child { text-align: left; }
    .pg-table th button { border: 0; background: none; color: inherit; padding: 0; font-weight: 600; }
    .pg-table td { padding: 8px 10px; text-align: right; border-bottom: 1px solid rgba(55,65,90,.55); }
    .pg-table tbody tr:hover { background: rgba(91,210,207,.055); }
    .pg-badge { display: inline-block; margin: 0 0 10px; padding: 4px 8px; border: 1px solid var(--gold-dim); border-radius: 999px; color: #c9c1fb; font: 600 10px var(--dev-font); text-transform: uppercase; letter-spacing: .08em; }
    .pg-badge.qa { border-color: var(--rose); color: #ffc0c8; }
    .pg-interpretation { margin: 0 0 14px; color: #c9c1fb; }
    .pg-positive { color: #7de0b1; } .pg-negative { color: #ff9ba8; } .pg-muted { color: var(--muted); }
    .pg-entry-grid { display:grid; grid-template-columns:minmax(0,1.35fr) minmax(260px,.65fr); gap:14px; }
    .pg-signal { position:relative; overflow:hidden; border-color:rgba(139,124,246,.58); background:
      radial-gradient(circle at 88% 12%,rgba(139,124,246,.18),transparent 36%), linear-gradient(145deg,rgba(41,37,61,.96),rgba(10,14,25,.96)); }
    .pg-signal::after { content:''; position:absolute; inset:0 auto 0 0; width:4px; background:linear-gradient(var(--gold),var(--teal)); }
    .pg-signal-lead { margin:0 0 8px; color:#c9c1fb; font:600 clamp(20px,2.5vw,31px)/1.15 var(--dev-font); }
    .pg-contract { display:grid; gap:8px; }
    .pg-contract div { padding:9px 11px; border-left:3px solid var(--teal); background:rgba(91,210,207,.06); }
    .pg-contract .limit { border-left-color:var(--rose); background:rgba(239,119,138,.055); }
    .pg-characters { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:10px; margin-top:13px; }
    .pg-character { padding:13px; border:1px solid #36415a; border-radius:9px; background:rgba(5,8,16,.5); }
    .pg-character-name { display:block; color:#c9c1fb; font:600 12px var(--dev-font); letter-spacing:.06em; }
    .pg-character strong { display:block; margin-top:5px; color:#c9c1fb; font:600 25px var(--dev-font); }
    .pg-explorer-shell { display:grid; grid-template-columns:minmax(0,1fr) minmax(260px,320px); gap:14px; align-items:start; }
    .pg-explorer-main { min-width:0; display:grid; gap:14px; }
    .pg-explorer-head { display:flex; align-items:flex-start; justify-content:space-between; gap:14px; }
    .pg-evidence-strip { display:flex; flex-wrap:wrap; gap:6px; margin-top:7px; }
    .pg-evidence-strip span { padding:4px 7px; border:1px solid #34405a; border-radius:999px; color:#a7aabd; font-size:10px; }
    .pg-shelves { display:grid; grid-template-columns:repeat(6,minmax(0,1fr)); gap:8px; padding:13px; border:1px solid #303a52;
      border-radius:10px; background:rgba(7,10,18,.64); }
    .pg-shelves .pg-field select { width:100%; min-width:0; }
    .pg-saved { display:flex; align-items:end; gap:8px; flex-wrap:wrap; }
    .pg-saved .pg-field { min-width:190px; flex:1; }
    .pg-saved .pg-field input { width:100%; }
    .pg-saved-list { display:flex; gap:6px; flex-wrap:wrap; margin-top:9px; }
    .pg-saved-list button { padding:6px 9px; border-radius:999px; color:#e4e5f0; }
    .pg-compat { padding:9px 11px; border-radius:7px; border:1px solid rgba(91,210,207,.38); color:#aee9dc;
      background:rgba(28,91,91,.17); }
    .pg-compat.blocked { border-color:rgba(239,119,138,.42); color:#ffc0c8; background:rgba(92,28,43,.26); }
    .pg-grain { padding:18px; border:1px dashed var(--rose); border-radius:9px; color:#e7c4c7; background:rgba(82,25,40,.18); }
    .pg-grain strong { display:block; color:#ffc4cb; font:600 15px var(--dev-font); margin-bottom:5px; }
    .pg-pivot-cell { display:block; width:100%; min-width:92px; padding:7px 8px!important; border:0!important; border-radius:5px;
      background:transparent!important; color:inherit!important; text-align:right; }
    .pg-pivot-cell:hover, .pg-pivot-cell.selected { background:rgba(91,210,207,.09)!important; box-shadow:inset 0 0 0 1px rgba(91,210,207,.25); }
    .pg-pivot-cell strong, .pg-pivot-cell small { display:block; }
    .pg-pivot-cell small { color:#8286a0; }
    .pg-pivot-cell .pg-negative { color:#ff9ba8; }
    .pg-pivot-cell .pg-positive { color:#7de0b1; }
    .pg-inspector { grid-column:auto; position:sticky; top:178px; min-width:0; }
    .pg-inspector dl { display:grid; grid-template-columns:auto 1fr; gap:7px 12px; margin:0; }
    .pg-inspector dt { color:var(--muted); }
    .pg-inspector dd { margin:0; text-align:right; overflow-wrap:anywhere; }
    .pg-inspector .pg-neutral { min-height:180px; padding:18px; }
    .pg-flags { display: grid; gap: 7px; }
    .pg-flag { padding: 9px 11px; border-left: 3px solid var(--gold); background: rgba(139,124,246,.07); }
    .pg-issue { display: grid; grid-template-columns: auto 1fr auto; gap: 11px; align-items: start; padding: 11px 0; border-bottom: 1px solid #30384d; }
    .pg-issue code { color: #c9c1fb; }
    .pg-copy { padding: 5px 8px; border-radius: 5px; color: #e4e5f0!important; }
    .pg-compare-controls { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 14px; }
    .pg-compare-controls select { min-width: 190px; padding: 7px; border-radius: 6px; }
    .pg-neutral { min-height: 280px; display: grid; place-items: center; text-align: center; color: var(--muted); border: 1px dashed #37415a; border-radius: 10px; padding: 30px; }
    .pg-neutral strong { display: block; color: #c9c1fb; font: 600 17px var(--dev-font); margin-bottom: 6px; }
    .pg-heat-wrap { overflow-x: auto; }
    .pg-heat { display: grid; grid-template-columns: 48px repeat(15,minmax(34px,1fr)); gap: 5px; align-items: stretch; min-width: 650px; }
    .pg-heat b, .pg-heat span { min-height: 38px; display: grid; place-items: center; border-radius: 5px; font-size: 11px; }
    .pg-heat b { color: #a7aabd; font-weight: 400; }
    .pg-heat span { border: 1px solid rgba(239,119,138,.18); color: #fff1e8; }
    @media (max-width: 980px) {
      .pg { grid-template-columns: minmax(0,1fr); grid-template-rows: auto auto 1fr; width: 100%; overflow-x:clip; overflow-y:visible; }
      .pg-rail { grid-row: 1; height: auto; position: sticky; top: 0; z-index: 6; border-right: 0; border-bottom: 1px solid rgba(139,124,246,.25); padding: 12px 14px; background: rgba(7,10,18,.96); }
      .pg-rail, .pg-top, .pg-content { min-width: 0; width: 100%; box-sizing: border-box; }
      .pg-brand { padding: 2px 2px 10px; } .pg-brand p { display:none; }
      .pg-rail-title { display:none; } .pg-report-list { display:flex; overflow-x:auto; padding-top:10px; }
      .pg-report { min-width: 180px; } .pg-empty-rail { margin-top: 10px; }
      .pg-top, .pg-content { grid-column: 1; } .pg-top { position: static; top: auto; padding: 14px; }
      .pg-topbar { margin: 0 0 12px; padding: 0; height: auto; min-height: 40px; }
      .pg-top-line { display:grid; } .pg-controls { justify-content:flex-start; }
      .pg-content { padding:14px 14px 34px; } .pg-card, .pg-card.third { grid-column: 1 / -1; }
      .pg-entry-grid, .pg-explorer-shell { grid-template-columns:minmax(0,1fr); }
      .pg-inspector { position:static; }
      .pg-shelves { grid-template-columns:repeat(3,minmax(0,1fr)); }
    }
    @media (max-width: 620px) {
      .pg-title h2 { white-space: normal; } .pg-field.label { display:grid; grid-column:span 2; }
      .pg-controls { display:grid; grid-template-columns: repeat(3,1fr); width:100%; }
      .pg-control-group { display: contents; }
      .pg-field input, .pg-field select, .pg-field.label input { width:100%; min-width:0; } .pg-run { align-self:end; }
      .pg-metrics { grid-template-columns: repeat(2,1fr); } .pg-card { padding:13px; }
      .pg-status { grid-template-columns:1fr; } .pg-meta { display:none; }
      .pg-top-actions { justify-content:flex-start; } .pg-universe { display:none; }
      .pg-drawer { width:100vw; max-width:none; height:100dvh; max-height:none; margin:0; border-radius:0; }
      .pg-drawer .pg-controls { grid-template-columns:repeat(2,minmax(0,1fr)); }
      .pg-shelves { grid-template-columns:repeat(2,minmax(0,1fr)); }
      .pg-explorer-head { display:grid; } .pg-characters { grid-template-columns:1fr; }
    }
    @media (prefers-reduced-motion: reduce) { .pg *, .pg *::before, .pg *::after { transition: none!important; animation: none!important; } }
    /* Observatory rail integration: .pg scrolls inside the fixed dev-shell; rail collapses with the tool's own responsive breakpoint. */
    .dev-shell > .pg { flex: 1; min-width: 0; height: 100vh; min-height: 0; overflow-y: auto; overflow-x: hidden; }
    @media (max-width: 980px) { .dev-shell > .dev-rail { display: none; } }
  `;
  document.head.append(style);
}

function shell() {
  document.body.className = 'sim-lab';
  ensureDevStyle();
  document.body.innerHTML = `
    <div class="dev-shell" data-sim-shell>
    ${renderShellRail({ activeParam: 'sim' })}
    <main class="pg">
      <aside class="pg-rail" aria-label="Simulation reports">
        <div class="pg-rail-title"><span>Report vault</span><span id="pg-report-count">0</span></div>
        <div class="pg-report-list" id="pg-report-list"><div class="pg-empty-rail">Reading the archive…</div></div>
      </aside>
      <header class="pg-top">
        <div class="pg-topbar"><button type="button" class="dev-menu-btn dev-menu-rail" data-dev-menu title="Dev tools" aria-label="Dev tools">☰</button><h1 class="pg-topbar-title">Proving Grounds</h1><span class="pg-topbar-param">?sim=1</span>${renderDevHomeLink({ className: 'pg-dev-home' })}</div>
        <div class="pg-top-line">
          <div class="pg-title"><div class="pg-eyebrow">Selected report</div><h2 id="pg-heading">No report loaded</h2><div class="pg-meta" id="pg-meta"></div></div>
          <div class="pg-top-actions"><span class="pg-universe" id="pg-universe">No evidence universe</span><button class="pg-action" data-open-runner type="button">New sweep</button></div>
        </div>
        <div class="pg-status" id="pg-status" role="status" aria-live="polite" hidden><div class="pg-progress"><i></i></div><span class="pg-status-copy"></span></div>
        <div id="pg-message"></div>
        <nav class="pg-tabs" aria-label="Report sections" role="tablist"></nav>
      </header>
      <section class="pg-content" id="pg-content"><div class="pg-neutral"><div><strong>The observatory is opening</strong>Loading simulation reports…</div></div></section>
      <dialog class="pg-drawer" id="pg-runner" aria-labelledby="pg-runner-title">
        <div class="pg-drawer-head"><div><div class="pg-eyebrow">Deterministic runner</div><h2 id="pg-runner-title">New simulation sweep</h2></div><button class="pg-secondary" data-close-runner type="button">Close</button></div>
        <div class="pg-drawer-body">
          <p class="pg-interpretation">Round balance, Full Cycle progression, and QA coverage keep separate evidence contracts. Only valid controls for the selected mode are shown.</p>
          <form class="pg-controls" id="pg-run-form" aria-label="Run simulation">
            <fieldset class="pg-control-group"><legend>Simulation population and machine policy</legend><span id="pg-mode-controls"></span></fieldset>
            <label class="pg-field">Workers<select name="workers"><option value="auto">Auto</option><option>1</option><option>2</option><option>4</option><option>8</option></select></label>
            <label class="pg-field label">Label<input name="label" value="${esc(state.metadata?.defaults?.label || 'proving-grounds')}" pattern="[A-Za-z0-9._-]+" required></label>
            <button class="pg-run" type="submit">Run simulation</button>
          </form>
        </div>
      </dialog>
    </main>
    </div>`;
  const drawer = mountRailDrawer('sim');
  document.querySelector('[data-dev-menu]').addEventListener('click', () => drawer.toggle());
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
  const universe = !state.report ? 'No evidence universe'
    : isCoverage() ? 'QA triggers · operational only'
      : reportMode(state.report) === 'cycle' ? 'Promise cycles · schema 2'
        : 'Balance rounds · schema 1';
  $('#pg-universe').textContent = universe;
}

function renderRail() {
  $('#pg-report-count').textContent = String(state.reports.length);
  $('#pg-report-list').innerHTML = state.reports.length ? state.reports.map((report) => `
    <button class="pg-report${report.name === state.file ? ' active' : ''}" data-report="${esc(report.name)}" type="button" title="${esc(report.label || report.name)}">
      <strong>${esc(report.label || report.name)}</strong>
      <small>${report.balanceEligible === false ? 'QA · ' : report.mode === 'cycle' ? 'Promise · ' : 'Balance · '}${report.mode === 'cycle' ? `${count(report.cycles)} cycles · ${count(report.totalRounds)} Rounds` : `${count(report.runs)} plays · ${report.winRate == null ? '—' : pct(report.winRate)} win`}</small>
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
    ${aspects.map((aspect, row) => `<text class="label" x="${left - 8}" y="${top + row * cellH + 28}" text-anchor="end">${esc(aspectLabel(aspect))}</text>${vows.map((vow, col) => {
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

function aspectSignal(headline) {
  const rows = entries(headline?.byAspect).map(([id, cell]) => ({ id, cell }))
    .sort((left, right) => finite(right.cell.winRate) - finite(left.cell.winRate));
  if (rows.length < 2) return null;
  const [high, low] = rows;
  return {
    high, low,
    delta: finite(high.cell.winRate) - finite(low.cell.winRate),
    text: `${aspectLabel(high.id)} leads ${aspectLabel(low.id)} by ${Math.abs((finite(high.cell.winRate) - finite(low.cell.winRate)) * 100).toFixed(1)} pp`,
  };
}

function evidenceContract(section) {
  const interpretation = section.meta?.interpretation || policyDefinition(state.policy)?.reportInterpretation || {};
  if (isCoverage()) return { supports: 'Deterministic trigger and reproduction evidence.', limit: 'QA-only: excluded from balance deltas and player claims.' };
  if (interpretation.id === 'goal-directed-machine') return { supports: 'Goal-directed machine-policy balance investigation.', limit: 'Does not support observed player win-rate claims.' };
  if (state.policy === 'random') return { supports: 'Seeded floor-stress baseline and simulator reach checks.', limit: 'Does not support player balance or normal win-rate claims.' };
  return { supports: 'Win-first machine-policy balance investigation.', limit: 'Does not support observed player behaviour or global optimal play.' };
}

function renderHeadline(section) {
  if (reportMode(state.report) === 'cycle') {
    const c = section.completion || {}; const counts = c.counts || {};
    const interpretation = section.meta?.interpretation || policyDefinition(state.policy)?.reportInterpretation || {};
    const coverage = isCoverage();
    const failed = finite(counts.failed); const contract = evidenceContract(section);
    return `<div class="pg-grid"><div class="pg-entry-grid" style="grid-column:1/-1"><section class="pg-card pg-signal">
      <span class="pg-badge${coverage || failed ? ' qa' : ''}">${coverage ? 'QA case' : failed ? 'Qualified evidence' : 'Healthy evidence'}</span>
      <h3>${coverage ? 'Trigger outcome' : 'Strongest progression finding'}</h3>
      <p class="pg-signal-lead">${failed ? `${count(failed)} failed cycle${failed === 1 ? '' : 's'} require separation` : `${pct(c.rates?.completion)} reached the Act IV promise`}</p>
      <p>${failed ? `${count(counts.timingPopulation ?? (finite(counts.started) - failed))} cycles remain in the timing population; failures are not Falls.` : `${count(counts.completed)} of ${count(counts.started)} cycles completed.`}</p>
      <button class="pg-action" data-open-explorer type="button">Open Pivot Explorer</button>
    </section><section class="pg-card"><h3>Evidence contract</h3><div class="pg-contract"><div><b>Supports</b><br>${esc(contract.supports)}</div><div class="limit"><b>Does not support</b><br>${esc(contract.limit)}</div></div></section></div>
    <section class="pg-card wide">
      <span class="pg-badge${coverage ? ' qa' : ''}">${coverage ? 'QA operational context' : 'Machine-policy evidence'}</span>
      <h3>Full Cycle verdict</h3><p class="pg-interpretation">${esc(interpretation.label || (coverage ? 'QA-only operational evidence' : 'Goal-directed machine-policy evidence'))}. ${coverage ? 'This evidence is excluded from balance Compare.' : 'This is not observed player win-rate proof.'}</p>
      <div class="pg-metrics">${metric('Cycles', count(counts.started))}${metric('Rounds', count(section.meta?.totalRounds))}${metric('Completed', count(counts.completed), pct(c.rates?.completion))}${metric('Censored', count(counts.censored), pct(c.rates?.censoring))}${metric('Failed', count(counts.failed), pct(c.rates?.failure))}${metric('Issues', count(section.issues?.length || 0))}</div>
    </section><section class="pg-card wide"><h3>Endpoint</h3><p>Completion means the durable <b>Act IV promise</b> was staged to a specific Round/run id. It does not mean an Act IV victory.</p></section></div>`;
  }
  const h = section.headline || {};
  const interpretation = section.meta?.interpretation ||
    policyDefinition(state.policy)?.reportInterpretation || {};
  const goalDirected = interpretation.id === 'goal-directed-machine';
  const signal = aspectSignal(h); const contract = evidenceContract(section);
  return `<div class="pg-grid"><div class="pg-entry-grid" style="grid-column:1/-1"><section class="pg-card pg-signal">
    <span class="pg-badge">${section.issues?.total ? 'Qualified evidence' : 'Healthy evidence'}</span>
    <h3>Strongest balance signal</h3>
    <p class="pg-signal-lead">${esc(signal?.text || 'Character comparison needs both Aspects')}</p>
    ${signal ? `<div class="pg-characters"><div class="pg-character"><span class="pg-character-name">${esc(aspectLabel(signal.low.id))}</span><strong>${pct(signal.low.cell.winRate)}</strong><small>n=${count(signal.low.cell.n)} · 95% CI ${pct(signal.low.cell.wilson95?.[0])}–${pct(signal.low.cell.wilson95?.[1])}</small></div><div class="pg-character"><span class="pg-character-name">${esc(aspectLabel(signal.high.id))}</span><strong>${pct(signal.high.cell.winRate)}</strong><small>n=${count(signal.high.cell.n)} · 95% CI ${pct(signal.high.cell.wilson95?.[0])}–${pct(signal.high.cell.wilson95?.[1])}</small></div></div>` : '<p class="pg-muted">Load a report containing both character slices to establish the character norm.</p>'}
    <p><button class="pg-action" data-open-explorer type="button">Open Pivot Explorer</button></p>
  </section><section class="pg-card"><h3>Evidence contract</h3><div class="pg-contract"><div><b>Supports</b><br>${esc(contract.supports)}</div><div class="limit"><b>Does not support</b><br>${esc(contract.limit)}</div></div></section></div>
    <section class="pg-card wide">${goalDirected ? `<span class="pg-badge">Machine-policy evidence</span>
      <p class="pg-interpretation">${esc(interpretation.label)}. This is not observed player win-rate proof.</p>` : ''}<div style="display:flex;justify-content:space-between;gap:12px;align-items:end"><h3>Run verdict</h3>${policyPicker()}</div>
      <div class="pg-metrics">${metric('Wins', count(h.wins))}${metric('Win rate', pct(h.winRate), `95% CI ${pct(h.wilson95?.[0])}–${pct(h.wilson95?.[1])}`)}${metric('Avg floors', finite(h.avgFloorsReached).toFixed(2))}${metric('Issues', count(section.issues?.total), section.issues?.total ? 'reproducible seeds captured' : 'no engine or invariant issues')}</div>
      ${flagsBanner(section)}
    </section>
    <section class="pg-card"><h3>Character confidence</h3>${wilsonBars(namedCells(h.byAspect, 'aspect'))}</section>
    <section class="pg-card"><h3>Vow confidence</h3>${wilsonBars(h.byVow)}</section>
    <section class="pg-card"><h3>Act reach funnel</h3>${funnel(h.actReach || [])}</section>
    <section class="pg-card"><h3>Character × Vow stained glass</h3>${aspectVowMatrix(h.byAspectVow)}</section>
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
    const a = cardsA[id], b = cardsB[id];
    const pickA = a ? ratio(a.picked, a.offered) : null;
    const pickB = b ? ratio(b.picked, b.offered) : null;
    const winA = a?.winRateWhenDrafted == null ? null : finite(a.winRateWhenDrafted);
    const winB = b?.winRateWhenDrafted == null ? null : finite(b.winRateWhenDrafted);
    return { id, pickA, pickB, pickDelta: pickA == null || pickB == null ? null : pickB - pickA, winA, winB, winDelta: winA == null || winB == null ? null : winB - winA };
  }).sort((a, b) => Math.abs(b.pickDelta || 0) - Math.abs(a.pickDelta || 0) || a.id.localeCompare(b.id));
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
  const compatibility = comparisonCompatibility(reportA, reportB, state.comparePolicy);
  if (!compatibility.ok) return `<div class="pg-neutral"><div><strong>${esc(compatibility.label)}</strong>${esc(compatibility.reason)}</div></div>`;
  const aInterpretation = a.section.meta?.interpretation;
  if (reportMode(reportA) === 'cycle') {
    const ac = a.section.completion || {}; const bc = b.section.completion || {};
    const rows = [
      ['Completion rate', ac.rates?.completion, bc.rates?.completion],
      ['Censoring rate', ac.rates?.censoring, bc.rates?.censoring],
      ['Failure rate', ac.rates?.failure, bc.rates?.failure],
    ];
    return `<div class="pg-grid"><section class="pg-card wide"><span class="pg-badge">Goal-directed machine-policy evidence</span><h3>Compatible Full Cycle comparison</h3><p class="pg-interpretation">Not observed player win-rate proof.</p><div class="pg-table-wrap"><table class="pg-table"><thead><tr><th>Measure</th><th>A</th><th>B</th><th>Δ B − A</th></tr></thead><tbody>${rows.map(([label, av, bv]) => `<tr><td>${label}</td><td>${av == null ? '—' : pct(av)}</td><td>${bv == null ? '—' : pct(bv)}</td><td>${av == null || bv == null ? '<span class="pg-muted">—</span>' : deltaCell(finite(bv) - finite(av))}</td></tr>`).join('')}</tbody></table></div></section></div>`;
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
  const interpretation = aInterpretation?.id === 'goal-directed-machine'
    ? `<span class="pg-badge">${esc(aInterpretation.label || 'Goal-directed machine-policy evidence')}</span><p class="pg-interpretation">Not observed player win-rate proof.</p>`
    : '';
  return `<div class="pg-grid"><section class="pg-card wide">${interpretation}<h3>A/B balance glass</h3><div class="pg-compare-controls">
    <label class="pg-field">Report A<select id="pg-compare-a">${compareOptions(state.compareA)}</select></label>
    <label class="pg-field">Report B<select id="pg-compare-b">${compareOptions(state.compareB)}</select></label>
    <label class="pg-field">Policy<select id="pg-compare-policy">${sharedPolicies.map((policy) => `<option value="${esc(policy)}"${policy === state.comparePolicy ? ' selected' : ''}>${esc(policy)}</option>`).join('')}</select></label>
  </div><div class="pg-table-wrap"><table class="pg-table"><thead><tr><th>Measure</th><th>A</th><th>B</th><th>Δ B − A</th></tr></thead><tbody>${rows.map(([label,av,bv,d,format])=>`<tr><td>${esc(label)}</td><td>${esc(av)}</td><td>${esc(bv)}</td><td>${deltaCell(d,format)}</td></tr>`).join('')}</tbody></table></div></section>
  <section class="pg-card wide"><h3>Card deltas</h3><div class="pg-table-wrap"><table class="pg-table"><thead><tr><th>Card</th><th>Pick A</th><th>Pick B</th><th>Δ pick</th><th>Win A</th><th>Win B</th><th>Δ win</th></tr></thead><tbody>${cardRows.map((row) => `<tr><td>${esc(row.id)}</td><td>${row.pickA == null ? '—' : pct(row.pickA)}</td><td>${row.pickB == null ? '—' : pct(row.pickB)}</td><td>${row.pickDelta == null ? '<span class="pg-muted">—</span>' : deltaCell(row.pickDelta)}</td><td>${row.winA == null ? '—' : pct(row.winA)}</td><td>${row.winB == null ? '—' : pct(row.winB)}</td><td>${row.winDelta == null ? '<span class="pg-muted">—</span>' : deltaCell(row.winDelta)}</td></tr>`).join('')}</tbody></table></div></section>
  <section class="pg-card wide"><h3>Death deltas by act and floor</h3><div class="pg-table-wrap"><table class="pg-table"><thead><tr><th>Cell</th><th>Deaths A</th><th>Deaths B</th><th>Δ deaths</th></tr></thead><tbody>${deathRows.map((row) => `<tr><td>${esc(row.label)}</td><td>${count(row.a)}</td><td>${count(row.b)}</td><td>${deltaCell(row.delta, (value) => `${finite(value) >= 0 ? '+' : ''}${count(value)}`)}</td></tr>`).join('')}</tbody></table></div></section>
  <section class="pg-card"><h3>A · ${esc(a.policy)}</h3>${wilsonBars(ah.byProfile)}</section><section class="pg-card"><h3>B · ${esc(b.policy)}</h3>${wilsonBars(bh.byProfile)}</section></div>`;
}

function explorerDefaults(report = state.report) {
  if (reportMode(report) === 'cycle') {
    return { dataset: isCoverage(report) ? 'triggers' : 'cycle-rounds', rows: isCoverage(report) ? 'trigger' : 'ordinal', columns: NONE, filter: '', measure: 'all', candidate: '', selected: null };
  }
  return { dataset: 'win-rate', rows: 'aspect', columns: 'vow', filter: '', measure: 'winRate', candidate: '', selected: null };
}

function resetExplorer(report = state.report) {
  state.explorer = explorerDefaults(report);
}

function explorerDatasets(report = state.report) {
  return reportMode(report) === 'cycle'
    ? [
      ['cycle-rounds', 'Round progression'],
      ['cycle-completion', 'Promise completion'],
      ['triggers', 'Quest triggers'],
    ]
    : [
      ['win-rate', 'Win rates'],
      ['cards', 'Card drafts'],
      ['relics', 'Relic conversion'],
      ['deaths', 'Deaths'],
      ['economy', 'Economy'],
    ];
}

function explorerControls(dataset = state.explorer.dataset) {
  if (dataset === 'win-rate') return {
    rows: [['aspect', 'Character'], ['vow', 'Vow'], ['profile', 'Profile'], [NONE, 'Single total']],
    columns: [['vow', 'Vow'], ['aspect', 'Character'], ['profile', 'Profile'], [NONE, 'None']],
    measures: [['winRate', 'Win rate'], ['wins', 'Wins'], ['n', 'Population']],
  };
  if (dataset === 'cards') return {
    rows: [['card', 'Card']], columns: [[NONE, 'None']],
    measures: [['pickRate', 'Pick rate'], ['winRateWhenDrafted', 'Win when drafted'], ['offered', 'Offered'], ['picked', 'Picked'], ['avgCopiesWin', 'Copies · wins'], ['avgCopiesLoss', 'Copies · losses']],
  };
  if (dataset === 'relics') return {
    rows: [['relic', 'Relic']], columns: [[NONE, 'None']],
    measures: [['takeRate', 'Take rate'], ['winRateWhenTaken', 'Win when taken'], ['seen', 'Seen'], ['taken', 'Taken']],
  };
  if (dataset === 'deaths') return {
    rows: [['enemy', 'Enemy'], ['kind', 'Death kind'], ['act-floor', 'Act / floor']], columns: [[NONE, 'None']],
    measures: [['deaths', 'Deaths'], ['encounters', 'Encounters'], ['lethality', 'Deaths / encounter']],
  };
  if (dataset === 'economy') return { rows: [['metric', 'Metric']], columns: [[NONE, 'None']], measures: [['value', 'Value']] };
  if (dataset === 'cycle-rounds') return { rows: [['ordinal', 'Round ordinal']], columns: [[NONE, 'Measures']], measures: [['all', 'Dawn + suffix evidence'], ['dawn', 'Dawn rate'], ['suffix', 'Suffix Dawn rate']] };
  if (dataset === 'cycle-completion') return { rows: [['metric', 'Metric']], columns: [[NONE, 'None']], measures: [['value', 'Value']] };
  return { rows: [['trigger', 'Trigger']], columns: [[NONE, 'Measures']], measures: [['all', 'Full funnel'], ['successRate', 'Success rate'], ['missed', 'Missed']] };
}

function selectOptions(options, selected) {
  return options.map(([value, label]) => `<option value="${esc(value)}"${value === selected ? ' selected' : ''}>${esc(label)}</option>`).join('');
}

function normaliseExplorer() {
  const datasets = explorerDatasets();
  if (!datasets.some(([id]) => id === state.explorer.dataset)) Object.assign(state.explorer, explorerDefaults());
  const controls = explorerControls();
  if (!controls.rows.some(([id]) => id === state.explorer.rows)) state.explorer.rows = controls.rows[0][0];
  if (!controls.columns.some(([id]) => id === state.explorer.columns)) state.explorer.columns = controls.columns[0][0];
  if (!controls.measures.some(([id]) => id === state.explorer.measure)) state.explorer.measure = controls.measures[0][0];
}

function policyProvenance(report, policy) {
  const section = report?.policies?.[policy];
  const meta = section?.meta; const interpretation = meta?.interpretation;
  const required = [meta?.policyId, meta?.policyVersion, meta?.knowledgeClass, interpretation?.id, interpretation?.balanceEligible];
  if (!section || required.some((value) => value == null || value === '')) {
    return { ok: false, reason: 'Policy id, version, knowledge class, interpretation, and balance eligibility must be retained explicitly.' };
  }
  const mode = reportMode(report); const semantic = [];
  if (mode === 'cycle') {
    const maxRounds = meta.maxRounds ?? report?.meta?.maxRounds ?? report?.meta?.config?.maxRounds;
    const catalogueVersion = meta.triggerCatalogueVersion ?? section?.triggers?.catalogueVersion;
    if (!Number.isInteger(Number(maxRounds)) || Number(maxRounds) < 1 || catalogueVersion == null) {
      return { ok: false, reason: 'Full Cycle comparisons require an explicit maxRounds horizon and trigger catalogue version.' };
    }
    semantic.push(Number(maxRounds), Number(catalogueVersion));
  }
  return {
    ok: true,
    balanceEligible: interpretation.balanceEligible,
    key: JSON.stringify([
      reportSchema(report), mode, meta.policyId, meta.policyVersion,
      meta.knowledgeClass, interpretation.id, interpretation.balanceEligible, ...semantic,
    ]),
  };
}

function comparisonCompatibility(source, candidate, policy) {
  if (!candidate) return { ok: false, label: 'No candidate selected', reason: 'Choose a compatible report to add signed Candidate − Source deltas.' };
  if (!source?.policies?.[policy]) return { ok: false, label: 'Source provenance incomplete', reason: `Source does not contain ${policy}.` };
  if (!candidate.policies?.[policy]) return { ok: false, label: 'Policy provenance differs', reason: `Candidate does not contain ${policy}.` };
  if (isCoverage(source, policy) || isCoverage(candidate, policy)) return { ok: false, label: 'QA context only', reason: 'Coverage evidence cannot produce balance deltas.' };
  const sourceProvenance = policyProvenance(source, policy); const candidateProvenance = policyProvenance(candidate, policy);
  if (!sourceProvenance.ok) return { ok: false, label: 'Source provenance incomplete', reason: sourceProvenance.reason };
  if (!candidateProvenance.ok) return { ok: false, label: 'Candidate provenance incomplete', reason: candidateProvenance.reason };
  if (sourceProvenance.balanceEligible !== true || candidateProvenance.balanceEligible !== true) {
    return { ok: false, label: 'Balance eligibility required', reason: 'Both reports must explicitly retain balanceEligible: true.' };
  }
  if (sourceProvenance.key !== candidateProvenance.key) {
    return { ok: false, label: 'Incompatible evidence universes', reason: 'Schema, mode, policy version, knowledge class, interpretation, eligibility, and Cycle horizon must all match.' };
  }
  return { ok: true, label: 'Compatible delta', reason: 'Candidate − Source is available for cells present at the same aggregate grain.', sourceProvenance, candidateProvenance };
}

function explorerCompatibility(candidate) {
  return comparisonCompatibility(state.report, candidate, state.policy);
}

function candidateOptions() {
  const options = ['<option value="">No candidate</option>'];
  for (const report of state.reports) {
    if (report.name === state.file) continue;
    options.push(`<option value="${esc(report.name)}"${report.name === state.explorer.candidate ? ' selected' : ''}>${esc(report.label || report.name)}</option>`);
  }
  return options.join('');
}

function winRateCells(section, dimensions) {
  const dims = dimensions.filter((item) => item !== NONE);
  const headline = section?.headline || {};
  if (!dims.length) return { cells: new Map([['all', { n: section?.meta?.runs, wins: headline.wins, winRate: headline.winRate, wilson95: headline.wilson95 }]]) };
  if (dims.length === 1) {
    const [dimension] = dims;
    const source = dimension === 'aspect' ? headline.byAspect : dimension === 'vow' ? headline.byVow : dimension === 'profile' ? headline.byProfile : null;
    if (!source) return null;
    return { cells: new Map(entries(source).map(([key, value]) => [key, value])) };
  }
  if (dims.length === 2 && new Set(dims).size === 2 && dims.includes('aspect') && dims.includes('vow')) {
    if (!entries(headline.byAspectVow).length) return null;
    const aspectFirst = dimensions[0] === 'aspect';
    return { cells: new Map(entries(headline.byAspectVow).map(([key, value]) => {
      const [aspect, vow] = key.split('|');
      return [aspectFirst ? `${aspect}|${vow}` : `${vow}|${aspect}`, value];
    })) };
  }
  return null;
}

function sortedDimensionValues(dimension, values) {
  return [...new Set(values)].sort((left, right) => {
    if (dimension === 'aspect' || dimension === 'vow' || dimension === 'ordinal') return finite(left) - finite(right);
    return String(left).localeCompare(String(right));
  });
}

function cellWins(cell) {
  if (cell?.wins != null) return finite(cell.wins);
  if (cell?.n != null && cell?.winRate != null) return Math.round(finite(cell.n) * finite(cell.winRate));
  return null;
}

function explorerCellKey(row, column) { return `${row}\u241f${column}`; }

function winRatePivot(section, candidateSection) {
  const rowDimension = state.explorer.rows;
  const columnDimension = state.explorer.columns;
  const dimensions = [rowDimension, columnDimension].filter((item) => item !== NONE);
  const source = winRateCells(section, [rowDimension, columnDimension]);
  if (!source) {
    const label = dimensions.map((dimension) => dimension === 'aspect' ? 'Character' : dimension[0].toUpperCase() + dimension.slice(1)).join(' × ');
    return { body: `<div class="pg-grain" role="alert"><strong>Joint grain not present</strong>${esc(label)} is not stored in this report. Open linked single-dimension views; no zeroes or inferred cells were created.</div>`, selected: null };
  }
  const sourceKeys = [...source.cells.keys()];
  const split = (key) => dimensions.length < 2 ? (rowDimension === NONE ? ['all', key] : [key, 'all']) : key.split('|');
  let rowValues = rowDimension === NONE ? ['all'] : sortedDimensionValues(rowDimension, sourceKeys.map((key) => split(key)[0]));
  let columnValues = columnDimension === NONE ? ['all'] : sortedDimensionValues(columnDimension, sourceKeys.map((key) => split(key)[1]));
  const [filterDimension, filterValue] = String(state.explorer.filter || '').split('=');
  if (filterDimension === rowDimension && filterValue != null) rowValues = rowValues.filter((value) => String(value) === filterValue);
  if (filterDimension === columnDimension && filterValue != null) columnValues = columnValues.filter((value) => String(value) === filterValue);
  const candidate = candidateSection ? winRateCells(candidateSection, [rowDimension, columnDimension]) : null;
  let selected = null;
  const cellValue = (cell) => state.explorer.measure === 'wins' ? cellWins(cell) : state.explorer.measure === 'n' ? cell?.n : cell?.winRate;
  const formatValue = (cell) => {
    const value = cellValue(cell);
    return value == null ? '—' : state.explorer.measure === 'winRate' ? pct(value) : count(value);
  };
  const formatDelta = (value) => state.explorer.measure === 'winRate'
    ? signedPct(value)
    : `${value > 0 ? '+' : value < 0 ? '−' : ''}${count(Math.abs(value))}`;
  const rows = rowValues.map((row) => `<tr><th scope="row">${esc(rowDimension === NONE ? 'All runs' : dimensionLabel(rowDimension, row))}</th>${columnValues.map((column) => {
    const key = dimensions.length < 2 ? (rowDimension === NONE ? column : row) : `${row}|${column}`;
    const cell = source.cells.get(key);
    const candidateCell = candidate?.cells?.get(key);
    const sourceValue = cellValue(cell); const candidateValue = cellValue(candidateCell);
    const delta = sourceValue != null && candidateValue != null ? finite(candidateValue) - finite(sourceValue) : null;
    const label = [rowDimension === NONE ? null : dimensionLabel(rowDimension, row), columnDimension === NONE ? null : dimensionLabel(columnDimension, column)].filter(Boolean).join(' · ') || 'All runs';
    const identity = explorerCellKey(row, column);
    if (state.explorer.selected === identity && cell) selected = { title: label, cell, candidateCell, sourceValue, candidateValue, delta, measure: state.explorer.measure, kind: 'win-rate' };
    return `<td>${cell ? `<button class="pg-pivot-cell${state.explorer.selected === identity ? ' selected' : ''}" data-explorer-cell="${esc(identity)}" type="button" aria-label="${esc(`${label}: ${formatValue(cell)}`)}"><strong>${formatValue(cell)}</strong>${delta == null ? `<small>n=${count(cell.n)}</small>` : `<small class="${delta < 0 ? 'pg-negative' : delta > 0 ? 'pg-positive' : 'pg-muted'}">${formatDelta(delta)} · n=${count(cell.n)}</small>`}</button>` : '<span class="pg-muted">—</span>'}</td>`;
  }).join('')}</tr>`).join('');
  return { body: `<div class="pg-table-wrap"><table class="pg-table" aria-label="Pivot Explorer values"><thead><tr><th scope="col">${esc(rowDimension === NONE ? 'Population' : explorerControls().rows.find(([id]) => id === rowDimension)?.[1] || rowDimension)}</th>${columnValues.map((value) => `<th scope="col">${esc(columnDimension === NONE ? (state.explorer.measure === 'winRate' ? 'Win rate' : explorerControls().measures.find(([id]) => id === state.explorer.measure)?.[1]) : dimensionLabel(columnDimension, value))}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div>`, selected };
}

function simpleDatasetRows(section, dataset, rowMode) {
  if (dataset === 'cards' || dataset === 'relics') return entries(section?.[dataset]).map(([id, record]) => ({ id, label: id, record }));
  if (dataset === 'economy') return entries(section?.economy).filter(([, value]) => typeof value === 'number').map(([id, value]) => ({ id, label: id, record: { value } }));
  if (dataset === 'deaths') {
    const deaths = section?.deaths || {};
    if (rowMode === 'kind') return entries(deaths.byKind).map(([id, value]) => ({ id, label: id, record: { deaths: value } }));
    if (rowMode === 'act-floor') return (deaths.byActRow || []).map(([act, row, value]) => ({ id: `${act}|${row}`, label: `Act ${act + 1}, floor ${row + 1}`, record: { deaths: value } }));
    return [...new Set([...Object.keys(deaths.byEnemy || {}), ...Object.keys(deaths.encountersByEnemy || {})])].map((id) => ({ id, label: id, record: { deaths: deaths.byEnemy?.[id] || 0, encounters: deaths.encountersByEnemy?.[id] || 0 } }));
  }
  if (dataset === 'triggers') return entries(section?.triggers?.funnels).map(([id, record]) => ({ id, label: id, record: { ...record, successRate: ratio(record.succeeded, record.attempted) } }));
  return [];
}

function formatExplorerMeasure(dataset, measure, value) {
  if (['pickRate', 'takeRate', 'winRateWhenDrafted', 'winRateWhenTaken', 'lethality', 'successRate'].includes(measure)) return value == null ? '—' : pct(value);
  if (['avgCopiesWin', 'avgCopiesLoss', 'value'].includes(measure)) return Number.isFinite(Number(value)) ? finite(value).toFixed(2) : '—';
  return value == null ? '—' : count(value);
}

function simplePivot(section, candidateSection) {
  const rows = simpleDatasetRows(section, state.explorer.dataset, state.explorer.rows);
  const candidate = new Map(simpleDatasetRows(candidateSection, state.explorer.dataset, state.explorer.rows).map((row) => [row.id, row.record]));
  const measure = state.explorer.measure;
  const valueFor = (record) => {
    if (!record) return null;
    if (measure === 'pickRate') return ratio(record.picked, record.offered);
    if (measure === 'takeRate') return ratio(record.taken, record.seen);
    if (measure === 'lethality') return ratio(record.deaths, record.encounters);
    return record?.[measure];
  };
  let selected = null;
  const body = `<div class="pg-table-wrap"><table class="pg-table" aria-label="Pivot Explorer values"><thead><tr><th>${esc(explorerControls().rows.find(([id]) => id === state.explorer.rows)?.[1] || 'Item')}</th><th>${esc(explorerControls().measures.find(([id]) => id === measure)?.[1] || measure)}</th>${candidateSection ? '<th>Candidate</th><th>Δ</th>' : ''}</tr></thead><tbody>${rows.map((row) => {
    const candidateRecord = candidate.get(row.id);
    const value = valueFor(row.record); const candidateValue = valueFor(candidateRecord);
    const delta = candidateSection && value != null && candidateValue != null && Number.isFinite(Number(value)) && Number.isFinite(Number(candidateValue)) ? finite(candidateValue) - finite(value) : null;
    const identity = `item:${row.id}`;
    if (state.explorer.selected === identity) selected = { kind: 'generic', title: row.label, value, candidateValue, delta, measure, dataset: state.explorer.dataset, record: row.record, candidateRecord };
    return `<tr><th scope="row">${esc(row.label)}</th><td><button class="pg-pivot-cell${state.explorer.selected === identity ? ' selected' : ''}" data-explorer-cell="${esc(identity)}" type="button" aria-label="Inspect ${esc(row.label)} ${esc(measure)}"><strong>${esc(formatExplorerMeasure(state.explorer.dataset, measure, value))}</strong></button></td>${candidateSection ? `<td>${esc(formatExplorerMeasure(state.explorer.dataset, measure, candidateValue))}</td><td>${delta == null ? '—' : deltaCell(delta, ['pickRate','takeRate','winRateWhenDrafted','winRateWhenTaken','lethality','successRate'].includes(measure) ? signedPct : (number) => `${number >= 0 ? '+' : '−'}${Math.abs(number).toFixed(2)}`)}</td>` : ''}</tr>`;
  }).join('')}</tbody></table></div>`;
  return { body, selected };
}

function triggersPivot(section, candidateSection) {
  const sourceRows = simpleDatasetRows(section, 'triggers', 'trigger');
  const candidate = new Map(simpleDatasetRows(candidateSection, 'triggers', 'trigger').map((row) => [row.id, row.record]));
  const compare = Boolean(candidateSection); const measure = state.explorer.measure; let selected = null;
  const metrics = measure === 'all'
    ? [['eligible', 'Eligible', 'count'], ['attempted', 'Attempted', 'count'], ['succeeded', 'Succeeded', 'count'], ['missed', 'Missed', 'count'], ['successRate', 'Success rate', 'rate']]
    : measure === 'missed' ? [['missed', 'Missed', 'count']] : [['successRate', 'Success rate', 'rate']];
  const cell = (row, metric, label, kind) => {
    const value = row.record?.[metric]; const candidateRecord = candidate.get(row.id); const candidateValue = candidateRecord?.[metric];
    const delta = compare && value != null && candidateValue != null ? finite(candidateValue) - finite(value) : null;
    const identity = `trigger:${row.id}:${metric}`;
    const sourceNumerator = metric === 'successRate' ? row.record?.succeeded : null;
    const sourceDenominator = metric === 'successRate' ? row.record?.attempted : null;
    if (state.explorer.selected === identity) selected = {
      kind: 'trigger', title: `${row.label} · ${label}`, value, valueKind: kind,
      numerator: sourceNumerator, denominator: sourceDenominator,
      method: metric === 'successRate' ? 'Attempt success proportion; no interval stored' : 'Exact trigger-funnel count',
      candidateValue, candidateNumerator: metric === 'successRate' ? candidateRecord?.succeeded : null,
      candidateDenominator: metric === 'successRate' ? candidateRecord?.attempted : null, delta,
    };
    const formatted = value == null ? '—' : kind === 'rate' ? pct(value) : count(value);
    const deltaCopy = delta == null ? '' : `<small class="${delta < 0 ? 'pg-negative' : delta > 0 ? 'pg-positive' : 'pg-muted'}">${kind === 'rate' ? signedPct(delta) : `${delta > 0 ? '+' : delta < 0 ? '−' : ''}${count(Math.abs(delta))}`} · candidate</small>`;
    return `<td><button class="pg-pivot-cell${state.explorer.selected === identity ? ' selected' : ''}" data-explorer-cell="${esc(identity)}" type="button" aria-label="Inspect ${esc(row.label)} ${esc(label)}"><strong>${formatted}</strong>${deltaCopy}</button></td>`;
  };
  const body = `<div class="pg-table-wrap"><table class="pg-table" aria-label="Pivot Explorer values"><thead><tr><th>Trigger</th>${metrics.map(([, label]) => `<th>${esc(label)}</th>`).join('')}${measure === 'all' || measure === 'missed' ? '<th>Miss reasons</th>' : ''}</tr></thead><tbody>${sourceRows.map((row) => `<tr><th scope="row">${esc(row.label)}</th>${metrics.map(([metric, label, kind]) => cell(row, metric, label, kind)).join('')}${measure === 'all' || measure === 'missed' ? `<td>${esc(entries(row.record?.reasons).map(([reason, n]) => `${reason}: ${count(n)}`).join(', ') || '—')}</td>` : ''}</tr>`).join('')}</tbody></table></div><p class="pg-muted">Success rate is succeeded / attempted. Zero-attempt cells remain unavailable; they are never presented as 0%.</p>`;
  return { body, selected };
}

function cycleRoundsPivot(section, candidateSection) {
  const suffix = new Map((section?.progressiveSuffix?.rounds || []).map((row) => [row.ordinal, row]));
  const candidateRounds = new Map((candidateSection?.rounds || []).map((row) => [row.ordinal, row]));
  const candidateSuffix = new Map((candidateSection?.progressiveSuffix?.rounds || []).map((row) => [row.ordinal, row]));
  const rows = section?.rounds || [];
  const showDawn = state.explorer.measure === 'all' || state.explorer.measure === 'dawn';
  const showSuffix = state.explorer.measure === 'all' || state.explorer.measure === 'suffix';
  const compare = Boolean(candidateSection);
  let selected = null;
  const body = `<div class="pg-table-wrap"><table class="pg-table" aria-label="Pivot Explorer values"><thead><tr><th>Round</th>${showDawn ? `<th>At risk</th><th>Dawns</th><th>Falls</th><th>Errors</th><th>Dawn rate</th><th>95% Wilson</th>${compare ? '<th>Candidate Dawn</th><th>Δ Dawn</th>' : ''}` : ''}${showSuffix ? `<th>Suffix attempts</th><th>Suffix Dawns</th><th>Suffix Dawn rate</th><th>Bootstrap 95%</th>${compare ? '<th>Candidate suffix</th><th>Δ suffix</th>' : ''}` : ''}</tr></thead><tbody>${rows.map((row) => {
    const tail = suffix.get(row.ordinal); const candidateRow = candidateRounds.get(row.ordinal); const candidateTail = candidateSuffix.get(row.ordinal);
    const dawnIdentity = `round:${row.ordinal}:dawn`; const suffixIdentity = `round:${row.ordinal}:suffix`;
    if (state.explorer.selected === dawnIdentity) selected = { kind: 'cycle-rate', title: `Round ${row.ordinal} Dawn rate`, value: row.winRate, numerator: row.dawns, denominator: row.atRisk, interval: row.wilson95, intervalLabel: '95% Wilson interval', candidateValue: candidateRow?.winRate, candidateNumerator: candidateRow?.dawns, candidateDenominator: candidateRow?.atRisk, candidateInterval: candidateRow?.wilson95 };
    if (state.explorer.selected === suffixIdentity && tail) selected = { kind: 'cycle-rate', title: `From Round ${row.ordinal} suffix`, value: tail.winRate, numerator: tail.wins, denominator: tail.n, interval: tail.clusterBootstrap95, intervalLabel: 'Whole-cycle cluster bootstrap 95%', candidateValue: candidateTail?.winRate, candidateNumerator: candidateTail?.wins, candidateDenominator: candidateTail?.n, candidateInterval: candidateTail?.clusterBootstrap95 };
    const dawnDelta = candidateRow?.winRate == null ? null : finite(candidateRow.winRate) - finite(row.winRate);
    const suffixDelta = !tail || candidateTail?.winRate == null ? null : finite(candidateTail.winRate) - finite(tail.winRate);
    return `<tr><th scope="row">Round ${count(row.ordinal)}</th>${showDawn ? `<td>${count(row.atRisk)}</td><td>${count(row.dawns)}</td><td>${count(row.falls)}</td><td>${count(row.errors)}</td><td><button class="pg-pivot-cell${state.explorer.selected === dawnIdentity ? ' selected' : ''}" data-explorer-cell="${dawnIdentity}" type="button" aria-label="Inspect Round ${row.ordinal} Dawn rate"><strong>${pct(row.winRate)}</strong></button></td><td>${pct(row.wilson95?.[0])}–${pct(row.wilson95?.[1])}</td>${compare ? `<td>${candidateRow?.winRate == null ? '—' : pct(candidateRow.winRate)}</td><td>${dawnDelta == null ? '—' : deltaCell(dawnDelta, signedPct)}</td>` : ''}` : ''}${showSuffix ? `<td>${tail ? count(tail.n) : '—'}</td><td>${tail ? count(tail.wins) : '—'}</td><td>${tail ? `<button class="pg-pivot-cell${state.explorer.selected === suffixIdentity ? ' selected' : ''}" data-explorer-cell="${suffixIdentity}" type="button" aria-label="Inspect from Round ${row.ordinal} suffix Dawn rate"><strong>${pct(tail.winRate)}</strong></button>` : '—'}</td><td>${tail ? `${pct(tail.clusterBootstrap95?.[0])}–${pct(tail.clusterBootstrap95?.[1])}` : '—'}</td>${compare ? `<td>${candidateTail?.winRate == null ? '—' : pct(candidateTail.winRate)}</td><td>${suffixDelta == null ? '—' : deltaCell(suffixDelta, signedPct)}</td>` : ''}` : ''}</tr>`;
  }).join('')}</tbody></table></div><p class="pg-muted">Dawn rate uses the Round at-risk population and a Wilson interval. Progressive suffix uses a <b>Whole-cycle cluster bootstrap</b>; failed cycles remain excluded from timing.</p>`;
  return { body, selected };
}

function completionRows(section) {
  const completion = section?.completion || {}; const counts = completion.counts || {}; const completed = completion.completedOnly || {};
  return [
    { id: 'started', label: 'Started', value: counts.started, kind: 'count', population: 'All started cycles', method: 'Exact aggregate count' },
    { id: 'completed', label: 'Completed', value: counts.completed, kind: 'count', population: 'All started cycles', method: 'Exact aggregate count' },
    { id: 'censored', label: 'Censored', value: counts.censored, kind: 'count', population: 'All started cycles', method: 'Exact aggregate count' },
    { id: 'failed', label: 'Failed', value: counts.failed, kind: 'count', population: 'Separate from completion timing', method: 'Exact aggregate count' },
    { id: 'timing', label: 'Timing population', value: counts.timingPopulation, kind: 'count', population: 'Completed plus censored; failed excluded', method: 'Exact aggregate count' },
    { id: 'completion-rate', label: 'Completion rate', value: completion.rates?.completion, kind: 'rate', numerator: counts.completed, denominator: counts.started, population: 'All started cycles', method: 'Descriptive cycle proportion; no interval stored' },
    { id: 'failure-rate', label: 'Failure rate', value: completion.rates?.failure, kind: 'rate', numerator: counts.failed, denominator: counts.started, population: 'All started cycles', method: 'Descriptive cycle proportion; no interval stored' },
    { id: 'completed-mean', label: 'Completed-only mean Rounds', value: completed.meanRounds, kind: 'number', denominator: completed.n, population: 'Completed cycles only', method: 'Descriptive mean; no interval stored' },
    { id: 'restricted-mean', label: 'Restricted mean Rounds', value: completion.kaplanMeier?.restrictedMeanRounds?.value, kind: 'number', population: `Kaplan–Meier through Round ${count(completion.kaplanMeier?.restrictedMeanRounds?.through)}`, method: 'Kaplan–Meier restricted mean; failed cycles excluded' },
  ];
}

function completionPivot(section, candidateSection) {
  const rows = completionRows(section); const candidate = new Map(completionRows(candidateSection).map((row) => [row.id, row]));
  const compare = Boolean(candidateSection); let selected = null;
  const display = (row) => row?.value == null ? 'Unavailable' : row.kind === 'rate' ? pct(row.value) : row.kind === 'number' ? finite(row.value).toFixed(2) : count(row.value);
  const delta = (row, candidateRow) => row.value == null || candidateRow?.value == null ? null : finite(candidateRow.value) - finite(row.value);
  const deltaDisplay = (row, value) => value == null ? '—' : row.kind === 'rate' ? signedPct(value) : `${value > 0 ? '+' : value < 0 ? '−' : ''}${Math.abs(value).toFixed(row.kind === 'count' ? 0 : 2)}`;
  const body = `<div class="pg-table-wrap"><table class="pg-table" aria-label="Pivot Explorer values"><thead><tr><th>Metric</th><th>Value</th><th>Evidence population</th>${compare ? '<th>Candidate</th><th>Δ</th>' : ''}</tr></thead><tbody>${rows.map((row) => {
    const candidateRow = candidate.get(row.id); const valueDelta = delta(row, candidateRow); const identity = `completion:${row.id}`;
    if (state.explorer.selected === identity) selected = { ...row, kind: 'summary', valueKind: row.kind, candidate: candidateRow, delta: valueDelta };
    return `<tr><th scope="row">${esc(row.label)}</th><td><button class="pg-pivot-cell${state.explorer.selected === identity ? ' selected' : ''}" data-explorer-cell="${identity}" type="button" aria-label="Inspect ${esc(row.label)}"><strong>${esc(display(row))}</strong></button></td><td>${esc(row.population)}</td>${compare ? `<td>${esc(display(candidateRow))}</td><td>${esc(deltaDisplay(row, valueDelta))}</td>` : ''}</tr>`;
  }).join('')}</tbody></table></div>`;
  return { body, selected };
}

function aggregateEvidence(record, measure) {
  const pairs = {
    pickRate: ['picked', 'offered', 'Picked / offered'],
    takeRate: ['taken', 'seen', 'Taken / seen'],
    lethality: ['deaths', 'encounters', 'Deaths / encounters'],
    successRate: ['succeeded', 'attempted', 'Succeeded / attempted'],
  };
  const pair = pairs[measure];
  if (pair) return { numerator: record?.[pair[0]], denominator: record?.[pair[1]], method: pair[2] };
  if (measure === 'winRateWhenDrafted' || measure === 'winRateWhenTaken') return { method: 'Aggregate win association; denominator and interval are not retained at this grain' };
  return { method: 'Exact aggregate value; no uncertainty interval applies' };
}

function explorerProvenance() {
  const section = state.report?.policies?.[state.policy]; const interpretation = section?.meta?.interpretation || {};
  const source = `<dt>Source report</dt><dd>${esc(state.report?.meta?.label || state.file)}</dd><dt>Source universe</dt><dd>schema ${reportSchema(state.report)} · ${esc(reportMode(state.report))} · ${esc(section?.meta?.knowledgeClass || 'unknown')}</dd><dt>Policy provenance</dt><dd>${esc(section?.meta?.policyId || state.policy)} v${esc(section?.meta?.policyVersion ?? '?')} · ${esc(interpretation.id || 'unspecified')}</dd><dt>Source revision</dt><dd>${esc(state.report?.meta?.gitRev || 'unknown')}${state.report?.meta?.dirty ? ' · dirty' : ''}</dd>`;
  const candidateReport = state.explorer.candidate ? state.cache.get(state.explorer.candidate) : null;
  const candidateSection = candidateReport?.policies?.[state.policy]; const candidateInterpretation = candidateSection?.meta?.interpretation || {};
  const candidate = candidateReport ? `<dt>Candidate report</dt><dd>${esc(candidateReport.meta?.label || state.explorer.candidate)}</dd><dt>Candidate provenance</dt><dd>schema ${reportSchema(candidateReport)} · ${esc(reportMode(candidateReport))} · ${esc(candidateSection?.meta?.policyId || state.policy)} v${esc(candidateSection?.meta?.policyVersion ?? '?')} · ${esc(candidateSection?.meta?.knowledgeClass || 'unknown')} · ${esc(candidateInterpretation.id || 'unspecified')}</dd><dt>Candidate revision</dt><dd>${esc(candidateReport.meta?.gitRev || 'unknown')}${candidateReport.meta?.dirty ? ' · dirty' : ''}</dd>` : '';
  return source + candidate;
}

function explorerInspector(selected) {
  if (!selected) return `<section class="pg-card pg-inspector" role="region" aria-label="Evidence inspector"><h3>Evidence inspector</h3><div class="pg-neutral"><div><strong>Select a cell</strong>Inspect its numerator, denominator, uncertainty, provenance, and candidate delta.</div></div></section>`;
  const provenance = explorerProvenance();
  if (selected.kind === 'generic') {
    const value = formatExplorerMeasure(selected.dataset, selected.measure, selected.value);
    const candidate = formatExplorerMeasure(selected.dataset, selected.measure, selected.candidateValue);
    const evidence = aggregateEvidence(selected.record, selected.measure); const candidateEvidence = aggregateEvidence(selected.candidateRecord, selected.measure);
    const isRate = ['pickRate','takeRate','winRateWhenDrafted','winRateWhenTaken','lethality','successRate'].includes(selected.measure);
    const delta = selected.delta == null ? '—' : isRate ? signedPct(selected.delta) : `${selected.delta > 0 ? '+' : selected.delta < 0 ? '−' : ''}${Math.abs(selected.delta).toFixed(2)}`;
    return `<section class="pg-card pg-inspector" role="region" aria-label="Evidence inspector"><div class="pg-eyebrow">Selected evidence</div><h2>${esc(selected.title)}</h2><dl><dt>Measure</dt><dd>${esc(explorerControls().measures.find(([id]) => id === selected.measure)?.[1] || selected.measure)}</dd><dt>Source value</dt><dd>${esc(value)}</dd><dt>Numerator / denominator</dt><dd>${evidence.numerator == null || evidence.denominator == null ? 'Not retained for this measure' : `${count(evidence.numerator)} / ${count(evidence.denominator)}`}</dd><dt>Method / uncertainty</dt><dd>${esc(evidence.method)}</dd>${state.explorer.candidate ? `<dt>Candidate value</dt><dd>${selected.candidateValue == null ? 'Unavailable at this cell' : esc(candidate)}</dd><dt>Candidate numerator / denominator</dt><dd>${candidateEvidence.numerator == null || candidateEvidence.denominator == null ? 'Not retained or unavailable' : `${count(candidateEvidence.numerator)} / ${count(candidateEvidence.denominator)}`}</dd><dt>Candidate − Source</dt><dd>${esc(delta)}</dd>` : ''}${provenance}</dl><p class="pg-muted">Aggregate association is an investigation lead, not a causal estimate.</p></section>`;
  }
  if (selected.kind === 'cycle-rate') {
    const candidateDelta = selected.candidateValue == null ? null : finite(selected.candidateValue) - finite(selected.value);
    return `<section class="pg-card pg-inspector" role="region" aria-label="Evidence inspector"><div class="pg-eyebrow">Selected evidence</div><h2>${esc(selected.title)}</h2><dl><dt>Rate</dt><dd>${pct(selected.value)}</dd><dt>Numerator / denominator</dt><dd>${count(selected.numerator)} / ${count(selected.denominator)}</dd><dt>Uncertainty</dt><dd>${esc(selected.intervalLabel)}<br>${pct(selected.interval?.[0])}–${pct(selected.interval?.[1])}</dd>${state.explorer.candidate ? `<dt>Candidate rate</dt><dd>${selected.candidateValue == null ? 'Unavailable at this ordinal' : pct(selected.candidateValue)}</dd><dt>Candidate numerator / denominator</dt><dd>${selected.candidateValue == null ? 'Unavailable' : `${count(selected.candidateNumerator)} / ${count(selected.candidateDenominator)}`}</dd><dt>Candidate uncertainty</dt><dd>${selected.candidateValue == null ? 'Unavailable' : `${pct(selected.candidateInterval?.[0])}–${pct(selected.candidateInterval?.[1])}`}</dd><dt>Candidate − Source</dt><dd>${candidateDelta == null ? '—' : signedPct(candidateDelta)}</dd>` : ''}${provenance}</dl><p class="pg-muted">Failed cycles remain separate from Falls, censors, and completion timing.</p></section>`;
  }
  if (selected.kind === 'summary') {
    const candidateDelta = selected.delta;
    const display = (item, kind = item?.kind) => item?.value == null ? 'Unavailable' : kind === 'rate' ? pct(item.value) : kind === 'number' ? finite(item.value).toFixed(2) : count(item.value);
    const delta = candidateDelta == null ? '—' : selected.valueKind === 'rate' ? signedPct(candidateDelta) : `${candidateDelta > 0 ? '+' : candidateDelta < 0 ? '−' : ''}${Math.abs(candidateDelta).toFixed(selected.valueKind === 'count' ? 0 : 2)}`;
    return `<section class="pg-card pg-inspector" role="region" aria-label="Evidence inspector"><div class="pg-eyebrow">Selected evidence</div><h2>${esc(selected.label)}</h2><dl><dt>Source value</dt><dd>${esc(display(selected, selected.valueKind))}</dd><dt>Numerator / denominator</dt><dd>${selected.numerator == null || selected.denominator == null ? 'Not applicable or not retained' : `${count(selected.numerator)} / ${count(selected.denominator)}`}</dd><dt>Population</dt><dd>${esc(selected.population)}</dd><dt>Method / uncertainty</dt><dd>${esc(selected.method)}</dd>${state.explorer.candidate ? `<dt>Candidate value</dt><dd>${esc(display(selected.candidate))}</dd><dt>Candidate numerator / denominator</dt><dd>${selected.candidate?.numerator == null || selected.candidate?.denominator == null ? 'Not applicable or unavailable' : `${count(selected.candidate.numerator)} / ${count(selected.candidate.denominator)}`}</dd><dt>Candidate − Source</dt><dd>${esc(delta)}</dd>` : ''}${provenance}</dl></section>`;
  }
  if (selected.kind === 'trigger') {
    const display = (value) => value == null ? 'Unavailable' : selected.valueKind === 'rate' ? pct(value) : count(value);
    const delta = selected.delta == null ? '—' : selected.valueKind === 'rate' ? signedPct(selected.delta) : `${selected.delta > 0 ? '+' : selected.delta < 0 ? '−' : ''}${count(Math.abs(selected.delta))}`;
    return `<section class="pg-card pg-inspector" role="region" aria-label="Evidence inspector"><div class="pg-eyebrow">Selected trigger evidence</div><h2>${esc(selected.title)}</h2><dl><dt>Source value</dt><dd>${esc(display(selected.value))}</dd><dt>Numerator / denominator</dt><dd>${selected.numerator == null || selected.denominator == null ? 'Exact funnel count' : `${count(selected.numerator)} / ${count(selected.denominator)}`}</dd><dt>Method / uncertainty</dt><dd>${esc(selected.method)}</dd>${state.explorer.candidate ? `<dt>Candidate value</dt><dd>${esc(display(selected.candidateValue))}</dd><dt>Candidate numerator / denominator</dt><dd>${selected.candidateNumerator == null || selected.candidateDenominator == null ? 'Not applicable or unavailable' : `${count(selected.candidateNumerator)} / ${count(selected.candidateDenominator)}`}</dd><dt>Candidate − Source</dt><dd>${esc(delta)}</dd>` : ''}${provenance}</dl><p class="pg-muted">QA trigger evidence remains operational and cannot become a balance claim.</p></section>`;
  }
  const { cell, candidateCell, sourceValue, candidateValue, delta, measure } = selected;
  const measureLabel = explorerControls().measures.find(([id]) => id === measure)?.[1] || measure;
  const valueCopy = (value) => value == null ? 'Unavailable' : measure === 'winRate' ? pct(value) : count(value);
  const deltaCopy = delta == null ? '—' : measure === 'winRate' ? signedPct(delta) : `${delta > 0 ? '+' : delta < 0 ? '−' : ''}${count(Math.abs(delta))}`;
  const sourceInterval = cell.wilson95?.[0] == null || cell.wilson95?.[1] == null ? 'Not retained' : `${pct(cell.wilson95[0])}–${pct(cell.wilson95[1])}`;
  const candidateInterval = candidateCell?.wilson95?.[0] == null || candidateCell?.wilson95?.[1] == null ? 'Not retained or unavailable' : `${pct(candidateCell.wilson95[0])}–${pct(candidateCell.wilson95[1])}`;
  return `<section class="pg-card pg-inspector" role="region" aria-label="Evidence inspector"><div class="pg-eyebrow">Selected evidence</div><h2>${esc(selected.title)}</h2><dl>
    <dt>Measure</dt><dd>${esc(measureLabel)}</dd>
    <dt>Source value</dt><dd>${esc(valueCopy(sourceValue))}</dd>
    <dt>Wins / population</dt><dd>${cellWins(cell) == null || cell.n == null ? 'Not retained' : `${count(cellWins(cell))} / ${count(cell.n)}`}</dd>
    <dt>Associated rate uncertainty</dt><dd>95% Wilson interval<br>${sourceInterval}</dd>
    ${state.explorer.candidate ? `<dt>Candidate value</dt><dd>${esc(valueCopy(candidateValue))}</dd><dt>Candidate wins / population</dt><dd>${cellWins(candidateCell) == null || candidateCell?.n == null ? 'Not retained or unavailable' : `${count(cellWins(candidateCell))} / ${count(candidateCell.n)}`}</dd><dt>Candidate rate uncertainty</dt><dd>${candidateInterval}</dd><dt>Candidate − Source</dt><dd class="${delta < 0 ? 'pg-negative' : delta > 0 ? 'pg-positive' : 'pg-muted'}">${esc(deltaCopy)}</dd>` : ''}
    ${provenance}
  </dl><p class="pg-muted">${esc(evidenceContract(sectionFor(state.report).section).limit)}</p></section>`;
}

function savedViewsMarkup() {
  return state.savedViews.length ? `<div class="pg-saved-list">${state.savedViews.map((view, index) => `<button data-load-view="${index}" type="button" aria-label="Load saved view ${esc(view.name)}">${esc(view.name)}</button>`).join('')}</div>` : '<p class="pg-muted">No saved views yet. Views bind exact report files and provenance.</p>';
}

function explorerFilterOptions(section) {
  if (state.explorer.dataset !== 'win-rate') return [['', 'All values']];
  const headline = section?.headline || {};
  const active = new Set([state.explorer.rows, state.explorer.columns]);
  const options = [['', 'All values']];
  const sources = { aspect: headline.byAspect, vow: headline.byVow, profile: headline.byProfile };
  for (const dimension of ['aspect', 'vow', 'profile']) {
    if (!active.has(dimension)) continue;
    for (const [key] of entries(sources[dimension])) options.push([`${dimension}=${key}`, `${dimension === 'aspect' ? 'Character' : dimension[0].toUpperCase() + dimension.slice(1)}: ${dimensionLabel(dimension, key)}`]);
  }
  return options;
}

function persistSavedViews() {
  try { localStorage.setItem(SAVED_VIEWS_KEY, JSON.stringify(state.savedViews)); } catch { /* dev-only convenience; analysis remains usable */ }
}

function reportIdentity(report, file) {
  return JSON.stringify([file, report?.meta?.gitRev, report?.meta?.dirty, report?.meta?.date, report?.meta?.label, report?.meta?.config]);
}

function saveExplorerView() {
  const input = $('#pg-view-name'); const name = input?.value.trim();
  if (!name) { input?.focus(); return; }
  const sourceProvenance = policyProvenance(state.report, state.policy);
  const candidateReport = state.explorer.candidate ? state.cache.get(state.explorer.candidate) : null;
  const candidateProvenance = candidateReport ? policyProvenance(candidateReport, state.policy) : null;
  if (!sourceProvenance.ok || (state.explorer.candidate && (!candidateReport || !candidateProvenance?.ok))) {
    state.error = 'Could not save an exact view: source and candidate provenance must be retained explicitly.';
    renderMessage();
    return;
  }
  const view = {
    version: 1, name, file: state.file, policy: state.policy,
    sourceProvenance: sourceProvenance.key, sourceIdentity: reportIdentity(state.report, state.file),
    dataset: state.explorer.dataset, rows: state.explorer.rows, columns: state.explorer.columns,
    filter: state.explorer.filter, measure: state.explorer.measure, candidate: state.explorer.candidate,
    candidateProvenance: candidateProvenance?.key || null,
    candidateIdentity: candidateReport ? reportIdentity(candidateReport, state.explorer.candidate) : null,
  };
  const existing = state.savedViews.findIndex((item) => item.name === name);
  if (existing >= 0) state.savedViews[existing] = view; else state.savedViews.push(view);
  state.error = null; persistSavedViews(); renderMessage(); renderContent();
}

async function loadExplorerView(index) {
  const view = state.savedViews[index];
  if (!view) return;
  if (view.version !== 1 || !view.sourceProvenance || !view.sourceIdentity) {
    state.error = 'Could not load saved view: this legacy view lacks exact report provenance. Recreate it from the current report.';
    renderMessage();
    return;
  }
  const request = ++state.loadRequest;
  try {
    const sourceReport = await reportForFile(view.file, { fresh: true });
    const candidateReport = view.candidate ? await reportForFile(view.candidate, { fresh: true }) : null;
    if (request !== state.loadRequest) return;
    const sourceProvenance = policyProvenance(sourceReport, view.policy);
    const candidateProvenance = candidateReport ? policyProvenance(candidateReport, view.policy) : null;
    if (!sourceProvenance.ok || sourceProvenance.key !== view.sourceProvenance || reportIdentity(sourceReport, view.file) !== view.sourceIdentity) {
      throw new Error('saved source report or policy provenance changed');
    }
    if (view.candidate && (!candidateProvenance?.ok || candidateProvenance.key !== view.candidateProvenance || reportIdentity(candidateReport, view.candidate) !== view.candidateIdentity)) {
      throw new Error('saved candidate report or policy provenance changed');
    }
    state.file = view.file; state.report = sourceReport; state.policy = view.policy;
    state.explorer = {
      dataset: view.dataset, rows: view.rows, columns: view.columns,
      filter: view.filter, measure: view.measure, candidate: view.candidate || '', selected: null,
    };
    if (reportMode(sourceReport) === 'cycle') state.comparePolicy = view.policy;
    state.tab = 'explorer'; state.error = null; renderMessage(); renderContent();
  } catch (error) {
    if (request !== state.loadRequest) return;
    state.error = `Could not load saved view: ${error.message}`; renderMessage();
  }
}

function renderExplorer(section) {
  normaliseExplorer();
  const candidateReport = state.explorer.candidate ? state.cache.get(state.explorer.candidate) : null;
  let compatibility = explorerCompatibility(candidateReport);
  let candidateSection = compatibility.ok ? candidateReport?.policies?.[state.policy] : null;
  if (compatibility.ok && state.explorer.dataset === 'win-rate' &&
      winRateCells(section, [state.explorer.rows, state.explorer.columns]) &&
      !winRateCells(candidateSection, [state.explorer.rows, state.explorer.columns])) {
    compatibility = { ok: false, label: 'Candidate grain not present', reason: 'The candidate did not retain this joint grain; no cells or deltas were inferred.' };
    candidateSection = null;
  }
  const controls = explorerControls();
  let pivot;
  if (state.explorer.dataset === 'win-rate') pivot = winRatePivot(section, candidateSection);
  else if (state.explorer.dataset === 'cycle-rounds') pivot = cycleRoundsPivot(section, candidateSection);
  else if (state.explorer.dataset === 'cycle-completion') pivot = completionPivot(section, candidateSection);
  else if (state.explorer.dataset === 'triggers') pivot = triggersPivot(section, candidateSection);
  else pivot = simplePivot(section, candidateSection);
  const interpretation = section.meta?.interpretation || policyDefinition(state.policy)?.reportInterpretation || {};
  return `<div class="pg-explorer-shell"><div class="pg-explorer-main"><section class="pg-card wide"><div class="pg-explorer-head"><div><div class="pg-eyebrow">Analysis workspace</div><h2>Pivot Explorer</h2><p class="pg-interpretation">Compose only dimensions actually retained by this report. Missing joint grains are blocked, never inferred.</p></div>${policyPicker()}</div>
    <div class="pg-evidence-strip"><span>${reportMode(state.report) === 'cycle' ? 'Full Cycle · schema 2' : 'Round · schema 1'}</span><span>${esc(state.policy)}</span><span>${esc(section.meta?.knowledgeClass || policyDefinition(state.policy)?.knowledgeClass || 'machine')}</span><span>${esc(interpretation.label || 'Machine-policy evidence')}</span><span>rev ${esc(state.report?.meta?.gitRev || 'unknown')}${state.report?.meta?.dirty ? ' · dirty' : ''}</span></div></section>
    <section class="pg-shelves" aria-label="Pivot shelves">
      <label class="pg-field">Dataset<select id="pg-explorer-dataset" aria-label="Dataset">${selectOptions(explorerDatasets(), state.explorer.dataset)}</select></label>
      <label class="pg-field">Rows<select id="pg-explorer-rows" aria-label="Rows">${selectOptions(controls.rows, state.explorer.rows)}</select></label>
      <label class="pg-field">Columns<select id="pg-explorer-columns" aria-label="Columns">${selectOptions(controls.columns, state.explorer.columns)}</select></label>
      <label class="pg-field">Filter<select id="pg-explorer-filter" aria-label="Filter">${selectOptions(explorerFilterOptions(section), state.explorer.filter)}</select></label>
      <label class="pg-field">Measure<select id="pg-explorer-measure" aria-label="Measure">${selectOptions(controls.measures, state.explorer.measure)}</select></label>
      <label class="pg-field">Candidate report<select id="pg-explorer-candidate" aria-label="Candidate report">${candidateOptions()}</select></label>
    </section>
    <div class="pg-compat${state.explorer.candidate && !compatibility.ok ? ' blocked' : ''}"><b>${esc(compatibility.label)}</b> · ${esc(compatibility.reason)}</div>
    <section class="pg-card wide"><div class="pg-explorer-head"><div><h3>Analysis canvas</h3><p class="pg-muted">Exact values stay table-first; every visual claim retains its denominator and provenance.</p></div></div>${pivot.body}</section>
    <section class="pg-card wide"><h3>Saved views</h3><div class="pg-saved"><label class="pg-field">Saved view name<input id="pg-view-name" aria-label="Saved view name" maxlength="80" placeholder="Character vow norm"></label><button class="pg-secondary" data-save-view type="button">Save view</button></div>${savedViewsMarkup()}</section>
  </div>${explorerInspector(pivot.selected)}</div>`;
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
  const renderers = { headline: renderHeadline, explorer: renderExplorer, deaths: renderDeaths, cards: renderCards, economy: renderEconomy, issues: renderIssues, cycle: renderCycle };
  $('#pg-content').innerHTML = state.tab === 'compare' ? renderCompare() : renderers[state.tab](section);
}

async function reportForFile(file, { fresh = false } = {}) {
  if (!file) throw new Error('report file is required');
  const report = fresh
    ? await json(`/__sim-report?f=${encodeURIComponent(file)}`)
    : state.cache.get(file) || await json(`/__sim-report?f=${encodeURIComponent(file)}`);
  state.cache.set(file, report);
  return report;
}

async function loadReport(file) {
  if (!file) return;
  const request = ++state.loadRequest;
  try {
    const report = await reportForFile(file);
    if (request !== state.loadRequest) return;
    state.file = file; state.report = report; state.policy = firstPolicy(report, state.policy); resetExplorer(report);
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
    await reportForFile(file);
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
    if ($('#pg-runner')?.open) $('#pg-runner').close();
    state.launching = false;
    await pollStatus();
  } catch (error) {
    state.launching = false; state.running = false; $('.pg-run').disabled = false; state.error = `Could not start sweep: ${error.message}`; renderMessage();
  }
}

function bind() {
  document.addEventListener('click', async (event) => {
    if (event.target.closest('[data-open-runner]')) { $('#pg-runner').showModal(); return; }
    if (event.target.closest('[data-close-runner]')) { $('#pg-runner').close(); return; }
    if (event.target.closest('[data-open-explorer]')) { state.tab = 'explorer'; renderContent(); return; }
    if (event.target.closest('[data-save-view]')) { saveExplorerView(); return; }
    const savedView = event.target.closest('[data-load-view]');
    if (savedView) { await loadExplorerView(Number(savedView.dataset.loadView)); return; }
    const explorerCell = event.target.closest('[data-explorer-cell]');
    if (explorerCell) { state.explorer.selected = explorerCell.dataset.explorerCell; renderContent(); return; }
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
    if (event.target.id === 'pg-policy') { state.policy = event.target.value; state.explorer.selected = null; renderContent(); }
    if (event.target.id === 'pg-explorer-dataset') {
      state.explorer.dataset = event.target.value;
      const controls = explorerControls(event.target.value);
      state.explorer.rows = controls.rows[0][0]; state.explorer.columns = controls.columns[0][0]; state.explorer.filter = ''; state.explorer.measure = controls.measures[0][0]; state.explorer.selected = null;
      renderContent(); return;
    }
    if (event.target.id === 'pg-explorer-rows') { state.explorer.rows = event.target.value; state.explorer.filter = ''; state.explorer.selected = null; renderContent(); return; }
    if (event.target.id === 'pg-explorer-columns') { state.explorer.columns = event.target.value; state.explorer.filter = ''; state.explorer.selected = null; renderContent(); return; }
    if (event.target.id === 'pg-explorer-filter') { state.explorer.filter = event.target.value; state.explorer.selected = null; renderContent(); return; }
    if (event.target.id === 'pg-explorer-measure') { state.explorer.measure = event.target.value; state.explorer.selected = null; renderContent(); return; }
    if (event.target.id === 'pg-explorer-candidate') {
      state.explorer.candidate = event.target.value; state.explorer.selected = null;
      try {
        if (state.explorer.candidate) await reportForFile(state.explorer.candidate);
        state.error = null; renderMessage(); renderContent();
      } catch (error) {
        state.error = `Could not open candidate report: ${error.message}`;
        state.explorer.candidate = ''; renderMessage(); renderContent();
      }
      return;
    }
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

function loadSavedViews() {
  try {
    const parsed = JSON.parse(localStorage.getItem(SAVED_VIEWS_KEY) || '[]');
    state.savedViews = Array.isArray(parsed) ? parsed.filter((item) => item && typeof item.name === 'string' && typeof item.file === 'string') : [];
  } catch { state.savedViews = []; }
}

export async function initSimLab() {
  setDevTitle('Proving Grounds');
  state.metadata = await json('/__sim-metadata');
  loadSavedViews(); installStyles(); shell(); renderRunControls(); bind();
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
