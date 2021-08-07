import { createSudokuGame } from '../../sudoku';
import { SudokuGameEntity } from '../../types';
import DATA from './_DATA';

// TODO: Data is mocked. Make backend api endpoints to fetch new sudoku games

export function getSudokuGameRecord(
  excludeIds: string[]
): Promise<Record<string, SudokuGameEntity>> {
  const excludeThese = new Set(excludeIds);
  const sudokus: Record<string, SudokuGameEntity> = {};

  for (const { id, data, solution } of Object.values(DATA)) {
    if (!excludeThese.has(id)) {
      const sudoku = createSudokuGame(id, data, solution);
      sudokus[sudoku.id] = sudoku;
    }
  }
  return new Promise((resolve) => resolve(sudokus));
}
