# Draw / Discard / Ashes Pile Chrome & Ceremony Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace plain Draw / Discard / Ashes glass buttons with themed card-stack widgets (3 state masters, 0–5+ depth tiers, always-visible count) and play full per-card pile ceremonies under fixed wall-clock budgets.

**Architecture:** Pure helpers for tier mapping + flight scheduling (Node-tested). Three raster masters under `src/assets/piles/` via `assetUrl`. Combat pile buttons become stack widgets synced in `syncCombat`. Engine queue events gain minimal payloads (`reshuffle.n`, `discardHand.uids`, `toDiscard`) so UI can fly every card without guessing. `drain()` uses one shared flight helper with parallel WAAPI + compressed stagger.

**Tech Stack:** Vite + vanilla JS; existing `flyTo` / WAAPI patterns in `ui.js`; `assetUrl` glob; `test/test_engine.js` (no test runner filter).

**Spec:** `docs/superpowers/specs/2026-07-09-pile-chrome-ceremony-design.md`

## File map

| File | Responsibility |
|---|---|
| `src/pile-chrome.js` | Pure: `pileTier(n)`, `flightSchedule(n, budgetMs, opts)`, pile id constants |
| `test/test_engine.js` | Unit asserts for tier + schedule + enriched queue events |
| `scratch/pile-chrome-20260709/` | Imagegen source / alpha / `prompt-ledger.md` |
| `src/assets/piles/{draw,discard,ashes}.png` | 3 state masters |
| `src/ui.js` | Pile markup, `syncPileWidget`, flight helper, drain cases |
| `src/styles.css` | Stack widget, bump, flycard-back, mobile sizes |
| `src/engine.js` | Minimal queue payload enrichment only |
| `src/assets/README.md` | Note `piles/` category |
| Gallery block in `src/ui.js` | Register `piles` category |

## Global Constraints

- Still cards, Spirebound-themed; same card body, three states (sealed / spent / charred).
- Count always visible (mobile); tiers `0/1/2/3/4/5+`.
- Every participating card flies; wall-clock budgets from spec; never “representative subset only”.
- Prefer runtime depth composite from 3 masters; bake depth frames only if mobile QA fails.
- Engine math unchanged; only queue payloads may grow.
- Ashes never reshuffle into Draw.
- Missing `assetUrl('piles', …)` → keep readable glass fallback (label + count still work).
- `prefers-reduced-motion`: skip/shorten flights; counts/tiers still correct.
- Do not commit unrelated WIP (`src/char-meta.js`, other scratch batches).
- Commit after each task; do **not** push unless the owner asks.

---

### Task 1: Pure pile helpers + unit tests

**Files:**
- Create: `src/pile-chrome.js`
- Modify: `test/test_engine.js` (add a small block near other pure-module tests; import from `../src/pile-chrome.js`)

**Interfaces:**
- Produces:
  - `pileTier(count: number) → 0 \| 1 \| 2 \| 3 \| 4 \| 5` where `5` means visual `5+`
  - `flightSchedule(n, budgetMs, { maxStagger = 48, minStagger = 8, flightDur? } = {}) → { stagger, flightDur, awaitMs }`
  - `PILE_IDS = ['draw', 'discard', 'ashes']`
  - `pileMasterId(pile) → 'draw' \| 'discard' \| 'ashes'`

- [ ] **Step 1: Add failing tests in `test/test_engine.js`**

```js
import { pileTier, flightSchedule, PILE_IDS } from '../src/pile-chrome.js';

assert.equal(pileTier(0), 0);
assert.equal(pileTier(1), 1);
assert.equal(pileTier(4), 4);
assert.equal(pileTier(5), 5);
assert.equal(pileTier(99), 5);
assert.equal(pileTier(-1), 0);

const s1 = flightSchedule(1, 400);
assert.ok(s1.awaitMs <= 400 && s1.awaitMs >= 200);
const s10 = flightSchedule(10, 400);
assert.ok(s10.stagger <= s1.stagger || s10.stagger <= 48);
assert.ok(s10.awaitMs <= 480, 'large n stays near budget');
assert.ok(s10.stagger >= 8);
assert.deepEqual(PILE_IDS, ['draw', 'discard', 'ashes']);
```

