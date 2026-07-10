// Authored ground-position contract (hardening spec §1, superseded 2026-07-09).
// One logical ground line still anchors combat, the painted ledge lip and the
// glow seam. Actor DOM boxes also compose intentional hero/slot lift plus the
// per-art footY correction for transparent raster padding. The ±2px gate
// therefore checks the authored art-box position, not a raw bottom==ground
// shortcut that would reject valid lifted formations and corrected sprites.
//
// NOTE: these tests are the executable form of the spec — they FAIL against
// the pre-fix code (enemies float ~100px above the ground line, the painted
// lip sits mid-air). Green means §1 is actually implemented.
import { test, expect } from '@playwright/test';
import { ASPECTS } from '../../src/data.js';
import { bfResolve, bfActor, bfSlots, bfEnemyFootX, bfEnemyFootY, bfHeroY } from '../../src/battlefield.js';
import { boot, startFight, stable, settle, collectErrors, expectNoErrors } from './helpers.js';

const FEET_TOL = 2; // ±stage px around the fully resolved authored art-box bottom
const LEDGE_LIP_MIN = 4, LEDGE_LIP_MAX = 64; // authored logical lip, not the alpha PNG box edge

// canon encounters, one per act (all enemies legal in any act for the engine)
const FIGHTS = [
  { act: 0, name: 'act 1 pair', ids: ['duskfang', 'sporeling'] },
  { act: 1, name: 'act 2 pair', ids: ['drownedOne', 'voltEel'] },
  { act: 2, name: 'act 3 single', ids: ['obsidianGolem'] },
  { act: 0, name: 'act 1 trio', ids: ['sporeling', 'sporeling', 'sporeling'] },
];

async function measure(page) {
  await page.waitForFunction(() => window.__probe?.geometry());
  const g = await page.evaluate(() => {
    const geometry = window.__probe.geometry();
    if (!geometry) return null;
    return {
      ...geometry,
      act: window.spirebound.S.run.act,
      aspect: window.spirebound.S.run.aspect,
      enemyLayoutKeys: window.spirebound.S.cb.enemies.map((en) => en.key),
    };
  });
  expect(g, 'probe.geometry() should measure a live combat').not.toBeNull();
  return g;
}

function assertGrounded(g, label) {
  const layout = bfResolve(g.stage.shape, g.act);
  const aspect = ASPECTS[g.aspect];
  expect(aspect, `${label}: live aspect exists`).toBeTruthy();
  const hero = bfActor('heroes', aspect.id);
  expect(g.heroArtBottom, `${label}: hero art bottom exists`).not.toBeNull();
  const heroExpectedBottom = g.groundY - bfHeroY(layout) - hero.footY;
  expect(Math.abs(g.heroArtBottom - heroExpectedBottom),
    `${label}: hero art box honours authored lift and foot correction (${g.heroArtBottom} vs ${heroExpectedBottom})`)
    .toBeLessThanOrEqual(FEET_TOL);
  const slots = bfSlots(layout, g.enemyLayoutKeys.length);
  g.enemyArtBottoms.forEach((bottom, i) => {
    if (bottom == null) return; // dead or missing — not this suite's concern
    const expectedBottom = g.groundY
      - (slots[i]?.y ?? 0)
      - bfEnemyFootY(slots[i], g.enemyLayoutKeys[i]);
    expect(Math.abs(bottom - expectedBottom),
      `${label}: enemy ${i} art box honours authored lift and foot correction (${bottom} vs ${expectedBottom})`)
      .toBeLessThanOrEqual(FEET_TOL);
  });
  if (g.slLedgeTop != null) {
    const ledge = layout.layers.ledge;
    const cssBottom = Math.max(0,
      layout.groundY + layout.ledgeLip - ledge.h + ledge.y);
    const expectedTop = g.stage.h - cssBottom - ledge.h * ledge.zoom;
    expect(Math.abs(g.slLedgeTop - expectedTop),
      `${label}: ledge box follows authored placement (${g.slLedgeTop} vs ${expectedTop})`)
      .toBeLessThanOrEqual(FEET_TOL);
    expect(layout.ledgeLip, `${label}: authored ledge lip has visible depth`)
      .toBeGreaterThanOrEqual(LEDGE_LIP_MIN);
    expect(layout.ledgeLip, `${label}: authored ledge lip stays a lip`)
      .toBeLessThanOrEqual(LEDGE_LIP_MAX);
    expect(g.slLedgeTop, `${label}: ledge box begins above the ground line`)
      .toBeLessThanOrEqual(g.groundY + FEET_TOL);
    expect(g.slLedgeTop + ledge.h * ledge.zoom,
      `${label}: ledge box covers the ground line`)
      .toBeGreaterThanOrEqual(g.groundY - FEET_TOL);
  }
  if (g.seamY != null) {
    expect(Math.abs(g.groundY - g.seamY),
      `${label}: logical glow seam stays on the ground line`)
      .toBeLessThanOrEqual(FEET_TOL);
  }
}

