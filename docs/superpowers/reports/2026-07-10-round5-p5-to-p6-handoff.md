# Round 5 P5 → P6 hand-off

**Date:** 2026-07-14 (UTC)  
**Host tip (Decision):** `11fb29c0617e228098e334ef5a33fbc701b66840` (Task 29 / P5 complete); docs tip is this file’s commit on the branch  
**Branch:** `jamesto/round5-production-engineering-continuation`  
**Machine:** Darwin arm64 (local focused gate; no GitHub standing / full CI wait)  
**Worktree:** `.worktrees/round5-production-engineering-continuation`

## Decision: GO TO P6

Hard non-visual P5 gates at tip `11fb29c0` (Task 29 source) are green under the Ask-Matt cadence. Owner continues Tasks 31+. **Linux remote baseline recapture remains deferred** (attempted once; tooling blocked — see Deferred) and does **not** alone force PREFIX EXIT — same precedent as P4 Task 24 Step 6 / P4 gate. Darwin visual already green at Task 29.

This record does **not** open a prefix ship PR, regenerate `dist/**`, or run standing.

This hand-off makes **no** actual-Safari, iOS/iPadOS Simulator, WKWebView-as-app, hardware, packaging, or mobile-support claim. WebKit evidence is Playwright’s patched WebKit with phone/pad device descriptors only.

**WebKit-safe API review: PASS** (Tasks 26–29 carry-forward; this gate’s focused `iphone-webkit` / `ipad-webkit` leak + production-profile rows all green).

---

## Tip SHAs

| Role | SHA | Notes |
|---|---|---|
| Exact PE tip / rollback (Task 29 source) | `11fb29c0617e228098e334ef5a33fbc701b66840` | P5 complete; FE Task 31 verifies this is an ancestor of the hand-off HEAD |
| P5 → P6 FE hand-off HEAD (initial publish) | `70b84af5209504ca0bdec3c555c792dd0b536fcc` | First `docs: publish the P5 to P6 hand-off` |
| P5 → P6 harden content commit | `e5f691f6b52cb473ebc6634f94a24caa91f9b2f4` | Important-review body (`docs: harden P5 to P6 hand-off manifest`) |
| P5 → P6 FE hand-off HEAD (hardened pin) | `44fe840d5aa81458208eaa73c495d244f5c21c21` | FE fast-forward tip (matches progress ledger); harden content at e5f691f6 |
| Experience contract blob (frozen) | `6684e8b67779a26d29b391705a48852b43d7b2f7` | Task 21 owner-approved; **read-only for P6** |
| Contract clean FE_HEAD | `51cbf9876797813a0e60144412984bbf8badb569` | Task 21 write-set proof |
| FE_CONTRACT_MERGE | `6e06911853ba8e26d05ac4db0a1ad119a6c2275a` | Contract merge into PE lane |

Rollback of product state: `git reset --hard 11fb29c0617e228098e334ef5a33fbc701b66840`. Rollback of hand-off docs only: revert the docs tip.

---

## Step 1 command evidence (GO tip `11fb29c0`)

Working tree under
`/Users/jamesto/Coding/roguecardv2/.worktrees/round5-production-engineering-continuation`.  
Logs: `/tmp/round5-p5-gate/*.log`.

### Node / budget / surface

| Command | Exit | Summary |
|---|---|---|
| `npm run test:ci` | **0** | ci contract + module boundaries + baseline tools |
| `npm test` | **0** | `unit checks passed; monte-carlo: 300 runs, 1 random-agent wins, 299 deaths` |
| `npm run test:progression` | **0** | guided/unguided emberglass pacing complete |
| `npm run test:act-coupling` | **0** | 14 findings, all allowlisted |
| `node tools/check-bundle-budget.mjs` | **0** | entry gzip 462210 ≤ max 507904 (pre-Pixi baseline 323218) |
| `node tools/verify-production-surface.mjs` | **0** | `production surface clean (12 markers checked)` |

### Focused Playwright (serial, `--workers=1 --no-deps`)

| Command | Exit | Summary |
|---|---|---|
| `node tools/run-with-strict-e2e-port.mjs -- npm run test:e2e:leak` | **0** | **5 passed / 4 skipped** (WebKit skips intentional contrast/long-agent rows; desktop cache + contrast + long-agent green; iphone/ipad cache green) |
| `node tools/run-with-strict-e2e-port.mjs -- npx playwright test production-profile --project=desktop --project=iphone-webkit --project=ipad-webkit --workers=1 --no-deps` | **0** | **6 / 6** fresh+veteran Lab journeys |

