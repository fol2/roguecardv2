// SPIREBOUND engine — pure game logic, no DOM. UI consumes cb.queue for animation.
import { PLAYER, CARDS, CARD_POOLS, RELICS, RELIC_POOLS, POTIONS, ENEMIES, ENCOUNTERS, EVENTS, REWARD_GOLD, SHOP } from './data.js';

// ---------------------------------------------------------------- RNG (mulberry32)
export function makeRng(state) {
  const rng = () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  rng.getState = () => state;
  return rng;
}
const pick = (rng, arr) => arr[Math.floor(rng() * arr.length)];
const irange = (rng, [a, b]) => a + Math.floor(rng() * (b - a + 1));
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// ---------------------------------------------------------------- run lifecycle
export function newRun(seed = (Math.random() * 2 ** 31) | 0) {
  const run = {
    seed, rngState: seed, uid: 1, act: 0, nodeId: null, floorsClimbed: 0,
    player: {
      hp: PLAYER.maxHp, maxHp: PLAYER.maxHp, gold: PLAYER.startGold, energyMax: PLAYER.energy,
      relics: [PLAYER.startRelic], potions: [null, null, null], deck: [],
    },
    stats: { slain: 0, elites: 0, bosses: 0, dmgDealt: 0, dmgTaken: 0, cardsPlayed: 0, goldEarned: 0, start: Date.now() },
    map: null,
  };
  for (const id of PLAYER.startDeck) run.player.deck.push(makeCard(run, id));
  run.map = genMap(run);
  return run;
}
export function makeCard(run, id, up = false) {
  return { uid: run.uid++, id, up, bonus: 0 };
}
export function cardData(inst) {
  const base = CARDS[inst.id];
  return inst.up && base.up ? { ...base, ...base.up, name: base.name + '+' } : base;
}
export function runRng(run) {
  const rng = makeRng(run.rngState);
  return () => { const v = rng(); run.rngState = rng.getState(); return v; };
}

// ---------------------------------------------------------------- map generation
export const MAP_ROWS = 15, MAP_COLS = 7;
export function genMap(run) {
  const rng = runRng(run);
  const grid = {}; // 'r,c' -> node
  const key = (r, c) => `${r},${c}`;
  const nodeAt = (r, c) => {
    if (!grid[key(r, c)]) grid[key(r, c)] = { id: key(r, c), row: r, col: c, type: 'monster', next: [], jx: (rng() - 0.5) * 0.5, jy: (rng() - 0.5) * 0.4 };
    return grid[key(r, c)];
  };
  const paths = 6;
  const usedStart = new Set();
  for (let p = 0; p < paths; p++) {
    let c;
    do { c = Math.floor(rng() * MAP_COLS); } while (p < 2 && usedStart.has(c));
    usedStart.add(c);
    let cur = nodeAt(0, c);
    for (let r = 1; r < MAP_ROWS - 1; r++) {
      const dc = clamp(cur.col + (Math.floor(rng() * 3) - 1), 0, MAP_COLS - 1);
      const nxt = nodeAt(r, dc);
      if (!cur.next.includes(nxt.id)) cur.next.push(nxt.id);
      cur = nxt;
    }
    const boss = nodeAt(MAP_ROWS - 1, 3);
    if (!cur.next.includes(boss.id)) cur.next.push(boss.id);
  }
  const nodes = Object.values(grid);
  let hasShop = false;
  for (const n of nodes) {
    if (n.row === 0) n.type = 'monster';
    else if (n.row === MAP_ROWS - 1) n.type = 'boss';
    else if (n.row === MAP_ROWS - 2) n.type = 'rest';
    else if (n.row === 8) n.type = 'treasure';
    else {
      const r = rng();
      if (r < 0.46) n.type = 'monster';
      else if (r < 0.68) n.type = 'event';
      else if (r < 0.81 && n.row >= 5) n.type = 'elite';
      else if (r < 0.91 && n.row >= 4 && n.row < MAP_ROWS - 3) n.type = 'rest';
      else if (n.row >= 4) n.type = 'shop';
      else n.type = 'monster';
    }
    if (n.type === 'shop') hasShop = true;
  }
  if (!hasShop) {
    const cand = nodes.filter((n) => n.type === 'monster' && n.row >= 5 && n.row <= 11);
    if (cand.length) pick(rng, cand).type = 'shop';
  }
  return { nodes, visited: [] };
}
export function availableNodes(run) {
  const { nodes, visited } = run.map;
  if (!run.nodeId) return nodes.filter((n) => n.row === 0);
  const cur = nodes.find((n) => n.id === run.nodeId);
  return nodes.filter((n) => cur.next.includes(n.id));
}

