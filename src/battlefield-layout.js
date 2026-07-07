// Battlefield layout — owned by the battlefield editor (?bfedit=1 on the dev
// server), hand edits welcome: keep the shape, keep numbers finite.
// All values are STAGE px for their shape (see src/stage.js). Conventions:
//   x       — actor's horizontal CENTER
//   footY   — feet offset from the ground line (art whose feet aren't at the
//             sprite's bottom edge), + is up
//   scale   — multiplies the tier size (sizes.normal/elite/boss)
//   slot.s  — per-formation size multiplier (keeps wide lineups on-ledge)
//   slot.y  — per-formation lift from the ground line (+up, default 0)
//   layers  — h: plate height; y: plate bottom offset from stage bottom (+up);
//             x: horizontal offset from centered (+right); zoom: image scale;
//             posX/posY: crop focus % (object-position); opacity;
//             drift: idle parallax amplitude px (0 = still).
//             Internal key "ledge" = the ground PNG plate (actN-ledge.png).
// Imports nothing; imported by src/battlefield.js only.

export const BF = {
  shared: {
    sizes: { normal: 185, elite: 230, boss: 280 },
    heroes: {
      ashwarden: { scale: 1, footY: 0 },
      duskblade: { scale: 1, footY: -31 },
    },
    enemies: {
      abyssalKnight: { scale: 1.24, footY: 0 },
      alphaFang: { scale: 1.24, footY: 0 },
      ashAcolyte: { scale: 0.95, footY: 0 },
      chaosHound: { scale: 1.05, footY: 0 },
      deepmaw: { scale: 1.14, footY: 0 },
      drownedOne: { scale: 0.95, footY: 0 },
      duskfang: { scale: 0.95, footY: 0 },
      gloomslime: { scale: 0.95, footY: 0 },
      gravewarden: { scale: 1.19, footY: 0 },
      heraldOfEnd: { scale: 1.4, footY: 0 },
      leviathan: { scale: 1.45, footY: 0 },
      mirelurker: { scale: 0.9, footY: 0 },
      obsidianGolem: { scale: 1.24, footY: 0 },
      rootheart: { scale: 1.45, footY: 0 },
      shade: { scale: 0.95, footY: 0 },
      shellback: { scale: 1.09, footY: 0 },
      siren: { scale: 1.09, footY: 0 },
      sovereign: { scale: 1.45, footY: 0 },
      sporeling: { scale: 0.62, footY: 0 },
      starCultist: { scale: 1, footY: 0 },
      thornling: { scale: 0.81, footY: 0 },
      tidecaller: { scale: 1, footY: 0 },
      voidColossus: { scale: 1.45, footY: 0 },
      voidWisp: { scale: 0.67, footY: 0 },
      voltEel: { scale: 0.86, footY: 0 },
      watcherEye: { scale: 1, footY: 0 },
      waylayer: { scale: 0.9, footY: 0 },
    },
  },
  base: {
    groundY: 232,
    ledgeLip: 14,
    hero: { x: 179, w: 190, h: 285 },
    slots: {
      1: [{ x: 980, s: 1 }],
      2: [{ x: 820, s: 1 }, { x: 1035, s: 1 }],
      3: [{ x: 615, s: 1 }, { x: 825, s: 1 }, { x: 1035, s: 1 }],
    },
    layers: {
      backdrop: { h: 640, y: 0, zoom: 1, posX: 50, opacity: 0.85 },
      mid: { h: 476, y: 0, zoom: 1, posX: 50, opacity: 0.95 },
      ledge: { h: 246, y: 0, zoom: 1, posX: 50, opacity: 1 },
    },
  },
  shapes: {
    'phone-portrait': {
      groundY: 218,
      hero: { x: 68, w: 129, h: 193 },
      slots: {
        1: [{ x: 300, s: 1 }],
        2: [{ x: 225, s: 0.65 }, { x: 330, s: 0.7 }],
        3: [{ x: 190, s: 0.5 }, { x: 265, s: 0.5 }, { x: 340, s: 0.55 }],
      },
      layers: {
        backdrop: { h: 658, y: 0, zoom: 1, posX: 50, opacity: 0.85 },
        mid: { h: 489, y: 0, zoom: 1, posX: 50, opacity: 0.95 },
        ledge: { h: 232, y: 0, zoom: 1, posX: 50, opacity: 1 },
      },
    },
    'phone-landscape': {
      groundY: 132,
      hero: { x: 135, w: 125, h: 187 },
      slots: {
        1: [{ x: 730, s: 0.66 }],
        2: [{ x: 590, s: 0.62 }, { x: 730, s: 0.62 }],
        3: [{ x: 480, s: 0.55 }, { x: 610, s: 0.55 }, { x: 740, s: 0.55 }],
      },
      layers: {
        backdrop: { h: 304, y: 0, zoom: 1, posX: 50, opacity: 0.85 },
        mid: { h: 226, y: 0, zoom: 1, posX: 50, opacity: 0.95 },
        ledge: { h: 146, y: 0, zoom: 1, posX: 50, opacity: 1 },
      },
    },
    'pad-portrait': {
      groundY: 210,
      hero: { x: 136 },
      slots: {
        1: [{ x: 700, s: 1 }],
        2: [{ x: 505, s: 0.95 }, { x: 710, s: 1 }],
        3: [{ x: 420, s: 0.85 }, { x: 575, s: 0.85 }, { x: 730, s: 0.9 }],
      },
      layers: {
        backdrop: { h: 920, y: 0, zoom: 1, posX: 50, opacity: 0.85 },
        mid: { h: 684, y: 0, zoom: 1, posX: 50, opacity: 0.95 },
        ledge: { h: 224, y: 0, zoom: 1, posX: 50, opacity: 1 },
      },
    },
    'desktop-landscape': {
      groundY: 216,
      hero: { x: 212 },
      slots: {
        1: [{ x: 1164, y: -16, s: 1 }],
        2: [{ x: 1066, y: 5, s: 1 }, { x: 1197, y: -39, s: 1 }],
        3: [{ x: 940, y: 17, s: 1 }, { x: 1098, y: -50, s: 1 }, { x: 1254, s: 1 }],
      },
      layers: {
        backdrop: { h: 1527, y: 273, x: -42, zoom: 0.6 },
        mid: { h: 1000, y: 308, x: 189, zoom: 0.4 },
        ledge: { h: 484, y: 183 },
      },
    },
  },
};
