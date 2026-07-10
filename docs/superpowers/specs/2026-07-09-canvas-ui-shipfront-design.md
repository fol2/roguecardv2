# Spirebound — Round 5: Canvas UI, Content Registries & Ship-front (design)

**Date:** 2026-07-09 (revised same day: content-registry & dev-tooling amendment;
revised again after three independent reviews — gstack four-lens, ponytail
over-engineering, ask-matt grilling — with owner decisions recorded below)
**Goal:** The final visual-hardening round. Replace the fragile CSS-composited
combat UI with a **game-rendered PixiJS layer** (chrome *and* hand cards),
rebuild the content substrate as **registries + compiled-in content packs** so
expansions and Act 4 become data drops instead of codebase surgery, grow the
dev tooling (Content Lab, completeness reporting, CRUD content editor), give
every remaining screen (title, Embark, fallen/victory, non-combat panels, map)
its award-bar treatment, and clear the ship-front backlog (per-boss stages,
CI, store visual kit, unlock-toast art). After this round the UI should read
as a commercial game, and new content should register instead of being wired.
**Executor:** a lower-grade agentic LLM. Every workstream must be broken into
mechanical, individually-verifiable tasks in the implementation plans; nothing
may rely on executor taste or judgement. Where this spec demands judgement
(art direction, ceremony feel), the task is explicitly marked **owner
checkpoint**, never left to the executor.
**Predecessors:** `2026-07-06-visualisation-hardening-polish-design.md`
(fixed stage, Playwright kit, invariants), `2026-07-09-ui-chrome-assets-design.md`
(the 27-asset `ui/` kit this round reuses as textures),
`2026-07-09-pile-chrome-ceremony-design.md` (flight budgets carried over),
`2026-07-09-entrance-progressive-delivery-design.md` (**hard prerequisite:**
Phase 2 — variants, Emberglass chain, rose window — must be merged before this
round starts; this spec assumes those surfaces and tables exist).

## Decisions record (owner-approved)

| Question | Decision |
|---|---|
| Capacitor packaging | **Out of scope** — pure visual round. But Capacitor *compatibility* is protected by invariants (WebKit-safe APIs, GPU context budget, real-device smoke) so nothing this round makes the future Capacitor round harder |
| UI end-state | **Canvas/WebGL chrome**, not data-driven DOM and not a framework migration |
| Canvas migration depth | **Full combat UI including hand cards** — but gated: a **P0.5 real-device spike** must pass before P1 begins, and a **P4→P5 checkpoint** (measured on a real iPhone) must pass before the hand migrates. "Pixi chrome + DOM hand" is a declared-acceptable shipped state if P5 stops |
| Engine | **PixiJS v8**, WebGL renderer pinned (never WebGPU) |
| Ordering vs content line | **Progressive Delivery Phase 2 executes first**; this round starts after it merges. During P2 (re-homing) the content line observes a **content-table freeze** (assets/plans only) |
| Content substrate | **Full content-pack architecture**: per-domain registries with schemas, existing content re-homed as the `core` pack, `data.js` becomes the assembler. Registry work lands **before** any Pixi work. Pack contract is **data plus behaviour functions** (enemy `ai` stays code — see §2); an AI-DSL is explicitly out of scope |
| Pack delivery | **Compiled-in** (static imports; an expansion ships as an app update). Runtime/downloadable DLC out of scope — the pack *format* is the future-proofing, not a download pipeline. No save-shape change for packs (unknown-id validation already rejects a save whose content is absent) |
| Dev tooling | Dev shell, Content Lab, completeness reporting ("content doctor"), CRUD content editor. The CRUD editor and dev shell are **droppable pressure-valve items**; the CRUD editor covers cards/relics/potions/themes only and never touches behaviour fields |
| Store kit | Keep the **capture script + shot list** (rerunnable assets); the captured set is labelled **provisional/marketing-only**; trailer capture is raw reference footage only; device-framed store matrices and store-grade capture re-run in the Capacitor round |
| Screens in scope | All four sets: fallen/victory, title + Embark, non-combat panels (rewards/shop/event/rest/lamplighter/vigil), map re-upgrade (light) |
| Catch-up items | All four: per-boss unique stage sets, CI wiring, store visual assets, unlock-toast art |
| What stays DOM | Tooltip, pop-menus, toasts, settings, map screen (DOM-on-3D projection), all non-combat screens — restyled, not migrated |

## Context (why this pass)

Four visual rounds (2026-07-04 details polish; 2026-07-06 visualisation boost;
2026-07-06 hardening & polish II; the 2026-07-08/09 cluster — vigil surfaces,
status art, aim halo, Ward glass shell, pile ceremony, UI chrome kit, both
editors) plus a separate audio line have taken content art to raster and combat
choreography to a high bar. What remains fragile is the *substrate*:

- Combat chrome is CSS composition hand-tuned pixel by pixel — the UI-chrome
  round left dozens of "Nudge / Enlarge / Shrink / Restore" commits as evidence
  that the model has no stable widget layer.
