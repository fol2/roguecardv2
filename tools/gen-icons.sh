#!/usr/bin/env bash
# gen-icons.sh — PWA icons from title banner or hero master ref
#
# Legacy (no args): write public/ + dist/ from the first available default source.
# Round 5: --public-only requires an explicit --source and never writes dist/.
set -euo pipefail
cd "$(dirname "$0")/.."

public_only=0
source_arg=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --public-only) public_only=1; shift ;;
    --source)
      source_arg="${2:-}"
      if [[ -z "$source_arg" ]]; then
        echo "gen-icons: --source requires a path" >&2
        exit 1
      fi
      shift 2
      ;;
    *)
      echo "gen-icons: unknown argument: $1" >&2
      exit 1
      ;;
  esac
done

if [[ "$public_only" -eq 1 ]]; then
  if [[ -z "$source_arg" ]]; then
    echo "gen-icons: Round 5 --public-only mode requires explicit --source before writing any output" >&2
    exit 1
  fi
  if [[ ! -f "$source_arg" ]]; then
    echo "gen-icons: source not found: $source_arg" >&2
    exit 1
  fi
  src="$source_arg"
  mkdir -p public
  sips -z 180 180 "$src" --out public/icon-180.png >/dev/null
  sips -z 512 512 "$src" --out public/icon-512.png >/dev/null
  # Feature / OG crops from the same source (public only).
  sips -z 500 1024 "$src" --out public/feature-graphic.png >/dev/null
  sips -z 630 1200 "$src" --out public/og.png >/dev/null
  echo "icons(public-only): public/icon-{180,512}.png public/feature-graphic.png public/og.png from $src"
  exit 0
fi

# Legacy no-argument mode (unchanged).
src="src/assets/title/banner.png"
[[ -f "$src" ]] || src="src/assets/heroes/duskblade.png"
[[ -f "$src" ]] || src="docs/refs/style-master.png"
if [[ -n "$source_arg" ]]; then
  src="$source_arg"
fi
mkdir -p public dist
sips -z 180 180 "$src" --out public/icon-180.png >/dev/null
sips -z 512 512 "$src" --out public/icon-512.png >/dev/null
cp public/icon-180.png dist/icon-180.png
cp public/icon-512.png dist/icon-512.png
sips -z 630 1200 "$src" --out public/og.png >/dev/null 2>&1 || true
cp public/og.png dist/og.png 2>/dev/null || true
echo "icons: public/icon-{180,512}.png (+ og.png if source allows)"
