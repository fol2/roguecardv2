// The heuristic policy for Proving Grounds. Combat choices use the same pure
// preview mirrors as the UI; deliberation never touches runRng, the draw pile,
// or any other hidden information (KTD7/KTD8).
import {
  canKindle,
  canPlay,
  canUseArt,
  cardData,
  effCost,
  previewEnemyDmg,
  previewPlay,
} from '../../../src/engine.js';
import { ARTS, CARDS, POTIONS, RELICS } from '../../../src/data.js';

// One exported tuning surface. The initial table favours survival first,
// efficient damage second; U5's fixed smoke set is the formal tuning gate.
export const WEIGHTS = Object.freeze({
  lethal: 1000,
  dmg: 1.0,
  overkill: 0.45,
  shatter: 15,
  chip: 2.75,
  block: 1.45,
  cost: 1.3,
  draw: 4.0,
  energy: 6.5,
  ember: 2.5,
  heal: 1.4,
  selfHpLoss: 2.4,
  vulnerable: 6.0,
  weak: 7.0,
  poison: 2.2,
  enemyStrDown: 5.5,
  selfStr: 10,
  selfDex: 8,
  selfMetallicize: 10,
  selfRegen: 8,
  selfRitual: 13,
  selfBarricade: 9,
  selfEnergized: 9,
  selfVenomous: 8,
  selfNightSight: 7,
  selfEmberflow: 8,
  selfBeacon: 5,
  kindleFloor: 2,
  draftFloor: 5.5,
  largeDeck: 25,
  largeDeckStep: 0.6,
  eliteHpFloor: 0.65,
  elitePowerFloor: 27,
  restHealHp: 0.55,
  shopGold: 150,
  actTwoReserve: 75,
});

const SELF_STATUS_VALUE = Object.freeze({
  str: WEIGHTS.selfStr,
  dex: WEIGHTS.selfDex,
  metallicize: WEIGHTS.selfMetallicize,
  regen: WEIGHTS.selfRegen,
  ritual: WEIGHTS.selfRitual,
  barricade: WEIGHTS.selfBarricade,
  energized: WEIGHTS.selfEnergized,
  venomous: WEIGHTS.selfVenomous,
  nightsight: WEIGHTS.selfNightSight,
  emberflow: WEIGHTS.selfEmberflow,
  beacon: WEIGHTS.selfBeacon,
  vulnerable: -WEIGHTS.vulnerable,
  weak: -WEIGHTS.weak,
  frail: -WEIGHTS.weak,
});

const RELIC_OVERRIDES = Object.freeze({
  sweetRoot: 13,
  hollowCrown: 15,
  crownOfCinders: 18,
  crownOfTithes: 17,
  shatterersCrown: 17,
  crownOfTheHearth: 18,
  executionersSeal: 15,
  reapersBell: 15,
  prismCharm: 15,
  bellOfEndings: 15,
});

const rarityValue = (rarity) => ({ starter: 0, common: 2, uncommon: 4, rare: 7, boss: 11 }[rarity] || 0);
const nOf = (fx) => Number.isFinite(fx?.n) ? fx.n : 0;
const compareText = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

function baseDamage(d) {
  let total = 0;
  for (const fx of d.effects || []) {
    if (fx.kind === 'dmg') total += nOf(fx) * (fx.times || 1);
    else if (fx.kind === 'special' && ['leech', 'devour', 'execute', 'momentum', 'shatterEcho'].includes(fx.id)) {
      total += nOf(fx);
    }
  }
  return total * (d.target === 'allEnemies' ? 1.6 : 1);
}

