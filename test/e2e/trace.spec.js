import { test, expect, bindTraceContract } from './trace-fixture.js';
import { boot, collectErrors, startFight, settle } from './helpers.js';
import {
  freshLedger, seed, stagePendingRunEnd, waitForDawnComplete,
} from './emberglass-fixtures.js';

const triples = (records) => records.map(({ eventName, phase, outcome = null }) =>
  [eventName, phase, outcome]);
function expectOrderedSubsequence(actual, expected) {
  let cursor = 0;
  for (const row of actual) {
    if (JSON.stringify(row) === JSON.stringify(expected[cursor])) cursor += 1;
  }
  expect(cursor, `missing ordered trace row ${JSON.stringify(expected[cursor])}`).toBe(expected.length);
}

const PR16_WARM_GRAPH = {
  title: ['embark', 'vigil'], embark: ['map'], vigil: ['title', 'roseWindow'],
  // Semantic map edges first; first-theme combat appended by configureThemeMusic.
  roseWindow: ['vigil'], map: ['safeNodes', 'elite', 'hollowLamplighter', 'act1Combat'],
  safeNodes: ['map'], act1Combat: ['act1Boss', 'map', 'elite'],
  act1Boss: ['map', 'victory'], act2Combat: ['act2Boss', 'map', 'elite'],
  act2Boss: ['map', 'victory'], act3Combat: ['act3Boss', 'map', 'elite'],
  act3Boss: ['victory', 'defeat'], elite: ['map'], paleOnes: ['map'],
  shadeDuel: ['map'], usurper: ['victory', 'defeat'], eighthOmen: ['map', 'elite'],
  unreadablePage: ['victory', 'vigil'], hollowLamplighter: ['map'],
  sealedDoor: ['map', 'vigil'], victory: ['title', 'vigil'], defeat: ['title', 'vigil'],
};

const persistenceRows = (page, kind) => page.evaluate((selectedKind) =>
  window.__probe.behaviourTrace().records
    .filter((record) => record.eventName.startsWith('persistence.') && record.attributes?.kind === selectedKind)
    .map((record) => [record.eventName, record.phase, record.outcome ?? null]), kind);
const persistenceContractRows = (page, kind) => page.evaluate((selectedKind) =>
  window.__probe.behaviourTrace().records
    .filter((record) => record.eventName.startsWith('persistence.') && record.attributes?.kind === selectedKind)
    .map((record) => ({
      eventName: record.eventName,
      phase: record.phase,
      outcome: record.outcome ?? null,
      attributes: record.attributes,
    })), kind);

function dawnResumeProjection(rows) {
  // Prefer the parent Dawn span (no per-phase attribute) so Task 33 phase
  // markers do not displace the frozen resume contract.
  const start = rows.find((row) => row.eventName === 'presentation.dawn' && row.phase === 'start'
    && row.attributes?.phase == null)
    || rows.find((row) => row.eventName === 'presentation.dawn' && row.phase === 'start');
  const attemptIndex = rows.findIndex((row) => row.eventName === 'persistence.attempt');
  const recovered = rows.slice(attemptIndex + 1).find((row) => row.eventName === 'persistence.recovered');
  const end = rows.findLast((row) => row.eventName === 'presentation.dawn' && row.phase === 'end'
    && row.outcome === 'settled' && row.attributes?.phase == null)
    || rows.findLast((row) => row.eventName === 'presentation.dawn' && row.phase === 'end');
  const project = (row) => (row ? {
    eventName: row.eventName,
    phase: row.phase,
    outcome: row.outcome ?? null,
    ...(row.attributes && row.eventName.startsWith('persistence.')
      ? { attributes: row.attributes }
      : {}),
  } : row);
  return [project(start), project(rows[attemptIndex]), project(recovered), project(end)];
}

async function seedUsurperTraceShop(page) {
  const vigil = freshLedger();
  vigil.deeds.runs = 2;
  vigil.deeds.wins = 2;
  vigil.runsPlayed = 2;
  vigil.quests.usurper = { state: 'armed', progress: 0, memory: {} };
  await seed(page, vigil);
  // Probe is installed before the boot `show('title')`; wait for app.ready so a
  // mid-boot show('shop') is not overwritten by the terminal title paint.
  await page.waitForFunction(() => window.__probe?.behaviourTrace().records
    .some((record) => record.eventName === 'app.ready'));
  await page.evaluate(() => {
    const sp = window.spirebound;
    const stored = JSON.parse(localStorage.getItem('spirebound_vigil_v2'));
    const run = sp.E.newRun(9501, { quests: stored.quests, shards: stored.shards, unlocks: stored.unlocks });
    run.act = 1;
    run.map = sp.E.genMap(run);
    const node = run.map.nodes.find((candidate) => candidate.type === 'shop') || run.map.nodes[0];
    node.type = 'shop';
    delete node.unlit;
    delete node.bounty;
    sp.E.visitNode(run, node);
    run.player.gold = 650;
    if (!sp.E.saveRun(run)) throw new Error('Usurper trace fixture did not persist');
    sp.S.run = run;
    sp.show('shop');
  });
  await page.waitForFunction(() => window.spirebound?.S?.screen === 'shop');
}

async function seedHollowTrace(page, { progress = 1, type = 'shop', gold = 999 } = {}) {
  await page.goto('/');
  await page.waitForFunction(() => window.spirebound && window.__probe);
  await page.evaluate(async ({ progress: questProgress, type: nodeType, gold: startingGold }) => {
    localStorage.clear();
    const E = await import('/src/engine.js');
    const { QUEST_IDS } = await import('/src/data.js');
    const quests = Object.fromEntries(QUEST_IDS.map((id) => [id, {
      state: id === 'hollowLamplighter' ? 'revealed' : 'dormant',
      progress: id === 'hollowLamplighter' ? questProgress : 0,
      memory: {},
    }]));
    const run = E.newRun(9916, { quests });
    const node = run.map.nodes[0];
    node.type = nodeType;
    run.nodeId = node.id;
    run.map.visited.push(node.id);
    run.questScratch.hollowLamplighter = { due: true, met: true, debtActive: false };
    run.player.gold = startingGold;
    run.pendingHollow = { nodeId: node.id, type: nodeType, paid: false, deferred: false, answer: null };
    if (!E.saveRun(run)) throw new Error('Hollow trace fixture did not persist');
  }, { progress, type, gold });
  await page.reload();
  await page.click('[data-a="continue"]');
  await page.waitForSelector('.hollow-lamplighter', { timeout: 10_000 });
}

const COMBAT_MODULE_KEYS = [
  'afterAction', 'banner', 'clearTargeting', 'doPlay', 'drainHandlers', 'flyTo',
  'freeze', 'freezeForProbe', 'handleCombatKey', 'meshBindTitle', 'onEndTurn', 'pointerState',
  'refitCombat', 'renderCombat', 'renderHud', 'setTargeting', 'startCombatUI',
  'startRig', 'syncCombat', 'syncHand', 'tweenNum', 'useLanternArt',
].sort();
const DRAIN_HANDLER_KEYS = [
  'addCrack', 'artCast', 'banner', 'bumpPile', 'captureCardAnchor', 'choreoAttack',
  'choreoHit', 'choreoStagger', 'clearDrawRevealPlan',
  'clearPileVisualOverride', 'deleteDrawRevealPlan', 'enemyCenter',
  'flyCardBacks', 'flyTo', 'floatText', 'handFaceSize', 'handSeatCenter',
  'hasPileVisualOverride', 'heroCenter', 'holdPendingPileArrivals',
  'holdPileVisual', 'igniteVessel', 'layoutHand', 'peekCardAnchor',
  'pileCardByUid', 'pileFaceSize', 'readPileVisualOverride',
  'releasePileVisual', 'renderHud', 'replacePileVisualOverride',
  'scheduleHandReveal', 'semanticUiCheckpoint', 'setCardFlightAnchor',
  'setDrawRevealPlan', 'setPileVisualOverride', 'shatter', 'syncCombat', 'syncHand',
  'syncPileWidgets', 'syncWardMesh', 'takeCardAnchor',
].sort();

