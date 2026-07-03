// SPIREBOUND UI — screens, combat playback, interactions.
import * as E from './engine.js';
import { CARDS, CARD_POOLS, RELICS, POTIONS, ENEMIES, EVENTS, ACTS, STATUS_INFO, PLAYER } from './data.js';
import { enemySvg, heroSvg, cardArtSvg, potionSvg, chestSvg, campfireSvg, merchantSvg, eventArtSvg, iconSvg, iconInline, crackSvg } from './art.js';
import * as V from './vfx.js';
import { sfx, unlock, toggleMute, isMuted, setAmbience, stopAmbience } from './audio.js';
import { setTheme, kick, mapNodePos, enterMapMode, exitMapMode, setOverlay, clearOverlay, peekMap, setAltitude, sunrise } from './scene3d.js';

const S = { run: null, cb: null, screen: 'title', targeting: null, busy: false, hoveredCard: null, ce: null };
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const screenEl = () => $('#screen');

function el(tag, cls = '', html = '') {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html) e.innerHTML = html;
  return e;
}

const KEYWORDS = {
  Vulnerable: STATUS_INFO.vulnerable.desc, Weak: STATUS_INFO.weak.desc, Frail: STATUS_INFO.frail.desc,
  Poison: STATUS_INFO.poison.desc, Strength: STATUS_INFO.str.desc, Dexterity: STATUS_INFO.dex.desc,
  Exhaust: 'Removed from your deck for the rest of this combat.',
  Block: 'Prevents damage. Expires at the start of your turn.',
  Energy: 'Spent to play cards. Refreshes each turn.',
  Unplayable: 'This card cannot be played.',
  Wound: 'Unplayable junk card.', Hex: 'Curse: lose 1 HP at end of turn while in hand.', Burn: 'Take 2 damage at end of turn while in hand.',
};

