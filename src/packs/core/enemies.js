// Core pack — enemy mechanics + AI (locale-free move names).

export const ENEMIES = {
  sporeling: {
    hp: [
      13,
      17,
    ],
    facets: 3,
    art: {
      kind: "wisp",
      hue: 95,
      size: 0.72,
    },
    moves: {
      spit: {
        intent: "attack",
        dmg: 4,
      },
      grow: {
        intent: "buff",
        fx: [
          {
            who: "self",
            id: "str",
            n: 1,
          },
        ],
      },
    },
    ai: ({ turn }) => (turn % 3 === 2 ? 'grow' : 'spit'),
  },
  duskfang: {
    hp: [
      26,
      30,
    ],
    art: {
      kind: "beast",
      hue: 22,
      size: 1,
    },
    moves: {
      howl: {
        intent: "buff",
        fx: [
          {
            who: "self",
            id: "str",
            n: 2,
          },
        ],
      },
      bite: {
        intent: "attack",
        dmg: 7,
      },
      rend: {
        intent: "attack",
        dmg: 4,
        times: 2,
      },
    },
    ai: ({ turn, last, rng }) => {
      if (turn === 1) return 'howl';
      if (last !== 'howl' && rng() < 0.18) return 'howl';
      return last === 'bite' ? 'rend' : 'bite';
    },
  },
  gloomslime: {
    hp: [
      30,
      34,
    ],
    art: {
      kind: "slime",
      hue: 150,
      size: 1,
    },
    moves: {
      slam: {
        intent: "attack",
        dmg: 8,
      },
      ooze: {
        intent: "attack_debuff",
        dmg: 3,
        fx: [
          {
            who: "player",
            id: "weak",
            n: 2,
          },
        ],
      },
      harden: {
        intent: "attack_block",
        dmg: 4,
        block: 6,
      },
    },
    ai: ({ turn }) => ['ooze', 'slam', 'harden'][(turn - 1) % 3],
  },
  waylayer: {
    hp: [
      28,
      32,
    ],
    art: {
      kind: "rogue",
      hue: 0,
      size: 0.95,
    },
    moves: {
      stab: {
        intent: "attack",
        dmg: 9,
      },
      smoke: {
        intent: "block",
        block: 8,
      },
      trick: {
        intent: "attack_debuff",
        dmg: 4,
        fx: [
          {
            who: "player",
            id: "frail",
            n: 2,
          },
        ],
      },
    },
    ai: ({ turn, rng }) => (turn === 1 ? 'trick' : rng() < 0.55 ? 'stab' : rng() < 0.5 ? 'smoke' : 'trick'),
  },
  thornling: {
    hp: [
      18,
      22,
    ],
    facets: 3,
    art: {
      kind: "plant",
      hue: 80,
      size: 0.85,
    },
    startStatus: {
      thorns: 2,
    },
    moves: {
      prick: {
        intent: "attack",
        dmg: 6,
      },
      bristle: {
        intent: "buff",
        fx: [
          {
            who: "self",
            id: "thorns",
            n: 2,
          },
        ],
      },
      burst: {
        intent: "attack",
        dmg: 10,
      },
    },
    ai: ({ turn }) => (turn % 4 === 0 ? 'burst' : turn % 2 === 1 ? 'prick' : 'bristle'),
  },
  ashAcolyte: {
    hp: [
      34,
      38,
    ],
    art: {
      kind: "cultist",
      hue: 28,
      size: 1,
    },
    moves: {
      ritual: {
        intent: "buff",
        fx: [
          {
            who: "self",
            id: "ritual",
            n: 2,
          },
        ],
      },
      scorch: {
        intent: "attack",
        dmg: 6,
      },
    },
    ai: ({ turn }) => (turn === 1 ? 'ritual' : 'scorch'),
  },
  gravewarden: {
    hp: [
      70,
      76,
    ],
    elite: true,
    art: {
      kind: "golem",
      hue: 210,
      size: 1.25,
    },
    moves: {
      crush: {
        intent: "attack",
        dmg: 12,
      },
      entomb: {
        intent: "debuff",
        fx: [
          {
            who: "player",
            id: "frail",
            n: 2,
          },
          {
            who: "player",
            id: "vulnerable",
            n: 2,
          },
        ],
      },
      bulwark: {
        intent: "attack_block",
        dmg: 6,
        block: 12,
      },
    },
    ai: ({ turn }) => ['entomb', 'crush', 'bulwark', 'crush'][(turn - 1) % 4],
  },
  alphaFang: {
    hp: [
      64,
      70,
    ],
    elite: true,
    art: {
      kind: "beast",
      hue: 350,
      size: 1.3,
    },
    moves: {
      howl: {
        intent: "buff",
        fx: [
          {
            who: "self",
            id: "str",
            n: 3,
          },
        ],
      },
      savage: {
        intent: "attack",
        dmg: 5,
        times: 2,
      },
      throat: {
        intent: "attack",
        dmg: 13,
      },
    },
    ai: ({ turn, last }) => (turn === 1 || turn % 4 === 0 ? 'howl' : last === 'savage' ? 'throat' : 'savage'),
  },
  rootheart: {
    hp: [
      150,
      150,
    ],
    boss: true,
    art: {
      kind: "treeboss",
      hue: 100,
      size: 1.6,
    },
    moves: {
      awaken: {
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
      lash: {
        intent: "attack",
        dmg: 12,
      },
      spores: {
        intent: "attack_debuff",
        dmg: 5,
        fx: [
          {
            who: "player",
            id: "poison",
            n: 4,
          },
          {
            who: "player",
            id: "weak",
            n: 2,
          },
        ],
      },
      entangle: {
        intent: "attack_debuff",
        dmg: 7,
        addCards: {
          id: "wound",
          n: 2,
        },
      },
      slam: {
        intent: "attack",
        dmg: 22,
      },
    },
    ai: ({ turn }) => (turn === 1 ? 'awaken' : turn % 4 === 0 ? 'slam' : ['lash', 'spores', 'entangle'][(turn - 2) % 3]),
  },
  drownedOne: {
    hp: [
      38,
      44,
    ],
    art: {
      kind: "zombie",
      hue: 185,
      size: 1,
    },
    moves: {
      claw: {
        intent: "attack",
        dmg: 11,
      },
      frenzy: {
        intent: "attack",
        dmg: 4,
        times: 3,
      },
      gurgle: {
        intent: "attack_debuff",
        dmg: 5,
        fx: [
          {
            who: "player",
            id: "weak",
            n: 2,
          },
        ],
      },
    },
    ai: ({ hpFrac, last, rng }) => (hpFrac < 0.5 && last !== 'frenzy' ? 'frenzy' : rng() < 0.6 ? 'claw' : 'gurgle'),
  },
  voltEel: {
    hp: [
      30,
      36,
    ],
    art: {
      kind: "serpent",
      hue: 190,
      size: 0.9,
    },
    moves: {
      shock: {
        intent: "attack_block",
        dmg: 7,
        block: 5,
      },
      discharge: {
        intent: "attack",
        dmg: 12,
      },
      coil: {
        intent: "buff",
        block: 8,
        fx: [
          {
            who: "self",
            id: "str",
            n: 1,
          },
        ],
      },
    },
    ai: ({ turn }) => ['shock', 'coil', 'discharge'][(turn - 1) % 3],
  },
  mirelurker: {
    hp: [
      34,
      40,
    ],
    art: {
      kind: "crawler",
      hue: 160,
      size: 0.95,
    },
    moves: {
      sting: {
        intent: "attack_debuff",
        dmg: 6,
        fx: [
          {
            who: "player",
            id: "poison",
            n: 3,
          },
        ],
      },
      burrow: {
        intent: "block",
        block: 10,
      },
      barb: {
        intent: "attack",
        dmg: 9,
      },
    },
    ai: ({ turn, rng }) => (turn % 3 === 0 ? 'burrow' : rng() < 0.55 ? 'sting' : 'barb'),
  },
  tidecaller: {
    hp: [
      42,
      48,
    ],
    art: {
      kind: "cultist",
      hue: 195,
      size: 1.05,
    },
    moves: {
      surge: {
        intent: "buff",
        fx: [
          {
            who: "allies",
            id: "str",
            n: 2,
          },
        ],
      },
      bolt: {
        intent: "attack",
        dmg: 9,
      },
      undertow: {
        intent: "attack_debuff",
        dmg: 4,
        fx: [
          {
            who: "player",
            id: "frail",
            n: 2,
          },
        ],
      },
    },
    ai: ({ turn }) => (turn === 1 ? 'surge' : turn % 3 === 0 ? 'undertow' : 'bolt'),
  },
  shellback: {
    hp: [
      50,
      56,
    ],
    art: {
      kind: "crab",
      hue: 15,
      size: 1.15,
    },
    moves: {
      snap: {
        intent: "attack",
        dmg: 10,
      },
      shell: {
        intent: "block",
        block: 13,
        fx: [
          {
            who: "self",
            id: "thorns",
            n: 1,
          },
        ],
      },
      jet: {
        intent: "attack",
        dmg: 6,
        times: 2,
      },
    },
    ai: ({ turn }) => ['snap', 'shell', 'jet', 'shell'][(turn - 1) % 4],
  },
  deepmaw: {
    hp: [
      54,
      60,
    ],
    art: {
      kind: "maw",
      hue: 200,
      size: 1.2,
    },
    moves: {
      bite: {
        intent: "attack",
        dmg: 14,
      },
      lure: {
        intent: "debuff",
        fx: [
          {
            who: "player",
            id: "vulnerable",
            n: 2,
          },
        ],
      },
      swallow: {
        intent: "attack_buff",
        dmg: 8,
        heal: 8,
      },
    },
    ai: ({ turn }) => ['lure', 'bite', 'swallow'][(turn - 1) % 3],
  },
  abyssalKnight: {
    hp: [
      108,
      116,
    ],
    elite: true,
    art: {
      kind: "knight",
      hue: 215,
      size: 1.3,
    },
    moves: {
      blade: {
        intent: "attack",
        dmg: 15,
      },
      oath: {
        intent: "buff",
        block: 14,
        fx: [
          {
            who: "self",
            id: "str",
            n: 2,
          },
        ],
      },
      condemn: {
        intent: "debuff",
        fx: [
          {
            who: "player",
            id: "vulnerable",
            n: 2,
          },
          {
            who: "player",
            id: "weak",
            n: 2,
          },
        ],
      },
      execute: {
        intent: "attack",
        dmg: 9,
        times: 2,
      },
    },
    ai: ({ turn }) => ['condemn', 'blade', 'oath', 'execute'][(turn - 1) % 4],
  },
  siren: {
    hp: [
      92,
      100,
    ],
    elite: true,
    art: {
      kind: "siren",
      hue: 280,
      size: 1.15,
    },
    moves: {
      song: {
        intent: "debuff",
        fx: [
          {
            who: "player",
            id: "weak",
            n: 2,
          },
          {
            who: "player",
            id: "frail",
            n: 2,
          },
        ],
      },
      rend: {
        intent: "attack",
        dmg: 12,
      },
      mend: {
        intent: "heal",
        heal: 12,
        block: 6,
      },
      shriek: {
        intent: "attack",
        dmg: 7,
        times: 2,
      },
    },
    ai: ({ turn, hpFrac, last }) => {
      if (hpFrac < 0.55 && last !== 'mend') return 'mend';
      return ['song', 'rend', 'shriek'][(turn - 1) % 3];
    },
  },
  leviathan: {
    hp: [
      260,
      260,
    ],
    boss: true,
    art: {
      kind: "leviathan",
      hue: 195,
      size: 1.7,
    },
    moves: {
      tide: {
        intent: "buff",
        block: 15,
        fx: [
          {
            who: "self",
            id: "str",
            n: 1,
          },
        ],
      },
      crush: {
        intent: "attack",
        dmg: 17,
      },
      brine: {
        intent: "attack_debuff",
        dmg: 6,
        fx: [
          {
            who: "player",
            id: "poison",
            n: 5,
          },
          {
            who: "player",
            id: "weak",
            n: 2,
          },
        ],
      },
      consume: {
        intent: "heal",
        heal: 20,
        block: 10,
      },
      cataclysm: {
        intent: "attack",
        dmg: 30,
      },
    },
    ai: ({ turn }) => (turn === 1 ? 'tide' : turn % 4 === 0 ? 'cataclysm' : ['crush', 'brine', 'consume'][(turn - 2) % 3]),
  },
  voidWisp: {
    hp: [
      26,
      30,
    ],
    facets: 3,
    art: {
      kind: "wisp",
      hue: 275,
      size: 0.78,
    },
    moves: {
      zap: {
        intent: "attack",
        dmg: 7,
      },
      siphon: {
        intent: "attack_buff",
        dmg: 5,
        heal: 5,
      },
    },
    ai: ({ rng }) => (rng() < 0.6 ? 'zap' : 'siphon'),
  },
  obsidianGolem: {
    hp: [
      64,
      72,
    ],
    art: {
      kind: "golem",
      hue: 270,
      size: 1.3,
    },
    moves: {
      pound: {
        intent: "attack",
        dmg: 14,
      },
      harden: {
        intent: "block",
        block: 14,
      },
      quake: {
        intent: "attack_debuff",
        dmg: 10,
        fx: [
          {
            who: "player",
            id: "frail",
            n: 2,
          },
        ],
      },
    },
    ai: ({ turn }) => ['pound', 'harden', 'quake'][(turn - 1) % 3],
  },
  starCultist: {
    hp: [
      46,
      52,
    ],
    art: {
      kind: "cultist",
      hue: 290,
      size: 1.05,
    },
    moves: {
      ritual: {
        intent: "buff",
        fx: [
          {
            who: "self",
            id: "ritual",
            n: 3,
          },
        ],
      },
      scorch: {
        intent: "attack",
        dmg: 9,
      },
    },
    ai: ({ turn }) => (turn === 1 ? 'ritual' : 'scorch'),
  },
  shade: {
    hp: [
      42,
      48,
    ],
    art: {
      kind: "shade",
      hue: 260,
      size: 1,
    },
    moves: {
      slash: {
        intent: "attack",
        dmg: 6,
        times: 2,
      },
      gloom: {
        intent: "attack_debuff",
        dmg: 6,
        fx: [
          {
            who: "player",
            id: "weak",
            n: 2,
          },
        ],
      },
      vanish: {
        intent: "block",
        block: 12,
      },
    },
    ai: ({ turn, rng }) => (turn % 3 === 0 ? 'vanish' : rng() < 0.5 ? 'slash' : 'gloom'),
  },
  chaosHound: {
    hp: [
      56,
      64,
    ],
    art: {
      kind: "beast",
      hue: 315,
      size: 1.1,
    },
    startStatus: {
      rampage: 1,
    },
    moves: {
      bite: {
        intent: "attack",
        dmg: 9,
        ramp: 3,
      },
      howl: {
        intent: "buff",
        fx: [
          {
            who: "self",
            id: "str",
            n: 2,
          },
        ],
      },
    },
    ai: ({ turn }) => (turn % 4 === 0 ? 'howl' : 'bite'),
  },
  watcherEye: {
    hp: [
      48,
      56,
    ],
    art: {
      kind: "eye",
      hue: 250,
      size: 1.05,
    },
    moves: {
      gaze: {
        intent: "attack_debuff",
        dmg: 8,
        fx: [
          {
            who: "player",
            id: "vulnerable",
            n: 2,
          },
        ],
      },
      beam: {
        intent: "attack",
        dmg: 15,
      },
      blink: {
        intent: "attack_block",
        dmg: 5,
        block: 10,
      },
    },
    ai: ({ turn }) => ['gaze', 'beam', 'blink'][(turn - 1) % 3],
  },
  voidColossus: {
    hp: [
      155,
      168,
    ],
    elite: true,
    art: {
      kind: "golem",
      hue: 305,
      size: 1.5,
    },
    moves: {
      slam: {
        intent: "attack",
        dmg: 20,
      },
      fortify: {
        intent: "buff",
        block: 18,
        fx: [
          {
            who: "self",
            id: "str",
            n: 2,
          },
        ],
      },
      shatter: {
        intent: "attack_debuff",
        dmg: 8,
        fx: [
          {
            who: "player",
            id: "frail",
            n: 3,
          },
        ],
      },
    },
    ai: ({ turn }) => ['shatter', 'slam', 'fortify', 'slam'][(turn - 1) % 4],
  },
  heraldOfEnd: {
    hp: [
      128,
      142,
    ],
    elite: true,
    art: {
      kind: "shade",
      hue: 335,
      size: 1.4,
    },
    moves: {
      doom: {
        intent: "debuff",
        fx: [
          {
            who: "player",
            id: "poison",
            n: 7,
          },
        ],
      },
      reave: {
        intent: "attack",
        dmg: 16,
      },
      flame: {
        intent: "attack",
        dmg: 8,
        times: 2,
      },
      rise: {
        intent: "buff",
        fx: [
          {
            who: "self",
            id: "str",
            n: 3,
          },
        ],
      },
    },
    ai: ({ turn }) => (turn % 4 === 0 ? 'rise' : ['doom', 'reave', 'flame'][(turn - 1) % 3]),
  },
  sovereign: {
    hp: [
      330,
      330,
    ],
    boss: true,
    art: {
      kind: "sovereign",
      hue: 285,
      size: 1.8,
    },
    moves: {
      scepter: {
        intent: "attack",
        dmg: 18,
      },
      gravitas: {
        intent: "buff",
        block: 20,
        fx: [
          {
            who: "self",
            id: "str",
            n: 2,
          },
        ],
      },
      starfall: {
        intent: "attack",
        dmg: 11,
        times: 2,
      },
      ruin: {
        intent: "attack_debuff",
        dmg: 4,
        fx: [
          {
            who: "player",
            id: "poison",
            n: 4,
          },
          {
            who: "player",
            id: "weak",
            n: 2,
          },
          {
            who: "player",
            id: "frail",
            n: 2,
          },
        ],
      },
      ascend: {
        intent: "buff",
        block: 30,
        fx: [
          {
            who: "self",
            id: "str",
            n: 4,
          },
        ],
      },
      annihilation: {
        intent: "attack",
        dmg: 34,
      },
    },
    ai: (ctx) => {
      const e = ctx.self;
      if (ctx.hpFrac <= 0.5 && !e.flags.ascended) { e.flags.ascended = true; return 'ascend'; }
      if (e.flags.ascended) {
        e.flags.p2 = (e.flags.p2 || 0) + 1;
        return e.flags.p2 % 3 === 0 ? 'annihilation' : ['scepter', 'starfall', 'ruin', 'gravitas'][e.flags.p2 % 4];
      }
      return ['scepter', 'gravitas', 'starfall', 'ruin'][(ctx.turn - 1) % 4];
    },
  },
};

