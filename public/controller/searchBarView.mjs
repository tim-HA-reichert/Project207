import TemplateManager from '../modules/templateManager.mjs';
const templateFile = "./views/searchbarView.html";

const header = document.getElementById("navbar-container");

const template = await TemplateManager.fetchTemplate(templateFile);
const searchbarView = TemplateManager.cloneTemplate(template, header);

const searchViewController = {
    view: searchbarView
}

export default searchViewController