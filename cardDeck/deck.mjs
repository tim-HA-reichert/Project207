const cardDeck = () => {
        const theDeck = {
            "Hearts": ["Ace", 2, 3, 4, 5, 6, 7, 8, 9, 10, "Jack", "Queen", "King"],
            "Spades": ["Ace", 2, 3, 4, 5, 6, 7, 8, 9, 10, "Jack", "Queen", "King"],
            "Clubs": ["Ace", 2, 3, 4, 5, 6, 7, 8, 9, 10, "Jack", "Queen", "King"],
            "Diamonds": ["Ace", 2, 3, 4, 5, 6, 7, 8, 9, 10, "Jack", "Queen", "King"]
        };
        return theDeck
    } 
/* 
//For testing
    const cardDeck = () => {
        const theDeck = {
            "Hearts": [1, 2],
            "Spades": [1,2],
            "Clubs": [1,2],
            "Diamonds": [1,2]
        };
        return theDeck
    }  */

const pickCard = (aDeck) => {
    const suits = Object.keys(aDeck);

    while (suits.length > 0) {
        let randomSuit = suits[Math.floor(Math.random() * suits.length)];

        if (aDeck[randomSuit].length > 0) {
            const randomCard = Math.floor(Math.random() * aDeck[randomSuit].length);
            
            const chosenCard = aDeck[randomSuit][randomCard];
            const chosenCardPos = aDeck[randomSuit].indexOf(chosenCard);
            
            const deliverCard = aDeck[randomSuit].splice(chosenCardPos, 1);
            
            console.log(`${deliverCard} of ${randomSuit}`);
            
            return `${deliverCard[0]} of ${randomSuit}`;
        } else {
            const removeEmptySuit = suits.indexOf(randomSuit);
            suits.splice(removeEmptySuit, 1);
        }
    }

    return "Empty deck!";
}


export default {cardDeck, pickCard}