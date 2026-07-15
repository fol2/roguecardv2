#!/usr/bin/env node
/**
 * Task 34 — deterministic Round 5 contact-sheet capture.
 * Drives URL Lab/probe scenarios for every screen × shape × fresh/grown state
 * and every named Phase-2 substate (43 rows). Writes PNGs + composed sheets
 * under test-results/round5-contact-sheets/.
 */
import { createHash } from 'node:crypto';
import { spawn, execFileSync } from 'node:child_process';
import {
  mkdirSync, writeFileSync, existsSync, rmSync, readFileSync, readdirSync, statSync,
} from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import {
  CANONICAL_SHAPES,
  ENGLISH_CONTENT_HASH,
  ENGLISH_UI_HASH,
  ENGLISH_CATALOGUE_HASH,
  FRESH_VIGIL,
  GROWN_VIGIL,
  PHASE2_CAPTURE_MANIFEST,
  assertPhase2Manifest,
} from '../test/e2e/p6-fixtures.js';
import { stagePhase2State } from '../test/e2e/p6-phase2-stage.js';
import { e2eServerSettings } from '../playwright-server.js';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'test-results', 'round5-contact-sheets');
const CAPTURE_COMMAND = 'node tools/run-with-strict-e2e-port.mjs -- npm run capture:round5:contact-sheets';

const BASE_SCREENS = Object.freeze([
  'title', 'embark', 'fall', 'dawn', 'rewards', 'boss-relic', 'shop', 'event',
  'rest', 'treasure', 'lamplighter', 'hollow', 'vigil', 'map',
]);

assertPhase2Manifest(PHASE2_CAPTURE_MANIFEST);

function fail(message) {
  console.error(message);
  process.exit(1);
}

function gitHead() {
  return execFileSync('git', ['rev-parse', 'HEAD'], { cwd: ROOT, encoding: 'utf8' }).trim();
}

async function waitForOrigin(origin, timeoutMs = 30_000) {
  const start = Date.now();
  let lastError = null;
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(origin, { redirect: 'manual' });
      if (res.ok || (res.status >= 300 && res.status < 500)) return;
      lastError = new Error(`unexpected status ${res.status}`);
    } catch (error) {
      lastError = error;
    }
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error(`dev server not ready at ${origin}: ${lastError?.message || lastError}`);
}

async function startDevServer(settings) {
  const child = spawn(settings.command, {
    cwd: ROOT,
    shell: true,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env },
  });
  let bootLog = '';
  const onChunk = (buf) => {
    bootLog += buf.toString();
    if (bootLog.length > 8000) bootLog = bootLog.slice(-4000);
  };
  child.stdout?.on('data', onChunk);
  child.stderr?.on('data', onChunk);
  try {
    await waitForOrigin(settings.origin);
  } catch (error) {
    child.kill('SIGTERM');
    fail(`${error.message}\n--- server log ---\n${bootLog}`);
  }
  return child;
}

function stopDevServer(child) {
  if (!child || child.killed) return;
  child.kill('SIGTERM');
}

function fileInventory(dir) {
  const files = [];
  const walk = (rel) => {
    const abs = path.join(dir, rel);
    for (const name of readdirSync(abs)) {
      const childRel = rel ? path.join(rel, name) : name;
      const childAbs = path.join(dir, childRel);
      const st = statSync(childAbs);
      if (st.isDirectory()) walk(childRel);
      else {
        const buf = readFileSync(childAbs);
        files.push({
          path: childRel.split(path.sep).join('/'),
          byteSize: st.size,
          mediaType: name.endsWith('.png') ? 'image/png'
            : name.endsWith('.html') ? 'text/html'
              : name.endsWith('.json') ? 'application/json'
                : 'application/octet-stream',
          sha256: createHash('sha256').update(buf).digest('hex'),
        });
      }
    }
  };
  walk('');
  return files.sort((a, b) => a.path.localeCompare(b.path));
}

