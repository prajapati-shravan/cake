const https = require('https');

const SUPABASE_URL = 'https://fccisnncmndbjckpaebm.supabase.co';
const SUPABASE_KEY = 'sb_publishable_XSUEFzUa1bB0tGbtGjixYg_v1eQGeik';

function inspectOrdersTable() {
  const url = new URL('/rest/v1/orders?select=*&limit=1', SUPABASE_URL);
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
      console.log('HTTP Status:', res.statusCode);
      try {
        const data = JSON.parse(body);
        if (Array.isArray(data) && data.length > 0) {
          console.log('Existing columns in public.orders:');
          console.log(Object.keys(data[0]));
          console.log('\nSample record:', JSON.stringify(data[0], null, 2));
        } else {
          console.log('No rows returned or empty array:', body);
        }
      } catch (e) {
        console.error('Parse error:', body);
      }
    });
  });
  req.on('error', console.error);
  req.end();
}

inspectOrdersTable();
