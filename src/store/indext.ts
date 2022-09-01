
import { Action, combineReducers, configureStore, ThunkAction } from '@reduxjs/toolkit';
import githubSliceReducer from '../features/github/githubSlice';
import storage from 'redux-persist/lib/storage'
import {
  persistReducer,
  PERSIST,
} from 'redux-persist'

const persistConfig = {
  key: 'root',
  storage
};

const reducers= combineReducers({
  github: githubSliceReducer,
});
const persistedReducer = persistReducer(persistConfig,reducers );

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [ PERSIST],
      },
    }),
})

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
