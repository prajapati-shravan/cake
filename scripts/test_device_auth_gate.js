const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');

console.log('--- Testing Device Auth Gate on all pages ---');

function extractGateScript(htmlContent) {
  const match = htmlContent.match(/<!-- DÉLICE & CO\. DEVICE AUTH GATE[^>]*-->\s*<script>([\s\S]*?)<\/script>/i);
  if (!match) throw new Error('Gate script not found in HTML');
  return match[1];
}

function createBrowserEnv(storage = {}, search = '') {
  let locationUrl = 'original';
  const localStorageMock = {
    getItem: (k) => storage[k] || null,
    setItem: (k, v) => { storage[k] = String(v); },
    removeItem: (k) => { delete storage[k]; }
  };
  const sessionStorageMock = {
    getItem: (k) => storage['session_' + k] || null,
    setItem: (k, v) => { storage['session_' + k] = String(v); },
    removeItem: (k) => { delete storage['session_' + k]; }
  };
  const windowMock = {
    location: {
      search: search,
      replace: (dest) => { locationUrl = dest; }
    },
    localStorage: localStorageMock,
    sessionStorage: sessionStorageMock
  };

  return {
    context: {
      window: windowMock,
      localStorage: localStorageMock,
      sessionStorage: sessionStorageMock
    },
    getRedirect: () => locationUrl
  };
}

const pages = [
  { file: 'index.html', expectedRedirect: 'login.html' },
  { file: 'menu.html', expectedRedirect: 'login.html?redirect=menu.html' },
  { file: 'custom.html', expectedRedirect: 'login.html?redirect=custom.html' },
  { file: 'about.html', expectedRedirect: 'login.html?redirect=about.html' },
  { file: 'track.html', expectedRedirect: 'login.html?redirect=track.html' },
];

for (const p of pages) {
  const html = fs.readFileSync(path.join(ROOT, p.file), 'utf-8');
  const scriptCode = extractGateScript(html);

  // 1. Fresh Device (no credentials) -> Must redirect to login page
  const freshEnv = createBrowserEnv({}, '');
  vm.runInNewContext(scriptCode, freshEnv.context);
  if (freshEnv.getRedirect() !== p.expectedRedirect) {
    console.error(`FAILED: Fresh device on ${p.file} redirected to ${freshEnv.getRedirect()} instead of ${p.expectedRedirect}`);
    process.exit(1);
  }
  console.log(`[PASS] Fresh device on ${p.file} -> routed to ${freshEnv.getRedirect()}`);

  // 2. Authenticated Device -> Must NOT redirect (remains on page)
  const authEnv = createBrowserEnv({ delice_user: JSON.stringify({ id: 'u123', phone: '9909444882', full_name: 'Shravan' }) }, '');
  vm.runInNewContext(scriptCode, authEnv.context);
  if (authEnv.getRedirect() !== 'original') {
    console.error(`FAILED: Authenticated device on ${p.file} incorrectly redirected to ${authEnv.getRedirect()}`);
    process.exit(1);
  }
  console.log(`[PASS] Authenticated device on ${p.file} -> allowed access without redirect`);

  // 3. Guest browse mode -> Must NOT redirect
  const guestEnv = createBrowserEnv({ 'session_delice_guest_browse': 'true' }, '');
  vm.runInNewContext(scriptCode, guestEnv.context);
  if (guestEnv.getRedirect() !== 'original') {
    console.error(`FAILED: Guest user on ${p.file} incorrectly redirected to ${guestEnv.getRedirect()}`);
    process.exit(1);
  }
  console.log(`[PASS] Guest user on ${p.file} -> allowed browsing`);
}

// Special test for track.html with direct order link:
const trackHtml = fs.readFileSync(path.join(ROOT, 'track.html'), 'utf-8');
const trackScript = extractGateScript(trackHtml);
const directTrackEnv = createBrowserEnv({}, '?order=DC-2026-000001');
vm.runInNewContext(trackScript, directTrackEnv.context);
if (directTrackEnv.getRedirect() !== 'original') {
  console.error('FAILED: track.html with direct ?order= was blocked');
  process.exit(1);
}
console.log('[PASS] track.html direct order tracking link -> allowed without redirect');

console.log('\nAll Device Auth Gate tests PASSED successfully!');
