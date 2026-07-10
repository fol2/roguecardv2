// Performance gate (hardening spec §10): the previous pass *assumed* the
// 55fps budget was met and never measured it. This suite measures it.
// Portrait project = the LITE tier (coarse pointer), CPU throttled 4× via
// CDP — a mid-range phone stand-in. The load is the heaviest single beat:
// an AoE bespoke effect (Requiem) hitting three enemies at once.
import { mkdirSync, writeFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';
import { boot, startFight, collectErrors, expectNoErrors } from './helpers.js';

test.beforeEach(() => {
  // measurement wants a quiet machine: no parallel WebGL pages stealing the
  // GPU. npm run test:e2e:perf runs this file alone with a single worker.
  test.skip(!process.env.PERF, 'perf measurement runs separately — use npm run test:e2e:perf');
  test.skip(test.info().project.name !== 'portrait',
    'the fps budget is defined for the LITE tier — portrait project only');
});

test('AoE effect burst holds the frame budget at 4x CPU throttle', async ({ page }) => {
  const errors = collectErrors(page);
  await boot(page); // mesh + LITE exactly as a real coarse-pointer device gets them
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
    // keep every corpse off the critical path: leave all three alive,
    // the burst itself is the load being measured
  });
  const uids = await page.evaluate(() => window.__probe.forceHand(['annihilate', 'annihilate']));

  // let shader compilation and first-paint costs pass — the gate measures
  // steady-state playback, not the one-off warm-up (cold headless GPU runs
  // <1fps for the first seconds while ANGLE compiles the bloom pipeline)
  await page.waitForTimeout(3000);

  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });

  // sample rAF deltas for 3s while both bursts play back
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
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
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
  expectNoErrors(errors, 'perf burst');

  const metrics = {
    avgFps: Number(avgFps.toFixed(2)),
    p95FrameMs: Number(p95.toFixed(2)),
    worstFrameMs: Number(worst.toFixed(2)),
    frames: deltas.length,
    project: test.info().project.name,
  };
  const values = [metrics.avgFps, metrics.p95FrameMs, metrics.worstFrameMs, metrics.frames];
  if (!values.every((value) => Number.isFinite(value) && value > 0)
      || !Number.isInteger(metrics.frames)) {
    throw new Error(`performance measurement produced invalid metrics: ${JSON.stringify(metrics)}`);
  }
  mkdirSync('test-results', { recursive: true });
  writeFileSync('test-results/perf-metrics.json', `${JSON.stringify(metrics, null, 2)}\n`);
  console.log(`PERF_RESULT ${JSON.stringify(metrics)}`);
  test.info().annotations.push({ type: 'perf', description: `avg ${avgFps.toFixed(1)}fps, p95 frame ${p95.toFixed(1)}ms, worst ${worst.toFixed(1)}ms over ${deltas.length} frames` });

  expect(avgFps, `average fps during the burst (got ${avgFps.toFixed(1)})`).toBeGreaterThanOrEqual(55);
  expect(p95, `p95 frame time in ms (got ${p95.toFixed(1)})`).toBeLessThanOrEqual(22);
});
