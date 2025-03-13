import TemplateManager from '../modules/templateManager.mjs';
const templateFile = "./views/searchbarView.html";

// Create an async init function to handle the template loading and setup
async function initSearchbar() {
    const header = document.getElementById("searchbar-container");
    
    // Make sure header exists
    if (!header) {
        console.error("Navbar container not found in the DOM");
        return { view: document.createElement('div') }; // Return empty view
    }
    
    // Load and clone the template
    const template = await TemplateManager.fetchTemplate(templateFile);

    if (!template) {
        console.error("Failed to load search template");
        return searchContainer;
    }


    const searchBarView = TemplateManager.cloneTemplate(template, header);
    
    // Debug: Check what's in the template
    console.log("Template content:", searchBarView.innerHTML);
    
    // Get search elements - note template may have a root element
    // Try different selector approaches
    const searchInput = searchBarView.querySelector("#recipe-search") || 
                        searchBarView.querySelector(".search-input");
    const searchButton = searchBarView.querySelector("#search-button") || 
                         searchBarView.querySelector(".search-button");
    
    // Debug: Log what we found
    console.log("Search input found:", !!searchInput);
    console.log("Search button found:", !!searchButton);
    
    if (searchInput && searchButton) {
        function performSearch() {
            const searchTerm = searchInput.value;
            
            if (searchTerm !== "") {
                const encodedTerm = encodeURIComponent(searchTerm);
                
                const newUrl = `${window.location.pathname}?search=${encodedTerm}`;
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

// Create and export the controller with async initialization
const searchViewController = await initSearchbar();

export default searchViewController;