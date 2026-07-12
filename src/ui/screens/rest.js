export function createRestScreen(deps) {
  const { S, E, CARDS, RELICS, sceneBg, rasterOr, campfireSvg, iconSvg, $, $$, show, showCardGrid, sfx, V, stageW, stageH, requireHollowRouteClear, runEffects, closeOverlay, screenEl, el, chestSvg, renderHud } = deps;

function renderRest() {
  const run = S.run;
  const canUp = run.player.deck.some((c) => !c.up && CARDS[c.id].up);
  screenEl().innerHTML = `<div class="center-panel screen-enter">${sceneBg()}<div class="panel">
    <div class="ov-title">REST SITE</div>
    <div class="art-lg">${rasterOr('props', 'campfire', campfireSvg())}</div>
    <div class="ov-sub">The fire crackles. For a moment, the Spire is quiet.</div>
    <div class="big-choices">
      <button class="btn btn-primary" data-a="rest">${iconSvg('flame', 18)} Rest <span style="font-size:13px;opacity:.8">— heal ${Math.round(run.player.maxHp * E.restHealFrac(run))} HP</span></button>
      <button class="btn" data-a="smith" ${canUp ? '' : 'disabled'}>${iconSvg('hammer', 18)} Smith <span style="font-size:13px;opacity:.8">— upgrade a card</span></button>
    </div>
  </div></div>`;
  $('[data-a="rest"]').onclick = (e) => {
    e.currentTarget.disabled = true;
    $('[data-a="smith"]').disabled = true;
    const healed = E.healPlayer(run, Math.round(run.player.maxHp * E.restHealFrac(run)));
    const finish = () => {
      sfx.heal();
      // the fire answers: a swell of warmth, embers rising off the hearth
      V.flash('#ff9a4d', 0.12, 0.8);
      V.floatText(stageW() / 2, stageH() / 2 - 40, `+${healed} HP`, 'healf');
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
    const ups = run.player.deck.filter((c) => !c.up && CARDS[c.id].up);
    showCardGrid('Upgrade a Card', ups, {
      sub: 'Forge one card into its + form.',
      pick: (inst) => {
        if (!inst) return;
        E.upgradeCardInDeck(run, inst.uid);
        const finish = () => {
          sfx.upgrade();
          V.flash('#ffe9ac', 0.12, 0.4);
          showCardGrid('Upgraded!', [run.player.deck.find((c) => c.uid === inst.uid)], { sub: 'It gleams with new power.' });
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
  const showContinue = (subHtml) => {
    const art = $('.art-lg');
    art.removeAttribute('data-a');
    art.style.cursor = '';
    art.innerHTML = rasterOr('props', 'chest-open', chestSvg(true));
    if (subHtml) $('.ov-sub').innerHTML = subHtml;
    const bc = $('.big-choices');
    bc.innerHTML = '';
    const btn = el('button', 'btn btn-primary', 'Continue');
    btn.onclick = () => { sfx.click(); show('map'); };
    bc.appendChild(btn);
    renderHud();
    runEffects.saveRun(run);
  };
  screenEl().innerHTML = `<div class="center-panel screen-enter">${sceneBg()}<div class="panel">
    <div class="ov-title">TREASURE</div>
    <div class="art-lg" style="cursor:pointer" data-a="open">${rasterOr('props', 'chest', chestSvg(false))}</div>
    <div class="ov-sub">A heavy chest, banded in gold. Open it?</div>
    <div class="big-choices"><button class="btn btn-primary" data-a="open">Open the Chest</button></div>
  </div></div>`;
  if (opened) {
    showContinue('The chest lies empty.');
    return;
  }
  const open = () => {
    if (opened) return;
    opened = true;
    $$('[data-a="open"]').forEach((b) => { b.onclick = null; b.style.pointerEvents = 'none'; });
    const result = E.claimTreasure(run, { common: 0.55, uncommon: 0.35, rare: 0.1 });
    if (result.already) {
      showContinue('The chest lies empty.');
      return;
    }
    V.flash('#ffe9ac', 0.2, 0.5);
    V.burst(stageW() / 2, stageH() / 2, { color: '#ffd97a', n: 36, speed: 380, grav: 160 });
    let sub;
    if (result.relicId) {
      sfx.relic();
      const r = RELICS[result.relicId];
      sub = `You claim <b style="color:${r.tone}">${r.name}</b> — <i>${r.text}</i>`;
    } else {
      sfx.coin();
      sub = 'Only coins remain — <b class="gold-num">+60 gold</b>.';
    }
    showContinue(sub);
  };
  $$('[data-a="open"]').forEach((b) => (b.onclick = open));
}

  return Object.freeze({ renderRest, renderTreasure });
}
