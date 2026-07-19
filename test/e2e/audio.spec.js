// Runtime audio-selection gallery/backend controls (desktop dev tool).
import { test, expect } from './trace-fixture.js';
import { boot, settle, startFight } from './helpers.js';
import { mixedLedger, seed } from './emberglass-fixtures.js';

test.beforeEach(({}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'audio backend controls are desktop-only');
});

async function openAudioGallery(page) {
  await page.goto('/?audio=1&mesh=0');
  await page.waitForSelector('.audio-gallery-mode .ag-editor', { timeout: 10_000 });
}

test('audio gallery exposes complete pack selectors and every gameplay id', async ({ page }) => {
  await openAudioGallery(page);
  await expect(page.locator('.ag-row[data-kind="music"]')).toHaveCount(22);
  await expect(page.locator('.ag-row[data-kind="sfx"]')).toHaveCount(36);
  const musicVersion = page.locator('#ag-music-version');
  const sfxVersion = page.locator('#ag-sfx-version');
  await expect(musicVersion).not.toHaveValue('');
  await expect(sfxVersion).not.toHaveValue('');
  expect(await musicVersion.evaluate((el) => [...el.options].some((option) => option.selected && option.value))).toBe(true);
  expect(await sfxVersion.evaluate((el) => [...el.options].some((option) => option.selected && option.value))).toBe(true);
  await expect(page.locator('.ag-source')).toHaveCount(58);
  await expect(page.locator('.ag-config-errors')).toHaveCount(0);
  expect(await page.evaluate(async () => {
    const { AUDIO_INVENTORY } = await import('/src/audio-assets.js');
    return [...AUDIO_INVENTORY.music, ...AUDIO_INVENTORY.sfx]
      .filter((ref) => ref.includes('_raw'));
  })).toEqual([]);
});

test('override options put pack default once, then other same-action versions', async ({ page }) => {
  await openAudioGallery(page);
  const options = page.locator('.ag-source[data-source-kind="sfx"][data-source-id="click"] option');
  const first = await options.first().evaluate((option) => ({ value: option.value, label: option.textContent.trim() }));
  expect(first.value).toBe('');
  const packRef = first.label.replace(/^Pack default ·\s*/, '').trim();
  expect(packRef).toMatch(/\/click\.mp3$/);
  const values = await options.evaluateAll((nodes) => nodes.map((option) => option.value).filter(Boolean));
  expect(values).not.toContain(packRef);
  expect(values[0]).toMatch(/\/click\.mp3$/);
});

test('per-file source choice posts selection metadata without audio binaries', async ({ page }) => {
  let payload = null;
  await page.route('**/__audio-save', async (route) => {
    payload = JSON.parse(route.request().postData());
    await route.fulfill({ json: { ok: true, hot: true } });
  });
  await openAudioGallery(page);
  const expected = await page.evaluate(() => {
    const next = {
      music: { version: document.querySelector('#ag-music-version').value, overrides: {} },
      sfx: { version: document.querySelector('#ag-sfx-version').value, overrides: {} },
    };
    for (const select of document.querySelectorAll('.ag-source')) {
      if (select.value) next[select.dataset.sourceKind].overrides[select.dataset.sourceId] = select.value;
    }
    return next;
  });
  await page.locator('.ag-source[data-source-kind="music"][data-source-id="title"]')
    .selectOption('stained-glass-v1/map.mp3');
  expected.music.overrides.title = 'stained-glass-v1/map.mp3';
  await page.locator('[data-a="save-audio"]').click();
  await expect.poll(() => payload).not.toBeNull();
  expect(payload).toEqual(expected);
  expect(JSON.stringify(payload)).not.toContain('data:audio');
});

