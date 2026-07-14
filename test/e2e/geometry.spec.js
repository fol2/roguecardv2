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
import { snapStage } from '../../src/ui/widgets.js';
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

async function combatChromeRects(page) {
  return page.evaluate(() => {
    const info = window.__probe.stage();
    const stage = document.getElementById('stage').getBoundingClientRect();
    const rect = (el) => {
      if (!el) return { left: 0, right: 0, top: 0, bottom: 0 };
      const r = el.getBoundingClientRect();
      return {
        left: (r.left - stage.left) / info.scale,
        right: (r.right - stage.left) / info.scale,
        top: (r.top - stage.top) / info.scale,
        bottom: (r.bottom - stage.top) / info.scale,
      };
    };
    const fromBounds = (b) => (b ? {
      left: b.left, right: b.right, top: b.top, bottom: b.bottom,
    } : { left: 0, right: 0, top: 0, bottom: 0 });
    const union = (nodes) => {
      const rs = nodes.filter(Boolean).map(rect)
        .filter((r) => r.right > r.left && r.bottom > r.top);
      if (!rs.length) return { left: 0, right: 0, top: 0, bottom: 0 };
      return {
        left: Math.min(...rs.map((r) => r.left)),
        right: Math.max(...rs.map((r) => r.right)),
        top: Math.min(...rs.map((r) => r.top)),
        bottom: Math.max(...rs.map((r) => r.bottom)),
      };
    };
    const centreX = (r) => (r.left + r.right) / 2;
    const pickWidget = (cachedBounds, domNode, fallback) => {
      if (cachedBounds && cachedBounds.right > cachedBounds.left) {
        return fromBounds(cachedBounds);
      }
      if (domNode) {
        const r = rect(domNode);
        if (r.right > r.left && r.bottom > r.top) return r;
      }
      return fallback || { left: 0, right: 0, top: 0, bottom: 0 };
    };

    // Task 22b-2: plate/HP/intent paint is Pixi-owned; prefer readUI() when
    // the combat renderer has plate caches. Distinct wrap/block/vial/label/
    // intent seats come from the presentation cache (measured from DOM
    // layout hosts during paint); dual-read DOM for overflow metrics.
    const gl = window.spirebound?.combatGl;
    const readUi = gl?.readUI?.();
    const pixiPlates = readUi?.plates;

    if (pixiPlates?.hero?.plateBounds) {
      const enemies = [...document.querySelectorAll('.enemy')];
      const hp = enemies.map((enemy, i) => {
        const art = enemy.querySelector('.enemy-art');
        const artR = rect(art);
        const cached = pixiPlates.enemies?.[i];
        const plateR = fromBounds(cached?.plateBounds || readUi.enemies?.[i]?.plateBounds);
        const wrap = enemy.querySelector('.hpbar-wrap');
        const block = enemy.querySelector('.block-chip');
        const icon = block?.querySelector('.ui-icon,.gicon');
        const vial = enemy.querySelector('.hp-vial');
        const label = enemy.querySelector('.hp-label');
        const intent = enemy.querySelector('.intent');
        const wrapR = pickWidget(cached?.wrapBounds, wrap, plateR);
        const blockR = pickWidget(cached?.blockBounds, block);
        const iconR = pickWidget(cached?.iconBounds, icon, blockR);
        const vialR = pickWidget(cached?.vialBounds, vial, plateR);
        const labelR = pickWidget(cached?.labelBounds, label, plateR);
        const intentR = pickWidget(cached?.intentBounds, intent);
        const visible = fromBounds(cached?.visibleBounds)
          || union([enemy.querySelector('.cplate'), enemy.querySelector('.name'), wrap, block, vial, label, enemy.querySelector('.facet-row')]);
        return {
          visible: visible.right > visible.left ? visible : plateR,
          wrap: wrapR,
          block: blockR,
          icon: iconR,
          vial: vialR,
          label: labelR,
          intent: intentR,
          art: artR,
          plate: plateR,
          artCentreX: centreX(artR),
          plateCentreX: centreX(plateR),
          clientWidth: wrap ? wrap.clientWidth : (cached?.wrapClientWidth || Math.max(1, wrapR.right - wrapR.left)),
          scrollWidth: wrap ? wrap.scrollWidth : (cached?.wrapScrollWidth || Math.max(1, wrapR.right - wrapR.left)),
        };
      });
      const topVisible = (cachedTop, enemy, i) => {
        const topBounds = fromBounds(
          cachedTop || pixiPlates.enemies?.[i]?.topChromeBounds || readUi.enemies?.[i]?.topChromeBounds,
        );
        const intent = enemy.querySelector('.intent');
        const status = enemy.querySelector('.status-row');
        // Prefer union of distinct intent/status seats when DOM layout boxes remain.
        const fromDom = union([
          enemy.querySelector('.top-chrome'),
          intent,
          ...enemy.querySelectorAll('.intent .ic,.intent .ui-icon,.intent .gicon,.intent .num'),
          status,
          ...enemy.querySelectorAll('.schip,.schip-art,.schip .n'),
        ]);
        if (fromDom.right > fromDom.left) return fromDom;
        return topBounds;
      };
      return {
        stage: info,
        hero: fromBounds(pixiPlates.hero.plateBounds),
        heroTopVisible: (() => {
          const root = document.querySelector('.player-zone .top-chrome');
          if (!root) return fromBounds(pixiPlates.hero.topChromeBounds || pixiPlates.hero.plateBounds);
          const fromDom = union([
            root,
            ...root.querySelectorAll(
              '.intent,.intent .ic,.intent .ui-icon,.intent .gicon,.intent .num,' +
              '.status-row,.schip,.schip-art,.schip .n',
            ),
          ]);
          return fromDom.right > fromDom.left
            ? fromDom
            : fromBounds(pixiPlates.hero.topChromeBounds || pixiPlates.hero.plateBounds);
        })(),
        enemy: hp.map((x) => x.plate),
        enemyVisible: hp.map((x) => x.visible),
        top: enemies.map((_, i) => fromBounds(
          pixiPlates.enemies?.[i]?.topChromeBounds || readUi.enemies?.[i]?.topChromeBounds,
        )),
        topVisible: enemies.map((enemy, i) => topVisible(
          pixiPlates.enemies?.[i]?.topChromeBounds, enemy, i,
        )),
        hp,
        source: 'readUI',
      };
    }

    const hp = [...document.querySelectorAll('.enemy')].map((enemy) => {
      const plate = enemy.querySelector('.cplate');
      const art = enemy.querySelector('.enemy-art');
      const wrap = enemy.querySelector('.hpbar-wrap');
      const block = enemy.querySelector('.block-chip');
      const icon = block?.querySelector('.ui-icon,.gicon');
      const vial = enemy.querySelector('.hp-vial');
      const label = enemy.querySelector('.hp-label');
      const nodes = [
        plate,
        enemy.querySelector('.name'),
        wrap,
        block,
        icon,
        vial,
        label,
        enemy.querySelector('.facet-row'),
      ];
      const artR = rect(art);
      const plateR = rect(plate);
      return {
        visible: union(nodes),
        wrap: rect(wrap),
        block: rect(block),
        icon: rect(icon),
        vial: rect(vial),
        label: rect(label),
        art: artR,
        plate: plateR,
        artCentreX: centreX(artR),
        plateCentreX: centreX(plateR),
        clientWidth: wrap.clientWidth,
        scrollWidth: wrap.scrollWidth,
      };
    });
    const topVisible = (root) => union([
      root,
      ...root.querySelectorAll(
        '.intent,.intent .ic,.intent .ui-icon,.intent .gicon,.intent .num,' +
        '.status-row,.schip,.schip-art,.schip .n',
      ),
    ]);
    return {
      stage: info,
      hero: rect(document.querySelector('.player-zone .cplate')),
      heroTopVisible: topVisible(document.querySelector('.player-zone .top-chrome')),
      enemy: [...document.querySelectorAll('.enemy .cplate')].map(rect),
      enemyVisible: hp.map((x) => x.visible),
      top: [...document.querySelectorAll('.enemy .top-chrome')].map(rect),
      topVisible: [...document.querySelectorAll('.enemy .top-chrome')].map(topVisible),
      hp,
      source: 'dom',
    };
  });
}

