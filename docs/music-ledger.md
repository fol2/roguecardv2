# Spirebound Music Ledger v2

## Runtime integration

The maintained current renders stay at `src/assets/musics/<kebab>.mp3` as the immutable `stained-glass-v1` pack. New renders live at `src/assets/musics/<version>/<kebab>.mp3`. Logical Cue ids resolve through `public/audio-selection.json`, the Node-safe pack resolver, and `src/music.js`; preview or override them at `?audio=1`.

The rendered `stained-glass-v2` pack is installed: 22 selected Suno Pro sources were downloaded from the official Suno CDN, stripped of generated fade tails, turned into bounded 90–120 second quadratic loops, normalised to −20 LUFS with true-peak headroom, and recorded in strict manifest plus render provenance. The immutable v1 files remain available for instant rollback.

## Purpose

This ledger defines the BGM cue strategy and SUNO prompts for Spirebound. The cue ids below are the canonical Music Cue contract shared by the catalogue, pack resolver, manifests, and playback layer.

## Production priority

**Essential live set — 14 cues:** title, embark, vigil, map, safeNodes, act1Combat, act1Boss, act2Combat, act2Boss, act3Combat, act3Boss, elite, victory, defeat.

**Hidden / future suite — 8 cues:** roseWindow, paleOnes, shadeDuel, usurper, eighthOmen, unreadablePage, hollowLamplighter, sealedDoor.

## Global music direction

Spirebound music is classical gothic stained-glass chamber music. It should feel old, crafted, glass-lit, and playable for long sessions. Do not push it into generic horror, church organ gothic, fantasy trailer music, or busy orchestral bombast.

Core palette:

- Felt piano / upright piano: identity, decision, memory.
- String quartet / chamber strings: body and emotion.
- Cello, contrabass, bass clarinet: shadow and threat.
- Celesta, glass harmonica, harp harmonics: glass light, used sparingly.
- Small percussion, prepared piano, muted timpani: tactical motion only.
- Pipe organ: almost forbidden. Only tiny low underlayer in `act3Boss` and `sealedDoor`.

Mix law:

- Leave transient space for SFX: card flicks, glass chips, shatters, UI clicks.
- Avoid constant high sparkle and cymbal wash.
- Avoid constant sub-bass in combat loops.
- Prefer mezzo-piano to mezzo-forte. Bosses may rise, but should not stay loud.
- Ask for seamless 90–120 second game loops with no hard ending and no fadeout.

Motif law:

Every cue should imply the same short lantern motif: a fragile four-note minor-key idea, small interval leaps, warm first note, unresolved final note. Hidden cues should distort the motif: bleached, inverted, missing notes, colder harmony, or slowed almost beyond recognition.

## Cues and SUNO prompts

### 1. `title` — Stained Glass Inscription

Use: title screen, calm first impression.

SUNO prompt:

Instrumental seamless game background loop, 90–120 seconds, no vocals, no lyrics, no choir. Calm classical gothic chamber music for a stained-glass roguelite title screen. Felt piano introduces a fragile four-note lantern motif, answered by soft string quartet, very light celesta, and faint glass harmonica shimmer. Warm amber light in an ink-black world, elegant but not religious. 70 BPM, minor key with hopeful suspended chords, gentle dynamics, no pipe organ, no percussion, no hard ending, no fadeout.

### 2. `embark` — Light Your Lantern

Use: Begin the Climb / aspect / vow selection.

SUNO prompt:

Instrumental seamless game background loop, 90–120 seconds, no vocals, no lyrics, no choir. Purposeful classical chamber cue for choosing a climb before entering a glass tower. Felt piano arpeggios, pizzicato strings, soft harp, tiny celesta sparks, and one restrained woodwind countermelody. The lantern motif returns brighter but still cautious. Calm preparation, not combat. 82 BPM, light forward motion, no pipe organ, no trailer drums, no big crescendo, no hard ending, no fadeout.

### 3. `vigil` — Monuments in the Dark

