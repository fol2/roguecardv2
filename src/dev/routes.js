// Dev-only route registry — Node-safe metadata for all dev tools.
// This file is importable in plain Node (no DOM/localStorage at top level).
// Registry entries drive src/main.js's standalone-shell chain and the dev hub.

const ROUTES = Object.freeze([
  // Shell routes (standalone tools, lazy-loaded)
  {
    id: 'sim',
    param: 'sim',
    label: 'Proving Grounds',
    description: 'Simulate runs and analyze statistics.',
    group: 'Simulation',
    kind: 'shell',
    exportName: 'initSimLab',
    load: () => import('./sim-lab.js'),
    preAudio: true, // Must load before loadAudioSelection()
  },
  {
    id: 'lab',
    param: 'lab',
    label: 'Content Lab',
    description: 'Build, test, and iterate on cards and relics.',
    group: 'Content',
    kind: 'shell',
    exportName: 'initLab',
    load: () => import('./lab.js'),
  },
  {
    id: 'dashboard',
    param: 'dashboard',
    label: 'Content doctor',
    description: 'Diagnose content registration and fixture issues.',
    group: 'Content',
    kind: 'shell',
    exportName: 'initDoctor',
    load: () => import('./doctor.js'),
  },
  {
    id: 'contentedit',
    param: 'contentedit',
    label: 'Content Manager',
    description: 'Register custom cards, relics, and enemies.',
    group: 'Content',
    kind: 'shell',
    exportName: 'initContentManager',
    load: () => import('./content-manager.js'),
  },
  {
    id: 'dev',
    param: 'dev',
    label: 'Dev Hub',
    description: 'Launcher and index of all dev tools.',
    group: null, // Hub entry, not listed in hub itself
    kind: 'shell',
    exportName: 'initDevShell',
    load: () => import('./hub.js'),
  },
  {
    id: 'charedit',
    param: 'charedit',
    label: 'Character editor',
    description: 'Design hero warps and float meshes.',
    group: 'Editors',
    kind: 'shell',
    exportName: 'initCharEditor',
    load: () => import('./char-editor.js'),
    exclusiveBoot: true, // boots stage+mesh inside the editor; skips normal boot
  },
  {
    id: 'vfxedit',
    param: 'vfxedit',
    label: 'VFX editor',
    description: 'Compose sprite and canvas effects.',
    group: 'Editors',
    kind: 'shell',
    exportName: 'initVfxEditor',
    load: () => import('./vfx-editor.js'),
    exclusiveBoot: true, // boots stage+mesh inside the editor; skips normal boot
  },

  // Overlay routes (post-boot injection, no load)
  {
    id: 'bfedit',
    param: 'bfedit',
    label: 'Battlefield editor',
    description: 'Position units and geometry on the battle stage.',
    group: 'Editors',
    kind: 'overlay',
  },
  {
    id: 'bfuiedit',
    param: 'bfuiedit',
    label: 'UI chrome editor',
    description: 'Edit energy, lantern, piles, and HUD layout.',
    group: 'Editors',
    kind: 'overlay',
  },

  // Screen routes (production UI screens, metadata only)
  {
    id: 'gallery',
    param: 'gallery',
    label: 'Art gallery',
    description: 'Review all card, relic, and enemy artwork.',
    group: 'Art & Audio',
    kind: 'screen',
  },
  {
    id: 'audio',
    param: 'audio',
    label: 'Audio gallery',
    description: 'Preview and select music and sound packs.',
    group: 'Art & Audio',
    kind: 'screen',
  },
]);

export { ROUTES };
