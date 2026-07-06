// Procedural SVG art — plus the resolver for generated raster assets.
// Asset folders mirror <root>/<category>/<id>.<png|jpg|jpeg|webp> (ids = data.js internal keys);
// a missing file resolves to null and callers fall back to the SVG below.
const ASSET_URLS = import.meta.glob(['./assets*/*/*.png', './assets*/*/*.jpg', './assets*/*/*.jpeg', './assets*/*/*.webp'], { eager: true, query: '?url', import: 'default' });
const ASSET_EXTS = ['png', 'jpg', 'jpeg', 'webp'];
export const ASSET_SETS = {
  live: { label: 'Live', root: 'assets' },
  'nano-banana': { label: 'Nano Banana Pro', root: 'assets-nano-banana' },
  'gpt-nano-pass': { label: 'GPT -> Nano Pass', root: 'assets-gpt-nano-pass' },
  legacy: { label: 'Legacy', root: 'assets-legacy' },
};
const DEFAULT_ASSET_SET = 'live';
const assetSet = (set = DEFAULT_ASSET_SET) => ASSET_SETS[set] ?? ASSET_SETS[DEFAULT_ASSET_SET];
export const assetSetIds = () => Object.keys(ASSET_SETS);
export const assetSetLabel = (set = DEFAULT_ASSET_SET) => assetSet(set).label;
export const assetUrl = (category, id, set = DEFAULT_ASSET_SET) => {
  const { root } = assetSet(set);
  for (const ext of ASSET_EXTS) {
    const url = ASSET_URLS[`./${root}/${category}/${id}.${ext}`];
    if (url) return url;
  }
  return null;
};
export const assetList = (category, set = DEFAULT_ASSET_SET) => {
  const { root } = assetSet(set);
  return Object.entries(ASSET_URLS).filter(([k]) => k.startsWith(`./${root}/${category}/`)).map(([, u]) => u);
};

let uidc = 0;
const uid = () => `g${++uidc}`;
const hsl = (h, s, l, a = 1) => `hsla(${h},${s}%,${l}%,${a})`;

function defs(id, hue, glowColor) {
  // glass & ink: panes are backlit — saturated, brighter toward the light source
  return `<defs>
    <linearGradient id="${id}b" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${hsl(hue, 55, 38)}"/><stop offset="0.55" stop-color="${hsl(hue, 50, 20)}"/><stop offset="1" stop-color="${hsl(hue, 55, 9)}"/>
    </linearGradient>
    <linearGradient id="${id}d" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${hsl(hue, 45, 24)}"/><stop offset="1" stop-color="${hsl(hue, 50, 5)}"/>
    </linearGradient>
    <radialGradient id="${id}g"><stop offset="0" stop-color="${glowColor}" stop-opacity="1"/><stop offset="1" stop-color="${glowColor}" stop-opacity="0"/></radialGradient>
    <filter id="${id}f" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>`;
}

// glass & ink: every filled pane gets a dark lead outline drawn *behind* its
// fill (paint-order), turning the procedural bodies into leaded glasswork.
// Eyes/halos (plain-color circles) are skipped — light doesn't get leading.
const LEAD = 'stroke="#070a12" stroke-width="3.6" paint-order="stroke" stroke-linejoin="round"';
function leadGlass(s) {
  return s
    .replace(/<path(?![^>]*stroke=)(?![^>]*fill="none")([^>]*?)\/>/g, `<path$1 ${LEAD}/>`)
    .replace(/<(circle|ellipse)([^>]*fill="url\(#[^"]+[bd]\)"[^>]*?)\/>/g, (m, tag, attrs) =>
      attrs.includes('stroke=') ? m : `<${tag}${attrs} ${LEAD}/>`);
}

// a jagged glass crack from an impact point: dark score + bright refraction
export function crackSvg(big = false) {
  const cx = 58 + Math.random() * 84, cy = 55 + Math.random() * 80;
  let d = '';
  const branches = big ? 5 : 3;
  for (let b = 0; b < branches; b++) {
    let a = Math.random() * Math.PI * 2, x = cx, y = cy;
    d += `M${x.toFixed(1)} ${y.toFixed(1)}`;
    const segs = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < segs; i++) {
      const len = (big ? 15 : 10) * (0.6 + Math.random());
      a += (Math.random() - 0.5) * 1.15;
      x += Math.cos(a) * len;
      y += Math.sin(a) * len;
      d += `L${x.toFixed(1)} ${y.toFixed(1)}`;
    }
  }
  return `<g class="crack"><path d="${d}" stroke="#0a0d18" stroke-width="3" fill="none" opacity=".75"/><path d="${d}" stroke="#dfeaff" stroke-width="1.3" fill="none" opacity=".8"/></g>`;
}
const eye = (x, y, r, c) => `<circle class="eye" cx="${x}" cy="${y}" r="${r}" fill="${c}"/><circle cx="${x}" cy="${y}" r="${r * 2.2}" fill="${c}" opacity="0.18"/>`;

