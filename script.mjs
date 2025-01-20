import express from 'express'
import HTTP_CODES from './utils/httpCodes.mjs';

import randomQuote from './tmp/quotes.mjs';
import printPoem from './tmp/poem.mjs';
import calculateNumbers from './tmp/sum.mjs';

const server = express();
const port = (process.env.PORT || 8080);

server.set('port', port);
server.use(express.static('public'));

let generateQuote = randomQuote();
const poem = printPoem();

setInterval(() => {
    generateQuote = randomQuote();  
}, 2000); 

function getRoot(req, res, next) {
    res.status(HTTP_CODES.SUCCESS.OK).send(
        `For quotes: /tmp/quotes <br> 
        For poem: /tmp/poem <br>
        For basic maths: /tmp/sum/a/b/ where "a" and "b" are numbers`).end();
}

function getQuote(req, res, next) {
    res.status(HTTP_CODES.SUCCESS.OK).send(generateQuote).end();
}

server.get("/", getRoot);

//Tester to foskjellige måter å skrive dette på 
server.get("/tmp/quotes", getQuote);

server.get("/tmp/poem", (req, res, next) => {
    res.status(HTTP_CODES.SUCCESS.OK).send(poem).end();
});

server.post("/tmp/sum/:a/:b/", (req, res)  => {
    const a = Number(req.params.a);
    const b = Number(req.params.b);

    const calculateParams = calculateNumbers(a, b);

    if(!calculateParams){
        return res.status(HTTP_CODES.CLIENT_ERROR.BAD_INPUT).send("a and b must be numbers, man.")
    }

    res.status(HTTP_CODES.SUCCESS.OK).send(`sum: ${calculateParams} <br><br> 
        type some new numbers in the searchbar for a new answer.`).end();
});


server.listen(server.get('port'), function () {
    console.log(`Server running on http://localhost:${port}`);
    console.log(`Poem at http://localhost:${port}/tmp/poem`);
    console.log(`Quotes at http://localhost:${port}/tmp/quotes`);
    console.log(`Calculate at http://localhost:${port}/tmp/sum/a/b/`);
});