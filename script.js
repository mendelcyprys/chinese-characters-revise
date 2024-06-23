let currentGame = {
    from: '',
    to: '',
    questions: [],
    currentIndex: 0,
    results: []
};

function startGame(from, to) {
    currentGame.from = from;
    currentGame.to = to;
    currentGame.questions = shuffle([...characterList]);
    currentGame.currentIndex = 0;
    currentGame.results = [];

    document.getElementById('menu').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    document.getElementById('results').style.display = 'none';

    showNextQuestion();
    addKeyListeners();
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function showNextQuestion() {
    if (currentGame.currentIndex >= currentGame.questions.length) {
        showResults();
        return;
    }

    const question = currentGame.questions[currentGame.currentIndex];
    document.getElementById('question').textContent = question[currentGame.from];

    const options = generateOptions(question);
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';

    const keyMap = [4, 5, 6, 1, 2, 3];
    options.forEach((option, index) => {
        const button = document.createElement('button');
        button.textContent = option;
        button.className = 'option';
        button.onclick = () => checkAnswer(option, question[currentGame.to]);
        button.setAttribute('data-key', keyMap[index]);
        optionsContainer.appendChild(button);
    });

    currentGame.results.push({ 
        question: question[currentGame.from], 
        answer: question[currentGame.to], 
        attempts: 0, 
        startTime: Date.now() 
    });
}

function generateOptions(correctAnswer) {
    const options = [correctAnswer[currentGame.to]];
    while (options.length < 6) {
        const randomOption = characterList[Math.floor(Math.random() * characterList.length)][currentGame.to];
        if (!options.includes(randomOption)) {
            options.push(randomOption);
        }
    }
    return shuffle(options);
}

function checkAnswer(selectedOption, correctAnswer) {
    const currentResult = currentGame.results[currentGame.currentIndex];
    currentResult.attempts++;

    if (selectedOption === correctAnswer) {
        currentResult.endTime = Date.now();
        currentResult.timeTaken = (currentResult.endTime - currentResult.startTime) / 1000;
        currentGame.currentIndex++;
        showNextQuestion();
    } else {
        event.target.classList.add('incorrect');
    }
}

function showResults() {
    document.getElementById('game').style.display = 'none';
    document.getElementById('results').style.display = 'block';

    const resultsList = document.getElementById('resultsList');
    resultsList.innerHTML = '';

    currentGame.results.forEach(result => {
        const li = document.createElement('li');
        li.textContent = `${result.question} (${result.answer}): ${result.attempts} attempt${result.attempts > 1 ? "s" : ""}, ${result.timeTaken.toFixed(2)} seconds`;
        if (result.attempts > 1) {
            li.classList.add('more-than-one');
        }
        resultsList.appendChild(li);
    });

    removeKeyListeners();
}

function showMenu() {
    document.getElementById('menu').style.display = 'block';
    document.getElementById('game').style.display = 'none';
    document.getElementById('results').style.display = 'none';

    removeKeyListeners();
}

function addKeyListeners() {
    document.addEventListener('keydown', handleKeyPress);
}

function removeKeyListeners() {
    document.removeEventListener('keydown', handleKeyPress);
}

function handleKeyPress(event) {
    const keyMap = {
        '1': 3, '2': 4, '3': 5,
        '4': 0, '5': 1, '6': 2,
        'Numpad1': 3, 'Numpad2': 4, 'Numpad3': 5,
        'Numpad4': 0, 'Numpad5': 1, 'Numpad6': 2
    };

    if (event.key in keyMap) {
        const options = document.querySelectorAll('.option');
        const index = keyMap[event.key];
        if (index < options.length) {
            options[index].click();
        }
    }
}

