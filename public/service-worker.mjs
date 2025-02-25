import HTTP_CODES from "../utils/httpCodes.mjs";

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

    try{
        
        const resFromNetwork = await fetch(request);
        event.waitUntil(putInCache(request, resFromNetwork.clone()));
        
        return resFromNetwork;
    }catch(error){
        
        const fallbackRes = await caches.match(fallbackURL);
            if(fallbackRes){
                return fallbackRes;
            }
        
        return new Response("Network error happened", {
            status: HTTP_CODES.CLIENT_ERROR.REQ_TIMEOUT,
            headers: { "Content-Type": "text/plain" },
        });
    }
};



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
    event.respondWith(
        cacheFirst({
            request: event.request,
            fallbackURL: "/index.html",
            event
            })
        );
});

