import { registerRoute } from 'workbox-routing'
import * as strategies from 'workbox-strategies'
import { BroadcastUpdatePlugin } from 'workbox-broadcast-update'
import { ExpirationPlugin } from 'workbox-expiration'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { precacheAndRoute } from 'workbox-precaching'
precacheAndRoute(self.__WB_MANIFEST)

registerRoute(/api\/arknights/, new strategies.NetworkFirst(), 'GET')
registerRoute(/\.ico$/, new strategies.CacheFirst(), 'GET')
registerRoute(
  /https:\/\/andata.somedata.top\/data(.+)(?<!\.mp3)$/,
  new strategies.StaleWhileRevalidate({
    cacheName: 'oss-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [200],
      }),
      new BroadcastUpdatePlugin(),
    ],
  }),
  'GET'
)
registerRoute(
  /https:\/\/penguin-stats.io\/PenguinStats\/api\//,
  new strategies.StaleWhileRevalidate({
    cacheName: 'penguin-api-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [200],
      }),
      new ExpirationPlugin({
        maxEntries: 5,
        maxAgeSeconds: 600,
      }),
    ],
  }),
  'GET'
)
