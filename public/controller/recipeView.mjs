import TemplateManager from "../modules/templateManager.mjs";
const templateFile = "/views/recipeView.html";
const appContainer = document.getElementById("app");

const template = TemplateManager.fetchTemplate(templateFile);
const recipeView = TemplateManager.cloneTemplate(template, appContainer);

recipeViewController = {
    view: recipeView
}

export default recipeViewController