import { test, expect } from '@playwright/test';
import { execFileSync, spawn } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join } from 'node:path';
import { createServer } from 'node:net';

const productionPort = Number(process.env.SPIREBOUND_E2E_PORT ?? 5174);
const productionOutDir = join(tmpdir(), `spirebound-trace-production-${productionPort}`);
const productionOutDirName = `spirebound-trace-production-${productionPort}`;

test.afterAll(() => {
  if (basename(productionOutDir) !== productionOutDirName) {
    throw new Error('refusing to clean an unexpected production trace directory');
  }
  rmSync(productionOutDir, { recursive: true, force: true });
});

test('production server bundle uses the exact task-owned temporary directory', () => {
  expect(existsSync(productionOutDir)).toBe(true);
});

test('ordinary production build ignores the trace query', async ({ browser }) => {
  const capture = async (query) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const networkWrites = [];
    const nonResourceRequests = [];
    page.on('request', (request) => {
      if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method())) {
        networkWrites.push(`${request.method()} ${new URL(request.url()).pathname}`);
      }
      if (!['document', 'script', 'stylesheet', 'image', 'font'].includes(request.resourceType())) {
        nonResourceRequests.push(`${request.method()} ${new URL(request.url()).pathname}`);
      }
    });
    await page.addInitScript(() => {
    const original = Storage.prototype.setItem;
    window.__productionStorageWrites = [];
    Storage.prototype.setItem = function (key, value) {
      window.__productionStorageWrites.push(String(key));
      return original.call(this, key, value);
    };
    });
    await page.goto(`/${query}`);
    await page.waitForFunction(() => window.__probe);
    const result = await page.evaluate(() => ({
      trace: window.__probe.behaviourTrace(),
      storageWrites: window.__productionStorageWrites,
    }));
    await context.close();
    return { ...result, networkWrites, nonResourceRequests };
  };

  const baseline = await capture('');
  const traced = await capture('?trace=1');
  expect(traced.trace.enabled).toBe(false);
  expect(traced.trace.records).toEqual([]);
  expect(traced.trace.dropped).toBe(0);
  expect(traced.storageWrites).toEqual(baseline.storageWrites);
  expect(traced.networkWrites).toEqual(baseline.networkWrites);
  expect(traced.networkWrites).toEqual([]);
  expect(traced.nonResourceRequests).toEqual(baseline.nonResourceRequests);
});

test('QA-compiled production build honours the trace query', async ({ browser }) => {
  const outDir = mkdtempSync(join(tmpdir(), 'spirebound-trace-qa-'));
  const port = await new Promise((resolve, reject) => {
    const server = createServer();
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const selected = server.address().port;
      server.close(() => resolve(selected));
    });
  });
  let preview = null;
  try {
    execFileSync('npx', ['vite', 'build', '--outDir', outDir, '--emptyOutDir'], {
      cwd: process.cwd(),
      env: { ...process.env, VITE_QA_TRACE: '1' },
      stdio: 'ignore',
    });
    preview = spawn('npx', [
      'vite', 'preview', '--outDir', outDir, '--host', '127.0.0.1', '--port', String(port), '--strictPort',
    ], { cwd: process.cwd(), stdio: 'ignore' });
    const origin = `http://127.0.0.1:${port}`;
    await expect.poll(async () => fetch(origin).then((response) => response.ok).catch(() => false),
      { timeout: 20_000 }).toBe(true);
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(`${origin}/?trace=1`);
    await page.waitForFunction(() => window.__probe?.behaviourTrace);
    const trace = await page.evaluate(() => window.__probe.behaviourTrace());
    expect(trace.enabled).toBe(true);
    expect(trace.records.length).toBeGreaterThan(0);
    await context.close();
  } finally {
    preview?.kill('SIGTERM');
    rmSync(outDir, { recursive: true, force: true });
  }
});

test('production audio gallery is complete, read-only and never POSTs', async ({ page }) => {
  const posts = [];
  page.on('request', (request) => {
    if (request.method() === 'POST') posts.push(new URL(request.url()).pathname);
  });
  await page.goto('/?audio=1');
  await page.waitForSelector('.audio-gallery-mode');
  await expect(page.locator('.ag-row[data-kind="music"]')).toHaveCount(22);
  await expect(page.locator('.ag-row[data-kind="sfx"]')).toHaveCount(36);
  await expect(page.locator('.ag-source-read')).toHaveCount(58);
  await expect(page.locator(`.ag-editor, .ag-source, #ag-music-version, #ag-sfx-version,
    [data-a="save-audio"], [data-a="clear-overrides"]`)).toHaveCount(0);
  await page.locator('.ag-row[data-kind="sfx"][data-id="click"] .ag-preview').click();
  await page.locator('.ag-row[data-kind="music"][data-id="title"] .ag-preview').click();
  await page.locator('[data-a="stop"]').click();
  await page.waitForTimeout(100);
  expect(posts).toEqual([]);
});
