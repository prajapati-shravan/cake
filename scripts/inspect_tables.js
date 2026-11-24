const https = require('https');

const SUPABASE_URL = 'https://fccisnncmndbjckpaebm.supabase.co';
const SUPABASE_KEY = 'sb_publishable_XSUEFzUa1bB0tGbtGjixYg_v1eQGeik';

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, SUPABASE_URL);
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname + url.search,
      method: 'GET',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, body });
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function inspect() {
  console.log('--- Checking public.products table ---');
  const prodRes = await makeRequest('/rest/v1/products?select=*&limit=3');
  console.log('products HTTP Status:', prodRes.status);
  if (prodRes.status === 200) {
    const prods = JSON.parse(prodRes.body);
    console.log(`Found ${prods.length} products:`);
    prods.forEach(p => console.log(` - ID: ${p.id}, Name: ${p.name}, Price: ₹${p.price || p.base_price}`));
  }

  console.log('\n--- Checking existing orders values ---');
  const ordRes = await makeRequest('/rest/v1/orders?select=status,payment_status,payment_method&limit=20');
  console.log('orders HTTP Status:', ordRes.status);
  if (ordRes.status === 200) {
    const orders = JSON.parse(ordRes.body);
    const statuses = new Set(orders.map(o => o.status));
    const payStatuses = new Set(orders.map(o => o.payment_status));
    const payMethods = new Set(orders.map(o => o.payment_method));
    console.log('Observed statuses:', Array.from(statuses));
    console.log('Observed payment_statuses:', Array.from(payStatuses));
    console.log('Observed payment_methods:', Array.from(payMethods));
  }
}

inspect();
