# Music Cue layer with independent buses

Spirebound is adding a real BGM layer over the old act ambient drone. We decided on a flat Music Cue registry (`music.play(cueId)`) in `src/music.js`, short crossfades, lazy load + `warmWith`, and independent Music/SFX volume+mute buses with an Audio Panel. Unwired hidden-suite cues stay registered so future content only adds callers. The drone is retired rather than mixed under BGM.

Cue identity remains stable; version/file selection is the separate deployment concern recorded in [`0002-versioned-audio-selection.md`](0002-versioned-audio-selection.md).

## Considered Options

- Scene resolver (`setScene(state)`) — rejected: music would own too much game-state knowledge
- Keep drone under BGM — rejected: mix control and mobile noise
- Register only currently wired cues — rejected: future content would keep reshaping the registry
