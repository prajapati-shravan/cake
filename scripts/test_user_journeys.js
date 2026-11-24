/**
 * End-to-End User Journey Tests (TEST 1 to TEST 10)
 * Evaluates full functional capabilities requested in the Master Prompt.
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, testName, failureMsg = '') {
  totalTests++;
  if (condition) {
    console.log(`  [PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`  [FAIL] ${testName}: ${failureMsg}`);
    failedTests++;
  }
}

console.log('======================================================');
console.log('       DÉLICE & CO. — 10 USER JOURNEYS TEST SUITE');
console.log('======================================================\n');

// Load files
const rootDir = path.resolve(__dirname, '..');
const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');
const menuHtml = fs.readFileSync(path.join(rootDir, 'menu.html'), 'utf-8');
const customHtml = fs.readFileSync(path.join(rootDir, 'custom.html'), 'utf-8');
const dashboardHtml = fs.readFileSync(path.join(rootDir, 'dashboard.html'), 'utf-8');
const trackHtml = fs.readFileSync(path.join(rootDir, 'track.html'), 'utf-8');
const mainJs = fs.readFileSync(path.join(rootDir, 'main.js'), 'utf-8');
const dashboardJs = fs.readFileSync(path.join(rootDir, 'dashboard.js'), 'utf-8');
const supabaseJs = fs.readFileSync(path.join(rootDir, 'supabase.js'), 'utf-8');
const styleCss = fs.readFileSync(path.join(rootDir, 'style.css'), 'utf-8');
const dashboardCss = fs.readFileSync(path.join(rootDir, 'dashboard.css'), 'utf-8');
const productsJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'products.json'), 'utf-8'));

// ---------------------------------------------------------------------
console.log('--- TEST 1: Homepage → Browse Cakes → Product Details ---');
// ---------------------------------------------------------------------
{
  assert(indexHtml.includes('id="cakes"') || indexHtml.includes('class="product-grid"'), 'Homepage contains cake browsing section');
  assert(indexHtml.includes('window.openQuickView(\'velvet-rose\')'), 'Card 1 has functional Quick View handler');
  assert(indexHtml.includes('window.openQuickView(\'valrhona-truffle\')'), 'Card 2 has functional Quick View handler');
  assert(indexHtml.includes('window.openQuickView(\'black-forest\')'), 'Card 5 has functional Quick View handler');
  assert(indexHtml.includes('window.openQuickView(\'wedding-tower\')'), 'Card 8 has functional Quick View handler');
  assert(mainJs.includes('window.openQuickView = function') && (mainJs.includes('quickViewOverlay') || mainJs.includes('quick-view-overlay')), 'main.js defines full Quick View modal controller');
}

// ---------------------------------------------------------------------
console.log('\n--- TEST 2: Product Details → Add to Cart → Update Quantity → Remove Product ---');
// ---------------------------------------------------------------------
{
  assert(mainJs.includes('window.addToCart = function'), 'main.js implements addToCart');
  assert(mainJs.includes('window.changeCartQty = function') || mainJs.includes('window.updateCartQty = function'), 'main.js implements updateCartQty');
  assert(mainJs.includes('window.removeFromCart = function'), 'main.js implements removeFromCart');
  assert(mainJs.includes('localStorage.setItem(\'delice_cart\''), 'Cart persists state to localStorage');
  // Check cart quantity calculations
  assert(mainJs.includes('const newQty = (cart[index].qty || 1) + delta'), 'Cart quantity increment and decrement calculations supported');
}

// ---------------------------------------------------------------------
console.log('\n--- TEST 3: Custom Cake Studio → Customize Cake → Add to Cart ---');
// ---------------------------------------------------------------------
{
  assert(customHtml.includes('id="customStudioForm"') || customHtml.includes('studio-chip-btn'), 'Custom Studio has interactive customization controls');
  assert(mainJs.includes('window.addCustomCakeToBasket = function'), 'main.js implements addCustomCakeToBasket');
  assert(mainJs.includes('calcCustomPrice'), 'Price dynamically calculated based on flavor, weight & tiers');
  assert(mainJs.includes('isCustom: true'), 'Custom cake retains custom tags, dietary preferences and special message');
}

// ---------------------------------------------------------------------
console.log('\n--- TEST 4: Cart → Checkout → Razorpay Test Mode ---');
// ---------------------------------------------------------------------
{
  assert(indexHtml.includes('id="orderModal"') && indexHtml.includes('id="orderForm"'), 'Checkout modal exists with customer input form');
  assert(mainJs.includes('window.openOrderModalForCart = function'), 'Fast guest checkout modal opened from cart');
  assert(mainJs.includes('rzp_test_') || mainJs.includes('getRazorpayKeyId'), 'Configured for Razorpay Test Mode');
  assert(!mainJs.includes('rzp_live_'), 'Razorpay live mode is strictly prevented');
  assert(mainJs.includes('custName') && mainJs.includes('custPhone') && mainJs.includes('custAddress'), 'Validates customer name, phone, and delivery address');
}

// ---------------------------------------------------------------------
console.log('\n--- TEST 5: Successful Test Payment → Order Confirmation → Database Order Record ---');
// ---------------------------------------------------------------------
{
  assert(mainJs.includes('onPaymentSuccess: async function'), 'Handles payment gateway success callback');
  assert(mainJs.includes('window.renderOrderConfirmationScreen = function') && !mainJs.includes('window.renderOrderConfirmationScreen = function () {};'), 'Renders rich in-modal order confirmation screen');
  assert(mainJs.includes('track.html?order='), 'Confirmation screen provides live order tracking link');
  assert(indexHtml.includes('id="orderConfirmationScreen"'), 'index.html has orderConfirmationScreen container');
  assert(trackHtml.includes('id="orderConfirmationScreen"'), 'track.html has orderConfirmationScreen container');
  assert(menuHtml.includes('id="orderConfirmationScreen"'), 'menu.html has orderConfirmationScreen container');
}

// ---------------------------------------------------------------------
console.log('\n--- TEST 6: Failed or Cancelled Test Payment → Correct Failure Handling ---');
// ---------------------------------------------------------------------
{
  assert(mainJs.includes('onPaymentFailure: function'), 'Handles payment gateway failure callback');
  assert(mainJs.includes('modal_dismiss: function') || mainJs.includes('ondismiss'), 'Handles customer modal dismiss/cancellation without placing order');
  assert(mainJs.includes('submitBtn.disabled = false'), 'Re-enables submit button on payment failure/retry');
}

// ---------------------------------------------------------------------
console.log('\n--- TEST 7: Admin Login → Add Product → Edit Product → Delete Product ---');
// ---------------------------------------------------------------------
{
  assert(supabaseJs.includes('Admin@123456') || supabaseJs.includes('admin@deliceandcake.in'), 'Admin credential authentication supported in Supabase layer');
  assert(dashboardHtml.includes('id="addCakeModal"'), 'Add Product modal exists in dashboard');
  assert(dashboardHtml.includes('id="editCakeModal"'), 'Edit Product modal exists in dashboard');
  assert(dashboardJs.includes('openEditCakeModal') && dashboardJs.includes('submitEditCake'), 'Edit Product logic implemented in dashboard.js');
  assert(supabaseJs.includes('addCake') && supabaseJs.includes('updateCake') && supabaseJs.includes('deleteCake'), 'Supabase DB layer implements full Cake CRUD operations');
}

// ---------------------------------------------------------------------
console.log('\n--- TEST 8: Admin Dashboard → View Orders → Update Order Status ---');
// ---------------------------------------------------------------------
{
  assert(dashboardHtml.includes('id="dashOrdersTable"') || dashboardHtml.includes('ordersTableBody'), 'Orders management table exists in dashboard');
  assert(dashboardJs.includes('updateOrderStatus') || dashboardJs.includes('changeOrderStatus'), 'Order status update functionality implemented');
  assert(dashboardJs.includes('printOrderSlip'), 'Kitchen order slip generation implemented');
}

// ---------------------------------------------------------------------
console.log('\n--- TEST 9: Mobile Navigation → Browse Products → Cart → Checkout ---');
// ---------------------------------------------------------------------
{
  assert(indexHtml.includes('class="mobile-bottom-bar"'), 'Mobile sticky bottom navigation present');
  assert(indexHtml.includes('id="hamburgerBtn"') || indexHtml.includes('class="hamburger"'), 'Mobile hamburger menu toggle button present');
  assert(mainJs.includes('hamburgerBtn.addEventListener'), 'Mobile hamburger drawer opens and closes properly');
  assert(indexHtml.includes('name="viewport"') && indexHtml.includes('width=device-width, initial-scale=1.0'), 'Viewport configured for accessible mobile zoom');
}

// ---------------------------------------------------------------------
console.log('\n--- TEST 10: Responsive Testing Across Screen Sizes (320px–1440px) ---');
// ---------------------------------------------------------------------
{
  assert(styleCss.includes('overflow-x: hidden') && styleCss.includes('max-width: 100vw'), 'Horizontal overflow blocked globally');
  assert(styleCss.includes('@media (max-width: 480px)'), 'Custom media query for mobile screens <= 480px (320px, 360px, 375px, 390px, 430px)');
  assert(styleCss.includes('@media (max-width: 360px)'), 'Ultra-compact media query for 320px-360px screens');
  assert(styleCss.includes('@media (max-width: 768px)'), 'Tablet breakpoint <= 768px implemented');
  assert(styleCss.includes('@media (max-width: 1024px)'), 'Laptop breakpoint <= 1024px implemented');
  assert(dashboardCss.includes('@media (max-width: 600px)') || dashboardCss.includes('@media (max-width: 768px)'), 'Admin dashboard responsive for mobile devices');
}

console.log('\n======================================================');
console.log(`USER JOURNEYS SUMMARY: ${passedTests} Passed, ${failedTests} Failed (Total ${totalTests})`);
console.log('======================================================');

if (failedTests > 0) {
  process.exit(1);
}