test('PR15 hot apply invalidates both caches and actively re-resolves the current cue', async ({ page }) => {
  await page.route('**/__audio-save', (route) => route.fulfill({ json: { ok: true, hot: true } }));
  await openAudioGallery(page);
  await page.locator('.ag-row[data-kind="music"][data-id="title"] .ag-preview').click();
  await expect.poll(() => page.evaluate(async () => (await import('/src/music.js')).currentCue()),
    { timeout: 20_000 }).toBe('title');
  const before = await page.evaluate(async () => (await import('/src/music.js')).currentRequestedAudioRef());
  const selectedBefore = await page.evaluate(async () =>
    (await import('/src/audio-assets.js')).getAudioSelection().music.overrides.title ?? null);
  await page.evaluate(() => { window.__audioGallerySentinel = 'same-page'; });
  await page.evaluate(() => { location.hash = 'ag-music'; });
  await page.locator('.ag-source[data-source-kind="music"][data-source-id="title"]')
    .selectOption('stained-glass-v1/map.mp3');
  await page.locator('[data-a="save-audio"]').click();
  await expect.poll(() => page.evaluate(async () => ({
    selected: (await import('/src/audio-assets.js')).getAudioSelection().music.overrides.title,
    requested: (await import('/src/music.js')).currentRequestedAudioRef(),
    active: (await import('/src/music.js')).currentAudioRef(),
  })), { timeout: 20_000 }).toEqual({
    selected: 'stained-glass-v1/map.mp3', requested: 'stained-glass-v1/map.mp3',
    active: 'stained-glass-v1/map.mp3',
  });
  expect(await page.evaluate(() => ({
    sentinel: window.__audioGallerySentinel,
    hash: location.hash,
    gallery: document.querySelector('.audio-gallery-mode')?.isConnected === true,
    status: document.querySelector('#ag-save-status')?.textContent,
  }))).toEqual({
    sentinel: 'same-page', hash: '#ag-music', gallery: true, status: 'Saved ✓',
  });
  expect(selectedBefore).not.toBe('stained-glass-v1/map.mp3');
  expect(before).not.toBe('stained-glass-v1/map.mp3');
  const modes = await page.evaluate(() => window.__probe.behaviourTrace().records
    .filter((record) => record.eventName === 'audio.music-request' && record.attributes?.id === 'title')
    .map((record) => record.attributes.mode));
  expect(modes).toContain('draft');
  expect(modes).toContain('active');
});

test('PR15 unsaved selector changes stay draft-only until Save', async ({ page }) => {
  await openAudioGallery(page);
  const before = await page.evaluate(async () =>
    (await import('/src/audio-assets.js')).getAudioSelection());
  await page.locator('.ag-source[data-source-kind="music"][data-source-id="title"]')
    .selectOption('stained-glass-v1/map.mp3');
  await page.locator('.ag-row[data-kind="music"][data-id="title"] .ag-preview').click();
  await expect.poll(() => page.evaluate(async () => ({
    selection: (await import('/src/audio-assets.js')).getAudioSelection(),
    requested: (await import('/src/music.js')).currentRequestedAudioRef(),
    active: (await import('/src/music.js')).currentAudioRef(),
  })), { timeout: 20_000 }).toEqual({
    selection: before,
    requested: 'stained-glass-v1/map.mp3',
    active: 'stained-glass-v1/map.mp3',
  });
  const modes = await page.evaluate(() => window.__probe.behaviourTrace().records
    .filter((record) => record.eventName === 'audio.music-request' && record.attributes?.id === 'title')
    .map((record) => record.attributes.mode));
  expect(modes).toContain('draft');
  expect(modes).not.toContain('active');
});

test('invalid host selection visibly falls back to both immutable base packs', async ({ page }) => {
  await page.route('**/audio-selection.json', (route) => route.fulfill({
    json: {
      music: { version: 'missing-pack', overrides: {} },
      sfx: { version: 'ashglass-v1', overrides: {} },
    },
  }));
  await openAudioGallery(page);
  await expect(page.locator('#ag-music-version')).toHaveValue('stained-glass-v1');
  await expect(page.locator('#ag-sfx-version')).toHaveValue('ashglass-v1');
  await expect(page.locator('.ag-config-errors')).toContainText('unknown or incomplete pack missing-pack');
});

