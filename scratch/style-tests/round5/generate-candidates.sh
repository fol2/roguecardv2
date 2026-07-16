#!/usr/bin/env bash
# Generate Round 5 P7 ship-front candidates via Codex imagegen + post.
# Run from FE worktree root. ChatGPT-plan billing.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
cd "$ROOT"
IMG=tools/imagegen.sh
POST=scratch/style-tests/round5/_post.py
STAGE=scratch/style-tests/round5/stage
TITLE=scratch/style-tests/round5/title
META=scratch/style-tests/round5/meta

gen() {
  local out="$1" prompt="$2"; shift 2
  if [[ -f "$out" ]]; then echo "skip existing $out"; return 0; fi
  echo "=== generate $out ==="
  "$IMG" "$out" "$prompt" "$@"
}

# --- STAGE: boss plates (refs = act plates for style/horizon lock) ---
# rootheart = Act 1 intensified sap/root heart
gen "$STAGE/sources/rootheart-backdrop.png" \
  "Use case: stylized-concept. Asset type: Spirebound Act 1 boss stage backdrop plate. Primary request: ash-woods night horizon intensified for The Rootheart boss — distant skeletal forest hills with glowing amber sap veins and a buried heart-of-roots silhouette in the far valley, left edge weathered stone tower fragment with amber gothic window. Style: serious cartoon-gothic stained-glass game art matching the reference plate; chunky lead lines; 3-5 large colour masses; painterly matte. Composition: 3:2 wide 1536x1024 game plate; landscape sits in lower half; upper sky is pure solid black void for UI. Constraints: no text, no UI, no watermark, no characters, no wordmark. Keep horizon and ground line compatible with the reference." \
  src/assets/stage/act1-backdrop.png

gen "$STAGE/sources/rootheart-mid.png" \
  "Use case: stylized-concept. Asset type: Spirebound Act 1 boss stage mid plate. Primary request: ruined gothic stone archway twisted by living roots and amber sap lanterns for The Rootheart — roots pierce the arch, two hanging amber lanterns, floating embers. Style matching reference mid plate. Composition: centered arch on pure solid black void background; transparent-ready black surrounds the subject; no ground plane beyond the arch base rubble. Constraints: no text, no UI, no characters, no watermark." \
  src/assets/stage/act1-mid.png

gen "$STAGE/sources/rootheart-ledge.png" \
  "Use case: stylized-concept. Asset type: Spirebound Act 1 boss stage ledge plate. Primary request: cracked stone combat ledge/platform with amber sap glowing in cracks and root tendons gripping the rim for The Rootheart. Style matching reference ledge. Composition: isometric 3/4 stone terrace on pure solid black void; platform in lower portion. Constraints: no text, no UI, no characters, no watermark." \
  src/assets/stage/act1-ledge.png

# leviathan = Act 2 intensified deep mouth / drowned cathedral
gen "$STAGE/sources/leviathan-backdrop.png" \
  "Use case: stylized-concept. Asset type: Spirebound Act 2 boss stage backdrop plate. Primary request: drowned sea-cathedral city intensified for The Leviathan — submerged gothic spires, teal god-rays, a vast distant whale-jaw silhouette framing the deep, kelp strands. Style matching reference. Composition: 3:2 wide; scene fills middle; pure solid black void at extreme edges/top for UI. Constraints: no text, no UI, no characters, no watermark." \
  src/assets/stage/act2-backdrop.png

gen "$STAGE/sources/leviathan-mid.png" \
  "Use case: stylized-concept. Asset type: Spirebound Act 2 boss stage mid plate. Primary request: drowned gothic midground structure — broken sea-arch with barnacles, hanging brine lanterns glowing cyan-teal, bubbles, for The Leviathan. Style matching reference mid plate. Composition: subject centered on pure solid black void. Constraints: no text, no UI, no characters, no watermark." \
  src/assets/stage/act2-mid.png

gen "$STAGE/sources/leviathan-ledge.png" \
  "Use case: stylized-concept. Asset type: Spirebound Act 2 boss stage ledge plate. Primary request: wet stone combat ledge with shell inlays, tide pools, cyan brine glow in cracks for The Leviathan. Style matching reference ledge. Composition: isometric terrace on pure solid black void. Constraints: no text, no UI, no characters, no watermark." \
  src/assets/stage/act2-ledge.png

# sovereign = Act 3 astral court
gen "$STAGE/sources/sovereign-backdrop.png" \
  "Use case: stylized-concept. Asset type: Spirebound Act 3 boss stage backdrop plate. Primary request: cracked astral court horizon for The Sovereign — obsidian peaks, broken orbit ring glowing cyan-white behind central peak, hot magenta judgement veins, bruised violet clouds. Style matching reference. Composition: 3:2 wide; landscape lower portion; pure solid black void upper sky for UI. Constraints: no text, no UI, no characters, no watermark, no galaxy body clutter." \
  src/assets/stage/act3-backdrop.png

gen "$STAGE/sources/sovereign-mid.png" \
  "Use case: stylized-concept. Asset type: Spirebound Act 3 boss stage mid plate. Primary request: cracked astral-court arch or broken orbit gateway with magenta core glow and tarnished-gold accents for The Sovereign. Style matching reference mid. Composition: subject on pure solid black void. Constraints: no text, no UI, no characters, no watermark." \
  src/assets/stage/act3-mid.png

gen "$STAGE/sources/sovereign-ledge.png" \
  "Use case: stylized-concept. Asset type: Spirebound Act 3 boss stage ledge plate. Primary request: obsidian court combat ledge with cracked orbit inlays and magenta light in seams for The Sovereign. Style matching reference ledge. Composition: isometric terrace on pure solid black void. Constraints: no text, no UI, no characters, no watermark." \
  src/assets/stage/act3-ledge.png

# --- TITLE parallax layers (no wordmark) ---
gen "$TITLE/sources/round5-back.png" \
  "Use case: stylized-concept. Asset type: Spirebound title parallax far layer. Primary request: distant stained-glass dusk sky and far Obsidian Spire silhouette with soft amber motes; atmosphere only. Composition: very wide cinematic banner; subject low; generous empty dark space for UI. Constraints: no text, no logo, no wordmark, no UI, no watermark, no characters."

gen "$TITLE/sources/round5-mid.png" \
  "Use case: stylized-concept. Asset type: Spirebound title parallax mid layer. Primary request: mid-distance cathedral glass shards and lantern clusters floating, stained-glass colour masses, transparent-ready solid black surround. Constraints: no text, no logo, no wordmark, no UI, no watermark, no characters."

gen "$TITLE/sources/round5-foreground.png" \
  "Use case: stylized-concept. Asset type: Spirebound title parallax near layer. Primary request: near foreground dark stone ledge edges and hanging amber lanterns framing lower corners only; center mostly empty black for wordmark fallback. Constraints: no text, no logo, no wordmark, no UI, no watermark, no characters."

# --- META unlock toast frame ---
gen "$META/sources/unlock-toast-frame.png" \
  "Use case: stylized-concept. Asset type: Spirebound unlock toast frame. Primary request: ornate stained-glass rectangular toast frame with thick dark lead border, amber-gold trim, empty transparent-ready solid magenta #ff00ff interior cutout rectangle for illustration; no text inside. Constraints: no text, no logo, no watermark, no characters; interior must be flat #ff00ff only."

echo "=== all sources generated ==="
