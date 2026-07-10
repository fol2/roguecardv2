# Spirebound — Round 5: Canvas UI & Ship-front (design)

**Date:** 2026-07-09
**Goal:** The final visual-hardening round. Replace the fragile CSS-composited
combat UI with a **game-rendered PixiJS layer** (chrome *and* hand cards), give
every remaining screen (title, Embark, fallen/victory, non-combat panels, map)
its award-bar treatment, and clear the ship-front backlog (per-boss stages, CI,
store visual kit, unlock-toast art). After this round the UI should read as a
commercial game, not a styled web page.
**Executor:** a lower-grade agentic LLM. Every workstream must be broken into
mechanical, individually-verifiable tasks in the implementation plans; nothing
may rely on executor taste or judgement.
**Predecessors:** `2026-07-06-visualisation-hardening-polish-design.md`
(fixed stage, Playwright kit, invariants), `2026-07-09-ui-chrome-assets-design.md`
(the 27-asset `ui/` kit this round reuses as textures),
`2026-07-09-pile-chrome-ceremony-design.md` (flight budgets carried over),
`2026-07-09-entrance-progressive-delivery-design.md` (**hard prerequisite:**
Phase 2 — variants, Emberglass chain, rose window — must be merged before this
round starts; this spec assumes those surfaces exist).

## Decisions record (owner-approved)

| Question | Decision |
|---|---|
| Capacitor packaging | **Out of scope** — pure visual round. But Capacitor *compatibility* is protected by new invariants (WebKit-safe APIs, GPU context budget, real-device smoke) so nothing this round makes the future Capacitor round harder |
| UI end-state | **Canvas/WebGL chrome**, not data-driven DOM and not a framework migration |
| Canvas migration depth | **Full combat UI including hand cards** (drag-to-play, tilt, foil) — chrome, piles, floaters, banners, hand |
| Engine | **PixiJS v8**, WebGL renderer pinned (never WebGPU) |
| Ordering vs content line | **Progressive Delivery Phase 2 executes first**; this round starts after it merges |
| Screens in scope | All four sets: fallen/victory, title + Embark, non-combat panels (rewards/shop/event/rest/lamplighter/vigil), map re-upgrade (light) |
| Catch-up items | All four: per-boss unique stage sets, CI wiring, store visual assets, unlock-toast art |
| What stays DOM | Tooltip, pop-menus, toasts, settings, map screen (DOM-on-3D projection), all non-combat screens — restyled, not migrated |

## Context (why this pass)

Four visual rounds (2026-07-04 details polish; 2026-07-06 visualisation boost;
2026-07-06 hardening & polish II; the 2026-07-08/09 cluster — vigil surfaces,
status art, aim halo, Ward glass shell, pile ceremony, UI chrome kit, both
editors) plus a separate audio line have taken content art to raster and combat
choreography to a high bar. What remains fragile is the *UI substrate itself*:

- Combat chrome is CSS composition hand-tuned pixel by pixel — the UI-chrome
  round left dozens of "Nudge / Enlarge / Shrink / Restore" commits as evidence
  that the model has no stable widget layer.
- `ui.js` is a 4.3k-line single orchestrator rendering every screen.
- Fallen/victory screens are a meta plate behind a CSS panel; the title got
  *cleaned* by Progressive Delivery Phase 1 but never visually hardened; the
  non-combat screens only ever received scene-panel backdrops and icons.
- Repeatedly deferred ship-front work (CI, per-boss stages, store assets) has
  never been picked up.

## Invariants (violating any fails review)

- **Engine purity is untouched.** `engine.js`, `vigil.js`, `data.js`,
  `battlefield*.js`, `uic.js`, `ui-chrome-layout.js` stay Node-runnable and
  DOM-free. `drain()` still consumes `cb.queue`; only the playback target
  changes from DOM to sprites. `npm test` green at every task boundary.
- **Fixed virtual stage rules apply to Pixi.** The `#uigl` canvas is sized in
  stage px with the same DPR-cap discipline as vfx/mesh; pointer events cross
  the boundary through `toStage()`; input thresholds (drag-start 26px,
  long-press slop 12px) stay client px — physical feel must not change.
- **Layout files remain the single source of geometry truth.**
  `battlefield-layout.js` and `ui-chrome-layout.js` feed the Pixi renderer;
  bfedit and bfuiedit continue to work, editing the same files.
