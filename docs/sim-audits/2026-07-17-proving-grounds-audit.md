# Proving Grounds post-Round-5 audit

## Audit identity

The final sweep ran on 18 July 2026 from a clean clone of committed harness
revision `db05b82`, whose game-engine base is `origin/main` revision
`a09babe3`. The report recorded `dirty: false`, schema 1, 10 workers and a wall
time of 152,989 ms. The report JSON remains local under `.sim-reports/` and is
not a versioned artefact. This final sweep supersedes the pre-review run: code
review found that the first walker used the whole common pool for Library
offers instead of the live engine's weighted, unlock-aware five-card roll.

```bash
npm run sim -- --runs 100000 --policy both --profile both --seed 1 --workers auto --label post-review-100k
```

This command covers 100,000 seeds in each policy/profile cell: 400,000 plays
in total, 200,000 per policy.

## Headline results

| Policy | Wins / runs | Win rate | 95% Wilson interval | Fresh | Revealed | Issues |
|---|---:|---:|---:|---:|---:|---:|
| Random | 146 / 200,000 | 0.0730% | 0.0621–0.0858% | 0.0400% (40 / 100,000) | 0.1060% (106 / 100,000) | 0 |
| Greedy | 168,887 / 200,000 | 84.4435% | 84.2840–84.6017% | 80.6760% (80,676 / 100,000) | 88.2110% (88,211 / 100,000) | 4 |

The intelligent policy therefore clears the fixed-seed population far more
often than the legal random baseline. The 7.535 percentage-point greedy gap
between revealed and fresh profiles is large compared with the narrow Wilson
intervals and should be treated as a real progression effect in this policy,
not sampling noise. The corresponding random gap is 0.066 percentage points.

Act reach shows where the policies diverge:

| Policy | Start | Reached Act II | Reached Act III | Won |
|---|---:|---:|---:|---:|
| Random | 200,000 | 36,114 (18.0570%) | 799 (0.3995%) | 146 (0.0730%) |
| Greedy | 200,000 | 197,771 (98.8855%) | 172,346 (86.1730%) | 168,887 (84.4435%) |

## Cell balance

Greedy aspect 0 won 75,657 / 100,000 runs (75.6570%, Wilson
75.3900–75.9220%), while aspect 1 won 93,230 / 100,000 (93.2300%, Wilson
93.0726–93.3841%). The automatic aspect-spread flag is therefore warranted:
17.573 percentage points.

Greedy vow 0 won 31,110 / 33,334 runs (93.3281%) and vow 5 won 25,988 /
33,332 (77.9671%), firing the 15.361 percentage-point vow-spread flag. The
monotonic direction is also visible across the intermediate vows: 90.2328%,
85.1683%, 81.9903% and 77.9731% for vows 1–4 respectively.

The random policy's aspect rates were 0.0390% and 0.1070%; vow 0 was 0.2700%
and vow 5 was 0.0030%. These are useful baseline descriptors, but the policy
is too weak for them to be read as player-facing balance estimates.

## Combat economy

| Measure | Random | Greedy |
|---|---:|---:|
| Damage dealt per turn | 13.8024 | 27.5050 |
| Damage taken per turn | 3.7336 | 2.5208 |
| Energy waste per turn | 0.6304 | 0.0495 |
| Kindle rate per turn | 21.4952% | 77.9935% |
| Lantern Art rate per turn | 12.7144% | 29.6401% |
| Average potions used per run | 0.0000 | 3.4011 |
| Deaths holding at least one potion | 49.0468% | 10.7589% |

Neither policy crossed the 60% potion-hoarding threshold. The random agent
never used a potion, yet only 49.0468% of its deaths held one because most runs
ended before finding a potion. The greedy agent both used potions and died
with them much less often.

## Captured termination issues

There were no `engine-error` records and no issue at all under the random
policy. Greedy produced four deterministic turn-guard invariants in 200,000
runs (0.0020%). Each reproduced in a clean single-run invocation:

