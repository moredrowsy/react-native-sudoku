import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppOptions } from '../../types';

const storageName = 'options';
const OPTIONS_STORGE_KEY = `Sudoku:${storageName}`;

export async function getOptions() {
  const item = await AsyncStorage.getItem(OPTIONS_STORGE_KEY);
  return item ? (JSON.parse(item) as AppOptions) : null;
}

// Only add game if it does not exist
export async function setOptions(status: AppOptions) {
  return AsyncStorage.setItem(OPTIONS_STORGE_KEY, JSON.stringify(status));
}