function staticUtility(d) {
  let value = 0;
  for (const fx of d.effects || []) {
    if (fx.kind === 'draw') value += nOf(fx) * WEIGHTS.draw;
    else if (fx.kind === 'energy') value += nOf(fx) * WEIGHTS.energy;
    else if (fx.kind === 'ember') value += nOf(fx) * WEIGHTS.ember;
    else if (fx.kind === 'heal') value += nOf(fx) * WEIGHTS.heal;
    else if (fx.kind === 'loseHp') value -= nOf(fx) * WEIGHTS.selfHpLoss;
    else if (fx.kind === 'chip') value += nOf(fx) * WEIGHTS.chip;
    else if (fx.kind === 'status') {
      const count = fx.who === 'allEnemies' ? 1.6 : 1;
      if (fx.who === 'self') value += (SELF_STATUS_VALUE[fx.id] || 2) * nOf(fx);
      else if (fx.id === 'poison') value += WEIGHTS.poison * nOf(fx) * count;
      else if (fx.id === 'vulnerable') value += WEIGHTS.vulnerable * nOf(fx) * count;
      else if (fx.id === 'weak') value += WEIGHTS.weak * nOf(fx) * count;
      else if (fx.id === 'str' && nOf(fx) < 0) value += WEIGHTS.enemyStrDown * -nOf(fx) * count;
    } else if (fx.kind === 'special') {
      if (fx.id === 'pyreTithe') value += (fx.draw || 0) * WEIGHTS.draw;
      else if (fx.id === 'flawless') value += nOf(fx) * WEIGHTS.block;
      else if (fx.id === 'emberdance') value += nOf(fx) * 1.5;
      else if (fx.id === 'catalyst') value += 6;
      else if (fx.id === 'doubleBlock') value += 7;
      else if (fx.id === 'emberNova' || fx.id === 'phantom') value += 8;
    }
  }
  return value;
}

function staticCardValueFromData(d) {
  if (!d || d.unplayable || d.type === 'curse' || d.type === 'status') return -100;
  const cost = d.cost == null ? 4 : Math.max(0.5, d.cost);
  let block = 0;
  for (const fx of d.effects || []) if (fx.kind === 'block') block += nOf(fx);
  const core = (baseDamage(d) + block * 0.85) / cost;
  return core + staticUtility(d) + rarityValue(d.rarity) - (d.cost || 0) * 0.25;
}

// Static tables are derived from the content registry at module load, rather
// than being a second hand-maintained list of cards/relics.
export const CARD_VALUES = Object.freeze(Object.fromEntries(
  Object.entries(CARDS).map(([id, d]) => [id, staticCardValueFromData(d)]),
));

export const RELIC_VALUES = Object.freeze(Object.fromEntries(
  Object.entries(RELICS).map(([id, d]) => [id, RELIC_OVERRIDES[id] ?? (8 + rarityValue(d.rarity))]),
));

function valueOfCard(cardOrId, run) {
  if (typeof cardOrId === 'string') {
    const base = CARDS[cardOrId];
    if (!base) return -100;
    return staticCardValueFromData(base);
  }
  return staticCardValueFromData(cardData(cardOrId, run));
}

function upgradeValue(card, run) {
  const base = cardData(card, run);
  const raw = CARDS[card.id];
  return raw?.up ? staticCardValueFromData({ ...raw, ...raw.up }) - staticCardValueFromData(base) : -Infinity;
}

function bestUpgrade(run) {
  return run.player.deck
    .filter((c) => !c.up && CARDS[c.id]?.up)
    .sort((a, b) => upgradeValue(b, run) - upgradeValue(a, run) || a.uid - b.uid)[0] || null;
}

function draftFloor(run) {
  return WEIGHTS.draftFloor + Math.max(0, run.player.deck.length - WEIGHTS.largeDeck) * WEIGHTS.largeDeckStep;
}

function chooseDraft(run, ids, chooseTie) {
  if (!ids.length) return null;
  const scored = ids.map((id) => ({ id, score: valueOfCard(id, run) }));
  const topScore = Math.max(...scored.map((x) => x.score));
  if (topScore < draftFloor(run)) return null;
  return chooseTie(scored.filter((x) => x.score === topScore)).id;
}

