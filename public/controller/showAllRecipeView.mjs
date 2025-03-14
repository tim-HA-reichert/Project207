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
                    
                    TemplateManager.cloneRecipeTemplate(template, appContainer, templateData);
                    const editRecipeButton = createFunctionButton(recipe.recipe_id, `edit-button`, renderEditRecipeView);
                    template.appendChild(editRecipeButton);

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

function createFunctionButton(recipe, buttonText, functionForPurpose) {
    const button = document.createElement('button');
    button.className = buttonText;
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