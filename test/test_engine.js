// Engine self-check: unit math + monte-carlo random-agent full runs.
import assert from 'node:assert';
import {
  newRun, startCombat, playCard, endTurn, makeCard, cardData, availableNodes, genMap,
  rollEncounter, rollEvent, applyEventOps, genCombatRewards, genShop, gainRelic, randomRelic,
  rollBossRelics, addCardToDeck, removeCardFromDeck, upgradeCardInDeck, gainPotion, usePotion,
  MAP_ROWS, runRng, healPlayer, previewPlay,
} from '../src/engine.js';
import { CARDS, ENEMIES, EVENTS, CARD_POOLS } from '../src/data.js';

function freshCombat(enemyIds = ['sporeling']) {
  const run = newRun(12345);
  const cb = startCombat(run, enemyIds);
  return { run, cb };
}
function forceHand(run, cb, ids) {
  cb.hand = ids.map((id) => makeCard(run, id));
}

// ---- unit checks -----------------------------------------------------------
{
  const run = newRun(1);
  assert.equal(run.player.deck.length, 10, 'starter deck');
  assert.equal(run.player.hp, 72);
  assert.ok(run.map.nodes.length > 20, 'map has nodes');
  for (const n of run.map.nodes) {
    if (n.row < MAP_ROWS - 1) assert.ok(n.next.length > 0, `node ${n.id} has exits`);
    for (const id of n.next) assert.ok(run.map.nodes.find((m) => m.id === id), 'edge target exists');
  }
  assert.ok(availableNodes(run).length > 0, 'start choices exist');
}
{
  const { run, cb } = freshCombat();
  assert.equal(cb.hand.length, 5, 'draw 5');
  assert.equal(cb.player.energy, 3, 'energy 3');
  const e = cb.enemies[0];
  forceHand(run, cb, ['strike']);
  const hp0 = e.hp;
  assert.ok(playCard(run, cb, cb.hand[0].uid, 0), 'strike plays');
  assert.equal(e.hp, Math.max(0, hp0 - 6), 'strike deals 6');
}
{
  // vulnerable multiplies, str adds, weak reduces
  const { run, cb } = freshCombat(['gravewarden']);
  const e = cb.enemies[0];
  e.statuses.vulnerable = 2;
  cb.player.statuses.str = 2;
  forceHand(run, cb, ['strike']);
  const hp0 = e.hp;
  playCard(run, cb, cb.hand[0].uid, 0);
  assert.equal(hp0 - e.hp, Math.floor((6 + 2) * 1.5), 'vuln+str math');
  cb.player.statuses.weak = 1;
  forceHand(run, cb, ['strike']);
  const hp1 = e.hp;
  playCard(run, cb, cb.hand[0].uid, 0);
  assert.equal(hp1 - e.hp, Math.floor(Math.floor((6 + 2) * 0.75) * 1.5), 'weak math');
}
{
  // previewPlay predicts exactly what playCard then does, without touching state
  const { run, cb } = freshCombat(['gravewarden']);
  const e = cb.enemies[0];
  e.statuses.vulnerable = 2;
  e.block = 5;
  cb.player.statuses.str = 3;
  forceHand(run, cb, ['strike']);
  const snap = JSON.stringify({ e, p: cb.player, hand: cb.hand });
  const pv = previewPlay(run, cb, cb.hand[0], 0);
  assert.equal(JSON.stringify({ e, p: cb.player, hand: cb.hand }), snap, 'preview is pure');
  assert.equal(pv.total, Math.floor((6 + 3) * 1.5), 'preview total matches math');
  assert.equal(pv.loss, pv.total - 5, 'preview subtracts target block');
  assert.equal(pv.lethal, pv.loss >= e.hp, 'lethal flag consistent');
  const hp0 = e.hp, b0 = e.block;
  playCard(run, cb, cb.hand[0].uid, 0);
  assert.equal(hp0 - e.hp, pv.loss, 'engine agrees with its own preview');
  assert.ok(b0 > e.block, 'block was consumed');
  // block preview obeys dex + frail
  forceHand(run, cb, ['defend']);
  cb.player.statuses.dex = 2;
  cb.player.statuses.frail = 1;
  const pvb = previewPlay(run, cb, cb.hand[0], null);
  assert.equal(pvb.block, Math.floor((5 + 2) * 0.75), 'block preview dex+frail');
}
{
  // killing blows say so, overkill is measured, untouched wins are perfect
  const { run, cb } = freshCombat(['sporeling']);
  const e = cb.enemies[0];
  e.hp = 4;
  forceHand(run, cb, ['strike']);
  cb.queue.length = 0;
  playCard(run, cb, cb.hand[0].uid, 0);
  const hit = cb.queue.find((ev) => ev.t === 'hitEnemy');
  assert.ok(hit.killingBlow, 'killing blow flagged');
  assert.equal(hit.overkill, 2, 'overkill = damage past zero');
  const win = cb.queue.find((ev) => ev.t === 'victory');
  assert.ok(win && win.perfect, 'no damage taken = perfect');
}
{
  // a scratched win is not perfect
  const { run, cb } = freshCombat(['sporeling']);
  const e = cb.enemies[0];
  cb.player.hp -= 0; // sanity: damage must come through the engine
  e.hp = 1;
  forceHand(run, cb, ['strike']);
  // engine-inflicted chip damage first
  cb.player.block = 0;
  cb.counters.hpLost = 0;
  // simulate a poison tick through the real path
  cb.player.statuses.poison = 1;
  endTurn(run, cb); // enemy acts, poison ticks at player turn start
  if (!cb.over) {
    forceHand(run, cb, ['strike']);
    playCard(run, cb, cb.hand[0].uid, 0);
    const win = cb.queue.find((ev) => ev.t === 'victory');
    assert.ok(win, 'combat won');
    assert.equal(win.perfect, false, 'damage taken spoils perfect');
  }
}
{
  // block + frail
  const { run, cb } = freshCombat(['gravewarden']);
  forceHand(run, cb, ['defend']);
  playCard(run, cb, cb.hand[0].uid);
  assert.equal(cb.player.block, 5, 'defend 5');
  cb.player.statuses.frail = 1;
  forceHand(run, cb, ['defend']);
  playCard(run, cb, cb.hand[0].uid);
  assert.equal(cb.player.block, 5 + 3, 'frail block 3');
}
{
  // poison ticks on enemy at its turn
  const { run, cb } = freshCombat(['gravewarden']);
  forceHand(run, cb, ['venomStrike']);
  const e = cb.enemies[0];
  playCard(run, cb, cb.hand[0].uid, 0);
  assert.equal(e.statuses.poison, 3);
  const hpAfterHit = e.hp;
  endTurn(run, cb);
  assert.equal(e.statuses.poison, 2, 'poison decrements');
  assert.ok(e.hp <= hpAfterHit - 3, 'poison damage applied');
}
{
  // kill -> victory + emberHeart heal
  const { run, cb } = freshCombat(['sporeling']);
  cb.enemies[0].hp = 3;
  cb.player.hp = 40;
  forceHand(run, cb, ['strike']);
  playCard(run, cb, cb.hand[0].uid, 0);
  assert.equal(cb.result, 'win');
  assert.equal(run.player.hp, 46, 'emberheart heals 6');
}
{
  // exhaust + unplayable + energy limit
  const { run, cb } = freshCombat(['gravewarden']);
  forceHand(run, cb, ['preparation', 'wound', 'oblivionStrike']);
  const prep = cb.hand[0], wound = cb.hand[1], obl = cb.hand[2];
  assert.ok(playCard(run, cb, prep.uid), 'preparation plays');
  assert.ok(cb.exhaust.find((c) => c.uid === prep.uid), 'preparation exhausted');
  assert.equal(playCard(run, cb, wound.uid), false, 'wound unplayable');
  cb.player.energy = 2;
  assert.equal(playCard(run, cb, obl.uid, 0), false, 'not enough energy for 3-cost');
}
{
  // card data upgrade merge
  const c = makeCard(newRun(2), 'strike', true);
  assert.equal(cardData(c).effects[0].n, 9, 'upgraded strike 9');
  assert.equal(cardData(c).name, 'Strike+');
}
{
  // events all resolvable
  const run = newRun(7);
  for (const [id, ev] of Object.entries(EVENTS)) {
    for (const ch of ev.choices) {
      assert.ok(Array.isArray(ch.ops), `${id}/${ch.label} ops`);
    }
  }
  const { pending } = applyEventOps(run, [{ gold: 50 }, { pickRemove: true }]);
  assert.equal(run.player.gold, 149);
  assert.deepEqual(pending, ['remove']);
}
{
  // all enemies have valid ai over 30 turns
  const run = newRun(9);
  const rng = runRng(run);
  for (const [id, d] of Object.entries(ENEMIES)) {
    const self = { flags: {}, statuses: {}, hp: d.hp[0], maxHp: d.hp[0] };
    const hist = [];
    for (let t = 1; t <= 30; t++) {
      const mv = d.ai({ turn: t, last: hist[hist.length - 1], prev: hist[hist.length - 2], rng, hpFrac: Math.max(0.05, 1 - t * 0.04), self });
      assert.ok(d.moves[mv], `${id} ai returns valid move (${mv})`);
      hist.push(mv);
    }
  }
}
{
  // every card's effects reference valid kinds/statuses
  const kinds = new Set(['dmg', 'block', 'draw', 'energy', 'heal', 'loseHp', 'status', 'special', 'addCard']);
  for (const [id, c] of Object.entries(CARDS)) {
    for (const fx of c.effects) assert.ok(kinds.has(fx.kind), `${id} fx kind`);
    if (c.up && c.up.effects) for (const fx of c.up.effects) assert.ok(kinds.has(fx.kind), `${id}+ fx kind`);
  }
}

