# SFX Ledger

Runtime samples live in `src/assets/sfx/<id>.mp3`. Playback is `sfx.<id>()` or `sfx.attack({ who, amount, blocked })` from `src/audio.js`. Preview at `?audio=1`.

This ledger is the source of truth for generating the ElevenLabs SFX samples. Keep the ids in sync with `SAMPLE_URLS` in `src/audio.js`; do not add a new id here until code imports and plays it.

## Global SFX direction

Spirebound SFX should feel like a stained-glass gothic card roguelite: glass facets, lead cames, amber lantern fire, soft stone, paper-card motion, restrained magic, and occasional deep boss weight. The score is classical piano / chamber orchestra / celesta / glass harmonica, so SFX must be short, dry, and mostly non-musical. Let the background music own melody, harmony, and long tails.

Default ElevenLabs suffix to keep in every prompt unless the row says otherwise:

> No voice, no speech, no singing, no choir, no music, no melody, no organ, no long reverb, no jump scare, no gore, clean dry game one-shot, silence trimmed.

Mixing targets:

- Keep most one-shots under 0.8s. Only `bigDeath`, `victory`, `defeat`, `art`, and `omen` may have a 1.0-1.6s tail.
- Avoid sustained tones around piano / cello territory. Prefer brief glass transients above the music and soft body below it.
- Use reverb like a room reflection, not a cathedral. The game can play SFX over long-loop BGM, so long tails will muddy quickly.
- Hero actions should feel warm amber and precise. Enemy actions should feel colder, heavier, and less polished.
- Glass should be present but not painfully bright. No harsh 8-10 kHz ice-pick shards.
- Never bake in UI words, whooshing logos, orchestral hits, risers, trailer booms, or musical fanfares.
- Generate 2-4 variants per id and pick the simplest one that still reads instantly in a mix.

## UI

| Id | Usage | Target | ElevenLabs SFX prompt | Mix note |
|----|--------|--------|-----------------------|----------|
| `click` | Buttons, menus, title / embark / vigil actions, pile buttons, overlay OK/skip/close, Audio panel interactions | 0.10-0.16s | Short dry stained-glass UI click: a tiny leaded-glass tap with a soft amber ember tick, crisp and gentle, premium fantasy card game interface. No voice, no music, no melody, no long reverb, silence trimmed. | Must sit under music and survive rapid menu use. No cartoon beep. |
| `hover` | Card hover in hand, targeting / option hover, lamplighter art hover | 0.06-0.12s | Very soft stained-glass hover glint: tiny glass shimmer and warm lantern breath, barely there, elegant gothic game UI. No voice, no music, no melody, no long reverb, silence trimmed. | Quieter than `click`; should not become annoying when repeated. |

## Cards

| Id | Usage | Target | ElevenLabs SFX prompt | Mix note |
|----|--------|--------|-----------------------|----------|
| `card` | Card play motion, toss phial, discard/exhaust fidget, shop remove, event remove-card | 0.25-0.40s | Dry fantasy card movement: stiff glass-lacquered card pane sliding and flicking through air, soft paper edge, tiny stained-glass sparkle at the end. No voice, no music, no melody, no long reverb, silence trimmed. | Avoid big whoosh. It plays often in combat. |
| `draw` | Draw-to-hand, staggered once per card drawn | 0.12-0.24s | Quick card draw one-shot: several thin glass-backed cards lift from a deck with a soft shuffle, light paper scrape, tiny amber glint. No voice, no music, no melody, no long reverb, silence trimmed. | Shorter and lighter than `card`; repeated in bursts. |

## Attack

Resolved by `sfx.attack({ who, amount, blocked })`. Tier uses `amount + blocked`: light ≤ 5, medium 6-15, heavy ≥ 16. Attack samples own impact feel; do not layer old `slash` / `hit` into the live attack path.

