export function createMapScreen(deps) {
  const { S, E, ACTS, OMENS, PROGRESSION, QUESTS, RELICS, CARDS, COARSE, REDUCED, tr, runEffects, nodeGlyphId, uiIconUrl, assetUrl, iconInline, iconSvg, omenMark, $, $$, screenEl, unlock, sfx, music, openOverlay, closeOverlay, stageW, stageH, mapNodePos, enterMapMode, setOverlay, V, peekMap, trace, setAltitude, transition, startCombatUI, resumeSavedCombat, requireRunSave, resumePendingHollowRoute, show, showRunSaveFailure, showStonePersistenceFailure, requireBequestClear, flyTo, banner, el, escHtml } = deps;

const NODE_ICONS = { monster: 'sword', elite: 'skull', event: 'question', rest: 'flame', shop: 'coin', treasure: 'chest', boss: 'crown', monument: 'monument' };
function renderMap() {
  const run = S.run;
  if (run.pendingCombat) { // invariant: an unresolved fight always resumes
    const node = run.map.nodes.find((n) => n.id === run.nodeId);
    const ids = run.pendingEnemyIds || E.rollEncounter(run, run.pendingCombat, node ? node.row : 5, node);
    const resumeCombat = () => {
      S.screen = 'combat';
      startCombatUI(ids, run.pendingCombat);
    };
    const resumePersistedCombat = () => resumeSavedCombat(run, resumeCombat);
    if (!run.pendingEnemyIds) {
      E.setPendingEncounter(run, run.pendingCombat, ids, run.pendingQuestId);
      if (!requireRunSave(run, resumePersistedCombat)) return;
    }
    resumePersistedCombat();
    return;
  }
  if (run.pendingHollowRoute) { resumePendingHollowRoute(run); return; }
  runEffects.saveRun(run);
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
    const dark = n.unlit && !visited.has(n.id); // an unlit lantern keeps its secret
    const cls = [
      'mnode', `type-${n.type}`, dark ? 'unlit' : '',
      n.questMarked ? 'pale-marked' : '',
      visited.has(n.id) ? 'visited' : '',
      n.id === run.nodeId ? 'current' : '',
      avail.has(n.id) ? 'avail' : '',
    ].join(' ');
    const tf = COARSE ? 1.3 : 1; // lanterns grow to meet a fingertip
    const r = (n.type === 'boss' ? 26 : n.type === 'elite' || n.type === 'treasure' ? 19 : 16) * tf;
    const fs = Math.round(r * 2);
    // glyph oversized vs frame so it spills over the ring (intent 38/30, ward 34/26)
    const gs = Math.round(fs * 1.28);
    const glyphId = nodeGlyphId(n.type, dark);
    const frameU = uiIconUrl('node-frame');
    const glyphU = uiIconUrl(glyphId);
    // Prefer kit; monument meta raster remains fallback for monument when glyph missing
    const monUrl = (n.type === 'monument' && !glyphU) ? assetUrl('meta', 'monument-node') : null;
    // transparent hit disc — nframe/nglyph are PE:none decorative; without this
    // .mnode { pointer-events: visiblePainted } has nothing to hit on the raster path
    const hit = `<circle class="nhit" r="${Math.round(gs / 2)}" fill="transparent"/>`;
    let artHtml;
    if (frameU || glyphU || monUrl) {
      const frame = frameU
        ? `<image class="nframe" href="${frameU}" x="${-fs / 2}" y="${-fs / 2}" width="${fs}" height="${fs}" />`
        : `<circle class="bg" r="${dark ? 16 * tf : r}"/>`;
      const glyph = (glyphU || monUrl)
        ? `<image class="nglyph" href="${glyphU || monUrl}" x="${-gs / 2}" y="${-gs / 2}" width="${gs}" height="${gs}" />`
        : `<g class="icg">${iconInline(dark ? 'unlitLantern' : NODE_ICONS[n.type], gs)}</g>`;
      artHtml = `${frame}${glyph}`;
    } else {
      artHtml = `<circle class="bg" r="${dark ? 16 * tf : r}"/><g class="icg">${iconInline(dark ? 'unlitLantern' : NODE_ICONS[n.type], gs)}</g>`;
    }
    // selectable: duplicate art under feMorphology ring (same language as aim outlines)
    const sil = avail.has(n.id) ? `<g class="nsil">${artHtml}</g>` : '';
    const paleMark = n.questMarked
      ? `<g class="pale-lens" transform="translate(${Math.round(r * 0.8)} ${Math.round(-r * 0.8)})">
          <circle class="pale-lens-halo" r="11"/>
          <circle class="pale-lens-glass" r="7.5"/>
          <g transform="translate(-9 -9)">${iconSvg('paleMote', 18)}</g>
        </g>`
      : '';
    dots += `<g class="${cls}" data-node="${n.id}" style="--d:${n.row * 34}ms">
      ${hit}<g class="nwrap">${sil}${artHtml}</g>${paleMark}
    </g>`;
  }
  const act = ACTS[run.act];
  const omenId = run.omens?.[run.act];
  const omen = OMENS[omenId];
  const sealedDoorVisible = run.act === 2 && E.runRevealed(run, 'act4') &&
    run.shards.length >= PROGRESSION.revealThresholds.act4.shards;
  // map-node-outline: dilate alpha → ring only (mirrors #aim-outline-*)
  const mapDefs = `<defs><filter id="map-node-outline" x="-40%" y="-40%" width="180%" height="180%" color-interpolation-filters="sRGB">
    <feMorphology in="SourceAlpha" operator="dilate" radius="2.4" result="dilated"/>
    <feComposite in="dilated" in2="SourceAlpha" operator="out" result="ring"/>
    <feFlood flood-color="#fff6e0" flood-opacity="1" result="fill"/>
    <feComposite in="fill" in2="ring" operator="in"/>
  </filter></defs>`;
  screenEl().innerHTML = `
    <div class="map-title">ACT ${run.act + 1} — <b>${act.name.toUpperCase()}</b> — ${act.bossName} awaits${omen ? ` &nbsp;·&nbsp; <span class="mt-omen" style="color:${omen.tone}">${omenMark(omenId, 'mt-omen-art', 'mt-omen-fallback', 18)}<span class="mt-omen-name">${omen.name}</span></span>` : ''}</div>
    <div class="map-screen screen-enter">
      <div class="map-haze" style="--haze:${['#2a3a2e', '#1f2e40', '#3a2030'][run.act] ?? '#2a3a2e'}"></div>
      <svg class="map-svg" width="100%" height="100%">${mapDefs}${edges}${dots}</svg>
      ${sealedDoorVisible ? `<button class="sealed-door" data-a="sealed-door" aria-label="${tr('ui.map.sealedDoor.aria')}">
        <span>${iconSvg('sealedDoor', 42)}</span><small>${tr('ui.map.sealedDoor.label')}</small>
      </button>` : ''}
      <div class="map-hint">${tr('ui.map.survey', { action: COARSE ? tr('ui.map.drag') : tr('ui.map.scroll') })}</div>
    </div>`;
  const svg = $('.map-svg');
  const sealedDoor = $('.sealed-door');
  if (sealedDoor) {
    sealedDoor.onclick = (event) => {
      if (panEaten) return;
      event.stopPropagation();
      unlock();
      sfx.click();
      music.play('sealedDoor');
      openOverlay(`<div class="panel sealed-door-panel">
        <div class="ov-title">${tr('ui.map.sealedDoor.title')}</div>
        <div class="sealed-door-mark">${iconSvg('sealedDoor', 96)}</div>
        <div class="ov-sub">${tr('ui.map.sealedDoor.sub')}</div>
        <div class="door-inscription">${tr('ui.map.sealedDoor.inscription')}</div>
        <div class="ov-actions"><button class="btn" data-a="close-door">${tr('ui.map.sealedDoor.return')}</button></div>
      </div>`, (root) => {
        root.onclick = (closeEvent) => {
          if (closeEvent.target.closest('[data-a="close-door"]')) {
            closeOverlay();
            const eighth = S.run?.omens?.[S.run.act] === 'eighthOmen';
            music.playForScreen('map', eighth ? 'eighthOmen' : null);
          }
        };
      });
    };
  }
  let panEaten = false;
  svg.onclick = (e) => {
    if (panEaten) return; // that tap was a drag
    const g = e.target.closest('.mnode.avail');
    if (!g || S.busy) return;
    unlock();
    const node = nodes.find((n) => n.id === g.dataset.node);
    selectMapNode(node);
  };
  // tooltips on nodes
  $$('.mnode', svg).forEach((g) => {
    const n = nodes.find((x) => x.id === g.dataset.node);
    const names = {
      monster: tr('ui.map.node.monster'), elite: tr('ui.map.node.elite'), event: tr('ui.map.node.event'),
      rest: tr('ui.map.node.rest'), shop: tr('ui.map.node.shop'), treasure: tr('ui.map.node.treasure'),
      boss: ACTS[run.act].bossName,
    };
    const hints = {
      monster: tr('ui.map.hint.monster'), elite: tr('ui.map.hint.elite'), event: tr('ui.map.hint.event'),
      rest: tr('ui.map.hint.rest'), shop: tr('ui.map.hint.shop'), treasure: tr('ui.map.hint.treasure'),
      boss: tr('ui.map.hint.boss'),
    };
    const travel = tr('ui.map.travelHere', { action: COARSE ? tr('ui.map.tap') : tr('ui.map.click') });
    g._tip = n.questMarked
      ? { title: tr('ui.map.witchlightTitle'), body: tr('ui.map.witchlightBody') }
      : n.unlit && !visited.has(n.id)
        ? { title: tr('ui.map.unlitTitle'), body: `${tr('ui.map.unlitBody')}${avail.has(n.id) ? ` ${travel}` : ''}` }
        : { title: names[n.type], body: avail.has(n.id) ? travel : '', sub: hints[n.type] };
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
      // visited B&W is CSS; keep opacity high so the ash trail stays readable
      const seenDim = g.classList.contains('visited') && !g.classList.contains('current') ? 0.78 : 1;
      g.style.opacity = (pt.fade * (dimIds.has(id) ? 0.4 : 1) * seenDim).toFixed(3);
    }
    for (const { p, a, b } of edgeEls) {
      const A = P.get(a), B = P.get(b);
      const sag = 9 * (A.s + B.s) / 2; // chains between lanterns hang a little
      p.setAttribute('d', `M${A.x.toFixed(1)} ${A.y.toFixed(1)} Q${((A.x + B.x) / 2).toFixed(1)} ${((A.y + B.y) / 2 + sag).toFixed(1)} ${B.x.toFixed(1)} ${B.y.toFixed(1)}`);
      // walked edges stay bright (CSS paints them B&W); only fade with camera depth
      p.style.opacity = Math.min(A.fade, B.fade).toFixed(3);
    }
    if (sealedDoor) {
      const boss = nodes.find((node) => node.type === 'boss');
      const point = boss ? P.get(boss.id) : null;
      if (point) {
        const x = Math.max(74, Math.min(stageW() - 74, point.x));
        const y = Math.max(104, Math.min(stageH() - 92, point.y - 82));
        sealedDoor.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) translate(-50%,-50%) scale(${Math.max(0.78, point.s).toFixed(3)})`;
        sealedDoor.style.opacity = Math.max(0.72, point.fade).toFixed(3);
      }
    }
  });
  V.setWeather(run.act, { mult: 0.3 });
  const ms = $('.map-screen');
  ms.addEventListener('wheel', (e) => {
    e.preventDefault();
    peekMap(-e.deltaY * 0.006);
  }, { passive: false });
  // touch: drag the tower past you, with a little momentum on release
  let panY = null, panV = 0, panRaf = 0, panDist = 0;
  ms.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse') return;
    globalThis.cancelAnimationFrame(panRaf);
    panY = e.clientY; panV = 0; panDist = 0; panEaten = false;
  });
  ms.addEventListener('pointermove', (e) => {
    if (panY == null || e.pointerType === 'mouse') return;
    const dy = e.clientY - panY;
    panY = e.clientY;
    panDist += Math.abs(dy);
    if (panDist > 14) panEaten = true;
    panV = dy;
    peekMap(dy * 0.014);
  });
  const panEnd = (e) => {
    if (panY == null || e.pointerType === 'mouse') return;
    const distance = panDist;
    panY = null;
    if (distance > 14) {
      const panSpan = trace.begin('input.map-pan', { attributes: { threshold: 'crossed' } });
      panSpan.finish(e.type === 'pointercancel' ? 'cancelled' : 'completed');
    }
    const coast = () => {
      panV *= 0.93;
      if (Math.abs(panV) < 0.5 || S.screen !== 'map') return;
      peekMap(panV * 0.014);
      panRaf = globalThis.requestAnimationFrame(coast);
    };
    panRaf = globalThis.requestAnimationFrame(coast);
    setTimeout(() => (panEaten = false), 80);
  };
  ms.addEventListener('pointerup', panEnd);
  ms.addEventListener('pointercancel', panEnd);
}
function selectMapNode(node) {
  const selectSpan = trace.begin('input.map-select', {
    attributes: { nodeId: node.id, nodeType: node.type },
  });
  try {
    enterNode(node);
    selectSpan.finish('completed');
    return true;
  } catch (error) {
    selectSpan.finish('failed', { reason: 'handler-error' });
    throw error;
  }
}
function showNodeBounty(node, bounty) {
  if (bounty) {
    // first light: the dark lantern pays for the walking
    sfx.coin();
    const g = $(`.mnode[data-node="${node.id}"]`);
    const from = g ? V.centerOf(g) : { x: stageW() / 2, y: stageH() / 2 };
    V.floatText(from.x, from.y - 34, `${iconSvg('coin', 12)} +${bounty}`, 'goldf');
    flyTo(from.x, from.y, 120, 30, { n: 5, color: '#ffe9ac', size: 7, dur: 620 });
  }
}
function enterNode(node) {
  const run = S.run;
  sfx.map();
  setAltitude(run.act, node.row);
  const { type, bounty, hollow } = E.visitNode(run, node);
  if (hollow) {
    if (!runEffects.saveRun(run)) {
      S.run = E.loadRun();
      if (!S.run) { show('title'); return; }
      show('map');
      showRunSaveFailure(S.run, () => {});
      return;
    }
    showEighthFloorEcho(run);
    showNodeBounty(node, bounty);
    show('hollow', { nodeId: node.id });
    return;
  }
  showEighthFloorEcho(run);
  const isCombat = type === 'monster' || type === 'elite' || type === 'boss';
  if (!isCombat && type !== 'monument') runEffects.saveRun(run);
  showNodeBounty(node, bounty);
  routeVisitedNode(node, type);
}
function routeVisitedNode(node, type, { enemyIds = null, eventId = null } = {}) {
  const run = S.run;
  const isCombat = type === 'monster' || type === 'elite' || type === 'boss';
  if (isCombat) {
    const ids = enemyIds ? [...enemyIds] : E.rollEncounter(run, type, node.row, node);
    if (!enemyIds) E.setPendingEncounter(run, type, ids);
    const beginCombat = () => {
      const g = $(`.mnode[data-node="${node.id}"]`);
      transition('combat-in', g ? V.centerOf(g) : {});
      startCombatUI(ids, type);
    };
    if (enemyIds) { beginCombat(); return; }
    if (!requireRunSave(run, beginCombat)) return;
    beginCombat();
  } else if (type === 'rest') show('rest');
  else if (type === 'shop') show('shop');
  else if (type === 'treasure') show('treasure');
  else if (type === 'event') show('event', eventId || E.rollEvent(run));
  else if (type === 'monument') claimMonumentNode(node);
}
function showEighthFloorEcho(run) {
  if (run.omens?.[run.act] !== 'eighthOmen') return;
  const echoes = QUESTS.eighthOmen.floorEchoes;
  const text = echoes?.[run.floorsClimbed % echoes.length];
  setTimeout(() => {
    if (S.run?.runId !== run.runId || !text) return;
    const b = el('div', 'turn-banner eighth-floor-echo broken-omen',
      `<span class="efe-icon">${iconSvg('eighthOmen', 24)}</span><span class="efe-text">${escHtml(text)}</span>`);
    // Floaties outlive #screen replacements (combat-in wipes map markup).
    const host = document.getElementById('floaties') || screenEl();
    host.appendChild(b);
    setTimeout(() => b.remove(), 3200);
  }, REDUCED ? 0 : 220);
}
// stepping onto the stone a past self left behind
function claimMonumentNode(node) {
  const run = S.run;
  const continueMap = () => show('map');
  if (run.monument?.standing && !run.monument.claimed) {
    const transaction = runEffects.beginShadeDuel(run);
    const beginDuel = () => {
      const g = $(`.mnode[data-node="${node.id}"]`);
      transition('combat-in', g ? V.centerOf(g) : {});
      startCombatUI([transaction.duel.variantId], 'monster');
    };
    if (transaction.status === E.SHADE_DUEL_TX.READY) {
      beginDuel();
      return;
    }
    const reloadPending = transaction.status === E.SHADE_DUEL_TX.RELOAD_PENDING;
    showStonePersistenceFailure(
      reloadPending ? () => location.reload() : () => claimMonumentNode(node),
      reloadPending ? tr('ui.persistence.reloadDuel') : tr('ui.common.retry'),
    );
    return;
  }
  const b = E.claimMonument(run);
  if (!b) {
    if (!requireRunSave(run, continueMap)) return;
    continueMap();
    return;
  }
  const finishGift = () => {
    sfx.relic();
    const label = b.kind === 'relic' ? RELICS[b.id]?.name : b.kind === 'card' ? CARDS[b.id]?.name : `${b.amount} gold`;
    const g = $(`.mnode[data-node="${node.id}"]`);
    const from = g ? V.centerOf(g) : { x: stageW() / 2, y: stageH() / 2 };
    V.floatText(from.x, from.y - 34, `✦ ${label}`, 'goldf');
    flyTo(from.x, from.y, stageW() / 2, stageH() * 0.5, { n: 8, color: '#ffe9ac', size: 8, dur: 720 });
    banner(tr('ui.combat.stoneRemembers'));
    show('map');
  };
  const clearThenFinish = () => {
    if (!requireBequestClear(finishGift)) return;
    finishGift();
  };
  if (!requireRunSave(run, clearThenFinish)) return;
  clearThenFinish();
}

  return Object.freeze({ renderMap, routeVisitedNode, claimMonumentNode });
}
