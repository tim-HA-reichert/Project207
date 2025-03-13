import TemplateManager from '../modules/templateManager.mjs';
import renderAllRecipes from '../controller/showAllRecipeView.mjs'

const templateFile = "./views/searchbarView.html";

async function initSearchbar() {
    const header = document.getElementById("searchbar-container");
    
    if (!header) {
        console.error("Navbar container not found in the DOM");
    }
    

    const template = await TemplateManager.fetchTemplate(templateFile);
    const searchBarView = TemplateManager.staticCloneTemplate(template, header);
    
    const searchInput = searchBarView.querySelector("#recipe-search") || 
                        searchBarView.querySelector(".search-input");
    const searchButton = searchBarView.querySelector("#search-button") || 
                         searchBarView.querySelector(".search-button");
    const showAllButton = searchBarView.querySelector("#show-all-recipes-button");
    
    console.log(showAllButton);
    
    if (searchInput && searchButton) {
        function performSearch() {
            const searchTerm = searchInput.value;
            
            if (searchTerm !== "") {
                const encodedTerm = encodeURIComponent(searchTerm);
                
                const newUrl = `${window.location.pathname}?search=${encodedTerm}`;
                window.history.pushState({}, '', newUrl);
                
                window.dispatchEvent(new PopStateEvent('popstate'));
            } else {
                const newUrl = `${window.location.pathname}`;
                window.history.pushState({}, '', newUrl);
                
                window.dispatchEvent(new PopStateEvent('popstate'));
            }
        }
        
        searchButton.addEventListener("click", (e) => {
            e.preventDefault();
            performSearch();
        });
        
        searchInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                performSearch();
            }
        });

        showAllButton.addEventListener("click", async (e) => {
            e.preventDefault();
            await renderAllRecipes();
        })

    } else {
        console.error("No button or input found in the template:", templateFile);
        console.log("Template structure:", searchBarView.outerHTML);
    }
    return searchBarView;
}

const searchViewController = await initSearchbar();

export default searchViewController;