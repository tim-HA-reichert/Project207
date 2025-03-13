import navbarViewController from "../controller/navbarView.mjs";
import searchViewController from "../controller/searchBarView.mjs";
import renderSearchedRecipes from "../controller/searchRecipeView.mjs";
import recipeViewController from "../controller/allRecipesView.mjs"

console.log("App script loaded");
const registerServiceWorker = async () => {
    if("serviceWorker" in navigator){
        try {
            const registration = await navigator.serviceWorker.register("/service-worker.mjs", {
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
const initApp = async () => {
    document.body.append(navbarViewController.view);
    document.body.append(searchViewController.view);
    
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    
    if (searchQuery) {
        console.log("Search query found in URL:", searchQuery);
        await renderSearchedRecipes({ search: searchQuery });
    } else {
        document.body.append(recipeViewController.view);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    registerServiceWorker();
    initApp();
});

window.addEventListener('popstate', async () => {
    return await renderSearchedRecipes({ search: searchQuery });
})