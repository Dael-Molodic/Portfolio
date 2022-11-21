const eagle = "./img/adler-g2e6da9b74_1920.jpg";
const bee = "./img/bee-gebb4da018_1920.jpg";
const dog = "./img/husky-gdea9055db_1920.jpg";
const butterfly = "./img/butterfly-gcaee594c1_1920.jpg";
const cat = "./img/cat-g584c10027_1920.jpg";
const gorilla = "./img/gorilla-g34d83e689_1920.jpg";
const horse = "./img/horse-g1980fd91a_1920.jpg";
const lion = "./img/lion-gf614e669d_1920.jpg";
const owl = "./img/owl-g01799629f_1920.jpg";
const parrot = "./img/macaw-gbb46da5b2_1920.jpg";
const swan = "./img/swan-g29c8eba9d_1920.jpg"; 
const tiger = "./img/tiger-gcfa76313d_1280.jpg";

const avocado = "./img/avocado-g086bb1005_1920.jpg";
const banana = "./img/banana-gfeb210ea6_1920.jpg";
const sushi = "./img/food-g07f5edcc9_1920.jpg";
const egg = "./img/fried-egg-ga47c35bbb_1920.jpg";
const hamburger = "./img/hamburger-g925a28380_1920.jpg";
const hotDog = "./img/hot-g0620148f4_640.jpg";
const iceCream = "./img/ice-cream-g348718e59_1920.jpg";
const Bolognese = "./img/meal-g2528ef854_1920.jpg";
const pizza = "./img/pizza-g9f4c0b010_1920.jpg";
const salad = "./img/salad-g5ab8678f8_1920.jpg";
const schnitzel = "./img/schnitzel-g11f0ec502_1920.jpg";
const steak = "./img/steak-g9f0b41bc7_1920.jpg";


const mainFoodCards = [avocado, avocado, banana, banana, sushi, sushi, egg, egg, hamburger, hamburger, hotDog, hotDog, iceCream, iceCream, Bolognese, Bolognese, pizza, pizza, salad, salad, schnitzel, schnitzel, steak, steak];
const mainAnimalCards = [eagle, eagle, bee, bee, dog, dog, butterfly, butterfly, cat, cat, gorilla, gorilla, horse, horse, lion, lion, owl, owl, parrot, parrot, swan, swan, tiger, tiger];


const urlParams = new URLSearchParams(window.location.search);
const cardsNum = Number(urlParams.get('card-number'));
let pleyersNum = Number(urlParams.get('player-number'));
const cards = (Number(urlParams.get('card-type'))) ? mainFoodCards.slice(0, cardsNum) : mainAnimalCards.slice(0, cardsNum);


let memoComputer = [];
let startTime;
let endTime;
let selectedCardId = -1;
let selectedCardValue;
let checking = true;
let delay = true;
let turnCounter = 0;
let mainScoreCount = 0;
let scoreTime;
let computer = false;
let memoCompCont = 0;
let matchFound = [];
let twins = false;
let compLevel;


document.addEventListener("DOMContentLoaded", () => {

    init(cards, pleyersNum);
    startAnimation(cards);
    makeExitButton();

});



function init(arr, players) {
    shufel(arr);
    for(i in arr){
        document.getElementById("bord").appendChild(createCard(arr[i], i));
    }

    (checkIfComputerPly()) ? players = 2 : setUserNames();
    scalingCardStyle(cardsNum);

    for(j=0 ; j<players ; j++){
        document.getElementById("scoreboard").appendChild(createPlayer(j))
    }
    
}

function setUserNames() {

    setTimeout(() => {
        
        for (i=0 ; i<pleyersNum ; i++) {
            document.getElementById(`playerImg${i}`).innerText = ` ${urlParams.get(`userName${i+1}`)}`
        }

    },1000)

}

async function startAnimation(arr) {
    delay = false;

    
    const startPage = document.createElement("div");
    startPage.className = "start-blur flex-box";
    document.getElementById("backImage").appendChild(startPage);
    
    for(i=3 ; i>0 ; i--) {
        startPage.innerText = i;
        await sleep(1);
    }

    startPage.innerText = "go🏃‍♂️";
    await sleep(1);
    startPage.remove();


    for( a in arr ){
        document.getElementById(`front${a}`).classList.add( "startAnimation" );
        await sleep(0.04);
        document.getElementById(`front${a}`).classList.remove( "startAnimation" );
    }
    
    document.getElementById( "playerImg0" ).classList.add( "playingNow" );
    delay = true;

    await sleep(1);
    startTime = Date.now();
    
    stopwatch();

}
 
