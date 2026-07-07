# Spirebound Seedance 2.0 Intro Pack — 16:9, 14 s, v2 "The Fall"

Supersedes `seedance-spirebound-intro-16x9-prompts.md`. Feedback on v1: the hero ref didn't hold the lantern (confusing), and the beat structure was too safe. v2 is a modern teaser cut — cold open, speed ramps, a bullet-time freeze, a freefall, cuts on drum hits — built on **custom cinematic key-frames** generated in the game's style (only the wordmark and key art are in-game material).

Concept in one line: *a lantern ignites → the tower answers → the hero leaps → time freezes and shatters → he falls through the worlds → the fall becomes the title.*

Still an intro cinematic, not a gameplay trailer: no UI, no cards, no buttons, no health bars, no menus, no enemies, no boss.

## Upload References

Upload from `refs-intro-16x9-v2/` in this exact order. If the tool only gives ordered handles, substitute `@图片1`–`@图片7` / `[Image1]`–`[Image7]` in the same order.

| Order | Handle | Local file | Role in prompt |
|---:|---|---|---|
| 1 | `@REF01_TitleWordmark` | `refs-intro-16x9-v2/REF01_TitleWordmark.png` | final SPIREBOUND lettering only |
| 2 | `@REF02_MacroFace_Ignition` | `refs-intro-16x9-v2/REF02_MacroFace_Ignition.png` | cold open: flame igniting inside the hero's cracked glass face |
| 3 | `@REF03_Hero_LanternRaised` | `refs-intro-16x9-v2/REF03_Hero_LanternRaised.png` | hero identity + the raised-lantern reveal (he IS holding the lantern here) |
| 4 | `@REF04_BulletTime_Shatter` | `refs-intro-16x9-v2/REF04_BulletTime_Shatter.png` | frozen-time mid-air slash among suspended glass shards |
| 5 | `@REF05_ShardTriptych_ThreeWorlds` | `refs-intro-16x9-v2/REF05_ShardTriptych_ThreeWorlds.png` | the three act worlds glimpsed inside floating shards |
| 6 | `@REF06_Freefall_LanternTrail` | `refs-intro-16x9-v2/REF06_Freefall_LanternTrail.png` | freefall down the tower face, lantern trailing fire |
| 7 | `@REF07_TitleKeyArt_GlassSpire` | `refs-intro-16x9-v2/REF07_TitleKeyArt_GlassSpire.png` | the wide spire vista + final title backdrop |

## Settings

- Model: Seedance 2.0 (VIP / Omni reference mode)
- Mode: all-reference / reference-to-video
- Duration: 14 seconds
- Aspect: 16:9 landscape
- Quality: highest available (2K if selectable)
- Audio: native audio on — score + foley + one whispered line, no other dialogue

## Master Prompt (English)

