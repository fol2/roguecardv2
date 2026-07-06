# Readable Baseline Asset Set

Inactive candidate asset set for the silhouette-first Spirebound raster style.

The folder mirrors `src/assets/<category>/<id>.png`, but normal gameplay does
not select it while the folder is named `assets-readable-baseline`.

Council-approved baseline assets:

- `heroes/duskblade.png`
- `heroes/ashwarden.png`
- `enemies/duskfang.png`
- `enemies/sporeling.png`
- `enemies/gloomslime.png`
- `enemies/waylayer.png`
- `enemies/thornling.png`
- `enemies/ashAcolyte.png`
- `enemies/gravewarden.png`
- `enemies/alphaFang.png`
- `enemies/rootheart.png`
- `enemies/drownedOne.png`
- `enemies/voltEel.png`
- `enemies/mirelurker.png`
- `enemies/tidecaller.png`
- `enemies/shellback.png`
- `enemies/deepmaw.png`
- `enemies/abyssalKnight.png`
- `enemies/siren.png`
- `enemies/leviathan.png`
- `enemies/voidWisp.png`
- `enemies/obsidianGolem.png`
- `enemies/starCultist.png`
- `enemies/shade.png`
- `enemies/chaosHound.png`
- `enemies/watcherEye.png`
- `enemies/voidColossus.png`
- `enemies/heraldOfEnd.png`
- `enemies/sovereign.png`
- `potions/healing.png`
- `potions/strength.png`
- `potions/swift.png`
- `potions/block.png`
- `potions/fire.png`
- `potions/venom.png`
- `potions/energy.png`
- `cards/strike.png`
- `cards/defend.png`
- `cards/empower.png`
- `cards/eclipseSlash.png`
- `cards/chisel.png`
- `cards/firstSpark.png`
- `cards/ashBite.png`
- `cards/smother.png`
- `cards/twinFangs.png`
- `cards/quickSlash.png`
- `cards/heavyBlow.png`
- `cards/cleave.png`
- `cards/venomStrike.png`
- `cards/lunge.png`
- `cards/guardedStrike.png`
- `cards/brace.png`
- `cards/sidestep.png`
- `cards/preparation.png`
- `cards/deflect.png`
- `cards/leechBlade.png`
- `cards/tempest.png`
- `cards/uppercut.png`
- `cards/flurry.png`
- `cards/executioner.png`
- `cards/momentum.png`
- `cards/toxicMist.png`
- `cards/cripple.png`
- `props/campfire.png`
- `props/chest.png`
- `props/chest-open.png`
- `props/merchant.png`
- `events/forgottenShrine.png`
- `events/woundedKnight.png`
- `events/voidChest.png`
- `events/emberFountain.png`
- `events/forge.png`
- `events/gambler.png`
- `events/mirror.png`
- `events/library.png`
- `events/fleshTrader.png`
- `events/cursedIdol.png`
- `events/ruinedCamp.png`

Asset source decisions:

- `heroes/duskblade.png` uses the Nano Banana alpha version.
- `heroes/ashwarden.png` and all approved enemies use the gpt-image-2 source
  alpha after warm outer-rim cleanup via `tools/strip-alpha-rim.py`.
- `enemies/gravewarden.png` and `enemies/rootheart.png` use the approved v2
  gpt-image-2 framed candidates from the batch-2 elite/boss pass.
- `enemies/alphaFang.png` uses the approved v3 gpt-image-2 framed candidate;
  v2 was rejected because the mouth read like a generation failure.
- `enemies/drownedOne.png`, `enemies/voltEel.png`, and
  `enemies/mirelurker.png` use the approved Act 2 v2 gpt-image-2 framed
  candidates. Act 2 v1 remains available as rejected comparison evidence in
  scratch.
- `enemies/tidecaller.png`, `enemies/shellback.png`, and
  `enemies/deepmaw.png` use the approved Act 2 batch 2 gpt-image-2 framed
  candidates. Nano Banana Pro comparisons remain in scratch only.