function rectSeparation(a, b) {
  return Math.max(
    b.left - a.right,
    a.left - b.right,
    b.top - a.bottom,
    a.top - b.bottom,
  );
}

function assertCombatChrome(rects, label) {
  for (const [kind, plates] of [['enemy cplate', rects.enemy], ['enemy top chrome', rects.top]]) {
    plates.forEach((r, i) => {
      expect(r.left, `${label}: ${kind} ${i} left edge`).toBeGreaterThanOrEqual(4);
      expect(r.right, `${label}: ${kind} ${i} right edge`).toBeLessThanOrEqual(rects.stage.w - 4);
      expect(r.top, `${label}: ${kind} ${i} top edge`).toBeGreaterThanOrEqual(4);
      expect(r.bottom, `${label}: ${kind} ${i} bottom edge`).toBeLessThanOrEqual(rects.stage.h - 4);
    });
  }
  for (let i = 0; i < rects.enemy.length; i++) {
    expect(rectSeparation(rects.hero, rects.enemy[i]),
      `${label}: hero and enemy cplate ${i} are 2D-separated`).toBeGreaterThanOrEqual(4);
    if (i > 0) {
      expect(rects.enemy[i].left, `${label}: enemy cplates preserve DOM order`)
        .toBeGreaterThan(rects.enemy[i - 1].left);
    }
    for (let j = i + 1; j < rects.enemy.length; j++) {
      expect(rectSeparation(rects.enemy[i], rects.enemy[j]),
        `${label}: enemy cplates ${i} and ${j} are 2D-separated`).toBeGreaterThanOrEqual(4);
    }
  }
}

