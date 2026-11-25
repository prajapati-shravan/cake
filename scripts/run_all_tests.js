/**
 * Comprehensive Automated Verification Test Suite
 * Tests technical, functional, security, performance, accessibility, and backend parity.
 */

const fs = require('fs');
const path = require('path');
const { spawn, execSync } = require('child_process');
const http = require('http');

const ROOT = path.resolve(__dirname, '..');
let passed = 0;
let failed = 0;
const results = [];

function assert(condition, testName, details = '') {
  if (condition) {
    passed++;
    results.push({ name: testName, status: 'PASS', details });
    console.log(`  [PASS] ${testName}`);
  } else {
    failed++;
    results.push({ name: testName, status: 'FAIL', details });
    console.error(`  [FAIL] ${testName} - ${details}`);
  }
}

async function run() {
  console.log('\n======================================================');
  console.log('       CAKE & JOY / DÉLICE & CO. TEST SUITE');
  console.log('======================================================\n');

  // 1. JAVASCRIPT SYNTAX INTEGRITY
  console.log('--- 1. JavaScript Syntax Verification ---');
  const jsFiles = [
    'custom-cake-visualizer.js',
    'main.js',
    'dashboard.js',
    'supabase.js',
    'sw.js',
    'netlify/functions/orders.js',
    'netlify/functions/send-email-receipt.js'
  ];
  for (const f of jsFiles) {
    const full = path.join(ROOT, f);
    try {
      execSync(`node -c "${full}"`);
      assert(true, `Syntax: ${f}`);
    } catch (e) {
      assert(false, `Syntax: ${f}`, e.message);
    }
  }

  // 2. PYTHON BACKEND SYNTAX
  console.log('\n--- 2. Python Backend Syntax Verification ---');
  try {
    const pyPath = 'C:\\Users\\praja\\AppData\\Local\\Programs\\Python\\Python313\\python.exe';
    execSync(`"${pyPath}" -m py_compile "${path.join(ROOT, 'server.py')}"`);
    assert(true, 'Python syntax: server.py');
  } catch (e) {
    assert(false, 'Python syntax: server.py', e.message);
  }

  // 3. ASSETS & LINKS INTEGRITY
  console.log('\n--- 3. Static Assets & HTML References ---');
  const htmlFiles = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));
  let brokenAssets = 0;
  for (const htmlFile of htmlFiles) {
    const content = fs.readFileSync(path.join(ROOT, htmlFile), 'utf-8');
    const assetRegex = /(?:src|href|url)\s*=\s*["']([^"':#?]+(?:\.jpg|\.png|\.svg|\.webp|\.css|\.js|\.html))["']/gi;
    let match;
    while ((match = assetRegex.exec(content)) !== null) {
      const ref = match[1].trim();
      if (!ref.startsWith('http') && !ref.startsWith('//') && !ref.startsWith('data:')) {
        const fullPath = path.join(ROOT, ref);
        if (!fs.existsSync(fullPath)) {
          brokenAssets++;
          console.error(`Broken asset in ${htmlFile}: ${ref}`);
        }
      }
    }
  }
  assert(brokenAssets === 0, 'All HTML asset links resolve to existing files', `Broken: ${brokenAssets}`);

  // 4. PRODUCT CATALOG CONSISTENCY
  console.log('\n--- 4. Product Catalog Integrity ---');
  const productsRaw = JSON.parse(fs.readFileSync(path.join(ROOT, 'products.json'), 'utf-8'));
  let invalidProducts = 0;
  for (const p of productsRaw) {
    if (!p.id || !p.name || !p.price || p.price <= 0 || !fs.existsSync(path.join(ROOT, p.img))) {
      invalidProducts++;
    }
  }
  assert(invalidProducts === 0, 'Products catalog data and images valid', `Count: ${productsRaw.length}`);

  // 5. SECURITY & PII SCRUBBING AUDIT
  console.log('\n--- 5. Security & PII Privacy Audit ---');
  const piiPhone = '9909444882';
  const piiEmail1 = 'prajapatijayesh2021@gmail.com';
  const piiEmail2 = 'shravanprajapati9909@gmail.com';
  const leakedRazorpaySecret = '5Hr2hslHZx47sWZYDsIm8jLG';

  const ordersData = fs.readFileSync(path.join(ROOT, 'orders_data.json'), 'utf-8');
  assert(!ordersData.includes(piiEmail1) && !ordersData.includes(piiEmail2), 'orders_data.json PII email scrubbed');
  assert(!ordersData.includes(piiPhone), 'orders_data.json customer phone scrubbed');

  const netlifyOrders = fs.readFileSync(path.join(ROOT, 'netlify/functions/orders.js'), 'utf-8');
  assert(!netlifyOrders.includes(piiEmail1) && !netlifyOrders.includes(piiEmail2), 'netlify orders.js baseline PII scrubbed');

  const dashboardJs = fs.readFileSync(path.join(ROOT, 'dashboard.js'), 'utf-8');
  assert(!dashboardJs.includes(piiEmail1) && !dashboardJs.includes(piiEmail2), 'dashboard.js DEFAULT_REAL_ORDERS PII scrubbed');

  const serverPy = fs.readFileSync(path.join(ROOT, 'server.py'), 'utf-8');
  assert(!serverPy.includes(leakedRazorpaySecret), 'server.py hardcoded Razorpay secret removed');

  const dashboardHtml = fs.readFileSync(path.join(ROOT, 'dashboard.html'), 'utf-8');
  assert(!dashboardHtml.includes(leakedRazorpaySecret), 'dashboard.html hardcoded Razorpay secret removed');
  assert(!dashboardHtml.includes('GRANT ALL ON TABLE orders TO anon'), 'dashboard.html dangerous SQL permissions snippet removed');
  assert(dashboardHtml.includes("u.role === 'admin'"), 'dashboard.html requires admin role');

  const supabaseJs = fs.readFileSync(path.join(ROOT, 'supabase.js'), 'utf-8');
  assert(!supabaseJs.includes("localMatch.password === pwd || pwd.length >= 6"), 'supabase.js login password bypass removed');
  assert(!supabaseJs.includes("regRecord") && !supabaseJs.includes("regUsers[cleanEmail"), 'supabase.js plaintext password localStorage caching removed');
  assert(!supabaseJs.includes("inputCode === '123456'"), 'supabase.js backdoor OTP codes removed');

  const loginHtml = fs.readFileSync(path.join(ROOT, 'login.html'), 'utf-8');
  assert(!loginHtml.includes('triggerDirectGoogleSignIn'), 'login.html 1-click backdoor removed');
  assert(!loginHtml.includes("email.includes('admin')"), 'login.html role privilege escalation removed');

  // 6. NETLIFY ROUTING & REDIRECTS AUDIT
  console.log('\n--- 6. Netlify Routing & Redirects Audit ---');
  const redirects = fs.readFileSync(path.join(ROOT, '_redirects'), 'utf-8');
  assert(redirects.includes('/api/create-razorpay-order'), '_redirects includes create-razorpay-order');
  assert(redirects.includes('/api/verify-payment'), '_redirects includes verify-payment');
  assert(redirects.includes('/api/submit-order         /.netlify/functions/orders'), '_redirects routes submit-order to orders function');
  assert(redirects.includes('/orders_data.json         /404.html'), '_redirects blocks orders_data.json with redirect to 404');
  assert(redirects.includes('/.env*                    /404.html'), '_redirects blocks .env with redirect to 404');

  const netlifyToml = fs.readFileSync(path.join(ROOT, 'netlify.toml'), 'utf-8');
  assert(netlifyToml.includes('from = "/api/create-razorpay-order"'), 'netlify.toml includes create-razorpay-order');
  assert(netlifyToml.includes('from = "/orders_data.json"'), 'netlify.toml blocks orders_data.json');

  // 7. PERFORMANCE & ACCESSIBILITY AUDIT
  console.log('\n--- 7. Performance & Accessibility Audit ---');
  const styleCss = fs.readFileSync(path.join(ROOT, 'style.css'), 'utf-8');
  assert(!styleCss.includes('@import url('), 'style.css render-blocking @import removed');

  const aboutHtml = fs.readFileSync(path.join(ROOT, 'about.html'), 'utf-8');
  assert(!aboutHtml.includes('gsap.min.js'), 'about.html dead GSAP script removed');

  const mainJs = fs.readFileSync(path.join(ROOT, 'main.js'), 'utf-8');
  assert(mainJs.includes("e.key === 'Escape'"), 'main.js global Escape key listener present');

  const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf-8');
  assert(!indexHtml.includes('FIRST-LANDING GATE'), 'index.html legacy first-landing gate removed');
  assert(indexHtml.includes('DEVICE AUTH GATE'), 'index.html device auth gate active for new devices');
  assert(indexHtml.includes('aria-label="Enter promo coupon code"'), 'index.html coupon input has aria-label');

  const menuHtml = fs.readFileSync(path.join(ROOT, 'menu.html'), 'utf-8');
  assert(menuHtml.includes('DEVICE AUTH GATE'), 'menu.html device auth gate active');

  const customHtml = fs.readFileSync(path.join(ROOT, 'custom.html'), 'utf-8');
  assert(customHtml.includes('DEVICE AUTH GATE'), 'custom.html device auth gate active');

  const trackHtml = fs.readFileSync(path.join(ROOT, 'track.html'), 'utf-8');
  assert(trackHtml.includes('DEVICE AUTH GATE'), 'track.html device auth gate active');

  // 8. LIVE PYTHON SERVER ENDPOINTS TEST
  console.log('\n--- 8. Live Python Server Endpoints Test (Port 3099) ---');
  const pyPath = 'C:\\Users\\praja\\AppData\\Local\\Programs\\Python\\Python313\\python.exe';
  const serverProc = spawn(pyPath, ['server.py', '3099'], {
    cwd: ROOT,
    env: { ...process.env, PORT: '3099', RAZORPAY_KEY_SECRET: 'test_secret_for_audit_verification' }
  });

  // Wait for server to start
  await new Promise(r => setTimeout(r, 1500));

  function httpGet(urlPath) {
    return new Promise((resolve) => {
      http.get(`http://127.0.0.1:3099${urlPath}`, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({ status: res.statusCode, data }));
      }).on('error', (err) => resolve({ status: 500, error: err.message }));
    });
  }

  function httpPost(urlPath, payload) {
    return new Promise((resolve) => {
      const postData = JSON.stringify(payload);
      const req = http.request(`http://127.0.0.1:3099${urlPath}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({ status: res.statusCode, data }));
      });
      req.on('error', (err) => resolve({ status: 500, error: err.message }));
      req.write(postData);
      req.end();
    });
  }

  try {
    const health = await httpGet('/api/health');
    assert(health.status === 200 && health.data.includes('healthy'), 'Server /api/health responds 200 OK');

    const blockedOrdersFile = await httpGet('/orders_data.json');
    assert(blockedOrdersFile.status === 404, 'Server blocks direct GET /orders_data.json with 404');

    const blockedEnv = await httpGet('/.env');
    assert(blockedEnv.status === 404, 'Server blocks direct GET /.env with 404');

    const blockedPy = await httpGet('/server.py');
    assert(blockedPy.status === 404, 'Server blocks direct GET /server.py with 404');

    const singleOrder = await httpGet('/api/orders?order_number=DL-2026-122435');
    assert(singleOrder.status === 200 && singleOrder.data.includes('DL-2026-122435'), 'Server /api/orders?order_number=... returns targeted order');

    // Test payment signature verification mismatch rejection
    const badSigVerify = await httpPost('/api/verify-payment', {
      razorpay_order_id: 'order_live_999999',
      razorpay_payment_id: 'pay_live_999999',
      razorpay_signature: 'invalid_forged_cryptographic_signature',
      order_data: { total: 500 }
    });
    assert(badSigVerify.status === 400 && badSigVerify.data.includes('signature'), 'Server rejects invalid Razorpay HMAC signature with 400');

  } finally {
    serverProc.kill();
  }

  console.log('\n======================================================');
  console.log(`TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

run();