- [ ] **Step 2: Run tests — expect FAIL (module missing)**

Run: `npm test`  
Expected: fail resolving `../src/pile-chrome.js` or missing exports.

- [ ] **Step 3: Implement `src/pile-chrome.js`**

```js
export const PILE_IDS = ['draw', 'discard', 'ashes'];

export function pileTier(count) {
  const n = Math.max(0, Math.floor(Number(count) || 0));
  if (n <= 0) return 0;
  if (n >= 5) return 5;
  return n;
}

export function pileMasterId(pile) {
  return PILE_IDS.includes(pile) ? pile : 'draw';
}

/** Parallel flight timing: every card flies; wall-clock capped by budgetMs. */
export function flightSchedule(n, budgetMs, {
  maxStagger = 48,
  minStagger = 8,
  flightDur,
} = {}) {
  const count = Math.max(0, Math.floor(n) || 0);
  const budget = Math.max(120, budgetMs | 0);
  if (count <= 0) return { stagger: 0, flightDur: 0, awaitMs: 0 };
  const stagger = count === 1
    ? 0
    : Math.max(minStagger, Math.min(maxStagger, Math.floor(budget / count)));
  const dur = flightDur != null
    ? flightDur
    : Math.max(160, Math.min(420, budget - stagger * Math.min(count - 1, 6)));
  const awaitMs = Math.min(budget + 80, stagger * (count - 1) + dur);
  return { stagger, flightDur: dur, awaitMs };
}
```

- [ ] **Step 4: Run `npm test` — expect PASS** (monte-carlo still runs; unit block green)

- [ ] **Step 5: Commit**

```bash
git add src/pile-chrome.js test/test_engine.js
git commit -m "$(cat <<'EOF'
Add pure pile tier and flight-schedule helpers.

EOF
)"
```

---

### Task 2: Generate + promote three pile state masters

**Files:**
- Create: `scratch/pile-chrome-20260709/prompt-ledger.md`
- Create: `scratch/pile-chrome-20260709/source/`, `alpha/`
- Create: `src/assets/piles/draw.png`, `discard.png`, `ashes.png`
- Modify: `src/assets/README.md` (one short `piles/` note if categories are listed)

**Interfaces:**
- Produces: `assetUrl('piles', 'draw'|'discard'|'ashes')` non-null after promote
- Consumes: `docs/generated-art-workflow.md` (gpt-image-2 → Nano Banana Pro → alpha)

- [ ] **Step 1: Scratch ledger + generate three masters**

Follow `docs/generated-art-workflow.md`. Shared brief constraints:

- Single card-stack subject, transparent / chroma-key ready, generous padding, no text, no ground plane
- Same card aspect / body silhouette across all three
- **draw:** neat sealed face-down backs, cool parchment / lead
- **discard:** same body, slightly askew / worn, warmer spent tone
- **ashes:** same body, charred edges, ember flecks

Record every prompt + path in `scratch/pile-chrome-20260709/prompt-ledger.md`.

- [ ] **Step 2: Alpha cutout + rim cleanup; copy approved alphas into `src/assets/piles/`**

```bash
mkdir -p src/assets/piles
# copy approved draw.png discard.png ashes.png into src/assets/piles/
```

- [ ] **Step 3: Smoke-check resolver**

In Node or temporary assert (optional one-liner in a throwaway script is fine); in browser `?gallery=1` comes in Task 3. At minimum confirm files exist:

```bash
ls -la src/assets/piles/draw.png src/assets/piles/discard.png src/assets/piles/ashes.png
```

- [ ] **Step 4: Commit**

