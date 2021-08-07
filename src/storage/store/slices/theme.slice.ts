import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '..';
import * as LocalStorage from '../../local-storage';
import { Theme, ThemeNames, themes } from '../../../styles';

const sliceName = 'theme';
const initialState: Theme = themes['blue'];

// SLICE
const theme = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    setThemeType: (state, action: PayloadAction<ThemeNames>) => {
      if (action.payload in themes) return themes[action.payload];
    },
  },
});

export const { setThemeType } = theme.actions;

// SELECTOR
export const selectOptions = (state: RootState) => state.theme;

// ASYNC ACTIONS

export default theme.reducer;
