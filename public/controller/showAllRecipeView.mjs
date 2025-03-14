import TemplateManager from "../modules/templateManager.mjs";
import { getAllRecipes, getRecipeById, deleteRecipe } from "../modules/apiHandler.mjs";
import renderEditRecipeView from "./editRecipeView.mjs";

const templateFile = "./views/recipeView.html";

export default async function renderAllRecipes() {
    const appContainer = document.getElementById("app");
    appContainer.innerHTML = '';
    
    try {
        // Get all recipes from API
        const recipes = await getAllRecipes();
        console.log("Recipes loaded:", recipes.length);
        
        // Fetch the template
        const template = await TemplateManager.fetchTemplate(templateFile);
        console.log("Template fetched:", template);
        
        if (!template) {
            console.error("Failed to load template.");
            return;
        }
        
        // Process recipes if available
        if (recipes && recipes.length > 0) {
            console.log(`Rendering ${recipes.length} recipes`);
            
            recipes.forEach((recipe, index) => {
                try {
                    // Prepare recipe data with default values for safety
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
                    
                    let editButton = recipeElement.querySelector('.edit-button');
                    let deleteButton = recipeElement.querySelector('.delete-button');
                    
                    if (!editButton && !deleteButton) {
                        // Create button container if needed
                        const buttonContainer = TemplateManager.createButtonContainer(recipeElement);
                        
                        editButton = document.createElement('button');
                        editButton.className = 'edit-button';
                        editButton.textContent = 'Edit Recipe';
                        editButton.dataset.recipeId = recipe.recipe_id;

                        deleteButton = document.createElement('button');
                        deleteButton.className = 'delete-button';
                        deleteButton.textContent = 'Delete Recipe';
                        deleteButton.dataset.recipeId = recipe.recipe_id;

                        buttonContainer.appendChild(deleteButton);
                        buttonContainer.appendChild(editButton);
                    }
                    
                    // Add click handler to edit button
                    deleteButton.addEventListener('click', async (e) => {
                        e.preventDefault();
                        console.log(`Deleting recipe:`, recipe.recipe_id);
                        await deleteRecipe(recipe.recipe_id);
                    });
                    editButton.addEventListener('click', async (e) => {
                        e.preventDefault();
                        console.log(`Editing recipe:`, recipe.recipe_id);
                        await renderEditRecipeView(recipe.recipe_id);
                    });
                    
                } catch (err) {
                    console.error(`Error processing recipe ${index}:`, err);
                }
            });
            
            // Check if recipes were added
            console.log("App container now has", appContainer.children.length, "children");
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

function createFunctionButton(recipe, buttonText, functionForPurpose) {
    const button = document.createElement('button');
    button.className = buttonText.toLowerCase().replace(/\s+/g, '-') + '-button';
    button.textContent = buttonText;

    button.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            console.log(`Performing ${buttonText} on `, recipe);
            await functionForPurpose(recipe);
        } catch (error) {
            console.error("Error on button action:", error);
        }
    });   
    return button;
}