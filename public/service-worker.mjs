

const addResourceToCache = async (resources) => {
    const cache = await caches.open("v1");
    await cache.addAll(resources);
}


self.addEventListener("install", (e) => {
    e.waitUntil(
        addResourceToCache([
            "/",
            "/index.html",
            "./scripts/loginScript.mjs",
            "./css/loginStyle.css",
            "./css/styles.css",
            "/login.html"
        ])
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(caches.match(event.request));
});

