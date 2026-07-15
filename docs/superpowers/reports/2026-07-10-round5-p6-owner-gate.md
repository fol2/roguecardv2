# Round 5 P6 owner gate

**Status:** OWNER FAIL — remediation in progress  
**Date:** 2026-07-15  
**PE tip (at fail):** `275425e8`  
**P6 capture source (failed set):** `1681b611`  
**FE pre-filter:** invalidated (mechanical PASS; owner taste FAIL)

## Decision: OWNER FAIL

Owner rejected the contact-sheet package with detailed geometry/card regressions.
Task 36 mechanical pre-filter is **not** a substitute for owner taste or
pixel-vs-original comparison. Remediation must restore pre-P6 layout fidelity
before re-presenting.

## Owner FAIL inventory (required fixes)

1. Dawn phone-portrait: whisper alignment; title mid; whisper+stats horizontal
2. Dawn phone-landscape: whisper width match
3–6. Embark landscape/portrait: layout + VOW must not be a circle; match original
7. Event phone-landscape: centered, not squeezed
8. Fall desktop/pad landscape: wider
9. Lamplighter: full screen; phone selection visible
10. Map: three.js not abandoned — capture freeze hid `#bg3d`
11–13,15. Rest/rewards/shop/treasure phone-landscape: centered / full span
14. Title all shapes: blank top half + wordmark wrong
16. Vigil phone-landscape: title visible
17. Phase-2 inherits same layout bugs
18. Card regression: cost gem, art asset, art margin, rarity accent

## Root-cause summary (audit)

- FE `.r5-scene-panel` stamped onto `sceneBg()` → breaks absolute fill
- FE landscape `flex-direction: row` on embark/title/scene family
- FE `.r5-vow-dial` circle/rotate on `.vow-block`
- FE wordmark `overflow:hidden` / border clips logo
- Capture `freeze` hides `#bg3d`
- Cardface `assets: null` → canvas2d fallback without art/hex cost

## After remediation

Re-capture → FE re-critique → re-present to owner → only then GO TO P7.

**WebKit-safe API review: PASS** (engineering only; not visual approval).
