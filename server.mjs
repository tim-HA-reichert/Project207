import express from 'express'
import HTTP_CODES from './utils/httpCodes.mjs';
import log from './modules/log.mjs';
import { LOGG_LEVELS, eventLogger } from './modules/log.mjs';
import * as auth from './modules/authenticator.mjs';

const server = express();
const port = (process.env.PORT || 8000);

server.set('port', port);
server.use(express.static('public'));

server.use(express.json());

const users = [
];


server.get("/", (req, res) => {
    res.status(HTTP_CODES.SUCCESS.OK).send().end();
});

server.get("/user", (req, res) => {
    console.log(users);
    res.status(HTTP_CODES.SUCCESS.OK).send().end();
});


server.post("/user", async (req, res) => {
    const newUser = await auth.becomeUser(req.body.name, req.body.password);

    users.push(newUser);

    res.status(HTTP_CODES.SUCCESS.ACCEPTED).send().end();
});

server.post("/user/login", async (req, res) => {
    const user = users.find(user => user.name === req.body.name);

    if (!user) {
        return res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).send("User not found");
    }

    const validPassword = await auth.loginUser(req.body.password, user.password);

    if (validPassword) {
        console.log("Login successful");
        res.status(HTTP_CODES.SUCCESS.ACCEPTED).send().end();
    } else {
        console.log("Wrong password.");
        res.status(HTTP_CODES.CLIENT_ERROR.UNAUTHORIZED).send("Invalid credentials");
    }
})



server.listen(server.get('port'), function () {
    console.log(`Server running on http://localhost:${port}`);
});