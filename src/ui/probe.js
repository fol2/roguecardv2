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
            add(
              `enemy${index}: HP label matches engine`,
              elements.hp.textContent === `${Math.max(0, enemy.hp)}/${enemy.maxHp}`,
              `dom="${elements.hp.textContent}" engine=${enemy.hp}/${enemy.maxHp}`,
            );
          }
        });
        add(
          'player: HP label matches engine',
          ce.pHp.textContent === `${Math.max(0, cb.player.hp)}/${cb.player.maxHp}`,
          `dom="${ce.pHp.textContent}" engine=${cb.player.hp}/${cb.player.maxHp}`,
        );
        add(
          'hand: DOM count matches engine',
          $$('.card', ce.hand).length === cb.hand.length,
          `dom=${$$('.card', ce.hand).length} engine=${cb.hand.length}`,
        );
        add(
          'energy: orb matches engine',
          $('.num', ce.energy).textContent === String(cb.player.energy),
          `dom="${$('.num', ce.energy).textContent}" engine=${cb.player.energy}`,
        );
        add(
          'embers: lantern count matches engine',
          $('.lb-count', ce.lantern).textContent === String(cb.embers),
          `dom="${$('.lb-count', ce.lantern).textContent}" engine=${cb.embers}`,
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
    settle: () => new Promise((resolve) => {
      const done = () => !S.busy
        && (!S.cb || S.cb.queue.length === 0)
        && presentationBarrier.activeCount() === 0;
      const check = () => (done() ? resolve(true) : setTimeout(check, 16));
      check();
    }),
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
    // Task 22a — combat renderer probe surface. Version 2 marks the seam that
    // Tasks 22b/22c and PR16/PR17 build against; the renderer state and
    // generation come straight from the combat renderer stats.
    ui() {
      const renderer = resolveCombatRenderer();
      if (!renderer) {
        return {
          version: 2,
          renderer: { kind: null, state: 'absent', generation: 0 },
          model: null,
          texturedReady: false,
        };
      }
      const stats = renderer.stats();
      return {
        version: 2,
        renderer: {
          kind: stats.kind,
          state: stats.state,
          generation: stats.generation,
          transitions: stats.transitions,
        },
        model: {
          hasModel: stats.hasModel,
          version: stats.modelVersion,
        },
        textures: {
          ready: stats.texturedReady,
          loaded: stats.blockingLoaded,
          expected: stats.blockingExpected,
        },
        interaction: stats.interactionMode,
        pixi: {
          state: stats.pixiState,
          generation: stats.pixiGeneration,
          frozen: stats.frozen,
        },
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
    /**
     * Bounded core-theme driver for the P2 semantic theme journey.
     * Validates themeId against injected CORE_CONTENT.themeOrder, creates a
     * normal core run, sets the act index, regenerates the map, and enters the
     * first registered normal encounter through the real combat handler.
     */
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
    freeze() {
      combat.freeze();
    },
  };

  return Object.freeze(probe);
}
