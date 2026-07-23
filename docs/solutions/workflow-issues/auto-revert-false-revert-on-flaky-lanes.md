---
title: "Auto-revert on a flaky CI: distinguish a known-flaky lane from a real regression before reverting"
date: "2026-07-23"
category: workflow-issues
module: ".github/workflows/auto-revert.yml"
problem_type: workflow_issue
component: development_workflow
severity: high
symptoms:
  - "auto-revert false-reverted the verified SPINE merge after the `bfeditor.spec.js:280` disk-write flake on the `e2e aux` lane"
  - "auto-revert false-reverted the verified ceremonies merge after a mobile-WebKit renderer crash (`trace.spec.js:1004`) on the `e2e webkit *` lanes"
  - "good commits unrelated to the flake were destroyed on main, forcing a manual re-land"
root_cause: missing_validation
resolution_type: workflow_improvement
applies_when:
  - "a CI has known browser-infra-flaky lanes that can reach a red main"
  - "an automated net takes a destructive action (revert) on a raw red-main signal"
  - "trunk-flow direct-push with post-merge full-matrix verification"
related_components:
  - testing_framework
  - tooling
tags:
  - auto-revert
  - trunk-flow
  - flaky-tests
  - github-actions
  - playwright
  - webkit
  - ci
  - false-revert
---

# Auto-revert on a flaky CI: distinguish a known-flaky lane from a real regression before reverting

## Context

This repo runs a local-first trunk flow (`docs/agents/sdlc-loop.md`): gate a push locally, direct-push `main`, let the full browser matrix run post-merge, and let `auto-revert.yml` revert a red `main` automatically with zero human touches. A brief red main is meant to be a self-healing, handled event, not an emergency — that is the whole bargain that makes fearless direct-push safe.

That bargain only holds if CI is reliable. This CI is not. It carries browser-infra-flaky lanes that fail for reasons that have nothing to do with the merged commit:

- **`e2e aux`** — the `bfeditor-disk` test writes a Vite-*watched* source file and runs at `retries:0`, so on a slow CI runner it races an HMR restart and blows its 90s test timeout. Locally the same test passes in ~5s.
- **The mobile-WebKit lanes** (`e2e webkit core-iphone`, `e2e webkit core-ipad`, `e2e webkit screens`, `e2e webkit lab`) — the headless WebKit renderer accumulates memory across many WebGL-heavy page boots and eventually crashes: `page.reload: Page crashed`, `WebKit encountered an internal error`, or `__probe` undefined after a reload. This is the memory-pressure crash family documented at its source in `docs/solutions/test-failures/webkit-memory-pressure-crash-family.md`.

The original `auto-revert.yml` fired on *any* red main — its only condition was `github.event.workflow_run.conclusion == 'failure'` (`auto-revert.yml:36`). It could not tell a flake from a regression. On a CI with known-flaky lanes, that guarantees false-reverts: every flake that reaches main destroys a good commit.

## Guidance

**When your revert-on-red automation runs on a CI that has known-flaky lanes, it must classify the failure before it acts.** Reverting on *any* red is only correct when every red is a real regression. The moment a lane can go red for infrastructure reasons, blind auto-revert becomes a machine for deleting verified work.

The classifier lives in `auto-revert.yml` as a `classify` step that runs *before* the checkout and revert (`auto-revert.yml:59-97`). It reduces the failure to its LEAF lanes, then emits a **three-way** decision — `revert`, `rerun`, or `hold`.

**1. Reduce the failure to its LEAF lanes, then subtract the known-flaky set.** Aggregate/gate jobs (`unit`, `e2e`, `e2e nonvisual`, `p2-base`) fail only as a *consequence* of some leaf lane failing — counting them tells you nothing about the cause. Subtract them via the GitHub jobs API, then subtract the flaky lanes:

```yaml
FAILED_LEAVES="$(gh api --paginate "repos/${REPO}/actions/runs/${RUN_ID}/jobs" \
  --jq '[.jobs[] | select(.conclusion=="failure") | .name] - ["unit","e2e","e2e nonvisual","p2-base"] | unique')"
NON_FLAKY="$(printf '%s' "${FAILED_LEAVES}" | jq -c '. - ["e2e aux","e2e webkit core-ipad","e2e webkit core-iphone","e2e webkit screens","e2e webkit lab"]')"
```
(`auto-revert.yml:71-74`)

**2. Decide three ways.**

