#!/usr/bin/env bash
# genasset.sh — generate one game asset in the locked style (docs/style-bible.md).
#
# Usage:   tools/genasset.sh <category> <id> "<subject prompt>" [extra-ref.png ...]
# Example: tools/genasset.sh enemies duskfang "a prowling wolf-like dusk beast, ember-orange glass, glowing amber eyes"
set -euo pipefail
cd "$(dirname "$0")/.."

cat="${1:?usage: genasset.sh <category> <id> \"<subject>\" [ref.png ...]}"
id="${2:?usage: genasset.sh <category> <id> \"<subject>\" [ref.png ...]}"
subject="${3:?usage: genasset.sh <category> <id> \"<subject>\" [ref.png ...]}"
shift 3 || true

STYLE="Serious cartoon-gothic stained-glass game art: chunky dark outer silhouette, simplified exaggerated proportions, one iconic readable prop or pose, 3-5 large jewel-tone glass colour masses with very few thick lead dividers, matte painterly texture, warm amber rim light, soft controlled inner glow. Designed to remain readable at 128px. Readability priority: silhouette first, pose second, face/weapon/core symbol third, colour fourth, texture last. Fully transparent background (alpha channel). No text, no labels, no watermark"

case "$cat" in
  heroes)  comp="Full body, calm idle pose, facing slightly right, feet grounded, ~10% margin:"; size=1024 ;;
  enemies) comp="Full body, menacing idle pose, facing slightly left, ~10% margin:"; size=1024 ;;
  cards)   comp="A single centred emblem or moment, square composition, dark vignette edges:"; size=512 ;;
  props)   comp="A single centred object:"; size=512 ;;
  potions) comp="A single centred glass phial:"; size=256 ;;
  events)  comp="A wide scene, focal point centre-right:"; size=1024 ;;
  title)   comp="A wide hero banner:"; size=1536 ;;
  *) echo "unknown category: $cat" >&2; exit 1 ;;
esac

out="src/assets/$cat/$id.png"
tools/imagegen.sh "$out" "$comp $subject. $STYLE" docs/refs/style-master.png "$@"
sips -Z "$size" "$out" > /dev/null
echo "Asset: $out"
