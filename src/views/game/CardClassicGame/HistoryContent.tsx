import Image from 'next/image';
import BetDownIcon from '@/components/images/BetDownIcon';
import clsx from 'clsx';
import BetUpIcon from '@/components/images/BetUpIcon';
import TruncateNumber from '@/utils/truncateNumber';

interface Props {
  upValue?: number | string;
  downValue?: number | string;
  isUp?: boolean;
  lockedPrice: number;
  lockBlockNumber?: number;
  closeBlockNumber: number;
  closePrice: number;
}

export default function HistoryContent({ upValue = 50, downValue = -50, isUp, lockedPrice, closePrice }: Props) {
  return (
    <>
      <div className={'w-fit h-fit relative mx-auto'}>
        <div className={'absolute top-0 left-0.5 w-full h-full flex flex-col justify-center items-center'}>
          <span className={clsx('text-base font-pressStart2P font-bold uppercase', isUp ? 'text-gray-1' : 'text-bet-up')}>
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
        <BetUpIcon fill={isUp ? '#0CF574' : undefined} />
      </div>
      <div
        className={
          'w-full h-[120px] rounded-[20px] border-2 border-live-card-border bg-live-card px-4 py-3 flex flex-col justify-between'
        }>
        <div className={'flex flex-row justify-between items-center'}>
          <span className={'text-white text-sm opacity-60 font-medium font-roboto'}>Close Price</span>
        </div>
        <div className={'flex flex-row justify-between items-center'}>
          <span
            className={clsx(
              'text-[15px] leading-[25px] font-bold font-pressStart2P truncate max-w-[70%]',
              isUp ? 'text-bet-up' : 'text-text-down'
            )}>
            $ {closePrice}
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
            <span className={'text-base font-medium font-poppins'}>$ {TruncateNumber(closePrice - lockedPrice)}</span>
          </div>
        </div>
        <div className={'flex flex-row justify-between items-center'}>
          <span className={'text-white text-sm opacity-60 font-medium font-roboto'}>Locked Price:</span>
          <span className={'text-white text-sm font-medium font-roboto'}>$ {Number(lockedPrice).toFixed(2)}</span>
        </div>
      </div>
      <div className={'w-fit h-fit relative mx-auto'}>
        <BetDownIcon fill={isUp ? undefined : '#E73558'} />
        <div className={'absolute top-0 left-0.5 w-full h-full flex flex-col justify-center items-center'}>
          <span className={'text-white text-sm opacity-50 font-medium font-poppins uppercase'}>{downValue}%</span>
          <span className={clsx('text-base font-pressStart2P font-bold uppercase', isUp ? 'text-bet-down' : 'text-white')}>
            down
          </span>
        </div>
      </div>
    </>
  );
}
