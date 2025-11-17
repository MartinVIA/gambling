// Simple card deck and generator
const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'];
const deck = [];

// deck image files follow the convention: images/<value>_of_<suit>.png

// Toggle info modal visibility
function toggleInfoModal() {
    const modal = document.getElementById('infoModal');
    if (modal) {
        modal.classList.toggle('active');
    }
}

// Animate card flip from deck pile to destination
function animateCardFlip(destinationElement, card) {
    const container = document.getElementById('flyingCardContainer');
    if (!container) return;

    // Hide the destination card until animation completes
    destinationElement.style.opacity = '0';

    const flyingCard = document.createElement('div');
    flyingCard.className = 'flying-card';
    
    const cardFaceUrl = `url('images/${cardImageName(card.value)}_of_${card.suit}.png')`;
    flyingCard.style.setProperty('--cardFace', cardFaceUrl);

    // Calculate start (deck) and destination positions relative to viewport
    const rect = destinationElement.getBoundingClientRect();
    const deckEl = document.querySelector('.deck-pile');
    let startX = 20 + 50; // fallback (matches previous defaults)
    let startY = window.innerHeight - 80 - 70;
    if (deckEl) {
        const deckRect = deckEl.getBoundingClientRect();
        startX = deckRect.left + deckRect.width / 2;
        startY = deckRect.top + deckRect.height / 2;
    }

    // place the flying card at the deck center (adjust by half card size)
    flyingCard.style.left = `${Math.round(startX - 50)}px`;
    flyingCard.style.top = `${Math.round(startY - 70)}px`;

    // compute vector from start to destination center
    const destX = rect.left + rect.width / 2;
    const destY = rect.top + rect.height / 2;
    const dx = Math.round(destX - startX);
    const dy = Math.round(destY - startY);

    flyingCard.style.setProperty('--tx', `${dx}px`);
    flyingCard.style.setProperty('--ty', `${dy}px`);

    container.appendChild(flyingCard);

    // Reveal the destination card and remove the flying card after animation completes
    setTimeout(() => {
        destinationElement.style.opacity = '1';
        flyingCard.remove();
    }, 800);
}

// Helper to create a card image with optional animation
function createCardImage(card, destinationArea, animate = false) {
    const img = document.createElement('img');
    img.className = 'card-thumb';
    img.src = `images/${cardImageName(card.value)}_of_${card.suit}.png`;
    destinationArea.appendChild(img);
    
    if (animate) {
        // Delay animation slightly so the card is rendered first
        setTimeout(() => {
            animateCardFlip(img, card);
        }, 10);
    }
    return img;
}

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

// draw a random card from the deck and remove it so it can't be drawn again
function drawCard() {
    if (deck.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * deck.length);
    return deck.splice(randomIndex, 1)[0];
}

// optional: rebuild the deck (call this at the start of a new round if you want a full deck again)
function resetDeck() {
    deck.length = 0;
    suits.forEach(suit => {
        values.forEach(value => {
            deck.push({
                suit: suit,
                value: value,
                code: `${value.charAt(0).toUpperCase()}${suit.charAt(0).toUpperCase()}`
            });
        });
    });
}

// (debug generator removed)
//Buttons 
document.getElementById('HitButton').onclick = hitHand;
document.getElementById('StandButton').onclick = standHand;
document.getElementById('DoubleButton').onclick = doubleHand;
document.getElementById('SplitButton').onclick = splitHand;

// ensure Place Bet button and input are wired and enabled
const placeBtn = document.getElementById('placeBetBtn');
if (placeBtn) {
    placeBtn.onclick = placeBet;
    placeBtn.disabled = false;
}
const betInputEl = document.getElementById('betAmount');
if (betInputEl) betInputEl.disabled = false;


document.getElementById("popup").style.display = "none";
// start with action buttons disabled until a bet is placed
enableActionButtons(false);
// (updateBetUI will be called after game state is declared)
// blackjack logic with arrays as hands

let dealerHand = [];
let playerMainHand = [];
let playerSplitHand = [];
let lastDealerHandCount = 0;
let lastPlayerMainCount = 0;
let lastPlayerSplitCount = 0;

//function to make face cards into 10s and a into 11 / 1
// NOTE: removed unused/unfinished helper `convertCards` — use `cardValue` + `handSum` for scoring

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
        sum -= 10;
        ace--;
    }
    return sum;
}

// convert a card object to its numeric blackjack value (ace = 11 initially)
function cardValue(card) {
    if (!card || !card.value) return 0;
    if (card.value === 'ace') return 11;
    if (card.value === 'jack' || card.value === 'queen' || card.value === 'king') return 10;
    // numeric strings like '2'..'10'
    return parseInt(card.value, 10) || 0;
}

