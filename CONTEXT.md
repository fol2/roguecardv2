# Spirebound

Browser roguelite deckbuilder: glass creatures, lantern light, The Vigil, and a climb through the Spire.

## Language

### Delivery architecture

**Production Engineering Lane (PE)**:
The primary Round 5 workstream, called “back-end” in owner shorthand. It owns the browser game's engine-adjacent substrate, refactoring, registries, Content Lab/Manager, renderer mechanics, diagnostics, tests, CI and integration; it is not a server back end.
_Avoid_: server back end, infrastructure-only lane, Front-end Experience

**Front-end Experience Lane (FE)**:
The small, design-led Round 5 workstream for player-facing presentation: the experience contract, dedicated screen stylesheet, visual assets, motion/state matrices and contact-sheet critique. It does not own product JavaScript or tooling simply because those surfaces render in a browser.
_Avoid_: all UI code, Content Manager, Pixi runtime, screen refactor

**Verification Lane (QA)**:
A fresh reviewer agent that independently issues both spec-compliance and code-quality verdicts from diff and test evidence. The task implementer cannot certify its own work, and QA cannot grant owner taste approval.
_Avoid_: implementer self-review, visual owner sign-off

**Cross-lane Handoff**:
A checked-in PE/FE integration contract naming the exact commit, frozen interfaces/selectors, exclusive write set, visual/state matrix, required evidence and rollback commit. Shared-file edits are sequential; parallel work requires disjoint write sets and separate worktrees.
_Avoid_: informal hand-off, concurrent shared-file editing

### Content architecture

**Content Data Drop**:
A compiled-in content-pack addition for content that fits existing mechanics and schemas, registered through the content substrate rather than integrated across engine, UI, VFX, music, and styling call sites. It ships in an app update; new mechanics may still require engine work.
_Avoid_: runtime DLC, zero-code feature, complete Act 4 implementation

**Content Manager**:
The dev-only, schema-driven CRUD editor for cards, relics, potions and themes. It is a Production Engineering authoring tool; behaviour-valued fields are read-only or excluded, and every write validates before touching a pack module.
_Avoid_: CMS, runtime content service, Front-end Experience screen

### Production diagnostics

**Semantic UI Behaviour Trace**:
A local, versioned stream of structured semantic interaction and presentation records used for AI diagnosis and regression tests. It observes behaviour without driving game state; timestamped text and NDJSON are projections of the records.
Its incremental cursor is `{ segment, seq }`; a reload starts a new segment and cannot be resumed by sequence alone.
_Avoid_: console log, analytics, pixel trace, second game state, sequence-only cursor

**Behaviour Transcript**:
The timestamped human/AI-readable text projection of a Semantic UI Behaviour Trace. Sequence numbers define order; elapsed timestamps are diagnostic and not golden-test truth.
_Avoid_: canonical log strings, screenshot narration

**Replay Descriptor**:
A small, versioned, immutable presentation fixture published by a replayable UI owner and referenced by a trace span. When its span settles, Content Lab writes it to `replay=`; reload hydrates but does not auto-run the isolated visual preview. It never re-runs engine commands, restores game state, or writes a save.
_Avoid_: command journal, save snapshot, persistent trace, gameplay replay

**Playwright WebKit Device Emulation**:
The active Round 5 mobile-shaped browser lane: Playwright's patched WebKit browser running with an iPhone or iPad descriptor for viewport, user-agent and touch emulation, combined with per-task WebKit-safe API review. It is not branded Safari, an iOS/iPadOS Simulator, WKWebView, physical Mobile Safari, hardware evidence, packaging proof or a mobile-support claim.
_Avoid_: Mobile Safari test, Simulator proof, WKWebView proof, physical-device gate

**Deferred Mobile-Migration Tooling**:
The non-executable future design at `docs/superpowers/specs/2026-07-11-mobile-migration-simulator-tooling-design.md`. Round 5 has no actual Safari/iOS Simulator lane; future work requires explicit owner activation, fresh drift audit, a separate implementation plan and proved tool maturity before any compatibility matrix.
_Avoid_: active Round 5 gate, reviving retired Tasks 3–4, treating Playwright artefacts as Safari evidence

### Audio

**Music Cue**:
A named BGM track identity (e.g. `title`, `act1Combat`) that the UI requests via `music.play(cueId)`. Mapped by a flat registry to an asset and playback policy.
_Avoid_: scene, soundtrack id, song, BGM key (prefer Cue / Music Cue)

**Music Registry**:
The flat table of Music Cues → title/readiness/playback policy. The Audio Selection resolves each Cue to a versioned asset. Future content wires by adding a caller; cues may exist before their content is live.
_Avoid_: playlist, soundtrack catalog

