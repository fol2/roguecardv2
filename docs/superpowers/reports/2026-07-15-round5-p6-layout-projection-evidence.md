# Round 5 P6 owner-FAIL layout projection evidence

**Date:** 2026-07-15  
**Branch:** `jamesto/round5-production-engineering-continuation`  
**sourceSha:** `fccead6f09cf41f85be57e76f6b7b22c0c6233df` (projection tip before this evidence commit)  
**Method:** JSON semantic predicates — **not** screenshot taste

## Why this exists

Owner FAIL remediations were previously “validated” by reading contact-sheet
PNGs. That is weaker than structured layout facts and can rubber-stamp wrong
geometry. This projection is the PE evidence gate for the owner-FAIL inventory.

## Surfaces

| Piece | Path |
|---|---|
| Pure gates | `src/ui/screen-layout-projection.js` |
| Probe collector | `window.__probe.screenLayout()` / `screenLayoutGates()` |
| Unit tests | `npm run test:layout-projection` |
| Focused e2e | `p6-layout-projection.spec.js` |
| Matrix tool | `npm run project:round5:layout` |
| Promoted JSON | `docs/superpowers/artifacts/round5-p6-layout-projection/` |

## Gate ids (owner FAIL map)

See `OWNER_FAIL_GATE_IDS` in `screen-layout-projection.js`:

- dawn phone-portrait pair mid-axis + ceremony fill
- dawn phone-landscape whisper span (≥90% stage, mid cx)
- embark vow pill (aspect ≥ 1.6) + phone-landscape column stack
- event phone-landscape panel centering
- fall landscape panel width ratio
- lamplighter fills stage
- map `#bg3d` visible after freeze
- `scene-bg` not stamped `r5-scene-panel`
- title parallax top + wordmark unclipped
- vigil phone-landscape title visible
- cardface hex gem (6) + art + rarity accent

## Result (this run)

```text
layout projection: 19 rows, failedApplicable=0
```

Manifest: `docs/superpowers/artifacts/round5-p6-layout-projection/manifest.json`

| Focus rows | Applicable failures |
|---|---|
| 19 | **0** |

Example dawn phone-portrait detail (pass):

`pairCx≈195 stageCx=195 fillsCeremony=true bandMatch=true`

## Commands

```bash
npm run test:layout-projection
node tools/run-with-strict-e2e-port.mjs -- npx playwright test \
  p6-layout-projection --project=desktop --workers=1 --no-deps
npm run project:round5:layout
```

## Scope note

This is **engineering evidence** for the owner-FAIL checklist. It does **not**
replace owner taste sign-off on contact sheets. Owner PASS is still required
before Task 37 baselines / GO TO P7.
