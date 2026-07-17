// Node-pure unit coverage for Round 5 baseline install/manifest helpers.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import {
  mkdtempSync, readFileSync, rmSync, writeFileSync, existsSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  BASELINE_MANIFEST_SCHEMA_VERSION,
  buildBaselineManifest,
  collectLinuxSnapshotRows,
  writeBaselineManifest,
} from '../tools/write-baseline-manifest.mjs';
import { installBaselineArtifact } from '../tools/install-baseline-artifact.mjs';
import { waitForNewDispatchRun } from '../tools/run-baseline-workflow.mjs';

function sha256(buf) {
  return createHash('sha256').update(buf).digest('hex');
}

function makeStore() {
  const root = mkdtempSync(join(tmpdir(), 'spirebound-baseline-test-'));
  return {
    root,
    cleanup() { rmSync(root, { recursive: true, force: true }); },
  };
}

{
  const { root, cleanup } = makeStore();
  try {
    writeFileSync(join(root, 'title-desktop-linux.png'), Buffer.from('aaa'));
    writeFileSync(join(root, 'map-desktop-linux.png'), Buffer.from('bbbb'));
    writeFileSync(join(root, 'title-desktop-darwin.png'), Buffer.from('ignore'));
    writeFileSync(join(root, 'notes.txt'), Buffer.from('ignore'));
    const rows = collectLinuxSnapshotRows(root);
    assert.deepEqual(rows.map((r) => r.path), [
      'map-desktop-linux.png',
      'title-desktop-linux.png',
    ], 'linux rows are allowlisted and stably sorted');
    assert.equal(rows[0].bytes, 4);
    assert.equal(rows[0].sha256, sha256(Buffer.from('bbbb')));

    const manifest = writeBaselineManifest({
      snapshotDir: root,
      sourceSha: 'abcdef1234567890abcdef1234567890abcdef12',
    });
    assert.equal(manifest.schemaVersion, BASELINE_MANIFEST_SCHEMA_VERSION);
    assert.equal(manifest.sourceSha, 'abcdef1234567890abcdef1234567890abcdef12');
    assert.equal(manifest.files.length, 2);
    const written = JSON.parse(readFileSync(join(root, 'baseline-manifest.json'), 'utf8'));
    assert.deepEqual(written.files.map((f) => f.path), manifest.files.map((f) => f.path));

    assert.throws(
      () => buildBaselineManifest({
        sourceSha: 'abcdef1',
        files: [{ path: '../escape-linux.png', bytes: 1, sha256: 'a'.repeat(64) }],
      }),
      /traversal|allowlisted|non-allowlisted/,
    );
    assert.throws(
      () => buildBaselineManifest({
        sourceSha: 'abcdef1',
        files: [{ path: 'nested/title-linux.png', bytes: 1, sha256: 'a'.repeat(64) }],
      }),
      /traversal|allowlisted|non-allowlisted/,
    );
  } finally {
    cleanup();
  }
}