**Audio Pack Version**:
A complete, installed set for one audio kind. Music and SFX versions are selected independently. The immutable roots are `stained-glass-v1` and `ashglass-v1`; installed replacements such as `stained-glass-v2` and `ashglass-v2` live one directory lower.
_Avoid_: playlist version, theme toggle, downloadable DLC (the pack is compiled in)

**Audio Selection**:
The runtime `audio-selection.json`: one whole-pack version and an override map for each of Music and SFX. A host may replace this data without rebuilding JavaScript, but every referenced MP3 must already be compiled into that deployment.
_Avoid_: player setting (this is project/deployment content, not personal volume)

**Audio Asset Override**:
A per-Cue or per-SFX mapping to an installed `<version>/<filename>` ref. It wins over the whole-pack choice and never crosses from Music to SFX or vice versa.
_Avoid_: arbitrary URL, filesystem path, renaming the logical Cue/SFX id

**Ambience Drone**:
The old WebAudio act-root drone under `setAmbience` / `stopAmbience`. Retired once Music Cues play; not a parallel bed under BGM.
_Avoid_: ambient bed (when meaning the retired drone)

**Music Crossfade**:
Short gain crossfade (~0.6–1.0s) when switching Music Cues. Re-playing the already-active cue is a no-op.
_Avoid_: hard cut, long cinematic fade (as the default switch)

**Music Bus / SFX Bus**:
Independent audio buses. Each has its own volume (0–1) and mute flag, persisted separately. UI exposes mute toggle + volume control per bus; the old single `spirebound_mute` migrates into both then retires.
_Avoid_: global mute, shared volume

**Music Warm**:
Background preload of likely next Music Cues (declared on the registry as `warmWith`). Playback itself is lazy: a cue loads on first `music.play`.
_Avoid_: full soundtrack preload

**Wired Cue**:
A Music Cue that current screens/content actually call. Unwired cues stay in the Music Registry (`wired: false`) so future content only adds a caller.
_Avoid_: stub track, placeholder cue (prefer Wired / unwired)

**Combat Cue Resolve**:
Quest override (`paleOnes` / `shadeDuel` / `usurper`) → Eighth Omen non-boss → boss act cue / elite cue / act combat cue. Overrides are explicit cue ids from `resolveCombatCue`, not an enemy-id soundtrack matrix.
_Avoid_: enemy-id soundtrack matrix (as the default)

**Safe Node Cue**:
Only shop, rest, and treasure play the safe-node Music Cue. Event keeps the map cue (or Eighth Omen when that omen owns the act). Reward and boss-relic leave the combat cue playing; map music starts only on the node-pick map screen. The run-start Lamplighter stays on map fallback; Hollow Lamplighter meetings play `hollowLamplighter`.
_Avoid_: one BGM for every non-combat screen

**Run-End Cue**:
Act 1/2 boss-victory transitions and the final victory end screen play the victory Music Cue; the defeat end screen plays the defeat Cue. Normal-fight and elite reward screens keep their combat cue. Dawn panels may temporarily take `unreadablePage` (pageRead) or `sealedDoor` (act4Reveal).
_Avoid_: victory sting after every combat

**Music Module**:
`src/music.js` owns the Music Registry and playback (`play` / `stop` / `warm` / bus controls). `src/audio.js` owns SFX and the shared AudioContext unlock.
_Avoid_: stuffing BGM into audio.js, splitting music into many tiny files

**Cue Id**:
camelCase Music Cue identity used at call sites (`act1Combat`, `safeNodes`). Display titles stay on the asset / ledger only.
_Avoid_: cue numbers, filename slugs as call-site ids

**Music Asset Filename**:
Kebab-case file aligned to the Cue Id (e.g. `act1-combat.mp3`). The base lives directly under `src/assets/musics/`; later versions live under `src/assets/musics/<version>/`. Ledger keeps the human title.
_Avoid_: display-title filenames with spaces or curly apostrophes

**Music Loop**:
Every Music Cue loops by default, including victory and defeat, so end screens can linger.
_Avoid_: one-shot end stings as the default policy

**Music Call Sites**:
Screen Music Cues resolve centrally in `show()`; combat cues in `startCombatUI`; run-end cues in `renderEnd`. Rose-tab switches, the sealed-door overlay, and dawn panel cues are the allowed ceremony exceptions.
_Avoid_: per-renderer music.play scatter

**Default Bus Levels**:
First-run defaults are music volume 0.35 and SFX volume 0.55. Mute flags are independent of stored volume.
_Avoid_: both buses at 0.5 as the designed default

**Audio Panel**:
A small settings panel with Music and SFX rows (mute toggle + volume slider each). Opened from title and the in-run hamburger; replaces the single Mute Sound control.
_Avoid_: inline four-control sprawl on the title screen
