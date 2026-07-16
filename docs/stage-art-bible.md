# Round 5 stage art bible (P7 ship-front)

**Status:** FE preparation draft — candidates live under `scratch/style-tests/round5/`; final paths require per-file owner promotion (Task 38 Steps 5–6).  
**Date:** 2026-07-16  
**PE tip synced for prep:** `9cc268ff` (`jamesto/round5-production-engineering-continuation`)

## Boss → act mapping

| Boss id | Act theme | Final plate ids |
|---|---|---|
| `rootheart` | Act 1 | `rootheart-{backdrop,mid,ledge}` |
| `leviathan` | Act 2 | `leviathan-{backdrop,mid,ledge}` |
| `sovereign` | Act 3 | `sovereign-{backdrop,mid,ledge}` |

Absent boss override → act-standard `actN-{backdrop,mid,ledge}` plates (existing theme fallback). PE wiring must never map act numbers to boss names for normal encounters.

## Title layers

| Layer id | Final path | Role |
|---|---|---|
| `round5-back` | `src/assets/title/round5-back.png` | Far parallax |
| `round5-mid` | `src/assets/title/round5-mid.png` | Mid parallax |
| `round5-foreground` | `src/assets/title/round5-foreground.png` | Near parallax |

Legacy fallback remains `src/assets/title/title.png` / `title-background` resolution when a Round 5 layer is missing. Wordmark raster stays on the existing title text path — ship-front layers must not replace the wordmark.

## Unlock toast

| Asset | Final path | Fallback |
|---|---|---|
| Unlock frame | `src/assets/meta/unlock-toast-frame.png` | Existing deed/content illustration frame |

## Dimensions and alpha

- Stage plates: **1536×1024**, 8-bit RGBA PNG (match current `actN-*` plates).
- Title layers: match existing title full-bleed plate aspect; keep edge bleed for all five stage shapes.
- Unlock frame: opaque frame with transparent interior cutout suitable for toast illustration.

## Palette / horizon / ground

- Stained-glass / ashglass Round 5 readable palette (see design-council style test).
- Horizon locked per act; ground line must clear mobile safe zones (phone/pad portrait & landscape, desktop-landscape).
- Boss plates keep crop/horizon/ground/mobile focal rules of the act they override; mid/ledge must overlap backdrop without clipping HUD chrome.

## All-five-shape mobile-safe zones

Layout speaks stage px (`battlefield-layout.js` / stage shapes). Contact-sheet review must show:

1. phone-portrait  
2. phone-landscape  
3. pad-portrait  
4. pad-landscape  
5. desktop-landscape  

Focal subject stays inside the union of safe insets; no critical silhouette under chrome piles / end-turn / energy.

## Crop / contact-sheet criteria

- Each boss set: three layers aligned; ledge readable above ground line.
- Title: three layers; wordmark fallback still legible if mid/front muted.
- Reject: crushed blacks, unreadable silhouette, horizon jump vs act plates, text baked into plates.

## Fallback appearance

- Missing boss plate id → act-standard plates for that theme.
- Missing Round 5 title layer → legacy title / title-background.
- Missing unlock frame → existing deed/content illustration chrome.

## Prompt ledgers

Per-folder ledgers (scratch only until promotion):

- `scratch/style-tests/round5/stage/prompt-ledger.md`
- `scratch/style-tests/round5/title/prompt-ledger.md`
- `scratch/style-tests/round5/meta/prompt-ledger.md`
