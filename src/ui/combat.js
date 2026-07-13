// SPIREBOUND combat presentation owner.
// Browser-only: the pure engine remains independent of this module.
import * as E from '../engine.js';
import {
  assetUrl, crackSvg, enemySvg, hasIcon, iconSvg, potionSvg, uiIcon, uiIconUrl,
} from '../art.js';
import {
  drawBatchSchedule, flightSchedule, pileFanAngleDeg, pileFanLayers,
  pileMasterId, pileTier,
} from '../pile-chrome.js';
import {
  energySlotStates, intentUiIds,
} from '../ui-chrome.js';
import * as V from '../vfx.js';
import { sfx, unlock } from '../audio.js';
import * as music from '../music.js';
import {
  clearOverlay, exitMapMode, freezeScene,
} from '../scene3d.js';
import {
  meshAim, meshAimClear, meshBind, meshClear, meshCrack, meshDeath,
  meshEnabled, meshFlash, meshLift, meshRelease, meshWard,
} from '../mesh.js';
import { charAim, charCssFloat, charShadowLive } from '../char-meta.js';
import {
  $, $$, COARSE, FINE, S, el, presentationBarrier, screenEl, sleep, trace,
} from './context.js';
import { contentViewFor, themeForRun } from './content.js';
import { REDUCED } from './policy.js';
import { getRoseState } from './rose.js';
import {
  aimRing, combatantView, heroArt, hudRelic, omenMark, rasterOr,
} from './assets.js';
import {
  stageH, stageInfo, stageRect, stageW, toStage,
} from '../stage.js';
import {
  bfActor, bfEnemyFootY, bfEnemyFrame, bfEnemyZOrder, bfHeroY, bfResolve,
  bfSlots,
} from '../battlefield.js';
import { relicBarLayout, uicResolve } from '../uic.js';

const runCatalogues = () => contentViewFor(S.run);

/**
 * Construct the combat presentation owner. Cross-owner operations are injected
 * so combat never imports drain, screen, navigation or index modules.
 */
export function createCombat({
  tr,
  cardEl,
  overlay,
  drain,
  late,
}) {
  if (typeof tr !== 'function' || typeof cardEl !== 'function') {
    throw new TypeError('createCombat requires tr and cardEl functions');
  }
  if (!overlay || typeof drain !== 'function' || !late) {
    throw new TypeError('createCombat requires overlay, drain and late dependencies');
  }
  const {
    openMenu,
    potionMenu,
    requireRunSave,
    showCardGrid,
    usePotionOn,
  } = overlay;
  const show = (...args) => late.show(...args);
  const transition = (...args) => late.transition(...args);

function syncWardMesh(el, on, grow = false) {
  if (!el) return;
  const sprite = el.classList?.contains('hero-sprite') || el.classList?.contains('enemy-sprite')
    ? el
    : ($('.hero-sprite, .enemy-sprite', el) || el);
  meshWard(sprite, !!on, { grow });
}

function semanticUiCheckpoint() {
  const cb = S.cb;
  const rose = getRoseState();
  return {
    screen: S.screen,
    busy: S.busy,
    queueDepth: cb?.queue?.length || 0,
    player: cb ? {
      hp: cb.player.hp, ward: cb.player.block, energy: cb.player.energy,
    } : null,
    embers: cb?.embers ?? null,
    enemies: cb ? cb.enemies.map((enemy) => ({
      key: enemy.key, variantId: enemy.variantId || 'base', hp: enemy.hp, ward: enemy.block,
    })) : [],
    hand: cb ? cb.hand.map((card) => ({ id: card.id, count: 1 })) : [],
    rose,
  };
}
// ------------------------------------------------------------ HUD
// the light economy: your HP is your lantern — stage plates darken as you
// bleed (foes / UI stay lit). Combat paints via .stage-dim under the battlefield.
function updateLantern() {
  const L = $('#lantern');
  const dim = S.screen === 'combat' ? $('.combat-screen .stage-dim') : null;
  if (!S.run || S.screen === 'title' || S.screen === 'end' || S.screen === 'lamplighter') {
    L.style.setProperty('--la', 0);
    L.classList.remove('gutter', 'snuff');
    if (dim) { dim.style.setProperty('--la', 0); dim.classList.remove('gutter'); }
    return;
  }
  const p = S.run.player;
  const hp = S.cb && !S.cb.over ? S.cb.player.hp : p.hp;
  const t = Math.max(0, Math.min(1, (0.68 - hp / p.maxHp) / 0.53));
  const la = (t * 0.82).toFixed(3);
  const lr = `${Math.round(1500 - t * 1000)}px`;
  let x = '50%', y = '55%';
  if (S.screen === 'combat' && S.ce?.hero) {
    const c = V.centerOf(S.ce.hero);
    x = `${Math.round(c.x)}px`;
    y = `${Math.round(c.y)}px`;
  }
  // keep vars on #lantern for defeat snuff; paint lives on .stage-dim in combat
  L.style.setProperty('--la', la);
  L.style.setProperty('--lr', lr);
  L.style.setProperty('--lx', x);
  L.style.setProperty('--ly', y);
  L.classList.toggle('gutter', t > 0.55 && !L.classList.contains('snuff'));
  if (dim) {
    dim.style.setProperty('--la', la);
    dim.style.setProperty('--lr', lr);
    dim.style.setProperty('--lx', x);
    dim.style.setProperty('--ly', y);
    dim.classList.toggle('gutter', t > 0.55);
  }
}
function renderHud() {
  updateLantern();
  const hud = $('#hud');
  if (!S.run || S.screen === 'title' || S.screen === 'embark' || S.screen === 'vigil' || S.screen === 'end' || S.screen === 'lamplighter') { hud.classList.remove('show'); document.body.classList.remove('low-hp'); return; }
  hud.classList.add('show');
  const p = S.run.player;
  const hp = S.cb && !S.cb.over ? S.cb.player.hp : p.hp;
  document.body.classList.toggle('low-hp', hp / p.maxHp <= 0.3);
  const theme = themeForRun(S.run);
  const act = theme;
  hud.innerHTML = `<div class="hud-bar">
      <div class="hud-hp-wrap">
        <div class="hud-stat">${uiIcon('heart', 14)} <span class="hp-num">${hp} / ${p.maxHp}</span></div>
        <div class="hud-hpbar"><div style="width:${(100 * hp) / p.maxHp}%"></div></div>
      </div>
      <div class="hud-stat">${uiIcon('coin', 14)} <span class="gold-num">${p.gold}</span></div>
      <div class="hud-mid"><b>${act.name.toUpperCase()}</b> &nbsp;·&nbsp; Floor ${S.run.floorsClimbed} &nbsp;·&nbsp; ${act.bossName}</div>
      <div class="hud-right">
        ${E.runRevealed(S.run, 'phials') ? p.potions.map((id, i) => `<button class="potion-slot ${id ? 'full' : ''}" data-slot="${i}">${id ? rasterOr('potions', id, potionSvg(runCatalogues().potions[id].tone)) : ''}</button>`).join('') : ''}
        <button class="icon-btn deck-btn" data-act="deck" aria-label="${tr('ui.hud.deckAria')}">${uiIcon('deck', 32)}<span class="deck-count">${p.deck.length}</span></button>
        <button class="icon-btn" data-act="menu" aria-label="${tr('ui.hud.menuAria')}">${uiIcon('menu', 19)}</button>
      </div>
    </div>
    <div id="omen-slot"></div>
    <div id="relicbar"></div>`;
  // omen + relics are independent UIC widgets (not scaled with .hud-bar)
  const omenSlot = $('#omen-slot', hud);
  const bar = $('#relicbar', hud);
  const omenId = S.run.omens?.[S.run.act];
  const omen = runCatalogues().omens[omenId];
  if (omen) {
    const oc = el('div', 'relic-chip omen-chip', omenMark(omenId, 'hud-omen-art', 'hud-omen-fallback', 24));
    oc.style.setProperty('--tone', omen.tone);
    oc._tip = { title: tr('ui.hud.omenTitle', { name: omen.name }), body: omen.text, sub: tr('ui.hud.omenSub', { act: S.run.act + 1 }) };
    omenSlot.appendChild(oc);
  }
  for (const rid of p.relics) {
    const r = runCatalogues().relics[rid];
    const chip = el('div', 'hud-relic', hudRelic(rid));
    chip.style.setProperty('--tone', r.tone);
    chip.dataset.relic = rid;
    chip._tip = { title: r.name, body: r.text, sub: r.rarity };
    bar.appendChild(chip);
  }
  p.potions.forEach((id, i) => {
    if (!id) return;
    const slot = $(`.potion-slot[data-slot="${i}"]`, hud);
    if (!slot) return;
    slot._tip = { title: runCatalogues().potions[id].name, body: runCatalogues().potions[id].text, sub: tr('ui.hud.potionTip') };
  });
  $('[data-act="deck"]', hud).onclick = () => { sfx.click(); showCardGrid(tr('ui.hud.deckTitle'), S.run.player.deck, { sub: tr('ui.hud.deckCount', { n: S.run.player.deck.length }) }); };
  $('[data-act="menu"]', hud).onclick = (e) => { sfx.click(); openMenu(e.clientX, e.clientY); };
  $$('.potion-slot.full', hud).forEach((slot) => (slot.onclick = (e) => potionMenu(+slot.dataset.slot, e)));
  applyUiChromeLayout();
}
function startCombatUI(enemyIds, kind) {
  exitMapMode(); // combat can start without going through show()
  clearOverlay();
  $('#tooltip').style.display = 'none';
  if (S.screen !== 'combat') transition('wipe');
  S.cb = E.startCombat(S.run, enemyIds, kind);
  S.screen = 'combat';
  const theme = themeForRun(S.run);
  music.playForCombat(kind, theme?.music, {
    questId: S.run.pendingQuestId,
    omenId: S.run.omens?.[S.run.act] ?? null,
  });
  V.setWeather(theme?.weather, { boss: kind === 'boss' });
  renderCombat();
  renderHud();
  drain().then(afterAction);
}
function renderCombat() {
  const cb = S.cb;
  const sc = screenEl();
  sc.onclick = null;
  const theme = themeForRun(S.run);
  const glow = theme?.legacyAct?.theme?.glow ?? 0x66ff9e;
  const ledge = `#${glow.toString(16).padStart(6, '0')}`;
  const plates = theme?.plates || {};
  sc.innerHTML = `<div class="combat-screen screen-enter intro" style="--ledge:${ledge}">
    ${['backdrop', 'mid', 'ledge'].map((l) => {
      const u = assetUrl('stage', plates[l]);
      return u ? `<img class="sl sl-${l}" src="${u}" alt="" aria-hidden="true">` : '';
    }).join('')}
    <div class="stage-dim" aria-hidden="true"></div>
    <div class="stage-ledge"></div>
    <div class="stage-breath b1"></div><div class="stage-breath b2"></div>
    <div class="cast-shadow-layer" aria-hidden="true"></div>
    <div class="battlefield">
      <div class="player-zone">
        <div class="top-chrome">
          <div class="status-row p-status"></div>
        </div>
        <div class="hero-wrap">
          ${heroArt(S.run.aspect)}
        </div>
        <div class="cplate">
          <div class="hpbar-wrap"><span class="block-chip zero p-block"><span class="ic">${uiIcon('ward', 28)}</span> 0</span><div class="hp-vial"><div class="hpbar"><div class="ghost"></div><div class="fill"></div></div></div><span class="hp-label p-hp"></span></div>
        </div>
      </div>
      <div class="enemy-zone"></div>
    </div>
    <div class="energy-orb" aria-label="${tr('ui.combat.energyAria')}"><div class="num">0</div><div class="candles"></div></div>
    <button class="lantern-btn"><span class="lb-ic"></span><span class="lb-count">0</span><div class="lb-pips"></div></button>
    <button class="end-turn" type="button"><span class="et-ic">${uiIcon('end-turn', 120)}</span><span class="et-lbl">${tr('ui.combat.end')}</span></button>
    <button class="pile-btn pile-draw" type="button" aria-label="${tr('ui.combat.drawPileAria')}">
      <span class="pile-stack" data-pile="draw" data-count="-1" data-tier="-1"></span>
      <span class="cnt">0</span>
      <span class="lbl">${tr('ui.combat.draw')}</span>
    </button>
    <button class="pile-btn pile-discard" type="button" aria-label="${tr('ui.combat.discardPileAria')}">
      <span class="pile-stack" data-pile="discard" data-count="-1" data-tier="-1"></span>
      <span class="cnt">0</span>
      <span class="lbl">${tr('ui.combat.discard')}</span>
    </button>
    <button class="pile-btn pile-exhaust" type="button" aria-label="${tr('ui.combat.ashesPileAria')}">
      <span class="pile-stack" data-pile="ashes" data-count="-1" data-tier="-1"></span>
      <span class="cnt">0</span>
      <span class="lbl">${tr('ui.combat.ashes')}</span>
    </button>
    <div class="hand-zone"></div>
  </div>`;
  const zone = $('.enemy-zone', sc);
  const ce = { enemies: [], root: $('.combat-screen', sc) };
  const afx = cb.affix ? runCatalogues().affixes[cb.affix] : null;
  const L = bfResolve(stageInfo().shape, S.run.act);
  const slots = bfSlots(L, cb.enemies.length);
  cb.enemies.forEach((en, i) => {
    const d = en.def || runCatalogues().enemies[en.key];
    const view = combatantView(en);
    const { size } = bfEnemyFrame(L, view.layoutKey,
      d.boss ? 'boss' : d.elite ? 'elite' : 'normal', slots[i], stageW(), stageH(), view.scale);
    const artUrl = assetUrl(view.artCategory, view.artId);
    const box = el('div', `enemy${d.elite ? ' elite-e' : ''}${d.boss ? ' boss-e' : ''}${afx ? ' affixed' : ''}`);
    if (afx) box.style.setProperty('--affix-tone', afx.tone);
    box.dataset.idx = i;
    box.dataset.baseId = en.key;
    if (en.variantId) box.dataset.variantId = en.variantId;
    box.dataset.artId = view.artId;
    if (view.tint) {
      box.style.setProperty('--variant-hue', view.tint.hue + 'deg');
      box.style.setProperty('--variant-sat', String(view.tint.saturation));
      box.style.setProperty('--variant-bright', String(view.tint.brightness));
    }
    box.style.animationDelay = `${160 + i * 130}ms`;
    box.innerHTML = `<div class="top-chrome">
        <div class="intent"></div>
        <div class="status-row"></div>
      </div>
      <div class="enemy-art" style="width:${size}px;height:${size}px"><div class="enemy-sprite">${aimRing(artUrl, 'atk')}${rasterOr(view.artCategory, view.artId, enemySvg({ ...d.art, kind: view.kind, hue: view.hue }))}<div class="vessel-fire"></div>${artUrl ? '<svg class="cracks-overlay" viewBox="0 0 200 200"><g class="cracks"></g></svg>' : ''}</div><div class="dmg-preview"></div></div>
      <div class="cplate">
        <div class="name">${afx ? `<span class="affix-name" style="color:${afx.tone}">${afx.name.toUpperCase()}</span> ` : ''}${en.name.toUpperCase()}</div>
        <div class="hpbar-wrap"><span class="block-chip zero"><span class="ic">${uiIcon('ward', 28)}</span> 0</span><div class="hp-vial"><div class="hpbar"><div class="ghost"></div><div class="fill"></div><div class="pv"></div></div></div><span class="hp-label"></span></div>
        <div class="facet-row"></div>
      </div>`;
    zone.appendChild(box);
    ce.enemies.push({
      root: box, art: $('.enemy-art', box), intent: $('.intent', box),
      topChrome: $('.top-chrome', box), cplate: $('.cplate', box),
      fill: $('.fill', box), ghost: $('.ghost', box), hp: $('.hp-label', box),
      block: $('.block-chip', box), statuses: $('.status-row', box),
      pv: $('.pv', box), prev: $('.dmg-preview', box), facets: $('.facet-row', box),
    });
    ce.enemies[i].facets._tip = {
      title: tr('ui.combat.facetsTitle'),
      body: tr('ui.combat.facetsBody'),
    };
    if (afx) $('.name', box)._tip = { title: tr('ui.combat.affixTitle', { name: afx.name }), body: afx.text };
    box.onclick = () => onEnemyClick(i);
    box.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse' && S.targeting) { box.classList.add('target-hover'); updatePreviews(); } });
    box.addEventListener('pointerleave', () => { box.classList.remove('target-hover'); updatePreviews(); });
  });
  ce.pHp = $('.p-hp', sc); ce.pFill = $('.player-zone .fill', sc); ce.pGhost = $('.player-zone .ghost', sc);
  ce.pBlock = $('.p-block', sc); ce.pStatus = $('.p-status', sc); ce.hero = $('.hero-wrap', sc);
  ce.playerZone = $('.player-zone', sc);
  ce.pTopChrome = $('.player-zone .top-chrome', sc);
  ce.pCplate = $('.player-zone .cplate', sc);
  ce.energy = $('.energy-orb', sc); ce.endTurn = $('.end-turn', sc); ce.hand = $('.hand-zone', sc);
  ce.draw = $('.pile-draw', sc); ce.discard = $('.pile-discard', sc); ce.exhaust = $('.pile-exhaust', sc);
  ce.lantern = $('.lantern-btn', sc);
  const artId = S.run.art;
  const art = runCatalogues().arts[artId];
  /* primary face = Lantern Art raster (or SVG fallback); cost lives in the tip */
  {
    const artU = artId ? assetUrl('arts', artId) : null;
    const face = artU
      ? `<img class="ui-icon" src="${artU}" width="64" height="64" alt="" draggable="false">`
      : (artId && hasIcon(`art-${artId}`) ? iconSvg(`art-${artId}`, 64) : uiIcon('lantern', 64));
    $('.lb-ic', ce.lantern).innerHTML = face;
    if (art) ce.lantern.style.color = art.tone;
  }
  ce.lantern._tip = {
    title: art ? tr('ui.combat.lanternTitleArt', { name: art.name }) : tr('ui.combat.lanternTitle'),
    body: `${art ? tr('ui.combat.lanternBodyLead', { cost: art.cost, text: art.text }) : ''}${tr('ui.combat.lanternBody')}`,
    sub: tr('ui.combat.lanternSub'),
  };
  ce.lantern.onclick = async () => {
    if (S.busy || !S.cb || S.cb.over) return;
    unlock();
    if (!await useLanternArt()) {
      ce.lantern.classList.add('nope');
      setTimeout(() => ce.lantern.classList.remove('nope'), 350);
      sfx.debuff();
    }
  };
  S.ce = ce;
  applyBattlefieldLayout(L);
  rigCombatants();
  scheduleMeshBind();
  // drop the intro class once entrances finish so intro animations don't retrigger
  const introRoot = ce.root;
  setTimeout(() => {
    if (S.screen !== 'combat' || S.ce !== ce || ce.root !== introRoot || !introRoot.isConnected) return;
    introRoot.classList.remove('intro');
    scheduleChromeClamp();
  }, 1300);
  ce.endTurn.onclick = onEndTurn;
  ce.draw.onclick = () => { sfx.click(); showCardGrid(tr('ui.combat.drawPileTitle'), cb.draw, { sub: tr('ui.combat.drawPileSub'), inCombat: true }); };
  ce.discard.onclick = () => { sfx.click(); showCardGrid(tr('ui.combat.discardPileTitle'), cb.discard, { inCombat: true }); };
  ce.exhaust.onclick = () => { sfx.click(); showCardGrid(tr('ui.combat.ashesTitle'), cb.exhaust, { sub: tr('ui.combat.ashesSub'), inCombat: true }); };
  ce.root.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.enemy') || e.target.closest('.card')) return;
    if (S.targeting) clearTargeting();
    else if (S.hoveredCard != null) { S.hoveredCard = null; layoutHand(); } // tap the stage to set the pane back down
  });
  // startCombat already queued opening draws — hide seats + restore pile chrome first
  armQueuedDrawPending(cb);
  syncCombat();
  syncHand();
}
const enemyCenter = (i) => V.centerOf(S.ce.enemies[i].art);
const heroCenter = () => V.centerOf(S.ce.hero);

