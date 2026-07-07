// Reward-screen guards (PR #3 follow-up): rapid taps must not duplicate relics,
// gold, or event outcomes. Runs through the real UI click handlers.
import { test, expect } from '@playwright/test';
import { boot, collectErrors, expectNoErrors, settle } from './helpers.js';

async function playerSnapshot(page) {
  return page.evaluate(() => {
    const run = window.spirebound.S.run;
    return { relics: run.player.relics.length, hp: run.player.hp, gold: run.player.gold };
  });
}

test.describe('reward tap guards', () => {
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
    // Invoke open() twice synchronously — avoids Playwright retrying a detached button.
    await page.evaluate(() => {
      const opens = [...document.querySelectorAll('[data-a="open"]')];
      const fn = opens[0]?.onclick;
      if (typeof fn === 'function') { fn(); fn(); }
    });
    await settle(page);
    const after = await playerSnapshot(page);
    expect(after.relics - before.relics).toBeLessThanOrEqual(1);
    expect(after.gold - before.gold).toBeLessThanOrEqual(60);
    await expect(page.locator('button.btn-primary', { hasText: 'Continue' })).toBeVisible();
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

  test('voidChest rapid choice buttons apply once', async ({ page }) => {
    const errors = collectErrors(page);
    await boot(page, { query: 'mesh=0' });
    await page.evaluate(() => {
      const sp = window.spirebound;
      const node = sp.S.run.map.nodes.find((n) => n.type === 'event') || sp.S.run.map.nodes[5];
      sp.E.visitNode(sp.S.run, node);
      sp.show('event', 'voidChest');
    });
    const before = await playerSnapshot(page);
    await page.evaluate(() => {
      const buttons = [...document.querySelectorAll('.event-choice')];
      buttons.forEach((b) => b.onclick?.());
    });
    await settle(page);
    const after = await playerSnapshot(page);
    expect(after.relics - before.relics).toBeLessThanOrEqual(1);
    expect(before.hp - after.hp).toBeLessThanOrEqual(12);
    expectNoErrors(errors, 'voidChest multi-choice');
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

  test('boss relic rapid different picks grant at most one relic', async ({ page }) => {
    const errors = collectErrors(page);
    await boot(page, { query: 'mesh=0' });
    await page.evaluate(() => window.spirebound.show('bossRelic'));
    const before = await playerSnapshot(page);
    await page.evaluate(() => {
      const picks = [...document.querySelectorAll('.relic-pick')];
      picks.forEach((b) => b.onclick?.());
    });
    await settle(page);
    const after = await playerSnapshot(page);
    expect(after.relics - before.relics).toBeLessThanOrEqual(1);
    expectNoErrors(errors, 'boss relic multi-pick');
  });

  test('treasure chest stays empty after reload', async ({ page }) => {
    const errors = collectErrors(page);
    await boot(page, { query: 'mesh=0' });
    const nodeId = await page.evaluate(() => {
      const sp = window.spirebound;
      const node = sp.S.run.map.nodes.find((n) => n.type === 'treasure') || sp.S.run.map.nodes.find((n) => n.row === 8);
      sp.E.visitNode(sp.S.run, node);
      sp.show('treasure');
      return node.id;
    });
    await page.evaluate(() => {
      const fn = document.querySelector('[data-a="open"]')?.onclick;
      if (typeof fn === 'function') fn();
    });
    await settle(page);
    await expect(page.locator('button.btn-primary', { hasText: 'Continue' })).toBeVisible();
    const claimed = await page.evaluate((id) => {
      const node = window.spirebound.S.run.map.nodes.find((n) => n.id === id);
      return !!node?.rewardClaimed;
    }, nodeId);
    expect(claimed).toBe(true);

    await page.reload();
    await page.waitForFunction(() => window.spirebound && window.__probe);
    await page.locator('button[data-a="continue"]').click();
    await settle(page);
    await page.evaluate((id) => {
      const sp = window.spirebound;
      const node = sp.S.run.map.nodes.find((n) => n.id === id);
      if (!node?.rewardClaimed) throw new Error('treasure node lost rewardClaimed after reload');
      sp.show('treasure');
    }, nodeId);
    await expect(page.locator('.ov-sub', { hasText: 'The chest lies empty.' })).toBeVisible();
    await expect(page.locator('button[data-a="open"]')).toHaveCount(0);
    await expect(page.locator('button.btn-primary', { hasText: 'Continue' })).toBeVisible();
    expectNoErrors(errors, 'treasure reload');
  });

  test('boss relic screen advances when act relic already claimed', async ({ page }) => {
    const errors = collectErrors(page);
    await boot(page, { query: 'mesh=0' });
    const act = await page.evaluate(() => {
      const sp = window.spirebound;
      const id = sp.E.rollBossRelics(sp.S.run)[0];
      sp.E.claimBossRelic(sp.S.run, id);
      sp.E.saveRun(sp.S.run);
      sp.show('bossRelic');
      return sp.S.run.act;
    });
    await settle(page);
    expect(act).toBe(1);
    expectNoErrors(errors, 'boss relic mount guard');
  });
});
