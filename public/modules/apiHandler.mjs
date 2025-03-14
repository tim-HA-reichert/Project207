const HTTP_METHODS = {
    GET: "GET",
    POST: "POST",
    PATCH: "PATCH",
    PUT: "PUT",
    DELETE: "DELETE"
};

const isProd = true;
const BASE_API_PROD = "https://project207.onrender.com";
const BASE_API_DEV = "http://localhost:8000";

const BASE_API = (isProd) ? BASE_API_PROD : BASE_API_DEV;

export const API_ENDPOINTS = {
    RECIPES: {
        GetAll: `${BASE_API}/recipes`,
        GetById: (id) => `${BASE_API}/recipes/:id?id=${id}`,
        Create: `${BASE_API}/recipes`,
        Update: (id) => `${BASE_API}/recipes/${id}`,
        Delete: (id) => `${BASE_API}/recipes/${id}`,
        Search: (criteria) => {
            const params = new URLSearchParams(criteria);
            return `${BASE_API}/recipes?${params.toString()}`;
        }
    }
};

export async function runRequest(path, method = HTTP_METHODS.GET, data = null) {
    const request = {
        method,
        headers: {
            "Content-Type": "application/json"
        }
    };

    if ([HTTP_METHODS.POST, HTTP_METHODS.PUT, HTTP_METHODS.PATCH].includes(method)) {
        request.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(path, request);
        
        if (!response.ok) {
            throw new Error(`API request failed with status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error("API request error:", error);
        throw error;
    }
}

export async function createRecipe(recipeData) {
    return runRequest(API_ENDPOINTS.RECIPES.Create, HTTP_METHODS.POST, recipeData);
}

export async function getAllRecipes() {
    return runRequest(API_ENDPOINTS.RECIPES.GetAll, HTTP_METHODS.GET);
}

export async function getRecipeById(id) {
    const response = await runRequest(API_ENDPOINTS.RECIPES.GetById(id), HTTP_METHODS.GET);
    console.log("API Response:", response); 
    
    if (Array.isArray(response) && response.length > 0) {
        return response[0];
    } else {
        console.log("Response is not an array or is empty:", response);
        return response; 
    }
}

export async function updateRecipe(id, recipeChanges) {
    console.log("Sending update with ID:", id);
    console.log("Recipe changes:", recipeChanges);
    return runRequest(API_ENDPOINTS.RECIPES.Update(id), HTTP_METHODS.PATCH, recipeChanges);
}

export async function deleteRecipe(id) {
    const response = await runRequest(API_ENDPOINTS.RECIPES.Delete(id), HTTP_METHODS.DELETE);
    console.log("API Response:", response); 

    if(Array.isArray(response) && response.length > 0){
        return response[0];
    } else {
        console.log(response)
        return response;
    }
}

export async function searchRecipes(searchCriteria) {
    return runRequest(API_ENDPOINTS.RECIPES.Search(searchCriteria), HTTP_METHODS.GET);
}