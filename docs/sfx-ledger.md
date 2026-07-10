# Spirebound SFX Ledger v2

The maintained current samples stay at `src/assets/sfx/<id>.mp3` as the immutable `ashglass-v1` pack. New renders live at `src/assets/sfx/<version>/<id>.mp3`; `public/audio-selection.json` selects a complete pack or a per-id override. Playback remains `sfx.<id>()` or `sfx.attack({ who, amount, blocked })` from `src/audio.js`. Preview and switch sources at `?audio=1`.

The rendered `ashglass-v2` pack is installed: all 36 one-shots were produced through the official ElevenLabs sound-generation API, selected across corrective candidate passes, duration-fitted without silence padding, family-normalised, and recorded in a strict provenance manifest. The immutable v1 files remain available for instant rollback; subjective in-game listening remains separate from the machine release gate.

This ledger is the source of truth for generating ElevenLabs SFX candidates. Keep ids in sync with the Node-safe `SFX_CATALOG` contract in `src/audio-catalog.js`. Do not add a new id here until code plays it, and never overwrite the immutable root pack.

## Global SFX direction

Spirebound SFX should feel like a stained-glass gothic card roguelite: glass facets, lead cames, amber lantern fire, soft stone, paper-card motion, restrained magic, and occasional deep boss weight.

The score is classical piano / chamber orchestra / celesta / glass harmonica. SFX must therefore be short, dry, mostly non-musical, and instantly readable. Let the BGM own melody, harmony, and long tails.

## ElevenLabs generation defaults

Use the ElevenLabs text-to-sound model for one-shot samples. The API minimum for `duration_seconds` is 0.5s, so micro-sounds should request 0.5s and then be trimmed down hard after generation.

Recommended defaults:

- `model_id`: `eleven_text_to_sound_v2`
- `loop`: `false`
- Generate 3–5 variants per id.
- Pick the simplest variant that reads instantly in combat.
- Trim leading silence hard.
- Treat the table's **Target after trim** column as the real in-game length.
- Treat **ElevenLabs duration_seconds** as the requested generation length, never below 0.5s.
- Keep natural tails tiny unless the target allows a longer sting.

Global suffix to keep in every prompt:

> No voice, no speech, no singing, no choir, no music, no melody, no arpeggio, no organ, no long reverb, no jump scare, no gore, no trailer boom, clean dry game one-shot, silence trimmed.

## Versioned candidate generation

The generator parses the exact target, request duration, influence, and prompt from each table row. Before appending the canonical global suffix, it removes the row's redundant trailing `No voice, ...` block; this preserves the full positive brief and every global exclusion while keeping the ElevenLabs request within its 450-character limit. It pins `model_id: eleven_text_to_sound_v2` and `loop: false`, and refuses to write into `ashglass-v1`. After silence trimming it crops or gently stretches to the authored target with a tiny safety fade; it never pads silence. The final pass centres every short one-shot for mono compatibility, protects phone-speaker midrange, restrains the fatigue-risk top end, normalises each gameplay family, and writes the strict provenance manifest.

```bash
python3 tools/gen-sfx-from-ledger.py --check-ledger
python3 tools/gen-sfx-from-ledger.py --pack ashglass-v2-a
python3 tools/gen-sfx-from-ledger.py --pack ashglass-v2-b hover draw chip coin atkHeroMed
python3 tools/gen-sfx-from-ledger.py --pack ashglass-v2 --from-raw --variant candidate-b hover draw chip coin atkHeroMed
```

Use separate candidate pack ids for 3–5 passes. Audition them in `?audio=1`, then promote chosen raw responses into a complete version directory with an explicit candidate label; that label is retained in the strict manifest.

## Mix law

- UI and repeated combat sounds should be tiny and fatigue-proof.
- Hero actions are warm amber, precise, and polished.
- Enemy actions are colder, rougher, and heavier.
- Ward sounds are rounded and protective.
- SHATTER sounds are brittle, bright, and tactical.
- Death sounds are final; `bigDeath` is lower and more ceremonial.
- Avoid harsh 8–10 kHz shards. Glass should sparkle without hurting.
- Avoid sustained tones in piano/cello range; the music already lives there.

## Mix QA matrix

