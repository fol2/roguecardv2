// Task 23 — sole stage combat pointer router + Probe v2 contract.
import { test, expect } from './trace-fixture.js';
import {
  boot, settle, collectErrors, expectNoErrors, stageBoundsToClient, pointerDrag,
} from './helpers.js';

test.beforeEach(() => {
  test.skip(test.info().project.name !== 'desktop', 'input-router runs on desktop only');
});

async function bootCombat(page) {
  const errors = collectErrors(page);
  await boot(page);
  await page.evaluate(async () => {
    await window.__probe.stageCoreTheme({ themeId: 'act1' });
  });
  await settle(page);
  return errors;
}

test('Pixi hand owns seats — no DOM hand cards; keyboard cycles and plays', async ({ page }) => {
  const errors = await bootCombat(page);
  const baseline = await page.evaluate(() => {
    window.__probe.setEnergy(3);
    window.__probe.forceHand(['strike', 'defend', 'strike']);
    const ui = window.__probe.ui();
    const plates = (window.__probe.combatRendererReadUI()?.enemies || []).map((e) => e.plateBounds);
    return {
      domCards: document.querySelectorAll('.hand-zone .card').length,
      aimChildren: document.querySelector('#aim')?.childElementCount ?? -1,
      hand: ui.hand.length,
      seats: ui.hand.map((c) => c.seatBounds),
      plates,
      sheen: ui.hand.map((c) => c.sheen),
    };
  });
  expect(baseline.domCards).toBe(0);
  expect(baseline.aimChildren).toBe(0);
  expect(baseline.hand).toBeGreaterThan(0);
  expect(baseline.seats.every((s) => s && s.width > 0)).toBe(true);

  // Hover first seat — foe plates must stay within 1 stage px.
  const seat = baseline.seats[0];
  const from = await stageBoundsToClient(page, seat);
  await page.mouse.move(from.x, from.y);
  await settle(page);
  const afterHover = await page.evaluate((before) => {
    const plates = (window.__probe.combatRendererReadUI()?.enemies || []).map((e) => e.plateBounds);
    const ui = window.__probe.ui();
    return {
      plates,
      hovered: ui.hand.some((c) => c.hovered),
      drift: plates.map((p, i) => ({
        top: Math.abs((p?.top ?? 0) - (before[i]?.top ?? 0)),
        bottom: Math.abs((p?.bottom ?? 0) - (before[i]?.bottom ?? 0)),
      })),
    };
  }, baseline.plates);
  expect(afterHover.hovered).toBe(true);
  for (const d of afterHover.drift) {
    expect(d.top).toBeLessThanOrEqual(1);
    expect(d.bottom).toBeLessThanOrEqual(1);
  }

  // Keyboard: Right cycles, Enter activates defend path / End Turn via E.
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  const selected = await page.evaluate(() => window.__probe.ui().selectedCardUid);
  expect(selected).not.toBeNull();
  await page.keyboard.press('e');
  await settle(page);
  expectNoErrors(errors);
});

test('Probe v2 exposes the full renderer-neutral ui() shape', async ({ page }) => {
  const errors = await bootCombat(page);
  const ui = await page.evaluate(() => window.__probe.ui());
  expect(ui.version).toBe(2);
  expect(ui.renderer).toMatchObject({
    kind: 'pixi',
    state: expect.any(String),
    generation: expect.any(Number),
  });
  expect(ui.renderer.policy).toBeTruthy();
  expect(Array.isArray(ui.hand)).toBe(true);
  expect(ui.hand.length).toBeGreaterThan(0);
  expect(ui.hand[0]).toEqual(expect.objectContaining({
    uid: expect.any(Number),
    id: expect.any(String),
    playable: expect.any(Boolean),
    selected: expect.any(Boolean),
    dragging: expect.any(Boolean),
  }));
  expect(ui.piles).toEqual(expect.objectContaining({
    draw: expect.objectContaining({ count: expect.any(Number) }),
    discard: expect.objectContaining({ count: expect.any(Number) }),
    ashes: expect.objectContaining({ count: expect.any(Number) }),
  }));
  expect(ui.energy).toEqual(expect.objectContaining({ value: expect.any(Number) }));
  expect(ui.lantern).toEqual(expect.objectContaining({ embers: expect.any(Number) }));
  expect(ui.endTurn).toEqual(expect.objectContaining({ enabled: expect.any(Boolean) }));
  expect(ui.player).toBeTruthy();
  expect(Array.isArray(ui.enemies)).toBe(true);
  expect(ui.input).toEqual(expect.objectContaining({ enabled: true }));
  expect(ui.textures).toEqual(expect.objectContaining({ ready: expect.any(Boolean) }));
  expect(await page.evaluate(() => window.__probe.queueIdle())).toBe(true);
  expect(typeof (await page.evaluate(() => typeof window.__probe.settle))).toBe('string');
  expectNoErrors(errors);
});

