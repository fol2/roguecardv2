// Round 5 self-hosts every WOFF2 through src/ui/fonts.js — no @fontsource CSS
// import is loaded here, so the bundle never contains @font-face fallback CSS
// or third-party network URLs.
import './styles.css';
import './styles/round5-screens.css';
import './styles/round5-pe-layout-bridges.css';
import { initStage } from './stage.js';
import { initScene } from './scene3d.js';
import { initVfx } from './vfx.js';
import { initMesh } from './mesh.js';
import { initUI } from './ui.js';
import { loadAudioSelection } from './audio-assets.js';

const qs = new URLSearchParams(location.search);

// DEV-only route registry (imported for type/drift checking in tests).
// In production, import.meta.env.DEV is false, so this import does not execute.
let ROUTES = null;
if (import.meta.env.DEV) {
  ROUTES = (await import('./dev/routes.js')).ROUTES;
}

async function boot() {
  // Phase 1: Pre-audio shell routes (e.g., sim lab).
  if (import.meta.env.DEV && ROUTES) {
    for (const route of ROUTES) {
      if (route.kind === 'shell' && route.preAudio && qs.has(route.param)) {
        const module = await route.load();
        const init = module[route.exportName];
        await init();
        return;
      }
    }
  }

  // The host may replace this small JSON without rebuilding JS. Resolve it
  // before any title cue or SFX preload can cache the base selection.
  await loadAudioSelection();

  // Phase 2: Post-audio shell routes (lab, dashboard, contentedit, dev).
  if (import.meta.env.DEV && ROUTES) {
    for (const route of ROUTES) {
      if (route.kind === 'shell' && !route.preAudio && !route.exclusiveBoot && qs.has(route.param)) {
        const module = await route.load();
        const init = module[route.exportName];
        await init();
        return;
      }
    }
  }

  // Phase 3: Mutually-exclusive editors (charedit, vfxedit) that boot stage+mesh inside.
  let bootedAltEditor = false;
  if (import.meta.env.DEV && ROUTES) {
    for (const route of ROUTES) {
      if (route.kind === 'shell' && route.exclusiveBoot && qs.has(route.param)) {
        const module = await route.load();
        const init = module[route.exportName];
        init(); // Fire-and-forget (sync init)
        bootedAltEditor = true;
        break;
      }
    }
  }

  if (!bootedAltEditor) {
    // Normal game boot.
    initStage();
    initScene();
    initVfx();
    initMesh();
    await initUI();

    // Phase 4: Post-UI overlay editors (bfedit, bfuiedit).
    if (import.meta.env.DEV) {
      if (qs.has('bfedit')) {
        import('./dev/bf-editor.js').then((m) => m.initBfEditor());
      }
      if (qs.has('bfuiedit')) {
        import('./dev/bfui-editor.js').then((m) => m.initBfuiEditor());
      }
    }
  }
}

boot();
