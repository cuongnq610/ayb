import { GameBetEnum } from '@/constants/constants';

export interface GameHeaderProps {
  gameType?: GameBetEnum;
  setGameType: (value: GameBetEnum) => void;
}
