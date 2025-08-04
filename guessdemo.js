let gameType;
let randomNumber;
let randomLetter;
let lim1;
let lim2;
let attempts = 0;
let guessHistory = [];
let currentAlphaCategory = "all";
let currentNumCategory = "all";

showStartScreen();

function showStartScreen() {
    const gameDiv = document.getElementById('game');
    gameDiv.innerHTML = `
        <div id="startDiv">
            <img src="guessing.jpg" class="icon" alt="Game Icon" style="margin-bottom:20px;">
            <h2 style="color:#4a90e2; margin-bottom:10px;">Welcome!</h2>
            <p style="font-size:1.1em; color:#555; margin-bottom:30px;">
                Test your luck and logic.<br>
                Can you guess the secret number or letter?
            </p>
            <button id="startBtn" style="font-size:1.3em; width:220px; margin-bottom:10px;">🎲 Start Game</button>
        </div>
    `;
    document.getElementById('startBtn').addEventListener('click', startGame);
}

function startGame() {
    const gameDiv = document.getElementById('game');
    gameDiv.innerHTML = `
        <div id="gameTypeDiv">
            <p>Choose Game Type:</p>
            <button id="numberBtn">Number</button>
            <button id="alphabetBtn">Alphabet</button>
        </div>
    `;
    document.getElementById('numberBtn').addEventListener('click', () => askLimitPreference('N'));
    document.getElementById('alphabetBtn').addEventListener('click', () => askLimitPreference('A'));
}

function askLimitPreference(type) {
    gameType = type;
    const gameDiv = document.getElementById('game');
    gameDiv.innerHTML = `
        <p>Do you want to set limits?</p>
        <button id="yesLimit">Yes</button>
        <button id="noLimit">No</button>
        <button id="quitBtn">Quit</button>
    `;
    document.getElementById('yesLimit').addEventListener('click', () => {
        if (gameType === 'N') showNumberLimitInput();
        else showAlphabetLimitInput();
    });
    document.getElementById('noLimit').addEventListener('click', () => {
        if (gameType === 'N') {
            lim1 = 1;
            lim2 = 50;
            showNumberCategorySelection();
        } else {
            lim1 = 'A';
            lim2 = 'Z';
            showAlphabetCategorySelection();
        }
    });
    document.getElementById('quitBtn').addEventListener('click', showStartScreen);
}

function showNumberLimitInput() {
    const gameDiv = document.getElementById('game');
    gameDiv.innerHTML = `
        <p>Enter number limits:</p>
        <input type="number" id="numLim1" placeholder="Start (e.g., 1)">
        <input type="number" id="numLim2" placeholder="End (e.g., 50)">
        <button onclick="submitNumberLimit()">Submit</button>
        <button id="quitBtn">Quit</button>
    `;
    document.getElementById('quitBtn').addEventListener('click', showStartScreen);
}

function submitNumberLimit() {
    lim1 = parseInt(document.getElementById('numLim1').value);
    lim2 = parseInt(document.getElementById('numLim2').value);
    if (isNaN(lim1) || isNaN(lim2) || lim1 >= lim2) {
        alert("Please enter valid number limits.");
        return;
    }
    showNumberCategorySelection();
}

function showAlphabetLimitInput() {
    const gameDiv = document.getElementById('game');
    gameDiv.innerHTML = `
        <p>Enter alphabet limits (A-Z):</p>
        <input type="text" id="alphaLim1" placeholder="Start (e.g., A)" maxlength="1">
        <input type="text" id="alphaLim2" placeholder="End (e.g., Z)" maxlength="1">
        <button onclick="submitAlphabetLimit()">Submit</button>
        <button id="quitBtn">Quit</button>
    `;
    document.getElementById('quitBtn').addEventListener('click', showStartScreen);
}

function submitAlphabetLimit() {
    lim1 = document.getElementById('alphaLim1').value.toUpperCase();
    lim2 = document.getElementById('alphaLim2').value.toUpperCase();
    if (lim1.length !== 1 || lim2.length !== 1 || lim1 > lim2 || !/^[A-Z]$/.test(lim1) || !/^[A-Z]$/.test(lim2)) {
        alert("Please enter valid alphabet limits (A-Z).");
        return;
    }
    showAlphabetCategorySelection();
}

