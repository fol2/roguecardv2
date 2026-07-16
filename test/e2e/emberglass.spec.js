import { test, expect } from './trace-fixture.js';
import {
  freshLedger, mixedLedger, completeLedger, seed, QIDS, stagePendingRunEnd,
  PERSISTED_EIGHTH_TEXT, PERSISTED_SHADE_TEXT, waitForDawnComplete,
} from './emberglass-fixtures.js';

async function persistenceTrace(page, kind) {
  return page.evaluate((selectedKind) => window.__probe.behaviourTrace().records
    .filter((record) => record.eventName.startsWith('persistence.') && record.attributes?.kind === selectedKind)
    .map((record) => [record.eventName, record.phase, record.outcome ?? null]), kind);
}

test.describe('desktop Emberglass behaviour', () => {
  test.beforeEach(async ({ page }) => {
    if (test.info().project.use.reducedMotion === 'reduce') {
      await page.emulateMedia({ reducedMotion: 'reduce' });
    }
    test.skip(test.info().project.name !== 'desktop', 'Emberglass behaviour runs once on desktop');
  });

test('fresh profile exposes no Rose tab or medallion', async ({ page }) => {
  await seed(page, freshLedger());
  await page.click('[data-a="vigil"]');
  await expect(page.locator('[data-a="tab-rose"]')).toHaveCount(0);
  await page.click('[data-a="back"]');
  await expect(page.locator('.title-rose-medallion')).toHaveCount(0);
});

test('one shard adds a title medallion that opens the Rose', { tag: '@smoke' }, async ({ page }) => {
  const v = mixedLedger();
  await seed(page, v);
  const medallion = page.locator('.title-rose-medallion[data-a="rose"]');
  // Asset decode is async; wait for the namespaced ready state before class/enable asserts.
  await expect(medallion).toHaveAttribute('data-r5-state', 'title-rose-ready', { timeout: 15_000 });
  await expect(medallion).toHaveClass(/ready/);
  await expect(medallion).toBeEnabled();
  await page.evaluate(() => { window.__probe.forceRoseFallback(true); });
  const fallback = page.locator('.title-rose-medallion.title-rose-fallback[data-a="rose"]');
  await expect(fallback).toHaveCount(1);
  await expect(fallback).toHaveAttribute('aria-label', /.+/);
  await expect(fallback).toHaveAttribute('data-r5-state', 'title-rose-ready');
  await page.evaluate(() => { window.__probe.forceRoseFallback(false); });
  await expect(medallion).toHaveAttribute('data-r5-state', 'title-rose-ready', { timeout: 15_000 });
  await expect(medallion).toHaveClass(/ready/);
  await page.click('[data-a="rose"]');
  await expect(page.locator('[data-a="tab-rose"]')).toHaveClass(/on/);
  await expect(page.locator('.rose-window.ready')).toHaveCount(1);
});

test('Title Rose exposes loading then ready, and keyboard focus when ready', async ({ page }) => {
  test.skip(test.info().project.name !== 'desktop', 'Title Rose phase coverage runs once on desktop');
  const v = mixedLedger();
  await page.addInitScript(() => {
    const decode = HTMLImageElement.prototype.decode;
    HTMLImageElement.prototype.decode = function decodeRoseAssetSlow() {
      if (this.src.includes('emberglass-mural')) {
        return new Promise((resolve, reject) => {
          this.__roseResolve = resolve;
          this.__roseReject = reject;
          // leave pending until probe advances — starts as loading
        });
      }
      return decode.call(this);
    };
  });
  await seed(page, v);
  const medallion = page.locator('.title-rose-medallion[data-a="rose"]');
  await expect(medallion).toHaveAttribute('data-r5-state', 'title-rose-loading');
  await expect(medallion).toBeDisabled();
  await page.evaluate(() => {
    for (const image of document.querySelectorAll('.title-rose-preload img')) {
      if (typeof image.__roseResolve === 'function') image.__roseResolve();
    }
  });
  await expect(medallion).toHaveClass(/ready/);
  await expect(medallion).toHaveAttribute('data-r5-state', 'title-rose-ready');
  await medallion.focus();
  await expect(medallion).toBeFocused();
});

test('Rose panes disclose only their current state', async ({ page }) => {
  const v = mixedLedger(); // dormant, armed, revealed, complete in fixed quest order
  await seed(page, v);
  await page.click('[data-a="vigil"]');
  await page.click('[data-a="tab-rose"]');
  await expect(page.locator('.rose-pane[data-quest="paleOnes"]')).toHaveClass(/armed/);
  await expect(page.locator('.rose-pane[data-quest="paleOnes"]')).toContainText('???');
  await expect(page.locator('.rose-pane[data-quest="ownShade"]')).toContainText('1/3');
  await expect(page.locator('.rose-pane[data-quest="usurper"]')).toHaveClass(/complete/);
  await expect(page.locator('.rose-pane[data-quest="usurper"]')).toHaveClass(/lit/);
  await expect(page.locator('.rose-pane.dormant').filter({ hasText: 'Hollow' })).toHaveCount(0);
  await expect(page.locator('.rose-pane.dormant[data-quest]')).toHaveCount(0);
  await expect(page.locator('.rose-window.rose-assets')).toHaveClass(/ready/);
  await expect(page.locator('.whisper-row')).toHaveCount(v.whispers);
  await page.click('[data-a="back"]');
  const medallion = page.locator('.title-rose-medallion');
  await expect(medallion).toHaveClass(/ready/);
  await expect(medallion).toBeEnabled();
  const pane = medallion.locator('.title-rose-pane');
  await expect(pane).toHaveCount(1);
  expect(await pane.evaluate((node) => getComputedStyle(node).backgroundImage))
    .toContain('emberglass-mural');
  expect(await pane.evaluate((node) => getComputedStyle(node).maskImage
    || getComputedStyle(node).webkitMaskImage)).toContain('emberglass-mask-usurper');
  await expect(medallion.locator('.title-rose-composite > img'))
    .toHaveAttribute('src', /emberglass-frame/);
  await expect(medallion.locator('.title-rose-preload img')).toHaveCount(8);
  await medallion.click();
  await expect(page.locator('.rose-window.rose-assets')).toHaveClass(/ready/);
});

test('Pale Ones discloses the 0/3 hunt before the Lens and the cumulative 3/9 mote trail after it', async ({ page }) => {
  const hunt = freshLedger();
  hunt.deeds.runs = 1;
  hunt.deeds.wins = 1;
  hunt.runsPlayed = 1;
  hunt.quests.paleOnes = { state: 'revealed', progress: 0, memory: {} };
  await seed(page, hunt);
  await page.click('[data-a="vigil"]');
  await page.click('[data-a="tab-rose"]');
  const huntControl = page.getByRole('button', { name: 'Hunt the Pale Ones, 0 of 3', exact: true });
  await expect(huntControl).toHaveCount(1);
  await huntControl.click();
  await expect(page.locator('#rose-pane-detail .rose-detail-name')).toHaveText('Hunt the Pale Ones');
  await expect(page.locator('#rose-pane-detail .rose-detail-progress')).toHaveText('0/3');
  await expect(page.locator('#rose-pane-detail')).not.toContainText('0/9');

  const lens = structuredClone(hunt);
  lens.unlocks.push('insight:witchlightLens');
  lens.quests.paleOnes.progress = 3;
  await seed(page, lens);
  await page.click('[data-a="vigil"]');
  await page.click('[data-a="tab-rose"]');
  const lensControl = page.getByRole('button', { name: 'The Pale Ones, 3 of 9', exact: true });
  await expect(lensControl).toHaveCount(1);
  await lensControl.click();
  await expect(page.locator('#rose-pane-detail .rose-detail-name')).toHaveText('The Pale Ones');
  await expect(page.locator('#rose-pane-detail .rose-detail-progress')).toHaveText('3/9');
});

test('title Rose stays inert when any asset fails to decode', async ({ page }) => {
  await page.addInitScript(() => {
    const decode = HTMLImageElement.prototype.decode;
    HTMLImageElement.prototype.decode = function decodeRoseAsset() {
      if (this.src.includes('emberglass-mural')) return Promise.reject(new Error('injected mural decode failure'));
      return decode.call(this);
    };
  });
  await seed(page, mixedLedger());
  const medallion = page.locator('.title-rose-medallion');
  await expect(medallion).toHaveCount(1);
  await expect(medallion).not.toHaveClass(/ready/);
  await expect(medallion).toHaveAttribute('data-r5-state', 'title-rose-inert');
  await expect(medallion).toBeDisabled();
  // FE contract: inert remains visible at reduced opacity, but non-interactive.
  await expect(medallion).toBeVisible();
  await medallion.evaluate((node) => node.click());
  expect(await page.evaluate(() => window.__probe.state().screen)).toBe('title');
});

test('Title Rose REDUCED terminal is ready without a loading hold', async ({ page }) => {
  test.skip(test.info().project.name !== 'desktop', 'REDUCED Rose terminal runs once on desktop');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await seed(page, mixedLedger());
  const medallion = page.locator('.title-rose-medallion[data-a="rose"]');
  await expect(medallion).toHaveClass(/ready/);
  await expect(medallion).toHaveAttribute('data-r5-state', 'title-rose-ready');
  await expect(page.locator('.r5-title')).toHaveAttribute('data-motion', 'reduced');
  await expect(page.locator('.r5-title')).toHaveAttribute('data-r5-state', 'title-ready');
});

test('opening Vigil clears only the news pulse', async ({ page }) => {
  const v = mixedLedger();
  await seed(page, v);
  await page.click('[data-a="vigil"]');
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('spirebound_vigil_v2')));
  expect(stored.news).toBe(false);
  expect(stored.quests).toEqual(v.quests);
  expect(stored.shards).toEqual(v.shards);
  expect(stored.whispers).toBe(v.whispers);
});

