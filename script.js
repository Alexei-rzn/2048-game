const gridContainer = document.getElementById("grid-container");
const scoreDisplay = document.getElementById("score");
const restartButton = document.getElementById("restart");
const gameOverDisplay = document.getElementById("game-over");

let grid = [];
let score = 0;
let gameOver = false;

function initGame() {
    grid = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    score = 0;
    gameOver = false;
    scoreDisplay.innerText = score;
    gameOverDisplay.classList.add("hidden");
    addTile();
    addTile();
    updateGrid();
}

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
        gameOver = true;
        gameOverDisplay.classList.remove("hidden");
    }
}

function checkGameOver() {
    // Проверка на заполнение всей сетки без возможных ходов
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] === 0) return false; // Если есть пустая клетка
            if (i < 3 && grid[i][j] === grid[i + 1][j]) return false; // Проверка вниз
            if (j < 3 && grid[i][j] === grid[i][j + 1]) return false; // Проверка вправо
        }
    }
    return true;
}

function moveLeft() {
    let moved = false;
    for (let i = 0; i < 4; i++) {
        let newRow = grid[i].filter(value => value);
        let missing = 4 - newRow.length;
        let zeros = Array(missing).fill(0);
        newRow = newRow.concat(zeros);

        for (let j = 0; j < 3; j++) {
            if (newRow[j] === newRow[j + 1] && newRow[j] !== 0) {
                newRow[j] *= 2;
                score += newRow[j];
                newRow[j + 1] = 0;
                moved = true;
            }
        }
        newRow = newRow.filter(value => value);
        missing = 4 - newRow.length;
        zeros = Array(missing).fill(0);
        newRow = newRow.concat(zeros);
        grid[i] = newRow;
    }
    return moved;
}

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

function moveUp() {
    grid = rotateGrid(grid);
    const moved = moveLeft();
    grid = rotateGrid(grid, true);
    return moved;
}

function moveDown() {
    grid = rotateGrid(grid);
    const moved = moveRight();
    grid = rotateGrid(grid, true);
    return moved;
}

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
        addTile();
        updateGrid();
    }
}

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

restartButton.addEventListener("click", initGame);

initGame();
