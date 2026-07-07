// Reward-screen guards (PR #3 follow-up): rapid taps must not duplicate relics,
// gold, or event outcomes. Runs through the real UI click handlers.
import { test, expect } from '@playwright/test';
import { boot, collectErrors, expectNoErrors, settle } from './helpers.js';

test.beforeEach(() => {
  test.skip(test.info().project.name !== 'desktop', 'reward guards run on the desktop project only');
});

async function playerSnapshot(page) {
  return page.evaluate(() => {
    const run = window.spirebound.S.run;
    return { relics: run.player.relics.length, hp: run.player.hp, gold: run.player.gold };
  });
}

test('treasure chest double-tap grants at most one relic', async ({ page }) => {
  const errors = collectErrors(page);
  await boot(page, { query: 'mesh=0' });
  await page.evaluate(() => {
    const sp = window.spirebound;
    const node = sp.S.run.map.nodes.find((n) => n.type === 'treasure') || sp.S.run.map.nodes.find((n) => n.row === 8);
    if (node) sp.E.visitNode(sp.S.run, node);
    sp.show('treasure');
  });
  const before = await playerSnapshot(page);
  // The original bug: chest art and button share the same handler — tap both.
  await Promise.all([
    page.locator('.art-lg[data-a="open"]').click(),
    page.locator('button[data-a="open"]').click(),
  ]);
  await settle(page);
  const after = await playerSnapshot(page);
  expect(after.relics - before.relics).toBeLessThanOrEqual(1);
  expect(after.gold - before.gold).toBeLessThanOrEqual(60);
  expectNoErrors(errors, 'treasure double-tap');
});

test('voidChest event double-tap applies choice once', async ({ page }) => {
  const errors = collectErrors(page);
  await boot(page, { query: 'mesh=0' });
  await page.evaluate(() => {
    const sp = window.spirebound;
    const node = sp.S.run.map.nodes.find((n) => n.type === 'event') || sp.S.run.map.nodes[5];
    sp.E.visitNode(sp.S.run, node);
    sp.show('event', 'voidChest');
  });
  const before = await playerSnapshot(page);
  await page.locator('.event-choice.btn-primary').dblclick();
  await settle(page);
  const after = await playerSnapshot(page);
  expect(after.relics - before.relics).toBeLessThanOrEqual(1);
  expect(before.hp - after.hp).toBeLessThanOrEqual(12);
  expectNoErrors(errors, 'voidChest double-tap');
});

test('boss relic double-tap grants at most one relic', async ({ page }) => {
  const errors = collectErrors(page);
  await boot(page, { query: 'mesh=0' });
  await page.evaluate(() => window.spirebound.show('bossRelic'));
  const before = await playerSnapshot(page);
  await page.locator('.relic-pick').first().dblclick();
  await settle(page);
  const after = await playerSnapshot(page);
  expect(after.relics - before.relics).toBeLessThanOrEqual(1);
  expectNoErrors(errors, 'boss relic double-tap');
});