test('a broken selected music file falls back once without restart churn', async ({ page }) => {
  let selectedRequests = 0;
  let baseRequests = 0;
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (url.pathname.endsWith('/embark.mp3') && !url.searchParams.has('url')) selectedRequests++;
    if (url.pathname.endsWith('/title.mp3') && !url.searchParams.has('url')) baseRequests++;
  });
  await page.addInitScript(() => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    const originalDecode = AudioContextClass.prototype.decodeAudioData;
    const originalCreateBufferSource = AudioContextClass.prototype.createBufferSource;
    window.__forcedMusicDecodeFailures = 0;
    window.__musicBufferStarts = 0;
    AudioContextClass.prototype.decodeAudioData = function decodeAudioData(...args) {
      const bytes = new Uint8Array(args[0]);
      if (bytes.length === 4 && bytes[0] === 83 && bytes[1] === 66 && bytes[2] === 65 && bytes[3] === 68) {
        window.__forcedMusicDecodeFailures++;
        return Promise.reject(new DOMException('forced selected-file decode failure', 'EncodingError'));
      }
      return originalDecode.apply(this, args);
    };
    AudioContextClass.prototype.createBufferSource = function createBufferSource(...args) {
      const source = originalCreateBufferSource.apply(this, args);
      const originalStart = source.start;
      source.start = function start(...startArgs) {
        window.__musicBufferStarts++;
        return originalStart.apply(this, startArgs);
      };
      return source;
    };
  });
  await page.route('**/audio-selection.json', (route) => route.fulfill({
    json: {
      music: { version: 'stained-glass-v1', overrides: { title: 'stained-glass-v1/embark.mp3' } },
      sfx: { version: 'ashglass-v1', overrides: {} },
    },
  }));
  await page.route('**/embark.mp3*', (route) => {
    if (new URL(route.request().url()).searchParams.has('url')) return route.continue();
    return route.fulfill({ contentType: 'audio/mpeg', body: Buffer.from('SBAD') });
  });

  await openAudioGallery(page);
  await expect(page.locator('.ag-source[data-source-kind="music"][data-source-id="title"]'))
    .toHaveValue('stained-glass-v1/embark.mp3');
  const titlePreview = page.locator('.ag-row[data-kind="music"][data-id="title"] .ag-preview');
  await titlePreview.click();
  await expect.poll(() => page.evaluate(() => {
    return {
      decodeFailures: window.__forcedMusicDecodeFailures,
      bufferStarts: window.__musicBufferStarts,
    };
  }), { timeout: 20_000 }).toEqual({
    decodeFailures: 1,
    bufferStarts: 1,
  });
  expect(selectedRequests).toBe(1);
  expect(baseRequests).toBe(1);

  await titlePreview.click();
  await page.waitForTimeout(250);
  expect(selectedRequests).toBe(1);
  expect(baseRequests).toBe(1);
  expect(await page.evaluate(() => window.__forcedMusicDecodeFailures)).toBe(1);
  expect(await page.evaluate(() => window.__musicBufferStarts)).toBe(1);
});

test('draft previews report copy-free actual results without changing playback', async ({ page }) => {
  await openAudioGallery(page);
  await page.locator('.ag-row[data-kind="sfx"][data-id="click"] .ag-preview').click();
  await expect.poll(() => page.evaluate(() => window.__probe.behaviourTrace().records
    .some((record) => record.eventName === 'audio.sfx-request' && record.attributes.id === 'click'))).toBe(true);
  await page.locator('.ag-row[data-kind="music"][data-id="title"] .ag-preview').click();
  await expect.poll(() => page.evaluate(() => window.__probe.behaviourTrace().records
    .some((record) => record.eventName === 'audio.music-request' && record.attributes.id === 'title')),
  { timeout: 20_000 }).toBe(true);
  const records = await page.evaluate(() => window.__probe.behaviourTrace().records
    .filter((record) => ['audio.sfx-request', 'audio.music-request'].includes(record.eventName)));
  for (const record of records) {
    expect(Object.keys(record.attributes).sort()).toEqual(['id', 'mode', 'result']);
    expect(record.attributes.mode).toBe('draft');
    expect(record.attributes.result).toMatch(/^(sample|synth-fallback|muted|unavailable|superseded|playing)$/);
    expect(record.outcome).toBe(['sample', 'synth-fallback', 'playing'].includes(record.attributes.result)
      ? 'completed' : 'rejected');
    expect(JSON.stringify(record.attributes)).not.toMatch(/https?:|\.mp3|version|override|pack/);
  }
});

