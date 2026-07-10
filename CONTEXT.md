# Spirebound

Browser roguelite deckbuilder: glass creatures, lantern light, The Vigil, and a climb through the Spire.

## Language

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
Boss → act boss cue; elite → shared elite cue; monster → act combat cue. Hidden overrides arrive later via an explicit cue override, not by expanding resolve rules early.
_Avoid_: enemy-id soundtrack matrix (as the default)

**Safe Node Cue**:
Only shop, rest, and treasure play the safe-node Music Cue. Event keeps the map cue. Reward and boss-relic leave the combat cue playing; map music starts only on the node-pick map screen. Lamplighter stays on map fallback until its own cue is wired.
_Avoid_: one BGM for every non-combat screen

**Run-End Cue**:
Act 1/2 boss-victory transitions and the final victory end screen play the victory Music Cue; the defeat end screen plays the defeat Cue. Normal-fight and elite reward screens keep their combat cue.
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
Screen Music Cues resolve centrally in `show()`; combat cues in `startCombatUI`; run-end cues in `renderEnd`. Renderers do not each call music ad hoc.
_Avoid_: per-renderer music.play scatter

**Default Bus Levels**:
First-run defaults are music volume 0.35 and SFX volume 0.55. Mute flags are independent of stored volume.
_Avoid_: both buses at 0.5 as the designed default

**Audio Panel**:
A small settings panel with Music and SFX rows (mute toggle + volume slider each). Opened from title and the in-run hamburger; replaces the single Mute Sound control.
_Avoid_: inline four-control sprawl on the title screen
