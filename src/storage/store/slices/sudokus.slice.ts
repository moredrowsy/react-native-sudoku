import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '..';
import * as API from '../../api';
import * as LocalStorage from '../../local-storage';
import { SudokuGameEntity } from '../../../sudoku';

const sliceName = 'sudokus';
const initialState: Record<string, SudokuGameEntity> = {};

// SLICE
const sudokus = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    // Only add game if it does not exist
    addSudokuGameData: (state, action: PayloadAction<SudokuGameEntity>) => {
      if (!(action.payload.id in state))
        state[action.payload.id] = action.payload;
    },
    // Remove game in storage
    removeSudokuGameData: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
    // Overwrites original game
    saveSudokuGameData: (state, action: PayloadAction<SudokuGameEntity>) => {
      state[action.payload.id] = action.payload;
    },
    setSudokuGameDataRecord: (
      state,
      action: PayloadAction<Record<string, SudokuGameEntity>>
    ) => {
      return action.payload;
    },
    updateGameDataWithSolution: (
      state,
      action: PayloadAction<SudokuGameEntity>
    ) => {
      const sudoku = action.payload;
      if (sudoku.id in state && !state[sudoku.id].hasSolution) {
        const { board } = sudoku;
        for (let i = 0; i < board.length; ++i) {
          for (let j = 0; j < board.length; ++j) {
            state[sudoku.id].board[i][j].answer = board[i][j].answer;
          }
        }
        state[sudoku.id].hasSolution = true;
      }
    },
  },
});

export const {
  addSudokuGameData,
  removeSudokuGameData,
  saveSudokuGameData,
  setSudokuGameDataRecord,
  updateGameDataWithSolution,
} = sudokus.actions;

// SELECTOR
export const selectSudokus = (state: RootState) => state.sudokus;

// ASYNC ACTIONS
export const addSudokuGameDataAsync =
  (
    sudoku: SudokuGameEntity,
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
    sudoku: SudokuGameEntity,
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

export const updateGameDataWithSolutionAsync =
  (
    id: string,
    userId: string,
    onSuccess?: () => void,
    onError?: (msg: string) => void
  ): AppThunk =>
  async (dispatch, getState) => {
    try {
      const { sudokus, users } = getState();

      if (userId in users && id in sudokus && id in users[userId].sudokus) {
        const userSudoku = users[userId].sudokus[id];
        LocalStorage.sudokus.saveSudokuGameData(userSudoku);
        dispatch(updateGameDataWithSolution(userSudoku));
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

export const initSudokuGameDataAsync =
  (onSuccess?: () => void, onError?: (msg: string) => void): AppThunk =>
  async (dispatch) => {
    try {
      // LocalStorage.clearAll();
      const sudokusFromLocal = await LocalStorage.sudokus.getSudokuGameRecord();
      const currentGameIds = Object.keys(sudokusFromLocal);
      const sudokusFromRemote = await API.sudokus.getSudokuGameRecord(
        currentGameIds
      );

      // Merge both results
      const sudokus = sudokusFromLocal;
      for (const key in sudokusFromRemote) {
        if (key in sudokus) {
          if (!sudokus[key].hasSolution && sudokusFromRemote[key].hasSolution)
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
