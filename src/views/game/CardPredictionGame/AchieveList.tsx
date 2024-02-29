import Achieve from '@/views/game/CardPredictionGame/Achieve';

interface Props {
  count: string;
  amount: string;
  percent?: string;
}
export default function AchieveList({ amount, count, percent }: Props) {
  return (
    <div
      className={
        'w-full h-[61px] min-h-[61px] rounded-[10px] bg-background-pink flex flex-row items-center justify-between px-6 mt-[20px]'
      }>
      <Achieve iconUrl={'/prediction/ticket.svg'} name={'ticket'} value={count} />
      <Achieve iconUrl={'/prediction/poker.svg'} name={'ticket'} value={`$${Number(amount).toFixed(2)}`} />
      {percent && <Achieve iconUrl={'/prediction/cup.svg'} name={'ticket'} value={`${percent}%`} />}
    </div>
  );
}
