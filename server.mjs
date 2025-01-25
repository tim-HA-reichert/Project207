import express from 'express'
import HTTP_CODES from './utils/httpCodes.mjs';
import all from './cardDeck/deck.mjs'

//TODO: 
//Add some sort of menu for available decks
//Add easy way to change deck
//Check error messages
//Make sure buttons like shuffle don't work without reason (if a deck is empty, for example)


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

    res.status(HTTP_CODES.SUCCESS.OK).send({ deckID, newDeck, decks }).end();
});

server.get("/temp/deck", (req, res) => {
    res.status(HTTP_CODES.SUCCESS.OK).send(decks).end();
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
});

server.get("/temp/deck/:deck_id/card", (req, res, next) => {
    const requestedDeckID = req.params['deck_id'];

    if(decks[requestedDeckID]){
        const pickCard = all.pickCard(decks[requestedDeckID]);
        res.status(HTTP_CODES.SUCCESS.OK).send({card: pickCard}).end();
    } else if(!decks[requestedDeckID]){
        res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND)
        .send("No deck found. generate one first.")
        .end();
    }
});

server.patch("/temp/deck/refill/:deck_id", (req, res, next) => {
    const requestedDeckID = req.params['deck_id'];
    const newCards = all.cardDeck();

    if(decks[requestedDeckID]){
        decks[requestedDeckID] = newCards;
        console.log(`Deck ${requestedDeckID} has been filled.`);

        res.status(HTTP_CODES.SUCCESS.OK).send(decks[requestedDeckID]).end();
    } else if(!decks[requestedDeckID]) {
        res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).send(`Choose a deck to refill`).end();
    }
})

server.patch("/temp/deck/shuffle/:deck_id", (req, res, next) => {
    const requestedDeckID = req.params['deck_id'];
    const newCards = all.cardDeck();

    if(decks[requestedDeckID]){
        decks[requestedDeckID] = newCards;
        console.log(`Deck ${requestedDeckID} has been shuffled.`);

        res.status(HTTP_CODES.SUCCESS.OK).send(decks[requestedDeckID]).end();
    } else if(!decks[requestedDeckID]) {
        res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).send(`Choose a deck to shuffle`).end();
    }
})

server.listen(server.get('port'), function () {
    console.log(`Server running on http://localhost:${port}`);
    console.log(`New deck? http://localhost:${port}/temp/deck`);
    console.log(`Deck of cards at http://localhost:${port}/temp/deck/:deck_id`);
    console.log(`Pick a card at http://localhost:${port}/temp/deck/:deck_id/card`);
});