// Shared plumbing for the visual-QA kit. Every helper goes through
// window.__probe / window.spirebound (src/ui.js) — the tests never poke
// engine internals beyond the probe's documented shims.
import { expect } from '@playwright/test';

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

export async function freeze(page) {
  await page.waitForFunction(() => window.__probe?.freeze);
  return page.evaluate(() => window.__probe.freeze());
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
