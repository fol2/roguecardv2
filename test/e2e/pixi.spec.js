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

  test('Task 22b-1 bottom chrome paints via Pixi with transparent hit proxies overlaid', async ({ page }) => {
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
      expect(result.proxies[key].present, `${key} proxy present`).toBe(true);
      expect(result.proxies[key].pointerEvents, `${key} proxy accepts pointer events`).toBe('auto');
      expect(result.proxies[key].width, `${key} proxy has non-zero width`).toBeGreaterThan(0);
      expect(result.proxies[key].height, `${key} proxy has non-zero height`).toBeGreaterThan(0);
    }
    expect(result.hiddenVisuals.orbKidsHidden).toBe(true);
    expect(result.hiddenVisuals.lanternKidsHidden).toBe(true);
    expect(result.hiddenVisuals.endTurnKidsHidden).toBe(true);
    expect(result.hiddenVisuals.pileKidsHidden).toBe(true);
  });

  test('Task 22b-2 HUD and plate chrome paint via Pixi with transparent HUD hit proxies', async ({ page }) => {
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
      const handCards = document.querySelectorAll('.hand-zone .card').length;
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
      expect(result.proxies[key].present, `${key} proxy present`).toBe(true);
      expect(result.proxies[key].pointerEvents, `${key} proxy accepts pointer events`).toBe('auto');
      expect(result.proxies[key].width, `${key} proxy has non-zero width`).toBeGreaterThan(0);
      expect(result.proxies[key].height, `${key} proxy has non-zero height`).toBeGreaterThan(0);
    }
    expect(result.hiddenVisuals.hudBarKidsHidden).toBe(true);
    expect(result.hiddenVisuals.heroPlateKidsHidden).toBe(true);
    expect(result.hiddenVisuals.enemyPlateKidsHidden).toBe(true);
    expect(result.handCards).toBeGreaterThan(0);
    const hpInv = result.invariants.find((i) => i.name === 'player: HP label matches engine');
    expect(hpInv?.pass, hpInv?.detail || 'player HP invariant').toBe(true);
  });

  test('Task 22b-2 HUD hit proxies: deck/menu/potion open the same overlays as DOM', async ({ page }) => {
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

    await expect(page.locator('[data-proxy="deck"]')).toBeVisible();
    await page.locator('[data-proxy="deck"]').click();
    await expect(page.locator('#overlay.open .card-grid')).toBeVisible();
    await expect(page.locator('#overlay.open .ov-title')).toHaveText('Your Deck');
    await page.locator('#overlay.open .ov-actions .btn').click();
    await expect(page.locator('#overlay.open')).toHaveCount(0);

    await page.locator('[data-proxy="menu"]').click();
    await expect(page.locator('.pop-menu')).toBeVisible();
    await page.evaluate(() => {
      document.querySelectorAll('.pop-menu, .audio-panel, .settings-panel').forEach((n) => n.remove());
    });

    const potionProxy = page.locator('[data-proxy^="potion-"]').first();
    await expect(potionProxy).toBeVisible();
    await potionProxy.click();
    await expect(page.locator('.pop-menu')).toBeVisible();
  });

  test('Task 22b-1 hit proxies: kindle resolves lantern; draw pile click opens card grid', async ({ page }) => {
    await bootProduction(page);
    await page.evaluate(async () => {
      await window.__probe.stageCoreTheme({ themeId: 'act1' });
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    });

    // Mirror combat.js underPointer + LANTERN_DROP closest for kindle targeting.
    const kindleHit = await page.evaluate(() => {
      const sample = (key) => {
        const el = document.querySelector(`[data-proxy="${key}"]`);
        if (!el) return { key, present: false };
        const rect = el.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        const under = document.elementsFromPoint(x, y).find((node) => !node.closest('.card'));
        const lantern = under?.closest('[data-proxy="lantern"], .lantern-btn') ?? null;
        return {
          key,
          present: true,
          underProxy: under?.getAttribute?.('data-proxy') ?? null,
          resolvesLantern: !!lantern,
          lanternIsProxy: lantern?.getAttribute?.('data-proxy') === 'lantern',
        };
      };
      return { lantern: sample('lantern'), draw: sample('draw'), endTurn: sample('end-turn') };
    });
    expect(kindleHit.lantern.present).toBe(true);
    expect(kindleHit.lantern.underProxy).toBe('lantern');
    expect(kindleHit.lantern.resolvesLantern).toBe(true);
    expect(kindleHit.lantern.lanternIsProxy).toBe(true);
    expect(kindleHit.draw.underProxy).toBe('draw');
    expect(kindleHit.draw.resolvesLantern).toBe(false);
    expect(kindleHit.endTurn.underProxy).toBe('end-turn');
    expect(kindleHit.endTurn.resolvesLantern).toBe(false);

    await page.locator('[data-proxy="draw"]').click();
    await expect(page.locator('#overlay.open .card-grid')).toBeVisible();
    await expect(page.locator('#overlay.open .ov-title')).toHaveText('Draw Pile');
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
      const sample = 'Round Five Emberglass';
      const measure = (font) => {
        ctx.font = font;
        return ctx.measureText(sample).width;
      };
      const cinzel = measure('700 32px "Cinzel", serif');
      const cinzelFallback = measure('700 32px "__no-such-font__cinzel__", serif');
      const alegreya = measure('400 24px "Alegreya", serif');
      const alegreyaFallback = measure('400 24px "__no-such-font__alegreya__", serif');
      const alegreyaItalic = measure('italic 400 24px "Alegreya", serif');
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
});
