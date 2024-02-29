/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosInstance } from '@/config/http';

export const getTokens = async () => {
  const res = await axiosInstance.get('tokens');
  return res.data;
};

export const getRounds = async () => {
  const res = await axiosInstance.get('rounds'); // TODO(KEVIN): NOW
  return res.data;
  // return [ // TODO(KEVIN): NOW - REMOVE THIS MOCK
  //   {
  //     _id: "657358fd2f62ca1f5969c03f",
  //     status: "OPEN",
  //     downParticipants: [
  //     ],
  //     participants: [
  //     ],
  //     upParticipants: [
  //     ],
  //   },
  //   {
  //     _id: "657358fd2f62ca1f5969c03e",
  //     status: "OPEN",
  //     downParticipants: [
  //     ],
  //     participants: [
  //     ],
  //     upParticipants: [
  //     ],
  //     leaderboard: "[]",
  //   },
  //   {
  //     _id: "65728d602f62ca1f592f0178",
  //     status: "OPEN",
  //     downParticipants: [
  //     ],
  //     participants: [
  //     ],
  //     upParticipants: [
  //     ],
  //   },
  //   {
  //     _id: "65728d602f62ca1f592f0177",
  //     status: "OPEN",
  //     downParticipants: [
  //     ],
  //     participants: [
  //     ],
  //     upParticipants: [
  //     ],
  //     leaderboard: "[]",
  //   },
  //   {
  //     _id: "65728c2b2f62ca1f592e87f1",
  //     status: "FINALIZED",
  //     downParticipants: [
  //     ],
  //     participants: [
  //     ],
  //     upParticipants: [
  //     ],
  //   },
  //   {
  //     _id: "65728c2b2f62ca1f592e87f0",
  //     status: "LOCKED",
  //     downParticipants: [
  //     ],
  //     participants: [
  //     ],
  //     upParticipants: [
  //     ],
  //     leaderboard: "[]",
  //   },
  // ];
};

export const postUserRounds = async (body: any) => {
  const res = await axiosInstance.post('user-rounds', body);
  return res;
};

export const postUpdateTX = async (body: any) => {
  const res = await axiosInstance.post('user-rounds/updatetx', body);
  return res;
};

export const postHistory = async (body: any) => {
  const res = await axiosInstance.post('user-rounds/getHistory', body);
  return res.data;
};

export const postProof = async (body: any) => {
  const res = await axiosInstance.post('rounds/proof', body);
  return res.data;
};

export const getUserRounds = async (body: any) => {
  const res = await axiosInstance.get('user-rounds', body);
  return res.data;
};

export const getYourPrediction = async (body: any) => {
  // TODO(KEVIN):
  const res = await axiosInstance.post('user-rounds/getYourPrediction', body);
  return res.data;
};

export const updateClaimResult = async (body: any) => {
  const res = await axiosInstance.post('user-rounds/setClaimed', body);
  return res.data;
};

export const getPriceNewToken = async (tokenId : string) => {
  const res = await axiosInstance.get(`/price-feed/getPrice/${tokenId}`);
  return res.data;
};