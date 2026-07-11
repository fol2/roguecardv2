// SPIREBOUND UI — screens, combat playback, interactions.
import * as E from './engine.js';
import { CARDS, RELICS, POTIONS, ENEMIES, EVENTS, ACTS, STATUS_INFO, ARTS, OMENS, AFFIXES, ASPECTS, VOWS, BOONS, DEEDS, QUESTS, QUEST_IDS, TERMINAL_OUTCOMES, WHISPERS, PROGRESSION } from './data.js';
import { enemySvg, heroSvg, cardArtSvg, potionSvg, chestSvg, campfireSvg, merchantSvg, eventArtSvg, iconSvg, iconInline, uiIcon, uiIconUrl, crackSvg, assetUrl, assetList, assetSetIds, assetSetLabel, hasIcon } from './art.js';
import { pileTier, pileFanLayers, pileFanAngleDeg, pileMasterId, flightSchedule, drawBatchSchedule } from './pile-chrome.js';
import { UI_CHROME_IDS, uiFallbackName, energySlotStates, intentUiIds, nodeGlyphId } from './ui-chrome.js';
// drawBatchSchedule also paces discardHand (same even-stagger clock)
import * as V from './vfx.js';
import { syncVigil, commitPendingRunEnd, setBequest, clearBequest, bequestOptions, isRevealed, revealSnapshot, clearNews, clearVigil, questSnapshot } from './vigil.js';
import { sfx, unlock, getSfxVolume, setSfxVolume, isSfxMuted, setSfxMuted, previewSfx, invalidateSfxSelection, preloadSfx } from './audio.js';
import * as music from './music.js';
import { SFX_CATALOG, MUSIC_CATALOG } from './audio-catalog.js';
import { applyAudioSelection, getAudioOverrideRefs, getAudioPackDefaultRef, getAudioSelection, getAudioSelectionProblems, getAudioSource, getAudioVersions } from './audio-assets.js';
import { setTheme, kick, mapNodePos, enterMapMode, exitMapMode, setOverlay, clearOverlay, peekMap, setAltitude, sunrise, freezeScene } from './scene3d.js';
import { meshBind, meshClear, meshEnabled, meshDebug, meshRelease, meshFlash, meshCrack, meshDeath, meshHandoff, meshLift, meshAim, meshAimClear, meshWard } from './mesh.js';
import { charShadowLive, charCssFloat, charAim, onCharMetaChange } from './char-meta.js';
// fixed virtual stage: layout code speaks STAGE px; pointer events arrive in
// client px and cross over via toStage/stageRect at the handler boundary
import { stageW, stageH, stageEl, stageInfo, toStage, stageRect } from './stage.js';
import { bfResolve, bfActor, bfSlots, bfEnemyFrame, bfEnemyFootY, bfEnemyZOrder, bfHeroY, onBFChange } from './battlefield.js';
import { uicResolve, onUICChange } from './uic.js';
import { createChoiceLatch } from './choice-latch.js';
import { getVersionInfo } from './version.js';

const S = { run: null, cb: null, screen: 'title', targeting: null, busy: false, hoveredCard: null, ce: null, drag: null };
// one input grammar, two dialects: a fine pointer hovers, a coarse one presses.
// ?input=touch|mouse overrides detection (simulators lie; debugging wants both)
const FORCE_INPUT = new URLSearchParams(location.search).get('input');
const COARSE = FORCE_INPUT ? FORCE_INPUT === 'touch' : matchMedia('(pointer: coarse)').matches;
const FINE = FORCE_INPUT ? FORCE_INPUT === 'mouse' : matchMedia('(hover: hover) and (pointer: fine)').matches;
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const screenEl = () => $('#screen');
const terminalNavigationLocked = () => S.screen === 'end' ||
  S.run?.pendingRunEnd != null || S.run?.pendingDawn != null;

function el(tag, cls = '', html = '') {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html) e.innerHTML = html;
  return e;
}
const escHtml = (s) => String(s).replace(/[&<>"']/g, (ch) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[ch]));

// generated raster asset if it exists, procedural SVG otherwise
const rasterOr = (cat, id, svg) => {
  const u = assetUrl(cat, id);
  return u ? `<img class="raster-art" src="${u}" alt="">` : svg;
};
function sceneBg() {
  const u = assetUrl('stage', `act${(S.run?.act ?? 0) + 1}-backdrop`);
  return u ? `<div class="scene-bg" style="background-image:url('${u}')"></div>` : '';
}
function metaBg(id) {
  const u = assetUrl('meta', id);
  return u ? `<div class="meta-bg" style="background-image:url('${u}')"></div>` : '';
}
const relicArt = (rid, size = 22) => {
  const u = assetUrl('relics', rid);
  return u ? `<img class="raster-art relic-art" src="${u}" alt="" style="width:${size}px;height:${size}px">` : (RELICS[rid]?.glyph || '◈');
};
// HUD relic bar: painted prop only — no glass chip frame (the PNG carries the read)
const hudRelic = (rid) => {
  const u = assetUrl('relics', rid);
  return u ? `<img class="relic-art hud-relic-art" src="${u}" alt="">` : `<span class="hud-relic-fallback">${RELICS[rid]?.glyph || '◈'}</span>`;
};
const omenIconName = (oid) => oid === 'eighthOmen' ? 'eighthOmen' : `omen-${oid}`;
const omenMark = (oid, imgClass, fallbackClass, size = 22) => {
  const u = assetUrl('omens', oid);
  return u ? `<img class="${imgClass}" src="${u}" alt="">` : `<span class="${fallbackClass}">${iconSvg(omenIconName(oid), size)}</span>`;
};
// silhouette outline ring — SVG feMorphology fallback when mesh is off.
// Mesh-off: SVG ring is always solid. Fancy spin/chase need WebGL (meshAim).
// With mesh on, meshAim() paints the ring on the warped plane instead.
const aimRing = (url, kind) => url
  ? `<svg class="aim-ring" aria-hidden="true"><image href="${escHtml(url)}" x="0" y="0" width="100%" height="100%" preserveAspectRatio="xMidYMax meet" filter="url(#aim-outline-${kind})"/></svg>`
  : '';
function syncWardMesh(el, on, grow = false) {
  if (!el) return;
  const sprite = el.classList?.contains('hero-sprite') || el.classList?.contains('enemy-sprite')
    ? el
    : ($('.hero-sprite, .enemy-sprite', el) || el);
  meshWard(sprite, !!on, { grow });
}
const heroArt = (i) => {
  const u = assetUrl('heroes', ASPECTS[i].id);
  if (!u) return `<div class="hero-sprite">${heroSvg(i)}</div>`;
  return `<div class="hero-sprite">${aimRing(u, 'self')}${rasterOr('heroes', ASPECTS[i].id, heroSvg(i))}<svg class="cracks-overlay" viewBox="0 0 200 200"><g class="cracks"></g></svg></div>`;
};
const combatantView = (en) => {
  const p = en.presentation || {};
  return {
    artCategory: p.artCategory || 'enemies',
    artId: p.artId || en.key,
    layoutKey: p.layoutKey || en.key,
    kind: p.kind || ENEMIES[en.key].art.kind,
    hue: p.hue ?? ENEMIES[en.key].art.hue,
    tint: p.tint || null,
    scale: p.scale || 1,
  };
};

let assetsWarmed = false;
function warmAssets() { // pre-decode combat art so fights never pop in
  if (assetsWarmed) return;
  assetsWarmed = true;
  for (const u of [...assetList('enemies'), ...assetList('heroes')]) new Image().src = u;
}

const FACET_DESC = 'Every creature is glass with a Facet gauge. Fill it and the glass Shatters — the creature loses its next action, is Cracked, and spills Embers into your lantern.';
const KEYWORDS = {
  Cracked: STATUS_INFO.vulnerable.desc, Dimmed: STATUS_INFO.weak.desc, Brittle: STATUS_INFO.frail.desc,
  Smolder: STATUS_INFO.poison.desc, Fervor: STATUS_INFO.str.desc, Poise: STATUS_INFO.dex.desc,
  Kindle: 'Burned away for the rest of this combat — and the lantern gains 1 Ember.',
  Ward: 'Held light that prevents damage. Expires at the start of your turn.',
  Energy: 'Spent to play cards. Refreshes each turn.',
  Ember: 'Fuel for your Lantern Art. Spilled by shatters, deaths and kindling; held in the lantern.',
  Embers: 'Fuel for your Lantern Art. Spilled by shatters, deaths and kindling; held in the lantern.',
  Chip: 'Strike at the glass itself: adds toward a Shatter, no blood required.',
  Facet: FACET_DESC, Facets: FACET_DESC, Shatter: FACET_DESC, Shatters: FACET_DESC,
  Staggered: 'Shattered glass loses its next action while it reseams.',
  Unplayable: 'This card cannot be played.',
  Shard: 'Unplayable junk glass. It can still be kindled.',
  Hex: 'Curse: lose 1 HP at end of turn while in hand. Cannot be kindled.',
  Cinder: 'Take 2 damage at end of turn while in hand.',
};

// ------------------------------------------------------------ tooltip
// mouse: hover, as ever. touch: press and hold anything to ask what it is.
function initTooltip() {
  const tip = $('#tooltip');
  const tipFor = (n) => {
    const t = n._tip;
    tip.innerHTML = `${t.title ? `<div class="tt-title">${t.title}</div>` : ''}<div class="tt-body">${t.body || ''}</div>${t.sub ? `<div class="tt-sub">${t.sub}</div>` : ''}`;
    tip.style.display = 'block';
  };
  const findTipped = (target) => {
    let n = target;
    while (n && n !== document.body && !n._tip) n = n.parentElement;
    return n && n._tip ? n : null;
  };
  const place = (cx, cy, touch) => {
    if (tip.style.display !== 'block') return;
    const { x, y } = toStage(cx, cy);
    const w = tip.offsetWidth, h = tip.offsetHeight;
    if (touch) {
      tip.style.left = `${Math.max(8, Math.min(stageW() - w - 8, x - w / 2))}px`;
      tip.style.top = `${Math.max(8, y - h - 26)}px`;
    } else {
      tip.style.left = `${Math.min(stageW() - w - 12, x + 16)}px`;
      tip.style.top = `${Math.max(8, Math.min(stageH() - h - 12, y - h / 2))}px`;
    }
  };
  document.addEventListener('pointerover', (e) => {
    // hover is only real on devices that hover — iOS replays a tap as mouse
    // events onto whatever screen renders next, so touch never gets this path
    if (!FINE || e.pointerType !== 'mouse') return;
    const n = findTipped(e.target);
    if (n) { tipFor(n); place(e.clientX, e.clientY, false); }
    else tip.style.display = 'none';
  });
  document.addEventListener('pointermove', (e) => {
    if (FINE && e.pointerType === 'mouse') place(e.clientX, e.clientY, false);
    else if (lpT && Math.hypot(e.clientX - lpX, e.clientY - lpY) > 12) { clearTimeout(lpT); lpT = 0; }
  });
  let lpT = 0, lpX = 0, lpY = 0, hideT = 0;
  document.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse') return;
    tip.style.display = 'none';
    clearTimeout(hideT);
    const n = findTipped(e.target);
    if (!n) return;
    lpX = e.clientX; lpY = e.clientY;
    clearTimeout(lpT);
    lpT = setTimeout(() => { lpT = 0; tipFor(n); place(lpX, lpY, true); }, 380);
  }, true);
  const lpEnd = (e) => {
    if (e.pointerType === 'mouse') return;
    if (lpT) { clearTimeout(lpT); lpT = 0; }
    clearTimeout(hideT);
    hideT = setTimeout(() => (tip.style.display = 'none'), 1700);
  };
  document.addEventListener('pointerup', lpEnd);
  document.addEventListener('pointercancel', lpEnd);
}

// ------------------------------------------------------------ card rendering
function fmtText(text, inCombat) {
  let t = text
    .replace(/@(\d+)@/g, (_, n) => {
      const base = +n;
      const v = inCombat && S.cb ? E.previewAttack(S.cb, base) : base;
      const cls = v > base ? 'boosted' : v < base ? 'reduced' : '';
      return `<span class="val ${cls}">${v}</span>`;
    })
    .replace(/#(\d+)#/g, (_, n) => {
      const base = +n;
      const v = inCombat && S.cb ? E.previewBlock(S.run, S.cb, base) : base;
      const cls = v > base ? 'boosted' : v < base ? 'reduced' : '';
      return `<span class="val ${cls}">${v}</span>`;
    });
  t = t.replace(/\b(Cracked|Dimmed|Brittle|Smolder|Fervor|Poise|Kindle|Ward|Energy|Embers?|Chip|Facets?|Shatters?|Staggered|Unplayable|Shard|Hex|Cinder)\b/g, '<span class="kw">$1</span>');
  return t;
}
function cardEl(inst, { inCombat = false, size = null } = {}) {
  const d = E.cardData(inst);
  const c = el('div', `card t-${d.type} r-${d.rarity}${inst.up ? ' upgraded' : ''}`);
  if (size) c.style.setProperty('--cw', `${size}px`);
  if (inst.uid != null) c.dataset.uid = inst.uid;
  let costHtml = '';
  if (d.cost != null) {
    const eff = inCombat && S.cb ? E.effCost(S.run, S.cb, inst) : d.cost;
    costHtml = `<div class="card-cost ${eff === 0 ? 'free' : ''}">${eff}</div>`;
  }
  let txt = fmtText(d.text, inCombat);
  if (inst.bonus) txt = txt.replace(/<span class="val[^"]*">(\d+)<\/span>/, (m, v) => m.replace(v, +v + inst.bonus));
  c.innerHTML = `<div class="card-lift">${costHtml}<div class="card-inner">
    <div class="card-art">${rasterOr('cards', inst.id, cardArtSvg(inst.id, d.type))}</div>
    <div class="card-name">${d.name}</div>
    <div class="card-type">${d.type}</div>
    <div class="card-text"><span class="ct-inner">${txt}</span></div>
    <div class="card-rarity"></div>
  </div></div>`;
  $$('.kw', c).forEach((k) => (k._tip = { title: k.textContent, body: KEYWORDS[k.textContent] || '' }));
  // 3D tilt + mouse-tracked glare/foil (a hovering pointer only)
  if (FINE) c.addEventListener('mousemove', (e) => {
    const r = c.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    const inner = $('.card-inner', c);
    inner.style.setProperty('--ry', `${(px - 0.5) * 16}deg`);
    inner.style.setProperty('--rx', `${(0.5 - py) * 12}deg`);
    inner.style.setProperty('--mx', `${px * 100}%`);
    inner.style.setProperty('--my', `${py * 100}%`);
    inner.style.setProperty('--gx', (px - 0.5) * 60);
  });
  c.addEventListener('mouseleave', () => {
    const inner = $('.card-inner', c);
    inner.style.setProperty('--ry', '0deg');
    inner.style.setProperty('--rx', '0deg');
  });
  return c;
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
  const act = ACTS[S.run.act];
  hud.innerHTML = `<div class="hud-bar">
      <div class="hud-hp-wrap">
        <div class="hud-stat">${uiIcon('heart', 14)} <span class="hp-num">${hp} / ${p.maxHp}</span></div>
        <div class="hud-hpbar"><div style="width:${(100 * hp) / p.maxHp}%"></div></div>
      </div>
      <div class="hud-stat">${uiIcon('coin', 14)} <span class="gold-num">${p.gold}</span></div>
      <div class="hud-mid"><b>${act.name.toUpperCase()}</b> &nbsp;·&nbsp; Act ${S.run.act + 1} &nbsp;·&nbsp; Floor ${S.run.floorsClimbed} &nbsp;·&nbsp; ${act.bossName}</div>
      <div class="hud-right">
        ${E.runRevealed(S.run, 'phials') ? p.potions.map((id, i) => `<button class="potion-slot ${id ? 'full' : ''}" data-slot="${i}">${id ? rasterOr('potions', id, potionSvg(POTIONS[id].tone)) : ''}</button>`).join('') : ''}
        <button class="icon-btn deck-btn" data-act="deck" aria-label="Deck">${uiIcon('deck', 32)}<span class="deck-count">${p.deck.length}</span></button>
        <button class="icon-btn" data-act="menu" aria-label="Menu">${uiIcon('menu', 19)}</button>
      </div>
    </div>
    <div id="omen-slot"></div>
    <div id="relicbar"></div>`;
  // omen + relics are independent UIC widgets (not scaled with .hud-bar)
  const omenSlot = $('#omen-slot', hud);
  const bar = $('#relicbar', hud);
  const omenId = S.run.omens?.[S.run.act];
  const omen = OMENS[omenId];
  if (omen) {
    const oc = el('div', 'relic-chip omen-chip', omenMark(omenId, 'hud-omen-art', 'hud-omen-fallback', 24));
    oc.style.setProperty('--tone', omen.tone);
    oc._tip = { title: `Omen — ${omen.name}`, body: omen.text, sub: `hangs over Act ${S.run.act + 1}` };
    omenSlot.appendChild(oc);
  }
  for (const rid of p.relics) {
    const r = RELICS[rid];
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
    slot._tip = { title: POTIONS[id].name, body: POTIONS[id].text, sub: 'Click to use or toss' };
  });
  $('[data-act="deck"]', hud).onclick = () => { sfx.click(); showCardGrid('Your Deck', S.run.player.deck, { sub: `${S.run.player.deck.length} cards` }); };
  $('[data-act="menu"]', hud).onclick = (e) => { sfx.click(); openMenu(e.clientX, e.clientY); };
  $$('.potion-slot.full', hud).forEach((slot) => (slot.onclick = (e) => potionMenu(+slot.dataset.slot, e)));
  applyUiChromeLayout();
}
function openMenu(cx, cy) {
  closeMenus();
  const { x, y } = toStage(cx, cy);
  const m = el('div', 'pop-menu');
  const terminalLocked = terminalNavigationLocked();
  m.innerHTML = `<button data-m="help">How to Play</button><button data-m="settings">Settings</button>${terminalLocked ? '' : '<button data-m="abandon" style="color:#ff8d8d">Abandon Run</button>'}`;
  stageEl().appendChild(m); // inside the stage so it scales with the game
  m.style.left = `${Math.min(x, stageW() - 200)}px`;
  m.style.top = `${y + 8}px`;
  m.onclick = (e) => {
    const a = e.target.dataset.m;
    closeMenus();
    if (a === 'help') showHelp();
    if (a === 'settings') openSettingsPanel();
    if (a === 'abandon' && !terminalNavigationLocked()) confirmAbandon();
  };
  setTimeout(() => document.addEventListener('pointerdown', closeMenusOnce, { once: true }), 0);
}
const closeMenus = () => $$('.pop-menu, .audio-panel, .settings-panel').forEach((m) => m.remove());
const closeMenusOnce = (e) => { if (!e.target.closest('.pop-menu, .audio-panel, .settings-panel')) closeMenus(); };

