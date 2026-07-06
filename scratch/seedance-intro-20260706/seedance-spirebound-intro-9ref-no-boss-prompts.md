# Spirebound Seedance 2.0 VIP Intro Pack — 9 References, No Boss

Target: 15 seconds, 9:16 portrait, iPhone-first, centre-safe for 3:4 portrait iPad crop.

This is an intro/title cinematic, not a gameplay trailer. No boss, no enemy, no fight scene, no battle UI, no card hand UI, no buttons, no health bars, no damage numbers, no menus, and no tutorial overlays. The Spire, lantern, glass, and title are the drama.

## Upload References

Upload from `refs-intro-9-no-boss/` in this exact order. If Jimeng lets you rename materials, use the exact `REFxx_...` handles below. If it only gives ordered handles, replace the names with `@图片1` through `@图片9` in the same order.

| Order | Jimeng handle | Local file | Role in prompt |
|---:|---|---|---|
| 1 | `@REF01_TitleWordmark` | `refs-intro-9-no-boss/REF01_TitleWordmark.png` | final title/logo style only |
| 2 | `@REF02_TitleKeyArt_GlassSpire` | `refs-intro-9-no-boss/REF02_TitleKeyArt_GlassSpire.png` | moonlit glass spire, lantern helix, main world mood |
| 3 | `@REF03_Duskblade_Hero` | `refs-intro-9-no-boss/REF03_Duskblade_Hero.png` | single hero identity |
| 4 | `@REF04_Act1_AshenWoods` | `refs-intro-9-no-boss/REF04_Act1_AshenWoods.png` | Act 1 ashen forest palette |
| 5 | `@REF05_Act2_SunkenCity` | `refs-intro-9-no-boss/REF05_Act2_SunkenCity.png` | Act 2 drowned blue city palette |
| 6 | `@REF06_Act3_ObsidianSpire` | `refs-intro-9-no-boss/REF06_Act3_ObsidianSpire.png` | Act 3 obsidian/magenta storm palette |
| 7 | `@REF07_EmberLantern_Relic` | `refs-intro-9-no-boss/REF07_EmberLantern_Relic.png` | lantern/ember close-up |
| 8 | `@REF08_ShatterMotif_CrackedGlass` | `refs-intro-9-no-boss/REF08_ShatterMotif_CrackedGlass.png` | glass crack / shatter visual language only, not UI |
| 9 | `@REF09_LanternMagic_Novaflare` | `refs-intro-9-no-boss/REF09_LanternMagic_Novaflare.png` | lantern magic colour and ember burst only, not UI |

## Settings

- Model: Jimeng Seedance 2.0 VIP
- Mode: all-reference / reference-to-video
- Duration: 15 seconds
- Aspect: 9:16 vertical
- Quality: highest / HD / 1080p if selectable
- Audio: cinematic music + foley, no dialogue
- Safe crop: keep the lantern, hero, tower, stained-glass windows, shatter moment, and title inside central 3:4 safe area. For 1080 x 1920, avoid important content above y=240 or below y=1680.

## Master Prompt

