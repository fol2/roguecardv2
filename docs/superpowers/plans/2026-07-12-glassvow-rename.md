# Glassvow Brand Rename Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rename the game's display/brand title from **Spirebound** to **Glassvow** (Chinese title **琉璃誓**) across every player-facing surface, while leaving the internal engineering name Spirebound untouched everywhere it is load-bearing.

**Architecture:** This is a display-layer-only rename. The brand lives in exactly four runtime surfaces (i18n brand strings, `index.html` metadata, PWA manifest, and the raster wordmark `src/assets/title/title.png`) plus two docs surfaces (`README.md`, `AGENTS.md`). The wordmark is regenerated as stained-glass art via the Codex imagegen workflow, which invalidates six visual baselines per platform (title + title-emberglass × desktop/portrait/landscape). Linux baselines can only be produced by the `update-baselines.yml` GitHub workflow.

**Tech Stack:** Vite vanilla JS, Playwright visual baselines, `tools/imagegen.sh` (Codex CLI image tool), Python PIL for alpha-trim, `gh` CLI for the linux-baseline workflow.

## Global Constraints

- **Never change these** (internal engineering name stays Spirebound):
  - localStorage keys: `spirebound_save_v2`, `spirebound_stats_v1`, `spirebound_vigil_v2` (and legacy `spirebound_vigil_v1`), `spirebound_vol_music`, `spirebound_mute_music`, `spirebound_vol_sfx`, `spirebound_mute_sfx`, legacy `spirebound_mute`
  - `window.spirebound` debug/test hook (test/e2e helpers depend on it)
  - `package.json` `"name": "spirebound"`
  - env var `SPIREBOUND_E2E_PORT` (test/e2e/config.spec.js asserts its error message)
  - file-header comments (`// SPIREBOUND engine — …` etc.) and internal docs' style vocabulary ("Spirebound raster style" in art bibles)
  - the in-world tower name "the Spire" (lore, card text, meta descriptions like "Climb the Spire")
- **Exact brand strings** (copy verbatim): wordmark/all-caps `GLASSVOW`; prose `Glassvow`; Chinese title `琉璃誓`; tagline is unchanged: `A Roguelite Deckbuilder · The Vigil Remembers`.
- The Chinese title appears in docs/store copy only — **not** in runtime UI (the game ships no CJK glyphs).
- `CLAUDE.md` is a symlink to `AGENTS.md` — edit **AGENTS.md only**, never the symlink.
- All work on branch `feat/glassvow-rename`. `dist/` is committed in this repo; it is rebuilt once, in Task 5, not in every task.
- The new wordmark must keep roughly the current canvas shape (1536 px wide, ≈3.5–4.5:1 aspect; current file is 1536×396). CSS (`.logo-raster` width `min(780px, 88cqw)`, `.title-wordmark` `width:100%; height:auto`) is width-driven, so a wildly taller image would push the title layout.
- Visual quality bar: the wordmark is title art — it must match the existing stained-glass letterform quality (amber/gold panes, black leading). Do not settle for a first draft with mangled letters.

---

### Task 0: Branch

**Files:** none

- [ ] **Step 1: Create the working branch from up-to-date main**

```bash
cd /Users/jamesto/Coding/roguecardv2
git checkout main && git pull && git checkout -b feat/glassvow-rename
```

Expected: `Switched to a new branch 'feat/glassvow-rename'`

---

### Task 1: Runtime brand strings (i18n + index.html + manifest)

**Files:**
- Modify: `src/i18n/en/ui.js:11`
- Modify: `index.html:6-14`
- Modify: `public/manifest.webmanifest:2-3`

**Interfaces:**
- Consumes: nothing.
- Produces: `tr('ui.brand.title')` now returns `'GLASSVOW'` — this is both the wordmark `alt` text and the text fallback at `src/ui.js:1049`. Task 4's snapshots and Task 5's build pick this up.

- [ ] **Step 1: Confirm the current strings (pre-change check)**

```bash
rg -n "Spirebound|SPIREBOUND" src/i18n/en/ui.js index.html public/manifest.webmanifest
```

Expected: exactly 6 hits — `ui.js:11` (`title: 'SPIREBOUND'`), `index.html` `<title>`, `og:title`, `apple-mobile-web-app-title`, and manifest `name` + `short_name`.

