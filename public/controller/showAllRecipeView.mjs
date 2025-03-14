import TemplateManager from "../modules/templateManager.mjs";
import { getAllRecipes, getRecipeById } from "../modules/apiHandler.mjs";
import renderEditRecipeView from "./editRecipeView.mjs";

const templateFile = "./views/recipeView.html";

export default async function renderAllRecipes() {
    const appContainer = document.getElementById("app");
    appContainer.innerHTML = '';
    try {
        const recipes = await getAllRecipes();
        console.log("Recipes loaded:", recipes); // Log to verify structure
        
        const template = await TemplateManager.fetchTemplate(templateFile);
        console.log("Template content:", template.outerHTML); 
        if (!template) {
            console.error("Failed to load template.");
            return;
        }
        
        if (recipes && recipes.length > 0) {
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
                    
                    if (template) {

                        const recipeElement = TemplateManager.cloneRecipeTemplate(template, appContainer, templateData);
                        console.log("Cloned recipe element:", recipeElement);
   
                        const buttonContainer = TemplateManager.createButtonContainer(recipeElement);
                        
                        const editButton = document.createElement('button');
                        editButton.className = 'edit-button';
                        editButton.textContent = 'Edit Recipe';
                        editButton.dataset.recipeId = recipe.recipe_id;
                        
                        editButton.addEventListener('click', async (e) => {
                            e.preventDefault();
                            console.log(`Editing recipe:`, recipe.recipe_id);
                            await renderEditRecipeView(recipe.recipe_id);
                        });
                        
                        // Add the button to the container
                        buttonContainer.appendChild(editButton);

                    }
                } catch (err) {
                    console.error("Error processing recipe:", recipe.title, err);
                }
            });
        } else {
            appContainer.innerHTML = '<div class="no-recipes">No recipes found</div>';
        }
        console.log("Container after appending:", appContainer?.children?.length || "No container");
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
            console.error("Error loading recipe for editing:", error);
        }
    });   
    return button;
}

async function loadEditForm(recipeId) {
    try {
        const recipe = await getRecipeById(recipeId);
        await renderEditRecipeView(recipe);
    } catch (error) {
        console.error("Error loading recipe for editing:", error);
    }
}