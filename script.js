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

// Логика перемещения плиток
function move(direction) {
    let moved = false;
    switch (direction) {
        case 'left':
            for (let i = 0; i < 4; i++) {
                const newRow = compressRow(grid[i]);
                if (JSON.stringify(newRow) !== JSON.stringify(grid[i])) {
                    moved = true;
                }
                grid[i] = newRow;
            }
            break;

        case 'right':
            for (let i = 0; i < 4; i++) {
                const newRow = compressRow(grid[i].reverse()).reverse();
                if (JSON.stringify(newRow) !== JSON.stringify(grid[i])) {
                    moved = true;
                }
                grid[i] = newRow;
            }
            break;

        case 'up':
            grid = rotateGrid(grid);
            for (let i = 0; i < 4; i++) {
                const newRow = compressRow(grid[i]);
                if (JSON.stringify(newRow) !== JSON.stringify(grid[i])) {
                    moved = true;
                }
                grid[i] = newRow;
            }
            grid = rotateGrid(grid, true);
            break;

        case 'down':
            grid = rotateGrid(grid);
            for (let i = 0; i < 4; i++) {
                const newRow = compressRow(grid[i].reverse()).reverse();
                if (JSON.stringify(newRow) !== JSON.stringify(grid[i])) {
                    moved = true;
                }
                grid[i] = newRow;
            }
            grid = rotateGrid(grid, true);
            break;
    }

    if (moved) {
        addNewTile();
    }
    updateGrid();
}

// Сжатие и объединение плиток по строке
function compressRow(row) {
    let newRow = row.filter(value => value);
    let mergedRow = [];
    for (let i = 0; i < newRow.length; i++) {
        if (newRow[i] === newRow[i + 1]) {
            mergedRow.push(newRow[i] * 2);
            score += newRow[i] * 2;
            i++; // Пропустить следующий элемент
        } else {
            mergedRow.push(newRow[i]);
        }
    }
   
    while (mergedRow.length < 4) mergedRow.push(0); // Заполнение до 4
    return mergedRow; 
}

// Поворот сетки
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
    move(direction);
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
