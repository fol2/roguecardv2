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
import { boot, startFight, stable, freeze, settle, expectScreenshot } from './helpers.js';
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

async function shoot(page, name, suiteKey = 'legacy') {
  await stable(page);
  await freeze(page);
  await expectScreenshot(page, name, suiteKey);
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
    // Task 29 — combat ceremonies own Pixi; #floaties must stay empty in combat.
    const floaties = await page.evaluate(() => document.querySelectorAll('#floaties > *').length);
    if (floaties !== 0) {
      throw new Error(`combat floaties must be empty after Task 29 (found ${floaties})`);
    }
    await shoot(page, `combat-act${act + 1}`, 'p5Cards');
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
  test.setTimeout(120_000);
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

// Task 34 — deterministic visual cases for remaining P6 screens.
// Cases are registered now; baselines are deferred to Task 37.
const P6_VISUAL_SHAPES = [
  'phone-portrait', 'phone-landscape', 'pad-portrait', 'pad-landscape', 'desktop-landscape',
];

const P6_VISUAL_CASES = [
  { family: 'title', profiles: ['fresh', 'grown'] },
  { family: 'embark', profiles: ['fresh', 'grown'] },
  { family: 'fall', profiles: ['fresh', 'grown'] },
  { family: 'dawn', profiles: ['fresh', 'grown'] },
  { family: 'rewards', profiles: ['fresh', 'grown'] },
  { family: 'boss-relic', profiles: ['fresh', 'grown'] },
  { family: 'rest', profiles: ['fresh', 'grown'] },
  { family: 'treasure', profiles: ['fresh', 'grown'] },
  { family: 'lamplighter', profiles: ['fresh', 'grown'] },
  { family: 'hollow', profiles: ['fresh', 'grown'] },
  { family: 'vigil', profiles: ['fresh', 'grown'] },
  { family: 'map', profiles: ['fresh', 'grown'] },
];

function shapeForCase(family, profile) {
  const idx = (P6_VISUAL_CASES.findIndex((row) => row.family === family) * 2
    + (profile === 'grown' ? 1 : 0)) % P6_VISUAL_SHAPES.length;
  return P6_VISUAL_SHAPES[idx];
}

for (const row of P6_VISUAL_CASES) {
  for (const profile of row.profiles) {
    const shape = shapeForCase(row.family, profile);
    test(`p6 ${row.family} ${profile} (${shape})`, async ({ page }) => {
      test.skip(test.info().project.name !== 'desktop', 'p6 visual matrix forces ?shape= on desktop');
      // Task 37 owns baseline creation — register the case only.
      test.info().annotations.push({
        type: 'p6-visual-pending-baseline',
        description: `${row.family}:${profile}:${shape}`,
      });
      await page.addInitScript((value) => {
        localStorage.removeItem('spirebound_save_v2');
        localStorage.setItem('spirebound_vigil_v2', JSON.stringify(value));
      }, profile === 'fresh'
        ? {
          v: 2,
          deeds: {
            runs: 0, wins: 0, slain: 0, shatters: 0, kindles: 0, perfects: 0,
            smolderKills: 0, unlitVisited: 0, embersSpent: 0, bestVow: 0, bestFloor: 0,
          },
          unlocks: [], vowUnlocked: 0, lastFall: null,
          runsPlayed: 0, quests: {}, shards: [], whispers: 0, news: false,
        }
        : {
          v: 2,
          deeds: {
            runs: 12, wins: 3, slain: 40, shatters: 4, kindles: 2, perfects: 1,
            smolderKills: 2, unlitVisited: 1, embersSpent: 20, bestVow: 2, bestFloor: 18,
          },
          unlocks: ['aspect2'], vowUnlocked: 2, lastFall: null,
          runsPlayed: 12, quests: {}, shards: ['usurper'], whispers: 2, news: true,
        });
      await page.goto(`/?shape=${shape}&mesh=0&trace=1`);
      await page.waitForFunction(() => window.spirebound && window.__probe);
      await page.waitForFunction(() => {
        const records = window.__probe?.behaviourTrace?.()?.records;
        if (records?.some((record) => record.eventName === 'app.ready')) return true;
        return window.spirebound?.S?.screen === 'title'
          && !!document.querySelector('.r5-title');
      });
      await page.evaluate(([family, grown]) => {
        const sp = window.spirebound;
        const run = sp.E.newRun(3600 + family.length, {
          reveals: grown ? ['phials', 'omens', 'emberglass', 'lamplighter', 'act4'] : [],
          shards: grown ? ['usurper'] : [],
        });
        sp.S.run = run;
        if (family === 'title') { sp.show('title'); return; }
        if (family === 'embark') { sp.show('embark'); return; }
        if (family === 'fall') {
          run.pendingRunEnd = { outcome: 'death' };
          sp.show('end', {
            won: false, offers: [], fallAct: 1, fallRow: 3, unpaidBequest: false,
            ledger: { whisper: 'The stone keeps the climb.' },
          });
          return;
        }
        if (family === 'dawn') {
          run.pendingRunEnd = { outcome: 'win' };
          sp.E.stagePendingDawn?.(run, [{ t: 'whisper', text: 'The climb continues.' }], []);
          sp.show('end', { won: true });
          return;
        }
        if (family === 'rewards') {
          run.pendingReward = {
            kind: 'normal',
            rewards: { gold: 20, cards: ['strike', 'defend', 'chisel'], potion: null, relic: null },
            taken: {}, perfect: false,
          };
          sp.show('reward');
          return;
        }
        if (family === 'boss-relic') {
          sp.show('bossRelic');
          return;
        }
        if (family === 'rest') { sp.show('rest'); return; }
        if (family === 'treasure') { sp.show('treasure'); return; }
        if (family === 'lamplighter') { sp.S.lamp = null; sp.show('lamplighter'); return; }
        if (family === 'hollow') {
          run.map = sp.E.genMap(run);
          const node = run.map.nodes[1] || run.map.nodes[0];
          run.pendingHollow = { nodeId: node.id, paid: false, deferred: false, answer: null };
          sp.show('hollow');
          return;
        }
        if (family === 'vigil') { sp.show('vigil'); return; }
        if (family === 'map') { sp.show('map'); return; }
      }, [row.family, profile === 'grown']);
      await settle(page);
      // Do not create baselines here — Task 37 owner gate.
      await stable(page);
      await freeze(page);
    });
  }
}
