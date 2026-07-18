// THE walker: drives one full run start→win/death through the pure engine.
// It owns ALL game flow, legality, guards, invariants, and telemetry capture;
// policies are pure decision callbacks (spec 2026-07-17 proving-grounds, KTD6).
// Flow mirrors randomAgentRun in test/test_engine.js — the proven-terminating
// reference — with its asserts recorded as `issues`, never thrown (KTD9).
//
// Policy contract (a policy module exports `makePolicy(rng) → policy`):
//   pickNode(ctx, nodes)           → node (one of `nodes`)
//   combatAction(ctx, cb)          → { kind: 'play', uid, target }
//                                  | { kind: 'kindle', uid } | { kind: 'art' }
//                                  | { kind: 'potion', slot, target }
//                                  | { kind: 'end' }
//   pickCardReward(ctx, cards)     → cardId | null (null = skip)
//   pickBossRelic(ctx, relicIds)   → relicId
//   restDecision(ctx)              → { kind: 'heal' } | { kind: 'upgrade', uid }
//   eventChoice(ctx, event, valid) → choice (one of `valid`)
//   eventPending(ctx, pending)     → uid | cardId | null; pending is
//                                    { op: 'remove'|'upgrade'|'duplicate', options: [card] }
//                                    or { op: 'pickCard', n, options: [cardId] }
//   shopPlan(ctx, shop)            → array of shop item refs to buy, in order
// ctx is { run, cb } (cb null outside combat). Policies see visible state and
// their own rng only; engine randomness is never consumed by deliberation.
import {
  newRun, applyBoon, availableNodes, visitNode, rollEncounter, startCombat,
  canPlay, playCard, canKindle, kindleFromHand, canUseArt, useArt, usePotion,
  endTurn, genCombatRewards, addCardToDeck, gainPotion, gainRelic,
  rollBossRelics, genMap, healPlayer, upgradeCardInDeck, removeCardFromDeck,
  removableCards, rollEvent, rollEventCards, applyEventOps, genShop, randomRelic,
  claimMonument, MAP_ROWS,
} from '../../src/engine.js';
import { ASPECTS, VOWS, BOONS, CARDS, EVENTS } from '../../src/data.js';
import { _setStore, loadVigil, revealSnapshot } from '../../src/vigil.js';

const NODE_GUARD = 400; // node loop cap (mirrors randomAgentRun)
const TURN_GUARD = 200; // combat turn cap
const ACTION_GUARD = 40; // policy actions per turn cap
const POLICY_RNG_SALT = 0x51ab; // KTD7: the policy stream, distinct from runRng
const STACK_LIMIT = 8_192;
const BOON_IDS = Object.keys(BOONS);

