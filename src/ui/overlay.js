import * as E from '../engine.js';
import { POTIONS } from '../data.js';
import { createChoiceLatch } from '../choice-latch.js';
import { getSfxVolume, isSfxMuted, setSfxMuted, setSfxVolume, sfx } from '../audio.js';
import * as music from '../music.js';
import { stageEl, stageW, toStage } from '../stage.js';
import { $, $$, S, el, presentationBarrier, terminalNavigationLocked, trace } from './context.js';
import { uiCommands } from './commands.js';

export function createOverlay({ tr, runEffects, cardEl, actions }) {
  const {
    afterAction, clearTargeting, drain, finalisePendingRunEnd, journalRunEnd, setTargeting,
  } = actions;

  const closeMenus = () => $$('.pop-menu, .audio-panel, .settings-panel').forEach((menu) => menu.remove());
  const closeMenusOnce = (event) => {
    if (!event.target.closest('.pop-menu, .audio-panel, .settings-panel')) closeMenus();
  };

  function openMenu(cx, cy) {
    closeMenus();
    const { x, y } = toStage(cx, cy);
    const menu = el('div', 'pop-menu');
    const terminalLocked = terminalNavigationLocked();
    menu.innerHTML = `<button data-m="help">${tr('ui.menu.howToPlay')}</button><button data-m="settings">${tr('ui.menu.settings')}</button>${terminalLocked ? '' : `<button data-m="abandon" style="color:#ff8d8d">${tr('ui.menu.abandonRun')}</button>`}`;
    stageEl().appendChild(menu);
    menu.style.left = `${Math.min(x, stageW() - 200)}px`;
    menu.style.top = `${y + 8}px`;
    menu.onclick = (event) => {
      const action = event.target.dataset.m;
      closeMenus();
      if (action === 'help') showHelp();
      if (action === 'settings') openSettingsPanel();
      if (action === 'abandon' && !terminalNavigationLocked()) confirmAbandon();
    };
    setTimeout(() => document.addEventListener('pointerdown', closeMenusOnce, { once: true }), 0);
  }

  function openSettingsPanel() {
    closeMenus();
    const panel = el('div', 'settings-panel audio-panel');
    const row = (label, volume, muted, bus) => `
      <div class="audio-row" data-bus="${bus}">
        <div class="audio-row-head">
          <span class="audio-label">${label}</span>
          <button type="button" class="audio-mute" data-a="mute">${muted ? tr('ui.menu.unmute') : tr('ui.menu.mute')}</button>
        </div>
        <input type="range" class="audio-vol" min="0" max="100" step="1" value="${Math.round(volume * 100)}" ${muted ? 'disabled' : ''}>
      </div>`;
    panel.innerHTML = `
      <div class="audio-panel-title">${tr('ui.settings.title')}</div>
      ${row(tr('ui.settings.music'), music.getMusicVolume(), music.isMusicMuted(), 'music')}
      ${row(tr('ui.settings.sfx'), getSfxVolume(), isSfxMuted(), 'sfx')}
      <div class="settings-debug">
        <div class="settings-debug-label">${tr('ui.settings.debugLabel')}</div>
        <button type="button" class="btn danger settings-reset" data-a="reset"${terminalNavigationLocked() ? ' disabled' : ''}>${tr('ui.settings.resetSave')}</button>
        <div class="settings-debug-warn">${tr('ui.settings.resetWarn')}</div>
      </div>
      <button type="button" class="audio-close" data-a="close">${tr('ui.menu.close')}</button>`;
    stageEl().appendChild(panel);
    const bindRow = (bus) => {
      const root = $(`.audio-row[data-bus="${bus}"]`, panel);
      const slider = $('.audio-vol', root);
      const muteBtn = $('.audio-mute', root);
      const getVolume = bus === 'music' ? music.getMusicVolume : getSfxVolume;
      const setVolume = bus === 'music' ? music.setMusicVolume : setSfxVolume;
      const getMute = bus === 'music' ? music.isMusicMuted : isSfxMuted;
      const setMute = bus === 'music' ? music.setMusicMuted : setSfxMuted;
      slider.oninput = () => {
        setVolume(+slider.value / 100);
        if (bus === 'sfx') sfx.click();
      };
      muteBtn.onclick = () => {
        const on = setMute(!getMute());
        muteBtn.textContent = on ? tr('ui.menu.unmute') : tr('ui.menu.mute');
        slider.disabled = on;
        slider.value = String(Math.round(getVolume() * 100));
        sfx.click();
      };
    };
    bindRow('music');
    bindRow('sfx');
    $('[data-a="close"]', panel).onclick = () => closeMenus();
    $('[data-a="reset"]', panel).onclick = () => {
      if (terminalNavigationLocked()) return;
      closeMenus();
      confirmResetSave();
    };
    setTimeout(() => document.addEventListener('pointerdown', closeMenusOnce, { once: true }), 0);
  }

  function confirmResetSave() {
    if (terminalNavigationLocked()) return;
    openOverlay(`<div class="panel ov-panel" style="text-align:center">
      <div class="ov-title">${tr('ui.settings.resetConfirmTitle')}</div>
      <div class="ov-sub">${tr('ui.settings.resetConfirmBody')}</div>
      <div class="ov-actions"><button class="btn danger" data-a="yes">${tr('ui.settings.eraseEverything')}</button><button class="btn ghost" data-a="no">${tr('ui.common.cancel')}</button></div>
    </div>`, (root) => {
      root.onclick = (event) => {
        const action = event.target.dataset.a;
        if (action === 'yes') {
          E.clearSave();
          runEffects.clearVigil();
          S.run = null;
          S.cb = null;
          S.embark = null;
          closeOverlay();
          sfx.click();
          uiCommands.show('title');
        }
        if (action === 'no') closeOverlay();
      };
    });
  }

  function potionMenu(slot, event) {
    if (S.busy) return;
    closeMenus();
    const id = S.run.player.potions[slot];
    if (!id) return;
    const potion = POTIONS[id];
    const inCombat = S.cb && !S.cb.over && S.screen === 'combat';
    const canUse = !potion.combatOnly || inCombat;
    const menu = el('div', 'pop-menu');
    menu.innerHTML = `<button data-m="use" ${canUse ? '' : 'disabled style="opacity:.4"'}>${tr('ui.hud.usePotion', { name: potion.name })}</button><button data-m="toss">${tr('ui.hud.tossPotion')}</button>`;
    stageEl().appendChild(menu);
    const point = toStage(event.clientX, event.clientY);
    menu.style.left = `${Math.min(point.x - 60, stageW() - 220)}px`;
    menu.style.top = `${point.y + 10}px`;
    menu.onclick = async (click) => {
      const action = click.target.dataset.m;
      closeMenus();
      if (action === 'toss') {
        S.run.player.potions[slot] = null;
        sfx.card();
        uiCommands.renderHud();
        runEffects.saveRun(S.run);
      }
      if (action === 'use' && canUse) {
        if (potion.needsTarget && inCombat) {
          const living = S.cb.enemies.filter((enemy) => enemy.hp > 0);
          if (living.length === 1) return usePotionOn(slot, living[0].idx);
          setTargeting({ kind: 'potion', slot });
        } else usePotionOn(slot, null);
      }
    };
    setTimeout(() => document.addEventListener('pointerdown', closeMenusOnce, { once: true }), 0);
  }

  async function usePotionOn(slot, targetIdx) {
    const potionSpan = trace.begin('input.potion', {
      attributes: { slot, targetKind: targetIdx == null ? 'none' : 'enemy' },
    });
    try {
      clearTargeting();
      sfx.potion();
      let used;
      if (S.cb && !S.cb.over && S.screen === 'combat') {
        used = E.usePotion(S.run, S.cb, slot, targetIdx);
        if (used) {
          await drain();
          afterAction();
        }
      } else {
        used = E.usePotion(S.run, null, slot, null);
        if (used) {
          uiCommands.renderHud();
          runEffects.saveRun(S.run);
        }
      }
      if (!used) {
        potionSpan.finish('skipped', { reason: 'engine-rejected' });
        return false;
      }
      potionSpan.finish('completed');
      return true;
    } catch (error) {
      potionSpan.finish('failed', { reason: 'handler-error' });
      throw error;
    }
  }

  function confirmAbandon() {
    if (terminalNavigationLocked()) return;
    openOverlay(`<div class="panel ov-panel" style="text-align:center">
      <div class="ov-title">${tr('ui.menu.abandonConfirmTitle')}</div>
      <div class="ov-sub">${tr('ui.menu.abandonConfirmBody')}</div>
      <div class="ov-actions"><button class="btn danger" data-a="yes">${tr('ui.menu.abandon')}</button><button class="btn ghost" data-a="no">${tr('ui.menu.keepClimbing')}</button></div>
    </div>`, (root) => {
      root.onclick = (event) => {
        const action = event.target.dataset.a;
        if (action === 'yes') {
          const run = S.run;
          root.onclick = null;
          closeOverlay();
          journalRunEnd(run, 'abandon', () => {
            S.run = null;
            S.cb = null;
            uiCommands.show('title');
          });
        }
        if (action === 'no') closeOverlay();
      };
    });
  }

  let persistenceDialogTransaction = null;
  const persistenceDialogActive = () => persistenceDialogTransaction != null;
  const persistenceAttempts = new Map();
  function persistObserved(kind, action, blockedReason = 'storage-unavailable') {
    const attempt = (persistenceAttempts.get(kind) || 0) + 1;
    persistenceAttempts.set(kind, attempt);
    trace.emit('persistence.attempt', {
      outcome: 'accepted', attributes: { kind, attempt, result: 'attempting' },
    });
    let result;
    try {
      result = action();
    } catch (error) {
      trace.emit('persistence.blocked', {
        outcome: 'rejected', attributes: { kind, attempt, result: 'blocked', reason: 'storage-unavailable' },
      });
      throw error;
    }
    const ok = result === true || result?.accepted === true;
    trace.emit(ok ? 'persistence.recovered' : 'persistence.blocked', {
      outcome: ok ? 'completed' : 'rejected',
      attributes: { kind, attempt, result: ok ? 'saved' : 'blocked', reason: ok ? 'none' : blockedReason },
    });
    if (ok) persistenceAttempts.delete(kind);
    return result;
  }

  function openOverlay(html, wire = null, closable = false) {
    if (persistenceDialogTransaction) return false;
    const overlay = $('#overlay');
    overlay.innerHTML = html;
    overlay.classList.add('open');
    overlay._closable = closable;
    if (wire) wire(overlay.firstElementChild);
    return true;
  }

  function closeOverlay() {
    if (persistenceDialogTransaction) return false;
    const overlay = $('#overlay');
    overlay.classList.remove('open', 'run-save-lock');
    overlay.innerHTML = '';
    return true;
  }

  function persistenceFailureHtml({ id, title, description, retry, reload }) {
    return `<div class="panel ov-panel" role="alertdialog" aria-modal="true" aria-labelledby="${id}-title" aria-describedby="${id}-description" style="text-align:center">
      <div class="ov-title" id="${id}-title">${title}</div>
      <div class="ov-sub" id="${id}-description" role="status" aria-live="assertive" aria-atomic="true">${description}</div>
      <div class="ov-actions"><button class="btn btn-primary" data-a="${retry.action}">${retry.label}</button><button class="btn ghost" data-a="${reload.action}">${reload.label}</button></div>
    </div>`;
  }

  function openPersistenceDialog(html, focusSelector, wire) {
    if (persistenceDialogTransaction) return null;
    closeMenus();
    const background = $('#shake');
    const blockBackground = (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
    };
    const barrierToken = presentationBarrier.begin('persistence-dialog');
    const transaction = { background, wasInert: !!background?.inert, blockBackground, settled: false, root: null, barrierToken };
    let barrierOpen = true;
    const closeBarrier = (cancelled = false) => {
      if (!barrierOpen) return false;
      barrierOpen = false;
      return cancelled ? transaction.barrierToken.cancel() : transaction.barrierToken.finish();
    };
    const cleanupUi = () => {
      if (transaction.root) {
        transaction.root.onclick = null;
        transaction.root.onkeydown = null;
      }
      if (background) {
        background.inert = transaction.wasInert;
        for (const type of ['click', 'pointerdown', 'pointerup', 'keydown']) {
          background.removeEventListener(type, blockBackground, true);
        }
      }
      const overlay = $('#overlay');
      overlay.classList.remove('open', 'run-save-lock');
      overlay.innerHTML = '';
      overlay._closable = false;
    };
    transaction.active = () => persistenceDialogTransaction === transaction && !transaction.settled;
    transaction.settle = (continuation = null) => {
      if (!transaction.active()) return false;
      transaction.settled = true;
      persistenceDialogTransaction = null;
      let cleanupError = null;
      try {
        cleanupUi();
      } catch (error) {
        cleanupError = error;
      } finally {
        closeBarrier(!!cleanupError);
      }
      if (cleanupError) throw cleanupError;
      continuation?.();
      return true;
    };
    try {
      const opened = openOverlay(html, (root) => {
        transaction.root = root;
        root.onkeydown = (event) => {
          event.stopPropagation();
          if (event.key !== 'Tab') return;
          const buttons = $$('button:not(:disabled)', root);
          if (!buttons.length) return;
          const first = buttons[0], last = buttons.at(-1);
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        };
        wire(root, transaction);
      });
      if (!opened) {
        transaction.settled = true;
        cleanupUi();
        closeBarrier(true);
        return null;
      }
      $('#overlay').classList.add('run-save-lock');
      persistenceDialogTransaction = transaction;
      if (background) {
        background.inert = true;
        for (const type of ['click', 'pointerdown', 'pointerup', 'keydown']) {
          background.addEventListener(type, blockBackground, true);
        }
      }
      requestAnimationFrame(() => $(focusSelector, $('#overlay'))?.focus());
      return transaction;
    } catch (error) {
      transaction.settled = true;
      if (persistenceDialogTransaction === transaction) persistenceDialogTransaction = null;
      try { cleanupUi(); } catch { /* preserve the setup error */ }
      closeBarrier(true);
      throw error;
    }
  }

  function showRunSaveFailure(run, onSaved, kind = null) {
    const html = persistenceFailureHtml({
      id: 'run-save-failure',
      title: tr('ui.persistence.saveFailedTitle'),
      description: tr('ui.persistence.runSaveBody'),
      retry: { action: 'retry-save', label: tr('ui.persistence.retrySave') },
      reload: { action: 'reload-save', label: tr('ui.persistence.reloadClimb') },
    });
    openPersistenceDialog(html, '[data-a="retry-save"]', (root, transaction) => {
      root.onclick = (event) => {
        if (!transaction.active()) return;
        const action = event.target.closest('[data-a]')?.dataset.a;
        if (action === 'reload-save') { location.reload(); return; }
        if (action !== 'retry-save') return;
        sfx.click();
        const retry = $('[data-a="retry-save"]', root);
        const reload = $('[data-a="reload-save"]', root);
        retry.disabled = true;
        reload.disabled = true;
        const saved = kind ? persistObserved(kind, () => runEffects.saveRun(run)) : runEffects.saveRun(run);
        if (!saved) {
          $('.ov-sub', root).textContent = tr('ui.persistence.runSaveRetryFail');
          retry.disabled = false;
          reload.disabled = false;
          retry.focus();
          return;
        }
        transaction.settle(onSaved);
      };
    });
  }

  function requireRunSave(run, onSaved, kind = null) {
    if (persistenceDialogTransaction) return false;
    const saved = kind ? persistObserved(kind, () => runEffects.saveRun(run)) : runEffects.saveRun(run);
    if (saved) return true;
    showRunSaveFailure(run, onSaved, kind);
    return false;
  }

  function requireHollowRouteClear(run, onCleared) {
    if (!run.pendingHollowRoute) return true;
    if (persistObserved('hollow-route-clear', () => runEffects.completeHollowRoute(run))) return true;
    const html = persistenceFailureHtml({
      id: 'hollow-route-save-failure',
      title: tr('ui.persistence.saveFailedTitle'),
      description: tr('ui.persistence.hollowRouteBody'),
      retry: { action: 'retry-hollow-route', label: tr('ui.persistence.retrySave') },
      reload: { action: 'reload-hollow-route', label: tr('ui.persistence.reloadDestination') },
    });
    openPersistenceDialog(html, '[data-a="retry-hollow-route"]', (root, transaction) => {
      root.onclick = (event) => {
        if (!transaction.active()) return;
        const action = event.target.closest('[data-a]')?.dataset.a;
        if (action === 'reload-hollow-route') { location.reload(); return; }
        if (action !== 'retry-hollow-route') return;
        sfx.click();
        transaction.settle(() => {
          if (requireHollowRouteClear(run, onCleared)) onCleared();
        });
      };
    });
    return false;
  }

  function leaveHollowDestination(run, onCleared) {
    if (!run.pendingHollowRoute) { onCleared(); return; }
    if (!requireHollowRouteClear(run, onCleared)) return;
    onCleared();
  }

  function showStonePersistenceFailure(onRetry, retryLabel = tr('ui.common.retry')) {
    const html = persistenceFailureHtml({
      id: 'stone-save-failure',
      title: tr('ui.persistence.stoneTitle'),
      description: tr('ui.persistence.stoneBody'),
      retry: { action: 'retry-stone', label: retryLabel },
      reload: { action: 'reload-stone', label: tr('ui.persistence.reloadClimb') },
    });
    openPersistenceDialog(html, '[data-a="retry-stone"]', (root, transaction) => {
      root.onclick = (event) => {
        if (!transaction.active()) return;
        const action = event.target.closest('[data-a]')?.dataset.a;
        if (action === 'reload-stone') { location.reload(); return; }
        if (action !== 'retry-stone') return;
        sfx.click();
        transaction.settle(onRetry);
      };
    });
  }

  function requireBequestClear(onCleared) {
    if (persistObserved('shade-bequest-clear', () => runEffects.clearBequest())) return true;
    showStonePersistenceFailure(() => {
      if (persistObserved('shade-bequest-clear', () => runEffects.clearBequest())) onCleared();
      else requireBequestClear(onCleared);
    });
    return false;
  }

  function requirePendingShadeDuelClear(onCleared) {
    const result = runEffects.resumeShadeDuel(S.run, (action) =>
      persistObserved('shade-bequest-clear', action));
    if (result.status === E.SHADE_DUEL_TX.READY) return true;
    showStonePersistenceFailure(() => {
      if (requirePendingShadeDuelClear(onCleared)) onCleared();
    });
    return false;
  }

  function resumeSavedCombat(run, onReady) {
    if (run.pendingQuestId === 'ownShade' && !requirePendingShadeDuelClear(onReady)) return false;
    onReady();
    return true;
  }

  function showRunEndPersistenceFailure(run, onFinalised = null) {
    const html = persistenceFailureHtml({
      id: 'run-end-save-failure',
      title: tr('ui.persistence.vigilTitle'),
      description: tr('ui.persistence.vigilBody'),
      retry: { action: 'retry-end', label: tr('ui.persistence.retryFinalisation') },
      reload: { action: 'reload-end', label: tr('ui.persistence.reloadFinalisation') },
    });
    openPersistenceDialog(html, '[data-a="retry-end"]', (root, transaction) => {
      root.onclick = (event) => {
        if (!transaction.active()) return;
        const action = event.target.closest('[data-a]')?.dataset.a;
        if (action === 'reload-end') { location.reload(); return; }
        if (action !== 'retry-end') return;
        sfx.click();
        transaction.settle(() => finalisePendingRunEnd(run, onFinalised));
      };
    });
  }

  function showCardGrid(title, instances, { sub = '', pick = null, canSkip = false, skipLabel = tr('ui.common.skip'), inCombat = false } = {}) {
    const panel = el('div', 'panel ov-panel');
    panel.innerHTML = `<div class="ov-title">${title}</div>${sub ? `<div class="ov-sub">${sub}</div>` : ''}`;
    const grid = el('div', `card-grid ${pick ? 'choice-cards' : ''}`);
    const sorted = pick ? instances : [...instances].sort((a, b) => E.cardData(a).name.localeCompare(E.cardData(b).name));
    const latch = createChoiceLatch();
    let skip = null;
    const choose = (inst, card = null, delay = 0) => {
      if (!latch.claim()) return;
      if (card) card.classList.add('picked');
      [...grid.children].forEach((choice) => {
        choice.onclick = null;
        choice.style.pointerEvents = 'none';
        choice.setAttribute('aria-disabled', 'true');
      });
      if (skip) { skip.disabled = true; skip.onclick = null; }
      const finish = () => { closeOverlay(); pick(inst); };
      if (delay) setTimeout(finish, delay);
      else finish();
    };
    for (const inst of sorted) {
      const card = cardEl(inst, { inCombat });
      if (pick) card.onclick = () => { sfx.click(); choose(inst, card, 240); };
      grid.appendChild(card);
    }
    panel.appendChild(grid);
    const buttons = el('div', 'ov-actions');
    if (canSkip && pick) {
      skip = el('button', 'btn ghost', skipLabel);
      skip.onclick = () => { sfx.click(); choose(null); };
      buttons.appendChild(skip);
    }
    if (!pick) {
      const close = el('button', 'btn ghost', tr('ui.menu.close'));
      close.onclick = () => { sfx.click(); closeOverlay(); };
      buttons.appendChild(close);
    }
    panel.appendChild(buttons);
    if (!openOverlay('', null, !pick)) return false;
    $('#overlay').appendChild(panel);
    return true;
  }

  function showHelp() {
    openOverlay(`<div class="panel ov-panel howto">
      <div class="ov-title">${tr('ui.help.title')}</div>
      <h3>${tr('ui.help.climbTitle')}</h3>${tr('ui.help.climbBody', { count: E.themeCount(S.run) || E.themeCount(null) })}
      <h3>${tr('ui.help.combatTitle')}</h3>${tr('ui.help.combatBody')}
      <h3>${tr('ui.help.glassTitle')}</h3>${tr('ui.help.glassBody')}
      <h3>${tr('ui.help.lanternTitle')}</h3>${tr('ui.help.lanternBody')}
      <h3>${tr('ui.help.wardTitle')}</h3>${tr('ui.help.wardBody')}
      <h3>${tr('ui.help.firesTitle')}</h3>${tr('ui.help.firesBody')}
      <h3>${tr('ui.help.vigilTitle')}</h3>${tr('ui.help.vigilBody')}
      <div class="ov-actions"><button class="btn" data-a="ok">${tr('ui.menu.fightOn')}</button></div>
    </div>`, (root) => { $('[data-a="ok"]', root).onclick = () => { sfx.click(); closeOverlay(); }; }, true);
  }

  function showDawnPersistenceFailure(onRetry, phase) {
    const finishing = phase === 'clear';
    const description = finishing
      ? tr('ui.dawn.saveFailedClear')
      : tr('ui.dawn.saveFailedCursor');
    const html = persistenceFailureHtml({
      id: 'dawn-save-failure',
      title: tr('ui.dawn.saveFailedTitle'),
      description,
      retry: { action: 'retry-dawn', label: tr('ui.persistence.retrySave') },
      reload: { action: 'reload-dawn', label: tr('ui.dawn.reloadSaved') },
    });
    openPersistenceDialog(html, '[data-a="retry-dawn"]', (root, transaction) => {
      root.onclick = (event) => {
        if (!transaction.active()) return;
        const action = event.target.closest('[data-a]')?.dataset.a;
        if (action === 'reload-dawn') { location.reload(); return; }
        if (action !== 'retry-dawn') return;
        sfx.click();
        transaction.settle(onRetry);
      };
    });
  }

  function persistDawnOrRetry(action, phase) {
    return new Promise((resolve) => {
      const attempt = () => {
        const kind = phase === 'clear' ? 'dawn-clear' : 'dawn-cursor';
        if (persistObserved(kind, action)) { resolve(); return; }
        showDawnPersistenceFailure(attempt, phase);
      };
      attempt();
    });
  }

  return Object.freeze({
    closeMenus, closeOverlay, leaveHollowDestination, openMenu, openOverlay,
    openPersistenceDialog, openSettingsPanel, persistDawnOrRetry, persistObserved, persistenceDialogActive,
    potionMenu, requireBequestClear, requireHollowRouteClear, requireRunSave,
    resumeSavedCombat, showCardGrid, showHelp, showRunEndPersistenceFailure,
    showRunSaveFailure, showStonePersistenceFailure, usePotionOn,
  });
}
