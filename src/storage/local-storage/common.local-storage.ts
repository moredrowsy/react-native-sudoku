import AsyncStorage from '@react-native-async-storage/async-storage';

export function clearAll() {
  return AsyncStorage.clear();
}
