//var myCards=[
//[[2,false],[3,false],[4,false],[5,false],[6,false],[7,false],[8,false],[9,false],[10,false],['J',false],['Q',false],['K',false],['A',false]],
//[[2,false],[3,false],[4,false],[5,false],[6,false],[7,false],[8,false],[9,false],[10,false],['J',false],['Q',false],['K',false],['A',false]],
//[[2,false],[3,false],[4,false],[5,false],[6,false],[7,false],[8,false],[9,false],[10,false],['J',false],['Q',false],['K',false],['A',false]],
//[[2,false],[3,false],[4,false],[5,false],[6,false],[7,false],[8,false],[9,false],[10,false],['J',false],['Q',false],['K',false],['A',false]]
//]
// An array of cards, [type[number,has been picked or not]]

//function generate(){
  //  var cardType=["Hearts","Cloves","Spades","Diamonds"]
    // this determined what card type the card is. 
    //var randomType=Math.floor((Math.random()*myCards.length));
    //var randomNumber=Math.floor((Math.random()*myCards[randomType].length));
    //var generatedcard="images/"+cardType[randomType]+".png";
    // non modular idea to parce the card type to a hyperlink image
    
    //document.getElementById("cardImage").src=generatedcard;
    //document.getElementById("card").innerHTML="Card is "+myCards[randomType][randomNumber][0]+" of "+cardType[randomType]+" and "+myCards[randomType][randomNumber][1];
    //document.getElementsByClassName("number")[0].innerText=""+myCards[randomType][randomNumber][0];
    //myCards[randomType][randomNumber][1]=true;
//}

const deck = [];

const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace']

suits.forEach(suit => {
    values.forEach(value => {
        deck.push({
            suit: suit,
            value: value,
            imageUrl: `images/${value}_of_${suit}.png`,
            code: `${value.charAt(0)}${suit.charAt(0)}`,

        })
    })
})