test('throwing audio observers cannot interrupt real preview playback', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await openAudioGallery(page);
  await page.evaluate(async () => {
    const audio = await import('/src/audio.js');
    const music = await import('/src/music.js');
    audio.setSfxObservationSink(() => { throw new Error('observer-only-sfx'); });
    music.setMusicObservationSink(() => { throw new Error('observer-only-music'); });
  });
  await page.locator('.ag-row[data-kind="sfx"][data-id="click"] .ag-preview').click();
  await page.locator('.ag-row[data-kind="music"][data-id="title"] .ag-preview').click();
  await expect.poll(() => page.evaluate(async () => (await import('/src/music.js')).currentCue()),
    { timeout: 20_000 }).toBe('title');
  expect(errors).toEqual([]);
});

async function waitForAudioResult(page, result) {
  await expect.poll(() => page.evaluate((expected) => window.__probe.behaviourTrace().records
    .some((record) => record.eventName.startsWith('audio.') && record.attributes?.result === expected), result),
  { timeout: 20_000 }).toBe(true);
}

async function waitForMusicOwner(page, id, afterSeq) {
  // 45s: locally this resolves in <2s, but two WebGL-heavy workers on a
  // loaded CI runner starve the page enough to blow a 20s budget. The poll
  // returns the moment the record lands, so the headroom is free on pass.
  await expect.poll(() => page.evaluate(({ cueId, after }) => window.__probe.behaviourTrace().records
    .some((record) => record.seq > after && record.eventName === 'audio.music-request' &&
      record.attributes?.id === cueId && record.attributes?.mode === 'active'),
  { cueId: id, after: afterSeq }), { timeout: 45_000 }).toBe(true);
}

test('audio unlock observes fulfilled state and rejection instead of optimistic playback', async ({ page }) => {
  await page.goto('/?trace=1');
  await page.waitForFunction(() => window.__probe?.behaviourTrace);
  const results = await page.evaluate(async () => {
    const audio = await import('/src/audio.js');
    audio.ensureAudio();
    const context = audio.getAudioContext();
    Object.defineProperty(context, 'state', { configurable: true, value: 'suspended' });
    const run = async (mode) => {
      window.__probe.resetBehaviourTrace();
      if (mode === 'rejected') {
        window.addEventListener('unhandledrejection', (event) => event.preventDefault(), { once: true });
        context.resume = () => Promise.reject(new Error('forced-resume-rejection'));
      } else {
        context.resume = () => Promise.resolve();
      }
      audio.unlock();
      await new Promise((resolve) => setTimeout(resolve, 0));
      return window.__probe.behaviourTrace().records
        .find((record) => record.eventName === 'audio.unlock')?.attributes.result ?? null;
    };
    return {
      fulfilledStillSuspended: await run('fulfilled'),
      rejected: await run('rejected'),
    };
  });
  expect(results).toEqual({
    fulfilledStillSuspended: 'unavailable',
    rejected: 'unavailable',
  });
});

test('audio result: sample', async ({ page }) => {
  await openAudioGallery(page);
  await page.locator('.ag-row[data-kind="sfx"][data-id="click"] .ag-preview').click();
  await waitForAudioResult(page, 'sample');
});

