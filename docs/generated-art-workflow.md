# Generated Art Workflow

This is the current Spirebound raster art workflow for style tests and future
`src/assets/` replacements.

Validated workflow test:
`scratch/workflow-tests/20260705-gpt-image-2-nanobanana-pro-alpha/`

Background-lock prompt test:
`scratch/workflow-tests/20260705-gpt-image-2-nanobanana-pro-alpha-bglock/`

Current baseline style test:
`scratch/style-tests/design-council-20260705-readable-style/`

Current event full-scene test:
`scratch/style-tests/event-story-shrine-clean-20260706/`

## Pipeline

```text
gpt-image-2 -> Nano Banana Pro -> alpha cutout -> outer rim cleanup -> gallery review
```

Rules:

- Step 1 uses Codex's built-in image generation directly. Do not shell out to
  `codex exec`, `tools/imagegen.sh`, or `tools/genasset.sh`.
- Do not fall back to `gpt-image-1.5`.
- Step 2 uses Nano Banana Pro through
  `/Users/jamesto/.codex/skills/nanobanana/scripts/nanobanana.py`.
- The Nano Banana prompt is fixed exactly as written below.
- Event art is the current exception to the alpha/cutout stages. Events use the
  same `gpt-image-2 -> Nano Banana Pro` ordering, but keep their narrative
  background and do not request alpha, chroma-key, cutout, or transparent
  background control unless the event workflow is deliberately revised.
- Every production event must pass through Nano Banana Pro before gallery
  registration. The GPT source is evidence and fallback material, not the final
  event candidate by default.
- Every generated asset attempt must record the exact built-in image prompt,
  generated image id, source path, selected alpha path, any rim-cleaned path,
  and review outcome in the scratch set's `prompt-ledger.md` before another
  variation is generated.
- Keep both alpha outputs for final art decisions: the Step 1 `gpt-image-2`
  source alpha after outer-rim cleanup and the Step 2 Nano Banana alpha. The
  council may select either per asset. The current readable baseline uses the
  Nano Banana version for Duskblade and the GPT-clean version for Ashwarden and
  the approved enemies.
- Final project-bound assets must be copied into the workspace. Do not leave a
  referenced asset only under `~/.codex/generated_images/`.

## Step 1: gpt-image-2 Source

Generate the first image with built-in `image_gen`.

The first image must be alpha-ready:

- single complete subject only
- clean full-body silhouette
- generous padding
- no ground plane
- no floor line
- no contact shadow
- no cast shadow
- no reflection
- no atmospheric haze touching the subject edge
- no frame, text, labels, watermark, or UI chrome
- perfectly flat single-colour background that does not appear in the subject

Default background for Spirebound alpha preparation is solid `#ff00ff`, because
many subjects use green, cyan, blue, amber, or black. If the subject itself needs
magenta, choose another flat key colour and write it into the job note before
generating.

Prompt shape:

```text
Use case: stylized-concept
Asset type: Spirebound <hero|enemy|card|prop|event> alpha-ready source
Primary request: <subject>
Readability priority: silhouette first, pose second, face/weapon/core symbol
third, colour fourth, texture last. The subject must still be recognisable as a
black shadow with all internal details removed.
Enemy-vs-hero read, for enemies only: humanoid monsters such as goblin, troll,
orc, cultist, or imp silhouettes are allowed, but they must read as enemies:
crooked, low, feral, asymmetrical, or grubby. Avoid heroic upright stance, noble
cloak, elegant armour, clean symmetry, knight/priest/warden silhouette, or
protagonist framing.
Style/medium: serious cartoon-gothic dark-fantasy game art; instantly readable
black silhouette first; one iconic primary shape, weapon, or pose; chunky
hand-inked outer contour; simplified exaggerated proportions; 3-5 large
stained-glass colour masses only, with very few thick lead dividers; matte
painterly brush texture; restrained cathedral motifs as broad shapes, not
filigree; thumbnail-readable at 128px; dramatic and grave; for enemies, allow
cute, funny, and interesting personality through proportions and expression
while keeping the threat readable; no lacework, no micro-panels, no complex
anatomy segmentation, no ornate armour noise, no glossy 3D render, no generic
fantasy.
Composition/framing: <category rule>; single complete subject; generous padding;
no cropped limbs; no action blur. For character sprites, keep enough clean
chroma-key margin that ears, weapons, smoke, horns, claws, tails, and silhouette
points do not feel out of frame.
Lighting/mood: sober gothic mood; single warm amber rim light defining the
silhouette; soft restrained inner glow limited to 1-2 focal panes such as face,
chest, weapon, or core symbol; high value contrast on the main read; no
scattered sparkles, no multi-source glow, no noisy bloom, no haze touching the
silhouette.
Scene/backdrop: perfectly flat solid #ff00ff chroma-key background only.
Constraints: no ground plane; no floor; no shadows; no reflections; no haze
touching the silhouette; no text; no labels; no watermark; do not use #ff00ff in
the subject.
```