- Test at the default Music 0.35 / SFX 0.55 first.
- Retest at Music 0.70 / SFX 0.45 because some players lower effects.
- Retest on phone speakers; bass-heavy boss impacts must not disappear or distort.
- Reject music that stays busy above 5 kHz; that space belongs to glass chips, card draws, and UI glints.
- Reject boss music that fills the whole low end and masks heavy attacks or `bigDeath`.
- Reject any sound that is impressive solo but tiring in combat, or that reads as a tiny piece of music.

## UI

| Id | Usage | Target after trim | ElevenLabs duration_seconds | prompt_influence | ElevenLabs prompt |
|----|-------|-------------------|-----------------------------|------------------|-------------------|
| `click` | Buttons, menus, title / embark / vigil actions, pile buttons, overlay OK/skip/close, Audio panel interactions | 0.12 | 0.5 | 0.55 | Immediate premium UI click: close-miked lead-and-glass knock with most energy in the broad midrange, a soft ember tick, no pre-roll, no high-only ping, no ringing, nothing piercing above 7 kHz. No voice, no speech, no music, no melody, no arpeggio, no organ, no long reverb, clean dry game one-shot, silence trimmed. |
| `hover` | Card hover in hand, targeting / option hover, lamplighter art hover | 0.08 | 0.5 | 0.50 | Immediate tiny hover: quiet leaded-glass movement and warm lantern breath, broad midrange tap, low-passed and soft, no high-only ping, no whistle, no ringing, nothing piercing above 6 kHz. No voice, no speech, no music, no melody, no arpeggio, no organ, no long reverb, clean dry game one-shot, silence trimmed. |

## Cards

| Id | Usage | Target after trim | ElevenLabs duration_seconds | prompt_influence | ElevenLabs prompt |
|----|-------|-------------------|-----------------------------|------------------|-------------------|
| `card` | Card play motion, toss phial, discard/exhaust fidget, shop remove, event remove-card | 0.32 | 0.5 | 0.55 | Dry fantasy card movement: stiff glass-lacquered card pane slides and flicks through air, soft paper edge, tiny stained-glass sparkle at the end, no big whoosh. No voice, no speech, no music, no melody, no arpeggio, no organ, no long reverb, clean dry game one-shot, silence trimmed. |
| `draw` | Draw-to-hand, staggered once per card drawn | 0.18 | 0.5 | 0.55 | Quick card draw one-shot: thin glass-backed cards lift from a deck with soft shuffle, light paper scrape, tiny amber glint, short and repeat-friendly. No voice, no speech, no music, no melody, no arpeggio, no organ, no long reverb, clean dry game one-shot, silence trimmed. |

## Attack

Resolved by `sfx.attack({ who, amount, blocked })`. Tier uses `amount + blocked`: light ≤ 5, medium 6–15, heavy ≥ 16. Attack samples own the whole strike; do not layer old `slash` / `hit` into the live attack path.

| Id | Usage | Target after trim | ElevenLabs duration_seconds | prompt_influence | ElevenLabs prompt |
|----|-------|-------------------|-----------------------------|------------------|-------------------|
| `atkHeroLight` | Hero hits enemy, light | 0.24 | 0.5 | 0.60 | Light hero attack against a glass creature: fast amber glass blade nick, tiny crack tick, small shard sparkle, precise agile impact, low bass absent. No voice, no speech, no music, no melody, no organ, no gore, clean dry game one-shot, silence trimmed. |
| `atkHeroMed` | Hero hits enemy, medium | 0.38 | 0.5 | 0.62 | Medium hero attack against a stained-glass monster: sharp glass sword slash, firm centred leaded-glass impact, brief rounded shards without piercing hiss, restrained low thump, warm amber tone, mono-compatible. No voice, no speech, no music, no melody, no organ, no gore, clean dry game one-shot, silence trimmed. |
| `atkHeroHeavy` | Hero hits enemy, heavy | 0.58 | 0.58 | 0.65 | Heavy hero attack on a stained-glass creature: powerful amber glass blade strike, deep controlled impact, broad crack spreading through glass, short shard burst that stops quickly. No voice, no speech, no music, no melody, no organ, no gore, no trailer boom, clean dry game one-shot, silence trimmed. |
| `atkEnemyLight` | Enemy hits player, light | 0.24 | 0.5 | 0.60 | Light enemy hit on the hero's lantern-glass body: centred cold glass claw scrape, small dark chip and clear midrange crack, hostile but restrained, mono-compatible, no sub-bass. No voice, no speech, no music, no melody, no organ, no gore, clean dry game one-shot, silence trimmed. |
| `atkEnemyMed` | Enemy hits player, medium | 0.42 | 0.5 | 0.62 | Medium enemy hit on lantern ward and glass body: centred cold stained-glass strike, rough stone-and-glass impact, strong midrange shard crackle and compact body, mono-compatible, no sub-bass rumble. No voice, no speech, no music, no melody, no organ, no gore, clean dry game one-shot, silence trimmed. |
| `atkEnemyHeavy` | Enemy hits player, heavy | 0.65 | 0.65 | 0.66 | Heavy enemy blow lasting the full 0.65 seconds: loud centred 600 Hz–4 kHz stone-and-glass body crack followed by rough midrange shards, texture continues to the end, no sub-bass, explosion or bass-only hit. No voice, no speech, no music, no melody, no organ, no gore, no trailer boom, clean dry game one-shot, silence trimmed. |

