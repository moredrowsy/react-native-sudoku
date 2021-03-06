import { v5 as uuidv5 } from 'uuid';
import {
  CellEntity,
  SudokuCellEntity,
  SudokuGameEntity,
  SudokuUserEntity,
  UserEntity,
} from '../types';
import { SUDOKU_EMPTY_CELL } from './constants';

export function copySudokuGameSolution(
  sourceGame: SudokuGameEntity,
  targetGame: SudokuGameEntity
) {
  const sourceGrid = sourceGame.board;
  const targetGrid = targetGame.board;

  if (sourceGrid.length === targetGrid.length) {
    for (let i = 0; i < sourceGrid.length; ++i) {
      for (let j = 0; j < sourceGrid.length; ++j) {
        targetGrid[i][j].answer = sourceGrid[i][j].answer;
      }
    }
  }
  targetGame.hasSolution;
}

export function createSudokuGame(
  id: string,
  data: number[][],
  solution?: number[][]
) {
  const board: SudokuCellEntity[][] = [];
  let score = 0;

  for (let i = 0; i < data.length; ++i) {
    const row = [];

    for (let j = 0; j < data.length; ++j) {
      const cell: SudokuCellEntity = {
        col: j,
        row: i,
        value: data[i][j],
        mutable: data[i][j] === SUDOKU_EMPTY_CELL,
        answer: solution ? solution[i][j] : undefined,
      };
      row.push(cell);

      if (data[i][j] !== SUDOKU_EMPTY_CELL) ++score;
    }
    board.push(row);
  }

  const sudoku: SudokuGameEntity = {
    id,
    board,
    defaultScore: score,
    hasSolution: solution ? true : false,
    userScore: score,
    selectedCell: null,
    showHints: false,
  };

  return sudoku;
}

// Create unique id based on uuid v5 with namepsace URL
function createUniqueID(str: string) {
  return uuidv5(str, uuidv5.URL);
}

export function getAvailableCells(
  col: number,
  row: number,
  board: SudokuCellEntity[][]
) {
  const unique = new Set<number>();
  for (let i = 1; i <= board.length; ++i) unique.add(i);

  // Check against col and row values
  for (let i = 0; i < board.length; ++i) unique.delete(board[i][col].value);
  for (let i = 0; i < board.length; ++i) unique.delete(board[row][i].value);

  // Check against box
  const leftOver = [...unique];
  for (const i of leftOver)
    if (isInSudokuSubgrid(col, row, i, board)) unique.delete(i);

  return unique;
}

export function getRawDataFromSudokuGame(sudoku: SudokuGameEntity) {
  const data = [];
  const { board } = sudoku;
  for (let i = 0; i < board.length; ++i) {
    const row = [];
    for (let j = 0; j < board.length; ++j) row.push(board[i][j].value);
    data.push(row);
  }
  return data;
}

export function getUserFromSudokuUser(sudokuUser: SudokuUserEntity) {
  const user: UserEntity = {
    name: sudokuUser.name,
    username: sudokuUser.username,
  };
  return user;
}

function isInSudokuSubgrid(
  col: number,
  row: number,
  number: number,
  board: SudokuCellEntity[][]
) {
  const subgridSize = Math.sqrt(board.length);
  const rowIdx = row - (row % subgridSize);
  const colIdx = col - (col % subgridSize);

  for (let i = rowIdx; i < rowIdx + subgridSize; ++i)
    for (let j = colIdx; j < colIdx + subgridSize; ++j)
      if (board[i][j].value === number) return true;

  return false;
}

export function getIsCellInSelected(
  cell: CellEntity,
  selCel: CellEntity | null,
  boardSize: number
) {
  if (selCel) {
    let isInCol = false;
    let isInRow = false;

    const subgridSize = Math.sqrt(boardSize);
    const colIdx = cell.col - (cell.col % subgridSize);
    const rowIdx = cell.row - (cell.row % subgridSize);
    const selColIdx = selCel.col - (selCel.col % subgridSize);
    const selRowIdx = selCel.row - (selCel.row % subgridSize);
    isInCol = colIdx === selColIdx;
    isInRow = rowIdx === selRowIdx;

    return (
      cell.col === selCel.col || cell.row === selCel.row || (isInCol && isInRow)
    );
  } else return false;
}

export function restoreSudokuGameUser(sudoku: SudokuGameEntity) {
  const board = sudoku.board;
  for (let i = 0; i < board.length; ++i) {
    for (let j = 0; j < board.length; ++j) {
      if (board[i][j].mutable) {
        board[i][j].value = SUDOKU_EMPTY_CELL;
      }
    }
  }
  sudoku.userScore = sudoku.defaultScore;
  sudoku.selectedCell = null;

  return sudoku;
}

export function sanitizeNewSudokuGame(sudoku: SudokuGameEntity) {
  const rawData: number[][] = [];

  sudoku.defaultScore = 0;
  sudoku.hasSolution = false;
  sudoku.selectedCell = null;
  sudoku.showHints = false;

  const { board } = sudoku;
  for (let i = 0; i < board.length; ++i) {
    const row: number[] = [];
    for (let j = 0; j < board.length; ++j) {
      if (board[i][j].value !== SUDOKU_EMPTY_CELL) {
        board[i][j].mutable = false;
        ++sudoku.defaultScore;
      }
      row.push(board[i][j].value);
    }
    rawData.push(row);
  }

  // Generate and assign unique ID based on the the raw data array
  sudoku.id = createUniqueID(JSON.stringify(rawData));

  sudoku.userScore = sudoku.defaultScore;
}

export function setSudokuGameSolutionFromCurrentValues(
  sudoku: SudokuGameEntity
) {
  const { board } = sudoku;
  for (let i = 0; i < board.length; ++i) {
    for (let j = 0; j < board.length; ++j) {
      board[i][j].answer = board[i][j].value;
    }
  }
  sudoku.hasSolution = true;
}

export function updateSudokuCellValueAndScore(
  sudoku: SudokuGameEntity,
  col: number,
  row: number,
  value: number
) {
  const { board } = sudoku;
  const oldValue = board[row][col].value;

  // Update value
  board[row][col].value = value;

  // Update score based on old and new value
  if (oldValue === SUDOKU_EMPTY_CELL && value !== SUDOKU_EMPTY_CELL) {
    ++sudoku.userScore;
  } else if (oldValue !== SUDOKU_EMPTY_CELL && value === SUDOKU_EMPTY_CELL) {
    --sudoku.userScore;
  }

  if (
    !sudoku.hasSolution &&
    sudoku.userScore === sudoku.board.length * sudoku.board.length
  ) {
    setSudokuGameSolutionFromCurrentValues(sudoku);
  }

  // Updeate selectedCell if the cell to update is the same
  if (
    sudoku.selectedCell &&
    sudoku.selectedCell.col === col &&
    sudoku.selectedCell.row === row
  ) {
    sudoku.selectedCell = board[row][col];
  }

  return sudoku;
}
