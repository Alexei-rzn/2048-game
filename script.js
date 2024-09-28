const gridContainer = document.getElementById("grid-container");
const scoreDisplay = document.getElementById("score");
const restartButton = document.getElementById("restart");
const gameOverDisplay = document.getElementById("game-over");

let grid = [];
let score = 0;

// Инициализация игры
function initGame() {
    grid = Array.from({ length: 4 }, () => Array(4).fill(0)); // Создаем пустое поле 4x4
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
            if (grid[i][j] === 0) emptyCells.push({ i, j }); // Собираем пустые ячейки
        }
    }
    if (emptyCells.length) {
        const { i, j } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        grid[i][j] = Math.random() < 0.9 ? 2 : 4; // Добавляем новую плитку 2 или 4
    }
}

// Обновление отображения плиток
function updateGrid() {
    gridContainer.innerHTML = ''; // Очищаем контейнер перед отрисовкой
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
    scoreDisplay.innerText = score; // Обновляем счёт

    if (checkGameOver()) {
        gameOverDisplay.classList.remove("hidden");
    }
}

// Проверка конца игры
function checkGameOver() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] === 0) return false; // Если есть пустая ячейка, игра продолжается
            if (j < 3 && grid[i][j] === grid[i][j + 1]) return false; // Если можно объединить плитки по горизонтали
            if (i < 3 && grid[i][j] === grid[i + 1][j]) return false; // Если можно объединить плитки по вертикали
        }
    }
    return true; // Если нет ходов, игра окончена
}

// Перемещение плиток в зависимости от направления
function move(direction) {
    let moved = false;
    
    if (direction === 'left') {
        for (let i = 0; i < 4; i++) {
            const newRow = slideAndMerge(grid[i]); // Сдвиг и объединение влево
            if (JSON.stringify(newRow) !== JSON.stringify(grid[i])) {
                moved = true;
                grid[i] = newRow;
            }
        }
    } 
    else if (direction === 'right') {
        for (let i = 0; i < 4; i++) {
            const newRow = slideAndMerge(grid[i].reverse()).reverse(); // Сдвиг и объединение вправо
            if (JSON.stringify(newRow) !== JSON.stringify(grid[i])) {
                moved = true;
                grid[i] = newRow;
            }
        }
    } 
    else if (direction === 'up') {
        for (let j = 0; j < 4; j++) {
            const col = [grid[0][j], grid[1][j], grid[2][j], grid[3][j]];
            const newCol = slideAndMerge(col); // Сдвиг и объединение вверх
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
            const newCol = slideAndMerge(col).reverse(); // Сдвиг и объединение вниз
            if (JSON.stringify(newCol) !== JSON.stringify(col)) {
                moved = true;
                for (let i = 0; i < 4; i++) {
                    grid[i][j] = newCol[i];
                }
            }
        }
    }

    if (moved) {
        addNewTile(); // Если было движение, добавляем новую плитку
    }
    updateGrid(); // Обновляем игровое поле
}

// Функция для сжатия и объединения плиток в одном ряду/столбце
function slideAndMerge(row) {
    let newRow = row.filter(value => value); // Убираем все нули
    for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) { // Если плитки одинаковые, объединяем их
            newRow[i] *= 2;
            score += newRow[i]; // Обновляем счёт
            newRow[i + 1] = 0; // Обнуляем вторую плитку после объединения
        }
    }
    newRow = newRow.filter(value => value); // Снова убираем нули после объединения
    while (newRow.length < 4) newRow.push(0); // Дополняем ряд нулями до длины 4
    return newRow;
}

// Обработка событий касания для мобильных устройств
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
