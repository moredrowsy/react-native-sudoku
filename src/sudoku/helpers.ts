import { cloneDeep } from 'lodash';
import {
  SudokuCellEntity,
  SudokuGameForData,
  SudokuGameEntity,
  SudokuGameForUser,
  SudokuUserEntity,
  UserEntity,
} from './types';
import { SUDOKU_EMPTY_CELL } from './constants';

export function createSudokuGame(id: string, data: number[][]) {
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
        answer: data[i][j],
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
  };

  return sudoku;
}

export function createSudokuGameData(
  id: string,
  data: number[][],
  solution?: number[][]
) {
  const sudoku = createSudokuGame(id, data);
  const sudokuGameData: SudokuGameForData = { ...sudoku, solution };
  return sudokuGameData;
}

export function restoreSudokuGameUser(sudoku: SudokuGameForUser) {
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
  sudoku: SudokuGameForUser,
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

  return sudoku;
}

export function getUserFromSudokuUser(sudokuUser: SudokuUserEntity) {
  const user: UserEntity = {
    name: sudokuUser.name,
    username: sudokuUser.username,
  };
  return user;
}

export function makeSudokuGameForUserFromGameForData(
  sudokuGmeData: SudokuGameForData
) {
  const sudokuShallow: SudokuGameForUser = {
    id: sudokuGmeData.id,
    board: sudokuGmeData.board,
    defaultScore: sudokuGmeData.defaultScore,
    userScore: sudokuGmeData.defaultScore,
    selectedCell: { col: -1, row: -1 },
  };
  return cloneDeep(sudokuShallow);
}

export function makeEmptyEmptyBoard(boardSize: number) {
  const board = [];
  for (let i = 0; i < boardSize; ++i) {
    const row = [];
    for (let j = 0; j < boardSize; ++j) row.push(null);
    board.push(row);
  }
  return board;
}

export function makeEmptySudokuRow(boardSize: number) {
  const cells = [];
  for (let i = 1; i <= boardSize; ++i) cells.push(i);
  return cells;
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

export function getAvailableCells(
  col: number,
  row: number,
  board: SudokuCellEntity[][]
) {
  const unique = new Set<number>();
  for (let i = 1; i <= board.length; ++i) unique.add(i);

  for (let i = 0; i < board.length; ++i) unique.delete(board[row][i].value);
  for (let i = 0; i < board.length; ++i) unique.delete(board[i][col].value);

  return unique;
}
