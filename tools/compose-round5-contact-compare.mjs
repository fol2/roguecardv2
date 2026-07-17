#!/usr/bin/env node
/**
 * Compose owner review sheets: one row per viewport, GOLDEN | CURRENT.
 * Expects:
 *   <out>/golden/{base,phase2}/*.png
 *   <out>/current/{base,phase2}/*.png
 * Writes:
 *   <out>/sheets/*-base.html, *-phase2.html, index.html
 */
import {
  existsSync, mkdirSync, readdirSync, writeFileSync, statSync,
} from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = process.env.CONTACT_COMPARE_OUT
  || path.join(ROOT, 'docs/superpowers/artifacts/round5-p6-contact-compare');

const SHAPE_ORDER = Object.freeze([
  'phone-portrait',
  'phone-landscape',
  'pad-portrait',
  'pad-landscape',
  'desktop-landscape',
]);
const PROFILE_ORDER = Object.freeze(['fresh', 'grown']);

const BASE_SCREENS = Object.freeze([
  'title', 'embark', 'fall', 'dawn', 'rewards', 'boss-relic', 'shop', 'event',
  'rest', 'treasure', 'lamplighter', 'hollow', 'vigil', 'map',
]);

function listPngs(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((name) => name.endsWith('.png')).sort();
}

function parseBaseName(file) {
  // screen__shape__profile.png
  const stem = file.replace(/\.png$/, '');
  const parts = stem.split('__');
  if (parts.length < 3) return null;
  return { screen: parts[0], shape: parts[1], profile: parts.slice(2).join('__'), file };
}

function shapeRank(shape) {
  const i = SHAPE_ORDER.indexOf(shape);
  return i < 0 ? 99 : i;
}

function profileRank(profile) {
  const i = PROFILE_ORDER.indexOf(profile);
  return i < 0 ? 99 : i;
}

function sheetCss() {
  return `body{margin:0;background:#0b0e1a;color:#d7dcea;font:14px/1.35 system-ui,sans-serif}
h1{margin:18px 16px 6px;font:700 18px Georgia,serif}
.meta{margin:0 16px 14px;opacity:.8;font-size:12px;max-width:1100px}
table{width:100%;border-collapse:collapse;table-layout:fixed}
th,td{vertical-align:top;padding:10px 12px;border-top:1px solid #1c2238}
th{position:sticky;top:0;background:#0f1322;z-index:2;font-size:12px;letter-spacing:.04em;text-transform:uppercase;opacity:.9}
td.viewport{width:160px;font-size:12px;color:#aeb6d0;word-break:break-word}
td.shot{width:calc((100% - 160px)/2)}
figure{margin:0;background:#12162a;padding:8px}
img{width:100%;height:auto;display:block;background:#000}
figcaption{margin-top:6px;font-size:11px;opacity:.75;word-break:break-all}
.missing{min-height:120px;display:flex;align-items:center;justify-content:center;background:#1a1020;color:#ffb09d;font-size:12px;padding:16px;text-align:center}
.badge{display:inline-block;padding:1px 7px;border-radius:999px;font-size:10px;margin-left:6px}
.g{background:#1d3b28;color:#9dffb0}
.c{background:#1d2a3b;color:#9dc9ff}
a{color:#9dc9ff}
nav a{margin-right:10px}`;
}

function shotCell(rel, label, bust) {
  if (!rel) {
    return `<td class="shot"><div class="missing">missing<br>${label}</div></td>`;
  }
  const src = bust ? `${rel}?v=${bust}` : rel;
  return `<td class="shot"><figure><img src="${src}" alt="${label}" loading="lazy"><figcaption>${label}</figcaption></figure></td>`;
}

function fileBust(absPath) {
  try {
    return String(statSync(absPath).mtimeMs | 0);
  } catch {
    return String(Date.now());
  }
}

function writeHtml(outPath, title, body) {
  mkdirSync(path.dirname(outPath), { recursive: true });
  writeFileSync(outPath, `<!doctype html><meta charset="utf-8"><title>${title}</title>
<style>${sheetCss()}</style>
${body}
`);
}

