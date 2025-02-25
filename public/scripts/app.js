const registerServiceWorker = async () => {
    if("serviceWorker" in navigator){
        try {
            const registration = await navigator.serviceWorker.register("../service-worker.mjs", {
                scope:"/",
            });
                if(registration.installing){
                    console.log("Service worker installing");
                } else if (registration.waiting){
                    console.log("Service worker isntalled");
                } else if (registration.active){
                    console.log("Service worker active")
                }
        } catch(error){
            console.log(`Reigstration failed with ${error}`)
        }
    }
}

registerServiceWorker();