// Engine self-check: unit math + asset manifest + monte-carlo random-agent full runs.
import assert from 'node:assert';
import { readdirSync } from 'node:fs';
import {
  newRun, startCombat, playCard, endTurn, drawCards, makeCard, cardData, availableNodes, genMap,
  rollEncounter, rollEvent, applyEventOps, applyNodeEventChoice, finalizeNodeEventChoice, claimTreasure, claimBossRelic, nodeRewardClaimed, nodeEventInFlight, saveRun, loadRun, genCombatRewards, genShop, gainRelic, randomRelic,
  rollBossRelics, addCardToDeck, removeCardFromDeck, upgradeCardInDeck, gainPotion, usePotion,
  MAP_ROWS, runRng, healPlayer, previewPlay, visitNode, claimMonument, cardPool, relicPool,
  gainEmbers, kindleFromHand, canUseArt, useArt, rollOmen, restHealFrac, effCost,
  previewBlock, previewEnemyDmg, rollCardReward, vowMods,
} from '../src/engine.js';
import { CARDS, ENEMIES, EVENTS, CARD_POOLS, RELIC_POOLS, ARTS, OMENS, AFFIXES, ASPECTS, VOWS, BOONS, RELICS, POTIONS, STATUS_INFO, DEEDS } from '../src/data.js';
import { _setStore, loadVigil, syncVigil, commitRunToVigil, setBequest, clearBequest, bequestOptions } from '../src/vigil.js';
import { bfResolve, bfActor, bfSlots, bfEnemySize, bfEnemyFootX, bfEnemyFootY, bfEnemyZOrder, bfHeroY, _setBF, bfRaw } from '../src/battlefield.js';
import { serializeBF, validateBF } from '../src/dev/bf-serialize.js';
import { pileTier, pileFanLayers, pileFanAngleDeg, flightSchedule, PILE_IDS, PILE_FAN_DEG, PILE_FAN_MAX_DEG, PILE_FAN_MAX_LAYERS } from '../src/pile-chrome.js';

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
  assert.equal(cardData(c).effects[0].n, 9, 'upgraded edge 9');
  assert.equal(cardData(c).name, 'Edge+');
  const q = makeCard(newRun(2), 'heavyBlow', true);
  assert.equal(cardData(q).chip, 2, 'upgrade merges chip bonus');
}
{
  // locked content stays out of base pools and enters with its unlock token
  assert.ok(!CARD_POOLS.uncommon.includes('quakeblow'), 'locked card out of pool');
  assert.ok(!RELIC_POOLS.rare.includes('prismCharm'), 'locked relic out of pool');
  const run = newRun(48, { unlocks: ['card:quakeblow', 'relic:prismCharm'] });
  assert.ok(cardPool(run, 'uncommon').includes('quakeblow'), 'deed pays out into the pool');
  assert.ok(relicPool(run, 'rare').includes('prismCharm'), 'relic unlock reaches the pool');
}
{
  // Crowns rewrite rules
  const runA = newRun(49);
  gainRelic(runA, 'crownOfCinders');
  const cbA = startCombat(runA, ['gravewarden']);
  assert.equal(cbA.emberCap, 12, 'cinders: deeper lantern');
  assert.equal(cbA.embers, 2, 'cinders: starts lit');
  const runB = newRun(50);
  gainRelic(runB, 'crownOfTithes');
  const cbB = startCombat(runB, ['gravewarden']);
  forceHand(runB, cbB, ['strike', 'strike', 'strike']);
  const b0 = cbB.player.block;
  assert.ok(kindleFromHand(runB, cbB, cbB.hand[0].uid), 'first kindle');
  assert.ok(kindleFromHand(runB, cbB, cbB.hand[0].uid), 'tithes: second kindle');
  assert.equal(kindleFromHand(runB, cbB, cbB.hand[0].uid), false, 'but not a third');
  assert.equal(cbB.player.block, b0 + 6, 'each kindling grants 3 Ward');
  const runC = newRun(51);
  gainRelic(runC, 'crownOfTheHearth');
  const cbC = startCombat(runC, ['sporeling']);
  cbC.player.hp = 30;
  runC.player.hp = 30;
  cbC.embers = 5;
  cbC.enemies[0].hp = 1;
  forceHand(runC, cbC, ['strike']);
  playCard(runC, cbC, cbC.hand[0].uid, 0);
  assert.equal(cbC.result, 'win');
  // emberHeart 6 + hearth 5*3+1(death ember? death ember granted before win... enemy died => win first) — hearth heals embers*3
  assert.ok(runC.player.hp >= 30 + 6 + 15, 'hearth: unspent embers become blood');
  const runD = newRun(52);
  gainRelic(runD, 'shatterersCrown');
  const cbD = startCombat(runD, ['gravewarden']);
  assert.equal(cbD.enemies[0].facetMax, 4, 'shatterer: thinner glass');
  assert.equal(cbD.enemies[0].statuses.str, 1, 'shatterer: angrier glass');
  const runE = newRun(53);
  gainRelic(runE, 'hollowCrown');
  assert.equal(runE.player.energyMax, 4, 'hollow: +1 energy');
  assert.equal(runE.player.maxHp, 62, 'hollow: -10 maxHp');
}
{
  // new specials: shatterEcho doubles vs Cracked/Staggered and previews it
  const { run, cb } = freshCombat(['gravewarden']);
  forceHand(run, cb, ['resonantLance']);
  const e = cb.enemies[0];
  const pv0 = previewPlay(run, cb, cb.hand[0], 0);
  assert.equal(pv0.total, 7, 'quiet glass: base 7');
  e.statuses.vulnerable = 1;
  const pv1 = previewPlay(run, cb, cb.hand[0], 0);
  assert.equal(pv1.total, Math.floor(14 * 1.5), 'cracked glass: doubled then ×1.5');
  const hp0 = e.hp;
  playCard(run, cb, cb.hand[0].uid, 0);
  assert.equal(hp0 - e.hp, pv1.loss, 'echo preview parity');
  // emberNova scales with the lantern
  const { run: r2, cb: c2 } = freshCombat(['gravewarden']);
  c2.embers = 4;
  forceHand(r2, c2, ['novaflare']);
  const pv2 = previewPlay(r2, c2, c2.hand[0], 0);
  assert.equal(pv2.total, 12, 'nova: 3 × 4 embers');
  const h0 = c2.enemies[0].hp;
  playCard(r2, c2, c2.hand[0].uid, 0);
  assert.equal(h0 - c2.enemies[0].hp, pv2.loss, 'nova preview parity');
}
{
  // pyre tithe burns the rest of the hand, feeds the lantern, draws anew
  const { run, cb } = freshCombat(['gravewarden']);
  forceHand(run, cb, ['offering', 'wound', 'strike', 'hex']);
  cb.embers = 0;
  cb.draw = [makeCard(run, 'strike'), makeCard(run, 'strike'), makeCard(run, 'strike')];
  playCard(run, cb, cb.hand[0].uid);
  // 3 others burned (hex CAN burn by pyre — the card's power) + the tithe itself kindles
  assert.equal(cb.embers, 4, 'three panes + the tithe itself fed the lantern');
  assert.equal(cb.hand.length, 3, 'drew 3 fresh cards');
  assert.equal(cb.exhaust.length, 4, 'ashes hold them all');
}
{
  // eat the flame: a kill swallows fire even as the fight ends
  const { run, cb } = freshCombat(['sporeling', 'sporeling']);
  cb.enemies[0].hp = 5;
  forceHand(run, cb, ['devour']);
  playCard(run, cb, cb.hand[0].uid, 0);
  assert.ok(cb.embers >= 4, 'devour embers (3) + death ember (1)');
  // flawless form doubles while untouched
  const { run: r2, cb: c2 } = freshCombat(['gravewarden']);
  forceHand(r2, c2, ['flawlessForm']);
  playCard(r2, c2, c2.hand[0].uid);
  assert.equal(c2.player.block, 16, 'untouched: 8 + 8');
  c2.counters.hpLost = 3;
  forceHand(r2, c2, ['flawlessForm']);
  playCard(r2, c2, c2.hand[0].uid);
  assert.equal(c2.player.block, 16 + 8, 'scratched: just 8');
  // emberdance converts the lantern to ward
  const { run: r3, cb: c3 } = freshCombat(['gravewarden']);
  c3.embers = 4;
  forceHand(r3, c3, ['emberdance']);
  playCard(r3, c3, c3.hand[0].uid);
  // 4 embers × 3 ward, then the kindle of emberdance itself re-lights 1 ember
  assert.equal(c3.player.block, 12, 'emberdance ward');
  assert.equal(c3.embers, 1, 'lantern spilled, then fed by its own burning');
}
{
  // omens: every entry's mods actually hook the engine — and its previews
  const withOmen = (id, enemies = ['gravewarden']) => {
    const run = newRun(60);
    run.omens = [id];
    const cb = startCombat(run, enemies);
    return { run, cb };
  };
  { // ashfall: enemies start smoldering; their blows leave ash on you
    const { run, cb } = withOmen('ashfall', ['sporeling']);
    assert.equal(cb.enemies[0].statuses.poison, 2, 'ashfall smolders them');
    cb.enemies[0].moveKey = 'spit';
    cb.queue.length = 0;
    endTurn(run, cb);
    assert.ok(cb.queue.find((ev) => ev.t === 'status' && ev.who === 'player' && ev.id === 'poison'), 'their blows smolder you');
  }
  { // heavy air: ward swells identically in play and preview
    const { run, cb } = withOmen('heavyAir');
    assert.equal(previewBlock(run, cb, 5), Math.round(5 * 1.25), 'preview holds the light');
    forceHand(run, cb, ['defend']);
    playCard(run, cb, cb.hand[0].uid);
    assert.equal(cb.player.block, Math.round(5 * 1.25), 'play agrees');
  }
  { // thin glass: smaller gauges, harder blows (mirrored in the intent preview)
    const { run, cb } = withOmen('thinGlass', ['sporeling']);
    assert.equal(cb.enemies[0].facetMax, 2, 'sporeling glass thinned to the floor');
    cb.enemies[0].moveKey = 'spit';
    const p = previewEnemyDmg(run, cb, cb.enemies[0]);
    const hp0 = cb.player.hp;
    endTurn(run, cb);
    assert.equal(hp0 - cb.player.hp, p.dmg, 'intent preview tells the omen truth');
  }
  { // hungry dark: dearer shops, richer choices
    const runA = newRun(61); runA.omens = ['hungryDark'];
    const runB = newRun(61); runB.omens = [];
    assert.equal(rollCardReward(runB).length + 1, (runB.omens = ['hungryDark'], rollCardReward(runA).length), 'one more choice');
    const runC = newRun(61); runC.omens = ['hungryDark'];
    const runD = newRun(61); runD.omens = [];
    const shopC = genShop(runC), shopD = genShop(runD);
    assert.equal(shopC.cards[0].price, Math.round(shopD.cards[0].price * 1.25), 'the dark eats coin');
  }
  { // ember wind: a lit lantern, a lighter hand
    const { cb } = withOmen('emberWind');
    assert.equal(cb.embers, 2, 'sparks ride the wind');
    assert.equal(cb.hand.length, 4, 'draw 4');
  }
  { // long night: tougher glass, richer purses
    const runA = newRun(63); runA.omens = ['longNight'];
    const runB = newRun(63); runB.omens = [];
    const cbA = startCombat(runA, ['gravewarden']);
    const cbB = startCombat(runB, ['gravewarden']);
    assert.equal(cbA.enemies[0].maxHp, Math.round(cbB.enemies[0].maxHp * 1.12), 'they carry more life');
    const runC = newRun(63); runC.omens = ['longNight'];
    const runD = newRun(63); runD.omens = [];
    assert.equal(genCombatRewards(runC, 'normal').gold, Math.round(genCombatRewards(runD, 'normal').gold * 1.4), 'victory pays more');
  }
  { // waning moon: the first card is cheap, the fire heals less
    const { run, cb } = withOmen('waningMoon');
    forceHand(run, cb, ['strike', 'strike']);
    assert.equal(effCost(run, cb, cb.hand[0]), 0, 'first card discounted');
    playCard(run, cb, cb.hand[0].uid, 0);
    assert.equal(effCost(run, cb, cb.hand[0]), 1, 'only the first');
    assert.equal(restHealFrac(run), 0.2, 'rest sites dimmed');
  }
}
{
  // elite affixes: each title keeps its promise
  const withAffix = (affix) => {
    const run = newRun(62);
    run.omens = [];
    return { run, cb: startCombat(run, ['gravewarden'], 'elite', { affix }) };
  };
  const { cb: rolled } = (() => { const run = newRun(65); run.omens = []; return { cb: startCombat(run, ['gravewarden'], 'elite') }; })();
  assert.ok(AFFIXES[rolled.affix], 'every elite wears a title');
  const { cb: vit } = withAffix('vitrified');
  assert.equal(vit.facetMax, undefined); // affix lives on enemies, not cb
  assert.equal(vit.enemies[0].facetMax, 7, 'vitrified: thicker glass');
  const runP = newRun(62); runP.omens = [];
  const plain = startCombat(runP, ['gravewarden'], 'normal');
  assert.equal(vit.enemies[0].maxHp, Math.round(plain.enemies[0].maxHp * 1.15), 'vitrified: +15% HP');
  assert.equal(withAffix('veiled').cb.enemies[0].block, 15, 'veiled: starts warded');
  assert.equal(withAffix('fervent').cb.enemies[0].statuses.str, 2, 'fervent: starts stoked');
  { // adamant: the first shatter holds, the second lands
    const { run, cb } = withAffix('adamant');
    const e = cb.enemies[0];
    e.chips = e.facetMax - 1;
    forceHand(run, cb, ['strike']);
    cb.queue.length = 0;
    playCard(run, cb, cb.hand[0].uid, 0);
    assert.ok(cb.queue.find((ev) => ev.t === 'adamantHold'), 'the glass holds');
    assert.ok(!e.flags.staggered, 'no stagger the first time');
    assert.equal(cb.embers, 0, 'no embers spill');
    e.chips = e.facetMax - 1;
    forceHand(run, cb, ['strike']);
    playCard(run, cb, cb.hand[0].uid, 0);
    assert.ok(e.flags.staggered, 'the second shatter lands');
  }
  { // ember-fat: double gold
    const runA = newRun(66); runA.omens = [];
    const runB = newRun(66); runB.omens = [];
    assert.equal(genCombatRewards(runA, 'elite', 'emberFat').gold, genCombatRewards(runB, 'elite').gold * 2, 'slaying it pays double');
  }
  { // cinder-veined: its blows leave smolder
    const { run, cb } = withAffix('cinderVeined');
    cb.enemies[0].moveKey = 'crush';
    cb.queue.length = 0;
    endTurn(run, cb);
    assert.ok(cb.queue.find((ev) => ev.t === 'status' && ev.who === 'player' && ev.id === 'poison'), 'cinders cling');
  }
}
{
  // unlit lanterns: sane fraction, never on protected rows, bounty attached
  let unlit = 0, total = 0;
  for (let s = 0; s < 60; s++) {
    const run = newRun(9000 + s * 13);
    for (const n of run.map.nodes) {
      total++;
      if (n.unlit) {
        unlit++;
        assert.ok(n.row > 0 && n.row !== 8 && n.row < MAP_ROWS - 2, 'unlit stays off protected rows');
        assert.ok(n.bounty >= 12, 'the dark owes a bounty');
      }
    }
  }
  const frac = unlit / total;
  assert.ok(frac > 0.05 && frac < 0.25, `unlit fraction sane (${frac.toFixed(3)})`);
  // every omen rolled at run start is a real omen
  for (let s = 0; s < 20; s++) assert.ok(OMENS[newRun(700 + s).omens[0]], 'run begins under a real sky');
}
{
  // smoldering coal + bell of endings + prism charm
  const run = newRun(54, { unlocks: ['relic:smolderingCoal'] });
  gainRelic(run, 'smolderingCoal');
  const cb = startCombat(run, ['sporeling', 'sporeling']);
  assert.ok(cb.enemies.every((e) => e.statuses.poison === 2), 'coal: enemies smolder from the start');
  const run2 = newRun(55);
  gainRelic(run2, 'bellOfEndings');
  gainRelic(run2, 'prismCharm');
  const cb2 = startCombat(run2, ['gravewarden', 'gravewarden']);
  const [a, b] = cb2.enemies;
  const bHp = b.hp;
  a.chips = a.facetMax - 1;
  forceHand(run2, cb2, ['strike']);
  playCard(run2, cb2, cb2.hand[0].uid, 0);
  assert.equal(bHp - b.hp, 4, 'the bell tolls for the other glass');
  assert.equal(cb2.embers, 4, 'prism: first shatter spills double');
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
  // node rewards: treasure, events, and boss relics are idempotent per node/act
  const run = newRun(88);
  const treasure = run.map.nodes.find((n) => n.type === 'treasure') || run.map.nodes.find((n) => n.row === 8);
  assert.ok(treasure, 'map has a treasure node');
  run.nodeId = treasure.id;
  const relics0 = run.player.relics.length;
  const gold0 = run.player.gold;
  const first = claimTreasure(run);
  assert.equal(first.already, false);
  const second = claimTreasure(run);
  assert.equal(second.already, true);
  assert.equal(run.player.relics.length - relics0, first.relicId ? 1 : 0);
  if (!first.relicId) assert.equal(run.player.gold - gold0, 60);
  assert.equal(treasure.rewardClaimed, true);

  const runEv = newRun(89);
  const eventNode = runEv.map.nodes.find((n) => n.type === 'event') || runEv.map.nodes[5];
  runEv.nodeId = eventNode.id;
  const ops = EVENTS.voidChest.choices[0].ops;
  const ev1 = applyNodeEventChoice(runEv, ops);
  assert.equal(ev1.already, false);
  assert.equal(nodeRewardClaimed(runEv), false, 'event not settled until pending finalizes');
  assert.equal(nodeEventInFlight(runEv), true);
  const relicsAfterFirst = runEv.player.relics.length;
  const hpAfterFirst = runEv.player.hp;
  const ev2 = applyNodeEventChoice(runEv, ops);
  assert.equal(ev2.already, true);
  assert.equal(runEv.player.relics.length, relicsAfterFirst);
  assert.equal(runEv.player.hp, hpAfterFirst);
  finalizeNodeEventChoice(runEv);
  assert.equal(eventNode.rewardClaimed, true);
  assert.equal(nodeEventInFlight(runEv), false);

  const runPending = newRun(94);
  const pendingNode = runPending.map.nodes.find((n) => n.type === 'event') || runPending.map.nodes[5];
  runPending.nodeId = pendingNode.id;
  const pendingOps = [{ gold: 25 }, { pickRemove: true }];
  const mid = applyNodeEventChoice(runPending, pendingOps);
  assert.equal(mid.already, false);
  assert.deepEqual(mid.pending, ['remove']);
  assert.equal(nodeEventInFlight(runPending), true);
  assert.equal(nodeRewardClaimed(runPending), false);
  finalizeNodeEventChoice(runPending);
  assert.equal(pendingNode.rewardClaimed, true);

  const runBoss = newRun(90);
  const picks = rollBossRelics(runBoss);
  assert.ok(picks.length, 'boss relic pool');
  const beforeBoss = runBoss.player.relics.length;
  const br1 = claimBossRelic(runBoss, picks[0]);
  assert.equal(br1.already, false);
  const br2 = claimBossRelic(runBoss, picks[1] || picks[0]);
  assert.equal(br2.already, true);
  assert.equal(runBoss.player.relics.length - beforeBoss, 1);

  const runOrphan = newRun(91);
  runOrphan.nodeId = null;
  const orphan1 = claimTreasure(runOrphan);
  assert.equal(orphan1.already, false);
  assert.equal(runOrphan.orphanRewardClaimed, true);
  const orphan2 = claimTreasure(runOrphan);
  assert.equal(orphan2.already, true);

  const runXfer = newRun(92);
  runXfer.nodeId = null;
  claimTreasure(runXfer);
  const xferNode = runXfer.map.nodes.find((n) => n.type === 'treasure') || runXfer.map.nodes.find((n) => n.row === 8);
  visitNode(runXfer, xferNode);
  assert.equal(xferNode.rewardClaimed, true, 'orphan claim transfers to node on visitNode');
  assert.equal(claimTreasure(runXfer).already, true);

  const runOrphanRes = newRun(95);
  runOrphanRes.nodeId = null;
  applyNodeEventChoice(runOrphanRes, [{ pickRemove: true }]);
  assert.equal(runOrphanRes.orphanRewardResolving, true);
  const resNode = runOrphanRes.map.nodes.find((n) => n.type === 'event') || runOrphanRes.map.nodes[5];
  visitNode(runOrphanRes, resNode);
  assert.equal(resNode.rewardResolving, true, 'orphan resolving transfers to node on visitNode');
  assert.equal(runOrphanRes.orphanRewardResolving, false);

  const saved = JSON.parse(JSON.stringify(run));
  assert.equal(claimTreasure(saved).already, true, 'rewardClaimed survives JSON round-trip');
  const savedBoss = JSON.parse(JSON.stringify(runBoss));
  assert.equal(claimBossRelic(savedBoss, picks[0]).already, true, 'bossRelicAct survives JSON round-trip');
  assert.equal(nodeRewardClaimed(saved), true);

  const store = new Map();
  const prevLs = globalThis.localStorage;
  try {
    globalThis.localStorage = {
      getItem: (k) => store.get(k) ?? null,
      setItem: (k, v) => { store.set(k, v); },
      removeItem: (k) => { store.delete(k); },
    };
    const runLoad = newRun(93);
    const loadNode = runLoad.map.nodes.find((n) => n.type === 'treasure') || runLoad.map.nodes.find((n) => n.row === 8);
    runLoad.nodeId = loadNode.id;
    claimTreasure(runLoad);
    delete runLoad.bossRelicAct;
    delete runLoad.orphanRewardClaimed;
    delete runLoad.orphanRewardResolving;
    saveRun(runLoad);
    const reloaded = loadRun();
    assert.ok(reloaded, 'loadRun returns saved run');
    reloaded.nodeId = loadNode.id;
    assert.equal(reloaded.bossRelicAct, -1, 'loadRun self-heals bossRelicAct');
    assert.equal(reloaded.orphanRewardClaimed, false, 'loadRun self-heals orphanRewardClaimed');
    assert.equal(reloaded.orphanRewardResolving, false, 'loadRun self-heals orphanRewardResolving');
    assert.equal(claimTreasure(reloaded).already, true, 'reward flags survive loadRun round-trip');

    const runEvLoad = newRun(96);
    const evNode = runEvLoad.map.nodes.find((n) => n.type === 'event') || runEvLoad.map.nodes[5];
    runEvLoad.nodeId = evNode.id;
    applyNodeEventChoice(runEvLoad, [{ gold: 15 }]);
    assert.equal(evNode.rewardResolving, true);
    saveRun(runEvLoad);
    const reloadedEv = loadRun();
    assert.ok(reloadedEv);
    const savedEvNode = reloadedEv.map.nodes.find((n) => n.id === evNode.id);
    reloadedEv.nodeId = evNode.id;
    assert.equal(savedEvNode.rewardResolving, true, 'rewardResolving survives loadRun round-trip');
    assert.equal(applyNodeEventChoice(reloadedEv, [{ gold: 99 }]).already, true);
  } finally {
    if (prevLs) globalThis.localStorage = prevLs;
    else delete globalThis.localStorage;
  }
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
  // chips: an attack that draws unblocked blood chips once per card
  const { run, cb } = freshCombat(['gravewarden']); // 5 facets
  const e = cb.enemies[0];
  assert.equal(e.facetMax, 5, 'elite facets');
  assert.equal(e.chips, 0);
  forceHand(run, cb, ['twinFangs']); // 4×2 — multi-hit still chips once
  playCard(run, cb, cb.hand[0].uid, 0);
  assert.equal(e.chips, 1, 'multi-hit chips once');
  e.block = 99;
  forceHand(run, cb, ['strike']);
  playCard(run, cb, cb.hand[0].uid, 0);
  assert.equal(e.chips, 1, 'a fully-warded blow chips nothing');
  e.block = 0;
  cb.player.statuses.beacon = 1;
  forceHand(run, cb, ['strike']);
  playCard(run, cb, cb.hand[0].uid, 0);
  assert.equal(e.chips, 3, 'beacon chips +1');
  endTurn(run, cb);
  assert.ok(!cb.player.statuses.beacon, 'beacon burns out at end of turn');
}
{
  // shatter: stagger + Cracked + embers, gauge resets, glass anneals harder
  const { run, cb } = freshCombat(['gravewarden']);
  const e = cb.enemies[0];
  e.chips = e.facetMax - 1;
  forceHand(run, cb, ['strike']);
  cb.queue.length = 0;
  playCard(run, cb, cb.hand[0].uid, 0);
  assert.ok(cb.queue.find((ev) => ev.t === 'shatter'), 'shatter event');
  assert.ok(e.flags.staggered, 'staggered');
  assert.equal(e.statuses.vulnerable, 2, 'shattered glass is Cracked');
  assert.equal(e.chips, 0, 'gauge reset');
  assert.equal(e.facetMax, 6, 'glass anneals: threshold +1');
  assert.equal(cb.embers, 2, 'embers spill to the lantern');
  assert.equal(run.stats.shatters, 1);
  // the staggered enemy loses its action but its pattern still advances
  const hp0 = cb.player.hp, moves0 = e.lastMoves.length;
  e.statuses.ritual = 2;
  cb.queue.length = 0;
  endTurn(run, cb);
  assert.equal(cb.player.hp, hp0, 'staggered enemy deals nothing');
  assert.ok(cb.queue.find((ev) => ev.t === 'staggered'), 'stagger played back');
  assert.ok(!cb.queue.find((ev) => ev.t === 'enemyAct'), 'no move executed');
  assert.equal(e.lastMoves.length, moves0 + 1, 'skipped move still recorded');
  assert.ok((e.statuses.str || 0) >= 2, 'litany still ticked while staggered');
  assert.ok(!e.flags.staggered, 'stagger spent');
  assert.ok(e.moveKey, 'next intent computed');
}
{
  // embers cap; kindling is once a turn, curses refuse, junk burns fine
  const { run, cb } = freshCombat(['gravewarden']);
  cb.embers = 0;
  const g1 = gainEmbers(run, cb, 4);
  assert.equal(g1, 4);
  assert.equal(gainEmbers(run, cb, 99), 5, 'gain clamps at the cap');
  assert.equal(cb.embers, 9);
  cb.queue.length = 0;
  assert.equal(gainEmbers(run, cb, 5), 0, 'no gain at cap');
  assert.ok(!cb.queue.find((ev) => ev.t === 'ember'), 'no phantom ember event');
  forceHand(run, cb, ['wound', 'hex', 'strike']);
  const [wound, hex, strike] = cb.hand;
  assert.equal(kindleFromHand(run, cb, hex.uid), false, 'hexes cling to the hand');
  cb.embers = 0;
  assert.ok(kindleFromHand(run, cb, wound.uid), 'junk burns fine');
  assert.equal(cb.embers, 1, 'kindling feeds the lantern');
  assert.ok(cb.exhaust.find((c) => c.uid === wound.uid), 'kindled = burned away');
  assert.equal(kindleFromHand(run, cb, strike.uid), false, 'once per turn');
  assert.equal(run.stats.kindles, 1, 'deed counted');
  endTurn(run, cb);
  if (!cb.over) assert.ok(kindleFromHand(run, cb, cb.hand[0]?.uid), 'the rite renews next turn');
}
{
  // exhaust itself feeds the lantern (preparation exhausts on play)
  const { run, cb } = freshCombat(['gravewarden']);
  forceHand(run, cb, ['preparation']);
  playCard(run, cb, cb.hand[0].uid);
  assert.equal(cb.embers, 1, 'exhaust grants an ember');
}
{
  // smolder jumps on shatter (other host) and on death; lost with the last
  const { run, cb } = freshCombat(['sporeling', 'sporeling']);
  const [a, b] = cb.enemies;
  a.statuses.poison = 4;
  a.chips = a.facetMax - 1;
  forceHand(run, cb, ['strike']);
  cb.queue.length = 0;
  playCard(run, cb, cb.hand[0].uid, 0);
  if (a.hp > 0) { // survived the strike: shatter moved the smolder
    assert.ok(!a.statuses.poison, 'smolder left the shattered host');
    assert.equal(b.statuses.poison, 4, 'smolder found new glass');
    assert.ok(cb.queue.find((ev) => ev.t === 'smolderJump'), 'jump played back');
  }
  // death jump
  const { run: r2, cb: c2 } = freshCombat(['sporeling', 'sporeling']);
  c2.enemies[0].hp = 1;
  c2.enemies[0].statuses.poison = 3;
  forceHand(r2, c2, ['strike']);
  playCard(r2, c2, c2.hand[0].uid, 0);
  assert.equal(c2.enemies[1].statuses.poison, 3, 'smolder outlives its vessel');
  assert.equal(c2.embers, 1, 'a death spills one ember');
  // last host: the fire dies with it
  const { run: r3, cb: c3 } = freshCombat(['sporeling']);
  c3.enemies[0].hp = 1;
  c3.enemies[0].statuses.poison = 5;
  forceHand(r3, c3, ['strike']);
  playCard(r3, c3, c3.hand[0].uid, 0);
  assert.equal(c3.result, 'win', 'combat over, nothing to jump to');
}
{
  // Lantern Arts: every art fires, pays its embers, and keeps to once a turn
  for (const [id, art] of Object.entries(ARTS)) {
    const { run, cb } = freshCombat(['gravewarden', 'sporeling']);
    run.art = id;
    cb.embers = 9;
    assert.ok(canUseArt(run, cb), `${id} usable at 9 embers`);
    const hp0 = cb.enemies.map((e) => e.hp);
    const php0 = cb.player.hp;
    assert.ok(useArt(run, cb), `${id} fires`);
    assert.equal(cb.embers, 9 - art.cost, `${id} paid ${art.cost}`);
    assert.equal(run.stats.embersSpent, art.cost, `${id} deed counted`);
    assert.equal(useArt(run, cb), false, `${id} once per turn`);
    for (const fx of art.effects) {
      if (fx.kind === 'dmg') cb.enemies.forEach((e, i) => assert.ok(e.hp <= hp0[i] - fx.n || e.hp <= 0, `${id} hurt all`));
      if (fx.kind === 'status' && fx.who !== 'self') cb.enemies.forEach((e) => e.hp > 0 && assert.ok(e.statuses[fx.id] >= fx.n, `${id} afflicted all`));
      if (fx.kind === 'status' && fx.who === 'self') assert.ok(cb.player.statuses[fx.id] >= fx.n, `${id} self status`);
      if (fx.kind === 'block') assert.ok(cb.player.block >= fx.n, `${id} warded`);
      if (fx.kind === 'heal') assert.ok(cb.player.hp >= php0, `${id} healed`);
    }
  }
  // too poor: the lantern refuses
  const { run, cb } = freshCombat(['gravewarden']);
  run.art = 'flare';
  cb.embers = ARTS.flare.cost - 1;
  assert.equal(canUseArt(run, cb), false, 'not enough embers');
  // beacon: the art's status actually chips extra
  const { run: r2, cb: c2 } = freshCombat(['gravewarden']);
  r2.art = 'beacon';
  c2.embers = 9;
  useArt(r2, c2);
  forceHand(r2, c2, ['strike']);
  playCard(r2, c2, c2.hand[0].uid, 0);
  assert.equal(c2.enemies[0].chips, 2, 'beacon-lit attack chips twice');
}
{
  // previewPlay predicts the shatter it then delivers
  const { run, cb } = freshCombat(['gravewarden']);
  const e = cb.enemies[0];
  e.chips = e.facetMax - 1;
  forceHand(run, cb, ['strike']);
  const snap = JSON.stringify({ e, p: cb.player, embers: cb.embers });
  const pv = previewPlay(run, cb, cb.hand[0], 0);
  assert.equal(JSON.stringify({ e, p: cb.player, embers: cb.embers }), snap, 'shatter preview is pure');
  assert.equal(pv.chips, 1, 'one chip predicted');
  assert.ok(pv.willShatter, 'shatter predicted');
  playCard(run, cb, cb.hand[0].uid, 0);
  assert.ok(e.facetMax === 6 && e.chips === 0, 'and delivered');
  // a warded target predicts no chips
  e.block = 99;
  forceHand(run, cb, ['strike']);
  const pv2 = previewPlay(run, cb, cb.hand[0], 0);
  assert.equal(pv2.chips, 0, 'no blood, no chip');
  assert.ok(!pv2.willShatter);
}
{
  // every card's effects reference valid kinds/statuses
  const kinds = new Set(['dmg', 'block', 'draw', 'energy', 'heal', 'loseHp', 'status', 'special', 'addCard', 'chip', 'ember']);
  for (const [id, c] of Object.entries(CARDS)) {
    for (const fx of c.effects) assert.ok(kinds.has(fx.kind), `${id} fx kind`);
    if (c.up && c.up.effects) for (const fx of c.up.effects) assert.ok(kinds.has(fx.kind), `${id}+ fx kind`);
  }
}
{
  const VFX_KINDS = new Set(['slash', 'pierce', 'blunt', 'fire', 'poison', 'void', 'ward']);
  for (const [id, c] of Object.entries(CARDS)) {
    assert(VFX_KINDS.has(c.vfx), `card ${id} missing/invalid vfx archetype: ${c.vfx}`);
  }
}
{
  // the vigil: deeds accumulate, thresholds unlock, storage is Node-safe
  _setStore(null);
  assert.equal(loadVigil().deeds.runs, 0, 'fresh vigil');
  const run = newRun(42);
  run.stats.shatters = 15;
  run.floorsClimbed = 9;
  const { vigil, newUnlocks } = commitRunToVigil(run, false);
  assert.equal(vigil.deeds.runs, 1, 'run counted');
  assert.equal(vigil.deeds.shatters, 15, 'deed stat folded in');
  assert.ok(newUnlocks.includes('card:quakeblow'), 'shatter deed pays out');
  assert.equal(commitRunToVigil(run, false).newUnlocks.length, 0, 'commit is idempotent');
  assert.equal(loadVigil().deeds.runs, 1, 'no double count');
  // a win unlocks the second aspect and the first vow
  const run2 = newRun(43);
  const w = commitRunToVigil(run2, true);
  assert.ok(w.vigil.unlocks.includes('aspect2'), 'first dawn unlocks the Ashwarden');
  assert.equal(w.vigil.vowUnlocked, 1, 'vow I offered after a win');
  assert.deepEqual(syncVigil().unlocks, w.vigil.unlocks, 'sync finds nothing more owed');
  // bequests round-trip
  setBequest(1, 7, { kind: 'gold', amount: 50 });
  assert.deepEqual(loadVigil().lastFall, { act: 1, row: 7, bequest: { kind: 'gold', amount: 50 } });
  clearBequest();
  assert.equal(loadVigil().lastFall, null, 'monument claimed and cleared');
  _setStore(null);
}
{
  // pools: base content without unlocks, unknown unlock tokens ignored
  const run = newRun(44);
  assert.deepEqual(cardPool(run, 'common'), CARD_POOLS.common);
  assert.deepEqual(relicPool(run, 'boss'), RELIC_POOLS.boss);
  const run2 = newRun(44, { unlocks: ['card:doesNotExist', 'relic:alsoNot'] });
  assert.deepEqual(cardPool(run2, 'common'), CARD_POOLS.common, 'unknown card unlock ignored');
  assert.deepEqual(relicPool(run2, 'common'), RELIC_POOLS.common, 'unknown relic unlock ignored');
}
{
  // monuments: a bequest is claimed exactly once
  const run = newRun(45, { monument: { act: 0, row: 5, bequest: { kind: 'gold', amount: 60 } } });
  const g0 = run.player.gold;
  const b = claimMonument(run);
  assert.equal(b.kind, 'gold');
  assert.equal(run.player.gold, g0 + 60, 'gold bequest paid');
  assert.equal(claimMonument(run), null, 'stone gives only once');
  const run3 = newRun(45, { monument: { act: 1, row: 3, bequest: { kind: 'card', id: 'oblivionStrike', up: true } } });
  claimMonument(run3);
  const got = run3.player.deck.find((c) => c.id === 'oblivionStrike');
  assert.ok(got && got.up, 'card bequest arrives upgraded');
}
{
  // bequestOptions offers the best of what was carried
  const run = newRun(46);
  gainRelic(run, 'duskmirror');
  gainRelic(run, 'basaltIdol');
  addCardToDeck(run, 'oblivionStrike', true);
  const opts = bequestOptions(run);
  assert.ok(opts.find((o) => o.kind === 'relic' && o.id === 'duskmirror'), 'rarest relic offered');
  assert.ok(opts.find((o) => o.kind === 'card' && o.id === 'oblivionStrike'), 'best card offered');
  assert.ok(opts.find((o) => o.kind === 'gold'), 'gold cache offered');
}
{
  // visitNode pays unlit bounties exactly once
  const run = newRun(47);
  const node = run.map.nodes.find((n) => n.row === 0);
  node.unlit = true;
  node.bounty = 20;
  const g0 = run.player.gold;
  const { type, bounty } = visitNode(run, node);
  assert.equal(type, node.type, 'true face revealed');
  assert.equal(bounty, 20);
  assert.equal(run.player.gold, g0 + 20, 'bounty paid');
  assert.equal(run.stats.unlitVisited, 1, 'deed counted');
  assert.equal(visitNode(run, node).bounty, 0, 'a lit lantern pays nothing');
}
{
  // aspects: the Ashwarden is a distinct kit
  assert.equal(ASPECTS.length, 2, 'two aspects');
  assert.equal(ASPECTS[0].id, 'duskblade');
  assert.equal(ASPECTS[1].id, 'ashwarden');
  const ash = newRun(50, { aspect: 1 });
  assert.equal(ash.player.maxHp, 80, 'Ashwarden is tankier');
  assert.equal(ash.player.hp, 80);
  assert.ok(ash.player.relics.includes('ashenCore'), 'Ashwarden starts with the Ashen Core');
  assert.equal(ash.art, 'ashfall', 'Ashwarden favors Ashfall');
  assert.equal(ash.player.deck.length, 10, 'Ashwarden deck is 10');
  assert.ok(ash.player.deck.some((c) => c.id === 'ashBite'), 'Ashwarden brings Ashbite');
  assert.ok(RELICS.ashenCore, 'Ashen Core relic exists');
  // ashenCore steeps every enemy in Smolder at the bell
  const acb = startCombat(ash, ['sporeling', 'sporeling']);
  for (const e of acb.enemies) assert.ok(e.statuses.poison >= 3, 'Ashen Core smolders the field');
  // an out-of-range aspect index is clamped, never a crash
  assert.equal(newRun(50, { aspect: 9 }).aspect, ASPECTS.length - 1, 'aspect clamped');
}
{
  // vows: the difficulty ladder stacks cumulatively
  assert.equal(VOWS.length, 5, 'five vows');
  assert.equal(vowMods({ vow: 0 }).hpMult, 1, 'no vow, no burden');
  assert.ok(Math.abs(vowMods({ vow: 1 }).hpMult - 1.12) < 1e-9, 'Vow I hardens the glass');
  assert.equal(vowMods({ vow: 2 }).enemyDmgBonus, 1, 'Vow II sharpens their blows');
  assert.equal(vowMods({ vow: 3 }).bossFacetDelta, 1, 'Vow III armors the boss');
  assert.equal(vowMods({ vow: 4 }).startHex, true, 'Vow IV marks the climber');
  assert.equal(vowMods({ vow: 5 }).restHealFrac, 0.2, 'Vow V wanes the rest');
  assert.equal(vowMods({ vow: 9 }).startHex, true, 'vow level clamps to the ladder');
  // Vow II adds exactly +1 to what an enemy hits for (mirrored in the intent preview)
  const base = newRun(51), hard = newRun(51, { vow: 2 });
  const eb = startCombat(base, ['sporeling']), eh = startCombat(hard, ['sporeling']);
  const db = previewEnemyDmg(base, eb, eb.enemies[0]), dh = previewEnemyDmg(hard, eh, eh.enemies[0]);
  if (db) assert.equal(dh.dmg, db.dmg + 1, 'Vow II preview shows +1 damage');
  // Vow III thickens the boss facet gauge by one
  const bb = newRun(52), bh = newRun(52, { vow: 3 });
  const cbb = startCombat(bb, ['rootheart'], 'boss'), cbh = startCombat(bh, ['rootheart'], 'boss');
  assert.equal(cbh.enemies[0].facetMax, cbb.enemies[0].facetMax + 1, 'Vow III boss holds one more facet');
  // Vow IV seeds a Hex into the starting deck
  const marked = newRun(53, { vow: 4 });
  assert.equal(marked.player.deck.length, 11, 'the marked climb one card heavier');
  assert.ok(marked.player.deck.some((c) => c.id === 'hex'), 'and it is a Hex');
  // Vow V drains the campfire
  assert.ok(restHealFrac(newRun(54, { vow: 5 })) <= 0.2, 'Vow V rest heals no more than a fifth');
}
{
  // boons: every Lamplighter gift resolves cleanly through the event-op executor
  for (const [id, boon] of Object.entries(BOONS)) {
    const run = newRun(55);
    assert.doesNotThrow(() => applyEventOps(run, boon.ops), `boon ${id} applies`);
  }
  const purse = newRun(55);
  const g0 = purse.player.gold;
  applyEventOps(purse, BOONS.fullPurse.ops);
  assert.equal(purse.player.gold, g0 + 120, 'A Full Purse pays out');
  const glass = newRun(55);
  const hp0 = glass.player.maxHp;
  applyEventOps(glass, BOONS.temperedGlass.ops);
  assert.equal(glass.player.maxHp, hp0 + 14, 'Tempered Glass raises Max HP');
}
{
  // monuments in the map: the last fall stands in its own act, nowhere else
  const run = newRun(56, { monument: { act: 0, row: 6, bequest: { kind: 'gold', amount: 60 } } });
  const mons = run.map.nodes.filter((n) => n.type === 'monument');
  assert.equal(mons.length, 1, 'exactly one monument node');
  const m = mons[0];
  assert.ok(m.row > 0 && m.row < MAP_ROWS - 2 && m.row !== 8, 'monument on a lawful row');
  assert.ok(!m.unlit, 'a monument is never hidden');
  // a monument bound to a later act does not litter this one
  const early = newRun(56, { monument: { act: 2, row: 5, bequest: { kind: 'gold', amount: 60 } } });
  assert.equal(early.map.nodes.filter((n) => n.type === 'monument').length, 0, 'act-2 monument absent on act 0');
  // and the bequest→setBequest→next-run→claim loop pays exactly once
  _setStore(null);
  const fallen = newRun(56);
  fallen.player.gold = 50;
  const offer = bequestOptions(fallen).find((o) => o.kind === 'gold');
  setBequest(0, 6, offer);
  const next = newRun(57, { monument: loadVigil().lastFall });
  const g0 = next.player.gold;
  const claimed = claimMonument(next);
  assert.equal(claimed.kind, 'gold', 'gold recovered from the stone');
  assert.equal(next.player.gold, g0 + offer.amount, 'the exact cache returns');
  assert.equal(claimMonument(next), null, 'the stone gives once');
  clearBequest();
  _setStore(null);
}
{
  // pile ceremony queue payloads: discardHand uids, reshuffle n, toDiscard uid
  const { run, cb } = freshCombat();
  forceHand(run, cb, ['defend', 'strike', 'defend']);
  const H = cb.hand.length;
  const handUids = cb.hand.map((c) => c.uid);
  cb.queue.length = 0;
  endTurn(run, cb);
  const dh = cb.queue.filter((e) => e.t === 'discardHand');
  assert.equal(dh.length, 1, 'one discardHand event');
  assert.equal(dh[0].uids.length, H, 'discardHand carries hand size');
  assert.deepEqual(dh[0].uids, handUids, 'discardHand uids match pre-clear hand');

  const { run: r2, cb: c2 } = freshCombat();
  c2.draw = [];
  c2.discard = [makeCard(r2, 'strike'), makeCard(r2, 'defend'), makeCard(r2, 'strike')];
  const nDiscard = c2.discard.length;
  c2.queue.length = 0;
  drawCards(r2, c2, 1);
  const rs = c2.queue.find((e) => e.t === 'reshuffle');
  assert.ok(rs && Number.isInteger(rs.n) && rs.n > 0, 'reshuffle carries n');
  assert.equal(rs.n, nDiscard, 'reshuffle n is pre-move discard size');

  const { run: r3, cb: c3 } = freshCombat();
  forceHand(r3, c3, ['defend']);
  const playUid = c3.hand[0].uid;
  c3.queue.length = 0;
  assert.ok(playCard(r3, c3, playUid), 'defend plays');
  assert.ok(c3.queue.some((e) => e.t === 'toDiscard' && e.uid === playUid), 'non-exhaust skill emits toDiscard');
}

