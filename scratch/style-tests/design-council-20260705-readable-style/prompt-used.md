# Design Council Prompt

This file contains the original two-subject baseline prompt for Duskblade and
Duskfang. The per-asset prompt history for later approved and rejected attempts
is now tracked in `prompt-ledger.md`.

## Shared Readability Rule

Readability priority: silhouette first, pose second, face/weapon/core symbol third, colour fourth, texture last. The subject must still be recognisable as a black shadow with all internal details removed.

## Shared Style Block

Use case: stylized-concept
Asset type: Spirebound <hero|enemy> alpha-ready source
Primary request: <subject>
Style/medium: serious cartoon-gothic dark-fantasy game art; instantly readable black silhouette first; one iconic primary shape, weapon, or pose; chunky hand-inked outer contour; simplified exaggerated proportions; 3-5 large stained-glass colour masses only, with very few thick lead dividers; matte painterly brush texture; restrained cathedral motifs as broad shapes, not filigree; thumbnail-readable at 128px; dramatic and grave; for enemies, allow cute, funny, and interesting personality through proportions and expression while keeping the threat readable; no lacework, no micro-panels, no complex anatomy segmentation, no ornate armour noise, no glossy 3D render, no generic fantasy.
Composition/framing: <category rule>; single complete subject; generous padding; no cropped limbs; no action blur.
Lighting/mood: sober gothic mood; single warm amber rim light defining the silhouette; soft restrained inner glow limited to 1-2 focal panes such as face, chest, weapon, or core symbol; high value contrast on the main read; no scattered sparkles, no multi-source glow, no noisy bloom, no haze touching the silhouette.
Scene/backdrop: perfectly flat solid #ff00ff chroma-key background only.
Constraints: no ground plane; no floor; no shadows; no reflections; no haze touching the silhouette; no text; no labels; no watermark; do not use #ff00ff in the subject.

## Hero Subject

The Duskblade, a hooded glass knight hero with one iconic crescent blade and a small lantern-core in the chest, calm grave idle pose, facing slightly right, designed for a browser roguelite deckbuilder character sprite.

Composition/framing: full body, calm idle pose, facing slightly right, feet grounded, about 10% margin; single complete subject; generous padding; no cropped limbs; no action blur.

## Enemy Subject

Duskfang, a prowling wolf-like dusk beast made of black lead and amber-red glass, with one iconic crescent maw, hunched shoulders, blade-like hackles, and glowing eye slit; menacing idle pose, facing slightly left toward the hero, designed for a browser roguelite deckbuilder enemy sprite.

Composition/framing: full body, menacing idle pose, facing slightly left, about 10% margin; single complete subject; generous padding; no cropped limbs; no action blur.

## Nano Banana Pro Clean-Up Prompt

帮我将这张图片重绘和清晰化，让他细节更丰富，同时去掉原图中杂乱不必要的细节。重要：背景不是艺术内容，必须逐像素保持为纯 #ff00ff chroma-key 背景；不要把背景改成白色、灰色、粉色渐变、黑色或任何场景；背景必须完全平整、单一颜色、无渐变、无纹理、无光照、无光晕、无阴影。请严格延续第一步的 alpha-ready 要求：主体完整、无裁切、无地面、无地线、无接触阴影、无投影、无反射、无贴边雾气、无文字、无标签、无水印；不要在主体中使用 #ff00ff。