// ------------------------------------------------------------ tooltip
function initTooltip() {
  const tip = $('#tooltip');
  document.addEventListener('mouseover', (e) => {
    let n = e.target;
    while (n && n !== document.body && !n._tip) n = n.parentElement;
    if (n && n._tip) {
      const t = n._tip;
      tip.innerHTML = `${t.title ? `<div class="tt-title">${t.title}</div>` : ''}<div class="tt-body">${t.body || ''}</div>${t.sub ? `<div class="tt-sub">${t.sub}</div>` : ''}`;
      tip.style.display = 'block';
      moveTip(e);
    } else tip.style.display = 'none';
  });
  document.addEventListener('mousemove', moveTip);
  function moveTip(e) {
    if (tip.style.display !== 'block') return;
    const w = tip.offsetWidth, h = tip.offsetHeight;
    tip.style.left = `${Math.min(innerWidth - w - 12, e.clientX + 16)}px`;
    tip.style.top = `${Math.max(8, Math.min(innerHeight - h - 12, e.clientY - h / 2))}px`;
  }
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
      const v = inCombat && S.cb ? E.previewBlock(S.cb, base) : base;
      const cls = v > base ? 'boosted' : v < base ? 'reduced' : '';
      return `<span class="val ${cls}">${v}</span>`;
    });
  t = t.replace(/\b(Vulnerable|Weak|Frail|Poison|Strength|Dexterity|Exhaust|Block|Energy|Unplayable)\b/g, '<span class="kw">$1</span>');
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
  c.innerHTML = `${costHtml}<div class="card-inner">
    <div class="card-art">${cardArtSvg(inst.id, d.type)}</div>
    <div class="card-name">${d.name}</div>
    <div class="card-type">${d.type}</div>
    <div class="card-text"><span class="ct-inner">${txt}</span></div>
    <div class="card-rarity"></div>
  </div>`;
  $$('.kw', c).forEach((k) => (k._tip = { title: k.textContent, body: KEYWORDS[k.textContent] || '' }));
  // 3D tilt + mouse-tracked glare/foil
  c.addEventListener('mousemove', (e) => {
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
// the light economy: your HP is your lantern — the world itself darkens as you
// bleed, closing to a guttering circle of light at death's door.
function updateLantern() {
  const L = $('#lantern');
  if (!S.run || S.screen === 'title' || S.screen === 'end') {
    L.style.setProperty('--la', 0);
    L.classList.remove('gutter');
    return;
  }
  const p = S.run.player;
  const hp = S.cb && !S.cb.over ? S.cb.player.hp : p.hp;
  const t = Math.max(0, Math.min(1, (0.68 - hp / p.maxHp) / 0.53));
  L.style.setProperty('--la', (t * 0.82).toFixed(3)); // capped: intents stay readable in the dark
  L.style.setProperty('--lr', `${Math.round(1500 - t * 1000)}px`);
  let x = '50%', y = '55%';
  if (S.screen === 'combat' && S.ce?.hero) {
    const c = V.centerOf(S.ce.hero);
    x = `${Math.round(c.x)}px`;
    y = `${Math.round(c.y)}px`;
  }
  L.style.setProperty('--lx', x);
  L.style.setProperty('--ly', y);
  L.classList.toggle('gutter', t > 0.55);
}
function renderHud() {
  updateLantern();
  const hud = $('#hud');
  if (!S.run || S.screen === 'title' || S.screen === 'end') { hud.classList.remove('show'); document.body.classList.remove('low-hp'); return; }
  hud.classList.add('show');
  const p = S.run.player;
  const hp = S.cb && !S.cb.over ? S.cb.player.hp : p.hp;
  document.body.classList.toggle('low-hp', hp / p.maxHp <= 0.3);
  const act = ACTS[S.run.act];
  hud.innerHTML = `<div class="hud-bar">
      <div class="hud-hp-wrap">
        <div class="hud-stat"><span style="color:var(--hp)">♥</span> <span class="hp-num">${hp} / ${p.maxHp}</span></div>
        <div class="hud-hpbar"><div style="width:${(100 * hp) / p.maxHp}%"></div></div>
      </div>
      <div class="hud-stat"><span style="color:var(--gold)">¤</span> <span class="gold-num">${p.gold}</span></div>
      <div class="hud-mid"><b>${act.name.toUpperCase()}</b> &nbsp;·&nbsp; Act ${S.run.act + 1} &nbsp;·&nbsp; Floor ${S.run.floorsClimbed} &nbsp;·&nbsp; ${act.bossName}</div>
      <div class="hud-right">
        ${p.potions.map((id, i) => `<button class="potion-slot ${id ? 'full' : ''}" data-slot="${i}">${id ? potionSvg(POTIONS[id].tone) : ''}</button>`).join('')}
        <button class="icon-btn" data-act="deck">${iconSvg('cards', 19)}<span style="font-size:11px">${p.deck.length}</span></button>
        <button class="icon-btn" data-act="menu">≡</button>
      </div>
    </div>
    <div id="relicbar"></div>`;
  const bar = $('#relicbar', hud);
  for (const rid of p.relics) {
    const r = RELICS[rid];
    const chip = el('div', 'relic-chip', r.glyph);
    chip.style.setProperty('--tone', r.tone);
    chip.dataset.relic = rid;
    chip._tip = { title: r.name, body: r.text, sub: r.rarity };
    bar.appendChild(chip);
  }
  p.potions.forEach((id, i) => {
    if (!id) return;
    const slot = $(`.potion-slot[data-slot="${i}"]`, hud);
    slot._tip = { title: POTIONS[id].name, body: POTIONS[id].text, sub: 'Click to use or toss' };
  });
  $('[data-act="deck"]', hud).onclick = () => { sfx.click(); showCardGrid('Your Deck', S.run.player.deck, { sub: `${S.run.player.deck.length} cards` }); };
  $('[data-act="menu"]', hud).onclick = (e) => { sfx.click(); openMenu(e.clientX, e.clientY); };
  $$('.potion-slot.full', hud).forEach((slot) => (slot.onclick = (e) => potionMenu(+slot.dataset.slot, e)));
}
function openMenu(x, y) {
  closeMenus();
  const m = el('div', 'pop-menu');
  m.innerHTML = `<button data-m="help">How to Play</button><button data-m="mute">${isMuted() ? 'Unmute' : 'Mute'} Sound</button><button data-m="abandon" style="color:#ff8d8d">Abandon Run</button>`;
  document.body.appendChild(m);
  m.style.left = `${Math.min(x, innerWidth - 200)}px`;
  m.style.top = `${y + 8}px`;
  m.onclick = (e) => {
    const a = e.target.dataset.m;
    closeMenus();
    if (a === 'help') showHelp();
    if (a === 'mute') toggleMute();
    if (a === 'abandon') confirmAbandon();
  };
  setTimeout(() => document.addEventListener('pointerdown', closeMenusOnce, { once: true }), 0);
}
const closeMenus = () => $$('.pop-menu').forEach((m) => m.remove());
const closeMenusOnce = (e) => { if (!e.target.closest('.pop-menu')) closeMenus(); };
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
  document.body.appendChild(m);
  m.style.left = `${Math.min(e.clientX - 60, innerWidth - 220)}px`;
  m.style.top = `${e.clientY + 10}px`;
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
  openOverlay(`<div class="panel ov-panel" style="text-align:center">
    <div class="ov-title">Abandon Run?</div>
    <div class="ov-sub">Your climb will be lost to the void.</div>
    <div class="ov-actions"><button class="btn danger" data-a="yes">Abandon</button><button class="btn ghost" data-a="no">Keep Climbing</button></div>
  </div>`, (root) => {
    root.onclick = (e) => {
      const a = e.target.dataset.a;
      if (a === 'yes') { E.recordRunEnd(S.run, false); S.run = null; S.cb = null; closeOverlay(); stopAmbience(); show('title'); }
      if (a === 'no') closeOverlay();
    };
  });
}

// ------------------------------------------------------------ overlay helpers
function openOverlay(html, wire = null, closable = false) {
  const ov = $('#overlay');
  ov.innerHTML = html;
  ov.classList.add('open');
  ov._closable = closable;
  if (wire) wire(ov.firstElementChild);
}
function closeOverlay() {
  const ov = $('#overlay');
  ov.classList.remove('open');
  ov.innerHTML = '';
}
function showCardGrid(title, instances, { sub = '', pick = null, canSkip = false, skipLabel = 'Skip', inCombat = false } = {}) {
  const panel = el('div', 'panel ov-panel');
  panel.innerHTML = `<div class="ov-title">${title}</div>${sub ? `<div class="ov-sub">${sub}</div>` : ''}`;
  const grid = el('div', `card-grid ${pick ? 'choice-cards' : ''}`);
  const sorted = pick ? instances : [...instances].sort((a, b) => E.cardData(a).name.localeCompare(E.cardData(b).name));
  for (const inst of sorted) {
    const c = cardEl(inst, { inCombat });
    if (pick) c.onclick = () => { sfx.click(); c.classList.add('picked'); setTimeout(() => { closeOverlay(); pick(inst); }, 240); };
    grid.appendChild(c);
  }
  panel.appendChild(grid);
  const actions = el('div', 'ov-actions');
  if (canSkip && pick) {
    const skip = el('button', 'btn ghost', skipLabel);
    skip.onclick = () => { sfx.click(); closeOverlay(); pick(null); };
    actions.appendChild(skip);
  }
  if (!pick) {
    const close = el('button', 'btn ghost', 'Close');
    close.onclick = () => { sfx.click(); closeOverlay(); };
    actions.appendChild(close);
  }
  panel.appendChild(actions);
  openOverlay('', null, !pick);
  $('#overlay').appendChild(panel);
}
function showHelp() {
  openOverlay(`<div class="panel ov-panel howto">
    <div class="ov-title">How to Play</div>
    <h3>The Climb</h3>Choose a path up the map. Fight monsters, gather cards, relics and potions, and defeat the boss of each of the <b>3 acts</b>.
    <h3>Combat</h3>Each turn you draw <b>5 cards</b> and gain <b>3 Energy</b> (⬤). Click a card to play it — attacks need a target when several enemies remain. Enemies telegraph their <b>intent</b> above their heads: sword icons with numbers show incoming damage. End your turn when you're done.
    <h3>Block & Statuses</h3><b>Block</b> absorbs damage but expires each turn. <b>Vulnerable</b> ×1.5 damage taken · <b>Weak</b> −25% damage dealt · <b>Frail</b> −25% Block · <b>Poison</b> damages each turn.
    <h3>Cards</h3>Your deck reshuffles when the draw pile empties. <b>Exhaust</b> removes a card for the combat. Keep your deck lean — every reward is optional.
    <h3>The Fires & The Merchant</h3>Rest sites heal <b>30%</b> or upgrade a card. Shops sell cards, relics, potions — and can <b>remove</b> a card from your deck.
    <div class="ov-actions"><button class="btn" data-a="ok">Fight On</button></div>
  </div>`, (root) => { $('[data-a="ok"]', root).onclick = () => { sfx.click(); closeOverlay(); }; }, true);
}

// ------------------------------------------------------------ screens
export function show(name, data) {
  S.screen = name;
  closeMenus();
  if (name !== 'map') { exitMapMode(); clearOverlay(); }
  const sc = screenEl();
  sc.className = '';
  sc.onclick = null; // screens share #screen — never let a stale delegate survive
  ({
    title: renderTitle, map: renderMap, combat: () => {}, reward: renderReward, rest: renderRest,
    shop: renderShop, event: renderEvent, treasure: renderTreasure, bossRelic: renderBossRelic, end: renderEnd,
  })[name](data);
  renderHud();
}

function renderTitle() {
  stopAmbience();
  setTheme(0);
  const stats = E.loadStats();
  const saved = E.loadRun();
  const sc = screenEl();
  sc.innerHTML = `<div class="title-screen screen-enter">
    <div class="logo">SPIREBOUND</div>
    <div class="tagline">A Roguelite Deckbuilder · Three Acts of the Void</div>
    <div class="title-btns">
      ${saved ? '<button class="btn" data-a="continue">Continue Climb</button>' : ''}
      <button class="btn" data-a="new">New Run</button>
      <button class="btn ghost" data-a="help">How to Play</button>
      <button class="btn ghost" data-a="mute">${isMuted() ? 'Unmute' : 'Mute'} Sound</button>
    </div>
    <div class="title-stats">${stats.runs} runs · ${stats.wins} victories · deepest climb: floor ${stats.best}</div>
  </div>`;
  sc.onclick = (e) => {
    const a = e.target.dataset?.a;
    if (!a) return;
    unlock(); sfx.click();
    if (a === 'new') {
      if (saved) E.clearSave();
      startRun(E.newRun());
    }
    if (a === 'continue' && saved) startRun(saved, true);
    if (a === 'help') showHelp();
    if (a === 'mute') { toggleMute(); renderTitle(); }
  };
}
function startRun(run, resumed = false) {
  S.run = run;
  S.cb = null;
  setTheme(run.act);
  const curNode = run.nodeId ? run.map.nodes.find((n) => n.id === run.nodeId) : null;
  setAltitude(run.act, curNode ? curNode.row : 0);
  setAmbience(run.act);
  if (!resumed) E.saveRun(run);
  if (resumed && run.pendingCombat) {
    // died-to-reload protection: an unfinished fight restarts fresh
    const node = run.map.nodes.find((n) => n.id === run.nodeId);
    S.screen = 'combat';
    startCombatUI(E.rollEncounter(run, run.pendingCombat, node ? node.row : 5), run.pendingCombat);
    renderHud();
    return;
  }
  show('map');
}

const NODE_ICONS = { monster: 'sword', elite: 'skull', event: 'question', rest: 'flame', shop: 'coin', treasure: 'chest', boss: 'crown' };
function renderMap() {
  const run = S.run;
  if (run.pendingCombat) { // invariant: an unresolved fight always resumes
    const node = run.map.nodes.find((n) => n.id === run.nodeId);
    S.screen = 'combat';
    startCombatUI(E.rollEncounter(run, run.pendingCombat, node ? node.row : 5), run.pendingCombat);
    return;
  }
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
    const cls = [
      'mnode', `type-${n.type}`,
      visited.has(n.id) ? 'visited' : '',
      n.id === run.nodeId ? 'current' : '',
      avail.has(n.id) ? 'avail' : '',
    ].join(' ');
    const r = n.type === 'boss' ? 26 : n.type === 'elite' || n.type === 'treasure' ? 19 : 16;
    const isz = n.type === 'boss' ? 26 : n.type === 'elite' || n.type === 'treasure' ? 20 : 17;
    dots += `<g class="${cls}" data-node="${n.id}" style="--d:${n.row * 34}ms">
      <g class="nwrap"><circle class="bg" r="${r}"/><g class="icg">${iconInline(NODE_ICONS[n.type], isz)}</g></g>
    </g>`;
  }
  const act = ACTS[run.act];
  screenEl().innerHTML = `
    <div class="map-title">ACT ${run.act + 1} — <b>${act.name.toUpperCase()}</b> — ${act.bossName} awaits</div>
    <div class="map-screen screen-enter">
      <svg class="map-svg" width="100%" height="100%">${edges}${dots}</svg>
      <div class="map-hint">scroll to survey the Spire</div>
    </div>`;
  const svg = $('.map-svg');
  svg.onclick = (e) => {
    const g = e.target.closest('.mnode.avail');
    if (!g || S.busy) return;
    unlock();
    enterNode(nodes.find((n) => n.id === g.dataset.node));
  };
  // tooltips on nodes
  $$('.mnode', svg).forEach((g) => {
    const n = nodes.find((x) => x.id === g.dataset.node);
    const names = { monster: 'Monster', elite: 'Elite — beware', event: 'Unknown event', rest: 'Rest site', shop: 'Merchant', treasure: 'Treasure', boss: ACTS[run.act].bossName };
    g._tip = { title: names[n.type], body: avail.has(n.id) ? 'Click to travel here.' : '' };
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
      g.style.opacity = (pt.fade * (dimIds.has(id) ? 0.4 : 1)).toFixed(3);
    }
    for (const { p, a, b } of edgeEls) {
      const A = P.get(a), B = P.get(b);
      const sag = 9 * (A.s + B.s) / 2; // chains between lanterns hang a little
      p.setAttribute('d', `M${A.x.toFixed(1)} ${A.y.toFixed(1)} Q${((A.x + B.x) / 2).toFixed(1)} ${((A.y + B.y) / 2 + sag).toFixed(1)} ${B.x.toFixed(1)} ${B.y.toFixed(1)}`);
      p.style.opacity = Math.min(A.fade, B.fade).toFixed(3);
    }
  });
  $('.map-screen').addEventListener('wheel', (e) => {
    e.preventDefault();
    peekMap(-e.deltaY * 0.006);
  }, { passive: false });
}
function enterNode(node) {
  const run = S.run;
  sfx.map();
  setAltitude(run.act, node.row);
  run.nodeId = node.id;
  run.floorsClimbed = node.row + 1;
  run.map.visited.push(node.id);
  E.saveRun(run);
  if (node.type === 'monster' || node.type === 'elite' || node.type === 'boss') {
    run.pendingCombat = node.type;
    E.saveRun(run);
    startCombatUI(E.rollEncounter(run, node.type, node.row), node.type);
  } else if (node.type === 'rest') show('rest');
  else if (node.type === 'shop') show('shop');
  else if (node.type === 'treasure') show('treasure');
  else if (node.type === 'event') show('event', E.rollEvent(run));
}

