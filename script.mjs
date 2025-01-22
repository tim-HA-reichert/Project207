import express from 'express'
import HTTP_CODES from './utils/httpCodes.mjs';
import all from './cardDeck/deck.mjs'

const server = express();
const port = (process.env.PORT || 8080);

server.set('port', port);
server.use(express.static('public'));

const deckOfCards = all.cardDeck();

server.get("/", (req, res, next) => {
    res.status(HTTP_CODES.SUCCESS.OK).send().end();
});

server.get("/temp/deck/:deck_id", (req, res, next) => {
    //const deckID = req.params['deck_id'];
    res.status(HTTP_CODES.SUCCESS.OK).send(deckOfCards).end();
})

server.get("/temp/deck/:deck_id/card", (req, res, next) => {
    const pickCard = all.pickCard(deckOfCards);
    res.status(HTTP_CODES.SUCCESS.OK).send(pickCard).end();
})










server.listen(server.get('port'), function () {
    console.log(`Server running on http://localhost:${port}`);
    console.log(`Deck of cards at http://localhost:${port}/temp/deck/:deck_id`);
    console.log(`Pick a card at http://localhost:${port}/temp/deck/:deck_id/card`);
});