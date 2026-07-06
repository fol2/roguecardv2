# GPT -> Nano Pass Card Comparison 02

This scratch set contains the second five `gpt-image-2 -> Nano Banana Pro`
image-to-image card-art candidates. The set was regenerated with the short
Nano Banana pass prompt plus style frame only, replacing the earlier long
adapter/identity-check pass for these five cards.

Cards generated:

- `ashBite` / Ashbite
- `smother` / Smother
- `twinFangs` / Twin Shards
- `quickSlash` / Flicker
- `heavyBlow` / Quarry Maul

Workflow:

1. Used the existing live GPT card art from `src/assets/cards/<id>.png` as the
   Nano Banana Pro input image.
2. Used the short Nano Banana pass prompt plus style frame only; no stored GPT
   source prompt was appended.
3. Generated with
   `/Users/jamesto/.codex/skills/nanobanana/scripts/nanobanana.py`.
4. Copied accepted source bytes directly to `src/assets-gpt-nano-pass/cards/`.
5. Reviewed through `?gallery=1&set=gpt-nano-pass`.

No accepted source image was locally post-processed. The contact sheet
`live-vs-gpt-nano-pass-contact-02.jpg` is review-only; it is not a source asset.

Accepted source-to-gallery byte checks:

```text
source/ashBite-gpt-nano-pass.jpg == src/assets-gpt-nano-pass/cards/ashBite.jpg
source/smother-gpt-nano-pass.jpg == src/assets-gpt-nano-pass/cards/smother.jpg
source/twinFangs-gpt-nano-pass.jpg == src/assets-gpt-nano-pass/cards/twinFangs.jpg
source/quickSlash-gpt-nano-pass.jpg == src/assets-gpt-nano-pass/cards/quickSlash.jpg
source/heavyBlow-gpt-nano-pass.jpg == src/assets-gpt-nano-pass/cards/heavyBlow.jpg
```

See `prompt-ledger.md` for exact prompt text, input paths, output paths, and
SHA-256 hashes.
