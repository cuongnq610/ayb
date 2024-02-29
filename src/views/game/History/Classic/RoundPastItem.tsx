import clsx from 'clsx';
import Image from 'next/image';
import YourHistory from '@/views/game/History/Classic/YourHistory';
import RoundHistory from '@/views/game/History/Classic/RoundHistory';
import { useMemo, useState } from 'react';
import TruncateNumber from '@/utils/truncateNumber';
import { AddressToken, StatusRoundEnum, Symbols } from '@/constants/constants';
import { HistoryClassic } from '@/entity/History';

interface Props {
  item: HistoryClassic;
  decimalsUSDT: number;
  setIsShowCollectPopup: (value: boolean) => void;
  setIsShowRefundPopup: (value: boolean) => void;
}

export default function RoundPastItem({ item, decimalsUSDT, setIsShowCollectPopup, setIsShowRefundPopup }: Props) {
  const [isCollapse, setIsCollapse] = useState<boolean>(false);
  const isWin = item?.isWinner;

  const yourReward = useMemo(() => {
    if (isWin) {
      // const totalBet = item?.round?.isUp ? item?.round?.globalBetUpAmount : item?.round?.globalBetDownAmount;
      // const result = getResult(totalBet, item?.amount, item?.round?.globalBetAmount);
      // const totalBet = item?.round?.isUp ? item?.round?.totalBetUpAmount : item?.round?.totalBetDownAmount;
      // const result = getResult(totalBet, item?.amount, item?.round?.totalBetAmount);
      return Number(item?.reward).toFixed(2);
    }
    return 0;
  }, [item]);

  return (
    <>
      <div
        className={clsx(
          'flex flex-row h-[73px] py-2 items-center border-b px-6',
          isCollapse ? 'border-transparent' : 'border-b-white/10'
        )}>
        <div className={'flex flex-col justify-center gap-2'}>
          <p className={'text-white/60 text-xs font-medium font-poppins'}>Round</p>
          <p className={'text-white/80 font-semibold text-sm font-poppins'}>{item?.epoch}</p>
        </div>
        {item?.status === StatusRoundEnum.FINALIZED && (
          <>
            <div className={'flex flex-col justify-center gap-2 ml-6'}>
              <p className={'text-white/60 text-xs font-medium font-poppins'}>Token</p>
              <p className={'text-white/80 font-semibold text-sm font-poppins flex flex-row gap-1 max-w-[65px]'}>
                {
                  <Image
                    src={item?.tokenSymbol === 'ETH' ? '/coins/eth.svg' : '/coins/bitcoin.png'}
                    alt={'coin-history'}
                    width={15}
                    height={15}
                    className={'object-contain'}
                  />
                }
                <span className={'truncate max-w-[50px] uppercase'}>{item?.tokenSymbol || 'ETH'}</span>
              </p>
            </div>
            <div className={clsx('flex items-center', 'flex-col justify-center gap-2 ml-6')}>
              <p className={'text-white/60 text-xs font-medium font-poppins'}>Your Result</p>
              {isWin ? (
                <p className={'font-semibold text-sm font-poppins text-[#0CF574]/80'}>
                  +{Math.abs(Number(item?.reward)).toFixed(2)}
                </p>
              ) : (
                <p className={'font-semibold text-sm font-poppins text-[#FF1F40]/80'}>-{item?.amount}</p>
              )}
            </div>
            {Number(item?.reward) > 0 && !item?.claimed ? (
              <button className={'w-[90px] h-[37px] rounded-l-full rounded-r-full p-0.5 bg-gradient-border-bt ml-auto'}>
                <div
                  className={
                    'w-full h-full rounded-l-full rounded-r-full bg-gradient-button flex justify-center items-center'
                  }
                  onClick={() => setIsShowCollectPopup(true)}>
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
        {item?.status === StatusRoundEnum.LOCKED && (
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
        {item?.status === StatusRoundEnum.OPEN && (
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
        {item?.status === StatusRoundEnum.REFUNDED && (
          <>
            <div className={'flex flex-col justify-center gap-2 ml-6'}>
              <p className={'text-white/60 text-xs font-medium font-poppins'}>Token</p>
              <p className={'text-white/80 font-semibold text-sm font-poppins flex flex-row gap-1 max-w-[65px]'}>
                {<Image src={'/coins/eth.svg'} alt={'eth'} width={15} height={15} className={'object-contain'} />}
                <span className={'truncate max-w-[50px] uppercase'}>{item.tokenAddress.toLowerCase()== AddressToken.BTC.toLowerCase() ? Symbols.BTC : Symbols.ETH || 'ETH'}</span>
              </p>
            </div>
            <div className={clsx('flex items-center', 'flex-col justify-center gap-2 ml-6')}>
              <p className={'text-white/60 text-xs font-medium font-poppins'}>Your Result</p>
              <p className={'font-semibold text-sm font-poppins text-white/60'}>-</p>
            </div>
            {!item?.claimed ? (
              <button className={'w-[90px] h-[37px] rounded-l-full rounded-r-full p-0.5 bg-gradient-border-bt ml-auto'}>
                <div
                  className={
                    'w-full h-full rounded-l-full rounded-r-full bg-gradient-button flex justify-center items-center'
                  }
                  onClick={() => setIsShowRefundPopup(true)}>
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
          <YourHistory
            isLose={!isWin}
            yourDirection={item?.type === 'BetUp'}
            yourPosition={item?.amount}
            yourResult={Math.abs(Number(item?.reward) / 0.961 - Number(item?.amount))}
            yourReward={yourReward}
            symbol={item?.tokenSymbol || 'ETH'}
            claimed={item?.claimed}
            onCollect={() => setIsShowCollectPopup(true)}
          />
          <RoundHistory
            isUp={(Number(item?.closedPrice) - Number(item?.lockedPrice)) > 0}
            closePrice={item?.closedPrice}
            lockPrice={item?.lockedPrice}
            profit={TruncateNumber(Number(item?.closedPrice) - Number(item?.lockedPrice))}
            decimalsUSDT={decimalsUSDT}
            totalBetUpAmount={Number(item?.totalBetUpAmount)}
            totalBetDownAmount={Number(item?.totalBetDownAmount)}
            totalBetAmount={Number(item?.prizePool)}
          />
        </div>
      )}
    </>
  );
}
