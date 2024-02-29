import { RoundEntity, RoundPredictEntity } from '@/entity/RoundEntity';

export interface UserRoundEntity {
  round: RoundEntity;
  hasClaimed: boolean;
  betUp: boolean;
  amount: number;
  reward: string | number;
  user: User;
}

export interface User {
  _id: string;
  address: string;
  roundEntered: Array<string>;
  roundLost: Array<string>;
  roundWon: Array<string>;
  totalBetAmount: string;
  totalLostAmount: string;
  totalWonAmount: string;
  bestWon: string;
  bestWonRate: number;
}

export interface UserRoundPredictionEntity {
  round: RoundPredictEntity;
  user: User;
  hasClaimed: boolean;
  isWinner: boolean;
  predictUp: boolean;
  reward: number;
  proof: string;
  predictAmount: number;
  priceAtPredict: string;
  predictPrice: string;
  actualPrice: string;
  tokenName: string;
  timestamp: number;
  tokenSymbol: string;
  rank: number;
  totalWinners: number;
  multiplier: number;
  childReward: number | string;
  result: number | string;
}

export interface HistoryPrediction {
  epoch: number;
  tokenId: string;
  predictAmount: string;
  predictPrice: string;
  predictUp: boolean;
  priceAtPredict: string;
  timestamp: number;
  resolveTimestamp: number;
  isValid: boolean;
  actualPrice: string;
  hasClaimed: boolean;
  isWinner: boolean;
  tokenName: string;
}


export interface NewUserRoundEntity {
  epoch: number;
  betUp: boolean;
  tokenAddress: string;
  amount: number;
  isUp : boolean;
  userAddress: string ;
  transactionHash: string;
}
