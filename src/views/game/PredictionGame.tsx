/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import {
  changeCloseTimestamp,
  changePricePool,
  changeShowLiveAll,
  countDownCloseTimestamp,
  gameSelector,
} from '@/redux/slices/gameSlice';
import clsx from 'clsx';
import { UseCheckDevice } from '@/hooks/useCheckDevice';

import CardPredictionGame from '@/views/game/CardPredictionGame/CardPredictionGame';
import { getRounds } from '@/services/PredictionApiService';
import { useEffect, useState } from 'react';
import { RoundPredictEntity } from '@/entity/RoundEntity';
import { StatusRoundEnum } from '@/constants/constants';
import BigNumber from 'bignumber.js';

export default function PredictionGame() {
  const [data, setData] = useState<RoundPredictEntity[]>();
  const { isShowHistory, closeTimestamp, isCalculate } = useAppSelector(gameSelector);
  const { isMobile } = UseCheckDevice();
  const dispatch = useAppDispatch();

  const getRoundsPrediction = async () => {
    const res = await getRounds(); // TODO(KEVIN): NOW
    res.sort((a: any,b : any) => (a['token']['_id'] < b['token']['_id']) ? 1 : ((b['token']['_id'] < a['token']['_id']) ? -1 : 0))
    const timeClose = res.filter((e: any) => e.status === StatusRoundEnum.OPEN)[0]?.lockTimestamp;
    dispatch(changeCloseTimestamp(Math.max(0, Math.floor((timeClose - Date.now()) / 1000))));
    setData(res);
    const pricePool = res
      ?.filter((item: any) => item.status === StatusRoundEnum.OPEN)
      .reduce((acc: any, item: any) => {
        acc = acc.plus(!item.totalPredictAmount.length ? BigNumber(0) : BigNumber(item.totalPredictAmount));
        return acc;
      }, BigNumber(0));
    dispatch(changePricePool(pricePool.toNumber()));
  };

  useEffect(() => {
    if (closeTimestamp > 0) {
      const intervalGetRounds = setInterval(() => {
        getRoundsPrediction();
      }, 10000);
      return () => clearInterval(intervalGetRounds);
    }
    const interval = setInterval(() => {
      dispatch(countDownCloseTimestamp());
      closeTimestamp <= 0 && clearInterval(interval);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [closeTimestamp]);

  useEffect(() => {
    getRoundsPrediction();
  }, []);

  useEffect(() => {
    if (isCalculate) {
      dispatch(changeShowLiveAll(true));
    } else {
      dispatch(changeShowLiveAll(false));
    }
  }, [isCalculate]);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined = undefined;
    if (closeTimestamp <= 0) {
      interval = setInterval(() => {
        getRoundsPrediction();
      }, 1000);
    } else {
      clearInterval(interval);
    }

    // Clear the interval when the component is unmounted or when closeTimestamp changes.
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [closeTimestamp]);

  return (
    <div
      className={clsx(
        'py-2 gap-6 grid grid-cols-1 mt-6 max-w-[1266px] mx-auto',
        'md:mt-0 md:py-20 md:gap-6 md:grid-cols-2',
        'lg:grid-cols-2 xl:grid-cols-3',
        isShowHistory && !isMobile ? 'min-w-[1266px]' : isMobile ? 'w-full' : 'w-fit'
      )}>
      {data
        ?.filter((e) => e.status === StatusRoundEnum.OPEN)
        .map((item) => (
          <CardPredictionGame
            {...item}
            key={item.token?.address}
            dataRound={data.filter((round) => round?.token?.address.toLowerCase() === item?.token?.address.toLowerCase())}
          />
        ))}
    </div>
  );
}