async function stopwatch() {
    
    const turnTime = document.querySelector("#timer");
    let digitTimer = 10;
    
    let progress = setInterval(() => { 

        digitTimer = digitTimer - 0.01;
        turnTime.innerText = `0${digitTimer.toString()[0]}:${digitTimer.toString()[2]}${digitTimer.toString()[3]}`;
        document.querySelector("#watch").style.background = `conic-gradient(rgb(255, 153, 0), rgb(255, 153, 0), rgb(255, 153, 0), rgb(255, 255, 0) ${360 - (digitTimer * 36)}deg, rgba(255, 0, 0, 0.3) 0deg)`;
        
        if(delay==false) {
            clearInterval(progress);
        }
        else if(digitTimer.toString().slice(0, 4) == 0.00) {
            turnTime.innerText = "00:00";
            clearInterval(progress);

            setTimeout(() => {

                if(delay==false){
                    return;
                }
                
                if(selectedCardId > -1){
                    document.getElementById(selectedCardId).classList.remove("clicked");
                }
                checking = true;
                nextTurn();
                startTime = Date.now();
            }, 600);
        }

    }, 10);
}

function shufel(arr) {
    
    let temp;
    
    for(i in arr){
        const ranIn = Math.floor(Math.random() * arr.length)
        temp = arr[ranIn];
        arr[ranIn] = arr[i];
        arr[i] = temp;
    }
    return arr;
}

function createCard(card, inx) {
    const cardDiv = document.createElement("div");
    cardDiv.id = inx; 
    cardDiv.className = "card";
    cardDiv.onclick = () => {

        if(delay){

            if((!computer) || (computer && turnCounter != 1)){
                
                if(computer && checkIfNotInMemo(card, inx)) {
                    addToMemo(card, inx);
                }
                cardDiv.classList.add("clicked");
                selection(card, inx);  
    
            }

        }
    }

    const baseDiv = document.createElement("div");
    baseDiv.className = "base";
    baseDiv.id = `base${inx}`;

    const frontDiv = document.createElement("div");
    frontDiv.className = "front";
    frontDiv.id = `front${inx}`;

    const backDiv = document.createElement("div");
    backDiv.className = "back";
    backDiv.id = `back${inx}`;
    backDiv.style.backgroundImage = "url("+card+")";

    baseDiv.appendChild(frontDiv);
    baseDiv.appendChild(backDiv);

    cardDiv.appendChild(baseDiv);

    return cardDiv;
}

function scalingCardStyle(cardsNum) {

    let cardSizeArr = document.getElementsByClassName("card");

    switch(cardsNum){
        case 24:
            document.getElementById("bord").style.width = "67vw"

            for(i of cardSizeArr) {
                i.style.width  = "14.2%"
            }

            if(computer){
                compLevel = 8;
            }
            
        break;
    
        case 20:
            document.getElementById("bord").style.width = "62vw"

            for(i of cardSizeArr) {
                i.style.width  = "17.2%"
            }

            if(computer){
                compLevel = 6;
            }

        break;
        
        case 16:
            document.getElementById("bord").style.width = "50vw"

            for(i of cardSizeArr) {
                i.style.width  = "20.2%"
            }

            if(computer){
                compLevel = 4;
            }

        break;
    }
    
}

function createPlayer(playerNum) {
    const playerDiv = document.createElement("div");
    playerDiv.id = ("player" + (playerNum))
    playerDiv.className = "players"

    const playerImg = document.createElement("div")
    playerImg.className = "playerImg"
    playerImg.id = ("playerImg" + (playerNum))
    
    const playerText = document.createElement("div")
    playerText.className = "playerText"
    playerText.id = ("playerText" + (playerNum))
    playerText.innerText = "0"

    playerDiv.appendChild(playerImg)
    playerDiv.appendChild(playerText)

    return playerDiv;
}

async function selection(card, id) {
    
    if(checking || id == selectedCardId) {

        selectedCardId = id;
        selectedCardValue = card;
        checking = false;

        if (computer && turnCounter == 1) {
            computerMove();
        }

        return;
    }

    endTime = Date.now();
    delay = false;
    document.querySelectorAll(".card").forEach(e => e.style.cursor = "default");

    await sleep(3);

    document.querySelectorAll(".card").forEach(e => e.style.cursor = "pointer");
    delay = true;
    
    if(card == selectedCardValue) {
        equalCards(card, id);
    } 
    else {
        falseSelect(document.getElementById(id), document.getElementById(selectedCardId))
        nextTurn();

        selectedCardValue = "";
    }
    startTime = Date.now();
    checking = true;

}

