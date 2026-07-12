export function createEmbarkScreen(deps) {
  const { S, E, Vigil, ASPECTS, VOWS, ROMAN, tr, runEffects, setTheme, themeForRun, heroArt, screenEl, unlock, sfx, startRun, openOverlay, closeOverlay, journalRunEnd, show } = deps;

function renderEmbark() {
  setTheme(themeForRun({ act: 0 }));
  const vigil = runEffects.syncVigil();
  const saved = E.loadRun();
  if (E.savedRunRequiresFinalisation(saved)) { startRun(saved, true); return; }
  const sel = (S.embark ||= { aspect: 0, vow: 0 });
  const hasAspects = vigil.unlocks.includes('aspect2');
  if (!hasAspects) sel.aspect = 0;
  sel.vow = Math.max(0, Math.min(sel.vow | 0, vigil.vowUnlocked));
  const aspectRow = hasAspects ? `<div class="embark-label">${tr('ui.embark.aspectLabel')}</div>
    <div class="aspect-row">${ASPECTS.map((a, i) => `
      <button class="aspect-card${sel.aspect === i ? ' on' : ''}" data-a="asp" data-i="${i}">
        <div class="asp-hero">${heroArt(i)}</div>
        <div class="asp-name">${a.name}</div>
        <div class="asp-blurb">${a.blurb}</div>
      </button>`).join('')}</div>` : '';
  const vowLine = sel.vow === 0
    ? tr('ui.embark.noVows')
    : VOWS.slice(0, sel.vow).map((v) => `<b style="color:#ff9a4d">${v.name}</b> — ${v.desc}`).join('<br>');
  const vowBlock = vigil.vowUnlocked > 0 ? `<div class="vow-block">
      <div class="vow-stepper">
        <button class="vow-btn" data-a="vow-"${sel.vow === 0 ? ' disabled' : ''}>−</button>
        <div class="vow-level">VOW ${ROMAN[sel.vow]}<span class="vow-max"> / ${ROMAN[vigil.vowUnlocked] || '0'}</span></div>
        <button class="vow-btn" data-a="vow+"${sel.vow < vigil.vowUnlocked ? '' : ' disabled'}>+</button>
      </div>
      <div class="vow-desc">${vowLine}</div>
    </div>` : '';
  const sc = screenEl();
  sc.innerHTML = `<div class="embark-screen screen-enter">
    <div class="embark-title">${tr('ui.embark.title')}</div>
    <div class="embark-sub">${hasAspects || vigil.vowUnlocked > 0 ? tr('ui.embark.subChoose') : tr('ui.embark.subWait')}</div>
    ${aspectRow}
    ${vowBlock}
    ${saved ? `<div class="embark-warn">${tr('ui.embark.warnSaved')}</div>` : ''}
    <div class="title-btns">
      <button class="btn btn-primary" data-a="begin">${saved ? tr('ui.menu.beginAnew') : tr('ui.menu.beginClimb')}</button>
      <button class="btn ghost" data-a="back">${tr('ui.menu.back')}</button>
    </div>
  </div>`;
  const beginClimb = () => {
    const v = runEffects.syncVigil(); // re-read after abandon so the next snapshot sees new reveals
    startRun(E.newRun(undefined, {
      aspect: sel.aspect,
      vow: sel.vow,
      lamplighter: Vigil.isRevealed(v, 'lamplighter'),
      monument: v.lastFall,
      unlocks: v.unlocks, // the fix: deed unlocks finally reach live pools
      reveals: Vigil.revealSnapshot(v),
      quests: Vigil.questSnapshot(v),
      shards: v.shards,
    }));
  };
  sc.onclick = (e) => {
    const t = e.target.closest('[data-a]');
    if (!t || t.disabled) return;
    const a = t.dataset.a;
    unlock(); sfx.click();
    if (a === 'asp') { sel.aspect = +t.dataset.i; renderEmbark(); }
    else if (a === 'vow-') { sel.vow = Math.max(0, sel.vow - 1); renderEmbark(); }
    else if (a === 'vow+') { sel.vow = Math.min(vigil.vowUnlocked, sel.vow + 1); renderEmbark(); }
    else if (a === 'back') show('title');
    else if (a === 'begin') {
      // Spec §3: title stays "Begin the Climb"; Begin Anew confirmation lives
      // on Embark. Abandon advances runsPlayed like confirmAbandon.
      if (!saved) { beginClimb(); return; }
      openOverlay(`<div class="panel ov-panel" style="text-align:center">
        <div class="ov-title">${tr('ui.menu.beginAnewTitle')}</div>
        <div class="ov-sub">${tr('ui.menu.beginAnewBody')}</div>
        <div class="ov-actions"><button class="btn danger" data-a="yes">${tr('ui.menu.beginAnew')}</button><button class="btn ghost" data-a="no">${tr('ui.menu.keepClimbing')}</button></div>
      </div>`, (root) => {
        root.onclick = (ev) => {
          const ans = ev.target.dataset.a;
          if (ans === 'yes') {
            const abandoned = E.loadRun();
            root.onclick = null;
            closeOverlay();
            if (!abandoned) { beginClimb(); return; }
            journalRunEnd(abandoned, 'abandon', () => {
              S.run = null;
              S.cb = null;
              beginClimb();
            });
          }
          if (ans === 'no') closeOverlay();
        };
      });
    }
  };
}

  return Object.freeze({ renderEmbark });
}
