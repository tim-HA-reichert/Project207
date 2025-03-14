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
TemplateManager.cloneRecipeTemplate = (template, containerElement, recipeData) => {
    if (template.tagName === 'TEMPLATE') {
        const fragment = template.content.cloneNode(true);
        
        // Fill in the data in the fragment
        TemplateManager.populateRecipeData(fragment, recipeData);
        
        // Append the fragment to the container
        if (containerElement) {
            containerElement.appendChild(fragment);
        }
        
        // Return the fragment's first element (which is now in the DOM)
        // Note: We can't return the fragment itself since it's empty after appending
        if (containerElement && containerElement.lastElementChild) {
            return containerElement.lastElementChild;
        } else {
            // If not appended, we need to find the main element in the fragment
            return fragment.firstElementChild;
        }
    } else {
        const clone = template.cloneNode(true);
        
        TemplateManager.populateRecipeData(clone, recipeData);
        
        // Append the clone to the container
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
    
    // Set basic recipe information
    setTextContent('.recipe-title', recipeData.title);
    setTextContent('.recipe-servings', `${recipeData.servings} servings`);
    setTextContent('.recipe-cooking-time', `${recipeData.cookingtime} minutes`);
    setTextContent('.recipe-difficulty', recipeData.difficulty);
    setTextContent('.recipe-type', recipeData.mealtype);
    setTextContent('.recipe-nationality', recipeData.nationality);
    
    // Handle ingredients list
    const ingredientsList = element.querySelector('#ingredients-list');
    if (ingredientsList && Array.isArray(recipeData.ingredients)) {
        ingredientsList.innerHTML = ''; // Clear any default items
        recipeData.ingredients.forEach(ingredient => {
            const li = document.createElement('li');
            li.textContent = ingredient;
            ingredientsList.appendChild(li);
        });
    }
    
    // Handle instructions list
    const instructionsList = element.querySelector('#instructions-list');
    if (instructionsList && Array.isArray(recipeData.instructions)) {
        instructionsList.innerHTML = ''; // Clear any default items
        recipeData.instructions.forEach(instruction => {
            const li = document.createElement('li');
            li.textContent = instruction;
            instructionsList.appendChild(li);
        });
    }
    
    // Set recipe ID as a data attribute on the main container
    const mainContainer = element.querySelector('.recipe-card') || 
                         element.querySelector('#recipe-container') || 
                         element;
    if (mainContainer) {
        mainContainer.dataset.recipeId = recipeData.recipe_id;
    }
};

// Create a button container for multiple actions
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