test('six shards expose a promise, never Act 4 gameplay', async ({ page }) => {
  const v = completeLedger();
  await seed(page, v);
  await page.evaluate(() => {
    const sp = window.spirebound;
    sp.S.run = sp.E.newRun(9001, {
      reveals: ['omens', 'phials', 'poolWave2', 'poolWave3', 'poolFull', 'emberglass', 'act4'],
      quests: JSON.parse(localStorage.getItem('spirebound_vigil_v2')).quests,
      shards: JSON.parse(localStorage.getItem('spirebound_vigil_v2')).shards,
    });
    sp.S.run.act = 2;
    sp.S.run.map = sp.E.genMap(sp.S.run);
    sp.show('map');
  });
  await page.evaluate(() => window.__probe.freeze());
  await expect(page.locator('[data-a="sealed-door"]')).toHaveCount(1);
  const before = await page.evaluate(() => ({
    run: JSON.stringify(window.spirebound.S.run),
    save: localStorage.getItem('spirebound_save_v2'),
  }));
  await page.click('[data-a="sealed-door"]');
  await expect(page.locator('.sealed-door-panel')).toContainText('the climb continues');
  await page.click('[data-a="close-door"]');
  expect(await page.evaluate(() => window.spirebound.S.run.act)).toBe(2);
  expect(await page.evaluate(() => window.spirebound.S.run.nodeId)).toBe(null);
  expect(await page.evaluate(() => JSON.stringify(window.spirebound.S.run))).toBe(before.run);
  expect(await page.evaluate(() => localStorage.getItem('spirebound_save_v2'))).toBe(before.save);
});

