const cacheName = 'v1'

const cacheAssets = [
    'index.html',
    'about.html',
    '/css/style.css',
    '/js/main.js'
]

// call Install event
self.addEventListener('install', e => {
    console.log('Service Worker: installed')
    e.waitUntil(
        caches.open(cacheName).then(cache => {
            console.log('Service Worker: Caching files');
            cache.addAll(cacheAssets)
        }).then(() => self.skipWaiting())
    )
})

// call Activate event
self.addEventListener('activate', e => {
    console.log('Service Worker: activated')
    // remove unwanted caches
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if(cache !== cacheName) {
                        console.log('Service Worker: Clearing old cache')
                        return caches.delete(cache)
                    }
                })
            )
        })
    )
})

// Call Fetch Event
self.addEventListener('fetch', e => {
    console.log('Service Worker: Fetching')
    e.respondWith(
        fetch(e.request).catch(() => caches.match(e.request))
    )
})