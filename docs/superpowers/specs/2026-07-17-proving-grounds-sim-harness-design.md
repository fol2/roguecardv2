# Spirebound — Proving Grounds: automated playtesting harness (design)

> **Version boundary:** this document defines the schema-1 independent-Round
> harness. The persistent-Vigil Full Cycle extension is specified by the
> [2026-07-18 machine-logic plan](../../plans/2026-07-18-001-feat-sim-machine-logic-round-cycles-plan.md)
> and operated through the current [Proving Grounds guide](../../proving-grounds.md).
> Sections below that defer career progression or Playwright proof are retained
> as the historical v1 decision, not current capability.

**Date:** 2026-07-17
**Goal:** A headless balance-and-bug instrument: a heuristic bot ("balance bot")
plays full runs through the pure engine at 100k scale on all CPU cores, emits
balance telemetry (win rates, death causes, card/relic value, combat economy)
plus reproducible bug captures, and a dev UI page (`?sim=1`, "Proving
Grounds") visualises and compares reports. First deliverable after the tool
lands: a 100k-run audit of post-Round-5 `main` with findings.
**Executor:** agentic LLM (Claude Code). Every task in the implementation plan
must be mechanical and individually verifiable; heuristic weights are tuned
against the smoke harness, not taste.
**Terminology anchor:** this is *simulation-based balance testing* /
*automated playtesting*; the bot is a *heuristic agent*; the method is *Monte
Carlo simulation*.

## Decisions record (owner-approved)

| Question | Decision |
|---|---|
| Where sims run | Node CLI (`tools/sim/`) on `worker_threads`, all cores; UI is a thin viewer that can also trigger runs via dev-server endpoints |
| Bot design | Pluggable policy interface; ship exactly two policies: `random` (floor baseline) and `greedy` (heuristic bot using engine preview mirrors) |
| UI | Dev-only page `?sim=1` ("Proving Grounds"), full-page takeover like `?charedit=1`; hand-rolled SVG charts, no chart library; game fonts/palette |
| Reports | JSON files in `.sim-reports/` (gitignored); report schema versioned |
| CI | `sim:smoke` joins the unit lane (fast, deterministic); **no** balance gating, no nightly |
| Explicitly out (v1) | Lookahead/search AI, tunable personas, in-browser workers, chained "career" sims through vigil persistence, nightly CI trend tracking |
| Existing infra | `test_engine.js` monte-carlo and `tools/emberglass-pacing.mjs` stay untouched — different jobs (correctness smoke; quest pacing) |

## What exists / what stays untouched

| Existing | Job | Relation to this spec |
|---|---|---|
| `test/test_engine.js` `randomAgentRun` (≈L3973) | 300-run correctness smoke inside `npm test` | Untouched. Its walk order and invariant asserts are the *reference* for the sim walker; its behaviour is re-implemented as the `random` policy |
| `tools/emberglass-pacing.mjs` (`npm run test:progression`) | Quest-pacing distribution | Untouched. Its `_setStore`/`mulberry32` patterns are reused |
| `test:e2e:random-agent` | Browser visual smoke | Untouched |

## Architecture & file layout

```
tools/sim/
  runner.mjs        CLI entry + worker orchestration + report assembly
  worker.mjs        worker_threads body: plays a seed range, posts partial aggregate
  play-run.mjs      THE walker: drives one full run start→win/death, calls policy
  policies/random.mjs
  policies/greedy.mjs
  telemetry.mjs     per-run record → aggregate; merge(partial, partial); flags
src/dev/sim-lab.js  Proving Grounds page (DEV-gated)
vite.config.js      + /__sim-reports, /__sim-report, /__sim-run, /__sim-status
src/main.js         + else-if branch: DEV && qs.has('sim') → sim-lab takeover
.gitignore          + .sim-reports/
package.json        + "sim", "sim:smoke" scripts
```

Import rules (enforced in `test_module_boundaries.mjs`): everything under
`tools/sim/` imports only `src/engine.js`, `src/data.js`, `src/vigil.js`, and
each other — never `stage/ui/audio/scene3d` (must stay Node-runnable).
`src/dev/sim-lab.js` is imported only from the DEV branch of `main.js`.

## The walker (`play-run.mjs`)

One function `playRun(seed, policy, config) → runRecord`. It owns ALL game
flow and legality; policies only choose among options the walker presents.
Flow mirrors `randomAgentRun` exactly (it is the proven-terminating reference):

1. `newRun(seed, { aspect, vow, reveals, monument })` — sweep cell derived
   from seed (below); boon applied via `applyEventOps` like the monte-carlo.
2. Loop ≤ 400 nodes: `availableNodes` → `policy.pickNode` → `visitNode` →
   dispatch by type (monster/elite/boss → combat; rest, event, shop, treasure,
   monument — same handling set as `randomAgentRun`, with decisions delegated
   to the policy).
3. Combat: `rollEncounter` → `startCombat`; loop ≤ 200 turns; inner loop asks
   `policy.combatAction(runCtx, cb)` until it returns `end` (≤ 40 actions per
   turn guard); `cb.queue.length = 0` after each turn (drain, exactly like the
   monte-carlo — the queue must not grow unbounded).
4. Rewards / boss-relic / act transition / heal: same sequence as
   `randomAgentRun` (reward *choices* via policy).
5. Returns a `runRecord` (below) whatever the outcome; throws never escape —
   the worker catches per-run and records an issue.

Sim runs carry **no quest snapshot** (`opts.quests` absent), so the
Emberglass chain and quest shop items stay dormant — quest pacing already has
its own instrument (`emberglass-pacing.mjs`), and career-mode sims are a
listed follow-up.

**Invariants** — checked at the same points the monte-carlo asserts them, but
recorded as `issues` entries instead of throwing (a 100k sweep must survive a
bug, that is its job): hp ∈ (0, maxHp] after each node, embers ∈ [0,
emberCap], enemy chips < facetMax, combat terminates, node loop terminates,
gold ≥ 0, energy ≥ 0, deck uids unique. Any uncaught engine exception is
captured with seed + stack + phase.

**Sweep cells:** run *i* uses seed `base + i` and derives
`aspect = i % ASPECTS.length`, `vow = Math.floor(i / ASPECTS.length) %
(VOWS.length + 1)` (vow is a 0..VOWS.length *level*, 0 = none), boon id
cycling `Object.keys(BOONS)`, monument on `i % 4 === 0` (as monte-carlo).
Profile: `revealed` → `reveals: null` (engine treats null as all-revealed);
`fresh` → the reveal snapshot of a brand-new vigil (via `vigil.js`
`_setStore` + `loadVigil` + `revealSnapshot`). Telemetry slices by all of
these, so one sweep answers per-aspect/per-vow questions without re-running.

## Policy interface

A policy module exports `makePolicy(rng) → policy`. The policy gets its own
`mulberry32(seed ^ 0x51ab)` stream — engine randomness (`runRng`) is never
consumed by policy deliberation, so both policies see identical worlds for
identical seeds. Contract (all synchronous, all pure decisions):

```js
pickNode(ctx, nodes)            → node                        // ctx = { run, cb: null }
combatAction(ctx, cb)           → { kind: 'play', uid, target } | { kind: 'kindle', uid }
                                  | { kind: 'art' } | { kind: 'potion', slot, target }
                                  | { kind: 'end' }
pickCardReward(ctx, cards)      → cardId | null               // null = skip
pickBossRelic(ctx, relicIds)    → relicId
restDecision(ctx)               → { kind: 'heal' } | { kind: 'upgrade', uid }
eventChoice(ctx, event, valid)  → choice                      // one of valid choices
eventPending(ctx, pending)      → resolution per pending op (remove/upgrade/duplicate/pickCard)
shopPlan(ctx, shop)             → array of items to buy, in order
```

`random.mjs` reproduces the monte-carlo agent's behaviour under this contract
(90% play-chance loop, 25% kindle, 40% art, 50/50 rest, 40% shop buys, 80%
card take). `greedy.mjs` is below. The walker validates every returned action
(playable, affordable, legal target); an illegal action is an `issues` entry
(policy bug ≠ engine bug, flagged separately) and the walker falls back to
`end` / skip.

## Greedy policy heuristics

All combat scoring is built on the engine's own preview mirrors —
`previewPlay(run, cb, inst, target)` (`{ hits, total, loss, lethal, block,
chips, willShatter }`), `previewBlock`, `previewEnemyDmg` — so the bot never
re-implements damage math and never cheats (no hidden state, no future
peeking; it reads exactly what the UI shows a human).

**Combat action selection** (each `combatAction` call): enumerate playable
`card × legal target`; score each; return highest-scoring positive action,
else consider kindle/art/potion, else `end`.

```
incoming   = Σ previewEnemyDmg(e) for living enemies      (this turn's threat)
score(play) =
    lethal on last living enemy → +1000 (take immediately)
  + loss (unblocked damage dealt)            × W.dmg
  − overkill (total − min(loss, enemy hp))   × W.overkill
  + willShatter → + W.shatter                (facet break = stagger value)
  + chips                                    × W.chip
  + min(block gained, max(0, incoming − player.block)) × W.block
  + statusEV (vulnerable/weak on threats, str/beacon on self, poison ticks × expected remaining turns)
  − cost × W.cost                            (energy efficiency)
```

Weights `W` are a single exported const table in `greedy.mjs`, tuned during
implementation against the smoke harness (tuning target: maximise greedy win
rate over a fixed 2,000-seed set; record the tuning sweep in the plan task).
Kindle: lowest-scoring hand card when embers < cap and hand has a card whose
best score < W.kindleFloor. Art: `canUseArt` and (embers ≥ cap − 1, or art
effect is lethal-relevant this turn). Potion: when `incoming ≥ hp × 0.5`, or
fight is elite/boss and potion is offensive and a facet break/lethal is in
reach. **Termination guarantee:** ignoring the score, the walker's 40-action
turn guard plus energy monotonically decreasing on `play` bounds every turn.

**Map pathing** (1-ply on node type + state):
`rest` weight scales up as hp% drops (≥ hp 70%: low; ≤ 40%: dominant);
`shop` scales with gold ≥ 150; `elite` allowed only when hp ≥ 65% and deck
power proxy (Σ best-5 card damage-per-energy + relic count × 2) clears a
threshold; `treasure` > `monster` > `event` neutral defaults. Deterministic
tie-break by column index.

**Drafting:** static value table computed from `data.js` at load (attack
damage-per-energy, block-per-energy, utility flat tier by effect kind), +
deck-size damping (past 25 cards only take cards above a raised bar), skip
allowed. Rest-upgrade priority: highest-value un-upgraded card. Event pending
ops: `remove` → worst-valued removable card (basic strike/defend first);
`upgrade` → same as rest; `pickCard` → same as draft. Shop: buy order =
relic > potion (if slot free) > best card above the draft bar, while gold
lasts, keeping an emergency reserve of 75 after act 1 (`genShop` sells cards
/relics/potions/quest items only — there is no removal service to model).

`previewPlay` returns `null` for pure-utility cards (draw/energy/status-only,
no dmg/block/chip); the scorer must handle that branch: score from statusEV +
a flat draw/energy value table, never by re-deriving damage math.

## Runner CLI + determinism

```
npm run sim -- --runs 100000 --policy greedy --seed 1 --profile revealed \
               --workers auto --label "post-round5-main"
```

Flags: `--runs` (default 10000), `--policy greedy|random|both` (`both` = two
full sweeps, same seeds, one report with two policy sections), `--seed`
(base, default 1), `--profile revealed|fresh|both` (`both` = the full seed
range once per profile, sliced in `headline.byProfile`), `--workers auto|N`,
`--label`, `--out` (default `.sim-reports/<UTCstamp>-<label>.json`),
`--smoke` (assert mode, below). Determinism contract: **identical flags ⇒
byte-identical report** except `meta.durationMs`/`meta.date` — the aggregate
is merged in worker-index order, all maps sorted at serialisation, no
`Math.random` anywhere in `tools/sim/`.

Worker protocol: main computes seed ranges (contiguous blocks per worker),
spawns `worker.mjs` via `worker_threads`, workers post `{ partial, issues,
progress }` messages (progress every 250 runs → written to
`.sim-reports/.status.json` for the UI poller); main merges partials with
`telemetry.merge`, stamps `meta` (`date`, `gitRev` via `git rev-parse --short
HEAD`, `dirty` flag, config echo, schema version), writes report.

Issue capture: first 100 issues keep full detail (seed, phase
`node|combat|reward|shop|event`, error message, stack, compact run summary);
beyond that, counted by error signature. Every issue is reproducible via
`npm run sim -- --runs 1 --seed <seed> --policy <p> --profile <p>`.

## Report schema (v1)

Top-level keys (per policy section when `--policy both`):

```
meta      { schema: 1, date, gitRev, dirty, config, durationMs, runs }
headline  { wins, winRate, wilson95: [lo, hi], byAspect{}, byVow{}, byProfile{},
            actReach: [n0, n1, n2, wins], avgFloorsReached }
deaths    { byActRow: [[act, row, count]...], byEnemy{ id: count },
            byKind{ normal, elite, boss }, avgHpLostPerFight: { enemyId: n } }
cards     { id: { offered, picked, inWinningDecks, inLosingDecks,
                  winRateWhenDrafted, avgCopiesWin, avgCopiesLoss } }
relics    { id: { seen, taken, winRateWhenTaken } }
economy   { avgTurnsPerFight: { enemyId: n }, dmgDealtPerTurn, dmgTakenPerTurn,
            avgOverkill, energyWastePerTurn, kindleRate, artRate,
            potionsUsed, potionsHeldAtDeath }
issues    [ { seed, phase, kind: 'engine-error'|'invariant'|'policy-illegal',
              message, stack?, summary? } ]  + { countsBySignature }
flags     [ auto balance callouts — see below ]
```

`flags` (computed in `telemetry.mjs`, thresholds as consts): card offered ≥
200 times and picked < 2%; card winRateWhenDrafted deviating > 8pp from
overall (n ≥ 300); enemy kill share > 2× its encounter share; aspect or vow
win-rate spread > 10pp; potionsHeldAtDeath > 60%; any `issues` at all.

## Dev endpoints (vite.config.js, dev-only, same-origin like existing gates)

- `GET /__sim-reports` → JSON list of `.sim-reports/*.json` (name, mtime, size, label, runs, winRate — read from each file's `meta`/`headline`).
- `GET /__sim-report?f=<name>` → file contents (name sanitised to basename).
- `POST /__sim-run` `{ runs, policy, profile, seed, label }` → spawns `node tools/sim/runner.mjs …` detached child; 409 if one already running.
- `GET /__sim-status` → `.sim-reports/.status.json` (`{ running, done, total, startedAt, lastReport, lastError }`).

## Proving Grounds page (`?sim=1`)

Full takeover (game does not boot), Cinzel/Alegreya + existing palette vars,
desktop-first (it is a dev instrument; no LITE tier, no touch layout). Layout:
left rail = report list (from `/__sim-reports`) + Run panel (form → POST,
progress bar polling `/__sim-status` at 1 Hz); main area = tabs:

1. **Headline** — win-rate stat cards with Wilson CI bars; aspect × vow
   win-rate matrix; act-reach funnel.
2. **Deaths** — heatmap over the 15-row map silhouette per act (SVG grid,
   colour = death count); per-enemy kill bars with encounter-share overlay.
3. **Cards / Relics** — sortable tables (click header), winRateWhenDrafted
   delta column tinted green/red; never-picked rows badged.
4. **Economy** — turns-per-fight per enemy bars; energy waste, kindle/art
   usage, potion stats.
5. **Issues** — list with copy-seed button (repro command in tooltip);
   signature counts.
6. **Compare** — pick report A + B → headline/cards/deaths delta columns
   ("did the balance patch help").

All charts hand-rolled SVG (bars, matrix, heat grid — no axes libraries; the
repo ships zero chart deps and stays that way). `flags` render as banner
chips at the top of every tab.

## Tests + CI

- `npm run sim:smoke` = `node tools/sim/runner.mjs --smoke` → 300 runs/policy,
  both policies, fixed seed, asserts: (a) zero `engine-error`/`invariant`
  issues, (b) greedy wins > random wins, (c) two consecutive 50-run
  invocations produce identical serialised aggregates (determinism), (d)
  every run terminated. Exits non-zero on failure (same contract as
  `npm test`).
- `sim:smoke` is added to the CI unit lane (after `npm test`) — it doubles as
  an engine-regression tripwire: a mechanic change that breaks walker
  assumptions fails here, headless, in seconds.
- `test_module_boundaries.mjs` gains: `tools/sim/**` must not import
  browser-only modules; `src/dev/sim-lab.js` imported only from `main.js`
  DEV branch; `tools/sim/` contains no `Math.random(`.
- Playwright: **none** (dev-only page; visual QA out of scope v1 — decisions
  record).

## Acceptance criteria

1. `npm run sim -- --runs 100000 --policy both --profile revealed` completes
   on an M-class laptop in single-digit minutes, deterministic per the
   contract, report written and loadable in Proving Grounds.
2. Greedy win rate is decisively above random's on the same seeds (tuning
   target during implementation; the gap is the "decisions matter" signal).
3. `?sim=1` renders all six tabs from a real report; Run panel launches and
   tracks a live run in dev.
4. `npm run sim:smoke` green; `npm test`, `test:ci`, unit lane green.
5. **First audit delivered:** 100k × both policies × both profiles on
   post-Round-5 `main`, findings written up (bugs with repro seeds; balance
   flags with interpretation) — the direct answer to "any bugs/glitches, win
   rate, the edge, game balance".

## Out of scope (v1) / natural follow-ups

Lookahead/search bot (expectimax on `previewPlay`), weight-profile personas
(aggro/defensive), in-browser Web-Worker sims, chained career sims through
vigil meta-progression, nightly CI trend line, per-card *play* (not just
draft) win-rate attribution, seed-replay viewer inside the game UI.
