# Spirebound Seedance 2.0 VIP Intro-Only Pack

Superseded for Jimeng by `seedance-spirebound-intro-9ref-prompts.md`, because the confirmed reference limit is 9. Use the 9-reference pack unless you are working in another tool that accepts 12 references.

Target: 15 seconds, 9:16 portrait, iPhone-first, centre-safe for 3:4 portrait iPad crop.

This is an intro/title cinematic, not a gameplay trailer. Do not show battle UI, card hand UI, buttons, health bars, damage numbers, menus, or tutorial overlays.

## Upload References

Upload from `refs-intro-only/` in this exact order. If Jimeng lets you rename materials, use the exact `REFxx_...` handles below.

| Order | Jimeng handle | Local file | Role in prompt |
|---:|---|---|---|
| 1 | `@REF01_TitleWordmark` | `refs-intro-only/REF01_TitleWordmark.png` | title/logo style only |
| 2 | `@REF02_TitleKeyArt_GlassSpire` | `refs-intro-only/REF02_TitleKeyArt_GlassSpire.png` | moonlit glass spire, lantern helix, main world mood |
| 3 | `@REF03_Duskblade_Hero` | `refs-intro-only/REF03_Duskblade_Hero.png` | main hero identity |
| 4 | `@REF04_Ashwarden_Hero` | `refs-intro-only/REF04_Ashwarden_Hero.png` | secondary hero silhouette |
| 5 | `@REF05_Act1_AshenWoods` | `refs-intro-only/REF05_Act1_AshenWoods.png` | Act 1 ashen forest palette |
| 6 | `@REF06_Act2_SunkenCity` | `refs-intro-only/REF06_Act2_SunkenCity.png` | Act 2 drowned blue city palette |
| 7 | `@REF07_Act3_ObsidianSpire` | `refs-intro-only/REF07_Act3_ObsidianSpire.png` | Act 3 obsidian/magenta storm palette |
| 8 | `@REF08_Sovereign_FinalBoss` | `refs-intro-only/REF08_Sovereign_FinalBoss.png` | final boss identity |
| 9 | `@REF09_HeraldOfEnd_Boss` | `refs-intro-only/REF09_HeraldOfEnd_Boss.png` | secondary endgame threat motif |
| 10 | `@REF10_EmberLantern_Relic` | `refs-intro-only/REF10_EmberLantern_Relic.png` | lantern/ember close-up |
| 11 | `@REF11_Card_Chisel_ShatterMotif` | `refs-intro-only/REF11_Card_Chisel_ShatterMotif.png` | shatter/facet-crack visual language only, not UI |
| 12 | `@REF12_Card_Novaflare_LanternMagic` | `refs-intro-only/REF12_Card_Novaflare_LanternMagic.png` | lantern magic and stained-glass spell colour only, not UI |

## Settings

- Model: Jimeng Seedance 2.0 VIP
- Mode: all-reference / reference-to-video
- Duration: 15 seconds
- Aspect: 9:16 vertical
- Quality: highest / HD / 1080p if selectable
- Audio: cinematic music + foley, no dialogue
- Safe crop: keep faces, lantern, boss core, tower, and title inside central 3:4 safe area. For 1080 x 1920, avoid important content above y=240 or below y=1680.

## Master Intro Prompt

