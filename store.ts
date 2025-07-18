import { configureStore } from '@reduxjs/toolkit';
import mapReducer from './slices/mapSlice'; // Ensure this path is correct (due to Console Error)

export const store = configureStore({
  reducer: {
    map: mapReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;