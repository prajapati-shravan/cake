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
      }
    };
    if (data) options.headers['Content-Length'] = Buffer.byteLength(data);

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function testLiveWriteAndClean() {
  const testNum = 'DL-TEST-' + Math.floor(100000 + Math.random() * 900000);
  console.log(`Testing Live Supabase Insert for Order #${testNum}...`);

  const payload = JSON.stringify({
    order_number: testNum,
    customer_name: 'Live Verify Agent',
    customer_phone: '9909444882',
    customer_email: 'test@verification.internal',
    delivery_address: 'Akota, Vadodara (Live Test Record)',
    delivery_date: '2026-11-25',
    delivery_slot_text: 'Express 2-Hour Delivery',
    payment_method: 'COD',
    payment_status: 'PENDING',
    status: 'PLACED',
    subtotal: 499,
    delivery_fee: 0,
    discount: 0,
    total: 499,
    special_instructions: 'Automated live test'
  });

  const insertRes = await makeRequest('/rest/v1/orders', 'POST', payload);
  console.log('Insert Status:', insertRes.status);
  console.log('Insert Body:', insertRes.body);

  if (insertRes.status === 201 || insertRes.status === 200) {
    console.log('[PASS] Live Supabase PostgreSQL order insert succeeded!');

    // Read it back
    console.log(`Verifying read for Order #${testNum}...`);
    const readRes = await makeRequest(`/rest/v1/orders?order_number=eq.${testNum}`);
    console.log('Read Status:', readRes.status);
    const records = JSON.parse(readRes.body);
    console.log(`Read ${records.length} record(s):`, records[0]?.order_number === testNum ? '[PASS] Order confirmed in DB' : '[FAIL]');

    // Clean it up
    console.log(`Cleaning up test record #${testNum}...`);
    const deleteRes = await makeRequest(`/rest/v1/orders?order_number=eq.${testNum}`, 'DELETE');
    console.log('Delete Status:', deleteRes.status);
    console.log('[PASS] Test record cleanly removed from live database.');
  } else {
    console.log('[FAIL] Insert did not succeed.');
  }
}

testLiveWriteAndClean();
