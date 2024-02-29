/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from 'clsx';
import YourHistoryItem from '@/views/game/History/Prediction/YourHistoryItem';
import { TimeStampToHours } from '@/utils/secoundsToMinSec';

type Props = {
  item: any;
  onCollect: () => void;
};
export default function YourHistoryPrediction(props: Props) {
  return (
    <div className={clsx('w-full h-fit rounded-[10px] bg-[#130D2D] pt-4 px-4 pb-2 mt-2')}>
      <div className={'flex flex-row justify-between items-center'}>
        <h1 className={'text-white font-bold text-base'}>Your History</h1>
      </div>
      <div className={clsx('w-full h-fit mt-1 border-t border-t-white/10')}>
        {props.item?.yourHistory?.map((v: any) => (
          <YourHistoryItem
            isWin={v?.isWinner ?? false}
            isUp={v.predictUp}
            time={TimeStampToHours(v.timestamp)}
            onCollect={props.onCollect}
            item={v}
          />
        ))}
      </div>
    </div>
  );
}
