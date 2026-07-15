# Round 5 P6 owner gate

**Status:** OWNER PASS (taste) — baselines / `Decision: GO TO P7` pending Task 37 Steps 3–4  
**Date:** 2026-07-15  
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
   golden inset / contained banner).
2. **Phone-portrait HUD deck/menu right-aligned** — `margin-left: auto` on
   `.hud-right` when `.hud-mid` is hidden (golden remains left-packed).

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

## Next (Task 37 Steps 3–4)

1. Commit remediation tip; append `P6 baseline source: <HEAD>`; push continuation branch.
2. Local + remote baseline refresh; promote sheets/manifest; standing `--profile p6`.
3. Full Step 4 gate bundle → record **`Decision: GO TO P7`** in this report + status docs.

**WebKit-safe API review: PASS** (engineering only; not visual approval).
