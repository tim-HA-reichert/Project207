const createDeck = () => {
    fetch('/temp/deck', {method: "POST"})
    .then(response => response.json())
    .then(data => {
        console.log("Deck ID:", data.deckID)  
        //console.log("New Deck:", data.newDeck)
        console.log(data.decks)
        });  
}

const getAllDecks = () => {
    fetch("/temp/deck")
    .then(response => response.json())
    .then(data => { 
        for(const deck in data){
            console.log(deck)
        }
    })
}



const getDeck = () => {
    const aDeckID = document.getElementById('deckID').value;
    fetch(`/temp/deck/${aDeckID}`)
    .then(response => response.json())
    .then(deckContent => 
        console.log(deckContent));
}


const drawCard = () => {
    const aDeckID = document.getElementById('deckID').value;
    fetch(`/temp/deck/${aDeckID}/card`)
    .then(response => response.json())
    .then(drawnCard => 
    { 
        console.log(drawnCard.card);
        const spawnCard = document.getElementById("shownCard");
        spawnCard.innerHTML = "";

        let suitSymbol;
        suitSymbol = document.createElement('span');

        switch (true) {
            case drawnCard.card.includes("Spades"):

                suitSymbol.innerHTML = `&#9824;`
                spawnCard.appendChild(suitSymbol);
                break;
            case drawnCard.card.includes("Hearts"):

                suitSymbol.innerHTML = `&#9829;`
                spawnCard.appendChild(suitSymbol);
                break;
            case drawnCard.card.includes("Clubs"):

                suitSymbol.innerHTML = `&#9827;`
                spawnCard.appendChild(suitSymbol);
                break;
            case drawnCard.card.includes("Diamonds"):

                suitSymbol.innerHTML = `&#9830;`               
                spawnCard.appendChild(suitSymbol);
            break; 
        } 
    })
}


const refillDeck = () => {
    const deckToRefill = document.getElementById('deckID').value;

    fetch(`/temp/deck/shuffle/${deckToRefill}`, {method: "PATCH"})
    .then(response => response.json())
    .then(newDeck => console.log(newDeck))
}


function shuffleDeck() {
    let deckToShuffle = document.getElementById('deckID').value;

    if(deckToShuffle){

        const shuffleMessage = document.createElement('div');
        shuffleMessage.textContent = 'Shuffling....';
        shuffleMessage.style.color = 'red';
 
        document.body.appendChild(shuffleMessage);
        
        setTimeout(() => {
            document.body.removeChild(shuffleMessage);
        }, 3000);
    } else {
        const shuffleMessage = document.createElement('div');
        shuffleMessage.textContent = 'Choose a deck to shuffle!';
        shuffleMessage.style.color = 'red';

        document.body.appendChild(shuffleMessage);

        setTimeout(() => {
            document.body.removeChild(shuffleMessage);
        }, 3000);
    }
}

