let words = [];
let currentWord = '';
let typedWord = '';
let wordCount = 25; // Set default to 25
let startTime;
let totalTypedWords = 0;

function startTyping() {
    startTime = new Date().getTime();
}

function endTyping() {
    const endTime = new Date().getTime();
    const timeTaken = (endTime - startTime) / 1000; // in Sekunden
    const wpm = (totalTypedWords / timeTaken) * 60; // Wörter pro Minute

    const wordDiv = document.getElementById('words');
    wordDiv.classList.add('blur'); // Fügt die Unschärfe-Klasse hinzu

    setTimeout(() => {
        wordDiv.innerHTML = `WPM: ${Math.round(wpm)}`; // Zeigt die WPM an
    }, 1000); // Wartezeit für die Unschärfe-Animation
}


async function loadWordsFromJSON() {
    try {
        const response = await fetch('/static/json/words.json');
        const data = await response.json();
        words = data.words;
        setWordCount(wordCount); // Set default word count
    } catch (error) {
        console.error("Error loading words:", error);
    }
}

function getRandomWords(count) {
    const selectedWords = [];
    for (let i = 0; i < count; i++) {
        selectedWords.push(words[Math.floor(Math.random() * words.length)]);
    }
    return selectedWords;
}


function displayWord() {
    const wordDiv = document.getElementById('words');
    wordDiv.innerHTML = '';

    for (const word of getRandomWords(wordCount)) {
        const wordSpan = document.createElement('div');
        wordSpan.className = 'word';

        for (const char of word) {
            const letterSpan = document.createElement('span');
            letterSpan.className = 'letter';
            letterSpan.textContent = char;
            wordSpan.appendChild(letterSpan);
        }

        wordDiv.appendChild(wordSpan);
    }

    // Mark the first word as active
    wordDiv.firstChild.className += ' active';
    currentWord = wordDiv.firstChild.textContent;
}

function updateWordDisplay() {
    const activeWordDiv = document.querySelector('.word.active');

    // Überprüfe, ob das aktive Wort-Element existiert
    if (!activeWordDiv) return;

    activeWordDiv.innerHTML = ''; // Clear the current content

    for (let i = 0; i < currentWord.length; i++) {
        const letterSpan = document.createElement('letter');
        letterSpan.className = 'letter';

        if (i < typedWord.length) {
            if (typedWord[i] === currentWord[i]) {
                letterSpan.className += ' correct';
            } else {
                letterSpan.className += ' incorrect';
            }
        }

        letterSpan.textContent = currentWord[i];
        activeWordDiv.appendChild(letterSpan);
    }

    // Add extra incorrect letters
    for (let i = currentWord.length; i < typedWord.length; i++) {
        const extraLetter = document.createElement('letter');
        extraLetter.className = 'letter incorrect extra';
        extraLetter.textContent = typedWord[i];
        activeWordDiv.appendChild(extraLetter);
    }
}



function checkTyped(e) {
    const typedChar = e.key;

    // Ignore modifier keys and other non-needed keys
    if (typedChar.length > 1 && typedChar !== 'Backspace' && typedChar !== ' ') return;

    const activeWordDiv = document.querySelector('.word.active');

    // Überprüfe, ob das aktive Wort-Element existiert
    if (!activeWordDiv) return;

    // If Backspace is pressed
    if (typedChar === 'Backspace') {
        if (typedWord.length > currentWord.length) {
            // Remove extra incorrect letters
            activeWordDiv.removeChild(activeWordDiv.lastChild);
        }
        if (typedWord.length > 0) {
            typedWord = typedWord.slice(0, -1);
        }
    } else if (typedChar === ' ') {
        // Check if the word is incomplete and mark the remaining letters as incorrect
        if (typedWord.length < currentWord.length) {
            typedWord += currentWord.slice(typedWord.length);
        }

        updateWordDisplay();

        // Move to the next word
        activeWordDiv.className = 'word';
        const nextWordDiv = activeWordDiv.nextSibling;
        if (nextWordDiv) {
            nextWordDiv.className += ' active';
            currentWord = nextWordDiv.textContent;
        }

        typedWord = '';
    } else {
        typedWord += typedChar;
    }

    // Live update the display
    updateWordDisplay();
}


function setWordCount(count) {
    wordCount = count;
    typedWord = '';
    displayWord();
}

function init() {
    document.addEventListener('keydown', checkTyped);
    document.getElementById('btn10').addEventListener('click', () => setWordCount(10));
    document.getElementById('btn25').addEventListener('click', () => setWordCount(25));
    document.getElementById('btn50').addEventListener('click', () => setWordCount(50));
    document.getElementById('btn100').addEventListener('click', () => setWordCount(100));
    document.addEventListener('keydown', (e) => {
        if (startTime === undefined && e.key.length === 1) {
            startTyping();
        }
    });
    loadWordsFromJSON();
}

document.addEventListener('DOMContentLoaded', init);

