import AsyncStorage from '@react-native-async-storage/async-storage';
import * as options from './options.local-storage';
import * as status from './status.local-storage';
import * as sudokus from './sudokus.local-storage';
import * as users from './users';

export { options, status, sudokus, users };

export function clearAll() {
  return AsyncStorage.clear();
}
