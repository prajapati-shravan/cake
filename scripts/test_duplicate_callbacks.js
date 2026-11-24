/**
 * Test Duplicate Payment Callback & Unverified Payment Handling
 */

const http = require('http');

function postJson(port, path, data) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data);
    const req = http.request({
      hostname: '127.0.0.1',
      port: port,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      },
      timeout: 5000
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

function getJson(port, path) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: '127.0.0.1',
      port: port,
      path: path,
      method: 'GET',
      timeout: 5000
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function runTest() {
  const { spawn } = require('child_process');
  const path = require('path');
  const ROOT = path.resolve(__dirname, '..');
  const pyPath = 'C:\\Users\\praja\\AppData\\Local\\Programs\\Python\\Python313\\python.exe';

  const serverProc = spawn(pyPath, ['server.py'], {
    cwd: ROOT,
    env: { ...process.env, PORT: '3098', RAZORPAY_KEY_SECRET: 'test_secret_for_audit_verification' }
  });
  await new Promise(r => setTimeout(r, 1500));

  try {
    console.log('--- 1. Testing Duplicate Payment Callbacks ---');
    const testOrdNum = 'DL-DUP-' + Date.now();
    const orderData = {
      order_number: testOrdNum,
      customer: {
        name: 'Duplicate Test',
        phone: '9909444882',
        email: 'dup@test.internal',
        address: 'Vadodara'
      },
      deliveryDate: '2026-11-25',
      deliverySlotText: 'Evening (4:00 PM – 7:00 PM)',
      items: [{ name: 'Velvet Rose', price: 899, qty: 1 }],
      total: 899
    };

    const paymentPayload = {
      razorpay_order_id: 'order_test_dup',
      razorpay_payment_id: 'pay_test_dup_' + Date.now(),
      order_data: orderData
    };

    // Callback 1
    const res1 = await postJson(3098, '/api/verify-payment', paymentPayload);
    console.log('Callback 1 Status:', res1.status, res1.data?.success ? '[PASS]' : '[FAIL]');

    // Callback 2 (identical duplicate call)
    const res2 = await postJson(3098, '/api/verify-payment', paymentPayload);
    console.log('Callback 2 Status (Duplicate):', res2.status, res2.data?.success ? '[PASS]' : '[FAIL]');

    // Query orders to verify count
    const listRes = await getJson(3098, '/api/orders');
    const allOrders = listRes.data?.orders || [];
    const matchingOrders = allOrders.filter(o => o.order_number === testOrdNum);
    console.log(`Matching orders found for ${testOrdNum}: ${matchingOrders.length}`);
    if (matchingOrders.length === 1) {
      console.log('  -> [PASS] Duplicate callback handled idempotently. Exactly 1 order created, not duplicated.');
    } else {
      console.log('  -> [FAIL] Duplicate orders created: count = ' + matchingOrders.length);
    }

    console.log('\n--- 2. Testing Unverified Bad Signature Payment ---');
    const badSigPayload = {
      razorpay_order_id: 'order_real_123',
      razorpay_payment_id: 'pay_real_456',
      razorpay_signature: 'invalid_forged_signature_000',
      order_data: {
        order_number: 'DL-FAKE-' + Date.now(),
        total: 1000
      }
    };

    // If RAZORPAY_KEY_SECRET is configured, it must return 400
    const badRes = await postJson(3098, '/api/verify-payment', badSigPayload);
    console.log('Bad signature response status:', badRes.status);
    console.log('Bad signature response body:', badRes.data || badRes.body);

  } finally {
    serverProc.kill();
  }
}

runTest().catch(console.error);
