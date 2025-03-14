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
    console.log("Fetched template:", template);
    return template;
};

/* TemplateManager.cloneRecipeTemplate = (template, target, data = {}) => {
    const clone = template.content.cloneNode(true);

    for (const key in data) {
        const value = data[key];
        if (!Array.isArray(value)) {
            const textNodes = document.createTreeWalker(clone, NodeFilter.SHOW_TEXT, null, false);
            
            while (textNodes.nextNode()) {
                let node = textNodes.currentNode;
                if (node.nodeValue.includes(`{{${key}}}`)) {
                    node.nodeValue = node.nodeValue.replaceAll(`{{${key}}}`, value);
                }
            }
        }
    }
    
    for (const key in data) {
        const value = data[key];
        
        if (Array.isArray(value)) {
            let container = clone.querySelector(`#${key}-list, .${key}-list, [data-array="${key}"]`);
            
            if (!container) {
                const textNodes = document.createTreeWalker(clone, NodeFilter.SHOW_TEXT, null, false);
                while (textNodes.nextNode()) {
                    let node = textNodes.currentNode;
                    if (node.nodeValue.includes(`{{${key}}}`)) {
                        node.nodeValue = node.nodeValue.replaceAll(`{{${key}}}`, value.join(', '));
                    }
                }
                continue;
            }
            

            value.forEach(item => {
                const listItem = document.createElement(container.tagName === 'UL' || container.tagName === 'OL' ? 'LI' : 'DIV');
                listItem.textContent = item;
                container.appendChild(listItem);
            });
        }
    }
    

    const appendedElement = target.appendChild(clone);
    
    // Find the edit button within the newly added element
    const editButton = appendedElement.querySelector('#edit-recipe-button, .edit-button');
    console.log("Found edit button after append:", editButton);
    
    return appendedElement;
};
 */
/* TemplateManager.cloneTemplate = (template, target, data = {}) => {
    const clone = template.content.cloneNode(true);
    let html = clone.innerHTML;

    for (let key of Object.keys(data)) {
        html = html.replaceAll(RegExp(`/\{\{${key}\}\}/gm`, data[key]));
    }

    clone.innerHTML = html;
    target.appendChild(clone);
    return clone;
}
 */

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
TemplateManager.createListElements = (items, listType = 'ul') => {
    const list = document.createElement(listType);
    
    items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        list.appendChild(li);
    });
    
    return list;
};

TemplateManager.cloneRecipeTemplate = (template, containerElement, recipeData) => {
    const recipeElement = template.cloneNode(true);
    
    if (recipeElement.querySelector('.recipe-title')) {
        recipeElement.querySelector('.recipe-title').textContent = recipeData.title;
    }
    
    if (recipeElement.querySelector('.recipe-difficulty')) {
        recipeElement.querySelector('.recipe-difficulty').textContent = recipeData.difficulty;
    }
    
    if (recipeElement.querySelector('.recipe-meal-type')) {
        recipeElement.querySelector('.recipe-meal-type').textContent = recipeData.mealtype;
    }
    
    if (recipeElement.querySelector('.recipe-nationality')) {
        recipeElement.querySelector('.recipe-nationality').textContent = recipeData.nationality;
    }
    
    if (recipeElement.querySelector('.recipe-servings')) {
        recipeElement.querySelector('.recipe-servings').textContent = `${recipeData.servings} servings`;
    }
    
    if (recipeElement.querySelector('.recipe-cooking-time')) {
        recipeElement.querySelector('.recipe-cooking-time').textContent = `${recipeData.cookingtime} minutes`;
    }
    
    // Add creation date if available
    if (recipeData.created_at && recipeElement.querySelector('.recipe-date')) {
        recipeElement.querySelector('.recipe-date').textContent = recipeData.created_at;
    }
    
    const ingredientsContainer = recipeElement.querySelector('.recipe-ingredients');
    if (ingredientsContainer && Array.isArray(recipeData.ingredients)) {
        const ingredientsList = TemplateManager.createListElements(recipeData.ingredients);
        ingredientsContainer.appendChild(ingredientsList);
    }

    const instructionsContainer = recipeElement.querySelector('.recipe-instructions');
    if (instructionsContainer && Array.isArray(recipeData.instructions)) {
        const instructionsList = TemplateManager.createListElements(recipeData.instructions, 'ol');
        instructionsContainer.appendChild(instructionsList);
    }
    

    recipeElement.dataset.recipeId = recipeData.recipe_id;
    

    if (containerElement) {
        containerElement.appendChild(recipeElement);
    }
    
    return recipeElement;
};

TemplateManager.createButtonContainer = (recipeElement) => {
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
















export default TemplateManager;