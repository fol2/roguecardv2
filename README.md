# GLASSVOW ・ 琉璃誓

A complete roguelite deckbuilder for the browser: a tower of glass creatures with fire inside, climbed by lantern light. Three acts, three bosses, 60 cards, 31 relics, 27 enemy species, 2 playable aspects, and a meta-progression vigil that remembers every fall — combat art, card faces, relics, enemies, events, and stage plates are painted raster PNGs (with procedural SVG fallbacks); structural UI icons and status chips stay hand-drawn SVG in `src/art.js`; SFX are sample-backed with WebAudio synth fallback, and BGM is a versioned Music Cue layer. No UI framework.

**Naming layers:** *Glassvow* (Chinese: **琉璃誓**) is the display/brand title — tagline "The Vigil Remembers"; store flavor line "Climb beneath a vow of glass and flame." The title's Vow is thematic; the in-game five-step Vows difficulty ladder still unlocks after the first dawn, as a deliberate title payoff. *Spirebound* remains the internal engineering name: the repo, `package.json` name, the `spirebound_*` localStorage keys, the `window.spirebound` debug hook, and the in-world tower ("the Spire") are all unchanged, deliberately — saves and test anchors must survive the rename.

## Play

```bash
npm install
npm run dev      # http://localhost:5174
```

`npm run build` produces a static `dist/` you can host anywhere.

The game renders to a **fixed virtual resolution** (one of five iPhone/iPad shapes) and scales uniformly into the window — letterboxed like a console title. A bigger monitor gets bigger pixels, never more map. Dev override: `?shape=phone-portrait` (see `src/stage.js`).

## The game

- **Climb the Spire itself** — the map is not a flat chart but a real 3D tower: your route is a helix of burning lanterns bolted to its face, the camera dollies upward as you climb, and each new act punches through a sea of moonlit clouds. Combat is fought at the altitude you've earned, with the forest floor of Act 1 far below by the end.
- **3 themed acts** (The Ashen Woods, The Sunken City, The Obsidian Spire) of monsters, elites, events, shops, treasures and rest sites, with a boss at each summit.
- **Combat**: draw 5, spend energy, read enemy intents, stack Ward, Smolder, Fervor, Cracked and friends. Click a card, aim the arrow, strike.
- **SHATTER — the signature system**: every creature is glass with a **Facet** gauge under its lifebar. Attacks that draw unblocked blood chip a facet (heavy cards chip more). Fill the gauge and the glass **shatters** — the creature loses its next action, is Cracked, and spills **Embers** into your lantern. Timing a shatter to deny a boss's killing blow is the core tactical layer.
- **The Lantern**: Embers fuel your **Lantern Art**, one always-available signature power (6 arts). Drag any card onto the lantern to **kindle** it — the card burns away and feeds the lantern an ember. When smoldering glass dies or shatters, its Smolder leaps to another enemy.
- **Run variance**: once revealed, each act climbs under an **Omen** (a double-edged rule twist), some map lanterns hang **unlit** (their keeper hidden until you pay the walking-bounty), and elites arrive wearing one of six named **affixes**.
- **Progressive delivery**: a fresh profile's first climb is the curated core only — no Lamplighter, phials, or omens yet. Structural systems and pool waves unlock on a `runsPlayed` / wins ladder (`REVEALS` / `PROGRESSION` in `data.js`); specialty cards and relics still unlock via Deeds. Title stays clean; **Embark** grows aspect/vow choices as they reveal; **The Vigil** is a full screen between climbs.
- **The Vigil — meta-progression**: after the first climb ends, a run-start **Lamplighter** offers a boon and your Lantern Art. Death lets you carve a **monument** your next climb recovers. Lifetime **Deeds** (shatters, kindles, perfects, smolder-kills…) unlock 10 cards, 4 relics, and a second aspect — **the Ashwarden**, a smolder/kindle kit. Reach the dawn once and the **Vows** open: a 5-step optional difficulty ladder.
- **Build**: 60 cards across attacks / skills / powers with upgrades, 31 relics with passive hooks (including 5 rule-rewriting **Crowns**), 7 phials (once revealed), 11 narrative events, card removal / duplication / transformation.
- **Roguelite**: procedural maps and encounters, permadeath that leaves a mark, autosave (close the tab mid-run and continue later — unfinished fights restart), and a Vigil ledger that persists across every climb.
- **Consequence, spelled out**: while you aim, every foe shows exactly what it would lose — block-eaten, vulnerability-multiplied — as a number and a ghost segment on its bar, with a death-mark when the answer is lethal. Killing blows land heavier, overkill heavier still, and a fight won without a scratch is sealed **PERFECT**.
- **Plays in your palm**: the whole game recomposes inside the fixed stage for phone shapes. Portrait gets a one-line HUD, a thumb-tuned card fan between two chrome gutters, and a camera that pulls back so the full lantern route stays in frame; landscape ducks everything under a low sill. Cards play by drag — press a pane, the arc springs from your hand, release on a foe — or tap once to read, twice to commit. Long-press anything for its tooltip, drag the tower to survey it. Add to Home Screen on iOS for fullscreen play.

