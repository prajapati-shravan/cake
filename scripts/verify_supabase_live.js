/**
 * Verification of Live Supabase PostgreSQL Connection
 * Tests actual reads and writes to https://fccisnncmndbjckpaebm.supabase.co
 * without modifying or corrupting real production data.
 */

const https = require('https');

const SUPABASE_URL = 'https://fccisnncmndbjckpaebm.supabase.co';
const SUPABASE_KEY = 'sb_publishable_XSUEFzUa1bB0tGbtGjixYg_v1eQGeik';

function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, SUPABASE_URL);
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      timeout: 8000
    };

    if (data) {
      options.headers['Content-Length'] = Buffer.byteLength(data);
    }

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: body
        });
      });
    });

    req.on('error', err => reject(err));
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timed out after 8000ms'));
    });

    if (data) {
      req.write(data);
    }
    req.end();
  });
}

async function runLiveVerification() {
  console.log('======================================================');
  console.log('       LIVE SUPABASE ENDPOINT VERIFICATION');
  console.log('======================================================\n');
  console.log(`Endpoint: ${SUPABASE_URL}`);

  // Test 1: REST Root / OpenAPI discovery
  try {
    const rootRes = await makeRequest('/rest/v1/');
    console.log(`[1] Supabase REST Root /rest/v1/ Status: HTTP ${rootRes.statusCode}`);
    if (rootRes.statusCode === 200) {
      console.log('  -> [PASS] Supabase REST API gateway is reachable and responding.');
    } else {
      console.log(`  -> [NOTICE] Response code: ${rootRes.statusCode}`);
    }
  } catch (err) {
    console.error('  -> [FAIL] Network error connecting to Supabase:', err.message);
  }

  // Test 2: Read from 'cakes' table
  try {
    const cakesRes = await makeRequest('/rest/v1/cakes?select=*&limit=5');
    console.log(`\n[2] Supabase 'cakes' table read: HTTP ${cakesRes.statusCode}`);
    if (cakesRes.statusCode === 200) {
      const cakes = JSON.parse(cakesRes.body);
      console.log(`  -> [PASS] Read successful! Fetched ${cakes.length} cakes from live database.`);
      if (cakes.length > 0) {
        console.log(`  -> Sample cake: "${cakes[0].name}" (Price: ₹${cakes[0].price})`);
      }
    } else {
      console.log(`  -> [NOTICE] Status: ${cakesRes.statusCode}, Body: ${cakesRes.body.slice(0, 150)}`);
    }
  } catch (err) {
    console.error('  -> [FAIL] Error reading cakes table:', err.message);
  }

  // Test 3: Read from 'orders' table
  try {
    const ordersRes = await makeRequest('/rest/v1/orders?select=id,order_number,status,total&limit=3');
    console.log(`\n[3] Supabase 'orders' table read: HTTP ${ordersRes.statusCode}`);
    if (ordersRes.statusCode === 200) {
      const orders = JSON.parse(ordersRes.body);
      console.log(`  -> [PASS] Read successful! Fetched ${orders.length} order records.`);
      if (orders.length > 0) {
        console.log(`  -> Sample order: #${orders[0].order_number} (Status: ${orders[0].status}, Total: ₹${orders[0].total})`);
      }
    } else {
      console.log(`  -> [NOTICE] Status: ${ordersRes.statusCode}, Body: ${ordersRes.body.slice(0, 150)}`);
    }
  } catch (err) {
    console.error('  -> [FAIL] Error reading orders table:', err.message);
  }

  // Test 4: Write test (Insert a temporary isolated test order, then clean it up)
  const testOrderNum = 'TEST-VERIFY-' + Date.now();
  console.log(`\n[4] Supabase 'orders' table write: Attempting to insert test record #${testOrderNum}...`);
  try {
    const testOrderPayload = JSON.stringify({
      order_number: testOrderNum,
      customer_name: 'Verification Bot',
      customer_phone: '9876500000',
      customer_email: 'test@verification.internal',
      delivery_address: 'Alkapuri, Vadodara (Automated Verification)',
      delivery_date: '2026-11-25',
      delivery_slot_text: 'Express (Within 2 Hours)',
      payment_method: 'COD',
      payment_status: 'PENDING',
      status: 'pending',
      subtotal: 100,
      delivery_fee: 0,
      discount: 0,
      total: 100,
      special_instructions: 'Automated test record — ephemeral'
    });

    const insertRes = await makeRequest('/rest/v1/orders', 'POST', testOrderPayload);
    console.log(`  -> Insert HTTP Status: ${insertRes.statusCode}`);

    if (insertRes.statusCode === 201 || insertRes.statusCode === 200) {
      console.log('  -> [PASS] Write successful! Order record created in Supabase PostgreSQL.');

      // Clean up test order immediately
      console.log(`  -> Cleaning up test record #${testOrderNum}...`);
      const deleteRes = await makeRequest(`/rest/v1/orders?order_number=eq.${testOrderNum}`, 'DELETE');
      console.log(`  -> Cleanup HTTP Status: ${deleteRes.statusCode}`);
      if (deleteRes.statusCode === 200 || deleteRes.statusCode === 204) {
        console.log('  -> [PASS] Test record cleanly deleted. Production data untouched.');
      } else {
        console.log(`  -> Cleanup notice: ${deleteRes.body.slice(0, 100)}`);
      }
    } else {
      console.log(`  -> [NOTICE] Write response: ${insertRes.statusCode} — ${insertRes.body.slice(0, 200)}`);
    }
  } catch (err) {
    console.error('  -> Error during write verification:', err.message);
  }
}

runLiveVerification();
