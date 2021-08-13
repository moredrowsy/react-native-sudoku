import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '..';
import { cloneDeep } from 'lodash';
import * as API from '../../api';
import * as LocalStorage from '../../local-storage';

import { selectStatus, setStatus } from '../slices/status.slice';
import {
  getUserFromSudokuUser,
  restoreSudokuGameUser,
  updateSudokuCellValueAndScore,
} from '../../../sudoku';
import {
  AppStatus,
  SudokuCellEntity,
  SudokuGameEntity,
  SudokuUserEntity,
  UserEntity,
} from '../../../types';

const sliceName = 'users';
const initialState: Record<string, SudokuUserEntity> = {};

// SLICE
const users = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    // Only add user if it does not exist
    addUser: (state, action: PayloadAction<UserEntity>) => {
      const { username, name } = action.payload;

      if (!(username in state)) {
        const sudokuUser: SudokuUserEntity = { username, name, sudokus: {} };
        state[username] = sudokuUser;
      }
    },
    addSudokuUser: (state, action: PayloadAction<SudokuUserEntity>) => {
      const { username } = action.payload;

      if (!(username in state)) state[username] = action.payload;
    },
    // Only add game if it does not exist
    addSudokuGameToUser: (
      state,
      action: PayloadAction<{
        userId: string;
        sudoku: SudokuGameEntity;
      }>
    ) => {
      const { userId, sudoku } = action.payload;
      const deepCopy = cloneDeep(sudoku);
      if (userId in state) {
        const { sudokus } = state[userId];
        if (!(deepCopy.id in sudokus)) {
          sudokus[deepCopy.id] = deepCopy;
        }
      }
    },
    // Remove user in storage
    removeSudokuUser: (state, action: PayloadAction<string>) => {
      if (action.payload in state) delete state[action.payload];
    },
    // Remove game in storage
    removeSudokuGameFromUser: (
      state,
      action: PayloadAction<{ userId: string; sudokuId: string }>
    ) => {
      const { userId, sudokuId } = action.payload;

      if (userId in state && sudokuId in state[userId].sudokus)
        delete state[userId].sudokus[sudokuId];
    },
    removeSudokuGamesFromUser: (
      state,
      action: PayloadAction<{
        userId: string;
        sudokuIds: string[] | Set<string>;
      }>
    ) => {
      const { userId, sudokuIds } = action.payload;

      if (userId in state) {
        for (const sudokuId of sudokuIds) {
          if (sudokuId in state[userId].sudokus) {
            delete state[userId].sudokus[sudokuId];
          }
        }
      }

      return state;
    },
    // Reset game to default values and score
    resetSudokuGameFromUser: (
      state,
      action: PayloadAction<{
        userId: string;
        sudokuId: string;
        onSuccess?: (sudoku: SudokuGameEntity) => void;
      }>
    ) => {
      const { userId, sudokuId, onSuccess } = action.payload;

      if (userId in state && sudokuId in state[userId].sudokus) {
        const sudoku = state[userId].sudokus[sudokuId];
        restoreSudokuGameUser(sudoku);
        if (onSuccess) onSuccess(sudoku);
      }
    },
    // Overwrites original sudoku user
    saveSudokuUser: (state, action: PayloadAction<SudokuUserEntity>) => {
      const { username } = action.payload;
      if (username in state) state[username] = action.payload;
    },
    // Overwrites original sudoku user game
    saveSudokuGameToUser: (
      state,
      action: PayloadAction<{ userId: string; sudoku: SudokuGameEntity }>
    ) => {
      const { userId, sudoku } = action.payload;

      if (userId in state) state[userId].sudokus[sudoku.id] = sudoku;
    },
    updateSelectedCellForGame: (
      state,
      action: PayloadAction<{
        selectedCell: SudokuCellEntity | null;
        userId: string;
        sudokuId: string;
      }>
    ) => {
      const { selectedCell, sudokuId, userId } = action.payload;
      if (userId in state && sudokuId in state[userId].sudokus) {
        state[userId].sudokus[sudokuId].selectedCell = selectedCell;
        return state;
      }
    },
    updateShowHintsForGame: (
      state,
      action: PayloadAction<{
        userId: string;
        sudokuId: string;
        showHints: boolean;
        onSuccess?: (sudoku: SudokuGameEntity) => void;
      }>
    ) => {
      const { sudokuId, userId, onSuccess } = action.payload;
      if (userId && userId in state && sudokuId in state[userId].sudokus) {
        const sudoku = state[userId].sudokus[sudokuId];
        sudoku.showHints = action.payload.showHints;

        if (onSuccess) onSuccess(sudoku);
        return state;
      }
    },
    updateSudokuGameValue: (
      state,
      action: PayloadAction<{
        userId: string;
        sudokuId: string;
        col: number;
        row: number;
        value: number;
        onSuccess?: (sudoku: SudokuGameEntity) => void;
      }>
    ) => {
      const { userId, sudokuId, col, row, value, onSuccess } = action.payload;
      if (userId in state && sudokuId in state[userId].sudokus) {
        const sudoku = state[userId].sudokus[sudokuId];
        updateSudokuCellValueAndScore(sudoku, col, row, value);
        if (onSuccess) onSuccess(sudoku);
      }
    },
  },
});