function openSettingsPanel() {
  closeMenus();
  const panel = el('div', 'settings-panel audio-panel');
  const row = (label, vol, muted, bus) => `
    <div class="audio-row" data-bus="${bus}">
      <div class="audio-row-head">
        <span class="audio-label">${label}</span>
        <button type="button" class="audio-mute" data-a="mute">${muted ? 'Unmute' : 'Mute'}</button>
      </div>
      <input type="range" class="audio-vol" min="0" max="100" step="1" value="${Math.round(vol * 100)}" ${muted ? 'disabled' : ''}>
    </div>`;
  panel.innerHTML = `
    <div class="audio-panel-title">Settings</div>
    ${row('Music', music.getMusicVolume(), music.isMusicMuted(), 'music')}
    ${row('SFX', getSfxVolume(), isSfxMuted(), 'sfx')}
    <div class="settings-debug">
      <div class="settings-debug-label">Debug</div>
      <button type="button" class="btn danger settings-reset" data-a="reset"${terminalNavigationLocked() ? ' disabled' : ''}>Reset Save</button>
      <div class="settings-debug-warn">Wipes the current climb and all Vigil progress. Cannot be undone.</div>
    </div>
    <button type="button" class="audio-close" data-a="close">Close</button>`;
  stageEl().appendChild(panel);
  const bindRow = (bus) => {
    const root = $(`.audio-row[data-bus="${bus}"]`, panel);
    const slider = $('.audio-vol', root);
    const muteBtn = $('.audio-mute', root);
    const getVol = bus === 'music' ? music.getMusicVolume : getSfxVolume;
    const setVol = bus === 'music' ? music.setMusicVolume : setSfxVolume;
    const getMute = bus === 'music' ? music.isMusicMuted : isSfxMuted;
    const setMute = bus === 'music' ? music.setMusicMuted : setSfxMuted;
    slider.oninput = () => {
      setVol(+slider.value / 100);
      if (bus === 'sfx') sfx.click();
    };
    muteBtn.onclick = () => {
      const on = setMute(!getMute());
      muteBtn.textContent = on ? 'Unmute' : 'Mute';
      slider.disabled = on;
      slider.value = String(Math.round(getVol() * 100));
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
    <div class="ov-title">Reset Save?</div>
    <div class="ov-sub">This erases your <b>current climb</b> and the entire <b>Vigil</b> — deeds, unlocks, vows, monuments, and whispers.<br><br><span style="color:#ff8d8d">This cannot be undone.</span></div>
    <div class="ov-actions"><button class="btn danger" data-a="yes">Erase Everything</button><button class="btn ghost" data-a="no">Cancel</button></div>
  </div>`, (root) => {
    root.onclick = (e) => {
      const a = e.target.dataset.a;
      if (a === 'yes') {
        E.clearSave();
        clearVigil();
        S.run = null;
        S.cb = null;
        S.embark = null;
        closeOverlay();
        sfx.click();
        show('title');
      }
      if (a === 'no') closeOverlay();
    };
  });
}
function potionMenu(slot, e) {
  if (S.busy) return;
  closeMenus();
  const id = S.run.player.potions[slot];
  if (!id) return;
  const p = POTIONS[id];
  const inCombat = S.cb && !S.cb.over && S.screen === 'combat';
  const canUse = !p.combatOnly || inCombat;
  const m = el('div', 'pop-menu');
  m.innerHTML = `<button data-m="use" ${canUse ? '' : 'disabled style="opacity:.4"'}>Use ${p.name}</button><button data-m="toss">Toss it</button>`;
  stageEl().appendChild(m);
  const pt = toStage(e.clientX, e.clientY);
  m.style.left = `${Math.min(pt.x - 60, stageW() - 220)}px`;
  m.style.top = `${pt.y + 10}px`;
  m.onclick = async (ev) => {
    const a = ev.target.dataset.m;
    closeMenus();
    if (a === 'toss') { S.run.player.potions[slot] = null; sfx.card(); renderHud(); E.saveRun(S.run); }
    if (a === 'use' && canUse) {
      if (p.needsTarget && inCombat) {
        const living = S.cb.enemies.filter((x) => x.hp > 0);
        if (living.length === 1) return usePotionOn(slot, living[0].idx);
        setTargeting({ kind: 'potion', slot });
      } else usePotionOn(slot, null);
    }
  };
  setTimeout(() => document.addEventListener('pointerdown', closeMenusOnce, { once: true }), 0);
}
async function usePotionOn(slot, targetIdx) {
  clearTargeting();
  sfx.potion();
  if (S.cb && !S.cb.over && S.screen === 'combat') {
    E.usePotion(S.run, S.cb, slot, targetIdx);
    await drain();
    afterAction();
  } else {
    E.usePotion(S.run, null, slot, null);
    renderHud();
    E.saveRun(S.run);
  }
}
function confirmAbandon() {
  if (terminalNavigationLocked()) return;
  openOverlay(`<div class="panel ov-panel" style="text-align:center">
    <div class="ov-title">Abandon Run?</div>
    <div class="ov-sub">Your climb will be lost to the void.</div>
    <div class="ov-actions"><button class="btn danger" data-a="yes">Abandon</button><button class="btn ghost" data-a="no">Keep Climbing</button></div>
  </div>`, (root) => {
    root.onclick = (e) => {
      const a = e.target.dataset.a;
      if (a === 'yes') {
        const run = S.run;
        root.onclick = null;
        closeOverlay();
        journalRunEnd(run, 'abandon', () => {
          S.run = null;
          S.cb = null;
          show('title');
        });
      }
      if (a === 'no') closeOverlay();
    };
  });
}

// ------------------------------------------------------------ overlay helpers
let persistenceDialogTransaction = null;
function openOverlay(html, wire = null, closable = false) {
  if (persistenceDialogTransaction) return false;
  const ov = $('#overlay');
  ov.innerHTML = html;
  ov.classList.add('open');
  ov._closable = closable;
  if (wire) wire(ov.firstElementChild);
  return true;
}
function closeOverlay() {
  if (persistenceDialogTransaction) return false;
  const ov = $('#overlay');
  ov.classList.remove('open', 'run-save-lock');
  ov.innerHTML = '';
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
  const transaction = { background, wasInert: !!background?.inert, blockBackground, settled: false, root: null };
  transaction.active = () => persistenceDialogTransaction === transaction && !transaction.settled;
  transaction.settle = (continuation = null) => {
    if (!transaction.active()) return false;
    transaction.settled = true;
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
    persistenceDialogTransaction = null;
    closeOverlay();
    continuation?.();
    return true;
  };
  const opened = openOverlay(html, (root) => {
    transaction.root = root;
    root.onkeydown = (event) => {
      // Keep global combat shortcuts from reaching the document while this
      // transaction owns input. Background controls are inert, but the
      // dialog itself still bubbles key events unless it stops them here.
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
  if (!opened) return null;
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
}
function showRunSaveFailure(run, onSaved) {
  const html = persistenceFailureHtml({
    id: 'run-save-failure',
    title: 'Save Failed',
    description: 'The climb could not be secured. Free storage and retry, or reload the last durable climb state.',
    retry: { action: 'retry-save', label: 'Retry Save' },
    reload: { action: 'reload-save', label: 'Reload Saved Climb' },
  });
  openPersistenceDialog(html, '[data-a="retry-save"]', (root, transaction) => {
    root.onclick = (e) => {
      if (!transaction.active()) return;
      const a = e.target.closest('[data-a]')?.dataset.a;
      if (a === 'reload-save') { location.reload(); return; }
      if (a !== 'retry-save') return;
      sfx.click();
      const retry = $('[data-a="retry-save"]', root);
      const reload = $('[data-a="reload-save"]', root);
      retry.disabled = true;
      reload.disabled = true;
      if (!E.saveRun(run)) {
        $('.ov-sub', root).textContent = 'The save is still unavailable. Free storage, then retry or reload the last durable climb state.';
        retry.disabled = false;
        reload.disabled = false;
        retry.focus();
        return;
      }
      transaction.settle(onSaved);
    };
  });
}
function requireRunSave(run, onSaved) {
  if (persistenceDialogTransaction) return false;
  if (E.saveRun(run)) return true;
  showRunSaveFailure(run, onSaved);
  return false;
}
function requireHollowRouteClear(run, onCleared) {
  if (!run.pendingHollowRoute) return true;
  if (E.completePendingHollowRoute(run)) return true;
  const html = persistenceFailureHtml({
    id: 'hollow-route-save-failure',
    title: 'Save Failed',
    description: 'This destination is still pending. Free storage and retry, or reload the exact saved destination.',
    retry: { action: 'retry-hollow-route', label: 'Retry Save' },
    reload: { action: 'reload-hollow-route', label: 'Reload Saved Destination' },
  });
  openPersistenceDialog(html, '[data-a="retry-hollow-route"]', (root, transaction) => {
    root.onclick = (e) => {
      if (!transaction.active()) return;
      const action = e.target.closest('[data-a]')?.dataset.a;
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
function showStonePersistenceFailure(onRetry, retryLabel = 'Retry') {
  const html = persistenceFailureHtml({
    id: 'stone-save-failure',
    title: 'The Stone Could Not Hold',
    description: 'The stone could not hold this duel. Free storage and try again.',
    retry: { action: 'retry-stone', label: retryLabel },
    reload: { action: 'reload-stone', label: 'Reload Saved Climb' },
  });
  openPersistenceDialog(html, '[data-a="retry-stone"]', (root, transaction) => {
    root.onclick = (e) => {
      if (!transaction.active()) return;
      const a = e.target.closest('[data-a]')?.dataset.a;
      if (a === 'reload-stone') { location.reload(); return; }
      if (a !== 'retry-stone') return;
      sfx.click();
      transaction.settle(onRetry);
    };
  });
}
function requireBequestClear(onCleared) {
  if (clearBequest()) return true;
  showStonePersistenceFailure(() => {
    if (clearBequest()) onCleared();
    else requireBequestClear(onCleared);
  });
  return false;
}
function requirePendingShadeDuelClear(onCleared) {
  const result = E.resumeShadeDuel(S.run, clearBequest);
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
    title: 'The Vigil Could Not Hold',
    description: 'This run end is safely journalled, but its ledgers or final dawn could not be secured. Free storage and retry, or reload this saved finalisation.',
    retry: { action: 'retry-end', label: 'Retry Finalisation' },
    reload: { action: 'reload-end', label: 'Reload Saved Finalisation' },
  });
  openPersistenceDialog(html, '[data-a="retry-end"]', (root, transaction) => {
    root.onclick = (e) => {
      if (!transaction.active()) return;
      const a = e.target.closest('[data-a]')?.dataset.a;
      if (a === 'reload-end') { location.reload(); return; }
      if (a !== 'retry-end') return;
      sfx.click();
      transaction.settle(() => finalisePendingRunEnd(run, onFinalised));
    };
  });
}
function showCardGrid(title, instances, { sub = '', pick = null, canSkip = false, skipLabel = 'Skip', inCombat = false } = {}) {
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
    const c = cardEl(inst, { inCombat });
    if (pick) c.onclick = () => { sfx.click(); choose(inst, c, 240); };
    grid.appendChild(c);
  }
  panel.appendChild(grid);
  const actions = el('div', 'ov-actions');
  if (canSkip && pick) {
    skip = el('button', 'btn ghost', skipLabel);
    skip.onclick = () => { sfx.click(); choose(null); };
    actions.appendChild(skip);
  }
  if (!pick) {
    const close = el('button', 'btn ghost', 'Close');
    close.onclick = () => { sfx.click(); closeOverlay(); };
    actions.appendChild(close);
  }
  panel.appendChild(actions);
  if (!openOverlay('', null, !pick)) return false;
  $('#overlay').appendChild(panel);
  return true;
}
function showHelp() {
  openOverlay(`<div class="panel ov-panel howto">
    <div class="ov-title">How to Play</div>
    <h3>The Climb</h3>Choose a path of lanterns up the Spire. Fight monsters, gather cards, relics and phials, and defeat the boss of each of the <b>3 acts</b>. Unlit lanterns hide what they hold — but pay a bounty for the walking.
    <h3>Combat</h3>Each turn you draw <b>5 cards</b> and gain <b>3 Energy</b> (⬤). Play a card by clicking or dragging — attacks need a target when several enemies remain. Enemies telegraph their <b>intent</b> above their heads.
    <h3>The Glass</h3>Every creature is glass with a row of <b>Facets</b> under its lifebar. Attacks that draw unblocked blood chip a facet (heavy cards chip more). Fill the gauge and the glass <b>SHATTERS</b>: it loses its next action, is Cracked, and spills <b>Embers</b> into your lantern. Time a shatter to deny the blow you can't survive.
    <h3>The Lantern</h3>Embers fuel your <b>Lantern Art</b> — one signature power, always available, once a turn (press <b>A</b>). Drag any card onto the lantern to <b>kindle</b> it: the card burns away and feeds the lantern 1 ember. Once a turn; curses refuse the fire.
    <h3>Ward & Statuses</h3><b>Ward</b> is held light that absorbs damage but expires each turn. <b>Cracked</b> ×1.5 damage taken · <b>Dimmed</b> −25% damage dealt · <b>Brittle</b> −25% Ward · <b>Smolder</b> burns each turn, and leaps to another enemy when its host dies or shatters.
    <h3>The Fires & The Merchant</h3>Rest sites heal <b>30%</b> or upgrade a card. Shops sell cards, relics, phials — and can <b>remove</b> a card from your deck. Keep your deck lean; every reward is optional.
    <h3>The Vigil — What Death Leaves Behind</h3>Nothing is wasted. At the foot of each climb the <b>Lamplighter</b> offers a boon and lets you choose your Lantern Art. When you fall, carve one thing into the stone — a <b>monument</b> your next climb can recover in that same act. Every shatter, kindle and slaying feeds lifetime <b>Deeds</b> that unlock new cards, relics, and a second aspect, the <b>Ashwarden</b>. Reach the dawn once and the <b>Vows</b> open: an optional difficulty ladder for those who'd climb a crueler Spire.
    <div class="ov-actions"><button class="btn" data-a="ok">Fight On</button></div>
  </div>`, (root) => { $('[data-a="ok"]', root).onclick = () => { sfx.click(); closeOverlay(); }; }, true);
}

// ------------------------------------------------------------ screens
// ceremony: a band of lantern light sweeps the glass between scenes
function wipe() {
  if (REDUCED) return;
  const w = $('#wipe');
  w.classList.remove('go');
  void w.offsetWidth;
  w.classList.add('go');
  setTimeout(() => w.classList.remove('go'), 620);
}
let transitionSeq = 0;
async function transition(kind, opts = {}) {
  if (REDUCED) return;
  const t = $('#transit');
  if (!t) return;
  const seq = ++transitionSeq;
  const run = (html, kf, dur) => {
    t.innerHTML = html;
    t.classList.add('on');
    const child = t.firstElementChild;
    return child.animate(kf, { duration: dur, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' }).finished
      .catch(() => {})
      .finally(() => {
        if (seq !== transitionSeq) return;
        t.classList.remove('on');
        t.innerHTML = '';
      });
  };
  if (kind === 'combat-in') {
    const x = opts.x ?? stageW() / 2, y = opts.y ?? stageH() / 2;
    return run('<div class="tr-iris"></div>', [
      { clipPath: `circle(150% at ${x}px ${y}px)` },
      { clipPath: `circle(0% at ${x}px ${y}px)` },
    ], 480);
  }
  if (kind === 'victory-out') return run('<div class="tr-bloom"></div>', [{ opacity: 0 }, { opacity: 1, offset: 0.4 }, { opacity: 0 }], 900);
  if (kind === 'defeat') return run('<div class="tr-crack"></div>', [{ opacity: 0 }, { opacity: 1 }], 700);
  if (kind === 'act-change') {
    const omen = OMENS[S.run.omens?.[S.run.act]];
    return run(`<div class="tr-plate"><div class="tp-act">ACT ${S.run.act + 1} - ${ACTS[S.run.act].name.toUpperCase()}</div>
      ${omen ? `<div class="tp-omen" style="color:${omen.tone}">${iconSvg(omenIconName(S.run.omens[S.run.act]), 16)} OMEN - ${omen.name.toUpperCase()}</div>` : ''}</div>`,
      [{ opacity: 0 }, { opacity: 1, offset: 0.15 }, { opacity: 1, offset: 0.8 }, { opacity: 0 }], 2200);
  }
}
export function show(name, data) {
  if (S.screen !== name && S.run) wipe(); // travel is lit; in-place rerenders aren't
  S.screen = name;
  if (name !== 'end') $('#toasts')?.remove();
  closeMenus();
  $('#tooltip').style.display = 'none'; // a parked cursor shouldn't strand a tip across screens
  if (name !== 'map') { exitMapMode(); clearOverlay(); }
  V.setWeather(null);
  const sc = screenEl();
  sc.className = '';
  sc.onclick = null; // screens share #screen — never let a stale delegate survive
  ({
    title: renderTitle, embark: renderEmbark, vigil: renderVigil, map: renderMap, combat: () => {}, reward: renderReward, rest: renderRest,
    shop: renderShop, event: renderEvent, treasure: renderTreasure, hollow: renderHollow, bossRelic: renderBossRelic, end: renderEnd,
  })[name](data);
  if (name === 'map') warmAssets();
  if (name !== 'combat' && name !== 'title') meshClear();
  // Only switch BGM if the renderer stayed on this screen (map may redirect into combat).
  // reward / bossRelic omit SCREEN_CUES: normal/elite keep combat music; Act 1/2 boss wins
  // switch to victory in victoryFlow() and hold through reward/bossRelic until map.
  if (S.screen === name && name !== 'combat' && name !== 'end') music.playForScreen(name);
  if (S.screen === 'map' && S.run) {
    const a = (S.run.act | 0) + 1;
    music.warm(`act${a}Combat`, `act${a}Boss`, 'elite', 'safeNodes');
  }
  renderHud();
}

const ROMAN = ['0', 'I', 'II', 'III', 'IV', 'V'];
const ROSE_ASSET_IDS = {
  mural: 'emberglass-mural',
  frame: 'emberglass-frame',
  masks: Object.fromEntries(QUEST_IDS.map((id) => [id, 'emberglass-mask-' + id])),
};
const ROSE_LABEL_POSITIONS = [
  [50, 15], [78, 34], [78, 69], [50, 84], [22, 69], [22, 34],
];
let forceRoseFallback = false;

function roseAssets() {
  if (forceRoseFallback) return null;
  const mural = assetUrl('meta', ROSE_ASSET_IDS.mural);
  const frame = assetUrl('meta', ROSE_ASSET_IDS.frame);
  const masks = Object.fromEntries(QUEST_IDS.map((id) => [id, assetUrl('meta', ROSE_ASSET_IDS.masks[id])]));
  return mural && frame && Object.values(masks).every(Boolean) ? { mural, frame, masks } : null;
}

function rosePaneCopy(vigil, id, record) {
  const quest = QUESTS[id];
  const disclosure = E.questDisclosure(vigil, id);
  if (record.state === 'armed') return '<div class="rose-pane-mystery">???</div>';
  if (record.state === 'revealed') return `<div class="rose-pane-name">${escHtml(disclosure.name)}</div>
    <div class="rose-pane-inscription">${escHtml(disclosure.inscription)}</div>
    <div class="rose-pane-progress">${disclosure.progress}/${disclosure.target}</div>`;
  if (record.state === 'complete') return `<div class="rose-pane-name">${escHtml(quest.name)}</div>
    <div class="rose-pane-progress">Shard recovered</div>`;
  return '';
}

function rosePaneControl(vigil, id, record, index, selected, assets) {
  const state = record.state;
  const disclosure = E.questDisclosure(vigil, id);
  const name = state === 'dormant'
    ? `Dormant Emberglass pane ${index + 1}`
    : state === 'armed'
      ? `Unknown Emberglass pane ${index + 1}`
      : state === 'revealed'
        ? `${disclosure.name}, ${disclosure.progress} of ${disclosure.target}`
        : `${QUESTS[id].name}, Shard recovered`;
  const [x, y] = ROSE_LABEL_POSITIONS[index];
  const style = assets ? ` style="--rose-x:${x}%;--rose-y:${y}%"` : '';
  return `<button type="button" class="rose-pane-select${assets ? '' : ' slot-control'}" data-a="rose-pane" data-index="${index}"
    aria-label="${escHtml(name)}" aria-controls="rose-pane-detail" aria-pressed="${selected ? 'true' : 'false'}"${style}></button>`;
}

function roseDetailCopy(vigil, id, record) {
  const quest = QUESTS[id];
  const disclosure = E.questDisclosure(vigil, id);
  if (record.state === 'armed') return '<div class="rose-detail-mystery">???</div>';
  if (record.state === 'revealed') return `<div class="rose-detail-name">${escHtml(disclosure.name)}</div>
    <div class="rose-detail-inscription">${escHtml(disclosure.inscription)}</div>
    <div class="rose-detail-progress">${disclosure.progress}/${disclosure.target}</div>`;
  if (record.state === 'complete') return `<div class="rose-detail-name">${escHtml(quest.name)}</div>
    <div class="rose-detail-progress">Shard recovered</div>`;
  return '<div class="rose-detail-dormant">This pane is dark.</div>';
}

function rosePaneDetailHtml(v, index) {
  const id = QUEST_IDS[index];
  const record = v.quests[id] || { state: 'dormant', progress: 0, memory: {} };
  const state = ['armed', 'revealed', 'complete'].includes(record.state) ? record.state : 'dormant';
  return `<section id="rose-pane-detail" class="rose-pane-detail ${state}" role="region"
    aria-label="Selected Emberglass pane" aria-live="polite" data-index="${index}">${roseDetailCopy(v, id, { ...record, state })}</section>`;
}

function initialRosePaneIndex(v) {
  for (const state of ['revealed', 'armed', 'complete']) {
    const index = QUEST_IDS.findIndex((id) => v.quests[id]?.state === state);
    if (index >= 0) return index;
  }
  return 0;
}

function rosePaneHtml(v, assets, id, index, selected) {
  const record = v.quests[id] || { state: 'dormant', progress: 0, memory: {} };
  const state = ['armed', 'revealed', 'complete'].includes(record.state) ? record.state : 'dormant';
  const stateClasses = state === 'complete' ? 'complete lit' : state;
  const identity = state === 'dormant' ? '' : ` data-quest="${id}"`;
  const copy = rosePaneCopy(v, id, { ...record, state });
  if (!assets) {
    const mark = state === 'complete' ? 'emberglassShard' : 'roseWindow';
    return `<div class="rose-pane rose-slot ${stateClasses}" data-index="${index}"${identity}>
      <span class="rose-slot-mark">${iconSvg(mark, 34)}</span>
      <div class="rose-pane-copy" aria-hidden="true">${copy}</div>
      ${rosePaneControl(v, id, record, index, selected, assets)}
    </div>`;
  }
  const [x, y] = ROSE_LABEL_POSITIONS[index];
  return `<div class="rose-pane ${stateClasses}" data-index="${index}"${identity} style="--rose-x:${x}%;--rose-y:${y}%">
    <div class="rose-pane-art" style="--rose-mural:url('${escHtml(assets.mural)}');--rose-mask:url('${escHtml(assets.masks[id])}')"></div>
    <div class="rose-pane-copy" aria-hidden="true">${copy}</div>
    ${rosePaneControl(v, id, record, index, selected, assets)}
  </div>`;
}

function whisperLogHtml(v) {
  const heard = WHISPERS.slice(0, Math.min(v.whispers, WHISPERS.length));
  const rows = heard.map((line, i) => `<div class="whisper-row"><span>${i + 1}</span><i>${escHtml(line)}</i></div>`);
  if (v.whispers > WHISPERS.length) {
    rows.push('<div class="whisper-row final"><span>∞</span><i>The final whisper returns at every dawn.</i></div>');
  }
  return `<div class="whisper-log">
    <div class="whisper-log-title">Whispers heard at dawn</div>
    ${rows.join('')}
  </div>`;
}

function roseSurfaceHtml(v, assets) {
  const selected = initialRosePaneIndex(v);
  const panes = QUEST_IDS.map((id, i) => rosePaneHtml(v, assets, id, i, i === selected)).join('');
  if (!assets) {
    return `<div class="rose-view">
      <div class="rose-window rose-fallback">${panes}</div>
      ${rosePaneDetailHtml(v, selected)}
      ${whisperLogHtml(v)}
    </div>`;
  }
  const urls = [assets.mural, assets.frame, ...QUEST_IDS.map((id) => assets.masks[id])];
  return `<div class="rose-view">
    <div class="rose-window rose-assets">
      <div class="rose-backdrop"></div>
      ${panes}
      <img class="rose-frame" src="${escHtml(assets.frame)}" alt="">
      <div class="rose-preload" aria-hidden="true">${urls.map((url) => `<img src="${escHtml(url)}" alt="">`).join('')}</div>
    </div>
    ${rosePaneDetailHtml(v, selected)}
    ${whisperLogHtml(v)}
  </div>`;
}

function selectRosePane(root, v, index) {
  if (!Number.isInteger(index) || index < 0 || index >= QUEST_IDS.length) return;
  const detail = $('#rose-pane-detail', root);
  if (!detail) return;
  const id = QUEST_IDS[index];
  const record = v.quests[id] || { state: 'dormant', progress: 0, memory: {} };
  const state = ['armed', 'revealed', 'complete'].includes(record.state) ? record.state : 'dormant';
  detail.className = `rose-pane-detail ${state}`;
  detail.dataset.index = String(index);
  detail.innerHTML = roseDetailCopy(v, id, { ...record, state });
  $$('.rose-pane-select', root).forEach((control) => {
    control.setAttribute('aria-pressed', control.dataset.index === String(index) ? 'true' : 'false');
  });
}

function decodeRoseAssets(root) {
  const rose = $('.rose-window.rose-assets', root);
  if (!rose) return;
  const images = $$('.rose-preload img', rose);
  Promise.all(images.map((image) => image.decode ? image.decode() : Promise.resolve()))
    .then(() => { if (rose.isConnected) rose.classList.add('ready'); })
    .catch(() => {});
}

function titleRoseMedallion(v, assets) {
  if (!assets || v.shards.length < 1) return '';
  const panes = QUEST_IDS.filter((id) => v.shards.includes(id)).map((id) =>
    `<span class="title-rose-pane" style="--rose-mural:url('${escHtml(assets.mural)}');--rose-mask:url('${escHtml(assets.masks[id])}')"></span>`).join('');
  const urls = [assets.mural, assets.frame, ...QUEST_IDS.map((id) => assets.masks[id])];
  return `<button class="title-rose-medallion" data-a="rose" aria-label="Open the Rose Window" disabled>
    <span class="title-rose-composite">${panes}<img src="${escHtml(assets.frame)}" alt=""></span>
    <span class="title-rose-preload" aria-hidden="true">${urls.map((url) => `<img src="${escHtml(url)}" alt="">`).join('')}</span>
  </button>`;
}

function decodeTitleRoseAssets(root) {
  const medallion = $('.title-rose-medallion', root);
  if (!medallion) return;
  const images = $$('.title-rose-preload img', medallion);
  const decode = (image) => {
    if (image.decode) return image.decode();
    if (image.complete) return image.naturalWidth ? Promise.resolve() : Promise.reject(new Error('Rose asset failed to load'));
    return new Promise((resolve, reject) => {
      image.addEventListener('load', resolve, { once: true });
      image.addEventListener('error', reject, { once: true });
    });
  };
  Promise.all(images.map(decode))
    .then(() => {
      if (!medallion.isConnected) return;
      medallion.disabled = false;
      medallion.classList.add('ready');
    })
    .catch(() => {});
}

function renderTitle() {
  setTheme(0);
  const vigil = syncVigil(); // reconcile any owed unlocks (e.g. seeded from old stats)
  const saved = E.loadRun();
  if (E.savedRunRequiresFinalisation(saved)) { startRun(saved, true); return; }
  const d = vigil.deeds;
  const banner = assetUrl('title-background', 'background');
  const titleText = assetUrl('title', 'title');
  const rose = roseAssets();
  const ver = getVersionInfo();
  const sc = screenEl();
  sc.innerHTML = `<div class="title-screen screen-enter">
    ${banner ? `<div class="title-banner"><div class="title-banner-frame"><img class="raster-art" src="${banner}" alt=""></div></div>` : ''}
    <div class="logo${titleText ? ' logo-raster' : ''}" data-version-logo>${titleText ? `<img class="title-wordmark" src="${titleText}" alt="SPIREBOUND">` : 'SPIREBOUND'}</div>
    <div class="tagline">A Roguelite Deckbuilder · The Vigil Remembers</div>
    ${titleRoseMedallion(vigil, rose)}
    <div class="title-btns">
      ${saved ? '<button class="btn" data-a="continue">Continue Climb</button>' : ''}
      <button class="btn" data-a="embark">Begin the Climb</button>
      <button class="btn ghost${vigil.news && !REDUCED ? ' news' : ''}" data-a="vigil">The Vigil</button>
      <button class="btn ghost" data-a="help">How to Play</button>
      <button class="btn ghost" data-a="settings">Settings</button>
    </div>
    <div class="title-stats">${d.runs} climbs · ${d.wins} dawns · ${d.slain} slain${vigil.unlocks.length ? ` · ${vigil.unlocks.length} secrets unearthed` : ''}</div>
    <div class="title-version" data-version-display aria-label="App version">${escHtml(ver.display)}</div>
    <div class="title-version-debug" data-version-debug aria-live="polite" hidden></div>
  </div>`;
  decodeTitleRoseAssets(sc);
  const logo = sc.querySelector('[data-version-logo]');
  const debugEl = sc.querySelector('[data-version-debug]');
  let taps = [];
  let debugTimer = 0;
  const hideDebug = () => {
    if (!debugEl) return;
    debugEl.hidden = true;
    debugEl.textContent = '';
  };
  const showDebug = () => {
    if (!debugEl) return;
    debugEl.hidden = false;
    debugEl.textContent = `${ver.gitSha} · ${ver.release ? 'release' : 'dev'}`;
    clearTimeout(debugTimer);
    debugTimer = setTimeout(hideDebug, 3000);
  };
  logo?.addEventListener('click', (e) => {
    e.stopPropagation();
    const now = performance.now();
    taps = taps.filter((t) => now - t < 2000);
    taps.push(now);
    if (taps.length >= 5) {
      taps = [];
      if (debugEl && !debugEl.hidden) hideDebug();
      else showDebug();
    }
  });
  sc.onclick = (e) => {
    const t = e.target.closest('[data-a]');
    if (!t || t.disabled) return;
    const a = t.dataset.a;
    unlock(); sfx.click();
    if (a === 'embark') show('embark');
    else if (a === 'continue' && saved) startRun(saved, true);
    else if (a === 'vigil') show('vigil');
    else if (a === 'rose') show('vigil', { tab: 'rose' });
    else if (a === 'help') showHelp();
    else if (a === 'settings') openSettingsPanel();
  };
  meshBindTitle();
}
// EMBARK — where a climb is configured. Grows as the Vigil reveals more: a
// fresh profile sees a single Begin button; the aspect choice arrives with
// 'aspect2', the vow ladder with the first dawn.
function renderEmbark() {
  setTheme(0);
  const vigil = syncVigil();
  const saved = E.loadRun();
  if (E.savedRunRequiresFinalisation(saved)) { startRun(saved, true); return; }
  const sel = (S.embark ||= { aspect: 0, vow: 0 });
  const hasAspects = vigil.unlocks.includes('aspect2');
  if (!hasAspects) sel.aspect = 0;
  sel.vow = Math.max(0, Math.min(sel.vow | 0, vigil.vowUnlocked));
  const aspectRow = hasAspects ? `<div class="embark-label">Who carries the lantern</div>
    <div class="aspect-row">${ASPECTS.map((a, i) => `
      <button class="aspect-card${sel.aspect === i ? ' on' : ''}" data-a="asp" data-i="${i}">
        <div class="asp-hero">${heroArt(i)}</div>
        <div class="asp-name">${a.name}</div>
        <div class="asp-blurb">${a.blurb}</div>
      </button>`).join('')}</div>` : '';
  const vowLine = sel.vow === 0
    ? 'The Spire as it is. No vows sworn.'
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
    <div class="embark-title">THE CLIMB BEGINS</div>
    <div class="embark-sub">${hasAspects || vigil.vowUnlocked > 0 ? 'Choose how you meet the Spire.' : 'The lantern is lit. The Spire waits.'}</div>
    ${aspectRow}
    ${vowBlock}
    ${saved ? '<div class="embark-warn">Beginning anew abandons your saved climb.</div>' : ''}
    <div class="title-btns">
      <button class="btn btn-primary" data-a="begin">${saved ? 'Begin Anew' : 'Begin the Climb'}</button>
      <button class="btn ghost" data-a="back">Back</button>
    </div>
  </div>`;
  const beginClimb = () => {
    const v = syncVigil(); // re-read after abandon so the next snapshot sees new reveals
    startRun(E.newRun(undefined, {
      aspect: sel.aspect,
      vow: sel.vow,
      lamplighter: isRevealed(v, 'lamplighter'),
      monument: v.lastFall,
      unlocks: v.unlocks, // the fix: deed unlocks finally reach live pools
      reveals: revealSnapshot(v),
      quests: questSnapshot(v),
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
        <div class="ov-title">Begin Anew?</div>
        <div class="ov-sub">Your saved climb will be lost to the void.</div>
        <div class="ov-actions"><button class="btn danger" data-a="yes">Begin Anew</button><button class="btn ghost" data-a="no">Keep Climbing</button></div>
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
// THE VIGIL — the hall between climbs. Phase 1 ships the Deeds tab; the
// Emberglass rose window joins it when the chain arms (Phase 2).
function renderVigil({ tab = 'deeds' } = {}) {
  setTheme(0);
  const v = clearNews(); // opening the hall reads the news
  const hasRose = isRevealed(v, 'emberglass');
  const assets = roseAssets();
  const deedRows = Object.entries(DEEDS).map(([id, deed]) => {
    const cur = v.deeds[deed.stat] || 0;
    const done = cur >= deed.n;
    const pct = Math.min(100, Math.round((cur / deed.n) * 100));
    const rewards = deed.unlocks.map((u) => {
      if (u === 'aspect2') return 'The Ashwarden';
      const [k, rid] = u.split(':');
      return k === 'card' ? (CARDS[rid]?.name || rid) : (RELICS[rid]?.name || rid);
    }).join(', ');
    const du = assetUrl('deeds', id);
    const art = du
      ? `<img class="deed-art" src="${du}" alt="">`
      : `<span class="deed-art-fallback">${iconSvg(`deed-${id}`, 40)}</span>`;
    return `<div class="deed-row${done ? ' done' : ''}">
      ${art}
      <div class="deed-body">
        <div class="deed-head"><span class="deed-name">${done ? '✦ ' : ''}${deed.name}</span><span class="deed-count">${Math.min(cur, deed.n)}/${deed.n}</span></div>
        <div class="deed-desc">${deed.desc} → <i>${rewards}</i></div>
        <div class="deed-bar"><span style="width:${pct}%"></span></div>
      </div>
    </div>`;
  }).join('');
  const sc = screenEl();
  const draw = (requested) => {
    const active = requested === 'rose' && hasRose ? 'rose' : 'deeds';
    sc.innerHTML = `<div class="center-panel screen-enter"><div class="panel vigil-panel${active === 'rose' ? ' rose-tab-open' : ''}">
      <div class="ov-title">The Vigil</div>
      <div class="ov-sub">${v.deeds.runs} climbs · ${v.deeds.wins} dawns · deepest Vow: ${ROMAN[v.deeds.bestVow] || '—'}</div>
      <div class="vigil-tabs">
        <button class="vtab${active === 'deeds' ? ' on' : ''}" data-a="tab-deeds">Deeds</button>
        ${hasRose ? `<button class="vtab${active === 'rose' ? ' on' : ''}" data-a="tab-rose">Rose Window</button>` : ''}
      </div>
      ${active === 'rose' ? roseSurfaceHtml(v, assets) : `<div class="deed-list">${deedRows}</div>`}
      <div class="ov-actions"><button class="btn" data-a="back">Return</button></div>
    </div></div>`;
    if (active === 'rose') decodeRoseAssets(sc);
  };
  draw(tab);
  sc.onclick = (e) => {
    const t = e.target.closest('[data-a]');
    if (!t) return;
    sfx.click();
    if (t.dataset.a === 'tab-deeds') draw('deeds');
    else if (t.dataset.a === 'tab-rose' && hasRose) draw('rose');
    else if (t.dataset.a === 'rose-pane') selectRosePane(sc, v, Number(t.dataset.index));
    else if (t.dataset.a === 'back') show('title');
  };
}
function resumePendingHollowRoute(run) {
  const route = run.pendingHollowRoute;
  if (!route) return false;
  const node = run.map.nodes.find((candidate) => candidate.id === route.nodeId);
  if (!node) return false;
  routeVisitedNode(node, route.type, { eventId: route.eventId });
  return true;
}
function startRun(run, resumed = false) {
  if (!resumed && persistenceDialogTransaction) return;
  S.run = run;
  S.cb = null;
  setTheme(run.act);
  const curNode = run.nodeId ? run.map.nodes.find((n) => n.id === run.nodeId) : null;
  setAltitude(run.act, curNode ? curNode.row : 0);
  const continueStart = () => routeStartedRun(run, resumed, curNode);
  if (!resumed && !requireRunSave(run, continueStart)) return;
  continueStart();
}
function routeStartedRun(run, resumed, curNode) {
  if (run.pendingDawn) { show('end', { won: true }); return; }
  if (run.pendingRunEnd) { finalisePendingRunEnd(run); return; }
  if (run.pendingHollow) { show('hollow', { nodeId: run.pendingHollow.nodeId }); return; }
  if (run.pendingReward) { show('reward'); return; }
  if (resumed && run.pendingCombat) {
    // died-to-reload protection: an unfinished fight restarts fresh
    const node = run.map.nodes.find((n) => n.id === run.nodeId);
    const ids = run.pendingEnemyIds || E.rollEncounter(run, run.pendingCombat, node ? node.row : 5, node);
    const resumeCombat = () => {
      S.screen = 'combat';
      startCombatUI(ids, run.pendingCombat);
      renderHud();
    };
    const resumePersistedCombat = () => resumeSavedCombat(run, resumeCombat);
    if (!run.pendingEnemyIds) {
      E.setPendingEncounter(run, run.pendingCombat, ids, run.pendingQuestId);
      if (!requireRunSave(run, resumePersistedCombat)) return;
    }
    resumePersistedCombat();
    return;
  }
  if (run.pendingHollowRoute) { resumePendingHollowRoute(run); return; }
  if (resumed && curNode?.type === 'monument' && run.monument) {
    if (!run.monument.claimed) { claimMonumentNode(curNode); return; }
    const continueMap = () => show('map');
    if (!requireBequestClear(continueMap)) return;
    continueMap();
    return;
  }
  if (E.hasPendingBossRelic(run)) { show('bossRelic'); return; }
  if (run.pendingLamplighter) { renderLamplighter(); return; } // the gift comes before the first step
  show('map');
  if (!resumed) setTimeout(() => omenBanner(run), 900);
}
// THE LAMPLIGHTER — run start: one boon of three, and the fire the lantern carries.
function renderLamplighter() {
  const run = S.run;
  if (S.screen !== 'lamplighter') wipe();
  S.screen = 'lamplighter';
  music.playForScreen('lamplighter');
  closeMenus();
  clearOverlay();
  setTheme(0);
  screenEl().className = '';
  if (!S.lamp) {
    const rng = E.runRng(run);
    const pool = Object.keys(BOONS).filter((id) => E.runRevealed(run, 'phials') || !BOONS[id].ops.some((op) => op.potion));
    const boons = [];
    while (boons.length < 3 && pool.length) boons.push(pool.splice(Math.floor(rng() * pool.length), 1)[0]);
    S.lamp = { boons, boon: null, art: run.art };
    E.saveRun(run); // the draw is now fixed for this run
  }
  const L = S.lamp;
  const asp = ASPECTS[run.aspect];
  const boonCards = L.boons.map((id) => {
    const b = BOONS[id];
    const bu = assetUrl('boons', id);
    return `<button class="lamp-boon${L.boon === id ? ' on' : ''}" data-a="boon" data-i="${id}">
      ${bu ? `<img class="lb-art-img" src="${bu}" alt="">` : ''}
      <div class="lb-name">${iconSvg(`boon-${id}`, 20)} ${b.name}</div><div class="lb-text">${fmtText(b.text)}</div>
    </button>`;
  }).join('');
  const artChips = Object.keys(ARTS).map((id) => {
    const a = ARTS[id];
    const au = assetUrl('arts', id);
    return `<button class="lamp-art${L.art === id ? ' on' : ''}" data-a="art" data-i="${id}">
      ${au ? `<img class="la-art-img" src="${au}" alt="">` : `<span class="la-glyph" style="color:${a.tone}">${iconSvg(`art-${id}`, 18)}</span>`}<span class="la-name">${a.name}</span>
    </button>`;
  }).join('');
  const chosen = ARTS[L.art];
  const sc = screenEl();
  sc.innerHTML = `<div class="lamp-screen screen-enter">
    ${sceneBg()}
    <div class="lamp-hero">${heroArt(run.aspect)}</div>
    <div class="lamp-title">THE LAMPLIGHTER</div>
    <div class="lamp-sub">${asp.name} stands at the foot of the Spire. Take one parting gift — and choose the fire your lantern will carry.</div>
    <div class="lamp-label">A Boon for the Road</div>
    <div class="lamp-boons">${boonCards}</div>
    <div class="lamp-label">Your Lantern Art <span class="lamp-hint">(press A in combat)</span></div>
    <div class="lamp-arts">${artChips}</div>
    <div class="lamp-art-desc">${chosen ? `<b style="color:${chosen.tone}">${iconSvg(`art-${L.art}`, 15)} ${chosen.name}</b> · ${fmtText(chosen.text)}` : ''}</div>
    <div class="lamp-actions"><button class="btn btn-primary" data-a="begin"${L.boon ? '' : ' disabled'}>${L.boon ? 'Light the Way' : 'Choose a boon'}</button></div>
  </div>`;
  renderHud();
  sc.onclick = (e) => {
    const t = e.target.closest('[data-a]');
    if (!t || t.disabled) return;
    const a = t.dataset.a;
    unlock(); sfx.click();
    if (a === 'boon') { L.boon = t.dataset.i; renderLamplighter(); }
    else if (a === 'art') { L.art = t.dataset.i; sfx.hover(); renderLamplighter(); }
    else if (a === 'begin' && L.boon) beginFromLamplighter();
  };
}
function beginFromLamplighter() {
  const run = S.run, L = S.lamp;
  run.art = L.art;
  E.applyBoon(run, L.boon);
  delete run.pendingLamplighter;
  const finish = () => {
    S.lamp = null;
    sfx.relic();
    show('map');
    setTimeout(() => omenBanner(run), 900);
  };
  if (!requireRunSave(run, finish)) return;
  finish();
}

function restoreDurableHollow(message) {
  S.run = E.loadRun();
  if (!S.run?.pendingHollow) { show('title'); return; }
  show('hollow', { nodeId: S.run.pendingHollow.nodeId });
  const error = $('.hollow-error', screenEl());
  if (error) error.textContent = message;
}

function exitHollow(run) {
  const route = E.stageHollowExit(run);
  if (!route) {
    const error = $('.hollow-error', screenEl());
    if (error) error.textContent = 'The way onward could not be prepared.';
    $$('[data-a^="hollow-"]', screenEl()).forEach((button) => {
      if (button.dataset.a === 'hollow-continue') button.disabled = !run.pendingHollow?.paid;
      else if (button.dataset.a === 'hollow-leave') button.disabled = !!run.pendingHollow?.paid;
    });
    return;
  }
  if (!E.saveRun(run)) {
    restoreDurableHollow('The way onward is not secured. Retry when storage is available.');
    return;
  }
  const node = run.map.nodes.find((candidate) => candidate.id === route.nodeId);
  if (!node) { show('map'); return; }
  routeVisitedNode(node, route.type, {
    enemyIds: route.kind === 'combat' ? route.enemyIds : null,
    eventId: route.kind === 'destination' ? route.eventId : null,
  });
}

// THE HOLLOW LAMPLIGHTER — a persisted interruption on the Unlit Way. The
// visited node is routed only after the price and Continue checkpoints hold.
function renderHollow() {
  const run = S.run;
  const pending = run?.pendingHollow;
  if (!pending) { show('map'); return; }
  const q = E.questRecord(run, 'hollowLamplighter');
  const paidAdvance = pending.paid && !pending.deferred ? 1 : 0;
  const meetingIndex = Math.max(0, Math.min(QUESTS.hollowLamplighter.meetings.length - 1,
    (q?.progress || 0) - paidAdvance));
  const meeting = QUESTS.hollowLamplighter.meetings[meetingIndex];
  const sc = screenEl();
  sc.innerHTML = `<div class="hollow-lamplighter${REDUCED ? ' reduced' : ''}">
    <div class="hollow-vignette"></div>
    <div class="hollow-figure" aria-hidden="true">
      <svg viewBox="0 0 180 300" role="presentation">
        <path class="hollow-cloak" d="M91 35c-24 3-38 28-35 59-14 22-24 58-27 101l-12 72c19 13 47 20 77 20 31 0 58-7 76-21l-14-72c-4-42-13-77-29-101 2-31-12-56-36-58Z"/>
        <path class="hollow-face" d="M69 67c7-17 37-18 45 0l-6 39c-9 8-24 8-33 0Z"/>
        <path class="hollow-staff" d="M139 56l5 217M127 68l19-30 17 31"/>
        <path class="hollow-lantern" d="M118 143h48l-5 63h-38Zm5 13h38m-31-13 5-15h14l6 15"/>
        <path class="hollow-void" d="M78 76c6-7 21-7 28 0l-4 21c-7 5-15 5-21 0Z"/>
      </svg>
    </div>
    <div class="hollow-copy screen-enter">
      <div class="hollow-kicker">THE UNLIT WAY · PRICE ${meetingIndex + 1} OF ${QUESTS.hollowLamplighter.target}</div>
      <div class="hollow-title">THE HOLLOW LAMPLIGHTER</div>
      <div class="hollow-ask">“${escHtml(meeting.ask)}”</div>
      <div class="hollow-answer${pending.paid ? ' paid' : ''}" aria-live="polite">${pending.paid ? escHtml(pending.answer) : ''}</div>
      <div class="hollow-error" aria-live="assertive"></div>
      <div class="hollow-actions">
        <button class="btn btn-primary" data-a="hollow-pay"${pending.paid ? ' disabled' : ''}>${pending.paid ? 'Price Paid' : 'Pay the Price'}</button>
        <button class="btn ghost" data-a="hollow-continue"${pending.paid ? '' : ' disabled'}>Continue</button>
        <button class="btn ghost" data-a="hollow-leave"${pending.paid ? ' disabled' : ''}>Return Later</button>
      </div>
    </div>
  </div>`;
  sc.onclick = (e) => {
    const target = e.target.closest('[data-a]');
    if (!target || target.disabled) return;
    const action = target.dataset.a;
    if (action === 'hollow-pay') {
      target.disabled = true;
      unlock(); sfx.click();
      const result = E.payHollowPrice(run);
      const answer = $('.hollow-answer', sc);
      const error = $('.hollow-error', sc);
      const continueButton = $('[data-a="hollow-continue"]', sc);
      const leaveButton = $('[data-a="hollow-leave"]', sc);
      if (!result.ok) {
        answer.textContent = result.message;
        answer.classList.add('error');
        error.textContent = '';
        target.disabled = false;
        return;
      }
      if (!E.saveRun(run)) {
        answer.textContent = '';
        answer.classList.remove('paid', 'error');
        error.textContent = 'The price is not yet secured. Retry the save.';
        target.textContent = 'Retry Save';
        target.disabled = false;
        continueButton.disabled = true;
        leaveButton.disabled = true;
        return;
      }
      answer.textContent = result.message;
      answer.classList.remove('error');
      answer.classList.add('paid');
      error.textContent = '';
      target.textContent = 'Price Paid';
      continueButton.disabled = false;
      leaveButton.disabled = true;
      renderHud();
      return;
    }
    if (action === 'hollow-continue' && !run.pendingHollow?.paid) return;
    if (action === 'hollow-leave' && run.pendingHollow?.paid) return;
    if (!['hollow-continue', 'hollow-leave'].includes(action)) return;
    $$('[data-a^="hollow-"]', sc).forEach((button) => { button.disabled = true; });
    unlock(); sfx.click();
    exitHollow(run);
  };
}

const NODE_ICONS = { monster: 'sword', elite: 'skull', event: 'question', rest: 'flame', shop: 'coin', treasure: 'chest', boss: 'crown', monument: 'monument' };
function renderMap() {
  const run = S.run;
  if (run.pendingCombat) { // invariant: an unresolved fight always resumes
    const node = run.map.nodes.find((n) => n.id === run.nodeId);
    const ids = run.pendingEnemyIds || E.rollEncounter(run, run.pendingCombat, node ? node.row : 5, node);
    const resumeCombat = () => {
      S.screen = 'combat';
      startCombatUI(ids, run.pendingCombat);
    };
    const resumePersistedCombat = () => resumeSavedCombat(run, resumeCombat);
    if (!run.pendingEnemyIds) {
      E.setPendingEncounter(run, run.pendingCombat, ids, run.pendingQuestId);
      if (!requireRunSave(run, resumePersistedCombat)) return;
    }
    resumePersistedCombat();
    return;
  }
  if (run.pendingHollowRoute) { resumePendingHollowRoute(run); return; }
  E.saveRun(run);
  S.cb = null;
  const { nodes } = run.map;
  const avail = new Set(E.availableNodes(run).map((n) => n.id));
  const visited = new Set(run.map.visited);
  const curRow = run.nodeId ? nodes.find((n) => n.id === run.nodeId).row : -1;
  // the map lives ON the Spire: lanterns hang off the tower in 3D, and these
  // DOM nodes ride their projected screen positions every frame.
  let edges = '', dots = '';
  for (const n of nodes) {
    for (const nid of n.next) {
      const walked = visited.has(n.id) && visited.has(nid) ? 'walked' : '';
      edges += `<path class="medge ${walked}" style="--d:${n.row * 34}ms" data-a="${n.id}" data-b="${nid}" d="M0 0"/>`;
    }
  }
  for (const n of nodes) {
    const dark = n.unlit && !visited.has(n.id); // an unlit lantern keeps its secret
    const cls = [
      'mnode', `type-${n.type}`, dark ? 'unlit' : '',
      n.questMarked ? 'pale-marked' : '',
      visited.has(n.id) ? 'visited' : '',
      n.id === run.nodeId ? 'current' : '',
      avail.has(n.id) ? 'avail' : '',
    ].join(' ');
    const tf = COARSE ? 1.3 : 1; // lanterns grow to meet a fingertip
    const r = (n.type === 'boss' ? 26 : n.type === 'elite' || n.type === 'treasure' ? 19 : 16) * tf;
    const fs = Math.round(r * 2);
    // glyph oversized vs frame so it spills over the ring (intent 38/30, ward 34/26)
    const gs = Math.round(fs * 1.28);
    const glyphId = nodeGlyphId(n.type, dark);
    const frameU = uiIconUrl('node-frame');
    const glyphU = uiIconUrl(glyphId);
    // Prefer kit; monument meta raster remains fallback for monument when glyph missing
    const monUrl = (n.type === 'monument' && !glyphU) ? assetUrl('meta', 'monument-node') : null;
    // transparent hit disc — nframe/nglyph are PE:none decorative; without this
    // .mnode { pointer-events: visiblePainted } has nothing to hit on the raster path
    const hit = `<circle class="nhit" r="${Math.round(gs / 2)}" fill="transparent"/>`;
    let artHtml;
    if (frameU || glyphU || monUrl) {
      const frame = frameU
        ? `<image class="nframe" href="${frameU}" x="${-fs / 2}" y="${-fs / 2}" width="${fs}" height="${fs}" />`
        : `<circle class="bg" r="${dark ? 16 * tf : r}"/>`;
      const glyph = (glyphU || monUrl)
        ? `<image class="nglyph" href="${glyphU || monUrl}" x="${-gs / 2}" y="${-gs / 2}" width="${gs}" height="${gs}" />`
        : `<g class="icg">${iconInline(dark ? 'unlitLantern' : NODE_ICONS[n.type], gs)}</g>`;
      artHtml = `${frame}${glyph}`;
    } else {
      artHtml = `<circle class="bg" r="${dark ? 16 * tf : r}"/><g class="icg">${iconInline(dark ? 'unlitLantern' : NODE_ICONS[n.type], gs)}</g>`;
    }
    // selectable: duplicate art under feMorphology ring (same language as aim outlines)
    const sil = avail.has(n.id) ? `<g class="nsil">${artHtml}</g>` : '';
    const paleMark = n.questMarked
      ? `<g class="pale-lens" transform="translate(${Math.round(r * 0.8)} ${Math.round(-r * 0.8)})">
          <circle class="pale-lens-halo" r="11"/>
          <circle class="pale-lens-glass" r="7.5"/>
          <g transform="translate(-9 -9)">${iconSvg('paleMote', 18)}</g>
        </g>`
      : '';
    dots += `<g class="${cls}" data-node="${n.id}" style="--d:${n.row * 34}ms">
      ${hit}<g class="nwrap">${sil}${artHtml}</g>${paleMark}
    </g>`;
  }
  const act = ACTS[run.act];
  const omenId = run.omens?.[run.act];
  const omen = OMENS[omenId];
  const sealedDoorVisible = run.act === 2 && E.runRevealed(run, 'act4') &&
    run.shards.length >= PROGRESSION.revealThresholds.act4.shards;
  // map-node-outline: dilate alpha → ring only (mirrors #aim-outline-*)
  const mapDefs = `<defs><filter id="map-node-outline" x="-40%" y="-40%" width="180%" height="180%" color-interpolation-filters="sRGB">
    <feMorphology in="SourceAlpha" operator="dilate" radius="2.4" result="dilated"/>
    <feComposite in="dilated" in2="SourceAlpha" operator="out" result="ring"/>
    <feFlood flood-color="#fff6e0" flood-opacity="1" result="fill"/>
    <feComposite in="fill" in2="ring" operator="in"/>
  </filter></defs>`;
  screenEl().innerHTML = `
    <div class="map-title">ACT ${run.act + 1} — <b>${act.name.toUpperCase()}</b> — ${act.bossName} awaits${omen ? ` &nbsp;·&nbsp; <span class="mt-omen" style="color:${omen.tone}">${omenMark(omenId, 'mt-omen-art', 'mt-omen-fallback', 18)}<span class="mt-omen-name">${omen.name}</span></span>` : ''}</div>
    <div class="map-screen screen-enter">
      <div class="map-haze" style="--haze:${['#2a3a2e', '#1f2e40', '#3a2030'][run.act] ?? '#2a3a2e'}"></div>
      <svg class="map-svg" width="100%" height="100%">${mapDefs}${edges}${dots}</svg>
      ${sealedDoorVisible ? `<button class="sealed-door" data-a="sealed-door" aria-label="The sealed door">
        <span>${iconSvg('sealedDoor', 42)}</span><small>THE SEALED DOOR</small>
      </button>` : ''}
      <div class="map-hint">${COARSE ? 'drag' : 'scroll'} to survey the Spire</div>
    </div>`;
  const svg = $('.map-svg');
  const sealedDoor = $('.sealed-door');
  if (sealedDoor) {
    sealedDoor.onclick = (event) => {
      if (panEaten) return;
      event.stopPropagation();
      unlock();
      sfx.click();
      openOverlay(`<div class="panel sealed-door-panel">
        <div class="ov-title">THE SEALED DOOR</div>
        <div class="sealed-door-mark">${iconSvg('sealedDoor', 96)}</div>
        <div class="ov-sub">Six panes burn behind you. The lock answers, but does not open.</div>
        <div class="door-inscription">the climb continues</div>
        <div class="ov-actions"><button class="btn" data-a="close-door">Return to the summit</button></div>
      </div>`, (root) => {
        root.onclick = (closeEvent) => {
          if (closeEvent.target.closest('[data-a="close-door"]')) closeOverlay();
        };
      });
    };
  }
  let panEaten = false;
  svg.onclick = (e) => {
    if (panEaten) return; // that tap was a drag
    const g = e.target.closest('.mnode.avail');
    if (!g || S.busy) return;
    unlock();
    enterNode(nodes.find((n) => n.id === g.dataset.node));
  };
  // tooltips on nodes
  $$('.mnode', svg).forEach((g) => {
    const n = nodes.find((x) => x.id === g.dataset.node);
    const names = { monster: 'Monster', elite: 'Elite — beware', event: 'Unknown event', rest: 'Rest site', shop: 'Merchant', treasure: 'Treasure', boss: ACTS[run.act].bossName };
    const hints = { monster: 'A fight. Embers and gold for the swift.', elite: 'A titled foe - greater risk, a relic-grade purse.', event: 'Fate unwritten. Could be anything.', rest: 'Heal, or forge a card into its + form.', shop: 'Gold for cards, relics, phials.', treasure: 'A chest with no fight attached.', boss: 'The act ends here. Ready your deck.' };
    g._tip = n.questMarked
      ? { title: 'Witchlight trembles', body: 'Pale glass waits here.' }
      : n.unlit && !visited.has(n.id)
        ? { title: 'An unlit lantern', body: `What waits here is unknown — but first light pays a bounty of gold.${avail.has(n.id) ? ` ${COARSE ? 'Tap' : 'Click'} to travel here.` : ''}` }
        : { title: names[n.type], body: avail.has(n.id) ? `${COARSE ? 'Tap' : 'Click'} to travel here.` : '', sub: hints[n.type] };
  });
  // 3D wiring: anchors on the tower, camera dollies to the current row
  const anchors = nodes.map((n) => ({ id: n.id, pos: mapNodePos(run.act, n) }));
  const nodeEls = new Map($$('.mnode', svg).map((g) => [g.dataset.node, g]));
  const dimIds = new Set(nodes.filter((n) => !avail.has(n.id) && !visited.has(n.id)).map((n) => n.id));
  const edgeEls = $$('.medge', svg).map((p) => ({ p, a: p.dataset.a, b: p.dataset.b }));
  enterMapMode(run.act, Math.max(0, curRow));
  setOverlay(anchors, (pts) => {
    const P = new Map(pts.map((pt) => [pt.id, pt]));
    for (const [id, g] of nodeEls) {
      const pt = P.get(id);
      g.setAttribute('transform', `translate(${pt.x.toFixed(1)},${pt.y.toFixed(1)}) scale(${pt.s.toFixed(3)})`);
      // visited B&W is CSS; keep opacity high so the ash trail stays readable
      const seenDim = g.classList.contains('visited') && !g.classList.contains('current') ? 0.78 : 1;
      g.style.opacity = (pt.fade * (dimIds.has(id) ? 0.4 : 1) * seenDim).toFixed(3);
    }
    for (const { p, a, b } of edgeEls) {
      const A = P.get(a), B = P.get(b);
      const sag = 9 * (A.s + B.s) / 2; // chains between lanterns hang a little
      p.setAttribute('d', `M${A.x.toFixed(1)} ${A.y.toFixed(1)} Q${((A.x + B.x) / 2).toFixed(1)} ${((A.y + B.y) / 2 + sag).toFixed(1)} ${B.x.toFixed(1)} ${B.y.toFixed(1)}`);
      // walked edges stay bright (CSS paints them B&W); only fade with camera depth
      p.style.opacity = Math.min(A.fade, B.fade).toFixed(3);
    }
    if (sealedDoor) {
      const boss = nodes.find((node) => node.type === 'boss');
      const point = boss ? P.get(boss.id) : null;
      if (point) {
        const x = Math.max(74, Math.min(stageW() - 74, point.x));
        const y = Math.max(104, Math.min(stageH() - 92, point.y - 82));
        sealedDoor.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) translate(-50%,-50%) scale(${Math.max(0.78, point.s).toFixed(3)})`;
        sealedDoor.style.opacity = Math.max(0.72, point.fade).toFixed(3);
      }
    }
  });
  V.setWeather(run.act, { mult: 0.3 });
  const ms = $('.map-screen');
  ms.addEventListener('wheel', (e) => {
    e.preventDefault();
    peekMap(-e.deltaY * 0.006);
  }, { passive: false });
  // touch: drag the tower past you, with a little momentum on release
  let panY = null, panV = 0, panRaf = 0, panDist = 0;
  ms.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse') return;
    cancelAnimationFrame(panRaf);
    panY = e.clientY; panV = 0; panDist = 0; panEaten = false;
  });
  ms.addEventListener('pointermove', (e) => {
    if (panY == null || e.pointerType === 'mouse') return;
    const dy = e.clientY - panY;
    panY = e.clientY;
    panDist += Math.abs(dy);
    if (panDist > 14) panEaten = true;
    panV = dy;
    peekMap(dy * 0.014);
  });
  const panEnd = (e) => {
    if (panY == null || e.pointerType === 'mouse') return;
    panY = null;
    const coast = () => {
      panV *= 0.93;
      if (Math.abs(panV) < 0.5 || S.screen !== 'map') return;
      peekMap(panV * 0.014);
      panRaf = requestAnimationFrame(coast);
    };
    panRaf = requestAnimationFrame(coast);
    setTimeout(() => (panEaten = false), 80);
  };
  ms.addEventListener('pointerup', panEnd);
  ms.addEventListener('pointercancel', panEnd);
}
function showNodeBounty(node, bounty) {
  if (bounty) {
    // first light: the dark lantern pays for the walking
    sfx.coin();
    const g = $(`.mnode[data-node="${node.id}"]`);
    const from = g ? V.centerOf(g) : { x: stageW() / 2, y: stageH() / 2 };
    V.floatText(from.x, from.y - 34, `${iconSvg('coin', 12)} +${bounty}`, 'goldf');
    flyTo(from.x, from.y, 120, 30, { n: 5, color: '#ffe9ac', size: 7, dur: 620 });
  }
}
function enterNode(node) {
  const run = S.run;
  sfx.map();
  setAltitude(run.act, node.row);
  const { type, bounty, hollow } = E.visitNode(run, node);
  if (hollow) {
    if (!E.saveRun(run)) {
      S.run = E.loadRun();
      if (!S.run) { show('title'); return; }
      show('map');
      showRunSaveFailure(S.run, () => {});
      return;
    }
    showEighthFloorEcho(run);
    showNodeBounty(node, bounty);
    show('hollow', { nodeId: node.id });
    return;
  }
  showEighthFloorEcho(run);
  const isCombat = type === 'monster' || type === 'elite' || type === 'boss';
  if (!isCombat && type !== 'monument') E.saveRun(run);
  showNodeBounty(node, bounty);
  routeVisitedNode(node, type);
}
function routeVisitedNode(node, type, { enemyIds = null, eventId = null } = {}) {
  const run = S.run;
  const isCombat = type === 'monster' || type === 'elite' || type === 'boss';
  if (isCombat) {
    const ids = enemyIds ? [...enemyIds] : E.rollEncounter(run, type, node.row, node);
    if (!enemyIds) E.setPendingEncounter(run, type, ids);
    const beginCombat = () => {
      const g = $(`.mnode[data-node="${node.id}"]`);
      transition('combat-in', g ? V.centerOf(g) : {});
      startCombatUI(ids, type);
    };
    if (enemyIds) { beginCombat(); return; }
    if (!requireRunSave(run, beginCombat)) return;
    beginCombat();
  } else if (type === 'rest') show('rest');
  else if (type === 'shop') show('shop');
  else if (type === 'treasure') show('treasure');
  else if (type === 'event') show('event', eventId || E.rollEvent(run));
  else if (type === 'monument') claimMonumentNode(node);
}
function showEighthFloorEcho(run) {
  if (run.omens?.[run.act] !== 'eighthOmen') return;
  const echoes = QUESTS.eighthOmen.floorEchoes;
  const text = echoes[run.floorsClimbed % echoes.length];
  setTimeout(() => {
    if (S.run?.runId !== run.runId || !text) return;
    const b = el('div', 'turn-banner eighth-floor-echo broken-omen',
      `<span class="efe-icon">${iconSvg('eighthOmen', 24)}</span><span class="efe-text">${escHtml(text)}</span>`);
    screenEl().appendChild(b);
    setTimeout(() => b.remove(), 2200);
  }, REDUCED ? 0 : 180);
}
// stepping onto the stone a past self left behind
function claimMonumentNode(node) {
  const run = S.run;
  const continueMap = () => show('map');
  if (run.monument?.standing && !run.monument.claimed) {
    const transaction = E.beginShadeDuel(run, clearBequest);
    const beginDuel = () => {
      const g = $(`.mnode[data-node="${node.id}"]`);
      transition('combat-in', g ? V.centerOf(g) : {});
      startCombatUI([transaction.duel.variantId], 'monster');
    };
    if (transaction.status === E.SHADE_DUEL_TX.READY) {
      beginDuel();
      return;
    }
    const reloadPending = transaction.status === E.SHADE_DUEL_TX.RELOAD_PENDING;
    showStonePersistenceFailure(
      reloadPending ? () => location.reload() : () => claimMonumentNode(node),
      reloadPending ? 'Reload Saved Duel' : 'Retry',
    );
    return;
  }
  const b = E.claimMonument(run);
  if (!b) {
    if (!requireRunSave(run, continueMap)) return;
    continueMap();
    return;
  }
  const finishGift = () => {
    sfx.relic();
    const label = b.kind === 'relic' ? RELICS[b.id]?.name : b.kind === 'card' ? CARDS[b.id]?.name : `${b.amount} gold`;
    const g = $(`.mnode[data-node="${node.id}"]`);
    const from = g ? V.centerOf(g) : { x: stageW() / 2, y: stageH() / 2 };
    V.floatText(from.x, from.y - 34, `✦ ${label}`, 'goldf');
    flyTo(from.x, from.y, stageW() / 2, stageH() * 0.5, { n: 8, color: '#ffe9ac', size: 8, dur: 720 });
    banner('THE STONE REMEMBERS');
    show('map');
  };
  const clearThenFinish = () => {
    if (!requireBequestClear(finishGift)) return;
    finishGift();
  };
  if (!requireRunSave(run, clearThenFinish)) return;
  clearThenFinish();
}

// ------------------------------------------------------------ combat
function startCombatUI(enemyIds, kind) {
  exitMapMode(); // combat can start without going through show()
  clearOverlay();
  $('#tooltip').style.display = 'none';
  if (S.screen !== 'combat') wipe();
  S.cb = E.startCombat(S.run, enemyIds, kind);
  S.screen = 'combat';
  music.playForCombat(kind, S.run.act);
  V.setWeather(S.run.act, { boss: kind === 'boss' });
  renderCombat();
  renderHud();
  drain().then(afterAction);
}
function renderCombat() {
  const cb = S.cb;
  const sc = screenEl();
  sc.onclick = null;
  const ledge = `#${ACTS[S.run.act].theme.glow.toString(16).padStart(6, '0')}`;
  sc.innerHTML = `<div class="combat-screen screen-enter intro" style="--ledge:${ledge}">
    ${['backdrop', 'mid', 'ledge'].map((l) => {
      const u = assetUrl('stage', `act${S.run.act + 1}-${l}`);
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
    <div class="energy-orb" aria-label="Energy"><div class="num">0</div><div class="candles"></div></div>
    <button class="lantern-btn"><span class="lb-ic"></span><span class="lb-count">0</span><div class="lb-pips"></div></button>
    <button class="end-turn" type="button"><span class="et-ic">${uiIcon('end-turn', 120)}</span><span class="et-lbl">End</span></button>
    <button class="pile-btn pile-draw" type="button" aria-label="Draw pile">
      <span class="pile-stack" data-pile="draw" data-count="-1" data-tier="-1"></span>
      <span class="cnt">0</span>
      <span class="lbl">DRAW</span>
    </button>
    <button class="pile-btn pile-discard" type="button" aria-label="Discard pile">
      <span class="pile-stack" data-pile="discard" data-count="-1" data-tier="-1"></span>
      <span class="cnt">0</span>
      <span class="lbl">DISCARD</span>
    </button>
    <button class="pile-btn pile-exhaust" type="button" aria-label="Ashes pile">
      <span class="pile-stack" data-pile="ashes" data-count="-1" data-tier="-1"></span>
      <span class="cnt">0</span>
      <span class="lbl">ASHES</span>
    </button>
    <div class="hand-zone"></div>
  </div>`;
  const zone = $('.enemy-zone', sc);
  const ce = { enemies: [], root: $('.combat-screen', sc) };
  const afx = cb.affix ? AFFIXES[cb.affix] : null;
  const L = bfResolve(stageInfo().shape, S.run.act);
  const slots = bfSlots(L, cb.enemies.length);
  cb.enemies.forEach((en, i) => {
    const d = en.def || ENEMIES[en.key];
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
      title: 'Facets',
      body: 'Every creature is glass. Attacks that draw unblocked blood chip a facet; fill the gauge and the glass <b>shatters</b> — it loses its next action, is Cracked, and spills Embers into your lantern.',
    };
    if (afx) $('.name', box)._tip = { title: `${afx.name} — an elite's title`, body: afx.text };
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
  const art = ARTS[artId];
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
    title: art ? `Lantern Art — ${art.name}` : 'The Lantern',
    body: `${art ? `<b>${art.cost} Embers, once a turn:</b> ${art.text}<br><br>` : ''}The lantern holds the <b>Embers</b> spilled by shattered and slain glass. Drag any card onto it to <b>kindle</b> — burn the card away for an ember, once a turn. Curses refuse the fire.`,
    sub: 'A · use Art',
  };
  ce.lantern.onclick = async () => {
    if (S.busy || !S.cb || S.cb.over) return;
    unlock();
    if (!E.canUseArt(S.run, S.cb)) {
      ce.lantern.classList.add('nope');
      setTimeout(() => ce.lantern.classList.remove('nope'), 350);
      sfx.debuff();
      return;
    }
    clearTargeting();
    E.useArt(S.run, S.cb);
    await drain();
    afterAction();
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
  ce.draw.onclick = () => { sfx.click(); showCardGrid('Draw Pile', cb.draw, { sub: 'Order hidden — shown alphabetically', inCombat: true }); };
  ce.discard.onclick = () => { sfx.click(); showCardGrid('Discard Pile', cb.discard, { inCombat: true }); };
  ce.exhaust.onclick = () => { sfx.click(); showCardGrid('The Ashes', cb.exhaust, { sub: 'Burned away — each fed the lantern an ember', inCombat: true }); };
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
  const hero = bfActor('heroes', ASPECTS[S.run.aspect].id);
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
    const d = en.def || ENEMIES[en.key];
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
  placeTop($('#omen-slot'), L.omen);
  placeTop($('#relicbar'), L.relics);
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

/** Top edge of resting hand cards — bottom chrome must stay above this. */
function handChromeCeiling() {
  const hand = S.ce?.hand;
  if (!hand) return stageH() - 8;
  let top = Infinity;
  for (const c of hand.querySelectorAll('.card:not(.draw-pending)')) {
    const r = stageRect(c);
    if (r.height > 2) top = Math.min(top, r.top);
  }
  if (top < Infinity) return top;
  // no seats yet — estimate from zone + resting card bottom inset
  const zr = stageRect(hand);
  const sz = handFaceSize();
  const inset = handCardBottomInset();
  if (zr.height > 2) return zr.bottom - inset - sz.h;
  return stageH() - inset - sz.h;
}

/**
 * Keep combat chrome on-stage: tall sprites push top chrome down into the art;
 * bottom plate (name/HP/facets) cannot sit under the hand.
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

  // Portrait formations can put independently edge-clamped chrome on top of
  // one another. Keep the authored actors in place and pack enemy chrome, in
  // DOM order, against the right edge. Top and bottom chrome are independent
  // rows: their visible descendants have different widths and vertical spans.
  // Dead members stay in each set so killing one foe cannot move survivors.
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
    const packedLeft = maxRight - packedWidth;
    const heroSharesRows = heroRect && rects.some((r) => overlapsVertically(heroRect, r));
    const packedMinLeft = heroSharesRows ? Math.max(minLeft, heroRect.right + gap) : minLeft;
    if (packedLeft >= packedMinLeft) {
      let targetLeft = packedLeft;
      elements.forEach((el, i) => {
        const currentDx = Number.parseFloat(el.style.getPropertyValue('--chrome-dx')) || 0;
        el.style.setProperty('--chrome-dx', `${currentDx + targetLeft - rects[i].left}px`);
        targetLeft += rects[i].width + gap;
      });
    }
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
// rotate the phone mid-fight and the stage re-fits itself
let fitT = 0;
addEventListener('resize', () => {
  clearTimeout(fitT);
  fitT = setTimeout(() => { if (S.cb && S.ce && S.screen === 'combat') refitCombat(); }, 120);
});

function statusChips(container, statuses, isPlayer) {
  container.innerHTML = '';
  for (const [id, n] of Object.entries(statuses)) {
    if (!n) continue;
    const info = STATUS_INFO[id] || { name: id, icon: '?', kind: 'buff', desc: '' };
    const kind = id === 'str' && n < 0 ? 'debuff' : info.kind;
    const u = assetUrl('statuses', id);
    const art = u
      ? `<img class="schip-art" src="${u}" alt="">`
      : (hasIcon(`st-${id}`) ? iconSvg(`st-${id}`, 32) : info.icon);
    const count = Math.abs(n) >= 2 ? `<span class="n">${n}</span>` : '';
    const chip = el('span', `schip ${kind}`, `${art}${count}`);
    chip._tip = { title: info.name, body: info.desc.replace(/\bN\b/g, Math.abs(n)), sub: kind === 'debuff' ? 'Debuff' : 'Buff' };
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
  if (mv.addCards) tipBits.push(`add ${mv.addCards.n} ${CARDS[mv.addCards.id].name}s to your discard`);
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
      x.intent.innerHTML = `<span class="ic">${iconSvg('stagger', 38)}</span><span class="num">STAGGERED</span>`;
      x.intent._tip = { title: 'Staggered', body: 'The glass has shattered — this creature loses its next action while it reseams.' };
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
    const d = E.cardData(inst);
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
    if (cancelled) { clearTargeting(); layoutHand(); return; }
    // the lantern is always listening: release a card on it to kindle
    const overLantern = underPointer(e.clientX, e.clientY)?.closest('.lantern-btn');
    if (overLantern) {
      const inst = S.cb.hand.find((x) => x.uid === uid);
      if (inst && E.canKindle(S.run, S.cb, inst)) { clearTargeting(); doKindle(uid); return; }
      clearTargeting(); layoutHand(); return;
    }
    if (st.kindleOnly) { S.hoveredCard = null; layoutHand(); return; } // nowhere else to go
    if (st.free) {
      if (toStage(e.clientX, e.clientY).y < castLine()) doPlay(uid, null);
      else { S.hoveredCard = null; layoutHand(); }
      return;
    }
    const en = document.elementFromPoint(e.clientX, e.clientY)?.closest('.enemy');
    const idx = en ? +en.dataset.idx : -1;
    const living = S.cb.enemies.filter((x) => x.hp > 0);
    if (idx >= 0 && S.cb.enemies[idx].hp > 0) doPlay(uid, idx);
    else if (living.length === 1 && toStage(e.clientX, e.clientY).y < castLine()) doPlay(uid, living[0].idx); // one foe: releasing high is aim enough
    else { clearTargeting(); layoutHand(); }
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
  const d = E.cardData(inst);
  if (d.unplayable || E.effCost(S.run, cb, inst) > cb.player.energy) {
    // unplayable panes can still be fuel: the drag lives, but only the lantern will take it
    if (E.canKindle(S.run, cb, inst)) {
      st.live = true;
      st.free = true;
      st.kindleOnly = true;
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
  S.hoveredCard = null;
  if (!E.kindleFromHand(S.run, S.cb, uid)) { layoutHand(); return; }
  await drain();
  afterAction();
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
  const d = inst ? E.cardData(inst) : null;
  const aiming = S.targeting?.kind === 'card' || (S.drag?.live && !S.drag.free);
  const living = cb.enemies.filter((e) => e.hp > 0).length;
  const inspect = !!(inst && !cb.over && !d.unplayable && !aiming);
  meshAimClear();
  const heroOn = inspect && d.target === 'self';
  ce.hero?.classList.toggle('aim-target', heroOn);
  if (heroOn) {
    const sprite = $('.hero-sprite', ce.hero) || ce.hero;
    const heroId = ASPECTS[S.run.aspect].id;
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
  const d = E.cardData(inst);
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
  S.targeting = null;
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
  // Prefer drag-captured seat; else freeze current hand seat before clearTargeting reflows
  if (!cardFlightAnchor.has(String(uid))) {
    const c = $(`.card[data-uid="${uid}"]`, S.ce?.hand);
    if (c) captureCardAnchor(uid, c);
  }
  clearTargeting();
  S.hoveredCard = null;
  if (!E.playCard(S.run, S.cb, uid, targetIdx)) return;
  await drain(targetIdx);
  afterAction();
}
async function onEndTurn() {
  if (S.busy || !S.cb || S.cb.over) return;
  clearTargeting();
  sfx.click();
  E.endTurn(S.run, S.cb);
  await drain();
  afterAction();
}
function banner(text) {
  const b = el('div', 'turn-banner', text);
  screenEl().appendChild(b);
  setTimeout(() => b.remove(), 1150);
}

// ceremony: things travel — coins to the purse, relics to the bar, card-backs
// from the discard to the draw pile. One arc-flight helper for all of it.
function flyTo(x0, y0, x1, y1, { n = 6, color = '#ffe9ac', size = 8, dur = 640, glyph = '', cls = 'flymote', done = null } = {}) {
  const layer = $('#floaties');
  for (let i = 0; i < n; i++) {
    const m = el('div', cls, glyph);
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
    anim.onfinish = () => { m.remove(); if (i === n - 1 && done) done(); };
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
  const sizePile = opts.sizePile || toEl;
  const artUrl = (opts.face === 'back' || opts.face === 'card')
    ? null
    : assetUrl('piles', pileMasterId(opts.pileArt || 'draw'));
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
    m.animate(keyframes, {
      duration: flightDur, delay: i * stagger, easing, fill: 'forwards',
    }).onfinish = () => m.remove();
  });
  return sleep(awaitMs);
}

/** Resolve a card instance already moved into a pile (engine mutates before drain). */
function pileCardByUid(pile, uid) {
  return (pile || []).find((c) => String(c.uid) === String(uid)) || null;
}

// --------- the living-glass rig: one rAF drives eyes, inner fire and light pools
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
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
  const heroId = ASPECTS[S.run.aspect].id;
  add(ce.hero, ce.hero, 'rgba(127,212,255,.62)', true, 0, 'humanoid', 0, assetUrl('heroes', heroId), heroId, bfActor('heroes', heroId).footY);
}
function meshBindCombatants() {
  if (!meshEnabled()) return;
  const ce = S.ce, cb = S.cb;
  if (!ce || !cb) return;
  const entries = [];
  const heroUrl = assetUrl('heroes', ASPECTS[S.run.aspect].id);
  // bind the sprite, not .hero-wrap: the raster must be a DIRECT child of the
  // mesh-live element or it stays visible under the warp copy (double vision),
  // and the wrap's rect includes the name label which would stretch the plane
  const heroSprite = ce.hero && ($('.hero-sprite', ce.hero) || ce.hero);
  if (heroUrl && heroSprite) entries.push({ el: heroSprite, url: heroUrl, kind: 'humanoid', id: ASPECTS[S.run.aspect].id });
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
let heroActing = false; // true between a card play and end of turn — gates the hero lunge
// which card/move caused the hits now playing back — set by 'play'/'enemyAct'/'art'
let vfxSource = { archetype: 'slash', cardId: null, enemyIdx: null };
let bespokeFired = false;
let choreoDone = false;
let hitSeq = 0;
const ENEMY_KIND_VFX = {
  beast: 'slash', rogue: 'slash', knight: 'slash', sovereign: 'slash',
  golem: 'blunt', treeboss: 'blunt', crab: 'blunt', leviathan: 'blunt', zombie: 'blunt',
  serpent: 'pierce', crawler: 'pierce', maw: 'pierce', plant: 'pierce',
  wisp: 'void', shade: 'void', eye: 'void', siren: 'void', cultist: 'void',
  slime: 'poison',
};
// ---- combat choreography: WAAPI, transform-only, REDUCED-gated ----
const CHOREO_REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const HEAVY_KINDS = new Set(['golem', 'treeboss', 'leviathan', 'crab']);
const FLOATY_KINDS = new Set(['wisp', 'shade', 'siren', 'eye', 'cultist']);
function choreoAttack(el, dir = 1, kind = 'humanoid') {
  if (CHOREO_REDUCED || !el) return Promise.resolve();
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
  if (CHOREO_REDUCED || !el) return;
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
  if (CHOREO_REDUCED || !el) return Promise.resolve();
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
async function drain(targetIdx = null) {
  const cb = S.cb, ce = S.ce;
  S.busy = true;
  ce.endTurn.classList.add('enemy-phase');
  const q = cb.queue;
  while (q.length) {
    const ev = q[0];
    try {
      // drawCards may emit draw* → reshuffle → draw*; keep one wave so hand stays paced
      if (ev.t === 'draw' || ev.t === 'reshuffle') {
        await handleDrawWave(q);
      } else {
        q.shift();
        await handleEvent(ev, targetIdx);
      }
    } catch (err) { console.error('vfx event error', ev, err); }
  }
  S.busy = false;
  if (!cb.over) ce.endTurn.classList.remove('enemy-phase');
  pileVisualOverride = null;
  syncCombat();
  syncHand();
  renderHud();
}

/** Parse draw/reshuffle/draw segments from the front of the queue. */
function takeDrawWaveSegments(q) {
  const segments = [];
  while (q[0]?.t === 'draw' || q[0]?.t === 'reshuffle') {
    if (q[0].t === 'reshuffle') {
      segments.push({ t: 'reshuffle', ev: q.shift() });
    } else {
      const draws = [];
      while (q[0]?.t === 'draw') draws.push(q.shift());
      segments.push({ t: 'draws', draws });
    }
  }
  return segments;
}

async function playReshuffleCeremony(ev) {
  const cb = S.cb, ce = S.ce;
  sfx.card();
  const n = ev.n || 6;
  if (pileVisualOverride) {
    pileVisualOverride.discard = n;
    pileVisualOverride.draw = 0;
    syncPileWidgets(cb);
  } else {
    holdPileVisual('draw', n);
    syncPileWidgets(cb);
  }
  const origins = Array.from({ length: n }, () => V.centerOf(ce.discard));
  await flyCardBacks(origins, ce.draw, 560, {
    fromSize: 'pile', sizePile: ce.discard, pileArt: 'discard',
  });
  if (pileVisualOverride) {
    pileVisualOverride.discard = 0;
    pileVisualOverride.draw = n;
  } else {
    releasePileVisual('draw', n);
  }
  bumpPile(ce.draw);
  V.floatText(V.centerOf(ce.draw).x, V.centerOf(ce.draw).y - 46, 'Reshuffle', 'notice');
  syncPileWidgets(cb);
}

/** One drawCards wave: pre-pending all hand seats, then draw / reshuffle / draw in order. */
async function handleDrawWave(q) {
  const cb = S.cb, ce = S.ce;
  const segments = takeDrawWaveSegments(q);
  const reshuffle = segments.find((s) => s.t === 'reshuffle');

  // Resting seats only — clear hover so flyers never aim at a lifted card
  if (S.hoveredCard != null) S.hoveredCard = null;

  // Engine is already post-draw — reconstruct chrome so piles still look pre-wave
  const firstSegDraws = segments[0]?.t === 'draws' ? segments[0].draws.length : 0;
  pileVisualOverride = {
    // mid-reshuffle wave: only the pre-reshuffle stock is still "in" the draw pile
    // plain draw wave: remaining engine draw + cards about to fly
    draw: segments[0]?.t === 'draws'
      ? (reshuffle ? firstSegDraws : cb.draw.length + firstSegDraws)
      : 0,
    discard: reshuffle ? (reshuffle.ev.n || 0) : 0,
  };

  // Pre-mark EVERY card in this wave as pending before syncHand (fixes mid-reshuffle pop-in)
  drawRevealPlan.clear();
  let seq = 0;
  for (const seg of segments) {
    if (seg.t !== 'draws') continue;
    for (const ev of seg.draws) {
      drawRevealPlan.set(String(ev.uid), { landAt: null, seq: seq++ });
    }
  }
  syncHand();
  syncPileWidgets(cb);

  let baseFan = $$('.card', ce.hand).filter((c) => !c.classList.contains('draw-pending')).length;
  let arrival = 0;

  for (const seg of segments) {
    if (seg.t === 'reshuffle') {
      await playReshuffleCeremony(seg.ev);
      continue;
    }
    const draws = seg.draws;
    const n = draws.length;
    if (!n) continue;
    const sched = drawBatchSchedule(n, 500);

    // Arm reveal timers now that this segment's clock starts
    draws.forEach((ev, i) => {
      const uid = String(ev.uid);
      const landAt = REDUCED ? 0 : sched.flightDur + i * sched.stagger;
      drawRevealPlan.delete(uid);
      const c = $(`.card[data-uid="${uid}"]`, ce.hand);
      if (c && !REDUCED) scheduleHandReveal(c, landAt);
      else if (c) {
        c.classList.remove('draw-pending');
      }
    });

    if (!REDUCED) {
      const origin = V.centerOf(ce.draw);
      const fromList = draws.map((ev, i) => {
        const inst = cb.hand.find((c) => String(c.uid) === String(ev.uid))
          || { uid: ev.uid, id: ev.id, up: false, bonus: 0 };
        const dest = handSeatCenter(baseFan + arrival + i, baseFan + arrival + i + 1);
        return { x: origin.x, y: origin.y, inst, dest };
      });
      // Shrink visual draw as each flyer leaves the pile
      draws.forEach((_, i) => {
        setTimeout(() => {
          if (!pileVisualOverride) return;
          pileVisualOverride.draw = Math.max(0, (pileVisualOverride.draw || 0) - 1);
          syncPileWidgets(cb);
        }, i * sched.stagger);
      });
      flyCardBacks(fromList, ce.hand, 500, {
        fromSize: 'pile', toSize: 'hand', sizePile: ce.draw, face: 'card', schedule: sched,
      });
      bumpPile(ce.draw);
      draws.forEach((_, i) => setTimeout(() => sfx.draw(), i * sched.stagger));
      await sleep(sched.awaitMs);
    } else {
      layoutHand();
      await sleep(40);
    }
    arrival += n;
    if (pileVisualOverride) {
      // snap to remaining visual after segment (post-reshuffle draw shrinks by n)
      pileVisualOverride.draw = Math.max(0, (pileVisualOverride.draw || 0));
    }
    syncPileWidgets(cb);
  }

  pileVisualOverride = null;
  syncCombat();
}

let emberFrom = null; // where the last fire spilled from (shatter/death/kindle)
async function handleEvent(ev, targetIdx) {
  const cb = S.cb, ce = S.ce;
  switch (ev.t) {
    case 'bossIntro': {
      // Name plate only — rose-window behind it read as a second overlapping intro.
      const bossLabel = String(ev.name || cb.enemies[0]?.name || '').toUpperCase();
      const sp = bossLabel.indexOf(' ');
      const bossHtml = sp < 0
        ? escHtml(bossLabel)
        : `${escHtml(bossLabel.slice(0, sp))}<br>${escHtml(bossLabel.slice(sp + 1))}`;
      const b = el('div', 'turn-banner boss-banner', `<span class="bb-name">${bossHtml}</span>`);
      const duration = REDUCED ? 80 : 2100;
      if (REDUCED) b.style.animation = 'none';
      screenEl().appendChild(b);
      setTimeout(() => b.remove(), duration);
      if (!REDUCED) {
        V.flash('#1a0a20', 0.5, 0.9);
        kick(1.6);
      }
      sfx.bigDeath();
      await sleep(duration);
      break;
    }
    case 'variantDialogue': {
      const b = el('div', 'turn-banner variant-dialogue', escHtml(ev.text));
      const duration = REDUCED ? 80 : 1800;
      if (REDUCED) b.style.animation = 'none';
      screenEl().appendChild(b);
      setTimeout(() => b.remove(), duration);
      await sleep(duration);
      break;
    }
    case 'chip': {
      const x = ce.enemies[ev.idx];
      const { x: ex, y: ey } = enemyCenter(ev.idx);
      sfx.chip();
      V.burst(ex, ey, { color: '#e8f4ff', n: 5, speed: 190, size: 1.8, grav: 240, kind: 'spark' });
      syncCombat();
      x.facets.classList.remove('pop');
      void x.facets.offsetWidth;
      x.facets.classList.add('pop');
      await sleep(110);
      break;
    }
    case 'shatter': {
      const x = ce.enemies[ev.idx];
      const { x: ex, y: ey } = enemyCenter(ev.idx);
      emberFrom = { x: ex, y: ey };
      sfx.shatter();
      V.hitstop(90);
      V.ring(ex, ey, '#dfeaff', 10, 700, 5);
      V.burst(ex, ey, { color: '#dfeaff', n: 26, speed: 430, size: 2.4, grav: 300, kind: 'spark' });
      V.floatText(ex, ey - 58, `${iconSvg('stagger', 20)} SHATTER`, 'shatterf');
      V.shake(10);
      kick(0.9);
      addCrack(x.art, true);
      x.root.classList.add('hurt');
      setTimeout(() => x.root.classList.remove('hurt'), 320);
      syncCombat();
      await sleep(380);
      break;
    }
    case 'adamantHold': {
      const { x: ex, y: ey } = enemyCenter(ev.idx);
      sfx.blocked();
      V.floatText(ex, ey - 52, 'THE GLASS HOLDS', 'blockedf');
      V.ring(ex, ey, '#d8c27a', 8, 480, 4);
      syncCombat();
      await sleep(260);
      break;
    }
    case 'questReveal': {
      const quest = QUESTS[ev.id];
      const disclosure = E.questDisclosure(S.run, ev.id);
      const progress = quest.huntName
        ? ` (${disclosure.progress}/${disclosure.target})`
        : '';
      banner(escHtml(`${quest.mode.toUpperCase()} REVEALED — ${disclosure.name}${progress}`));
      await sleep(REDUCED ? 40 : 1150);
      break;
    }
    case 'questProgress': {
      banner(escHtml(`${E.questProgressName(ev.id, ev.target)} — ${ev.progress}/${ev.target}`));
      await sleep(REDUCED ? 40 : 1150);
      break;
    }
    case 'questComplete': {
      banner(escHtml(`${QUESTS[ev.id].name.toUpperCase()} — COMPLETE`));
      await sleep(REDUCED ? 40 : 1150);
      break;
    }
    case 'questUnlock': {
      const text = ev.id === 'insight:witchlightLens'
        ? 'WITCHLIGHT LENS — PALE PATHS REVEALED'
        : ev.id;
      banner(escHtml(text));
      await sleep(REDUCED ? 40 : 1150);
      break;
    }
    case 'monumentGift': {
      banner('THE STONE RETURNS ITS GIFT');
      await sleep(REDUCED ? 40 : 1150);
      break;
    }
    case 'hollowTithe': {
      const from = emberFrom || heroCenter();
      const to = ce.lantern ? V.centerOf(ce.lantern) : heroCenter();
      flyTo(from.x, from.y, to.x, to.y, {
        n: Math.min(ev.n * 2, 6), color: '#91a0af', size: 5, dur: 520,
      });
      sfx.ember();
      V.floatText(to.x, to.y - 48, `−${ev.n} TO THE HOLLOW`, 'debufff');
      banner(escHtml(ev.remaining > 0 ? `${ev.remaining} EMBERS STILL OWED` : ev.paid));
      syncCombat();
      emberFrom = null;
      await sleep(REDUCED ? 40 : 1150);
      break;
    }
    case 'ember': {
      if (ev.n > 0 && ce.lantern) {
        const from = emberFrom || heroCenter();
        const to = V.centerOf(ce.lantern);
        flyTo(from.x, from.y, to.x, to.y, { n: Math.min(ev.n * 2, 5), color: '#ffb35a', size: 6, dur: 460 });
        sfx.ember();
        setTimeout(() => {
          ce.lantern.classList.remove('pop');
          void ce.lantern.offsetWidth;
          ce.lantern.classList.add('pop');
          syncCombat();
        }, 440);
        await sleep(300);
      } else syncCombat();
      emberFrom = null;
      break;
    }
    case 'kindle': {
      const c = $(`.card[data-uid="${ev.uid}"]`, ce.hand);
      if (c) emberFrom = V.centerOf(c);
      sfx.kindle();
      await sleep(60);
      break;
    }
    case 'art': {
      vfxSource = { archetype: 'fire', cardId: `art:${ev.id}`, enemyIdx: null };
      bespokeFired = false;
      { const { x: lx, y: ly } = V.centerOf(ce.lantern); V.BESPOKE_VFX[`art:${ev.id}`]?.(lx, ly); bespokeFired = true; }
      const art = ARTS[ev.id];
      const { x: hx, y: hy } = heroCenter();
      const lc = ce.lantern ? V.centerOf(ce.lantern) : { x: hx, y: hy };
      sfx.art();
      V.flash(art.tone, 0.12, 0.5);
      V.ring(lc.x, lc.y, art.tone, 10, 620, 5);
      V.motes(hx, hy, art.tone, 12);
      V.floatText(hx, hy - 84, art.name.toUpperCase(), 'artf');
      const au = assetUrl('arts', ev.id);
      if (au) {
        const img = el('img', 'art-cast');
        img.src = au;
        $('#floaties').appendChild(img);
        img.style.left = `${hx}px`; img.style.top = `${hy - 30}px`;
        img.animate([
          { transform: 'translate(-50%,-50%) scale(0.4)', opacity: 0 },
          { transform: 'translate(-50%,-58%) scale(1)', opacity: 1, offset: 0.3 },
          { transform: 'translate(-50%,-70%) scale(1.05)', opacity: 0 },
        ], { duration: 900, easing: 'cubic-bezier(.2,.7,.3,1)' }).onfinish = () => img.remove();
      }
      kick(0.7);
      syncCombat();
      await sleep(420);
      break;
    }
    case 'staggered': {
      const x = ce.enemies[ev.idx];
      const { x: ex, y: ey } = enemyCenter(ev.idx);
      sfx.stagger();
      V.floatText(ex, ey - 76, 'STAGGERED', 'staggerf');
      x.root.classList.add('reseaming');
      setTimeout(() => x.root.classList.remove('reseaming'), 720);
      syncCombat();
      await sleep(520);
      break;
    }
    case 'smolderJump': {
      const a = enemyCenter(ev.from), b = enemyCenter(ev.to);
      sfx.poison();
      flyTo(a.x, a.y, b.x, b.y, { n: 5, color: '#d3a15a', size: 7, dur: 460 });
      await sleep(400);
      break;
    }
    case 'turn': {
      if (ev.n > 1) { banner('YOUR TURN'); sfx.turn(); }
      syncCombat();
      await sleep(ev.n > 1 ? 500 : 120);
      break;
    }
    case 'endTurn': heroActing = false; banner('ENEMY TURN'); await sleep(480); break;
    case 'draw': {
      await handleDrawWave([ev]);
      break;
    }
    case 'reshuffle': {
      await playReshuffleCeremony(ev);
      syncCombat();
      break;
    }
    case 'play': {
      const c = $(`.card[data-uid="${ev.uid}"]`, ce.hand);
      sfx.card();
      heroActing = true;
      hitSeq = 0;
      vfxSource = { archetype: CARDS[ev.id]?.vfx || 'slash', cardId: ev.id, enemyIdx: null };
      bespokeFired = false;
      choreoDone = false;
      if (!bespokeFired && V.BESPOKE_VFX[ev.id] && ['ascension', 'pyreheart', 'emberdance', 'limitBreak'].includes(ev.id)) {
        const living = cb.enemies.findIndex((e) => e.hp > 0);
        const pos = ev.id === 'limitBreak' && living >= 0 ? enemyCenter(living) : heroCenter();
        V.BESPOKE_VFX[ev.id](pos.x, pos.y);
        bespokeFired = true;
      }
      if (c && targetIdx != null && cb.enemies[targetIdx]) {
        // targeted attacks: the card itself streaks into the enemy
        const r = stageRect(c); // ghost is fixed inside the stage
        const { x: tx, y: ty } = enemyCenter(targetIdx);
        // Discard/exhaust should resume from where the streak ends, not the hand seat
        cardFlightAnchor.set(String(ev.uid), { x: tx, y: ty, w: r.width * 0.22, h: r.height * 0.22 });
        const ghost = c.cloneNode(true);
        Object.assign(ghost.style, { position: 'fixed', left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px`, margin: 0, transform: 'none', zIndex: 56, pointerEvents: 'none' });
        document.getElementById('floaties').appendChild(ghost);
        c.remove();
        ghost.animate(
          [{ transform: 'none', opacity: 1 }, { transform: `translate(${tx - r.left - r.width / 2}px,${ty - r.top - r.height / 2}px) scale(0.22) rotate(14deg)`, opacity: 0 }],
          { duration: 270, easing: 'cubic-bezier(.45,0,.9,.5)' }
        ).onfinish = () => ghost.remove();
      } else if (c) {
        // Tap/click: play lifts the card — recapture AFTER played-up so discard starts there.
        // Drag: keep the release-seat anchor (fromDrag); clearTargeting already reflowed the DOM.
        c.classList.add('played-up');
        void c.offsetWidth;
        const prev = peekCardAnchor(ev.uid);
        if (!prev?.fromDrag) captureCardAnchor(ev.uid, c);
      }
      // engine already pushed discard/exhaust; hold pile chrome until those flights land
      holdPendingPileArrivals(cb, ev.uid);
      syncCombat();
      await sleep(200);
      break;
    }
    case 'hitEnemy': {
      const x = ce.enemies[ev.idx];
      const { x: ex, y: ey } = enemyCenter(ev.idx);
      if (ev.poison) {
        sfx.poison();
        V.motes(ex, ey, '#d3a15a', 14);
        V.floatText(ex, ey - 20, `${ev.amount}`, 'poisonf');
      } else {
        const big = ev.amount >= 16;
        if (heroActing && vfxSource.cardId && !String(vfxSource.cardId).startsWith('art:')) {
          if (!choreoDone) { await choreoAttack(ce.hero, 1, 'humanoid'); choreoDone = true; }
        }
        sfx.attack({ who: 'hero', amount: ev.amount, blocked: ev.blocked });
        if (!bespokeFired && vfxSource.cardId && V.BESPOKE_VFX[vfxSource.cardId]) {
          V.BESPOKE_VFX[vfxSource.cardId](ex, ey);
          bespokeFired = true;
        }
        V.archetypeHit(ex, ey, vfxSource.archetype, Math.min(1, ev.amount / 24));
        choreoHit(x.root, 1);
        if (ev.blocked > 0) {
          sfx.blocked();
          V.floatText(ex, ey + 26, `${iconSvg('shield', 19)}${ev.blocked}`, 'blockedf');
          V.burst(ex, ey + 8, { color: '#9fd4ff', n: 9, speed: 210, size: 2, grav: 260, kind: 'spark' }); // ward chips off
          if (cb.enemies[ev.idx].block === 0 && ev.amount === 0) {
            V.floatText(ex, ey - 2, 'GUARD SHATTERED', 'shatterf');
            V.shardSpray(ex, ey, '#9fd4ff', 14);
          }
        }
        if (ev.amount > 0) {
          const tier = ev.killingBlow && ev.overkill >= 8 ? 'dmg-overkill' : ev.killingBlow ? 'dmg-kill' : big ? 'dmg-big' : 'dmg';
          V.floatText(ex, ey - 24, `${ev.amount}`, tier, { tint: V.ARCHETYPE_TONES[vfxSource.archetype] || '', dx: (hitSeq++ % 3 - 1) * 34 });
        }
        else if (!ev.blocked) V.floatText(ex, ey - 24, '0', 'blockedf');
        V.shake(Math.min(4 + ev.amount * 0.5, 15));
        kick(Math.min(0.2 + ev.amount / 26, 1));
        if (big) { V.hitstop(70); V.ring(ex, ey, '#ffd8a0', 10, 620, 5); }
        if (ev.killingBlow) {
          // the blow that ends a life lands heavier — and overkill heavier still
          V.hitstop(ev.overkill >= 8 ? 130 : 90);
          kick(Math.min(1.6, 0.6 + ev.overkill * 0.06));
          V.ring(ex, ey, '#ffffff', 8, 780, 5);
          V.ring(ex, ey, '#ffd8a0', 14, 900, 4);   // warm shockwave layered under the white
          V.flash('#ffe6b0', 0.09, 0.28);          // a beat of gold ceremony on every kill
          if (ev.overkill >= 8) {
            V.flash('#ffffff', 0.12, 0.24);
            V.burst(ex, ey, { color: '#fff3d6', n: 26, speed: 620, size: 2.6, grav: 200, kind: 'spark' });
            V.burst(ex, ey, { color: '#ffd76e', n: 12, speed: 300, size: 3.4, grav: 120, kind: 'spark' }); // slow gold embers rising
          }
        }
        if (ev.amount > 0) addCrack(x.art, big);
      }
      x.root.classList.add('hurt');
      setTimeout(() => x.root.classList.remove('hurt'), 320);
      syncCombat();
      await sleep(230);
      break;
    }
    case 'die': {
      const x = ce.enemies[ev.idx];
      const en = cb.enemies[ev.idx];
      const { x: ex, y: ey } = enemyCenter(ev.idx);
      emberFrom = { x: ex, y: ey }; // the fire inside spills toward the lantern
      if (en.boss) {
        // world-stop: color drains, the cracks blaze with inner light, one
        // silent beat — then the glass gives way
        document.body.classList.add('worldstop');
        x.root.classList.add('doomed');
        V.hitstop(110);
        await sleep(820);
        document.body.classList.remove('worldstop');
        x.root.classList.remove('doomed');
      }
      await choreoStagger(x.art);
      // the vessel fails: fire wells up through the fractures (ramped, not snapped)
      // and the INSTANT the blaze peaks the glass gives way — no held beat
      const beat = en.boss ? 320 : 200;
      if (!REDUCED) { igniteVessel(x, beat); await sleep(beat); }
      (en.boss || en.elite ? sfx.bigDeath : sfx.death)();
      if (!REDUCED) meshDeath(x.root, 1); // frame-jitter guard: the handoff must capture the full blaze
      const handoff = meshEnabled() ? meshHandoff(x.root) : null;
      if (!handoff) meshRelease(x.root);
      V.shatter(x.art, handoff || {}); // cracked warp frame + site-guided wedges when available
      V.burst(ex, ey, { color: '#dfeaff', n: 30, speed: 480, size: 2.6, grav: 340, kind: 'spark' });
      V.burst(ex, ey, { color: '#c9b0ff', n: 26, speed: 380, size: 3.2, grav: 60 });
      V.ring(ex, ey, '#e8dcff', 12, 720, 6);
      V.flash('#ffffff', en.boss ? 0.24 : 0.1, 0.3);
      V.shake(en.boss ? 22 : 12);
      kick(en.boss ? 2 : 0.9);
      x.root.classList.add('dying');
      setTimeout(() => { x.root.classList.remove('dying'); x.root.classList.add('gone'); x.reaped = true; }, 830);
      await sleep(en.boss ? 900 : 500);
      break;
    }
    case 'hitPlayer': {
      const { x: hx, y: hy } = heroCenter();
      if (ev.source === 'poison') { sfx.poison(); V.motes(hx, hy, '#d3a15a', 14); }
      else if (ev.source === 'burn' || ev.source === 'self') sfx.debuff();
      else if (ev.source === 'thorns') sfx.blocked();
      else {
        sfx.attack({ who: 'enemy', amount: ev.amount, blocked: ev.blocked });
        if (ev.amount > 0) V.flash('#ff2233', Math.min(0.05 + ev.amount * 0.012, 0.3), 0.3);
        V.archetypeHit(hx, hy, vfxSource.archetype, Math.min(1, ev.amount / 24));
        choreoHit(ce.hero, -1);
      }
      if (ev.blocked > 0) {
        sfx.blocked();
        V.floatText(hx, hy + 30, `${iconSvg('shield', 19)}${ev.blocked}`, 'blockedf');
        V.burst(hx, hy + 8, { color: '#9fd4ff', n: 9, speed: 210, size: 2, grav: 260, kind: 'spark' });
        if (cb.player.block === 0 && ev.amount === 0) {
          V.floatText(hx, hy - 2, 'GUARD SHATTERED', 'shatterf');
          V.shardSpray(hx, hy, '#9fd4ff', 14);
        }
      }
      if (ev.amount > 0) {
        const big = ev.amount >= 16;
        V.floatText(hx, hy - 30, `${ev.amount}`, big ? 'dmg-big' : 'dmg', { tint: V.ARCHETYPE_TONES[vfxSource.archetype] || '', dx: (hitSeq++ % 3 - 1) * 34 });
        V.shake(Math.min(5 + ev.amount * 0.6, 18));
        kick(Math.min(0.3 + ev.amount / 22, 1.2));
        // no hero cracks (user call, 2026-07-07): the glass language is for foes
      } else if (!ev.blocked) V.floatText(hx, hy - 30, '0', 'blockedf');
      syncCombat(); renderHud();
      await sleep(240);
      break;
    }
    case 'blockGain': {
      const isP = ev.who === 'player';
      const { x, y } = isP ? heroCenter() : enemyCenter(ev.who);
      sfx.block();
      const host = isP
        ? ($('.hero-sprite', ce.hero) || ce.hero)
        : ($('.enemy-sprite', ce.enemies[ev.who]?.art) || ce.enemies[ev.who]?.art);
      syncWardMesh(host, true, true);
      V.floatText(x, y - 10, `${iconSvg('shield', 22)} ${ev.n}`, 'blockf');
      const chip = isP ? ce.pBlock : ce.enemies[ev.who].block;
      chip.classList.remove('pulse');
      void chip.offsetWidth;
      chip.classList.add('pulse');
      syncCombat();
      await sleep(140);
      break;
    }
    case 'status': {
      const isP = ev.who === 'player';
      const { x, y } = isP ? heroCenter() : enemyCenter(ev.who);
      const info = STATUS_INFO[ev.id] || { name: ev.id, kind: 'buff' };
      const isDebuff = info.kind === 'debuff' || (ev.id === 'str' && ev.n < 0);
      (ev.id === 'poison' ? sfx.poison : isDebuff ? sfx.debuff : sfx.buff)();
      V.floatText(x, y - 46, `${ev.n > 0 ? '+' : ''}${ev.n} ${info.name}`, isDebuff ? 'debufff' : 'bufff');
      if (!isDebuff) V.motes(x, y, '#9fc8ff', 6);
      syncCombat();
      await sleep(170);
      break;
    }
    case 'heal': {
      const isP = ev.who === 'player';
      const { x, y } = isP ? heroCenter() : enemyCenter(ev.who);
      sfx.heal();
      V.motes(x, y, '#8fe8a0', 14);
      V.floatText(x, y - 30, `+${ev.n}`, 'healf');
      syncCombat(); renderHud();
      await sleep(200);
      break;
    }
    case 'energy':
      sfx.energy();
      syncCombat();
      ce.energy.classList.remove('pop');
      void ce.energy.offsetWidth;
      ce.energy.classList.add('pop');
      break;
    case 'exhaust': {
      const c = $(`.card[data-uid="${ev.uid}"]`, ce.hand);
      const anchor = takeCardAnchor(ev.uid);
      const inst = pileCardByUid(cb.exhaust, ev.uid);
      if (REDUCED) {
        if (c) c.remove();
        releasePileVisual('ashes', 1);
        syncCombat();
        break;
      }
      // Played exhaust → flight only (same language as toDiscard).
      // Hand kindle / in-hand exhaust → burn-inward at the seat, then ashes flight.
      const played = !!(anchor?.fromDrag || c?.classList.contains('played-up') || (!c && anchor));
      if (played) {
        let origin = null;
        if (anchor?.fromDrag) {
          origin = { ...anchor, inst };
        } else if (c) {
          const r = stageRect(c);
          if (r.width > 2) {
            origin = {
              x: r.left + r.width / 2, y: r.top + r.height / 2,
              w: r.width, h: r.height, inst,
            };
          }
        }
        if (!origin && anchor) origin = { ...anchor, inst };
        if (!origin && inst) origin = { ...V.centerOf(ce.hand), ...handFaceSize(), inst };
        if (c) {
          c.classList.add('draw-pending');
          layoutHand();
        }
        if (inst && origin) {
          await flyCardBacks([{ ...origin, inst }], ce.exhaust, 200, {
            fromSize: 'src', toSize: 'pile', sizePile: ce.exhaust, face: 'card', cardInst: inst,
            schedule: { stagger: 0, flightDur: 200, awaitMs: 200 },
            arc: 'smooth', easing: 'cubic-bezier(.22,.7,.28,1)',
          });
        }
        if (c) c.remove();
        releasePileVisual('ashes', 1);
        bumpPile(ce.exhaust);
        syncCombat();
        break;
      }
      // In-hand → ashes (kindle): burn at the seat
      const live = c ? stageRect(c) : null;
      const start = (live && live.width > 2)
        ? { x: live.left + live.width / 2, y: live.top + live.height / 2, w: live.width, h: live.height }
        : anchor;
      if (c && start) {
        const ghost = c.cloneNode(true);
        Object.assign(ghost.style, {
          position: 'fixed', left: `${start.x - start.w / 2}px`, top: `${start.y - start.h / 2}px`,
          width: `${start.w}px`, height: `${start.h}px`, margin: 0, transform: 'none',
          zIndex: 56, pointerEvents: 'none', opacity: '1',
        });
        document.getElementById('floaties').appendChild(ghost);
        c.remove();
        ghost.animate(
          [
            { clipPath: 'circle(80% at 50% 55%)', filter: 'brightness(1)' },
            { clipPath: 'circle(44% at 50% 55%)', filter: 'brightness(1.8) saturate(1.6) sepia(0.45)', offset: 0.45 },
            { clipPath: 'circle(0% at 50% 55%)', filter: 'brightness(2.6) saturate(2) sepia(0.85)' },
          ],
          { duration: 540, easing: 'ease-in' }
        ).onfinish = () => ghost.remove();
        V.burst(start.x, start.y, { color: '#ffb066', n: 22, speed: 190, grav: -150, size: 2.4, life: 0.85 });
        const a1 = V.centerOf(ce.exhaust);
        flyTo(start.x, start.y, a1.x, a1.y, { n: 8, color: '#ffb066', size: 5, dur: 480 });
        bumpPile(ce.exhaust);
        await sleep(260);
      } else if (c) {
        c.remove();
      }
      releasePileVisual('ashes', 1);
      syncCombat();
      break;
    }
    case 'discardHand': {
      // Same even-stagger clock as draw: each unplayed hand card flies in order
      const uids = ev.uids || [];
      const n = uids.length;
      sfx.card();
      if (!n) { syncCombat(); break; }
      if (REDUCED) {
        uids.forEach((uid) => {
          takeCardAnchor(uid);
          $(`.card[data-uid="${uid}"]`, ce.hand)?.remove();
        });
        syncCombat();
        break;
      }
      holdPileVisual('discard', n);
      const sched = drawBatchSchedule(n, 500);
      // Snapshot seats FIRST (before hiding) — clone the live card so the flyer matches the hand
      const flights = [];
      for (const uid of uids) {
        const elc = $(`.card[data-uid="${uid}"]`, ce.hand);
        const inst = pileCardByUid(cb.discard, uid)
          || { uid, id: elc?.dataset?.id, up: false, bonus: 0 };
        const anchor = takeCardAnchor(uid);
        let origin;
        if (anchor) {
          origin = { x: anchor.x, y: anchor.y, w: anchor.w, h: anchor.h };
        } else if (elc) {
          const r = stageRect(elc);
          origin = { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height };
        } else {
          origin = { ...V.centerOf(ce.hand), ...handFaceSize() };
        }
        flights.push({ ...origin, inst, el: elc });
      }
      // Hide seats only after snapshots — fan reflows without ghosts
      for (const f of flights) {
        if (f.el) f.el.classList.add('draw-pending');
      }
      layoutHand();
      if (flights.length) {
        const layer = $('#floaties');
        const dest = V.centerOf(ce.discard);
        const pileSz = pileFaceSize(ce.discard);
        flights.forEach((src, i) => {
          const layoutW = src.w > 2 ? src.w : handFaceSize().w;
          const layoutH = src.h > 2 ? src.h : handFaceSize().h;
          const landScale = layoutW > 0 ? pileSz.w / layoutW : 0.65;
          let m;
          if (src.el) {
            m = src.el.cloneNode(true);
            m.classList.remove('draw-pending', 'lifted', 'armed', 'dragging', 'will-cast', 'will-burn', 'played-up', 'unplayable-now');
            m.classList.add('flycard-face');
            m.removeAttribute('style');
            Object.assign(m.style, {
              position: 'absolute', left: `${src.x}px`, top: `${src.y}px`,
              width: `${layoutW}px`, height: `${layoutH}px`, margin: 0,
              transform: 'translate(-50%,-50%) scale(1)', zIndex: 58 + i, pointerEvents: 'none',
              opacity: '1',
            });
          } else if (src.inst?.id) {
            m = cardEl(src.inst, { inCombat: true, size: layoutW });
            m.classList.add('flycard-face');
            Object.assign(m.style, {
              position: 'absolute', left: `${src.x}px`, top: `${src.y}px`,
              width: `${layoutW}px`, height: `${layoutH}px`, margin: 0,
              transform: 'translate(-50%,-50%) scale(1)', zIndex: 58 + i, pointerEvents: 'none',
            });
          } else {
            return;
          }
          layer.appendChild(m);
          const mx = src.x + (dest.x - src.x) * 0.45 + (Math.random() - 0.5) * 24;
          const my = Math.min(src.y, dest.y) - 28 - Math.random() * 20;
          const dx1 = mx - src.x, dy1 = my - src.y;
          const dx2 = dest.x - src.x, dy2 = dest.y - src.y;
          const mid = 1 + (landScale - 1) * 0.5;
          m.animate(
            [
              { transform: 'translate(-50%,-50%) scale(1)', opacity: 1, offset: 0 },
              { transform: `translate(calc(-50% + ${dx1}px), calc(-50% + ${dy1}px)) scale(${mid})`, opacity: 1, offset: 0.5 },
              { transform: `translate(calc(-50% + ${dx2}px), calc(-50% + ${dy2}px)) scale(${landScale})`, opacity: 0.92, offset: 1 },
            ],
            {
              duration: sched.flightDur,
              delay: i * sched.stagger,
              easing: 'cubic-bezier(.22,.7,.28,1)',
              fill: 'forwards',
            }
          ).onfinish = () => m.remove();
          setTimeout(() => {
            releasePileVisual('discard', 1);
            syncPileWidgets(cb);
            bumpPile(ce.discard);
            sfx.card();
          }, sched.flightDur + i * sched.stagger);
        });
        await sleep(sched.awaitMs);
        const left = n - flights.length;
        if (left > 0) releasePileVisual('discard', left);
      } else {
        releasePileVisual('discard', n);
      }
      uids.forEach((uid) => $(`.card[data-uid="${uid}"]`, ce.hand)?.remove());
      syncCombat();
      break;
    }
    case 'toDiscard': {
      const c = $(`.card[data-uid="${ev.uid}"]`, ce.hand);
      const anchor = takeCardAnchor(ev.uid);
      const inst = pileCardByUid(cb.discard, ev.uid);
      if (!REDUCED && inst && (c || anchor)) {
        // Drag release → use stored seat. Tap/click → live played-up seat (or refreshed anchor).
        let origin = null;
        if (anchor?.fromDrag) {
          origin = { ...anchor, inst };
        } else if (c) {
          const r = stageRect(c);
          if (r.width > 2) {
            origin = {
              x: r.left + r.width / 2, y: r.top + r.height / 2,
              w: r.width, h: r.height, inst,
            };
          }
        }
        if (!origin && anchor) origin = { ...anchor, inst };
        if (!origin) {
          releasePileVisual('discard', 1);
          bumpPile(ce.discard);
          syncCombat();
          break;
        }
        if (c) {
          c.classList.add('draw-pending');
          layoutHand();
        }
        await flyCardBacks([origin], ce.discard, 200, {
          fromSize: 'src', toSize: 'pile', sizePile: ce.discard, face: 'card', cardInst: inst,
          schedule: { stagger: 0, flightDur: 200, awaitMs: 200 },
          arc: 'smooth', easing: 'cubic-bezier(.22,.7,.28,1)',
        });
        if (c) c.remove();
      } else if (c) {
        c.remove();
      } else if (!REDUCED && inst) {
        await flyCardBacks([{ ...V.centerOf(ce.hand), ...handFaceSize(), inst }], ce.discard, 200, {
          fromSize: 'hand', toSize: 'pile', sizePile: ce.discard, face: 'card', cardInst: inst,
          schedule: { stagger: 0, flightDur: 200, awaitMs: 200 },
          arc: 'smooth', easing: 'cubic-bezier(.22,.7,.28,1)',
        });
      }
      releasePileVisual('discard', 1);
      bumpPile(ce.discard);
      syncCombat();
      break;
    }
    case 'enemyAct': {
      const x = ce.enemies[ev.idx];
      const enemy = cb.enemies[ev.idx];
      const view = combatantView(enemy);
      const { x: ex, y: ey } = enemyCenter(ev.idx);
      hitSeq = 0;
      const mvDef = enemy.def?.moves?.[ev.move];
      const kindArch = ENEMY_KIND_VFX[view.kind] || 'slash';
      vfxSource = {
        archetype: mvDef?.intent?.startsWith('attack') ? kindArch
          : mvDef?.intent === 'debuff' ? 'void'
          : (mvDef?.intent === 'buff' || mvDef?.intent === 'block') ? 'ward' : kindArch,
        cardId: null, enemyIdx: ev.idx,
      };
      bespokeFired = false;
      choreoDone = false;
      // telegraph: the intent chip blazes in the beat before the strike
      x.intent.classList.remove('telegraph');
      void x.intent.offsetWidth;
      x.intent.classList.add('telegraph');
      V.floatText(ex, ey - 90, ev.name, 'movef');
      await sleep(300);
      if (mvDef?.intent?.startsWith('attack')) {
        await choreoAttack(x.root, -1, view.kind);
        choreoDone = true;
      } else await sleep(320);
      x.intent.classList.remove('telegraph');
      break;
    }
    case 'intent': syncCombat(); break;
    case 'addCard': {
      V.floatText(stageW() / 2, stageH() * 0.62, `${CARDS[ev.id].name} added to ${ev.where === 'hand' ? 'hand' : 'discard'}`, 'notice');
      sfx.debuff();
      syncCombat(); syncHand();
      await sleep(240);
      break;
    }
    case 'relicProc': {
      const chip = $(`.hud-relic[data-relic="${ev.id}"]`);
      if (chip) { chip.classList.remove('proc'); void chip.offsetWidth; chip.classList.add('proc'); }
      await sleep(90);
      break;
    }
    case 'maxHp': {
      const { x, y } = heroCenter();
      V.floatText(x, y - 60, `+${ev.n} MAX HP`, 'healf');
      sfx.buff();
      await sleep(160);
      break;
    }
    case 'potion': sfx.potion(); await sleep(120); break;
    case 'powerConsumed': {
      // a power doesn't get discarded — it settles into the glass
      const c = $(`.card[data-uid="${ev.uid}"]`, ce.hand);
      const from = c ? V.centerOf(c) : { x: stageW() / 2, y: stageH() - 180 };
      if (c) c.remove();
      const { x: hx, y: hy } = heroCenter();
      if (!REDUCED) {
        flyTo(from.x, from.y, hx, hy, { n: 7, color: '#c9a8ff', size: 7, dur: 560 });
        setTimeout(() => { V.ring(hx, hy, '#c9a8ff', 12, 460, 4); V.motes(hx, hy, '#c9a8ff', 8); }, 560);
      }
      sfx.buff();
      await sleep(REDUCED ? 40 : 300);
      break;
    }
    case 'victory': {
      S.lastPerfect = !!ev.perfect;
      await sleep(320);
      sfx.victory();
      V.flash('#ffe9ac', 0.16, 0.6);
      if (ev.perfect) {
        const b = el('div', 'turn-banner perfect-banner', 'PERFECT');
        screenEl().appendChild(b);
        setTimeout(() => b.remove(), 1400);
        await sleep(500);
      }
      break;
    }
    case 'defeat': {
      await sleep(400);
      sfx.defeat();
      V.flash('#300', 0.5, 1.2);
      // the lantern snuffs out: collapse the view (full-screen snuff, not stage-dim)
      const L = $('#lantern');
      L.classList.add('snuff', 'gutter');
      L.style.setProperty('--la', '1');
      L.style.setProperty('--lr', '160px');
      const dim = $('.combat-screen .stage-dim');
      if (dim) { dim.style.setProperty('--la', '0'); dim.classList.remove('gutter'); }
      await sleep(900);
      break;
    }
  }
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
  const skipOrdinaryRewards = E.shadeVictorySkipsRewards(run);
  if (kind === 'boss' && run.act >= 2) {
    journalRunEnd(run, 'win');
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
function journalRunEnd(run, outcome, onFinalised = null) {
  E.journalTerminalOutcome(run, outcome);
  const continueRunEnd = () => {
    S.cb = null;
    finalisePendingRunEnd(run, onFinalised);
  };
  if (!requireRunSave(run, continueRunEnd)) return false;
  continueRunEnd();
  return true;
}
function finalisePendingRunEnd(run, onFinalised = null) {
  const outcome = run.pendingRunEnd?.outcome;
  if (!TERMINAL_OUTCOMES.includes(outcome)) return false;
  const acknowledgeRunEnd = outcome === 'win'
    ? (candidate) => E.stagePendingDawn(
        candidate,
        dawnQueue(candidate, candidate.runEndResult),
        candidate.vigilResult?.newUnlocks || [],
      )
    : E.recordRunEnd;
  return E.finaliseTerminalOutbox(
    run,
    () => commitPendingRunEnd(run, acknowledgeRunEnd),
    () => showRunEndPersistenceFailure(run, onFinalised),
    ({ newUnlocks, ledger }) => {
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
          offers: offerNewBequest ? bequestOptions(run) : [],
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
  );
}
function defeatFlow() {
  transition('defeat');
  const run = S.run;
  const node = run.map.nodes.find((candidate) => candidate.id === run.nodeId);
  const fallRow = node ? node.row : Math.max(1, run.floorsClimbed - 1);
  E.markShadeFall(run, run.act, fallRow);
  journalRunEnd(run, 'death');
}

// ------------------------------------------------------------ rewards
function renderReward() {
  const run = S.run;
  const pending = run.pendingReward;
  if (!pending) { show('map'); return; }
  const { kind, rewards, taken, perfect } = pending;
  const sc = screenEl();
  const title = kind === 'boss' ? 'BOSS VANQUISHED' : kind === 'elite' ? 'ELITE SLAIN' : 'VICTORY';
  const seal = perfect ? '<div class="perfect-seal">✦ PERFECT — the glass untouched ✦</div>' : '<div class="ornament">✦ ✦ ✦</div>';
  S.lastPerfect = false;
  sc.innerHTML = `<div class="center-panel screen-enter">${sceneBg()}<div class="panel">
    <div class="ov-title">${title}</div>
    ${seal}
    <div class="reward-list"></div>
    <div class="ov-actions"><button class="btn btn-primary" data-a="continue">Continue</button></div>
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
  addRow('gold', iconSvg('coin', 18), `<b class="gold-num">${rewards.gold}</b> gold`,
    () => E.takePendingReward(run, 'gold'), () => {
      sfx.coin();
      // the coins travel to the purse only after their taken flag is durable
      requestAnimationFrame(() => {
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
    const p = POTIONS[rewards.potion];
    addRow('potion', rasterOr('potions', rewards.potion, potionSvg(p.tone)), `${p.name}`, () => {
      if (E.takePendingReward(run, 'potion')) return true;
      V.floatText(stageW() / 2, stageH() / 2, 'Potion slots full!', 'notice');
      return false;
    }, () => sfx.potion(), { title: p.name, body: p.text });
  }
  if (rewards.relic) {
    const r = RELICS[rewards.relic];
    addRow('relic', `<span style="color:${r.tone};text-shadow:0 0 8px ${r.tone}">${relicArt(rewards.relic, 24)}</span>`, `<b>${r.name}</b>`,
      () => E.takePendingReward(run, 'relic'), () => {
        sfx.relic();
        requestAnimationFrame(() => {
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
  const cardRow = addRow('card', iconSvg('cards', 26), 'Add a card to your deck');
  cardRow.dataset.cardrow = '1';
  if (!taken.card) cardRow.onclick = () => pickCardReward(rewards.cards);

  $('[data-a="continue"]', sc).onclick = () => {
    sfx.click();
    E.clearPendingReward(run);
    const continueReward = () => { if (kind === 'boss') show('bossRelic'); else show('map'); };
    if (!requireRunSave(run, continueReward)) return;
    continueReward();
  };

  function pickCardReward(ids) {
    showCardGrid('Choose a Card', ids.map((id) => ({ id, up: false, uid: null })), {
      sub: 'Add one card to your deck — or skip to keep it lean.',
      pick: (inst) => {
        if (!E.takePendingReward(run, 'card', inst?.id ?? null)) return;
        const finish = () => settleRow(cardRow, () => {
          if (!inst) return;
          sfx.upgrade();
          V.floatText(stageW() / 2, stageH() / 2, `${E.cardData(inst).name} added`, 'notice');
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
    <div class="ov-title">A BOSS RELIC CALLS</div>
    <div class="ov-sub">Choose one — its power is permanent.</div>
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
    const r = RELICS[id];
    const b = el('button', 'relic-pick');
    b.innerHTML = `<span class="relic-chip" style="--tone:${r.tone}">${relicArt(id, 26)}</span><span><b>${r.name}</b><span class="rd">${r.text}</span></span>`;
    b.onclick = () => pick(id);
    wrap.appendChild(b);
  }
  const skip = el('button', 'btn ghost', 'Take none');
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
  setTheme(run.act);
  setAltitude(run.act, 0);
  E.saveRun(run);
  transition('act-change');
  show('map');
  sfx.victory();
}
// the night declares itself: the omen blooms over the map on act entry
function omenBanner(run) {
  const omen = OMENS[run.omens?.[run.act]];
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

// ------------------------------------------------------------ rest / shop / treasure / event
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
    } else E.saveRun(run);
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
        } else E.saveRun(run);
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
    E.saveRun(run);
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
  const buy = (price) => { run.player.gold -= price; sfx.coin(); E.saveRun(run); renderHud(); refresh(); };
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
        const result = E.buyQuestItem(run, it.id);
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
        if (!requireRunSave(run, finishPurchase)) return;
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
          E.saveRun(run);
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
function renderEvent(eventId) {
  const run = S.run;
  const ev = EVENTS[eventId];
  const sc = screenEl();
  sc.innerHTML = `<div class="center-panel screen-enter">${sceneBg()}<div class="panel event-panel">
    <div class="ov-title">${ev.name.toUpperCase()}</div>
    <div class="event-art">${rasterOr('events', eventId, eventArtSvg(ev.glyph, ev.hue))}</div>
    <div class="event-text">${ev.text}</div>
    <div class="event-log"></div>
    <div class="event-choices"></div>
  </div></div>`;
  const choices = $('.event-choices', sc);
  const leaveEvent = () => leaveHollowDestination(run, () => show('map'));
  const showEventContinue = () => {
    choices.innerHTML = '';
    const done = el('button', 'btn btn-primary', 'Continue');
    done.onclick = () => { sfx.click(); leaveEvent(); };
    choices.appendChild(done);
  };
  if (E.nodeRewardClaimed(run)) {
    showEventContinue();
    return;
  }
  if (E.nodeEventInFlight(run)) {
    E.finalizeNodeEventChoice(run);
    E.saveRun(run);
    showEventContinue();
    return;
  }
  const offered = ev.choices.filter((ch) => E.runRevealed(run, 'phials') || !ch.ops.some((op) => op.potion));
  for (const [i, ch] of offered.entries()) {
    const b = el('button', `event-choice${i === 0 ? ' btn-primary' : ''}`, `<b>${ch.label}</b>${ch.sub ? `<div class="sub">${ch.sub}</div>` : ''}`);
    if (ch.needGold && run.player.gold < ch.needGold) b.disabled = true;
    b.onclick = () => resolveChoice(ch);
    choices.appendChild(b);
  }
  let resolving = false;
  async function resolveChoice(ch) {
    if (resolving) return;
    resolving = true;
    choices.querySelectorAll('button').forEach((b) => { b.disabled = true; });
    try {
      sfx.click();
      const { pending, log, already } = E.applyNodeEventChoice(run, ch.ops);
      if (already) { showEventContinue(); return; }
      E.saveRun(run); // persist rewardResolving before interactive pending
      renderHud();
      const logEl = $('.event-log', sc);
      const bits = [];
      for (const L of log) {
        if (L.text) bits.push(L.text);
        if (L.relic) bits.push(`Gained <b style="color:${RELICS[L.relic].tone}">${RELICS[L.relic].name}</b> — <i>${RELICS[L.relic].text}</i>`);
      }
      if (bits.length) logEl.innerHTML = bits.join('<br>');
      choices.innerHTML = '';
      for (const p of pending) await handlePending(p);
      E.finalizeNodeEventChoice(run);
      E.saveRun(run);
      renderHud();
      showEventContinue();
      if (!bits.length && !pending.length && !ch.ops.length) leaveEvent();
    } catch (err) {
      if (E.nodeEventInFlight(run) || E.nodeRewardClaimed(run)) {
        if (E.nodeEventInFlight(run)) E.finalizeNodeEventChoice(run);
        E.saveRun(run);
        showEventContinue();
        return;
      }
      resolving = false;
      choices.querySelectorAll('button').forEach((b) => { b.disabled = false; });
      throw err;
    }
  }
  function handlePending(p) {
    return new Promise((resolve) => {
      if (p === 'remove') {
        const removable = E.removableCards(run);
        if (!removable.length) return resolve();
        showCardGrid('Remove a Card', removable, { sub: 'Let it go.', pick: (inst) => { if (inst && E.removeCardFromDeck(run, inst.uid)) sfx.card(); resolve(); }, canSkip: false });
      } else if (p === 'upgrade') {
        const ups = run.player.deck.filter((c) => !c.up && CARDS[c.id].up);
        if (!ups.length) return resolve();
        showCardGrid('Upgrade a Card', ups, { sub: 'The forge hungers.', pick: (inst) => { if (inst) { E.upgradeCardInDeck(run, inst.uid); sfx.upgrade(); } resolve(); } });
      } else if (p === 'duplicate') {
        showCardGrid('Duplicate a Card', run.player.deck, { sub: 'The mirror remembers.', pick: (inst) => { if (inst) { E.duplicateCardInDeck(run, inst.uid); sfx.upgrade(); } resolve(); } });
      } else if (p.pickCard) {
        showCardGrid('Choose a Card', E.rollEventCards(run, p.pickCard).map((id) => ({ id, up: false, uid: null })), {
          sub: 'One page still glows.',
          pick: (inst) => { if (inst) { E.addCardToDeck(run, inst.id); sfx.upgrade(); } resolve(); }, canSkip: true,
        });
      } else resolve();
    });
  }
}

// ------------------------------------------------------------ end screens
function bequestLabel(o) {
  const bu = assetUrl('bequests', o.kind);
  const kindIcon = bu
    ? `<img class="bq-kind" src="${bu}" alt="">`
    : `<span class="bq-kind-fallback">${iconSvg(`bequest-${o.kind}`, 22)}</span>`;
  if (o.kind === 'relic') return { icon: `${kindIcon}${relicArt(o.id, 20)}`, name: RELICS[o.id]?.name || o.id, note: 'your rarest relic' };
  if (o.kind === 'card') return { icon: `${kindIcon}<span class="bq-card">🂠</span>`, name: (CARDS[o.id]?.name || o.id) + (o.up ? '+' : ''), note: 'your finest card' };
  return { icon: `${kindIcon}${iconSvg('coin', 20)}`, name: `${o.amount} gold`, note: 'a cache of gold' };
}
function unlockToastInfo(u) {
  if (u === 'aspect2') return { kind: 'Aspect Unlocked', name: 'The Ashwarden' };
  const [k, id] = u.split(':');
  if (k === 'card') return { kind: 'Card Unlocked', name: CARDS[id]?.name || id };
  return { kind: 'Relic Unlocked', name: RELICS[id]?.name || id };
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
      const t = el('div', 'unlock-toast', `<div class="ut-kind">✦ ${info.kind}</div><div class="ut-name">${info.name}</div>`);
      host.appendChild(t);
      requestAnimationFrame(() => t.classList.add('in'));
      sfx.relic();
      setTimeout(() => { t.classList.remove('in'); setTimeout(() => t.remove(), 500); }, 3800);
    }, 700 + i * 800);
  });
}

function dawnQueue(run, ledger) {
  const events = [];
  if (ledger?.whisper != null) events.push({ t: 'whisper', text: ledger.whisper });
  events.push(...(run.endQueue || []).map((event) => ({ ...event })));
  const newShards = Array.isArray(ledger?.newShards) ? [...ledger.newShards] : [];
  for (const id of newShards) events.push({ t: 'shardGrant', id });
  const threshold = PROGRESSION.revealThresholds.act4.shards;
  const before = new Set(run.shards || []);
  const after = new Set(ledger?.vigil?.shards || [...before, ...newShards]);
  if (newShards.length && before.size < threshold && after.size >= threshold) {
    events.push({ t: 'act4Reveal' });
  }
  return events.filter((event, index, queue) => !(event.t === 'questComplete' &&
    queue.slice(index + 1).some((later) => later.t === 'shardGrant' && later.id === event.id)));
}

function dawnEventHtml(event) {
  if (event.t === 'whisper') return `<div class="dawn-kicker">A whisper reaches the dawn</div>
    <div class="dawn-whisper"><i>${escHtml(event.text)}</i></div>`;
  if (event.t === 'questReveal') {
    const quest = QUESTS[event.id];
    return `<div class="dawn-kicker">${escHtml(quest.mode)} revealed</div>
      <div class="dawn-name">${escHtml(quest.name)}</div>
      <div class="dawn-copy">${escHtml(quest.inscription)}</div>`;
  }
  if (event.t === 'questProgress') return `<div class="dawn-kicker">The trail continues</div>
    <div class="dawn-name">${escHtml(E.questProgressName(event.id, event.target))}</div>
    <div class="dawn-count">${event.progress}/${event.target}</div>`;
  if (event.t === 'questUnlock') return `<div class="dawn-kicker">Insight awakened</div>
    <div class="dawn-name">Witchlight Lens</div>
    <div class="dawn-copy">Pale paths will now be marked.</div>`;
  if (event.t === 'pageRead') return `<div class="dawn-kicker">Page ${event.index}</div>
    <div class="dawn-copy">${escHtml(event.text)}</div>`;
  if (event.t === 'eighthResolved') return `<div class="dawn-kicker broken-omen">The broken glyphs resolve</div>
    <div class="dawn-copy">${escHtml(event.text)}</div>`;
  if (event.t === 'shadeResolved') return `<div class="dawn-kicker">The shade speaks plainly</div>
    <div class="dawn-copy">${escHtml(event.text)}</div>`;
  if (event.t === 'questComplete') return `<div class="dawn-kicker">${escHtml(QUESTS[event.id].mode)} complete</div>
    <div class="dawn-name">${escHtml(QUESTS[event.id].name)}</div>`;
  if (event.t === 'shardGrant') return `<div class="dawn-icon">${iconSvg('emberglassShard', 42)}</div>
    <div class="dawn-name">${escHtml(QUESTS[event.id].name)}</div>
    <div class="dawn-copy">One pane answers.</div>`;
  if (event.t === 'act4Reveal') return `<div class="dawn-icon">${iconSvg('sealedDoor', 48)}</div>
    <div class="dawn-copy">Six panes burn. Something waits above the crown.</div>`;
  return '';
}

function showDawnPersistenceFailure(onRetry, phase) {
  const finishing = phase === 'clear';
  const description = finishing
    ? 'Every panel has been seen, but the saved dawn could not be released. Retry before leaving this screen.'
    : 'This panel was shown, but its place in the dawn could not be secured. Retry before the ceremony continues.';
  const html = persistenceFailureHtml({
    id: 'dawn-save-failure',
    title: 'The Dawn Could Not Hold',
    description,
    retry: { action: 'retry-dawn', label: 'Retry Save' },
    reload: { action: 'reload-dawn', label: 'Reload Saved Dawn' },
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
      if (action()) { resolve(); return; }
      showDawnPersistenceFailure(attempt, phase);
    };
    attempt();
  });
}

async function drainEndQueue(run, host) {
  const pending = run.pendingDawn;
  if (!pending) throw new Error('winning end screen requires a staged dawn presentation');
  const events = pending.events.map((event) => ({ ...event }));
  const newUnlocks = [...pending.newUnlocks];
  for (let i = pending.cursor; i < events.length; i++) {
    const event = events[i];
    const html = dawnEventHtml(event);
    if (!html) throw new Error(`unrenderable dawn event: ${event.t}`);
    const panel = el('div', 'dawn-event', html);
    panel.dataset.event = event.t;
    host.appendChild(panel);
    if (REDUCED) {
      panel.classList.add('shown');
      await sleep(40);
    } else {
      requestAnimationFrame(() => panel.classList.add('shown'));
      await sleep(550);
    }
    await persistDawnOrRetry(() => E.advancePendingDawn(run, i + 1), 'cursor');
  }
  await persistDawnOrRetry(() => E.completePendingDawn(run), 'clear');
  host.classList.add('complete');
  return newUnlocks;
}

function renderEnd({ won, newUnlocks = [], offers = [], fallAct = 0, fallRow = 1, unpaidBequest = false }) {
  const run = S.run;
  music.playForRunEnd(!!won);
  const st = run.stats;
  const mins = Math.max(1, Math.round((Date.now() - st.start) / 60000));
  const totalFloor = run.act * E.MAP_ROWS + run.floorsClimbed;
  const stats = `<div class="stats-grid">
      <div class="stat-cell"><div class="v">${totalFloor}</div><div class="k">Floors</div></div>
      <div class="stat-cell"><div class="v">${st.slain}</div><div class="k">Slain</div></div>
      <div class="stat-cell"><div class="v">${st.elites + st.bosses}</div><div class="k">Elites & Bosses</div></div>
      <div class="stat-cell"><div class="v">${run.player.deck.length}</div><div class="k">Deck Size</div></div>
      <div class="stat-cell"><div class="v">${st.dmgDealt}</div><div class="k">Damage Dealt</div></div>
      <div class="stat-cell"><div class="v">${st.dmgTaken}</div><div class="k">Damage Taken</div></div>
      <div class="stat-cell"><div class="v">${st.cardsPlayed}</div><div class="k">Cards Played</div></div>
      <div class="stat-cell"><div class="v">${mins}m</div><div class="k">Run Time</div></div>
    </div>`;
  const btns = `<div class="end-btns">
      <button class="btn" data-a="deck"${won ? ' disabled' : ''}>View Final Deck</button>
      <button class="btn" data-a="title"${won ? ' disabled' : ''}>Return to the Vigil</button>
    </div>`;
  let ceremony = Promise.resolve();
  if (won) {
    screenEl().innerHTML = `<div class="end-screen screen-enter">
      ${metaBg('ascended')}
      <div class="end-title win">ASCENDED</div>
      <div class="ov-sub" style="font-size:17px">The Eternal Sovereign is dust. Dawn breaks over the Spire — the first in an age.</div>
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
      ? '<div class="bequest"><div class="bequest-done">The unpaid gift remains in the standing stone</div></div>'
      : offers.length ? `<div class="bequest" id="bequest">
        <div class="bequest-title">Carve one thing into the stone — the next climb may recover it in <b>${ACTS[fallAct].name}</b>.</div>
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
        <div class="end-title lose">FALLEN</div>
        <div class="ov-sub" style="font-size:16px">Here ended a climb, on floor ${totalFloor}.<br>The Spire keeps what it takes — but the Vigil remembers.</div>
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
      setBequest(fallAct, fallRow, o);
      const L = bequestLabel(o);
      $('#bequest').innerHTML = `<div class="bequest-done">✦ The stone keeps your <b>${L.name}</b>.<br>It will wait for you in ${ACTS[fallAct].name}.</div>`;
      return;
    }
    sfx.click();
    if (a === 'deck') showCardGrid('Final Deck', run.player.deck, {});
    if (a === 'title') { S.run = null; S.lamp = null; show('title'); }
  };
  ceremony.then((owedUnlocks = newUnlocks) => {
    if (S.screen !== 'end' || S.run?.runId !== run.runId) return;
    $$('.end-btns button', screenEl()).forEach((button) => { button.disabled = false; });
    showUnlockToasts(owedUnlocks, run.runId);
  });
}

// ------------------------------------------------------------ dev asset gallery (?gallery=1)
// contact sheet of every visual id: raster where generated, SVG fallback otherwise. QA gate.
let galleryLightboxWired = false;
function wireGalleryLightbox() {
  if (galleryLightboxWired) return;
  galleryLightboxWired = true;
  const ov = $('#overlay');
  ov.addEventListener('pointerdown', (e) => {
    if (e.target === ov && ov._closable) closeOverlay();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && ov.classList.contains('open') && ov._closable) closeOverlay();
  });
}
function openGalleryLightbox(trigger, gallerySet) {
  const cat = trigger.dataset.cat || '';
  const id = trigger.dataset.id || '';
  const url = trigger.dataset.url || '';
  const art = trigger.querySelector('.g-art-stage');
  const title = `${id} / ${cat}`;
  const svg = art?.querySelector('svg');
  const svgUrl = svg ? `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg.outerHTML)}` : '';
  const artHtml = url
    ? `<img class="gallery-lightbox-img" src="${escHtml(url)}" alt="${escHtml(id)}">`
    : (svgUrl ? `<img class="gallery-lightbox-img" src="${escHtml(svgUrl)}" alt="${escHtml(id)}">` : (art ? art.innerHTML : ''));
  openOverlay(`<div class="gallery-lightbox" role="dialog" aria-modal="true" aria-label="${escHtml(title)}">
    <button class="gallery-lightbox-close" type="button" data-a="close" aria-label="Close">&times;</button>
    <div class="gallery-lightbox-meta"><b>${escHtml(id)}</b><span>${escHtml(cat)} - ${escHtml(assetSetLabel(gallerySet))}</span></div>
    <div class="gallery-lightbox-art">${artHtml}</div>
  </div>`, (root) => {
    $('[data-a="close"]', root).onclick = () => closeOverlay();
  }, true);
}
function renderGallery() {
  wireGalleryLightbox();
  const params = new URLSearchParams(location.search);
  const requestedSet = params.get('set') || params.get('assetSet') || 'live';
  const gallerySet = assetSetIds().includes(requestedSet) ? requestedSet : 'live';
  const setLinks = assetSetIds().map((set) => {
    const q = new URLSearchParams(location.search);
    q.set('gallery', '1');
    q.set('set', set);
    return `<a class="${set === gallerySet ? 'active' : ''}" href="?${q.toString()}">${assetSetLabel(set)}</a>`;
  }).join('');
  const cats = {
    omens: Object.keys(OMENS).map((k) => [k, () => iconSvg(omenIconName(k), 64)]),
    boons: Object.keys(BOONS).map((k) => [k, () => iconSvg(`boon-${k}`, 64)]),
    arts: Object.keys(ARTS).map((k) => [k, () => iconSvg(`art-${k}`, 64)]),
    statuses: Object.keys(STATUS_INFO).map((k) => [k, () => iconSvg(`st-${k}`, 64)]),
    heroes: ASPECTS.map((a, i) => [a.id, () => heroSvg(i)]),
    enemies: Object.entries(ENEMIES).map(([k, d]) => [k, () => enemySvg(d.art)]),
    cards: Object.entries(CARDS).map(([k, d]) => [k, () => cardArtSvg(k, d.type)]),
    potions: Object.entries(POTIONS).map(([k, p]) => [k, () => potionSvg(p.tone)]),
    props: [['campfire', campfireSvg], ['chest', () => chestSvg(false)], ['chest-open', () => chestSvg(true)], ['merchant', merchantSvg]],
    events: Object.entries(EVENTS).map(([k, ev]) => [k, () => eventArtSvg(ev.glyph, ev.hue)]),
    title: [['title', () => '<div class="title-banner-ph">title</div>']],
    'title-background': [['background', () => '<div class="title-banner-ph">background</div>']],
    stage: ['act1', 'act2', 'act3'].flatMap((a) => ['backdrop', 'mid', 'ledge'].map((l) => [`${a}-${l}`, () => '<div class="title-banner-ph">stage</div>'])),
    relics: Object.entries(RELICS).map(([k, r]) => [k, () => `<div class="title-banner-ph" style="color:${r.tone}">${r.glyph}</div>`]),
    deeds: Object.keys(DEEDS).map((k) => [k, () => iconSvg(`deed-${k}`, 64)]),
    bequests: ['relic', 'card', 'gold'].map((k) => [k, () => iconSvg(`bequest-${k}`, 64)]),
    meta: [
      'fallen', 'ascended', 'monument-node',
      ROSE_ASSET_IDS.mural, ROSE_ASSET_IDS.frame, ...Object.values(ROSE_ASSET_IDS.masks),
    ].map((k) => [k, () => `<div class="title-banner-ph">${k}</div>`]),
    piles: ['draw', 'discard', 'ashes'].map((k) => [k, () => `<div class="title-banner-ph">${k}</div>`]),
    ui: UI_CHROME_IDS.map((k) => [k, () => {
      const fb = uiFallbackName(k);
      return fb ? iconSvg(fb, 64) : `<div class="title-banner-ph">${k}</div>`;
    }]),
  };
  screenEl().className = 'gallery-mode';
  screenEl().innerHTML = `<div class="g-toolbar">
    <div><b>Asset set:</b> ${assetSetLabel(gallerySet)}</div>
    <nav>${setLinks}</nav>
  </div>` + Object.entries(cats).map(([cat, items]) => {
    const done = items.filter(([id]) => assetUrl(cat, id, gallerySet)).length;
    return `<h2 class="g-head">${cat} — ${done}/${items.length} generated</h2>
      <div class="gallery">${items.map(([id, svg]) => {
        const u = assetUrl(cat, id, gallerySet);
        return `<div class="g-cell ${u ? 'g-png' : 'g-svg'}"><button class="g-art g-open" type="button" data-cat="${escHtml(cat)}" data-id="${escHtml(id)}" data-url="${u ? escHtml(u) : ''}" aria-label="Enlarge ${escHtml(id)}"><span class="g-art-stage">${u ? `<img class="raster-art" src="${escHtml(u)}" alt="">` : svg()}</span></button>
          <div class="g-label">${escHtml(id)}<span class="g-badge">${u ? 'PNG' : 'SVG'}</span></div></div>`;
      }).join('')}</div>`;
  }).join('');
  screenEl().onclick = (e) => {
    const trigger = e.target.closest('.g-open');
    if (!trigger) return;
    openGalleryLightbox(trigger, gallerySet);
  };
}

// ------------------------------------------------------------ audio gallery (?audio=1)
function renderAudioGallery() {
  const sc = screenEl();
  sc.className = 'gallery-mode audio-gallery-mode';
  const selection = getAudioSelection();
  const selectionProblems = getAudioSelectionProblems();
  const sourceControl = (kind, id) => {
    const source = getAudioSource(kind, id);
    const state = source?.overridden ? 'override' : source?.fallback ? 'base fallback' : 'pack';
    const ref = source?.ref ?? 'missing';
    if (!import.meta.env.DEV) {
      return `<span class="ag-source-read" title="${escHtml(state)}">${escHtml(ref)}</span>`;
    }
    const packDefault = getAudioPackDefaultRef(kind, id, selection) ?? 'missing';
    const selected = selection[kind].overrides[id] ?? '';
    const options = getAudioOverrideRefs(kind, id, { exclude: packDefault }).map((assetRef) => `
      <option value="${escHtml(assetRef)}" ${assetRef === selected ? 'selected' : ''}>${escHtml(assetRef)}</option>`).join('');
    return `<select class="ag-source" data-source-kind="${kind}" data-source-id="${escHtml(id)}" aria-label="Override ${escHtml(id)}">
      <option value="" ${selected ? '' : 'selected'}>Pack default · ${escHtml(packDefault)}</option>${options}
    </select>`;
  };
  const draftSelection = () => {
    if (!import.meta.env.DEV) return getAudioSelection();
    const payload = {
      music: { version: $('#ag-music-version', sc)?.value || selection.music.version, overrides: {} },
      sfx: { version: $('#ag-sfx-version', sc)?.value || selection.sfx.version, overrides: {} },
    };
    $$('.ag-source', sc).forEach((select) => {
      if (select.value) payload[select.dataset.sourceKind].overrides[select.dataset.sourceId] = select.value;
    });
    return payload;
  };
  const previewButton = '<button type="button" class="ag-preview" data-a="preview" aria-label="Preview">▶</button>';
  const sfxGroups = {};
  for (const row of SFX_CATALOG) (sfxGroups[row.group] ||= []).push(row);
  const sfxHtml = Object.entries(sfxGroups).map(([group, rows]) => `
    <h3 class="ag-sub">${escHtml(group)}</h3>
    <div class="ag-list">${rows.map((row) => `
      <div class="ag-row" data-kind="sfx" data-id="${escHtml(row.id)}"
        ${row.play === 'attack' ? `data-attack-who="${escHtml(row.attack.who)}" data-attack-amount="${row.attack.amount}"` : ''}>
        ${previewButton}
        <span class="ag-id">${escHtml(row.id)}</span>
        <span class="ag-use">${escHtml(row.use)}</span>
        <span class="ag-badge ${row.note ? '' : 'ag-badge-empty'}">${row.note ? escHtml(row.note) : ''}</span>
        ${sourceControl('sfx', row.id)}
      </div>`).join('')}</div>`).join('');
  const musicHtml = `<div class="ag-list">${MUSIC_CATALOG.map((row) => `
    <div class="ag-row ${row.wired ? '' : 'ag-unwired'}" data-kind="music" data-id="${escHtml(row.id)}">
      ${previewButton}
      <span class="ag-id">${escHtml(row.id)}</span>
      <span class="ag-title">${escHtml(row.title)}</span>
      <span class="ag-use">${escHtml(row.use)}</span>
      <span class="ag-badge">${row.wired ? 'wired' : 'unwired'}</span>
      ${sourceControl('music', row.id)}
    </div>`).join('')}</div>`;
  const versionSelect = (kind, label) => `<label>${label}
    <select id="ag-${kind}-version">${getAudioVersions(kind, { completeOnly: true }).map((version) => `
      <option value="${escHtml(version)}" ${version === selection[kind].version ? 'selected' : ''}>${escHtml(version)}</option>`).join('')}
    </select>
  </label>`;
  const diagnostics = selectionProblems.length
    ? `<div class="ag-config-errors">Using base packs: ${selectionProblems.map(escHtml).join(' · ')}</div>`
    : '';
  const editorHtml = import.meta.env.DEV ? `
    <section class="ag-editor" aria-label="Audio backend selection">
      <div><b>Runtime audio selection</b><span>Whole-pack versions must be complete. Individual overrides may use any installed <code>&lt;version&gt;/&lt;file&gt;</code>.</span></div>
      <div class="ag-editor-controls">
        ${versionSelect('music', 'Music version')}
        ${versionSelect('sfx', 'SFX version')}
        <button type="button" data-a="clear-overrides">Clear overrides</button>
        <button type="button" class="ag-save" data-a="save-audio">Save</button>
        <span id="ag-save-status" role="status"></span>
      </div>
      <p>Changing a row chooses that exact file for gameplay. ▶ previews the current row choice, including unsaved overrides. The current root assets remain the base versions.</p>
      ${diagnostics}
    </section>` : `
    <p class="ag-note">Active packs: Music <code>${escHtml(selection.music.version)}</code> · SFX <code>${escHtml(selection.sfx.version)}</code>. Production is read-only; the host supplies <code>audio-selection.json</code>.</p>
    ${diagnostics}`;
  sc.innerHTML = `<div class="g-toolbar">
    <div><b>Audio gallery</b> · use ▶ to preview · <a href="?">back to game</a> · <a href="?gallery=1">art gallery</a></div>
    <nav>
      <a href="#ag-sfx">SFX</a>
      <a href="#ag-music">Music</a>
      <button type="button" class="ag-stop" data-a="stop">Stop music</button>
    </nav>
  </div>
  ${editorHtml}
  <p class="ag-note">SFX are one-shots. Music loops until you pick another cue or Stop. Unwired music cues are registered for future content — preview still works here.</p>
  <h2 class="g-head" id="ag-sfx">SFX — ${SFX_CATALOG.length}</h2>
  ${sfxHtml}
  <h2 class="g-head" id="ag-music">Music — ${MUSIC_CATALOG.length}</h2>
  ${musicHtml}`;
  sc.onclick = async (e) => {
    const stop = e.target.closest('[data-a="stop"]');
    if (stop) { music.stop(); return; }
    if (import.meta.env.DEV) {
      const clear = e.target.closest('[data-a="clear-overrides"]');
      if (clear) {
        $$('.ag-source', sc).forEach((select) => { select.value = ''; });
        $('#ag-save-status', sc).textContent = 'Overrides cleared locally — Save to persist.';
        return;
      }
      const save = e.target.closest('[data-a="save-audio"]');
      if (save) {
        const status = $('#ag-save-status', sc);
        const payload = {
          music: { version: $('#ag-music-version', sc).value, overrides: {} },
          sfx: { version: $('#ag-sfx-version', sc).value, overrides: {} },
        };
        $$('.ag-source', sc).forEach((select) => {
          if (select.value) payload[select.dataset.sourceKind].overrides[select.dataset.sourceId] = select.value;
        });
        save.disabled = true;
        status.textContent = 'Saving…';
        try {
          const response = await fetch('/__audio-save', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(payload),
          });
          const result = await response.json();
          if (!response.ok || !result.ok) throw new Error((result.problems ?? [`HTTP ${response.status}`]).join(' · '));
          applyAudioSelection(payload);
          invalidateSfxSelection();
          music.invalidateMusicSelection();
          preloadSfx();
          const hash = location.hash;
          renderAudioGallery();
          if (hash) location.hash = hash;
          const nextStatus = $('#ag-save-status');
          if (nextStatus) nextStatus.textContent = 'Saved ✓';
        } catch (error) {
          save.disabled = false;
          status.textContent = `Save failed: ${String(error?.message ?? error)}`;
        }
        return;
      }
    }
    const preview = e.target.closest('[data-a="preview"]');
    const row = preview?.closest('.ag-row');
    if (!row) return;
    unlock();
    const id = row.dataset.id;
    const draft = draftSelection();
    if (row.dataset.kind === 'sfx') {
      music.stop();
      previewSfx(id, draft);
      return;
    }
    music.preview(id, draft);
  };
}

// ------------------------------------------------------------ boot
// ------------------------------------------------------------ test probe
// window.__probe — the contract the visual layer must satisfy, readable from
// the Playwright kit in test/e2e. Same spirit as window.spirebound: tiny,
// observational (readers/drivers reuse the real input code paths), plus a few
// explicit test-state shims for scenario setup (the same trick the engine
// self-test's forceHand uses). Never imported by engine.js/vigil.js.
function installProbe() {
  // all probe geometry is STAGE px — resolution-independent by construction:
  // the same run at 1280×800 and 1920×1080 must report identical numbers
  const rect = (sel) => { const n = document.querySelector(sel); return n ? stageRect(n) : null; };
  window.__probe = {
    // -- readers --------------------------------------------------------
    // one ground line: combatant feet, painted ledge lip and glow seam all
    // measure against the battlefield's bottom edge (hardening spec §1)
    stage: () => stageInfo(),
    geometry() {
      const bf = rect('.battlefield');
      if (!bf || !S.cb || !S.ce) return null;
      return {
        stage: stageInfo(),
        viewport: { w: stageW(), h: stageH() },
        groundY: bf.bottom,
        heroArtBottom: rect('.hero-wrap')?.bottom ?? null,
        enemyArtBottoms: S.cb.enemies.map((en, i) => (en.hp > 0 && S.ce.enemies[i] ? stageRect(S.ce.enemies[i].art).bottom : null)),
        slLedgeTop: rect('.sl-ledge')?.top ?? null,
        seamY: rect('.stage-ledge')?.top ?? null,
      };
    },
    invariants() {
      const out = [];
      const add = (name, pass, detail = '') => out.push({ name, pass, detail: pass ? '' : String(detail) });
      const cb = S.cb, ce = S.ce;
      if (cb && ce && S.screen === 'combat') {
        cb.enemies.forEach((en, i) => {
          const x = ce.enemies[i];
          if (!x) return;
          if (en.hp <= 0) {
            const cls = x.root.classList;
            add(`enemy${i}: dead body leaves the field`,
              cls.contains('gone') || cls.contains('dying') || getComputedStyle(x.root).visibility === 'hidden',
              `classes="${x.root.className}"`);
            add(`enemy${i}: dead body releases its mesh plane`,
              !x.root.querySelector('.mesh-live'),
              'a WebGL warp plane still renders this corpse');
          } else {
            add(`enemy${i}: HP label matches engine`,
              x.hp.textContent === `${Math.max(0, en.hp)}/${en.maxHp}`,
              `dom="${x.hp.textContent}" engine=${en.hp}/${en.maxHp}`);
          }
        });
        add('player: HP label matches engine',
          ce.pHp.textContent === `${Math.max(0, cb.player.hp)}/${cb.player.maxHp}`,
          `dom="${ce.pHp.textContent}" engine=${cb.player.hp}/${cb.player.maxHp}`);
        add('hand: DOM count matches engine',
          $$('.card', ce.hand).length === cb.hand.length,
          `dom=${$$('.card', ce.hand).length} engine=${cb.hand.length}`);
        add('energy: orb matches engine',
          $('.num', ce.energy).textContent === String(cb.player.energy),
          `dom="${$('.num', ce.energy).textContent}" engine=${cb.player.energy}`);
        add('embers: lantern count matches engine',
          $('.lb-count', ce.lantern).textContent === String(cb.embers),
          `dom="${$('.lb-count', ce.lantern).textContent}" engine=${cb.embers}`);
      }
      return out;
    },
    state() {
      const cb = S.cb;
      return {
        screen: S.screen, busy: S.busy,
        over: cb?.over ?? null, result: cb?.result ?? null, turn: cb?.turn ?? null,
        player: cb ? { hp: cb.player.hp, maxHp: cb.player.maxHp, block: cb.player.block, energy: cb.player.energy } : null,
        embers: cb?.embers ?? null,
        enemies: cb ? cb.enemies.map((e) => ({
          key: e.key, variantId: e.variantId, artId: combatantView(e).artId,
          hp: e.hp, maxHp: e.maxHp, block: e.block,
        })) : null,
        hand: cb ? cb.hand.map((c) => ({ uid: c.uid, id: c.id })) : null,
      };
    },
    settle: () => new Promise((res) => {
      const done = () => !S.busy && (!S.cb || S.cb.queue.length === 0);
      const check = () => (done() ? res(true) : setTimeout(check, 50));
      check();
    }),
    // -- drivers (reuse the real input code paths) ------------------------
    async play(uid, targetIdx = null) {
      if (S.busy || !S.cb || S.cb.over) return false;
      await doPlay(uid, targetIdx);
      // a played card leaves the hand; an unplayable one stays put
      return !S.cb || S.cb.over || !S.cb.hand.some((c) => c.uid === uid);
    },
    async endTurn() { await onEndTurn(); },
    async useArt() {
      if (S.busy || !S.cb || S.cb.over || !E.canUseArt(S.run, S.cb)) return false;
      E.useArt(S.run, S.cb);
      await drain();
      afterAction();
      return true;
    },
    async usePotion(slot, targetIdx = null) {
      if (S.busy || !E.usePotion(S.run, S.cb, slot, targetIdx)) return false;
      if (S.cb) { await drain(); afterAction(); }
      renderHud();
      return true;
    },
    // -- test-state shims (scenario setup only; engine-legal states) ------
    forceHand(ids) {
      S.cb.hand = ids.map((id) => E.makeCard(S.run, id));
      syncHand();
      return S.cb.hand.map((c) => c.uid);
    },
    setEnergy(n) { S.cb.player.energy = n; syncCombat(); },
    setEmbers(n) { S.cb.embers = n; syncCombat(); },
    setEnemyHp(i, hp) { S.cb.enemies[i].hp = hp; syncCombat(); },
    forceRoseFallback(on) {
      forceRoseFallback = !!on;
      if (S.screen === 'vigil') renderVigil({ tab: 'rose' });
      if (S.screen === 'title') renderTitle();
      return forceRoseFallback;
    },
    // -- determinism switch -----------------------------------------------
    freeze() {
      document.documentElement.classList.add('freeze');
      uiFrozen = true; // stop the living-glass rig (eyes/fire/pool flicker)
      V.freezeVfx();
      freezeScene();
    },
  };
}

export function initUI() {
  const bootQ = new URLSearchParams(location.search);
  if (bootQ.has('gallery')) return renderGallery();
  if (bootQ.has('audio')) return renderAudioGallery();
  initTooltip();
  document.addEventListener('pointerdown', () => unlock(), { once: true });
  document.addEventListener('contextmenu', (e) => { if (S.targeting) { e.preventDefault(); clearTargeting(); } });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (S.targeting) clearTargeting();
      else if ($('#overlay').classList.contains('open') && $('#overlay')._closable) closeOverlay();
    }
    if ((e.key === 'e' || e.key === 'E') && S.screen === 'combat' && !S.busy) onEndTurn();
    if ((e.key === 'a' || e.key === 'A') && S.screen === 'combat' && !S.busy) S.ce?.lantern?.click();
  });
  $('#overlay').addEventListener('pointerdown', (e) => {
    if (e.target === $('#overlay') && $('#overlay')._closable) closeOverlay();
  });
  window.spirebound = { S, E, startCombatUI, show, meshEnabled, meshDebug, refitCombat }; // ponytail: console debug hook, harmless in prod
  installProbe(); // window.__probe — contract readers + drivers for test/e2e
  requestAnimationFrame(rigTick); // living-glass rig: no-op outside combat
  // char-meta / battlefield-layout / ui-chrome-layout HMR → soft-apply without reload
  const softCombat = () => { if (S.screen === 'combat' && S.cb && S.ce) refitCombat(); };
  onCharMetaChange(softCombat);
  onBFChange(softCombat);
  onUICChange(softCombat);
  show('title');
}
