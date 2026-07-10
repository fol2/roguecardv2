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

const SNAP_DIR = fileURLToPath(new URL('./visual.spec.js-snapshots', import.meta.url));
test.beforeEach(({}, testInfo) => {
  const updating = testInfo.config.updateSnapshots !== 'none';
  test.skip(!fs.existsSync(SNAP_DIR) && !updating,
    'no committed baselines yet — run `npm run test:e2e:update` after the geometry/mesh fixes land');
});

const MAP_SETTLE_QUIET_MS = 800;
const MAP_SETTLE_QUIET_FRAMES = 20;
const MAP_SETTLE_TIMEOUT_MS = 60_000;

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