test('dawn ceremony drains in canonical order and signals completion', async ({ page }) => {
  await seed(page, completeLedger());
  await page.evaluate(({ questIds }) => {
    const sp = window.spirebound;
    const previous = questIds.slice(0, 5);
    const run = sp.E.newRun(9002, {
      reveals: ['emberglass', 'act4'],
      shards: previous,
    });
    run.endQueue = [
      { t: 'questReveal', id: 'hollowLamplighter' },
      { t: 'questProgress', id: 'hollowLamplighter', progress: 5, target: 5 },
      { t: 'questComplete', id: 'hollowLamplighter' },
    ];
    run.pendingRunEnd = { outcome: 'win' };
    const events = [
      { t: 'whisper', text: 'The climb continues.' },
      { t: 'questReveal', id: 'hollowLamplighter' },
      { t: 'questProgress', id: 'hollowLamplighter', progress: 5, target: 5 },
      { t: 'shardGrant', id: 'hollowLamplighter' },
      { t: 'act4Reveal' },
    ];
    if (!sp.E.saveRun(run) || !sp.E.stagePendingDawn(run, events, [])) {
      throw new Error('dawn presentation did not stage');
    }
    sp.S.run = run;
    sp.show('end', { won: true });
  }, { questIds: QIDS });

  await waitForDawnComplete(page);
  await expect(page.locator('.r5-end.r5-end--victory, .end-screen')).toHaveCount(1);
  await expect(page.locator('.dawn-event')).toHaveCount(5);
  await expect(page.locator('.dawn-event').evaluateAll((nodes) => nodes.map((node) => node.dataset.event)))
    .resolves.toEqual(['whisper', 'questReveal', 'questProgress', 'shardGrant', 'act4Reveal']);
  expect(await page.evaluate(() => localStorage.getItem('spirebound_save_v2'))).toBeNull();
});