async function waitSettled(page) {
  await page.waitForFunction(() => window.spirebound && window.__probe);
  await page.waitForFunction(() => {
    const records = window.__probe?.behaviourTrace?.()?.records;
    if (records?.some((record) => record.eventName === 'app.ready')) return true;
    return window.spirebound?.S?.screen === 'title'
      && !!document.querySelector('.r5-title');
  });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map((img) => img.decode().catch(() => {})));
    if (window.__probe?.settle) await window.__probe.settle();
    if (window.__probe?.freeze) window.__probe.freeze();
  });
}

async function scanLocale(page) {
  return page.evaluate(() => {
    const text = document.body.innerText || '';
    return {
      unresolvedKeys: [...text.matchAll(/\bui\.[a-z0-9.]+/gi)].map((m) => m[0]),
      unresolvedParams: [...text.matchAll(/\{[a-zA-Z][a-zA-Z0-9_]*\}/g)].map((m) => m[0]),
      versionVisible: !!document.querySelector('[data-version-display]'),
      locale: document.documentElement.lang || 'en',
    };
  });
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
      run.map = sp.E.genMap(run);
      const node = run.map.nodes[1] || run.map.nodes[0];
      run.pendingHollow = { nodeId: node.id, paid: false, deferred: false, answer: null };
      sp.show('hollow');
      return;
    }
    if (screenId === 'vigil') { sp.show('vigil'); return; }
    if (screenId === 'map') { sp.show('map'); return; }
  }, [screen, profile === 'grown']);
}

async function stagePhase2(page, stateId) {
  await stagePhase2State(page, stateId);
}

async function capturePng(page, filePath) {
  mkdirSync(path.dirname(filePath), { recursive: true });
  await page.locator('#stage').screenshot({ path: filePath, type: 'png' });
}

function composeSheet(label, files, outPath) {
  // Lightweight sheet: write a manifest HTML grid that references the PNGs.
  const cells = files.map((file) => {
    const rel = path.relative(path.dirname(outPath), file);
    return `<figure><img src="${rel}" alt=""><figcaption>${path.basename(file, '.png')}</figcaption></figure>`;
  }).join('\n');
  const html = `<!doctype html><meta charset="utf-8"><title>${label}</title>
<style>
body{margin:0;background:#0b0e1a;color:#d7dcea;font:14px/1.3 Cinzel,serif}
h1{margin:16px;font-size:18px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px;padding:16px}
figure{margin:0;background:#12162a;padding:8px}
img{width:100%;height:auto;display:block;background:#000}
figcaption{margin-top:6px;font-size:11px;opacity:.8;word-break:break-all}
</style>
<h1>${label}</h1>
<section class="grid">${cells}</section>`;
  writeFileSync(outPath, html);
}

