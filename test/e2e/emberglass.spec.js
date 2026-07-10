import { test, expect } from '@playwright/test';
import { freshLedger, mixedLedger, completeLedger, seed, QIDS } from './emberglass-fixtures.js';

test.beforeEach(() => {
  test.skip(test.info().project.name !== 'desktop', 'Emberglass behaviour runs once on desktop');
});

test('fresh profile exposes no Rose tab or medallion', async ({ page }) => {
  await seed(page, freshLedger());
  await page.click('[data-a="vigil"]');
  await expect(page.locator('[data-a="tab-rose"]')).toHaveCount(0);
  await page.click('[data-a="back"]');
  await expect(page.locator('.title-rose-medallion')).toHaveCount(0);
});

test('Rose panes disclose only their current state', async ({ page }) => {
  const v = mixedLedger(); // dormant, armed, revealed, complete in fixed quest order
  await seed(page, v);
  await page.click('[data-a="vigil"]');
  await page.click('[data-a="tab-rose"]');
  await expect(page.locator('.rose-pane[data-quest="paleOnes"]')).toHaveClass(/armed/);
  await expect(page.locator('.rose-pane[data-quest="paleOnes"]')).toContainText('???');
  await expect(page.locator('.rose-pane[data-quest="ownShade"]')).toContainText('1/3');
  await expect(page.locator('.rose-pane[data-quest="usurper"]')).toHaveClass(/complete/);
  await expect(page.locator('.rose-pane.dormant').filter({ hasText: 'Hollow' })).toHaveCount(0);
  await expect(page.locator('.rose-pane.dormant[data-quest]')).toHaveCount(0);
  await expect(page.locator('.rose-fallback')).toBeVisible();
  await expect(page.locator('.whisper-row')).toHaveCount(v.whispers);
  await page.click('[data-a="back"]');
  await expect(page.locator('.title-rose-medallion')).toHaveCount(0);
});

test('opening Vigil clears only the news pulse', async ({ page }) => {
  const v = mixedLedger();
  await seed(page, v);
  await page.click('[data-a="vigil"]');
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('spirebound_vigil_v2')));
  expect(stored.news).toBe(false);
  expect(stored.quests).toEqual(v.quests);
  expect(stored.shards).toEqual(v.shards);
  expect(stored.whispers).toBe(v.whispers);
});

test('six shards expose a promise, never Act 4 gameplay', async ({ page }) => {
  const v = completeLedger();
  await seed(page, v);
  await page.evaluate(() => {
    const sp = window.spirebound;
    sp.S.run = sp.E.newRun(9001, {
      reveals: ['omens', 'phials', 'poolWave2', 'poolWave3', 'poolFull', 'emberglass', 'act4'],
      quests: JSON.parse(localStorage.getItem('spirebound_vigil_v2')).quests,
      shards: JSON.parse(localStorage.getItem('spirebound_vigil_v2')).shards,
    });
    sp.S.run.act = 2;
    sp.S.run.map = sp.E.genMap(sp.S.run);
    sp.show('map');
  });
  await expect(page.locator('[data-a="sealed-door"]')).toHaveCount(1);
  const before = await page.evaluate(() => ({
    run: JSON.stringify(window.spirebound.S.run),
    save: localStorage.getItem('spirebound_save_v2'),
  }));
  await page.click('[data-a="sealed-door"]');
  await expect(page.locator('.sealed-door-panel')).toContainText('the climb continues');
  await page.click('[data-a="close-door"]');
  expect(await page.evaluate(() => window.spirebound.S.run.act)).toBe(2);
  expect(await page.evaluate(() => window.spirebound.S.run.nodeId)).toBe(null);
  expect(await page.evaluate(() => JSON.stringify(window.spirebound.S.run))).toBe(before.run);
  expect(await page.evaluate(() => localStorage.getItem('spirebound_save_v2'))).toBe(before.save);
});

test('dawn ceremony drains in canonical order and signals completion', async ({ page }) => {
  await seed(page, completeLedger());
  const before = await page.evaluate(({ questIds, vigil }) => {
    const sp = window.spirebound;
    const previous = questIds.slice(0, 5);
    const run = sp.E.newRun(9002, {
      reveals: ['emberglass', 'act4'],
      shards: previous,
    });
    run.endQueue = [
      { t: 'questReveal', id: 'hollowLamplighter' },
      { t: 'questProgress', id: 'hollowLamplighter', progress: 5, target: 5 },
      { t: 'questComplete', id: 'hollowLamplighter' },
    ];
    sp.S.run = run;
    const snapshot = JSON.stringify(run);
    sp.show('end', {
      won: true,
      newUnlocks: [],
      ledger: {
        vigil,
        whisper: 'The climb continues.',
        newShards: ['hollowLamplighter'],
      },
    });
    return snapshot;
  }, { questIds: QIDS, vigil: completeLedger() });

  await expect(page.locator('.dawn-ceremony')).toHaveClass(/complete/);
  await expect(page.locator('.dawn-event')).toHaveCount(5);
  await expect(page.locator('.dawn-event').evaluateAll((nodes) => nodes.map((node) => node.dataset.event)))
    .resolves.toEqual(['whisper', 'questReveal', 'questProgress', 'shardGrant', 'act4Reveal']);
  expect(await page.evaluate(() => JSON.stringify(window.spirebound.S.run))).toBe(before);
});
