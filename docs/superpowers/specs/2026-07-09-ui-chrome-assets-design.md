# Spirebound — UI Chrome Assets & Combat HUD Redesign (design)

**Date:** 2026-07-09  
**Goal:** Turn remaining combat / HUD / map **chrome** from hand-drawn SVG and
plain CSS into a small **raster UI asset kit**, and lightly redesign Energy,
Facets, HP bars, and End Turn so they match the glass-and-ink language already
shipped for piles, arts, statuses, and Vigil surfaces — without touching engine
math.  
**Predecessor:** Visualisation Hardening & Polish II (`2026-07-06-visualisation-hardening-polish-design.md`);
pile chrome (`2026-07-09-pile-chrome-ceremony-design.md`); Lantern Arts rasters
already in `src/assets/arts/`.  
**Executor note:** Scope is presentation-only. Split into independent tasks in
the implementation plan (HUD glyphs → Energy → Facets/HP → End Turn/Lantern →
Intents → Map nodes → QA).

## Decisions record (owner-approved)

| Question | Decision |
|---|---|
| Scope | **C + map nodes** — combat/HUD chrome, Ward chip, intent icons, map nodes |
| Depth | **B — Chrome redesign** — raster swap + rethink Energy / Facets / HP / End Turn layout look; no engine changes |
| Energy | **A — Candle / wick meter** |
| Facets | **A — Glass chip row** (keep per-pip count read) |
| HP bars | **B — Split roles** — thick glass vial in combat; slim HUD bar + heart icon |
| End Turn | **B — Icon + short label** (not a stained-glass plate button) |
| Small icons (≤20px) | **A — Soften rule** — this chrome set may be raster; SVG remains fallback |
| Map nodes | **C — Shared frame + type glyph** |
| Overall approach | **A — Chrome asset kit** in `src/assets/ui/` |

## Context

After three visualisation rounds, content art is largely raster. What still
reads as “prototype chrome”:

| Surface | Today |
|---|---|
| End Turn | Plain text `.btn` |
| Energy | CSS orb + candle dots |
| Facets | CSS diamond pips (+ SVG `facet` when `facetMax > 8`) |
| HP (hero/foe) | CSS gradient bar + SVG shield Ward chip |
| HP (HUD) | SVG heart + thin CSS bar |
| Coin / deck | SVG `coin` / `cards` |
| Menu | Literal `≡` character (not even SVG) |
| Lantern button | SVG lantern; art chip uses SVG `art-*` even though `src/assets/arts/*.png` exists |
| Intents | SVG sword / shield / up / cloud / plus |
| Map nodes | SVG icons via `iconInline` inside medallions |

**Already done (out of this pass):** pile Draw/Discard/Ashes masters; omen/boon/
art large call sites; status strip rasters; Vigil deeds/bequests/meta plates.

**Policy change:** Hardening II said “all ≤20px chip/HUD/map sites keep
hand-drawn SVG.” This pass **carves an exception** for the chrome ids listed
below. Unlisted structural icons stay SVG until a later pass.

## Invariants

- Engine purity: no `engine.js` / `vigil.js` combat math or event-shape changes.
- `assetUrl('ui', id)` + SVG/CSS fallback; **zero assets = today’s look** (or
  today’s End Turn text / CSS pips).
- Structural icons still come from `art.js` helpers — never font glyphs for
  menu/map/intents (replace `≡` with raster or SVG fallback).
- Preview mirrors (`previewPlay`, ghost HP, facet willchip) keep working; only
  the DOM that displays them changes.
- Map 3D overlay projection (`setOverlay`) architecture untouched.
- `npm test` stays green; asset-manifest rules must account for the new `ui/`
  category (explicit expected ids or documented allowlist — plan chooses one).
- Motion: transform/opacity/filter only; respect `REDUCED` / `LITE`.

## Approach

**Chrome asset kit** — one new category `src/assets/ui/`, a short art bible, a
small `uiIcon`-style helper in `art.js`/`ui.js`, and widget restyles in
`styles.css` that consume those images.

Not chosen: CSS-primary polish with few PNGs (too weak for “turns assets”);
not chosen: extracting heavy widget modules (overkill for this codebase).

## 1. Asset kit

