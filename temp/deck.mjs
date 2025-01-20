//A deck of cards

//4 difference arrays
function pickACard(){
    const hearts = ["hearts", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    const spade = ["spade", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    const clubs = ["clubs", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    const diamonds = ["diamonds", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    
    const cardDeck = {
        1: hearts,
        2: spade,
        3: clubs,
        4: diamonds
    };
    
    let randomSymbol = Math.ceil(Math.random()*4);
    let randomCardSymbol = cardDeck[randomSymbol];
    
    let randomCard = Math.ceil(Math.random()*13);
    let chosenCard = randomCardSymbol[randomCard];
    
    //Add switch-case for the different numbers. Case 12 = queen or whatever.
    return console.log(chosenCard, randomCardSymbol);

}
     
pickACard();
