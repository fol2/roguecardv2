// Shared plumbing for the visual-QA kit. Every helper goes through
// window.__probe / window.spirebound (src/ui.js) — the tests never poke
// engine internals beyond the probe's documented shims.
import { expect } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
import { screenshotDiffOptions } from './visual-policy.js';

// One fixed seed for the whole kit: runs, maps, encounters, enemy AI and
// reward rolls are all derived from it, so every scenario is replayable.
export const SEED = 20260706;

// Attach BEFORE page.goto so boot errors are caught too. drain() deliberately
// swallows playback exceptions into console.error (a broken animation must
// not eat the game state) — which is exactly why the kit listens here:
// this channel is where the death-VFX regression hid.
export function collectErrors(page) {
  const errors = [];
  page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`console.error: ${msg.text()}`);
  });
  return errors;
}

// Load the game, wait for the probe, and start a fresh seeded run.
// `query` example: 'mesh=0' (disable the WebGL warp layer).
export async function boot(page, { query = '', seed = SEED, aspect = 0 } = {}) {
  await page.goto(`/${query ? `?${query}` : ''}`);
  await page.waitForFunction(() => window.spirebound && window.__probe);
  // fresh contexts start with empty storage; clear anyway so a mid-test
  // reload can never resume a half-finished run
  await page.evaluate(() => localStorage.clear());
  await page.evaluate(([s, a]) => {
    const sp = window.spirebound;
    sp.S.run = sp.E.newRun(s, { aspect: a });
  }, [seed, aspect]);
}

export async function startFight(page, enemyIds, kind = 'normal') {
  await page.evaluate(([ids, k]) => window.spirebound.startCombatUI(ids, k), [enemyIds, kind]);
  await settle(page);
}

// Resolves when the engine queue is drained and the UI is idle.
export function settle(page) {
  return page.evaluate(() => window.__probe.settle());
}

export async function attachBehaviourTrace(page, testInfo) {
  const artifact = await page.evaluate(() => ({
    ndjson: window.__probe.behaviourTrace({ format: 'ndjson' }).ndjson,
    text: window.__probe.behaviourTrace({ format: 'text' }).text,
  }));
  if (!artifact.ndjson?.trim() || !artifact.text?.trim()) {
    throw new Error('behaviour trace attachment body is empty');
  }
  const ndjsonPath = testInfo.outputPath('ui-behaviour-trace.ndjson');
  const textPath = testInfo.outputPath('ui-behaviour-trace.txt');
  await writeFile(ndjsonPath, artifact.ndjson);
  await writeFile(textPath, artifact.text);
  await testInfo.attach('ui-behaviour-trace.ndjson', {
    path: ndjsonPath, contentType: 'application/x-ndjson',
  });
  await testInfo.attach('ui-behaviour-trace.txt', {
    path: textPath, contentType: 'text/plain',
  });
  return artifact;
}

// Record short-lived UI copy in the page so a loaded CI driver cannot miss an
// otherwise-correct banner between Playwright polling turns.
// Pixi combat banners push into `__seenTransientText` from createCombatPresentation;
// the MutationObserver still covers any residual DOM `.turn-banner` (non-combat).
export async function recordTransientText(page, selector = '.turn-banner') {
  await page.evaluate((transientSelector) => {
    window.__transientTextObserver?.disconnect();
    window.__seenTransientText = [];
    const capture = (root) => {
      if (!(root instanceof Element)) return;
      const nodes = root.matches(transientSelector)
        ? [root, ...root.querySelectorAll(transientSelector)]
        : [...root.querySelectorAll(transientSelector)];
      for (const node of nodes) window.__seenTransientText.push(node.textContent || '');
    };
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) capture(node);
      }
    });
    capture(document.documentElement);
    observer.observe(document.documentElement, { childList: true, subtree: true });
    window.__transientTextObserver = observer;
  }, selector);
}

export function waitForTransientText(page, expected, timeout = 30_000) {
  return page.waitForFunction((text) =>
    window.__seenTransientText?.some((seen) => seen.includes(text)), expected, { timeout });
}

export function probeState(page) {
  return page.evaluate(() => window.__probe.state());
}

// Deterministic pixels: fonts loaded, every <img> decoded, entrance/intro
// animations finished (renderCombat drops .intro at 1300ms).
export async function stable(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map((img) => img.decode().catch(() => {})));
  });
  await page.waitForTimeout(1600);
}

export async function freeze(page, options = {}) {
  await page.waitForFunction(() => window.__probe?.freeze);
  return page.evaluate((opts) => window.__probe.freeze(opts), options);
}

