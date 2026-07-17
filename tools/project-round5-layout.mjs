#!/usr/bin/env node
/**
 * Round 5 P6 layout projection capture + ORIGINAL golden diff.
 *
 * Comparison subject is a frozen golden tip (default: PE pre-FE-merge
 * 272e0e49), not hand-written thresholds.
 *
 * Modes:
 *   LAYOUT_PROJECTION_MODE=golden   — write golden/ from LAYOUT_PROJECTION_ROOT
 *   LAYOUT_PROJECTION_MODE=compare  — capture live, diff vs golden/ (default)
 *
 * Env:
 *   LAYOUT_PROJECTION_ROOT — tree to boot (default: this package root)
 *   LAYOUT_PROJECTION_GOLDEN_SHA — recorded in golden manifest
 */
import { createHash } from 'node:crypto';
import { spawn, execFileSync } from 'node:child_process';
import {
  mkdirSync, writeFileSync, existsSync, rmSync, copyFileSync, readFileSync,
} from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import {
  CANONICAL_SHAPES,
  FRESH_VIGIL,
  GROWN_VIGIL,
} from '../test/e2e/p6-fixtures.js';
import { e2eServerSettings } from '../playwright-server.js';
import {
  diffLayoutProjections,
  summarizeProjectionDiff,
} from '../src/ui/screen-layout-projection.js';
import { collectScreenLayoutInBrowser } from './layout-projection-browser-collect.mjs';

const TOOL_ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const ROOT = path.resolve(process.env.LAYOUT_PROJECTION_ROOT || TOOL_ROOT);
const MODE = process.env.LAYOUT_PROJECTION_MODE || 'compare';
const OUT = path.join(TOOL_ROOT, 'test-results', 'round5-layout-projection');
const ART = path.join(TOOL_ROOT, 'docs/superpowers/artifacts/round5-p6-layout-projection');
const GOLDEN_DIR = path.join(ART, 'golden');

const FOCUS_ROWS = Object.freeze([
  { screen: 'dawn', shape: 'phone-portrait', profile: 'grown' },
  { screen: 'dawn', shape: 'phone-landscape', profile: 'grown' },
  { screen: 'embark', shape: 'desktop-landscape', profile: 'grown' },
  { screen: 'embark', shape: 'phone-landscape', profile: 'grown' },
  { screen: 'embark', shape: 'pad-landscape', profile: 'grown' },
  { screen: 'event', shape: 'phone-landscape', profile: 'grown' },
  { screen: 'fall', shape: 'desktop-landscape', profile: 'grown' },
  { screen: 'fall', shape: 'pad-landscape', profile: 'grown' },
  { screen: 'lamplighter', shape: 'phone-portrait', profile: 'grown' },
  { screen: 'lamplighter', shape: 'phone-landscape', profile: 'grown' },
  { screen: 'map', shape: 'desktop-landscape', profile: 'grown' },
  { screen: 'rest', shape: 'phone-landscape', profile: 'grown' },
  { screen: 'rewards', shape: 'phone-landscape', profile: 'grown' },
  { screen: 'shop', shape: 'phone-landscape', profile: 'grown' },
  { screen: 'treasure', shape: 'phone-landscape', profile: 'grown' },
  { screen: 'title', shape: 'desktop-landscape', profile: 'grown' },
  { screen: 'title', shape: 'phone-portrait', profile: 'grown' },
  { screen: 'title', shape: 'phone-landscape', profile: 'grown' },
  { screen: 'vigil', shape: 'phone-landscape', profile: 'grown' },
]);

/** Intentional remediations vs pre-FE original — still reported, not failures. */
const DEFAULT_EXPECTED_DRIFTS = Object.freeze([
  'scene.sceneBgStampedAsPanel',
  'cardface',
  'map.bg3dVisible',
  'map.keepBg3dAttr',
  // Golden full-bleed boxes were ~1.5% oversized vs stage (capture scale).
  'scene.centerPanel.width',
  'scene.centerPanel.height',
  'lamp.root.width',
  'lamp.root.height',
  'dawn.content.width',
  'dawn.content.height',
  // Golden parallax was accidentally in-flow on some shapes.
  'title.parallaxTop',
  // Whisper text width is font-intrinsic; golden tip measured colder fonts.
  'dawn.whisper.width',
  'dawn.whisper.left',
  'dawn.whisper.right',
  'dawn.whisper.cx',
]);