// battlefield geometry comes from src/battlefield-layout.js (edit with
// ?bfedit=1 on the dev server); this applies the resolved layout to the DOM
function applyBattlefieldLayout(resolved) {
  const cb = S.cb, ce = S.ce;
  if (!cb || !ce || S.screen !== 'combat') return;
  const L = resolved ?? bfResolve(stageInfo().shape, S.run.act);
  ce.root.style.setProperty('--ground-y', `${L.groundY}px`);
  ce.root.style.setProperty('--ledge-lip', `${L.ledgeLip}px`);
  for (const name of ['backdrop', 'mid', 'ledge']) {
    const img = ce.root.querySelector(`.sl-${name}`);
    if (!img) continue;
    const p = L.layers[name];
    img.style.height = `${p.h}px`;
    img.style.left = p.x ? `calc(50% + ${p.x}px)` : '';
    img.style.bottom = name === 'ledge'
      ? `${Math.max(0, L.groundY + L.ledgeLip - p.h + p.y)}px`
      : `${p.y}px`;
    img.style.opacity = p.opacity;
    img.style.scale = p.zoom === 1 ? '' : String(p.zoom);
    img.style.objectPosition = `${p.posX}% ${p.posY}%`;
    img.style.setProperty('--amp', `${p.drift}px`); // idle parallax amplitude (0 = still)
  }
  const hero = bfActor('heroes', runCatalogues().aspects[S.run.aspect].id);
  const hw = Math.round(L.hero.w * hero.scale), hh = Math.round(L.hero.h * hero.scale);
  const pz = ce.root.querySelector('.player-zone');
  pz.style.width = `${hw}px`;
  pz.style.height = `${hh}px`;
  pz.style.left = `${Math.round(L.hero.x - hw / 2)}px`;
  pz.style.bottom = `${bfHeroY(L) + hero.footY}px`; // layout y + art feet offset
  const slots = bfSlots(L, cb.enemies.length);
  const keys = cb.enemies.map((en) => combatantView(en).layoutKey);
  const zOrder = bfEnemyZOrder(slots, keys);
  cb.enemies.forEach((en, i) => {
    const d = en.def || runCatalogues().enemies[en.key];
    const view = combatantView(en);
    const tier = d.boss ? 'boss' : d.elite ? 'elite' : 'normal';
    const frame = bfEnemyFrame(L, view.layoutKey, tier, slots[i], stageW(), stageH(), view.scale);
    const { size } = frame;
    const box = ce.enemies[i].root;
    box.style.left = `${frame.left}px`;
    box.style.bottom = `${frame.bottom}px`;
    box.style.width = box.style.height = `${size}px`;
    box.style.zIndex = String(zOrder[i]);
    ce.enemies[i].art.style.width = ce.enemies[i].art.style.height = `${size}px`;
  });
  clampCombatChrome();
  applyUiChromeLayout();
}

/** Apply resolved UIC (stage px, safe-area baked) to combat chrome nodes. */
function applyUiChromeLayout() {
  const L = uicResolve(stageInfo().shape);
  const hud = $('#hud .hud-bar');
  if (hud && L.hud) {
    hud.style.height = `${L.hud.height}px`;
    hud.style.transformOrigin = 'top center';
    hud.style.transform = L.hud.scale === 1 ? '' : `scale(${L.hud.scale})`;
  }
  const placeTop = (el, w) => {
    if (!el || !w) return;
    if (w.left !== undefined) { el.style.left = `${w.left}px`; el.style.right = ''; }
    else if (w.right !== undefined) { el.style.right = `${w.right}px`; el.style.left = ''; }
    if (w.top !== undefined) el.style.top = `${w.top}px`;
    const s = w.scale ?? 1;
    el.style.transformOrigin = w.left !== undefined ? 'top left' : 'top right';
    el.style.transform = s === 1 ? '' : `scale(${s})`;
  };
  const omenEl = $('#omen-slot');
  const relicEl = $('#relicbar');
  const hasOmen = !!(omenEl && omenEl.childElementCount);
  placeTop(omenEl, L.omen);
  placeTop(relicEl, relicBarLayout(L, hasOmen));
  if (!S.ce || S.screen !== 'combat') return;
  const place = (el, w) => {
    if (!el || !w) return;
    if (w.left !== undefined) { el.style.left = `${w.left}px`; el.style.right = ''; }
    else if (w.right !== undefined) { el.style.right = `${w.right}px`; el.style.left = ''; }
    if (w.bottom !== undefined) el.style.bottom = `${w.bottom}px`;
    if (w.w !== undefined) el.style.width = `${w.w}px`;
    if (w.h !== undefined) el.style.height = `${w.h}px`;
  };
  place(S.ce.energy, L.energy);
  place(S.ce.lantern, L.lantern);
  place(S.ce.endTurn, L.endTurn);
  place(S.ce.draw, L.draw);
  place(S.ce.discard, L.discard);
  place(S.ce.exhaust, L.ashes);
  if (S.ce.hand && L.hand) applyHandZoneLayout(L.hand);
}

/** Hand left/right = offset from stage-centred fan box (0 = centred). Width hugs cards. */
function handZoneWidth(n, stageW, cardW) {
  const count = Math.max(1, n | 0);
  const gap = Math.min(112, 640 / count, (stageW - 246) / Math.max(count - 1, 1));
  const span = count <= 1 ? cardW : (count - 1) * gap + cardW;
  return Math.min(stageW - 24, Math.max(cardW + 16, Math.ceil(span + 20)));
}

function handZoneLeftEdge(h, width, stageW) {
  const center = (stageW - width) / 2;
  if (h.left !== undefined) return Math.round(center + h.left);
  return Math.round(center - (h.right ?? 0));
}

function applyHandZoneLayout(h) {
  const zone = S.ce?.hand;
  if (!zone || !h) return;
  const stg = stageInfo();
  zone.style.setProperty('--hand-scale', String(h.scale ?? 1));
  const visible = S.cb?.hand
    ? S.cb.hand.filter((c) => {
      const el = zone.querySelector(`.card[data-uid="${c.uid}"]`);
      return el && !el.classList.contains('draw-pending');
    }).length
    : 0;
  const n = visible || 5;
  const cardW = handFaceSize().w;
  const width = handZoneWidth(n, stg.w, cardW);
  const left = handZoneLeftEdge(h, width, stg.w);
  zone.style.width = `${width}px`;
  zone.style.left = `${left}px`;
  zone.style.right = 'auto';
  zone.style.marginLeft = '0';
  if (h.bottom !== undefined) zone.style.bottom = `${h.bottom}px`;
}