function composeBase(screen, goldenFiles, currentFiles, sheetsDir) {
  const goldenByKey = new Map();
  const currentByKey = new Map();
  for (const file of goldenFiles) {
    const parsed = parseBaseName(file);
    if (parsed?.screen === screen) goldenByKey.set(`${parsed.shape}__${parsed.profile}`, parsed);
  }
  for (const file of currentFiles) {
    const parsed = parseBaseName(file);
    if (parsed?.screen === screen) currentByKey.set(`${parsed.shape}__${parsed.profile}`, parsed);
  }
  const keys = [...new Set([...goldenByKey.keys(), ...currentByKey.keys()])]
    .sort((a, b) => {
      const [as, ap] = a.split('__');
      const [bs, bp] = b.split('__');
      return shapeRank(as) - shapeRank(bs) || profileRank(ap) - profileRank(bp) || a.localeCompare(b);
    });

  const rows = keys.map((key) => {
    const [shape, profile] = key.split('__');
    const g = goldenByKey.get(key);
    const c = currentByKey.get(key);
    const gRel = g ? `../golden/base/${g.file}` : null;
    const cRel = c ? `../current/base/${c.file}` : null;
    const gBust = g ? fileBust(path.join(OUT, 'golden', 'base', g.file)) : null;
    const cBust = c ? fileBust(path.join(OUT, 'current', 'base', c.file)) : null;
    return `<tr>
<td class="viewport"><strong>${shape}</strong><br>${profile}</td>
${shotCell(gRel, g ? g.file : `${screen}__${key} (golden)`, gBust)}
${shotCell(cRel, c ? c.file : `${screen}__${key} (current)`, cBust)}
</tr>`;
  }).join('\n');

  writeHtml(
    path.join(sheetsDir, `${screen}-base.html`),
    `${screen} — golden vs current`,
    `<h1>${screen} — base <span class="badge g">golden</span> <span class="badge c">current</span></h1>
<p class="meta">Each row is one viewport (shape × fresh/grown). Left = golden <code>9f10ef2</code> (<code>dev: support Access-gated Spirebound preview</code>). Right = current PE continuation.</p>
<table>
<thead><tr><th>Viewport</th><th>Golden (9f10ef2)</th><th>Current (PE)</th></tr></thead>
<tbody>
${rows || '<tr><td colspan="3" class="missing">no rows</td></tr>'}
</tbody>
</table>
<p class="meta"><a href="./index.html">← all sheets</a></p>`,
  );
  return keys.length;
}

function phase2Screen(file) {
  // ids like title-rose-loading, usurper-item-normal, dawn-cursor-retry
  const stem = file.replace(/\.png$/, '');
  if (stem.startsWith('title-')) return 'title';
  if (stem.startsWith('hollow-')) return 'hollow';
  if (stem.startsWith('dawn-')) return 'dawn';
  if (stem.startsWith('fall-')) return 'fall';
  if (stem.startsWith('usurper-') || stem.startsWith('shop-')) return 'shop';
  if (stem.startsWith('end-') || stem.startsWith('bequest-')) return 'end';
  if (stem.startsWith('vigil-') || stem.startsWith('rose-')) return 'vigil';
  if (stem.startsWith('map-')) return 'map';
  return stem.split('-')[0] || 'phase2';
}

