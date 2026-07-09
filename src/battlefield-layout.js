// Battlefield layout — owned by the battlefield editor (?bfedit=1 on the dev
// server), hand edits welcome: keep the shape, keep numbers finite.
// All values are STAGE px for their shape (see src/stage.js). Conventions:
//   x       — actor's horizontal CENTER
//   y       — hero lift from the ground line (+up, default 0); foes use slot.y
//   footX   — horizontal feet offset from the slot center (+right) — per-slot
//             only here; per-actor footX/footY/scale live in src/char-meta.js
//   footY   — feet offset from the ground line (art whose feet aren't at the
//             sprite's bottom edge), + is up — per-slot override; actor default
//             is char-meta
//   scale   — (per-actor) multiplies tier size — see src/char-meta.js
//   slot.s  — per-formation size multiplier (keeps wide lineups on-ledge)
//   slot.y  — per-formation lift from the ground line (+up, default 0)
//   slot.footX / slot.footY — optional per-slot overrides; fall back to char-meta
//   layers  — h: plate height; y: plate bottom offset from stage bottom (+up);
//             x: horizontal offset from centered (+right); zoom: image scale;
//             posX/posY: crop focus % (object-position); opacity;
//             drift: idle parallax amplitude px (0 = still).
//             Internal key "ledge" = the ground PNG plate (actN-ledge.png).
//   acts    — per-act overrides nested under base or shapes[shape] (0/1/2)
// Imports nothing; imported by src/battlefield.js only.

