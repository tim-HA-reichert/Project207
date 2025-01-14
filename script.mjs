import express from 'express'
import HTTP_CODES from './utils/httpCodes.mjs';
import randomQuote from './tmp/quote/quotes.mjs';

const server = express();
const port = (process.env.PORT || 8080);

server.set('port', port);
server.use(express.static('public'));

const quote = randomQuote();

function getRoot(req, res, next) {
    res.status(HTTP_CODES.SUCCESS.OK).send(quote).end();
}

server.get("/", getRoot);

server.listen(server.get('port'), function () {
    console.log('server running', server.get('port'));
});