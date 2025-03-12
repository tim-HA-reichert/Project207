import TemplateManager from "../modules/templateManager.mjs";
import { API_ENDPOINTS_RECIPES, runRequest } from "../modules/apiHandler.mjs";

const templateFile = "./views/recipeView.html";

console.log("recipeView")

async function renderAllRecipes() {
    const appContainer = document.getElementById("app");
    try{
        const recipes = await runRequest(API_ENDPOINTS_RECIPES.GetAllRecipes);
        const template = TemplateManager.fetchTemplate(templateFile);

        recipes.forEach(recipe => {
            TemplateManager.cloneTemplate(template, appContainer, recipe);
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