test('audio result: synth-fallback', async ({ page }) => {
  await openAudioGallery(page);
  await page.route('**/click.mp3*', (route) =>
    new URL(route.request().url()).searchParams.has('url') ? route.continue() : route.abort());
  await page.locator('.ag-row[data-kind="sfx"][data-id="click"] .ag-preview').click();
  await waitForAudioResult(page, 'synth-fallback');
});

test('audio result: muted', async ({ page }) => {
  await openAudioGallery(page);
  await page.evaluate(async () => (await import('/src/audio.js')).setSfxMuted(true));
  await page.locator('.ag-row[data-kind="sfx"][data-id="click"] .ag-preview').click();
  await waitForAudioResult(page, 'muted');
});

test('audio result: unavailable', async ({ page }) => {
  await openAudioGallery(page);
  await page.evaluate(async () => { await (await import('/src/audio.js')).previewSfx('missing-audio-id'); });
  await waitForAudioResult(page, 'unavailable');
});

test('audio result: superseded', async ({ page }) => {
  await page.route('**/title.mp3*', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    await route.continue();
  });
  await openAudioGallery(page);
  await page.evaluate(async () => {
    const music = await import('/src/music.js');
    const assets = await import('/src/audio-assets.js');
    const selection = assets.getAudioSelection();
    await Promise.all([music.preview('title', selection), music.preview('embark', selection)]);
  });
  await waitForAudioResult(page, 'superseded');
});

test('audio result: playing', async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(() => window.__probe?.behaviourTrace);
  await waitForAudioResult(page, 'playing');
});

test('PR16 real screen and combat owners request their selected Music Cues', async ({ page }) => {
  test.setTimeout(120_000);
  await seed(page, mixedLedger());
  let cursor = await page.evaluate(() => window.__probe.behaviourTrace().lastSeq);
  await page.evaluate(() => window.spirebound.show('vigil'));
  await waitForMusicOwner(page, 'vigil', cursor);
  cursor = await page.evaluate(() => window.__probe.behaviourTrace().lastSeq);
  await page.locator('[data-a="tab-rose"]').click({ force: true });
  await waitForMusicOwner(page, 'roseWindow', cursor);
  cursor = await page.evaluate(() => window.__probe.behaviourTrace().lastSeq);
  await page.locator('[data-a="tab-deeds"]').click({ force: true });
  await waitForMusicOwner(page, 'vigil', cursor);
  cursor = await page.evaluate(() => window.__probe.behaviourTrace().lastSeq);
  await page.locator('[data-a="tab-rose"]').click({ force: true });
  await waitForMusicOwner(page, 'roseWindow', cursor);

  await page.evaluate(() => {
    const sp = window.spirebound;
    const run = sp.E.newRun(8816);
    run.quests.hollowLamplighter = { state: 'revealed', progress: 1, memory: {} };
    const node = run.map.nodes[0];
    run.nodeId = node.id;
    run.pendingHollow = { nodeId: node.id, type: 'event', paid: false, deferred: false, answer: null };
    sp.S.run = run;
  });
  cursor = await page.evaluate(() => window.__probe.behaviourTrace().lastSeq);
  await page.evaluate(() => window.spirebound.show('hollow', { nodeId: window.spirebound.S.run.nodeId }));
  await waitForMusicOwner(page, 'hollowLamplighter', cursor);

  for (const scenario of [
    { questId: 'paleOnes', enemy: 'paleDuskfang', expected: 'paleOnes' },
    { questId: 'ownShade', enemy: 'ownShade1', expected: 'shadeDuel' },
    { questId: 'usurper', enemy: 'usurpedSovereign', expected: 'usurper' },
  ]) {
    cursor = await page.evaluate(() => window.__probe.behaviourTrace().lastSeq);
    await page.evaluate(({ questId, enemy }) => {
      const sp = window.spirebound;
      sp.S.run.pendingQuestId = questId;
      sp.startCombatUI([enemy], 'monster');
    }, scenario);
    await waitForMusicOwner(page, scenario.expected, cursor);
    await settle(page);
  }

  await page.evaluate(() => {
    const run = window.spirebound.S.run;
    run.pendingQuestId = null;
    run.act = 1;
    run.omens[1] = 'eighthOmen';
  });
  cursor = await page.evaluate(() => window.__probe.behaviourTrace().lastSeq);
  await page.evaluate(() => window.spirebound.show('map'));
  await waitForMusicOwner(page, 'eighthOmen', cursor);
  cursor = await page.evaluate(() => window.__probe.behaviourTrace().lastSeq);
  await page.evaluate(async () => {
    const { EVENTS } = await import('/src/data.js');
    window.spirebound.show('event', Object.keys(EVENTS)[0]);
  });
  await waitForMusicOwner(page, 'eighthOmen', cursor);
  cursor = await page.evaluate(() => window.__probe.behaviourTrace().lastSeq);
  await page.evaluate(() => window.spirebound.startCombatUI(['sporeling'], 'monster'));
  await waitForMusicOwner(page, 'eighthOmen', cursor);
  await settle(page);
  cursor = await page.evaluate(() => window.__probe.behaviourTrace().lastSeq);
  await page.evaluate(() => window.spirebound.startCombatUI(['sporeling'], 'boss'));
  await waitForMusicOwner(page, 'act2Boss', cursor);
  await settle(page);
});