### Optional focused (time-boxed)

| Command | Exit | Summary |
|---|---|---|
| `presentation` + `cardface` desktop | **0** | **8 / 8** (composer, contrast, locale invalidate, pile ceremonies, banners, artCast) |
| `battle` `-g "P5 combat DOM\|PR17 geometry"` desktop | **0** | **2 / 2** DOM whitelist + Pixi PR17 readUI |
| `npm run test:e2e:webkit` | **aborted / cadence-skipped** | ~8m budget abort; incomplete run. **8 iphone-webkit failures observed before abort** (not one). Accurate list below. Cadence skip is OK; focused WebKit production-profile + leak remain the GO WebKit evidence (P4 contention precedent). |
| `npm run test:e2e` full matrix | **skipped** | Owner cadence; focused P5 hard gates above are the GO evidence |
| `test:e2e:perf` / PERF full | **skipped** | Owner cadence; prior P4 policy: `PERF_WARNING` alone cannot block GO; heap/cache/bundle invariants covered by leak + budget |

#### Aborted `test:e2e:webkit` — iphone-webkit failures observed (8)

Log: `/tmp/round5-p5-gate/12-webkit.log`. Suite incomplete (abort); do not treat as a full-matrix result.

| # | Spec | Title |
|---|---|---|
| 1 | `lab.spec.js` | Content Lab › URL combat round-trip, play, replay hydrate without auto-run |
| 2 | `lab.spec.js` | Content Lab › registry editor Start sandbox writes canonical URL and round-trips |
| 3 | `lab.spec.js` | Content Lab › pasted paleDuskfang URL stages through probe and rejects base mismatch |
| 4 | `lab.spec.js` | Content Lab › sample climb journey through probe with frozen content summary |
| 5 | `lab.spec.js` | Content Lab › Lab win and Lab loss leave sentinel storage byte-identical |
| 6 | `lab.spec.js` | Content Lab › trace transcript copy copies live panel text after a real beat |
| 7 | `stage.spec.js` | P1 shared UI modules preserve exact browser boundaries and live commands |
| 8 | `trace.spec.js` | runtime UI module contracts expose only sorted diagnostic keys |

(6 Lab + stage P1 boundaries + diagnostic-keys.) Focused production-profile Lab journeys on the same projects still **6/6 PASS** in the Step 1 table above.

### Owner-cadence waiver vs plan Step 1 (not PREFIX EXIT)

Plan Task 30 Step 1 names a full clean-source matrix including `test:e2e`, `test:e2e:webkit`, `test:e2e:perf`, PERF full desktop, `test:round5:standing -- --profile p5`, and `git diff --check`. **Ask-Matt / owner cadence for Tasks 16–40 explicitly waives mid-iteration standing and full CI**, mirroring the P4 gate (`docs/superpowers/reports/2026-07-10-round5-p4-gate.md`): focused hard non-visual gates green ⇒ **GO**, not PREFIX EXIT.

| Plan Step 1 item | This gate | Waiver basis |
|---|---|---|
| `npm run test:e2e` (full) | **skipped** | Cadence time; focused leak / production-profile / presentation / DOM gates green |
| `npm run test:e2e:webkit` (full) | **aborted / skipped** | Cadence ~8m abort; 8 failures listed accurately above; focused WebKit green |
| `npm run test:e2e:perf` + PERF full | **skipped** | Cadence; `PERF_WARNING` alone cannot force PREFIX EXIT |
| `npm run test:round5:standing -- --profile p5` | **skipped** | Owner cadence — never mid-iteration standing |
| `git diff --check` | **skipped** | Docs-only / cadence; not a hard product blocker for GO |
| Prefix ship / `dist/**` / PR | **not executed** | Decision is GO TO P6, not P5 PREFIX EXIT |

### Cadence exclusions (intentional)

- No `npm run test:round5:standing -- --profile p5`
- No full GitHub CI / required-check wait
- No prefix ship (`build` + `dist/**` + PR)
- No Darwin `test:e2e:update` in this gate (Darwin already green at Task 29)
- No plan Step 1 full matrix items listed in the waiver table above

---

