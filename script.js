// Simple card deck and generator
const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'];
const deck = [];

// var generatedcard="images/"+cardType[randomType]+".png";                               
// document.getElementById("cardImage").src=generatedcard;

// build the deck
suits.forEach(suit => {
    values.forEach(value => {
        deck.push({
            suit: suit,
            value: value,
            // filename convention: images/<value>_of_<suit>.png
            // var imageUrl="images/2_of_hearts.png";
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
    // var img = document.getElementById('cardImage');
    // if (img) img.src = selectedCard.imageUrl;

    const randomIndex = Math.floor(Math.random() * deck.length);
    const selectedCard = deck[randomIndex];
    const imageUrl = `images/${selectedCard.value}_of_${selectedCard.suit}.png`;

    // update the card text
    document.getElementById('card').textContent = `Card is ${selectedCard.value} of ${selectedCard.suit}`;
    //  imageUrl=`images/${selectedCard.value}_of_${s;
    document.getElementById("cardImage").src=imageUrl;

    

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

    // // update image (if file exists with that name)
    // const img = document.getElementById('cardImage');
    // if (img) img.src = selectedCard.imageUrl;

    return selectedCard;
}
//Buttons 
document.getElementById('DealButton').onclick = startRound;
document.getElementById('HitButton').onclick = hitHand;
document.getElementById('StandButton').onclick = standHand;
document.getElementById('DoubleButton').onclick = doubleHand;
document.getElementById('SplitButton').onclick = splitHand;


document.getElementById("popup").style.display = "none";
// blackjack logic with arrays as hands

let dealerHand = [];
let playerMainHand = [];
let playerSplitHand = [];

//function to make face cards into 10s and a into 11 / 1
function convertCards(hand)
{
    if(card.value )
    {
     return 11
    }
    if(card.value)
    {
        
    }
}

// this counts the cards value 
function handSum(hand)
{
    let sum= 0;
    let ace = 0;
    hand.forEach(card => {
        sum += cardValue(card);
        if (card.value === 'ace')
            ace++;
    })
    while (sum > 21 && ace > 0)
    {
        sum -=10;
        sum--;
    }
    return sum;
}