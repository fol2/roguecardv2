#!/usr/bin/env node
// gen-batch.mjs — generate all planned raster assets via tools/genasset.sh
// Usage: node tools/gen-batch.mjs [--only heroes|enemies|cards|props|potions|events|title|icons]
// Skips files that already exist. Logs to scratch/gen-batch.log
import { spawnSync } from 'node:child_process';
import { existsSync, appendFileSync, mkdirSync, openSync, closeSync, unlinkSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { CARDS, POTIONS, EVENTS } from '../src/data.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const log = join(root, 'scratch/gen-batch.log');
const lock = join(root, 'scratch/gen-batch.lock');
mkdirSync(join(root, 'scratch'), { recursive: true });
try {
  const fd = openSync(lock, 'wx');
  closeSync(fd);
} catch {
  console.error('gen-batch already running (scratch/gen-batch.lock)'); process.exit(1);
}
process.on('exit', () => { try { unlinkSync(lock); } catch {} });
const only = process.argv.includes('--only') ? process.argv[process.argv.indexOf('--only') + 1] : null;

const KIND = {
  wisp: 'a floating glass spirit wisp',
  beast: 'a prowling wolf-like glass beast, four-legged, hunched shoulders',
  slime: 'a dripping glass slime blob',
  rogue: 'a hooded glass assassin with dagger',
  plant: 'a thorny glass vine creature',
  cultist: 'a robed glass cultist with lantern',
  golem: 'a blocky armored glass golem',
  treeboss: 'an ancient gnarled glass tree entity',
  zombie: 'a shambling drowned glass corpse',
  serpent: 'a coiled glass eel serpent',
  crawler: 'an insectoid glass lurker',
  crab: 'an armored glass crab',
  maw: 'a toothy abyssal glass maw',
  knight: 'an armored glass knight with sword',
  siren: 'a winged glass siren',
  leviathan: 'a massive sea-glass leviathan head and coils',
  shade: 'a shadowy glass wraith',
  eye: 'a floating giant glass eye orb',
  sovereign: 'a crowned eternal glass sovereign on a throne of lead lines',
};

const heroes = [
  ['ashwarden', 'a smoke-wreathed glass warden in ember-orange cloak, warm inner glow, ash motes'],
];
const enemies = Object.entries({
  sporeling: 'a tiny floating spore glass orb creature',
  duskfang: 'a prowling wolf-like dusk beast, ember-orange glass, glowing amber eyes, jagged glass fur',
  gloomslime: 'a dripping green-black glass slime',
  waylayer: 'a hooded glass highway robber with blade',
  thornling: 'a small thorny glass plant creature',
  ashAcolyte: 'a robed ash cultist in glass panels',
  gravewarden: 'a massive grave glass golem elite',
  alphaFang: 'a larger alpha wolf glass beast elite, crimson glass',
  rootheart: 'the Rootheart boss, ancient glass tree with glowing heart',
  drownedOne: 'a drowned shambling glass zombie',
  voltEel: 'a crackling electric glass eel',
  mirelurker: 'a venomous glass swamp crawler',
  tidecaller: 'a tidal glass cultist with water motifs',
  shellback: 'a heavy armored glass crab',
  deepmaw: 'a deep-sea toothy glass maw',
  abyssalKnight: 'an abyssal void glass knight elite',
  siren: 'a haunting winged glass siren elite',
  leviathan: 'Leviathan boss, colossal sea-glass jaws',
  voidWisp: 'a void-purple glass wisp',
  obsidianGolem: 'an obsidian glass golem',
  starCultist: 'a star-cult glass acolyte',
  shade: 'a shadow glass wraith',
  chaosHound: 'a chaos-touched glass hound',
  watcherEye: 'a giant floating glass watcher eye',
  voidColossus: 'a voidforged glass colossus elite',
  heraldOfEnd: 'the Herald of the End elite, apocalyptic glass figure',
  sovereign: 'The Eternal Sovereign final boss, crowned glass monarch',
}).map(([id, base]) => {
  // enrich with kind if in KIND via data - use base prompt only for clarity
  return [id, base];
});

const TYPE = {
  attack: 'crimson attack emblem, sword slash motif',
  skill: 'azure skill emblem, shield or ward motif',
  power: 'violet power emblem, persistent flame motif',
  status: 'jade status emblem, leaf or growth motif',
  curse: 'dark curse emblem, hex sigil motif',
};

const cardIds = Object.keys(CARDS);

const props = [
  ['campfire', 'a rest-site glass campfire with warm embers'],
  ['chest', 'a closed treasure chest of stained glass and gold trim'],
  ['chest-open', 'an open treasure chest of stained glass spilling light'],
  ['merchant', 'a mysterious glass merchant stall with lantern'],
];
const POTION_PROMPTS = {
  healing: 'a rose-glass healing phial',
  strength: 'an orange-glass fervor phial',
  swift: 'a pale-blue inkdraught phial',
  block: 'a silver-glass ward phial',
  fire: 'a red-glass fire phial',
  venom: 'a green-glass smolder phial',
  energy: 'an amber-glass ember phial',
};
const EVENT_PROMPTS = {
  forgottenShrine: 'a moss-eaten glass shrine in darkness',
  woundedKnight: 'a wounded knight slumped against a shattered glass pillar',
  voidChest: 'a black iron humming chest of stained glass in the gloom',
  emberFountain: 'a fountain of liquid ember light in a cracked glass basin',
  forge: 'a forgotten star-metal anvil and glass forge with hanging hammers',
  gambler: 'a grinning bone gambler rattling knuckle-bones, glass panels',
  mirror: 'a tall silvered mirror standing in rubble, stained glass',
  library: 'a drowned library of waterlogged glass grimoire shelves',
  fleshTrader: 'a sinister flesh trader in a merchant coat, glass figure',
  cursedIdol: 'a jade cursed idol on a plinth of skulls, stained glass',
  ruinedCamp: 'a ruined camp with smoldering glass campfire and torn bedrolls',
};

const jobs = [];
function add(cat, id, prompt) {
  if (only && only !== cat) return;
  const out = join(root, `src/assets/${cat}/${id}.png`);
  if (existsSync(out)) return;
  jobs.push({ cat, id, prompt });
}

for (const [id, p] of heroes) add('heroes', id, p);
for (const [id, p] of enemies) add('enemies', id, p);
add('title', 'banner', 'wide hero banner of a hooded glass knight before a dark spire, cinematic 16:9');
for (const id of cardIds) add('cards', id, `card art for "${CARDS[id].name}", ${TYPE[CARDS[id].type] || TYPE.attack}`);
for (const [id, p] of props) add('props', id, p);
for (const id of Object.keys(POTIONS)) add('potions', id, POTION_PROMPTS[id] || `a glass phial, ${POTIONS[id].name}`);
for (const id of Object.keys(EVENTS)) add('events', id, EVENT_PROMPTS[id] || `wide scene for ${EVENTS[id].name}`);

const run = (job) => {
  const msg = `[${new Date().toISOString()}] ${job.cat}/${job.id}\n`;
  process.stdout.write(msg);
  appendFileSync(log, msg);
  let ok = false;
  for (let attempt = 1; attempt <= 2 && !ok; attempt++) {
    const r = spawnSync('tools/genasset.sh', [job.cat, job.id, job.prompt], { cwd: root, stdio: 'inherit', shell: false });
    appendFileSync(log, `exit ${r.status}${attempt > 1 ? ` (retry ${attempt})` : ''}\n`);
    ok = r.status === 0;
    if (!ok && attempt === 1) appendFileSync(log, 'retrying after failure\n');
  }
  return ok;
};

console.log(`${jobs.length} assets to generate`);
let ok = 0;
for (const job of jobs) if (run(job)) ok++;
console.log(`done: ${ok}/${jobs.length}`);