## Cross-lane manifest (FE Task 31+)

### Experience contract — frozen (read-only for P6)

| Item | Value |
|---|---|
| Path | `docs/superpowers/specs/2026-07-10-round5-fe-experience-contract.md` |
| Blob SHA-1 | `6684e8b67779a26d29b391705a48852b43d7b2f7` |
| Owner approval | Task 21 Gate A YES / Gate B clean SHA (`.superpowers/sdd/task-21-fe-contract-approval.md`) |
| P6 rule | FE may **not** edit the contract; PE already transcribed values into `src/ui/tokens.js` / tests |

### CSS variables / tokens

Source of truth: `src/ui/tokens.js` (`ROUND5_TOKENS`, `R5_CSS_VARIABLE_MAP`, `applyExperienceTokens` → `--r5-*` on `document.documentElement`).

**Experience-applied** (present on `ROUND5_TOKENS` and set by `applyExperienceTokens` / `cssVariables`):

| CSS variable | Token value |
|---|---|
| `--r5-gold` | `#f2c14e` |
| `--r5-gold-dim` | `#9c7c34` |
| `--r5-ink` | `#0b0e1a` |
| `--r5-parchment` | `#f4e7c5` |
| `--r5-text` | `#ece7df` |
| `--r5-text-dim` | `#aaa6b8` |
| `--r5-danger` | `#ff7060` |
| `--r5-ward` | `#8fd0ff` |
| `--r5-ember` | `#ff9a4d` |
| `--r5-ease-out-soft` | `cubic-bezier(0.22, 1, 0.36, 1)` |
| `--r5-ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` |
| `--r5-dur-micro` | `120ms` |
| `--r5-dur-quick` | `180ms` |
| `--r5-dur-standard` | `320ms` |
| `--r5-dur-screen` | `450ms` |
| `--r5-dur-ceremony` | `640ms` |
| `--r5-font-body` | `'Alegreya', Georgia, serif` |
| `--r5-font-display` | `'Cinzel', 'Alegreya', serif` |

**Map-only — NOT experience-applied (do not use in `round5-screens.css`):** `R5_CSS_VARIABLE_MAP` also names `--r5-good`, `--r5-bad`, `--r5-atk`, `--r5-blk`, and `--r5-hp`, but those keys are **absent** from `ROUND5_TOKENS`, so `cssVariables` / `applyExperienceTokens` never set them. FE must not rely on those five custom properties.

Structured aliases (`EASING`, `DURATION_MS`, `COLOUR`, `TYPE`) match the owner-approved `ROUND5_EXPERIENCE_VALUES` block in the contract.

### Root selectors (P6 screens + shared stage)

FE may style only PE-owned markup under these roots (no new product JS, no state via CSS):

| Route key (`S.screen`) | Root selector(s) under `#screen` |
|---|---|
| `title` | `.title-screen` |
| `embark` | `.embark-screen` |
| `vigil` | `.vigil-panel` (inside `.center-panel`) |
| `lamplighter` | `.lamp-screen` |
| `hollow` | `.hollow-lamplighter` |
| `map` | `.map-screen` |
| `reward` | `.center-panel` / `.panel` (reward family) |
| `bossRelic` | `.center-panel` / `.panel` (boss-relic family) |
| `rest` | `.center-panel` / `.panel` (rest family) |
| `treasure` | `.center-panel` / `.panel` (treasure family) |
| `shop` | `.center-panel` / `.ov-panel` |
| `event` | `.center-panel` / `.event-panel` |
| `end` (Dawn / Fall) | `.end-screen` (Fall adds `.grave`; Dawn uses `.dawn-ceremony`) |
| shared | `#stage`, `#screen`, `.screen-enter`, `.scene-bg`, `.meta-bg` |

Combat remains PE Pixi-owned chrome; P5 DOM whitelist still applies (FE does **not** restyle combat ceremony DOM). Combat roots for reference: `#stage` → `#uigl`, `#vfx`, `#tooltip`, `.combat-screen`, `.hand-zone` (empty host), pile/energy hosts — see Allowed descendants.

### Allowed descendants / data attributes (combat P5 whitelist — frozen)

**Sole authority:** exact freeze = `inventoryCombatDom` in `test/e2e/helpers.js` @ Task 29 tip `11fb29c0617e228098e334ef5a33fbc701b66840` (plus `COMBAT_DOM_FORBIDDEN_SELECTORS` in the same file). FE cites that freeze; do not invent a parallel list.

