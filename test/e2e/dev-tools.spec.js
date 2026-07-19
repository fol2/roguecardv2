import { test, expect } from './trace-fixture.js';
import { ROUTES } from '../../src/dev/routes.js';

const MERGE_DOMAINS = [
  'player', 'shop', 'cards', 'statuses', 'relics', 'potions', 'enemies', 'events',
  'omens', 'affixes', 'arts', 'deeds', 'quests', 'variants', 'shadeKits', 'boons',
  'themes', 'aspects', 'vows', 'questIds', 'progression',
];

const HUB_ROUTES = ROUTES.filter((route) => route.group != null);
const GROUP_HEADINGS = ['Simulation', 'Editors', 'Content', 'Art & Audio'];

test.describe('developer tools', () => {
  test('dashboard renders doctor domains, provenance, schema ownership, and tool links', async ({ page }) => {
    await page.goto('/?dashboard=1');
    await page.waitForSelector('[data-content-doctor]');

    const root = page.locator('[data-content-doctor]');
    await expect(root).toBeVisible();

    const home = page.locator('a[data-dev-home]');
    await expect(home).toBeVisible();
    await expect(home).toHaveAttribute('href', '?dev=1');

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

  test('dev hub lists every registry route, grouped, with sim and back-to-game', async ({ page }) => {
    await page.goto('/?dev=1');
    await page.waitForSelector('[data-dev-shell]');
    await expect(page.locator('[data-dev-shell]')).toBeVisible();

    // Every non-null-group registry entry appears with the right href.
    for (const route of HUB_ROUTES) {
      const link = page.locator(`a[data-dev-route="${route.param}"]`);
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('href', `?${route.param}=1`);
    }

    // Rendered route-link count matches registry (no drift / no hub self-link).
    await expect(page.locator('a[data-dev-route]')).toHaveCount(HUB_ROUTES.length);

    // Sim lab is listed (was missing from the old static shell).
    await expect(page.locator('a[data-dev-route="sim"]')).toHaveAttribute('href', '?sim=1');

    // Four group headings render.
    for (const heading of GROUP_HEADINGS) {
      await expect(page.locator(`[data-dev-group="${heading}"] h2`)).toHaveText(heading);
    }

    // Back to game (preserved from old shell).
    await expect(page.locator('a.dev-hub-back[href="?"]')).toBeVisible();
  });

  test('charedit boots editor chrome and skips normal game boot', async ({ page }) => {
    await page.goto('/?charedit=1');
    await page.waitForSelector('[data-charedit-root]');
    await expect(page.locator('[data-charedit-root]')).toBeVisible();
    await expect(page.locator('#ce-bar')).toBeVisible();
    // Exclusive-boot editors skip initUI — no title screen / game hook.
    await expect(page.locator('.title-screen')).toHaveCount(0);
    expect(await page.evaluate(() => !!window.spirebound)).toBe(false);
  });

  test('soft-nav swaps hub ↔ doctor ↔ manager without document reload', async ({ page }) => {
    await page.goto('/?dev=1');
    await page.waitForSelector('[data-dev-shell]');
    await page.evaluate(() => { window.__navProbe = { t: Date.now() }; });

    await page.locator('.dev-shell > .dev-rail a.dev-nav-item[href="?dashboard=1"]').click();
    await page.waitForSelector('[data-content-doctor]');
    expect(page.url()).toContain('dashboard=1');
    expect(await page.evaluate(() => window.__navProbe?.t)).toBeTruthy();

    await page.locator('.dev-shell > .dev-rail a.dev-nav-item[href="?contentedit=1"]').click();
    await page.waitForSelector('[data-content-manager]');
    expect(page.url()).toContain('contentedit=1');
    expect(await page.evaluate(() => window.__navProbe?.t)).toBeTruthy();

    await page.locator('.dev-shell > .dev-rail a.dev-nav-item[href="?dev=1"]').click();
    await page.waitForSelector('[data-dev-shell]');
    expect(page.url()).toMatch(/[?&]dev=1/);
    expect(await page.evaluate(() => window.__navProbe?.t)).toBeTruthy();

    // Hard-nav tool still does a real load (probe dies).
    await page.locator('.dev-shell > .dev-rail a.dev-nav-item[href="?lab=1"]').click();
    await page.waitForSelector('[data-lab-root]');
    expect(await page.evaluate(() => window.__navProbe?.t)).toBeFalsy();
  });

  test('vfxedit boots editor chrome and skips normal game boot', async ({ page }) => {
    await page.goto('/?vfxedit=1');
    await page.waitForSelector('[data-vfxedit-root]');
    await expect(page.locator('[data-vfxedit-root]')).toBeVisible();
    await expect(page.locator('#vx-bar')).toBeVisible();
    // Exclusive-boot editors skip initUI — no title screen / game hook.
    await expect(page.locator('.title-screen')).toHaveCount(0);
    expect(await page.evaluate(() => !!window.spirebound)).toBe(false);
  });
});
