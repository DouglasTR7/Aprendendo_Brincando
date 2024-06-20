document.addEventListener('DOMContentLoaded', () => {
    const levelButtons = document.querySelectorAll('.level-button');
    const scoreElement = document.getElementById('score');
    const medalImage = document.getElementById('medal-image');
    const topScoresList = document.getElementById('top-scores-list');
    const resetButton = document.getElementById('reset-button');
    const homeButton = document.getElementById('home-button');

    let score = parseInt(localStorage.getItem('score'));
    let level = localStorage.getItem('level');
    let player = localStorage.getItem('player');

    if (isNaN(score)) {
        scoreElement.textContent = 'Nenhuma pontuação registrada';
        medalImage.src = '../images/podium.png';  // Define a imagem do pódio quando não há pontuação
    } else {
        scoreElement.textContent = `${score} segundos`;

        if (score <= 20) {
            medalImage.src = '../images/medalha_ouro.png';
        } else if (score <= 40) {
            medalImage.src = '../images/medalha_prata.png';
        } else {
            medalImage.src = '../images/medalha_bronze.png';
        }

        // Função para disparar confete
        const fireConfetti = () => {
            confetti({
                particleCount: 30,  // Reduzindo a quantidade de confetes lançados de uma vez
                startVelocity: 20,
                spread: 360,
                origin: {
                    x: Math.random(),
                    y: 0
                },
                scalar: 1.5  // Aumentando o tamanho dos confetes
            });
        };

        // Disparar confete repetidamente por alguns segundos
        const duration = 5000;
        const end = Date.now() + duration;

        (function frame() {
            fireConfetti();
            if (Date.now() < end) {
                setTimeout(frame, 200);  // Ajuste de intervalo para reduzir a frequência dos lançamentos
            }
        }());

        const topScores = JSON.parse(localStorage.getItem('topScores')) || [];

        const existingPlayerIndex = topScores.findIndex(entry => entry.name === player);
        if (existingPlayerIndex !== -1) {
            if (topScores[existingPlayerIndex].score > score) {
                topScores[existingPlayerIndex].score = score;
                topScores[existingPlayerIndex].level = level;
            }
        } else {
            topScores.push({ name: player, score, level });
        }

        topScores.sort((a, b) => a.score - b.score);
        if (topScores.length > 10) {
            topScores.pop();
        }
        localStorage.setItem('topScores', JSON.stringify(topScores));

        topScores.forEach((entry, index) => {
            const li = document.createElement('li');
            li.innerHTML = `${entry.name}: ${entry.score} segundos (Nível ${entry.level}) <img class="medal-hover" src="" alt="Medalha">`;

            // Adiciona classes para os três primeiros colocados
            if (index === 0) {
                li.classList.add('gold');
            } else if (index === 1) {
                li.classList.add('silver');
            } else if (index === 2) {
                li.classList.add('bronze');
            }

            li.addEventListener('mouseover', () => {
                const medalHoverImage = li.querySelector('.medal-hover');
                if (entry.score <= 20) {
                    medalHoverImage.src = '../images/medalha_ouro.png';
                } else if (entry.score <= 40) {
                    medalHoverImage.src = '../images/medalha_prata.png';
                } else {
                    medalHoverImage.src = '../images/medalha_bronze.png';
                }
                medalHoverImage.style.display = 'block';
            });

            li.addEventListener('mouseout', () => {
                const medalHoverImage = li.querySelector('.medal-hover');
                medalHoverImage.style.display = 'none';
            });

            topScoresList.appendChild(li);
        });
    }

    levelButtons.forEach(button => {
        button.addEventListener('click', () => {
            const level = button.getAttribute('data-level');
            localStorage.setItem('level', level);
            if (level === '1') {
                window.location.href = 'game.html';
            } else if (level === '2') {
                window.location.href = 'game2.html';
            }
        });
    });

    resetButton.addEventListener('click', () => {
        localStorage.removeItem('score');
        localStorage.removeItem('topScores');
        alert('Pontuação resetada!');
        window.location.reload();
    });

    homeButton.addEventListener('click', () => {
        window.location.href = '../index.html';
    });
});
