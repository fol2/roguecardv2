import assert from 'node:assert/strict';
import { createDrain, COMBAT_TERMINAL_EVENT_TYPES } from '../src/ui/drain.js';
import { createA11yLog } from '../src/ui/a11y-log.js';

globalThis.document = {
  body: {
    classList: {
      add() {},
      remove() {},
    },
  },
};

function makeSpy(name, impl = () => {}) {
  const calls = [];
  const spy = (...args) => {
    calls.push(args.slice());
    return impl(...args);
  };
  spy.calls = calls;
  return spy;
}

function createMockPresentation() {
  const methods = [
    'addCrack', 'artCast', 'banner', 'bumpPile', 'captureCardAnchor',
    'choreoAttack', 'choreoHit', 'choreoStagger', 'chromePulse', 'clearDrawRevealPlan',
    'clearPileVisualOverride', 'deleteDrawRevealPlan', 'enemyCenter',
    'floatText', 'flyCardBacks', 'flyTo', 'handFaceSize', 'handSeatCenter',
    'hasPileVisualOverride', 'heroCenter', 'holdPendingPileArrivals',
    'holdPileVisual', 'igniteVessel', 'layoutHand', 'peekCardAnchor',
    'pileCardByUid', 'readPileVisualOverride', 'releasePileVisual',
    'renderHud', 'replacePileVisualOverride', 'scheduleHandReveal',
    'semanticUiCheckpoint', 'setCardFlightAnchor', 'setDrawRevealPlan',
    'setPileVisualOverride', 'shatter', 'syncCombat', 'syncHand',
    'syncPileWidgets', 'syncWardMesh', 'takeCardAnchor',
  ];
  const obj = {};
  for (const method of methods) {
    obj[method] = makeSpy(method, () => {
      if (method === 'heroCenter') return { x: 400, y: 500 };
      if (method === 'enemyCenter') return { x: 800, y: 400 };
      return undefined;
    });
  }
  return Object.freeze(obj);
}

const mockElem = () => ({
  classList: {
    add: () => {},
    remove: () => {},
  },
  offsetWidth: 0,
  style: {},
  dataset: {},
  addEventListener: () => {},
  removeEventListener: () => {},
  textContent: '',
});

const presentation = createMockPresentation();

assert.deepEqual(COMBAT_TERMINAL_EVENT_TYPES, ['victory', 'defeat']);
assert.ok(Object.isFrozen(COMBAT_TERMINAL_EVENT_TYPES));

{
  assert.throws(
    () => createDrain({
      E: {}, contentViewFor: () => ({}), QUESTS: {},
      cardEl: () => {}, iconSvg: () => {}, assetUrl: () => {},
      drawBatchSchedule: () => {}, V: {}, sfx: {}, kick: () => {},
      meshDeath: () => {}, meshEnabled: () => {}, meshHandoff: () => {},
      meshRelease: () => {}, $: () => {}, $$: () => {}, S: { cb: { queue: [] }, ce: {} },
      el: () => {}, escHtml: () => {}, presentationBarrier: () => {},
      screenEl: () => {}, sleep: async () => {}, trace: { begin: () => ({ finish: () => {} }), enabled: false, emit: () => {} },
      REDUCED: false, combatantView: () => ({}), stageW: 1000, stageH: 800,
      stageRect: () => ({}), tr: () => '', presentation: {} ,
    }),
    TypeError,
    'unfrozen presentation throws',
  );
}

{
  assert.throws(
    () => createDrain({
      E: {}, contentViewFor: () => ({}), QUESTS: {},
      cardEl: 'not a function', iconSvg: () => {}, assetUrl: () => {},
      drawBatchSchedule: () => {}, V: {}, sfx: {}, kick: () => {},
      meshDeath: () => {}, meshEnabled: () => {}, meshHandoff: () => {},
      meshRelease: () => {}, $: () => {}, $$: () => {}, S: { cb: { queue: [] }, ce: {} },
      el: () => {}, escHtml: () => {}, presentationBarrier: () => {},
      screenEl: () => {}, sleep: async () => {}, trace: { begin: () => ({ finish: () => {} }), enabled: false, emit: () => {} },
      REDUCED: false, combatantView: () => ({}), stageW: 1000, stageH: 800,
      stageRect: () => ({}), tr: () => '', presentation,
    }),
    TypeError,
    'non-function cardEl throws',
  );
}

{
  assert.throws(
    () => createDrain({
      E: {}, QUESTS: {},
      cardEl: () => {}, iconSvg: () => {}, assetUrl: () => {},
      drawBatchSchedule: () => {}, V: {}, sfx: {}, kick: () => {},
      meshDeath: () => {}, meshEnabled: () => {}, meshHandoff: () => {},
      meshRelease: () => {}, $: () => {}, $$: () => {}, S: { cb: { queue: [] }, ce: {} },
      el: () => {}, escHtml: () => {}, presentationBarrier: () => {},
      screenEl: () => {}, sleep: async () => {}, trace: { begin: () => ({ finish: () => {} }), enabled: false, emit: () => {} },
      REDUCED: false, combatantView: () => ({}), stageW: 1000, stageH: 800,
      stageRect: () => ({}), tr: () => '', presentation,
    }),
    TypeError,
    'missing contentViewFor throws',
  );
}