- **DOM allowed-list.** After Phase 3 the combat screen's DOM is exactly:
  combatants (art + mesh), the vfx canvas, tooltip/pop-menu/toast mounts.
  Everything else in combat is Pixi. Non-combat screens stay DOM by design.
- **Single card-face renderer.** One Pixi composer renders every card face;
  DOM contexts (deck viewer, rewards, shop stock) consume its exported
  textures as `<img>`. Two card-face implementations may never coexist.
- **WebKit-safe API rule.** Every new API must work in current iOS WKWebView:
  WebGL only (no WebGPU), no SharedArrayBuffer dependence, OffscreenCanvas
  only within Safari 16.4+ coverage, fonts bundled locally. Enforced as a
  review checklist item on every task.
- **GPU context budget.** WebGL contexts may not exceed three (scene3d, mesh,
  Pixi). Every WebGL layer gains context-loss/restore handling. Absorbing the
  2D vfx canvas into Pixi is a stretch goal that *reduces* the count; nothing
  may increase it.
- **Fallback discipline on canvas.** A missing texture renders as a
  Pixi-drawn vector primitive (the canvas analogue of the SVG fallback rule);
  the game is always playable with zero assets.
- **Motion discipline carries over.** The shared easing tokens
  (`--ease-out-soft`, `--ease-spring`) are ported to one code-side tween
  helper; `REDUCED` collapses to instant states; LITE gets a Pixi tier
  (foil/filters off, lower DPR cap).
- **Preview mirrors are untouched.** `previewPlay` / `previewBlock` /
  `previewEnemyDmg` stay pure; only their display layer changes.
- Playwright suites are updated **in the same phase** that moves their
  contracts; visual baselines re-captured per phase on the reference machine
  and eyeballed. No phase ends with a red kit.
- Internal keys, card/relic/status ids, save shapes: immutable, as ever.

## 1. Architecture

### Layers

```
z-order inside #stage:
  #bg3d (three.js scene)  →  stage plates  →  combatants + #mesh  →  #vfx
  →  #uigl (PixiJS v8, WebGL, stage-px sized)  →  DOM: tooltip / pop-menu / toasts
```

### Module decomposition (Phase 1, pure refactor)

`src/ui.js` splits into a `src/ui/` directory; `src/ui.js` remains as a thin
re-export so `main.js` and console hooks (`window.spirebound`, `window.__probe`)
are unchanged:

| Module | Owns |
|---|---|
| `ui/index.js` | orchestrator: `show()`, screen routing, boot |
| `ui/drain.js` | `drain()` and the event→handler dispatch |
| `ui/combat.js` | combat screen assembly (later delegates to `ui/combat-gl.js`) |
| `ui/screens/*.js` | title, embark, map, rewards, shop, event, rest, lamplighter, end, vigil |
| `ui/widgets.js` | (Phase 2+) the Pixi widget kit |
| `ui/combat-gl.js` | (Phase 2+) the Pixi combat scene |
| `ui/cardface.js` | (Phase 3) the single card-face composer + texture export |
| `ui/tween.js` | code-side easing tokens + ticker tweens |

Phase 1 produces **zero visual change** — the full Playwright kit passing
unchanged is its acceptance proof, and it lands before any Pixi work.

### Probe v2

- `geometry()` largely survives (combatants stay DOM).
- New `ui()` reader traverses the Pixi scene: hand card uids + stage-px
  bounds, pile counts/tiers, energy, lantern state, End Turn enabled.
- Drivers (`play`, `endTurn`, `useArt`, `usePotion`) keep calling the real
  internal handlers; battle.spec assertions move from DOM reads to `ui()`.
- At least one e2e test drives a card by **synthesised pointer events on the
  canvas** (press → drag → release) to prove real hit-testing, not just the
  driver path.

## 2. Phase 2 — combat chrome on canvas

- **Widget kit** (`ui/widgets.js`): nine-slice plate, meter, counter, button,
  sprite-state switcher. These are the primitives every later phase reuses.
- **Migrates:** energy candles, facet chips, HP vials + Ward chip, the three
  pile widgets (stack tiers + always-visible counts), End Turn, lantern
  button (ember pips, art chip, ready pulse), intent chips, top HUD (HP,
  gold, deck, menu, omen chip).
- **Geometry:** consumed from `ui-chrome-layout.js` via `uic.js` — the
  hand-tuned values are inherited, not re-derived. bfuiedit keeps editing
  them; the Pixi renderer live-reloads on save in dev.
