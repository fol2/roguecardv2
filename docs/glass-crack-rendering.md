# Glass-crack rendering — transmission glass (shipped) & the superseded shader

Status, 2026-07-07: **"Panel B" — three.js `MeshPhysicalMaterial` transmission — is the
shipped crack/death renderer** (`src/mesh.js`). The original custom Voronoi refraction
shader ("Panel A") is **superseded**; it is documented here for the record and survives
in the comparison playground.

## How we got here

Both approaches were built side-by-side in a playground (`glass-compare.html` +
`glass-compare.js`, served by the dev server) with identical crack sites, ignite ramps
and Voronoi shatters, and evaluated over several sessions. A was chosen first, then B
won after gaining an alpha-feathered glass region, a fire ignite and escaping light
beams. The playground stays in-repo as the tuning bench: every measure below has a
slider there.

## The shipped architecture (B)

Every combatant is a **stack of planes sharing one vertex-warped geometry** inside the
single `#mesh` WebGL canvas (idle warp is unchanged). Crack sites (`{u,v}` in body-UV,
max 56) live in plain JS on the plane record and drive **canvas bakes**, not shader
uniforms:

| layer | renderOrder | material | role |
|---|---|---|---|
| body | 1 | `ShaderMaterial` (raster art + `uFlash`; `uCut` alpha-discard) | the creature. Flips **opaque** on first crack so it lands in the transmission back-buffer |
| fire | 2 | `MeshBasicMaterial`, **opaque + additive**, seam-glow bake | death ignite between body and glass. Opaque is load-bearing: transmission refracts a back-buffer of the *opaque* scene only |
| glass | 3 | `MeshPhysicalMaterial` transmission 1, ior 1.4 | the crack itself: baked crack-region **alphaMap** (glass exists only at cracks) + baked Voronoi **normalMap** (seams refract for free) |
| beams | 4 | `MeshBasicMaterial`, transparent additive, padded ×1.6 plane | light shafts escaping the silhouette during ignite; zoom-blur of the seam glow from the impact centroid |

Bakes (`bakeCrackMask`, `bakeCrackNormal`, `bakeSeamGlow`, `bakeCrackBeams`) run at
192² on `meshCrack` (and on `meshDeath`'s first ramp frame for fire/beams). The PBR
pass needs lights + a PMREM `RoomEnvironment` and ACES tone mapping — added lazily
with the first glass shell; the body layer is a raw `ShaderMaterial`, untouched by
tone mapping.

### The death rite (default death animation)

`case 'die'` in `src/ui.js`: stagger → `igniteVessel` ramps `meshDeath` 0→1 with a
smoothstep over the held beat (200ms, boss 320ms) — fire tints in, beams surge in the
last two-thirds — then **the instant the ramp peaks** `meshHandoff` snapshots
body+fire+glass (beams excluded; they gutter out over 200ms while the shards fly),
harvests the sites, releases the plane, and `V.shatter` breaks the capture into its
exact Voronoi cells with **ballistic physics** (gravity 2400px/s², tumble, per-shard
floor bounce at each cell's own lowest vertex, damped second bounce).

### Approved measures (user sign-off 2026-07-07, constants in `src/mesh.js`)

| constant | value | meaning |
|---|---|---|
| `GLASS_AREA` | 0.45 | glass reach past each crack site (uv) |
| `GLASS_FEATHER` | 1 | region edge fades from the core — no visible disc |
| `GLASS_ALPHA` | 1 | shell opacity |
| `BEAM_STR` | 2.5 | how hard the light escapes |
| `BEAM_REACH` | 1.1 | how far the shafts stretch |
| `BEAM_DECAY` | 1.55 | how fast a ray dies along its length |

**No silhouette or radius mask on the beams** — a centroid-bounded mask once pinned
the rays inside the mob whenever a kill spread sites across the whole body.

### Tiers & fallbacks (unchanged contracts)

- `LITE` (coarse pointer / `?input=touch`): no glass, no bakes — drawn SVG cracks +
  CSS `igniting` fallback, exactly as before.
- `meshCrack` returns `false` before the body texture decodes → drawn-crack fallback.
- `?mesh=0` disables the layer wholesale; `V.shatter` falls back to radial cells with
  no capture.

## The superseded shader (A), for the record

One `ShaderMaterial` per combatant; crack sites as `uSites` vec4 uniforms (uv + per-
shard refraction offset). Per fragment: nearest-two-site Voronoi → refract the body's
own texture through the winning shard, chromatic bevel + lit seam at the bisector,
`uDeath` mixes seam light cool→warm. Cheap (no render target, early-out when intact),
fully procedural, but its look ceiling — flat unlit refraction, no real thickness,
fresnel or environment response — is why B superseded it. Last shipped version:
commit `22f060b` (`CRACK_VERT`/`CRACK_FRAG` in `src/mesh.js`); still runnable today as
Panel A of `glass-compare.html`.

## Tuning workflow

1. `npx vite --port 5522` in the worktree, open `/glass-compare.html`.
2. Tune B GLASS / BEAMS sliders; ☠ kill runs the full timing-faithful rite.
3. Copy approved numbers into the constants at the top of `src/mesh.js` (and update
   the table above + playground defaults).
