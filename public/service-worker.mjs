const addResourceToCache = async (resources) => {
    const cache = await caches.open("v1");
    await cache.addAll(resources);
}

const cacheFirst = async (request) => {
    const resFromCache = await caches.match(request);
    
    if(resFromCache){
        return resFromCache;
    }

    return fetch(request);
}



self.addEventListener("install", (e) => {
    e.waitUntil(
        addResourceToCache([
            "/",
            "/index.html",
            "/scripts/loginScript.mjs",
            "/css/loginStyle.css",
            "/css/styles.css",
            "/login.html"
        ])
    );
});





self.addEventListener("fetch", (event) => {
    event.respondWith(cacheFirst(event.request));
});