/** Resting hand-fan top (stage Y). Static on purpose: live card tops jump when
 *  a pane lifts on hover or flies toward cast, and that used to yank foe/hero
 *  HP plates up and down. Slack lets chrome sit ~50px into the upper hand band
 *  — resting cards leave empty stage there. */
function handChromeCeiling() {
  const hand = S.ce?.hand;
  const sz = handFaceSize();
  const inset = handCardBottomInset();
  const slack = 50;
  if (hand) {
    const zr = stageRect(hand);
    if (zr.height > 2) return zr.bottom - inset - sz.h + slack;
  }
  return stageH() - inset - sz.h + slack;
}

/**
 * Keep combat chrome on-stage: tall sprites push top chrome down into the art;
 * bottom plate (name/HP/facets) stays above a fixed resting-hand floor.
 * Top clearance sits under the HUD menu bar (not the stage edge).
 */
function clampCombatChrome() {
  const ce = S.ce;
  if (!ce || S.screen !== 'combat') return;
  const hudBar = $('#hud.show .hud-bar') || $('#hud .hud-bar');
  const hudBottom = hudBar ? stageRect(hudBar).bottom : 0;
  const marginTop = Math.max(6, Math.round(hudBottom) + 4);
  const maxBottom = handChromeCeiling() - 4;
  const minLeft = 6;
  const maxRight = stageW() - 6;
  const clampHorizontal = (el) => {
    if (!el) return;
    el.style.setProperty('--chrome-dx', '0px');
    const r = stageRect(el);
    if (r.width <= 1) return;
    const dx = r.left < minLeft ? minLeft - r.left : r.right > maxRight ? maxRight - r.right : 0;
    if (dx) el.style.setProperty('--chrome-dx', `${Math.round(dx)}px`);
  };
  const clampOne = (topEl, plateEl) => {
    if (topEl) {
      topEl.style.setProperty('--chrome-dy', '0px');
      const r = stageRect(topEl);
      if (r.height > 1 && r.top < marginTop) {
        topEl.style.setProperty('--chrome-dy', `${Math.round(marginTop - r.top)}px`);
      }
      clampHorizontal(topEl);
    }
    if (plateEl) {
      plateEl.style.setProperty('--chrome-dy', '0px');
      const r = stageRect(plateEl);
      if (r.height > 1 && r.bottom > maxBottom) {
        plateEl.style.setProperty('--chrome-dy', `${Math.round(maxBottom - r.bottom)}px`);
      }
      clampHorizontal(plateEl);
    }
  };
  for (const x of ce.enemies) clampOne(x.topChrome, x.cplate);
  clampOne(ce.pTopChrome, ce.pCplate);

  // Cramped formations can put independently edge-clamped chrome on top of
  // one another. Keep authored actors in place and separate enemy chrome in
  // DOM order with minimal displacement from each plate's natural (under-foe)
  // left — only shift the whole row to clear the hero / stage edges. Never
  // slam the row to the right margin: that detaches HP bars from foes on
  // wide stages. Dead members stay in each set so killing one cannot move
  // survivors. Top and bottom chrome are independent rows.
  const gap = 6;
  const bottomVisible =
    '.name,.hpbar-wrap,.block-chip,.block-chip .ic,.block-chip .ui-icon,' +
    '.block-chip .gicon,.hp-vial,.hp-label,.facet-row';
  const topVisible =
    '.intent,.intent .ic,.intent .ui-icon,.intent .gicon,.intent .num,' +
    '.status-row,.schip,.schip-art,.schip .n';
  const visibleRect = (root, selector, remember = false) => {
    const anchor = stageRect(root);
    const nodes = [root, ...root.querySelectorAll(selector)];
    const rs = nodes.map((node) => stageRect(node)).filter((r) => r.width > 0 && r.height > 0);
    if (!rs.length) {
      const saved = remember && root._combatChromeVisibleBox;
      if (!saved) return anchor;
      const centre = (anchor.left + anchor.right) / 2;
      return {
        left: centre + saved.left,
        right: centre + saved.right,
        top: anchor.bottom + saved.top,
        bottom: anchor.bottom + saved.bottom,
        width: saved.right - saved.left,
        height: saved.bottom - saved.top,
      };
    }
    const rect = {
      left: Math.min(...rs.map((r) => r.left)),
      right: Math.max(...rs.map((r) => r.right)),
      top: Math.min(...rs.map((r) => r.top)),
      bottom: Math.max(...rs.map((r) => r.bottom)),
      width: Math.max(...rs.map((r) => r.right)) - Math.min(...rs.map((r) => r.left)),
      height: Math.max(...rs.map((r) => r.bottom)) - Math.min(...rs.map((r) => r.top)),
    };
    if (remember) {
      const centre = (anchor.left + anchor.right) / 2;
      root._combatChromeVisibleBox = {
        left: rect.left - centre,
        right: rect.right - centre,
        top: rect.top - anchor.bottom,
        bottom: rect.bottom - anchor.bottom,
      };
    }
    return rect;
  };
  const overlaps2D = (a, b) => a.left < b.right && b.left < a.right &&
    a.top < b.bottom && b.top < a.bottom;
  const overlapsVertically = (a, b) => a.top < b.bottom && b.top < a.bottom;
  const pack = (elements, selector, heroEl, remember = false) => {
    const rects = elements.map((el) => visibleRect(el, selector, remember));
    const heroRect = heroEl ? visibleRect(heroEl, selector) : null;
    const hasCollision = rects.some((r, i) =>
      rects.slice(i + 1).some((other) => overlaps2D(r, other)));
    const hitsHero = heroRect && rects.some((r) => overlaps2D(heroRect, r));
    if (!elements.length || (!hasCollision && !hitsHero)) return;
    const packedWidth = rects.reduce((sum, r) => sum + r.width, 0) + gap * (rects.length - 1);
    const heroSharesRows = heroRect && rects.some((r) => overlapsVertically(heroRect, r));
    const packedMinLeft = heroSharesRows ? Math.max(minLeft, heroRect.right + gap) : minLeft;
    if (packedMinLeft + packedWidth > maxRight) return; // cannot resolve without overlap
    // Separate L→R from natural lefts (already edge-clamped), then slide the
    // whole row only as far as needed to clear hero / right margin.
    const targets = [];
    let cursor = -Infinity;
    for (let i = 0; i < rects.length; i++) {
      const left = Math.max(rects[i].left, cursor);
      targets.push(left);
      cursor = left + rects[i].width + gap;
    }
    if (targets[0] < packedMinLeft) {
      const shift = packedMinLeft - targets[0];
      for (let i = 0; i < targets.length; i++) targets[i] += shift;
    }
    const overflow = targets[targets.length - 1] + rects[rects.length - 1].width - maxRight;
    if (overflow > 0) {
      for (let i = 0; i < targets.length; i++) targets[i] -= overflow;
    }
    if (targets[0] < packedMinLeft) return; // still cannot fit after right pull-back
    elements.forEach((el, i) => {
      const currentDx = Number.parseFloat(el.style.getPropertyValue('--chrome-dx')) || 0;
      el.style.setProperty('--chrome-dx', `${Math.round(currentDx + targets[i] - rects[i].left)}px`);
    });
  };
  pack(ce.enemies.map((x) => x.cplate).filter(Boolean), bottomVisible, ce.pCplate);
  pack(ce.enemies.map((x) => x.topChrome).filter(Boolean), topVisible, ce.pTopChrome, true);
}

let chromeClampRaf = 0;
function scheduleChromeClamp() {
  if (chromeClampRaf) return;
  chromeClampRaf = requestAnimationFrame(() => {
    chromeClampRaf = 0;
    clampCombatChrome();
  });
}

function refitCombat() {
  applyBattlefieldLayout();
  layoutHand();
  scheduleChromeClamp();
  scheduleMeshBind();
}
function statusChips(container, statuses, isPlayer) {
  container.innerHTML = '';
  for (const [id, n] of Object.entries(statuses)) {
    if (!n) continue;
    const info = runCatalogues().statuses[id] || { name: id, icon: '?', kind: 'buff', desc: '' };
    const kind = id === 'str' && n < 0 ? 'debuff' : info.kind;
    const u = assetUrl('statuses', id);
    const art = u
      ? `<img class="schip-art" src="${u}" alt="">`
      : (hasIcon(`st-${id}`) ? iconSvg(`st-${id}`, 32) : info.icon);
    const count = Math.abs(n) >= 2 ? `<span class="n">${n}</span>` : '';
    const chip = el('span', `schip ${kind}`, `${art}${count}`);
    chip._tip = { title: info.name, body: info.desc.replace(/\bN\b/g, Math.abs(n)), sub: kind === 'debuff' ? tr('ui.combat.debuff') : tr('ui.combat.buff') };
    container.appendChild(chip);
  }
}
function intentFor(e) {
  const cb = S.cb;
  const mv = E.enemyMove(e);
  const p = E.previewEnemyDmg(S.run, cb, e);
  const ids = intentUiIds(mv.intent);
  let icon = ids.map((id, i) => uiIcon(id, i === 0 ? 38 : 28)).join('');
  let txt = '';
  if (mv.intent.startsWith('attack')) {
    txt = p.times > 1 ? `${p.dmg}×${p.times}` : `${p.dmg}`;
  }
  const tipBits = [];
  if (p) tipBits.push(`attack for <b>${p.dmg}${p.times > 1 ? `×${p.times}` : ''}</b>`);
  if (mv.block) tipBits.push('gain Ward');
  if (mv.heal) tipBits.push('heal itself');
  if (mv.fx?.some((f) => f.who === 'player')) tipBits.push('afflict you');
  if (mv.fx?.some((f) => f.who !== 'player')) tipBits.push('empower');
  if (mv.addCards) tipBits.push(`add ${mv.addCards.n} ${runCatalogues().cards[mv.addCards.id].name}s to your discard`);
  return { icon, txt, tip: { title: mv.name, body: `Intends to ${tipBits.join(', ') || 'act'}.` } };
}
// the facet gauge: glass chip rasters (CSS diamond fallback); text once boss glass past a row
function facetPips(en, ghost = 0) {
  // Display mapping is swapped vs asset filenames: empty/intact → facet-chipped PNG,
  // filled/chipped → facet-empty PNG. CSS .filled red outline stays on game state.
  if (en.facetMax > 8) {
    return `<span class="pipnum">${uiIcon('facet-empty', 11)} ${en.chips}${ghost ? `<i>+${ghost}</i>` : ''}/${en.facetMax}</span>`;
  }
  const emptyU = uiIconUrl('facet-chipped');
  const chipU = uiIconUrl('facet-empty');
  let h = '';
  for (let i = 0; i < en.facetMax; i++) {
    const filled = i < en.chips;
    const will = !filled && i < en.chips + ghost;
    const cls = `pip${filled ? ' filled' : ''}${will ? ' willchip' : ''}`;
    if (emptyU || chipU) {
      const src = filled || will ? (chipU || emptyU) : (emptyU || chipU);
      h += `<span class="${cls}"><img class="ui-icon facet-img" src="${src}" alt="" draggable="false"></span>`;
    } else {
      h += `<span class="${cls}"></span>`;
    }
  }
  return h;
}
function syncCombat() {
  const cb = S.cb, ce = S.ce;
  if (!ce) return;
  cb.enemies.forEach((en, i) => {
    const x = ce.enemies[i];
    const pct = `${(100 * Math.max(0, en.hp)) / en.maxHp}%`;
    x.fill.style.width = pct;
    x.ghost.style.width = pct;
    x.hp.textContent = `${Math.max(0, en.hp)}/${en.maxHp}`;
    x.block.classList.toggle('zero', en.block <= 0);
    x.block.innerHTML = `<span class="ic">${uiIcon('ward', 28)}</span> ${en.block}`;
    x.art.classList.toggle('warded', en.block > 0);
    // Ward ON is owned by blockGain (animated grow). syncCombat only fades when block hits 0 —
    // otherwise an earlier sync in the same drain wave snaps the shell on before blockGain runs.
    if (en.block <= 0) syncWardMesh(x.art, false);
    x.root.classList.toggle('lowhp', en.hp > 0 && en.hp / en.maxHp <= 0.3);
    statusChips(x.statuses, en.statuses, false);
    if (en.hp > 0) x.facets.innerHTML = facetPips(en);
    else x.facets.innerHTML = '';
    // the death rite (case 'die') owns the alive→dying→gone exit; only re-assert
    // the hidden corpse here once that rite has finished, so a sync fired by the
    // killing hit can't blank the body out before it staggers and shatters
    if (en.hp <= 0 && x.reaped) x.root.classList.add('gone');
    if (en.hp > 0 && en.flags.staggered) {
      x.intent.className = 'intent i-staggered';
      x.intent.innerHTML = `<span class="ic">${iconSvg('stagger', 38)}</span><span class="num">${tr('ui.combat.staggered')}</span>`;
      x.intent._tip = { title: tr('ui.combat.staggeredTipTitle'), body: tr('ui.combat.staggeredTipBody') };
    } else if (en.hp > 0 && en.moveKey) {
      const it = intentFor(en);
      x.intent.className = `intent i-${E.enemyMove(en).intent}`;
      x.intent.innerHTML = it.txt
        ? `<span class="ic">${it.icon}</span><span class="num">${it.txt}</span>`
        : `<span class="ic">${it.icon}</span>`;
      x.intent._tip = it.tip;
    } else x.intent.innerHTML = '';
  });
  // the lantern: ember count + a ring of sparks; glows when its Art can answer
  if (ce.lantern) {
    $('.lb-count', ce.lantern).textContent = cb.embers;
    /* ember pips arc around the arts face via --a */
    $('.lb-pips', ce.lantern).innerHTML = Array.from({ length: cb.emberCap }, (_, i) =>
      `<span class="lbp${i < cb.embers ? ' lit' : ''}" style="--a:${Math.round((i / (cb.emberCap - 1)) * 280 - 140)}deg"></span>`).join('');
    ce.lantern.classList.toggle('unlit', cb.embers === 0);
    ce.lantern.classList.toggle('ready', E.canUseArt(S.run, cb));
    ce.lantern.classList.toggle('art-spent', cb.artUsedTurn === cb.turn && !cb.over);
  }
  const P = cb.player;
  const pct = `${(100 * Math.max(0, P.hp)) / P.maxHp}%`;
  ce.pFill.style.width = pct;
  ce.pGhost.style.width = pct;
  ce.pHp.textContent = `${Math.max(0, P.hp)}/${P.maxHp}`;
  ce.pBlock.classList.toggle('zero', P.block <= 0);
  ce.pBlock.innerHTML = `<span class="ic">${uiIcon('ward', 28)}</span> ${P.block}`;
  ce.hero.classList.toggle('warded', P.block > 0);
  // Ward ON is owned by blockGain (animated grow). syncCombat only fades when block hits 0.
  if (P.block <= 0) syncWardMesh(ce.hero, false);
  ce.hero.classList.toggle('lowhp', P.hp / P.maxHp <= 0.3);
  statusChips(ce.pStatus, P.statuses, true);
  $('.num', ce.energy).textContent = P.energy;
  ce.energy.classList.toggle('spent', P.energy === 0);
  // candles out → End beckons (same ready language as the lantern Art)
  ce.endTurn.classList.toggle('ready', P.energy === 0 && !cb.over && !S.busy);
  const cd = $('.candles', ce.energy);
  const states = energySlotStates(P.energy, P.energyMax);
  const litUrl = uiIconUrl('candle-lit');
  const spentUrl = uiIconUrl('candle-spent');
  const same = cd.children.length === states.length
    && [...cd.children].every((el, i) => el.dataset.state === states[i]);
  if (!same) {
    cd.innerHTML = states.map((st) => {
      const url = st === 'lit' ? litUrl : spentUrl;
      const litCls = st === 'lit' ? ' lit' : '';
      if (url) {
        return `<span class="candle is-${st}${litCls}" data-state="${st}"><img class="ui-icon candle-img" src="${url}" alt="" draggable="false"></span>`;
      }
      return `<span class="candle${litCls} is-${st}" data-state="${st}"></span>`;
    }).join('');
  } else {
    [...cd.children].forEach((c, i) => {
      const st = states[i];
      c.dataset.state = st;
      c.classList.toggle('lit', st === 'lit');
      c.classList.toggle('is-lit', st === 'lit');
      c.classList.toggle('is-spent', st === 'spent');
      const img = c.querySelector('.candle-img');
      if (img) {
        const url = st === 'lit' ? litUrl : spentUrl;
        if (url && img.getAttribute('src') !== url) img.setAttribute('src', url);
      }
    });
  }
  syncPileWidgets(cb);
  scheduleChromeClamp();
}
function syncPileWidgets(cb) {
  const ce = S.ce;
  if (!ce) return;
  const ov = pileVisualOverride || {};
  const map = [
    [ce.draw, 'draw', ov.draw != null ? ov.draw : Math.max(0, cb.draw.length - (pileVisualHold.draw || 0))],
    [ce.discard, 'discard', ov.discard != null ? ov.discard : Math.max(0, cb.discard.length - (pileVisualHold.discard || 0))],
    [ce.exhaust, 'ashes', Math.max(0, cb.exhaust.length - (pileVisualHold.ashes || 0))],
  ];
  for (const [btn, pile, n] of map) {
    if (!btn) continue;
    const tier = pileTier(n);
    const layers = pileFanLayers(n);
    const stack = btn.querySelector('.pile-stack');
    btn.classList.toggle('is-empty', n === 0);
    $('.cnt', btn).textContent = n;
    if (!stack) continue;
    if (Number(stack.dataset.count) === n) continue;
    stack.dataset.count = String(n);
    stack.dataset.tier = String(tier);
    const url = assetUrl('piles', pileMasterId(pile));
    stack.replaceChildren();
    stack.classList.toggle('is-empty', layers === 0);
    if (!url) {
      // glass label+count stay usable when a master PNG is missing
      stack.classList.add('pile-stack-fallback');
      continue;
    }
    stack.classList.remove('pile-stack-fallback');
    // Flat fan: prefer 5°/card, average down so whole span ≤30°; count is SoT.
    for (let i = 0; i < layers; i++) {
      const img = document.createElement('img');
      img.src = url;
      img.alt = '';
      img.className = 'pile-layer';
      img.style.setProperty('--rot', `${pileFanAngleDeg(i, layers)}deg`);
      stack.appendChild(img);
    }
  }
}