// ---- monte-carlo: random agent plays full runs -----------------------------
function randomAgentRun(seed) {
  // a real climber picks an aspect, swears some vows, takes a boon, and may
  // walk into a monument left by a past self — exercise all of it
  const aspect = seed % 2;
  const vow = seed % 3;
  const boonIds = Object.keys(BOONS);
  const monument = seed % 4 === 0 ? { act: 0, row: 5, bequest: { kind: 'gold', amount: 40 } } : null;
  const run = newRun(seed, { aspect, vow, monument });
  applyEventOps(run, BOONS[boonIds[seed % boonIds.length]].ops);
  const rnd = (() => { let s = seed ^ 0x9e3779b9; const r = () => { s = (s * 1664525 + 1013904223) | 0; return ((s >>> 0) / 4294967296); }; return r; })();
  const choice = (arr) => arr[Math.floor(rnd() * arr.length)];
  let guard = 0;
  while (guard++ < 400) {
    const options = availableNodes(run);
    assert.ok(options.length > 0, 'always somewhere to go');
    const node = choice(options);
    const { type } = visitNode(run, node);
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
        // the agent kindles and uses its art sometimes, like a player would
        if (!cb.over && cb.hand.length && rnd() < 0.25) kindleFromHand(run, cb, choice(cb.hand).uid);
        if (!cb.over && canUseArt(run, cb) && rnd() < 0.4) useArt(run, cb);
        if (!cb.over) endTurn(run, cb);
        assert.ok(cb.embers >= 0 && cb.embers <= cb.emberCap, 'embers in range');
        for (const e of cb.enemies) if (e.hp > 0) assert.ok(e.chips < e.facetMax, 'chips below threshold');
        cb.queue.length = 0; // drain
      }
      assert.ok(cb.over, `combat terminates (${enc.join()},turns=${turnGuard})`);
      if (cb.result === 'loss') return { dead: true, run };
      const rw = genCombatRewards(run, type, cb.affix);
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
    } else if (type === 'monument') {
      claimMonument(run); // recover what a past self left in the stone
    }
    assert.ok(run.player.hp > 0, 'alive after node');
    assert.ok(run.player.hp <= run.player.maxHp, 'hp <= maxHp');
  }
  throw new Error('run did not terminate');
}

