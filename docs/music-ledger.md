我建議 **22 首 BGM**。唔好逐隻普通怪都有一首，會太散；應該用「畫面狀態 + act + boss + hidden chain」去分。Repo 目前主線是 3 acts / 3 bosses，世界觀是 glass creatures、lantern light、The Vigil meta-progression；最新 current spec 再加入 Emberglass 六 shard、Rose Window、sealed Act 4 door 的隱藏長線。

**Wiring (live):** assets live at `src/assets/musics/<kebab>.mp3`, played via Music Cues in `src/music.js` (`music.play(cueId)`). See `CONTEXT.md` (Audio) and `docs/adr/0001-music-cue-layer.md`. Hidden-suite cues are registered but unwired until content lands.

另外，以下仍係「音樂方向 + SUNO prompt」設計稿（display titles）；runtime 用 camelCase cue ids。

整體音樂 DNA：**classical gothic stained-glass chamber music**，主旋律由 piano / celesta / glass harmonica / strings 帶出，低音用 cello / contrabass / bass clarinet，percussion 只做柔和推進。**Pipe organ 只喺 final boss 同 sealed door 少量出現**，唔好每首都 church organ。

### 1. Title — “Stained Glass Inscription”

**用途：** title screen，冷靜、漂亮、第一印象。
**SUNO prompt:**
Instrumental only, no vocals, no choir, no lyrics. Calm classical gothic chamber music for a stained-glass roguelite title screen. Solo felt piano introduces a simple four-note lantern motif, answered by soft strings, celesta, and faint glass harmonica shimmer. Warm amber light in an ink-black cathedral world, elegant but not religious, no pipe organ. Slow 70 BPM, minor key with hopeful suspended chords, seamless loop, gentle dynamics, no loud climax, game background music.

### 2. Embark — “Light Your Lantern”

**用途：** Begin the Climb / aspect / vow selection，準備出發但未緊張。
**SUNO prompt:**
Instrumental only, no vocals, no choir, no lyrics. Gentle classical chamber orchestra for a pre-run embark screen in a glass-and-lantern roguelite. Piano arpeggios, pizzicato strings, soft harp, celesta sparks, and a small woodwind countermelody. Calm but purposeful, like lighting a lantern before climbing a dark tower. Same four-note lantern motif from the title, slightly brighter. 82 BPM, loopable, restrained, no pipe organ, no cinematic trailer drums.

### 3. The Vigil — “Monuments in the Dark”

**用途：** meta-progression / deeds / death memory screen。
**SUNO prompt:**
Instrumental only, no vocals, no choir, no lyrics. Quiet classical elegy for a meta-progression vigil screen, where failed runs become monuments in darkness. Felt piano, solo cello, low viola, distant celesta, and soft bowed glass textures. Gothic stained-glass mood, reflective and intimate, not sad enough to be depressing. Slow 62 BPM, long loop, very low intensity, warm lantern motif fragmented like memory, no pipe organ, no percussion except faint heartbeat-like bass pizzicato.

### 4. Rose Window — “Six Dark Panes”

**用途：** Emberglass / whisper log / hidden quest progress。
**SUNO prompt:**
Instrumental only, no vocals, no choir, no lyrics. Mysterious classical chamber music for a dark rose window with six unlit stained-glass panes. Celesta, glass harmonica, harp harmonics, muted strings, and sparse piano notes. The lantern motif appears as six separated notes, slowly becoming clearer. Gothic but delicate, magical mystery rather than horror. 58 BPM, seamless loop, no pipe organ, no voices, no big percussion, soft shimmer, suitable for long menu reading.

### 5. Tower Map — “Lanterns on the Face of the Spire”

**用途：** 3D tower map / route selection / climbing between nodes。
**SUNO prompt:**
Instrumental only, no vocals, no choir, no lyrics. Loopable classical adventure background for climbing a 3D tower by lantern light. Light piano ostinato, pizzicato strings, harp, bassoon, and subtle celesta, playful but calm. Feels like choosing a path on a spiral of burning lanterns above moonlit clouds. 96 BPM, progressive but not loud, elegant gothic stained-glass tone, no pipe organ, no rock drums, no sudden ending.