| Id | Usage | Target | ElevenLabs SFX prompt | Mix note |
|----|--------|--------|-----------------------|----------|
| `atkHeroLight` | Hero hits enemy, light | 0.18-0.28s | Light hero attack against a glass creature: fast amber glass blade nick, tiny crack tick, small shard sparkle, precise and agile. No voice, no music, no melody, no organ, no gore, dry game one-shot, silence trimmed. | Warm, bright, low bass. Should not mask card sounds. |
| `atkHeroMed` | Hero hits enemy, medium | 0.28-0.45s | Medium hero attack against stained-glass monster: sharp glass sword slash, firm leaded-glass impact, a few crackling shards, restrained low thump. No voice, no music, no melody, no organ, no gore, dry game one-shot, silence trimmed. | Main bread-and-butter attack; keep readable but not huge. |
| `atkHeroHeavy` | Hero hits enemy, heavy | 0.45-0.70s | Heavy hero attack on a stained-glass creature: powerful amber glass blade strike, deep controlled impact, broad crack spreading through glass, shards burst then stop quickly. No voice, no music, no melody, no organ, no gore, dry game one-shot, silence trimmed. | Bigger transient, but leave room for boss music. No trailer boom. |
| `atkEnemyLight` | Enemy hits player, light | 0.18-0.30s | Light enemy hit on the hero's lantern-glass body: cold glass claw scrape, small dark chip, dull tiny impact, hostile but restrained. No voice, no music, no melody, no organ, no gore, dry game one-shot, silence trimmed. | Cooler and darker than hero light attack. |
| `atkEnemyMed` | Enemy hits player, medium | 0.30-0.50s | Medium enemy hit on lantern ward and glass body: cold stained-glass strike, rough stone-and-glass impact, brief crackle of dark shards, controlled low body. No voice, no music, no melody, no organ, no gore, dry game one-shot, silence trimmed. | Should feel threatening without drowning combat BGM. |
| `atkEnemyHeavy` | Enemy hits player, heavy | 0.50-0.75s | Heavy enemy blow against the hero: massive cold glass and stone impact, lantern flame buckles, deep thud, short burst of dark shards, no gore. No voice, no music, no melody, no organ, dry game one-shot, silence trimmed. | Use bass sparingly; avoid cinematic explosion. |

### Legacy

These files stay on disk for compatibility. They are not the live attack feel.

| Id | Usage | Target | ElevenLabs SFX prompt | Mix note |
|----|--------|--------|-----------------------|----------|
| `slash` | Old swing sample; `sfx.slash()` now routes to medium hero attack | 0.25-0.40s | Deprecated compatibility slash: dry fantasy glass blade swing with a small amber edge, no impact, no voice, no music, no melody, silence trimmed. | Regenerate only if the file is missing. |
| `hit` | Old impact sample; `sfx.hit()` is a no-op | 0.18-0.30s | Deprecated compatibility hit: short dull glass impact, tiny crack, no gore, no voice, no music, no melody, silence trimmed. | Regenerate only if the file is missing. |

## Combat