{
  const artifact = makeStore();
  const dest = makeStore();
  try {
    const a = Buffer.from('linux-a');
    const b = Buffer.from('linux-b');
    writeFileSync(join(artifact.root, 'combat-act1-desktop-linux.png'), a);
    writeFileSync(join(artifact.root, 'title-desktop-linux.png'), b);
    const files = [
      { path: 'combat-act1-desktop-linux.png', bytes: a.byteLength, sha256: sha256(a) },
      { path: 'title-desktop-linux.png', bytes: b.byteLength, sha256: sha256(b) },
    ];
    const sha = '1111111111111111111111111111111111111111';
    writeFileSync(
      join(artifact.root, 'baseline-manifest.json'),
      `${JSON.stringify(buildBaselineManifest({ sourceSha: sha, files }), null, 2)}\n`,
    );

    assert.throws(
      () => installBaselineArtifact({
        artifact: artifact.root, expectSha: '2222222222222222222222222222222222222222', destination: dest.root,
      }),
      /sourceSha mismatch/,
    );
    assert.equal(existsSync(join(dest.root, 'title-desktop-linux.png')), false,
      'failed validation must not copy');

    // Extra file rejection
    writeFileSync(join(artifact.root, 'extra-desktop-linux.png'), Buffer.from('x'));
    assert.throws(
      () => installBaselineArtifact({
        artifact: artifact.root, expectSha: sha, destination: dest.root,
      }),
      /extra artifact file/,
    );
    rmSync(join(artifact.root, 'extra-desktop-linux.png'));

    // Missing file rejection
    rmSync(join(artifact.root, 'title-desktop-linux.png'));
    assert.throws(
      () => installBaselineArtifact({
        artifact: artifact.root, expectSha: sha, destination: dest.root,
      }),
      /missing artifact file/,
    );
    writeFileSync(join(artifact.root, 'title-desktop-linux.png'), b);

    // Hash mismatch (same byte length so size check passes first)
    writeFileSync(join(artifact.root, 'title-desktop-linux.png'), Buffer.from('linux-X'));
    assert.throws(
      () => installBaselineArtifact({
        artifact: artifact.root, expectSha: sha, destination: dest.root,
      }),
      /sha256 mismatch/,
    );
    writeFileSync(join(artifact.root, 'title-desktop-linux.png'), b);

    const installed = installBaselineArtifact({
      artifact: artifact.root, expectSha: sha, destination: dest.root,
    });
    assert.deepEqual(installed, [
      'combat-act1-desktop-linux.png',
      'title-desktop-linux.png',
    ]);
    assert.deepEqual(readFileSync(join(dest.root, 'title-desktop-linux.png')), b);
  } finally {
    artifact.cleanup();
    dest.cleanup();
  }
}

{
  // waitForNewDispatchRun: delayed listing, previous run ignored, duplicate + head mismatch.
  const previousIds = [101];
  let tick = 0;
  const listings = [
    [{ databaseId: 101, headSha: 'abc1234', event: 'workflow_dispatch' }],
    [{ databaseId: 101, headSha: 'abc1234', event: 'workflow_dispatch' }],
    [
      { databaseId: 101, headSha: 'abc1234', event: 'workflow_dispatch' },
      { databaseId: 202, headSha: 'abc1234', event: 'workflow_dispatch' },
    ],
  ];
  const found = await waitForNewDispatchRun({
    previousIds,
    expectSha: 'abc1234',
    timeoutMs: 10_000,
    pollMs: 1,
    now: () => (tick < 3 ? tick * 10 : 10_000),
    sleepFn: async () => { tick += 1; },
    listRuns: async () => listings[Math.min(tick, listings.length - 1)],
  });
  assert.equal(found.databaseId, 202);

  await assert.rejects(
    () => waitForNewDispatchRun({
      previousIds: [],
      expectSha: 'abc1234',
      timeoutMs: 5,
      pollMs: 1,
      now: (() => { let n = 0; return () => { n += 10; return n; }; })(),
      sleepFn: async () => {},
      listRuns: async () => [],
    }),
    /timed out/,
  );

  await assert.rejects(
    () => waitForNewDispatchRun({
      previousIds: [],
      expectSha: 'abc1234',
      timeoutMs: 1000,
      pollMs: 1,
      now: () => 0,
      sleepFn: async () => {},
      listRuns: async () => ([
        { databaseId: 1, headSha: 'abc1234' },
        { databaseId: 2, headSha: 'abc1234' },
      ]),
    }),
    /concurrent duplicate/,
  );

  await assert.rejects(
    () => waitForNewDispatchRun({
      previousIds: [],
      expectSha: 'abc1234',
      timeoutMs: 1000,
      pollMs: 1,
      now: () => 0,
      sleepFn: async () => {},
      listRuns: async () => ([{ databaseId: 9, headSha: 'deadbeef' }]),
    }),
    /headSha mismatch/,
  );
}

console.log('baseline tool checks passed');