function showNumberCategorySelection() {
    const gameDiv = document.getElementById('game');
    gameDiv.innerHTML = `
        <p>Select a Number Category:</p>
        <button data-cat="all">All</button>
        <button data-cat="even">Even</button>
        <button data-cat="odd">Odd</button>
        <button data-cat="prime">Prime</button>
        <button id="quitBtn">Quit</button>
    `;
    document.getElementById('quitBtn').addEventListener('click', showStartScreen);

    document.querySelectorAll('button[data-cat]').forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-cat');
            const range = [];
            for (let i = lim1; i <= lim2; i++) {
                if (category === 'even' && i % 2 === 0) range.push(i);
                else if (category === 'odd' && i % 2 !== 0) range.push(i);
                else if (category === 'prime' && isPrime(i)) range.push(i);
                else if (category === 'all') range.push(i);
            }

            if (range.length === 0) {
                gameDiv.innerHTML += '<p>No numbers match the criteria. Try again.</p>';
                return;
            }

            randomNumber = range[Math.floor(Math.random() * range.length)];
            numberGuessingGame(category); // Pass the category
        });
    });
}

function numberGuessingGame(category) {
    currentNumCategory = category; // Track the current number category
    const gameDiv = document.getElementById('game');
    attempts = 0;
    guessHistory = [];
    let categoryText = "a number";
    if (category === "even") categoryText = "an even number";
    else if (category === "odd") categoryText = "an odd number";
    else if (category === "prime") categoryText = "a prime number";

    gameDiv.innerHTML = `
        <p>Guess ${categoryText} between ${lim1} and ${lim2}</p>
        <form id="guessForm" autocomplete="off">
            <input type="number" id="userInput" autofocus>
            <button type="submit">Submit</button>
            <button type="button" id="quitBtn">Quit</button>
        </form>
        <p id="feedback"></p>
        <p id="history"></p>
    `;

    document.getElementById('guessForm').addEventListener('submit', function(e) {
        e.preventDefault();
        checkNumber();
    });
    document.getElementById('quitBtn').addEventListener('click', showStartScreen);
}

function checkNumber() {
    const userInputElem = document.getElementById('userInput');
    const userInput = parseInt(userInputElem.value);
    const feedback = document.getElementById('feedback');
    const history = document.getElementById('history');

    let allowed = [];
    for (let i = lim1; i <= lim2; i++) {
        if (currentNumCategory === "even" && i % 2 === 0) allowed.push(i);
        else if (currentNumCategory === "odd" && i % 2 !== 0) allowed.push(i);
        else if (currentNumCategory === "prime" && isPrime(i)) allowed.push(i);
        else if (currentNumCategory === "all") allowed.push(i);
    }

    if (isNaN(userInput) || !allowed.includes(userInput)) {
        feedback.innerHTML = "Please enter a valid " +
            (currentNumCategory === "even" ? "even number" :
             currentNumCategory === "odd" ? "odd number" :
             currentNumCategory === "prime" ? "prime number" : "number") +
            " in range.";
        playIncorrect();
        userInputElem.value = "";
        return;
    }

    attempts++;
    guessHistory.push(userInput);

    if (userInput === randomNumber) {
        feedback.innerHTML = `🎉 Correct! You guessed it in ${attempts} attempts.<br>
        <button onclick="startGame()">Play Again</button>`;
        playCorrect();
    } else {
        feedback.innerHTML = userInput > randomNumber ? "Too high!" : "Too low!";
        playIncorrect();
    }

    history.innerHTML = `Previous guesses: ${guessHistory.join(", ")}`;
    userInputElem.value = "";
}

