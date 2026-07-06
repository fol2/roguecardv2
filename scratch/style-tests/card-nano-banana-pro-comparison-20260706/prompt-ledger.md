# Prompt Ledger - Nano Banana Pro Card Comparison 01

Generated on 2026-07-06 as a separate comparison set. These files do not
replace the live card assets.

Mode: Nano Banana Pro direct text-to-image via
`/Users/jamesto/.codex/skills/nanobanana/scripts/nanobanana.py`.

Model settings: `--model nanobanana-pro --ratio 3:2 --size 2K`. Nano Banana Pro
does not support the exact 16:10 card ratio used by the original GPT prompts,
so this comparison uses the closest supported wide ratio without local crop or
resize.

No post-processing rule: final gallery files under
`src/assets-nano-banana/cards/` are byte-for-byte copies of the accepted Nano
Banana Pro source outputs. No brightness, contrast, colour, crop, resize, format
conversion, or metadata stripping was applied to those final files. The contact
sheet in this folder is review-only and is not a source asset.

First-five selection: gallery/data order, `strike`, `defend`, `eclipseSlash`,
`chisel`, `firstSpark`.

Rejected evidence: `chisel` v1 is kept because Nano Banana Pro produced an
inset image with a grey matte instead of full-bleed card art. The accepted
`chisel` v2 only changes prompt wording to enforce full-bleed output.

## Output Summary

| Card | Source output | Gallery asset | Format | SHA-256 |
|---|---|---|---|---|
| `strike` / Edge | `source/strike-nanobanana-pro.jpg` | `src/assets-nano-banana/cards/strike.jpg` | 2528x1696 JPEG | `258ca87f86701af230e2a1c5526c501927d3fcbc6c6e8cab36ed97e09b1dba2b` |
| `defend` / Ward | `source/defend-nanobanana-pro.jpg` | `src/assets-nano-banana/cards/defend.jpg` | 2528x1696 JPEG | `9724762672e16fa520022e2bbdb1a1e94389116e16372def530dde7bc0f3fe3d` |
| `eclipseSlash` / Eclipse Slash | `source/eclipseSlash-nanobanana-pro.jpg` | `src/assets-nano-banana/cards/eclipseSlash.jpg` | 2528x1696 JPEG | `70378271ece8e20c82d9c09ffbdba6afcb3b4211d96fd3037e7a6ff21937578e` |
| `chisel` / Chisel | `source/chisel-nanobanana-pro-v2.jpg` | `src/assets-nano-banana/cards/chisel.jpg` | 2528x1696 JPEG | `d57923b162993b7a93fa1e12a58ebd3031435887ec2f2415fbeef4177dc20adf` |
| `firstSpark` / First Spark | `source/firstSpark-nanobanana-pro.jpg` | `src/assets-nano-banana/cards/firstSpark.jpg` | 2528x1696 JPEG | `e4e483f35812b88d0522f8d75c3f22ca525f7280a02ce6cd2d9d987c175030f1` |

Comparison sheet: `live-vs-nano-banana-pro-contact.jpg` (top row live, bottom
row Nano Banana Pro).

## `strike` / Edge

Source prompt record:
`scratch/style-tests/card-first-three-separation-readable-baseline-20260706/prompt-ledger.md`

Source output: `source/strike-nanobanana-pro.jpg`

Gallery asset: `src/assets-nano-banana/cards/strike.jpg`

SHA-256: `258ca87f86701af230e2a1c5526c501927d3fcbc6c6e8cab36ed97e09b1dba2b`

Final Nano Banana Pro prompt used:

