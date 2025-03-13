import TemplateManager from "../modules/templateManager.mjs";
import { searchRecipes, getAllRecipes } from "../modules/apiHandler.mjs";


const recipeTemplateFile = "./views/recipeView.html";

export default async function renderSearchedRecipes(searchQuery) {
    const appContainer = document.getElementById("app");
    appContainer.innerHTML = '';

    try {
        const criteria = { search: searchQuery }
        const recipes = await searchRecipes(criteria);
        console.log("Recipe fetched:", recipes);

        const template = await TemplateManager.fetchTemplate(recipeTemplateFile);
            console.log(template);

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
                        id: recipe.recipe_id,
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
                    const recipeElement = TemplateManager.cloneRecipeTemplate(template, resultsContainer, templateData);

                    const editButton = recipeElement.querySelector('.edit-button');
                    if (editButton) {
                        editButton.addEventListener('click', () => handleEditRecipe(recipe.recipe_id));
                    }

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

function handleEditRecipe(recipeId) {
    console.log(`Editing recipe with ID: ${recipeId}`);
    
    loadEditForm(recipeId);
}

async function loadEditForm(recipeId) {
    try {
        const recipe = await getRecipeById(recipeId);
        if (recipe) {
            console.log("Retrieved recipe for editing:", recipe);
            
            // Example: Load an edit template and show it in a modal or dedicated area
            // const editFormTemplate = await TemplateManager.fetchTemplate('./views/editRecipeForm.html');
            // TemplateManager.renderEditForm(editFormTemplate, recipe);
        }
    } catch (error) {
        console.error("Error loading recipe for editing:", error);
    }
}

