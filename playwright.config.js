// Playwright visual-QA kit — see docs/superpowers/specs/2026-07-06-visualisation-hardening-polish-design.md §3.
// Suites (test/e2e): geometry (ground-line contract), battle (simulated fights,
// zero playback errors, dead-enemy invariants), visual (screenshot regression,
// baselines committed only after the §1/§2 fixes land), perf (fps gate),
// rewards (double-tap guard regression for treasure/events/boss relic).
// Runs against the dev server (reuses one already on 5174).
import { defineConfig } from '@playwright/test';

const DEFAULT_E2E_PORT = 5174;
const configuredPort = process.env.SPIREBOUND_E2E_PORT;
const portText = configuredPort ?? String(DEFAULT_E2E_PORT);

if (!/^\d{1,5}$/.test(portText)) {
  throw new Error('SPIREBOUND_E2E_PORT must be an integer from 1 to 65535');
}

const e2ePort = Number(portText);
if (e2ePort < 1 || e2ePort > 65535) {
  throw new Error('SPIREBOUND_E2E_PORT must be an integer from 1 to 65535');
}

const isolatedE2E = configuredPort !== undefined;
const e2eOrigin = isolatedE2E
  ? `http://127.0.0.1:${e2ePort}`
  : 'http://localhost:5174';
const e2eCommand = isolatedE2E
  ? `npm run dev -- --host 127.0.0.1 --port ${e2ePort} --strictPort`
  : 'npm run dev';

export default defineConfig({
  testDir: 'test/e2e',
  fullyParallel: true,
  // every page runs a full three.js scene + bloom; more than two at once
  // starves the GPU/CPU and turns real animation waits into false timeouts
  workers: 2,
  retries: 0, // flake must surface and be fixed, not retried away
  timeout: 90_000,
  reporter: [['list']],
  use: {
    baseURL: e2eOrigin,
    // tracing chokes on the WebGL-heavy page (corrupt zips + teardown hangs);
    // a failure screenshot is the useful artifact here
    trace: 'off',
    screenshot: 'only-on-failure',
    // real GPU for the three.js scene — software WebGL idles at ~14fps and
    // would make every animation wait and fps measurement meaningless
    // (measured: software 14fps idle vs Metal-backed 117fps idle)
    launchOptions: {
      args: process.platform === 'darwin'
        ? ['--use-angle=metal', '--use-gl=angle', '--enable-gpu']
        : ['--enable-gpu'],
    },
  },
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01,
      animations: 'disabled',
      caret: 'hide',
    },
  },
  projects: [
    // Mutates src/battlefield-layout.js through the real dev endpoint, so it
    // runs once before any other browser pages are connected to Vite.
    {
      name: 'bfeditor-disk',
      testMatch: /bfeditor\.spec\.js/,
      grep: /Save writes layout to disk/,
      use: { viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 },
    },
    // the three layout regimes styles.css targets: desktop, ≤740px portrait,
    // ≤480px-height landscape. deviceScaleFactor pinned so baselines are CSS px.
    // desktop is a 16:9 window → the desktop-landscape (1458×820) stage.
    { name: 'desktop', dependencies: ['bfeditor-disk'], use: { viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 } },
    { name: 'portrait', dependencies: ['bfeditor-disk'], use: { viewport: { width: 375, height: 812 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true } },
    { name: 'landscape', dependencies: ['bfeditor-disk'], use: { viewport: { width: 812, height: 375 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true } },
  ],
  webServer: {
    command: e2eCommand,
    url: e2eOrigin,
    reuseExistingServer: true,
    timeout: 30_000,
  },
});