```text
Nano Banana Pro direct comparison pass for Spirebound card art. Use the stored Image Gen prompt below as the source of truth for subject, story, gameplay read, style, palette, separation/readability, and constraints. Canvas override: Nano Banana Pro does not offer exact 16:10 or 800 x 500 output here, so generate a wide horizontal 3:2 full-bleed rectangular scene and ignore exact 16:10 / 800 x 500 pixel wording if it appears. Do not make a full card mockup, badge, icon, UI frame, text, label, watermark, transparent background, chroma-key, or cutout. No local post-processing will be used, so lighting, contrast, colour, foreground/background separation, and framing must be correct in the generated image itself.

Stored prompt:
Use case: stylized-concept
Asset type: Spirebound rectangular card art for `strike` / Edge, separation v2 readable-baseline candidate

Primary request:
Create a wide rectangular card-art illustration, not an icon and not a badge. This is a clearer next version of Edge: the foreground subject must separate strongly from the background even when viewed far away. Show one oversized dark Duskblade forearm and bright crimson blade in the foreground, cutting diagonally from lower-left to upper-right. The blade and arm should occupy about half the image height. Behind it, keep the cracked crimson chapel window as a simpler, lower-contrast background with only a few large panes.

Story moment:
The Duskblade steps into a ruined chapel and makes the first decisive cut. The blade is the subject; the red chapel window is the theme/background.

Separation/readability direction:
Foreground and background must be clearly separated. Use a strong dark subject silhouette, a bright amber rim along the blade, and a clean halo/negative-space gap around the blade so it does not blend into the red window. The background should be less detailed, darker at the edges, and quieter than the subject. At 64 px the viewer should read: dark arm, bright blade, red broken window.

Style/medium:
Serious cartoon-gothic stained-glass game art; chunky dark silhouettes; large readable jewel-glass shapes; thick leaded-glass dividers used sparingly; matte painterly glass texture; warm amber rim light; dramatic but bright enough to read at small card size.

Composition/framing:
Wide horizontal rectangle, about 16:10. Full-bleed rectangular background, no transparent background. Clear foreground/midground/background layering. No centred emblem, no isolated badge, no floating logo.

Palette:
Crimson red glass background, black lead, bright amber blade rim and impact flare, subtle cool blue shadow separating the arm from the red panes.

Constraints:
No text, no labels, no watermark, no UI chrome, no card border, no cost icon, no nameplate, no full card mockup, no decorative badge, no circular medallion, no plain icon, no photorealism, no anime card art, no tiny filigree, no black-on-black details, no busy background competing with the foreground subject.
```

## `defend` / Ward

Source prompt record:
`scratch/style-tests/card-first-three-separation-readable-baseline-20260706/prompt-ledger.md`

Source output: `source/defend-nanobanana-pro.jpg`

Gallery asset: `src/assets-nano-banana/cards/defend.jpg`

SHA-256: `9724762672e16fa520022e2bbdb1a1e94389116e16372def530dde7bc0f3fe3d`

Final Nano Banana Pro prompt used:

```text
Nano Banana Pro direct comparison pass for Spirebound card art. Use the stored Image Gen prompt below as the source of truth for subject, story, gameplay read, style, palette, separation/readability, and constraints. Canvas override: Nano Banana Pro does not offer exact 16:10 or 800 x 500 output here, so generate a wide horizontal 3:2 full-bleed rectangular scene and ignore exact 16:10 / 800 x 500 pixel wording if it appears. Do not make a full card mockup, badge, icon, UI frame, text, label, watermark, transparent background, chroma-key, or cutout. No local post-processing will be used, so lighting, contrast, colour, foreground/background separation, and framing must be correct in the generated image itself.

Stored prompt:
Use case: stylized-concept
Asset type: Spirebound rectangular card art for `defend` / Ward, separation v2 readable-baseline candidate

Primary request:
Create a wide rectangular card-art illustration, not an icon and not a badge. This is a clearer next version of Ward: foreground subject and background must be separated at thumbnail distance. Show the Duskblade as a larger dark silhouette in the lower-left foreground, arm raised with a small amber lantern. In front of the figure, a broad bright blue stained-glass ward wall opens like a shield. The ruined chapel arches in the background must be muted, darker, and less detailed so they do not compete with the ward.

Story moment:
Before the blow lands, the Duskblade raises the last lantern. Blue cathedral glass blooms outward and catches the attack.

Separation/readability direction:
Foreground and background must be clearly separated. Use a strong dark figure silhouette with amber rim light. Put a clean bright blue ward shape in the midground. Keep the background chapel low contrast and desaturated. Leave a visible value gap between the figure, ward, and background. At 64 px the viewer should read: dark figure with lantern, big blue ward, red incoming strike.

Style/medium:
Serious cartoon-gothic stained-glass game art; chunky dark silhouettes; large readable jewel-glass shapes; thick leaded-glass dividers used sparingly; matte painterly glass texture; warm amber lantern centre; dramatic but bright enough to read at small card size.

Composition/framing:
Wide horizontal rectangle, about 16:10. Full-bleed rectangular background, no transparent background. Foreground: larger Duskblade silhouette and amber lantern. Midground: simple bright blue ward wall occupying most of the frame. Background: quiet chapel arches, fewer panes, darker and softer. One red incoming crack line hits the ward from the upper-right. No centred shield emblem, no isolated badge, no floating logo.

Palette:
Bright sapphire blue and cyan ward panes, black figure silhouette, amber lantern/rim, muted blue-grey chapel, one clear red impact line.

Constraints:
No text, no labels, no watermark, no UI chrome, no card border, no cost icon, no nameplate, no full card mockup, no decorative badge, no circular medallion, no plain shield icon, no photorealism, no anime card art, no tiny filigree, no black-on-black details, no busy background competing with the foreground subject.
```