export const {
  addUser,
  addSudokuUser,
  addSudokuGameToUser,
  removeSudokuUser,
  removeSudokuGameFromUser,
  removeSudokuGamesFromUser,
  resetSudokuGameFromUser,
  saveSudokuUser,
  saveSudokuGameToUser,
  updateSudokuGameValue,
  updateSelectedCellForGame,
  updateShowHintsForGame,
} = users.actions;

// SELECTOR
export const selectUsers = (state: RootState) => state.users;

// ASYNC ACTIONS
export const addUserAsync =
  (
    user: UserEntity,
    onSuccess?: () => void,
    onError?: (msg: string) => void
  ): AppThunk =>
  async (dispatch) => {
    try {
      LocalStorage.users.addUser(user);
      dispatch(addUser(user));

      if (onSuccess) onSuccess();
    } catch (e: unknown) {
      if (onError) {
        if (e instanceof Error) onError(e.message);
        else if (typeof e === 'string') onError(e);
        else onError('Error');
      }
    }
  };

export const addSudokuUserAsync =
  (
    sudokuUser: SudokuUserEntity,
    onSuccess?: () => void,
    onError?: (msg: string) => void
  ): AppThunk =>
  async (dispatch) => {
    try {
      LocalStorage.users.addUser(getUserFromSudokuUser(sudokuUser));
      dispatch(addSudokuUser(sudokuUser));

      if (onSuccess) onSuccess();
    } catch (e: unknown) {
      if (onError) {
        if (e instanceof Error) onError(e.message);
        else if (typeof e === 'string') onError(e);
        else onError('Error');
      }
    }
  };

export const addSudokuGameToUserAsync =
  (
    { userId, sudoku }: { userId: string; sudoku: SudokuGameEntity },
    onSuccess?: () => void,
    onError?: (msg: string) => void
  ): AppThunk =>
  async (dispatch) => {
    try {
      LocalStorage.users.addSudokuGameToUser(userId, sudoku);
      dispatch(addSudokuGameToUser({ userId, sudoku }));

      if (onSuccess) onSuccess();
    } catch (e: unknown) {
      if (onError) {
        if (e instanceof Error) onError(e.message);
        else if (typeof e === 'string') onError(e);
        else onError('Error');
      }
    }
  };