### The look: glass & ink

Spirebound is an ink-black world climbed by lantern light, where every living thing is glass with fire inside it. Creatures are leaded stained glass — every landed hit scores a visible crack into the body, and death shatters it into flying shards. Your HP is your lantern: the world itself darkens as you bleed, closing to a guttering circle of light at death's door. Energy is a row of candles that go out as they're spent; Block is a visible ward of held light. Boss kills stop the world — color drains, the cracks blaze, one silent beat, then the glass gives way. Defeat carves your run into a monument in the dark; victory floods the Spire with the only sunrise in the game.

And the glass is alive. No two creatures breathe alike; their eyes turn to follow whoever they mean to kill, the fire inside them flares as they wind up to strike and gutters as they die, and each one casts a pool of its own colored light on the ledge it stands on — a lit line of tower-stone underfoot, so every fight is visibly fought *on* the Spire. Each act has weather: ash sifts down through the Woods, drowned light sinks through the City, and storm embers streak past the Obsidian Spire between silent flashes of heat lightning. Enemy intents are chips of lit glass that blaze in the beat before the blow lands, damage numbers wear ink outlines like the leading on the glass, and the title itself is a stained-glass inscription.

And the game has ceremony. A band of lantern light sweeps the glass between scenes; bosses are announced through a rose window — spokes of leaded light blooming behind the name; the deck visibly re-shuffles as card-backs arc from the discard to the draw pile; powers dissolve into motes that settle into the hero's glass; coins fly to the purse and relics take their seat on the bar; exhausted cards burn away edge-inward, embers rising.

Keyboard: `E` ends the turn, `Esc` cancels targeting / closes panels. Right-click cancels aiming. On touch, everything answers the finger: drag cards to play them, long-press for tooltips, drag the map, tap the stage to cancel.

## Tech

| Layer | Choice |
|---|---|
| Viewport | Fixed virtual stage (`src/stage.js`): five canonical shapes (phone/pad portrait & landscape + desktop 16:9), uniform `transform: scale()` letterbox; layout breakpoints are `@container stage` queries, lengths use `cqw`/`cqh` |
| Rendering | DOM + CSS 3D for cards/UI (mouse-tracked tilt + holographic foil), `three.js` with bloom post-processing for the world (one continuous climbable Spire, cloud decks, altitude-tracking camera — map nodes are DOM elements projected onto the 3D tower every frame), 2D canvas for combat VFX, WebGL mesh warp for character sprites, film grain overlay |
| Art | Raster PNG/JPG in `src/assets/` (cards, enemies, heroes, relics, events, stage plates, props, title) via `assetUrl()`; procedural SVG fallbacks + all structural UI icons in `src/art.js` |
| Audio | Versioned, lazy-loaded Music Cue and SFX packs with per-file overrides; Suno `stained-glass-v2` Music and ElevenLabs `ashglass-v2` SFX ship beside immutable v1 rollback packs; independent buses (`src/music.js`, `src/audio.js`, `public/audio-selection.json`) |
| Engine | Pure DOM-free game logic in `src/engine.js` + `src/data.js`, animated via an event queue the UI plays back; meta-progression in `src/vigil.js` (Node-safe storage adapter) |
| Build | Vite, vanilla JS, zero UI frameworks |

## Tests

```bash
npm test           # engine unit checks + 300-run monte-carlo (Node, no browser)
npm run test:e2e   # Playwright visual-QA kit (needs dev server on 5174 + Chromium)
```

`npm run test:e2e:update` refreshes screenshot baselines; `npm run test:e2e:perf` records the standalone FPS/frame-time reference and warns on target misses. See `docs/superpowers/specs/2026-07-06-visualisation-hardening-polish-design.md` §3 for the full harness contract. Documentation index: [`docs/README.md`](docs/README.md).

App version: `package.json` is the source of truth; the title screen shows it. See [`docs/app-versioning.md`](docs/app-versioning.md).

CI uses two pull-request modes. Draft pushes run `npm test`, `npm run build`,
and `npm run test:e2e:smoke` in parallel. Marking a PR Ready for review runs
the complete Playwright gate across isolated random-agent, main, serial-heavy,
visual, and disk-writing jobs; later Ready pushes rerun that full gate. `npm run test:e2e`
remains the complete serial local equivalent. CI wall-clock targets are
warnings, not correctness gates.

Audio inventory and preview: `?audio=1`. In development the same page edits the
runtime Music/SFX versions and individual file overrides. See
[`docs/audio-packs.md`](docs/audio-packs.md).

### Engine tests (`npm test`)

Runs unit checks on the combat math (Fervor/Cracked/Dimmed/Brittle stacking, Smolder ticks and jumps, kindle, upgrades, map connectivity, enemy AI validity), the SHATTER system (facet chips, shatter/stagger, embers, Lantern Arts), run variance (all 7 omens, 6 affixes, unlit nodes), and the whole Vigil (deed round-trips, monuments, bequests, aspects, vows, boons) — plus a 300-run monte-carlo in which a random agent plays complete runs (mixed aspects, vows and boons, claiming monuments) through the real engine to prove termination and invariants.
