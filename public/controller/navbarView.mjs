import TemplateManager from "../modules/templateManager.mjs";
import recipeViewController from "./showAllRecipeView.mjs";
import createRecipeViewController from "./createRecipeView.mjs";

const templateFile = "./views/navbarView.html";

async function renderNavbar() {
    try {
        const template = await TemplateManager.fetchTemplate(templateFile);
        if (!template) {
            console.error("Failed to load navbar template.");
            return;
        }
        
        // Create navbar container
        const navbarContainer = document.getElementById("navbar-container");
        TemplateManager.staticCloneTemplate(template, navbarContainer);
        
        // Add event listeners to navigation items
        setupNavigation(navbarContainer);
        
        return navbarContainer;
    } catch (error) {
        console.error("Error rendering navbar:", error);
        return null;
    }
}

function setupNavigation(navbarContainer) {
    const navItems = navbarContainer.querySelectorAll('.navbar-item-inner');
    
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
    const appContainer = document.getElementById("app");
    if (!appContainer) {
        console.error("App container not found");
        return;
    }
    
    appContainer.innerHTML = '';
    
    switch(route) {
        case 'home':
            appContainer.innerHTML = '<h1>Welcome to Recipe App</h1><p>Use the navigation to explore recipes.</p>';
            break;
            
        case 'all-recipes':
            await recipeViewController.view;
            break;
            
        case 'create-recipe':
            await createRecipeViewController.view;
            break;
            
        case 'saved-recipes':
            appContainer.innerHTML = '<h1>Saved Recipes</h1><p>Your saved recipes will appear here.</p>';
            break;
            
        case 'register':
            appContainer.innerHTML = '<h1>Register</h1><p>Registration form will go here.</p>';
            break;
            
        default:
            appContainer.innerHTML = '<div class="error">Page not found</div>';
    }
}

// Render the navbar when this module is imported
const navbarView = await renderNavbar();

// Create view controller object to export
const navbarViewController = {
    view: navbarView,
    navigateTo: navigateTo
};

export default navbarViewController;