export const removeSudokuUserAsync =
  (
    id: string,
    onSuccess?: () => void,
    onError?: (msg: string) => void
  ): AppThunk =>
  async (dispatch) => {
    LocalStorage.users.removeUser(id);
    LocalStorage.users.removeAllSudokuGamesFromUser(id);
    dispatch(removeSudokuUser(id));

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

export const removeSudokuGameFromUserAsync =
  (
    { userId, sudokuId }: { userId: string; sudokuId: string },
    onSuccess?: () => void,
    onError?: (msg: string) => void
  ): AppThunk =>
  async (dispatch) => {
    LocalStorage.users.removeSudokuGameFromUser(userId, sudokuId);
    dispatch(removeSudokuGameFromUser({ userId, sudokuId }));

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

export const removeSudokuGamesFromUserAsync =
  (
    {
      userId,
      sudokuIds,
    }: { userId: string; sudokuIds: string[] | Set<string> },
    onSuccess?: () => void,
    onError?: (msg: string) => void
  ): AppThunk =>
  async (dispatch) => {
    LocalStorage.users.removeSudokuGamesFromUser(userId, sudokuIds);
    dispatch(removeSudokuGamesFromUser({ userId, sudokuIds }));

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

export const resetSudokuGameFromUserAsync =
  (
    { userId, sudokuId }: { userId: string; sudokuId: string },
    onSuccess?: () => void,
    onError?: (msg: string) => void
  ): AppThunk =>
  async (dispatch) => {
    dispatch(
      resetSudokuGameFromUser({
        userId,
        sudokuId,
        onSuccess: (sudoku) =>
          LocalStorage.users.saveSudokuGameToUser(userId, sudoku),
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

export const saveSudokuUserAsync =
  (
    sudokuUser: SudokuUserEntity,
    onSuccess?: () => void,
    onError?: (msg: string) => void
  ): AppThunk =>
  async (dispatch) => {
    LocalStorage.users.saveSudokuUser(sudokuUser);
    dispatch(saveSudokuUser(sudokuUser));

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

export const saveSudokuGameToUserAsync =
  (
    { userId, sudoku }: { userId: string; sudoku: SudokuGameEntity },
    onSuccess?: () => void,
    onError?: (msg: string) => void
  ): AppThunk =>
  async (dispatch) => {
    LocalStorage.users.saveSudokuGameToUser(userId, sudoku);
    dispatch(saveSudokuGameToUser({ userId, sudoku }));

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

export const setDefaultUsersAsync =
  (status: AppStatus): AppThunk =>
  async (dispatch) => {
    const username = 'Default';
    const defaultUser: UserEntity = { name: username, username };
    LocalStorage.users.addUser(defaultUser);

    const defaultSudokuUser: SudokuUserEntity = {
      ...defaultUser,
      sudokus: {},
    };
    dispatch(addSudokuUser(defaultSudokuUser));

    status.loading = false;
    status.userId = username;
  };

export const updateSudokuGameValueAsync =
  (
    {
      userId,
      sudokuId,
      col,
      row,
      value,
    }: {
      userId: string;
      sudokuId: string;
      col: number;
      row: number;
      value: number;
    },
    onSuccess?: () => void,
    onError?: (msg: string) => void
  ): AppThunk =>
  async (dispatch) => {
    dispatch(
      updateSudokuGameValue({
        userId,
        sudokuId,
        col,
        row,
        value,
        onSuccess: (sudoku) =>
          LocalStorage.users.saveSudokuGameToUser(userId, sudoku),
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

export const updateShowHintsForGameAsync =
  ({
    userId,
    sudokuId,
    showHints,
  }: {
    userId: string;
    sudokuId: string;
    showHints: boolean;
  }): AppThunk =>
  async (dispatch) => {
    dispatch(
      updateShowHintsForGame({
        userId,
        sudokuId,
        showHints,
        onSuccess: (sudoku) =>
          LocalStorage.users.saveSudokuGameToUser(userId, sudoku),
      })
    );
  };

export const initSudokuUserAsync =
  (onSuccess?: () => void, onError?: (msg: string) => void): AppThunk =>
  async (dispatch, getState) => {
    try {
      const status: AppStatus = cloneDeep(selectStatus(getState()));

      const localStoageStatus = await LocalStorage.status.getStatus();
      if (localStoageStatus) {
        const { userId } = localStoageStatus;

        if (userId) {
          const { user } = await LocalStorage.users.getUser(userId);
          if (user) {
            const sudokus = await LocalStorage.users.getUserGames(userId);
            const sudokuUser: SudokuUserEntity = { ...user, sudokus };
            dispatch(addSudokuUser(sudokuUser));

            status.userId = user.username;
            status.loading = false;
          } else await dispatch(setDefaultUsersAsync(status));
        } else await dispatch(setDefaultUsersAsync(status));
      } else await dispatch(setDefaultUsersAsync(status));

      LocalStorage.status.setStatus(status);
      dispatch(setStatus(status));

      if (onSuccess) onSuccess();
    } catch (e: unknown) {
      if (onError) {
        if (e instanceof Error) onError(e.message);
        else if (typeof e === 'string') onError(e);
        else onError('Error');
      }
    }
  };

export default users.reducer;
