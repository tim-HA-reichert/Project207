const TemplateManager = {};

TemplateManager.fetchTemplate = async (path) => {
    const response = await fetch(path);
    if(!response){
        throw new Error(`Failed to fetch template: ${response.status}`)
    }
    let rawTemplate = await response.text();

    let div = document.createElement("div");
    div.innerHTML = rawTemplate;
    
    let template = div.firstChild;
    return template;
}


TemplateManager.cloneTemplate = (template, target, data = {}) => {
    const clone = template.content.cloneNode(true);
    
    // Case insensitive matching for keys (to handle cookingTime vs cookingtime)
    const normalizedData = {};
    for (let key in data) {
        normalizedData[key.toLowerCase()] = data[key];
    }
    
    // Replace simple placeholders in text nodes
    const walker = document.createTreeWalker(
        clone,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    
    let currentNode;
    while (currentNode = walker.nextNode()) {
        let content = currentNode.nodeValue;
        for (let key in data) {
            if (typeof data[key] === 'string' || typeof data[key] === 'number') {
                const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'gi'); // case insensitive
                content = content.replace(regex, data[key]);
            }
        }
        currentNode.nodeValue = content;
    }
    
    // Handle arrays: ingredients and instructions
    if (data.ingredients && Array.isArray(data.ingredients)) {
        const ingredientsList = clone.querySelector('#ingredients-list');
        if (ingredientsList) {
            data.ingredients.forEach(ingredient => {
                const li = document.createElement('li');
                li.textContent = ingredient;
                ingredientsList.appendChild(li);
            });
        }
    }
    
    if (data.instructions && Array.isArray(data.instructions)) {
        const instructionsList = clone.querySelector('#instructions-list');
        if (instructionsList) {
            data.instructions.forEach((instruction, index) => {
                const li = document.createElement('li');
                li.textContent = instruction;
                instructionsList.appendChild(li);
            });
        }
    }
    
    target.appendChild(clone);
    return clone;
}



export default TemplateManager