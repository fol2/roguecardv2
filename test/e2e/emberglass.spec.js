import { test, expect } from '@playwright/test';
import {
  freshLedger, mixedLedger, completeLedger, seed, QIDS, stagePendingRunEnd,
  PERSISTED_EIGHTH_TEXT, PERSISTED_SHADE_TEXT,
} from './emberglass-fixtures.js';

test.describe('desktop Emberglass behaviour', () => {
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
  await expect(page.locator('.rose-pane[data-quest="usurper"]')).toHaveClass(/lit/);
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

test('pending win recovers once through the production terminal outbox', async ({ page }) => {
  const staged = await stagePendingRunEnd(page, 'win');
  await page.reload();
  await page.waitForFunction(() => window.spirebound && window.__probe?.state().screen === 'end');
  await expect(page.locator('[data-event="eighthResolved"]')).toContainText(PERSISTED_EIGHTH_TEXT);

  const reduced = await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const endButtons = page.locator('.end-btns button');
  if (!reduced) {
    expect(await endButtons.evaluateAll((buttons) => buttons.map((button) => button.disabled)))
      .toEqual([true, true]);
    await page.evaluate(() => document.querySelector('[data-a="title"]').click());
    expect(await page.evaluate(() => window.__probe.state().screen)).toBe('end');
  }

  await expect(page.locator('.dawn-ceremony')).toHaveClass(/complete/);
  expect(await endButtons.evaluateAll((buttons) => buttons.map((button) => button.disabled)))
    .toEqual([false, false]);
  await expect(page.locator('.dawn-event').evaluateAll((nodes) => nodes.map((node) => node.dataset.event)))
    .resolves.toEqual([
      'whisper', 'questReveal', 'questProgress', 'eighthResolved',
      'shadeResolved', 'shardGrant', 'act4Reveal',
    ]);
  await expect(page.locator('[data-event="shadeResolved"]')).toContainText(PERSISTED_SHADE_TEXT);

  const once = await page.evaluate(() => ({
    vigil: JSON.parse(localStorage.getItem('spirebound_vigil_v2')),
    stats: JSON.parse(localStorage.getItem('spirebound_stats_v1')),
    save: localStorage.getItem('spirebound_save_v2'),
  }));
  expect(once.save).toBeNull();
  expect(once.stats).toMatchObject({ runs: 6, wins: 6, lastRunId: staged.runId });
  expect(once.vigil.deeds).toMatchObject({ runs: 6, wins: 6, perfects: 3 });
  expect(once.vigil.runsPlayed).toBe(6);
  expect(once.vigil.whispers).toBe(24);
  expect(once.vigil.shards).toEqual(QIDS);
  expect(once.vigil.receipts.deeds).toEqual({
    runId: staged.runId,
    won: true,
    newUnlocks: ['card:flawlessForm', 'relic:prismCharm'],
  });
  expect(once.vigil.receipts.runEnd).toEqual({
    runId: staged.runId,
    outcome: 'win',
    whisper: 'The climb continues.',
    armed: [],
    completed: ['hollowLamplighter'],
    newShards: ['hollowLamplighter'],
  });

  await page.click('[data-a="title"]');
  await page.waitForFunction(() => window.__probe.state().screen === 'title');
  await page.waitForTimeout(1800);
  await expect(page.locator('.unlock-toast')).toHaveCount(0);
  await expect(page.locator('.dawn-event')).toHaveCount(0);

  await page.reload();
  await page.waitForFunction(() => window.spirebound && window.__probe?.state().screen === 'title');
  const twice = await page.evaluate(() => ({
    vigil: JSON.parse(localStorage.getItem('spirebound_vigil_v2')),
    stats: JSON.parse(localStorage.getItem('spirebound_stats_v1')),
    save: localStorage.getItem('spirebound_save_v2'),
  }));
  expect(twice).toEqual(once);
});

for (const outcome of ['death', 'abandon']) {
  test(`pending ${outcome} recovers once without a dawn ceremony`, async ({ page }) => {
    const staged = await stagePendingRunEnd(page, outcome);
    await page.reload();
    const expectedScreen = outcome === 'death' ? 'end' : 'title';
    await page.waitForFunction((screen) =>
      window.spirebound && window.__probe?.state().screen === screen, expectedScreen);
    await expect(page.locator('.dawn-ceremony')).toHaveCount(0);

    const once = await page.evaluate(() => ({
      vigil: JSON.parse(localStorage.getItem('spirebound_vigil_v2')),
      stats: JSON.parse(localStorage.getItem('spirebound_stats_v1')),
      save: localStorage.getItem('spirebound_save_v2'),
    }));
    expect(once.save).toBeNull();
    expect(once.stats).toMatchObject({ runs: 6, wins: 5, lastRunId: staged.runId });
    expect(once.vigil.deeds.runs).toBe(outcome === 'death' ? 6 : 5);
    expect(once.vigil.deeds.wins).toBe(5);
    expect(once.vigil.runsPlayed).toBe(6);
    expect(once.vigil.whispers).toBe(23);
    expect(once.vigil.shards).toEqual(QIDS.slice(0, 5));
    expect(once.vigil.receipts.deeds).toEqual(outcome === 'death' ? {
      runId: staged.runId, won: false, newUnlocks: [],
    } : null);
    expect(once.vigil.receipts.runEnd).toEqual({
      runId: staged.runId,
      outcome,
      whisper: null,
      armed: [],
      completed: [],
      newShards: [],
    });

    await page.reload();
    await page.waitForFunction(() => window.spirebound && window.__probe?.state().screen === 'title');
    const twice = await page.evaluate(() => ({
      vigil: JSON.parse(localStorage.getItem('spirebound_vigil_v2')),
      stats: JSON.parse(localStorage.getItem('spirebound_stats_v1')),
      save: localStorage.getItem('spirebound_save_v2'),
    }));
    expect(twice).toEqual(once);
  });
}
});

test('sealed door ignores a phone-landscape drag and opens on a later tap', async ({ page }) => {
  test.skip(test.info().project.name !== 'landscape', 'touch drag runs once in phone landscape');
  await seed(page, completeLedger());
  await page.evaluate(() => {
    const sp = window.spirebound;
    const vigil = JSON.parse(localStorage.getItem('spirebound_vigil_v2'));
    sp.S.run = sp.E.newRun(9300, {
      reveals: ['emberglass', 'act4'], quests: vigil.quests, shards: vigil.shards,
    });
    sp.S.run.act = 2;
    sp.S.run.map = sp.E.genMap(sp.S.run);
    sp.show('map');
  });
  await expect(page.locator('[data-a="sealed-door"]')).toHaveCount(1);

  const openedDuringDrag = await page.evaluate(() => {
    const map = document.querySelector('.map-screen');
    const fire = (type, y) => map.dispatchEvent(new PointerEvent(type, {
      bubbles: true, pointerType: 'touch', clientX: 200, clientY: y,
    }));
    fire('pointerdown', 180);
    fire('pointermove', 220);
    fire('pointerup', 220);
    document.querySelector('[data-a="sealed-door"]').click();
    return document.querySelector('#overlay').classList.contains('open');
  });
  expect(openedDuringDrag).toBe(false);
  await page.waitForTimeout(100);
  await page.locator('[data-a="sealed-door"]').tap();
  await expect(page.locator('.sealed-door-panel')).toContainText('the climb continues');
});
