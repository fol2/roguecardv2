// Battlefield editor smoke (desktop only — it is a desktop dev tool).
import { test, expect } from '@playwright/test';

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
  throw new Error(`dev server did not settle after battlefield layout write: ${lastError?.message ?? 'not ready'}`);
}

async function mockCharSave(page) {
  const payloads = [];
  await page.route('**/__char-save', async (route) => {
    payloads.push(JSON.parse(route.request().postData()));
    await route.fulfill({ json: { ok: true, reload: false } });
  });
  return payloads;
}

async function openBfEditor(page, params = {}) {
  const query = new URLSearchParams({
    bfedit: '1',
    mesh: '0',
    ...params,
  });
  await page.goto(`/?${query.toString()}`);
  await page.waitForFunction(() => Boolean(
    typeof window.__bfEditor?.resolved === 'function'
    && typeof window.__bfEditor?.working === 'function'
    && typeof window.__probe?.stage === 'function'
    && Number.isFinite(window.__probe.stage().scale)
    && window.__bfEditor.resolved()
    && document.querySelector('#bf-toolbar')
    && document.querySelector('#bf-panel')
    && document.querySelector('.bf-box[data-bf="hero"]')
  ));
}

async function waitForEditorOverlayStable(page) {
  await page.evaluate(async () => {
    const layers = [...document.querySelectorAll('.combat-screen .sl')];
    await Promise.all(layers.map((img) => img.decode().catch(() => {})));
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
}

async function locatorCenter(locator) {
  await expect(locator).toBeVisible();
  return locator.evaluate((node) => {
    const box = node.getBoundingClientRect();
    return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
  });
}

test.beforeEach(({ }, testInfo) => {
  test.skip(!['desktop', 'bfeditor-disk'].includes(testInfo.project.name), 'editor is desktop-only');
});

test('?bfedit=1 mounts the editor over a sandbox fight', async ({ page }) => {
  await openBfEditor(page);
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

test('clicking a box without dragging does not dirty the layout', async ({ page }) => {
  await openBfEditor(page);
  await page.locator('.bf-box[data-bf="hero"]').click();
  await page.locator('.bf-box[data-bf="ground"]').click();
  await expect(page.locator('.bf-box[data-bf="ground"]')).toHaveClass(/bf-sel/);
  await expect(page.locator('#bf-dirty')).toHaveText('');
});

test('dragging the hero moves its x by the drag distance (stage px)', async ({ page }) => {
  await openBfEditor(page);
  const hero = page.locator('.bf-box[data-bf="hero"]');
  const scale = await page.evaluate(() => window.__probe.stage().scale);
  const before = await page.evaluate(() => window.__bfEditor.resolved().hero.x);
  await waitForEditorOverlayStable(page);
  const center = await locatorCenter(hero);
  await page.mouse.move(center.x, center.y);
  await page.mouse.down();
  await page.mouse.move(center.x + 40 * scale, center.y, { steps: 5 });
  await page.mouse.up();
  const after = await page.evaluate(() => window.__bfEditor.resolved().hero.x);
  expect(after - before).toBe(40);
});

test('a hero drag locks to the axis of the first decisive move for the whole drag', async ({ page }) => {
  await openBfEditor(page);
  const hero = page.locator('.bf-box[data-bf="hero"]');
  const scale = await page.evaluate(() => window.__probe.stage().scale);
  const before = await page.evaluate(() => ({
    x: window.__bfEditor.resolved().hero.x,
    y: window.__bfEditor.resolved().hero.y ?? 0,
    heroes: window.__bfEditor.working().shared.heroes,
  }));
  await waitForEditorOverlayStable(page);
  const { x: cx, y: cy } = await locatorCenter(hero);
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  // phase 1: decisive horizontal move (12 stage px) locks the x axis
  await page.mouse.move(cx + 12 * scale, cy);
  // phase 2: strong vertical move — a per-event axis choice would see
  // |dy| > |dx| on these events and write hero.y; the per-drag lock must not
  await page.mouse.move(cx + 12 * scale, cy + 50 * scale, { steps: 5 });
  await page.mouse.up();
  const after = await page.evaluate(() => ({
    x: window.__bfEditor.resolved().hero.x,
    y: window.__bfEditor.resolved().hero.y ?? 0,
    heroes: window.__bfEditor.working().shared.heroes,
  }));
  expect(after.x - before.x).toBe(12);
  expect(after.y).toBe(before.y); // axis locked: hero.y untouched
  expect(after.heroes).toEqual(before.heroes); // shared footY untouched
});

test('dragging the hero vertically writes hero.y at shape scope', async ({ page }) => {
  await openBfEditor(page);
  const hero = page.locator('.bf-box[data-bf="hero"]');
  const scale = await page.evaluate(() => window.__probe.stage().scale);
  const before = await page.evaluate(() => ({
    y: window.__bfEditor.resolved().hero.y ?? 0,
    heroes: window.__bfEditor.working().shared.heroes,
  }));
  await waitForEditorOverlayStable(page);
  const { x: cx, y: cy } = await locatorCenter(hero);
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  await page.mouse.move(cx, cy - 30 * scale, { steps: 5 }); // up on screen = lift
  await page.mouse.up();
  const after = await page.evaluate(() => ({
    y: window.__bfEditor.resolved().hero.y ?? 0,
    heroes: window.__bfEditor.working().shared.heroes,
  }));
  expect(after.y - before.y).toBe(30);
  expect(after.heroes).toEqual(before.heroes);
});

test('pad-landscape offers base, shape, and act scope for positional rows', async ({ page }) => {
  await openBfEditor(page, { shape: 'pad-landscape' });
  await page.locator('.bf-box[data-bf="ground"]').click();
  const scopeSel = page.locator('#bf-panel select[data-scope="0"]'); // groundY row
  await expect(scopeSel.locator('option')).toHaveText(['base', 'shape', 'act']);
  await expect(scopeSel).not.toBeDisabled();
});

test('/__bf-save rejects bodies over 1 MB with 413', async ({ page }) => {
  await openBfEditor(page);
  const result = await page.evaluate(async () => {
    const r = await fetch('/__bf-save', { method: 'POST', body: 'x'.repeat(1_200_000) });
    return { status: r.status, json: await r.json() };
  });
  expect(result.status).toBe(413);
  expect(result.json).toEqual({ ok: false, problems: ['payload too large'] });
});

test('panel numeric edit applies live to the working layout', async ({ page }) => {
  await openBfEditor(page);
  await page.locator('.bf-box[data-bf="ground"]').click();
  const input = page.locator('#bf-panel input[data-path="groundY"]');
  await input.fill('250');
  await input.press('Enter');
  const g = await page.evaluate(() => window.__bfEditor.resolved().groundY);
  expect(g).toBe(250);
  await expect(page.locator('#bf-dirty')).toHaveText(/●/);
});

test('Save POSTs the edited layout to /__bf-save', async ({ page }) => {
  const charPayloads = await mockCharSave(page);
  let payload = null;
  await page.route('**/__bf-save', async (route) => {
    payload = JSON.parse(route.request().postData());
    await route.fulfill({ json: { ok: true } });
  });
  await openBfEditor(page);
  await page.locator('.bf-box[data-bf="ground"]').click();
  const input = page.locator('#bf-panel input[data-path="groundY"]');
  await input.fill('241');
  await input.press('Enter');
  await page.locator('#bf-save').click();
  await expect(page.locator('#bf-dirty')).toHaveText('saved ✓');
  expect(charPayloads).toHaveLength(1);
  // the desktop project runs the desktop-landscape shape (not the base
  // pad-landscape), so the edit defaults to that shape's override:
  expect(payload.shapes['desktop-landscape'].groundY).toBe(241);
  expect(payload.base.groundY).toBe(232);
});

test('clearing a slot override restores the base formation intact', async ({ page }) => {
  await openBfEditor(page);
  await page.locator('.bf-box[data-bf="enemy-0"]').click();
  const panel = page.locator('#bf-panel');
  // the layout file ships a desktop-landscape slots override: clear it first
  // so "pre-edit" is the base formation, then exercise edit → clear
  await panel.locator('button[data-clear="0"]').click();
  const preEdit = await page.evaluate(() => window.__bfEditor.resolved().slots[2][0].x);
  const input = panel.locator('input[data-path="x"]');
  await input.fill(String(preEdit + 37));
  await input.press('Enter');
  expect(await page.evaluate(() => window.__bfEditor.resolved().slots[2][0].x)).toBe(preEdit + 37);
  const clear = panel.locator('button[data-clear="0"]');
  await expect(clear).toBeVisible();
  await clear.click();
  expect(await page.evaluate(() => window.__bfEditor.resolved().slots[2][0].x)).toBe(preEdit);
  const sane = await page.evaluate(() => {
    const w = window.__bfEditor.working();
    const slots = window.__bfEditor.resolved().slots;
    return {
      overrideGone: w.shapes['desktop-landscape']?.slots?.[2] === undefined,
      allFinite: Object.values(slots).every((arr) => arr.every((s) => Number.isFinite(s.x))),
    };
  });
  expect(sane.overrideGone).toBe(true);
  expect(sane.allFinite).toBe(true);
});

test('a partial shape layer override passes validation and saves', async ({ page }) => {
  const charPayloads = await mockCharSave(page);
  let payload = null;
  await page.route('**/__bf-save', async (route) => {
    payload = JSON.parse(route.request().postData());
    await route.fulfill({ json: { ok: true } });
  });
  await openBfEditor(page);
  await page.locator('#bf-panel [data-select="layer-ledge"]').click();
  const input = page.locator('#bf-panel input[data-path="y"]');
  await input.fill('5');
  await input.press('Enter');
  await page.locator('#bf-save').click();
  await expect(page.locator('#bf-dirty')).toHaveText('saved ✓');
  expect(charPayloads).toHaveLength(1);
  expect(payload.shapes['desktop-landscape'].layers.ledge.y).toBe(5);
});

test('Save writes layout to disk and reload picks it up', async ({ page, baseURL }) => {
  test.skip(test.info().project.name !== 'bfeditor-disk', 'writes watched source; runs in the dedicated dependency project');
  const { readFileSync, writeFileSync } = await import('node:fs');
  const layoutPath = 'src/battlefield-layout.js';
  const charPath = 'src/char-meta.js';
  const originalLayout = readFileSync(layoutPath, 'utf8');
  const originalChar = readFileSync(charPath, 'utf8');
  try {
    await openBfEditor(page, { shape: 'pad-landscape' });
    const before = await page.evaluate(() => window.__bfEditor.resolved().groundY);
    const target = before + 3;
    await page.locator('.bf-box[data-bf="ground"]').click();
    await page.locator('#bf-panel input[data-path="groundY"]').fill(String(target));
    await page.locator('#bf-panel input[data-path="groundY"]').press('Enter');
    const [charResponse, bfResponse] = await Promise.all([
      page.waitForResponse((response) => response.url().endsWith('/__char-save')
        && response.request().method() === 'POST'),
      page.waitForResponse((response) => response.url().endsWith('/__bf-save')
        && response.request().method() === 'POST'),
      page.locator('#bf-save').click(),
    ]);
    expect(charResponse.ok()).toBe(true);
    expect(bfResponse.ok()).toBe(true);
    await expect.poll(() => readFileSync(layoutPath, 'utf8')).toContain(`groundY: ${target}`);
    await waitForDevServerReady(baseURL);
    await openBfEditor(page, { shape: 'pad-landscape' });
    const after = await page.evaluate(() => window.__bfEditor.resolved().groundY);
    expect(after).toBe(target);
  } finally {
    writeFileSync(layoutPath, originalLayout);
    writeFileSync(charPath, originalChar);
    await waitForDevServerReady(baseURL);
    expect(readFileSync(layoutPath, 'utf8')).toBe(originalLayout);
    expect(readFileSync(charPath, 'utf8')).toBe(originalChar);
  }
});
