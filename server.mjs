import express from 'express'
import HTTP_CODES from './utils/httpCodes.mjs';
import * as auth from './utils/authenticator.mjs';
import dotenv from 'dotenv';
import { tokenAuthentication, adminAccess } from './modules/usertoken.mjs';
import cookieParser from "cookie-parser";
import recipeRoutes from './router/recipeRoutes.mjs';

dotenv.config();


const server = express();
const port = (process.env.PORT || 8000);

server.set('port', port);
server.use(express.static('public'));

server.use(cookieParser());
server.use(express.json());


server.use('/recipes', recipeRoutes);

const users = [];

const createDemoUsers = async () => {
    const demoUser = await auth.becomeUser("User", "123", "user");

    const demoAdminUser = await auth.becomeUser("Admin", "123", "admin");
    users.push(demoUser, demoAdminUser);

    console.log("Demo user created:", demoUser);
    console.log("Demo admin created:", demoAdminUser);
};
createDemoUsers();


server.get("/", (req, res) => {
    res.status(HTTP_CODES.SUCCESS.OK).send().end();
});

server.get("/user", (req, res) => {
    console.log(users);
    res.status(HTTP_CODES.SUCCESS.OK).send(users).end();
});


server.post("/user", async (req, res) => {
    const newUser = await auth.becomeUser(req.body.username, req.body.password, "user");
    users.push(newUser);

    res.status(HTTP_CODES.SUCCESS.ACCEPTED).send().end();
});


server.post("/user/login", async (req, res) => {
    const user = users.find(user => user.username === req.body.username);

    if (!user) {
        return res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).send("User not found");
    }

    const validPassword = await auth.loginUser(req.body.password, user.password);

    if (validPassword) {
        console.log("Login successful");
        const userToken = auth.generateToken(user);

        res.cookie("accessToken", userToken, {
            httpOnly: true,
            sameSite: "Strict",
            maxAge: 5 * 60 * 1000 //5 mins
        });

        res.status(HTTP_CODES.SUCCESS.OK).send({ message: "Login successful" });
       
    } else {
        console.log("Wrong password.");
        res.status(HTTP_CODES.CLIENT_ERROR.UNAUTHORIZED).send("Invalid credentials");
    }
})

server.post("/logout", (req, res) => {
    res.cookie("accessToken", "", {
        httpOnly: true,
        sameSite: "Strict",
        expires: new Date(0)
    });

    res.status(HTTP_CODES.SUCCESS.OK).send("Logged out!");
});


server.get("/userpage", tokenAuthentication, (req, res) => {
    res.json({ message: `Welcome, ${req.user.username}! You are authenticated.` });
});

server.get("/admin", tokenAuthentication, adminAccess, (req, res) => {
    res.json({ message: `Hello Admin ${req.user.username}, you have full access!` });
});





server.listen(server.get('port'), function () {
    console.log(`Server running on http://localhost:${port}`);
});