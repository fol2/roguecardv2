// Round 5 font-asset verifier. Two modes:
//   --check           byte-verifies OFL copies, lockfile integrity and the
//                     seven Latin WOFF2 inputs against the pinned hashes.
//   --write-evidence  atomically regenerates the checked-in licence copies +
//                     provenance JSON from the pinned pins, then re-verifies.

import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, copyFileSync, mkdirSync, existsSync, renameSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, '..');

const PINNED = Object.freeze([
  {
    name: '@fontsource/cinzel',
    version: '5.2.8',
    lockIntegrity: 'sha512-B9WeF/jPlOJOrcXfX96cy4KfM+s1QcU2C9W2hE3azBOBzPvzFkNpBovT5JmhAeicE/s4HZWKF9LF5hmEcqlbsw==',
    licence: {
      source: 'node_modules/@fontsource/cinzel/LICENSE',
      target: 'docs/licences/fonts/cinzel-OFL.txt',
      sha256: 'f5a242cf68ad6ebd0603b3359a74c593ca080318a681035be5296ba2c6b04ae6',
    },
    assets: [
      { family: 'Cinzel', weight: '500', style: 'normal',
        file: 'node_modules/@fontsource/cinzel/files/cinzel-latin-500-normal.woff2',
        sha256: '2864b2c9db377e10db43d3ca1ab268c0e10cf3ee94b1a325d104b8e4a74dc7da' },
      { family: 'Cinzel', weight: '700', style: 'normal',
        file: 'node_modules/@fontsource/cinzel/files/cinzel-latin-700-normal.woff2',
        sha256: '8efa224fe70fef188a39c095e218b81fd31061809f2752537e33a9ec7b9c2263' },
      { family: 'Cinzel', weight: '800', style: 'normal',
        file: 'node_modules/@fontsource/cinzel/files/cinzel-latin-800-normal.woff2',
        sha256: '47fd3e35a90ae2198df04cdc9f036011f1b58f6e97878de7aa9258c35f6ac665' },
    ],
  },
  {
    name: '@fontsource/alegreya',
    version: '5.2.8',
    lockIntegrity: 'sha512-/C4ShWmhyyaDZj9GfFvMaeGrt7pRupgoXdFd26Cg/y5m49UhhifbqBBRNwVhGCt5+wfjmakz7wBhFHJLH5c/mg==',
    licence: {
      source: 'node_modules/@fontsource/alegreya/LICENSE',
      target: 'docs/licences/fonts/alegreya-OFL.txt',
      sha256: 'a616403914fd16d254244f482b348af457a54f7e79a7919daec24129c1bd3571',
    },
    assets: [
      { family: 'Alegreya', weight: '400', style: 'normal',
        file: 'node_modules/@fontsource/alegreya/files/alegreya-latin-400-normal.woff2',
        sha256: 'fe33a80f1e2f7200d22980bb3838c168f1e7a36262a3e51ff73f47242e79c21f' },
      { family: 'Alegreya', weight: '500', style: 'normal',
        file: 'node_modules/@fontsource/alegreya/files/alegreya-latin-500-normal.woff2',
        sha256: '6cac80c145da16f6922c4f9b04adf2a49af671320925f923f16a4a8ed1133601' },
      { family: 'Alegreya', weight: '700', style: 'normal',
        file: 'node_modules/@fontsource/alegreya/files/alegreya-latin-700-normal.woff2',
        sha256: '9625138569ede683bc9d5b92b5c304bd2f5a106dadb2ba6ad757b792b79932bc' },
      { family: 'Alegreya', weight: '400', style: 'italic',
        file: 'node_modules/@fontsource/alegreya/files/alegreya-latin-400-italic.woff2',
        sha256: '61f7ea641fb5661f91a379791985c48fdb9b6205b4cae892190f0b2799650cdf' },
    ],
  },
]);

const PROVENANCE_TARGET = 'docs/licences/fonts/round5-provenance.json';

function readSha(path) {
  const abs = resolve(REPO, path);
  const bytes = readFileSync(abs);
  return { bytes, sha256: createHash('sha256').update(bytes).digest('hex') };
}

function readLockIntegrity(pkgName) {
  const lockPath = resolve(REPO, 'package-lock.json');
  const lock = JSON.parse(readFileSync(lockPath, 'utf8'));
  const key = `node_modules/${pkgName}`;
  const entry = lock.packages?.[key];
  if (!entry) throw new Error(`package-lock.json missing ${key}`);
  if (!entry.integrity) throw new Error(`package-lock.json has no integrity for ${key}`);
  if (entry.version !== '5.2.8') throw new Error(`${pkgName} lock version ${entry.version} !== 5.2.8`);
  return entry.integrity;
}

