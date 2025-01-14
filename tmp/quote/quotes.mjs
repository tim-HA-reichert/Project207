const randomQuote = () => {
    const quotes = {
        1: "Not all those who wander are lost. — Bilbo Baggins",
        2: "All's well that ends better. — Hamfast Gamgee",
        3: "It's the job that's never started as takes longest to finish. — Sam Gamgee",
        4: "Precious - Gollum",
        5: "The Ring has awoken, it's heard its master's call. — Gandalf",
    };

    const randomNumber = Math.ceil(Math.random()*5);

    return quotes[randomNumber];
};

export default randomQuote;