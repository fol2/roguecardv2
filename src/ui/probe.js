// Read-only browser diagnostics and real-handler test drivers.
// The index owner installs the returned object in the global probe slot.

export function installProbe({
  context,
  combat,
  drain,
  navigator,
  trace,
}) {
  const {
    $, $$, S, E, CORE_CONTENT, combatantView, openPersistenceDialog, presentationBarrier,
    readMapWarmIds, setForceRoseFallback, stageH, stageInfo, stageRect, stageW,
    tr, usePotionOn, getCombatRenderer,
  } = context;
  const resolveCombatRenderer = typeof getCombatRenderer === 'function'
    ? getCombatRenderer
    : () => null;

  // All probe geometry is in stage px, so the same run reports the same
  // coordinates independently of the browser viewport resolution.
  const rect = (selector) => {
    const node = document.querySelector(selector);
    return node ? stageRect(node) : null;
  };

  const rectOf = (r) => (r ? {
    left: r.left, top: r.top, right: r.right, bottom: r.bottom,
    width: r.width, height: r.height,
  } : null);

  const presentationSettled = () => new Promise((resolve) => {
    const done = () => !S.busy
      && (!S.cb || S.cb.queue.length === 0)
      && presentationBarrier.activeCount() === 0;
    const check = () => (done() ? resolve(true) : setTimeout(check, 16));
    check();
  });

  const probe = {
    // -- readers --------------------------------------------------------
    stage: () => stageInfo(),
    routes: () => navigator.routeKeys,
    geometry() {
      const battlefield = rect('.battlefield');
      if (!battlefield || !S.cb || !S.ce) return null;
      return {
        stage: stageInfo(),
        viewport: { w: stageW(), h: stageH() },
        groundY: battlefield.bottom,
        heroArtBottom: rect('.hero-wrap')?.bottom ?? null,
        enemyArtBottoms: S.cb.enemies.map((enemy, index) => (
          enemy.hp > 0 && S.ce.enemies[index]
            ? stageRect(S.ce.enemies[index].art).bottom
            : null
        )),
        slLedgeTop: rect('.sl-ledge')?.top ?? null,
        seamY: rect('.stage-ledge')?.top ?? null,
      };
    },
    invariants() {
      const results = [];
      const add = (name, pass, detail = '') => results.push({
        name,
        pass,
        detail: pass ? '' : String(detail),
      });
      const cb = S.cb;
      const ce = S.ce;
      if (cb && ce && S.screen === 'combat') {
        cb.enemies.forEach((enemy, index) => {
          const elements = ce.enemies[index];
          if (!elements) return;
          if (enemy.hp <= 0) {
            const classes = elements.root.classList;
            add(
              `enemy${index}: dead body leaves the field`,
              classes.contains('gone')
                || classes.contains('dying')
                || getComputedStyle(elements.root).visibility === 'hidden',
              `classes="${elements.root.className}"`,
            );
            add(
              `enemy${index}: dead body releases its mesh plane`,
              !elements.root.querySelector('.mesh-live'),
              'a WebGL warp plane still renders this corpse',
            );
          } else {
            const gl = resolveCombatRenderer?.();
            const glModel = gl && typeof gl.sync === 'function' ? gl.sync() : null;
            const plateEnemy = glModel?.plates?.enemies?.[index];
            const hpReading = plateEnemy
              ? `${Math.max(0, plateEnemy.hp)}/${plateEnemy.maxHp}`
              : elements.hp.textContent;
            add(
              `enemy${index}: HP label matches engine`,
              hpReading === `${Math.max(0, enemy.hp)}/${enemy.maxHp}`,
              `${plateEnemy ? 'pixi' : 'dom'}="${hpReading}" engine=${enemy.hp}/${enemy.maxHp}`,
            );
          }
        });
        {
          const gl = resolveCombatRenderer?.();
          const glModel = gl && typeof gl.sync === 'function' ? gl.sync() : null;
          const plateHero = glModel?.plates?.hero;
          const playerHp = plateHero
            ? `${Math.max(0, plateHero.hp)}/${plateHero.maxHp}`
            : ce.pHp.textContent;
          add(
            'player: HP label matches engine',
            playerHp === `${Math.max(0, cb.player.hp)}/${cb.player.maxHp}`,
            `${plateHero ? 'pixi' : 'dom'}="${playerHp}" engine=${cb.player.hp}/${cb.player.maxHp}`,
          );
        }
        add(
          'hand: DOM count matches engine',
          $$('.card', ce.hand).length === cb.hand.length,
          `dom=${$$('.card', ce.hand).length} engine=${cb.hand.length}`,
        );
        const gl = resolveCombatRenderer?.();
        const glModel = gl && typeof gl.sync === 'function' ? gl.sync() : null;
        const pixiOwned = !!(glModel && glModel.bottomChrome);
        const energyReading = pixiOwned
          ? Number(glModel.bottomChrome.energy)
          : Number($('.num', ce.energy).textContent);
        add(
          'energy: reading matches engine',
          Number.isFinite(energyReading) && energyReading === cb.player.energy,
          `${pixiOwned ? 'pixi' : 'dom'}=${energyReading} engine=${cb.player.energy}`,
        );
        const emberReading = pixiOwned
          ? Number(glModel.bottomChrome.embers)
          : Number($('.lb-count', ce.lantern).textContent);
        add(
          'embers: reading matches engine',
          Number.isFinite(emberReading) && emberReading === cb.embers,
          `${pixiOwned ? 'pixi' : 'dom'}=${emberReading} engine=${cb.embers}`,
        );
      }
      const failures = results.filter((item) => !item.pass);
      if (failures.length) {
        trace.emit('error.invariant', {
          outcome: 'failed',
          attributes: { code: 'probe-invariant-failed', count: failures.length },
        });
      }
      return results;
    },
    state() {
      const cb = S.cb;
      return {
        screen: S.screen,
        busy: S.busy,
        over: cb?.over ?? null,
        result: cb?.result ?? null,
        turn: cb?.turn ?? null,
        player: cb ? {
          hp: cb.player.hp,
          maxHp: cb.player.maxHp,
          block: cb.player.block,
          energy: cb.player.energy,
        } : null,
        embers: cb?.embers ?? null,
        enemies: cb ? cb.enemies.map((enemy) => ({
          key: enemy.key,
          variantId: enemy.variantId,
          artId: combatantView(enemy).artId,
          hp: enemy.hp,
          maxHp: enemy.maxHp,
          block: enemy.block,
          chips: enemy.chips,
          facetMax: enemy.facetMax,
        })) : null,
        hand: cb ? cb.hand.map((card) => ({ uid: card.uid, id: card.id })) : null,
      };
    },
    behaviourTrace: ({ after = null, format = 'records' } = {}) => (
      trace.read({ after, format })
    ),
    queueIdle: () => !S.cb || S.cb.queue.length === 0,
    presentationIdle: () => presentationBarrier.activeCount() === 0,
    traceIntegrity: () => trace.assertIntegrity(),
    mapWarmSet: () => [...readMapWarmIds()],
    resetBehaviourTrace: () => trace.reset(),
    translateForProbe: (key) => tr(key),
    settle: () => presentationSettled(),
    moduleContracts() {
      return {
        combat: Object.keys(combat).sort(),
        drainHandlers: Object.keys(combat.drainHandlers).sort(),
        drain: Object.keys(drain).sort(),
        frozen: {
          combat: Object.isFrozen(combat),
          drainHandlers: Object.isFrozen(combat.drainHandlers),
          drain: Object.isFrozen(drain),
        },
      };
    },
    // Task 23 — renderer-neutral Probe v2 shape.
    ui() {
      const renderer = resolveCombatRenderer();
      const stats = renderer ? renderer.stats() : null;
      const readUI = renderer && typeof renderer.readUI === 'function' ? renderer.readUI() : null;
      const model = renderer && typeof renderer.sync === 'function' ? renderer.sync() : null;
      const policy = window.spirebound?.pixi?.policy
        || (stats ? { tier: null, reducedMotion: null } : null);
      const cb = S.cb;
      const ce = S.ce;
      const input = typeof combat.pointerState === 'function' ? combat.pointerState() : null;

      const hand = (cb && ce?.hand)
        ? cb.hand.map((card) => {
          const el = ce.hand.querySelector(`.card[data-uid="${card.uid}"]`);
          const bounds = el ? rectOf(stageRect(el)) : null;
          const d = E.cardData(card, S.run);
          const playable = !d.unplayable
            && (E.effCost(S.run, cb, card) ?? 99) <= cb.player.energy;
          return {
            uid: card.uid,
            id: card.id,
            bounds,
            seatBounds: bounds,
            playable,
            selected: !!(S.targeting?.kind === 'card' && S.targeting.uid === card.uid),
            dragging: !!(S.drag && S.drag.uid === card.uid && S.drag.live),
          };
        })
        : [];

      const bottom = model?.bottomChrome;
      const piles = {
        draw: {
          count: bottom?.piles?.draw?.count ?? cb?.draw?.length ?? 0,
          bounds: readUI?.piles?.draw || readUI?.chrome?.draw || null,
        },
        discard: {
          count: bottom?.piles?.discard?.count ?? cb?.discard?.length ?? 0,
          bounds: readUI?.piles?.discard || readUI?.chrome?.discard || null,
        },
        ashes: {
          count: bottom?.piles?.ashes?.count ?? cb?.exhaust?.length ?? 0,
          bounds: readUI?.piles?.ashes || readUI?.chrome?.ashes || null,
        },
      };

      return {
        version: 2,
        renderer: {
          kind: stats?.kind ?? null,
          state: stats?.state ?? (renderer ? 'unknown' : 'absent'),
          generation: stats?.generation ?? 0,
          policy: policy ? { ...policy } : null,
        },
        hand,
        piles,
        energy: {
          value: bottom?.energy ?? cb?.player?.energy ?? null,
          max: bottom?.energyMax ?? cb?.player?.energyMax ?? null,
          bounds: readUI?.energy || readUI?.candleFrame?.bounds || null,
        },
        lantern: {
          embers: bottom?.embers ?? cb?.embers ?? null,
          ready: !!bottom?.lanternReady,
          bounds: readUI?.lantern || null,
        },
        endTurn: {
          enabled: bottom?.endTurnEnabled ?? (!S.busy && !!cb && !cb.over),
          bounds: readUI?.endTurn || null,
        },
        player: cb ? {
          hp: cb.player.hp,
          maxHp: cb.player.maxHp,
          block: cb.player.block,
          bounds: readUI?.hero?.bounds || rect('.hero-wrap'),
        } : null,
        enemies: cb
          ? cb.enemies.map((enemy, index) => ({
            index,
            key: enemy.key,
            hp: enemy.hp,
            maxHp: enemy.maxHp,
            alive: enemy.hp > 0,
            bounds: readUI?.enemies?.[index]?.artBounds
              || (ce?.enemies?.[index]?.art ? rectOf(stageRect(ce.enemies[index].art)) : null),
          }))
          : [],
        hud: readUI?.hud || null,
        input: input || { enabled: false, dragging: false, pressed: false, gesture: null },
        textures: {
          ready: stats?.texturedReady ?? false,
          loaded: stats?.blockingLoaded ?? 0,
          expected: stats?.blockingExpected ?? 0,
        },
        // Back-compat fields used by Task 22a pixi.spec assertions.
        model: stats ? {
          hasModel: stats.hasModel,
          version: stats.modelVersion,
        } : null,
        interaction: stats?.interactionMode ?? null,
        pixi: stats ? {
          state: stats.pixiState,
          generation: stats.pixiGeneration,
          frozen: stats.frozen,
        } : null,
      };
    },
    combatRendererStats() {
      const renderer = resolveCombatRenderer();
      return renderer ? renderer.stats() : null;
    },
    combatRendererReadUI() {
      const renderer = resolveCombatRenderer();
      return renderer ? renderer.readUI() : null;
    },

    // -- drivers: always reuse the real input handlers -----------------
    async play(uid, targetIdx = null) {
      if (S.busy || !S.cb || S.cb.over) return false;
      await combat.doPlay(uid, targetIdx);
      return !S.cb || S.cb.over || !S.cb.hand.some((card) => card.uid === uid);
    },
    targetCardForProbe(uid) {
      if (!S.cb?.hand.some((card) => card.uid === uid)) return false;
      combat.setTargeting({ kind: 'card', uid });
      return true;
    },
    async endTurn() {
      await combat.onEndTurn();
    },
    async useArt() {
      if (S.busy || !S.cb || S.cb.over) return false;
      return combat.useLanternArt();
    },
    async usePotion(slot, targetIdx = null) {
      if (S.busy) return false;
      return usePotionOn(slot, targetIdx);
    },
    showBarrierProbe() {
      combat.banner('Barrier probe');
    },
    showMoteFlightProbe() {
      combat.flyTo(
        stageW() / 2,
        stageH() / 2,
        stageW() / 2 + 40,
        stageH() / 2 - 40,
        { n: 1 },
      );
    },
    showPersistenceSetupFailureProbe() {
      return openPersistenceDialog(
        '<div class="panel"><button data-a="retry-probe">Retry</button></div>',
        '[data-a="retry-probe"]',
        () => { throw new Error('forced-persistence-wire-failure'); },
      );
    },

    // -- scenario setup: engine-legal state only -----------------------
    async stageCoreTheme({ themeId, seed } = {}) {
      const order = CORE_CONTENT?.themeOrder;
      if (!Array.isArray(order) || !order.includes(themeId)) {
        throw new Error(`stageCoreTheme: unknown core themeId ${String(themeId)}`);
      }
      const themeIndex = order.indexOf(themeId);
      const theme = CORE_CONTENT.themes[themeId];
      const encounter = theme?.encounters?.normal?.[0];
      if (!Array.isArray(encounter) || !encounter.length) {
        throw new Error(`stageCoreTheme: theme ${themeId} has no normal encounter`);
      }
      const run = E.newRun(seed);
      run.act = themeIndex;
      run.map = E.genMap(run);
      run.pendingLamplighter = false;
      S.run = run;
      S.cb = null;
      combat.startCombatUI([...encounter], 'monster');
      await probe.settle();
      return Object.freeze({
        themeId,
        themeIndex,
        plates: Object.freeze({ ...(theme.plates || {}) }),
        weather: theme.weather || null,
        music: Object.freeze({ ...(theme.music || {}) }),
        enemyIds: Object.freeze([...encounter]),
      });
    },
    forceHand(ids) {
      S.cb.hand = ids.map((id) => E.makeCard(S.run, id));
      combat.syncHand();
      return S.cb.hand.map((card) => card.uid);
    },
    setEnergy(value) {
      S.cb.player.energy = value;
      combat.syncCombat();
    },
    setEmbers(value) {
      S.cb.embers = value;
      combat.syncCombat();
    },
    setPlayerHp(value) {
      if (!S.cb) return;
      S.cb.player.hp = value;
      combat.syncCombat();
    },
    setEnemyHp(index, hp) {
      S.cb.enemies[index].hp = hp;
      combat.syncCombat();
    },
    forceRoseFallback(on) {
      const fallback = setForceRoseFallback(on);
      if (S.screen === 'vigil') navigator.show('vigil', { tab: 'rose' });
      if (S.screen === 'title') navigator.show('title');
      return fallback;
    },

    // -- deterministic presentation switch -----------------------------
    // Task 23 Probe v2: await settle, freeze DOM/scene/VFX, then Pixi.
    async freeze(options = {}) {
      if (typeof combat.freezeForProbe === 'function') {
        return combat.freezeForProbe(options);
      }
      await presentationSettled();
      combat.freeze();
      const renderer = resolveCombatRenderer();
      if (renderer?.freezeForTest) return renderer.freezeForTest(options);
      return { frozen: true, cssOnly: true };
    },
    async loseRendererContextForTest() {
      const renderer = resolveCombatRenderer();
      if (renderer?.recoverContextForTest) {
        return renderer.recoverContextForTest();
      }
      if (!renderer?.loseContextForTest) {
        throw new Error('combat renderer does not expose loseContextForTest');
      }
      await renderer.loseContextForTest();
      if (renderer.rebuildAfterLossForTest) {
        return renderer.rebuildAfterLossForTest();
      }
      return renderer.stats?.() ?? null;
    },
    async unfreeze() {
      const renderer = resolveCombatRenderer();
      if (renderer?.unfreezeForTest) return renderer.unfreezeForTest();
      return { frozen: false };
    },
  };

  return Object.freeze(probe);
}