### 6. Safe Nodes — “Cold Goods, Warm Price”

**用途：** merchant / treasure / rest / forge / campfire / quiet nodes。
**SUNO prompt:**
Instrumental only, no vocals, no choir, no lyrics. Cozy but suspicious classical chamber music for merchant, campfire, treasure, and rest nodes in a gothic glass tower. Upright piano, muted viola, bass clarinet, pizzicato cello, tiny bell and coin-like celesta accents. Warm lantern comfort with a sly shadow underneath. 76 BPM, loopable, gentle dynamics, no pipe organ, no tavern folk style, no loud percussion, background music for decision screens.

### 7. Act 1 Combat — “Ashen Woods Scherzo”

**用途：** Act 1 normal fights: Ashen Woods。Act 1 is The Ashen Woods with Rootheart as boss.
**SUNO prompt:**
Instrumental only, no vocals, no choir, no lyrics. Playful progressive classical combat loop for an ashen forest full of glass beasts, spores, roots, and lantern sparks. Piano and string quartet lead a light scherzo rhythm, with bassoon, clarinet, pizzicato cello, and small wooden percussion. Gothic stained-glass fantasy, energetic but not aggressive, 112 BPM, minor key with mischievous turns, no pipe organ, no heavy drums, no bombast, seamless game BGM loop.

### 8. Act 1 Boss — “The Rootheart Awakens”

**用途：** The Rootheart boss。Rootheart has awaken, root lash, spores, entangle, colossal slam moves.
**SUNO prompt:**
Instrumental only, no vocals, no choir, no lyrics. Classical boss battle music for The Rootheart, a living glass tree boss with fire inside. Low strings pulse like roots under stone, piano strikes sharp stained-glass chords, bassoon and contrabass answer with heavy wooden motifs, celesta cracks sparkle above. Serious but still loopable, 104 BPM, gradual tension without constant loudness, no pipe organ, no choir, no trailer percussion, dark forest gothic boss theme.

### 9. Act 2 Combat — “Sunken City Waltz”

**用途：** Act 2 normal fights: Sunken City。Act 2 is The Sunken City with Leviathan’s Maw as boss.
**SUNO prompt:**
Instrumental only, no vocals, no choir, no lyrics. Classical underwater gothic combat loop for a drowned city of glass, brine, eels, shells, and sunken cathedral light. Piano in flowing 6/8, harp ripples, muted strings, bass clarinet, soft timpani rolls like distant pressure. Playful but darker than Act 1, progressive and readable as game BGM, 92 BPM, loopable, no pipe organ, no choir, no ocean ambience overpowering the music.

### 10. Act 2 Boss — “Leviathan’s Maw”

**用途：** Leviathan’s Maw boss。Leviathan uses rising tide, crushing jaws, black brine, consume, cataclysm.
**SUNO prompt:**
Instrumental only, no vocals, no choir, no lyrics. Classical aquatic boss theme for Leviathan’s Maw, immense stained-glass sea monster beneath a drowned city. Deep cello and contrabass ostinato, piano low-register waves, brass very restrained, harp glissandi like brine, celesta shards like broken glass. 88 BPM in dark 6/8, heavy but not too loud, loopable, no pipe organ, no choir, no cinematic explosion, tense underwater gothic orchestral BGM.

### 11. Act 3 Combat — “The Cracked Astral Court”

**用途：** Act 3 normal fights: Obsidian Spire / astral court。Act 3 art direction is broken astral court, judgement eyes, crown shards, orbit rings, star-fire, black stone.
**SUNO prompt:**
Instrumental only, no vocals, no choir, no lyrics. Progressive classical combat loop for the Cracked Astral Court at the top of an obsidian spire. Piano ostinato, sharp staccato strings, celesta star-glass, bass clarinet, low viola tremolo, tiny tarnished-gold bell accents. Strange court ceremony, broken orbit halos, magenta judgement core energy. 118 BPM, elegant and tense, not generic space music, no pipe organ, no choir, no rock drums, seamless loop.