- **`NON_FLAKY != []` → `revert`, immediately, on any attempt.** A solid lane (`unit`, the `e2e pool`, `visual`, `leak`, `random`) failed → real regression. No re-run, no added latency.
- **`FAILED_LEAVES == []` → `hold` (open an issue).** No named leaf failed, so the jobs API didn't surface the cause. Never read an empty leaf list as "all-flaky" — that would suppress reverts for failures the API didn't name. A human looks.
- **`FAILED_LEAVES != [] && NON_FLAKY == []` → only known-flaky lanes failed.** This is where the hybrid diverges from the old blind stand-down:
  - **`run_attempt <= 2` → `rerun`.** Re-run the failed jobs (attempt 1→2 or 2→3) and let the flake self-heal. A flake usually clears on retry; a real bug on that same lane would fail again and eventually escalate.
  - **`run_attempt >= 3` → `hold` (open an issue).** It stayed flaky-only through two re-runs; escalate to a human. **Never** a silent revert — a runner-correlated infra flake failing three times is not a "fails N times = real bug" signal.

Two supporting pieces make the re-run safe:

```yaml
      - name: Re-run failed jobs to let a flaky-only red self-heal
        if: steps.classify.outputs.action == 'rerun'
        env:
          GH_TOKEN: ${{ secrets.AUTO_REVERT_PAT }}   # PAT, not GITHUB_TOKEN
```
(`auto-revert.yml:99-108`) — the re-run **must** use the admin PAT. A `GITHUB_TOKEN`-initiated re-run is suppressed and the downstream `workflow_run` event never fires, so the classifier would never see the retry. `gh run rerun --failed` re-fires that event with `run_attempt` incremented (1→2→3), which is exactly the retry counter the decision above reads.

```yaml
    concurrency:
      group: auto-revert-${{ github.event.workflow_run.head_sha }}
      cancel-in-progress: false
```
(`auto-revert.yml:41-43`) — a per-commit concurrency guard. `workflow_run` delivery is at-least-once and our own re-runs add events, so without it duplicate events could double-revert the same commit.

The checkout and revert steps are both gated on `steps.classify.outputs.action == 'revert'` (`auto-revert.yml:111`, `:121`).

**Validate the jq against the real failing run before trusting it.** Both the aggregate-subtraction and the flaky-set subtraction were run against the exact `/jobs` API payloads of the two runs that had false-reverted, and confirmed to reduce to `NON_FLAKY == []`, before the guard shipped. A denylist you have not tested against a real red run is a guess.

## Why This Matters

The net was designed to *protect* the trunk. Un-guarded, it did the opposite — it **false-reverted good, verified work twice in a single session:**

1. A green SPINE merge was reverted by a lone `e2e aux` bfeditor flake.
2. After an aux-only point guard fixed that, a ceremonies merge was reverted by a mobile-WebKit crash flake (`trace.spec.js:1004` on `iphone-webkit` / `ipad-webkit`) — a lane the aux-only guard did not cover.

Each false-revert is expensive twice over: it undoes work that actually passed its real checks, and it teaches the team to distrust and eventually disable the automation — which removes the safety net that makes direct-push tenable in the first place. A revert bot that cries wolf gets muted, and a muted safety net is worse than none because people still believe it is watching.

The guard restores the correct semantics: **"main red from a known-flaky lane"** routes to an issue (a human assesses), while **"main red from a real regression"** still auto-reverts. It preserves the net's value while removing its failure mode.

## When to Apply

- You have revert-on-red (or any punitive-on-red) automation, and CI has one or more lanes that fail for infrastructure/flake reasons rather than code reasons.
- A green, locally-verified merge got reverted and the failing test was demonstrably unrelated to the diff (here: a persistence-fixture test and a disk-write test — neither touched by the reverted commits).
- You are about to widen a blind "revert on any failure" trigger and the CI is not provably flake-free.

Do **not** reach for this guard first if the flake has a tractable source fix. Fixing the flake shrinks the denylist and is strictly better (see Prevention).

## Examples

**Before — blind revert on any red (the false-revert generator):**

```yaml
jobs:
  revert:
    if: github.event.workflow_run.conclusion == 'failure' && github.event.workflow_run.event == 'push'
    steps:
      - uses: actions/checkout@...   # runs unconditionally
      - name: Revert the failed commit straight to main
        run: git revert ... && git push origin HEAD:main
```
Every flake that reaches main reverts a good commit.

