import { test, expect } from './trace-fixture.js';
import {
  freshLedger, completeLedger, seed, QIDS, stagePendingRunEnd, waitForDawnComplete,
} from './emberglass-fixtures.js';

const FALL_PHASES = ['plate-rise', 'chisel', 'ember-spray', 'bequest', 'whisper', 'stats'];
const DAWN_PHASES = ['bloom', 'ascended-parallax', 'queue', 'ledger', 'close'];
const DAWN_OWNERS = [
  'whisper', 'questReveal', 'questProgress', 'questUnlock', 'pageRead',
  'eighthResolved', 'shadeResolved', 'questComplete', 'shardGrant', 'act4Reveal',
];

const DAWN_HELD = {
  whisper: 'dawn-whisper-held',
  questReveal: 'dawn-quest-reveal-held',
  questProgress: 'dawn-quest-progress-held',
  questUnlock: 'dawn-quest-unlock-held',
  pageRead: 'dawn-page-read-held',
  eighthResolved: 'dawn-eighth-resolved-held',
  shadeResolved: 'dawn-shade-resolved-held',
  questComplete: 'dawn-quest-complete-held',
  shardGrant: 'dawn-shard-grant-held',
  act4Reveal: 'dawn-act' + '4-promise-held',
};

async function persistenceTrace(page, kind) {
  return page.evaluate((selectedKind) => window.__probe.behaviourTrace().records
    .filter((record) => record.eventName.startsWith('persistence.') && record.attributes?.kind === selectedKind)
    .map((record) => [record.eventName, record.phase, record.outcome ?? null]), kind);
}

function presentationEnds(records, name) {
  return records.filter((record) => record.eventName === `presentation.${name}` && record.phase === 'end');
}

