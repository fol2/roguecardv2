// Engine queue playback and event-to-presentation dispatch.

export function createDrain({
  E, contentViewFor, QUESTS, cardEl, iconSvg, assetUrl, drawBatchSchedule,
  V, sfx, kick, meshDeath, meshEnabled, meshHandoff, meshRelease,
  $, $$, S, el, escHtml, presentationBarrier, screenEl, sleep, trace,
  REDUCED, combatantView, stageW, stageH, stageRect, tr, presentation,
}) {
  if (!Object.isFrozen(presentation)) {
    throw new TypeError('createDrain requires frozen combat presentation handlers');
  }
  if (typeof cardEl !== 'function') {
    throw new TypeError('createDrain requires the immutable card renderer dependency');
  }
  if (typeof contentViewFor !== 'function') {
    throw new TypeError('createDrain requires contentViewFor');
  }
  const runCatalogues = () => contentViewFor(S.run);

  /** Task 26 — revoke composer object URLs / drop cache refs before discarding a face host. */
  function releaseCardFace(node) {
    if (!node || typeof node._cardFaceRelease !== 'function') return;
    try { node._cardFaceRelease(); } catch { /* ignore */ }
    node._cardFaceRelease = null;
  }
  /** Move export ownership onto a clone/flycard so the seat can detach without revoking early. */
  function adoptCardFaceRelease(from, to) {
    if (!from || !to) return;
    if (typeof from._cardFaceRelease === 'function') {
      to._cardFaceRelease = from._cardFaceRelease;
      from._cardFaceRelease = null;
    }
  }
  function removeHandCard(node) {
    if (!node) return;
    releaseCardFace(node);
    node.remove();
  }

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
async function drain(targetIdx = null) {
  const cb = S.cb, ce = S.ce;
  const queueSpan = trace.begin('playback.queue', { attributes: { initialDepth: cb.queue.length } });
  const queueCauseSeq = trace.enabled ? trace.read().lastSeq : null;
  try {
    S.busy = true;
    ce.endTurn.classList.add('enemy-phase');
    const q = cb.queue;
    while (q.length) {
      const ev = q[0];
      try {
        // drawCards may emit draw* → reshuffle → draw*; keep one wave so hand stays paced
        if (ev.t === 'draw' || ev.t === 'reshuffle') {
          await handleDrawWave(q, queueCauseSeq);
        } else {
          q.shift();
          const eventSpan = trace.begin('playback.queue-event', {
            ...(queueCauseSeq ? { causeSeq: queueCauseSeq } : {}),
            attributes: { eventType: ev.t },
          });
          try {
            await handleEvent(ev, targetIdx);
            eventSpan.finish('completed');
          } catch (error) {
            eventSpan.finish('failed', { reason: 'handler-error' });
            throw error;
          }
        }
      } catch (err) {
        trace.emit('error.playback', { outcome: 'failed', attributes: { code: 'queue-event-failed', eventType: ev.t } });
        console.error('vfx event error', ev, err);
      }
    }
    S.busy = false;
    if (!cb.over) ce.endTurn.classList.remove('enemy-phase');
    presentation.clearPileVisualOverride();
    presentation.syncCombat();
    presentation.syncHand();
    presentation.renderHud();
    queueSpan.finish('completed');
    trace.emit('checkpoint.ui', { outcome: 'completed', checkpoint: presentation.semanticUiCheckpoint() });
  } catch (error) {
    queueSpan.finish('failed', { reason: 'drain-error' });
    throw error;
  } finally {
    S.busy = false;
  }
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
  if (presentation.hasPileVisualOverride()) {
    presentation.setPileVisualOverride('discard', n);
    presentation.setPileVisualOverride('draw', 0);
    presentation.syncPileWidgets(cb);
  } else {
    presentation.holdPileVisual('draw', n);
    presentation.syncPileWidgets(cb);
  }
  const origins = Array.from({ length: n }, () => V.centerOf(ce.discard));
  await presentation.flyCardBacks(origins, ce.draw, 560, {
    fromSize: 'pile', sizePile: ce.discard, pileArt: 'discard',
  });
  if (presentation.hasPileVisualOverride()) {
    presentation.setPileVisualOverride('discard', 0);
    presentation.setPileVisualOverride('draw', n);
  } else {
    presentation.releasePileVisual('draw', n);
  }
  presentation.bumpPile(ce.draw);
  V.floatText(V.centerOf(ce.draw).x, V.centerOf(ce.draw).y - 46, tr('ui.combat.reshuffle'), 'notice');
  presentation.syncPileWidgets(cb);
}

/** One drawCards wave: pre-pending all hand seats, then draw / reshuffle / draw in order. */
async function handleDrawWave(q, queueCauseSeq = null) {
  const cb = S.cb, ce = S.ce;
  const segments = takeDrawWaveSegments(q);
  const eventSpans = new Map();
  const openEvents = new Set();
  try {
    for (const segment of segments) {
      const events = segment.t === 'reshuffle' ? [segment.ev] : segment.draws;
      for (const event of events) {
        eventSpans.set(event, trace.begin('playback.queue-event', {
          ...(queueCauseSeq ? { causeSeq: queueCauseSeq } : {}),
          attributes: { eventType: event.t },
        }));
        openEvents.add(event);
      }
    }
    const reshuffle = segments.find((s) => s.t === 'reshuffle');

  // Resting seats only — clear hover so flyers never aim at a lifted card
  if (S.hoveredCard != null) S.hoveredCard = null;

  // Engine is already post-draw — reconstruct chrome so piles still look pre-wave
  const firstSegDraws = segments[0]?.t === 'draws' ? segments[0].draws.length : 0;
  presentation.replacePileVisualOverride({
    // mid-reshuffle wave: only the pre-reshuffle stock is still "in" the draw pile
    // plain draw wave: remaining engine draw + cards about to fly
    draw: segments[0]?.t === 'draws'
      ? (reshuffle ? firstSegDraws : cb.draw.length + firstSegDraws)
      : 0,
    discard: reshuffle ? (reshuffle.ev.n || 0) : 0,
  });

  // Pre-mark EVERY card in this wave as pending before presentation.syncHand (fixes mid-reshuffle pop-in)
  presentation.clearDrawRevealPlan();
  let seq = 0;
  for (const seg of segments) {
    if (seg.t !== 'draws') continue;
    for (const ev of seg.draws) {
      presentation.setDrawRevealPlan(String(ev.uid), { landAt: null, seq: seq++ });
    }
  }
  presentation.syncHand();
  presentation.syncPileWidgets(cb);

  let baseFan = $$('.card', ce.hand).filter((c) => !c.classList.contains('draw-pending')).length;
  let arrival = 0;

  for (const seg of segments) {
    if (seg.t === 'reshuffle') {
      await playReshuffleCeremony(seg.ev);
      eventSpans.get(seg.ev)?.finish('completed');
      openEvents.delete(seg.ev);
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
      presentation.deleteDrawRevealPlan(uid);
      const c = $(`.card[data-uid="${uid}"]`, ce.hand);
      if (c && !REDUCED) presentation.scheduleHandReveal(c, landAt);
      else if (c) {
        c.classList.remove('draw-pending');
      }
    });

    if (!REDUCED) {
      const origin = V.centerOf(ce.draw);
      const fromList = draws.map((ev, i) => {
        const inst = cb.hand.find((c) => String(c.uid) === String(ev.uid))
          || { uid: ev.uid, id: ev.id, up: false, bonus: 0 };
        const dest = presentation.handSeatCenter(baseFan + arrival + i, baseFan + arrival + i + 1);
        return { x: origin.x, y: origin.y, inst, dest };
      });
      // Shrink visual draw as each flyer leaves the pile
      draws.forEach((_, i) => {
        setTimeout(() => {
          if (!presentation.hasPileVisualOverride()) return;
          presentation.setPileVisualOverride('draw', Math.max(0, (presentation.readPileVisualOverride('draw') || 0) - 1));
          presentation.syncPileWidgets(cb);
        }, i * sched.stagger);
      });
      presentation.flyCardBacks(fromList, ce.hand, 500, {
        fromSize: 'pile', toSize: 'hand', sizePile: ce.draw, face: 'card', schedule: sched,
      });
      presentation.bumpPile(ce.draw);
      draws.forEach((_, i) => setTimeout(() => sfx.draw(), i * sched.stagger));
      await sleep(sched.awaitMs);
    } else {
      presentation.layoutHand();
      await sleep(40);
    }
    arrival += n;
    if (presentation.hasPileVisualOverride()) {
      // snap to remaining visual after segment (post-reshuffle draw shrinks by n)
      presentation.setPileVisualOverride('draw', Math.max(0, (presentation.readPileVisualOverride('draw') || 0)));
    }
    presentation.syncPileWidgets(cb);
    for (const event of draws) {
      eventSpans.get(event)?.finish('completed');
      openEvents.delete(event);
    }
  }

  presentation.clearPileVisualOverride();
  presentation.syncCombat();
  } catch (error) {
    for (const event of openEvents) {
      eventSpans.get(event)?.finish('failed', { reason: 'draw-wave-error' });
    }
    openEvents.clear();
    throw error;
  }
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
      const { x: ex, y: ey } = presentation.enemyCenter(ev.idx);
      sfx.chip();
      V.burst(ex, ey, { color: '#e8f4ff', n: 5, speed: 190, size: 1.8, grav: 240, kind: 'spark' });
      presentation.syncCombat();
      x.facets.classList.remove('pop');
      void x.facets.offsetWidth;
      x.facets.classList.add('pop');
      await sleep(110);
      break;
    }
    case 'shatter': {
      const x = ce.enemies[ev.idx];
      const { x: ex, y: ey } = presentation.enemyCenter(ev.idx);
      emberFrom = { x: ex, y: ey };
      sfx.shatter();
      V.hitstop(90);
      V.ring(ex, ey, '#dfeaff', 10, 700, 5);
      V.burst(ex, ey, { color: '#dfeaff', n: 26, speed: 430, size: 2.4, grav: 300, kind: 'spark' });
      V.floatText(ex, ey - 58, `${iconSvg('stagger', 20)} ${tr('ui.combat.shatter')}`, 'shatterf');
      V.shake(10);
      kick(0.9);
      presentation.addCrack(x.art, true);
      x.root.classList.add('hurt');
      setTimeout(() => x.root.classList.remove('hurt'), 320);
      presentation.syncCombat();
      await sleep(380);
      break;
    }
    case 'adamantHold': {
      const { x: ex, y: ey } = presentation.enemyCenter(ev.idx);
      sfx.blocked();
      V.floatText(ex, ey - 52, tr('ui.combat.glassHolds'), 'blockedf');
      V.ring(ex, ey, '#d8c27a', 8, 480, 4);
      presentation.syncCombat();
      await sleep(260);
      break;
    }
    case 'questReveal': {
      const quest = QUESTS[ev.id];
      const disclosure = E.questDisclosure(S.run, ev.id);
      const progress = quest.huntName
        ? ` (${disclosure.progress}/${disclosure.target})`
        : '';
      presentation.banner(escHtml(`${quest.mode.toUpperCase()} REVEALED — ${disclosure.name}${progress}`));
      await sleep(REDUCED ? 40 : 1150);
      break;
    }
    case 'questProgress': {
      presentation.banner(escHtml(`${E.questProgressName(ev.id, ev.target)} — ${ev.progress}/${ev.target}`));
      await sleep(REDUCED ? 40 : 1150);
      break;
    }
    case 'questComplete': {
      presentation.banner(escHtml(`${QUESTS[ev.id].name.toUpperCase()} — COMPLETE`));
      await sleep(REDUCED ? 40 : 1150);
      break;
    }
    case 'questUnlock': {
      const text = ev.id === 'insight:witchlightLens'
        ? 'WITCHLIGHT LENS — PALE PATHS REVEALED'
        : ev.id;
      presentation.banner(escHtml(text));
      await sleep(REDUCED ? 40 : 1150);
      break;
    }
    case 'monumentGift': {
      presentation.banner(tr('ui.combat.monumentGift'));
      await sleep(REDUCED ? 40 : 1150);
      break;
    }
    case 'hollowTithe': {
      const from = emberFrom || presentation.heroCenter();
      const to = ce.lantern ? V.centerOf(ce.lantern) : presentation.heroCenter();
      presentation.flyTo(from.x, from.y, to.x, to.y, {
        n: Math.min(ev.n * 2, 6), color: '#91a0af', size: 5, dur: 520,
      });
      sfx.ember();
      V.floatText(to.x, to.y - 48, `−${ev.n} TO THE HOLLOW`, 'debufff');
      presentation.banner(escHtml(ev.remaining > 0 ? `${ev.remaining} EMBERS STILL OWED` : ev.paid));
      presentation.syncCombat();
      emberFrom = null;
      await sleep(REDUCED ? 40 : 1150);
      break;
    }
    case 'ember': {
      if (ev.n > 0 && ce.lantern) {
        const from = emberFrom || presentation.heroCenter();
        const to = V.centerOf(ce.lantern);
        presentation.flyTo(from.x, from.y, to.x, to.y, { n: Math.min(ev.n * 2, 5), color: '#ffb35a', size: 6, dur: 460 });
        sfx.ember();
        setTimeout(() => {
          ce.lantern.classList.remove('pop');
          void ce.lantern.offsetWidth;
          ce.lantern.classList.add('pop');
          presentation.syncCombat();
        }, 440);
        await sleep(300);
      } else presentation.syncCombat();
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
      const art = runCatalogues().arts[ev.id];
      const { x: hx, y: hy } = presentation.heroCenter();
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
      presentation.syncCombat();
      await sleep(420);
      break;
    }
    case 'staggered': {
      const x = ce.enemies[ev.idx];
      const { x: ex, y: ey } = presentation.enemyCenter(ev.idx);
      sfx.stagger();
      V.floatText(ex, ey - 76, tr('ui.combat.staggered'), 'staggerf');
      x.root.classList.add('reseaming');
      setTimeout(() => x.root.classList.remove('reseaming'), 720);
      presentation.syncCombat();
      await sleep(520);
      break;
    }
    case 'smolderJump': {
      const a = presentation.enemyCenter(ev.from), b = presentation.enemyCenter(ev.to);
      sfx.poison();
      presentation.flyTo(a.x, a.y, b.x, b.y, { n: 5, color: '#d3a15a', size: 7, dur: 460 });
      await sleep(400);
      break;
    }
    case 'turn': {
      if (ev.n > 1) { presentation.banner(tr('ui.combat.yourTurn')); sfx.turn(); }
      presentation.syncCombat();
      await sleep(ev.n > 1 ? 500 : 120);
      break;
    }
    case 'endTurn': heroActing = false; presentation.banner(tr('ui.combat.enemyTurn')); await sleep(480); break;
    case 'draw': {
      await handleDrawWave([ev]);
      break;
    }
    case 'reshuffle': {
      await playReshuffleCeremony(ev);
      presentation.syncCombat();
      break;
    }
    case 'play': {
      const c = $(`.card[data-uid="${ev.uid}"]`, ce.hand);
      sfx.card();
      heroActing = true;
      hitSeq = 0;
      vfxSource = { archetype: runCatalogues().cards[ev.id]?.vfx || 'slash', cardId: ev.id, enemyIdx: null };
      bespokeFired = false;
      choreoDone = false;
      if (!bespokeFired && V.BESPOKE_VFX[ev.id] && ['ascension', 'pyreheart', 'emberdance', 'limitBreak'].includes(ev.id)) {
        const living = cb.enemies.findIndex((e) => e.hp > 0);
        const pos = ev.id === 'limitBreak' && living >= 0 ? presentation.enemyCenter(living) : presentation.heroCenter();
        V.BESPOKE_VFX[ev.id](pos.x, pos.y);
        bespokeFired = true;
      }
      if (c && targetIdx != null && cb.enemies[targetIdx]) {
        // targeted attacks: the card itself streaks into the enemy
        const r = stageRect(c); // ghost is fixed inside the stage
        const { x: tx, y: ty } = presentation.enemyCenter(targetIdx);
        // Discard/exhaust should resume from where the streak ends, not the hand seat
        presentation.setCardFlightAnchor(ev.uid, { x: tx, y: ty, w: r.width * 0.22, h: r.height * 0.22 });
        const ghost = c.cloneNode(true);
        Object.assign(ghost.style, { position: 'fixed', left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px`, margin: 0, transform: 'none', zIndex: 56, pointerEvents: 'none' });
        document.getElementById('floaties').appendChild(ghost);
        adoptCardFaceRelease(c, ghost);
        c.remove();
        ghost.animate(
          [{ transform: 'none', opacity: 1 }, { transform: `translate(${tx - r.left - r.width / 2}px,${ty - r.top - r.height / 2}px) scale(0.22) rotate(14deg)`, opacity: 0 }],
          { duration: 270, easing: 'cubic-bezier(.45,0,.9,.5)' }
        ).onfinish = () => {
          releaseCardFace(ghost);
          ghost.remove();
        };
      } else if (c) {
        // Tap/click: play lifts the card — recapture AFTER played-up so discard starts there.
        // Drag: keep the release-seat anchor (fromDrag); clearTargeting already reflowed the DOM.
        c.classList.add('played-up');
        void c.offsetWidth;
        const prev = presentation.peekCardAnchor(ev.uid);
        if (!prev?.fromDrag) presentation.captureCardAnchor(ev.uid, c);
      }
      // engine already pushed discard/exhaust; hold pile chrome until those flights land
      presentation.holdPendingPileArrivals(cb, ev.uid);
      presentation.syncCombat();
      await sleep(200);
      break;
    }
    case 'hitEnemy': {
      const x = ce.enemies[ev.idx];
      const { x: ex, y: ey } = presentation.enemyCenter(ev.idx);
      if (ev.poison) {
        sfx.poison();
        V.motes(ex, ey, '#d3a15a', 14);
        V.floatText(ex, ey - 20, `${ev.amount}`, 'poisonf');
      } else {
        const big = ev.amount >= 16;
        if (heroActing && vfxSource.cardId && !String(vfxSource.cardId).startsWith('art:')) {
          if (!choreoDone) { await presentation.choreoAttack(ce.hero, 1, 'humanoid'); choreoDone = true; }
        }
        sfx.attack({ who: 'hero', amount: ev.amount, blocked: ev.blocked });
        if (!bespokeFired && vfxSource.cardId && V.BESPOKE_VFX[vfxSource.cardId]) {
          V.BESPOKE_VFX[vfxSource.cardId](ex, ey);
          bespokeFired = true;
        }
        V.archetypeHit(ex, ey, vfxSource.archetype, Math.min(1, ev.amount / 24));
        presentation.choreoHit(x.root, 1);
        if (ev.blocked > 0) {
          sfx.blocked();
          V.floatText(ex, ey + 26, `${iconSvg('shield', 19)}${ev.blocked}`, 'blockedf');
          V.burst(ex, ey + 8, { color: '#9fd4ff', n: 9, speed: 210, size: 2, grav: 260, kind: 'spark' }); // ward chips off
          if (cb.enemies[ev.idx].block === 0 && ev.amount === 0) {
            V.floatText(ex, ey - 2, tr('ui.combat.guardShattered'), 'shatterf');
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
        if (ev.amount > 0) presentation.addCrack(x.art, big);
      }
      x.root.classList.add('hurt');
      setTimeout(() => x.root.classList.remove('hurt'), 320);
      presentation.syncCombat();
      await sleep(230);
      break;
    }
    case 'die': {
      const x = ce.enemies[ev.idx];
      const en = cb.enemies[ev.idx];
      const { x: ex, y: ey } = presentation.enemyCenter(ev.idx);
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
      await presentation.choreoStagger(x.art);
      // the vessel fails: fire wells up through the fractures (ramped, not snapped)
      // and the INSTANT the blaze peaks the glass gives way — no held beat
      const beat = en.boss ? 320 : 200;
      if (!REDUCED) { presentation.igniteVessel(x, beat); await sleep(beat); }
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
      const { x: hx, y: hy } = presentation.heroCenter();
      if (ev.source === 'poison') { sfx.poison(); V.motes(hx, hy, '#d3a15a', 14); }
      else if (ev.source === 'burn' || ev.source === 'self') sfx.debuff();
      else if (ev.source === 'thorns') sfx.blocked();
      else {
        sfx.attack({ who: 'enemy', amount: ev.amount, blocked: ev.blocked });
        if (ev.amount > 0) V.flash('#ff2233', Math.min(0.05 + ev.amount * 0.012, 0.3), 0.3);
        V.archetypeHit(hx, hy, vfxSource.archetype, Math.min(1, ev.amount / 24));
        presentation.choreoHit(ce.hero, -1);
      }
      if (ev.blocked > 0) {
        sfx.blocked();
        V.floatText(hx, hy + 30, `${iconSvg('shield', 19)}${ev.blocked}`, 'blockedf');
        V.burst(hx, hy + 8, { color: '#9fd4ff', n: 9, speed: 210, size: 2, grav: 260, kind: 'spark' });
        if (cb.player.block === 0 && ev.amount === 0) {
          V.floatText(hx, hy - 2, tr('ui.combat.guardShattered'), 'shatterf');
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
      presentation.syncCombat(); presentation.renderHud();
      await sleep(240);
      break;
    }
    case 'blockGain': {
      const isP = ev.who === 'player';
      const { x, y } = isP ? presentation.heroCenter() : presentation.enemyCenter(ev.who);
      sfx.block();
      const host = isP
        ? ($('.hero-sprite', ce.hero) || ce.hero)
        : ($('.enemy-sprite', ce.enemies[ev.who]?.art) || ce.enemies[ev.who]?.art);
      presentation.syncWardMesh(host, true, true);
      V.floatText(x, y - 10, `${iconSvg('shield', 22)} ${ev.n}`, 'blockf');
      const chip = isP ? ce.pBlock : ce.enemies[ev.who].block;
      chip.classList.remove('pulse');
      void chip.offsetWidth;
      chip.classList.add('pulse');
      presentation.syncCombat();
      await sleep(140);
      break;
    }
    case 'status': {
      const isP = ev.who === 'player';
      const { x, y } = isP ? presentation.heroCenter() : presentation.enemyCenter(ev.who);
      const info = runCatalogues().statuses[ev.id] || { name: ev.id, kind: 'buff' };
      const isDebuff = info.kind === 'debuff' || (ev.id === 'str' && ev.n < 0);
      (ev.id === 'poison' ? sfx.poison : isDebuff ? sfx.debuff : sfx.buff)();
      V.floatText(x, y - 46, `${ev.n > 0 ? '+' : ''}${ev.n} ${info.name}`, isDebuff ? 'debufff' : 'bufff');
      if (!isDebuff) V.motes(x, y, '#9fc8ff', 6);
      presentation.syncCombat();
      await sleep(170);
      break;
    }
    case 'heal': {
      const isP = ev.who === 'player';
      const { x, y } = isP ? presentation.heroCenter() : presentation.enemyCenter(ev.who);
      sfx.heal();
      V.motes(x, y, '#8fe8a0', 14);
      V.floatText(x, y - 30, `+${ev.n}`, 'healf');
      presentation.syncCombat(); presentation.renderHud();
      await sleep(200);
      break;
    }
    case 'energy':
      sfx.energy();
      presentation.syncCombat();
      ce.energy.classList.remove('pop');
      void ce.energy.offsetWidth;
      ce.energy.classList.add('pop');
      break;
    case 'exhaust': {
      const c = $(`.card[data-uid="${ev.uid}"]`, ce.hand);
      const anchor = presentation.takeCardAnchor(ev.uid);
      const inst = presentation.pileCardByUid(cb.exhaust, ev.uid);
      if (REDUCED) {
        if (c) removeHandCard(c);
        presentation.releasePileVisual('ashes', 1);
        presentation.syncCombat();
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
        if (!origin && inst) origin = { ...V.centerOf(ce.hand), ...presentation.handFaceSize(), inst };
        if (c) {
          c.classList.add('draw-pending');
          presentation.layoutHand();
        }
        if (inst && origin) {
          await presentation.flyCardBacks([{ ...origin, inst }], ce.exhaust, 200, {
            fromSize: 'src', toSize: 'pile', sizePile: ce.exhaust, face: 'card', cardInst: inst,
            schedule: { stagger: 0, flightDur: 200, awaitMs: 200 },
            arc: 'smooth', easing: 'cubic-bezier(.22,.7,.28,1)',
          });
        }
        if (c) removeHandCard(c);
        presentation.releasePileVisual('ashes', 1);
        presentation.bumpPile(ce.exhaust);
        presentation.syncCombat();
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
        adoptCardFaceRelease(c, ghost);
        c.remove();
        ghost.animate(
          [
            { clipPath: 'circle(80% at 50% 55%)', filter: 'brightness(1)' },
            { clipPath: 'circle(44% at 50% 55%)', filter: 'brightness(1.8) saturate(1.6) sepia(0.45)', offset: 0.45 },
            { clipPath: 'circle(0% at 50% 55%)', filter: 'brightness(2.6) saturate(2) sepia(0.85)' },
          ],
          { duration: 540, easing: 'ease-in' }
        ).onfinish = () => {
          releaseCardFace(ghost);
          ghost.remove();
        };
        V.burst(start.x, start.y, { color: '#ffb066', n: 22, speed: 190, grav: -150, size: 2.4, life: 0.85 });
        const a1 = V.centerOf(ce.exhaust);
        presentation.flyTo(start.x, start.y, a1.x, a1.y, { n: 8, color: '#ffb066', size: 5, dur: 480 });
        presentation.bumpPile(ce.exhaust);
        await sleep(260);
      } else if (c) {
        removeHandCard(c);
      }
      presentation.releasePileVisual('ashes', 1);
      presentation.syncCombat();
      break;
    }
    case 'discardHand': {
      // Same even-stagger clock as draw: each unplayed hand card flies in order
      const uids = ev.uids || [];
      const n = uids.length;
      sfx.card();
      if (!n) { presentation.syncCombat(); break; }
      if (REDUCED) {
        uids.forEach((uid) => {
          presentation.takeCardAnchor(uid);
          removeHandCard($(`.card[data-uid="${uid}"]`, ce.hand));
        });
        presentation.syncCombat();
        break;
      }
      presentation.holdPileVisual('discard', n);
      const sched = drawBatchSchedule(n, 500);
      // Snapshot seats FIRST (before hiding) — clone the live card so the flyer matches the hand
      const flights = [];
      for (const uid of uids) {
        const elc = $(`.card[data-uid="${uid}"]`, ce.hand);
        const inst = presentation.pileCardByUid(cb.discard, uid)
          || { uid, id: elc?.dataset?.id, up: false, bonus: 0 };
        const anchor = presentation.takeCardAnchor(uid);
        let origin;
        if (anchor) {
          origin = { x: anchor.x, y: anchor.y, w: anchor.w, h: anchor.h };
        } else if (elc) {
          const r = stageRect(elc);
          origin = { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height };
        } else {
          origin = { ...V.centerOf(ce.hand), ...presentation.handFaceSize() };
        }
        flights.push({ ...origin, inst, el: elc });
      }
      // Hide seats only after snapshots — fan reflows without ghosts
      for (const f of flights) {
        if (f.el) f.el.classList.add('draw-pending');
      }
      presentation.layoutHand();
      if (flights.length) {
        const layer = $('#floaties');
        const dest = V.centerOf(ce.discard);
        const pileSz = presentation.pileFaceSize(ce.discard);
        flights.forEach((src, i) => {
          const layoutW = src.w > 2 ? src.w : presentation.handFaceSize().w;
          const layoutH = src.h > 2 ? src.h : presentation.handFaceSize().h;
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
            // Task 26 — clone shares the blob URL; transfer release so seat detach is safe.
            adoptCardFaceRelease(src.el, m);
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
          ).onfinish = () => {
            releaseCardFace(m);
            m.remove();
          };
          setTimeout(() => {
            presentation.releasePileVisual('discard', 1);
            presentation.syncPileWidgets(cb);
            presentation.bumpPile(ce.discard);
            sfx.card();
          }, sched.flightDur + i * sched.stagger);
        });
        await sleep(sched.awaitMs);
        const left = n - flights.length;
        if (left > 0) presentation.releasePileVisual('discard', left);
      } else {
        presentation.releasePileVisual('discard', n);
      }
      uids.forEach((uid) => removeHandCard($(`.card[data-uid="${uid}"]`, ce.hand)));
      presentation.syncCombat();
      break;
    }
    case 'toDiscard': {
      const c = $(`.card[data-uid="${ev.uid}"]`, ce.hand);
      const anchor = presentation.takeCardAnchor(ev.uid);
      const inst = presentation.pileCardByUid(cb.discard, ev.uid);
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
          presentation.releasePileVisual('discard', 1);
          presentation.bumpPile(ce.discard);
          presentation.syncCombat();
          break;
        }
        if (c) {
          c.classList.add('draw-pending');
          presentation.layoutHand();
        }
        await presentation.flyCardBacks([origin], ce.discard, 200, {
          fromSize: 'src', toSize: 'pile', sizePile: ce.discard, face: 'card', cardInst: inst,
          schedule: { stagger: 0, flightDur: 200, awaitMs: 200 },
          arc: 'smooth', easing: 'cubic-bezier(.22,.7,.28,1)',
        });
        if (c) removeHandCard(c);
      } else if (c) {
        removeHandCard(c);
      } else if (!REDUCED && inst) {
        await presentation.flyCardBacks([{ ...V.centerOf(ce.hand), ...presentation.handFaceSize(), inst }], ce.discard, 200, {
          fromSize: 'hand', toSize: 'pile', sizePile: ce.discard, face: 'card', cardInst: inst,
          schedule: { stagger: 0, flightDur: 200, awaitMs: 200 },
          arc: 'smooth', easing: 'cubic-bezier(.22,.7,.28,1)',
        });
      }
      presentation.releasePileVisual('discard', 1);
      presentation.bumpPile(ce.discard);
      presentation.syncCombat();
      break;
    }
    case 'enemyAct': {
      const x = ce.enemies[ev.idx];
      const enemy = cb.enemies[ev.idx];
      const view = combatantView(enemy);
      const { x: ex, y: ey } = presentation.enemyCenter(ev.idx);
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
        await presentation.choreoAttack(x.root, -1, view.kind);
        choreoDone = true;
      } else await sleep(320);
      x.intent.classList.remove('telegraph');
      break;
    }
    case 'intent': presentation.syncCombat(); break;
    case 'addCard': {
      V.floatText(stageW() / 2, stageH() * 0.62, `${runCatalogues().cards[ev.id].name} added to ${ev.where === 'hand' ? 'hand' : 'discard'}`, 'notice');
      sfx.debuff();
      presentation.syncCombat(); presentation.syncHand();
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
      const { x, y } = presentation.heroCenter();
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
      if (c) removeHandCard(c);
      const { x: hx, y: hy } = presentation.heroCenter();
      if (!REDUCED) {
        presentation.flyTo(from.x, from.y, hx, hy, { n: 7, color: '#c9a8ff', size: 7, dur: 560 });
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
        const token = presentationBarrier.begin('perfect-banner');
        const span = trace.begin('presentation.banner', { attributes: { kind: 'perfect' } });
        const b = el('div', 'turn-banner perfect-banner', tr('ui.combat.perfectBanner'));
        screenEl().appendChild(b);
        setTimeout(() => {
          try {
            b.remove();
            span.finish('settled');
          } catch (error) {
            span.finish('failed', { reason: 'presentation-error' });
            throw error;
          } finally {
            token.finish();
          }
        }, 1400);
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

  return Object.freeze({ drain });
}
