// Battlefield editor smoke (desktop only — it is a desktop dev tool).
import { test, expect } from '@playwright/test';

test.beforeEach(({ }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'editor is desktop-only');
});

test('?bfedit=1 mounts the editor over a sandbox fight', async ({ page }) => {
  await page.goto('/?bfedit=1&mesh=0');
  await expect(page.locator('#bf-toolbar')).toBeVisible();
  await expect(page.locator('#bf-panel')).toBeVisible();
  // default scenario: hero + 2 enemies + 3 layers + ground line
  await expect(page.locator('.bf-box[data-bf="hero"]')).toBeVisible();
  await expect(page.locator('.bf-box[data-bf^="enemy-"]')).toHaveCount(2);
  await expect(page.locator('.bf-box[data-bf^="layer-"]')).toHaveCount(3);
  await expect(page.locator('.bf-box[data-bf="ground"]')).toBeVisible();
});

test('a normal session never loads the editor', async ({ page }) => {
  await page.goto('/?mesh=0');
  await page.waitForFunction(() => window.spirebound);
  await expect(page.locator('#bf-toolbar')).toHaveCount(0);
});

test('dragging the hero moves its x by the drag distance (stage px)', async ({ page }) => {
  await page.goto('/?bfedit=1&mesh=0');
  const hero = page.locator('.bf-box[data-bf="hero"]');
  await hero.waitFor();
  const scale = await page.evaluate(() => window.__probe.stage().scale);
  const before = await page.evaluate(() => window.__bfEditor.resolved().hero.x);
  const box = await hero.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 40 * scale, box.y + box.height / 2, { steps: 5 });
  await page.mouse.up();
  const after = await page.evaluate(() => window.__bfEditor.resolved().hero.x);
  expect(after - before).toBe(40);
});

test('panel numeric edit applies live to the working layout', async ({ page }) => {
  await page.goto('/?bfedit=1&mesh=0');
  await page.locator('.bf-box[data-bf="ground"]').click();
  const input = page.locator('#bf-panel input[data-path="groundY"]');
  await input.fill('250');
  await input.press('Enter');
  const g = await page.evaluate(() => window.__bfEditor.resolved().groundY);
  expect(g).toBe(250);
  await expect(page.locator('#bf-dirty')).toHaveText(/●/);
});

test('Save POSTs the edited layout to /__bf-save', async ({ page }) => {
  let payload = null;
  await page.route('**/__bf-save', async (route) => {
    payload = JSON.parse(route.request().postData());
    await route.fulfill({ json: { ok: true } });
  });
  await page.goto('/?bfedit=1&mesh=0');
  await page.locator('.bf-box[data-bf="ground"]').click();
  const input = page.locator('#bf-panel input[data-path="groundY"]');
  await input.fill('241');
  await input.press('Enter');
  await page.locator('#bf-save').click();
  await expect(page.locator('#bf-dirty')).toHaveText(/saved/);
  // the desktop project runs the desktop-landscape shape (not the base
  // pad-landscape), so the edit defaults to that shape's override:
  expect(payload.shapes['desktop-landscape'].groundY).toBe(241);
  expect(payload.base.groundY).toBe(232);
});

test('Save writes layout to disk and reload picks it up', async ({ page }) => {
  test.skip(!process.env.BFEDITOR_DISK, 'writes watched source; run alone with BFEDITOR_DISK=1');
  const { readFileSync, writeFileSync } = await import('node:fs');
  const layoutPath = 'src/battlefield-layout.js';
  const orig = readFileSync(layoutPath, 'utf8');
  try {
    await page.goto('/?bfedit=1&mesh=0');
    await page.waitForFunction(() => window.__bfEditor);
    const before = await page.evaluate(() => window.__bfEditor.resolved().groundY);
    const target = before + 3;
    await page.locator('.bf-box[data-bf="ground"]').click();
    await page.locator('#bf-panel input[data-path="groundY"]').fill(String(target));
    await page.locator('#bf-panel input[data-path="groundY"]').press('Enter');
    await Promise.all([
      page.waitForEvent('load'),
      page.locator('#bf-save').click(),
    ]);
    await page.waitForFunction(() => window.__bfEditor);
    const after = await page.evaluate(() => window.__bfEditor.resolved().groundY);
    expect(after).toBe(target);
    expect(readFileSync(layoutPath, 'utf8')).toContain(`groundY: ${target}`);
  } finally {
    writeFileSync(layoutPath, orig);
  }
});