const spyApi = (methods, impls = {}) => {
  const obj = {};
  for (const m of methods) obj[m] = makeSpy(m, impls[m] ?? (() => {}));
  return obj;
};

const mockV = spyApi(
  ['burst', 'ring', 'hitstop', 'shake', 'flash', 'motes', 'centerOf'],
  { centerOf: () => ({ x: 500, y: 500 }) },
);

const mockSfx = spyApi([
  'art', 'attack', 'bigDeath', 'block', 'blocked', 'buff', 'card', 'chip',
  'death', 'debuff', 'defeat', 'draw', 'ember', 'energy', 'heal', 'kindle',
  'poison', 'potion', 'shatter', 'stagger', 'turn', 'victory',
]);

const mockContentViewFor = () => ({
  relics: [],
  aspectSnapshot: {},
  statuses: { poison: { name: 'Poison', kind: 'debuff' } },
});

const mockS = {
  cb: {
    queue: [],
    enemies: [
      { idx: 0, hp: 50, maxHp: 100, intents: [], status: {} },
    ],
  },
  ce: {
    enemies: [{ facets: mockElem(), art: mockElem(), root: mockElem(), status: {} }],
    energy: mockElem(),
    endTurn: mockElem(),
    hand: mockElem(),
    hud: { hp: mockElem(), maxHp: mockElem() },
  },
  run: {
    hero: { hp: 30, maxHp: 60 },
  },
  screen: 'combat',
  busy: false,
};

const mockCardEl = () => null;
const mockEl = () => mockElem();
const mockTrace = {
  begin: () => ({ finish: () => {} }),
  enabled: false,
  read: () => ({ lastSeq: null }),
  emit: () => {},
};

// a11y is a plain injected dependency (not a drainHandlers key) — drain forwards
// each raw event so the offscreen aria-live announcer can phrase it.
const a11ySpy = { note: makeSpy('note'), drew: makeSpy('drew') };

const drainApi = createDrain({
  E: {},
  a11y: a11ySpy,
  contentViewFor: mockContentViewFor,
  QUESTS: {},
  cardEl: mockCardEl,
  iconSvg: () => null,
  assetUrl: () => '',
  drawBatchSchedule: () => 0,
  V: mockV,
  sfx: mockSfx,
  kick: () => {},
  meshDeath: () => {},
  meshEnabled: () => true,
  meshHandoff: () => {},
  meshRelease: () => {},
  $: () => null,
  $$: () => [],
  S: mockS,
  el: mockEl,
  escHtml: (s) => s,
  presentationBarrier: () => {},
  screenEl: () => null,
  sleep: async () => {},
  trace: mockTrace,
  REDUCED: true,
  combatantView: () => ({}),
  stageW: 1000,
  stageH: 800,
  stageRect: () => ({ left: 0, top: 0, width: 1000, height: 800 }),
  tr: (key) => key,
  presentation,
});

assert.ok(typeof drainApi.drain === 'function', 'drain is a function');
assert.ok(Object.isFrozen(drainApi), 'drainApi is frozen');

