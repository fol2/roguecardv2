#!/usr/bin/env python3
import math
from pathlib import Path
from PIL import Image, ImageDraw

N = 1024
C = N // 2
OUT = Path(__file__).resolve().parents[1] / "src/assets/meta"
QUESTS = [
    "paleOnes", "ownShade", "usurper",
    "eighthOmen", "unreadablePage", "hollowLamplighter",
]
OUT.mkdir(parents=True, exist_ok=True)

frame = Image.new("RGBA", (N, N), (0, 0, 0, 0))
d = ImageDraw.Draw(frame)
lead = (6, 7, 12, 255)
gold = (92, 73, 36, 255)
outer = (82, 82, 942, 942)
inner = (132, 132, 892, 892)
boss = (442, 442, 582, 582)
d.ellipse(outer, outline=lead, width=34)
d.ellipse(inner, outline=gold, width=8)
d.ellipse(boss, outline=lead, width=28)
for i in range(6):
    angle = -120 + i * 60
    x1 = C + int(70 * math.cos(math.radians(angle)))
    y1 = C + int(70 * math.sin(math.radians(angle)))
    x2 = C + int(430 * math.cos(math.radians(angle)))
    y2 = C + int(430 * math.sin(math.radians(angle)))
    d.line((x1, y1, x2, y2), fill=lead, width=28)
frame.save(OUT / "emberglass-frame.png")

for i, quest in enumerate(QUESTS):
    alpha = Image.new("L", (N, N), 0)
    a = ImageDraw.Draw(alpha)
    start = -120 + i * 60 + 2
    end = start + 56
    a.pieslice(inner, start=start, end=end, fill=255)
    a.ellipse(boss, fill=0)
    rgba = Image.new("RGBA", (N, N), (255, 255, 255, 0))
    rgba.putalpha(alpha)
    rgba.save(OUT / ("emberglass-mask-" + quest + ".png"))
