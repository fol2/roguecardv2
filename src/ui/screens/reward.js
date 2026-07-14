export function createRewardScreen(deps) {
  const { contentViewFor, S, E, tr, sceneBg, $, el, iconSvg, uiIcon, stageW, stageH, V, flyTo, tweenNum, sfx, rasterOr, potionSvg, relicArt, requireRunSave, renderHud, show, showCardGrid, openOverlay, closeOverlay, runEffects, setTheme, setAltitude, transition, assetUrl, omenIconName, screenEl, themeForRun } = deps;
  const runCatalogues = () => contentViewFor(S.run);

// ------------------------------------------------------------ rewards
function renderReward() {
  const run = S.run;
  const pending = run.pendingReward;
  if (!pending) { show('map'); return; }
  const { kind, rewards, taken, perfect } = pending;
  const sc = screenEl();
  const title = kind === 'boss' ? tr('ui.reward.bossVanquished') : kind === 'elite' ? tr('ui.reward.eliteSlain') : tr('ui.reward.victory');
  const seal = perfect ? `<div class="perfect-seal">${tr('ui.reward.perfectSeal')}</div>` : '<div class="ornament">✦ ✦ ✦</div>';
  S.lastPerfect = false;
  sc.innerHTML = `<div class="center-panel screen-enter">${sceneBg()}<div class="panel">
    <div class="ov-title">${title}</div>
    ${seal}
    <div class="reward-list"></div>
    <div class="ov-actions"><button class="btn btn-primary" data-a="continue">${tr('ui.common.continue')}</button></div>
  </div></div>`;
  const list = $('.reward-list', sc);
  const settleRow = (row, onSaved) => {
    row.classList.add('taken');
    row.disabled = true;
    row.onclick = null;
    renderHud();
    onSaved?.();
  };
  const addRow = (key, icon, label, take = null, onSaved = null, tip = null) => {
    const row = el('button', 'reward-row', `<span class="ric">${icon}</span><span>${label}</span>`);
    if (tip) row._tip = tip;
    if (taken[key]) settleRow(row);
    else if (take) row.onclick = () => {
      if (!take()) return;
      const finish = () => settleRow(row, onSaved);
      if (!requireRunSave(run, finish)) return;
      finish();
    };
    list.appendChild(row);
    return row;
  };
  addRow('gold', uiIcon('coin', 28), tr('ui.reward.goldRow', { n: rewards.gold }),
    () => E.takePendingReward(run, 'gold'), () => {
      sfx.coin();
      // the coins travel to the purse only after their taken flag is durable
      globalThis.requestAnimationFrame(() => {
        const purse = $('#hud .gold-num');
        const from = { x: stageW() / 2, y: stageH() / 2 - 40 };
        const to = purse ? V.centerOf(purse) : { x: 120, y: 24 };
        const before = run.player.gold - rewards.gold;
        if (purse) purse.textContent = before;
        flyTo(from.x, from.y, to.x, to.y, { n: Math.min(9, 4 + Math.floor(rewards.gold / 12)), color: '#ffd76e', dur: 600, done: () => sfx.coin() });
        if (purse) tweenNum(purse, before, run.player.gold, 640);
      });
    });
  if (rewards.potion) {
    const p = runCatalogues().potions[rewards.potion];
    addRow('potion', rasterOr('potions', rewards.potion, potionSvg(p.tone)), `${p.name}`, () => {
      if (E.takePendingReward(run, 'potion')) return true;
      V.floatText(stageW() / 2, stageH() / 2, tr('ui.reward.potionSlotsFull'), 'notice');
      return false;
    }, () => sfx.potion(), { title: p.name, body: p.text });
  }
  if (rewards.relic) {
    const r = runCatalogues().relics[rewards.relic];
    addRow('relic', `<span style="color:${r.tone};text-shadow:0 0 8px ${r.tone}">${relicArt(rewards.relic, 24)}</span>`, `<b>${r.name}</b>`,
      () => E.takePendingReward(run, 'relic'), () => {
        sfx.relic();
        globalThis.requestAnimationFrame(() => {
          const chip = $(`.hud-relic[data-relic="${rewards.relic}"]`);
          if (!chip) return;
          const to = V.centerOf(chip);
          flyTo(stageW() / 2, stageH() / 2 - 40, to.x, to.y, {
            n: 1, glyph: r.glyph, color: r.tone, dur: 680,
            done: () => { chip.classList.remove('proc'); void chip.offsetWidth; chip.classList.add('proc'); },
          });
        });
      }, { title: r.name, body: r.text });
  }
  const cardRow = addRow('card', uiIcon('deck', 28), tr('ui.reward.addCardRow'));
  cardRow.dataset.cardrow = '1';
  if (!taken.card) cardRow.onclick = () => pickCardReward(rewards.cards);

  const leaveReward = () => {
    E.clearPendingReward(run);
    const continueReward = () => { if (kind === 'boss') show('bossRelic'); else show('map'); };
    if (!requireRunSave(run, continueReward)) return;
    continueReward();
  };
  $('[data-a="continue"]', sc).onclick = () => {
    sfx.click();
    if (!E.pendingRewardHasUntaken(run)) {
      leaveReward();
      return;
    }
    openOverlay(`<div class="panel ov-panel" style="text-align:center">
      <div class="ov-title">${tr('ui.reward.leaveConfirmTitle')}</div>
      <div class="ov-sub">${tr('ui.reward.leaveConfirmBody')}</div>
      <div class="ov-actions"><button class="btn danger" data-a="yes">${tr('ui.reward.leaveConfirmYes')}</button><button class="btn ghost" data-a="no">${tr('ui.reward.leaveConfirmNo')}</button></div>
    </div>`, (root) => {
      root.onclick = (event) => {
        const action = event.target.dataset.a;
        if (action === 'yes') {
          root.onclick = null;
          closeOverlay();
          leaveReward();
        }
        if (action === 'no') closeOverlay();
      };
    });
  };

  function pickCardReward(ids) {
    // Task 26 — reward card grid consumes the same composer export as shop/deck
    // overlays via showCardGrid → cardEl (data-card-face-key on each face).
    showCardGrid(tr('ui.reward.chooseCardTitle'), ids.map((id) => ({ id, up: false, uid: null })), {
      sub: tr('ui.reward.chooseCardSub'),
      pick: (inst) => {
        if (!E.takePendingReward(run, 'card', inst?.id ?? null)) return;
        const finish = () => settleRow(cardRow, () => {
          if (!inst) return;
          sfx.upgrade();
          V.floatText(stageW() / 2, stageH() / 2, tr('ui.reward.cardAdded', { name: E.cardData(inst, S.run).name }), 'notice');
        });
        if (!requireRunSave(run, finish)) return;
        finish();
      },
      canSkip: true,
    });
  }
}
function renderBossRelic() {
  const run = S.run;
  if (run.bossRelicAct === run.act) {
    advanceAct();
    return;
  }
  const picks = E.rollBossRelics(run);
  const sc = screenEl();
  sc.innerHTML = `<div class="center-panel screen-enter"><div class="panel" style="width:min(620px,94vw)">
    <div class="ov-title">${tr('ui.reward.bossRelicTitle')}</div>
    <div class="ov-sub">${tr('ui.reward.bossRelicSub')}</div>
    <div class="big-choices" style="flex-direction:column"></div>
  </div></div>`;
  const wrap = $('.big-choices', sc);
  let picked = false;
  const lock = () => {
    wrap.querySelectorAll('button').forEach((b) => { b.disabled = true; b.onclick = null; b.style.pointerEvents = 'none'; });
  };
  const pick = (id) => {
    if (picked) return;
    picked = true;
    lock();
    const result = E.claimBossRelic(run, id);
    if (result.already) { advanceAct(); return; }
    if (id) sfx.relic();
    else sfx.click();
    if (!requireRunSave(run, advanceAct)) return;
    advanceAct();
  };
  for (const id of picks) {
    const r = runCatalogues().relics[id];
    const b = el('button', 'relic-pick');
    b.innerHTML = `<span class="relic-chip" style="--tone:${r.tone}">${relicArt(id, 26)}</span><span><b>${r.name}</b><span class="rd">${r.text}</span></span>`;
    b.onclick = () => pick(id);
    wrap.appendChild(b);
  }
  const skip = el('button', 'btn ghost', tr('ui.reward.takeNone'));
  skip.style.marginTop = '10px';
  skip.onclick = () => pick(null);
  wrap.appendChild(skip);
}
function advanceAct() {
  const run = S.run;
  run.act++;
  run.omens.push(E.omenEnabled(run) ? E.rollOmen(run) : null); // each act climbs under its own sky
  run.nodeId = null;
  run.map = E.genMap(run);
  E.healPlayer(run, Math.round(run.player.maxHp * 0.35));
  setTheme(themeForRun(run));
  setAltitude(run.act, 0);
  runEffects.saveRun(run);
  transition('act-change');
  show('map');
  sfx.victory();
}
// the night declares itself: the omen blooms over the map on act entry
function omenBanner(run) {
  const omen = runCatalogues().omens[run.omens?.[run.act]];
  if (!omen || S.screen !== 'map') return;
  const oid = run.omens[run.act];
  const broken = oid === 'eighthOmen';
  const ou = broken ? null : assetUrl('omens', oid);
  const glyph = ou ? `<img class="ob-art" src="${ou}" alt="">` : `<span class="ob-glyph" style="color:${omen.tone}">${iconSvg(omenIconName(oid), 22)}</span>`;
  const b = el('div', `turn-banner omen-banner${broken ? ' broken-omen' : ''}`, `${glyph} OMEN — ${omen.name.toUpperCase()}<div class="ob-sub">${omen.text}</div>`);
  screenEl().appendChild(b);
  sfx.omen();
  setTimeout(() => b.remove(), 4200);
}

  return Object.freeze({ renderReward, renderBossRelic, omenBanner });
}
