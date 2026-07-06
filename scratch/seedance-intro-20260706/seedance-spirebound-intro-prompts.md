# Spirebound Seedance 2.0 VIP Intro Pack

Target: 15 seconds, 9:16 portrait, iPhone-first, centre-safe for 3:4 portrait iPad crop.

## Upload References

Upload these in this exact order. If Jimeng shows editable material names, rename them exactly to the `REFxx_...` names below. If it only gives ordered handles, map them as `@图片1` to `@图片12` in the same order.

Core refs are 1-9. Refs 10-12 are optional reinforcement if the UI accepts more than nine image references. If the UI rejects 10-12, delete the three matching `@REF10`/`@REF11`/`@REF12` lines from the master prompt and change the 11-13 second beat to "余烬飞回主角灯笼".

| Order | Jimeng handle | Local file | Role in prompt |
|---:|---|---|---|
| 1 | `@REF01_TitleScreen_GameplayPortrait` | `refs/REF01_TitleScreen_GameplayPortrait.png` | real mobile title layout, title placement, portrait density |
| 2 | `@REF02_CombatUI_GameplayPortrait` | `refs/REF02_CombatUI_GameplayPortrait.png` | real gameplay/combat UI, cards, hand, enemies, phone readability |
| 3 | `@REF03_TitleKeyArt_GlassSpire` | `refs/REF03_TitleKeyArt_GlassSpire.png` | world mood: moonlit glass spire and lantern helix |
| 4 | `@REF04_Duskblade_Hero` | `refs/REF04_Duskblade_Hero.png` | Duskblade hero identity, hood, crescent blade, amber lantern glow |
| 5 | `@REF05_Ashwarden_Hero` | `refs/REF05_Ashwarden_Hero.png` | Ashwarden alternate hero, heavier lantern silhouette |
| 6 | `@REF06_Act1_AshenWoods` | `refs/REF06_Act1_AshenWoods.png` | Ashen Woods palette and painted diorama language |
| 7 | `@REF07_Act2_SunkenCity` | `refs/REF07_Act2_SunkenCity.png` | Sunken City palette and underwater stained-glass arches |
| 8 | `@REF08_Act3_ObsidianSpire` | `refs/REF08_Act3_ObsidianSpire.png` | final act palette: magenta storm, black glass, judgement halo |
| 9 | `@REF09_Sovereign_FinalBoss` | `refs/REF09_Sovereign_FinalBoss.png` | final boss silhouette and magenta core |
| 10 | `@REF10_HeraldOfEnd_Boss` | `refs/REF10_HeraldOfEnd_Boss.png` | secondary boss/threat motif |
| 11 | `@REF11_Card_Chisel_ShatterMechanic` | `refs/REF11_Card_Chisel_ShatterMechanic.png` | card-art grammar for SHATTER/facet crack |
| 12 | `@REF12_EmberLantern_Relic` | `refs/REF12_EmberLantern_Relic.png` | lantern/ember icon and final glow motif |

## Settings

- Model: Jimeng Seedance 2.0 VIP
- Mode: All-reference / reference-to-video
- Duration: 15 seconds
- Aspect: 9:16 vertical
- Quality: highest / HD / 1080p if selectable
- Audio: on, but keep it as music + foley, no dialogue
- Composition: keep title, hero, boss face, card hand, and CTA inside the central 3:4 safe area. For 1080 x 1920, safe y-range is about 240-1680 px. Top and bottom can contain particles, tower height, sky, or darkness.

## Master Prompt

