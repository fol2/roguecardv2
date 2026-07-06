# Spirebound — Visualisation Hardening & Polish II (design)

**Date:** 2026-07-06
**Goal:** Close the gap between "good demo" and "product players pay for": fix the
two shipped visual correctness bugs, build automated visual QA (geometry
validator, battle simulator with error capture, screenshot regression, perf
gate), then layer the next polish pass (ambient stage life, combat readability,
transitions, map + non-combat screens, 21 raster icons) on top of that safety
net.
**Executor:** a lower-grade agentic LLM. Every workstream must be broken into
mechanical, individually-verifiable tasks in the implementation plan; nothing
may rely on executor taste or judgement.
**Predecessor:** `2026-07-06-visualisation-boost-design.md` (all 14 tasks
executed). This spec inherits its invariants and fixes its two escaped defects.

## Decisions record (owner-approved)

| Question | Decision |
|---|---|
| Scope | Everything: fixes + validation infra + 21-icon raster upgrade + polish (ambient, readability, transitions, map, non-combat screens) |
| Explicitly out | Cutout/skeletal rigging (the 2026-07-04 spike stays parked), audio, engine mechanics, store/trailer production |
| Test harness | Playwright (`@playwright/test` devDependency) + in-page probe API |
| Icon raster policy | Raster only where art renders ≥32px (omen banner, boon cards, art picker); all ≤20px chip/HUD/map sites keep hand-drawn SVG; SVG remains universal fallback |
| Ordering | Fixes → harness (baselines capture *fixed* geometry) → polish workstreams; icon asset generation may run in parallel after the harness lands |

## Measured defects being fixed (evidence, 1920×1080, act 1, 2 sporelings)

| Ground line | y (px from top) | Source |
|---|---|---|
| Enemy art bottoms | 748 | `.enemy` flex box carries ~100px of name/HP/facet/status chrome *below* the art |
| Painted ledge top (`.sl-ledge`) | 756 | `height: 30%` of viewport — moves with window size |
| Glow seam (`.stage-ledge::before`) | 775 | fixed `bottom: 185px; height: 120px` |
| Hero feet / battlefield bottom | 821 / 848 | fixed `inset … 232px` + hero chrome |

Four unrelated ground lines; % vs px anchoring means no single tuning can fix it.

**Mesh death defect:** with mesh warp on (desktop default), `meshBind` sets
`.mesh-live` → the DOM `<img>` is `opacity: 0` and the visible body is a WebGL
plane on `#mesh`. The death path animates only the DOM (`.dying` dissolve →
`.gone` visibility). `layoutPlane()` gates only on `getBoundingClientRect()`,
which `visibility: hidden` does not zero — the plane renders the dead enemy
forever. Nothing removes planes on death (`meshClear` fires only on screen
change). Corollary: every `filter: brightness()` hit-flash in choreography is
invisible under mesh (planes ignore CSS filters).

## Invariants (violating any fails review)

- All invariants from the predecessor spec hold (engine purity, immutable
  internal keys, `assetUrl` fallback, `art.js` structural icons, motion
  discipline, generation workflow). `npm test` (engine) passes at every task
  boundary and stays Playwright-free.
- **New:** after `case 'die'` resolves, a dead enemy is invisible in BOTH
  pipelines: DOM (`.gone`) and mesh (its plane removed/disposed). Enforced by
  `battle.spec`.
- **New:** hero art bottom and every living enemy art bottom sit within ±2px of
  the ground line at all three test viewports. Enforced by `geometry.spec`.
- **New:** zero console errors / unhandled rejections during any scripted
  battle scenario. Enforced by `battle.spec` via the probe error collector.
- Playwright and the probe are test infrastructure: the probe must be tiny,
  side-effect-free at runtime, and must never be imported by `engine.js` /
  `vigil.js`.

## 1. Ground-line unification (fix)

One custom property `--ground-y` (px from screen bottom) defined on
`.combat-screen`, redefined inside each existing combat media-query block,
mirroring the current `.battlefield` bottom insets (desktop 232px; the ≤740px,
≤1188-line landscape and short-landscape blocks mirror their current values).
Derivations (all `calc()`, no new magic numbers elsewhere):

- `.battlefield` bottom inset = `var(--ground-y)`.
- `.stage-ledge` positioned so its glow seam (`::before`, element top edge)
  sits exactly on the ground line.
