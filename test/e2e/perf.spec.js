// Performance reference (hardening spec §10 / Round 5 Task 24):
// Portrait/LITE @ 4× CPU and desktop/Full (foil/high DPR). Valid target misses
// emit PERF_WARNING and never fail the suite. Missing/invalid/crashed metrics
// or an unreadypixi layer remain hard failures. Semantic trace recording is
// disabled in both tiers; each writes a separate JSON artifact.
import { mkdirSync, writeFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';
import { boot, startFight, collectErrors, expectNoErrors } from './helpers.js';

export const PERF_REFERENCE = Object.freeze({ minAvgFps: 55, maxP95FrameMs: 22 });

function tierForProject(projectName) {
  if (projectName === 'portrait') return 'lite';
  if (projectName === 'desktop') return 'full';
  return null;
}

function artifactName(tier) {
  return tier === 'full' ? 'perf-metrics-full.json' : 'perf-metrics.json';
}

test.beforeEach(() => {
  test.skip(!process.env.PERF, 'perf measurement runs separately — use npm run test:e2e:perf');
  const tier = process.env.PERF_TIER || 'lite';
  const project = test.info().project.name;
  const expected = tierForProject(project);
  test.skip(!expected, 'perf runs on portrait (LITE) or desktop (Full) only');
  if (tier === 'full') {
    test.skip(project !== 'desktop', 'PERF_TIER=full requires the desktop project');
  } else {
    test.skip(project !== 'portrait', 'default LITE perf requires the portrait project');
  }
});

test('AoE effect burst records reference metrics', async ({ page }) => {
  const project = test.info().project.name;
  const tier = tierForProject(project);
  const errors = collectErrors(page);
  // Disable semantic trace recording for both measurement tiers.
  await boot(page, { query: `trace=off&tier=${tier}` });
  await page.waitForFunction(() => window.spirebound?.pixi?.status?.() === 'ready', null, {
    timeout: 20_000,
  });
  const pixiReady = await page.evaluate(() => window.spirebound.pixi.status() === 'ready');
  expect(pixiReady, 'Pixi must be ready before perf sampling').toBe(true);

  await startFight(page, ['duskfang', 'duskfang', 'duskfang']);
  const fixture = await page.evaluate(() => {
    const enemies = window.__probe.state().enemies;
    return { count: enemies.length, minimumHp: Math.min(...enemies.map((enemy) => enemy.hp)) };
  });
  expect(fixture.count, 'fixture must contain three simultaneous enemies').toBe(3);
  expect(
    fixture.minimumHp,
    'fixture must leave every enemy alive after both nine-damage Requiem bursts',
  ).toBeGreaterThan(18);
  await page.evaluate(() => {
    window.__probe.setEnergy(9);
  });
  const uids = await page.evaluate(() => window.__probe.forceHand(['annihilate', 'annihilate']));

  await page.waitForTimeout(3000);

  let cdp = null;
  if (tier === 'lite') {
    cdp = await page.context().newCDPSession(page);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  }

  const sampler = page.evaluate(() => new Promise((resolve) => {
    const deltas = [];
    requestAnimationFrame((first) => {
      let last = first;
      const until = first + 3000;
      const step = (t) => {
        deltas.push(t - last);
        last = t;
        if (t < until) requestAnimationFrame(step);
        else resolve(deltas);
      };
      requestAnimationFrame(step);
    });
  }));
  await page.evaluate(async (us) => {
    for (const u of us) await window.__probe.play(u, null);
  }, uids);
  const deltas = await sampler;
  if (cdp) await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });

  const survivors = await page.evaluate(() => (
    window.__probe.state().enemies.filter((enemy) => enemy.hp > 0).length
  ));
  expect(survivors, 'measurement must not include enemy death playback').toBe(3);

  if (!deltas.length || deltas.some((delta) => !Number.isFinite(delta) || delta <= 0)) {
    throw new Error('performance measurement produced invalid frame deltas');
  }
  const avgFps = 1000 / (deltas.reduce((a, b) => a + b, 0) / deltas.length);
  const sorted = [...deltas].sort((a, b) => a - b);
  const p95 = sorted[Math.floor(sorted.length * 0.95)];
  const worst = sorted[sorted.length - 1];
  if (![avgFps, p95, worst].every((value) => Number.isFinite(value) && value > 0)) {
    throw new Error('performance measurement produced non-finite frame metrics');
  }
  expectNoErrors(errors, `perf burst (${tier})`);

  const metrics = {
    avgFps: Number(avgFps.toFixed(2)),
    p95FrameMs: Number(p95.toFixed(2)),
    worstFrameMs: Number(worst.toFixed(2)),
    frames: deltas.length,
    project: test.info().project.name,
    tier,
    pixiReady: true,
  };
  const values = [metrics.avgFps, metrics.p95FrameMs, metrics.worstFrameMs, metrics.frames];
  if (!values.every((value) => Number.isFinite(value) && value > 0)
      || !Number.isInteger(metrics.frames)) {
    throw new Error(`performance measurement produced invalid metrics: ${JSON.stringify(metrics)}`);
  }
  mkdirSync('test-results', { recursive: true });
  const outName = artifactName(tier);
  writeFileSync(`test-results/${outName}`, `${JSON.stringify(metrics, null, 2)}\n`);
  console.log(`PERF_RESULT ${JSON.stringify(metrics)}`);
  test.info().annotations.push({
    type: 'perf',
    description: `${tier} avg ${avgFps.toFixed(1)}fps, p95 frame ${p95.toFixed(1)}ms, worst ${worst.toFixed(1)}ms over ${deltas.length} frames`,
  });

  // Thresholds are reference-only: never expect()/exit non-zero on a valid miss.
  const warnings = [];
  if (avgFps < PERF_REFERENCE.minAvgFps) {
    warnings.push(`average ${avgFps.toFixed(1)} fps < ${PERF_REFERENCE.minAvgFps} fps target`);
  }
  if (p95 > PERF_REFERENCE.maxP95FrameMs) {
    warnings.push(`p95 ${p95.toFixed(1)} ms > ${PERF_REFERENCE.maxP95FrameMs} ms target`);
  }
  if (warnings.length) {
    const description = warnings.join('; ');
    console.warn(`PERF_WARNING ${description}`);
    test.info().annotations.push({ type: 'perf-warning', description });
  }
});