- `enemies/abyssalKnight.png`, `enemies/siren.png`, and
  `enemies/leviathan.png` use the approved Act 2 finale drift-correction
  gpt-image-2 framed candidates: Abyssal Knight v3, Siren v3, and
  Leviathan's Maw v2.
- `enemies/voidWisp.png`, `enemies/obsidianGolem.png`, and
  `enemies/starCultist.png` use the council-approved Act 3 first-batch v2
  colour-lift candidates. They use the gpt-image-2 source alpha after warm
  outer-rim cleanup, then a light colour-lift pass
  (`modulate 116,118` plus gamma `0.93`) so the stained-glass masses read on
  dark combat backgrounds. The source prompt used `#00ff00` chroma-key instead
  of `#ff00ff` because Act 3 requires hot magenta judgement cores.
- `enemies/shade.png`, `enemies/chaosHound.png`, and
  `enemies/watcherEye.png` use the council-approved Act 3 second-batch v1
  colour-lift candidates. They follow the approved Act 3 first batch
  dark-background colour baseline and the same outer-rim cleanup plus light
  colour-lift pass.
- `enemies/voidColossus.png`, `enemies/heraldOfEnd.png`, and
  `enemies/sovereign.png` use the council-approved Act 3 finale v2 clean
  colour-lift candidates. The v1 finale candidates remain in scratch as
  comparison evidence because they were strong designs but too noisy: too many
  micro-panes, jewellery details, and dangling ornaments. The approved v2 pass
  keeps the same roles and silhouettes while using broader glass masses, fewer
  thick dividers, and simpler final-boss symbols. `sovereign.png` received an
  extra transparent framing pass after colour lift so the final boss scepter and
  halo do not sit against the image edge.
- `potions/healing.png`, `potions/strength.png`, `potions/swift.png`,
  `potions/block.png`, `potions/fire.png`, `potions/venom.png`, and
  `potions/energy.png` are the council-approved current potion set from
  `scratch/potion-demos/20260706-current-seven-r1/`. They use built-in Image
  Gen flat `#ff00ff` chroma-key sources, local chroma-key alpha removal, and
  final 256 x 256 potion-icon normalisation. The approved direction is fat,
  chunky, saturated, low-stroke stained-glass phials for HUD readability.
- `cards/strike.png`, `cards/defend.png`, and `cards/empower.png` are the
  approved first card-art milestone from the 60-card production sort in
  `docs/card-art-bible.md`. Earlier badge-style cards were rejected because
  they looked like floating emblems rather than card art. The approved
  candidates use built-in Image Gen full-bleed rectangular scene sources with
  strong foreground/background separation, normalised to `800 x 500`.
- `cards/eclipseSlash.png`, `cards/chisel.png`, and `cards/firstSpark.png` are
  approved card production batch 01. They continue the rectangular scene rule
  and are recorded in `scratch/style-tests/card-production-batch-01-20260706/`.
- `cards/ashBite.png`, `cards/smother.png`, and `cards/twinFangs.png` are
  approved card production batch 02 generated sources. Earlier sources were
  rejected because they were too dark, and a local brightness lift was rejected
  because post-processing changed the contrast language. The approved files use
  regenerated source art directly; the gallery PNGs are byte-for-byte copies of
  the approved generated sources. They are recorded in
  `scratch/style-tests/card-production-batch-02-20260706/`.
- `cards/quickSlash.png`, `cards/heavyBlow.png`, and `cards/cleave.png` are
  approved card production batch 03 generated sources. `quickSlash` v1 was
  rejected for drifting too close to `strike`; the approved v2 keeps the single
  rising card pane and compact slash. `heavyBlow` locks the blunt quarry-maul
  silhouette, and `cleave` locks the all-enemies three-shard fan without
  drifting into `shardstorm`. Final gallery PNGs are byte-for-byte copies of
  the approved generated sources and are recorded in
  `scratch/style-tests/card-production-batch-03-20260706/`.