function gitHead(cwd = ROOT) {
  return execFileSync('git', ['rev-parse', 'HEAD'], { cwd, encoding: 'utf8' }).trim();
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

async function startDevServer(settings) {
  const child = spawn('npm', ['run', 'dev', '--', '--host', '127.0.0.1', '--port', String(settings.port)], {
    cwd: ROOT,
    env: { ...process.env, ...settings.env },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('dev server start timeout')), 60_000);
    const onData = (buf) => {
      if (String(buf).includes('Local:')) {
        clearTimeout(timer);
        child.stdout.off('data', onData);
        resolve();
      }
    };
    child.stdout.on('data', onData);
    child.stderr.on('data', onData);
    child.on('exit', (code) => {
      clearTimeout(timer);
      reject(new Error(`dev server exited ${code}`));
    });
  });
  return child;
}

function stopDevServer(server) {
  if (!server) return;
  server.kill('SIGTERM');
}

async function waitSettled(page, { keepBg3d = false } = {}) {
  await page.waitForFunction(() => window.spirebound && window.__probe);
  await page.waitForFunction(() => {
    const records = window.__probe?.behaviourTrace?.()?.records;
    if (records?.some((record) => record.eventName === 'app.ready')) return true;
    return window.spirebound?.S?.screen === 'title'
      && !!(document.querySelector('.r5-title, .title-screen'));
  });
  await page.evaluate(async (opts) => {
    await document.fonts.ready;
    const bound = (work, ms = 2500) => Promise.race([
      Promise.resolve(typeof work === 'function' ? work() : work).catch(() => {}),
      new Promise((resolve) => setTimeout(resolve, ms)),
    ]);
    if (window.__probe?.settle) await bound(() => window.__probe.settle());
    const mapOn = !!document.querySelector('.r5-map, .map-screen')
      || window.spirebound?.S?.screen === 'map';
    const keepBg3d = !!(opts.keepBg3d || mapOn);
    if (window.__probe?.freeze) await bound(() => window.__probe.freeze({ keepBg3d }));
  }, { keepBg3d });
}

async function stageScreen(page, screen, profile) {
  await page.evaluate(([screenId, grown]) => {
    const sp = window.spirebound;
    const run = sp.E.newRun(3700 + screenId.length, {
      reveals: grown
        ? ['phials', 'omens', 'emberglass', 'lamplighter', 'act4']
        : [],
      shards: grown ? ['usurper'] : [],
    });
    sp.S.run = run;
    if (screenId === 'title') { sp.show('title'); return; }
    if (screenId === 'embark') { sp.show('embark'); return; }
    if (screenId === 'fall') {
      run.pendingRunEnd = { outcome: 'death' };
      sp.show('end', {
        won: false, offers: [], fallAct: 1, fallRow: 3, unpaidBequest: false,
        ledger: { whisper: 'The stone keeps the climb.' },
      });
      return;
    }
    if (screenId === 'dawn') {
      run.pendingRunEnd = { outcome: 'win' };
      sp.E.stagePendingDawn?.(run, [{ t: 'whisper', text: 'The climb continues.' }], []);
      sp.show('end', { won: true });
      return;
    }
    if (screenId === 'rewards') {
      run.pendingReward = {
        kind: 'normal',
        rewards: { gold: 20, cards: ['strike', 'defend', 'chisel'], potion: null, relic: null },
        taken: {}, perfect: false,
      };
      sp.show('reward');
      return;
    }
    if (screenId === 'boss-relic') { sp.show('bossRelic'); return; }
    if (screenId === 'shop') { sp.show('shop'); return; }
    if (screenId === 'event') { sp.show('event', sp.E.rollEvent(run)); return; }
    if (screenId === 'rest') { sp.show('rest'); return; }
    if (screenId === 'treasure') { sp.show('treasure'); return; }
    if (screenId === 'lamplighter') { sp.S.lamp = null; sp.show('lamplighter'); return; }
    if (screenId === 'hollow') {
      run.gold = 0;
      sp.show('lamplighter', { hollow: true });
      return;
    }
    if (screenId === 'vigil') { sp.show('vigil'); return; }
    if (screenId === 'map') { sp.show('map'); return; }
    throw new Error(`unknown screen ${screenId}`);
  }, [screen, profile === 'grown']);
}