function assertEnemyHpChrome(rects, label) {
  rects.hp.forEach((hp, i) => {
    expect(hp.scrollWidth, `${label}: enemy ${i} HP row has no hidden horizontal overflow`)
      .toBeLessThanOrEqual(hp.clientWidth + 1);
    for (const key of ['wrap', 'block', 'icon', 'vial', 'label']) {
      const r = hp[key];
      // Optional seats (e.g. empty Ward chip) may be zero-sized; skip those.
      if (!(r.right > r.left && r.bottom > r.top)) continue;
      expect(r.left, `${label}: enemy ${i} ${key} left edge`).toBeGreaterThanOrEqual(4);
      expect(r.right, `${label}: enemy ${i} ${key} right edge`).toBeLessThanOrEqual(rects.stage.w - 4);
    }
    // Anti-vacuous: wrap/vial/label must not all alias to the full plate box.
    const distinct = ['wrap', 'vial', 'label'].filter((key) => {
      const r = hp[key];
      if (!(r.right > r.left)) return false;
      return r.left !== hp.plate.left || r.right !== hp.plate.right
        || r.top !== hp.plate.top || r.bottom !== hp.plate.bottom;
    });
    expect(distinct.length, `${label}: enemy ${i} exposes distinct HP widget seats`)
      .toBeGreaterThan(0);
  });
  for (let i = 0; i < rects.enemyVisible.length; i++) {
    expect(rectSeparation(rects.hero, rects.enemyVisible[i]),
      `${label}: hero and enemy visible chrome ${i} are 2D-separated`).toBeGreaterThanOrEqual(4);
    for (let j = i + 1; j < rects.enemyVisible.length; j++) {
      expect(rectSeparation(rects.enemyVisible[i], rects.enemyVisible[j]),
        `${label}: enemy visible chrome ${i} and ${j} are 2D-separated`).toBeGreaterThanOrEqual(4);
    }
  }
}

/** HP / name plate must stay under its foe — not slid onto a neighbour. */
function assertEnemyHpUnderFoe(rects, label, maxDrift = 90) {
  rects.hp.forEach((hp, i) => {
    const drift = Math.abs(hp.plateCentreX - hp.artCentreX);
    expect(drift, `${label}: enemy ${i} cplate stays under its art (drift ${drift.toFixed(1)}px)`)
      .toBeLessThanOrEqual(maxDrift);
    // Plate must horizontally overlap its own art box (not sit wholly under another foe).
    expect(hp.plate.left < hp.art.right && hp.art.left < hp.plate.right,
      `${label}: enemy ${i} cplate overlaps its own art horizontally`).toBe(true);
  });
}

function assertEnemyTopChrome(rects, label) {
  rects.topVisible.forEach((r, i) => {
    expect(r.left, `${label}: enemy top visible chrome ${i} left edge`).toBeGreaterThanOrEqual(4);
    expect(r.right, `${label}: enemy top visible chrome ${i} right edge`)
      .toBeLessThanOrEqual(rects.stage.w - 4);
    expect(rectSeparation(rects.heroTopVisible, r),
      `${label}: hero and enemy top visible chrome ${i} are 2D-separated`).toBeGreaterThanOrEqual(4);
    if (i > 0) {
      expect(r.left, `${label}: enemy top chrome preserves DOM order`)
        .toBeGreaterThan(rects.topVisible[i - 1].left);
    }
    for (let j = i + 1; j < rects.topVisible.length; j++) {
      expect(rectSeparation(r, rects.topVisible[j]),
        `${label}: enemy top visible chrome ${i} and ${j} are 2D-separated`)
        .toBeGreaterThanOrEqual(4);
    }
  });
}

