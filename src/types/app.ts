import { ThemeNames } from '../types';

export interface AppStatus {
  isLoggedIn: boolean;
  userId?: string;
  loading: boolean;
}

export interface AppOptions {
  showHints: boolean;
  showReveal: boolean;
  themeName: ThemeNames;
}
