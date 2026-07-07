// Ground-line contract (hardening spec §1). One ground line per viewport:
// the battlefield's bottom edge. Hero feet, enemy feet, the painted ledge lip
// and the glow seam must all relate to it, at every breakpoint and act.
//
// NOTE: these tests are the executable form of the spec — they FAIL against
// the pre-fix code (enemies float ~100px above the ground line, the painted
// lip sits mid-air). Green means §1 is actually implemented.
import { test, expect } from '@playwright/test';
import { boot, startFight, stable, collectErrors, expectNoErrors } from './helpers.js';

const FEET_TOL = 2; // ±px between art bottom and ground line
const LIP_MIN = 4, LIP_MAX = 64; // painted ledge top sits this far above the ground

// canon encounters, one per act (all enemies legal in any act for the engine)
const FIGHTS = [
  { act: 0, name: 'act 1 pair', ids: ['duskfang', 'sporeling'] },
  { act: 1, name: 'act 2 pair', ids: ['drownedOne', 'voltEel'] },
  { act: 2, name: 'act 3 single', ids: ['obsidianGolem'] },
  { act: 0, name: 'act 1 trio', ids: ['sporeling', 'sporeling', 'sporeling'] },
];

async function measure(page) {
  await page.waitForFunction(() => window.__probe?.geometry());
  const g = await page.evaluate(() => window.__probe.geometry());
  expect(g, 'probe.geometry() should measure a live combat').not.toBeNull();
  return g;
}

function assertGrounded(g, label) {
  expect(g.heroArtBottom, `${label}: hero art bottom exists`).not.toBeNull();
  expect(Math.abs(g.heroArtBottom - g.groundY),
    `${label}: hero feet on the ground line (hero ${g.heroArtBottom} vs ground ${g.groundY})`)
    .toBeLessThanOrEqual(FEET_TOL);
  g.enemyArtBottoms.forEach((b, i) => {
    if (b == null) return; // dead or missing — not this suite's concern
    expect(Math.abs(b - g.groundY),
      `${label}: enemy ${i} feet on the ground line (enemy ${b} vs ground ${g.groundY})`)
      .toBeLessThanOrEqual(FEET_TOL);
  });
  if (g.slLedgeTop != null) {
    const lip = g.groundY - g.slLedgeTop;
    expect(lip, `${label}: painted ledge lip above the ground line (lip=${lip}px)`)
      .toBeGreaterThanOrEqual(LIP_MIN);
    expect(lip, `${label}: painted ledge is a lip, not a mid-air band (lip=${lip}px)`)
      .toBeLessThanOrEqual(LIP_MAX);
  }
  if (g.seamY != null) {
    const seam = g.groundY - g.seamY;
    expect(seam, `${label}: glow seam belongs to the lip (seam=${seam}px above ground)`)
      .toBeGreaterThanOrEqual(0);
    expect(seam, `${label}: glow seam belongs to the lip (seam=${seam}px above ground)`)
      .toBeLessThanOrEqual(LIP_MAX);
  }
}

for (const fight of FIGHTS) {
  test(`combatants stand on the ground line — ${fight.name}`, async ({ page }) => {
    const errors = collectErrors(page);
    await boot(page, { query: 'mesh=0' }); // geometry is a DOM contract; warp planes only echo it
    await page.evaluate((act) => { window.spirebound.S.run.act = act; }, fight.act);
    await startFight(page, fight.ids);
    await stable(page);
    assertGrounded(await measure(page), fight.name);
    expectNoErrors(errors, fight.name);
  });
}

test('ground line survives a live resize', async ({ page }) => {
  test.skip(test.info().project.name !== 'desktop', 'window resizing is a desktop behaviour');
  await boot(page, { query: 'mesh=0' });
  await startFight(page, ['duskfang', 'sporeling']);
  await stable(page);
  assertGrounded(await measure(page), 'before resize');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForTimeout(400);
  assertGrounded(await measure(page), 'after resize to 1440x900');
});
