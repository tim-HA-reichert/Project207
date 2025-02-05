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
    } 

    const data = await response.json();
    sessionStorage.setItem("accessToken", data.accessToken);
    alert("Login successful!");
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


// Function to fetch protected data
async function fetchProtectedData() {
    const token = sessionStorage.getItem("accessToken");

    if (!token) {
        alert("You need to log in first!");
        return;
    }

    const response = await fetch("/protected", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (!response.ok) {
        alert("Failed to fetch protected data.");
        return;
    }

    const data = await response.json();
    console.log(data); 
}

document.getElementById("fetchButton").addEventListener("click", fetchProtectedData);
