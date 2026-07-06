# Card Art Drift Control

This file is the production gate for the remaining 57 card arts.

The approved anchors are:

- `strike` - attack action: large foreground blade, quieter red chapel window.
- `defend` - skill defence: figure, lantern, blue ward, muted chapel background.
- `empower` - power state: kneeling figure, chest fire, sword glow, violet shrine.

Every new card must feel like it belongs to the same deck as those three cards.

## Non-Negotiable Rules

1. Full-bleed rectangular scene art, normalised to `800 x 500`.
2. No floating badge, token, isolated emblem, medallion, or icon composition.
3. Foreground subject/action and background must separate at thumbnail distance.
4. Background must support the theme but stay quieter than the main action.
5. No text, labels, watermark, card frame, cost icon, nameplate, or UI chrome.
6. No black-on-black subject details.
7. No busy micro-pane mosaics competing with the subject.
8. The card must read by gameplay family before it reads as decoration.
9. Do not accept an over-dark source only because it looks dramatic; the main
   action must still separate from the background at `120 x 75`.
10. Fix dark cards at generation time by adding scene light and visible
    stained-glass midtones. Do not flatten shadows with a grey lift.
11. Do not use local visual post-processing to rescue card art. Allowed local
    handling is limited to source archiving, exact `800 x 500` normalisation,
    metadata stripping, gallery copy, and contact-sheet generation.

## Batch Discipline

Generate in small batches. Default batch size is 3 cards.

For every batch:

1. Re-read the three approved anchor images.
2. Generate one source per card with the recorded prompt.
3. Copy the source into the card-specific scratch folder.
4. Normalise to `800 x 500`.
5. Build a contact sheet with:
   - the three approved anchors
   - the new batch at 240 x 150
   - the new batch at 120 x 75
6. Reject any image where foreground and background merge at the small size.
7. Reject any image that looks like a generic fantasy illustration rather than
   a Spirebound stained-glass card scene.

No batch may be promoted only because the source image is attractive. It must
pass the in-game card-art read.

## Review Language

Use one of these decisions:

- `approved` - ready in readable-baseline.
- `revise` - promising, but needs one targeted regeneration.
- `reject` - wrong composition, wrong subject, or drifted away from anchors.

Every `revise` or `reject` needs a short reason.

## Common Drift Risks

- Hero portrait drift: the card becomes a character portrait instead of an
  action/state scene.
- Badge drift: the card becomes a centred emblem or logo.
- Background drift: the chapel/window becomes more important than the gameplay
  action.
- Detail drift: micro-panes, jewellery, ornaments, or glowing debris defeat the
  thumbnail read.
- Rarity drift: common cards become rare-level ceremonies.
- Palette drift: attacks all become the same red slash; skills all become the
  same blue shield; powers all become the same violet halo.
- Value drift: a source becomes too black overall, hiding the foreground action
  and making the card unreadable in the gallery strip.
- Contrast drift: an attempted brightness fix reduces the image to a grey wash
  instead of increasing luminous subject light.
- Post-process drift: local brightness, contrast, gamma, saturation, or colour
  grading creates a separate style from the generated source. Regenerate
  instead.
