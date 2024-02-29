interface RoundHistoryProps {
  // isUp: boolean;
  // lastPrice: string;
  // profit: string;
  prizePool: number;
  entries: number;
  totalPredictUp: number;
  isUpWin: boolean;
  totalWinAmount: number;
}

export default function RoundHistoryPrediction({ prizePool, totalPredictUp, entries, totalWinAmount }: RoundHistoryProps) {
  // console.log(isUp, lastPrice, profit);
  const percentUp = (totalPredictUp / prizePool) * 100;
  const percentWin = (totalWinAmount / prizePool) * 100;
  return (
    <div className={'w-full h-[324px] rounded-[10px] bg-[#130D2D] pt-4 px-4 pb-2 mt-2'}>
      <h1 className={'text-white font-bold text-base'}>Round History</h1>
      <div className={'w-full h-[206px] border border-white/10 rounded-lg px-3 mt-2'}>
        <div className={'flex flex-row justify-between mt-3.5'}>
          <span className={'text-white/50 font-medium text-base'}>Entries</span>
          <span className={'text-white font-medium text-sm'}>{entries}</span>
        </div>
        <div className={'flex flex-row justify-between mt-2'}>
          <span className={'text-white/50 font-medium text-base'}>Prize Pool</span>
          <span className={'text-white font-medium text-sm'}>{prizePool.toFixed(2)} USDT</span>
        </div>
        <div className={'flex flex-row justify-between mt-3'}>
          <span className={'text-white/50 font-normal text-base uppercase'}>Up</span>
          <span className={'text-white font-medium text-sm'}>
            {percentUp.toFixed(2)}% |{' '}
            <span className={'text-white/50 font-normal'}>{totalPredictUp.toFixed(2)} USDT</span>
          </span>
        </div>
        <div className={'flex flex-row justify-between uppercase'}>
          <span className={'text-white/50 font-normal text-base'}>Down</span>
          <span className={'text-white font-medium text-sm'}>
            {(100 - percentUp).toFixed(2)}% |{' '}
            <span className={'text-white/50 font-normal'}>{(prizePool - totalPredictUp).toFixed(2)} USDT</span>
          </span>
        </div>
        <div className={'flex flex-row justify-between mt-3'}>
          <span className={'text-white/50 font-normal text-base uppercase'}>Won</span>
          <span className={'text-white font-medium text-sm'}>
            {percentWin.toFixed(2)}% |{' '}
            <span className={'text-white/50 font-normal'}>
              {totalWinAmount.toFixed(2)} USDT
            </span>
          </span>
        </div>
        <div className={'flex flex-row justify-between uppercase'}>
          <span className={'text-white/50 font-normal text-base'}>Lost</span>
          <span className={'text-white font-medium text-sm'}>
            {(100 - percentWin).toFixed(2)}% |{' '}
            <span className={'text-white/50 font-normal'}>
              {(prizePool - totalWinAmount).toFixed(2)} USDT
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
