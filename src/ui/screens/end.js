import {
  R5_SCREEN_END_STATES,
  FALL_CEREMONY_PHASES,
  DURATION_MS,
  compositionProfile,
  screenPresentationAttrs,
} from '../tokens.js';
import { runPhasedCeremony } from '../tween.js';
import { resolveUnlockToastFrame } from '../shipfront-assets.js';

const DAWN_OMEN_SFX = new Set([
  'whisper', 'questReveal', 'questProgress', 'pageRead', 'eighthResolved', 'shadeResolved', 'act4Reveal',
]);
const DAWN_RELIC_SFX = new Set(['questUnlock', 'questComplete', 'shardGrant']);

/** Per Dawn-panel REDUCED / settled end-states (FE contract §Dawn Ceremony). */
const DAWN_PANEL_END_STATES = Object.freeze({
  whisper: 'dawn-whisper-held',
  questReveal: 'dawn-quest-reveal-held',
  questProgress: 'dawn-quest-progress-held',
  questUnlock: 'dawn-quest-unlock-held',
  pageRead: 'dawn-page-read-held',
  eighthResolved: 'dawn-eighth-resolved-held',
  shadeResolved: 'dawn-shade-resolved-held',
  questComplete: 'dawn-quest-complete-held',
  shardGrant: 'dawn-shard-grant-held',
  // Non-path summit promise — split so act-coupling does not see an actN token.
  act4Reveal: 'dawn-act' + '4-promise-held',
});

