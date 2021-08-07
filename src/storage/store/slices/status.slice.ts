import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '..';
import * as LocalStorage from '../../local-storage';
import { AppStatus } from '../../../types';

const sliceName = 'status';
const initialState: AppStatus = {
  isLoggedIn: false,
  loading: true,
  userId: null,
};

// SLICE
const status = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },
    setLoadingStatus: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setLogInStatus: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },
    setStatus: (state, action: PayloadAction<AppStatus>) => {
      return action.payload;
    },
  },
});

export const { setCurrentUser, setLoadingStatus, setLogInStatus, setStatus } =
  status.actions;

// SELECTOR
export const selectStatus = (state: RootState) => state.status;

// ASYNC ACTIONS
export const setCurrentUserAsync =
  (
    userId: string,
    onSuccess?: () => void,
    onError?: (msg: string) => void
  ): AppThunk =>
  async (dispatch, getState) => {
    try {
      const status = selectStatus(getState());
      LocalStorage.status.setStatus({ ...status, userId });
      dispatch(setCurrentUser(userId));

      if (onSuccess) onSuccess();
    } catch (e: unknown) {
      if (onError) {
        if (e instanceof Error) onError(e.message);
        else if (typeof e === 'string') onError(e);
        else onError('Error');
      }
    }
  };

export const setLoadingAsync =
  (
    loading: boolean,
    onSuccess?: () => void,
    onError?: (msg: string) => void
  ): AppThunk =>
  async (dispatch, getState) => {
    try {
      const status = selectStatus(getState());
      LocalStorage.status.setStatus({ ...status, loading });
      dispatch(setLoadingStatus(loading));

      if (onSuccess) onSuccess();
    } catch (e: unknown) {
      if (onError) {
        if (e instanceof Error) onError(e.message);
        else if (typeof e === 'string') onError(e);
        else onError('Error');
      }
    }
  };

export const setLoginStatusAsync =
  (
    isLoggedIn: boolean,
    onSuccess?: () => void,
    onError?: (msg: string) => void
  ): AppThunk =>
  async (dispatch, getState) => {
    try {
      const status = selectStatus(getState());
      LocalStorage.status.setStatus({ ...status, isLoggedIn });
      dispatch(setLogInStatus(isLoggedIn));

      if (onSuccess) onSuccess();
    } catch (e: unknown) {
      if (onError) {
        if (e instanceof Error) onError(e.message);
        else if (typeof e === 'string') onError(e);
        else onError('Error');
      }
    }
  };

export const setStatusAsync =
  (
    status: AppStatus,
    onSuccess?: () => void,
    onError?: (msg: string) => void
  ): AppThunk =>
  async (dispatch, getState) => {
    try {
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

export default status.reducer;
