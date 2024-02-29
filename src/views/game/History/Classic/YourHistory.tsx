import Image from 'next/image';
import clsx from 'clsx';
import { StatusRoundEnum } from '@/constants/constants';

interface YourHistoryProps {
  isLose: boolean;
  yourDirection: boolean;
  yourPosition: string | number;
  yourResult: string | number;
  onCollect?: () => void;
  symbol: string;
  status?: StatusRoundEnum;
  claimed: boolean;
  yourReward: string | number;
}

export default function YourHistory({
  isLose,
  yourDirection,
  yourPosition,
  yourResult,
  onCollect,
  symbol,
  claimed,
  yourReward,
  status = StatusRoundEnum.FINALIZED,
}: YourHistoryProps) {
  return (
    <div className={clsx('w-full rounded-[10px] bg-[#130D2D] pt-4 px-4 pb-2 mt-2', isLose ? 'h-[202px]' : 'h-[382px]')}>
      <div className={'flex flex-row justify-between items-center'}>
        <span className={'text-white font-bold text-base font-pressStart2P'}>Your History</span>
        {status !== StatusRoundEnum.REFUNDED ? (
          isLose ? (
            <>
              <span className={'font-semibold font-pressStart2P text-base text-[#6F1BDA] uppercase flex flex-row gap-2'}>
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
          ) : (
            <>
              <span className={'font-semibold font-pressStart2P text-base text-[#FFCA43] uppercase flex flex-row gap-2'}>
                Win
                <Image
                  src={'/icons/cup.svg'}
                  alt={'lose-icon'}
                  width={24}
                  height={24}
                  className={'w-6 h-6 object-contain'}
                />
              </span>
            </>
          )
        ) : (
          <span className={'font-semibold font-poppins text-base text-[#A9A9A9] uppercase flex flex-row gap-2'}>
            Invalid
          </span>
        )}
      </div>
      <div
        className={clsx('w-full border border-white/10 rounded-lg px-3 py-4 mt-3', isLose ? 'h-[142px]' : 'h-[322px]')}>
        {!isLose && (
          <>
            {!claimed && (
              <button
                className={
                  'w-full rounded-l-full rounded-r-full h-10 bg-[#C428EC] text-white font-semibold text-sm font-poppins mt-3'
                }
                onClick={() => {
                  onCollect && onCollect();
                }}>
                {status === StatusRoundEnum.FINALIZED ? 'Collect Winnings' : 'Claim Refund'}
              </button>
            )}
            <div className={'py-4 border-b border-white/10 flex flex-row mt-4'}>
              <Image src={'/coins/eth.svg'} alt={'eth'} width={24} height={24} className={'w-6 h-6 object-contain'} />
              <span className={'text-white font-normal text-base font-poppins ml-2 uppercase'}>{symbol}</span>
            </div>
          </>
        )}
        <div className={'flex flex-row justify-between mt-3'}>
          <span className={'text-white/50 font-medium text-base'}>Your direction</span>
          {yourDirection ? (
            <span className={'text-[#0CF574] font-medium text-[18px] font-pressStart2P flex flex-row items-center'}>
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
            <span className={'text-text-down font-medium text-[18px] font-pressStart2P flex flex-row items-center'}>
              <Image
                src={'/icons/betdown.svg'}
                alt={'bet-down'}
                width={16}
                height={16}
                className={'w-4 h-4 object-contain mr-2 rotate-180'}
              />
              Vote Down
            </span>
          )}
        </div>
        <div className={'flex flex-row justify-between mt-2'}>
          <span className={'text-white/50 font-medium text-base'}>Your position</span>
          <span className={'text-white font-medium text-sm'}>{yourPosition} USDT</span>
        </div>
        <div className={'flex flex-row justify-between mt-2'}>
          <span className={'text-white/50 font-medium text-base'}>Your winnings</span>
          <span className={'text-[#FFCA43] font-medium text-sm'}>{!isLose ? Number(yourResult).toFixed(2) : '-'}</span>
        </div>
        {!isLose && (
          <div className={'flex flex-row justify-between mt-3 border-t border-white/10 pt-4'}>
            <span className={'text-white/50 font-medium text-base'}>Amount to collect</span>
            <span className={'text-white font-medium text-sm flex flex-row items-center'}>
              {Number(yourReward)} USD
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
                    includes your original position and your winnings, minus the 3,9% fee.
                  </span>
                </div>
                <div className={'hidden group-hover:flex h-6 w-6 rotate-45 -top-8 right-0 bg-[#6F1BDA] absolute'}></div>
              </div>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
