# App Versioning Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire `package.json` version into Vite builds, show it on the title screen (with a logo multi-tap debug reveal), and add a manual `npm run release` convention that produces clean release builds without auto-committing.

**Architecture:** Vite `define` injects `__SPIRE_VERSION__`, `__SPIRE_GIT_SHA__`, and `__SPIRE_RELEASE__` at build/dev time. A tiny pure `src/version.js` formats the display string and exposes `getVersionInfo()` for the UI. `renderTitle()` adds a bottom-right label and a 5-taps-in-2s logo gesture. `tools/release.mjs` bumps semver, runs `SPIRE_RELEASE=1` build, and prints git next steps.

**Tech Stack:** Vite 8, vanilla ESM, Node `assert`, `readline`, `child_process.execSync`, existing `src/ui.js` / `src/styles.css`.

## Global Constraints

- Source of truth is `package.json` `"version"` only.
- `engine.js` and `vigil.js` must not import version helpers.
- Ordinary `npm run build` and `npm run dev` are non-release (`1.0.0+<sha>`).
- Only `SPIRE_RELEASE=1` builds show clean semver.
- `npm run release` never commits, tags, or pushes.
- Missing git SHA → `unknown` (non-release display `X.Y.Z+unknown`).
- No CHANGELOG, no Settings version row, no new visual baseline gate up front.
- Use UK English in comments and docs.
- Do not modify `AGENTS.md` unless a command table update is clearly required; prefer `README.md` + `docs/app-versioning.md`.

---

**Spec:** `docs/superpowers/specs/2026-07-11-app-versioning-design.md`

## File map

| File | Responsibility |
|---|---|
| `src/version.js` | Pure `formatVersionDisplay` + `getVersionInfo` reading Vite defines |
| `vite.config.js` | Compute version/sha/release and `define` the three constants |
| `src/ui.js` | Title label + logo multi-tap debug reveal in `renderTitle()` |
| `src/styles.css` | `.title-version` bottom-right muted label + debug state |
| `tools/release.mjs` | Interactive (or argv) bump + release build + printed next steps |
| `package.json` | `release:build` and `release` scripts |
| `test/test_engine.js` | Unit assertions for `formatVersionDisplay` |
| `docs/app-versioning.md` | Operator note for bump policy and release flow |
| `docs/README.md` | Index link to the new doc + spec/plan |
| `README.md` | One short pointer to app versioning |

---

### Task 1: Pure version formatter + unit tests

**Files:**
- Create: `src/version.js`
- Modify: `test/test_engine.js` (add a small unit block near the other pure-helper checks)

**Interfaces:**
- Produces: `formatVersionDisplay(version: string, gitSha: string, isRelease: boolean): string`
- Produces: `getVersionInfo(): { version: string, gitSha: string, release: boolean, display: string }`
- Consumes: none yet (Task 2 wires Vite defines; `getVersionInfo` must tolerate missing defines via `typeof` checks)

- [ ] **Step 1: Write the failing unit block**

Near the top of the unit-check section in `test/test_engine.js` (after imports, before or among other pure blocks), add:

```js
import { formatVersionDisplay } from '../src/version.js';
```

(If the file’s import style keeps all imports at the top, add the import with the other `../src/` imports instead.)

Then add:

```js
{
  assert.equal(formatVersionDisplay('1.2.3', 'abc1234', true), '1.2.3');
  assert.equal(formatVersionDisplay('1.2.3', 'abc1234', false), '1.2.3+abc1234');
  assert.equal(formatVersionDisplay('1.2.3', '', false), '1.2.3+unknown');
  assert.equal(formatVersionDisplay('1.2.3', 'unknown', false), '1.2.3+unknown');
}
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `node --input-type=module -e "import { formatVersionDisplay } from './src/version.js'"`

Expected: FAIL / ERR_MODULE_NOT_FOUND for `src/version.js`.

(Alternatively run `npm test` and expect the same import failure early.)

- [ ] **Step 3: Implement `src/version.js`**

Create `src/version.js`:

```js
// App version helpers. Display strings are assembled here; Vite injects the
// raw __SPIRE_*__ constants at build/dev time (see vite.config.js).

