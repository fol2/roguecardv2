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
