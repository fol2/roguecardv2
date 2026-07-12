// Core pack — three complete theme records (locale-free display).

export const THEMES = {
  act1: {
    legacyAct: {
      boss: "rootheart",
      theme: {
        sky: 791568,
        fog: 1254426,
        particles: 16752717,
        glow: 6750110,
        accent: "#7ddb8f",
        ember: "#ff9a4d",
      },
    },
    plates: {
      backdrop: "act1-backdrop",
      mid: "act1-mid",
      ledge: "act1-ledge",
    },
    atmosphere: "ash",
    weather: {
      rate: 1,
      colors: [
        "#b8b0a0",
        "#8a8378",
      ],
      vx: [
        -6,
        6,
      ],
      vy: [
        10,
        26,
      ],
      size: [
        1.4,
        2.6,
      ],
      drift: 0.4,
      emberRate: 0.5,
    },
    palette: {
      tint: "good",
      glow: "gold",
      haze: "text-dim",
    },
    music: {
      map: "map",
      combat: "act1Combat",
      boss: "act1Boss",
      victory: "victory",
    },
    roster: {
      normal: [
        "sporeling",
        "duskfang",
        "gloomslime",
        "ashAcolyte",
        "waylayer",
        "thornling",
      ],
      elite: [
        "gravewarden",
        "alphaFang",
      ],
      boss: [
        "rootheart",
      ],
    },
    encounters: {
      weak: [
        [
          "sporeling",
          "sporeling",
        ],
        [
          "duskfang",
        ],
        [
          "gloomslime",
        ],
        [
          "sporeling",
          "sporeling",
          "sporeling",
        ],
      ],
      normal: [
        [
          "duskfang",
          "sporeling",
        ],
        [
          "ashAcolyte",
        ],
        [
          "waylayer",
        ],
        [
          "thornling",
          "thornling",
        ],
        [
          "gloomslime",
          "sporeling",
        ],
        [
          "duskfang",
          "duskfang",
        ],
        [
          "waylayer",
          "sporeling",
        ],
      ],
      elite: [
        [
          "gravewarden",
        ],
        [
          "alphaFang",
        ],
      ],
      boss: [
        [
          "rootheart",
        ],
      ],
    },
    rewardGold: {
      normal: [
        12,
        20,
      ],
      elite: [
        28,
        38,
      ],
      boss: [
        70,
        80,
      ],
    },
    mapHaze: "text-dim",
    lanternLights: [],
    bossPlates: {},
  },
  act2: {
    legacyAct: {
      boss: "leviathan",
      theme: {
        sky: 529440,
        fog: 860723,
        particles: 5499135,
        glow: 3127551,
        accent: "#5fd6e8",
        ember: "#53e8ff",
      },
    },
    plates: {
      backdrop: "act2-backdrop",
      mid: "act2-mid",
      ledge: "act2-ledge",
    },
    atmosphere: "mire",
    weather: {
      rate: 0.75,
      colors: [
        "#9fd4ff",
        "#cfe6ff",
      ],
      vx: [
        -4,
        4,
      ],
      vy: [
        8,
        18,
      ],
      size: [
        1.6,
        3,
      ],
      drift: 0.7,
      emberRate: 0.25,
    },
    palette: {
      tint: "atk",
      glow: "gold",
      haze: "text-dim",
    },
    music: {
      map: "map",
      combat: "act2Combat",
      boss: "act2Boss",
      victory: "victory",
    },
    roster: {
      normal: [
        "voltEel",
        "mirelurker",
        "drownedOne",
        "tidecaller",
        "shellback",
        "deepmaw",
      ],
      elite: [
        "abyssalKnight",
        "siren",
      ],
      boss: [
        "leviathan",
      ],
    },
    encounters: {
      weak: [
        [
          "voltEel",
        ],
        [
          "mirelurker",
        ],
        [
          "drownedOne",
        ],
      ],
      normal: [
        [
          "drownedOne",
          "voltEel",
        ],
        [
          "tidecaller",
          "mirelurker",
        ],
        [
          "shellback",
        ],
        [
          "deepmaw",
        ],
        [
          "drownedOne",
          "drownedOne",
        ],
        [
          "tidecaller",
          "voltEel",
        ],
        [
          "mirelurker",
          "mirelurker",
        ],
      ],
      elite: [
        [
          "abyssalKnight",
        ],
        [
          "siren",
        ],
      ],
      boss: [
        [
          "leviathan",
        ],
      ],
    },
    rewardGold: {
      normal: [
        18,
        28,
      ],
      elite: [
        35,
        48,
      ],
      boss: [
        85,
        100,
      ],
    },
    mapHaze: "text-dim",
    lanternLights: [],
    bossPlates: {},
  },
  act3: {
    legacyAct: {
      boss: "sovereign",
      theme: {
        sky: 1182238,
        fog: 1970736,
        particles: 12745727,
        glow: 16732120,
        accent: "#c99aff",
        ember: "#ff6fe0",
      },
    },
    plates: {
      backdrop: "act3-backdrop",
      mid: "act3-mid",
      ledge: "act3-ledge",
    },
    atmosphere: "astral",
    weather: {
      rate: 1.25,
      colors: [
        "#ff9a4d",
        "#ffd166",
      ],
      vx: [
        24,
        60,
      ],
      vy: [
        -18,
        -4,
      ],
      size: [
        1.4,
        2.4,
      ],
      drift: 1.1,
      emberRate: 0.9,
    },
    palette: {
      tint: "pwr",
      glow: "gold",
      haze: "text-dim",
    },
    music: {
      map: "map",
      combat: "act3Combat",
      boss: "act3Boss",
      victory: "victory",
    },
    roster: {
      normal: [
        "voidWisp",
        "shade",
        "starCultist",
        "obsidianGolem",
        "chaosHound",
        "watcherEye",
      ],
      elite: [
        "voidColossus",
        "heraldOfEnd",
      ],
      boss: [
        "sovereign",
      ],
    },
    encounters: {
      weak: [
        [
          "voidWisp",
          "voidWisp",
        ],
        [
          "shade",
        ],
        [
          "starCultist",
        ],
      ],
      normal: [
        [
          "obsidianGolem",
        ],
        [
          "shade",
          "voidWisp",
        ],
        [
          "chaosHound",
        ],
        [
          "watcherEye",
        ],
        [
          "starCultist",
          "voidWisp",
        ],
        [
          "shade",
          "shade",
        ],
        [
          "chaosHound",
          "voidWisp",
        ],
        [
          "watcherEye",
          "starCultist",
        ],
      ],
      elite: [
        [
          "voidColossus",
        ],
        [
          "heraldOfEnd",
        ],
      ],
      boss: [
        [
          "sovereign",
        ],
      ],
    },
    rewardGold: {
      normal: [
        24,
        36,
      ],
      elite: [
        45,
        60,
      ],
      boss: [
        100,
        120,
      ],
    },
    mapHaze: "text-dim",
    lanternLights: [],
    bossPlates: {},
  },
};