### 12. Act 3 Boss — “The Eternal Sovereign”

**用途：** final main boss。The Eternal Sovereign has scepter, gravitas, starfall, word of ruin, ascend, annihilation.
**SUNO prompt:**
Instrumental only, no vocals, no choir, no lyrics. Grand but controlled classical final boss theme for The Eternal Sovereign, a cracked astral-court stained-glass monarch with black-sun halo, scepter, and magenta judgement core. Piano and full strings drive a severe court dance, low brass supports, celesta shards sparkle, with only a very subtle low pipe-organ pedal in the final layer. 112 BPM, loopable, majestic gothic, no choir, no lyrics, no overblown trailer drums.

### 13. Elite / Affix Combat — “Named Afflictions”

**用途：** elite fights / affixed elites / higher-risk nodes across acts。Spec says elites can arrive with one of six named affixes.
**SUNO prompt:**
Instrumental only, no vocals, no choir, no lyrics. Intense but sustainable classical elite-combat loop for a roguelite deckbuilder, usable across all acts. Driving piano ostinato, spiccato strings, low cello, bass clarinet, muted timpani, and celesta glass cracks. Feels like a normal battle has become sharper and more dangerous, but still playable for several minutes. 124 BPM, gothic stained-glass chamber orchestra, no pipe organ, no choir, no constant loud brass, seamless loop.

### 14. Pale Ones — “Witchlight Motes”

**用途：** hidden quest 1, Pale Ones trail。Pale Ones are fixed opener after win 1, pale variants, motes, Witchlight Lens.
**SUNO prompt:**
Instrumental only, no vocals, no choir, no lyrics. Eerie hidden-quest combat loop for pale glass enemies appearing without explanation. Sparse piano, high celesta, glass harmonica, muted strings, cold harmonics, and soft ticking pizzicato. The normal lantern motif is bleached and incomplete, like moonlight through frosted stained glass. 84 BPM, mysterious but not horror, low volume, loopable, no pipe organ, no choir, no jump scares, background music for rare secret encounters.

### 15. Your Own Shade — “The Duel That Remembers”

**用途：** hidden quest 2, player shade duel。Spec describes a duel against your own hero, three shade stages, each stronger, with story fragments.
**SUNO prompt:**
Instrumental only, no vocals, no choir, no lyrics. Haunted classical duel music against your own shade, a glass hero memory that remembers dying. Solo piano plays the lantern motif backwards, answered by solo cello and shadowy viola tremolo. Later layers add restrained string quartet tension and faint celesta cracks. 96 BPM, intimate boss-duel feeling, emotional but not melodramatic, loopable, no pipe organ, no choir, no loud percussion, dark mirror gothic BGM.

### 16. The Usurper — “Lantern With No Flame”

**用途：** hidden quest 3, Usurped Act 3 summit boss。Spec has Act 2+ merchants selling a lantern with no flame; buy it and reach Act 3 summit, boss is replaced by Usurped variant.
**SUNO prompt:**
Instrumental only, no vocals, no choir, no lyrics. Ominous classical boss-variant theme for The Usurper, a false sovereign revealed by a lantern with no flame. Piano hammers a cold ostinato, strings play crooked royal intervals, contrabass and bass clarinet create pressure, celesta shards appear out of tune. 108 BPM, gothic court ceremony corrupted, darker than the normal final boss but less loud, loopable, no pipe organ, no choir, no trailer drums.

### 17. The Eighth Omen — “Broken Glyph Run”

