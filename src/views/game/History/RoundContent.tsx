/* eslint-disable @typescript-eslint/no-explicit-any */
import RadioButton from '@/components/common/RadioButton';
import { TypeFilterHistoryEnum } from '@/constants/constants';
import { useCallback, useEffect, useMemo, useState } from 'react';
import RoundPastClassic from '@/views/game/History/Classic/RoundPastClassic';
import clsx from 'clsx';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { UseCheckDevice } from '@/hooks/useCheckDevice';
import { isMobile as isMobileReact } from 'react-device-detect';
import RoundPastPrediction from '@/views/game/History/Prediction/RoundPastPrediction';
import Image from 'next/image';
import { useAccount } from 'wagmi';
import { postHistory } from '@/services/PredictionApiService';
import { getApiHistoryClassic } from '@/services/ClassicApiService';
import { usePathname } from 'next/navigation';

const menuItem = [
  {
    id: 'all',
    label: 'All',
    value: TypeFilterHistoryEnum.ALL,
  },
  {
    id: 'collected',
    label: 'Collected',
    value: TypeFilterHistoryEnum.COLLECTED,
  },
  {
    id: 'uncollected',
    label: 'Uncollected',
    value: TypeFilterHistoryEnum.UNCOLLECTED,
  },
];

export default function RoundContent() {
  const { isMobile } = UseCheckDevice();
  const { address } = useAccount();

  const router = usePathname();
  const isPredictionGame = router.includes('prediction');

  const [currentFilter, setCurrentFilter] = useState<TypeFilterHistoryEnum>(TypeFilterHistoryEnum.ALL);
  const [history, setHistory] = useState<any>([]);
  const [historyClassic, setHistoryClassic] = useState<any>();
  const [loadingPrediction, setLoadingPrediction] = useState<boolean>(false);

  const historyPredictionFiltered = useMemo(() => {
    if (isPredictionGame) {
      if (currentFilter === TypeFilterHistoryEnum.UNCOLLECTED) return history.filter((e: any) => !e.hasClaimed);
      if (currentFilter === TypeFilterHistoryEnum.COLLECTED) return history.filter((e: any) => e.hasClaimed);
      return history;
    } else {
      return [];
    }
  }, [isPredictionGame, currentFilter, history]);

  const handleFilter = useCallback((value: TypeFilterHistoryEnum) => {
    setCurrentFilter(value);
  }, []);

  const historyDTO = (data: any) => {
    const _history = [];
    for (const roundId in data) {
      if (Object.prototype.hasOwnProperty.call(data, roundId)) {
        const userRounds = data[roundId];
        let isWinner = false;
        let yourResult = 0;
        let totalReward = 0;
        let hasClaimed = false;
        let totalPredictAmount = 0;
        userRounds.forEach((element: any) => {
          totalPredictAmount += Number(element.predictAmount);
          yourResult += Number(element.childReward) - Number(element.predictAmount);
          if (element.isWinner) {
            isWinner = true;
            totalReward += Number(element.childReward);
          }
          if (element.hasClaimed) {
            hasClaimed = true;
          }
        });
        _history.push({ isWinner, yourResult, hasClaimed, totalReward, totalPredictAmount, yourHistory: userRounds });
      }
    }
    return _history;
  };

  const getHistoryPridict = async () => {
    const res = await postHistory({ userAddress: address });
    const historyPredict = historyDTO(res);
    setHistory(historyPredict);
    setLoadingPrediction(false);
  };

  const getHistoryClassic = async () => {
    const res = await getApiHistoryClassic(address);
    // const historyPredict = historyDTO(res);
    setHistoryClassic(res);
    setLoadingPrediction(false);
  };

  useEffect(() => {
    if (isPredictionGame) {
      setLoadingPrediction(true);
      getHistoryPridict();
    } else {
      setLoadingPrediction(true);
      getHistoryClassic();
    }
  }, [isPredictionGame]);

  return (
    <>
      <div className={'mt-6 px-6'}>
        <p className={'text-white/50 text-xs font-normal font-poppins'}>Filter</p>
        <div className={'flex flex-row gap-8 border-b border-white/10 py-6'}>
          {menuItem.map((item) => (
            <RadioButton
              key={item.id}
              id={item.id}
              label={item.label}
              isCheck={currentFilter === item.value}
              onClick={() => handleFilter(item.value)}
            />
          ))}
        </div>
        {!loadingPrediction && (!isPredictionGame ? !historyClassic?.length : !history?.length) && (
          <div className={'flex flex-col mt-20 max-w-[266px] mx-auto gap-3 font-poppins text-center h-full'}>
            <p className={'text-white font-semibold text-base'}>No prediction history available</p>
            <p className={'text-white/80 font-normal text-sm'}>
              If you are sure you should see history here, make sure you’re connected to the correct wallet and try
              again.
            </p>
            <p className={'text-white/80 font-normal text-sm'}>Otherwise, time to place your first bet!</p>
          </div>
        )}
      </div>

      {/* {(!isPredictionGame ? historyData?.UserRounds?.length > 0 : history?.length > 0) && ( */}
      <Scrollbars
        autoHide
        className={clsx(
          'bg-[#181039] rounded-t-[10px] w-full px-6 py-2 relative z-10',
          isMobileReact
            ? 'max-h-[calc(100dvh_-_430px)]'
            : isMobile
            ? 'max-h-[calc(100dvh_-_430px)] '
            : 'max-h-[calc(100vh_-_338px)]'
        )}
        renderThumbHorizontal={(props) => (
          <div
            {...props}
            className="bg-[#B392BC] w-1.5 rounded-l-full rounded-r-full z-[99999]"
            style={{ background: '#B392BC' }}
          />
        )}
        renderThumbVertical={(props) => (
          <div
            {...props}
            className="bg-[#B392BC] w-1.5 rounded-t-full rounded-b-full z-[99999]"
            style={{ background: '#B392BC' }}
          />
        )}>
        <>
          {loadingPrediction && (
            <div className={'w-full h-full z-10 absolute top-0 left-0 backdrop-blur backdrop-opacity-75 bg-white/10'}>
              <div className={'flex flex-col items-center justify-center h-full'}>
                <Image src={'/spinner.svg'} alt={'spinner'} width={60} height={60} />
              </div>
            </div>
          )}
          {isPredictionGame ? (
            <RoundPastPrediction history={historyPredictionFiltered} getHistoryPridict={getHistoryPridict} />
          ) : (
            <RoundPastClassic history={historyClassic ?? []} refetchHistory={getHistoryClassic} />
          )}
        </>
      </Scrollbars>
      {/* )} */}
    </>
  );
}