function verifyLicenceCheckedIn(pkg) {
  const stat = readSha(pkg.licence.target);
  if (stat.sha256 !== pkg.licence.sha256) {
    throw new Error(
      `${pkg.licence.target} sha256 ${stat.sha256} != expected ${pkg.licence.sha256}`,
    );
  }
}

function verifyLicenceSource(pkg) {
  const stat = readSha(pkg.licence.source);
  if (stat.sha256 !== pkg.licence.sha256) {
    throw new Error(
      `${pkg.licence.source} sha256 ${stat.sha256} != expected ${pkg.licence.sha256}`,
    );
  }
}

function verifyAsset(asset) {
  const stat = readSha(asset.file);
  if (stat.sha256 !== asset.sha256) {
    throw new Error(`${asset.file} sha256 ${stat.sha256} != expected ${asset.sha256}`);
  }
}

function verifyLockIntegrity(pkg) {
  const integrity = readLockIntegrity(pkg.name);
  if (integrity !== pkg.lockIntegrity) {
    throw new Error(`${pkg.name} lock integrity ${integrity} != expected ${pkg.lockIntegrity}`);
  }
}

function buildProvenancePayload() {
  const packages = PINNED.map((pkg) => ({
    name: pkg.name,
    version: pkg.version,
    lockIntegrity: pkg.lockIntegrity,
    licence: {
      path: pkg.licence.target,
      sha256: pkg.licence.sha256,
    },
    assets: pkg.assets.map((asset) => ({
      family: asset.family,
      weight: asset.weight,
      style: asset.style,
      file: asset.file.replace(/^node_modules\//, ''),
      sha256: asset.sha256,
    })),
  }));
  return {
    capturedAt: '2026-07-13',
    note: 'Round 5 self-hosted display + body fonts. All assets are exact pins; the verifier tools/verify-round5-fonts.mjs cross-checks lockfile integrity, checked-in OFL copies and the seven Latin WOFF2 files.',
    packages,
  };
}

function writeAtomic(target, contents) {
  const abs = resolve(REPO, target);
  mkdirSync(dirname(abs), { recursive: true });
  const tmp = `${abs}.tmp-${process.pid}-${Date.now()}`;
  writeFileSync(tmp, contents);
  renameSync(tmp, abs);
}

function writeEvidence() {
  for (const pkg of PINNED) {
    verifyLockIntegrity(pkg);
    verifyLicenceSource(pkg);
    for (const asset of pkg.assets) verifyAsset(asset);
    const source = resolve(REPO, pkg.licence.source);
    const target = resolve(REPO, pkg.licence.target);
    mkdirSync(dirname(target), { recursive: true });
    if (!existsSync(source)) throw new Error(`missing licence source ${pkg.licence.source}`);
    const tmp = `${target}.tmp-${process.pid}-${Date.now()}`;
    copyFileSync(source, tmp);
    renameSync(tmp, target);
    verifyLicenceCheckedIn(pkg);
  }
  const payload = buildProvenancePayload();
  writeAtomic(PROVENANCE_TARGET, `${JSON.stringify(payload, null, 2)}\n`);
  runCheck();
  process.stdout.write('Round 5 font evidence written and verified.\n');
}

function runCheck() {
  for (const pkg of PINNED) {
    verifyLockIntegrity(pkg);
    verifyLicenceCheckedIn(pkg);
    for (const asset of pkg.assets) verifyAsset(asset);
  }
  const provenanceText = readFileSync(resolve(REPO, PROVENANCE_TARGET), 'utf8');
  const payload = JSON.parse(provenanceText);
  const expected = buildProvenancePayload();
  if (JSON.stringify(payload) !== JSON.stringify(expected)) {
    throw new Error(`${PROVENANCE_TARGET} does not match pinned provenance payload`);
  }
  const expectedText = `${JSON.stringify(expected, null, 2)}\n`;
  if (provenanceText !== expectedText) {
    throw new Error(`${PROVENANCE_TARGET} bytes drifted from canonical formatting`);
  }
  process.stdout.write('Round 5 font evidence verified.\n');
}

function main(argv) {
  const mode = argv[2];
  if (mode === '--write-evidence') return writeEvidence();
  if (mode === '--check' || mode === undefined) return runCheck();
  throw new Error(`Usage: node tools/verify-round5-fonts.mjs [--check|--write-evidence]`);
}

try {
  main(process.argv);
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
}
