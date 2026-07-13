import { test, expect } from './trace-fixture.js';
import {
  encodeLabScenario, decodeLabScenario,
  encodeReplayDescriptor, decodeReplayDescriptor,
} from '../../src/dev/lab-scenario.js';

const SAVE_KEY = 'spirebound_save_v2';
const STATS_KEY = 'spirebound_stats_v1';
const VIGIL_KEY = 'spirebound_vigil_v2';
const SENTINEL_SAVE = 'LAB_SENTINEL_SAVE_v1';
const SENTINEL_STATS = 'LAB_SENTINEL_STATS_v1';
const SENTINEL_VIGIL = 'LAB_SENTINEL_VIGIL_v1';

const COMBAT_SCENARIO = Object.freeze({
  v: 1,
  mode: 'combat',
  seed: 20260717,
  aspectId: 'ashwarden',
  themeId: 'act2',
  kind: 'normal',
  omenId: 'thinGlass',
  enemies: [{ id: 'duskfang', variantId: 'paleDuskfang' }],
  deck: [{ id: 'strike', up: false }, { id: 'defend', up: false }],
  hand: [{ id: 'strike', up: false }],
});

const PALE_SCENARIO = Object.freeze({
  ...COMBAT_SCENARIO,
  seed: 20260718,
  enemies: [{ id: 'duskfang', variantId: 'paleDuskfang' }],
  hand: [{ id: 'strike', up: false }],
});

const SAMPLE_CLIMB = Object.freeze({
  v: 1,
  mode: 'climb',
  seed: 20260719,
  aspectId: 'duskblade',
  themeId: 'sampleTheme',
  kind: 'normal',
  omenId: 'thinGlass',
  enemies: [{ id: 'sampleEnemy', variantId: null }],
  deck: [{ id: 'sampleCard', up: false }],
  hand: [{ id: 'sampleCard', up: false }],
});

async function seedSentinels(page) {
  await page.addInitScript(({ save, stats, vigil, SAVE_KEY: sk, STATS_KEY: stk, VIGIL_KEY: vk }) => {
    localStorage.setItem(sk, save);
    localStorage.setItem(stk, stats);
    localStorage.setItem(vk, vigil);
  }, {
    save: SENTINEL_SAVE,
    stats: SENTINEL_STATS,
    vigil: SENTINEL_VIGIL,
    SAVE_KEY,
    STATS_KEY,
    VIGIL_KEY,
  });
}

async function readSentinels(page) {
  return page.evaluate(({ SAVE_KEY: sk, STATS_KEY: stk, VIGIL_KEY: vk }) => ({
    save: localStorage.getItem(sk),
    stats: localStorage.getItem(stk),
    vigil: localStorage.getItem(vk),
  }), { SAVE_KEY, STATS_KEY, VIGIL_KEY });
}

async function waitLabReady(page) {
  await page.waitForFunction(() => window.__probe && document.querySelector('[data-lab-root]'));
}

async function waitLabStaged(page, mode = null) {
  await page.waitForFunction((expected) => {
    const root = document.querySelector('[data-lab-root]');
    if (!root?.hasAttribute('data-lab-staged')) return false;
    if (expected && root.getAttribute('data-lab-staged') !== expected) return false;
    return true;
  }, mode);
}

async function fillSelect(page, sel, value) {
  await page.locator(sel).selectOption(value);
}

async function setNumber(page, sel, value) {
  await page.locator(sel).fill(String(value));
}

