# Spirebound Seedance 2.0 Intro Pack — 16:9, 14 seconds

Target: 14 seconds, 16:9 landscape, title/intro cinematic. Built on the lessons from the 9:16 packs: **no boss** (the boss-led cut made the scene worse), and the two card-art refs (chisel hammer / novaflare card) are dropped because they tend to leak hammer- and card-shaped objects into the shot. 7 references is enough; the model can draw glass cracks without a crack ref.

This is an intro/title cinematic, not a gameplay trailer. No boss, no enemies, no fights, no battle UI, no cards, no buttons, no health bars, no menus, no HUD, no tutorial text.

## Upload References

Upload from `refs-intro-16x9/` in this exact order. If the tool lets you rename materials, use the `REFxx_...` handles; if it only gives ordered handles, substitute `@图片1`–`@图片7` (or `[Image1]`–`[Image7]`) in the same order.

| Order | Handle | Local file | Role in prompt |
|---:|---|---|---|
| 1 | `@REF01_TitleWordmark` | `refs-intro-16x9/REF01_TitleWordmark.png` | final SPIREBOUND title style/lettering only |
| 2 | `@REF02_TitleKeyArt_GlassSpire` | `refs-intro-16x9/REF02_TitleKeyArt_GlassSpire.png` | main world anchor: moonlit glass spire, lantern helix, clouds |
| 3 | `@REF03_Duskblade_Hero` | `refs-intro-16x9/REF03_Duskblade_Hero.png` | the single hero's appearance |
| 4 | `@REF04_Act1_AshenWoods` | `refs-intro-16x9/REF04_Act1_AshenWoods.png` | Act 1 ashen forest palette |
| 5 | `@REF05_Act2_SunkenCity` | `refs-intro-16x9/REF05_Act2_SunkenCity.png` | Act 2 drowned blue city palette |
| 6 | `@REF06_Act3_ObsidianSpire` | `refs-intro-16x9/REF06_Act3_ObsidianSpire.png` | Act 3 obsidian/magenta storm palette |
| 7 | `@REF07_EmberLantern_Relic` | `refs-intro-16x9/REF07_EmberLantern_Relic.png` | the lantern prop and ember light |

## Settings

- Model: Seedance 2.0 (VIP / Omni reference mode)
- Mode: all-reference / reference-to-video
- Duration: 14 seconds
- Aspect: 16:9 landscape
- Quality: highest available (2K if selectable)
- Audio: native audio on — cinematic score + foley, no dialogue

## Master Prompt (English)

