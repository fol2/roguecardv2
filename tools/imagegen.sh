#!/usr/bin/env bash
# imagegen.sh — generate an image via the Codex CLI's built-in image tool.
#
# Usage:   tools/imagegen.sh <output-path> "<prompt>" [reference.png ...]
# Example: tools/imagegen.sh public/hero.png "A glass tower lit by lanterns, ink-black sky, no text"
#
# Runs on the ChatGPT/Codex plan (this machine is `codex login status` = ChatGPT),
# not per-image API billing. See docs/imagegen.md for the full story.
set -euo pipefail

out="${1:?usage: imagegen.sh <output-path> \"<prompt>\" [reference.png ...]}"
prompt="${2:?usage: imagegen.sh <output-path> \"<prompt>\" [reference.png ...]}"
shift 2 || true

# Collect any reference images as absolute paths. NB: `-i` is variadic and
# would swallow the prompt argument, so use the `--image=FILE` form instead.
refs=()
for r in "$@"; do
  refs+=( "--image=$(cd "$(dirname "$r")" && pwd)/$(basename "$r")" )
done

# workspace-write only permits writes under the cwd, so run codex from the
# output directory and hand it a relative filename.
mkdir -p "$(dirname "$out")"
outdir="$(cd "$(dirname "$out")" && pwd)"
base="$(basename "$out")"

(
  cd "$outdir"
  # NOTE: \$imagegen must reach codex literally, hence the backslash.
  codex exec --skip-git-repo-check -s workspace-write "${refs[@]+"${refs[@]}"}" \
    "\$imagegen ${prompt}. Save the result as ./${base}." < /dev/null
)

echo "Saved: ${outdir}/${base}"
