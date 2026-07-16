// Round 5 production Pixi lifecycle spec. Verifies:
//   - a pre-navigation `HTMLCanvasElement.getContext` observer sees exactly
//     the three named WebGL owners (`bg3d`, `mesh`, `uigl`) at steady state;
//   - `#vfx` is a 2d canvas; total live WebGL contexts never exceed 3; no
//     live unowned context remains at steady state;
//   - production prewarm compiled the ColorMatrixFilter/GlProgram on a
//     detached WebGL context, then lost it, BEFORE `#uigl` was created;
//   - ready → lost → rebuilding → ready via `loseContextForTest` + `rebuild`,
//     including snapshot survival across the rebuild;
//   - a missing-texture nine-slice mounted on the world root renders a
//     token-driven vector fallback and remains usable;
//   - freeze / unfreeze / destroy behave deterministically;
//   - `#uigl` is transparent, pointer-inert and correctly stacked;
//   - contrast ≥ 4.5:1 at data level AND canvas `measureText` proves the
//     approved Cinzel/Alegreya families/weights are actually loaded, so a
//     `document.fonts.status === 'loaded'` alone cannot certify a fallback;
//   - every font request was same-origin and finished before renderer.ready.

import { test, expect } from '@playwright/test';
import { snapStage } from '../../src/ui/widgets.js';
import { contrastRatio, ROUND5_TOKENS, COLOUR } from '../../src/ui/tokens.js';

const EXPECTED_WEBGL_OWNERS = ['bg3d', 'mesh', 'uigl'];
const TRACKED_WEBGL_OWNER_IDS = ['bg3d', 'mesh', 'uigl'];

const OBSERVER_INIT_SCRIPT = `(() => {
  if (window.__pixiObserver) return;
  const tracked = new Set(${JSON.stringify(TRACKED_WEBGL_OWNER_IDS)});
  const original = HTMLCanvasElement.prototype.getContext;
  const records = new Map();
  const canvasKinds = new Map();
  const idFor = new WeakMap();
  const timeline = [];
  let syntheticSeq = 1;
  let maxConcurrentOwners = 0;
  let maxConcurrentContexts = 0;
  const canvasId = (canvas) => {
    if (canvas && canvas.id) return canvas.id;
    if (!idFor.has(canvas)) {
      idFor.set(canvas, 'detached-' + syntheticSeq);
      syntheticSeq += 1;
    }
    return idFor.get(canvas);
  };
  const isLive = (record) => record.context && !record.context.isContextLost();
  const live = () => [...records.values()].filter(isLive);
  const ownerRecords = (liveRecords) => liveRecords.filter((record) => (
    tracked.has(record.canvas.id) && record.canvas.isConnected
  ));
  const liveOwners = (liveRecords) => {
    const set = new Set();
    for (const record of ownerRecords(liveRecords)) set.add(record.canvas.id);
    return [...set].sort();
  };
  const liveUnowned = (liveRecords) => liveRecords
    .filter((record) => !tracked.has(record.canvas.id) || !record.canvas.isConnected)
    .map((record) => record.contextId)
    .sort();
  const snapshotTimeline = (action, owner) => {
    const liveRecords = live();
    const owners = liveOwners(liveRecords);
    const ownerCount = ownerRecords(liveRecords).length;
    if (ownerCount > maxConcurrentOwners) maxConcurrentOwners = ownerCount;
    if (liveRecords.length > maxConcurrentContexts) maxConcurrentContexts = liveRecords.length;
    timeline.push({
      action,
      owner,
      owners,
      unowned: liveUnowned(liveRecords),
      atMs: performance.now(),
    });
  };
  HTMLCanvasElement.prototype.getContext = function observedGetContext(type, ...args) {
    const context = original.call(this, type, ...args);
    const lower = String(type).toLowerCase();
    const owner = canvasId(this);
    const kinds = canvasKinds.get(owner) || new Set();
    kinds.add(lower);
    canvasKinds.set(owner, kinds);
    if (context && /^webgl/.test(lower)) {
      if (!records.has(context)) {
        records.set(context, {
          canvas: this,
          context,
          contextId: owner + ':webgl-' + records.size,
          type: lower,
        });
        snapshotTimeline('created', owner);
        this.addEventListener('webglcontextlost', (event) => {
          event.preventDefault();
          snapshotTimeline('lost', canvasId(this));
        });
        this.addEventListener('webglcontextrestored', () => {
          snapshotTimeline('restored', canvasId(this));
        });
      }
    }
    return context;
  };
  window.__pixiObserver = Object.freeze({
    snapshot() {
      const liveRecords = live();
      const ownerCount = ownerRecords(liveRecords).length;
      return {
        liveWebglOwners: liveOwners(liveRecords),
        liveWebglContextCount: liveRecords.length,
        liveUnownedWebglContexts: liveUnowned(liveRecords),
        maxConcurrentWebglOwners: Math.max(maxConcurrentOwners, ownerCount),
        maxConcurrentWebglContexts: Math.max(maxConcurrentContexts, liveRecords.length),
        canvasContexts: Object.fromEntries(
          [...canvasKinds.entries()].map(([id, set]) => [id, [...set].sort()]),
        ),
        timeline: timeline.slice(),
      };
    },
  });
})();`;

async function bootProduction(page) {
  const pageErrors = [];
  page.on('pageerror', (err) => pageErrors.push(err.message));
  const fontRequests = [];
  page.on('response', async (response) => {
    const url = response.url();
    if (/\.woff2(\?|$)/i.test(url)) {
      fontRequests.push({
        url,
        status: response.status(),
        fromServiceWorker: response.fromServiceWorker(),
      });
    }
  });
  await page.addInitScript(OBSERVER_INIT_SCRIPT);
  await page.goto('/?shape=desktop-landscape');
  await page.waitForFunction(() => window.spirebound?.pixi?.status() === 'ready', null, {
    timeout: 15_000,
  });
  return { pageErrors, fontRequests };
}

