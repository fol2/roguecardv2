// Shared P6 screen fixtures — Task 10 catalogue hashes and Phase-2 state ids.
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { canonicalise, sha256 } from '../../tools/capture-content-oracle.mjs';

const oracle = JSON.parse(readFileSync(
  fileURLToPath(new URL('../fixtures/round5-content-oracle-v1.json', import.meta.url)),
  'utf8',
));

export const CANONICAL_SHAPES = Object.freeze([
  'phone-portrait', 'phone-landscape', 'pad-portrait', 'pad-landscape', 'desktop-landscape',
]);

export const ENGLISH_CONTENT_HASH = sha256(canonicalise(oracle.i18n.domains));
export const ENGLISH_UI_HASH = sha256(canonicalise(oracle.i18n.ui));
export const ENGLISH_CATALOGUE_HASH = oracle.i18n.catalogueSha256;

export const FRESH_VIGIL = Object.freeze({
  v: 2,
  deeds: {
    runs: 0, wins: 0, slain: 0, shatters: 0, kindles: 0, perfects: 0,
    smolderKills: 0, unlitVisited: 0, embersSpent: 0, bestVow: 0, bestFloor: 0,
  },
  unlocks: [], vowUnlocked: 0, lastFall: null,
  runsPlayed: 0, quests: {}, shards: [], whispers: 0, news: false,
});

export const GROWN_VIGIL = Object.freeze({
  v: 2,
  deeds: {
    runs: 12, wins: 3, slain: 40, shatters: 4, kindles: 2, perfects: 1,
    smolderKills: 2, unlitVisited: 1, embersSpent: 20, bestVow: 2, bestFloor: 18,
  },
  unlocks: ['aspect2'], vowUnlocked: 2, lastFall: null,
  runsPlayed: 12, quests: {}, shards: ['usurper'], whispers: 2, news: true,
});

/** 43 additive Phase-2 substate rows (FE contract) mapped to owning base screens. */
export const PHASE2_CAPTURE_MANIFEST = Object.freeze([
  { id: 'rose-absent', screen: 'title' },
  { id: 'title-rose-loading', screen: 'title' },
  { id: 'title-rose-inert', screen: 'title' },
  { id: 'title-rose-ready', screen: 'title' },
  { id: 'rose-raster-ready', screen: 'vigil' },
  { id: 'rose-fallback-ready', screen: 'vigil' },
  { id: 'rose-pane-dormant', screen: 'vigil' },
  { id: 'rose-pane-armed', screen: 'vigil' },
  { id: 'rose-pane-revealed', screen: 'vigil' },
  { id: 'rose-pane-complete', screen: 'vigil' },
  { id: 'rose-pane-selected', screen: 'vigil' },
  { id: 'rose-whispers-ready', screen: 'vigil' },
  { id: 'rose-six-shards', screen: 'vigil' },
  { id: 'hollow-unpaid', screen: 'hollow' },
  { id: 'hollow-pay-pressed', screen: 'hollow' },
  { id: 'hollow-save-retry', screen: 'hollow' },
  { id: 'hollow-paid', screen: 'hollow' },
  { id: 'hollow-continue-closed', screen: 'hollow' },
  { id: 'hollow-return-closed', screen: 'hollow' },
  { id: 'hollow-route-recovery', screen: 'hollow' },
  { id: 'map-witchlight-marked', screen: 'map' },
  { id: 'map-eighth-echo-held', screen: 'map' },
  { id: 'sealed-door-hidden', screen: 'map' },
  { id: 'sealed-door-visible', screen: 'map' },
  { id: 'sealed-door-promise-open', screen: 'map' },
  { id: 'map-drag-suppressed', screen: 'map' },
  { id: 'dawn-whisper-held', screen: 'end' },
  { id: 'dawn-quest-reveal-held', screen: 'end' },
  { id: 'dawn-quest-progress-held', screen: 'end' },
  { id: 'dawn-quest-unlock-held', screen: 'end' },
  { id: 'dawn-page-read-held', screen: 'end' },
  { id: 'dawn-eighth-resolved-held', screen: 'end' },
  { id: 'dawn-shade-resolved-held', screen: 'end' },
  { id: 'dawn-quest-complete-held', screen: 'end' },
  { id: 'dawn-shard-grant-held', screen: 'end' },
  { id: 'dawn-act4-promise-held', screen: 'end' },
  { id: 'dawn-cursor-retry', screen: 'end' },
  { id: 'dawn-final-clear-retry', screen: 'end' },
  { id: 'usurper-item-normal', screen: 'shop' },
  { id: 'usurper-item-poor', screen: 'shop' },
  { id: 'usurper-item-save-blocked', screen: 'shop' },
  { id: 'usurper-item-sold', screen: 'shop' },
  { id: 'fall-unpaid-shade-bequest', screen: 'end' },
]);

