/*
 * Create a list that holds all of your cards
 */

// Array of cards
cardList = [ "fa fa-diamond",
            "fa fa-diamond",                   
            "fa fa-paper-plane-o",
            "fa fa-paper-plane-o",
            "fa fa-anchor",
            "fa fa-anchor",
            "fa fa-bolt",
            "fa fa-bolt",
            "fa fa-cube",
            "fa fa-cube",
            "fa fa-leaf",
            "fa fa-leaf",
            "fa fa-bicycle",
            "fa fa-bicycle",
            "fa fa-bomb",
            "fa fa-bomb",
]

// Array where open cards are stored
cardListOpen = [];

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
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

// deletes li elements from the ul element
function clearBoard() {
    document.querySelector('.deck').innerHTML = "";
} 

// shuffles the list of cards, loops through each card, creates the right HTML for it
function createBoard() {
    shuffle(cardList);
    cardList.forEach(function(i) {
           newCard = document.createElement('li');
           newIcon = document.createElement('i');
           deck = document.querySelector('.deck');
    
           newCard.setAttribute("class", "card");
           newIcon.setAttribute("class", i);
           deck.appendChild(newCard);
           deck.lastChild.appendChild(newIcon);
    })
    evtListener();        
}

function restart() {
    let reset = document.querySelector('.restart');

    reset.addEventListener('click', function(){
        clearBoard();
        createBoard();
    })
}

restart();

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

function moveCount() {
    
}

function flipCard(item) {
    item.setAttribute("class", "card open show");
}

function addOpenCard(item) {
    cardListOpen.push(item);
}

function lockMatch() {
    cardListOpen[0].setAttribute("class", "card match");
    cardListOpen[1].setAttribute("class", "card match");
}

function closeCards() {
    cardListOpen[0].setAttribute("class", "card");
    cardListOpen[1].setAttribute("class", "card");
}

function compareCards(array) {
    if (array[0] === array[1]) {
        lockMatch();
    }
    else {
        closeCards();
    }
    array.splice(0, 2);
} 


function evtListener() {
    let cards = document.querySelectorAll('.card');
    let openCards = document.querySelectorAll('.card open show');

    function cardMagic(target) {
        flipCard(target);
        addOpenCard(target);
        while (cardListOpen.length === 2) {
            compareCards(cardListOpen);
        }
    }

    cards.forEach(function(node) {
        node.addEventListener('click', cardMagic(node));
    })
    openCards.forEach(function(node) {
        node.removeEventListener('click', cardMagic(node));
    })
}