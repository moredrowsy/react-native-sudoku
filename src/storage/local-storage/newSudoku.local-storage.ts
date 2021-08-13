import AsyncStorage from '@react-native-async-storage/async-storage';
import { SudokuGameEntity } from '../../types';

const storageName = 'newSudoku';
const NEW_SUDOKU_STORGE_KEY = `Sudoku:${storageName}`;

export async function getNewSudoku() {
  const item = await AsyncStorage.getItem(NEW_SUDOKU_STORGE_KEY);
  return item ? (JSON.parse(item) as SudokuGameEntity) : null;
}

export async function removeNewSudoku() {
  return AsyncStorage.removeItem(NEW_SUDOKU_STORGE_KEY);
}

export async function setNewSudoku(newSudoku: SudokuGameEntity) {
  return AsyncStorage.setItem(NEW_SUDOKU_STORGE_KEY, JSON.stringify(newSudoku));
}
