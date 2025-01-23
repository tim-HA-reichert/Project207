const createDeck = () => {
    fetch('/temp/deck', {method: "POST"})
    .then(response => response.json())
    .then(data => {
        console.log("Deck ID:", data.deckID)  
        //console.log("New Deck:", data.newDeck)
        });  
}

const getDeck = () => {
    const aDeckID = document.getElementById('deckID').value;
    fetch(`/temp/deck/${aDeckID}`)
    .then(response => response.json())
    .then(deckContent => console.log(deckContent));
}


const drawCard = () => {
    const aDeckID = document.getElementById('deckID').value;
    fetch(`temp/deck/${aDeckID}/card`)
    .then(response => response.json())
    .then(drawnCard => console.log(drawnCard))
}


const shuffle = () => {


}