export function formatVersionDisplay(version, gitSha, isRelease) {
  if (isRelease) return String(version);
  const sha = String(gitSha || '').trim() || 'unknown';
  return `${version}+${sha}`;
}

export function getVersionInfo() {
  const version = typeof __SPIRE_VERSION__ !== 'undefined' ? __SPIRE_VERSION__ : '0.0.0';
  const gitSha = typeof __SPIRE_GIT_SHA__ !== 'undefined' ? __SPIRE_GIT_SHA__ : 'unknown';
  const release = typeof __SPIRE_RELEASE__ !== 'undefined' ? !!__SPIRE_RELEASE__ : false;
  return {
    version,
    gitSha,
    release,
    display: formatVersionDisplay(version, gitSha, release),
  };
}
```

- [ ] **Step 4: Run unit tests**

Run: `npm test`

Expected: ends with a line like `unit checks passed; monte-carlo: 300 runs, ...` (exit 0). The new asserts must pass. `getVersionInfo` is not required in this task’s asserts.

- [ ] **Step 5: Commit**

```bash
git add src/version.js test/test_engine.js
git commit -m "$(cat <<'EOF'
feat(version): add pure display-string helper

Establish formatVersionDisplay so release vs non-release strings are unit-tested without Vite.
EOF
)"
```

---

### Task 2: Vite define injection

**Files:**
- Modify: `vite.config.js`
- Modify: `package.json` (add `release:build` only in this task)

**Interfaces:**
- Consumes: `package.json` `"version"`; `git rev-parse --short HEAD`; `process.env.SPIRE_RELEASE`
- Produces: compile-time `__SPIRE_VERSION__` (string), `__SPIRE_GIT_SHA__` (string), `__SPIRE_RELEASE__` (boolean)
- Produces script: `release:build` → `SPIRE_RELEASE=1 vite build`

- [ ] **Step 1: Add helpers and `define` in `vite.config.js`**

At the top of `vite.config.js`, extend imports:

```js
import { defineConfig } from "vite";
import { readdirSync, writeFileSync, renameSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { execSync } from "node:child_process";
```

Above `export default defineConfig({...})`, add:

```js
function spirePackageVersion() {
  try {
    return JSON.parse(readFileSync(resolve("package.json"), "utf8")).version || "0.0.0";
  } catch {
    return "0.0.0";
  }
}

function spireGitSha() {
  try {
    return execSync("git rev-parse --short HEAD", {
      cwd: resolve("."),
      stdio: ["ignore", "pipe", "ignore"],
      encoding: "utf8",
    }).trim() || "unknown";
  } catch {
    return "unknown";
  }
}

const SPIRE_VERSION = spirePackageVersion();
const SPIRE_GIT_SHA = spireGitSha();
const SPIRE_RELEASE = process.env.SPIRE_RELEASE === "1";
```

Change the exported config to:

```js
export default defineConfig({
  plugins: [bfSavePlugin()],
  define: {
    __SPIRE_VERSION__: JSON.stringify(SPIRE_VERSION),
    __SPIRE_GIT_SHA__: JSON.stringify(SPIRE_GIT_SHA),
    __SPIRE_RELEASE__: JSON.stringify(SPIRE_RELEASE),
  },
  server: {
    host: "0.0.0.0",
    port: BF_SAVE_PORT,
    allowedHosts: DEV_ALLOWED_HOSTS,
  },
});
```

Note: `JSON.stringify` on the boolean yields `true`/`false` without quotes, which is correct for a boolean define. Strings stay quoted.

- [ ] **Step 2: Add `release:build` script**

In `package.json` `scripts`, add:

```json
"release:build": "SPIRE_RELEASE=1 vite build"
```

Keep existing `"build": "vite build"` unchanged (non-release).

- [ ] **Step 3: Smoke-check injection via Vite SSR/transform**

Run:

```bash
node --input-type=module <<'EOF'
import { createServer } from 'vite';
const server = await createServer({ server: { middlewareMode: true } });
const mod = await server.ssrLoadModule('/src/version.js');
const info = mod.getVersionInfo();
console.log(JSON.stringify(info));
if (!info.version || typeof info.display !== 'string') throw new Error('bad info');
if (info.release) throw new Error('dev/ssr load must be non-release');
if (!info.display.includes('+')) throw new Error('non-release must include +sha');
await server.close();
EOF
```

Expected: prints JSON like `{"version":"1.0.0","gitSha":"<short>","release":false,"display":"1.0.0+<short>"}` and exits 0.

Then run a **fresh** process (do not reuse the first server):

```bash
SPIRE_RELEASE=1 node --input-type=module <<'EOF'
import { createServer } from 'vite';
const server = await createServer({ server: { middlewareMode: true } });
const mod = await server.ssrLoadModule('/src/version.js');
const info = mod.getVersionInfo();
console.log(JSON.stringify(info));
if (!info.release) throw new Error('expected release');
if (info.display.includes('+')) throw new Error('release display must be clean semver');
await server.close();
EOF
```

Expected: `display` equals `package.json` version with no `+`, `release: true`, exit 0.

- [ ] **Step 4: Commit**

```bash
git add vite.config.js package.json
git commit -m "$(cat <<'EOF'
feat(version): inject app version via Vite define

Bake package version, git SHA, and SPIRE_RELEASE into builds so the UI can show release vs development strings.
EOF
)"
```

---

### Task 3: Title screen label + logo debug gesture

**Files:**
- Modify: `src/ui.js` (`renderTitle`, imports)
- Modify: `src/styles.css` (title block near `.title-stats` / rose medallion)

**Interfaces:**
- Consumes: `getVersionInfo()` from `./version.js`
- Produces: `.title-version` label always visible on title; logo 5 taps / 2s toggles debug text

- [ ] **Step 1: Import and render the version label**

In `src/ui.js` imports, add:

```js
import { getVersionInfo } from './version.js';
```

In `renderTitle()`, after computing `rose` (before `sc.innerHTML`), add:

```js
  const ver = getVersionInfo();
