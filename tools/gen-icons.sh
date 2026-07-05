#!/usr/bin/env bash
# gen-icons.sh — PWA icons from title banner or hero master ref
set -euo pipefail
cd "$(dirname "$0")/.."
src="src/assets/title/banner.png"
[[ -f "$src" ]] || src="src/assets/heroes/duskblade.png"
[[ -f "$src" ]] || src="docs/refs/style-master.png"
mkdir -p public dist
sips -z 180 180 "$src" --out public/icon-180.png >/dev/null
sips -z 512 512 "$src" --out public/icon-512.png >/dev/null
cp public/icon-180.png dist/icon-180.png
cp public/icon-512.png dist/icon-512.png
sips -z 630 1200 "$src" --out public/og.png >/dev/null 2>&1 || true
cp public/og.png dist/og.png 2>/dev/null || true
echo "icons: public/icon-{180,512}.png (+ og.png if source allows)"
