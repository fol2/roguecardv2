#!/usr/bin/env bash
# Generate + post-process all 17 status emblems.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

BATCH="scratch/status-batch-20260708"
CHROMA="/Users/jamesto/.codex/skills/imagegen/scripts/remove_chroma_key.py"
LEDGER="$BATCH/prompt-ledger.md"
LOG="$BATCH/gen-batch.log"

STYLE='Serious cartoon-gothic stained-glass game art: chunky dark outer silhouette, simplified exaggerated proportions, one iconic readable prop or pose, 3-5 large jewel-tone glass colour masses with very few thick lead dividers, matte painterly texture, warm amber rim light, soft controlled inner glow. Designed to remain readable at 32px and 128px. No text, no labels, no watermark. Square transparent-ready emblem, solid #ff00ff background, no text. Single centred emblem, generous 15 percent padding, no hands, no scene, no ground plane, no contact shadow. Do not use #ff00ff inside the subject. Subject:'

subject_for() {
  case "$1" in
    str) echo "a stoked lantern flame rising through cracked amber glass" ;;
    dex) echo "a blue glass ward crescent braced like a poised stance" ;;
    vulnerable) echo "a diamond pane with a bright scored X fault" ;;
    weak) echo "a guttering blue flame bent downward" ;;
    frail) echo "a thin wine-glass pane spiderweb-cracked" ;;
    poison) echo "a coal ember trailing green-grey smoke ribbons" ;;
    thorns) echo "a glass orb bristling with outward crystal spikes" ;;
    ritual) echo "a crescent moon of leaded glass dripping wax-light" ;;
    metallicize) echo "a hexagonal vitrified plate with cool iron sheen" ;;
    regen) echo "a green repair vine knitting a cracked blue pane" ;;
    barricade) echo "a fortified glass bastion block, annealed and solid" ;;
    energized) echo "a lightning-bolt shard of white-gold glass" ;;
    venomous) echo "a hooked glass fang weeping one amber Smolder drop" ;;
    rampage) echo "three rising attack arcs growing larger" ;;
    beacon) echo "a sunburst lantern chip casting facet-cutting rays" ;;
    emberflow) echo "a heart-shaped furnace coal orbiting tiny embers" ;;
    nightsight) echo "a crescent eye-lantern revealing one hidden glint" ;;
    *) echo "UNKNOWN"; return 1 ;;
  esac
}

IDS=(str dex vulnerable weak frail poison thorns ritual metallicize regen barricade energized venomous rampage beacon emberflow nightsight)

postprocess() {
  local id="$1"
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
    --out "src/assets/statuses/${id}.png" \
    --radius 6 \
    --mode darken
  sips -Z 512 "src/assets/statuses/${id}.png" >/dev/null
}

: > "$LOG"
# Reset attempts table body (keep header through ## Attempts)
{
  head -n "$(grep -n '^## Attempts' "$LEDGER" | head -1 | cut -d: -f1)" "$LEDGER"
  echo ""
  echo "| id | subject | source | notes |"
  echo "|---|---|---|---|"
} > "$LEDGER.tmp"
mv "$LEDGER.tmp" "$LEDGER"

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
ls -la src/assets/statuses | tee -a "$LOG"
exit "$fail"