## Step 2: Nano Banana Pro Clean-Up

Run Nano Banana with the Step 1 image as an input reference.

Current prompt under test:

```text
帮我将这张图片重绘和清晰化，让他细节更丰富，同时去掉原图中杂乱不必要的细节。重要：背景不是艺术内容，必须逐像素保持为纯 #ff00ff chroma-key 背景；不要把背景改成白色、灰色、粉色渐变、黑色或任何场景；背景必须完全平整、单一颜色、无渐变、无纹理、无光照、无光晕、无阴影。请严格延续第一步的 alpha-ready 要求：主体完整、无裁切、无地面、无地线、无接触阴影、无投影、无反射、无贴边雾气、无文字、无标签、无水印；不要在主体中使用 #ff00ff。
```

This prompt keeps the original clean-up request and explicitly carries forward
the Step 1 alpha-ready constraints. The 2026-07-05 background-lock test showed
Nano Banana Pro still did not preserve pure `#ff00ff`; it produced a plain white
background on the stricter retry. Treat `#ff00ff` preservation as desired but
not guaranteed.

For full-background event art, use the same clean-up intent without alpha
controls. The prompt should explicitly preserve the 3:2 event scene and its
narrative background, strengthen the main subject, reduce fragile glass shards
and tiny ground detail, and keep the background lower contrast than the focal
object or figure.

Current event clean-up prompt shape:

```text
帮我将这张图片重绘和清晰化，让它细节更丰富，同时去掉原图中杂乱不必要的细节。重要：这次不做 alpha、chroma-key、cutout 或透明背景控制；请保留完整的 3:2 Spirebound event scene 和原图的叙事背景。保留 <main foreground subject> 作为清晰前景主体；保留 <one simple midground choice prop>；背景保留 <two or three broad place cues>. 整体要像严肃 cartoon-gothic stained-glass game art：主主体有更粗的黑色外轮廓、更大的形块、更少碎裂玻璃、更少地面碎片，128px 仍然能读。背景可以有深度和叙事，但对比度和线条数量必须低于主体。保留 <event palette>. 不要加入人物、文字、UI、明显奖励堆、额外供品、玻璃碎片、地板图案、符文、复杂建筑或阻挡主体的前景物。
```

Command shape:

```bash
python3 /Users/jamesto/.codex/skills/nanobanana/scripts/nanobanana.py generate \
  --prompt "帮我将这张图片重绘和清晰化，让他细节更丰富，同时去掉原图中杂乱不必要的细节。重要：背景不是艺术内容，必须逐像素保持为纯 #ff00ff chroma-key 背景；不要把背景改成白色、灰色、粉色渐变、黑色或任何场景；背景必须完全平整、单一颜色、无渐变、无纹理、无光照、无光晕、无阴影。请严格延续第一步的 alpha-ready 要求：主体完整、无裁切、无地面、无地线、无接触阴影、无投影、无反射、无贴边雾气、无文字、无标签、无水印；不要在主体中使用 #ff00ff。" \
  --input-image <step-1-source.png> \
  --model nanobanana-pro \
  --ratio 4:5 \
  --size 1K \
  --output <step-2-cleaned.jpg>
```

