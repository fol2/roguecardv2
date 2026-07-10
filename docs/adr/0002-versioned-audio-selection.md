# Versioned, runtime-selected audio packs

Spirebound keeps logical Music Cue/SFX ids stable while allowing deployed
audio to change. Music and SFX select independent complete versions, with an
optional installed-file override per logical id. Resolution is override, then
the selected pack's canonical file, then the immutable base file.

The existing roots stay byte-preserved as `stained-glass-v1` and
`ashglass-v1`; later versions use subdirectories. Vite compiles every installed
MP3 into the deployment, while playback remains lazy. The host supplies
`audio-selection.json` at boot, so it can switch already-compiled files without
rebuilding JavaScript. New files still require build/deploy.

The dev server exposes a same-origin atomic save endpoint through `?audio=1`.
Production is read-only; an authenticated upload/admin backend is explicitly
not part of the static game.

## Considered options

- Rename/move the current files into a version folder — rejected: preserving
  the maintained current set and avoiding a large binary churn is safer.
- Hard-code one import table per release — rejected: every individual swap
  would require a code edit and rebuild.
- Accept arbitrary runtime URLs — rejected: it weakens validation, offline
  behaviour, and rollback, and creates an unowned remote-asset security seam.
- Allow incomplete versions as whole packs with silent fallback — rejected:
  a version label must mean a complete set. Partial versions remain useful as
  explicit per-file override sources.
