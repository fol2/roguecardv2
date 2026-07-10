# Spirebound versioned audio packs — engineering plan

**Date:** 2026-07-10  
**Status:** completed and verified  
**Source:** owner request plus the shared audio-strategy review

## Outcome

Spirebound can select Music and SFX packs independently, and can replace any
single Music Cue or SFX id with one file from another installed pack. The
selection is runtime data rather than hard-coded imports. The current files
remain in place and become the permanent base versions:

- Music: `stained-glass-v1`
- SFX: `ashglass-v1`

No existing MP3 is renamed, moved, overwritten, or deleted.

## Boundaries

The game remains a static Vite application. The runtime read contract is a
public `audio-selection.json` file, so a production host may serve a different
selection without rebuilding JavaScript. The repository's write endpoint is
dev-only and same-origin, like the battlefield editors; a production admin API,
authentication, asset upload, and downloadable DLC are out of scope.

Every selectable MP3 is still compiled into the application. Adding a new pack
therefore requires an application build, but switching between installed packs
or changing an individual override only requires changing the selection JSON.

## Asset and selection contract

The current root folders are the immutable base packs:

```text
src/assets/musics/*.mp3  -> stained-glass-v1
src/assets/sfx/*.mp3     -> ashglass-v1
```

Future versions use one directory per version:

```text
src/assets/musics/<version>/*.mp3
src/assets/sfx/<version>/*.mp3
```

Canonical filenames define whole-pack completeness. A version appears in the
whole-pack selector only when it covers every logical id for that kind. A
partial/draft version can still provide individual files, but cannot silently
masquerade as a complete pack. An individual override is an explicit
`<version>/<filename>` asset ref, so a Cue or SFX id can use any installed file
of the same audio kind.

Selection precedence is:

```text
valid per-id override -> selected pack's canonical file -> base pack file
```

Music and SFX never fall back across kinds.

## Runtime flow

```text
/audio-selection.json
        +
Vite-compiled MP3 inventory
        |
        v
pure audio-pack resolver
        |
        +----> src/music.js (Music Cue playback and cache by asset ref)
        +----> src/audio.js (SFX playback and cache by asset ref)
        +----> ?audio=1 (source display, version and override controls)
```

The existing public playback interfaces stay intact: `music.play(...)`,
`music.preview(...)`, `music.playFor*`, `sfx.<id>()`, and `sfx.attack(...)`.
Engine and Vigil import boundaries do not change.

## Test seams

The owner-requested backend behaviour defines two public seams:

1. The Node-safe resolver and selection validator: independent version choice,
   override precedence, defensive base fallback, kind isolation, complete-pack
   validation, and strict rejection of unknown ids/files.
2. The dev control surface: `?audio=1` serialises the selected versions and
   overrides to the same-origin `/__audio-save` endpoint, and the persisted
   JSON is the next runtime selection.

Tests observe these interfaces, not buffer/cache internals.

## Delivery slices

1. Add failing resolver, validation, inventory, and serialisation checks to the
   existing Node self-check.
2. Add the pure audio-pack module, the default JSON, and the browser asset
   adapter built from `import.meta.glob`.
3. Route `music.js` and `audio.js` through resolved asset refs. Key decoded
   buffers by asset ref, and treat same Cue id with a changed ref as a switch.
4. Add the dev-only atomic save endpoint and `?audio=1` controls for independent
   pack versions and per-id file overrides.
5. Correct the audio strategy documentation: 14 live plus 8 hidden Music Cues,
   explicit seamless-loop constraints, restrained organ/top-end guidance,
   ElevenLabs' generation-duration versus post-trim distinction, and fatigue
   testing with several SFX candidates.
6. Run `npm test`, `npm run build`, focused browser checks, and a two-axis
   Standards/Spec review. Rebuild tracked `dist/` as the final build gate.

## Gates and rollback

- `npm test` must prove the current root assets cover every canonical id.
- A missing or invalid runtime JSON must silently select both base packs.
- An incomplete non-base version cannot be selected as a whole pack, but its
  valid files remain available as explicit per-id overrides.
- The production bundle must contain no write endpoint.
- Rollback is data-only: select `stained-glass-v1` and `ashglass-v1`, then clear
  both override maps.
- Existing unrelated worktree changes are preserved and excluded from this
  implementation.

## Verification record

Completed on 2026-07-10:

- The shared downloadable package was retrieved through the owner's Chrome
  session and verified as three Markdown authoring files, not audio binaries.
  Its exact Music/SFX prompt corpus, motif/mix laws, numeric SFX parameters,
  hidden-chain reuse notes, and QA matrix were reconciled into the live docs.
- `npm test`: Node-safe resolver, complete synthetic v2 switches, manifests,
  bounded host-config fetch, and generation-ledger contracts passed alongside
  the 300-run Monte Carlo check.
- `npm run build`: production bundle and tracked `dist/` rebuilt successfully.
- `npm run test:e2e`: disk editor 1/1, random agent 1/1, main matrix 75 passed
  with 66 intentional project skips, and visual matrix 36/36.
- Focused audio Playwright gate: 4/4, including a deterministic selected-file
  decode failure, base fallback, and no retry/restart churn.
- Production preview: 58 effective sources visible, no editor, no page errors,
  and `POST /__audio-save` returns 404.
- Standards and Spec reviews: no remaining P0-P3 findings.

### Installed v2 production release

- Music: 44 Suno Pro source candidates (two per Cue) were decoded and measured;
  one source per Cue was selected, downloaded from the official Suno CDN, and
  rendered into 22 bounded 90–120 second `stained-glass-v2` files. The final
  renderer excludes generated fade tails, uses a three-second quadratic
  tail-to-head crossfade, measures both stereo channels, caps seam swell at
  +3.5 dB, and normalises to −20 LUFS with true-peak headroom.
- SFX: all 36 `ashglass-v2` files were generated through the official
  ElevenLabs sound-generation API. Independent audits rejected the first
  render and drove corrective candidate passes for high-only, sub-only,
  pure-tone, silent-tail, mono, and family-level failures. The promoted set has
  exact authored durations, centred 48 kHz stereo delivery, and explicit
  candidate labels in its manifest.
- Integrity: both schema-v2 manifests pass full decode, duration, hash, media,
  and exact ledger/catalogue validation. The Music gate additionally binds
  each manifest source ID, Suno URL, variant, plan, bytes, and output hash to
  `render-provenance.json`; adversarial forged-provenance tests fail closed.
- Activation: `public/audio-selection.json` selects `stained-glass-v2` and
  `ashglass-v2` with empty override maps. The original root MP3s remain
  byte-untouched and selectable as `stained-glass-v1` / `ashglass-v1`.
- Final gates: integrated `npm test`, `npm run build`, focused audio Playwright
  4/4, disk editor 1/1, random agent 1/1, main matrix 75 passed with 66
  intentional skips, and visual matrix 36/36. No machine blocker remains;
  composition/timbre preference and unwanted-vocal listening remain the
  owner's separate subjective acceptance pass in `?audio=1`.
