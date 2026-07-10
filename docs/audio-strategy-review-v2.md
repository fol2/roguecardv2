# Spirebound Audio Strategy Review v2

## Repository reconciliation

This is the downloaded v2 authoring review reconciled against the versioned runtime on 2026-07-10. The archive itself contained strategy and prompts rather than audio binaries; those briefs have now produced installed `stained-glass-v2` and `ashglass-v2` packs. The original root files remain immutable `stained-glass-v1` and `ashglass-v1`; selection stays data-driven through `public/audio-selection.json`.

Source archive SHA-256: `a4783e58fbaee5e9d4f34ef169c21678ef657a0f71d357ab38e1820029baefba`. Its members were `audio-strategy-review-v2.md`, `music-ledger.v2.md`, and `sfx-ledger.v2.md`.

The README and architecture documentation issue identified by the review has now been resolved. The runtime also has independent buses, lazy asset-ref caches, strict complete-pack validation, per-id overrides, and a development-only save endpoint.

This review covers the BGM strategy in `docs/music-ledger.md`, the SFX strategy in `docs/sfx-ledger.md`, and the current runtime split between `src/music.js` and `src/audio.js`.

## Executive verdict

The current direction is strong. Do not throw it away.

The best part is the decision to make the score classical, chamber-sized, and restrained rather than generic dark fantasy. The game is already visually specific: stained glass, ink-black silhouettes, lantern fire, glass creatures, the Vigil, the rose window, and the Spire. The audio strategy should stay equally specific.

The biggest improvement is not “more music” or “more gothic.” It is clearer separation of jobs:

- BGM owns motif, emotion, place, progression, and long-term mood.
- SFX owns material feedback, timing, impact, UI readability, and tactical confirmation.
- Neither should try to do the other’s job.

## Important correction to the previous priority plan

The earlier recommendation said “1–13 + 21/22 = 14 essential,” but that arithmetic is wrong if counted literally. More importantly, cue 4, `roseWindow`, is registered but not wired in live content yet.

The better production priority is:

1. **Essential live set — 14 cues:** title, embark, vigil, map, safeNodes, act1Combat, act1Boss, act2Combat, act2Boss, act3Combat, act3Boss, elite, victory, defeat.
2. **Hidden / future suite — 8 cues:** roseWindow, paleOnes, shadeDuel, usurper, eighthOmen, unreadablePage, hollowLamplighter, sealedDoor.

This matches the current `src/music.js` registry: the live cues are wired, while the hidden-suite cues are registered but unwired until the content lands.

## BGM strategy review

The 22-cue plan is right. It is compact enough to ship, but broad enough to make the three acts, bosses, meta screens, and hidden chain feel distinct.

The current prompts already have the right materials: piano, strings, celesta, glass harmonica, harp, bass clarinet, cello, and restrained percussion. The main risks are:

1. **Too much shimmer.** If every cue uses celesta + glass harmonica + “glass shards,” the top end will get tiring and will mask chip / shatter SFX.
2. **Too much loop ambition inside every prompt.** SUNO may still generate intro/outro shapes. The prompts should explicitly ask for “seamless 90–120 second game loop, no hard ending, no fadeout.”
3. **Boss cues may become trailer music.** They need authority and threat, but not constant drums, brass blasts, or fake choir.
4. **Hidden cues need stronger relationship to the main motif.** They should not sound like separate DLC. They should sound like the same lantern motif being bleached, inverted, corrupted, slowed, or left unfinished.
5. **Pipe organ policy should be stricter.** Use no organ in normal cues. Permit only a low underlayer in `act3Boss` and `sealedDoor`, not as a lead instrument.

## Recommended BGM sound law

Use this law when judging every generated track:

- The score is **classical gothic stained-glass chamber music**, not church gothic.
- Piano is the narrative instrument.
- Strings are the body.
- Celesta / glass harmonica are glass light, used sparingly.
- Bass clarinet / cello / contrabass are shadow.
- Percussion is gesture, not rhythm dominance.
- No vocals, no lyrics, no choir.
- No organ except tiny low underlayer in the final boss and sealed-door reveal.
- No long cymbal washes or constant high glitter; leave room for glass SFX.
- Combat cues should be playable for several minutes without fatigue.
- Menu cues should tolerate reading and decision time.

## SFX strategy review

The SFX ledger is already much improved because it now treats the SFX files as ElevenLabs-generated samples and keeps the ids synced to the code.

The current SFX direction is also correct: short, dry, mostly non-musical one-shots built from stained glass, lead, lantern fire, stone, paper cards, and restrained magic.

The main improvements are:

1. **Add explicit ElevenLabs settings.** For every id, record `duration_seconds`, `prompt_influence`, and `loop: false`.
2. **Reduce musical content even further.** Words like “chime,” “shimmer,” and “resonance” are useful, but too many can produce pitched mini-melodies. Use “pitched but non-melodic,” “brief transient,” and “no arpeggio.”
3. **Give families a shared identity.** Hero attacks are warm amber. Enemy attacks are colder and rougher. Ward sounds are rounded and protective. SHATTER sounds are brittle, bright, and tactical. Rewards are warm and small.
4. **Separate `death`, `shatter`, and `bigDeath`.** They should be related but not interchangeable: `shatter` is tactical and bright; `death` is smaller and final; `bigDeath` is lower and ceremonial.
5. **Keep UI sounds extremely small.** `hover`, `click`, `chip`, `coin`, and `draw` are the fatigue risks because they repeat a lot.

## Recommended ElevenLabs defaults

Use `eleven_text_to_sound_v2`, `loop: false`, and generate 3–5 variants per id. The API minimum for `duration_seconds` is 0.5s, so UI micro-sounds should request 0.5s and then be trimmed down after generation. The web UI may hide some API parameters, but the concept still matters.

General settings:

- UI micro sounds: target 0.08–0.20s after trim, request 0.5s, prompt influence 0.45–0.60.
- Repeated combat actions: target 0.18–0.55s after trim, request 0.5–0.6s, prompt influence 0.45–0.65.
- Signature mechanics: target 0.45–1.20s after trim, request 0.5–1.2s, prompt influence 0.55–0.70.
- Reward / meta stings: target 0.40–1.40s after trim, request 0.5–1.4s, prompt influence 0.45–0.65.
- Never loop SFX.

## Mix strategy

The current bus defaults are sensible: music quieter than SFX. Keep that philosophy. Music should sit like a bed; SFX should read instantly. But the SFX should not be mastered like mobile ads. Keep short transients clean and leave headroom.

Practical review rules:

- Test at default game volumes first.
- Then test music at 70% and SFX at 45%, because some players will lower SFX.
- Then test on phone speakers, because bass-heavy boss impacts may disappear or distort.
- If a sound is only impressive soloed, but annoying in combat, reject it.
- If a cue sounds like part of the music, reject it.
- If the music cue is busy above 5 kHz, regenerate or EQ it; that space belongs to glass chips, card draws, and UI glints.
- If a boss cue fills the whole low end, heavy attacks and `bigDeath` will lose weight.

## Documentation reconciliation

README, CONTEXT, AGENTS, the audio ADRs, and `docs/audio-packs.md` now describe the sample-backed SFX layer, Music Cue playback, independent buses, short crossfades, synth fallback, versioned packs, and the `?audio=1` preview/backend surface.

## Final recommendation

Keep the 22-cue BGM plan and the current SFX id list. The room for improvement is in prompt discipline, not scope expansion.

The revised ledgers in this package tighten prompt language around looping, mix space, repeated-use fatigue, hidden-chain motif treatment, and ElevenLabs generation parameters.
