import { test, expect } from './trace-fixture.js';
import { freshLedger, seed } from './emberglass-fixtures.js';

test.beforeEach(() => {
  test.skip(test.info().project.name !== 'desktop', 'persistence behaviour is shape-independent');
});

async function expectPersistenceTrace(page, kind, expectedEvents) {
  const records = await page.evaluate((selectedKind) => window.__probe.behaviourTrace().records
    .filter((record) => record.eventName.startsWith('persistence.') && record.attributes?.kind === selectedKind)
    .map((record) => ({ eventName: record.eventName, outcome: record.outcome, attempt: record.attributes.attempt })), kind);
  expect(records.map((record) => record.eventName)).toEqual(expectedEvents);
  expect(records.map((record) => record.attempt)).toEqual(records.map((_, index) => Math.floor(index / 2) + 1));
}

async function seedUsurperShop(page, gold = 650) {
  const vigil = freshLedger();
  vigil.deeds.runs = 2;
  vigil.deeds.wins = 2;
  vigil.runsPlayed = 2;
  vigil.quests.usurper = { state: 'armed', progress: 0, memory: {} };
  await seed(page, vigil);
  await page.evaluate((startingGold) => {
    const sp = window.spirebound;
    const storedVigil = JSON.parse(localStorage.getItem('spirebound_vigil_v2'));
    const run = sp.E.newRun(9501, {
      quests: storedVigil.quests,
      shards: storedVigil.shards,
      unlocks: storedVigil.unlocks,
    });
    run.act = 1;
    run.map = sp.E.genMap(run);
    const node = run.map.nodes.find((candidate) => candidate.type === 'shop') || run.map.nodes[0];
    node.type = 'shop';
    delete node.unlit;
    delete node.bounty;
    sp.E.visitNode(run, node);
    run.player.gold = startingGold;
    if (!sp.E.saveRun(run)) throw new Error('Usurper shop fixture did not persist');
    sp.S.run = run;
  }, gold);
}

test('fresh climb waits for its exact initial save before routing', async ({ page }) => {
  await seed(page, freshLedger());
  await page.click('[data-a="embark"]');
  await page.evaluate(() => {
    window.__initialSaveSetItem = Storage.prototype.setItem;
    window.__rejectInitialRunSave = true;
    window.__initialRunSaveAttempts = 0;
    Storage.prototype.setItem = function setItem(key, value) {
      if (key === 'spirebound_save_v2') {
        window.__initialRunSaveAttempts++;
        if (window.__rejectInitialRunSave) throw new Error('injected initial-run save failure');
      }
      return window.__initialSaveSetItem.call(this, key, value);
    };
  });

  await page.click('[data-a="begin"]');
  await expect(page.locator('#overlay .ov-title')).toHaveText('Save Failed');
  await expect(page.locator('#shake')).toHaveJSProperty('inert', true);
  await expect(page.locator('[data-a="retry-save"]')).toBeFocused();
  await expect(page.locator('#run-save-failure-description')).toHaveAttribute('role', 'status');
  await expect(page.locator('#run-save-failure-description')).toHaveAttribute('aria-live', 'assertive');
  const rejected = await page.evaluate(() => ({
    screen: window.spirebound.S.screen,
    snapshot: JSON.stringify(window.spirebound.S.run),
    durable: localStorage.getItem('spirebound_save_v2'),
    attempts: window.__initialRunSaveAttempts,
  }));
  expect(rejected.screen).toBe('embark');
  expect(rejected.durable).toBeNull();
  expect(rejected.attempts).toBe(1);

  const afterBlockedReentry = await page.evaluate(() => {
    document.querySelector('[data-a="begin"]').click();
    return {
      snapshot: JSON.stringify(window.spirebound.S.run),
      attempts: window.__initialRunSaveAttempts,
      overlay: document.querySelector('#overlay .ov-title')?.textContent,
    };
  });
  expect(afterBlockedReentry).toEqual({
    snapshot: rejected.snapshot, attempts: 1, overlay: 'Save Failed',
  });
  await page.keyboard.press('Shift+Tab');
  await expect(page.locator('[data-a="reload-save"]')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('[data-a="retry-save"]')).toBeFocused();
  await page.evaluate(() => {
    window.__saveDialogKeyLeaks = 0;
    document.addEventListener('keydown', () => { window.__saveDialogKeyLeaks++; });
  });
  await page.keyboard.press('e');
  expect(await page.evaluate(() => window.__saveDialogKeyLeaks)).toBe(0);

  await page.click('[data-a="retry-save"]');
  await expect(page.locator('#overlay .ov-title')).toHaveText('Save Failed');
  await expect(page.locator('#run-save-failure-description')).toContainText('still unavailable');
  await expect(page.locator('[data-a="retry-save"]')).toBeFocused();
  expect(await page.evaluate(() => window.__initialRunSaveAttempts)).toBe(2);

  await page.evaluate(() => { window.__rejectInitialRunSave = false; });
  await page.click('[data-a="retry-save"]');
  await page.waitForFunction(() => window.spirebound.S.screen === 'map');
  const accepted = await page.evaluate(() => ({
    live: JSON.stringify(window.spirebound.S.run),
    durable: localStorage.getItem('spirebound_save_v2'),
    attempts: window.__initialRunSaveAttempts,
  }));
  expect(accepted.live).toBe(rejected.snapshot);
  expect(accepted.durable).toBe(rejected.snapshot);
  // One acknowledged retry routes to the map, whose normal render then
  // refreshes the same durable snapshot once more.
  expect(accepted.attempts).toBe(4);
  await expect(page.locator('#shake')).toHaveJSProperty('inert', false);
  await expectPersistenceTrace(page, 'initial-run', [
    'persistence.attempt', 'persistence.blocked',
    'persistence.attempt', 'persistence.blocked',
    'persistence.attempt', 'persistence.recovered',
  ]);
});

