const boardElement = document.getElementById('game-board');
const scoreElement = document.getElementById('score');

let board;
let score = 0;

function initializeGame() {
    board = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
    addNewTile();
    addNewTile();
    updateBoard();
}

function addNewTile() {
    const emptyCells = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (board[i][j] === 0) {
                emptyCells.push({ x: i, y: j });
            }
        }
    }
    if (emptyCells.length) {
        const { x, y } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        board[x][y] = Math.random() < 0.9 ? 2 : 4;
    }
}

function updateBoard() {
    boardElement.innerHTML = ''; // Очистка доски
    board.forEach(row => {
        row.forEach(value => {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.textContent = value !== 0 ? value : '';
            boardElement.appendChild(tile);
        });
    });
    scoreElement.textContent = score;
}

function compress(board) {
    const newBoard = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
    for (let i = 0; i < 4; i++) {
        let pos = 0;
        for (let j = 0; j < 4; j++) {
            if (board[i][j] !== 0) {
                newBoard[i][pos] = board[i][j];
                pos++;
            }
        }
    }
    return newBoard;
}

function merge(board) {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === board[i][j + 1] && board[i][j] !== 0) {
                board[i][j] *= 2; // Удвоение значения
                score += board[i][j]; // Увеличение счета
                board[i][j + 1] = 0; // Обнуление плитки справа
            }
        }
    }
    return board;
}

function rotateBoard(board) {
    return board[0].map((val, index) => board.map(row => row[index]).reverse());
}

function moveLeft() {
    let newBoard = compress(board);
    newBoard = merge(newBoard);
    newBoard = compress(newBoard);
    board = newBoard;
    addNewTile();
    updateBoard();
}

function moveRight() {
    board = rotateBoard(rotateBoard(board));
    moveLeft();
    board = rotateBoard(rotateBoard(board));
}

function moveUp() {
    board = rotateBoard(board);
    moveLeft();
    board = rotateBoard(rotateBoard(board));
}

function moveDown() {
    board = rotateBoard(rotateBoard(rotateBoard(board)));
    moveLeft();
}

function checkGameOver() {
    if (board.flat().includes(0)) return false;
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === board[i][j + 1] || board[i][j] === board[i + 1]?.[j]) {
                return false;
            }
        }
    }
    return true;
}

// Обработка касаний
let touchStartX, touchStartY;

boardElement.addEventListener('touchstart', (event) => {
    const touch = event.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
});

boardElement.addEventListener('touchmove', (event) => {
    event.preventDefault(); // Предотвращение прокрутки страницы
});

boardElement.addEventListener('touchend', (event) => {
    const touch = event.changedTouches[0];
    const touchEndX = touch.clientX;
    const touchEndY = touch.clientY;

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) moveRight(); // Движение вправо
        else moveLeft(); // Движение влево
    } else {
        if (deltaY > 0) moveDown(); // Движение вниз
        else moveUp(); // Движение вверх
    }

    if (checkGameOver()) {
        setTimeout(() => alert("Игра окончена!"), 100);
    }
});

// Инициализация игры
initializeGame();
        