// ------------------------------------------------------------ combat
function startCombatUI(enemyIds, kind) {
  exitMapMode(); // combat can start without going through show()
  clearOverlay();
  S.cb = E.startCombat(S.run, enemyIds, kind);
  S.screen = 'combat';
  renderCombat();
  renderHud();
  if (kind === 'boss') {
    const b = el('div', 'turn-banner boss-banner', S.cb.enemies[0].name.toUpperCase());
    screenEl().appendChild(b);
    setTimeout(() => b.remove(), 2100);
    V.flash('#1a0a20', 0.5, 0.9);
    kick(1.6);
    sfx.bigDeath();
  }
  drain().then(afterAction);
}
function renderCombat() {
  const cb = S.cb;
  const sc = screenEl();
  sc.onclick = null;
  sc.innerHTML = `<div class="combat-screen screen-enter intro">
    <div class="battlefield">
      <div class="player-zone">
        <div class="hero-wrap">${heroSvg()}</div>
        <div class="hpbar-wrap"><span class="block-chip zero p-block">${iconSvg('shield', 13)} 0</span><div class="hpbar"><div class="ghost"></div><div class="fill"></div></div><span class="hp-label p-hp"></span></div>
        <div class="status-row p-status"></div>
        <div class="name">${PLAYER.name.toUpperCase()}</div>
      </div>
      <div class="enemy-zone"></div>
    </div>
    <div class="energy-orb"><div class="num">0</div><div class="lbl">ENERGY</div><div class="candles"></div></div>
    <button class="btn end-turn">End Turn</button>
    <button class="pile-btn pile-draw"><span class="cnt">0</span><span class="lbl">DRAW</span></button>
    <button class="pile-btn pile-discard"><span class="cnt">0</span><span class="lbl">DISCARD</span></button>
    <button class="pile-btn pile-exhaust"><span class="cnt">0</span><span class="lbl">EXHAUST</span></button>
    <div class="hand-zone"></div>
  </div>`;
  const zone = $('.enemy-zone', sc);
  const ce = { enemies: [], root: $('.combat-screen', sc) };
  cb.enemies.forEach((en, i) => {
    const d = ENEMIES[en.key];
    const base = d.boss ? 280 : d.elite ? 230 : 185;
    const raw = base * (d.art.size >= 1.4 ? 1 : d.art.size < 0.8 ? 0.86 : 0.95) * Math.min(d.art.size, 1.45);
    const size = Math.round(Math.min(raw, innerHeight * (d.boss ? 0.34 : 0.3)));
    const box = el('div', `enemy${d.elite ? ' elite-e' : ''}${d.boss ? ' boss-e' : ''}`);
    box.dataset.idx = i;
    box.style.animationDelay = `${160 + i * 130}ms`;
    box.innerHTML = `<div class="intent"></div>
      <div class="enemy-art" style="width:${size}px;height:${size}px">${enemySvg(d.art)}</div>
      <div class="name">${en.name.toUpperCase()}</div>
      <div class="hpbar-wrap"><span class="block-chip zero">${iconSvg('shield', 13)} 0</span><div class="hpbar"><div class="ghost"></div><div class="fill"></div></div><span class="hp-label"></span></div>
      <div class="status-row"></div>`;
    zone.appendChild(box);
    ce.enemies.push({
      root: box, art: $('.enemy-art', box), intent: $('.intent', box),
      fill: $('.fill', box), ghost: $('.ghost', box), hp: $('.hp-label', box),
      block: $('.block-chip', box), statuses: $('.status-row', box),
    });
    box.onclick = () => onEnemyClick(i);
    box.onmouseenter = () => { if (S.targeting) box.classList.add('target-hover'); };
    box.onmouseleave = () => box.classList.remove('target-hover');
  });
  ce.pHp = $('.p-hp', sc); ce.pFill = $('.player-zone .fill', sc); ce.pGhost = $('.player-zone .ghost', sc);
  ce.pBlock = $('.p-block', sc); ce.pStatus = $('.p-status', sc); ce.hero = $('.hero-wrap', sc);
  ce.energy = $('.energy-orb', sc); ce.endTurn = $('.end-turn', sc); ce.hand = $('.hand-zone', sc);
  ce.draw = $('.pile-draw', sc); ce.discard = $('.pile-discard', sc); ce.exhaust = $('.pile-exhaust', sc);
  S.ce = ce;
  // drop the intro class once entrances finish so .acting doesn't retrigger them
  setTimeout(() => ce.root.classList.remove('intro'), 1300);
  ce.endTurn.onclick = onEndTurn;
  ce.draw.onclick = () => { sfx.click(); showCardGrid('Draw Pile', cb.draw, { sub: 'Order hidden — shown alphabetically', inCombat: true }); };
  ce.discard.onclick = () => { sfx.click(); showCardGrid('Discard Pile', cb.discard, { inCombat: true }); };
  ce.exhaust.onclick = () => { sfx.click(); showCardGrid('Exhausted', cb.exhaust, { inCombat: true }); };
  ce.root.addEventListener('pointerdown', (e) => {
    if (S.targeting && !e.target.closest('.enemy') && !e.target.closest('.card')) clearTargeting();
  });
  syncCombat();
  syncHand();
}
const enemyCenter = (i) => V.centerOf(S.ce.enemies[i].art);
const heroCenter = () => V.centerOf(S.ce.hero);

