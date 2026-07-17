import { test, expect } from './trace-fixture.js';

const MERGE_DOMAINS = [
  'player', 'shop', 'cards', 'statuses', 'relics', 'potions', 'enemies', 'events',
  'omens', 'affixes', 'arts', 'deeds', 'quests', 'variants', 'shadeKits', 'boons',
  'themes', 'aspects', 'vows', 'questIds', 'progression',
];

const SHELL_ROUTES = [
  'gallery', 'audio', 'bfedit', 'bfuiedit', 'charedit', 'vfxedit',
  'lab', 'dashboard', 'contentedit',
];

test.describe('developer tools', () => {
  test('dashboard renders doctor domains, provenance, schema ownership, and tool links', async ({ page }) => {
    await page.goto('/?dashboard=1');
    await page.waitForSelector('[data-content-doctor]');

    const root = page.locator('[data-content-doctor]');
    await expect(root).toBeVisible();

    // Every registry domain with total/complete badges.
    for (const domain of MERGE_DOMAINS) {
      const section = page.locator(`[data-doctor-domain="${domain}"]`);
      await expect(section).toBeVisible();
      await expect(section.locator('[data-doctor-total]')).toBeVisible();
      await expect(section.locator('[data-doctor-complete]')).toBeVisible();
    }

    // Generated registration / pack / source / target provenance.
    await expect(page.locator('[data-doctor-provenance]')).toBeVisible();
    await expect(page.locator('[data-doctor-registration]')).toHaveCount(2); // core + sample
    await expect(page.locator('[data-doctor-registration="core"]')).toBeVisible();
    await expect(page.locator('[data-doctor-registration="sample"]')).toBeVisible();
    await expect(page.locator('[data-doctor-source-path]').first()).not.toBeEmpty();
    await expect(page.locator('[data-doctor-mechanics-pack]').first()).not.toBeEmpty();
    await expect(page.locator('[data-doctor-targets]').first()).not.toBeEmpty();

    // Schema field ownership (pack|locale).
    await expect(page.locator('[data-doctor-schema]')).toBeVisible();
    await expect(page.locator('[data-doctor-schema-field][data-source="locale"]').first()).toBeVisible();
    await expect(page.locator('[data-doctor-schema-field][data-source="pack"]').first()).toBeVisible();

    // Stable text projection + problem links + gallery/Lab launch.
    await expect(page.locator('[data-doctor-report-text]')).toContainText(/content:/);
    const gallery = page.locator('a[data-doctor-link="gallery"]').first();
    const lab = page.locator('a[data-doctor-link="lab"]').first();
    await expect(gallery).toBeVisible();
    await expect(lab).toBeVisible();
    await expect(gallery).toHaveAttribute('href', /gallery=1/);
    await expect(lab).toHaveAttribute('href', /lab=1/);

    // Problem rows (or empty host) are present as doctor surface.
    await expect(page.locator('[data-doctor-problems]')).toBeVisible();
  });

  test('dev shell lists every existing editor/gallery/Lab/dashboard/contentedit route', async ({ page }) => {
    await page.goto('/?dev=1');
    await page.waitForSelector('[data-dev-shell]');
    await expect(page.locator('[data-dev-shell]')).toBeVisible();

    for (const route of SHELL_ROUTES) {
      const link = page.locator(`a[data-dev-route="${route}"]`);
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('href', new RegExp(`[?&]${route}=1`));
    }
  });
});
