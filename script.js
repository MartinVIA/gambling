var myCards=[
[[2,false],[3,false],[4,false],[5,false],[6,false],[7,false],[8,false],[9,false],[10,false],['J',false],['Q',false],['K',false],['A',false]],
[[2,false],[3,false],[4,false],[5,false],[6,false],[7,false],[8,false],[9,false],[10,false],['J',false],['Q',false],['K',false],['A',false]],
[[2,false],[3,false],[4,false],[5,false],[6,false],[7,false],[8,false],[9,false],[10,false],['J',false],['Q',false],['K',false],['A',false]],
[[2,false],[3,false],[4,false],[5,false],[6,false],[7,false],[8,false],[9,false],[10,false],['J',false],['Q',false],['K',false],['A',false]]
]

function generate(){
    var cardType=["Hearts","Cloves","Spades","Diamonds"]
    var randomType=Math.floor((Math.random()*myCards.length));
    var randomNumber=Math.floor((Math.random()*myCards[randomType].length));
    var generatedcard="images/"+cardType[randomType]+".png";
    
    document.getElementById("cardImage").src=generatedcard;
    document.getElementById("card").innerHTML="Card is "+myCards[randomType][randomNumber][0]+" of "+cardType[randomType]+" and "+myCards[randomType][randomNumber][1];
    document.getElementsByClassName("number")[0].innerText="b"+myCards[randomType][randomNumber][0];
    myCards[randomType][randomNumber][1]=true;
}