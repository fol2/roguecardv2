// Playwright visual-QA kit — see docs/superpowers/specs/2026-07-06-visualisation-hardening-polish-design.md §3.
// Suites (test/e2e): geometry (ground-line contract), battle (simulated fights,
// zero playback errors, dead-enemy invariants), visual (screenshot regression,
// baselines committed only after the §1/§2 fixes land), perf (fps gate),
// rewards (double-tap guard regression for treasure/events/boss relic).
// Runs against the dev server (reuses one already on 5174).
import { defineConfig, devices } from '@playwright/test';
import { e2eServerSettings } from './playwright-server.js';

const e2eServer = e2eServerSettings(process.env.SPIREBOUND_E2E_PORT);

// `test:e2e:main` sets SPIREBOUND_E2E_SUITE=main so duration-heavy peels stay
// out of the residual main matrix. Pixi/trace/screens/lab owned the remaining
// main wall-clock skew (~10m vs ~2m); run them via dedicated scripts.
// visual/leak/perf have their own CI jobs — grep-invert cannot filter by
// filename, so ignore them here.

const E2E_MAIN_PEEL = /(?:^|\/)(audio|battle|emberglass(?:-persistence)?|hollow-transaction|rewards|stage|pixi|trace|end-ceremony|p6-screens|presentation|lab|visual|leak|perf)\.spec\.js$/;
const e2eSuite = process.env.SPIREBOUND_E2E_SUITE;
const testIgnore = [/trace-production\.spec\.js/];
if (e2eSuite === 'main') testIgnore.push(E2E_MAIN_PEEL);

export default defineConfig({
  testDir: 'test/e2e',
  testIgnore,
  fullyParallel: true,
  // every page runs a full three.js scene + bloom; more than two at once
  // starves the GPU/CPU and turns real animation waits into false timeouts
  workers: 2,
  retries: 0, // flake must surface and be fixed, not retried away
  timeout: 90_000,
  reporter: [['list']],
  use: {
    baseURL: e2eServer.origin,
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
    // Per-suite maxDiffPixelRatio lives in test/e2e/visual-policy.js and is
    // passed explicitly into each toHaveScreenshot call. Do not put a numeric
    // maxDiffPixelRatio here — test_engine scans for that regression.
    toHaveScreenshot: {
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
    // Mutates src/ui-chrome-layout.js through the real /__bfui-save endpoint.
    // Not a dependency of desktop/portrait/landscape — nested under test:e2e:disk
    // with a fresh strict port after bfeditor-disk (never under --no-deps).
    {
      name: 'bfuieditor-disk',
      testMatch: /bfuieditor\.spec\.js/,
      grep: /Save writes ui-chrome-layout\.js to disk/,
      use: { viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 },
    },
    {
      name: 'content-manager-disk',
      testMatch: /content-manager\.spec\.js/,
      grep: /locale vs mechanics/,
      use: { viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 },
    },
    // the three layout regimes styles.css targets: desktop, ≤740px portrait,
    // ≤480px-height landscape. deviceScaleFactor pinned so baselines are CSS px.
    // desktop is a 16:9 window → the desktop-landscape (1458×820) stage.
    { name: 'desktop', dependencies: ['bfeditor-disk'], use: { viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 } },
    { name: 'portrait', dependencies: ['bfeditor-disk'], use: { viewport: { width: 375, height: 812 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true } },
    { name: 'landscape', dependencies: ['bfeditor-disk'], use: { viewport: { width: 812, height: 375 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true } },
    // Playwright patched WebKit + device descriptors — not Safari / Simulator.
    { name: 'iphone-webkit', use: { ...devices['iPhone 17 Pro'], browserName: 'webkit' } },
    { name: 'ipad-webkit', use: { ...devices['iPad Mini landscape'], browserName: 'webkit' } },
  ],
  webServer: {
    command: e2eServer.command,
    url: e2eServer.origin,
    reuseExistingServer: e2eServer.reuseExistingServer,
    timeout: 30_000,
  },
});