/** Cards already in engine piles but still in flight — hide until ceremony lands. */
const pileVisualHold = { draw: 0, discard: 0, ashes: 0 };
/** Mid-wave chrome override (draw/discard) while engine is already at post-draw state. */
let pileVisualOverride = null;
function holdPileVisual(pile, n = 1) {
  if (!pileVisualHold[pile]) pileVisualHold[pile] = 0;
  pileVisualHold[pile] += Math.max(0, n | 0);
}
function releasePileVisual(pile, n = 1) {
  pileVisualHold[pile] = Math.max(0, (pileVisualHold[pile] || 0) - Math.max(0, n | 0));
}
/** Engine already queued destination events; hold those piles through mid-play syncs. */
function holdPendingPileArrivals(cb, uid) {
  for (const e of cb.queue) {
    if (e.uid == null || String(e.uid) !== String(uid)) continue;
    if (e.t === 'toDiscard') holdPileVisual('discard', 1);
    if (e.t === 'exhaust') holdPileVisual('ashes', 1);
  }
}
/** uid → ms from batch start when that hand seat should appear (matches flyer land). */
const drawRevealPlan = new Map();

/** Peek draw/reshuffle segments without consuming the queue (combat-enter paint). */
function peekDrawWaveSegments(queue) {
  const segments = [];
  let i = 0;
  while (i < queue.length && (queue[i].t === 'draw' || queue[i].t === 'reshuffle')) {
    if (queue[i].t === 'reshuffle') {
      segments.push({ t: 'reshuffle', ev: queue[i] });
      i++;
    } else {
      const draws = [];
      while (i < queue.length && queue[i].t === 'draw') draws.push(queue[i++]);
      segments.push({ t: 'draws', draws });
    }
  }
  return segments;
}

/** Before first drain: hide hand seats + restore pile chrome for queued opening draws. */
function armQueuedDrawPending(cb) {
  if (REDUCED || !cb?.queue?.length) return;
  const segments = peekDrawWaveSegments(cb.queue);
  if (!segments.length) return;
  const reshuffle = segments.find((s) => s.t === 'reshuffle');
  const firstSegDraws = segments[0]?.t === 'draws' ? segments[0].draws.length : 0;
  pileVisualOverride = {
    draw: segments[0]?.t === 'draws'
      ? (reshuffle ? firstSegDraws : cb.draw.length + firstSegDraws)
      : 0,
    discard: reshuffle ? (reshuffle.ev.n || 0) : 0,
  };
  let seq = 0;
  for (const seg of segments) {
    if (seg.t !== 'draws') continue;
    for (const ev of seg.draws) {
      const uid = String(ev.uid);
      if (!drawRevealPlan.has(uid)) drawRevealPlan.set(uid, { landAt: null, seq: seq++ });
    }
  }
}

