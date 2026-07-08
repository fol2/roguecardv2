# Vigil Surfaces & Status Art — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship missing raster categories for combat status (17) and Vigil meta surfaces (end scene plates, 8 deeds, 3 bequest kinds, map monument node), with a larger status strip (icon + stack n≥2, no name) — presentation only.

**Architecture:** Engine / `vigil.js` untouched. New folders under `src/assets/` resolve via existing `assetUrl(category, id)`; `art.js` SVG (`st-*`, `monument`, new deed/bequest fallbacks) stays the zero-asset path. `statusChips` and end/Vigil/map markup hang rasters; strip grows `.cplate` downward so `geometry.spec` stays green.

**Tech Stack:** Vite + vanilla JS; Playwright visual/geometry/battle gates; imagegen via `docs/generated-art-workflow.md` + `tools/imagegen.sh` for asset tasks.

**Spec:** `docs/superpowers/specs/2026-07-08-vigil-surfaces-status-art-design.md`

## File map

| File | Responsibility |
|---|---|
| `docs/status-art-bible.md` | Style + 17 status subject rows |
| `docs/meta-art-bible.md` | Scene-plate rules + deeds / bequests / monument-node subjects |
| `src/assets/statuses/*.png` | 17 status emblems |
| `src/assets/deeds/*.png` | 8 deed emblems |
| `src/assets/bequests/{relic,card,gold}.png` | Bequest-kind emblems |
| `src/assets/meta/{fallen,ascended,monument-node}.png` | End scenes + map node |
| `src/art.js` | Optional SVG fallbacks for `deed-*` / `bequest-*` (status `st-*` and `monument` already exist) |
| `src/ui.js` | `statusChips`, `metaBg`, `showVigil`, `renderEnd` / bequest, map monument `<image>`, gallery cats |
| `src/styles.css` | `.status-row` / `.schip` strip; `.meta-bg`; deed / bequest art slots |
| `test/test_engine.js` | Manifest gates for new categories |
| `test/e2e/visual.spec.js` + snapshots | Baselines after pixels change |

## Global Constraints

- `npm test` green at every task boundary; never import Playwright / `stage.js` / `audio.js` from `engine.js` / `vigil.js`.
- Internal keys immutable (`STATUS_INFO` / `DEEDS` / bequest `kind` strings).
- Status strip: ~32px icon; **no name**; stack badge only when **n ≥ 2**; tooltip via existing `_tip` + press-hold.
- Strip / chrome grows **downward only** — `geometry.spec` feet ±2px must stay green.
- Missing PNG → today's SVG/CSS look; never blank or throw.
- Emblems: 512×512, alpha, ~15% margin (same as `docs/icon-art-bible.md`). Scene plates: full narrative, no chroma cutout (same spirit as event art); normalise max edge 1024px.
- `REDUCED` / LITE: no new motion required for these surfaces.
- Do not commit `test-results/` or `playwright-report/`. Commit `dist/` only in the final sweep task (or when a task explicitly says so); intermediate tasks may skip `dist/` to avoid thrash.
- Imagegen unavailable → generation task reports **BLOCKED**; never fabricate PNGs.
- Commit after every task with the message given; never `--no-verify`, never amend.

---

### Task 1: Status art bible + gallery wiring (zero PNGs)

Wire the `statuses` category into the gallery and document subjects. SVG fallbacks (`st-*`) already exist in `art.js`.

**Files:**
- Create: `docs/status-art-bible.md`
- Modify: `src/ui.js` (`renderGallery` `cats` object ~2851)

**Interfaces:**
- Produces: bible normative for Task 4; gallery section `statuses` listing all `STATUS_INFO` keys with SVG until PNGs exist.
- Consumes: `STATUS_INFO`, `iconSvg('st-'+id)`, `assetUrl('statuses', id)`.

- [ ] **Step 1: Author `docs/status-art-bible.md`**

Create the file with this exact content (style block matches icon bible; subjects are normative):

