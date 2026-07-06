# Prop Art Production Ledger - 2026-07-06

Status: approved and registered to `src/assets-readable-baseline/props/`.

Mode: built-in `image_gen`, then local chroma-key removal with
`$CODEX_HOME/skills/.system/imagegen/scripts/remove_chroma_key.py`.

Instruction source: `docs/prop-art-bible.md`.

## Outputs

| Prop | Source | Raw alpha | Final |
|---|---|---|---|
| `campfire` | `sources/campfire-source.png` | `final/campfire-alpha-raw.png` | `final/campfire.png` |
| `chest` | `sources/chest-source.png` | `final/chest-alpha-raw.png` | `final/chest.png` |
| `chest-open` | `sources/chest-open-source.png` | `final/chest-open-alpha-raw.png` | `final/chest-open.png` |
| `merchant` | `sources/merchant-source.png` | `final/merchant-alpha-raw.png` | `final/merchant.png` |

Review sheets:

- `contact-sheet.png`
- `thumb-128-contact-sheet.png`
- `latest-candidates-contact.png`

## Validation

| Prop | Size | Corner alpha | Note |
|---|---:|---|---|
| `campfire` | 512 x 512 | `[0, 0, 0, 0]` | Strong rest-site narrative; readable at 128 px. |
| `chest` | 512 x 409 | `[0, 0, 0, 0]` | Clear closed-state treasure read. |
| `chest-open` | 512 x 409 | `[0, 0, 0, 0]` | Clear reward reveal; review against `chest` for pair alignment before promotion. |
| `merchant` | 512 x 512 | `[0, 0, 0, 0]` | Strong shop read; dense but still legible in thumbnail review. |

## Candidate Mapping

The selected sources came from the latest generated-image candidate sheet:

- candidate `6` -> `campfire`
- candidate `4` -> `chest`
- candidate `2` -> `chest-open`
- candidate `0` -> `merchant`

Discarded candidates were not copied into the final folder.

## Prompts

The production prompts are recorded verbatim in `docs/prop-art-bible.md`.
