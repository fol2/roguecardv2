# Versioned audio packs

Glassvow resolves every Music Cue and SFX id through one runtime selection.
The current binaries stay at their original paths and are permanent base
versions:

| Kind | Base version | Existing files |
|---|---|---|
| Music | `stained-glass-v1` | `src/assets/musics/*.mp3` |
| SFX | `ashglass-v1` | `src/assets/sfx/*.mp3` |

Do not move, overwrite, or delete those files when authoring a replacement.

The first replacement release is installed alongside those base files:

| Kind | Installed version | Provider | Files | Delivery |
|---|---|---|---:|---|
| Music | `stained-glass-v2` | Suno Pro | 22 | 90–120s, 48 kHz stereo MP3; tail-excluded quadratic loops at −20 LUFS |
| SFX | `ashglass-v2` | ElevenLabs | 36 | Exact ledger durations, 48 kHz centred stereo MP3; phone/fatigue/family mastering |

Each v2 directory contains a strict schema-v2 `manifest.json`. Music also keeps
`render-provenance.json`, including selected Suno source IDs, candidate/output
hashes, render measurements, and the renderer contract.

## Add a version

Put new files in a version directory:

```text
src/assets/musics/stained-glass-v2/title.mp3
src/assets/musics/stained-glass-v2/act1-combat.mp3
src/assets/sfx/ashglass-v2/click.mp3
src/assets/sfx/ashglass-v2/atkHeroMed.mp3
```

Version ids use lower-case letters, digits, and hyphens. Filenames use letters,
digits, dots, underscores, and hyphens, and must end in `.mp3`.

A version is selectable as a whole pack only when it contains every canonical
file for that kind: 22 Music Cues or 36 SFX files. A partial version is useful
while producing a pack because each file is still available as an individual
override.

Before selecting a completed render, run the read-only pack gate:

```bash
node tools/validate-audio-pack.mjs --kind music --version stained-glass-v2
node tools/validate-audio-pack.mjs --kind sfx --version ashglass-v2
node tools/validate-audio-pack.mjs --kind music --version stained-glass-v2 --verify-manifest
node tools/validate-audio-pack.mjs --kind sfx --version ashglass-v2 --verify-manifest
node tools/render-suno-music-pack.mjs \
  --candidates /path/to/suno-candidates \
  --selection docs/audio-production/stained-glass-v2-selection.json \
  --version stained-glass-v2 --check
```

The gate requires the exact canonical MP3 set, fully decodes every file, checks
the current ledger's duration contract, and calculates SHA-256 hashes. Use
`--manifest-seed` to print a schema-v2 provenance manifest seed, fill its
generation date, licence/plan, selected candidate labels, and source ids or URLs,
then use `--verify-manifest` to prove that the manifest still matches the
installed bytes. When a provider returns no stable source reference, explain
that exception in `provenance.notes`. The tool requires FFmpeg/FFprobe and never
writes files.

All installed versions are compiled into the deployment, but MP3 bytes remain
lazy network loads. Adding a file therefore requires build/deploy; switching
between already-installed files does not. Each additional music version adds
roughly the size of that music folder to `dist/`.

## Select versions and individual files

Open `http://localhost:5174/?audio=1` in development. The Runtime audio
selection panel has independent whole-pack selectors for Music and SFX. Each
gallery row also has an override selector containing every installed file of
the same kind, with Pack default once at the top and other same-action versions
next. Save writes `public/audio-selection.json` through the
dev-only, same-origin `/__audio-save` endpoint and hot-applies the selection
without a page reload. ▶ previews the current row choice, including unsaved
overrides.

Resolution precedence is:

```text
valid per-id override -> selected pack's canonical file -> immutable base file
```

The persisted shape is deliberately small:

```json
{
  "music": {
    "version": "stained-glass-v2",
    "overrides": {
      "title": "stained-glass-v2/title-alt.mp3"
    }
  },
  "sfx": {
    "version": "ashglass-v2",
    "overrides": {
      "hover": "ashglass-v2/hover-soft.mp3"
    }
  }
}
```

Overrides are stable inventory refs, not URLs or filesystem paths. Unknown
versions, ids, refs, malformed objects, and incomplete whole packs are rejected
before a save. `public/audio-selection.json` is that Save target: unit tests
require it to stay valid for the installed inventory and to match the gallery
serialiser, not to pin any particular pack version.

## Production host contract

The production bundle is read-only and contains no save endpoint. At boot the
game requests `${BASE_URL}audio-selection.json` with `cache: no-store` before
any cue or preload starts. A backend or CDN may replace that JSON to switch
already-compiled assets for new page loads. Serve the JSON with `Cache-Control:
no-store` (or an operationally equivalent revalidation policy).

If the JSON is missing, malformed, or invalid for that deployment, both base
versions are selected and diagnostics appear in the audio gallery/console. A
production service that uploads arbitrary new audio is outside this static-app
contract and would need its own authenticated asset store and cache policy.

## Rollback

Select `stained-glass-v1` and `ashglass-v1`, clear both override maps, then Save.
This is data-only; no audio file needs to be restored.