**First fix that was NOT enough — an aux-only point guard.** The initial patch special-cased exactly one lane: `if FAILED_LEAVES == ["e2e aux"]`. It stopped the bfeditor false-reverts (proven — it opened issue #55 and stood down), but it hard-coded a single lane name and did not cover WebKit, so the very next merge was false-reverted by a WebKit crash. A point guard for one flaky lane is not a classifier; it is a second bug waiting for the next lane to flake.

**After — the hybrid classifier.** Reduce to failed leaves, subtract the aggregates, subtract the whole known-flaky set, and branch three ways: a solid-lane red reverts immediately; a flaky-only red **re-runs** the failed jobs (up to twice) to self-heal and opens an issue only if it still only-flakes after two re-runs; an empty leaf list opens an issue too (`auto-revert.yml:59-97`, gated at `:111` and `:121`). The same predicate covers both the aux lane and every WebKit segment, any real regression on a solid lane still reverts with zero added latency, and a stray infra flake now self-heals instead of standing down to a manual issue on the first failure.

**Sibling safety already in the file — the loop guard.** Independently of the flaky-lane guard, the revert step refuses to revert a commit that is *itself* a revert, because the underlying red is then not a single revertable commit and reverting would re-apply the bad change forever:

```bash
SUBJECT="$(git log -1 --format=%s "$FAILED_SHA")"
case "$SUBJECT" in
  "auto-revert:"* | "Revert "*)
    open_issue " (head is already a revert — loop guard)" ...
    exit 0
    ;;
esac
```
(`auto-revert.yml:144-154`)

Both guards share one principle: **before you take a destructive automated action on red, prove the red is the kind of red this action was designed for.**

## Prevention and tradeoffs (be honest)

- **The denylist is still the classifier, so it still trades coverage for stability.** A *real* regression that happens to land only on a flaky lane never reaches `revert` — it re-runs twice, then becomes an issue for a human to catch. Keep the flaky set as tight as possible and revisit it; every name in that jq array (`auto-revert.yml:74`) is a lane where auto-revert no longer reverts for you.
- **The shipped design is re-run-before-hold, not re-run-before-revert — and that distinction is the whole point.** A flake usually clears on retry, so the hybrid re-runs a flaky-only red up to twice before acting. But it must **never** silently revert if the flake persists, because **these are runner-correlated infra flakes**: a heavy WebKit shard or a slow-runner HMR race can fail on all three attempts of the *same* run without the merged commit being at fault. So "fails N times ⇒ real bug" does not hold here, and a pure "delete the denylist, revert on the Nth failure" design was rejected — it would re-introduce exactly the silent false-revert this whole learning exists to prevent. The rejected alternatives, concretely:
  - **Pure Nth-failure revert (no denylist):** silent false-revert on correlated flakes, as above. The denylist is what lets us tell "self-heal then hold" (flaky lane) from "revert now" (solid lane).
  - **Revert-then-let-CI-reland:** an MTTR regression — every flaky-only red would bounce a good commit off main and force a re-land, the exact cost the guard was built to remove.
  - **A pure `run_attempt` gate with no self-heal re-run:** couples recovery to a human remembering to click "re-run failed jobs", which defeats the zero-touch promise; the classifier issues the re-run itself with the PAT.
- **The re-run needs two defenses, both shipped.** (1) It must use the admin PAT — a `GITHUB_TOKEN`-initiated re-run is suppressed and the downstream `workflow_run` event never fires, so the classifier would never re-evaluate (`auto-revert.yml:99-108`). (2) It needs the per-commit concurrency guard (`auto-revert.yml:41-43`): `workflow_run` is at-least-once and the re-runs add events, so without serialization duplicate events could double-revert the same commit.
- **Best of all: fix the flake at its source and shrink the denylist.** The WebKit crashes have a real medicine — the fresh-browser-shard split in `docs/solutions/test-failures/webkit-memory-pressure-crash-family.md` caps renderer-memory accumulation per browser process; the bfeditor `aux` race is a de-flakeable HMR/timeout problem. Every lane you actually fix is a lane you can delete from the flaky set, restoring full auto-revert coverage there. This "re-run to self-heal, then hold" learning is the companion to that "fix the flake" one — the re-run buys time only while the source fix is pending; it is not a substitute for it.
- **Two concrete rules for the next person touching this guard:** (1) validate any new jq against the real failing run's `/jobs` API output before trusting it — a denylist untested against a real red is a guess; (2) when tempted to add a lane to the flaky set, try fixing the flake first — adding a name is surrendering coverage, and it should feel like it.

## Related

- `.github/workflows/auto-revert.yml` — the classifier (`classify` step at `:59-97`, self-heal re-run at `:99-108`, concurrency guard at `:41-43`, revert gating at `:111`/`:121`, loop guard at `:144-154`).
- `docs/solutions/test-failures/webkit-memory-pressure-crash-family.md` — the WebKit crash family at its source; the fresh-browser-shard fix that shrinks this guard's denylist.
- `docs/agents/sdlc-loop.md` — the trunk-flow contract this net is the safety mechanism for; note its caveat that the net must be proven before leaning harder on direct-push.
- Issue #55 — opened by the first (aux-only) stand-down, evidence the guard fired correctly for the bfeditor case.
- Issue #53 — an adjacent *manual-revert-needed* case (a genuine failure that warranted a revert): the contrast that shows where the classifier should decide `revert` rather than re-run or hold.
