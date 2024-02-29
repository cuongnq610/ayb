/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from 'next/image';
import { Dispatch, SetStateAction } from 'react';
import clsx from 'clsx';
import { Scrollbars } from 'react-custom-scrollbars-2';
import LiveRowItem from '@/views/game/CardPredictionGame/LiveRowItem';

interface PredictionLineProps {
  isShowMore: boolean;
  setIsShowMore: Dispatch<SetStateAction<boolean>>;
  ranks?: any;
}

export default function PredictionLine({ isShowMore, setIsShowMore, ranks }: PredictionLineProps) {
  return (
    <div className={clsx('flex flex-col mt-auto', isShowMore ? 'h-[131px]' : 'h-[48px]')}>
      <div
        className={
          'w-full min-h-[48px] h-[48px] max-h-[48px] border-t border-t-white/10 flex flex-row justify-between items-center mt-auto'
        }>
        <span className={'text-white text-sm font-semibold font-roboto'}>Your Predictions</span>
        <button className={'w-fit h-fit'} onClick={() => setIsShowMore((v) => !v)}>
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
        <>
          {ranks?.length > 0 ? (
            <Scrollbars
              className={'w-full h-[83px]'}
              autoHide={true}
              renderThumbHorizontal={(props) => (
                <div
                  {...props}
                  className="bg-gradient-to-b from-[#FF62E6] to-[#C428EC] w-1.5 rounded-l-full rounded-r-full z-[99999]"
                />
              )}
              renderThumbVertical={(props) => (
                <div
                  {...props}
                  className="bg-gradient-to-b from-[#FF62E6] to-[#C428EC] w-1.5 rounded-t-full rounded-b-full z-[99999]"
                />
              )}>
              <div className={'flex flex-col gap-1 pr-4'}>
                {ranks.map((rank: any, index: any) => (
                  <LiveRowItem
                    key={index}
                    rank={rank?.rank}
                    playerName={rank?.userAddress}
                    prd={rank?.predictPrice}
                    bet={rank?.predictAmount}
                    mul={rank?.multiplier}
                    time={rank?.timestamp}
                    isUp={rank?.predictUp}
                  />
                ))}
              </div>
            </Scrollbars>
          ) : (
            <div
              className={
                'w-full h-[83px] flex flex-col gap-5 justify-center items-center transform transition-opacity duration-500 transition-delay-500'
              }>
              <span className={'text-sm font-poppins text-white font-semibold'}>No predictions Yet</span>
              <span className={'text-sm font-poppins text-white/80'}>Time to make your first prediction!</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
