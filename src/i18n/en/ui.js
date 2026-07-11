// English UI chrome catalogue.
// Core surfaces extracted after Emberglass Phase 2 rebase.
// Remaining shop/rest/reward/rose microcopy can follow the same pattern.

export const ui = {
  smoke: {
    hello: 'Hello, {name}',
  },

  brand: {
    title: 'SPIREBOUND',
    tagline: 'A Roguelite Deckbuilder · The Vigil Remembers',
  },

  embark: {
    title: 'THE CLIMB BEGINS',
    subChoose: 'Choose how you meet the Spire.',
    subWait: 'The lantern is lit. The Spire waits.',
    aspectLabel: 'Who carries the lantern',
    noVows: 'The Spire as it is. No vows sworn.',
    warnSaved: 'Beginning anew abandons your saved climb.',
  },

  menu: {
    howToPlay: 'How to Play',
    mute: 'Mute',
    unmute: 'Unmute',
    muteSound: 'Mute Sound',
    unmuteSound: 'Unmute Sound',
    abandonRun: 'Abandon Run',
    abandonConfirmTitle: 'Abandon Run?',
    abandonConfirmBody: 'Your climb will be lost to the void.',
    abandon: 'Abandon',
    keepClimbing: 'Keep Climbing',
    continueClimb: 'Continue Climb',
    beginClimb: 'Begin the Climb',
    beginAnew: 'Begin Anew',
    beginAnewTitle: 'Begin Anew?',
    beginAnewBody: 'Your saved climb will be lost to the void.',
    theVigil: 'The Vigil',
    back: 'Back',
    return: 'Return',
    fightOn: 'Fight On',
    lightTheWay: 'Light the Way',
    chooseBoon: 'Choose a boon',
    close: 'Close',
  },

  map: {
    node: {
      monster: 'Monster',
      elite: 'Elite — beware',
      event: 'Unknown event',
      rest: 'Rest site',
      shop: 'Merchant',
      treasure: 'Treasure',
      hollow: 'Hollow lantern',
    },
    hint: {
      monster: 'A fight. Embers and gold for the swift.',
      elite: 'A titled foe - greater risk, a relic-grade purse.',
      event: 'Fate unwritten. Could be anything.',
      rest: 'Heal, or forge a card into its + form.',
      shop: 'Gold for cards, relics, phials.',
      treasure: 'A chest with no fight attached.',
      boss: 'The act ends here. Ready your deck.',
      hollow: 'The Hollow Lamplighter waits with a price.',
    },
    unlitTitle: 'An unlit lantern',
    unlitBody: 'What waits here is unknown — but first light pays a bounty of gold.',
    travelHere: '{action} to travel here.',
    tap: 'Tap',
    click: 'Click',
  },

  combat: {
    draw: 'DRAW',
    discard: 'DISCARD',
    ashes: 'ASHES',
    end: 'End',
    yourTurn: 'YOUR TURN',
    enemyTurn: 'ENEMY TURN',
    shatter: 'SHATTER',
    staggered: 'STAGGERED',
    glassHolds: 'THE GLASS HOLDS',
    guardShattered: 'GUARD SHATTERED',
    reshuffle: 'Reshuffle',
    stoneRemembers: 'THE STONE REMEMBERS',
  },

  reward: {
    victory: 'VICTORY',
    eliteSlain: 'ELITE SLAIN',
    bossVanquished: 'BOSS VANQUISHED',
  },

  end: {
    ascended: 'ASCENDED',
    fallen: 'FALLEN',
    ascendedSub: 'The Eternal Sovereign is dust. Dawn breaks over the Spire — the first in an age.',
    viewDeck: 'View Final Deck',
    returnVigil: 'Return to the Vigil',
    floors: 'Floors',
    slain: 'Slain',
    elitesBosses: 'Elites & Bosses',
    deckSize: 'Deck Size',
    dmgDealt: 'Damage Dealt',
    dmgTaken: 'Damage Taken',
    cardsPlayed: 'Cards Played',
    runTime: 'Run Time',
  },

  vigil: {
    deeds: 'Deeds',
    roseWindow: 'Rose Window',
  },

  rose: {
    openLabel: 'Open the Rose Window',
    dormantPane: 'Dormant Emberglass pane {n}',
    unknownPane: 'Unknown Emberglass pane {n}',
    selectedPane: 'Selected Emberglass pane',
    whisperLogTitle: 'Whispers heard at dawn',
    finalWhisper: 'The final whisper returns at every dawn.',
    shardRecovered: '{name}, Shard recovered',
    shardRecoveredShort: 'Shard recovered',
    paneDark: 'This pane is dark.',
  },

  lamp: {
    title: 'THE LAMPLIGHTER',
    sub: '{aspect} stands at the foot of the Spire. Take one parting gift — and choose the fire your lantern will carry.',
    boonLabel: 'A Boon for the Road',
    artLabel: 'Your Lantern Art',
    artHint: '(press A in combat)',
  },

  keywords: {
    facetDesc: 'Every creature is glass with a Facet gauge. Fill it and the glass Shatters — the creature loses its next action, is Cracked, and spills Embers into your lantern.',
    kindle: 'Burned away for the rest of this combat — and the lantern gains 1 Ember.',
    ward: 'Held light that prevents damage. Expires at the start of your turn.',
    energy: 'Spent to play cards. Refreshes each turn.',
    ember: 'Fuel for your Lantern Art. Spilled by shatters, deaths and kindling; held in the lantern.',
    chip: 'Strike at the glass itself: adds toward a Shatter, no blood required.',
    staggered: 'Shattered glass loses its next action while it reseams.',
    unplayable: 'This card cannot be played.',
    shard: 'Unplayable junk glass. It can still be kindled.',
    hex: 'Curse: lose 1 HP at end of turn while in hand. Cannot be kindled.',
    cinder: 'Take 2 damage at end of turn while in hand.',
  },

  help: {
    title: 'How to Play',
    climbTitle: 'The Climb',
    climbBody: 'Choose a path of lanterns up the Spire. Fight monsters, gather cards, relics and phials, and defeat the boss of each of the <b>3 acts</b>. Unlit lanterns hide what they hold — but pay a bounty for the walking.',
    combatTitle: 'Combat',
    combatBody: 'Each turn you draw <b>5 cards</b> and gain <b>3 Energy</b> (⬤). Play a card by clicking or dragging — attacks need a target when several enemies remain. Enemies telegraph their <b>intent</b> above their heads.',
    glassTitle: 'The Glass',
    glassBody: 'Every creature is glass with a row of <b>Facets</b> under its lifebar. Attacks that draw unblocked blood chip a facet (heavy cards chip more). Fill the gauge and the glass <b>SHATTERS</b>: it loses its next action, is Cracked, and spills <b>Embers</b> into your lantern. Time a shatter to deny the blow you can\'t survive.',
    lanternTitle: 'The Lantern',
    lanternBody: 'Embers fuel your <b>Lantern Art</b> — one signature power, always available, once a turn (press <b>A</b>). Drag any card onto the lantern to <b>kindle</b> it: the card burns away and feeds the lantern 1 ember. Once a turn; curses refuse the fire.',
    wardTitle: 'Ward & Statuses',
    wardBody: '<b>Ward</b> is held light that absorbs damage but expires each turn. <b>Cracked</b> ×1.5 damage taken · <b>Dimmed</b> −25% damage dealt · <b>Brittle</b> −25% Ward · <b>Smolder</b> burns each turn, and leaps to another enemy when its host dies or shatters.',
    firesTitle: 'The Fires & The Merchant',
    firesBody: 'Rest sites heal <b>30%</b> or upgrade a card. Shops sell cards, relics, phials — and can <b>remove</b> a card from your deck. Keep your deck lean; every reward is optional.',
    vigilTitle: 'The Vigil — What Death Leaves Behind',
    vigilBody: 'Nothing is wasted. At the foot of each climb the <b>Lamplighter</b> offers a boon and lets you choose your Lantern Art. When you fall, carve one thing into the stone — a <b>monument</b> your next climb can recover in that same act. Every shatter, kindle and slaying feeds lifetime <b>Deeds</b> that unlock new cards, relics, and a second aspect, the <b>Ashwarden</b>. Reach the dawn once and the <b>Vows</b> open: an optional difficulty ladder for those who\'d climb a crueler Spire.',
  },
};
