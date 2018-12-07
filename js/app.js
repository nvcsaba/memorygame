/*
 * Create a list that holds all of your cards
 */

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
*Setting up a newGame by shuffling card and add them to the page
*/

function newGame() {

    let cardDeck = ['fa fa-diamond', 'fa fa-paper-plane-o', 'fa fa-anchor', 'fa fa-bolt', 'fa fa-cube', 'fa fa-leaf', 'fa fa-bicycle','fa fa-bomb', 'fa fa-diamond', 'fa fa-paper-plane-o', 'fa fa-anchor', 'fa fa-bolt', 'fa fa-cube', 'fa fa-leaf', 'fa fa-bicycle','fa fa-bomb'];
    cardDeck = shuffle(cardDeck);

    let deck = document.createDocumentFragment();

    for (card of cardDeck) {
        let element = document.createElement('li');
        element.classList.add('card');
        element.innerHTML = '<i class="' + card + '"></i>';
        deck.appendChild(element);
    }

    document.getElementsByClassName('deck')[0].appendChild(deck);

/*
* Setup Event listeners to all cards
*/
    for(let card of cards){
        card.addEventListener('click', function(event){
            //Start timer at the fist move
            if (stepCounter == 0) {
                timer();
            }
            //If no cards opened, open it
            if(cardCounter == 0 && card.classList.length == 1){
                open(card);
                rate();

            } else {

                //If 1 card is opened and not the same card is clicked then open it
                if(cardCounter ==1 && card.classList.length == 1){
                    open(card);

                    //if they have the same icon, set both to match & increment pairsFound
                    if(card.innerHTML == openedCard.innerHTML){
                        match(openedCard);
                        match(card);
                        pairsFound++;

                    //If they don't match close both cards in 500ms
                    } else {
                        setTimeout(function(){
                            close(openedCard);
                            close(card);

                        },800);
                    }
                }
            }
            //If all 8 pairs are found finish the game
            if (pairsFound == 8) {
                finishGame();
            }
        });
    }
}

/*
* Reset game
* Remove deck, start newGame, reset counters variables and values on the page
*/

function resetGame() {
    document.getElementsByClassName('deck')[0].innerHTML = "";
    newGame();
    openedCard = "";
    cardCounter = 0;
    stepCounter = 0;
    pairsFound = 0;
    timeStarted = 0;
    clearInterval(intervalId);
    document.getElementById('timer').innerHTML = "";
    document.getElementsByClassName('moves')[0].innerHTML = "0";
    document.getElementsByClassName('stars')[0].innerHTML = '<li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li>'
}


/*
* Opens card, increments step and card counter. If there is no openedCard it is saved in a variable
*/

function open(card) {
    card.classList.add('open', 'show');
    cardCounter++;

    if (openedCard == '') {
        openedCard = card;
    }

    countSteps();
}

/*
* Closes card, resets cardCounter and openedCard
*/

function close(card) {
    card.classList.remove('open', 'show');
    openedCard = "";
    cardCounter = 0;
}

/*
* Sets cards to match then resets openedCard and cardCounter
*/

function match(card){
    close(card);
    card.classList.add('match');
    openedCard = '';
    cardCounter = 0;
}

/*
* Counting steps and writing them on screen
*/

function countSteps() {
    stepCounter++;
    document.getElementsByClassName('moves')[0].innerHTML = stepCounter;
}

/*
* Changes the star rating based on number of moves
* 3 stars --> max 26 moves
* 2 stars --> max 32 moves
* 1 star  --> max 36 moves
*/

function rate() {
    function rateDown() {
        let stars = document.getElementsByClassName('stars')[0];
        let emptyStar = document.createDocumentFragment();

        emptyStar = document.createElement('li');
        emptyStar.innerHTML = '<i class="fa fa-star-o"></i>'
        stars.removeChild(stars.firstElementChild);
        stars.appendChild(emptyStar);
    };

    if (stepCounter == 27) {
        rateDown();

    } else if(stepCounter == 33) {
        rateDown();

    } else if (stepCounter == 37) {
        rateDown();

    }
}

/*
* Start and display timer on page with leading zero if required
*/

function timer() {
    timeStarted = new Date();
    intervalId = setInterval(function() {
        let now = new Date();
        let timepassed = new Date(now - timeStarted);
        let minutes = timepassed.getMinutes().toString();
        let seconds = timepassed.getSeconds().toString();

        if(minutes.length < 2) {
            minutes = '0' + minutes;
        };

        if(seconds.length < 2) {
            seconds = '0' + seconds;
        };

        gameTime = minutes + ':' + seconds;
        document.getElementById('timer').innerHTML = gameTime;
    },1000);
}

/*
* End of game actions:
*   Stop timer
*   Populate and show modal with message, score, time, number of moves and option for new game
*       Messages:
*          ***         - Congratulation!
*          **          - Well done!
*          * or less   - Better luck nex time!
*
*/

function finishGame() {
    clearInterval(intervalId);
    let message = (stepCounter < 27 ? "Congratulations!" : (stepCounter < 33 ? "Well Done!" : "Better luck next time!"));
    document.getElementById('message').innerHTML = message;
    document.getElementById('gameTime').innerHTML = gameTime;
    document.getElementById('stepCounter').innerHTML = stepCounter;
    document.getElementById('score').innerHTML = document.getElementsByClassName('stars')[0].innerHTML;
    $('#myModal').modal();
}

/*
*Initializing variables Game functions
*/

let openedCard = "";
let cardCounter = 0;
let stepCounter = 0;
let pairsFound = 0;
let cards = document.getElementsByClassName('card');
let timeStarted = 0;
let gameTime;
var intervalId;
newGame();

/*
*Setup event listeners for restart and new game buttons
*/

let reset = document.getElementsByClassName('restart')[0];

reset.addEventListener('click', function(event){
    resetGame();
});

let newGameB = document.getElementById('newGame');

newGameB.addEventListener('click', function(event){
    resetGame();
});
