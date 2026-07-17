#!/usr/bin/env node
/**
 * Capture Round 5 contact sheets from an already-running origin
 * (used for golden 9f10ef2 vs current PE compare).
 *
 * Env:
 *   CONTACT_CAPTURE_ORIGIN  default http://127.0.0.1:5199
 *   CONTACT_CAPTURE_OUT     output directory
 *   CONTACT_CAPTURE_LABEL   label stamped in manifest
 *   CONTACT_CAPTURE_SHA     optional git sha stamped in manifest (e.g. 9f10ef2) */
import { mkdirSync, writeFileSync, existsSync, rmSync } from 'node:fs';
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

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const ORIGIN = process.env.CONTACT_CAPTURE_ORIGIN || 'http://127.0.0.1:5199';
const OUT = process.env.CONTACT_CAPTURE_OUT
  || path.join(ROOT, 'docs/superpowers/artifacts/round5-p6-contact-compare/golden');
const LABEL = process.env.CONTACT_CAPTURE_LABEL || 'golden';

const BASE_SCREENS = Object.freeze([
  'title', 'embark', 'fall', 'dawn', 'rewards', 'boss-relic', 'shop', 'event',
  'rest', 'treasure', 'lamplighter', 'hollow', 'vigil', 'map',
]);

const SCREEN_PAINT_SELECTOR = Object.freeze({
  title: '.r5-title, .title-screen',
  embark: '.r5-embark, .embark-screen',
  fall: '.r5-end--fallen, .end-screen.grave',
  dawn: '.r5-end--victory, .end-screen:not(.grave)',
  rewards: '.r5-rewards, .center-panel',
  'boss-relic': '.r5-rewards--boss, .center-panel',
  shop: '.r5-shop, .center-panel',
  event: '.r5-event, .center-panel',
  rest: '.r5-rest:not(.r5-rest--treasure), .center-panel',
  treasure: '.r5-rest--treasure, .center-panel',
  lamplighter: '.r5-lamplighter, .lamp-screen',
  hollow: '.r5-lamplighter--hollow, .hollow-lamplighter',
  vigil: '.r5-vigil, .vigil-panel, .center-panel',
  map: '.r5-map, .map-shell, .map-title, .mnode',
});

assertPhase2Manifest(PHASE2_CAPTURE_MANIFEST);

function fail(message) {
  console.error(message);
  process.exit(1);
}

async function waitReady(page) {
  await page.waitForFunction(() => window.spirebound && window.__probe, null, { timeout: 30_000 });
  await page.waitForFunction(() => {
    const records = window.__probe?.behaviourTrace?.()?.records;
    if (records?.some((r) => r.eventName === 'app.ready')) return true;
    // Golden tip may lack behaviourTrace app.ready — accept settled title.
    return window.spirebound?.S?.screen === 'title'
      && !!(document.querySelector('.r5-title, .title-screen'));
  }, null, { timeout: 30_000 });
  // Extra beat so initUI's trailing show('title') cannot wipe a staged screen.
  await page.waitForTimeout(400);
  await page.evaluate(async () => {
    await document.fonts.ready;
    document.documentElement.classList.remove('freeze');
    document.documentElement.removeAttribute('data-freeze-keep-bg3d');
    const bound = (work, ms = 2500) => Promise.race([
      Promise.resolve(typeof work === 'function' ? work() : work).catch(() => {}),
      new Promise((r) => setTimeout(r, ms)),
    ]);
    if (window.__probe?.settle) await bound(() => window.__probe.settle());
  });
}

async function waitSettled(page, { keepBg3d = false } = {}) {
  await page.evaluate(async (opts) => {
    await document.fonts.ready;
    const bound = (work, ms = 2500) => Promise.race([
      Promise.resolve(typeof work === 'function' ? work() : work).catch(() => {}),
      new Promise((r) => setTimeout(r, ms)),
    ]);
    if (window.__probe?.settle) await bound(() => window.__probe.settle());
    const mapOn = !!document.querySelector('.r5-map, .map-shell')
      || window.spirebound?.S?.screen === 'map';
    const keepBg3d = !!(opts.keepBg3d || mapOn);
    if (window.__probe?.freeze) await bound(() => window.__probe.freeze({ keepBg3d }));
  }, { keepBg3d });
}

