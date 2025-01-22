const cardDeck = () => {
        const theDeck = {
            "Hearts": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "Jack", "Queen", "King"],
            "Spades": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "Jack", "Queen", "King"],
            "Clubs": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "Jack", "Queen", "King"],
            "Diamonds": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "Jack", "Queen", "King"]
        };
        return theDeck
    } 



const pickCard = (aDeck) => {
    const suits = Object.keys(aDeck);
    
    let randomSuit = suits[Math.floor(Math.random() * suits.length)];

    const randomCard = Math.floor(Math.random() * aDeck[randomSuit].length);
    
    const chosenCard = aDeck[randomSuit][randomCard];
    const chosenCardPos = aDeck[randomSuit].indexOf(chosenCard);
    
    const deliverCard = aDeck[randomSuit].splice(chosenCardPos - 1, 1);

    console.log(`${deliverCard} of ${randomSuit}`);

    return `${deliverCard} of ${randomSuit}`
}

export default {cardDeck, pickCard}