import TemplateManager from "../modules/templateManager.mjs";
import renderAllRecipes from "./showAllRecipeView.mjs";
import renderSearchedRecipes from "./searchRecipeView.mjs";
// Import your other view controllers here

const navbarTemplateFile = "./views/navbarView.html";

async function renderNavbar() {
    try {
        const template = await TemplateManager.fetchTemplate(navbarTemplateFile);
        if (!template) {
            console.error("Failed to load navbar template.");
            return null;
        }
        
        // Create and insert the navbar at the top of the body
        const navbarContainer = document.createElement("div");
        navbarContainer.id = "navbar-container";
        navbarContainer.appendChild(template);
        
        // Insert at the top of the body
        document.body.insertBefore(navbarContainer, document.body.firstChild);
        
        // Add event listeners to the navbar items
        setupNavigation();
        
        return navbarContainer;
    } catch (error) {
        console.error("Error rendering navbar:", error);
        return null;
    }
}

function setupNavigation() {
    const navItems = document.querySelectorAll('.navbar-item-inner');
    
    navItems.forEach(item => {
        item.addEventListener('click', async (event) => {
            event.preventDefault();
            const route = item.getAttribute('data-route');
            
            // Handle navigation
            await navigateTo(route);
            
            // Update active state
            navItems.forEach(navItem => {
                navItem.classList.remove('active');
            });
            item.classList.add('active');
        });
    });
}

async function navigateTo(route) {
    // Clear the app container
    const appContainer = document.getElementById("app");
    appContainer.innerHTML = '';
    
    // Switch based on the route
    switch(route) {
        case 'home':
            // Render the home page content
            appContainer.innerHTML = '<h1>Welcome to Recipe App</h1><p>Use the navigation to explore recipes.</p>';
            break;
            
        case 'all-recipes':
            // Use your existing renderAllRecipes function
            await renderAllRecipes();
            break;
            
        case 'saved-recipes':
            // Render saved recipes (implement this function or import it)
            appContainer.innerHTML = '<h1>Saved Recipes</h1><p>Your saved recipes will appear here.</p>';
            break;
            
        case 'register':
            // Render registration form (implement this function or import it)
            appContainer.innerHTML = '<h1>Register</h1><p>Registration form will go here.</p>';
            break;
            
        case 'add-recipe':
            // Render add recipe form (implement this function or import it)
            appContainer.innerHTML = '<h1>Add Recipe</h1><p>Recipe submission form will go here.</p>';
            break;
            
        default:
            appContainer.innerHTML = '<div class="error">Page not found</div>';
    }
}

// Create an object to export
const navbarViewController = {
    render: renderNavbar,
    navigateTo: navigateTo
};

export default navbarViewController;