import { test, expect } from './trace-fixture.js';
import {
  boot, settle, collectErrors, expectNoErrors,
} from './helpers.js';
import {
  CANONICAL_SHAPES,
  ENGLISH_CONTENT_HASH,
  ENGLISH_UI_HASH,
  ENGLISH_CATALOGUE_HASH,
  TASK10_ENGLISH_CONTENT_HASH,
  TASK10_ENGLISH_UI_HASH,
  TASK10_ENGLISH_CATALOGUE_HASH,
  FRESH_VIGIL,
  GROWN_VIGIL,
  PHASE2_CAPTURE_MANIFEST,
  assertPhase2Manifest,
  seedVigil,
  assertLocaleCatalogue,
  assertCatalogueHashes,
  stageOverflowFacts,
} from './p6-fixtures.js';
import { stagePhase2State } from './p6-phase2-stage.js';
import { completeLedger, mixedLedger, seed, QIDS } from './emberglass-fixtures.js';

assertPhase2Manifest();
expect(ENGLISH_CONTENT_HASH).toBe(TASK10_ENGLISH_CONTENT_HASH);
expect(ENGLISH_UI_HASH).toBe(TASK10_ENGLISH_UI_HASH);
expect(ENGLISH_CATALOGUE_HASH).toBe(TASK10_ENGLISH_CATALOGUE_HASH);

const WEBKIT_OR_DESKTOP = new Set(['desktop', 'iphone-webkit', 'ipad-webkit']);

const SCREEN_SEAMS = Object.freeze([
  {
    id: 'title',
    root: '.r5-title',
    endState: null,
    stage: async (page) => {
      await page.evaluate(() => window.spirebound.show('title'));
    },
  },
  {
    id: 'embark',
    root: '.r5-embark',
    endState: null,
    stage: async (page) => {
      await page.evaluate(() => window.spirebound.show('embark'));
    },
  },
  {
    id: 'reward',
    root: '.r5-rewards',
    endState: 'rewards-ready',
    stage: async (page, profile) => {
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
    },
  },
  {
    id: 'shop',
    root: '.r5-shop',
    endState: 'shop-ready',
    stage: async (page) => {
      await page.evaluate(() => {
        const sp = window.spirebound;
        sp.S.run.player.gold = 400;
        sp.S.shopData = null;
        sp.show('shop');
      });
    },
  },
  {
    id: 'event',
    root: '.r5-event',
    endState: 'event-choice-ready',
    stage: async (page) => {
      await page.evaluate(() => {
        const sp = window.spirebound;
        sp.show('event', sp.E.rollEvent(sp.S.run));
      });
    },
  },
  {
    id: 'rest',
    root: '.r5-rest',
    endState: 'rest-action-ready',
    stage: async (page) => {
      await page.evaluate(() => window.spirebound.show('rest'));
    },
  },
  {
    id: 'treasure',
    root: '.r5-rest.r5-rest--treasure, .r5-rest',
    endState: null,
    stage: async (page) => {
      await page.evaluate(() => window.spirebound.show('treasure'));
    },
  },
  {
    id: 'lamplighter',
    root: '.r5-lamplighter',
    endState: 'lamplighter-ready',
    stage: async (page) => {
      await page.evaluate(() => {
        window.spirebound.S.lamp = null;
        window.spirebound.S.run.pendingLamplighter = true;
        window.spirebound.show('lamplighter');
      });
    },
  },
  {
    id: 'hollow',
    root: '.r5-lamplighter--hollow, .hollow-lamplighter',
    endState: 'hollow-unpaid',
    stage: async (page) => {
      await page.evaluate(() => {
        const sp = window.spirebound;
        const run = sp.S.run;
        run.map = sp.E.genMap(run);
        const node = run.map.nodes[1] || run.map.nodes[0];
        run.nodeId = node.id;
        if (!run.map.visited.includes(node.id)) run.map.visited.push(node.id);
        run.pendingHollow = {
          nodeId: node.id, type: node.type, paid: false, deferred: false, answer: null,
        };
        sp.show('hollow');
      });
    },
  },
  {
    id: 'vigil',
    root: '.r5-vigil',
    endState: 'vigil-ready',
    stage: async (page) => {
      await page.evaluate(() => window.spirebound.show('vigil'));
    },
  },
  {
    id: 'map',
    root: '.r5-map',
    endState: null,
    stage: async (page) => {
      await page.evaluate(() => window.spirebound.show('map'));
    },
  },
  {
    id: 'fall',
    root: '.r5-end.r5-end--fallen',
    endState: null,
    stage: async (page, profile) => {
      await page.evaluate(([grown]) => {
        const sp = window.spirebound;
        const run = sp.S.run;
        run.pendingRunEnd = { outcome: 'death' };
        sp.show('end', {
          won: false,
          offers: grown ? [{ kind: 'gold', amount: 50 }] : [],
          fallAct: 1,
          fallRow: 4,
          unpaidBequest: false,
          ledger: grown ? { whisper: 'The stone keeps the climb.' } : null,
        });
      }, [profile === 'grown']);
    },
  },
  {
    id: 'dawn',
    root: '.r5-end.r5-end--victory',
    endState: null,
    stage: async (page, profile) => {
      await page.evaluate(([grown]) => {
        const sp = window.spirebound;
        const run = sp.S.run;
        run.pendingRunEnd = { outcome: 'win' };
        const events = grown ? [{ t: 'whisper', text: 'The climb continues.' }] : [];
        if (!sp.E.saveRun(run) || !sp.E.stagePendingDawn(run, events, [])) {
          throw new Error('dawn matrix fixture failed');
        }
        sp.show('end', { won: true });
      }, [profile === 'grown']);
    },
  },
]);

