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
import { test, expect } from './trace-fixture.js';
import {
  boot, startFight, settle, probeState, collectErrors,
  expectInvariants, expectNoErrors, recordTransientText, waitForTransientText,
} from './helpers.js';

// correctness is viewport-independent; run the heavy scenarios once
test.beforeEach(() => {
  test.skip(test.info().project.name !== 'desktop', 'battle logic runs on the desktop project only');
});

// dying → gone happens on a 830ms timer after the death beat; give it room
const DEATH_LINGER = 1400;

test('opening state is coherent', { tag: '@smoke' }, async ({ page }) => {
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

async function startShade(page, query) {
  await boot(page, { query });
  await page.evaluate(() => window.spirebound.startCombatUI(['ownShade1'], 'monster'));
  await settle(page);
}

test('variant tint and identity reach the live mesh', async ({ page }) => {
  const errors = collectErrors(page);
  await startShade(page, 'mesh=1');
  await expectMeshLive(page);
  const result = await page.evaluate(() => {
    const debug = window.spirebound.meshDebug();
    const tint = { hue: 35, saturation: 0.25 };
    return {
      enemy: window.__probe.state().enemies[0],
      mesh: debug.variants.find((v) => v.id === 'ownShade1'),
      neutralDim: debug.probeBodyColour({ rgb: [0.5, 0.5, 0.5], ...tint, brightness: 0.62 }),
      neutralFull: debug.probeBodyColour({ rgb: [0.5, 0.5, 0.5], ...tint, brightness: 1 }),
    };
  });
  expect(result.enemy).toMatchObject({ key: 'shade', variantId: 'ownShade1', artId: 'duskblade', maxHp: 110 });
  expect(result.mesh).toBeTruthy();
  expect(Math.abs(result.mesh.hue)).toBeGreaterThan(0.01);
  expect(result.mesh.saturation).toBeCloseTo(0.25, 5);
  const dimChannels = [result.neutralDim.r, result.neutralDim.g, result.neutralDim.b];
  expect(Math.max(...dimChannels) - Math.min(...dimChannels), 'neutral grey must remain chromatically neutral').toBeLessThanOrEqual(1);
  expect(result.neutralDim.a).toBe(255);
  expect(result.neutralDim.r, 'brightness alone should dim neutral grey').toBeLessThan(result.neutralFull.r);
  await expect(page.locator('.enemy[data-base-id="shade"][data-variant-id="ownShade1"][data-art-id="duskblade"]')).toHaveCount(1);
  await expectInvariants(page, 'shade mesh variant');
  expectNoErrors(errors, 'shade mesh variant');
});

test('variant CSS fallback matches mesh-off identity and stats', async ({ page }) => {
  const errors = collectErrors(page);
  await startShade(page, 'mesh=0');
  const enemy = await probeState(page).then((s) => s.enemies[0]);
  expect(enemy).toMatchObject({ key: 'shade', variantId: 'ownShade1', artId: 'duskblade', maxHp: 110 });
  await expect(page.locator('.enemy[data-variant-id="ownShade1"] .name')).toContainText('THE SHADE THAT FELL');
  const filter = await page.locator('.enemy[data-variant-id="ownShade1"] .enemy-sprite')
    .evaluate((el) => getComputedStyle(el).filter);
  expect(filter).not.toBe('none');
  expect((await page.evaluate(() => window.spirebound.meshDebug().planes))).toBe(0);
  await expectInvariants(page, 'shade CSS variant');
  expectNoErrors(errors, 'shade CSS variant');
});

test('Shade story fragment waits for defeat', async ({ page }) => {
  const errors = collectErrors(page);
  await boot(page, { query: 'mesh=0' });
  await recordTransientText(page);
  await page.evaluate(() => window.spirebound.startCombatUI(['ownShade1'], 'monster'));
  await settle(page);
  expect(await page.locator('.variant-dialogue, .turn-banner').count()).toBe(0);
  expect(await page.evaluate(() => window.__seenTransientText
    .some((text) => text.includes('I remember the stone')))).toBe(false);

  const uid = await page.evaluate(() => {
    window.__probe.setEnemyHp(0, 1);
    window.__probe.setEnergy(3);
    return window.__probe.forceHand(['strike'])[0];
  });
  await page.evaluate((cardUid) => window.__probe.play(cardUid, 0), uid);
  await waitForTransientText(page, 'I remember the stone');
  await settle(page);
  expect(await page.locator('.variant-dialogue, .turn-banner').count()).toBe(0);
  expectNoErrors(errors, 'Shade death fragment');
});

test('Pale combat banners disclose the 0/3 hunt before the Lens', async ({ page }) => {
  const errors = collectErrors(page);
  await boot(page, { query: 'mesh=0' });
  await recordTransientText(page);
  await page.evaluate(async () => {
    const { QUEST_IDS } = await import('/src/data.js');
    const quests = Object.fromEntries(QUEST_IDS.map((id) => [id, {
      state: id === 'paleOnes' ? 'armed' : 'dormant', progress: 0, memory: {},
    }]));
    const sp = window.spirebound;
    sp.S.run = sp.E.newRun(20260710, { quests, unlocks: [] });
    sp.startCombatUI(['paleDuskfang'], 'monster');
  });
  await waitForTransientText(page, 'Hunt the Pale Ones (0/3)');
  await settle(page);

  const uid = await page.evaluate(() => {
    window.__probe.setEnemyHp(0, 1);
    window.__probe.setEnergy(3);
    return window.__probe.forceHand(['strike'])[0];
  });
  await page.evaluate((cardUid) => window.__probe.play(cardUid, 0), uid);
  await waitForTransientText(page, 'Hunt the Pale Ones — 1/3');
  await settle(page);
  expectNoErrors(errors, 'Pale hunt disclosure');
});

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

const RANDOM_AGENT_FIGHTS = [
  { name: 'sporeling pair', ids: ['sporeling', 'sporeling'] },
  { name: 'duskfang and sporeling', ids: ['duskfang', 'sporeling'] },
  { name: 'gloomslime', ids: ['gloomslime'] },
];

for (const scenario of RANDOM_AGENT_FIGHTS) {
  test(`random-agent mini-run: ${scenario.name}`, async ({ page }) => {
    test.setTimeout(240_000); // a whole fight at real animation pacing
    const errors = collectErrors(page);
    await boot(page);
    await startFight(page, scenario.ids);
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
          const target = st.enemies.findIndex((enemy) => enemy.hp > 0);
          for (const card of st.hand) {
            if (await p.play(card.uid, target)) {
              played = true;
              break;
            }
          }
        }
        st = p.state();
        if (st.screen !== 'combat' || st.over) break;
        await p.endTurn();
      }
      return p.state();
    });
    // Seeded, so the outcome is stable; the contract is terminal playback with
    // no swallowed queue or page errors.
    expect(
      outcome.screen === 'combat' && !outcome.over,
      'fight must reach a terminal state',
    ).toBe(false);
    expectNoErrors(errors, `mini-run fight vs ${scenario.ids.join('+')}`);
  });
}