test('pending win recovers once through the production terminal outbox', async ({ page }) => {
  const staged = await stagePendingRunEnd(page, 'win');
  await page.reload();
  await page.waitForFunction(() => window.spirebound && window.__probe?.state().screen === 'end');
  await expect(page.locator('[data-event="eighthResolved"]')).toContainText(PERSISTED_EIGHTH_TEXT);

  const reduced = await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const endButtons = page.locator('.end-btns button');
  if (!reduced) {
    // Capture and exercise the lock in one browser task. Separate Playwright
    // round trips can let the remaining ceremony panels finish between the
    // disabled-state assertion and the synthetic click on a loaded runner.
    const locked = await page.evaluate(() => {
      const buttons = [...document.querySelectorAll('.end-btns button')];
      const pending = JSON.parse(localStorage.getItem('spirebound_save_v2'))?.pendingDawn != null;
      const menuCount = document.querySelectorAll('[data-act="menu"]').length;
      const abandonCount = document.querySelectorAll('[data-m="abandon"]').length;
      document.querySelector('[data-a="title"]').click();
      return {
        disabled: buttons.map((button) => button.disabled), pending, menuCount, abandonCount,
        screen: window.__probe.state().screen,
      };
    });
    expect(locked).toEqual({
      disabled: [true, true], pending: true, menuCount: 0, abandonCount: 0, screen: 'end',
    });
  }

  await waitForDawnComplete(page);
  expect(await endButtons.evaluateAll((buttons) => buttons.map((button) => button.disabled)))
    .toEqual([false, false]);
  await expect(page.locator('.dawn-event').evaluateAll((nodes) => nodes.map((node) => node.dataset.event)))
    .resolves.toEqual([
      'whisper', 'questReveal', 'questProgress', 'eighthResolved',
      'shadeResolved', 'shardGrant', 'act4Reveal',
    ]);
  await expect(page.locator('[data-event="shadeResolved"]')).toContainText(PERSISTED_SHADE_TEXT);

  const once = await page.evaluate(() => ({
    vigil: JSON.parse(localStorage.getItem('spirebound_vigil_v2')),
    stats: JSON.parse(localStorage.getItem('spirebound_stats_v1')),
    save: localStorage.getItem('spirebound_save_v2'),
  }));
  expect(once.save).toBeNull();
  expect(once.stats).toMatchObject({ runs: 6, wins: 6, lastRunId: staged.runId });
  expect(once.vigil.deeds).toMatchObject({ runs: 6, wins: 6, perfects: 3 });
  expect(once.vigil.runsPlayed).toBe(6);
  expect(once.vigil.whispers).toBe(24);
  expect(once.vigil.shards).toEqual(QIDS);
  expect(once.vigil.receipts.deeds).toEqual({
    runId: staged.runId,
    won: true,
    newUnlocks: ['card:flawlessForm', 'relic:prismCharm'],
  });
  expect(once.vigil.receipts.runEnd).toEqual({
    runId: staged.runId,
    outcome: 'win',
    whisper: 'The climb continues.',
    armed: [],
    completed: ['hollowLamplighter'],
    newShards: ['hollowLamplighter'],
  });

  await page.click('[data-a="title"]');
  await page.waitForFunction(() => window.__probe.state().screen === 'title');
  await page.waitForTimeout(1800);
  await expect(page.locator('.unlock-toast')).toHaveCount(0);
  await expect(page.locator('.dawn-event')).toHaveCount(0);

  await page.reload();
  await page.waitForFunction(() => window.spirebound && window.__probe?.state().screen === 'title');
  const twice = await page.evaluate(() => ({
    vigil: JSON.parse(localStorage.getItem('spirebound_vigil_v2')),
    stats: JSON.parse(localStorage.getItem('spirebound_stats_v1')),
    save: localStorage.getItem('spirebound_save_v2'),
  }));
  expect(twice).toEqual(once);
});

test('run-end persistence failure owns input until finalisation retries', async ({ page }) => {
  await stagePendingRunEnd(page, 'death');
  await page.addInitScript(() => {
    const original = Storage.prototype.setItem;
    window.__rejectRunEndVigil = true;
    Storage.prototype.setItem = function rejectRunEnd(key, value) {
      if (key === 'spirebound_vigil_v2' && window.__rejectRunEndVigil) {
        throw new Error('injected run-end Vigil failure');
      }
      return original.call(this, key, value);
    };
  });
  await page.reload();
  // `boot()` is fire-and-forget in main.js, so reload's load can resolve before
  // fonts/pixi finish and show('title') opens the run-end persistence plate.
  // CI after a heavy dawn test routinely exceeds the default 5s expect window.
  await page.waitForFunction(() => {
    const records = window.__probe?.behaviourTrace?.()?.records;
    if (Array.isArray(records) && records.some((record) => record.eventName === 'app.ready')) {
      return true;
    }
    return !!document.querySelector('#overlay.open [data-a="retry-end"]');
  });

  await expect(page.locator('.ov-title')).toHaveText('The Vigil Could Not Hold');
  await expect(page.locator('#shake')).toHaveJSProperty('inert', true);
  await expect(page.locator('[data-a="retry-end"]')).toBeFocused();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('spirebound_save_v2'))?.pendingRunEnd))
    .toEqual({ outcome: 'death' });

  await page.evaluate(() => { window.__rejectRunEndVigil = false; });
  await page.click('[data-a="retry-end"]');
  await page.waitForFunction(() => window.spirebound?.S.screen === 'end');
  await expect(page.locator('#shake')).toHaveJSProperty('inert', false);
  expect(await page.evaluate(() => localStorage.getItem('spirebound_save_v2'))).toBeNull();
  const runEndTrace = await persistenceTrace(page, 'run-end');
  expect(runEndTrace).toEqual([
    ['persistence.attempt', 'point', 'accepted'],
    ['persistence.blocked', 'point', 'rejected'],
    ['persistence.attempt', 'point', 'accepted'],
    ['persistence.recovered', 'point', 'completed'],
  ]);
});