function incomingThreat(run, cb) {
  return cb.enemies.reduce((sum, enemy) => {
    if (enemy.hp <= 0) return sum;
    const p = previewEnemyDmg(run, cb, enemy);
    return sum + (p ? p.dmg * p.times : 0);
  }, 0);
}

function targetsFor(d, cb, targetIdx) {
  if (d.target === 'allEnemies') return cb.enemies.filter((e) => e.hp > 0);
  if (d.target === 'enemy') return targetIdx == null ? [] : [cb.enemies[targetIdx]].filter(Boolean);
  return [];
}

function combatUtility(run, cb, inst, targetIdx) {
  const d = cardData(inst, run);
  const targets = targetsFor(d, cb, targetIdx);
  const expectedTurns = Math.max(1, 5 - Math.min(cb.turn, 4));
  let score = 0;
  for (const fx of d.effects || []) {
    if (fx.kind === 'draw') score += nOf(fx) * WEIGHTS.draw;
    else if (fx.kind === 'energy') score += nOf(fx) * WEIGHTS.energy;
    else if (fx.kind === 'ember') score += nOf(fx) * WEIGHTS.ember;
    else if (fx.kind === 'heal') score += Math.min(nOf(fx), run.player.maxHp - cb.player.hp) * WEIGHTS.heal;
    else if (fx.kind === 'loseHp') score -= nOf(fx) * WEIGHTS.selfHpLoss;
    else if (fx.kind === 'status') {
      if (fx.who === 'self') {
        const unit = SELF_STATUS_VALUE[fx.id] || 2;
        score += unit * nOf(fx);
      } else {
        for (const target of targets) {
          const threat = previewEnemyDmg(run, cb, target);
          const threatScale = threat ? 1 + Math.min(1, (threat.dmg * threat.times) / Math.max(1, cb.player.hp)) : 1;
          if (fx.id === 'poison') score += nOf(fx) * expectedTurns * WEIGHTS.poison;
          else if (fx.id === 'weak') score += nOf(fx) * WEIGHTS.weak * threatScale;
          else if (fx.id === 'vulnerable') score += nOf(fx) * WEIGHTS.vulnerable * threatScale;
          else if (fx.id === 'str' && nOf(fx) < 0) score += -nOf(fx) * WEIGHTS.enemyStrDown * threatScale;
        }
      }
    } else if (fx.kind === 'special') {
      if (fx.id === 'catalyst') {
        const poison = targets[0]?.statuses?.poison || 0;
        score += poison * Math.max(0, nOf(fx) - 1) * expectedTurns * WEIGHTS.poison;
      } else if (fx.id === 'pyreTithe') {
        const burnCost = cb.hand
          .filter((c) => c !== inst)
          .reduce((sum, c) => sum + Math.max(0, valueOfCard(c, run)), 0) * 0.12;
        score += (fx.draw || 0) * WEIGHTS.draw - burnCost;
      } else if (fx.id === 'doubleBlock') score += Math.min(cb.player.block, Math.max(0, incomingThreat(run, cb) - cb.player.block)) * WEIGHTS.block;
    }
  }
  return score;
}

function previewAggregate(run, cb, inst, targetIdx) {
  const d = cardData(inst, run);
  const living = cb.enemies.filter((e) => e.hp > 0);
  const targetIndexes = d.target === 'allEnemies' ? living.map((e) => e.idx) : [targetIdx];
  const parts = targetIndexes.map((idx) => ({ enemy: idx == null ? null : cb.enemies[idx], preview: previewPlay(run, cb, inst, idx) }));
  const present = parts.filter((x) => x.preview);
  if (!present.length) return null;
  const first = present[0].preview;
  return {
    loss: present.reduce((sum, x) => sum + x.preview.loss, 0),
    overkill: present.reduce((sum, x) => sum + Math.max(0, x.preview.total - Math.min(x.preview.loss, x.enemy?.hp ?? x.preview.loss)), 0),
    lethalLast: living.length > 0 && present.length === living.length && present.every((x) => x.preview.lethal),
    block: first.block,
    chips: present.reduce((sum, x) => sum + x.preview.chips, 0),
    shatters: present.filter((x) => x.preview.willShatter).length,
  };
}

