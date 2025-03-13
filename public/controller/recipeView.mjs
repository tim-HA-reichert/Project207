import TemplateManager from "../modules/templateManager.mjs";
import { API_ENDPOINTS_RECIPES, runRequest } from "../modules/apiHandler.mjs";

const templateFile = "./views/recipeView.html";

console.log("recipeView")

async function renderAllRecipes() {
    const appContainer = document.getElementById("app");
    try{
        const recipes = await runRequest(API_ENDPOINTS_RECIPES.GetAllRecipes);
        const template = await TemplateManager.fetchTemplate(templateFile);

        recipes.forEach(recipe => {
            const recipeData = {
                title: recipe.title,
                servings: recipe.servings,
                cookingTime: recipe.cookingtime,
                difficulty: recipe.difficulty,
                mealType: recipe.mealtype,
                nationality: recipe.nationality,
                ingredients: recipe.ingredients,
                instructions: recipe.instructions
            };
            TemplateManager.cloneTemplate(template, appContainer, recipeData);
        })
    } catch(error){
        console.log("Error rendering recipes: ", error)
    }
}


const recipeView = await renderAllRecipes();

const recipeViewController = {
    view: recipeView
}

export default recipeViewController

