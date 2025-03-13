import TemplateManager from "../modules/templateManager.mjs";
import { searchRecipes, getAllRecipes } from "../modules/apiHandler.mjs";


const recipeTemplateFile = "./views/recipeView.html";

export default async function renderSearchedRecipes(criteria) {
    const appContainer = document.getElementById("app");
    appContainer.innerHTML = '';

    try {
        const recipes = await searchRecipes(criteria);
        console.log("Recipe fetched:", recipes);

        const recipeTemplate = await TemplateManager.fetchTemplate(recipeTemplateFile);
            console.log(recipeTemplate);

        if (!recipeTemplate) {
            console.error("Failed to load templates.");
            appContainer.innerHTML = '<div class="error">Error loading templates. Please try again later.</div>';
            return appContainer;
        }
        
        if (recipes && recipes.length > 0) {
            const resultsContainer = document.createElement('div');
            resultsContainer.className = 'search-results-container';

            resultsContainer.appendChild(searchHeader);
            
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
                    
                    console.log("Processing recipe:", templateData.title);
                    TemplateManager.cloneRecipeTemplate(recipeTemplate, resultsContainer, templateData);
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


