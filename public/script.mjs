document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const response = await fetch("/user/login", {
        method: "POST",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({username, password})
    });

    if(!response.ok){
        console.log("login failed");
        return;
    } 

    const data = await response.json();

    console.log("Login successful!");
});

document.getElementById("register-user").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("new-user").value;
    const password = document.getElementById("new-password").value;

    const response = await fetch("/user", {
        method: "POST",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json" 
        },
        body: JSON.stringify({username, password})
    });

    if(response.ok){
    console.log("New user created:", username, " with password: ", password);
    }
})

document.getElementById("userButton").addEventListener("click", async () => {

    const response = await fetch("/userpage", {
        method: "GET",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json"
        },
    });

    if(!response.ok){
        console.log("You are not a user.");
        return
    }

    const data = await response.json();
    console.log(data);
});

document.getElementById("adminButton").addEventListener("click", async () => {

    const response = await fetch("/admin", {
        method: "GET",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json"
        },
    });

    if (!response.ok) {
        console.log("You are not an admin.");
        return;
    }

    const data = await response.json();
    console.log(data); 
});



document.getElementById("log-out-button").addEventListener("click", async () =>{

    await fetch("/logout", {
        method: "POST",
        credentials: "include"
    })

    console.log("You have logged out.");

})