function pendingPileCeremonyUids(cb) {
  const keep = new Set();
  for (const ev of cb.queue) {
    if ((ev.t === 'toDiscard' || ev.t === 'exhaust' || ev.t === 'powerConsumed') && ev.uid != null) {
      keep.add(String(ev.uid));
    }
  }
  return keep;
}
function scheduleHandReveal(c, landAt) {
  setTimeout(() => {
    if (!c.isConnected) return;
    c.classList.remove('draw-pending');
    c.classList.add('draw-in');
    layoutHand();
    setTimeout(() => c.classList.remove('draw-in'), 240);
  }, landAt);
}
function syncHand() {
  const cb = S.cb, ce = S.ce;
  if (!ce) return;
  const wrap = ce.hand;
  const have = new Map($$('.card', wrap).map((c) => [c.dataset.uid, c]));
  const want = new Set(cb.hand.map((c) => String(c.uid)));
  // draw mid-play can syncHand before toDiscard/exhaust flies — keep those DOM nodes
  const pending = pendingPileCeremonyUids(cb);
  for (const [uid, elc] of have) if (!want.has(uid) && !pending.has(uid)) elc.remove();
  for (const inst of cb.hand) {
    if (!have.has(String(inst.uid))) {
      const c = cardEl(inst, { inCombat: true });
      // Invisible until matching draw flyer lands — plan OR still-queued draw event
      const uid = String(inst.uid);
      const plan = drawRevealPlan.get(uid);
      const queuedDraw = cb.queue.some((e) => e.t === 'draw' && String(e.uid) === uid);
      if (!REDUCED && (plan != null || queuedDraw)) {
        if (typeof plan === 'object' && plan?.seq != null) c.dataset.drawSeq = String(plan.seq);
        c.classList.add('draw-pending');
        const landAt = plan == null ? null : (typeof plan === 'number' ? plan : plan.landAt);
        if (landAt != null) {
          drawRevealPlan.delete(uid);
          scheduleHandReveal(c, landAt);
        }
        // landAt null / queued only: stay pending until draw-wave segment arms the timer
      }
      c.onclick = (e) => { e.stopPropagation(); onCardClick(inst.uid); };
      if (FINE) {
        c.onmouseenter = () => { S.hoveredCard = inst.uid; sfx.hover(); layoutHand(); };
        c.onmouseleave = () => { if (S.hoveredCard === inst.uid) S.hoveredCard = null; layoutHand(); };
      }
      bindCardDrag(c, inst.uid);
      wrap.appendChild(c);
    } else {
      // refresh cost/text (str/dex/duskmirror can change display)
      const fresh = cardEl(inst, { inCombat: true });
      const old = have.get(String(inst.uid));
      const keep = ['armed', 'draw-pending', 'draw-in', 'lifted', 'dragging', 'will-cast', 'will-burn', 'played-up']
        .filter((k) => old.classList.contains(k));
      old.replaceChildren(...fresh.childNodes);
      old.className = [fresh.className, ...keep].filter(Boolean).join(' ');
      old.onclick = (e) => { e.stopPropagation(); onCardClick(inst.uid); };
      if (FINE) {
        old.onmouseenter = () => { S.hoveredCard = inst.uid; layoutHand(); };
        old.onmouseleave = () => { if (S.hoveredCard === inst.uid) S.hoveredCard = null; layoutHand(); };
      }
    }
  }
  layoutHand();
}
function layoutHand() {
  const cb = S.cb, ce = S.ce;
  if (!ce) return;
  const cards = cb.hand.map((c) => String(c.uid));
  const els = new Map($$('.card', ce.hand).map((c) => [c.dataset.uid, c]));
  // Fan only seats already revealed — pending draws stay centred until their flyer lands
  const fan = cards.filter((uid) => {
    const c = els.get(uid);
    return c && !c.classList.contains('draw-pending');
  });
  const n = fan.length;
  const gap = Math.min(112, 640 / Math.max(n, 1), (stageW() - 246) / Math.max(n - 1, 1));
  cards.forEach((uid) => {
    const c = els.get(uid);
    if (!c) return;
    const inst = cb.hand.find((h) => String(h.uid) === uid);
    if (!inst) return;
    const d = E.cardData(inst, S.run);
    const playableNow = !d.unplayable && (E.effCost(S.run, cb, inst) ?? 99) <= cb.player.energy;
    c.classList.toggle('unplayable-now', !playableNow);
    const armed = S.targeting?.kind === 'card' && String(S.targeting.uid) === uid;
    const hovered = S.hoveredCard != null && String(S.hoveredCard) === uid;
    c.classList.toggle('armed', armed);
    c.classList.toggle('lifted', hovered && !S.busy && !armed);
    if (c.classList.contains('draw-pending')) {
      c.style.transform = 'translateX(-50%) translateY(26px) rotate(0deg)';
      c.style.zIndex = 15;
      return;
    }
    const i = fan.indexOf(uid);
    const rot = n > 1 ? (i - (n - 1) / 2) * Math.min(5, 42 / n) : 0;
    const x = (i - (n - 1) / 2) * gap;
    const y = Math.abs(rot) * 3.2;
    c.style.transform = `translateX(calc(-50% + ${armed ? x * 0.4 : x}px)) translateY(${y + 26}px) rotate(${armed ? rot * 0.5 : rot}deg)`;
    c.style.zIndex = hovered || armed ? 40 : 20 + i;
  });
  const Lh = uicResolve(stageInfo().shape).hand;
  if (Lh) applyHandZoneLayout(Lh);
  updatePreviews();
  scheduleChromeClamp();
}
// ---- drag-to-play: press a pane, drag it up, the arc springs from your hand;
// release on a foe to strike, release low to think better of it. One motion.
let dragConsumedAt = 0;
function bindCardDrag(c, uid) {
  c.addEventListener('pointerdown', (e) => {
    if (S.busy || !S.cb || S.cb.over || !e.isPrimary || S.drag) return;
    S.drag = { uid, id: e.pointerId, x0: e.clientX, y0: e.clientY, live: false, free: false };
    try { c.setPointerCapture(e.pointerId); } catch { /* card may vanish mid-gesture */ }
  });
  c.addEventListener('pointermove', (e) => {
    const st = S.drag;
    if (!st || st.uid !== uid || e.pointerId !== st.id) return;
    if (!st.live) {
      if (st.y0 - e.clientY > 26) beginCardDrag(st, c);
      return;
    }
    if (st.free) {
      const p = toStage(e.clientX, e.clientY);
      const zr = S.ce?.hand ? stageRect(S.ce.hand) : null;
      const cx = zr && zr.width > 2 ? zr.left + zr.width / 2 : stageW() / 2;
      c.style.transform = `translate(calc(-50% + ${p.x - cx}px), ${p.y - stageH() + 130}px) scale(1.12)`;
      const overL = !!underPointer(e.clientX, e.clientY)?.closest('.lantern-btn');
      c.classList.toggle('will-burn', overL);
      c.classList.toggle('will-cast', !st.kindleOnly && !overL && p.y < castLine());
    } else {
      aimMove(e);
      hoverEnemyAt(e.clientX, e.clientY);
    }
  });
  const finish = (e, cancelled) => {
    const st = S.drag;
    if (!st || st.uid !== uid || e.pointerId !== st.id) return;
    // Capture last on-screen seat (incl. free-drag transform) before chrome resets
    if (!cancelled && st.live) captureCardAnchor(uid, c, { fromDrag: true });
    S.drag = null;
    if (!st.live) return;
    dragConsumedAt = performance.now();
    c.classList.remove('dragging', 'will-cast', 'will-burn');
    S.ce?.lantern?.classList.remove('kindle-target');
    if (cancelled) {
      st.traceSpan?.finish('cancelled', { reason: 'pointer-cancelled' });
      clearTargeting(); layoutHand(); return;
    }
    // the lantern is always listening: release a card on it to kindle
    const overLantern = underPointer(e.clientX, e.clientY)?.closest('.lantern-btn');
    if (overLantern) {
      const inst = S.cb.hand.find((x) => x.uid === uid);
      if (inst && E.canKindle(S.run, S.cb, inst)) {
        st.traceSpan?.finish('completed', { reason: 'kindled' });
        clearTargeting(); doKindle(uid); return;
      }
      st.traceSpan?.finish('cancelled', { reason: 'invalid-lantern-drop' });
      clearTargeting(); layoutHand(); return;
    }
    if (st.kindleOnly) {
      st.traceSpan?.finish('cancelled', { reason: 'kindle-only-drop' });
      S.hoveredCard = null; layoutHand(); return;
    } // nowhere else to go
    if (st.free) {
      if (toStage(e.clientX, e.clientY).y < castLine()) {
        st.traceSpan?.finish('completed', { reason: 'card-play' });
        doPlay(uid, null);
      } else {
        st.traceSpan?.finish('cancelled', { reason: 'below-cast-line' });
        S.hoveredCard = null; layoutHand();
      }
      return;
    }
    const en = document.elementFromPoint(e.clientX, e.clientY)?.closest('.enemy');
    const idx = en ? +en.dataset.idx : -1;
    const living = S.cb.enemies.filter((x) => x.hp > 0);
    if (idx >= 0 && S.cb.enemies[idx].hp > 0) {
      st.traceSpan?.finish('completed', { reason: 'card-play' });
      doPlay(uid, idx);
    } else if (living.length === 1 && toStage(e.clientX, e.clientY).y < castLine()) {
      st.traceSpan?.finish('completed', { reason: 'card-play' });
      doPlay(uid, living[0].idx); // one foe: releasing high is aim enough
    } else {
      st.traceSpan?.finish('cancelled', { reason: 'invalid-target' });
      clearTargeting(); layoutHand();
    }
  };
  c.addEventListener('pointerup', (e) => finish(e, false));
  c.addEventListener('pointercancel', (e) => finish(e, true));
}
const castLine = () => (S.ce?.hand ? stageRect(S.ce.hand).top - 24 : stageH() - 260); // stage px
// what's under the finger, looking through the card being dragged
const underPointer = (x, y) => document.elementsFromPoint(x, y).find((el) => !el.closest('.card'));
function beginCardDrag(st, c) {
  const cb = S.cb;
  const inst = cb.hand.find((x) => x.uid === st.uid);
  if (!inst) { S.drag = null; return; }
  const d = E.cardData(inst, S.run);
  if (d.unplayable || E.effCost(S.run, cb, inst) > cb.player.energy) {
    // unplayable panes can still be fuel: the drag lives, but only the lantern will take it
    if (E.canKindle(S.run, cb, inst)) {
      st.live = true;
      st.free = true;
      st.kindleOnly = true;
      st.traceSpan = trace.begin('input.card-drag', { attributes: { cardId: inst.id } });
      S.hoveredCard = null;
      sfx.hover();
      c.classList.add('dragging');
      S.ce?.lantern?.classList.add('kindle-target');
      return;
    }
    S.drag = null;
    c.classList.add('nope');
    setTimeout(() => c.classList.remove('nope'), 350);
    sfx.debuff();
    return;
  }
  st.live = true;
  st.traceSpan = trace.begin('input.card-drag', { attributes: { cardId: inst.id } });
  S.hoveredCard = null;
  sfx.hover();
  if (E.canKindle(S.run, cb, inst)) S.ce?.lantern?.classList.add('kindle-target');
  if (d.target === 'enemy') setTargeting({ kind: 'card', uid: st.uid });
  else {
    st.free = true;
    clearTargeting();
    c.classList.add('dragging');
  }
}
async function doKindle(uid) {
  const kindleSpan = trace.begin('input.kindle', { attributes: { action: 'card-kindle' } });
  try {
    S.hoveredCard = null;
    if (!E.kindleFromHand(S.run, S.cb, uid)) {
      kindleSpan.finish('skipped', { reason: 'engine-rejected' });
      layoutHand();
      return false;
    }
    await drain();
    afterAction();
    kindleSpan.finish('completed');
    return true;
  } catch (error) {
    kindleSpan.finish('failed', { reason: 'handler-error' });
    throw error;
  }
}
async function useLanternArt() {
  const artSpan = trace.begin('input.kindle', { attributes: { action: 'lantern-art' } });
  try {
    if (!E.canUseArt(S.run, S.cb)) {
      artSpan.finish('skipped', { reason: 'not-ready' });
      return false;
    }
    clearTargeting();
    if (!E.useArt(S.run, S.cb)) {
      artSpan.finish('skipped', { reason: 'engine-rejected' });
      return false;
    }
    await drain();
    afterAction();
    artSpan.finish('completed');
    return true;
  } catch (error) {
    artSpan.finish('failed', { reason: 'handler-error' });
    throw error;
  }
}
function hoverEnemyAt(x, y) {
  const en = document.elementFromPoint(x, y)?.closest('.enemy');
  S.ce?.enemies.forEach((it) => it.root.classList.toggle('target-hover', it.root === en && it.root.classList.contains('targetable')));
  updatePreviews();
}

// the consequence, spelled out: while a card is armed or inspected, each foe
// shows exactly what it would lose — block-eaten, vulnerability-multiplied —
// with a ghost segment on its bar and a death-mark when the number is lethal.
// Aim silhouette: allEnemies → every living foe; single-target → sole living
// foe, or the hovered valid target while aiming/dragging; never paint every
// foe for a single-target card just because it was hovered.
function updatePreviews() {
  const ce = S.ce, cb = S.cb;
  if (!ce || !cb) return;
  let inst = null;
  if (S.targeting?.kind === 'card') inst = cb.hand.find((c) => c.uid === S.targeting.uid);
  else if (S.drag?.live) inst = cb.hand.find((c) => c.uid === S.drag.uid);
  else if (S.hoveredCard != null && !S.busy) inst = cb.hand.find((c) => c.uid === S.hoveredCard);
  const d = inst ? E.cardData(inst, S.run) : null;
  const aiming = S.targeting?.kind === 'card' || (S.drag?.live && !S.drag.free);
  const living = cb.enemies.filter((e) => e.hp > 0).length;
  const inspect = !!(inst && !cb.over && !d.unplayable && !aiming);
  meshAimClear();
  const heroOn = inspect && d.target === 'self';
  ce.hero?.classList.toggle('aim-target', heroOn);
  if (heroOn) {
    const sprite = $('.hero-sprite', ce.hero) || ce.hero;
    const heroId = runCatalogues().aspects[S.run.aspect].id;
    if (meshAim(sprite, true, charAim(heroId))) ce.hero.classList.add('aim-mesh');
    else ce.hero.classList.remove('aim-mesh');
  } else ce.hero?.classList.remove('aim-mesh');
  cb.enemies.forEach((en, i) => {
    const x = ce.enemies[i];
    let pv = null, dim = false;
    if (inst && !cb.over && en.hp > 0 && !d.unplayable) {
      if (d.target === 'allEnemies') pv = E.previewPlay(S.run, cb, inst, i);
      else if (d.target === 'enemy' && (aiming || living === 1)) {
        pv = E.previewPlay(S.run, cb, inst, i);
        dim = aiming && living > 1 && !x.root.classList.contains('target-hover');
      }
    }
    const hovered = x.root.classList.contains('target-hover');
    const aimAll = d?.target === 'allEnemies' && (inspect || (S.drag?.live && S.drag.free));
    const aimOne = d?.target === 'enemy' && (living === 1 || (aiming && hovered));
    const aim = !!(inst && !cb.over && !d.unplayable && en.hp > 0 && (aimAll || aimOne));
    x.root.classList.toggle('aim-target', aim);
    if (aim) {
      const sprite = $('.enemy-sprite', x.art) || x.art;
      if (meshAim(sprite, true, charAim(combatantView(en).layoutKey))) x.root.classList.add('aim-mesh');
      else x.root.classList.remove('aim-mesh');
    } else x.root.classList.remove('aim-mesh');
    if (pv && (pv.total > 0 || pv.chips > 0)) {
      // bar ghost + facet pips spell out the consequence; the art-overlay number is redundant
      x.prev.classList.remove('show', 'lethal', 'dim');
      x.prev.innerHTML = '';
      x.root.classList.toggle('marked', pv.lethal && !dim);
      const lossFrac = Math.min(en.hp, pv.loss) / en.maxHp;
      x.pv.style.left = `${(Math.max(0, en.hp - pv.loss) / en.maxHp) * 100}%`;
      x.pv.style.width = `${lossFrac * 100}%`;
      x.pv.classList.toggle('show', pv.loss > 0);
      x.facets.innerHTML = facetPips(en, dim ? 0 : pv.chips);
      x.facets.classList.toggle('willshatter', pv.willShatter && !dim);
    } else {
      x.prev.classList.remove('show', 'lethal', 'dim');
      x.root.classList.remove('marked');
      x.pv.classList.remove('show');
      if (en.hp > 0) x.facets.innerHTML = facetPips(en);
      x.facets.classList.remove('willshatter');
    }
  });
}

