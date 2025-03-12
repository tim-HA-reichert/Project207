const HTTP_METHODS = {
    GET: "GET",
    POST: "POST",
    PATCH: "PATCH",
    PUT: "PUT"
};




async function runRequest(patch, method = HTTP_METHODS.GET, data = null){

    const request = {
        method,
        headrs: {
            "Content-Type" : "application/json"
        }
    }

    if([HTTP_METHODS.POST, HTTP_METHODS.PATCH].any(method)){
        request.body = JSON.stringify(data);
    }


    const response = await fetch (patch, request);

    return await response.json();
}