test('runtime UI module contracts expose only sorted diagnostic keys', async ({ page }) => {
  await page.goto('/?trace=1');
  await page.waitForFunction(() => window.__probe?.moduleContracts);
  expect(await page.evaluate(() => window.__probe.moduleContracts())).toEqual({
    combat: COMBAT_MODULE_KEYS,
    drainHandlers: DRAIN_HANDLER_KEYS,
    drain: ['drain'],
    frozen: { combat: true, drainHandlers: true, drain: true },
  });
});

test('trace attachment canary', async ({ page }) => {
  test.skip(process.env.SPIREBOUND_TRACE_ATTACHMENT_CANARY !== '1',
    'forced-failure attachment proof runs only in its isolated gate');
  await seed(page, freshLedger());
  await page.click('[data-a="embark"]');
  await page.evaluate(() => {
    const original = Storage.prototype.setItem;
    window.__rejectCanarySave = true;
    Storage.prototype.setItem = function setItem(key, value) {
      if (key === 'spirebound_save_v2' && window.__rejectCanarySave) {
        throw new Error('trace attachment canary initial save failure');
      }
      return original.call(this, key, value);
    };
  });
  await page.click('[data-a="begin"]');
  await expect(page.locator('[data-a="retry-save"]')).toBeFocused();
  await page.click('[data-a="retry-save"]');
  await page.evaluate(() => { window.__rejectCanarySave = false; });
  await page.click('[data-a="retry-save"]');
  await page.waitForFunction(() => window.spirebound.S.screen === 'map');
  await page.evaluate(() => window.spirebound.startCombatUI(['sporeling'], 'normal'));
  await settle(page);
  await page.evaluate(() => window.__probe.forceHand(['defend']));
  const card = page.locator('.hand-zone .card');
  await card.waitFor({ state: 'visible' });
  await card.evaluate((node) => {
    const rect = node.getBoundingClientRect();
    const init = { bubbles: true, pointerId: 99, isPrimary: true, pointerType: 'mouse' };
    node.dispatchEvent(new PointerEvent('pointerdown', {
      ...init, clientX: rect.left + rect.width / 2, clientY: rect.top + rect.height / 2,
    }));
    node.dispatchEvent(new PointerEvent('pointermove', {
      ...init, clientX: rect.left + rect.width / 2, clientY: rect.top - 60,
    }));
    node.dispatchEvent(new PointerEvent('pointercancel', {
      ...init, clientX: rect.left + rect.width / 2, clientY: rect.top - 60,
    }));
  });
  await page.evaluate(() => window.__probe.showBarrierProbe());
  await settle(page);
  const uid = await page.evaluate(() => {
    window.__probe.setEnemyHp(0, 1);
    return window.__probe.forceHand(['strike'])[0];
  });
  await page.evaluate((cardUid) => window.__probe.play(cardUid, 0), uid);
  await settle(page);
  const names = await page.evaluate(() => window.__probe.behaviourTrace().records
    .map((record) => record.eventName));
  for (const token of ['screen.entered', 'input.card-drag', 'playback.queue']) {
    expect(names).toContain(token);
  }
  expect(names.some((name) => name.startsWith('presentation.'))).toBe(true);
  expect(names.some((name) => name.startsWith('persistence.'))).toBe(true);
  throw new Error('INTENTIONAL_TRACE_ATTACHMENT_CANARY_FAILURE');
});