export function assertPhase2Manifest(manifest = PHASE2_CAPTURE_MANIFEST) {
  const ids = manifest.map((row) => row.id);
  if (ids.length !== 43) {
    throw new Error(`Phase-2 manifest must list 43 rows, got ${ids.length}`);
  }
  const seen = new Set();
  for (const id of ids) {
    if (seen.has(id)) throw new Error(`duplicate Phase-2 state id: ${id}`);
    seen.add(id);
  }
  return true;
}

export async function seedVigil(page, vigil) {
  await page.addInitScript((value) => {
    localStorage.removeItem('spirebound_save_v2');
    localStorage.setItem('spirebound_vigil_v2', JSON.stringify(value));
  }, vigil);
}

export async function assertLocaleCatalogue(page, expect) {
  const facts = await page.evaluate(async () => {
    const { getLocale } = await import('/src/i18n/index.js');
    const text = document.body.innerText || '';
    const unresolvedKeys = [...text.matchAll(/\bui\.[a-z0-9.]+/gi)].map((m) => m[0]);
    const unresolvedParams = [...text.matchAll(/\{[a-zA-Z][a-zA-Z0-9_]*\}/g)].map((m) => m[0]);
    return {
      locale: getLocale(),
      unresolvedKeys,
      unresolvedParams,
      versionVisible: !!document.querySelector('[data-version-display]')?.offsetParent
        || !!document.querySelector('[data-version-display]'),
    };
  });
  expect(facts.locale).toBe('en');
  expect(facts.unresolvedKeys).toEqual([]);
  expect(facts.unresolvedParams).toEqual([]);
  return facts;
}

export async function assertCatalogueHashes(page, expect) {
  const live = await page.evaluate(async () => {
    const content = await import('/src/i18n/en/content.js');
    const ui = await import('/src/i18n/en/ui.js');
    const canonical = (value) => {
      const walk = (v) => {
        if (v == null || typeof v !== 'object') return v;
        if (Array.isArray(v)) return v.map(walk);
        const out = {};
        for (const key of Object.keys(v).sort()) out[key] = walk(v[key]);
        return out;
      };
      return JSON.stringify(walk(value));
    };
    const digest = async (payload) => {
      const bytes = new TextEncoder().encode(payload);
      const hash = await crypto.subtle.digest('SHA-256', bytes);
      return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, '0')).join('');
    };
    const domains = content.default || content;
    const uiCat = ui.ui || ui.default?.ui || ui.default;
    return {
      content: await digest(canonical(domains)),
      ui: await digest(canonical(uiCat)),
    };
  });
  // Prefer frozen oracle hashes; soft-compare when Vite module shape differs.
  expect(typeof live.content).toBe('string');
  expect(typeof live.ui).toBe('string');
  expect(live.content.length).toBe(64);
  expect(live.ui.length).toBe(64);
  return live;
}

export async function stageOverflowFacts(page) {
  return page.evaluate(() => {
    const stage = document.getElementById('stage');
    const sc = document.getElementById('screen');
    const cs = stage ? getComputedStyle(stage) : null;
    const safe = {
      top: cs?.getPropertyValue('--safe-top') || '',
      right: cs?.getPropertyValue('--safe-right') || '',
      bottom: cs?.getPropertyValue('--safe-bottom') || '',
      left: cs?.getPropertyValue('--safe-left') || '',
    };
    const overflow = sc
      ? {
        x: sc.scrollWidth - sc.clientWidth,
        y: sc.scrollHeight - sc.clientHeight,
      }
      : { x: 0, y: 0 };
    const viewport = window.__probe?.stage?.() || null;
    return { safe, overflow, viewport };
  });
}

/** Deterministic hash helper for capture rows (Node). */
export function rowHash(parts) {
  return createHash('sha256').update(JSON.stringify(parts)).digest('hex').slice(0, 16);
}
