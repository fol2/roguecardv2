// Sample English fragment — same 18-domain content catalogue shape as core.
// Theme display is keyed by stable theme id so an Act 4 drop can shift indices.

export const SAMPLE_LOCALE_EN = Object.freeze({
  cards: Object.freeze({
    sampleCard: Object.freeze({
      name: 'Test Spark',
      text: 'Deal @3@ damage.',
    }),
  }),
  status: Object.freeze({}),
  relics: Object.freeze({}),
  potions: Object.freeze({}),
  arts: Object.freeze({}),
  boons: Object.freeze({}),
  enemies: Object.freeze({
    sampleEnemy: Object.freeze({
      name: 'Test Pane',
      moves: Object.freeze({
        wait: Object.freeze({ name: 'Wait' }),
      }),
    }),
  }),
  events: Object.freeze({}),
  omens: Object.freeze({}),
  affixes: Object.freeze({}),
  acts: Object.freeze({
    sampleTheme: Object.freeze({
      name: 'Test Gallery',
      bossName: 'Test Pane',
      tagline: 'A fourth pane for the Lab.',
    }),
  }),
  aspects: Object.freeze({}),
  vows: Object.freeze({}),
  deeds: Object.freeze({}),
  quests: Object.freeze({}),
  whispers: Object.freeze([]),
  variants: Object.freeze({}),
  shadeKits: Object.freeze({}),
});
