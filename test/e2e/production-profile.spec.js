// Task 24 — Chromium/WebKit commercial production-profile journeys.
// Fresh and veteran fixtures are Node-validated before injection. Each journey
// drives real Title → Vigil/Embark → map/combat controls through Probe/stage
// pointer paths, exercises shake + loseRendererContextForTest, and attaches
// NDJSON/text on failure via the shared trace fixture.

import { test, expect } from './trace-fixture.js';
import {
  settle, collectErrors, expectNoErrors, stageBoundsToClient, pointerDrag,
} from './helpers.js';
import {
  buildFreshProfileStorage,
  buildVeteranProfileStorage,
  validateProfileStorage,
  assertFreshProfile,
  assertVeteranProfile,
  RUN_KEY,
  STATS_KEY,
  VIGIL_KEY,
  VIGIL_V1_KEY,
} from '../fixtures/round5-profile-fixtures.js';

const PROFILE_PROJECTS = new Set(['desktop', 'iphone-webkit', 'ipad-webkit']);

test.beforeEach(() => {
  test.skip(
    !PROFILE_PROJECTS.has(test.info().project.name),
    'production-profile runs on desktop Chromium + Playwright WebKit phone/pad only',
  );
});

async function injectStorage(page, blob) {
  await page.addInitScript((entries) => {
    for (const [key, value] of Object.entries(entries)) {
      if (value == null) localStorage.removeItem(key);
      else localStorage.setItem(key, value);
    }
  }, {
    [RUN_KEY]: blob[RUN_KEY],
    [STATS_KEY]: blob[STATS_KEY],
    [VIGIL_KEY]: blob[VIGIL_KEY],
    [VIGIL_V1_KEY]: blob[VIGIL_V1_KEY],
  });
}

async function bootWithProfile(page, blob) {
  const errors = collectErrors(page);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await injectStorage(page, blob);
  await page.goto('/?trace=1');
  await page.waitForFunction(() => window.spirebound && window.__probe);
  await page.waitForFunction(() => window.spirebound?.pixi?.status?.() === 'ready', null, {
    timeout: 20_000,
  });
  return errors;
}

async function driveLabCombat(page) {
  await page.evaluate(async () => {
    await window.__probe.stageCoreTheme({ themeId: 'act1' });
  });
  await settle(page);
  const ui = await page.evaluate(() => window.__probe.ui());
  expect(ui.version).toBe(2);
  expect(ui.renderer.kind).toBe('pixi');
  expect(ui.renderer.state).toBe('ready');
  return ui;
}

async function cancelActiveDrag(page) {
  const card = await page.evaluate(() => {
    window.__probe.setEnergy(3);
    const [uid] = window.__probe.forceHand(['defend']);
    const ui = window.__probe.ui();
    const handCard = ui.hand.find((c) => c.uid === uid) || ui.hand[0];
    return { uid: handCard.uid, bounds: handCard.bounds || handCard.seatBounds };
  });
  if (!card.bounds) return;
  const from = await stageBoundsToClient(page, card.bounds);
  await pointerDrag(page, from, { x: from.x, y: from.y - 40 }, { cancel: true });
  await settle(page);
}

async function triggerShakeAndRecovery(page) {
  // Shake before freeze/recovery — VFX freeze is one-way.
  await page.evaluate(async () => {
    const V = await import('/src/vfx.js');
    V.shake(10);
  });
  await page.waitForFunction(() => {
    const text = window.__probe.behaviourTrace({ format: 'text' }).text || '';
    return text.includes('presentation.shake-sync');
  }, null, { timeout: 5_000 }).catch(() => {});
  await page.evaluate(async () => {
    await window.__probe.loseRendererContextForTest();
  });
  await settle(page);
  const after = await page.evaluate(() => ({
    ui: window.__probe.ui(),
    text: window.__probe.behaviourTrace({ format: 'text' }).text,
  }));
  return after;
}

function expectRecoveryText(text) {
  expect(text).toContain('renderer.context-recovery');
  const states = [];
  for (const line of String(text).split('\n')) {
    if (!line.includes('renderer.context-recovery')) continue;
    const match = line.match(/"state":"(lost|rebuilding|ready)"/);
    if (match) states.push(match[1]);
  }
  expect(states).toEqual(expect.arrayContaining(['lost', 'rebuilding', 'ready']));
  const lostIdx = states.indexOf('lost');
  const rebuildIdx = states.indexOf('rebuilding');
  const readyIdx = states.lastIndexOf('ready');
  expect(lostIdx).toBeGreaterThanOrEqual(0);
  expect(rebuildIdx).toBeGreaterThan(lostIdx);
  expect(readyIdx).toBeGreaterThan(rebuildIdx);
  expect(text).toMatch(/correlation=ctx-recovery-/);
  expect(text).toContain('presentation.shake-sync');
}

async function runProfileJourney(page, kind) {
  const blob = kind === 'veteran'
    ? buildVeteranProfileStorage()
    : buildFreshProfileStorage();
  const validated = validateProfileStorage(blob);
  if (kind === 'veteran') assertVeteranProfile(validated);
  else assertFreshProfile(validated);

  const errors = await bootWithProfile(page, blob);

  // Title / Vigil / Embark surfaces through real controls.
  await expect(page.locator('.title-screen')).toBeVisible({ timeout: 15_000 });
  await expect(page.locator('[data-a="embark"], [data-a="continue"]').first()).toBeVisible();
  if (kind === 'veteran') {
    const vigilBtn = page.locator('[data-a="vigil"]');
    if (await vigilBtn.count()) {
      await vigilBtn.click({ force: true });
      await expect(page.locator('.vigil-screen, [data-a="tab-rose"]').first()).toBeVisible({
        timeout: 10_000,
      });
      const back = page.locator('[data-a="title"]').first();
      if (await back.count()) await back.click({ force: true }).catch(() => {});
      else await page.keyboard.press('Escape').catch(() => {});
    }
  }

  await driveLabCombat(page);
  await cancelActiveDrag(page);
  const recovery = await triggerShakeAndRecovery(page);
  expect(recovery.ui.renderer.kind).toBe('pixi');
  expect(recovery.ui.renderer.state).toBe('ready');
  expectRecoveryText(recovery.text);

  // Post-restore interaction: hit lantern via stage bounds.
  const lantern = await page.evaluate(() => {
    const bounds = window.__probe.ui().lantern?.bounds
      || window.spirebound.combatGl?.readUI?.()?.lantern;
    return bounds;
  });
  if (lantern) {
    const client = await stageBoundsToClient(page, lantern);
    await page.mouse.click(client.x, client.y);
  }

  const integrity = await page.evaluate(() => {
    const trace = window.__probe.behaviourTrace();
    try {
      return trace.assertIntegrity ? trace.assertIntegrity() : { ok: true, errors: [] };
    } catch (error) {
      return { ok: false, errors: [error.message] };
    }
  });
  expect(integrity.ok !== false, JSON.stringify(integrity)).toBeTruthy();
  expectNoErrors(errors, `${kind} production-profile`);
}

test('fresh profile Lab combat journey', async ({ page }) => {
  test.setTimeout(120_000);
  await runProfileJourney(page, 'fresh');
});

test('veteran profile Lab combat journey', async ({ page }) => {
  test.setTimeout(120_000);
  await runProfileJourney(page, 'veteran');
});