function onCardClick(uid) {
  if (S.busy || !S.cb || S.cb.over) return;
  if (performance.now() - dragConsumedAt < 350) return; // that click was the tail of a drag
  const cb = S.cb;
  const inst = cb.hand.find((c) => c.uid === uid);
  if (!inst) return;
  // phones: the first tap lifts the pane so you can read it, the second commits
  if (COARSE && S.hoveredCard !== uid && !(S.targeting?.kind === 'card' && S.targeting.uid === uid)) {
    S.hoveredCard = uid;
    sfx.hover();
    layoutHand();
    return;
  }
  const d = E.cardData(inst, S.run);
  const cost = E.effCost(S.run, cb, inst);
  const elc = $(`.card[data-uid="${uid}"]`, S.ce.hand);
  if (d.unplayable || cost > cb.player.energy) {
    elc?.classList.add('nope');
    setTimeout(() => elc?.classList.remove('nope'), 350);
    sfx.debuff();
    return;
  }
  if (S.targeting?.kind === 'card' && S.targeting.uid === uid) return clearTargeting();
  if (d.target === 'enemy') {
    const living = cb.enemies.filter((x) => x.hp > 0);
    if (living.length === 1) return void doPlay(uid, living[0].idx);
    setTargeting({ kind: 'card', uid });
  } else doPlay(uid, null);
}
function onEnemyClick(idx) {
  if (!S.targeting || S.busy) return;
  const e = S.cb.enemies[idx];
  if (!e || e.hp <= 0) return;
  const t = S.targeting;
  if (t.kind === 'card') doPlay(t.uid, idx);
  else if (t.kind === 'potion') usePotionOn(t.slot, idx);
}
function setTargeting(t) {
  trace.emit('input.targeting', { outcome: 'accepted', attributes: { kind: t.kind } });
  S.targeting = t;
  S.ce.root.classList.add('targeting');
  S.cb.enemies.forEach((e, i) => S.ce.enemies[i].root.classList.toggle('targetable', e.hp > 0));
  layoutHand();
  document.addEventListener('pointermove', aimMove);
  if (aimMove._last) aimMove(aimMove._last);
  else {
    // touch has no cursor between taps: open the arc onto the nearest foe
    const living = S.cb.enemies.findIndex((x) => x.hp > 0);
    if (living >= 0) { const c = enemyCenter(living); aimMove({ clientX: c.x, clientY: c.y, synthetic: true }); }
  }
}
function clearTargeting() {
  const previousTargeting = S.targeting;
  S.targeting = null;
  if (previousTargeting) trace.emit('input.targeting', {
    outcome: 'cancelled', attributes: { kind: previousTargeting.kind },
  });
  $('#aim').innerHTML = '';
  document.removeEventListener('pointermove', aimMove);
  meshAimClear();
  if (S.ce) {
    S.ce.root.classList.remove('targeting');
    S.ce.enemies.forEach((x) => x.root.classList.remove('targetable', 'target-hover', 'aim-target', 'aim-mesh'));
    S.ce.hero?.classList.remove('aim-target', 'aim-mesh');
    layoutHand();
  }
  updateLantern(); // hand the light back to the lantern
}
function aimMove(e) {
  if (!e.synthetic) aimMove._last = e;
  if (!S.targeting) return;
  let from;
  if (S.targeting.kind === 'card') {
    const c = $(`.card[data-uid="${S.targeting.uid}"]`);
    from = c ? V.centerOf(c) : { x: stageW() / 2, y: stageH() - 200 };
  } else from = { x: stageW() / 2, y: 60 };
  // synthetic events already carry stage coords (built from centerOf)
  const { x: mx, y: my } = e.synthetic ? { x: e.clientX, y: e.clientY } : toStage(e.clientX, e.clientY);
  const cx = (from.x + mx) / 2, cy = Math.min(from.y, my) - 120;
  $('#aim').innerHTML = `<path d="M${from.x} ${from.y - 80} Q${cx} ${cy} ${mx} ${my}" fill="none" stroke="rgba(255,89,100,.85)" stroke-width="4" stroke-dasharray="4 10" stroke-linecap="round"/>
    <circle cx="${mx}" cy="${my}" r="9" fill="none" stroke="rgba(255,89,100,.95)" stroke-width="3"/>`;
  // the lantern leans toward where you mean to strike: intent illuminates
  if (S.ce?.hero) {
    const h = V.centerOf(S.ce.hero);
    const lx = `${Math.round(h.x + (mx - h.x) * 0.3)}px`;
    const ly = `${Math.round(h.y + (my - h.y) * 0.3)}px`;
    const L = $('#lantern');
    L.style.setProperty('--lx', lx);
    L.style.setProperty('--ly', ly);
    const dim = $('.combat-screen .stage-dim');
    if (dim) {
      dim.style.setProperty('--lx', lx);
      dim.style.setProperty('--ly', ly);
    }
  }
}
async function doPlay(uid, targetIdx) {
  const inst = S.cb?.hand.find((card) => card.uid === uid);
  const playSpan = trace.begin('input.card-play', {
    attributes: { cardId: inst?.id || 'unknown', targetKind: targetIdx == null ? 'none' : 'enemy' },
  });
  let playSpanOpen = true;
  try {
    // Prefer drag-captured seat; else freeze current hand seat before clearTargeting reflows
    if (!cardFlightAnchor.has(String(uid))) {
      const c = $(`.card[data-uid="${uid}"]`, S.ce?.hand);
      if (c) captureCardAnchor(uid, c);
    }
    clearTargeting();
    S.hoveredCard = null;
    if (!E.playCard(S.run, S.cb, uid, targetIdx)) {
      playSpan.finish('skipped', { reason: 'engine-rejected' });
      playSpanOpen = false;
      return false;
    }
    playSpan.finish('completed');
    playSpanOpen = false;
    await drain(targetIdx);
    afterAction();
    return true;
  } catch (error) {
    if (playSpanOpen) playSpan.finish('failed', { reason: 'handler-error' });
    throw error;
  }
}
async function onEndTurn() {
  if (S.busy || !S.cb || S.cb.over) return;
  const turnSpan = trace.begin('input.end-turn');
  try {
    clearTargeting();
    sfx.click();
    E.endTurn(S.run, S.cb);
    await drain();
    afterAction();
    turnSpan.finish('completed');
  } catch (error) {
    turnSpan.finish('failed', { reason: 'handler-error' });
    throw error;
  }
}
function banner(text) {
  const token = presentationBarrier.begin('banner');
  const span = trace.begin('presentation.banner');
  const b = el('div', 'turn-banner', text);
  screenEl().appendChild(b);
  setTimeout(() => {
    try {
      b.remove();
      span.finish('settled');
    } catch (error) {
      span.finish('failed', { reason: 'presentation-error' });
      throw error;
    } finally {
      token.finish();
    }
  }, 1150);
}

// ceremony: things travel — coins to the purse, relics to the bar, card-backs
// from the discard to the draw pile. One arc-flight helper for all of it.
function flyTo(x0, y0, x1, y1, { n = 6, color = '#ffe9ac', size = 8, dur = 640, glyph = '', cls = 'flymote', done = null } = {}) {
  const layer = $('#floaties');
  if (n <= 0) { done?.(); return; }
  const barrierToken = presentationBarrier.begin('mote-flight');
  let remaining = n;
  let cancelled = false;
  let aborted = false;
  const created = [];
  const animations = [];
  const settleOne = (wasCancelled = false) => {
    cancelled ||= wasCancelled;
    remaining -= 1;
    if (remaining > 0) return;
    if (cancelled) barrierToken.cancel();
    else barrierToken.finish();
    done?.();
  };
  try {
    for (let i = 0; i < n; i++) {
      const m = el('div', cls, glyph);
      created.push(m);
      m.style.left = `${x0}px`;
      m.style.top = `${y0}px`;
      if (!glyph) {
        m.style.width = `${size}px`;
        m.style.height = `${size}px`;
        m.style.background = `radial-gradient(circle at 35% 30%, #fff, ${color} 55%, transparent 85%)`;
      } else m.style.color = color;
      layer.appendChild(m);
      const mx = (x0 + x1) / 2 + (Math.random() - 0.5) * 140;
      const my = Math.min(y0, y1) - 50 - Math.random() * 80;
      const anim = m.animate(
        [
          { transform: 'translate(-50%,-50%) scale(0.5)', opacity: 0 },
          { transform: `translate(calc(-50% + ${mx - x0}px), calc(-50% + ${my - y0}px)) scale(1.05)`, opacity: 1, offset: 0.45 },
          { transform: `translate(calc(-50% + ${x1 - x0}px), calc(-50% + ${y1 - y0}px)) scale(0.55)`, opacity: 0.95 },
        ],
        { duration: dur, delay: i * 46, easing: 'cubic-bezier(.32,.05,.35,1)' }
      );
      animations.push(anim);
      let settled = false;
      const settle = (wasCancelled) => {
        if (settled) return;
        settled = true;
        m.remove();
        if (!aborted) settleOne(wasCancelled);
      };
      anim.onfinish = () => settle(false);
      anim.oncancel = () => settle(true);
    }
  } catch (error) {
    aborted = true;
    for (const animation of animations) {
      try { animation.cancel(); } catch { /* setup already failed */ }
    }
    for (const mote of created) mote.remove();
    barrierToken.cancel();
    throw error;
  }
}

function bumpPile(btn) {
  if (!btn || REDUCED) return;
  btn.classList.remove('pile-bump');
  void btn.offsetWidth;
  btn.classList.add('pile-bump');
}

/** Last on-stage card rects for toDiscard (captured at play before lift/remove). */
const cardFlightAnchor = new Map();
function captureCardAnchor(uid, cardEl, meta = {}) {
  if (uid == null || !cardEl) return;
  const r = stageRect(cardEl);
  if (r.width < 2) return;
  cardFlightAnchor.set(String(uid), {
    x: r.left + r.width / 2,
    y: r.top + r.height / 2,
    w: r.width,
    h: r.height,
    fromDrag: !!meta.fromDrag,
  });
}
function peekCardAnchor(uid) {
  return cardFlightAnchor.get(String(uid)) || null;
}
function takeCardAnchor(uid) {
  const k = String(uid);
  const a = cardFlightAnchor.get(k);
  cardFlightAnchor.delete(k);
  return a || null;
}

/** Visible pile face size (matches .pile-layer / stack). */
function pileFaceSize(pileBtn) {
  const layer = pileBtn?.querySelector('.pile-layer');
  if (layer) {
    const r = stageRect(layer);
    if (r.width > 2 && r.height > 2) return { w: r.width, h: r.height };
  }
  const stack = pileBtn?.querySelector('.pile-stack');
  if (stack) {
    const r = stageRect(stack);
    if (r.width > 2) return { w: r.width, h: r.width * (148 / 96) };
  }
  return { w: 96, h: 130 };
}

function handScale() {
  const raw = S.ce?.hand ? getComputedStyle(S.ce.hand).getPropertyValue('--hand-scale') : '';
  const s = parseFloat(raw);
  return Number.isFinite(s) && s > 0 ? s : 1;
}

function handFaceSize() {
  // Resting hand size only — never sample lifted/armed/dragging (hover scales the box)
  const sample = S.ce?.hand?.querySelector(
    '.card:not(.played-up):not(.draw-pending):not(.lifted):not(.armed):not(.dragging)'
  ) || S.ce?.hand?.querySelector('.card:not(.played-up):not(.draw-pending)');
  const scale = handScale();
  if (sample) {
    const cw = parseFloat(getComputedStyle(sample).getPropertyValue('--cw'));
    if (cw > 2) {
      const w = cw * scale;
      return { w, h: Math.round(w * 1.42) };
    }
    // offsetWidth is the layout box (ignores .card-lift hover translate/scale)
    if (sample.offsetWidth > 2) {
      return { w: sample.offsetWidth, h: sample.offsetHeight || Math.round(sample.offsetWidth * 1.42) };
    }
  }
  const w = 152 * scale;
  return { w, h: Math.round(w * 1.42) };
}

/** CSS `bottom` inset of a hand card (shape breakpoints change it). */
function handCardBottomInset() {
  const sample = S.ce?.hand?.querySelector('.card');
  if (sample) {
    const b = parseFloat(getComputedStyle(sample).bottom);
    if (Number.isFinite(b)) return b;
  }
  return 8;
}

/** Stage centre of a resting (non-hovered) hand-fan seat — matches layoutHand, not .lifted. */
function handSeatCenter(fanIndex, fanCount) {
  const n = Math.max(1, fanCount | 0);
  const i = Math.max(0, Math.min(n - 1, fanIndex | 0));
  const gap = Math.min(112, 640 / n, (stageW() - 246) / Math.max(n - 1, 1));
  const rot = n > 1 ? (i - (n - 1) / 2) * Math.min(5, 42 / n) : 0;
  const x = (i - (n - 1) / 2) * gap;
  // layoutHand resting: translateY(abs(rot)*3.2 + 26) — positive Y is down
  const sagY = Math.abs(rot) * 3.2 + 26;
  const sz = handFaceSize();
  let baseBottom = stageH() - handCardBottomInset();
  const zone = S.ce?.hand;
  if (zone) {
    const zr = stageRect(zone);
    if (zr.height > 2) baseBottom = zr.bottom - handCardBottomInset();
  }
  let cx = stageW() / 2;
  if (zone) {
    const zr = stageRect(zone);
    if (zr.width > 2) cx = zr.left + zr.width / 2;
  }
  return {
    x: cx + x,
    y: baseBottom - sz.h / 2 + sagY,
  };
}

function resolveFlightSize(spec, { pileBtn, src, fallback } = {}) {
  if (spec && typeof spec === 'object' && spec.w) return { w: spec.w, h: spec.h };
  if (spec === 'hand') return handFaceSize();
  if (spec === 'src' && src?.w) return { w: src.w, h: src.h };
  if (spec === 'src' && src?.el) {
    const r = stageRect(src.el);
    if (r.width > 2) return { w: r.width, h: r.height };
  }
  if (spec === 'pile' || spec == null) return pileFaceSize(pileBtn);
  return fallback || pileFaceSize(pileBtn);
}

/**
 * Pile-ceremony flights. Default face size = current pile card size.
 * opts.fromSize / toSize: {w,h} | 'pile' | 'hand' | 'src'  (omit toSize → same as from)
 * opts.face: 'card' = real card face (src.inst or opts.cardInst); 'back' = sealed back; else pile art
 * opts.cardInst: fallback card instance when face === 'card'
 * opts.pileArt: draw|discard|ashes master when using pile face (reshuffle only)
 * opts.sizePile: pile button used when resolving 'pile' sizes (defaults to toEl)
 */