```text
A 14-second 16:9 award-style cinematic teaser for the game Spirebound. Not a gameplay trailer: no UI, no cards, no buttons, no health bars, no menus, no enemies. The edit is rhythmic and modern — a cold open, one speed-ramped rise, a hard smash cut to silence, a bullet-time freeze, a freefall, and a title sting. Cuts land on drum hits.

Art direction: serious cartoon-gothic stained-glass dark fantasy game art — ink-black world, chunky hand-inked contours, large jewel-toned glass masses with thick lead lines, warm amber lantern light, living things made of glass with fire inside. Not live-action, not photoreal, not imitating any existing game or film IP.

Reference roles:
@REF02_MacroFace_Ignition — the cold open shot: the hero's cracked amber glass face igniting inside the hood.
@REF03_Hero_LanternRaised — the only character, the Duskblade, and his key pose: lantern raised high in his left hand, crescent blade low in his right. Keep this exact design in every shot: dark hood, glowing amber glass face, black-and-gold stained-glass armor, black-blue cloak.
@REF04_BulletTime_Shatter — the frozen-time composition: hero mid-air slash among suspended stained-glass shards.
@REF05_ShardTriptych_ThreeWorlds — the three worlds seen inside floating shards: ashen ember forest, drowned cyan city, magenta storm wasteland.
@REF06_Freefall_LanternTrail — the freefall shot down the glass tower, lantern trailing a ribbon of fire.
@REF07_TitleKeyArt_GlassSpire — the wide moonlit glass spire with its spiral of lanterns; also the final title backdrop.
@REF01_TitleWordmark — the SPIREBOUND title lettering only; generate no other readable text.

Timeline:
0:00–0:01.5 — Cold open, no logos, no black hold. A heartbeat thumps twice in darkness. On the second beat, a flame ignites INSIDE the hero's cracked glass face, extreme macro as in @REF02_MacroFace_Ignition — light floods the cracks like veins catching fire. A soft whisper: "The Spire remembers."
0:01.5–0:03.5 — Match cut from the burning face to a single lantern flame far below the tower. The camera whips vertically up the face of the glass spire of @REF07_TitleKeyArt_GlassSpire as thousands of lanterns ignite in a spiral chain reaction racing past the lens — speed ramp, rising choir, lens streaked with amber light.
0:03.5–0:05.5 — The rise slams to a stop at the summit ledge: the Duskblade of @REF03_Hero_LanternRaised stands against the storm, lantern raised high, cloak whipping, moon behind clouds. One slow push-in on his back. The music swells —
0:05.5–0:06 — — and he tips forward off the ledge. SMASH CUT. Total silence for two frames.
0:06–0:08 — Bullet time. He hangs mid-air in a horizontal slash exactly as in @REF04_BulletTime_Shatter, the night itself frozen mid-shatter around him, giant stained-glass shards suspended, embers hanging like fireflies. The camera orbits him slowly. On three muffled drum hits, three of the frozen shards flare one after another, each revealing a world inside as in @REF05_ShardTriptych_ThreeWorlds: an ashen ember forest — a drowned cyan cathedral city — a magenta lightning wasteland.
0:08–0:11.5 — Time snaps back with a glass-crack THUD. He is in freefall down the tower face as in @REF06_Freefall_LanternTrail — cloak streaming, the spiral of lanterns streaking past, his lantern trailing a ribbon of fire, embers rushing upward past the camera. Speed ramp faster and faster, wind roaring, the cloud sea hurtling closer.
0:11.5–0:14 — He plunges into the clouds and the whole frame collapses into one tiny drifting ember on black. Beat of silence. The ember cracks open and light floods outward, igniting the SPIREBOUND title in cracked amber glass, exactly matching @REF01_TitleWordmark, centered over the distant night spire of @REF07_TitleKeyArt_GlassSpire. One deep bass drop as the title lands. The final frame holds for half a second — clean, screenshot-ready, no fade to black. No readable text other than "SPIREBOUND".

Camera and sound: confident modern teaser grammar — every cut lands on a beat; speed ramps only in the rise and the fall; one orbit in bullet time; no shaky cam, no flicker, no morphing faces, no watermark. Audio: heartbeat, one whispered line, rising choir, hard silence at the leap, muffled drum hits in bullet time, roaring wind, one bass drop on the title.
```

## Master Prompt (Chinese, 1360 chars — fits Jimeng's 2000-char limit)

Uses ordered handles `@图片1`–`@图片7`; upload from `refs-intro-16x9-v2/` in the table order above (图片1 = REF01 wordmark … 图片7 = REF07 key art).

