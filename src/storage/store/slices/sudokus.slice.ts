import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '..';
import * as API from '../../api';
import * as LocalStorage from '../../local-storage';
import { SudokuGameForData } from '../../../sudoku';

const sliceName = 'sudokus';
const initialState: Record<string, SudokuGameForData> = {};

// SLICE
const sudokus = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    // Only add game if it does not exist
    addSudokuGameData: (state, action: PayloadAction<SudokuGameForData>) => {
      if (!(action.payload.id in state))
        state[action.payload.id] = action.payload;
    },
    // Remove game in storage
    removeSudokuGameData: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
    // Overwrites original game
    saveSudokuGameData: (state, action: PayloadAction<SudokuGameForData>) => {
      state[action.payload.id] = action.payload;
    },
    setSudokuGameDataRecord: (
      state,
      action: PayloadAction<Record<string, SudokuGameForData>>
    ) => {
      return action.payload;
    },
  },
});

export const {
  addSudokuGameData,
  removeSudokuGameData,
  saveSudokuGameData,
  setSudokuGameDataRecord,
} = sudokus.actions;

// SELECTOR
export const selectSudokus = (state: RootState) => state.sudokus;

// ASYNC ACTIONS
export const addSudokuGameDataAsync =
  (
    sudoku: SudokuGameForData,
    onSuccess?: () => void,
    onError?: (msg: string) => void
  ): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(addSudokuGameData(sudoku));
      LocalStorage.sudokus.addSudokuGameData(sudoku);

      if (onSuccess) onSuccess();
    } catch (e: unknown) {
      if (onError) {
        if (e instanceof Error) onError(e.message);
        else if (typeof e === 'string') onError(e);
        else onError('Error');
      }
    }
  };

export const removeSudokuGameDataAsync =
  (
    id: string,
    onSuccess?: () => void,
    onError?: (msg: string) => void
  ): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(removeSudokuGameData(id));
      LocalStorage.sudokus.removeSudokuGameData(id);

      if (onSuccess) onSuccess();
    } catch (e: unknown) {
      if (onError) {
        if (e instanceof Error) onError(e.message);
        else if (typeof e === 'string') onError(e);
        else onError('Error');
      }
    }
  };

export const saveSudokuGameDataAsync =
  (
    sudoku: SudokuGameForData,
    onSuccess?: () => void,
    onError?: (msg: string) => void
  ): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(saveSudokuGameData(sudoku));
      LocalStorage.sudokus.saveSudokuGameData(sudoku);

      if (onSuccess) onSuccess();
    } catch (e: unknown) {
      if (onError) {
        if (e instanceof Error) onError(e.message);
        else if (typeof e === 'string') onError(e);
        else onError('Error');
      }
    }
  };

export const initSudokuGameDataAsync =
  (onSuccess?: () => void, onError?: (msg: string) => void): AppThunk =>
  async (dispatch) => {
    try {
      const sudokusFromLocal =
        await LocalStorage.sudokus.getSudokuGameDataRecord();
      const currentGameIds = Object.keys(sudokusFromLocal);
      const sudokusFromRemote = await API.sudokus.getSudokuGameDataRecord(
        currentGameIds
      );

      // Merge both results
      const sudokus = sudokusFromLocal;
      for (const key in sudokusFromRemote) {
        if (key in sudokus) {
          if (!sudokus[key].solution && sudokusFromRemote[key].solution)
            sudokus[key] = sudokusFromRemote[key];
        } else sudokus[key] = sudokusFromRemote[key];
      }

      dispatch(setSudokuGameDataRecord(sudokus));

      if (onSuccess) onSuccess();
    } catch (e: unknown) {
      if (onError) {
        if (e instanceof Error) onError(e.message);
        else if (typeof e === 'string') onError(e);
        else onError('Error');
      }
    }
  };

export default sudokus.reducer;