// ---- monte-carlo: random agent plays full runs -----------------------------
function randomAgentRun(seed) {
  const run = newRun(seed);
  const rnd = (() => { let s = seed ^ 0x9e3779b9; const r = () => { s = (s * 1664525 + 1013904223) | 0; return ((s >>> 0) / 4294967296); }; return r; })();
  const choice = (arr) => arr[Math.floor(rnd() * arr.length)];
  let guard = 0;
  while (guard++ < 400) {
    const options = availableNodes(run);
    assert.ok(options.length > 0, 'always somewhere to go');
    const node = choice(options);
    run.nodeId = node.id;
    run.floorsClimbed = node.row + 1;
    let type = node.type;
    if (type === 'monster' || type === 'elite' || type === 'boss') {
      const enc = rollEncounter(run, type, node.row);
      const cb = startCombat(run, enc, type);
      let turnGuard = 0;
      while (!cb.over && turnGuard++ < 200) {
        // play random playable cards
        let played = true, safety = 0;
        while (played && !cb.over && safety++ < 30) {
          played = false;
          const playable = cb.hand.filter((c) => {
            const d = cardData(c);
            if (d.unplayable) return false;
            return (d.cost ?? 99) <= cb.player.energy;
          });
          if (playable.length && rnd() < 0.9) {
            const card = choice(playable);
            const living = cb.enemies.map((e, i) => (e.hp > 0 ? i : -1)).filter((i) => i >= 0);
            const ok = playCard(run, cb, card.uid, living.length ? choice(living) : null);
            played = ok;
          }
        }
        if (!cb.over) endTurn(run, cb);
        cb.queue.length = 0; // drain
      }
      assert.ok(cb.over, `combat terminates (${enc.join()},turns=${turnGuard})`);
      if (cb.result === 'loss') return { dead: true, run };
      const rw = genCombatRewards(run, type);
      run.player.gold += rw.gold;
      if (rw.cards.length && rnd() < 0.8) addCardToDeck(run, choice(rw.cards));
      if (rw.potion) gainPotion(run, rw.potion);
      if (rw.relic) gainRelic(run, rw.relic);
      if (type === 'boss') {
        if (run.act >= 2) return { won: true, run };
        const bosses = rollBossRelics(run);
        if (bosses.length) gainRelic(run, choice(bosses));
        run.act++;
        run.nodeId = null;
        run.map = genMap(run);
        healPlayer(run, Math.round(run.player.maxHp * 0.3));
      }
    } else if (type === 'rest') {
      if (rnd() < 0.5) healPlayer(run, Math.round(run.player.maxHp * 0.3));
      else {
        const up = run.player.deck.filter((c) => !c.up && CARDS[c.id].up);
        if (up.length) upgradeCardInDeck(run, choice(up).uid);
      }
    } else if (type === 'event') {
      const ev = EVENTS[rollEvent(run)];
      const valid = ev.choices.filter((c) => !c.needGold || run.player.gold >= c.needGold);
      const { pending } = applyEventOps(run, choice(valid).ops);
      for (const p of pending) {
        if (p === 'remove' && run.player.deck.length > 1) removeCardFromDeck(run, choice(run.player.deck).uid);
        else if (p === 'upgrade') { const u = run.player.deck.filter((c) => !c.up); if (u.length) upgradeCardInDeck(run, choice(u).uid); }
        else if (p === 'duplicate') addCardToDeck(run, choice(run.player.deck).id);
        else if (p.pickCard) addCardToDeck(run, choice(CARD_POOLS.common));
      }
    } else if (type === 'shop') {
      const shop = genShop(run);
      for (const it of [...shop.cards, ...shop.relics, ...shop.potions]) {
        if (!it.sold && it.price <= run.player.gold && rnd() < 0.4) {
          run.player.gold -= it.price;
          it.sold = true;
          if (shop.cards.includes(it)) addCardToDeck(run, it.id);
          else if (shop.relics.includes(it)) gainRelic(run, it.id);
          else gainPotion(run, it.id);
        }
      }
    } else if (type === 'treasure') {
      const r = randomRelic(run);
      if (r) gainRelic(run, r);
    }
    assert.ok(run.player.hp > 0, 'alive after node');
    assert.ok(run.player.hp <= run.player.maxHp, 'hp <= maxHp');
  }
  throw new Error('run did not terminate');
}

let wins = 0, deaths = 0;
const RUNS = 300;
for (let i = 0; i < RUNS; i++) {
  const res = randomAgentRun(1000 + i * 7919);
  if (res.won) wins++;
  else deaths++;
}
assert.equal(wins + deaths, RUNS);
console.log(`unit checks passed; monte-carlo: ${RUNS} runs, ${wins} random-agent wins, ${deaths} deaths`);
