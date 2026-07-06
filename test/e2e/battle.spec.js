// Battle simulation (hardening spec §3): drive real fights through the real
// input code paths (__probe.play/endTurn wrap doPlay/onEndTurn), then assert
// two things after every beat:
//   1. zero console/page errors — drain() swallows playback exceptions into
//      console.error, so this channel is the ONLY place they surface;
//   2. the probe invariants — dead enemies leave the field AND release their
//      WebGL warp plane, and every HP/hand/energy/ember readout matches the
//      engine.
//
// NOTE: the mesh-on kill scenarios FAIL against the pre-fix code — the warp
// plane keeps rendering the corpse (hardening spec §2). The mesh-off twin
// passes, which pins the defect to the mesh lifecycle, not the DOM path.
import { test, expect } from '@playwright/test';
import {
  boot, startFight, settle, probeState, collectErrors,
  expectInvariants, expectNoErrors,
} from './helpers.js';

// correctness is viewport-independent; run the heavy scenarios once
test.beforeEach(() => {
  test.skip(test.info().project.name !== 'desktop', 'battle logic runs on the desktop project only');
});

// dying → gone happens on a 830ms timer after the death beat; give it room
const DEATH_LINGER = 1400;

test('opening state is coherent', async ({ page }) => {
  const errors = collectErrors(page);
  await boot(page);
  await startFight(page, ['sporeling', 'sporeling']);
  const st = await probeState(page);
  expect(st.screen).toBe('combat');
  // no content constants here — omens legitimately bend the opening rules
  // (e.g. Ember Wind draws 4). Coherence is the invariant set: every DOM
  // readout must match whatever the engine actually decided.
  expect(st.hand.length).toBeGreaterThan(0);
  expect(st.enemies.length).toBe(2);
  await expectInvariants(page, 'opening');
  expectNoErrors(errors, 'opening');
});

async function killFirstEnemy(page) {
  // three Edges (6 dmg each) beat a Sporeling's 13–17 HP roll with certainty
  const uids = await page.evaluate(() => {
    window.__probe.setEnergy(3);
    return window.__probe.forceHand(['strike', 'strike', 'strike']);
  });
  for (const uid of uids) {
    const played = await page.evaluate((u) => window.__probe.play(u, 0), uid);
    expect(played, `strike ${uid} should be playable`).toBe(true);
  }
  await settle(page);
  const st = await probeState(page);
  expect(st.enemies[0].hp, 'scenario validity: enemy 0 must be dead').toBeLessThanOrEqual(0);
  expect(st.over, 'scenario validity: the fight must continue').toBeFalsy();
}

// The warp layer binds two rAFs after combat renders; wait for real planes so
// a WebGL-less environment fails loudly instead of passing vacuously.
async function expectMeshLive(page) {
  await page.waitForFunction(() => window.spirebound.meshDebug().planes > 0, null, { timeout: 5000 })
    .catch(() => { throw new Error('mesh planes never bound — is WebGL unavailable in this environment?'); });
}

test('mid-fight kill leaves no corpse on stage (mesh on)', async ({ page }) => {
  const errors = collectErrors(page);
  await boot(page, { query: 'mesh=1' }); // force the warp layer regardless of environment
  await startFight(page, ['sporeling', 'sporeling']);
  await expectMeshLive(page);
  await killFirstEnemy(page);
  await page.waitForTimeout(DEATH_LINGER);
  await expectInvariants(page, 'after mesh-on kill');
  expectNoErrors(errors, 'after mesh-on kill');
});

test('mid-fight kill leaves no corpse on stage (mesh off)', async ({ page }) => {
  const errors = collectErrors(page);
  await boot(page, { query: 'mesh=0' });
  await startFight(page, ['sporeling', 'sporeling']);
  await killFirstEnemy(page);
  await page.waitForTimeout(DEATH_LINGER);
  await expectInvariants(page, 'after mesh-off kill');
  expectNoErrors(errors, 'after mesh-off kill');
});

