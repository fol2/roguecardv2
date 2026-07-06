// Screenshot regression (hardening spec §3). Determinism comes from three
// legs: a fixed seed (runs/maps/encounters/rewards), __probe.freeze() (pauses
// CSS animation, stops the vfx/rig loops, pins the 3D scene to a fixed
// timestamp and hides the inherently nondeterministic canvases), and ?mesh=0
// for combat (the warp layer hides the DOM art it mirrors).
//
// BASELINES ARE DELIBERATELY NOT COMMITTED until the §1 geometry and §2 mesh
// fixes land — a baseline of a broken stage would enshrine the bug. Capture
// them with `npm run test:e2e:update` once geometry.spec and battle.spec are
// green, then commit the -snapshots folders.
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { test } from '@playwright/test';
import { boot, startFight, stable, freeze } from './helpers.js';

const SNAP_DIR = fileURLToPath(new URL('./visual.spec.js-snapshots', import.meta.url));
test.beforeEach(() => {
  test.skip(!fs.existsSync(SNAP_DIR),
    'no committed baselines yet — run `npm run test:e2e:update` after the geometry/mesh fixes land');
});

async function shoot(page, name) {
  await stable(page);
  await freeze(page);
  await test.expect(page).toHaveScreenshot(`${name}.png`);
}

test('title screen', async ({ page }) => {
  await boot(page, { query: 'mesh=0' });
  await shoot(page, 'title');
});

test('map screen', async ({ page }) => {
  await boot(page, { query: 'mesh=0' });
  await page.evaluate(() => window.spirebound.show('map'));
  // let the tower camera finish its dolly before pinning the projection
  await page.waitForTimeout(2800);
  await shoot(page, 'map');
});

for (const [act, ids] of [[0, ['duskfang', 'sporeling']], [1, ['drownedOne', 'voltEel']], [2, ['obsidianGolem']]]) {
  test(`combat act ${act + 1}`, async ({ page }) => {
    await boot(page, { query: 'mesh=0' });
    await page.evaluate((a) => { window.spirebound.S.run.act = a; }, act);
    await startFight(page, ids);
    await shoot(page, `combat-act${act + 1}`);
  });
}

test('reward screen', async ({ page }) => {
  await boot(page, { query: 'mesh=0' });
  await startFight(page, ['sporeling']);
  await page.evaluate(async () => {
    window.__probe.setEnemyHp(0, 1);
    const [uid] = window.__probe.forceHand(['strike']);
    await window.__probe.play(uid, 0);
  });
  await shoot(page, 'reward');
});

for (const screen of ['shop', 'rest', 'treasure']) {
  test(`${screen} screen`, async ({ page }) => {
    await boot(page, { query: 'mesh=0' });
    await page.evaluate((s) => window.spirebound.show(s), screen);
    await shoot(page, screen);
  });
}

test('event screen', async ({ page }) => {
  await boot(page, { query: 'mesh=0' });
  await page.evaluate(() => {
    const sp = window.spirebound;
    sp.show('event', sp.E.rollEvent(sp.S.run));
  });
  await shoot(page, 'event');
});
