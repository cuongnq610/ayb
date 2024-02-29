import { UserRoundEntity } from '@/entity/UserRound';

export interface HistoryEntity {
  UserRounds: Array<UserRoundEntity>;
}

export interface HistoryClassic {
  _id: string;
  epoch: number;
  address: string;
  claimed: boolean;
  addressPair: string;
  type: string;
  transactionHash: string;
  amount: string;
  reward: string;
  status: string;
  tokenSymbol: string;
  tokenAddress: string;
  totalBetUpAmount: string;
  totalBetDownAmount: string;
  // totalBetAmount: string;
  tokenId: string;
  isWinner: boolean;
  lockedPrice: string;
  prizePool: string;
  closedPrice: string;
}
