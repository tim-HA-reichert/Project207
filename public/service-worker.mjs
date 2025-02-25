const addResourceToCache = async (resources) => {
    const cache = await caches.open("v1");
    await cache.addAll(resources);
}

const putInCache = async (request, response) => {
    const cache = await caches.open("v1");
    await cache.put(request, response);
}

const cacheFirst = async (request, event) => {
    const resFromCache = await caches.match(request);
    
    if(resFromCache){
        return resFromCache;
    }

    const resFromNetwork = await fetch(request);
    event.waitUntil(putInCache(request, resFromNetwork.clone()));
    return resFromNetwork;

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
    event.respondWith(cacheFirst(event.request, event));
});

