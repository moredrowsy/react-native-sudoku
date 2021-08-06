import {
  SudokuCellEntity,
  SudokuGameEntity,
  SudokuUserEntity,
  UserEntity,
} from './types';
import { SUDOKU_EMPTY_CELL } from './constants';

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
    selectedCell: { col: -1, row: -1 },
    showHints: false,
  };

  return sudoku;
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
  sudoku.selectedCell = { col: -1, row: -1 };

  return sudoku;
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

  return sudoku;
}

export function getUserFromSudokuUser(sudokuUser: SudokuUserEntity) {
  const user: UserEntity = {
    name: sudokuUser.name,
    username: sudokuUser.username,
  };
  return user;
}

export function getCellSize(
  dimension: number,
  boardSize: number,
  margin: number
) {
  const sepSzie = Math.sqrt(boardSize) - 1;
  let cellSize = dimension / boardSize;
  cellSize -= (boardSize - sepSzie + 1) * margin;

  return cellSize;
}

function isInSudokuSubgrid(
  col: number,
  row: number,
  number: number,
  board: SudokuCellEntity[][]
) {
  const rootSize = Math.sqrt(board.length);
  const rowIdx = row - (row % rootSize);
  const colIdx = col - (col % rootSize);

  for (let i = rowIdx; i < rowIdx + rootSize; ++i)
    for (let j = colIdx; j < colIdx + rootSize; ++j)
      if (board[i][j].value === number) return true;

  return false;
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

export function copySudokuGameSolution(
  sourceGame: SudokuGameEntity,
  targetGame: SudokuGameEntity
) {
  const sourceBoard = sourceGame.board;
  const targetBoard = targetGame.board;

  if (sourceBoard.length === targetBoard.length) {
    for (let i = 0; i < sourceBoard.length; ++i) {
      for (let j = 0; j < sourceBoard.length; ++j) {
        targetBoard[i][j].answer = sourceBoard[i][j].answer;
      }
    }
  }
  targetGame.hasSolution;
}
