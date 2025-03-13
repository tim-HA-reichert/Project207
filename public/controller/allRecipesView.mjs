import TemplateManager from "../modules/templateManager.mjs";
import { getAllRecipes } from "../modules/apiHandler.mjs";

const templateFile = "./views/recipeView.html";

async function renderAllRecipes() {
    const appContainer = document.getElementById("app");
    try {
        const recipes = await getAllRecipes();
        
        const template = await TemplateManager.fetchTemplate(templateFile);
        if (!template) {
            console.error("Failed to load template.");
            return;
        }
        
        if (recipes && recipes.length > 0) {
            appContainer.innerHTML = '';

            recipes.forEach(recipe => {
                try {
                    const templateData = {
                        title: recipe.title,
                        servings: recipe.servings,
                        cookingtime: recipe.cookingtime, 
                        difficulty: recipe.difficulty,
                        mealtype: recipe.mealtype, 
                        nationality: recipe.nationality,
                        ingredients: Array.isArray(recipe.ingredients) 
                            ? recipe.ingredients 
                            : [],
                        instructions: Array.isArray(recipe.instructions) 
                            ? recipe.instructions 
                            : []
                    };
                    
                    TemplateManager.cloneRecipeTemplate(template, appContainer, templateData);
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

const recipeView = await renderAllRecipes();

const recipeViewController = {
    view: recipeView
};

export default recipeViewController;