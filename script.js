const gridContainer = document.getElementById("grid-container");
const scoreDisplay = document.getElementById("score");
const restartButton = document.getElementById("restart");
const gameOverDisplay = document.getElementById("game-over");

let grid = [];
let score = 0;

// Инициализация игры
function initGame() {
    grid = Array.from({ length: 4 }, () => Array(4).fill(0));
    score = 0;
    addNewTile();
    addNewTile();
    updateGrid();
}

// Добавление новой плитки
function addNewTile() {
    let emptyCells = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] === 0) emptyCells.push({ i, j });
        }
    }
    if (emptyCells.length) {
        const { i, j } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        grid[i][j] = Math.random() < 0.9 ? 2 : 4; // 90% вероятность 2, 10% - 4
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

    if (checkGameOver()) {
        gameOverDisplay.classList.remove("hidden");
    }
}

// Проверка на окончание игры
function checkGameOver() {
    return grid.flat().every(cell => cell !== 0) &&
        !grid.some((row, i) => row.some((cell, j) => 
            (j < 3 && cell === row[j + 1]) || (i < 3 && cell === grid[i + 1][j])
        ));
}

// Сжатие и объединение плиток
function compressAndMerge(line) {
    let newLine = line.filter(value => value);
    let mergedLine = [];
    let scoreChange = 0;

    for (let i = 0; i < newLine.length; i++) {
        // Объединение плиток
        if (newLine[i] === newLine[i + 1]) {
            mergedLine.push(newLine[i] * 2);
            scoreChange += newLine[i] * 2;
            i++; // Пропустить следующий элемент, так как он объединен
        } else {
            mergedLine.push(newLine[i]);
        }
    }
    
    while (mergedLine.length < 4) mergedLine.push(0); // Заполнение до 4
    score += scoreChange;
    
    return { line: mergedLine, scoreChange };
}

// Движение влево
function moveLeft() {
    let moved = false;
    for (let i = 0; i < 4; i++) {
        const { line, scoreChange } = compressAndMerge(grid[i]);
        if (JSON.stringify(line) !== JSON.stringify(grid[i])) {
            moved = true; // Если линия изменилась, значит что-то двигалось
        }
        grid[i] = line;
    }
    if (moved) {
        addNewTile();
    }
}

// Движение вправо
function moveRight() {
    let moved = false;
    for (let i = 0; i < 4; i++) {
        const { line, scoreChange } = compressAndMerge(grid[i].reverse());
        if (JSON.stringify(line.reverse()) !== JSON.stringify(grid[i])) {
            moved = true;
        }
        grid[i] = line.reverse();
    }
    if (moved) {
        addNewTile();
    }
}

// Движение вверх
function moveUp() {
    grid = rotateGrid(grid);
    let moved = false;
    for (let i = 0; i < 4; i++) {
        const { line, scoreChange } = compressAndMerge(grid[i]);
        if (JSON.stringify(line) !== JSON.stringify(grid[i])) {
            moved = true;
        }
        grid[i] = line;
    }
    grid = rotateGrid(grid, true);
    if (moved) {
        addNewTile();
    }
}

// Движение вниз
function moveDown() {
    grid = rotateGrid(grid);
    let moved = false;
    for (let i = 0; i < 4; i++) {
        const { line, scoreChange } = compressAndMerge(grid[i].reverse());
        if (JSON.stringify(line.reverse()) !== JSON.stringify(grid[i])) {
            moved = true;
        }
        grid[i] = line.reverse();
    }
    grid = rotateGrid(grid, true);
    if (moved) {
        addNewTile();
    }
}

// Поворот сетки для использования функций движения
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
        addNewTile();
    }
    updateGrid();
}

// Кнопка перезапуска игры
restartButton.addEventListener("click", () => {
    gameOverDisplay.classList.add("hidden");
    initGame();
});

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

// Инициализация игры
initGame();
