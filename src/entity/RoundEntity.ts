/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusRoundEnum } from '@/constants/constants';
import { TokenEntity } from './TokenEntity';

export interface RoundEntity {
  tokenAddress: string;
  symbol: string;
  epoch: number;
  status: StatusRoundEnum;
  startTimestamp: number;
  lockTimestamp: number;
  closeTimestamp: number;
  lockPrice: number;
  closePrice: number;
  lockOracleId: bigint;
  closeOracleId: bigint;
  totalBetAmount: string;
  totalBetUpAmount: string;
  totalBetDownAmount: string;
  globalBetAmount: string;
  globalBetUpAmount: string;
  globalBetDownAmount: string;
  isUp: boolean;
  participantCount: number;
  upParticipantCount: number;
  downParticipantCount: number;
  winners: string[];
  losers: string[];
  txs: string[];
  _id: string;
}

export interface RoundPredictEntity {
  _id: string;
  token: TokenEntity;
  epoch: number;
  status: string;
  startTimestamp: number;
  lockTimestamp: number;
  closeTimestamp: number;
  participantCount: number;
  totalPredictAmount: number | string;
  totalPredictDownAmount: number | string;
  totalPredictUpAmount: number | string;
  participants: any;
  upParticipants: any;
  leaderboard: string;
  downParticipants: any;
}