- **Textures:** the existing 27 `src/assets/ui/*.png` load as Pixi textures;
  no regeneration needed.
- **Tooltip bridge:** sprite hover / long-press forwards to the existing DOM
  tooltip, positioned from sprite bounds (stage px → client px).

## 3. Phase 3 — hand, floaters, banners (combat fully game-rendered)

- **Card-face composer** (`ui/cardface.js`): frame (per rarity), art, name,
  cost gem, wrapped body text with keyword icons, rarity chrome, upgrade
  state. `cacheAsTexture` per card+state; invalidated only when content
  changes (upgrade, cost change, preview tint).
- **Hand:** fan/arc seat layout ported from the CSS seat logic; drag-to-play
  with unchanged client-px thresholds; desktop hover lift + tilt + foil
  sheen shader (LITE: foil off); touch long-press inspect. Ghost/lethal
  preview numbers render as Pixi text from the untouched pure previews.
- **Floaters:** the 4-tier damage hierarchy as Pixi BitmapText with archetype
  tints and the existing stagger rules; turn banner, boss intro plate, and
  the guard-shattered beat become sprite/text sequences on `ui/tween.js`.
- **Pile ceremony re-wired:** draw / discard / exhaust / reshuffle per-card
  flights re-implemented as Pixi sprites under the same wall-clock budgets
  as the pile-chrome spec (`discardHand` ~320–480ms, `reshuffle` ~450–650ms,
  stagger compresses with n).
- **Aim outlines are out of scope** — they live on combatants (mesh/SVG) and
  are unaffected.

## 4. Phase 4 — screens (DOM, restyled to the award bar)

### Title + Embark

- Title: the key art re-cut into 2–3 parallax layers (imagegen fills the
  gaps), ember drift, a once-per-session wordmark ignition sequence, button
  column restyled in the widget-kit language; the Vigil pulse and rose-window
  medallion (Phase 2 surfaces) get their finished treatment.
- Embark: aspect picker as full-art panels (hero art + kit summary) with a
  selection ceremony; vow stepper as a lantern dial with the cumulative
  ledger; Begin plays a lantern-lighting transition into the map. Reveal
  logic from Progressive Delivery Phase 1 is untouched — presentation only.

### Fallen / Victory (ceremony tier)

- Fallen: monument-carving ceremony — the plate rises, chisel-strike beats
  with ember spray, bequest choice framed as a ritual, the whisper line, and
  stats engraved via `tweenNum`.
- Victory: dawn ceremony — light bloom, ascended-plate parallax, the Phase 2
  shard/page queue moments given their full visual weight, stats as an
  illuminated ledger, "the climb continues" close.
- Existing `sunrise()`, confetti, and monument CSS are upgraded in place, not
  replaced, wherever they survive the bar.

### Non-combat panels (rewards / shop / event / rest / lamplighter / vigil)

- Scene panel v2: act backdrop + mid layer with slow parallax (true depth),
  one shared header ornament, one button-hierarchy token pass.
- Shop gains merchant presence (existing event/props art); stock cards use
  card-composer textures (single-renderer rule); rest gets a firelight
  pulse; event gets art-plate framing; lamplighter boons/picker and both
  Vigil tabs adopt the same panel language.

### Map (kept light — R3 already upgraded it)

- Node entrance stagger (floors light up on map entry), path-ignite ceremony
  on route choice, camera settle polish. The DOM-on-3D projection
  architecture is untouched.

## 5. Phase 5 — assets & ship-front (parallelisable with Phase 4)

- **Per-boss stage sets:** three bosses × (backdrop / mid / ledge) = 9 plates
  through the locked imagegen workflow + a stage-bible amendment. Fallback:
  the act's standard set.
- **Unlock-toast art:** one generic unlock plate frame; the toast illustration
  reuses deed emblems / content art. Small task.
- **Store visual kit:**
  - Screenshot capture kit: a Playwright script drives probe-staged scenes
    (title, bespoke combat moment, map, rose window, boss) and captures
    device-sized framed screenshots (iOS 6.7"/6.1"/iPad 12.9; Play phone /
    7" / 10").
  - Feature graphic + icon refresh from the final title key art
    (`tools/gen-icons.sh` flow).
  - Trailer raw footage: probe-driven deterministic sequences captured as
    Playwright video, plus a shot-list doc. Editing is out of scope.

## 6. Testing & QA

### Phase 0 — CI (lands first)

