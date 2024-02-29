import Coins from '@/views/game/Coins';
import GameMenu from '@/views/game/GameMenu';
import RightFunction from '@/views/game/RightFunction';
import clsx from 'clsx';
import { useAppSelector } from '@/redux/hook';
import { gameSelector } from '@/redux/slices/gameSlice';
import formatWithCommas from '@/utils/formatWithCommas';

export default function MobileHeader() {
  const { pricePool } = useAppSelector(gameSelector);

  return (
    <div className={'mx-auto w-full px-2 flex flex-col justify-center items-center gap-6 pt-4 z-[100]'}>
      <GameMenu />
      <div className={clsx('w-full justify-between flex flex-row items-center pl-8 gap-2')}>
        <Coins value={formatWithCommas(pricePool)} currency={'usd'} />
        <RightFunction />
      </div>
    </div>
  );
}