- `ui.js` is a 4.3k-line single orchestrator rendering every screen.
- **Content is scattered.** One card's identity spans `data.js` (stats, `vfx`
  field), `src/assets/cards/`, `vfx.js` (`BESPOKE_VFX`), pool/wave membership
  in `PROGRESSION`, and unlock `locked:` flags. One enemy adds `char-meta.js`
  (mesh/shadow/aim) and `VARIANTS`. One *act* is worse: `act1-*` asset naming
  conventions, a weather table in `vfx.js`, palette tints in CSS, music-cue
  selection in `music.js`/`ui.js`, and roster/encounter tables. Building
  Act 4 or an expansion today means touching all of it. (Honesty note: some
  content is behaviour, not data — enemy `ai` functions, and ~29 relic ids
  hard-coded as engine hooks. Registries make content *registration* a data
  drop; new *mechanics* still mean engine work. The spec claims the former,
  not the latter.)
- Fallen/victory screens are a meta plate behind a CSS panel; the title got
  *cleaned* by Progressive Delivery Phase 1 but never visually hardened; the
  non-combat screens only ever received scene-panel backdrops and icons.
- Repeatedly deferred ship-front work (CI, per-boss stages, store assets) has
  never been picked up.

## Invariants (violating any fails review)

- **Engine purity is untouched.** `engine.js`, `vigil.js`, `data.js`,
  `battlefield*.js`, `uic.js`, `ui-chrome-layout.js`, and the new
  `registry.js` / `src/packs/**` / `ui/tokens.js` stay Node-runnable and
  DOM-free. `drain()` still consumes `cb.queue`; only the playback target
  changes from DOM to sprites. `npm test` green at every task boundary.
- **The import graph is preserved.** `engine.js` imports `data.js` only,
  exactly as today. `data.js` becomes an assembler (imports packs + registry,
  re-exports the same named exports) — its consumers never change.
- **Registry refactor is behaviour-neutral, proven three ways.** Content
  tables contain functions (enemy `ai`), so "deep-equal a fixture" alone is
  unimplementable. The golden-equivalence gate is: (i) deep-equal on a
  functions-stripped JSON projection of every exported table; (ii) behavioural
  trace equivalence for each enemy `ai` over a fixed seeded schedule of
  `{ turn, last, hp, rng }` inputs, before vs after re-homing; (iii) the
  fixed-seed monte-carlo digest unchanged. All three legs are `npm test`
  checks.
- **Internal keys, card/relic/status ids, save shapes: immutable, as ever.**
  Re-homing content into packs changes file locations, never ids. No new save
  fields for packs.
- **Schemas are the single source.** Registry schemas drive validation, the
  content-doctor report, and the CRUD editor's forms. No tool re-declares
  content shape. Unknown extension keys warn, never fail. Behaviour-valued
  fields (`ai`, event hooks) are declared as `kind: 'function'` in the schema:
  validated for presence/arity only, excluded from projection, serialisation,
  and CRUD forms.
- **No act coupling outside packs.** After the theme extraction, act
  references may not survive outside pack content — and the sweep covers
  more than string literals: numeric act indices, clamps (e.g. the
  `Math.min(act, 2)` weather clamp in `vfx.js`), and `length`-of-acts
  assumptions. Unavoidable residue (e.g. save migration, tower geometry if
  not extracted) enters an explicit, enumerated allowlist in the plan — the
  promise is honest, not implied-zero.
- **Combat input has one owner.** `#uigl` is `pointer-events: none`. A single
  stage-level input router receives all combat pointer input, hit-tests the
  Pixi scene first (using the same bounds the probe `ui()` reader exposes),
  resolves enemy/hero targets in stage px from `battlefield.js` geometry, and
  forwards residual events to the DOM. Drag thresholds (26px start, 12px
  slop) stay client px — physical feel must not change.
- **Physical feel includes shake.** The Pixi root container mirrors the
  `#shake` transform every frame (or `#uigl` mounts inside `#shake` with
  tooltip compensation) so migrated chrome/floaters shake with the world.
  Verified in the real-device smoke, since static baselines cannot catch it.
- **Accessibility does not regress silently.** Combat keeps a keyboard path
  (cycle hand / play / end turn — the probe drivers already prove the handler
  plumbing) as a P5 deliverable. Screen-reader support is a **declared
  deferral** (documented decision: offscreen DOM mirror considered for a
  later round), not an accident.
- **Fixed virtual stage rules apply to Pixi.** The `#uigl` canvas is sized in
  stage px with the same DPR-cap discipline as vfx/mesh; pointer events cross
  the boundary through `toStage()`.
- **Layout files remain the single source of geometry truth.**
  `battlefield-layout.js` and `ui-chrome-layout.js` feed the Pixi renderer
  (live-reload via the existing `onUICChange()` hook in `uic.js`); bfedit and
  bfuiedit continue to work, editing the same files.
- **DOM allowed-list.** After Phase 5 the combat screen's DOM is exactly:
  combatants (art + mesh), the vfx canvas, tooltip/pop-menu/toast mounts.
  Everything else in combat is Pixi. Non-combat screens stay DOM by design.
  (After Phase 4 only — chrome on Pixi, hand still DOM — combat is a
  declared-acceptable mixed state; see the P4 exit checkpoint.)