// convert card value to image filename (e.g., 'jack' -> 'jack', '10' -> '10')
function cardImageName(value) {
    if (value === 'jack') return 'jack';
    if (value === 'queen') return 'queen';
    if (value === 'king') return 'king';
    if (value === 'ace') return 'ace';
    return value; // numeric cards like '2', '3', ..., '10'
}

// betting / game state
let playerBalance = 1000;
let betMain = 0;
let betSplit = 0;
let activeHand = 'main'; // 'main' or 'split'
let dealerRevealed = false;
let roundActive = false; // Track if a round is currently in progress

// show initial UI values (balance, scores)
updateBetUI();

// enable/disable action buttons (Hit/Stand/Double/Split/Deal)
function enableActionButtons(enabled) {
    const ids = ['HitButton','StandButton','DoubleButton','SplitButton'];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.disabled = !enabled;
    });
}

// update balance/bet UI
function updateBetUI() {
    const bal = document.getElementById('balance');
    if (bal) bal.textContent = playerBalance;
    const pm = document.getElementById('playerScoreMain');
    const ps = document.getElementById('playerScoreSplit');
    const dealerScoreEl = document.getElementById('dealerScore');
    if (pm) pm.textContent = handSum(playerMainHand);
    if (ps) ps.textContent = playerSplitHand.length ? handSum(playerSplitHand) : 0;
    if (dealerScoreEl) dealerScoreEl.textContent = dealerRevealed ? handSum(dealerHand) : '?';
}

function placeBet() {
    const input = document.getElementById('betAmount');
    const out = document.getElementById('card');
    if (!input) return;
    const amt = parseInt(input.value, 10) || 0;
    if (amt <= 0) {
        if (out) out.textContent = 'Enter a valid bet';
        return;
    }
    if (amt > playerBalance) {
        if (out) out.textContent = 'Insufficient balance';
        return;
    }
    // set bet and lock input
    betMain = amt;
    playerBalance -= amt;
    roundActive = true;
    updateBetUI();
    if (out) out.textContent = `Bet placed $${betMain} — dealing...`;
    const placeBtnEl = document.getElementById('placeBetBtn');
    const betInputEl = document.getElementById('betAmount');
    if (placeBtnEl) placeBtnEl.disabled = true;
    if (betInputEl) betInputEl.disabled = true;

    // Immediately deal the initial cards for this round
    resetDeck();
    dealerHand = [];
    playerMainHand = [];
    playerSplitHand = [];
    dealerRevealed = false;
    activeHand = 'main';
    betSplit = 0;

    // Deal with staggered animations
    playerMainHand.push(drawCard());
    dealerHand.push(drawCard());
    playerMainHand.push(drawCard());
    dealerHand.push(drawCard());

    updateUIHands();
    enableActionButtons(true);
}