// ---- asset manifest --------------------------------------------------------
// Every content id ships its painted art, and no orphaned file lingers after a
// rename. Runs both directions so a card/relic/enemy rename that forgets the
// PNG (or the data key) fails here instead of falling back to SVG in the wild.
{
  const assetIds = (cat) => new Set(
    readdirSync(new URL(`../src/assets/${cat}`, import.meta.url))
      .filter((f) => /\.(png|jpg)$/i.test(f))
      .map((f) => f.replace(/\.(png|jpg)$/i, '')),
  );
  const checkManifest = (cat, expectedIds) => {
    const have = assetIds(cat);
    const want = new Set(expectedIds);
    for (const id of want) assert.ok(have.has(id), `asset missing: src/assets/${cat}/${id} (data id has no art)`);
    for (const id of have) assert.ok(want.has(id), `orphan asset: src/assets/${cat}/${id} (art has no data id)`);
  };
  checkManifest('cards', Object.keys(CARDS));
  checkManifest('enemies', Object.keys(ENEMIES));
  checkManifest('relics', Object.keys(RELICS));
  checkManifest('potions', Object.keys(POTIONS));
  checkManifest('events', Object.keys(EVENTS));
  checkManifest('omens', Object.keys(OMENS));
  checkManifest('boons', Object.keys(BOONS));
  checkManifest('arts', Object.keys(ARTS));
  checkManifest('heroes', ASPECTS.map((a) => a.id));
  checkManifest('stage', [1, 2, 3].flatMap((a) => ['backdrop', 'mid', 'ledge'].map((l) => `act${a}-${l}`)));
  checkManifest('props', ['campfire', 'chest', 'chest-open', 'merchant']);
  checkManifest('statuses', Object.keys(STATUS_INFO));
  checkManifest('deeds', Object.keys(DEEDS));
  checkManifest('bequests', ['relic', 'card', 'gold']);
  checkManifest('meta', ['fallen', 'ascended', 'monument-node']);
}