async function main() {
  const ids = PHASE2_CAPTURE_MANIFEST.map((row) => row.id);
  const dup = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dup.length) fail(`duplicate Phase-2 ids: ${dup.join(', ')}`);
  if (ids.length !== 43) fail(`expected 43 Phase-2 rows, got ${ids.length}`);

  if (existsSync(OUT)) rmSync(OUT, { recursive: true, force: true });
  mkdirSync(OUT, { recursive: true });

  const sourceSha = gitHead();
  const port = Number(process.env.SPIREBOUND_E2E_PORT || 5174);
  const settings = e2eServerSettings(
    process.env.SPIREBOUND_E2E_PORT ? String(port) : undefined,
  );
  // Isolated (strict-port) runs must boot their own server; shared 5174 may reuse.
  const server = settings.isolated ? await startDevServer(settings) : null;
  const browser = await chromium.launch({ headless: true });
  const rows = [];
  const byScreen = new Map();

  try {
    for (const shape of CANONICAL_SHAPES) {
      for (const profile of ['fresh', 'grown']) {
        for (const screen of BASE_SCREENS) {
          const context = await browser.newContext({
            viewport: { width: 1280, height: 800 },
            reducedMotion: 'reduce',
          });
          const page = await context.newPage();
          await page.addInitScript((vigil) => {
            localStorage.removeItem('spirebound_save_v2');
            localStorage.setItem('spirebound_vigil_v2', JSON.stringify(vigil));
          }, profile === 'grown' ? GROWN_VIGIL : FRESH_VIGIL);
          await page.goto(`${settings.origin}/?shape=${shape}&mesh=0&trace=1`);
          await waitSettled(page);
          await stageScreen(page, screen, profile);
          await waitSettled(page);
          const locale = await scanLocale(page);
          if (locale.locale !== 'en' && locale.locale !== '') {
            fail(`locale must be en for ${screen}/${shape}/${profile}`);
          }
          if (locale.unresolvedKeys.length || locale.unresolvedParams.length) {
            fail(`unresolved locale tokens on ${screen}/${shape}/${profile}: ${JSON.stringify(locale)}`);
          }
          const id = `${screen}__${shape}__${profile}`;
          const file = path.join(OUT, 'base', `${id}.png`);
          await capturePng(page, file);
          const row = {
            id,
            kind: 'base',
            screen,
            shape,
            profile,
            locale: 'en',
            contentHash: ENGLISH_CONTENT_HASH,
            uiHash: ENGLISH_UI_HASH,
            catalogueHash: ENGLISH_CATALOGUE_HASH,
            versionVisible: locale.versionVisible,
            unresolvedKeys: locale.unresolvedKeys,
            unresolvedParams: locale.unresolvedParams,
            file: path.relative(OUT, file),
          };
          rows.push(row);
          if (!byScreen.has(screen)) byScreen.set(screen, { base: [], phase2: [] });
          byScreen.get(screen).base.push(file);
          await context.close();
        }
      }
    }

    for (const entry of PHASE2_CAPTURE_MANIFEST) {
      const context = await browser.newContext({
        viewport: { width: 1280, height: 800 },
        reducedMotion: 'reduce',
      });
      const page = await context.newPage();
      await page.addInitScript((vigil) => {
        localStorage.removeItem('spirebound_save_v2');
        localStorage.setItem('spirebound_vigil_v2', JSON.stringify(vigil));
      }, GROWN_VIGIL);
      await page.goto(`${settings.origin}/?shape=desktop-landscape&mesh=0&trace=1`);
      await waitSettled(page);
      await stagePhase2(page, entry.id);
      await waitSettled(page);
      const locale = await scanLocale(page);
      const file = path.join(OUT, 'phase2', `${entry.id}.png`);
      await capturePng(page, file);
      rows.push({
        id: entry.id,
        kind: 'phase2',
        screen: entry.screen,
        shape: 'desktop-landscape',
        profile: 'grown',
        locale: 'en',
        contentHash: ENGLISH_CONTENT_HASH,
        uiHash: ENGLISH_UI_HASH,
        catalogueHash: ENGLISH_CATALOGUE_HASH,
        versionVisible: locale.versionVisible,
        unresolvedKeys: locale.unresolvedKeys,
        unresolvedParams: locale.unresolvedParams,
        file: path.relative(OUT, file),
      });
      if (!byScreen.has(entry.screen)) byScreen.set(entry.screen, { base: [], phase2: [] });
      byScreen.get(entry.screen).phase2.push(file);
      await context.close();
    }
  } finally {
    await browser.close();
    stopDevServer(server);
  }

  for (const [screen, groups] of byScreen) {
    composeSheet(
      `${screen} — base`,
      groups.base,
      path.join(OUT, 'sheets', `${screen}-base.html`),
    );
    if (groups.phase2.length) {
      composeSheet(
        `${screen} — Phase-2 substates`,
        groups.phase2,
        path.join(OUT, 'sheets', `${screen}-phase2.html`),
      );
    }
  }

  const artifactFiles = fileInventory(OUT).filter((f) => f.path !== 'manifest.json');
  const manifest = {
    generatedAt: new Date().toISOString(),
    sourceSha,
    captureCommand: CAPTURE_COMMAND,
    contentHash: ENGLISH_CONTENT_HASH,
    uiHash: ENGLISH_UI_HASH,
    catalogueHash: ENGLISH_CATALOGUE_HASH,
    phase2Count: PHASE2_CAPTURE_MANIFEST.length,
    rows,
    files: artifactFiles,
    sha256: createHash('sha256').update(JSON.stringify(rows.map((r) => r.id))).digest('hex'),
  };
  writeFileSync(path.join(OUT, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`captured ${rows.length} rows → ${OUT} (sourceSha=${sourceSha})`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
