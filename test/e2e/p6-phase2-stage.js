// Drive Phase-2 capture terminals through real PE / UI owners (no dataset stamps).
import { QIDS, completeLedger, mixedLedger } from './emberglass-fixtures.js';

const DAWN_EVENT_FOR = Object.freeze({
  'dawn-whisper-held': { t: 'whisper', text: 'Owner whisper sentinel.' },
  'dawn-quest-reveal-held': { t: 'questReveal', id: 'hollowLamplighter' },
  'dawn-quest-progress-held': {
    t: 'questProgress', id: 'hollowLamplighter', progress: 3, target: 5,
  },
  'dawn-quest-unlock-held': { t: 'questUnlock', id: 'insight:witchlightLens' },
  'dawn-page-read-held': { t: 'pageRead', index: 2, text: 'Page owner sentinel.' },
  'dawn-eighth-resolved-held': { t: 'eighthResolved', text: 'Eighth owner sentinel.' },
  'dawn-shade-resolved-held': { t: 'shadeResolved', text: 'Shade owner sentinel.' },
  'dawn-quest-complete-held': { t: 'questComplete', id: 'hollowLamplighter' },
  'dawn-shard-grant-held': { t: 'shardGrant', id: 'hollowLamplighter' },
  'dawn-act4-promise-held': { t: 'act4Reveal' },
});

async function waitAppReady(page) {
  await page.waitForFunction(() => window.spirebound && window.__probe);
  await page.waitForFunction(() => {
    const records = window.__probe?.behaviourTrace?.()?.records;
    if (records?.some((record) => record.eventName === 'app.ready')) return true;
    return window.spirebound?.S?.screen === 'title'
      && !!document.querySelector('.r5-title');
  });
}

async function writeVigil(page, vigil) {
  await page.evaluate((value) => {
    localStorage.removeItem('spirebound_save_v2');
    localStorage.setItem('spirebound_vigil_v2', JSON.stringify(value));
  }, vigil);
  await page.reload();
  await waitAppReady(page);
}

async function stageDawnEvent(page, event) {
  await page.evaluate(({ event, questIds }) => {
    const sp = window.spirebound;
    const run = sp.E.newRun(3810, {
      reveals: ['emberglass', 'act4'],
      shards: questIds.slice(0, 5),
    });
    run.pendingRunEnd = { outcome: 'win' };
    if (!sp.E.saveRun(run) || !sp.E.stagePendingDawn(run, [event], [])) {
      throw new Error(`dawn fixture failed for ${event.t}`);
    }
    sp.S.run = run;
    sp.show('end', { won: true });
  }, { event, questIds: QIDS });
  await page.waitForFunction((owner) => {
    const panel = document.querySelector(`.dawn-event[data-event="${owner}"]`);
    if (!panel) return false;
    const held = window.__probe.behaviourTrace().records
      .some((record) => record.eventName === 'presentation.dawn-panel'
        && record.phase === 'end'
        && record.attributes?.owner === owner);
    return held || panel.isConnected;
  }, event.t, { timeout: 30_000 });
}

async function stageHollowBase(page, {
  paid = false, gold = 200, type = 'rest', progress = 0,
} = {}) {
  await page.evaluate(async ({ paid, gold, type, progress }) => {
    const sp = window.spirebound;
    const { QUESTS } = await import('/src/data.js');
    const run = sp.E.newRun(3820, {
      reveals: ['phials', 'omens', 'emberglass', 'lamplighter', 'act4'],
      shards: ['usurper', 'hollowLamplighter', 'witchlight', 'shade', 'eighth', 'page'],
    });
    run.map = sp.E.genMap(run);
    const node = run.map.nodes.find((n) => n.type === type) || run.map.nodes[0];
    node.type = type;
    run.nodeId = node.id;
    if (!run.map.visited.includes(node.id)) run.map.visited.push(node.id);
    run.player.gold = gold;
    run.quests = {
      ...(run.quests || {}),
      hollowLamplighter: { state: 'revealed', progress, memory: {} },
    };
    run.pendingHollow = {
      nodeId: node.id,
      type,
      paid,
      deferred: false,
      answer: paid
        ? (QUESTS.hollowLamplighter.meetings[Math.max(0, progress - 1)]?.paid || 'paid answer')
        : null,
    };
    sp.S.run = run;
    sp.E.saveRun(run);
    sp.show('hollow');
  }, { paid, gold, type, progress });
  await page.waitForSelector('.r5-lamplighter--hollow, .hollow-lamplighter');
  // Ceremony settlement is on data-r5-ceremony (Phase-2 state stays on data-r5-state).
  // FE/PE reveal CSS keys off that attr — wait before any hollow click path.
  await page.waitForFunction(() => {
    const root = document.querySelector('.r5-lamplighter');
    if (!root) return false;
    const ceremony = root.dataset.r5Ceremony === 'hollow-ready';
    const settled = ['hollow-unpaid', 'hollow-paid', 'hollow-pay-pressed',
      'hollow-save-retry', 'hollow-route-recovery', 'hollow-continue-closed',
      'hollow-return-closed'].includes(root.dataset.r5State);
    const style = getComputedStyle(root);
    return ceremony && settled && Number.parseFloat(style.opacity) > 0.9;
  });
}