const BODIES = {
  wisp(id, hue, g) {
    return `<g class="breathe">
      <path d="M100 78 q-26 44 -14 74 q6 16 14 26 q8-10 14-26 q12-30 -14-74Z" fill="url(#${id}d)" opacity=".7"/>
      <path d="M78 96 q-20 30 -8 52 M122 96 q20 30 8 52" stroke="${hsl(hue, 40, 24)}" stroke-width="7" fill="none" opacity=".6"/>
      <circle cx="100" cy="78" r="34" fill="url(#${id}b)" filter="url(#${id}f)"/>
      <circle cx="100" cy="78" r="46" fill="url(#${id}g)" opacity=".35"/>
      ${eye(100, 76, 9, g)}
    </g>`;
  },
  beast(id, hue, g) {
    return `<g class="breathe">
      <path d="M30 150 q-6-38 26-54 q20-44 62-40 q16 2 22 14 l26-10 q-4 22 -18 28 q10 18 6 34 q-4 20 -24 28 l4 20 -18 0 -6-14 q-22 8 -44 2 l-4 12 -18 0 2-20 q-14-4 -16 0Z" fill="url(#${id}b)"/>
      <path d="M118 56 l24-10 q-4 20 -18 26Z" fill="url(#${id}d)"/>
      <path d="M36 148 q-10-34 22-50" stroke="${hsl(hue, 35, 22)}" stroke-width="6" fill="none"/>
      <path d="M64 108 q20 14 48 6" stroke="${hsl(hue, 30, 8)}" stroke-width="5" fill="none" opacity=".7"/>
      ${eye(128, 74, 5.5, g)}${eye(112, 70, 5, g)}
      <path d="M138 92 l16 6 -14 8Z" fill="${hsl(hue, 20, 80)}"/>
    </g>`;
  },
  slime(id, hue, g) {
    return `<g class="breathe">
      <path d="M40 168 q-12-70 60-96 q72 26 60 96 q-30 12 -60 12 q-30 0 -60-12Z" fill="url(#${id}b)" opacity=".92"/>
      <path d="M52 166 q-6-52 48-74 q54 22 48 74" fill="url(#${id}d)" opacity=".6"/>
      <circle cx="100" cy="124" r="22" fill="url(#${id}g)" opacity=".5"/>
      <circle cx="100" cy="124" r="12" fill="${g}" opacity=".85" class="eye"/>
      ${eye(74, 106, 6, g)}${eye(128, 108, 7, g)}
      <path d="M60 170 q4 14 -4 18 M140 170 q-2 16 6 18 M100 178 q0 12 -6 16" stroke="${hsl(hue, 36, 22)}" stroke-width="7" fill="none" opacity=".8"/>
    </g>`;
  },
  rogue(id, hue, g) {
    return `<g class="breathe">
      <path d="M64 184 q-10-70 10-104 q10-20 26-24 q16 4 26 24 q20 34 10 104 q-18 8 -36 8 q-18 0 -36-8Z" fill="url(#${id}b)"/>
      <path d="M72 74 q28-18 56 0 q-6-26 -28-30 q-22 4 -28 30Z" fill="url(#${id}d)"/>
      <path d="M76 80 q24 12 48 0 q-2 26 -24 30 q-22-4 -24-30Z" fill="${hsl(hue, 30, 4)}"/>
      ${eye(88, 88, 4.5, g)}${eye(112, 88, 4.5, g)}
      <path d="M142 108 l26-38 6 6 -22 40Z" fill="${hsl(hue, 8, 70)}" filter="url(#${id}f)"/>
      <path d="M58 110 q-16 20 -8 42" stroke="${hsl(hue, 26, 18)}" stroke-width="10" fill="none"/>
    </g>`;
  },
  plant(id, hue, g) {
    let spikes = '';
    for (let i = 0; i < 9; i++) {
      const a = -90 + (i - 4) * 24, r = 62;
      const x = 100 + Math.cos((a * Math.PI) / 180) * r, y = 118 + Math.sin((a * Math.PI) / 180) * r;
      spikes += `<path d="M${100 + (x - 100) * 0.55} ${118 + (y - 118) * 0.55} L${x} ${y} L${100 + (x - 100) * 0.62 + 8} ${118 + (y - 118) * 0.62}Z" fill="${hsl(hue, 45, 30)}"/>`;
    }
    return `<g class="breathe">${spikes}
      <path d="M56 178 q-14-64 44-86 q58 22 44 86 q-22 10 -44 10 q-22 0 -44-10Z" fill="url(#${id}b)"/>
      <path d="M100 96 q30 14 34 52" stroke="${hsl(hue, 40, 18)}" stroke-width="6" fill="none" opacity=".7"/>
      <path d="M78 128 q22-12 44 0 q-8 18 -22 18 q-14 0 -22-18Z" fill="${hsl(hue, 30, 6)}"/>
      ${eye(100, 132, 7, g)}
    </g>`;
  },
  cultist(id, hue, g) {
    return `<g class="breathe">
      <path d="M60 188 q-8-78 14-112 q12-18 26-22 q14 4 26 22 q22 34 14 112 q-20 6 -40 6 q-20 0 -40-6Z" fill="url(#${id}b)"/>
      <path d="M74 70 q26-16 52 0 q-4-24 -26-28 q-22 4 -26 28Z" fill="url(#${id}d)"/>
      <ellipse cx="100" cy="84" rx="22" ry="18" fill="${hsl(hue, 30, 4)}"/>
      ${eye(91, 84, 4, g)}${eye(109, 84, 4, g)}
      <path d="M48 128 q14-24 30-20 M152 128 q-14-24 -30-20" stroke="${hsl(hue, 32, 20)}" stroke-width="12" fill="none"/>
      <g class="hover-float"><path d="M100 30 l10 14 -10 14 -10-14Z" fill="${g}" filter="url(#${id}f)" opacity=".9"/></g>
    </g>`;
  },
  golem(id, hue, g) {
    return `<g class="breathe">
      <path d="M42 190 l8-38 q-18-16 -12-44 q8-40 62-44 q54 4 62 44 q6 28 -12 44 l8 38 -30 0 -6-26 q-22 6 -44 0 l-6 26Z" fill="url(#${id}b)"/>
      <path d="M64 96 l20 10 -14 16Z M138 96 l-20 10 14 16Z" fill="url(#${id}d)"/>
      <path d="M70 140 q30 12 60 0 M84 70 l10 22 M118 68 l-6 24" stroke="${g}" stroke-width="3.5" fill="none" opacity=".7" class="eye"/>
      ${eye(84, 88, 6, g)}${eye(118, 88, 6, g)}
      <path d="M30 150 q10-30 26-32 M170 150 q-10-30 -26-32" stroke="${hsl(hue, 26, 16)}" stroke-width="16" fill="none"/>
    </g>`;
  },
  treeboss(id, hue, g) {
    return `<g class="breathe">
      <path d="M52 192 q-6-30 10-44 q-30-10 -34-44 q30 8 44 0 q-24-22 -16-56 q26 16 44 12 q18 4 44-12 q8 34 -16 56 q14 8 44 0 q-4 34 -34 44 q16 14 10 44 q-24 8 -48 8 q-24 0 -48-8Z" fill="url(#${id}b)"/>
      <path d="M78 120 q22-14 44 0 q-4 34 -22 40 q-18-6 -22-40Z" fill="${hsl(hue, 30, 5)}"/>
      <circle cx="100" cy="138" r="16" fill="url(#${id}g)" opacity=".8" class="eye"/>
      ${eye(88, 108, 5, g)}${eye(112, 108, 5, g)}
      <path d="M60 190 q-2-18 8-28 M140 190 q2-18 -8-28" stroke="${hsl(hue, 32, 14)}" stroke-width="9" fill="none"/>
    </g>`;
  },
  zombie(id, hue, g) {
    return `<g class="breathe">
      <path d="M62 190 q-16-60 6-96 q-14-2 -10-16 q12-24 34-26 q30 2 40 30 q16 40 4 108 q-18 6 -37 6 q-19 0 -37-6Z" fill="url(#${id}b)"/>
      <path d="M70 62 q26-18 50 4 q-4-28 -26-30 q-20 2 -24 26Z" fill="url(#${id}d)"/>
      ${eye(86, 74, 5, g)}${eye(112, 78, 4, g)}
      <path d="M84 96 q14 8 30 2" stroke="${hsl(hue, 22, 8)}" stroke-width="4" fill="none"/>
      <path d="M58 116 q-18 26 -10 54 M144 112 q16 28 8 56" stroke="${hsl(hue, 28, 18)}" stroke-width="11" fill="none"/>
      <path d="M92 130 l16 4 M88 148 l20 4" stroke="${hsl(hue, 30, 26)}" stroke-width="3" opacity=".8"/>
    </g>`;
  },
  serpent(id, hue, g) {
    return `<g class="breathe">
      <path d="M36 178 q-16-30 12-42 q30-12 58-2 q24 8 22-14 q-2-20 -28-18 q-32 2 -40-20 q-6-18 14-30 q26-14 56 0 l-8 18 q-20-8 -34-2 q-8 4 -2 10 q6 8 26 8 q40 0 44 34 q4 38 -36 42 q-30 4 -52 0 q-20-4 -18 8 q0 8 12 10 l-6 16 q-18-4 -20-18Z" fill="url(#${id}b)"/>
      <path d="M120 30 l24-14 4 18 -14 10Z" fill="url(#${id}d)"/>
      ${eye(138, 32, 5, g)}
      <path d="M60 128 l8-12 8 12 M92 124 l8-12 8 12" fill="none" stroke="${hsl(hue, 40, 34)}" stroke-width="4"/>
    </g>`;
  },
  crawler(id, hue, g) {
    let legs = '';
    for (let i = 0; i < 3; i++) {
      const x = 56 + i * 40;
      legs += `<path d="M${x} 148 q-18 14 -22 40 M${x + 16} 148 q18 14 22 40" stroke="${hsl(hue, 30, 20)}" stroke-width="7" fill="none"/>`;
    }
    return `<g class="breathe">${legs}
      <path d="M34 138 q-8-42 66-46 q74 4 66 46 q-24 24 -66 24 q-42 0 -66-24Z" fill="url(#${id}b)"/>
      <path d="M52 116 q48-22 96 0" stroke="url(#${id}d)" stroke-width="14" fill="none"/>
      ${eye(78, 118, 5, g)}${eye(100, 112, 6.5, g)}${eye(122, 118, 5, g)}
      <path d="M62 148 l-18 18 M138 148 l18 18" stroke="${hsl(hue, 36, 30)}" stroke-width="6"/>
    </g>`;
  },
  crab(id, hue, g) {
    return `<g class="breathe">
      <path d="M48 160 q-10-56 52-62 q62 6 52 62 q-24 18 -52 18 q-28 0 -52-18Z" fill="url(#${id}b)"/>
      <path d="M60 122 q40-24 80 0" stroke="url(#${id}d)" stroke-width="12" fill="none"/>
      <path d="M40 132 q-26-8 -28-36 q20-4 32 10 l8 12 M160 132 q26-8 28-36 q-20-4 -32 10 l-8 12" fill="url(#${id}b)"/>
      <path d="M22 98 l-10-16 14 2 6 12Z M178 98 l10-16 -14 2 -6 12Z" fill="${hsl(hue, 40, 34)}"/>
      ${eye(86, 112, 5.5, g)}${eye(114, 112, 5.5, g)}
      <path d="M76 152 q24 10 48 0" stroke="${hsl(hue, 30, 8)}" stroke-width="4" fill="none"/>
    </g>`;
  },
  maw(id, hue, g) {
    let teeth = '';
    for (let i = 0; i < 6; i++) teeth += `<path d="M${56 + i * 18} 118 l7 16 7-16Z" fill="${hsl(hue, 12, 85)}"/>`;
    for (let i = 0; i < 5; i++) teeth += `<path d="M${66 + i * 18} 156 l7-14 7 14Z" fill="${hsl(hue, 12, 80)}"/>`;
    return `<g class="breathe">
      <path d="M40 120 q-8-58 60-62 q70 4 62 62 q4 10 -6 12 q10 30 -18 44 q-38 18 -76 0 q-28-14 -18-44 q-10-2 -4-12Z" fill="url(#${id}b)"/>
      <path d="M52 118 q48 14 96 0 q2 26 -14 36 q-34 14 -68 0 q-16-10 -14-36Z" fill="${hsl(hue, 45, 5)}"/>
      ${teeth}
      ${eye(76, 90, 6, g)}${eye(126, 90, 6, g)}
      <g class="hover-float"><path d="M100 58 q-4-26 18-30" stroke="${hsl(hue, 30, 26)}" stroke-width="4" fill="none"/><circle cx="121" cy="26" r="7" fill="${g}" filter="url(#${id}f)"/></g>
    </g>`;
  },
  knight(id, hue, g) {
    return `<g class="breathe">
      <path d="M62 190 q-8-64 6-96 q-12-26 12-42 q10-8 20-8 q10 0 20 8 q24 16 12 42 q14 32 6 96 q-19 6 -38 6 q-19 0 -38-6Z" fill="url(#${id}b)"/>
      <path d="M78 58 q22-14 44 0 l-4 22 q-18 10 -36 0Z" fill="url(#${id}d)"/>
      <path d="M82 74 q18 8 36 0" stroke="${g}" stroke-width="4" fill="none" class="eye"/>
      <path d="M100 22 q16 6 14 24 l-28 0 q-2-18 14-24Z" fill="${hsl(hue, 36, 28)}"/>
      <path d="M148 60 l6 96 -12 4 -6-98Z" fill="${hsl(hue, 10, 72)}" filter="url(#${id}f)"/>
      <path d="M136 60 l30 0 -15 -14Z" fill="${hsl(hue, 16, 50)}"/>
      <path d="M54 112 q-14 18 -8 44" stroke="${hsl(hue, 26, 18)}" stroke-width="13" fill="none"/>
    </g>`;
  },
  siren(id, hue, g) {
    return `<g class="breathe">
      <path d="M84 190 q-30-24 -18-64 q8-28 24-40 q-10-16 2-30 q8-8 16-8 q20 8 14 32 q22 16 26 48 q4 36 -30 62 q-16 6 -34 0Z" fill="url(#${id}b)"/>
      <path d="M96 50 q-26-4 -34 22 q-10 30 6 44 q-14-40 28-66Z" fill="url(#${id}d)" opacity=".9"/>
      <path d="M120 52 q28 0 34 30 q6 28 -10 42 q10-44 -24-72Z" fill="url(#${id}d)" opacity=".9"/>
      ${eye(96, 66, 4.5, g)}${eye(114, 66, 4.5, g)}
      <path d="M92 84 q10 6 20 0" stroke="${g}" stroke-width="2.5" fill="none" opacity=".8"/>
      <path d="M66 132 q-22 8 -28 30 M136 128 q22 10 26 32" stroke="${hsl(hue, 30, 24)}" stroke-width="9" fill="none"/>
    </g>`;
  },
  leviathan(id, hue, g) {
    let teeth = '';
    for (let i = 0; i < 8; i++) teeth += `<path d="M${34 + i * 17} 108 l8 22 8-22Z" fill="${hsl(hue, 14, 88)}"/>`;
    for (let i = 0; i < 7; i++) teeth += `<path d="M${44 + i * 17} 168 l8-20 8 20Z" fill="${hsl(hue, 14, 82)}"/>`;
    return `<g class="breathe">
      <path d="M22 108 q-10-72 78-76 q88 4 78 76 l8 10 -12 8 q12 38 -22 54 q-52 26 -104 0 q-34-16 -22-54 l-12-8Z" fill="url(#${id}b)"/>
      <path d="M34 106 q66 18 132 0 q4 34 -18 46 q-48 20 -96 0 q-22-12 -18-46Z" fill="${hsl(hue, 50, 4)}"/>
      ${teeth}
      ${eye(62, 74, 8, g)}${eye(138, 74, 8, g)}${eye(100, 56, 5, g)}
      <path d="M10 130 q-8 24 8 40 M190 130 q8 24 -8 40" stroke="${hsl(hue, 34, 20)}" stroke-width="10" fill="none"/>
      <path d="M56 34 l10-22 12 18 M122 30 l12-20 10 20" fill="none" stroke="${hsl(hue, 30, 26)}" stroke-width="7"/>
    </g>`;
  },
  shade(id, hue, g) {
    return `<g class="breathe">
      <path d="M58 186 q-4-16 8-22 q-16-60 8-92 q10-16 26-20 q16 4 26 20 q24 32 8 92 q12 6 8 22 q-10-8 -16 2 q-8-10 -14 2 q-6-10 -12-2 q-6-12 -14-2 q-6-10 -18 0Z" fill="url(#${id}b)" opacity=".9"/>
      <path d="M74 66 q26-14 52 2 q0-26 -26-30 q-24 4 -26 28Z" fill="url(#${id}d)"/>
      ${eye(88, 76, 5, g)}${eye(114, 78, 5, g)}
      <path d="M56 108 q-22 16 -26 44 q14-4 22-16 M146 104 q22 18 24 46 q-14-4 -22-16" fill="url(#${id}d)" opacity=".85"/>
      <path d="M40 148 l-8 14 M164 148 l8 14" stroke="${hsl(hue, 34, 40)}" stroke-width="4"/>
    </g>`;
  },
  eye(id, hue, g) {
    let lashes = '';
    for (let i = 0; i < 7; i++) {
      const a = -150 + i * 20, r1 = 62, r2 = 84;
      const cx = 100, cy = 100;
      const x1 = cx + Math.cos((a * Math.PI) / 180) * r1, y1 = cy + Math.sin((a * Math.PI) / 180) * r1;
      const x2 = cx + Math.cos((a * Math.PI) / 180) * r2, y2 = cy + Math.sin((a * Math.PI) / 180) * r2;
      lashes += `<path d="M${x1} ${y1} Q${x2} ${y2} ${x2 + 6} ${y2 + 10}" stroke="${hsl(hue, 34, 24)}" stroke-width="6" fill="none"/>`;
    }
    return `<g class="breathe">${lashes}
      <circle cx="100" cy="100" r="58" fill="url(#${id}b)"/>
      <circle cx="100" cy="100" r="44" fill="${hsl(hue, 20, 88)}"/>
      <circle cx="100" cy="100" r="26" fill="${hsl(hue, 60, 30)}"/>
      <circle cx="100" cy="100" r="13" fill="#0a0a12" class="eye"/>
      <circle cx="100" cy="100" r="30" fill="url(#${id}g)" opacity=".4"/>
      <circle cx="90" cy="88" r="7" fill="#fff" opacity=".7"/>
      <path d="M78 156 q22 14 44 0 l-6 26 q-16 8 -32 0Z" fill="url(#${id}d)"/>
    </g>`;
  },
  sovereign(id, hue, g) {
    return `<g class="breathe">
      <g class="hover-float">
        <path d="M40 100 l-18 44 12 4Z M160 100 l18 44 -12 4Z M52 76 l-26 20 8 8Z M148 76 l26 20 -8 8Z" fill="url(#${id}d)" opacity=".85"/>
      </g>
      <path d="M64 192 q-12-84 10-124 q10-18 26-22 q16 4 26 22 q22 40 10 124 q-18 6 -36 6 q-18 0 -36-6Z" fill="url(#${id}b)"/>
      <path d="M76 62 q24-14 48 0 q-2-24 -24-28 q-22 4 -24 28Z" fill="url(#${id}d)"/>
      <path d="M74 40 l10-22 8 14 8-20 8 20 8-14 10 22Z" fill="${hsl(45, 70, 55)}" filter="url(#${id}f)"/>
      ${eye(90, 70, 4.5, g)}${eye(110, 70, 4.5, g)}
      <circle cx="100" cy="52" r="4" fill="${g}" class="eye"/>
      <path d="M146 78 l4 100 -10 2 -4-100Z" fill="${hsl(hue, 20, 60)}"/>
      <circle cx="148" cy="72" r="9" fill="${g}" filter="url(#${id}f)" class="eye"/>
      <path d="M56 110 q-16 22 -10 52" stroke="${hsl(hue, 26, 18)}" stroke-width="12" fill="none"/>
    </g>`;
  },
};