```text
请生成一个 15 秒 9:16 竖屏手机游戏开场 Intro / title cinematic，游戏名 Spirebound。注意：这是游戏开场动画，不是 gameplay trailer，不要出现战斗 UI、卡牌手牌界面、按钮、血条、伤害数字、菜单、教程文字或任何 HUD。画面要像开机进入游戏前的世界观开场：神秘、庄严、有仪式感，最后自然露出标题。

整体美术：严肃 cartoon-gothic stained-glass dark fantasy game art；墨黑世界、粗黑轮廓、大片宝石色玻璃、少量厚铅线、暖琥珀灯火、玻璃生物体内有火。不要真人电影感，不要写实盔甲，不要仿照任何现有游戏或影视 IP。

参考素材分工：
@REF01_TitleWordmark 只参考最终 SPIREBOUND 标题的字形感觉和位置，不要生成其它文字。
@REF02_TitleKeyArt_GlassSpire 参考月夜玻璃高塔、螺旋灯笼路线、云层和主世界氛围。
@REF03_Duskblade_Hero 作为主角 Duskblade 的外形锚点：兜帽、月牙刀、黑蓝披风、琥珀灯、玻璃胸火。
@REF04_Ashwarden_Hero 只作为一秒钟的第二角色剪影，不抢主角。
@REF05_Act1_AshenWoods、@REF06_Act2_SunkenCity、@REF07_Act3_ObsidianSpire 参考三幕环境色彩和 stained-glass diorama 层次。
@REF08_Sovereign_FinalBoss 作为最终 Boss 的外形和紫红审判核心。
@REF09_HeraldOfEnd_Boss 参考终局威胁的轮廓语言。
@REF10_EmberLantern_Relic 参考灯笼、余烬、最终光源。
@REF11_Card_Chisel_ShatterMotif 只参考玻璃裂纹、凿痕、碎裂机制，不要生成卡牌 UI。
@REF12_Card_Novaflare_LanternMagic 只参考灯笼魔法、余烬爆发、彩色玻璃光，不要生成卡牌 UI。

镜头时间轴：
0-2 秒：不要黑场。极近景：一盏小灯笼在黑暗中点亮，火焰照出裂开的彩色玻璃纹理。玻璃裂纹像呼吸一样缓慢发光，几颗余烬向上漂浮。无 UI，无文字。
2-4 秒：镜头从灯笼火焰内推进，穿过一片裂开的玻璃，进入 @REF02 的月夜玻璃高塔。螺旋灯笼路线从下方向上点亮，塔身像活物一样微微呼吸。保持竖屏中轴构图。
4-6 秒：Duskblade 从塔脚暗影中走出，严格参考 @REF03_Duskblade_Hero，抬起灯笼；月牙刀只反射一线冷光。背后短暂出现 @REF04_Ashwarden_Hero 的沉重剪影，然后被灯火吞没。
6-8 秒：三幕世界像彩色玻璃窗一样依次展开：@REF05 的灰烬森林、@REF06 的沉没青蓝城市、@REF07 的黑曜紫红风暴。转场要像玻璃窗翻页和灯光扫过，不要硬切，不要加字幕。
8-11 秒：远处的 @REF08_Sovereign_FinalBoss 在高塔上方睁开紫红核心，审判光环展开；@REF09 的终局威胁轮廓可以在云中一闪而过。Duskblade 在下方举灯回应，画面形成英雄、灯笼、塔、Boss 核心的垂直轴线。
11-13 秒：SHATTER 仪式瞬间：Boss 核心没有被真实打斗击中，而是被灯笼光照出无数裂纹；时间静止一拍，大片彩色玻璃缓慢碎开，余烬像流星一样回到 @REF10_EmberLantern_Relic 的灯笼。声音是低沉鼓点、玻璃裂响、火焰吸气。
13-15 秒：碎片和余烬组成最终标题。露出清晰的 SPIREBOUND wordmark，参考 @REF01_TitleWordmark；背景仍是 @REF02 的高塔和灯火。最后一帧停住 0.5 秒，干净、可截图、不要黑屏。除 “SPIREBOUND” 外不要生成其它可读文字。

镜头语言：cinematic game intro，神秘、庄严、节奏清晰；缓慢推进、上升跟随、玻璃窗转场、短暂慢动作碎裂；不要过度抖动，不要频繁乱切。所有重要角色、灯笼、Boss 核心、塔和标题都放在中央 3:4 安全区，适合从 9:16 裁成 iPad 3:4。清晰流畅，无闪烁，无变形，无水印。
```

## Simpler / Safer Prompt

Use this if Seedance overcomplicates the master prompt.

```text
15 秒 9:16 竖屏游戏开场 Intro，Spirebound。不是 gameplay trailer：不要 UI、不要卡牌手牌、不要按钮、不要血条、不要菜单。画面是 gothic stained-glass fantasy：黑暗、琥珀灯火、玻璃高塔、彩色玻璃裂纹。

0-3 秒：黑暗中一盏灯笼点亮，照出裂纹玻璃。
3-6 秒：镜头沿 @REF02_TitleKeyArt_GlassSpire 的高塔螺旋灯笼路线上升。
6-8 秒：@REF03_Duskblade_Hero 抬灯出现，@REF04_Ashwarden_Hero 成为短暂剪影。
8-10 秒：三幕环境快速闪过：@REF05、@REF06、@REF07。
10-13 秒：@REF08_Sovereign_FinalBoss 在塔顶展开紫红核心和光环，灯笼光让玻璃裂开并 shatter。
13-15 秒：余烬组成清晰 SPIREBOUND 标题，参考 @REF01_TitleWordmark，最后一帧停住，不黑屏。

保持中央 3:4 安全区，no extra text, no watermark, no existing IP imitation.
```

## Fix Prompts

If it shows gameplay UI:

```text
重做。上一版太像 gameplay trailer。必须变成游戏开场 Intro：删除所有 UI、卡牌手牌、按钮、血条、菜单、伤害数字和教程元素。只保留灯笼、玻璃高塔、Duskblade、三幕环境、Sovereign、shatter 仪式和最后 SPIREBOUND 标题。
```

If it is too slow or boring:

```text
保留无 UI 的 Intro 方向，但节奏更有钩子：第一秒灯笼点亮时玻璃裂纹立即发光；第 3 秒高塔螺旋灯笼快速点亮；第 10 秒 Boss 核心展开；第 13 秒碎片组成标题。不要增加 gameplay UI。
```

If the title is messy:

```text
保留画面，但最后 13-15 秒不要生成复杂文字，只生成一个居中的 SPIREBOUND 标题轮廓，严格参考 @REF01_TitleWordmark。除 SPIREBOUND 外不要有任何文字。
```

If iPad crop fails:

```text
重做构图。所有重要内容必须在中央 3:4 安全区：灯笼、Duskblade、Boss 核心、高塔、SPIREBOUND 标题都不能靠近 9:16 顶部或底部边缘。顶部和底部只放暗角、天空、粒子或云。
```
