const characters = [
    'lua', 'sol', 'estrela', 'nave', 'gato',
];

let timer;
let currentTime;
let gameEnded = false;
let firstCard = '';
let secondCard = '';
const startTime = Date.now(); // Mover para o escopo correto

const createElement = (tag, className) => {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

const checkEndGame = () => {
    const disableCards = document.querySelectorAll('.disable-card');

    if (disableCards.length === characters.length * 2) {
        clearInterval(timer);
        gameEnded = true;
        
        const confetti = document.createElement('div');
        confetti.id = 'confetti';
        document.body.appendChild(confetti);

        setTimeout(() => {
            const endTime = Date.now();
            const timeSpent = Math.floor((endTime - startTime) / 1000); 
            localStorage.setItem('score', timeSpent);
            window.location.href = '../results.html';
        }, 2000);
    }
}

const checkCards = () => {
    const firstCharacter = firstCard.getAttribute('data-character');
    const secondCharacter = secondCard.getAttribute('data-character');

    if (firstCharacter === secondCharacter) {
        firstCard.firstChild.classList.add('disable-card');
        secondCard.firstChild.classList.add('disable-card');

        firstCard = '';
        secondCard = '';

        checkEndGame();
    } else {
        setTimeout(() => {
            firstCard.classList.remove('reveal-card');
            secondCard.classList.remove('reveal-card');

            firstCard = '';
            secondCard = '';
        }, 500);
    }
}

const revealCard = ({ target }) => {
    if (target.parentNode.className.includes('reveal-card')) {
        return;
    }

    if (firstCard === '') {
        target.parentNode.classList.add('reveal-card');
        firstCard = target.parentNode;
    } else if (secondCard === '') {
        target.parentNode.classList.add('reveal-card');
        secondCard = target.parentNode;

        checkCards();
    }
}

const createCard = (character) => {
    const card = createElement('div', 'card');
    const front = createElement('div', 'face front');
    const back = createElement('div', 'face back');

    front.style.backgroundImage = `url('../images/${character}.png')`;

    card.appendChild(front);
    card.appendChild(back);

    card.addEventListener('click', revealCard);
    card.setAttribute('data-character', character);

    return card;
}

const loadGame = () => {
    const grid = document.getElementById('grid');
    const duplicateCharacters = [...characters, ...characters];
    const shuffledArray = duplicateCharacters.sort(() => Math.random() - 0.5);

    shuffledArray.forEach((character) => {
        const card = createCard(character);
        grid.appendChild(card);
    });
}

const startTimer = () => {
    timer = setInterval(() => {
        const timerElement = document.querySelector('.timer');
        currentTime = parseInt(timerElement.innerHTML, 10) || 0;
        timerElement.innerHTML = currentTime + 1;
        if (gameEnded) {
            clearInterval(timer);
        }
    }, 1000);
}

window.onload = () => {
    const spanPlayer = document.querySelector('.player');
    spanPlayer.innerHTML = localStorage.getItem('player');
}

document.addEventListener('DOMContentLoaded', () => {
    loadGame();
    startTimer();
});
document.addEventListener('DOMContentLoaded', () => {
    const desistirBtn = document.getElementById('desistir-btn');
    desistirBtn.addEventListener('click', () => {
        const grid = document.getElementById('grid');
        grid.innerHTML = ''; 

        
        for (let i = 0; i < 10; i++) {
            const sadFace = document.createElement('div');
            sadFace.classList.add('sad-face');
            sadFace.innerHTML = '😢';
            grid.appendChild(sadFace);
        }

        
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 2000);
    });
});
