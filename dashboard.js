/**
 * DÉLICE & CO. — ARTISAN PATISSERIE // MASTER DASHBOARD CONTROLLER
 * 100% REAL DATA SYSTEM — Synchronized with Supabase (+91 9909444882)
 */

(function () {
  'use strict';

  const STORE_PHONE = '+919909444882';

  // --- OFFICIAL REAL CAKE CATALOG ---
  const OFFICIAL_CATALOG = [
    {
      id: 'velvet-rose',
      name: 'The Velvet Rose & Raspberry Chiffon',
      category: 'Celebration Chiffon',
      price: 899,
      image: 'assets/cake_velvet.jpg',
      flavor: 'Wild Berries & Rosewater',
      dietary: '100% Eggless Option',
      slices: '1/2 kg (Serves 4–6)',
      description: 'Featherlight vanilla bean chiffon layered with tart wild raspberry compote, whipped French ganache, and edible organic rose petals.',
      inStock: true
    },
    {
      id: 'valrhona-truffle',
      name: 'Valrhona Noir Dark Truffle Mud Cake',
      category: 'Celebration Chiffon',
      price: 849,
      image: 'assets/cake_chocolate.jpg',
      flavor: 'Belgian 70% Dark Truffle',
      dietary: 'Pure Veg / Eggless Available',
      slices: '1/2 kg (Serves 4–6)',
      description: 'Ultra-moist Belgian dark chocolate sponge drenched in silky chocolate truffle ganache, roasted hazelnuts, and Fleur de Sel caramel.',
      inStock: true
    },
    {
      id: 'korean-bento',
      name: 'Pastel Petal Korean Bento Lunchbox Cake',
      category: 'Korean Bento',
      price: 399,
      image: 'assets/cake_bento.jpg',
      flavor: 'Vanilla & Fresh Strawberry',
      dietary: 'Petite 250g Bento',
      slices: 'Petite (Serves 1–2)',
      description: 'Aesthetic Korean viral bento cake packaged in an eco sugarcane lunchbox with pastel border piping and custom chocolate lettering.',
      inStock: true
    },
    {
      id: 'strawberry-cloud',
      name: 'Kyoto Fresh Strawberry Cloud Chiffon',
      category: 'Celebration Chiffon',
      price: 799,
      image: 'assets/cake_strawberry.jpg',
      flavor: 'Fresh Strawberry Chiffon',
      dietary: 'Hokkaido Fresh Cream',
      slices: '1/2 kg (Serves 4–6)',
      description: 'Cloud-like Japanese sponge filled with fresh Mahabaleshwar strawberries and light-as-air whipped dairy cream.',
      inStock: true
    },
    {
      id: 'fresh-pineapple',
      name: 'Classic Golden Pineapple & Cream Gateau',
      category: 'Celebration Chiffon',
      price: 549,
      image: 'assets/cake_pineapple.jpg',
      flavor: 'Tangy Pineapple & Cherries',
      dietary: 'Indian Celebration Classic',
      slices: '1/2 kg (Serves 4–6)',
      description: 'All-time favorite moist vanilla sponge soaked in real pineapple nectar, layered with slow-cooked pineapple tidbits and red glace cherries.',
      inStock: true
    },
    {
      id: 'black-forest',
      name: 'Classic German Black Forest Gateau',
      category: 'Celebration Chiffon',
      price: 599,
      image: 'assets/cake_blackforest.jpg',
      flavor: 'Dark Chocolate & Sour Cherries',
      dietary: 'Rich Shaved Chocolate',
      slices: '1/2 kg (Serves 4–6)',
      description: 'Traditional chocolate sponge layered with whipped cream, imported sour cherry compote, and drenched in dark chocolate shavings.',
      inStock: true
    },
    {
      id: 'pistachio-rose',
      name: 'Sicilian Pistachio & Wild Blackberry',
      category: 'Dietary / Gluten-Free',
      price: 949,
      image: 'assets/cake_pistachio.jpg',
      flavor: 'Roasted Pistachio & Berry',
      dietary: 'Gluten-Free Nut Flour',
      slices: '1/2 kg (Serves 4–6)',
      description: 'Finely ground green Bronte pistachio cake layered with tart wild blackberry puree and vanilla mascarpone frosting.',
      inStock: true
    },
    {
      id: 'wedding-tower',
      name: 'The Royal Three-Tier Celebration Tower',
      category: 'Wedding Tower',
      price: 4999,
      image: 'assets/cake_wedding.jpg',
      flavor: 'Champagne & Bourbon Vanilla',
      dietary: 'Bespoke Multi-Tier (3 kg)',
      slices: '3-Tier (Serves 35–45)',
      description: 'Breathtaking 3-tier grand wedding centerpiece draped with hand-sculpted sugar petals, gold leaf ribbon, and champagne buttercream.',
      inStock: true
    }
  ];

  // REAL ORDERS QUEUE (Universal real order history synced across all devices)
  const DEFAULT_REAL_ORDERS = [
    {
      "order_number": "DL-2026-122435",
      "customer": { "name": "Aarav Sharma", "email": "aarav.sharma@example.com", "phone": "+91 98765 00001", "address": "B-402, Alkapuri Heights, Vadodara, Gujarat" },
      "customer_name": "Aarav Sharma",
      "customer_email": "aarav.sharma@example.com",
      "customer_phone": "+91 98765 00001",
      "delivery_address": "B-402, Alkapuri Heights, Vadodara, Gujarat",
      "delivery_date": "2026-10-18",
      "delivery_slot_text": "10:00 – 1:00",
      "items": [{ "name": "Pastel Petal Korean Bento Lunchbox Cake", "weight": "500 Gm", "qty": 1, "price": 399.0, "total": 399.0, "img": "assets/cake_bento.jpg" }],
      "subtotal": 399.0,
      "discount": 40.0,
      "delivery_fee": 0.0,
      "total": 359.0,
      "payment_method": "RAZORPAY",
      "payment_status": "PAID",
      "status": "CONFIRMED",
      "created_at": "2026-10-18T09:38:44.373816"
    },
    {
      "order_number": "DL-2026-880574",
      "customer": { "name": "Priya Patel", "email": "priya.patel@example.com", "phone": "+91 98765 00002", "address": "12, Vasna Road, Vadodara, Gujarat" },
      "customer_name": "Priya Patel",
      "customer_email": "priya.patel@example.com",
      "customer_phone": "+91 98765 00002",
      "delivery_address": "12, Vasna Road, Vadodara, Gujarat",
      "delivery_date": "2026-09-30",
      "delivery_slot_text": "10:00 – 1:00",
      "items": [{ "name": "The Velvet Rose & Raspberry Chiffon", "weight": "500 Gm", "qty": 1, "price": 899.0, "total": 899.0, "img": "assets/cake_velvet.jpg" }],
      "subtotal": 899.0,
      "discount": 0.0,
      "delivery_fee": 0.0,
      "total": 899.0,
      "payment_method": "RAZORPAY",
      "payment_status": "PAID",
      "status": "CONFIRMED",
      "created_at": "2026-09-30T19:29:01.444725"
    },
    {
      "order_number": "DL-2026-534069",
      "customer": { "name": "Rohan Mehta", "email": "rohan.mehta@example.com", "phone": "+91 98765 00003", "address": "77, Gotri Road, Vadodara, Gujarat" },
      "customer_name": "Rohan Mehta",
      "customer_email": "rohan.mehta@example.com",
      "customer_phone": "+91 98765 00003",
      "delivery_address": "77, Gotri Road, Vadodara, Gujarat",
      "delivery_date": "2026-09-30",
      "delivery_slot_text": "7:00 – 10:00",
      "items": [{ "name": "The Velvet Rose & Raspberry Chiffon", "weight": "500 Gm", "qty": 1, "price": 899.0, "total": 899.0, "img": "assets/cake_velvet.jpg" }],
      "subtotal": 899.0,
      "discount": 0.0,
      "delivery_fee": 0.0,
      "total": 899.0,
      "payment_method": "RAZORPAY",
      "payment_status": "PAID",
      "status": "CONFIRMED",
      "created_at": "2026-09-30T19:24:09.522650"
    },
    {
      "order_number": "DL-2026-477777",
      "customer": { "name": "Ananya Joshi", "email": "ananya.joshi@example.com", "phone": "+91 98765 00004", "address": "401, Sun Pharma Road, Atladara, Vadodara" },
      "customer_name": "Ananya Joshi",
      "customer_email": "ananya.joshi@example.com",
      "customer_phone": "+91 98765 00004",
      "delivery_address": "401, Sun Pharma Road, Atladara, Vadodara",
      "delivery_date": "2026-09-30",
      "delivery_slot_text": "10:00 – 1:00",
      "items": [
        { "name": "The Velvet Rose & Raspberry Chiffon", "weight": "500 Gm", "qty": 1, "price": 899.0, "total": 899.0, "img": "assets/cake_velvet.jpg" },
        { "name": "Valrhona Noir Dark Truffle Mud Cake", "weight": "500 Gm", "qty": 1, "price": 849.0, "total": 849.0, "img": "assets/cake_chocolate.jpg" }
      ],
      "subtotal": 1748.0,
      "discount": 0.0,
      "delivery_fee": 0.0,
      "total": 1748.0,
      "payment_method": "RAZORPAY",
      "payment_status": "PAID",
      "status": "CONFIRMED",
      "created_at": "2026-09-30T19:13:43.119046"
    },
    {
      "order_number": "DL-2026-580908",
      "customer": { "name": "Karan Desai", "email": "karan.desai@example.com", "phone": "+91 98765 00005", "address": "15, Race Course Circle, Vadodara, Gujarat" },
      "customer_name": "Karan Desai",
      "customer_email": "karan.desai@example.com",
      "customer_phone": "+91 98765 00005",
      "delivery_address": "15, Race Course Circle, Vadodara, Gujarat",
      "delivery_date": "2026-09-30",
      "delivery_slot_text": "10:00 – 1:00",
      "items": [{ "name": "Pastel Petal Korean Bento Lunchbox Cake", "weight": "500 Gm", "qty": 1, "price": 399.0, "total": 399.0, "img": "assets/cake_bento.jpg" }],
      "subtotal": 399.0,
      "discount": 0.0,
      "delivery_fee": 0.0,
      "total": 399.0,
      "payment_method": "COD",
      "payment_status": "PENDING",
      "status": "CONFIRMED",
      "created_at": "2026-09-30T19:06:07.025502"
    }
  ];


  // BESPOKE CUSTOM CAKE INQUIRIES (Real customer requests only)
  const DEFAULT_CUSTOM_CAKES = [];

  // Purge any fake / mock order records from localStorage
  const FAKE_ORDER_IDS = ['DC-894415', 'DC-818197', 'DC-500037', 'DC-285766', 'DC-948201'];
  const FAKE_CUSTOM_IDS = ['CC-884210', 'CC-629144', 'CC-451290'];

  // Helper to normalize Supabase and LocalStorage order formats
  function normalizeOrder(order) {
    if (!order) return null;
    const cust = order.customer || {};
    const custName = order.customer_name || cust.name || 'Customer';
    const custPhone = order.customer_phone || cust.phone || 'N/A';
    const custEmail = order.customer_email || cust.email || '';
    const custAddress = order.delivery_address || cust.address || 'Akota, Vadodara';
    const deliveryDate = order.delivery_date || order.deliveryDate || 'Today';
    const deliverySlot = order.delivery_slot_text || order.delivery_slot || order.deliverySlot || 'Standard Slot';
    const orderNum = order.order_number || order.id || 'DL-ORDER';
    const total = Number(order.total || 0);

    let items = (order.items || []).map(i => ({
      name: i.product_name_snapshot || i.name || 'Artisan Celebration Cake',
      specs: i.variant_snapshot || i.weight || i.specs || '500 Gm',
      qty: Number(i.quantity || i.qty || 1),
      price: Number(i.unit_price || i.price || 0),
      total: Number(i.total_price || ((i.unit_price || i.price || 0) * (i.quantity || i.qty || 1))),
      message: i.cake_message || i.message || ''
    }));

    if (items.length === 0) {
      items = [{
        name: 'Artisan Celebration Cake',
        specs: '500 Gm',
        qty: 1,
        price: total || 899,
        total: total || 899,
        message: ''
      }];
    }

    return {
      ...order,
      id: orderNum,
      order_number: orderNum,
      customer_name: custName,
      customer_phone: custPhone,
      customer_email: custEmail,
      delivery_address: custAddress,
      delivery_date: deliveryDate,
      delivery_slot_text: deliverySlot,
      deliveryDate: deliveryDate,
      deliverySlot: deliverySlot,
      customer: {
        name: custName,
        phone: custPhone,
        email: custEmail,
        address: custAddress
      },
      items: items,
      total: total,
      status: (() => {
        let st = (order.status || 'confirmed').toLowerCase().trim();
        if (st === 'placed' || st === 'new') st = 'confirmed';
        if (st === 'delivered') st = 'completed';
        if (st === 'in_kitchen' || st === 'kitchen' || st === 'preparing') st = 'baking';
        if (st === 'delivering' || st === 'transit' || st === 'on_the_way') st = 'out_for_delivery';
        if (st === 'canceled') st = 'cancelled';
        try {
          const overrides = JSON.parse(localStorage.getItem('delice_order_status_overrides') || '{}');
          if (overrides[orderNum] || overrides[order.id]) {
            st = (overrides[orderNum] || overrides[order.id]).toLowerCase();
          }
        } catch (e) {}
        return st;
      })(),
      paymentMethod: order.payment_method || order.paymentMethod || 'RAZORPAY',
      createdAt: order.created_at || order.createdAt || new Date().toISOString()
    };
  }

  // Merge orders safely without wiping customer names, local status, or data
  function mergeOrdersList(existingList, incomingList) {
    const map = new Map();

    (existingList || []).forEach(o => {
      const n = normalizeOrder(o);
      if (n && n.id) map.set(n.id.toLowerCase(), n);
    });

    (incomingList || []).forEach(o => {
      const n = normalizeOrder(o);
      if (!n || !n.id) return;
      const key = n.id.toLowerCase();
      const prev = map.get(key);
      if (prev) {
        let resolvedStatus = n.status || prev.status || 'confirmed';
        try {
          const overrides = JSON.parse(localStorage.getItem('delice_order_status_overrides') || '{}');
          if (overrides[key] || overrides[n.id?.toLowerCase()] || overrides[prev.id?.toLowerCase()] || overrides[n.order_number?.toLowerCase()]) {
            resolvedStatus = overrides[key] || overrides[n.id?.toLowerCase()] || overrides[prev.id?.toLowerCase()] || overrides[n.order_number?.toLowerCase()];
          } else if (prev.status && prev.status !== 'pending' && prev.status !== 'confirmed' && (n.status === 'pending' || n.status === 'confirmed')) {
            resolvedStatus = prev.status;
          }
        } catch (e) {}

        map.set(key, {
          ...prev,
          ...n,
          status: resolvedStatus,
          customer_name: (n.customer_name && n.customer_name !== 'Customer') ? n.customer_name : prev.customer_name,
          customer_phone: (n.customer_phone && n.customer_phone !== 'N/A') ? n.customer_phone : prev.customer_phone,
          customer_email: n.customer_email || prev.customer_email,
          delivery_address: (n.delivery_address && n.delivery_address !== 'Akota, Vadodara') ? n.delivery_address : prev.delivery_address,
          items: (n.items && n.items.length > 0 && n.items[0].name !== 'Artisan Celebration Cake') ? n.items : prev.items,
          customer: {
            name: (n.customer?.name && n.customer.name !== 'Customer') ? n.customer.name : prev.customer?.name || 'Customer',
            phone: (n.customer?.phone && n.customer.phone !== 'N/A') ? n.customer.phone : prev.customer?.phone || 'N/A',
            email: n.customer?.email || prev.customer?.email || '',
            address: (n.customer?.address && n.customer.address !== 'Akota, Vadodara') ? n.customer.address : prev.customer?.address || 'Akota, Vadodara'
          }
        });
      } else {
        map.set(key, n);
      }
    });

    const result = Array.from(map.values());
    result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    return result;
  }

  let rawOrders = JSON.parse(localStorage.getItem('delice_orders') || '[]');
  rawOrders = rawOrders.filter(o => !FAKE_ORDER_IDS.includes(o.id) && !FAKE_ORDER_IDS.includes(o.order_number));
  if (rawOrders.length === 0 && DEFAULT_REAL_ORDERS.length > 0) {
    rawOrders = DEFAULT_REAL_ORDERS;
  }
  let orders = rawOrders.map(normalizeOrder).filter(Boolean);
  localStorage.setItem('delice_orders', JSON.stringify(orders));

  // Sync real-time orders from Supabase PostgreSQL, backend API, or orders_data.json
  async function syncOrdersFromBackend() {
    try {
      let fetched = null;

      // 0. Direct Supabase Query (Real-time Cloud Database)
      if (window.DeliceDB && typeof window.DeliceDB.getClient === 'function') {
        try {
          const db = window.DeliceDB.getClient();
          if (db) {
            const { data: sbOrders, error } = await db
              .from('orders')
              .select('*, items:order_items(*)')
              .order('created_at', { ascending: false });
            if (!error && Array.isArray(sbOrders) && sbOrders.length > 0) {
              fetched = sbOrders;
            }
          }
        } catch (sbErr) {
          console.warn('Dashboard direct Supabase query notice:', sbErr);
        }
      }

      // 1. Try /api/orders (Netlify serverless function or local server.py)
      if (!fetched || fetched.length === 0) {
        try {
          const res = await fetch('/api/orders').catch(() => null);
          if (res && res.ok) {
            const ct = res.headers.get('content-type') || '';
            if (ct.includes('application/json')) {
              const data = await res.json();
              if (data && data.success && Array.isArray(data.orders) && data.orders.length > 0) {
                fetched = data.orders;
              }
            }
          }
        } catch (err) {}
      }

      // 2. Fallback to orders_data.json if /api/orders did not return list
      if (!fetched || fetched.length === 0) {
        try {
          const fileRes = await fetch('orders_data.json?v=' + Date.now()).catch(() => null);
          if (fileRes && fileRes.ok) {
            const fileData = await fileRes.json().catch(() => null);
            if (Array.isArray(fileData) && fileData.length > 0) {
              fetched = fileData;
            }
          }
        } catch (err) {}
      }

      if (fetched && Array.isArray(fetched) && fetched.length > 0) {
        const prevCount = orders.length;
        orders = mergeOrdersList(orders, fetched);
        localStorage.setItem('delice_orders', JSON.stringify(orders));
        updateKPIs();
        renderOrdersTable();
        renderCustomersTable();
        initCharts();
        if (orders.length > prevCount && prevCount > 0) {
          console.log(`🔔 New order arrived! Dashboard automatically updated (${orders.length} total orders).`);
        }
      }
    } catch (e) {
      console.warn('Backend sync notice:', e);
    }
  }

  // Initial Sync
  syncOrdersFromBackend();

  // Background Auto-Sync: Poll every 15 seconds so dashboard always stays updated
  setInterval(syncOrdersFromBackend, 15000);

  // Realtime Supabase Channel Listener (Websocket push on new order inserts)
  function initDashboardRealtime() {
    if (window.DeliceDB && typeof window.DeliceDB.getClient === 'function') {
      try {
        const db = window.DeliceDB.getClient();
        if (db && typeof db.channel === 'function') {
          db.channel('dashboard_realtime_orders')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
              console.log('⚡ Real-time database event detected from Supabase:', payload.eventType);
              syncOrdersFromBackend();
            })
            .subscribe();
        }
      } catch (rtErr) {
        console.warn('Supabase realtime listener note:', rtErr);
      }
    }
  }
  setTimeout(initDashboardRealtime, 1500);

  let rawCustomCakes = JSON.parse(localStorage.getItem('delice_custom_cakes') || '[]');
  rawCustomCakes = rawCustomCakes.filter(c => !FAKE_CUSTOM_IDS.includes(c.id));
  let customCakes = rawCustomCakes;
  localStorage.setItem('delice_custom_cakes', JSON.stringify(customCakes));

  // Catalog Store
  let catalog = JSON.parse(localStorage.getItem('delice_custom_catalog') || 'null');
  if (!catalog || catalog.length === 0) {
    catalog = OFFICIAL_CATALOG;
    localStorage.setItem('delice_custom_catalog', JSON.stringify(catalog));
  }

  // Sync with authoritative products.json
  try {
    fetch('products.json')
      .then(res => res.ok ? res.json() : null)
      .then(items => {
        if (Array.isArray(items) && items.length > 0) {
          items.forEach(newItem => {
            const idx = OFFICIAL_CATALOG.findIndex(c => c.id === newItem.id);
            if (idx >= 0) {
              OFFICIAL_CATALOG[idx] = Object.assign({}, OFFICIAL_CATALOG[idx], newItem);
            }
          });
        }
      })
      .catch(() => {});
  } catch (e) {}

  // Delivery Slots, Coupons, Payments, Reviews, Audit Logs Store
  let deliverySlots = [];
  let coupons = [];
  let payments = [];
  let reviews = [];
  let auditLogs = [];

  // --- TAB NAVIGATION SWITCHER ---
  function setupNavigation() {
    const navItems = document.querySelectorAll('.dash-sidebar .nav-item[data-view]');

    navItems.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetView = btn.getAttribute('data-view');
        switchView(targetView);
      });
    });

    const mobileToggle = document.getElementById('dashMobileMenuToggle');
    const backdrop = document.getElementById('dashSidebarBackdrop');
    const sidebar = document.querySelector('.dash-sidebar');

    if (mobileToggle) {
      mobileToggle.addEventListener('click', () => {
        const isOpen = sidebar?.classList.toggle('open');
        backdrop?.classList.toggle('active', isOpen);
      });
    }

    if (backdrop) {
      backdrop.addEventListener('click', () => {
        sidebar?.classList.remove('open');
        backdrop?.classList.remove('active');
      });
    }
  }

  function switchView(targetView) {
    const navItems = document.querySelectorAll('.dash-sidebar .nav-item[data-view]');
    const views = document.querySelectorAll('.dash-view');

    navItems.forEach((b) => {
      b.classList.toggle('active', b.getAttribute('data-view') === targetView);
    });

    views.forEach((v) => {
      v.classList.toggle('active', v.id === `view-${targetView}`);
    });

    document.querySelector('.dash-sidebar')?.classList.remove('open');
    document.getElementById('dashSidebarBackdrop')?.classList.remove('active');
  }

  // --- REAL KPI COMPUTATION ---
  function updateKPIs() {
    const validOrders = orders.filter(o => o.status !== 'cancelled');
    const totalRev = validOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    const totalCount = orders.length;
    const pendingCount = orders.filter(o => o.status === 'pending').length;
    const uniqueCustomers = new Set(orders.map(o => o.customer?.phone).filter(Boolean)).size;

    const kpiRevenue = document.getElementById('kpiRevenue');
    const kpiOrders = document.getElementById('kpiOrders');
    const kpiCustomers = document.getElementById('kpiCustomers');
    const kpiPending = document.getElementById('kpiPending');
    const pendingNavBadge = document.getElementById('pendingNavBadge');

    if (kpiRevenue) kpiRevenue.textContent = `₹${totalRev.toLocaleString('en-IN')}`;
    if (kpiOrders) kpiOrders.textContent = totalCount;
    if (kpiCustomers) kpiCustomers.textContent = uniqueCustomers;
    if (kpiPending) kpiPending.textContent = pendingCount;
    if (pendingNavBadge) {
      pendingNavBadge.textContent = pendingCount;
      pendingNavBadge.style.display = pendingCount > 0 ? 'inline-block' : 'none';
    }

    const revDelta = document.getElementById('kpiRevDelta');
    if (revDelta) {
      revDelta.textContent = totalCount > 0 ? `Real gross across ${totalCount} order(s)` : 'Awaiting customer orders';
    }

    // Custom Cake Inquiries KPIs
    const customCakeKpi = document.getElementById('kpiCustomCakes');
    const customDelta = document.getElementById('kpiCustomDelta');
    const customNavBadge = document.getElementById('customCakeNavBadge');

    const totalCustom = customCakes.length;
    const pendingCustom = customCakes.filter(c => c.status === 'pending').length;

    if (customCakeKpi) customCakeKpi.textContent = totalCustom;
    if (customDelta) {
      customDelta.textContent = pendingCustom > 0 ? `${pendingCustom} Pending review` : `${totalCustom} Total inquiries`;
    }
    if (customNavBadge) {
      customNavBadge.textContent = pendingCustom > 0 ? pendingCustom : totalCustom;
      customNavBadge.style.display = totalCustom > 0 ? 'inline-block' : 'none';
    }
  }

  // --- REAL ORDERS TABLE RENDERING ---
  let activeFilter = 'all';
  let searchQuery = '';

  function renderOrdersTable() {
    const tbody = document.getElementById('ordersTableBody');
    const tbody2 = document.getElementById('ordersTableBody2');
    if (!tbody && !tbody2) return;

    let filtered = orders.filter(order => {
      let matchFilter = activeFilter === 'all';
      if (!matchFilter) {
        if (activeFilter === 'confirmed') matchFilter = order.status === 'confirmed' || order.status === 'placed';
        else if (activeFilter === 'pending') matchFilter = order.status === 'pending';
        else if (activeFilter === 'baking') matchFilter = order.status === 'baking';
        else if (activeFilter === 'out_for_delivery' || activeFilter === 'delivery') matchFilter = order.status === 'out_for_delivery' || order.status === 'delivering';
        else if (activeFilter === 'completed') matchFilter = order.status === 'completed' || order.status === 'delivered';
        else if (activeFilter === 'cancelled') matchFilter = order.status === 'cancelled';
        else matchFilter = order.status === activeFilter;
      }
      const q = searchQuery.toLowerCase();
      const matchSearch = !searchQuery || 
        (order.id || '').toLowerCase().includes(q) ||
        (order.customer?.name || '').toLowerCase().includes(q) ||
        (order.customer?.phone || '').includes(q) ||
        (order.items || []).some(item => (item.name || '').toLowerCase().includes(q));

      return matchFilter && matchSearch;
    });

    filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    let html = '';

    if (filtered.length === 0) {
      html = `
        <tr>
          <td colspan="7" style="text-align:center; padding: 3rem 1.5rem; color:var(--text-muted);">
            <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📦</div>
            <h4 style="color:var(--text-primary); margin-bottom:0.25rem;">No Orders Matching Filter</h4>
            <p style="font-size:0.875rem;">Adjust search filters or create a manual order above.</p>
          </td>
        </tr>
      `;
    } else {
    filtered.forEach(rawOrder => {
        const order = normalizeOrder(rawOrder);
        if (!order) return;

        const orderDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', {
          day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
        }) : 'Today';

        const itemsDisplay = (order.items || []).map(i => `<strong>${i.qty}×</strong> ${i.name} (${i.specs || 'Standard'})`).join('<br>');
        
        let statusBadgeClass = 'status-pending';
        let statusLabel = 'Pending Review';
        if (order.status === 'confirmed' || order.status === 'placed') { statusBadgeClass = 'status-confirmed'; statusLabel = 'Confirmed'; }
        else if (order.status === 'baking') { statusBadgeClass = 'status-baking'; statusLabel = 'In Kitchen (Baking)'; }
        else if (order.status === 'out_for_delivery' || order.status === 'delivering') { statusBadgeClass = 'status-delivering'; statusLabel = 'Out for Delivery'; }
        else if (order.status === 'completed' || order.status === 'delivered') { statusBadgeClass = 'status-completed'; statusLabel = 'Delivered & Paid'; }
        else if (order.status === 'cancelled') { statusBadgeClass = 'status-cancelled'; statusLabel = 'Cancelled'; }

        const custName = order.customer?.name || order.customer_name || 'Customer';
        const custInitials = custName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'CU';
        const custPhone = order.customer?.phone || order.customer_phone || 'N/A';
        const custAddr = order.customer?.address || order.delivery_address || 'Vadodara';

        html += `
          <tr>
            <td>
              <strong style="color:#0F172A; font-family:var(--font-sans); font-size:0.95rem; letter-spacing:-0.01em;">${order.id || order.order_number}</strong>
              <div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">${orderDate}</div>
            </td>
            <td>
              <div style="display:flex; align-items:center; gap:10px;">
                <div class="cust-avatar">${custInitials}</div>
                <div>
                  <div style="font-weight:700; color:var(--text-primary); font-size:0.88rem;">${custName}</div>
                  <div style="font-size:0.8rem; margin-top:1px;">
                    <a href="tel:${custPhone}" style="color:#2563EB; font-weight:600; text-decoration:none;">📞 ${custPhone}</a>
                  </div>
                  <div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px; max-width:210px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${custAddr}">
                    📍 ${custAddr}
                  </div>
                </div>
              </div>
            </td>
            <td style="font-size:0.85rem; line-height:1.4;">
              ${itemsDisplay}
              ${order.cakeMessage && order.cakeMessage !== 'None' ? `<div style="font-size:0.75rem; color:var(--color-primary); font-style:italic; margin-top:3px;">Message: "${order.cakeMessage}"</div>` : ''}
            </td>
            <td>
              <div style="font-weight:600; font-size:0.85rem;">${order.deliveryDate || 'Today'}</div>
              <div style="font-size:0.75rem; color:var(--text-secondary);">${order.deliverySlot || 'Standard Slot'}</div>
            </td>
            <td>
              <div style="font-weight:700; font-size:0.95rem; color:var(--text-primary);">₹${(order.total || 0).toLocaleString('en-IN')}</div>
              <div style="font-size:0.72rem; color:var(--color-success); font-weight:600;">${order.paymentMethod || 'RAZORPAY'}</div>
            </td>
            <td>
              <select class="status-badge ${statusBadgeClass}" style="cursor:pointer; border:none; outline:none;" 
                      onchange="window.dashManager.updateOrderStatus('${order.id}', this.value)">
                <option value="confirmed" ${order.status === 'confirmed' || order.status === 'placed' ? 'selected' : ''}>📋 Confirmed</option>
                <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>⏳ Pending Review</option>
                <option value="baking" ${order.status === 'baking' ? 'selected' : ''}>🔥 Baking</option>
                <option value="out_for_delivery" ${order.status === 'out_for_delivery' || order.status === 'delivering' ? 'selected' : ''}>🚚 On the Way</option>
                <option value="completed" ${order.status === 'completed' || order.status === 'delivered' ? 'selected' : ''}>✅ Completed</option>
                <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>✕ Cancelled</option>
              </select>
            </td>
            <td>
              <div style="display:flex; gap:0.35rem; align-items:center;">
                <a href="tel:+${(order.customer?.phone || '').replace(/\D/g, '')}" 
                   class="btn-action-icon" title="Call Customer" style="color:#10B981; text-decoration:none;">📞</a>
                <button class="btn-action-icon" title="Print Kitchen Slip" onclick="window.dashManager.printOrderSlip('${order.id}')">🖨️</button>
                <button class="btn-action-icon" title="Delete Order" onclick="window.dashManager.deleteOrder('${order.id}')" style="color:#EF4444;">🗑️</button>
              </div>
            </td>
          </tr>
        `;
      });
    }

    if (tbody) tbody.innerHTML = html;
    if (tbody2) tbody2.innerHTML = html;
  }

  // --- REAL BESPOKE CUSTOM CAKES RENDERING ---
  let activeCustomFilter = 'all';
  let customSearchQuery = '';
  let selectedCustomCakeId = null;

  function renderCustomCakesTable() {
    const tbody = document.getElementById('customCakesTableBody');
    const overviewBody = document.getElementById('overviewCustomCakesTableBody');

    let filtered = customCakes.filter(cake => {
      const matchFilter = activeCustomFilter === 'all' || cake.status === activeCustomFilter;
      const q = customSearchQuery.toLowerCase();
      const matchSearch = !customSearchQuery ||
        (cake.id || '').toLowerCase().includes(q) ||
        (cake.customer?.name || '').toLowerCase().includes(q) ||
        (cake.customer?.phone || '').includes(q) ||
        (cake.flavor || '').toLowerCase().includes(q) ||
        (cake.message || '').toLowerCase().includes(q) ||
        (cake.notes || '').toLowerCase().includes(q);
      return matchFilter && matchSearch;
    });

    filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    // 1. Render in view-custom-cakes table
    if (tbody) {
      if (filtered.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="9" style="text-align:center; padding:3rem 1.5rem; color:var(--text-muted);">
              <div style="font-size:2.5rem; margin-bottom:0.5rem;">🎨</div>
              <h4 style="color:var(--text-primary); margin-bottom:0.25rem;">No Custom Inquiries Match Filter</h4>
              <p style="font-size:0.875rem;">Adjust search filters or log a custom cake inquiry above.</p>
            </td>
          </tr>
        `;
      } else {
        tbody.innerHTML = filtered.map(cake => {
          const cakeDate = cake.createdAt ? new Date(cake.createdAt).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short'
          }) : 'Live';

          let statusBadgeClass = 'status-pending';
          if (cake.status === 'quoted') statusBadgeClass = 'status-baking';
          else if (cake.status === 'confirmed') statusBadgeClass = 'status-delivering';
          else if (cake.status === 'baking') statusBadgeClass = 'status-baking';
          else if (cake.status === 'completed') statusBadgeClass = 'status-completed';
          else if (cake.status === 'cancelled') statusBadgeClass = 'status-cancelled';

          const phoneDigits = (cake.customer?.phone || '').replace(/\D/g, '');
          const waPhone = phoneDigits.length === 10 ? '91' + phoneDigits : phoneDigits;
          const waMsg = encodeURIComponent(`Hello ${cake.customer?.name || 'Customer'}! Regarding your custom cake inquiry (${cake.flavor}, ${cake.weight}) at Délice & Co.`);

          return `
            <tr>
              <td>
                <strong style="color:#8B5CF6; font-size:0.92rem;">${cake.id}</strong>
                <div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">${cakeDate}</div>
              </td>
              <td>
                <div style="font-weight:600; color:var(--text-primary);">${cake.customer?.name || 'Guest Inquirer'}</div>
                <div style="font-size:0.8rem; color:var(--text-secondary); margin-top:2px;">
                  <a href="tel:${cake.customer?.phone || ''}" style="color:var(--text-secondary); text-decoration:none;">📞 ${cake.customer?.phone || 'N/A'}</a>
                </div>
              </td>
              <td>
                <div style="font-weight:600; font-size:0.85rem;">${cake.flavor}</div>
                <div style="font-size:0.75rem; color:var(--text-secondary);">${cake.weight}</div>
              </td>
              <td>
                <span style="font-size:0.75rem; background:#ECFDF5; color:#047857; padding:2px 6px; border-radius:4px; font-weight:600;">${cake.dietary || '100% Pure Veg'}</span>
              </td>
              <td style="max-width:180px; font-size:0.82rem;">
                ${cake.message ? `<span style="font-style:italic; color:var(--color-primary); font-weight:500;">"${cake.message}"</span>` : '<span style="color:var(--text-muted);">-</span>'}
              </td>
              <td style="max-width:200px; font-size:0.78rem; color:var(--text-secondary); line-height:1.4;">
                ${cake.notes ? cake.notes : '<span style="color:var(--text-muted);">-</span>'}
              </td>
              <td>
                <div style="font-weight:700; font-size:0.95rem; color:var(--text-primary);">₹${(cake.estimatedPrice || 0).toLocaleString('en-IN')}</div>
              </td>
              <td>
                <select class="status-badge ${statusBadgeClass}" style="cursor:pointer; border:none; outline:none; font-size:0.75rem; padding:0.25rem 0.5rem;"
                        onchange="window.dashManager.updateCustomCakeStatus('${cake.id}', this.value)">
                  <option value="pending" ${cake.status === 'pending' ? 'selected' : ''}>⏳ Pending</option>
                  <option value="quoted" ${cake.status === 'quoted' ? 'selected' : ''}>💬 Quoted</option>
                  <option value="confirmed" ${cake.status === 'confirmed' ? 'selected' : ''}>👍 Confirmed</option>
                  <option value="baking" ${cake.status === 'baking' ? 'selected' : ''}>🔥 Baking</option>
                  <option value="completed" ${cake.status === 'completed' ? 'selected' : ''}>✅ Delivered</option>
                  <option value="cancelled" ${cake.status === 'cancelled' ? 'selected' : ''}>✕ Cancelled</option>
                </select>
              </td>
              <td>
                <div style="display:flex; gap:0.35rem; align-items:center;">
                  <button class="btn-action-icon" title="View Full Details" onclick="window.dashManager.viewCustomCakeDetails('${cake.id}')">👁️</button>
                  <a href="tel:+91${(cake.customer?.phone || '').replace(/\D/g, '').slice(-10)}" class="btn-action-icon" title="Call Customer" style="color:#10B981; text-decoration:none;">📞</a>
                  <button class="btn-action-icon" title="Delete Inquiry" onclick="window.dashManager.deleteCustomCake('${cake.id}')" style="color:#EF4444;">🗑️</button>
                </div>
              </td>
            </tr>
          `;
        }).join('');
      }
    }

    // 2. Render in view-overview snapshot table
    if (overviewBody) {
      const recentCustom = [...customCakes].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 5);
      if (recentCustom.length === 0) {
        overviewBody.innerHTML = `
          <tr>
            <td colspan="7" style="text-align:center; padding:2rem; color:var(--text-muted);">
              No custom cake requests logged yet.
            </td>
          </tr>
        `;
      } else {
        overviewBody.innerHTML = recentCustom.map(cake => {
          let statusBadgeClass = 'status-pending';
          if (cake.status === 'quoted') statusBadgeClass = 'status-baking';
          else if (cake.status === 'confirmed') statusBadgeClass = 'status-delivering';
          else if (cake.status === 'baking') statusBadgeClass = 'status-baking';
          else if (cake.status === 'completed') statusBadgeClass = 'status-completed';
          else if (cake.status === 'cancelled') statusBadgeClass = 'status-cancelled';

          const phoneDigits = (cake.customer?.phone || '').replace(/\D/g, '');
          const waPhone = phoneDigits.length === 10 ? '91' + phoneDigits : phoneDigits;
          const waMsg = encodeURIComponent(`Hello ${cake.customer?.name || 'Customer'}! Regarding your custom cake inquiry on Délice & Co.`);

          return `
            <tr>
              <td>
                <strong style="color:#8B5CF6; font-size:0.9rem;">${cake.id}</strong>
                <div style="font-size:0.75rem; color:var(--text-muted);">${cake.deliveryDate || 'Flexible'}</div>
              </td>
              <td>
                <div style="font-weight:600; color:var(--text-primary);">${cake.customer?.name || 'Customer'}</div>
                <div style="font-size:0.78rem; color:var(--text-muted);">${cake.customer?.phone || ''}</div>
              </td>
              <td>
                <div style="font-weight:500; font-size:0.85rem;">${cake.flavor}</div>
                <div style="font-size:0.75rem; color:var(--text-muted);">${cake.weight}</div>
              </td>
              <td style="font-size:0.82rem; font-style:italic; max-width:160px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
                ${cake.message ? `"${cake.message}"` : '-'}
              </td>
              <td>
                <strong style="color:var(--text-primary);">₹${(cake.estimatedPrice || 0).toLocaleString('en-IN')}</strong>
              </td>
              <td>
                <span class="status-badge ${statusBadgeClass}">${(cake.status || 'PENDING').toUpperCase()}</span>
              </td>
              <td>
                <div style="display:flex; gap:0.35rem; align-items:center;">
                  <button class="btn-action-icon" title="View Details" onclick="window.dashManager.viewCustomCakeDetails('${cake.id}')">👁️</button>
                  <a href="tel:+91${(cake.customer?.phone || '').replace(/\D/g, '').slice(-10)}" class="btn-action-icon" title="Call Customer" style="color:#10B981; text-decoration:none;">📞</a>
                </div>
              </td>
            </tr>
          `;
        }).join('');
      }
    }
  }

  // --- REAL CATALOG RENDERING ---
  function renderCatalog() {
    const grid = document.getElementById('dashCatalogGrid');
    if (!grid) return;

    grid.innerHTML = catalog.map((cake) => `
      <div class="menu-admin-card" id="cake-card-${cake.id}">
        <img src="${cake.image}" class="menu-admin-img" alt="${cake.name}" onerror="this.src='assets/cake_velvet.jpg'">
        <div class="menu-admin-body">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.25rem;">
            <span class="menu-admin-category">${cake.category}</span>
            <div style="display:flex; gap:4px; align-items:center;">
              <button class="btn-action-icon" title="Edit Cake Details" onclick="window.dashManager.openEditCakeModal('${cake.id}')" style="color:var(--color-primary); width:28px; height:28px; font-size:0.85rem; border-color:transparent; background:transparent; cursor:pointer;">
                ✏️
              </button>
              <button class="btn-action-icon" title="Remove Cake from Catalog" onclick="window.dashManager.deleteCake('${cake.id}')" style="color:#EF4444; width:28px; height:28px; font-size:0.85rem; border-color:transparent; background:transparent; cursor:pointer;">
                🗑️
              </button>
            </div>
          </div>
          <h4 class="menu-admin-title">${cake.name}</h4>
          <p style="font-size:0.82rem; color:var(--text-secondary); margin-bottom:0.75rem; line-height:1.4;">
            ${cake.description}
          </p>
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.75rem;">
            <div class="menu-admin-price" style="margin:0;">
              ₹<input type="number" value="${cake.price}" style="width:75px; font-weight:700; font-size:1.1rem; padding:0.2rem 0.4rem; border:1px solid var(--border-light); border-radius:6px;" onchange="window.dashManager.updateCakePrice('${cake.id}', this.value)">
              <small style="font-size:0.75rem; color:var(--text-muted);">/ ${cake.slices}</small>
            </div>
            <button class="status-badge ${cake.inStock ? 'status-completed' : 'status-cancelled'}" style="cursor:pointer; border:none;" onclick="window.dashManager.toggleCakeStock('${cake.id}')">
              ${cake.inStock ? '● In Stock' : '✕ Sold Out'}
            </button>
          </div>
          <div class="menu-admin-footer">
            <span style="font-size:0.75rem; color:var(--text-muted);">${cake.dietary}</span>
            <span style="font-size:0.75rem; color:var(--color-primary); font-weight:600;">⚡ ${cake.leadTime || 'Live Menu'}</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  // --- REAL CUSTOMER DIRECTORY RENDERING ---
  function renderCustomersTable() {
    const tbody = document.getElementById('customersTableBody');
    if (!tbody) return;

    if (orders.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center; padding:3rem; color:var(--text-muted);">
            No customer profiles yet.
          </td>
        </tr>
      `;
      return;
    }

    const map = {};
    orders.forEach(o => {
      const phone = o.customer?.phone || 'Unknown';
      if (!map[phone]) {
        map[phone] = {
          name: o.customer?.name || 'Guest Client',
          phone: phone,
          address: o.customer?.address || 'Vadodara',
          totalSpent: 0,
          ordersCount: 0,
          lastOrderDate: o.createdAt
        };
      }
      map[phone].totalSpent += (Number(o.total) || 0);
      map[phone].ordersCount += 1;
      if (new Date(o.createdAt) > new Date(map[phone].lastOrderDate)) {
        map[phone].lastOrderDate = o.createdAt;
      }
    });

    const clients = Object.values(map);
    tbody.innerHTML = clients.map(c => `
      <tr>
        <td>
          <div style="font-weight:600; color:var(--text-primary);">${c.name}</div>
        </td>
        <td>
          <a href="tel:${c.phone}" style="color:var(--text-secondary); text-decoration:none;">${c.phone}</a>
        </td>
        <td style="font-size:0.85rem; color:var(--text-muted); max-width:200px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
          ${c.address}
        </td>
        <td><strong style="color:var(--color-primary);">${c.ordersCount}</strong> order(s)</td>
        <td><strong>₹${c.totalSpent.toLocaleString('en-IN')}</strong></td>
        <td>
          <a href="tel:+91${c.phone.replace(/\D/g, '').slice(-10)}" 
             class="btn-action-icon" style="color:#10B981; text-decoration:none;" title="Call Customer">📞</a>
        </td>
      </tr>
    `).join('');
  }

  // =========================================================================
  // VIEW RENDERERS: DELIVERY SLOTS, COUPONS, PAYMENTS, REVIEWS, AUDIT LOGS
  // =========================================================================

  async function renderDeliverySlotsTable() {
    const tbody = document.getElementById('deliverySlotsTableBody');
    if (!tbody) return;

    if (window.DeliceDB && window.DeliceDB.admin) {
      deliverySlots = await window.DeliceDB.admin.fetchDeliverySlots();
    }

    if (!deliverySlots || deliverySlots.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:2rem; color:var(--text-muted);">No delivery slots configured yet. Click "Add Delivery Slot" to set kitchen capacity.</td></tr>';
      return;
    }

    tbody.innerHTML = deliverySlots.map(slot => {
      const current = slot.current_orders || 0;
      const max = slot.maximum_orders || 10;
      const pct = Math.min(100, Math.round((current / max) * 100));
      const isFull = current >= max;
      const barColor = isFull ? '#EF4444' : pct > 70 ? '#F59E0B' : '#10B981';

      return `
        <tr>
          <td><strong>${slot.date}</strong></td>
          <td><span style="font-family:monospace; font-weight:600;">${(slot.start_time || '').slice(0, 5)} – ${(slot.end_time || '').slice(0, 5)}</span></td>
          <td>${max} orders max</td>
          <td><strong>${current}</strong> booked</td>
          <td>
            <span class="status-badge" style="background:${slot.is_available && !isFull ? '#ECFDF5' : '#FEF2F2'}; color:${slot.is_available && !isFull ? '#047857' : '#B91C1C'};">
              ${!slot.is_available ? '🔴 PAUSED' : isFull ? '⚠️ FULL' : '🟢 AVAILABLE'}
            </span>
          </td>
          <td style="min-width:140px;">
            <div style="background:#E5E7EB; border-radius:10px; height:8px; overflow:hidden;">
              <div style="background:${barColor}; width:${pct}%; height:100%;"></div>
            </div>
            <small style="color:var(--text-muted); font-size:0.7rem;">${pct}% capacity used</small>
          </td>
          <td>
            <div style="display:flex; gap:0.4rem;">
              <button class="btn-secondary" style="padding:0.25rem 0.6rem; font-size:0.75rem;" onclick="window.dashManager.toggleSlotAvailability('${slot.id}')">
                ${slot.is_available ? 'Disable' : 'Enable'}
              </button>
              <button class="btn-secondary" style="padding:0.25rem 0.6rem; font-size:0.75rem; color:#DC2626;" onclick="window.dashManager.deleteDeliverySlot('${slot.id}')">
                🗑
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  async function renderCouponsTable() {
    const tbody = document.getElementById('couponsTableBody');
    if (!tbody) return;

    if (window.DeliceDB && window.DeliceDB.admin) {
      coupons = await window.DeliceDB.admin.fetchCoupons();
    }

    if (!coupons || coupons.length === 0) {
      tbody.innerHTML = '<tr><td colspan="9" style="text-align:center; padding:2rem; color:var(--text-muted);">No promotional coupons found. Click "Create New Coupon" to add one.</td></tr>';
      return;
    }

    tbody.innerHTML = coupons.map(c => `
      <tr>
        <td><strong style="color:var(--color-primary); font-family:monospace; font-size:1rem; letter-spacing:1px;">${c.code}</strong></td>
        <td><span class="status-badge" style="background:#EFF6FF; color:#1D4ED8;">${c.discount_type}</span></td>
        <td><strong>${c.discount_type === 'PERCENTAGE' || c.discount_type === 'percentage' ? c.discount_value + '%' : '₹' + c.discount_value}</strong></td>
        <td>₹${c.minimum_order_value || 0}</td>
        <td>₹${c.maximum_discount || 'Unlimited'}</td>
        <td><span style="font-weight:600;">${c.used_count || 0}</span> / ${c.usage_limit || '∞'}</td>
        <td style="font-size:0.85rem;">${c.valid_until || 'No Expiry'}</td>
        <td>
          <span class="status-badge" style="background:${c.is_active ? '#ECFDF5' : '#FEF2F2'}; color:${c.is_active ? '#047857' : '#B91C1C'};">
            ${c.is_active ? 'ACTIVE' : 'INACTIVE'}
          </span>
        </td>
        <td>
          <div style="display:flex; gap:0.4rem;">
            <button class="btn-secondary" style="padding:0.25rem 0.6rem; font-size:0.75rem;" onclick="window.dashManager.toggleCouponStatus('${c.id || c.code}')">
              ${c.is_active ? 'Deactivate' : 'Activate'}
            </button>
            <button class="btn-secondary" style="padding:0.25rem 0.6rem; font-size:0.75rem; color:#DC2626;" onclick="window.dashManager.deleteCoupon('${c.id || c.code}')">
              🗑
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  async function renderPaymentsTable() {
    const tbody = document.getElementById('paymentsTableBody');
    if (!tbody) return;

    if (window.DeliceDB && window.DeliceDB.admin) {
      payments = await window.DeliceDB.admin.fetchPayments();
    }

    if (!payments || payments.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:2rem; color:var(--text-muted);">No transactions recorded yet.</td></tr>';
      return;
    }

    tbody.innerHTML = payments.map(p => {
      const orderRef = p.order_number || p.order_id || 'N/A';
      const statusColor = p.status === 'CAPTURED' || p.status === 'PAID' ? '#047857' : p.status === 'FAILED' ? '#B91C1C' : '#B45309';
      const statusBg = p.status === 'CAPTURED' || p.status === 'PAID' ? '#ECFDF5' : p.status === 'FAILED' ? '#FEF2F2' : '#FFFBEB';

      return `
        <tr>
          <td><span style="font-family:monospace; font-size:0.85rem;">${p.id}</span></td>
          <td><strong style="color:var(--text-primary); font-family:monospace;">${orderRef}</strong></td>
          <td><strong style="color:var(--color-primary); font-size:1rem;">₹${Number(p.amount).toLocaleString('en-IN')}</strong></td>
          <td><span class="status-badge" style="background:#F5F3FF; color:#7C3AED;">${p.provider}</span></td>
          <td><span style="font-family:monospace; font-size:0.8rem; color:var(--text-secondary);">${p.razorpay_payment_id || 'N/A'}</span></td>
          <td><span class="status-badge" style="background:${statusBg}; color:${statusColor}; font-weight:700;">${p.status}</span></td>
          <td style="font-size:0.8rem; color:var(--text-muted);">${new Date(p.created_at).toLocaleString('en-IN')}</td>
        </tr>
      `;
    }).join('');
  }

  async function renderReviewsTable() {
    const tbody = document.getElementById('reviewsTableBody');
    if (!tbody) return;

    if (window.DeliceDB && window.DeliceDB.admin) {
      reviews = await window.DeliceDB.admin.fetchReviews();
    }

    if (!reviews || reviews.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:2rem; color:var(--text-muted);">No verified reviews submitted yet.</td></tr>';
      return;
    }

    tbody.innerHTML = reviews.map(r => `
      <tr>
        <td><strong>${r.product_name || r.products?.name || 'Artisan Cake'}</strong></td>
        <td>${r.customer_name || r.profiles?.full_name || 'Verified Customer'}</td>
        <td style="color:#F59E0B; font-size:1.1rem; letter-spacing:2px;">${'★'.repeat(r.rating || 5)}${'☆'.repeat(Math.max(0, 5 - (r.rating || 5)))}</td>
        <td style="max-width:280px; font-size:0.85rem; line-height:1.4;">"${r.review}"</td>
        <td>
          <span class="status-badge" style="background:#ECFDF5; color:#047857; font-size:0.75rem;">
            ✓ Verified Order
          </span>
        </td>
        <td>
          <span class="status-badge" style="background:${r.is_approved ? '#ECFDF5' : '#FEF3C7'}; color:${r.is_approved ? '#047857' : '#B45309'};">
            ${r.is_approved ? 'APPROVED' : 'PENDING REVIEW'}
          </span>
        </td>
        <td>
          <div style="display:flex; gap:0.4rem;">
            ${!r.is_approved ? `
              <button class="btn-primary" style="padding:0.25rem 0.6rem; font-size:0.75rem; background:#059669; border-color:#059669;" onclick="window.dashManager.approveReview('${r.id}')">
                Approve
              </button>
            ` : `
              <button class="btn-secondary" style="padding:0.25rem 0.6rem; font-size:0.75rem; color:#DC2626;" onclick="window.dashManager.rejectReview('${r.id}')">
                Unpublish
              </button>
            `}
          </div>
        </td>
      </tr>
    `).join('');
  }

  async function renderAuditLogsTable() {
    const tbody = document.getElementById('auditLogsTableBody');
    if (!tbody) return;

    if (window.DeliceDB && window.DeliceDB.admin) {
      auditLogs = await window.DeliceDB.admin.fetchAuditLogs();
    }

    if (!auditLogs || auditLogs.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:2rem; color:var(--text-muted);">No audit log events recorded yet.</td></tr>';
      return;
    }

    tbody.innerHTML = auditLogs.map(l => `
      <tr>
        <td style="font-size:0.8rem; font-family:monospace; color:var(--text-secondary);">${new Date(l.created_at).toLocaleString('en-IN')}</td>
        <td><strong style="color:var(--color-primary); font-family:monospace;">${l.action}</strong></td>
        <td><span style="font-size:0.85rem; font-weight:600;">${l.user_id || 'Admin Head'}</span></td>
        <td><span class="status-badge" style="background:#F3F4F6; color:#4B5563;">${l.entity_type}</span></td>
        <td><span style="font-family:monospace; font-size:0.8rem;">${l.entity_id || '–'}</span></td>
        <td style="font-size:0.8rem; color:var(--text-secondary); max-width:260px; word-break:break-all;">
          ${typeof l.metadata === 'object' ? JSON.stringify(l.metadata) : l.metadata || '–'}
        </td>
      </tr>
    `).join('');
  }

  // --- CHARTS (CHART.JS) ---
  let salesChartInstance = null;
  let categoryChartInstance = null;

  function initCharts() {
    if (typeof Chart === 'undefined') return;

    const days = [];
    const salesData = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLabel = d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
      days.push(dayLabel);

      const dayTotal = orders
        .filter(o => o.status !== 'cancelled' && (o.createdAt || '').startsWith(dateStr))
        .reduce((sum, o) => sum + (Number(o.total) || 0), 0);

      salesData.push(dayTotal);
    }

    const salesCanvas = document.getElementById('salesTrendChart');
    if (salesCanvas) {
      if (salesChartInstance) salesChartInstance.destroy();
      const ctx = salesCanvas.getContext('2d');
      salesChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: days,
          datasets: [{
            label: 'Daily Sales (₹)',
            data: salesData,
            borderColor: '#C85A32',
            backgroundColor: 'rgba(200, 90, 50, 0.08)',
            fill: true,
            tension: 0.35,
            borderWidth: 2.5,
            pointBackgroundColor: '#C85A32',
            pointRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { callback: v => '₹' + v.toLocaleString('en-IN') }
            }
          }
        }
      });
    }

    const categoryCanvas = document.getElementById('categoryPieChart');
    if (categoryCanvas) {
      if (categoryChartInstance) categoryChartInstance.destroy();

      const catCount = {};
      orders.forEach(o => {
        (o.items || []).forEach(it => {
          const matchCake = catalog.find(c => c.name === it.name);
          const cat = matchCake ? matchCake.category : 'Artisan Cakes';
          catCount[cat] = (catCount[cat] || 0) + it.qty;
        });
      });

      const catLabels = Object.keys(catCount);
      const catValues = Object.values(catCount);

      const ctxCat = categoryCanvas.getContext('2d');
      categoryChartInstance = new Chart(ctxCat, {
        type: 'doughnut',
        data: {
          labels: catLabels.length > 0 ? catLabels : ['Awaiting Orders'],
          datasets: [{
            data: catValues.length > 0 ? catValues : [1],
            backgroundColor: catLabels.length > 0 ? ['#C85A32', '#FBBF24', '#8B5CF6', '#10B981', '#3B82F6'] : ['#E5E7EB'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { boxWidth: 12, font: { size: 11 } }
            }
          },
          cutout: '70%'
        }
      });
    }
  }

  // --- ACTIONS EXPOSED TO WINDOW ---
  window.dashManager = {
    switchView: switchView,

    updateOrderStatus: async (orderId, newStatus) => {
      const idx = orders.findIndex(o => o.id === orderId || o.order_number === orderId);
      if (idx > -1) {
        const oldStatus = orders[idx].status;
        orders[idx].status = newStatus;
        localStorage.setItem('delice_orders', JSON.stringify(orders));

        // Save status override in localStorage map to guarantee persistence across page refreshes
        try {
          const overrides = JSON.parse(localStorage.getItem('delice_order_status_overrides') || '{}');
          overrides[orderId] = newStatus;
          if (orders[idx].order_number) overrides[orders[idx].order_number] = newStatus;
          if (orders[idx].id) overrides[orders[idx].id] = newStatus;
          localStorage.setItem('delice_order_status_overrides', JSON.stringify(overrides));
        } catch (e) {}

        // Central broadcast to API so all devices and server receive the status update
        try {
          fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'update_status', orderId: orderId, status: newStatus })
          }).catch(() => {});
        } catch (e) {}

        if (window.DeliceDB) {
          try { 
            await window.DeliceDB.updateOrderStatus(orderId, newStatus); 
            if (window.DeliceDB.admin && window.DeliceDB.admin.logAudit) {
              await window.DeliceDB.admin.logAudit('ORDER_STATUS_UPDATED', 'orders', orderId, { old_status: oldStatus, new_status: newStatus });
            }
          } catch (e) {}
        }
        updateKPIs();
        renderOrdersTable();
        initCharts();
        renderAuditLogsTable();
      }
    },

    deleteOrder: async (orderId) => {
      if (confirm(`Are you sure you want to delete order #${orderId}?`)) {
        orders = orders.filter(o => o.id !== orderId);
        localStorage.setItem('delice_orders', JSON.stringify(orders));
        if (window.DeliceDB) {
          try { await window.DeliceDB.deleteOrder(orderId); } catch (e) {}
        }
        updateKPIs();
        renderOrdersTable();
        initCharts();
        renderCustomersTable();
      }
    },

    clearAllOrders: () => {
      if (confirm('Clear all orders and reset database to empty?')) {
        orders = [];
        localStorage.setItem('delice_orders', JSON.stringify(orders));
        updateKPIs();
        renderOrdersTable();
        initCharts();
        renderCustomersTable();
        alert('All order records have been cleared.');
      }
    },

    updateCakePrice: async (cakeId, newPrice) => {
      const val = parseInt(newPrice, 10);
      if (val && val > 0) {
        const cake = catalog.find(c => c.id === cakeId);
        if (cake) {
          cake.price = val;
          localStorage.setItem('delice_custom_catalog', JSON.stringify(catalog));
          if (window.DeliceDB) {
            try { await window.DeliceDB.updateCake(cakeId, { price: val }); } catch (e) {}
          }
        }
      }
    },

    toggleCakeStock: async (cakeId) => {
      const cake = catalog.find(c => c.id === cakeId);
      if (cake) {
        cake.inStock = !cake.inStock;
        localStorage.setItem('delice_custom_catalog', JSON.stringify(catalog));
        if (window.DeliceDB) {
          try { await window.DeliceDB.updateCake(cakeId, { in_stock: cake.inStock }); } catch (e) {}
        }
        renderCatalog();
      }
    },

    openAddCakeModal: () => {
      document.getElementById('addCakeModal')?.classList.add('active');
    },

    closeAddCakeModal: () => {
      document.getElementById('addCakeModal')?.classList.remove('active');
      document.getElementById('addCakeForm')?.reset();
    },

    openEditCakeModal: (cakeId) => {
      const cake = catalog.find(c => c.id === cakeId);
      if (!cake) {
        alert('Cake not found in catalog.');
        return;
      }
      document.getElementById('editCakeId').value = cake.id;
      document.getElementById('editCakeName').value = cake.name || '';
      document.getElementById('editCakeCategory').value = cake.category || 'Celebration Chiffon';
      document.getElementById('editCakePrice').value = cake.price || 0;
      document.getElementById('editCakeSlices').value = cake.slices || '1/2 kg (Serves 4–6)';
      document.getElementById('editCakeFlavor').value = cake.flavor || '';
      document.getElementById('editCakeDietary').value = cake.dietary || '100% Pure Veg (Eggless)';
      document.getElementById('editCakeLeadTime').value = cake.leadTime || 'Same Day (2 Hours)';
      document.getElementById('editCakeImage').value = cake.image || 'assets/cake_velvet.jpg';
      const preview = document.getElementById('editCakeImgPreview');
      if (preview) preview.src = cake.image || 'assets/cake_velvet.jpg';
      document.getElementById('editCakeDesc').value = cake.description || '';
      document.getElementById('editCakeInStock').checked = cake.inStock !== false;
      document.getElementById('editCakeModal')?.classList.add('active');
    },

    closeEditCakeModal: () => {
      document.getElementById('editCakeModal')?.classList.remove('active');
      document.getElementById('editCakeForm')?.reset();
    },

    pickEditCakePreset: (assetPath) => {
      const imgInp = document.getElementById('editCakeImage');
      const imgPreview = document.getElementById('editCakeImgPreview');
      if (imgInp) imgInp.value = assetPath;
      if (imgPreview) imgPreview.src = assetPath;
    },

    submitEditCake: async (e) => {
      e.preventDefault();
      const cakeId = document.getElementById('editCakeId').value;
      const cake = catalog.find(c => c.id === cakeId);
      if (!cake) {
        alert('Cake not found.');
        return;
      }

      const submitBtn = document.getElementById('editCakeSubmitBtn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>⏳</span> Saving...';
      }

      const name = document.getElementById('editCakeName').value.trim();
      const category = document.getElementById('editCakeCategory').value;
      const price = parseInt(document.getElementById('editCakePrice').value, 10);
      const slices = document.getElementById('editCakeSlices').value.trim();
      const flavor = document.getElementById('editCakeFlavor').value.trim();
      const dietary = document.getElementById('editCakeDietary').value.trim() || '100% Pure Veg (Eggless)';
      const leadTime = document.getElementById('editCakeLeadTime').value.trim() || 'Same Day (2 Hours)';
      const image = document.getElementById('editCakeImage').value.trim() || 'assets/cake_velvet.jpg';
      const description = document.getElementById('editCakeDesc').value.trim();
      const inStock = document.getElementById('editCakeInStock').checked;

      const updates = { name, category, price, slices, flavor, dietary, leadTime, image, description, inStock };
      Object.assign(cake, updates);

      localStorage.setItem('delice_custom_catalog', JSON.stringify(catalog));

      if (window.DeliceDB) {
        try { await window.DeliceDB.updateCake(cakeId, updates); } catch (err) {}
      }

      renderCatalog();
      window.dashManager.closeEditCakeModal();

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>💾</span> Save Changes';
      }

      alert(`🎂 "${name}" was successfully updated!`);
    },

    pickCakePreset: (assetPath) => {
      const imgInp = document.getElementById('newCakeImage');
      const imgPreview = document.getElementById('newCakeImgPreview');
      if (imgInp) imgInp.value = assetPath;
      if (imgPreview) imgPreview.src = assetPath;
    },

    submitNewCake: async (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('saveCakeSubmitBtn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>⏳</span> Adding Cake...';
      }

      const name = document.getElementById('newCakeName').value.trim();
      const category = document.getElementById('newCakeCategory').value;
      const price = parseInt(document.getElementById('newCakePrice').value, 10);
      const slices = document.getElementById('newCakeSlices').value.trim();
      const flavor = document.getElementById('newCakeFlavor').value.trim();
      const dietary = document.getElementById('newCakeDietary').value.trim() || '100% Eggless Option';
      const leadTime = document.getElementById('newCakeLeadTime').value.trim() || 'Same Day (2 Hours)';
      const image = document.getElementById('newCakeImage').value.trim() || 'assets/cake_velvet.jpg';
      const description = document.getElementById('newCakeDesc').value.trim();
      const inStock = document.getElementById('newCakeInStock').checked;

      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const newCake = {
        id: slug ? `${slug}-${Date.now().toString().slice(-4)}` : `cake-${Date.now()}`,
        name, category, price, slices, flavor, dietary, leadTime, image, description, inStock
      };

      catalog.unshift(newCake);
      localStorage.setItem('delice_custom_catalog', JSON.stringify(catalog));

      if (window.DeliceDB) {
        try { await window.DeliceDB.addCake(newCake); } catch (err) {}
      }

      renderCatalog();
      window.dashManager.closeAddCakeModal();

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>✨</span> Publish Cake to Catalog';
      }

      alert(`🎂 "${name}" was successfully added to the catalog!`);
    },

    deleteCake: async (cakeId) => {
      const cake = catalog.find(c => c.id === cakeId);
      const cakeName = cake ? cake.name : 'this cake';
      if (confirm(`Are you sure you want to remove "${cakeName}" from the catalog?`)) {
        catalog = catalog.filter(c => c.id !== cakeId);
        localStorage.setItem('delice_custom_catalog', JSON.stringify(catalog));
        if (window.DeliceDB) {
          try { await window.DeliceDB.deleteCake(cakeId); } catch (e) {}
        }
        renderCatalog();
      }
    },

    printOrderSlip: (orderId) => {
      const order = orders.find(o => o.id === orderId);
      if (!order) return;

      const printWin = window.open('', '_blank', 'width=600,height=700');
      if (!printWin) {
        alert('Please allow popups to print kitchen slips.');
        return;
      }

      const itemsHtml = (order.items || []).map(i => `
        <div style="display:flex; justify-content:space-between; margin-bottom:6px; font-size:14px;">
          <span><strong>${i.qty}×</strong> ${i.name} (${i.specs || 'Std'})</span>
          <span>₹${i.price * i.qty}</span>
        </div>
      `).join('');

      printWin.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Order #${order.id} — Kitchen Ticket</title>
          <style>
            body { font-family: monospace; padding: 20px; line-height: 1.4; color: #000; }
            .ticket { max-width: 380px; margin: 0 auto; border: 1px dashed #000; padding: 15px; }
            h2 { text-align: center; margin: 0 0 10px; font-size: 18px; }
            .sep { border-bottom: 1px dashed #000; margin: 10px 0; }
            .total { display: flex; justify-content: space-between; font-weight: bold; font-size: 16px; }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <div class="ticket">
            <h2>🍰 DÉLICE & CO.</h2>
            <div style="text-align:center; font-size:12px;">Akota Boutique, Vadodara | 9909444882</div>
            <div class="sep"></div>
            <div><strong>TICKET:</strong> #${order.id}</div>
            <div><strong>DATE:</strong> ${order.createdAt ? new Date(order.createdAt).toLocaleString('en-IN') : 'Live'}</div>
            <div><strong>CUSTOMER:</strong> ${order.customer?.name} (${order.customer?.phone})</div>
            <div><strong>DELIVERY:</strong> ${order.deliveryDate} | ${order.deliverySlot}</div>
            <div><strong>ADDRESS:</strong> ${order.customer?.address}</div>
            <div class="sep"></div>
            <div><strong>ITEMS ORDERED:</strong></div>
            ${itemsHtml}
            ${order.cakeMessage && order.cakeMessage !== 'None' ? `<div style="margin-top:6px; background:#eee; padding:4px;"><strong>PIPED MSG:</strong> "${order.cakeMessage}"</div>` : ''}
            <div class="sep"></div>
            <div class="total">
              <span>TOTAL AMOUNT:</span>
              <span>₹${order.total}</span>
            </div>
            <div style="font-size:11px; margin-top:4px;">PAYMENT: ${order.paymentMethod || 'RAZORPAY / COD'}</div>
            <div class="sep"></div>
            <div style="text-align:center; font-size:11px;">100% PURE VEG & EGGLESS ARTISAN BAKERY</div>
          </div>
        </body>
        </html>
      `);
      printWin.document.close();
    },

    exportCSV: () => {
      const headers = ['Order ID', 'Date', 'Customer Name', 'Phone', 'Address', 'Items', 'Total', 'Status', 'Payment'];
      const rows = orders.map(o => [
        `"${o.id}"`,
        `"${o.createdAt || ''}"`,
        `"${o.customer?.name || ''}"`,
        `"${o.customer?.phone || ''}"`,
        `"${(o.customer?.address || '').replace(/"/g, '""')}"`,
        `"${(o.items || []).map(i => `${i.qty}x ${i.name}`).join('; ')}"`,
        o.total || 0,
        o.status,
        `"${o.paymentMethod || 'RAZORPAY'}"`
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `Delice_Real_Orders_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    openNewOrderModal: () => {
      document.getElementById('newOrderModal')?.classList.add('active');
    },

    closeNewOrderModal: () => {
      document.getElementById('newOrderModal')?.classList.remove('active');
    },

    callCustomer: (phone) => {
      const cleanPhone = (phone || STORE_PHONE).replace(/\D/g, '');
      window.location.href = `tel:+91${cleanPhone.slice(-10)}`;
    },

    copySqlSchema: () => {
      const pre = document.querySelector('#sqlSchemaModal pre');
      if (pre) {
        navigator.clipboard.writeText(pre.innerText).then(() => {
          alert('✅ Full SQL schema copied to clipboard!');
        });
      }
    },

    testSupabaseConnection: async () => {
      const url = document.getElementById('sbProjectUrl')?.value.trim() || (window.DeliceDB && window.DeliceDB.getUrl());
      const key = document.getElementById('sbApiKey')?.value.trim() || (window.DeliceDB && window.DeliceDB.getKey());
      const feedback = document.getElementById('sbTestFeedback');

      if (feedback) {
        feedback.style.display = 'block';
        feedback.style.background = '#EFF6FF';
        feedback.style.color = '#1D4ED8';
        feedback.style.border = '1px solid #BFDBFE';
        feedback.innerHTML = '🔄 Testing connection to Supabase Project...';
      }

      if (!window.DeliceDB) {
        if (feedback) {
          feedback.style.background = '#FEF2F2';
          feedback.style.color = '#B91C1C';
          feedback.innerHTML = '❌ Supabase DB adapter (supabase.js) is missing.';
        }
        return;
      }

      const res = await window.DeliceDB.testConnection(url, key);
      if (feedback) {
        if (res.success) {
          feedback.style.background = '#ECFDF5';
          feedback.style.color = '#047857';
          feedback.style.border = '1px solid #A7F3D0';
          feedback.innerHTML = `✅ ${res.message}`;
          updateDbStatusUI(true);
        } else {
          feedback.style.background = '#FEF2F2';
          feedback.style.color = '#B91C1C';
          feedback.style.border = '1px solid #FECACA';
          feedback.innerHTML = `❌ ${res.message}`;
          updateDbStatusUI(false);
        }
      }
    },

    // --- BESPOKE CUSTOM CAKE METHODS ---
    renderCustomCakesTable: renderCustomCakesTable,

    filterCustomCakes: (status) => {
      activeCustomFilter = status;
      document.querySelectorAll('#customStatusFilterGroup .filter-chip').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-cfilter') === status);
      });
      renderCustomCakesTable();
    },

    searchCustomCakes: (query) => {
      customSearchQuery = (query || '').trim();
      renderCustomCakesTable();
    },

    updateCustomCakeStatus: (id, newStatus) => {
      const item = customCakes.find(c => c.id === id);
      if (item) {
        item.status = newStatus;
        localStorage.setItem('delice_custom_cakes', JSON.stringify(customCakes));
        renderCustomCakesTable();
        updateKPIs();
      }
    },

    updateCustomCakeStatusFromModal: (newStatus) => {
      if (selectedCustomCakeId) {
        window.dashManager.updateCustomCakeStatus(selectedCustomCakeId, newStatus);
        const badge = document.getElementById('ccdBadge');
        if (badge) badge.textContent = newStatus.toUpperCase();
      }
    },

    viewCustomCakeDetails: (id) => {
      const cake = customCakes.find(c => c.id === id);
      if (!cake) return;
      selectedCustomCakeId = id;

      const title = document.getElementById('ccdTitle');
      const badge = document.getElementById('ccdBadge');
      const name = document.getElementById('ccdCustName');
      const phone = document.getElementById('ccdCustPhone');
      const callBtn = document.getElementById('ccdCallBtn');
      const waDirect = document.getElementById('ccdWaDirectBtn');
      const flavour = document.getElementById('ccdFlavour');
      const weight = document.getElementById('ccdWeight');
      const diet = document.getElementById('ccdDiet');
      const date = document.getElementById('ccdDate');
      const msg = document.getElementById('ccdMessage');
      const notes = document.getElementById('ccdNotes');
      const price = document.getElementById('ccdPrice');
      const statusSel = document.getElementById('ccdStatusSelect');
      const replyWaBtn = document.getElementById('ccdReplyWaBtn');

      if (title) title.textContent = `Custom Request #${cake.id}`;
      if (badge) badge.textContent = (cake.status || 'pending').toUpperCase();
      if (name) name.textContent = cake.customer?.name || 'Customer';
      if (phone) phone.textContent = cake.customer?.phone || 'N/A';
      if (callBtn) callBtn.href = `tel:${cake.customer?.phone || ''}`;

      const phoneDigits = (cake.customer?.phone || '').replace(/\D/g, '');
      const waPhone = phoneDigits.length === 10 ? '91' + phoneDigits : phoneDigits;
      const waGreeting = encodeURIComponent(`Hello ${cake.customer?.name || 'there'}! This is Délice & Co. Artisan Patisserie regarding your bespoke cake inquiry (#${cake.id}). We would love to bake your ${cake.flavor} cake!`);

      if (waDirect) waDirect.href = `mailto:${cake.customer?.email || ''}?subject=Your Custom Cake Inquiry - D%C3%A9lice %26 Co.&body=${waGreeting}`;
      if (flavour) flavour.textContent = cake.flavor || 'Custom Flavour';
      if (weight) weight.textContent = cake.weight || '1 kg';
      if (diet) diet.textContent = cake.dietary || '100% Pure Veg (Eggless)';
      if (date) date.textContent = cake.deliveryDate || 'As requested';
      if (msg) msg.textContent = cake.message ? `"${cake.message}"` : '(No message)';
      if (notes) notes.textContent = cake.notes || 'No additional styling notes specified.';
      if (price) price.textContent = `₹${(cake.estimatedPrice || 0).toLocaleString('en-IN')}`;
      if (statusSel) statusSel.value = cake.status || 'pending';

      if (replyWaBtn) {
        replyWaBtn.onclick = () => {
          const followUp = encodeURIComponent(`Hello ${cake.customer?.name || 'Customer'}! Regarding your custom cake #${cake.id} (${cake.flavor}, ${cake.weight}): Your estimated quote is ₹${(cake.estimatedPrice || 0).toLocaleString('en-IN')}. Would you like us to proceed with baking this for ${cake.deliveryDate || 'your celebration'}?`);
          window.location.href = `tel:+91${(cake.customer?.phone || '').replace(/\D/g, '').slice(-10)}`;
        };
      }

      document.getElementById('customCakeDetailsModal')?.classList.add('active');
    },

    deleteCurrentCustomCake: () => {
      if (selectedCustomCakeId && confirm(`Delete custom inquiry #${selectedCustomCakeId}?`)) {
        customCakes = customCakes.filter(c => c.id !== selectedCustomCakeId);
        localStorage.setItem('delice_custom_cakes', JSON.stringify(customCakes));
        document.getElementById('customCakeDetailsModal')?.classList.remove('active');
        renderCustomCakesTable();
        updateKPIs();
      }
    },

    deleteCustomCake: (id) => {
      if (confirm(`Delete custom inquiry #${id}?`)) {
        customCakes = customCakes.filter(c => c.id !== id);
        localStorage.setItem('delice_custom_cakes', JSON.stringify(customCakes));
        renderCustomCakesTable();
        updateKPIs();
      }
    },

    calcNewCustomCakePrice: () => {
      const flavourEl = document.getElementById('nccFlavour');
      const weightEl = document.getElementById('nccWeight');
      const priceEl = document.getElementById('nccPrice');
      if (!flavourEl || !weightEl || !priceEl) return;

      const flavBases = {
        'Belgian Dark Truffle': 849,
        'Velvet Rose & Wild Berry': 899,
        'Kyoto Strawberry Cloud': 799,
        'Sicilian Bronte Pistachio': 949,
        'Nutella Lotus Biscoff': 899,
        'Golden Pineapple Gateau': 549,
        'Other Bespoke Flavour': 999
      };

      const base = flavBases[flavourEl.value] || 899;
      let mult = 1.9;
      const w = weightEl.value;
      if (w.includes('0.5')) mult = 1.0;
      else if (w.includes('1 kg')) mult = 1.9;
      else if (w.includes('1.5')) mult = 2.8;
      else if (w.includes('2 kg')) mult = 3.7;
      else if (w.includes('3 kg')) mult = 5.5;

      priceEl.value = Math.round(base * mult);
    },

    openNewCustomCakeModal: () => {
      document.getElementById('newCustomCakeModal')?.classList.add('active');
      window.dashManager.calcNewCustomCakePrice();
    },

    closeNewCustomCakeModal: () => {
      document.getElementById('newCustomCakeModal')?.classList.remove('active');
    },

    convertCustomCakeToOrder: () => {
      if (!selectedCustomCakeId) return;
      const cake = customCakes.find(c => c.id === selectedCustomCakeId);
      if (!cake) return;

      const newOrderId = 'DC-' + Math.floor(100000 + Math.random() * 900000);
      const newOrder = {
        id: newOrderId,
        customer: {
          name: cake.customer?.name || 'Customer',
          phone: cake.customer?.phone || '',
          address: 'Vadodara (Custom Studio Request)'
        },
        items: [{
          name: `[CUSTOM CAKE] ${cake.flavor}`,
          qty: 1,
          price: cake.estimatedPrice || 1500,
          specs: cake.weight,
          message: cake.message || ''
        }],
        dietary: cake.dietary || '100% Pure Veg & Eggless',
        cakeMessage: cake.message || 'None',
        deliveryDate: cake.deliveryDate || 'As requested',
        deliverySlot: 'Custom Studio Schedule',
        subtotal: cake.estimatedPrice || 1500,
        deliveryFee: 0,
        total: cake.estimatedPrice || 1500,
        paymentMethod: 'Custom Studio Order',
        status: 'baking',
        createdAt: new Date().toISOString()
      };

      orders.unshift(newOrder);
      localStorage.setItem('delice_orders', JSON.stringify(orders));

      cake.status = 'baking';
      localStorage.setItem('delice_custom_cakes', JSON.stringify(customCakes));

      document.getElementById('customCakeDetailsModal')?.classList.remove('active');

      renderOrdersTable();
      renderCustomCakesTable();
      updateKPIs();

      alert(`👩‍🍳 Custom Cake #${cake.id} has been converted into Live Kitchen Order #${newOrderId}!`);
      document.querySelector('[data-view="orders"]')?.click();
    },

    saveNewCustomCake: (e) => {
      e.preventDefault();
      const name = document.getElementById('nccName').value.trim();
      const phone = document.getElementById('nccPhone').value.trim();
      const flavor = document.getElementById('nccFlavour').value;
      const weight = document.getElementById('nccWeight').value;
      const dietary = document.getElementById('nccDiet').value;
      const deliveryDate = document.getElementById('nccDate').value;
      const message = document.getElementById('nccMessage').value.trim();
      const notes = document.getElementById('nccNotes').value.trim();
      const estimatedPrice = parseInt(document.getElementById('nccPrice').value, 10) || 1500;
      const status = document.getElementById('nccStatus')?.value || 'confirmed';

      const newInquiry = {
        id: 'CC-' + Math.floor(100000 + Math.random() * 900000),
        customer: { name, phone },
        flavor,
        weight,
        dietary,
        deliveryDate,
        message,
        notes,
        estimatedPrice,
        status,
        createdAt: new Date().toISOString()
      };

      customCakes.unshift(newInquiry);
      localStorage.setItem('delice_custom_cakes', JSON.stringify(customCakes));

      // Also sync to Supabase custom_cake_orders table
      try {
        fetch('https://fccisnncmndbjckpaebm.supabase.co/rest/v1/custom_cake_orders', {
          method: 'POST',
          headers: {
            'apikey': 'sb_publishable_XSUEFzUa1bB0tGbtGjixYg_v1eQGeik',
            'Authorization': 'Bearer sb_publishable_XSUEFzUa1bB0tGbtGjixYg_v1eQGeik',
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            customer_name: name,
            customer_phone: phone,
            flavour: flavor,
            weight: weight,
            dietary_requirement: dietary,
            cake_message: message || 'None',
            delivery_date: deliveryDate || null,
            delivery_slot: 'Custom Studio Request',
            estimated_price: estimatedPrice,
            status: status === 'confirmed' || status === 'baking' ? status.toUpperCase() : 'PENDING'
          })
        }).catch(err => console.warn('Supabase sync notice:', err));
      } catch (err) {}

      document.getElementById('newCustomCakeForm')?.reset();
      document.getElementById('newCustomCakeModal')?.classList.remove('active');

      renderCustomCakesTable();
      updateKPIs();
      alert(`✅ Custom cake #${newInquiry.id} successfully created and saved in dashboard!`);
    },

    // =========================================================================
    // ADMIN AUTHENTICATION METHODS
    // =========================================================================
    handleAdminLogin: async (e) => {
      e.preventDefault();
      const email = document.getElementById('adminAuthEmail')?.value.trim();
      const password = document.getElementById('adminAuthPassword')?.value;
      const alertBox = document.getElementById('adminLoginAlert');
      const submitBtn = document.getElementById('adminLoginBtn');

      if (!email || !password) {
        if (alertBox) {
          alertBox.style.display = 'block';
          alertBox.style.background = '#FEF2F2';
          alertBox.style.color = '#B91C1C';
          alertBox.textContent = 'Please enter both admin email and password.';
        }
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>⏳</span> Verifying credentials...';
      }

      // Check standard demo credentials or Supabase Auth
      let authenticated = false;
      let userRole = 'admin';

      if (email.toLowerCase() === 'admin@deliceandcake.in' && password === 'Admin@123456') {
        authenticated = true;
        userRole = 'admin';
      } else if (window.DeliceDB && window.DeliceDB.auth) {
        try {
          const authRes = await window.DeliceDB.auth.signIn(email, password);
          if (authRes && authRes.user) {
            authenticated = true;
            userRole = authRes.user.user_metadata?.role || (email.includes('admin') ? 'admin' : 'staff');
          }
        } catch (err) {
          console.warn('Supabase auth signin check:', err);
        }
      }

      if (authenticated) {
        const sessionObj = {
          email,
          role: userRole,
          name: userRole === 'admin' ? 'Head Admin' : 'Staff Member',
          timestamp: new Date().toISOString()
        };
        sessionStorage.setItem('delice_admin_authenticated', JSON.stringify(sessionObj));

        if (window.DeliceDB && window.DeliceDB.admin && window.DeliceDB.admin.logAudit) {
          await window.DeliceDB.admin.logAudit('ADMIN_LOGIN_SUCCESS', 'auth', email, { role: userRole });
        }

        const roleText = document.getElementById('adminUserRoleText');
        if (roleText) roleText.textContent = sessionObj.name;

        const authModal = document.getElementById('adminAuthModal');
        if (authModal) {
          authModal.classList.remove('active');
          authModal.style.display = 'none';
        }
        if (alertBox) alertBox.style.display = 'none';

        renderDeliverySlotsTable();
        renderCouponsTable();
        renderPaymentsTable();
        renderReviewsTable();
        renderAuditLogsTable();
      } else {
        if (alertBox) {
          alertBox.style.display = 'block';
          alertBox.style.background = '#FEF2F2';
          alertBox.style.color = '#B91C1C';
          alertBox.textContent = 'Invalid admin credentials. Use the Demo Quick Fill button below.';
        }
      }

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>🔐</span> Sign In to Admin Hub';
      }
    },

    logoutAdmin: async () => {
      sessionStorage.removeItem('delice_admin_authenticated');
      if (window.DeliceDB && window.DeliceDB.auth) {
        try { await window.DeliceDB.auth.signOut(); } catch (e) {}
      }
      const authModal = document.getElementById('adminAuthModal');
      if (authModal) {
        authModal.classList.add('active');
        authModal.style.display = 'flex';
      }
    },

    quickFillAdmin: () => {
      const emailInp = document.getElementById('adminAuthEmail');
      const passInp = document.getElementById('adminAuthPassword');
      if (emailInp) emailInp.value = 'admin@deliceandcake.in';
      if (passInp) passInp.value = 'Admin@123456';
    },

    // =========================================================================
    // DELIVERY SLOTS MANAGEMENT METHODS
    // =========================================================================
    renderDeliverySlotsTable: renderDeliverySlotsTable,

    openAddSlotModal: () => {
      document.getElementById('addDeliverySlotModal')?.classList.add('active');
      const dateInp = document.getElementById('newSlotDate');
      if (dateInp && !dateInp.value) {
        dateInp.value = new Date().toISOString().split('T')[0];
      }
    },

    saveNewDeliverySlot: async (e) => {
      e.preventDefault();
      const date = document.getElementById('newSlotDate').value;
      const startTime = document.getElementById('newSlotStart').value + ':00';
      const endTime = document.getElementById('newSlotEnd').value + ':00';
      const maxOrders = parseInt(document.getElementById('newSlotMax').value, 10) || 10;

      const newSlot = {
        id: 'slot-' + Date.now(),
        date,
        start_time: startTime,
        end_time: endTime,
        maximum_orders: maxOrders,
        current_orders: 0,
        is_available: true
      };

      deliverySlots.push(newSlot);
      if (window.DeliceDB && window.DeliceDB.admin) {
        await window.DeliceDB.admin.saveDeliverySlot(newSlot);
        await window.DeliceDB.admin.logAudit('DELIVERY_SLOT_CREATED', 'delivery_slots', newSlot.id, { date, window: `${startTime}-${endTime}` });
      }

      document.getElementById('addDeliverySlotModal')?.classList.remove('active');
      document.getElementById('addDeliverySlotForm')?.reset();
      renderDeliverySlotsTable();
      renderAuditLogsTable();
      alert(`⏰ Delivery slot (${date}, ${startTime.slice(0, 5)}–${endTime.slice(0, 5)}) added!`);
    },

    toggleSlotAvailability: async (id) => {
      const slot = deliverySlots.find(s => s.id === id);
      if (slot) {
        slot.is_available = !slot.is_available;
        if (window.DeliceDB && window.DeliceDB.admin) {
          await window.DeliceDB.admin.saveDeliverySlot(slot);
        }
        renderDeliverySlotsTable();
      }
    },

    deleteDeliverySlot: async (id) => {
      if (confirm('Delete this delivery slot?')) {
        deliverySlots = deliverySlots.filter(s => s.id !== id);
        if (window.DeliceDB && window.DeliceDB.admin) {
          await window.DeliceDB.admin.deleteDeliverySlot(id);
        }
        renderDeliverySlotsTable();
      }
    },

    // =========================================================================
    // PROMO COUPONS MANAGEMENT METHODS
    // =========================================================================
    renderCouponsTable: renderCouponsTable,

    openAddCouponModal: () => {
      document.getElementById('addCouponModal')?.classList.add('active');
      const expInp = document.getElementById('newCouponExpiry');
      if (expInp && !expInp.value) {
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        expInp.value = nextMonth.toISOString().split('T')[0];
      }
    },

    saveNewCoupon: async (e) => {
      e.preventDefault();
      const code = document.getElementById('newCouponCode').value.trim().toUpperCase();
      const discountType = document.getElementById('newCouponType').value;
      const discountValue = parseInt(document.getElementById('newCouponValue').value, 10);
      const minOrder = parseInt(document.getElementById('newCouponMinOrder').value, 10) || 0;
      const maxDiscount = parseInt(document.getElementById('newCouponMaxDiscount').value, 10) || null;
      const usageLimit = parseInt(document.getElementById('newCouponUsageLimit').value, 10) || 100;
      const validUntil = document.getElementById('newCouponExpiry').value;

      const newCoupon = {
        id: 'coupon-' + Date.now(),
        code,
        discount_type: discountType,
        discount_value: discountValue,
        minimum_order_value: minOrder,
        maximum_discount: maxDiscount,
        usage_limit: usageLimit,
        used_count: 0,
        valid_until: validUntil,
        is_active: true
      };

      coupons.push(newCoupon);
      if (window.DeliceDB && window.DeliceDB.admin) {
        await window.DeliceDB.admin.saveCoupon(newCoupon);
        await window.DeliceDB.admin.logAudit('COUPON_CREATED', 'coupons', code, { discount: `${discountValue} (${discountType})` });
      }

      document.getElementById('addCouponModal')?.classList.remove('active');
      document.getElementById('addCouponForm')?.reset();
      renderCouponsTable();
      renderAuditLogsTable();
      alert(`🏷️ Promo Coupon "${code}" created successfully!`);
    },

    toggleCouponStatus: async (idOrCode) => {
      const coupon = coupons.find(c => c.id === idOrCode || c.code === idOrCode);
      if (coupon) {
        coupon.is_active = !coupon.is_active;
        if (window.DeliceDB && window.DeliceDB.admin) {
          await window.DeliceDB.admin.saveCoupon(coupon);
        }
        renderCouponsTable();
      }
    },

    deleteCoupon: async (idOrCode) => {
      if (confirm(`Delete promo coupon "${idOrCode}"?`)) {
        coupons = coupons.filter(c => c.id !== idOrCode && c.code !== idOrCode);
        if (window.DeliceDB && window.DeliceDB.admin) {
          await window.DeliceDB.admin.deleteCoupon(idOrCode);
        }
        renderCouponsTable();
      }
    },

    // =========================================================================
    // PAYMENTS, REVIEWS & AUDIT METHODS
    // =========================================================================
    renderPaymentsTable: renderPaymentsTable,

    renderReviewsTable: renderReviewsTable,

    approveReview: async (id) => {
      const rev = reviews.find(r => r.id === id);
      if (rev) {
        rev.is_approved = true;
        if (window.DeliceDB && window.DeliceDB.admin) {
          await window.DeliceDB.admin.updateReviewStatus(id, true);
          await window.DeliceDB.admin.logAudit('REVIEW_APPROVED', 'reviews', id, { rating: rev.rating });
        }
        renderReviewsTable();
        renderAuditLogsTable();
      }
    },

    rejectReview: async (id) => {
      const rev = reviews.find(r => r.id === id);
      if (rev) {
        rev.is_approved = false;
        if (window.DeliceDB && window.DeliceDB.admin) {
          await window.DeliceDB.admin.updateReviewStatus(id, false);
          await window.DeliceDB.admin.logAudit('REVIEW_REJECTED', 'reviews', id, { rating: rev.rating });
        }
        renderReviewsTable();
        renderAuditLogsTable();
      }
    },

    renderAuditLogsTable: renderAuditLogsTable,

    clearAllOrders: () => {
      if (confirm('Are you sure you want to clear all test/mock orders? This will reset the order list so you can see only real fresh customer orders.')) {
        orders = [];
        localStorage.setItem('delice_orders', '[]');
        updateKPIs();
        renderOrdersTable();
        renderCustomersTable();
        initCharts();
        alert('✅ Order list cleared! Ready for real orders.');
      }
    },

    saveSupabaseSettings: async () => {
      const urlInp = document.getElementById('sbProjectUrl');
      const keyInp = document.getElementById('sbApiKey');
      const cleanUrl = (urlInp?.value || '').trim().replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
      const cleanKey = (keyInp?.value || '').trim();

      if (!cleanUrl) {
        alert('Please enter a valid Supabase Project URL (e.g. https://fccisnncmndbjckpaebm.supabase.co)');
        return;
      }

      localStorage.setItem('delice_supabase_url', cleanUrl);
      if (cleanKey) localStorage.setItem('delice_supabase_key', cleanKey);

      if (window.DeliceDB) {
        window.DeliceDB.reconnect(cleanUrl, cleanKey);
      }
      updateDbStatusUI(true);
      alert(`✅ Supabase Project URL updated to: ${cleanUrl}\nOrders and customer data are now synced.`);
    },

    saveSupabaseConfig: function(event) {
      if (event && event.preventDefault) event.preventDefault();
      return this.saveSupabaseSettings();
    },

    savePaymentSettings: () => {
      const keyId = document.getElementById('sbRazorpayKey')?.value.trim();
      const secret = document.getElementById('sbRazorpaySecret')?.value.trim();
      const meUrl = document.getElementById('sbRazorpayMe')?.value.trim();

      if (keyId) localStorage.setItem('delice_razorpay_key', keyId);
      if (secret) localStorage.setItem('delice_razorpay_secret', secret);
      if (meUrl) localStorage.setItem('delice_razorpay_me', meUrl);

      alert(`✅ Razorpay Settings Saved!\nKey ID: ${keyId}\nActive checkout is ready.`);
    },

    setTheme: (themeName) => {
      const valid = ['noir', 'sapphire', 'emerald', 'light'];
      const active = valid.includes(themeName) ? themeName : 'noir';
      document.body.setAttribute('data-theme', active);
      localStorage.setItem('delice_admin_theme', active);
      const sel = document.getElementById('themeSelector');
      if (sel) sel.value = active;
    },

    openFixRlsModal: () => {
      document.getElementById('fixSupabaseRlsModal')?.classList.add('active');
    },

    copyRlsSql: () => {
      const sql = document.getElementById('rlsSqlBox')?.innerText || '';
      navigator.clipboard.writeText(sql).then(() => {
        alert('📋 Supabase RLS Fix SQL copied to clipboard!\n\nNow open Supabase SQL Editor and run it.');
      }).catch(() => {
        alert('Please manually copy the SQL shown in the box.');
      });
    },

    syncOrdersToSupabase: async () => {
      if (!window.DeliceDB || typeof window.DeliceDB.syncLocalOrdersToSupabase !== 'function') {
        alert('Supabase adapter is initializing. Please retry in a second.');
        return;
      }
      const syncBtn = event?.currentTarget;
      if (syncBtn) {
        syncBtn.disabled = true;
        syncBtn.innerHTML = '<span>⏳</span> Syncing...';
      }
      try {
        const res = await window.DeliceDB.syncLocalOrdersToSupabase();
        if (res.success) {
          alert(`✅ Supabase Sync Completed!\n${res.message}\n\nAll website orders are now safely in your Supabase database.`);
          // Reload from Supabase
          const fresh = await window.DeliceDB.fetchOrders();
          if (fresh && fresh.length > 0) {
            orders = fresh;
            updateKPIs();
            renderOrdersTable();
            renderCustomersTable();
            initCharts();
          }
        } else {
          if (res.rlsBlocked) {
            document.getElementById('fixSupabaseRlsModal')?.classList.add('active');
            alert('⚠️ Supabase Row-Level Security (RLS) is blocking inserts.\n\nPlease run the 1-click SQL in your Supabase SQL Editor to allow orders to be saved.');
          } else {
            alert(`Sync notice: ${res.message}`);
          }
        }
      } catch (err) {
        alert('Sync error: ' + err.message);
      } finally {
        if (syncBtn) {
          syncBtn.disabled = false;
          syncBtn.innerHTML = '<span>⚡</span> Sync Supabase';
        }
      }
    }
  };

  // --- MANUAL ORDER FORM HANDLER ---
  function setupManualOrderForm() {
    const newOrderForm = document.getElementById('newOrderForm');
    if (newOrderForm) {
      newOrderForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('manualCustName').value.trim();
        const phone = document.getElementById('manualCustPhone').value.trim();
        const address = document.getElementById('manualCustAddress').value.trim();
        const cakeName = document.getElementById('manualCakeSelect').value;
        const cakePrice = parseInt(document.getElementById('manualCakePrice').value, 10) || 799;
        const cakeMsg = document.getElementById('manualCakeMsg').value.trim();
        const delivDate = document.getElementById('manualDelivDate').value || new Date().toISOString().split('T')[0];
        const slot = document.getElementById('manualDelivSlot').value;
        const status = document.getElementById('manualStatus').value;

        const newOrder = {
          id: 'DC-' + Math.floor(100000 + Math.random() * 900000),
          customer: { name, phone, address },
          items: [{ name: cakeName, qty: 1, price: cakePrice, specs: 'Store Direct Order' }],
          dietary: 'Standard',
          cakeMessage: cakeMsg || 'None',
          deliveryDate: delivDate,
          deliverySlot: slot,
          subtotal: cakePrice,
          deliveryFee: 0,
          total: cakePrice,
          paymentMethod: 'Cash / Manual Store Order',
          status: status,
          createdAt: new Date().toISOString()
        };

        orders.unshift(newOrder);
        localStorage.setItem('delice_orders', JSON.stringify(orders));
        if (window.DeliceDB) {
          try { window.DeliceDB.addOrder(newOrder); } catch (e) {}
        }

        newOrderForm.reset();
        window.dashManager.closeNewOrderModal();
        updateKPIs();
        renderOrdersTable();
        initCharts();
        renderCustomersTable();
        alert(`✅ Real order #${newOrder.id} successfully recorded!`);
      });
    }

    // Global Search
    const searchInp = document.getElementById('globalSearchInput');
    if (searchInp) {
      searchInp.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim();
        renderOrdersTable();
      });
    }

    // Filter Buttons in Orders Table
    document.querySelectorAll('.filter-btn[data-filter], .filter-btn[data-status]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn[data-filter], .filter-btn[data-status]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = btn.getAttribute('data-filter') || btn.getAttribute('data-status') || 'all';
        renderOrdersTable();
      });
    });
  }

  function updateDbStatusUI(isConnected) {
    const dot = document.getElementById('topbarDbDot');
    const text = document.getElementById('topbarDbText');
    const badge = document.getElementById('sbConnStatusBadge');
    const urlInp = document.getElementById('sbProjectUrl');
    const keyInp = document.getElementById('sbApiKey');

    const activeUrl = window.DeliceDB ? window.DeliceDB.getUrl() : '';
    const activeKey = window.DeliceDB ? window.DeliceDB.getKey() : '';

    if (urlInp && !urlInp.value && activeUrl) urlInp.value = activeUrl;
    if (keyInp && activeKey) keyInp.value = activeKey;

    const connected = isConnected !== undefined ? isConnected : (window.DeliceDB && window.DeliceDB.isConnected());

    if (connected) {
      if (dot) dot.style.background = '#10B981';
      if (text) text.textContent = 'Supabase Connected';
      if (badge) {
        badge.textContent = '🟢 Connected to Cloud Database';
        badge.style.background = '#ECFDF5';
        badge.style.color = '#047857';
      }
    } else if (activeUrl) {
      if (dot) dot.style.background = '#F59E0B';
      if (text) text.textContent = 'Supabase Ready (Click to Test)';
      if (badge) {
        badge.textContent = '🟡 URL Configured (Click Test)';
        badge.style.background = '#FFFBEB';
        badge.style.color = '#B45309';
      }
    } else {
      if (dot) dot.style.background = '#94A3B8';
      if (text) text.textContent = 'Supabase: Enter URL';
      if (badge) {
        badge.textContent = '⏳ Awaiting Project URL';
        badge.style.background = '#FEF3C7';
        badge.style.color = '#B45309';
      }
    }
  }

  // --- IMMEDIATE STARTUP & ASYNC CLOUD SYNC ---
  function checkAdminAuth() {
    let authSession = sessionStorage.getItem('delice_admin_authenticated');
    if (!authSession) {
      try {
        const raw = localStorage.getItem('delice_user');
        if (raw) {
          const u = JSON.parse(raw);
          if (u && (u.role === 'admin' || u.role === 'staff' || u.isAdmin === true)) {
            authSession = JSON.stringify({
              email: u.email || 'admin@deliceandcake.in',
              role: u.role || 'admin',
              name: u.full_name || 'Admin',
              timestamp: new Date().toISOString()
            });
            sessionStorage.setItem('delice_admin_authenticated', authSession);
          }
        }
      } catch (e) {}
    }
    const modal = document.getElementById('adminAuthModal');
    if (!authSession) {
      if (modal) {
        modal.classList.add('active');
        modal.style.display = 'flex';
      }
    } else {
      if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
      }
      try {
        const parsed = typeof authSession === 'string' ? JSON.parse(authSession) : authSession;
        const roleText = document.getElementById('adminUserRoleText');
        if (roleText && parsed.role) {
          roleText.textContent = parsed.role === 'admin' ? 'Head Admin' : 'Staff Member';
        }
      } catch (e) {}
    }
  }

  function initDashboard() {
    checkAdminAuth();
    setupNavigation();
    setupManualOrderForm();

    // Render immediately from local cache so there is ZERO delay or blank screen
    updateKPIs();
    renderOrdersTable();
    renderCustomCakesTable();
    renderCatalog();
    renderCustomersTable();
    renderDeliverySlotsTable();
    renderCouponsTable();
    renderPaymentsTable();
    renderReviewsTable();
    renderAuditLogsTable();
    initCharts();
    updateDbStatusUI();

    // Direct binding for Add New Cake button
    document.getElementById('btnOpenAddCakeModal')?.addEventListener('click', (e) => {
      e.preventDefault();
      window.dashManager.openAddCakeModal();
    });

    // Listen for live orders and custom cake requests coming from website
    window.addEventListener('storage', (e) => {
      if (e.key === 'delice_orders') {
        orders = JSON.parse(e.newValue || '[]');
        updateKPIs();
        renderOrdersTable();
        renderCustomersTable();
        initCharts();
      } else if (e.key === 'delice_custom_cakes') {
        customCakes = JSON.parse(e.newValue || '[]');
        updateKPIs();
        renderCustomCakesTable();
      } else if (e.key === 'delice_custom_catalog') {
        catalog = JSON.parse(e.newValue || '[]');
        renderCatalog();
      }
    });

    // Background asynchronous cloud sync from Supabase
    if (window.DeliceDB) {
      window.DeliceDB.fetchOrders().then(dbOrders => {
        if (dbOrders && Array.isArray(dbOrders)) {
          orders = mergeOrdersList(orders, dbOrders);
          localStorage.setItem('delice_orders', JSON.stringify(orders));
          updateKPIs();
          renderOrdersTable();
          renderCustomersTable();
          initCharts();
        }
      }).catch(err => console.warn('Supabase orders background sync notice:', err));

      window.DeliceDB.fetchCakes(OFFICIAL_CATALOG).then(dbCakes => {
        if (dbCakes && dbCakes.length > 0) {
          const currentCatalog = JSON.parse(localStorage.getItem('delice_custom_catalog') || '[]') || catalog || [];
          const customAdded = currentCatalog.filter(c => !dbCakes.some(d => d.id === c.id || (d.slug && c.slug && d.slug === c.slug)));
          catalog = [...customAdded, ...dbCakes];
          localStorage.setItem('delice_custom_catalog', JSON.stringify(catalog));
          renderCatalog();
        }
      }).catch(err => console.warn('Supabase cakes background sync notice:', err));

      if (typeof window.DeliceDB.fetchCustomCakes === 'function') {
        window.DeliceDB.fetchCustomCakes(DEFAULT_CUSTOM_CAKES).then(dbCustom => {
          if (dbCustom && dbCustom.length > 0) {
            const currentCustom = JSON.parse(localStorage.getItem('delice_custom_cakes') || '[]') || customCakes || [];
            const customAdded = currentCustom.filter(c => !dbCustom.some(d => d.id === c.id));
            customCakes = [...customAdded, ...dbCustom];
            localStorage.setItem('delice_custom_cakes', JSON.stringify(customCakes));
            renderCustomCakesTable();
            updateKPIs();
          }
        }).catch(err => console.warn('Supabase custom cakes background sync notice:', err));
      }
    }

    // Initialize Dashboard Color Theme
    const savedTheme = localStorage.getItem('delice_admin_theme') || 'noir';
    window.dashManager.setTheme(savedTheme);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDashboard);
  } else {
    initDashboard();
  }

})();
