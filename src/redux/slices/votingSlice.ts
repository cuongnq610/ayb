import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { TVotingItem } from '@/views/referral/index.definition';

interface IVotingSlice {
  selectedVotingList: TVotingItem[];
  isVoted: boolean;
  totalVotes: number;
}

const initialState: IVotingSlice = {
  selectedVotingList: [],
  isVoted: false,
  totalVotes: 0,
};

export const votingSlice = createSlice({
  name: 'voting-slice',
  initialState,
  reducers: {
    setSelectedVotingList: (state, action: PayloadAction<TVotingItem[]>) => {
      state.selectedVotingList = action.payload;
    },
    addSelectedVoting: (state, action: PayloadAction<TVotingItem>) => {
      state.selectedVotingList.push(action.payload);
    },
    removeSelectedVoting: (state, action: PayloadAction<TVotingItem>) => {
      state.selectedVotingList = state.selectedVotingList.filter((item) => item._id !== action.payload._id);
    },

    setIsVoted: (state, action: PayloadAction<boolean>) => {
      state.isVoted = action.payload;
    },

    setTotalVotes: (state, action: PayloadAction<number>) => {
      state.totalVotes = action.payload;
    },
  },
});

export const { setSelectedVotingList, addSelectedVoting, removeSelectedVoting, setIsVoted, setTotalVotes } =
  votingSlice.actions;

export const votingSelector = (state: RootState) => state.voting;

export const votingReducer = votingSlice.reducer;