- `cards/venomStrike.png`, `cards/lunge.png`, and
  `cards/guardedStrike.png` are approved card production batch 04 generated
  sources. `venomStrike` v1 was rejected for busy micro-pane drift; the
  approved v2 uses one oversized hooked fang and broad Smolder ribbons.
  `lunge` locks the horizontal Dimmed cut against a single fading blue flame,
  and `guardedStrike` locks the attack-first red blade emerging from a
  secondary half-blue ward. Final gallery PNGs are byte-for-byte copies of the
  approved generated sources and are recorded in
  `scratch/style-tests/card-production-batch-04-20260706/`.
- `cards/brace.png`, `cards/sidestep.png`, and `cards/preparation.png` are
  approved card production batch 05 generated sources. `brace` v1 was rejected
  for an over-ceremonial ward; the approved v2 keeps the common-skill crouched
  figure, amber lantern, and simple crescent ward. `sidestep` locks the blue
  glass step, missed red strike, and secondary rising card pane. `preparation`
  locks the quiet pre-ignition stack of blue panes and one tiny unlit match.
  Final gallery PNGs are byte-for-byte copies of the approved generated
  sources and are recorded in
  `scratch/style-tests/card-production-batch-05-20260706/`.
- `cards/deflect.png`, `cards/leechBlade.png`, and `cards/tempest.png` are
  approved card production batch 06 generated sources. `deflect` v1 was
  rejected because the red ray read too straight; the approved v2 locks the
  incoming ray, contact point, and separate outgoing refraction segment.
  `leechBlade` v1 was rejected because the heal cue was too small; the approved
  v2 locks one crimson blade, one dark oil bead, and one green-gold repair
  seam. `tempest` locks the pale hailglass ring, small crimson storm core, and
  three struck panes. Final gallery PNGs are byte-for-byte copies of the
  approved generated sources and are recorded in
  `scratch/style-tests/card-production-batch-06-20260706/`.
- `cards/uppercut.png`, `cards/flurry.png`, and `cards/executioner.png` are
  approved card production batch 07 generated sources. `uppercut` locks the
  upward fist, bell-shaped enemy pane, two sound rings, and small guttering blue
  flame. `flurry` locks exactly three red arcs around one central target chip.
  `executioner` locks one vertical black-red blade aligned with one bright
  existing faultline. Final gallery PNGs are byte-for-byte copies of the
  approved generated sources and are recorded in
  `scratch/style-tests/card-production-batch-07-20260706/`.
- `cards/momentum.png`, `cards/toxicMist.png`, and `cards/cripple.png` are
  approved card production batch 08 generated sources. `momentum` locks the
  crimson blade, amber whetstone arc, and two growing echo arcs. `toxicMist`
  locks a wide green-grey Smolder cloud swallowing three separated target
  shards. `cripple` locks a sapphire snuffer ring compressing a guttering red
  enemy flame, with one tiny ember bead as the secondary Kindle cue. Final
  gallery PNGs are byte-for-byte copies of the approved generated sources and
  are recorded in `scratch/style-tests/card-production-batch-08-20260706/`.
- The nine approved card images from `strike` through `twinFangs` are the
  current card-art baseline references. Their roles, hashes, and prompt ledgers
  are recorded in `docs/card-production/card-art-baselines.md`; the future
  subagent handoff protocol is recorded in
  `docs/card-production/subagent-workflow.md`.
- `props/campfire.png`, `props/chest.png`, `props/chest-open.png`, and
  `props/merchant.png` are the council-approved four live runtime props from
  `scratch/prop-art-production-20260706/`. They use built-in Image Gen flat
  `#00ff00` chroma-key sources, local chroma-key alpha removal, and final
  runtime-size normalisation: `campfire` and `merchant` at 512 x 512,
  `chest` and `chest-open` at 512 x 409. The approved direction is a readable
  stained-glass prop vignette: strong object silhouette first, with a small
  narrative backdrop that fades to transparent instead of a full rectangular
  scene. `chest` and `chest-open` are a matched treasure-state pair for the
  treasure screen.
