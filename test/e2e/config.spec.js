import { test, expect } from '@playwright/test';
import { createServer } from 'node:net';
import { spawn } from 'node:child_process';
import { e2eServerSettings } from '../../playwright-server.js';

const listen = (server) => new Promise((resolve, reject) => {
  server.once('error', reject);
  server.listen(0, '127.0.0.1', () => {
    server.off('error', reject);
    resolve();
  });
});

const close = (server) => new Promise((resolve, reject) => {
  server.close((error) => error ? reject(error) : resolve());
});

const run = (command) => new Promise((resolve, reject) => {
  const child = spawn(command, {
    cwd: new URL('../..', import.meta.url),
    env: { ...process.env, FORCE_COLOR: '0', NO_COLOR: '1' },
    shell: true,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let output = '';
  child.stdout.on('data', (chunk) => { output += chunk; });
  child.stderr.on('data', (chunk) => { output += chunk; });
  child.once('error', reject);
  child.once('close', (code, signal) => resolve({ code, signal, output }));
});

test.beforeEach(() => {
  test.skip(test.info().project.name !== 'desktop', 'server configuration is shape-independent');
});

test('an explicit E2E port cannot reuse or hide an occupied server', async () => {
  const blocker = createServer();
  await listen(blocker);
  try {
    const { port } = blocker.address();
    const settings = e2eServerSettings(String(port));
    expect(settings.reuseExistingServer).toBe(false);
    expect(settings.origin).toBe(`http://127.0.0.1:${port}`);
    expect(settings.command).toContain(`--port ${port} --strictPort`);

    const attempt = await run(settings.command);
    expect(attempt.code).not.toBe(0);
    expect(attempt.signal).toBe(null);
    expect(attempt.output).toMatch(/Port .* is already in use/);
  } finally {
    await close(blocker);
  }
});

test('the default E2E server remains compatible with local development', () => {
  expect(e2eServerSettings(undefined)).toEqual({
    port: 5174,
    isolated: false,
    origin: 'http://localhost:5174',
    command: 'npm run dev',
    reuseExistingServer: true,
  });
});

for (const invalid of ['', '0', '65536', '1.5', '5174; echo unsafe']) {
  test(`invalid E2E port is rejected before launch — ${JSON.stringify(invalid)}`, () => {
    expect(() => e2eServerSettings(invalid)).toThrow('SPIREBOUND_E2E_PORT must be an integer from 1 to 65535');
  });
}