test('normal-motion reload resumes only unacknowledged dawn panels', async ({ page }) => {
  test.skip(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches),
    'the checkpoint timing contract is specifically normal motion');
  const staged = await stagePendingRunEnd(page, 'win');
  // Capture, pin, freeze durable save mutations, and reload in one page-side
  // poller. A Playwright round-trip after cursor===2 lets the in-flight 550ms
  // panel acknowledge and overwrite a localStorage pin before navigation lands.
  await page.reload();
  const reloaded = page.waitForEvent('load');
  await page.evaluate(() => new Promise((resolve, reject) => {
    const started = Date.now();
    const tick = () => {
      if (Date.now() - started > 30_000) {
        reject(new Error('missed the normal-motion cursor===2 dawn window'));
        return;
      }
      if (!(window.spirebound && window.__probe?.state().screen === 'end')) {
        setTimeout(tick, 10);
        return;
      }
      const run = JSON.parse(localStorage.getItem('spirebound_save_v2') || 'null');
      const pending = run?.pendingDawn;
      if (!pending || pending.cursor !== 2 || pending.cursor >= pending.events.length) {
        setTimeout(tick, 10);
        return;
      }
      if (!sessionStorage.getItem('spirebound_dawn_checkpoint')) {
        sessionStorage.setItem('spirebound_dawn_checkpoint', JSON.stringify({
          cursor: pending.cursor,
          acknowledged: pending.events.slice(0, pending.cursor),
          remaining: pending.events.slice(pending.cursor),
          vigilRaw: localStorage.getItem('spirebound_vigil_v2'),
          statsRaw: localStorage.getItem('spirebound_stats_v1'),
        }));
      }
      // Pin cursor===2 and freeze further save-key mutations. Patching E.saveRun is
      // useless here — advancePendingDawn closes over the module-local saveRun.
      pending.cursor = 2;
      if (window.spirebound.S.run?.pendingDawn) {
        window.spirebound.S.run.pendingDawn.cursor = 2;
      }
      const setItem = Storage.prototype.setItem;
      const removeItem = Storage.prototype.removeItem;
      setItem.call(localStorage, 'spirebound_save_v2', JSON.stringify(run));
      Storage.prototype.setItem = function freezeDawnSave(key, value) {
        if (key === 'spirebound_save_v2') return;
        return setItem.call(this, key, value);
      };
      Storage.prototype.removeItem = function freezeDawnClear(key) {
        if (key === 'spirebound_save_v2') return;
        return removeItem.call(this, key);
      };
      location.reload();
      resolve();
    };
    tick();
  }));
  await reloaded;
  const checkpoint = await page.evaluate(() =>
    JSON.parse(sessionStorage.getItem('spirebound_dawn_checkpoint')));
  expect(checkpoint.cursor).toBe(2);

  await page.waitForFunction(() => window.spirebound && window.__probe?.state().screen === 'end');
  await waitForDawnComplete(page);
  const shownTypes = await page.locator('.dawn-event').evaluateAll((nodes) =>
    nodes.map((node) => node.dataset.event));
  expect(shownTypes).toEqual(checkpoint.remaining.map((event) => event.t));
  for (const event of checkpoint.acknowledged) {
    expect(shownTypes).not.toContain(event.t);
  }
  if (checkpoint.remaining.some((event) => event.t === 'eighthResolved')) {
    await expect(page.locator('[data-event="eighthResolved"]')).toContainText(PERSISTED_EIGHTH_TEXT);
  }
  if (checkpoint.remaining.some((event) => event.t === 'shadeResolved')) {
    await expect(page.locator('[data-event="shadeResolved"]')).toContainText(PERSISTED_SHADE_TEXT);
  }

  const completed = await page.evaluate(() => ({
    vigilRaw: localStorage.getItem('spirebound_vigil_v2'),
    statsRaw: localStorage.getItem('spirebound_stats_v1'),
    save: localStorage.getItem('spirebound_save_v2'),
  }));
  expect(completed.vigilRaw).toBe(checkpoint.vigilRaw);
  expect(completed.statsRaw).toBe(checkpoint.statsRaw);
  expect(completed.save).toBeNull();
  expect(JSON.parse(completed.statsRaw)).toMatchObject({ lastRunId: staged.runId });
  await page.reload();
  await page.waitForFunction(() => window.spirebound && window.__probe?.state().screen === 'title');
  await expect(page.locator('.dawn-event')).toHaveCount(0);
});