// UI helper to show player and dealer hands (basic text display)
function updateUIHands() {
    // render dealer area and player areas with small card images
    const dealerArea = document.getElementById('dealerArea');
    const playerArea = document.getElementById('playerArea');
    const playerSplitArea = document.getElementById('playerSplitArea');
    const cardEl = document.getElementById('card');
    if (!cardEl) return;
    if (dealerArea) dealerArea.innerHTML = '';
    if (playerArea) playerArea.innerHTML = '';
    if (playerSplitArea) playerSplitArea.innerHTML = '';

    // Dealer: if not revealed show first card and a placeholder
    if (dealerHand.length > 0) {
        const first = dealerHand[0];
        const img = document.createElement('img');
        img.className = 'card-thumb';
        img.src = `images/${cardImageName(first.value)}_of_${first.suit}.png`;
        if (dealerArea) dealerArea.appendChild(img);
        // Animate if this is a new card
        if (dealerHand.length > lastDealerHandCount && dealerArea) {
            setTimeout(() => animateCardFlip(img, first), 50);
        }
        if (!dealerRevealed) {
            const hiddenImg = document.createElement('img');
            hiddenImg.className = 'card-thumb';
            hiddenImg.src = 'images/back_of_cards.png';
            hiddenImg.alt = 'hidden card';
            if (dealerArea) dealerArea.appendChild(hiddenImg);
        } else {
            for (let i = 1; i < dealerHand.length; i++) {
                const c = dealerHand[i];
                const img2 = document.createElement('img');
                img2.className = 'card-thumb';
                img2.src = `images/${cardImageName(c.value)}_of_${c.suit}.png`;
                if (dealerArea) dealerArea.appendChild(img2);
                // Animate if this is a new card
                if (i >= lastDealerHandCount && dealerArea) {
                    setTimeout(() => animateCardFlip(img2, c), 50);
                }
            }
        }
    }

    // Player main
    playerMainHand.forEach((c, idx) => {
        const img = document.createElement('img');
        img.className = 'card-thumb';
        img.src = `images/${cardImageName(c.value)}_of_${c.suit}.png`;
        if (playerArea) playerArea.appendChild(img);
        // Animate if this is a new card
        if (idx >= lastPlayerMainCount && playerArea) {
            setTimeout(() => animateCardFlip(img, c), 50);
        }
    });

    // Player split
    playerSplitHand.forEach((c, idx) => {
        const img = document.createElement('img');
        img.className = 'card-thumb';
        img.src = `images/${cardImageName(c.value)}_of_${c.suit}.png`;
        if (playerSplitArea) playerSplitArea.appendChild(img);
        // Animate if this is a new card
        if (idx >= lastPlayerSplitCount && playerSplitArea) {
            setTimeout(() => animateCardFlip(img, c), 50);
        }
    });

    // Update counters for next call
    lastDealerHandCount = dealerHand.length;
    lastPlayerMainCount = playerMainHand.length;
    lastPlayerSplitCount = playerSplitHand.length;

    // Show or hide the split area container depending on whether the player has split
    const playerSplitBox = document.getElementById('playerSplitBox');
    if (playerSplitBox) {
        if (playerSplitHand && playerSplitHand.length > 0) playerSplitBox.style.display = 'block'; else playerSplitBox.style.display = 'none';
    }

    // top text summary
    const playerDesc = playerMainHand.map(c => `${c.value} of ${c.suit}`).join(', ');
    const dealerVisible = dealerHand.length > 0 ? `${dealerHand[0].value} of ${dealerHand[0].suit}` : 'none';
    cardEl.textContent = `Player (${handSum(playerMainHand)}): ${playerDesc} | Dealer (showing): ${dealerVisible}`;

    // big-card element removed from HTML; no corner image updated anymore

    updateBetUI();
}

// start a new round: reset deck and deal initial two-card hands
function startRound() {
    if (betMain <= 0) {
        const out = document.getElementById('card');
        if (out) out.textContent = 'Place a bet before starting the round';
        return;
    }
    resetDeck();
    dealerHand = [];
    playerMainHand = [];
    playerSplitHand = [];
    dealerRevealed = false;
    activeHand = 'main';
    betSplit = 0;

    // deal: player, dealer, player, dealer
    playerMainHand.push(drawCard());
    dealerHand.push(drawCard());
    playerMainHand.push(drawCard());
    dealerHand.push(drawCard());

    updateUIHands();
    // enable action buttons while round is active
    enableActionButtons(true);
}

// player hits on main hand
function hitHand() {
    const card = drawCard();
    if (!card) {
        document.getElementById('card').textContent = 'No cards left to draw';
        return;
    }
    if (activeHand === 'main') {
        playerMainHand.push(card);
        updateUIHands();
        const mainSum = handSum(playerMainHand);
        if (mainSum > 21) {
            document.getElementById('card').textContent += ' -- BUST on main hand! Dealer wins.';
            // if split exists, move to split hand
            if (playerSplitHand.length > 0) {
                activeHand = 'split';
                document.getElementById('card').textContent += ' Now playing split hand.';
                return;
            } else {
                // end round
                dealerPlayAndSettle();
                return;
            }
        } else if (mainSum === 21) {
            // player hits 21 on main hand
            if (playerSplitHand.length > 0) {
                // move to split hand if present
                activeHand = 'split';
                document.getElementById('card').textContent += ' -- BLACKJACK on main hand! Now playing split hand.';
                return;
            }
            // immediate win: award double the bet and end round
            playerBalance += betMain * 2;
            document.getElementById('card').textContent += ' -- 21! You win. Payout applied.';
            betMain = 0; betSplit = 0;
            updateBetUI();
            // disable controls until next bet
            enableActionButtons(false);
            // re-enable bet controls
            const placeBtnEl = document.getElementById('placeBetBtn');
            const betInputEl = document.getElementById('betAmount');
            if (placeBtnEl) placeBtnEl.disabled = false;
            if (betInputEl) betInputEl.disabled = false;
            return;
        }
    } else {
        playerSplitHand.push(card);
        updateUIHands();
        const splitSum = handSum(playerSplitHand);
        if (splitSum > 21) {
            document.getElementById('card').textContent += ' -- BUST on split hand! Dealer wins.';
            dealerPlayAndSettle();
            return;
        } else if (splitSum === 21) {
            // immediate win on split hand
            playerBalance += betSplit * 2;
            document.getElementById('card').textContent += ' -- 21 on split hand! You win. Payout applied.';
            betMain = 0; betSplit = 0;
            updateBetUI();
            // disable controls until next bet
            enableActionButtons(false);
            // re-enable bet controls
            const placeBtnEl2 = document.getElementById('placeBetBtn');
            const betInputEl2 = document.getElementById('betAmount');
            if (placeBtnEl2) placeBtnEl2.disabled = false;
            if (betInputEl2) betInputEl2.disabled = false;
            return;
        }
    }
}

