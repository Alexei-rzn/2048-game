document.addEventListener("DOMContentLoaded", () => {
    let board = initializeGame();
    displayBoard(board);

    document.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") {
            board = moveLeft(board);
        } else if (event.key === "ArrowRight") {
            board = moveRight(board);
        } else if (event.key === "ArrowUp") {
            board = moveUp(board);
        } else if (event.key === "ArrowDown") {
            board = moveDown(board);
        }

        displayBoard(board);

        if (checkGameOver(board)) {
            document.getElementById("status").textContent = "Игра окончена!";
        }
    });
});

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
                emptyCells.push([i, j]);
            }
        }
    }
    if (emptyCells.length > 0) {
        let [i, j] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        board[i][j] = Math.random() < 0.9 ? 2 : 4;
    }
}

function displayBoard(board) {
    const cells = document.getElementsByClassName("cell");
    let cellIndex = 0;
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            let cell = cells[cellIndex];
            cell.textContent = board[i][j] !== 0 ? board[i][j] : "";
            cell.setAttribute("data-value", board[i][j]);
            cellIndex++;
        }
    }
}

function compress(board) {
    let newBoard = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
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
                board[i][j] *= 2;
                board[i][j + 1] = 0;
            }
        }
    }
    return board;
}

function moveLeft(board) {
    board = compress(board);
    board = merge(board);
    board = compress(board);
    addNewTile(board);
    return board;
}

function moveRight(board) {
    board = rotateBoard(rotateBoard(board));
    board = moveLeft(board);
    board = rotateBoard(rotateBoard(board));
    return board;
}

function moveUp(board) {
    board = rotateBoard(board);
    board = moveLeft(board);
    board = rotateBoard(rotateBoard(rotateBoard(board)));
    return board;
}

function moveDown(board) {
    board = rotateBoard(rotateBoard(rotateBoard(board)));
    board = moveLeft(board);
    board = rotateBoard(board);
    return board;
}

function rotateBoard(board) {
    let newBoard = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            newBoard[j][3 - i] = board[i][j];
        }
    }
    return newBoard;
}

function checkGameOver(board) {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (board[i][j] === 0) return false;
            if (j < 3 && board[i][j] === board[i][j + 1]) return false;
            if (i < 3 && board[i][j] === board[i + 1][j]) return false;
        }
    }
    return true;
}