```text
请生成一个 15 秒 9:16 竖屏手机游戏开场短片，游戏名 Spirebound。整体是严肃 cartoon-gothic stained-glass dark fantasy game art：黑色粗轮廓、大片宝石色玻璃、少量厚铅线、温暖琥珀灯火、墨黑世界、玻璃生物体内有火。画面必须像一款真实竖屏 roguelite deckbuilder 游戏的开场，不要像真人电影，不要仿照任何现有游戏或影视 IP。

参考素材分工：
@REF01_TitleScreen_GameplayPortrait 只参考真实竖屏标题画面布局、标题位置、手机画面密度。
@REF02_CombatUI_GameplayPortrait 只参考真实战斗 UI、卡牌手牌、敌人站位、手机可读性。
@REF03_TitleKeyArt_GlassSpire 参考月夜玻璃高塔、灯笼螺旋路线、整体世界氛围。
@REF04_Duskblade_Hero 作为主角 Duskblade 的外形锚点，保持兜帽、月牙刀、琥珀灯光。
@REF05_Ashwarden_Hero 作为第二可玩角色的短暂剪影参考，不抢主角。
@REF06_Act1_AshenWoods、@REF07_Act2_SunkenCity、@REF08_Act3_ObsidianSpire 参考三幕环境色彩与场景层次。
@REF09_Sovereign_FinalBoss 作为最终 Boss 的核心外形和紫红审判核心。
@REF10_HeraldOfEnd_Boss 参考终局威胁的轮廓语言。
@REF11_Card_Chisel_ShatterMechanic 参考卡牌与玻璃裂纹/碎裂机制的视觉语法。
@REF12_EmberLantern_Relic 参考灯笼、余烬、最终收束光源。

镜头时间轴：
0-2 秒：直接用强钩子开场，不要黑场。近景：一张红蓝玻璃卡牌被手指拖向敌人，卡牌边缘燃起琥珀火，镜头跟随卡牌冲出，玻璃裂纹瞬间蔓延，敌人身体出现明亮裂缝。保留 @REF02 的竖屏游戏感，但不要让 UI 文字变形占画面。
2-4 秒：镜头顺着裂纹飞出战斗场景，沿着 @REF03 的螺旋灯笼路线快速上升，看到墨黑森林、云层、玻璃高塔和远处的灯火。保持竖屏中轴构图。
4-6 秒：Duskblade 从黑暗中抬起灯笼，按照 @REF04 的造型，侧身站在石台上，兜帽内只有琥珀眼光和玻璃胸火。Ashwarden 按 @REF05 只在灯后成为一秒剪影。
6-8 秒：三幕世界快速玻璃窗切换：@REF06 的灰烬森林、@REF07 的沉没青蓝城市、@REF08 的黑曜紫红风暴，每次切换都像彩色玻璃窗翻页，不要硬切黑场。
8-11 秒：进入 Boss 对峙。@REF09 的 Sovereign 在画面上方/远处展开审判光环，Duskblade 在下方举灯。玻璃裂缝从 Boss 紫红核心向外扩散，卡牌、余烬、碎片围绕中轴旋转。动作稳定，不要抖动，不要出现多余角色。
11-13 秒：SHATTER 瞬间：Boss 内部光芒静止一拍，然后碎成大片彩色玻璃，余烬飞向 @REF12 的灯笼，低频冲击声、玻璃碎响、短促合唱。
13-15 秒：画面回到真实手机标题感，参考 @REF01，露出清晰的 SPIREBOUND 标题/wordmark，背景仍然是高塔与灯火。最后一帧不要黑屏，停在标题、主角灯笼、少量卡牌碎片。除 “SPIREBOUND” 之外不要生成其它可读文字。

镜头语言：高速但清晰，第一秒必须有动作；每个镜头只做一个动作；使用推近、上升跟随、玻璃窗转场、短暂慢动作碎裂。保持 24fps cinematic game trailer feel，清晰、流畅、无闪烁、无变形、无水印。音频：低沉鼓点、玻璃裂响、灯火燃烧、短促冲击，最后收束成一声温暖灯鸣。关键角色、标题、卡牌手牌和 Boss 核心必须留在中央 3:4 安全区，适合从 9:16 裁成 iPad 3:4。
```

## Gameplay-First Prompt

Use this if the first output becomes too cinematic or not enough like the actual game.

```text
重新生成同一个 15 秒 9:16 竖屏 Spirebound 游戏开场，但要更像真实游戏宣传片：更多参考 @REF02_CombatUI_GameplayPortrait 的真实战斗画面、卡牌手牌、敌人站位和手机 UI 密度；电影镜头只作为转场，不要替代 gameplay。0-5 秒必须连续展示卡牌拖拽、命中、Ward/血条/敌人意图、玻璃裂纹和 SHATTER；5-9 秒展示塔路线和三幕环境；9-13 秒展示 Duskblade 对 Sovereign 的 Boss 对峙；13-15 秒回到 @REF01_TitleScreen_GameplayPortrait 的标题感。除 “SPIREBOUND” 外不要加字幕，不要生成黑场，不要出现其它品牌或现有 IP。
```

## Fix Prompts

If logo/text is bad:

```text
保留上一版画面节奏，但最后 13-15 秒不要尝试生成复杂文字，只保留一个简单、中央、清晰的 SPIREBOUND 标题轮廓，严格参考 @REF01_TitleScreen_GameplayPortrait 的标题位置和 @REF03_TitleKeyArt_GlassSpire 的背景。不要生成其它文字。
```

If character identity drifts:

```text
重做，主角必须更严格参考 @REF04_Duskblade_Hero：兜帽、月牙刀、琥珀灯、黑蓝披风、玻璃胸火保持一致；不要把主角变成真人、骑士、忍者或其它游戏角色。Boss 必须更严格参考 @REF09_Sovereign_FinalBoss 的紫红核心和光环。
```

If the crop fails on iPad:

```text
重做构图，所有重要动作、主角、Boss 核心、卡牌手牌、灯笼和 SPIREBOUND 标题都必须放在画面中央 3:4 安全区；9:16 画面的最上方 12.5% 和最下方 12.5% 只放天空、粒子、暗角或环境，不放文字、脸、手牌或核心动作。
```