| Id | Usage | Target | ElevenLabs SFX prompt | Mix note |
|----|--------|--------|-----------------------|----------|
| `blocked` | Damage absorbed by Ward; thorns ping; adamant hold; guard-shatter companion | 0.18-0.32s | Ward absorbs a hit: thick stained-glass shield holds, resonant leaded-glass clink, tiny sparkle, no break. No voice, no music, no melody, no organ, dry game one-shot, silence trimmed. | Distinct from `block`: this is impact stopped, not shield creation. |
| `block` | Gain Ward | 0.28-0.45s | Protective Ward forms around the hero: warm panes of lantern glass snap gently into place, soft upward shimmer, calm magical protection. No voice, no music, no melody, no organ, dry game one-shot, silence trimmed. | Softer attack, slightly rising shape, but not a musical arpeggio. |
| `poison` | Smolder / poison apply or tick, enemy or player | 0.30-0.55s | Smolder effect under glass: ember sizzle trapped inside stained glass, soft crackling heat, faint smoky hiss, magical burn. No voice, no music, no melody, no organ, no gore, dry game one-shot, silence trimmed. | This represents Smolder more than literal poison; avoid wet slime. |
| `debuff` | Debuff apply; burn / self damage; can't-afford shop feedback; some notices | 0.25-0.45s | Negative status lands: cold glass dulls and warps, brief cracked chime falling downward, tiny ash puff, restrained curse texture. No voice, no music, no melody, no organ, dry game one-shot, silence trimmed. | Do not make it too spooky; it fires often. |
| `buff` | Buff apply; power settle into glass | 0.35-0.55s | Positive power settles into living glass: warm amber glow, soft glass resonance, small confident shimmer, restrained magical lift. No voice, no music, no melody, no organ, dry game one-shot, silence trimmed. | Warm but not a fanfare. Keep below `art`. |
| `heal` | Heal feedback, combat heal and rest heal | 0.45-0.75s | Lantern light heals cracked glass: warm flame breath, tiny cracks sealing, soft glass sparkle, gentle relief. No voice, no music, no melody, no organ, dry game one-shot, silence trimmed. | Smooth and comforting; avoid bright coin-like chimes. |
| `energy` | Energy gain sample, wired in audio and rarely called from UI today | 0.18-0.30s | Candle energy ignites: quick warm flame pop, tiny glass wick ping, clean magical charge. No voice, no music, no melody, no organ, dry game one-shot, silence trimmed. | Very short. Should not overlap heavily with turn cue. |
| `death` | Normal enemy death | 0.55-0.85s | Normal glass creature death: stained-glass body fractures, small shards scatter, inner ember sigh fades quickly, no gore. No voice, no music, no melody, no organ, dry game one-shot, silence trimmed. | Must be satisfying but lower than `shatter` and `bigDeath`. |
| `bigDeath` | Elite / boss death; also boss intro sting when a boss fight starts | 1.10-1.60s | Large elite or boss glass body breaks with ceremony: deep controlled crack, heavy stained-glass collapse, ember core drops out, shards rain briefly, dark gothic weight. No voice, no music, no melody, no choir, no organ, no long reverb, dry game one-shot, silence trimmed. | Also used as boss intro sting, so avoid final-victory sound. |
| `turn` | Your Turn banner, when turn number > 1 | 0.35-0.55s | Turn begins in a lantern-lit card battle: two crisp glass UI chimes and a soft candle flare, confident but restrained. No voice, no music, no melody, no organ, dry game one-shot, silence trimmed. | Should cut through combat softly without becoming a tune. |
| `victory` | Fight-won SFX sting; BGM `victory` is separate, run-end only | 0.90-1.30s | Small combat victory sting: glass shards settle safely, warm lantern flare, brief hopeful shimmer, elegant and restrained. No voice, no music, no melody, no choir, no organ, dry game one-shot, silence trimmed. | Not the final sunrise music. Keep it short. |
| `defeat` | Fight-lost SFX sting; BGM `defeat` is separate, run-end only | 1.00-1.40s | Combat defeat sting: lantern flame gutters, glass body cracks low and hollow, ember fades into dark stone, unresolved but not horror. No voice, no music, no melody, no choir, no organ, dry game one-shot, silence trimmed. | Avoid dramatic orchestral fall; defeat BGM handles emotion. |

## SHATTER / Lantern