Frozen sets pasted for FE citation (verbatim from that tip):

```js
// ALLOWED_IDS
'stage', 'bg3d', 'vignette', 'grain', 'shake', 'screen', 'mesh', 'lantern',
'hud', 'aim', 'vfx', 'uigl', 'floaties', 'overlay', 'wipe', 'transit', 'tooltip',
'omen-slot', 'relicbar', 'aim-outline-atk', 'aim-outline-self', 'status-outline', 'alpha-erode'

// ALLOWED_CLASS
'combat-screen', 'screen-enter', 'intro', 'pixi-bottom-chrome', 'pixi-plate-chrome', 'pixi-hud-chrome',
'sl', 'sl-backdrop', 'sl-mid', 'sl-ledge',
'stage-dim', 'stage-ledge', 'stage-breath', 'b1', 'b2',
'cast-shadow-layer', 'cast-shadow',
'battlefield', 'player-zone', 'enemy-zone', 'hero-wrap', 'hero-sprite', 'enemy', 'enemy-art',
'enemy-sprite', 'raster-art', 'aim-ring', 'cracks-overlay', 'vessel-fire', 'dmg-preview',
'idle-motes', 'mesh-live',
'top-chrome', 'cplate', 'status-row', 'p-status', 'intent', 'name', 'hpbar-wrap', 'hp-vial',
'hpbar', 'fill', 'ghost', 'pv', 'hp-label', 'block-chip', 'facet-row', 'zero', 'ic',
'energy-orb', 'lantern-btn', 'end-turn', 'pile-btn', 'pile-draw', 'pile-discard', 'pile-exhaust',
'hand-zone', 'pop', 'unlit', 'pile-bump', 'is-empty', 'show',
'hud-bar', 'hud-stat', 'hud-hp-wrap', 'hud-hpbar', 'hud-right', 'gold-num', 'hp-num',
'elite-e', 'boss-e', 'affixed', 'lowhp', 'gone'
```

Additional allow predicates in the same freeze (not class-set members): anonymous structural children under an allowed host; `svg[aria-hidden="true"]` filter library; class prefixes / extras `sl-*`, `pile-*`, `hud-*`, `idle-*`, `schip*`, `ui-icon*`, `gicon`, `et-ic`, `et-lbl`, `lb-ic`, `lb-count`, `lb-pips`, `num`, `cnt`, `lbl`, `pile-stack`, `candles`.

**Forbidden (must be count 0):** `.floaty`, `.flymote`, `.flycard`, `.flycard-face`, `.flycard-back`, `.flycard-pile`, `.turn-banner`, `.boss-banner`, `.perfect-banner`, `.variant-dialogue`, `.hand-zone .card`.

Empty structural hosts during combat: `#floaties` children = 0, `#aim` children = 0, `.hand-zone` childElementCount = 0.

**Load-bearing data attributes (PE-owned; FE may select, not invent):**

| Attribute | Owners |
|---|---|
| `data-act` | HUD `deck` / `menu` |
| `data-slot` | phial slots |
| `data-pile` / `data-count` / `data-tier` | pile stacks |
| `data-state` | energy candles |
| `data-relic` | HUD relic chips |
| `data-idx` / `data-base-id` / `data-variant-id` / `data-art-id` | enemy boxes |
| `data-uid` | card instances (non-combat grids; combat hand is Pixi) |
| `data-a` / `data-m` / `data-bus` | screen/menu action hooks |

### Asset ids + fallbacks

**Freeze pointer (FE cite):** live raster map is `src/assets/<category>/<id>.{png,jpg,jpeg,webp}` resolved by `assetUrl(category, id)` in `src/art.js` (`ASSET_URLS` glob + `ASSET_SETS.live.root = 'assets'`). Missing file → `null` → caller SVG/glyph fallback via `rasterOr` / screen owners in `src/ui/assets.js`. Inventory at Decision tip `11fb29c0`: **21 categories, 243 raster ids** under `src/assets/` (audio under `musics`/`sfx` folders here are empty — playback uses `public/` packs, not this map).

