const gridContainer = document.getElementById("grid-container");
const scoreDisplay = document.getElementById("score");

let grid = [];
let score = 0;

function initGame() {
    grid = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    score = 0;
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
}

function handleSwipe(direction) {
    if (direction === 'left') {
        // Реализация слияния влево
        moveLeft();
    }
    // Дальше можно добавить другие направления (вправо, вверх, вниз)
    
    addTile();
    updateGrid();
}

function moveLeft() {
    // Реализация движения влево
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
            }
        }
        newRow = newRow.filter(value => value);
        missing = 4 - newRow.length;
        zeros = Array(missing).fill(0);
        newRow = newRow.concat(zeros);
        grid[i] = newRow;
    }
}

// Обработка событий касания
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

initGame();