export function enemySvg(art) {
  const id = uid();
  const glow = hsl(art.hue, 90, 66);
  const body = leadGlass((BODIES[art.kind] || BODIES.slime)(id, art.hue, glow));
  return `<svg class="enemy-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    ${defs(id, art.hue, glow)}
    <ellipse cx="100" cy="192" rx="62" ry="9" fill="#000" opacity=".45"/>
    <ellipse class="innerfire" cx="100" cy="112" rx="64" ry="70" fill="url(#${id}g)" opacity=".14"/>
    ${body}
    <g class="cracks"></g>
  </svg>`;
}

// each aspect wears its own fire: the Duskblade cold-blue, the Ashwarden ember-amber
const HERO_LOOKS = [{ hue: 225, glow: '#7fd4ff' }, { hue: 26, glow: '#ffb15a' }];
export function heroSvg(aspect = 0) {
  const id = uid();
  const look = HERO_LOOKS[aspect] || HERO_LOOKS[0];
  const hue = look.hue, glow = look.glow;
  return `<svg class="hero-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    ${defs(id, hue, glow)}
    <ellipse cx="100" cy="192" rx="56" ry="9" fill="#000" opacity=".45"/>
    <ellipse class="innerfire" cx="100" cy="118" rx="58" ry="66" fill="url(#${id}g)" opacity=".12"/>
    ${leadGlass(`<g class="breathe">
      <path d="M66 188 q-10-70 8-104 q10-20 26-24 q16 4 26 24 q18 34 8 104 q-17 7 -34 7 q-17 0 -34-7Z" fill="url(#${id}b)"/>
      <path d="M74 72 q26-16 52 0 q-4-24 -26-28 q-22 4 -26 28Z" fill="url(#${id}d)"/>
      <path d="M78 78 q22 10 44 0 q-2 24 -22 28 q-20-4 -22-28Z" fill="#0b0e18"/>
      ${eye(90, 86, 4, glow)}${eye(110, 86, 4, glow)}
      <path d="M144 118 l34-52 7 5 -30 54Z" fill="#cfe6ff" filter="url(#${id}f)"/>
      <path d="M141 124 l14-8 4 8 -12 8Z" fill="${hsl(45, 60, 50)}"/>
      <path d="M56 112 q-14 20 -8 46" stroke="${hsl(hue, 26, 20)}" stroke-width="11" fill="none"/>
      <path d="M64 120 q36 18 72 0" stroke="${hsl(hue, 40, 30)}" stroke-width="5" fill="none" opacity=".6"/>
    </g>`)}
    <g class="cracks"></g>
  </svg>`;
}