// ---- pile chrome helpers (pure) ----
{
  assert.equal(pileTier(0), 0);
  assert.equal(pileTier(1), 1);
  assert.equal(pileTier(4), 4);
  assert.equal(pileTier(5), 5);
  assert.equal(pileTier(99), 5);
  assert.equal(pileTier(-1), 0);

  assert.equal(pileFanLayers(0), 0);
  assert.equal(pileFanLayers(1), 1);
  assert.equal(pileFanLayers(8), 8);
  assert.equal(pileFanLayers(99), PILE_FAN_MAX_LAYERS);
  // 3 cards @ 5° → ±5°
  assert.equal(pileFanAngleDeg(0, 3), -5);
  assert.equal(pileFanAngleDeg(1, 3), 0);
  assert.equal(pileFanAngleDeg(2, 3), 5);
  // 7 cards still at preferred 5° (span 30)
  assert.equal(pileFanAngleDeg(0, 7), -15);
  assert.equal(pileFanAngleDeg(6, 7), 15);
  // 16 cards: average step = 30/15 = 2°
  assert.equal(pileFanAngleDeg(0, 16), -15);
  assert.equal(pileFanAngleDeg(8, 16), 1);
  assert.equal(pileFanAngleDeg(15, 16), 15);
  const layersCap = pileFanLayers(99);
  assert.ok(
    pileFanAngleDeg(layersCap - 1, layersCap) - pileFanAngleDeg(0, layersCap) <= PILE_FAN_MAX_DEG + 1e-9
  );

  const s1 = flightSchedule(1, 400);
  assert.ok(s1.awaitMs <= 400 && s1.awaitMs >= 200);
  const s10 = flightSchedule(10, 400);
  assert.ok(s10.stagger <= s1.stagger || s10.stagger <= 48);
  assert.ok(s10.awaitMs <= 480, 'large n stays near budget');
  assert.ok(s10.stagger >= 8);
  assert.deepEqual(PILE_IDS, ['draw', 'discard', 'ashes']);
}