- [ ] **Step 2: Apply the three edits**

`src/i18n/en/ui.js` — replace:

```js
    title: 'SPIREBOUND',
```

with:

```js
    title: 'GLASSVOW',
```

`index.html` — replace these three lines:

```html
  <title>Spirebound — A Roguelite Deckbuilder</title>
  <meta property="og:title" content="Spirebound" />
  <meta name="apple-mobile-web-app-title" content="Spirebound" />
```

with:

```html
  <title>Glassvow — A Roguelite Deckbuilder</title>
  <meta property="og:title" content="Glassvow" />
  <meta name="apple-mobile-web-app-title" content="Glassvow" />
```

(The `<meta name="description">` line keeps "Climb the Spire…" — the Spire is the in-world tower, not the brand.)

`public/manifest.webmanifest` — replace:

```json
  "name": "Spirebound",
  "short_name": "Spirebound",
```

with:

```json
  "name": "Glassvow",
  "short_name": "Glassvow",
```

- [ ] **Step 3: Verify no brand-facing Spirebound remains in runtime surfaces**

```bash
rg -n "Spirebound|SPIREBOUND" src/i18n/ index.html public/manifest.webmanifest; rg -c "GLASSVOW" src/i18n/en/ui.js
```

Expected: zero hits from the first command; `1` from the second.

- [ ] **Step 4: Run the Node gates**

```bash
npm test && npm run test:ci
```

Expected: `npm test` ends with `unit checks passed; monte-carlo: 300 runs, ...` (low win count is normal); `test:ci` exits 0.

- [ ] **Step 5: Commit**

```bash
git add src/i18n/en/ui.js index.html public/manifest.webmanifest
git commit -m "feat: rename display brand to Glassvow in runtime strings

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: Brand docs (README + AGENTS.md naming layers)

**Files:**
- Modify: `README.md:1-3`
- Modify: `AGENTS.md:7` (CLAUDE.md is a symlink — do not touch it)

**Interfaces:**
- Consumes: nothing.
- Produces: the canonical naming-layers paragraph other docs/sessions will cite.

- [ ] **Step 1: Update README heading and add the naming note**

Replace line 1 of `README.md`:

```markdown
# SPIREBOUND
```

with:

```markdown
# GLASSVOW ・ 琉璃誓
```

Then insert this paragraph immediately after the existing first paragraph (after README line 3):

```markdown
**Naming layers:** *Glassvow* (Chinese: **琉璃誓**) is the display/brand title — tagline "The Vigil Remembers"; store flavor line "Climb beneath a vow of glass and flame." The title's Vow is thematic; the in-game five-step Vows difficulty ladder still unlocks after the first dawn, as a deliberate title payoff. *Spirebound* remains the internal engineering name: the repo, `package.json` name, the `spirebound_*` localStorage keys, the `window.spirebound` debug hook, and the in-world tower ("the Spire") are all unchanged, deliberately — saves and test anchors must survive the rename.
```

- [ ] **Step 2: Update AGENTS.md intro line**

In `AGENTS.md` line 7, replace the opening:

```markdown
**Spirebound** — a complete browser roguelite deckbuilder
```

with:

```markdown
**Glassvow** (display title; the internal engineering name **Spirebound** stays on the repo, package, `spirebound_*` save keys, and `window.spirebound` hook) — a complete browser roguelite deckbuilder
```

- [ ] **Step 3: Verify**

```bash
head -1 README.md; rg -n "Glassvow" README.md AGENTS.md | head
```

Expected: heading `# GLASSVOW ・ 琉璃誓`; both files show the new name.

- [ ] **Step 4: Commit**

