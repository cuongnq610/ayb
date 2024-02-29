import Image from 'next/image';
import clsx from 'clsx';
import { useState } from 'react';
import { UserRoundPredictionEntity } from '@/entity/UserRound';
import { StatusRoundEnum } from '@/constants/constants';
import { formatSink, formatWithLongText } from '@/utils/formatWithCommas';
import BigNumber from 'bignumber.js';
// import useGetDecimalsUSDT from '@/hooks/useGetDecimalsUSDT';
// import CreateNumberFromDecimal from '@/utils/createNumberFromDecimal';

export interface RoundHistoryItemProps {
  isWin: boolean;
  time: string;
  isUp: boolean;
  item: UserRoundPredictionEntity;
  onCollect: () => void;
}

export default function YourHistoryItem({ isWin, time, isUp, item, onCollect }: RoundHistoryItemProps) {
  const [isShowMore, setIsShowMore] = useState<boolean>(false);
  // const isUp = Date.now() % 2 === 0;
  // console.log('YourHistoryItem', item, time);
  // const { data: dataDecimalsUSDT } = useGetDecimalsUSDT();
  const showReward = Number(item.childReward).toFixed(2);
  const yourResult = Number(Number(item.childReward) - item.predictAmount).toFixed(2);
  return (
    <>
      <div className={clsx('flex flex-row items-center py-2.5', !isShowMore && 'border-b border-b-white/10')}>
        <Image src={'/prediction/clock.svg'} alt={'clock'} width={18} height={18} />
        <span className={'text-white text-sm font-medium font-poppins ml-2'}>{time} UTC</span>
        <div className={'ml-auto'}>
          {isWin ? (
            <>
              <span className={'font-semibold font-poppins text-base text-[#FFCA43] uppercase flex flex-row gap-2'}>
                Win
                <Image
                  src={'/icons/cup.svg'}
                  alt={'cup-icon'}
                  width={24}
                  height={24}
                  className={'w-6 h-6 object-contain'}
                />
              </span>
            </>
          ) : (
            <>
              <span className={'font-semibold font-poppins text-base text-[#6F1BDA] uppercase flex flex-row gap-2'}>
                Lose
                <Image
                  src={'/icons/lose.svg'}
                  alt={'lose-icon'}
                  width={24}
                  height={24}
                  className={'w-6 h-6 object-contain'}
                />
              </span>
            </>
          )}
        </div>
        <button className={'w-fit h-fit ml-1'} onClick={() => setIsShowMore((v) => !v)}>
          <Image
            src={'/prediction/down.svg'}
            alt={'prediction-down'}
            className={clsx('transform transition-all duration-500', isShowMore ? 'rotate-180' : 'rotate-0')}
            width={24}
            height={24}
          />
        </button>
      </div>
      {isShowMore && (
        <div
          className={clsx('w-full border border-white/10 rounded-lg px-3 py-4 mt-1 mb-2', isWin ? 'h-fit' : 'h-fit')}>
          {isWin && (
            <>
              {!item.hasClaimed && (
                <button
                  className={
                    'w-full rounded-l-full rounded-r-full h-10 bg-[#C428EC] text-white font-semibold text-sm font-poppins mt-3'
                  }
                  onClick={() => {
                    // dispatch(changeShowHistory(false));
                    // toastCollectWinning(isMobile);
                    onCollect();
                  }}>
                  {item.round.status === StatusRoundEnum.FINALIZED ? 'Collect Winnings' : 'Claim refund'}
                </button>
              )}

              <div className={'py-4 border-b border-white/10 flex flex-row mt-4'}>
                <Image src={'/coins/eth.svg'} alt={'eth'} width={24} height={24} className={'w-6 h-6 object-contain'} />
                <span className={'text-white font-normal text-base font-poppins ml-2'}>
                  {item.tokenSymbol || 'ETH'}
                </span>
              </div>
            </>
          )}
          <div className={'flex flex-row justify-between mt-3'}>
            <span className={'text-white/50 font-medium text-base'}>Your direction</span>
            {item?.predictUp ? (
              <span className={'text-[#0CF574] font-medium text-[18px] flex flex-row items-center'}>
                <Image
                  src={'/icons/betup.svg'}
                  alt={'bet-up'}
                  width={16}
                  height={16}
                  className={'w-4 h-4 object-contain mr-2'}
                />
                Vote Up
              </span>
            ) : (
              <span className={'text-[#E73659] font-medium text-[18px] flex flex-row items-center'}>
                <Image
                  src={'/icons/betdown.svg'}
                  alt={'bet-down'}
                  width={16}
                  height={16}
                  className={'w-4 h-4 object-contain mr-2'}
                />
                Vote Down
              </span>
            )}
          </div>
          <div className={'flex flex-row justify-between mt-2'}>
            <span className={'text-white/50 font-medium text-base'}>Your Prediction</span>
            <span className={'text-white font-medium text-sm'}>

              {Number(item?.predictPrice) < Number(0.01) ? (
                <>
                  <span>$0.00</span>
                  {<sub className='vertical-align: sub;'>{formatSink(BigNumber(Number(item?.predictPrice)).toFormat(12, BigNumber.ROUND_DOWN))}</sub>}
                  {<span>{formatWithLongText(BigNumber(Number(item?.predictPrice)).toFormat(12, BigNumber.ROUND_DOWN))}</span>}
                </>
              ) : (
                <>
                  ${(Number(item?.predictPrice).toFixed(2)).toString()}
                </>
              )}
            </span>
          </div>
          <div className={'flex flex-row items-center mt-2'}>
            <span className={'text-white/50 font-medium text-base'}>Actual Price</span>
            <span
              className={clsx(
                'font-medium text-sm ml-auto',
                isWin ? (isUp ? 'text-[#0CF574]' : 'text-[#FF1F40]') : isUp ? 'text-[#FF1F40]' : 'text-[#0CF574]'
              )}>
              {Number(item?.actualPrice) < Number(0.01) ? (
                <>
                  <span>$0.00</span>
                  {<sub className='vertical-align: sub;'>{formatSink(BigNumber(Number(item?.actualPrice)).toFormat(12, BigNumber.ROUND_DOWN))}</sub>}
                  {<span>{formatWithLongText(BigNumber(Number(item?.actualPrice)).toFormat(12, BigNumber.ROUND_DOWN))}</span>}
                </>
              ) : (
                <>
                  ${(Number(item?.actualPrice).toFixed(2)).toString()}
                </>
              )}
            </span>
            <span
              className={clsx(
                'text-white font-medium text-sm ml-2 px-1 py-0.5',
                isWin ? (isUp ? 'bg-[#0CF574]' : 'bg-[#E73659]') : isUp ? 'bg-[#E73659]' : 'bg-[#0CF574]'
              )}>
              {Math.abs(Number(item?.predictPrice) - Number(item?.actualPrice)) < Number(0.1) ? (
                <>
                  <span>$0.00</span>
                  {<sub className='vertical-align: sub;'>{formatSink(BigNumber(Math.abs(Number(item?.predictPrice) - Number(item?.actualPrice))).toFormat(12, BigNumber.ROUND_DOWN))}</sub>}
                  {<span>{formatWithLongText(BigNumber(Math.abs(Number(item?.predictPrice) - Number(item?.actualPrice))).toFormat(12, BigNumber.ROUND_DOWN))}</span>}
                </>
              ) : (
                <>
                  ${Math.abs(Number(item?.predictPrice) - Number(item?.actualPrice)).toFixed(2)}
                </>
              )}
            </span>
          </div>
          {isWin && (
            <>
              <div className={'flex flex-row justify-between mt-2'}>
                <span className={'text-white/50 font-medium text-base'}>Rank</span>
                <span className={clsx('font-medium text-sm text-white')}>
                  {item.rank}/{item.totalWinners}
                </span>
              </div>
              <div className={'flex flex-row justify-between mt-2'}>
                <span className={'text-white/50 font-medium text-base'}>Multiplier</span>
                <span className={clsx('font-medium text-sm text-white')}>{item?.multiplier ?? 0}X</span>
              </div>
            </>
          )}
          <div className={'flex flex-row justify-between mt-2'}>
            <span className={'text-white/50 font-medium text-base'}>Bet Amount</span>
            <span className={clsx('font-medium text-sm text-white')}>{item.predictAmount} USDT</span>
          </div>
          <div className={'flex flex-row justify-between mt-2'}>
            <span className={'text-white/50 font-medium text-base'}>Your result</span>
            <span
              className={clsx(
                'font-medium text-sm',
                isWin && Number(yourResult) >= 0 ? 'text-[#FFCA43]' : 'text-[#E73558]'
              )}>
              {Number(yourResult) >= 0 ? `+${yourResult}` : yourResult} USDT
            </span>
          </div>
          {isWin && (
            <div className={'flex flex-row justify-between mt-3 border-t border-white/10 pt-4'}>
              <span className={'text-white/50 font-medium text-base'}>Amount to collect</span>
              <span className={'text-white font-medium text-sm flex flex-row items-center'}>
                {showReward} USD
                <div className={'w-6 h-6 ml-1 cursor-pointer group relative'}>
                  <Image
                    src={'/coins/info.svg'}
                    alt={'info-svg'}
                    width={24}
                    height={24}
                    className={'w-6 h-6 object-contain'}
                  />
                  <div
                    className={
                      'w-[321px] h-fit hidden group-hover:flex -top-20 -right-2 bg-[#6F1BDA] px-4 py-2 rounded-[10px] absolute'
                    }>
                    <span className={'capitalize font-poppins font-medium text-base text-white text-left'}>
                      includes your original position and your winnings, minus the 3.9% fee.
                    </span>
                  </div>
                  <div
                    className={'hidden group-hover:flex h-6 w-6 rotate-45 -top-8 right-0 bg-[#6F1BDA] absolute'}></div>
                </div>
              </span>
            </div>
          )}
        </div>
      )}
    </>
  );
}
