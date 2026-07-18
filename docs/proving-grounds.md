# Proving Grounds operator guide

Proving Grounds is a deterministic developer instrument for exercising the
pure game engine. It has two populations with deliberately different evidence
boundaries: independent **Rounds** for balance investigation and persistent
Vigil **Full Cycles** for Emberglass progression and trigger proof.

Open `http://localhost:5174/?sim=1` while `npm run dev` is running to launch
the report lab. Reports are local JSON under `.sim-reports/`; they are not
release artefacts or player telemetry.

## Exact lifecycle definitions

A **Round** is one canonical Climb from Embark through playable Acts I–III. It
ends in exactly one Run Outcome: Dawn, Fall, or simulator error. `Round` is a
reporting alias only; it does not rename the Climb domain or appear in player
copy. Act indices remain `0..2`. There is no playable Act IV map or fight.

A **Full Cycle** is an ordered sequence of Rounds sharing one isolated Vigil.
It always starts from a fresh profile and ends at the first of:

- the `act4Reveal` sealed-door promise being durably staged to a specific
  Round/run id: `completed`;
- the configured `maxRounds` being reached: `censored`;
- a simulator error: `failed`.

A failed cycle retains the errored Round and its reproduction evidence, then
starts no later Round from possibly partial state. Failed cycles are excluded
from completion-timing statistics. The six-Shard threshold and promise
delivery are separate report fields: six Shards unlock the sealed summit;
delivery completes only when a later or same-Round Dawn stages the promise.

The endpoint is called the **Act IV promise**, never an Act IV victory. The
gameplay surface still ends after Act III. Durable staging is the simulator's
completion proof; visual playback is outside that transaction and may replay
after a crash.

## Policies and interpretation

| Policy | Modes | What it proves | Evidence boundary |
|---|---|---|---|
| `random` | Round | Seeded floor baseline | Simulator balance instrument; not player behaviour |
| `greedy` | Round | Win-first machine decisions over visible combat previews | Simulator balance instrument; not player behaviour |
| `progression` | Round, Full Cycle | A goal-directed machine can pursue disclosed Emberglass goals through legal live flow | Machine-policy evidence; not observed player win-rate proof |
| `coverage` | Full Cycle | A named trigger can be exercised and reproduced | QA-only operational evidence; excluded from balance Compare |

Progression receives only a disclosed goal id and its current visible
eligibility. Coverage may receive an explicit trigger target, but it receives
no future random values. Neither policy writes Vigil state; the walker and
canonical terminal coordinator own all state transitions.

## Commands

Independent Round sweep:

```bash
npm run sim -- --mode round --runs 10000 --policy both --profile both \
  --seed 1 --workers auto --label round-baseline
```

Goal-directed Full Cycles:

```bash
npm run sim -- --mode cycle --cycles 100 --max-rounds 100 \
  --policy progression --seed 1 --workers auto --label progression-cycles
```

Coverage rotates deterministically through the trigger catalogue unless a
target is supplied. A one-cycle explicit-target reproduction is:

```bash
npm run sim -- --mode cycle --cycles 1 --max-rounds 100 \
  --policy coverage --target usurper.buy --seed 701 --workers 1 \
  --label repro-usurper-buy
```

Cycle mode rejects `--runs` and `--profile`; it always owns a fresh evolving
Vigil. Round mode rejects `--cycles`, `--max-rounds`, and `--target`. Use
`npm run sim -- --help` for current limits and the complete flag matrix.
Cycle requests are also bounded by `cycles * maxRounds <= 100,000`. With the
fixed 1,000-resample suffix method, that caps worst-case bootstrap sampling at
100,000,000 whole-cycle draws. The CLI, dev endpoint, metadata, and browser
form enforce the same budget before workers start.

## Reading schema 2

For Round ordinal `k`, the Dawn rate is `dawns(k) / started(k)`. The at-risk
count is cycles that actually reached `k`; each cycle contributes at most one
observation to that cell. The 95% interval is Wilson. Later ordinals can have
smaller populations, so always read the denominator with the rate.

Completed-only Rounds-to-promise mean and percentiles are descriptive. They
exclude censored and failed cycles. The adjacent Kaplan–Meier cells include
completion events and max-Round censors; restricted mean Rounds integrates
that curve through `maxRounds`. Failed cycles remain reported separately and
do not enter the timing population. If nothing completes, completion-only
values are unavailable and render as `No completed cycles`, never zero or
`NaN`.

For progressive suffix ordinal `k`, the rate is:

```text
all Dawns in attempted Rounds k..cycle end
-------------------------------------------
all attempted Rounds k..cycle end
```

Its 95% interval is a deterministic whole-cycle cluster bootstrap, because
Rounds from one Vigil are correlated. `perfectSuffixStart` is the earliest
Round `k` for which every attempted Round from `k` through completion was a
Dawn. It is defined only for completed cycles.

Trigger funnels use a versioned catalogue and retain `eligible`, `attempted`,
`succeeded`, `missed`, and closed miss-reason counts. Every issue or missed
explicit target carries a copyable one-cycle command with the cycle seed,
Round ordinal, derived run seed, phase, and target.

Schema 1 remains the independent-Round format. The lab derives tabs from the
loaded report, falls back to Headline when a schema 1 report replaces an
active Cycle/Progress view, and refuses comparisons across schema, mode, or
policy provenance. Coverage reports open trigger-first and have no balance
Compare tab.

## Proof gates

Run local gates separately and report them separately from review or CI:

```bash
npm test
npm run test:progression
npm run test:ci
npm run sim:smoke
npm run build
npx playwright test test/e2e/sim-lab.spec.js --project=desktop --workers=1
npm run test:e2e:smoke
```

`sim:smoke` keeps the original 300-seed Round matrix, scripted quest and
lifecycle fixtures, worker-partition checks, and a bounded natural canary.
The unrigged progression canary uses cycle seed `1`, stages the Act IV promise
on Round `36` within a cap of `40`, and must retain zero issues. This fixed
canary proves one complete legal path; it is not a population estimate.

Ready-mode GitHub `unit` and `e2e` aggregates are the shipping gate. Local
tests, focused browser proof, review approval, and CI standing are distinct
facts and must not be collapsed into “all green”.
