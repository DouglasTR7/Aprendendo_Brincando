const input = document.querySelector('.login__input');
const button = document.querySelector('.login__button');
const form = document.querySelector('.login-form');
const levelButtons = document.querySelectorAll('.level-button');

let selectedLevel = null;

const validateInput = ({target}) => {
    if (target.value.length > 2 && selectedLevel) {
        button.removeAttribute('disabled'); 
        return;
    }
    button.setAttribute('disabled', '');
}

const handleSubmit = (event) => {
    event.preventDefault();
    localStorage.setItem('player', input.value);
    if (selectedLevel === '1') {
        window.location = 'game.html';
    } else if (selectedLevel === '2') {
        window.location = 'game2.html';
    } else {
        alert('Por favor, selecione um nível.');
    }
}

const handleLevelSelect = (event) => {
    
    levelButtons.forEach(button => button.classList.remove('selected'));
    
    event.target.classList.add('selected');
    selectedLevel = event.target.dataset.level;
    localStorage.setItem('level', selectedLevel);
    
    validateInput({ target: input });
}

input.addEventListener('input', validateInput);
form.addEventListener('submit', handleSubmit);
levelButtons.forEach(button => button.addEventListener('click', handleLevelSelect));
