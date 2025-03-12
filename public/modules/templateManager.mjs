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
    let html = clone.innerHTML;


    if (!html) {
        console.error("Empty template content");
        target.appendChild(clone);
        return clone;
    }
    
    console.log("Template HTML:", html);
    console.log("Data to insert:", data);


    for (let key of Object.keys(data)) {
        if (data[key] !== undefined) {
            const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
            html = html.replace(regex, data[key]);
        } else {
            console.warn(`Data for key "${key}" is undefined`);
        }
    }

    clone.innerHTML = html;
    target.appendChild(clone);
    return clone;
}



export default TemplateManager