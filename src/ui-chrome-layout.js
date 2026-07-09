// UI chrome layout — owned by the chrome editor (?bfuiedit=1 on the dev
// server), hand edits welcome: keep the shape, keep numbers finite.
// All values are STAGE px for their shape (see src/stage.js). Safe-area is
// baked into these numbers (no + var(--sa*) at apply-time).
// Conventions:
//   left / right — CSS edge anchors (exactly one of left|right per widget)
//   bottom       — distance from stage bottom
//   w / h        — optional box size (lantern, end-turn, piles)
//   hud.height   — .hud-bar content height unit
//   hud.scale    — uniform scale on .hud-bar (1 = authored size)
// Imports nothing; imported by src/uic.js only.

export const UIC = {
  base: {
    energy: { left: 24, bottom: 148 },
    lantern: { left: 42, bottom: 262, w: 104, h: 104 },
    endTurn: { right: 22, bottom: 128, w: 120, h: 120 },
    draw: { left: 16, bottom: 14, w: 96, h: 148 },
    discard: { right: 22, bottom: 14, w: 96, h: 148 },
    ashes: { right: 132, bottom: 14, w: 96, h: 148 },
    hud: { height: 56, scale: 1 },
  },
  shapes: {
    'phone-portrait': {
      energy: { left: 3, bottom: 118 },
      lantern: { left: 7, bottom: 62, w: 78, h: 78 },
      endTurn: { right: 3, bottom: 88, w: 96, h: 96 },
      draw: { left: 4, bottom: 4, w: 68, h: 108 },
      discard: { right: 4, bottom: 4, w: 68, h: 108 },
      ashes: { right: 4, bottom: 120, w: 68, h: 108 },
      hud: { height: 47, scale: 1 },
    },
    'phone-landscape': {
      energy: { left: 8, bottom: 56 },
      lantern: { left: 62, bottom: 66, w: 68, h: 68 },
      endTurn: { right: 6, bottom: 40, w: 84, h: 84 },
      draw: { left: 6, bottom: 4, w: 64, h: 102 },
      discard: { right: 6, bottom: 4, w: 64, h: 102 },
      ashes: { right: 78, bottom: 4, w: 64, h: 102 },
      hud: { height: 42, scale: 1 },
    },
    'pad-portrait': {
      energy: { left: 16, bottom: 128 },
      lantern: { left: 28, bottom: 222, w: 94, h: 94 },
      endTurn: { right: 16, bottom: 106, w: 104, h: 104 },
    },
    'pad-landscape': {},
    'desktop-landscape': {},
  },
};
