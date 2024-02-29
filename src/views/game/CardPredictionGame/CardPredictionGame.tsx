/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import clsx from 'clsx';
import {
  BetStatusEnum,
  COIN_INFO,
  CoinNameEnum,
  HISTORY_PREDICTION,
  HistoryPredictionEnum,
  StatusRoundEnum,
} from '@/constants/constants';
import Image from 'next/image';
import { Dialog } from '@headlessui/react';
import { UseCheckDevice } from '@/hooks/useCheckDevice';
import { useCallback, useEffect, useMemo, useState } from 'react';
import BetContent from '@/views/game/CardPredictionGame/BetContent';
import LiveContent from '@/views/game/CardPredictionGame/LiveContent';
import PastContent from '@/views/game/CardPredictionGame/PastContent';
import formatWithCommas, { formatSink, formatWithLongText } from '@/utils/formatWithCommas';
import { RoundPredictEntity } from '@/entity/RoundEntity';
import { TokenEntity } from '@/entity/TokenEntity';
import PredictionLine from './PredictionLine';
import { getPriceNewToken, getYourPrediction } from '@/services/PredictionApiService';
import { useAccount } from 'wagmi';
import { UserRoundPredictionEntity } from '@/entity/UserRound';
import { binance } from 'ccxt';
import { gameSelector } from '@/redux/slices/gameSlice';
import { useAppSelector } from '@/redux/hook';
import BigNumber from 'bignumber.js';
import TradingViewPrediction from './TradingViewPrediction';

const history = [HistoryPredictionEnum.PAST, HistoryPredictionEnum.LIVE, HistoryPredictionEnum.BET];

interface Props extends RoundPredictEntity {
  token: TokenEntity;
  dataRound: RoundPredictEntity[];
}

