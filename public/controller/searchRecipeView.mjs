import TemplateManager from "../modules/templateManager.mjs";
import { searchRecipes, getAllRecipes } from "../modules/apiHandler.mjs";


const recipeTemplateFile = "./views/recipeView.html";
const searchTemplateFile = "./views/recipeView.html";

async function renderSearchedRecipes(recipeId) {
    const appContainer = document.getElementById("app");

    try {
        const recipe = await searchRecipes(recipeId);
        console.log("Recipe fetched:", recipe);

        const recipeTemplate = await TemplateManager.fetchTemplate(recipeTemplateFile);
        const searchTemplate = await TemplateManager.fetchTemplate(searchTemplateFile);
        
        if (!recipeTemplate || !searchTemplate) {
            console.error("Failed to load templates.");
            appContainer.innerHTML = '<div class="error">Error loading templates. Please try again later.</div>';
            return appContainer;
        }
        
        if (recipe) {
            appContainer.innerHTML = '';

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
                
                console.log("Processing recipe:", templateData.title);
                TemplateManager.cloneTemplate(recipeTemplate, appContainer, templateData);
            } catch (err) {
                console.error("Error processing recipe:", recipe.title, err);
            }
        } else {
            appContainer.innerHTML = '<div class="no-recipe">Recipe not found</div>';
        }
        
        return appContainer;
    } catch (error) {
        console.error("Error rendering recipe:", error);
        appContainer.innerHTML = '<div class="error">Error loading recipe. Please try again later.</div>';
        return appContainer;
    }
}


const recipeView = await renderSingleRecipe();