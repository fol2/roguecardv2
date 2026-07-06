# Spirebound Title Text - 2026-07-06

## Workflow

Built-in Codex image generation -> chroma-key alpha cutout -> trim -> 1536 px runtime copy.

No Nano Banana pass was used for the accepted title-text asset because the generated text source already had the correct single-word read and clean stained-glass treatment.

## Built-In GPT Image Source

Generated image id:
`ig_08411381ffbb05e7016a4b00c94b1c81919bbc105e35837d59.png`

Original generated source path:
`/Users/jamesto/.codex/generated_images/019f34f6-072c-7a40-ac8b-7a64a7711f03/ig_08411381ffbb05e7016a4b00c94b1c81919bbc105e35837d59.png`

Workspace source copy:
`scratch/style-tests/title-text-20260706/source/01-gpt-image-2-source.png`

Exact prompt:

```text
Use case: logo-brand
Asset type: Spirebound text-only title logotype alpha-ready source
Primary request: Create a text-only fantasy game title image with exactly one word, verbatim: "SPIREBOUND".
Text (verbatim): "SPIREBOUND"
Style/medium: serious cartoon-gothic stained-glass inscription, thick black lead outline, gold and warm amber glass fill with subtle blue-violet edge glints, matte painterly glass texture, solemn dark-fantasy deckbuilder title treatment.
Composition/framing: one centred word only, horizontal title layout, large readable capital serif letters, generous padding around the word, no background artwork, no characters, no tower, no icons, no subtitle.
Scene/backdrop: perfectly flat solid #ff00ff chroma-key background only. The background must be one uniform colour with no gradients, texture, lighting, shadows, floor plane, reflection, or vignette.
Constraints: the only visible text is exactly "SPIREBOUND"; no other letters, no punctuation, no subtitle, no labels, no watermark, no UI chrome, no frame, no crest, no sword, no lantern, no character, no scenery, do not use #ff00ff anywhere in the title letters.
```

## Alpha And Runtime Copy

Raw alpha:
`scratch/style-tests/title-text-20260706/final/02-title-alpha-raw.png`

Trimmed full-size alpha:
`scratch/style-tests/title-text-20260706/final/spirebound-title-text.png`

1536 px final:
`scratch/style-tests/title-text-20260706/final/spirebound-title-text-1536.png`

Readable-baseline gallery copy:
`src/assets-readable-baseline/title/banner.png`

Gallery URL:
`http://localhost:5174/?gallery=1&set=readable-baseline`

Review previews:

- `scratch/style-tests/title-text-20260706/review/spirebound-title-preview-dark.png`
- `scratch/style-tests/title-text-20260706/review/spirebound-title-preview-light.png`

Validation:

- Final readable-baseline copy is `1536 x 396` RGBA.
- All four alpha corners are transparent.
- Visible text reads exactly `SPIREBOUND`.
- No subtitle, character, tower, icon, watermark, frame, or UI chrome.
