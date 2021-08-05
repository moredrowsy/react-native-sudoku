import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppStatus } from '../../types';

const storageName = 'status';
const STATUS_STORGE_KEY = `Sudoku:${storageName}`;

export async function getStatus() {
  const item = await AsyncStorage.getItem(STATUS_STORGE_KEY);
  return item ? (JSON.parse(item) as AppStatus) : null;
}

// Only add game if it does not exist
export async function setStatus(status: AppStatus) {
  return AsyncStorage.setItem(STATUS_STORGE_KEY, JSON.stringify(status));
}
