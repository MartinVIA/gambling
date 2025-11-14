// Simple card deck and generator
const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'];
const deck = [];

// build the deck
suits.forEach(suit => {
    values.forEach(value => {
        deck.push({
            suit: suit,
            value: value,
            // filename convention: images/<value>_of_<suit>.png
            imageUrl:"images/2_of_hearts.png",
            code: `${value.charAt(0).toUpperCase()}${suit.charAt(0).toUpperCase()}`
        });
    });
});

// generate a random card and update the page
function generate(){
    if (!deck.length) {
        document.getElementById('card').textContent = 'No cards in deck';
        return null;
    }

    const randomIndex = Math.floor(Math.random() * deck.length);
    const selectedCard = deck[randomIndex];

    // update the card text
    document.getElementById('card').textContent = `Card is ${selectedCard.value} of ${selectedCard.suit}`;

    // compute display for the big card number/letter
    let display = selectedCard.value;
    switch (selectedCard.value) {
        case 'jack': display = 'J'; break;
        case 'queen': display = 'Q'; break;
        case 'king': display = 'K'; break;
        case 'ace': display = 'A'; break;
        default: display = selectedCard.value; // keeps '10' as '10'
    }

    const numEl = document.querySelector('.number');
    if (numEl) numEl.innerText = display;

    // update image (if file exists with that name)
    const img = document.getElementById('cardImage');
    if (img) img.src = selectedCard.imageUrl;

    return selectedCard;
}

document.getElementById