// -------- card art: type motif + seeded variation + glyph
const CARD_GLYPHS = {
  strike: '⚔', defend: '⛨', eclipseSlash: '☾', twinFangs: '⑂', quickSlash: '≫', heavyBlow: '⬇',
  cleave: '⋔', venomStrike: '☠', lunge: '➹', guardedStrike: '⛊', brace: '⛨', sidestep: '↯',
  preparation: '♻', deflect: '⛉', leechBlade: '♆', tempest: '≋', uppercut: '⇑', flurry: '⁂',
  executioner: '✠', momentum: '⤴', bulwark: '☗', surge: '✦', toxicMist: '☁', cripple: '⛓',
  warCry: '♯', fortify: '⧉', bloodRite: '♥', empower: '⚔', agility: '❥', ironSkin: '⬡',
  regrowth: '❋', oblivionStrike: '✸', phantomBlades: '⚚', devour: '♅', annihilate: '✹',
  aegis: '⛨', offering: '♱', limitBreak: '⚡', catalyst: '⚗', ascension: '☽', bastion: '♜',
  frenzy: '※', virulence: '☣', wound: '✂', burn: '✹', hex: '♄',
  chisel: '◬', firstSpark: '✧', ashBite: '☄', smother: '☁', quakeblow: '⬲', resonantLance: '↟', tithe: '⚖', pyreheart: '♥',
  ashenChoir: '♬', flawlessForm: '❖', nightSight: '☾', novaflare: '✺', emberdance: '❂', shardstorm: '❉',
};
const hash = (s) => { let h = 9; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 387420489); return (h ^ (h >>> 9)) >>> 0; };

