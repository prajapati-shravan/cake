/* =====================================================================
   DÉLICE & CO. — PROGRESSIVE WEB APP (PWA) SERVICE WORKER
   Strategy: Network-First for dynamic orders/API, Stale-While-Revalidate for UI assets
   ===================================================================== */

const CACHE_NAME = 'delice-v1.2';
const STATIC_ASSETS = [
    './',
    './index.html',
    './custom.html',
    './track.html',
    './style.css',
    './main.js',
    './products.json',
    './manifest.json',
    './assets/favicon.png',
    './assets/icon-192.png',
    './assets/icon-512.png',
    './assets/apple-touch-icon.png'
];

// Install: Pre-cache core shell assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(STATIC_ASSETS).catch(err => {
                console.warn('[PWA] Cache prefetch partial:', err);
            });
        }).then(() => self.skipWaiting())
    );
});

// Activate: Evict old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.map(k => {
                    if (k !== CACHE_NAME) {
                        return caches.delete(k);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch: Strategy depending on request type
self.addEventListener('fetch', event => {
    const req = event.request;
    const url = new URL(req.url);

    // Only cache GET requests
    if (req.method !== 'GET') return;

    // Do not cache Supabase, Razorpay, or Netlify API calls
    if (
        url.hostname.includes('supabase.co') ||
        url.hostname.includes('razorpay.com') ||
        url.pathname.startsWith('/api/') ||
        url.pathname.includes('/.netlify/functions/')
    ) {
        return;
    }

    // Network-First for HTML navigation
    if (req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html')) {
        event.respondWith(
            fetch(req)
                .then(networkRes => {
                    if (networkRes && networkRes.status === 200) {
                        const copy = networkRes.clone();
                        caches.open(CACHE_NAME).then(c => c.put(req, copy));
                    }
                    return networkRes;
                })
                .catch(() => {
                    return caches.match(req).then(cached => cached || caches.match('./index.html'));
                })
        );
        return;
    }

    // Stale-While-Revalidate for CSS, JS, images, fonts
    event.respondWith(
        caches.match(req).then(cached => {
            const fetchPromise = fetch(req).then(networkRes => {
                if (networkRes && networkRes.status === 200) {
                    const copy = networkRes.clone();
                    caches.open(CACHE_NAME).then(c => c.put(req, copy));
                }
                return networkRes;
            }).catch(() => null);

            return cached || fetchPromise;
        })
    );
});