function composePhase2(screen, goldenFiles, currentFiles, sheetsDir) {
  const golden = goldenFiles.filter((f) => phase2Screen(f) === screen).sort();
  const current = currentFiles.filter((f) => phase2Screen(f) === screen).sort();
  const ids = [...new Set([
    ...golden.map((f) => f.replace(/\.png$/, '')),
    ...current.map((f) => f.replace(/\.png$/, '')),
  ])].sort();
  if (!ids.length) return 0;

  const rows = ids.map((id) => {
    const gFile = `${id}.png`;
    const cFile = `${id}.png`;
    const gOk = golden.includes(gFile);
    const cOk = current.includes(cFile);
    const gBust = gOk ? fileBust(path.join(OUT, 'golden', 'phase2', gFile)) : null;
    const cBust = cOk ? fileBust(path.join(OUT, 'current', 'phase2', cFile)) : null;
    return `<tr>
<td class="viewport"><strong>${id}</strong><br>desktop-landscape · grown</td>
${shotCell(gOk ? `../golden/phase2/${gFile}` : null, gFile, gBust)}
${shotCell(cOk ? `../current/phase2/${cFile}` : null, cFile, cBust)}
</tr>`;
  }).join('\n');

  writeHtml(
    path.join(sheetsDir, `${screen}-phase2.html`),
    `${screen} phase2 — golden vs current`,
    `<h1>${screen} — Phase-2 <span class="badge g">golden</span> <span class="badge c">current</span></h1>
<p class="meta">Each row is one Phase-2 substate. Left = golden <code>9f10ef2</code>
  (PE Lab Phase-2 states are not on this tip — expect empty golden cells). Right = current PE.</p>
<table>
<thead><tr><th>Viewport / state</th><th>Golden (9f10ef2)</th><th>Current (PE)</th></tr></thead>
<tbody>
${rows}
</tbody>
</table>
<p class="meta"><a href="./index.html">← all sheets</a></p>`,
  );
  return ids.length;
}

function main() {
  const goldenBase = path.join(OUT, 'golden', 'base');
  const goldenPhase2 = path.join(OUT, 'golden', 'phase2');
  const currentBase = path.join(OUT, 'current', 'base');
  const currentPhase2 = path.join(OUT, 'current', 'phase2');
  const sheetsDir = path.join(OUT, 'sheets');

  for (const dir of [goldenBase, goldenPhase2, currentBase, currentPhase2]) {
    if (!existsSync(dir)) {
      console.error(`missing ${dir}`);
      process.exit(1);
    }
  }

  const gBase = listPngs(goldenBase);
  const cBase = listPngs(currentBase);
  const gPhase = listPngs(goldenPhase2);
  const cPhase = listPngs(currentPhase2);

  mkdirSync(sheetsDir, { recursive: true });

  const indexLinks = [];
  for (const screen of BASE_SCREENS) {
    const n = composeBase(screen, gBase, cBase, sheetsDir);
    if (n) indexLinks.push(`<li><a href="./${screen}-base.html">${screen} — base</a> (${n} viewports)</li>`);
  }

  const phaseScreens = [...new Set([...gPhase, ...cPhase].map(phase2Screen))].sort();
  for (const screen of phaseScreens) {
    const n = composePhase2(screen, gPhase, cPhase, sheetsDir);
    if (n) indexLinks.push(`<li><a href="./${screen}-phase2.html">${screen} — phase2</a> (${n} states)</li>`);
  }

  const gBytes = [...gBase, ...gPhase].reduce((n, f) => {
    const p = gBase.includes(f)
      ? path.join(goldenBase, f)
      : path.join(goldenPhase2, f);
    return n + (existsSync(p) ? statSync(p).size : 0);
  }, 0);

  writeHtml(
    path.join(sheetsDir, 'index.html'),
    'Round 5 contact compare — golden vs current',
    `<h1>Contact sheets — golden vs current</h1>
<p class="meta">
  Left column everywhere: <strong>golden</strong> <code>9f10ef2</code>
  (<code>dev: support Access-gated Spirebound preview</code> — owner-specified true golden).<br>
  Right column: <strong>current</strong> PE continuation captures.<br>
  Layout: <em>one viewport per row</em> (not a thumbnail grid).<br>
  Note: Phase-2 Lab substates are PE-only — golden Phase-2 cells are empty on purpose.
</p>
<nav class="meta">${indexLinks.join('\n')}</nav>
<p class="meta">Artifact root: <code>${path.relative(ROOT, OUT)}</code> · golden pngs ${gBase.length}+${gPhase.length} · current pngs ${cBase.length}+${cPhase.length}</p>`,
  );

  console.log(`composed compare sheets → ${sheetsDir}`);
  console.log(`golden base=${gBase.length} phase2=${gPhase.length}; current base=${cBase.length} phase2=${cPhase.length}; goldenBytes≈${Math.round(gBytes / 1024)}KB`);
}

main();
