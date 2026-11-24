/**
 * Deep Verification of Interactive Elements, Handlers & DOM Targets
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const mainJs = fs.readFileSync(path.join(ROOT, 'main.js'), 'utf-8');
const dashboardJs = fs.readFileSync(path.join(ROOT, 'dashboard.js'), 'utf-8');
const supabaseJs = fs.readFileSync(path.join(ROOT, 'supabase.js'), 'utf-8');

const pages = ['index.html', 'menu.html', 'custom.html', 'about.html', 'track.html', 'dashboard.html', 'login.html'];

console.log('======================================================');
console.log('   INTERACTIVE ELEMENTS, BUTTONS & ANCHOR VERIFICATION');
console.log('======================================================\n');

let passCount = 0;
let failCount = 0;

function report(cond, name, err = '') {
  if (cond) {
    console.log(`  [PASS] ${name}`);
    passCount++;
  } else {
    console.error(`  [FAIL] ${name}: ${err}`);
    failCount++;
  }
}

// 1. Verify Core Storefront Global Handlers in main.js
console.log('--- 1. Storefront Global Window Handlers ---');
const requiredMainHandlers = [
  'addToCart',
  'openOrderModalForCard',
  'openOrderModalForCart',
  'closeOrderModal',
  'submitOrderCheckout',
  'renderOrderConfirmationScreen',
  'openQuickView',
  'closeQuickView',
  'setCardWeight',
  'changeCartQty',
  'updateCartQty',
  'removeFromCart',
  'applyOrderCoupon',
  'selectPaymentMethod',
  'filterCategory',
  'addCustomCakeToBasket',
  'submitCustomCakeInquiry',
  'calcCustomPrice',
  'toggleAudioTone'
];

requiredMainHandlers.forEach(fn => {
  const isDefined = mainJs.includes(`window.${fn} =`) || mainJs.includes(`window.${fn}=`);
  report(isDefined, `main.js exports window.${fn}`);
});

// 2. Verify Admin Dashboard Handlers in dashboard.js
console.log('\n--- 2. Admin Dashboard Handlers ---');
const requiredDashHandlers = [
  'openAddCakeModal',
  'closeAddCakeModal',
  'submitNewCake',
  'openEditCakeModal',
  'closeEditCakeModal',
  'submitEditCake',
  'deleteCake',
  'toggleCakeStock',
  'updateCakePrice',
  'printOrderSlip',
  'checkAdminAuth',
  'handleAdminLogin'
];

requiredDashHandlers.forEach(fn => {
  const isDefined = dashboardJs.includes(`${fn}:`) || dashboardJs.includes(`function ${fn}`) || dashboardJs.includes(`window.${fn}`);
  report(isDefined, `dashboard.js implements ${fn}`);
});

// 3. Verify In-Page Anchor Links (#cakes, #about, etc.)
console.log('\n--- 3. In-Page Anchor Targets ---');
pages.forEach(p => {
  const content = fs.readFileSync(path.join(ROOT, p), 'utf-8');
  const anchorRegex = /href=["']#([^"'?]+)["']/gi;
  let match;
  const checked = new Set();
  while ((match = anchorRegex.exec(content)) !== null) {
    const targetId = match[1];
    if (targetId && !checked.has(targetId)) {
      checked.add(targetId);
      const idExists = content.includes(`id="${targetId}"`) || content.includes(`id='${targetId}'`);
      report(idExists, `${p} anchor #${targetId} resolves to DOM element`);
    }
  }
});

console.log(`\nInteractive Elements Results: ${passCount} Passed, ${failCount} Failed`);
if (failCount > 0) process.exit(1);