function scorePlay(run, cb, inst, targetIdx, incoming) {
  const utility = combatUtility(run, cb, inst, targetIdx);
  const preview = previewAggregate(run, cb, inst, targetIdx);
  // KTD8's required null-preview branch: pure draw/energy/status utility is
  // deliberately scored here, with no fabricated damage/block arithmetic.
  let score = preview === null ? utility : (
    utility
    + (preview.lethalLast ? WEIGHTS.lethal : 0)
    + preview.loss * WEIGHTS.dmg
    - preview.overkill * WEIGHTS.overkill
    + preview.shatters * WEIGHTS.shatter
    + preview.chips * WEIGHTS.chip
    + Math.min(preview.block, Math.max(0, incoming - cb.player.block)) * WEIGHTS.block
  );
  score -= (effCost(run, cb, inst) || 0) * WEIGHTS.cost;
  return score;
}

function candidatesFor(run, cb, incoming) {
  const living = cb.enemies.filter((e) => e.hp > 0);
  const out = [];
  for (const inst of cb.hand) {
    const d = cardData(inst, run);
    const targets = d.target === 'enemy' ? living.map((e) => e.idx) : [null];
    for (const target of targets) {
      if (!canPlay(run, cb, inst, target)) continue;
      out.push({ inst, target, score: scorePlay(run, cb, inst, target, incoming) });
    }
  }
  return out;
}

function artIsTimely(run, cb, incoming) {
  if (!canUseArt(run, cb)) return false;
  if (cb.embers >= cb.emberCap - 1) return true;
  const art = ARTS[run.art];
  if (!art) return false;
  const gap = Math.max(0, incoming - cb.player.block);
  for (const fx of art.effects || []) {
    if (fx.kind === 'dmg' && cb.enemies.some((e) => e.hp > 0 && e.block + e.hp <= nOf(fx))) return true;
    if (fx.kind === 'block' && gap >= Math.max(1, nOf(fx) / 2)) return true;
    if (fx.kind === 'heal' && cb.player.hp <= run.player.maxHp * 0.45) return true;
  }
  return false;
}

function potionAction(run, cb, incoming) {
  const urgent = incoming >= cb.player.hp * 0.5;
  const hardFight = cb.kind === 'elite' || cb.kind === 'boss';
  if (!urgent && !hardFight) return null;
  const living = cb.enemies.filter((e) => e.hp > 0);
  const target = living.slice().sort((a, b) => a.hp + a.block - b.hp - b.block || a.idx - b.idx)[0];
  const entries = run.player.potions.map((id, slot) => ({ id, slot })).filter((x) => x.id && POTIONS[x.id]);
  const find = (id) => entries.find((x) => x.id === id);
  if (urgent && find('healing') && cb.player.hp < run.player.maxHp) return { kind: 'potion', slot: find('healing').slot, target: null };
  if (urgent && find('block')) return { kind: 'potion', slot: find('block').slot, target: null };
  if (target && find('fire') && target.hp + target.block <= 20) return { kind: 'potion', slot: find('fire').slot, target: target.idx };
  if (hardFight && target && find('venom')) return { kind: 'potion', slot: find('venom').slot, target: target.idx };
  for (const id of ['strength', 'energy', 'swift']) {
    const p = find(id);
    if (p) return { kind: 'potion', slot: p.slot, target: null };
  }
  return null;
}

function deckPower(run) {
  const best = run.player.deck.map((c) => {
    const d = cardData(c, run);
    return baseDamage(d) / Math.max(1, d.cost ?? 99);
  }).sort((a, b) => b - a).slice(0, 5);
  return best.reduce((sum, n) => sum + n, 0) + run.player.relics.length * 2;
}