async function assertPainted(page, screen) {
  const selector = SCREEN_PAINT_SELECTOR[screen];
  if (!selector) return;
  try {
    await page.waitForFunction(({ sel, screenId }) => {
      if (window.spirebound?.S?.screen !== screenId
        && !(screenId === 'dawn' && window.spirebound?.S?.screen === 'end')
        && !(screenId === 'fall' && window.spirebound?.S?.screen === 'end')
        && !(screenId === 'rewards' && window.spirebound?.S?.screen === 'reward')
        && !(screenId === 'boss-relic' && ['bossRelic', 'reward'].includes(window.spirebound?.S?.screen))) {
        // still allow DOM match below
      }
      const el = document.querySelector(sel);
      if (!el) return false;
      const cs = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return Number.parseFloat(cs.opacity || '0') > 0.05
        && cs.visibility !== 'hidden'
        && rect.width > 8
        && rect.height > 8;
    }, { sel: selector, screenId: screen }, { timeout: 8000 });
  } catch {
    // Map / hollow sometimes paints late on golden — soft warn, still shoot.
    const screenNow = await page.evaluate(() => window.spirebound?.S?.screen);
    console.warn(`warn: paint assert soft-fail for ${screen} (S.screen=${screenNow}); capturing anyway`);
  }
}

