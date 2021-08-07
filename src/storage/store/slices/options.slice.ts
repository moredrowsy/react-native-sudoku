import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '..';
import * as LocalStorage from '../../local-storage';
import { AppOptions } from '../../../types/app';
import { ThemeNames } from '../../../styles';
import { setThemeType } from './theme.slice';

const sliceName = 'options';
const initialState: AppOptions = {
  showHints: true,
  themeName: 'blue',
};

// SLICE
const options = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    setOptions: (state, action: PayloadAction<AppOptions>) => {
      return action.payload;
    },
    setShowHints: (state, action: PayloadAction<boolean>) => {
      state.showHints = action.payload;
    },
    setThemeName: (state, action: PayloadAction<ThemeNames>) => {
      state.themeName = action.payload;
    },
  },
});

export const { setOptions, setShowHints, setThemeName } = options.actions;

// SELECTOR
export const selectOptions = (state: RootState) => state.options;

// ASYNC ACTIONS
export const setShowHintsAsync =
  (
    showHints: boolean,
    onSuccess?: () => void,
    onError?: (msg: string) => void
  ): AppThunk =>
  async (dispatch, getState) => {
    try {
      const options = selectOptions(getState());
      LocalStorage.options.setOptions({ ...options, showHints });
      dispatch(setShowHints(showHints));

      if (onSuccess) onSuccess();
    } catch (e: unknown) {
      if (onError) {
        if (e instanceof Error) onError(e.message);
        else if (typeof e === 'string') onError(e);
        else onError('Error');
      }
    }
  };

export const setThemeNameAsync =
  (
    themeName: ThemeNames,
    onSuccess?: () => void,
    onError?: (msg: string) => void
  ): AppThunk =>
  async (dispatch, getState) => {
    try {
      const options = selectOptions(getState());
      LocalStorage.options.setOptions({ ...options, themeName });
      dispatch(setThemeName(themeName));
      dispatch(setThemeType(themeName));

      if (onSuccess) onSuccess();
    } catch (e: unknown) {
      if (onError) {
        if (e instanceof Error) onError(e.message);
        else if (typeof e === 'string') onError(e);
        else onError('Error');
      }
    }
  };

export const initAppOptionsAsync =
  (onSuccess?: () => void, onError?: (msg: string) => void): AppThunk =>
  async (dispatch, getState) => {
    try {
      const options = await LocalStorage.options.getOptions();
      if (options) {
        dispatch(setOptions(options));
        dispatch(setThemeType(options.themeName));
      }

      if (onSuccess) onSuccess();
    } catch (e: unknown) {
      if (onError) {
        if (e instanceof Error) onError(e.message);
        else if (typeof e === 'string') onError(e);
        else onError('Error');
      }
    }
  };

export default options.reducer;