function nodeScore(ctx, node) {
  const { run } = ctx;
  // The map UI deliberately hides an unlit node's true face and bounty
  // amount. Treat it as an unknown route with a modest visible first-light
  // premium; do not score either hidden field until it has been visited.
  if (node.unlit) return 5.5;
  const hp = run.player.hp / Math.max(1, run.player.maxHp);
  let score = ({ boss: 100, treasure: 9, monument: 8, monster: 5, event: 4, shop: 2, rest: 2, elite: 1 }[node.type] || 0);
  if (node.type === 'rest') score = hp <= 0.4 ? 22 : hp >= 0.7 ? 2 : 2 + (0.7 - hp) * (20 / 0.3);
  else if (node.type === 'shop') score = run.player.gold >= WEIGHTS.shopGold ? 10 : 2 + run.player.gold / WEIGHTS.shopGold * 3;
  else if (node.type === 'elite') {
    score = hp >= WEIGHTS.eliteHpFloor && deckPower(run) >= WEIGHTS.elitePowerFloor ? 8 : -100;
  }
  return score;
}

function eventOpsValue(run, ops) {
  let score = 0;
  for (const op of ops || []) {
    if (Number.isFinite(op.gold)) score += op.gold * 0.1;
    if (Number.isFinite(op.hp)) score += op.hp * (op.hp < 0 ? (run.player.hp <= run.player.maxHp * 0.45 ? 2.5 : 1.2) : 1);
    if (Number.isFinite(op.maxHp)) score += op.maxHp * 1.3;
    if (Number.isFinite(op.heal)) score += Math.min(run.player.maxHp - run.player.hp, run.player.maxHp * op.heal) * 1.4;
    if (op.addRelic) score += 13;
    if (op.addCard) score += valueOfCard(op.addCard, run);
    if (op.potion) score += run.player.potions.includes(null) ? 6 : 0;
    if (op.pickRemove) score += 9;
    if (op.pickUpgrade) score += bestUpgrade(run) ? 8 : 0;
    if (op.pickDuplicate) score += Math.max(...run.player.deck.map((c) => valueOfCard(c, run)), 0) * 0.45;
    if (op.pickCard) score += 8;
    if (Array.isArray(op.roll)) score += op.roll.reduce((sum, branch) => sum + (branch.p || 0) * eventOpsValue(run, branch.ops), 0);
  }
  return score;
}

