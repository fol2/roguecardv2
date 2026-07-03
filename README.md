# SPIREBOUND

A complete roguelite deckbuilder for the browser, inspired by Slay the Spire. Three acts, three bosses, 44 cards, 25 relics, 27 enemy species — every visual procedurally generated, every sound synthesized. No assets, no framework.

## Play

```bash
npm install
npm run dev      # http://localhost:5173
```

`npm run build` produces a static `dist/` you can host anywhere.

## The game

- **Climb a branching map** through 3 themed acts (The Ashen Woods, The Sunken City, The Obsidian Spire), choosing between monsters, elites, events, shops, treasures and rest sites, with a boss at each summit.
- **Combat**: draw 5, spend energy, read enemy intents, stack Block, Poison, Strength, Vulnerable and friends. Click a card, aim the arrow, strike.
- **Build**: 44 cards across attacks / skills / powers with upgrades, 25 relics with passive hooks, 7 potions, 11 narrative events, card removal / duplication / transformation.
- **Roguelite**: procedural maps and encounters, permadeath, autosave (close the tab mid-run and continue later — unfinished fights restart), lifetime stats on the title screen.

Keyboard: `E` ends the turn, `Esc` cancels targeting / closes panels. Right-click cancels aiming.

## Tech

| Layer | Choice |
|---|---|
| Rendering | DOM + CSS 3D for cards/UI, `three.js` for the living background (per-act themes, particles, monoliths), 2D canvas for combat VFX |
| Art | Procedural SVG — enemies, hero, card sigils, props are all generated in `src/art.js` |
| Audio | WebAudio-synthesized SFX + ambient drone per act (`src/audio.js`), mute persists |
| Engine | Pure DOM-free game logic in `src/engine.js` + `src/data.js`, animated via an event queue the UI plays back |
| Build | Vite, vanilla JS, zero UI frameworks |

## Tests

```bash
npm test
```

Runs unit checks on the combat math (strength/vulnerable/weak/frail stacking, poison ticks, exhaust, upgrades, map connectivity, enemy AI validity) plus a 300-run monte-carlo in which a random agent plays complete runs through the real engine to prove termination and invariants.
