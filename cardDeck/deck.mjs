const cardDeck = () => {
    const theDeck = {
        "Hearts": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "Jack", "Queen", "King"],
        "Spades": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "Jack", "Queen", "King"],
        "Clubs": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "Jack", "Queen", "King"],
        "Diamonds": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "Jack", "Queen", "King"]
    };
    console.log(theDeck);
    return theDeck
}


const pickCard = (aDeck) => {
    const suits = Object.keys(aDeck);
    
    let randomSuit = suits[Math.floor(Math.random() * suits.length)];
    const randomCard = Math.floor(Math.random() * 13);
    
    const chosenCard = aDeck[randomSuit][randomCard];
    
    //At switch-case for the different numbers. Case 12 = queen or whatever.
        console.log(`${chosenCard} of ${randomSuit}`);
    //Add splice logic for chosen cards. 
}

export default {cardDeck, pickCard}