Use: Vigil, deeds, meta-progression, death memory.

SUNO prompt:

Instrumental seamless game background loop, 90–120 seconds, no vocals, no lyrics, no choir. Quiet classical elegy for a Vigil screen where fallen climbs become monuments in darkness. Felt piano, solo cello, low viola, distant celesta, soft bowed-glass texture. The lantern motif is fragmented like memory, with missing final notes. Reflective and intimate, not depressing. 62 BPM, very low intensity, minimal bass pizzicato heartbeat, no pipe organ, no percussion loop, no hard ending, no fadeout.

### 4. `roseWindow` — Six Dark Panes

Use: Emberglass / rose window / whisper log / hidden quest progress.

SUNO prompt:

Instrumental seamless game background loop, 90–120 seconds, no vocals, no lyrics, no choir. Mysterious classical chamber music for a dark rose window with six unlit stained-glass panes. Sparse piano, glass harmonica, harp harmonics, muted strings, and distant celesta points. The lantern motif appears as six separated glimmers, slowly becoming legible but never fully resolving. Delicate gothic mystery, not horror. 58 BPM, soft high end, no pipe organ, no percussion, no hard ending, no fadeout.

### 5. `map` — Lanterns on the Face of the Spire

Use: 3D tower map, route choice, node travel.

SUNO prompt:

Instrumental seamless game background loop, 90–120 seconds, no vocals, no lyrics, no choir. Classical adventure chamber music for climbing a 3D spire by lantern light, following a spiral path of glowing nodes through moonlit clouds. Light piano ostinato, pizzicato strings, harp, bassoon, and restrained celesta. Playful but calm, with the lantern motif stepping upward. 96 BPM, clear forward motion, leave space for UI clicks, no pipe organ, no rock drums, no hard ending, no fadeout.

### 6. `safeNodes` — Cold Goods, Warm Price

Use: merchant, treasure, rest, forge, quiet nodes.

SUNO prompt:

Instrumental seamless game background loop, 90–120 seconds, no vocals, no lyrics, no choir. Cozy but suspicious classical chamber cue for merchants, campfires, treasure, forge, and rest nodes inside a gothic glass tower. Upright piano, muted viola, bass clarinet, pizzicato cello, and tiny bell-like celesta accents. Warm lantern comfort with sly shadows underneath. 76 BPM, gentle dynamics, no tavern folk style, no pipe organ, no loud percussion, no hard ending, no fadeout.

### 7. `act1Combat` — Ashen Woods Scherzo

Use: Act 1 normal combat.

SUNO prompt:

Instrumental seamless game combat loop, 90–120 seconds, no vocals, no lyrics, no choir. Playful progressive classical combat music for the Ashen Woods: ash, roots, spores, glass beasts, and lantern sparks. Piano and string quartet lead a light scherzo rhythm with bassoon, clarinet, pizzicato cello, and tiny wooden percussion. Agile and readable, energetic but not aggressive. 112 BPM, minor key with mischievous turns, no pipe organ, no heavy drums, no bombast, no hard ending, no fadeout.

### 8. `act1Boss` — The Rootheart Awakens

Use: The Rootheart boss.

SUNO prompt:

Instrumental seamless boss loop, 90–120 seconds, no vocals, no lyrics, no choir. Classical boss battle music for The Rootheart, a living stained-glass tree boss with fire inside. Low strings pulse like roots under stone, piano strikes sharp glass chords, bassoon and contrabass answer with heavy wooden motifs, and brief celesta cracks glint above. Serious but sustainable, 104 BPM, gradual pressure without constant loudness, no pipe organ, no trailer percussion, no hard ending, no fadeout.

### 9. `act2Combat` — Sunken City Waltz

Use: Act 2 normal combat.

SUNO prompt:

Instrumental seamless game combat loop, 90–120 seconds, no vocals, no lyrics, no choir. Classical underwater gothic combat music for a drowned city of glass, brine, eels, shells, and sunken cathedral light. Piano in flowing 6/8, harp ripples, muted strings, bass clarinet, and very soft timpani pressure. Playful but darker than Act 1, graceful danger rather than horror. 92 BPM, loopable, no pipe organ, no choir, no ocean ambience overpowering the music, no fadeout, no hard ending.

