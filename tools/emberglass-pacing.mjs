import { PROGRESSION, QUEST_IDS } from '../src/data.js';
import {
  newRun, cardData, drawCards, playCard, startCombat, genMap, rollEncounter,
  visitNode, gainEmbers, genShop, buyQuestItem, rollCardReward, addCardToDeck,
  markShadeFall, claimMonument, applyBoon, payHollowPrice, stageHollowExit,
} from '../src/engine.js';
import {
  _setStore, _setRng, loadVigil, questSnapshot, revealSnapshot,
  commitRunToVigil, commitRunEnd, setBequest, clearBequest,
} from '../src/vigil.js';

const N = 2000;
const MAX_WINS = 100;
const POLICY = {
  guided: {
    shadeChance: 0.5, usurperChance: 0.5,
    pageChance: 1, visitUnlitChance: 1,
  },
  unguided: {
    palePostLensChance: 0.1,
    shadeChance: 0.12, usurperChance: 0.08,
    pageChance: 0.15, visitUnlitChance: 0.25,
  },
};

function mulberry32(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const active = (q) => q && (q.state === 'armed' || q.state === 'revealed');

function killWithRealCombat(run, enemyId, kind = 'monster') {
  const cb = startCombat(run, [enemyId], kind);
  cb.enemies[0].hp = 1;
  cb.player.energy = 99;
  for (let i = 0; cb.result !== 'win' && i < 20; i++) {
    const attack = cb.hand.find((c) => cardData(c).type === 'attack' && !cardData(c).unplayable);
    if (!attack) {
      drawCards(run, cb, 1);
      continue;
    }
    if (!playCard(run, cb, attack.uid, 0)) {
      throw new Error('pacing combat fixture could not play an attack against ' + enemyId);
    }
  }
  if (cb.result !== 'win') throw new Error('pacing combat fixture failed against ' + enemyId);
  return cb;
}

function maybeCreateStandingFall(v, mode, rng, seed) {
  const p = POLICY[mode];
  if (!active(v.quests.ownShade) || v.lastFall?.standing || rng() >= p.shadeChance) return v;
  const fall = newRun(seed, {
    quests: questSnapshot(v), shards: v.shards, unlocks: v.unlocks,
    reveals: revealSnapshot(v), monument: v.lastFall,
  });
  fall.act = 1;
  if (!markShadeFall(fall, 1, 7)) throw new Error('Shade fall hook did not arm');
  commitRunToVigil(fall, false);
  commitRunEnd(fall, 'death');
  setBequest(1, 7, { kind: 'gold', amount: 50 });
  return loadVigil();
}

function pursuePale(run, mode, rng) {
  const q = run.quests.paleOnes;
  if (!active(q)) return;
  const lens = run.unlocks.includes('insight:witchlightLens');
  if (!lens) {
    const node = run.map.nodes.find((n) => n.type === 'monster');
    const ids = rollEncounter(run, 'monster', node?.row || 0, node);
    const pale = ids.find((id) => id.startsWith('pale'));
    if (!pale) throw new Error('guaranteed pre-Lens Pale encounter missing');
    killWithRealCombat(run, pale);
    return;
  }
  for (const act of [0, 1]) {
    run.act = act;
    run.map = genMap(run);
    const node = run.map.nodes.find((n) => n.questVariantId);
    if (!node) continue;
    if (mode === 'guided' || rng() < POLICY.unguided.palePostLensChance) {
      killWithRealCombat(run, rollEncounter(run, 'monster', node.row, node)[0]);
    }
  }
}

function pursueShade(run, vigil) {
  if (!active(run.quests.ownShade) || !vigil.lastFall?.standing) return;
  const duel = claimMonument(run);
  if (!duel || duel.kind !== 'shadeDuel') throw new Error('standing monument did not create a duel');
  clearBequest();
  killWithRealCombat(run, duel.variantId);
}

function pursueUsurper(run, mode, rng) {
  if (!active(run.quests.usurper) || rng() >= POLICY[mode].usurperChance) return;
  run.act = PROGRESSION.emberglass.usurper.minShopAct;
  const shop = genShop(run);
  if (!shop.questItems.some((item) => item.id === 'flamelessLantern')) {
    throw new Error('Usurper shop item missing');
  }
  run.player.gold = Math.max(run.player.gold, PROGRESSION.emberglass.usurper.price);
  if (!buyQuestItem(run, 'flamelessLantern').ok) throw new Error('Usurper purchase failed');
}

function pursuePage(run, mode, rng) {
  if (!active(run.quests.unreadablePage) || rng() >= POLICY[mode].pageChance) return;
  rollCardReward(run, 'normal');
  const second = rollCardReward(run, 'normal');
  if (!second.includes('unreadablePage')) throw new Error('second reward did not offer Page');
  addCardToDeck(run, 'unreadablePage');
}

function findUnlit(run) {
  for (const act of [0, 1, 2]) {
    run.act = act;
    run.map = genMap(run);
    const node = run.map.nodes.find((n) => n.unlit);
    if (node) return node;
  }
  throw new Error('eligible run generated no unlit node');
}

function pursueHollow(run, mode, rng) {
  const q = run.quests.hollowLamplighter;
  if (!active(q)) return;
  if (q.memory.emberDebt > 0) {
    const cb = startCombat(run, ['sporeling']);
    gainEmbers(run, cb, q.memory.emberDebt);
    return;
  }
  if (!run.questScratch.hollowLamplighter?.due ||
      rng() >= POLICY[mode].visitUnlitChance) return;
  const node = findUnlit(run);
  const visit = visitNode(run, node);
  if (!visit.hollow || !run.pendingHollow) throw new Error('Hollow visit hook failed');
  if (q.progress === 1) run.player.gold = Math.max(run.player.gold, PROGRESSION.emberglass.hollowLamplighter.gold);
  if (q.progress === 2) {
    run.player.maxHp = Math.max(run.player.maxHp,
      PROGRESSION.emberglass.hollowLamplighter.minMaxHpAfter + PROGRESSION.emberglass.hollowLamplighter.maxHp);
    run.player.hp = run.player.maxHp;
  }
  if (q.progress === 3 && !run.boonReceipt) applyBoon(run, 'fullPurse');
  const paid = payHollowPrice(run);
  if (!paid.ok) throw new Error('Hollow price failed at progress ' + q.progress);
  if (paid.deferred) {
    const cb = startCombat(run, ['sporeling']);
    gainEmbers(run, cb, PROGRESSION.emberglass.hollowLamplighter.emberDebt);
  }
  if (!stageHollowExit(run)) throw new Error('Hollow exit staging failed');
}

function finishSummit(run) {
  run.act = 2;
  run.map = genMap(run);
  const [bossId] = rollEncounter(run, 'boss', 14);
  killWithRealCombat(run, bossId, 'boss');
}

function simulate(mode, seed) {
  _setStore(null);
  const rng = mulberry32(seed);
  _setRng(mulberry32(seed ^ 0x5f3759df));
  for (let win = 1; win <= MAX_WINS; win++) {
    let v = loadVigil();
    v = maybeCreateStandingFall(v, mode, rng, seed * 10000 + win * 2);
    const run = newRun(seed * 10000 + win * 2 + 1, {
      quests: questSnapshot(v), shards: v.shards, unlocks: v.unlocks,
      reveals: revealSnapshot(v), monument: v.lastFall,
    });
    pursuePale(run, mode, rng);
    pursueShade(run, v);
    pursueUsurper(run, mode, rng);
    pursuePage(run, mode, rng);
    pursueHollow(run, mode, rng);
    finishSummit(run);
    commitRunToVigil(run, true);
    const out = commitRunEnd(run, 'win');
    if (out.vigil.shards.length === QUEST_IDS.length) return out.vigil.deeds.wins;
  }
  return null;
}

const percentile = (xs, p) => xs[Math.floor((xs.length - 1) * p)];
function report(mode) {
  const raw = Array.from({ length: N }, (_, i) => simulate(mode, 20260709 + i));
  const wins = raw.filter(Number.isFinite).sort((a, b) => a - b);
  const result = {
    complete: wins.length,
    p10: percentile(wins, 0.1),
    median: percentile(wins, 0.5),
    p90: percentile(wins, 0.9),
  };
  console.log(mode + ': median=' + result.median + ' p10=' + result.p10 +
    ' p90=' + result.p90 + ' complete=' + result.complete + '/' + N);
  return result;
}

const guided = report('guided');
const unguided = report('unguided');
const pass =
  guided.complete >= 1980 && guided.median >= 18 && guided.median <= 24 &&
  unguided.complete >= 1980 && unguided.median >= 40 && unguided.median <= 65;
_setRng(null);
_setStore(null);
if (!pass) process.exitCode = 1;
