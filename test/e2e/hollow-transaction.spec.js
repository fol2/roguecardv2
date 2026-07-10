import { test, expect } from '@playwright/test';

async function seedHollow(page, {
  seed, progress, type, paid = false, gold = 99, maxHp = 72, shape = null,
}) {
  await page.goto(shape ? `/?shape=${shape}` : '/');
  await page.waitForFunction(() => window.spirebound && window.__probe);
  await page.evaluate(async (opts) => {
    localStorage.clear();
    const E = await import('/src/engine.js');
    const { QUEST_IDS, QUESTS } = await import('/src/data.js');
    const quests = Object.fromEntries(QUEST_IDS.map((id) => [id, {
      state: id === 'hollowLamplighter' ? 'revealed' : 'dormant',
      progress: id === 'hollowLamplighter' ? opts.progress : 0,
      memory: {},
    }]));
    const run = E.newRun(opts.seed, { quests });
    const node = run.map.nodes[0];
    node.type = opts.type;
    run.nodeId = node.id;
    run.map.visited.push(node.id);
    run.questScratch.hollowLamplighter = { due: true, met: true, debtActive: false };
    run.player.gold = opts.gold;
    run.player.maxHp = opts.maxHp;
    run.player.hp = Math.min(run.player.hp, opts.maxHp);
    run.pendingHollow = {
      nodeId: node.id, type: opts.type, paid: opts.paid, deferred: false,
      answer: opts.paid ? QUESTS.hollowLamplighter.meetings[opts.progress - 1].paid : null,
    };
    E.saveRun(run);
  }, { seed, progress, type, paid, gold, maxHp });
  await page.reload();
  await page.click('[data-a="continue"]');
  await page.waitForSelector('.hollow-lamplighter');
}

test.beforeEach(() => {
  test.skip(test.info().project.name !== 'desktop', 'transaction behaviour is shape-independent');
});

test('Hollow actions fit the canonical pad portrait without overlap', async ({ page }) => {
  await seedHollow(page, {
    seed: 915, progress: 1, type: 'rest', gold: 0, shape: 'pad-portrait',
  });
  const stage = await page.locator('#stage').boundingBox();
  const actions = await page.locator('.hollow-actions .btn').evaluateAll((buttons) => buttons.map((button) => {
    const box = button.getBoundingClientRect();
    return { x: box.x, y: box.y, width: box.width, height: box.height };
  }));
  expect(stage).not.toBeNull();
  expect(actions).toHaveLength(3);
  for (const box of actions) {
    expect(box.width).toBeGreaterThan(0);
    expect(box.height).toBeGreaterThan(0);
    expect(box.x).toBeGreaterThanOrEqual(stage.x - 0.5);
    expect(box.y).toBeGreaterThanOrEqual(stage.y - 0.5);
    expect(box.x + box.width).toBeLessThanOrEqual(stage.x + stage.width + 0.5);
    expect(box.y + box.height).toBeLessThanOrEqual(stage.y + stage.height + 0.5);
  }
  for (let i = 0; i < actions.length; i++) {
    for (let j = i + 1; j < actions.length; j++) {
      const a = actions[i], b = actions[j];
      const overlaps = a.x < b.x + b.width && a.x + a.width > b.x &&
        a.y < b.y + b.height && a.y + a.height > b.y;
      expect(overlaps, `Hollow actions ${i} and ${j} overlap`).toBe(false);
    }
  }

  const configuredMeetings = await page.evaluate(async () => {
    const { QUESTS } = await import('/src/data.js');
    window.spirebound.show('hollow');
    return {
      target: QUESTS.hollowLamplighter.target,
      authored: QUESTS.hollowLamplighter.meetings.length,
    };
  });
  expect(configuredMeetings.authored).toBe(configuredMeetings.target);
  await expect(page.locator('.hollow-kicker'))
    .toHaveText(`THE UNLIT WAY · PRICE 2 OF ${configuredMeetings.target}`);
});

