// Core pack — event mechanics + hooks (locale-free).

export const EVENTS = {
  forgottenShrine: {
    glyph: "⛩",
    hue: 45,
    choices: [
      {
        ops: [
          {
            pickRemove: true,
          },
        ],
        sub: "Remove a card from your deck.",
      },
      {
        ops: [
          {
            gold: 90,
          },
          {
            addCard: "hex",
          },
        ],
        sub: "Gain 90 gold. Gain a Hex.",
      },
      {
        ops: [],
        sub: "",
      },
    ],
  },
  woundedKnight: {
    glyph: "⚔",
    hue: 210,
    choices: [
      {
        ops: [
          {
            hp: -8,
          },
          {
            addRelic: "random",
          },
        ],
        sub: "Lose 8 HP. He rewards you with a relic.",
      },
      {
        ops: [
          {
            gold: 65,
          },
          {
            addCard: "hex",
          },
        ],
        sub: "Gain 65 gold. Gain a Hex.",
      },
      {
        ops: [],
        sub: "",
      },
    ],
  },
  voidChest: {
    glyph: "▣",
    hue: 280,
    choices: [
      {
        ops: [
          {
            roll: [
              {
                p: 0.55,
                ops: [
                  {
                    addRelic: "random",
                  },
                ],
              },
              {
                p: 0.45,
                ops: [
                  {
                    hp: -12,
                  },
                ],
              },
            ],
          },
        ],
        sub: "It might hold a relic... or teeth.",
      },
      {
        ops: [],
        sub: "",
      },
    ],
  },
  emberFountain: {
    glyph: "❂",
    hue: 30,
    choices: [
      {
        ops: [
          {
            heal: 0.35,
          },
        ],
        sub: "Heal 35% of your Max HP.",
      },
      {
        ops: [
          {
            potion: "healing",
          },
        ],
        sub: "Gain a Phial of Dawn.",
      },
      {
        ops: [],
        sub: "",
      },
    ],
  },
  forge: {
    glyph: "⚒",
    hue: 15,
    choices: [
      {
        ops: [
          {
            pickUpgrade: true,
          },
        ],
        sub: "Upgrade a card.",
      },
      {
        ops: [],
        sub: "",
      },
    ],
  },
  gambler: {
    glyph: "⚄",
    hue: 50,
    choices: [
      {
        needGold: 40,
        ops: [
          {
            gold: -40,
          },
          {
            roll: [
              {
                id: 'win',
                p: 0.45,
                ops: [
                  {
                    gold: 110,
                  },
                ],
              },
              {
                id: 'lose',
                p: 0.55,
                ops: [],
              },
            ],
          },
        ],
        sub: "45% chance to win 110 gold.",
      },
      {
        ops: [],
        sub: "",
      },
    ],
  },
  mirror: {
    glyph: "◐",
    hue: 220,
    choices: [
      {
        ops: [
          {
            pickDuplicate: true,
          },
        ],
        sub: "Duplicate a card in your deck.",
      },
      {
        ops: [
          {
            hp: -6,
          },
          {
            pickRemove: true,
          },
        ],
        sub: "Lose 6 HP. Remove a card from your deck.",
      },
      {
        ops: [],
        sub: "",
      },
    ],
  },
  library: {
    glyph: "❦",
    hue: 190,
    choices: [
      {
        ops: [
          {
            pickCard: 5,
          },
        ],
        sub: "Choose 1 of 5 cards to add to your deck.",
      },
      {
        ops: [
          {
            heal: 0.2,
          },
        ],
        sub: "Heal 20% of your Max HP.",
      },
    ],
  },
  fleshTrader: {
    glyph: "♠",
    hue: 320,
    choices: [
      {
        ops: [
          {
            maxHp: -8,
          },
          {
            addRelic: "random",
          },
        ],
        sub: "Lose 8 Max HP. Gain a relic.",
      },
      {
        ops: [],
        sub: "",
      },
    ],
  },
  cursedIdol: {
    glyph: "☿",
    hue: 100,
    choices: [
      {
        ops: [
          {
            addRelic: "random",
          },
          {
            addCard: "hex",
          },
        ],
        sub: "Gain a relic. Gain a Hex.",
      },
      {
        ops: [],
        sub: "",
      },
    ],
  },
  ruinedCamp: {
    glyph: "⛺",
    hue: 35,
    choices: [
      {
        ops: [
          {
            heal: 0.15,
          },
        ],
        sub: "Heal 15% of your Max HP.",
      },
      {
        ops: [
          {
            gold: 45,
          },
          {
            potion: "random",
          },
        ],
        sub: "Gain 45 gold and a random potion.",
      },
    ],
  },
};

