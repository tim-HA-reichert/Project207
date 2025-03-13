import TemplateManager from "../modules/templateManager.mjs";
import { getAllRecipes } from "../modules/apiHandler.mjs";

const templateFile = "./views/recipeView.html";

console.log("recipeView");

async function renderAllRecipes() {
    const appContainer = document.getElementById("app");
    try {
        const recipes = await getAllRecipes();
        console.log("Recipes fetched:", recipes);
        
        const template = await TemplateManager.fetchTemplate(templateFile);
        console.log("Template loaded");
        
        if (recipes && recipes.length > 0) {
            appContainer.innerHTML = '';
            
            recipes.forEach(recipe => {
                try {
                    const templateData = {
                        recipe_id: recipe.recipe_id,
                        title: recipe.title,
                        servings: recipe.servings,
                        cookingtime: recipe.cookingtime,
                        difficulty: recipe.difficulty,
                        mealtype: recipe.mealtype,
                        nationality: recipe.nationality,
                        // Join arrays for display
                        ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients.join(', ') : '',
                        instructions: Array.isArray(recipe.instructions) ? recipe.instructions.join(' ') : ''
                    };
                    
                    console.log("Processing recipe:", templateData.title);
                    TemplateManager.cloneTemplate(template, appContainer, templateData);
                } catch (err) {
                    console.error("Error processing recipe:", recipe.title, err);
                }
            });
        } else {
            appContainer.innerHTML = '<div class="no-recipes">No recipes found</div>';
        }
        
        return appContainer;
    } catch (error) {
        console.error("Error rendering recipes:", error);
        appContainer.innerHTML = '<div class="error">Error loading recipes. Please try again later.</div>';
        return appContainer;
    }
}

// Initialize view
const recipeView = await renderAllRecipes();

const recipeViewController = {
    view: recipeView
};

export default recipeViewController;