### Category

`src/assets/ui/<id>.png` (transparent; prefer PNG). Resolved via existing
`assetUrl('ui', id)`.

### Id table

| Id | Role | Suggested source size |
|---|---|---|
| `candle-lit` | Energy slot — burning wick | 256–512 |
| `candle-spent` | Energy slot — snuffed / grey wax | 256–512 |
| `facet-empty` | Intact glass chip pip | 128–256 |
| `facet-chipped` | Chipped / lit chip pip | 128–256 |
| `facet-ready` | Optional third pip state; default plan = CSS on `willshatter` only | 128–256 |
| `hp-vial-frame` | Combat HP outer frame (hero + foe) | 512 |
| `heart` | HUD HP icon | 128–256 |
| `coin` | HUD gold + shop price sites that use HUD-scale coin | 128–256 |
| `deck` | HUD deck button | 128–256 |
| `menu` | HUD menu button (replaces `≡`) | 128–256 |
| `ward` | Block/Ward chip beside combat HP | 128–256 |
| `end-turn` | End Turn control glyph | 256 |
| `lantern` | Lantern button body icon | 256 |
| `intent-attack` | Intent: attack | 128–256 |
| `intent-block` | Intent: block / Ward | 128–256 |
| `intent-buff` | Intent: buff | 128–256 |
| `intent-debuff` | Intent: debuff | 128–256 |
| `intent-heal` | Intent: heal | 128–256 |
| `node-frame` | Shared map medallion frame | 512 |
| `node-monster` | Map type glyph (combat) | 256 |
| `node-elite` | Map type glyph | 256 |
| `node-event` | Map type glyph | 256 |
| `node-rest` | Map type glyph | 256 |
| `node-shop` | Map type glyph | 256 |
| `node-treasure` | Map type glyph | 256 |
| `node-boss` | Map type glyph | 256 |
| `node-monument` | Map type glyph (Vigil monument) | 256 |
| `node-unlit` | Unlit Way node glyph (or dimmed lantern) | 256 |

**Lantern Art chip:** do **not** duplicate art portraits under `ui/`. The
lantern button’s `.lb-art` consumes existing `assetUrl('arts', artId)` with SVG
`art-*` fallback (same images as the lamplighter picker).

**Combo intents** (`attack_debuff`, etc.): stack two small intent imgs — same
composition rule as today’s dual SVG — no extra combo assets.

### Explicitly out of kit

Piles; status/omen/boon large arts; card/enemy/relic content; engine; audio;
cutout rigging; rest/shop/event **screen** restyles beyond icons that already
appear in HUD/map.

## 2. Widget redesign

### Energy — candle / wick meter

- Replace the CSS orb + generic dots with a **row of candle slots** equal to
  `maxEnergy` (dynamic).
- Each slot shows `candle-lit` or `candle-spent`.
- Numeric readout remains DOM text (current energy), readable on mobile.
- `.spent` / pop animations may remain; orbiting `::before` comet ring can go
  if it fights the candle read.
- Still positioned as combat chrome (left); no engine change.

### Facets — glass chip row

- Keep one pip per facet (countability).
- Swap CSS diamonds for `facet-empty` / `facet-chipped` images.
- Preserve `willchip` / `willshatter` / preview ghost behaviour via CSS classes
  on pips or row (glow / brighten) — not new engine events.
- `facetMax > 8`: keep compact numeric form; use a small facet/chip glyph
  (raster `facet-chipped` or SVG `facet` fallback) beside the numbers.

### HP bars — split roles

- **Combat (hero + foe):** wrap existing `.fill` / `.ghost` / `.pv` in
  `hp-vial-frame`. Fill colours and preview logic stay; chrome is the frame.
- **Ward chip:** `ui/ward` raster beside the vial (SVG shield fallback).
- **HUD:** `ui/heart` + existing slim `.hud-hpbar`; optional 1px lead-tint
  border only — **no** combat vial art in the top bar.

### End Turn — icon + short label

- Not a plate/chrome button restyle.
- Control = `end-turn` glyph + short label (`End` / `Turn` — exact copy in
  plan; must stay clear in enemy phase when dimmed).
- Keep `.enemy-phase` disable/dim behaviour and click path.

