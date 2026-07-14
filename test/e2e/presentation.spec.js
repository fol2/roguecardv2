// Round 5 Task 28 — combat presentation ceremonies (floaters, banners, piles).
import { test, expect } from '@playwright/test';
import { boot, startFight, collectErrors, expectNoErrors, settle } from './helpers.js';
import { contrastRatio, COLOUR } from '../../src/ui/tokens.js';

async function attachCpuThrottle(page, rate) {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate });
  return cdp;
}

/** Drive a drained ceremony without a full end-turn by calling the drain owner. */
async function drainQueue(page) {
  return page.evaluate(async () => {
    const drain = window.__probe?.owners?.drain;
    if (typeof drain === 'function') {
      await drain();
      return 'owners';
    }
    // Fallback: end-turn path (energy 0) when owners seam is unavailable.
    window.__probe.setEnergy(0);
    await window.__probe.endTurn();
    return 'endTurn';
  });
}

test.describe('combat presentation ceremonies', () => {
  test('CPU 4× discardHand / reshuffle publish parent+child card-flight spans', async ({ page }) => {
    test.setTimeout(120_000);
    const errors = collectErrors(page);
    const cdp = await attachCpuThrottle(page, 4);
    await boot(page, { query: 'trace=1&mesh=0' });
    await startFight(page, ['sporeling']);

    const discardResult = await page.evaluate(async () => {
      const { S } = window.spirebound;
      const pres = window.spirebound.combatGl?.presentation;
      if (!pres?.flyCardBacks) {
        return { ok: false, reason: 'missing-presentation' };
      }
      window.__probe.resetBehaviourTrace();
      const uids = window.__probe.forceHand(['strike', 'defend', 'strike']);
      // Snapshot seats then hide — same contract drain uses.
      const origins = uids.map((uid, i) => {
        const seat = window.spirebound.combatGl.readUI()?.hand?.seats?.[i]
          || { x: 200 + i * 40, y: 600, w: 96, h: 136 };
        return {
          x: seat.x ?? seat.cx ?? 200 + i * 40,
          y: seat.y ?? seat.cy ?? 600,
          w: seat.w || 96,
          h: seat.h || 136,
          uid,
          inst: S.cb.hand.find((c) => String(c.uid) === String(uid)) || { id: 'strike', uid },
        };
      });
      // Engine-state discard so pile counts settle.
      for (const uid of uids) {
        const idx = S.cb.hand.findIndex((c) => String(c.uid) === String(uid));
        if (idx >= 0) S.cb.discard.push(S.cb.hand.splice(idx, 1)[0]);
      }
      window.__probe.forceHand([]); // clear residual seats
      const dest = window.spirebound.combatGl.readUI()?.piles?.discard?.center
        || { x: 200, y: 700 };
      await pres.flyCardBacks(origins, dest, {
        ceremony: 'discardHand',
        face: 'card',
        uids,
      });
      await window.__probe.settle();
      const records = window.__probe.behaviourTrace({ format: 'records' }).records;
      const flights = records.filter((r) => r.eventName === 'presentation.card-flight');
      const parentStart = flights.find((r) => r.phase === 'start'
        && r.attributes?.ceremony === 'discardHand'
        && r.attributes?.role === 'parent');
      const parentEnd = flights.find((r) => r.phase === 'end'
        && r.attributes?.ceremony === 'discardHand'
        && r.attributes?.role === 'parent');
      const children = flights.filter((r) => r.phase === 'start'
        && r.attributes?.ceremony === 'discardHand'
        && r.attributes?.role === 'child');
      return {
        ok: true,
        durationMs: parentStart && parentEnd ? parentEnd.atMs - parentStart.atMs : null,
        childUids: children.map((r) => String(r.attributes?.uid)),
        expectedUids: uids.map(String),
        causeOk: children.every((c) => c.causeSeq === parentStart?.seq),
        parentSettled: parentEnd?.outcome === 'settled',
        floaties: document.querySelectorAll('#floaties > *').length,
      };
    });

    expect(discardResult.ok).toBe(true);
    expect(discardResult.floaties).toBe(0);
    expect(discardResult.childUids.sort()).toEqual([...discardResult.expectedUids].sort());
    expect(discardResult.causeOk).toBe(true);
    expect(discardResult.parentSettled).toBe(true);
    expect(discardResult.durationMs).toBeGreaterThanOrEqual(320);
    expect(discardResult.durationMs).toBeLessThanOrEqual(480);

    const reshuffleResult = await page.evaluate(async () => {
      const pres = window.spirebound.combatGl?.presentation;
      window.__probe.resetBehaviourTrace();
      const n = 5;
      const from = window.spirebound.combatGl.readUI()?.piles?.discard?.center || { x: 180, y: 700 };
      const to = window.spirebound.combatGl.readUI()?.piles?.draw?.center || { x: 80, y: 700 };
      const origins = Array.from({ length: n }, (_, i) => ({
        x: from.x, y: from.y, w: 48, h: 66, uid: `rs-${i}`,
      }));
      await pres.flyCardBacks(origins, to, {
        ceremony: 'reshuffle',
        face: 'back',
        uids: origins.map((o) => o.uid),
      });
      await window.__probe.settle();
      const records = window.__probe.behaviourTrace({ format: 'records' }).records;
      const flights = records.filter((r) => r.eventName === 'presentation.card-flight');
      const parentStart = flights.find((r) => r.phase === 'start'
        && r.attributes?.ceremony === 'reshuffle'
        && r.attributes?.role === 'parent');
      const parentEnd = flights.find((r) => r.phase === 'end'
        && r.attributes?.ceremony === 'reshuffle'
        && r.attributes?.role === 'parent');
      const children = flights.filter((r) => r.phase === 'start'
        && r.attributes?.ceremony === 'reshuffle'
        && r.attributes?.role === 'child');
      return {
        durationMs: parentStart && parentEnd ? parentEnd.atMs - parentStart.atMs : null,
        childCount: children.length,
        expectedN: n,
        floaties: document.querySelectorAll('#floaties > *').length,
      };
    });

    expect(reshuffleResult.floaties).toBe(0);
    expect(reshuffleResult.childCount).toBe(reshuffleResult.expectedN);
    expect(reshuffleResult.durationMs).toBeGreaterThanOrEqual(450);
    expect(reshuffleResult.durationMs).toBeLessThanOrEqual(650);

    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
    expectNoErrors(errors, 'pile ceremony timings');
  });

  test('REDUCED discardHand lands on pile counts with no orphan flights', async ({ page }) => {
    const errors = collectErrors(page);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await boot(page, { query: 'trace=1&mesh=0' });
    await startFight(page, ['sporeling']);

    const result = await page.evaluate(async () => {
      const { S } = window.spirebound;
      const pres = window.spirebound.combatGl?.presentation;
      window.__probe.resetBehaviourTrace();
      const uids = window.__probe.forceHand(['strike', 'defend']);
      const discardBefore = S.cb.discard.length;
      for (const uid of uids) {
        const idx = S.cb.hand.findIndex((c) => String(c.uid) === String(uid));
        if (idx >= 0) S.cb.discard.push(S.cb.hand.splice(idx, 1)[0]);
      }
      const origins = uids.map((uid, i) => ({
        x: 220 + i * 30, y: 580, w: 96, h: 136, uid,
        inst: { id: 'strike', uid },
      }));
      const dest = { x: 200, y: 700 };
      await pres.flyCardBacks(origins, dest, {
        ceremony: 'discardHand', face: 'card', uids,
        policy: { motion: 'reduced' },
      });
      await window.__probe.settle();
      const records = window.__probe.behaviourTrace({ format: 'records' }).records;
      const flights = records.filter((r) => r.eventName === 'presentation.card-flight');
      const starts = flights.filter((r) => r.phase === 'start');
      const ends = flights.filter((r) => r.phase === 'end');
      const reduced = ends.filter((r) => r.attributes?.motion === 'reduced');
      const orphans = starts.filter((s) => !ends.some((e) => e.seq > s.seq)).length;
      return {
        discardDelta: S.cb.discard.length - discardBefore,
        expected: uids.length,
        reducedEnds: reduced.length,
        orphans,
        floaties: document.querySelectorAll('#floaties > *').length,
        presentationIdle: window.__probe.presentationIdle(),
        endStates: ends.map((e) => e.attributes?.endState || e.outcome),
      };
    });

    expect(result.discardDelta).toBe(result.expected);
    expect(result.floaties).toBe(0);
    expect(result.presentationIdle).toBe(true);
    expect(result.reducedEnds).toBeGreaterThan(0);
    expect(result.orphans).toBe(0);
    expectNoErrors(errors, 'REDUCED discardHand');
  });

  test('damage tiers + banners render via Pixi with ≥4.5:1 contrast', async ({ page }) => {
    const errors = collectErrors(page);
    await boot(page, { query: 'trace=1&mesh=0' });
    await startFight(page, ['sporeling']);

    expect(contrastRatio(COLOUR.text, COLOUR.ink)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(COLOUR.ember, COLOUR.ink)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(COLOUR.gold, COLOUR.ink)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(COLOUR.danger, COLOUR.ink)).toBeGreaterThanOrEqual(4.5);

    const samples = await page.evaluate(async () => {
      const gl = window.spirebound.combatGl;
      const pres = gl?.presentation;
      if (!pres?.floatText || !pres?.banner || !pres?.sampleContrast) {
        return { ok: false, reason: 'missing-presentation-api' };
      }
      const tiers = ['normal', 'heavy', 'kill', 'overkill'];
      const out = [];
      for (const tier of tiers) {
        await pres.floatText(400, 300, tier === 'normal' ? '6' : tier === 'heavy' ? '18' : tier === 'kill' ? '12' : '24', tier, { holdForSample: true });
        const sample = await pres.sampleContrast({ kind: 'floater', tier });
        out.push({
          kind: 'floater',
          tier,
          ratio: sample?.ratio ?? 0,
          measured: !!sample?.measured,
          source: sample?.source || null,
        });
        await pres.clearHeld?.();
      }
      for (const kind of ['turn', 'boss', 'guard-shattered']) {
        const text = kind === 'turn' ? 'YOUR TURN' : kind === 'boss' ? 'BOSS' : 'SHATTER';
        await pres.banner(text, { kind, holdForSample: true });
        const sample = await pres.sampleContrast({ kind: 'banner', bannerKind: kind });
        out.push({
          kind: 'banner',
          tier: kind,
          ratio: sample?.ratio ?? 0,
          measured: !!sample?.measured,
          source: sample?.source || null,
        });
        await pres.clearHeld?.();
      }
      return {
        ok: true,
        samples: out,
        floaties: document.querySelectorAll('#floaties > *').length,
        turnBanners: document.querySelectorAll('.turn-banner').length,
      };
    });

    expect(samples.ok).toBe(true);
    expect(samples.floaties).toBe(0);
    expect(samples.turnBanners).toBe(0);
    for (const s of samples.samples) {
      expect(s.measured, `${s.kind}/${s.tier} measured`).toBe(true);
      expect(s.source, `${s.kind}/${s.tier} source`).toBe('pixels');
      expect(s.ratio, `${s.kind}/${s.tier}`).toBeGreaterThanOrEqual(4.5);
    }
    expectNoErrors(errors, 'damage/banner contrast');
  });

  test('batched turn / boss / guard-shattered banners settle without DOM floaties', async ({ page }) => {
    const errors = collectErrors(page);
    await boot(page, { query: 'trace=1&mesh=0' });
    await startFight(page, ['sporeling']);

    const result = await page.evaluate(async () => {
      const pres = window.spirebound.combatGl?.presentation;
      if (!pres?.banner) return { ok: false };
      window.__probe.resetBehaviourTrace();
      await pres.banner('YOUR TURN', { kind: 'turn' });
      await pres.banner('TEST BOSS', { kind: 'boss' });
      await pres.banner('SHATTER', { kind: 'guard-shattered' });
      await window.__probe.settle();
      const records = window.__probe.behaviourTrace({ format: 'records' }).records;
      const banners = records.filter((r) => r.eventName === 'presentation.banner');
      return {
        ok: true,
        bannerStarts: banners.filter((r) => r.phase === 'start').length,
        bannerSettled: banners.filter((r) => r.phase === 'end' && r.outcome === 'settled').length,
        floaties: document.querySelectorAll('#floaties > *').length,
        domBanners: document.querySelectorAll('.turn-banner').length,
        kinds: banners.filter((r) => r.phase === 'start').map((r) => r.attributes?.kind).filter(Boolean),
      };
    });

    expect(result.ok).toBe(true);
    expect(result.floaties).toBe(0);
    expect(result.domBanners).toBe(0);
    expect(result.bannerSettled).toBeGreaterThanOrEqual(3);
    expect(result.kinds).toEqual(expect.arrayContaining(['turn', 'boss', 'guard-shattered']));
    expectNoErrors(errors, 'batched banners');
  });

  test('lantern artCast is a Pixi ceremony with no DOM .art-cast', async ({ page }) => {
    const errors = collectErrors(page);
    await boot(page, { query: 'trace=1&mesh=0&motion=reduced' });
    await startFight(page, ['sporeling']);

    const result = await page.evaluate(async () => {
      const pres = window.spirebound.combatGl?.presentation;
      if (typeof pres?.artCast !== 'function') {
        return { ok: false, reason: 'missing-artCast' };
      }
      window.__probe.resetBehaviourTrace();
      const hero = window.spirebound.S.ce?.hero
        ? (() => {
          const r = window.__probe.stage();
          return { x: r.w * 0.28, y: r.h * 0.62 };
        })()
        : { x: 280, y: 420 };
      // Prefer a real arts asset URL when available; REDUCED settles without loading.
      const artId = window.spirebound.S.run?.art || 'flare';
      const url = null; // REDUCED path must settle even without a URL; full path tested below.
      const reduced = await pres.artCast({
        x: hero.x, y: hero.y, url, artId, size: 110,
      });
      await window.__probe.settle();

      // Full path with asset (policy may still be reduced from query — force via direct call
      // after temporarily running with a data URL so Assets.load always resolves).
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ff9a4d';
      ctx.fillRect(0, 0, 64, 64);
      const blobUrl = canvas.toDataURL('image/png');

      // Call through combat policy — if reduced, still no DOM; if full, sprite animates.
      window.__probe.resetBehaviourTrace();
      const full = await pres.artCast({
        x: hero.x, y: hero.y, url: blobUrl, artId: 'flare', size: 110,
      });
      await window.__probe.settle();
      const records = window.__probe.behaviourTrace({ format: 'records' }).records;
      const casts = records.filter((r) => r.eventName === 'presentation.art-cast');
      return {
        ok: true,
        hasApi: true,
        reducedOutcome: reduced?.outcome || reduced?.motion || null,
        fullMotion: full?.motion || null,
        castStarts: casts.filter((r) => r.phase === 'start').length,
        castEnds: casts.filter((r) => r.phase === 'end').length,
        endStates: casts.filter((r) => r.phase === 'end').map((r) => r.attributes?.endState),
        domArtCast: document.querySelectorAll('.art-cast, img.art-cast').length,
        floaties: document.querySelectorAll('#floaties > *').length,
      };
    });

    expect(result.ok, result.reason).toBe(true);
    expect(result.hasApi).toBe(true);
    expect(result.domArtCast).toBe(0);
    expect(result.floaties).toBe(0);
    expect(result.castStarts).toBeGreaterThanOrEqual(1);
    expect(result.castEnds).toBeGreaterThanOrEqual(1);
    expect(result.endStates.some((s) => s === 'art-cast-cleared')).toBe(true);
    expectNoErrors(errors, 'artCast ceremony');
  });
});
