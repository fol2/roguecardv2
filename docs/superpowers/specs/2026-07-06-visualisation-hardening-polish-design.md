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
  battle scenario. Enforced by `battle.spec` — captured at the *Playwright*
  level (`page.on('pageerror')` + `page.on('console')`), not in-page: `drain()`
  deliberately swallows playback exceptions into `console.error`, and
  browser-side capture also catches boot failures the probe could never see.
- Playwright and the probe are test infrastructure: the probe is tiny, its
  readers/drivers reuse the real input code paths, its only mutations are
  explicit test-state shims (`forceHand`/`setEnergy`/`setEmbers`/`setEnemyHp` —
  the same trick `test_engine.js`'s own `forceHand` uses), `freeze()` only
  activates when explicitly called, and it must never be imported by
  `engine.js` / `vigil.js`.
- **New (fixed stage):** the game renders to a fixed virtual resolution and
  scales uniformly. The window size may only change the stage's scale and
  letterbox, never its layout: the same combat at two window sizes of the same
  orientation reports bit-identical probe geometry (stage px). Enforced by
  `stage.spec`.

## 1b. Fixed virtual stage (implemented 2026-07-06, same commit as the kit)

The game is a game, not a responsive page. `src/stage.js` (imports nothing;
imported by scene3d/vfx/mesh/ui) owns one `#stage` element that wraps every
layer in `index.html`. Five canonical shapes, nothing else:

| shape | stage px | picked when |
|---|---|---|
| `phone-portrait` | 390×844 | touch + window aspect < 0.567 |
| `phone-landscape` | 844×390 | touch + aspect > 1.765 |
| `pad-portrait` | 820×1180 | aspect < 1 (touch or not) |
| `pad-landscape` | 1180×820 | touch + aspect ≥ 1, or desktop aspect ≤ 1.600 |
| `desktop-landscape` | 1458×820 (≈16:9) | desktop (non-touch) + aspect > 1.600 |

`desktop-landscape` exists so a 16:9 monitor fills the frame instead of
pillarboxing the iPad stage; it shares the 820 height (and therefore every
vertical layout metric and the full-desktop `@container` regime) with
`pad-landscape` — only the horizontal breathing room differs.

(splits are the geometric means of neighbouring supported aspects;
`?shape=<name>` forces one for tests/dev.) `initStage()` runs before every
other init so its resize listener fires first; it sizes `#stage` at stage px,
centres it with `left/top`, and applies a uniform `transform: scale()` —
bigger monitor = bigger pixels, never more world. The body behind it is the
letterbox (black).

Consequences the rest of the code relies on:

- **The transform makes `#stage` the containing block for every
  `position: fixed` layer inside it** — vfx/mesh/floaties/tooltip/overlay are
  all "fixed to the stage" for free.
- **Two coordinate spaces, one rule.** Layout/effects code speaks *stage px*;
  pointer events and `getBoundingClientRect` speak *client px*. Cross over at
  the boundary only: `toStage(x, y)` for pointers, `stageRect(el)` for rects
  (`V.centerOf` is stage-native). `document.elementFromPoint` keeps client px.
  Input *thresholds* (drag-start 26px, long-press slop 12px, map-pan velocity)
  deliberately stay client px — physical feel should not change with scale.
- **Canvases render at stage size × real density.** scene3d/vfx/mesh size
  their backing stores from `stageW()/stageH()` with
  `pixelRatio = min(devicePixelRatio × stageScale(), cap)` (caps unchanged:
  1.35/1.75 scene, 2 vfx/mesh). The 3D camera aspect is a constant of the
  shape — an ultrawide sees the same frustum, pillarboxed.
- **CSS breakpoints query the stage, not the window.** The three layout
  media queries became `@container stage (...)` blocks (`#stage` is a size
  container); every `vw/vh/dvh` length became `cqw/cqh`. The cascade is
  unchanged: pad-landscape gets the desktop layout, pad-portrait the ≤1100
  tune, phone-portrait ≤740, phone-landscape the ≤480-height block. Input
  media queries (`pointer: coarse`, `prefers-reduced-motion`) stay media
  queries.
- **Popups live inside the stage.** `.pop-menu` / `#toasts` append to
  `#stage` (not `document.body`) so they scale with the game.
- **The probe reports stage px** (`geometry()`, plus `stage()` →
  `{ shape, w, h, scale }`), which makes every geometry assertion
  resolution-independent by construction.

`stage.spec` is the executable contract: shape mapping per Playwright
project (desktop = 1600×900 → `desktop-landscape`), uniform-scale + centred
letterbox of the real `#stage` box, the `?shape=` override, a 4:3 window
keeping `pad-landscape`, a no-scrollable-overflow check on the title screen
at its fullest (saved run + vow V + both heroes — nothing inside `#stage`
may show a scrollbar at rest), and geometry
bit-equality across a window resize. Safe-area insets still come from the
window (`env()`); on real phones the stage fills the screen (scale ≈ 1) so
the offsets remain correct.

**Title screen (no window scrollbars):** `.title-screen` must not overflow its
stage at rest — the fullest profile (saved run, Continue button, both aspects,
vow stepper at V with the five-line ledger) is the regression case.
Landscape stages (820px and 390px tall) get recomposed layouts in
`@container stage` blocks: smaller wordmark, sideways aspect cards, utility
buttons on one row; `justify-content: safe center` prevents top clipping if
content ever grows; `html, body { overflow: clip }` forbids window scrolling.
Enforced by `stage.spec` on all three Playwright projects.

## 1. Ground-line unification (fix)

One custom property `--ground-y` (px from screen bottom) defined on
`.combat-screen`, redefined inside each existing combat `@container stage`
block. Rule for the plan: find every rule that sets a `.battlefield` bottom
inset (base rule + every container block) and lift that block's bottom-inset
value into `--ground-y` for the same block — values do not change, they become
the single source of truth (desktop is 232px today).
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

**Probe** (`window.__probe`, defined in `ui.js` beside `window.spirebound` —
**as built 2026-07-06**):

- Readers: `geometry()` → `{ stage, viewport, groundY, heroArtBottom,
  enemyArtBottoms[], slLedgeTop, seamY }` (groundY := `.battlefield` bottom,
  so the contract is measurable before `--ground-y` exists; **all values in
  stage px** — see §1b) and `stage()` → `{ shape, w, h, scale }`;
  `invariants()` →
  `{ name, pass, detail }[]`: dead enemies leave the field (DOM) *and* release
  their mesh plane (`.mesh-live` must not sit on a corpse), HP labels / hand
  count / energy / embers all match engine `cb` state; `state()` → screen,
  busy, over/result, player, enemies, hand uids.
- Drivers (reuse the real input paths, so tests exercise `doPlay`/`onEndTurn`/
  `drain`/`afterAction`): `play(uid, target)` (returns false if the card
  stayed in hand), `endTurn()`, `useArt()`, `usePotion(slot, target)`.
- Test-state shims: `forceHand(ids)`, `setEnergy(n)`, `setEmbers(n)`,
  `setEnemyHp(i, hp)`.
- `settle()` → resolves when `S.busy === false` and `cb.queue` is empty.
- `freeze()` → one-way determinism switch: `html.freeze` pauses all CSS
  animation, hides the nondeterministic layers (`#bg3d`, `#vfx`, `#mesh`,
  `#grain`, `#floaties` — a full-viewport canvas can't be masked without
  blanking the shot), stops the vfx/rig loops, and pins the 3D scene to a
  fixed timestamp (`freezeScene()` in scene3d, `freezeVfx()` in vfx). No
  `?freeze=1` — tests call it explicitly after settling.

Error capture lives in the harness, not the probe (see invariants above).

**Harness** (as built): `@playwright/test` devDependency; three projects —
desktop 1600×900 (→ `desktop-landscape` stage), portrait 375×812 (touch,
→ `phone-portrait`), landscape 812×375 (touch, → `phone-landscape`) — reusing
the vite dev server on 5174; `workers: 2` (each page runs a full three.js
scene); `trace: off` (tracing corrupts on the WebGL page), failure screenshots
on; Chromium launched with `--use-angle=metal` on macOS (software WebGL idles
at ~14fps vs ~117fps on Metal — every animation wait and fps number depends on
this). npm scripts: `test:e2e`, `test:e2e:update` (baselines),
`test:e2e:perf` (perf alone, single worker). `npm test` additionally gained an
asset-manifest gate: every CARDS/ENEMIES/RELICS/POTIONS/EVENTS/ASPECTS/stage/
props id must have exactly one file in `src/assets/<cat>/`, both directions.

Suites (`test/e2e/`):

0. `stage.spec` — the §1b fixed-viewport contract: project → shape mapping
   (including `desktop-landscape` on wide desktops and `pad-landscape` on
   4:3-ish windows), uniform-scale centred letterbox, `?shape=` override,
   no-scrollable-overflow on the fullest title profile, geometry bit-equality
   across a desktop window resize. **Green** (9 tests, 6 desktop-only skips).
1. `geometry.spec` — per act (1/2/3, canon encounters) and per viewport, plus
   a trio fight and a desktop live-resize check: seeded fight, `settle()`,
   assert hero + living-enemy art bottoms within ±2px of the ground line,
   painted ledge top 4–64px above it, seam within the lip band. `?mesh=0`
   (geometry is a DOM contract).
2. `battle.spec` (desktop project only — logic is viewport-independent):
   scripted scenarios asserting zero errors + all invariants after every beat:
   opening coherence; mid-fight strike kill with mesh **forced on** (`?mesh=1`,
   waits for real planes so a WebGL-less environment fails loudly) and its
   `?mesh=0` twin (isolates the defect to the mesh lifecycle); smolder-tick
   kill during the enemy phase; boss death → rewards screen + `worldstop`
   released; lantern art cast (embers accounting); potion kill → rewards; a
   3-fight random-agent mini-run through the real UI pipeline. No content
   constants (omens legitimately bend opening rules — e.g. seed 20260706
   rolls Ember Wind, draw 4).
3. `visual.spec` — screenshot regression: title, map (2.8s camera settle),
   combat acts 1–3, reward, shop, rest, treasure, event; `?mesh=0` + explicit
   `freeze()`; `maxDiffPixelRatio: 0.01`. **Baselines are deliberately not
   committed yet** — capturing them now would enshrine the broken geometry;
   the suite auto-skips until `visual.spec.js-snapshots/` exists. Capture with
   `npm run test:e2e:update` once geometry.spec and battle.spec are green,
   then commit the snapshots (this machine is the reference).
4. `perf.spec` — the previously unmeasured gate, now measured: portrait
   project, 3s shader warm-up, CDP `Emulation.setCPUThrottlingRate(4)`, rAF
   sampler across a double-annihilate burst into three enemies; assert avg
   fps ≥ 55 and p95 frame ≤ 22ms; prints the measured numbers. Runs only via
   `npm run test:e2e:perf` so parallel WebGL pages never pollute the numbers.

**Kit status after final sweep (2026-07-07):**

| Suite | Status | Notes |
|---|---|---|
| `npm test` | green | Engine checks, asset manifest, and 300-run monte-carlo |
| `npm run build` | green | Production bundle builds; Vite chunk-size warning only |
| `stage.spec` / `geometry.spec` / `battle.spec` | green | Included in the default Playwright kit |
| `visual.spec` | intentionally skipped | Baselines remain absent; no visual reds in the default kit |
| default Playwright kit | **68 passed, 44 skipped** | `npx playwright test --reporter=list` |
| `perf.spec` | **2 passed, 2 skipped** | `PERF=1 npx playwright test perf --workers=1`; avg 112.6fps, p95 frame 14.6ms, worst frame 35.2ms over 339 frames |

Manual smoke is green. Desktop at `1600x900` used a real title -> Lamplighter
start and a full act route through 15 map nodes to the act-2 map, with combat,
event, rest, treasure, boss reward, `tr-iris` / `tr-bloom` / `tr-plate`
transitions, corpse `dying` / `gone` markers, live weather pixels, and centred
`desktop-landscape` letterboxing with no overflow. A `390x844` touch portrait
fight observed `phone-portrait` framing, weather pixels, death shatter markers,
and no console or page errors.

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
