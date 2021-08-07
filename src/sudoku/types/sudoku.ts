export interface SudokuRawData {
  id: string;
  data: number[][];
  solution?: number[][];
}

export interface CellEntity {
  col: number;
  row: number;
  value: number;
}

export interface SudokuCellEntity extends CellEntity {
  mutable: boolean;
  answer: number | undefined;
}

export interface ControllCellEntity {
  value: number;
  unique: boolean;
}

export interface SudokuGameEntity {
  id: string;
  board: SudokuCellEntity[][];
  defaultScore: number;
  hasSolution: boolean;
  userScore: number;
  selectedCell: CellEntity;
  showHints: boolean;
}