test('#combat-hit-proxies is gone; stage owns routing and never hits #uigl', async ({ page }) => {
  const errors = await bootCombat(page);
  const probe = await page.evaluate(() => {
    const host = document.getElementById('combat-hit-proxies');
    const ui = window.__probe.ui();
    const card = ui.hand.find((c) => c.playable) || ui.hand[0];
    return {
      hostPresent: !!host,
      inputEnabled: ui.input?.enabled === true,
      cardBounds: card?.bounds || card?.seatBounds || null,
      uiglPointerEvents: getComputedStyle(document.getElementById('uigl')).pointerEvents,
    };
  });
  expect(probe.hostPresent).toBe(false);
  expect(probe.inputEnabled).toBe(true);
  expect(probe.uiglPointerEvents).toBe('none');
  expect(probe.cardBounds).toBeTruthy();

  const from = await stageBoundsToClient(page, probe.cardBounds);
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  const dispatch = await page.evaluate(() => window.__probe.ui().input?.lastDispatch || null);
  await page.mouse.up();

  expect(dispatch).toBeTruthy();
  expect(dispatch.ownerId).toBe('stage');
  expect(dispatch.currentTargetId).toBe('stage');
  expect(dispatch.composedPathIds || []).not.toContain('uigl');
  expect(dispatch.targetId).not.toBe('uigl');
  expectNoErrors(errors);
});

test('26px upward starts drag; 12px cancels long-press; cancel restores seat', async ({ page }) => {
  const errors = await bootCombat(page);
  const setup = await page.evaluate(() => {
    window.__probe.setEnergy(3);
    const [uid] = window.__probe.forceHand(['defend']);
    const ui = window.__probe.ui();
    const card = ui.hand.find((c) => c.uid === uid);
    return {
      uid,
      seatBounds: card.seatBounds,
      beforeSeq: window.__probe.behaviourTrace().lastSeq,
    };
  });
  const from = await stageBoundsToClient(page, setup.seatBounds);

  const dispatchGesture = async (moves, { cancel = false, loseCapture = false } = {}) => {
    await page.evaluate(({ origin, path, doCancel, doLose }) => {
      const stage = document.getElementById('stage');
      const pid = 42;
      const fire = (type, x, y, extra = {}) => {
        stage.dispatchEvent(new PointerEvent(type, {
          bubbles: true, cancelable: true, pointerId: pid, isPrimary: true,
          pointerType: 'mouse', clientX: x, clientY: y, ...extra,
        }));
      };
      fire('pointerdown', origin.x, origin.y);
      for (const point of path) fire('pointermove', point.x, point.y);
      if (doCancel) {
        fire('pointercancel', path.at(-1)?.x ?? origin.x, path.at(-1)?.y ?? origin.y);
        return;
      }
      if (doLose) {
        try { stage.releasePointerCapture(pid); } catch { /* ignore */ }
        fire('lostpointercapture', path.at(-1)?.x ?? origin.x, path.at(-1)?.y ?? origin.y);
        return;
      }
      fire('pointerup', path.at(-1)?.x ?? origin.x, path.at(-1)?.y ?? origin.y);
    }, {
      origin: from,
      path: moves,
      doCancel: cancel,
      doLose: loseCapture,
    });
  };

  // 12px move — must not start drag.
  await dispatchGesture([{ x: from.x, y: from.y - 12 }]);
  let mid = await page.evaluate(() => window.__probe.ui().input);
  expect(mid.dragging).toBe(false);

  // Re-seat a fresh defend in case a stray click consumed the prior one.
  await page.evaluate(() => {
    window.__probe.setEnergy(3);
    window.__probe.forceHand(['defend']);
  });
  await settle(page);
  // Flush chrome-clamp rAF so seat bounds are stable before we capture them.
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  const refreshed = await page.evaluate(() => {
    const ui = window.__probe.ui();
    const card = ui.hand.find((c) => c.id === 'defend');
    return { uid: card.uid, seatBounds: card.seatBounds };
  });
  const from2 = await stageBoundsToClient(page, refreshed.seatBounds);

  // 26px upward — starts drag.
  await page.evaluate(({ origin }) => {
    const stage = document.getElementById('stage');
    const pid = 43;
    const fire = (type, x, y) => {
      stage.dispatchEvent(new PointerEvent(type, {
        bubbles: true, cancelable: true, pointerId: pid, isPrimary: true,
        pointerType: 'mouse', clientX: x, clientY: y,
      }));
    };
    fire('pointerdown', origin.x, origin.y);
    fire('pointermove', origin.x, origin.y - 26);
  }, { origin: from2 });
  mid = await page.evaluate(() => window.__probe.ui().input);
  expect(mid.dragging).toBe(true);
  const seatDuring = mid.gesture?.seatBounds;
  expect(seatDuring).toEqual(expect.objectContaining({
    left: refreshed.seatBounds.left,
    top: refreshed.seatBounds.top,
    width: refreshed.seatBounds.width,
    height: refreshed.seatBounds.height,
  }));

  // pointercancel — play nothing, emit cancelled, restore seat.
  await page.evaluate(() => {
    const stage = document.getElementById('stage');
    stage.dispatchEvent(new PointerEvent('pointercancel', {
      bubbles: true, cancelable: true, pointerId: 43, isPrimary: true,
      pointerType: 'mouse', clientX: 0, clientY: 0,
    }));
  });
  await settle(page);
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  const afterCancel = await page.evaluate((uid) => {
    const ui = window.__probe.ui();
    const card = ui.hand.find((c) => c.uid === uid);
    const records = window.__probe.behaviourTrace().records;
    return {
      stillInHand: !!card,
      dragging: ui.input?.dragging === true,
      seatBounds: card?.seatBounds || null,
      cancelled: records.some((r) =>
        r.eventName === 'input.card-drag' && r.phase === 'end' && r.outcome === 'cancelled'),
    };
  }, refreshed.uid);
  expect(afterCancel.stillInHand).toBe(true);
  expect(afterCancel.dragging).toBe(false);
  expect(afterCancel.cancelled).toBe(true);
  expect(afterCancel.seatBounds).toEqual(expect.objectContaining({
    left: refreshed.seatBounds.left,
    top: refreshed.seatBounds.top,
  }));

  // lostpointercapture path
  await page.evaluate(({ origin }) => {
    const stage = document.getElementById('stage');
    const pid = 44;
    const fire = (type, x, y) => {
      stage.dispatchEvent(new PointerEvent(type, {
        bubbles: true, cancelable: true, pointerId: pid, isPrimary: true,
        pointerType: 'mouse', clientX: x, clientY: y,
      }));
    };
    fire('pointerdown', origin.x, origin.y);
    fire('pointermove', origin.x, origin.y - 30);
    fire('lostpointercapture', origin.x, origin.y - 30);
  }, { origin: from2 });
  await settle(page);
  const afterLost = await page.evaluate((uid) => {
    const ui = window.__probe.ui();
    return {
      stillInHand: ui.hand.some((c) => c.uid === uid),
      dragging: ui.input?.dragging === true,
    };
  }, refreshed.uid);
  expect(afterLost.stillInHand).toBe(true);
  expect(afterLost.dragging).toBe(false);
  expectNoErrors(errors);
});

