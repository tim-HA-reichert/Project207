import TemplateManager from '../modules/templateManager.mjs';
const templateFile = "./views/searchbarView.html";

const header = document.getElementById("navbar-container");

const template = await TemplateManager.fetchTemplate(templateFile);
const searchbarView = await TemplateManager.cloneTemplate(template, header);

const searchInput = searchbarView.querySelector("#recipe-search");
const searchButton = searchbarView.querySelector("#search-button");

if(searchInput && searchButton){
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
searchInput.addEventListener("keypress", async (e) => {
    e.preventDefault();
    if (e.key === "Enter") {
        performSearch();
    }
});
} else {
    console.log("No button or input found.")
}
const searchViewController = {
    view: searchbarView
}

export default searchViewController