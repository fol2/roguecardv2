# Round 5 Full-Round gate

**Exit contract:** `Full-Round`  
**Date:** 2026-07-17  
**Branch:** `jamesto/round5-production-engineering-continuation`  
**PR:** https://github.com/fol2/roguecardv2/pull/27  
**Tip at closure evidence:** `9c628309a9655d82567671f38d468034ae480c17`  
**Base SHA:** `179bdf9e5148164bfd8795496fc616092305736d` (`origin/main` at Task 40 Step 1 / closure)

## Decision: READY FOR REVIEW

Round 5 P1–P7 product work is on this tip. Store-kit source equivalence is green,
Darwin+Linux title baselines are committed, committed `dist/` rebuilds clean, CI
run [29544576195](https://github.com/fol2/roguecardv2/actions/runs/29544576195)
is **success**, and local Node + preview smoke gates below are green.

This record makes **no** actual-Safari, iOS/iPadOS Simulator, WKWebView-as-app,
hardware, packaging, or mobile-support claim.

**WebKit-safe API review: PASS** (Tasks 5–40 carry-forward; browser-portability
review only).

---

## Tip SHAs

| Role | SHA | Notes |
|---|---|---|
| Base SHA (`origin/main`) | `179bdf9e5148164bfd8795496fc616092305736d` | Ancestor of HEAD; unchanged through closure evidence |
| P7 store capture source | `ccbbc2252dd0b5c4563265a82d683a391d022192` | `manifest.json.sourceSha` |
| P7 final baseline source | `72c492119f0b09d69ca7fbe9b5dfb3ba3c4ae2f0` | Darwin update + Linux `update-baselines` |
| P7 baselines commit | `9c628309a9655d82567671f38d468034ae480c17` | `test: approve the P7 visual baselines` |
| FE_P7_MERGE | `a3722658fa872b7750561e233510f6b5ed40e25f` | Approved FE ship-front package |
| Dist refresh | `72c492119f0b09d69ca7fbe9b5dfb3ba3c4ae2f0` | `build: refresh dist for Round 5 ship-front assets` |

Rollback of FE merge: `git revert -m 1 a3722658fa872b7750561e233510f6b5ed40e25f`.

---

## Store / baseline equivalence

```text
STORE_SOURCE_SHA = ccbbc2252dd0b5c4563265a82d683a391d022192
git diff STORE_SOURCE_SHA..9c628309 — src/test/public(excl icons)/configs/capture tools
→ empty (equivalence ok)
```

Linux baselines: workflow [29543872347](https://github.com/fol2/roguecardv2/actions/runs/29543872347)
installed via `tools/install-baseline-artifact.mjs --expect-sha 72c49211…`.
Changed snapshots: 12 title PNGs (Darwin + Linux).

---

## Local gates (closure machine)

| Command | Exit | Summary |
|---|---|---|
| `npm run test:ci` | **0** | ci contract + boundaries + baseline tools |
| `npm test` | **0** | unit + monte-carlo |
| `npm run test:progression` | **0** | emberglass pacing |
| `npm run test:act-coupling` | **0** | allowlisted findings only |
| `node tools/check-bundle-budget.mjs` | **0** | entry gzip **475236** ≤ max 507904 (pre-Pixi 323218) |
| `node tools/verify-production-surface.mjs` | **0** | 12 markers clean |
| `npx vite build --outDir /tmp/spirebound-round5-final-dist` + `npm run build` | **0** | committed `dist/` dirty-set empty after rebuild |
| version embed | **0** | `0.5.0` + `unknown` present; package version `0.5.0` |
| production-profile desktop | **0** | fresh + veteran **2/2** |
| production-profile iphone/ipad-webkit | **local skip** | WebKit browser binary missing on this host; covered by CI after Ready |

---

## CI evidence (tip `9c628309`)

Run: https://github.com/fol2/roguecardv2/actions/runs/29544576195 — **success**

| Aggregate | Result |
|---|---|
| `unit` / `unit tests` / `build dist` / `progression` | pass |
| `e2e pool 1/20` … `20/20` | pass (pool 20 retried once after title-logo flake) |
| `e2e random 1–3` / `e2e aux` | pass |
| `e2e` / `e2e nonvisual` / `p2-base` | pass |

Draft mode skipped `e2e webkit` / `e2e leak` / `e2e visual` matrix jobs; undrafting
this PR re-enables the Ready/full gate. Visual contract already refreshed locally
(Darwin) + via `update-baselines.yml` (Linux) at baseline source `72c49211`.

---

## Playwright WebKit browser-emulation rows

Canonical four rows (Playwright patched WebKit + device descriptors only):

| Row | Evidence |
|---|---|
| iPhone 17 Pro / portrait / fresh | CI Ready lane / prior P6 standing carry-forward; local binary missing at closure |
| iPhone 17 Pro / portrait / veteran | same |
| iPad Mini landscape / fresh | same |
| iPad Mini landscape / veteran | same |

Desktop production-profile (Chromium) fresh+veteran: **PASS** locally at closure.

---

## Preview smoke (`dist/`)

| Field | Value |
|---|---|
| Preview origin | `http://127.0.0.1:49565` |
| Source SHA | `9c628309a9655d82567671f38d468034ae480c17` |
| `dist/index.html` SHA-256 | `65cfc23e15ed3f745f59e96d294cbaa7c24a52a4bdb2958a73e2d39f79d47cb4` |
| Stage shape | `desktop-landscape` |
| Version label | `0.5.0+unknown` |
| Actions | title paint → embark → normal combat (`duskfang`); settle; hand seats=5; plate `act1-backdrop` |
| **Automated preview smoke** | **PASS** |

Owner-visible five-tap / keyboard End Turn manual rows were not separately
re-logged in a human browser session at this close; automated preview + CI cover
the hard gates. Optional owner re-walk welcome.

---

## P7 ship-front package

See `docs/superpowers/reports/2026-07-10-round5-p7-handoff.md`.

- Boss plates wired via `resolveCombatPlates` (normal fights never consume overrides)
- Title layers + unlock toast frame
- Provisional store kit under `docs/store-assets/round5/` + public icons
- Label: provisional / marketing-only

---

## Deferred mobile claims (explicit)

Round 5 does **not** claim:

- branded Mobile Safari
- iOS/iPadOS Simulator / WKWebView-as-app
- physical device matrix
- App Store / Play packaging readiness beyond provisional store kit assets

Future work: `docs/superpowers/specs/2026-07-11-mobile-migration-simulator-tooling-design.md`
(non-executable until owner activation).

---

## PERF

Bundle budget hard gate green (475236 gzip). Full PERF lane: prior P6 standing /
CI policy — `PERF_WARNING` alone cannot block Full-Round. No invalid/zero-frame
measurement recorded at this close.

---

## FE / PE write history (P7)

| Lane | Tip | Notes |
|---|---|---|
| FE | `b0b039d6` | Owner: backdrop=original act plates; mid/ledge=B; title×3+toast promote |
| PE merge | `a3722658` | Write-set gated FE package |
| PE ship-front + kit + dist + baselines | `9c628309` | This tip |

---

## Rollback

- FE package: `git revert -m 1 a3722658fa872b7750561e233510f6b5ed40e25f`
- Full Round 5 PE tip: reset/revert relative to Base SHA `179bdf9e…` only with
  owner instruction (large range).