### Lantern button

- `lb-ic` → `ui/lantern`.
- `lb-art` → `arts/<id>` raster when present.
- Ember pips / count / ready pulse unchanged in behaviour.

### HUD icons

- Coin, deck, menu → `ui/*` imgs via helper.
- Menu must never depend on the `≡` character.

### Intents

- Map intent kinds to `intent-*` assets; unknown → attack fallback (same as
  today).
- Staggered / special states that use other icons (e.g. stagger) can stay on
  existing SVG unless a `ui/` id is added later — **stagger is out of this
  kit** unless implementation finds it trivial; default: leave SVG.

### Map nodes — shared frame + glyph

- Medallion = `node-frame` + centred type glyph from the table above.
- Types follow `NODE_ICONS` keys: `monster`, `elite`, `event`, `rest`, `shop`,
  `treasure`, `boss`, `monument`, plus `unlit`.
- Reachable / current / visited / unlit styling remains CSS on the node
  chrome; rasters supply frame + glyph only.
- `iconInline` SVG path remains fallback when assets missing.

## 3. Art direction

New short bible: `docs/ui-chrome-art-bible.md`.

- Spirebound glass & ink: lead lines, stained glass, warm amber flame, deep
  sapphire darks.
- Transparent background; **no baked text**, no full button chrome inside
  glyphs (especially `end-turn` and `menu`).
- **Silhouette-first** at 14–24px: few strokes, one primary shape, strong
  lit/spent and empty/chipped contrast.
- Generation via `tools/imagegen.sh` + `docs/generated-art-workflow.md`.
- Gallery gains a `ui` category for review.

## 4. Wiring

| Layer | Change |
|---|---|
| `art.js` | Helper e.g. `uiIcon(id, size)` → `<img>` from `assetUrl('ui', id)` or `iconSvg` / inline fallback map |
| `ui.js` | HUD, energy candles, facet row, HP vial wrap, End Turn markup, lantern ic/art, intents, map node DOM |
| `styles.css` | Candle row, facet img pips, vial frame, End Turn icon+label, node frame stacking |
| `docs/ui-chrome-art-bible.md` | Subjects + constraints |
| Tests | Manifest expectation for `ui` ids; e2e smoke / visual baseline update when applicable |

No imports of `audio.js` / `stage.js` into engine. Battlefield editor scope
unchanged (chrome positions may still be CSS-fixed as today).

## 5. Task breakdown (for writing-plans)

1. Helper + empty `src/assets/ui/` + bible stub + gallery hook + manifest rule  
2. HUD glyphs: `heart`, `coin`, `deck`, `menu` + replace `≡`  
3. Energy candle meter (`candle-lit` / `candle-spent`)  
4. Facet chips + combat `hp-vial-frame` + `ward`  
5. End Turn icon+label + lantern body + arts chip wiring  
6. Intent icons  
7. Map `node-frame` + type glyphs (incl. monument / unlit)  
8. QA: `npm test`, relevant Playwright, manual desktop + phone-portrait pass  

Art generation may run in parallel once the bible id table is locked.

## 6. Testing & acceptance

- Zero assets: game playable; chrome looks like today (or acceptable SVG/text
  fallbacks).
- Full kit: Energy spend visibly extinguishes candles; facets chip with glass
  chips; combat HP reads as vial; HUD stays slim; End Turn is icon+label;
  intents and map nodes match the kit; lantern art chip shows raster arts.
- `npm test` green; geometry/battle suites green; update visual baselines if
  the suite is armed.
- No console errors on combat open / end turn / map pan.

## Out of scope

Engine mechanics; audio; pile ceremony (done); status/omen/boon asset authoring
(done); full non-combat screen restyle; intent “stagger” dedicated raster
(unless free); CI wiring; cutout/skeletal rigging.

## Open points for the plan (not blockers)

- Exact End Turn label string (`End` vs `Turn` vs `End Turn` shortened).
- Whether `facet-ready` is a third asset or pure CSS on `willshatter`.
- Asset-manifest strategy: enumerate all `ui` ids as required files vs optional
  with fallback (recommend **optional with fallback**, required list only in
  bible/plan checklist — matches omens/arts optional pattern).
