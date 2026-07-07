// Battlefield editor smoke (desktop only — it is a desktop dev tool).
import { test, expect } from '@playwright/test';

async function waitForDevServerReady(timeoutMs = 10_000) {
  const deadline = Date.now() + timeoutMs;
  let lastError = null;
  while (Date.now() < deadline) {
    try {
      const response = await fetch('http://localhost:5174/');
      if (response.ok) {
        await new Promise((resolve) => setTimeout(resolve, 1_000));
        const settled = await fetch('http://localhost:5174/');
        if (settled.ok) return;
      }
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  throw new Error(`dev server did not settle after battlefield layout write: ${lastError?.message ?? 'not ready'}`);
}

test.beforeEach(({ }, testInfo) => {
  test.skip(!['desktop', 'bfeditor-disk'].includes(testInfo.project.name), 'editor is desktop-only');
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

test('clicking a box without dragging does not dirty the layout', async ({ page }) => {
  await page.goto('/?bfedit=1&mesh=0');
  await page.locator('.bf-box[data-bf="hero"]').click();
  await page.locator('.bf-box[data-bf="ground"]').click();
  await expect(page.locator('.bf-box[data-bf="ground"]')).toHaveClass(/bf-sel/);
  await expect(page.locator('#bf-dirty')).toHaveText('');
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

test('a hero drag locks to the axis of the first decisive move for the whole drag', async ({ page }) => {
  await page.goto('/?bfedit=1&mesh=0');
  const hero = page.locator('.bf-box[data-bf="hero"]');
  await hero.waitFor();
  const scale = await page.evaluate(() => window.__probe.stage().scale);
  const before = await page.evaluate(() => ({
    x: window.__bfEditor.resolved().hero.x,
    heroes: window.__bfEditor.working().shared.heroes,
  }));
  const box = await hero.boundingBox();
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  // phase 1: decisive horizontal move (12 stage px) locks the x axis
  await page.mouse.move(cx + 12 * scale, cy);
  // phase 2: strong vertical move — a per-event axis choice would see
  // |dy| > |dx| on these events and write footY; the per-drag lock must not
  await page.mouse.move(cx + 12 * scale, cy + 50 * scale, { steps: 5 });
  await page.mouse.up();
  const after = await page.evaluate(() => ({
    x: window.__bfEditor.resolved().hero.x,
    heroes: window.__bfEditor.working().shared.heroes,
  }));
  expect(after.x - before.x).toBe(12);
  expect(after.heroes).toEqual(before.heroes); // axis locked: footY untouched
});

test('pad-landscape (base shape) offers no shape scope for positional rows', async ({ page }) => {
  await page.goto('/?bfedit=1&mesh=0&shape=pad-landscape');
  await page.locator('.bf-box[data-bf="ground"]').click();
  const scopeSel = page.locator('#bf-panel select[data-scope="0"]'); // groundY row
  await expect(scopeSel.locator('option')).toHaveText(['base']);
  await expect(scopeSel).toBeDisabled();
});

test('/__bf-save rejects bodies over 1 MB with 413', async ({ page }) => {
  await page.goto('/?bfedit=1&mesh=0');
  const result = await page.evaluate(async () => {
    const r = await fetch('/__bf-save', { method: 'POST', body: 'x'.repeat(1_200_000) });
    return { status: r.status, json: await r.json() };
  });
  expect(result.status).toBe(413);
  expect(result.json).toEqual({ ok: false, problems: ['payload too large'] });
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

test('clearing a slot override restores the base formation intact', async ({ page }) => {
  await page.goto('/?bfedit=1&mesh=0');
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
  let payload = null;
  await page.route('**/__bf-save', async (route) => {
    payload = JSON.parse(route.request().postData());
    await route.fulfill({ json: { ok: true } });
  });
  await page.goto('/?bfedit=1&mesh=0');
  await page.locator('#bf-panel [data-select="layer-ledge"]').click();
  const input = page.locator('#bf-panel input[data-path="y"]');
  await input.fill('5');
  await input.press('Enter');
  await page.locator('#bf-save').click();
  await expect(page.locator('#bf-dirty')).toHaveText(/saved/);
  expect(payload.shapes['desktop-landscape'].layers.ledge.y).toBe(5);
});

test('Save writes layout to disk and reload picks it up', async ({ page }) => {
  test.skip(test.info().project.name !== 'bfeditor-disk', 'writes watched source; runs in the dedicated dependency project');
  const { readFileSync, writeFileSync } = await import('node:fs');
  const layoutPath = 'src/battlefield-layout.js';
  const orig = readFileSync(layoutPath, 'utf8');
  let originalBF = null;
  try {
    await page.goto('/?bfedit=1&mesh=0&shape=pad-landscape');
    await page.waitForFunction(() => window.__bfEditor);
    originalBF = await page.evaluate(() => window.__bfEditor.working());
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
    if (originalBF) {
      try {
        await page.evaluate(async (bf) => {
          const r = await fetch('/__bf-save', { method: 'POST', body: JSON.stringify(bf) });
          const j = await r.json();
          if (!j.ok) throw new Error((j.problems ?? ['restore failed']).join('\n'));
        }, originalBF);
      } catch {
        writeFileSync(layoutPath, orig);
      }
    } else {
      writeFileSync(layoutPath, orig);
    }
    await waitForDevServerReady();
  }
});
