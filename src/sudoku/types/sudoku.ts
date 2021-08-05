export interface SudokuRawData {
  id: string;
  data: number[][];
  solution?: number[][];
}

export interface CellEntity {
  col: number;
  row: number;
}

export interface SudokuCellEntity extends CellEntity {
  value: number;
  mutable: boolean;
  answer: number | null;
}

export interface ControllCellEntity {
  value: number;
  unique: boolean;
}

export interface SudokuGameEntity {
  id: string;
  board: SudokuCellEntity[][];
  defaultScore: number;
}

export interface SudokuGameForData extends SudokuGameEntity {
  solution?: number[][];
}

export interface SudokuGameForUser extends SudokuGameEntity {
  userScore: number;
  selectedCell: CellEntity;
}
