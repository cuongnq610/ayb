import ClockCountDown from '@/views/game/ClockCountDown';
import Image from 'next/image';
import { UseCheckDevice } from '@/hooks/useCheckDevice';
import clsx from 'clsx';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { changeShowHistory, changeShowLiveAll, gameSelector } from '@/redux/slices/gameSlice';
import { SecondsToHoursMinSec, SecondsToMinSec } from '@/utils/secoundsToMinSec';
import { usePathname } from 'next/navigation';

export default function RightFunction() {
  const { isMobile } = UseCheckDevice();
  const router = usePathname();
  const isPredictionGame = router.includes('prediction');

  const { isShowLiveAll, isShowHistory } = useAppSelector(gameSelector);
  const dispatch = useAppDispatch();
  const { closeTimestamp } = useAppSelector(gameSelector);
  return (
    <div className={clsx('flex w-fit', isMobile ? 'flex-row-reverse gap-2 justify-between' : 'flex-row gap-2')}>
      <ClockCountDown
        className={'mr-6'}
        time={isPredictionGame ? SecondsToHoursMinSec(closeTimestamp) : SecondsToMinSec(closeTimestamp)}
        type={isPredictionGame ? '24h' : '15m'}
      />
      <div className={clsx('flex flex-row gap-2')}>
        <button
          className={'w-[40px] h-[40px] rounded-xl bg-bg-button-func flex justify-center items-center'}
          onClick={() => dispatch(changeShowLiveAll(!isShowLiveAll))}>
          {isShowLiveAll ? (
            <Image
              src={'/icons/dollar.svg'}
              alt={'play-icon'}
              width={24}
              height={24}
              className={'object-contain w-6 h-6'}
            />
          ) : (
            <Image
              src={'/icons/play.svg'}
              alt={'dollar-icon'}
              width={24}
              height={24}
              className={'object-contain w-6 h-6'}
            />
          )}
        </button>
        <button
          className={'w-[40px] h-[40px] rounded-xl bg-bg-button-func flex justify-center items-center'}
          onClick={() => dispatch(changeShowHistory(!isShowHistory))}>
          <Image
            src={'/icons/ranks-icon.svg'}
            alt={'rank-icon'}
            width={24}
            height={24}
            className={'object-contain w-6 h-6'}
          />
        </button>
        <a
          target="_blank"
          href={
            isPredictionGame
              ? 'https://all-your-base.gitbook.io/all-your-base/'
              : 'https://all-your-base.gitbook.io/all-your-base/'
          }>
          <button className={'w-[40px] h-[40px] rounded-xl bg-bg-button-func flex justify-center items-center'}>
            <Image
              src={'/icons/notification.svg'}
              alt={'notification-icon'}
              width={24}
              height={24}
              className={'object-contain w-6 h-6'}
            />
          </button>
        </a>
      </div>
    </div>
  );
}
