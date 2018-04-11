# Ingo's Memory Game Project

## Table of Contents

* [Instructions](#instructions)
* [Functionality](#functionality)
* [Known Issues](#known issues)

## Instructions

It's memory! Flip two cards at a time to see if they match!

You'll get a star-rating based on your performance, every click is considered a move.

## Functionality

This game is a project for the Udacity Frontend Nano Degree scholarship and uses the pre-styled page provided for it.

I've provided commentary for every function directly in app.js and refactored my code to resemble the order in which things are executed.

Basically it generates a board from a hard-coded array (cardList) and adds an event listener to each card which does a number of things based on the number of cards flipped, while using only DOM manipulation:

When the first card is flipped, add this card to an initially empty array (cardListOpen). 

When the second card is flipped, compare the two cards.

Now, there are two possibilities:

* When the two cards DO match, they are pushed into a third array (cardListMatch), which is needed for checking the win condition
* When they DO NOT match, set them to "card mismatch" to play the error animation and change background color, then return them to the "upside down" state again

After every card comparison the (cardListOpen) array is emptied again, so it can never hold more than two items, whereas the (cardListMatch) array stores all matches until its .length equals 16 (which means if all cards are solved -> WIN)

## Known Issues

* When you restart the game, the incTime functions seem to add up, so, the more you restart, the faster the clock is ticking
* Upon winning the game, the game timer currently doesn't stop
* Winning the game currently does not provide you with a win screen, but an alert message (so there is no play again button, yet)
