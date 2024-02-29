/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosInstance } from '@/config/http';

export const getAllVotings = async () => {
  const res = await axiosInstance.get(`/Voting/getAllVotings`);
  return res.data;
};

export const getAllVotedList = async (address: `0x${string}`) => {
  const res = await axiosInstance.get(`/Voting/getUserVotes/${address}`);
  return res.data;
};

export const createVotes = async (address: `0x${string}`, vote: string[]) => {
  const res = await axiosInstance.post(`/Voting/createVote/${address}`, undefined, { params: { vote } });
  return res.data;
};
// export const getAllRoundsClassic = async () => {
//   const res = await axiosInstance.get('/classicRounds/allRounds');
//   return res.data;
// };

// export const postUserBet = async (body: any) => {
//   const res = await axiosInstance.post('classicRounds', body);
//   return res;
// };

// export const getUserRounds = async (address: `0x${string}` | undefined) => {
//   const res = await axiosInstance.get(`/classicRounds/getUserRounds/${address}`);
//   return res.data;
// };

// export const getPrizePoolApi = async (epoch : number) => {
//   const res = await axiosInstance.get(`/classicRounds/getPrizePool/${epoch}`);
//   return res.data;
// };