## Legacy compatibility

These files stay on disk for compatibility. They are not the live attack feel.

| Id | Usage | Target after trim | ElevenLabs duration_seconds | prompt_influence | ElevenLabs prompt |
|----|-------|-------------------|-----------------------------|------------------|-------------------|
| `slash` | Old swing sample; `sfx.slash()` now routes to medium hero attack | 0.30 | 0.5 | 0.45 | Deprecated compatibility slash: dry fantasy glass blade swing with a small amber edge, no impact. No voice, no speech, no music, no melody, no organ, no long reverb, clean dry game one-shot, silence trimmed. |
| `hit` | Old impact sample; `sfx.hit()` is a no-op | 0.22 | 0.5 | 0.45 | Deprecated compatibility hit: short centred dull glass impact, tiny crack, mono-compatible, no gore. No voice, no speech, no music, no melody, no organ, no long reverb, clean dry game one-shot, silence trimmed. |

## Combat

| Id | Usage | Target after trim | ElevenLabs duration_seconds | prompt_influence | ElevenLabs prompt |
|----|-------|-------------------|-----------------------------|------------------|-------------------|
| `blocked` | Damage absorbed by Ward; thorns ping; adamant hold; guard-shatter companion | 0.26 | 0.5 | 0.62 | Ward stops a blow: several irregular high-passed 800 Hz–4 kHz lead-and-glass clacks with broad noisy grit, no bass thud below 300 Hz, sustained resonance, single pitch, bell or beep. No voice, no speech, no music, no melody, no organ, no long reverb, clean dry game one-shot, silence trimmed. |
| `block` | Gain Ward | 0.38 | 0.5 | 0.60 | Protective Ward forms around the hero: warm panes of lantern glass snap gently into place, soft upward shimmer, calm magical protection, no arpeggio. No voice, no speech, no music, no melody, no organ, no long reverb, clean dry game one-shot, silence trimmed. |
| `poison` | Smolder / poison apply or tick, enemy or player | 0.42 | 0.5 | 0.58 | Smolder under glass: warm ember crackle and dry ash texture led by low-mid heat, restrained short hiss below 7 kHz, irregular and non-pitched, not wet poison. No voice, no speech, no music, no melody, no organ, no gore, clean dry game one-shot, silence trimmed. |
| `debuff` | Debuff apply; burn / self damage; cannot-afford shop feedback; notices | 0.34 | 0.5 | 0.58 | Negative status lands: centred cold glass dulls and warps, brief inharmonic crack falling downward without melody, tiny ash puff, restrained mono-compatible curse texture. No voice, no speech, no music, no melody, no organ, no long reverb, clean dry game one-shot, silence trimmed. |
| `buff` | Buff apply; power settle into glass | 0.45 | 0.5 | 0.56 | Positive power settles into living glass: warm amber glow, soft glass resonance, small confident shimmer, restrained magical lift, no fanfare. No voice, no speech, no music, no melody, no arpeggio, no organ, clean dry game one-shot, silence trimmed. |
| `heal` | Heal feedback, combat heal and rest heal | 0.62 | 0.62 | 0.56 | Lantern light heals cracked glass: warm flame breath, tiny cracks sealing, soft glass sparkle, gentle relief, smooth and comforting. No voice, no speech, no music, no melody, no organ, no long reverb, clean dry game one-shot, silence trimmed. |
| `energy` | Energy gain sample; wired from combat `energy` events | 0.22 | 0.5 | 0.55 | Candle energy ignites: centred warm flame pop and broad inharmonic wick crack, strong midrange body, restrained top below 7 kHz, no pure ping, whistle or sustained tone. No voice, no speech, no music, no melody, no arpeggio, no organ, clean dry game one-shot, silence trimmed. |
| `death` | Normal enemy death | 0.72 | 0.72 | 0.64 | Normal glass creature death: broad midrange body collapse, brittle crack and short irregular shard scatter, final but smaller than SHATTER, restrained top below 7 kHz, no high-only spray. No voice, no speech, no music, no melody, no organ, no gore, clean dry game one-shot, silence trimmed. |
| `bigDeath` | Elite / boss death; also boss intro sting when a boss fight starts | 1.30 | 1.3 | 0.68 | Elite or boss death: massive high-passed 300 Hz–4 kHz glass-and-stone body collapse, many broad brittle cracks and dense dark material scatter, deliberately darker than normal death but no sub-bass below 250 Hz, pure rumble or bright hiss. No voice, no speech, no music, no melody, no choir, no organ, no long reverb, clean dry game one-shot, silence trimmed. |
| `turn` | Your Turn banner, when turn number > 1 | 0.44 | 0.5 | 0.55 | Turn begins in a lantern-lit card battle: two crisp non-melodic glass UI chimes and a soft candle flare, confident but restrained. No voice, no speech, no music, no melody, no arpeggio, no organ, clean dry game one-shot, silence trimmed. |
| `victory` | Fight-won SFX sting; not final run-end BGM | 1.05 | 1.05 | 0.55 | Small combat victory texture: broad glass settling, warm lantern flare and brief inharmonic midrange shimmer below 7 kHz, non-pitched, restrained, not a fanfare or high spray. No voice, no speech, no music, no melody, no choir, no organ, clean dry game one-shot, silence trimmed. |
| `defeat` | Fight-lost SFX sting; not final run-end BGM | 1.18 | 1.18 | 0.56 | Full-length compact defeat texture: lantern gutters, low-mid glass body cracks into dark stone and rough ash continues to the end, no fadeout, no silent tail, no single pitch, unresolved but not horror. No voice, no speech, no music, no melody, no choir, no organ, no long reverb, clean dry game one-shot, silence trimmed. |

