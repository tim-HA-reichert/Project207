import express from 'express'
import HTTP_CODES from './utils/httpCodes.mjs';
import log from './modules/log.mjs';
import { LOGG_LEVELS, eventLogger } from './modules/log.mjs';

const server = express();
const port = (process.env.PORT || 8000);

const logger = log(LOGG_LEVELS.VERBOSE);

server.set('port', port);
server.use(express.static('public'));


server.get("/", (req, res) => {
    res.status(HTTP_CODES.SUCCESS.OK).send('Hello World').end();
});



server.get("/user", (req, res) => {
    res.status(HTTP_CODES.SUCCESS.OK).send('You are a user!!').end();
})







server.listen(server.get('port'), function () {
    console.log(`Server running on http://localhost:${port}`);
});