// ---------------------------------------------------------------- helpers
export const hasRelic = (run, id) => run.player.relics.includes(id);
export function healPlayer(run, n, cb = null) {
  if (hasRelic(run, 'sunBlossom')) n = Math.round(n * 1.5);
  const p = cb ? cb.player : run.player;
  const before = p.hp;
  p.hp = clamp(p.hp + n, 0, p.maxHp);
  const healed = p.hp - before;
  if (cb && healed > 0) cb.queue.push({ t: 'heal', who: 'player', n: healed });
  return healed;
}
export function gainRelic(run, id, cb = null) {
  const r = RELICS[id];
  if (!r) return;
  if (r.replaces) {
    const i = run.player.relics.indexOf(r.replaces);
    if (i >= 0) run.player.relics.splice(i, 1);
  }
  run.player.relics.push(id);
  // instant / permanent pickup effects
  if (id === 'sweetRoot') { run.player.maxHp += 8; run.player.hp += 8; }
  if (id === 'obsidianHeart') { run.player.energyMax += 1; run.player.maxHp = Math.max(1, run.player.maxHp - 8); run.player.hp = Math.min(run.player.hp, run.player.maxHp); }
  if (id === 'philosophersStone' || id === 'voidCrown') run.player.energyMax += 1;
  if (id === 'pandorasBox') {
    const rng = runRng(run);
    const all = [...CARD_POOLS.common, ...CARD_POOLS.uncommon, ...CARD_POOLS.rare];
    for (const c of run.player.deck) {
      if (c.id === 'strike' || c.id === 'defend') { c.id = pick(rng, all); c.up = false; }
    }
  }
}
export function randomRelic(run, weights = { common: 0.5, uncommon: 0.35, rare: 0.15 }) {
  const rng = runRng(run);
  const owned = new Set(run.player.relics);
  const order = ['common', 'uncommon', 'rare'];
  let r = rng(), tier = 'common', acc = 0;
  for (const t of order) { acc += weights[t] || 0; if (r < acc) { tier = t; break; } }
  const idx = order.indexOf(tier);
  for (let i = 0; i < order.length; i++) {
    const t = order[(idx + i) % order.length];
    const avail = RELIC_POOLS[t].filter((id) => !owned.has(id));
    if (avail.length) return pick(rng, avail);
  }
  return null;
}
export function gainPotion(run, id) {
  if (id === 'random') id = pick(runRng(run), Object.keys(POTIONS));
  const i = run.player.potions.indexOf(null);
  if (i < 0) return false;
  run.player.potions[i] = id;
  return true;
}
export function rollCardReward(run, kind = 'normal') {
  const rng = runRng(run);
  const n = 3 + (hasRelic(run, 'seersOrb') ? 1 : 0);
  const out = [];
  const guard = new Set();
  while (out.length < n && guard.size < 40) {
    let pool;
    if (kind === 'boss') pool = 'rare';
    else {
      const r = rng();
      pool = kind === 'elite'
        ? (r < 0.45 ? 'common' : r < 0.85 ? 'uncommon' : 'rare')
        : (r < 0.6 ? 'common' : r < 0.92 ? 'uncommon' : 'rare');
    }
    const id = pick(rng, CARD_POOLS[pool]);
    guard.add(id + Math.floor(rng() * 4));
    if (!out.includes(id)) out.push(id);
  }
  return out;
}
export function genCombatRewards(run, kind) {
  const rng = runRng(run);
  const gold = irange(rng, REWARD_GOLD[run.act][kind === 'boss' ? 'boss' : kind === 'elite' ? 'elite' : 'normal']);
  const rw = { gold, cards: rollCardReward(run, kind), potion: null, relic: null };
  if (kind !== 'boss' && rng() < 0.4) rw.potion = pick(rng, Object.keys(POTIONS));
  if (kind === 'elite') rw.relic = randomRelic(run);
  return rw;
}
export function rollBossRelics(run) {
  const rng = runRng(run);
  const owned = new Set(run.player.relics);
  const avail = RELIC_POOLS.boss.filter((id) => !owned.has(id));
  const out = [];
  while (out.length < Math.min(3, avail.length)) {
    const id = pick(rng, avail);
    if (!out.includes(id)) out.push(id);
  }
  return out;
}
export function genShop(run) {
  const rng = runRng(run);
  const price = ([a, b], disc) => Math.round(irange(rng, [a, b]) * disc);
  const disc = hasRelic(run, 'merchantsMark') ? 0.75 : 1;
  const cardIds = [];
  const wants = ['common', 'common', 'uncommon', 'uncommon', 'rare'];
  for (const t of wants) {
    let id, tries = 0;
    do { id = pick(rng, CARD_POOLS[t]); } while (cardIds.some((c) => c.id === id) && ++tries < 20);
    cardIds.push({ id, price: price(SHOP.cardPrice[t], disc), sold: false });
  }
  const owned = new Set(run.player.relics);
  const relics = [];
  for (const t of ['common', 'uncommon']) {
    const avail = RELIC_POOLS[t].filter((id) => !owned.has(id) && !relics.some((r) => r.id === id));
    if (avail.length) relics.push({ id: pick(rng, avail), price: price(SHOP.relicPrice[t], disc), sold: false });
  }
  const potions = [];
  for (let i = 0; i < 2; i++) potions.push({ id: pick(rng, Object.keys(POTIONS)), price: price(SHOP.potionPrice, disc), sold: false });
  return { cards: cardIds, relics, potions, removeCost: Math.round(SHOP.removeCost * disc), removed: false };
}
export function rollEvent(run) {
  const rng = runRng(run);
  const seen = (run.seenEvents ||= []);
  let ids = Object.keys(EVENTS).filter((id) => !seen.includes(id));
  if (!ids.length) { run.seenEvents = []; ids = Object.keys(EVENTS); }
  const id = pick(rng, ids);
  seen.push(id);
  return id;
}
export function rollEncounter(run, type, row) {
  const rng = runRng(run);
  const pools = ENCOUNTERS[run.act];
  const pool = type === 'boss' ? pools.boss : type === 'elite' ? pools.elite : row < 3 ? pools.weak : pools.normal;
  const last = run.lastEnc;
  let enc, tries = 0;
  do { enc = pick(rng, pool); } while (pool.length > 1 && enc.join() === last && ++tries < 8);
  run.lastEnc = enc.join();
  return enc;
}

