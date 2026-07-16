# Round 5 P6 owner gate

**Status:** CLOSED — `Decision: GO TO P7` (recorded 2026-07-16; owner confirm in-session)  
**Date:** 2026-07-15 (OWNER PASS) / 2026-07-16 (GO)  
**PE tip (remediation, pre-commit dirty at sign-off):** `5964a086` + layout-bridge remediation package  
**Layout projection:** `docs/superpowers/artifacts/round5-p6-layout-projection/` — **19/19 focus rows, unexpectedTotal=0**  
**Artifacts:** `docs/superpowers/artifacts/round5-p6-contact-sheets/` (183 rows)  
**Contact-compare:** `docs/superpowers/artifacts/round5-p6-contact-compare/`

## Decision: OWNER PASS

Owner approved the contact-compare sheets after the PE layout-bridge remediation
pass. This closes Task 37 **Step 2 only**. Steps 3–4 (baseline refresh +
`Decision: GO TO P7`) remain PE-owned and are not yet claimed.

Mechanical Task 36 PASS is not a substitute for this taste verdict; the taste
verdict does not by itself refresh baselines or open P7.

## Intentional ≠ golden (recorded at OWNER PASS)

These deltas are approved and must not be “fixed” toward golden without a new
owner decision:

1. **Title background full-bleed / fullscreen** — stage art edge-to-edge (vs
   golden inset / contained banner). Includes the safe-center wordmark
   position (`title.wordmark.*` whitelisted 2026-07-16).
2. **Phone-portrait HUD deck/menu right-aligned** — `margin-left: auto` on
   `.hud-right` when `.hud-mid` is hidden (golden remains left-packed).
3. **Dawn whisper/ledger/ceremony inside stage bounds** — `09806910` /
   `8d342f73` overflow fixes on phone shapes (owner GO 2026-07-16).
4. **Embark aspect cards stacked + compact vow dial** — restores the
   owner-FAIL gate `embark-phone-landscape-column` that f96fefd1's landscape
   bridge had reverted to a row; wide stacked cards keep the CTA row on the
   430px stage (`946a179c`, owner GO 2026-07-16).
5. **Rose-window baselines past the overflow fix** — the 2026-07-16 refresh
   replaced six baselines that had captured the pre-`09806910` right-shifted
   overlay on both platforms.

## Semantic evidence (required)

Engineering validation for this inventory is the **layout projection**, not
screenshot reading. See:

`docs/superpowers/reports/2026-07-15-round5-p6-layout-projection-evidence.md`

`npm run project:round5:layout:compare` → **unexpectedTotal=0** (19 focus rows).

## Owner FAIL inventory → remediation status

| # | Issue | Projection gate |
|---|---|---|
| 1 | Dawn phone-portrait whisper mid-align | `dawn-phone-portrait-whisper-align` PASS |
| 2 | Dawn phone-landscape whisper width | `dawn-phone-landscape-whisper-width` PASS |
| 3–6 | Embark layout + VOW not a circle | `embark-vow-not-circle` / `embark-phone-landscape-column` PASS |
| 7 | Event phone-landscape centered | `event-phone-landscape-centered` PASS |
| 8 | Fall landscape wider | `fall-landscape-wider` PASS |
| 9 | Lamplighter full screen | `lamplighter-fills-stage` PASS |
| 10 | Map three.js visible | `map-bg3d-visible` PASS |
| 11–13,15 | Scene phone-landscape panels | `scene-bg-not-panel-stamp` PASS |
| 14 | Title blank top / wordmark | `title-parallax-covers-top` / `title-wordmark-unclipped` PASS |
| 16 | Vigil phone-landscape title | `vigil-phone-landscape-title` PASS |
| 18 | Card gem / art / rarity | `cardface-hex-gem-art-rarity` PASS |

## Aligned screens (summary)

Title (centering + intentional fullscreen bg), Embark (VOW chrome removed),
Rewards, boss-relic, rest, event, treasure, vigil, lamplighter (golden panel
geometry via PE bridges), Hollow (kicker typography), Shop (panel + live DOM
card faces), HUD (`Act N` restored; intentional phone-portrait right pack).

## Decision: GO TO P7 (2026-07-16)

Steps 3–4 executed on the continuation branch; owner confirmed the correction
packet (embark restack before/after, rose-window baseline catch-up, golden
whitelist entries 3–5) in-session on 2026-07-16.

| Evidence | Result |
|---|---|
| Post-PASS regressions repaired | `946a179c` embark restack + shop live-DOM-face assert; `f96fefd1` fallout — both deterministic repro, fixed, CI-green |
| Flake root-causes (no blind bumps) | trace title-timer task-ordering; Lab `data-lab-ready` interactivity stamp; long-press latency budget removed; fall-ceremony terminal-state wait; Rose decode settlement wait; map DOM-on-3D forced click |
| CI (rebuilt pool topology) | run 29502052109 @ `c3e542a8` — **all 33 jobs green** (`unit`, `e2e`, `e2e nonvisual`, `p2-base`); design `docs/superpowers/specs/2026-07-16-e2e-pool-shards-design.md` |
| Baselines | darwin local + linux `update-baselines.yml` run 29498831426 @ `82ab5c38`, installer SHA-verified; only the six rose-window baselines changed (overflow catch-up); visual 72/72 |
| Contact sheets | 183 rows recaptured @ `82ab5c38`, promoted with correction record in the capture-evidence report |
| Layout projection vs golden | `unexpectedTotal=0` (19 rows) after owner-sanctioned whitelist entries 3–5 |
| Standing `--profile p6` | green at the GO tip (recorded in the ignored ledger) |

PERF evidence: no `PERF_WARNING` blocking closure; hard bundle/leak/context/
cache gates green via standing.

**WebKit-safe API review: PASS** (engineering only; not visual approval).
