import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '..';
import * as LocalStorage from '../../local-storage';
import { addSudokuGameAsync } from '../slices/sudokus.slice';
import {
  EMPTY_BOARDS,
  restoreSudokuGameUser,
  sanitizeNewSudokuGame,
  updateSudokuCellValueAndScore,
} from '../../../sudoku';
import { SudokuCellEntity, SudokuGameEntity } from '../../../types';
import { cloneDeep } from 'lodash';

const sliceName = 'newSudoku';
const initialState: SudokuGameEntity = {
  id: '',
  board: EMPTY_BOARDS[9].map((rows, row) =>
    rows.map((cols, col) => ({
      col,
      row,
      value: 0,
      mutable: true,
      answer: undefined,
    }))
  ),
  defaultScore: 0,
  hasSolution: false,
  userScore: 0,
  selectedCell: null,
  showHints: false,
};

// SLICE
const newSudoku = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    setNewSudoku: (state, action: PayloadAction<SudokuGameEntity>) => {
      return action.payload;
    },
    resetNewSudokuGame: (
      state,
      action: PayloadAction<undefined | ((sudoku: SudokuGameEntity) => void)>
    ) => {
      restoreSudokuGameUser(state);
      if (action.payload) action.payload(state);
    },
    setNewSudokuHasSolution: (state, action: PayloadAction<boolean>) => {
      state.hasSolution = action.payload;
    },
    updateNewSudokuGameValue: (
      state,
      action: PayloadAction<{
        col: number;
        row: number;
        value: number;
        onSuccess?: (sudoku: SudokuGameEntity) => void;
      }>
    ) => {
      const { col, row, value, onSuccess } = action.payload;
      // Reset hasSolution flag before updating
      // Because changes might invalidate current hasSolution flag
      state.hasSolution = false;
      updateSudokuCellValueAndScore(state, col, row, value);
      if (onSuccess) onSuccess(state);
    },
    updateNewSudokuSelectedCell: (
      state,
      action: PayloadAction<SudokuCellEntity | null>
    ) => {
      state.selectedCell = action.payload;
    },
  },
});

export const {
  setNewSudoku,
  resetNewSudokuGame,
  setNewSudokuHasSolution,
  updateNewSudokuGameValue,
  updateNewSudokuSelectedCell,
} = newSudoku.actions;

// SELECTOR
export const selectNewSudoku = (state: RootState) => state.newSudoku;

// ASYNC ACTIONS
export const setNewSudokuAsync =
  (
    newSudoku: SudokuGameEntity,
    onSuccess?: () => void,
    onError?: (msg: string) => void
  ): AppThunk =>
  async (dispatch, getState) => {
    try {
      // TODO local storage
      dispatch(setNewSudoku(newSudoku));

      if (onSuccess) onSuccess();
    } catch (e: unknown) {
      if (onError) {
        if (e instanceof Error) onError(e.message);
        else if (typeof e === 'string') onError(e);
        else onError('Error');
      }
    }
  };

export const resetNewSudokuGameAsync =
  (onSuccess?: () => void, onError?: (msg: string) => void): AppThunk =>
  async (dispatch) => {
    dispatch(
      resetNewSudokuGame((sudoku) =>
        LocalStorage.newSudoku.setNewSudoku(sudoku)
      )
    );

    try {
      if (onSuccess) onSuccess();
    } catch (e: unknown) {
      if (onError) {
        if (e instanceof Error) onError(e.message);
        else if (typeof e === 'string') onError(e);
        else onError('Error');
      }
    }
  };

export const updateNewSudokuGameValueAsync =
  (
    {
      col,
      row,
      value,
    }: {
      col: number;
      row: number;
      value: number;
    },
    onSuccess?: () => void,
    onError?: (msg: string) => void
  ): AppThunk =>
  async (dispatch) => {
    dispatch(
      updateNewSudokuGameValue({
        col,
        row,
        value,
        onSuccess: (sudoku) => LocalStorage.newSudoku.setNewSudoku(sudoku),
      })
    );

    try {
      if (onSuccess) onSuccess();
    } catch (e: unknown) {
      if (onError) {
        if (e instanceof Error) onError(e.message);
        else if (typeof e === 'string') onError(e);
        else onError('Error');
      }
    }
  };

export const createNewSudokuGameAsync =
  (onSuccess?: () => void, onError?: (msg: string) => void): AppThunk =>
  async (dispatch, getState) => {
    const newSudoku = cloneDeep(selectNewSudoku(getState()));
    sanitizeNewSudokuGame(newSudoku);
    dispatch(addSudokuGameAsync(newSudoku));

    try {
      if (onSuccess) onSuccess();
    } catch (e: unknown) {
      if (onError) {
        if (e instanceof Error) onError(e.message);
        else if (typeof e === 'string') onError(e);
        else onError('Error');
      }
    }
  };

export const initNewSudokuAsync =
  (onSuccess?: () => void, onError?: (msg: string) => void): AppThunk =>
  async (dispatch) => {
    const newSudoku = await LocalStorage.newSudoku.getNewSudoku();
    if (newSudoku) dispatch(setNewSudoku(newSudoku));

    try {
      if (onSuccess) onSuccess();
    } catch (e: unknown) {
      if (onError) {
        if (e instanceof Error) onError(e.message);
        else if (typeof e === 'string') onError(e);
        else onError('Error');
      }
    }
  };

export default newSudoku.reducer;