```bash
git add README.md AGENTS.md
git commit -m "docs: document Glassvow / 琉璃誓 brand and naming layers

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: GLASSVOW stained-glass wordmark (title.png) — **has a user checkpoint**

**Files:**
- Create (workspace, untracked): `scratch/title-glassvow/candidate-{a,b,c}.png`
- Modify: `src/assets/title/title.png` (1536×~396 RGBA, transparent background)

**Interfaces:**
- Consumes: current `src/assets/title/title.png` as the style reference image.
- Produces: the new wordmark that Task 4's six baselines snapshot. `src/ui.js:1043` loads it via `assetUrl('title', 'title')` — same path, no code change.

- [ ] **Step 1: Generate three candidates with the current wordmark as style reference**

```bash
mkdir -p scratch/title-glassvow
for v in a b c; do tools/imagegen.sh scratch/title-glassvow/candidate-$v.png \
  "Video game logo wordmark: the single word GLASSVOW in ornate stained-glass lettering, matching the reference image's style exactly — amber and golden glass panes separated by heavy black lead came outlines, occasional cool blue-violet glass fragments in letter corners, gothic serif letterforms with sharp tapered spurs and a warm inner glow. Spelled exactly G-L-A-S-S-V-O-W, one word, all capitals. Wide horizontal composition on a fully transparent background. No scenery, no border, no other text." \
  src/assets/title/title.png; done
```

Expected: three PNGs in `scratch/title-glassvow/`. (Runs on the ChatGPT/Codex plan; see `docs/imagegen.md` for flags and gotchas.)

- [ ] **Step 2: Review candidates**

Read each PNG. Reject any with: misspelling (most common failure — verify letter-by-letter G,L,A,S,S,V,O,W), broken/merged letterforms, opaque background, or style drift from the reference. If all three fail, regenerate (vary the prompt's letterform wording); after ~6 failures, stop and report to the user rather than shipping a weak mark.

- [ ] **Step 3: USER CHECKPOINT — present the best candidate (plus runners-up) to the user for approval before proceeding**

- [ ] **Step 4: Alpha-trim and resize the approved candidate to the runtime canvas**

```bash
python3 -c "from PIL import Image" 2>/dev/null || pip3 install --user pillow
python3 - <<'EOF'
from PIL import Image
im = Image.open('scratch/title-glassvow/candidate-a.png').convert('RGBA')  # swap to the approved file
bbox = im.getchannel('A').getbbox()
im = im.crop(bbox)
w = 1536
im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
im.save('src/assets/title/title.png')
print('final size:', im.size)
EOF
```

Expected: `final size: (1536, <330–470>)`. If height falls outside that band, the source composition is too square — regenerate rather than distort.

- [ ] **Step 5: Eyeball in the running game**

```bash
npm run dev &
sleep 3 && npx playwright screenshot --viewport-size=1280,720 "http://localhost:5174/?shape=desktop-landscape" scratch/title-glassvow/in-game.png
```

Read `scratch/title-glassvow/in-game.png`: wordmark centered, glow filter reading well, tagline beneath, no layout push. Stop the dev server after.

- [ ] **Step 6: Commit**

```bash
git add src/assets/title/title.png
git commit -m "art: GLASSVOW stained-glass title wordmark

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: Refresh darwin visual baselines for the title screens

**Files:**
- Modify: `test/e2e/visual.spec.js-snapshots/title-{desktop,portrait,landscape}-darwin.png`
- Modify: `test/e2e/visual.spec.js-snapshots/title-emberglass-{desktop,portrait,landscape}-darwin.png`

**Interfaces:**
- Consumes: Task 1's brand strings and Task 3's wordmark.
- Produces: green darwin visual lane; linux twins arrive in Task 6.

- [ ] **Step 1: Regenerate only the title snapshots (darwin)**

```bash
npx playwright install chromium 2>/dev/null | tail -1
npx playwright test visual --project=desktop --project=portrait --project=landscape --workers=1 --no-deps --update-snapshots --grep "title"
```

Expected: the two title tests (`title screen`, `title with Emberglass medallion`) rewrite 6 `-darwin.png` files; `git status` shows exactly those six.

- [ ] **Step 2: Eyeball one regenerated baseline**

Read `test/e2e/visual.spec.js-snapshots/title-desktop-darwin.png` — it must show GLASSVOW, not Spirebound.

- [ ] **Step 3: Verify the lane is green without `--update-snapshots`**

```bash
npx playwright test visual --project=desktop --project=portrait --project=landscape --workers=1 --no-deps --grep "title"
```

Expected: all title visual tests PASS.

- [ ] **Step 4: Commit**

