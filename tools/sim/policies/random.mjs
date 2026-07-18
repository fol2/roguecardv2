// The floor-baseline policy: reproduces the test_engine.js monte-carlo
// agent's behaviour under the walker's policy contract — 90% play-chance
// loop, 25% kindle, 40% art, 50/50 rest, 40% shop buys, 80% card take.
// Decisions consume only the policy's own rng stream (KTD7).
import { cardData, canUseArt } from '../../../src/engine.js';
import { CARDS } from '../../../src/data.js';

export function makePolicy(rng) {
  const choice = (arr) => arr[Math.floor(rng() * arr.length)];
  // per-turn phase memory: the walker asks one action at a time, so the
  // monte-carlo's play-loop → kindle → art → end shape is replayed here
  let curCb = null, curTurn = 0, phase = 'play', plays = 0;
  return {
    pickNode(ctx, nodes) { return choice(nodes); },
    combatAction(ctx, cb) {
      if (cb !== curCb || cb.turn !== curTurn) { curCb = cb; curTurn = cb.turn; phase = 'play'; plays = 0; }
      if (phase === 'play') {
        const playable = cb.hand.filter((c) => {
          const d = cardData(c, ctx.run);
          return !d.unplayable && (d.cost ?? 99) <= cb.player.energy;
        });
        if (playable.length && plays < 30 && rng() < 0.9) {
          plays++;
          const living = cb.enemies.map((e, i) => (e.hp > 0 ? i : -1)).filter((i) => i >= 0);
          return { kind: 'play', uid: choice(playable).uid, target: living.length ? choice(living) : null };
        }
        phase = 'kindle';
      }
      if (phase === 'kindle') {
        phase = 'art';
        const kindlable = cb.hand.filter((c) => cardData(c, ctx.run).type !== 'curse');
        if (kindlable.length && rng() < 0.25) return { kind: 'kindle', uid: choice(kindlable).uid };
      }
      if (phase === 'art') {
        phase = 'end';
        if (canUseArt(ctx.run, cb) && rng() < 0.4) return { kind: 'art' };
      }
      return { kind: 'end' };
    },
    pickCardReward(ctx, cards) { return rng() < 0.8 ? choice(cards) : null; },
    pickBossRelic(ctx, relicIds) { return choice(relicIds); },
    restDecision(ctx) {
      if (rng() < 0.5) return { kind: 'heal' };
      const up = ctx.run.player.deck.filter((c) => !c.up && CARDS[c.id].up);
      return up.length ? { kind: 'upgrade', uid: choice(up).uid } : { kind: 'heal' };
    },
    eventChoice(ctx, ev, valid) { return choice(valid); },
    eventPending(ctx, pending) {
      const pick = choice(pending.options);
      return pending.op === 'pickCard' ? pick : pick.uid;
    },
    shopPlan(ctx, shop) {
      const plan = [];
      let gold = ctx.run.player.gold;
      for (const it of [...shop.cards, ...shop.relics, ...shop.potions]) {
        if (!it.sold && it.price <= gold && rng() < 0.4) { plan.push(it); gold -= it.price; }
      }
      return plan;
    },
  };
}