## SHATTER / Lantern

| Id | Usage | Target after trim | ElevenLabs duration_seconds | prompt_influence | ElevenLabs prompt |
|----|-------|-------------------|-----------------------------|------------------|-------------------|
| `chip` | Facet chip tick | 0.10 | 0.5 | 0.66 | Tiny Facet chip: centred leaded-glass crack with rounded 800 Hz–4 kHz midrange body, low-passed short grit, no high-only ping, no 8–12 kHz shard, never piercing. No voice, no speech, no music, no melody, no organ, no long reverb, clean dry game one-shot, silence trimmed. |
| `shatter` | SHATTER burst | 0.76 | 0.76 | 0.70 | Signature SHATTER: broad stained-glass fracture with clear 2–6 kHz tactical cracks and irregular shards, brighter than normal death but never piercing above 8 kHz, ember core pulls inward, no hiss-only burst. No voice, no speech, no music, no melody, no choir, no organ, no gore, clean dry game one-shot, silence trimmed. |
| `ember` | Ember gain | 0.22 | 0.5 | 0.60 | Ember gained: tiny warm flame bead lifts into glass with a soft broad midrange crackle below 7 kHz, low-passed quick collect, no high ping, no sustained pitch, not a coin. No voice, no speech, no music, no melody, no arpeggio, no organ, clean dry game one-shot, silence trimmed. |
| `kindle` | Kindle / lantern feed | 0.58 | 0.58 | 0.64 | Card kindled into the lantern: paper-glass card edge burns inward, soft amber fire whoosh, embers rise and are swallowed by glass, intimate not explosive. No voice, no speech, no music, no melody, no organ, no long reverb, clean dry game one-shot, silence trimmed. |
| `stagger` | Enemy staggered | 0.36 | 0.5 | 0.60 | Enemy staggered: chaotic cluster of many separate irregular glass rattles and rough 700 Hz–4 kHz body cracks, dense broadband texture, no held note, dominant pitch, resonance, beep or sub-bass, not death. No voice, no speech, no music, no melody, no organ, no long reverb, clean dry game one-shot, silence trimmed. |
| `art` | Lantern Art cast | 0.98 | 0.98 | 0.68 | Lantern Art cast: broad stored-ember ignition led by powerful 500 Hz–5 kHz inharmonic crackle and material rush, restrained top below 7 kHz, no shrill hiss, whistle or pure tone. No voice, no speech, no music, no melody, no choir, no organ, clean dry game one-shot, silence trimmed. |

