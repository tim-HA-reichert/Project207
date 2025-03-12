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

    for (let key of Object.keys(data)) {
        html = html.replaceAll(RegExp(`/\{\{${key}\}\}/gm`, data[key]));
    }

    clone.innerHTML = html;
    target.appendChild(clone);
    return clone;
}



export default TemplateManager