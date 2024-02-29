/* eslint-disable @typescript-eslint/no-explicit-any */
import AchieveList from '@/views/game/CardPredictionGame/AchieveList';
import LiveRowItem from '@/views/game/CardPredictionGame/LiveRowItem';
import TableHeader from '@/views/game/CardPredictionGame/TableHeader';
import Scrollbars from 'react-custom-scrollbars-2';
import Image from 'next/image';
import getSpaceId from '@/utils/getSpaceId';
import { useEffect } from 'react';

interface Props {
  data?: any;
}
export default function LiveContent({ data }: Props) {
  const isCalculator = false;
  const ranks = data?.leaderboard ? JSON.parse(data?.leaderboard) : [];

  const getIds = async () => {
    const spaceIds = ranks.map((rank: any) => {
      return getSpaceId(rank?.userAddress);
    });
    const responses = await Promise.all(spaceIds);
    responses.map((response: any, index: number) => {
      ranks[index].playerName = response.name;
    });
  };

  useEffect(() => {
    getIds();
  }, [ranks]);

  return (
    <>
      <AchieveList
        amount={`${data?.totalPredictAmount ?? 0}`}
        count={`${data?.participantCount ?? 0}`}
        percent={`${data?.participantCount ? ((ranks.length / data?.participantCount) * 100).toFixed(2) : 0}`}
      />
      {/* <ProgressTitle
        title={'Round Closing In'}
        progress={'15:34'}
        className={'w-full mb-[27px] mt-[22px]'}
        closeTimestamp={200}
      /> */}
      <div className={'pr-2 mt-12'}>
        <TableHeader />
      </div>
      <>
        {isCalculator ? (
          <div
            className={
              'w-full h-[220px] bg-[#1A0223] rounded-[20px] flex flex-col justify-center items-center gap-2 mt-2'
            }>
            <Image
              src={'/images/calculator.png'}
              alt={'calculator-icon'}
              width={72}
              height={72}
              className={'w-[72px] h-[72px] object-contain mx-auto'}
            />
            <span className={'flex flex-row justify-center items-center text-white font-semibold font-poppins text-sm'}>
              Calculating
              <Image
                src={'/coins/info.svg'}
                alt={'coin-info'}
                width={14}
                height={14}
                className={'w-3.5 h-3.5 object-contain ml-1'}
              />
            </span>
          </div>
        ) : (
          <Scrollbars
            className={'w-full h-[220px] max-h-[220px] mt-2'}
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
            <div className={'flex flex-col gap-1 h-fit pr-2'}>
              {ranks.map((rank: any, index: any) => (
                <LiveRowItem
                  key={index}
                  rank={rank?.rank}
                  // playerAddress={rank?.userAddress}
                  playerName={rank?.userAddress}
                  prd={rank?.priceDifferent.toString()}
                  bet={rank?.predictAmount}
                  mul={rank?.multiplier}
                  time={rank?.timestamp}
                  isUp={rank?.predictUp}
                />
              ))}
            </div>
          </Scrollbars>
        )}
      </>
    </>
  );
}