test('Usurper first sight is durable before the shop item is exposed', async ({ page }) => {
  await seedUsurperShop(page);
  await page.evaluate(() => {
    window.__usurperSightSetItem = Storage.prototype.setItem;
    window.__rejectUsurperSight = true;
    window.__usurperSightAttempts = 0;
    Storage.prototype.setItem = function setItem(key, value) {
      if (key === 'spirebound_save_v2') {
        window.__usurperSightAttempts++;
        if (window.__rejectUsurperSight) throw new Error('injected Usurper sight save failure');
      }
      return window.__usurperSightSetItem.call(this, key, value);
    };
    window.spirebound.show('shop');
  });

  await expect(page.locator('#overlay .ov-title')).toHaveText('Save Failed');
  await expect(page.locator('.quest-shop-item')).toHaveCount(0);
  await expect(page.locator('#shake')).toHaveJSProperty('inert', true);
  await expect(page.locator('[data-a="retry-save"]')).toBeFocused();
  const rejected = await page.evaluate(() => ({
    live: window.spirebound.S.run.quests.usurper.state,
    durable: JSON.parse(localStorage.getItem('spirebound_save_v2')).quests.usurper.state,
    attempts: window.__usurperSightAttempts,
  }));
  expect(rejected).toEqual({ live: 'revealed', durable: 'armed', attempts: 1 });

  const blockedShopAction = await page.evaluate(() => {
    const run = window.spirebound.S.run;
    const before = { gold: run.player.gold, deck: run.player.deck.length };
    document.querySelector('.cards-row .card')?.click();
    [...document.querySelectorAll('.shop-relic')]
      .find((button) => button.textContent.includes('Card Removal'))?.click();
    return {
      before,
      after: { gold: run.player.gold, deck: run.player.deck.length },
      overlay: document.querySelector('#overlay .ov-title')?.textContent,
      attempts: window.__usurperSightAttempts,
    };
  });
  expect(blockedShopAction).toEqual({
    before: blockedShopAction.before,
    after: blockedShopAction.before,
    overlay: 'Save Failed',
    attempts: 1,
  });

  await page.evaluate(() => { window.__rejectUsurperSight = false; });
  await page.click('[data-a="retry-save"]');
  await expect(page.locator('.quest-shop-item')).toHaveCount(1);
  await expect(page.locator('.quest-shop-item')).toContainText('A Lantern with No Flame');
  const accepted = await page.evaluate(() => ({
    live: window.spirebound.S.run.quests.usurper.state,
    durable: JSON.parse(localStorage.getItem('spirebound_save_v2')).quests.usurper.state,
    attempts: window.__usurperSightAttempts,
  }));
  expect(accepted).toEqual({ live: 'revealed', durable: 'revealed', attempts: 2 });
  await expect(page.locator('#shake')).toHaveJSProperty('inert', false);
});

