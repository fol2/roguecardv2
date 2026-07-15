# Round 5 P6 owner gate

**Status:** READY FOR OWNER RE-REVIEW  
**Date:** 2026-07-15  
**PE tip (remediation):** `6bb2eb21`  
**P6 capture source (this package):** `6bb2eb213eabfc9a25cda7c61e8bd8827a17d25b`  
**Artifacts:** `docs/superpowers/artifacts/round5-p6-contact-sheets/` (183 rows)  
**FE pre-filter:** previously invalidated by owner taste FAIL; code remediations below await owner sign-off

## Prior decision: OWNER FAIL

Owner rejected the contact-sheet package with detailed geometry/card regressions
(see inventory). Mechanical Task 36 PASS is not a substitute for owner taste.

## Owner FAIL inventory → remediation status

| # | Issue | Code status |
|---|---|---|
| 1 | Dawn phone-portrait whisper mid-align | Fixed (`95dacf99`) |
| 2 | Dawn phone-landscape whisper width | Fixed (`252a3445`) |
| 3–6 | Embark layout + VOW not a circle | Fixed (FE merge `5c1b39bc` / `f2479ec2`) |
| 7 | Event phone-landscape centered | Fixed (`f2479ec2` / sceneBg) |
| 8 | Fall landscape wider | Fixed (PE bridges `981fbc9b`) |
| 9 | Lamplighter full screen / phone selection | Fixed (`981fbc9b`) |
| 10 | Map three.js visible in capture | Fixed (`5ebe7383`) |
| 11–13,15 | Rest/rewards/shop/treasure phone-landscape | Fixed (`2a2e0432` sceneBg + FE) |
| 14 | Title blank top / wordmark | Fixed (`bce6e765`) |
| 16 | Vigil phone-landscape title | Fixed (`f2479ec2`) |
| 17 | Phase-2 inherits layout | Recaptured with same tip |
| 18 | Card gem / art / rarity | Fixed (`30e2a780` / `3baa08cb`) |

## Root causes addressed

- `sceneBg()` no longer stamps `r5-scene-panel`
- FE landscape row / vow-dial / wordmark clipping restored
- Capture `freeze({ keepBg3d })` keeps `#bg3d` on map
- Cardface assets wired; hex cost gem + rarity chrome
- Capture `waitSettled` bounds `__probe.freeze` so persistence plates do not hang

## This package (for owner)

Re-captured contact sheets at `6bb2eb21`. Open composed sheets under:

`docs/superpowers/artifacts/round5-p6-contact-sheets/sheets/`

Evidence: `docs/superpowers/reports/2026-07-10-round5-p6-capture-evidence.md`

**Owner action required:** taste PASS or FAIL with notes.  
Do **not** treat this as GO TO P7 until owner PASS.

**WebKit-safe API review: PASS** (engineering only; not visual approval).