async function outsideStage(page, selector) {
  return page.evaluate((query) => {
    const stage = document.getElementById('stage').getBoundingClientRect();
    return [...document.querySelectorAll(query)]
      .filter((el) => {
        const r = el.getBoundingClientRect();
        if (r.width < 1 || r.height < 1) return false;
        return r.left < stage.left - 2 || r.right > stage.right + 2 ||
          r.top < stage.top - 2 || r.bottom > stage.bottom + 2;
      })
      .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).trim().split(/\s+/).join('.')}`);
  }, selector);
}

for (const fight of FIGHTS) {
  test(`combatant art boxes honour authored ground positions — ${fight.name}`, async ({ page }) => {
    const errors = collectErrors(page);
    await boot(page, { query: 'mesh=0' }); // geometry is a DOM contract; warp planes only echo it
    await page.evaluate((act) => { window.spirebound.S.run.act = act; }, fight.act);
    await startFight(page, fight.ids);
    await stable(page);
    assertGrounded(await measure(page), fight.name);
    expectNoErrors(errors, fight.name);
  });
}

test('authored ground positions survive a live resize', async ({ page }) => {
  test.skip(test.info().project.name !== 'desktop', 'window resizing is a desktop behaviour');
  await boot(page, { query: 'mesh=0' });
  await startFight(page, ['duskfang', 'sporeling']);
  await stable(page);
  assertGrounded(await measure(page), 'before resize');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForTimeout(400);
  assertGrounded(await measure(page), 'after resize to 1440x900');
});

for (const variant of [
  { id: 'paleDuskfang', act: 0 },
  { id: 'usurpedSovereign', act: 2 },
]) {
  test(`scaled variant keeps its feet and chrome inside the stage — ${variant.id}`, async ({ page }) => {
    const errors = collectErrors(page);
    await boot(page, { query: 'mesh=0' });
    await page.evaluate((act) => { window.spirebound.S.run.act = act; }, variant.act);
    if (variant.id === 'usurpedSovereign') {
      await page.evaluate(([id, kind]) => window.spirebound.startCombatUI([id], kind),
        [variant.id, 'boss']);
      await page.waitForSelector('.variant-dialogue', { state: 'visible' });
      expect(await outsideStage(page, '.variant-dialogue'),
        'variant dialogue stays visible and bounded during its real playback window').toEqual([]);
      await settle(page);
    } else {
      await startFight(page, [variant.id], 'monster');
    }
    await stable(page);
    const geometry = await measure(page);
    assertGrounded(geometry, variant.id);
    if (variant.id === 'usurpedSovereign' && test.info().project.name === 'portrait') {
      const layout = bfResolve(geometry.stage.shape, geometry.act);
      const [slot] = bfSlots(layout, 1);
      expect(bfEnemyFootX(slot, geometry.enemyLayoutKeys[0]),
        'portrait Usurper retains sovereign CHAR_META footX instead of a slot-wide zero override')
        .toBe(-100);
    }
    const outside = await outsideStage(page,
      '.hero-wrap,.enemy,.cplate,.top-chrome,.energy-orb,.lantern-btn,.end-turn,.pile-btn');
    expect(outside).toEqual([]);
    expectNoErrors(errors, variant.id);
  });
}

for (const actor of [
  { id: 'alphaFang', act: 0, kind: 'elite' },
  { id: 'gravewarden', act: 0, kind: 'elite' },
  { id: 'rootheart', act: 0, kind: 'boss' },
  { id: 'siren', act: 1, kind: 'elite' },
  { id: 'leviathan', act: 1, kind: 'boss' },
  { id: 'heraldOfEnd', act: 2, kind: 'elite' },
  { id: 'voidColossus', act: 2, kind: 'elite' },
  { id: 'sovereign', act: 2, kind: 'boss' },
]) {
  test(`canonical single-enemy frame stays grounded and stage-bounded — ${actor.id}`, async ({ page }) => {
    const errors = collectErrors(page);
    await boot(page, { query: 'mesh=0' });
    await page.evaluate((act) => { window.spirebound.S.run.act = act; }, actor.act);
    await startFight(page, [actor.id], actor.kind);
    await stable(page);
    const geometry = await measure(page);
    assertGrounded(geometry, actor.id);
    expect(await outsideStage(page, '.enemy,.enemy .cplate,.enemy .top-chrome')).toEqual([]);
    expectNoErrors(errors, actor.id);
  });
}
