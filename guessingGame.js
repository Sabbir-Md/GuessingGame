document.addEventListener('DOMContentLoaded', function() {
    const gameDiv = document.getElementById('game');
    let incorrectGuesses = 0;
    let lim1, lim2;
    let randomNumber, randomLetter;

    
    const correctSound = document.getElementById('correctSound');
    const incorrectSound = document.getElementById('incorrectSound');
    const winSound = document.getElementById('winSound');

    startGame(); 

    function startGame() {
        gameDiv.innerHTML = `
            <div id="gameTypeDiv">
                <img src="guessing.jpg" class="icon" alt="Game Icon">
                <label for="gameType">Choose Game Type (A for Alphabet, N for Number):</label>
                <input type="text" id="gameType">
                <button id="submitGameType">Submit</button>
            </div>
        `;

        document.getElementById('submitGameType').addEventListener('click', handleGameType);
    }

    function handleGameType() {
        const gameType = document.getElementById('gameType').value.toUpperCase();

        if (gameType === 'N') {
            gameDiv.innerHTML = ''; 
            showNumberLimitInput();
        } else if (gameType === 'A') {
            gameDiv.innerHTML = ''; 
            showAlphabetLimitInput();
        } else {
            gameDiv.innerHTML += '<p>Invalid input. Please enter A or N.</p>';
        }
    }

    function showNumberLimitInput() {
        gameDiv.innerHTML = `
            <div>
                <p>Enter number limit from:</p>
                <input type="number" id="lim1">
            </div>
            <div>
                <p>Enter number limit to:</p>
                <input type="number" id="lim2">
                <button id="submitLimits">Submit Limits</button>
            </div>
            <div id="limitFeedback"></div>
        `;

        document.getElementById('submitLimits').addEventListener('click', handleNumberLimits);
    }

    function handleNumberLimits() {
        lim1 = parseInt(document.getElementById('lim1').value);
        lim2 = parseInt(document.getElementById('lim2').value);

        if (isNaN(lim1) || isNaN(lim2) || lim1 >= lim2) {
            document.getElementById('limitFeedback').innerHTML = '<p>Invalid limits. Please enter valid numbers with lim1 less than lim2.</p>';
            return;
        }

        randomNumber = Math.floor(Math.random() * (lim2 - lim1 + 1)) + lim1;
        gameDiv.innerHTML = ''; 
        numberGuessingGame();
    }

    function numberGuessingGame() {
        gameDiv.innerHTML = `
            <div>
                <img src="guessing.jpg" class="icon" alt="Guess Icon">
                <p id="inputGuessMessage">Enter your guess (${lim1}-${lim2}):</p>
                <input type="number" id="numGuess">
                <button id="submitNumGuess">Submit Guess</button>
                <div id="numberFeedback"></div>
            </div>
        `;

        document.getElementById('submitNumGuess').addEventListener('click', function() {
            const num = parseInt(document.getElementById('numGuess').value);
            submitNumberGuess(num);
            document.getElementById('numGuess').value = ''; 
        });
    }

    function submitNumberGuess(num) {
        const feedbackDiv = document.getElementById('numberFeedback');

        if (num < lim1 || num > lim2 || isNaN(num)) {
            feedbackDiv.innerHTML = '<p>Invalid input. Please enter a number within your entered limit.</p>';
            incorrectSound.play();
            return;
        }

        incorrectGuesses++;

        if (num === randomNumber) {
            feedbackDiv.innerHTML = `<p>You tried ${incorrectGuesses} times and finally won. Lots of hard work. Well done!</p>`;
            winSound.play();
            disableInputFields();
        } else if (num < randomNumber) {
            feedbackDiv.innerHTML = '<p>Incorrect guess. The number is higher. Try again.</p>';
            incorrectSound.play();
        } else {
            feedbackDiv.innerHTML = '<p>Incorrect guess. The number is lower. Try again.</p>';
            incorrectSound.play();
        }
    }

    function showAlphabetLimitInput() {
        gameDiv.innerHTML = `
            <div>
                <p>Enter alphabet limit from (A-Z):</p>
                <input type="text" id="lim1" maxlength="1">
            </div>
            <div>
                <p>Enter alphabet limit to (A-Z):</p>
                <input type="text" id="lim2" maxlength="1">
                <button id="submitLimits">Submit Limits</button>
            </div>
            <div id="limitFeedback"></div>
        `;

        document.getElementById('submitLimits').addEventListener('click', handleAlphabetLimits);
    }

    function handleAlphabetLimits() {
        lim1 = document.getElementById('lim1').value.toUpperCase();
        lim2 = document.getElementById('lim2').value.toUpperCase();

        if (!lim1.match(/[A-Z]/) || !lim2.match(/[A-Z]/) || lim1 > lim2) {
            document.getElementById('limitFeedback').innerHTML = '<p>Invalid limits. Please enter valid letters with lim1 less than lim2.</p>';
            return;
        }

        randomLetter = String.fromCharCode(
            lim1.charCodeAt(0) + Math.floor(Math.random() * (lim2.charCodeAt(0) - lim1.charCodeAt(0) + 1))
        );
        gameDiv.innerHTML = ''; 
        setupAlphabetGuessingGame();
    }

    function setupAlphabetGuessingGame() {
        gameDiv.innerHTML = `
            <div id="alphabetGuessSection">
                <img src="guessing.jpg" class="icon" alt="Alphabet Icon">
                <p id="inputGuessMessage">Enter your guess (${lim1}-${lim2}):</p>
                <input type="text" id="letterGuess" maxlength="1">
                <button id="submitLetterGuess">Submit Guess</button>
                <div id="alphabetFeedback"></div>
            </div>
        `;

        document.getElementById('submitLetterGuess').addEventListener('click', function() {
            const guess = document.getElementById('letterGuess').value.toUpperCase();
            alphabetGuessingGame(guess);
            document.getElementById('letterGuess').value = ''; 
        });
    }

    function alphabetGuessingGame(guess) {
        const feedbackDiv = document.getElementById('alphabetFeedback');

        if (guess < lim1 || guess > lim2 || guess.length === 0) {
            feedbackDiv.innerHTML = '<p>Invalid input. Please enter a letter within your entered limit.</p>';
            incorrectSound.play();
            return;
        }

        incorrectGuesses++;

        if (guess === randomLetter) {
            feedbackDiv.innerHTML = `<p>You tried ${incorrectGuesses} times and finally won. Lots of hard work. Well done!</p>`;
            winSound.play();
            disableInputFields();
        } else if (guess < randomLetter) {
            feedbackDiv.innerHTML = '<p>Incorrect guess. The letter is after. Try again.</p>';
            incorrectSound.play();
        } else {
            feedbackDiv.innerHTML = '<p>Incorrect guess. The letter is before. Try again.</p>';
            incorrectSound.play();
        }
    }

    function disableInputFields() {
        const inputs = document.querySelectorAll('input');
        const buttons = document.querySelectorAll('button');
        const guessMessage = document.getElementById('inputGuessMessage'); 
    
        inputs.forEach(input => {
            input.disabled = true;  
            input.style.display = 'none';  
        });
    
        buttons.forEach(button => {
            button.disabled = true;  
            button.style.display = 'none';  
        });
    
        if (guessMessage) {
            guessMessage.style.display = 'none';  
        }

        gameDiv.innerHTML += `<button id="restartButton">Restart Game</button>`;
        document.getElementById('restartButton').addEventListener('click', restartGame);
    }

    function restartGame() {
        incorrectGuesses = 0;
        startGame();
    }
});
