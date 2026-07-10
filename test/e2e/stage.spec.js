// Fixed-viewport contract (hardening spec §1b): the game renders to a fixed
// virtual resolution (one of five canonical shapes) and scales uniformly,
// letterboxed. A bigger window gets bigger pixels, never more world.
import { test, expect } from '@playwright/test';
import { boot, startFight, stable } from './helpers.js';
import { completeLedger, seed, waitForDawnComplete } from './emberglass-fixtures.js';

const EXPECT_SHAPE = {
  desktop: { shape: 'desktop-landscape', w: 1458, h: 820 },
  portrait: { shape: 'phone-portrait', w: 390, h: 844 },
  landscape: { shape: 'phone-landscape', w: 844, h: 390 },
};

async function combatGeometry(page) {
  await page.waitForFunction(() => window.__probe?.geometry());
  return page.evaluate(() => window.__probe.geometry());
}

async function expectNoOverflow(page, label, explicit = [], safeExplicit = []) {
  const bad = await page.evaluate(({ selectors, safeSelectors }) => {
    const out = [];
    const tol = 1;
    const de = document.scrollingElement;
    if (de.scrollHeight > de.clientHeight || de.scrollWidth > de.clientWidth) {
      out.push(`document ${de.scrollWidth}x${de.scrollHeight} in ${de.clientWidth}x${de.clientHeight}`);
    }
    const stage = document.getElementById('stage').getBoundingClientRect();
    const rootStyle = getComputedStyle(document.documentElement);
    const stageScale = stage.width / document.getElementById('stage').offsetWidth;
    const safePx = (name) => (Number.parseFloat(rootStyle.getPropertyValue(name)) || 0) * stageScale;
    const safe = {
      left: stage.left + safePx('--sal'),
      right: stage.right - safePx('--sar'),
      top: stage.top + safePx('--sat'),
      bottom: stage.bottom - safePx('--sab'),
    };
    const inside = (inner, outer) => inner.left >= outer.left - tol && inner.right <= outer.right + tol &&
      inner.top >= outer.top - tol && inner.bottom <= outer.bottom + tol;
    const labelFor = (el) => `${el.tagName.toLowerCase()}.${String(el.className).trim().split(/\s+/).join('.')}`;

    for (const selector of selectors) {
      const nodes = [...document.querySelectorAll(selector)];
      if (!nodes.length) {
        out.push(`missing reachable ${selector}`);
        continue;
      }
      for (const el of nodes) {
        const cs = getComputedStyle(el);
        const box = el.getBoundingClientRect();
        if (cs.display === 'none' || cs.visibility === 'hidden' || box.width < 1 || box.height < 1) {
          out.push(`hidden reachable ${labelFor(el)}`);
          continue;
        }
        if (!inside(box, stage)) {
          out.push(`off-stage reachable ${labelFor(el)} [${Math.round(box.left)},${Math.round(box.top)},${Math.round(box.right)},${Math.round(box.bottom)}] in [${Math.round(stage.left)},${Math.round(stage.top)},${Math.round(stage.right)},${Math.round(stage.bottom)}]`);
        }
        const container = el.closest('.rose-slot,.rose-window,.vigil-panel,.ov-panel,.sealed-door-panel,.end-screen');
        if (container && container !== el && !inside(box, container.getBoundingClientRect())) {
          out.push(`clipped reachable ${labelFor(el)}`);
        }
        if (el.matches('.rose-pane-copy,.rose-slot') &&
            (el.scrollWidth > el.clientWidth + tol || el.scrollHeight > el.clientHeight + tol)) {
          out.push(`clipped Rose copy ${labelFor(el)} ${el.scrollWidth}x${el.scrollHeight} in ${el.clientWidth}x${el.clientHeight}`);
        }
      }
    }

    for (const selector of safeSelectors) {
      const nodes = [...document.querySelectorAll(selector)];
      if (!nodes.length) {
        out.push(`missing safe-area ${selector}`);
        continue;
      }
      for (const el of nodes) {
        const box = el.getBoundingClientRect();
        if (!inside(box, safe)) {
          out.push(`outside safe area ${labelFor(el)} [${Math.round(box.left)},${Math.round(box.top)},${Math.round(box.right)},${Math.round(box.bottom)}] in [${Math.round(safe.left)},${Math.round(safe.top)},${Math.round(safe.right)},${Math.round(safe.bottom)}]`);
        }
      }
    }

    for (const el of document.querySelectorAll('.vigil-panel,.ov-panel,.sealed-door-panel,.end-screen')) {
      const cs = getComputedStyle(el);
      if (!/(hidden|clip)/.test(cs.overflowY + cs.overflowX)) continue;
      if (el.scrollHeight > el.clientHeight + tol || el.scrollWidth > el.clientWidth + tol) {
        out.push(`clipped container ${labelFor(el)} ${el.scrollWidth}x${el.scrollHeight} in ${el.clientWidth}x${el.clientHeight}`);
      }
    }

    for (const el of document.querySelectorAll('#stage *')) {
      const cs = getComputedStyle(el);
      if (!/(auto|scroll)/.test(cs.overflowY + cs.overflowX)) continue;
      if (el.scrollWidth > el.clientWidth + tol) {
        out.push(`horizontal scroller ${labelFor(el)} ${el.scrollWidth} in ${el.clientWidth}`);
      }
      if (el.scrollHeight > el.clientHeight + tol) {
        if (el.matches('.deed-list,.whisper-log,.dawn-ceremony')) {
          const old = el.scrollTop;
          el.scrollTop = el.scrollHeight;
          const box = el.getBoundingClientRect();
          const last = el.lastElementChild?.getBoundingClientRect();
          if (!inside(box, stage) || !last || last.bottom > box.bottom + tol || last.bottom < box.top - tol) {
            out.push(`unreachable approved scroller ${labelFor(el)}`);
          }
          el.scrollTop = old;
          continue;
        }
        out.push(`${labelFor(el)} ${el.scrollWidth}x${el.scrollHeight} in ${el.clientWidth}x${el.clientHeight}`);
      }
    }
    return out;
  }, { selectors: explicit, safeSelectors: safeExplicit });
  expect(bad, `${label}: ${bad.join('; ')}`).toEqual([]);
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

test('title and embark screens fit their stage: no scrollable overflow anywhere', { tag: '@smoke' }, async ({ page }) => {
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
  await expectNoOverflow(page, 'title');
  // title always says Begin the Climb (Begin Anew confirmation lives on Embark)
  await expect(page.locator('[data-a="embark"]')).toHaveText('Begin the Climb');
  await page.click('[data-a="embark"]');
  for (let i = 0; i < 5; i++) await page.click('[data-a="vow+"]');
  await page.waitForTimeout(600);
  await expectNoOverflow(page, 'embark');
});

test('maximum Emberglass profile and ceremonies fit every stage', async ({ page }) => {
  const v = completeLedger();
  v.unlocks = ['aspect2'];
  v.vowUnlocked = 5;
  v.deeds.bestVow = 5;
  await seed(page, v);
  await page.addStyleTag({
    content: `:root{--sat:32px;--sab:24px;--sal:12px;--sar:12px}
      .center-panel.screen-enter:has(.vigil-panel){animation-duration:10s!important}`,
  });
  await page.evaluate(() => {
    const sp = window.spirebound;
    sp.E.saveRun(sp.E.newRun(7001, { aspect: 1, vow: 5 }));
    sp.show('title');
  });
  await stable(page);
  await expectNoOverflow(page, 'title', [
    '.title-screen', '.title-btns', '.title-rose-medallion.ready', '[data-a="vigil"]',
  ], [
    '.title-btns', '.title-rose-medallion.ready', '[data-a="vigil"]',
  ]);
  await page.click('[data-a="vigil"]');
  await page.waitForTimeout(500);
  await expectNoOverflow(page, 'Vigil Deeds', [
    '.vigil-panel', '.vigil-tabs', '.vigil-tabs .vtab', '.deed-list', '.ov-actions', '[data-a="back"]',
  ], [
    '.vigil-panel', '.vigil-tabs', '.deed-list', '.ov-actions', '[data-a="back"]',
  ]);
  await page.click('[data-a="tab-rose"]');
  await page.waitForSelector('.rose-window.ready');
  await page.waitForTimeout(500);
  await expectNoOverflow(page, 'Vigil Rose', [
    '.vigil-panel', '.vigil-tabs', '.vigil-tabs .vtab', '.rose-view', '.rose-window',
    '.rose-pane', '.rose-pane-copy', '.rose-pane-select', '.rose-pane-detail',
    '.whisper-log', '.ov-actions', '[data-a="back"]',
  ], [
    '.vigil-panel', '.vigil-tabs', '.rose-view', '.rose-window', '.rose-pane-detail',
    '.whisper-log', '.ov-actions', '[data-a="back"]',
  ]);

  await page.evaluate(() => {
    window.__probe.forceRoseFallback(true);
    window.spirebound.show('vigil', { tab: 'rose' });
  });
  await page.waitForSelector('.rose-window.rose-fallback');
  await page.waitForTimeout(500);
  await expectNoOverflow(page, 'Vigil Rose fallback', [
    '.vigil-panel', '.vigil-tabs', '.vigil-tabs .vtab', '.rose-view', '.rose-fallback',
    '.rose-fallback .rose-slot', '.rose-fallback .rose-slot-mark', '.rose-fallback .rose-pane-copy',
    '.rose-fallback .rose-pane-select', '.rose-pane-detail',
    '.whisper-log', '.ov-actions', '[data-a="back"]',
  ], [
    '.vigil-panel', '.vigil-tabs', '.rose-view', '.rose-fallback', '.rose-pane-detail',
    '.whisper-log', '.ov-actions', '[data-a="back"]',
  ]);
  const fallbackOverlaps = await page.evaluate(() => [...document.querySelectorAll('.rose-fallback .rose-slot')]
    .flatMap((slot, index) => {
      const box = slot.getBoundingClientRect();
      const mark = slot.querySelector('.rose-slot-mark')?.getBoundingClientRect();
      const copy = slot.querySelector('.rose-pane-copy')?.getBoundingClientRect();
      if (!mark || !copy) return [];
      const issues = [];
      const inside = (r) => r.left >= box.left - 1 && r.right <= box.right + 1 &&
        r.top >= box.top - 1 && r.bottom <= box.bottom + 1;
      if (!inside(mark)) issues.push(`slot ${index}: mark escapes its pane`);
      if (!inside(copy)) issues.push(`slot ${index}: copy escapes its pane`);
      const overlapW = Math.min(mark.right, copy.right) - Math.max(mark.left, copy.left);
      const overlapH = Math.min(mark.bottom, copy.bottom) - Math.max(mark.top, copy.top);
      if (overlapW > 1 && overlapH > 1) {
        issues.push(`slot ${index}: mark/copy overlap ${Math.round(overlapW)}x${Math.round(overlapH)}`);
      }
      return issues;
    }));
  expect(fallbackOverlaps).toEqual([]);
  await page.evaluate(() => { window.__probe.forceRoseFallback(false); });

  await page.evaluate(() => {
    const sp = window.spirebound;
    const vigil = JSON.parse(localStorage.getItem('spirebound_vigil_v2'));
    sp.S.run = sp.E.newRun(7002, {
      reveals: ['omens', 'phials', 'poolWave2', 'poolWave3', 'poolFull', 'emberglass', 'act4'],
      quests: vigil.quests, shards: vigil.shards,
    });
    sp.S.run.act = 2;
    sp.S.run.map = sp.E.genMap(sp.S.run);
    sp.show('map');
  });
  await page.waitForTimeout(500);
  expect(await page.evaluate(() => [
    document.getElementById('stage').scrollLeft,
    document.getElementById('stage').scrollTop,
    document.getElementById('screen').scrollLeft,
    document.getElementById('screen').scrollTop,
  ])).toEqual([0, 0, 0, 0]);
  // The sealed door is projected from the continuously moving 3D camera.
  // Dispatch the click without Playwright's stable-box wait: this assertion
  // measures the resulting panel layout, not the map camera's animation.
  await page.locator('[data-a="sealed-door"]').dispatchEvent('click');
  await page.waitForTimeout(250);
  expect(await page.evaluate(() => [
    document.getElementById('stage').scrollLeft,
    document.getElementById('stage').scrollTop,
    document.getElementById('screen').scrollLeft,
    document.getElementById('screen').scrollTop,
  ]), 'opening the fixed door panel must not programmatically scroll the stage or screen').toEqual([0, 0, 0, 0]);
  await expectNoOverflow(page, 'sealed door', [
    '.sealed-door-panel', '.sealed-door-mark', '.door-inscription', '[data-a="close-door"]',
  ], [
    '.sealed-door-panel', '.sealed-door-panel .ov-actions', '[data-a="close-door"]',
  ]);
  const doorHeight = await page.evaluate(() => ({
    panel: document.querySelector('.sealed-door-panel').getBoundingClientRect().height,
    stage: document.getElementById('stage').getBoundingClientRect().height,
  }));
  expect(doorHeight.panel / doorHeight.stage,
    'the sealed-door promise is a centred panel, not an almost-full-height mobile sheet').toBeLessThan(0.9);
  await page.click('[data-a="close-door"]');

  await page.evaluate(() => {
    const sp = window.spirebound;
    const vigil = JSON.parse(localStorage.getItem('spirebound_vigil_v2'));
    const run = sp.E.newRun(7003, { quests: vigil.quests, shards: vigil.shards });
    run.pendingRunEnd = { outcome: 'win' };
    if (!sp.E.saveRun(run) || !sp.E.stagePendingDawn(run, [
      { t: 'whisper', text: 'The climb continues.' },
      { t: 'questReveal', id: 'unreadablePage' },
      { t: 'questProgress', id: 'unreadablePage', progress: 5, target: 5 },
      { t: 'pageRead', index: 5, text: 'FIFTH PAGE — The Rose Window is a map, not a memorial. Light it, then look above the crown.' },
      { t: 'eighthResolved', text: 'The broken glyphs resolve into a warning.' },
      { t: 'shadeResolved', text: 'The shade names the lock above the crown.' },
      { t: 'shardGrant', id: 'unreadablePage' },
      { t: 'act4Reveal' },
    ], [])) throw new Error('maximum-state dawn did not stage');
    sp.S.run = run;
    sp.show('end', { won: true });
  });
  await waitForDawnComplete(page);
  await expect(page.locator('.dawn-ceremony')).toBeVisible();
  await expect(page.locator('.dawn-event')).toHaveCount(8);
  await expectNoOverflow(page, 'dawn ceremony', [
    '.end-screen', '.end-title', '.end-screen > .ov-sub', '.dawn-ceremony',
    '.stats-grid', '.end-btns', '.end-btns button',
  ], [
    '.end-title', '.end-screen > .ov-sub', '.dawn-ceremony', '.stats-grid', '.end-btns', '.end-btns button',
  ]);
});

// Spec §6 light assertions: fresh title has no aspect row; Embark grows
// sections only as the Vigil reveals them.
test('fresh profile title has no aspect row; Embark shows zero sections', async ({ page }) => {
  test.skip(test.info().project.name !== 'desktop', 'entrance behaviour is shape-independent');
  await page.goto('/');
  await page.waitForFunction(() => window.spirebound && window.__probe);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForFunction(() => window.spirebound && window.__probe);
  await expect(page.locator('.title-screen .aspect-row')).toHaveCount(0);
  await expect(page.locator('.title-screen .vow-block')).toHaveCount(0);
  await expect(page.locator('[data-a="embark"]')).toHaveText('Begin the Climb');
  await expect(page.locator('[data-a="continue"]')).toHaveCount(0);
  await page.click('[data-a="embark"]');
  await expect(page.locator('.embark-screen .aspect-row')).toHaveCount(0);
  await expect(page.locator('.embark-screen .vow-block')).toHaveCount(0);
  await expect(page.locator('.embark-screen [data-a="begin"]')).toHaveText('Begin the Climb');
});

test('seeded veteran Embark shows aspect and vow sections', async ({ page }) => {
  test.skip(test.info().project.name !== 'desktop', 'entrance behaviour is shape-independent');
  await page.goto('/');
  await page.waitForFunction(() => window.spirebound && window.__probe);
  await page.evaluate(() => {
    localStorage.clear();
    localStorage.setItem('spirebound_vigil_v2', JSON.stringify({
      v: 2,
      deeds: { runs: 40, wins: 9, slain: 500, shatters: 90, kindles: 60, perfects: 12, smolderKills: 60, unlitVisited: 30, embersSpent: 900, bestVow: 5, bestFloor: 45 },
      unlocks: ['aspect2'], vowUnlocked: 5, lastFall: null,
      runsPlayed: 40, quests: {}, shards: [], whispers: 0, news: false,
    }));
  });
  await page.reload();
  await page.waitForFunction(() => window.spirebound && window.__probe);
  await expect(page.locator('.title-screen .aspect-row')).toHaveCount(0);
  await page.click('[data-a="embark"]');
  await expect(page.locator('.embark-screen .aspect-row')).toHaveCount(1);
  await expect(page.locator('.embark-screen .aspect-card')).toHaveCount(2);
  await expect(page.locator('.embark-screen .vow-block')).toHaveCount(1);
});

test('Begin Anew on Embark confirms before abandoning a saved climb', async ({ page }) => {
  test.skip(test.info().project.name !== 'desktop', 'entrance behaviour is shape-independent');
  await page.goto('/');
  await page.waitForFunction(() => window.spirebound && window.__probe);
  await page.evaluate(() => {
    localStorage.clear();
    window.spirebound.E.saveRun(window.spirebound.E.newRun(1234, { aspect: 0, reveals: [] }));
  });
  await page.reload();
  await page.waitForFunction(() => window.spirebound && window.__probe);
  await expect(page.locator('[data-a="continue"]')).toHaveCount(1);
  await expect(page.locator('[data-a="embark"]')).toHaveText('Begin the Climb');
  await page.click('[data-a="embark"]');
  await expect(page.locator('.embark-screen [data-a="begin"]')).toHaveText('Begin Anew');
  await page.click('.embark-screen [data-a="begin"]');
  // confirmation modal — save must still exist until the player confirms
  await expect(page.locator('#overlay.open .ov-title')).toHaveText('Begin Anew?');
  const before = await page.evaluate(() => ({
    seed: window.spirebound.E.loadRun()?.seed,
    runsPlayed: JSON.parse(localStorage.getItem('spirebound_vigil_v2') || '{}').runsPlayed || 0,
  }));
  expect(before.seed).toBe(1234);
  await page.click('#overlay [data-a="no"]');
  await expect(page.locator('#overlay.open')).toHaveCount(0);
  expect(await page.evaluate(() => window.spirebound.E.loadRun()?.seed)).toBe(1234);
  // confirm path: abandon advances the ladder, then a new climb starts (and autosaves)
  await page.click('.embark-screen [data-a="begin"]');
  await page.click('#overlay [data-a="yes"]');
  await page.waitForFunction(() => window.spirebound.S.screen !== 'embark');
  const after = await page.evaluate(() => {
    const run = window.spirebound.E.loadRun() || window.spirebound.S.run;
    return {
      seed: run?.seed,
      runsPlayed: JSON.parse(localStorage.getItem('spirebound_vigil_v2') || '{}').runsPlayed || 0,
      reveals: run?.reveals,
      screen: window.spirebound.S.screen,
    };
  });
  expect(after.runsPlayed).toBe(before.runsPlayed + 1);
  expect(after.seed).not.toBe(1234);
  expect(after.reveals).toContain('lamplighter');
  expect(['lamplighter', 'map', 'combat']).toContain(after.screen);
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
