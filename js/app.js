    /*
    * Create a list that holds all of your cards
    */
    const TIMEOUT = 1500;

    function debug(...args) {
        if (false) {
            console.log(...args);
        }
    };

    // Array of cards
    cardList = [ 
        "fa fa-diamond",
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

    // Array where matching cards are stored
    cardListMatch = [];

    /*
    * Display the cards on the page
    *   - shuffle the list of cards using the provided "shuffle" method below
    *   - loop through each card and create its HTML
    *   - add each card's HTML to the page
    */

    // Shuffle function from http://stackoverflow.com/a/2450976
    function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
        debug("shuffle", array);

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
        debug("clearBoard");
        document.querySelector('.deck').innerHTML = "";
    }

    function resetMoves() {
        debug("resetMoves");
        count = document.querySelector('.moves');

        count.innerHTML = "0";
    }

    function clearStars() {
        debug("clearStars");
        document.querySelector('.stars').innerHTML = "";
    }

    function createStars() {
        debug("createStars");

        for (let j = 0; j < 3; j++) {
            newLi = document.createElement('li');
            newIcon = document.createElement('i');
            stars = document.querySelector('.stars');

            newIcon.setAttribute("class", "fa fa-star");
            stars.appendChild(newLi);
            stars.lastChild.appendChild(newIcon);            
        }
    }


    // shuffles the list of cards, loops through each card, creates the right HTML for it
    function createBoard() {
        debug("createBoard");
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
        debug("restart");
        let reset = document.querySelector('.restart');

        reset.addEventListener('click', function(){
            clearBoard();
            resetMoves();
            clearStars();
            createStars();
            createBoard();
        })
    }

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
        debug("moveCount");
        let count = parseInt(document.querySelector('.moves').innerHTML, 10);
        let x = count + 1;
        
        document.querySelector('.moves').innerHTML = x;
    }

    function createTimer() {
        debug("createTimer");
        clock = document.createElement('div');
        clock.setAttribute("class", "timer");
        clock.innerHTML = "0";
    }

    function flipCard(item) {
        debug("flipCard", item);
        item.setAttribute("class", "card open show");
    }

    function addOpenCard(item) {
        debug("addOpenCard", item);
        cardListOpen.push(item);0
    }

    function lockMatch() {
        debug("lockMatch");
        cardListOpen[0].setAttribute("class", "card match");
        cardListOpen[1].setAttribute("class", "card match");

        cardListOpen.forEach(function(i) {
            cardListMatch.push(i);
        })
        cardListOpen.splice(0, 50);
        checkWinCondition();
    }

    function cardError() {
        debug("cardError");
        cardListOpen.forEach(function(i) {
            i.setAttribute("class", "card mismatch");
        });
        cardListOpen.forEach(function(i) {
            i.removeEventListener('click', cardMagic);
        });
    }

    function closeCards() {
        debug("closeCards");

        cardListOpen.forEach(function(i) {
            i.setAttribute("class", "card");
        })
    }

    function cards() {
        debug("cards");
        return Array.from(document.querySelectorAll('.card'));
     }

    function listenAgain() {
        debug("listenAgain");
        cards().filter(function(card) {
           return card.className !== "card mismatch";
        }).forEach(function(item) {
            item.addEventListener('click', cardMagic);
        })
    }

    function removeListeners() {
        debug("removeListeners");
        cards().forEach(function(card) {
            card.removeEventListener('click', cardMagic)
        })
    }

    function compareCards() {
        debug("compareCards");

        if (cardListOpen.length < 2) return;

        removeListeners();

        if (cardListOpen[0].firstChild.className === cardListOpen[1].firstChild.className) {
            lockMatch();
        }
        else {
            cardError();
        }
        setTimeout(function() {
            closeCards();
            listenAgain();
            cardListOpen.splice(0, 2);
        }, TIMEOUT)
    }

    function checkWinCondition() {
        debug("checkWinCondition");
        if (cardListMatch.length === 16) {
            console.log(`Yay! You did it in ${document.querySelector('.moves').innerHTML} Moves!`);
        }
    }

    function cardMagic(a) {
        debug("cardMagic", a);
        console.log(this, a);
        if (cardListOpen.length < 2) {
            moveCount(a);
            a.target.removeEventListener('click', cardMagic);
            flipCard(this);
            addOpenCard(this);
            if (cardListOpen.length === 2) {
                compareCards();
            }
        }  
    }

    function evtListener() {
        debug("evtListener");
        cards().forEach(function(node) {
            node.addEventListener('click', cardMagic);
        })
    }

    restart();