await (async () => {
  mockS.cb.queue.push({ t: 'turn', n: 1 });
  await drainApi.drain();
  assert.ok(presentation.syncCombat.calls.length > 0, 'turn handler (n=1) calls syncCombat');
  assert.ok(a11ySpy.note.calls.some((c) => c[0]?.t === 'turn'),
    'drain forwards each played event to the a11y announcer');

  presentation.banner.calls.length = 0;
  presentation.syncCombat.calls.length = 0;
  mockS.cb.queue.push({ t: 'turn', n: 2 });
  await drainApi.drain();
  assert.ok(presentation.banner.calls.length > 0, 'turn handler (n>1) calls banner');

  presentation.banner.calls.length = 0;
  presentation.syncCombat.calls.length = 0;
  mockS.cb.queue.push({ t: 'endTurn' });
  await drainApi.drain();
  assert.ok(presentation.banner.calls.length > 0, 'endTurn handler calls banner');

  presentation.syncCombat.calls.length = 0;
  mockS.cb.queue.push({ t: 'energy' });
  await drainApi.drain();
  assert.ok(presentation.syncCombat.calls.length > 0, 'energy handler calls syncCombat');
  assert.ok(mockSfx.energy.calls.length > 0, 'energy handler plays sfx.energy');

  presentation.floatText.calls.length = 0;
  mockS.cb.queue.push({ t: 'heal', who: 'player', n: 5 });
  await drainApi.drain();
  assert.ok(mockSfx.heal.calls.length > 0, 'heal handler plays sfx.heal');
  assert.ok(mockV.motes.calls.length > 0, 'heal handler bursts motes');
  const healFloat = presentation.floatText.calls.find((c) => c[2] === '+5');
  assert.ok(healFloat, 'heal handler floats +n');
  assert.equal(healFloat[3], 'healf', 'heal float uses healf class');

  presentation.syncCombat.calls.length = 0;
  mockS.cb.queue.push({ t: 'chip', idx: 0 });
  await drainApi.drain();
  assert.ok(presentation.syncCombat.calls.length > 0, 'chip handler calls syncCombat');

  presentation.syncCombat.calls.length = 0;
  mockS.cb.queue.push({ t: 'ember', idx: 0, n: 1 });
  await drainApi.drain();
  assert.ok(presentation.syncCombat.calls.length > 0, 'ember handler calls syncCombat');

  mockS.cb.queue.push({ t: 'kindle' });
  await drainApi.drain();
  assert.ok(mockSfx.kindle.calls.length > 0, 'kindle handler plays sfx.kindle');

  presentation.syncCombat.calls.length = 0;
  mockS.cb.queue.push({ t: 'intent', idx: 0 });
  await drainApi.drain();
  assert.ok(presentation.syncCombat.calls.length > 0, 'intent handler calls syncCombat');

  mockS.cb.queue.push({ t: 'potion' });
  await drainApi.drain();
  assert.ok(mockSfx.potion.calls.length > 0, 'potion handler plays sfx.potion');

  presentation.syncCombat.calls.length = 0;
  mockS.cb.queue.push({ t: 'relicProc', relicId: 'test' });
  await drainApi.drain();
  assert.ok(presentation.syncCombat.calls.length > 0, 'relicProc handler calls syncCombat');

  presentation.floatText.calls.length = 0;
  mockS.cb.queue.push({ t: 'maxHp', n: 5 });
  await drainApi.drain();
  const maxHpFloat = presentation.floatText.calls.find((c) => c[2] === '+5 MAX HP');
  assert.ok(maxHpFloat, 'maxHp handler floats +n MAX HP');
  assert.ok(mockSfx.buff.calls.length > 0, 'maxHp handler plays sfx.buff');
})();

// --- a11y-log: the offscreen aria-live announcer itself (fully injected) ---
{
  const created = [];
  const fakeDoc = {
    body: { appendChild(node) { created.push(node); } },
    createElement() {
      return {
        id: '', style: {}, textContent: '',
        setAttribute(key, value) { this[`attr:${key}`] = value; },
      };
    },
  };
  const a11y = createA11yLog({
    document: fakeDoc,
    S: { run: {}, cb: { enemies: [{ name: 'Bonefiend' }] } },
    contentViewFor: () => ({
      cards: { strike: { name: 'Strike' } },
      statuses: { poison: { name: 'Smolder' } },
    }),
  });
  a11y.note({ t: 'hitPlayer', amount: 7 });
  assert.equal(created.length, 1, 'a11y-log lazily creates exactly one offscreen region');
  assert.equal(created[0]['attr:aria-live'], 'polite', 'the region is a polite live region');
  assert.equal(a11y.regionEl().textContent, 'You take 7 damage.', 'damage taken is announced');
  a11y.note({ t: 'play', id: 'strike' });
  assert.equal(a11y.regionEl().textContent, 'Played Strike.', 'card play announces the card name');
  a11y.note({ t: 'hitEnemy', idx: 0, amount: 5 });
  assert.equal(a11y.regionEl().textContent, 'Bonefiend takes 5 damage.', 'enemy damage names the foe');
  a11y.drew(['strike', 'strike']);
  assert.equal(a11y.regionEl().textContent, 'Drew 2 cards: Strike, Strike.', 'a draw wave announces one summary');
  a11y.note({ t: 'chip', idx: 0 });
  assert.equal(a11y.regionEl().textContent, 'Drew 2 cards: Strike, Strike.', 'noise events stay silent');
  // Repeated identical lines (multi-hit) must still each land: consecutive
  // writes always differ so a polite region never dedupes them away.
  a11y.note({ t: 'hitEnemy', idx: 0, amount: 5 });
  const firstHit = a11y.regionEl().textContent;
  a11y.note({ t: 'hitEnemy', idx: 0, amount: 5 });
  assert.notEqual(a11y.regionEl().textContent, firstHit, 'a repeated identical line still changes the region text');
  a11y.note({ t: 'hitEnemy', idx: 0, amount: 5 });
  assert.equal(a11y.regionEl().textContent.trim(), 'Bonefiend takes 5 damage.', 'the toggle keeps the readable text intact');
}

console.log('playback tests: ok');
