import {
  R5_SCREEN_END_STATES,
  DURATION_MS,
  compositionProfile,
  compositionGrownFrom,
  screenPresentationAttrs,
} from '../tokens.js';
import { runNamedCeremony } from '../tween.js';

export function createRestScreen(deps) {
  const {
    contentViewFor, S, E, tr, sceneBg, rasterOr, campfireSvg, iconSvg, $, $$, show, showCardGrid,
    sfx, V, stageW, stageH, requireHollowRouteClear, runEffects, closeOverlay, screenEl, el,
    chestSvg, renderHud, REDUCED, COARSE, presentationBarrier, trace,
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

function renderRest() {
  const run = S.run;
  const canUp = run.player.deck.some((c) => !c.up && runCatalogues().cards[c.id].up);
  const vigil = runEffects.syncVigil();
  const profile = compositionProfile(compositionGrownFrom(vigil, run));
  const endState = R5_SCREEN_END_STATES.restActionReady;
  screenEl().innerHTML = `<div class="center-panel screen-enter r5-scene-panel r5-rest" ${rootAttrs(profile, 'rest')}>${sceneBg()}<div class="panel">
    <div class="ov-title r5-scene-header">${tr('ui.rest.title')}</div>
    <div class="art-lg">${rasterOr('props', 'campfire', campfireSvg())}</div>
    <div class="ov-sub">${tr('ui.rest.sub')}</div>
    <div class="big-choices">
      <button class="btn btn-primary" data-a="rest">${iconSvg('flame', 18)} ${tr('ui.rest.restBtn')} <span style="font-size:13px;opacity:.8">${tr('ui.rest.restHeal', { hp: Math.round(run.player.maxHp * E.restHealFrac(run)) })}</span></button>
      <button class="btn" data-a="smith" ${canUp ? '' : 'disabled'}>${iconSvg('hammer', 18)} ${tr('ui.rest.smithBtn')} <span style="font-size:13px;opacity:.8">${tr('ui.rest.smithSub')}</span></button>
    </div>
  </div></div>`;
  void playCeremony('rest', endState, $('.r5-rest'));
  $('[data-a="rest"]').onclick = (e) => {
    e.currentTarget.disabled = true;
    $('[data-a="smith"]').disabled = true;
    const healed = E.healPlayer(run, Math.round(run.player.maxHp * E.restHealFrac(run)));
    const finish = () => {
      sfx.heal();
      // the fire answers: a swell of warmth, embers rising off the hearth
      V.flash('#ff9a4d', 0.12, 0.8);
      V.floatText(stageW() / 2, stageH() / 2 - 40, tr('ui.rest.healedFloat', { hp: healed }), 'healf');
      V.motes(stageW() / 2, stageH() / 2, '#8fe8a0', 22);
      V.motes(stageW() / 2, stageH() / 2 + 60, '#ffb066', 16);
      setTimeout(() => { if (S.screen === 'rest') show('map'); }, 900);
    };
    if (run.pendingHollowRoute) {
      if (!requireHollowRouteClear(run, finish)) return;
    } else runEffects.saveRun(run);
    finish();
  };
  $('[data-a="smith"]').onclick = () => {
    sfx.click();
    const ups = run.player.deck.filter((c) => !c.up && runCatalogues().cards[c.id].up);
    showCardGrid(tr('ui.rest.upgradeTitle'), ups, {
      sub: tr('ui.rest.upgradeSub'),
      pick: (inst) => {
        if (!inst) return;
        E.upgradeCardInDeck(run, inst.uid);
        const finish = () => {
          sfx.upgrade();
          V.flash('#ffe9ac', 0.12, 0.4);
          showCardGrid(tr('ui.rest.upgradedTitle'), [run.player.deck.find((c) => c.uid === inst.uid)], { sub: tr('ui.rest.upgradedSub') });
          setTimeout(() => { if (S.screen === 'rest') { closeOverlay(); show('map'); } }, 1300);
        };
        if (run.pendingHollowRoute) {
          if (!requireHollowRouteClear(run, finish)) return;
        } else runEffects.saveRun(run);
        finish();
      },
    });
  };
}
function renderTreasure() {
  const run = S.run;
  let opened = E.nodeRewardClaimed(run);
  const vigil = runEffects.syncVigil();
  const profile = compositionProfile(compositionGrownFrom(vigil, run));
  const endState = R5_SCREEN_END_STATES.treasureOpen;
  const showContinue = (subHtml) => {
    const art = $('.art-lg');
    art.removeAttribute('data-a');
    art.style.cursor = '';
    art.innerHTML = rasterOr('props', 'chest-open', chestSvg(true));
    if (subHtml) $('.ov-sub').innerHTML = subHtml;
    const bc = $('.big-choices');
    bc.innerHTML = '';
    const btn = el('button', 'btn btn-primary', tr('ui.common.continue'));
    btn.onclick = () => { sfx.click(); show('map'); };
    bc.appendChild(btn);
    renderHud();
    runEffects.saveRun(run);
    const root = $('.r5-rest');
    if (root) root.dataset.r5State = endState;
  };
  screenEl().innerHTML = `<div class="center-panel screen-enter r5-scene-panel r5-rest r5-rest--treasure" ${rootAttrs(profile, 'rest')}>${sceneBg()}<div class="panel">
    <div class="ov-title r5-scene-header">${tr('ui.treasure.title')}</div>
    <div class="art-lg" style="cursor:pointer" data-a="open">${rasterOr('props', 'chest', chestSvg(false))}</div>
    <div class="ov-sub">${tr('ui.treasure.sub')}</div>
    <div class="big-choices"><button class="btn btn-primary" data-a="open">${tr('ui.treasure.openBtn')}</button></div>
  </div></div>`;
  void playCeremony('treasure', opened ? endState : 'rest', $('.r5-rest'));
  if (opened) {
    showContinue(tr('ui.treasure.empty'));
    return;
  }
  const open = () => {
    if (opened) return;
    opened = true;
    $$('[data-a="open"]').forEach((b) => { b.onclick = null; b.style.pointerEvents = 'none'; });
    const result = E.claimTreasure(run, { common: 0.55, uncommon: 0.35, rare: 0.1 });
    if (result.already) {
      showContinue(tr('ui.treasure.empty'));
      return;
    }
    V.flash('#ffe9ac', 0.2, 0.5);
    V.burst(stageW() / 2, stageH() / 2, { color: '#ffd97a', n: 36, speed: 380, grav: 160 });
    let sub;
    if (result.relicId) {
      sfx.relic();
      const r = runCatalogues().relics[result.relicId];
      sub = tr('ui.treasure.relicClaim', { tone: r.tone, name: r.name, text: r.text });
    } else {
      sfx.coin();
      sub = tr('ui.treasure.coinsOnly', { gold: 60 });
    }
    showContinue(sub);
  };
  $$('[data-a="open"]').forEach((b) => (b.onclick = open));
}

  return Object.freeze({ renderRest, renderTreasure });
}