## `eclipseSlash` / Eclipse Slash

Source prompt record:
`scratch/style-tests/card-production-batch-01-20260706/prompt-ledger.md`

Source output: `source/eclipseSlash-nanobanana-pro.jpg`

Gallery asset: `src/assets-nano-banana/cards/eclipseSlash.jpg`

SHA-256: `70378271ece8e20c82d9c09ffbdba6afcb3b4211d96fd3037e7a6ff21937578e`

Final Nano Banana Pro prompt used:

```text
Nano Banana Pro direct comparison pass for Spirebound card art. Use the stored Image Gen prompt below as the source of truth for subject, story, gameplay read, style, palette, separation/readability, and constraints. Canvas override: Nano Banana Pro does not offer exact 16:10 or 800 x 500 output here, so generate a wide horizontal 3:2 full-bleed rectangular scene and ignore exact 16:10 / 800 x 500 pixel wording if it appears. Do not make a full card mockup, badge, icon, UI frame, text, label, watermark, transparent background, chroma-key, or cutout. No local post-processing will be used, so lighting, contrast, colour, foreground/background separation, and framing must be correct in the generated image itself.

Stored prompt:
Use case: stylized-concept
Asset type: Spirebound rectangular card art scene for `eclipseSlash` / Eclipse Slash
Primary request: Create a wide rectangular 800 x 500 card-art illustration, not an icon and not a badge. Show a large dark Duskblade forearm in the foreground driving a bright crimson blade diagonally across a black eclipse disc, scoring one pale crack through an enemy stained-glass pane.
Gameplay read: attack; show a sharp damage slash first, and Cracked glass second. The image must read clearly at 64 px in the in-game card art band.
Story moment: The Duskblade cuts through the dead moon reflected in chapel glass, leaving the enemy pane scored for the next blow.
Composition/framing: Wide horizontal rectangle, full-bleed illustrated background, no transparent background. Foreground blade and arm occupy about half the image height. Midground eclipse disc sits behind the blade. Background chapel arch is quiet and low detail.
Palette: Crimson blade and wound, black eclipse and lead, warm amber blade rim, muted violet-grey chapel, tiny pale crack highlight.
Separation/readability: Keep a clean halo around the blade so it does not merge with the eclipse. The background must be darker and softer than the foreground. At 64 px the viewer should read: red blade, black eclipse, pale crack.
Style/medium: Serious cartoon-gothic stained-glass game art; chunky dark silhouettes; large jewel-tone glass masses; thick lead dividers used sparingly; matte painterly glass texture; controlled inner glow only on the cut.
Constraints: No text, no labels, no watermark, no UI chrome, no card border, no cost icon, no nameplate, no full card mockup, no circular emblem, no badge, no plain icon, no transparent background, no chroma-key background, no photorealism, no anime card art, no busy filigree.
```

## `chisel` / Chisel

Source prompt record:
`scratch/style-tests/card-production-batch-01-20260706/prompt-ledger.md`

Source output: `source/chisel-nanobanana-pro-v2.jpg`

Gallery asset: `src/assets-nano-banana/cards/chisel.jpg`

SHA-256: `d57923b162993b7a93fa1e12a58ebd3031435887ec2f2415fbeef4177dc20adf`

Final Nano Banana Pro prompt used:

```text
Nano Banana Pro direct comparison pass for Spirebound card art. Use the stored Image Gen prompt below as the source of truth for subject, story, gameplay read, style, palette, separation/readability, and constraints. Canvas override: Nano Banana Pro does not offer exact 16:10 or 800 x 500 output here, so generate a wide horizontal 3:2 full-bleed rectangular scene and ignore exact 16:10 / 800 x 500 pixel wording if it appears. Critical correction for this rerun: the artwork must fill the whole canvas edge to edge. No grey matte, no border, no nested rectangle, no inner picture frame, no empty padding, no screenshot layout, no card mockup. The blue enemy glass facet, gloved hand, chisel, mallet impact, chapel workshop background, and amber lamp are all part of one continuous full-bleed scene. No local post-processing will be used, so lighting, contrast, colour, foreground/background separation, and framing must be correct in the generated image itself.

Stored prompt:
Use case: stylized-concept
Asset type: Spirebound rectangular card art scene for `chisel` / Chisel
Primary request: Create a wide rectangular 800 x 500 card-art illustration, not an icon and not a badge. Show a black-gloved Duskblade hand pressing a steel chisel into a bright blue enemy glass facet while a squat red mallet impact knocks one triangular chip free.
Gameplay read: attack; show Facet chip first, light damage second. The image must read clearly at 64 px in the in-game card art band.
Story moment: In the ruined glazier's chapel, the Duskblade chips away the enemy's strongest pane with one precise strike.
Composition/framing: Wide horizontal rectangle, full-bleed background. Foreground chisel and hand are large and dark. Midground target facet is a single bright pane with one missing corner. Background workshop stones, chapel ribs, and one small amber lamp stay muted.
Palette: Bright blue enemy facet, dark glove, steel grey chisel, red mallet spark, warm amber lamp, black lead lines.
Separation/readability: Use a strong dark silhouette for the hand and chisel against the blue pane. Keep only one flying chip, large enough to read, with a clear amber rim.
Style/medium: Serious cartoon-gothic stained-glass game art; chunky silhouettes; simplified theatrical scene; 3-5 large jewel-tone glass masses; matte painterly glass texture; warm amber rim light.
Constraints: No text, no labels, no watermark, no UI chrome, no card border, no cost icon, no nameplate, no full card mockup, no badge, no emblem, no transparent background, no chroma-key background, no tiny tool details, no photorealism.
```

## `firstSpark` / First Spark

Source prompt record:
`scratch/style-tests/card-production-batch-01-20260706/prompt-ledger.md`

Source output: `source/firstSpark-nanobanana-pro.jpg`

Gallery asset: `src/assets-nano-banana/cards/firstSpark.jpg`

SHA-256: `e4e483f35812b88d0522f8d75c3f22ca525f7280a02ce6cd2d9d987c175030f1`

Final Nano Banana Pro prompt used:

```text
Nano Banana Pro direct comparison pass for Spirebound card art. Use the stored Image Gen prompt below as the source of truth for subject, story, gameplay read, style, palette, separation/readability, and constraints. Canvas override: Nano Banana Pro does not offer exact 16:10 or 800 x 500 output here, so generate a wide horizontal 3:2 full-bleed rectangular scene and ignore exact 16:10 / 800 x 500 pixel wording if it appears. Do not make a full card mockup, badge, icon, UI frame, text, label, watermark, transparent background, chroma-key, or cutout. No local post-processing will be used, so lighting, contrast, colour, foreground/background separation, and framing must be correct in the generated image itself.

Stored prompt:
Use case: stylized-concept
Asset type: Spirebound rectangular card art scene for `firstSpark` / First Spark
Primary request: Create a wide 800 x 500 rectangular scene, not an icon and not a badge, showing a dark gloved Duskblade hand cupping a tiny amber spark beneath a blue stained-glass card pane while a second card pane rises from the light.
Gameplay read: skill; show draw and Kindle first through the rising card pane and small ember, with no attack weapon dominance. It must read clearly at 64 px in the in-game card-art band.
Story moment: The first live coal wakes under dead glass, and the next pane is pulled into the Duskblade's hand.
Style/medium: serious cartoon-gothic stained-glass game art; chunky dark silhouette; large readable jewel-glass shapes; sparse thick lead dividers; matte painterly glass texture; controlled amber rim light.
Composition/framing: wide horizontal rectangle; full-bleed chapel-floor background; foreground hand and spark; midground rising card pane; no transparent or chroma-key background; no centred emblem, badge, logo, or full card mock-up.
Palette: cool sapphire and cyan glass, black lead, muted blue-grey stone glass, one warm amber spark.
Constraints: no text, labels, watermark, UI chrome, card border, cost icon, nameplate, decorative badge, circular medallion, plain icon, photorealism, anime card art, tiny filigree, or busy background competing with the foreground action.
```
