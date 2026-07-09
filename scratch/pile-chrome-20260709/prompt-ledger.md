# Pile chrome batch prompt ledger - 2026-07-09

Generated for Draw / Discard / Ashes pile state masters. Spec: Task 2 pile chrome
(`assetUrl('piles', 'draw'|'discard'|'ashes')`).

## Source workflow

- Generation path: Codex built-in `$imagegen` via `tools/imagegen.sh`.
- Source outputs: `scratch/pile-chrome-20260709/source/`.
- Alpha: `scratch/pile-chrome-20260709/alpha/` via
  `/Users/jamesto/.codex/skills/imagegen/scripts/remove_chroma_key.py`
  (status-batch flags: border auto-key, soft-matte, thresholds 24/220, despill,
  edge-contract 1).
- Rim: `tools/strip-alpha-rim.py --radius 6 --mode darken`, then `sips -Z 512`.
- Live promote: `src/assets/piles/{draw,discard,ashes}.png`.
- Nano Banana Pro: ran for all three (`source/*-nb.jpg`, Model: gemini-3-pro-image);
  promoted alphas are from NB → chroma → rim → 512.

## Shared prompt block

Serious cartoon-gothic stained-glass game art: chunky dark outer silhouette, simplified exaggerated proportions, one iconic readable prop, 3-5 large jewel-tone glass colour masses with very few thick lead dividers, matte painterly texture, warm amber rim light, soft controlled inner glow. Designed to remain readable at 42px and 62px UI size. No text, no labels, no watermark. Square transparent-ready prop, solid #ff00ff background, no text. Single centred small card-stack prop only, generous 15 percent padding, no hands, no scene, no ground plane, no contact shadow. Same card body aspect and silhouette family across all three states. Do not use #ff00ff inside the subject. Subject:

## Attempts

| id | subject | source | notes |
|---|---|---|---|
| draw | a neat sealed face-down card stack, cool parchment and lead glass panes, tidy aligned backs, unread deck chrome | source/draw.png | v1 WRONG: read as ornate book/tome (archived `source/v1-wrong/draw.png`) |
| discard | the same card-stack body slightly askew and worn, warmer spent parchment tone, used discard pile chrome | source/discard.png | ok; kept as shared silhouette reference; NB → alpha → piles/discard.png |
| ashes | the same card-stack body with charred blackened edges and tiny ember flecks, burnt ashes pile chrome | source/ashes.png | v1 WRONG: skull emblem (archived `source/v1-wrong/ashes.png`) |

## Silhouette fix pass (2026-07-09)

Review: draw ≠ card stack (book); ashes skull ≠ discard arch/gem family. Regenerated
draw + ashes with `--image=scratch/pile-chrome-20260709/source/discard.png` so body
matches discard. Discard live asset unchanged.

| id | subject | source | notes |
|---|---|---|---|
| draw | NEAT SEALED unread draw deck: perfectly aligned face-down backs, cool parchment/lead-blue glass, same arch-and-gem motif as reference (cooler sapphire/teal), NOT book/tome | source/draw.png | v2 askew intermediate archived as `source/draw-v2-askew.png`; v3 neat sealed promoted; NB → alpha → piles/draw.png |
| ashes | same card-stack body as reference + charred edges + ember flecks; keep gothic arch-and-gem motif (NO skull) | source/ashes.png | ref=discard; NB → alpha → piles/ashes.png |
| discard | (unchanged) | source/discard.png | kept as shared body reference |

## Single-card masters pass (2026-07-09)

Owner: discard/ashes were pre-piled; runtime should stack single-card masters.
Archived piled versions under `source/v2-piled-wrong/`. Regenerated discard + ashes
as **exactly one face-down card** with draw.png as silhouette reference.

| id | subject | source | notes |
|---|---|---|---|
| discard | same single card as draw, slightly askew, warmer spent tone — ONE card only | source/discard.png | single-card; promoted |
| ashes | same single card, charred edges + ember flecks — ONE card only | source/ashes.png | single-card; promoted |
| draw | (unchanged) | piles/draw.png | kept as single-card reference |

Labels restored in combat chrome (DRAW / DISCARD / ASHES under stack).
