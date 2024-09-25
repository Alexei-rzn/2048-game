// Игровая логика для 2048

document.addEventListener("DOMContentLoaded", function () {
    const gameBoard = document.getElementById('game-board');
    let board = initializeGame();
    displayBoard(board);

    // Добавляем обработку клавиш для управления
    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowUp') {
            board = moveUp(board);
        } else if (event.key === 'ArrowDown') {
            board = moveDown(board);
        } else if (event.key === 'ArrowLeft') {
            board = moveLeft(board);
        } else if (event.key === 'ArrowRight') {
            board = moveRight(board);
        }
        displayBoard(board);
        if (checkGameOver(board)) {
            document.getElementById("status").textContent = "Игра окончена!";
        }
    });

    // Добавляем поддержку свайпов для мобильных устройств
    let touchStartX = 0, touchStartY = 0, touchEndX = 0, touchEndY = 0;

    document.addEventListener("touchstart", (event) => {
        touchStartX = event.changedTouches[0].screenX;
        touchStartY = event.changedTouches[0].screenY;
    });

    document.addEventListener("touchend", (event) => {
        touchEndX = event.changedTouches[0].screenX;
        touchEndY = event.changedTouches[0].screenY;
        handleGesture();
    });

    function handleGesture() {
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX > 0) {
                board = moveRight(board);
            } else {
                board = moveLeft(board);
            }
        } else {
            if (deltaY > 0) {
                board = moveDown(board);
            } else {
                board = moveUp(board);
            }
        }
        displayBoard(board);
        if (checkGameOver(board)) {
            document.getElementById("status").textContent = "Игра окончена!";
        }
    }
});

// Функции инициализации и управления

function initializeGame() {
    let board = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
    addNewTile(board);
    addNewTile(board);
    return board;
}

function addNewTile(board) {
    let emptyCells = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (board[i][j] === 0) {
                emptyCells.push({ x: i, y: j });
            }
        }
    }
    if (emptyCells.length > 0) {
        let { x, y } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        board[x][y] = Math.random() > 0.9 ? 4 : 2;
    }
}

// Отображение доски
function displayBoard(board) {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    for (let row of board) {
        for (let cell of row) {
            const cellDiv = document.createElement('div');
            cellDiv.classList.add('cell');
            if (cell !== 0) {
                cellDiv.textContent = cell;
                cellDiv.setAttribute('data-value', cell);
            }
            gameBoard.appendChild(cellDiv);
        }
    }
}

// Движение плиток
function moveLeft(board) {
    // Реализовать логику движения влево
    return board;
}

function moveRight(board) {
    // Реализовать логику движения вправо
    return board;
}

function moveUp(board) {
    // Реализовать логику движения вверх
    return board;
}

function moveDown(board) {
    // Реализовать логику движения вниз
    return board;
}

function checkGameOver(board) {
    // Проверка конца игры
    return false;
}
