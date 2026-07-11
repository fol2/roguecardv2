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
    await page.evaluate(() => {
      const sp = window.spirebound;
      const id = sp.E.rollBossRelics(sp.S.run)[0];
      sp.E.claimBossRelic(sp.S.run, id);
      sp.E.saveRun(sp.S.run);
      sp.show('bossRelic');
    });
    await settle(page);
    const state = await page.evaluate(() => ({
      act: window.spirebound.S.run.act,
      screen: window.spirebound.S.screen,
      picks: document.querySelectorAll('.relic-pick').length,
    }));
    expect(state.act).toBe(1);
    expect(state.screen).toBe('map');
    expect(state.picks).toBe(0);
    expectNoErrors(errors, 'boss relic mount guard');
  });

  test('event with card remove finalizes after pending', async ({ page }) => {
    const errors = collectErrors(page);
    await boot(page, { query: 'mesh=0' });
    await page.evaluate(() => {
      const sp = window.spirebound;
      const node = sp.S.run.map.nodes.find((n) => n.type === 'event') || sp.S.run.map.nodes[5];
      sp.E.visitNode(sp.S.run, node);
      sp.show('event', 'forgottenShrine');
    });
    const deckBefore = await page.evaluate(() => window.spirebound.S.run.player.deck.length);
    await page.locator('.event-choice.btn-primary', { hasText: 'Pray' }).click();
    await page.waitForSelector('#overlay.open .choice-cards .card');
    await page.locator('#overlay .choice-cards .card').first().click();
    await page.waitForFunction(() => !document.getElementById('overlay')?.classList.contains('open'));
    await settle(page);
    const deckAfter = await page.evaluate(() => window.spirebound.S.run.player.deck.length);
    expect(deckBefore - deckAfter).toBe(1);
    await expect(page.locator('button.btn-primary', { hasText: 'Continue' })).toBeVisible();
    const blocked = await page.evaluate(() => window.spirebound.E.applyNodeEventChoice(
      window.spirebound.S.run, [{ pickRemove: true }]).already);
    expect(blocked).toBe(true);
    expectNoErrors(errors, 'event pending finalize');
  });

  test('event reload during pending finalizes on remount', async ({ page }) => {
    const errors = collectErrors(page);
    await boot(page, { query: 'mesh=0' });
    const nodeId = await page.evaluate(() => {
      const sp = window.spirebound;
      const node = sp.S.run.map.nodes.find((n) => n.type === 'event') || sp.S.run.map.nodes[5];
      sp.E.visitNode(sp.S.run, node);
      sp.show('event', 'forgottenShrine');
      return node.id;
    });
    await page.locator('.event-choice.btn-primary', { hasText: 'Pray' }).click();
    await page.waitForSelector('#overlay.open .choice-cards .card');
    expect(await page.evaluate(() => window.spirebound.E.nodeEventInFlight(window.spirebound.S.run))).toBe(true);

    await page.reload();
    await page.waitForFunction(() => window.spirebound && window.__probe);
    await page.locator('button[data-a="continue"]').click();
    await settle(page);

    const state = await page.evaluate((id) => {
      const sp = window.spirebound;
      const node = sp.S.run.map.nodes.find((n) => n.id === id);
      sp.show('event', 'forgottenShrine');
      return {
        claimed: !!node?.rewardClaimed,
        inFlight: !!node?.rewardResolving,
        choices: document.querySelectorAll('.event-choice').length,
      };
    }, nodeId);
    expect(state.claimed).toBe(true);
    expect(state.inFlight).toBe(false);
    expect(state.choices).toBe(0);
    await expect(page.locator('button.btn-primary', { hasText: 'Continue' })).toBeVisible();
    expectNoErrors(errors, 'event reload during pending');
  });
});

test.describe('reward leave confirm', () => {
  test('Continue with untaken spoils asks before leaving', async ({ page }) => {
    const errors = collectErrors(page);
    await boot(page, { query: 'mesh=0' });
    await page.evaluate(() => {
      const sp = window.spirebound;
      sp.E.setPendingReward(sp.S.run, 'normal', {
        gold: 25,
        cards: ['strike', 'defend', 'chisel'],
        potion: null,
        relic: null,
      });
      sp.show('reward');
    });
    await expect(page.locator('.reward-row .ui-icon').first()).toBeVisible();
    await page.locator('button.btn-primary', { hasText: 'Continue' }).click();
    await expect(page.locator('#overlay.open .ov-title')).toHaveText('Leave Rewards Behind?');
    await page.locator('#overlay [data-a="no"]').click();
    await expect(page.locator('#overlay.open')).toHaveCount(0);
    expect(await page.evaluate(() => window.spirebound.S.screen)).toBe('reward');
    expect(await page.evaluate(() => !!window.spirebound.S.run.pendingReward)).toBe(true);

    await page.locator('button.btn-primary', { hasText: 'Continue' }).click();
    await page.locator('#overlay [data-a="yes"]').click();
    await settle(page);
    expect(await page.evaluate(() => window.spirebound.S.screen)).toBe('map');
    expect(await page.evaluate(() => window.spirebound.S.run.pendingReward)).toBe(null);
    expectNoErrors(errors, 'reward leave confirm');
  });

  test('Continue after claiming every row skips the confirm', async ({ page }) => {
    const errors = collectErrors(page);
    await boot(page, { query: 'mesh=0' });
    await page.evaluate(() => {
      const sp = window.spirebound;
      sp.E.setPendingReward(sp.S.run, 'normal', {
        gold: 12,
        cards: ['strike', 'defend', 'chisel'],
        potion: null,
        relic: null,
      });
      sp.E.takePendingReward(sp.S.run, 'gold');
      sp.E.takePendingReward(sp.S.run, 'card', null);
      sp.show('reward');
    });
    await page.locator('button.btn-primary', { hasText: 'Continue' }).click();
    await settle(page);
    await expect(page.locator('#overlay.open')).toHaveCount(0);
    expect(await page.evaluate(() => window.spirebound.S.screen)).toBe('map');
    expectNoErrors(errors, 'reward leave after claim');
  });
});
