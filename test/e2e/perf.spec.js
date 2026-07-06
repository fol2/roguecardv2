// Performance gate (hardening spec §10): the previous pass *assumed* the
// 55fps budget was met and never measured it. This suite measures it.
// Portrait project = the LITE tier (coarse pointer), CPU throttled 4× via
// CDP — a mid-range phone stand-in. The load is the heaviest single beat:
// an AoE bespoke effect (Requiem) hitting three enemies at once.
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
  await startFight(page, ['sporeling', 'sporeling', 'sporeling']);
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
    let last = performance.now();
    const until = last + 3000;
    const step = (t) => {
      deltas.push(t - last);
      last = t;
      if (t < until) requestAnimationFrame(step);
      else resolve(deltas);
    };
    requestAnimationFrame(step);
  }));
  await page.evaluate(async (us) => {
    for (const u of us) await window.__probe.play(u, null);
  }, uids);
  const deltas = await sampler;
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });

  const avgFps = 1000 / (deltas.reduce((a, b) => a + b, 0) / deltas.length);
  const sorted = [...deltas].sort((a, b) => a - b);
  const p95 = sorted[Math.floor(sorted.length * 0.95)];
  const worst = sorted[sorted.length - 1];
  test.info().annotations.push({ type: 'perf', description: `avg ${avgFps.toFixed(1)}fps, p95 frame ${p95.toFixed(1)}ms, worst ${worst.toFixed(1)}ms over ${deltas.length} frames` });

  expect(avgFps, `average fps during the burst (got ${avgFps.toFixed(1)})`).toBeGreaterThanOrEqual(55);
  expect(p95, `p95 frame time in ms (got ${p95.toFixed(1)})`).toBeLessThanOrEqual(22);
  expectNoErrors(errors, 'perf burst');
});