export const BF = {
  shared: {
    sizes: { normal: 185, elite: 230, boss: 280 },
    heroes: {},
    enemies: {},
  },
  base: {
    groundY: 232,
    ledgeLip: 14,
    hero: { x: 179, w: 190, h: 285 },
    slots: {
      1: [{ x: 980, s: 1 }],
      2: [{ x: 820, s: 1 }, { x: 1035, s: 1 }],
      3: [{ x: 698, y: 42, s: 1 }, { x: 845, y: -18, s: 1 }, { x: 996, y: 26, s: 1 }],
    },
    layers: {
      backdrop: { h: 640, y: 0, zoom: 1, posX: 50, opacity: 0.85 },
      mid: { h: 1000, y: 300, x: 100, zoom: 0.4, posX: 100, opacity: 0.95 },
      ledge: { h: 450, y: 0, zoom: 1, posX: 100, opacity: 1 },
    },
  },
  shapes: {
    'phone-portrait': {
      groundY: 250,
      hero: { x: 42, w: 80, h: 130 },
      slots: {
        1: [{ x: 300, s: 0.5, footX: 0, footY: 0 }],
        2: [{ x: 248, s: 0.65 }, { x: 349, s: 0.7 }],
        3: [{ x: 218, s: 0.5 }, { x: 298, y: 32, s: 0.5 }, { x: 357, s: 0.55 }],
      },
      layers: {
        backdrop: { h: 658, y: 315, x: 100, zoom: 0.9, posX: 50, opacity: 0.6, drift: 20 },
        mid: { h: 489, y: 315, zoom: 0.5, posX: 50, opacity: 0.95, drift: 5 },
        ledge: { h: 600, y: 0, zoom: 0.7, posX: 50, opacity: 1 },
      },
      acts: {
        1: {
          slots: {
            1: [{ x: 300, s: 0.5, footX: 0, footY: -30 }],
          },
          layers: {
            backdrop: { x: 0 },
            ledge: { h: 500, opacity: 0.6 },
          },
        },
        2: {
          layers: {
            backdrop: { h: 1000 },
            mid: { y: 260, x: -50 },
            ledge: { h: 450, opacity: 0.8 },
          },
        },
      },
    },
    'phone-landscape': {
      groundY: 132,
      hero: { x: 135, w: 100, h: 150 },
      slots: {
        1: [{ x: 730, s: 0.5, footX: -150, footY: -40 }],
        2: [{ x: 590, s: 0.62 }, { x: 730, s: 0.62 }],
        3: [{ x: 503, y: 19, s: 0.55 }, { x: 628, y: -2, s: 0.55 }, { x: 740, y: 19, s: 0.55 }],
      },
      layers: {
        backdrop: { h: 700, y: 150, zoom: 1, posX: 100, opacity: 0.85, drift: 20 },
        mid: { h: 600, y: 170, zoom: 0.4, posX: 100, opacity: 0.95, drift: 10 },
        ledge: { h: 275, y: 0, zoom: 1, posX: 50, opacity: 1 },
      },
      acts: {
        1: {
          groundY: 132,
          layers: {
            backdrop: { h: 1000, y: 180, zoom: 0.6, opacity: 0.6 },
            mid: { zoom: 0.5 },
            ledge: { h: 220, opacity: 0.7 },
          },
        },
        2: {
          groundY: 160,
          layers: {
            backdrop: { zoom: 0.8 },
            mid: { y: 160, x: -200 },
            ledge: { h: 200 },
          },
        },
      },
    },
    'pad-portrait': {
      groundY: 359,
      hero: { x: 102 },
      slots: {
        1: [{ x: 655, s: 1, footX: 0 }],
        2: [{ x: 505, s: 0.95 }, { x: 710, s: 1 }],
        3: [{ x: 410, y: 34, s: 0.85 }, { x: 560, y: -87, s: 0.85 }, { x: 730, y: 2, s: 0.9 }],
      },
      layers: {
        backdrop: { h: 920, y: 450, zoom: 0.8, posX: 50, opacity: 0.85, drift: 30 },
        mid: { h: 684, y: 430, x: 50, zoom: 0.6, posX: 50, opacity: 0.95, drift: 10 },
        ledge: { h: 400, y: 0, zoom: 1.5, posX: 50, opacity: 1 },
      },
      acts: {
        1: {
          layers: {
            backdrop: { opacity: 0.55 },
            mid: { y: 460 },
            ledge: { h: 400, zoom: 1.3, opacity: 0.6 },
          },
        },
        2: {
          layers: {
            backdrop: { h: 1600, opacity: 0.7 },
            mid: { y: 400, x: -150 },
            ledge: { h: 410, zoom: 1.2, opacity: 0.6 },
          },
        },
      },
    },
    'pad-landscape': {
      hero: { x: 200 },
      slots: {
        3: [{ x: 698, y: 42, s: 1 }, { x: 850, y: -18, s: 1 }, { x: 996, y: 26, s: 1 }],
      },
      layers: {
        backdrop: { y: 0, drift: 30 },
      },
      acts: {
        0: {
          layers: {
            backdrop: { y: 280 },
            mid: { y: 300, drift: 10 },
          },
        },
        1: {
          groundY: 220,
          layers: {
            backdrop: { h: 800, y: 280, x: -50, zoom: 0.9 },
            mid: { zoom: 0.5, drift: 10 },
            ledge: { h: 350, opacity: 0.7 },
          },
        },
        2: {
          layers: {
            backdrop: { h: 800, y: 300 },
            mid: { y: 200, x: -300, zoom: 0.5, drift: 10 },
            ledge: { h: 320, opacity: 0.9 },
          },
        },
      },
    },
    'desktop-landscape': {
      groundY: 216,
      hero: { x: 212 },
      slots: {
        1: [{ x: 1164, y: -16, s: 1 }],
        2: [{ x: 1066, y: 5, s: 1 }, { x: 1197, y: -39, s: 1 }],
        3: [{ x: 940, y: 17, s: 1 }, { x: 1095, y: -50, s: 1 }, { x: 1260, y: 22, s: 1 }],
      },
      layers: {
        backdrop: { h: 1527, y: 273, x: -42, zoom: 0.6 },
        mid: { h: 1000, y: 308, x: 189, zoom: 0.4, drift: 0 },
        ledge: { h: 480, y: 0, posY: 0 },
      },
      acts: {
        0: {
          layers: {
            backdrop: { h: 1000, y: 280, x: -100, zoom: 0.9, posX: 100, opacity: 0.7, drift: 30 },
            mid: { drift: 10 },
          },
        },
        1: {
          layers: {
            backdrop: { h: 1200, y: 250, x: -150, zoom: 0.8, posX: 100, opacity: 0.5, drift: 30 },
            mid: { y: 280, x: 100, zoom: 0.6, opacity: 0.9, drift: 10 },
            ledge: { h: 360, opacity: 0.4 },
          },
        },
        2: {
          layers: {
            backdrop: { h: 1100, y: 270, zoom: 1, drift: 30 },
            mid: { y: 200, x: -300, zoom: 0.5, drift: 15 },
            ledge: { h: 330, posX: 100, opacity: 0.8 },
          },
        },
      },
    },
  },
};
