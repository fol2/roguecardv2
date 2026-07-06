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

initStage(); // first: everything else sizes itself against the virtual stage
initScene();
initVfx();
initMesh();
initUI();
if (import.meta.env.DEV && new URLSearchParams(location.search).has('bfedit')) {
  import('./dev/bf-editor.js').then((m) => m.initBfEditor());
}