`.env` in the repo supplies `GEMINI_API_KEY`, `GEMINI_BASE_URL`, and default
Nano Banana settings. `.env` is intentionally ignored by git.

## Step 3: Alpha

Convert both the Step 1 source and the Nano Banana result to transparent
background locally.

If Nano Banana preserves the flat chroma-key backdrop, use the default helper:

```bash
python3 "${CODEX_HOME:-$HOME/.codex}/skills/.system/imagegen/scripts/remove_chroma_key.py" \
  --input <step-2-cleaned.jpg> \
  --out <final-alpha.png> \
  --auto-key border \
  --soft-matte \
  --transparent-threshold 12 \
  --opaque-threshold 220 \
  --despill
```

If a thin key fringe remains, retry once with `--edge-contract 1`.

If the corners retain faint alpha from JPEG/key compression, retry once with
`--transparent-threshold 24` and re-check that all four corner alpha values are
`0`.

If Nano Banana changes the backdrop to black or another non-key colour, do not
globally key that colour out. Use a border-connected background flood fill so
dark internal lead lines, face voids, cloaks, and glass seams stay opaque. The
2026-07-05 workflow test kept the naive black-key result as evidence and used a
border-connected alpha as the accepted `03-alpha.png`.

If Nano Banana changes the backdrop to white, also use border-connected removal
instead of global white keying so internal white glass highlights stay intact.

After border-connected removal, run an enclosed-background cleanup pass. This
catches holes that are not connected to the image border, such as the empty
space inside a held ring or handle. The pass should remove sizeable enclosed
components matching the background colour, while leaving tiny bright glass
highlights opaque. In the 2026-07-05 background-lock test, the held ring hole
was an interior near-white component of 741 pixels; removing only interior
components above the review threshold fixed the ring without deleting small
armour highlights.

Validation:

- output is PNG or WebP with alpha
- all four corners are transparent
- no visible key-colour fringe
- obvious enclosed background holes, especially rings/handles, are transparent
- subject remains complete and uncropped
- silhouette remains readable at gallery size
- no ground, shadow, text, labels, watermark, or UI chrome

## Step 4: Outer Rim Cleanup

For gpt-image-2 source-alpha outputs, run the warm outer-rim cleanup before
putting the asset into a review set. gpt-image-2 often adds a thin amber/yellow
outline around the whole alpha silhouette. That outline helps the first read, but
it looks like an unwanted sticker stroke once the asset is in the game.

Use `tools/strip-alpha-rim.py` on the alpha PNG:

```bash
python3 tools/strip-alpha-rim.py \
  --input <source-alpha.png> \
  --out <source-alpha-no-yellow-outline.png> \
  --radius 6 \
  --mode darken
```

The script only checks the alpha edge band and only mutes warm yellow/orange
pixels there, so internal eyes, fire, sap, lanterns, and weapon glow stay intact.
The default `darken` mode changes the rim to the normal dark lead colour instead
of shrinking the silhouette. Use `--mode transparent` only for a true trim pass
when a dark lead edge is still visibly too thick.

Additional validation:

- exterior yellow/amber sticker outline is gone or muted to dark lead
- internal warm focal points remain unchanged
- all four corners remain transparent
- silhouette still reads cleanly at gallery size

## Review Gate

Put workflow experiments under `scratch/style-tests/` until accepted.

Park accepted-but-incomplete sets under a same-shape inactive folder such as
`src/assets-readable-baseline/<category>/<id>.png`. Normal gameplay selects the
`live` set from `src/assets`, while the dev gallery can inspect registered
parked sets. When the whole set has passed review, activate it with a folder
swap:

```bash
mv src/assets src/assets-legacy
mv src/assets-readable-baseline src/assets
npm run build
```

Only promote or activate assets whose `<id>` matches the internal key in
`src/data.js`. After activation, check `http://localhost:5174/?gallery=1` or
the active dev-server gallery URL.

For title art, keep the runtime folders distinct: `title/title.png` is the
transparent `SPIREBOUND` wordmark, and `title-background/background.png` is the
optional title-screen background.