test.describe('Fall and Dawn ceremonies', () => {
  test.beforeEach(async ({ page }) => {
    if (test.info().project.use.reducedMotion === 'reduce') {
      await page.emulateMedia({ reducedMotion: 'reduce' });
    }
    test.skip(test.info().project.name !== 'desktop', 'end ceremonies run once on desktop');
  });

  test('Fall ceremony order is plate-rise→chisel→ember-spray→bequest→whisper→stats', async ({ page }) => {
    await seed(page, freshLedger(), '/?trace=1');
    await page.evaluate(() => {
      const sp = window.spirebound;
      const run = sp.E.newRun(3310);
      run.pendingRunEnd = { outcome: 'death' };
      run.stats.start = Date.now() - 60_000;
      if (!sp.E.saveRun(run)) throw new Error('fall fixture did not save');
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

    await expect(page.locator('.r5-end.r5-end--fallen')).toHaveCount(1);
    await expect(page.locator('.r5-monument')).toHaveCount(1);
    await expect(page.locator('.end-title')).toHaveText('FALLEN');
    await page.waitForFunction(() => document.querySelector('.r5-end')?.dataset.r5State === 'monument-engraved');

    const phases = await page.evaluate(() => window.__probe.behaviourTrace().records
      .filter((record) => record.eventName === 'presentation.fall' && record.phase === 'start'
        && record.attributes?.phase)
      .map((record) => record.attributes.phase));
    expect(phases).toEqual(FALL_PHASES);

    const fallEnds = await page.evaluate(() => window.__probe.behaviourTrace().records
      .filter((record) => record.eventName === 'presentation.fall' && record.phase === 'end'
        && record.attributes?.endState === 'monument-engraved'));
    expect(fallEnds.length).toBeGreaterThanOrEqual(1);
    expect(fallEnds.at(-1).outcome).toBe('settled');
  });

  test('Dawn ceremony order is bloom→ascended-parallax→queue→ledger→close', async ({ page }) => {
    await seed(page, completeLedger(), '/?trace=1');
    await page.evaluate(({ questIds }) => {
      const sp = window.spirebound;
      const run = sp.E.newRun(3311, {
        reveals: ['emberglass', 'act4'],
        shards: questIds.slice(0, 5),
      });
      run.pendingRunEnd = { outcome: 'win' };
      const events = [
        { t: 'whisper', text: 'The climb continues.' },
        { t: 'shardGrant', id: 'hollowLamplighter' },
      ];
      if (!sp.E.saveRun(run) || !sp.E.stagePendingDawn(run, events, [])) {
        throw new Error('dawn order fixture did not stage');
      }
      sp.S.run = run;
      sp.show('end', { won: true });
    }, { questIds: QIDS });

    await expect(page.locator('.r5-end.r5-end--victory')).toHaveCount(1);
    await expect(page.locator('.r5-dawn-ledger')).toHaveCount(1);
    await expect(page.locator('.end-title')).toHaveText('ASCENDED');
    await waitForDawnComplete(page);
    await page.waitForFunction(() => document.querySelector('.r5-end')?.dataset.r5State === 'dawn-closed');

    const phases = await page.evaluate(() => window.__probe.behaviourTrace().records
      .filter((record) => record.eventName === 'presentation.dawn' && record.phase === 'start'
        && record.attributes?.phase)
      .map((record) => record.attributes.phase));
    expect(phases).toEqual(DAWN_PHASES);

    const dawnEnds = await page.evaluate(() => window.__probe.behaviourTrace().records
      .filter((record) => record.eventName === 'presentation.dawn' && record.phase === 'end'
        && record.attributes?.endState === 'dawn-closed'));
    expect(dawnEnds.at(-1)?.outcome).toBe('settled');
  });

  test('pending-dawn survives reload and REDUCED lands one terminal frame', async ({ page }) => {
    await stagePendingRunEnd(page, 'win');
    await page.reload();
    await page.waitForFunction(() => window.spirebound?.S.screen === 'end');
    const pending = await page.evaluate(() => JSON.parse(localStorage.getItem('spirebound_save_v2'))?.pendingDawn);
    expect(pending).toBeTruthy();
    expect(Array.isArray(pending.events)).toBe(true);

    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload();
    await page.waitForFunction(() => window.spirebound?.S.screen === 'end');
    await waitForDawnComplete(page);

    await expect(page.locator('.r5-end')).toHaveAttribute('data-r5-state', 'dawn-closed');
    await expect(page.locator('.r5-end')).toHaveAttribute('data-motion', 'reduced');
    await expect(page.locator('.r5-dawn-bloom')).toHaveCSS('opacity', '0.42');

    const ends = await page.evaluate(() => window.__probe.behaviourTrace().records
      .filter((record) => record.eventName === 'presentation.dawn' && record.phase === 'end'));
    expect(ends.length).toBeGreaterThanOrEqual(1);
    expect(ends.every((record) => record.outcome === 'settled')).toBe(true);
    expect(ends.some((record) => record.attributes?.endState === 'dawn-closed'
      && record.attributes?.motion === 'reduced'
      && record.attributes?.phase == null)).toBe(true);
    const parentStarts = await page.evaluate(() => window.__probe.behaviourTrace().records
      .filter((record) => record.eventName === 'presentation.dawn' && record.phase === 'start'
        && record.attributes?.phase == null));
    expect(parentStarts.length).toBeGreaterThanOrEqual(1);
  });

  for (const owner of DAWN_OWNERS) {
    test(`Dawn owner presentation: ${owner}`, async ({ page }) => {
      await seed(page, completeLedger(), '/?trace=1');
      await page.evaluate(({ eventType, questIds }) => {
        const sp = window.spirebound;
        const run = sp.E.newRun(3320 + questIds.indexOf(eventType) + 1, {
          reveals: ['emberglass', 'act4'],
          shards: questIds.slice(0, 5),
        });
        run.pendingRunEnd = { outcome: 'win' };
        const event = (() => {
          switch (eventType) {
            case 'whisper': return { t: 'whisper', text: 'Owner whisper sentinel.' };
            case 'questReveal': return { t: 'questReveal', id: 'hollowLamplighter' };
            case 'questProgress': return { t: 'questProgress', id: 'hollowLamplighter', progress: 3, target: 5 };
            case 'questUnlock': return { t: 'questUnlock', id: 'insight:witchlightLens' };
            case 'pageRead': return { t: 'pageRead', index: 2, text: 'Page owner sentinel.' };
            case 'eighthResolved': return { t: 'eighthResolved', text: 'Eighth owner sentinel.' };
            case 'shadeResolved': return { t: 'shadeResolved', text: 'Shade owner sentinel.' };
            case 'questComplete': return { t: 'questComplete', id: 'hollowLamplighter' };
            case 'shardGrant': return { t: 'shardGrant', id: 'hollowLamplighter' };
            case 'act4Reveal': return { t: 'act4Reveal' };
            default: throw new Error(`unknown dawn owner ${eventType}`);
          }
        })();
        if (!sp.E.saveRun(run) || !sp.E.stagePendingDawn(run, [event], [])) {
          throw new Error(`${eventType} dawn fixture did not stage`);
        }
        sp.S.run = run;
        sp.show('end', { won: true });
      }, { eventType: owner, questIds: QIDS });

      await waitForDawnComplete(page);
      await expect(page.locator(`.dawn-event[data-event="${owner}"]`)).toHaveCount(1);
      if (owner === 'act4Reveal') {
        await expect(page.locator('[data-a="open-act4"], [data-route="act4"], .act4-route')).toHaveCount(0);
      }

      const held = await page.evaluate(({ eventType, heldState }) => {
        const records = window.__probe.behaviourTrace().records
          .filter((record) => record.eventName === 'presentation.dawn-panel'
            && record.phase === 'end'
            && record.attributes?.owner === eventType);
        return {
          count: records.length,
          endState: records.at(-1)?.attributes?.endState ?? null,
          outcome: records.at(-1)?.outcome ?? null,
          hasReplay: records.some((record) => record.replay?.kind === 'dawn-panel'
            || record.attributes?.replayKind === 'dawn-panel'),
        };
      }, { eventType: owner, heldState: DAWN_HELD[owner] });
      expect(held.count).toBeGreaterThanOrEqual(1);
      expect(held.endState).toBe(DAWN_HELD[owner]);
      expect(held.outcome).toBe('settled');
    });
  }

  test('Dawn cursor-save retry keeps overlay inert/focus and run-effects owner', async ({ page }) => {
    await seed(page, freshLedger(), '/?trace=1');
    await page.evaluate(() => {
      const sp = window.spirebound;
      const run = sp.E.newRun(3341);
      run.pendingRunEnd = { outcome: 'win' };
      if (!sp.E.saveRun(run) || !sp.E.stagePendingDawn(run, [
        { t: 'eighthResolved', text: 'CURSOR OWNER SENTINEL' },
      ], [])) throw new Error('cursor-retry fixture did not stage');
      const original = Storage.prototype.setItem;
      window.__rejectDawnCursor = true;
      Storage.prototype.setItem = function setItem(key, value) {
        if (key === 'spirebound_save_v2' && window.__rejectDawnCursor) {
          throw new Error('injected dawn cursor failure');
        }
        return original.call(this, key, value);
      };
      sp.S.run = run;
      sp.show('end', { won: true });
    });

    await expect(page.locator('#dawn-save-failure')).toBeVisible({ timeout: 30_000 });
    await expect(page.locator('[data-a="retry-dawn"]')).toBeFocused({ timeout: 10_000 });
    await expect(page.locator('#shake')).toHaveJSProperty('inert', true);
    await expect(page.locator('#dawn-save-failure, [data-r5-state="dawn-cursor-retry"]')).toHaveCount(1);
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem('spirebound_save_v2')).pendingDawn.cursor)).toBe(0);

    await page.evaluate(() => { window.__rejectDawnCursor = false; });
    await page.click('[data-a="retry-dawn"]');
    await waitForDawnComplete(page);
    await expect(page.locator('#shake')).toHaveJSProperty('inert', false);
    expect(await persistenceTrace(page, 'dawn-cursor')).toEqual([
      ['persistence.attempt', 'point', 'accepted'],
      ['persistence.blocked', 'point', 'rejected'],
      ['persistence.attempt', 'point', 'accepted'],
      ['persistence.recovered', 'point', 'completed'],
    ]);
  });

  test('Dawn final-clear retry keeps overlay inert/focus and run-effects owner', async ({ page }) => {
    await seed(page, freshLedger(), '/?trace=1');
    await page.evaluate(() => {
      const sp = window.spirebound;
      const run = sp.E.newRun(3342);
      run.pendingRunEnd = { outcome: 'win' };
      if (!sp.E.saveRun(run) || !sp.E.stagePendingDawn(run, [], [])) {
        throw new Error('clear-retry fixture did not stage');
      }
      const original = Storage.prototype.removeItem;
      window.__rejectDawnClear = true;
      Storage.prototype.removeItem = function removeItem(key) {
        if (key === 'spirebound_save_v2' && window.__rejectDawnClear) {
          throw new Error('injected dawn clear failure');
        }
        return original.call(this, key);
      };
      sp.S.run = run;
      sp.show('end', { won: true });
    });

    await expect(page.locator('#dawn-save-failure')).toBeVisible({ timeout: 30_000 });
    await expect(page.locator('[data-a="retry-dawn"]')).toBeFocused({ timeout: 10_000 });
    await expect(page.locator('#shake')).toHaveJSProperty('inert', true);
    await expect(page.locator('#dawn-save-failure, [data-r5-state="dawn-final-clear-retry"]')).toHaveCount(1);

    await page.evaluate(() => { window.__rejectDawnClear = false; });
    await page.click('[data-a="retry-dawn"]');
    await waitForDawnComplete(page);
    await expect(page.locator('#shake')).toHaveJSProperty('inert', false);
    expect(await persistenceTrace(page, 'dawn-clear')).toEqual([
      ['persistence.attempt', 'point', 'accepted'],
      ['persistence.blocked', 'point', 'rejected'],
      ['persistence.attempt', 'point', 'accepted'],
      ['persistence.recovered', 'point', 'completed'],
    ]);
  });

  test('Dawn reload resumes from the acknowledged cursor', async ({ page }) => {
    test.skip(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches),
      'cursor resume timing is normal-motion');
    await stagePendingRunEnd(page, 'win');
    await page.reload();
    const reloaded = page.waitForEvent('load');
    await page.evaluate(() => new Promise((resolve, reject) => {
      const started = Date.now();
      const tick = () => {
        if (Date.now() - started > 30_000) {
          reject(new Error('missed the dawn cursor===2 window'));
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
        sessionStorage.setItem('spirebound_dawn_checkpoint', JSON.stringify({
          cursor: pending.cursor,
          remaining: pending.events.slice(pending.cursor).map((event) => event.t),
        }));
        pending.cursor = 2;
        if (window.spirebound.S.run?.pendingDawn) {
          window.spirebound.S.run.pendingDawn.cursor = 2;
        }
        const setItem = Storage.prototype.setItem;
        const removeItem = Storage.prototype.removeItem;
        setItem.call(localStorage, 'spirebound_save_v2', JSON.stringify(run));
        Storage.prototype.setItem = function freeze(key, value) {
          if (key === 'spirebound_save_v2') return;
          return setItem.call(this, key, value);
        };
        Storage.prototype.removeItem = function freezeClear(key) {
          if (key === 'spirebound_save_v2') return;
          return removeItem.call(this, key);
        };
        location.reload();
        resolve();
      };
      tick();
    }));
    await reloaded;
    const checkpoint = await page.evaluate(() => JSON.parse(sessionStorage.getItem('spirebound_dawn_checkpoint')));
    expect(checkpoint.cursor).toBe(2);
    await page.waitForFunction(() => window.spirebound?.S.screen === 'end');
    await waitForDawnComplete(page);
    const shown = await page.locator('.dawn-event').evaluateAll((nodes) => nodes.map((n) => n.dataset.event));
    expect(shown).toEqual(checkpoint.remaining);
  });

  test('Fall unpaid Shade bequest shows no phantom choice', async ({ page }) => {
    await seed(page, freshLedger(), '/?trace=1');
    await page.evaluate(() => {
      const sp = window.spirebound;
      const run = sp.E.newRun(3350);
      run.questScratch = { ownShade: { fall: { bequest: { kind: 'gold', amount: 50 } } } };
      run.pendingRunEnd = { outcome: 'death' };
      sp.S.run = run;
      sp.show('end', {
        won: false,
        offers: [],
        fallAct: 1,
        fallRow: 4,
        unpaidBequest: true,
      });
    });

    await expect(page.locator('.r5-end.r5-end--fallen')).toHaveCount(1);
    await expect(page.locator('.bequest-opt, [data-a="bequest"]')).toHaveCount(0);
    await expect(page.locator('.bequest-done, .r5-bequest-unpaid')).toContainText(
      'The unpaid gift remains in the standing stone',
    );
    await expect(page.locator('.r5-end')).toHaveAttribute('data-r5-state', 'fall-unpaid-shade-bequest');
    const fallEnds = await page.evaluate(() => window.__probe.behaviourTrace().records
      .filter((record) => record.eventName === 'presentation.fall' && record.phase === 'end'
        && record.attributes?.endState === 'fall-unpaid-shade-bequest'));
    expect(fallEnds.length).toBeGreaterThanOrEqual(1);
    expect(fallEnds.at(-1).outcome).toBe('settled');
    const emptyChoice = await page.locator('.bequest-opts, .r5-choice-ring .bequest-opt').count();
    expect(emptyChoice).toBe(0);
  });
});