export function cardArtSvg(cardId, type) {
  const id = uid();
  const h = hash(cardId);
  const hue = { attack: 356, skill: 205, power: 268, status: 160, curse: 300 }[type] ?? 205;
  const hue2 = (hue + 30 + (h % 40)) % 360;
  const g = hsl(hue, 85, 66), g2 = hsl(hue2, 80, 60);
  const rot = h % 360;
  let motif = '';
  if (type === 'attack') {
    motif = `<path d="M30 120 Q75 40 150 28" stroke="${g}" stroke-width="7" fill="none" opacity=".9"/>
      <path d="M22 96 Q80 60 158 62" stroke="${g2}" stroke-width="4" fill="none" opacity=".65"/>
      <path d="M52 132 Q95 78 148 88" stroke="${g}" stroke-width="3" fill="none" opacity=".4"/>`;
  } else if (type === 'skill') {
    motif = `<path d="M90 22 q52 10 52 52 q0 44 -52 62 q-52-18 -52-62 q0-42 52-52Z" fill="none" stroke="${g}" stroke-width="6" opacity=".85"/>
      <path d="M90 42 q34 8 34 36 q0 30 -34 44" fill="none" stroke="${g2}" stroke-width="3.5" opacity=".6"/>`;
  } else if (type === 'power') {
    let rays = '';
    for (let i = 0; i < 8; i++) {
      const a = (i * 45 + rot) * (Math.PI / 180);
      rays += `<path d="M${90 + Math.cos(a) * 24} ${78 + Math.sin(a) * 24} L${90 + Math.cos(a) * 52} ${78 + Math.sin(a) * 52}" stroke="${i % 2 ? g2 : g}" stroke-width="${i % 2 ? 3 : 5}" opacity=".8"/>`;
    }
    motif = `${rays}<circle cx="90" cy="78" r="18" fill="none" stroke="${g}" stroke-width="5"/>`;
  } else {
    motif = `<circle cx="90" cy="78" r="40" fill="none" stroke="${g}" stroke-width="5" stroke-dasharray="16 10" opacity=".8"/>
      <path d="M62 106 L118 50" stroke="${g2}" stroke-width="5" opacity=".7"/>`;
  }
  const glyph = CARD_GLYPHS[cardId] || '✦';
  return `<svg viewBox="0 0 180 150" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="${id}v" cx="0.5" cy="0.42"><stop offset="0" stop-color="${hsl(hue, 45, 22)}"/><stop offset="1" stop-color="${hsl(hue, 50, 7)}"/></radialGradient>
      <filter id="${id}f" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <rect width="180" height="150" fill="url(#${id}v)"/>
    <g filter="url(#${id}f)" transform="rotate(${(h % 17) - 8} 90 75)">${motif}</g>
    <text x="90" y="97" text-anchor="middle" font-size="58" fill="${hsl(hue, 30, 88)}" opacity=".92" filter="url(#${id}f)" font-family="serif">${glyph}</text>
  </svg>`;
}

export function potionSvg(tone) {
  const id = uid();
  return `<svg viewBox="0 0 40 52" xmlns="http://www.w3.org/2000/svg">
    <defs><radialGradient id="${id}l"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset=".25" stop-color="${tone}"/><stop offset="1" stop-color="${tone}" stop-opacity=".75"/></radialGradient>
    <filter id="${id}f" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
    <path d="M16 6 h8 v9 q10 5 10 17 a14 14 0 1 1 -28 0 q0-12 10-17Z" fill="#1a2030" stroke="#48546e" stroke-width="2"/>
    <path d="M14 20 q-6 5 -6 12 a12 12 0 0 0 24 0 q0-7 -6-12 q-6-4 -12 0Z" fill="url(#${id}l)" filter="url(#${id}f)"/>
    <rect x="15" y="2" width="10" height="6" rx="2" fill="#6b5637"/>
    <circle cx="16" cy="28" r="2.4" fill="#fff" opacity=".8"/>
  </svg>`;
}

export function chestSvg(open = false) {
  const id = uid();
  return `<svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg">
    <defs><filter id="${id}f" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
    <ellipse cx="100" cy="148" rx="70" ry="8" fill="#000" opacity=".5"/>
    ${open ? `<rect x="40" y="30" width="120" height="26" rx="10" fill="#4a3521" transform="rotate(-24 40 56)"/><ellipse cx="100" cy="86" rx="52" ry="16" fill="#ffd97a" filter="url(#${id}f)"/>` : `<path d="M40 66 q0-28 60-28 q60 0 60 28 l0 10 -120 0Z" fill="#54401f"/>`}
    <rect x="40" y="74" width="120" height="66" rx="8" fill="#6b4d26"/>
    <rect x="40" y="74" width="120" height="12" fill="#4a3521"/>
    <rect x="90" y="70" width="20" height="30" rx="4" fill="#c9a84c"/>
    <circle cx="100" cy="88" r="5" fill="#332512"/>
    <path d="M48 74 v62 M152 74 v62" stroke="#4a3521" stroke-width="6"/>
  </svg>`;
}

export function campfireSvg() {
  const id = uid();
  return `<svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="${id}g"><stop offset="0" stop-color="#ffd97a"/><stop offset="1" stop-color="#ff7847" stop-opacity="0"/></radialGradient>
      <filter id="${id}f" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <ellipse cx="100" cy="148" rx="66" ry="8" fill="#000" opacity=".5"/>
    <circle cx="100" cy="108" r="52" fill="url(#${id}g)" opacity=".55" class="fire-glow"/>
    <path d="M56 138 l88 -14 M60 124 l84 16" stroke="#5a4025" stroke-width="10" stroke-linecap="round"/>
    <g class="flame" filter="url(#${id}f)">
      <path d="M100 60 q16 20 10 38 q14-6 12 8 q-2 22 -22 24 q-20-2 -22-24 q-2-14 12-8 q-6-18 10-38Z" fill="#ff9a4d"/>
      <path d="M100 84 q8 12 5 22 q-2 12 -5 12 q-3 0 -5-12 q-3-10 5-22Z" fill="#ffe08a"/>
    </g>
  </svg>`;
}

export function merchantSvg() {
  const id = uid();
  return `<svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg">
    ${defs(id, 40, '#ffd166')}
    <ellipse cx="100" cy="150" rx="64" ry="8" fill="#000" opacity=".5"/>
    <g class="breathe">
      <path d="M56 150 q-8-58 16-84 q12-14 28-16 q16 2 28 16 q24 26 16 84 q-22 6 -44 6 q-22 0 -44-6Z" fill="url(#${id}b)"/>
      <path d="M70 64 q30-18 60 0 l6-10 q-16-16 -36-16 q-20 0 -36 16Z" fill="url(#${id}d)"/>
      <ellipse cx="100" cy="76" rx="20" ry="16" fill="#120d06"/>
      ${eye(92, 76, 3.5, '#ffd166')}${eye(108, 76, 3.5, '#ffd166')}
      <path d="M100 96 q14 2 12 14" stroke="#3a2c14" stroke-width="4" fill="none"/>
      <circle cx="140" cy="120" r="14" fill="#c9a84c"/><text x="140" y="126" text-anchor="middle" font-size="16" fill="#3a2c14">¤</text>
    </g>
  </svg>`;
}

