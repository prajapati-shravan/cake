/**
 * Headless Browser Runtime & Console Error Auditor
 * Simulates DOM and browser environment using Node.js vm module.
 * Executes page scripts and verifies zero unhandled errors or console.error calls.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');

const pages = [
  { name: 'index.html', scripts: ['supabase.js', 'main.js'] },
  { name: 'menu.html', scripts: ['supabase.js', 'main.js'] },
  { name: 'custom.html', scripts: ['supabase.js', 'custom-cake-visualizer.js', 'main.js'] },
  { name: 'about.html', scripts: ['supabase.js', 'main.js'] },
  { name: 'track.html', scripts: ['supabase.js', 'main.js'] },
  { name: 'dashboard.html', scripts: ['supabase.js', 'dashboard.js'] }
];

console.log('======================================================');
console.log('      HEADLESS BROWSER RUNTIME & ERROR AUDIT');
console.log('======================================================\n');

let totalRuntimeErrors = 0;

function createBrowserContext(htmlContent, pageUrl) {
  const localStorageStore = {};
  const sessionStorageStore = { 'delice_guest_browse': 'true' };

  const storageMock = (store) => ({
    getItem: (k) => store[k] !== undefined ? store[k] : null,
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
    clear: () => { Object.keys(store).forEach(k => delete store[k]); }
  });

  // Simple DOM parser for getElementById and querySelector based on htmlContent
  const elements = {};
  const idRegex = /id=["']([^"']+)["']/gi;
  let match;
  while ((match = idRegex.exec(htmlContent)) !== null) {
    const id = match[1];
    elements[id] = {
      id: id,
      tagName: 'DIV',
      style: {},
      classList: {
        add: () => {},
        remove: () => {},
        toggle: () => {},
        contains: () => false
      },
      addEventListener: () => {},
      removeEventListener: () => {},
      setAttribute: () => {},
      getAttribute: () => null,
      scrollIntoView: () => {},
      appendChild: () => {},
      removeChild: () => {},
      reset: () => {},
      focus: () => {}
    };
  }

  const windowObj = {
    location: {
      href: pageUrl,
      pathname: '/' + pageUrl,
      search: '?guest=1',
      hash: '',
      replace: () => {},
      reload: () => {}
    },
    history: { replaceState: () => {}, pushState: () => {} },
    localStorage: storageMock(localStorageStore),
    sessionStorage: storageMock(sessionStorageStore),
    navigator: { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) HeadlessChrome' },
    addEventListener: () => {},
    removeEventListener: () => {},
    document: {
      getElementById: (id) => elements[id] || null,
      querySelector: (sel) => {
        if (sel.startsWith('#')) return elements[sel.slice(1)] || null;
        return { style: {}, classList: { add: ()=>{}, remove: ()=>{} }, addEventListener: ()=>{}, querySelectorAll: ()=>[] };
      },
      querySelectorAll: () => [],
      createElement: (tag) => ({
        tagName: tag.toUpperCase(),
        style: {},
        classList: { add: ()=>{}, remove: ()=>{} },
        addEventListener: ()=>{},
        appendChild: ()=>{},
        setAttribute: ()=>{}
      }),
      head: { appendChild: ()=>{} },
      body: {
        style: {},
        classList: { add: ()=>{}, remove: ()=>{} },
        setAttribute: ()=>{},
        getAttribute: ()=>null,
        appendChild: ()=>{}
      },
      documentElement: {
        style: {},
        classList: { add: ()=>{}, remove: ()=>{} }
      },
      addEventListener: () => {}
    },
    console: {
      log: () => {},
      warn: (msg) => {},
      error: (msg, ...args) => {
        console.error(`  [CONSOLE ERROR in ${pageUrl}]:`, msg, ...args);
        totalRuntimeErrors++;
      }
    },
    fetch: () => Promise.resolve({ ok: true, json: () => Promise.resolve([]) }),
    setTimeout: (fn) => setTimeout(fn, 0),
    clearTimeout: (id) => clearTimeout(id),
    setInterval: () => {},
    clearInterval: () => {},
    Audio: function() { return { play: () => Promise.resolve(), pause: () => {} }; },
    scrollTo: () => {}
  };

  windowObj.window = windowObj;
  windowObj.self = windowObj;
  windowObj.global = windowObj;

  return vm.createContext(windowObj);
}

for (const p of pages) {
  console.log(`Auditing runtime for: ${p.name}...`);
  const htmlContent = fs.readFileSync(path.join(ROOT, p.name), 'utf-8');
  const ctx = createBrowserContext(htmlContent, p.name);

  let pageErrors = 0;
  for (const s of p.scripts) {
    const scriptContent = fs.readFileSync(path.join(ROOT, s), 'utf-8');
    try {
      vm.runInContext(scriptContent, ctx, { filename: s });
    } catch (err) {
      console.error(`  [RUNTIME EXCEPTION in ${p.name} loading ${s}]:`, err.message, err.stack);
      pageErrors++;
      totalRuntimeErrors++;
    }
  }

  if (pageErrors === 0) {
    console.log(`  -> [PASS] ${p.name} executed cleanly with 0 exceptions.`);
  }
}

console.log('\n======================================================');
console.log(`RUNTIME AUDIT SUMMARY: Total Runtime Errors = ${totalRuntimeErrors}`);
console.log('======================================================');

if (totalRuntimeErrors > 0) {
  process.exit(1);
}
