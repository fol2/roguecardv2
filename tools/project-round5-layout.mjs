#!/usr/bin/env node
/**
 * Collect Round 5 P6 owner-FAIL layout projections (JSON evidence).
 * Stages the same screen × shape × profile matrix as contact sheets, then
 * records __probe.screenLayoutGates() — no screenshot taste.
 */
import { createHash } from 'node:crypto';
import { spawn, execFileSync } from 'node:child_process';
import {
  mkdirSync, writeFileSync, existsSync, rmSync, copyFileSync,
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
  OWNER_FAIL_GATE_IDS,
  summarizeGateReport,
} from '../src/ui/screen-layout-projection.js';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'test-results', 'round5-layout-projection');
const ART = path.join(
  ROOT,
  'docs/superpowers/artifacts/round5-p6-layout-projection',
);

const SCREENS = Object.freeze([
  'title', 'embark', 'fall', 'dawn', 'rewards', 'boss-relic', 'shop', 'event',
  'rest', 'treasure', 'lamplighter', 'hollow', 'vigil', 'map',
]);

// Owner-FAIL focused rows: shape/profile pairs that triggered the FAIL list.
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

function gitHead() {
  return execFileSync('git', ['rev-parse', 'HEAD'], { cwd: ROOT, encoding: 'utf8' }).trim();
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
      && !!document.querySelector('.r5-title');
  });
  await page.evaluate(async (opts) => {
    await document.fonts.ready;
    const bound = (work, ms = 2500) => Promise.race([
      Promise.resolve(typeof work === 'function' ? work() : work).catch(() => {}),
      new Promise((resolve) => setTimeout(resolve, ms)),
    ]);
    if (window.__probe?.settle) await bound(() => window.__probe.settle());
    const mapOn = !!document.querySelector('.r5-map')
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

async function main() {
  const sourceSha = gitHead();
  if (existsSync(OUT)) rmSync(OUT, { recursive: true, force: true });
  mkdirSync(OUT, { recursive: true });

  const port = Number(process.env.SPIREBOUND_E2E_PORT || 5174);
  const settings = e2eServerSettings(
    process.env.SPIREBOUND_E2E_PORT ? String(port) : undefined,
  );
  const server = settings.isolated ? await startDevServer(settings) : null;
  const browser = await chromium.launch({ headless: true });
  const rows = [];
  const failed = [];

  try {
    for (const entry of FOCUS_ROWS) {
      if (!SCREENS.includes(entry.screen)) fail(`unknown screen ${entry.screen}`);
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
        });
      }
      if (entry.screen === 'embark' && entry.profile === 'grown') {
        await page.waitForSelector('.r5-vow-dial', { state: 'attached', timeout: 10_000 });
      }
      if (entry.screen === 'map') {
        await page.waitForSelector('.r5-map', { state: 'attached', timeout: 15_000 });
      }
      await waitSettled(page, { keepBg3d: entry.screen === 'map' });
      const payload = await page.evaluate(() => window.__probe.screenLayoutGates());
      const summary = summarizeGateReport(payload.report);
      const id = `${entry.screen}__${entry.shape}__${entry.profile}`;
      const row = {
        id,
        ...entry,
        summary,
        gates: payload.report.gates.filter((g) => g.applicable),
        projection: payload.projection,
      };
      rows.push(row);
      if (summary.failedApplicable > 0) {
        failed.push({ id, failedIds: summary.failedIds, gates: row.gates });
      }
      writeFileSync(path.join(OUT, `${id}.json`), `${JSON.stringify(row, null, 2)}\n`);
      await context.close();
    }
  } finally {
    await browser.close();
    stopDevServer(server);
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    sourceSha,
    gateIds: OWNER_FAIL_GATE_IDS,
    focusCount: FOCUS_ROWS.length,
    failedCount: failed.length,
    failed,
    rows: rows.map((r) => ({
      id: r.id,
      summary: r.summary,
      applicableGateIds: r.gates.map((g) => g.id),
    })),
    sha256: createHash('sha256').update(JSON.stringify(rows.map((r) => r.id))).digest('hex'),
  };
  writeFileSync(path.join(OUT, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);

  // Promote next to contact sheets when clean.
  if (existsSync(ART)) rmSync(ART, { recursive: true, force: true });
  mkdirSync(ART, { recursive: true });
  copyFileSync(path.join(OUT, 'manifest.json'), path.join(ART, 'manifest.json'));
  for (const row of rows) {
    copyFileSync(path.join(OUT, `${row.id}.json`), path.join(ART, `${row.id}.json`));
  }

  console.log(
    `layout projection: ${rows.length} rows, failedApplicable=${failed.length} → ${OUT} (sourceSha=${sourceSha})`,
  );
  if (failed.length) {
    console.error('FAILED GATES:');
    for (const f of failed) {
      console.error(`  ${f.id}: ${f.failedIds.join(', ')}`);
    }
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
