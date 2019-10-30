
workbox.core.skipWaiting();
workbox.core.clientsClaim();
workbox.routing.registerRoute(/api\/arknights/, new workbox.strategies.NetworkFirst(), 'GET');
workbox.routing.registerRoute(/\.ico$/, new workbox.strategies.CacheFirst(), 'GET');
workbox.routing.registerRoute(/https:\/\/andata.somedata.top\/data(.+)(?<!\.mp3)$/, new workbox.strategies.StaleWhileRevalidate({ 'cacheName': 'oss-cache', plugins: [new workbox.cacheableResponse.Plugin({ statuses: [0, 200] }), new workbox.broadcastUpdate.Plugin({ channelName: 'oss-update' })] }), 'GET');
workbox.routing.registerRoute(/https:\/\/unpkg.com\/spritejs\/dist\/spritejs.min.js/, new workbox.strategies.CacheFirst({ 'cacheName': 'spritejs', plugins: [new workbox.cacheableResponse.Plugin({ statuses: [0, 200] })] }), 'GET');
workbox.routing.registerRoute(/https:\/\/penguin-stats.io\/PenguinStats\/api\//, new workbox.strategies.StaleWhileRevalidate({ 'cacheName': 'penguin-api-cache', plugins: [new workbox.cacheableResponse.Plugin({ statuses: [0, 200] }), new workbox.expiration.Plugin({ maxEntries: 5, maxAgeSeconds: 600, purgeOnQuotaError: false })] }), 'GET');
workbox.routing.registerRoute(/https:\/\/somedata.top\/Arknights/, new workbox.strategies.StaleWhileRevalidate({ plugins: [new workbox.cacheableResponse.Plugin({ statuses: [0, 200] })] })}), 'GET');
