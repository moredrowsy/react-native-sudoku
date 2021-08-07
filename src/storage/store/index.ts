import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import options from './slices/options.slice';
import status from './slices/status.slice';
import theme from './slices/theme.slice';
import sudokus from './slices/sudokus.slice';
import users from './slices/users.slice';

export const store = configureStore({
  reducer: {
    options,
    status,
    theme,
    sudokus,
    users,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
export * from './slices';