**用途：** hidden quest 4, brutal omen run。Spec says Eighth Omen has broken glyph banner and requires winning the entire run under it.
**SUNO prompt:**
Instrumental only, no vocals, no choir, no lyrics. Strange classical run modifier music for a brutal eighth omen with broken glyphs. Prepared piano, irregular string pizzicato, low viola tremolo, bass clarinet, muted timpani taps, and fractured celesta. The rhythm feels slightly cursed but still playable, like a waltz with missing steps. 100 BPM, loopable for long gameplay, tense but not exhausting, no pipe organ, no choir, no horror stingers, no vocals.

### 18. Unreadable Page — “It Reads Itself”

**用途：** hidden quest 5, curse-like page / dawn reading。Spec describes Unreadable Page as an unplayable card that clogs the deck; winning with pages reveals hidden story over five wins.
**SUNO prompt:**
Instrumental only, no vocals, no choir, no lyrics. Quiet mysterious classical background for an unreadable page slowly revealing hidden story at dawn. Felt piano, solo violin harmonics, glass harmonica, harp, and soft page-turn percussion made from brushed strings. The lantern motif appears as hesitant single notes, gradually forming a phrase. 64 BPM, fragile gothic manuscript mood, loopable, very soft dynamics, no pipe organ, no choir, no spoken words, no lyrical melody.

### 19. Hollow Lamplighter — “The Unlit Way”

**用途：** hidden quest 6, unlit nodes / hollow lamplighter meetings。Spec says a gaunt lamplighter waits in unlit nodes and asks escalating prices.
**SUNO prompt:**
Instrumental only, no vocals, no choir, no lyrics. Melancholic classical chamber music for meeting a hollow lamplighter on the unlit way. Solo piano, low cello, bass clarinet, sparse celesta, and very soft bowed cymbal texture. Feels like a remembered conversation where every answer costs something. 68 BPM, restrained gothic lantern mood, loopable, intimate, no pipe organ, no choir, no vocals, no big percussion, suitable for dialogue and secret event screens.

### 20. Sealed Door — “The Climb Continues”

**用途：** six shards complete / sealed Act 4 door promise。Spec says six shards complete the mural and reveal a sealed summit door with “the climb continues”; playable Act 4 is future content.
**SUNO prompt:**
Instrumental only, no vocals, no choir, no lyrics. Awe-filled classical reveal music for a sealed door above the summit after six stained-glass shards light a rose window. Slow piano chords, full strings in restrained grandeur, celesta and glass harmonica shimmer, harp, and a single distant low pipe-organ chord only at the deepest layer. 56 BPM, sacred but not churchy, mysterious promise of Act 4, loopable, no choir, no lyrics, no loud climax.

### 21. Victory / Dawn — “The Only Sunrise”

**用途：** victory screen / dawn / boss kill ceremony。README says victory floods the Spire with the only sunrise in the game.
**SUNO prompt:**
Instrumental only, no vocals, no choir, no lyrics. Warm classical victory music for the only sunrise in a dark stained-glass tower. Piano opens with the lantern motif in major, strings bloom gently, harp and celesta catch glass shards in golden light, soft horn only for warmth. 72 BPM, uplifting but not cheesy, short loop or 90-second cue, no pipe organ, no choir, no vocals, no triumphant trailer drums, elegant dawn after a hard climb.

### 22. Defeat / Monument — “A Mark in the Dark”

**用途：** defeat screen / fall monument / run end。The Vigil remembers falls and death can carve a monument recovered next climb.
**SUNO prompt:**
Instrumental only, no vocals, no choir, no lyrics. Somber classical defeat music for a fallen glass climber becoming a monument in the dark. Felt piano, solo cello, soft contrabass, distant celesta, and very faint glass crack texture. The lantern motif loses its final note, unresolved but not hopeless. 58 BPM, quiet, loopable, emotional restraint, no pipe organ, no choir, no vocals, no big percussion, suitable for death screen and reflection.

My take: **先做 14 首 essential**：1–13 加 21/22，遊戲已經會完整；再做 **14–20 hidden suite**，等 Emberglass / Act 4 door 線上場時，玩家會即刻感到「呢條線唔同咗」。