## Meta / map / rewards

| Id | Usage | Target after trim | ElevenLabs duration_seconds | prompt_influence | ElevenLabs prompt |
|----|-------|-------------------|-----------------------------|------------------|-------------------|
| `coin` | Gold pickup, shop spend, reward gold fly | 0.18 | 0.5 | 0.55 | Gothic coin pickup: small warm metal-and-lead knock with rounded 700 Hz–4 kHz body, low-passed glass grit, no bright arcade ping, no 8–12 kHz ring, never piercing. No voice, no speech, no music, no melody, no arpeggio, no organ, clean dry game one-shot, silence trimmed. |
| `potion` | Use or gain phial | 0.40 | 0.5 | 0.75 | Dry phial uncork action: cork scrape, ceramic grit, granular glass powder and a short air puff create dense broadband 600 Hz–5 kHz noise with several irregular unpitched transients; no bottle ring, liquid glug, bass or held tone. No voice, no speech, no music, no melody, no organ, no long reverb, clean dry game one-shot, silence trimmed. |
| `relic` | Relic gain, lamplighter confirm, unlock toasts, monument claim | 0.82 | 0.82 | 0.58 | Ancient relic settles: layered stone scrape, lead knock and several irregular broad glass contacts, warm noisy ceremonial material with no sustained resonance, single pitch, bell, beep or fanfare. No voice, no speech, no music, no melody, no choir, no organ, clean dry game one-shot, silence trimmed. |
| `upgrade` | Card upgrade, rest / forge / event / reward | 0.74 | 0.74 | 0.60 | Card upgrade at a dark forge: quick hammer kiss on glass, amber spark, crack lines re-form cleaner, satisfying magical polish, single action not blacksmith loop. No voice, no speech, no music, no melody, no organ, clean dry game one-shot, silence trimmed. |
| `map` | Map enter / node travel one-shot, not map BGM | 0.52 | 0.52 | 0.56 | Travel up a glass tower: soft centred stone step, short low-passed lantern rush and broad inharmonic lead-glass node crack below 7 kHz, no high ping or sustained pitch, not ambience. No voice, no speech, no music, no melody, no arpeggio, no organ, clean dry game one-shot, silence trimmed. |
| `omen` | Omen banner / omen reveal on act entry | 1.25 | 1.25 | 0.66 | Omen revealed: broken stained-glass glyphs flare in darkness, low controlled rumble, cold glass scrape, ember light bends wrong, darkest UI sting. No voice, no speech, no music, no melody, no choir, no organ, no long reverb, no trailer boom, clean dry game one-shot, silence trimmed. |

## Hidden-chain reuse notes

Until Phase 2 adds dedicated ids, reuse the existing family carefully:

- Rose Window pane lights: `relic` quietly, or `ember` for small pane progress.
- Pale mote gained: `ember`, but lower volume if possible.
- Shade duel stage clear: `shatter` plus `relic` only if the shard is granted.
- Unreadable Page reads itself: `upgrade` if it modifies the deck/story state; otherwise `relic` quietly.
- Hollow Lamplighter payment: `debuff` for cost, then `relic` for accepted bargain.
- Sealed door appears: `omen` into `relic`, but avoid stacking over the sealed-door BGM too loudly.

## Review checklist

- Every candidate file is named exactly `src/assets/sfx/<version>/<id>.mp3`; the immutable root files remain `ashglass-v1`.
- Test each file in `?audio=1`, then test in real combat with music at default volume.
- Repeated sounds must stay pleasant: `hover`, `draw`, `chip`, `coin`, and `atkHeroMed` are the fatigue risks.
- `blocked` vs `block`: former is hit stopped; latter is Ward gained.
- `death`, `shatter`, and `bigDeath` must be related but clearly different.
- If an SFX sounds like a tiny piece of music, regenerate it.