```bash
git add test/e2e/visual.spec.js-snapshots/title*-darwin.png
git commit -m "test: refresh darwin title baselines for Glassvow wordmark

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 5: Full local gate + rebuild dist

**Files:**
- Modify: `dist/` (committed by design in this repo — large diff expected)

**Interfaces:**
- Consumes: everything above.
- Produces: the deployable bundle carrying the new brand.

- [ ] **Step 1: Run the local gates**

```bash
npm test && npm run test:ci && npm run test:e2e:smoke
```

Expected: engine line `unit checks passed; monte-carlo: 300 runs, ...`; smoke lane PASS. (The complete e2e gate runs in CI when the PR goes Ready.)

- [ ] **Step 2: Rebuild dist**

```bash
npm run build
rg -c "GLASSVOW|Glassvow" dist/index.html
```

Expected: build succeeds; count ≥ 1 (the `<title>`/meta strings).

- [ ] **Step 3: Commit dist**

```bash
git add dist
git commit -m "chore: rebuild dist for Glassvow brand

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 6: PR + linux baselines via workflow

**Files:**
- Modify: `test/e2e/visual.spec.js-snapshots/title*-linux.png` (6 files, from CI artifact)

**Interfaces:**
- Consumes: the pushed branch; `update-baselines.yml` (manual dispatch, uploads artifact `visual-baselines-linux`).
- Produces: a Ready PR with a green full gate (`unit` + `e2e` aggregate checks).

- [ ] **Step 1: Push and open a draft PR**

```bash
git push -u origin feat/glassvow-rename
gh pr create --draft --title "Glassvow brand rename (display layer only)" --body "$(cat <<'EOF'
Renames the display/brand title Spirebound → **Glassvow ・ 琉璃誓** across runtime strings (i18n brand, index.html metas, PWA manifest), the stained-glass title wordmark, README/AGENTS naming docs, and the affected title visual baselines (darwin + linux). Internal names are deliberately untouched: `spirebound_*` save keys, `window.spirebound`, package name, `SPIREBOUND_E2E_PORT`, and the in-world tower "the Spire".

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

Expected: draft PR URL; draft CI (unit/build/smoke) goes green.

- [ ] **Step 2: Dispatch the linux baseline workflow on the branch and wait**

```bash
gh workflow run update-baselines.yml --ref feat/glassvow-rename
sleep 20 && gh run list --workflow=update-baselines.yml --branch feat/glassvow-rename --limit 1
gh run watch $(gh run list --workflow=update-baselines.yml --branch feat/glassvow-rename --limit 1 --json databaseId -q '.[0].databaseId') --exit-status
```

Expected: run completes successfully (~15–30 min; it regenerates the full visual suite on ubuntu).

- [ ] **Step 3: Download the artifact and take only the six title baselines**

```bash
tmp=$(mktemp -d)
gh run download $(gh run list --workflow=update-baselines.yml --branch feat/glassvow-rename --limit 1 --json databaseId -q '.[0].databaseId') -n visual-baselines-linux -D "$tmp"
cp "$tmp"/title-desktop-linux.png "$tmp"/title-portrait-linux.png "$tmp"/title-landscape-linux.png \
   "$tmp"/title-emberglass-desktop-linux.png "$tmp"/title-emberglass-portrait-linux.png "$tmp"/title-emberglass-landscape-linux.png \
   test/e2e/visual.spec.js-snapshots/
git status --short
```

Expected: exactly six modified `title*-linux.png`. (Do **not** copy the rest of the artifact — unrelated baselines must not churn in this PR.) Read `test/e2e/visual.spec.js-snapshots/title-desktop-linux.png` to confirm it shows GLASSVOW.

- [ ] **Step 4: Commit, push, mark Ready**

```bash
git add test/e2e/visual.spec.js-snapshots/title*-linux.png
git commit -m "test: refresh linux title baselines for Glassvow wordmark

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
git push
gh pr ready
```

Expected: Ready triggers the complete parallel Playwright gate; wait for aggregate checks `unit` and `e2e` to go green (`gh pr checks --watch`). Report the PR URL and check status to the user.

---

## Post-plan notes (not tasks)

- Off-repo brand actions the user should do promptly if committing to the name publicly: register `glassvow.com` / `glassvow.game` / `glassvowgame.com` (all three unregistered as of 2026-07-12), grab store/social handles, and run formal trademark clearance.
- `og.png`, `icon-180.png`, `icon-512.png`, and `title-background/background.png` contain no wordmark text — deliberately unchanged.
- The Emberglass quest chain keeps its name everywhere (now a pure in-game artifact with no title clash).