### 10. `act2Boss` — Leviathan's Maw

Use: Leviathan's Maw boss.

SUNO prompt:

Instrumental seamless boss loop, 90–120 seconds, no vocals, no lyrics, no choir. Classical aquatic boss theme for Leviathan's Maw, an immense stained-glass sea monster beneath a drowned city. Deep cello and contrabass ostinato, low-register piano waves, restrained brass shadow, harp glissandi like brine, and small celesta shards. Dark 6/8 at 88 BPM, heavy but not too loud, no pipe organ, no cinematic explosion, no constant cymbals, no hard ending, no fadeout.

### 11. `act3Combat` — The Cracked Astral Court

Use: Act 3 normal combat.

SUNO prompt:

Instrumental seamless game combat loop, 90–120 seconds, no vocals, no lyrics, no choir. Progressive classical combat music for the Cracked Astral Court at the top of the Obsidian Spire: judgement eyes, crown shards, broken orbit rings, star-fire, and black stone. Piano ostinato, sharp staccato strings, celesta star-glass, bass clarinet, and low viola tremolo. 118 BPM, elegant and tense, not generic space music, no pipe organ, no choir, no rock drums, no fadeout, no hard ending.

### 12. `act3Boss` — The Eternal Sovereign

Use: final main boss.

SUNO prompt:

Instrumental seamless final boss loop, 90–120 seconds, no vocals, no lyrics, no choir. Grand but controlled classical boss theme for The Eternal Sovereign, a cracked astral-court stained-glass monarch with black-sun halo, scepter, and magenta judgement core. Piano and full chamber strings drive a severe court dance, low brass supports sparingly, celesta shards flash, and a very subtle low pipe-organ pedal appears only as a shadow layer. 112 BPM, majestic gothic, no trailer drums, no fadeout, no hard ending.

### 13. `elite` — Named Afflictions

Use: elite fights and affixed elites across acts.

SUNO prompt:

Instrumental seamless elite-combat loop, 90–120 seconds, no vocals, no lyrics, no choir. Intense but sustainable classical chamber combat music for dangerous elite encounters across the tower. Driving piano ostinato, spiccato strings, low cello, bass clarinet, muted timpani taps, and brief glass-crack celesta. It should feel sharper than normal battle but playable for several minutes. 124 BPM, gothic stained-glass energy, no pipe organ, no constant brass, no trailer drums, no hard ending, no fadeout.

### 14. `paleOnes` — Witchlight Motes

Use: hidden Pale Ones trail.

SUNO prompt:

Instrumental seamless hidden-combat loop, 90–120 seconds, no vocals, no lyrics, no choir. Eerie rare-encounter music for pale glass enemies appearing without explanation. Sparse piano, high celesta, glass harmonica, muted strings, cold harmonics, and soft ticking pizzicato. The lantern motif is bleached and incomplete, like moonlight through frosted stained glass. 84 BPM, mysterious but not horror, low volume, no pipe organ, no jump scares, no hard ending, no fadeout.

### 15. `shadeDuel` — The Duel That Remembers

Use: duel against your own Shade.

SUNO prompt:

Instrumental seamless duel loop, 90–120 seconds, no vocals, no lyrics, no choir. Haunted classical chamber music for fighting your own shade, a glass hero memory that remembers dying. Solo piano plays the lantern motif backwards, answered by solo cello, shadowy viola tremolo, and faint celesta cracks. Intimate boss-duel tension, emotional but not melodramatic. 96 BPM, dark mirror gothic mood, no pipe organ, no loud percussion, no hard ending, no fadeout.

### 16. `usurper` — Lantern With No Flame

Use: Usurped Act 3 summit boss.

SUNO prompt:

