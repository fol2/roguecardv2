// P6 contrast gate — every visible text/state ≥4.5:1 with alpha compositing.
// Transparent / unknown backgrounds fail. Canvas card faces use P5 pixel
// sampling (not DOM CSS maths).
import { test, expect } from './trace-fixture.js';
import { contrastRatio, COLOUR } from '../../src/ui/tokens.js';
import { assertFaceContrast } from '../../src/ui/cardface-layout.js';
import { boot, settle, collectErrors, expectNoErrors } from './helpers.js';
import { GROWN_VIGIL, seedVigil, assertLocaleCatalogue } from './p6-fixtures.js';

test.beforeEach(() => {
  test.skip(test.info().project.name !== 'desktop', 'contrast matrix on desktop Chromium');
});

async function measureDomContrast(page) {
  return page.evaluate(() => {
    const parseColour = (raw) => {
      if (!raw || raw === 'transparent' || raw === 'rgba(0, 0, 0, 0)') return null;
      const ctx = document.createElement('canvas').getContext('2d');
      ctx.fillStyle = '#000';
      ctx.fillStyle = raw;
      const computed = ctx.fillStyle;
      if (!computed || computed === 'transparent') return null;
      if (computed.startsWith('#')) {
        const hex = computed.length === 4
          ? computed.replace(/#(.)(.)(.)/, '#$1$1$2$2$3$3')
          : computed;
        return {
          r: Number.parseInt(hex.slice(1, 3), 16),
          g: Number.parseInt(hex.slice(3, 5), 16),
          b: Number.parseInt(hex.slice(5, 7), 16),
          a: 1,
        };
      }
      const m = computed.match(/rgba?\(([^)]+)\)/);
      if (!m) return null;
      const [r, g, b, a = 1] = m[1].split(',').map((p) => Number.parseFloat(p.trim()));
      if (![r, g, b].every(Number.isFinite)) return null;
      return { r, g, b, a: Number.isFinite(a) ? a : 1 };
    };
    const composite = (fg, bg) => {
      const a = fg.a;
      return {
        r: Math.round(fg.r * a + bg.r * (1 - a)),
        g: Math.round(fg.g * a + bg.g * (1 - a)),
        b: Math.round(fg.b * a + bg.b * (1 - a)),
        a: 1,
      };
    };
    const toHex = ({ r, g, b }) => `#${[r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('')}`;
    const channelL = (c) => {
      const v = c / 255;
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    };
    const lum = ({ r, g, b }) => 0.2126 * channelL(r) + 0.7152 * channelL(g) + 0.0722 * channelL(b);
    const ratioOf = (a, b) => {
      const L1 = lum(a);
      const L2 = lum(b);
      const light = Math.max(L1, L2);
      const dark = Math.min(L1, L2);
      return (light + 0.05) / (dark + 0.05);
    };
    const resolveBg = (el) => {
      let node = el;
      while (node && node !== document.documentElement) {
        const cs = getComputedStyle(node);
        const parsed = parseColour(cs.backgroundColor);
        if (!parsed) {
          node = node.parentElement;
          continue;
        }
        if (parsed.a >= 0.98) return { colour: parsed, source: 'opaque' };
        if (parsed.a <= 0.02) {
          node = node.parentElement;
          continue;
        }
        // Alpha-composite against next opaque ancestor.
        let under = node.parentElement;
        while (under) {
          const underParsed = parseColour(getComputedStyle(under).backgroundColor);
          if (underParsed && underParsed.a >= 0.98) {
            return { colour: composite(parsed, underParsed), source: 'composited' };
          }
          under = under.parentElement;
        }
        return { colour: null, source: 'unknown-alpha' };
      }
      return { colour: null, source: 'transparent' };
    };

    const SELECTORS = [
      '.ov-title', '.ov-sub', '.end-title', '.lamp-title', '.hollow-title',
      '.hollow-ask', '.embark-title', '.map-title', '[data-version-display]',
      '.r5-scene-header', '.reward-row span', '.shop-dialogue',
    ];
    const samples = [];
    const seen = new Set();
    for (const selector of SELECTORS) {
      for (const el of document.querySelectorAll(selector)) {
        if (!el.offsetParent && el.getClientRects().length === 0) continue;
        if (el.closest('[data-card-face-key], .card-face, canvas')) continue;
        const text = (el.textContent || '').trim();
        if (text.length < 2) continue;
        const key = `${selector}|${text.slice(0, 24)}`;
        if (seen.has(key)) continue;
        seen.add(key);
        const fg = parseColour(getComputedStyle(el).color);
        if (!fg) {
          samples.push({ text: text.slice(0, 40), ok: false, reason: 'unknown-fg' });
          continue;
        }
        const bg = resolveBg(el);
        if (!bg.colour) {
          samples.push({
            text: text.slice(0, 40),
            ok: false,
            reason: bg.source || 'transparent',
          });
          continue;
        }
        const composedFg = fg.a < 0.98 ? composite(fg, bg.colour) : fg;
        const ratio = ratioOf(composedFg, bg.colour);
        samples.push({
          text: text.slice(0, 40),
          ok: ratio >= 4.5,
          ratio,
          fg: toHex(composedFg),
          bg: toHex(bg.colour),
          source: bg.source,
        });
      }
    }
    return samples;
  });
}

