/* =====================================================
   Service Worker - コレクションニュースリーダー
   ===================================================== */

const CACHE_NAME = 'collection-reader-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.jsdelivr.net/npm/localforage@1.10.0/dist/localforage.min.js'
];

/* ---- Install: キャッシュを事前読み込み ---- */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS).catch(err => {
        console.warn('SW: キャッシュ失敗 (一部)', err);
      });
    })
  );
  self.skipWaiting();
});

/* ---- Activate: 古いキャッシュを削除 ---- */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

/* ---- Fetch: Network-first for API, Cache-first for assets ---- */
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // API calls: ネットワーク優先
  if (
    url.hostname.includes('rss2json.com') ||
    url.hostname.includes('allorigins.win') ||
    url.hostname.includes('corsproxy.io') ||
    url.hostname.includes('news.google.com')
  ) {
    event.respondWith(
      fetch(event.request).catch(() =>
        new Response(JSON.stringify({ status: 'error', message: 'オフライン' }), {
          headers: { 'Content-Type': 'application/json' }
        })
      )
    );
    return;
  }

  // App assets: Cache-first
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).then(response => {
        if (response.ok && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      });
    }).catch(() => {
      // オフラインフォールバック
      if (event.request.destination === 'document') {
        return caches.match('./index.html');
      }
    })
  );
});

/* ---- Background Sync (オプション) ---- */
self.addEventListener('sync', event => {
  if (event.tag === 'sync-feeds') {
    event.waitUntil(
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({ type: 'BACKGROUND_SYNC' });
        });
      })
    );
  }
});
