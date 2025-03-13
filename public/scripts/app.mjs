import navbarViewController from "../controller/navbarView.mjs";
import searchViewController from "../controller/searchBarView.mjs";
import renderSearchedRecipes from "../controller/searchRecipeView.mjs";
import recipeViewController from "../controller/showAllRecipeView.mjs";

const registerServiceWorker = async () => {
    if("serviceWorker" in navigator){
        try {
            const registration = await navigator.serviceWorker.register("/service-worker.mjs", {
                scope:"/",
            });
                if(registration.installing){
                    console.log("Service worker installing");
                } else if (registration.waiting){
                    console.log("Service worker installed");
                } else if (registration.active){
                    console.log("Service worker active")
                }
        } catch(error){
            console.log(`Registration failed with ${error}`)
        }
    }
}

async function performSearch(){
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    
    if (searchQuery) {
        console.log("Search query found in URL:", searchQuery);
        await renderSearchedRecipes(searchQuery);
    } else {
        await recipeViewController.view;
    }
}

const initApp = async () => {
    if (!document.getElementById("app")) {
        const appContainer = document.createElement("div");
        appContainer.id = "app";
        document.body.appendChild(appContainer);
    }
    await navbarViewController.view;
    
    document.body.append(searchViewController.view);

    const showAllButton = searchBarView.querySelector("#show-all-recipes-button");
    showAllButton.addEventListener("click", async (e) => {
        e.preventDefault();
        await recipeViewController.view;
    });
    console.log(showAllButton);
}

document.addEventListener('DOMContentLoaded', () => {
    registerServiceWorker();
    initApp();
});

window.addEventListener('popstate', async () => {
    await performSearch();
});