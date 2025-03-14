const TemplateManager = {};

TemplateManager.fetchTemplate = async (path) => {
    const response = await fetch(path);
    if (!response.ok) {
        throw new Error(`Failed to fetch template: ${response.status}`);
    }
    const rawTemplate = await response.text();

    const div = document.createElement("div");
    div.innerHTML = rawTemplate;
    let template = div.firstChild;

    return template;
};

TemplateManager.staticCloneTemplate = (template, target) => {

    if (template && template.tagName === 'TEMPLATE') {
        const clone = template.content.cloneNode(true);
        
        target.appendChild(clone);
        
        return target;
    } else {
        console.error("Not a valid template element");
        return null;
    }
};
TemplateManager.cloneRecipeTemplate = (template, containerElement, recipeData) => {
    if (template.tagName === 'TEMPLATE') {
        const fragment = template.content.cloneNode(true);
        
        TemplateManager.populateRecipeData(fragment, recipeData);
        
        if (containerElement) {
            containerElement.appendChild(fragment);
        }
        
        if (containerElement && containerElement.lastElementChild) {
            return containerElement.lastElementChild;
        } else {
            return fragment.firstElementChild;
        }
    } else {
        const clone = template.cloneNode(true);
        
        TemplateManager.populateRecipeData(clone, recipeData);
        
        if (containerElement) {
            containerElement.appendChild(clone);
        }
        
        return clone;
    }
};

TemplateManager.populateRecipeData = (element, recipeData) => {

    const setTextContent = (selector, value) => {
        const el = element.querySelector(selector);
        if (el) {
            el.textContent = value;
        }
    };
    
    setTextContent('.recipe-title', recipeData.title);
    setTextContent('.recipe-servings', `${recipeData.servings} servings`);
    setTextContent('.recipe-cooking-time', `${recipeData.cookingtime} minutes`);
    setTextContent('.recipe-difficulty', recipeData.difficulty);
    setTextContent('.recipe-type', recipeData.mealtype);
    setTextContent('.recipe-nationality', recipeData.nationality);
    
    const ingredientsList = element.querySelector('#ingredients-list');
    if (ingredientsList && Array.isArray(recipeData.ingredients)) {
        ingredientsList.innerHTML = ''; // Clear any default items
        recipeData.ingredients.forEach(ingredient => {
            const li = document.createElement('li');
            li.textContent = ingredient;
            ingredientsList.appendChild(li);
        });
    }
    
    const instructionsList = element.querySelector('#instructions-list');
    if (instructionsList && Array.isArray(recipeData.instructions)) {
        instructionsList.innerHTML = ''; // Clear any default items
        recipeData.instructions.forEach(instruction => {
            const li = document.createElement('li');
            li.textContent = instruction;
            instructionsList.appendChild(li);
        });
    }
    
    const mainContainer = element.querySelector('.recipe-card') || 
                         element.querySelector('#recipe-container') || 
                         element;
    if (mainContainer) {
        mainContainer.dataset.recipeId = recipeData.recipe_id;
    }
};

TemplateManager.createButtonContainer = (recipeElement) => {
    if (!recipeElement) {
        console.error("Cannot create button container: No recipe element provided");
        return null;
    }
    
    const existingContainer = recipeElement.querySelector('.button-container') || 
                             recipeElement.querySelector('.recipe-actions');
    
    if (existingContainer) {
        return existingContainer;
    }
    
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';
    
    const headerElement = recipeElement.querySelector('.recipe-header');
    if (headerElement) {
        headerElement.appendChild(buttonContainer);
    } else {
        recipeElement.appendChild(buttonContainer);
    }
    
    return buttonContainer;
};

TemplateManager.staticCloneTemplate = (template, target) => {
    if (template && template.tagName === 'TEMPLATE') {
        const clone = template.content.cloneNode(true);
        target.appendChild(clone);
        return target;
    } else {
        console.error("Not a valid template element");
        return null;
    }
};
export default TemplateManager;