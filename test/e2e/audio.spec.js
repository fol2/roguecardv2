// Runtime audio-selection gallery/backend controls (desktop dev tool).
import { test, expect } from '@playwright/test';

test.beforeEach(({}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'audio backend controls are desktop-only');
});

async function openAudioGallery(page) {
  await page.goto('/?audio=1&mesh=0');
  await page.waitForSelector('.audio-gallery-mode .ag-editor');
}

test('audio gallery exposes the selected complete v2 versions and every gameplay id', async ({ page }) => {
  await openAudioGallery(page);
  await expect(page.locator('.ag-row[data-kind="music"]')).toHaveCount(22);
  await expect(page.locator('.ag-row[data-kind="sfx"]')).toHaveCount(36);
  await expect(page.locator('#ag-music-version')).toHaveValue('stained-glass-v2');
  await expect(page.locator('#ag-sfx-version')).toHaveValue('ashglass-v2');
  await expect(page.locator('.ag-source')).toHaveCount(58);
  await expect(page.locator('.ag-config-errors')).toHaveCount(0);
});

test('per-file source choice posts selection metadata without audio binaries', async ({ page }) => {
  let payload = null;
  await page.route('**/__audio-save', async (route) => {
    payload = JSON.parse(route.request().postData());
    await route.fulfill({ json: { ok: true, reload: true } });
  });
  await openAudioGallery(page);
  await page.locator('.ag-source[data-source-kind="music"][data-source-id="title"]')
    .selectOption('stained-glass-v1/map.mp3');
  await page.locator('[data-a="save-audio"]').click();
  await expect.poll(() => payload).not.toBeNull();
  expect(payload).toEqual({
    music: { version: 'stained-glass-v2', overrides: { title: 'stained-glass-v1/map.mp3' } },
    sfx: { version: 'ashglass-v2', overrides: {} },
  });
  expect(JSON.stringify(payload)).not.toContain('data:audio');
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

test('a broken selected SFX file falls back once without retry churn', async ({ page }) => {
  let selectedRequests = 0;
  let baseRequests = 0;
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (url.pathname.includes('/ashglass-v2/hover.mp3') && !url.searchParams.has('url')) {
      selectedRequests++;
    }
    if (url.pathname.endsWith('/click.mp3') && !url.searchParams.has('url')) baseRequests++;
  });
  await page.addInitScript(() => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    const originalDecode = AudioContextClass.prototype.decodeAudioData;
    const originalCreateBufferSource = AudioContextClass.prototype.createBufferSource;
    window.__forcedSfxDecodeFailures = 0;
    window.__sfxBufferStarts = 0;
    AudioContextClass.prototype.decodeAudioData = function decodeAudioData(...args) {
      const bytes = new Uint8Array(args[0]);
      if (bytes.length === 4 && bytes[0] === 83 && bytes[1] === 66 && bytes[2] === 65 && bytes[3] === 68) {
        window.__forcedSfxDecodeFailures++;
        return Promise.reject(new DOMException('forced selected-SFX decode failure', 'EncodingError'));
      }
      return originalDecode.apply(this, args);
    };
    AudioContextClass.prototype.createBufferSource = function createBufferSource(...args) {
      const source = originalCreateBufferSource.apply(this, args);
      const originalStart = source.start;
      source.start = function start(...startArgs) {
        window.__sfxBufferStarts++;
        return originalStart.apply(this, startArgs);
      };
      return source;
    };
  });
  await page.route('**/audio-selection.json', (route) => route.fulfill({
    json: {
      music: { version: 'stained-glass-v1', overrides: {} },
      sfx: { version: 'ashglass-v1', overrides: { click: 'ashglass-v2/hover.mp3' } },
    },
  }));
  await page.route('**/ashglass-v2/hover.mp3*', (route) => {
    if (new URL(route.request().url()).searchParams.has('url')) return route.continue();
    return route.fulfill({ contentType: 'audio/mpeg', body: Buffer.from('SBAD') });
  });

  await openAudioGallery(page);
  const preview = page.locator('.ag-row[data-kind="sfx"][data-id="click"] .ag-preview');
  await preview.click();
  await expect.poll(() => page.evaluate(() => window.__forcedSfxDecodeFailures)).toBe(1);
  await page.waitForTimeout(250);
  expect(baseRequests).toBe(1);
  await preview.click();
  await page.waitForTimeout(250);
  expect(selectedRequests).toBe(1);
  expect(baseRequests).toBe(1);
  expect(await page.evaluate(() => window.__forcedSfxDecodeFailures)).toBe(1);
  expect(await page.evaluate(() => window.__sfxBufferStarts)).toBe(1);
});
