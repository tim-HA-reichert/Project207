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
                    
                    // Add click handler to edit button
                    editButton.addEventListener('click', async (e) => {
                        console.log("edit button pressed")
                        e.preventDefault();
                        console.log(`Editing recipe:`, recipe.recipe_id);
                        await renderEditRecipeView(recipe.recipe_id);
                    });
                    deleteButton.addEventListener('click', async (e) => {
                        e.preventDefault();
                        console.log("delete button pressed")
                        console.log(`Deleting recipe:`, recipe.recipe_id);
                        await deleteRecipe(recipe.recipe_id);
                    });
                    
                    handleEditRecipe(editButton, recipe.recipe_id)

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

function handleEditRecipe(aButton, recipeId) {
    if (aButton) {
        aButton.addEventListener('click', () => {
            console.log(`Editing recipe with ID: ${recipeId}`);
            console.log(recipe.recipe_id);
            loadEditForm(recipeId);
           });
    }
}

async function loadEditForm(recipeId) {
    try {
        const recipe = await getRecipeById(recipeId);
        if (recipe) {
            console.log("Retrieved recipe for editing:", recipe);
        }
    } catch (error) {
        console.error("Error loading recipe for editing:", error);
    }
}

