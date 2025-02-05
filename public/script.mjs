document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const response = await fetch("/user/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({username, password})
    });

    if(!response.ok){
        alert("login failed");
        return;
    } else {
        alert("welcome.")
        return;
    }
});





document.getElementById("register-user").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("new-user").value;
    const password = document.getElementById("new-password").value;

    const response = await fetch("/user", {
        method: "POST",
        headers:{
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({username, password})
    });

    if(response.ok){
    console.log("New user created:", username, " with password: ", password);
}

})