- **Single card-face renderer.** One Pixi composer renders every card face;
  DOM contexts (deck viewer, rewards, shop stock) consume its exported
  textures as `<img>`. Two card-face implementations may never coexist at a
  merge boundary. (This is a one-way door once P5 merges — the rollback
  before that point is "stop at P4"; a dev-only `?uigl=0` escape valve may
  exist during P4/P5 development but carries a mandatory removal task at
  phase close.)
- **WebKit-safe API rule.** Every new API must work in current iOS WKWebView:
  WebGL only (no WebGPU), no SharedArrayBuffer dependence, OffscreenCanvas
  only within Safari 16.4+ coverage, fonts bundled locally. Enforced as a
  review checklist item on every task.
- **GPU context budget.** WebGL contexts may not exceed three (scene3d, mesh,
  Pixi). The new Pixi layer ships with a context-loss/restore contract (what
  re-uploads, what rebuilds, what state survives); retrofitting scene3d/mesh
  restore is deferred to the Capacitor round where real devices make it
  testable. Absorbing the 2D vfx canvas into Pixi is a stretch goal that
  *reduces* the count; nothing may increase it.
- **Bundle budget.** Pixi is the project's first UI runtime dependency; the
  gzipped main-chunk size gains a budget measured in CI next to the build
  (target set in the P4 plan from the measured baseline + Pixi, then held).
- **Fallback discipline on canvas.** A missing texture renders as a
  Pixi-drawn vector primitive (the canvas analogue of the SVG fallback rule);
  the game is always playable with zero assets.
- **Motion discipline carries over.** The shared easing tokens
  (`--ease-out-soft`, `--ease-spring`) are ported into `ui/tokens.js` (one
  code-side definition, injected into CSS custom properties at boot);
  `REDUCED` collapses to a *named end-state* (each ceremony/effect specifies
  its single-frame end-state — never an unspecified "instant"); LITE gets a
  Pixi tier (foil/filters off — with a specified flat-sheen replacement so
  LITE reads intentional, lower DPR cap).
- **Preview mirrors are untouched.** `previewPlay` / `previewBlock` /
  `previewEnemyDmg` stay pure; only their display layer changes.
- **Dev tooling is dev-only.** The lab / doctor / content editor and the
  `/__content-save` endpoint exist only under the Vite dev server (same
  same-origin gate as `/__bf-save`); none of it reaches the production
  bundle. The `_sample` fixture pack is imported by tests and by the Lab
  behind a dev flag; it never registers in production builds.
- **Docs move with their contracts.** The same rule as Playwright: any phase
  that changes a documented contract (module graph, icon policy, tool list)
  updates `AGENTS.md`, the affected domain docs, and `docs/README.md` in the
  same phase. Stale agent docs are an active hazard in an LLM-executed repo.
- Playwright suites are updated **in the same phase** that moves their
  contracts; visual baselines re-captured per phase — darwin locally on the
  reference machine, linux via the `update-baselines.yml` artifact — **in the
  same PR that moves the contract**, both eyeballed, never trailing.

## 1. Architecture

### Layers

```
z-order inside #stage:
  #bg3d (three.js scene)  →  stage plates  →  combatants + #mesh  →  #vfx
  →  #uigl (PixiJS v8, WebGL, stage-px sized, pointer-events: none)
  →  DOM: tooltip / pop-menu / toasts
```

Input never follows z-order: the stage-level router (invariants) owns combat
pointer input and dispatches to Pixi or DOM explicitly.

### Content flow

```
src/packs/core/**  (data + declared behaviour functions + presentation meta)
        ↓ definePack()
src/registry.js    (schemas, id uniqueness, cross-refs, per-domain merge,
                    freeze, content-doctor report — Node-pure)
        ↓
src/data.js        (assembler: re-exports the same named tables as today)
        ↓                          ↓
engine.js (unchanged)     ui/* + vfx + music (read registries & tokens)
```

### Module decomposition (Phase 1 refactor + new substrate modules)

`src/ui.js` splits into a `src/ui/` directory; `src/ui.js` remains as a thin
re-export so `main.js` and console hooks are unchanged. **The P1 plan must
carry the complete state-ownership map** — every module-scope binding in
today's `ui.js` assigned to a destination module with its access pattern
(e.g. one shared `ctx` module) — written by the planner, not discovered by
the executor. Internal import direction is one-way (`index` → screens →
widgets; no upward imports), and the plan names the single module that
installs `window.spirebound` / `window.__probe`.

| Module | Owns | Phase |
|---|---|---|
| `ui/index.js` | orchestrator: `show()`, screen routing, boot | P1 |
| `ui/drain.js` | `drain()` and the event→handler dispatch | P1 |
| `ui/combat.js` | combat screen assembly (later delegates to `ui/combat-gl.js`) | P1 |
| `ui/screens/*.js` | title, embark, map, rewards, shop, event, rest, lamplighter, end, vigil | P1 |
| `src/registry.js` | pack registration, schemas, merge, content doctor | P2 |
| `src/packs/core/**` | all existing content, re-homed | P2 |
| `src/packs/_sample/**` | dev/test-only fixture pack (a card, an enemy, a mini theme) | P2 |
| `ui/tokens.js` | easing / palette / type scale; injected into CSS vars at boot | P2 |
| `ui/dev/*.js` | dev shell, lab, doctor view, content editor (dev-only chunk) | P3 |
| `ui/widgets.js` | the Pixi widget kit | P4 |
| `ui/combat-gl.js` | the Pixi combat scene | P4 |
| `ui/pointer.js` | the stage-level combat input router | P4 |
| `ui/tween.js` | ticker tweens on the shared easing tokens | P4 |
| `ui/cardface.js` | the single card-face composer + texture export | P5 |

