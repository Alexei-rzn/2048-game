const gridContainer = document.getElementById("grid-container");
const scoreDisplay = document.getElementById("score");
const restartButton = document.getElementById("restart");
const gameOverDisplay = document.getElementById("game-over");

let grid = [];
let score = 0;
let canMove = true;

// Инициализация игры
function initGame() {
    grid = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    score = 0;
    canMove = true;
    scoreDisplay.innerText = score;
    gameOverDisplay.classList.add("hidden");
    addTile();
    addTile();
    updateGrid();
}

// Добавление плитки на свободное место
function addTile() {
    let emptySpaces = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] === 0) emptySpaces.push({ i, j });
        }
    }
    if (emptySpaces.length > 0) {
        const { i, j } = emptySpaces[Math.floor(Math.random() * emptySpaces.length)];
        grid[i][j] = Math.random() < 0.9 ? 2 : 4;
    }
}

// Обновление отображения плиток на экране
function updateGrid() {
    gridContainer.innerHTML = '';
    grid.forEach(row => {
        row.forEach(tile => {
            const tileElement = document.createElement("div");
            tileElement.classList.add("tile");
            if (tile > 0) {
                tileElement.classList.add(`tile-${tile}`);
                tileElement.innerText = tile;
            }
            gridContainer.appendChild(tileElement);
        });
    });
    scoreDisplay.innerText = score;

    // Проверка на окончание игры
    if (checkGameOver()) {
        canMove = false;
        gameOverDisplay.classList.remove("hidden");
    }
}

// Проверка на окончание игры
function checkGameOver() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] === 0) return false; // Если есть пустая клетка
            if (i < 3 && grid[i][j] === grid[i + 1][j]) return false; // Проверка вниз
            if (j < 3 && grid[i][j] === grid[i][j + 1]) return false; // Проверка вправо
        }
    }
    return true;
}

// Движение плиток влево
function moveLeft() {
    let moved = false;
    for (let i = 0; i < 4; i++) {
        let newRow = grid[i].filter(value => value);
        let scoreChange = 0;

        // Объединение плиток
        for (let j = 0; j < newRow.length - 1; j++) {
            if (newRow[j] === newRow[j + 1] && newRow[j] !== 0) {
                newRow[j] *= 2;
                scoreChange += newRow[j];
                newRow[j + 1] = 0;
                moved = true;
            }
        }
        newRow = newRow.filter(value => value);
        const missing = 4 - newRow.length;
        const zeros = Array(missing).fill(0);
        grid[i] = newRow.concat(zeros);
        score += scoreChange;
    }
    return moved;
}

// Движение плиток вправо
function moveRight() {
    grid.forEach((row, i) => {
        grid[i] = row.reverse();
    });
    const moved = moveLeft();
    grid.forEach((row, i) => {
        grid[i] = row.reverse();
    });
    return moved;
}

// Движение плиток вверх
function moveUp() {
    grid = rotateGrid(grid);
    const moved = moveLeft();
    grid = rotateGrid(grid, true);
    return moved;
}

// Движение плиток вниз
function moveDown() {
    grid = rotateGrid(grid);
    const moved = moveRight();
    grid = rotateGrid(grid, true);
    return moved;
}

// Поворот сетки для движения вверх и вниз
function rotateGrid(grid, reverse = false) {
    const newGrid = [];
    for (let i = 0; i < 4; i++) {
        newGrid[i] = [];
        for (let j = 0; j < 4; j++) {
            newGrid[i][j] = reverse ? grid[j][i] : grid[3 - j][i];
        }
    }
    return newGrid;
}

// Обработка свайпов
function handleSwipe(direction) {
    if (!canMove) return; // Если игра окончена, ничего не делаем

    let moved = false;
    switch (direction) {
        case 'left':
            moved = moveLeft();
            break;
        case 'right':
            moved = moveRight();
            break;
        case 'up':
            moved = moveUp();
            break;
        case 'down':
            moved = moveDown();
            break;
    }
    
    if (moved) {
        addTile();
        updateGrid();
    }
}

// События касания
let startX, startY;
gridContainer.addEventListener("touchstart", (event) => {
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
});

gridContainer.addEventListener("touchend", (event) => {
    const endX = event.changedTouches[0].clientX;
    const endY = event.changedTouches[0].clientY;

    const deltaX = endX - startX;
    const deltaY = endY - startY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        handleSwipe(deltaX > 0 ? 'right' : 'left');
    } else {
        handleSwipe(deltaY > 0 ? 'down' : 'up');
    }
});

// Кнопка перезапуска
restartButton.addEventListener("click", initGame);

// Начальная инициализация игры
initGame();
