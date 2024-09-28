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

    // Проверяем, что плитки не могут выходить за границы
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] !== 0) {
                if (direction === 'left' && j === 0) {
                    grid[i][j] = grid[i][j]; // Плитка не может двигаться дальше
                } else if (direction === 'right' && j === 3) {
                    grid[i][j] = grid[i][j]; // Плитка не может двигаться дальше
                } else if (direction === 'up' && i === 0) {
                    grid[i][j] = grid[i][j]; // Плитка не может двигаться дальше
                } else if (direction === 'down' && i === 3) {
                    grid[i][j] = grid[i][j]; // Плитка не может двигаться дальше
                }
            }
        }
    }

    if (moved) {
        addNewTile();
    }
    updateGrid();
}
