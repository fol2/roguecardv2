// UI chrome editor disk-save (desktop-only). Saves through the real
// /__bfui-save endpoint, asserts live Pixi readUI() relayout, and restores
// the exact src/ui-chrome-layout.js bytes in finally.
import { test, expect } from '@playwright/test';
import { readFileSync, writeFileSync } from 'node:fs';

const UIC_LAYOUT_PATH = 'src/ui-chrome-layout.js';

async function waitForDevServerReady(baseURL, timeoutMs = 10_000) {
  const deadline = Date.now() + timeoutMs;
  let lastError = null;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(baseURL);
      if (response.ok) {
        await new Promise((resolve) => setTimeout(resolve, 1_000));
        const settled = await fetch(baseURL);
        if (settled.ok) return;
      }
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  throw new Error(`dev server did not settle after ui-chrome layout write: ${lastError?.message ?? 'not ready'}`);
}

async function openBfuiEditor(page, params = {}) {
  const query = new URLSearchParams({
    bfuiedit: '1',
    mesh: '0',
    shape: 'desktop-landscape',
    ...params,
  });
  try {
    await page.goto(`/?${query.toString()}`, { waitUntil: 'commit' });
  } catch (error) {
    if (!/interrupted by another navigation/i.test(String(error?.message || error))) throw error;
  }
  await page.waitForFunction(() => Boolean(
    typeof window.__bfuiEditor?.resolved === 'function'
    && typeof window.__bfuiEditor?.working === 'function'
    && typeof window.__probe?.stage === 'function'
    && Number.isFinite(window.__probe.stage().scale)
    && window.spirebound?.combatGl
    && document.querySelector('#bfui-toolbar')
    && document.querySelector('#bfui-panel')
    && document.querySelector('.combat-screen')
  ), null, { timeout: 30_000 });
  await page.waitForFunction(() => {
    const ui = window.__probe?.ui?.();
    return ui?.version === 2 && ui?.renderer?.kind === 'pixi' && ui?.model?.hasModel;
  }, null, { timeout: 15_000 });
}

test.beforeEach(({ }, testInfo) => {
  test.skip(!['desktop', 'bfuieditor-disk'].includes(testInfo.project.name), 'bfuiedit is desktop-only');
});

test('?bfuiedit=1 mounts the chrome editor over a sandbox fight', async ({ page }) => {
  await openBfuiEditor(page);
  await expect(page.locator('#bfui-toolbar')).toBeVisible();
  await expect(page.locator('#bfui-panel')).toBeVisible();
  await expect(page.locator('.combat-screen')).toBeVisible();
  const seam = await page.evaluate(() => ({
    version: window.__probe.ui().version,
    kind: window.__probe.ui().renderer.kind,
    hasReadUI: !!window.spirebound.combatGl.readUI()?.chrome?.energy,
  }));
  expect(seam.version).toBe(2);
  expect(seam.kind).toBe('pixi');
  expect(seam.hasReadUI).toBe(true);
});

test('panel numeric edit relayouts Pixi chrome live without reload', async ({ page }) => {
  await openBfuiEditor(page);
  await page.locator('#bfui-panel [data-sel="energy"]').click();
  const before = await page.evaluate(() => {
    const chrome = window.spirebound.combatGl.readUI().chrome.energy;
    return { left: chrome.left, bottom: chrome.bottom };
  });
  const targetBottom = before.bottom + 7;
  const input = page.locator('#bfui-panel input[data-k="bottom"]');
  await input.fill(String(targetBottom));
  await input.press('Enter');
  await expect.poll(async () => page.evaluate(() =>
    window.spirebound.combatGl.readUI().chrome.energy.bottom)).toBe(targetBottom);
  const after = await page.evaluate(() => {
    const chrome = window.spirebound.combatGl.readUI().chrome.energy;
    const candle = window.spirebound.combatGl.readUI().candleFrame?.bounds;
    return { left: chrome.left, bottom: chrome.bottom, candleBottom: candle?.bottom ?? null };
  });
  expect(after.bottom).toBe(targetBottom);
  expect(after.left).toBe(before.left);
  expect(after.candleBottom).not.toBeNull();
  await expect(page.locator('#bfui-dirty')).toHaveText(/●/);
});

test('Save writes ui-chrome-layout.js to disk and live Pixi keeps the new bounds', async ({ page, baseURL }) => {
  test.skip(test.info().project.name !== 'bfuieditor-disk',
    'writes watched source; runs in the dedicated bfuieditor-disk project');
  const original = readFileSync(UIC_LAYOUT_PATH, 'utf8');
  try {
    await openBfuiEditor(page, { shape: 'desktop-landscape' });
    await page.locator('#bfui-panel [data-sel="energy"]').click();
    const before = await page.evaluate(() => window.__bfuiEditor.resolved().energy.bottom);
    const target = before + 5;
    await page.locator('#bfui-panel input[data-k="bottom"]').fill(String(target));
    await page.locator('#bfui-panel input[data-k="bottom"]').press('Enter');
    await expect.poll(async () => page.evaluate(() =>
      window.spirebound.combatGl.readUI().chrome.energy.bottom)).toBe(target);

    const [saveResponse] = await Promise.all([
      page.waitForResponse((response) => response.url().endsWith('/__bfui-save')
        && response.request().method() === 'POST'),
      page.locator('#bfui-save').click(),
    ]);
    expect(saveResponse.ok()).toBe(true);
    const saveBody = await saveResponse.json();
    expect(saveBody.ok).toBe(true);
    await expect(page.locator('#bfui-dirty')).toHaveText(/saved/);
    await expect.poll(() => readFileSync(UIC_LAYOUT_PATH, 'utf8')).toContain(`bottom: ${target}`);

    // Live Pixi readUI must already reflect the saved value (no reload required).
    const liveBottom = await page.evaluate(() =>
      window.spirebound.combatGl.readUI().chrome.energy.bottom);
    expect(liveBottom).toBe(target);

    await waitForDevServerReady(baseURL);
    await openBfuiEditor(page, { shape: 'desktop-landscape' });
    const afterReload = await page.evaluate(() => ({
      resolved: window.__bfuiEditor.resolved().energy.bottom,
      readUI: window.spirebound.combatGl.readUI().chrome.energy.bottom,
    }));
    expect(afterReload.resolved).toBe(target);
    expect(afterReload.readUI).toBe(target);
  } finally {
    writeFileSync(UIC_LAYOUT_PATH, original);
    await waitForDevServerReady(baseURL);
    expect(readFileSync(UIC_LAYOUT_PATH, 'utf8')).toBe(original);
  }
});
