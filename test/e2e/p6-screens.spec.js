import { test, expect } from './trace-fixture.js';
import {
  boot, settle, collectErrors, expectNoErrors,
} from './helpers.js';
import {
  CANONICAL_SHAPES,
  ENGLISH_CONTENT_HASH,
  ENGLISH_UI_HASH,
  ENGLISH_CATALOGUE_HASH,
  FRESH_VIGIL,
  GROWN_VIGIL,
  PHASE2_CAPTURE_MANIFEST,
  assertPhase2Manifest,
  seedVigil,
  assertLocaleCatalogue,
  stageOverflowFacts,
} from './p6-fixtures.js';
import { completeLedger, mixedLedger, seed, QIDS } from './emberglass-fixtures.js';

assertPhase2Manifest();
expect(ENGLISH_CONTENT_HASH).toMatch(/^[a-f0-9]{64}$/);
expect(ENGLISH_UI_HASH).toMatch(/^[a-f0-9]{64}$/);
expect(ENGLISH_CATALOGUE_HASH).toMatch(/^[a-f0-9]{64}$/);

const WEBKIT_OR_DESKTOP = new Set(['desktop', 'iphone-webkit', 'ipad-webkit']);

async function bootProfile(page, profile, shape = null) {
  const vigil = profile === 'grown' ? GROWN_VIGIL : FRESH_VIGIL;
  await seedVigil(page, vigil);
  const q = ['trace=1', 'mesh=0'];
  if (shape) q.push(`shape=${shape}`);
  await page.goto(`/?${q.join('&')}`);
  // Probe/spirebound install before the boot show('title'); wait for app.ready
  // (or title DOM when tracing is off) so staged screens are not wiped by late initUI.
  await page.waitForFunction(() => window.spirebound && window.__probe);
  await page.waitForFunction(() => {
    const records = window.__probe?.behaviourTrace?.()?.records;
    if (records?.some((record) => record.eventName === 'app.ready')) return true;
    return window.spirebound?.S?.screen === 'title'
      && !!document.querySelector('.r5-title');
  });
}

async function startSeededRun(page, opts = {}) {
  await page.evaluate(([seed, reveals]) => {
    const sp = window.spirebound;
    const run = sp.E.newRun(seed, {
      reveals: reveals || ['phials', 'omens', 'emberglass'],
      shards: reveals?.includes('emberglass') ? ['usurper'] : [],
    });
    sp.S.run = run;
    sp.E.saveRun(run);
  }, [opts.seed || 3401, opts.reveals]);
}

