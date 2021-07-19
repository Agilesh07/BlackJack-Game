let blackjackGame = {
    'you':{
        'scorespan' : '.your-results',
        'div' : '.your-box',
        'score' : 0,
    },
    'dealer':{
        'scorespan' : '.dealer-results',
        'div' : '.dealer-box',
        'score' : 0,
    },
    'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'],
    'cardsmap':{'1': 1, '2': 2,'3': 3, '4': 4,'5': 5,'6': 6,'7': 7,'8': 8,'9': 9,'10': 10,'J': 10,'Q': 10,'K': 10,'A':[1,11]},
    'wins': 0,
    'losses': 0,
    'drew': 0,
    'isStand': false,
    'turnsOver': false,
}

const YOU = blackjackGame['you'];
const DEALER = blackjackGame['dealer'];

const hitSound = new Audio('sounds/swish.mp3');
const winSound = new Audio('sounds/cash.mp3');
const lostSound = new Audio('sounds/aww.mp3');

document.querySelector('#hit').addEventListener("click",blackjackhit);
document.querySelector('#stand').addEventListener("click",dealergame);
document.querySelector('#deal').addEventListener("click",blackjackdeal);


function blackjackhit() {
    if(blackjackGame['isStand'] === false){
        let card = randomCard();
        showCard(card,YOU);
        updateScore(card,YOU);
        showScore(YOU)
    }
}

function randomCard(){
    let random = Math.floor(Math.random() * 13);
    return blackjackGame['cards'][random]
}

function showCard(card , activeplayer){
    if(activeplayer['score'] <= 21){
        let cardImage = document.createElement("img");
        cardImage.src = `images/${card}.png`;
        document.querySelector(activeplayer['div']).appendChild(cardImage);
        hitSound.play();
    }
}

function blackjackdeal(){
    if(blackjackGame['turnsOver'] === true){
        blackjackGame['isStand'] = false;
        let yourImages = document.querySelector('.your-box').querySelectorAll('img');
        let dealerImages = document.querySelector('.dealer-box').querySelectorAll('img');

        for(let i = 0; i<yourImages.length;i++){
            yourImages[i].remove();
        }

        for(let i = 0; i<dealerImages.length;i++){
            dealerImages[i].remove();
        }

        YOU['score'] = 0;   
        DEALER['score'] = 0;

        document.querySelector('.your-results').textContent = 0;
        document.querySelector('.dealer-results').textContent = 0;
    
        document.querySelector('.your-results').style.color = "#ffffff";
        document.querySelector('.dealer-results').style.color = "#ffffff";

        document.querySelector('.results').textContent = "Let's Play"
        document.querySelector('.results').style.color = "black"

    }
}

function updateScore(card,activeplayer){
    if(card === 'A'){
        if(activeplayer['score'] + blackjackGame['cardsmap'][card][1] <= 21){
            activeplayer['score'] += blackjackGame['cardsmap'][card][1];
        } else{
            activeplayer['score'] += blackjackGame['cardsmap'][card][0];
        }
    } else{
        activeplayer['score'] += blackjackGame['cardsmap'][card];
    }
}

function showScore(activeplayer){
    if(activeplayer['score'] > 21){
        document.querySelector(activeplayer['scorespan']).textContent = "BUST!";
        document.querySelector(activeplayer['scorespan']).style.color = "red";
    } else {
        document.querySelector(activeplayer['scorespan']).textContent = activeplayer['score'];
    }
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve,ms))
}
async function dealergame(){
    blackjackGame['isStand'] = true;
    while(DEALER['score'] < 16 && blackjackGame['isStand'] === true){
        let card = randomCard();
        showCard(card,DEALER);
        updateScore(card,DEALER);
        showScore(DEALER);
        await sleep(1000)
    }

    blackjackGame['turnsOver'] = true;
    let winner = computeWinner();
    showResults(winner)
}

function computeWinner(){
    let winner;

    if(YOU['score'] <= 21 ){
        if(YOU['score'] > DEALER['score'] || DEALER['score'] > 21){
            blackjackGame['wins']++;
            winner = YOU;
            console.log("You win");
        } else if(YOU['score'] === DEALER['score']){
            blackjackGame['drew']++;
        } else if(YOU['score'] < DEALER['score']){
            blackjackGame['losses']++;
            winner = DEALER;
        }
    } else if(YOU['score'] > 21 && DEALER['score'] <= 21 ){
        blackjackGame['losses']++;
        winner = DEALER;
    } else if(YOU['score'] > 21 && DEALER['score'] > 21){
        blackjackGame['drew']++;
    }

    return winner;
}

function showResults(winner){
    let message,messageColor;

    if(blackjackGame['turnsOver'] === true){
        if(winner === YOU){
            document.querySelector('#wins').textContent = blackjackGame['wins'];
            message = "YOU WON!!";
            messageColor = "green"
            winSound.play()
        } else if(winner === DEALER){
            document.querySelector('#losses').textContent = blackjackGame['losses'];
            message = "YOU LOST!";
            messageColor = "red"
            lostSound.play()
        } else{
            document.querySelector('#draws').textContent = blackjackGame['drew'];
            message = "YOU DREW!";
            messageColor = "black";
        }
    
        document.querySelector('.results').textContent = message;
        document.querySelector('.results').style.color = messageColor;
    }
}