// ---- battlefield layout schema (spec 2026-07-06-battlefield-editor-design) ----
{
  const shapes = ['phone-portrait', 'phone-landscape', 'pad-portrait', 'pad-landscape', 'desktop-landscape'];
  for (const sh of shapes) {
    const L = bfResolve(sh);
    assert.ok(Number.isFinite(L.groundY) && L.groundY > 0, `bf: ${sh} groundY`);
    assert.ok(Number.isFinite(L.ledgeLip), `bf: ${sh} ledgeLip`);
    for (const k of ['x', 'w', 'h']) assert.ok(Number.isFinite(L.hero[k]), `bf: ${sh} hero.${k}`);
    assert.ok(Number.isFinite(bfHeroY(L)), `bf: ${sh} hero.y`);
    for (const n of [1, 2, 3]) {
      const slots = bfSlots(L, n);
      assert.equal(slots.length, n, `bf: ${sh} slots(${n})`);
      for (const s of slots) assert.ok(Number.isFinite(s.x) && s.s > 0, `bf: ${sh} slots(${n}) entry`);
    }
    for (const layer of ['backdrop', 'mid', 'ledge']) {
      for (const k of ['h', 'y', 'x', 'zoom', 'posX', 'posY', 'opacity', 'drift']) {
        assert.ok(Number.isFinite(L.layers[layer][k]), `bf: ${sh} layers.${layer}.${k}`);
      }
    }
    for (const t of ['normal', 'elite', 'boss']) assert.ok(L.shared.sizes[t] > 0, `bf: ${sh} sizes.${t}`);
  }
  for (const key of Object.keys(ENEMIES)) {
    const a = bfActor('enemies', key);
    assert.ok(Number.isFinite(a.scale) && Number.isFinite(a.footY), `bf: enemy actor ${key}`);
  }
  for (const a of ASPECTS) {
    const h = bfActor('heroes', a.id);
    assert.ok(Number.isFinite(h.scale) && Number.isFinite(h.footY), `bf: hero actor ${a.id}`);
  }
  // slot interpolation fallback: a count with no authored formation still lays out
  assert.equal(bfSlots(bfResolve('pad-landscape'), 4).length, 4, 'bf: slot fallback');
  // clamp guard: absurd tier sizes are no longer capped to the stage frame
  const L = bfResolve('pad-landscape');
  _setBF({ ...bfRaw(), shared: { ...bfRaw().shared, sizes: { normal: 99999, elite: 99999, boss: 99999 } } });
  assert.equal(bfEnemySize(bfResolve('pad-landscape'), 'duskfang', 'normal', { x: 0, s: 1 }, 1180, 820),
    Math.round(99999 * bfActor('enemies', 'duskfang').scale), 'bf: no stage size clamp');
  // depth: lower slot lift draws in front
  assert.deepEqual(bfEnemyZOrder([{ y: 40 }, { y: 0 }], ['a', 'b']), [1, 2], 'bf: enemy z-order by bottom');
  assert.equal(bfEnemyFootY({ footY: 5 }, 'duskfang'), 5, 'bf: slot footY override');
  assert.equal(bfEnemyFootY({}, 'duskfang'), bfActor('enemies', 'duskfang').footY, 'bf: shared footY fallback');
  assert.equal(bfEnemyFootX({ footX: 12 }, 'duskfang'), 12, 'bf: slot footX override');
  assert.equal(bfEnemyFootX({}, 'duskfang'), 0, 'bf: shared footX default');
  _setBF({ ...bfRaw(), shapes: { 'pad-landscape': { hero: { y: 12 } } } });
  assert.equal(bfHeroY(bfResolve('pad-landscape', 0)), 12, 'bf: hero.y pad-landscape shape override');
  _setBF({ ...bfRaw(), shapes: { 'desktop-landscape': { hero: { y: 24 } } } });
  assert.equal(bfHeroY(bfResolve('desktop-landscape', 0)), 24, 'bf: hero.y desktop shape override');
  _setBF(null);
  // act layer merges per shape (after base + shape)
  const raw = bfRaw();
  const baseGY = bfResolve('desktop-landscape', 0).groundY;
  _setBF({
    ...raw,
    shapes: {
      ...raw.shapes,
      'desktop-landscape': {
        ...raw.shapes['desktop-landscape'],
        acts: { ...raw.shapes['desktop-landscape']?.acts, 1: { groundY: baseGY + 42 } },
      },
    },
  });
  assert.equal(bfResolve('desktop-landscape', 0).groundY, baseGY, 'bf: act override does not leak to other acts');
  assert.equal(bfResolve('desktop-landscape', 1).groundY, baseGY + 42, 'bf: act override applies to that act');
  assert.equal(bfResolve('phone-portrait', 1).groundY, bfResolve('phone-portrait', 0).groundY, 'bf: act override does not leak across shapes');
  _setBF(null);
  assert.equal(bfResolve('pad-landscape').groundY, L.groundY, 'bf: _setBF(null) restores the file');
  // serializer: valid, deterministic, and a true round-trip
  assert.deepEqual(validateBF(bfRaw(), { enemies: Object.keys(ENEMIES), heroes: ASPECTS.map((a) => a.id) }), [], 'bf: file validates');
  const src1 = serializeBF(bfRaw());
  assert.ok(src1.startsWith('// Battlefield layout'), 'bf: serialized header');
  const mod = await import(`data:text/javascript,${encodeURIComponent(src1)}`);
  assert.equal(serializeBF(mod.BF), src1, 'bf: serialize(import(serialize(BF))) is byte-identical');
  assert.ok(validateBF({ base: {} }).length > 0, 'bf: broken layout rejected');
}