test('PR16 Dawn page and Act 4 reveal panels request their real owner cues', async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto('/?trace=1');
  await page.waitForFunction(() => window.spirebound && window.__probe);
  const cursor = await page.evaluate(() => {
    const sp = window.spirebound;
    const run = sp.E.newRun(8820);
    run.pendingRunEnd = { outcome: 'win' };
    if (!sp.E.saveRun(run) || !sp.E.stagePendingDawn(run, [
      { t: 'pageRead', index: 1, text: 'TRACE PAGE SENTINEL' },
      { t: 'act4Reveal' },
    ], [])) throw new Error('Dawn cue fixture did not stage');
    sp.S.run = run;
    sp.show('end', { won: true });
    return window.__probe.behaviourTrace().lastSeq;
  });
  // Owner cues fire in the queue phase after bloom/parallax — budget CI load.
  await expect(page.locator('[data-event="pageRead"]')).toBeVisible({ timeout: 30_000 });
  await expect.poll(() => page.evaluate(({ cueId, after }) => window.__probe.behaviourTrace().records
    .some((record) => record.seq > after && record.eventName === 'audio.music-request' &&
      record.attributes?.id === cueId && record.attributes?.mode === 'active'),
  { cueId: 'unreadablePage', after: cursor }), { timeout: 45_000 }).toBe(true);
  await expect(page.locator('[data-event="act4Reveal"]')).toBeVisible({ timeout: 30_000 });
  await expect.poll(() => page.evaluate(({ cueId, after }) => window.__probe.behaviourTrace().records
    .some((record) => record.seq > after && record.eventName === 'audio.music-request' &&
      record.attributes?.id === cueId && record.attributes?.mode === 'active'),
  { cueId: 'sealedDoor', after: cursor }), { timeout: 45_000 }).toBe(true);
});

test('PR16 sealed-door close restores the selected Eighth Map cue', async ({ page }) => {
  await boot(page);
  let cursor = await page.evaluate(() => window.__probe.behaviourTrace().lastSeq);
  await page.evaluate(async () => {
    const { QUEST_IDS } = await import('/src/data.js');
    const sp = window.spirebound;
    sp.S.run.act = 2;
    sp.S.run.shards = QUEST_IDS.slice(0, 6);
    sp.S.run.omens = [null, null, 'eighthOmen'];
    sp.show('map');
  });
  await waitForMusicOwner(page, 'eighthOmen', cursor);
  await expect(page.locator('[data-a="sealed-door"]')).toBeVisible();

  cursor = await page.evaluate(() => window.__probe.behaviourTrace().lastSeq);
  // Map overlay repositions the door every frame — force past Playwright stability waits.
  await page.locator('[data-a="sealed-door"]').click({ force: true });
  await waitForMusicOwner(page, 'sealedDoor', cursor);
  expect(await page.evaluate(async () => (await import('/src/music.js')).currentCue())).toBe('sealedDoor');

  cursor = await page.evaluate(() => window.__probe.behaviourTrace().lastSeq);
  await page.locator('[data-a="close-door"]').click({ force: true });
  await waitForMusicOwner(page, 'eighthOmen', cursor);
  expect(await page.evaluate(async () => (await import('/src/music.js')).currentCue())).toBe('eighthOmen');
});

