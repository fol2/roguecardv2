// P2 semantic theme journey — one real normal encounter per core theme.
// Chromium projects only here; Task 20 adds phone/pad WebKit and reruns this file.
import { test, expect } from './trace-fixture.js';
import {
  boot, collectErrors, expectNoErrors, expectInvariants, attachBehaviourTrace,
} from './helpers.js';

const EXPECTED_SHAPES = {
  desktop: 'desktop-landscape',
  portrait: 'phone-portrait',
  landscape: 'phone-landscape',
};

const CORE_THEMES = ['act1', 'act2', 'act3'];

test('P2 core theme profile visits every production theme once', async ({ page }, testInfo) => {
  const project = testInfo.project.name;
  test.skip(!EXPECTED_SHAPES[project], 'theme-profile runs on desktop/portrait/landscape Chromium only');
  const errors = collectErrors(page);
  await boot(page, { query: 'trace=1&mesh=0', seed: 20260715 });
  await page.evaluate(() => window.__probe.resetBehaviourTrace());

  const hasDriver = await page.evaluate(() => typeof window.__probe.stageCoreTheme === 'function');
  expect(hasDriver, 'stageCoreTheme driver must be installed on the QA Probe').toBe(true);

  const liveOrder = await page.evaluate(async () => {
    const { CORE_CONTENT } = await import('/src/content.js');
    return CORE_CONTENT.themeOrder;
  });
  expect(liveOrder).toEqual(CORE_THEMES);

  for (const themeId of CORE_THEMES) {
    const staged = await page.evaluate(async ([id, seed]) => {
      const snapshot = await window.__probe.stageCoreTheme({ themeId: id, seed });
      const plates = {};
      for (const [layer, plateId] of Object.entries(snapshot.plates || {})) {
        const img = document.querySelector(`.sl-${layer}`);
        const src = img?.getAttribute('src') || '';
        plates[layer] = {
          id: plateId,
          resolved: !!src,
        };
      }
      const { getLocale } = await import('/src/i18n/index.js');
      return {
        snapshot,
        plates,
        locale: getLocale(),
        stage: window.__probe.stage(),
        state: window.__probe.state(),
        integrity: window.__probe.traceIntegrity(),
      };
    }, [themeId, 20260715 + CORE_THEMES.indexOf(themeId)]);

    expect(staged.snapshot.themeId, themeId).toBe(themeId);
    expect(staged.snapshot.themeIndex, themeId).toBe(CORE_THEMES.indexOf(themeId));
    expect(staged.snapshot.enemyIds.length, themeId).toBeGreaterThan(0);
    expect(staged.state.enemies?.map((enemy) => enemy.key), themeId)
      .toEqual([...staged.snapshot.enemyIds]);
    expect(staged.snapshot.weather, themeId).toBeTruthy();
    expect(staged.snapshot.music?.combat, themeId).toBeTruthy();
    // Music Cue load is async; poll like audio.spec.js so CI portrait cannot race null.
    await expect.poll(
      () => page.evaluate(async () => (await import('/src/music.js')).currentCue()),
      { timeout: 20_000 },
    ).toBe(staged.snapshot.music.combat);
    for (const layer of ['backdrop', 'mid', 'ledge']) {
      const plate = staged.plates[layer];
      expect(plate, `${themeId}.${layer}`).toBeTruthy();
      expect(typeof plate.id, `${themeId}.${layer} plate id`).toBe('string');
      expect(plate.id.length, `${themeId}.${layer} plate id`).toBeGreaterThan(0);
      expect(plate.resolved, `${themeId}.${layer} must resolve`).toBe(true);
    }
    expect(staged.stage.shape, themeId).toBe(EXPECTED_SHAPES[project]);
    expect(staged.locale, themeId).toBe('en');
    expect(staged.integrity.ok, `${themeId} trace integrity`).toBe(true);
    expect(staged.integrity.errors || [], `${themeId} trace errors`).toEqual([]);

    const playResult = await page.evaluate(async () => {
      const hand = window.__probe.state().hand || [];
      const strike = hand.find((card) => card.id === 'strike') || hand[0];
      if (!strike) return { played: false, reason: 'empty-hand' };
      const uids = window.__probe.forceHand(['strike']);
      window.__probe.setEnergy(3);
      const played = await window.__probe.play(uids[0], 0);
      await window.__probe.settle();
      await window.__probe.endTurn();
      await window.__probe.settle();
      return { played, reason: null, after: window.__probe.state() };
    });
    expect(playResult.played, `${themeId} card play`).toBe(true);
    expect(playResult.after.turn, themeId).toBeGreaterThan(1);
    await expectInvariants(page, themeId);
  }

  const localeScan = await page.evaluate(() => {
    const text = document.body.innerText || '';
    const unresolvedKeys = [...text.matchAll(/\bui\.[a-z0-9.]+/gi)].map((m) => m[0]);
    const unresolvedParams = [...text.matchAll(/\{[a-zA-Z][a-zA-Z0-9_]*\}/g)].map((m) => m[0]);
    const missing = window.__probe.behaviourTrace().records
      .filter((row) => row.eventName === 'i18n.missing');
    const integrity = window.__probe.traceIntegrity();
    return { unresolvedKeys, unresolvedParams, missing, integrity };
  });
  expect(localeScan.unresolvedKeys, 'no raw locale keys in DOM').toEqual([]);
  expect(localeScan.unresolvedParams, 'no unresolved {param} in DOM').toEqual([]);
  expect(localeScan.missing, 'no i18n.missing events').toEqual([]);
  expect(localeScan.integrity.ok, 'final trace integrity').toBe(true);
  expect(localeScan.integrity.errors || [], 'no trace drop/error/orphan').toEqual([]);

  await attachBehaviourTrace(page, testInfo);
  expectNoErrors(errors, 'theme-profile');
});
