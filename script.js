// Логика игры 2048

document.addEventListener("DOMContentLoaded", function () {
    const gameBoard = document.getElementById('game-board');
    let board = initializeGame(); // Инициализация игровой доски
    displayBoard(board); // Отображение начальной доски

    // Обработка клавиш для управления
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

    // Поддержка свайпов для мобильных устройств
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

// Инициализация игры
function initializeGame() {
    let board = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
    addNewTile(board);
    addNewTile(board);
    return board;
}

// Добавление новой плитки
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
        board[x][y] = Math.random() > 0.9 ? 4 : 2; // 10% вероятность появления 4
    }
}

// Отображение доски
function displayBoard(board) {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = ''; // Очистка доски
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

// Движение плиток влево
function moveLeft(board) {
    let newBoard = compress(board);
    newBoard = merge(newBoard);
    newBoard = compress(newBoard);
    addNewTile(newBoard);
    return newBoard;
}

// Движение плиток вправо
function moveRight(board) {
    board = rotateBoard(board);
    board = moveLeft(board);
    board = rotateBoard(board);
    return board;
}

// Движение плиток вверх
function moveUp(board) {
    board = rotateBoard(rotateBoard(board));
    board = moveLeft(board);
    board = rotateBoard(rotateBoard(board));
    return board;
}

// Движение плиток вниз
function moveDown(board) {
    board = rotateBoard(rotateBoard(rotateBoard(board)));
    board = moveLeft(board);
    board = rotateBoard(board);
    return board;
}

// Поворот доски
function rotateBoard(board) {
    return board[0].map((_, index) => board.map(row => row[index])).reverse();
}

// Сжатие плиток
function compress(board) {
    let newBoard = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
    for (let i = 0; i < 4; i++) {
        let pos = 0; // Позиция для вставки ненулевого значения
        for (let j = 0; j < 4; j++) {
            if (board[i][j] !== 0) {
                newBoard[i][pos] = board[i][j];
                pos++;
            }
        }
    }
    return newBoard;
}

// Объединение плиток
function merge(board) {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === board[i][j + 1] && board[i][j] !== 0) {
                board[i][j] *= 2; // Удвоение значения
                board[i][j + 1] = 0; // Обнуление плитки справа
            }
        }
    }
    return board;
}

// Проверка окончания игры
function checkGameOver(board) {
    // Проверка на наличие пустых клеток
    for (let row of board) {
        if (row.includes(0)) return false; // Есть пустая клетка
    }

    // Проверка на возможность объединения плиток
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === board[i][j + 1] || board[j][i] === board[j + 1][i]) {
                return false; // Есть возможность объединения
            }
        }
    }
    return true; // Игра окончена
}