// player stands: dealer plays to 17+, then show result
function standHand() {
    // If there is a split hand and we're standing on main, move to split hand next
    if (activeHand === 'main' && playerSplitHand.length > 0) {
        activeHand = 'split';
        document.getElementById('card').textContent = 'Now playing split hand';
        return;
    }
    // otherwise dealer plays and we settle both hands
    dealerPlayAndSettle();
}

// double: draw one card then stand (bet logic not implemented)
function doubleHand() {
    const target = activeHand === 'main' ? playerMainHand : playerSplitHand;
    const currentBet = activeHand === 'main' ? betMain : betSplit;
    if (!target || target.length !== 2) {
        document.getElementById('card').textContent = 'Double allowed only on first two cards of that hand';
        return;
    }
    // require enough balance to double
    if (playerBalance < currentBet) {
        document.getElementById('card').textContent = 'Insufficient balance to double';
        return;
    }
    // deduct extra bet
    playerBalance -= currentBet;
    if (activeHand === 'main') betMain += currentBet; else betSplit += currentBet;
    const c = drawCard();
    if (c) target.push(c);
    updateUIHands();
    // after doubling, automatically stand this hand
    if (activeHand === 'main' && playerSplitHand.length > 0) {
        activeHand = 'split';
        document.getElementById('card').textContent = 'Doubled main, now playing split hand';
    } else {
        dealerPlayAndSettle();
    }
}

// split: if two starting cards are same value, split into two hands
function splitHand() {
    if (playerMainHand.length !== 2) {
        document.getElementById('card').textContent = 'Split allowed only on first two cards';
        return;
    }
    const a = playerMainHand[0];
    const b = playerMainHand[1];
    if (!a || !b || a.value !== b.value) {
        document.getElementById('card').textContent = 'Cards must match to split';
        return;
    }
    // need additional bet to split
    if (playerBalance < betMain) {
        document.getElementById('card').textContent = 'Insufficient balance to split';
        return;
    }
    playerBalance -= betMain;
    betSplit = betMain;
    // move second card to split hand and draw one card for each hand
    playerSplitHand = [playerMainHand.pop()];
    playerMainHand.push(drawCard());
    playerSplitHand.push(drawCard());
    activeHand = 'main';
    updateUIHands();
}

function dealerPlayAndSettle() {
    dealerRevealed = true;
    // Dealer plays to 17+
    while (handSum(dealerHand) < 17) {
        const c = drawCard();
        if (!c) break;
        dealerHand.push(c);
    }
    updateUIHands();
    const dealerScore = handSum(dealerHand);
    const dealerBusted = dealerScore > 21;
    const dealerHas21 = dealerScore === 21;
    const results = [];
    
    // helper to settle a single hand
    function settle(hand, bet) {
        if (!hand || hand.length === 0) return 'no hand';
        const p = handSum(hand);
        const playerBusted = p > 21;
        const playerHas21 = p === 21;
        
        // Player bust: dealer wins
        if (playerBusted) {
            return 'lose (bust)';
        }
        // Dealer bust: player wins
        if (dealerBusted) {
            playerBalance += bet * 2;
            return 'win (dealer bust)';
        }
        // Both under 21: compare scores
        if (p > dealerScore) {
            playerBalance += bet * 2;
            return 'win';
        }
        if (p === dealerScore) {
            playerBalance += bet;
            return 'push';
        }
        // p < dealerScore: dealer wins
        return 'lose';
    }
    
    // main hand
    if (playerMainHand.length > 0) {
        const r1 = settle(playerMainHand, betMain);
        results.push(`Main: ${r1}`);
    }
    if (playerSplitHand.length > 0) {
        const r2 = settle(playerSplitHand, betSplit);
        results.push(`Split: ${r2}`);
    }
    if (results.length === 0) results.push('No player hands');
    document.getElementById('card').textContent = results.join(' | ');
    // reset bets for next round
    betMain = 0; betSplit = 0;
    roundActive = false;
    updateBetUI();
    // disable action buttons - round ended
    enableActionButtons(false);
    // re-enable bet controls so the player can place a new bet
    const placeBtnEl = document.getElementById('placeBetBtn');
    const betInputEl = document.getElementById('betAmount');
    if (placeBtnEl) placeBtnEl.disabled = false;
    if (betInputEl) betInputEl.disabled = false;
}