function showAlphabetCategorySelection() {
    const gameDiv = document.getElementById('game');
    gameDiv.innerHTML = `
        <p>Select an Alphabet Category:</p>
        <button data-cat="all">All</button>
        <button data-cat="vowel">Vowel</button>
        <button data-cat="consonant">Consonant</button>
        <button id="quitBtn">Quit</button>
    `;
    document.getElementById('quitBtn').addEventListener('click', showStartScreen);

    document.querySelectorAll('button[data-cat]').forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-cat');
            const vowels = ['A', 'E', 'I', 'O', 'U'];
            const range = [];

            for (let i = lim1.charCodeAt(0); i <= lim2.charCodeAt(0); i++) {
                const ch = String.fromCharCode(i);
                if (category === 'vowel' && vowels.includes(ch)) range.push(ch);
                else if (category === 'consonant' && !vowels.includes(ch)) range.push(ch);
                else if (category === 'all') range.push(ch);
            }

            if (range.length === 0) {
                gameDiv.innerHTML += '<p>No letters match the criteria. Try again.</p>';
                return;
            }

            randomLetter = range[Math.floor(Math.random() * range.length)];
            setupAlphabetGuessingGame(category); // Pass the category
        });
    });
}

function setupAlphabetGuessingGame(category) {
    currentAlphaCategory = category; // Track the current alphabet category
    const gameDiv = document.getElementById('game');
    attempts = 0;
    guessHistory = [];
    let categoryText = "a letter";
    if (category === "vowel") categoryText = "a vowel";
    else if (category === "consonant") categoryText = "a consonant";

    gameDiv.innerHTML = `
        <p>Guess ${categoryText} between ${lim1} and ${lim2}</p>
        <form id="guessForm" autocomplete="off">
            <input type="text" id="userInput" maxlength="1" autofocus>
            <button type="submit">Submit</button>
            <button type="button" id="quitBtn">Quit</button>
        </form>
        <p id="feedback"></p>
        <p id="history"></p>
    `;

    document.getElementById('guessForm').addEventListener('submit', function(e) {
        e.preventDefault();
        checkAlphabet();
    });
    document.getElementById('quitBtn').addEventListener('click', showStartScreen);
}

function checkAlphabet() {
    const userInputElem = document.getElementById('userInput');
    const userInput = userInputElem.value.toUpperCase();
    const feedback = document.getElementById('feedback');
    const history = document.getElementById('history');
    const vowels = ['A', 'E', 'I', 'O', 'U'];

    // Build allowed set based on category
    let allowed = [];
    for (let i = lim1.charCodeAt(0); i <= lim2.charCodeAt(0); i++) {
        const ch = String.fromCharCode(i);
        if (currentAlphaCategory === "vowel" && vowels.includes(ch)) allowed.push(ch);
        else if (currentAlphaCategory === "consonant" && !vowels.includes(ch)) allowed.push(ch);
        else if (currentAlphaCategory === "all") allowed.push(ch);
    }

    if (!/^[A-Z]$/.test(userInput) || !allowed.includes(userInput)) {
        feedback.innerHTML = "Please enter a valid " + 
            (currentAlphaCategory === "vowel" ? "vowel" : currentAlphaCategory === "consonant" ? "consonant" : "letter") +
            " in range.";
        playIncorrect();
        userInputElem.value = "";
        return;
    }

    attempts++;
    guessHistory.push(userInput);

    if (userInput === randomLetter) {
        feedback.innerHTML = `🎉 Correct! You guessed it in ${attempts} attempts.<br>
        <button onclick="startGame()">Play Again</button>`;
        playCorrect();
    } else {
        feedback.innerHTML = userInput > randomLetter ? "Alphabet is lower!" : "Alphabet is higher!";
        playIncorrect();
    }

    history.innerHTML = `Previous guesses: ${guessHistory.join(", ")}`;
    userInputElem.value = "";
}

function isPrime(n) {
    if (n < 2) return false;
    for (let i = 2; i <= Math.sqrt(n); i++) {
        if (n % i === 0) return false;
    }
    return true;
}

function playCorrect() {
    let audio = document.getElementById('correctSound');
    audio.currentTime = 0;
    audio.play();
}

function playIncorrect() {
    let audio = document.getElementById('incorrectSound');
    audio.currentTime = 0;
    audio.play();
}