export function eventArtSvg(glyph, hue) {
  const id = uid();
  const g = hsl(hue, 80, 66);
  return `<svg viewBox="0 0 220 160" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="${id}v" cx="0.5" cy="0.4"><stop offset="0" stop-color="${hsl(hue, 40, 24)}"/><stop offset="1" stop-color="${hsl(hue, 45, 6)}"/></radialGradient>
      <filter id="${id}f" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <rect width="220" height="160" rx="10" fill="url(#${id}v)"/>
    <circle cx="110" cy="76" r="44" fill="none" stroke="${g}" stroke-width="2" opacity=".5"/>
    <circle cx="110" cy="76" r="56" fill="none" stroke="${g}" stroke-width="1" opacity=".25" stroke-dasharray="4 8"/>
    <text x="110" y="100" text-anchor="middle" font-size="64" fill="${g}" filter="url(#${id}f)" font-family="serif">${glyph}</text>
  </svg>`;
}

// ------- structural UI icons — drawn, not font glyphs, so they render identically everywhere
const ICONS = {
  sword: `<path d="M18.5 5 L10 13.5" stroke-width="3"/><path d="M6.8 11.6 L12.4 17.2" stroke-width="2.2"/><path d="M8.6 15.4 L4.8 19.2" stroke-width="2.6"/>`,
  skull: `<path d="M12 3.2 a6.8 6.8 0 0 1 6.8 6.8 c0 2.6-1.4 4.4-3 5.5 V18.5 h-7.6 V15.5 c-1.6-1.1-3-2.9-3-5.5 A6.8 6.8 0 0 1 12 3.2 Z" fill="currentColor" stroke="none"/><circle cx="9.4" cy="10" r="1.7" fill="rgba(0,0,0,.8)" stroke="none"/><circle cx="14.6" cy="10" r="1.7" fill="rgba(0,0,0,.8)" stroke="none"/><path d="M10.5 20.8 v-2 M13.5 20.8 v-2" stroke-width="1.8"/>`,
  crown: `<path d="M4.5 17.5 L5.2 8.5 L9 12 L12 6 L15 12 L18.8 8.5 L19.5 17.5 Z" fill="currentColor" stroke="none"/><path d="M4.5 20 h15" stroke-width="2.2"/>`,
  chest: `<rect x="4" y="6.5" width="16" height="13" rx="2.2" fill="none" stroke-width="2.2"/><path d="M4 12 h16" stroke-width="1.8"/><rect x="10.4" y="10.2" width="3.2" height="4.4" rx="1" fill="currentColor" stroke="none"/>`,
  flame: `<path d="M12 2.8 C9.4 7.4 6.8 9.8 6.8 13.6 a5.2 5.2 0 0 0 10.4 0 C17.2 9.8 14.6 7.4 12 2.8 Z" fill="currentColor" stroke="none"/><path d="M12 11.4 c-1.7 2.3-1.7 3.9 0 5.4 1.7-1.5 1.7-3.1 0-5.4 Z" fill="rgba(0,0,0,.5)" stroke="none"/>`,
  coin: `<circle cx="12" cy="12" r="5.6" fill="none" stroke-width="2.2"/><path d="M5.4 5.4 L8 8 M18.6 5.4 L16 8 M5.4 18.6 L8 16 M18.6 18.6 L16 16" stroke-width="2"/>`,
  shield: `<path d="M12 2.8 L19 5.8 v5.6 c0 4.6-3.1 7.6-7 9.8 -3.9-2.2-7-5.2-7-9.8 V5.8 Z" fill="none" stroke-width="2.3"/><path d="M12 6.4 v11" stroke-width="1.6" opacity=".55"/>`,
  cloud: `<path d="M7.2 16.5 a3.9 3.9 0 1 1 .7-7.7 A4.9 4.9 0 0 1 17.4 9.6 a3.4 3.4 0 0 1 -.6 6.9 Z" fill="currentColor" stroke="none"/>`,
  plus: `<path d="M12 5.2 v13.6 M5.2 12 h13.6" stroke-width="3.4"/>`,
  up: `<path d="M12 4 L19 12 h-4.1 v8 h-5.8 v-8 H5 Z" fill="currentColor" stroke="none"/>`,
  cards: `<rect x="4.4" y="5.6" width="9.4" height="13.4" rx="1.8" transform="rotate(-8 9 12.5)" fill="none" stroke-width="2"/><rect x="10.6" y="5" width="9.4" height="13.4" rx="1.8" transform="rotate(7 15.5 11.5)" fill="none" stroke-width="2"/>`,
  hammer: `<rect x="9.6" y="3.4" width="9.6" height="5.4" rx="1.2" transform="rotate(22 14.5 6)" fill="currentColor" stroke="none"/><path d="M11.6 10.2 L5.2 20" stroke-width="2.6"/>`,
  scissors: `<path d="M7.6 7.6 L17.5 17.8 M16.4 7.6 L6.5 17.8" stroke-width="2.2"/><circle cx="6" cy="19.2" r="2.2" fill="none" stroke-width="1.8"/><circle cx="18" cy="19.2" r="2.2" fill="none" stroke-width="1.8"/>`,
  question: `<path d="M8.6 8.6 a3.4 3.4 0 1 1 5 3 c-1.1 .7-1.6 1.4-1.6 2.8" fill="none" stroke-width="2.6"/><circle cx="12" cy="18.6" r="1.7" fill="currentColor" stroke="none"/>`,
  facet: `<path d="M12 3.4 L20 12 L12 20.6 L4 12 Z" fill="none" stroke-width="2.3"/><path d="M12 3.4 v17.2 M4 12 h16" stroke-width="1.2" opacity=".55"/>`,
  ember: `<path d="M12 3.4 C10 7 8.2 8.8 8.2 11.6 a3.8 3.8 0 0 0 7.6 0 C15.8 8.8 14 7 12 3.4 Z" fill="currentColor" stroke="none"/><circle cx="7" cy="18.4" r="1.4" fill="currentColor" stroke="none" opacity=".8"/><circle cx="12" cy="20" r="1.7" fill="currentColor" stroke="none"/><circle cx="17" cy="18.4" r="1.4" fill="currentColor" stroke="none" opacity=".8"/>`,
  lantern: `<path d="M9 6.2 h6 M8 6.2 L8 15.6 a4 3 0 0 0 8 0 V6.2" fill="none" stroke-width="2"/><path d="M12 8.4 c-1.5 2-1.5 3.4 0 4.7 1.5-1.3 1.5-2.7 0-4.7 Z" fill="currentColor" stroke="none"/><path d="M10.6 3.6 h2.8 v2.6 h-2.8 Z M10 19.8 h4" stroke-width="1.8"/>`,
  stagger: `<path d="M12 2.8 L13.8 8.6 L19.8 7 L15.6 11.6 L21 14.8 L14.6 14.9 L15.8 21 L11.9 16.2 L8 21 L9.2 14.9 L3 14.8 L8.4 11.6 L4.2 7 L10.2 8.6 Z" fill="currentColor" stroke="none"/>`,
  unlitLantern: `<path d="M9 6.2 h6 M8 6.2 L8 15.6 a4 3 0 0 0 8 0 V6.2" fill="none" stroke-width="2" opacity=".65"/><path d="M10.6 3.6 h2.8 v2.6 h-2.8 Z M10 19.8 h4" stroke-width="1.8" opacity=".65"/><path d="M10 10 L14 14 M14 10 L10 14" stroke-width="1.6" opacity=".8"/>`,
  monument: `<path d="M9.5 20 L10.2 6.5 L12 3.4 L13.8 6.5 L14.5 20 Z" fill="currentColor" stroke="none"/><path d="M6 20.6 h12" stroke-width="2.2"/><path d="M12 8.6 c-1.2 1.6-1.2 2.7 0 3.8 1.2-1.1 1.2-2.2 0-3.8 Z" fill="rgba(0,0,0,.55)" stroke="none"/>`,
  // --- status (st-*) ---
  'st-str': `<path d="M12 3 C9 8 7 10 7 13.6 a5 5 0 0 0 10 0 C17 10 15 8 12 3 Z" fill="currentColor" stroke="none"/><path d="M8.5 19.5 L15.5 15.5 M8.5 15.5 L15.5 19.5" stroke-width="2.4"/>`,
  'st-dex': `<path d="M12 3.4 L18.5 6.2 v5.2 c0 4.2-2.9 7-6.5 9 -3.6-2-6.5-4.8-6.5-9 V6.2 Z" fill="none" stroke-width="2.2"/><path d="M12 7.5 L14 11 L12 14.5 L10 11 Z" fill="currentColor" stroke="none"/>`,
  'st-vulnerable': `<path d="M12 3.4 L20 12 L12 20.6 L4 12 Z" fill="none" stroke-width="2.2"/><path d="M9 9 L15 15 M15 9 L9 15" stroke-width="1.8"/>`,
  'st-weak': `<path d="M12 4 v10 M12 20 L7.5 14.5 M12 20 L16.5 14.5" stroke-width="2.6"/>`,
  'st-frail': `<path d="M12 3.4 L20 12 L12 20.6 L4 12 Z" fill="none" stroke-width="2"/><path d="M12 3.4 L10 9 L14 13 L11 17 L12 20.6" fill="none" stroke-width="1.6"/>`,
  'st-poison': `<path d="M12 3.6 C9.5 8 7.6 10.4 7.6 13.4 a4.4 4.4 0 0 0 8.8 0 C16.4 10.4 14.5 8 12 3.6 Z" fill="currentColor" stroke="none"/><circle cx="8" cy="19.6" r="1.5" fill="currentColor" stroke="none"/><circle cx="13" cy="20.4" r="1.2" fill="currentColor" stroke="none" opacity=".8"/>`,
  'st-thorns': `<circle cx="12" cy="12" r="4.2" fill="none" stroke-width="2"/><path d="M12 7.8 V3.4 M12 16.2 V20.6 M7.8 12 H3.4 M16.2 12 H20.6 M9 9 L6 6 M15 15 L18 18 M15 9 L18 6 M9 15 L6 18" stroke-width="2"/>`,
  'st-ritual': `<path d="M15.5 3.8 a8.6 8.6 0 1 0 4.7 12 a7 7 0 1 1 -4.7 -12 Z" fill="currentColor" stroke="none"/>`,
  'st-metallicize': `<path d="M12 3.2 L19.4 7.5 v9 L12 20.8 L4.6 16.5 v-9 Z" fill="none" stroke-width="2.3"/><path d="M12 8 L15.5 10 v4 L12 16 L8.5 14 v-4 Z" fill="currentColor" stroke="none"/>`,
  'st-regen': `<path d="M12 4.2 C8 8.4 6.2 10.6 6.2 13.8 a5.8 5.8 0 0 0 11.6 0 C17.8 10.6 16 8.4 12 4.2 Z" fill="none" stroke-width="2.2"/><path d="M12 9 v6 M9 12 h6" stroke-width="2"/>`,
  'st-barricade': `<path d="M5 20 v-9 L12 4 l7 7 v9 h-4.6 v-5.4 h-4.8 V20 Z" fill="currentColor" stroke="none"/>`,
  'st-energized': `<path d="M13.4 3 L6 13.4 h4.4 L10 21 L18 10.6 h-4.4 Z" fill="currentColor" stroke="none"/>`,
  'st-venomous': `<path d="M7 5 q5 3 10 0 q-1 5 -3.4 7 L15 19 a3 3 0 1 1 -6 0 l1.4-7 Q8 10 7 5 Z" fill="currentColor" stroke="none"/><circle cx="12" cy="18" r="1.4" fill="rgba(0,0,0,.7)" stroke="none"/>`,
  'st-rampage': `<path d="M4 18 L10 12 L13 15 L20 7" fill="none" stroke-width="2.6"/><path d="M15.5 6.5 H20.5 V11.5" fill="none" stroke-width="2.4"/>`,
  'st-beacon': `<circle cx="12" cy="12" r="3.4" fill="currentColor" stroke="none"/><path d="M12 5.4 V2.8 M12 21.2 V18.6 M5.4 12 H2.8 M21.2 12 H18.6 M7.4 7.4 L5.6 5.6 M16.6 16.6 L18.4 18.4 M16.6 7.4 L18.4 5.6 M7.4 16.6 L5.6 18.4" stroke-width="2"/>`,
  'st-emberflow': `<path d="M12 4 C10 7.4 8.6 9.2 8.6 11.6 a3.4 3.4 0 0 0 6.8 0 C15.4 9.2 14 7.4 12 4 Z" fill="currentColor" stroke="none"/><path d="M7 17.5 q2.5 2 5 0 q2.5 -2 5 0 M7 20.5 q2.5 2 5 0 q2.5 -2 5 0" fill="none" stroke-width="1.7"/>`,
  'st-nightsight': `<path d="M16.8 4 a9 9 0 1 0 3.4 13 a7.4 7.4 0 1 1 -3.4 -13 Z" fill="currentColor" stroke="none"/><circle cx="15.6" cy="9" r="1.6" fill="currentColor" stroke="none"/>`,
  // --- lantern arts (art-*) ---
  'art-flare': `<circle cx="12" cy="12" r="3" fill="currentColor" stroke="none"/><path d="M12 6.6 L13.4 9.4 M12 6.6 L10.6 9.4 M12 6.6 V2.8 M17.4 12 h3.8 M12 17.4 v3.8 M2.8 12 h3.8 M15.8 8.2 L18.4 5.6 M15.8 15.8 L18.4 18.4 M8.2 15.8 L5.6 18.4 M8.2 8.2 L5.6 5.6" stroke-width="2"/>`,
  'art-mendglass': `<path d="M12 3.4 L19 12 L12 20.6 L5 12 Z" fill="none" stroke-width="2"/><path d="M12 8.4 v7.2 M8.4 12 h7.2" stroke-width="2.2"/>`,
  'art-beacon': `<path d="M9 6 h6 M8 6 v9.4 a4 3.2 0 0 0 8 0 V6" fill="none" stroke-width="2"/><path d="M12 8.2 c-1.6 2.1-1.6 3.6 0 5 1.6-1.4 1.6-2.9 0-5 Z" fill="currentColor" stroke="none"/><path d="M4.5 10 L2.5 9 M19.5 10 L21.5 9 M10 20 h4" stroke-width="1.8"/>`,
  'art-emberveil': `<path d="M12 3.2 L19 6 v5.6 c0 4.6-3.1 7.6-7 9.8 -3.9-2.2-7-5.2-7-9.8 V6 Z" fill="none" stroke-width="2.2"/><path d="M12 8 c-1.8 2.4-1.8 4 0 5.6 1.8-1.6 1.8-3.2 0-5.6 Z" fill="currentColor" stroke="none"/>`,
  'art-stoke': `<path d="M12 3.4 C9.2 8 7.4 10.2 7.4 13.4 a4.6 4.6 0 0 0 9.2 0 C16.6 10.2 14.8 8 12 3.4 Z" fill="currentColor" stroke="none"/><path d="M6 20.6 h12" stroke-width="2.4"/><path d="M9 17.8 L7 20.6 M15 17.8 L17 20.6" stroke-width="1.8"/>`,
  'art-ashfall': `<path d="M7.4 13.5 a3.9 3.9 0 1 1 .7-7.7 A4.9 4.9 0 0 1 17.6 6.6 a3.4 3.4 0 0 1 -.6 6.9 Z" fill="currentColor" stroke="none"/><path d="M8 16.5 v1.6 M12 16.5 v2.6 M16 16.5 v1.6 M10 20.2 v1 M14 20.2 v1" stroke-width="1.9"/>`,
  // --- boons (boon-*) ---
  'boon-fullPurse': `<path d="M8 7 q4 -4 8 0 l2.4 8.6 a3 3 0 0 1 -2.9 3.8 H8.5 a3 3 0 0 1 -2.9 -3.8 Z" fill="currentColor" stroke="none"/><path d="M9.5 7 h5" stroke-width="2"/><circle cx="12" cy="13.5" r="2.2" fill="rgba(0,0,0,.6)" stroke="none"/>`,
  'boon-temperedGlass': `<path d="M12 3.4 L20 12 L12 20.6 L4 12 Z" fill="none" stroke-width="2.4"/><path d="M12 7 L16.5 12 L12 17 L7.5 12 Z" fill="currentColor" stroke="none"/>`,
  'boon-keenEye': `<path d="M2.8 12 q4.6 -6.4 9.2 -6.4 q4.6 0 9.2 6.4 q-4.6 6.4 -9.2 6.4 q-4.6 0 -9.2 -6.4 Z" fill="none" stroke-width="2"/><circle cx="12" cy="12" r="2.8" fill="currentColor" stroke="none"/>`,
  'boon-warmHearth': `<path d="M5 20 v-8.5 L12 5 l7 6.5 V20 h-5 v-5 h-4 v5 Z" fill="none" stroke-width="2.2"/><path d="M12 11.4 c-1.2 1.6-1.2 2.8 0 4 1.2-1.2 1.2-2.4 0-4 Z" fill="currentColor" stroke="none"/>`,
  'boon-emberFlask': `<path d="M10 3.4 h4 M11 3.4 v4.2 L6.8 15 a3.6 3.6 0 0 0 3.2 5.4 h4 A3.6 3.6 0 0 0 17.2 15 L13 7.6 V3.4" fill="none" stroke-width="2"/><path d="M12 11 c-1.4 1.8-1.4 3.2 0 4.6 1.4-1.4 1.4-2.8 0-4.6 Z" fill="currentColor" stroke="none"/>`,
  'boon-twinPhials': `<path d="M7.6 3.8 h3 M9.1 3.8 v3.4 L6.4 13 a2.8 2.8 0 0 0 2.5 4.1 h0.4 A2.8 2.8 0 0 0 11.8 13 L9.1 7.2" fill="none" stroke-width="1.8"/><path d="M13.4 6.8 h3 M14.9 6.8 v3.4 L12.2 16 a2.8 2.8 0 0 0 2.5 4.1 h0.4 A2.8 2.8 0 0 0 17.6 16 L14.9 10.2" fill="none" stroke-width="1.8"/>`,
  'boon-pilgrimsCache': `<rect x="4.5" y="8" width="15" height="11" rx="2" fill="none" stroke-width="2.2"/><path d="M4.5 12.5 h15 M9 8 q3 -5 6 0" fill="none" stroke-width="1.8"/><rect x="10.6" y="11" width="2.8" height="3.6" rx="0.8" fill="currentColor" stroke="none"/>`,
  'boon-venomPouch': `<path d="M7.5 6.5 q4.5 -3.4 9 0 l1.6 9.1 a3 3 0 0 1 -3 3.5 H8.9 a3 3 0 0 1 -3 -3.5 Z" fill="none" stroke-width="2.1"/><path d="M12 9.6 c-1.5 2-1.5 3.4 0 4.8 1.5-1.4 1.5-2.8 0-4.8 Z" fill="currentColor" stroke="none"/><circle cx="12" cy="17.4" r="1" fill="currentColor" stroke="none"/>`,
  // --- omens (omen-*) ---
  'omen-ashfall': `<path d="M7.2 12.5 a3.9 3.9 0 1 1 .7-7.7 A4.9 4.9 0 0 1 17.4 5.6 a3.4 3.4 0 0 1 -.6 6.9 Z" fill="currentColor" stroke="none"/><circle cx="8" cy="16.4" r="1.1" fill="currentColor" stroke="none"/><circle cx="12" cy="18.8" r="1.3" fill="currentColor" stroke="none"/><circle cx="16" cy="16.4" r="1.1" fill="currentColor" stroke="none"/>`,
  'omen-heavyAir': `<path d="M4 6.5 h16 M6 10.5 h12 M8 14.5 h8" stroke-width="2.2"/><path d="M12 21 L8.5 16.8 h7 Z" fill="currentColor" stroke="none"/>`,
  'omen-thinGlass': `<path d="M12 3.4 L20 12 L12 20.6 L4 12 Z" fill="none" stroke-width="1.4"/><path d="M12 3.4 L11 8.5 L13.5 11 L10.5 14 L12 20.6 M4 12 L8.5 11 M20 12 L15 13.5" fill="none" stroke-width="1.2"/>`,
  'omen-hungryDark': `<path d="M17 3.6 a9.4 9.4 0 1 0 3.6 14 a7.6 7.6 0 1 1 -3.6 -14 Z" fill="currentColor" stroke="none"/><circle cx="14.8" cy="8.4" r="1" fill="currentColor" stroke="none"/><circle cx="17.8" cy="12.8" r="0.8" fill="currentColor" stroke="none"/>`,
  'omen-emberWind': `<path d="M3.5 9 q6 -2.4 10 0 q3 1.8 7 0.4" fill="none" stroke-width="2"/><path d="M3.5 14 q6 -2.4 10 0 q3 1.8 7 0.4" fill="none" stroke-width="2" opacity=".7"/><circle cx="17.5" cy="6.4" r="1.3" fill="currentColor" stroke="none"/><circle cx="6.5" cy="17.6" r="1.1" fill="currentColor" stroke="none"/>`,
  'omen-longNight': `<path d="M12 2.8 L13.7 8 L19 8.1 L14.8 11.3 L16.3 16.5 L12 13.4 L7.7 16.5 L9.2 11.3 L5 8.1 L10.3 8 Z" fill="currentColor" stroke="none"/><path d="M5 20.6 h14" stroke-width="1.8" opacity=".7"/>`,
  'omen-waningMoon': `<circle cx="12" cy="12" r="8" fill="none" stroke-width="2"/><path d="M12 4 a8 8 0 0 1 0 16 a11 11 0 0 0 0 -16 Z" fill="currentColor" stroke="none"/>`,
};
export const hasIcon = (name) => !!ICONS[name];
const iconBody = (name) => `<g fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ''}</g>`;
export function iconSvg(name, size = 18) {
  return `<svg class="gicon" width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true">${iconBody(name)}</svg>`;
}
// for embedding inside an existing <svg> (the map): centered at 0,0 at the given pixel size
export function iconInline(name, size = 18) {
  const s = size / 24;
  return `<g transform="translate(${-size / 2},${-size / 2}) scale(${s})">${iconBody(name)}</g>`;
}
