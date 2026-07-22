# SDLC operating loop

The delivery contract for this repo. Terse by design — the full reasoning (38-agent
constraint study) lives outside the tree; this file is what agents and sessions follow.

## North star

**The binding constraint is the orchestrator's review-and-decide attention** (the Claude
session), not CI wall-clock. Every rule below either moves the default review **left**
(onto a signed brief before code exists) or moves machine-checkable verification **off the
window** (external models + CI). Spend the scarce window only on the two things no machine
substitutes: **high-blast-radius correctness** (`engine.js`, combat math + preview mirrors,
save/load, registry/content-registration schemas) and **award-winning visual taste**.

## The loop

1. **Bet & sequence** — order work by cost-of-delay as a reflex, not a ceremony.
2. **Author a lean brief** (template below). Heavy spec+plan only for genuinely large/ambiguous features.
3. **Sign the brief** — the default review point. Async batch sign-off; a trivially-safe class (docs, test-only, mechanical bulk) auto-lands.
4. **Delegate by rework-risk** (routing below).
5. **Inner loop** — `test:watch` affected-only in the subagent's worktree.
6. **Agent review, off-window** — reviewer runs on an **external** peer CLI returning JSON, never Claude-native subagents. Layout-touching diffs auto-attach a Playwright screenshot (touched screens × 3 shapes).
7. **Selective diff-review + circuit breaker** — orchestrator reads diffs in full **only** for the high-blast class + agent-flagged exceptions. One fix-cycle, then **revert-and-reshape the brief** — never re-prompt a wandering agent repeatedly.
8. **Pre-push gate** — `test:ci` via the `.githooks/pre-push` hook (`git config core.hooksPath .githooks`).
9. **Land dark** — direct-push default (see policy); unfinished work merges behind `REVEALS`/`PROGRESSION` + the `T(run)` seam, flipped only when it clears the craft bar.
10. **Post-merge matrix + closed-net auto-revert** — a red main self-reverts with zero human touches.
11. **Gate maintenance off the critical path** (routing below).
12. **Compound & measure** — `ce-compound` auto-fires on any auto-revert/hand-fix; DORA trend is a cron.

## Delegation routing (by rework-risk)

| Work | Route to |
|---|---|
| Daily implementation, refactors, bug fixes | `grok-worker` (+deep for trickier) |
| **High-blast: `engine.js`, combat math + `previewPlay/previewBlock/previewEnemyDmg` mirrors, registry/content-registration schemas, save/load** | `gpt-sol` or `grok-worker` deep — **never** `gpt-luna` |
| Simple bounded | `gpt-luna` |
| Bulk / mechanical / docs / tests | `gpt-terra` |
| **Mechanical gate toil** (baseline refresh, e2e-shard retiming, affected-map upkeep) | `gpt-terra` |
| **Non-deterministic flake ROOT-CAUSE** (e.g. WebKit memory crash) | premium/deep (`gpt-sol` / `grok-deep`), time-boxed, honest quarantine fallback — **never bulk tier** (bulk reshards the symptom) |
| Design / frontend UI/UX final craft | `opus-designer` (native Opus = the scarce window; reserve for the final pass, route first-draft exploration to cheaper tiers) |

After every delegation, review `git diff` against the brief; fix or revert before reporting.

## Lean brief template

Every task brief carries these lines:

- **Goal** — one change → one self-contained diff (~200–400 changed lines / a handful of files). Overflow → split the brief and re-delegate. (Legit-large `opus-designer` visual components are exempt.)
- **Reuse pass** — name the existing helper/pattern to build on (cheaper than regenerating).
- **Layout oracle** — if the diff touches CSS / `src/ui/screens` / `battlefield-layout.js` / `ui-chrome-layout.js` / `uic.js` / `stage.js`, require a rendered screenshot (touched screens × 3 shapes) attached to review.
- **Bugfix → failing test** — a bugfix adds one failing-first test at the tightest layer.
- **Route** — the tier from the table above.

## Regression gate — property-oracle-first, not accumulated coverage

Spends machine time, never the window. Backbones (all already in the repo):

1. **Broad net** — grow the 300-run monte-carlo **invariants** in `test/test_engine.js` (energy conservation, no negative HP, no soft-lock, save round-trips, step-wise preview parity). Node-pure, safe to delegate with the invariant specified.
2. **Seams** — the `cb.queue` engine↔UI protocol, the preview parity mirrors, `test_module_boundaries.mjs` as the import-direction fitness function.
3. **Regression-first** — every proven bug adds one failing-first test.
4. **The one non-negotiable test-first** — any new card special / status / combat-math change **must** add its `previewPlay/previewBlock/previewEnemyDmg` parity assertion; any save/load change **must** add a `rejectSaved` case. (The sha256 monte-carlo only exercises *existing* content.)

**Banned** even though AI makes them free: speculative post-hoc suites, structure-sensitive
tests that break on refactor, author-model tautologies, comprehensive visual snapshots.
"Stunning" is enforced by human + `opus-designer` + the dark-reveal gate, never a snapshot.
Universal TDD is **rejected** (a per-change red step against the speed mandate).

## Direct-push policy

Direct-push to `main` by default, **PR-smoke-gate the high-blast class + any over-cap diff**.
Precondition (Phase 3): the closed auto-revert net must be proven before leaning harder on
direct-push — today `auto-revert.yml` only opens a revert PR (`GITHUB_TOKEN` can't re-trigger
`ci` or push workflow reverts), so a red main still needs a human nudge.

## CI runner (heavy gate)

Target: PR < 60s, merge < 300s. The heavy push/merge gate runs on a **self-hosted MacBook Pro
64GB** (Apple-Silicon, darwin) — biggest speed lever, and 64GB brute-forces the WebKit
memory-crash family out of existence. Gated to `push`/`workflow_dispatch`/`merge_group` only
(never fork PRs — public repo). Visual runs against darwin baselines on that machine. No slow
ubuntu fallback (speed is absolute). See the gate blueprint before reshaping lanes.

## Adoption status

- **Phase 0 (done)** — triage labels reconciled; `test:ci` pre-push hook; (lane-list single-source folded into Phase 5).
- **Phase 1–2 (this file)** — routing + brief template + review policy + regression rules codified.
- **Phase 3 (next, prerequisite)** — close the auto-revert net (PAT/repo_dispatch).
- **Phase 4** — fearless direct-push (gated on Phase 3).
- **Phase 5** — PR<60s / merge<300s gate on the self-hosted runner; webkit root-cause; visual oracle.
- **Phase 6** — DORA-4 trend cron; monthly delegated mutation audit; reveal-debt age ceiling.