async function freezeNavigation(page) {
  await page.evaluate(() => {
    const sp = window.spirebound;
    if (window.__p6FreezeShow) return;
    window.__p6FreezeShow = sp.show;
    sp.show = (name, opts) => {
      if (name === 'hollow' || name === 'title' || name === 'end' || name === 'shop'
        || name === 'vigil' || name === 'map') {
        return window.__p6FreezeShow.call(sp, name, opts);
      }
      // Swallow destination navigations so Hollow close terminals stay painted.
      return undefined;
    };
  });
}

async function stageUsurperShop(page, { gold = 700 } = {}) {
  await page.evaluate((goldAmount) => {
    const sp = window.spirebound;
    const storedVigil = JSON.parse(localStorage.getItem('spirebound_vigil_v2') || '{}');
    const quests = {
      ...(storedVigil.quests || {}),
      usurper: { state: 'armed', progress: 0, memory: {} },
    };
    const run = sp.E.newRun(3830, {
      reveals: ['emberglass', 'phials'],
      shards: storedVigil.shards || [],
      quests,
    });
    run.act = 1;
    run.map = sp.E.genMap(run);
    const node = run.map.nodes.find((candidate) => candidate.type === 'shop') || run.map.nodes[0];
    node.type = 'shop';
    delete node.unlit;
    delete node.bounty;
    sp.E.visitNode(run, node);
    run.player.gold = goldAmount;
    if (!sp.E.saveRun(run)) throw new Error('usurper shop fixture did not persist');
    sp.S.run = run;
    sp.S.shopData = null;
    sp.show('shop');
  }, gold);
  await page.waitForSelector('.r5-shop');
  await page.waitForSelector('.quest-shop-item', { timeout: 15_000 });
}

/**
 * Stage one Phase-2 capture id via real owners. Throws on unknown id.
 */
