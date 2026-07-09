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
| draw | a neat sealed face-down card stack, cool parchment and lead glass panes, tidy aligned backs, unread deck chrome | source/draw.png | ok; NB source/draw-nb.jpg → alpha → piles/draw.png |
| discard | the same card-stack body slightly askew and worn, warmer spent parchment tone, used discard pile chrome | source/discard.png | ok; NB source/discard-nb.jpg → alpha → piles/discard.png |
| ashes | the same card-stack body with charred blackened edges and tiny ember flecks, burnt ashes pile chrome | source/ashes.png | ok; NB source/ashes-nb.jpg → alpha → piles/ashes.png |
