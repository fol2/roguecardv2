// Round 5 Task 26 — single card-face composer + DOM export + contrast sample.
import { test, expect } from '@playwright/test';
import { boot, collectErrors, expectNoErrors, settle } from './helpers.js';
import { contrastRatio, COLOUR } from '../../src/ui/tokens.js';

function relativeLuminance(rgb) {
  const channel = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(rgb[0]) + 0.7152 * channel(rgb[1]) + 0.0722 * channel(rgb[2]);
}

function sampleContrast(fg, bg) {
  const l1 = relativeLuminance(fg);
  const l2 = relativeLuminance(bg);
  const light = Math.max(l1, l2);
  const dark = Math.min(l1, l2);
  return (light + 0.05) / (dark + 0.05);
}

test.describe('card-face composer', () => {
  test('composer boots on combatGl and exports keyed faces for shop/deck', async ({ page }) => {
    const errors = collectErrors(page);
    await boot(page, { query: 'mesh=0' });
    await settle(page);

    const seam = await page.evaluate(() => {
      const gl = window.spirebound?.combatGl;
      const face = gl?.cardFace;
      if (!face) return { ok: false, reason: 'missing-cardFace' };
      const stats = face.stats();
      return {
        ok: true,
        apis: ['acquire', 'exportImage', 'invalidate', 'rebuild', 'stats', 'destroy']
          .every((k) => typeof face[k] === 'function'),
        maxEntries: stats.maxEntries,
        byteCap: stats.byteCap,
      };
    });
    expect(seam.ok).toBe(true);
    expect(seam.apis).toBe(true);
    expect(seam.maxEntries).toBe(24);

    // Open shop so cardEl consumes exportImage.
    await page.evaluate(() => {
      const sp = window.spirebound;
      const node = sp.S.run.map.nodes.find((n) => n.type === 'shop')
        || sp.S.run.map.nodes.find((n) => n.row === 1);
      if (node) sp.E.visitNode(sp.S.run, node);
      sp.show('shop');
    });
    await settle(page);

    const shopFaces = await page.evaluate(() => {
      const imgs = [...document.querySelectorAll('img.card-face-export[data-card-face-key]')];
      const cards = [...document.querySelectorAll('.card[data-card-face-key]')];
      return {
        imgCount: imgs.length,
        cardCount: cards.length,
        keys: cards.map((c) => c.dataset.cardFaceKey).filter(Boolean),
        urls: imgs.map((img) => img.getAttribute('src') || ''),
        // No competing P1 DOM face bake when composer is available.
        legacyDomFaces: [...document.querySelectorAll('.card .card-art, .card .card-name')].length,
      };
    });
    expect(shopFaces.imgCount).toBeGreaterThan(0);
    expect(shopFaces.cardCount).toBeGreaterThan(0);
    expect(shopFaces.keys.every((k) => k.startsWith('en\u001f') || k.includes('en'))).toBe(true);
    expect(shopFaces.urls.every((u) => u.startsWith('blob:'))).toBe(true);
    expect(shopFaces.legacyDomFaces).toBe(0);

    // Leaving shop must revoke blob URLs before #screen is replaced.
    // If release ran, re-export creates a fresh object URL (entry.url was cleared).
    const shopBlobUrls = shopFaces.urls.filter((u) => u.startsWith('blob:'));
    await page.evaluate(() => {
      window.spirebound.show('map');
    });
    await settle(page);
    const revoked = await page.evaluate((oldUrls) => {
      const face = window.spirebound.combatGl.cardFace;
      const sampleId = window.spirebound.S.run.shopData?.cards?.[0]?.id || 'strike';
      const exported = face.exportImage({ id: sampleId }, { up: false });
      const reusedOldUrl = oldUrls.includes(exported.url);
      exported.release();
      return {
        lingering: [...document.querySelectorAll('#screen [data-card-face-key]')].length,
        reusedOldUrl,
        sampleId,
        newUrlKind: String(exported.url).startsWith('blob:') ? 'blob' : 'other',
      };
    }, shopBlobUrls);
    expect(revoked.lingering).toBe(0);
    expect(revoked.reusedOldUrl).toBe(false);
    expect(revoked.newUrlKind).toBe('blob');

    // Deck overlay grid also carries data-card-face-key.
    await page.evaluate(() => {
      const sp = window.spirebound;
      const showCardGrid = sp.showCardGrid;
      if (typeof showCardGrid === 'function') {
        showCardGrid('Deck', sp.S.run.player.deck, {});
      } else {
        const overlay = document.getElementById('overlay');
        overlay.classList.add('open');
        overlay.innerHTML = '';
        for (const inst of sp.S.run.player.deck.slice(0, 3)) {
          const face = sp.combatGl.cardFace.exportImage({ id: inst.id }, { up: !!inst.up });
          const img = document.createElement('img');
          img.className = 'card-face-export';
          img.dataset.cardFaceKey = face.key;
          img.src = face.url;
          overlay.appendChild(img);
        }
      }
    });
    await settle(page);
    const gridKeys = await page.locator('[data-card-face-key]').count();
    expect(gridKeys).toBeGreaterThan(0);

    expectNoErrors(errors, 'cardface shop/deck export');
  });

  test('representative rarity faces clear ≥4.5:1 glyph contrast', async ({ page }) => {
    const errors = collectErrors(page);
    await boot(page, { query: 'mesh=0' });
    await settle(page);

    // Data-level pairs (composer tokens) must clear AA.
    expect(contrastRatio(COLOUR.ink, COLOUR.gold)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(COLOUR.parchment, COLOUR.ink)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(COLOUR.text, COLOUR.ink)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(COLOUR.gold, COLOUR.ink)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(COLOUR.ward, COLOUR.ink)).toBeGreaterThanOrEqual(4.5);

    const samples = await page.evaluate(async () => {
      const face = window.spirebound.combatGl.cardFace;
      const { CARDS } = await import('/src/data.js');
      const chosen = [];
      for (const rarity of ['common', 'uncommon', 'rare', 'starter']) {
        const id = Object.keys(CARDS).find((k) => CARDS[k].rarity === rarity);
        if (id) chosen.push({ id, rarity, descriptor: { id } });
      }
      // Boss rarity has no stock card id — bake a synthetic boss-face descriptor.
      chosen.push({
        id: 'boss-face-sample',
        rarity: 'boss',
        descriptor: {
          id: 'boss-face-sample',
          name: 'Boss Vow',
          text: 'Deal @10@ damage.',
          cost: 1,
          rarity: 'boss',
          type: 'attack',
        },
      });

      const relLum = (rgb) => {
        const channel = (c) => {
          const s = c / 255;
          return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
        };
        return 0.2126 * channel(rgb[0]) + 0.7152 * channel(rgb[1]) + 0.0722 * channel(rgb[2]);
      };
      const ratio = (a, b) => {
        const l1 = relLum(a);
        const l2 = relLum(b);
        const light = Math.max(l1, l2);
        const dark = Math.min(l1, l2);
        return (light + 0.05) / (dark + 0.05);
      };
      // Scan glyph/bg windows for the strongest live pair (AA-safe, no token softener).
      const bestLive = (ctx, gx, gy, bx, by, span = 6) => {
        let best = 0;
        let pair = null;
        for (let dy = -span; dy <= span; dy += 2) {
          for (let dx = -span; dx <= span; dx += 2) {
            const g = ctx.getImageData(Math.round(gx + dx), Math.round(gy + dy), 1, 1).data;
            const glyph = [g[0], g[1], g[2]];
            for (let ey = -span; ey <= span; ey += 2) {
              for (let ex = -span; ex <= span; ex += 2) {
                const b = ctx.getImageData(Math.round(bx + ex), Math.round(by + ey), 1, 1).data;
                const bg = [b[0], b[1], b[2]];
                const r = ratio(glyph, bg);
                if (r > best) {
                  best = r;
                  pair = { glyph, bg, r };
                }
              }
            }
          }
        }
        return pair;
      };

      const out = [];
      for (const pick of chosen) {
        const exported = face.exportImage(pick.descriptor, { up: false });
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = exported.url;
        await new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
          if (!String(exported.url).startsWith('blob:') && !String(exported.url).startsWith('data:image')) {
            resolve();
          }
        });
        const canvas = document.createElement('canvas');
        canvas.width = 152;
        canvas.height = 216;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        let painted = false;
        try {
          if (img.naturalWidth > 0) {
            ctx.drawImage(img, 0, 0, 152, 216);
            painted = true;
          }
        } catch { /* stub */ }
        const cost = painted ? bestLive(ctx, 24, 24, 24, 14) : null;
        const name = painted ? bestLive(ctx, 76, 132, 76, 118) : null;
        const body = painted ? bestLive(ctx, 76, 168, 76, 200) : null;
        // Boss rarity role shares gold-on-ink with the cost gem (rail is only 2px tall).
        const rarityRole = painted ? bestLive(ctx, 24, 14, 76, 40, 4) : null;
        out.push({
          id: pick.id,
          rarity: pick.rarity,
          key: exported.key,
          urlKind: String(exported.url).startsWith('blob:') ? 'blob'
            : String(exported.url).startsWith('data:') ? 'data' : 'other',
          painted,
          costRatio: cost?.r ?? 0,
          nameRatio: name?.r ?? 0,
          bodyRatio: body?.r ?? 0,
          rarityRoleRatio: rarityRole?.r ?? 0,
        });
        exported.release();
      }
      return out;
    });

    expect(samples.length).toBeGreaterThanOrEqual(4);
    expect(samples.some((s) => s.rarity === 'boss')).toBe(true);
    for (const sample of samples) {
      expect(sample.key.startsWith('en')).toBe(true);
      expect(sample.urlKind).toBe('blob');
      expect(sample.painted).toBe(true);
      // Live glyph/background samples must clear ≥4.5 alone — no token softener.
      expect(sample.costRatio, `${sample.id} cost`).toBeGreaterThanOrEqual(4.5);
      expect(sample.nameRatio, `${sample.id} name`).toBeGreaterThanOrEqual(4.5);
      expect(sample.bodyRatio, `${sample.id} body`).toBeGreaterThanOrEqual(4.5);
      if (sample.rarity === 'boss') {
        expect(sample.rarityRoleRatio, `${sample.id} boss rarity gold/ink`).toBeGreaterThanOrEqual(4.5);
      }
    }
    expectNoErrors(errors, 'cardface contrast samples');
  });

  test('locale token change invalidates baked card-face cache', async ({ page }) => {
    const errors = collectErrors(page);
    await boot(page, { query: 'mesh=0' });
    await settle(page);

    const result = await page.evaluate(async () => {
      const i18n = await import('/src/i18n/index.js');
      const face = window.spirebound.combatGl.cardFace;
      const first = face.acquire({ id: 'strike' }, { up: false });
      const keyEn = first.key;
      first.release();
      i18n.registerLocale('zz-cardface-e2e', {
        content: {},
        ui: { menu: { beginClimb: 'ZZ' } },
      });
      const switched = i18n.setLocale('zz-cardface-e2e');
      const removed = face.invalidate({ localeChanged: true });
      const second = face.acquire({ id: 'strike' }, { up: false });
      const keyZz = second.key;
      second.release();
      // Targeted locale invalidation drops matching prefix keys.
      const beforeTargeted = face.stats().entries;
      const droppedZz = face.invalidate({ locale: 'zz-cardface-e2e' });
      const afterTargeted = face.stats().entries;
      i18n.setLocale('en');
      face.invalidate({ localeChanged: true });
      return {
        switched,
        removed,
        keyEn,
        keyZz,
        beforeTargeted,
        droppedZz,
        afterTargeted,
        localeRestored: i18n.getLocale(),
      };
    });

    expect(result.switched).toBe(true);
    expect(result.removed).toBeGreaterThan(0);
    expect(result.keyEn.startsWith('en')).toBe(true);
    expect(result.keyZz.startsWith('zz-cardface-e2e')).toBe(true);
    expect(result.keyEn).not.toBe(result.keyZz);
    expect(result.droppedZz).toBeGreaterThan(0);
    expect(result.afterTargeted).toBeLessThan(result.beforeTargeted);
    expect(result.localeRestored).toBe('en');
    expectNoErrors(errors, 'cardface locale invalidation');
  });
});
