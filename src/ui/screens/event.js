export function createEventScreen(deps) {
  const { contentViewFor, S, E, tr, sceneBg, rasterOr, eventArtSvg, $, el, sfx, leaveHollowDestination, show, runEffects, renderHud, showCardGrid, screenEl } = deps;
  const runCatalogues = () => contentViewFor(S.run);

function renderEvent(eventId) {
  const run = S.run;
  const ev = runCatalogues().events[eventId];
  const sc = screenEl();
  sc.innerHTML = `<div class="center-panel screen-enter">${sceneBg()}<div class="panel event-panel">
    <div class="ov-title">${ev.name.toUpperCase()}</div>
    <div class="event-art">${rasterOr('events', eventId, eventArtSvg(ev.glyph, ev.hue))}</div>
    <div class="event-text">${ev.text}</div>
    <div class="event-log"></div>
    <div class="event-choices"></div>
  </div></div>`;
  const choices = $('.event-choices', sc);
  const leaveEvent = () => leaveHollowDestination(run, () => show('map'));
  const showEventContinue = () => {
    choices.innerHTML = '';
    const done = el('button', 'btn btn-primary', tr('ui.common.continue'));
    done.onclick = () => { sfx.click(); leaveEvent(); };
    choices.appendChild(done);
  };
  if (E.nodeRewardClaimed(run)) {
    showEventContinue();
    return;
  }
  if (E.nodeEventInFlight(run)) {
    E.finalizeNodeEventChoice(run);
    runEffects.saveRun(run);
    showEventContinue();
    return;
  }
  const offered = ev.choices.filter((ch) => E.runRevealed(run, 'phials') || !ch.ops.some((op) => op.potion));
  for (const [i, ch] of offered.entries()) {
    const b = el('button', `event-choice${i === 0 ? ' btn-primary' : ''}`, `<b>${ch.label}</b>${ch.sub ? `<div class="sub">${ch.sub}</div>` : ''}`);
    if (ch.needGold && run.player.gold < ch.needGold) b.disabled = true;
    b.onclick = () => resolveChoice(ch);
    choices.appendChild(b);
  }
  let resolving = false;
  async function resolveChoice(ch) {
    if (resolving) return;
    resolving = true;
    choices.querySelectorAll('button').forEach((b) => { b.disabled = true; });
    try {
      sfx.click();
      const { pending, log, already } = E.applyNodeEventChoice(run, ch.ops);
      if (already) { showEventContinue(); return; }
      runEffects.saveRun(run); // persist rewardResolving before interactive pending
      renderHud();
      const logEl = $('.event-log', sc);
      const bits = [];
      for (const L of log) {
        if (L.text) bits.push(L.text);
        if (L.relic) bits.push(`Gained <b style="color:${runCatalogues().relics[L.relic].tone}">${runCatalogues().relics[L.relic].name}</b> — <i>${runCatalogues().relics[L.relic].text}</i>`);
      }
      if (bits.length) logEl.innerHTML = bits.join('<br>');
      choices.innerHTML = '';
      for (const p of pending) await handlePending(p);
      E.finalizeNodeEventChoice(run);
      runEffects.saveRun(run);
      renderHud();
      showEventContinue();
      if (!bits.length && !pending.length && !ch.ops.length) leaveEvent();
    } catch (err) {
      if (E.nodeEventInFlight(run) || E.nodeRewardClaimed(run)) {
        if (E.nodeEventInFlight(run)) E.finalizeNodeEventChoice(run);
        runEffects.saveRun(run);
        showEventContinue();
        return;
      }
      resolving = false;
      choices.querySelectorAll('button').forEach((b) => { b.disabled = false; });
      throw err;
    }
  }
  function handlePending(p) {
    return new Promise((resolve) => {
      if (p === 'remove') {
        const removable = E.removableCards(run);
        if (!removable.length) return resolve();
        showCardGrid(tr('ui.event.removeTitle'), removable, { sub: tr('ui.event.removeSub'), pick: (inst) => { if (inst && E.removeCardFromDeck(run, inst.uid)) sfx.card(); resolve(); }, canSkip: false });
      } else if (p === 'upgrade') {
        const ups = run.player.deck.filter((c) => !c.up && runCatalogues().cards[c.id].up);
        if (!ups.length) return resolve();
        showCardGrid(tr('ui.event.upgradeTitle'), ups, { sub: tr('ui.event.upgradeSub'), pick: (inst) => { if (inst) { E.upgradeCardInDeck(run, inst.uid); sfx.upgrade(); } resolve(); } });
      } else if (p === 'duplicate') {
        showCardGrid(tr('ui.event.duplicateTitle'), run.player.deck, { sub: tr('ui.event.duplicateSub'), pick: (inst) => { if (inst) { E.duplicateCardInDeck(run, inst.uid); sfx.upgrade(); } resolve(); } });
      } else if (p.pickCard) {
        showCardGrid(tr('ui.event.chooseCardTitle'), E.rollEventCards(run, p.pickCard).map((id) => ({ id, up: false, uid: null })), {
          sub: tr('ui.event.chooseCardSub'),
          pick: (inst) => { if (inst) { E.addCardToDeck(run, inst.id); sfx.upgrade(); } resolve(); }, canSkip: true,
        });
      } else resolve();
    });
  }
}

  return Object.freeze({ renderEvent });
}
