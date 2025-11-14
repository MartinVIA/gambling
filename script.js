// Simple card deck and generator
const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'];
const deck = [];
var picked = false;

// build the deck
suits.forEach(suit => {
    values.forEach(value => {
        deck.push({
            suit: suit,
            value: value,
            picked: false
            // filename convention: images/<value>_of_<suit>.png
            // imageUrl: `images/${value}_of_${suit}.png`
            // code: `${value.charAt(0).toUpperCase()}${suit.charAt(0).toUpperCase()}`
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
    const imageUrl = `images/${selectedCard.value}_of_${selectedCard.suit}.png`;

    // update the card text
    document.getElementById('card').textContent = `Card is ${selectedCard.value} of ${selectedCard.suit}`;
    document.getElementById("cardImage").src = imageUrl;
    

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

    return selectedCard;
}

// buttons 
document.getElementById('DealButton').onclick = startRound;
document.getElementById('HitButton').onclick = hitHand;
document.getElementById('StandButton').onclick = standHand;
document.getElementById('DoubleButton').onclick = doubleHand;
document.getElementById('SplitButton').onclick = splitHand;

// blackjack logic with arrays as hands
let dealerHand = [];
let playerMainHand = [];
let playerSplitHand = [];
let isSplit = false;
let roundOver = false;
let mainDone = false;
let splitDone = false;
let activeHand = "main";

// deal a hand to dealer and player
playerMainHand.push(generate());
playerMainHand.push(generate());
dealerHand.push(generate());
dealerHand.push(generate());

function nextHand()
{
    if (isSplit)
    {
     if(!mainDone) 
     {
        activeHand = "main";
        return;
     }
     if (!splitDone)
     {
        activeHand = "split";
        return;
     }
    }
}

//function to make face cards into 10s and aces into 11 / 1
function convertCards(card)
{
    if(card.value ))''"ace"t
        rn 1;1;1;;
    if(card.value === "king" || card.value === "queen" || card.value === "jack")
        return 10;
    return parseInt(card.value);
}

// this counts the cards value 
function handSum(hand)
{ 
    let sum= 0;
    
    let ace = 0;
    hand.forEachconvertCards {
        sum += cardValue(card);
        if (card.value === 'ace')
     );
          ace++;
    })
    while (sum > 21 && ace > 0)
    { 
        sum -=10;
        sum--;
    }
 

// function for when its dealers turn
function dealersTurn()
{
    while (hand.value(dealerHand) < 17)
    {
        dealerHand.draw.card;
    }
}

function hit()
{
    if(roundOver)
    {
        return;
    }
    let hand = (activeHand === "main") ? playerMainHand : playerMainHand;

    const newCard = drawCard;
    hand.push(newCard)
    const total = handValue(hand)

    if (total < 21)
    {
        if (activeHand === "main")
        {
            mainDone = true;
        }
        else {
            splitDone = true;
        }
        updateUI("Bust")
    }
}

   return sum;
}