test('Hollow combat exit journals destination in one acknowledged save', async ({ page }) => {
  await seedHollow(page, { seed: 910, progress: 2, type: 'monster', paid: true, gold: 40 });
  await page.evaluate(() => {
    const original = Storage.prototype.setItem;
    window.__hollowSaveAttempts = 0;
    Storage.prototype.setItem = function setItem(key, value) {
      if (key === 'spirebound_save_v2' && ++window.__hollowSaveAttempts === 2) throw new Error('quota');
      return original.call(this, key, value);
    };
  });
  await page.click('[data-a="hollow-continue"]');
  await page.waitForTimeout(200);
  const checkpoint = await page.evaluate(() => {
    const durable = JSON.parse(localStorage.getItem('spirebound_save_v2'));
    return {
      attempts: window.__hollowSaveAttempts,
      pendingHollow: durable.pendingHollow,
      pendingCombat: durable.pendingCombat,
      pendingEnemyIds: durable.pendingEnemyIds,
    };
  });
  expect(checkpoint.attempts).toBe(1);
  expect(checkpoint.pendingHollow).toBeNull();
  expect(checkpoint.pendingCombat).toBe('monster');
  expect(checkpoint.pendingEnemyIds.length).toBeGreaterThan(0);

  await page.reload();
  await page.click('[data-a="continue"]');
  await page.waitForFunction(() => window.spirebound.S.screen === 'combat');
  await expect(page.locator('.hollow-lamplighter')).toHaveCount(0);
});

test('Return Later waits for save acknowledgement and resumes the exact event', async ({ page }) => {
  await seedHollow(page, { seed: 911, progress: 1, type: 'event', gold: 0 });
  await page.click('[data-a="hollow-pay"]');
  await expect(page.locator('.hollow-answer')).toContainText('not warm enough');
  await page.evaluate(() => {
    const original = Storage.prototype.setItem;
    window.__rejectHollowExit = true;
    Storage.prototype.setItem = function setItem(key, value) {
      if (key === 'spirebound_save_v2' && window.__rejectHollowExit) throw new Error('quota');
      return original.call(this, key, value);
    };
  });
  await page.click('[data-a="hollow-leave"]');
  await expect(page.locator('.hollow-lamplighter')).toHaveCount(1);
  let state = await page.evaluate(() => ({
    screen: window.spirebound.S.screen,
    run: window.spirebound.S.run,
    durable: JSON.parse(localStorage.getItem('spirebound_save_v2')),
  }));
  expect(state.screen).toBe('hollow');
  expect(state.run.pendingHollow).not.toBeNull();
  expect(state.run.pendingHollowRoute).toBeNull();
  expect(state.durable.pendingHollow).not.toBeNull();
  expect(state.durable.quests.hollowLamplighter.progress).toBe(1);
  expect(state.durable.player.gold).toBe(0);

  await page.evaluate(() => { window.__rejectHollowExit = false; });
  await page.click('[data-a="hollow-leave"]');
  await page.waitForFunction(() => window.spirebound.S.screen === 'event');
  state = await page.evaluate(async () => {
    const { EVENTS } = await import('/src/data.js');
    const route = window.spirebound.S.run.pendingHollowRoute;
    return {
      route,
      title: EVENTS[route.eventId].name.toUpperCase(),
      progress: window.spirebound.S.run.quests.hollowLamplighter.progress,
      gold: window.spirebound.S.run.player.gold,
    };
  });
  expect(state.route.type).toBe('event');
  expect(state.progress).toBe(1);
  expect(state.gold).toBe(0);
  await expect(page.locator('.event-panel .ov-title')).toHaveText(state.title);

  await page.reload();
  await page.click('[data-a="continue"]');
  await page.waitForFunction(() => window.spirebound.S.screen === 'event');
  await expect(page.locator('.event-panel .ov-title')).toHaveText(state.title);
  expect(await page.evaluate(() => window.spirebound.S.run.pendingHollowRoute.eventId)).toBe(state.route.eventId);

  await page.evaluate(() => {
    const run = window.spirebound.S.run;
    run.map.nodes.find((node) => node.id === run.nodeId).rewardClaimed = true;
    window.spirebound.E.saveRun(run);
    window.spirebound.show('event', run.pendingHollowRoute.eventId);
  });
  await page.click('.event-choices .btn');
  await page.waitForFunction(() => window.spirebound.S.screen === 'map');
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('spirebound_save_v2')).pendingHollowRoute)).toBeNull();
});

