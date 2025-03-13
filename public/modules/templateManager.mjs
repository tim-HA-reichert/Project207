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
    
    // Replace simple text placeholders
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
    
    // Handle array data separately
    for (const key in data) {
        const value = data[key];
        
        if (Array.isArray(value)) {
            let container = clone.querySelector(`#${key}-list, .${key}-list, [data-array="${key}"]`);
            
            if (!container) {
                // If no specific container, replace occurrences in text
                const textNodes = document.createTreeWalker(clone, NodeFilter.SHOW_TEXT, null, false);
                while (textNodes.nextNode()) {
                    let node = textNodes.currentNode;
                    if (node.nodeValue.includes(`{{${key}}}`)) {
                        node.nodeValue = node.nodeValue.replaceAll(`{{${key}}}`, value.join(', '));
                    }
                }
                continue;
            }
            
            // Create and append list items
            value.forEach(item => {
                const listItem = document.createElement(container.tagName === 'UL' || container.tagName === 'OL' ? 'LI' : 'DIV');
                listItem.textContent = item;
                container.appendChild(listItem);
            });
        }
    }
    
    target.appendChild(clone);
    return clone;
};


export default TemplateManager;