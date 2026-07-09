#!/usr/bin/env bash
# Generate + post-process Draw/Discard/Ashes pile chrome masters.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

BATCH="scratch/pile-chrome-20260709"
CHROMA="/Users/jamesto/.codex/skills/imagegen/scripts/remove_chroma_key.py"
NB="/Users/jamesto/.codex/skills/nanobanana/scripts/nanobanana.py"
NB_PROMPT='帮我将这张图片重绘和清晰化，让他细节更丰富，同时去掉原图中杂乱不必要的细节。重要：背景不是艺术内容，必须逐像素保持为纯 #ff00ff chroma-key 背景；不要把背景改成白色、灰色、粉色渐变、黑色或任何场景；背景必须完全平整、单一颜色、无渐变、无纹理、无光照、无光晕、无阴影。请严格延续第一步的 alpha-ready 要求：主体完整、无裁切、无地面、无地线、无接触阴影、无投影、无反射、无贴边雾气、无文字、无标签、无水印；不要在主体中使用 #ff00ff。'
LEDGER="$BATCH/prompt-ledger.md"
LOG="$BATCH/gen-batch.log"

STYLE='Serious cartoon-gothic stained-glass game art: chunky dark outer silhouette, simplified exaggerated proportions, one iconic readable prop, 3-5 large jewel-tone glass colour masses with very few thick lead dividers, matte painterly texture, warm amber rim light, soft controlled inner glow. Designed to remain readable at 42px and 62px UI size. No text, no labels, no watermark. Square transparent-ready prop, solid #ff00ff background, no text. Single centred small card-stack prop only, generous 15 percent padding, no hands, no scene, no ground plane, no contact shadow. Same card body aspect and silhouette family across all three states. Do not use #ff00ff inside the subject. Subject:'

subject_for() {
  case "$1" in
    draw) echo "a neat sealed face-down card stack, cool parchment and lead glass panes, tidy aligned backs, unread deck chrome" ;;
    discard) echo "the same card-stack body slightly askew and worn, warmer spent parchment tone, used discard pile chrome" ;;
    ashes) echo "the same card-stack body with charred blackened edges and tiny ember flecks, burnt ashes pile chrome" ;;
    *) echo "UNKNOWN"; return 1 ;;
  esac
}

IDS=(draw discard ashes)

postprocess() {
  local id="$1"
  local src="$BATCH/source/${id}.png"
  local alpha_in="$src"
  local nb_out="$BATCH/source/${id}-nb.jpg"
  local used_nb=0

  if [[ -n "${GEMINI_API_KEY:-}" ]] && [[ -f "$NB" ]]; then
    set -a
    # shellcheck disable=SC1091
    [[ -f .env ]] && source .env
    set +a
    if python3 "$NB" generate \
      --prompt "$NB_PROMPT" \
      --input-image "$src" \
      --model nanobanana-pro \
      --ratio 1:1 \
      --size 1K \
      --output "$nb_out" >>"$LOG" 2>&1; then
      alpha_in="$nb_out"
      used_nb=1
      echo "Nano Banana ok for $id" | tee -a "$LOG"
    else
      echo "Nano Banana skipped/failed for $id; using gpt source" | tee -a "$LOG"
    fi
  else
    echo "Nano Banana unavailable; using gpt source for $id" | tee -a "$LOG"
  fi

  python3 "$CHROMA" \
    --input "$alpha_in" \
    --out "$BATCH/alpha/${id}.png" \
    --auto-key border \
    --soft-matte \
    --transparent-threshold 24 \
    --opaque-threshold 220 \
    --despill \
    --edge-contract 1 \
    --force
  python3 tools/strip-alpha-rim.py \
    --input "$BATCH/alpha/${id}.png" \
    --out "src/assets/piles/${id}.png" \
    --radius 6 \
    --mode darken
  sips -Z 512 "src/assets/piles/${id}.png" >/dev/null
  echo "postprocess $id used_nb=$used_nb" | tee -a "$LOG"
}

: > "$LOG"
{
  head -n "$(grep -n '^## Attempts' "$LEDGER" | head -1 | cut -d: -f1)" "$LEDGER"
  echo ""
  echo "| id | subject | source | notes |"
  echo "|---|---|---|---|"
} > "$LEDGER.tmp"
mv "$LEDGER.tmp" "$LEDGER"

mkdir -p "$BATCH/source" "$BATCH/alpha" src/assets/piles

fail=0
for id in "${IDS[@]}"; do
  subj="$(subject_for "$id")"
  echo "==== $(date '+%H:%M:%S') START $id ====" | tee -a "$LOG"
  if [[ ! -f "$BATCH/source/${id}.png" ]]; then
    if ! tools/imagegen.sh "$BATCH/source/${id}.png" "${STYLE} ${subj}" >>"$LOG" 2>&1; then
      echo "FAIL generate $id" | tee -a "$LOG"
      echo "| ${id} | ${subj} | source/${id}.png | FAILED generate |" >> "$LEDGER"
      fail=1
      continue
    fi
  else
    echo "source exists, skip generate: $id" | tee -a "$LOG"
  fi
  if ! postprocess "$id" >>"$LOG" 2>&1; then
    echo "FAIL postprocess $id" | tee -a "$LOG"
    echo "| ${id} | ${subj} | source/${id}.png | FAILED postprocess |" >> "$LEDGER"
    fail=1
    continue
  fi
  echo "| ${id} | ${subj} | source/${id}.png | ok |" >> "$LEDGER"
  echo "==== $(date '+%H:%M:%S') DONE $id ====" | tee -a "$LOG"
done

echo "==== DONE fail=$fail ====" | tee -a "$LOG"
ls -la src/assets/piles | tee -a "$LOG"
exit "$fail"
