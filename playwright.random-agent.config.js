// CI/local constrained lane for the long multi-fight playback sweep. The
// ordinary battle cases still exercise full motion under the base config.
import { defineConfig } from '@playwright/test';
import base from './playwright.config.js';

const desktop = base.projects.find((project) => project.name === 'desktop');
if (!desktop) throw new Error('base Playwright config has no desktop project');

export default defineConfig({
  ...base,
  workers: 1,
  use: { ...base.use, reducedMotion: 'reduce' },
  projects: [{
    ...desktop,
    dependencies: [],
    use: { ...desktop.use, reducedMotion: 'reduce' },
  }],
});