```text
14 秒 16:9 横屏游戏开场 cinematic teaser，游戏名 Spirebound。这不是 gameplay trailer：不要任何 UI、卡牌、按钮、血条、菜单、敌人或打斗。剪辑节奏现代：冷开场、一次加速上升、一次硬切静默、一段子弹时间、一段自由落体、最后标题定格；每个剪切点都落在鼓点上。

美术风格：严肃 cartoon-gothic stained-glass dark fantasy 游戏美术；墨黑世界、粗黑手绘轮廓、大块宝石色玻璃、少量厚铅线、温暖琥珀灯火、玻璃生物体内有火。不要真人实拍感，不要写实，不要模仿任何现有游戏或影视 IP。

素材分工：
@图片2 冷开场：兜帽里主角碎裂玻璃面孔被点燃的特写。
@图片3 唯一主角 Duskblade 的造型锚点：左手高举琥珀灯笼，右手低垂金色月牙刀。所有镜头保持同一造型：黑兜帽、发光琥珀玻璃脸、黑金玻璃铠甲、黑蓝披风，不要出现第二个角色。
@图片4 子弹时间构图：主角空中横斩，四周悬浮彩色玻璃碎片。
@图片5 三块漂浮碎片中的三个世界：灰烬森林、沉没青蓝城市、紫红风暴荒原。
@图片6 沿玻璃高塔自由落体，灯笼拖出火焰光带。
@图片7 月夜玻璃高塔全景与螺旋灯笼路线；也是最后的标题背景。
@图片1 只用于最终 SPIREBOUND 标题字形，不要生成其它文字。

时间轴：
0-1.5 秒：冷开场，不要黑场停留。黑暗中两声心跳，第二声时火焰在主角碎裂的玻璃面孔内点燃（@图片2），光沿裂纹像血管一样蔓延。一句轻声英文耳语："The Spire remembers."
1.5-3.5 秒：从燃烧的面孔匹配剪辑到塔底一盏灯笼火焰。镜头沿 @图片7 的玻璃高塔垂直急速上升，成千盏灯笼呈螺旋链式点亮、从镜头旁掠过；加速变速，圣咏渐强，琥珀光划过镜头。
3.5-5.5 秒：上升在塔顶平台骤停：@图片3 的 Duskblade 迎着风暴而立，高举灯笼，披风翻卷，云后有月。镜头缓慢推近他的背影，音乐涌起——
5.5-6 秒：——他向前倾身跃下。硬切，完全静默两帧。
6-8 秒：子弹时间。他悬停空中横斩，姿态严格参考 @图片4，整个夜晚在他周围凝固碎裂，巨大玻璃碎片悬浮，余烬像萤火静止。镜头缓慢环绕他一圈。三声闷鼓，三块碎片依次亮起，各显现 @图片5 中的一个世界：灰烬森林——沉没青蓝之城——紫红雷暴荒原。
8-11.5 秒：时间伴随玻璃碎裂巨响恢复。他沿塔面自由落体（@图片6）：披风翻飞，螺旋灯笼拉出光轨，灯笼拖着火焰缎带，余烬向上掠过镜头。速度越来越快，风声呼啸，云海逼近。
11.5-14 秒：他扎入云海，画面收缩为黑幕上一颗漂浮的余烬。静默一拍。余烬裂开，光涌而出，点燃碎裂琥珀玻璃质感的 SPIREBOUND 标题，严格参考 @图片1，居中于 @图片7 的夜塔之上。标题落定时一次低音重击。最后一帧定格半秒，干净、可截图，不要淡出黑场。除 "SPIREBOUND" 外不要任何可读文字。

镜头与声音：现代游戏 teaser 语感；剪切全部落在节拍上；只有上升和坠落两段用变速；子弹时间只环绕一圈；不要手持抖动，不要闪烁，不要脸部变形，无水印。音频：心跳、一句耳语、渐强圣咏、跃下时的静默、子弹时间闷鼓、风啸、标题落定的低音。
```

## Short Safer Prompt (Chinese, ~520 chars)

Use this if the master prompt makes the model overcomplicate the sequence.

```text
14 秒 16:9 横屏游戏开场 teaser，Spirebound。gothic stained-glass dark fantasy：墨黑世界、琥珀灯火、玻璃高塔。不要 UI、卡牌、菜单、敌人、打斗。剪切落在鼓点上。

0-1.5 秒：黑暗中心跳两声，火焰在主角玻璃面孔内点燃（@图片2）。英文耳语："The Spire remembers."
1.5-3.5 秒：镜头沿 @图片7 的玻璃高塔加速上升，螺旋灯笼链式点亮。
3.5-5.5 秒：@图片3 的 Duskblade 立于塔顶，高举灯笼，披风翻卷，缓慢推近。
5.5-6 秒：他跃下——硬切静默。
6-8 秒：子弹时间：他空中横斩悬停（@图片4），三块悬浮碎片随鼓点依次亮起 @图片5 的三个世界。
8-11.5 秒：时间恢复，沿塔自由落体（@图片6），灯笼拖火，加速冲向云海。
11.5-14 秒：画面收缩成一颗余烬，裂开点燃 SPIREBOUND 标题（@图片1），背景是 @图片7 的夜塔。低音重击，最后一帧定格，不要黑场。

除 SPIREBOUND 外不要任何文字，无水印，不模仿现有 IP。
```

