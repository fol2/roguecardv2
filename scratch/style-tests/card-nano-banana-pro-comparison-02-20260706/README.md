# Nano Banana Pro Card Comparison 02

This scratch set contains the second five Nano Banana Pro direct text-to-image
card-art candidates for comparison against the current live GPT-generated card
assets.

Cards generated:

- `ashBite` / Ashbite
- `smother` / Smother
- `twinFangs` / Twin Shards
- `quickSlash` / Flicker
- `heavyBlow` / Quarry Maul

Workflow:

1. Reused the stored card-art prompts from the existing prompt ledgers.
2. Added the Nano Banana Pro adapter used for the first comparison set, with
   explicit no-matte/no-inset controls.
3. Generated with
   `/Users/jamesto/.codex/skills/nanobanana/scripts/nanobanana.py`.
4. Copied accepted source bytes directly to `src/assets-nano-banana/cards/`.
5. Reviewed through `?gallery=1&set=nano-banana`.

No accepted source image was locally post-processed. The contact sheet
`live-vs-nano-banana-pro-contact-02.jpg` is review-only; it is not a source
asset.

Rejected evidence:

- `source/smother-nanobanana-pro-v1-rejected-inset-frame.jpg` - rejected
  because it produced an inset image with a grey matte.
- `source/smother-gallery-v1-rejected-inset-frame.jpg` - byte-for-byte duplicate
  of the same rejected v1 after the temporary gallery copy was moved back to
  scratch.

Accepted source-to-gallery byte checks:

```text
source/ashBite-nanobanana-pro.jpg == src/assets-nano-banana/cards/ashBite.jpg
source/smother-nanobanana-pro-v2.jpg == src/assets-nano-banana/cards/smother.jpg
source/twinFangs-nanobanana-pro.jpg == src/assets-nano-banana/cards/twinFangs.jpg
source/quickSlash-nanobanana-pro.jpg == src/assets-nano-banana/cards/quickSlash.jpg
source/heavyBlow-nanobanana-pro.jpg == src/assets-nano-banana/cards/heavyBlow.jpg
```

See `prompt-ledger.md` for exact adapter text, source prompt records, output
paths, and SHA-256 hashes.