test('a rejected dawn cursor save stays locked and retries the same panel', async ({ page }) => {
  await seed(page, freshLedger());
  await page.evaluate(() => {
    const sp = window.spirebound;
    const run = sp.E.newRun(9401);
    run.pendingRunEnd = { outcome: 'win' };
    if (!sp.E.saveRun(run) || !sp.E.stagePendingDawn(run, [
      { t: 'eighthResolved', text: 'CURSOR FAILURE COPY' },
    ], [])) throw new Error('cursor-failure dawn did not stage');
    window.__dawnSetItem = Storage.prototype.setItem;
    window.__rejectDawnSet = true;
    Storage.prototype.setItem = function (key, value) {
      if (key === 'spirebound_save_v2' && window.__rejectDawnSet) throw new Error('injected dawn cursor failure');
      return window.__dawnSetItem.call(this, key, value);
    };
    sp.S.run = run;
    sp.show('end', { won: true });
  });

  await expect(page.locator('#dawn-save-failure .ov-title')).toHaveText('The Dawn Could Not Hold', {
    timeout: 30_000,
  });
  await expect(page.locator('#overlay .ov-sub')).toContainText('This panel was shown');
  await expect(page.locator('#shake')).toHaveJSProperty('inert', true);
  await expect(page.locator('[data-a="retry-dawn"]')).toBeFocused();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('spirebound_save_v2')).pendingDawn.cursor)).toBe(0);
  expect(await page.locator('.end-btns button').evaluateAll((buttons) => buttons.map((button) => button.disabled)))
    .toEqual([true, true]);
  await page.evaluate(() => { window.__rejectDawnSet = false; });
  await page.click('[data-a="retry-dawn"]');
  await waitForDawnComplete(page);
  await expect(page.locator('#shake')).toHaveJSProperty('inert', false);
  await expect(page.locator('[data-event="eighthResolved"]')).toContainText('CURSOR FAILURE COPY');
  expect(await page.evaluate(() => localStorage.getItem('spirebound_save_v2'))).toBeNull();
  await page.evaluate(() => { Storage.prototype.setItem = window.__dawnSetItem; });
  const cursorTrace = await persistenceTrace(page, 'dawn-cursor');
  expect(cursorTrace).toEqual([
    ['persistence.attempt', 'point', 'accepted'],
    ['persistence.blocked', 'point', 'rejected'],
    ['persistence.attempt', 'point', 'accepted'],
    ['persistence.recovered', 'point', 'completed'],
  ]);
});

test('a rejected final dawn clear stays locked and retryable', async ({ page }) => {
  await seed(page, freshLedger());
  await page.evaluate(() => {
    const sp = window.spirebound;
    const run = sp.E.newRun(9402);
    run.pendingRunEnd = { outcome: 'win' };
    if (!sp.E.saveRun(run) || !sp.E.stagePendingDawn(run, [], [])) {
      throw new Error('clear-failure dawn did not stage');
    }
    window.__dawnRemoveItem = Storage.prototype.removeItem;
    window.__rejectDawnClear = true;
    Storage.prototype.removeItem = function (key) {
      if (key === 'spirebound_save_v2' && window.__rejectDawnClear) throw new Error('injected dawn clear failure');
      return window.__dawnRemoveItem.call(this, key);
    };
    sp.S.run = run;
    sp.show('end', { won: true });
  });

  await expect(page.locator('#dawn-save-failure .ov-title')).toHaveText('The Dawn Could Not Hold', {
    timeout: 30_000,
  });
  await expect(page.locator('#overlay .ov-sub')).toContainText('Every panel has been seen');
  await expect(page.locator('#shake')).toHaveJSProperty('inert', true);
  await expect(page.locator('[data-a="retry-dawn"]')).toBeFocused();
  const pending = await page.evaluate(() => JSON.parse(localStorage.getItem('spirebound_save_v2')).pendingDawn);
  expect(pending).toEqual({ events: [], cursor: 0, newUnlocks: [] });
  expect(await page.locator('.end-btns button').evaluateAll((buttons) => buttons.map((button) => button.disabled)))
    .toEqual([true, true]);
  await page.evaluate(() => { window.__rejectDawnClear = false; });
  await page.click('[data-a="retry-dawn"]');
  await waitForDawnComplete(page);
  await expect(page.locator('#shake')).toHaveJSProperty('inert', false);
  expect(await page.evaluate(() => localStorage.getItem('spirebound_save_v2'))).toBeNull();
  await page.evaluate(() => { Storage.prototype.removeItem = window.__dawnRemoveItem; });
  const clearTrace = await persistenceTrace(page, 'dawn-clear');
  expect(clearTrace).toEqual([
    ['persistence.attempt', 'point', 'accepted'],
    ['persistence.blocked', 'point', 'rejected'],
    ['persistence.attempt', 'point', 'accepted'],
    ['persistence.recovered', 'point', 'completed'],
  ]);
});

for (const outcome of ['death', 'abandon']) {
  test(`pending ${outcome} recovers once without a dawn ceremony`, async ({ page }) => {
    const staged = await stagePendingRunEnd(page, outcome);
    await page.reload();
    const expectedScreen = outcome === 'death' ? 'end' : 'title';
    await page.waitForFunction((screen) =>
      window.spirebound && window.__probe?.state().screen === screen, expectedScreen);
    await expect(page.locator('.dawn-ceremony')).toHaveCount(0);

    const once = await page.evaluate(() => ({
      vigil: JSON.parse(localStorage.getItem('spirebound_vigil_v2')),
      stats: JSON.parse(localStorage.getItem('spirebound_stats_v1')),
      save: localStorage.getItem('spirebound_save_v2'),
    }));
    expect(once.save).toBeNull();
    expect(once.stats).toMatchObject({ runs: 6, wins: 5, lastRunId: staged.runId });
    expect(once.vigil.deeds.runs).toBe(outcome === 'death' ? 6 : 5);
    expect(once.vigil.deeds.wins).toBe(5);
    expect(once.vigil.runsPlayed).toBe(6);
    expect(once.vigil.whispers).toBe(23);
    expect(once.vigil.shards).toEqual(QIDS.slice(0, 5));
    expect(once.vigil.receipts.deeds).toEqual(outcome === 'death' ? {
      runId: staged.runId, won: false, newUnlocks: [],
    } : null);
    expect(once.vigil.receipts.runEnd).toEqual({
      runId: staged.runId,
      outcome,
      whisper: null,
      armed: [],
      completed: [],
      newShards: [],
    });

    await page.reload();
    await page.waitForFunction(() => window.spirebound && window.__probe?.state().screen === 'title');
    const twice = await page.evaluate(() => ({
      vigil: JSON.parse(localStorage.getItem('spirebound_vigil_v2')),
      stats: JSON.parse(localStorage.getItem('spirebound_stats_v1')),
      save: localStorage.getItem('spirebound_save_v2'),
    }));
    expect(twice).toEqual(once);
  });
}
});

