// This is the only boundary that inspects mutable walker state. Registry
// policies receive only frozen visible state, legal actions, and preview scores.
import {
  canKindle,
  canPlay,
  canUseArt,
  cardData,
  effCost,
  previewEnemyDmg,
  previewPlay,
} from '../../src/engine.js';
import { ARTS, CARDS, POTIONS, PROGRESSION, RELICS } from '../../src/data.js';
import { WEIGHTS } from './policies/greedy-core.mjs';
import { createObservation } from './policies/observation.mjs';

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

function baseDamage(data) {
  let total = 0;
  for (const fx of data.effects || []) {
    if (fx.kind === 'dmg') total += nOf(fx) * (fx.times || 1);
    else if (fx.kind === 'special' && ['leech', 'devour', 'execute', 'momentum', 'shatterEcho'].includes(fx.id)) {
      total += nOf(fx);
    }
  }
  return total * (data.target === 'allEnemies' ? 1.6 : 1);
}

function staticUtility(data) {
  let value = 0;
  for (const fx of data.effects || []) {
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

function staticCardValueFromData(data) {
  if (!data || data.unplayable || data.type === 'curse' || data.type === 'status') return -100;
  const cost = data.cost == null ? 4 : Math.max(0.5, data.cost);
  let block = 0;
  for (const fx of data.effects || []) if (fx.kind === 'block') block += nOf(fx);
  const core = (baseDamage(data) + block * 0.85) / cost;
  return core + staticUtility(data) + rarityValue(data.rarity) - (data.cost || 0) * 0.25;
}

export const CARD_VALUES = Object.freeze(Object.fromEntries(
  Object.entries(CARDS).map(([id, data]) => [id, staticCardValueFromData(data)]),
));

export const RELIC_VALUES = Object.freeze(Object.fromEntries(
  Object.entries(RELICS).map(([id, data]) => [id, RELIC_OVERRIDES[id] ?? (8 + rarityValue(data.rarity))]),
));

function valueOfCard(cardOrId, run) {
  if (typeof cardOrId === 'string') return staticCardValueFromData(CARDS[cardOrId]);
  return staticCardValueFromData(cardData(cardOrId, run));
}

function upgradeValue(card, run) {
  const base = cardData(card, run);
  const raw = CARDS[card.id];
  return raw?.up ? staticCardValueFromData({ ...raw, ...raw.up }) - staticCardValueFromData(base) : -Infinity;
}

function draftFloor(run) {
  return WEIGHTS.draftFloor + Math.max(0, run.player.deck.length - WEIGHTS.largeDeck) * WEIGHTS.largeDeckStep;
}

function incomingThreat(run, combat) {
  return combat.enemies.reduce((sum, enemy) => {
    if (enemy.hp <= 0) return sum;
    const preview = previewEnemyDmg(run, combat, enemy);
    return sum + (preview ? preview.dmg * preview.times : 0);
  }, 0);
}

function targetsFor(data, combat, targetIndex) {
  if (data.target === 'allEnemies') return combat.enemies.filter((enemy) => enemy.hp > 0);
  if (data.target === 'enemy') return targetIndex == null ? [] : [combat.enemies[targetIndex]].filter(Boolean);
  return [];
}

function combatUtility(run, combat, card, targetIndex) {
  const data = cardData(card, run);
  const targets = targetsFor(data, combat, targetIndex);
  const expectedTurns = Math.max(1, 5 - Math.min(combat.turn, 4));
  let score = 0;
  for (const fx of data.effects || []) {
    if (fx.kind === 'draw') score += nOf(fx) * WEIGHTS.draw;
    else if (fx.kind === 'energy') score += nOf(fx) * WEIGHTS.energy;
    else if (fx.kind === 'ember') score += nOf(fx) * WEIGHTS.ember;
    else if (fx.kind === 'heal') score += Math.min(nOf(fx), run.player.maxHp - combat.player.hp) * WEIGHTS.heal;
    else if (fx.kind === 'loseHp') score -= nOf(fx) * WEIGHTS.selfHpLoss;
    else if (fx.kind === 'status') {
      if (fx.who === 'self') score += (SELF_STATUS_VALUE[fx.id] || 2) * nOf(fx);
      else {
        for (const target of targets) {
          const threat = previewEnemyDmg(run, combat, target);
          const threatScale = threat ? 1 + Math.min(1, (threat.dmg * threat.times) / Math.max(1, combat.player.hp)) : 1;
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
        const burnCost = combat.hand.filter((entry) => entry !== card)
          .reduce((sum, entry) => sum + Math.max(0, valueOfCard(entry, run)), 0) * 0.12;
        score += (fx.draw || 0) * WEIGHTS.draw - burnCost;
      } else if (fx.id === 'doubleBlock') {
        score += Math.min(combat.player.block, Math.max(0, incomingThreat(run, combat) - combat.player.block)) * WEIGHTS.block;
      }
    }
  }
  return score;
}

function previewAggregate(run, combat, card, targetIndex) {
  const data = cardData(card, run);
  const living = combat.enemies.filter((enemy) => enemy.hp > 0);
  const targetIndexes = data.target === 'allEnemies' ? living.map((enemy) => enemy.idx) : [targetIndex];
  const parts = targetIndexes.map((index) => ({
    enemy: index == null ? null : combat.enemies[index],
    preview: previewPlay(run, combat, card, index),
  }));
  const present = parts.filter((part) => part.preview);
  if (!present.length) return null;
  const first = present[0].preview;
  return {
    loss: present.reduce((sum, part) => sum + part.preview.loss, 0),
    overkill: present.reduce((sum, part) => sum + Math.max(0,
      part.preview.total - Math.min(part.preview.loss, part.enemy?.hp ?? part.preview.loss)), 0),
    lethalLast: living.length > 0 && present.length === living.length && present.every((part) => part.preview.lethal),
    block: first.block,
    chips: present.reduce((sum, part) => sum + part.preview.chips, 0),
    shatters: present.filter((part) => part.preview.willShatter).length,
  };
}

function scorePlay(run, combat, card, targetIndex, incoming) {
  const utility = combatUtility(run, combat, card, targetIndex);
  const preview = previewAggregate(run, combat, card, targetIndex);
  let score = preview === null ? utility : (
    utility
    + (preview.lethalLast ? WEIGHTS.lethal : 0)
    + preview.loss * WEIGHTS.dmg
    - preview.overkill * WEIGHTS.overkill
    + preview.shatters * WEIGHTS.shatter
    + preview.chips * WEIGHTS.chip
    + Math.min(preview.block, Math.max(0, incoming - combat.player.block)) * WEIGHTS.block
  );
  score -= (effCost(run, combat, card) || 0) * WEIGHTS.cost;
  return score;
}

function combatCandidates(run, combat, incoming) {
  const living = combat.enemies.filter((enemy) => enemy.hp > 0);
  const out = [];
  for (const card of combat.hand) {
    const data = cardData(card, run);
    const targets = data.target === 'enemy' ? living.map((enemy) => enemy.idx) : [null];
    for (const target of targets) {
      if (!canPlay(run, combat, card, target)) continue;
      out.push({ card, target, score: scorePlay(run, combat, card, target, incoming) });
    }
  }
  return out;
}

function artIsTimely(run, combat, incoming) {
  if (!canUseArt(run, combat)) return false;
  if (combat.embers >= combat.emberCap - 1) return true;
  const art = ARTS[run.art];
  if (!art) return false;
  const gap = Math.max(0, incoming - combat.player.block);
  for (const fx of art.effects || []) {
    if (fx.kind === 'dmg' && combat.enemies.some((enemy) => enemy.hp > 0 && enemy.block + enemy.hp <= nOf(fx))) return true;
    if (fx.kind === 'block' && gap >= Math.max(1, nOf(fx) / 2)) return true;
    if (fx.kind === 'heal' && combat.player.hp <= run.player.maxHp * 0.45) return true;
  }
  return false;
}

function potionAction(run, combat, incoming) {
  const urgent = incoming >= combat.player.hp * 0.5;
  const hardFight = combat.kind === 'elite' || combat.kind === 'boss';
  if (!urgent && !hardFight) return null;
  const living = combat.enemies.filter((enemy) => enemy.hp > 0);
  const target = living.slice().sort((a, b) => a.hp + a.block - b.hp - b.block || a.idx - b.idx)[0];
  const entries = run.player.potions.map((id, slot) => ({ id, slot })).filter((entry) => entry.id && POTIONS[entry.id]);
  const find = (id) => entries.find((entry) => entry.id === id);
  if (urgent && find('healing') && combat.player.hp < run.player.maxHp) return { kind: 'potion', slot: find('healing').slot, target: null };
  if (urgent && find('block')) return { kind: 'potion', slot: find('block').slot, target: null };
  if (target && find('fire') && target.hp + target.block <= 20) return { kind: 'potion', slot: find('fire').slot, target: target.idx };
  if (hardFight && target && find('venom')) return { kind: 'potion', slot: find('venom').slot, target: target.idx };
  for (const id of ['strength', 'energy', 'swift']) {
    const potion = find(id);
    if (potion) return { kind: 'potion', slot: potion.slot, target: null };
  }
  return null;
}

function deckPower(run) {
  const best = run.player.deck.map((card) => {
    const data = cardData(card, run);
    return baseDamage(data) / Math.max(1, data.cost ?? 99);
  }).sort((a, b) => b - a).slice(0, 5);
  return best.reduce((sum, value) => sum + value, 0) + run.player.relics.length * 2;
}

function nodeScore(run, node) {
  // An Unlit Way face is deliberately opaque even though the mutable map node
  // already owns its true type and bounty.
  if (node.unlit) return 5.5;
  const hp = run.player.hp / Math.max(1, run.player.maxHp);
  let score = ({ boss: 100, treasure: 9, monument: 8, monster: 5, event: 4, shop: 2, rest: 2, elite: 1 }[node.type] || 0);
  if (node.type === 'rest') score = hp <= 0.4 ? 22 : hp >= 0.7 ? 2 : 2 + (0.7 - hp) * (20 / 0.3);
  else if (node.type === 'shop') score = run.player.gold >= WEIGHTS.shopGold ? 10 : 2 + run.player.gold / WEIGHTS.shopGold * 3;
  else if (node.type === 'elite') score = hp >= WEIGHTS.eliteHpFloor && deckPower(run) >= WEIGHTS.elitePowerFloor ? 8 : -100;
  return score;
}

function bestUpgrade(run, cards = run.player.deck) {
  return cards.filter((card) => !card.up && CARDS[card.id]?.up)
    .map((card) => ({ card, score: upgradeValue(card, run) }))
    .sort((a, b) => b.score - a.score || a.card.uid - b.card.uid)[0]?.card ?? null;
}

function eventOpsValue(run, operations) {
  let score = 0;
  for (const operation of operations || []) {
    if (Number.isFinite(operation.gold)) score += operation.gold * 0.1;
    if (Number.isFinite(operation.hp)) score += operation.hp * (operation.hp < 0
      ? (run.player.hp <= run.player.maxHp * 0.45 ? 2.5 : 1.2) : 1);
    if (Number.isFinite(operation.maxHp)) score += operation.maxHp * 1.3;
    if (Number.isFinite(operation.heal)) {
      score += Math.min(run.player.maxHp - run.player.hp, run.player.maxHp * operation.heal) * 1.4;
    }
    if (operation.addRelic) score += 13;
    if (operation.addCard) score += valueOfCard(operation.addCard, run);
    if (operation.potion) score += run.player.potions.includes(null) ? 6 : 0;
    if (operation.pickRemove) score += 9;
    if (operation.pickUpgrade) score += bestUpgrade(run) ? 8 : 0;
    if (operation.pickDuplicate) {
      score += Math.max(...run.player.deck.map((card) => valueOfCard(card, run)), 0) * 0.45;
    }
    if (operation.pickCard) score += 8;
    if (Array.isArray(operation.roll)) {
      score += operation.roll.reduce((sum, branch) =>
        sum + (branch.p || 0) * eventOpsValue(run, branch.ops), 0);
    }
  }
  return score;
}

const actionRecord = ({ ref, legacy, ...visible }) => visible;

function adapterFor(definition, policy, options) {
  const knowledgeClass = definition.knowledgeClass;
  const objective = options.objective ?? null;
  const targets = (...ids) => ids.includes(objective?.targetId) ? 'active' : undefined;
  let combatObject = null;
  let combatKey = 0;
  let combatTurn = -1;
  let decisionOrdinal = 0;

  const observe = (phase, state, entries) => createObservation({
    phase,
    knowledgeClass,
    state,
    objective,
    legalActions: entries.map(actionRecord),
  });

  const decideOne = (phase, state, entries) => {
    const selected = policy.decide(observe(phase, state, entries));
    return entries.find(({ key }) => key === selected);
  };

  return {
    pickNode(ctx, nodes) {
      const entries = nodes.map((node, order) => ({
        key: `node:${node.id}`,
        kind: 'node',
        face: node.unlit ? 'unknown' : node.type,
        col: node.col ?? 0,
        order,
        genericScore: nodeScore(ctx.run, node),
        objectivePriority: node.type === 'monument'
          ? targets('shade.standing-monument', 'shade.duel', 'shade.win')
          : node.type === 'shop' ? targets('usurper.offer', 'usurper.afford', 'usurper.buy')
            : node.unlit ? targets('hollow.reachable', 'hollow.entered', 'hollow.paid', 'hollow.progressed')
              : undefined,
        ref: node,
      }));
      return decideOne('node', {
        act: ctx.run.act,
        hpRatio: ctx.run.player.hp / Math.max(1, ctx.run.player.maxHp),
        gold: ctx.run.player.gold,
        deckSize: ctx.run.player.deck.length,
        relicCount: ctx.run.player.relics.length,
      }, entries)?.ref;
    },

    combatAction(ctx, combat) {
      if (combat !== combatObject) {
        combatObject = combat;
        combatKey++;
        combatTurn = combat.turn;
        decisionOrdinal = 0;
      } else if (combat.turn !== combatTurn) {
        combatTurn = combat.turn;
        decisionOrdinal = 0;
      }
      decisionOrdinal++;
      const incoming = incomingThreat(ctx.run, combat);
      const candidates = combatCandidates(ctx.run, combat, incoming);
      const entries = candidates.map(({ card, target, score }, order) => ({
        key: `play:${card.uid}:${target ?? 'none'}`,
        kind: 'play', uid: card.uid, target, group: `card:${card.uid}`,
        genericScore: score, order,
        legacy: { kind: 'play', uid: card.uid, target },
      }));
      const potion = potionAction(ctx.run, combat, incoming);
      if (potion) entries.push({
        key: `potion:${potion.slot}:${potion.target ?? 'none'}`,
        ...potion,
        order: entries.length,
        legacy: potion,
      });
      if (canUseArt(ctx.run, combat)) entries.push({
        key: 'art', kind: 'art', greedyEligible: artIsTimely(ctx.run, combat, incoming),
        order: entries.length, legacy: { kind: 'art' },
      });
      if (combat.embers < combat.emberCap) {
        for (const card of combat.hand) {
          if (!canKindle(ctx.run, combat, card)) continue;
          const data = cardData(card, ctx.run);
          const cardChoices = candidates.filter((candidate) => candidate.card === card);
          const score = cardChoices.length
            ? Math.max(...cardChoices.map((candidate) => candidate.score))
            : combatUtility(ctx.run, combat, card, null);
          entries.push({
            key: `kindle:${card.uid}`, kind: 'kindle', uid: card.uid,
            genericScore: score, greedyEligible: score < WEIGHTS.kindleFloor,
            randomEligible: data.type !== 'curse',
            order: entries.length, legacy: { kind: 'kindle', uid: card.uid },
          });
        }
      }
      if (ctx.run.act >= PROGRESSION.emberglass.ownShade.minDeathAct) entries.push({
        key: 'fall', kind: 'fall', genericScore: -1_000_000_000,
        objectivePriority: targets('shade.qualifying-fall'), order: entries.length,
        legacy: { kind: 'fall' },
      });
      entries.push({ key: 'end', kind: 'end', order: entries.length, legacy: { kind: 'end' } });
      return decideOne('combat', {
        combatKey, turn: combat.turn, decisionOrdinal,
        incoming, embers: combat.embers, emberCap: combat.emberCap,
      }, entries)?.legacy;
    },

    pickCardReward(ctx, ids) {
      const entries = ids.map((id, order) => ({
        key: `card:${order}:${id}`, kind: 'card', id,
        objectivePriority: id === 'unreadablePage' ? targets('page.take') : undefined,
        genericScore: valueOfCard(id, ctx.run), order, legacy: id,
      }));
      entries.push({ key: 'skip', kind: 'skip', order: entries.length, legacy: null });
      return decideOne('card-reward', { draftFloor: draftFloor(ctx.run) }, entries)?.legacy ?? null;
    },

    pickBossRelic(ctx, ids) {
      const entries = ids.map((id, order) => ({
        key: `relic:${order}:${id}`, kind: 'relic', id,
        genericScore: RELIC_VALUES[id] ?? 8, order, legacy: id,
      }));
      entries.push({ key: 'skip', kind: 'skip', genericScore: 0, order: entries.length, legacy: null });
      return decideOne('boss-relic', {}, entries)?.legacy ?? null;
    },

    restDecision(ctx) {
      const entries = [{ key: 'heal', kind: 'heal', order: 0, legacy: { kind: 'heal' } }];
      for (const [order, card] of ctx.run.player.deck.filter((entry) => !entry.up && CARDS[entry.id]?.up).entries()) {
        entries.push({
          key: `upgrade:${card.uid}`, kind: 'upgrade', uid: card.uid,
          genericScore: upgradeValue(card, ctx.run), order: order + 1,
          legacy: { kind: 'upgrade', uid: card.uid },
        });
      }
      return decideOne('rest', {
        hpRatio: ctx.run.player.hp / Math.max(1, ctx.run.player.maxHp),
      }, entries)?.legacy;
    },

    eventChoice(ctx, event, valid) {
      const entries = valid.map((choice, order) => ({
        key: `event-choice:${order}`, kind: 'event-choice',
        genericScore: eventOpsValue(ctx.run, choice.ops), order, ref: choice,
      }));
      return decideOne('event-choice', {}, entries)?.ref;
    },

    eventPending(ctx, pending) {
      const entries = pending.options.map((option, order) => {
        if (pending.op === 'pickCard') return {
          key: `pending-card:${order}:${option}`, kind: 'card', id: option,
          genericScore: valueOfCard(option, ctx.run), order, legacy: option,
        };
        let score = valueOfCard(option, ctx.run);
        if (pending.op === 'upgrade') score = upgradeValue(option, ctx.run);
        if (pending.op === 'remove') {
          const data = cardData(option, ctx.run);
          if (data.type === 'curse' || data.type === 'status') score = -200;
          else if (option.id === 'strike' || option.id === 'defend') score = -100 + valueOfCard(option, ctx.run);
        }
        return {
          key: `pending-${pending.op}:${option.uid}`, kind: pending.op,
          uid: option.uid, genericScore: score, order, legacy: option.uid,
        };
      });
      entries.push({ key: 'skip', kind: 'skip', order: entries.length, legacy: null });
      return decideOne('event-pending', {
        operation: pending.op,
        draftFloor: draftFloor(ctx.run),
      }, entries)?.legacy ?? null;
    },

    shopPlan(ctx, shop) {
      const entries = [];
      const add = (items, bucket) => {
        for (const item of items) {
          const kind = `buy-${bucket}`;
          const genericScore = bucket === 'relic'
            ? (RELIC_VALUES[item.id] ?? 8)
            : bucket === 'card' ? valueOfCard(item.id, ctx.run) : 0;
          entries.push({
            key: `${kind}:${entries.length}:${item.id}`,
            kind, id: item.id, price: item.price, sold: !!item.sold,
            genericScore, order: entries.length, ref: item,
          });
        }
      };
      // Preserve Random's historical card -> relic -> potion iteration order;
      // Greedy's pure core sorts each category explicitly.
      add(shop.cards, 'card');
      add(shop.relics, 'relic');
      add(shop.potions, 'potion');
      for (const item of shop.questItems || []) entries.push({
        key: `buy-quest:${item.id}`, kind: 'buy-quest', id: item.id,
        price: item.price, sold: !!item.sold, genericScore: 20,
        objectivePriority: targets('usurper.buy'), order: entries.length,
        ref: { _simKind: 'quest-item', id: item.id },
      });
      if (!shop.removed && ctx.run.player.gold >= shop.removeCost) {
        for (const card of ctx.run.player.deck.filter((entry) => !CARDS[entry.id]?.unremovable)) {
          entries.push({
            key: `remove:${card.uid}`, kind: 'remove', uid: card.uid,
            price: shop.removeCost, sold: false, genericScore: -valueOfCard(card, ctx.run),
            order: entries.length, ref: { _simKind: 'remove', uid: card.uid },
          });
        }
      }
      if (!entries.length) entries.push({
        key: 'shop:none', kind: 'noop', price: 0, sold: true, order: 0, ref: null,
      });
      const selected = policy.decide(observe('shop', {
        act: ctx.run.act,
        gold: ctx.run.player.gold,
        reserve: ctx.run.act > 0 ? WEIGHTS.actTwoReserve : 0,
        freePotionSlots: ctx.run.player.potions.filter((id) => id == null).length,
        draftFloor: draftFloor(ctx.run),
      }, entries));
      if (!Array.isArray(selected)) return [];
      const byKey = new Map(entries.map((entry) => [entry.key, entry.ref]));
      return selected.map((key) => byKey.get(key)).filter(Boolean);
    },

    lamplighterDecision(ctx, offer) {
      const entries = [];
      for (const boon of offer.boons) for (const art of offer.arts) entries.push({
        key: `lamplighter:${boon}:${art}`, kind: 'lamplighter', boon, art,
        genericScore: (art === offer.currentArt ? 1 : 0), order: entries.length,
        legacy: { boon, art },
      });
      return decideOne('lamplighter', {}, entries)?.legacy;
    },

    hollowDecision() {
      const entries = [
        { key: 'hollow:pay', kind: 'pay', genericScore: 10,
          objectivePriority: targets('hollow.paid', 'hollow.progressed'), order: 0, legacy: { kind: 'pay' } },
        { key: 'hollow:leave', kind: 'leave', genericScore: 0, order: 1, legacy: { kind: 'leave' } },
      ];
      return decideOne('hollow', {}, entries)?.legacy;
    },

    monumentDecision() {
      return decideOne('monument', {}, [
        { key: 'monument:duel', kind: 'duel', genericScore: 10,
          objectivePriority: targets('shade.duel', 'shade.win'), order: 0, legacy: 'duel' },
      ])?.legacy;
    },

    terminalIntent(_ctx, actions) {
      const entries = actions.map((action, order) => ({
        key: `terminal:${action}`, kind: action, genericScore: action === 'dawn' ? 10 : 0,
        objectivePriority: action === 'fall' ? targets('shade.qualifying-fall') : undefined,
        order, legacy: action,
      }));
      return decideOne('terminal', {}, entries)?.legacy;
    },

    pickBequest(_ctx, offers) {
      const entries = offers.map((offer, order) => ({
        key: `bequest:${order}`, kind: 'bequest', genericScore: offer.kind === 'relic' ? 12
          : offer.kind === 'card' ? 8 : (offer.amount || 0) / 10,
        order, ref: offer,
      }));
      entries.push({ key: 'bequest:skip', kind: 'skip', genericScore: 0, order: entries.length, ref: null });
      return decideOne('bequest', {}, entries)?.ref ?? null;
    },
  };
}

export function makeWalkerPolicyFactory(definition, options = {}) {
  if (!definition || typeof definition.factory !== 'function') throw new TypeError('unknown policy definition');
  if (!['baseline', 'player-visible', 'coverage-only'].includes(definition.knowledgeClass)) {
    throw new TypeError(`unknown knowledge class: ${definition.knowledgeClass}`);
  }
  return (rng) => adapterFor(definition, definition.factory(rng, options), options);
}
