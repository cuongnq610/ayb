/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from 'clsx';
import Image from 'next/image';
import { useState } from 'react';
import { COIN_INFO, CoinNameEnum, StatusRoundEnum } from '@/constants/constants';
import YourHistoryPrediction from './YourHistoryPrediction';
// import CreateNumberFromDecimal from '@/utils/createNumberFromDecimal';
// import useGetDecimalsUSDT from '@/hooks/useGetDecimalsUSDT';
import RoundHistoryPrediction from './RoundHistoryPrediction';
interface Props {
  item: any;
  decimalsUSDT: number;
  setIsShowCollectPopup: (value: boolean) => void;
  setItemClaim: (value: any) => void;
}

export default function RoundPastItem({ item, setIsShowCollectPopup, setItemClaim }: Props) {
  const [isCollapse, setIsCollapse] = useState<boolean>(false);
  const isWin = item.isWinner;
  // const { data: dataDecimalsUSDT } = useGetDecimalsUSDT();
  // const showReward = Number(item.totalReward - item.totalPredictAmount).toFixed(2);
  // const yourResult = Number(item.totalReward - item.totalPredictAmount).toFixed(2);
  // / CreateNumberFromDecimal(Number(dataDecimalsUSDT))).toFixed(2);

  return (
    <>
      <div
        className={clsx(
          'flex flex-row h-[73px] py-2 items-center border-b px-6',
          isCollapse ? 'border-transparent' : 'border-b-white/10'
        )}>
        <div className={'flex flex-col justify-center gap-2'}>
          <p className={'text-white/60 text-xs font-medium font-poppins'}>Round</p>
          <p className={'text-white/80 font-semibold text-sm font-poppins'}>{item.yourHistory[0].round?.epoch}</p>
        </div>
        {item.yourHistory[0].round.status === StatusRoundEnum.FINALIZED && (
          <>
            <div className={'flex flex-col justify-center gap-2 ml-6'}>
              <p className={'text-white/60 text-xs font-medium font-poppins'}>Token</p>
              <p className={'text-white/80 font-semibold text-sm font-poppins flex flex-row gap-1 max-w-[65px]'}>
                <Image src={COIN_INFO[item.yourHistory[0].tokenSymbol  as CoinNameEnum]?.icon} alt={'eth'} width={15} height={15} className={'object-contain'} />
                <span className={'truncate max-w-[50px] uppercase'}>{item.yourHistory[0].tokenSymbol || 'ETH'}</span>
              </p>
            </div>
            <div className={clsx('flex items-center', 'flex-col justify-center gap-2 ml-6')}>
              <p className={'text-white/60 text-xs font-medium font-poppins'}>Your Result</p>
              {isWin ? (
                <p
                  className={`font-semibold text-sm font-poppins ${Number(item.yourResult) >= 0 ? 'text-[#0CF574]/80' : 'text-[#FF1F40]/80'
                    }`}>
                  {Number(item.yourResult) >= 0
                    ? `+${Number(item.yourResult).toFixed(2)}`
                    : Number(item.yourResult).toFixed(2)}
                </p>
              ) : (
                <p className={'font-semibold text-sm font-poppins text-[#FF1F40]/80'}>
                  {Number(item.yourResult).toFixed(2)}
                </p>
              )}
            </div>
            {item.isWinner && !item.hasClaimed ? (
              <button className={'w-[90px] h-[37px] rounded-l-full rounded-r-full p-0.5 bg-gradient-border-bt ml-auto'}>
                <div
                  className={
                    'w-full h-full rounded-l-full rounded-r-full bg-gradient-button flex justify-center items-center'
                  }
                  onClick={() => {
                    setItemClaim(item);
                    setIsShowCollectPopup(true);
                  }}>
                  <span className={'text-white font-pressStart2P font-semibold text-[10px]'}>Collect</span>
                </div>
              </button>
            ) : (
              <div className={'w-[90px] ml-auto'} />
            )}
            <button
              className={'ml-5'}
              onClick={() => {
                setIsCollapse((v) => !v);
              }}>
              <Image
                src={'/icons/up-collapse.svg'}
                alt={'back-down'}
                width={24}
                height={24}
                className={clsx(
                  'w-6 h-6 color-white fill-white transition-2 transform transition-all duration-500',
                  isCollapse ? 'rotate-0' : 'rotate-180'
                )}
              />
            </button>
          </>
        )}
        {item.yourHistory[0].round.status === StatusRoundEnum.LOCKED && (
          <>
            <div className={'flex flex-row ml-6 gap-4 items-center'}>
              <Image
                src={'/icons/time-soon.svg'}
                alt={'time-soon'}
                width={24}
                height={24}
                className={'w-6 h-6 object-contain'}
              />
              <span className={'text-[#C428EC] font-sm font-poppins font-normal'}>Live Now</span>
            </div>
          </>
        )}
        {item.yourHistory[0].round.status === StatusRoundEnum.OPEN && (
          <div className={'flex flex-row ml-6 gap-4 items-center'}>
            <Image
              src={'/icons/time-soon.svg'}
              alt={'time-soon'}
              width={24}
              height={24}
              className={'w-6 h-6 object-contain'}
            />
            <span className={'text-[#C428EC] font-sm font-poppins font-normal'}>Starting Soon</span>
          </div>
        )}
        {item.yourHistory[0].round.status === StatusRoundEnum.REFUNDED && (
          <>
            <div className={'flex flex-col justify-center gap-2 ml-6'}>
              <p className={'text-white/60 text-xs font-medium font-poppins'}>Token</p>
              <p className={'text-white/80 font-semibold text-sm font-poppins flex flex-row gap-1 max-w-[65px]'}>
                {<Image src={'/coins/eth.svg'} alt={'eth'} width={15} height={15} className={'object-contain'} />}
                <span className={'truncate max-w-[50px] uppercase'}>{item.yourHistory[0].tokenSymbol || 'ETH'}</span>
              </p>
            </div>
            <div className={clsx('flex items-center', 'flex-col justify-center gap-2 ml-6')}>
              <p className={'text-white/60 text-xs font-medium font-poppins'}>Your Result</p>
              <p className={'font-semibold text-sm font-poppins text-white/60'}>-</p>
            </div>
            {!item.hasClaimed ? (
              <button className={'w-[90px] h-[37px] rounded-l-full rounded-r-full p-0.5 bg-gradient-border-bt ml-auto'}>
                <div
                  className={
                    'w-full h-full rounded-l-full rounded-r-full bg-gradient-button flex justify-center items-center'
                  }
                  onClick={() => {
                    setItemClaim(item);
                    setIsShowCollectPopup(true);
                  }}>
                  <span className={'text-white font-poppins font-semibold text-sm'}>Collect</span>
                </div>
              </button>
            ) : (
              <div className={'w-[90px] ml-auto'} />
            )}
            <button
              className={'ml-5'}
              onClick={() => {
                setIsCollapse((v) => !v);
              }}>
              <Image
                src={'/icons/up-collapse.svg'}
                alt={'back-down'}
                width={24}
                height={24}
                className={clsx(
                  'w-6 h-6 color-white fill-white transition-2 transform transition-all duration-500',
                  isCollapse ? 'rotate-0' : 'rotate-180'
                )}
              />
            </button>
          </>
        )}
      </div>
      {isCollapse && (
        <div className={clsx('w-full overflow-x-hidden overflow-y-auto transform transition-all px-6')}>
          {(item.yourHistory[0].round.status === StatusRoundEnum.FINALIZED ||
            item.yourHistory[0].round.status === StatusRoundEnum.REFUNDED) && (
              <YourHistoryPrediction
                item={item}
                onCollect={() => {
                  setItemClaim(item);
                  setIsShowCollectPopup(true);
                }}
              />
            )}
          <RoundHistoryPrediction
            entries={item.yourHistory[0].round.participantCount}
            isUpWin={item.yourHistory[0].isWinner ? item.yourHistory[0].predictUp : !item.yourHistory[0].predictUp}
            prizePool={Number(item.yourHistory[0].round.totalPredictAmount)}
            totalPredictUp={Number(item.yourHistory[0].round.totalPredictUpAmount ?? 0)}
            totalWinAmount={Number(item.yourHistory[0].totalWinAmount ?? 0)}
          />
        </div>
      )}
    </>
  );
}
