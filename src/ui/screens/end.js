export function createEndScreen(deps) {
  const { contentViewFor, S, E, Vigil, TERMINAL_OUTCOMES, PROGRESSION, QUESTS, themeForRun, tr, runEffects, requireRunSave, persistObserved, showRunEndPersistenceFailure, show, presentationBarrier, trace, music, el, REDUCED, sleep, persistDawnOrRetry, assetUrl, iconSvg, relicArt, escHtml, $, $$, stageEl, sfx, screenEl, metaBg, sunrise, V, stageW, stageH, showCardGrid} = deps;
  const runCatalogues = () => contentViewFor(S.run);

function journalRunEnd(run, outcome, onFinalised = null) {
  runEffects.journalRunEnd(run, outcome);
  const continueRunEnd = () => {
    S.cb = null;
    finalisePendingRunEnd(run, onFinalised);
  };
  if (!requireRunSave(run, continueRunEnd, 'run-end')) return false;
  continueRunEnd();
  return true;
}
function finalisePendingRunEnd(run, onFinalised = null) {
  const outcome = run.pendingRunEnd?.outcome;
  if (!TERMINAL_OUTCOMES.includes(outcome)) return false;
  const result = runEffects.finaliseRunEnd(
    run,
    {
      revealThreshold: E.sealedSummitShardThreshold(run),
      persist: (action) => persistObserved('run-end', action),
      onPersistenceFailure: () => showRunEndPersistenceFailure(run, onFinalised),
      onFinalised: ({ newUnlocks, ledger }) => {
        S.cb = null;
        if (onFinalised) {
          onFinalised({ outcome, newUnlocks, ledger });
        } else if (outcome === 'win') {
          show('end', { won: true });
        } else if (outcome === 'death') {
          const node = run.map.nodes.find((candidate) => candidate.id === run.nodeId);
          const { unpaidBequest, offerNewBequest } = E.shadeLossBequestState(run);
          show('end', {
            won: false,
            newUnlocks,
            offers: offerNewBequest ? Vigil.bequestOptions(run) : [],
            fallAct: run.act,
            fallRow: node ? node.row : Math.max(1, run.floorsClimbed - 1),
            unpaidBequest,
            ledger,
          });
        } else {
          S.run = null;
          S.lamp = null;
          show('title');
        }
      },
    },
  );
  // Ephemeral Lab terminal: success-shaped Lab-result descriptor; no Dawn/Fall route.
  if (result && result.kind === 'lab-result') {
    S.cb = null;
    if (onFinalised) onFinalised(result);
    return result;
  }
  return result;
}
// ------------------------------------------------------------ end screens
function bequestLabel(o) {
  const bu = assetUrl('bequests', o.kind);
  const kindIcon = bu
    ? `<img class="bq-kind" src="${bu}" alt="">`
    : `<span class="bq-kind-fallback">${iconSvg(`bequest-${o.kind}`, 22)}</span>`;
  if (o.kind === 'relic') return { icon: `${kindIcon}${relicArt(o.id, 20)}`, name: runCatalogues().relics[o.id]?.name || o.id, note: tr('ui.end.bequestNote.relic') };
  if (o.kind === 'card') return { icon: `${kindIcon}<span class="bq-card">🂠</span>`, name: (runCatalogues().cards[o.id]?.name || o.id) + (o.up ? '+' : ''), note: tr('ui.end.bequestNote.card') };
  return { icon: `${kindIcon}${iconSvg('coin', 20)}`, name: tr('ui.end.bequestNote.gold', { n: o.amount }), note: tr('ui.end.bequestNote.goldCache') };
}
function unlockToastInfo(u) {
  if (u === 'aspect2') return { kind: tr('ui.end.unlock.aspect'), name: tr('ui.end.unlock.ashwarden') };
  const [k, id] = u.split(':');
  if (k === 'card') return { kind: tr('ui.end.unlock.card'), name: runCatalogues().cards[id]?.name || id };
  return { kind: tr('ui.end.unlock.relic'), name: runCatalogues().relics[id]?.name || id };
}
function showUnlockToasts(list = [], runId = S.run?.runId) {
  if (!list.length) return;
  const stillOnEnd = () => S.screen === 'end' && S.run?.runId === runId;
  if (!stillOnEnd()) return;
  let host = $('#toasts');
  if (!host) { host = el('div'); host.id = 'toasts'; stageEl().appendChild(host); }
  list.forEach((u, i) => {
    const info = unlockToastInfo(u);
    setTimeout(() => {
      if (!stillOnEnd()) return;
      const t = el('div', 'unlock-toast', `<div class="ut-kind">${tr('ui.end.unlock.header', { kind: info.kind })}</div><div class="ut-name">${info.name}</div>`);
      host.appendChild(t);
      globalThis.requestAnimationFrame(() => t.classList.add('in'));
      sfx.relic();
      setTimeout(() => { t.classList.remove('in'); setTimeout(() => t.remove(), 500); }, 3800);
    }, 700 + i * 800);
  });
}

function dawnEventHtml(event) {
  if (event.t === 'whisper') return `<div class="dawn-kicker">${tr('ui.dawn.whisperKicker')}</div>
    <div class="dawn-whisper"><i>${escHtml(event.text)}</i></div>`;
  if (event.t === 'questReveal') {
    const quest = QUESTS[event.id];
    return `<div class="dawn-kicker">${tr('ui.dawn.questRevealKicker', { mode: quest.mode })}</div>
      <div class="dawn-name">${escHtml(quest.name)}</div>
      <div class="dawn-copy">${escHtml(quest.inscription)}</div>`;
  }
  if (event.t === 'questProgress') return `<div class="dawn-kicker">${tr('ui.dawn.questProgressKicker')}</div>
    <div class="dawn-name">${escHtml(E.questProgressName(event.id, event.target))}</div>
    <div class="dawn-count">${event.progress}/${event.target}</div>`;
  if (event.t === 'questUnlock') return `<div class="dawn-kicker">${tr('ui.dawn.questUnlockKicker')}</div>
    <div class="dawn-name">${tr('ui.dawn.witchlightLens')}</div>
    <div class="dawn-copy">${tr('ui.dawn.witchlightCopy')}</div>`;
  if (event.t === 'pageRead') return `<div class="dawn-kicker">${tr('ui.dawn.pageKicker', { n: event.index })}</div>
    <div class="dawn-copy">${escHtml(event.text)}</div>`;
  if (event.t === 'eighthResolved') return `<div class="dawn-kicker broken-omen">${tr('ui.dawn.eighthResolvedKicker')}</div>
    <div class="dawn-copy">${escHtml(event.text)}</div>`;
  if (event.t === 'shadeResolved') return `<div class="dawn-kicker">${tr('ui.dawn.shadeResolvedKicker')}</div>
    <div class="dawn-copy">${escHtml(event.text)}</div>`;
  if (event.t === 'questComplete') return `<div class="dawn-kicker">${tr('ui.dawn.questCompleteKicker', { mode: QUESTS[event.id].mode })}</div>
    <div class="dawn-name">${escHtml(QUESTS[event.id].name)}</div>`;
  if (event.t === 'shardGrant') return `<div class="dawn-icon">${iconSvg('emberglassShard', 42)}</div>
    <div class="dawn-name">${escHtml(QUESTS[event.id].name)}</div>
    <div class="dawn-copy">${tr('ui.dawn.shardGrantCopy')}</div>`;
  if (event.t === 'act4Reveal') return `<div class="dawn-icon">${iconSvg('sealedDoor', 48)}</div>
    <div class="dawn-copy">${tr('ui.dawn.act4RevealCopy')}</div>`;
  return '';
}

async function drainEndQueue(run, host) {
  const barrierToken = presentationBarrier.begin('dawn');
  const dawnSpan = trace.begin('presentation.dawn');
  let dawnOutcome = 'settled';
  try {
  const pending = run.pendingDawn;
  if (!pending) throw new Error('winning end screen requires a staged dawn presentation');
  const events = pending.events.map((event) => ({ ...event }));
  const newUnlocks = [...pending.newUnlocks];
  for (let i = pending.cursor; i < events.length; i++) {
    const event = events[i];
    const html = dawnEventHtml(event);
    if (!html) throw new Error(`unrenderable dawn event: ${event.t}`);
    const dawnCue = music.dawnEventCue(event);
    if (dawnCue) music.play(dawnCue);
    const panel = el('div', 'dawn-event', html);
    panel.dataset.event = event.t;
    host.appendChild(panel);
    if (REDUCED) {
      panel.classList.add('shown');
      await sleep(40);
    } else {
      globalThis.requestAnimationFrame(() => panel.classList.add('shown'));
      await sleep(550);
    }
    await persistDawnOrRetry(() => runEffects.advanceDawn(run, i + 1), 'cursor');
  }
  await persistDawnOrRetry(() => runEffects.completeDawn(run), 'clear');
  host.classList.add('complete');
  return newUnlocks;
  } catch (error) {
    dawnOutcome = 'failed';
    throw error;
  } finally {
    dawnSpan.finish(dawnOutcome, dawnOutcome === 'failed' ? { reason: 'presentation-error' } : {});
    if (dawnOutcome === 'failed') barrierToken.cancel();
    else barrierToken.finish();
  }
}

function renderEnd({ won, newUnlocks = [], offers = [], fallAct = 0, fallRow = 1, unpaidBequest = false }) {
  const run = S.run;
  music.playForRunEnd(!!won);
  const st = run.stats;
  const mins = Math.max(1, Math.round((Date.now() - st.start) / 60000));
  const totalFloor = run.act * E.MAP_ROWS + run.floorsClimbed;
  const stats = `<div class="stats-grid">
      <div class="stat-cell"><div class="v">${totalFloor}</div><div class="k">${tr('ui.end.floors')}</div></div>
      <div class="stat-cell"><div class="v">${st.slain}</div><div class="k">${tr('ui.end.slain')}</div></div>
      <div class="stat-cell"><div class="v">${st.elites + st.bosses}</div><div class="k">${tr('ui.end.elitesBosses')}</div></div>
      <div class="stat-cell"><div class="v">${run.player.deck.length}</div><div class="k">${tr('ui.end.deckSize')}</div></div>
      <div class="stat-cell"><div class="v">${st.dmgDealt}</div><div class="k">${tr('ui.end.dmgDealt')}</div></div>
      <div class="stat-cell"><div class="v">${st.dmgTaken}</div><div class="k">${tr('ui.end.dmgTaken')}</div></div>
      <div class="stat-cell"><div class="v">${st.cardsPlayed}</div><div class="k">${tr('ui.end.cardsPlayed')}</div></div>
      <div class="stat-cell"><div class="v">${mins}m</div><div class="k">${tr('ui.end.runTime')}</div></div>
    </div>`;
  const btns = `<div class="end-btns">
      <button class="btn" data-a="deck"${won ? ' disabled' : ''}>${tr('ui.end.viewDeck')}</button>
      <button class="btn" data-a="title"${won ? ' disabled' : ''}>${tr('ui.end.returnVigil')}</button>
    </div>`;
  let ceremony = Promise.resolve();
  if (won) {
    screenEl().innerHTML = `<div class="end-screen screen-enter">
      ${metaBg('ascended')}
      <div class="end-title win">${tr('ui.end.ascended')}</div>
      <div class="ov-sub" style="font-size:17px">${tr('ui.end.ascendedSub')}</div>
      <div class="dawn-ceremony" aria-live="polite"></div>
      ${stats}${btns}
    </div>`;
    const host = $('.dawn-ceremony', screenEl());
    ceremony = drainEndQueue(run, host);
    sunrise(); // the only warm daylight in the game
    sfx.victory();
    V.flash('#ffe9ac', 0.25, 1);
    const conf = setInterval(() => V.burst(Math.random() * stageW(), stageH() * 0.2, { color: ['#ffd97a', '#c9b0ff', '#8fe8a0'][(Math.random() * 3) | 0], n: 16, speed: 300, grav: 260, life: 1.2 }), 400);
    setTimeout(() => clearInterval(conf), 4200);
  } else {
    // the fallen may carve one thing into the stone for the next climber to find
    const bequestHtml = unpaidBequest
      ? `<div class="bequest"><div class="bequest-done">${tr('ui.end.bequestUnpaid')}</div></div>`
      : offers.length ? `<div class="bequest" id="bequest">
        <div class="bequest-title">${tr('ui.end.bequestTitle', { act: `<b>${themeForRun({ act: fallAct })?.name || ''}</b>` })}</div>
        <div class="bequest-opts">${offers.map((o, i) => {
      const L = bequestLabel(o);
      return `<button class="bequest-opt" data-a="bequest" data-i="${i}"><span class="bq-icon">${L.icon}</span><span class="bq-name">${L.name}</span><span class="bq-note">${L.note}</span></button>`;
    }).join('')}</div>
      </div>` : '';
    const embers = Array.from({ length: 14 }, () =>
      `<span class="ember" style="left:${(8 + Math.random() * 84).toFixed(1)}%;--ex:${((Math.random() - 0.5) * 90).toFixed(0)}px;animation-delay:${(Math.random() * 4).toFixed(2)}s;animation-duration:${(3 + Math.random() * 3).toFixed(2)}s"></span>`).join('');
    screenEl().innerHTML = `<div class="end-screen grave">
      ${metaBg('fallen')}
      <div class="monument">
        <div class="mon-flame"></div>
        <div class="end-title lose">${tr('ui.end.fallen')}</div>
        <div class="ov-sub" style="font-size:16px">${tr('ui.end.fallenSub', { floor: totalFloor })}</div>
        ${stats}${bequestHtml}${btns}
      </div>
      <div class="embers">${embers}</div>
    </div>`;
  }
  screenEl().onclick = (e) => {
    const t = e.target.closest('[data-a]');
    if (!t || t.disabled) return;
    const a = t.dataset.a;
    if (a === 'bequest') {
      sfx.relic();
      const o = offers[+t.dataset.i];
      runEffects.setBequest(S.run, fallAct, fallRow, o);
      const L = bequestLabel(o);
      $('#bequest').innerHTML = `<div class="bequest-done">${tr('ui.end.bequestDone', { name: `<b>${L.name}</b>`, act: themeForRun({ act: fallAct })?.name || '' })}</div>`;
      return;
    }
    sfx.click();
    if (a === 'deck') showCardGrid(tr('ui.end.finalDeckTitle'), run.player.deck, {});
    if (a === 'title') { S.run = null; S.lamp = null; show('title'); }
  };
  ceremony.then((owedUnlocks = newUnlocks) => {
    if (S.screen !== 'end' || S.run?.runId !== run.runId) return;
    $$('.end-btns button', screenEl()).forEach((button) => { button.disabled = false; });
    showUnlockToasts(owedUnlocks, run.runId);
  });
}

  return Object.freeze({ journalRunEnd, finalisePendingRunEnd, renderEnd });
}
