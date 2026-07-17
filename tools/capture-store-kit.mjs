#!/usr/bin/env node
/**
 * Task 39 — provisional store-kit capture.
 * Stages title / combat / map / rose-window / boss via probe URLs, freezes,
 * and writes PNGs + raw reference WebM under docs/store-assets/round5/.
 */
import { createHash } from 'node:crypto';
import { spawn, execFileSync } from 'node:child_process';
import {
  mkdirSync, writeFileSync, existsSync, rmSync, readFileSync,
} from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { validateStoreShotList } from '../src/ui/shipfront-assets.js';
import { FRESH_VIGIL, GROWN_VIGIL } from '../test/e2e/p6-fixtures.js';
import { e2eServerSettings } from '../playwright-server.js';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'docs/store-assets/round5');

const SHOTS = Object.freeze([
  {
    id: 'title', seed: 50101, shape: 'desktop-landscape', profile: 'fresh',
    copy: 'Brand wordmark + climb CTA',
  },
  {
    id: 'combat', seed: 50102, shape: 'desktop-landscape', profile: 'fresh',
    copy: 'Hand + enemy readable (no boss override)',
  },
  {
    id: 'map', seed: 50103, shape: 'desktop-landscape', profile: 'fresh',
    copy: 'Path choice visible',
  },
  {
    id: 'rose-window', seed: 50104, shape: 'desktop-landscape', profile: 'grown',
    copy: 'Rose panes + frame',
  },
  {
    id: 'boss', seed: 50105, shape: 'desktop-landscape', profile: 'grown',
    copy: 'Boss plates + HUD clear',
  },
]);

const validation = validateStoreShotList(SHOTS);
if (!validation.ok) {
  console.error(validation.error);
  process.exit(1);
}

function gitHead() {
  return execFileSync('git', ['rev-parse', 'HEAD'], { cwd: ROOT, encoding: 'utf8' }).trim();
}

function sha256File(filePath) {
  return createHash('sha256').update(readFileSync(filePath)).digest('hex');
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
    cwd: ROOT, shell: true, stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env },
  });
  try {
    await waitForOrigin(settings.origin);
  } catch (error) {
    child.kill('SIGTERM');
    throw error;
  }
  return child;
}

async function waitCombatPainted(page) {
  await page.waitForSelector('.sl-backdrop[data-plate-id]', { timeout: 20_000 });
  await page.waitForFunction(() => {
    if (window.spirebound?.S?.screen !== 'combat') return false;
    const read = window.spirebound?.combatGl?.readUI?.();
    const seats = read?.hand?.seats?.length || 0;
    if (seats > 0) return true;
    // Fallback: DOM still paints energy/end-turn while Pixi hand catches up.
    return !!document.querySelector('#energy, .energy, [data-a="end"], .end-turn');
  }, null, { timeout: 20_000 });
  await page.evaluate(async () => {
    const bound = (work, ms = 2500) => Promise.race([
      Promise.resolve(typeof work === 'function' ? work() : work).catch(() => {}),
      new Promise((resolve) => setTimeout(resolve, ms)),
    ]);
    if (window.__probe?.settle) await bound(() => window.__probe.settle());
  });
}

async function settleAndFreeze(page, { keepBg3d = false, keepCombat = false } = {}) {
  await page.evaluate(async (opts) => {
    document.documentElement.classList.remove('freeze');
    document.documentElement.removeAttribute('data-freeze-keep-bg3d');
    document.documentElement.removeAttribute('data-freeze-keep-combat');
    const bound = (work, ms = 2500) => Promise.race([
      Promise.resolve(typeof work === 'function' ? work() : work).catch(() => {}),
      new Promise((resolve) => setTimeout(resolve, ms)),
    ]);
    await document.fonts.ready.catch(() => {});
    if (window.__probe?.settle) await bound(() => window.__probe.settle());
    if (window.__probe?.freeze) {
      await bound(() => window.__probe.freeze({
        keepBg3d: !!opts.keepBg3d,
        keepCombat: !!opts.keepCombat,
      }));
    }
  }, { keepBg3d, keepCombat });
  await page.waitForTimeout(200);
}