```

Inside the title-screen markup (after `title-stats`, still inside `.title-screen`), add:

```html
    <div class="title-version" data-version-display aria-label="App version">${escHtml(ver.display)}</div>
    <div class="title-version-debug" data-version-debug aria-live="polite" hidden></div>
```

Change the logo wrapper so it is tappable for the gesture without becoming a navigational `[data-a]` action:

```js
    <div class="logo${titleText ? ' logo-raster' : ''}" data-version-logo>${titleText ? `<img class="title-wordmark" src="${titleText}" alt="SPIREBOUND">` : 'SPIREBOUND'}</div>
```

- [ ] **Step 2: Wire the multi-tap gesture after `sc.innerHTML`**

Still in `renderTitle()`, after `decodeTitleRoseAssets(sc);` and alongside the existing `sc.onclick`, add:

```js
  const logo = sc.querySelector('[data-version-logo]');
  const debugEl = sc.querySelector('[data-version-debug]');
  let taps = [];
  let debugTimer = 0;
  const hideDebug = () => {
    if (!debugEl) return;
    debugEl.hidden = true;
    debugEl.textContent = '';
  };
  const showDebug = () => {
    if (!debugEl) return;
    debugEl.hidden = false;
    debugEl.textContent = `${ver.gitSha} · ${ver.release ? 'release' : 'dev'}`;
    clearTimeout(debugTimer);
    debugTimer = setTimeout(hideDebug, 3000);
  };
  logo?.addEventListener('click', (e) => {
    e.stopPropagation();
    const now = performance.now();
    taps = taps.filter((t) => now - t < 2000);
    taps.push(now);
    if (taps.length >= 5) {
      taps = [];
      if (debugEl && !debugEl.hidden) hideDebug();
      else showDebug();
    }
  });