| Id | Usage | Target | ElevenLabs SFX prompt | Mix note |
|----|--------|--------|-----------------------|----------|
| `chip` | Facet chip tick | 0.06-0.14s | Tiny Facet chip tick: precise stained-glass crack point, small bright shard ping, very short and sharp. No voice, no music, no melody, no organ, dry game one-shot, silence trimmed. | Signature micro-feedback. Keep crisp but not painful. |
| `shatter` | Shatter burst | 0.55-0.90s | Signature SHATTER burst: living stained-glass creature fractures explosively, bright shards scatter, ember core pulls toward the lantern, satisfying tactical break. No voice, no music, no melody, no choir, no organ, no gore, dry game one-shot, silence trimmed. | Bigger and brighter than `death`; should feel like the core mechanic. |
| `ember` | Ember gain | 0.16-0.28s | Ember gained by the lantern: tiny warm flame bead lifts and clicks into glass, soft amber sparkle, quick magical collect. No voice, no music, no melody, no organ, dry game one-shot, silence trimmed. | Small reward tick; do not sound like a coin. |
| `kindle` | Kindle / lantern feed | 0.45-0.70s | Card kindled into the lantern: paper-glass card edge burns inward, soft amber fire whoosh, embers rise and are swallowed by glass. No voice, no music, no melody, no organ, dry game one-shot, silence trimmed. | Warm, intimate, not explosive. |
| `stagger` | Enemy staggered | 0.28-0.45s | Glass enemy staggered: warped stained-glass wobble, dull off-balance thud, tiny detuned crackle, brief and tactical. No voice, no music, no melody, no organ, dry game one-shot, silence trimmed. | Should read as denied action, not death. |
| `art` | Lantern Art cast | 0.80-1.20s | Lantern Art cast: stored embers surge through stained glass, warm magical ignition, controlled glass resonance, brief powerful release. No voice, no music, no melody, no choir, no organ, dry game one-shot, silence trimmed. | Highest magic one-shot; avoid becoming a musical chord progression. |

## Meta / map / rewards

| Id | Usage | Target | ElevenLabs SFX prompt | Mix note |
|----|--------|--------|-----------------------|----------|
| `coin` | Gold pickup, shop spend, reward gold fly | 0.14-0.24s | Gothic coin pickup: small warm metal coin tick mixed with tiny glass sparkle, elegant shop reward sound, not cartoonish. No voice, no music, no melody, no organ, dry game one-shot, silence trimmed. | Works for gain and spend. Not too bright. |
| `potion` | Use or gain phial | 0.30-0.50s | Glass phial used or gained: delicate bottle clink, liquid ember swirl, tiny cork pop, magical but restrained. No voice, no music, no melody, no organ, dry game one-shot, silence trimmed. | Needs to read as phial, not coin or heal. |
| `relic` | Relic gain, lamplighter confirm, unlock toasts, monument claim | 0.70-1.00s | Relic acquired in a gothic stained-glass roguelite: small ancient object settles into place, warm amber glass resonance, subtle ceremonial shimmer. No voice, no music, no melody, no choir, no organ, dry game one-shot, silence trimmed. | Important reward, but no fanfare. |
| `upgrade` | Card upgrade, rest / forge / event / reward | 0.60-0.90s | Card upgrade at a dark forge: quick hammer kiss on glass, amber spark, crack lines re-form cleaner, satisfying magical polish. No voice, no music, no melody, no organ, dry game one-shot, silence trimmed. | Blend forge and glass; not a blacksmith loop. |
| `map` | Map enter / node travel one-shot, not map BGM | 0.40-0.70s | Travel on a lantern path up a glass tower: soft stone step, lantern whoosh, distant glass map node lighting up, elegant upward motion. No voice, no music, no melody, no organ, dry game one-shot, silence trimmed. | Short transition cue. Do not become ambience. |
| `omen` | Omen banner / omen reveal on act entry | 1.00-1.50s | Omen revealed: broken stained-glass glyphs flare in darkness, low controlled rumble, cold glass scrape, ember light bends wrong. No voice, no speech, no music, no melody, no choir, no organ, no long reverb, dry game one-shot, silence trimmed. | Darkest UI sting; leave space for act music underneath. |

## Review checklist

- Every exported file is named exactly `src/assets/sfx/<id>.mp3`.
- Trim leading silence hard. Leave only a tiny natural tail unless the target allows longer.
- Test in `?audio=1`, then test in real combat with music at default volume.
- Repeated sounds must stay pleasant: `hover`, `draw`, `chip`, `coin`, and `atkHeroMed` are the fatigue risks.
- Attack feel is owned by the six `atk*` ids, not `slash` / `hit`.
- `blocked` vs `block`: former is 'hit was stopped'; latter is 'you gained Ward'.
- SFX `victory` / `defeat` fire at combat end; Music Cues of the same name fire only on the final run-end screen.
- If an SFX sounds like a tiny piece of music, regenerate it. The BGM should carry the classical theme; SFX should provide material, impact, and feedback.