During an active council pass, the gallery can inspect a temporary parked set.
Add the set to `ASSET_SETS` in `src/art.js`, then open:

```text
http://localhost:5174/?gallery=1&set=readable-baseline
```

After approval or rejection, remove temporary runtime review folders and their
`ASSET_SETS` entries. The steady-state gallery should expose only stable
comparison sets such as `live` and `legacy`; keep prompts, generated ids, alpha
outputs, and comparison contact sheets in scratch.

## Workflow Test Log

`scratch/workflow-tests/20260705-gpt-image-2-nanobanana-pro-alpha/` contains:

- `01-gpt-image-2-source.png` — built-in `image_gen` gpt-image-2 source with an
  alpha-ready flat `#ff00ff` backdrop.
- `02-nanobanana-pro-cleaned.jpg` — Nano Banana Pro result from the exact fixed
  prompt above. The script reported `Model: gemini-3-pro-image`.
- `03-alpha.png` — accepted transparent PNG from border-connected background
  removal.
- `03-alpha-auto-key-black.png` — rejected evidence: naive black auto-key ate
  too much dark subject detail.
- `03-alpha-preview-dark.png` and `03-alpha-preview-light.png` — review previews.

Validation from the test:

- `01-gpt-image-2-source-alpha.png`: RGBA, transparent corners, 977543
  transparent / 32635 partial / 562686 opaque pixels.
- `03-alpha.png`: RGBA, transparent corners, 645608 transparent / 23837 partial
  / 399611 opaque pixels.
- Limitation: the exact Nano Banana prompt can replace the clean chroma key with
  a dark backdrop and lantern glow. Treat that as a known alpha-stage problem to
  solve with connected-background removal, not as permission to append extra
  prompt constraints to Step 2.

`scratch/workflow-tests/20260705-gpt-image-2-nanobanana-pro-alpha-bglock/`
contains the background-lock retry:

- `01-gpt-image-2-source.png` — new built-in `image_gen` gpt-image-2 source
  with an alpha-ready flat `#ff00ff` backdrop.
- `02-nanobanana-pro-bglock.jpg` — first improved prompt attempt. Result:
  grey/white background with pink gradient, not `#ff00ff`.
- `02b-nanobanana-pro-bglock-strict.jpg` — stricter prompt attempt. Result:
  plain white background, not `#ff00ff`.
- `01-gpt-image-2-source-alpha.png` — Step 1 alpha output, kept as a final
  decision candidate beside the Nano Banana alpha.
- `03-alpha.png` — accepted Nano Banana transparent PNG from border-connected
  near-white background removal plus enclosed-hole cleanup.
- `03-alpha-preview-dark.png`, `03-alpha-preview-magenta.png`, and
  `03-alpha-preview-light.png` — review previews.

Validation from the background-lock test:

- `02b-nanobanana-pro-bglock-strict.jpg`: corners were white/off-white, not
  magenta; border sample had 0 / 210 magenta-like pixels.
- `01-gpt-image-2-source-alpha.png`: RGBA, transparent corners, 959829
  transparent / 32658 partial / 580377 opaque pixels.
- `03-alpha.png`: RGBA, transparent corners, 603801 transparent / 27005 partial
  / 438250 opaque pixels.
- The held lantern ring hole was fixed by enclosed-hole cleanup after
  border-connected background removal.
- Conclusion: prompt-only `#ff00ff` locking is not reliable for Nano Banana Pro.
  The stricter prompt can still improve alpha work by producing a plain light
  background.

`scratch/style-tests/design-council-20260705-readable-style/` contains the
current baseline readability test:

- hero subject: The Duskblade, facing slightly right with a crescent blade and
  lantern-core read.
- enemy subject: Duskfang, facing slightly left with a crescent maw and
  blade-hackle silhouette.
- `prompt-used.md` — exact baseline prompt used for both subjects.
- `review.html` — colour and black-silhouette comparison at review size.
- `01-gpt-image-2-source-alpha.png` and `03-alpha.png` for each subject — keep
  both candidates for art direction decisions because the Step 1 source can
  have the cleaner silhouette while Nano Banana Pro can carry stronger polish.