```

Do not route this through `data-a` / `sfx.click()` on every tap — only the existing title buttons should click-sfx.

- [ ] **Step 3: Add CSS**

Near `.title-stats` in `src/styles.css` (and clear of the rose medallion, which is bottom-left), add:

```css
.title-version {
  position: absolute;
  right: calc(18px + var(--sar));
  bottom: calc(18px + var(--sab));
  z-index: 2;
  margin: 0;
  padding: 0;
  border: 0;
  background: none;
  color: var(--text-dim);
  font-size: 11px;
  letter-spacing: 0.06em;
  opacity: 0.7;
  pointer-events: none;
  user-select: none;
}
.title-version-debug {
  position: absolute;
  right: calc(18px + var(--sar));
  bottom: calc(36px + var(--sab));
  z-index: 2;
  color: var(--text-dim);
  font-size: 11px;
  letter-spacing: 0.04em;
  opacity: 0.85;
  pointer-events: none;
}
```

If a phone-portrait container block already shrinks title chrome, add a matching smaller font (e.g. `10px`) beside the existing `.title-stats` phone rules — keep it readable, not decorative.

- [ ] **Step 4: Manual smoke**

Run: `npm run dev`

Open `http://localhost:5174/`.

Check:
1. Bottom-right shows something like `1.0.0+<sha>` (non-release).
2. Rose medallion (bottom-left) still works.
3. Five quick taps on the wordmark/logo reveals `<sha> · dev` above the version; it hides after ~3s or on another 5-tap cycle.
4. Title buttons still work.

- [ ] **Step 5: Commit**

```bash
git add src/ui.js src/styles.css
git commit -m "$(cat <<'EOF'
feat(ui): show app version on the title screen

Surface the injected version string bottom-right and reveal build debug details via a logo multi-tap.
EOF
)"
```

---

### Task 4: Release script

**Files:**
- Create: `tools/release.mjs`
- Modify: `package.json` (add `release` script)

**Interfaces:**
- Consumes: argv bump type or interactive prompt; `npm version`; `npm run release:build`
- Produces: updated `package.json` / lock version fields; rebuilt `dist/` with clean semver; printed next steps only

- [ ] **Step 1: Create `tools/release.mjs`**

```js
#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { createInterface } from 'node:readline';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const BUMPS = new Set(['patch', 'minor', 'major']);

const POLICY = {
  patch: 'bugfix / polish',
  minor: 'new content / systems',
  major: 'save or rules incompatibility / large rewrite',
};

function readVersion() {
  return JSON.parse(readFileSync(resolve('package.json'), 'utf8')).version;
}

function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { stdio: 'inherit', shell: false, ...opts });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

function askBump() {
  return new Promise((resolveAsk) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    console.log('Semver bump (game-oriented):');
    for (const [k, v] of Object.entries(POLICY)) console.log(`  ${k.padEnd(6)} — ${v}`);
    rl.question('Choose patch / minor / major: ', (answer) => {
      rl.close();
      resolveAsk(String(answer || '').trim().toLowerCase());
    });
  });
}

const argBump = String(process.argv[2] || '').toLowerCase();
const bump = BUMPS.has(argBump) ? argBump : await askBump();
if (!BUMPS.has(bump)) {
  console.error(`Invalid bump: ${bump}`);
  process.exit(1);
}

const before = readVersion();
run('npm', ['version', bump, '--no-git-tag-version']);
const after = readVersion();

run('npm', ['run', 'release:build'], {
  env: { ...process.env, SPIRE_RELEASE: '1' },
});

console.log(`
Release build ready: ${before} → ${after}

Suggested next steps (not run automatically):
  git add package.json package-lock.json dist src
  git commit -m "release: v${after}"
  git tag v${after}
  git push && git push origin v${after}
`);
```

- [ ] **Step 2: Register the script**

In `package.json` `scripts`:

```json
"release": "node tools/release.mjs"
```

- [ ] **Step 3: Validate invalid argv without bumping**

```bash
node tools/release.mjs nope
```

Expected: exits non-zero with `Invalid bump: nope`.

Do **not** run a real `patch` bump in this task unless the owner asked for a release.

- [ ] **Step 4: Commit**

