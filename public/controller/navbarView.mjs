import TemplateManager from '../modules/templateManager.mjs';
const templateFile = "/public/views/navbarView.html";

console.log("navbarview")

const header = document.getElementById("navbar-container");

const template = await TemplateManager.fetchTemplate(templateFile);
const navbarView = TemplateManager.cloneTemplate(template, header);

const navbarViewController = {
    view: navbarView
}


export default navbarViewController