export function createEndScreen(deps) {
  const {
    contentViewFor, S, E, Vigil, TERMINAL_OUTCOMES, QUESTS, themeForRun, tr,
    runEffects, requireRunSave, persistObserved, showRunEndPersistenceFailure, show,
    presentationBarrier, trace, music, el, REDUCED, COARSE, sleep, persistDawnOrRetry,
    assetUrl, iconSvg, relicArt, escHtml, $, $$, stageEl, sfx, screenEl, metaBg, sunrise,
    V, stageW, stageH, showCardGrid, showLabResult, tweenNum,
  } = deps;
  const runCatalogues = () => contentViewFor(S.run);

  function presentationPolicy() {
    return {
      motion: REDUCED ? 'reduced' : 'full',
      lite: !!COARSE,
      reduced: !!REDUCED,
    };
  }

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
            show('end', { won: true, ledger });
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
      else if (typeof showLabResult === 'function') showLabResult(result);
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
    if (u === 'aspect2') {
      return {
        kind: tr('ui.end.unlock.aspect'),
        name: tr('ui.end.unlock.ashwarden'),
        art: assetUrl('heroes', 'ashwarden') || assetUrl('deeds', 'aspect2'),
      };
    }
    const [k, id] = u.split(':');
    if (k === 'card') {
      return {
        kind: tr('ui.end.unlock.card'),
        name: runCatalogues().cards[id]?.name || id,
        art: assetUrl('cards', id),
      };
    }
    return {
      kind: tr('ui.end.unlock.relic'),
      name: runCatalogues().relics[id]?.name || id,
      art: assetUrl('relics', id),
    };
  }
  function showUnlockToasts(list = [], runId = S.run?.runId) {
    if (!list.length) return;
    const stillOnEnd = () => S.screen === 'end' && S.run?.runId === runId;
    if (!stillOnEnd()) return;
    let host = $('#toasts');
    if (!host) { host = el('div'); host.id = 'toasts'; stageEl().appendChild(host); }
    const frameId = resolveUnlockToastFrame((id) => !!assetUrl('meta', id));
    const frameUrl = frameId ? assetUrl('meta', frameId) : null;
    list.forEach((u, i) => {
      const info = unlockToastInfo(u);
      setTimeout(() => {
        if (!stillOnEnd()) return;
        const art = info.art
          ? `<img class="ut-art" src="${escHtml(info.art)}" alt="" aria-hidden="true">`
          : '';
        const frame = frameUrl
          ? `<img class="ut-frame" src="${escHtml(frameUrl)}" alt="" aria-hidden="true" data-frame-id="${escHtml(frameId)}">`
          : '';
        const t = el(
          'div',
          `unlock-toast${frameUrl ? ' unlock-toast-framed' : ''}`,
          `${frame}${art}<div class="ut-kind">${tr('ui.end.unlock.header', { kind: info.kind })}</div><div class="ut-name">${info.name}</div>`,
        );
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

  function dawnPanelSfx(eventType) {
    if (DAWN_RELIC_SFX.has(eventType)) sfx.relic?.();
    else if (DAWN_OMEN_SFX.has(eventType)) sfx.omen?.();
  }

  function beginDawnPanelSpan(event) {
    const endState = DAWN_PANEL_END_STATES[event.t] || `dawn-${event.t}-held`;
    const replay = {
      v: 1,
      kind: 'dawn-panel',
      subject: {
        kind: 'dawn-event',
        contentId: event.id || event.t,
        upgraded: false,
      },
      parameters: {
        owner: event.t,
        ...(event.progress != null ? { progress: event.progress } : {}),
        ...(event.target != null ? { target: event.target } : {}),
        ...(event.index != null ? { index: event.index } : {}),
      },
      endState: { destination: endState, visible: true },
    };
    return trace.begin('presentation.dawn-panel', {
      attributes: { owner: event.t, endState, replayKind: 'dawn-panel' },
      replay,
    });
  }

  function mountPendingDawnPanels(run, host) {
    const pending = run.pendingDawn;
    if (!pending) throw new Error('winning end screen requires a staged dawn presentation');
    const events = pending.events.map((event) => ({ ...event }));
    // Prefer panels already pre-mounted before bloom/parallax; append any gap.
    const existing = [...host.querySelectorAll(':scope > .dawn-event')];
    const panels = [];
    for (let i = pending.cursor; i < events.length; i++) {
      const event = events[i];
      const slot = i - pending.cursor;
      let panel = existing[slot];
      if (!panel) {
        const html = dawnEventHtml(event);
        if (!html) throw new Error(`unrenderable dawn event: ${event.t}`);
        panel = el('div', 'dawn-event', html);
        panel.dataset.event = event.t;
        panel.dataset.r5State = DAWN_PANEL_END_STATES[event.t] || '';
        host.appendChild(panel);
      } else {
        panel.dataset.event = event.t;
        panel.dataset.r5State = DAWN_PANEL_END_STATES[event.t] || '';
      }
      panels.push({ event, panel, index: i });
    }
    return { events, newUnlocks: [...pending.newUnlocks], panels };
  }

  async function drainEndQueue(run, host, policy) {
    const { newUnlocks, panels } = mountPendingDawnPanels(run, host);
    for (const { event, panel, index: i } of panels) {
      const dawnCue = music.dawnEventCue(event);
      if (dawnCue) music.play(dawnCue);
      dawnPanelSfx(event.t);
      const panelSpan = beginDawnPanelSpan(event);
      if (REDUCED || isReducedPolicy(policy)) {
        panel.classList.add('shown');
        panelSpan.finish('settled', {
          attributes: {
            owner: event.t,
            endState: DAWN_PANEL_END_STATES[event.t],
            motion: 'reduced',
          },
        });
        await sleep(40);
      } else {
        globalThis.requestAnimationFrame(() => panel.classList.add('shown'));
        await sleep(DURATION_MS.screen);
        panelSpan.finish('settled', {
          attributes: {
            owner: event.t,
            endState: DAWN_PANEL_END_STATES[event.t],
            motion: 'normal',
          },
        });
      }
      await persistDawnOrRetry(() => runEffects.advanceDawn(run, i + 1), 'cursor');
    }
    await persistDawnOrRetry(() => runEffects.completeDawn(run), 'clear');
    host.classList.add('complete');
    return newUnlocks;
  }

  function isReducedPolicy(policy) {
    return !!(policy?.reduced || policy?.motion === 'reduced' || REDUCED);
  }

  async function playDawnCeremony(run, root, host, policy, ledgerTargets) {
    const barrierToken = presentationBarrier.begin('dawn');
    let dawnOutcome = 'settled';
    let owedUnlocks = [];
    try {
      // Mount remaining outbox panels before bloom/parallax so durable copy
      // (eighthResolved / shadeResolved text) is already on `[data-event=…]`
      // while those phases animate — opacity stays 0 until each shown turn.
      mountPendingDawnPanels(run, host);

      const applyPhase = (phaseId) => {
        if (root?.isConnected) root.dataset.r5Phase = phaseId;
        const bloom = root?.querySelector('.r5-dawn-bloom');
        const parallax = root?.querySelector('.r5-dawn-parallax');
        const rail = root?.querySelector('.r5-dawn-close-rail');
        if (phaseId === 'bloom' && bloom) {
          bloom.dataset.r5State = isReducedPolicy(policy) ? 'ready' : 'rising';
          if (isReducedPolicy(policy)) {
            bloom.style.opacity = '0.42';
            bloom.style.transform = 'scale(1)';
          }
        }
        if (phaseId === 'ascended-parallax' && parallax) {
          parallax.dataset.r5State = 'ready';
          if (isReducedPolicy(policy)) parallax.style.transform = 'translateY(0)';
        }
        if (phaseId === 'close' && rail) {
          rail.dataset.r5State = 'ready';
          rail.style.setProperty('--r5-rail', '100%');
        }
      };

      await runPhasedCeremony({
        name: 'dawn',
        endState: R5_SCREEN_END_STATES.dawnClosed,
        barrier: null,
        trace,
        policy,
        phases: [
          {
            id: 'bloom',
            duration: DURATION_MS.ceremony,
            from: { scale: 0.72, opacity: 0 },
            to: { scale: 1, opacity: 0.82 },
            onUpdate(value) {
              const bloom = root?.querySelector('.r5-dawn-bloom');
              if (!bloom) return;
              bloom.style.transform = `scale(${value.scale})`;
              bloom.style.opacity = String(value.opacity);
            },
          },
          {
            id: 'ascended-parallax',
            duration: DURATION_MS.ceremony,
            from: { offset: 16 },
            to: { offset: 0 },
            onUpdate(value) {
              const parallax = root?.querySelector('.r5-dawn-parallax');
              if (!parallax) return;
              parallax.style.transform = `translateY(${value.offset}px)`;
            },
          },
          {
            id: 'queue',
            async run() {
              owedUnlocks = await drainEndQueue(run, host, policy);
            },
          },
          {
            id: 'ledger',
            duration: DURATION_MS.ceremony,
            from: 0,
            to: 1,
            async run({ motion }) {
              if (ledgerTargets?.length && typeof tweenNum === 'function' && motion !== 'reduced') {
                for (const target of ledgerTargets) {
                  tweenNum(target.node, 0, target.value, DURATION_MS.ceremony);
                }
                await sleep(DURATION_MS.ceremony);
              } else if (ledgerTargets?.length) {
                for (const target of ledgerTargets) {
                  target.node.textContent = String(target.value);
                }
              }
            },
          },
          {
            id: 'close',
            duration: DURATION_MS.ceremony,
            from: { rail: 0 },
            to: { rail: 100 },
            onUpdate(value) {
              const rail = root?.querySelector('.r5-dawn-close-rail');
              if (!rail) return;
              rail.style.setProperty('--r5-rail', `${value.rail}%`);
            },
          },
        ],
        onPhase(phaseId) {
          applyPhase(phaseId);
        },
      }).done;

      if (root?.isConnected) root.dataset.r5State = R5_SCREEN_END_STATES.dawnClosed;
      return owedUnlocks;
    } catch (error) {
      dawnOutcome = 'failed';
      throw error;
    } finally {
      if (dawnOutcome === 'failed') barrierToken.cancel();
      else barrierToken.finish();
    }
  }

  async function playFallCeremony(root, {
    unpaidBequest, offers, whisperText, ledgerTargets, policy,
  }) {
    const terminal = unpaidBequest
      ? R5_SCREEN_END_STATES.fallUnpaidShadeBequest
      : R5_SCREEN_END_STATES.monumentEngraved;
    const applyPhase = (phaseId) => {
      if (!root?.isConnected) return;
      root.dataset.r5Phase = phaseId;
      const plate = root.querySelector('.r5-monument-plate');
      const chisel = root.querySelector('.r5-chisel');
      const spray = root.querySelector('.r5-ember-spray');
      const choice = root.querySelector('.r5-choice-ring');
      const whisper = root.querySelector('.r5-fall-whisper');
      if (phaseId === 'plate-rise' && plate) {
        plate.dataset.r5State = 'ready';
        plate.style.transform = 'translateY(0)';
        plate.style.opacity = '1';
      }
      if (phaseId === 'chisel' && chisel) {
        chisel.dataset.r5State = isReducedPolicy(policy) ? 'final' : 'strike';
        chisel.classList.add('shown');
      }
      if (phaseId === 'ember-spray' && spray) {
        if (isReducedPolicy(policy)) spray.replaceChildren();
        else spray.dataset.r5State = 'rising';
      }
      if (phaseId === 'bequest' && choice) {
        choice.dataset.r5State = unpaidBequest ? 'unpaid' : (offers?.length ? 'open' : 'empty');
      }
      if (phaseId === 'whisper' && whisper) {
        whisper.dataset.r5State = whisperText ? 'ready' : 'absent';
      }
    };

    await runPhasedCeremony({
      name: 'fall',
      endState: terminal,
      barrier: presentationBarrier,
      trace,
      policy,
      phases: FALL_CEREMONY_PHASES.map((id) => {
        if (id === 'plate-rise') {
          return {
            id,
            duration: DURATION_MS.screen,
            from: { y: 24, opacity: 0 },
            to: { y: 0, opacity: 1 },
            onUpdate(value) {
              const plate = root?.querySelector('.r5-monument-plate');
              if (!plate) return;
              plate.style.transform = `translateY(${value.y}px)`;
              plate.style.opacity = String(value.opacity);
            },
          };
        }
        if (id === 'chisel') {
          return {
            id,
            duration: DURATION_MS.micro * 3,
            from: 0,
            to: 1,
            onUpdate() { /* FE CSS owns flash timing once imported */ },
          };
        }
        if (id === 'ember-spray') {
          return {
            id,
            duration: DURATION_MS.ceremony,
            from: 0,
            to: 1,
          };
        }
        if (id === 'stats') {
          return {
            id,
            duration: DURATION_MS.ceremony,
            from: 0,
            to: 1,
          };
        }
        return { id, duration: DURATION_MS.screen, from: 0, to: 1 };
      }),
      onPhase(phaseId) {
        applyPhase(phaseId);
        if (phaseId === 'stats' && ledgerTargets?.length) {
          if (typeof tweenNum === 'function' && !isReducedPolicy(policy)) {
            for (const target of ledgerTargets) {
              tweenNum(target.node, 0, target.value, DURATION_MS.ceremony);
            }
          } else {
            for (const target of ledgerTargets) {
              target.node.textContent = String(target.value);
            }
          }
        }
        if (phaseId === 'bequest') sfx.relic?.();
      },
    }).done;

    if (root?.isConnected) root.dataset.r5State = terminal;
  }

  function renderEnd({
    won, newUnlocks = [], offers = [], fallAct = 0, fallRow = 1,
    unpaidBequest = false, ledger = null,
  }) {
    const run = S.run;
    music.playForRunEnd(!!won);
    const st = run.stats;
    const mins = Math.max(1, Math.round((Date.now() - st.start) / 60000));
    const totalFloor = run.act * E.MAP_ROWS + run.floorsClimbed;
    const vigil = runEffects.syncVigil();
    const grown = !!(vigil.shards?.length || vigil.unlocks?.length || vigil.whispers > 0
      || offers.length || (ledger && ledger.whisper));
    const profile = compositionProfile(grown);
    const policy = presentationPolicy();
    const attrs = screenPresentationAttrs(policy);
    const whisperText = (ledger && ledger.whisper)
      || Vigil.whisperAt?.(vigil.whispers)
      || '';

    const statsCells = [
      { key: 'floors', value: totalFloor, label: tr('ui.end.floors') },
      { key: 'slain', value: st.slain, label: tr('ui.end.slain') },
      { key: 'elites', value: st.elites + st.bosses, label: tr('ui.end.elitesBosses') },
      { key: 'deck', value: run.player.deck.length, label: tr('ui.end.deckSize') },
      { key: 'dmgDealt', value: st.dmgDealt, label: tr('ui.end.dmgDealt') },
      { key: 'dmgTaken', value: st.dmgTaken, label: tr('ui.end.dmgTaken') },
      { key: 'cards', value: st.cardsPlayed, label: tr('ui.end.cardsPlayed') },
      { key: 'time', value: mins, label: tr('ui.end.runTime'), suffix: 'm' },
    ];
    const stats = `<div class="stats-grid${won ? ' r5-dawn-ledger' : ''}">
      ${statsCells.map((cell) => `<div class="stat-cell" data-stat="${cell.key}"><div class="v" data-stat-value="${cell.key}">${isReducedPolicy(policy) ? `${cell.value}${cell.suffix || ''}` : `0${cell.suffix || ''}`}</div><div class="k">${cell.label}</div></div>`).join('')}
    </div>`;
    const btns = `<div class="end-btns">
      <button class="btn" data-a="deck"${won ? ' disabled' : ''}>${tr('ui.end.viewDeck')}</button>
      <button class="btn" data-a="title"${won ? ' disabled' : ''}>${tr('ui.end.returnVigil')}</button>
    </div>`;
    let ceremony = Promise.resolve();
    if (won) {
      screenEl().innerHTML = `<div class="end-screen r5-end r5-end--victory screen-enter" data-r5-profile="${profile}" data-r5-state="rest" data-tier="${attrs.tier}" data-motion="${attrs.motion}">
      ${metaBg('ascended')}
      <div class="r5-dawn-bloom" data-r5-state="rest" aria-hidden="true"></div>
      <div class="r5-dawn-parallax" data-r5-state="rest" aria-hidden="true"></div>
      <div class="end-title win">${tr('ui.end.ascended')}</div>
      <div class="ov-sub" style="font-size:17px">${tr('ui.end.ascendedSub')}</div>
      <div class="dawn-ceremony" aria-live="polite"></div>
      ${stats}
      <div class="r5-dawn-close-rail" data-r5-state="rest" aria-hidden="true"></div>
      ${btns}
    </div>`;
      const root = $('.r5-end', screenEl());
      const host = $('.dawn-ceremony', screenEl());
      const ledgerTargets = $$('.r5-dawn-ledger [data-stat-value]', screenEl()).map((node) => {
        const key = node.getAttribute('data-stat-value');
        const cell = statsCells.find((entry) => entry.key === key);
        return { node, value: cell ? cell.value : 0 };
      });
      ceremony = playDawnCeremony(run, root, host, policy, ledgerTargets);
      sunrise(); // the only warm daylight in the game
      sfx.victory();
      V.flash('#ffe9ac', 0.25, 1);
      if (!isReducedPolicy(policy)) {
        const conf = setInterval(() => V.burst(Math.random() * stageW(), stageH() * 0.2, { color: ['#ffd97a', '#c9b0ff', '#8fe8a0'][(Math.random() * 3) | 0], n: 16, speed: 300, grav: 260, life: 1.2 }), 400);
        setTimeout(() => clearInterval(conf), 4200);
      }
    } else {
      // the fallen may carve one thing into the stone for the next climber to find
      const bequestHtml = unpaidBequest
        ? `<div class="bequest r5-choice-ring" data-r5-state="unpaid"><div class="bequest-done r5-bequest-unpaid">${tr('ui.end.bequestUnpaid')}</div></div>`
        : offers.length ? `<div class="bequest r5-choice-ring" id="bequest" data-r5-state="open">
        <div class="bequest-title">${tr('ui.end.bequestTitle', { act: `<b>${themeForRun({ act: fallAct })?.name || ''}</b>` })}</div>
        <div class="bequest-opts">${offers.map((o, i) => {
    const L = bequestLabel(o);
    return `<button class="bequest-opt" data-a="bequest" data-i="${i}"><span class="bq-icon">${L.icon}</span><span class="bq-name">${L.name}</span><span class="bq-note">${L.note}</span></button>`;
  }).join('')}</div>
      </div>` : `<div class="bequest r5-choice-ring" data-r5-state="empty"></div>`;
      const emberCount = isReducedPolicy(policy) ? 0 : 10;
      const embers = Array.from({ length: emberCount }, () =>
        `<span class="ember" style="left:${(8 + Math.random() * 84).toFixed(1)}%;--ex:${((Math.random() - 0.5) * 90).toFixed(0)}px;animation-delay:${(Math.random() * 4).toFixed(2)}s;animation-duration:${(3 + Math.random() * 3).toFixed(2)}s"></span>`).join('');
      const whisperHtml = whisperText
        ? `<div class="r5-fall-whisper" data-r5-state="rest"><i>${escHtml(whisperText)}</i></div>`
        : `<div class="r5-fall-whisper" data-r5-state="absent"></div>`;
      const deedHtml = grown
        ? `<div class="r5-deed-ornament" aria-hidden="true">${iconSvg('deed-firstDawn', 18)}</div>`
        : '';
      screenEl().innerHTML = `<div class="end-screen grave r5-end r5-end--fallen" data-r5-profile="${profile}" data-r5-state="rest" data-tier="${attrs.tier}" data-motion="${attrs.motion}">
      ${metaBg('fallen')}
      <div class="monument r5-monument">
        <div class="r5-monument-plate" data-r5-state="rest" style="transform:translateY(24px);opacity:0"></div>
        <div class="r5-chisel" data-r5-state="rest" aria-hidden="true"></div>
        <div class="mon-flame"></div>
        <div class="end-title lose">${tr('ui.end.fallen')}</div>
        <div class="ov-sub" style="font-size:16px">${tr('ui.end.fallenSub', { floor: totalFloor })}</div>
        ${deedHtml}
        ${whisperHtml}
        ${stats}${bequestHtml}${btns}
      </div>
      <div class="embers r5-ember-spray" data-r5-state="rest">${embers}</div>
    </div>`;
      const root = $('.r5-end', screenEl());
      const ledgerTargets = $$('.stats-grid [data-stat-value]', screenEl()).map((node) => {
        const key = node.getAttribute('data-stat-value');
        const cell = statsCells.find((entry) => entry.key === key);
        return { node, value: cell ? cell.value : 0 };
      });
      ceremony = playFallCeremony(root, {
        unpaidBequest, offers, whisperText, ledgerTargets, policy,
      });
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
    }).catch(() => {
      if (S.screen !== 'end' || S.run?.runId !== run.runId) return;
      $$('.end-btns button', screenEl()).forEach((button) => { button.disabled = false; });
      showRunEndPersistenceFailure?.(run);
    });
  }

  return Object.freeze({ journalRunEnd, finalisePendingRunEnd, renderEnd });
}