function loadExpectedDrifts() {
  const p = path.join(GOLDEN_DIR, 'expected-drifts.json');
  if (!existsSync(p)) return [...DEFAULT_EXPECTED_DRIFTS];
  const raw = JSON.parse(readFileSync(p, 'utf8'));
  return Array.isArray(raw?.paths) ? raw.paths : [...DEFAULT_EXPECTED_DRIFTS];
}

async function main() {
  if (!['golden', 'compare'].includes(MODE)) {
    fail(`unknown LAYOUT_PROJECTION_MODE=${MODE}`);
  }

  const sourceSha = gitHead(ROOT);
  const declaredGoldenSha = process.env.LAYOUT_PROJECTION_GOLDEN_SHA || sourceSha;

  if (existsSync(OUT)) rmSync(OUT, { recursive: true, force: true });
  mkdirSync(OUT, { recursive: true });

  const port = Number(process.env.SPIREBOUND_E2E_PORT || 5174);
  const settings = e2eServerSettings(
    process.env.SPIREBOUND_E2E_PORT ? String(port) : undefined,
  );
  const server = settings.isolated ? await startDevServer(settings) : null;
  const browser = await chromium.launch({ headless: true });
  const rows = [];

  try {
    for (const entry of FOCUS_ROWS) {
      if (!CANONICAL_SHAPES.includes(entry.shape)) fail(`unknown shape ${entry.shape}`);
      const context = await browser.newContext({
        viewport: { width: 1280, height: 800 },
        reducedMotion: 'reduce',
      });
      const page = await context.newPage();
      await page.addInitScript((vigil) => {
        localStorage.removeItem('spirebound_save_v2');
        localStorage.setItem('spirebound_vigil_v2', JSON.stringify(vigil));
      }, entry.profile === 'grown' ? GROWN_VIGIL : FRESH_VIGIL);
      await page.goto(`${settings.origin}/?shape=${entry.shape}&mesh=0&trace=1`);
      await waitSettled(page);
      await stageScreen(page, entry.screen, entry.profile);
      if (entry.screen === 'dawn') {
        await page.waitForSelector('.dawn-whisper, .r5-dawn-ledger, .stats-grid', {
          state: 'attached', timeout: 15_000,
        }).catch(() => {});
      }
      if (entry.screen === 'embark' && entry.profile === 'grown') {
        await page.waitForSelector('.r5-vow-dial, .vow-block', {
          state: 'attached', timeout: 10_000,
        }).catch(() => {});
      }
      if (entry.screen === 'map') {
        await page.waitForSelector('.r5-map, .map-screen', {
          state: 'attached', timeout: 15_000,
        }).catch(() => {});
      }
      await waitSettled(page, { keepBg3d: entry.screen === 'map' });
      const projection = await page.evaluate(collectScreenLayoutInBrowser);
      const id = `${entry.screen}__${entry.shape}__${entry.profile}`;
      const row = { id, ...entry, projection };
      rows.push(row);
      writeFileSync(path.join(OUT, `${id}.json`), `${JSON.stringify(row, null, 2)}\n`);
      await context.close();
    }
  } finally {
    await browser.close();
    stopDevServer(server);
  }

  if (MODE === 'golden') {
    if (existsSync(GOLDEN_DIR)) rmSync(GOLDEN_DIR, { recursive: true, force: true });
    mkdirSync(GOLDEN_DIR, { recursive: true });
    const manifest = {
      role: 'golden-original',
      generatedAt: new Date().toISOString(),
      sourceSha: declaredGoldenSha,
      captureRoot: ROOT,
      focusCount: FOCUS_ROWS.length,
      rows: rows.map((r) => r.id),
      sha256: createHash('sha256').update(JSON.stringify(rows.map((r) => r.id))).digest('hex'),
    };
    writeFileSync(path.join(GOLDEN_DIR, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
    writeFileSync(
      path.join(GOLDEN_DIR, 'expected-drifts.json'),
      `${JSON.stringify({
        note: 'Paths expected to differ from golden after intentional remediations. Unexpected paths fail compare.',
        paths: DEFAULT_EXPECTED_DRIFTS,
      }, null, 2)}\n`,
    );
    for (const row of rows) {
      writeFileSync(
        path.join(GOLDEN_DIR, `${row.id}.json`),
        `${JSON.stringify({ id: row.id, projection: row.projection }, null, 2)}\n`,
      );
    }
    console.log(
      `golden layout projection: ${rows.length} rows → ${GOLDEN_DIR} (sourceSha=${declaredGoldenSha})`,
    );
    return;
  }

  // compare mode
  if (!existsSync(path.join(GOLDEN_DIR, 'manifest.json'))) {
    fail(`missing golden original at ${GOLDEN_DIR} — run LAYOUT_PROJECTION_MODE=golden first`);
  }
  const goldenManifest = JSON.parse(readFileSync(path.join(GOLDEN_DIR, 'manifest.json'), 'utf8'));
  const expectedPaths = loadExpectedDrifts();
  const compareRows = [];
  let unexpectedTotal = 0;

  for (const row of rows) {
    const goldenPath = path.join(GOLDEN_DIR, `${row.id}.json`);
    if (!existsSync(goldenPath)) {
      compareRows.push({
        id: row.id,
        error: 'missing-golden-row',
        unexpectedCount: 1,
        unexpectedPaths: ['<missing-golden-row>'],
      });
      unexpectedTotal += 1;
      continue;
    }
    const golden = JSON.parse(readFileSync(goldenPath, 'utf8')).projection;
    const diff = diffLayoutProjections(row.projection, golden, { boxTol: 8 });
    const summary = summarizeProjectionDiff(diff, { expectedPaths });
    unexpectedTotal += summary.unexpectedCount;
    compareRows.push({
      id: row.id,
      deltaCount: summary.deltaCount,
      expectedCount: summary.expectedCount,
      unexpectedCount: summary.unexpectedCount,
      unexpectedPaths: summary.unexpectedPaths,
      expectedPathsHit: summary.expectedPathsHit,
      deltas: diff.deltas,
    });
    writeFileSync(
      path.join(OUT, `${row.id}.diff.json`),
      `${JSON.stringify(compareRows[compareRows.length - 1], null, 2)}\n`,
    );
  }

  const manifest = {
    role: 'live-vs-golden',
    generatedAt: new Date().toISOString(),
    liveSourceSha: sourceSha,
    goldenSourceSha: goldenManifest.sourceSha,
    focusCount: FOCUS_ROWS.length,
    unexpectedTotal,
    expectedDriftPaths: expectedPaths,
    rows: compareRows.map((r) => ({
      id: r.id,
      deltaCount: r.deltaCount,
      expectedCount: r.expectedCount,
      unexpectedCount: r.unexpectedCount,
      unexpectedPaths: r.unexpectedPaths,
    })),
    sha256: createHash('sha256').update(JSON.stringify(compareRows.map((r) => r.id))).digest('hex'),
  };
  writeFileSync(path.join(OUT, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);

  // Promote live + diffs (keep golden/)
  mkdirSync(ART, { recursive: true });
  copyFileSync(path.join(OUT, 'manifest.json'), path.join(ART, 'manifest.json'));
  for (const row of rows) {
    copyFileSync(path.join(OUT, `${row.id}.json`), path.join(ART, `${row.id}.json`));
    const diffPath = path.join(OUT, `${row.id}.diff.json`);
    if (existsSync(diffPath)) {
      copyFileSync(diffPath, path.join(ART, `${row.id}.diff.json`));
    }
  }

  console.log(
    `layout projection compare: ${rows.length} rows, unexpectedTotal=${unexpectedTotal}`
    + ` live=${sourceSha.slice(0, 8)} golden=${String(goldenManifest.sourceSha).slice(0, 8)} → ${OUT}`,
  );
  if (unexpectedTotal > 0) {
    console.error('UNEXPECTED DRIFTS vs ORIGINAL golden:');
    for (const r of compareRows.filter((x) => x.unexpectedCount > 0)) {
      console.error(`  ${r.id}: ${r.unexpectedPaths.slice(0, 12).join(', ')}${
        r.unexpectedPaths.length > 12 ? '…' : ''
      }`);
    }
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