async function stageShot(page, context, shot, origin) {
  const grown = shot.profile === 'grown';
  const vigil = grown ? GROWN_VIGIL : FRESH_VIGIL;
  const q = new URLSearchParams({ shape: shot.shape, seed: String(shot.seed) });
  // Seed Vigil before navigation so loadVigil() sees emberglass unlocks.
  await context.addInitScript((seedVigil) => {
    localStorage.removeItem('spirebound_save_v2');
    localStorage.setItem('spirebound_vigil_v2', JSON.stringify(seedVigil));
  }, vigil);
  await page.goto(`${origin}/?${q}`);
  await page.waitForFunction(() => window.spirebound && window.__probe);
  await page.evaluate(([seed, isGrown]) => {
    const sp = window.spirebound;
    sp.S.run = sp.E.newRun(seed, {
      aspect: 0,
      reveals: isGrown
        ? ['phials', 'omens', 'emberglass', 'lamplighter', 'act4']
        : [],
      shards: isGrown ? ['usurper'] : [],
    });
    if (isGrown) sp.S.run.act = Math.min(2, sp.S.run.act || 0);
  }, [shot.seed, grown]);

  if (shot.id === 'title') {
    await page.evaluate(() => window.spirebound.show('title'));
    await page.waitForSelector('.r5-title');
    await settleAndFreeze(page);
  } else if (shot.id === 'combat') {
    await page.evaluate(() => {
      window.spirebound.startCombatUI(['duskfang'], 'normal');
    });
    await waitCombatPainted(page);
    await settleAndFreeze(page, { keepCombat: true });
  } else if (shot.id === 'map') {
    await page.evaluate(() => {
      const sp = window.spirebound;
      sp.S.run.map = sp.E.genMap(sp.S.run);
      sp.show('map');
    });
    await page.waitForFunction(() => window.spirebound.S.screen === 'map');
    await settleAndFreeze(page, { keepBg3d: true });
  } else if (shot.id === 'rose-window') {
    await page.evaluate(() => window.spirebound.show('vigil', { tab: 'rose' }));
    await page.waitForFunction(() => window.spirebound.S.screen === 'vigil');
    await page.waitForSelector('.rose-window, .rose-view', { timeout: 10_000 });
    await settleAndFreeze(page);
  } else if (shot.id === 'boss') {
    await page.evaluate(() => {
      const sp = window.spirebound;
      sp.S.run.act = 0;
      sp.startCombatUI(['rootheart'], 'boss');
    });
    await waitCombatPainted(page);
    await page.waitForFunction(() => {
      const el = document.querySelector('.sl-backdrop[data-plate-id]');
      return el && String(el.getAttribute('data-plate-id') || '').includes('rootheart');
    }, null, { timeout: 10_000 }).catch(() => {});
    await settleAndFreeze(page, { keepCombat: true });
  }
}

async function main() {
  const sourceSha = gitHead();
  mkdirSync(OUT, { recursive: true });
  for (const name of ['title.png', 'combat.png', 'map.png', 'rose-window.png', 'boss.png',
    'raw-reference.webm', 'manifest.json']) {
    const p = path.join(OUT, name);
    if (existsSync(p)) rmSync(p);
  }

  const port = Number(process.env.SPIREBOUND_E2E_PORT || 5174);
  const settings = e2eServerSettings(
    process.env.SPIREBOUND_E2E_PORT ? String(port) : undefined,
  );
  const server = await startDevServer(settings);
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: { dir: OUT, size: { width: 1280, height: 720 } },
  });
  const page = await context.newPage();

  try {
    for (const shot of SHOTS) {
      await stageShot(page, context, shot, settings.origin);
      const pngPath = path.join(OUT, `${shot.id}.png`);
      await page.locator('#stage').screenshot({ path: pngPath });
      console.log('wrote', pngPath);
    }
  } finally {
    await context.close();
    await browser.close();
    server.kill('SIGTERM');
  }

  // Rename the newest webm to raw-reference.webm
  const { readdirSync, renameSync, statSync } = await import('node:fs');
  const webms = readdirSync(OUT).filter((f) => f.endsWith('.webm'));
  if (!webms.length) {
    console.error('missing raw reference webm');
    process.exit(1);
  }
  webms.sort((a, b) => statSync(path.join(OUT, b)).mtimeMs - statSync(path.join(OUT, a)).mtimeMs);
  const rawPath = path.join(OUT, 'raw-reference.webm');
  renameSync(path.join(OUT, webms[0]), rawPath);
  for (const extra of webms.slice(1)) rmSync(path.join(OUT, extra));

  const shotsOut = SHOTS.map((shot) => {
    const file = `${shot.id}.png`;
    const abs = path.join(OUT, file);
    if (!existsSync(abs)) throw new Error(`missing ${file}`);
    return {
      ...shot,
      file,
      sha256: sha256File(abs),
      label: 'provisional/marketing-only',
    };
  });

  const manifest = {
    sourceSha,
    label: 'provisional/marketing-only',
    shots: shotsOut,
    rawReference: {
      file: 'raw-reference.webm',
      sha256: sha256File(rawPath),
      label: 'provisional/marketing-only',
    },
    derivedPublicAssets: {},
  };
  writeFileSync(path.join(OUT, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  console.log('store-kit capture complete at', sourceSha);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
