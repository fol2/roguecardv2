# Card Art Production Pipeline

This folder tracks the 60-card production pass and the remaining card-art
batches after the approved baseline milestones.

Approved reference cards are now the nine-card baseline set documented in
[`card-art-baselines.md`](./card-art-baselines.md):

- `strike`, `defend`, and `empower` - first approved composition anchors.
- `eclipseSlash`, `chisel`, and `firstSpark` - starter identity extensions.
- `ashBite`, `smother`, and `twinFangs` - source-only lighting/readability
  correction anchors.

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
- `card-art-baselines.md` - the nine approved card-art baseline references.
- `subagent-workflow.md` - the required handoff shape for future subagent
  story/design/prompt work.

The temporary `nano-banana-pro` and `gpt-nano-pass` gallery sets were
superseded on 2026-07-06. The accepted GPT -> Nano Pass card art is now the
live card set; prompt ledgers and rejected/superseded evidence remain in
`scratch/style-tests/`.

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

Before adding a card to `src/assets/cards/`:

1. Confirm the spec follows `docs/card-art-bible.md`.
2. Compare the card against the nine approved baselines in
   [`card-art-baselines.md`](./card-art-baselines.md).
3. Confirm the card passes the anti-drift rules in
   [`drift-control.md`](./drift-control.md).
4. Generate with built-in Image Gen.
5. Copy the source into a card-specific scratch folder.
6. Review at large size and thumbnail size.
7. Put the approved generated source bytes directly in
   `src/assets/cards/<id>.jpg`.
8. Record the prompt, source output path, gallery path, hashes, and review
   notes.
9. Run `npm run build`.
10. Check the live gallery (`?gallery=1`).

No bulk promotion without visual review. If a card is weak, regenerate that
card before moving on.