test('PR16 nominal boss victory holds its cue through reward and boss-relic navigation', async ({ page }) => {
  // Full-motion Rootheart death + reward/bossRelic nav regularly exceeds the
  // suite's 90s default under CI dual-worker load (victory cue itself is fine).
  test.setTimeout(120_000);
  await boot(page);
  let cursor = await page.evaluate(() => window.__probe.behaviourTrace().lastSeq);
  await startFight(page, ['rootheart'], 'boss');
  await waitForMusicOwner(page, 'act1Boss', cursor);
  cursor = await page.evaluate(() => window.__probe.behaviourTrace().lastSeq);
  const uid = await page.evaluate(() => {
    window.__probe.setEnemyHp(0, 1);
    window.__probe.setEnergy(3);
    return window.__probe.forceHand(['strike'])[0];
  });
  expect(await page.evaluate((cardUid) => window.__probe.play(cardUid, 0), uid)).toBe(true);
  await settle(page);
  await expect.poll(() => page.evaluate(() => window.spirebound.S.screen)).toBe('reward');
  await waitForMusicOwner(page, 'victory', cursor);
  expect(await page.evaluate(async () => (await import('/src/music.js')).currentCue())).toBe('victory');
  expect(await page.evaluate((after) => window.__probe.behaviourTrace().records
    .filter((record) => record.seq > after && record.eventName === 'audio.music-request')
    .map((record) => record.attributes.id), cursor)).toEqual(['victory']);

  cursor = await page.evaluate(() => window.__probe.behaviourTrace().lastSeq);
  await page.locator('[data-a="continue"]').click();
  await expect(page.locator('#overlay.open .ov-title')).toHaveText('Leave Rewards Behind?');
  await page.locator('#overlay [data-a="yes"]').click();
  await settle(page);
  await expect.poll(() => page.evaluate(() => window.spirebound.S.screen)).toBe('bossRelic');
  await page.waitForTimeout(100);
  expect(await page.evaluate((after) => window.__probe.behaviourTrace().records
    .filter((record) => record.seq > after && record.eventName === 'audio.music-request'), cursor)).toEqual([]);
  expect(await page.evaluate(async () => (await import('/src/music.js')).currentCue())).toBe('victory');
});

test('PR16 pending reward recovery holds the pre-navigation cue through boss relic', async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(() => window.spirebound && window.__probe);
  await page.evaluate(() => {
    localStorage.clear();
    const sp = window.spirebound;
    const run = sp.E.newRun(8821);
    sp.E.setPendingReward(run, 'boss', sp.E.genCombatRewards(run, 'boss'));
    if (!sp.E.saveRun(run)) throw new Error('pending reward cue fixture did not persist');
  });
  await page.reload();
  await page.waitForFunction(() => window.spirebound && window.__probe);
  await waitForMusicOwner(page, 'title', 0);
  const cursor = await page.evaluate(() => window.__probe.behaviourTrace().lastSeq);
  await page.locator('[data-a="continue"]').click();
  await settle(page);
  await expect.poll(() => page.evaluate(() => window.spirebound.S.screen)).toBe('reward');
  await page.locator('[data-a="continue"]').click();
  await expect(page.locator('#overlay.open .ov-title')).toHaveText('Leave Rewards Behind?');
  await page.locator('#overlay [data-a="yes"]').click();
  await settle(page);
  await expect.poll(() => page.evaluate(() => window.spirebound.S.screen)).toBe('bossRelic');
  await page.waitForTimeout(100);
  expect(await page.evaluate((after) => window.__probe.behaviourTrace().records
    .filter((record) => record.seq > after && record.eventName === 'audio.music-request'), cursor)).toEqual([]);
  expect(await page.evaluate(async () => (await import('/src/music.js')).currentCue())).toBe('title');
});

