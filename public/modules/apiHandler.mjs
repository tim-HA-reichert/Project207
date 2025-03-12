const HTTP_METHODS = {
    GET: "GET",
    POST: "POST",
    PATCH: "PATCH",
    PUT: "PUT",
    DELETE: "DELETE"
};

const isProd = true;
const BASE_API_PROD = "https://project207.onrender.com/";

const BASE_API = (isProd) ? BASE_API_PROD : null;

const API_ENDPOINTS_RECIPES = {
    GetAllRecipes: `${BASE_API}/recipes` 
}


export default async function runRequest(path, method = HTTP_METHODS.GET, data = null){

    const request = {
        method,
        headrs: {
            "Content-Type" : "application/json"
        }
    }

    if([HTTP_METHODS.POST, HTTP_METHODS.PATCH].any(method)){
        request.body = JSON.stringify(data);
    }


    try {
        const response = await fetch(path, request);
        
        if (!response.ok) {
            throw new Error(`API request failed with status: ${response.status}`);
        }
        console.log(response);
        return await response.json();
    } catch (error) {
        console.error("API request error:", error);
        throw error;
    }
}