async function sleep(seconds) {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

function equalCards(cardValue ,cardId) {
    if(computer){
        deleteCardsFromMemo(cardValue);
    }

    deleteCardsFromBoard(cardId, selectedCardId);
    addScore(startTime, endTime);
    mainScoreCount++;
    
    if(mainScoreCount == (cards.length/2)){
        document.getElementById("playerImg"+(turnCounter)).classList.remove("playingNow");
        makeGameOverPage(true);
    } else {
        stopwatch();

        if (computer && turnCounter == 1) {
            computerMove();
        }
        
    }

}

function nextTurn() {
    document.getElementById(`playerImg${turnCounter}`).classList.remove("playingNow");
    
    turnCounter = (turnCounter + 1) % pleyersNum;

    document.getElementById(`playerImg${turnCounter}`).classList.add("playingNow");

    if (computer && turnCounter == 1) {
        computerMove();
    }
    
    stopwatch();
}

async function addScore(start, end) {

    let extra = Number( (( 10 - ((end - start)/1000) )/2).toFixed(0) );
    let newScore = Number(document.getElementById("playerText"+(turnCounter)).innerText) + ((extra < 1) ? 1 : extra);

    document.getElementById("playerText"+(turnCounter)).classList.add("plusPoint");
    document.getElementById("playerText"+(turnCounter)).innerText = newScore;
    await sleep(2);
    document.getElementById("playerText"+(turnCounter)).classList.remove("plusPoint");
}

function makeGameOverPage(end) {
   
    const winner = document.createElement("div");
        
    winner.className = "blur";
    document.getElementById("backImage").appendChild(winner);
   
    document.getElementById("backImage").appendChild(createButton("Rematch", "after-game", "🔁", `${window.location.href}`));
    document.getElementById("backImage").appendChild(createButton("homepage-after-game", "after-game", "🔄", "homepage.html"));
    
    (end)
    ? winner.innerText = whoIsWinner()
    : winner.innerText = stopGame();
}

function whoIsWinner() {
    
    let player1 =urlParams.get('userName1');    
    let player2 =urlParams.get('userName2');
    let player3 =urlParams.get('userName3');

    if(computer){
        player1 = urlParams.get('userName1');
        player2 = "The computer";
    }

    let A = Number(document.getElementById("playerText0").innerText);
    let B = (pleyersNum >= 2) ? Number(document.getElementById("playerText1").innerText) : 0;
    let C = (pleyersNum >= 3) ? Number(document.getElementById("playerText2").innerText) : 0;
    
    if(A>B){
        if(A>C){
            return `\n-${player1} wins-\nscore: ${document.getElementById("playerText0").innerText}`;s
        } else if(A==C){
            return `\n-${player3} and ${player1} wins together-\nscore: ${document.getElementById("playerText0").innerText}`;
        } else {
            return `\n-${player3} wins-\nscore: ${document.getElementById("playerText2").innerText}`;
        }
    } else if(A>C){
        if(A==B){
            return `\n-${player2} and ${player1} wins together-\nscore: ${document.getElementById("playerText0").innerText}`;
        } else {
            return `\n-${player2} win-\nscore: ${document.getElementById("playerText1").innerText}`;
        }
    } else if(B>C){
        return `\n-${player2} win-\nscore: ${document.getElementById("playerText1").innerText}`;
    } else if(C>B){
        return `\n-${player3} win-\nscore: ${document.getElementById("playerText2").innerText}`;
    } else if(A<B){
        return `\n-${player2} and ${player3} wins together-\nscore: ${document.getElementById("playerText1").innerText}`;
    } else {
        return `\n-The score result of the game is equal between all players-\nscore: ${document.getElementById("playerText0").innerText}`;
    }

}

function stopGame() {
    const playButton = document.createElement("button");

    playButton.id = "play";
    playButton.className = "after-game";
    playButton.innerText ="▶";
    playButton.addEventListener("click", removeGameOverPage);

    document.getElementById("backImage").appendChild(playButton);
    
    return "\nTime keeps running";
}

function removeGameOverPage() {
 document.querySelectorAll(".after-game").forEach(b => b.remove());
 document.querySelector(".blur").remove();
}

/**
 * 
 * @param {String} id Id name
 * @param {String} cls Class name
 * @param {String} txt Text or icon for the link
 * @param {href} address  Address to the landing page
 * @returns 
 */
function createButton(id, cls, txt, address) {
    const buttomRematch = document.createElement("a");
    const linkTxt = document.createTextNode(txt);

    buttomRematch.appendChild(linkTxt);
    buttomRematch.href = address;
    buttomRematch.className = cls;
    buttomRematch.id = id;

    return buttomRematch;
}

function deleteCardsFromBoard(Id1, Id2) {

    document.getElementById(`back${Id1}`).remove();
    document.getElementById(`front${Id1}`).remove();
    document.getElementById(`base${Id1}`).remove();
    
    document.getElementById(`back${Id2}`).remove();
    document.getElementById(`front${Id2}`).remove();
    document.getElementById(`base${Id2}`).remove();


    const card1 = document.getElementById(Id1);
    card1.style.backgroundImage = "none";
    card1.className = "twins";
    card1.onclick = () => {};

    const card2 = document.getElementById(Id2);
    card2.style.backgroundImage = "none";
    card2.className = "twins";
    card2.onclick = () => {};
}

function falseSelect(card1, card2) {
    card1.classList.remove("clicked");
    card2.classList.remove("clicked");
}

function makeExitButton() {
    const exitButton = document.querySelector("#Exit-button");
    exitButton.addEventListener("click", () => {
        makeGameOverPage(false);
    });
}

function checkIfComputerPly() {

    if(pleyersNum == 1) {
        pleyersNum = 2;
        computer = true;

        setTimeout(() => {

            document.getElementById("playerImg1").innerText = " Computer";
            document.getElementById("playerImg0").innerText = ` ${urlParams.get('userName1')}`

        }, 1000);
        return true;
    }

    return false;
}

function checkIfNotInMemo(cardV, cardI) {
    let found = true;

    memoComputer.forEach(m => {
        if(m.idNum == cardI){
            found = false;
        }
    })
    if(cardV == selectedCardValue){
        found = false;
    }

    if (checkIfMatch(cardV, cardI)) {
        found = false;
    }

    return found;
}

function checkIfMatch(cardValue, cardId) {
    let match = false;
    memoComputer.forEach(m => {
        if(m.value == cardValue && m.idNum != cardId){
            matchFound.push([
                {
                    value: m.value,
                    idNum: m.idNum
                },
                {
                    value: cardValue,
                    idNum: cardId
                }
            ])
            match = true;
        }
    })
    return match;
}

function addToMemo(value, idNum){
    if(twins) {
        memoComputer.splice(memoCompCont, 0, {
            value: value,
            idNum: idNum,
            time: Date.now()
        })

        twins = false;
    } else {
        memoComputer[memoCompCont]  = {
            value: value,
            idNum: idNum,
            time: Date.now()
        };
    }
    memoCompCont = (memoCompCont + 1) % compLevel; 
}

function deleteCardsFromMemo(cardsValue){
    for(i=0 ; i<matchFound.length ; i++){
        
        if (matchFound[i][0] == undefined) {
            null
        } else if(matchFound[i][0].value == cardsValue){
            matchFound.splice(i, 1);
            i--
        }
    }
    
    for(i=0 ; i<memoComputer.length ; i++){

        if (memoComputer[i] == undefined) {
            null
        } else if(memoComputer[i].value == cardsValue){
            memoComputer.splice(i, 1);
             i--
        }
    }

    twins = true;
}

function computerMove(){
    
    let compTimeMove = 1300;
    if(!(matchFound[0] == undefined)){
        compTimeMove = ((Date.now() - memoComputer[computerScore()].time) < 10000)
                        ? 430
                        : ((Date.now() - memoComputer[computerScore()].time) < 17000)
                        ? 1200
                        : ((Date.now() - memoComputer[computerScore()].time) < 28000)
                        ? 1900
                        : ((Date.now() - memoComputer[computerScore()].time) < 40000)
                        ? 2900
                        : 3250
    }

    setTimeout (() => {
        
        if(!(matchFound[0] == undefined)) {

            let mat1 = document.getElementById(matchFound[0][0].idNum);
            let mat2 = document.getElementById(matchFound[0][1].idNum);
            let matValue1 = document.getElementById(`back${matchFound[0][0].idNum}`).style.backgroundImage.slice(5, -2);
            let matValue2 = document.getElementById(`back${matchFound[0][1].idNum}`).style.backgroundImage.slice(5, -2);

            if(mat1.classList.contains("clicked")){

                mat2.classList.add("clicked");
                selection(matValue2, matchFound[0][1].idNum);

            } else {

                mat1.classList.add("clicked");
                selection(matValue1, matchFound[0][0].idNum);

            }

        } else {

            let ranCardId = (Math.floor(Math.random() * cardsNum).toString());
            while(isInMemo(ranCardId)){
                ranCardId = (Math.floor(Math.random() * cardsNum).toString());
            }
            
            let ranCard = document.getElementById(ranCardId);
            let ranCardValue = document.getElementById(`back${ranCardId}`).style.backgroundImage.slice(5, -2);

            if(computer && checkIfNotInMemo(ranCardValue, ranCardId)) {
                 addToMemo(ranCardValue, ranCardId);
            }
            
            ranCard.classList.add("clicked");
            selection(ranCardValue, ranCardId);

        }
        
    }, compTimeMove);
}

function isInMemo(ranId) {
    let found = false;

    memoComputer.forEach(m => {
        if(m.idNum == ranId){
            found = true;
        }
    })

    if(document.getElementById(ranId).classList.contains("twins")){
        found = true;
    }

    return found;
}

function computerScore(){
    
    for(i in memoComputer){
        if(memoComputer[i].value == matchFound[0][0].value){
            return Number(i);
        }
    }
    
    return 0;
}