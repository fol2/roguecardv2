#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../../.."
set -a; source .env; set +a
NB=/Users/jamesto/.codex/skills/nanobanana/scripts/nanobanana.py
EVENT_PROMPT='帮我将这张图片重绘和清晰化，让它细节更丰富，同时去掉原图中杂乱不必要的细节。重要：这次不做 alpha、chroma-key、cutout 或透明背景控制；请保留完整的 Spirebound game plate scene、原图构图、地平线/平台位置，以及纯黑色 void 区域（黑色 void 必须保持接近纯黑、无纹理）。整体要像严肃 cartoon-gothic stained-glass game art：更粗的黑色外轮廓、更大的形块、更少碎裂玻璃、128px 缩略能读。背景深度可以保留但对比度低于前景结构。不要加入人物、文字、UI、水印、logo。'
FRAME_PROMPT='帮我将这张图片重绘和清晰化，让它细节更丰富，同时去掉原图中杂乱不必要的细节。重要：这是 unlock toast 外框；外框保持厚重 stained-glass lead + amber-gold 边饰；内部镂空区域必须逐像素保持为纯 #ff00ff chroma-key，完全平整、无渐变、无纹理、无光照；不要把内部改成白色/黑色/场景。不要加入人物、文字、UI、水印。'

run_one() {
  local src="$1" out="$2" prompt="$3" ratio="$4"
  if [[ -f "$out" ]]; then echo "skip $out"; return 0; fi
  mkdir -p "$(dirname "$out")"
  echo "=== nanobanana $src -> $out ==="
  python3 "$NB" generate \
    --prompt "$prompt" \
    --input-image "$src" \
    --model nanobanana-pro \
    --ratio "$ratio" \
    --size 1K \
    --output "$out"
}

# stage plates ~3:2
for f in rootheart-backdrop rootheart-mid rootheart-ledge \
         leviathan-backdrop leviathan-mid leviathan-ledge \
         sovereign-backdrop sovereign-mid sovereign-ledge; do
  run_one "scratch/style-tests/round5/stage/sources/${f}.png" \
          "scratch/style-tests/round5/stage/nanobanana/${f}.png" \
          "$EVENT_PROMPT" "3:2"
done

# title layers wide
for f in round5-back round5-mid round5-foreground; do
  run_one "scratch/style-tests/round5/title/sources/${f}.png" \
          "scratch/style-tests/round5/title/nanobanana/${f}.png" \
          "$EVENT_PROMPT" "16:9"
done

# unlock frame
run_one "scratch/style-tests/round5/meta/sources/unlock-toast-frame.png" \
        "scratch/style-tests/round5/meta/nanobanana/unlock-toast-frame.png" \
        "$FRAME_PROMPT" "3:2"

echo "=== nanobanana done ==="