```text
A 14-second 16:9 cinematic opening title sequence for the game Spirebound. This is an intro cinematic, not a gameplay trailer: no battle UI, no cards, no buttons, no health bars, no damage numbers, no menus, no HUD, no tutorial text, no enemies, no boss, no fighting. The drama comes from a lantern igniting, a glass tower waking, one hero appearing, three worlds unfolding, a glass-shatter ritual, and the title reveal.

Art direction: serious cartoon-gothic stained-glass dark fantasy game art — an ink-black world, chunky hand-inked contours, large jewel-toned glass masses with a few thick lead lines, warm amber lantern light, living things made of glass with fire inside. Not live-action, not realistic armor, not imitating any existing game or film IP.

Reference roles:
@REF01_TitleWordmark — only for the final SPIREBOUND title lettering style and placement; generate no other text.
@REF02_TitleKeyArt_GlassSpire — the main world anchor: moonlit glass spire, spiral lantern route, cloud sea, dark forest, overall mood.
@REF03_Duskblade_Hero — the only character, the Duskblade: hood, crescent blade, black-blue cloak, amber lantern, glass chest-fire. Do not add a second hero, companions, crowds, or enemies.
@REF04_Act1_AshenWoods, @REF05_Act2_SunkenCity, @REF06_Act3_ObsidianSpire — the three act environments' color and stained-glass diorama layering.
@REF07_EmberLantern_Relic — the lantern prop, the embers, and the final light source.

Timeline:
0:00–0:02 — No black frame. Extreme close-up: a small lantern ignites in total darkness; its flame reveals cracked stained-glass texture around it. The cracks glow softly, breathing; a few embers drift upward. No text, no UI.
0:02–0:05 — The camera pulls back and rises out of the lantern flame into a wide 16:9 vista: the moonlit glass spire of @REF02_TitleKeyArt_GlassSpire standing above a sea of clouds and black pine forest. The spiral lantern route ignites lamp by lamp from the base upward; the tower wakes like a living thing. One slow continuous crane move, no cutting.
0:05–0:07 — At the foot of the tower, the Duskblade steps out of shadow, exactly matching @REF03_Duskblade_Hero, and raises the lantern; the crescent blade catches a single line of cold light. Calm and ceremonial, not a fighting stance. Only this one character.
0:07–0:10 — The three act worlds unfold across the wide frame like tall stained-glass windows lighting up in sequence, left to right: the ashen forest of @REF04_Act1_AshenWoods, the drowned blue city of @REF05_Act2_SunkenCity, the obsidian magenta storm of @REF06_Act3_ObsidianSpire. Transitions sweep like lantern light passing across window panes — no hard cuts, no captions.
0:10–0:12 — The shatter ritual: back on the spire, lantern light runs up the tower's glass veins and the old outer glass shell fills with glowing cracks. Time holds for one beat, then the shell breaks apart slowly and gracefully, opening like a rose window — not a violent explosion. The shards drift, and the embers stream back down into the lantern of @REF07_EmberLantern_Relic like falling stars. Sound: a low drum hit, glass crackle, a soft in-breath of flame.
0:12–0:14 — The drifting shards and embers gather at the center of the frame and form the SPIREBOUND title, matching @REF01_TitleWordmark, glowing amber against the night spire of @REF02_TitleKeyArt_GlassSpire. The final frame holds still for half a second — clean, centered, screenshot-ready, no fade to black. Generate no readable text other than "SPIREBOUND".

Camera language: mysterious, solemn, ceremonial; slow push-ins, one rising crane, light-sweep window transitions, one brief slow-motion shatter. One primary camera move per beat. No shaky cam, no rapid cutting, no flicker, no warping, no watermark.
```

## Master Prompt (Chinese, for Jimeng)

```text
请生成一个 14 秒 16:9 横屏游戏开场 Intro / title cinematic，游戏名 Spirebound。注意：这是游戏开场动画，不是 gameplay trailer。不要出现 Boss、敌人、怪物、打斗、战斗 UI、卡牌、按钮、血条、伤害数字、菜单、教程文字或任何 HUD。整支片的戏剧性来自灯笼点亮、玻璃高塔苏醒、主角登场、三幕世界展开、玻璃碎裂仪式和最后标题 reveal。

整体美术：严肃 cartoon-gothic stained-glass dark fantasy game art；墨黑世界、粗黑轮廓、大片宝石色玻璃、少量厚铅线、温暖琥珀灯火、玻璃与火共生。不要真人电影感，不要写实盔甲，不要仿照任何现有游戏或影视 IP。

参考素材分工：
@REF01_TitleWordmark 只参考最终 SPIREBOUND 标题的字形和位置，不要生成其它文字。
@REF02_TitleKeyArt_GlassSpire 是主要世界锚点：月夜玻璃高塔、螺旋灯笼路线、云海、黑森林和主氛围。
@REF03_Duskblade_Hero 是唯一角色 Duskblade 的外形锚点：兜帽、月牙刀、黑蓝披风、琥珀灯、玻璃胸火。不要加入第二个英雄、队友、人群或敌人。
@REF04_Act1_AshenWoods、@REF05_Act2_SunkenCity、@REF06_Act3_ObsidianSpire 参考三幕环境色彩和 stained-glass diorama 层次。
@REF07_EmberLantern_Relic 参考灯笼道具、余烬和最终光源。

镜头时间轴：
0-2 秒：不要黑场。极近景：一盏小灯笼在黑暗中点亮，火焰照出周围裂开的彩色玻璃纹理。裂纹像呼吸一样缓慢发光，几颗余烬向上漂浮。无文字，无 UI。
2-5 秒：镜头从灯笼火焰中拉出并上升，展开 16:9 宽画面：@REF02_TitleKeyArt_GlassSpire 的月夜玻璃高塔立在云海和黑松林之上，螺旋灯笼路线从塔底逐盏点亮，塔身像活物一样苏醒。一个缓慢连续的 crane 镜头，不要剪切。
5-7 秒：塔脚处，Duskblade 从暗影中走出，严格参考 @REF03_Duskblade_Hero，抬起灯笼；月牙刀只反射一线冷光。安静庄严，不是战斗姿势，只有这一个角色。
7-10 秒：三幕世界像三扇高大的彩色玻璃窗，从左到右依次被点亮，横向展开：@REF04_Act1_AshenWoods 的灰烬森林、@REF05_Act2_SunkenCity 的沉没青蓝城市、@REF06_Act3_ObsidianSpire 的黑曜紫红风暴。转场像灯光扫过窗格，不要硬切，不要字幕。
10-12 秒：SHATTER 仪式：回到高塔，灯笼光沿塔身玻璃脉络上行，旧玻璃外壳布满发光裂纹。静止一拍，然后外壳缓慢优雅地碎开，像玫瑰窗散开，不是暴力爆炸。碎片漂浮，余烬像流星一样落回 @REF07_EmberLantern_Relic 的灯笼。声音：低沉鼓点、玻璃裂响、火焰吸气。
12-14 秒：漂浮的碎片和余烬在画面中央聚合成 SPIREBOUND 标题，参考 @REF01_TitleWordmark，琥珀色发光，背景是 @REF02_TitleKeyArt_GlassSpire 的夜塔和灯火。最后一帧停住半秒，干净、居中、可截图，不要黑场。除 "SPIREBOUND" 外不要生成任何可读文字。

镜头语言：神秘、庄严、有仪式感；缓慢推进、一次上升 crane、灯光扫过式窗格转场、一次短暂慢动作碎裂；每个节拍只用一个主要镜头运动。不要抖动，不要频繁乱切，无闪烁，无变形，无水印。
```

