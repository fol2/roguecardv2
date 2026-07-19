import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, readdirSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect } from '@playwright/test';

const MECHANICS_PATH = 'src/packs/core/cards.js';
const LOCALE_PATH = 'src/i18n/en/content.js';
const OWNED_SUFFIXES = ['.tmp.mjs', '.round5-backup', '.write.tmp.mjs', '.cards.tmp.mjs'];

function sha256(text) {
  return createHash('sha256').update(text).digest('hex');
}

function cleanupOwnedTemps() {
  for (const dir of ['src/packs/core', 'src/i18n/en']) {
    for (const name of readdirSync(dir)) {
      if (OWNED_SUFFIXES.some((suffix) => name.endsWith(suffix))
        || name.includes('.cards.tmp.')
        || /\.tmp\.mjs$/.test(name)
        || name.endsWith('.round5-backup')
        || name.endsWith('.write.tmp.mjs')) {
        try { unlinkSync(join(dir, name)); } catch { /* ignore */ }
      }
    }
    // content.js.cards.tmp.mjs style
    for (const name of readdirSync(dir)) {
      if (name.includes('content.js.') && name.includes('tmp')) {
        try { unlinkSync(join(dir, name)); } catch { /* ignore */ }
      }
    }
  }
}

async function openManager(page, { domain = 'cards', id = 'strike' } = {}) {
  await page.goto(`/?contentedit=1&domain=${domain}&id=${id}`);
  await page.waitForSelector('[data-content-manager]');
}

test('Content Manager renders provenance, schema ownership, and editable form', async ({ page }) => {
  await openManager(page);
  await expect(page.locator('[data-content-manager]')).toBeVisible();
  const home = page.locator('a[data-dev-home]');
  await expect(home).toBeVisible();
  await expect(home).toHaveAttribute('href', '?dev=1');
  await expect(page.locator('[data-manager-provenance]')).toBeVisible();
  await expect(page.locator('[data-manager-registration="core"]')).toBeVisible();
  await expect(page.locator('[data-manager-schema-field][data-source="locale"]').first()).toBeVisible();
  await expect(page.locator('[data-manager-schema-field][data-source="pack"]').first()).toBeVisible();
  await expect(page.locator('[data-manager-form]')).toBeVisible();
  await expect(page.locator('[data-manager-field="text"] [data-manager-source="locale"]')).toBeVisible();
  await expect(page.locator('[data-manager-field="cost"] [data-manager-source="pack"]')).toBeVisible();
});

test('Save splits locale vs mechanics writes with SHA-256 restore', async ({ page }) => {
  test.skip(test.info().project.name !== 'content-manager-disk',
    'writes watched source; runs in the dedicated content-manager-disk project');

  const originalMechanics = readFileSync(MECHANICS_PATH, 'utf8');
  const originalLocale = readFileSync(LOCALE_PATH, 'utf8');
  const originalMechanicsSha = sha256(originalMechanics);
  const originalLocaleSha = sha256(originalLocale);

  try {
    await openManager(page, { domain: 'cards', id: 'strike' });

    // Transaction 1: locale-only description edit.
    const textInput = page.locator('[data-manager-form] input[data-field="text"], [data-manager-form] textarea[data-field="text"]');
    const beforeText = await textInput.inputValue();
    const localeMarker = `${beforeText} · content-manager-disk`;
    await textInput.fill(localeMarker);
    const [localeResponse] = await Promise.all([
      page.waitForResponse((response) => response.url().endsWith('/__content-save')
        && response.request().method() === 'POST'),
      page.locator('[data-manager-save]').click(),
    ]);
    expect(localeResponse.ok()).toBe(true);
    const localeJson = await localeResponse.json();
    expect(localeJson.ok).toBe(true);
    expect(localeJson.wrote.locale).toBe(true);
    expect(localeJson.wrote.mechanics).toBe(false);

    const afterLocaleMechanics = readFileSync(MECHANICS_PATH, 'utf8');
    const afterLocaleLocale = readFileSync(LOCALE_PATH, 'utf8');
    expect(sha256(afterLocaleMechanics)).toBe(originalMechanicsSha);
    expect(sha256(afterLocaleLocale)).not.toBe(originalLocaleSha);
    expect(afterLocaleLocale).toContain('content-manager-disk');

    // Transaction 2: mechanics-only cost edit.
    const costInput = page.locator('[data-manager-form] input[data-field="cost"], [data-manager-form] textarea[data-field="cost"]');
    const beforeCost = await costInput.inputValue();
    const nextCost = String(Number(beforeCost) + 1);
    await costInput.fill(nextCost);
    const localeShaBeforeMech = sha256(readFileSync(LOCALE_PATH, 'utf8'));
    const [mechResponse] = await Promise.all([
      page.waitForResponse((response) => response.url().endsWith('/__content-save')
        && response.request().method() === 'POST'),
      page.locator('[data-manager-save]').click(),
    ]);
    expect(mechResponse.ok()).toBe(true);
    const mechJson = await mechResponse.json();
    expect(mechJson.ok).toBe(true);
    expect(mechJson.wrote.mechanics).toBe(true);
    expect(mechJson.wrote.locale).toBe(false);

    const afterMechMechanics = readFileSync(MECHANICS_PATH, 'utf8');
    const afterMechLocale = readFileSync(LOCALE_PATH, 'utf8');
    expect(sha256(afterMechLocale)).toBe(localeShaBeforeMech);
    expect(sha256(afterMechMechanics)).not.toBe(originalMechanicsSha);
    expect(afterMechMechanics).toMatch(new RegExp(`cost:\\s*${nextCost}`));
  } finally {
    writeFileSync(MECHANICS_PATH, originalMechanics);
    writeFileSync(LOCALE_PATH, originalLocale);
    cleanupOwnedTemps();
    expect(readFileSync(MECHANICS_PATH, 'utf8')).toBe(originalMechanics);
    expect(readFileSync(LOCALE_PATH, 'utf8')).toBe(originalLocale);
    expect(sha256(readFileSync(MECHANICS_PATH, 'utf8'))).toBe(originalMechanicsSha);
    expect(sha256(readFileSync(LOCALE_PATH, 'utf8'))).toBe(originalLocaleSha);
  }
});