/** Convert probe stage-px bounds to a client-space point (centre by default). */
export async function stageBoundsToClient(page, bounds, { anchor = 'center' } = {}) {
  return page.evaluate(({ box, anchorMode }) => {
    const stage = document.getElementById('stage');
    const rect = stage.getBoundingClientRect();
    const info = window.__probe.stage();
    const scale = info.scale || (rect.width / Math.max(1, info.w));
    const left = box.left ?? box.x ?? 0;
    const top = box.top ?? box.y ?? 0;
    const width = box.width ?? ((box.right ?? 0) - left);
    const height = box.height ?? ((box.bottom ?? 0) - top);
    const sx = anchorMode === 'center' ? left + width / 2 : left;
    const sy = anchorMode === 'center' ? top + height / 2 : top;
    return {
      x: rect.left + sx * scale,
      y: rect.top + sy * scale,
      width: width * scale,
      height: height * scale,
      scale,
    };
  }, { box: bounds, anchorMode: anchor });
}

/** Real Playwright pointer press/move/release against stage-owned routing. */
export async function pointerDrag(page, fromClient, toClient, {
  steps = 8,
  cancel = false,
  loseCapture = false,
} = {}) {
  await page.mouse.move(fromClient.x, fromClient.y);
  await page.mouse.down();
  await page.mouse.move(toClient.x, toClient.y, { steps });
  if (cancel) {
    await page.evaluate(() => {
      const stage = document.getElementById('stage');
      const id = 1;
      stage.dispatchEvent(new PointerEvent('pointercancel', {
        bubbles: true, cancelable: true, pointerId: id, isPrimary: true,
        clientX: 0, clientY: 0, pointerType: 'mouse',
      }));
    });
    return;
  }
  if (loseCapture) {
    await page.evaluate(() => {
      const stage = document.getElementById('stage');
      try { stage.releasePointerCapture(1); } catch { /* may already be free */ }
      stage.dispatchEvent(new PointerEvent('lostpointercapture', {
        bubbles: true, cancelable: true, pointerId: 1, isPrimary: true,
        pointerType: 'mouse',
      }));
    });
    return;
  }
  await page.mouse.up();
}

// Assert the probe's DOM↔engine invariants all hold. Failures print the
// invariant name plus the probe's measured detail.
export async function expectInvariants(page, context = '') {
  const results = await page.evaluate(() => window.__probe.invariants());
  const failures = results.filter((r) => !r.pass).map((r) => `${r.name} — ${r.detail}`);
  expect(failures, `invariants violated${context ? ` (${context})` : ''}`).toEqual([]);
}

export function expectNoErrors(errors, context = '') {
  expect(errors, `console/page errors${context ? ` (${context})` : ''}`).toEqual([]);
}

/**
 * Task 29 — true combat DOM allowed-list. Walks every visible, non-empty
 * element under `#stage` and requires each to match the P5 allow set
 * (plates / combatant art+aim+mesh / `#uigl` / `#vfx` / tooltip mounts /
 * empty structural hosts). Forbidden legacy ceremony classes always fail.
 */
export const COMBAT_DOM_FORBIDDEN_SELECTORS = Object.freeze([
  '.floaty',
  '.flymote',
  '.flycard',
  '.flycard-face',
  '.flycard-back',
  '.flycard-pile',
  '.turn-banner',
  '.boss-banner',
  '.perfect-banner',
  '.variant-dialogue',
  '.hand-zone .card',
]);