export function mulberry32(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Sweep cell is a pure function of the seed (KTD10), so
// `--runs 1 --seed K` replays the exact cell of the original run (R3).
// vow is a 0..VOWS.length level, 0 = none.
export function cellForSeed(seed) {
  return {
    aspect: seed % ASPECTS.length,
    vow: Math.floor(seed / ASPECTS.length) % (VOWS.length + 1),
    boon: BOON_IDS[seed % BOON_IDS.length],
    monument: seed % 4 === 0,
  };
}

// Fresh-profile reveal snapshot: what a brand-new vigil has revealed (nothing
// yet), computed once via the emberglass-pacing pattern. `revealed` passes
// reveals: null (the engine treats null as fully revealed).
let freshRevealsCache = null;
function freshReveals() {
  if (!freshRevealsCache) {
    _setStore(null);
    freshRevealsCache = revealSnapshot(loadVigil());
    _setStore(null);
  }
  return freshRevealsCache;
}

const errMsg = (err) => String((err && err.message) || err);
const issueStack = (err) => typeof err?.stack === 'string'
  ? err.stack.trim().slice(0, STACK_LIMIT)
  : '';

export function playRun(seed, makePolicy, config = {}) {
  const profile = config.profile || 'revealed';
  if (profile !== 'revealed' && profile !== 'fresh') throw new TypeError(`unknown profile: ${profile}`);
  const cell = cellForSeed(seed);
  const policy = makePolicy(mulberry32(seed ^ POLICY_RNG_SALT));
  const rec = {
    seed, profile, cell,
    outcome: null, death: null, actReached: 0, floorsReached: 0,
    fights: [], drafts: [], bossRelics: [], shops: [], events: [],
    deck: [], relics: [], potions: [], potionsHeldAtDeath: 0,
    gold: 0, hp: 0, maxHp: 0, issues: [],
  };
  const issue = (kind, phaseName, message, stack) => {
    const entry = { seed, phase: phaseName, kind, message };
    if (stack) entry.stack = stack;
    rec.issues.push(entry);
  };
  // a throwing policy is a policy bug, not an engine bug: flag it and let the
  // call site apply its deterministic fallback (R2)
  const THREW = Symbol('policy-threw');
  const ask = (phaseName, what, fn) => {
    try { return fn(); } catch (err) {
      issue('policy-illegal', phaseName, `${what} threw: ${errMsg(err)}`);
      return THREW;
    }
  };
  const ctxOf = (run, cb = null) => ({ run, cb });
  let run = null;
  let phase = 'node';
  try {
    run = newRun(seed, {
      aspect: cell.aspect, vow: cell.vow, ephemeral: true,
      reveals: profile === 'fresh' ? freshReveals() : null,
      monument: cell.monument ? { act: 0, row: 5, bequest: { kind: 'gold', amount: 40 } } : null,
    });
    applyBoon(run, cell.boon); // applies the boon's ops (newRun only records the id)

    const runCombat = (cb, enc, kind, node) => {
      const fight = {
        enemies: [...enc], kind, affix: cb.affix, act: run.act, row: node.row,
        turns: 0, dmgDealt: 0, dmgTaken: 0, overkill: 0, energyWaste: 0,
        kindles: 0, arts: 0, potionsUsed: 0, result: null,
      };
      const dealt0 = run.stats.dmgDealt, taken0 = run.stats.dmgTaken;
      let lastHitSource = null;
      let turnGuard = 0;
      while (!cb.over && turnGuard++ < TURN_GUARD) {
        let ended = false, actions = 0;
        const endFallback = () => { // deterministic fallback: end the turn
          fight.energyWaste += cb.player.energy;
          endTurn(run, cb);
          ended = true;
        };
        const forceEnd = (why) => { issue('policy-illegal', 'combat', why); endFallback(); };
        while (!cb.over && !ended && actions++ < ACTION_GUARD) {
          const action = ask('combat', 'combatAction', () => policy.combatAction(ctxOf(run, cb), cb));
          if (action === THREW) { endFallback(); continue; }
          const k = action && action.kind;
          if (k === 'end') {
            endFallback();
          } else if (k === 'play') {
            const inst = cb.hand.find((c) => c.uid === action.uid);
            const target = action.target ?? null;
            const badTarget = target !== null &&
              !(Number.isInteger(target) && cb.enemies[target] && cb.enemies[target].hp > 0);
            if (!inst || badTarget || !canPlay(run, cb, inst, target) || !playCard(run, cb, inst.uid, target)) {
              forceEnd(`illegal play (uid=${action.uid}, target=${action.target})`);
            }
          } else if (k === 'kindle') {
            const inst = cb.hand.find((c) => c.uid === action.uid);
            if (!inst || !canKindle(run, cb, inst) || !kindleFromHand(run, cb, inst.uid)) {
              forceEnd(`illegal kindle (uid=${action.uid})`);
            } else fight.kindles++;
          } else if (k === 'art') {
            if (!canUseArt(run, cb) || !useArt(run, cb)) forceEnd('illegal art');
            else fight.arts++;
          } else if (k === 'potion') {
            const ok = Number.isInteger(action.slot) && usePotion(run, cb, action.slot, action.target ?? null);
            if (!ok) forceEnd(`illegal potion (slot=${action.slot})`);
            else fight.potionsUsed++;
          } else {
            forceEnd(`unknown combat action kind: ${String(k)}`);
          }
        }
        if (!cb.over && !ended) forceEnd(`action guard exhausted (${ACTION_GUARD}/turn)`);
        // invariants at the same points the monte-carlo asserts them (KTD9)
        if (!(cb.embers >= 0 && cb.embers <= cb.emberCap)) {
          issue('invariant', 'combat', `embers out of range: ${cb.embers}/${cb.emberCap}`);
        }
        for (const e of cb.enemies) {
          if (e.hp > 0 && !(e.chips < e.facetMax)) {
            issue('invariant', 'combat', `chips >= facetMax on ${e.key}: ${e.chips}/${e.facetMax}`);
          }
        }
        if (cb.player.energy < 0) issue('invariant', 'combat', `negative energy: ${cb.player.energy}`);
        // harvest telemetry, then drain the queue exactly like the monte-carlo
        for (const ev of cb.queue) {
          if (ev.t === 'hitEnemy' && ev.overkill) fight.overkill += ev.overkill;
          else if (ev.t === 'hitPlayer') lastHitSource = ev.source;
        }
        cb.queue.length = 0;
      }
      fight.turns = cb.turn;
      fight.dmgDealt = run.stats.dmgDealt - dealt0;
      fight.dmgTaken = run.stats.dmgTaken - taken0;
      fight.result = cb.result;
      rec.fights.push(fight);
      if (!cb.over) {
        issue('invariant', 'combat', `combat did not terminate (${enc.join()},turns=${turnGuard})`);
        rec.outcome = 'error';
        return;
      }
      if (cb.result === 'loss') {
        const killer = Number.isInteger(lastHitSource)
          ? (cb.enemies[lastHitSource]?.variantId || cb.enemies[lastHitSource]?.key || enc[0])
          : (lastHitSource || enc[0]);
        rec.outcome = 'death';
        rec.death = { act: run.act, row: node.row, enemy: killer, kind };
        rec.potionsHeldAtDeath = run.player.potions.filter(Boolean).length;
      }
    };

    const resolvePendingOp = (p, evRec) => {
      let desc = null;
      if (p === 'remove') desc = { op: 'remove', options: run.player.deck.length > 1 ? removableCards(run) : [] };
      else if (p === 'upgrade') desc = { op: 'upgrade', options: run.player.deck.filter((c) => !c.up && CARDS[c.id].up) };
      else if (p === 'duplicate') desc = { op: 'duplicate', options: [...run.player.deck] };
      else if (p && p.pickCard) desc = { op: 'pickCard', n: p.pickCard, options: rollEventCards(run, p.pickCard) };
      if (!desc) return;
      if (!desc.options.length) { evRec.pending.push({ op: desc.op, resolved: null }); return; }
      let pick = ask('event', `eventPending(${desc.op})`, () => policy.eventPending(ctxOf(run), desc));
      if (pick === THREW) pick = null;
      let resolved = null;
      if (pick != null) {
        if (desc.op === 'pickCard') {
          if (desc.options.includes(pick)) { addCardToDeck(run, pick); resolved = pick; }
          else issue('policy-illegal', 'event', `eventPending(pickCard): ${pick} not offered`);
        } else {
          const inst = desc.options.find((c) => c.uid === pick);
          if (!inst) issue('policy-illegal', 'event', `eventPending(${desc.op}): uid not an option`);
          else if (desc.op === 'remove') { removeCardFromDeck(run, inst.uid); resolved = inst.id; }
          else if (desc.op === 'upgrade') { upgradeCardInDeck(run, inst.uid); resolved = inst.id; }
          else { addCardToDeck(run, inst.id); resolved = inst.id; } // duplicate (copy lands unupgraded, as in the monte-carlo)
        }
      }
      evRec.pending.push({ op: desc.op, resolved });
    };

    let guard = 0;
    while (rec.outcome === null && guard++ < NODE_GUARD) {
      phase = 'node';
      const options = availableNodes(run);
      if (!options.length) { issue('invariant', 'node', 'no available nodes'); rec.outcome = 'error'; break; }
      let node = ask('node', 'pickNode', () => policy.pickNode(ctxOf(run), options));
      if (node === THREW) node = options[0];
      else if (!options.includes(node)) {
        issue('policy-illegal', 'node', 'pickNode: node not on offer');
        node = options[0];
      }
      const { type } = visitNode(run, node);
      if (type === 'monster' || type === 'elite' || type === 'boss') {
        phase = 'combat';
        const enc = rollEncounter(run, type, node.row);
        const cb = startCombat(run, enc, type);
        runCombat(cb, enc, type, node);
        if (rec.outcome !== null) continue; // death or non-terminating combat
        phase = 'reward';
        const rw = genCombatRewards(run, type, cb.affix);
        run.player.gold += rw.gold;
        if (rw.cards.length) {
          let pick = ask('reward', 'pickCardReward', () => policy.pickCardReward(ctxOf(run), rw.cards));
          if (pick === THREW) pick = null;
          else if (pick != null && !rw.cards.includes(pick)) {
            issue('policy-illegal', 'reward', `pickCardReward: ${pick} not offered`);
            pick = null; // deterministic fallback: skip
          }
          if (pick) addCardToDeck(run, pick);
          rec.drafts.push({ offered: [...rw.cards], picked: pick ?? null, kind: type, act: run.act });
        }
        if (rw.potion) gainPotion(run, rw.potion);
        if (rw.relic) gainRelic(run, rw.relic);
        if (type === 'boss') {
          if (run.act >= 2) { rec.outcome = 'win'; continue; }
          const bosses = rollBossRelics(run);
          if (bosses.length) {
            let pick = ask('reward', 'pickBossRelic', () => policy.pickBossRelic(ctxOf(run), bosses));
            if (pick === THREW) pick = bosses[0];
            else if (!bosses.includes(pick)) {
              issue('policy-illegal', 'reward', `pickBossRelic: ${pick} not offered`);
              pick = bosses[0];
            }
            rec.bossRelics.push({ offered: [...bosses], picked: pick, act: run.act });
            gainRelic(run, pick);
          }
          run.act++;
          run.nodeId = null;
          run.map = genMap(run);
          healPlayer(run, Math.round(run.player.maxHp * 0.3));
        }
      } else if (type === 'rest') {
        const d = ask('node', 'restDecision', () => policy.restDecision(ctxOf(run)));
        const upgradable = run.player.deck.filter((c) => !c.up && CARDS[c.id].up);
        const inst = d !== THREW && d?.kind === 'upgrade' ? upgradable.find((c) => c.uid === d.uid) : null;
        if (inst) upgradeCardInDeck(run, inst.uid);
        else {
          if (d !== THREW && !(d && d.kind === 'heal')) issue('policy-illegal', 'node', 'restDecision: invalid decision');
          healPlayer(run, Math.round(run.player.maxHp * 0.3)); // deterministic fallback: heal
        }
      } else if (type === 'event') {
        phase = 'event';
        const evId = rollEvent(run);
        const ev = EVENTS[evId];
        const valid = ev.choices.filter((c) => !c.needGold || run.player.gold >= c.needGold);
        if (!valid.length) rec.events.push({ id: evId, choice: -1, pending: [] });
        else {
          let choice = ask('event', 'eventChoice', () => policy.eventChoice(ctxOf(run), ev, valid));
          if (choice === THREW) choice = valid[0];
          else if (!valid.includes(choice)) {
            issue('policy-illegal', 'event', 'eventChoice: choice not offered');
            choice = valid[0];
          }
          const { pending } = applyEventOps(run, choice.ops);
          const evRec = { id: evId, choice: ev.choices.indexOf(choice), pending: [] };
          for (const p of pending) resolvePendingOp(p, evRec);
          rec.events.push(evRec);
        }
      } else if (type === 'shop') {
        phase = 'shop';
        const shop = genShop(run);
        let plan = ask('shop', 'shopPlan', () => policy.shopPlan(ctxOf(run), shop));
        if (plan === THREW) plan = [];
        else if (!Array.isArray(plan)) { issue('policy-illegal', 'shop', 'shopPlan: not an array'); plan = []; }
        const bought = [];
        for (const it of plan) {
          const bucket = shop.cards.includes(it) ? 'card'
            : shop.relics.includes(it) ? 'relic'
            : shop.potions.includes(it) ? 'potion' : null;
          if (!bucket || it.sold || it.price > run.player.gold) {
            issue('policy-illegal', 'shop', `shopPlan: illegal purchase (${it && it.id})`);
            continue;
          }
          run.player.gold -= it.price;
          it.sold = true;
          if (bucket === 'card') addCardToDeck(run, it.id);
          else if (bucket === 'relic') gainRelic(run, it.id);
          else gainPotion(run, it.id);
          bought.push({ kind: bucket, id: it.id, price: it.price });
        }
        rec.shops.push({
          act: run.act,
          offered: {
            cards: shop.cards.map((i) => i.id),
            relics: shop.relics.map((i) => i.id),
            potions: shop.potions.map((i) => i.id),
          },
          bought,
        });
      } else if (type === 'treasure') {
        const r = randomRelic(run);
        if (r) gainRelic(run, r);
      } else if (type === 'monument') {
        claimMonument(run);
      }
      if (rec.outcome === null) {
        // node invariants (mirror randomAgentRun's post-node asserts, plus R3's bounds)
        if (!(run.player.hp > 0)) { issue('invariant', 'node', `hp <= 0 after node (${run.player.hp})`); rec.outcome = 'error'; }
        if (run.player.hp > run.player.maxHp) issue('invariant', 'node', `hp > maxHp (${run.player.hp}/${run.player.maxHp})`);
        if (run.player.gold < 0) issue('invariant', 'node', `negative gold: ${run.player.gold}`);
        if (!run.player.deck.length) issue('invariant', 'node', 'deck is empty');
        const uids = new Set(run.player.deck.map((c) => c.uid));
        if (uids.size !== run.player.deck.length) issue('invariant', 'node', 'duplicate deck uids');
      }
    }
    if (rec.outcome === null) {
      issue('invariant', 'node', `run did not terminate within ${NODE_GUARD} nodes`);
      rec.outcome = 'error';
    }
  } catch (err) {
    issue('engine-error', phase, errMsg(err), issueStack(err));
    rec.outcome = 'error';
  }
  if (run) {
    rec.actReached = run.act;
    rec.floorsReached = run.act * MAP_ROWS + run.floorsClimbed;
    rec.deck = run.player.deck.map((c) => ({ id: c.id, up: !!c.up }));
    rec.relics = [...run.player.relics];
    rec.potions = run.player.potions.filter(Boolean);
    rec.gold = run.player.gold;
    rec.hp = Math.max(0, run.player.hp);
    rec.maxHp = run.player.maxHp;
  }
  return rec;
}