export default function CardPredictionGame({ dataRound, ...props }: Props) {
  // const { data: dataDecimalsUSDT } = useGetDecimalsUSDT();
  const { isMobile } = UseCheckDevice();

  const [currentHistory, setCurrentHistory] = useState(HistoryPredictionEnum.BET);
  const [iconUrl] = useState<string>(COIN_INFO[props.token?.symbol as CoinNameEnum]?.icon);
  const { isShowLiveAll } = useAppSelector(gameSelector);
  const [isShowTradingView, setIsShowTradingView] = useState(false);

  const [isShowMore, setIsShowMore] = useState<boolean>(false);
  const [bet, setBet] = useState<BetStatusEnum | undefined>();
  const [isNextRound, setIsNextRound] = useState<boolean>(false);
  const [userRounds, setUserRounds] = useState<UserRoundPredictionEntity[]>([]);
  const [priceToken, setPriceToken] = useState(0);
  const [percentToken, setPercentToken] = useState('+0%');
  const { address } = useAccount();
  const exchange = new binance();
  const getPriceToken = async () => {
    if (props.token.name === 'Bitcoin' || props.token.name === 'Ethereum') {
      const _price: any = await exchange.fetchOHLCV(props.token.ticker, '1d', Date.now() - 86400000, 1);
      if (_price == undefined) {
        return;
      } else {
        const _percent =
          _price[0][4] - _price[0][1] > 0
            ? `+${((Math.abs(_price[0][4] - _price[0][1]) / _price[0][1]) * 100).toFixed(2)}%`
            : `-${((Math.abs(_price[0][4] - _price[0][1]) / _price[0][1]) * 100).toFixed(2)}%`;
        setPriceToken(_price[0][4]);
        setPercentToken(_percent);
      }
    } else {
      const resp = await getPriceNewToken(props.token.name);
      if (resp) {
        setPriceToken(resp.lastPrice);
        setPercentToken(resp.percent + "%");
      } else {
        setPriceToken(0);
        setPercentToken("+0%");
      }
    }

  };

  useEffect(() => {
    getPriceToken();
    const interval = setInterval(() => {
      getPriceToken();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const getUserRoundsPrediction = useCallback(async () => {
    const res = await getYourPrediction({
      userAddress: address,
      epoch: dataRound[2 - currentHistory]?.epoch ?? 1,
      tokenId: dataRound[2 - currentHistory]?.token?.tokenId ?? 0,
    });
    setUserRounds(res);
  }, [dataRound, address, currentHistory]);

  useEffect(() => {
    getUserRoundsPrediction();
    return () => {
      setIsShowMore(false);
      setBet(undefined);
      setIsNextRound(false);
    };
  }, [currentHistory]);

  useEffect(() => {
    if (isShowLiveAll) {
      setCurrentHistory(HistoryPredictionEnum.LIVE);
    } else {
      setCurrentHistory(HistoryPredictionEnum.BET);
    }
  }, [isShowLiveAll]);

  useEffect(() => {
    setCurrentHistory(HistoryPredictionEnum.BET);
  }, []);

  useEffect(() => {
    getUserRoundsPrediction();
  }, [dataRound, getUserRoundsPrediction]);

  const downPercentage = useMemo(() => {
    const _round = dataRound?.find((e) => e.status === StatusRoundEnum.OPEN);
    return _round?.totalPredictAmount && _round?.totalPredictDownAmount
      ? (Number(_round.totalPredictDownAmount) / Number(_round.totalPredictAmount)) * 100
      : 0;
  }, [dataRound, currentHistory]);

  const content = useMemo(() => {
    if (currentHistory === HistoryPredictionEnum.BET) {
      return (
        <BetContent
          downValue={
            dataRound?.find((e) => e.status === StatusRoundEnum.OPEN)?.totalPredictAmount !== '0'
              ? downPercentage.toFixed(0)
              : 50
          }
          upValue={
            dataRound?.find((e) => e.status === StatusRoundEnum.OPEN)?.totalPredictAmount !== '0'
              ? (100 - downPercentage).toFixed(0)
              : 50
          }
          roundBetLog={userRounds}
          participantCount={props?.participantCount ?? 0}
          totalPredictAmount={props?.totalPredictAmount ?? 0}
          epoch={props.epoch}
          token={props.token}
          priceCurrent={priceToken}
          isShowMore={isShowMore}
          setIsShowMore={setIsShowMore}
          bet={bet}
          setBet={setBet}
          setIsNextRound={setIsNextRound}
          getRoundBetLog={getUserRoundsPrediction}
        />
      );
    }
    if (currentHistory === HistoryPredictionEnum.LIVE) {
      return <LiveContent data={dataRound.find((e: any) => e.status === StatusRoundEnum.LOCKED)} />;
    }
    return <PastContent data={dataRound.find((e: any) => e.status === StatusRoundEnum.FINALIZED)} />;
  }, [currentHistory, isShowMore, setIsShowMore, bet, setBet, priceToken, props, dataRound, userRounds]);

  return (
    <div
      className={clsx(
        'rounded-[20px] relative transition-all duration-500 transform min-h-[590px]',
        isMobile ? 'w-full' : 'w-[400px]',
        isShowMore ? 'h-[685px]' : 'h-[590px]'
      )}>
      <div className={'w-full h-[186px] rounded-t-[20px] bg-card-game flex flex-col p-4'}>
        <div className={'flex flex-row justify-center items-center relative pb-2'}>
          <div className={'h-full w-fit  absolute left-0 top-1'}>
            {userRounds?.length > 0 && (
              <Image src={'/status/entered.svg'} alt={'entered-icon'} width={89} height={24} />
            )}
          </div>
          <div className={'flex flex-row gap-2'}>
            <Image
              src={iconUrl}
              alt={`${props.token?.symbol}-icon`}
              width={30}
              height={30}
              className={'object-contain w-[30px] h-[30px]'}
            />
            <span className={'text-white text-2xl font-bold font-poppins uppercase'}>{props.token?.symbol}</span>
          </div>
          <div className={'absolute left-[63%] flex flex-row space-x-2'}>
            {/*<TradingViewCrypto />*/}
            <div className={'w-[30px] h-[20px]'}>
              {percentToken.includes('+') ? (
                <Image src={'/test.svg'} alt={'sparkline'} width={50} height={20} />
              ) : (
                <Image src={'/down-token.svg'} alt={'sparkline'} width={50} height={20} />
              )}
            </div>
            <div className={'flex flex-col justify-start w-[70px]'}>
              <p className={'text-white/80 text-xs font-semibold'}>
                {priceToken < Number(0.0001) ? (

                  <>
                    <span>0.00</span>
                    {<sub className='vertical-align: sub;'>{formatSink(BigNumber(priceToken).toFormat(12, BigNumber.ROUND_DOWN))}</sub>}
                    {<span>{formatWithLongText(BigNumber(priceToken).toFormat(12, BigNumber.ROUND_DOWN))}</span>}
                  </>
                ) : (
                  <>
                    ${formatWithCommas(priceToken)}
                  </>
                )}
              </p>
              <p
                className={
                  percentToken.includes('+')
                    ? 'text-[#0CF574] text-[10px] font-medium'
                    : 'text-[#FF1F40] text-[10px] font-medium'
                }>
                {percentToken}
              </p>
            </div>
          </div>
          <button className={'w-fit h-fit absolute right-0 top-1'} onClick={() => setIsShowTradingView(true)}>
            <Image src={'/icons/scale.png'} alt={'scale-icon'} width={17} height={17} />
          </button>
        </div>
        <div className={'w-full border-t border-white opacity-10'} />
        <div
          className={clsx('flex flex-row justify-between items-center relative', isMobile ? 'px-3 py-4' : 'py-4 pl-2')}>
          {history.map((item, index: number) => (
            <button key={`${item}-${index}`} className={'relative w-fit h-fit'} onClick={() => setCurrentHistory(item)}>
              <Image
                src={currentHistory === item ? HISTORY_PREDICTION[item].iconActive : HISTORY_PREDICTION[item].icon}
                alt={HISTORY_PREDICTION[item].name}
                width={HISTORY_PREDICTION[item].width}
                height={30}
                className={'object-contain select-none max-h-[30px] min-h-[30px] h-[30px]'}
              />
              {currentHistory === item && !bet && (
                <div
                  className={clsx(
                    'absolute -bottom-[24.5px] left-1/2 -translate-x-1/2 z-10 -translate-y-1/4',
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
        className={clsx(
          'w-full absolute bottom-0 p-1 rounded-[20px] bg-border-gradient-game-card left-0 rounded-b-[20px] transition-all duration-500 transform',
          isShowMore ? 'h-[567px]' : 'h-[472px]'
        )}>
        <div className={'bg-card-content w-full h-full rounded-[18px] p-4 pb-1 flex flex-col'}>
          {content}
          <PredictionLine isShowMore={isShowMore} setIsShowMore={setIsShowMore} ranks={userRounds} />
        </div>
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
                    src={COIN_INFO[props.token?.symbol as CoinNameEnum]?.icon}
                    className={'mr-4'}
                    alt={'bitcoin-48'}
                    width={48}
                    height={48}
                  />
                  {props.token?.symbol ?? 'BTC'}
                </span>
                <button onClick={() => setIsShowTradingView(false)}>
                  <Image src={'/icons/x-icon.svg'} alt={'close-icon'} width={24} height={24} />
                </button>
              </div>
              <div className={'w-full max-h-[400px] h-full'}>
                <TradingViewPrediction symbol={props.token?.symbol} />
              </div>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}
