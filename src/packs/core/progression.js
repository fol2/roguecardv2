// Core pack — progression authoring, quests, shades, variants (locale-free).
// Hollow target is materialised at assembly time (no getter survives).

export const coreProgressionAuthoring = {
  revealThresholds: {
    lamplighter: {
      runsPlayed: 1,
    },
    phials: {
      runsPlayed: 2,
    },
    omens: {
      runsPlayed: 3,
    },
    poolWave2: {
      runsPlayed: 2,
    },
    poolWave3: {
      runsPlayed: 4,
    },
    poolFull: {
      runsPlayed: 6,
    },
    emberglass: {
      wins: 1,
    },
    act4: {
      shards: 6,
    },
  },
  poolWaves: {
    define: {
      poolWave2: {
        cards: [
          "executioner",
          "momentum",
          "toxicMist",
          "regrowth",
          "bloodRite",
          "devour",
          "annihilate",
          "limitBreak",
        ],
        relics: [
          "reapersBell",
          "seersOrb",
          "frozenCore",
        ],
      },
      poolWave3: {
        cards: [
          "offering",
          "catalyst",
        ],
        relics: [
          "executionersSeal",
        ],
      },
      poolFull: {
        cards: [
          "ascension",
          "frenzy",
          "virulence",
        ],
        relics: [
          "verdantBranch",
          "duskmirror",
        ],
      },
    },
    extend: {},
  },
  features: {
    emberglass: {
      armWins: [
        2,
        4,
        6,
        8,
        10,
      ],
      paleOnes: {
        lensAt: 3,
        completeAt: 9,
        hiddenPerRun: 1,
        markedAct1: 1,
        markedAct2Chance: 0.6,
      },
      ownShade: {
        minDeathAct: 1,
        completeAt: 3,
        tiers: [
          {
            hpMult: 1,
            dmgMult: 1,
            addStatuses: {},
            scale: 1.05,
          },
          {
            hpMult: 1.25,
            dmgMult: 1.15,
            addStatuses: {
              str: 1,
            },
            scale: 1.12,
          },
          {
            hpMult: 1.55,
            dmgMult: 1.3,
            addStatuses: {
              str: 2,
            },
            scale: 1.2,
          },
        ],
      },
      usurper: {
        minShopAct: 1,
        referencePurse: 260,
        priceMultiplier: 2.5,
        price: 650,
        completeAt: 1,
      },
      eighthOmen: {
        guaranteeRuns: 2,
        saveDueInMax: 2,
        recurrenceChance: 0.3333333333333333,
        completeAt: 1,
      },
      unreadablePage: {
        offerRewardOrdinal: 2,
        completeAt: 5,
      },
      hollowLamplighter: {
        appearanceChance: 0.2,
        pityEligibleRuns: 3,
        maxMeetingsPerRun: 1,
        completeAt: 5,
        emberDebt: 3,
        saveEmberDebtMax: 3,
        gold: 160,
        maxHp: 12,
        minMaxHpAfter: 30,
        finalHp: 1,
      },
      variantStats: {
        pale: {
          hpMult: 1.18,
          dmgMult: 1.1,
          addStatuses: {
            str: 1,
          },
        },
        usurper: {
          hpMult: 1.25,
          dmgMult: 1.15,
          addStatuses: {
            str: 2,
          },
        },
      },
    },
  },
};

export const QUEST_IDS = [
  "paleOnes",
  "ownShade",
  "usurper",
  "eighthOmen",
  "unreadablePage",
  "hollowLamplighter",
];

export function buildCoreQuests(progressionFeatures) {
  const eg = progressionFeatures.emberglass;
  return {
    paleOnes: { target: eg.paleOnes.completeAt },
    ownShade: { target: eg.ownShade.completeAt },
    usurper: { target: eg.usurper.completeAt },
    eighthOmen: { target: eg.eighthOmen.completeAt },
    unreadablePage: { target: eg.unreadablePage.completeAt },
    hollowLamplighter: {
      target: eg.hollowLamplighter.completeAt,
      meetings: [],
    },
  };
}

export const QUESTS = buildCoreQuests(coreProgressionAuthoring.features);

export const SHADE_KITS = {
  duskblade: {
    moves: {
      eclipse: {
        intent: "attack_debuff",
        dmg: 12,
        fx: [
          {
            who: "player",
            id: "vulnerable",
            n: 1,
          },
        ],
      },
      chisel: {
        intent: "attack_debuff",
        dmg: 8,
        fx: [
          {
            who: "player",
            id: "frail",
            n: 1,
          },
        ],
      },
      spark: {
        intent: "buff",
        block: 10,
        fx: [
          {
            who: "self",
            id: "str",
            n: 2,
          },
        ],
      },
    },
    ai: ({ turn }) => ['eclipse', 'chisel', 'spark'][(turn - 1) % 3],
  },
  ashwarden: {
    moves: {
      ashbite: {
        intent: "attack_debuff",
        dmg: 10,
        fx: [
          {
            who: "player",
            id: "poison",
            n: 2,
          },
        ],
      },
      smother: {
        intent: "attack_block",
        dmg: 6,
        block: 12,
      },
      ashfall: {
        intent: "debuff",
        fx: [
          {
            who: "player",
            id: "poison",
            n: 5,
          },
          {
            who: "player",
            id: "weak",
            n: 1,
          },
        ],
      },
    },
    ai: ({ turn }) => ['ashbite', 'smother', 'ashfall'][(turn - 1) % 3],
  },
};