// ---- char-meta table (?charedit=1) -------------------------------------------
{
  const {
    CHAR_META, CHAR_LAYOUT_DEFAULT, CHAR_SHADOW_DEFAULT, CHAR_AIM_DEFAULT,
    charLayout, charShadow, charMesh, charAim, _setCharMeta,
  } = await import('../src/char-meta.js');
  const { serializeCharMeta, validateCharMeta, pruneCharMeta, AIM_STYLES } = await import('../src/dev/char-serialize.js');
  assert.equal(validateCharMeta(CHAR_META, {
    heroes: ASPECTS.map((a) => a.id), enemies: Object.keys(ENEMIES),
  }).length, 0, 'char-meta: table validates');
  const lay = charLayout('duskblade');
  assert.equal(lay.footY, -30, 'char-meta: duskblade footY migrated');
  const c = charShadow('duskblade');
  assert.ok(c.sy > 0 && c.sy < 1, 'char-meta: duskblade shadow flattened');
  assert.equal(charLayout('sporeling').scale, 0.62, 'char-meta: sporeling scale migrated');
  assert.deepEqual(charMesh('duskblade'), {}, 'char-meta: no mesh override by default');
  assert.ok(AIM_STYLES.includes(CHAR_AIM_DEFAULT.style), 'char-meta: aim default style valid');
  assert.ok(Number.isInteger(CHAR_AIM_DEFAULT.beams) && CHAR_AIM_DEFAULT.beams >= 1 && CHAR_AIM_DEFAULT.beams <= 4, 'char-meta: aim default beams in 1..4');
  assert.ok(Number.isInteger(CHAR_AIM_DEFAULT.dashes) && CHAR_AIM_DEFAULT.dashes >= 1 && CHAR_AIM_DEFAULT.dashes <= 4, 'char-meta: aim default dashes in 1..4');
  assert.ok(Number.isFinite(CHAR_AIM_DEFAULT.width) && CHAR_AIM_DEFAULT.width >= 0.006 && CHAR_AIM_DEFAULT.width <= 0.06, 'char-meta: aim default width in range');
  assert.deepEqual(charAim('sporeling'), { ...CHAR_AIM_DEFAULT }, 'char-meta: aim inherits global');
  assert.equal(charAim('sporeling').beams, CHAR_AIM_DEFAULT.beams, 'char-meta: aim beams inherit');
  assert.equal(charAim('sporeling').dashes, CHAR_AIM_DEFAULT.dashes, 'char-meta: aim dashes inherit');
  assert.equal(charAim('sporeling').width, CHAR_AIM_DEFAULT.width, 'char-meta: aim width inherit');
  _setCharMeta({ ...CHAR_META, sporeling: { ...(CHAR_META.sporeling || {}), aim: { style: 'chase', speed: 2 } } }, { silent: true });
  assert.equal(charAim('sporeling').style, 'chase', 'char-meta: aim style override');
  assert.equal(charAim('sporeling').color, CHAR_AIM_DEFAULT.color, 'char-meta: aim color inherits');
  _setCharMeta({ ...CHAR_META, sporeling: { ...(CHAR_META.sporeling || {}), aim: { beams: 3, dashes: 4, width: 0.03 } } }, { silent: true });
  assert.equal(charAim('sporeling').beams, 3, 'char-meta: aim beams override');
  assert.equal(charAim('sporeling').dashes, 4, 'char-meta: aim dashes override');
  assert.equal(charAim('sporeling').width, 0.03, 'char-meta: aim width override');
  assert.equal(charAim('sporeling').style, CHAR_AIM_DEFAULT.style, 'char-meta: aim style still inherits when only counts overridden');
  _setCharMeta(CHAR_META, { silent: true });
  assert.ok(validateCharMeta({ duskblade: { aim: { style: 'nope' } } }, { heroes: ASPECTS.map((a) => a.id), enemies: [] }).length > 0, 'char-meta: bad aim style rejected');
  assert.ok(validateCharMeta({ duskblade: { aim: { beams: 0 } } }, { heroes: ASPECTS.map((a) => a.id), enemies: [] }).length > 0, 'char-meta: beams 0 rejected');
  assert.ok(validateCharMeta({ duskblade: { aim: { dashes: 5 } } }, { heroes: ASPECTS.map((a) => a.id), enemies: [] }).length > 0, 'char-meta: dashes 5 rejected');
  assert.ok(validateCharMeta({ duskblade: { aim: { beams: 2.5 } } }, { heroes: ASPECTS.map((a) => a.id), enemies: [] }).length > 0, 'char-meta: beams non-int rejected');
  assert.ok(validateCharMeta({ duskblade: { aim: { width: 0.001 } } }, { heroes: ASPECTS.map((a) => a.id), enemies: [] }).length > 0, 'char-meta: width too thin rejected');
  assert.ok(validateCharMeta({ duskblade: { aim: { width: 0.1 } } }, { heroes: ASPECTS.map((a) => a.id), enemies: [] }).length > 0, 'char-meta: width too thick rejected');
  const prunedAim = pruneCharMeta({ x: { aim: { ...CHAR_AIM_DEFAULT } } }, { layout: CHAR_LAYOUT_DEFAULT, aim: CHAR_AIM_DEFAULT });
  assert.ok(!prunedAim.x, 'char-meta: aim equal to default pruned');
  const prunedCounts = pruneCharMeta(
    { x: { aim: { ...CHAR_AIM_DEFAULT } } },
    { layout: CHAR_LAYOUT_DEFAULT, aim: CHAR_AIM_DEFAULT },
  );
  assert.ok(!prunedCounts.x, 'char-meta: aim equal to default (incl counts) pruned');
  const src = serializeCharMeta(CHAR_META, { layout: CHAR_LAYOUT_DEFAULT, shadow: CHAR_SHADOW_DEFAULT, aim: CHAR_AIM_DEFAULT });
  assert.ok(src.includes('export const CHAR_META'), 'char-meta: serialized');
  assert.ok(src.includes('export const CHAR_AIM_DEFAULT'), 'char-meta: aim default serialized');
  assert.ok(new RegExp(`beams:\\s*${CHAR_AIM_DEFAULT.beams}`).test(src), 'char-meta: beams in CHAR_AIM_DEFAULT serialize');
  assert.ok(new RegExp(`dashes:\\s*${CHAR_AIM_DEFAULT.dashes}`).test(src), 'char-meta: dashes in CHAR_AIM_DEFAULT serialize');
  assert.ok(/width:\s*/.test(src), 'char-meta: width in CHAR_AIM_DEFAULT serialize');
  assert.ok(validateCharMeta({ nope: { scale: 1 } }, { heroes: [], enemies: [] }).length > 0, 'char-meta: unknown id rejected');
  assert.ok(!pruneCharMeta({ x: { scale: 1 } }, { layout: CHAR_LAYOUT_DEFAULT }).x, 'char-meta: default scale pruned');
  // bfActor reads char-meta, not BF.shared
  assert.equal(bfActor('heroes', 'duskblade').footY, -30, 'bfActor: from char-meta');
  assert.equal(bfActor('enemies', 'leviathan').scale, 4, 'bfActor: leviathan scale from char-meta');
}