| Seed | Enemy | Reproduction | Diagnosis at turn 201 |
|---:|---|---|---|
| 37484 | `abyssalKnight` | `npm run sim -- --runs 1 --policy greedy --profile revealed --seed 37484 --workers 1 --label repro-37484` | Greedy policy livelock: the fight remained active at the deterministic 200-turn guard instead of forcing lethal progress. |
| 40826 | `siren` | `npm run sim -- --runs 1 --policy greedy --profile revealed --seed 40826 --workers 1 --label repro-40826` | Greedy policy livelock: the fight remained active at the deterministic 200-turn guard instead of forcing lethal progress. |
| 69714 | `siren` | `npm run sim -- --runs 1 --policy greedy --profile revealed --seed 69714 --workers 1 --label repro-69714` | Greedy policy livelock: the fight remained active at the deterministic 200-turn guard instead of forcing lethal progress. |
| 98683 | `deepmaw` | `npm run sim -- --runs 1 --policy greedy --profile revealed --seed 98683 --workers 1 --label repro-98683` | Greedy policy livelock: the fight remained active at the deterministic 200-turn guard instead of forcing lethal progress. |

All four signatures reappeared unchanged after the live event-offer parity
fix. The common diagnosis is a simulation-policy progress failure, not
evidence of an engine exception or an unkillable content state. The walker
correctly bounded all four runs and emitted deterministic repro seeds.
Changing the policy or the game engine is outside this audit unit; these four
seeds should seed a follow-up policy-progress plan.

## Automatic balance signals

Automatic flags are prompts for design review, not balance verdicts. In
particular, card pick rates reflect the current greedy scoring table and the
offer count includes reward and shop offer surfaces.

### Greedy policy

- `brace`: 6,277 picks from 859,521 offers (0.7303%).
- `bulwark`: 3,831 / 422,897 (0.9059%).
- `frenzy`: 0 / 161,782 (0.0000%).
- `heavyBlow`: 2,638 / 859,070 (0.3071%).
- `leechBlade`: 682 / 424,196 (0.1608%).
- `momentum`: 3,265 / 186,906 (1.7469%).
- `devour`: 49,760 drafted runs won at 93.3039%, 8.8604 percentage points
  above the 84.4435% greedy population rate.
- `limitBreak`: 15,206 drafted runs won at 92.8055%, 8.3620 percentage
  points above the greedy population rate.
- `leviathan`: 6,875 killing blows, 22.0997% of greedy deaths against 2.5335%
  of enemy encounters.
- `sovereign`: 2,003 killing blows, 6.4387% of greedy deaths against 2.2738%
  of enemy encounters.
- The aspect-spread, vow-spread and four-issues signals are quantified above.

`frenzy` is the sharpest policy finding because a zero pick count across
161,782 offers cannot be sampling noise. The other low-pick cards may likewise
be mis-scored by the heuristic; player telemetry or a second intelligent
policy is needed before changing content. `devour` and `limitBreak` are
strongly associated with winning under this policy, but selection and survival
bias prevent a causal claim.

### Random policy

The random policy fired nine enemy kill-share flags:

| Enemy | Kills | Share of deaths | Share of encounters |
|---|---:|---:|---:|
| `abyssalKnight` | 2,463 | 1.2324% | 0.2222% |
| `alphaFang` | 17,725 | 8.8690% | 2.6313% |
| `gravewarden` | 15,311 | 7.6611% | 2.6306% |
| `heraldOfEnd` | 42 | 0.0210% | 0.0091% |
| `leviathan` | 2,807 | 1.4045% | 0.2093% |
| `rootheart` | 47,254 | 23.6443% | 4.1265% |
| `siren` | 976 | 0.4884% | 0.2120% |
| `sovereign` | 175 | 0.0876% | 0.0134% |
| `voidColossus` | 53 | 0.0265% | 0.0094% |

The random baseline reaches Act III only 799 times, so late-enemy shares have
strong reach and survivor confounding. `rootheart`, `alphaFang` and
`gravewarden` are robust descriptions of how the deliberately weak agent
dies; they are not, by themselves, reasons to nerf those enemies.

## Audit verdict

The harness completed the required 400,000-play sweep in under three minutes,
with stable seed-level reproduction and no engine exceptions. The greedy bot
is materially stronger than random and reveals clear aspect, vow, fresh-profile
and policy-preference signals. The only correctness finding is the four-seed
greedy progress livelock, safely contained by the 200-turn guard and recorded
for follow-up rather than hidden by an in-audit engine or balance change.
