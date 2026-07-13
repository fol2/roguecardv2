import '@fontsource/cinzel/500.css';
import '@fontsource/cinzel/700.css';
import '@fontsource/cinzel/800.css';
import '@fontsource/alegreya/400.css';
import '@fontsource/alegreya/500.css';
import '@fontsource/alegreya/700.css';
import './styles.css';
import { initStage } from './stage.js';
import { initScene } from './scene3d.js';
import { initVfx } from './vfx.js';
import { initMesh } from './mesh.js';
import { initUI } from './ui.js';
import { loadAudioSelection } from './audio-assets.js';

const qs = new URLSearchParams(location.search);
async function boot() {
  // The host may replace this small JSON without rebuilding JS. Resolve it
  // before any title cue or SFX preload can cache the base selection.
  await loadAudioSelection();
  if (import.meta.env.DEV && qs.has('lab')) {
    const { initLab } = await import('./ui/dev/lab.js');
    await initLab();
    return;
  }
  if (import.meta.env.DEV && qs.has('dashboard')) {
    const { initDoctor } = await import('./ui/dev/doctor.js');
    await initDoctor();
    return;
  }
  if (import.meta.env.DEV && qs.has('contentedit')) {
    const { initContentManager } = await import('./ui/dev/content-manager.js');
    await initContentManager();
    return;
  }
  if (import.meta.env.DEV && qs.has('dev')) {
    const { initDevShell } = await import('./ui/dev/shell.js');
    await initDevShell();
    return;
  }
  if (import.meta.env.DEV && qs.has('charedit')) {
    // stage + mesh boot inside the editor so warp/float match combat
    import('./dev/char-editor.js').then((m) => m.initCharEditor());
  } else if (import.meta.env.DEV && qs.has('vfxedit')) {
    import('./dev/vfx-editor.js').then((m) => m.initVfxEditor());
  } else {
    initStage();
    initScene();
    initVfx();
    initMesh();
    initUI();
    if (import.meta.env.DEV && qs.has('bfedit')) {
      import('./dev/bf-editor.js').then((m) => m.initBfEditor());
    }
    if (import.meta.env.DEV && qs.has('bfuiedit')) {
      import('./dev/bfui-editor.js').then((m) => m.initBfuiEditor());
    }
  }
}

boot();
