import express from 'express';
import HTTP_CODES from '../utils/httpCodes.mjs';
import * as auth from '../utils/authenticator.mjs';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { tokenAuthentication, adminAccess } from '../modules/usertoken.mjs';
import StoreUserRecord from '../data/userRecordStore.mjs';
import UserService from '../serviceLayer/userService.mjs';

//IKKE BRUKT


dotenv.config();

const loginRouter = express.Router();
loginRouter.use(cookieParser());
loginRouter.use(express.json());

const userRecord = new StoreUserRecord();
const userService = new UserService(userRecord);


/* const createDemoUsers = async () => {
    try {
        const demoUser = await auth.becomeUser("User", "123", "user");
        const demoAdminUser = await auth.becomeUser("Admin", "123", "admin");

        await userService.createUser(demoUser);
        await userService.createUser(demoAdminUser);

        console.log("Demo users created successfully");
    } catch (error) {
        console.error("Error creating demo users:", error);
    }
};
createDemoUsers(); */


loginRouter.get("/user", async (req, res) => {
    try {
        const users = await userRecord.readAll();
        res.status(HTTP_CODES.SUCCESS.OK).send(users).end();
    } catch (error) {
        res.status(HTTP_CODES.SERVER_ERROR.INTERNAL).send(error.message).end();
    }
});

loginRouter.post("/user", async (req, res) => {
    try {
        const newUser = await auth.becomeUser(
            req.body.username, 
            req.body.password, 
            "user"
        );

        await userService.createUser(newUser);

        res.status(HTTP_CODES.SUCCESS.ACCEPTED).send().end();
    } catch (error) {
        res.status(HTTP_CODES.CLIENT_ERROR.BAD_INPUT).send(error.message).end();
    }
});


loginRouter.post("/user/login", async (req, res) => {
    try {
        const users = await userRecord.findByUsername(req.body.username);

        if (users.length === 0) {
            return res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).send("User not found");
        }

        const user = users[0];

        const validPassword = await auth.loginUser(req.body.password, user.password);

        if (validPassword) {
            console.log("Login successful");
            const userToken = auth.generateToken({
                username: user.username,
                role: user.role
            });

            res.cookie("accessToken", userToken, {
                httpOnly: true,
                sameSite: "Strict",
                maxAge: 5 * 60 * 1000 // 5 mins
            });

            res.status(HTTP_CODES.SUCCESS.OK).send({ message: "Login successful" });
        } else {
            console.log("Wrong password.");
            res.status(HTTP_CODES.CLIENT_ERROR.UNAUTHORIZED).send("Invalid credentials");
        }
    } catch (error) {
        res.status(HTTP_CODES.SERVER_ERROR.INTERNAL).send(error.message);
    }
});

loginRouter.post("/logout", (req, res) => {
    res.cookie("accessToken", "", {
        httpOnly: true,
        sameSite: "Strict",
        expires: new Date(0)
    });

    res.status(HTTP_CODES.SUCCESS.OK).send("Logged out!");
});


loginRouter.get("/userpage", tokenAuthentication, (req, res) => {
    res.json({ message: `Welcome, ${req.user.username}! You are authenticated.` });
});

loginRouter.get("/admin", tokenAuthentication, adminAccess, (req, res) => {
    res.json({ message: `Hello Admin ${req.user.username}, you have full access!` });
});




export default loginRouter;