test('Hollow rest and shop routes survive reload until their acknowledged exit', async ({ page }) => {
  const cases = [
    { seed: 912, progress: 2, type: 'rest', maxHp: 41, screen: 'rest', leave: '[data-a="rest"]' },
    { seed: 913, progress: 1, type: 'shop', gold: 0, screen: 'shop', leave: '[data-a="leave"]' },
  ];
  for (const scenario of cases) {
    await seedHollow(page, scenario);
    await page.click('[data-a="hollow-pay"]');
    await page.click('[data-a="hollow-leave"]');
    await page.waitForFunction((screen) => window.spirebound.S.screen === screen, scenario.screen);
    expect(await page.evaluate(() => window.spirebound.S.run.pendingHollowRoute.type)).toBe(scenario.type);

    await page.reload();
    await page.click('[data-a="continue"]');
    await page.waitForFunction((screen) => window.spirebound.S.screen === screen, scenario.screen);
    expect(await page.evaluate(() => window.spirebound.S.run.pendingHollowRoute.type)).toBe(scenario.type);

    await page.click(scenario.leave);
    await page.waitForFunction(() => window.spirebound.S.screen === 'map');
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem('spirebound_save_v2')).pendingHollowRoute)).toBeNull();
  }
});

test('Hollow destination cannot return to the map until marker clear is acknowledged', async ({ page }) => {
  await seedHollow(page, { seed: 914, progress: 1, type: 'shop', gold: 0 });
  await page.click('[data-a="hollow-pay"]');
  await page.click('[data-a="hollow-leave"]');
  await page.waitForFunction(() => window.spirebound.S.screen === 'shop');
  const route = await page.evaluate(() => structuredClone(window.spirebound.S.run.pendingHollowRoute));
  await page.locator('[data-act="menu"]').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.pop-menu')).toHaveCount(1);

  await page.evaluate(() => {
    const original = Storage.prototype.setItem;
    window.__rejectHollowRouteClear = true;
    Storage.prototype.setItem = function setItem(key, value) {
      if (key === 'spirebound_save_v2' && window.__rejectHollowRouteClear) {
        window.__rejectHollowRouteClear = false;
        throw new Error('quota');
      }
      return original.call(this, key, value);
    };
  });
  await page.locator('[data-a="leave"]').focus();
  await page.keyboard.press('Enter');
  await expect(page.getByText('Save Failed', { exact: true })).toBeVisible();
  await expect(page.locator('.pop-menu, .audio-panel, .settings-panel')).toHaveCount(0);
  await expect(page.locator('#shake')).toHaveJSProperty('inert', true);
  await expect(page.locator('[data-a="retry-hollow-route"]')).toBeFocused();
  const failed = await page.evaluate(() => ({
    screen: window.spirebound.S.screen,
    live: window.spirebound.S.run.pendingHollowRoute,
    durable: JSON.parse(localStorage.getItem('spirebound_save_v2')).pendingHollowRoute,
  }));
  expect(failed.screen).toBe('shop');
  expect(failed.live).toEqual(route);
  expect(failed.durable).toEqual(route);

  await page.click('[data-a="retry-hollow-route"]');
  await page.waitForFunction(() => window.spirebound.S.screen === 'map');
  await expect(page.locator('#shake')).toHaveJSProperty('inert', false);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('spirebound_save_v2')).pendingHollowRoute)).toBeNull();
});
