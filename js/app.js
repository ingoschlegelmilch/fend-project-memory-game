    /*
    * Section 1: All the things that help create the score panel and the game board
    */


    // Fixed interval for timeOut functions
    const TIMEOUT = 1500;

    // Debugging function to see what is computed in which order
    function debug(...args) {
        if (false) {
            console.log(...args);
        }
    };

    // Array of cards used to build the board
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

    // Delete li elements from the ul element
    function clearBoard() {
        debug("clearBoard");
        document.querySelector('.deck').innerHTML = "";
    }

    // Reset move counter to 0
    function resetMoves() {
        debug("resetMoves");
        count = document.querySelector('.moves');

        count.innerHTML = "0";
    }

    // Reset star rating
    function clearStars() {
        debug("clearStars");
        document.querySelector('.stars').innerHTML = "";
    }

    // Create full star list
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

    // increment timer and update state
    function incTime() {
        debug("incTime");
        let secs = parseInt(document.querySelector('.timer').innerHTML, 10);
        let x = secs +1;

        document.querySelector('.timer').innerHTML = `${x} Seconds`;
    }

    // Start timer
    function startTime() {
        debug("startTime")
        setInterval(incTime, 1000);
    }

    // Stop timer
    function stopTime() {
        debug("stopTime");
        clearInterval(incTime);
    }

    // Stop running timer and removes it from the DOM
    function clearTimer() {
        debug("clearTimer");
        let timer = document.querySelector('.timer');

        stopTime();
        timer.remove();
    }

    // Create timer for the DOM and starts it
    function createTimer() {
        debug("createTimer");
        clock = document.createElement('span');
        clock.setAttribute("class", "timer");
        clock.innerHTML = "0 Seconds";

        document.querySelector('.score-panel').appendChild(clock);
        startTime();
    }

    // Shuffle the list of cards, loop through each card, create HTML for it and add event listeners to all cards
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

    // Reset card grid, move counter, star rating and timer
    function restart() {
        debug("restart");
        let reset = document.querySelector('.restart');

        reset.addEventListener('click', function(){
            clearBoard();
            resetMoves();
            clearStars();
            createStars();
            clearTimer();
            createTimer();
            createBoard();
        })
    }


    /*
    * Section 2: Functions that are part of the event listener
    */


    // Add event listeners to all cards
    function evtListener() {
        debug("evtListener");
        cards().forEach(function(node) {
            node.addEventListener('click', cardMagic);
        })
    }

    /*
    * On click increment move count and remove event listener for click target,
    * open card, add it to array of open card, when array has two items compare them
    */
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

    // increment move counter in score panel and according to number of moves update star rating
    function moveCount() {
        debug("moveCount");
        let count = parseInt(document.querySelector('.moves').innerHTML, 10);
        let x = count + 1;
    
        document.querySelector('.moves').innerHTML = x;
        if (x > 29 && x < 40) {
            document.querySelector('.stars').childNodes[2].lastChild.setAttribute("class", "fa fa-star-o");
        }
        if (x >= 40 && x < 49) {
            document.querySelector('.stars').childNodes[1].lastChild.setAttribute("class", "fa fa-star-o");
        }
    }

    // Open card to reveal its symbol
    function flipCard(item) {
        debug("flipCard", item);
        item.setAttribute("class", "card open show");
    }

    // Add clicked target to an (empty) array which stores opened cards
    function addOpenCard(item) {
        debug("addOpenCard", item);
        cardListOpen.push(item);0
    }

    /*
    * Abort when there is only one item, otherwise remove event listeners while comparing:
    * when items match, lock them, otherwise set mismatch and after delay return items to closed state,
    * re-add event listeners to them and empty open card array
    */  
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
            cardListOpen.splice(0, 50);
        }, TIMEOUT)
    }

    // removes event listeners for card comparison
    function removeListeners() {
        debug("removeListeners");
        cards().forEach(function(card) {
            card.removeEventListener('click', cardMagic)
        })
    }

    // When open cards match, push items of open card array into matching card array, empty open card array and check win condition
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

    // When matching card array has 16 items, stop timer, create and show modal, empty array of matching cards
    function checkWinCondition() {
        debug("checkWinCondition");
        if (cardListMatch.length === 16) {
            stopTime();
            createModal();
            showModal();
            cardListMatch.splice(0, 50);
        }
    }

    // Create all elements for modal, set respective classes, content; apply everything to DOM; add event listener to button to restart the game
    function createModal() {
        let background = document.createElement('div');
        let content = document.createElement('div');
        let span = document.createElement('span');
        let icon = document.createElement('i');
        let text1 = document.createElement('p');
        let text2 = document.createElement('p');
        let text3 = document.createElement('p');
        let button = document.createElement('button');
        let container = document.querySelector('.container');

        background.setAttribute("class", "modal");
        content.setAttribute("class", "modal-content");
        span.setAttribute("class", "close");
        text1.setAttribute("class", "message");
        text2.setAttribute("class", "message");
        text3.setAttribute("class", "message");
        button.setAttribute("type", "button");
        button.setAttribute("class", "mybtn");
        icon.setAttribute("class", "fa fa-times");
        text1.innerHTML = `Congratulations!`;
        text2.innerHTML = `You did it in ${document.querySelector('.moves').innerHTML} Moves and it took you ${document.querySelector('.timer').innerHTML}!`;
        text3.innerHTML = `Your star rating was:`
        button.innerHTML = 'Play again';

        container.appendChild(background);
        background.appendChild(content);
        content.appendChild(span);
        span.appendChild(icon);
        content.appendChild(text1);
        content.appendChild(text2);
        content.appendChild(text3);
        content.appendChild(button);
        copyStars();
        
        button.addEventListener('click', function() {
            removeModal();
            clearBoard();
            resetMoves();
            clearStars();
            createStars();
            clearTimer();
            createTimer();
            createBoard();    
        })
        span.firstChild.addEventListener('click', function() {
            removeModal();
        })
    }

    // Get star rating and create matching icons inside modal content
    function copyStars() {
        let starList = document.querySelector('.stars').childNodes;

        starList.forEach(function(i) {
            let content = document.querySelectorAll('.message')[2];
            let newSpan = document.createElement('span');
            let newIcon = document.createElement('i');
    
            newIcon.setAttribute("class", i.lastChild.className);
            content.appendChild(newSpan);
            content.lastChild.appendChild(newIcon);            
        })
    }

    // Show modal
    function showModal() {
        let modal = document.querySelector('.modal');

        modal.style.display = "block";
    }

    // Remove the modal element
    function removeModal() {
        let modal = document.querySelector('.modal');

        modal.remove();
    }

    // When items in open card array dont match, set mismatch class for items, remove event listeners for items
    function cardError() {
        debug("cardError");
        cardListOpen.forEach(function(i) {
            i.setAttribute("class", "card mismatch");
        });
        cardListOpen.forEach(function(i) {
            i.removeEventListener('click', cardMagic);
        });
    }

    // Set card class for items in open card array to turn them "upside down" again
    function closeCards() {
        debug("closeCards");

        cardListOpen.forEach(function(i) {
            i.setAttribute("class", "card");
        })
    }

    // Add event listener back to mismatched cards
    function listenAgain() {
        debug("listenAgain");
        cards().filter(function(card) {
           return card.className !== "card mismatch";
        }).forEach(function(item) {
            item.addEventListener('click', cardMagic);
        })
    }

    function cards() {
        return Array.from(document.querySelectorAll('.card'));
     }

    //activates restart button, initializes scorepanel and board on page start-up
    restart();
    clearBoard();
    resetMoves();
    clearStars();
    createStars();
    clearTimer();
    createTimer();
    createBoard();