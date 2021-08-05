import AsyncStorage from '@react-native-async-storage/async-storage';
import { SudokuGameForData } from '../../sudoku';

const storageName = 'sudokus';
const SUDOKUS_STORAGE_KEY = `Sudoku:${storageName}`;

export function getSudokuGameStorageKey(id: string) {
  return `${SUDOKUS_STORAGE_KEY}:${id}`;
}

export async function getSudokuGameData(id: string) {
  const key = getSudokuGameStorageKey(id);
  const item = await AsyncStorage.getItem(key);
  return {
    sudoku: item ? (JSON.parse(item) as SudokuGameForData) : null,
    key,
  };
}

export async function getSudokuGameDataRecord() {
  const key = SUDOKUS_STORAGE_KEY;
  const gameKeys = await AsyncStorage.getAllKeys();
  const games: Record<string, SudokuGameForData> = {};

  for (const gamgameDataKey of gameKeys) {
    if (gamgameDataKey.includes(key)) {
      const item = await AsyncStorage.getItem(gamgameDataKey);

      if (item) {
        const sudoku: SudokuGameForData = await JSON.parse(item);

        if (sudoku) {
          games[sudoku.id] = sudoku;
        }
      }
    }
  }

  return games;
}

// Only add game if it does not exist
export async function addSudokuGameData(sudoku: SudokuGameForData) {
  const key = getSudokuGameStorageKey(sudoku.id);
  const item = await AsyncStorage.getItem(key);

  if (!item) {
    return AsyncStorage.setItem(key, JSON.stringify(sudoku));
  }
}

// Remove game in storage
export async function removeSudokuGameData(id: string) {
  const key = getSudokuGameStorageKey(id);
  return AsyncStorage.removeItem(key);
}

// Overwrites original game
export async function saveSudokuGameData(sudoku: SudokuGameForData) {
  const key = getSudokuGameStorageKey(sudoku.id);
  return AsyncStorage.setItem(key, JSON.stringify(sudoku));
}
