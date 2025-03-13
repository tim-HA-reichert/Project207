import TemplateManager from '../modules/templateManager.mjs';
const templateFile = "./views/searchbarView.html";

const header = document.getElementById("navbar-container");

const template = await TemplateManager.fetchTemplate(templateFile);
const searchbarView = await TemplateManager.cloneTemplate(template, header);

const searchInput = searchbarView.getElementById("recipe-search");
const searchButton = searchbarView.getElementById("search-button");

function performSearch() {
    const searchTerm = searchInput.value;
    
    if (searchTerm !== "") {
        const encodedTerm = encodeURIComponent(searchTerm);
        
        const newUrl = `${window.location.pathname}?search=${encodedTerm}`;
        window.history.pushState({}, '', newUrl);
        
        renderSearchedRecipes({ search: searchTerm });
    }
}

searchButton.addEventListener("click", performSearch);
searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        performSearch();
    }
});

const searchViewController = {
    view: searchInput
}

export default searchViewController