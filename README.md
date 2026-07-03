# SPIREBOUND

A complete roguelite deckbuilder for the browser, inspired by Slay the Spire. Three acts, three bosses, 44 cards, 25 relics, 27 enemy species — every visual procedurally generated, every sound synthesized. No assets, no framework.

## Play

```bash
npm install
npm run dev      # http://localhost:5173
```

`npm run build` produces a static `dist/` you can host anywhere.

## The game

- **Climb the Spire itself** — the map is not a flat chart but a real 3D tower: your route is a helix of burning lanterns bolted to its face, the camera dollies upward as you climb, and each new act punches through a sea of moonlit clouds. Combat is fought at the altitude you've earned, with the forest floor of Act 1 far below by the end.
- **3 themed acts** (The Ashen Woods, The Sunken City, The Obsidian Spire) of monsters, elites, events, shops, treasures and rest sites, with a boss at each summit.
- **Combat**: draw 5, spend energy, read enemy intents, stack Block, Poison, Strength, Vulnerable and friends. Click a card, aim the arrow, strike.
- **Build**: 44 cards across attacks / skills / powers with upgrades, 25 relics with passive hooks, 7 potions, 11 narrative events, card removal / duplication / transformation.
- **Roguelite**: procedural maps and encounters, permadeath, autosave (close the tab mid-run and continue later — unfinished fights restart), lifetime stats on the title screen.

### The look: glass & ink

Spirebound is an ink-black world climbed by lantern light, where every living thing is glass with fire inside it. Creatures are leaded stained glass — every landed hit scores a visible crack into the body, and death shatters it into flying shards. Your HP is your lantern: the world itself darkens as you bleed, closing to a guttering circle of light at death's door. Energy is a row of candles that go out as they're spent; Block is a visible ward of held light. Boss kills stop the world — color drains, the cracks blaze, one silent beat, then the glass gives way. Defeat carves your run into a monument in the dark; victory floods the Spire with the only sunrise in the game.

And the glass is alive. No two creatures breathe alike; their eyes turn to follow whoever they mean to kill, the fire inside them flares as they wind up to strike and gutters as they die, and each one casts a pool of its own colored light on the ledge it stands on — a lit line of tower-stone underfoot, so every fight is visibly fought *on* the Spire. Each act has weather: ash sifts down through the Woods, drowned light sinks through the City, and storm embers streak past the Obsidian Spire between silent flashes of heat lightning. Enemy intents are chips of lit glass that blaze in the beat before the blow lands, damage numbers wear ink outlines like the leading on the glass, and the title itself is a stained-glass inscription.

Keyboard: `E` ends the turn, `Esc` cancels targeting / closes panels. Right-click cancels aiming.

## Tech

| Layer | Choice |
|---|---|
| Rendering | DOM + CSS 3D for cards/UI (mouse-tracked tilt + holographic foil), `three.js` with bloom post-processing for the world (one continuous climbable Spire, cloud decks, altitude-tracking camera — map nodes are DOM elements projected onto the 3D tower every frame), 2D canvas for combat VFX, film grain overlay |
| Art | Procedural SVG — enemies, hero, card sigils, props and all UI icons are generated in `src/art.js` |
| Audio | WebAudio-synthesized SFX + ambient drone per act (`src/audio.js`), mute persists |
| Engine | Pure DOM-free game logic in `src/engine.js` + `src/data.js`, animated via an event queue the UI plays back |
| Build | Vite, vanilla JS, zero UI frameworks |

## Tests

```bash
npm test
```

Runs unit checks on the combat math (strength/vulnerable/weak/frail stacking, poison ticks, exhaust, upgrades, map connectivity, enemy AI validity) plus a 300-run monte-carlo in which a random agent plays complete runs through the real engine to prove termination and invariants.
