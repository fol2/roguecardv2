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
import { bfResolve, bfActor, bfSlots, bfEnemyFootY, bfHeroY } from '../../src/battlefield.js';
import { boot, startFight, stable, collectErrors, expectNoErrors } from './helpers.js';

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
