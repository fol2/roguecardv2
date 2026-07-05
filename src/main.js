import '@fontsource/cinzel/500.css';
import '@fontsource/cinzel/700.css';
import '@fontsource/cinzel/800.css';
import '@fontsource/alegreya/400.css';
import '@fontsource/alegreya/500.css';
import '@fontsource/alegreya/700.css';
import './styles.css';
import { initScene } from './scene3d.js';
import { initVfx } from './vfx.js';
import { initMesh } from './mesh.js';
import { initUI } from './ui.js';

initScene();
initVfx();
initMesh();
initUI();
