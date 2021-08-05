import AsyncStorage from '@react-native-async-storage/async-storage';
import { SudokuGameEntity } from '../../sudoku';

const storageName = 'sudokus';
const SUDOKUS_STORAGE_KEY = `Sudoku:${storageName}`;

export function getSudokuGameStorageKey(id: string) {
  return `${SUDOKUS_STORAGE_KEY}:${id}`;
}

export async function getSudokuGame(id: string) {
  const key = getSudokuGameStorageKey(id);
  const item = await AsyncStorage.getItem(key);
  return {
    sudoku: item ? (JSON.parse(item) as SudokuGameEntity) : null,
    key,
  };
}

export async function getSudokuGameRecord() {
  const key = SUDOKUS_STORAGE_KEY;
  const gameKeys = await AsyncStorage.getAllKeys();
  const games: Record<string, SudokuGameEntity> = {};

  for (const gameKey of gameKeys) {
    if (gameKey.includes(key)) {
      const item = await AsyncStorage.getItem(gameKey);

      if (item) {
        const sudoku: SudokuGameEntity = await JSON.parse(item);

        if (sudoku) {
          games[sudoku.id] = sudoku;
        }
      }
    }
  }

  return games;
}

// Only add game if it does not exist
export async function addSudokuGame(sudoku: SudokuGameEntity) {
  const key = getSudokuGameStorageKey(sudoku.id);
  const item = await AsyncStorage.getItem(key);

  if (!item) {
    return AsyncStorage.setItem(key, JSON.stringify(sudoku));
  }
}

// Remove game in storage
export async function removeSudokuGame(id: string) {
  const key = getSudokuGameStorageKey(id);
  return AsyncStorage.removeItem(key);
}

// Overwrites original game
export async function saveSudokuGame(sudoku: SudokuGameEntity) {
  const key = getSudokuGameStorageKey(sudoku.id);
  return AsyncStorage.setItem(key, JSON.stringify(sudoku));
}
