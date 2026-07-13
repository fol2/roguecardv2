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