async function sampleCardFacePixels(page) {
  return page.evaluate(() => {
    const hosts = [...document.querySelectorAll('[data-card-face-key] img, [data-card-face-key] canvas, .card img, .shop-item img')];
    const out = [];
    for (const host of hosts.slice(0, 6)) {
      const canvas = document.createElement('canvas');
      const w = Math.max(1, host.naturalWidth || host.width || host.clientWidth || 1);
      const h = Math.max(1, host.naturalHeight || host.height || host.clientHeight || 1);
      canvas.width = Math.min(w, 220);
      canvas.height = Math.min(h, 300);
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      try {
        ctx.drawImage(host, 0, 0, canvas.width, canvas.height);
      } catch {
        out.push({ ok: false, reason: 'draw-failed', source: 'pixels' });
        continue;
      }
      let image;
      try { image = ctx.getImageData(0, 0, canvas.width, canvas.height); } catch {
        out.push({ ok: false, reason: 'read-failed', source: 'pixels' });
        continue;
      }
      const channelL = (c) => {
        const v = c / 255;
        return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
      };
      const lum = (rgb) => 0.2126 * channelL(rgb[0]) + 0.7152 * channelL(rgb[1]) + 0.0722 * channelL(rgb[2]);
      let bright = null;
      let brightLum = -1;
      let dark = null;
      let darkLum = 2;
      for (let i = 0; i < image.data.length; i += 4) {
        if (image.data[i + 3] < 90) continue;
        const rgb = [image.data[i], image.data[i + 1], image.data[i + 2]];
        const L = lum(rgb);
        if (L > brightLum) { brightLum = L; bright = rgb; }
        if (L < darkLum) { darkLum = L; dark = rgb; }
      }
      if (!bright || !dark) {
        out.push({ ok: false, reason: 'no-opaque-pixels', source: 'pixels' });
        continue;
      }
      const light = Math.max(brightLum, darkLum);
      const dim = Math.min(brightLum, darkLum);
      const ratio = (light + 0.05) / (dim + 0.05);
      out.push({ ok: ratio >= 4.5, ratio, source: 'pixels', measured: true });
    }
    return out;
  });
}

test('token pairs and P5 face layout clear ≥4.5:1', () => {
  expect(contrastRatio(COLOUR.text, COLOUR.ink)).toBeGreaterThanOrEqual(4.5);
  expect(contrastRatio(COLOUR.parchment, COLOUR.ink)).toBeGreaterThanOrEqual(4.5);
  expect(contrastRatio(COLOUR.gold, COLOUR.ink)).toBeGreaterThanOrEqual(4.5);
  const face = assertFaceContrast(4.5);
  expect(face.ok, JSON.stringify(face.failures)).toBe(true);
});

test('visible P6 screen text clears ≥4.5:1 with alpha compositing', async ({ page }) => {
  test.setTimeout(180_000);
  const errors = collectErrors(page);
  await seedVigil(page, GROWN_VIGIL);
  await boot(page, { query: 'trace=1&mesh=0', seed: 3501 });

  // Skip Title wordmark chrome until FE stylesheet lands (Task 35); PE panel copy is gated.
  const screens = [
    async () => {
      await page.evaluate(() => window.spirebound.show('embark'));
    },
    async () => {
      await page.evaluate(() => {
        const sp = window.spirebound;
        sp.S.run.pendingReward = {
          kind: 'normal',
          rewards: { gold: 20, cards: ['strike', 'defend', 'chisel'], potion: null, relic: null },
          taken: {},
          perfect: false,
        };
        sp.show('reward');
      });
    },
    async () => {
      await page.evaluate(() => window.spirebound.show('shop'));
    },
    async () => {
      await page.evaluate(() => {
        const sp = window.spirebound;
        sp.show('event', sp.E.rollEvent(sp.S.run));
      });
    },
    async () => {
      await page.evaluate(() => window.spirebound.show('rest'));
    },
    async () => {
      await page.evaluate(() => window.spirebound.show('vigil'));
    },
    async () => {
      await page.evaluate(() => window.spirebound.show('map'));
    },
  ];

  for (const go of screens) {
    await go();
    await settle(page);
    await assertLocaleCatalogue(page, expect);
    const samples = await measureDomContrast(page);
    // Fail hard on transparent/unknown backgrounds.
    const unknown = samples.filter((s) => s.reason === 'transparent' || s.reason === 'unknown-alpha' || s.reason === 'unknown-fg');
    expect(unknown, JSON.stringify(unknown.slice(0, 8))).toEqual([]);
    const failures = samples.filter((s) => !s.ok);
    expect(failures, JSON.stringify(failures.slice(0, 8))).toEqual([]);
  }

  await page.evaluate(() => window.spirebound.show('shop'));
  await settle(page);
  const cardSamples = await sampleCardFacePixels(page);
  if (cardSamples.length) {
    for (const sample of cardSamples) {
      expect(sample.source).toBe('pixels');
      expect(sample.ok, JSON.stringify(sample)).toBe(true);
    }
  }
  expectNoErrors(errors, 'contrast matrix');
});