```text
请生成一个 15 秒 9:16 竖屏手机游戏开场 Intro / title cinematic，游戏名 Spirebound。注意：这是游戏开场动画，不是 gameplay trailer。不要出现 Boss、敌人、怪物、战斗对峙、战斗 UI、卡牌手牌界面、按钮、血条、伤害数字、菜单、教程文字或任何 HUD。整支片的戏剧性来自灯笼点亮、玻璃高塔苏醒、主角登场、三幕世界展开、玻璃碎裂仪式和最后标题 reveal。

整体美术：严肃 cartoon-gothic stained-glass dark fantasy game art；墨黑世界、粗黑轮廓、大片宝石色玻璃、少量厚铅线、温暖琥珀灯火、玻璃与火共生。不要真人电影感，不要写实盔甲，不要仿照任何现有游戏或影视 IP。

参考素材分工：
@REF01_TitleWordmark 只参考最终 SPIREBOUND 标题的字形感觉和位置，不要生成其它文字。
@REF02_TitleKeyArt_GlassSpire 是主要世界锚点：月夜玻璃高塔、螺旋灯笼路线、云层、黑森林和主氛围。
@REF03_Duskblade_Hero 作为唯一主角 Duskblade 的外形锚点：兜帽、月牙刀、黑蓝披风、琥珀灯、玻璃胸火。不要加入第二个英雄、敌人或人群。
@REF04_Act1_AshenWoods、@REF05_Act2_SunkenCity、@REF06_Act3_ObsidianSpire 参考三幕环境色彩和 stained-glass diorama 层次。
@REF07_EmberLantern_Relic 参考灯笼、余烬、最终光源。
@REF08_ShatterMotif_CrackedGlass 只参考玻璃裂纹、凿痕、碎裂机制，不要生成卡牌 UI 或手牌界面。
@REF09_LanternMagic_Novaflare 只参考灯笼魔法、余烬爆发和彩色玻璃光，不要生成卡牌 UI。

镜头时间轴：
0-2 秒：不要黑场。极近景：一盏小灯笼在黑暗中点亮，火焰照出裂开的彩色玻璃纹理。玻璃裂纹像呼吸一样缓慢发光，几颗余烬向上漂浮。无 UI，无文字，无敌人。
2-4 秒：镜头从灯笼火焰内推进，穿过一片裂开的玻璃，进入 @REF02_TitleKeyArt_GlassSpire 的月夜玻璃高塔。螺旋灯笼路线从下方向上逐盏点亮，塔身像活物一样苏醒。保持竖屏中轴构图。
4-6 秒：Duskblade 从塔脚暗影中走出，严格参考 @REF03_Duskblade_Hero，抬起灯笼；月牙刀只反射一线冷光。画面宁静、庄严，不要变成战斗姿势。
6-8.5 秒：三幕世界像彩色玻璃窗一样依次展开：@REF04_Act1_AshenWoods 的灰烬森林、@REF05_Act2_SunkenCity 的沉没青蓝城市、@REF06_Act3_ObsidianSpire 的黑曜紫红风暴。转场要像玻璃窗翻页和灯光扫过，不要硬切，不要加字幕。
8.5-11 秒：回到高塔内部/塔身近景：Duskblade 的灯笼光沿着塔的玻璃脉络上行，整座 Spire 的裂纹被点亮。参考 @REF08_ShatterMotif_CrackedGlass 的裂纹语言和 @REF09_LanternMagic_Novaflare 的彩色余烬爆发，但没有 Boss、没有敌人、没有打斗。
11-13 秒：SHATTER 仪式瞬间：高塔的旧玻璃外壳静止一拍，然后慢慢碎成大片彩色玻璃；碎片不是暴力爆炸，而是像玫瑰窗散开，余烬像流星一样回到 @REF07_EmberLantern_Relic 的灯笼。声音是低沉鼓点、玻璃裂响、火焰吸气。
13-15 秒：碎片和余烬组成最终标题。露出清晰的 SPIREBOUND wordmark，参考 @REF01_TitleWordmark；背景仍是 @REF02_TitleKeyArt_GlassSpire 的高塔和灯火。最后一帧停住 0.5 秒，干净、可截图、不要黑屏。除 “SPIREBOUND” 外不要生成其它可读文字。

镜头语言：cinematic game intro，神秘、庄严、清晰、不是广告；缓慢推进、上升跟随、玻璃窗转场、短暂慢动作碎裂；不要过度抖动，不要频繁乱切。所有重要内容、灯笼、Duskblade、高塔、碎裂仪式和标题都放在中央 3:4 安全区，适合从 9:16 裁成 iPad 3:4。清晰流畅，无闪烁，无变形，无水印。
```

## Short Safer Prompt

Use this if the master prompt makes the model overcomplicate the scene.

```text
15 秒 9:16 竖屏游戏开场 Intro，Spirebound。不是 gameplay trailer：不要 Boss、不要敌人、不要打斗、不要 UI、不要卡牌手牌、不要按钮、不要血条、不要菜单。画面是 gothic stained-glass fantasy：黑暗、琥珀灯火、玻璃高塔、彩色玻璃裂纹。

0-3 秒：黑暗中一盏灯笼点亮，照出裂纹玻璃。
3-6 秒：镜头沿 @REF02_TitleKeyArt_GlassSpire 的高塔螺旋灯笼路线上升。
6-8 秒：@REF03_Duskblade_Hero 抬灯出现，安静庄严，不是战斗姿势。
8-10 秒：三幕环境快速闪过：@REF04_Act1_AshenWoods、@REF05_Act2_SunkenCity、@REF06_Act3_ObsidianSpire。
10-13 秒：灯笼光照亮整座高塔的玻璃裂纹，参考 @REF08_ShatterMotif_CrackedGlass 和 @REF09_LanternMagic_Novaflare，旧玻璃像玫瑰窗一样 shatter，余烬回到 @REF07_EmberLantern_Relic。
13-15 秒：余烬组成清晰 SPIREBOUND 标题，参考 @REF01_TitleWordmark，最后一帧停住，不黑屏。

保持中央 3:4 安全区，no extra text, no watermark, no existing IP imitation.
```

## Fix Prompts

If it shows a boss or enemy:

```text
重做。完全删除 Boss、敌人、怪物、对峙和打斗。开场只应该有灯笼、玻璃高塔、Duskblade、三幕世界、塔身碎裂仪式和 SPIREBOUND 标题。不要使用任何 Boss 形象。
```

If it shows gameplay UI:

```text
重做。上一版太像 gameplay trailer。必须变成游戏开场 Intro：删除所有 UI、卡牌手牌、按钮、血条、菜单、伤害数字和教程元素。只保留灯笼、玻璃高塔、Duskblade、三幕环境、shatter 仪式和最后 SPIREBOUND 标题。
```

If the title is messy:

```text
保留画面，但最后 13-15 秒不要生成复杂文字，只生成一个居中的 SPIREBOUND 标题轮廓，严格参考 @REF01_TitleWordmark。除 SPIREBOUND 外不要有任何文字。
```

If iPad crop fails:

```text
重做构图。所有重要内容必须在中央 3:4 安全区：灯笼、Duskblade、高塔、shatter 仪式、SPIREBOUND 标题都不能靠近 9:16 顶部或底部边缘。顶部和底部只放暗角、天空、粒子或云。
```
