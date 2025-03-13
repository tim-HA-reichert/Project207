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

TemplateManager.cloneTemplate = (template, target, data = {}) => {
    const clone = template.content.cloneNode(true);

    // Replace placeholders in the cloned template
    const replacePlaceholders = (element, data) => {
        for (let key of Object.keys(data)) {
            if (data[key] !== undefined) {
                const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
                element.innerHTML = element.innerHTML.replace(regex, data[key]);
            } else {
                console.warn(`Data for key "${key}" is undefined`);
            }
        }
    };

    replacePlaceholders(clone, data);

    // Populate ingredients and instructions
    const ingredientsList = clone.querySelector("#ingredients-list");
    if (ingredientsList && data.ingredients) {
        data.ingredients.forEach(ingredient => {
            const li = document.createElement("li");
            li.textContent = ingredient;
            ingredientsList.appendChild(li);
        });
    }

    const instructionsList = clone.querySelector("#instructions-list");
    if (instructionsList && data.instructions) {
        data.instructions.forEach(instruction => {
            const li = document.createElement("li");
            li.textContent = instruction;
            instructionsList.appendChild(li);
        });
    }

    target.appendChild(clone);
    return clone;
};

export default TemplateManager;