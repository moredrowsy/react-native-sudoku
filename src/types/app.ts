import { ThemeNames } from '../types';

export interface AppStatus {
  isLoggedIn: boolean;
  userId?: string | null;
  loading: boolean;
  statusBarVisible: boolean;
}

export interface AppOptions {
  showHints: boolean;
  showReveal: boolean;
  themeName: ThemeNames;
}
