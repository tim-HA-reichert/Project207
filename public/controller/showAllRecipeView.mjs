import TemplateManager from "../modules/templateManager.mjs";
import { getAllRecipes, getRecipeById, deleteRecipe } from "../modules/apiHandler.mjs";
import renderEditRecipeView from "./editRecipeView.mjs";

const templateFile = "./views/recipeView.html";

export default async function renderAllRecipes() {
    const appContainer = document.getElementById("app");
    appContainer.innerHTML = '';
    
    try {
        const recipes = await getAllRecipes();
        
        const template = await TemplateManager.fetchTemplate(templateFile);
        
        if (!template) {
            console.error("Failed to load template.");
            return;
        }
        
        if (recipes && recipes.length > 0) {
            
            recipes.forEach((recipe, index) => {
                try {
                    const templateData = {
                        recipe_id: recipe.recipe_id || index,
                        title: recipe.title || "Untitled Recipe",
                        servings: recipe.servings || 1,
                        cookingtime: recipe.cookingtime || 0,
                        difficulty: recipe.difficulty || "not specified",
                        mealtype: recipe.mealtype || "not specified",
                        nationality: recipe.nationality || "not specified",
                        ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
                        instructions: Array.isArray(recipe.instructions) ? recipe.instructions : []
                    };
                    
                    const recipeElement = TemplateManager.cloneRecipeTemplate(template, appContainer, templateData);
                    console.log("Cloned Recipe Element:", recipeElement);
                    
                    let editButton = recipeElement.querySelector('.edit-button');
                    let deleteButton = recipeElement.querySelector('.delete-button');
                    
                    editButton.addEventListener('click', async (e) => {
                        e.preventDefault();
                        await renderEditRecipeView(recipe.recipe_id);
                    });
                    deleteButton.addEventListener('click', async (e) => {
                        e.preventDefault();
                        await deleteRecipe(recipe.recipe_id);
                    });
                    
                } catch (err) {
                    console.error(`Error processing recipe ${index}:`, err);
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
