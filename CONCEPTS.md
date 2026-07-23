# Concepts

Shared domain vocabulary for this project — entities, named processes, and status concepts with project-specific meaning. Seeded with core domain vocabulary, then accretes as ce-compound and ce-compound-refresh process learnings; direct edits are fine. Glossary only, not a spec or catch-all.

## CI Verification

### Mode
The verification tier a CI run resolves from its triggering event: pull requests get the smoke tier by default (unit checks, build, a browser smoke pass), pushes to the default branch get the full tier (the complete browser matrix), and a PR can opt itself up to full via a dedicated label. A red full run on the default branch triggers Auto-revert rather than blocking anyone.

### Lane
One leaf partition of the e2e gate — an independently schedulable slice of the browser-test surface (editor disk writes, the Pool, WebKit segments, leak, visual, random-agent). Lanes exist so the gate parallelizes and so a failure names its neighborhood; which lanes a run requires is decided by its Mode.

### Pool
The duration-balanced lane holding the bulk of nonvisual browser specs. A bin-packing plan derived from measured per-spec durations splits it into same-weight buckets, so no single heavy spec file skews any bucket; rebalancing means refreshing the measured timings, never hand-assigning specs to buckets.

### Aggregate check
The stable, branch-protection-pinned status (one per gate) that passes only when every lane its Mode requires has passed. Protection pins aggregates rather than lanes precisely so the lane layout can be reshaped freely without touching repository settings.

### Auto-revert
The automation that reverts a red full-tier run on the default branch back to its prior green state without human action, so a brief red default branch is a self-healing event rather than a blocker on direct-push.

Before reverting it classifies the failure, because reverting a red that was not a real regression destroys good work: a run whose only failed Lanes are known-flaky (they fail for infrastructure reasons, not code) is re-run to let the flake self-heal, and escalated to a human via an issue only if it still fails flaky-only after two re-runs — never silently reverted, because those infra flakes are runner-correlated (repetition is not proof of a real bug). A run whose head commit is itself a revert is left alone — the loop guard, which prevents an endless revert cycle. It reverts only a red that represents a single, genuine regression.
