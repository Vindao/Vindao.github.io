const cacheName = 'v2'


// call Install event
self.addEventListener('install', e => {
    console.log('Service Worker: installed')
    
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
        fetch(e.request).then(res => {
            // Make clone of response
            const resClone = res.clone()
            // Open cache
            caches.open(cacheName).then(cache => {
                // Add response to cache
                cache.put(e.request, resClone)
            });
            return res
        }).catch(err => caches.match(e.request).then(res => res))
    )
})