```bash
git add tools/release.mjs package.json
git commit -m "$(cat <<'EOF'
feat(version): add npm run release helper

Bump semver, run a SPIRE_RELEASE build, and print manual tag/commit steps without touching git itself.
EOF
)"
```

---

### Task 5: Documentation

**Files:**
- Create: `docs/app-versioning.md`
- Modify: `docs/README.md` (index rows for the doc + spec/plan)
- Modify: `README.md` (short pointer under Tech or Tests)

- [ ] **Step 1: Write `docs/app-versioning.md`**

```md
# App versioning

Spirebound’s player-visible version comes from `package.json` `"version"`.
Vite injects it at build/dev time (`__SPIRE_VERSION__`, `__SPIRE_GIT_SHA__`,
`__SPIRE_RELEASE__`). The title screen shows the display string bottom-right.

## Display rules

| Build | Corner text |
|---|---|
| `npm run dev` | `X.Y.Z+<shortsha>` |
| `npm run build` | `X.Y.Z+<shortsha>` |
| `npm run release:build` / `SPIRE_RELEASE=1` | `X.Y.Z` |

Five quick taps on the title wordmark reveal `<sha> · dev|release`.

## When to bump

- **patch** — bugfix / polish
- **minor** — new content / systems
- **major** — save or rules incompatibility / large rewrite

## Release flow

    npm run release          # prompts for patch|minor|major
    # or: npm run release -- patch

The script bumps `package.json`, runs a release build into `dist/`, then prints
suggested `git commit` / `git tag vX.Y.Z` commands. It does **not** commit,
tag, or push.

Ordinary mid-sprint `npm run build` commits may keep the `+sha` suffix on
purpose so committed `dist/` is not mistaken for a formal release.

Design: [`superpowers/specs/2026-07-11-app-versioning-design.md`](superpowers/specs/2026-07-11-app-versioning-design.md).
```

When writing the real `docs/app-versioning.md`, turn the indented release commands into a normal fenced `bash` code block.

- [ ] **Step 2: Index it**

In `docs/README.md` under **Active implementation specs**, add rows:

```md
| [`superpowers/specs/2026-07-11-app-versioning-design.md`](superpowers/specs/2026-07-11-app-versioning-design.md) | **Current** — package.json-sourced app version, title-screen label, release build convention |
| [`superpowers/plans/2026-07-11-app-versioning.md`](superpowers/plans/2026-07-11-app-versioning.md) | Executor plan — Vite define, title UI, `npm run release` |
| [`app-versioning.md`](app-versioning.md) | Operator note — display rules, bump policy, release flow |
```

- [ ] **Step 3: README pointer**

In `README.md` Tech table or just after the Tests blurb, add one sentence:

```md
App version: `package.json` is the source of truth; the title screen shows it. See [`docs/app-versioning.md`](docs/app-versioning.md).
```

- [ ] **Step 4: Commit**

```bash
git add docs/app-versioning.md docs/README.md README.md docs/superpowers/plans/2026-07-11-app-versioning.md
git commit -m "$(cat <<'EOF'
docs: document app versioning and release flow

Add the operator note and index links for the title-screen version and npm run release convention.
EOF
)"
```

(Include this plan file in the same commit if it is not already committed.)

---

## Self-review (plan vs spec)

| Spec requirement | Task |
|---|---|
| `package.json` source of truth | 2, 4 |
| Display `X.Y.Z` vs `X.Y.Z+sha` | 1, 2, 3 |
| Explicit `SPIRE_RELEASE=1` | 2, 4 |
| Title bottom-right label | 3 |
| Logo 5 taps / 2s debug (`sha` + release\|dev) | 3 |
| `npm run release` bump + build + print only | 4 |
| Game-oriented semver copy | 4, 5 |
| No CHANGELOG / no Settings / no auto git | 4 non-goals respected |
| Unit tests for formatter | 1 |
| Docs note | 5 |
| `engine`/`vigil` isolation | `version.js` imported only from `ui.js` + tests |

No TBD placeholders remain. Gesture timings match the spec (5 taps / 2s, ~3s dismiss). Pure helper signature matches Task 1 ↔ Task 3.
