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
import { boot, startFight, stable, freeze, settle } from './helpers.js';
import { mixedLedger, completeLedger, seed } from './emberglass-fixtures.js';

const SNAP_DIR = fileURLToPath(new URL('./visual.spec.js-snapshots', import.meta.url));
test.beforeEach(({}, testInfo) => {
  const updating = testInfo.config.updateSnapshots !== 'none';
  test.skip(!fs.existsSync(SNAP_DIR) && !updating,
    'no committed baselines yet — run `npm run test:e2e:update` after the geometry/mesh fixes land');
});

const MAP_SETTLE_QUIET_MS = 800;
const MAP_SETTLE_QUIET_FRAMES = 20;
const MAP_SETTLE_TIMEOUT_MS = 90_000;

/** Wait for the map dolly's roll-invariant distance/focus signal to settle. */
async function showMapAndWaitSettled(page) {
  await page.evaluate(() => {
    window.__visualMapSettle = {
      initial: null,
      last: null,
      moved: false,
      quietSince: 0,
      quietFrames: 0,
      samples: 0,
      changes: 0,
    };
    window.spirebound.show('map');
  });
  try {
    await page.waitForFunction(({ quietMs, quietFrames }) => {
      const nodes = [...document.querySelectorAll('.mnode')];
      const edges = [...document.querySelectorAll('.medge')];
      const values = nodes.map((node) => {
        const transform = node.getAttribute('transform') || '';
        const scale = transform.match(/scale\(([^)]+)\)/)?.[1];
        return scale && node.style.opacity ? `${scale}|${node.style.opacity}` : null;
      });
      const edgeOpacities = edges.map((edge) => edge.style.opacity || null);
      if (!values.length || values.some((value) => !value) || edgeOpacities.some((value) => !value)) {
        return false;
      }
      const current = [...values, ...edgeOpacities].join(';');
      const state = window.__visualMapSettle;
      const now = performance.now();
      state.samples += 1;
      if (state.initial == null) {
        state.initial = current;
        state.last = current;
        state.quietSince = now;
        return false;
      }
      if (current !== state.last) {
        state.changes += 1;
        state.moved ||= current !== state.initial;
        state.last = current;
        state.quietSince = now;
        state.quietFrames = 0;
        return false;
      }
      state.quietFrames += 1;
      return state.moved
        && state.quietFrames >= quietFrames
        && now - state.quietSince >= quietMs;
    }, {
      quietMs: MAP_SETTLE_QUIET_MS,
      quietFrames: MAP_SETTLE_QUIET_FRAMES,
    }, { polling: 'raf', timeout: MAP_SETTLE_TIMEOUT_MS });
  } catch (error) {
    const diagnostic = await page.evaluate(() => {
      const state = window.__visualMapSettle;
      if (!state) return null;
      return {
        moved: state.moved,
        samples: state.samples,
        changes: state.changes,
        quietFrames: state.quietFrames,
        quietAgeMs: state.quietSince
          ? Math.round(performance.now() - state.quietSince)
          : null,
        initialMatchesLast: state.initial == null ? null : state.initial === state.last,
        nodeCount: document.querySelectorAll('.mnode').length,
        edgeCount: document.querySelectorAll('.medge').length,
      };
    }).catch(() => null);
    throw new Error(`map settle failed: ${error.message}; state=${JSON.stringify(diagnostic)}`, { cause: error });
  } finally {
    await page.evaluate(() => { delete window.__visualMapSettle; }).catch(() => {});
  }
}

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
  test.setTimeout(120_000);
  await boot(page, { query: 'mesh=0' });
  await showMapAndWaitSettled(page);
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
  await settle(page);
  await shoot(page, 'reward');
});

for (const screen of ['shop', 'rest', 'treasure', 'embark', 'vigil']) {
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

test('title with Emberglass medallion', async ({ page }) => {
  await seed(page, mixedLedger());
  await page.waitForSelector('.title-rose-medallion[data-a="rose"]');
  await shoot(page, 'title-emberglass');
});

test('Rose Window with mixed disclosure states', async ({ page }) => {
  const v = mixedLedger();
  v.whispers = 12;
  await seed(page, v);
  await page.click('[data-a="vigil"]');
  await page.click('[data-a="tab-rose"]');
  await page.waitForSelector('.rose-window.ready');
  await shoot(page, 'rose-window');
});

test('Rose Window fallback with mixed disclosure states', async ({ page }) => {
  const v = mixedLedger();
  v.whispers = 12;
  await seed(page, v);
  await page.evaluate(() => { window.__probe.forceRoseFallback(true); });
  await page.click('[data-a="vigil"]');
  await page.click('[data-a="tab-rose"]');
  await page.waitForSelector('.rose-window.rose-fallback');
  await shoot(page, 'rose-window-fallback');
});

test('sealed summit promise', async ({ page }) => {
  const v = completeLedger();
  await seed(page, v);
  await page.evaluate(() => {
    const sp = window.spirebound;
    const vigil = JSON.parse(localStorage.getItem('spirebound_vigil_v2'));
    sp.S.run = sp.E.newRun(7100, {
      reveals: ['omens', 'phials', 'poolWave2', 'poolWave3', 'poolFull', 'emberglass', 'act4'],
      quests: vigil.quests, shards: vigil.shards,
    });
    sp.S.run.act = 2;
    sp.S.run.map = sp.E.genMap(sp.S.run);
  });
  await showMapAndWaitSettled(page);
  // This case verifies the promise panel's pixels, while emberglass.spec.js
  // owns pointer/touch actionability. Freeze the projected tower first so
  // Playwright is not waiting for a continuously camera-tracked button to
  // satisfy its two-frame stability heuristic on slower snapshot hosts.
  await freeze(page);
  await page.click('[data-a="sealed-door"]');
  await page.waitForSelector('.sealed-door-panel');
  await shoot(page, 'sealed-door');
});