| Category | n | Representative ids (FE may cite) |
|---|---:|---|
| `arts` | 6 | `ashfall`, `beacon`, `emberveil`, `flare`, `mendglass`, `stoke` |
| `bequests` | 3 | `card`, `gold`, `relic` |
| `boons` | 8 | `emberFlask`, `fullPurse`, `keenEye`, `pilgrimsCache`, `temperedGlass`, `twinPhials`, `venomPouch`, `warmHearth` |
| `cards` | 60 | `aegis`, `agility`, `annihilate`, `ascension`, `ashBite`, … |
| `deeds` | 8 | `ashSermon`, `darkWalker`, `firstDawn`, `hundredShards`, `lanternFed`, `paneBreaker`, `spendthrift`, `untouched` |
| `enemies` | 27 | `duskfang`, `sporeling`, `abyssalKnight`, … |
| `events` | 11 | `cursedIdol`, `emberFountain`, `forge`, `library`, … |
| `heroes` | 2 | `ashwarden`, `duskblade` |
| `meta` | 11 | `ascended`, `emberglass-frame`, `emberglass-mask-*`, … |
| `omens` | 7 | `ashfall`, `emberWind`, `heavyAir`, `hungryDark`, `longNight`, `thinGlass`, `waningMoon` |
| `piles` | 3 | `ashes`, `discard`, `draw` |
| `potions` | 7 | `block`, `energy`, `fire`, `healing`, `strength`, `swift`, `venom` |
| `props` | 4 | `campfire`, `chest`, `chest-open`, `merchant` |
| `relics` | 31 | `ashenCore`, `emberHeart`, `duskmirror`, … |
| `stage` | 9 | `act1-backdrop`, `act1-ledge`, `act1-mid`, … (acts 1–3) |
| `statuses` | 17 | `barricade`, `dex`, `frail`, `metallicize`, … |
| `title` | 1 | `title` |
| `title-background` | 1 | `background` |
| `ui` | 27 | `candle-lit`, `candle-spent`, `coin`, `deck`, `end-turn`, `heart`, … |

| Fallback rule | Behaviour |
|---|---|
| `rasterOr(cat, id, svg)` | `<img class="raster-art">` if `assetUrl` hits; else procedural SVG |
| relics / omens / potions | glyph / `iconSvg` / `potionSvg` when raster missing |
| stage / meta / title-background | omit plate / empty bg when missing |

FE P6 write set may add **named** visual assets only (P7 promotion is a later hand-off); P6 stylesheet task does not invent new asset categories.

### Music Cue ids (22) — separate set

Catalogue: `src/audio-catalog.js` `MUSIC_CATALOG`.

`title`, `embark`, `vigil`, `roseWindow`, `map`, `safeNodes`, `act1Combat`, `act1Boss`, `act2Combat`, `act2Boss`, `act3Combat`, `act3Boss`, `elite`, `paleOnes`, `shadeDuel`, `usurper`, `eighthOmen`, `unreadablePage`, `hollowLamplighter`, `sealedDoor`, `victory`, `defeat`.

FE does not mark or wire catalogue rows; PE owns call sites / fallbacks (contract “Loaded Phase 2 Music Cue substrate”).

### SFX ids (36) — separate set

Catalogue: `src/audio-catalog.js` `SFX_CATALOG`.

`click`, `hover`, `card`, `draw`, `atkHeroLight`, `atkHeroMed`, `atkHeroHeavy`, `atkEnemyLight`, `atkEnemyMed`, `atkEnemyHeavy`, `slash`, `hit`, `blocked`, `block`, `poison`, `debuff`, `buff`, `heal`, `energy`, `coin`, `potion`, `death`, `bigDeath`, `turn`, `victory`, `defeat`, `relic`, `upgrade`, `map`, `chip`, `shatter`, `ember`, `kindle`, `stagger`, `art`, `omen`.

### Screens × fresh/grown × five canonical shapes

**Shapes:** `phone-portrait`, `phone-landscape`, `pad-portrait`, `pad-landscape`, `desktop-landscape` (contract profile codes PP / PL / PT / PA / DL).

**P6 composition screens (14 × 5 = 70 rows in contract):** Title, Embark, Fall, Dawn, rewards, boss relic, shop, event, rest, treasure, lamplighter, Hollow, Vigil, map.

Each row has **Fresh** and **Grown** composition columns plus Full / LITE / REDUCED terminals — authoritative detail remains in the frozen contract §P6. Product route keys map as: Dawn/Fall → `end`; rewards → `reward`; boss relic → `bossRelic`; Hollow → `hollow`; others match route keys above.