function flyCardBacks(fromList, toEl, budgetMs, opts = {}) {
  const layer = $('#floaties');
  const dest = V.centerOf(toEl);
  const n = fromList.length;
  const { stagger, flightDur, awaitMs } = opts.schedule || flightSchedule(n, budgetMs);
  if (REDUCED || n === 0) return Promise.resolve(0);
  const token = presentationBarrier.begin('card-flight');
  const sampleInst = fromList.find((src) => src?.inst)?.inst || opts.cardInst || null;
  const destName = (toEl?.classList?.contains('pile-discard') && 'discard')
    || (toEl?.classList?.contains('pile-draw') && 'draw')
    || (toEl?.classList?.contains('pile-exhaust') && 'exhaust')
    || 'pile';
  const replay = sampleInst ? {
    v: 1,
    kind: 'card-flight',
    subject: {
      kind: 'card',
      contentId: sampleInst.id,
      upgraded: !!sampleInst.up,
    },
    parameters: {
      destination: destName,
      motion: REDUCED ? 'reduced' : 'full',
      count: n,
    },
    endState: { destination: destName, visible: false },
  } : undefined;
  const span = trace.begin('presentation.card-flight', {
    attributes: { count: n },
    ...(replay ? { replay } : {}),
  });
  const sizePile = opts.sizePile || toEl;
  const artUrl = (opts.face === 'back' || opts.face === 'card')
    ? null
    : assetUrl('piles', pileMasterId(opts.pileArt || 'draw'));
  const completions = [];
  const created = [];
  let cancelled = false;
  try {
    fromList.forEach((src, i) => {
    const origin = src.el
      ? (() => { const r = stageRect(src.el); return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height }; })()
      : src;
    const land = src.dest || dest;
    const fromSize = resolveFlightSize(opts.fromSize || 'pile', { pileBtn: sizePile, src: origin });
    const toSize = opts.toSize == null
      ? fromSize
      : resolveFlightSize(opts.toSize, { pileBtn: sizePile, src: origin, fallback: fromSize });
    const endScale = fromSize.w > 0 ? toSize.w / fromSize.w : 1;
    const inst = src.inst || opts.cardInst;
    let m;
    let startScale = 1;
    let landScale = endScale;
    if (opts.face === 'card' && inst) {
      // Always layout at hand --cw so fonts/cost match a real card; size via transform only
      const hand = handFaceSize();
      const layoutW = hand.w;
      const layoutH = hand.h;
      startScale = layoutW > 0 ? fromSize.w / layoutW : 1;
      landScale = layoutW > 0 ? toSize.w / layoutW : endScale;
      m = cardEl(inst, { inCombat: true, size: layoutW });
      m.classList.add('flycard-face');
      Object.assign(m.style, {
        position: 'absolute', left: `${origin.x}px`, top: `${origin.y}px`,
        width: `${layoutW}px`, height: `${layoutH}px`, margin: 0,
        transform: `translate(-50%,-50%) scale(${startScale})`, zIndex: 58 + i, pointerEvents: 'none',
      });
    } else {
      m = el('div', artUrl ? 'flycard flycard-pile' : 'flycard flycard-back');
      m.style.left = `${origin.x}px`;
      m.style.top = `${origin.y}px`;
      m.style.width = `${fromSize.w}px`;
      m.style.height = `${fromSize.h}px`;
      m.style.zIndex = String(58 + i);
      if (artUrl) m.style.backgroundImage = `url(${artUrl})`;
    }
    layer.appendChild(m);
    created.push(m);
    const smooth = opts.arc === 'smooth';
    const easing = opts.easing || (smooth ? 'cubic-bezier(.22,.7,.28,1)' : 'cubic-bezier(.32,.05,.35,1)');
    // Smooth arc: short lift toward discard, little jitter. Default: loftier random mid.
    const mx = smooth
      ? origin.x + (land.x - origin.x) * 0.42 + (Math.random() - 0.5) * 18
      : (origin.x + land.x) / 2 + (Math.random() - 0.5) * 80;
    const my = smooth
      ? Math.min(origin.y, land.y) - 18 - Math.random() * 16
      : Math.min(origin.y, land.y) - 40 - Math.random() * 50;
    const dx1 = mx - origin.x, dy1 = my - origin.y;
    const dx2 = land.x - origin.x, dy2 = land.y - origin.y;
    const midScale = startScale + (landScale - startScale) * (smooth ? 0.55 : 0.45);
    const keyframes = smooth
      ? [
        { transform: `translate(-50%,-50%) scale(${startScale})`, opacity: 1, offset: 0 },
        { transform: `translate(calc(-50% + ${dx1 * 0.55}px), calc(-50% + ${dy1 * 0.55}px)) scale(${startScale + (midScale - startScale) * 0.5})`, opacity: 1, offset: 0.35 },
        { transform: `translate(calc(-50% + ${dx1}px), calc(-50% + ${dy1}px)) scale(${midScale})`, opacity: 0.98, offset: 0.62 },
        { transform: `translate(calc(-50% + ${dx2}px), calc(-50% + ${dy2}px)) scale(${landScale})`, opacity: 0.92, offset: 1 },
      ]
      : [
        { transform: `translate(-50%,-50%) scale(${startScale})`, opacity: 0.95 },
        { transform: `translate(calc(-50% + ${dx1}px), calc(-50% + ${dy1}px)) scale(${midScale})`, opacity: 1, offset: 0.45 },
        { transform: `translate(calc(-50% + ${dx2}px), calc(-50% + ${dy2}px)) scale(${landScale})`, opacity: 0.9 },
      ];
    const animation = m.animate(keyframes, {
      duration: flightDur, delay: i * stagger, easing, fill: 'forwards',
    });
      completions.push(animation.finished
        .catch(() => { cancelled = true; })
        .finally(() => m.remove()));
    });
  } catch (error) {
    for (const card of created) card.remove();
    span.finish('failed', { reason: 'animation-error' });
    token.cancel();
    throw error;
  }
  return Promise.all(completions).then(() => {
    if (cancelled) {
      span.finish('cancelled', { reason: 'animation-cancelled' });
      token.cancel();
    } else {
      span.finish('settled');
      token.finish();
    }
    return awaitMs;
  }, (error) => {
    span.finish('failed', { reason: 'animation-error' });
    token.cancel();
    throw error;
  });
}

/** Resolve a card instance already moved into a pile (engine mutates before drain). */
function pileCardByUid(pile, uid) {
  return (pile || []).find((c) => String(c.uid) === String(uid)) || null;
}

// --------- the living-glass rig: one rAF drives eyes, inner fire and light pools
// count a number element up/down to a target (ease-out cubic), with a set-pulse
function tweenNum(node, from, to, ms = 640) {
  from = Math.round(from); to = Math.round(to);
  if (REDUCED || from === to) { node.textContent = to; return; }
  const t0 = performance.now();
  const step = (now) => {
    const p = Math.min(1, (now - t0) / ms);
    const e = 1 - Math.pow(1 - p, 3);
    node.textContent = Math.round(from + (to - from) * e);
    if (p < 1) requestAnimationFrame(step);
    else { node.textContent = to; node.classList.remove('tick'); void node.offsetWidth; node.classList.add('tick'); }
  };
  requestAnimationFrame(step);
}
function spriteLiftPx(el) {
  const m = getComputedStyle(el).transform;
  if (!m || m === 'none') return 0;
  const a = m.match(/matrix(?:3d)?\(([^)]+)\)/);
  if (!a) return 0;
  const v = a[1].split(',').map((s) => parseFloat(s.trim()));
  const ty = v.length === 16 ? v[13] : v[5];
  return Math.max(0, -ty);
}
function castShadowEl(url, svg) {
  const sh = el('div', 'cast-shadow');
  if (url) {
    const img = document.createElement('img');
    img.src = url;
    img.alt = '';
    img.setAttribute('aria-hidden', 'true');
    sh.appendChild(img);
  } else if (svg) {
    const clone = svg.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    sh.appendChild(clone);
  } else sh.classList.add('cast-shadow-blob');
  return sh;
}
/** Pin shadow box to the art rect in stage px (layer is under #mesh). */
function layoutCastShadow(it) {
  if (!it.shadow || !it.art) return;
  const r = stageRect(it.art);
  it.shadow.style.left = `${r.left}px`;
  it.shadow.style.top = `${r.top}px`;
  it.shadow.style.width = `${r.width}px`;
  it.shadow.style.height = `${r.height}px`;
}
function syncCastShadow(it, lift) {
  if (!it.shadow || !it.shadowId) return;
  layoutCastShadow(it);
  const c = charShadowLive(it.shadowId);
  const max = it.shadowMax || 16;
  const t = Math.min(1, lift / max);
  const sx = c.sx * (1 - t * 0.26);
  const sy = c.sy * (1 - t * 0.5);
  const o = c.opacity * (1 - t * 0.55);
  const blur = c.blur + t * 2.8;
  const skew = c.skew * (1 - t * 0.35);
  const dx = c.dx + c.skew * 0.35 * (1 - t * 0.5);
  // layout footX/footY move the art box (upstream); shadow tracks the art rect
  // each frame. dy/dx are shadow-only fine-tunes — do NOT re-add foot*.
  const dy = c.dy;
  it.shadow.style.setProperty('--foot-ox', `${c.ox}%`);
  it.shadow.style.setProperty('--foot-oy', `${c.oy}%`);
  it.shadow.style.setProperty('--sh-sx', sx.toFixed(3));
  it.shadow.style.setProperty('--sh-sy', sy.toFixed(3));
  it.shadow.style.setProperty('--sh-o', o.toFixed(3));
  it.shadow.style.setProperty('--sh-blur', `${blur.toFixed(1)}px`);
  it.shadow.style.setProperty('--sh-skew', `${skew.toFixed(2)}deg`);
  it.shadow.style.setProperty('--sh-x', `${dx.toFixed(1)}px`);
  it.shadow.style.setProperty('--sh-y', `${dy}px`);
}
function rigCombatants() {
  const ce = S.ce, cb = S.cb;
  ce.rig = [];
  const layer = $('.cast-shadow-layer', ce.root);
  if (layer) layer.innerHTML = '';
  const add = (root, art, glow, isHero, idx, kind, hue = 0, artUrl = '', shadowId = '', footY = 0) => {
    const svg = $('svg', art);
    const sprite = $('.enemy-sprite', art) || art;
    const raster = $('.raster-art', sprite);
    if (!svg && !raster) return;
    const seed = Math.random() * 100;
    if (svg) {
      const br = $('.breathe', svg);
      if (br) {
        br.style.animationDuration = `${(2.5 + (seed % 1.9)).toFixed(2)}s`;
        br.style.animationDelay = `${(-(seed % 3.1)).toFixed(2)}s`;
        br.style.setProperty('--brY', (1.022 + (seed % 0.024)).toFixed(3));
        br.style.setProperty('--sw', `${(((seed * 7) % 1.7) - 0.85).toFixed(2)}deg`);
      }
      $$('.hover-float', svg).forEach((h) => (h.style.animationDelay = `${(-(seed % 2.7)).toFixed(2)}s`));
    } else if (kind) {
      sprite.classList.add(`idle-${kind}`);
      sprite.style.animationDelay = `${(-(seed % 2.8)).toFixed(2)}s`;
      const cssF = shadowId ? charCssFloat(shadowId) : null;
      if (cssF != null) sprite.style.setProperty('--float-y', `${cssF}px`);
      if (kind === 'wisp' || kind === 'plant') {
        const motes = el('div', 'idle-motes');
        motes.style.setProperty('--mote', `hsla(${hue},85%,62%,0.6)`);
        sprite.appendChild(motes);
      }
    }
    // under #mesh (z6), not inside .battlefield (z7) — otherwise the puddle covers the warp body
    const shadow = castShadowEl(artUrl || raster?.src || '', svg);
    (layer || art).appendChild(shadow);
    // lightpool oval retired — cast-shadow owns the ground contact read
    void glow;
    const floatKinds = { wisp: 20, eye: 20, siren: 14, shade: 14, plant: 10, slime: 6 };
    const rig = {
      root, art, sprite, svg, eyes: svg ? $$('.eye', svg) : [], fire: svg ? $('.innerfire', svg) : null,
      pool: null, shadow, shadowId, footY, shadowMax: floatKinds[kind] || 12, seed, isHero, idx, dx: 0, dy: 0,
    };
    ce.rig.push(rig);
    syncCastShadow(rig, 0);
  };
  const L = bfResolve(stageInfo().shape, S.run.act);
  const slots = bfSlots(L, cb.enemies.length);
  cb.enemies.forEach((en, i) => {
    const view = combatantView(en);
    add(ce.enemies[i].root, ce.enemies[i].art, `hsla(${view.hue},90%,66%,.72)`, false, i, view.kind, view.hue,
      assetUrl(view.artCategory, view.artId), view.layoutKey, bfEnemyFootY(slots[i], view.layoutKey));
  });
  const heroId = runCatalogues().aspects[S.run.aspect].id;
  add(ce.hero, ce.hero, 'rgba(127,212,255,.62)', true, 0, 'humanoid', 0, assetUrl('heroes', heroId), heroId, bfActor('heroes', heroId).footY);
}
function meshBindCombatants() {
  if (!meshEnabled()) return;
  const ce = S.ce, cb = S.cb;
  if (!ce || !cb) return;
  const entries = [];
  const heroUrl = assetUrl('heroes', runCatalogues().aspects[S.run.aspect].id);
  // bind the sprite, not .hero-wrap: the raster must be a DIRECT child of the
  // mesh-live element or it stays visible under the warp copy (double vision),
  // and the wrap's rect includes the name label which would stretch the plane
  const heroSprite = ce.hero && ($('.hero-sprite', ce.hero) || ce.hero);
  if (heroUrl && heroSprite) entries.push({ el: heroSprite, url: heroUrl, kind: 'humanoid', id: runCatalogues().aspects[S.run.aspect].id });
  cb.enemies.forEach((en, i) => {
    const view = combatantView(en);
    const url = assetUrl(view.artCategory, view.artId);
    const art = ce.enemies[i]?.art;
    const sprite = art && ($('.enemy-sprite', art) || art);
    if (url && sprite) entries.push({
      el: sprite, url, kind: view.kind, id: view.layoutKey,
      variantId: en.variantId, tint: view.tint,
    });
  });
  meshBind(entries);
  // combat-start relics (e.g. basaltIdol) add block without blockGain — restore shell after bind
  if (cb.player.block > 0 && heroSprite) syncWardMesh(heroSprite, true, true);
  cb.enemies.forEach((en, i) => {
    if (en.block <= 0) return;
    const art = ce.enemies[i]?.art;
    const sprite = art && ($('.enemy-sprite', art) || art);
    if (sprite) syncWardMesh(sprite, true, true);
  });
}
function scheduleMeshBind() {
  requestAnimationFrame(() => requestAnimationFrame(meshBindCombatants));
}
function meshBindTitle() {
  meshClear(); // title stays static raster — #mesh sits above #screen, so warp planes cover the logo
}
let uiFrozen = false; // test-harness freeze: stops the rig loop (one-way per page)
function rigTick(t) {
  if (uiFrozen) return;
  requestAnimationFrame(rigTick);
  const ce = S.ce, cb = S.cb;
  if (REDUCED || !cb || S.screen !== 'combat' || !ce?.rig) return;
  // where the hero's gaze goes: your aim while targeting, else the nearest foe
  let heroTgt = null;
  const living = cb.enemies.findIndex((e) => e.hp > 0);
  if (S.targeting && aimMove._last) heroTgt = toStage(aimMove._last.clientX, aimMove._last.clientY);
  else if (living >= 0) heroTgt = enemyCenter(living);
  const hc = heroCenter();
  for (const it of ce.rig) {
    const unit = it.isHero ? cb.player : cb.enemies[it.idx];
    if (!it.isHero && unit.hp <= 0) {
      if (it.pool) it.pool.style.opacity = 0;
      if (it.shadow) it.shadow.style.opacity = 0;
      continue;
    }
    let lift = spriteLiftPx(it.sprite);
    if (it.sprite.classList.contains('mesh-live')) lift += meshLift(it.sprite);
    syncCastShadow(it, lift);
    const tgt = it.isHero ? heroTgt : hc;
    if (tgt && it.eyes.length) {
      const c = V.centerOf(it.art);
      const a = Math.atan2(tgt.y - c.y, tgt.x - c.x);
      it.dx += (Math.cos(a) * 2.4 - it.dx) * 0.08;
      it.dy += (Math.sin(a) * 1.6 - it.dy) * 0.08;
      const tr = `translate(${it.dx.toFixed(2)}px,${it.dy.toFixed(2)}px)`;
      for (const e of it.eyes) e.style.transform = tr;
    }
    // inner fire: flares on the windup, blazes with Strength, gutters as HP falls
    const hpFrac = Math.max(0, unit.hp) / unit.maxHp;
    let f = 0.45 + 0.55 * hpFrac;
    if (it.root.dataset.choreo === 'attack') f += 1.1;
    if ((unit.statuses?.str || 0) > 0) f += 0.3;
    const flick = 0.86 + 0.14 * Math.sin(t * 0.006 + it.seed) * Math.sin(t * 0.0021 + it.seed * 3);
    if (it.fire) it.fire.style.opacity = Math.min(0.55, (0.05 + 0.13 * f) * flick).toFixed(3);
    if (it.pool) it.pool.style.opacity = Math.min(0.85, (0.3 + 0.4 * f) * flick).toFixed(3);
  }
}

