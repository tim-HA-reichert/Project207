import express from 'express'
import HTTP_CODES from './utils/httpCodes.mjs';

const server = express();
const port = (process.env.PORT || 8080);

server.set('port', port);
server.use(express.static('public'));


server.get("/", (req, res, next) => {
    res.status(HTTP_CODES.SUCCESS.OK).send().end();
});



server.listen(server.get('port'), function () {
    console.log(`Server running on http://localhost:${port}`);
});