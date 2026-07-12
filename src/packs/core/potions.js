// Core pack — potion mechanics (locale-free).

export const POTIONS = {
  healing: {
    tone: "#ff6b81",
    glyph: "♥",
    combatOnly: false,
  },
  strength: {
    tone: "#ff8c5a",
    glyph: "⚔",
    combatOnly: true,
  },
  swift: {
    tone: "#8fd0ff",
    glyph: "»",
    combatOnly: true,
  },
  block: {
    tone: "#9aa7b8",
    glyph: "☗",
    combatOnly: true,
  },
  fire: {
    tone: "#ffd166",
    glyph: "✹",
    combatOnly: true,
    needsTarget: true,
  },
  venom: {
    tone: "#a3e06c",
    glyph: "☠",
    combatOnly: true,
    needsTarget: true,
  },
  energy: {
    tone: "#ff9a4d",
    glyph: "✦",
    combatOnly: true,
  },
};