// ---- char feet scan (auto-detect ox/oy) --------------------------------------
{
  const { containBottom, feetFromAlpha, feetToOriginPct } = await import('../src/dev/char-feet-scan.js');
  const box = containBottom(100, 200, 100, 200);
  assert.equal(box.ox, 0, 'feet-scan: full-bleed ox');
  assert.equal(box.oy, 0, 'feet-scan: full-bleed oy');
  // letterbox: tall art in wide box → bottom-aligned
  const lb = containBottom(50, 100, 200, 100);
  assert.ok(Math.abs(lb.s - 1) < 1e-9, 'feet-scan: letterbox scale');
  assert.equal(lb.oy, 0, 'feet-scan: bottom-aligned');
  assert.equal(lb.ox, 75, 'feet-scan: centered X');

  // 8×8: opaque L-shape with a thin tip at bottom and a wider foot row above
  const w = 8, h = 8;
  const data = new Uint8ClampedArray(w * h * 4);
  const set = (x, y) => { const i = (y * w + x) * 4; data[i] = 255; data[i + 3] = 255; };
  // body mass mid
  for (let y = 1; y <= 4; y++) for (let x = 2; x <= 5; x++) set(x, y);
  // wider foot row at y=5 (span 4)
  for (let x = 2; x <= 5; x++) set(x, 5);
  // single-pixel cape tip at y=7 (should be skipped for footRow)
  set(3, 7);
  const feet = feetFromAlpha(data, w, h);
  assert.ok(feet, 'feet-scan: found feet');
  assert.equal(feet.footRow, 5, 'feet-scan: skips thin tip');
  assert.ok(feet.footX >= 2 && feet.footX <= 5, 'feet-scan: footX in span');

  const pct = feetToOriginPct({ footX: 50, footRow: 199 }, 100, 200, 100, 200);
  assert.equal(pct.ox, 50, 'feet-scan: origin ox');
  assert.equal(pct.oy, 99.5, 'feet-scan: origin oy near bottom');
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