test('Usurper purchase confirms only after the single 650-gold mutation is durable', async ({ page }) => {
  await seedUsurperShop(page);
  await page.evaluate(() => window.spirebound.show('shop'));
  await expect(page.locator('.quest-shop-item')).toHaveCount(1);
  await page.evaluate(() => {
    const sp = window.spirebound;
    sp.S.run.player.potions[0] = 'healing';
    if (!sp.E.saveRun(sp.S.run)) throw new Error('potion-menu fixture did not persist');
    sp.show('shop');
  });
  await page.click('.potion-slot.full');
  await expect(page.locator('.pop-menu')).toHaveCount(1);
  await page.evaluate(() => {
    window.__usurperBuySetItem = Storage.prototype.setItem;
    window.__rejectUsurperBuy = true;
    window.__usurperBuyAttempts = 0;
    Storage.prototype.setItem = function setItem(key, value) {
      if (key === 'spirebound_save_v2') {
        window.__usurperBuyAttempts++;
        if (window.__rejectUsurperBuy) throw new Error('injected Usurper purchase save failure');
      }
      return window.__usurperBuySetItem.call(this, key, value);
    };
  });

  // Keyboard activation deliberately bypasses the document's pointerdown
  // menu closer, so the save-failure transaction itself must remove it.
  await page.locator('.quest-shop-item button').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#overlay .ov-title')).toHaveText('Save Failed');
  await expect(page.locator('.pop-menu, .audio-panel, .settings-panel')).toHaveCount(0);
  await expect(page.locator('#shake')).toHaveJSProperty('inert', true);
  await expect(page.locator('[data-a="retry-save"]')).toBeFocused();
  await expect(page.locator('.shop-dialogue')).not.toContainText('Now the summit knows');
  const rejected = await page.evaluate(() => {
    const live = window.spirebound.S.run;
    const durable = JSON.parse(localStorage.getItem('spirebound_save_v2'));
    return {
      liveGold: live.player.gold,
      durableGold: durable.player.gold,
      liveBought: Boolean(live.questScratch.usurper?.bought),
      durableBought: Boolean(durable.questScratch.usurper?.bought),
      itemDisabled: document.querySelector('.quest-shop-item button').disabled,
      leaveDisabled: document.querySelector('[data-a="leave"]').disabled,
      potion: live.player.potions[0],
      attempts: window.__usurperBuyAttempts,
    };
  });
  expect(rejected).toEqual({
    liveGold: 0,
    durableGold: 650,
    liveBought: true,
    durableBought: false,
    itemDisabled: true,
    leaveDisabled: true,
    potion: 'healing',
    attempts: 1,
  });

  await page.click('[data-a="retry-save"]');
  await expect(page.locator('#overlay .ov-title')).toHaveText('Save Failed');
  await expect(page.locator('[data-a="retry-save"]')).toBeFocused();
  const repeatedFailure = await page.evaluate(() => ({
    gold: window.spirebound.S.run.player.gold,
    bought: Boolean(window.spirebound.S.run.questScratch.usurper?.bought),
    attempts: window.__usurperBuyAttempts,
  }));
  expect(repeatedFailure).toEqual({ gold: 0, bought: true, attempts: 2 });

  await page.evaluate(() => { window.__rejectUsurperBuy = false; });
  await page.click('[data-a="retry-save"]');
  await expect(page.locator('#overlay')).not.toHaveClass(/open/);
  await expect(page.locator('.quest-shop-item')).toHaveClass(/sold/);
  await expect(page.locator('.shop-dialogue')).toContainText('Now the summit knows');
  await expect(page.locator('[data-a="leave"]')).toBeEnabled();
  const accepted = await page.evaluate(() => {
    const live = window.spirebound.S.run;
    const durable = JSON.parse(localStorage.getItem('spirebound_save_v2'));
    return {
      liveGold: live.player.gold,
      durableGold: durable.player.gold,
      liveBought: Boolean(live.questScratch.usurper?.bought),
      durableBought: Boolean(durable.questScratch.usurper?.bought),
      attempts: window.__usurperBuyAttempts,
    };
  });
  expect(accepted).toEqual({
    liveGold: 0,
    durableGold: 0,
    liveBought: true,
    durableBought: true,
    attempts: 3,
  });
  await expect(page.locator('#shake')).toHaveJSProperty('inert', false);

  await page.evaluate(() => document.querySelector('.quest-shop-item button').click());
  const afterRepeatClick = await page.evaluate(() => ({
    gold: window.spirebound.S.run.player.gold,
    attempts: window.__usurperBuyAttempts,
  }));
  expect(afterRepeatClick).toEqual({ gold: 0, attempts: 3 });
  await expectPersistenceTrace(page, 'usurper-purchase', [
    'persistence.attempt', 'persistence.blocked',
    'persistence.attempt', 'persistence.blocked',
    'persistence.attempt', 'persistence.recovered',
  ]);
});

