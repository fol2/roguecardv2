// Playwright visual-QA kit — see docs/superpowers/specs/2026-07-06-visualisation-hardening-polish-design.md §3.
// Suites (test/e2e): geometry (ground-line contract), battle (simulated fights,
// zero playback errors, dead-enemy invariants), visual (screenshot regression,
// baselines committed only after the §1/§2 fixes land), perf (fps gate).
// Runs against the dev server (reuses one already on 5174).
import { defineConfig } from '@playwright/test';

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
    baseURL: 'http://localhost:5174',
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
    // the three layout regimes styles.css targets: desktop, ≤740px portrait,
    // ≤480px-height landscape. deviceScaleFactor pinned so baselines are CSS px.
    { name: 'desktop', use: { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 } },
    { name: 'portrait', use: { viewport: { width: 375, height: 812 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true } },
    { name: 'landscape', use: { viewport: { width: 812, height: 375 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5174',
    reuseExistingServer: true,
    timeout: 30_000,
  },
});