test('real screen, cancelled drag and card play expose semantic owner order', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/?trace=1');
  await page.waitForFunction(() => window.__probe);
  await page.locator('[data-a="embark"]').click();
  await page.evaluate(() => {
    localStorage.clear();
    window.spirebound.S.run = window.spirebound.E.newRun(20260706, { aspect: 0 });
  });
  await page.evaluate(() => window.spirebound.startCombatUI(['sporeling', 'sporeling'], 'normal'));
  await expect.poll(() => page.evaluate(() => ({
    busy: window.__probe.state().busy,
    queueIdle: window.__probe.queueIdle(),
    presentationIdle: window.__probe.presentationIdle(),
  })), { timeout: 15_000 }).toEqual({ busy: false, queueIdle: true, presentationIdle: true });
  await settle(page);

  await page.evaluate(() => window.__probe.forceHand(['defend']));
  // Task 27/28 — hand is Pixi; cancel-drag via stage router seat bounds.
  await page.evaluate(() => {
    window.__probe.setEnergy(3);
    const ui = window.__probe.ui();
    const card = ui.hand.find((c) => c.id === 'defend') || ui.hand[0];
    const seat = card.seatBounds || card.bounds;
    const stage = document.getElementById('stage');
    const rect = stage.getBoundingClientRect();
    const info = window.__probe.stage();
    const scale = info.scale || (rect.width / Math.max(1, info.w));
    const cx = rect.left + (seat.left + seat.width / 2) * scale;
    const cy = rect.top + (seat.top + seat.height / 2) * scale;
    const init = { bubbles: true, cancelable: true, pointerId: 41, isPrimary: true, pointerType: 'mouse' };
    stage.dispatchEvent(new PointerEvent('pointerdown', { ...init, clientX: cx, clientY: cy }));
    stage.dispatchEvent(new PointerEvent('pointermove', { ...init, clientX: cx, clientY: cy - 60 }));
    stage.dispatchEvent(new PointerEvent('pointercancel', { ...init, clientX: cx, clientY: cy - 60 }));
  });

  const [uid] = await page.evaluate(() => window.__probe.forceHand(['strike']));
  expect(await page.evaluate((cardUid) => window.__probe.targetCardForProbe(cardUid), uid)).toBe(true);
  expect(await page.evaluate((cardUid) => window.__probe.play(cardUid, 0), uid)).toBe(true);
  await settle(page);
  await page.evaluate(() => window.__probe.showBarrierProbe());
  await settle(page);
  await page.evaluate(() => { window.__probe.setEmbers(9); });
  const artBefore = await page.evaluate(() => window.spirebound.S.cb.embers);
  // Task 23: activate lantern through the stage router / hitTest bounds.
  await page.evaluate(() => {
    const stage = document.getElementById('stage');
    const rect = stage.getBoundingClientRect();
    const info = window.__probe.stage();
    const scale = info.scale || (rect.width / Math.max(1, info.w));
    const bounds = window.spirebound.combatGl.readUI().lantern;
    const x = rect.left + (bounds.left + bounds.width / 2) * scale;
    const y = rect.top + (bounds.top + bounds.height / 2) * scale;
    stage.dispatchEvent(new PointerEvent('pointerdown', {
      bubbles: true, cancelable: true, pointerId: 7, isPrimary: true,
      pointerType: 'mouse', clientX: x, clientY: y,
    }));
    stage.dispatchEvent(new PointerEvent('pointerup', {
      bubbles: true, cancelable: true, pointerId: 7, isPrimary: true,
      pointerType: 'mouse', clientX: x, clientY: y,
    }));
  });
  await settle(page);
  const artAfter = await page.evaluate(() => ({
    artUsedTurn: window.spirebound.S.cb.artUsedTurn,
    embers: window.spirebound.S.cb.embers,
    turn: window.spirebound.S.cb.turn,
  }));
  expect(artAfter.artUsedTurn).toBe(artAfter.turn);
  expect(artAfter.embers).toBeLessThan(artBefore);

  const result = await page.evaluate(() => ({
    trace: window.__probe.behaviourTrace(),
    integrity: window.__probe.traceIntegrity(),
  }));
  expect(result.trace.enabled).toBe(true);
  expect(result.trace.dropped).toBe(0);
  expect(result.integrity).toEqual({ ok: true, errors: [] });
  expect(result.trace.records.filter((record) => record.eventName.startsWith('error.'))).toEqual([]);
  const rows = triples(result.trace.records);
  expectOrderedSubsequence(rows, [
    ['screen.requested', 'point', 'accepted'],
    ['screen.exited', 'point', 'completed'],
    ['screen.entered', 'point', 'completed'],
  ]);
  const records = result.trace.records;
  const embarkRequest = records.findIndex((record) =>
    record.eventName === 'screen.requested' && record.attributes?.screenId === 'embark');
  bindTraceContract('title-embark', triples(records.slice(embarkRequest, embarkRequest + 3)));
  const queueStart = records.find((record) => record.eventName === 'playback.queue' && record.phase === 'start');
  const queueChildStart = records.find((record) =>
    record.eventName === 'playback.queue-event' && record.phase === 'start' && record.causeSeq === queueStart.seq);
  const queueChildEnd = records.find((record) =>
    record.eventName === 'playback.queue-event' && record.phase === 'end' && record.eventName === queueChildStart.eventName && record.seq > queueChildStart.seq);
  const queueEnd = records.find((record) =>
    record.eventName === 'playback.queue' && record.phase === 'end' && record.seq > queueChildEnd.seq);
  bindTraceContract('opening-turn', triples([queueStart, queueChildStart, queueChildEnd, queueEnd]));
  bindTraceContract('targeted-play', triples([
    records.find((record) => record.eventName === 'input.targeting' && record.outcome === 'accepted'),
    records.find((record) => record.eventName === 'input.card-play' && record.phase === 'start'),
    records.find((record) => record.eventName === 'input.card-play' && record.phase === 'end'),
  ]));
  bindTraceContract('drag-cancel', triples(records.filter((record) => record.eventName === 'input.card-drag').slice(0, 2)));
  const artStartIndex = records.findIndex((record) =>
    record.eventName === 'input.kindle' && record.phase === 'start'
      && record.attributes?.action === 'lantern-art');
  const artEnd = records.slice(artStartIndex + 1).find((record) =>
    record.eventName === 'input.kindle' && record.phase === 'end');
  bindTraceContract('art', triples([records[artStartIndex], artEnd]));
  const flightStartIndex = records.findIndex((record) =>
    record.eventName === 'presentation.card-flight' && record.phase === 'start');
  const flightEndIndex = records.findIndex((record, index) => index > flightStartIndex &&
    record.eventName === 'presentation.card-flight' && record.phase === 'end');
  const surroundingChildStart = records.slice(0, flightStartIndex).findLast((record) =>
    record.eventName === 'playback.queue-event' && record.phase === 'start');
  const surroundingChildEnd = records.slice(flightEndIndex + 1).find((record) =>
    record.eventName === 'playback.queue-event' && record.phase === 'end');
  bindTraceContract('pile-cycle', triples([
    surroundingChildStart, records[flightStartIndex], records[flightEndIndex], surroundingChildEnd,
  ]));
  bindTraceContract('detached-ceremony', triples(records.filter((record) =>
    record.eventName === 'presentation.banner').slice(-2)));
  const queueStarts = new Map(result.trace.records
    .filter((record) => record.eventName === 'playback.queue' && record.phase === 'start')
    .map((record) => [record.seq, record]));
  const queueChildren = result.trace.records.filter((record) =>
    record.eventName === 'playback.queue-event' && record.phase === 'start');
  expect(queueChildren.length).toBeGreaterThan(0);
  expect(queueChildren.every((record) =>
    queueStarts.has(record.causeSeq) && record.causeSeq < record.seq)).toBe(true);
  expectOrderedSubsequence(rows, [
    ['input.card-drag', 'start', null],
    ['input.card-drag', 'end', 'cancelled'],
  ]);
  expectOrderedSubsequence(rows, [
    ['input.card-play', 'end', 'completed'],
    ['playback.queue', 'start', null],
    ['playback.queue-event', 'start', null],
    ['playback.queue-event', 'end', 'completed'],
    ['playback.queue', 'end', 'completed'],
  ]);

  const text = await page.evaluate(() => window.__probe.behaviourTrace({ format: 'text' }));
  expect(text.records).toEqual([]);
  expect(text.text).toContain('screen.entered phase=point outcome=completed');
  expect(text.text).toContain('input.card-drag phase=end outcome=cancelled');
  expect(text.text).toContain('playback.queue-event phase=start');
  expect(text.text).toMatch(/playback\.queue-event phase=start[^\n]+cause=\d+/);
  expect(text.text).toContain('presentation.banner phase=start');
  expect(text.text).toContain('presentation.banner phase=end outcome=settled');
  expect(errors).toEqual([]);
});

test('drain recovery reconstructs card flights without live seats or anchors', async ({ page }) => {
  const errors = collectErrors(page);
  await boot(page, { query: 'trace=1&mesh=0' });
  await startFight(page, ['sporeling']);
  const seeded = await page.evaluate(() => {
    const { E, S } = window.spirebound;
    const [exhaustUid] = window.__probe.forceHand(['strike']);
    const exhaustInst = S.cb.hand.find((card) => card.uid === exhaustUid);
    // Pixi hand — no DOM seat; mark as played so exhaust uses flight recovery path.
    S.cb.hand = [];
    S.cb.exhaust.push(exhaustInst);

    const discarded = E.makeCard(S.run, 'defend');
    const played = E.makeCard(S.run, 'strike');
    S.cb.discard.push(discarded, played);
    S.cb.queue.push(
      { t: 'exhaust', uid: exhaustInst.uid },
      { t: 'discardHand', uids: [discarded.uid] },
      { t: 'toDiscard', uid: played.uid },
    );
    return { exhaust: exhaustInst.uid, discardHand: discarded.uid, toDiscard: played.uid };
  });

  await page.evaluate(() => {
    const stage = document.getElementById('stage');
    const rect = stage.getBoundingClientRect();
    const info = window.__probe.stage();
    const scale = info.scale || (rect.width / Math.max(1, info.w));
    const bounds = window.spirebound.combatGl.readUI().endTurn;
    const x = rect.left + (bounds.left + bounds.width / 2) * scale;
    const y = rect.top + (bounds.top + bounds.height / 2) * scale;
    stage.dispatchEvent(new PointerEvent('pointerdown', {
      bubbles: true, cancelable: true, pointerId: 8, isPrimary: true,
      pointerType: 'mouse', clientX: x, clientY: y,
    }));
    stage.dispatchEvent(new PointerEvent('pointerup', {
      bubbles: true, cancelable: true, pointerId: 8, isPrimary: true,
      pointerType: 'mouse', clientX: x, clientY: y,
    }));
  });
  await settle(page);
  const result = await page.evaluate(() => ({
    busy: window.spirebound.S.busy,
    queueIdle: window.__probe.queueIdle(),
    presentationIdle: window.__probe.presentationIdle(),
    records: window.__probe.behaviourTrace().records,
  }));
  expect(result.busy).toBe(false);
  expect(result.queueIdle).toBe(true);
  expect(result.presentationIdle).toBe(true);
  const recoveredTypes = result.records
    .filter((record) => record.eventName === 'playback.queue-event' && record.phase === 'start')
    .map((record) => record.attributes.eventType);
  expect(recoveredTypes).toEqual(expect.arrayContaining(['exhaust', 'discardHand', 'toDiscard']));
  expect(result.records.filter((record) => record.eventName === 'error.playback')).toEqual([]);
  expect(errors).toEqual([]);
  expect(Object.values(seeded).every((uid) => uid != null)).toBe(true);
});

