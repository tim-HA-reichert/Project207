import TemplateManager from "../modules/templateManager.mjs";
import runRequest from "../modules/apiHandler.mjs";
import { API_ENDPOINTS_RECIPES } from "../modules/apiHandler.mjs";

const templateFile = "./views/recipeView.html";
const appContainer = document.getElementById("app");

async function renderAllRecipes() {
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



recipeViewController = {
    view: async () => { await renderAllRecipes() },
}

export default recipeViewController


