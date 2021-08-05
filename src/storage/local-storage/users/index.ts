import { getUserFromSudokuUser, SudokuUserEntity } from '../../../sudoku';
import { addUser, saveUser } from './users.local-storage';
import {
  addSudokuGameToUser,
  saveSudokuGameToUser,
} from './users-games.local-storage';

export * from './users.local-storage';
export * from './users-games.local-storage';

export function addSudokuUser(sudokuUser: SudokuUserEntity) {
  const user = getUserFromSudokuUser(sudokuUser);
  addUser(user);
  const { sudokus } = sudokuUser;
  for (const sudokuId in sudokus) {
    addSudokuGameToUser(user.username, sudokus[sudokuId]);
  }
}

export function saveSudokuUser(sudokuUser: SudokuUserEntity) {
  const user = getUserFromSudokuUser(sudokuUser);
  saveUser(user);
  const { sudokus } = sudokuUser;
  for (const sudokuId in sudokus) {
    saveSudokuGameToUser(user.username, sudokus[sudokuId]);
  }
}
