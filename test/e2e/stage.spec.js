// Fixed-viewport contract (hardening spec §1b): the game renders to a fixed
// virtual resolution (one of five canonical shapes) and scales uniformly,
// letterboxed. A bigger window gets bigger pixels, never more world.
import { test, expect } from '@playwright/test';
import { boot, startFight, stable } from './helpers.js';

const EXPECT_SHAPE = {
  desktop: { shape: 'desktop-landscape', w: 1458, h: 820 },
  portrait: { shape: 'phone-portrait', w: 390, h: 844 },
  landscape: { shape: 'phone-landscape', w: 844, h: 390 },
};

async function combatGeometry(page) {
  await page.waitForFunction(() => window.__probe?.geometry());
  return page.evaluate(() => window.__probe.geometry());
}

test('viewport maps to its canonical stage shape', async ({ page }) => {
  const want = EXPECT_SHAPE[test.info().project.name];
  await boot(page);
  const st = await page.evaluate(() => window.__probe.stage());
  expect(st.shape).toBe(want.shape);
  expect(st.w).toBe(want.w);
  expect(st.h).toBe(want.h);
  // uniform scale + centered letterbox: the stage's real box keeps the
  // stage aspect exactly and never overflows the window
  const box = await page.evaluate(() => {
    const r = document.getElementById('stage').getBoundingClientRect();
    return { l: r.left, t: r.top, w: r.width, h: r.height, iw: innerWidth, ih: innerHeight };
  });
  expect(box.w / box.h).toBeCloseTo(want.w / want.h, 2);
  expect(box.w).toBeLessThanOrEqual(box.iw + 0.5);
  expect(box.h).toBeLessThanOrEqual(box.ih + 0.5);
  expect(box.l).toBeCloseTo((box.iw - box.w) / 2, 0);
  expect(box.t).toBeCloseTo((box.ih - box.h) / 2, 0);
});

test('?shape= override forces the remaining shapes', async ({ page }) => {
  test.skip(test.info().project.name !== 'desktop', 'one project is enough');
  await boot(page, { query: 'shape=pad-portrait' });
  const st = await page.evaluate(() => window.__probe.stage());
  expect(st.shape).toBe('pad-portrait');
  expect(st.w).toBe(820);
  expect(st.h).toBe(1180);
});

test('a 4:3-ish desktop window keeps the pad-landscape stage', async ({ page }) => {
  test.skip(test.info().project.name !== 'desktop', 'window resizing is a desktop behaviour');
  await page.setViewportSize({ width: 1180, height: 820 });
  await boot(page);
  const st = await page.evaluate(() => window.__probe.stage());
  expect(st.shape).toBe('pad-landscape');
  expect(st.w).toBe(1180);
});

test('title and embark screens fit their stage: no scrollable overflow anywhere', async ({ page }) => {
  await boot(page);
  // the fullest profile a veteran can produce: saved run (Continue button),
  // both aspects, vow stepper at V with the five-line vow ledger, and the
  // Vigil news pulse — the vow content now lives on the Embark screen
  await page.evaluate(() => {
    localStorage.setItem('spirebound_vigil_v2', JSON.stringify({
      v: 2,
      deeds: { runs: 40, wins: 9, slain: 500, shatters: 90, kindles: 60, perfects: 12, smolderKills: 60, unlitVisited: 30, embersSpent: 900, bestVow: 5, bestFloor: 45 },
      unlocks: ['aspect2'], vowUnlocked: 5, lastFall: null,
      runsPlayed: 40, quests: {}, shards: [], whispers: 0, news: true,
    }));
    window.spirebound.E.saveRun(window.spirebound.E.newRun(1234, { aspect: 0 }));
  });
  await page.reload();
  await page.waitForFunction(() => window.spirebound && window.__probe);
  const scan = () => page.evaluate(() => {
    const out = [];
    const de = document.scrollingElement;
    if (de.scrollHeight > de.clientHeight || de.scrollWidth > de.clientWidth) {
      out.push(`document ${de.scrollWidth}x${de.scrollHeight} in ${de.clientWidth}x${de.clientHeight}`);
    }
    for (const el of document.querySelectorAll('#stage *')) {
      const cs = getComputedStyle(el);
      if (!/(auto|scroll)/.test(cs.overflowY + cs.overflowX)) continue;
      if (el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1) {
        out.push(`${el.tagName.toLowerCase()}.${String(el.className).split(' ').join('.')} ${el.scrollWidth}x${el.scrollHeight} in ${el.clientWidth}x${el.clientHeight}`);
      }
    }
    return out;
  });
  const badTitle = await scan();
  expect(badTitle, `title: ${badTitle.join('; ')}`).toEqual([]);
  await page.click('[data-a="embark"]');
  for (let i = 0; i < 5; i++) await page.click('[data-a="vow+"]');
  await page.waitForTimeout(600);
  const badEmbark = await scan();
  expect(badEmbark, `embark: ${badEmbark.join('; ')}`).toEqual([]);
});

test('window size changes scale, never layout: geometry is identical at two window sizes', async ({ page }) => {
  test.skip(test.info().project.name !== 'desktop', 'window resizing is a desktop behaviour');
  await boot(page, { query: 'mesh=0' });
  await startFight(page, ['duskfang', 'sporeling']);
  await stable(page);
  const g1 = await combatGeometry(page);
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.waitForTimeout(400);
  const g2 = await combatGeometry(page);
  // same shape (both landscape), so every stage-space measurement must be
  // bit-identical: this IS the "fixed virtual resolution" property
  expect(g2.stage.shape).toBe(g1.stage.shape);
  expect(g2.stage.scale).toBeGreaterThan(g1.stage.scale);
  const near = (a, b, label) => expect(Math.abs(a - b), `${label} (${a} vs ${b})`).toBeLessThanOrEqual(0.5);
  near(g2.groundY, g1.groundY, 'groundY');
  near(g2.heroArtBottom, g1.heroArtBottom, 'heroArtBottom');
  g1.enemyArtBottoms.forEach((b, i) => near(g2.enemyArtBottoms[i], b, `enemy ${i} bottom`));
  if (g1.slLedgeTop != null) near(g2.slLedgeTop, g1.slLedgeTop, 'slLedgeTop');
  if (g1.seamY != null) near(g2.seamY, g1.seamY, 'seamY');
});
