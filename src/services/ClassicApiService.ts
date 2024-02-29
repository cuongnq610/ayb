/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosInstance } from '@/config/http';

export const getApiHistoryClassic = async (address: `0x${string}` | undefined) => {
  const res = await axiosInstance.get(`classic/${address}`);
  return res.data;
};

export const getAllRoundsClassic = async () => {
  const res = await axiosInstance.get('/classicRounds/allRounds');
  return res.data;
};


export const postUserBet = async (body: any) => {
  const res = await axiosInstance.post('classicRounds', body);
  return res;
};

export const getUserRounds = async (address: `0x${string}` | undefined) => {
  const res = await axiosInstance.get(`/classicRounds/getUserRounds/${address}`);
  return res.data;
};

export const getPrizePoolApi = async (epoch : number) => {
  const res = await axiosInstance.get(`/classicRounds/getPrizePool/${epoch}`);
  return res.data;
};