test('Task 13 gallery use strings and theme-configured warm graph', async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(() => window.__probe);
  const catalog = await page.evaluate(async () => {
    const { MUSIC_CATALOG } = await import('/src/audio-catalog.js');
    return Object.fromEntries(MUSIC_CATALOG.map((row) => [row.id, row.use]));
  });
  expect(catalog.act1Combat).toBe('Ashen Woods normal fights');
  expect(catalog.act1Boss).toBe('Ashen Woods boss — Rootheart');
  expect(catalog.act2Combat).toBe('Sunken City normal fights');
  expect(catalog.act2Boss).toBe('Sunken City boss — Leviathan');
  expect(catalog.act3Combat).toBe('Astral Court normal fights');
  expect(catalog.act3Boss).toBe('Astral Court boss — Eternal Sovereign');
  expect(catalog.sealedDoor).toBe('Sealed summit door / act4Reveal Dawn');
  expect(catalog.victory).toBe('Non-final boss ceremony and final run victory / end(won)');
  expect(Object.keys(catalog).filter((id) => /^act[123](Combat|Boss)$/.test(id)).sort()).toEqual([
    'act1Boss', 'act1Combat', 'act2Boss', 'act2Combat', 'act3Boss', 'act3Combat',
  ]);

  const fourGraph = await page.evaluate(async () => {
    const { configureThemeMusic, REGISTRY } = await import('/src/music.js');
    configureThemeMusic({
      themeOrder: ['t1', 't2', 't3', 't4'],
      themes: {
        t1: { music: { map: 'map', combat: 'paleOnes', boss: 'usurper', victory: 'victory' } },
        t2: { music: { map: 'map', combat: 'shadeDuel', boss: 'eighthOmen', victory: 'victory' } },
        t3: { music: { map: 'map', combat: 'hollowLamplighter', boss: 'sealedDoor', victory: 'victory' } },
        t4: { music: { map: 'map', combat: 'unreadablePage', boss: 'defeat', victory: 'victory' } },
      },
    });
    return {
      map: [...(REGISTRY.map.warmWith || [])],
      paleOnes: [...(REGISTRY.paleOnes.warmWith || [])],
      usurper: [...(REGISTRY.usurper.warmWith || [])],
      unreadablePage: [...(REGISTRY.unreadablePage.warmWith || [])],
      defeat: [...(REGISTRY.defeat.warmWith || [])],
    };
  });
  expect(fourGraph.map).toEqual(expect.arrayContaining(['paleOnes', 'safeNodes', 'elite', 'hollowLamplighter']));
  expect(fourGraph.paleOnes).toEqual(expect.arrayContaining(['usurper', 'map', 'elite']));
  expect(fourGraph.usurper).toEqual(expect.arrayContaining(['map', 'victory']));
  expect(fourGraph.unreadablePage).toEqual(expect.arrayContaining(['defeat', 'map', 'elite']));
  expect(fourGraph.defeat).toEqual(expect.arrayContaining(['title', 'vigil', 'victory', 'defeat']));

  await page.reload();
  await page.waitForFunction(() => window.__probe);
  const productionGraph = await page.evaluate(async () => {
    const { REGISTRY } = await import('/src/music.js');
    return Object.fromEntries(Object.entries(REGISTRY)
      .filter(([, entry]) => entry.warmWith)
      .map(([id, entry]) => [id, [...entry.warmWith]]));
  });
  expect(productionGraph.map).toEqual(['safeNodes', 'elite', 'hollowLamplighter', 'act1Combat']);
  expect(productionGraph.act1Combat).toEqual(['act1Boss', 'map', 'elite']);
  expect(productionGraph.act3Boss).toEqual(['victory', 'defeat']);
});
