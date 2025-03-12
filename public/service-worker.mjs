const HTTP_CODES = {
    SUCCESS: {
        OK: 200,
        CREATED: 201,
        ACCEPTED: 202,
        NO_CONTENT: 204,
    },
    CLIENT_ERROR: {
        NOT_FOUND: 404,
        UNAUTHORIZED: 401,
        BAD_INPUT: 400,
        FORBIDDEN: 403,
        REQ_TIMEOUT: 408
    }
}

const CACHE_VERSION = "v2.2";

const addResourceToCache = async (resources) => {
    const cache = await caches.open(CACHE_VERSION);
    await cache.addAll(resources);
}

const putInCache = async (request, response) => {
    const cache = await caches.open(CACHE_VERSION);
    await cache.put(request, response);
}


const cacheFirst = async ({request, preloadResPromise, fallbackURL, event}) => {
    const resFromCache = await caches.match(request);
    
    if(resFromCache){
        return resFromCache;
    }

    const preloadRes = await preloadResPromise;
    if(preloadRes){
        console.info("using preload response", preloadRes);
        event.waitUntil(putInCache(request, preloadRes.clone()));
        return preloadRes;
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

const deleteCache = async (key) => {
    await caches.delete(key);
}

const deleteOldCaches = async () =>{
    const cacheKeepList = [CACHE_VERSION];
    const keyList = await caches.keys();
    const cachesToDelete = keyList.filter((key) => !cacheKeepList.includes(key));
    await Promise.all(cachesToDelete.map(deleteCache));
} 

const enableNavigationPreload = async () => {
    if(self.registration.navigationPreload){
        await self.registration.navigationPreload.enable();
    }
}


self.addEventListener("activate", (event) => {
    event.waitUntil(
        Promise.all([
            deleteOldCaches(),
            enableNavigationPreload()
        ])
    )
})


self.addEventListener("install", (event) => {
    event.waitUntil(
        addResourceToCache([
            "/",
            "/index.html",
            "/scripts/loginScript.mjs",
            "/css/loginStyle.css",
            "/css/styles.css",
            "/login.html",
            "/modules/apiHandler.mjs",
            "/modules/templateManager.mjs",
            "/controller/navbarView.mjs",
            "/controller/recipeView.mjs",
            "/views/navbarView.html",
            "/views/recipeView.html",
        ])
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        cacheFirst({
            request: event.request, 
            preloadResPromise: event.preloadRes,
            fallbackURL: "/index.html", 
            event
        })
    );
});