/* eslint-disable @typescript-eslint/no-explicit-any */
import AchieveList from '@/views/game/CardPredictionGame/AchieveList';
import LiveRowItem from '@/views/game/CardPredictionGame/LiveRowItem';
import TableHeader from '@/views/game/CardPredictionGame/TableHeader';
import Scrollbars from 'react-custom-scrollbars-2';
interface Props {
  data?: any;
}
export default function PastContent({ data }: Props) {
  const ranks = data?.leaderboard ? JSON.parse(data?.leaderboard) : [];

  return (
    <>
      <AchieveList
        amount={`${data?.totalPredictAmount ?? 0}`}
        count={`${data?.participantCount ?? 0}`}
        percent={`${data?.participantCount ? ((ranks.length / data?.participantCount) * 100).toFixed(2) : 0}`}
      />
      <div className={'mt-12'}>
        <TableHeader />
      </div>
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
    </>
  );
}
