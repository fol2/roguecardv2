// Sole stage-level combat pointer router (Round 5 Task 23).
// `#uigl` stays pointer-inert; `#stage` owns capture after acceptance.
// Hit order: Pixi chrome → P4 DOM hand → residual DOM (enemies / overlays).

export const DRAG_START_PX = 26;
export const LONG_PRESS_CANCEL_PX = 12;

function pathIds(event) {
  const path = typeof event.composedPath === 'function' ? event.composedPath() : [];
  return path
    .filter((node) => node && node.id)
    .map((node) => node.id);
}

function pointInRect(x, y, rect) {
  if (!rect) return false;
  const left = rect.left ?? rect.x ?? 0;
  const top = rect.top ?? rect.y ?? 0;
  const right = rect.right ?? (left + (rect.width ?? 0));
  const bottom = rect.bottom ?? (top + (rect.height ?? 0));
  return x >= left && x <= right && y >= top && y <= bottom;
}

/**
 * @param {object} deps
 * @param {HTMLElement|(() => HTMLElement|null)} deps.stage
 * @param {(cx:number, cy:number) => {x:number,y:number}} deps.toStage
 * @param {{ hitTest:(x:number,y:number)=>any, setInteraction?:Function }|null} deps.renderer
 * @param {{ hitTest:(pt:{x:number,y:number}, event:PointerEvent)=>any, beginDrag?:Function, moveDrag?:Function, finishDrag?:Function, click?:Function }|null} deps.domHandAdapter
 * @param {(() => { enemies?: Array<{index:number, bounds:any}>, hero?: {bounds:any} })|null} deps.targetRegions
 * @param {object} deps.actions semantic combat handlers
 * @param {{ showFromBounds?:Function, hide?:Function, longPressMove?:Function }|null} deps.tooltip
 * @param {{ emit?:Function, begin?:Function }|null} deps.trace
 */