```markdown
# Status art bible

Raster direction for `src/assets/statuses/*.png`. Optional: UI prefers raster when present and falls back to `art.js` `st-*` SVG icons.

## Style block

> Serious cartoon-gothic stained-glass game art: chunky dark outer silhouette, simplified exaggerated proportions, one iconic readable prop or pose, 3-5 large jewel-tone glass colour masses with very few thick lead dividers, matte painterly texture, warm amber rim light, soft controlled inner glow. Designed to remain readable at 32px and 128px. No text, no labels, no watermark.

## Composition

- Single centred emblem or prop only; generous padding (~15% margin)
- Square transparent-alpha icon, final size 512x512
- No hands, no full scene, no ground plane, no contact shadow
- Final size cap: **512px** (`sips -Z 512`)
- Squint test: at 32px the silhouette must still read as the status

## Subject Table

| id | display (do not use as filename) | subject |
|---|---|---|
| str | Fervor | a stoked lantern flame rising through cracked amber glass |
| dex | Poise | a blue glass ward crescent braced like a poised stance |
| vulnerable | Cracked | a diamond pane with a bright scored X fault |
| weak | Dimmed | a guttering blue flame bent downward |
| frail | Brittle | a thin wine-glass pane spiderweb-cracked |
| poison | Smolder | a coal ember trailing green-grey smoke ribbons |
| thorns | Splinters | a glass orb bristling with outward crystal spikes |
| ritual | Litany | a crescent moon of leaded glass dripping wax-light |
| metallicize | Vitrified | a hexagonal vitrified plate with cool iron sheen |
| regen | Warmth | a green repair vine knitting a cracked blue pane |
| barricade | Annealed | a fortified glass bastion block, annealed and solid |
| energized | Alight | a lightning-bolt shard of white-gold glass |
| venomous | Emberfang | a hooked glass fang weeping one amber Smolder drop |
| rampage | Crescendo | three rising attack arcs growing larger |
| beacon | Beacon | a sunburst lantern chip casting facet-cutting rays |
| emberflow | Pyreheart | a heart-shaped furnace coal orbiting tiny embers |
| nightsight | Night Sight | a crescent eye-lantern revealing one hidden glint |
```

- [ ] **Step 2: Add gallery category in `src/ui.js`**

In `renderGallery`'s `cats` object, add (near omens/boons/arts):

```js
    statuses: Object.keys(STATUS_INFO).map((k) => [k, () => iconSvg(`st-${k}`, 64)]),
```

`STATUS_INFO` is already imported in `ui.js`.

- [ ] **Step 3: Verify gallery + engine**

Run: `npm test`
Expected: PASS (no manifest for statuses yet).

Open `http://localhost:5174/?gallery=1` — section `statuses — 0/17 generated` with SVG badges.

- [ ] **Step 4: Commit**

```bash
git add docs/status-art-bible.md src/ui.js
git commit -m "Add status art bible and gallery wiring for statuses category"
```

---

### Task 2: Status strip layout (icon + stack n≥2)

Enlarge combat status chips; hide count when n===1; prefer raster via `assetUrl('statuses', id)`.

**Files:**
- Modify: `src/ui.js` (`statusChips` ~1023–1032)
- Modify: `src/styles.css` (`.status-row` / `.schip` ~582–590)
- Test: `test/e2e/geometry.spec.js` (must stay green — downward growth only)

**Interfaces:**
- Produces: strip DOM `.schip` with optional `<img class="schip-art">` and `.n` only when n≥2.
- Consumes: `assetUrl`, `hasIcon`, `iconSvg`, `STATUS_INFO`.

- [ ] **Step 1: Rewrite `statusChips` in `src/ui.js`**

Replace the function body with:

```js
function statusChips(container, statuses, isPlayer) {
  container.innerHTML = '';
  for (const [id, n] of Object.entries(statuses)) {
    if (!n) continue;
    const info = STATUS_INFO[id] || { name: id, icon: '?', kind: 'buff', desc: '' };
    const kind = id === 'str' && n < 0 ? 'debuff' : info.kind;
    const u = assetUrl('statuses', id);
    const art = u
      ? `<img class="schip-art" src="${u}" alt="">`
      : (hasIcon(`st-${id}`) ? iconSvg(`st-${id}`, 28) : info.icon);
    const count = Math.abs(n) >= 2 ? `<span class="n">${n}</span>` : '';
    const chip = el('span', `schip ${kind}`, `${art}${count}`);
    chip._tip = { title: info.name, body: info.desc.replace(/\bN\b/g, Math.abs(n)), sub: kind === 'debuff' ? 'Debuff' : 'Buff' };
    container.appendChild(chip);
  }
}
```

Notes: `isPlayer` stays in the signature for call-site stability even if unused. Negative `str` still uses `debuff` kind; show `n` (with sign) when `|n|≥2`.

- [ ] **Step 2: Update strip CSS in `src/styles.css`**

Replace the `.status-row` / `.schip` block (~582–590) with:

```css
.status-row {
  display: flex; gap: 6px; min-height: 36px; flex-wrap: wrap; justify-content: center;
  max-width: 240px; align-items: center;
}
.schip {
  display: inline-flex; align-items: center; justify-content: center; gap: 2px;
  position: relative; width: 36px; height: 36px; padding: 0;
  border-radius: 10px; font-size: 12px; font-weight: 800;
  background: rgba(10, 13, 26, 0.82); border: 1px solid rgba(255, 255, 255, 0.16); cursor: help;
}
.schip-art { width: 28px; height: 28px; object-fit: contain; pointer-events: none; }
.schip svg { width: 28px; height: 28px; }
.schip .n {
  position: absolute; right: -2px; bottom: -2px; min-width: 14px; height: 14px; padding: 0 3px;
  border-radius: 7px; font-size: 10px; font-variant-numeric: tabular-nums; line-height: 14px; text-align: center;
  background: #0a0d1a; border: 1px solid rgba(255,255,255,.25); color: #fff;
}
.schip.buff { color: #9fd8ff; border-color: rgba(127, 212, 255, 0.45); }
.schip.debuff { color: #ffb08d; border-color: rgba(255, 122, 71, 0.5); }
.schip.pop { animation: chipPop 0.35s ease-out; }
```

If a container query block sets `.status-row { max-width: 34cqw; }` (~1359), leave it — wrapping is intended.

- [ ] **Step 3: Geometry gate**

Run: `npx playwright test geometry --reporter=list`
Expected: PASS on all projects (feet still on ground line).

If FAIL with feet error: do **not** move battlefield layout — reduce strip/`cplate` upward influence (ensure status row is inside `.cplate` below art, not affecting art box height). Re-check `renderCombat` markup: `.status-row` must remain inside `.cplate`.

- [ ] **Step 4: Battle smoke + unit**

Run: `npm test && npx playwright test battle --project=desktop --reporter=list`
Expected: PASS.

Manual: start a fight, apply Smolder/Fervor via play — chips show large icons; single stack has no numeral; tooltip still works on hover.

- [ ] **Step 5: Commit**

```bash
git add src/ui.js src/styles.css
git commit -m "Enlarge status strip: raster-ready chips with stack badge for n>=2"
```

---

### Task 3: Meta art bible + Vigil surface wiring (zero PNGs)

Document meta subjects and hang `assetUrl` slots on end / Vigil / bequest / map monument. Shippable with SVG/CSS fallback.

**Files:**
- Create: `docs/meta-art-bible.md`
- Modify: `src/ui.js` (`sceneBg` area ~42, `showVigil` ~535, `bequestLabel` ~2710, `renderEnd` ~2736, map node loop ~675–688, `renderGallery` cats)
- Modify: `src/styles.css` (end / deed / bequest / meta-bg)
- Modify: `src/art.js` — add SVG fallbacks `deed-*` and `bequest-*` (minimal silhouettes; optional but required so gallery/fallback never shows empty)

**Interfaces:**
- Produces: `metaBg(id)`, deed/bequest/monument raster hang points; gallery cats `deeds`, `bequests`, `meta`.
- Consumes: `assetUrl('meta'|'deeds'|'bequests', id)`, `DEEDS` keys via `Object.entries`.

- [ ] **Step 1: Author `docs/meta-art-bible.md`**

```markdown
# Meta art bible

Raster direction for Vigil end-of-run and meta surfaces:
`src/assets/meta/*.png`, `src/assets/deeds/*.png`, `src/assets/bequests/*.png`.

## Scene plates (`meta/fallen`, `meta/ascended`)

Full narrative backgrounds (not cutouts). Same production spirit as event art:
rectangular scene, background is part of the story, no UI/text/watermark.
Normalise max edge **1024px**. UI displays them dimmed + blurred behind glass panels.

| id | subject |
|---|---|
| fallen | a dark stone monument in a lightless vault, one dying lantern flame, drifting ash embers, cold blue-grey stone, no readable inscription text |
| ascended | the Spire crown at first dawn — warm gold light breaking over black glass pinnacles, rose-window glow, no figures required |

## Emblems (512×512 alpha, ~15% margin — same style block as status/icon bibles)

### Deeds (`deeds/<id>.png`)

| id | subject |
|---|---|
| paneBreaker | a shattered facet diamond spilling bright shards |
| lanternFed | a lantern mouth accepting a burning card pane as fuel |
| ashSermon | green-grey Smolder ribbons claiming a fallen glass body |
| untouched | an uncracked mirror pane with a tight cyan aura |
| darkWalker | an unlit lantern silhouette on a black path |
| spendthrift | embers streaming from an open lantern into a spell burst |
| hundredShards | a heap of one hundred tiny glass shards (readable as many, not counted) |
| firstDawn | a single sunrise wedge over a black spire tip |

### Bequest kinds (`bequests/<id>.png`)

| id | subject |
|---|---|
| relic | a carved stone niche holding a glowing relic silhouette |
| card | a stone tablet bearing one upright card pane |
| gold | a stone cache spilling warm gold coins |

### Map monument (`meta/monument-node.png`)

| id | subject |
|---|---|
| monument-node | a small standing stone marker with a single memorial flame, readable at ~32px |
```

- [ ] **Step 2: Add SVG fallbacks in `src/art.js`**

Inside `ICONS`, after the existing `monument` entry, add (keep paths simple — silhouette only):

```js
  'deed-paneBreaker': `<path d="M12 3.4 L20 12 L12 20.6 L4 12 Z" fill="none" stroke-width="2"/><path d="M9 9 L15 15 M15 9 L9 15 M12 3.4 L11 10" stroke-width="1.6"/>`,
  'deed-lanternFed': `<path d="M9 5 h6 M8 5 v8 a4 3 0 0 0 8 0 V5" fill="none" stroke-width="2"/><path d="M10 14 h4 v5 h-4 Z" fill="currentColor" stroke="none"/>`,
  'deed-ashSermon': `<path d="M7 18 L12 6 L17 18 Z" fill="none" stroke-width="2"/><path d="M9 14 q3 -4 6 0" fill="none" stroke-width="1.6"/>`,
  'deed-untouched': `<path d="M12 3.4 L20 12 L12 20.6 L4 12 Z" fill="none" stroke-width="2.2"/><circle cx="12" cy="12" r="3" fill="currentColor" stroke="none"/>`,
  'deed-darkWalker': `<path d="M9 4 h6 M8 4 v9 a4 3 0 0 0 8 0 V4" fill="none" stroke-width="2"/><path d="M6 20 h12" stroke-width="2"/>`,
  'deed-spendthrift': `<circle cx="12" cy="10" r="3" fill="currentColor" stroke="none"/><path d="M12 13 L8 20 M12 13 L12 21 M12 13 L16 20" stroke-width="1.8"/>`,
  'deed-hundredShards': `<path d="M6 8 L9 4 L12 8 Z M12 10 L15 6 L18 10 Z M8 16 L11 12 L14 16 Z M14 18 L17 14 L20 18 Z" fill="currentColor" stroke="none"/>`,
  'deed-firstDawn': `<path d="M4 16 h16 M6 16 a6 6 0 0 1 12 0" fill="none" stroke-width="2"/><circle cx="12" cy="10" r="2.2" fill="currentColor" stroke="none"/>`,
  'bequest-relic': `<path d="M8 20 V9 L12 4 L16 9 V20 Z" fill="none" stroke-width="2"/><circle cx="12" cy="12" r="2" fill="currentColor" stroke="none"/>`,
  'bequest-card': `<rect x="7" y="4" width="10" height="16" rx="1.5" fill="none" stroke-width="2"/><path d="M9 8 h6 M9 12 h6" stroke-width="1.6"/>`,
  'bequest-gold': `<ellipse cx="12" cy="14" rx="7" ry="4" fill="none" stroke-width="2"/><circle cx="10" cy="12" r="2" fill="currentColor" stroke="none"/><circle cx="14" cy="13" r="2" fill="currentColor" stroke="none"/>`,
```

- [ ] **Step 3: Add `metaBg` helper next to `sceneBg` in `src/ui.js`**

```js
function metaBg(id) {
  const u = assetUrl('meta', id);
  return u ? `<div class="meta-bg" style="background-image:url('${u}')"></div>` : '';
}
```

- [ ] **Step 4: Wire `showVigil` deed rows**

Change the map to `Object.entries(DEEDS)` and prepend emblem art:

```js
  const deedRows = Object.entries(DEEDS).map(([id, deed]) => {
    const cur = v.deeds[deed.stat] || 0;
    const done = cur >= deed.n;
    const pct = Math.min(100, Math.round((cur / deed.n) * 100));
    const rewards = deed.unlocks.map((u) => {
      if (u === 'aspect2') return 'The Ashwarden';
      const [k, rid] = u.split(':');
      return k === 'card' ? (CARDS[rid]?.name || rid) : (RELICS[rid]?.name || rid);
    }).join(', ');
    const du = assetUrl('deeds', id);
    const art = du
      ? `<img class="deed-art" src="${du}" alt="">`
      : `<span class="deed-art-fallback">${iconSvg(`deed-${id}`, 40)}</span>`;
    return `<div class="deed-row${done ? ' done' : ''}">
      ${art}
      <div class="deed-body">
        <div class="deed-head"><span class="deed-name">${done ? '✦ ' : ''}${deed.name}</span><span class="deed-count">${Math.min(cur, deed.n)}/${deed.n}</span></div>
        <div class="deed-desc">${deed.desc} → <i>${rewards}</i></div>
        <div class="deed-bar"><span style="width:${pct}%"></span></div>
      </div>
    </div>`;
  }).join('');
```

- [ ] **Step 5: Wire `bequestLabel` + `renderEnd`**

Update `bequestLabel`:

```js
function bequestLabel(o) {
  const bu = assetUrl('bequests', o.kind);
  const kindIcon = bu
    ? `<img class="bq-kind" src="${bu}" alt="">`
    : `<span class="bq-kind-fallback">${iconSvg(`bequest-${o.kind}`, 22)}</span>`;
  if (o.kind === 'relic') return { icon: `${kindIcon}${relicArt(o.id, 20)}`, name: RELICS[o.id]?.name || o.id, note: 'your rarest relic' };
  if (o.kind === 'card') return { icon: `${kindIcon}<span class="bq-card">🂠</span>`, name: (CARDS[o.id]?.name || o.id) + (o.up ? '+' : ''), note: 'your finest card' };
  return { icon: `${kindIcon}${iconSvg('coin', 20)}`, name: `${o.amount} gold`, note: 'a cache of gold' };
}
```

In `renderEnd`, wrap both win and lose roots with meta atmosphere:

- Win branch: first child inside `.end-screen` → `${metaBg('ascended')}` before title.
- Lose branch: first child inside `.end-screen.grave` → `${metaBg('fallen')}` before `.monument`.

Ensure `.end-screen` / `.grave` are `position: relative` (add CSS if missing) so `.meta-bg` can sit behind.

- [ ] **Step 6: Map monument raster**

In the map node loop where `iconInline(...)` is built, special-case monument:

```js
    const monUrl = n.type === 'monument' ? assetUrl('meta', 'monument-node') : null;
    const iconHtml = monUrl
      ? `<image href="${monUrl}" x="${-isz / 2}" y="${-isz / 2}" width="${isz}" height="${isz}" />`
      : iconInline(dark ? 'unlitLantern' : NODE_ICONS[n.type], dark ? Math.round(17 * tf) : isz);
    dots += `<g class="${cls}" data-node="${n.id}" style="--d:${n.row * 34}ms">
      <g class="nwrap"><circle class="bg" r="${dark ? 16 * tf : r}"/><g class="icg">${iconHtml}</g></g>
    </g>`;
```

(Unlit monument nodes are not a thing today — keep `dark` path on `unlitLantern` as now; only non-dark monument uses raster.)

- [ ] **Step 7: Gallery cats + CSS**

Add to `cats`:

```js
    deeds: Object.keys(DEEDS).map((k) => [k, () => iconSvg(`deed-${k}`, 64)]),
    bequests: ['relic', 'card', 'gold'].map((k) => [k, () => iconSvg(`bequest-${k}`, 64)]),
    meta: ['fallen', 'ascended', 'monument-node'].map((k) => [k, () => `<div class="title-banner-ph">${k}</div>`]),
```

Import: `DEEDS` is already imported in `ui.js`.

CSS additions:

```css
.meta-bg {
  position: absolute; inset: 0; z-index: 0; background-size: cover; background-position: 50% 45%;
  opacity: 0.4; filter: blur(8px) saturate(0.75); pointer-events: none;
}
.end-screen, .end-screen.grave { position: relative; }
.end-screen > *:not(.meta-bg), .end-screen.grave > *:not(.meta-bg) { position: relative; z-index: 1; }
.deed-row { display: flex; gap: 12px; align-items: flex-start; }
.deed-art, .deed-art-fallback { width: 48px; height: 48px; flex: 0 0 48px; object-fit: contain; }
.deed-art-fallback { display: grid; place-items: center; color: var(--gold); }
.deed-body { flex: 1; min-width: 0; }
.bq-kind, .bq-kind-fallback { width: 22px; height: 22px; object-fit: contain; vertical-align: middle; margin-right: 4px; }
.bq-kind-fallback { display: inline-flex; }
```

- [ ] **Step 8: Gates**

Run: `npm test && npx playwright test battle stage --project=desktop --reporter=list`
Expected: PASS. Gallery shows deeds/bequests/meta/statuses sections (0 PNGs).

- [ ] **Step 9: Commit**

```bash
git add docs/meta-art-bible.md src/art.js src/ui.js src/styles.css
git commit -m "Wire Vigil meta surfaces and deed/bequest fallbacks (SVG until rasters)"
```

---

### Task 4: Generate 17 status rasters

**Requires imagegen** (`docs/imagegen.md`, `tools/imagegen.sh`, `docs/generated-art-workflow.md`). If unavailable: **BLOCKED** — stop and report; do not fake files.

**Files:**
- Create: `src/assets/statuses/<id>.png` for every `STATUS_INFO` key
- Test: gallery + later manifest (Task 7)

- [ ] **Step 1: Generate**

For each row in `docs/status-art-bible.md` subject table: prompt = style block + subject; 512×512; chroma/alpha per emblem workflow (same as omens/relics — flat key + strip rim via `tools/strip-alpha-rim.py`); filename = internal id only.

- [ ] **Step 2: Gallery squint review**

`http://localhost:5174/?gallery=1` → statuses `17/17` PNG. Reject/regenerate any icon that fails 32px silhouette readability.

- [ ] **Step 3: Commit**

```bash
git add src/assets/statuses docs/status-art-bible.md
git commit -m "Generate 17 status emblem rasters"
```

---

### Task 5: Generate deeds, bequests, monument-node emblems

**Requires imagegen.** If unavailable: **BLOCKED**.

**Files:**
- Create: `src/assets/deeds/*.png` (8), `src/assets/bequests/{relic,card,gold}.png`, `src/assets/meta/monument-node.png`

- [ ] **Step 1: Generate** per `docs/meta-art-bible.md` emblem tables (512×512 alpha).

- [ ] **Step 2: Gallery review** — deeds 8/8, bequests 3/3, meta at least monument-node PNG; squint at 32–48px.

- [ ] **Step 3: Commit**

```bash
git add src/assets/deeds src/assets/bequests src/assets/meta/monument-node.png
git commit -m "Generate deed, bequest, and monument-node emblem rasters"
```

---

### Task 6: Generate meta scene plates (fallen, ascended)

**Requires imagegen.** Scene workflow like events (no alpha cutout required). If unavailable: **BLOCKED**.

**Files:**
- Create: `src/assets/meta/fallen.png`, `src/assets/meta/ascended.png`

- [ ] **Step 1: Generate** per meta bible scene rows; normalise max edge 1024px.

- [ ] **Step 2: In-game check** — force end screens via probe/console if needed, or play: confirm plates sit behind text with `.meta-bg` dim/blur; text remains readable.

- [ ] **Step 3: Commit**

```bash
git add src/assets/meta/fallen.png src/assets/meta/ascended.png
git commit -m "Generate fallen and ascended Vigil scene plates"
```

---

### Task 7: Manifest gates

**Files:**
- Modify: `test/test_engine.js` (import + `checkManifest` block ~12, ~1033)

**Interfaces:**
- Produces: `npm test` fails if any new category id lacks a file.

- [ ] **Step 1: Extend imports**

Add `STATUS_INFO, DEEDS` to the `data.js` import line (keep existing imports).

- [ ] **Step 2: Add checks** after existing `checkManifest` calls:

```js
  checkManifest('statuses', Object.keys(STATUS_INFO));
  checkManifest('deeds', Object.keys(DEEDS));
  checkManifest('bequests', ['relic', 'card', 'gold']);
  checkManifest('meta', ['fallen', 'ascended', 'monument-node']);
```

- [ ] **Step 3: Run**

Run: `npm test`
Expected: PASS ending with unit checks + monte-carlo line. If FAIL on missing asset, generate/fix the file before proceeding — do not weaken the assert.

- [ ] **Step 4: Commit**

```bash
git add test/test_engine.js
git commit -m "Manifest-gate statuses, deeds, bequests, and meta assets"
```

---

### Task 8: Visual baselines + final sweep

**Files:**
- Modify: `test/e2e/visual.spec.js-snapshots/*` (via update)
- Modify: `docs/README.md` — add this spec/plan under active docs (short row)
- Modify: `dist/` via `npm run build` (final only)

- [ ] **Step 1: Full automated matrix**

Run:

```bash
npm test && npm run build && npx playwright test --reporter=list && PERF=1 npx playwright test perf --workers=1 --reporter=list
```

Expected: engine green; default Playwright green (update visuals next if combat/end diffs); perf still ≥55fps avg under existing gate.

- [ ] **Step 2: Update visual baselines**

Run: `npm run test:e2e:update`
Eyeball diffs for combat (status strip), and any end/map shots if present. If `visual.spec` lacks end-screen coverage, do **not** expand scope unless a one-liner hook already exists — manual smoke covers end/Vigil.

- [ ] **Step 3: Manual smoke**

1. Desktop fight: statuses show large rasters; n=1 no badge; n≥2 badge; hover tooltip.
2. Die → bequest options show kind emblems → carve → title.
3. New run: map monument node shows raster when present → claim.
4. Title → Vigil overlay: deed emblems + bars.
5. Win path (or seeded): ascended plate behind victory copy.
6. Portrait 390×844: strip wraps, no feet lift, no console errors.

- [ ] **Step 4: Docs index**

In `docs/README.md` Active implementation specs table, add rows for:

- `superpowers/specs/2026-07-08-vigil-surfaces-status-art-design.md` — current
- `superpowers/plans/2026-07-08-vigil-surfaces-status-art.md` — executor plan

Mark hardening spec as predecessor / complete if not already.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Vigil surfaces & status art complete: manifests, baselines, docs"
```

---

## Spec coverage checklist (self-review)

| Spec requirement | Task |
|---|---|
| Status bible + 17 rasters | 1, 4 |
| Status strip layout, n≥2, no name, tooltip | 2 |
| Geometry feet invariant | 2 |
| Meta bible | 3 |
| Defeat/victory scene plates | 3 wiring, 6 art |
| Deeds emblems + Vigil panel | 3, 5 |
| Bequest kind emblems | 3, 5 |
| Map monument-node | 3, 5 |
| Gallery categories | 1, 3 |
| Manifest gates | 7 |
| Baselines + final sweep | 8 |
| No engine/vigil API changes | all |
| Imagegen BLOCKED rule | 4–6 |
| Hardening status policy amendment | 2 (+ spec already) |