```bash
git add scratch/pile-chrome-20260709 src/assets/piles src/assets/README.md
git commit -m "$(cat <<'EOF'
Add Draw/Discard/Ashes pile state master rasters.

EOF
)"
```

---

### Task 3: Pile stack widget chrome (static + sync)

**Files:**
- Modify: `src/ui.js` (combat markup ~911–913, `syncCombat` pile counts ~1151–1153, gallery `cats`)
- Modify: `src/styles.css` (`.pile-btn` block ~909–921 + mobile overrides)

**Interfaces:**
- Consumes: `assetUrl`, `pileTier`, `pileMasterId` from `pile-chrome.js` / `art.js`
- Produces: each pile button contains `.pile-stack[data-tier]` layers + `.cnt`; `syncPileWidgets(cb)` updates tiers/counts

- [ ] **Step 1: Import helpers in `ui.js`**

```js
import { assetUrl, /* existing… */ } from './art.js';
import { pileTier, pileMasterId } from './pile-chrome.js';
```

- [ ] **Step 2: Replace pile button inner HTML in combat screen template**

```html
<button class="pile-btn pile-draw" type="button" aria-label="Draw pile">
  <span class="pile-stack" data-pile="draw" data-tier="0"></span>
  <span class="cnt">0</span>
  <span class="lbl">DRAW</span>
</button>
<!-- same pattern for discard / exhaust(ashes) with data-pile="discard"|"ashes" -->
```

Keep classes `pile-draw` / `pile-discard` / `pile-exhaust` for positioning.

- [ ] **Step 3: Implement `syncPileWidgets(cb)` and call from `syncCombat`**

```js
function syncPileWidgets(cb) {
  const ce = S.ce;
  if (!ce) return;
  const map = [
    [ce.draw, 'draw', cb.draw.length],
    [ce.discard, 'discard', cb.discard.length],
    [ce.exhaust, 'ashes', cb.exhaust.length],
  ];
  for (const [btn, pile, n] of map) {
    if (!btn) continue;
    const tier = pileTier(n);
    const stack = btn.querySelector('.pile-stack');
    $('.cnt', btn).textContent = n;
    if (!stack) continue;
    if (Number(stack.dataset.tier) === tier) continue;
    stack.dataset.tier = String(tier);
    const url = assetUrl('piles', pileMasterId(pile));
    stack.replaceChildren();
    if (!url) {
      stack.classList.add('pile-stack-fallback');
      continue;
    }
    stack.classList.remove('pile-stack-fallback');
    const layers = tier === 0 ? 0 : tier === 5 ? 5 : tier;
    for (let i = 0; i < layers; i++) {
      const img = document.createElement('img');
      img.src = url;
      img.alt = '';
      img.className = 'pile-layer';
      img.style.setProperty('--i', String(i));
      stack.appendChild(img);
    }
    if (tier === 0) stack.classList.add('is-empty');
    else stack.classList.remove('is-empty');
  }
}
```

Call `syncPileWidgets(cb)` where counts are set today.

- [ ] **Step 4: CSS for stack + number overlay**

```css
.pile-btn {
  /* keep size/position; allow relative children */
  position: absolute; /* existing */
}
.pile-stack {
  position: absolute; inset: 6px 6px 18px;
  pointer-events: none;
}
.pile-stack.is-empty {
  outline: 1px dashed rgba(242, 193, 78, 0.25);
  border-radius: 4px;
  opacity: 0.45;
}
.pile-layer {
  position: absolute; left: 50%; bottom: 0;
  width: 70%; height: auto;
  transform: translate(-50%, calc(var(--i) * -2px)) rotate(calc(var(--i) * 1.2deg));
  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.55));
}
.pile-btn .cnt {
  position: relative; z-index: 1;
  /* keep large readable number */
}
.pile-btn.pile-bump { animation: pileBump 0.28s ease-out; }
@keyframes pileBump {
  0% { transform: translateY(0) scale(1); }
  40% { transform: translateY(-3px) scale(1.06); }
  100% { transform: translateY(0) scale(1); }
}
```

