const SUDOKU0EMPTY0CELL = 0;

/**
 * A sudoku cell with possibilities set
 */
class SudokuImplication {
  cell;
  possibilities;

  constructor(cell: CellTuple, pset: Set<number> = new Set<number>()) {
    this.cell = cell;
    this.possibilities = pset;
  }
}

/**
 * Sudoku puzzle solver
 *
 * Time complexity: O(n^m)
 *    n = num of possibilities in each cell, m = num of blank spaces in grid
 *    Ex: For 9x9, O(9^m)
 */
class SudokuSolver {
  empty: number = SUDOKU0EMPTY0CELL;
  grid: number[][] = [[]];
  size: number = 0;
  subgrid: number = 0;

  constructor(grid: number[][] = [[]]) {
    this.grid = grid;
    this.size = grid.length;
    this.subgrid = Math.sqrt(grid.length);
  }

  /**
   * Update dimensions from grid
   */
  updateDimensions() {
    this.size = this.grid.length;
    this.subgrid = Math.sqrt(this.grid.length);
  }

  /**
   * Set a new grid and update dimensions
   */
  setGrid(grid: number[][]) {
    this.grid = grid;
    this.updateDimensions();
  }

  /**
   * Set a new grid and update dimensions
   */
  solve(cell: CellTuple | null = [0, 0]) {
    cell = this.findEmpty(cell);

    if (cell) {
      const [row, col] = cell;
      const nextCell = this.next(cell);

      // Try every number
      const pSize = this.size + 1;
      for (let number = 1; number < pSize; ++number) {
        // Check if cell with number is promising
        if (this.isPromising(row, col, number)) {
          // Try to do implication placements
          const placements = this.imply(cell, number);

          // Recurse to next cell
          if (this.solve(nextCell)) return true;
          // Backtrack/undo implication placements when fail
          else this.undoImply(placements);
        }
      }

      // Current path fails when all numbers are exhausted
      return false;
    }
    // No more empty cells means the Sudoku puzzle is solved
    else {
      return true;
    }
  }

  /**
   * Reduce backtracking with implications.
   * Try to imply single possibilities for each empty cell with given number.
   * Will mark empty cell with single possibilty implication.
   */
  imply(cell: CellTuple, number: number) {
    const placements = [];
    const pset = new Set<number>();
    const pSize = this.size + 1;
    for (let num = 1; num < pSize; ++num) pset.add(num);

    // Do first placement with number
    const [row, col] = cell;
    this.grid[row][col] = number;
    placements.push(new SudokuImplication(cell));
    let doImplications = true;

    // Do a round of implications
    while (doImplications) {
      doImplications = false; // Turn off doImplications

      // Check implications by subgrids
      for (let i = 0; i < this.size; ++i) {
        const implications = [];
        const subset = new Set<number>([...pset]);

        // Subgrid start indices
        const y = this.subgrid * Math.floor(i / this.subgrid);
        const x = this.subgrid * (i % this.subgrid);

        // Reduce subset in subgrid
        for (let iRow = y; iRow < y + this.subgrid; ++iRow)
          for (let iCol = x; iCol < x + this.subgrid; ++iCol)
            subset.delete(this.grid[iRow][iCol]);

        // Place subset to each free cell in subgrid
        for (let iRow = y; iRow < y + this.subgrid; ++iRow) {
          for (let iCol = x; iCol < x + this.subgrid; ++iCol) {
            if (this.grid[iRow][iCol] === this.empty) {
              const imp = new SudokuImplication(
                [iRow, iCol],
                new Set<number>([...subset])
              );
              implications.push(imp);
            }
          }
        }

        // Reduce subset for each implications by row and col
        for (const imp of implications) {
          const [iRow, iCol] = imp.cell;
          for (let j = 0; j < this.size; ++j) {
            imp.possibilities.delete(this.grid[iRow][j]);
            imp.possibilities.delete(this.grid[j][iCol]);
          }

          // Place implication when there's only one possibilty
          if (imp.possibilities.size === 1) {
            const val = imp.possibilities.values().next().value;
            this.grid[iRow][iCol] = val;
            imp.possibilities.delete(val);
            placements.push(imp);

            // Turn on doImplications when there's a placements
            doImplications = true;
          }
        }
      }
    }

    return placements;
  }

  /**
   * Undo implications by marking each implication cell as empty
   */
  undoImply(implications: SudokuImplication[]) {
    for (const imp of implications) {
      const [row, col] = imp.cell;
      this.grid[row][col] = this.empty;
    }
  }

  /**
   * Find an empty cell. Return tuple of (row, col) else null
   */
  findEmpty(cell: CellTuple | null) {
    if (cell) {
      let [row, col] = cell;
      for (let i = row; i < this.size; ++i) {
        for (let j = col; j < this.size; ++j)
          if (this.grid[i][j] === this.empty) return [i, j] as CellTuple;

        col = 0;
      }
    }

    return null;
  }

  /**
   * Return next cell indices
   */
  next(cell: CellTuple) {
    let [row, col] = cell;
    if (col === this.size - 1) {
      row = row + 1;
      col = 0;
    } else {
      col += 1;
    }

    return [row, col] as CellTuple;
  }

  /**
   * Check if cell with number is promising
   */
  isPromising(row: number, col: number, number: number) {
    return (
      this.notInRow(row, number) &&
      this.notInCol(col, number) &&
      this.notInBox(row, col, number) &&
      this.grid[row][col] === this.empty
    );
  }

  /**
   * Check number is not in row
   */
  notInRow(row: number, number: number) {
    return !this.grid[row].includes(number);
  }

  /**
   * Check number is not in column
   */
  notInCol(col: number, number: number) {
    for (let i = 0; i < this.size; ++i)
      if (this.grid[i][col] === number) return false;
    return true;
  }

  /**
   * Check number is not in box
   */
  notInBox(row: number, col: number, number: number) {
    row = row - (row % this.subgrid);
    col = col - (col % this.subgrid);

    for (let i = row; i < row + this.subgrid; ++i)
      for (let j = col; j < col + this.subgrid; ++j)
        if (this.grid[i][j] === number) return false;
    return true;
  }

  /**
   * Verify sudoku grid is solved
   */
  verify() {
    const pset = new Set<number>();
    const pSize = this.size + 1;
    for (let i = 1; i < pSize; ++i) pset.add(i);

    for (let i = 0; i < this.size; ++i) {
      // Test row
      const rowSet = new Set<number>([...pset]);
      for (let col = 0; col < this.size; ++col) {
        const number = this.grid[i][col];
        if (rowSet.has(number)) rowSet.delete(number);
        else return false;
      }

      // Test col
      const colSet = new Set<number>([...pset]);
      for (let row = 0; row < this.size; ++row) {
        const number = this.grid[row][i];
        if (colSet.has(number)) colSet.delete(number);
        else return false;
      }

      // Test subsgrid
      const subgridSet = new Set<number>([...pset]);
      const y = this.subgrid * Math.floor(i / this.subgrid);
      const x = this.subgrid * (i % this.subgrid);
      for (let row = y; row < y + this.subgrid; ++row) {
        for (let col = x; col < x + this.subgrid; ++col) {
          const number = this.grid[row][col];
          if (subgridSet.has(number)) subgridSet.delete(number);
          else return false;
        }
      }
    }

    return true;
  }
}

type CellTuple = [number, number];

export default SudokuSolver;