export async function inventoryCombatDom(page) {
  return page.evaluate((forbiddenSelectors) => {
    const stage = document.getElementById('stage');
    if (!stage) return { ok: false, reason: 'no-stage', unexpected: [], forbidden: {}, emptyHosts: {} };

    const ALLOWED_IDS = new Set([
      'stage', 'bg3d', 'vignette', 'grain', 'shake', 'screen', 'mesh', 'lantern',
      'hud', 'aim', 'vfx', 'uigl', 'floaties', 'overlay', 'wipe', 'transit', 'tooltip',
      'omen-slot', 'relicbar', 'aim-outline-atk', 'aim-outline-self', 'status-outline', 'alpha-erode',
    ]);
    const ALLOWED_CLASS = new Set([
      'combat-screen', 'screen-enter', 'intro', 'pixi-bottom-chrome', 'pixi-plate-chrome', 'pixi-hud-chrome',
      'sl', 'sl-backdrop', 'sl-mid', 'sl-ledge',
      'stage-dim', 'stage-ledge', 'stage-breath', 'b1', 'b2',
      'cast-shadow-layer', 'cast-shadow',
      'battlefield', 'player-zone', 'enemy-zone', 'hero-wrap', 'hero-sprite', 'enemy', 'enemy-art',
      'enemy-sprite', 'raster-art', 'aim-ring', 'cracks-overlay', 'vessel-fire', 'dmg-preview',
      'idle-motes', 'mesh-live',
      'top-chrome', 'cplate', 'status-row', 'p-status', 'intent', 'name', 'hpbar-wrap', 'hp-vial',
      'hpbar', 'fill', 'ghost', 'pv', 'hp-label', 'block-chip', 'facet-row', 'zero', 'ic',
      'energy-orb', 'lantern-btn', 'end-turn', 'pile-btn', 'pile-draw', 'pile-discard', 'pile-exhaust',
      'hand-zone', 'pop', 'unlit', 'pile-bump', 'is-empty', 'show',
      'hud-bar', 'hud-stat', 'hud-hp-wrap', 'hud-hpbar', 'hud-right', 'gold-num', 'hp-num',
      'elite-e', 'boss-e', 'affixed', 'lowhp', 'gone',
    ]);

    const visible = (el) => {
      const r = el.getBoundingClientRect();
      if (r.width < 0.5 || r.height < 0.5) return false;
      const s = getComputedStyle(el);
      if (s.display === 'none' || s.visibility === 'hidden') return false;
      if (Number(s.opacity) < 0.01) return false;
      return true;
    };

    const nonempty = (el) => {
      const tag = el.tagName;
      if (tag === 'IMG' || tag === 'CANVAS' || tag === 'SVG' || tag === 'VIDEO' || tag === 'PATH'
        || tag === 'CIRCLE' || tag === 'RECT' || tag === 'G' || tag === 'FILTER'
        || tag === 'FEMORPHOLOGY' || tag === 'FECOMPOSITE' || tag === 'FEFLOOD' || tag === 'FEMERGE'
        || tag === 'FEMERGENODE' || tag === 'DEFS') return true;
      if ((el.textContent || '').trim().length > 0) return true;
      return el.children.length > 0;
    };

    const allowed = (el) => {
      if (el === stage) return true;
      if (el.id && ALLOWED_IDS.has(el.id)) return true;
      // Hidden SVG filter library for aim-ring / status outlines.
      if (el.closest('svg[aria-hidden="true"]')) return true;
      const classes = typeof el.className === 'string'
        ? el.className.trim().split(/\s+/).filter(Boolean)
        : [...(el.classList || [])];
      if (!classes.length) {
        // Anonymous structural wrappers under an allowed host (e.g. cast-shadow > img).
        return !!(el.parentElement && allowed(el.parentElement));
      }
      return classes.every((c) => ALLOWED_CLASS.has(c) || c.startsWith('sl-') || c.startsWith('pile-')
        || c.startsWith('hud-') || c.startsWith('idle-') || c.startsWith('schip')
        || c.startsWith('ui-icon') || c === 'gicon' || c === 'et-ic' || c === 'et-lbl'
        || c === 'lb-ic' || c === 'lb-count' || c === 'lb-pips' || c === 'num' || c === 'cnt'
        || c === 'lbl' || c === 'pile-stack' || c === 'candles');
    };

    const unexpected = [];
    for (const el of stage.querySelectorAll('*')) {
      if (!visible(el) || !nonempty(el)) continue;
      if (!allowed(el)) {
        const classes = typeof el.className === 'string'
          ? el.className.trim()
          : [...(el.classList || [])].join(' ');
        unexpected.push({
          tag: el.tagName.toLowerCase(),
          id: el.id || null,
          cls: classes.slice(0, 120),
        });
      }
    }

    const forbidden = Object.fromEntries(
      forbiddenSelectors.map((sel) => [sel, document.querySelectorAll(sel).length]),
    );
    return {
      ok: unexpected.length === 0 && Object.values(forbidden).every((n) => n === 0),
      screen: window.spirebound?.S?.screen ?? null,
      unexpected,
      forbidden,
      emptyHosts: {
        floaties: document.querySelectorAll('#floaties > *').length,
        aim: document.querySelectorAll('#aim > *').length,
        handZone: document.querySelector('.hand-zone')?.childElementCount ?? -1,
      },
      mounts: {
        uigl: !!document.getElementById('uigl'),
        vfx: !!document.getElementById('vfx'),
        tooltip: !!document.getElementById('tooltip'),
      },
    };
  }, COMBAT_DOM_FORBIDDEN_SELECTORS);
}

/**
 * Screenshot helper routed through an explicit visual-policy suite key.
 * All visual regression cases must declare one of VISUAL_DIFF_RATIOS keys.
 */
export async function expectScreenshot(page, name, suiteKey, locatorOrPage = null) {
  const target = locatorOrPage || page;
  const options = screenshotDiffOptions(suiteKey);
  await expect(target).toHaveScreenshot(`${name}.png`, options);
}
