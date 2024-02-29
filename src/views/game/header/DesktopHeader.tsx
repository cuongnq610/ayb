import Coins from '@/views/game/Coins';
import GameMenu from '@/views/game/GameMenu';
import RightFunction from '@/views/game/RightFunction';
import { useAppSelector } from '@/redux/hook';
import { gameSelector } from '@/redux/slices/gameSlice';
import formatWithCommas from '@/utils/formatWithCommas';

export default function DesktopHeader() {
  const { pricePool } = useAppSelector(gameSelector);
  return (
    <div className={'w-full justify-between flex flex-row items-center header-container'}>
      <Coins value={formatWithCommas(pricePool)} currency={'usd'} />
      <GameMenu />
      <RightFunction />
    </div>
  );
}
