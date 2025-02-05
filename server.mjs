import express from 'express'
import HTTP_CODES from './utils/httpCodes.mjs';
import log from './modules/log.mjs';
import { LOGG_LEVELS, eventLogger } from './modules/log.mjs';
import * as auth from './utils/authenticator.mjs';
import dotenv from 'dotenv';

dotenv.config();


const server = express();
const port = (process.env.PORT || 8000);

server.set('port', port);
server.use(express.static('public'));

server.use(express.json());

const users = [

];

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
        res.json({ accessToken: userToken });
    } else {
        console.log("Wrong password.");
        res.status(HTTP_CODES.CLIENT_ERROR.UNAUTHORIZED).send("Invalid credentials");
    }
})

server.listen(server.get('port'), function () {
    console.log(`Server running on http://localhost:${port}`);
});