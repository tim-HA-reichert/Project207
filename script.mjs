import express from 'express'
import HTTP_CODES from './utils/httpCodes.mjs';
import all from './cardDeck/deck.mjs'

const server = express();
const port = (process.env.PORT || 8080);

server.set('port', port);
server.use(express.static('public'));

server.get("/", (req, res, next) => {
    res.status(HTTP_CODES.SUCCESS.OK).send().end();
});


const decks = {};

server.post("/temp/deck", (req, res, next) => {
    const deckID = Math.random().toString(36).substring(2, 9);
    const newDeck = all.cardDeck();

    decks[deckID] = newDeck;
    console.log(`New deck created with ID: ${deckID}`);

    res.status(HTTP_CODES.SUCCESS.OK).send(newDeck).end();
})

server.get("/temp/deck/:deck_id", (req, res, next) => {
    const requestedDeckID = req.params['deck_id'];

    if(decks[requestedDeckID]){
        res.status(HTTP_CODES.SUCCESS.OK).send(decks[requestedDeckID]).end();
    } else {
        res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND)
        .send("no deck id found")
        .end();
    }
})

server.get("/temp/deck/:deck_id/card", (req, res, next) => {

    const requestedDeckID = req.params['deck_id'];

    if(decks[requestedDeckID]){
        const pickCard = all.pickCard(decks[requestedDeckID]);
        res.status(HTTP_CODES.SUCCESS.OK).send(pickCard).end();
    } else {
        res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND)
        .send("You don't have a working deck. get one at http://localhost:8080/temp/deck")
        .end();
    }
})

//TODO:
//Add "PATCH" for reshuffling.
//Add Splice logic for removing drawn cards
//Check if pickCard function returns drawn card properly

server.listen(server.get('port'), function () {
    console.log(`Server running on http://localhost:${port}`);
    console.log(`New deck? http://localhost:${port}/temp/deck`);
    console.log(`Deck of cards at http://localhost:${port}/temp/deck/:deck_id`);
    console.log(`Pick a card at http://localhost:${port}/temp/deck/:deck_id/card`);
});