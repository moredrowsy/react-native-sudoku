import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserStorageKey } from './users.local-storage';
import {
  restoreSudokuGameUser,
  SudokuGameEntity,
  updateSudokuCellValueAndScore,
} from '../../../sudoku';

const storageName = 'games';

export function getUserGameStorageKey(userId: string, sudokuId?: string) {
  if (sudokuId)
    return `${getUserStorageKey(userId)}:${storageName}:${sudokuId}`;
  else return `${getUserStorageKey(userId)}:${storageName}`;
}

export async function getUserGame(userId: string, sudokuId: string) {
  const key = getUserGameStorageKey(userId, sudokuId);
  const item = await AsyncStorage.getItem(key);
  return {
    game: item ? (JSON.parse(item) as SudokuGameEntity) : null,
    key,
  };
}

export async function getUserGames(userId: string) {
  const key = getUserGameStorageKey(userId);
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
export async function addSudokuGameToUser(
  userId: string,
  sudoku: SudokuGameEntity
) {
  const key = getUserGameStorageKey(userId, sudoku.id);
  const item = await AsyncStorage.getItem(key);

  if (!item) {
    return AsyncStorage.setItem(key, JSON.stringify(sudoku));
  }
}

// Only add game if it does not exist
export async function addSudokuGameDataToUser(
  userId: string,
  sudoku: SudokuGameEntity
) {
  const key = getUserGameStorageKey(userId, sudoku.id);
  const item = await AsyncStorage.getItem(key);

  if (!item) {
    return AsyncStorage.setItem(key, JSON.stringify(sudoku));
  }
}

export async function removeSudokuGameFromUser(
  userId: string,
  sudokuId: string
) {
  const key = getUserGameStorageKey(userId, sudokuId);
  return AsyncStorage.removeItem(key);
}

export async function removeSudokuGamesFromUser(userId: string) {
  const key = getUserGameStorageKey(userId);
  const gameKeys = await AsyncStorage.getAllKeys();
  for (const gameKey of gameKeys) {
    if (gameKey.includes(key)) {
      AsyncStorage.removeItem(gameKey);
    }
  }
}

export async function resetSudokuGameFromUser(
  userId: string,
  sudokuId: string
) {
  const { key, game } = await getUserGame(userId, sudokuId);
  if (game) {
    restoreSudokuGameUser(game);
    return AsyncStorage.setItem(key, JSON.stringify(game));
  }
}

// Overwrites original game
export async function saveSudokuGameToUser(
  userId: string,
  sudoku: SudokuGameEntity
) {
  const key = getUserGameStorageKey(userId, sudoku.id);
  return AsyncStorage.setItem(key, JSON.stringify(sudoku));
}

export async function updateSudokuGameValue(
  userId: string,
  sudokuId: string,
  col: number,
  row: number,
  value: number
) {
  const { key, game } = await getUserGame(userId, sudokuId);
  if (game) {
    updateSudokuCellValueAndScore(game, col, row, value);
    return AsyncStorage.setItem(key, JSON.stringify(game));
  }
}
