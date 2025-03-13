import TemplateManager from "../modules/templateManager.mjs";
import { createRecipe } from "../modules/apiHandler.mjs";

const templateFile = "../views/createRecipeView.html"

const appBody = document.getElementById("app");


    const template = await TemplateManager.fetchTemplate(templateFile);
    const createRecipeView = TemplateManager.cloneRecipeTemplate(template, appBody);


    const newInstructionInput = document.getElementById('new-instruction');
    const addInstructionBtn = document.getElementById('add-instruction-btn');
    const instructionsList = document.getElementById('instructions-list');
    const instructionsData = document.getElementById('instructions-data');


    const createRecipeController = {
        view: createRecipeView
    }

