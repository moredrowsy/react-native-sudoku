import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserEntity } from '../../../types';

const storageName = 'users';
const USERS_STORAGE_KEY = `Sudoku:${storageName}`;

export function getUserStorageKey(id: string) {
  return `${USERS_STORAGE_KEY}:${id}`;
}

export async function getUser(userId: string) {
  const key = getUserStorageKey(userId);
  const item = await AsyncStorage.getItem(key);
  return {
    user: item ? (JSON.parse(item) as UserEntity) : null,
    key,
  };
}

// Only add user if it does not exist
export async function addUser(user: UserEntity) {
  const key = getUserStorageKey(user.username);
  const item = await AsyncStorage.getItem(key);

  if (!item) {
    return AsyncStorage.setItem(key, JSON.stringify(user));
  }
}

// Remove user in storage
export async function removeUser(userId: string) {
  const key = getUserStorageKey(userId);
  return AsyncStorage.removeItem(key);
}

// Overwrites original user
export async function saveUser(user: UserEntity) {
  const key = getUserStorageKey(user.username);
  return AsyncStorage.setItem(key, JSON.stringify(user));
}
