# Concepts

Shared domain vocabulary for this project — entities, named processes, and status concepts with project-specific meaning. Seeded with core domain vocabulary, then accretes as ce-compound and ce-compound-refresh process learnings; direct edits are fine. Glossary only, not a spec or catch-all.

## CI Verification

### Mode
The verification tier a CI run resolves from its triggering event: pull requests get the smoke tier by default (unit checks, build, a browser smoke pass), pushes to the default branch get the full tier (the complete browser matrix), and a PR can opt itself up to full via a dedicated label. A red full run on the default branch triggers an automatic revert proposal rather than blocking anyone.

### Lane
One leaf partition of the e2e gate — an independently schedulable slice of the browser-test surface (editor disk writes, the Pool, WebKit segments, leak, visual, random-agent). Lanes exist so the gate parallelizes and so a failure names its neighborhood; which lanes a run requires is decided by its Mode.

### Pool
The duration-balanced lane holding the bulk of nonvisual browser specs. A bin-packing plan derived from measured per-spec durations splits it into same-weight buckets, so no single heavy spec file skews any bucket; rebalancing means refreshing the measured timings, never hand-assigning specs to buckets.

### Aggregate check
The stable, branch-protection-pinned status (one per gate) that passes only when every lane its Mode requires has passed. Protection pins aggregates rather than lanes precisely so the lane layout can be reshaped freely without touching repository settings.