test('enemy bounds come from battlefield geometry via probe.ui()', async ({ page }) => {
  const errors = await bootCombat(page);
  const result = await page.evaluate(() => {
    const ui = window.__probe.ui();
    const enemy = ui.enemies.find((e) => e.alive);
    return {
      enemy,
      hasBounds: !!(enemy?.bounds && enemy.bounds.width > 0 && enemy.bounds.height > 0),
    };
  });
  expect(result.hasBounds).toBe(true);
  expectNoErrors(errors);
});

test('real pointer play through the stage router commits a defend', async ({ page }) => {
  const errors = await bootCombat(page);
  const setup = await page.evaluate(() => {
    window.__probe.setEnergy(3);
    const [uid] = window.__probe.forceHand(['defend']);
    const ui = window.__probe.ui();
    const card = ui.hand.find((c) => c.uid === uid) || ui.hand[0];
    const hand = document.querySelector('.hand-zone') || document.querySelector('.hand');
    const info = window.__probe.stage();
    const stage = document.getElementById('stage');
    const sr = stage.getBoundingClientRect();
    const hr = hand.getBoundingClientRect();
    const handTop = (hr.top - sr.top) / (info.scale || 1);
    const castLine = handTop - 24;
    const cx = (card.bounds.left + card.bounds.right) / 2;
    // Release clearly above the cast line in stage px.
    const releaseStage = { left: cx, top: castLine - 40, width: 0, height: 0 };
    return {
      uid: card.uid,
      bounds: card.bounds,
      releaseStage,
      castLine,
      blockBefore: window.__probe.state().player.block,
    };
  });
  // Real Playwright mouse drag — stageBoundsToClient(probe.ui().hand[…]) → cast line.
  // Synthetic PointerEvents stay reserved for pointercancel / lostpointercapture paths.
  const from = await stageBoundsToClient(page, setup.bounds);
  const to = await stageBoundsToClient(page, setup.releaseStage);
  await pointerDrag(page, from, to, { steps: 10 });
  await settle(page);
  const after = await page.evaluate((uid) => ({
    inHand: window.__probe.state().hand?.some((c) => c.uid === uid) === true,
    block: window.__probe.state().player.block,
  }), setup.uid);
  expect(after.inHand).toBe(false);
  expect(after.block).toBeGreaterThan(setup.blockBefore);
  expectNoErrors(errors);
});
