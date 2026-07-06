# Spirebound — Visualisation Boost (design)

**Date:** 2026-07-06
**Goal:** Take the working demo to app-store sellable visual quality — "players
wish to buy" tier. Mobile app store is the primary target: portrait touch is the
first-class experience, and every budget decision assumes a mid-range phone GPU
at 60fps (design for the LITE tier as the *primary* tier, desktop gets the same
visuals with higher particle/DPR ceilings).
**Executor:** a lower-grade agentic LLM. Every workstream below must be broken
into mechanical, individually-verifiable batches in the implementation plan;
nothing may rely on the executor's taste or judgement.

## Decisions record (owner-approved)

| Question | Decision |
|---|---|
| Scope | Full overhaul: stage + VFX + choreography + card/UI polish + asset completion |
| Platform | Mobile app store primary; portrait first; mid-range phone perf budget |
| Combat stage | **Painted Diorama** — per-act painted layers over the live 3D sky |
| Card frame | Keep current layout; polish in place (cost badge, rarity distinction) |
| VFX | Hybrid: 7 elemental archetype systems + bespoke moments for signature cards |
| Icons | Relics → raster pipeline; status/boon/art/omen small icons → hand-drawn SVG |
| Character animation | Code-driven choreography; keep single-image + mesh warp; no cutout rigging |

## Invariants (violating any of these fails review)

- **Engine purity**: `src/engine.js` and `src/vigil.js` stay DOM-free and
  Node-runnable. All new visuals live in `ui.js` / `vfx.js` / `styles.css` /
  `art.js` / assets. `npm test` passes untouched at every batch boundary.
- **No engine event changes needed**: the UI's `drain()` already receives
  `{ t:'play', id }` before the `hitEnemy` events a card causes, and
  `{ t:'enemyAct', idx, move }` before enemy hits. The UI tracks "current
  source" from those events and looks up VFX archetypes from the data tables
  itself. Do not add fields to `cb.queue` events.
- **Internal keys are immutable**: card ids, status keys, relic ids, enemy keys
  never change. New data fields (e.g. `vfx`) are additive display metadata.
- **Asset resolver pattern**: every new asset category resolves through
  `assetUrl(category, id)`; a missing file falls back to the current look.
  The game must remain fully playable with zero stage/relic assets present.
- **Structural icons come from `art.js`** (`iconSvg`/`iconInline`), never font
  glyphs. This pass *removes* remaining structural font glyphs (tofu risk).
- **Motion discipline**: animate `transform` / `opacity` / `filter` only;
  respect `REDUCED` (JS) and `prefers-reduced-motion` (CSS) everywhere; shared
  easing tokens from the 2026-07-04 polish spec (`--ease-out-soft`,
  `--ease-spring`) are reused, not re-invented.
- **Generation workflow**: all raster assets go through the locked pipeline in
  `docs/generated-art-workflow.md` (gpt-image-2 → Nano Banana Pro → alpha →
  rim cleanup → `?gallery=1` review), with prompt ledgers in `scratch/`.

## 1. Combat stage — painted diorama

New asset category `src/assets/stage/`, 9 large PNGs:

| id | content | alpha? |
|---|---|---|
| `act1-backdrop` … `act3-backdrop` | distant act scenery plate (Ashen Woods treeline / Sunken City drowned arches / Obsidian storm crags) | yes — irregular top edge, fades out, 3D sky shows through |
| `act1-mid` … `act3-mid` | midground set dressing strip (broken arches, hanging chains, unlit lanterns; act-themed) | yes |
| `act1-ledge` … `act3-ledge` | foreground stone ledge platform the combatants stand on, lit by lantern light | yes |

Integration (ui.js combat screen):

- Three absolutely-positioned `<img>` layers inserted between the `#bg3d`
  canvas and the combat DOM (hero/enemies/HUD), z-ordered backdrop → mid →
  ledge. Characters' feet sit on the ledge's painted top surface; the current
  glowing ledge line remains *on top of* the ledge art as the light seam.