Instrumental seamless boss-variant loop, 90–120 seconds, no vocals, no lyrics, no choir. Ominous classical theme for The Usurper, a false sovereign revealed by a lantern with no flame. Cold piano ostinato, crooked royal string intervals, contrabass and bass clarinet pressure, celesta shards slightly detuned. The lantern motif is corrupted and hollow. 108 BPM, darker than the normal final boss but less loud, no pipe organ, no trailer drums, no hard ending, no fadeout.

### 17. `eighthOmen` — Broken Glyph Run

Use: brutal Eighth Omen run modifier.

SUNO prompt:

Instrumental seamless run-modifier loop, 90–120 seconds, no vocals, no lyrics, no choir. Strange classical music for a brutal eighth omen with broken glyphs. Prepared piano, irregular string pizzicato, low viola tremolo, bass clarinet, muted timpani taps, and fractured celesta. The rhythm feels cursed, like a waltz with missing steps, but remains playable for a long run. 100 BPM, tense but not exhausting, no pipe organ, no horror stingers, no hard ending, no fadeout.

### 18. `unreadablePage` — It Reads Itself

Use: Unreadable Page hidden story / dawn reading.

SUNO prompt:

Instrumental seamless quiet loop, 90–120 seconds, no vocals, no lyrics, no choir. Mysterious classical background for an unreadable page slowly revealing hidden story at dawn. Felt piano, solo violin harmonics, glass harmonica, harp, and soft page-turn texture made from brushed strings. The lantern motif appears as hesitant single notes gradually forming a phrase. 64 BPM, fragile gothic manuscript mood, very soft dynamics, no pipe organ, no spoken words, no hard ending, no fadeout.

### 19. `hollowLamplighter` — The Unlit Way

Use: Hollow Lamplighter meetings in unlit nodes.

SUNO prompt:

Instrumental seamless dialogue loop, 90–120 seconds, no vocals, no lyrics, no choir. Melancholic classical chamber music for meeting a hollow lamplighter on the unlit way. Solo piano, low cello, bass clarinet, sparse celesta, and very soft bowed cymbal texture. It feels like a remembered conversation where every answer costs something. 68 BPM, restrained lantern gothic mood, intimate and readable under dialogue, no pipe organ, no big percussion, no fadeout, no hard ending.

### 20. `sealedDoor` — The Climb Continues

Use: six shards complete, sealed Act 4 door promise.

SUNO prompt:

Instrumental seamless reveal loop, 90–120 seconds, no vocals, no lyrics, no choir. Awe-filled classical music for a sealed door above the summit after six stained-glass shards light a rose window. Slow piano chords, full chamber strings in restrained grandeur, celesta and glass harmonica shimmer, harp, and a single distant low pipe-organ chord only as a deep shadow. 56 BPM, sacred but not churchy, mysterious promise of Act 4, no loud climax, no hard ending, no fadeout.

### 21. `victory` — The Only Sunrise

Use: Act 1/2 boss-victory transition and final run victory / dawn screen.

SUNO prompt:

Instrumental seamless victory game loop, 90–120 seconds, no vocals, no lyrics, no choir. Warm classical victory music for the only sunrise in a dark stained-glass tower. Piano opens with the lantern motif in major, strings bloom gently, harp and celesta catch glass shards in golden light, and soft horn adds warmth without fanfare. 72 BPM, uplifting but not cheesy, elegant dawn after a hard climb, no pipe organ, no triumphant trailer drums, no choir, no hard ending, no fadeout.

### 22. `defeat` — A Mark in the Dark

Use: final run defeat / monument screen.

SUNO prompt:

Instrumental seamless quiet defeat loop, 90–120 seconds, no vocals, no lyrics, no choir. Sombre classical music for a fallen glass climber becoming a monument in the dark. Felt piano, solo cello, soft contrabass, distant celesta, and faint glass crack texture. The lantern motif loses its final note and remains unresolved but not hopeless. 58 BPM, emotional restraint, quiet enough for reflection, no pipe organ, no choir, no big percussion, no hard ending, no fadeout.
