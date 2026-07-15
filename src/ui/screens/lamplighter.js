import {
  R5_SCREEN_END_STATES,
  DURATION_MS,
  compositionProfile,
  compositionGrownFrom,
  screenPresentationAttrs,
} from '../tokens.js';
import { runNamedCeremony } from '../tween.js';

export function createLamplighterScreen(deps) {
  const {
    contentViewFor, S, E, QUESTS, REDUCED, COARSE, tr, runEffects, assetUrl, iconSvg, fmtText,
    sceneBg, heroArt, escHtml, $, $$, screenEl, unlock, sfx, setTheme, themeForRun, renderHud,
    show, omenBanner, routeVisitedNode, persistObserved, requireRunSave, presentationBarrier, trace,
  } = deps;
  const runCatalogues = () => contentViewFor(S.run);

  function presentationPolicy() {
    return {
      motion: REDUCED ? 'reduced' : 'full',
      lite: !!COARSE,
      reduced: !!REDUCED,
    };
  }

  function rootAttrs(profile, endState) {
    const attrs = screenPresentationAttrs(presentationPolicy());
    return `data-r5-profile="${profile}" data-r5-state="${endState}" data-tier="${attrs.tier}" data-motion="${attrs.motion}"`;
  }

  function playCeremony(name, endState, root) {
    return runNamedCeremony({
      name,
      endState,
      barrier: presentationBarrier,
      trace,
      from: 0,
      to: 1,
      duration: DURATION_MS.ceremony,
      easing: 'outSoft',
      policy: presentationPolicy(),
      onUpdate() {},
    }).done.then(() => {
      if (root?.isConnected) root.dataset.r5State = endState;
    }).catch(() => {
      if (root?.isConnected) root.dataset.r5State = endState;
    });
  }

function renderLamplighter() {
  const run = S.run;
  setTheme(themeForRun({ act: 0 }));
  if (!S.lamp) {
    const rng = E.runRng(run);
    const pool = Object.keys(runCatalogues().boons).filter((id) => E.runRevealed(run, 'phials') || !runCatalogues().boons[id].ops.some((op) => op.potion));
    const boons = [];
    while (boons.length < 3 && pool.length) boons.push(pool.splice(Math.floor(rng() * pool.length), 1)[0]);
    S.lamp = { boons, boon: null, art: run.art };
    runEffects.saveRun(run); // the draw is now fixed for this run
  }
  const L = S.lamp;
  const asp = runCatalogues().aspects[run.aspect];
  const vigil = runEffects.syncVigil();
  const profile = compositionProfile(compositionGrownFrom(vigil, run));
  const endState = R5_SCREEN_END_STATES.lamplighterReady;
  const boonCards = L.boons.map((id) => {
    const b = runCatalogues().boons[id];
    const bu = assetUrl('boons', id);
    return `<button class="lamp-boon${L.boon === id ? ' on' : ''}" data-a="boon" data-i="${id}">
      ${bu ? `<img class="lb-art-img" src="${bu}" alt="">` : ''}
      <div class="lb-name">${iconSvg(`boon-${id}`, 20)} ${b.name}</div><div class="lb-text">${fmtText(b.text)}</div>
    </button>`;
  }).join('');
  const artChips = Object.keys(runCatalogues().arts).map((id) => {
    const a = runCatalogues().arts[id];
    const au = assetUrl('arts', id);
    return `<button class="lamp-art${L.art === id ? ' on' : ''}" data-a="art" data-i="${id}">
      ${au ? `<img class="la-art-img" src="${au}" alt="">` : `<span class="la-glyph" style="color:${a.tone}">${iconSvg(`art-${id}`, 18)}</span>`}<span class="la-name">${a.name}</span>
    </button>`;
  }).join('');
  const chosen = runCatalogues().arts[L.art];
  const sc = screenEl();
  sc.innerHTML = `<div class="lamp-screen screen-enter r5-scene-panel r5-lamplighter" ${rootAttrs(profile, 'rest')}>
    ${sceneBg()}
    <div class="lamp-hero">${heroArt(run.aspect)}</div>
    <div class="lamp-title r5-scene-header">${tr('ui.lamp.title')}</div>
    <div class="lamp-sub">${tr('ui.lamp.sub', { aspect: asp.name })}</div>
    <div class="lamp-label">${tr('ui.lamp.boonLabel')}</div>
    <div class="lamp-boons">${boonCards}</div>
    <div class="lamp-label">${tr('ui.lamp.artLabel')} <span class="lamp-hint">${tr('ui.lamp.artHint')}</span></div>
    <div class="lamp-arts">${artChips}</div>
    <div class="lamp-art-desc">${chosen ? `<b style="color:${chosen.tone}">${iconSvg(`art-${L.art}`, 15)} ${chosen.name}</b> · ${fmtText(chosen.text)}` : ''}</div>
    <div class="lamp-actions"><button class="btn btn-primary" data-a="begin"${L.boon ? '' : ' disabled'}>${L.boon ? tr('ui.menu.lightTheWay') : tr('ui.menu.chooseBoon')}</button></div>
  </div>`;
  void playCeremony('lamplighter', endState, $('.r5-lamplighter', sc));
  sc.onclick = (e) => {
    const t = e.target.closest('[data-a]');
    if (!t || t.disabled) return;
    const a = t.dataset.a;
    unlock(); sfx.click();
    if (a === 'boon') { L.boon = t.dataset.i; renderLamplighter(); }
    else if (a === 'art') { L.art = t.dataset.i; sfx.hover(); renderLamplighter(); }
    else if (a === 'begin' && L.boon) beginFromLamplighter();
  };
}
function beginFromLamplighter() {
  const run = S.run, L = S.lamp;
  run.art = L.art;
  E.applyBoon(run, L.boon);
  delete run.pendingLamplighter;
  const finish = () => {
    S.lamp = null;
    sfx.relic();
    show('map');
    setTimeout(() => omenBanner(run), 900);
  };
  if (!requireRunSave(run, finish)) return;
  finish();
}

function restoreDurableHollow(message) {
  S.run = E.loadRun();
  if (!S.run?.pendingHollow) { show('title'); return; }
  show('hollow', { nodeId: S.run.pendingHollow.nodeId });
  const error = $('.hollow-error', screenEl());
  if (error) error.textContent = message;
}

function exitHollow(run) {
  const route = runEffects.stageHollowExit(run);
  if (!route) {
    const error = $('.hollow-error', screenEl());
    if (error) error.textContent = tr('ui.hollow.routeFailed');
    $$('[data-a^="hollow-"]', screenEl()).forEach((button) => {
      if (button.dataset.a === 'hollow-continue') button.disabled = !run.pendingHollow?.paid;
      else if (button.dataset.a === 'hollow-leave') button.disabled = !!run.pendingHollow?.paid;
    });
    const root = $('.r5-lamplighter', screenEl());
    if (root) root.dataset.r5State = 'hollow-route-recovery';
    return;
  }
  if (!runEffects.saveRun(run)) {
    restoreDurableHollow(tr('ui.hollow.routeSaveFailed'));
    return;
  }
  const node = run.map.nodes.find((candidate) => candidate.id === route.nodeId);
  if (!node) { show('map'); return; }
  routeVisitedNode(node, route.type, {
    enemyIds: route.kind === 'combat' ? route.enemyIds : null,
    eventId: route.kind === 'destination' ? route.eventId : null,
  });
}

// THE HOLLOW LAMPLIGHTER — a persisted interruption on the Unlit Way. The
// visited node is routed only after the price and Continue checkpoints hold.
function renderHollow() {
  const run = S.run;
  const pending = run?.pendingHollow;
  if (!pending) { show('map'); return; }
  const q = E.questRecord(run, 'hollowLamplighter');
  const paidAdvance = pending.paid && !pending.deferred ? 1 : 0;
  const meetingIndex = Math.max(0, Math.min(QUESTS.hollowLamplighter.meetings.length - 1,
    (q?.progress || 0) - paidAdvance));
  const meeting = QUESTS.hollowLamplighter.meetings[meetingIndex];
  const vigil = runEffects.syncVigil();
  const profile = compositionProfile(compositionGrownFrom(vigil, run));
  const hollowState = pending.paid ? 'hollow-paid' : 'hollow-unpaid';
  const sc = screenEl();
  sc.innerHTML = `<div class="hollow-lamplighter r5-scene-panel r5-lamplighter r5-lamplighter--hollow${REDUCED ? ' reduced' : ''}" ${rootAttrs(profile, hollowState)}>
    <div class="hollow-vignette"></div>
    <div class="hollow-figure" aria-hidden="true">
      <svg viewBox="0 0 180 300" role="presentation">
        <path class="hollow-cloak" d="M91 35c-24 3-38 28-35 59-14 22-24 58-27 101l-12 72c19 13 47 20 77 20 31 0 58-7 76-21l-14-72c-4-42-13-77-29-101 2-31-12-56-36-58Z"/>
        <path class="hollow-face" d="M69 67c7-17 37-18 45 0l-6 39c-9 8-24 8-33 0Z"/>
        <path class="hollow-staff" d="M139 56l5 217M127 68l19-30 17 31"/>
        <path class="hollow-lantern" d="M118 143h48l-5 63h-38Zm5 13h38m-31-13 5-15h14l6 15"/>
        <path class="hollow-void" d="M78 76c6-7 21-7 28 0l-4 21c-7 5-15 5-21 0Z"/>
      </svg>
    </div>
    <div class="hollow-copy screen-enter">
      <div class="hollow-kicker r5-scene-header">${tr('ui.hollow.kicker', { current: meetingIndex + 1, total: QUESTS.hollowLamplighter.target })}</div>
      <div class="hollow-title">${tr('ui.hollow.title')}</div>
      <div class="hollow-ask">“${escHtml(meeting.ask)}”</div>
      <div class="hollow-answer${pending.paid ? ' paid' : ''}" aria-live="polite">${pending.paid ? escHtml(pending.answer) : ''}</div>
      <div class="hollow-error" aria-live="assertive"></div>
      <div class="hollow-actions">
        <button class="btn btn-primary" data-a="hollow-pay"${pending.paid ? ' disabled' : ''}>${pending.paid ? tr('ui.hollow.pricePaid') : tr('ui.hollow.payPrice')}</button>
        <button class="btn ghost" data-a="hollow-continue"${pending.paid ? '' : ' disabled'}>${tr('ui.common.continue')}</button>
        <button class="btn ghost" data-a="hollow-leave"${pending.paid ? ' disabled' : ''}>${tr('ui.hollow.returnLater')}</button>
      </div>
    </div>
  </div>`;
  const root = $('.r5-lamplighter', sc);
  void playCeremony('hollow', R5_SCREEN_END_STATES.hollowReady, root);
  sc.onclick = (e) => {
    const target = e.target.closest('[data-a]');
    if (!target || target.disabled) return;
    const action = target.dataset.a;
    if (action === 'hollow-pay') {
      target.disabled = true;
      unlock(); sfx.click();
      if (root) root.dataset.r5State = 'hollow-pay-pressed';
      const result = runEffects.payHollowPrice(run);
      const answer = $('.hollow-answer', sc);
      const error = $('.hollow-error', sc);
      const continueButton = $('[data-a="hollow-continue"]', sc);
      const leaveButton = $('[data-a="hollow-leave"]', sc);
      if (!result.ok) {
        answer.textContent = result.message;
        answer.classList.add('error');
        error.textContent = '';
        target.disabled = false;
        return;
      }
      if (!persistObserved('hollow-payment', () => runEffects.saveRun(run))) {
        answer.textContent = '';
        answer.classList.remove('paid', 'error');
        error.textContent = tr('ui.hollow.saveFailed');
        target.textContent = tr('ui.persistence.retrySave');
        target.disabled = false;
        continueButton.disabled = true;
        leaveButton.disabled = true;
        if (root) root.dataset.r5State = 'hollow-save-retry';
        return;
      }
      answer.textContent = result.message;
      answer.classList.remove('error');
      answer.classList.add('paid');
      error.textContent = '';
      target.textContent = tr('ui.hollow.pricePaid');
      continueButton.disabled = false;
      leaveButton.disabled = true;
      if (root) root.dataset.r5State = 'hollow-paid';
      renderHud();
      return;
    }
    if (action === 'hollow-continue' && !run.pendingHollow?.paid) return;
    if (action === 'hollow-leave' && run.pendingHollow?.paid) return;
    if (!['hollow-continue', 'hollow-leave'].includes(action)) return;
    $$('[data-a^="hollow-"]', sc).forEach((button) => { button.disabled = true; });
    unlock(); sfx.click();
    if (root) {
      root.dataset.r5State = action === 'hollow-continue'
        ? 'hollow-continue-closed'
        : 'hollow-return-closed';
    }
    exitHollow(run);
  };
}

  return Object.freeze({ renderLamplighter, renderHollow });
}