- `.sl-ledge` drops `height: 30%`; instead `top: calc(100% - var(--ground-y) - var(--ledge-lip))`,
  `bottom: 0`, `object-fit: cover; object-position: 50% 0`. `--ledge-lip`
  (default 14px) is the painted lip that rises behind the combatants' feet.
  Stage plates were generated with the platform's irregular back edge as the
  image top edge, so anchoring the top anchors the surface.
- Enemy boxes: the four below-art rows (`.name`, `.hpbar-wrap`, `.facet-row`,
  `.status-row`) move into an absolutely-positioned plate (`.eplate`) anchored
  to the art box bottom (`top: 100%`), so the flex bottom of `.enemy` IS the
  art bottom. All `ce.enemies[i]` element lookups are class-queries within the
  box and survive the wrap; the `.intent` chip stays where it is.
- Hero side: `.player-zone`'s `translateY(25px)` and below-art chrome are
  re-anchored the same way so hero art bottom = ground line.
- `.lightpool` shadows re-anchor to the new feet line.
- Mesh planes follow automatically (they track element rects per frame).

## 2. Mesh lifecycle (fix)

`src/mesh.js` gains two exports; `ui.js` wires them:

- `meshRelease(el)` — finds the plane whose `p.el` is `el` or a descendant of
  `el`, removes it from the scene, disposes geometry/material, removes
  `mesh-live` from `p.el` (DOM `<img>` becomes visible in the same frame).
  Called at the top of `case 'die'` so the existing DOM death sequence
  (stagger → shatter → dissolve → gone) plays back visibly, unchanged.
- `meshFlash(el, ms = 160)` — temporarily lerps the plane's
  `material.color` toward white and back. `choreoHit`/hit feedback calls it
  when the target is mesh-live, restoring the brightness beat that CSS filters
  cannot deliver on WebGL planes.
- Belt-and-braces: `layoutPlane` hides a plane when
  `!p.el.isConnected || !(p.el.checkVisibility?.({ visibilityProperty: true }) ?? true)`.

## 3. In-page probe + Playwright harness (new infrastructure)

**Probe** (`window.__probe`, defined in `ui.js` beside `window.spirebound`;
always on, no behavioural side effects):

- `geometry()` → `{ viewport, groundY, heroArtBottom, enemyArtBottoms[], slLedgeTop, seamY }`.
- `invariants()` → array of `{ name, pass, detail }`: dead-enemy-hidden (DOM
  and mesh plane count vs living raster enemies), HP bar fill widths match
  engine `cb` state, hand DOM count matches `cb.hand.length`.
- `errors` → collected `window.onerror`, `unhandledrejection`, and
  `console.error` entries (message strings), installed at `initUI`.
- `settle()` → promise resolving when `S.busy === false` and the event queue
  has drained (poll, 50ms).
- `freeze()` → adds `html.freeze` (CSS pauses all animations) and stops
  ambient/canvas spawning; honoured when the page loads with `?freeze=1`.

**Harness**: `@playwright/test` devDependency (`npx playwright install
chromium`); config with three projects — desktop 1280×800, portrait 375×812
(touch), landscape 812×375 — reusing the vite dev server on 5174. New npm
script `test:e2e`; `npm test` unchanged. Scenarios drive the game through
`window.spirebound` (`E.newRun(seed)`, `startCombatUI`, engine calls) with
fixed seeds — the engine RNG is already seed-deterministic.

Suites (`test/e2e/`):

1. `geometry.spec` — per act (1/2/3) and per viewport: start a seeded fight,
   `settle()`, assert feet-on-ground ±2px for hero + all enemies, ledge-top and
   seam relations to `--ground-y`.
2. `battle.spec` (battle simulator) — scripted scenarios, each asserting
   `errors` empty and `invariants()` all-pass after every action: single kill;
   multi-enemy cleave kill; poison(smolder)-tick kill; boss death (worldstop);
   lantern art cast; potion use; a 3-fight seeded mini-run. Runs once with mesh
   on (desktop project) and once with `?mesh=0`.
3. `visual.spec` — screenshot regression with committed baselines: title, map,
   combat start (each act), rewards, shop, event, campfire, lamplighter,
   gallery. Loads with `?freeze=1&mesh=0`, fixed seed, Playwright
   `animations: 'disabled'`, `maxDiffPixelRatio: 0.01`. Baselines live in the
   repo (this machine is the reference; regenerating = explicit
   `--update-snapshots` commit).
4. `perf.spec` — the previously unmeasured gate: portrait project, CDP
   `Emulation.setCPUThrottlingRate(4)`, rAF frame sampler in-page while playing
   a bespoke effect (annihilate) into 3 enemies; assert average fps ≥ 55 and no
   frame > 50ms attributable to the effect window.

