# Proving Grounds post-Round-5 audit

## Audit identity

The sweep ran on 18 July 2026 from a clean clone of committed harness revision
`fb0fa56a`, whose game-engine base is `origin/main` revision `a09babe3`. The
report recorded `dirty: false`, schema 1, 10 workers and a wall time of
163,870 ms. The report JSON remains local under `.sim-reports/` and is not a
versioned artefact.

```bash
npm run sim -- --runs 100000 --policy both --profile both --seed 1 --workers auto --label post-round5-100k
```

This command covers 100,000 seeds in each policy/profile cell: 400,000 plays
in total, 200,000 per policy.

## Headline results

| Policy | Wins / runs | Win rate | 95% Wilson interval | Fresh | Revealed | Issues |
|---|---:|---:|---:|---:|---:|---:|
| Random | 170 / 200,000 | 0.0850% | 0.0732–0.0988% | 0.0570% (57 / 100,000) | 0.1130% (113 / 100,000) | 0 |
| Greedy | 169,566 / 200,000 | 84.7830% | 84.6249–84.9398% | 81.1120% (81,112 / 100,000) | 88.4540% (88,454 / 100,000) | 4 |

The intelligent policy therefore clears the fixed-seed population far more
often than the legal random baseline. The 7.342 percentage-point greedy gap
between revealed and fresh profiles is large compared with the narrow Wilson
intervals and should be treated as a real progression effect in this policy,
not sampling noise. The corresponding random gap is 0.056 percentage points.

Act reach shows where the policies diverge:

| Policy | Start | Reached Act II | Reached Act III | Won |
|---|---:|---:|---:|---:|
| Random | 200,000 | 36,369 (18.1845%) | 807 (0.4035%) | 170 (0.0850%) |
| Greedy | 200,000 | 197,881 (98.9405%) | 172,974 (86.4870%) | 169,566 (84.7830%) |

## Cell balance

Greedy aspect 0 won 76,235 / 100,000 runs (76.2350%, Wilson
75.9702–76.4978%), while aspect 1 won 93,331 / 100,000 (93.3310%, Wilson
93.1747–93.4840%). The automatic aspect-spread flag is therefore warranted:
17.096 percentage points.

Greedy vow 0 won 31,210 / 33,334 runs (93.6281%) and vow 5 won 26,060 /
33,332 (78.1831%), firing the 15.445 percentage-point vow-spread flag. The
monotonic direction is also visible across the intermediate vows: 90.5448%,
85.5943%, 82.4643% and 78.2821% for vows 1–4 respectively.

The random policy's aspect rates were 0.0380% and 0.1320%; vow 0 was 0.3000%
and vow 5 was 0.0030%. These are useful baseline descriptors, but the policy
is too weak for them to be read as player-facing balance estimates.

## Combat economy

| Measure | Random | Greedy |
|---|---:|---:|
| Damage dealt per turn | 13.8160 | 27.5917 |
| Damage taken per turn | 3.7318 | 2.5139 |
| Energy waste per turn | 0.6304 | 0.0489 |
| Kindle rate per turn | 21.4961% | 78.0038% |
| Lantern Art rate per turn | 12.7199% | 29.6275% |
| Average potions used per run | 0.0000 | 3.3858 |
| Deaths holding at least one potion | 49.0567% | 10.8610% |

Neither policy crossed the 60% potion-hoarding threshold. The random agent
never used a potion, yet only 49.0567% of its deaths held one because most runs
ended before finding a potion. The greedy agent both used potions and died
with them much less often.

## Captured termination issues

There were no `engine-error` records and no issue at all under the random
policy. Greedy produced four deterministic turn-guard invariants in 200,000
runs (0.0020%). Each reproduced in a clean single-run invocation:

| Seed | Enemy | Reproduction | Diagnosis at turn 201 |
|---:|---|---|---|
| 37484 | `abyssalKnight` | `npm run sim -- --runs 1 --policy greedy --profile revealed --seed 37484 --workers 1 --label repro-37484` | Greedy policy livelock: it retained 3,216 Ward while leaving the enemy at 59 HP, continuing positive-utility defence/scaling choices instead of forcing damage. |
| 40826 | `siren` | `npm run sim -- --runs 1 --policy greedy --profile revealed --seed 40826 --workers 1 --label repro-40826` | Greedy policy livelock: it retained 6,154 Ward while leaving the enemy at 63 HP after 492 cumulative damage, then stopped making lethal progress. |
| 69714 | `siren` | `npm run sim -- --runs 1 --policy greedy --profile revealed --seed 69714 --workers 1 --label repro-69714` | Greedy policy livelock: self-Strength reached 594 while the enemy remained at 64 HP; repeated non-damaging utility choices exhausted the guard. |
| 98683 | `deepmaw` | `npm run sim -- --runs 1 --policy greedy --profile revealed --seed 98683 --workers 1 --label repro-98683` | Greedy policy livelock: it retained 32,844 Ward and 1,382 Strength while the enemy remained at its 60 HP maximum, wasting 579 energy across the fight. |

The common diagnosis is a simulation-policy progress failure, not evidence of
an engine exception or an unkillable content state. The walker correctly
bounded all four runs and emitted deterministic repro seeds. Changing the
policy or the game engine is outside this audit unit; these four seeds should
seed a follow-up policy-progress plan.

## Automatic balance signals

Automatic flags are prompts for design review, not balance verdicts. In
particular, card pick rates reflect the current greedy scoring table and the
offer count includes reward and shop offer surfaces.

### Greedy policy

- `brace`: 6,278 picks from 861,104 offers (0.7291%).
- `bulwark`: 3,834 / 423,917 (0.9044%).
- `frenzy`: 0 / 161,826 (0.0000%).
- `heavyBlow`: 2,685 / 860,561 (0.3120%).
- `leechBlade`: 696 / 424,941 (0.1638%).
- `momentum`: 3,279 / 186,656 (1.7567%).
- `devour`: 49,893 drafted runs won at 93.3638%, 8.5808 percentage points
  above the 84.7830% greedy population rate.
- `leviathan`: 6,822 killing blows, 22.4187% of greedy deaths against 2.5336%
  of enemy encounters.
- `sovereign`: 1,989 killing blows, 6.5363% of greedy deaths against 2.2793%
  of enemy encounters.
- The aspect-spread, vow-spread and four-issues signals are quantified above.

`frenzy` is the sharpest policy finding because a zero pick count across
161,826 offers cannot be sampling noise. The other low-pick cards may likewise
be mis-scored by the heuristic; player telemetry or a second intelligent
policy is needed before changing content. `devour` is strongly associated with
winning under this policy, but selection and survival bias prevent a causal
claim.

### Random policy

The random policy fired nine enemy kill-share flags:

| Enemy | Kills | Share of deaths | Share of encounters |
|---|---:|---:|---:|
| `abyssalKnight` | 2,495 | 1.2486% | 0.2269% |
| `alphaFang` | 17,667 | 8.8410% | 2.6292% |
| `gravewarden` | 15,313 | 7.6630% | 2.6345% |
| `heraldOfEnd` | 46 | 0.0230% | 0.0091% |
| `leviathan` | 2,852 | 1.4272% | 0.2118% |
| `rootheart` | 47,087 | 23.5635% | 4.1280% |
| `siren` | 977 | 0.4889% | 0.2134% |
| `sovereign` | 171 | 0.0856% | 0.0141% |
| `voidColossus` | 58 | 0.0290% | 0.0095% |

The random baseline reaches Act III only 807 times, so late-enemy shares have
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
