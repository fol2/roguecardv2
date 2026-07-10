# Spirebound — Entrances, Progressive Delivery & the Emberglass Chain (design)

**Date:** 2026-07-09
**Goal:** Redesign the game entrance and pre-run selection around a progressive
delivery engine: a fresh profile starts with a deliberately stripped (but
complete, 3-act, winnable) game; systems, content, and finally a hidden
mystery-quest chain (six Emberglass shards → the sealed Act 4 door) are
delivered across many runs and many victories. Winning is one loop iteration,
never the end.
**Executor:** a lower-grade agentic LLM. Every workstream must be broken into
mechanical, individually-verifiable tasks in the implementation plans; nothing
may rely on executor taste or judgement.
**Predecessors:** `2026-07-08-vigil-surfaces-status-art-design.md` (Vigil
presentation art), `2026-07-06-visualisation-hardening-polish-design.md`
(invariants: engine purity, fixed stage, `assetUrl` fallback, Playwright
gates). This spec inherits their invariants and *does* change engine/vigil
mechanics — that is its point.

## Decisions record (owner-approved)

| Question | Decision |
|---|---|
| Redesign framing | **Full redesign**: progression model drives what the entrance shows |
| Delivery model | **Hybrid**: run/win-based reveal ladder for *structural* systems; existing deeds keep unlocking *specialty* cards/relics |
| First-run austerity | **Aggressive on systems, never on acts** — the tower is always 3 acts, winnable from run 1; run 1 strips aspects/vows/Lamplighter/phials/omens and curates the pools |
| Acts | Always 3. No act-gating. A hidden **Act 4** exists only as a *mystery + unlock scaffolding* in this project (playable content is a future project) |
| Long-game engine | Victory deepens, not lengthens: wins arm a six-quest chain (**Emberglass**), each yielding one shard; six shards open the sealed summit door |
| Collectible fiction | **Emberglass rose window** at the Vigil: six dark panes, each shard lights one, lit panes progressively reveal a mural of what is above the summit |
| Quest pacing law | Every key is a **Gate** (rare/expensive/brutal entrance, explicit once seen, decided in one feat) or a **Trail** (easy entrance, multi-win accumulation, "cloud to brighter") |
| Chain length | ~**20 wins guided, ~50 unguided** to light all six panes (8–15 was rejected as too short) |
| Your Own Shade | Not a one-fight key — a 3-stage **story Trail**; eligible from **win 2** so it cannot overlap the intro run or the Pale Ones opener (win 1) |
| Entrance structure | Adapted stepped flow: **title stays permanently clean** (Continue / New Game / Vigil / Help / mute); New Game opens an **Embark screen that grows** as choices unlock; Vigil is promoted from overlay to full screen with tabs. The "Vigil as 3D home base" option was rejected for asset cost |
| Title indicators | Vigil button **pulses** when it has news; a **view-only miniature rose window** appears on the title after the first shard is earned |
| Compatibility | Existing profiles are migrated and grandfathered: nothing a player has already seen or used is ever taken away |
| Known bug folded in | The live title flow never passes `vigil.unlocks` into `newRun()`, so deed-unlocked cards/relics never reach real pools. Fixed by this spec |
| Performance evidence | Performance is a **reference/warning, not a release or merge hard gate**. The runner must emit valid FPS/frame-time metrics; 55 fps average and 22 ms p95 remain comparison targets, and misses are reported without blocking |

## Context (why this pass)

Today `renderTitle()` is one crammed screen (aspect cards, vow stepper,
buttons, stats footer) and the whole game — 3 acts, Lamplighter, phials,
omens, both pool systems — is available from the first click. The Vigil
already persists deeds/unlocks (`spirebound_vigil_v1`) and `data.js` already
supports `locked:` content, so progressive delivery is half-built but unwired
(see bug above) and undesigned as a player journey. This pass designs the
journey: entrance → staged reveals → victory-driven mystery chain → Act 4
door, and buys construction time for Act 4 itself.

## Invariants (violating any fails review)

