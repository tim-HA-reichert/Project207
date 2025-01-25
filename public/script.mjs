const createDeck = () => {
    fetch('/temp/deck', {method: "POST"})
    .then(response => response.json())
    .then(data => {
        console.log("Deck ID:", data.deckID)  
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
            });            
        })
        

    });  
}

const getAllDecks = () => {
    fetch("/temp/deck")
    .then(response => response.json())
    .then(data => { 
        const deckWrapper = document.getElementById("listOfDeckWrapper");
        const decks = [];
        for(const deck in data){
            decks.push(deck);
        }
        console.log(decks)
    })
}



const getDeck = () => {
    const aDeckID = document.getElementById('deckID').value;
    if (aDeckID === "0" || aDeckID === "") {
        alert("Please enter a valid deck ID.");
        return; 
    }
    fetch(`/temp/deck/${aDeckID}`)
    .then(response => response.json())
    .then(deckContent => 
        console.log(deckContent));
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
        console.log(drawnCard);
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

    fetch(`/temp/deck/shuffle/${deckToRefill}`, {method: "PATCH"})
    .then(response => response.json())
    .then(newDeck => console.log(newDeck))
}


function shuffleDeck() {
    let deckToShuffle = document.getElementById('deckID').value;

    if (deckToShuffle) {
        alert('Shuffled!');

    } else {
        alert('Choose a deck to shuffle!');
    }
}
/* 
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
} */

