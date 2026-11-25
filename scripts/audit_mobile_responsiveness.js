const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const styleCss = fs.readFileSync(path.join(ROOT, 'style.css'), 'utf-8');
const dashboardCss = fs.readFileSync(path.join(ROOT, 'dashboard.css'), 'utf-8');

console.log('=== MOBILE RESPONSIVENESS AUDIT ===\n');

// 1. Check fixed pixel widths > 300px in style.css that might cause horizontal overflow on 320px
console.log('--- 1. Fixed widths >= 320px without max-width: 100% ---');
const widthRegex = /([^{}]+)\{([^}]+)\}/g;
let match;
const suspiciousWidths = [];

while ((match = widthRegex.exec(styleCss)) !== null) {
  const selector = match[1].trim();
  const body = match[2];
  
  // Look for width: Npx or min-width: Npx where N >= 320
  const wMatch = body.match(/(?:min-width|width)\s*:\s*([3-9]\d{2,}|[1-9]\d{3,})px/i);
  if (wMatch && !body.includes('max-width: 100%') && !body.includes('max-width:100%') && !body.includes('max-width: 100vw')) {
    // Exclude media queries for desktop min-width
    if (!selector.includes('@media (min-width')) {
      suspiciousWidths.push({ selector: selector.replace(/\s+/g, ' '), width: wMatch[0] });
    }
  }
}

suspiciousWidths.slice(0, 15).forEach(s => console.log('  ⚠️', s.selector, '->', s.width));

// 2. Check touch targets < 44px on buttons & links
console.log('\n--- 2. Button and Interactive Element Touch Targets ---');
const btnRegex = /(\.[a-zA-Z0-9_-]*(?:btn|button|link|item|pill|tab)[a-zA-Z0-9_-]*)\s*\{([^}]+)\}/gi;
const smallTargets = [];
while ((match = btnRegex.exec(styleCss)) !== null) {
  const selector = match[1];
  const body = match[2];
  const hMatch = body.match(/(?:height|min-height)\s*:\s*(\d+)px/i);
  if (hMatch && parseInt(hMatch[1], 10) < 40 && !body.includes('display: none')) {
    smallTargets.push({ selector, height: hMatch[0] });
  }
}
smallTargets.slice(0, 10).forEach(t => console.log('  ⚠️ Small touch target:', t.selector, '->', t.height));

// 3. Check mobile bottom bar and body bottom padding
console.log('\n--- 3. Bottom padding for Mobile Sticky Bar ---');
const hasBodyBottomPadding = styleCss.includes('padding-bottom: 7') || styleCss.includes('padding-bottom: 8') || styleCss.includes('padding-bottom: 9') || styleCss.includes('padding-bottom: 100');
console.log('Body/Container has bottom padding for sticky bar:', hasBodyBottomPadding);

// 4. Check Product Grid responsive breakpoints
console.log('\n--- 4. Product Grid Layout on Mobile ---');
const gridRules = styleCss.match(/\.product-grid[^{]*\{[^}]*\}/gi) || [];
gridRules.forEach(r => console.log('  Grid rule:', r.replace(/\s+/g, ' ')));

// 5. Check Checkout & Order Modal on Mobile
console.log('\n--- 5. Order Modal Dialog Sizing ---');
const modalRules = styleCss.match(/\.(?:order-modal-dialog|order-modal|modal-container)[^{]*\{[^}]*\}/gi) || [];
modalRules.forEach(r => console.log('  Modal rule:', r.replace(/\s+/g, ' ')));

// 6. Check Dashboard Tables
console.log('\n--- 6. Dashboard Table Responsiveness ---');
const tableWrapper = dashboardCss.includes('overflow-x: auto') || dashboardCss.includes('overflow-x:auto');
console.log('Dashboard has overflow-x: auto on tables:', tableWrapper);