Adjust mobile rules so stack + count still fit (~42–46px buttons).

- [ ] **Step 5: Register gallery category**

In `renderGallery` `cats` object:

```js
piles: ['draw', 'discard', 'ashes'].map((k) => [k, () => `<div class="title-banner-ph">${k}</div>`]),
```

- [ ] **Step 6: Manual check**

Run: `npm run dev` → start combat → confirm three piles show art when counts > 0, empty outline at 0, numbers update, click still opens grids.  
Run: `npm test` → PASS.

- [ ] **Step 7: Commit**

```bash
git add src/ui.js src/styles.css
git commit -m "$(cat <<'EOF'
Wire themed pile stack widgets with 0–5+ depth tiers.

EOF
)"
```

---

### Task 4: Engine queue payloads for full-card flights

**Files:**
- Modify: `src/engine.js` (`drawCards` reshuffle, `playCard` discard path, `endTurn` discardHand)
- Modify: `test/test_engine.js` (assert new event shapes on a tiny forced combat)

**Interfaces:**
- Produces:
  - `{ t: 'reshuffle', n }` where `n` was discard size before move
  - `{ t: 'discardHand', uids: number[] }` captured before hand clear
  - `{ t: 'toDiscard', uid }` when a played non-power non-exhaust card enters discard
- Consumes: existing combat helpers / `forceHand` patterns already in tests

- [ ] **Step 1: Write failing asserts**

Drive a minimal combat (reuse existing test harness patterns in `test_engine.js`):

```js
// after endTurn with a known hand size H:
const dh = cb.queue.filter((e) => e.t === 'discardHand');
assert.equal(dh.length, 1);
assert.equal(dh[0].uids.length, H);

// force empty draw + non-empty discard then drawCards → reshuffle
const rs = cb.queue.find((e) => e.t === 'reshuffle');
assert.ok(rs && Number.isInteger(rs.n) && rs.n > 0);

// play a non-exhaust skill → expect toDiscard
assert.ok(cb.queue.some((e) => e.t === 'toDiscard' && e.uid != null));
```

Tune setup to match real card ids available in `data.js` (e.g. `defend` for discard; avoid exhaust cards).

- [ ] **Step 2: Run `npm test` — expect FAIL on missing fields**

- [ ] **Step 3: Patch `engine.js`**

`drawCards` reshuffle:

```js
if (!cb.draw.length) {
  if (!cb.discard.length) break;
  const n = cb.discard.length;
  cb.draw = cb.discard;
  cb.discard = [];
  shuffle(rng, cb.draw);
  cb.queue.push({ t: 'reshuffle', n });
}
```

`endTurn` discard:

```js
const uids = cb.hand.map((c) => c.uid);
cb.discard.push(...cb.hand);
cb.hand = [];
cb.queue.push({ t: 'discardHand', uids });
```

`playCard` after effects (replace bare `cb.discard.push(inst)`):

```js
if (d.type === 'power') cb.queue.push({ t: 'powerConsumed', uid: inst.uid });
else if (d.exhaust) exhaustCard(run, cb, inst);
else {
  cb.discard.push(inst);
  cb.queue.push({ t: 'toDiscard', uid: inst.uid });
}
```

Do **not** change kindle/exhaust math.

- [ ] **Step 4: Run `npm test` — expect PASS**

- [ ] **Step 5: Commit**

```bash
git add src/engine.js test/test_engine.js
git commit -m "$(cat <<'EOF'
Enrich pile ceremony queue events with n/uids/toDiscard.

EOF
)"
```

---

### Task 5: Flight helper + drain ceremonies

**Files:**
- Modify: `src/ui.js` (`flyTo` area ~1497+, `drain` cases `draw` / `reshuffle` / `discardHand` / `exhaust` / add `toDiscard`)
- Modify: `src/styles.css` (`.flycard-back` if distinct from `.flycard`)