Phase 1 produces **zero visual change** — the full Playwright kit passing
unchanged is its acceptance proof, and it lands before any other phase.

### Probe v2

- `geometry()` largely survives (combatants stay DOM).
- New `ui()` reader traverses the Pixi scene: hand card uids + stage-px
  bounds, pile counts/tiers, energy, lantern state, End Turn enabled.
- Drivers (`play`, `endTurn`, `useArt`, `usePotion`) keep calling the real
  internal handlers; battle.spec assertions move from DOM reads to `ui()`.
- At least one e2e test drives a card by **synthesised pointer events on the
  canvas** (press → drag → release), and one asserts **pointercancel**
  semantics (an interrupted drag returns the card to its seat and plays
  nothing) — iOS edge-swipes and notifications interrupt drags in practice.

## 2. Phase 2 — content registries & packs

### The assembler move

`data.js` stops *containing* content and starts *assembling* it: it imports
the pack modules, feeds them through `registry.js`, and re-exports exactly
the named tables it exports today (`CARDS`, `ENEMIES`, `RELICS`, `POTIONS`,
`EVENTS`, `STATUS_INFO`, `OMENS`, `BOONS`, `ASPECTS`, `DEEDS`, `VARIANTS`,
`WHISPERS`, `PROGRESSION`, `REVEALS`, …the exact list is enumerated in the
plan after Progressive Delivery Phase 2 merges). Engine, tests, saves, and
UI consumers never notice. **During this phase the content line observes a
content-table freeze** (assets and planning only); the P2 plan names who
folds the freshly-merged `VARIANTS`/`WHISPERS` into the core pack.

### Pack contract: data plus behaviour

Content tables are not purely declarative — enemies carry `ai` functions,
and events carry hooks. The pack contract is therefore **"Node-pure data
plus declared behaviour functions"**: behaviour fields are named in the
schema as `kind: 'function'`, validated for presence/arity, excluded from
the golden projection, from serialisation, and from CRUD forms. Converting
`ai` to a declarative DSL is an engine-mechanics change and explicitly out
of scope.

### Registry domains

cards, relics, potions, enemies, variants, statuses, events, omens, boons,
arts, aspects, deeds, whispers, **themes**. Per domain the registry enforces:

- **Schema:** required fields + types per domain; cross-reference checks
  (a card's `vfx` must be a known archetype; a theme's `music` entries must
  be registered cue ids; a variant's `base` must be a registered enemy).
  Unknown extension keys warn, never fail.
- **Id uniqueness** across all packs (collision = throw at boot).
- **Merge semantics are per-table, declared in the spec of the domain:**
  entity tables (cards, enemies, …) are keyed-unique (collision = error);
  aggregate tables (`PROGRESSION.poolWaves`, `REVEALS`, encounter lists,
  pool membership) each declare append / keyed-replace / error in the P2
  plan — no aggregate merges by accident.
- Registries **freeze after boot**; under dev HMR a pack edit rebuilds the
  registry through one named invalidate/rebuild path (same protection as
  today's `data.js` HMR).
- **Content doctor:** validation failures are aggregated into one report —
  every failure with entry id, field, expected shape, and a fix hint —
  surfaced identically in `npm test` output and in the dev overlay. (This
  report *is* most of the registry's authoring value; boot-throw stays for
  production builds.)

### Theme registry (the star)

One theme entry gathers everything that today defines "an act" across five
files:

```js
{ id: 'act1', name, tagline,
  plates: { backdrop, mid, ledge },      // per-boss override slot: bossPlates
  weather: { kinds, density, palette, velocity },
  lanternLights: [ … ],                  // ambient light-position table
  palette: { tint, glow, haze },         // references design tokens
  music: { map, combat, boss, victory }, // cue ids
  roster: { normal, elite, boss },       // engine-side
  encounters, mapHaze }
```

Engine reads `roster`/`encounters` (pure data); UI/vfx/music read the rest.
The extraction sweep covers literals **and** index/clamp/length coupling
(see invariants). The acceptance test is behavioural, not registrational:
**a dev-flagged fourth theme (the `_sample` mini theme) boots into a
climbable act in the Lab** — map generation, weather, music-cue fallback,
and roster resolve, one floor driven by probe drivers — with any residue
(e.g. tower geometry constants, if not extracted) enumerated in the plan
rather than implied absent.

### Supporting decisions

- **Assets do not move.** `assetUrl` globbing stays as-is; packs declare ids;
  the `npm test` manifest gate becomes registry-driven (automatically covers
  future packs).
- **Save compatibility:** ids unchanged; `loadRun` validation reads the merged
  registries; **no new save fields** — unknown-id rejection already yields
  the right failure for a save whose pack is absent.
- **`_sample` fixture pack:** imported by `test_engine.js` for contract tests
  and loadable in the Lab behind a dev flag; zero production surface.
- **Localisation note (no scope added):** registries centralise display
  strings, so future localisation becomes a string-table swap; the card-face
  texture cache key includes a locale token (constant today) so baked text
  can be invalidated per locale later.

## 3. Phase 3 — dev tooling

All dev-only (never in the production bundle). The **dev shell and CRUD
editor are droppable pressure-valve items**; the Lab and the content doctor
are core deliverables.

- **Content Lab (`?lab=1`):** pick any enemy set (including variants),
  hero/aspect, starting deck/hand, act theme, and omen → instant sandbox
  combat. **Scenarios are URL-addressable** (query params encode the whole
  setup, following the `?shape=` convention) so a bug reproduces by pasting
  a link and "replay last beat" survives reload. The Lab interacts with the
  game exclusively through probe drivers and `newRun` opts, so the P4/P5
  render swap costs it nothing. It never touches the real save — the plan
  owns the required engine touch explicitly (an `opts.ephemeral` that
  no-ops `saveRun`). God-mode panel (energy / embers / HP / add card) and
  **replay last beat** (re-run the last animation window) included. The Lab
  is the acceptance harness for the P4/P5 migration.
- **Content doctor:** primary surface is the aggregated report in `npm test`
  output (§2); `?dashboard=1` is a thin dev view over the same pure API —
  per-domain tables with badges (art / vfx / char-meta / audio / pool
  membership) linking into gallery preview and Lab launch.
- **CRUD content editor (`?contentedit=1`)** *(droppable)*: schema-driven
  forms for **cards, relics, potions, and themes only** — enemies are
  excluded in v1 (their `ai` is code; at most rendered as read-only source).
  Save → `POST /__content-save` (dev-only Vite plugin, same-origin gate) →
  writes the pack module back with a stable-ordered, pretty-printed
  serialiser, validating against the schema *before* writing. `npm test`
  remains the commit gate.
- **Dev shell (`?dev=1`)** *(droppable)*: a thin launcher page listing every
  tool. Existing tool URLs unchanged.

## 4. Phase 4 — combat chrome on canvas

- **Widget kit** (`ui/widgets.js`): nine-slice plate, meter, counter, button,
  sprite-state switcher. These are the primitives every later phase reuses.
- **Migrates:** energy candles, facet chips, HP vials + Ward chip, the three
  pile widgets (stack tiers + always-visible counts), End Turn, lantern
  button (ember pips, art chip, ready pulse), intent chips, top HUD (HP,
  gold, deck, menu, omen chip).
- **Input:** the stage-level router from the invariants section is built
  here (`ui/pointer.js`), with the synthesised-gesture e2e as its proof.
  Shake mirroring lands with the first migrated widget.
- **Geometry:** consumed from `ui-chrome-layout.js` via `uic.js` — the
  hand-tuned values are inherited, not re-derived. bfuiedit keeps editing
  them; the Pixi renderer subscribes to the existing `onUICChange()` hook.
- **Data:** widgets read registries and `ui/tokens.js` from day one.
- **Textures:** the existing 27 `src/assets/ui/*.png` load as Pixi textures;
  no regeneration needed. **Preload contract:** the plan names which
  textures block combat presentation and which may pop in, and specifies
  the visual during preload (cold cache on mobile is the design case, not
  an accident).
- **Tooltip bridge:** sprite hover / long-press forwards to the existing DOM
  tooltip, positioned from sprite bounds (stage px → client px).
- **P4 exit checkpoint (gates P5):** on a real iPhone via the Tailscale dev
  server, migrated chrome reads at parity-or-better feel (including shake)
  and the perf gate passes with measured headroom. Otherwise stop: ship the
  declared-acceptable mixed state, keep the DOM hand, and re-plan P5.

## 5. Phase 5 — hand, floaters, banners (combat fully game-rendered)

- **Card-face composer** (`ui/cardface.js`): frame (per rarity), art, name,
  cost gem, wrapped body text with keyword icons, rarity chrome, upgrade
  state — all read from the card registry. The plan carries a **layout
  contract** (wrap behaviour around inline icons, overflow rule with named
  shrink steps and a max-lines cap, upgrade-diff emphasis) and a **texture
  budget** (`cacheAsTexture` per card × state × DPR measured against an iOS
  memory ceiling; per-frame preview tints are applied live, never cached;
  cache key includes the locale token).
- **Hand:** fan/arc seat layout ported from the CSS seat logic; drag-to-play
  with unchanged client-px thresholds; **pointercancel returns the card to
  its seat and plays nothing**; desktop hover lift + tilt + foil sheen
  shader (LITE: flat sheen replacement); touch long-press inspect.
  Ghost/lethal preview numbers render as Pixi text from the untouched pure
  previews.
- **Keyboard path:** cycle hand / play / end turn, wired through the same
  handlers the probe drivers use (the a11y invariant's deliverable).
- **Floaters:** the 4-tier damage hierarchy as Pixi BitmapText with archetype
  tints and the existing stagger rules; turn banner, boss intro plate, and
  the guard-shattered beat become sprite/text sequences on `ui/tween.js`.
- **Pile ceremony re-wired:** draw / discard / exhaust / reshuffle per-card
  flights re-implemented as Pixi sprites under the same wall-clock budgets
  as the pile-chrome spec (`discardHand` ~320–480ms, `reshuffle` ~450–650ms,
  stagger compresses with n) — and those budgets are **asserted by name** in
  the e2e suite, not just stated.
- **Aim outlines are out of scope** — they live on combatants (mesh/SVG) and
  are unaffected.
- **Falsifiable wins (P5 review fails the migration on its own terms if
  absent):** foil sheen live in hand; per-card pile flights inside their
  budgets at CPU 4×; one card-face renderer feeding combat *and* every DOM
  grid; floaters/banners batched in the Pixi scene.

## 6. Phase 6 — screens (DOM, restyled to the award bar)

For every screen below, the plan must additionally specify: (a) the
**austere fresh-profile state** at the same design bar (what fills the space
before aspects/vows/rose-window exist, what teases growth); (b) every
ceremony beat **mechanically** (element, property, duration, easing token,
trigger, `REDUCED` end-state) — the pile-chrome spec is the precedent; (c) a
**wiring-only audio pass** mapping each new ceremony beat to existing
catalogued SFX/music cues (`src/audio-catalog.js`) — no new audio assets;
(d) the LITE/REDUCED end-state, one line each.

### Title + Embark

- Title: the key art re-cut into 2–3 parallax layers (imagegen fills the
  gaps — **owner checkpoint**, routed through `docs/generated-art-workflow.md`),
  ember drift, a once-per-session wordmark ignition sequence, button column
  restyled in the widget-kit language; the Vigil pulse and rose-window
  medallion (Progressive Delivery Phase 2 surfaces) get their finished
  treatment.
- Embark: aspect picker as full-art panels (hero art + kit summary) with a
  selection ceremony; vow stepper as a lantern dial with the cumulative
  ledger; Begin plays a lantern-lighting transition into the map. Reveal
  logic from Progressive Delivery Phase 1 is untouched — presentation only.

### Fallen / Victory (ceremony tier)

- Fallen: monument-carving ceremony — the plate rises, chisel-strike beats
  with ember spray, bequest choice framed as a ritual, the whisper line, and
  stats engraved via `tweenNum`.
- Victory: dawn ceremony — light bloom, ascended-plate parallax, the
  Progressive Delivery Phase 2 shard/page queue moments given their full
  visual weight, stats as an illuminated ledger, "the climb continues" close.
- Existing `sunrise()`, confetti, and monument CSS are upgraded in place, not
  replaced, wherever they survive the bar.

### Non-combat panels (rewards / shop / event / rest / lamplighter / vigil)

- Scene panel v2: act backdrop + mid layer with slow parallax (true depth,
  plates resolved through the theme registry), one shared header ornament,
  one button-hierarchy token pass.
- Shop gains merchant presence (existing event/props art); stock cards use
  card-composer textures (single-renderer rule); rest gets a firelight
  pulse; event gets art-plate framing; lamplighter boons/picker and both
  Vigil tabs adopt the same panel language.

### Map (kept light — R3 already upgraded it)

- Node entrance stagger (floors light up on map entry), path-ignite ceremony
  on route choice, camera settle polish. The DOM-on-3D projection
  architecture is untouched.

### Owner taste gate

Per screen, a fixed-format **contact sheet** (all stage shapes × key states,
austere and grown profiles) is produced and posted for **owner sign-off
before baselines are refreshed**. The award-bar checklist (§8) is the
pre-filter; the sign-off is the gate. A lower-grade executor never
self-certifies "award-winning".

## 7. Phase 7 — assets & ship-front (parallelisable with Phase 6)

- **Per-boss stage sets:** three bosses × (backdrop / mid / ledge) = 9 plates
  through the locked imagegen workflow (**owner checkpoint** on promotion) +
  a stage-bible amendment, hung on the theme entries' `bossPlates` slot.
  Fallback: the act's standard set.
- **Unlock-toast art:** one generic unlock plate frame; the toast illustration
  reuses deed emblems / content art. Small task.
- **Store visual kit (provisional by design):**
  - Screenshot capture kit: a Playwright script drives probe-staged scenes
    (title, bespoke combat moment, map, rose window, boss). **The script and
    the shot-list doc are the durable assets** — rerunnable after the
    Capacitor round; the captured set is labelled provisional/marketing-only.
    Device-framed store matrices and store-grade capture specs (H.264 App
    Store previews etc.) belong to the Capacitor round.
  - Feature graphic + icon refresh from the final title key art
    (`tools/gen-icons.sh` flow).
  - Trailer: **raw reference footage only** (probe-driven deterministic
    sequences via Playwright video) + the shot-list doc. Editing out of
    scope.
  - One small **store listing content doc**: draft copy, keyword list, and a
    checklist of listing requirements (age rating, privacy declarations) so
    "sellable" has a content plan, not just pixels.

## 8. Testing & QA

### Phase 0 — CI (lands first; in flight)

GitHub Actions: `npm test` + `npm run build` + Playwright (Chromium on
ubuntu; the linux baselines already exist) on every PR and push to main.
`perf.spec` runs as a nightly/manual job — CI runner numbers are recorded,
not gating. Failure screenshots/diffs upload as artifacts. (Being executed
from `docs/superpowers/plans/2026-07-09-ci-wiring.md`.)

### Phase 0.5 — the real-device Pixi spike (gates P1)

Timeboxed (order of days, not weeks). A throwaway branch renders, via Pixi
v8 over the live scene3d + mesh contexts: one nine-slice plate, ~ten card
sprites with one composed card face (text + icons), the foil shader, and a
synthesised drag — measured on a real iPhone through the Tailscale dev
server. **Written pass/fail criteria before it runs** (fps floor on the
device, drag-latency feel check, all three contexts alive after
backgrounding). Pass → P1 proceeds with the perf budget calibrated against
reality. Fail → the canvas decision reopens before any sunk cost (the
registries and tooling phases remain valuable regardless).

### Registry & tooling gates (P2–P3)

- **Golden equivalence, three legs** (see invariants): stripped-projection
  deep-equal, seeded `ai` trace equivalence, monte-carlo digest.
- Registry unit tests in `test_engine.js` (Node-pure): schema validation,
  id-collision throw, cross-reference checks, per-table merge semantics,
  content-doctor report shape, `_sample` fixture registering without
  polluting core pools.
- Act-coupling sweep gate: literals + indices + clamps, with the enumerated
  allowlist; the climbable `_sample`-theme Lab smoke.
- CRUD endpoint e2e (mirrors `bfeditor.spec`'s disk test): write a temp
  card, validate, revert. Lab e2e smoke: boot a URL-addressed scenario →
  play a card → zero page errors.

### Standing gates (every task, every phase)

1. `npm test` green.
2. geometry / battle / stage suites green — updated in the same phase that
   moves a contract.
3. Visual baselines re-captured per phase (darwin locally, linux via
   `update-baselines.yml`, same PR), eyeballed; no cross-phase debt. For
   canvas-heavy shots: deterministic renderer settings (antialias off for
   baseline runs, integer position snapping, pinned DPR) and a
   pre-authorised per-suite `maxDiffPixelRatio` for the Pixi era.
4. Probe v2 keeps battle.spec meaningful on canvas; the synthesised-gesture
   and pointercancel tests pass.
5. Perf gate unchanged in numbers (portrait/LITE, CPU 4×, avg ≥ 55fps, p95
   ≤ 22ms) measured **with the Pixi scene active**; additionally the nightly
   `perf.yml` records a **desktop full-tier** run (foil on, high DPR) so the
   shiny path has a watched number; plus a context-loss smoke (simulated
   loss → restore) and a heap/texture-leak check across the long
   random-agent run (per-combat texture leaks are the expected leak class);
   a REDUCED-motion e2e runs against the Pixi scene.
6. **iOS Safari real-device smoke per phase** (Tailscale dev server): drag
   feel, shake, audio unlock, fonts, fps eyeball.
7. WebKit-safe API rule reviewed per task.
8. **Docs-same-phase gate** (see invariants).
9. Gzipped main-chunk bundle budget measured in CI.

### Award-bar acceptance checklist (mechanical pre-filter; the owner
contact-sheet sign-off in §6 is the gate)

- Every interactive element has distinct rest / hover / pressed / disabled
  states.
- Every state change moves — no property snaps except under `REDUCED` (which
  lands on its named end-state).
- No linear easing anywhere; only the shared tween tokens.
- Every screen's specified ceremony beats exist and run at their specified
  timings (beats are *specified* in plans, never invented by the executor).
- Nothing reads as browser-default: no default focus rings without styling,
  no system font fallbacks, no unstyled scrollbars inside the stage.
- Text contrast ≥ 4.5:1 — DOM-verified where DOM, and for Pixi text verified
  at design time per token pair plus probe-based pixel sampling of the few
  canvas text styles.

## 9. Phasing

| Phase | Content | Nature |
|---|---|---|
| P0 | CI wiring | Small; in flight (separate plan) |
| P0.5 | Real-device Pixi spike | Timeboxed; written pass/fail; gates P1 |
| P1 | `ui.js` → `src/ui/` decomposition | Pure refactor; zero visual change; plan carries the state-ownership map |
| P2 | Content registries & packs | Node-side; three-leg golden equivalence; content-table freeze window |
| P3 | Dev tooling (Lab + doctor core; shell + CRUD droppable) | Dev-only; the Lab becomes the P4/P5 acceptance harness |
| P4 | Pixi bootstrap + widget kit + chrome + input router | First canvas UI; **exit checkpoint gates P5** |
| P5 | Hand + floaters/banners + pile flights + keyboard path | Combat fully game-rendered; falsifiable wins |
| P6 | Screens: title/Embark, fallen/victory, non-combat, map | Per-screen deliverables; owner contact-sheet sign-offs |
| P7 | Per-boss stages, unlock toast, store kit (provisional) | Parallel with P6 after P5 |

Ordering logic: P2/P3 are Node-side and dev-only — they change no gameplay
presentation, so the Pixi phases build against stable APIs with the Lab as
their test bench. Each phase is independently shippable; the P4-only mixed
state (Pixi chrome, DOM hand) is declared acceptable. P6/P7 items, the CRUD
editor, and the dev shell are individually droppable without stranding
anything — the pressure valves for "see how much we can cover".

## 10. Risks

| Risk | Mitigation |
|---|---|
| Pixi non-viable on WKWebView | **P0.5 spike before any sunk cost**; P4 exit checkpoint before the hand migrates; declared-acceptable fallback states at each gate |
| Function-valued content breaks the P2 gates | Pack contract is data + declared behaviour functions; three-leg equivalence; CRUD excludes behaviour fields |
| `data.js` re-homing drifts behaviour | Golden-equivalence (three legs) + monte-carlo + full Playwright; P2 is its own phase, never mixed with Pixi work |
| Refactor collides with parallel content commits | Content-table freeze during P2; named owner folds `VARIANTS`/`WHISPERS` into the core pack |
| Pointer/drag regressions on the canvas boundary | Single stage-level router specified up front; synthesised-gesture + pointercancel e2e |
| Migrated chrome stops shaking / feel regressions | Shake-mirror invariant; real-device smoke checks feel, not just pixels |
| CRUD editor writes a corrupt pack file | Schema validation before write + stable serialiser + `npm test` gate; endpoint dev-only; editor droppable |
| Theme extraction misses hardcoded act logic | Sweep covers literals + indices + clamps; climbable `_sample` Lab smoke; honest enumerated residue |
| Schema too strict, chokes content flexibility | Required core fields only; unknown extension keys warn, never fail |
| Baseline churn / canvas nondeterminism on CI | Per-phase re-baseline in the contract-moving PR; deterministic renderer settings; pre-authorised diff ratio |
| Card text fidelity (font timing) | Font-ready gate before the first Pixi text bake; fonts bundled |
| Texture memory on iOS | Card-face texture budget in the P5 plan; leak check on the random-agent run |
| DOM/Pixi card-face drift | Single composer + texture export; DOM grids consume exports |
| `ui.js` decomposition regressions | State-ownership map in the plan; zero-visual-change acceptance with the full kit |
| Executor "self-certifies" taste | Owner contact-sheet sign-off gates; beats specified in plans; art tasks marked owner-checkpoint |
| Docs go stale and mislead future agents | Docs-same-phase standing gate |
| Scope pressure ("last round") | Every phase shippable; named droppable items |

## Out of scope (this pass)

Capacitor packaging (compatibility protected by invariants only); runtime /
downloadable DLC (pack *format* only — delivery stays compiled-in); an
enemy-AI DSL (behaviour stays code); engine mechanics or event-shape changes
beyond the named `opts.ephemeral` Lab hook; audio redesign (ceremony wiring
uses existing cues only); analytics / crash telemetry (named for the
Capacitor round, not silently dropped); screen-reader support (declared
deferral — keyboard path is in scope); localisation (registries merely
centralise strings for it); daily seeds / challenge modes; cutout/skeletal
rigging; Act 4 content (the `_sample` pack is scaffolding, not content);
store-grade capture and device-framed store matrices (Capacitor round);
trailer editing; save-storage migration (stays guarded localStorage / vigil
adapter until the Capacitor round); retrofitting context-loss restore onto
scene3d/mesh (Capacitor round).

## Success criteria

1. **P0.5 spike passed with its written criteria** (or the round was
   consciously re-scoped before P1 — also a success of the gate).
2. Combat is fully game-rendered: DOM in combat is exactly the allowed list;
   the perf gate passes with the Pixi scene active on the portrait project;
   the desktop full-tier number is recorded nightly; the P5 falsifiable wins
   are all present.
3. bfuiedit still edits live chrome geometry, now rendered by Pixi; bfedit
   (combatants + stage plates, which stay DOM) is unaffected and still works.
4. **Registry proof:** the three-leg golden equivalence holds; the `_sample`
   fixture pack boots a **climbable** mini theme in the Lab with zero code
   changes outside its own directory; the act-coupling sweep passes with its
   enumerated residue; the content doctor reports the core pack 100%
   complete.
5. **Tooling proof:** the Lab stages any registered encounter (including
   variants) from a pasted URL and can replay a beat; if the CRUD editor
   shipped, it round-trips an edit through `/__content-save` with a clean
   `npm test` afterwards.
6. All four screen sets carry **owner contact-sheet sign-offs** (austere and
   grown profiles); fallen/victory play as specified ceremonies with wired
   audio; the title has its ignition; combat has its keyboard path.
7. CI runs the kit on every PR; a red kit blocks merge; the bundle budget is
   measured and held.
8. The store kit's script + shot list + listing content doc exist; the
   provisional capture set is produced from one scripted run.
9. Fresh-profile and veteran-profile manual smokes (with the Progressive
   Delivery reveal ladder active) both read coherently on desktop and on a
   real iPhone via the Tailscale dev server.