test('Rose pane details disclose safely through click and keyboard', async ({ page }) => {
  await seed(page, mixedLedger());
  await page.click('[data-a="vigil"]');
  await page.waitForTimeout(600);
  await page.click('[data-a="tab-rose"]');
  await expect(page.locator('.rose-window.rose-assets')).toHaveClass(/ready/);

  const controls = page.locator('.rose-pane-select');
  const detail = page.locator('#rose-pane-detail');
  await expect(controls).toHaveCount(6);
  await expect(page.locator('.rose-pane-copy:not([aria-hidden="true"])')).toHaveCount(0);
  await expect(detail).toHaveAttribute('role', 'region');
  await expect(detail).toHaveAttribute('aria-live', 'polite');

  const armed = page.getByRole('button', { name: 'Unknown Emberglass pane 1' });
  const revealed = page.getByRole('button', { name: 'Your Own Shade, 1 of 3', exact: true });
  await expect(revealed).toHaveAttribute('aria-pressed', 'true');
  await expect(detail.locator('.rose-detail-inscription'))
    .toHaveText('Defeat the self that remembers falling. Three shades must fall.');

  await armed.focus();
  await page.keyboard.press('Enter');
  await expect(armed).toHaveAttribute('aria-pressed', 'true');
  await expect(detail).toHaveText('???');

  await revealed.click();
  await expect(detail.locator('.rose-detail-name')).toHaveText('Your Own Shade');
  await expect(detail.locator('.rose-detail-inscription'))
    .toHaveText('Defeat the self that remembers falling. Three shades must fall.');
  await expect(detail.locator('.rose-detail-progress')).toHaveText('1/3');

  const complete = page.getByRole('button', { name: 'The Usurper, Shard recovered', exact: true });
  await complete.click();
  await expect(detail).toHaveText(/The Usurper\s*Shard recovered/);
  await expect(detail.locator('.rose-detail-inscription')).toHaveCount(0);

  const dormant = page.getByRole('button', { name: 'Dormant Emberglass pane 4' });
  await dormant.click();
  await expect(detail).toHaveText('This pane is dark.');
  await expect(detail).not.toContainText('Eighth');
  await expect(page.getByRole('button', { name: /Eighth Omen|Hollow Lamplighter/ })).toHaveCount(0);

  await armed.click();
  await expect(detail).toHaveText('???');
});

