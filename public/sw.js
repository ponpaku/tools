const CACHE_NAME = 'ponpaku-tools-v1'
const urlsToCache = [
  '/',
  '/tools/character-counter',
  '/tools/base64',
  '/tools/qr-generator',
  '/tools/json-formatter',
  '/tools/hash-generator',
  '/tools/full-half-converter',
  '/manifest.json'
]

// インストール時のキャッシュ設定
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache')
        return cache.addAll(urlsToCache)
      })
  )
})

// フェッチ時のキャッシュ戦略
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // キャッシュに存在する場合はそれを返す
        if (response) {
          return response
        }

        return fetch(event.request).then(
          (response) => {
            // レスポンスが有効でない場合はそのまま返す
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response
            }

            // レスポンスをクローンしてキャッシュに保存
            const responseToCache = response.clone()

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache)
              })

            return response
          }
        )
      })
  )
})

// アクティベート時の古いキャッシュ削除
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME]

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})