import crypto from 'crypto';
import { HashAlgorithms } from '../types';

export function createHash(algo: HashAlgorithms, data: string) {
  return crypto.createHash(algo).update(data).digest('hex');
}
