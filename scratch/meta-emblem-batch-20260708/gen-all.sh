#!/usr/bin/env bash
# Generate + post-process deed, bequest, and monument-node emblems.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

BATCH="scratch/meta-emblem-batch-20260708"
CHROMA="/Users/jamesto/.codex/skills/imagegen/scripts/remove_chroma_key.py"
LEDGER="$BATCH/prompt-ledger.md"
LOG="$BATCH/gen-batch.log"

STYLE='Serious cartoon-gothic stained-glass game art: chunky dark outer silhouette, simplified exaggerated proportions, one iconic readable prop or pose, 3-5 large jewel-tone glass colour masses with very few thick lead dividers, matte painterly texture, warm amber rim light, soft controlled inner glow. Designed to remain readable at 32px and 128px. No text, no labels, no watermark. Square transparent-ready emblem, solid #ff00ff background, no text. Single centred emblem, generous 15 percent padding, no hands, no scene, no ground plane, no contact shadow. Do not use #ff00ff inside the subject. Subject:'

# id|kind|subject  — kind is deeds|bequests|meta
ENTRIES=(
  'paneBreaker|deeds|a shattered facet diamond spilling bright shards'
  'lanternFed|deeds|a lantern mouth accepting a burning card pane as fuel'
  'ashSermon|deeds|green-grey Smolder ribbons claiming a fallen glass body'
  'untouched|deeds|an uncracked mirror pane with a tight cyan aura'
  'darkWalker|deeds|an unlit lantern silhouette on a black path'
  'spendthrift|deeds|embers streaming from an open lantern into a spell burst'
  'hundredShards|deeds|a heap of one hundred tiny glass shards, readable as many not counted'
  'firstDawn|deeds|a single sunrise wedge over a black spire tip'
  'relic|bequests|a carved stone niche holding a glowing relic silhouette'
  'card|bequests|a stone tablet bearing one upright card pane'
  'gold|bequests|a stone cache spilling warm gold coins'
  'monument-node|meta|a small standing stone marker with a single memorial flame, readable at 32px'
)

final_path() {
  local id="$1" kind="$2"
  echo "src/assets/${kind}/${id}.png"
}

postprocess() {
  local id="$1" kind="$2"
  local final
  final="$(final_path "$id" "$kind")"
  python3 "$CHROMA" \
    --input "$BATCH/source/${id}.png" \
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
    --out "$final" \
    --radius 6 \
    --mode darken
  sips -Z 512 "$final" >/dev/null
}

: > "$LOG"
{
  head -n "$(grep -n '^## Attempts' "$LEDGER" | head -1 | cut -d: -f1)" "$LEDGER"
  echo ""
  echo "| id | subject | source | notes |"
  echo "|---|---|---|---|"
} > "$LEDGER.tmp"
mv "$LEDGER.tmp" "$LEDGER"

mkdir -p src/assets/deeds src/assets/bequests src/assets/meta \
  "$BATCH/source" "$BATCH/alpha"

fail=0
for entry in "${ENTRIES[@]}"; do
  IFS='|' read -r id kind subj <<< "$entry"
  echo "==== $(date '+%H:%M:%S') START $id ($kind) ====" | tee -a "$LOG"
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
  if ! postprocess "$id" "$kind" >>"$LOG" 2>&1; then
    echo "FAIL postprocess $id" | tee -a "$LOG"
    echo "| ${id} | ${subj} | source/${id}.png | FAILED postprocess |" >> "$LEDGER"
    fail=1
    continue
  fi
  echo "| ${id} | ${subj} | source/${id}.png | ok |" >> "$LEDGER"
  echo "==== $(date '+%H:%M:%S') DONE $id ====" | tee -a "$LOG"
done

echo "==== DONE fail=$fail ====" | tee -a "$LOG"
ls -la src/assets/deeds src/assets/bequests src/assets/meta | tee -a "$LOG"
exit "$fail"
