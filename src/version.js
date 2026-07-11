// App version helpers. Display strings are assembled here; Vite injects the
// raw __SPIRE_*__ constants at build/dev time (see vite.config.js).

export function formatVersionDisplay(version, gitSha, isRelease) {
  if (isRelease) return String(version);
  const sha = String(gitSha || '').trim() || 'unknown';
  return `${version}+${sha}`;
}

export function getVersionInfo() {
  const version = typeof __SPIRE_VERSION__ !== 'undefined' ? __SPIRE_VERSION__ : '0.0.0';
  const gitSha = typeof __SPIRE_GIT_SHA__ !== 'undefined' ? __SPIRE_GIT_SHA__ : 'unknown';
  const release = typeof __SPIRE_RELEASE__ !== 'undefined' ? !!__SPIRE_RELEASE__ : false;
  return {
    version,
    gitSha,
    release,
    display: formatVersionDisplay(version, gitSha, release),
  };
}
