import AsyncStorage from '@react-native-async-storage/async-storage';
import * as status from './status.local-storage';
import * as sudokus from './sudokus.local-storage';
import * as users from './users';

export { status, sudokus, users };

export function clearAll() {
  return AsyncStorage.clear();
}
