export function createShopScreen(deps) {
  const { S, E, QUESTS, RELICS, POTIONS, sceneBg, rasterOr, merchantSvg, $, el, cardEl, uiIcon, sfx, runEffects, renderHud, iconSvg, escHtml, requireRunSave, V, stageW, stageH, potionSvg, relicArt, showCardGrid, leaveHollowDestination, show, screenEl } = deps;

function renderShop() {
  const run = S.run;
  const shop = (S.shopData ||= {});
  const usurperState = E.questRecord(run, 'usurper')?.state;
  const st = E.shopStockForSession(shop, run);
  const firstUsurperSight = usurperState === 'armed' && E.questRecord(run, 'usurper')?.state === 'revealed';
  if (firstUsurperSight && !requireRunSave(run, renderShop)) return;
  const sc = screenEl();
  sc.innerHTML = `<div class="center-panel screen-enter">${sceneBg()}<div class="panel ov-panel" style="width:min(980px,96vw)">
    <div style="display:flex;align-items:center;justify-content:center;gap:18px">
      <div style="width:130px">${rasterOr('props', 'merchant', merchantSvg())}</div>
      <div><div class="ov-title" style="text-align:left">THE MERCHANT</div>
      <div class="ov-sub shop-dialogue" style="text-align:left;margin:0">"Gold for glory, stranger. Everything's fair-priced — for the doomed."</div></div>
    </div>
    <div class="shop-grid">
      <div class="shop-row cards-row"></div>
      <div class="shop-row misc-row"></div>
      <div class="ov-actions"><button class="btn btn-primary" data-a="leave">Leave the Shop</button></div>
    </div>
  </div></div>`;
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
  function refresh() {
    if (shopGrid) shopGrid.classList.toggle('list-seq-done', shopSeeded);
    cardsRow.innerHTML = '';
    miscRow.innerHTML = '';
    for (const it of st.cards) {
      const wrap = el('div', `shop-item ${it.sold ? 'sold' : ''} ${gold() < it.price ? 'cant' : ''}`);
      const c = cardEl({ id: it.id, up: false, uid: null }, { size: 138 });
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
      const r = RELICS[it.id];
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
      const wrap = el('div', `shop-item quest-shop-item ${it.sold ? 'sold' : ''} ${gold() < it.price ? 'cant' : ''}`);
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
          if (result.reason === 'gold') say(QUESTS.usurper.poor);
          return;
        }
        const finishPurchase = () => {
          it.sold = true;
          sfx.coin();
          say(QUESTS.usurper.bought);
          renderHud();
          refresh();
          if (leave) leave.disabled = false;
        };
        if (!requireRunSave(run, finishPurchase, 'usurper-purchase')) return;
        finishPurchase();
      };
      wrap.appendChild(b);
      wrap.appendChild(el('div', 'price', `${uiIcon('coin', 14)} ${it.price}`));
      miscRow.appendChild(wrap);
    }
    for (const it of st.potions) {
      const p = POTIONS[it.id];
      const wrap = el('div', `shop-item ${it.sold ? 'sold' : ''} ${gold() < it.price ? 'cant' : ''}`);
      const b = el('button', 'shop-relic', `<span style="width:34px;height:44px">${rasterOr('potions', it.id, potionSvg(p.tone))}</span><b>${p.name}</b>${p.text}`);
      b.onclick = () => {
        if (it.sold || gold() < it.price) return sfx.debuff();
        if (!E.gainPotion(run, it.id)) { V.floatText(stageW() / 2, stageH() / 2, 'Potion slots full!', 'notice'); return; }
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
    const b = el('button', 'shop-relic', `<span style="width:34px;display:inline-flex;justify-content:center">${iconSvg('scissors', 26)}</span><b>Card Removal</b>Remove a card from your deck forever.`);
    b.onclick = () => {
      if (st.removed || gold() < st.removeCost || !removable.length) return sfx.debuff();
      showCardGrid('Remove a Card', removable, {
        sub: 'Cut the dead weight.',
        pick: (inst) => {
          if (!inst || !E.removeCardFromDeck(run, inst.uid)) return;
          st.removed = true;
          run.player.gold -= st.removeCost;
          sfx.card();
          runEffects.saveRun(run);
          renderHud();
          refresh();
        },
        canSkip: true, skipLabel: 'Cancel',
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