// ---------------------------------------------------------------- combat
export function startCombat(run, enemyIds, kind = 'normal') {
  const rng = runRng(run);
  const cb = {
    kind, turn: 0, over: false, result: null, queue: [],
    player: {
      hp: run.player.hp, maxHp: run.player.maxHp, block: 0, energy: 0, energyMax: run.player.energyMax,
      statuses: {},
    },
    enemies: enemyIds.map((id, i) => {
      const d = ENEMIES[id];
      return {
        key: id, idx: i, name: d.name, maxHp: irange(rng, d.hp), block: 0,
        statuses: { ...(d.startStatus || {}) }, flags: {}, lastMoves: [], moveKey: null,
        elite: !!d.elite, boss: !!d.boss,
      };
    }),
    draw: [], hand: [], discard: [], exhaust: [],
    counters: { played: 0, attacks: 0, firstCardPlayed: false, hpLost: 0 },
  };
  cb.enemies.forEach((e) => (e.hp = e.maxHp));
  // deck
  cb.draw = run.player.deck.map((c) => ({ ...c, bonus: 0 }));
  shuffle(rng, cb.draw);
  // relic combat-start hooks
  const P = cb.player;
  if (hasRelic(run, 'basaltIdol')) { P.block += 10; proc(cb, 'basaltIdol'); }
  if (hasRelic(run, 'warFetish')) { addStatus(cb, P, 'str', 1); proc(cb, 'warFetish'); }
  if (hasRelic(run, 'riverPearl')) { addStatus(cb, P, 'dex', 1); proc(cb, 'riverPearl'); }
  if (hasRelic(run, 'thornBand')) { addStatus(cb, P, 'thorns', 2); proc(cb, 'thornBand'); }
  if (hasRelic(run, 'vialOfLife')) { healPlayer(run, 2, cb); proc(cb, 'vialOfLife'); }
  if (hasRelic(run, 'philosophersStone')) cb.enemies.forEach((e) => (e.statuses.str = (e.statuses.str || 0) + 1));
  if (hasRelic(run, 'voidCrown')) {
    const w = { uid: run.uid++, id: 'wound', up: false, bonus: 0 };
    cb.draw.splice(Math.floor(rng() * (cb.draw.length + 1)), 0, w);
  }
  computeIntents(run, cb);
  startPlayerTurn(run, cb);
  return cb;
}
function shuffle(rng, arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
function proc(cb, relicId) { cb.queue.push({ t: 'relicProc', id: relicId }); }
export function addStatus(cb, who, id, n) {
  who.statuses[id] = (who.statuses[id] || 0) + n;
  if (who.statuses[id] === 0) delete who.statuses[id];
  cb.queue.push({ t: 'status', who: who === cb.player ? 'player' : who.idx, id, n });
}
function computeIntents(run, cb) {
  const rng = runRng(run);
  for (const e of cb.enemies) {
    if (e.hp <= 0) continue;
    const d = ENEMIES[e.key];
    e.moveKey = d.ai({
      turn: cb.turn + 1, last: e.lastMoves[e.lastMoves.length - 1], prev: e.lastMoves[e.lastMoves.length - 2],
      rng, hpFrac: e.hp / e.maxHp, self: e,
    });
    cb.queue.push({ t: 'intent', idx: e.idx, move: e.moveKey });
  }
}
export function enemyMove(e) { return ENEMIES[e.key].moves[e.moveKey]; }

// damage an enemy from the player. returns actual hp loss
function hitEnemy(run, cb, e, base, { isAttack = true, mult = 1 } = {}) {
  if (e.hp <= 0 || cb.over) return 0;
  const P = cb.player;
  let dmg = base;
  if (isAttack) {
    dmg += P.statuses.str || 0;
    if (P.statuses.weak) dmg = Math.floor(dmg * 0.75);
    if (e.statuses.vulnerable) dmg = Math.floor(dmg * 1.5);
  }
  dmg = Math.max(0, Math.floor(dmg * mult));
  const blocked = Math.min(e.block, dmg);
  e.block -= blocked;
  const loss = dmg - blocked;
  e.hp -= loss;
  run.stats.dmgDealt += loss;
  cb.queue.push({
    t: 'hitEnemy', idx: e.idx, amount: loss, blocked, hpAfter: Math.max(0, e.hp), dead: e.hp <= 0,
    killingBlow: e.hp <= 0 && loss > 0, overkill: Math.max(0, -e.hp),
  });
  if (isAttack && e.statuses.thorns && e.hp > 0) damagePlayer(run, cb, e.statuses.thorns, { source: 'thorns', isAttack: false });
  if (e.hp <= 0) onEnemyDeath(run, cb, e);
  return loss;
}
function onEnemyDeath(run, cb, e) {
  e.hp = 0;
  e.statuses = {};
  cb.queue.push({ t: 'die', idx: e.idx });
  run.stats.slain++;
  if (e.elite) run.stats.elites++;
  if (e.boss) run.stats.bosses++;
  if (cb.enemies.every((x) => x.hp <= 0)) { winCombat(run, cb); return; }
  if (hasRelic(run, 'reapersBell')) {
    cb.player.energy += 1;
    drawCards(run, cb, 1);
    proc(cb, 'reapersBell');
    cb.queue.push({ t: 'energy', n: cb.player.energy });
  }
}
// damage the player. source: enemy idx | 'thorns' | 'poison' | 'burn' | 'self'
function damagePlayer(run, cb, base, { source = 'self', isAttack = false, attacker = null } = {}) {
  if (cb.over) return 0;
  const P = cb.player;
  let dmg = base;
  if (isAttack && attacker) {
    dmg += (attacker.statuses.str || 0) + (attacker.flags.rampBonus || 0);
    if (attacker.statuses.weak) dmg = Math.floor(dmg * 0.75);
    if (P.statuses.vulnerable) dmg = Math.floor(dmg * 1.5);
    if (hasRelic(run, 'wardingCharm') && dmg <= 5 && dmg > 0) { dmg = 1; proc(cb, 'wardingCharm'); }
  }
  dmg = Math.max(0, dmg);
  let blocked = 0;
  if (isAttack || source === 'thorns') { // poison/burn/self ignore block
    blocked = Math.min(P.block, dmg);
    P.block -= blocked;
  }
  const loss = dmg - blocked;
  P.hp -= loss;
  run.stats.dmgTaken += Math.max(0, loss);
  cb.counters.hpLost += Math.max(0, loss);
  cb.queue.push({ t: 'hitPlayer', amount: loss, blocked, hpAfter: Math.max(0, P.hp), source });
  if (isAttack && P.statuses.thorns && attacker && attacker.hp > 0) hitEnemy(run, cb, attacker, P.statuses.thorns, { isAttack: false });
  if (P.hp <= 0) loseCombat(run, cb);
  return loss;
}
function gainBlock(cb, who, base, withDex = true) {
  let b = base;
  if (who === cb.player && withDex) {
    b += who.statuses.dex || 0;
    if (who.statuses.frail) b = Math.floor(b * 0.75);
  }
  b = Math.max(0, b);
  who.block += b;
  cb.queue.push({ t: 'blockGain', who: who === cb.player ? 'player' : who.idx, n: b, total: who.block });
  return b;
}
export function drawCards(run, cb, n) {
  const rng = runRng(run);
  for (let i = 0; i < n; i++) {
    if (cb.hand.length >= 10) break;
    if (!cb.draw.length) {
      if (!cb.discard.length) break;
      cb.draw = cb.discard;
      cb.discard = [];
      shuffle(rng, cb.draw);
      cb.queue.push({ t: 'reshuffle' });
    }
    const c = cb.draw.pop();
    cb.hand.push(c);
    cb.queue.push({ t: 'draw', uid: c.uid, id: c.id });
  }
}
function exhaustCard(run, cb, inst) {
  cb.exhaust.push(inst);
  cb.queue.push({ t: 'exhaust', uid: inst.uid });
  if (hasRelic(run, 'verdantBranch')) { drawCards(run, cb, 1); proc(cb, 'verdantBranch'); }
}

function startPlayerTurn(run, cb) {
  if (cb.over) return;
  cb.turn++;
  const P = cb.player;
  cb.queue.push({ t: 'turn', n: cb.turn });
  // poison ticks at the start of your turn
  if (P.statuses.poison) {
    damagePlayer(run, cb, P.statuses.poison, { source: 'poison' });
    P.statuses.poison--;
    if (!P.statuses.poison) delete P.statuses.poison;
    if (cb.over) return;
  }
  if (!P.statuses.barricade) P.block = 0;
  if (P.statuses.ritual) addStatus(cb, P, 'str', P.statuses.ritual);
  let energy = P.energyMax + (P.statuses.energized || 0);
  if (cb.turn === 1 && hasRelic(run, 'emberLantern')) { energy += 1; proc(cb, 'emberLantern'); }
  P.energy = (hasRelic(run, 'frozenCore') ? P.energy : 0) + energy;
  cb.counters.firstCardPlayed = false;
  cb.queue.push({ t: 'energy', n: P.energy });
  let draws = 5;
  if (cb.turn === 1 && hasRelic(run, 'travelersPack')) { draws += 2; proc(cb, 'travelersPack'); }
  drawCards(run, cb, draws);
}

export function effCost(run, cb, inst) {
  const d = cardData(inst);
  if (d.cost == null) return null;
  if (hasRelic(run, 'duskmirror') && !cb.counters.firstCardPlayed) return 0;
  return d.cost;
}
export function canPlay(run, cb, inst, targetIdx) {
  if (cb.over) return false;
  const d = cardData(inst);
  if (d.unplayable) return false;
  const cost = effCost(run, cb, inst);
  if (cost > cb.player.energy) return false;
  if (d.target === 'enemy' && (targetIdx == null || !cb.enemies[targetIdx] || cb.enemies[targetIdx].hp <= 0)) return false;
  return true;
}

export function playCard(run, cb, uid, targetIdx = null) {
  const i = cb.hand.findIndex((c) => c.uid === uid);
  if (i < 0) return false;
  const inst = cb.hand[i];
  const d = cardData(inst);
  if (!canPlay(run, cb, inst, targetIdx)) return false;
  const P = cb.player;
  const cost = effCost(run, cb, inst);
  P.energy -= cost;
  if (hasRelic(run, 'duskmirror') && !cb.counters.firstCardPlayed && d.cost > 0) proc(cb, 'duskmirror');
  cb.counters.firstCardPlayed = true;
  cb.hand.splice(i, 1);
  cb.counters.played++;
  run.stats.cardsPlayed++;
  cb.queue.push({ t: 'play', uid: inst.uid, id: inst.id, targetIdx });
  cb.queue.push({ t: 'energy', n: P.energy });

  let sealMult = 1;
  if (d.type === 'attack') {
    cb.counters.attacks++;
    if (hasRelic(run, 'ironTalisman') && cb.counters.attacks % 3 === 0) { addStatus(cb, P, 'str', 1); proc(cb, 'ironTalisman'); }
    if (hasRelic(run, 'executionersSeal') && cb.counters.attacks % 10 === 0) { sealMult = 2; proc(cb, 'executionersSeal'); }
  }
  const target = targetIdx != null ? cb.enemies[targetIdx] : null;
  const livingTargets = () => cb.enemies.filter((e) => e.hp > 0);

  for (const fx of d.effects) {
    if (cb.over) break;
    applyEffect(run, cb, inst, d, fx, target, sealMult);
  }
  // venomous power: attacks apply poison
  if (!cb.over && d.type === 'attack' && P.statuses.venomous) {
    const vs = d.target === 'allEnemies' ? livingTargets() : target && target.hp > 0 ? [target] : [];
    for (const e of vs) addStatus(cb, e, 'poison', P.statuses.venomous);
  }
  // silk fan
  if (!cb.over && hasRelic(run, 'silkFan') && cb.counters.played % 3 === 0) { gainBlock(cb, P, 3, false); proc(cb, 'silkFan'); }

  if (d.type === 'power') cb.queue.push({ t: 'powerConsumed', uid: inst.uid });
  else if (d.exhaust) exhaustCard(run, cb, inst);
  else cb.discard.push(inst);
  return true;
}

function applyEffect(run, cb, inst, d, fx, target, sealMult) {
  const P = cb.player;
  const each = d.target === 'allEnemies' ? cb.enemies.filter((e) => e.hp > 0) : target ? [target] : [];
  switch (fx.kind) {
    case 'dmg': {
      const times = fx.times || 1;
      for (let t = 0; t < times; t++) {
        for (const e of d.target === 'allEnemies' ? cb.enemies.filter((x) => x.hp > 0) : each) {
          if (cb.over) return;
          hitEnemy(run, cb, e, fx.n, { mult: sealMult });
        }
      }
      break;
    }
    case 'block': gainBlock(cb, P, fx.n); break;
    case 'draw': drawCards(run, cb, fx.n); break;
    case 'energy': P.energy += fx.n; cb.queue.push({ t: 'energy', n: P.energy }); break;
    case 'heal': healPlayer(run, fx.n, cb); break;
    case 'loseHp': damagePlayer(run, cb, fx.n, { source: 'self' }); break;
    case 'status': {
      if (fx.who === 'self') addStatus(cb, P, fx.id, fx.n);
      else if (fx.who === 'allEnemies') for (const e of cb.enemies.filter((x) => x.hp > 0)) addStatus(cb, e, fx.id, fx.n);
      else if (target && target.hp > 0) addStatus(cb, target, fx.id, fx.n);
      break;
    }
    case 'addCard': {
      for (let i = 0; i < (fx.n || 1); i++) {
        const c = { uid: run.uid++, id: fx.id, up: false, bonus: 0 };
        (fx.where === 'hand' && cb.hand.length < 10 ? cb.hand : cb.discard).push(c);
        cb.queue.push({ t: 'addCard', id: fx.id, where: fx.where || 'discard' });
      }
      break;
    }
    case 'special': applySpecial(run, cb, inst, d, fx, target, sealMult);
  }
}

function applySpecial(run, cb, inst, d, fx, target, sealMult) {
  const P = cb.player;
  switch (fx.id) {
    case 'leech': {
      const loss = hitEnemy(run, cb, target, fx.n, { mult: sealMult });
      if (loss > 0) healPlayer(run, Math.floor(loss / 2), cb);
      break;
    }
    case 'execute': {
      const bonus = target.statuses.vulnerable ? fx.bonus : 0;
      hitEnemy(run, cb, target, fx.n + bonus, { mult: sealMult });
      break;
    }
    case 'momentum': {
      hitEnemy(run, cb, target, fx.n + inst.bonus, { mult: sealMult });
      inst.bonus += fx.grow;
      break;
    }
    case 'phantom': hitEnemy(run, cb, target, fx.n * cb.hand.length, { mult: sealMult }); break;
    case 'devour': {
      hitEnemy(run, cb, target, fx.n, { mult: sealMult });
      if (target.hp <= 0) {
        run.player.maxHp += fx.maxHp;
        cb.player.maxHp += fx.maxHp;
        cb.player.hp += fx.maxHp;
        cb.queue.push({ t: 'maxHp', n: fx.maxHp });
      }
      break;
    }
    case 'doubleBlock': gainBlock(cb, P, P.block, false); break;
    case 'limitBreak': if (P.statuses.str > 0) addStatus(cb, P, 'str', P.statuses.str); break;
    case 'catalyst': if (target.statuses.poison) addStatus(cb, target, 'poison', target.statuses.poison * (fx.n - 1)); break;
  }
}

export function usePotion(run, cb, slot, targetIdx = null) {
  const id = run.player.potions[slot];
  if (!id) return false;
  const p = POTIONS[id];
  if (p.combatOnly && (!cb || cb.over)) return false;
  if (p.needsTarget && (targetIdx == null || !cb.enemies[targetIdx] || cb.enemies[targetIdx].hp <= 0)) return false;
  run.player.potions[slot] = null;
  if (cb) cb.queue.push({ t: 'potion', id });
  switch (id) {
    case 'healing': healPlayer(run, 20, cb); if (!cb) run.player.hp = clamp(run.player.hp, 0, run.player.maxHp); break;
    case 'strength': addStatus(cb, cb.player, 'str', 2); break;
    case 'swift': drawCards(run, cb, 3); break;
    case 'block': gainBlock(cb, cb.player, 12, false); break;
    case 'fire': hitEnemy(run, cb, cb.enemies[targetIdx], 20, { isAttack: false }); break;
    case 'venom': addStatus(cb, cb.enemies[targetIdx], 'poison', 7); break;
    case 'energy': cb.player.energy += 2; cb.queue.push({ t: 'energy', n: cb.player.energy }); break;
  }
  return true;
}

export function endTurn(run, cb) {
  if (cb.over) return;
  const P = cb.player;
  cb.queue.push({ t: 'endTurn' });
  // hand end-of-turn penalties
  for (const c of [...cb.hand]) {
    const d = cardData(c);
    if (d.endTurnDmg) damagePlayer(run, cb, d.endTurnDmg, { source: 'burn' });
    if (d.endTurnLoseHp) damagePlayer(run, cb, d.endTurnLoseHp, { source: 'burn' });
    if (cb.over) return;
  }
  if (P.statuses.metallicize) gainBlock(cb, P, P.statuses.metallicize, false);
  if (P.statuses.regen) healPlayer(run, P.statuses.regen, cb);
  // discard hand
  cb.discard.push(...cb.hand);
  cb.hand = [];
  cb.queue.push({ t: 'discardHand' });
  // player debuffs tick down at end of your turn
  for (const s of ['vulnerable', 'weak', 'frail']) {
    if (P.statuses[s]) { P.statuses[s]--; if (!P.statuses[s]) delete P.statuses[s]; }
  }
  // ---- enemy phase
  for (const e of cb.enemies) {
    if (e.hp <= 0 || cb.over) continue;
    if (e.statuses.poison) {
      const pd = e.statuses.poison;
      e.hp -= pd;
      run.stats.dmgDealt += pd;
      cb.queue.push({ t: 'hitEnemy', idx: e.idx, amount: pd, blocked: 0, hpAfter: Math.max(0, e.hp), dead: e.hp <= 0, poison: true });
      e.statuses.poison--;
      if (!e.statuses.poison) delete e.statuses.poison;
      if (e.hp <= 0) { onEnemyDeath(run, cb, e); continue; }
    }
    e.block = 0;
    const mv = enemyMove(e);
    cb.queue.push({ t: 'enemyAct', idx: e.idx, move: e.moveKey, name: mv.name });
    e.lastMoves.push(e.moveKey);
    if (mv.dmg != null) {
      for (let t = 0; t < (mv.times || 1); t++) {
        if (cb.over) break;
        damagePlayer(run, cb, mv.dmg, { source: e.idx, isAttack: true, attacker: e });
      }
      if (mv.ramp) e.flags.rampBonus = (e.flags.rampBonus || 0) + mv.ramp;
    }
    if (cb.over) return;
    if (mv.block) gainBlock(cb, e, mv.block, false);
    if (mv.heal) { e.hp = Math.min(e.maxHp, e.hp + mv.heal); cb.queue.push({ t: 'heal', who: e.idx, n: mv.heal }); }
    if (mv.fx) {
      for (const s of mv.fx) {
        if (s.who === 'player') addStatus(cb, P, s.id, s.n);
        else if (s.who === 'self') addStatus(cb, e, s.id, s.n);
        else if (s.who === 'allies') for (const a of cb.enemies.filter((x) => x.hp > 0)) addStatus(cb, a, s.id, s.n);
      }
    }
    if (mv.addCards) {
      for (let i = 0; i < mv.addCards.n; i++) {
        cb.discard.push({ uid: run.uid++, id: mv.addCards.id, up: false, bonus: 0 });
        cb.queue.push({ t: 'addCard', id: mv.addCards.id, where: 'discard' });
      }
    }
    // enemy end-of-action: ritual, debuff tick
    if (e.statuses.ritual) addStatus(cb, e, 'str', e.statuses.ritual);
    for (const s of ['vulnerable', 'weak']) {
      if (e.statuses[s]) { e.statuses[s]--; if (!e.statuses[s]) delete e.statuses[s]; }
    }
  }
  if (cb.over) return;
  computeIntents(run, cb);
  startPlayerTurn(run, cb);
}

function winCombat(run, cb) {
  cb.over = true;
  cb.result = 'win';
  // write back
  run.player.hp = clamp(cb.player.hp, 1, run.player.maxHp);
  if (hasRelic(run, 'blackBlood')) { healPlayer(run, 12); proc(cb, 'blackBlood'); }
  else if (hasRelic(run, 'emberHeart')) { healPlayer(run, 6); proc(cb, 'emberHeart'); }
  if (hasRelic(run, 'gravebloom') && run.player.hp <= run.player.maxHp * 0.5) { healPlayer(run, 10); proc(cb, 'gravebloom'); }
  run.player.hp = clamp(run.player.hp, 1, run.player.maxHp);
  cb.queue.push({ t: 'victory', perfect: cb.counters.hpLost === 0 }); // an untouched fight is worth saying so
}
function loseCombat(run, cb) {
  cb.over = true;
  cb.result = 'loss';
  cb.player.hp = 0;
  run.player.hp = 0;
  cb.queue.push({ t: 'defeat' });
}

// UI display helpers -------------------------------------------------------
export function previewAttack(cb, base, targetIdx = null) {
  const P = cb.player;
  let dmg = base + (P.statuses.str || 0);
  if (P.statuses.weak) dmg = Math.floor(dmg * 0.75);
  const e = targetIdx != null ? cb.enemies[targetIdx] : null;
  if (e && e.statuses.vulnerable) dmg = Math.floor(dmg * 1.5);
  return Math.max(0, dmg);
}
export function previewBlock(cb, base) {
  const P = cb.player;
  let b = base + (P.statuses.dex || 0);
  if (P.statuses.frail) b = Math.floor(b * 0.75);
  return Math.max(0, b);
}
export function previewEnemyDmg(cb, e) {
  const mv = enemyMove(e);
  if (mv.dmg == null) return null;
  let dmg = mv.dmg + (e.statuses.str || 0) + (e.flags.rampBonus || 0);
  if (e.statuses.weak) dmg = Math.floor(dmg * 0.75);
  if (cb.player.statuses.vulnerable) dmg = Math.floor(dmg * 1.5);
  return { dmg: Math.max(0, dmg), times: mv.times || 1 };
}
// what would this card actually do to this target? pure arithmetic mirroring
// hitEnemy/gainBlock (str, weak, vulnerable, seal, specials) — no state touched
export function previewPlay(run, cb, inst, targetIdx = null) {
  const d = cardData(inst);
  const P = cb.player;
  const target = targetIdx != null ? cb.enemies[targetIdx] : null;
  const sealMult = hasRelic(run, 'executionersSeal') && d.type === 'attack' && (cb.counters.attacks + 1) % 10 === 0 ? 2 : 1;
  const hit = (base) => {
    let dmg = base + (P.statuses.str || 0);
    if (P.statuses.weak) dmg = Math.floor(dmg * 0.75);
    if (target && target.statuses.vulnerable) dmg = Math.floor(dmg * 1.5);
    return Math.max(0, Math.floor(dmg * sealMult));
  };
  const hits = [];
  let block = 0;
  for (const fx of d.effects) {
    if (fx.kind === 'dmg') hits.push({ dmg: hit(fx.n), times: fx.times || 1 });
    else if (fx.kind === 'block') block += previewBlock(cb, fx.n);
    else if (fx.kind === 'special') {
      if (fx.id === 'leech' || fx.id === 'devour') hits.push({ dmg: hit(fx.n), times: 1 });
      else if (fx.id === 'execute') hits.push({ dmg: hit(fx.n + (target?.statuses.vulnerable ? fx.bonus : 0)), times: 1 });
      else if (fx.id === 'momentum') hits.push({ dmg: hit(fx.n + (inst.bonus || 0)), times: 1 });
      else if (fx.id === 'phantom') hits.push({ dmg: hit(fx.n * Math.max(0, cb.hand.length - (cb.hand.includes(inst) ? 1 : 0))), times: 1 });
      else if (fx.id === 'doubleBlock') block += P.block;
    }
  }
  if (!hits.length && !block) return null;
  const total = hits.reduce((s, h) => s + h.dmg * h.times, 0);
  let loss = total, lethal = false;
  if (target) {
    let b = target.block;
    loss = 0;
    for (const h of hits) for (let i = 0; i < h.times; i++) {
      const soak = Math.min(b, h.dmg);
      b -= soak;
      loss += h.dmg - soak;
    }
    lethal = loss >= target.hp;
  }
  return { hits, total, loss, lethal, block };
}

// deck ops -----------------------------------------------------------------
export function addCardToDeck(run, id, up = false) {
  const c = makeCard(run, id, up);
  run.player.deck.push(c);
  return c;
}
export function removeCardFromDeck(run, uid) {
  const i = run.player.deck.findIndex((c) => c.uid === uid);
  if (i >= 0) run.player.deck.splice(i, 1);
}
export function upgradeCardInDeck(run, uid) {
  const c = run.player.deck.find((c) => c.uid === uid);
  if (c) c.up = true;
}
export function duplicateCardInDeck(run, uid) {
  const c = run.player.deck.find((c) => c.uid === uid);
  if (c) run.player.deck.push(makeCard(run, c.id, c.up));
}

// save / load ---------------------------------------------------------------
const SAVE_KEY = 'spirebound_save_v1';
const STATS_KEY = 'spirebound_stats_v1';
export function saveRun(run) {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(run)); } catch { /* private mode */ }
}
export function loadRun() {
  try {
    const s = localStorage.getItem(SAVE_KEY);
    if (!s) return null;
    const run = JSON.parse(s);
    return run && run.player && run.map ? run : null;
  } catch { return null; }
}
export function clearSave() { try { localStorage.removeItem(SAVE_KEY); } catch { /* noop */ } }
export function loadStats() {
  try { return JSON.parse(localStorage.getItem(STATS_KEY)) || { runs: 0, wins: 0, best: 0 }; }
  catch { return { runs: 0, wins: 0, best: 0 }; }
}
export function recordRunEnd(run, won) {
  const s = loadStats();
  s.runs++;
  if (won) s.wins++;
  s.best = Math.max(s.best, run.act * MAP_ROWS + run.floorsClimbed);
  try { localStorage.setItem(STATS_KEY, JSON.stringify(s)); } catch { /* noop */ }
  clearSave();
}

