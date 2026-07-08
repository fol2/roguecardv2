# Spirebound — Vigil Surfaces & Status Art (design)

**Date:** 2026-07-08
**Goal:** Close the remaining *missing asset-category* gap on the visual-depth
track: give The Vigil's end-of-run / meta surfaces real painted art, and replace
the ≤20px SVG status chips with a larger raster status strip (icon + stack
count, name on hover / long-press only) — without touching engine mechanics or
reviving cutout/skeletal rigging.
**Executor:** a lower-grade agentic LLM. Every workstream must be broken into
mechanical, individually-verifiable tasks in the implementation plan; nothing
may rely on executor taste or judgement.
**Predecessor:** `2026-07-06-visualisation-hardening-polish-design.md` (complete;
kit green 2026-07-07). This pass inherits its invariants (engine purity, fixed
stage, `assetUrl` fallback, Playwright gates, motion discipline).

## Decisions record (owner-approved)

| Question | Decision |
|---|---|
| Direction after hardening | Visual depth — **not** cutout/skeletal rigging |
| Gap type | **Missing categories** (B), not quality-regen of existing live PNGs |
| Primary surfaces | Meta / end-of-run **full set** (A): defeat monument, bequest, victory end, Vigil deeds panel, map monument node |
| Status icons | Included; **break** the old ≤20px-SVG-only policy — chips become raster and the **display layout changes** |
| Status layout | Larger icon strip; **no name** on the strip; **stack count** shown; detail via desktop hover / phone long-press (existing tooltip) |
| Stack badge rule | Show the count only when **n ≥ 2**; n = 1 is icon-only |
| Art morphology | **Hybrid (C):** scene plates for end / monument atmospheres; emblems for deeds, bequest kinds, status, map monument node |
| Delivery shape | **One pass, two workstreams** (status strip ∥ Vigil surfaces), shared infra / gallery / manifest / baselines |
| Explicitly out | Cutout/rigging; per-boss unique stages; audio; engine / event-shape changes; store / trailer; CI wiring; regen of existing card/enemy/relic/etc. live sets; unlock-toast new art (YAGNI) |

## Context (why this pass)

Hardening & Polish II shipped fixes, the Playwright kit, ambient / readability /
transitions / map chrome, and the 21 omen/boon/art rasters. Manifest coverage
for cards, enemies, relics, potions, events, heroes, stage, props, omens, boons,
and arts is complete.

What is still *absent as categories*:

- No painted art for defeat / victory / monument / Vigil deeds / bequest framing
  (those screens are CSS + SVG / emoji / text).
- Status effects remain hand-drawn SVG at chip size; the prior policy forbade
  raster there because display was ≤20px.

This pass fills those categories and changes the status display contract so
raster is legible.

## Invariants (violating any fails review)

- All hardening / boost invariants hold: engine and `vigil.js` stay Node-runnable
  and free of `audio.js` / `stage.js` / DOM; internal keys immutable; structural
  map/HUD icons that remain ≤20px stay on `art.js` SVG unless this spec
  explicitly promotes a call site; `assetUrl` missing → today's look.
- **New:** after this pass, every `STATUS_INFO` key has a `statuses/<key>.png`
  (or SVG fallback); combat status UI shows raster-at-strip-size + stack rule
  above; names never appear on the strip.
- **New:** hero / enemy art bottoms stay within ±2px of the ground line on all
  geometry projects — the status strip may grow the chrome plate **downward
  only**, never lift feet.
- **New:** `DEEDS` keys, bequest kind emblems, and meta scene plates resolve
  through `assetUrl`; zero assets = pre-pass UI.
- `npm test` stays Playwright-free and green at every task boundary.
- Animations: transform / opacity / filter only; `REDUCED` disables new motion;
  LITE does not require extra particles for these surfaces.

## 1. Goal & scope

**In scope**

| Workstream | Deliverable |
|---|---|
| Status strip | 17 status rasters; plate layout = large icon + stack (n≥2); tooltip unchanged in behaviour |
| Vigil surfaces | Defeat + victory scene plates; 8 deed emblems; 3 bequest-kind emblems; map monument-node emblem; UI wiring on end / Vigil panel / map |
| Infra | New `assetUrl` categories, gallery sections, manifest gates, visual baseline updates |

**Out of scope** — see Decisions record. Also: no new status types, no bequest
rule / deed threshold changes, no per-act monument plate variants (one shared
stone atmosphere + act name in copy is enough).

**Success criteria:** `npm test` green with new manifests; geometry + battle
green; visual baselines updated and eyeballed for combat (status strip), end
win/lose, and map-with-monument where exercisable; gallery shows PNG badges for
all new ids; manual smoke: die → carve bequest → next run sees monument node →
claim.

## 2. Architecture

Presentation-only. No engine event-shape changes; no `vigil.js` API changes
(`setBequest`, `bequestOptions`, `claimMonument`, `DEEDS`, `lastFall` stay).

```
data.js          STATUS_INFO / DEEDS keys (immutable)
art.js           SVG fallbacks for statuses / deeds / monument / bequest kinds
src/assets/*     new categories (below)
ui.js            strip markup; end / Vigil / map raster hang points
styles.css       strip + meta scene framing
Playwright       geometry, battle, visual baselines
```

### Asset categories

