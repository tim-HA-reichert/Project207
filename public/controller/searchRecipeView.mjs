import TemplateManager from "../modules/templateManager.mjs";
import { searchRecipes, getAllRecipes } from "../modules/apiHandler.mjs";


const recipeTemplateFile = "./views/recipeView.html";

export default async function renderSearchedRecipes(searchQuery) {
    const appContainer = document.getElementById("app");
    appContainer.innerHTML = '';

    try {
        const criteria = { search: searchQuery }
        const recipes = await searchRecipes(criteria);

        const template = await TemplateManager.fetchTemplate(recipeTemplateFile);

        if (!template) {
            console.error("Failed to load templates.");
            appContainer.innerHTML = '<div class="error">Error loading templates. Please try again later.</div>';
            return appContainer;
        }
        
        if (recipes && recipes.length > 0) {
            const resultsContainer = document.createElement('div');
            resultsContainer.className = 'search-results-container';
            
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
                        ingredients: Array.isArray(recipe.ingredients) 
                            ? recipe.ingredients 
                            : [],
                        instructions: Array.isArray(recipe.instructions) 
                            ? recipe.instructions 
                            : []
                    };
                    
                    const recipeElement = TemplateManager.cloneRecipeTemplate(template, resultsContainer, templateData);
                   
                    let editButton = recipeElement.querySelector('.edit-button');
                    let deleteButton = recipeElement.querySelector('.delete-button');
                    
                    editButton.addEventListener('click', async (e) => {

                        await renderEditRecipeView(recipe.recipe_id);
                    });
                    deleteButton.addEventListener('click', async (e) => {
                        e.preventDefault();
                        await deleteRecipe(recipe.recipe_id);
                    });

                } catch (err) {
                    console.error("Error processing recipe:", recipe.title, err);
                }
            });
            
            appContainer.appendChild(resultsContainer);
        } else {
            appContainer.innerHTML = '<div class="no-recipe">No recipes found matching your search criteria</div>';
        }
        
        return appContainer;
    } catch (error) {
        console.error("Error rendering recipes:", error);
        appContainer.innerHTML = '<div class="error">Error loading recipes. Please try again later.</div>';
        return appContainer;
    }
}
