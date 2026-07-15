import { test, expect } from './trace-fixture.js';
import { GROWN_VIGIL } from './p6-fixtures.js';
import { OWNER_FAIL_GATE_IDS } from '../../src/ui/screen-layout-projection.js';

async function bootGrown(page, shape) {
  await page.addInitScript((vigil) => {
    localStorage.removeItem('spirebound_save_v2');
    localStorage.setItem('spirebound_vigil_v2', JSON.stringify(vigil));
  }, GROWN_VIGIL);
  await page.goto(`/?shape=${shape}&mesh=0&trace=1`);
  await page.waitForFunction(() => window.spirebound && window.__probe?.screenLayoutGates);
  await page.waitForFunction(() => {
    const records = window.__probe?.behaviourTrace?.()?.records;
    return records?.some((r) => r.eventName === 'app.ready')
      || !!document.querySelector('.r5-title');
  });
}

async function freezeSoft(page) {
  await page.evaluate(async () => {
    const bound = (work) => Promise.race([
      Promise.resolve(work()).catch(() => {}),
      new Promise((r) => setTimeout(r, 2500)),
    ]);
    if (window.__probe.settle) await bound(() => window.__probe.settle());
    if (window.__probe.freeze) await bound(() => window.__probe.freeze({}));
  });
}

test.describe('P6 owner-FAIL layout projection', () => {
  test('probe exposes screenLayout + gates; embark vow is not circular', async ({ page }) => {
    test.skip(test.info().project.name !== 'desktop', 'projection once on desktop');
    await bootGrown(page, 'phone-landscape');
    await page.evaluate(() => window.spirebound.show('embark'));
    await page.waitForSelector('.r5-embark.r5-embark, .embark-screen.r5-embark, .r5-embark', {
      state: 'attached',
      timeout: 15_000,
    });
    await page.waitForSelector('.r5-vow-dial', { state: 'attached', timeout: 15_000 });
    await freezeSoft(page);

    const payload = await page.evaluate(() => window.__probe.screenLayoutGates());
    expect(payload.projection.version).toBe(1);
    expect(payload.projection.screen).toBe('embark');
    expect(payload.projection.shape).toBe('phone-landscape');
    expect(payload.projection.embark.vowDial).toBeTruthy();
    expect(payload.projection.embark.vowDial.aspectRatio).toBeGreaterThan(1.6);
    expect(OWNER_FAIL_GATE_IDS).toContain('embark-vow-not-circle');

    const vowGate = payload.report.gates.find((g) => g.id === 'embark-vow-not-circle');
    expect(vowGate.applicable).toBe(true);
    expect(vowGate.pass).toBe(true);

    const columnGate = payload.report.gates.find((g) => g.id === 'embark-phone-landscape-column');
    expect(columnGate.applicable).toBe(true);
    expect(columnGate.pass).toBe(true);

    expect(payload.summary.failedApplicable).toBe(0);
  });

  test('scene-bg is not stamped as r5-scene-panel on event', async ({ page }) => {
    test.skip(test.info().project.name !== 'desktop', 'projection once on desktop');
    await bootGrown(page, 'phone-landscape');
    await page.evaluate(() => {
      const sp = window.spirebound;
      const run = sp.E.newRun(4011, {
        reveals: ['phials', 'omens', 'emberglass', 'lamplighter', 'act4'],
        shards: ['usurper'],
      });
      sp.S.run = run;
      const eventId = sp.E.rollEvent(run);
      if (!eventId) throw new Error('rollEvent returned empty');
      sp.show('event', eventId);
    });
    await page.waitForSelector('.r5-event', { state: 'attached', timeout: 15_000 });
    await freezeSoft(page);
    const payload = await page.evaluate(() => window.__probe.screenLayoutGates());
    expect(payload.projection.screen).toBe('event');
    expect(payload.projection.scene.sceneBgCount).toBeGreaterThan(0);
    expect(payload.projection.scene.sceneBgStampedAsPanel).toBe(false);
    const stamp = payload.report.gates.find((g) => g.id === 'scene-bg-not-panel-stamp');
    expect(stamp.applicable).toBe(true);
    expect(stamp.pass).toBe(true);
  });
});