**Interfaces:**
- Consumes: `flightSchedule`, `V.centerOf`, `stageRect`, `REDUCED`, pile buttons on `S.ce`
- Produces: `flyCardsTo(fromPtsOrEls, toEl, { n, budgetMs, cls })`, `bumpPile(btn)`

- [ ] **Step 1: Add helpers near `flyTo`**

```js
function bumpPile(btn) {
  if (!btn || REDUCED) return;
  btn.classList.remove('pile-bump');
  void btn.offsetWidth;
  btn.classList.add('pile-bump');
}

function flyCardBacks(fromList, toEl, budgetMs) {
  const layer = $('#floaties');
  const dest = V.centerOf(toEl);
  const n = fromList.length;
  const { stagger, flightDur, awaitMs } = flightSchedule(n, budgetMs);
  if (REDUCED || n === 0) return Promise.resolve(0);
  fromList.forEach((src, i) => {
    const origin = src.el ? V.centerOf(src.el) : src;
    const m = el('div', 'flycard flycard-back');
    m.style.left = `${origin.x}px`;
    m.style.top = `${origin.y}px`;
    layer.appendChild(m);
    const mx = (origin.x + dest.x) / 2 + (Math.random() - 0.5) * 80;
    const my = Math.min(origin.y, dest.y) - 40 - Math.random() * 50;
    m.animate(
      [
        { transform: 'translate(-50%,-50%) scale(0.85)', opacity: 0.9 },
        { transform: `translate(calc(-50% + ${mx - origin.x}px), calc(-50% + ${my - origin.y}px)) scale(1)`, opacity: 1, offset: 0.45 },
        { transform: `translate(calc(-50% + ${dest.x - origin.x}px), calc(-50% + ${dest.y - origin.y}px)) scale(0.55)`, opacity: 0.85 },
      ],
      { duration: flightDur, delay: i * stagger, easing: 'cubic-bezier(.32,.05,.35,1)', fill: 'forwards' }
    ).onfinish = () => m.remove();
  });
  return sleep(awaitMs);
}
```

Import `flightSchedule` from `./pile-chrome.js`.

- [ ] **Step 2: Rewrite drain cases**

**`draw`:** before/with `syncHand`, for each `ev` in a burst… Practical approach matching per-event queue: on each `{ t:'draw', uid }`, spawn one back from `ce.draw` toward hand (approximate hand centre or future card slot). Budget per single draw ~220ms; consecutive draws naturally overlap via short sleeps (~75ms today — keep overlap).

```js
case 'draw': {
  if (!REDUCED) {
    await flyCardBacks([V.centerOf(ce.draw)], ce.hand, 220);
    bumpPile(ce.draw);
  }
  syncHand(); syncCombat(); sfx.draw();
  await sleep(REDUCED ? 40 : 75);
  break;
}
```

**`reshuffle`:**

```js
case 'reshuffle': {
  sfx.card();
  const n = ev.n || 6;
  const origins = Array.from({ length: n }, () => V.centerOf(ce.discard));
  await flyCardBacks(origins, ce.draw, 560);
  bumpPile(ce.draw);
  V.floatText(V.centerOf(ce.draw).x, V.centerOf(ce.draw).y - 46, 'Reshuffle', 'notice');
  syncCombat();
  break;
}
```

**`discardHand`:**

```js
case 'discardHand': {
  const uids = ev.uids || [];
  const els = uids.map((uid) => $(`.card[data-uid="${uid}"]`, ce.hand)).filter(Boolean);
  sfx.card();
  if (!REDUCED && els.length) {
    await flyCardBacks(els.map((elc) => ({ el: elc })), ce.discard, 400);
    els.forEach((c) => c.remove());
  } else {
    // existing slide fallback or instant remove
    els.forEach((c) => c.remove());
  }
  bumpPile(ce.discard);
  syncCombat();
  break;
}
```