## Fix Prompts (Chinese)

主角走形：

```text
重做。主角在所有镜头必须与 @图片3 完全一致：黑兜帽、发光琥珀玻璃脸、黑金玻璃铠甲、黑蓝披风、左手琥珀灯笼、右手金色月牙刀。永远只有这一个角色。
```

子弹时间变成打斗：

```text
重做 6-8 秒。没有对手、没有敌人、没有击中目标——主角独自悬停在空中横斩，是凝固碎裂的夜晚悬浮在他周围。只缓慢环绕一圈，碎片静止，三块碎片依次亮起。
```

节奏松散、没有明确剪切：

```text
保留镜头内容，但收紧剪辑：所有剪切必须正好落在鼓点上，5.5 秒跃下时硬切静默，变速只用于上升（1.5-3.5 秒）和坠落（8-11.5 秒）两段。节拍之间不要交叉淡化。
```

标题混乱：

```text
保留画面，但最后 11.5-14 秒只生成一个居中的 SPIREBOUND 标题，严格参考 @图片1，由一颗余烬裂开点燃。不要任何其它文字。
```

耳语导致字幕或口型问题：

```text
完全删除耳语。不要对白、不要字幕、不要标注文字——只保留音乐和音效。
```

## Short Safer Prompt (English)

Use this if the master prompt makes the model overcomplicate the sequence.

```text
14-second 16:9 cinematic teaser for Spirebound. Gothic stained-glass dark fantasy, ink-black world, amber lantern light. No UI, no cards, no menus, no enemies. Cuts land on drum hits.

0–1.5s: darkness, a heartbeat; a flame ignites inside the hero's cracked glass face (@REF02_MacroFace_Ignition). Whisper: "The Spire remembers."
1.5–3.5s: speed-ramped vertical rise up the glass spire of @REF07_TitleKeyArt_GlassSpire as its spiral of lanterns ignites in a chain reaction.
3.5–5.5s: the hero of @REF03_Hero_LanternRaised stands at the summit, lantern raised, cloak whipping; slow push-in.
5.5–6s: he tips off the ledge — smash cut to silence.
6–8s: bullet time: he hangs mid-slash among frozen glass shards (@REF04_BulletTime_Shatter); three shards flare on drum hits, each showing a world from @REF05_ShardTriptych_ThreeWorlds.
8–11.5s: time snaps back — freefall down the tower (@REF06_Freefall_LanternTrail), lantern trailing fire, speed ramping up.
11.5–14s: the frame collapses to a single ember, which cracks open into the SPIREBOUND title (@REF01_TitleWordmark) over the night spire. Bass drop. Hold the final frame, no fade to black.

No text other than SPIREBOUND, no watermark, no shaky cam, no existing IP imitation.
```

## Fix Prompts

If the hero goes off-model between shots:

```text
Redo. The hero must be identical in every shot to @REF03_Hero_LanternRaised: dark hood, glowing amber glass face, black-and-gold stained-glass armor, black-blue cloak, amber lantern in his LEFT hand, golden crescent blade in his right. Never a second character.
```

If the bullet-time beat turns into a real fight:

```text
Redo the 6–8s beat. There is no opponent and no impact — the hero is alone, frozen mid-slash, and the SHATTERED NIGHT itself hangs around him. Slow orbit only, shards motionless, three shards flare in sequence.
```

If the pacing gets mushy (no clear cuts):

```text
Keep the shots but harden the edit: cuts must land exactly on the drum hits, hard smash cut to silence at 5.5s, speed ramps only during the rise (1.5–3.5s) and the fall (8–11.5s). No crossfades between beats.
```

If the title is messy:

```text
Keep the visuals, but in the final 11.5–14s generate only one centered SPIREBOUND title, strictly matching @REF01_TitleWordmark, ignited from a single ember. No other text of any kind.
```

If the whisper causes lip-sync weirdness or subtitles:

```text
Remove the whispered line entirely. No dialogue, no subtitles, no captions — music and foley only.
```
