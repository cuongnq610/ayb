import Image from 'next/image';
import BetDownIcon from '@/components/images/BetDownIcon';
import clsx from 'clsx';
import BetUpIcon from '@/components/images/BetUpIcon';
import ProgressTitle from '@/components/common/ProgressTitle';
import { SecondsToMinSec } from '@/utils/secoundsToMinSec';
import { useAppSelector } from '@/redux/hook';
import { gameSelector } from '@/redux/slices/gameSlice';
import { useEffect, useMemo, useRef } from 'react';

interface Props {
  upValue?: number | string;
  downValue?: number | string;
  isUp?: boolean;
  lockedPrice?: number;
  lockTimestamp: number;
  closeTimestamp: number;
  priceLive: string | number;
}

export default function LiveContent({ upValue = 50, downValue = -50, lockedPrice, priceLive }: Props) {
  const { closeTimestamp } = useAppSelector(gameSelector);
  const isCalculator = closeTimestamp <= 0;
  const countupRef = useRef<HTMLDivElement>(null);
  const { profit, isUp } = useMemo(() => {
    if (lockedPrice) {
      const profit = Number(priceLive) - lockedPrice;
      return { profit: profit.toFixed(2), isUp: profit > 0 };
    }
    return { profit: 0, isUp: false };
  }, [priceLive, lockedPrice]);

  useEffect(() => {
    initCountUp(priceLive);
  }, [priceLive]);

  // you don't have to import this way, but this works best for next.js
  async function initCountUp(_price: number | string) {
    const countUpModule = await import('countup.js');
    if (!countupRef.current) return;
    const countUpAnim = new countUpModule.CountUp(countupRef.current, +_price, {
      duration: 0.5,
      decimalPlaces: 4,
    });
    if (!countUpAnim.error) {
      countUpAnim.start();
    } else {
      console.error(countUpAnim.error);
    }
  }

  return (
    <>
      <div className={'w-fit h-fit relative mx-auto'}>
        <div className={'absolute top-0 left-0.5 w-full h-full flex flex-col justify-center items-center'}>
          <span
            className={clsx(
              'text-base font-poppins font-bold uppercase',
              isCalculator ? 'text-bet-up' : isUp ? 'text-gray-1' : 'text-bet-up'
            )}>
            up
          </span>
          <span
            className={clsx(
              'text-sm font-medium font-poppins uppercase',
              isUp ? 'text-green-1' : 'text-white opacity-50'
            )}>
            +{upValue}%
          </span>
        </div>
        <BetUpIcon fill={isCalculator ? '#36363680' : isUp ? '#0CF574' : undefined} />
      </div>
      <div
        className={
          'w-full h-[120px] rounded-[20px] border-2 border-live-card-border bg-live-card px-4 py-3 flex flex-col justify-between'
        }>
        {isCalculator ? (
          <>
            <div className={'flex flex-col justify-between'}>
              <Image
                src={'/images/calculator.png'}
                alt={'calculator-icon'}
                width={72}
                height={72}
                className={'w-[72px] h-[72px] object-contain mx-auto'}
              />
              <span
                className={'flex flex-row justify-center items-center text-white font-semibold font-poppins text-sm'}>
                Calculating
                <Image
                  src={'/coins/info.svg'}
                  alt={'coin-info'}
                  width={14}
                  height={14}
                  className={'w-3.5 h-3.5 object-contain ml-3'}
                />
              </span>
            </div>
          </>
        ) : (
          <>
            <div className={'flex flex-row justify-between items-center'}>
              <span className={'text-white text-sm opacity-60 font-medium font-roboto'}>Last Price</span>
              <ProgressTitle progress={SecondsToMinSec(closeTimestamp)} closeTimestamp={closeTimestamp} />
            </div>
            <div className={'flex flex-row justify-between items-center'}>
              <span
                className={clsx(
                  'text-[25px] leading-[25px] font-bold font-poppins truncate max-w-[70%]',
                  isUp ? 'text-bet-up' : 'text-text-down'
                )}
                ref={countupRef}>
                {priceLive ?? lockedPrice}
              </span>

              <div
                className={clsx(
                  'px-2 py-1 rounded-md flex flex-row gap-2 max-w-[28%]',
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
                <span className={'text-base font-medium font-poppins truncate'}>{profit}</span>
              </div>
            </div>
            <div className={'flex flex-row justify-between items-center'}>
              <span className={'text-white text-sm opacity-60 font-medium font-roboto'}>Locked Price:</span>
              <span className={'text-white text-sm font-medium font-roboto'}>$ {Number(lockedPrice)?.toFixed(2)}</span>
            </div>
          </>
        )}
      </div>
      <div className={'w-fit h-fit relative mx-auto'}>
        <BetDownIcon fill={isCalculator ? '#36363680' : isUp ? undefined : '#E73558'} />
        <div className={'absolute top-0 left-0.5 w-full h-full flex flex-col justify-center items-center'}>
          <span className={'text-white text-sm opacity-50 font-medium font-poppins uppercase'}>{downValue}%</span>
          <span
            className={clsx(
              'text-base font-poppins font-bold uppercase',
              isCalculator ? 'text-bet-down' : isUp ? 'text-bet-down' : 'text-white'
            )}>
            down
          </span>
        </div>
      </div>
    </>
  );
}