// event op executor (interactive picks handled by UI; returns list of pending picks)
export function applyEventOps(run, ops, rng = runRng(run)) {
  const pending = [];
  const log = [];
  for (const op of ops) {
    if (op.gold) { run.player.gold = Math.max(0, run.player.gold + op.gold); if (op.gold > 0) run.stats.goldEarned += op.gold; }
    if (op.hp) run.player.hp = clamp(run.player.hp + op.hp, 1, run.player.maxHp);
    if (op.maxHp) { run.player.maxHp = Math.max(1, run.player.maxHp + op.maxHp); run.player.hp = clamp(run.player.hp + Math.max(0, op.maxHp), 1, run.player.maxHp); }
    if (op.heal) healPlayer(run, Math.round(run.player.maxHp * op.heal));
    if (op.addCard) addCardToDeck(run, op.addCard);
    if (op.addRelic) {
      const id = op.addRelic === 'random' ? randomRelic(run) : op.addRelic;
      if (id) { gainRelic(run, id); log.push({ relic: id }); }
      else { run.player.gold += 50; log.push({ text: 'You find 50 gold instead.' }); }
    }
    if (op.potion) gainPotion(run, op.potion);
    if (op.pickRemove) pending.push('remove');
    if (op.pickUpgrade) pending.push('upgrade');
    if (op.pickDuplicate) pending.push('duplicate');
    if (op.pickCard) pending.push({ pickCard: op.pickCard });
    if (op.roll) {
      let r = rng(), acc = 0;
      for (const branch of op.roll) {
        acc += branch.p;
        if (r < acc) {
          log.push({ text: branch.text });
          const sub = applyEventOps(run, branch.ops, rng);
          pending.push(...sub.pending);
          log.push(...sub.log);
          break;
        }
      }
    }
  }
  return { pending, log };
}
