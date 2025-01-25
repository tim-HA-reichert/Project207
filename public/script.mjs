const createDeck = () => {
    fetch('/temp/deck', {method: "POST"})
    .then(response => response.json())
    .then(data => {
        console.log(data.decks)  
        const allDecks = data.decks;

        const deckWrapper = document.getElementById('listOfDeckWrapper');
        const aDeckID = document.getElementById('deckID');
        
        const listOfDecks = [];

        for(const decks in allDecks){
            listOfDecks.push(decks);
        }
        deckWrapper.innerHTML="";


        listOfDecks.forEach(deck => {
            let deckInstance = document.createElement('a');
            deckInstance.classList.add('deckInstance')
            deckInstance.innerHTML = deck;    
            deckWrapper.appendChild(deckInstance);
                    
            deckInstance.addEventListener("click", e => {
                aDeckID.value = deck;


                let chosenDeck = document.createElement('h3');
                let chosenDeckWrapper = document.getElementById('chosenDeckWrapper');

                chosenDeckWrapper.innerHTML = "";
                chosenDeck.innerHTML = `Chosen deck: ${deck}`;
                chosenDeckWrapper.appendChild(chosenDeck);
            });            
        })
        

    });  
}

const getAllDecks = () => {
    fetch("/temp/deck")
    .then(response => response.json())
    .then(data => { 
        const deckWrapper = document.getElementById("listOfDeckWrapper");
        const aDeckID = document.getElementById('deckID');

        const listOfDecks = [];

        for(const deck in data){
            listOfDecks.push(deck);
        }
        deckWrapper.innerHTML="";

        listOfDecks.forEach(deck => {
            let deckInstance = document.createElement('a');
            deckInstance.classList.add('deckInstance')
            deckInstance.innerHTML = deck;    
            deckWrapper.appendChild(deckInstance);
                    
            deckInstance.addEventListener("click", e => {
                aDeckID.value = deck;

                let chosenDeck = document.createElement('h3');
                let chosenDeckWrapper = document.getElementById('chosenDeckWrapper');

                chosenDeckWrapper.innerHTML = "";
                chosenDeck.innerHTML = `Chosen deck: ${deck}`;
                chosenDeckWrapper.appendChild(chosenDeck);
            });            
        })
    })
}

const drawCard = () => {
    const aDeckID = document.getElementById('deckID').value;

    if (aDeckID === "0" || aDeckID === "") {
        alert("Please enter a valid deck ID.");
        return; 
    }
  
    fetch(`/temp/deck/${aDeckID}/card`)
    .then(response => { 
        return response.json();
    })
    .then(drawnCard => 
    { 
        const spawnCard = document.getElementById("shownCard");
        spawnCard.innerHTML = "";

        let suitSymbol;
        suitSymbol = document.createElement('span');

        let cardRank;
        cardRank = document.createElement('div');
        cardRank.classList.add('card-rank');

        const [rank, suit] = drawnCard.card.split(' of ');

        switch (true) {
            case drawnCard.card.includes("Spades"):

                suitSymbol.innerHTML = `&#9824;`
                spawnCard.setAttribute('data-suit', suitSymbol.innerHTML);

                break;
            case drawnCard.card.includes("Hearts"):

                suitSymbol.innerHTML = `&#9829;`
                spawnCard.setAttribute('data-suit', suitSymbol.innerHTML);

                break;
            case drawnCard.card.includes("Clubs"):

                suitSymbol.innerHTML = `&#9827;`
                spawnCard.setAttribute('data-suit', suitSymbol.innerHTML);
 
                break;
            case drawnCard.card.includes("Diamonds"):

                suitSymbol.innerHTML = `&#9830;`               
                spawnCard.setAttribute('data-suit', suitSymbol.innerHTML);

            break; 
        } 
        cardRank.innerHTML = rank;
        spawnCard.appendChild(cardRank);
    })
}


const refillDeck = () => {
    const deckToRefill = document.getElementById('deckID').value;

    fetch(`/temp/deck/refill/${deckToRefill}`, {method: "PATCH"})
    .then(response => response.json())
    .then(newDeck => console.log(newDeck))

    if(!deckToRefill){
        alert('Choose a deck to refill.')
    } else {
        alert('Deck has been filled!')
    }
}


function shuffleDeck() {
    let deckToShuffle = document.getElementById('deckID').value;
    fetch(`/temp/deck/refill/${deckToShuffle}`, {method: "PATCH"})
    .then(response => response.json())
    .then(newDeck => console.log(newDeck))


    if (deckToShuffle) {
        alert('Shuffled!');
    } else {
        alert('Choose a deck to shuffle!');
    }
}