export function makePolicy(rng) {
  const chooseTie = (arr) => arr.length === 1 ? arr[0] : arr[Math.floor(rng() * arr.length)];
  let currentCombat = null;
  let currentTurn = -1;
  let turnActions = 0;
  return {
    pickNode(ctx, nodes) {
      // Map ties are deliberately spatial, not random: leftmost column first.
      return nodes.map((node) => ({ node, score: nodeScore(ctx, node) }))
        .sort((a, b) => b.score - a.score
          || (a.node.col ?? 0) - (b.node.col ?? 0)
          || compareText(String(a.node.id), String(b.node.id)))[0].node;
    },

    combatAction(ctx, cb) {
      if (cb !== currentCombat || cb.turn !== currentTurn) {
        currentCombat = cb;
        currentTurn = cb.turn;
        turnActions = 0;
      }
      // Leave headroom below the walker's hard 40-action guard. Long
      // draw/energy chains are legal, but the policy must terminate itself.
      if (++turnActions >= 36) return { kind: 'end' };
      const incoming = incomingThreat(ctx.run, cb);
      const choices = candidatesFor(ctx.run, cb, incoming);
      if (choices.length) {
        const top = Math.max(...choices.map((x) => x.score));
        if (top > 0) {
          const picked = chooseTie(choices.filter((x) => Math.abs(x.score - top) < 1e-9));
          return { kind: 'play', uid: picked.inst.uid, target: picked.target };
        }
      }
      const potion = potionAction(ctx.run, cb, incoming);
      if (potion) return potion;
      if (artIsTimely(ctx.run, cb, incoming)) return { kind: 'art' };
      if (cb.embers < cb.emberCap) {
        const kindlable = cb.hand
          .filter((inst) => canKindle(ctx.run, cb, inst))
          .map((inst) => {
            const cardChoices = choices.filter((x) => x.inst === inst);
            return { inst, score: cardChoices.length ? Math.max(...cardChoices.map((x) => x.score)) : combatUtility(ctx.run, cb, inst, null) };
          })
          .filter((x) => x.score < WEIGHTS.kindleFloor)
          .sort((a, b) => a.score - b.score || a.inst.uid - b.inst.uid);
        if (kindlable.length) return { kind: 'kindle', uid: kindlable[0].inst.uid };
      }
      return { kind: 'end' };
    },

    pickCardReward(ctx, ids) { return chooseDraft(ctx.run, ids, chooseTie); },

    pickBossRelic(ctx, ids) {
      const scored = ids.map((id) => ({ id, score: RELIC_VALUES[id] ?? 8 }));
      const top = Math.max(...scored.map((x) => x.score));
      return chooseTie(scored.filter((x) => x.score === top)).id;
    },

    restDecision(ctx) {
      const hp = ctx.run.player.hp / Math.max(1, ctx.run.player.maxHp);
      const card = bestUpgrade(ctx.run);
      return hp <= WEIGHTS.restHealHp || !card ? { kind: 'heal' } : { kind: 'upgrade', uid: card.uid };
    },

    eventChoice(ctx, event, valid) {
      const scored = valid.map((choice) => ({ choice, score: eventOpsValue(ctx.run, choice.ops) }));
      const top = Math.max(...scored.map((x) => x.score));
      return chooseTie(scored.filter((x) => x.score === top)).choice;
    },

    eventPending(ctx, pending) {
      if (pending.op === 'pickCard') return chooseDraft(ctx.run, pending.options, chooseTie);
      if (pending.op === 'upgrade') return bestUpgrade(ctx.run)?.uid ?? null;
      if (pending.op === 'duplicate') {
        return pending.options.slice().sort((a, b) => valueOfCard(b, ctx.run) - valueOfCard(a, ctx.run) || a.uid - b.uid)[0]?.uid ?? null;
      }
      if (pending.op === 'remove') {
        // Curses/statuses are worst; among ordinary cards, shed basic
        // Strike/Defend before removing a drafted build piece.
        const removalRank = (c) => {
          const d = cardData(c, ctx.run);
          if (d.type === 'curse' || d.type === 'status') return -200;
          if (c.id === 'strike' || c.id === 'defend') return -100 + valueOfCard(c, ctx.run);
          return valueOfCard(c, ctx.run);
        };
        return pending.options.slice().sort((a, b) => removalRank(a) - removalRank(b) || a.uid - b.uid)[0]?.uid ?? null;
      }
      return null;
    },

    shopPlan(ctx, shop) {
      const reserve = ctx.run.act > 0 ? WEIGHTS.actTwoReserve : 0;
      let gold = ctx.run.player.gold;
      let freePotionSlots = ctx.run.player.potions.filter((id) => id == null).length;
      const plan = [];
      const buy = (item) => {
        if (!item.sold && item.price <= gold && gold - item.price >= reserve) {
          plan.push(item);
          gold -= item.price;
          return true;
        }
        return false;
      };
      for (const item of shop.relics.slice().sort((a, b) => (RELIC_VALUES[b.id] || 0) - (RELIC_VALUES[a.id] || 0) || a.price - b.price)) buy(item);
      for (const item of shop.potions) {
        if (freePotionSlots > 0 && buy(item)) freePotionSlots--;
      }
      const floor = draftFloor(ctx.run);
      const cards = shop.cards.map((item) => ({ item, value: valueOfCard(item.id, ctx.run) }))
        .sort((a, b) => b.value - a.value || a.item.price - b.item.price);
      for (const { item, value } of cards) {
        if (value >= floor) buy(item);
      }
      return plan;
    },
  };
}