## Short Safer Prompt (English)

Use this if the master prompt makes the model overcomplicate the sequence.

```text
14-second 16:9 game opening cinematic for Spirebound. Not a gameplay trailer: no enemies, no fighting, no UI, no cards, no buttons, no health bars, no menus. Gothic stained-glass dark fantasy: ink-black world, amber lantern light, a glass tower, glowing glass cracks.

0–3s: a lantern ignites in darkness, revealing cracked stained glass.
3–6s: camera rises along the spiral lantern route of the glass spire from @REF02_TitleKeyArt_GlassSpire.
6–8s: @REF03_Duskblade_Hero appears at the tower's foot and raises the lantern — calm, not a fighting stance.
8–10s: three environments sweep past like stained-glass windows: @REF04_Act1_AshenWoods, @REF05_Act2_SunkenCity, @REF06_Act3_ObsidianSpire.
10–12s: lantern light fills the tower's glass with glowing cracks; the old shell shatters slowly like a rose window opening; embers fall back into the lantern of @REF07_EmberLantern_Relic.
12–14s: the shards form the SPIREBOUND title matching @REF01_TitleWordmark; final frame holds, no fade to black.

No text other than SPIREBOUND, no watermark, no existing IP imitation.
```

## Fix Prompts

If it shows enemies or fighting:

```text
Redo. Remove all enemies, monsters, confrontation, and fighting entirely. The intro should only contain the lantern, the glass spire, the Duskblade, the three environments, the tower-shatter ritual, and the final SPIREBOUND title.
```

If it shows gameplay UI:

```text
Redo. The last version looked like a gameplay trailer. Make it a pure opening cinematic: delete all UI, cards, buttons, health bars, menus, damage numbers, and tutorial elements. Keep only the lantern, the glass spire, the Duskblade, the three environments, the shatter ritual, and the SPIREBOUND title.
```

If the title is messy:

```text
Keep the visuals, but in the final 12–14s generate only one centered SPIREBOUND title, strictly matching @REF01_TitleWordmark. No other text of any kind.
```

If the shatter looks like an explosion:

```text
Redo the 10–12s beat. The glass must break slowly and gracefully, like a rose window opening petal by petal in brief slow motion — not an explosion, no debris flying at the camera, no fire blast. Embers drift downward into the lantern.
```
