import { SudokuGameForUser } from './sudoku';

export interface UserEntity {
  name: string;
  username: string;
}

export interface SudokuUserEntity extends UserEntity {
  sudokus: Record<string, SudokuGameForUser>;
}
