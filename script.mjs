import express from 'express'
import HTTP_CODES from './utils/httpCodes.mjs';
import randomQuote from './tmp/quotes/quotes.mjs';
import printPoem from './tmp/poem/poem.mjs';

const server = express();
const port = (process.env.PORT || 8080);

server.set('port', port);
server.use(express.static('public'));

let quote = randomQuote();
const poem = printPoem();

setInterval(() => {
    quote = randomQuote();  
}, 2000); 

function getQuote(req, res, next) {
    res.status(HTTP_CODES.SUCCESS.OK).send(quote).end();
}

function getPoem(req, res, next) {
    res.status(HTTP_CODES.SUCCESS.OK).send(poem).end();
}

function getRoot(req, res, next) {
    res.status(HTTP_CODES.SUCCESS.OK).send("For quotes: /tmp/quotes <br> For poem: /tmp/poem").end();
}

server.get("/", getRoot);
server.get("/tmp/quotes", getQuote);
server.get("/tmp/poem", getPoem);


server.listen(server.get('port'), function () {
    console.log(`Server running on http://localhost:${port}`);
    console.log(`Poem at http://localhost:${port}/tmp/poem`);
    console.log(`Quotes at http://localhost:${port}/tmp/quotes`);
});