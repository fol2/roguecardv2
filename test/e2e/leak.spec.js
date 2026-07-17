// Round 5 Task 29 — P5 cache / texture / host-relative heap regression.
// Chromium desktop owns the CDP HeapProfiler claim. WebKit keeps cache/count
// + functional checks and is explicitly excluded from the heap median gate.
import { test, expect } from '@playwright/test';
import { contrastRatio, COLOUR } from '../../src/ui/tokens.js';
import { FACE_CACHE_MAX_ENTRIES, FACE_CACHE_BYTE_CAPS } from '../../src/ui/cardface-layout.js';
import { boot, startFight, settle, collectErrors, expectNoErrors, inventoryCombatDom } from './helpers.js';

const MiB = 1024 * 1024;
const IDENTICAL_CYCLES = 3;
const HEAP_SAMPLES = 3;
const FIGHT_IDS = ['sporeling', 'sporeling'];

function isChromiumDesktop(projectName) {
  return projectName === 'desktop';
}

function isWebKit(projectName) {
  return projectName === 'iphone-webkit' || projectName === 'ipad-webkit';
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

async function sampleCardFace(page) {
  return page.evaluate(() => {
    const stats = window.spirebound?.combatGl?.stats?.()?.cardFace
      || window.__probe?.combatRendererStats?.()?.cardFace
      || null;
    if (!stats) return null;
    return {
      entries: stats.entries ?? 0,
      bytes: stats.bytes ?? 0,
      byteCap: stats.byteCap ?? null,
      maxEntries: stats.maxEntries ?? null,
      tier: stats.tier ?? null,
      keys: stats.keys ? [...stats.keys] : [],
    };
  });
}

async function runIdenticalFight(page) {
  await page.evaluate(async () => {
    const sp = window.spirebound;
    // Always restart the same seeded run's combat — avoid stacking orphaned runs.
    if (!sp.S.run || sp.S.screen !== 'combat') {
      sp.S.run = sp.E.newRun(20260714, { aspect: 0 });
    }
    sp.startCombatUI(['sporeling', 'sporeling'], 'normal');
    await window.__probe.settle();
    window.__probe.setEnergy(3);
    const uids = window.__probe.forceHand(['strike', 'defend', 'strike']);
    for (const uid of uids) {
      const target = window.__probe.state().enemies.findIndex((e) => e.hp > 0);
      await window.__probe.play(uid, target >= 0 ? target : 0);
    }
    if (window.__probe.state().screen === 'combat' && !window.__probe.state().over) {
      await window.__probe.endTurn();
    }
    await window.__probe.settle();
  });
}

async function collectHeapUsed(page) {
  let cdp;
  try {
    cdp = await page.context().newCDPSession(page);
  } catch (error) {
    throw new Error(`CDP session unavailable for heap claim: ${error.message}`);
  }
  try {
    await cdp.send('HeapProfiler.enable');
    await cdp.send('HeapProfiler.collectGarbage');
    // Let the event loop drain after forced GC before reading the metric.
    await page.evaluate(() => new Promise((r) => setTimeout(r, 50)));
    await cdp.send('Performance.enable').catch(() => {});
    const { metrics } = await cdp.send('Performance.getMetrics');
    const row = metrics.find((m) => m.name === 'JSHeapUsedSize');
    if (!row || !Number.isFinite(row.value)) {
      throw new Error('CDP JSHeapUsedSize unavailable after HeapProfiler.collectGarbage');
    }
    return Number(row.value);
  } finally {
    try { await cdp.detach(); } catch { /* */ }
  }
}

test.beforeEach(() => {
  const project = test.info().project.name;
  test.skip(
    !(isChromiumDesktop(project) || isWebKit(project)),
    'leak runs on Chromium desktop + Playwright WebKit only',
  );
});

test('composer cache + texture bytes stay bounded across identical fights', async ({ page }) => {
  test.setTimeout(300_000);
  const project = test.info().project.name;
  const errors = collectErrors(page);
  await boot(page, { query: 'mesh=0&trace=off' });
  await page.waitForFunction(() => window.spirebound?.pixi?.status?.() === 'ready', null, {
    timeout: 20_000,
  });

  // Warm runtime / composer.
  await runIdenticalFight(page);
  const warm = await sampleCardFace(page);
  expect(warm, 'cardFace stats available after warm').toBeTruthy();
  expect(warm.entries, 'managed entries ≤24').toBeLessThanOrEqual(FACE_CACHE_MAX_ENTRIES);
  const tierCap = warm.tier === 'lite' ? FACE_CACHE_BYTE_CAPS.lite : FACE_CACHE_BYTE_CAPS.full;
  expect(warm.bytes, 'RGBA allocation within tier cap').toBeLessThanOrEqual(tierCap);

  let baseline = null;
  if (isChromiumDesktop(project)) {
    baseline = [];
    for (let i = 0; i < HEAP_SAMPLES; i += 1) {
      baseline.push(await collectHeapUsed(page));
    }
  }

  const postWarmSamples = [];
  for (let i = 0; i < IDENTICAL_CYCLES; i += 1) {
    await runIdenticalFight(page);
    postWarmSamples.push(await sampleCardFace(page));
  }

  const [a, b, c] = postWarmSamples;
  expect(a.entries).toBe(b.entries);
  expect(b.entries).toBe(c.entries);
  expect(a.bytes).toBe(b.bytes);
  expect(b.bytes).toBe(c.bytes);
  expect(a.entries).toBeLessThanOrEqual(FACE_CACHE_MAX_ENTRIES);
  expect(a.bytes).toBeLessThanOrEqual(tierCap);

  // Host-relative labels in the annotation.
  test.info().annotations.push({
    type: 'leak-cache',
    description: `host-relative entries=${a.entries}/${FACE_CACHE_MAX_ENTRIES} bytes=${a.bytes}/${tierCap} tier=${a.tier || 'full'}`,
  });

  if (isChromiumDesktop(project)) {
    const post = [];
    for (let i = 0; i < HEAP_SAMPLES; i += 1) {
      post.push(await collectHeapUsed(page));
    }
    const baseMed = median(baseline);
    const postMed = median(post);
    const growth = postMed - baseMed;
    const budget = Math.max(5 * MiB, 0.15 * baseMed);
    test.info().annotations.push({
      type: 'leak-heap',
      description: `host-relative heap baselineMed=${(baseMed / MiB).toFixed(2)}MiB postMed=${(postMed / MiB).toFixed(2)}MiB growth=${(growth / MiB).toFixed(2)}MiB budget=${(budget / MiB).toFixed(2)}MiB`,
    });
    expect(growth, `median post-GC heap growth ${(growth / MiB).toFixed(2)}MiB exceeds budget`).toBeLessThanOrEqual(budget);
  } else {
    test.info().annotations.push({
      type: 'leak-heap',
      description: 'WebKit excluded from Chromium CDP HeapProfiler claim (cache/count only)',
    });
  }

  expectNoErrors(errors, 'leak cache/heap');
});

test('P5 canvas HUD / pile / chrome text clears ≥4.5:1 local contrast', async ({ page }) => {
  test.skip(!isChromiumDesktop(test.info().project.name), 'canvas contrast sample on Chromium desktop');
  const errors = collectErrors(page);
  await boot(page, { query: 'mesh=0&trace=1' });
  await startFight(page, ['sporeling']);
  await settle(page);

  // Pure token-pair gate (standing).
  expect(contrastRatio(COLOUR.text, COLOUR.ink)).toBeGreaterThanOrEqual(4.5);
  expect(contrastRatio(COLOUR.parchment, COLOUR.ink)).toBeGreaterThanOrEqual(4.5);
  expect(contrastRatio(COLOUR.gold, COLOUR.ink)).toBeGreaterThanOrEqual(4.5);
  expect(contrastRatio(COLOUR.ember, COLOUR.ink)).toBeGreaterThanOrEqual(4.5);

  // True combat DOM whitelist (shared with battle).
  const inventory = await inventoryCombatDom(page);
  expect(inventory.ok, `unexpected combat DOM: ${JSON.stringify(inventory.unexpected)}`).toBe(true);
  expect(inventory.emptyHosts.floaties).toBe(0);
  expect(inventory.emptyHosts.aim).toBe(0);

  const samples = await page.evaluate(async () => {
    const gl = window.spirebound.combatGl;
    const read = gl?.readUI?.();
    if (!gl?.sampleLiveChromeContrast || !read) {
      return { ok: false, reason: 'missing-live-chrome-sample-api' };
    }
    const out = await gl.sampleLiveChromeContrast();
    return {
      ok: true,
      samples: out,
      hasPiles: !!read?.piles,
      hasEnergy: !!read?.chrome?.energy || !!read?.energy || !!read?.candleFrame,
      hasEndTurn: !!read?.endTurn,
      hasLantern: !!read?.lantern,
      pileDrawCount: read?.piles?.draw ? true : false,
    };
  });

  expect(samples.ok, samples.reason || 'live chrome sample').toBe(true);
  expect(samples.hasPiles).toBe(true);
  expect(samples.hasEnergy).toBe(true);
  expect(samples.hasEndTurn).toBe(true);
  expect(samples.hasLantern).toBe(true);
  expect(samples.samples.length).toBeGreaterThanOrEqual(4);
  for (const s of samples.samples) {
    expect(s.measured, `${s.label} measured from live paint (${s.reason || s.source})`).toBe(true);
    expect(s.source, `${s.label} must be pixel extract not token fallback`).toBe('pixels');
    expect(s.ratio, `${s.label} local contrast`).toBeGreaterThanOrEqual(4.5);
  }
  expectNoErrors(errors, 'P5 contrast samples');
});

test('long random-agent fight leaves cache within caps', async ({ page }) => {
  test.setTimeout(240_000);
  test.skip(!isChromiumDesktop(test.info().project.name), 'long random agent on Chromium desktop');
  const errors = collectErrors(page);
  await boot(page, { query: 'mesh=0&trace=off' });
  await startFight(page, ['duskfang', 'sporeling']);
  await page.evaluate(async () => {
    const p = window.__probe;
    for (let turn = 0; turn < 40; turn += 1) {
      let st = p.state();
      if (st.screen !== 'combat' || st.over) break;
      let played = true;
      while (played) {
        st = p.state();
        if (st.screen !== 'combat' || st.over) break;
        played = false;
        const target = st.enemies.findIndex((enemy) => enemy.hp > 0);
        for (const card of st.hand) {
          if (await p.play(card.uid, target)) {
            played = true;
            break;
          }
        }
      }
      st = p.state();
      if (st.screen !== 'combat' || st.over) break;
      await p.endTurn();
    }
  });
  const face = await sampleCardFace(page);
  if (face) {
    expect(face.entries).toBeLessThanOrEqual(FACE_CACHE_MAX_ENTRIES);
    const tierCap = face.tier === 'lite' ? FACE_CACHE_BYTE_CAPS.lite : FACE_CACHE_BYTE_CAPS.full;
    expect(face.bytes).toBeLessThanOrEqual(tierCap);
  }
  expectNoErrors(errors, 'long random-agent leak');
});