test('Reload Saved Climb discards a failed live mutation and restores the durable run', async ({ page }) => {
  await seedUsurperShop(page);
  await page.evaluate(() => window.spirebound.show('shop'));
  await expect(page.locator('.quest-shop-item')).toHaveCount(1);
  const durableBefore = await page.evaluate(() => localStorage.getItem('spirebound_save_v2'));
  await page.evaluate(() => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function rejectPurchase(key, value) {
      if (key === 'spirebound_save_v2') throw new Error('injected reload-path failure');
      return original.call(this, key, value);
    };
  });

  await page.locator('.quest-shop-item button').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#overlay .ov-title')).toHaveText('Save Failed');
  expect(await page.evaluate(() => ({
    gold: window.spirebound.S.run.player.gold,
    bought: Boolean(window.spirebound.S.run.questScratch.usurper?.bought),
  }))).toEqual({ gold: 0, bought: true });

  await page.click('[data-a="reload-save"]');
  await page.waitForFunction(() => window.spirebound?.S.screen === 'title');
  expect(await page.evaluate(() => localStorage.getItem('spirebound_save_v2'))).toBe(durableBefore);
  await page.click('[data-a="continue"]');
  await page.waitForFunction(() => window.spirebound?.S.run?.player);
  expect(await page.evaluate(() => ({
    gold: window.spirebound.S.run.player.gold,
    bought: Boolean(window.spirebound.S.run.questScratch.usurper?.bought),
  }))).toEqual({ gold: 650, bought: false });
});

test('Shade cross-store failure keeps the saved duel behind an exclusive retry dialog', async ({ page }) => {
  const vigil = freshLedger();
  vigil.quests.ownShade = { state: 'revealed', progress: 0, memory: {} };
  vigil.lastFall = {
    act: 1, row: 4, bequest: null, standing: true, shadeAspect: 0,
  };
  await seed(page, vigil);
  await page.evaluate(() => {
    const sp = window.spirebound;
    const stored = JSON.parse(localStorage.getItem('spirebound_vigil_v2'));
    const run = sp.E.newRun(9502, { quests: stored.quests, monument: stored.lastFall });
    run.act = 1;
    run.map = sp.E.genMap(run);
    run.monument.claimed = true;
    run.questScratch.ownShade = { pendingBequest: null };
    sp.E.setPendingEncounter(run, 'monster', ['ownShade1'], 'ownShade');
    if (!sp.E.saveRun(run)) throw new Error('Shade retry fixture did not persist');
    sp.show('title');

    const original = Storage.prototype.setItem;
    window.__rejectShadeClear = true;
    Storage.prototype.setItem = function rejectShadeClear(key, value) {
      if (key === 'spirebound_vigil_v2' && window.__rejectShadeClear) {
        throw new Error('injected Shade bequest-clear failure');
      }
      return original.call(this, key, value);
    };
  });

  await page.click('[data-a="continue"]');
  await expect(page.locator('.ov-title')).toHaveText('The Stone Could Not Hold');
  await expect(page.locator('#shake')).toHaveJSProperty('inert', true);
  await expect(page.locator('[data-a="retry-stone"]')).toBeFocused();
  expect(await page.evaluate(() => window.spirebound.S.screen)).not.toBe('combat');

  await page.evaluate(() => { window.__rejectShadeClear = false; });
  await page.click('[data-a="retry-stone"]');
  await page.waitForFunction(() => window.spirebound?.S.screen === 'combat');
  await expect(page.locator('#shake')).toHaveJSProperty('inert', false);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('spirebound_vigil_v2')).lastFall))
    .toBeNull();
  await expectPersistenceTrace(page, 'shade-bequest-clear', [
    'persistence.attempt', 'persistence.blocked',
    'persistence.attempt', 'persistence.recovered',
  ]);
});

test('Fall unpaid Shade bequest keeps the standing-stone line with no phantom choice', async ({ page }) => {
  // Presentation ownership: Task 33 end-ceremony; persistence ledger stays here.
  await seed(page, freshLedger());
  await page.evaluate(() => {
    const sp = window.spirebound;
    const run = sp.E.newRun(9510);
    run.questScratch = { ownShade: { fall: { bequest: { kind: 'gold', amount: 40 } } } };
    sp.S.run = run;
    sp.show('end', {
      won: false,
      offers: [{ kind: 'gold', amount: 99 }], // must not render when unpaidBequest
      fallAct: 1,
      fallRow: 3,
      unpaidBequest: true,
    });
  });
  await expect(page.locator('.r5-end.r5-end--fallen, .end-screen.grave')).toHaveCount(1);
  await expect(page.locator('.bequest-opt, [data-a="bequest"]')).toHaveCount(0);
  await expect(page.locator('.r5-bequest-unpaid, .bequest-done')).toContainText(
    'The unpaid gift remains in the standing stone',
  );
});