**`toDiscard`:**

```js
case 'toDiscard': {
  const c = $(`.card[data-uid="${ev.uid}"]`, ce.hand);
  if (c && !REDUCED) {
    await flyCardBacks([{ el: c }], ce.discard, 320);
    c.remove();
  } else if (c) c.remove();
  bumpPile(ce.discard);
  syncCombat();
  break;
}
```

**`exhaust`:** keep burn-inward; after burst, add ember motes toward Ashes:

```js
// after existing burn animation starts:
const a0 = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
const a1 = V.centerOf(ce.exhaust);
flyTo(a0.x, a0.y, a1.x, a1.y, { n: 8, color: '#ffb066', size: 5, dur: 480 });
bumpPile(ce.exhaust);
```

Note: `play` handler may already remove the card for attacks. Ensure `toDiscard` is safe if the node is gone (fly from hand centre / last known rect). If `play` and `toDiscard` double-handle, prefer: attacks keep enemy streak; `toDiscard` only flies if card node still present OR spawn a back from stage centre-bottom.

- [ ] **Step 3: Manual timing check**

In combat: end turn with 1 card vs full hand — discard ceremony duration should feel similar (~0.3–0.5s). Empty draw then reshuffle large discard — ~0.45–0.65s, every back visible as a flight (dense stagger OK).

- [ ] **Step 4: Run `npm test`**

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/ui.js src/styles.css
git commit -m "$(cat <<'EOF'
Play full per-card pile flights under fixed time budgets.

EOF
)"
```

---

### Task 6: Polish, fallback, reduced-motion QA

**Files:**
- Modify: `src/ui.js` / `src/styles.css` only as needed from QA
- Optional: `src/vfx.js` only if a shared landing mote helps (skip if `flyTo` enough)

- [ ] **Step 1: Fallback QA** — temporarily rename `src/assets/piles/draw.png` and confirm glass label+count still usable; restore file.

- [ ] **Step 2: Reduced-motion QA** — enable OS reduce motion; ceremonies skip flights; counts/tiers still update; no stuck `S.busy`.

- [ ] **Step 3: Phone-width QA** — `?shape=phone-portrait` (or pad): tiers 0 vs 1 vs 5+ readable; hit targets still open grids.

- [ ] **Step 4: If depth composite muddies at ~42px, bake tier frames `draw-0…draw-5` OR increase layer offset / simplify to max 3 visible layers for tier 5 — document choice in a one-line comment on `syncPileWidgets`. Prefer staying on 3 masters.

- [ ] **Step 5: Final `npm test` + commit if polish landed**

```bash
git add src/ui.js src/styles.css
git commit -m "$(cat <<'EOF'
Polish pile chrome fallbacks and mobile depth read.

EOF
)"
```

---

## Spec coverage checklist

| Spec requirement | Task |
|---|---|
| Themed card stacks, same body, 3 states | 2, 3 |
| Tiers 0–5+ + always-visible count | 1, 3 |
| 3 masters + runtime composite | 2, 3, 6 |
| Full-card flights + time budgets | 1, 4, 5 |
| draw / discardHand / exhaust / reshuffle / play→discard | 4, 5 |
| Chrome upgrade (not stage props) | 3 |
| Engine math untouched; payloads only | 4 |
| Ashes not in reshuffle | 5 (reshuffle origins = discard only) |
| assetUrl fallback | 3, 6 |
| LITE / reduced-motion | 5, 6 |
| Gallery / README | 2, 3 |

## Placeholder / consistency self-check

- No TBD steps; helpers named `pileTier` / `flightSchedule` / `toDiscard` consistently.
- Budgets match spec ranges (draw ~220, discardHand ~400, reshuffle ~560, exhaust ember ~480).
- `pile-exhaust` CSS class retained; master id `ashes` for assets.
