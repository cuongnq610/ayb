import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

interface IGameSlice {
  isShowLiveAll: boolean;
  isShowHistory: boolean;
  closeTimestamp: number;
  isCalculate: boolean;
  userId?: string;
  pricePool: number;
}

const initialState: IGameSlice = {
  isShowLiveAll: false,
  isShowHistory: false,
  closeTimestamp: 0,
  isCalculate: false,
  userId: undefined,
  pricePool: 0,
};

export const gameSlice = createSlice({
  name: 'game-slice',
  initialState,
  reducers: {
    changeShowLiveAll: (state, action: PayloadAction<boolean>) => {
      state.isShowLiveAll = action.payload;
    },
    changeShowHistory: (state, action: PayloadAction<boolean>) => {
      state.isShowHistory = action.payload;
    },
    changeCloseTimestamp: (state, action: PayloadAction<number>) => {
      state.closeTimestamp = action.payload;
    },
    countDownCloseTimestamp: (state) => {
      if (state.closeTimestamp <= 0) {
        state.isCalculate = true;
        return;
      }
      state.isCalculate = false;
      state.closeTimestamp -= 1;
    },
    changeUserId: (state, action: PayloadAction<string | undefined>) => {
      state.userId = action.payload;
    },
    changePricePool: (state, action: PayloadAction<number>) => {
      state.pricePool = action.payload;
    },
  },
});

export const {
  changeShowLiveAll,
  changeShowHistory,
  changeCloseTimestamp,
  changePricePool,
  countDownCloseTimestamp,
  changeUserId,
} = gameSlice.actions;

export const gameSelector = (state: RootState) => state.game;

export const gameReducer = gameSlice.reducer;