function statusChips(container, statuses, isPlayer) {
  container.innerHTML = '';
  for (const [id, n] of Object.entries(statuses)) {
    if (!n) continue;
    const info = STATUS_INFO[id] || { name: id, icon: '?', kind: 'buff', desc: '' };
    const kind = id === 'str' && n < 0 ? 'debuff' : info.kind;
    const chip = el('span', `schip ${kind}`, `${info.icon} <span class="n">${n}</span>`);
    chip._tip = { title: info.name, body: info.desc.replace(/\bN\b/g, n), sub: kind === 'debuff' ? 'Debuff' : 'Buff' };
    container.appendChild(chip);
  }
}
function intentFor(e) {
  const cb = S.cb;
  const mv = E.enemyMove(e);
  const p = E.previewEnemyDmg(cb, e);
  let icon = { attack: iconSvg('sword', 19), block: iconSvg('shield', 19), buff: iconSvg('up', 19), debuff: iconSvg('cloud', 19), heal: iconSvg('plus', 19) }[mv.intent] || iconSvg('sword', 19);
  let txt = '';
  if (mv.intent.startsWith('attack')) {
    icon = iconSvg('sword', 19);
    txt = p.times > 1 ? `${p.dmg}×${p.times}` : `${p.dmg}`;
    if (mv.intent === 'attack_debuff') icon += iconSvg('cloud', 14);
    if (mv.intent === 'attack_block') icon += iconSvg('shield', 14);
    if (mv.intent === 'attack_buff') icon += iconSvg('up', 14);
  }
  const tipBits = [];
  if (p) tipBits.push(`attack for <b>${p.dmg}${p.times > 1 ? `×${p.times}` : ''}</b>`);
  if (mv.block) tipBits.push('gain Block');
  if (mv.heal) tipBits.push('heal itself');
  if (mv.fx?.some((f) => f.who === 'player')) tipBits.push('afflict you');
  if (mv.fx?.some((f) => f.who !== 'player')) tipBits.push('empower');
  if (mv.addCards) tipBits.push(`add ${mv.addCards.n} ${CARDS[mv.addCards.id].name}s to your discard`);
  return { icon, txt, tip: { title: mv.name, body: `Intends to ${tipBits.join(', ') || 'act'}.` } };
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
    x.block.innerHTML = `${iconSvg('shield', 13)} ${en.block}`;
    x.art.classList.toggle('warded', en.block > 0);
    statusChips(x.statuses, en.statuses, false);
    if (en.hp <= 0) x.root.classList.add('gone');
    if (en.hp > 0 && en.moveKey) {
      const it = intentFor(en);
      x.intent.className = `intent i-${E.enemyMove(en).intent}`;
      x.intent.innerHTML = `<span class="ic">${it.icon}</span>${it.txt}`;
      x.intent._tip = it.tip;
    } else x.intent.innerHTML = '';
  });
  const P = cb.player;
  const pct = `${(100 * Math.max(0, P.hp)) / P.maxHp}%`;
  ce.pFill.style.width = pct;
  ce.pGhost.style.width = pct;
  ce.pHp.textContent = `${Math.max(0, P.hp)}/${P.maxHp}`;
  ce.pBlock.classList.toggle('zero', P.block <= 0);
  ce.pBlock.innerHTML = `${iconSvg('shield', 13)} ${P.block}`;
  ce.hero.classList.toggle('warded', P.block > 0);
  statusChips(ce.pStatus, P.statuses, true);
  $('.num', ce.energy).textContent = P.energy;
  ce.energy.classList.toggle('spent', P.energy === 0);
  // candles gutter as energy is spent
  const cd = $('.candles', ce.energy);
  const maxE = Math.max(P.energyMax, P.energy);
  if (cd.children.length !== maxE) cd.innerHTML = Array.from({ length: maxE }, () => '<span class="candle"></span>').join('');
  [...cd.children].forEach((c, i) => c.classList.toggle('lit', i < P.energy));
  $('.cnt', ce.draw).textContent = cb.draw.length;
  $('.cnt', ce.discard).textContent = cb.discard.length;
  $('.cnt', ce.exhaust).textContent = cb.exhaust.length;
}
function syncHand() {
  const cb = S.cb, ce = S.ce;
  if (!ce) return;
  const wrap = ce.hand;
  const have = new Map($$('.card', wrap).map((c) => [c.dataset.uid, c]));
  const want = new Set(cb.hand.map((c) => String(c.uid)));
  for (const [uid, elc] of have) if (!want.has(uid)) elc.remove();
  for (const inst of cb.hand) {
    if (!have.has(String(inst.uid))) {
      const c = cardEl(inst, { inCombat: true });
      c.classList.add('draw-in');
      setTimeout(() => c.classList.remove('draw-in'), 400);
      c.onclick = (e) => { e.stopPropagation(); onCardClick(inst.uid); };
      c.onmouseenter = () => { S.hoveredCard = inst.uid; sfx.hover(); layoutHand(); };
      c.onmouseleave = () => { if (S.hoveredCard === inst.uid) S.hoveredCard = null; layoutHand(); };
      wrap.appendChild(c);
    } else {
      // refresh cost/text (str/dex/duskmirror can change display)
      const fresh = cardEl(inst, { inCombat: true });
      const old = have.get(String(inst.uid));
      old.replaceChildren(...fresh.childNodes);
      old.className = fresh.className + (old.classList.contains('armed') ? ' armed' : '');
      old.onclick = (e) => { e.stopPropagation(); onCardClick(inst.uid); };
      old.onmouseenter = () => { S.hoveredCard = inst.uid; layoutHand(); };
      old.onmouseleave = () => { if (S.hoveredCard === inst.uid) S.hoveredCard = null; layoutHand(); };
    }
  }
  layoutHand();
}
function layoutHand() {
  const cb = S.cb, ce = S.ce;
  if (!ce) return;
  const cards = cb.hand.map((c) => String(c.uid));
  const els = new Map($$('.card', ce.hand).map((c) => [c.dataset.uid, c]));
  const n = cards.length;
  const gap = Math.min(112, 640 / Math.max(n, 1));
  cards.forEach((uid, i) => {
    const c = els.get(uid);
    if (!c) return;
    const inst = cb.hand[i];
    const d = E.cardData(inst);
    const playableNow = !d.unplayable && (E.effCost(S.run, cb, inst) ?? 99) <= cb.player.energy;
    c.classList.toggle('unplayable-now', !playableNow);
    const armed = S.targeting?.kind === 'card' && String(S.targeting.uid) === uid;
    const hovered = S.hoveredCard != null && String(S.hoveredCard) === uid;
    const rot = n > 1 ? (i - (n - 1) / 2) * Math.min(5, 42 / n) : 0;
    const x = (i - (n - 1) / 2) * gap;
    const y = Math.abs(rot) * 3.2;
    c.classList.toggle('armed', armed);
    if (armed) c.style.transform = `translateX(calc(-50% + ${x * 0.4}px)) translateY(-150px) scale(1.24)`;
    else if (hovered && !S.busy) c.style.transform = `translateX(calc(-50% + ${x}px)) translateY(-92px) scale(1.38)`;
    else c.style.transform = `translateX(calc(-50% + ${x}px)) translateY(${y + 26}px) rotate(${rot}deg)`;
    c.style.zIndex = hovered || armed ? 40 : 20 + i;
  });
}
function onCardClick(uid) {
  if (S.busy || !S.cb || S.cb.over) return;
  const cb = S.cb;
  const inst = cb.hand.find((c) => c.uid === uid);
  if (!inst) return;
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
  document.addEventListener('mousemove', aimMove);
  aimMove._last && aimMove(aimMove._last);
}
function clearTargeting() {
  S.targeting = null;
  $('#aim').innerHTML = '';
  document.removeEventListener('mousemove', aimMove);
  if (S.ce) {
    S.ce.root.classList.remove('targeting');
    S.ce.enemies.forEach((x) => x.root.classList.remove('targetable', 'target-hover'));
    layoutHand();
  }
}
function aimMove(e) {
  aimMove._last = e;
  if (!S.targeting) return;
  let from;
  if (S.targeting.kind === 'card') {
    const c = $(`.card[data-uid="${S.targeting.uid}"]`);
    from = c ? V.centerOf(c) : { x: innerWidth / 2, y: innerHeight - 200 };
  } else from = { x: innerWidth / 2, y: 60 };
  const mx = e.clientX, my = e.clientY;
  const cx = (from.x + mx) / 2, cy = Math.min(from.y, my) - 120;
  $('#aim').innerHTML = `<path d="M${from.x} ${from.y - 80} Q${cx} ${cy} ${mx} ${my}" fill="none" stroke="rgba(255,89,100,.85)" stroke-width="4" stroke-dasharray="4 10" stroke-linecap="round"/>
    <circle cx="${mx}" cy="${my}" r="9" fill="none" stroke="rgba(255,89,100,.95)" stroke-width="3"/>`;
}
async function doPlay(uid, targetIdx) {
  clearTargeting();
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

// --------- the playback loop: engine queue -> animations
let heroActing = false; // true between a card play and end of turn — gates the hero lunge
// glass damage language: every landed hit scores a crack into the body
function addCrack(artEl, big) {
  const layer = artEl && $('.cracks', artEl);
  if (layer && layer.children.length < 8) layer.insertAdjacentHTML('beforeend', crackSvg(big));
}
async function drain(targetIdx = null) {
  const cb = S.cb, ce = S.ce;
  S.busy = true;
  ce.endTurn.classList.add('enemy-phase');
  const q = cb.queue;
  while (q.length) {
    const ev = q.shift();
    try { await handleEvent(ev, targetIdx); } catch (err) { console.error('vfx event error', ev, err); }
  }
  S.busy = false;
  if (!cb.over) ce.endTurn.classList.remove('enemy-phase');
  syncCombat();
  syncHand();
  renderHud();
}
async function handleEvent(ev, targetIdx) {
  const cb = S.cb, ce = S.ce;
  switch (ev.t) {
    case 'turn': {
      if (ev.n > 1) { banner('YOUR TURN'); sfx.turn(); }
      syncCombat();
      await sleep(ev.n > 1 ? 500 : 120);
      break;
    }
    case 'endTurn': heroActing = false; banner('ENEMY TURN'); await sleep(480); break;
    case 'draw': {
      syncHand(); syncCombat(); sfx.draw();
      await sleep(75);
      break;
    }
    case 'reshuffle': {
      sfx.card();
      V.floatText(...Object.values(V.centerOf(ce.draw)), 'Reshuffle', 'notice');
      await sleep(240);
      break;
    }
    case 'play': {
      const c = $(`.card[data-uid="${ev.uid}"]`, ce.hand);
      sfx.card();
      heroActing = true;
      if (c && targetIdx != null && cb.enemies[targetIdx]) {
        // targeted attacks: the card itself streaks into the enemy
        const r = c.getBoundingClientRect();
        const { x: tx, y: ty } = enemyCenter(targetIdx);
        const ghost = c.cloneNode(true);
        Object.assign(ghost.style, { position: 'fixed', left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px`, margin: 0, transform: 'none', zIndex: 56, pointerEvents: 'none' });
        document.getElementById('floaties').appendChild(ghost);
        c.remove();
        ghost.animate(
          [{ transform: 'none', opacity: 1 }, { transform: `translate(${tx - r.left - r.width / 2}px,${ty - r.top - r.height / 2}px) scale(0.22) rotate(14deg)`, opacity: 0 }],
          { duration: 270, easing: 'cubic-bezier(.45,0,.9,.5)' }
        ).onfinish = () => ghost.remove();
      } else if (c) {
        c.classList.add('played-up');
        setTimeout(() => c.remove(), 320);
      }
      syncCombat();
      await sleep(200);
      break;
    }
    case 'hitEnemy': {
      const x = ce.enemies[ev.idx];
      const { x: ex, y: ey } = enemyCenter(ev.idx);
      if (ev.poison) {
        sfx.poison();
        V.motes(ex, ey, '#a3e06c', 14);
        V.floatText(ex, ey - 20, `${ev.amount}`, 'poisonf');
      } else {
        const big = ev.amount >= 16;
        if (heroActing) {
          ce.hero.classList.remove('lunge');
          void ce.hero.offsetWidth;
          ce.hero.classList.add('lunge');
        }
        sfx.slash();
        if (ev.amount > 0) sfx.hit();
        V.slashArc(ex, ey, big ? '#ffd8a0' : '#ffffff');
        V.burst(ex, ey, { color: '#ff9a6a', n: big ? 30 : 14, speed: big ? 420 : 260 });
        if (ev.blocked > 0) { sfx.blocked(); V.floatText(ex, ey + 26, `${iconSvg('shield', 19)}${ev.blocked}`, 'blockedf'); }
        if (ev.amount > 0) V.floatText(ex, ey - 24, `${ev.amount}`, big ? 'crit' : 'dmg');
        else if (!ev.blocked) V.floatText(ex, ey - 24, '0', 'blockedf');
        V.shake(Math.min(4 + ev.amount * 0.5, 15));
        kick(Math.min(0.2 + ev.amount / 26, 1));
        if (big) { V.hitstop(70); V.ring(ex, ey, '#ffd8a0', 10, 620, 5); }
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
      (en.boss || en.elite ? sfx.bigDeath : sfx.death)();
      V.shatter(x.art); // the glass body breaks apart
      V.burst(ex, ey, { color: '#dfeaff', n: 30, speed: 480, size: 2.6, grav: 340, kind: 'spark' });
      V.burst(ex, ey, { color: '#c9b0ff', n: 26, speed: 380, size: 3.2, grav: 60 });
      V.ring(ex, ey, '#e8dcff', 12, 720, 6);
      V.flash('#ffffff', en.boss ? 0.24 : 0.1, 0.3);
      V.shake(en.boss ? 22 : 12);
      kick(en.boss ? 2 : 0.9);
      x.root.classList.add('dying');
      setTimeout(() => { x.root.classList.remove('dying'); x.root.classList.add('gone'); }, 830);
      await sleep(en.boss ? 900 : 500);
      break;
    }
    case 'hitPlayer': {
      const { x: hx, y: hy } = heroCenter();
      if (ev.source === 'poison') { sfx.poison(); V.motes(hx, hy, '#a3e06c', 14); }
      else if (ev.source === 'burn' || ev.source === 'self') sfx.debuff();
      else if (ev.source === 'thorns') sfx.blocked();
      else {
        sfx.slash();
        if (ev.amount > 0) { sfx.hit(); V.flash('#ff2233', Math.min(0.05 + ev.amount * 0.012, 0.3), 0.3); }
        V.slashArc(hx, hy, '#ff8888');
      }
      if (ev.blocked > 0) { sfx.blocked(); V.floatText(hx, hy + 30, `${iconSvg('shield', 19)}${ev.blocked}`, 'blockedf'); }
      if (ev.amount > 0) {
        V.floatText(hx, hy - 30, `${ev.amount}`, ev.amount >= 16 ? 'crit' : 'dmg');
        V.shake(Math.min(5 + ev.amount * 0.6, 18));
        kick(Math.min(0.3 + ev.amount / 22, 1.2));
        addCrack(ce.hero, ev.amount >= 16);
      } else if (!ev.blocked) V.floatText(hx, hy - 30, '0', 'blockedf');
      syncCombat(); renderHud();
      await sleep(240);
      break;
    }
    case 'blockGain': {
      const isP = ev.who === 'player';
      const { x, y } = isP ? heroCenter() : enemyCenter(ev.who);
      sfx.block();
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
    case 'energy': syncCombat(); ce.energy.classList.remove('pop'); void ce.energy.offsetWidth; ce.energy.classList.add('pop'); break;
    case 'exhaust': {
      const c = $(`.card[data-uid="${ev.uid}"]`, ce.hand);
      if (c) {
        // the card burns away edge-inward, embers rising off it
        const r = c.getBoundingClientRect();
        const ghost = c.cloneNode(true);
        Object.assign(ghost.style, { position: 'fixed', left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px`, margin: 0, transform: 'none', zIndex: 56, pointerEvents: 'none' });
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
        V.burst(r.left + r.width / 2, r.top + r.height / 2, { color: '#ffb066', n: 22, speed: 190, grav: -150, size: 2.4, life: 0.85 });
        await sleep(260);
      }
      syncCombat();
      break;
    }
    case 'discardHand': {
      const els = $$('.card', ce.hand);
      if (els.length) {
        sfx.card();
        els.forEach((c, i) => {
          c.animate([{ opacity: 1 }, { transform: `${c.style.transform} translateX(340px) rotate(20deg)`, opacity: 0 }],
            { duration: 260, delay: i * 28, easing: 'ease-in' }).onfinish = () => c.remove();
        });
        await sleep(280 + els.length * 28);
      }
      syncCombat();
      break;
    }
    case 'enemyAct': {
      const x = ce.enemies[ev.idx];
      const { x: ex, y: ey } = enemyCenter(ev.idx);
      x.root.classList.add('acting');
      setTimeout(() => x.root.classList.remove('acting'), 420);
      V.floatText(ex, ey - 90, ev.name, 'notice');
      await sleep(430);
      break;
    }
    case 'intent': syncCombat(); break;
    case 'addCard': {
      V.floatText(innerWidth / 2, innerHeight * 0.62, `${CARDS[ev.id].name} added to ${ev.where === 'hand' ? 'hand' : 'discard'}`, 'notice');
      sfx.debuff();
      syncCombat(); syncHand();
      await sleep(240);
      break;
    }
    case 'relicProc': {
      const chip = $(`.relic-chip[data-relic="${ev.id}"]`);
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
    case 'powerConsumed': break;
    case 'victory': {
      await sleep(320);
      sfx.victory();
      V.flash('#ffe9ac', 0.16, 0.6);
      break;
    }
    case 'defeat': {
      await sleep(400);
      sfx.defeat();
      V.flash('#300', 0.5, 1.2);
      // the lantern snuffs out: the world collapses to a dying point of light
      const L = $('#lantern');
      L.classList.add('gutter');
      L.style.setProperty('--la', '1');
      L.style.setProperty('--lr', '160px');
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
  const run = S.run, kind = S.cb.kind;
  S.cb = null;
  run.pendingCombat = null;
  if (kind === 'boss' && run.act >= 2) {
    E.recordRunEnd(run, true);
    show('end', { won: true });
    return;
  }
  show('reward', { kind, rewards: E.genCombatRewards(run, kind) });
}
function defeatFlow() {
  E.recordRunEnd(S.run, false);
  show('end', { won: false });
}

// ------------------------------------------------------------ rewards
function renderReward({ kind, rewards }) {
  const run = S.run;
  const sc = screenEl();
  const title = kind === 'boss' ? 'BOSS VANQUISHED' : kind === 'elite' ? 'ELITE SLAIN' : 'VICTORY';
  sc.innerHTML = `<div class="center-panel screen-enter"><div class="panel">
    <div class="ov-title">${title}</div>
    <div class="ornament">✦ ✦ ✦</div>
    <div class="reward-list"></div>
    <div class="ov-actions"><button class="btn" data-a="continue">Continue</button></div>
  </div></div>`;
  const list = $('.reward-list', sc);
  const addRow = (icon, label, fn, tip = null) => {
    const row = el('button', 'reward-row', `<span class="ric">${icon}</span><span>${label}</span>`);
    if (tip) row._tip = tip;
    row.onclick = () => { if (fn() !== false) { row.classList.add('taken'); E.saveRun(run); renderHud(); } };
    list.appendChild(row);
    return row;
  };
  addRow('¤', `<b class="gold-num">${rewards.gold}</b> gold`, () => {
    run.player.gold += rewards.gold;
    run.stats.goldEarned += rewards.gold;
    sfx.coin();
    V.floatText(innerWidth / 2, innerHeight / 2 - 60, `+${rewards.gold} gold`, 'goldf');
  });
  if (rewards.potion) {
    const p = POTIONS[rewards.potion];
    addRow(potionSvg(p.tone), `${p.name}`, () => {
      if (!E.gainPotion(run, rewards.potion)) {
        V.floatText(innerWidth / 2, innerHeight / 2, 'Potion slots full!', 'notice');
        return false;
      }
      sfx.potion();
    }, { title: p.name, body: p.text });
  }
  if (rewards.relic) {
    const r = RELICS[rewards.relic];
    addRow(`<span style="color:${r.tone};text-shadow:0 0 8px ${r.tone}">${r.glyph}</span>`, `<b>${r.name}</b>`, () => {
      E.gainRelic(run, rewards.relic);
      sfx.relic();
    }, { title: r.name, body: r.text });
  }
  addRow(iconSvg('cards', 26), 'Add a card to your deck', () => {
    pickCardReward(rewards.cards, () => {});
    return false; // taken handled by picker
  });
  const cardRow = list.lastElementChild;
  cardRow.dataset.cardrow = '1';
  $('[data-a="continue"]', sc).onclick = () => { sfx.click(); E.saveRun(run); if (kind === 'boss') show('bossRelic'); else show('map'); };

  function pickCardReward(ids, done) {
    showCardGrid('Choose a Card', ids.map((id) => ({ id, up: false, uid: null })), {
      sub: 'Add one card to your deck — or skip to keep it lean.',
      pick: (inst) => {
        if (inst) {
          E.addCardToDeck(run, inst.id);
          sfx.upgrade();
          V.floatText(innerWidth / 2, innerHeight / 2, `${E.cardData(inst).name} added`, 'notice');
        }
        cardRow.classList.add('taken');
        E.saveRun(run);
        done();
      },
      canSkip: true,
    });
  }
}
function renderBossRelic() {
  const run = S.run;
  const picks = E.rollBossRelics(run);
  const sc = screenEl();
  sc.innerHTML = `<div class="center-panel screen-enter"><div class="panel" style="width:min(620px,94vw)">
    <div class="ov-title">A BOSS RELIC CALLS</div>
    <div class="ov-sub">Choose one — its power is permanent.</div>
    <div class="big-choices" style="flex-direction:column"></div>
  </div></div>`;
  const wrap = $('.big-choices', sc);
  for (const id of picks) {
    const r = RELICS[id];
    const b = el('button', 'relic-pick');
    b.innerHTML = `<span class="relic-chip" style="--tone:${r.tone}">${r.glyph}</span><span><b>${r.name}</b><span class="rd">${r.text}</span></span>`;
    b.onclick = () => { sfx.relic(); E.gainRelic(run, id); advanceAct(); };
    wrap.appendChild(b);
  }
  const skip = el('button', 'btn ghost', 'Take none');
  skip.style.marginTop = '10px';
  skip.onclick = () => { sfx.click(); advanceAct(); };
  wrap.appendChild(skip);
}
function advanceAct() {
  const run = S.run;
  run.act++;
  run.nodeId = null;
  run.map = E.genMap(run);
  E.healPlayer(run, Math.round(run.player.maxHp * 0.35));
  setTheme(run.act);
  setAltitude(run.act, 0);
  setAmbience(run.act);
  E.saveRun(run);
  show('map');
  banner(`ACT ${run.act + 1}`);
  sfx.victory();
}

// ------------------------------------------------------------ rest / shop / treasure / event
function renderRest() {
  const run = S.run;
  const canUp = run.player.deck.some((c) => !c.up && CARDS[c.id].up);
  screenEl().innerHTML = `<div class="center-panel screen-enter"><div class="panel">
    <div class="ov-title">REST SITE</div>
    <div class="art-lg">${campfireSvg()}</div>
    <div class="ov-sub">The fire crackles. For a moment, the Spire is quiet.</div>
    <div class="big-choices">
      <button class="btn" data-a="rest">${iconSvg('flame', 18)} Rest <span style="font-size:13px;opacity:.8">— heal ${Math.round(run.player.maxHp * 0.3)} HP</span></button>
      <button class="btn" data-a="smith" ${canUp ? '' : 'disabled'}>${iconSvg('hammer', 18)} Smith <span style="font-size:13px;opacity:.8">— upgrade a card</span></button>
    </div>
  </div></div>`;
  $('[data-a="rest"]').onclick = (e) => {
    e.currentTarget.disabled = true;
    $('[data-a="smith"]').disabled = true;
    sfx.heal();
    const healed = E.healPlayer(run, Math.round(run.player.maxHp * 0.3));
    V.floatText(innerWidth / 2, innerHeight / 2 - 40, `+${healed} HP`, 'healf');
    V.motes(innerWidth / 2, innerHeight / 2, '#8fe8a0', 22);
    E.saveRun(run);
    setTimeout(() => { if (S.screen === 'rest') show('map'); }, 700);
  };
  $('[data-a="smith"]').onclick = () => {
    sfx.click();
    const ups = run.player.deck.filter((c) => !c.up && CARDS[c.id].up);
    showCardGrid('Upgrade a Card', ups, {
      sub: 'Forge one card into its + form.',
      pick: (inst) => {
        if (!inst) return;
        E.upgradeCardInDeck(run, inst.uid);
        sfx.upgrade();
        V.flash('#ffe9ac', 0.12, 0.4);
        showCardGrid('Upgraded!', [run.player.deck.find((c) => c.uid === inst.uid)], { sub: 'It gleams with new power.' });
        E.saveRun(run);
        setTimeout(() => { if (S.screen === 'rest') { closeOverlay(); show('map'); } }, 1300);
      },
    });
  };
}
function renderTreasure() {
  const run = S.run;
  screenEl().innerHTML = `<div class="center-panel screen-enter"><div class="panel">
    <div class="ov-title">TREASURE</div>
    <div class="art-lg" style="cursor:pointer" data-a="open">${chestSvg(false)}</div>
    <div class="ov-sub">A heavy chest, banded in gold. Open it?</div>
    <div class="big-choices"><button class="btn" data-a="open">Open the Chest</button></div>
  </div></div>`;
  const open = () => {
    const relicId = E.randomRelic(run, { common: 0.55, uncommon: 0.35, rare: 0.1 });
    $('.art-lg').innerHTML = chestSvg(true);
    sfx.relic();
    V.flash('#ffe9ac', 0.2, 0.5);
    V.burst(innerWidth / 2, innerHeight / 2, { color: '#ffd97a', n: 36, speed: 380, grav: 160 });
    const bc = $('.big-choices');
    if (relicId) {
      E.gainRelic(run, relicId);
      const r = RELICS[relicId];
      $('.ov-sub').innerHTML = `You claim <b style="color:${r.tone}">${r.name}</b> — <i>${r.text}</i>`;
    } else {
      run.player.gold += 60;
      $('.ov-sub').innerHTML = 'Only coins remain — <b class="gold-num">+60 gold</b>.';
      sfx.coin();
    }
    renderHud();
    E.saveRun(run);
    bc.innerHTML = '';
    const btn = el('button', 'btn', 'Continue');
    btn.onclick = () => { sfx.click(); show('map'); };
    bc.appendChild(btn);
  };
  $$('[data-a="open"]').forEach((b) => (b.onclick = open));
}
function renderShop() {
  const run = S.run;
  const shop = (S.shopData ||= {});
  if (S.screen !== 'shop' || !shop.stock || shop.forNode !== run.nodeId) {
    shop.stock = E.genShop(run);
    shop.forNode = run.nodeId;
  }
  const st = shop.stock;
  const sc = screenEl();
  sc.innerHTML = `<div class="center-panel screen-enter"><div class="panel ov-panel" style="width:min(980px,96vw)">
    <div style="display:flex;align-items:center;justify-content:center;gap:18px">
      <div style="width:130px">${merchantSvg()}</div>
      <div><div class="ov-title" style="text-align:left">THE MERCHANT</div>
      <div class="ov-sub" style="text-align:left;margin:0">"Gold for glory, stranger. Everything's fair-priced — for the doomed."</div></div>
    </div>
    <div class="shop-grid">
      <div class="shop-row cards-row"></div>
      <div class="shop-row misc-row"></div>
      <div class="ov-actions"><button class="btn ghost" data-a="leave">Leave the Shop</button></div>
    </div>
  </div></div>`;
  const cardsRow = $('.cards-row', sc), miscRow = $('.misc-row', sc);
  const gold = () => run.player.gold;
  const buy = (price) => { run.player.gold -= price; sfx.coin(); E.saveRun(run); renderHud(); refresh(); };
  function refresh() {
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
      wrap.appendChild(el('div', 'price', `¤ ${it.price}`));
      cardsRow.appendChild(wrap);
    }
    for (const it of st.relics) {
      const r = RELICS[it.id];
      const wrap = el('div', `shop-item ${it.sold ? 'sold' : ''} ${gold() < it.price ? 'cant' : ''}`);
      const b = el('button', 'shop-relic', `<span class="relic-chip" style="--tone:${r.tone}">${r.glyph}</span><b>${r.name}</b>${r.text}`);
      b.onclick = () => {
        if (it.sold || gold() < it.price) return sfx.debuff();
        it.sold = true;
        E.gainRelic(run, it.id);
        sfx.relic();
        buy(it.price);
      };
      wrap.appendChild(b);
      wrap.appendChild(el('div', 'price', `¤ ${it.price}`));
      miscRow.appendChild(wrap);
    }
    for (const it of st.potions) {
      const p = POTIONS[it.id];
      const wrap = el('div', `shop-item ${it.sold ? 'sold' : ''} ${gold() < it.price ? 'cant' : ''}`);
      const b = el('button', 'shop-relic', `<span style="width:34px;height:44px">${potionSvg(p.tone)}</span><b>${p.name}</b>${p.text}`);
      b.onclick = () => {
        if (it.sold || gold() < it.price) return sfx.debuff();
        if (!E.gainPotion(run, it.id)) { V.floatText(innerWidth / 2, innerHeight / 2, 'Potion slots full!', 'notice'); return; }
        it.sold = true;
        sfx.potion();
        buy(it.price);
      };
      wrap.appendChild(b);
      wrap.appendChild(el('div', 'price', `¤ ${it.price}`));
      miscRow.appendChild(wrap);
    }
    // card removal service
    const wrap = el('div', `shop-item ${st.removed ? 'sold' : ''} ${gold() < st.removeCost ? 'cant' : ''}`);
    const b = el('button', 'shop-relic', `<span style="width:34px;display:inline-flex;justify-content:center">${iconSvg('scissors', 26)}</span><b>Card Removal</b>Remove a card from your deck forever.`);
    b.onclick = () => {
      if (st.removed || gold() < st.removeCost) return sfx.debuff();
      showCardGrid('Remove a Card', run.player.deck, {
        sub: 'Cut the dead weight.',
        pick: (inst) => {
          if (!inst) return;
          E.removeCardFromDeck(run, inst.uid);
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
    wrap.appendChild(el('div', 'price', `¤ ${st.removeCost}`));
    miscRow.appendChild(wrap);
  }
  refresh();
  $('[data-a="leave"]', sc).onclick = () => { sfx.click(); show('map'); };
}
function rollEventCards(run, n) {
  const rng = E.runRng(run);
  const out = [];
  const all = [...CARD_POOLS.common, ...CARD_POOLS.common, ...CARD_POOLS.uncommon, ...CARD_POOLS.uncommon, ...CARD_POOLS.rare];
  let guard = 0;
  while (out.length < n && guard++ < 60) {
    const id = all[Math.floor(rng() * all.length)];
    if (!out.includes(id)) out.push(id);
  }
  return out;
}
function renderEvent(eventId) {
  const run = S.run;
  const ev = EVENTS[eventId];
  const sc = screenEl();
  sc.innerHTML = `<div class="center-panel screen-enter"><div class="panel event-panel">
    <div class="ov-title">${ev.name.toUpperCase()}</div>
    <div class="event-art">${eventArtSvg(ev.glyph, ev.hue)}</div>
    <div class="event-text">${ev.text}</div>
    <div class="event-log"></div>
    <div class="event-choices"></div>
  </div></div>`;
  const choices = $('.event-choices', sc);
  for (const ch of ev.choices) {
    const b = el('button', 'event-choice', `<b>${ch.label}</b>${ch.sub ? `<div class="sub">${ch.sub}</div>` : ''}`);
    if (ch.needGold && run.player.gold < ch.needGold) b.disabled = true;
    b.onclick = () => resolveChoice(ch);
    choices.appendChild(b);
  }
  async function resolveChoice(ch) {
    sfx.click();
    const { pending, log } = E.applyEventOps(run, ch.ops);
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
    E.saveRun(run);
    renderHud();
    const done = el('button', 'btn', 'Continue');
    done.onclick = () => { sfx.click(); show('map'); };
    choices.appendChild(done);
    if (!bits.length && !pending.length && !ch.ops.length) show('map');
  }
  function handlePending(p) {
    return new Promise((resolve) => {
      if (p === 'remove') {
        showCardGrid('Remove a Card', run.player.deck, { sub: 'Let it go.', pick: (inst) => { if (inst) { E.removeCardFromDeck(run, inst.uid); sfx.card(); } resolve(); }, canSkip: false });
      } else if (p === 'upgrade') {
        const ups = run.player.deck.filter((c) => !c.up && CARDS[c.id].up);
        if (!ups.length) return resolve();
        showCardGrid('Upgrade a Card', ups, { sub: 'The forge hungers.', pick: (inst) => { if (inst) { E.upgradeCardInDeck(run, inst.uid); sfx.upgrade(); } resolve(); } });
      } else if (p === 'duplicate') {
        showCardGrid('Duplicate a Card', run.player.deck, { sub: 'The mirror remembers.', pick: (inst) => { if (inst) { E.duplicateCardInDeck(run, inst.uid); sfx.upgrade(); } resolve(); } });
      } else if (p.pickCard) {
        showCardGrid('Choose a Card', rollEventCards(run, p.pickCard).map((id) => ({ id, up: false, uid: null })), {
          sub: 'One page still glows.',
          pick: (inst) => { if (inst) { E.addCardToDeck(run, inst.id); sfx.upgrade(); } resolve(); }, canSkip: true,
        });
      } else resolve();
    });
  }
}

// ------------------------------------------------------------ end screens
function renderEnd({ won }) {
  const run = S.run;
  stopAmbience();
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
  const btns = `<div style="display:flex;gap:14px">
      <button class="btn" data-a="deck">View Final Deck</button>
      <button class="btn" data-a="new">New Run</button>
      <button class="btn ghost" data-a="title">Title</button>
    </div>`;
  if (won) {
    screenEl().innerHTML = `<div class="end-screen screen-enter">
      <div class="end-title win">ASCENDED</div>
      <div class="ov-sub" style="font-size:17px">The Eternal Sovereign is dust. Dawn breaks over the Spire — the first in an age.</div>
      ${stats}${btns}
    </div>`;
    sunrise(); // the only warm daylight in the game
    sfx.victory();
    V.flash('#ffe9ac', 0.25, 1);
    const conf = setInterval(() => V.burst(Math.random() * innerWidth, innerHeight * 0.2, { color: ['#ffd97a', '#c9b0ff', '#8fe8a0'][(Math.random() * 3) | 0], n: 16, speed: 300, grav: 260, life: 1.2 }), 400);
    setTimeout(() => clearInterval(conf), 4200);
  } else {
    // no game-over panel: a monument in the dark, embers drifting off it
    const embers = Array.from({ length: 14 }, () =>
      `<span class="ember" style="left:${(8 + Math.random() * 84).toFixed(1)}%;--ex:${((Math.random() - 0.5) * 90).toFixed(0)}px;animation-delay:${(Math.random() * 4).toFixed(2)}s;animation-duration:${(3 + Math.random() * 3).toFixed(2)}s"></span>`).join('');
    screenEl().innerHTML = `<div class="end-screen grave">
      <div class="monument">
        <div class="mon-flame"></div>
        <div class="end-title lose">FALLEN</div>
        <div class="ov-sub" style="font-size:16px">Here ended a climb, on floor ${totalFloor}.<br>The Spire keeps what it takes.</div>
        ${stats}${btns}
      </div>
      <div class="embers">${embers}</div>
    </div>`;
  }
  screenEl().onclick = (e) => {
    const a = e.target.dataset?.a;
    if (!a) return;
    sfx.click();
    if (a === 'deck') showCardGrid('Final Deck', run.player.deck, {});
    if (a === 'new') { S.run = null; startRun(E.newRun()); }
    if (a === 'title') { S.run = null; show('title'); }
  };
}

// ------------------------------------------------------------ boot
export function initUI() {
  initTooltip();
  document.addEventListener('pointerdown', () => unlock(), { once: true });
  document.addEventListener('contextmenu', (e) => { if (S.targeting) { e.preventDefault(); clearTargeting(); } });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (S.targeting) clearTargeting();
      else if ($('#overlay').classList.contains('open') && $('#overlay')._closable) closeOverlay();
    }
    if ((e.key === 'e' || e.key === 'E') && S.screen === 'combat' && !S.busy) onEndTurn();
  });
  $('#overlay').addEventListener('pointerdown', (e) => {
    if (e.target === $('#overlay') && $('#overlay')._closable) closeOverlay();
  });
  window.spirebound = { S, E, startCombatUI, show }; // ponytail: console debug hook, harmless in prod
  show('title');
}
