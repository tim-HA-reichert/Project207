import TemplateManager from "../modules/templateManager.mjs";
const templateFile = "navbarView.html";
const header = document.getElementById("navbar-container");

const template = TemplateManager.fetchTemplate(templateFile);
const navbarView = TemplateManager.cloneTemplate(template, header);

navbarViewController = {
    view: navbarView
}


export default navbarViewController