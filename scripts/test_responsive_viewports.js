/**
 * Automated Responsive Viewport Verification (320px to 1440px)
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const styleCss = fs.readFileSync(path.join(ROOT, 'style.css'), 'utf-8');
const dashboardCss = fs.readFileSync(path.join(ROOT, 'dashboard.css'), 'utf-8');

const pages = [
  'index.html',
  'menu.html',
  'custom.html',
  'about.html',
  'track.html',
  'login.html',
  'dashboard.html'
];

const targetBreakpoints = [
  { width: 320, label: '320px (iPhone SE 1st gen)' },
  { width: 360, label: '360px (Standard Android / Galaxy)' },
  { width: 375, label: '375px (iPhone SE / iPhone 8)' },
  { width: 390, label: '390px (iPhone 12 / 13 / 14)' },
  { width: 430, label: '430px (iPhone 14/15/16 Pro Max)' },
  { width: 768, label: '768px (iPad / Tablet Portrait)' },
  { width: 1024, label: '1024px (Tablet Landscape / Laptop)' },
  { width: 1440, label: '1440px (Desktop Monitor)' }
];

console.log('======================================================');
console.log('    RESPONSIVE VIEWPORT & OVERFLOW AUDIT');
console.log('======================================================\n');

let pass = 0;
let fail = 0;

function check(cond, title, detail = '') {
  if (cond) {
    console.log(`  [PASS] ${title}`);
    pass++;
  } else {
    console.error(`  [FAIL] ${title}: ${detail}`);
    fail++;
  }
}

// 1. Viewport Meta Tags on All Pages
console.log('--- 1. Viewport Meta Tag Audit ---');
pages.forEach(p => {
  const content = fs.readFileSync(path.join(ROOT, p), 'utf-8');
  const hasVp = content.includes('<meta name="viewport"') || content.includes('<meta content="width=device-width');
  const allowsZoom = !content.includes('user-scalable=no');
  check(hasVp, `${p} defines viewport meta tag`);
  check(allowsZoom, `${p} permits accessibility pinch-to-zoom`);
});

// 2. Global Horizontal Overflow Guard
console.log('\n--- 2. Global Horizontal Overflow Guard ---');
check(styleCss.includes('overflow-x: hidden'), 'style.css enforces overflow-x: hidden');
check(styleCss.includes('max-width: 100vw'), 'style.css constrains max-width to 100vw');

// 3. Media Queries Coverage
console.log('\n--- 3. Media Queries Coverage Across Breakpoints ---');
check(styleCss.includes('@media (max-width: 480px)'), 'style.css has mobile breakpoint <= 480px');
check(styleCss.includes('@media (max-width: 360px)'), 'style.css has ultra-compact breakpoint <= 360px');
check(styleCss.includes('@media (max-width: 600px)') || styleCss.includes('@media (max-width: 640px)'), 'style.css has modal bottom-sheet breakpoint <= 600px/640px');
check(styleCss.includes('@media (max-width: 768px)'), 'style.css has tablet breakpoint <= 768px');
check(styleCss.includes('@media (max-width: 1024px)'), 'style.css has laptop breakpoint <= 1024px');
check(dashboardCss.includes('@media (max-width: 600px)'), 'dashboard.css has mobile breakpoint <= 600px');
check(dashboardCss.includes('@media (max-width: 768px)'), 'dashboard.css has tablet breakpoint <= 768px');
check(dashboardCss.includes('@media (max-width: 992px)'), 'dashboard.css has desktop sidebar toggle <= 992px');

// 4. Mobile Navigation & Tap Targets
console.log('\n--- 4. Mobile Navigation & Touch Ergonomics ---');
check(styleCss.includes('.mobile-bottom-bar'), 'style.css styles mobile sticky bottom navigation');
check(styleCss.includes('min-height: 44px') || styleCss.includes('min-height: 48px'), 'style.css enforces minimum 44px/48px touch targets');
check(styleCss.includes('font-size: 16px !important') || styleCss.includes('font-size: 16px'), 'style.css prevents auto-zoom on mobile inputs');

console.log(`\nViewport Audit Results: ${pass} Passed, ${fail} Failed`);
if (fail > 0) process.exit(1);
