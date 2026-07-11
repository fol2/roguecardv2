import { defineConfig } from '@playwright/test';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { e2eServerSettings } from './playwright-server.js';

const server = e2eServerSettings(process.env.SPIREBOUND_E2E_PORT);
const outDir = join(tmpdir(), `spirebound-trace-production-${server.port}`);
const quotedOutDir = JSON.stringify(outDir);

export default defineConfig({
  testDir: 'test/e2e',
  testMatch: /trace-production\.spec\.js/,
  testIgnore: [],
  workers: 1,
  retries: 0,
  timeout: 90_000,
  reporter: [['list']],
  use: { baseURL: server.origin },
  projects: [{ name: 'production', use: { viewport: { width: 1280, height: 720 } } }],
  webServer: {
    command: `cleanup(){ rm -rf -- ${quotedOutDir}; }; trap cleanup EXIT INT TERM; npx vite build --outDir ${quotedOutDir} --emptyOutDir && npx vite preview --outDir ${quotedOutDir} --host 127.0.0.1 --port ${server.port}`,
    url: server.origin,
    reuseExistingServer: false,
    timeout: 90_000,
  },
});
