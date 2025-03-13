import TemplateManager from '../modules/templateManager.mjs';

const templateFile = "./views/searchbarView.html";

export default async function initSearchbar() {
    const header = document.getElementById("navbar-container");
    
    if (!header) {
        console.error("Navbar container not found in the DOM");
    }
    

    const template = await TemplateManager.fetchTemplate(templateFile);
    const searchBarView = TemplateManager.staticCloneTemplate(template, header);
    
    const searchInput = searchBarView.querySelector("#recipe-search");
    const searchButton = searchBarView.querySelector("#search-button");
    const showAllButton = searchBarView.querySelector("#show-all-recipes-button")

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

    } else {
        console.error("No button or input found in the template:", templateFile);
        console.log("Template structure:", searchBarView.outerHTML);
    }
    return searchBarView;
}

