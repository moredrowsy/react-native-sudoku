import { createSudokuGameData, SudokuGameForData } from '../../sudoku';
import DATA from './_DATA';

// TODO: Data is mocked. Make backend api endpoints to fetch new sudoku games

export function getSudokuGameDataRecord(
  excludeIds: string[]
): Promise<Record<string, SudokuGameForData>> {
  const excludeThese = new Set(excludeIds);
  const sudokus: Record<string, SudokuGameForData> = {};

  for (const { id, data, solution } of Object.values(DATA)) {
    if (!excludeThese.has(id)) {
      const sudoku = createSudokuGameData(id, data, solution);
      sudokus[sudoku.id] = sudoku;
    }
  }
  return new Promise((resolve) => resolve(sudokus));
}
