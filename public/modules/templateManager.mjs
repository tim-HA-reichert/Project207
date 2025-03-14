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

TemplateManager.processPlaceholders = (element, data) => {

    const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    
    const textNodes = [];
    let node;
    while (node = walker.nextNode()) {
        textNodes.push(node);
    }
    
    textNodes.forEach(textNode => {
        let content = textNode.nodeValue;
        const placeholderPattern = /\{\{([^}]+)\}\}/g;
        let match;
        
        while (match = placeholderPattern.exec(content)) {
            const placeholder = match[0];
            const key = match[1].trim();
            
            if (data[key] !== undefined) {
                content = content.replace(placeholder, data[key]);
            }
        }
        
        textNode.nodeValue = content;
    });
};

TemplateManager.cloneRecipeTemplate = (template, containerElement, recipeData) => {
    if (template && template.tagName === 'TEMPLATE') {
    const recipeElement = template.content.cloneNode(true);
    
    TemplateManager.processPlaceholders(recipeElement, recipeData);
    

    const ingredientsList = recipeElement.querySelector('#ingredients-list') || 
                            recipeElement.querySelector('.ingredients-list');
    if (ingredientsList && Array.isArray(recipeData.ingredients)) {
        recipeData.ingredients.forEach(ingredient => {
            const li = document.createElement('li');
            li.textContent = ingredient;
            ingredientsList.appendChild(li);
        });
    }
    
    const instructionsList = recipeElement.querySelector('#instructions-list') || 
                             recipeElement.querySelector('.instructions-list');
    if (instructionsList && Array.isArray(recipeData.instructions)) {
        recipeData.instructions.forEach((instruction, index) => {
            const li = document.createElement('li');
            li.textContent = instruction;
            instructionsList.appendChild(li);
        });
    }
    
    if (containerElement) {
        containerElement.appendChild(recipeElement);
    }
    
    return recipeElement;
    }
};

TemplateManager.createButtonContainer = (recipeElement) => {
    const existingContainer = recipeElement.querySelector('.button-container') || 
                             recipeElement.querySelector('.recipe-actions');
    
    if (existingContainer) {
        return existingContainer;
    }
    
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';
    
    const headerElement = recipeElement.querySelector('.recipe-container');
    if (headerElement) {
        headerElement.appendChild(buttonContainer);
    } else {
        recipeElement.appendChild(buttonContainer);
    }
    
    return buttonContainer;
};
















export default TemplateManager;