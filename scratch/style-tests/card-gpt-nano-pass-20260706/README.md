# GPT -> Nano Pass Card Comparison 01

This scratch set contains the first five `gpt-image-2 -> Nano Banana Pro`
image-to-image card-art candidates. The set was regenerated with the short
Nano Banana pass prompt plus style frame only, replacing the earlier long
adapter/identity-check pass for these five cards.

Cards generated:

- `strike` / Edge
- `defend` / Ward
- `eclipseSlash` / Eclipse Slash
- `chisel` / Chisel
- `firstSpark` / First Spark

Workflow:

1. Used the existing live GPT card art from `src/assets/cards/<id>.png` as the
   Nano Banana Pro input image.
2. Used the short Nano Banana pass prompt plus style frame only; no stored GPT
   source prompt was appended.
3. Generated with
   `/Users/jamesto/.codex/skills/nanobanana/scripts/nanobanana.py`.
4. Copied accepted source bytes directly to `src/assets-gpt-nano-pass/cards/`.
5. Registered the comparison set as `?gallery=1&set=gpt-nano-pass`.

No accepted source image was locally post-processed. The contact sheet
`live-vs-gpt-nano-pass-contact.jpg` is review-only; it is not a source asset.

Accepted source-to-gallery byte checks:

```text
source/strike-gpt-nano-pass.jpg == src/assets-gpt-nano-pass/cards/strike.jpg
source/defend-gpt-nano-pass.jpg == src/assets-gpt-nano-pass/cards/defend.jpg
source/eclipseSlash-gpt-nano-pass.jpg == src/assets-gpt-nano-pass/cards/eclipseSlash.jpg
source/chisel-gpt-nano-pass.jpg == src/assets-gpt-nano-pass/cards/chisel.jpg
source/firstSpark-gpt-nano-pass.jpg == src/assets-gpt-nano-pass/cards/firstSpark.jpg
```

See `prompt-ledger.md` for exact prompt text, input paths, output paths, and
SHA-256 hashes.
