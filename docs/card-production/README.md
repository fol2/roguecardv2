# Card Art Production Pipeline

This folder tracks the 57-card production pass after the approved first-card
milestone.

Approved reference cards:

- `strike` / Edge: foreground blade and arm separate clearly from a quieter red
  chapel-window background.
- `defend` / Ward: dark figure, lantern, blue ward wall, and muted chapel
  background read as distinct layers.
- `empower` / Inner Blaze: kneeling figure, chest fire, sword glow, and violet
  shrine background separate at card-art size.

Production rule: every remaining card must be full-bleed rectangular scene art
from the approved Image Gen source, with a foreground subject/action plus
themed background. Badge, token, and isolated emblem compositions are rejected
unless a card specifically needs a junk-token read.

Do not locally post-process approved card art. If the generated image is too
dark, too low-contrast, badly framed, or the wrong ratio, regenerate it with a
better prompt instead of applying brightness, contrast, gamma, saturation,
crop, resize, or metadata-stripping fixes.

## Work Lanes

- `attack-card-specs.md` - remaining attack cards.
- `skill-card-specs.md` - remaining skill cards.
- `power-special-card-specs.md` - remaining power, status, and curse cards.

## Per-Card Required Record

Each card must have:

- internal id and display name
- type, rarity, and target
- story moment
- card-art design notes
- foreground/midground/background separation note
- final Image Gen prompt
- generated source path
- final gallery asset path
- review decision

Approved generated cards are tracked in
[`generated-card-ledger.md`](./generated-card-ledger.md).

## Generation Gate

Before adding a card to `src/assets-readable-baseline/cards/`:

1. Confirm the spec follows `docs/card-art-bible.md`.
2. Confirm the card passes the anti-drift rules in
   [`drift-control.md`](./drift-control.md).
3. Generate with built-in Image Gen.
4. Copy the source into a card-specific scratch folder.
5. Review at large size and thumbnail size.
6. Put the approved generated source bytes directly in
   `src/assets-readable-baseline/cards/<id>.png`.
7. Record the prompt, source output path, gallery path, hashes, and review
   notes.
8. Run `npm run build`.
9. Check the readable-baseline gallery.

No bulk promotion without visual review. If a card is weak, regenerate that
card before moving on.