## 4. 21 raster icons — Omens (7), Boons (8), Lantern Arts (6)

New asset categories `src/assets/omens|boons|arts/` resolved via `assetUrl`,
subjects defined in a new `docs/icon-art-bible.md` (same structure as the relic
bible: style block, composition rule — single centred emblem/prop, 512px,
alpha, ~15% margin — plus a 21-row per-id subject table authored in the plan).
Display policy:

- **Raster call sites (≥32px):** omen act banner (`omenBanner`) gets a painted
  emblem beside the title; lamplighter boon cards get an art slot above the
  name; lamplighter art picker tiles get painted art; art-cast overlay moment
  reuses the same image.
- **SVG stays:** HUD omen chip, map title, status chips, lantern button, all
  structural icons. The Task-11 SVG set remains the universal fallback (zero
  assets = today's look).
- Gallery gains `omens` / `boons` / `arts` categories; ids equal internal keys.

## 5. Living stage (ambient)

- Per-act ambient weather presets in `vfx.js`, spawned by the existing canvas
  loop only while `S.screen === 'combat'`: act 1 drifting ash + rare rising
  ember; act 2 sinking pale light-motes + slow bubbles; act 3 wind-streaked
  embers + rare magenta sparks. One shared spawner with a per-act parameter
  table (density, palette, velocity, size); LITE ×0.6, `REDUCED` = off. Boss
  fights: same preset ×1.4 density + existing vignette.
- "Lantern breathing": per act, two fixed-position radial-gradient light
  overlays (positions in a per-act table, % coordinates relative to the stage)
  with a slow luminance pulse (CSS, transform/opacity only, reduced-motion
  off).

## 6. Combat readability (refinement of existing systems)

- Damage floater hierarchy: 4 tiers (normal / big ≥16 / crit-kill / overkill)
  with a type scale, archetype-tinted number colour (from `ARCHETYPE_TONES`),
  and per-hit horizontal stagger so multi-hit floaters never overlap.
- "Guard shattered" beat when a hit zeroes remaining block (distinct floater +
  glass-chip burst) — currently block loss and HP loss read identically.
- Telegraph strengthening: brighter intent pulse during `enemyAct`, and the
  enemy's move-name floater restyled as a small plate.
- Turn banner restyle into the stained-glass plate language.
- No new event types; everything derives from events the UI already receives.

## 7. Transitions

One `transition(kind)` helper in `ui.js` (single overlay element,
transform/opacity only, `REDUCED` = instant cut):

- `combat-in`: lantern-iris wipe from the clicked map node's screen position.
- `victory-out`: white-gold bloom that resolves into the rewards panel.
- `defeat`: glass-crack vignette darkening into the end screen.
- `act-change`: full-screen act title plate (act name + omen reveal) replacing
  the current text banner; plays over the existing sunrise/map beat.
- Boss intro keeps the rose-window and gains a boss name plate.

## 8. Map screen upgrade

- Node medallions restyled in the stained-glass chrome language (SVG icons
  unchanged); current-node beacon halo; reachable nodes pulse; visited path
  dims.
- Act-tinted atmosphere: low-density weather motes (reuse §5 presets at ~0.3×)
  and an act-coloured haze band behind the tower.
- Node hover/long-press info card (name + one-line hint), reusing the existing
  tooltip system.
- The DOM-overlay-on-3D projection architecture is untouched.

## 9. Non-combat screens

Shared "scene panel" framing for rewards / shop / event / campfire /
lamplighter: the current act's backdrop plate rendered dimmed + blurred behind
the glass panel (reuses stage assets; zero-asset fallback = current flat
backdrop), consistent header ornament, one button-hierarchy pass. Victory end
screen keeps sunrise; no new assets required.

## 10. Performance budget & QA gates

- Budgets unchanged from predecessor spec (transform/opacity/filter only, LITE
  0.6×, no new rAF loops except the single ambient spawner already inside the
  vfx loop).
- Gate is now *measured*, not assumed: `perf.spec` must pass with ambient
  weather enabled in the scene.
- Every implementation task ends with: `npm test` green, relevant Playwright
  suite green, and (for visual tasks) updated committed baselines reviewed via
  the diff image Playwright emits.
- Final task: full `test:e2e` across all three projects + `npm run build`.

## Out of scope (this pass)

Cutout/skeletal rigging; audio; engine mechanics or event-shape changes;
per-boss unique stages; store screenshots/trailer; CI pipeline setup (the
harness is CI-ready but wiring CI is not this pass).
