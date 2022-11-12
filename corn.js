'use strict'

const game = {
    inputName: document.getElementById("name"),
    startButton: document.getElementById("startButton"),
    playerNameDisplay: document.getElementById("playerNameDisplay"),
    guessesEasy: 8,
    guessesMedium: 7,
    guessesHard: 6,
    guessesLeft: 8,
    difficultySelected: document.getElementById("difficultyDisplay"),
    code: null,
    secretCode: [],
    dropdownOptions: 6,
    playerguess: [],
    easyButton: document.getElementById("easy"),
    mediumButton: document.getElementById("medium"),
    hardButton: document.getElementById("hard"),
    playerguessnumarray: [],
    submitButton: document.getElementById("submitButton"),
    tryAgainButton: document.getElementById("tryAgain"),
    endGameButton: document.getElementById("endGame"),
    helpModal: document.getElementById("modal"),
    modalButton: document.getElementById("modal-button"),
    closeModal: document.getElementById("close"),

// reading the radio buttons to choose the difficulty level and corresponding number of guesses
    selectDifficulty: function () {
        if (game.easyButton.checked == true)  {
            game.guessesLeft = game.guessesEasy;       
        } else if (game.mediumButton.checked == true)  {
            game.guessesLeft = game.guessesMedium;
        } else if (game.hardButton.checked == true)  {
            game.guessesLeft = game.guessesHard;      
        }
        game.difficultySelected.innerText = game.guessesLeft;
    },

    // evaluating the player's guess to the secret code
    checkGuess: function () {      
        game.guessesLeft--;
        // if player runs out of guesses, move the game to the end screen and display the losing message
        game.difficultySelected.innerHTML = game.guessesLeft;
        if (game.guessesLeft == 0) {
        game.switchScreen('game-over')
        document.getElementById("finalmessage").innerHTML = "I'm sorry, none of those guesses were correct.  We'll keep trying to find those notes.  Would you like to try again?  We might just have enough time and you seem like you're picking things up quickly!";
        }
        // convert the players guess to an array of numbers
        game.playerguessnumarray = (game.playerguess).map(Number);
        const newGuessRow = document.createElement("tr");        
        const checking = [];
        // if player correctly guesses the code, move to the final screen
        if (JSON.stringify(game.secretCode) == JSON.stringify(game.playerguessnumarray)) {
        game.switchScreen('game-over');
        document.getElementById("finalmessage").innerHTML = "You did it - that's what I remember seeing!  Thank you so much for helping us!  We'll never tell Farmer Fox that we lost the notes!  Do you think you can help us plan for next year?"
        } else {
            // check the players guess, number by number through the array and give feedback on each one  
            for (let i=0; i < game.secretCode.length; i++) {       
            let num = game.playerguessnumarray[i];
            checking[i] = num;           
            if (num == game.secretCode[i] ) {
                newGuessRow.innerHTML += `<td>${game.playerguessnumarray[i]} - Correct!</td>`;
            } else if (game.secretCode.indexOf(num) >= 0) {
                newGuessRow.innerHTML += `<td>${game.playerguessnumarray[i]} - Wrong spot!</td>`;
            } else {
                newGuessRow.innerHTML += `<td>${game.playerguessnumarray[i]} - Nope.</td>`;
            }}};            
            document.getElementById("homerow").after(newGuessRow);
        },

        // get the player's guess from the dropdowns and add them number by number to the array
    getGuessGerm: function (germval, waterval, fertval, weedval) {
        // first line makes sure the array is empty before starting
        game.playerguess.length = 0;
        germval = document.getElementById("germination").value;
        game.playerguess.push(germval);

        waterval = document.getElementById("watering").value;
        game.playerguess.push(waterval);

        fertval = document.getElementById("fertilize").value;
        game.playerguess.push(fertval);

        weedval = document.getElementById("weeding").value;
        game.playerguess.push(weedval);
        
    },

    // the mechanism to change screens from opening to game to game-over
    switchScreen: function (currentScreen  = 'opening') {
        $(".screen").hide();
        $(`#${currentScreen}`).show();
        },

    // generate the secret code for the game, to be guessed by the palyer
    getCode: function () {      
        game.secretCode.length = 0;
        game.code = Math.floor(Math.random() * (game.dropdownOptions) + 1);
        game.secretCode.push(game.code);
        game.code = Math.floor(Math.random() * (game.dropdownOptions) + 1);
        game.secretCode.push(game.code);
        game.code = Math.floor(Math.random() * (game.dropdownOptions) + 1);
        game.secretCode.push(game.code);
        game.code = Math.floor(Math.random() * (game.dropdownOptions) + 1);
        game.secretCode.push(game.code);
        console.log(game.secretCode);
    },
    
    // start the game by getting the player's name and the difficulty level selected
    startGame: function (myName) {
        myName = game.inputName.value;
        game.playerNameDisplay.innerHTML = myName;
        game.selectDifficulty();
        },

    // clear the dropdowns at the end of the game in preparation for starting a new game
    resetDropdowns: function () {
        document.getElementById("germination").selectedIndex = 0;
        document.getElementById("watering").selectedIndex = 0;
        document.getElementById("fertilize").selectedIndex = 0;
        document.getElementById("weeding").selectedIndex = 0;
    },

    // delete the player's guesses from the table
    deleteRow: function () {
        document.getElementById('tbody').innerHTML = '';
        document.getElementById('tbody').innerHTML = `<tr id="homerow"></tr>`;
    },

    // run when the game starts 
    init: function (){
        game.switchScreen();
        game.getCode();
        // add event listener to the start button that'll switch the screens, move the player's name and apply their difficulty
        game.startButton.addEventListener("click", function() {
            game.startGame();
            game.switchScreen('game')});
        
        // add an event listener to the help button to display the modal
        game.modalButton.addEventListener("click", function() {
            game.helpModal.style.display = "block";
        });
        game.closeModal.addEventListener("click", function() {
            game.helpModal.style.display = "none";
        });

        // add an event listener to the submit button to get and evaluate the player's guess and reset the dropdowns
        game.submitButton.addEventListener("click", function() {
            game.getGuessGerm();
            game.checkGuess();
            game.resetDropdowns();
        });

        // add an event listener to the try again button to change the screen, generate a new secret code and reset the game board
        game.tryAgainButton.addEventListener("click", function () {
            game.switchScreen('game');
            game.getCode();
            game.resetDropdowns();
            game.selectDifficulty();
            game.deleteRow();
        });

        // add an event listener to the End Game button to change the game screen, get a new secret code and reset the game board, in case the player chooses to play again
        game.endGameButton.addEventListener("click", function () {
            game.switchScreen('opening');
            game.getCode();
            game.deleteRow();
            document.getElementById("name").value = "Farmer";
        });
    }
}
game.init();