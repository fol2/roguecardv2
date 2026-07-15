import {
  R5_SCREEN_END_STATES,
  DURATION_MS,
  compositionProfile,
  compositionGrownFrom,
  screenPresentationAttrs,
} from '../tokens.js';
import { runNamedCeremony } from '../tween.js';

export function createShopScreen(deps) {
  const {
    contentViewFor, S, E, QUESTS, tr, sceneBg, rasterOr, merchantSvg, $, el, cardEl, uiIcon,
    sfx, runEffects, renderHud, iconSvg, escHtml, requireRunSave, V, stageW, stageH, potionSvg,
    relicArt, showCardGrid, leaveHollowDestination, show, screenEl, releaseCardFacesIn,
    REDUCED, COARSE, presentationBarrier, trace,
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

function renderShop() {
  const run = S.run;
  const shop = (S.shopData ||= {});
  const usurperState = E.questRecord(run, 'usurper')?.state;
  const st = E.shopStockForSession(shop, run);
  const firstUsurperSight = usurperState === 'armed' && E.questRecord(run, 'usurper')?.state === 'revealed';
  if (firstUsurperSight && !requireRunSave(run, renderShop)) return;
  const vigil = runEffects.syncVigil();
  const profile = compositionProfile(compositionGrownFrom(vigil, run));
  const endState = R5_SCREEN_END_STATES.shopReady;
  const sc = screenEl();
  sc.innerHTML = `<div class="center-panel screen-enter r5-scene-panel r5-shop" ${rootAttrs(profile, 'rest')}>${sceneBg()}<div class="panel ov-panel" style="width:min(980px,96cqw)">
    <div class="r5-scene-header" style="display:flex;align-items:center;justify-content:center;gap:18px">
      <div style="width:130px">${rasterOr('props', 'merchant', merchantSvg())}</div>
      <div><div class="ov-title" style="text-align:left">${tr('ui.shop.title')}</div>
      <div class="ov-sub shop-dialogue" style="text-align:left;margin:0">${tr('ui.shop.greeting')}</div></div>
    </div>
    <div class="shop-grid">
      <div class="shop-row cards-row"></div>
      <div class="shop-row misc-row"></div>
      <div class="ov-actions"><button class="btn btn-primary" data-a="leave">${tr('ui.shop.leave')}</button></div>
    </div>
  </div></div>`;
  const root = $('.r5-shop', sc);
  void runNamedCeremony({
    name: 'shop',
    endState,
    barrier: presentationBarrier,
    trace,
    from: 0,
    to: 1,
    duration: DURATION_MS.screen,
    easing: 'outSoft',
    policy: presentationPolicy(),
    onUpdate() {},
  }).done.then(() => {
    if (root?.isConnected) root.dataset.r5State = endState;
  }).catch(() => {
    if (root?.isConnected) root.dataset.r5State = endState;
  });
  const cardsRow = $('.cards-row', sc), miscRow = $('.misc-row', sc);
  const shopGrid = $('.shop-grid', sc);
  let shopSeeded = false;
  const gold = () => run.player.gold;
  const buy = (price) => { run.player.gold -= price; sfx.coin(); runEffects.saveRun(run); renderHud(); refresh(); };
  const say = (text) => {
    const dialogue = $('.shop-dialogue', sc);
    if (!dialogue) return;
    dialogue.textContent = `"${text}"`;
    dialogue.classList.add('quest-dialogue');
  };
  function usurperItemState(it) {
    if (it.sold) return 'usurper-item-sold';
    if (gold() < it.price) return 'usurper-item-poor';
    return 'usurper-item-normal';
  }
  function refresh() {
    if (shopGrid) shopGrid.classList.toggle('list-seq-done', shopSeeded);
    // Task 26 — release prior exported faces before rebuilding the stock row.
    releaseCardFacesIn(cardsRow);
    cardsRow.innerHTML = '';
    miscRow.innerHTML = '';
    for (const it of st.cards) {
      const wrap = el('div', `shop-item ${it.sold ? 'sold' : ''} ${gold() < it.price ? 'cant' : ''}`);
      const c = cardEl({ id: it.id, up: false, uid: null }, { size: 138 });
      if (c.dataset.cardFaceKey) wrap.dataset.cardFaceKey = c.dataset.cardFaceKey;
      c.onclick = () => {
        if (it.sold || gold() < it.price) return sfx.debuff();
        it.sold = true;
        E.addCardToDeck(run, it.id);
        buy(it.price);
      };
      wrap.appendChild(c);
      wrap.appendChild(el('div', 'price', `${uiIcon('coin', 14)} ${it.price}`));
      cardsRow.appendChild(wrap);
    }
    for (const it of st.relics) {
      const r = runCatalogues().relics[it.id];
      const wrap = el('div', `shop-item ${it.sold ? 'sold' : ''} ${gold() < it.price ? 'cant' : ''}`);
      const b = el('button', 'shop-relic', `<span class="relic-chip" style="--tone:${r.tone}">${relicArt(it.id, 24)}</span><b>${r.name}</b>${r.text}`);
      b.onclick = () => {
        if (it.sold || gold() < it.price) return sfx.debuff();
        it.sold = true;
        E.gainRelic(run, it.id);
        sfx.relic();
        buy(it.price);
      };
      wrap.appendChild(b);
      wrap.appendChild(el('div', 'price', `${uiIcon('coin', 14)} ${it.price}`));
      miscRow.appendChild(wrap);
    }
    for (const it of st.questItems) {
      const itemState = usurperItemState(it);
      const wrap = el('div', `shop-item quest-shop-item ${it.sold ? 'sold' : ''} ${gold() < it.price ? 'cant' : ''}`);
      wrap.dataset.r5State = itemState;
      const b = el('button', 'shop-relic shop-quest', `<span class="shop-quest-icon">${iconSvg('emptyLantern', 42)}</span><b>${escHtml(it.name)}</b>${escHtml(it.text)}`);
      b.onclick = () => {
        if (it.sold) return;
        const leave = $('[data-a="leave"]', sc);
        b.disabled = true;
        if (leave) leave.disabled = true;
        const result = runEffects.buyQuestItem(run, it.id);
        if (!result.ok) {
          b.disabled = false;
          if (leave) leave.disabled = false;
          sfx.debuff();
          if (result.reason === 'gold') {
            say(QUESTS.usurper.poor);
            wrap.dataset.r5State = 'usurper-item-poor';
          }
          return;
        }
        const finishPurchase = () => {
          it.sold = true;
          sfx.coin();
          say(QUESTS.usurper.bought);
          wrap.dataset.r5State = 'usurper-item-sold';
          renderHud();
          refresh();
          if (leave) leave.disabled = false;
        };
        if (!requireRunSave(run, finishPurchase, 'usurper-purchase')) {
          wrap.dataset.r5State = 'usurper-item-save-blocked';
          return;
        }
        finishPurchase();
      };
      wrap.appendChild(b);
      wrap.appendChild(el('div', 'price', `${uiIcon('coin', 14)} ${it.price}`));
      miscRow.appendChild(wrap);
    }
    for (const it of st.potions) {
      const p = runCatalogues().potions[it.id];
      const wrap = el('div', `shop-item ${it.sold ? 'sold' : ''} ${gold() < it.price ? 'cant' : ''}`);
      const b = el('button', 'shop-relic', `<span style="width:34px;height:44px">${rasterOr('potions', it.id, potionSvg(p.tone))}</span><b>${p.name}</b>${p.text}`);
      b.onclick = () => {
        if (it.sold || gold() < it.price) return sfx.debuff();
        if (!E.gainPotion(run, it.id)) { V.floatText(stageW() / 2, stageH() / 2, tr('ui.shop.potionSlotsFull'), 'notice'); return; }
        it.sold = true;
        sfx.potion();
        buy(it.price);
      };
      wrap.appendChild(b);
      wrap.appendChild(el('div', 'price', `${uiIcon('coin', 14)} ${it.price}`));
      miscRow.appendChild(wrap);
    }
    // card removal service
    const removable = E.removableCards(run);
    const wrap = el('div', `shop-item ${st.removed ? 'sold' : ''} ${gold() < st.removeCost || !removable.length ? 'cant' : ''}`);
    const b = el('button', 'shop-relic', `<span style="width:34px;display:inline-flex;justify-content:center">${iconSvg('scissors', 26)}</span><b>${tr('ui.shop.cardRemoval.title')}</b>${tr('ui.shop.cardRemoval.desc')}`);
    b.onclick = () => {
      if (st.removed || gold() < st.removeCost || !removable.length) return sfx.debuff();
      showCardGrid(tr('ui.shop.cardRemoval.pickTitle'), removable, {
        sub: tr('ui.shop.cardRemoval.pickSub'),
        pick: (inst) => {
          if (!inst || !E.removeCardFromDeck(run, inst.uid)) return;
          st.removed = true;
          run.player.gold -= st.removeCost;
          sfx.card();
          runEffects.saveRun(run);
          renderHud();
          refresh();
        },
        canSkip: true, skipLabel: tr('ui.common.cancel'),
      });
    };
    wrap.appendChild(b);
    wrap.appendChild(el('div', 'price', `${uiIcon('coin', 14)} ${st.removeCost}`));
    miscRow.appendChild(wrap);
    shopSeeded = true;
  }
  refresh();
  $('[data-a="leave"]', sc).onclick = () => {
    sfx.click();
    leaveHollowDestination(run, () => show('map'));
  };
}

  return Object.freeze({ renderShop });
}
