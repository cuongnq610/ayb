import { configureStore } from '@reduxjs/toolkit';
import { gameReducer } from '@/redux/slices/gameSlice';
import { votingReducer } from './slices/votingSlice';

export const store = configureStore({
  reducer: {
    game: gameReducer,
    voting: votingReducer,
  },
  // devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