- `engine.js`, `vigil.js`, `data.js`, `battlefield*.js` stay Node-runnable:
  no DOM, no `audio.js`, no `stage.js` imports. All new quest/reveal logic
  lives engine-side and communicates with the UI via `cb.queue` events and
  pure query functions.
- Internal keys and card/relic/status ids are immutable. New content gets new
  ids; display strings live in data tables.
- `newRun()` stays backward compatible: **when reveal/unlock opts are omitted
  it behaves fully-revealed** (today's behaviour), so `test_engine.js`,
  monte-carlo, and e2e `helpers.js boot()` keep working unchanged.
- `spirebound_vigil_v1` is never destroyed. v2 lives under a new key
  (`spirebound_vigil_v2`); migration is one-way, idempotent, and leaves v1 in
  place as backup.
- `loadRun` save validation still rejects unknown content ids; new run fields
  (`reveals`, quest scratch state) are validated the same way.
- `assetUrl` fallback discipline: zero new PNGs → UI still renders (SVG/CSS
  fallbacks). Rose window with no mural asset degrades to a labelled
  six-slot progress panel.
- `npm test` green at every task boundary; Playwright suites updated in the
  same phase that breaks them (title/stage/visual specs *will* change).
- Every threshold, price, count, and probability in this spec lives in one
  tunable `PROGRESSION` table in `data.js` — no magic numbers scattered in
  engine/ui.

## 1. Goal & scope

**In scope**

| Workstream | Deliverable |
|---|---|
| Reveal engine | Declarative reveal table + evaluator in vigil/engine; staged systems (Lamplighter, phials, omens, pool waves, vows, aspects) |
| Entrances | Clean title, new Embark screen (grows with unlocks), Vigil as full screen with Deeds + Rose Window tabs, pulse/badge indicators |
| Persistence | `spirebound_vigil_v2` schema + v1 migration + grandfathering |
| Bug fix | `vigil.unlocks` (and reveal state) actually feed `newRun()` on the live path |
| Variant engine | Data-driven enemy variants (base asset + tint/scale/stat/dialogue overrides) powering pale foes, the Usurper, shades |
| Emberglass chain | Six quests (**2 Gates, 4 Trails**), arming cadence, hint states, whispers, rose window UI, sealed summit door |
| Testing | `test_engine.js` coverage for all of the above; Playwright title/stage/visual updates; manual GUI smoke |

**Out of scope:** playable Act 4 content (enemies, map, boss, ending); new
enemy base art (variants reuse existing assets); audio changes; daily
seeds/challenge modes; localisation; unlock-toast art (per predecessor);
changes to combat math or preview mirrors.

**Success criteria:** a wiped profile experiences the staged journey exactly
as §2; an existing profile loses nothing; `npm test` green including new
suites; behavioural and visual Playwright green with updated baselines;
performance produces valid reference metrics and warns on target misses;
manual smoke covers run-1 flow, Embark growth, Vigil pulse, Pale One ambush,
and rose window states.

## 2. Player journey & reveal ladder

Full 3 acts and a real win from run 1. Structural reveals are **guaranteed by
counters**, never by luck. All triggers reference `vigil2` counters:
`runsPlayed` (every run end: win, death, or abandon), `deeds.wins` (wins).

| Reveal id | Trigger | Grants |
|---|---|---|
| `core` | always | Duskblade, 3 acts, curated core pool (~30 cards / ~15 relics), map, rests, merchants, events |
| `lamplighter` | runsPlayed ≥ 1 | Lamplighter screen: boons + Lantern Art choice at run start |
| `phials` | runsPlayed ≥ 2 | Potions drop and phial slots appear |
| `omens` | runsPlayed ≥ 3 | Omens roll per act, named, with banner |
| `poolWave2` | runsPlayed ≥ 2 | + ~10 cards / ~6 relics into base pools |
| `poolWave3` | runsPlayed ≥ 4 | + ~10 cards / ~5 relics |
| `poolFull` | runsPlayed ≥ 6 | Remainder of today's base pool |
| `vow1` + `aspect2` | wins ≥ 1 | Existing `firstDawn` deed: Vow I + Ashwarden. Embark grows Aspect and Vow sections |
| `vowN` (II–V) | win at vow N−1 | Existing behaviour, unchanged |
| `emberglass` | wins ≥ 1 | Chain arms (§5); Rose Window tab appears at the Vigil |

Notes:

- Exact pool-wave card/relic lists are fixed in the Phase 1 implementation
  plan (criterion: waves 1–2 favour low-complexity commons; combo pieces and
  build-around rares arrive in wave 3+). Deed-`locked:` content remains
  deed-gated *on top of* waves.
- Run 1 rolls no omen and shows no omen UI; the `rollOmen` call is gated by
  the reveal, not removed.
- Reveals are evaluated by pure `isRevealed(vigil2, id)`; `newRun()` receives
  a snapshot (`opts.reveals`, `opts.unlocks`) — the run never reads
  localStorage mid-flight.
- Migration grandfathering is automatic: thresholds evaluate against migrated
  counters, so a veteran profile (runsPlayed ≫ 6, wins ≥ 1) is fully revealed
  on first load of v2.

## 3. Entrances & selection

### Title (permanently clean)

- Banner, wordmark, tagline as today.
- Buttons only: **Continue Climb** (iff `loadRun()` returns a save — enters
  the saved run directly, unchanged semantics), **Begin the Climb**, **The
  Vigil**, **How to Play**, mute. Lifetime stats footer stays.
- The aspect row and vow stepper are **removed from the title** and move to
  Embark.
- **Vigil pulse:** `vigil2.news` flag set whenever deed progress, quest state,
  a new whisper, or a new reveal lands; cleared when the Vigil screen is
  opened. While set, the Vigil button carries a pulsing glow (transform/
  opacity only; disabled under `REDUCED`).
- **Miniature rose window:** once `shards.length ≥ 1`, a small view-only rose
  window medallion renders on the title; clicking opens the Vigil's Rose
  Window tab. Absent asset → absent medallion (fallback discipline).

### Embark screen (new, `show('embark')`)

- Reached only from **Begin the Climb**. Replaces the title's selection UI.
- Fresh profile: zero choices — a flavour panel ("Light your lantern") with a
  single **Begin** button. Confirm-and-go, one click.
- Sections **materialise** as reveals land, in fixed order top-to-bottom:
  1. **Aspect picker** (once `aspect2`): the current title aspect cards move
     here unchanged.
  2. **Vow stepper** (once `vow1`): current stepper + cumulative descriptions
     move here unchanged.
- Begin invokes `E.newRun(undefined, { aspect, vow, lamplighter: isRevealed('lamplighter'), monument: vigil.lastFall, unlocks: vigil2.unlocks, reveals: snapshot })` —
  this is where the unlocks bug dies.
- If a save exists, Begin the Climb keeps today's "Begin Anew" clear-save
  confirmation, relocated to Embark.

### Vigil screen (promoted from overlay)

- Full screen routed via `show('vigil')` (returns to title), replacing the
  `showVigil()` overlay.
- **Tab: Deeds** — existing deed rows (art, progress bars) unchanged.
- **Tab: Rose Window** — appears once `emberglass` reveals. A dark rose
  window with six panes; per-quest pane states per §5 (dark → cryptic "???"
  glimmer → explicit inscription + progress → lit pane revealing its mural
  slice). Below the window, the **whisper log** lists whispers heard so far.
- Asset plan: one mural raster + six pane masks + window frame via the
  existing imagegen pipeline (`docs/generated-art-workflow.md`); a
  `meta-art-bible.md` amendment specifies subjects. Fallback: labelled
  six-slot progress panel, no mural.

### End-of-run screens

- Victory (dawn) screen gains a **whisper line** (§5 hint engine) and hosts
  page-reading and shard-grant ceremonies as queue-driven moments.
- Defeat screen unchanged except shade-monument carving (§5.2).

## 4. Delivery engine (architecture)

### `spirebound_vigil_v2`

```
{
  v: 2,
  deeds: { …unchanged v1 shape… },
  unlocks: [ 'aspect2', 'card:…', 'relic:…', 'insight:witchlightLens' ],
  vowUnlocked: 0..5,
  lastFall: null | { act, row, bequest, standing: bool },
  runsPlayed: n,          // every run end incl. abandon
  quests: { <questId>: { state: 'dormant'|'armed'|'revealed'|'complete',
                         progress: n, memory: {} } },
  shards: [ <questId>… ], // order earned
  whispers: n,            // count of whispers heard
  news: bool
}
```

- Migration `v1 → v2`: copy fields; `runsPlayed = max(deeds.runs, stats.runs)`;
  quests all `dormant` (arming happens on *future* wins, except Pale Ones
  which arms immediately if `wins ≥ 1`); `news = true` so veterans get one
  pulse pointing at what changed. Idempotent; v1 key untouched.
- `commitRunToVigil` semantics unchanged for deeds; a new
  `commitRunEnd(vigil2, run, outcome)` increments `runsPlayed` on **every**
  run end (win/death/abandon — abandon currently skips vigil entirely) and
  drives arming + quest bookkeeping.
- Node-safe storage adapter and `_setStore()` hook carry over; arming RNG is
  injectable (`_setRng()`), default `Math.random`.

### Reveal & progression tables (`data.js`)

- `REVEALS`: derived from `PROGRESSION.revealThresholds` as
  `[{ id, trigger: { runsPlayed? , wins? , vowWin? , quest? } }]` —
  evaluated by pure `isRevealed()`. UI never hardcodes thresholds.
- `PROGRESSION`: every tunable in this spec (reveal thresholds, wave
  contents, mote targets, page counts, meeting counts, usurper price
  multiplier, omen guarantee window, arming cadence) in one table.
  `revealThresholds` is the source of truth for ladder counts;
  `REVEALS` is the derived id+trigger list for evaluators and save
  validation.

### Enemy variant engine

- `VARIANTS` in `data.js`: `{ id, base: <enemyId>|'hero', name, tint: <hue-rotate deg / tint spec>, scale: mult, statMods: { hpMult, dmgMult, addStatuses }, dialogue: [opening lines], deathDialogue?: line, drop }`.
- Pure `makeVariant(baseDef, variantDef)` in `engine.js` produces a combat-
  ready enemy; UI applies tint (CSS filter) + scale (transform) to the
  existing base asset and shows dialogue lines via a banner/speech treatment
  (exact treatment fixed in Phase 2 plan; omen-banner-style is acceptable).
- Variant enemies pass save validation via their `VARIANTS` id.

### Quest hooks (engine-side, all pure or queue-driven)

| Hook point | Used by |
|---|---|
| `genMap()` node injection / override | Pale rare nodes, standing monument, Hollow Lamplighter unlit event |
| Shop stock builder | Usurper's lantern-with-no-flame |
| `rollOmen()` | Eighth Omen override |
| Card reward roll | Unreadable Page injection |
| Combat end resolution | Pale kill → mote; shade kill → stage++; Usurper kill → shard |
| Run end (win) | Whisper advance, page reading, arming cadence, shard grants |

## 5. The Emberglass chain

**Fiction:** six shards of Emberglass light the six panes of the Vigil's rose
window; the completed mural shows what stands above the summit, and the
summit gains a **sealed door** ("the climb continues") — the Act 4 slot.

**Arming cadence:** Pale Ones arms at win 1 (fixed opener). One additional
dormant quest arms (uniform random among dormant, injectable RNG) on each
**even-numbered win** (wins 2, 4, 6, 8, 10) → all armed by win 10. The Shade
is only *eligible* from win 2 onward, which the cadence guarantees.

**Hint states (every quest):** `dormant` = invisible everywhere. `armed` =
its content can occur in-game; its pane shows only a faint "???" glimmer.
`revealed` (on first contact) = pane inscription becomes explicit quest text
with progress. `complete` = pane lit, mural slice visible.

**Whispers:** an ordered `WHISPERS` table in `data.js`; each win shows the
next line on the dawn screen and appends it to the Vigil whisper log. Copy is
authored in the Phase 2 plan under one rule: lines grow steadily less cryptic
— early lines are pure atmosphere, late lines all but name the rose window,
the pale ones, and the door. Length ≥ 20 lines; after the table is exhausted
the last line repeats.

**Pacing targets:** ~20 wins guided (player reads the Vigil, chases explicit
quests), ~50 unguided (player ignores hints; Gates found by accident, Trails
completed incidentally). Per-quest numbers below are initial values in
`PROGRESSION`, tuned in Phase 2.

### 5.1 The Pale Ones — Trail (fixed opener)

- Arm: win 1. **Guaranteed** in the next run: one ordinary combat node
  secretly hosts a pale variant (existing enemy, pale tint, +scale, elevated
  stats, drops 1 **pale mote**). No map indication, no explanation.
- First contact → `revealed`: a new deed-style entry "Hunt the Pale Ones
  (0/3)". After 3 pale kills → unlock `insight:witchlightLens` — rare nodes
  are henceforth **marked on the map**.
- With the Lens: pale foes spawn ~1–2 per run at marked nodes; collect
  **9 motes** total → shard. Expected ~6 runs.

### 5.2 Your Own Shade — Trail (the story spine)

- Eligible from win 2 (arming pool). Once armed: any death in **Act 2 or
  deeper** carves the monument **standing** (`lastFall.standing = true`).
- Next run, claiming that monument triggers a duel against your own hero:
  hero base art, ash-dark tint, your aspect's kit, boss-tier stats. Each
  defeated shade speaks a story fragment — it remembers dying.
- **Three shades must fall**, each stronger (stat tiers in `PROGRESSION`).
  Losing to a shade is safe: the monument stays haunted; every qualifying
  future death re-offers the duel. The third shade's death grants the shard
  and the chain's biggest lore beat.
- Naturally slow: each stage needs a deep death, a return, and a won duel.

### 5.3 The Usurper — Gate

- Once armed: **Act 2+ merchants** always stock "a lantern with no flame",
  priced ≈ **2.5× a typical end-run purse** (exact gold in `PROGRESSION`).
  It never sells out and persists across runs. When the player cannot afford
  it, the merchant needles them ("cold goods, warm price").
- Buy it, then reach the Act 3 summit **that same run**: the boss is replaced
  by its Usurped variant (same silhouette, wrong hue, larger, harder, new
  dialogue — it knows your name and calls the usual boss a mask). Kill it →
  shard. Realistic path: sight it, save deliberately next run, then win.

### 5.4 The Eighth Omen — Gate

- Once armed: guaranteed to roll within the next **2 runs**, then recurring
  (~1 in 3 runs). Its banner renders as **broken glyphs**; its rule is brutal
  (initial: every elite carries an affix *and* a whisper plays on every
  floor; final rule fixed in Phase 2).
- **Win the entire run** under it: at dawn the glyphs resolve into a readable
  story fragment → shard. Explicit from the moment the banner appears; the
  feat is "win anyway".

### 5.5 The Unreadable Page — Trail

- Once armed: one **Unreadable Page** is offered in a card reward roughly
  once per run — an unplayable curse-weight card that clogs the deck and
  cannot be removed at merchants (taking it is the commitment).
- Win with ≥1 Page in the final deck → at dawn it "reads itself": one page of
  the hidden story. **5 pages** (5 separate winning runs) → shard. ≥5 wins by
  construction; the cost is deck tempo, freely chosen.

### 5.6 The Hollow Lamplighter — Trail

- Once armed: a second, gaunt lamplighter waits in **unlit nodes** (≤1
  meeting per run). Each meeting continues one remembered conversation
  (`quests.hollowLamplighter.memory`), and each asks a steeper price:
  embers → gold → max HP → your boon → the final price.
- **5 meetings** paid → shard. Demands repeatedly walking the Unlit Way;
  the conversation is itself the chain's clearest narrator.

### Completion

Six shards → mural completes → a **sealed door** node/emblem appears at the
summit with the inscription *"the climb continues"*. Interacting shows a
one-panel promise, nothing more. Act 4 content is explicitly a future spec;
this project reserves the reveal id (`act4`) and the door surface.

## 6. Testing

**Engine/vigil (`test/test_engine.js`):**

- Reveal evaluator: threshold matrix, grandfathering (migrated veteran =
  fully revealed), run-1 profile sees `core` only.
- Migration: v1 fixtures → v2, idempotency, v1 key preserved.
- Arming cadence with injected RNG: opener at win 1, one per even win, Shade
  never armed before win 2, all armed by win 10.
- Per-quest state machines: dormant→armed→revealed→complete transitions,
  progress counting, shard grants exactly once.
- Variant engine: `makeVariant` stat math, save-validation round-trip.
- Pool waves: pool membership per `runsPlayed` tier; deed-locks still apply;
  `newRun()` with no opts = today's pools (back-compat).
- Monte-carlo unchanged and green (relies on the fully-revealed default).

**Playwright:** `stage.spec` title-overflow scenario moves its vow clicks to
Embark; `visual.spec` title baseline re-shot; new light assertions: fresh
profile title has no aspect row; Embark shows zero sections fresh / two
sections on a seeded veteran profile.

**Performance reference:** the portrait/LITE run must write finite positive
FPS and frame-time metrics. Average 55 fps and p95 22 ms are warning targets,
not pass/fail thresholds, because compositor load and display refresh rate make
absolute local rAF timings host-sensitive. Missing or invalid metrics still
fail the measurement job.

**Manual GUI smoke (with demo video):** wiped profile → title → Embark
(one-click) → run 1 has no Lamplighter/phials/omens → die → run 2 gets
Lamplighter → seeded win-1 profile → Pale One ambush occurs → Vigil pulses →
Rose Window tab shows "???" pane.

## 7. Risks

| Risk | Mitigation |
|---|---|
| Migration corrupts veteran profiles | v2 under a new key; v1 untouched; fixture-driven migration tests; grandfather-by-counters needs no special cases |
| Title/stage Playwright breakage | Specs updated in the same Phase 1 tasks that move the UI |
| Monte-carlo / e2e boot regressions | `newRun()` fully-revealed default is an invariant with its own test |
| Quest hooks erode engine purity | All hooks are pure functions or `cb.queue` events; a test asserts `engine.js`/`vigil.js` still import nothing browser-only |
| Pacing mistuned (too fast/slow) | Every number in `PROGRESSION`; §5 targets recorded; tuning is a data edit, not a refactor |
| Mural asset unavailable in executor env | Rose window degrades to labelled progress panel; generation tasks may report BLOCKED, never fake assets |
| Save-scumming quests (reload before shade/usurper) | Quest scratch state lives on the run save like `pendingCombat`; `loadRun` validation extended |
| Performance numbers vary by host | Preserve raw metrics plus display/runtime context; treat target misses as warnings and compare only like-for-like captures |

## 8. Phasing

Two implementation plans, executed in order:

1. **Phase 1 — Delivery engine & entrances:** `spirebound_vigil_v2` +
   migration, `REVEALS`/`PROGRESSION` tables + evaluator, pool waves, clean
   title + Embark + Vigil screen (Deeds tab), pulse indicator, unlocks bug
   fix, `commitRunEnd` on abandon, Playwright updates. Ships alone as a
   coherent, testable release (chain dormant).
2. **Phase 2 — Variants & the Emberglass chain:** variant engine, six
   quests + hooks, whispers, Rose Window tab + mural assets, title medallion,
   sealed door, pacing tuning.

## Out of scope (this pass)

Playable Act 4; new enemy base art; audio; daily seeds / challenge modes;
achievements platforms; localisation; combat math changes; unlock-toast art;
any change to internal ids of existing content.
