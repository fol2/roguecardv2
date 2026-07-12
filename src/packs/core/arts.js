// Core pack — lantern arts (locale-free).

export const ARTS = {
  flare: {
    glyph: "✹",
    tone: "#ff9a4d",
    cost: 3,
    effects: [
      {
        kind: "dmg",
        n: 7,
      },
      {
        kind: "status",
        who: "allEnemies",
        id: "poison",
        n: 2,
      },
    ],
  },
  mendglass: {
    glyph: "❋",
    tone: "#8fe8a0",
    cost: 4,
    effects: [
      {
        kind: "heal",
        n: 8,
      },
    ],
  },
  beacon: {
    glyph: "☀",
    tone: "#ffe9ac",
    cost: 2,
    effects: [
      {
        kind: "status",
        who: "self",
        id: "beacon",
        n: 1,
      },
    ],
  },
  emberveil: {
    glyph: "⛨",
    tone: "#8fd0ff",
    cost: 3,
    effects: [
      {
        kind: "block",
        n: 12,
      },
    ],
  },
  stoke: {
    glyph: "✦",
    tone: "#c99aff",
    cost: 4,
    effects: [
      {
        kind: "energy",
        n: 1,
      },
      {
        kind: "draw",
        n: 2,
      },
    ],
  },
  ashfall: {
    glyph: "☁",
    tone: "#d3f2a1",
    cost: 3,
    effects: [
      {
        kind: "status",
        who: "allEnemies",
        id: "poison",
        n: 3,
      },
      {
        kind: "block",
        n: 5,
      },
    ],
  },
};

