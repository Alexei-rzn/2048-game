let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

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
        // Горизонтальный свайп
        if (deltaX > 0) {
            board = moveRight(board); // Свайп вправо
        } else {
            board = moveLeft(board);  // Свайп влево
        }
    } else {
        // Вертикальный свайп
        if (deltaY > 0) {
            board = moveDown(board);  // Свайп вниз
        } else {
            board = moveUp(board);    // Свайп вверх
        }
    }

    displayBoard(board);

    if (checkGameOver(board)) {
        document.getElementById("status").textContent = "Игра окончена!";
    }
}