export async function stagePhase2State(page, stateId) {
  if (stateId === 'rose-absent') {
    await writeVigil(page, {
      v: 2,
      deeds: {
        runs: 0, wins: 0, slain: 0, shatters: 0, kindles: 0, perfects: 0,
        smolderKills: 0, unlitVisited: 0, embersSpent: 0, bestVow: 0, bestFloor: 0,
      },
      unlocks: [], vowUnlocked: 0, lastFall: null,
      runsPlayed: 0, quests: {}, shards: [], whispers: 0, news: false,
    });
    await page.evaluate(() => window.spirebound.show('title'));
    await page.waitForSelector('.r5-title[data-r5-rose="rose-absent"]');
    return;
  }

  if (stateId === 'title-rose-loading') {
    await writeVigil(page, {
      v: 2,
      deeds: {
        runs: 4, wins: 1, slain: 10, shatters: 1, kindles: 0, perfects: 0,
        smolderKills: 0, unlitVisited: 0, embersSpent: 4, bestVow: 1, bestFloor: 8,
      },
      unlocks: [], vowUnlocked: 1, lastFall: null,
      runsPlayed: 4, quests: {}, shards: ['usurper'], whispers: 1, news: true,
    });
    await page.route('**/assets/**/*rose*', (route) => {});
    await page.route('**/assets/rose/**', (route) => {});
    await page.evaluate(() => window.spirebound.show('title'));
    await page.waitForSelector('.title-rose-medallion[data-r5-state="title-rose-loading"]');
    return;
  }

  if (stateId === 'title-rose-inert') {
    await writeVigil(page, {
      v: 2,
      deeds: {
        runs: 4, wins: 1, slain: 10, shatters: 1, kindles: 0, perfects: 0,
        smolderKills: 0, unlitVisited: 0, embersSpent: 4, bestVow: 1, bestFloor: 8,
      },
      unlocks: [], vowUnlocked: 1, lastFall: null,
      runsPlayed: 4, quests: {}, shards: ['usurper'], whispers: 1, news: true,
    });
    await page.route('**/assets/**', (route) => {
      if (/rose|mural|mask|frame/i.test(route.request().url())) return route.abort();
      return route.continue();
    });
    await page.evaluate(() => window.spirebound.show('title'));
    await page.waitForSelector('.title-rose-medallion[data-r5-state="title-rose-inert"]', {
      timeout: 15_000,
    });
    return;
  }

  if (stateId === 'title-rose-ready') {
    await writeVigil(page, {
      v: 2,
      deeds: {
        runs: 4, wins: 1, slain: 10, shatters: 1, kindles: 0, perfects: 0,
        smolderKills: 0, unlitVisited: 0, embersSpent: 4, bestVow: 1, bestFloor: 8,
      },
      unlocks: [], vowUnlocked: 1, lastFall: null,
      runsPlayed: 4, quests: {}, shards: ['usurper'], whispers: 1, news: true,
    });
    await page.evaluate(() => window.spirebound.show('title'));
    await page.waitForSelector('.title-rose-medallion[data-r5-state="title-rose-ready"]', {
      timeout: 20_000,
    });
    return;
  }

  if (stateId === 'rose-raster-ready' || stateId === 'rose-fallback-ready'
    || stateId.startsWith('rose-pane-') || stateId === 'rose-whispers-ready'
    || stateId === 'rose-six-shards') {
    const ledger = stateId === 'rose-six-shards' ? completeLedger() : mixedLedger();
    if (stateId === 'rose-whispers-ready') ledger.whispers = Math.max(1, ledger.whispers | 0);
    if (stateId === 'rose-pane-dormant') {
      for (const id of QIDS) ledger.quests[id] = { state: 'dormant', progress: 0, memory: {} };
    }
    if (stateId === 'rose-pane-armed') {
      ledger.quests.paleOnes = { state: 'armed', progress: 0, memory: {} };
    }
    if (stateId === 'rose-pane-revealed') {
      ledger.quests.hollowLamplighter = { state: 'revealed', progress: 2, memory: {} };
    }
    if (stateId === 'rose-pane-complete') {
      ledger.quests.usurper = { state: 'complete', progress: 1, memory: {} };
      ledger.shards = ['usurper'];
    }
    await writeVigil(page, ledger);
    await page.evaluate(() => window.spirebound.show('vigil'));
    await page.click('[data-a="tab-rose"]');
    if (stateId === 'rose-fallback-ready') {
      await page.evaluate(() => window.__probe.forceRoseFallback(true));
      await page.click('[data-a="tab-deeds"]');
      await page.click('[data-a="tab-rose"]');
      await page.waitForSelector('.rose-window.rose-fallback[data-r5-state="rose-fallback-ready"]');
      return;
    }
    if (stateId === 'rose-raster-ready') {
      await page.waitForSelector('.rose-window.rose-assets[data-r5-state="rose-raster-ready"], .rose-window.rose-fallback');
      return;
    }
    if (stateId === 'rose-whispers-ready') {
      await page.waitForSelector('[data-r5-state="rose-whispers-ready"]');
      return;
    }
    if (stateId === 'rose-six-shards') {
      await page.waitForSelector('.rose-view[data-r5-state="rose-six-shards"]');
      return;
    }
    if (stateId === 'rose-pane-selected') {
      await page.click('.rose-pane-select');
      await page.waitForSelector('#rose-pane-detail[data-r5-state="rose-pane-selected"]');
      return;
    }
    const paneState = stateId;
    await page.waitForSelector(`.rose-pane[data-r5-state="${paneState}"]`);
    return;
  }

  if (stateId === 'hollow-unpaid') {
    await stageHollowBase(page, { paid: false, gold: 200 });
    await page.waitForFunction(() => {
      const root = document.querySelector('.r5-lamplighter');
      return root?.dataset.r5State === 'hollow-unpaid'
        && (root.dataset.r5Ceremony === 'hollow-ready' || root.dataset.r5State === 'hollow-unpaid');
    });
    return;
  }

  if (stateId === 'hollow-pay-pressed') {
    await stageHollowBase(page, { paid: false, gold: 0, progress: 1 });
    await page.click('[data-a="hollow-pay"]');
    await page.waitForSelector('.r5-lamplighter[data-r5-state="hollow-pay-pressed"]');
    return;
  }

  if (stateId === 'hollow-save-retry') {
    await stageHollowBase(page, { paid: false, gold: 999, progress: 0 });
    await page.evaluate(() => {
      if (!window.__hollowSetItemOriginal) {
        window.__hollowSetItemOriginal = Storage.prototype.setItem;
      }
      window.__rejectHollowPayment = true;
      Storage.prototype.setItem = function setItem(key, value) {
        if (key === 'spirebound_save_v2' && window.__rejectHollowPayment) {
          throw new Error('injected hollow payment save failure');
        }
        return window.__hollowSetItemOriginal.call(this, key, value);
      };
    });
    await page.click('[data-a="hollow-pay"]');
    await page.waitForSelector('.r5-lamplighter[data-r5-state="hollow-save-retry"]');
    return;
  }

  if (stateId === 'hollow-paid') {
    await page.evaluate(() => {
      window.__rejectHollowPayment = false;
      if (window.__hollowSetItemOriginal) {
        Storage.prototype.setItem = window.__hollowSetItemOriginal;
      }
    });
    await stageHollowBase(page, { paid: false, gold: 999, progress: 0 });
    await page.click('[data-a="hollow-pay"]');
    await page.waitForSelector('.r5-lamplighter[data-r5-state="hollow-paid"]');
    return;
  }

  if (stateId === 'hollow-continue-closed' || stateId === 'hollow-return-closed') {
    await freezeNavigation(page);
    await stageHollowBase(page, {
      paid: stateId === 'hollow-continue-closed',
      gold: 999,
      type: 'rest',
      progress: 0,
    });
    if (stateId === 'hollow-continue-closed') {
      await page.click('[data-a="hollow-pay"]');
      await page.waitForSelector('.r5-lamplighter[data-r5-state="hollow-paid"]');
      await page.click('[data-a="hollow-continue"]');
      await page.waitForSelector('.r5-lamplighter[data-r5-state="hollow-continue-closed"]');
    } else {
      await page.click('[data-a="hollow-leave"]');
      await page.waitForSelector('.r5-lamplighter[data-r5-state="hollow-return-closed"]');
    }
    return;
  }

  if (stateId === 'hollow-route-recovery') {
    await stageHollowBase(page, {
      paid: true, gold: 50, type: 'rest', progress: 0,
    });
    await page.evaluate(() => {
      const run = window.spirebound.S.run;
      // Break visit/type invariants so stageHollowExit returns null.
      run.nodeId = 'missing-node';
      run.pendingHollow.nodeId = 'missing-node';
    });
    await page.click('[data-a="hollow-continue"]');
    await page.waitForSelector('.r5-lamplighter[data-r5-state="hollow-route-recovery"]');
    return;
  }

  if (stateId === 'map-witchlight-marked' || stateId === 'map-eighth-echo-held'
    || stateId.startsWith('sealed-door') || stateId === 'map-drag-suppressed') {
    await page.evaluate(({ id, questIds }) => {
      const sp = window.spirebound;
      const run = sp.E.newRun(3840, {
        reveals: id === 'sealed-door-hidden'
          ? ['emberglass', 'omens']
          : ['emberglass', 'act4', 'omens'],
        shards: questIds.slice(0, 6),
      });
      run.act = 2;
      run.map = sp.E.genMap(run);
      if (id === 'map-witchlight-marked' || id === 'map-drag-suppressed') {
        const marked = run.map.nodes.find((n) => n.type === 'monster') || run.map.nodes[0];
        marked.questMarked = true;
      }
      if (id === 'map-eighth-echo-held') {
        run.omens = [null, null, 'eighthOmen'];
      }
      sp.S.run = run;
      sp.E.saveRun(run);
      sp.show('map');
    }, { id: stateId, questIds: QIDS });
    await page.waitForSelector('.r5-map');
    if (stateId === 'map-witchlight-marked') {
      await page.waitForSelector('[data-r5-state="map-witchlight-marked"]');
      return;
    }
    if (stateId === 'map-eighth-echo-held') {
      await page.waitForSelector('.r5-map[data-r5-eighth="map-eighth-echo-held"]');
      return;
    }
    if (stateId === 'sealed-door-hidden') {
      await page.waitForSelector('.r5-map[data-r5-sealed="sealed-door-hidden"]');
      return;
    }
    if (stateId === 'sealed-door-visible') {
      await page.waitForSelector('.r5-map[data-r5-sealed="sealed-door-visible"], .sealed-door');
      return;
    }
    if (stateId === 'sealed-door-promise-open') {
      await page.waitForSelector('.sealed-door');
      await page.click('[data-a="sealed-door"]');
      await page.waitForSelector('.sealed-door-panel[data-r5-state="sealed-door-promise-open"]');
      return;
    }
    if (stateId === 'map-drag-suppressed') {
      const box = await page.locator('.map-screen').boundingBox();
      if (box) {
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await page.mouse.down();
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2 + 40, { steps: 6 });
        await page.mouse.up();
        await page.locator('.map-screen').click({ position: { x: 40, y: 40 } });
      }
      await page.waitForSelector('.r5-map[data-r5-state="map-drag-suppressed"]');
      return;
    }
  }

  if (DAWN_EVENT_FOR[stateId]) {
    await stageDawnEvent(page, DAWN_EVENT_FOR[stateId]);
    return;
  }

  if (stateId === 'dawn-cursor-retry') {
    await page.evaluate(() => {
      const sp = window.spirebound;
      const run = sp.E.newRun(3850);
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
    await page.waitForSelector('#dawn-save-failure[data-r5-state="dawn-cursor-retry"], [data-r5-state="dawn-cursor-retry"]');
    return;
  }

  if (stateId === 'dawn-final-clear-retry') {
    await page.evaluate(() => {
      const sp = window.spirebound;
      const run = sp.E.newRun(3851);
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
    await page.waitForSelector('#dawn-save-failure[data-r5-state="dawn-final-clear-retry"], [data-r5-state="dawn-final-clear-retry"]');
    return;
  }

  if (stateId === 'fall-unpaid-shade-bequest') {
    await page.evaluate(() => {
      const sp = window.spirebound;
      const run = sp.E.newRun(3852);
      run.pendingRunEnd = { outcome: 'death' };
      sp.E.saveRun(run);
      sp.S.run = run;
      sp.show('end', {
        won: false,
        offers: [],
        fallAct: 1,
        fallRow: 2,
        unpaidBequest: true,
        ledger: { whisper: 'unpaid' },
      });
    });
    await page.waitForSelector('.r5-end.r5-end--fallen, .bequest [data-r5-state="unpaid"], [data-r5-state="fall-unpaid-shade-bequest"]');
    return;
  }

  if (stateId === 'usurper-item-normal') {
    await stageUsurperShop(page, { gold: 700 });
    await page.waitForSelector('.quest-shop-item[data-r5-state="usurper-item-normal"]');
    return;
  }

  if (stateId === 'usurper-item-poor') {
    await stageUsurperShop(page, { gold: 0 });
    await page.waitForSelector('.quest-shop-item[data-r5-state="usurper-item-poor"]');
    return;
  }

  if (stateId === 'usurper-item-sold') {
    await page.evaluate(() => {
      window.__rejectUsurperBuy = false;
      if (window.__usurperSetItemOriginal) {
        Storage.prototype.setItem = window.__usurperSetItemOriginal;
      }
    });
    await stageUsurperShop(page, { gold: 700 });
    await page.click('.quest-shop-item button');
    await page.waitForSelector('.quest-shop-item[data-r5-state="usurper-item-sold"]');
    return;
  }

  if (stateId === 'usurper-item-save-blocked') {
    await stageUsurperShop(page, { gold: 700 });
    await page.evaluate(() => {
      if (!window.__usurperSetItemOriginal) {
        window.__usurperSetItemOriginal = Storage.prototype.setItem;
      }
      window.__rejectUsurperBuy = true;
      Storage.prototype.setItem = function setItem(key, value) {
        if (key === 'spirebound_save_v2' && window.__rejectUsurperBuy) {
          throw new Error('injected Usurper purchase save failure');
        }
        return window.__usurperSetItemOriginal.call(this, key, value);
      };
    });
    await page.click('.quest-shop-item button');
    await page.waitForSelector('.quest-shop-item[data-r5-state="usurper-item-save-blocked"]');
    return;
  }

  throw new Error(`unknown Phase-2 state id: ${stateId}`);
}
