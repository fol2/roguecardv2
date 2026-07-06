# Nano Banana Pro Card Comparison 01

This scratch set contains the first five Nano Banana Pro direct text-to-image
card-art candidates for comparison against the current live GPT-generated card
assets.

Cards generated:

- `strike` / Edge
- `defend` / Ward
- `eclipseSlash` / Eclipse Slash
- `chisel` / Chisel
- `firstSpark` / First Spark

Workflow:

1. Reused the stored card-art prompts from the existing prompt ledgers.
2. Added a Nano Banana Pro adapter that preserves the original art direction but
   switches the canvas to the closest supported wide ratio, `3:2`.
3. Generated with
   `/Users/jamesto/.codex/skills/nanobanana/scripts/nanobanana.py`.
4. Copied accepted source bytes directly to `src/assets-nano-banana/cards/`.
5. Registered the comparison set as `?gallery=1&set=nano-banana`.

No accepted source image was locally post-processed. The contact sheet
`live-vs-nano-banana-pro-contact.jpg` is review-only; it is not a source asset.

Rejected evidence:

- `source/chisel-nanobanana-pro-v1-rejected-inset-frame.jpg` - rejected because
  it produced an inset card-like image with a grey matte, not full-bleed card
  art.
- `source/chisel-gallery-v1-rejected-inset-frame.jpg` - byte-for-byte duplicate
  of the same rejected v1 asset after the temporary gallery copy was moved back
  to scratch.

Accepted source-to-gallery byte checks:

```text
source/strike-nanobanana-pro.jpg == src/assets-nano-banana/cards/strike.jpg
source/defend-nanobanana-pro.jpg == src/assets-nano-banana/cards/defend.jpg
source/eclipseSlash-nanobanana-pro.jpg == src/assets-nano-banana/cards/eclipseSlash.jpg
source/chisel-nanobanana-pro-v2.jpg == src/assets-nano-banana/cards/chisel.jpg
source/firstSpark-nanobanana-pro.jpg == src/assets-nano-banana/cards/firstSpark.jpg
```

See `prompt-ledger.md` for exact prompts, source paths, gallery paths, and
SHA-256 hashes.