- Parallax: each layer gets a small `transform: translate` coupled to the
  existing pointer-drift state (desktop) or a slow sinusoidal idle drift
  (touch), amplitudes ~2/5/9 px back-to-front, plus a share of the `kick()`
  camera impulse so big hits ripple through the whole diorama.
- Fallback: any missing layer simply doesn't render; with no stage assets the
  scene is exactly today's.
- Portrait (≤740px stage width) and short-landscape (≤480px stage height) get
  their own `object-position`/scale tuning in the existing `@container stage`
  combat blocks (see hardening spec §1b — layout queries the stage, not the window).
- Boss fights reuse their act's set (no extra assets this pass).

## 2. VFX — archetypes + bespoke

**Archetype field**: every entry in `CARDS` gains `vfx: '<archetype>'` —
one of `slash, pierce, blunt, fire, poison, void, ward`. The implementation
plan must contain the complete 60-card → archetype table (no executor
judgement). Enemy moves map through a fixed rule — move kind `attack` →
`blunt` (beasts/golems/maws) or `slash` (bladed/humanoid kinds), `debuff` →
`void`, `buff`/`block` → `ward`, poison-flavoured moves → `poison` — and the
plan must spell out the per-`art.kind` assignment table; no data change for
enemies.

**vfx.js grows**: new primitives `emberTrail`, `droplets`, `implosion`,
`shardSpray`, `beamLine` composed with existing `burst/ring/slashArc/motes`
into one `archetypeHit(x, y, archetype, power)` entry point. Per-effect
particle caps (LITE ≈ 60% counts). `power` scales with damage tier so heavy
hits read heavier.

**Bespoke registry**: `BESPOKE_VFX` exported from vfx.js, keyed by card id, for
12 signature cards — `annihilate, oblivionStrike, tempest, executioner,
novaflare, shardstorm, ascension, limitBreak, phantomBlades, pyreheart,
emberdance, devour` — plus all 6 Lantern Arts (`flare, mendglass, beacon,
emberveil, stoke, ashfall`). Each is a short choreographed sequence that may
use: impact frame (2-frame white silhouette flash), extended `hitstop`,
fullscreen colour wash (`V.flash`), screen shake, and stage-light response
(temporary bloom kick via the existing `kick()`).

**Wiring**: `drain()` remembers the source of the current animation window
(last `play` card id or `enemyAct` move) and calls `BESPOKE_VFX[id]` if
present, else `archetypeHit(...)` on each `hitEnemy`/`hitPlayer`.

## 3. Character choreography

A choreography helper section inside ui.js (no new module): Web Animations
API sequences on the existing sprite wrappers, `transform`/`opacity` only.

- **Attack (player & enemy)**: anticipation (recoil 6px + squash 0.96, 80ms)
  → dash toward target (24–40px, 120ms, `--ease-out-soft`) → impact beat
  (VFX + existing hitstop + target reaction) → recover with overshoot
  (`--ease-spring`, 220ms).
- **Hit reaction**: brightness flash (already partially present) + knockback
  8px away from source + squash 1.04/0.96, 180ms.
- **Death**: 0.5-beat stagger (droop + fade of inner glow) *before* the
  existing `shatter()` so deaths land as a two-part beat.
- Per-`art.kind` profiles reuse the mesh.js PROFILE families: floaty kinds
  (wisp/shade/siren/eye) drift instead of dash; heavy kinds (golem/leviathan/
  treeboss) stomp (larger squash, no dash); default is the standard dash.
- All sequences no-op under `REDUCED`.

## 4. Card & HUD polish (CSS-only)

- **Cost badge**: rebuild `.card-cost` as a faceted glass gem — polygonal
  clip-path facet highlights, gold metal bezel ring, inner glow; free-cost
  (green) variant keeps the same construction. No layout size change.
