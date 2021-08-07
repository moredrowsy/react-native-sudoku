import { ThemeNames } from '../styles';

export interface AppStatus {
  isLoggedIn: boolean;
  userId: string | null;
  loading: boolean;
}

export interface AppOptions {
  showHints: boolean;
  themeName: ThemeNames;
}
