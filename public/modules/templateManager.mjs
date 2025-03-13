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
    console.log("Fetched template:", template);
    return template;
}

TemplateManager.cloneTemplate = (template, target, data = {}) => {
    try{
    const clone = template.content.cloneNode(true);
    console.log(clone);
    let html = clone.innerHTML;

    console.log(html);

    if (!html) {
        console.log("Template content:", template.innerHTML);
        console.error("Empty template content");
        target.appendChild(clone);
        return clone;
    }
    
    console.log("Template HTML:", html);
    console.log("Data to insert:", data);


    for (let key of Object.keys(data)) {

        if (Array.isArray(data[key])){
            const listElement = clone.querySelector(`#${key}-list`);
            if (listElement) {
                handleListData(listElement, data[key]);
            }
        };

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
    } catch(error){
        console.log(error);
    }
}

function handleListData(element, arrayOfData) {
    if (element && Array.isArray(arrayOfData)) {
        arrayOfData.forEach(item => {
            const li = document.createElement("li");
            li.textContent = item;
            element.appendChild(li); 
        });
    }
}

export default TemplateManager