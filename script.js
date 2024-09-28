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

// Обновление отображения плиток
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

// Перемещение плиток в зависимости от направления
function move(direction) {
    let moved = false;
    
    if (direction === 'left') {
        for (let i = 0; i < 4; i++) {
            const newRow = slideAndMerge(grid[i]);
            if (JSON.stringify(newRow) !== JSON.stringify(grid[i])) {
                moved = true;
                grid[i] = newRow;
            }
        }
    } 
    else if (direction === 'right') {
        for (let i = 0; i < 4; i++) {
            const newRow = slideAndMerge(grid[i].reverse()).reverse();
            if (JSON.stringify(newRow) !== JSON.stringify(grid[i])) {
                moved = true;
                grid[i] = newRow;
            }
        }
    } 
    else if (direction === 'up') {
        for (let j = 0; j < 4; j++) {
            const col = [grid[0][j], grid[1][j], grid[2][j], grid[3][j]];
            const newCol = slideAndMerge(col);
            if (JSON.stringify(newCol) !== JSON.stringify(col)) {
                moved = true;
                for (let i = 0; i < 4; i++) {
                    grid[i][j] = newCol[i];
                }
            }
        }
    } 
    else if (direction === 'down') {
        for (let j = 0; j < 4; j++) {
            const col = [grid[0][j], grid[1][j], grid[2][j], grid[3][j]].reverse();
            const newCol = slideAndMerge(col).reverse();
            if (JSON.stringify(newCol) !== JSON.stringify(col)) {
                moved = true;
                for (let i = 0; i < 4; i++) {
                    grid[i][j] = newCol[i];
                }
            }
        }
    }

    if (moved) {
        addNewTile();
    }
    updateGrid();
}

// Сжатие и слияние плиток
function slideAndMerge(row) {
    // Убираем нули, оставляем только заполненные плитки
    let newRow = row.filter(value => value);

    // Проходим по ряду и объединяем одинаковые плитки
    for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
            newRow[i] *= 2; // Сложение плиток
            score += newRow[i]; // Обновляем счёт
            newRow[i + 1] = 0; // Обнуляем вторую плитку после сложения
        }
    }

    // Убираем нули, появившиеся после объединения
    newRow = newRow.filter(value => value);

    // Дополняем ряд нулями до длины 4
    while (newRow.length < 4) {
        newRow.push(0);
    }

    return newRow;
}

// Проверка окончания игры
function checkGameOver() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] === 0) return false;
            if (j < 3 && grid[i][j] === grid[i][j + 1]) return false;
            if (i < 3 && grid[i][j] === grid[i + 1][j]) return false;
        }
    }
    return true;
}

// События касания для мобильных устройств
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

// Обработка свайпов
function handleSwipe(direction) {
    move(direction);
}

// Кнопка перезапуска игры
restartButton.addEventListener("click", () => {
    gameOverDisplay.classList.add("hidden");
    initGame();
});

// Инициализация игры при загрузке страницы
initGame();
                    