Merged Phase 2 substates (Rose tab, Hollow lines, Dawn panels, quest-shop, Fall bequest, Title version default/debug) are composition overlays in the same contract — FE styles terminals; PE owns reveal/persistence.

### Capture commands / output paths

| Purpose | Command / path |
|---|---|
| Darwin visual (already green @ Task 29) | `npm run test:e2e:visual` → `test/e2e/visual.spec.js-snapshots/` |
| Darwin baseline refresh (not run this gate) | `npm run test:e2e:update` |
| Linux remote baselines | `node tools/run-baseline-workflow.mjs --workflow update-baselines.yml --ref <branch> --sha <sha> --out <dir>` then `node tools/install-baseline-artifact.mjs` — **deferred** |
| Focused P5 presentation | `npx playwright test presentation cardface battle --project=desktop --workers=1 --no-deps` |
| Gate logs (this tip) | `/tmp/round5-p5-gate/` |
| Future P6 screen lane | `npx playwright test p6-screens …` (standing profile `p6`; not required for this GO) |

### FE write set (P6 lane)

Allowed FE edits after fast-forward to this hand-off tip:

1. `src/styles/round5-screens.css` (create / author)
2. Experience contract / FE reports — **contract is frozen read-only**; reports only under `docs/superpowers/reports/` as FE review artefacts
3. **Named assets only** (no product JS; P7 promotion is a later sequential hand-off)

PE owns screen JS, selectors, token translation, audio, probes, tests, and later `import './styles/round5-screens.css'` in `src/main.js` at Task 35.

---

## Required evidence vs deferred

### Required for GO (satisfied)

- [x] `test:ci`, `npm test`, progression, act-coupling
- [x] Bundle budget + production surface
- [x] Leak (desktop + WebKit cache bounds)
- [x] Production-profile desktop + iphone-webkit + ipad-webkit
- [x] P5 DOM whitelist + PR17 Pixi geometry (desktop focused)
- [x] Cardface / presentation ceremonies (desktop focused)
- [x] Darwin visual green at Task 29
- [x] Experience contract hash frozen + owner-approved
- [x] Explicit no Safari/Simulator/mobile-support claim
- [x] WebKit-safe API review: **PASS**

### Deferred (ship / visual-contract follow-ups — not PREFIX EXIT)

1. **Linux remote baselines** — Attempted once at tip `11fb29c0`:

   ```text
   node tools/run-baseline-workflow.mjs --workflow update-baselines.yml \
     --ref jamesto/round5-production-engineering-continuation \
     --sha 11fb29c0617e228098e334ef5a33fbc701b66840 \
     --out /tmp/round5-p5-gate/linux-baselines
   ```

   **Blocked:** `gh workflow dispatch update-baselines.yml --ref …` → `unknown flag: --ref` (local `gh` CLI does not accept `workflow dispatch --ref`; tool expects modern dispatch API). Same class of deferral as P4 Task 24 Step 6. Dual-platform baseline review remains a commercial-ship follow-up before treating screenshots as closed.

2. Full `test:e2e` matrix — skipped under owner-cadence waiver (not PREFIX EXIT).
3. Full `test:e2e:webkit` — aborted after ~8m; **8 iphone-webkit failures listed above**; cadence skip; focused WebKit green.
4. Perf re-measure — skipped under cadence; prior `PERF_WARNING` policy unchanged.
5. `test:round5:standing -- --profile p5` and `git diff --check` — skipped under owner cadence (waiver table).

---

## Tasks 26–29 closed into this tip

| Task | Tip (abbrev) | Deliverable |
|---|---|---|
| 26 | `0ae918c2` / harden → `ceec8f67` | Single card-face composer + cache |
| 27 | `c53a2f43` / harden → `0117df4c` | Pixi hand + keyboard path |
| 28 | `04726eeb` / harden → `5447e728` | Floaters, banners, pile ceremonies |
| 29 | `d082b667` … → `11fb29c0` | DOM whitelist, leak, contrast, Darwin snaps; Linux deferred here |

---

## Cadence notes

- Spec §5 / plan Task 30 Step 3 reviews (Spec + Standards) run **after** this commit; PE self-authors the decision first.
- Task 31 FE: fast-forward onto the recorded hand-off HEAD; do not rebase/amend/force-push publication history.