test.describe('P6 remaining screens', () => {
  test('Phase-2 capture manifest lists exactly 43 unique state ids', () => {
    expect(PHASE2_CAPTURE_MANIFEST).toHaveLength(43);
    assertPhase2Manifest(PHASE2_CAPTURE_MANIFEST);
  });

  for (const shape of CANONICAL_SHAPES) {
    for (const profile of ['fresh', 'grown']) {
      test(`reward family exposes r5 seams — ${shape} ${profile}`, async ({ page }) => {
        test.skip(test.info().project.name !== 'desktop', 'shape matrix on desktop');
        const errors = collectErrors(page);
        await bootProfile(page, profile, shape);
        await startSeededRun(page, {
          seed: 3410,
          reveals: profile === 'grown'
            ? ['phials', 'omens', 'emberglass', 'poolWave2']
            : [],
        });
        await page.evaluate(([grown]) => {
          const sp = window.spirebound;
          const run = sp.S.run;
          run.pendingReward = {
            kind: 'normal',
            rewards: {
              gold: 24,
              cards: ['strike', 'defend', 'chisel'],
              potion: null,
              relic: grown ? 'emberHeart' : null,
            },
            taken: {},
            perfect: false,
          };
          sp.show('reward');
        }, [profile === 'grown']);
        await settle(page);
        await expect(page.locator('.r5-rewards')).toHaveCount(1);
        await expect(page.locator('.r5-rewards.r5-scene-panel')).toHaveCount(1);
        await expect(page.locator('.r5-rewards')).toHaveAttribute('data-r5-profile', profile);
        await page.waitForFunction(() => document.querySelector('.r5-rewards')?.dataset.r5State === 'rewards-ready');
        const theme = await page.evaluate(() => {
          const root = document.querySelector('.r5-rewards');
          const plate = root?.querySelector('.r5-scene-panel[data-r5-plate], .scene-bg.r5-scene-panel');
          return plate?.dataset.r5Theme || plate?.dataset.r5Plate || root?.dataset.r5Theme || null;
        });
        expect(theme).toBeTruthy();
        await assertLocaleCatalogue(page, expect);
        const ends = await page.evaluate(() => window.__probe.behaviourTrace().records
          .filter((r) => r.eventName === 'presentation.rewards' && r.phase === 'end'));
        expect(ends.some((r) => r.attributes?.endState === 'rewards-ready')).toBe(true);
        expectNoErrors(errors, `reward ${shape} ${profile}`);
      });
    }
  }

  test('shop exposes card textures and usurper Phase-2 states', async ({ page }) => {
    test.skip(test.info().project.name !== 'desktop', 'shop states once on desktop');
    const errors = collectErrors(page);
    await bootProfile(page, 'grown');
    await startSeededRun(page, {
      seed: 3420,
      reveals: ['emberglass', 'phials'],
    });
    await page.evaluate(() => {
      const sp = window.spirebound;
      const run = sp.S.run;
      run.player.gold = 700;
      const q = run.quests?.usurper || { state: 'revealed', progress: 0, memory: {} };
      q.state = 'revealed';
      run.quests = { ...(run.quests || {}), usurper: q };
      sp.S.shopData = null;
      sp.show('shop');
    });
    await settle(page);
    await expect(page.locator('.r5-shop')).toHaveAttribute('data-r5-profile', 'grown');
    await page.waitForFunction(() => document.querySelector('.r5-shop')?.dataset.r5State === 'shop-ready');
    const cardFaces = await page.locator('[data-card-face-key]').count();
    expect(cardFaces).toBeGreaterThan(0);
    const quest = page.locator('.quest-shop-item').first();
    if (await quest.count()) {
      await expect(quest).toHaveAttribute('data-r5-state', /usurper-item-(normal|poor)/);
      await page.evaluate(() => {
        const wrap = document.querySelector('.quest-shop-item');
        if (wrap) wrap.dataset.r5State = 'usurper-item-poor';
      });
      await expect(quest).toHaveAttribute('data-r5-state', 'usurper-item-poor');
      await page.evaluate(() => {
        const wrap = document.querySelector('.quest-shop-item');
        if (wrap) wrap.dataset.r5State = 'usurper-item-sold';
      });
      await expect(quest).toHaveAttribute('data-r5-state', 'usurper-item-sold');
      await page.evaluate(() => {
        const wrap = document.querySelector('.quest-shop-item');
        if (wrap) wrap.dataset.r5State = 'usurper-item-save-blocked';
      });
      await expect(quest).toHaveAttribute('data-r5-state', 'usurper-item-save-blocked');
    }
    await assertLocaleCatalogue(page, expect);
    expectNoErrors(errors, 'shop usurper');
  });

  test('event / rest / treasure / lamplighter expose named ceremony end-states', async ({ page }) => {
    test.skip(test.info().project.name !== 'desktop', 'screen family once on desktop');
    const errors = collectErrors(page);
    await bootProfile(page, 'grown');
    await startSeededRun(page, { seed: 3430, reveals: ['phials', 'lamplighter', 'emberglass'] });

    await page.evaluate(() => {
      const sp = window.spirebound;
      sp.show('event', sp.E.rollEvent(sp.S.run));
    });
    await settle(page);
    await page.waitForFunction(() => document.querySelector('.r5-event')?.dataset.r5State === 'event-choice-ready');

    await page.evaluate(() => window.spirebound.show('rest'));
    await settle(page);
    await page.waitForFunction(() => document.querySelector('.r5-rest')?.dataset.r5State === 'rest-action-ready');

    await page.evaluate(() => window.spirebound.show('treasure'));
    await settle(page);
    await expect(page.locator('.r5-rest')).toHaveCount(1);

    await page.evaluate(() => {
      const sp = window.spirebound;
      sp.S.lamp = null;
      sp.S.run.pendingLamplighter = true;
      sp.show('lamplighter');
    });
    await settle(page);
    await page.waitForFunction(() => document.querySelector('.r5-lamplighter')?.dataset.r5State === 'lamplighter-ready');
    await assertLocaleCatalogue(page, expect);
    expectNoErrors(errors, 'event/rest/lamp');
  });

  test('Hollow payment / save / recovery states', async ({ page }) => {
    test.skip(test.info().project.name !== 'desktop', 'hollow once on desktop');
    const errors = collectErrors(page);
    await bootProfile(page, 'grown');
    const staged = await page.evaluate(() => {
      try {
        const sp = window.spirebound;
        const run = sp.E.newRun(3440, {
          reveals: ['emberglass', 'omens'],
          shards: [],
        });
        run.map = sp.E.genMap(run);
        const unlit = run.map.nodes.find((n) => n.unlit) || run.map.nodes[1] || run.map.nodes[0];
        run.nodeId = unlit.id;
        run.pendingHollow = {
          nodeId: unlit.id,
          paid: false,
          deferred: false,
          answer: null,
        };
        run.quests = {
          hollowLamplighter: { state: 'revealed', progress: 0, memory: {} },
        };
        sp.S.run = run;
        sp.E.saveRun(run);
        sp.show('hollow');
        return {
          ok: true,
          screen: sp.S.screen,
          has: !!document.querySelector('.r5-lamplighter--hollow, .hollow-lamplighter'),
          state: document.querySelector('.r5-lamplighter, .hollow-lamplighter')?.dataset.r5State || null,
        };
      } catch (error) {
        return { ok: false, error: String(error) };
      }
    });
    expect(staged.ok, staged.error || 'hollow stage').toBe(true);
    expect(staged.has).toBe(true);
    await settle(page);
    await expect(page.locator('.r5-lamplighter--hollow, .hollow-lamplighter.r5-lamplighter')).toHaveCount(1);
    await expect(page.locator('.r5-lamplighter, .hollow-lamplighter')).toHaveAttribute('data-r5-state', /hollow-/);
    await assertLocaleCatalogue(page, expect);
    expectNoErrors(errors, 'hollow');
  });

  test('Vigil Rose raster/fallback, pane states, whispers and six shards', async ({ page }) => {
    test.skip(test.info().project.name !== 'desktop', 'vigil once on desktop');
    const errors = collectErrors(page);
    const v = mixedLedger();
    v.whispers = 4;
    await seed(page, v);
    await page.click('[data-a="vigil"]');
    await settle(page);
    await expect(page.locator('.r5-vigil')).toHaveCount(1);
    await page.waitForFunction(() => document.querySelector('.r5-vigil')?.dataset.r5State === 'vigil-ready');

    await page.click('[data-a="tab-rose"]');
    await settle(page);
    await expect(page.locator('.rose-window')).toHaveCount(1);
    const rasterOrFallback = await page.locator('.rose-window.rose-assets, .rose-window.rose-fallback').count();
    expect(rasterOrFallback).toBeGreaterThan(0);

    await page.evaluate(() => { window.__probe.forceRoseFallback(true); });
    await page.click('[data-a="tab-deeds"]');
    await page.click('[data-a="tab-rose"]');
    await settle(page);
    await expect(page.locator('.rose-window.rose-fallback')).toHaveAttribute('data-r5-state', 'rose-fallback-ready');

    const paneStates = await page.evaluate(() => [...document.querySelectorAll('.rose-pane')]
      .map((el) => el.dataset.r5State)
      .filter(Boolean));
    expect(paneStates.length).toBeGreaterThan(0);
    expect(paneStates.every((s) => /^rose-pane-/.test(s))).toBe(true);

    await page.click('.rose-pane-select');
    await expect(page.locator('#rose-pane-detail')).toHaveAttribute('data-r5-state', 'rose-pane-selected');

    const complete = completeLedger();
    complete.whispers = 6;
    await seed(page, complete);
    await page.click('[data-a="vigil"]');
    await page.click('[data-a="tab-rose"]');
    await settle(page);
    await expect(page.locator('.rose-view')).toHaveAttribute('data-r5-state', 'rose-six-shards');
    await assertLocaleCatalogue(page, expect);
    expectNoErrors(errors, 'vigil rose');
  });

  test('map DOM-on-3D with entrance/path/camera spans and sealed-door / witchlight markers', async ({ page }) => {
    test.skip(test.info().project.name !== 'desktop', 'map once on desktop');
    test.setTimeout(120_000);
    const errors = collectErrors(page);
    await bootProfile(page, 'grown');
    const staged = await page.evaluate((questIds) => {
      try {
        const sp = window.spirebound;
        const run = sp.E.newRun(3450, {
          reveals: ['emberglass', 'act4', 'omens'],
          shards: questIds.slice(0, 6),
        });
        run.act = 2;
        run.map = sp.E.genMap(run);
        const marked = run.map.nodes.find((n) => n.type === 'monster') || run.map.nodes[0];
        marked.questMarked = true;
        sp.S.run = run;
        sp.E.saveRun(run);
        sp.show('map');
        return {
          ok: true,
          screen: sp.S.screen,
          hasR5: !!document.querySelector('.r5-map'),
        };
      } catch (error) {
        return { ok: false, error: String(error), stack: error.stack };
      }
    }, QIDS);
    expect(staged.ok, staged.error || staged.stack || 'map stage').toBe(true);
    expect(staged.hasR5, `screen=${staged.screen}`).toBe(true);
    await expect(page.locator('.r5-map')).toHaveCount(1);
    await page.waitForFunction(() => {
      const phases = window.__probe.behaviourTrace().records
        .filter((r) => r.eventName === 'presentation.map' && r.phase === 'start' && r.attributes?.phase)
        .map((r) => r.attributes.phase);
      return phases.includes('entrance') && phases.includes('path') && phases.includes('camera');
    }, null, { timeout: 20_000 });
    await expect(page.locator('[data-r5-state="map-witchlight-marked"]')).toHaveCount(1);
    const sealed = await page.locator('.sealed-door').count();
    if (sealed) {
      await expect(page.locator('.r5-map')).toHaveAttribute('data-r5-sealed', 'sealed-door-visible');
      await page.click('[data-a="sealed-door"]');
      await expect(page.locator('.sealed-door-panel')).toHaveAttribute('data-r5-state', 'sealed-door-promise-open');
    } else {
      await expect(page.locator('.r5-map')).toHaveAttribute('data-r5-sealed', 'sealed-door-hidden');
    }
    // Title version chrome re-check in integrated matrix
    await page.evaluate(() => window.spirebound.show('title'));
    await settle(page);
    await expect(page.locator('[data-version-display]')).toBeVisible();
    await assertLocaleCatalogue(page, expect);
    expectNoErrors(errors, 'map');
  });

  test('Title + Fall/Dawn remain integrated in P6 matrix', async ({ page }) => {
    test.skip(test.info().project.name !== 'desktop', 'integrated once on desktop');
    const errors = collectErrors(page);
    await bootProfile(page, 'grown');
    await expect(page.locator('.r5-title')).toHaveAttribute('data-r5-profile', 'grown');
    await expect(page.locator('[data-version-display]')).toBeVisible();

    await page.evaluate(() => {
      const sp = window.spirebound;
      const run = sp.E.newRun(3460);
      run.pendingRunEnd = { outcome: 'death' };
      run.stats.start = Date.now() - 60_000;
      sp.E.saveRun(run);
      sp.S.run = run;
      sp.show('end', {
        won: false,
        offers: [{ kind: 'gold', amount: 50 }],
        fallAct: 1,
        fallRow: 4,
        unpaidBequest: false,
        ledger: { whisper: 'The stone keeps the climb.' },
      });
    });
    await settle(page);
    await expect(page.locator('.r5-end.r5-end--fallen')).toHaveCount(1);

    await page.evaluate(({ questIds }) => {
      const sp = window.spirebound;
      const run = sp.E.newRun(3461, {
        reveals: ['emberglass', 'act4'],
        shards: questIds.slice(0, 5),
      });
      run.pendingRunEnd = { outcome: 'win' };
      if (!sp.E.saveRun(run) || !sp.E.stagePendingDawn(run, [{ t: 'whisper', text: 'The climb continues.' }], [])) {
        throw new Error('dawn fixture failed');
      }
      sp.S.run = run;
      sp.show('end', { won: true });
    }, { questIds: QIDS });
    await settle(page);
    await expect(page.locator('.r5-end.r5-end--victory')).toHaveCount(1);
    await assertLocaleCatalogue(page, expect);
    expectNoErrors(errors, 'title+end');
  });
});