function expectChromeRectsNear(actual, expected, label, tolerance = 1) {
  for (const key of ['hero', 'heroTopVisible', 'enemy', 'enemyVisible', 'top', 'topVisible']) {
    const got = Array.isArray(actual[key]) ? actual[key] : [actual[key]];
    const want = Array.isArray(expected[key]) ? expected[key] : [expected[key]];
    expect(got.length, `${label}: ${key} rect count`).toBe(want.length);
    got.forEach((rect, i) => {
      for (const edge of ['left', 'right', 'top', 'bottom']) {
        expect(Math.abs(rect[edge] - want[i][edge]), `${label}: ${key} ${i} ${edge}`)
          .toBeLessThanOrEqual(tolerance);
      }
    });
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

for (const formation of [
  { act: 1, name: 'canonical act 2 pair', ids: ['drownedOne', 'voltEel'] },
  { act: 0, name: 'canonical act 1 trio', ids: ['sporeling', 'sporeling', 'sporeling'] },
]) {
  test(`portrait combat chrome is bounded and separated — ${formation.name}`, async ({ page }) => {
    test.skip(test.info().project.name !== 'portrait', 'portrait chrome regression');
    const errors = collectErrors(page);
    await boot(page, { query: 'mesh=0' });
    await page.evaluate((act) => { window.spirebound.S.run.act = act; }, formation.act);
    await startFight(page, formation.ids);
    await stable(page);
    assertGrounded(await measure(page), formation.name);
    const beforeDeath = await combatChromeRects(page);
    assertCombatChrome(beforeDeath, formation.name);
    assertEnemyHpUnderFoe(beforeDeath, formation.name);
    if (formation.ids.length === 3) {
      const killed = await page.evaluate(async () => {
        window.__probe.setEnemyHp(0, 1);
        window.__probe.setEnergy(3);
        const [uid] = window.__probe.forceHand(['strike']);
        return window.__probe.play(uid, 0);
      });
      expect(killed, `${formation.name}: real strike kills the first member`).toBe(true);
      await settle(page);
      await page.waitForSelector('.enemy.gone', { state: 'attached' });
      const afterDeath = await combatChromeRects(page);
      for (let i = 1; i < beforeDeath.enemy.length; i++) {
        for (const edge of ['left', 'right']) {
          expect(Math.abs(afterDeath.enemy[i][edge] - beforeDeath.enemy[i][edge]),
            `${formation.name}: survivor ${i} ${edge} does not jump after the first death`)
            .toBeLessThanOrEqual(1);
        }
      }
      assertCombatChrome(afterDeath, `${formation.name} after first death`);
    }
    expectNoErrors(errors, formation.name);
  });
}

test('reduced-motion portrait chrome is stable after the entrance class clears', async ({ page }) => {
  test.skip(test.info().project.name !== 'portrait', 'portrait chrome regression');
  const errors = collectErrors(page);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await boot(page, { query: 'mesh=0' });
  await page.evaluate(() => { window.spirebound.S.run.act = 1; });
  await startFight(page, ['drownedOne', 'voltEel']);
  await page.evaluate(() => {
    const { S } = window.spirebound;
    S.cb.enemies.forEach((enemy) => { enemy.block = 5; });
    window.__probe.setEnemyHp(0, S.cb.enemies[0].hp);
  });
  await stable(page);

  const settled = await combatChromeRects(page);
  assertGrounded(await measure(page), 'reduced-motion entrance settled');
  assertCombatChrome(settled, 'reduced-motion entrance settled');
  assertEnemyHpChrome(settled, 'reduced-motion entrance settled');
  assertEnemyHpUnderFoe(settled, 'reduced-motion entrance settled');
  // Separated chrome stays on-stage; the row is not forced flush to the right
  // margin (that used to yank landscape HP bars off their foes).
  expect(settled.enemyVisible.at(-1).right, 'rightmost chrome stays inside stage margin')
    .toBeLessThanOrEqual(settled.stage.w - 4);

  await page.evaluate(() => window.spirebound.refitCombat());
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const firstRefit = await combatChromeRects(page);
  expectChromeRectsNear(firstRefit, settled, 'first explicit refit');

  await page.evaluate(() => window.spirebound.refitCombat());
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const secondRefit = await combatChromeRects(page);
  expectChromeRectsNear(secondRefit, settled, 'second explicit refit');
  assertCombatChrome(secondRefit, 'second explicit refit');
  assertEnemyHpChrome(secondRefit, 'second explicit refit');
  assertEnemyHpUnderFoe(secondRefit, 'second explicit refit');
  expectNoErrors(errors, 'reduced-motion entrance clamp');
});

test('portrait intent and status chrome stays separated through death and refits', async ({ page }) => {
  test.skip(test.info().project.name !== 'portrait', 'portrait chrome regression');
  const errors = collectErrors(page);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await boot(page, { query: 'mesh=0' });
  await startFight(page, ['sporeling', 'sporeling', 'sporeling']);
  await page.evaluate(() => {
    const { S } = window.spirebound;
    const statuses = [
      { poison: 3, vulnerable: 2 },
      { weak: 2, frail: 2 },
      { poison: 4, weak: 2 },
    ];
    S.cb.enemies.forEach((enemy, i) => { enemy.statuses = statuses[i]; });
    S.cb.player.statuses = { weak: 2 };
    window.__probe.setEnergy(S.cb.player.energy);
  });
  await stable(page);

  const settled = await combatChromeRects(page);
  assertGrounded(await measure(page), 'status-heavy trio');
  assertEnemyTopChrome(settled, 'status-heavy trio');

  const killed = await page.evaluate(async () => {
    window.__probe.setEnemyHp(0, 1);
    window.__probe.setEnergy(3);
    const [uid] = window.__probe.forceHand(['strike']);
    return window.__probe.play(uid, 0);
  });
  expect(killed, 'status-heavy trio: real strike kills the first member').toBe(true);
  await settle(page);
  await page.waitForSelector('.enemy.gone', { state: 'attached' });
  const afterDeath = await combatChromeRects(page);
  for (let i = 1; i < settled.topVisible.length; i++) {
    for (const edge of ['left', 'right']) {
      expect(Math.abs(afterDeath.topVisible[i][edge] - settled.topVisible[i][edge]),
        `status-heavy trio: survivor top chrome ${i} ${edge} does not jump after death`)
        .toBeLessThanOrEqual(1);
    }
  }
  assertEnemyTopChrome(afterDeath, 'status-heavy trio after death');

  await page.evaluate(() => window.spirebound.refitCombat());
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const afterRefit = await combatChromeRects(page);
  expectChromeRectsNear(afterRefit, afterDeath, 'status-heavy trio explicit refit');
  assertEnemyTopChrome(afterRefit, 'status-heavy trio explicit refit');
  expectNoErrors(errors, 'status-heavy trio top chrome');
});

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

test('desktop pair keeps each HP plate under its own foe', async ({ page }) => {
  test.skip(test.info().project.name !== 'desktop', 'desktop dual-foe HP anchor regression');
  const errors = collectErrors(page);
  await boot(page, { query: 'mesh=0' });
  await page.evaluate(() => { window.spirebound.S.run.act = 0; });
  await startFight(page, ['duskfang', 'duskfang']);
  await page.evaluate(() => {
    const { S } = window.spirebound;
    S.cb.enemies.forEach((enemy) => { enemy.block = 5; });
    window.__probe.setEnemyHp(0, S.cb.enemies[0].hp);
  });
  await stable(page);
  const rects = await combatChromeRects(page);
  assertGrounded(await measure(page), 'desktop duskfang pair');
  assertCombatChrome(rects, 'desktop duskfang pair');
  assertEnemyHpChrome(rects, 'desktop duskfang pair');
  assertEnemyHpUnderFoe(rects, 'desktop duskfang pair', 80);
  expectNoErrors(errors, 'desktop duskfang pair');
});

test('foe HP floor stays put when a hand card lifts', async ({ page }) => {
  test.skip(test.info().project.name !== 'desktop', 'hand-hover chrome floor regression');
  const errors = collectErrors(page);
  await boot(page, { query: 'mesh=0' });
  await startFight(page, ['duskfang', 'sporeling']);
  await page.evaluate(() => window.__probe.forceHand(['strike', 'defend', 'strike', 'defend']));
  await page.waitForSelector('.hand-zone .card');
  await stable(page);
  const before = await combatChromeRects(page);
  // mouse.move — locator.hover() scrollIntoView can shift stage measurements
  const box = await page.locator('.hand-zone .card').first().boundingBox();
  expect(box, 'hand card is on-screen').toBeTruthy();
  await page.mouse.move(box.x + box.width / 2, box.y + 8);
  await page.waitForFunction(() => document.querySelectorAll('.hand-zone .card.lifted').length === 1);
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const hovered = await combatChromeRects(page);
  expect(hovered.enemy.length, 'hover keeps the same enemy plate count').toBe(before.enemy.length);
  before.enemy.forEach((r, i) => {
    expect(Math.abs(hovered.enemy[i].top - r.top),
      `enemy cplate ${i} top does not jump on hand hover`).toBeLessThanOrEqual(1);
    expect(Math.abs(hovered.enemy[i].bottom - r.bottom),
      `enemy cplate ${i} bottom does not jump on hand hover`).toBeLessThanOrEqual(1);
  });
  expectNoErrors(errors, 'hand-hover chrome floor');
});

test('energy candles stay in a fixed frame as slot count grows', async ({ page }) => {
  test.skip(test.info().project.name !== 'desktop', 'energy candle frame regression');
  const errors = collectErrors(page);
  await boot(page, { query: 'mesh=0' });
  await startFight(page, ['duskfang']);
  await stable(page);

  const measure = () => page.evaluate(() => {
    // Task 22b-1: candle frame is Pixi-owned; readUI() reports stage-px bounds.
    const gl = window.spirebound?.combatGl;
    const readUi = gl?.readUI?.();
    const cf = readUi?.candleFrame;
    const resolution = Number(window.spirebound.pixi?.application?.()?.renderer?.resolution)
      || ((window.devicePixelRatio || 1) * (window.__probe.stage().scale || 1));
    if (cf && cf.slots && cf.slots.length > 0) {
      const centres = cf.slots.map((s) => (s.bounds.left + s.bounds.right) / 2);
      const pitches = centres.slice(1).map((cx, i) => cx - centres[i]);
      return {
        frameW: cf.bounds.width,
        frameLeft: cf.bounds.left,
        n: cf.slots.length,
        resolution,
        avgPitch: pitches.length
          ? pitches.reduce((a, b) => a + b, 0) / pitches.length
          : 0,
      };
    }
    // DOM fallback (renderer not booted): the legacy .candles element.
    const info = window.__probe.stage();
    const stage = document.getElementById('stage').getBoundingClientRect();
    const row = document.querySelector('.energy-orb .candles');
    const rr = row.getBoundingClientRect();
    const kids = [...row.querySelectorAll('.candle')].map((c) => {
      const r = c.getBoundingClientRect();
      return ((r.left + r.right) / 2 - stage.left) / info.scale;
    });
    const pitches = kids.slice(1).map((cx, i) => cx - kids[i]);
    return {
      frameW: row.clientWidth,
      frameLeft: (rr.left - stage.left) / info.scale,
      n: kids.length,
      resolution,
      avgPitch: pitches.length
        ? pitches.reduce((a, b) => a + b, 0) / pitches.length
        : 0,
    };
  });

  await page.evaluate(() => {
    const P = window.spirebound.S.cb.player;
    P.energyMax = 3;
    window.__probe.setEnergy(3);
  });
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  const at3 = await measure();
  await page.evaluate(() => {
    const P = window.spirebound.S.cb.player;
    P.energyMax = 5;
    window.__probe.setEnergy(5);
  });
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  const at5 = await measure();

  expect(at3.n, '3 energy slots').toBe(3);
  expect(at5.n, '5 energy slots').toBe(5);
  const authoredW = snapStage(120, at3.resolution);
  expect(at3.frameW, '3-slot frame uses the authored candle box').toBe(authoredW);
  expect(at5.frameW, '5-slot frame stays the authored candle box').toBe(authoredW);
  expect(Math.abs(at5.frameLeft - at3.frameLeft), 'candle frame left edge stays fixed').toBeLessThanOrEqual(1);
  expect(at5.avgPitch, 'more candles compress pitch inside the frame').toBeLessThan(at3.avgPitch - 1);
  expectNoErrors(errors, 'energy candle frame');
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
  test(`canonical single-enemy chrome stays grounded and stage-bounded — ${actor.id}`, async ({ page }) => {
    const errors = collectErrors(page);
    await boot(page, { query: 'mesh=0' });
    await page.evaluate((act) => { window.spirebound.S.run.act = act; }, actor.act);
    await startFight(page, [actor.id], actor.kind);
    await stable(page);
    const geometry = await measure(page);
    assertGrounded(geometry, actor.id);
    expect(await outsideStage(page, '.enemy .cplate,.enemy .top-chrome')).toEqual([]);
    expectNoErrors(errors, actor.id);
  });
}