- **Rarity distinction** (explicit owner request): one-glance tiers.
  - *common*: current lead border (unchanged, it's the baseline)
  - *uncommon*: silvered inner frame (cool `#a8d8ee` line + 2 corner joints)
  - *rare*: gilt frame — gold inner line, 4 corner gem dots, existing foil
    shine kept; slightly stronger ambient `box-shadow` bloom
  - *starter*: unchanged; the rarity bar pill stays as-is on all tiers
- **Name plate**: hairline gold rules above/below `.card-name` (the
  cathedral-lite touch that survived the mockup round).
- **Art window**: inset bevel (1px light top edge, 1px dark bottom edge) on
  `.card-art` so art sits *inside* the pane.
- **HUD chrome**: unified stained-glass treatment for HP bar frame, energy
  candles row, relic bar, potion slots, End Turn button, and panel/modal
  frames — lead-line borders (`#05070e` outer + tinted inner line), subtle
  glass gradient fills, gold accents on interactive elements. Pure CSS token
  work in styles.css; no images, no DOM restructuring beyond adding wrapper
  classes where strictly needed.

## 5. Asset completion

- **31 relic PNGs** (`src/assets/relics/<id>.png`, 512px, single centred
  object, props-style composition): `emberHeart, ashenCore, basaltIdol,
  warFetish, riverPearl, travelersPack, emberLantern, vialOfLife, thornBand,
  sweetRoot, gravebloom, silkFan, reapersBell, executionersSeal, ironTalisman,
  merchantsMark, seersOrb, frozenCore, verdantBranch, sunBlossom, wardingCharm,
  duskmirror, smolderingCoal, thiefOfWicks, prismCharm, bellOfEndings,
  crownOfCinders, hollowCrown, crownOfTithes, shatterersCrown,
  crownOfTheHearth`. The 5 Crowns share a recognisable crown motif family.
  A new `docs/relic-art-bible.md` records per-relic prompt seeds before
  generation starts (mirrors card/potion bible structure). UI: relic bar,
  shop, reward and tooltip call sites render the raster via `rasterOr` with
  the current sigil as fallback.
- **Hand-drawn SVG icon set** in `art.js` ICONS (structural, small-size):
  - 17 status icons (`str, dex, vulnerable, weak, frail, poison, thorns,
    ritual, metallicize, regen, barricade, energized, venomous, rampage,
    beacon, emberflow, nightsight`)
  - 6 Lantern Art icons (`flare, mendglass, beacon, emberveil, stoke, ashfall`)
  - 8 boon icons + 7 omen icons (current glyph column becomes decorative-only
    or is replaced at call sites)
  - Call sites switch from font glyphs to `iconSvg`; `STATUS_INFO`/data glyph
    strings remain in the tables (used as fallback and in prose text).
- **Title background**: generate `src/assets/title-background/background.png`
  (16:9 wide key art; the existing `title-banner` code path renders it).
  Portrait fit via `object-position` tuning. The title wordmark PNG stays.
- **Store surface refresh**: regenerate `public/icon-180.png`, `icon-512.png`,
  `og.png` from the new key art (tools/gen-icons.sh flow), so the installed
  app icon matches the boosted look.

## 6. Performance budget

- Stage layers: 3 static images, transform-only parallax — no per-frame layout.
- VFX: per-archetype particle caps; LITE tier multiplies counts by 0.6 and
  skips the fullscreen impact-frame on bespoke effects.
- Choreography: WAAPI on transforms only; no rAF loops added.
- Gate: 375×812 portrait, CPU 4x throttle in devtools — combat stays ≥ 55fps
  during a bespoke effect; no long tasks > 50ms from VFX code.

## 7. QA gates (every batch)

1. `npm test` green (engine untouched guarantee).
2. `npm run build` clean.
3. `?gallery=1` review for any new/changed raster assets (stage + relics get
   gallery categories).
4. Portrait smoke: 375×812 — start fight, play attack/skill/power cards, kill
   an enemy (shatter + death choreo), win. Screenshot evidence per batch.
5. Reduced-motion smoke: `prefers-reduced-motion` → no choreography, no
   impact frames, game fully playable.

## Out of scope (this pass)

- Audio changes; map-screen redesign; cutout/skeletal rigging; per-boss unique
  stage sets; store screenshot/trailer production; any engine mechanic change.
