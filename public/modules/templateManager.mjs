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

TemplateManager.cloneRecipeTemplate = (template, target, data = {}) => {
    const clone = template.content.cloneNode(true);
    console.log("Cloned template structure:", clone);
    console.log("Edit button in clone:", clone.querySelector('.edit-button'));
    
        for (let key of Object.keys(data)) {
            if (Array.isArray(data[key])) {
                // Handle arrays by joining elements with a comma and space
                html = html.replaceAll(`{{${key}}}`, data[key].join(", "));
    
                // Also check for list containers and populate them
                const container = clone.querySelector(`#${key}-list, .${key}-list, [data-array="${key}"]`);
                if (container) {
                    container.innerHTML = ""; // Clear existing placeholder content
                    data[key].forEach(item => {
                        const listItem = document.createElement(container.tagName === "UL" || container.tagName === "OL" ? "LI" : "DIV");
                        listItem.textContent = item;
                        container.appendChild(listItem);
                    });
                }
            } else {
                // Keep original replacement logic for non-array values
                html = html.replaceAll(RegExp(`/\{\{${key}\}\}/gm`, data[key]));
            }
        }
    
        clone.innerHTML = html;
        target.appendChild(clone);
        return clone;
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