async function stageScreen(page, screen, profile) {
  const grown = profile === 'grown';

  // Golden 9f10ef2 has no show('lamplighter') — renderLamplighter runs via
  // startRun(pendingLamplighter). PE accepts show('lamplighter').
  if (screen === 'lamplighter') {
    const viaShow = await page.evaluate((isGrown) => {
      const sp = window.spirebound;
      const run = sp.E.newRun(3700 + 17, {
        reveals: isGrown
          ? ['phials', 'omens', 'emberglass', 'lamplighter', 'act4']
          : ['lamplighter'],
        shards: isGrown ? ['usurper'] : [],
        lamplighter: true,
      });
      sp.S.run = run;
      sp.S.lamp = null;
      try {
        sp.show('lamplighter');
        return sp.S.screen === 'lamplighter';
      } catch {
        return false;
      }
    }, grown);
    if (viaShow) return;

    await page.evaluate((isGrown) => {
      const sp = window.spirebound;
      localStorage.removeItem('spirebound_save_v2');
      sp.S.lamp = null;
      sp.S.run = null;
      sp.S.cb = null;
      // Force the next embark beginClimb to open the Lamplighter (golden path).
      const orig = sp.E.newRun.bind(sp.E);
      sp.E.newRun = (seed, opts = {}) => {
        const run = orig(seed, {
          ...opts,
          lamplighter: true,
          reveals: [...new Set([...(opts.reveals || []), 'lamplighter',
            ...(isGrown ? ['phials', 'omens', 'emberglass', 'act4'] : [])])],
          shards: isGrown ? (opts.shards || ['usurper']) : (opts.shards || []),
        });
        run.pendingLamplighter = true;
        return run;
      };
      sp.__restoreNewRun = () => { sp.E.newRun = orig; delete sp.__restoreNewRun; };
      sp.show('embark');
    }, grown);
    await page.locator('[data-a="begin"]').first().click({ timeout: 8000 });
    await page.waitForTimeout(250);
    if (await page.locator('.ov-panel [data-a="yes"]').count()) {
      await page.locator('.ov-panel [data-a="yes"]').click();
    }
    await page.waitForFunction(
      () => window.spirebound?.S?.screen === 'lamplighter',
      null,
      { timeout: 10_000 },
    ).catch(() => {});
    await page.evaluate(() => { window.spirebound?.__restoreNewRun?.(); });
    return;
  }

  await page.evaluate(([screenId, grownFlag]) => {
    const sp = window.spirebound;
    const run = sp.E.newRun(3700 + screenId.length, {
      reveals: grownFlag
        ? ['phials', 'omens', 'emberglass', 'lamplighter', 'act4']
        : [],
      shards: grownFlag ? ['usurper'] : [],
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
    if (screenId === 'hollow') {
      run.map = sp.E.genMap(run);
      const node = run.map.nodes[1] || run.map.nodes[0];
      run.pendingHollow = { nodeId: node.id, paid: false, deferred: false, answer: null };
      sp.show('hollow');
      return;
    }
    if (screenId === 'vigil') { sp.show('vigil'); return; }
    if (screenId === 'map') {
      run.map = sp.E.genMap(run);
      sp.show('map');
      return;
    }
  }, [screen, grown]);
}

async function main() {
  const ready = await fetch(ORIGIN).then((r) => r.ok || r.status === 404).catch(() => false);
  if (!ready) fail(`origin not reachable: ${ORIGIN}`);

  if (existsSync(OUT)) rmSync(OUT, { recursive: true, force: true });
  mkdirSync(path.join(OUT, 'base'), { recursive: true });
  mkdirSync(path.join(OUT, 'phase2'), { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const rows = [];
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
          await page.goto(`${ORIGIN}/?shape=${shape}&mesh=0&trace=1`);
          await waitReady(page);
          await stageScreen(page, screen, profile);
          await assertPainted(page, screen);
          // Let screen-enter / panel transitions finish before freeze.
          await page.waitForTimeout(500);
          await waitSettled(page, { keepBg3d: screen === 'map' });
          const id = `${screen}__${shape}__${profile}`;
          const file = path.join(OUT, 'base', `${id}.png`);
          await page.locator('#stage').screenshot({ path: file, type: 'png' });
          rows.push({ id, kind: 'base', screen, shape, profile, file: `base/${id}.png` });
          console.log(`ok ${LABEL} ${id}`);
          await context.close();
        }
      }
    }

    for (const entry of PHASE2_CAPTURE_MANIFEST) {
      const needsFullMotion = entry.id === 'title-rose-loading'
        || entry.id === 'title-rose-inert';
      const context = await browser.newContext({
        viewport: { width: 1280, height: 800 },
        reducedMotion: needsFullMotion ? 'no-preference' : 'reduce',
      });
      const page = await context.newPage();
      await page.addInitScript((vigil) => {
        localStorage.removeItem('spirebound_save_v2');
        localStorage.setItem('spirebound_vigil_v2', JSON.stringify(vigil));
      }, GROWN_VIGIL);
      await page.goto(`${ORIGIN}/?shape=desktop-landscape&mesh=0&trace=1`);
      await waitReady(page);
      try {
        await stagePhase2State(page, entry.id);
      } catch (error) {
        console.warn(`phase2 skip ${entry.id}: ${error.message || error}`);
        await context.close();
        continue;
      }
      await page.waitForTimeout(500);
      await waitSettled(page, { keepBg3d: entry.screen === 'map' });
      const file = path.join(OUT, 'phase2', `${entry.id}.png`);
      await page.locator('#stage').screenshot({ path: file, type: 'png' });
      rows.push({
        id: entry.id, kind: 'phase2', screen: entry.screen,
        shape: 'desktop-landscape', profile: 'grown', file: `phase2/${entry.id}.png`,
      });
      console.log(`ok ${LABEL} phase2 ${entry.id}`);
      await context.close();
    }
  } finally {
    await browser.close();
  }

  writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify({
    label: LABEL,
    origin: ORIGIN,
    sha: process.env.CONTACT_CAPTURE_SHA || null,
    generatedAt: new Date().toISOString(),
    contentHash: ENGLISH_CONTENT_HASH,
    uiHash: ENGLISH_UI_HASH,
    catalogueHash: ENGLISH_CATALOGUE_HASH,
    rows,
  }, null, 2));
  console.log(`captured ${rows.length} rows → ${OUT}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