GitHub Actions: `npm test` + `npm run build` + Playwright (Chromium on
ubuntu; the linux baselines already exist) on every PR and push to main.
`perf.spec` runs as a nightly/manual job — CI runner numbers are recorded,
not gating. Failure screenshots/diffs upload as artifacts.

### Standing gates (every task, every phase)

1. `npm test` green.
2. geometry / battle / stage suites green — updated in the same phase that
   moves a contract.
3. Visual baselines re-captured per phase on the reference machine and
   eyeballed; no cross-phase baseline debt.
4. Probe v2 keeps battle.spec meaningful on canvas; the synthesised-gesture
   drag test passes.
5. Perf gate unchanged in numbers (portrait, CPU 4×, avg ≥ 55fps, p95 frame
   ≤ 22ms) but measured **with the Pixi scene active**; plus a context-loss
   smoke: simulate WebGL context loss → the app restores.
6. **iOS Safari real-device smoke per phase** (Tailscale dev server): drag
   feel, audio unlock, fonts, fps eyeball. Mobile Safari shares WebKit with
   WKWebView, so this is the zero-Capacitor-cost insurance for the future
   packaging round.
7. WebKit-safe API rule reviewed per task.

### Award-bar acceptance checklist (mechanical, per screen)

- Every interactive element has distinct rest / hover / pressed / disabled
  states.
- Every state change moves — no property snaps except under `REDUCED`.
- No linear easing anywhere; only the shared tween tokens.
- Every screen has one memorable moment (ignition, ceremony, reveal).
- Nothing reads as browser-default: no default focus rings without styling,
  no system font fallbacks, no unstyled scrollbars inside the stage.
- Text contrast ≥ 4.5:1 against its actual backdrop.

## 7. Phasing

| Phase | Content | Nature |
|---|---|---|
| P0 | CI wiring | Small; the safety net precedes the rebuild |
| P1 | `ui.js` → `src/ui/` decomposition | Pure refactor; zero visual change; full kit green as proof |
| P2 | Pixi bootstrap + widget kit + chrome migration | First canvas UI |
| P3 | Hand + floaters/banners + pile flights | Combat fully game-rendered |
| P4 | Screens: title/Embark, fallen/victory, non-combat, map | Per-screen deliverables |
| P5 | Per-boss stages, unlock toast, store kit | Parallel with P4 after P3 |

Each phase is independently shippable. P4/P5 items are individually
droppable without stranding P2/P3 — the pressure valve for "see how much we
can cover".

## 8. Risks

| Risk | Mitigation |
|---|---|
| Pixi performance on WKWebView unknown | Real-device smoke from P2 onward; DPR caps; Pixi LITE tier (foil/filters off) |
| GPU context pressure | WebGL-pinned; context-loss handling everywhere; vfx absorption as a count-reducing stretch goal |
| Baseline churn overwhelms review | Re-baseline once per phase; eyeball diffs; never accumulate |
| Card text fidelity (font timing) | Font-ready gate before the first Pixi text bake; fonts bundled |
| DOM/Pixi card-face drift | Single composer + texture export; DOM grids consume exports |
| `ui.js` decomposition regressions | P1 is zero-visual-change with the full kit as evidence, before any Pixi work |
| Collision with the content line | Hard prerequisite: Progressive Delivery Phase 2 merges first |
| Scope pressure ("last round") | Every phase shippable; P4/P5 items individually droppable |

## Out of scope (this pass)

Capacitor packaging (compatibility protected by invariants only); engine
mechanics or event-shape changes; audio redesign; localisation; daily seeds /
challenge modes; cutout/skeletal rigging; Act 4 content; trailer editing;
save-storage migration (stays guarded localStorage / vigil adapter until the
Capacitor round).

## Success criteria

1. Combat is fully game-rendered: DOM in combat is exactly the allowed list;
   the perf gate passes with the Pixi scene active on the portrait project.
2. bfuiedit still edits live chrome geometry, now rendered by Pixi; bfedit
   (combatants + stage plates, which stay DOM) is unaffected and still works.
3. All four screen sets pass the award-bar checklist in a recorded manual
   review; fallen/victory play as ceremonies, the title has its ignition.
4. CI runs the kit on every PR; a red kit blocks merge.
5. The store kit produces the full screenshot set + feature graphic + raw
   trailer footage from one scripted run.
6. Fresh-profile and veteran-profile manual smokes (with the Progressive
   Delivery reveal ladder active) both read coherently on desktop and on a
   real iPhone via the Tailscale dev server.
