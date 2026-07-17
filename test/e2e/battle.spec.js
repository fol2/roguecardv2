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
  inventoryCombatDom,
} from './helpers.js';
import { snapStage } from '../../src/ui/widgets.js';
import { bfResolve, bfSlots } from '../../src/battlefield.js';

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

test('boss encounters resolve boss plate ids; normal fights keep act plates', async ({ page }) => {
  const errors = collectErrors(page);
  await boot(page);

  await startFight(page, ['rootheart'], 'boss');
  let plates = await page.evaluate(() => ({
    backdrop: document.querySelector('.sl-backdrop')?.dataset.plateId || null,
    mid: document.querySelector('.sl-mid')?.dataset.plateId || null,
    ledge: document.querySelector('.sl-ledge')?.dataset.plateId || null,
  }));
  expect(plates).toEqual({
    backdrop: 'rootheart-backdrop',
    mid: 'rootheart-mid',
    ledge: 'rootheart-ledge',
  });

  await startFight(page, ['duskfang'], 'normal');
  plates = await page.evaluate(() => ({
    backdrop: document.querySelector('.sl-backdrop')?.dataset.plateId || null,
    mid: document.querySelector('.sl-mid')?.dataset.plateId || null,
    ledge: document.querySelector('.sl-ledge')?.dataset.plateId || null,
  }));
  expect(plates).toEqual({
    backdrop: 'act1-backdrop',
    mid: 'act1-mid',
    ledge: 'act1-ledge',
  });

  // Deliberately absent boss override on a boss fight → act-standard plates.
  await page.evaluate(() => {
    const theme = window.spirebound.S.run
      ? window.spirebound.themeForRun?.(window.spirebound.S.run)
      : null;
    // Force an unknown boss id through startCombatUI with a boss kind but no override key.
    window.spirebound.startCombatUI(['duskfang'], 'boss');
  });
  await settle(page);
  plates = await page.evaluate(() => ({
    backdrop: document.querySelector('.sl-backdrop')?.dataset.plateId || null,
    mid: document.querySelector('.sl-mid')?.dataset.plateId || null,
    ledge: document.querySelector('.sl-ledge')?.dataset.plateId || null,
    kind: window.spirebound.S.cb?.kind,
    bossKey: window.spirebound.S.cb?.enemies?.[0]?.key,
  }));
  expect(plates.kind).toBe('boss');
  expect(plates.bossKey).toBe('duskfang');
  expect(plates.backdrop).toBe('act1-backdrop');
  expect(plates.mid).toBe('act1-mid');
  expect(plates.ledge).toBe('act1-ledge');
  expectNoErrors(errors, 'boss plate resolution');
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

// ---- Task 29: P5 combat DOM allowed-list + PR17 geometry via Pixi readUI ----

test('P5 combat DOM stays on the allowed-list', async ({ page }) => {
  const errors = collectErrors(page);
  await boot(page, { query: 'mesh=0' });
  await startFight(page, ['duskfang', 'sporeling']);
  await settle(page);

  const inventory = await inventoryCombatDom(page);
  expect(inventory.screen).toBe('combat');
  expect(inventory.mounts.uigl).toBe(true);
  expect(inventory.mounts.vfx).toBe(true);
  expect(inventory.mounts.tooltip).toBe(true);
  expect(inventory.emptyHosts.floaties, '#floaties must be empty during combat').toBe(0);
  expect(inventory.emptyHosts.aim, '#aim must be empty during combat').toBe(0);
  expect(inventory.emptyHosts.handZone, '.hand-zone stays an empty structural host').toBe(0);
  for (const [sel, n] of Object.entries(inventory.forbidden)) {
    expect(n, `forbidden combat selector ${sel}`).toBe(0);
  }
  expect(inventory.unexpected, `unexpected combat DOM: ${JSON.stringify(inventory.unexpected)}`).toEqual([]);
  expect(inventory.ok).toBe(true);
  expectNoErrors(errors, 'P5 DOM allowed-list');
});

test('PR17 geometry is readable from probe.ui / Pixi readUI', async ({ page }) => {
  const errors = collectErrors(page);
  await boot(page, { query: 'mesh=0&shape=desktop-landscape' });
  await page.evaluate(() => { window.spirebound.S.run.act = 0; });
  await startFight(page, ['duskfang', 'duskfang']);
  await settle(page);

  const authored = bfSlots(bfResolve('desktop-landscape', 0), 2).map((s) => s.x);
  expect(authored).toEqual([1000, 1197]);

  const geom = await page.evaluate(() => {
    const ui = window.__probe.ui();
    const read = window.spirebound.combatGl.readUI();
    const enemies = read?.enemies || [];
    const plates = read?.plates?.enemies || [];
    const drifts = enemies.map((e, i) => {
      const art = e?.artBounds || e?.bounds;
      const plate = plates[i]?.plateBounds || e?.plateBounds;
      if (!art || !plate) return null;
      const artCx = (art.left + art.right) / 2;
      const plateCx = (plate.left + plate.right) / 2;
      const visible = plates[i]?.visibleBounds || plate;
      return {
        artCx,
        plateCx,
        drift: Math.abs(plateCx - artCx),
        overlaps: plate.left < art.right && art.left < plate.right,
        plate,
        visible,
      };
    }).filter(Boolean);
    const gaps = [];
    for (let i = 0; i < drifts.length - 1; i += 1) {
      const a = drifts[i].visible;
      const b = drifts[i + 1].visible;
      gaps.push(b.left - a.right);
    }
    const cf = read?.candleFrame;
    const resolution = Number(window.spirebound.pixi?.application?.()?.renderer?.resolution)
      || ((window.devicePixelRatio || 1) * (window.__probe.stage().scale || 1));
    return {
      uiVersion: ui?.version ?? null,
      kind: ui?.renderer?.kind ?? null,
      source: read?.plates ? 'readUI' : null,
      handLen: ui?.hand?.length ?? 0,
      drifts,
      gaps,
      candleW: cf?.bounds?.width ?? null,
      candleSlots: cf?.slots?.length ?? 0,
      restingFloor: read?.restingHandFloor ?? null,
      resolution,
      shape: window.__probe.stage().shape,
    };
  });

  expect(geom.uiVersion).toBe(2);
  expect(geom.kind).toBe('pixi');
  expect(geom.source).toBe('readUI');
  expect(geom.shape).toBe('desktop-landscape');
  expect(geom.handLen).toBeGreaterThan(0);
  expect(geom.drifts.length).toBe(2);
  // Exact desktop pair anchors (PR17 / battlefield-layout.js).
  expect(Math.round(geom.drifts[0].artCx), 'desktop pair anchor 0').toBe(1000);
  expect(Math.round(geom.drifts[1].artCx), 'desktop pair anchor 1').toBe(1197);
  for (const d of geom.drifts) {
    expect(d.overlaps, 'plate overlaps own art').toBe(true);
    expect(d.drift, 'desktop pair drift ≤80').toBeLessThanOrEqual(80);
  }
  // Minimal-displacement 6-gap packing between adjacent visible chrome.
  for (const gap of geom.gaps) {
    expect(gap, '6-gap packing between adjacent plates').toBeGreaterThanOrEqual(6);
  }
  expect(geom.candleW, 'desktop-landscape candle frame').toBe(snapStage(120, geom.resolution));
  expect(geom.candleSlots).toBeGreaterThanOrEqual(3);

  // General 90-drift case (trio) via the same readUI seam.
  await page.evaluate(async () => {
    window.spirebound.startCombatUI(['sporeling', 'sporeling', 'sporeling'], 'normal');
    await window.__probe.settle();
  });
  const trio = await page.evaluate(() => {
    const read = window.spirebound.combatGl.readUI();
    return (read?.enemies || []).map((e, i) => {
      const art = e?.artBounds;
      const plate = read?.plates?.enemies?.[i]?.plateBounds || e?.plateBounds;
      if (!art || !plate) return null;
      return Math.abs(((plate.left + plate.right) / 2) - ((art.left + art.right) / 2));
    }).filter((n) => n != null);
  });
  expect(trio.length).toBe(3);
  for (const drift of trio) {
    expect(drift, 'general formation drift ≤90').toBeLessThanOrEqual(90);
  }

  // Restore dual-foe for hover / dead-member checks.
  await page.evaluate(async () => {
    window.spirebound.startCombatUI(['duskfang', 'duskfang'], 'normal');
    await window.__probe.settle();
  });

  // Hover must not yank plate floor (≤1 stage px).
  const before = await page.evaluate(() => {
    const plates = window.spirebound.combatGl.readUI()?.plates?.enemies || [];
    return plates.map((p) => p.plateBounds?.top ?? null);
  });
  const seat = await page.evaluate(() => {
    const card = window.__probe.ui().hand[0];
    return card?.seatBounds || card?.bounds || null;
  });
  expect(seat).toBeTruthy();
  const from = await page.evaluate((bounds) => {
    const info = window.__probe.stage();
    const stage = document.getElementById('stage').getBoundingClientRect();
    return {
      x: stage.left + ((bounds.left + bounds.right) / 2) * info.scale,
      y: stage.top + ((bounds.top + bounds.bottom) / 2) * info.scale,
    };
  }, seat);
  await page.mouse.move(from.x, from.y);
  await page.waitForFunction(() => window.__probe.ui().hand.some((c) => c.hovered));
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  const after = await page.evaluate(() => {
    const plates = window.spirebound.combatGl.readUI()?.plates?.enemies || [];
    return plates.map((p) => p.plateBounds?.top ?? null);
  });
  expect(after.length).toBe(before.length);
  before.forEach((top, i) => {
    expect(Math.abs((after[i] ?? 0) - (top ?? 0)), `plate ${i} floor on hover`).toBeLessThanOrEqual(1);
  });

  // Dead-member stability: kill first foe; survivors stay put.
  const beforeKill = await page.evaluate(() => {
    const plates = window.spirebound.combatGl.readUI()?.plates?.enemies || [];
    return plates.map((p) => ({ left: p.plateBounds?.left, right: p.plateBounds?.right }));
  });
  await page.evaluate(async () => {
    window.__probe.setEnemyHp(0, 1);
    window.__probe.setEnergy(3);
    const [uid] = window.__probe.forceHand(['strike']);
    await window.__probe.play(uid, 0);
  });
  await settle(page);
  await page.waitForTimeout(1400);
  const afterKill = await page.evaluate(() => {
    const plates = window.spirebound.combatGl.readUI()?.plates?.enemies || [];
    return plates.map((p) => ({ left: p.plateBounds?.left, right: p.plateBounds?.right }));
  });
  if (afterKill.length > 1 && beforeKill.length > 1) {
    // 3px, not 1: plateBounds passes through snapRect(rect, resolution), and a
    // resolution re-snap under runner load shifts every plate ~1-2px with no
    // reflow (observed 1.82px). A real formation reflow moves survivors by
    // tens of px, so this still fails loudly on the regression it guards.
    expect(Math.abs((afterKill[1].left ?? 0) - (beforeKill[1].left ?? 0))).toBeLessThanOrEqual(3);
    expect(Math.abs((afterKill[1].right ?? 0) - (beforeKill[1].right ?? 0))).toBeLessThanOrEqual(3);
  }
  expectNoErrors(errors, 'PR17 via readUI');
});

test('authored candle frames across five stage shapes', async ({ page }) => {
  test.skip(test.info().project.name !== 'desktop', 'shape sweep forces ?shape= on desktop');
  const expected = {
    'desktop-landscape': 120,
    'pad-landscape': 120,
    'pad-portrait': 102,
    'phone-portrait': 84,
    'phone-landscape': 72,
  };
  for (const [shape, frameW] of Object.entries(expected)) {
    await page.goto(`/?shape=${shape}&mesh=0`);
    await page.waitForFunction(() => window.spirebound?.pixi?.status() === 'ready', null, {
      timeout: 15_000,
    });
    const measured = await page.evaluate(async () => {
      window.spirebound.S.run = window.spirebound.E.newRun(20260706, { aspect: 0 });
      window.spirebound.startCombatUI(['duskfang'], 'normal');
      await window.__probe.settle();
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      const cf = window.spirebound.combatGl?.readUI?.()?.candleFrame;
      const centres = (cf?.slots || []).map((s) => (s.bounds.left + s.bounds.right) / 2);
      const pitches = centres.slice(1).map((cx, i) => cx - centres[i]);
      const resolution = Number(window.spirebound.pixi?.application?.()?.renderer?.resolution)
        || ((window.devicePixelRatio || 1) * (window.__probe.stage().scale || 1));
      return {
        shape: window.__probe.stage().shape,
        frameW: cf?.bounds?.width ?? null,
        n: cf?.slots?.length ?? 0,
        avgPitch: pitches.length ? pitches.reduce((a, b) => a + b, 0) / pitches.length : 0,
        resolution,
      };
    });
    expect(measured.shape).toBe(shape);
    expect(measured.frameW, `${shape} candle frame`).toBe(snapStage(frameW, measured.resolution));
    // Grow slots → pitch compresses inside the fixed frame.
    await page.evaluate(() => {
      const P = window.spirebound.S.cb.player;
      P.energyMax = 5;
      window.__probe.setEnergy(5);
    });
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
    const grown = await page.evaluate(() => {
      const cf = window.spirebound.combatGl?.readUI?.()?.candleFrame;
      const centres = (cf?.slots || []).map((s) => (s.bounds.left + s.bounds.right) / 2);
      const pitches = centres.slice(1).map((cx, i) => cx - centres[i]);
      const resolution = Number(window.spirebound.pixi?.application?.()?.renderer?.resolution)
        || ((window.devicePixelRatio || 1) * (window.__probe.stage().scale || 1));
      return {
        frameW: cf?.bounds?.width ?? null,
        n: cf?.slots?.length ?? 0,
        avgPitch: pitches.length ? pitches.reduce((a, b) => a + b, 0) / pitches.length : 0,
        resolution,
      };
    });
    expect(grown.frameW).toBe(snapStage(frameW, grown.resolution));
    expect(grown.n).toBe(5);
    expect(grown.avgPitch).toBeLessThan(measured.avgPitch - 1);
  }
});
