const TemplateManager = {};

TemplateManager.fetchTemplate = async (path) => {
    let rawTemplate = await (await fetch(path)).text();

    let div = document.createElement("div");
    div.innerHTML = rawTemplate;
    let template = div.firstChild;
    return template;
};

TemplateManager.cloneTemplate = (template, target, data = {}) => {
    const clone = template.content.cloneNode(true);
    
    const tempContainer = document.createElement("div");
    tempContainer.appendChild(clone);
    
    let html = tempContainer.innerHTML;


    for (let key of Object.keys(data)) {

        const value = data[key] !== undefined ? data[key] : '';
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
        html = html.replace(regex, value);

        console.log(`Replacing {{${key}}} with:`, value);
    }
    
    console.log("Processed HTML:", html);

    tempContainer.innerHTML = html;
    
    while (tempContainer.firstChild) {
        target.appendChild(tempContainer.firstChild);
    }
    
    return target.lastChild;
};

export default TemplateManager;