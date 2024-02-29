/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Image from 'next/image';
import { COIN_INFO, CoinNameEnum, HISTORY_GAME, StatusRoundEnum } from '@/constants/constants';
import clsx from 'clsx';
import { useCallback, useEffect, useMemo, useState } from 'react';
import LiveContent from '@/views/game/CardClassicGame/LiveContent';
import BetContent from '@/views/game/CardClassicGame/BetContent';
import { Dialog } from '@headlessui/react';
import TradingViewWidget from '@/views/game/CardClassicGame/TradingView';
import { UseCheckDevice } from '@/hooks/useCheckDevice';
import HistoryContent from '@/views/game/CardClassicGame/HistoryContent';
import { changePricePool, gameSelector } from '@/redux/slices/gameSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { RoundEntity } from '@/entity/RoundEntity';
import { NewUserRoundEntity } from '@/entity/UserRound';
import Spinner from '@/components/common/Spinner';
import { mapToken } from '@/utils/util';
import { getPrizePoolApi } from '@/services/ClassicApiService';

interface Props {
  // data: Array<RoundEntity>;
  symbol: string;
  userRounds: Array<NewUserRoundEntity> | undefined;
  classicRounds: Array<RoundEntity>;
}

export default function CardClassicGame({ symbol, userRounds, classicRounds }: Props) {
  const dispatch = useAppDispatch();

  const { isMobile } = UseCheckDevice();
  const { isShowLiveAll } = useAppSelector(gameSelector);
  const [currentHistory, setCurrentHistory] = useState<RoundEntity | undefined>();
  const [isShowTradingView, setIsShowTradingView] = useState(false);
  const [priceLive, setPriceLive] = useState<string | number>(0);
  const [loadingCard, setLoadingCard] = useState<boolean>(false);
  const [downPercentage, setDownPercentage] = useState<number>(0);
  const [isUpdateClassic, setUpdateClassic] = useState<boolean>(true);

  const getPrizePool = async () => {

    if (!currentHistory) {
      if (!classicRounds?.length) {
        return;
      }
      const res = await getPrizePoolApi(classicRounds[0]?.epoch);
      if (res.length > 0) {
        dispatch(changePricePool(res[0].amount));
      }
      return;
    }
    const res = await getPrizePoolApi(currentHistory?.epoch);
    if (res.length > 0) {
      dispatch(changePricePool(res[0].amount));
    } else {
      dispatch(changePricePool(0));
    }
  }

  useEffect(() => {
    if (!classicRounds?.length) {
      return;
    }

    if (isShowLiveAll) {
      setCurrentHistory(classicRounds[1]);
    } else {
      if (isUpdateClassic) {
        setCurrentHistory(classicRounds[0]);

      }
    }
    setDownPercentage(caculateDownPercentage);
  }, [isShowLiveAll, classicRounds])

  const caculateDownPercentage = () => {
    const downPer = currentHistory?.totalBetDownAmount && currentHistory?.totalBetAmount
      ? (Number(currentHistory?.totalBetDownAmount) / Number(currentHistory?.totalBetAmount)) * 100
      : 0;
    return downPer;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      getPrizePool();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setDownPercentage(caculateDownPercentage);
  }, [currentHistory]);

  useEffect(() => {
    getPrizePool();
  }, []);



  const roundBetLog = useMemo(() => {
    if (!userRounds?.length || !currentHistory) {
      return;
    }
    setDownPercentage(caculateDownPercentage);
    return userRounds.find(
      (item) => item.epoch === currentHistory.epoch && item.tokenAddress === currentHistory.tokenAddress
    );
  }, [userRounds, currentHistory]);

  const getImageUrl = useCallback((item: RoundEntity, isCurrent: boolean) => {
    if (item.status === StatusRoundEnum.FINALIZED) {
      return !item.isUp ? HISTORY_GAME[item.status]?.icon2 : HISTORY_GAME[item.status]?.icon;
    }
    return isCurrent ? HISTORY_GAME[item.status]?.icon2 : HISTORY_GAME[item.status]?.icon;
  }, []);
  useEffect(() => {
    const token = mapToken(symbol);
    const pricesWs = new WebSocket(`wss://ws.coincap.io/prices?assets=${token}`);
    pricesWs.onmessage = async (msg) => {
      const priceJson = JSON.parse(msg.data);
      setPriceLive(priceJson[token]);
    };
    return () => {
      pricesWs.close();
    };
  }, []);

  const content = useMemo(() => {
    if (!currentHistory) {
      return;
    }
    if (currentHistory.status === StatusRoundEnum.OPEN) {
      return (
        <BetContent
          downValue={
            currentHistory?.totalBetAmount && currentHistory?.totalBetAmount !== '0' ? downPercentage.toFixed(0) : 50
          }
          upValue={
            currentHistory?.totalBetAmount && currentHistory?.totalBetAmount !== '0'
              ? (100 - downPercentage).toFixed(0)
              : 50
          }
          epoch={currentHistory.epoch}
          tokenAddress={currentHistory.tokenAddress}
          symbol={currentHistory.symbol}
          roundBetLog={roundBetLog}
          refetch={getPrizePool}
          refreshPrizePool={getPrizePool}
          setLoadingCard={setLoadingCard}
        />
      );
    }
    if (currentHistory.status === StatusRoundEnum.LOCKED) {
      return (
        <LiveContent
          downValue={
            currentHistory?.totalBetAmount && currentHistory?.totalBetAmount !== '0' ? downPercentage.toFixed(0) : 50
          }
          upValue={
            currentHistory?.totalBetAmount && currentHistory?.totalBetAmount !== '0'
              ? (100 - downPercentage).toFixed(0)
              : 50
          }
          lockedPrice={currentHistory.lockPrice}
          lockTimestamp={currentHistory.lockTimestamp}
          closeTimestamp={currentHistory.closeTimestamp}
          priceLive={priceLive}
        />
      );
    }
    return (
      <HistoryContent
        downValue={
          currentHistory?.totalBetAmount && currentHistory?.totalBetAmount !== '0' ? downPercentage.toFixed(0) : 50
        }
        upValue={
          currentHistory?.totalBetAmount && currentHistory?.totalBetAmount !== '0'
            ? (100 - downPercentage).toFixed(0)
            : 50
        }
        isUp={currentHistory.isUp}
        lockedPrice={currentHistory.lockPrice}
        closePrice={currentHistory.closePrice}
        lockBlockNumber={currentHistory.lockTimestamp}
        closeBlockNumber={currentHistory.closeTimestamp}
      />
    );
  }, [currentHistory, roundBetLog, getPrizePool, classicRounds, priceLive, setLoadingCard]);
  return (
    <div className={clsx('h-[418.5px] rounded-[20px] relative', isMobile ? 'w-full' : 'w-[400px]')}>
      {(loadingCard && <Spinner className={'rounded-[20px] z-50'} />)}
      <div className={'w-full h-[186px] rounded-t-[20px] bg-card-game flex flex-col p-4'}>
        <div className={'flex flex-row justify-center items-center relative pb-2'}>
          <div className={'h-full w-fit  absolute left-0 top-1'}>
            {roundBetLog &&
              (roundBetLog.betUp ? (
                <Image src={'/status/entered-up.svg'} alt={'entered-up-icon'} width={102} height={24} />
              ) : (
                <Image src={'/status/entered-down.svg'} alt={'entered-down-icon'} width={102} height={24} />
              ))}
            {currentHistory?.status === StatusRoundEnum.FINALIZED && !roundBetLog && (
              <Image src={'/status/expired.svg'} alt={'expired-icon'} width={89} height={24} />
            )}
          </div>
          <div className={'flex flex-row gap-2'}>
            <Image
              src={COIN_INFO[symbol === CoinNameEnum.BTC ? CoinNameEnum.BTC : CoinNameEnum.ETH].icon}
              alt={`coin-icon`}
              width={30}
              height={30}
              className={'object-contain w-[30px] h-[30px]'}
            />
            <span className={'text-white text-xl font-bold font-pressStart2P uppercase'}>
              {symbol || '\u00A0'}
            </span>
          </div>
          <button className={'w-fit h-fit absolute right-0 top-1'} onClick={() => setIsShowTradingView(true)}>
            <Image src={'/icons/scale.png'} alt={'scale-icon'} width={17} height={17} />
          </button>
        </div>
        <div className={'w-full border-t border-white opacity-10'} />
        <div
          className={clsx(
            'flex flex-row-reverse justify-between items-center relative',
            isMobile ? 'px-3 py-4' : 'py-4 pl-2'
          )}>
          {classicRounds?.map((item: RoundEntity, index: number) => (
            <button key={`${item}-${index}`} className={'relative w-fit h-fit'} onClick={() => {
              setUpdateClassic(index === 0);

              setCurrentHistory(item);

            }}>
              <Image
                src={getImageUrl(item, currentHistory?._id === item._id)}
                alt={HISTORY_GAME[item.status]?.name}
                width={HISTORY_GAME[item.status]?.width}
                height={30}
                className={'object-contain select-none max-h-[30px] min-h-[30px] h-[30px]'}
              />
              {currentHistory?.epoch === item.epoch && (
                <div
                  className={clsx(
                    'absolute -bottom-[27px] left-1/2 -translate-x-1/2 z-10 -translate-y-1/4',
                    'w-[42px] h-[15px]'
                  )}>
                  <Image
                    src={'/images/active.svg'}
                    alt={'active-card'}
                    width={67}
                    height={24}
                    className={'w-[42px] object-contain'}
                  />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
      <div
        className={
          'w-full h-[300px] absolute bottom-0 p-1 rounded-[20px] bg-border-gradient-game-card left-0 rounded-b-[20px]'
        }>
        <div className={'bg-card-content w-full h-full rounded-[18px] p-4 flex flex-col'}>{content}</div>
      </div>
      {isShowTradingView && (
        <Dialog
          open={isShowTradingView}
          onClose={() => { }}
          as="div"
          className="fixed inset-0 flex items-center justify-center h-screen w-screen z-[1000]">
          <div className="w-full h-full max-w-[947px] max-h-[528px] rounded-[20px] bg-trading-view">
            <Dialog.Overlay />
            <div className={'px-6 w-full h-full justify-between flex flex-col py-6'}>
              <div className={'h-12 w-full flex items-center justify-between'}>
                <span className={'text-white text-xl font-bold font-poppins uppercase flex flex-1 items-center'}>
                  <Image
                    src={symbol === 'BTC' ? '/coins/bitcoin.png' : '/coins/eth.svg'}
                    className={'mr-4'}
                    alt={'bitcoin-48'}
                    width={48}
                    height={48}
                  />
                  {symbol || 'BTC'}
                </span>
                <button onClick={() => setIsShowTradingView(false)}>
                  <Image src={'/icons/x-icon.svg'} alt={'close-icon'} width={24} height={24} />
                </button>
              </div>
              <div className={'w-full max-h-[400px] h-full'}>
                <TradingViewWidget symbol={symbol || 'BTC'} />
              </div>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}
