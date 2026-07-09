// UI chrome layout — owned by the chrome editor (?bfuiedit=1 on the dev
// server), hand edits welcome: keep the shape, keep numbers finite.
// All values are STAGE px for their shape (see src/stage.js). Safe-area is
// baked into these numbers (no + var(--sa*) at apply-time).
// Conventions:
//   left / right — CSS edge anchors (exactly one of left|right per widget);
//                  for hand, left/right is offset from the centred fan box
//   bottom       — distance from stage bottom (combat chrome + hand)
//   top          — distance from stage top (omen + relics)
//   w / h        — optional box size (lantern, end-turn, piles)
//   scale        — uniform scale (1 = authored size); omen / relics / hand
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
    omen: { left: 16, top: 62, scale: 1 },
    relics: { left: 66, top: 62, scale: 1 },
    hand: { left: 0, bottom: -12, scale: 1 },
  },
  shapes: {
    'phone-portrait': {
      energy: { left: 5, bottom: 575 },
      lantern: { left: 5, bottom: 476, w: 78, h: 78 },
      endTurn: { right: 296, bottom: 359, w: 96, h: 96 },
      draw: { left: 317, bottom: 634, w: 68, h: 108 },
      discard: { right: 5, bottom: 526, w: 68, h: 108 },
      ashes: { right: 5, bottom: 418, w: 68, h: 108 },
      hud: { height: 47, scale: 1 },
      omen: { left: 10, top: 52, scale: 1 },
      relics: { left: 52, top: 52, scale: 1 },
      hand: { left: 0, bottom: -6, scale: 1 },
    },
    'phone-landscape': {
      energy: { left: 0, bottom: 133 },
      lantern: { left: 2, bottom: 236, w: 68, h: 68 },
      endTurn: { right: 0, bottom: 264, w: 84, h: 84 },
      draw: { left: 5, bottom: 5, w: 64, h: 102 },
      discard: { right: 5, bottom: 105, w: 64, h: 102 },
      ashes: { right: 5, bottom: 5, w: 64, h: 102 },
      hud: { height: 34, scale: 1 },
      omen: { left: 12, top: 40, scale: 1 },
      relics: { left: 56, top: 40, scale: 1 },
      hand: { left: 0, bottom: -33, scale: 1 },
    },
    'pad-portrait': {
      energy: { left: 6, bottom: 665 },
      lantern: { left: 10, bottom: 772, w: 94, h: 94 },
      endTurn: { right: 9, bottom: 654, w: 104, h: 104 },
      draw: { left: 0, bottom: 140, w: 96, h: 148 },
      discard: { right: 0, bottom: 140, w: 96, h: 148 },
      ashes: { right: 0, bottom: 0, w: 96, h: 148 },
    },
    'pad-landscape': {
      energy: { left: 0, bottom: 162 },
      lantern: { left: 18, bottom: 268, w: 104, h: 104 },
      endTurn: { right: 0, bottom: 163, w: 120, h: 120 },
    },
    'desktop-landscape': {
      energy: { left: 4, bottom: 161 },
      lantern: { left: 18, bottom: 267, w: 104, h: 104 },
      endTurn: { right: 7, bottom: 162, w: 120, h: 120 },
      draw: { left: 17, bottom: 14, w: 96, h: 148 },
    },
  },
};
