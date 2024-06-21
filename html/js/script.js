document.addEventListener("DOMContentLoaded", function() {
    var gameBoard = document.querySelector('.game-board');
    var gameBoardWidth = gameBoard.offsetWidth;
    var gameBoardHeight = gameBoard.offsetHeight;
    var playerRight = document.getElementById('player-right');
    var playerLeft = document.getElementById('player-left');
    var printer = document.getElementById('impressora');
    var scoreElement = document.getElementById('score');
    var playerSpeed = 20;
    var playerPosition = 0;
    var score = 0;
    var gameActive = false;
    var dropSpeed = 5;

    // Função para atualizar a pontuação
    function updateScore() {
        score += 1;
        scoreElement.textContent = 'Pontuação: ' + score;
        if (score % 5 === 0) {
            increaseSpeed();
        }
    }

    // Função para aumentar a velocidade da queda da impressora
    function increaseSpeed() {
        dropSpeed += 2; // Aumenta a velocidade da queda em 2
    }

    // Função para reiniciar o jogo
    function restartGame() {
        score = 0;
        scoreElement.textContent = 'Pontuação: ' + score;
        playerPosition = 0;
        dropSpeed = 5; // Reset da velocidade
        playerRight.style.left = playerPosition + 'px';
        playerLeft.style.left = playerPosition + 'px';
        playerRight.style.display = 'block';
        playerLeft.style.display = 'none';
        printer.style.top = '-50px';
        document.getElementById('restart-menu').style.display = 'none';
        gameActive = true;
        startGame();
    }

    // Função para iniciar o jogo
    function startGame() {
        document.getElementById('start-menu').style.display = 'none';
        playerRight.style.display = 'block';
        printer.style.display = 'block';
        gameActive = true;
        updatePrinterPosition();
        score = 0;
        dropSpeed = 5; // Reset da velocidade
    }

    // Função para atualizar a posição da impressora
    function updatePrinterPosition() {
        var randomHorizontalPosition = Math.floor(Math.random() * (gameBoardWidth - printer.offsetWidth));
        printer.style.left = randomHorizontalPosition + 'px';
        printer.style.top = '-50px';

        var initialTopPosition = -50;
        var finalTopPosition = gameBoardHeight;

        function dropPrinter() {
            if (!gameActive) return;
            initialTopPosition += dropSpeed;
            printer.style.top = initialTopPosition + 'px';

            if (initialTopPosition < finalTopPosition) {
                requestAnimationFrame(dropPrinter);
            } else {
                updatePrinterPosition();
                updateScore();
            }

            // Checar colisão com o jogador
            if (checkCollision(printer, playerRight) || checkCollision(printer, playerLeft)) {
                gameActive = false;
                document.getElementById('restart-menu').style.display = 'flex';
                playerRight.style.display = 'none';
                playerLeft.style.display = 'none';
                printer.style.display = 'none';
            }
        }

        dropPrinter();
    }

    // Função para mover o jogador para a direita
    function movePlayerRight() {
        if (playerPosition < gameBoardWidth - playerRight.offsetWidth) {
            playerPosition += playerSpeed;
            playerRight.style.left = playerPosition + 'px';
            playerLeft.style.left = playerPosition + 'px';
        }
    }

    // Função para mover o jogador para a esquerda
    function movePlayerLeft() {
        if (playerPosition > 0) {
            playerPosition -= playerSpeed;
            playerRight.style.left = playerPosition + 'px';
            playerLeft.style.left = playerPosition + 'px';
        }
    }

    // Função para checar colisão
    function checkCollision(printer, player) {
        var printerRect = printer.getBoundingClientRect();
        var playerRect = player.getBoundingClientRect();

        return !(
            printerRect.top > playerRect.bottom ||
            printerRect.bottom < playerRect.top ||
            printerRect.left > playerRect.right ||
            printerRect.right < playerRect.left
        );
    }

    // Evento de teclado para mover o jogador
    document.addEventListener('keydown', function(event) {
        if (!gameActive) return;

        if (event.key === 'ArrowRight') {
            playerRight.style.display = 'block';
            playerLeft.style.display = 'none';
            movePlayerRight();
        } else if (event.key === 'ArrowLeft') {
            playerRight.style.display = 'none';
            playerLeft.style.display = 'block';
            movePlayerLeft();
        }
    });

    // Evento de clique para iniciar o jogo
    document.getElementById('start-button').addEventListener('click', startGame);

    // Evento de clique para reiniciar o jogo
    document.getElementById('restart-button').addEventListener('click', restartGame);

    // Define a posição inicial do jogador na horizontal
    playerRight.style.left = playerPosition + 'px';
    playerLeft.style.left = playerPosition + 'px';
});