test('smolder tick kill during the enemy phase', async ({ page }) => {
  const errors = collectErrors(page);
  await boot(page, { query: 'mesh=1' });
  await startFight(page, ['sporeling', 'sporeling']);
  await expectMeshLive(page);
  const uids = await page.evaluate(() => {
    window.__probe.setEnemyHp(0, 2); // 3 Smolder will tick it out on the enemy turn
    return window.__probe.forceHand(['toxicMist']);
  });
  expect(await page.evaluate((u) => window.__probe.play(u, null), uids[0])).toBe(true);
  await page.evaluate(() => window.__probe.endTurn());
  await settle(page);
  const st = await probeState(page);
  expect(st.enemies[0].hp, 'scenario validity: smolder must have killed enemy 0').toBeLessThanOrEqual(0);
  await page.waitForTimeout(DEATH_LINGER);
  await expectInvariants(page, 'after smolder death');
  expectNoErrors(errors, 'after smolder death');
});

test('boss death reaches the rewards screen with the world restored', async ({ page }) => {
  const errors = collectErrors(page);
  await boot(page);
  await startFight(page, ['rootheart'], 'boss');
  await page.evaluate(() => {
    window.__probe.setEnemyHp(0, 1);
    window.__probe.setEnergy(3);
  });
  const uids = await page.evaluate(() => window.__probe.forceHand(['strike']));
  expect(await page.evaluate((u) => window.__probe.play(u, 0), uids[0])).toBe(true);
  await settle(page);
  const st = await probeState(page);
  expect(st.screen, 'victory should land on the rewards screen').toBe('reward');
  await expect(page.locator('.ov-title')).toHaveText('BOSS VANQUISHED');
  // the worldstop death ceremony must hand the world back
  await expect(page.locator('body')).not.toHaveClass(/worldstop/, { timeout: 5000 });
  expectNoErrors(errors, 'boss death');
});

test('lantern art fires clean', async ({ page }) => {
  const errors = collectErrors(page);
  await boot(page);
  await startFight(page, ['sporeling', 'sporeling']);
  await page.evaluate(() => {
    window.spirebound.S.run.art = 'flare'; // 3 embers: 7 dmg + 2 Smolder to all
    window.__probe.setEmbers(9);
  });
  expect(await page.evaluate(() => window.__probe.useArt())).toBe(true);
  await settle(page);
  const st = await probeState(page);
  expect(st.embers, 'flare costs 3 embers').toBe(6);
  await expectInvariants(page, 'after lantern art');
  expectNoErrors(errors, 'after lantern art');
});

test('potion quaffed clean', async ({ page }) => {
  const errors = collectErrors(page);
  await boot(page);
  await startFight(page, ['sporeling']);
  await page.evaluate(() => window.spirebound.E.gainPotion(window.spirebound.S.run, 'fire'));
  // Stormglass Phial: 20 damage — beats a Sporeling's 13–17 HP roll with certainty
  expect(await page.evaluate(() => window.__probe.usePotion(0, 0))).toBe(true);
  await settle(page);
  expect((await probeState(page)).screen).toBe('reward');
  expectNoErrors(errors, 'after potion kill');
});

test('random-agent mini-run: three fights, zero playback errors', async ({ page }) => {
  test.setTimeout(240_000); // whole fights at real animation pacing
  const errors = collectErrors(page);
  await boot(page);
  const fights = [['sporeling', 'sporeling'], ['duskfang', 'sporeling'], ['gloomslime']];
  for (const ids of fights) {
    await startFight(page, ids);
    const outcome = await page.evaluate(async () => {
      const p = window.__probe;
      for (let turn = 0; turn < 40; turn++) {
        let st = p.state();
        if (st.screen !== 'combat' || st.over) break;
        // play everything playable, first card first, at the first living enemy
        let played = true;
        while (played) {
          st = p.state();
          if (st.screen !== 'combat' || st.over) break;
          played = false;
          const target = st.enemies.findIndex((e) => e.hp > 0);
          for (const c of st.hand) {
            if (await p.play(c.uid, target)) { played = true; break; }
          }
        }
        st = p.state();
        if (st.screen !== 'combat' || st.over) break;
        await p.endTurn();
      }
      return p.state();
    });
    // seeded, so the outcome is stable; the assertion that matters is that the
    // fight *ended* and nothing during playback threw
    expect(outcome.screen === 'combat' && !outcome.over, 'fight must reach a terminal state').toBe(false);
    expectNoErrors(errors, `mini-run fight vs ${ids.join('+')}`);
    if (outcome.result === 'loss' || outcome.screen === 'end') break; // the bot died honestly — errors were the point
    await page.evaluate(() => window.spirebound.show('map'));
  }
});
