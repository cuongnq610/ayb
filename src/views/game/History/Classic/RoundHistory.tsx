import clsx from 'clsx';
import Image from 'next/image';
import BigNumber from 'bignumber.js';
import formatWithCommas from '@/utils/formatWithCommas';

interface RoundHistoryProps {
  isUp: boolean;
  closePrice: string | number;
  lockPrice: string | number;
  profit: string | number;
  decimalsUSDT: number;
  totalBetAmount: number;
  totalBetUpAmount: number;
  totalBetDownAmount: number;
}

export default function RoundHistory({
  isUp,
  closePrice,
  profit,
  lockPrice,
  totalBetAmount,
  totalBetUpAmount,
  totalBetDownAmount,
}: RoundHistoryProps) {
  const percentUp = BigNumber(totalBetUpAmount).div(BigNumber(totalBetAmount)).multipliedBy(100).toNumber();
  console.log(lockPrice);
  console.log(closePrice);
  return (
    <div
      className={`w-full ${
        closePrice ? 'h-[324px]' : 'h-[132px]'
      }h-[324px] rounded-[10px] bg-[#130D2D] pt-4 px-4 pb-2 mt-2`}>
      <h1 className={'text-white font-bold font-pressStart2P text-base'}>Round History</h1>
      <div
        className={`w-full ${closePrice ? 'h-[264px]' : 'h-[72px]'} border border-white/10 rounded-lg px-3 py-4 mt-2`}>
        {closePrice ? (
          <>
            <h1 className={'uppercase font-pressStart2P text-base font-medium text-white/50'}>closed price</h1>
            <div className={'flex flex-row justify-between items-center mt-6'}>
              <span
                className={clsx(
                  'text-[25px] leading-[25px] font-bold font-poppins truncate max-w-[70%]',
                  isUp ? 'text-bet-up' : 'text-text-down'
                )}>
                {formatWithCommas(Number(closePrice).toFixed(2))}
              </span>
              <div
                className={clsx(
                  'px-2 py-1 rounded-md flex flex-row gap-2',
                  isUp ? 'bg-bet-up text-gray-1' : 'bg-text-down text-white'
                )}>
                {isUp ? (
                  <Image
                    src={'/icons/up-status.svg'}
                    alt={'down-status-icon'}
                    className={'object-contain'}
                    width={10}
                    height={14}
                  />
                ) : (
                  <Image
                    src={'/icons/down-status.svg'}
                    alt={'down-status-icon'}
                    className={'object-contain'}
                    width={10}
                    height={14}
                  />
                )}
                <span className={'text-base font-medium font-poppins'}>{profit}</span>
              </div>
            </div>
            <div className={'flex flex-row justify-between mt-6'}>
              <span className={'text-white/50 font-medium text-base'}>Locked Price</span>
              <span className={'text-white font-medium text-sm'}>
                $ {formatWithCommas(Number(lockPrice).toFixed(2))}
              </span>
            </div>
            <div className={'flex flex-row justify-between mt-2'}>
              <span className={'text-white/50 font-medium text-base'}>Prize Pool</span>
              <span className={'text-white font-medium text-sm'}>{Number(totalBetAmount).toFixed(2)} USDT</span>
            </div>
            <div className={'flex flex-row justify-between mt-3'}>
              <span className={'text-white/50 font-normal text-base uppercase'}>Up</span>
              <span className={'text-white font-medium text-sm'}>
                {Number(percentUp).toFixed(2)}% |{' '}
                <span className={'text-white/50 font-normal'}>{totalBetUpAmount} USDT</span>
              </span>
            </div>
            <div className={'flex flex-row justify-between mt-1 '}>
              <span className={'text-white/50 font-normal text-base uppercase'}>Down</span>
              <span className={'text-white font-medium text-sm'}>
                {Number(100 - percentUp).toFixed(2)}% |{' '}
                <span className={'text-white/50 font-normal'}>{Number(totalBetDownAmount).toFixed(2)} USDT</span>
              </span>
            </div>
          </>
        ) : (
          <>
            <h1 className={'uppercase text-base font-medium text-white/50'}>Invalid Rounds, no data available</h1>
          </>
        )}
      </div>
    </div>
  );
}