- `events/*.png` is the complete event-art production set from
  `scratch/style-tests/event-production-20260706/`. Event art uses full
  narrative backgrounds rather than alpha cutouts. Every event now has a GPT
  source, a Nano Banana Pro full-scene clean-up, a per-event prompt ledger, and
  a registered runtime PNG normalised to max edge 1024 px. The first three
  events were explicitly promoted into the same production standard after the
  initial live registration used older event assets.

Prompt decision:

- The approved Act 2 finale prompt shape is the first-three-enemies pattern:
  funny but threatening, one iconic primary read, compact left-facing enemy
  pose, limited palette, and fewer hero/enemy ban clauses.
- The rejected finale v1 prompt drifted too serious because it overused
  elite/boss/noble-danger language, long frame-discipline clauses, and too many
  no-hero/no-human constraints. The approved v2 allows a little heroic attitude
  for elites and bosses, but keeps the body language enemy-like and funny.
- The approved Act 3 finale v2 clean pass adds a stricter low-noise rule: four
  or fewer primary symbols for bosses/elites, broad panes only, no dangling
  ornaments, no chains, no micro-panels, and no mosaic texture. This keeps the
  successful Act 3 bright magenta/cyan/violet read while making the final batch
  cleaner at thumbnail size.

Enemy and hero assets are runtime-ready PNGs normalised to a maximum edge of
1024px with alpha preserved. Event assets are full-background rectangular scene
PNGs normalised to max edge 1024 px. Potion assets are normalised to 256 x 256
with alpha preserved. Card assets are full-bleed rectangular PNGs. From batch
02 onward, approved gallery card PNGs must be byte-for-byte copies of their
approved generated sources; if a source is too dark, poorly framed, or the
wrong ratio, fix colour, theme, light, and composition in the prompt and
regenerate instead of post-processing it. Source and review
artefacts remain in
`scratch/style-tests/design-council-20260705-readable-style/`; potion source,
alpha, prompts, and contact sheets remain in
`scratch/potion-demos/20260706-current-seven-r1/`; card source, prompts, and
comparison sheets remain in
`scratch/style-tests/card-first-three-separation-readable-baseline-20260706/`,
`scratch/style-tests/card-production-batch-01-20260706/`,
`scratch/style-tests/card-production-batch-02-20260706/`, and
`scratch/style-tests/card-production-batch-03-20260706/`, and
`scratch/style-tests/card-production-batch-04-20260706/`, and
`scratch/style-tests/card-production-batch-05-20260706/`, and
`scratch/style-tests/card-production-batch-06-20260706/`, and
`scratch/style-tests/card-production-batch-07-20260706/`, and
`scratch/style-tests/card-production-batch-08-20260706/`.
Prop assets are normalised to the live runtime prop dimensions, with alpha
preserved. Prop source, alpha, prompts, and contact sheets remain in
`scratch/prop-art-production-20260706/`.
Event source, Nano Banana outputs, prompts, and contact sheets remain in
`scratch/style-tests/event-production-20260706/`.

Gallery cleanup:

- Runtime gallery registration now only exposes `live` and `readable-baseline`.
- Temporary runtime review folders were removed after promotion. Scratch source
  folders, exact prompts, generated ids, alpha outputs, and contact sheets are
  retained as evidence.

When the whole set has passed review, activate it with a folder swap:

```bash
mv src/assets src/assets-previous
mv src/assets-readable-baseline src/assets
npm run build
```

Only do this once every required category/id exists in the candidate folder.

For review, open the dev gallery with:

```text
http://localhost:5174/?gallery=1&set=readable-baseline
```

The approved prop set should appear in that gallery as `props - 4/4 generated`.
The approved event set should appear as `events - 11/11 generated`.
The final prop registration proof is recorded in `docs/prop-gallery-proof.md`.
