// Core pack — omens + affixes (locale-free).

export const OMENS = {
  eighthOmen: {
    glyph: null,
    tone: "#e8e0ff",
    mods: {
      allCombatsAffixed: true,
    },
  },
  ashfall: {
    glyph: "☁",
    tone: "#d3f2a1",
    mods: {
      enemyStartStatus: {
        poison: 2,
      },
      playerHitApplies: {
        poison: 1,
      },
    },
  },
  heavyAir: {
    glyph: "☗",
    tone: "#8fd0ff",
    mods: {
      wardMult: 1.25,
    },
  },
  thinGlass: {
    glyph: "◬",
    tone: "#dfeaff",
    mods: {
      facetDelta: -1,
      enemyDmgBonus: 2,
    },
  },
  hungryDark: {
    glyph: "☾",
    tone: "#c99aff",
    mods: {
      shopMult: 1.25,
      rewardChoiceBonus: 1,
    },
  },
  emberWind: {
    glyph: "✦",
    tone: "#ff9a4d",
    mods: {
      startEmbers: 2,
      drawDelta: -1,
    },
  },
  longNight: {
    glyph: "★",
    tone: "#b18cff",
    mods: {
      hpMult: 1.12,
      goldMult: 1.4,
    },
  },
  waningMoon: {
    glyph: "◐",
    tone: "#ffe9ac",
    mods: {
      firstCardDiscount: 1,
      restHealFrac: 0.2,
    },
  },
};

export const AFFIXES = {
  vitrified: {
    tone: "#8fd0ff",
    mods: {
      facetDelta: 2,
      hpMult: 1.15,
    },
  },
  cinderVeined: {
    tone: "#ff9a4d",
    mods: {
      attackApplies: {
        poison: 1,
      },
    },
  },
  adamant: {
    tone: "#d8c27a",
    mods: {
      adamant: true,
    },
  },
  emberFat: {
    tone: "#ffe9ac",
    mods: {
      goldMult: 2,
    },
  },
  veiled: {
    tone: "#9aa7b8",
    mods: {
      startBlock: 15,
    },
  },
  fervent: {
    tone: "#ff8d8d",
    mods: {
      startStatus: {
        str: 2,
      },
    },
  },
};

