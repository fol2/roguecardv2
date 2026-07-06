# Card Art Drift Control

This file is the production gate for the remaining card arts.

The approved baselines are:

- `strike` - attack action: large foreground blade, quieter red chapel window.
- `defend` - skill defence: figure, lantern, blue ward, muted chapel background.
- `empower` - power state: kneeling figure, chest fire, sword glow, violet shrine.
- `eclipseSlash` - attack variant: red blade, black eclipse disc, pale crack.
- `chisel` - facet action: hand, tool, bright target pane, one missing chip.
- `firstSpark` - tempo/kindle: hand, amber spark, rising card pane.
- `ashBite` - Smolder attack: red bite, green-orange smoke, visible target pane.
- `smother` - Ward plus Smolder: blue ward hand first, coal smoke second.
- `twinFangs` - multi-hit: two separated crimson fangs and two impact notches.

Every new card must feel like it belongs to the same deck as those nine cards.

## Non-Negotiable Rules

1. Full-bleed rectangular scene art from the approved generated source.
2. No floating badge, token, isolated emblem, medallion, or icon composition.
3. Foreground subject/action and background must separate at thumbnail distance.
4. Background must support the theme but stay quieter than the main action.
5. No text, labels, watermark, card frame, cost icon, nameplate, or UI chrome.
6. No black-on-black subject details.
7. No busy micro-pane mosaics competing with the subject.
8. The card must read by gameplay family before it reads as decoration.
9. Do not accept an over-dark source only because it looks dramatic; the main
   action must still separate from the background at `120 x 75`.
10. Fix dark cards at generation time by adding scene light, theme colour, and
    visible stained-glass midtones to the prompt. Do not flatten shadows with a
    grey lift.
11. Do not use local visual post-processing to rescue or standardise card art.
    The gallery card PNG must be a byte-for-byte copy of the approved generated
    source. Contact sheets may resize review copies only.

## Batch Discipline

Generate in small batches. Default batch size is 3 cards.

For every batch:

1. Re-read the nine approved baseline images.
2. Generate one source per card with the recorded prompt.
3. Copy the source into the card-specific scratch folder.
4. Copy the approved source bytes directly into
   `src/assets-readable-baseline/cards/<id>.png`.
5. Record a source/gallery hash check proving they match.
6. Build a contact sheet with:
   - the nine approved baselines, or at minimum the three nearest baselines
   - the new batch at 240 x 150
   - the new batch at 120 x 75
7. Reject any image where foreground and background merge at the small size.
8. Reject any image that looks like a generic fantasy illustration rather than
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
  grading, crop, resize, or metadata stripping creates a separate artefact from
  the generated source. Regenerate instead.