test('app-version trace is copy-free and five-tap debug has no action control', async ({ page }) => {
  await page.goto('/?trace=1');
  await page.waitForFunction(() => window.__probe);
  const logo = page.locator('[data-version-logo]');
  await expect(logo).toBeVisible();
  await expect(logo).not.toHaveAttribute('data-a', /.+/);
  await expect(page.locator('[data-version-display]')).not.toHaveAttribute('data-a', /.+/);
  const expectedDisplay = await page.evaluate(async () => {
    const { getVersionInfo } = await import('/src/version.js');
    return getVersionInfo().display;
  });
  await expect(page.locator('[data-version-display]')).toHaveText(expectedDisplay);
  await expect(page.locator('[data-version-display]')).toBeVisible();
  // Five taps outside a two-second window do nothing.
  await page.evaluate(() => {
    const target = document.querySelector('[data-version-logo]');
    const nativeNow = performance.now.bind(performance);
    let offset = 0;
    const originalNow = performance.now;
    performance.now = () => nativeNow() + offset;
    try {
      for (let index = 0; index < 5; index += 1) {
        target.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        offset += 2100;
      }
    } finally {
      performance.now = originalNow;
    }
  });
  await expect(page.locator('[data-version-debug]')).toBeHidden();
  // Four taps do nothing.
  await page.evaluate(() => {
    const target = document.querySelector('[data-version-logo]');
    for (let index = 0; index < 4; index += 1) target.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  await expect(page.locator('[data-version-debug]')).toBeHidden();
  await page.waitForTimeout(2100);
  const beforeGesture = await page.evaluate(() => window.__probe.behaviourTrace().lastSeq);
  // Dispatch taps in-page: Playwright actionability waits on logoSheen forever on CI.
  await page.evaluate(() => {
    const target = document.querySelector('[data-version-logo]');
    if (!target) throw new Error('title version logo missing');
    for (let index = 0; index < 5; index += 1) target.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  await expect(page.locator('[data-version-debug]')).toBeVisible({ timeout: 10_000 });
  await expect(page.locator('[data-version-debug]')).toHaveAttribute('aria-live', 'polite');
  await page.evaluate(() => {
    const target = document.querySelector('[data-version-logo]');
    if (!target) throw new Error('title version logo missing');
    for (let index = 0; index < 5; index += 1) target.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  await expect(page.locator('[data-version-debug]')).toBeHidden();
  const records = await page.evaluate(() => window.__probe.behaviourTrace().records);
  const version = records.filter((record) => record.eventName === 'app.version');
  expect(version).toHaveLength(1);
  expect(Object.keys(version[0].attributes).sort()).toEqual(['controlId', 'locale', 'release', 'shaState']);
  expect(version[0].attributes.shaState).toMatch(/^(known|unknown)$/);
  expect(JSON.stringify(version[0].attributes)).not.toMatch(/\d+\.\d+\.\d+/);
  expect(records.filter((record) => record.seq > beforeGesture &&
    record.eventName === 'app.version-debug')
    .map((record) => record.attributes.action)).toEqual(['shown', 'hidden']);
  for (const record of records.filter((record) => record.seq > beforeGesture &&
    record.eventName === 'app.version-debug')) {
    expect(Object.keys(record.attributes).sort()).toEqual(['action', 'controlId']);
    expect(JSON.stringify(record.attributes)).not.toMatch(/<[a-z]|0\.\d+\.\d+/i);
  }
  expect(records.filter((record) => record.seq > beforeGesture &&
    record.eventName === 'audio.sfx-request')).toEqual([]);
  expect(records.filter((record) => record.seq > beforeGesture &&
    record.eventName === 'audio.music-request')).toEqual([]);
  expect(await page.evaluate(() => window.spirebound.S.screen)).toBe('title');
  bindTraceContract('app-version', triples([
    ...records.filter((record) => record.eventName === 'app.version'),
    ...records.filter((record) => record.seq > beforeGesture &&
      record.eventName === 'app.version-debug'),
  ]));
});

test('Title ignition runs once per page session and REDUCED lands on title-ready', async ({ page }) => {
  test.skip(test.info().project.name !== 'desktop', 'ignition ceremony runs once on desktop');
  await page.goto('/?trace=1');
  await page.waitForFunction(() => window.__probe);
  await page.waitForFunction(() => document.querySelector('.r5-title')?.dataset.r5State === 'title-ready');
  const first = await page.evaluate(() => window.__probe.behaviourTrace().records
    .filter((record) => record.eventName === 'presentation.title-ignition'));
  expect(first.length).toBeGreaterThanOrEqual(2); // start + end
  expect(first.some((record) => record.phase === 'end' && record.attributes?.endState === 'title-ready')).toBe(true);
  await page.click('[data-a="embark"]');
  await page.click('[data-a="back"]');
  await page.waitForFunction(() => window.spirebound.S.screen === 'title');
  const second = await page.evaluate(() => window.__probe.behaviourTrace().records
    .filter((record) => record.eventName === 'presentation.title-ignition'));
  expect(second.length).toBe(first.length);

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  await page.waitForFunction(() => window.__probe);
  await expect(page.locator('.r5-title')).toHaveAttribute('data-r5-state', 'title-ready');
  await expect(page.locator('.r5-title')).toHaveAttribute('data-motion', 'reduced');
  await expect(page.locator('[data-version-display]')).toHaveAttribute('data-r5-state', 'title-version-default');
  await page.click('[data-version-logo]');
  await page.click('[data-version-logo]');
  await page.click('[data-version-logo]');
  await page.click('[data-version-logo]');
  await page.click('[data-version-logo]');
  await expect(page.locator('[data-version-debug]')).toBeVisible();
  await expect(page.locator('[data-version-debug]')).toHaveAttribute('data-r5-state', 'title-version-debug');
  const reduced = await page.evaluate(() => window.__probe.behaviourTrace().records
    .filter((record) => record.eventName === 'presentation.title-ignition' && record.phase === 'end'));
  expect(reduced.at(-1)?.attributes?.endState).toBe('title-ready');
  expect(reduced.at(-1)?.attributes?.motion).toBe('reduced');
});

test('Embark Begin emits lantern-lighting then enters map', async ({ page }) => {
  test.skip(test.info().project.name !== 'desktop', 'lantern-lighting ceremony runs once on desktop');
  await page.goto('/?trace=1');
  await page.waitForFunction(() => window.__probe);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForFunction(() => window.__probe);
  await page.click('[data-a="embark"]');
  const before = await page.evaluate(() => window.__probe.behaviourTrace().lastSeq);
  await page.click('.r5-begin-rite');
  await page.waitForFunction(() => window.spirebound.S.screen === 'map' ||
    window.spirebound.S.screen === 'lamplighter');
  const records = await page.evaluate((after) => window.__probe.behaviourTrace().records
    .filter((record) => record.seq > after), before);
  const lighting = records.filter((record) => record.eventName === 'presentation.lantern-lighting');
  expect(lighting.some((record) => record.phase === 'start')).toBe(true);
  expect(lighting.some((record) => record.phase === 'end' && record.attributes?.endState === 'embark-lit')).toBe(true);
  expect(records.some((record) => record.eventName === 'screen.entered' &&
    (record.attributes?.screenId === 'map' || record.attributes?.screenId === 'lamplighter'))).toBe(true);
});

test('detached Title version timeout cannot emit a stale hidden action', async ({ page }) => {
  await page.addInitScript(() => {
    const nativeSetTimeout = window.setTimeout.bind(window);
    const nativeClearTimeout = window.clearTimeout.bind(window);
    const probe = { scheduled: 0, cleared: 0, fired: 0, timerId: null };
    window.__titleTimerProbe = probe;
    window.setTimeout = (callback, delay, ...args) => {
      if (delay !== 3000 || callback.name !== 'hideDebug') {
        return nativeSetTimeout(callback, delay, ...args);
      }
      probe.scheduled++;
      const timerId = nativeSetTimeout(() => {
        probe.fired++;
        callback(...args);
      }, delay);
      probe.timerId = timerId;
      return timerId;
    };
    window.clearTimeout = (timerId) => {
      if (timerId === probe.timerId) probe.cleared++;
      return nativeClearTimeout(timerId);
    };
  });
  await page.goto('/?trace=1');
  await page.waitForFunction(() => window.__probe);
  const logo = page.locator('[data-version-logo]');
  await expect(logo).toBeVisible();
  await page.evaluate(() => {
    const target = document.querySelector('[data-version-logo]');
    if (!target) throw new Error('title version logo missing');
    for (let index = 0; index < 5; index += 1) target.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  await expect(page.locator('[data-version-debug]')).toBeVisible({ timeout: 10_000 });
  // Leave title in the same turn as the seq snapshot so the 3s auto-hide cannot
  // race Playwright click actionability and emit a still-on-title hidden action.
  const shownSeq = await page.evaluate(() => {
    const seq = window.__probe.behaviourTrace().lastSeq;
    window.spirebound.show('embark');
    return seq;
  });
  await page.waitForFunction(() => window.__probe?.state().screen === 'embark');
  await page.waitForTimeout(3200);
  const stale = await page.evaluate((after) => window.__probe.behaviourTrace().records
    .filter((record) => record.seq > after && record.eventName === 'app.version-debug'), shownSeq);
  expect(stale).toEqual([]);
  expect(await page.evaluate(() => ({
    scheduled: window.__titleTimerProbe.scheduled,
    cleared: window.__titleTimerProbe.cleared,
    fired: window.__titleTimerProbe.fired,
  }))).toEqual({ scheduled: 1, cleared: 1, fired: 0 });
});

test('enabled and disabled observers preserve identical detached-presentation state', async ({ page }) => {
  const runJourney = async (query) => {
    await boot(page, { query });
    const elapsed = await page.evaluate(async () => {
    const start = performance.now();
    window.__probe.showBarrierProbe();
    await window.__probe.settle();
    return performance.now() - start;
    });
    return page.evaluate((duration) => ({
      elapsed: duration,
      state: window.__probe.state(),
      trace: window.__probe.behaviourTrace(),
    }), elapsed);
  };

  const enabled = await runJourney('trace=1');
  const disabled = await runJourney('trace=off');
  expect(enabled.trace.enabled).toBe(true);
  expect(enabled.trace.records.some((record) => record.eventName === 'presentation.banner')).toBe(true);
  expect(disabled.trace.enabled).toBe(false);
  expect(new URL(page.url()).searchParams.has('trace')).toBe(false);
  expect(disabled.trace.records).toEqual([]);
  expect(enabled.elapsed).toBeGreaterThanOrEqual(1000);
  expect(disabled.elapsed).toBeGreaterThanOrEqual(1000);
  expect(disabled.state).toEqual(enabled.state);
});

test('mote-flight setup failures release their barrier and partial DOM', async ({ page }) => {
  const results = [];
  for (const mode of ['append', 'animate']) {
    await boot(page);
    results.push(await page.evaluate(async (failureMode) => {
      const originalAppend = Element.prototype.appendChild;
      const originalAnimate = Element.prototype.animate;
      if (failureMode === 'append') {
        Element.prototype.appendChild = function appendFailure(child) {
          if (this.id === 'floaties' && child.classList?.contains('flymote')) {
            throw new Error('forced-mote-append-failure');
          }
          return originalAppend.call(this, child);
        };
      } else {
        Element.prototype.animate = function animateFailure(...args) {
          if (this.classList.contains('flymote')) throw new Error('forced-mote-animate-failure');
          return originalAnimate.apply(this, args);
        };
      }
      let threw = false;
      try { window.__probe.showMoteFlightProbe(); } catch { threw = true; }
      Element.prototype.appendChild = originalAppend;
      Element.prototype.animate = originalAnimate;
      const settled = await Promise.race([
        window.__probe.settle().then(() => true),
        new Promise((resolve) => setTimeout(() => resolve(false), 100)),
      ]);
      return {
        mode: failureMode,
        threw,
        settled,
        presentationIdle: window.__probe.presentationIdle(),
        partials: document.querySelectorAll('#floaties .flymote').length,
      };
    }, mode));
  }
  expect(results).toEqual([
    { mode: 'append', threw: true, settled: true, presentationIdle: true, partials: 0 },
    { mode: 'animate', threw: true, settled: true, presentationIdle: true, partials: 0 },
  ]);
});

test('persistence dialog setup failure releases barrier, overlay and background ownership', async ({ page }) => {
  await boot(page);
  const result = await page.evaluate(async () => {
    let threw = false;
    try { window.__probe.showPersistenceSetupFailureProbe(); } catch { threw = true; }
    const settled = await Promise.race([
      window.__probe.settle().then(() => true),
      new Promise((resolve) => setTimeout(() => resolve(false), 100)),
    ]);
    const overlay = document.querySelector('#overlay');
    const background = document.querySelector('#shake');
    return {
      threw,
      settled,
      presentationIdle: window.__probe.presentationIdle(),
      overlayOpen: overlay.classList.contains('open'),
      overlayEmpty: overlay.childElementCount === 0,
      backgroundInert: !!background?.inert,
    };
  });
  expect(result).toEqual({
    threw: true,
    settled: true,
    presentationIdle: true,
    overlayOpen: false,
    overlayEmpty: true,
    backgroundInert: false,
  });
});

test('DEV trace policy keeps ordinary URLs off and Lab auto-enables without trace query', async ({ page }) => {
  await page.goto('/?trace=off');
  await page.waitForFunction(() => window.__probe?.behaviourTrace);
  expect(await page.evaluate(() => window.__probe.behaviourTrace())).toMatchObject({
    enabled: false, records: [], dropped: 0,
  });
  expect(new URL(page.url()).searchParams.has('trace')).toBe(false);

  await page.goto('/?lab=1&trace=off');
  await page.waitForFunction(() => window.__probe?.behaviourTrace);
  expect(new URL(page.url()).searchParams.has('trace')).toBe(false);
  expect(await page.evaluate(() => window.__probe.behaviourTrace().enabled)).toBe(true);
});

test('PR16 production Music Cue warm graph remains frozen', async ({ page }) => {
  await page.goto('/?trace=1');
  await page.waitForFunction(() => window.__probe);
  const graph = await page.evaluate(async () => {
    const { REGISTRY } = await import('/src/music.js');
    return Object.fromEntries(Object.entries(REGISTRY)
      .filter(([, entry]) => entry.warmWith)
      .map(([id, entry]) => [id, [...entry.warmWith]]));
  });
  expect(graph).toEqual(PR16_WARM_GRAPH);
});

test('checkpoint trace distinguishes paleDuskfang identity and forced Rose fallback', async ({ page }) => {
  await boot(page);
  await page.evaluate(() => window.spirebound.startCombatUI(['paleDuskfang'], 'monster'));
  await settle(page);
  await page.evaluate(() => {
    window.__probe.forceRoseFallback(true);
    window.spirebound.show('title');
  });
  const checkpoints = await page.evaluate(() => window.__probe.behaviourTrace().records
    .filter((record) => record.eventName === 'checkpoint.ui').map((record) => record.checkpoint));
  expect(checkpoints.some((checkpoint) => checkpoint.enemies.some((enemy) =>
    enemy.key === 'duskfang' && enemy.variantId === 'paleDuskfang'))).toBe(true);
  expect(checkpoints.some((checkpoint) => checkpoint.rose.fallback === true &&
    checkpoint.rose.ready === false && Array.isArray(checkpoint.rose.stateIds))).toBe(true);
});

test('Rose checkpoint becomes ready only after the real asset decode owner completes', async ({ page }) => {
  const vigil = freshLedger();
  vigil.quests.paleOnes = { state: 'complete', progress: 9, memory: {} };
  vigil.shards = ['paleOnes'];
  await seed(page, vigil);
  await expect(page.locator('.title-rose-medallion')).toBeEnabled();
  const rose = await page.evaluate(() => window.__probe.behaviourTrace().records
    .filter((record) => record.eventName === 'checkpoint.ui').map((record) => record.checkpoint.rose));
  expect(rose.some((state) => state.ready === true && state.fallback === false &&
    state.stateIds.includes('paleOnes:complete'))).toBe(true);
});

test('live Map warm set follows current act and adds Eighth only when active', async ({ page }) => {
  await boot(page);
  const sets = await page.evaluate(() => {
    const run = window.spirebound.S.run;
    run.act = 1;
    run.omens = [null, null, null];
    const ordinary = window.__probe.mapWarmSet();
    run.omens[1] = 'eighthOmen';
    const eighth = window.__probe.mapWarmSet();
    return { ordinary, eighth };
  });
  expect(sets.ordinary).toEqual([
    'act2Combat', 'act2Boss', 'elite', 'safeNodes', 'hollowLamplighter',
  ]);
  expect(sets.eighth).toEqual([...sets.ordinary, 'eighthOmen']);
});

test('probe invariant failures emit copy-free error.invariant evidence', async ({ page }) => {
  await boot(page);
  await startFight(page, ['sporeling']);
  await page.evaluate(() => {
    // Plate HP is Pixi-owned (Task 22b-2+); mutating the DOM label no longer
    // desyncs the probe. Nudge the engine value against the frozen plate model.
    const player = window.spirebound.S.cb.player;
    player.hp = Math.max(0, player.hp - 1);
  });
  expect((await page.evaluate(() => window.__probe.invariants())).some((item) => !item.pass)).toBe(true);
  const error = await page.evaluate(() => window.__probe.behaviourTrace().records
    .find((record) => record.eventName === 'error.invariant'));
  expect(error).toMatchObject({
    phase: 'point', outcome: 'failed',
    attributes: { code: 'probe-invariant-failed' },
  });
  expect(error.attributes.count).toBeGreaterThan(0);
});

test('draw-wave failures close presentation, queue and every child trace owner', async ({ page }) => {
  await boot(page);
  await page.evaluate(() => {
    window.__forcedDrawAnimationFailure = false;
    window.spirebound.combatGl?.presentation?.armFlightFailure?.();
    window.spirebound.startCombatUI(['sporeling'], 'normal');
  });
  await page.waitForFunction(() => window.__forcedDrawAnimationFailure === true &&
    window.__probe.queueIdle() && window.__probe.state().busy === false, null, { timeout: 30_000 });
  const result = await page.evaluate(() => {
    const records = window.__probe.behaviourTrace().records;
    const starts = records.filter((record) => record.phase === 'start');
    const ends = records.filter((record) => record.phase === 'end');
    return {
      integrity: window.__probe.traceIntegrity(),
      presentationIdle: window.__probe.presentationIdle(),
      error: records.some((record) => record.eventName === 'error.playback'),
      childStarts: starts.filter((record) => record.eventName === 'playback.queue-event').length,
      childEnds: ends.filter((record) => record.eventName === 'playback.queue-event').length,
      flightEnds: ends.filter((record) => record.eventName === 'presentation.card-flight').length,
    };
  });
  expect(result.error).toBe(true);
  expect(result.childStarts).toBeGreaterThan(0);
  expect(result.childEnds).toBe(result.childStarts);
  expect(result.presentationIdle).toBe(true);
  expect(result.integrity).toEqual({ ok: true, errors: [] });
});

test('raw pointer moves and idle animation frames do not create trace noise', async ({ page }) => {
  await page.goto('/?trace=1');
  await page.waitForFunction(() => window.__probe);
  await page.waitForFunction(() => window.__probe.behaviourTrace().records
    .some((record) => record.eventName === 'audio.music-request'));
  await page.evaluate(() => window.__probe.resetBehaviourTrace());
  const counts = await page.evaluate(async () => {
    const before = window.__probe.behaviourTrace().records.length;
    for (let index = 0; index < 100; index += 1) {
      document.dispatchEvent(new PointerEvent('pointermove', {
        bubbles: true, pointerId: 90, isPrimary: true, clientX: 20 + index, clientY: 30,
      }));
    }
    // Bound the rAF drain — under CI contention requestAnimationFrame can stall
    // long enough to trip the 90s test budget if we await 100 frames unconditionally.
    await Promise.race([
      (async () => {
        for (let index = 0; index < 100; index += 1) {
          await new Promise((resolve) => requestAnimationFrame(resolve));
        }
      })(),
      new Promise((resolve) => setTimeout(resolve, 1500)),
    ]);
    return { before, after: window.__probe.behaviourTrace().records.length };
  });
  expect(counts.after).toBe(counts.before);
});

test('complete synthetic UI catalogue preserves semantic trace and missing keys are copy-free', async ({ page }) => {
  await page.goto('/?trace=1');
  await page.waitForFunction(() => window.__probe);
  const result = await page.evaluate(async () => {
    const i18n = await import('/src/i18n/index.js');
    const en = (await import('/src/i18n/en/index.js')).default;
    const project = (records) => records
      .filter((record) => ['screen.requested', 'screen.exited', 'screen.entered'].includes(record.eventName))
      .map(({ eventName, phase, outcome, attributes }) => ({
        eventName, phase, outcome,
        attributes: attributes ? Object.fromEntries(Object.entries(attributes).filter(([key]) => key !== 'locale')) : undefined,
      }));
    const normaliseText = (text) => text.split('\n')
      .filter((line) => / screen\.(requested|exited|entered) /.test(` ${line} `))
      .map((line) => line.replace(/^\+[^ ]+ \[[^\]]+\] /, ''));
    const runJourney = () => {
      window.spirebound.show('title');
      window.__probe.resetBehaviourTrace();
      window.spirebound.show('embark');
      return {
        contract: project(window.__probe.behaviourTrace({ format: 'contract' }).records),
        text: normaliseText(window.__probe.behaviourTrace({ format: 'text' }).text),
      };
    };
    const baseline = runJourney();
    const synthetic = structuredClone(en);
    const rewrite = (value, path = 'ui') => {
      for (const [key, item] of Object.entries(value)) {
        if (typeof item === 'string') value[key] = `Synthetic ${path}.${key}`;
        else if (item && typeof item === 'object') rewrite(item, `${path}.${key}`);
      }
    };
    rewrite(synthetic.ui);
    i18n.registerLocale('zz', synthetic);
    try {
      i18n.setLocale('zz');
      const translated = runJourney();
      window.__probe.translateForProbe('ui.missing.contract.key');
      const missing = window.__probe.behaviourTrace().records.find((record) => record.eventName === 'i18n.missing');
      return { baseline, translated, missing, restored: false };
    } finally {
      i18n.setLocale('en');
      window.spirebound.show('title');
    }
  });
  expect(result.translated.contract).toEqual(result.baseline.contract);
  expect(result.translated.text).toEqual(result.baseline.text);
  bindTraceContract('i18n-copy-invariance', result.baseline.contract.map((record) =>
    [record.eventName, record.phase, record.outcome ?? null]));
  expect(result.missing.attributes).toEqual({
    locale: 'zz', localeKey: 'ui.missing.contract.key', code: 'missing-key',
  });
  expect(await page.evaluate(async () => (await import('/src/i18n/index.js')).getLocale())).toBe('en');
});

test('frozen Task 6 fixture manifest is complete and every entry resolves', async ({ page }) => {
  await page.goto('/?trace=1');
  // Do not proceed on bare __probe — wait for the Pixi layer itself.
  await page.waitForFunction(() => window.spirebound?.pixi?.status?.() === 'ready', null, {
    timeout: 20_000,
  });
  const renderer = await page.evaluate(() => {
    const ui = window.__probe?.ui?.();
    const pixi = window.spirebound?.pixi?.stats?.();
    return {
      kind: ui?.renderer?.kind || pixi?.rendererKind || null,
      // combat-gl `generation` stays 0 until a combat remount/rebuild; Pixi
      // layer generation is the P4 identity counter (≥1 after boot).
      combatGeneration: ui?.renderer?.generation ?? null,
      pixiGeneration: ui?.pixi?.generation ?? pixi?.generation ?? null,
      status: ui?.renderer?.state || pixi?.status || null,
    };
  });
  // Renderer identity is asserted separately so Task 6 semantic fixtures stay
  // byte-for-byte fixed (comparison-only; never rewrite under P4).
  expect(renderer.kind).toBe('pixi');
  expect(renderer.pixiGeneration).toBeGreaterThanOrEqual(1);

  const manifest = await page.evaluate(async () =>
    (await fetch('/test/e2e/fixtures/trace/manifest.json')).json());
  expect(manifest.fixtures).toHaveLength(18);
  for (const fixtureId of manifest.fixtures) {
    const fixture = await page.evaluate(async (id) =>
      (await fetch(`/test/e2e/fixtures/trace/${id}.json`)).json(), fixtureId);
    expect(fixture.journey).toBe(fixtureId);
    expect(fixture.records.length).toBeGreaterThan(0);
    expect(JSON.stringify(fixture)).not.toMatch(/atMs|gitSha|runId|instanceId|assetUrl|https?:/);
  }
  // Comparison-only guard: the update latch must stay off in ordinary runs.
  expect(process.env.UPDATE_TRACE_CONTRACTS).not.toBe('1');
});

test('persistence fixtures: initial run, Usurper and Shade use real retry owners', async ({ page }) => {
  test.setTimeout(120_000);
  await seed(page, freshLedger());
  await page.click('[data-a="embark"]', { force: true });
  await page.evaluate(() => {
    const original = Storage.prototype.setItem;
    window.__rejectInitialTrace = true;
    Storage.prototype.setItem = function setItem(key, value) {
      if (key === 'spirebound_save_v2' && window.__rejectInitialTrace) throw new Error('initial trace failure');
      return original.call(this, key, value);
    };
  });
  await page.click('[data-a="begin"]', { force: true });
  await expect(page.locator('[data-a="retry-save"]')).toBeFocused();
  await page.click('[data-a="retry-save"]', { force: true });
  await page.evaluate(() => { window.__rejectInitialTrace = false; });
  await page.click('[data-a="retry-save"]');
  await page.waitForFunction(() => window.spirebound.S.screen === 'map');
  bindTraceContract('initial-run-save', await persistenceContractRows(page, 'initial-run'));
  const persistenceText = await page.evaluate(() => window.__probe.behaviourTrace({ format: 'text' }));
  expect(persistenceText.records).toEqual([]);
  expect(persistenceText.text).toContain('persistence.blocked phase=point outcome=rejected');
  expect(persistenceText.text).toContain('persistence.recovered phase=point outcome=completed');

  await seedUsurperTraceShop(page);
  await page.evaluate(() => {
    const original = Storage.prototype.setItem;
    window.__rejectUsurperTrace = true;
    Storage.prototype.setItem = function setItem(key, value) {
      if (key === 'spirebound_save_v2' && window.__rejectUsurperTrace) throw new Error('Usurper trace failure');
      return original.call(this, key, value);
    };
  });
  await page.click('.quest-shop-item button');
  await page.click('[data-a="retry-save"]');
  await page.evaluate(() => { window.__rejectUsurperTrace = false; });
  await page.click('[data-a="retry-save"]');
  await expect(page.locator('.quest-shop-item')).toHaveClass(/sold/);
  bindTraceContract('usurper-purchase', await persistenceContractRows(page, 'usurper-purchase'));

  const vigil = freshLedger();
  vigil.quests.ownShade = { state: 'revealed', progress: 0, memory: {} };
  vigil.lastFall = { act: 1, row: 4, bequest: null, standing: true, shadeAspect: 0 };
  await seed(page, vigil);
  await page.waitForFunction(() => window.__probe?.behaviourTrace().records
    .some((record) => record.eventName === 'app.ready'));
  await page.evaluate(() => {
    const sp = window.spirebound;
    const stored = JSON.parse(localStorage.getItem('spirebound_vigil_v2'));
    const run = sp.E.newRun(9502, { quests: stored.quests, monument: stored.lastFall });
    run.act = 1;
    run.map = sp.E.genMap(run);
    run.monument.claimed = true;
    run.questScratch.ownShade = { pendingBequest: null };
    sp.E.setPendingEncounter(run, 'monster', ['ownShade1'], 'ownShade');
    if (!sp.E.saveRun(run)) throw new Error('Shade trace fixture did not persist');
    sp.show('title');
    const original = Storage.prototype.setItem;
    window.__rejectShadeTrace = true;
    Storage.prototype.setItem = function setItem(key, value) {
      if (key === 'spirebound_vigil_v2' && window.__rejectShadeTrace) throw new Error('Shade trace failure');
      return original.call(this, key, value);
    };
  });
  await page.click('[data-a="continue"]', { force: true });
  await expect(page.locator('[data-a="retry-stone"]')).toBeFocused();
  await page.evaluate(() => { window.__rejectShadeTrace = false; });
  await page.click('[data-a="retry-stone"]', { force: true });
  await page.waitForFunction(() => window.spirebound.S.screen === 'combat', null, { timeout: 30_000 });
  bindTraceContract('shade-bequest-clear', await persistenceContractRows(page, 'shade-bequest-clear'));
});

test('persistence fixtures: Hollow payment and route clear use real retry owners', async ({ page }) => {
  await seedHollowTrace(page);
  await page.evaluate(() => {
    const original = Storage.prototype.setItem;
    window.__rejectHollowPaymentTrace = true;
    Storage.prototype.setItem = function setItem(key, value) {
      if (key === 'spirebound_save_v2' && window.__rejectHollowPaymentTrace) {
        window.__rejectHollowPaymentTrace = false;
        throw new Error('Hollow payment trace failure');
      }
      return original.call(this, key, value);
    };
  });
  await page.click('[data-a="hollow-pay"]');
  await expect(page.locator('.hollow-error')).toContainText('not yet secured');
  await page.click('[data-a="hollow-pay"]');
  await expect(page.locator('[data-a="hollow-continue"]')).toBeEnabled();
  bindTraceContract('hollow-payment', await persistenceContractRows(page, 'hollow-payment'));

  await page.click('[data-a="hollow-continue"]');
  await page.waitForFunction(() => window.spirebound.S.screen === 'shop');
  await page.evaluate(() => {
    const original = Storage.prototype.setItem;
    window.__rejectHollowClearTrace = true;
    Storage.prototype.setItem = function setItem(key, value) {
      if (key === 'spirebound_save_v2' && window.__rejectHollowClearTrace) {
        window.__rejectHollowClearTrace = false;
        throw new Error('Hollow route trace failure');
      }
      return original.call(this, key, value);
    };
  });
  await page.click('[data-a="leave"]');
  await expect(page.locator('[data-a="retry-hollow-route"]')).toBeFocused();
  await page.click('[data-a="retry-hollow-route"]');
  await page.waitForFunction(() => window.spirebound.S.screen === 'map');
  bindTraceContract('hollow-route-clear', await persistenceContractRows(page, 'hollow-route-clear'));
});

test('persistence fixtures: terminal outbox uses the real retry owner', async ({ page }) => {
  await stagePendingRunEnd(page, 'death');
  await page.addInitScript(() => {
    const original = Storage.prototype.setItem;
    window.__rejectTerminalTrace = true;
    Storage.prototype.setItem = function setItem(key, value) {
      if (key === 'spirebound_vigil_v2' && window.__rejectTerminalTrace) throw new Error('terminal trace failure');
      return original.call(this, key, value);
    };
  });
  await page.reload();
  await expect(page.locator('[data-a="retry-end"]')).toBeFocused();
  await page.evaluate(() => { window.__rejectTerminalTrace = false; });
  await page.click('[data-a="retry-end"]');
  await page.waitForFunction(() => window.spirebound.S.screen === 'end');
  bindTraceContract('terminal-outbox-retry', await persistenceContractRows(page, 'run-end'));
});

test('persistence fixtures: Dawn cursor and final clear use real retry owners', async ({ page }) => {
  await seed(page, freshLedger());
  await page.waitForFunction(() => window.__probe?.behaviourTrace().records
    .some((record) => record.eventName === 'app.ready'));
  await page.evaluate(() => {
    const sp = window.spirebound;
    const run = sp.E.newRun(9941);
    run.pendingRunEnd = { outcome: 'win' };
    if (!sp.E.saveRun(run) || !sp.E.stagePendingDawn(run, [
      { t: 'eighthResolved', text: 'TRACE CURSOR SENTINEL' },
    ], [])) throw new Error('cursor trace fixture did not stage');
    const original = Storage.prototype.setItem;
    window.__rejectCursorTrace = true;
    Storage.prototype.setItem = function setItem(key, value) {
      if (key === 'spirebound_save_v2' && window.__rejectCursorTrace) throw new Error('cursor trace failure');
      return original.call(this, key, value);
    };
    sp.S.run = run;
    sp.show('end', { won: true });
  });
  await expect(page.locator('[data-a="retry-dawn"]')).toBeFocused();
  await page.evaluate(() => { window.__rejectCursorTrace = false; });
  await page.click('[data-a="retry-dawn"]');
  await waitForDawnComplete(page);
  bindTraceContract('dawn-cursor-retry', await persistenceContractRows(page, 'dawn-cursor'));

  await seed(page, freshLedger());
  await page.waitForFunction(() => window.__probe?.behaviourTrace().records
    .some((record) => record.eventName === 'app.ready'));
  await page.evaluate(() => {
    const sp = window.spirebound;
    const run = sp.E.newRun(9942);
    run.pendingRunEnd = { outcome: 'win' };
    if (!sp.E.saveRun(run) || !sp.E.stagePendingDawn(run, [], [])) throw new Error('clear trace fixture did not stage');
    const original = Storage.prototype.removeItem;
    window.__rejectClearTrace = true;
    Storage.prototype.removeItem = function removeItem(key) {
      if (key === 'spirebound_save_v2' && window.__rejectClearTrace) throw new Error('clear trace failure');
      return original.call(this, key);
    };
    sp.S.run = run;
    sp.show('end', { won: true });
  });
  await expect(page.locator('[data-a="retry-dawn"]')).toBeFocused();
  await page.evaluate(() => { window.__rejectClearTrace = false; });
  await page.click('[data-a="retry-dawn"]');
  await waitForDawnComplete(page);
  bindTraceContract('dawn-final-clear-retry', await persistenceContractRows(page, 'dawn-clear'));
});

test('persistence fixture: Dawn resumes from its acknowledged cursor', async ({ page }) => {
  await stagePendingRunEnd(page, 'win');
  await page.reload();
  await page.waitForFunction(() => window.spirebound?.S.screen === 'end');
  await waitForDawnComplete(page);
  const rows = await page.evaluate(() => window.__probe.behaviourTrace().records
    .filter((record) => record.eventName === 'presentation.dawn' ||
      record.eventName === 'presentation.dawn-panel' ||
      (record.eventName.startsWith('persistence.') && record.attributes?.kind === 'dawn-cursor'))
    .map((record) => ({
      eventName: record.eventName, phase: record.phase, outcome: record.outcome ?? null,
      ...(record.attributes ? { attributes: record.attributes } : {}),
    })));
  bindTraceContract('dawn-resume-from-cursor', dawnResumeProjection(rows));
});