| Category | Morphology | Ids | Call sites |
|---|---|---|---|
| `statuses/` | emblem 512×512, alpha, ~15% margin | all `Object.keys(STATUS_INFO)` (17) | combat `.cplate` status strip (~32px display) |
| `deeds/` | emblem (same language as relics/omens) | all `Object.keys(DEEDS)` (8) | Vigil deeds panel rows |
| `bequests/` | emblem | `relic`, `card`, `gold` | bequest option chrome (option body may still reuse relic/card art) |
| `meta/` | scene plates (full narrative, not cutouts) | `fallen`, `ascended` | defeat / victory panel backdrop |
| `meta/` | emblem | `monument-node` | map node type `monument` when display ≥32px |

SVG in `art.js` remains the universal fallback and gallery placeholder.

### Policy change

Hardening's "raster only where ≥32px; status chips stay SVG" is **amended**:
status **display sites** move to ≥28–36px and prefer raster. Any leftover ≤20px
status mention (if any) may keep SVG. Omen HUD chips and other structural icons
unchanged by this pass.

### Ordering

1. Bibles + category wiring (shippable with zero PNGs via fallback)
2. Status strip layout (geometry green)
3. Vigil surface framing (slots + scene-bg-style hang)
4. Asset generation (statuses ∥ deeds ∥ bequests ∥ meta) — parallelisable
5. Manifest + gallery acceptance
6. Baseline refresh + final sweep

## 3. Status strip

**Display contract**

- Per status: raster icon (~32px) + stack badge when **n ≥ 2**; **n = 1** icon only.
- **No name** on the strip.
- Desktop: hover → existing tooltip (title + body from `STATUS_INFO` / native-tongue map).
- Phone: existing press-and-hold tooltip path on the combatant / tipped node —
  no new gesture system.
- Overflow: prefer wrapping to a second row over shrinking icons below 28px
  (exact wrap threshold fixed in the plan, e.g. after 5 icons).

**Layout**

- Remains under `.cplate` (shared hero/enemy chrome plate).
- Strip grows plate height **downward**; art box / feet / ground line unchanged.
- `REDUCED` / LITE: static strip; no new motion required.

**Assets & docs**

- Files: `src/assets/statuses/<internalKey>.png`.
- Bible: `docs/status-art-bible.md` — stained-glass emblem language aligned with
  relic/omen bibles; 17-row subject table keyed by internal ids (`str`, `poison`,
  …), never by display names (Fervor / Smolder).

**Code touchpoints**

- `ui.js` status row render; tooltip `_tip` attachment preserved.
- `styles.css` strip + badge.
- `test/test_engine.js` — `checkManifest('statuses', Object.keys(STATUS_INFO))`.
- `geometry.spec` / `visual.spec` as above.

## 4. Vigil surfaces

| Surface | Art | Behaviour |
|---|---|---|
| Defeat (`renderEnd` lose) | `meta/fallen` scene plate behind the monument glass panel (dim + blur + desaturate, same spirit as hardening `sceneBg`) | Keep monument rise / ember CSS; plate is atmosphere only |
| Victory (`renderEnd` win) | `meta/ascended` scene plate behind the panel | Keep `sunrise()` and confetti; plate does not replace them |
| Bequest options | `bequests/{relic,card,gold}` emblems in option chrome | Labels / pick logic unchanged; relic/card options may still show the specific relic/card art as the primary glyph |
| Vigil deeds overlay | `deeds/<deedKey>` per row | Progress bar / copy unchanged |
| Map monument node | `meta/monument-node` (or agreed id) when node medallion display ≥32px | SVG `monument` icon remains fallback; projection architecture untouched |

**Docs:** `docs/meta-art-bible.md` — scene-plate rules (rectangular narrative,
normalised max edge consistent with event art, no chroma-cutout requirement for
scenes) plus emblem subject rows for deeds / bequests / monument-node.

**Not required this pass:** unlock-toast art; per-act monument variants;
bequest "done" state unique plate (opacity / copy change on the same framing is
enough).

## 5. Testing, risks, executor constraints

**Gates (every task end)**

- `npm test` green.
- Relevant Playwright: `geometry` (feet), `battle` (no pageerrors), `visual`
  when pixels change (update snapshots on the reference machine, eyeball diffs).
- Missing PNGs must not blank or throw — fallback only.

**Risks**

| Risk | Mitigation |
|---|---|
| Strip lifts feet off ground line | Downward-only plate growth; geometry gate |
| Raster mush at small sizes | Display ≥28px; bible silhouette / squint checklist at 32px |
| Scene plate fights text | Strong dim/blur/saturate; gold/text contrast preserved |
| No imagegen in executor env | Wiring + layout tasks complete; generation task reports BLOCKED — never fake assets |
| Baseline machine drift | Same capture conventions as hardening (`?mesh=0`, `freeze()`) |

**Executor:** subject tables and reject checklists are normative; no aesthetic
improvisation. Follow `docs/generated-art-workflow.md` for generation.

## Out of scope (this pass)

Cutout / skeletal rigging; per-boss unique stages; audio; engine mechanics or
vigil API / deed threshold changes; store screenshots / trailer; CI wiring;
quality regen of already-manifested live categories; unlock-toast rasters;
animated sprites.

## Predecessor amendment

For status **combat strip** call sites only, this spec supersedes the hardening
decision "all ≤20px chip/HUD/map sites keep hand-drawn SVG" insofar as those
sites are enlarged and converted to raster. All other ≤20px structural icon
policy from hardening remains in force.