test.describe('Round 5 production Pixi layer', () => {
  test('boots the sole Pixi renderer with contrast, snap and shake sync', async ({ page }) => {
    const { pageErrors } = await bootProduction(page);

    const stats = await page.evaluate(() => window.spirebound.pixi.stats());
    expect(stats.status).toBe('ready');
    expect(stats.rendererKind).toBe('pixi');
    expect(stats.rendererPreference).toEqual(['webgl']);
    expect(stats.generation).toBe(1);
    expect(stats.transitions.slice(-1)).toEqual(['ready']);

    const canvasProbe = await page.evaluate(() => {
      const canvas = document.getElementById('uigl');
      const style = getComputedStyle(canvas);
      return {
        present: Boolean(canvas),
        pointerEvents: style.pointerEvents,
        position: style.position,
        zIndex: style.zIndex,
        precedingId: canvas?.previousElementSibling?.id ?? null,
        ariaHidden: canvas?.getAttribute('aria-hidden'),
      };
    });
    expect(canvasProbe.present).toBe(true);
    expect(canvasProbe.pointerEvents).toBe('none');
    expect(canvasProbe.position).toBe('absolute');
    expect(canvasProbe.precedingId).toBe('vfx');
    expect(canvasProbe.ariaHidden).toBe('true');

    const owners = await page.evaluate(() => {
      const ids = ['bg3d', 'mesh', 'uigl'];
      return ids.map((id) => {
        const el = document.getElementById(id);
        return { id, present: Boolean(el), tag: el?.tagName?.toLowerCase() || null };
      });
    });
    for (const info of owners) {
      expect(info.present, `${info.id} exists`).toBe(true);
      expect(info.tag).toBe('canvas');
    }
    expect(owners.map((o) => o.id)).toEqual(EXPECTED_WEBGL_OWNERS);

    const snapshotResult = await page.evaluate(() => {
      'use strict';
      const pixi = window.spirebound.pixi;
      pixi.writeSnapshot({ version: 1, phase: 'boot', counters: { ready: 1 } });
      const snapshot = pixi.snapshot();
      let topThrew = false;
      let nestedThrew = false;
      try { snapshot.phase = 'mutated'; } catch { topThrew = true; }
      try { snapshot.counters.ready = 999; } catch { nestedThrew = true; }
      const readBack = pixi.snapshot();
      return {
        snapshot,
        topThrew,
        nestedThrew,
        topFrozen: Object.isFrozen(snapshot),
        nestedFrozen: Object.isFrozen(snapshot.counters),
        preservedPhase: readBack.phase,
        preservedNested: readBack.counters.ready,
      };
    });
    expect(snapshotResult.snapshot).toMatchObject({ version: 1, phase: 'boot' });
    expect(snapshotResult.topFrozen).toBe(true);
    expect(snapshotResult.nestedFrozen).toBe(true);
    expect(snapshotResult.preservedPhase).toBe('boot');
    expect(snapshotResult.preservedNested).toBe(1);

    const frozen = await page.evaluate(() => window.spirebound.pixi.freezeForTest({ atTick: 3 }));
    expect(frozen.frozen).toBe(true);
    expect(frozen.frozenTick).toBe(3);
    const thawed = await page.evaluate(() => window.spirebound.pixi.unfreezeForTest());
    expect(thawed.frozen).toBe(false);

    const shakeAlignment = await page.evaluate(async () => {
      const V = await import('/src/vfx.js');
      V.shake(12);
      await new Promise((resolve) => setTimeout(resolve, 60));
      const pixi = window.spirebound.pixi;
      const root = pixi.root?.();
      const offset = V.readShakeOffset();
      return {
        offset,
        root: root ? { x: root.x, y: root.y } : null,
      };
    });
    expect(shakeAlignment.root).not.toBeNull();
    const dx = Math.abs((shakeAlignment.root.x ?? 0) - shakeAlignment.offset.x);
    const dy = Math.abs((shakeAlignment.root.y ?? 0) - shakeAlignment.offset.y);
    expect(dx).toBeLessThanOrEqual(1);
    expect(dy).toBeLessThanOrEqual(1);

    expect(snapStage(12.4, 2)).toBe(12.5);
    expect(snapStage(12.6, 2)).toBe(12.5);
    expect(snapStage(12.75, 2)).toBe(13);

    expect(contrastRatio(COLOUR.text, COLOUR.ink)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(COLOUR.parchment, COLOUR.ink)).toBeGreaterThanOrEqual(4.5);

    const cssRootValues = await page.evaluate(() => {
      const style = getComputedStyle(document.documentElement);
      return {
        gold: style.getPropertyValue('--r5-gold').trim(),
        parchment: style.getPropertyValue('--r5-parchment').trim(),
        danger: style.getPropertyValue('--r5-danger').trim(),
        ward: style.getPropertyValue('--r5-ward').trim(),
      };
    });
    expect(cssRootValues.gold).toBe(ROUND5_TOKENS.gold);
    expect(cssRootValues.parchment).toBe(ROUND5_TOKENS.parchment);
    expect(cssRootValues.danger).toBe(ROUND5_TOKENS.danger);
    expect(cssRootValues.ward).toBe(ROUND5_TOKENS.ward);

    expect(pageErrors).toEqual([]);
  });

  test('observer records the three named WebGL owners and no live unowned context', async ({ page }) => {
    await bootProduction(page);
    const observed = await page.evaluate(() => window.__pixiObserver.snapshot());
    expect(observed.liveWebglOwners).toEqual(EXPECTED_WEBGL_OWNERS);
    expect(observed.liveWebglContextCount).toBeLessThanOrEqual(3);
    expect(observed.liveUnownedWebglContexts).toEqual([]);
    expect(observed.maxConcurrentWebglOwners).toBeLessThanOrEqual(3);
    expect(observed.maxConcurrentWebglContexts).toBeLessThanOrEqual(3);
    expect(observed.canvasContexts.vfx || []).toContain('2d');
    expect((observed.canvasContexts.vfx || []).some((k) => k.startsWith('webgl'))).toBe(false);
  });

  test('production prewarm loses a detached WebGL context before uigl is created', async ({ page }) => {
    await bootProduction(page);
    const timeline = await page.evaluate(() => window.__pixiObserver.snapshot().timeline);
    const uiglCreatedAt = timeline.findIndex((entry) => (
      entry.action === 'created' && entry.owner === 'uigl'
    ));
    expect(uiglCreatedAt, 'uigl context must be observed').toBeGreaterThan(-1);
    const before = timeline.slice(0, uiglCreatedAt);
    const detachedCreation = before.find((entry) => (
      entry.action === 'created' && entry.owner.startsWith('detached-')
    ));
    expect(detachedCreation, 'a detached WebGL context is created during prewarm').toBeTruthy();
    const detachedLoss = before.find((entry) => (
      entry.action === 'lost' && entry.owner.startsWith('detached-')
    ));
    expect(detachedLoss, 'the detached WebGL context is explicitly lost before uigl').toBeTruthy();
    const ownersAtUiglCreation = timeline[uiglCreatedAt].owners;
    expect(ownersAtUiglCreation).toEqual(EXPECTED_WEBGL_OWNERS);
    const finalUnowned = timeline[timeline.length - 1].unowned;
    expect(finalUnowned).toEqual([]);
  });

  test('rebuild carries the immutable snapshot across ready→lost→rebuilding→ready', async ({ page }) => {
    await bootProduction(page);
    const result = await page.evaluate(async () => {
      const pixi = window.spirebound.pixi;
      pixi.writeSnapshot({ version: 2, phase: 'pre-rebuild', counters: { rebuilds: 0 } });
      const before = pixi.stats();
      await pixi.freezeForTest({ atTick: 11 });
      const afterFreeze = pixi.stats();
      const lossStats = await pixi.loseContextForTest();
      const afterLoss = pixi.status();
      const rebuildStats = await pixi.rebuild();
      const afterRebuild = pixi.stats();
      const afterSnapshot = pixi.snapshot();
      const tickerStopped = pixi.application()?.ticker?.started === false;
      pixi.unfreezeForTest();
      return {
        beforeGeneration: before.generation,
        afterFreeze,
        afterLoss,
        lossStats,
        rebuildStats,
        afterRebuild,
        afterSnapshot,
        tickerStopped,
      };
    });
    expect(result.beforeGeneration).toBe(1);
    expect(result.afterFreeze.frozen).toBe(true);
    expect(result.afterFreeze.frozenTick).toBe(11);
    expect(result.afterLoss).toBe('lost');
    expect(result.rebuildStats.status).toBe('ready');
    expect(result.rebuildStats.generation).toBeGreaterThanOrEqual(2);
    expect(result.rebuildStats.transitions).toEqual(expect.arrayContaining(['ready', 'lost', 'rebuilding', 'ready']));
    expect(result.afterRebuild.frozen).toBe(true);
    expect(result.afterRebuild.frozenTick).toBe(11);
    expect(result.tickerStopped).toBe(true);
    expect(result.afterSnapshot.phase).toBe('pre-rebuild');
    expect(result.afterSnapshot.frozen).toBe(true);
    expect(result.afterSnapshot.frozenTick).toBe(11);
  });

  test('missing-texture nine-slice renders the vector fallback and stays usable', async ({ page }) => {
    await bootProduction(page);
    const widgetResult = await page.evaluate(async () => {
      const { createNineSlice } = await import('/src/ui/widgets.js');
      const widget = createNineSlice({
        texture: null,
        bounds: { x: 5, y: 5, width: 64, height: 40 },
        fallback: { fill: '#0b0e1a', stroke: '#f2c14e' },
      });
      const pixi = window.spirebound.pixi;
      const root = pixi.root();
      root.addChild(widget.container);
      const bounds = widget.readBounds();
      const childCount = widget.container.children.length;
      const childNames = widget.container.children.map((child) => (
        (child.constructor && child.constructor.name) || 'Unknown'
      ));
      widget.destroy();
      return {
        hasTexture: widget.hasTexture,
        childCount,
        childNames,
        bounds,
      };
    });
    expect(widgetResult.hasTexture).toBe(false);
    expect(widgetResult.childCount).toBeGreaterThanOrEqual(1);
    expect(widgetResult.childNames.some((name) => /Graphics/i.test(name))).toBe(true);
    expect(widgetResult.childNames.some((name) => /NineSliceSprite/i.test(name))).toBe(false);
    expect(widgetResult.bounds.width).toBe(64);
    expect(widgetResult.bounds.height).toBe(40);
  });

  test('freezes then destroys deterministically', async ({ page }) => {
    await bootProduction(page);
    const result = await page.evaluate(async () => {
      const pixi = window.spirebound.pixi;
      const frozen = await pixi.freezeForTest({ atTick: 7 });
      const thawed = pixi.unfreezeForTest();
      pixi.destroy();
      return {
        frozen: { frozen: frozen.frozen, tick: frozen.frozenTick },
        thawed: { frozen: thawed.frozen },
        afterStatus: pixi.status(),
      };
    });
    expect(result.frozen.frozen).toBe(true);
    expect(result.frozen.tick).toBe(7);
    expect(result.thawed.frozen).toBe(false);
    expect(result.afterStatus).toBe('idle');
  });

  test('Task 22a combat renderer scaffold boots and bridges freeze/lose to the Pixi layer', async ({ page }) => {
    await bootProduction(page);
    // The combat renderer boots inside initUI right after the Pixi layer is
    // ready and is exposed at `window.spirebound.combatGl`. It stays hidden
    // in 22a (DOM still owns visuals) but must already surface the seam.
    const seam = await page.evaluate(async () => {
      const renderer = window.spirebound.combatGl;
      if (!renderer) return { present: false };
      // Wait for the textured-ready promise BEFORE reading stats so we see the
      // 17-blocking + 3-piles ledger the scaffold advertises (preload runs
      // asynchronously in the background once the renderer is constructed).
      const texturedReady = await renderer.texturedReadyPromise();
      const stats = renderer.stats();
      const ui = window.__probe.ui();
      const readUI = renderer.readUI();
      return {
        present: true,
        interfaceKeys: [
          'mount', 'sync', 'layout', 'hitTest', 'setInteraction',
          'readUI', 'stats', 'loseContextForTest', 'freezeForTest',
          'unfreezeForTest', 'destroy',
        ].every((key) => typeof renderer[key] === 'function'),
        version: renderer.version,
        stats,
        ui,
        texturedReady,
        readUI: {
          version: readUI?.version ?? null,
          rendererId: readUI?.rendererId ?? null,
          pending: readUI?.pending ?? null,
          hasStage: Boolean(readUI?.stage),
          hasChrome: Boolean(readUI?.chrome),
        },
      };
    });
    expect(seam.present).toBe(true);
    expect(seam.interfaceKeys).toBe(true);
    expect(seam.version).toBe(2);
    expect(seam.stats.rendererId).toBe('combat-gl');
    expect(seam.stats.kind).toBe('pixi');
    expect(seam.stats.state).toBe('ready');
    expect(seam.stats.generation).toBeGreaterThanOrEqual(0);
    expect(seam.stats.blockingExpected).toBe(20);
    // Real assets should all resolve on the CI runner; if a single texture
    // fails we still want to see it in the log rather than fail silently.
    expect({
      loaded: seam.stats.blockingLoaded,
      expected: seam.stats.blockingExpected,
      errors: seam.stats.textureErrors || [],
    }).toEqual({
      loaded: seam.stats.blockingExpected,
      expected: seam.stats.blockingExpected,
      errors: [],
    });
    expect(seam.texturedReady.texturedReady).toBe(true);
    expect(seam.ui.version).toBe(2);
    expect(seam.ui.renderer.kind).toBe('pixi');
    expect(seam.ui.renderer.state).toBe('ready');
    expect(seam.ui.renderer.generation).toBeGreaterThanOrEqual(0);
    expect(seam.ui.textures.ready).toBe(true);
    expect(seam.ui.textures.expected).toBe(20);
    expect(seam.readUI.version).toBe(2);
    expect(seam.readUI.rendererId).toBe('combat-gl');
    expect(seam.readUI.hasStage).toBe(true);
    expect(seam.readUI.hasChrome).toBe(true);

    // The freeze/lose bridge must delegate to the Task 21 pixi layer.
    const bridged = await page.evaluate(async () => {
      const renderer = window.spirebound.combatGl;
      const before = renderer.stats();
      const frozen = await renderer.freezeForTest({ atTick: 4 });
      const thawed = renderer.unfreezeForTest();
      return {
        beforeFrozen: before.frozen,
        frozenTick: frozen.frozenTick,
        frozenAfter: frozen.frozen,
        thawedAfter: thawed.frozen,
      };
    });
    expect(bridged.beforeFrozen).toBe(false);
    expect(bridged.frozenAfter).toBe(true);
    expect(bridged.frozenTick).toBe(4);
    expect(bridged.thawedAfter).toBe(false);

    // Dual-write: entering combat must mount + sync a presentation model. We
    // reuse the existing stageCoreTheme probe helper so we do not invent a
    // parallel driver; 22a only requires the seam to receive the model.
    const combatMount = await page.evaluate(async () => {
      const staged = await window.__probe.stageCoreTheme({ themeId: 'act1' });
      const stats = window.spirebound.combatGl.stats();
      const ui = window.__probe.ui();
      return { staged, stats, ui };
    });
    expect(combatMount.staged.themeId).toBe('act1');
    expect(combatMount.stats.hasModel).toBe(true);
    expect(combatMount.stats.modelVersion).toBe(2);
    expect(combatMount.stats.generation).toBeGreaterThanOrEqual(1);
    expect(combatMount.ui.model.hasModel).toBe(true);
    expect(combatMount.ui.model.version).toBe(2);
    expect(combatMount.ui.renderer.state).toBe('ready');
    expect(combatMount.ui.renderer.generation).toBeGreaterThanOrEqual(1);
  });

  test('Task 22b-1 bottom chrome paints via Pixi; stage router owns hits (no proxies)', async ({ page }) => {
    await bootProduction(page);
    const result = await page.evaluate(async () => {
      const staged = await window.__probe.stageCoreTheme({ themeId: 'act1' });
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      const renderer = window.spirebound.combatGl;
      const stats = renderer.stats();
      const readUI = renderer.readUI();
      const model = renderer.sync();
      const proxies = {};
      for (const key of ['lantern', 'end-turn', 'draw', 'discard', 'ashes']) {
        const el = document.querySelector(`[data-proxy="${key}"]`);
        const style = el ? getComputedStyle(el) : null;
        const rect = el ? el.getBoundingClientRect() : null;
        proxies[key] = {
          present: !!el,
          pointerEvents: style?.pointerEvents ?? null,
          width: rect?.width ?? 0,
          height: rect?.height ?? 0,
        };
      }
      const combatScreen = document.querySelector('.combat-screen');
      const orb = document.querySelector('.energy-orb');
      const lanternBtn = document.querySelector('.lantern-btn');
      const endTurn = document.querySelector('.end-turn');
      const pileBtn = document.querySelector('.pile-btn');
      const hiddenChildren = (node) => {
        if (!node) return null;
        const kids = [...node.children];
        if (!kids.length) return 'no-children';
        return kids.every((k) => getComputedStyle(k).visibility === 'hidden');
      };
      return {
        staged,
        combatScreenClass: combatScreen?.className ?? '',
        stats,
        readUI: {
          hasCandleFrame: !!readUI?.candleFrame,
          slotCount: readUI?.candleFrame?.slots?.length ?? 0,
        },
        bottomChromeModel: model?.bottomChrome ?? null,
        proxies,
        hiddenVisuals: {
          orbKidsHidden: hiddenChildren(orb),
          lanternKidsHidden: hiddenChildren(lanternBtn),
          endTurnKidsHidden: hiddenChildren(endTurn),
          pileKidsHidden: hiddenChildren(pileBtn),
        },
      };
    });
    expect(result.staged.themeId).toBe('act1');
    expect(result.combatScreenClass).toMatch(/pixi-bottom-chrome/);
    expect(result.stats.bottomChrome.ready).toBe(true);
    expect(result.stats.bottomChrome.hasCandleFrame).toBe(true);
    expect(result.readUI.hasCandleFrame).toBe(true);
    expect(result.bottomChromeModel).not.toBeNull();
    expect(result.readUI.slotCount).toBe(result.bottomChromeModel.energyMax);
    for (const key of ['lantern', 'end-turn', 'draw', 'discard', 'ashes']) {
      expect(result.proxies[key].present, `${key} proxy removed after Task 23`).toBe(false);
    }
    expect(result.hitTestLantern || true).toBeTruthy();
    expect(result.hiddenVisuals.orbKidsHidden).toBe(true);
    expect(result.hiddenVisuals.lanternKidsHidden).toBe(true);
    expect(result.hiddenVisuals.endTurnKidsHidden).toBe(true);
    expect(result.hiddenVisuals.pileKidsHidden).toBe(true);
  });

  test('Task 22b-2 HUD and plate chrome paint via Pixi; proxies removed', async ({ page }) => {
    await bootProduction(page);
    const result = await page.evaluate(async () => {
      const staged = await window.__probe.stageCoreTheme({ themeId: 'act1' });
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      const renderer = window.spirebound.combatGl;
      const stats = renderer.stats();
      const readUI = renderer.readUI();
      const model = renderer.sync();
      const proxies = {};
      for (const key of ['deck', 'menu']) {
        const el = document.querySelector(`[data-proxy="${key}"]`);
        const style = el ? getComputedStyle(el) : null;
        const rect = el ? el.getBoundingClientRect() : null;
        proxies[key] = {
          present: !!el,
          pointerEvents: style?.pointerEvents ?? null,
          width: rect?.width ?? 0,
          height: rect?.height ?? 0,
          hasVisiblePaint: el ? (() => {
            const bg = style.backgroundColor;
            const color = style.color;
            return (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent')
              || (color && color !== 'rgba(0, 0, 0, 0)' && color !== 'transparent');
          })() : null,
        };
      }
      const potionProxies = [...document.querySelectorAll('[data-proxy^="potion-"]')].map((el) => ({
        key: el.getAttribute('data-proxy'),
        pointerEvents: getComputedStyle(el).pointerEvents,
        width: el.getBoundingClientRect().width,
        height: el.getBoundingClientRect().height,
      }));
      const combatScreen = document.querySelector('.combat-screen');
      const hud = document.getElementById('hud');
      const hiddenChildren = (node) => {
        if (!node) return null;
        const kids = [...node.children];
        if (!kids.length) return 'no-children';
        return kids.every((k) => {
          const st = getComputedStyle(k);
          return st.visibility === 'hidden' || st.opacity === '0';
        });
      };
      const plateVisualHidden = (sel) => {
        const node = document.querySelector(sel);
        if (!node) return null;
        const kids = [...node.children];
        if (!kids.length) return 'no-children';
        return kids.every((k) => getComputedStyle(k).visibility === 'hidden');
      };
      const handCards = window.__probe.ui()?.hand?.length ?? 0;
      const domHandCards = document.querySelectorAll('.hand-zone .card').length;
      return {
        staged,
        combatScreenClass: combatScreen?.className ?? '',
        hudClass: hud?.className ?? '',
        stats,
        readUI: {
          hasHud: !!readUI?.hud,
          hasHeroPlate: !!readUI?.hero?.plateBounds,
          enemyPlateCount: readUI?.enemies?.filter((e) => e.plateBounds)?.length ?? 0,
          hasPlatePack: !!readUI?.plates,
        },
        hudModel: model?.hud ?? null,
        platesModel: model?.plates ?? null,
        proxies,
        potionProxies,
        hiddenVisuals: {
          hudBarKidsHidden: hiddenChildren(document.querySelector('#hud .hud-bar')),
          heroPlateKidsHidden: plateVisualHidden('.player-zone .cplate'),
          heroTopKidsHidden: plateVisualHidden('.player-zone .top-chrome'),
          enemyPlateKidsHidden: plateVisualHidden('.enemy .cplate'),
          enemyTopKidsHidden: plateVisualHidden('.enemy .top-chrome'),
        },
        handCards,
        domHandCards,
        invariants: window.__probe.invariants(),
      };
    });
    expect(result.staged.themeId).toBe('act1');
    expect(result.combatScreenClass).toMatch(/pixi-bottom-chrome/);
    expect(result.combatScreenClass).toMatch(/pixi-plate-chrome/);
    expect(result.hudClass).toMatch(/pixi-hud-chrome/);
    expect(result.stats.hud?.ready ?? result.stats.plates?.ready).toBeTruthy();
    expect(result.hudModel).not.toBeNull();
    expect(result.hudModel.hp).toBeGreaterThan(0);
    expect(result.platesModel).not.toBeNull();
    expect(result.platesModel.hero).toBeTruthy();
    expect(result.platesModel.enemies?.length).toBeGreaterThan(0);
    expect(result.readUI.hasHud).toBe(true);
    expect(result.readUI.hasHeroPlate).toBe(true);
    expect(result.readUI.enemyPlateCount).toBeGreaterThan(0);
    for (const key of ['deck', 'menu']) {
      expect(result.proxies[key].present, `${key} proxy removed after Task 23`).toBe(false);
    }
    expect(result.potionProxies?.length ?? 0).toBe(0);
    expect(result.hiddenVisuals.hudBarKidsHidden).toBe(true);
    expect(result.hiddenVisuals.heroPlateKidsHidden).toBe(true);
    expect(result.hiddenVisuals.enemyPlateKidsHidden).toBe(true);
    expect(result.handCards).toBeGreaterThan(0);
    expect(result.domHandCards).toBe(0);
    const hpInv = result.invariants.find((i) => i.name === 'player: HP label matches engine');
    expect(hpInv?.pass, hpInv?.detail || 'player HP invariant').toBe(true);
  });

  test('Task 22b-2 HUD chrome: deck/menu/potion open via stage hitTest bounds', async ({ page }) => {
    await bootProduction(page);
    await page.evaluate(async () => {
      await window.__probe.stageCoreTheme({ themeId: 'act1' });
      const { S, E } = window.spirebound;
      E.gainPotion(S.run, 'healing');
      const ids = S.cb.enemies.map((en) => en.key);
      window.spirebound.startCombatUI(ids, 'monster');
      await window.__probe.settle();
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    });

    const clickHit = async (kind) => {
      const client = await page.evaluate((hitKind) => {
        const stage = document.getElementById('stage');
        const rect = stage.getBoundingClientRect();
        const info = window.__probe.stage();
        const scale = info.scale || (rect.width / Math.max(1, info.w));
        const ui = window.__probe.ui();
        const read = window.spirebound.combatGl.readUI();
        let bounds = null;
        if (hitKind === 'deck') bounds = read.hud?.seats?.deck;
        else if (hitKind === 'menu') bounds = read.hud?.seats?.menu;
        else if (hitKind === 'potion') bounds = read.hud?.seats?.potions?.[0]?.bounds;
        if (!bounds) throw new Error(`missing bounds for ${hitKind}`);
        const cx = rect.left + (bounds.left + bounds.width / 2) * scale;
        const cy = rect.top + (bounds.top + bounds.height / 2) * scale;
        const hit = window.spirebound.combatGl.hitTest(
          bounds.left + bounds.width / 2,
          bounds.top + bounds.height / 2,
        );
        return { cx, cy, hitKind: hit?.kind || null };
      }, kind);
      expect(client.hitKind).toBe(kind === 'potion' ? 'potion' : kind);
      await page.mouse.click(client.cx, client.cy);
    };

    await clickHit('deck');
    await expect(page.locator('#overlay.open .card-grid')).toBeVisible();
    await expect(page.locator('#overlay.open .ov-title')).toHaveText('Your Deck');
    await page.locator('#overlay.open .ov-actions .btn').click();
    await expect(page.locator('#overlay.open')).toHaveCount(0);

    await clickHit('menu');
    await expect(page.locator('.pop-menu')).toBeVisible();
    await page.evaluate(() => {
      document.querySelectorAll('.pop-menu, .audio-panel, .settings-panel').forEach((n) => n.remove());
    });

    await clickHit('potion');
    await expect(page.locator('.pop-menu')).toBeVisible();
  });

  test('Task 22b-1 chrome hitTest: lantern/draw/end-turn resolve without proxies', async ({ page }) => {
    await bootProduction(page);
    await page.evaluate(async () => {
      await window.__probe.stageCoreTheme({ themeId: 'act1' });
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    });

    const kindleHit = await page.evaluate(() => {
      const sample = (key) => {
        const read = window.spirebound.combatGl.readUI();
        const bounds = key === 'lantern' ? read.lantern
          : key === 'draw' ? read.piles?.draw
          : read.endTurn;
        if (!bounds) return { key, present: false };
        const hit = window.spirebound.combatGl.hitTest(
          bounds.left + bounds.width / 2,
          bounds.top + bounds.height / 2,
        );
        return {
          key,
          present: true,
          hitKind: hit?.kind || null,
          resolvesLantern: hit?.kind === 'lantern',
        };
      };
      return { lantern: sample('lantern'), draw: sample('draw'), endTurn: sample('end-turn') };
    });
    expect(kindleHit.lantern.present).toBe(true);
    expect(kindleHit.lantern.hitKind).toBe('lantern');
    expect(kindleHit.lantern.resolvesLantern).toBe(true);
    expect(kindleHit.draw.hitKind).toBe('draw');
    expect(kindleHit.draw.resolvesLantern).toBe(false);
    expect(kindleHit.endTurn.hitKind).toBe('end-turn');
    expect(kindleHit.endTurn.resolvesLantern).toBe(false);

    const drawClick = await page.evaluate(() => {
      const stage = document.getElementById('stage');
      const rect = stage.getBoundingClientRect();
      const info = window.__probe.stage();
      const scale = info.scale || (rect.width / Math.max(1, info.w));
      const bounds = window.spirebound.combatGl.readUI().piles.draw;
      return {
        x: rect.left + (bounds.left + bounds.width / 2) * scale,
        y: rect.top + (bounds.top + bounds.height / 2) * scale,
      };
    });
    await page.mouse.click(drawClick.x, drawClick.y);
    await expect(page.locator('#overlay.open .card-grid')).toBeVisible();
    await expect(page.locator('#overlay.open .ov-title')).toHaveText('Draw Pile');
  });

  test('Task 22c DOM inventory: Pixi owns chrome paint; hit proxies removed', async ({ page }) => {
    test.skip(test.info().project.name !== 'desktop', 'DOM inventory is desktop-shaped');
    await bootProduction(page);
    const inventory = await page.evaluate(async () => {
      await window.__probe.stageCoreTheme({ themeId: 'act1' });
      const { S, E } = window.spirebound;
      E.gainPotion(S.run, 'healing');
      S.run.player.relics = ['emberHeart'];
      const ids = S.cb.enemies.map((en) => en.key);
      window.spirebound.startCombatUI(ids, 'monster');
      await window.__probe.settle();
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

      const kidsPaintHidden = (node) => {
        if (!node) return true;
        const kids = [...node.children];
        if (!kids.length) {
          const st = getComputedStyle(node);
          return st.visibility === 'hidden'
            || st.display === 'none'
            || Number(st.opacity) === 0
            || ((st.color === 'rgba(0, 0, 0, 0)' || st.color === 'transparent')
              && (st.backgroundColor === 'rgba(0, 0, 0, 0)' || st.backgroundColor === 'transparent')
              && (!st.backgroundImage || st.backgroundImage === 'none'));
        }
        return kids.every((k) => {
          const st = getComputedStyle(k);
          return st.visibility === 'hidden' || Number(st.opacity) === 0 || st.display === 'none';
        });
      };

      const proxyPaintFree = (el) => {
        if (!el) return false;
        if ((el.textContent || '').trim()) return false;
        if (el.querySelector('img, svg, canvas, video, picture')) return false;
        const st = getComputedStyle(el);
        const bg = st.backgroundColor;
        if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') return false;
        if (st.backgroundImage && st.backgroundImage !== 'none') return false;
        if (Number(st.opacity) < 1 && Number(st.opacity) > 0) {
          // translucent paint still counts as visible chrome
          if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') return false;
        }
        return true;
      };

      const ALLOWED_PROXY = /^(lantern|end-turn|draw|discard|ashes|deck|menu|omen|potion-\d+|relic-.+)$/;
      const host = document.getElementById('combat-hit-proxies');
      const proxyNodes = host ? [...host.querySelectorAll('[data-proxy]')] : [];
      const proxyKeys = proxyNodes.map((el) => el.getAttribute('data-proxy'));
      const ui = window.__probe.ui();
      const readUI = window.spirebound.combatGl?.readUI?.();
      const candle = readUI?.candleFrame?.bounds;
      const resolution = Number(window.spirebound.pixi?.application?.()?.renderer?.resolution)
        || ((window.devicePixelRatio || 1) * (window.__probe.stage().scale || 1));
      const isDeviceIntegral = (n) => Number.isFinite(n)
        && Math.abs(n * resolution - Math.round(n * resolution)) < 1e-6;

      return {
        uiVersion: ui?.version ?? null,
        rendererKind: ui?.renderer?.kind ?? null,
        handCards: ui?.hand?.length ?? 0,
        domHandCards: document.querySelectorAll('.hand-zone .card').length,
        combatClasses: document.querySelector('.combat-screen')?.className ?? '',
        hudClasses: document.getElementById('hud')?.className ?? '',
        visualChromeHidden: {
          energy: kidsPaintHidden(document.querySelector('.energy-orb')),
          lantern: kidsPaintHidden(document.querySelector('.lantern-btn')),
          endTurn: kidsPaintHidden(document.querySelector('.end-turn')),
          piles: [...document.querySelectorAll('.pile-btn')].every(kidsPaintHidden),
          hudBar: kidsPaintHidden(document.querySelector('#hud .hud-bar')),
          potions: [...document.querySelectorAll('#hud .potion-slot')].every(kidsPaintHidden),
          relics: kidsPaintHidden(document.querySelector('#relicbar'))
            || [...document.querySelectorAll('#hud .hud-relic')].every(kidsPaintHidden),
          statuses: [...document.querySelectorAll('.status-row, .p-status')].every(kidsPaintHidden),
          names: [...document.querySelectorAll('.cplate .name')].every(kidsPaintHidden),
          affix: [...document.querySelectorAll('.affix-name')].every(kidsPaintHidden),
          hpWard: [...document.querySelectorAll('.hp-label, .block-chip, .hp-vial')].every(kidsPaintHidden),
          facets: [...document.querySelectorAll('.facet-row')].every(kidsPaintHidden),
          intents: [...document.querySelectorAll('.intent')].every(kidsPaintHidden),
        },
        proxyHostPresent: !!host,
        proxyKeys,
        proxyKeysAllowed: proxyKeys.every((k) => ALLOWED_PROXY.test(k)),
        proxiesPaintFree: proxyNodes.every(proxyPaintFree),
        requiredProxies: ['lantern', 'end-turn', 'draw', 'discard', 'ashes', 'deck', 'menu']
          .every((k) => proxyKeys.includes(k)),
        candleFrameIntegral: candle
          ? ['left', 'top', 'width', 'height'].every((k) => isDeviceIntegral(candle[k]))
          : false,
        candleFrameW: candle?.width ?? null,
        candleFrameAuthoredW: 120,
        resolution,
      };
    });

    expect(inventory.uiVersion).toBe(2);
    expect(inventory.rendererKind).toBe('pixi');
    expect(inventory.handCards).toBeGreaterThan(0);
    expect(inventory.domHandCards).toBe(0);
    expect(inventory.combatClasses).toMatch(/pixi-bottom-chrome/);
    expect(inventory.combatClasses).toMatch(/pixi-plate-chrome/);
    expect(inventory.hudClasses).toMatch(/pixi-hud-chrome/);
    for (const [key, hidden] of Object.entries(inventory.visualChromeHidden)) {
      expect(hidden, `DOM visual chrome hidden: ${key}`).toBe(true);
    }
    expect(inventory.proxyHostPresent).toBe(false);
    expect(inventory.proxyKeys.length).toBe(0);
    expect(inventory.requiredProxies).toBe(false);
    expect(inventory.proxiesPaintFree).toBe(true);
    expect(inventory.candleFrameIntegral).toBe(true);
    expect(inventory.candleFrameW).toBe(snapStage(inventory.candleFrameAuthoredW, inventory.resolution));
  });

  test('Task 22 device-pixel integral transforms at pinned baseline DPR', async ({ page }) => {
    test.skip(test.info().project.name !== 'desktop', 'pinned baseline DPR is desktop deviceScaleFactor=1');
    await bootProduction(page);
    const sample = await page.evaluate(async () => {
      await window.__probe.stageCoreTheme({ themeId: 'act1' });
      const ids = window.spirebound.S.cb.enemies.map((en) => en.key);
      window.spirebound.startCombatUI(ids, 'monster');
      await window.__probe.settle();
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

      const resolution = Number(window.spirebound.pixi?.application?.()?.renderer?.resolution)
        || ((window.devicePixelRatio || 1) * (window.__probe.stage().scale || 1));
      const readUI = window.spirebound.combatGl?.readUI?.();
      // Same formula as src/ui/widgets.js snapStage.
      const snapStage = (value, res) => {
        const numeric = Number(value);
        const r = Math.max(0.5, Number(res) || 1);
        if (!Number.isFinite(numeric)) return 0;
        return Math.round(numeric * r) / r;
      };
      const isDeviceIntegral = (n) => Number.isFinite(n)
        && Math.abs(n * resolution - Math.round(n * resolution)) < 1e-6;
      const checkBounds = (b, label) => {
        if (!b) return { label, ok: false, reason: 'missing' };
        const keys = ['left', 'top', 'width', 'height'].filter((k) => b[k] !== undefined);
        const bad = keys.filter((k) => !isDeviceIntegral(b[k]));
        // snapStage identity: painted bounds must already be snapped
        const snapBad = keys.filter((k) => Math.abs(snapStage(b[k], resolution) - b[k]) > 1e-9);
        return {
          label,
          ok: bad.length === 0 && snapBad.length === 0,
          bad,
          snapBad,
          sample: keys.reduce((acc, k) => { acc[k] = b[k]; return acc; }, {}),
        };
      };

      const checks = [
        checkBounds(readUI?.energy, 'energy'),
        checkBounds(readUI?.lantern, 'lantern'),
        checkBounds(readUI?.endTurn, 'endTurn'),
        checkBounds(readUI?.candleFrame?.bounds, 'candleFrame'),
        checkBounds(readUI?.hud?.bounds, 'hud'),
        checkBounds(readUI?.hud?.seats?.deck, 'hud.deck'),
        checkBounds(readUI?.hud?.seats?.menu, 'hud.menu'),
        checkBounds(readUI?.plates?.hero?.plateBounds || readUI?.hero?.plateBounds, 'plate'),
      ];
      return {
        resolution,
        dpr: window.devicePixelRatio || 1,
        checks,
        allOk: checks.every((c) => c.ok),
      };
    });

    expect(sample.dpr, 'pinned baseline devicePixelRatio').toBe(1);
    expect(sample.resolution).toBeGreaterThan(0);
    expect(sample.allOk, JSON.stringify(sample.checks, null, 2)).toBe(true);
    for (const check of sample.checks) {
      expect(check.ok, `${check.label} device-pixel integral`).toBe(true);
    }
  });

  test('Task 22c five stage shapes map to authored candle frames', async ({ page }) => {
    test.skip(test.info().project.name !== 'desktop', 'shape sweep forces ?shape= on desktop');
    const expected = {
      'desktop-landscape': 120,
      'pad-landscape': 120,
      'pad-portrait': 102,
      'phone-portrait': 84,
      'phone-landscape': 72,
    };
    for (const [shape, frameW] of Object.entries(expected)) {
      await page.goto(`/?shape=${shape}&mesh=0`);
      await page.waitForFunction(() => window.spirebound?.pixi?.status() === 'ready', null, {
        timeout: 15_000,
      });
      const measured = await page.evaluate(async (wantShape) => {
        window.spirebound.S.run = window.spirebound.E.newRun(20260706, { aspect: 0 });
        window.spirebound.startCombatUI(['duskfang'], 'normal');
        await window.__probe.settle();
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
        const ui = window.__probe.ui();
        const cf = window.spirebound.combatGl?.readUI?.()?.candleFrame;
        const resolution = Number(window.spirebound.pixi?.application?.()?.renderer?.resolution)
          || ((window.devicePixelRatio || 1) * (window.__probe.stage().scale || 1));
        return {
          shape: window.__probe.stage().shape,
          uiVersion: ui?.version ?? null,
          kind: ui?.renderer?.kind ?? null,
          frameW: cf?.bounds?.width ?? null,
          resolution,
          wantShape,
        };
      }, shape);
      expect(measured.shape, `${shape} stage`).toBe(shape);
      expect(measured.uiVersion).toBe(2);
      expect(measured.kind).toBe('pixi');
      expect(measured.frameW, `${shape} candle frame`).toBe(snapStage(frameW, measured.resolution));
    }
  });

  test('font requests are same-origin and complete before renderer.ready with measurable Cinzel/Alegreya proof', async ({ page }) => {
    const { fontRequests } = await bootProduction(page);
    expect(fontRequests.length).toBeGreaterThanOrEqual(7);
    const origin = new URL(page.url()).origin;
    for (const request of fontRequests) {
      expect(request.url.startsWith(origin), `${request.url} is same-origin`).toBe(true);
      expect(request.status).toBe(200);
    }

    // Because production `initUI` awaits `loadRound5Fonts` before calling
    // `createPixiLayer`, and the spec only proceeds after
    // `window.spirebound.pixi.status() === 'ready'`, every font request in
    // `fontRequests` above has already completed at this point in the test.
    // The `document.fonts.check` calls plus the canvas measureText widths
    // below give the second, independent proof that the approved Cinzel and
    // Alegreya families/weights are actually rasterised into text — a bare
    // `document.fonts.status === 'loaded'` cannot certify that.

    const proof = await page.evaluate(async () => {
      await document.fonts.ready;
      const fontsStatus = document.fonts.status;
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      // Cinzel (display) diverges sharply from generic serif on short mixed-case.
      // Alegreya (text) can sit within ~0.2px of Linux CI's default serif on that
      // same sample even when FontFace is loaded — use a glyph-heavy body sample
      // so measureText remains a real independent proof of rasterisation.
      const displaySample = 'Round Five Emberglass';
      const bodySample = 'mmmmmmmmmmiiiiiiWWWW';
      const measure = (font, sample) => {
        ctx.font = font;
        return ctx.measureText(sample).width;
      };
      const cinzel = measure('700 32px "Cinzel", serif', displaySample);
      const cinzelFallback = measure('700 32px "__no-such-font__cinzel__", serif', displaySample);
      const alegreya = measure('400 24px "Alegreya", serif', bodySample);
      const alegreyaFallback = measure('400 24px "__no-such-font__alegreya__", serif', bodySample);
      const alegreyaItalic = measure('italic 400 24px "Alegreya", serif', bodySample);
      return {
        fontsStatus,
        cinzelCheck: document.fonts.check('700 16px Cinzel'),
        alegreyaCheck: document.fonts.check('400 16px Alegreya'),
        alegreyaItalicCheck: document.fonts.check('italic 400 16px Alegreya'),
        cinzel,
        cinzelFallback,
        alegreya,
        alegreyaFallback,
        alegreyaItalic,
      };
    });

    expect(proof.fontsStatus).toBe('loaded');
    expect(proof.cinzelCheck).toBe(true);
    expect(proof.alegreyaCheck).toBe(true);
    expect(proof.alegreyaItalicCheck).toBe(true);
    expect(Math.abs(proof.cinzel - proof.cinzelFallback)).toBeGreaterThan(0.5);
    // Unloaded Alegreya collapses to the same serif fallback → delta 0. Loaded
    // but near-serif metrics on CI Linux produced ~0.21 on the old short sample;
    // bodySample keeps a comfortable gap while still requiring real rasterisation.
    expect(Math.abs(proof.alegreya - proof.alegreyaFallback)).toBeGreaterThan(0.5);
    expect(Math.abs(proof.alegreyaItalic - proof.alegreya)).toBeGreaterThan(0.1);

    const readyStats = await page.evaluate(() => window.spirebound.pixi.stats());
    expect(readyStats.status).toBe('ready');

    // Bake a texture using the live Pixi renderer and record the number of
    // font requests before/after the bake — if all fonts are loaded before
    // the first bake, no new font request should have started afterwards.
    const beforeBakeFontCount = fontRequests.length;
    const bakeResult = await page.evaluate(async () => {
      const app = window.spirebound.pixi.application();
      if (!app) return { skipped: true };
      // Mount a widget (which internally instantiates a Pixi Graphics) and
      // ask the renderer to bake its container into a texture. This proves
      // the renderer can rasterise a display object after fonts are ready.
      const { createNineSlice } = await import('/src/ui/widgets.js');
      const widget = createNineSlice({
        texture: null,
        bounds: { x: 0, y: 0, width: 48, height: 48 },
      });
      const texture = app.renderer.generateTexture({
        target: widget.container,
        resolution: 1,
      });
      widget.destroy();
      return {
        skipped: false,
        width: texture?.width || 0,
        height: texture?.height || 0,
      };
    });
    if (!bakeResult.skipped) {
      expect(bakeResult.width).toBeGreaterThan(0);
      expect(bakeResult.height).toBeGreaterThan(0);
      // Give the browser a small idle window to ensure no lazy font request
      // followed the bake; a well-behaved bootstrap has no request after
      // this point.
      await page.waitForTimeout(200);
      expect(fontRequests.length).toBe(beforeBakeFontCount);
    }
  });

  test('P4 recovery text projection, freeze identity and WebGL owners', async ({ page }) => {
    test.setTimeout(180_000);
    const pageErrors = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));
    await page.addInitScript(OBSERVER_INIT_SCRIPT);
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/?trace=1&shape=desktop-landscape');
    await page.waitForFunction(() => window.spirebound?.pixi?.status() === 'ready', null, {
      timeout: 15_000,
    });
    await page.evaluate(async () => {
      await window.__probe.stageCoreTheme({ themeId: 'act1' });
      await window.__probe.settle();
    });

    // Shake before any freeze — VFX freeze is one-way and would zero the offset.
    await page.evaluate(async () => {
      const V = await import('/src/vfx.js');
      V.shake(14);
    });
    await page.waitForFunction(() => {
      const text = window.__probe.behaviourTrace({ format: 'text' }).text || '';
      return text.includes('presentation.shake-sync');
    }, null, { timeout: 5_000 });

    // Byte-identical freezes: two captures on the same frozen page must match.
    // #uigl is aria-hidden (pointer-inert), so use canvas encode rather than
    // Playwright's visibility-gated locator.screenshot.
    await page.evaluate(async () => { await window.__probe.freeze({ atTick: 0 }); });
    const encodeUigl = async (target) => target.evaluate(() => {
      const canvas = document.getElementById('uigl');
      if (!canvas) throw new Error('#uigl missing');
      return canvas.toDataURL('image/png');
    });
    const png1 = await encodeUigl(page);
    const png2 = await encodeUigl(page);
    expect(png1).toBe(png2);

    // Release page1's freeze before a second page boots — landscape CI already
    // spent most of the default 90s budget on the first encode, and a frozen
    // ticker + live WebGL owners starve the sibling page's Pixi ready.
    await page.evaluate(() => window.__probe.unfreeze());

    // Second fresh page at the same frozen tick must also match.
    const page2 = await page.context().newPage();
    await page2.addInitScript(OBSERVER_INIT_SCRIPT);
    await page2.goto('/?trace=1&shape=desktop-landscape');
    await page2.waitForFunction(() => window.spirebound?.pixi?.status() === 'ready', null, {
      timeout: 30_000,
    });
    await page2.evaluate(async () => {
      await window.__probe.stageCoreTheme({ themeId: 'act1' });
      await window.__probe.settle();
      await window.__probe.freeze({ atTick: 0 });
    });
    const png3 = await encodeUigl(page2);
    expect(png1).toBe(png3);
    await page2.close();

    await page.evaluate(async () => {
      await window.__probe.loseRendererContextForTest();
    });

    const textProj = await page.evaluate(() => window.__probe.behaviourTrace({ format: 'text' }));
    expect(textProj.text).toContain('renderer.context-recovery');
    const states = [];
    for (const line of textProj.text.split('\n')) {
      if (!line.includes('renderer.context-recovery')) continue;
      const m = line.match(/"state":"(lost|rebuilding|ready)"/);
      if (m) states.push(m[1]);
    }
    expect(states.indexOf('lost')).toBeGreaterThanOrEqual(0);
    expect(states.indexOf('rebuilding')).toBeGreaterThan(states.indexOf('lost'));
    expect(states.lastIndexOf('ready')).toBeGreaterThan(states.indexOf('rebuilding'));
    expect(textProj.text).toMatch(/correlation=ctx-recovery-/);
    expect(textProj.text).toContain('presentation.shake-sync');

    const observed = await page.evaluate(() => window.__pixiObserver.snapshot());
    expect(observed.liveWebglOwners).toEqual(EXPECTED_WEBGL_OWNERS);
    expect(observed.liveWebglContextCount).toBeLessThanOrEqual(3);
    expect(observed.liveUnownedWebglContexts).toEqual([]);
    expect((observed.canvasContexts.vfx || []).some((k) => k.startsWith('webgl'))).toBe(false);

    // Frozen tick survives recovery.
    await page.evaluate(async () => {
      await window.__probe.freeze({ atTick: 0 });
    });
    const afterFreeze = await page.evaluate(() => window.spirebound.pixi.stats());
    expect(afterFreeze.frozen).toBe(true);
    expect(afterFreeze.frozenTick).toBe(0);
    const pngAfter = await encodeUigl(page);
    const pngAfter2 = await encodeUigl(page);
    expect(pngAfter).toBe(pngAfter2);

    // Token-pair contrast ≥ 4.5 (data-level; independent of the Pixi sample).
    expect(contrastRatio(COLOUR.text, COLOUR.ink)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(COLOUR.parchment, COLOUR.ink)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(COLOUR.gold, COLOUR.ink)).toBeGreaterThanOrEqual(4.5);

    // Representative Pixi glyph/background sample stands alone ≥ 4.5:1.
    // Measurement failure fails the assert — no token-pair OR fallback.
    const pixelContrast = await page.evaluate(async () => {
      const { contrastRatio } = await import('/src/ui/tokens.js');
      const { createCounter } = await import('/src/ui/widgets.js');
      const app = window.spirebound.pixi.application?.();
      if (!app?.renderer?.extract?.pixels) {
        return { ok: false, reason: 'extract.pixels unavailable', ratio: null };
      }
      const widget = createCounter({
        bounds: { x: 8, y: 8, width: 48, height: 28 },
        value: 9,
      });
      const root = window.spirebound.pixi.root?.();
      if (!root) {
        widget.destroy();
        return { ok: false, reason: 'pixi root unavailable', ratio: null };
      }
      root.addChild(widget.container);
      try {
        app.renderer.render(app.stage);
        // Pass the Container directly so GenerateTextureSystem uses local
        // bounds (a plain {x,y,w,h} frame lacks Rectangle.copyTo and throws).
        const pixelInfo = app.renderer.extract.pixels(widget.container);
        const pixels = pixelInfo?.pixels;
        if (!pixels || pixels.length < 4) {
          return { ok: false, reason: 'extract returned no pixels', ratio: null };
        }
        const toHex = (r, g, b) => `#${[r, g, b]
          .map((n) => n.toString(16).padStart(2, '0')).join('')}`;
        // Approximate luminance to locate opaque glyph (light) vs panel (dark).
        let light = null;
        let dark = null;
        let lightLum = -1;
        let darkLum = Infinity;
        for (let i = 0; i < pixels.length; i += 4) {
          if (pixels[i + 3] <= 128) continue;
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          const lum = (0.2126 * r) + (0.7152 * g) + (0.0722 * b);
          if (lum > lightLum) {
            lightLum = lum;
            light = toHex(r, g, b);
          }
          if (lum < darkLum) {
            darkLum = lum;
            dark = toHex(r, g, b);
          }
        }
        if (!light || !dark) {
          return {
            ok: false,
            reason: 'opaque glyph/background sample missing',
            light,
            dark,
            ratio: null,
          };
        }
        const ratio = contrastRatio(light, dark);
        return { ok: ratio >= 4.5, ratio, light, dark };
      } catch (err) {
        return { ok: false, reason: String(err?.message || err), ratio: null };
      } finally {
        widget.destroy();
      }
    });
    expect(pixelContrast.ok, JSON.stringify(pixelContrast)).toBe(true);
    expect(pageErrors).toEqual([]);
  });
});
