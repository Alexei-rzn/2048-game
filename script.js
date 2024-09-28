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

    // Проверка, если плитки упираются в край
    if (moved) {
        const edgeCheck = grid.map((row, rowIndex) => {
            return row.map((tile, colIndex) => {
                if (tile !== 0) {
                    if (direction === 'left' && colIndex === 0) return tile;
                    if (direction === 'right' && colIndex === 3) return tile;
                    if (direction === 'up' && rowIndex === 0) return tile;
                    if (direction === 'down' && rowIndex === 3) return tile;
                }
                return tile;
            });
        });
        grid = edgeCheck;
        addNewTile();
    }
    updateGrid();
}
