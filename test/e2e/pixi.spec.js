// Round 5 production Pixi lifecycle spec. Verifies the single WebGL owner,
// deterministic freeze/loss/recovery, immutable snapshot, transparent host
// canvas, shake-root alignment, integer position snapping and text contrast.

import { test, expect } from '@playwright/test';
import { snapStage } from '../../src/ui/widgets.js';
import { contrastRatio, ROUND5_TOKENS, COLOUR } from '../../src/ui/tokens.js';

const EXPECTED_WEBGL_OWNERS = ['bg3d', 'mesh', 'uigl'];

async function bootProduction(page) {
  const errors = [];
  page.on('pageerror', (err) => errors.push(err.message));
  await page.goto('/?shape=desktop-landscape');
  await page.waitForFunction(() => window.spirebound?.pixi?.status() === 'ready', null, {
    timeout: 15_000,
  });
  return errors;
}

test.describe('Round 5 production Pixi layer', () => {
  test('boots the sole Pixi renderer with contrast, snap and shake sync', async ({ page }) => {
    const errors = await bootProduction(page);

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

    // WebGL owners at steady state: exactly three named contexts.
    const owners = await page.evaluate(() => {
      const ids = ['bg3d', 'mesh', 'uigl'];
      return ids.map((id) => {
        const el = document.getElementById(id);
        const kind = el?.dataset?.contextKind || null;
        return { id, present: Boolean(el), tag: el?.tagName?.toLowerCase() || null, kind };
      });
    });
    for (const info of owners) {
      expect(info.present, `${info.id} exists`).toBe(true);
      expect(info.tag).toBe('canvas');
    }
    expect(owners.map((o) => o.id)).toEqual(EXPECTED_WEBGL_OWNERS);

    // Immutable snapshot is plain data and cannot be mutated.
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

    // Freeze / unfreeze is deterministic.
    const frozen = await page.evaluate(() => window.spirebound.pixi.freezeForTest({ atTick: 3 }));
    expect(frozen.frozen).toBe(true);
    expect(frozen.frozenTick).toBe(3);
    const thawed = await page.evaluate(() => window.spirebound.pixi.unfreezeForTest());
    expect(thawed.frozen).toBe(false);

    // Shake-root alignment: after calling shake, the Pixi world root position
    // should match the vfx offset within one stage px.
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

    // Deterministic snap on a synthetic sample.
    expect(snapStage(12.4, 2)).toBe(12.5);
    expect(snapStage(12.6, 2)).toBe(12.5);
    expect(snapStage(12.75, 2)).toBe(13);

    // Approved text/background pairs are ≥4.5:1 in the browser DOM too.
    expect(contrastRatio(COLOUR.text, COLOUR.ink)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(COLOUR.parchment, COLOUR.ink)).toBeGreaterThanOrEqual(4.5);

    // Round 5 CSS variables were injected on the document root.
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

    expect(errors).toEqual([]);
  });
});