// --------- the playback loop: engine queue -> animations
const HEAVY_KINDS = new Set(['golem', 'treeboss', 'leviathan', 'crab']);
const FLOATY_KINDS = new Set(['wisp', 'shade', 'siren', 'eye', 'cultist']);
function choreoAttack(el, dir = 1, kind = 'humanoid') {
  if (REDUCED || !el) return Promise.resolve();
  const heavy = HEAVY_KINDS.has(kind), floaty = FLOATY_KINDS.has(kind);
  const kf = heavy ? [
    { transform: 'translateX(0) scale(1,1)' },
    { transform: 'translateX(0) scale(1.08,0.86)', offset: 0.35 },
    { transform: 'translateX(0) scale(1,1)' },
  ] : floaty ? [
    { transform: 'translateX(0) translateY(0) scale(1,1)' },
    { transform: `translateX(${6 * dir}px) translateY(-5px) scale(0.98,1.02)`, offset: 0.4 },
    { transform: `translateX(${10 * dir}px) translateY(-2px) scale(1,1)`, offset: 0.7 },
    { transform: 'translateX(0) translateY(0) scale(1,1)' },
  ] : [
    { transform: 'translateX(0) scale(1,1)' },
    { transform: `translateX(${-8 * dir}px) scale(0.97,1.02)`, offset: 0.3 },
    { transform: `translateX(${34 * dir}px) scale(1.02,0.99)`, offset: 0.62 },
    { transform: 'translateX(0) scale(1,1)' },
  ];
  el.dataset.choreo = 'attack';
  return el.animate(kf, { duration: heavy ? 420 : floaty ? 380 : 330, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }).finished
    .finally(() => { delete el.dataset.choreo; })
    .catch(() => {});
}
function choreoHit(el, dir = 1) {
  if (REDUCED || !el) return;
  meshFlash(el);
  el.animate(
    [
      { transform: 'translateX(0) scale(1,1)', filter: 'brightness(1)' },
      { transform: `translateX(${9 * dir}px) scale(0.97,1.03)`, filter: 'brightness(1.9)', offset: 0.25 },
      { transform: 'translateX(0) scale(1,1)', filter: 'brightness(1)' },
    ],
    { duration: 300, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
  );
}
function choreoStagger(el) {
  if (REDUCED || !el) return Promise.resolve();
  return el.animate(
    [
      { transform: 'translateY(0) rotate(0deg)', filter: 'brightness(1)' },
      { transform: 'translateY(5px) rotate(-2.5deg)', filter: 'brightness(0.6)' },
    ],
    { duration: 360, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'forwards' }
  ).finished.catch(() => {});
}
// glass damage language: every landed hit scores a crack into the body
// TEMP (2026-07-07): combat cracks off while glass tuning continues — death
// rite still cracks via igniteVessel → meshCrack (not this helper).
const COMBAT_CRACKS = false;
function addCrack(artEl, big) {
  if (!COMBAT_CRACKS) return;
  if (meshEnabled() && meshCrack(artEl)) return; // glass refracts through the fracture (warp on)
  const layer = artEl && $('.cracks', artEl); // drawn fallback when the warp layer is off
  if (layer && layer.children.length < 8) layer.insertAdjacentHTML('beforeend', crackSvg(big));
}
// death rite: the fire inside wells up through every fracture — one last web of
// cracks races the glass, the seams blaze warm, then the vessel gives (V.shatter)
function igniteVessel(x, dur = 200) {
  // warp on: the vessel fails through its own glass fractures — the fire BUILDS
  // (eased 0→1 over the held beat, not a snap) while one last web races the body;
  // the warp holds the beat, then shatter releases it
  if (meshEnabled() && meshDeath(x.root, 0)) {
    for (let k = 0; k < 3; k++) meshCrack(x.art);
    const t0 = performance.now();
    const step = () => {
      const t = Math.min(1, (performance.now() - t0) / dur);
      const e = t * t * (3 - 2 * t); // smoothstep: slow warm-up, fast blaze
      if (!meshDeath(x.root, e)) return; // plane already handed off — stop quietly
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    return;
  }
  // warp off: drawn fallback — fire wells up through the DOM cracks, then the glass gives
  meshRelease(x.root);
  const layer = x.art && $('.cracks', x.art);
  if (layer) {
    layer.insertAdjacentHTML('beforeend', crackSvg(true));
    if (layer.children.length < 9) layer.insertAdjacentHTML('beforeend', crackSvg(true));
  }
  x.root.classList.add('igniting');
}
function afterAction() {
  const cb = S.cb;
  if (!cb || !cb.over) return;
  if (cb.result === 'win') victoryFlow();
  else defeatFlow();
}
function victoryFlow() {
  transition('victory-out');
  const run = S.run, kind = S.cb.kind, affix = S.cb.affix;
  if (E.isEphemeralRun(run)) {
    late.journalRunEnd(run, 'win');
    return;
  }
  const skipOrdinaryRewards = E.shadeVictorySkipsRewards(run);
  if (kind === 'boss' && E.isFinalTheme(run)) {
    late.journalRunEnd(run, 'win');
    return;
  }
  if (skipOrdinaryRewards) {
    E.clearPendingEncounter(run);
    const continueShadeVictory = () => {
      S.cb = null;
      show('map');
    };
    if (!requireRunSave(run, continueShadeVictory)) return;
    continueShadeVictory();
    return;
  }

  const rewards = E.genCombatRewards(run, kind, affix);
  E.setPendingReward(run, kind, rewards, S.lastPerfect);
  E.clearPendingEncounter(run);
  const continueVictory = () => {
    S.cb = null;
    // Act 1/2 boss kill ceremony — same victory cue as final dawn; holds until map.
    if (kind === 'boss') music.play('victory');
    show('reward');
  };
  if (!requireRunSave(run, continueVictory)) return;
  continueVictory();
}
function defeatFlow() {
  transition('defeat');
  const run = S.run;
  const node = run.map.nodes.find((candidate) => candidate.id === run.nodeId);
  const fallRow = node ? node.row : Math.max(1, run.floorsClimbed - 1);
  E.markShadeFall(run, run.act, fallRow);
  late.journalRunEnd(run, 'death');
}

function hasPileVisualOverride() {
  return pileVisualOverride !== null;
}
function readPileVisualOverride(pile) {
  return pileVisualOverride === null ? undefined : pileVisualOverride[pile];
}
function setPileVisualOverride(pile, value) {
  if (pile !== 'draw' && pile !== 'discard') {
    throw new TypeError(`unknown pile visual override: ${pile}`);
  }
  if (pileVisualOverride === null) pileVisualOverride = { draw: 0, discard: 0 };
  pileVisualOverride[pile] = value;
  return value;
}
function replacePileVisualOverride(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new TypeError('pile visual override must be a record');
  }
  const draw = Number(value.draw);
  const discard = Number(value.discard);
  if (!Number.isFinite(draw) || !Number.isFinite(discard)) {
    throw new TypeError('pile visual override values must be finite');
  }
  pileVisualOverride = { draw, discard };
  return { ...pileVisualOverride };
}
function clearPileVisualOverride() {
  pileVisualOverride = null;
}
function clearDrawRevealPlan() {
  drawRevealPlan.clear();
}
function setDrawRevealPlan(uid, value) {
  drawRevealPlan.set(String(uid), value);
  return value;
}
function deleteDrawRevealPlan(uid) {
  return drawRevealPlan.delete(String(uid));
}
function setCardFlightAnchor(uid, anchor) {
  if (!anchor || typeof anchor !== 'object' || Array.isArray(anchor)) {
    throw new TypeError('card flight anchor must be a record');
  }
  const copy = { ...anchor };
  cardFlightAnchor.set(String(uid), copy);
  return copy;
}

function freeze() {
  document.documentElement.classList.add('freeze');
  uiFrozen = true;
  V.freezeVfx();
  freezeScene();
}

function startRig() {
  requestAnimationFrame(rigTick);
}

const drainHandlers = Object.freeze({
  addCrack,
  banner,
  bumpPile,
  captureCardAnchor,
  choreoAttack,
  choreoHit,
  choreoStagger,
  clearPileVisualOverride,
  enemyCenter,
  flyCardBacks,
  flyTo,
  handFaceSize,
  handSeatCenter,
  heroCenter,
  holdPendingPileArrivals,
  holdPileVisual,
  igniteVessel,
  layoutHand,
  peekCardAnchor,
  pileCardByUid,
  pileFaceSize,
  releasePileVisual,
  renderHud,
  scheduleHandReveal,
  semanticUiCheckpoint,
  syncCombat,
  syncHand,
  syncPileWidgets,
  syncWardMesh,
  takeCardAnchor,
  hasPileVisualOverride,
  readPileVisualOverride,
  setPileVisualOverride,
  replacePileVisualOverride,
  clearDrawRevealPlan,
  setDrawRevealPlan,
  deleteDrawRevealPlan,
  setCardFlightAnchor,
});

return Object.freeze({
  startCombatUI,
  renderCombat,
  refitCombat,
  renderHud,
  meshBindTitle,
  syncCombat,
  syncHand,
  setTargeting,
  clearTargeting,
  doPlay,
  onEndTurn,
  useLanternArt,
  afterAction,
  banner,
  flyTo,
  tweenNum,
  freeze,
  startRig,
  drainHandlers,
});
}