export function createCombatPointerRouter({
  stage,
  toStage,
  renderer = null,
  domHandAdapter = null,
  targetRegions = null,
  actions = {},
  tooltip = null,
  trace = null,
} = {}) {
  if (typeof toStage !== 'function') {
    throw new TypeError('createCombatPointerRouter requires toStage');
  }

  let enabled = false;
  let destroyed = false;
  let gesture = null;
  let lastDispatch = null;
  let longPress = null;
  let capturedPointerId = null;

  const stageNode = () => (typeof stage === 'function' ? stage() : stage);

  function recordDispatch(event, claim) {
    const node = stageNode();
    lastDispatch = Object.freeze({
      type: event.type,
      pointerId: event.pointerId,
      ownerId: node?.id || 'stage',
      currentTargetId: event.currentTarget?.id || node?.id || null,
      targetId: event.target?.id || null,
      composedPathIds: Object.freeze(pathIds(event)),
      claim: claim ? Object.freeze({ ...claim }) : null,
    });
  }

  function clearLongPress() {
    if (longPress?.timer) clearTimeout(longPress.timer);
    longPress = null;
  }

  function releaseCapture() {
    const node = stageNode();
    if (node && capturedPointerId != null) {
      try {
        if (node.hasPointerCapture?.(capturedPointerId)) {
          node.releasePointerCapture(capturedPointerId);
        }
      } catch { /* already released */ }
    }
    capturedPointerId = null;
  }

  function acceptCapture(event) {
    const node = stageNode();
    if (!node) return;
    try {
      node.setPointerCapture(event.pointerId);
      capturedPointerId = event.pointerId;
    } catch { /* capture may fail on synthetic events */ }
  }

  function cleanupGesture(reason, { emitCancel = true } = {}) {
    const prior = gesture;
    clearLongPress();
    releaseCapture();
    gesture = null;
    if (prior?.kind === 'card' && prior.live) {
      if (emitCancel) {
        prior.traceSpan?.finish?.('cancelled', { reason: reason || 'cancelled' });
        actions.cancelCardDrag?.(prior, reason || 'cancelled');
      }
    } else if (prior?.kind === 'card' && !prior.live && emitCancel) {
      actions.cancelCardPress?.(prior, reason || 'cancelled');
    }
    renderer?.setInteraction?.('idle');
    return prior;
  }

  function hitEnemy(stagePt) {
    const regions = typeof targetRegions === 'function' ? targetRegions() : targetRegions;
    const enemies = regions?.enemies || [];
    for (let i = enemies.length - 1; i >= 0; i -= 1) {
      const entry = enemies[i];
      if (entry && pointInRect(stagePt.x, stagePt.y, entry.bounds)) {
        return { kind: 'enemy', index: entry.index, bounds: entry.bounds };
      }
    }
    return null;
  }

  function resolveHit(stagePt, event) {
    const pixiHit = renderer?.hitTest?.(stagePt.x, stagePt.y) || null;
    if (pixiHit) return { source: 'pixi', hit: pixiHit };
    const handHit = domHandAdapter?.hitTest?.(stagePt, event) || null;
    if (handHit) return { source: 'hand', hit: handHit };
    const enemyHit = hitEnemy(stagePt);
    if (enemyHit) return { source: 'enemy', hit: enemyHit };
    return null;
  }

  function armLongPress(event, tip) {
    clearLongPress();
    if (!tip || event.pointerType === 'mouse') return;
    const x0 = event.clientX;
    const y0 = event.clientY;
    longPress = {
      x0,
      y0,
      tip,
      timer: setTimeout(() => {
        longPress = null;
        tooltip?.showFromBounds?.(tip.content, tip.bounds, { clientX: x0, clientY: y0, touch: true });
      }, 380),
    };
  }

  function onPointerDown(event) {
    if (!enabled || destroyed || !event.isPrimary) return;
    if (event.target?.closest?.('#overlay.open, #pop-menu, .modal, [data-dev-shell]')) return;

    // Never treat #uigl as an interactive composed target — it is paint-only.
    if (event.target?.id === 'uigl' || pathIds(event).includes('uigl')) {
      // Fall through: stage still owns routing; ignore the canvas id.
    }

    const stagePt = toStage(event.clientX, event.clientY);
    const resolved = resolveHit(stagePt, event);
    recordDispatch(event, resolved ? { source: resolved.source, kind: resolved.hit?.kind || resolved.hit?.type } : null);

    if (!resolved) {
      // Residual: clear targeting / hover when tapping empty stage chrome.
      if (!event.target?.closest?.('.enemy, .card, button, a, input, textarea, [data-act]')) {
        actions.tapBackground?.(event);
      }
      return;
    }

    const { source, hit } = resolved;
    event.preventDefault();
    event.stopPropagation();
    acceptCapture(event);

    if (source === 'hand' && hit.kind === 'card') {
      gesture = {
        kind: 'card',
        uid: hit.uid,
        id: event.pointerId,
        x0: event.clientX,
        y0: event.clientY,
        live: false,
        free: false,
        seatBounds: hit.seatBounds || null,
        el: hit.el || null,
        traceSpan: null,
      };
      renderer?.setInteraction?.('card-press');
      if (hit.tip) armLongPress(event, hit.tip);
      return;
    }

    if (source === 'pixi') {
      gesture = {
        kind: 'chrome',
        chrome: hit.kind || hit.type,
        detail: hit,
        id: event.pointerId,
        x0: event.clientX,
        y0: event.clientY,
        moved: false,
      };
      renderer?.setInteraction?.(`chrome:${gesture.chrome}`);
      if (hit.tip) armLongPress(event, { content: hit.tip, bounds: hit.bounds });
      return;
    }

    if (source === 'enemy') {
      gesture = {
        kind: 'enemy',
        index: hit.index,
        id: event.pointerId,
        x0: event.clientX,
        y0: event.clientY,
      };
      renderer?.setInteraction?.('enemy');
      actions.enemyHover?.(hit.index, true);
    }
  }

  function onPointerMove(event) {
    if (!enabled || destroyed) return;
    if (longPress && Math.hypot(event.clientX - longPress.x0, event.clientY - longPress.y0) > LONG_PRESS_CANCEL_PX) {
      clearLongPress();
      tooltip?.hide?.();
    }
    tooltip?.longPressMove?.(event);

    // Targeting aim arc follows stage pointer when no card drag is live.
    if (!gesture && actions.aimMove) {
      actions.aimMove(event);
    }

    const st = gesture;
    if (!st || event.pointerId !== st.id) {
      // Mouse hover tips over Pixi chrome (no active gesture).
      if (event.pointerType === 'mouse' && !gesture) {
        const stagePt = toStage(event.clientX, event.clientY);
        const pixiHit = renderer?.hitTest?.(stagePt.x, stagePt.y);
        if (pixiHit?.tip) {
          tooltip?.showFromBounds?.(pixiHit.tip, pixiHit.bounds, {
            clientX: event.clientX, clientY: event.clientY, touch: false,
          });
        }
      }
      return;
    }

    if (st.kind === 'card') {
      if (!st.live) {
        if (st.y0 - event.clientY < DRAG_START_PX) return;
        clearLongPress();
        tooltip?.hide?.();
        const began = actions.beginCardDrag?.(st, event);
        if (began === false) {
          cleanupGesture('unplayable', { emitCancel: false });
          return;
        }
        st.live = true;
        st.free = !!st.free;
        st.traceSpan = trace?.begin?.('input.card-drag', {
          attributes: { cardId: st.cardId, uid: st.uid },
        }) || null;
        renderer?.setInteraction?.('card-drag');
        // Arming frame only — free-drag transform starts on the next move so a
        // cancel before any moveCardDrag restores the exact captured seat.
        return;
      }
      actions.moveCardDrag?.(st, event);
      return;
    }

    if (st.kind === 'chrome') {
      if (Math.hypot(event.clientX - st.x0, event.clientY - st.y0) > LONG_PRESS_CANCEL_PX) {
        st.moved = true;
      }
      return;
    }

    if (st.kind === 'enemy') {
      const stagePt = toStage(event.clientX, event.clientY);
      const next = hitEnemy(stagePt);
      if (next && next.index !== st.index) {
        actions.enemyHover?.(st.index, false);
        st.index = next.index;
        actions.enemyHover?.(st.index, true);
      }
    }
  }

  function activateChrome(hit, event) {
    const kind = hit.kind || hit.type;
    switch (kind) {
      case 'lantern':
        return actions.lantern?.(event);
      case 'end-turn':
      case 'endTurn':
        return actions.endTurn?.(event);
      case 'draw':
        return actions.openPile?.('draw', event);
      case 'discard':
        return actions.openPile?.('discard', event);
      case 'ashes':
        return actions.openPile?.('ashes', event);
      case 'deck':
        return actions.openDeck?.(event);
      case 'menu':
        return actions.openMenu?.(event);
      case 'potion':
        return actions.potion?.(hit.slot, event);
      case 'omen':
      case 'relic':
        return null;
      default:
        return actions.chrome?.(kind, hit, event);
    }
  }

  function finishPointer(event, cancelled) {
    if (!enabled || destroyed) return;
    const st = gesture;
    if (!st || event.pointerId !== st.id) return;
    recordDispatch(event, { source: st.kind, kind: st.kind, cancelled: !!cancelled });

    if (st.kind === 'card') {
      clearLongPress();
      releaseCapture();
      gesture = null;
      if (!st.live) {
        const moved = Math.hypot(
          (event.clientX ?? st.x0) - st.x0,
          (event.clientY ?? st.y0) - st.y0,
        );
        // Click only when the press stayed inside the long-press cancel slop —
        // a dragged-but-unarmed press must not commit play (onclick used to own that).
        if (!cancelled && moved < LONG_PRESS_CANCEL_PX) {
          actions.clickCard?.(st.uid, event);
        }
        renderer?.setInteraction?.('idle');
        return;
      }
      if (cancelled) {
        st.traceSpan?.finish?.('cancelled', { reason: event.type === 'lostpointercapture' ? 'lostpointercapture' : 'pointercancel' });
        actions.cancelCardDrag?.(st, event.type === 'lostpointercapture' ? 'lostpointercapture' : 'pointercancel');
        renderer?.setInteraction?.('idle');
        return;
      }
      const outcome = actions.finishCardDrag?.(st, event);
      if (outcome?.cancelled) {
        st.traceSpan?.finish?.('cancelled', { reason: outcome.reason || 'cancelled' });
      } else {
        st.traceSpan?.finish?.('completed', { reason: outcome?.reason || 'card-play' });
      }
      renderer?.setInteraction?.('idle');
      return;
    }

    if (st.kind === 'chrome') {
      const hit = st.detail;
      clearLongPress();
      releaseCapture();
      gesture = null;
      renderer?.setInteraction?.('idle');
      if (!cancelled && !st.moved) activateChrome(hit, event);
      return;
    }

    if (st.kind === 'enemy') {
      const index = st.index;
      clearLongPress();
      releaseCapture();
      gesture = null;
      actions.enemyHover?.(index, false);
      renderer?.setInteraction?.('idle');
      if (!cancelled) actions.enemyClick?.(index, event);
    }
  }

  function onPointerUp(event) {
    finishPointer(event, false);
  }

  function onPointerCancel(event) {
    finishPointer(event, true);
  }

  function onLostCapture(event) {
    if (!gesture || event.pointerId !== gesture.id) return;
    finishPointer(event, true);
  }

  const listeners = [
    ['pointerdown', onPointerDown],
    ['pointermove', onPointerMove],
    ['pointerup', onPointerUp],
    ['pointercancel', onPointerCancel],
    ['lostpointercapture', onLostCapture],
  ];

  function bind() {
    const node = stageNode();
    if (!node) return;
    for (const [type, handler] of listeners) {
      node.addEventListener(type, handler, true);
    }
  }

  function unbind() {
    const node = stageNode();
    if (!node) return;
    for (const [type, handler] of listeners) {
      node.removeEventListener(type, handler, true);
    }
  }

  function enable() {
    if (destroyed) return false;
    if (enabled) return true;
    enabled = true;
    bind();
    renderer?.setInteraction?.('idle');
    trace?.emit?.('input.router', { outcome: 'accepted', attributes: { action: 'enable' } });
    return true;
  }

  function disable() {
    if (!enabled) return false;
    cancel('disable');
    unbind();
    enabled = false;
    trace?.emit?.('input.router', { outcome: 'completed', attributes: { action: 'disable' } });
    return true;
  }

  function cancel(reason = 'cancel') {
    const prior = cleanupGesture(reason, { emitCancel: true });
    return prior || null;
  }

  function state() {
    return Object.freeze({
      enabled,
      destroyed,
      dragging: !!(gesture && gesture.kind === 'card' && gesture.live),
      pressed: !!gesture,
      gesture: gesture ? Object.freeze({
        kind: gesture.kind,
        uid: gesture.uid ?? null,
        index: gesture.index ?? null,
        chrome: gesture.chrome ?? null,
        live: !!gesture.live,
        seatBounds: gesture.seatBounds ? Object.freeze({ ...gesture.seatBounds }) : null,
      }) : null,
      lastDispatch,
      thresholds: Object.freeze({
        dragStartPx: DRAG_START_PX,
        longPressCancelPx: LONG_PRESS_CANCEL_PX,
      }),
    });
  }

  function destroy() {
    if (destroyed) return false;
    disable();
    destroyed = true;
    lastDispatch = null;
    return true;
  }

  return Object.freeze({
    enable, disable, cancel, state, destroy,
  });
}