for (const shape of [
  'phone-portrait', 'pad-portrait', 'phone-landscape', 'pad-landscape', 'desktop-landscape',
]) {
  test(`Rose pane detail stays legible and bounded — ${shape}`, { tag: '@serial' }, async ({ page }) => {
    await page.addInitScript((vigil) => {
      localStorage.removeItem('spirebound_save_v2');
      localStorage.setItem('spirebound_vigil_v2', JSON.stringify(vigil));
    }, mixedLedger());
    await page.goto(`/?shape=${shape}`);
    await page.waitForFunction(() => window.spirebound && window.__probe);
    for (const fallback of [false, true]) {
      const context = `${shape} ${fallback ? 'fallback' : 'assets'}`;
      if (fallback) {
        await page.evaluate(() => window.__probe.forceRoseFallback(true));
      } else {
        await page.click('[data-a="vigil"]');
        await page.click('[data-a="tab-rose"]');
      }
      if (fallback) await expect(page.locator('.rose-window.rose-fallback')).toHaveCount(1);
      else await expect(page.locator('.rose-window.rose-assets')).toHaveClass(/ready/);
      expect((await page.evaluate(() => window.__probe.stage())).shape, context).toBe(shape);

      const stateFontMins = [];
      for (const name of [
        'Unknown Emberglass pane 1',
        'Your Own Shade, 1 of 3',
        'The Usurper, Shard recovered',
        'Dormant Emberglass pane 4',
      ]) {
        await page.getByRole('button', { name, exact: true }).click();
        stateFontMins.push(await page.locator('#rose-pane-detail').evaluate((detail) => {
          const visibleText = [detail, ...detail.querySelectorAll('*')].filter((node) => {
            const style = getComputedStyle(node);
            return node.textContent.trim() && style.display !== 'none' && style.visibility !== 'hidden';
          });
          return Math.min(...visibleText.map((node) => Number.parseFloat(getComputedStyle(node).fontSize)));
        }));
      }
      await page.getByRole('button', { name: 'Your Own Shade, 1 of 3', exact: true }).click();

      const geometry = await page.evaluate(() => {
        const scale = window.__probe.stage().scale;
        const stage = document.getElementById('stage').getBoundingClientRect();
        const panel = document.querySelector('.vigil-panel');
        const detail = document.getElementById('rose-pane-detail');
        const box = detail.getBoundingClientRect();
        const panelBox = panel.getBoundingClientRect();
        const controls = [...document.querySelectorAll('.rose-pane-select')].map((control) => {
          const rect = control.getBoundingClientRect();
          return {
            left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom,
            width: rect.width / scale, height: rect.height / scale,
          };
        });
        const inside = (inner, outer) => inner.left >= outer.left - 1 && inner.right <= outer.right + 1 &&
          inner.top >= outer.top - 1 && inner.bottom <= outer.bottom + 1;
        const labelContainment = [...document.querySelectorAll('.rose-pane')].map((pane, index) => {
          const copy = pane.querySelector('.rose-pane-copy');
          const control = pane.querySelector('.rose-pane-select');
          if (!copy || !control || getComputedStyle(copy).display === 'none') return { index, inside: true };
          const copyRect = copy.getBoundingClientRect();
          const controlRect = control.getBoundingClientRect();
          return {
            index, inside: inside(copyRect, controlRect),
            copy: { width: copyRect.width / scale, height: copyRect.height / scale },
            control: { width: controlRect.width / scale, height: controlRect.height / scale },
            overflow: [copy.scrollWidth - copy.clientWidth, copy.scrollHeight - copy.clientHeight],
          };
        });
        return {
          detailVisible: box.width > 0 && box.height > 0,
          detailInsideStage: inside(box, stage),
          detailInsidePanel: inside(box, panelBox),
          detailOverflow: [detail.scrollWidth - detail.clientWidth, detail.scrollHeight - detail.clientHeight],
          panelOverflow: [panel.scrollWidth - panel.clientWidth, panel.scrollHeight - panel.clientHeight],
          labelContainment,
          controls,
        };
      });

      expect(geometry.detailVisible, context).toBe(true);
      expect(geometry.detailInsideStage, context).toBe(true);
      expect(geometry.detailInsidePanel, context).toBe(true);
      expect(geometry.detailOverflow.every((amount) => amount <= 1), context).toBe(true);
      expect(geometry.panelOverflow.every((amount) => amount <= 1), context).toBe(true);
      const missedLabels = geometry.labelContainment.filter((label) => !label.inside);
      expect(missedLabels, `${context}: visible pane labels must be clickable`).toEqual([]);
      const clippedLabels = geometry.labelContainment
        .filter((label) => label.overflow?.some((amount) => amount > 1));
      expect(clippedLabels, `${context}: visible pane labels must not clip`).toEqual([]);
      expect(stateFontMins.every((fontPx) => fontPx >= 12), context).toBe(true);
      expect(geometry.controls.every(({ width, height }) => width >= 44 && height >= 44), context).toBe(true);
      for (let i = 0; i < geometry.controls.length; i++) {
        for (let j = i + 1; j < geometry.controls.length; j++) {
          const a = geometry.controls[i], b = geometry.controls[j];
          const overlaps = a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
          expect(overlaps, `${context}: Rose touch targets ${i} and ${j} overlap`).toBe(false);
        }
      }
    }
  });
}

test('sealed door ignores a phone-landscape drag and opens on a later tap', async ({ page }) => {
  test.skip(test.info().project.name !== 'landscape', 'touch drag runs once in phone landscape');
  await seed(page, completeLedger());
  await page.evaluate(() => {
    const sp = window.spirebound;
    const vigil = JSON.parse(localStorage.getItem('spirebound_vigil_v2'));
    sp.S.run = sp.E.newRun(9300, {
      reveals: ['emberglass', 'act4'], quests: vigil.quests, shards: vigil.shards,
    });
    sp.S.run.act = 2;
    sp.S.run.map = sp.E.genMap(sp.S.run);
    sp.show('map');
  });
  await expect(page.locator('[data-a="sealed-door"]')).toHaveCount(1);

  const openedDuringDrag = await page.evaluate(() => {
    const map = document.querySelector('.map-screen');
    const fire = (type, y) => map.dispatchEvent(new PointerEvent(type, {
      bubbles: true, pointerType: 'touch', clientX: 200, clientY: y,
    }));
    fire('pointerdown', 180);
    fire('pointermove', 220);
    fire('pointerup', 220);
    document.querySelector('[data-a="sealed-door"]').click();
    return document.querySelector('#overlay').classList.contains('open');
  });
  expect(openedDuringDrag).toBe(false);
  await page.waitForTimeout(100);
  await page.locator('[data-a="sealed-door"]').tap();
  await expect(page.locator('.sealed-door-panel')).toContainText('the climb continues');
});