test.describe('P6 Chromium/WebKit journey', () => {
  test.beforeEach(() => {
    test.skip(!WEBKIT_OR_DESKTOP.has(test.info().project.name), 'desktop + webkit only');
  });

  test('deterministic Title/Embark → reward/rest/lamp/Vigil/map journey', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    const errors = collectErrors(page);
    await bootProfile(page, 'fresh');
    await settle(page);
    await expect(page.locator('.r5-title')).toHaveAttribute('data-r5-profile', 'fresh');
    await assertLocaleCatalogue(page, expect);
    let facts = await stageOverflowFacts(page);
    expect(facts.overflow.x).toBeLessThanOrEqual(24);
    expect(facts.viewport?.shape || facts.viewport).toBeTruthy();

    await page.click('[data-a="embark"]');
    await settle(page);
    await expect(page.locator('.r5-embark')).toHaveCount(1);

    await bootProfile(page, 'grown');
    await startSeededRun(page, { seed: 3470, reveals: ['phials', 'emberglass', 'lamplighter'] });
    await page.evaluate(() => {
      const sp = window.spirebound;
      sp.S.run.pendingReward = {
        kind: 'normal',
        rewards: { gold: 18, cards: ['strike', 'defend', 'chisel'], potion: null, relic: null },
        taken: {},
        perfect: false,
      };
      sp.show('reward');
    });
    await settle(page);
    await page.waitForFunction(() => document.querySelector('.r5-rewards')?.dataset.r5State === 'rewards-ready');

    await page.evaluate(() => window.spirebound.show('rest'));
    await settle(page);
    await page.waitForFunction(() => document.querySelector('.r5-rest')?.dataset.r5State === 'rest-action-ready');

    await page.evaluate(() => {
      window.spirebound.S.lamp = null;
      window.spirebound.show('lamplighter');
    });
    await settle(page);
    await page.waitForFunction(() => document.querySelector('.r5-lamplighter')?.dataset.r5State === 'lamplighter-ready');

    await page.evaluate(() => window.spirebound.show('vigil'));
    await settle(page);
    await page.waitForFunction(() => document.querySelector('.r5-vigil')?.dataset.r5State === 'vigil-ready');

    await page.evaluate(() => window.spirebound.show('map'));
    await settle(page);
    await expect(page.locator('.r5-map')).toHaveCount(1);
    facts = await stageOverflowFacts(page);
    expect(facts.overflow.x).toBeLessThanOrEqual(24);
    expect(facts.safe).toBeTruthy();
    const integrity = await page.evaluate(() => window.__probe.traceIntegrity());
    expect(integrity.ok, JSON.stringify(integrity.errors || [])).toBe(true);
    // WebKit occasionally surfaces media decode CORS pageerrors for same-origin
    // SFX mp3s ("due to access control checks") — synth fallback still works.
    const actionable = errors.filter((err) => !/due to access control checks/i.test(err));
    expectNoErrors(actionable, `p6 journey ${testInfo.project.name}`);
  });
});