const pale = coreProgressionAuthoring.features.emberglass.variantStats.pale;
const shadeTier = coreProgressionAuthoring.features.emberglass.ownShade.tiers;

export const VARIANTS = {
  paleDuskfang: {
    id: "paleDuskfang",
    base: "duskfang",
    tint: {
      hue: 165,
      saturation: 0.45,
      brightness: 1.18,
    },
    scale: 1.08,
    statMods: {
      hpMult: 1.18,
      dmgMult: 1.1,
      addStatuses: {
        str: 1,
      },
    },
    drop: {
      quest: "paleOnes",
      kind: "paleMote",
      n: 1,
    },
  },
  paleDrownedOne: {
    id: "paleDrownedOne",
    base: "drownedOne",
    tint: {
      hue: 120,
      saturation: 0.38,
      brightness: 1.2,
    },
    scale: 1.1,
    statMods: {
      hpMult: 1.18,
      dmgMult: 1.1,
      addStatuses: {
        str: 1,
      },
    },
    drop: {
      quest: "paleOnes",
      kind: "paleMote",
      n: 1,
    },
  },
  paleVoidWisp: {
    id: "paleVoidWisp",
    base: "voidWisp",
    tint: {
      hue: -90,
      saturation: 0.32,
      brightness: 1.25,
    },
    scale: 1.12,
    statMods: {
      hpMult: 1.18,
      dmgMult: 1.1,
      addStatuses: {
        str: 1,
      },
    },
    drop: {
      quest: "paleOnes",
      kind: "paleMote",
      n: 1,
    },
  },
  ownShade1: {
    id: "ownShade1",
    base: "hero",
    tint: {
      hue: 35,
      saturation: 0.25,
      brightness: 0.62,
    },
    scale: 1.05,
    statMods: {
      hpMult: 1,
      dmgMult: 1,
      addStatuses: {},
      scale: 1.05,
    },
    drop: {
      quest: "ownShade",
      kind: "shadeMemory",
      n: 1,
    },
  },
  ownShade2: {
    id: "ownShade2",
    base: "hero",
    tint: {
      hue: 20,
      saturation: 0.2,
      brightness: 0.55,
    },
    scale: 1.12,
    statMods: {
      hpMult: 1.25,
      dmgMult: 1.15,
      addStatuses: {
        str: 1,
      },
      scale: 1.12,
    },
    drop: {
      quest: "ownShade",
      kind: "shadeMemory",
      n: 1,
    },
  },
  ownShade3: {
    id: "ownShade3",
    base: "hero",
    tint: {
      hue: 0,
      saturation: 0.16,
      brightness: 0.48,
    },
    scale: 1.2,
    statMods: {
      hpMult: 1.55,
      dmgMult: 1.3,
      addStatuses: {
        str: 2,
      },
      scale: 1.2,
    },
    drop: {
      quest: "ownShade",
      kind: "shadeMemory",
      n: 1,
    },
  },
  usurpedSovereign: {
    id: "usurpedSovereign",
    base: "sovereign",
    tint: {
      hue: 105,
      saturation: 0.65,
      brightness: 1.08,
    },
    scale: 1.15,
    statMods: {
      hpMult: 1.25,
      dmgMult: 1.15,
      addStatuses: {
        str: 2,
      },
    },
    drop: {
      quest: "usurper",
      kind: "shard",
      n: 1,
    },
  },
};

// Re-bind pale / usurper / shade stat aliases from authoring (parity with monolith).
VARIANTS.paleDuskfang.statMods = pale;
VARIANTS.paleDrownedOne.statMods = pale;
VARIANTS.paleVoidWisp.statMods = pale;
VARIANTS.ownShade1.statMods = shadeTier[0];
VARIANTS.ownShade1.scale = shadeTier[0].scale;
VARIANTS.ownShade2.statMods = shadeTier[1];
VARIANTS.ownShade2.scale = shadeTier[1].scale;
VARIANTS.ownShade3.statMods = shadeTier[2];
VARIANTS.ownShade3.scale = shadeTier[2].scale;
VARIANTS.usurpedSovereign.statMods = coreProgressionAuthoring.features.emberglass.variantStats.usurper;

export function materialiseProgression(authoring) {
  return {
    revealThresholds: authoring.revealThresholds,
    poolWaves: Object.fromEntries(
      Object.entries(authoring.poolWaves.define || {}).map(([id, wave]) => [id, {
        cards: [...(wave.cards || [])],
        relics: [...(wave.relics || [])],
      }]),
    ),
    emberglass: authoring.features.emberglass,
  };
}