async function bootProfile(page, profile, shape = null) {
  const vigil = profile === 'grown' ? GROWN_VIGIL : FRESH_VIGIL;
  await seedVigil(page, vigil);
  const q = ['trace=1', 'mesh=0'];
  if (shape) q.push(`shape=${shape}`);
  await page.goto(`/?${q.join('&')}`);
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
      test(`P6 screen matrix — ${shape} ${profile}`, async ({ page }) => {
        test.skip(test.info().project.name !== 'desktop', 'shape matrix on desktop');
        test.setTimeout(180_000);
        const errors = collectErrors(page);
        await bootProfile(page, profile, shape);
        await startSeededRun(page, {
          seed: 3410 + shape.length,
          reveals: profile === 'grown'
            ? ['phials', 'omens', 'emberglass', 'lamplighter', 'poolWave2']
            : [],
        });
        await assertCatalogueHashes(page, expect);

        for (const screen of SCREEN_SEAMS) {
          await startSeededRun(page, {
            seed: 3410 + shape.length + screen.id.length,
            reveals: profile === 'grown'
              ? ['phials', 'omens', 'emberglass', 'lamplighter', 'act4', 'poolWave2']
              : [],
          });
          await screen.stage(page, profile);
          await settle(page);
          await expect(page.locator(screen.root).first()).toHaveCount(1);
          const profileNode = page.locator(`${screen.root.split(',')[0].trim()}[data-r5-profile], ${screen.root}`).first();
          const profileValue = await profileNode.getAttribute('data-r5-profile');
          if (profileValue) expect(profileValue, `profile on ${screen.id}`).toBe(profile);
          if (screen.endState) {
            if (screen.id === 'hollow') {
              await expect(page.locator('.r5-lamplighter')).toHaveAttribute('data-r5-state', 'hollow-unpaid');
              await page.waitForFunction(() => {
                const root = document.querySelector('.r5-lamplighter');
                return root?.dataset.r5Ceremony === 'hollow-ready'
                  || root?.dataset.r5State === 'hollow-unpaid';
              });
            } else {
              await page.waitForFunction(({ sel, state }) => {
                const el = document.querySelector(sel);
                return el?.dataset.r5State === state;
              }, {
                sel: screen.root.split(',')[0].trim(),
                state: screen.endState,
              });
            }
          }
          if (screen.id === 'title') {
            await expect(page.locator('[data-version-display]')).toBeVisible();
          }
          await assertLocaleCatalogue(page, expect);
        }
        expectNoErrors(errors, `matrix ${shape} ${profile}`);
      });
    }
  }

  test('shop exposes card textures and usurper Phase-2 states via real owners', async ({ page }) => {
    test.skip(test.info().project.name !== 'desktop', 'shop states once on desktop');
    const errors = collectErrors(page);
    await bootProfile(page, 'grown');
    await assertCatalogueHashes(page, expect);

    await stagePhase2State(page, 'usurper-item-normal');
    await expect(page.locator('.quest-shop-item')).toHaveAttribute('data-r5-state', 'usurper-item-normal');
    // Owner PASS locks the shop to live DOM faces (golden parity, f96fefd1) —
    // textured means decoded raster art (or the SVG fallback), not composer keys.
    await page.waitForFunction(() => {
      const arts = [...document.querySelectorAll('.cards-row .card .card-art')];
      return arts.length > 0 && arts.every((art) => {
        const img = art.querySelector('img');
        return img ? (img.complete && img.naturalWidth > 0) : !!art.querySelector('svg');
      });
    });
    const cardFaces = await page.locator('.cards-row .card .card-art').count();
    expect(cardFaces).toBeGreaterThan(0);

    await stagePhase2State(page, 'usurper-item-poor');
    await expect(page.locator('.quest-shop-item')).toHaveAttribute('data-r5-state', 'usurper-item-poor');

    await stagePhase2State(page, 'usurper-item-sold');
    await expect(page.locator('.quest-shop-item')).toHaveAttribute('data-r5-state', 'usurper-item-sold');

    await stagePhase2State(page, 'usurper-item-save-blocked');
    await expect(page.locator('.quest-shop-item')).toHaveAttribute('data-r5-state', 'usurper-item-save-blocked');
    await expect(page.locator('#overlay.open #run-save-failure[data-r5-state="usurper-item-save-blocked"]')).toBeVisible();

    await assertLocaleCatalogue(page, expect);
    expectNoErrors(errors, 'shop usurper');
  });

  test('Hollow payment / save / recovery states via real owners', async ({ page }) => {
    test.skip(test.info().project.name !== 'desktop', 'hollow once on desktop');
    test.setTimeout(120_000);
    const errors = collectErrors(page);
    await bootProfile(page, 'grown');

    await stagePhase2State(page, 'hollow-unpaid');
    await expect(page.locator('.r5-lamplighter')).toHaveAttribute('data-r5-state', 'hollow-unpaid');
    await expect(page.locator('.r5-lamplighter')).toHaveAttribute('data-r5-ceremony', 'hollow-ready');

    await stagePhase2State(page, 'hollow-pay-pressed');
    await expect(page.locator('.r5-lamplighter')).toHaveAttribute('data-r5-state', 'hollow-pay-pressed');

    await stagePhase2State(page, 'hollow-save-retry');
    await expect(page.locator('.r5-lamplighter')).toHaveAttribute('data-r5-state', 'hollow-save-retry');

    await stagePhase2State(page, 'hollow-paid');
    await expect(page.locator('.r5-lamplighter')).toHaveAttribute('data-r5-state', 'hollow-paid');

    await stagePhase2State(page, 'hollow-route-recovery');
    await expect(page.locator('.r5-lamplighter')).toHaveAttribute('data-r5-state', 'hollow-route-recovery');

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
    await assertCatalogueHashes(page, expect);

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
    await assertCatalogueHashes(page, expect);
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
    const actionable = errors.filter((err) => !/due to access control checks/i.test(err));
    expectNoErrors(actionable, `p6 journey ${testInfo.project.name}`);
  });
});