test.describe('Content Lab', () => {
  test('URL combat round-trip, play, replay hydrate without auto-run', async ({ page }) => {
    await seedSentinels(page);
    const encoded = encodeLabScenario(COMBAT_SCENARIO);
    await page.goto(`/?lab=1&scenario=${encoded}`);
    await waitLabReady(page);
    await waitLabStaged(page, 'combat');
    await page.waitForFunction(() => window.__probe?.state().screen === 'combat');

    const trace = await page.evaluate(() => window.__probe.behaviourTrace());
    expect(trace.enabled).toBe(true);

    // Ephemeral Lab must not write the durable run-save key.
    expect(await page.evaluate((k) => localStorage.getItem(k), SAVE_KEY)).toBe(SENTINEL_SAVE);

    const probeEnemies = await page.evaluate(() => window.__probe.state().enemies);
    expect(probeEnemies[0]).toMatchObject({ key: 'duskfang', variantId: 'paleDuskfang' });

    const handBefore = await page.evaluate(() => window.__probe.state().hand);
    expect(handBefore.map((c) => c.id)).toEqual(['strike']);

    await page.evaluate(() => window.__probe.play(window.__probe.state().hand[0].uid, 0));
    await page.waitForFunction(() => new URL(location.href).searchParams.has('replay'));
    const incomingReplay = await page.evaluate(() => new URL(location.href).searchParams.get('replay'));
    expect(incomingReplay).toBeTruthy();
    const decodedIncoming = decodeReplayDescriptor(incomingReplay);
    expect(decodedIncoming.kind).toBe('card-flight');

    await page.reload();
    await waitLabReady(page);
    await waitLabStaged(page, 'combat');
    await page.evaluate(() => window.__probe.settle());
    await expect(page.locator('[data-lab-replay]')).toBeEnabled();
    await expect(page.locator('[data-replay-preview]')).toBeEmpty();
    expect(await page.evaluate(() => new URL(location.href).searchParams.get('replay')))
      .toBe(incomingReplay);

    // Next real user card-flight beat may replace the query; boot must not have.
    await page.waitForFunction(() => window.__probe?.state().screen === 'combat');
    await page.evaluate(async () => {
      const probe = window.__probe;
      // Ensure a playable card exists after hydrate auto-stage.
      if (!probe.state().hand?.length) {
        probe.forceHand(['strike']);
        probe.setEnergy(3);
      } else {
        probe.setEnergy(3);
      }
      await probe.play(probe.state().hand[0].uid, 0);
    });
    await page.waitForFunction((prev) => {
      const next = new URL(location.href).searchParams.get('replay');
      return next && next !== prev;
    }, incomingReplay);
    const nextReplay = await page.evaluate(() => new URL(location.href).searchParams.get('replay'));
    expect(nextReplay).not.toBe(incomingReplay);
    expect(decodeReplayDescriptor(nextReplay).kind).toBe('card-flight');
    // Prove the reload preserved the incoming descriptor until publication armed
    // by decoding both independently (incoming stayed valid Lab codec bytes).
    expect(decodeReplayDescriptor(incomingReplay).v).toBe(1);

    await page.locator('[data-lab-replay]').click();
    await page.waitForFunction(() => window.__probe.behaviourTrace().records
      .some((r) => r.eventName === 'presentation.replay-preview' && r.phase === 'end'));
    await expect(page.locator('[data-replay-preview]')).not.toBeEmpty();

    const sentinels = await readSentinels(page);
    expect(sentinels).toEqual({
      save: SENTINEL_SAVE,
      stats: SENTINEL_STATS,
      vigil: SENTINEL_VIGIL,
    });
  });

  test('registry editor Start sandbox writes canonical URL and round-trips', async ({ page }) => {
    await seedSentinels(page);
    await page.goto('/?lab=1');
    await waitLabReady(page);

    await expect(page.locator('[data-lab-mode]')).toBeVisible();
    await expect(page.locator('[data-lab-seed]')).toBeVisible();
    await expect(page.locator('[data-lab-aspect]')).toBeVisible();
    await expect(page.locator('[data-lab-theme]')).toBeVisible();
    await expect(page.locator('[data-lab-omen]')).toBeVisible();
    await expect(page.locator('[data-lab-kind]')).toBeVisible();
    await expect(page.locator('[data-lab-start]')).toBeVisible();

    // Options come from the active frozen content context (aspects include ashwarden).
    const aspectOptions = await page.locator('[data-lab-aspect] option').allTextContents();
    expect(aspectOptions.some((t) => /ashwarden/i.test(t))).toBe(true);

    await fillSelect(page, '[data-lab-mode]', 'combat');
    await setNumber(page, '[data-lab-seed]', 424242);
    await fillSelect(page, '[data-lab-aspect]', 'ashwarden');
    // Non-default core theme (not act1).
    await fillSelect(page, '[data-lab-theme]', 'act2');
    await fillSelect(page, '[data-lab-omen]', 'thinGlass');
    await fillSelect(page, '[data-lab-kind]', 'normal');

    // One enemy row: duskfang + paleDuskfang.
    await page.locator('[data-lab-enemy-add]').click();
    await fillSelect(page, '[data-lab-enemy-id="0"]', 'duskfang');
    await fillSelect(page, '[data-lab-enemy-variant="0"]', 'paleDuskfang');

    // Custom deck + opening hand (ordered).
    await page.locator('[data-lab-deck-clear]').click();
    await page.locator('[data-lab-deck-add]').click();
    await fillSelect(page, '[data-lab-deck-id="0"]', 'strike');
    await page.locator('[data-lab-deck-add]').click();
    await fillSelect(page, '[data-lab-deck-id="1"]', 'defend');
    await page.locator('[data-lab-hand-clear]').click();
    await page.locator('[data-lab-hand-add]').click();
    await fillSelect(page, '[data-lab-hand-id="0"]', 'strike');

    await page.locator('[data-lab-start]').click({ force: true });
    await page.waitForFunction(() => new URL(location.href).searchParams.has('scenario'));
    await waitLabStaged(page, 'combat');
    await page.waitForFunction(() => window.__probe?.state().screen === 'combat');

    const urlScenario = await page.evaluate(() => new URL(location.href).searchParams.get('scenario'));
    const decoded = decodeLabScenario(urlScenario);
    expect(decoded).toMatchObject({
      mode: 'combat',
      seed: 424242,
      aspectId: 'ashwarden',
      themeId: 'act2',
      omenId: 'thinGlass',
      kind: 'normal',
      enemies: [{ id: 'duskfang', variantId: 'paleDuskfang' }],
      deck: [{ id: 'strike', up: false }, { id: 'defend', up: false }],
      hand: [{ id: 'strike', up: false }],
    });
    expect(encodeLabScenario(decoded)).toBe(urlScenario);

    const state = await page.evaluate(() => window.__probe.state());
    expect(state.enemies[0]).toMatchObject({ key: 'duskfang', variantId: 'paleDuskfang' });
    expect(state.hand.map((c) => c.id)).toEqual(['strike']);

    // Reload hydrates every control and auto-stages once.
    await page.reload();
    await waitLabReady(page);
    await waitLabStaged(page, 'combat');
    await page.waitForFunction(() => window.__probe?.state().screen === 'combat');
    expect(await page.locator('[data-lab-aspect]').inputValue()).toBe('ashwarden');
    expect(await page.locator('[data-lab-theme]').inputValue()).toBe('act2');
    expect(await page.locator('[data-lab-omen]').inputValue()).toBe('thinGlass');
    expect(await page.locator('[data-lab-enemy-variant="0"]').inputValue()).toBe('paleDuskfang');

    // After editing the hydrated form, Start is required again (no auto on edit).
    await setNumber(page, '[data-lab-seed]', 424243);
    await expect(page.locator('[data-lab-start]')).toBeEnabled();
    // Screen stays combat until Start; URL not yet updated to new seed.
    expect(await page.evaluate(() => new URL(location.href).searchParams.get('scenario')))
      .toBe(urlScenario);

    // Reordering deck produces a distinct canonical URL.
    await page.locator('[data-lab-deck-id="0"]').selectOption('defend');
    await page.locator('[data-lab-deck-id="1"]').selectOption('strike');
    await page.locator('[data-lab-start]').click({ force: true });
    await page.waitForFunction((prev) => {
      const next = new URL(location.href).searchParams.get('scenario');
      return next && next !== prev;
    }, urlScenario);
    const reordered = await page.evaluate(() => new URL(location.href).searchParams.get('scenario'));
    expect(decodeLabScenario(reordered).deck.map((r) => r.id)).toEqual(['defend', 'strike']);
    expect(reordered).not.toBe(urlScenario);

    const sentinels = await readSentinels(page);
    expect(sentinels).toEqual({
      save: SENTINEL_SAVE,
      stats: SENTINEL_STATS,
      vigil: SENTINEL_VIGIL,
    });
  });

  test('pasted paleDuskfang URL stages through probe and rejects base mismatch', async ({ page }) => {
    await seedSentinels(page);
    const encoded = encodeLabScenario(PALE_SCENARIO);
    await page.goto(`/?lab=1&scenario=${encoded}`);
    await waitLabReady(page);
    await waitLabStaged(page, 'combat');
    await page.waitForFunction(() => window.__probe?.state().screen === 'combat');
    const enemies = await page.evaluate(() => window.__probe.state().enemies);
    expect(enemies[0]).toEqual(expect.objectContaining({
      key: 'duskfang',
      variantId: 'paleDuskfang',
    }));

    // Editor rejects a variant whose registry base does not match its row.
    await fillSelect(page, '[data-lab-enemy-id="0"]', 'sporeling');
    // paleDuskfang must not remain selectable / Start must surface a validation error.
    const variantOptions = await page.locator('[data-lab-enemy-variant="0"] option').evaluateAll(
      (opts) => opts.map((o) => o.value),
    );
    expect(variantOptions).not.toContain('paleDuskfang');
  });

  test('sample climb journey through probe with frozen content summary', async ({ page }) => {
    await seedSentinels(page);
    const encoded = encodeLabScenario(SAMPLE_CLIMB);
    await page.goto(`/?lab=1&scenario=${encoded}`);
    await waitLabReady(page);
    await waitLabStaged(page, 'climb');
    await page.waitForFunction(() => window.__probe?.state().screen === 'map'
      || window.__probe?.contentSummary?.()?.themeId === 'sampleTheme');

    const summary = await page.evaluate(() => window.__probe.contentSummary());
    expect(summary).toEqual({
      contextId: 'dev:_sample',
      themeId: 'sampleTheme',
      themeIndex: 3,
      themeCount: 4,
    });
    // Probe never exposes registry rows or behaviour functions.
    expect(Object.keys(summary).sort()).toEqual([
      'contextId', 'themeCount', 'themeId', 'themeIndex',
    ]);

    // Sample weather + Music Cue fallback are observable on the bound theme.
    const themeMeta = await page.evaluate(() => window.__probe.labThemeMeta());
    expect(themeMeta.weather).toBeTruthy();
    expect(themeMeta.music).toBeTruthy();

    // Select the one map node through the real probe driver and start the sample encounter.
    await page.evaluate(async () => {
      const probe = window.__probe;
      await probe.labSelectFirstNode();
    });
    await page.waitForFunction(() => window.__probe?.state().screen === 'combat');
    const hand = await page.evaluate(() => window.__probe.state().hand);
    expect(hand.some((c) => c.id === 'sampleCard')).toBe(true);
    const enemies = await page.evaluate(() => window.__probe.state().enemies);
    expect(enemies[0].key).toBe('sampleEnemy');

    await page.evaluate(async () => {
      const probe = window.__probe;
      const card = probe.state().hand.find((c) => c.id === 'sampleCard');
      probe.setEnergy(3);
      await probe.play(card.uid, 0);
      await probe.settle();
    });
    const after = await page.evaluate(() => {
      const enemy = window.__probe.state().enemies[0];
      return {
        enemyHp: enemy.hp,
        enemyMax: enemy.maxHp,
        chips: enemy.chips,
        facetMax: enemy.facetMax,
      };
    });
    // sampleCard: 3 damage + attack/chip glass work → shatter (chips reset, facetMax anneals).
    expect(after.enemyHp).toBe(after.enemyMax - 3);
    expect(after.chips).toBe(0);
    expect(after.facetMax).toBe(3);

    // Complete one floor: finish the kill through a real play so ephemeral Lab terminals.
    await page.evaluate(async () => {
      const probe = window.__probe;
      probe.setEnemyHp(0, 1);
      probe.forceHand(['sampleCard']);
      probe.setEnergy(3);
      await probe.play(probe.state().hand[0].uid, 0);
      await probe.settle();
    });
    await page.waitForSelector('[data-lab-result]');
    await expect(page.locator('[data-lab-result]')).toBeVisible();

    const sentinels = await readSentinels(page);
    expect(sentinels).toEqual({
      save: SENTINEL_SAVE,
      stats: SENTINEL_STATS,
      vigil: SENTINEL_VIGIL,
    });
  });

  test('Lab win and Lab loss leave sentinel storage byte-identical', async ({ page }) => {
    await seedSentinels(page);
    const winEncoded = encodeLabScenario({
      ...COMBAT_SCENARIO,
      seed: 20260720,
      enemies: [{ id: 'sporeling', variantId: null }],
      hand: [{ id: 'strike', up: false }],
    });
    await page.goto(`/?lab=1&scenario=${winEncoded}`);
    await waitLabReady(page);
    await waitLabStaged(page, 'combat');
    await page.evaluate(async () => {
      await window.__probe.labForceOutcome('win');
    });
    await page.waitForSelector('[data-lab-result]');
    expect(await readSentinels(page)).toEqual({
      save: SENTINEL_SAVE,
      stats: SENTINEL_STATS,
      vigil: SENTINEL_VIGIL,
    });

    const lossEncoded = encodeLabScenario({
      ...COMBAT_SCENARIO,
      seed: 20260721,
      enemies: [{ id: 'sporeling', variantId: null }],
      hand: [{ id: 'defend', up: false }],
    });
    await page.goto(`/?lab=1&scenario=${lossEncoded}`);
    await waitLabReady(page);
    await waitLabStaged(page, 'combat');
    await page.evaluate(async () => {
      await window.__probe.labForceOutcome('death');
    });
    await page.waitForSelector('[data-lab-result="death"], [data-lab-result]');
    expect(await readSentinels(page)).toEqual({
      save: SENTINEL_SAVE,
      stats: SENTINEL_STATS,
      vigil: SENTINEL_VIGIL,
    });
  });

  test('replay= only hydrates the button and never auto-runs', async ({ page }) => {
    const scenario = encodeLabScenario(COMBAT_SCENARIO);
    const replay = encodeReplayDescriptor({
      v: 1,
      kind: 'card-flight',
      subject: { kind: 'card', contentId: 'strike', upgraded: false },
      parameters: { destination: 'discard', motion: 'full' },
      endState: { destination: 'discard', visible: false },
    });
    await page.goto(`/?lab=1&scenario=${scenario}&replay=${replay}`);
    await waitLabReady(page);
    await waitLabStaged(page, 'combat');
    await page.evaluate(() => window.__probe.settle());
    await expect(page.locator('[data-lab-replay]')).toBeEnabled();
    await expect(page.locator('[data-replay-preview]')).toBeEmpty();
    const previewSpans = await page.evaluate(() => window.__probe.behaviourTrace().records
      .filter((r) => r.eventName === 'presentation.replay-preview').length);
    expect(previewSpans).toBe(0);
  });

  test('missing or invalid incoming replay leaves the button disabled', async ({ page }) => {
    const scenario = encodeLabScenario(COMBAT_SCENARIO);
    await page.goto(`/?lab=1&scenario=${scenario}&replay=not-valid-base64url!!!`);
    await waitLabReady(page);
    await waitLabStaged(page, 'combat');
    await expect(page.locator('[data-lab-replay]')).toBeDisabled();
    expect(await page.locator('[data-lab-replay]').getAttribute('data-disabled-reason'))
      .toMatch(/invalid|unsupported|missing/);
  });

  test('unsupported replay kind disables at hydrate with unsupported-presentation', async ({ page }) => {
    const scenario = encodeLabScenario(COMBAT_SCENARIO);
    const replay = encodeReplayDescriptor({
      v: 1,
      kind: 'not-a-presentation',
      subject: { kind: 'card', contentId: 'strike', upgraded: false },
      parameters: { destination: 'discard' },
      endState: { destination: 'discard', visible: false },
    });
    await page.goto(`/?lab=1&scenario=${scenario}&replay=${replay}`);
    await waitLabReady(page);
    await waitLabStaged(page, 'combat');
    await page.evaluate(() => window.__probe.settle());
    await expect(page.locator('[data-lab-replay]')).toBeDisabled();
    expect(await page.locator('[data-lab-replay]').getAttribute('data-disabled-reason'))
      .toBe('unsupported-presentation');
    await expect(page.locator('[data-replay-preview]')).toBeEmpty();
  });

  test('trace transcript copy copies live panel text after a real beat', async ({ page }) => {
    await seedSentinels(page);
    // Playwright WebKit rejects clipboard-write; a real click is enough for writeText.
    const project = test.info().project.name;
    const clipboardPerms = project === 'iphone-webkit' || project === 'ipad-webkit'
      ? ['clipboard-read']
      : ['clipboard-read', 'clipboard-write'];
    await page.context().grantPermissions(clipboardPerms);
    const encoded = encodeLabScenario(COMBAT_SCENARIO);
    await page.goto(`/?lab=1&scenario=${encoded}`);
    await waitLabReady(page);
    await waitLabStaged(page, 'combat');
    await page.waitForFunction(() => window.__probe?.state().screen === 'combat');

    await page.evaluate(async () => {
      const probe = window.__probe;
      probe.setEnergy(3);
      await probe.play(probe.state().hand[0].uid, 0);
      await probe.settle();
    });

    await page.waitForFunction(() => {
      const panel = document.querySelector('[data-lab-trace]');
      return panel && panel.textContent && panel.textContent.trim().length > 0;
    });
    const panelText = await page.locator('[data-lab-trace]').innerText();
    expect(panelText.trim().length).toBeGreaterThan(0);

    await page.locator('[data-lab-trace-copy]').click();
    const clipboard = await page.evaluate(async () => navigator.clipboard.readText());
    expect(clipboard.trim().length).toBeGreaterThan(0);
    // Copied payload is the text transcript (header and/or span lines), not empty.
    expect(clipboard).toMatch(/# trace |phase=/);
  });
});

// Source / Node assertions for the production-surface verifier live in test_engine.js.
