import Image from 'next/image';
import clsx from 'clsx';
import BetUpIcon from '@/components/images/BetUpIcon';
import BetDownIcon from '@/components/images/BetDownIcon';
import { BetStatusEnum } from '@/constants/constants';
import CurrencyInput from 'react-currency-input-field';
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';
import predictionABI from '@/blockchain/predictionABI.json';
import usdtABI from '@/blockchain/usdt_abi.json';
import Range from '@/components/common/Range';
import { toastErrorFn, toastSuccessFn } from '@/utils/toast';
import { useAccount, useContractRead, useContractWrite, useWaitForTransaction } from 'wagmi';
import AchieveList from '@/views/game/CardPredictionGame/AchieveList';
import PredictionLine from '@/views/game/CardPredictionGame/PredictionLine';
import { CONTRACT_USDT_ADDRESS, PREDICTION_ADDRESS } from '@/config/config';
import { postUpdateTX, postUserRounds } from '@/services/PredictionApiService';
import { TokenEntity } from '@/entity/TokenEntity';
import CreateNumberFromDecimal from '@/utils/createNumberFromDecimal';
import useGetDecimalsUSDT from '@/hooks/useGetDecimalsUSDT';
import useApprove from '@/hooks/useApprove';
import { UseCheckDevice } from '@/hooks/useCheckDevice';
import { toast } from 'react-toastify';
import { UserRoundPredictionEntity } from '@/entity/UserRound';
import { maxUint256 } from 'viem';

interface Props {
  totalPredictAmount?: number | string;
  participantCount?: number;
  upValue?: number | string;
  downValue?: number | string;
  isShowMore: boolean;
  token: TokenEntity;
  priceCurrent: number;
  epoch: number;
  setIsShowMore: Dispatch<SetStateAction<boolean>>;
  bet: BetStatusEnum | undefined;
  setBet: Dispatch<SetStateAction<BetStatusEnum | undefined>>;
  setIsNextRound: Dispatch<SetStateAction<boolean>>;
  roundBetLog: UserRoundPredictionEntity[];
  getRoundBetLog: () => void;
}

export default function BetContent({
  upValue = 50,
  downValue = 50,
  isShowMore,
  token,
  epoch,
  setIsShowMore,
  bet,
  setBet,
  priceCurrent,
  setIsNextRound,
  participantCount,
  totalPredictAmount,
  roundBetLog,
  getRoundBetLog,
}: Props) {
  const { address } = useAccount();
  // const [isNextBet, setIsNextBet] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [isShowCollectPopup, setIsShowCollectPopup] = useState<boolean>(false);

  const [betValue, setBetValue] = useState<number | string>(1);
  const [price, setPrice] = useState<number>(priceCurrent);
  const isError = useMemo(() => {
    return price === priceCurrent;
  }, [price]);
  const { isMobile } = UseCheckDevice();

  const predictPercent = useMemo<string>(() => {
        console.log(price);
        console.log(priceCurrent);
    const percent = (Math.abs(price - priceCurrent) / priceCurrent) * 100;
    console.log(percent);
    return percent.toFixed(2) ?? 0;
  }, [price]);

  // contract
  const { data: dataDecimalsUSDT } = useGetDecimalsUSDT();
  const {
    isError: isErrorApprove,
    isLoading: isLoadingApprove,
    writeAsync: writeAsyncApprove,
    data: dataApprove,
  } = useApprove();
  const {
    data: contractPredict,
    isSuccess: isSuccessWriteBet,
    isError: isErrorWriteBet,
    isLoading: isLoadingWriteBet,
    write,
  } = useContractWrite({
    address: PREDICTION_ADDRESS as `0x${string}`,
    abi: predictionABI,
    functionName: 'predict',
  });

  const { data: dataAllowance } = useContractRead({
    address: CONTRACT_USDT_ADDRESS as `0x${string}`,
    abi: usdtABI,
    args: [address, PREDICTION_ADDRESS],
    functionName: 'allowance',
    watch: true,
  });

  useWaitForTransaction({
    hash: dataApprove?.hash,
    onSuccess: async () => {
      writeContractBet();
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const writeContractBet = async () => {
    const res = await postUserRounds({
      userAddress: address,
      tokenId: token?.tokenId,
      epoch,
      predictUp: bet === BetStatusEnum.UP,
      predictPrice: price.toString(),
      predictAmount: betValue.toString(),
    });

    if (res) {
      write?.({
        args: [token.address, epoch, +betValue * CreateNumberFromDecimal(Number(dataDecimalsUSDT)), price.toFixed(0)],
      });
    }
  };

  const saveBet = async () => {
    const res = await postUpdateTX({
      userAddress: address,
      tokenId: token?.tokenId,
      epoch,
      predictPrice: price.toFixed(0),
      predictAmount: betValue.toString(),
      transactionHash: contractPredict?.hash,
    });
    if (res) {
      setTimeout(() => {
        getRoundBetLog();
        setIsNextRound(true);
        setBet(undefined);
        toastSuccessFn(isMobile, contractPredict?.hash);
      }, 1000);
    }
  };

  useEffect(() => {
    if (isSuccessWriteBet) {
      saveBet();
    }
  }, [isSuccessWriteBet]);

  useEffect(() => {
    if (isErrorWriteBet) {
      console.log('eror');
      if (contractPredict?.hash) {
        toastErrorFn(isMobile, contractPredict?.hash);
      } else {
        toastErrorFn(isMobile, '', 'Round not bettable');
      }
    }
  }, [isErrorWriteBet]);

  // useEffect(() => {
  //   return () => {
  //     setIsShowCollectPopup(false);
  //   };
  // }, []);

  useEffect(() => {
    if (isErrorApprove) {
      toastErrorFn(isMobile, 'User denied transaction signature.');
    }
  }, [isErrorApprove]);

  const onSubmit = async () => {
    if (isLoadingWriteBet || isLoadingApprove) {
      return;
    }
    if (betValue === 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    if(bet === BetStatusEnum.DOWN){
      if (Number(Math.abs(Number(predictPercent))) >= 100) {
        toast.error('Please enter a valid amount');
        return;
      }
    }
    // const betNumber = +betValue * CreateNumberFromDecimal(Number(dataDecimalsUSDT));
    if (Number(dataAllowance?.toString()) / CreateNumberFromDecimal(Number(dataDecimalsUSDT)) < Number(betValue)) {
      // get approve USDT
      const writeApproveResult = await writeAsyncApprove({
        args: [PREDICTION_ADDRESS, maxUint256],
      });
      if (!writeApproveResult?.hash) {
        return;
      }
    } else {
      writeContractBet();
    }
  };

  const onChangeInput = useCallback((value?: string) => {
    if (!value) {
      setBetValue(0);
      return;
    }
    if (Number(value) > 100) return;
    if (Number(value) < 0) return;
    setBetValue(value);
  }, []);

  return (
    <>
      <AchieveList amount={`${totalPredictAmount ?? 0}`} count={`${participantCount ?? 0}`} />
      <div className={'w-fit h-fit relative mx-auto mt-[27px]'}>
        <div className={'absolute top-0 left-0.5 w-full h-full flex flex-col justify-center items-center'}>
          <span className={clsx('text-base font-poppins font-bold uppercase', 'text-bet-up')}>up</span>
          <span className={clsx('text-sm font-medium font-poppins uppercase', 'text-white opacity-50')}>
            +{upValue}%
          </span>
        </div>
        <BetUpIcon />
      </div>
      {/* {roundBetLog || isNextBet ? (
        <div
          className={
            'w-full h-[120px] rounded-[20px] border-2 border-live-card-border bg-live-card px-4 py-3 flex flex-col justify-center gap-2'
          }>
          <div className={'w-full h-[50px] rounded-md bg-[#7E7E7E] bg-opacity-50 flex justify-center items-center'}>
            {bet === BetStatusEnum.UP ? (
              <Image
                src={'/images/bet-up-last.svg'}
                alt={'bet-up-last'}
                height={26}
                width={150.93}
                className={'-ml-4'}
              />
            ) : (
              <Image src={'/images/bet-down-last.svg'} alt={'bet-down-last'} height={26} width={169.45} />
            )}
          </div>
          <div className={'flex flex-row justify-between items-center'}>
            <span className={'text-white text-sm opacity-60 font-medium font-roboto'}>Bet Amount</span>
            <span className={'text-white text-sm font-medium font-roboto'}>
              ${roundBetLog?.predictAmount || betValue}
            </span>
          </div>
        </div>
      ) : ( */}
      <div className={'h-[120px] flex flex-col items-center gap-6'}>
        <button
          className={
            'w-full h-[50px] rounded-md bg-bet-up flex justify-center items-center border-2 border-bet-up-border group '
          }
          onClick={() => {
            setBet(BetStatusEnum.UP);

            if (priceCurrent < Number(1)) {
              const newPrice = Number(priceCurrent).toFixed(10).toString()
              const lengNumber = newPrice.toString().length;
              let endNumer = 4;
              if (lengNumber > 7) {
                endNumer = 6;
              } else {
                endNumer = lengNumber - 1
              }
              const calculatePrice = (Number(newPrice)/100).toFixed(10);
              const totalPrice = (Number(newPrice) + Number(0.0.toFixed(lengNumber - endNumer)) + Number(calculatePrice) );
              setPrice(totalPrice);
            } else {
              const calculatePrice = (Number(priceCurrent)/100).toFixed(2);
              setPrice(priceCurrent + Number(calculatePrice));
            }

          }}>
          <Image
            src={'/icons/bet-up-icon.svg'}
            alt={'bet-up-icon'}
            height={26}
            width={96.36}
            className={'-ml-4 group-hover:scale-110 transition-all duration-500'}
          />
        </button>
        <button
          className={
            'w-full h-[50px] rounded-md bg-bet-down flex justify-center items-center border-2 border-bet-down-border group'
          }
          onClick={() => {
            setBet(BetStatusEnum.DOWN);
            if (priceCurrent < Number(1)) {
              const newPrice = Number(priceCurrent).toFixed(10).toString()
              const lengNumber = newPrice.toString().length;
              const calculatePrice = (Number(newPrice)/100).toFixed(10);
              const totalPrice = (Number(newPrice) - Number(0.0.toFixed(lengNumber + 1)) - Number(calculatePrice) );
              setPrice(totalPrice);
            } else {
              const calculatePrice = (Number(priceCurrent)/100);
              setPrice(priceCurrent - Number(calculatePrice));
            }
          }}>
          <Image
            src={'/icons/bet-down-icon.svg'}
            alt={'bet-down-icon'}
            height={26}
            width={115}
            className={'group-hover:scale-110 transition-all duration-500'}
          />
        </button>
      </div>
      {/* )} */}
      <div className={'w-fit h-fit relative mx-auto'}>
        <BetDownIcon />
        <div className={'absolute top-0 left-0.5 w-full h-full flex flex-col justify-center items-center'}>
          <span className={'text-white text-sm opacity-50 font-medium font-poppins uppercase'}>-{downValue}%</span>
          <span className={clsx('text-base font-poppins font-bold uppercase', 'text-bet-down')}>down</span>
        </div>
      </div>

      {bet && (
        <div
          className={clsx(
            'w-full absolute bottom-0 p-1 rounded-[20px] bg-border-gradient-bet left-0 rounded-b-[20px]',
            'z-20 transform transition-all duration-500',
            isShowMore ? 'h-[624px]' : 'h-[534px]'
          )}>
          <div
            className={clsx(
              'bg-gradient-bet w-full rounded-[18px] px-4 pt-8 pb-1 flex flex-col justify-between transform transition-all duration-400',
              isShowMore ? 'h-[616px]' : 'h-full'
            )}>
            <div className={'flex flex-col justify-between h-[530px]'}>
              <div className={'flex flex-row justify-between items-center'}>
                <button onClick={() => setBet(undefined)}>
                  <Image src={'/icons/back-arrow-icon.svg'} alt={'back-arrow-icon'} width={24} height={24} />
                </button>
                <div
                  className={clsx(
                    'w-[140px] h-[42px] rounded-l-full rounded-r-full flex justify-center items-center cursor-pointer',
                    bet === BetStatusEnum.UP ? 'bg-bet-up' : 'bg-bet-down'
                  )}
                  onClick={() => setBet(bet === BetStatusEnum.UP ? BetStatusEnum.DOWN : BetStatusEnum.UP)}>
                  {bet === BetStatusEnum.UP ? (
                    <Image
                      src={'/images/status-up.svg'}
                      alt={'bet-up-last'}
                      height={26}
                      width={75}
                      className={'-ml-4 transform transition-all duration-500'}
                    />
                  ) : (
                    <Image
                      src={'/images/status-down.svg'}
                      alt={'bet-down-last'}
                      height={26}
                      width={111}
                      className={'transform transition-all duration-500'}
                    />
                  )}
                </div>
              </div>
              <div>
                <p className={'text-white text-sm font-semibold font-poppins mb-2'}>Predict price in 24 hours</p>
                <div
                  className={'bg-white/5 px-2 rounded-[10px] h-[74px] flex flex-row justify-center items-center gap-6'}>
                  <CurrencyInput
                    id="input-example"
                    name="input-name"
                    className={
                      'text-white w-2/5 h-[48px] rounded-[8px] px-2 bg-[#06001E] border-0 text-base font-medium focus:border-0 hover:select-none focus:outline-none text-right input-number active:outline-none'
                    }
                    defaultValue={'0'}
                    value={predictPercent}
                    // disabled
                    decimalsLimit={2}
                    max={100}
                    suffix={'%'}
                    prefix={bet === BetStatusEnum.UP ? '+' : '-'}
                    step={0.01}
                    onValueChange={(value) => {
                      if (priceCurrent < Number(1)) {
                        const newPrice = Number((priceCurrent * Number(value)) / 100) + Number(priceCurrent);              
                        setPrice(Number(newPrice));
                      } else {
                        const newPrice = Number((priceCurrent * Number(value)) / 100) + Number(priceCurrent);
                        console.log(newPrice.toFixed(2));
                        setPrice(Number(newPrice.toFixed(2)));
                      }
                    }}
                  />
                  <CurrencyInput
                    id="input-example"
                    name="input-name"
                    className={clsx(
                      'text-white w-3/5 h-[48px] rounded-[8px] px-2 bg-[#06001E] border text-base font-medium focus:border-0 hover:select-none focus:outline-none text-right input-number active:outline-none',
                      isError ? 'border-[#EF4E6D]' : 'border-[#06001E]'
                    )}
                    value={(price < Number(0.001) ? (Number(price).toFixed(10)).toString() : price)}
                    onValueChange={(value) => {
                      if (isLoadingWriteBet) {
                        return;
                      }
                      const _price = Number.parseFloat(value ?? '');
                      setPrice(_price);
                      if (_price > priceCurrent) {
                        setBet(BetStatusEnum.UP);
                      } else {
                        setBet(BetStatusEnum.DOWN);
                      }
                    }}
                    decimalsLimit={(token.name === "Bitcoin" || token.name === "Ethereum") ? 2 : 10}
                    max={100}
                    prefix={'$'}
                    step={0.01}
                  />
                </div>
                {isError && (
                  <div className={'text-right font-poppins font-normal text-[10px] text-[#E73558] mt-1'}>
                    <p>Error! you must enter a price high or lower than current price</p>
                    <p>based on your “up” or “down Selection</p>
                  </div>
                )}
              </div>

              <div className={'w-full h-[52px] flex flex-col justify-between'}>
                <Range values={betValue} onChange={setBetValue} />
                <div
                  className={
                    'flex flex-row justify-between text-white text-xs font-normal font-poppins opacity-80 px-0.5'
                  }>
                  <span>$0</span>
                  <span>$100</span>
                </div>
              </div>
              <div
                className={
                  'w-full h-[48px] border border-[#C833EC] border-opacity-10 rounded-[15px] bg-[#C833EC] bg-opacity-10 px-5 flex flex-row justify-between items-center'
                }>
                <span className={'text-white font-semibold text-sm'}>USDT:</span>
                <CurrencyInput
                  id="input-example"
                  name="input-name"
                  className={
                    'bg-transparent text-white border-0 text-base font-normal text-opacity-50 focus:border-0 hover:select-none h-full w-full focus:outline-none text-right input-number active:outline-none'
                  }
                  defaultValue={betValue}
                  value={betValue}
                  decimalsLimit={2}
                  max={100}
                  prefix={'$'}
                  onValueChange={onChangeInput}
                  step={0.01}
                  allowNegativeValue={false}
                />
              </div>
              <button
                className={clsx(
                  'w-full h-[50px] rounded-l-lg rounded-r-lg bg-gradient-button',
                  'text-white font-medium text-base font-poppins'
                )}
                onClick={onSubmit}>
                Submit
              </button>
            </div>
            <PredictionLine isShowMore={isShowMore} setIsShowMore={setIsShowMore} ranks={roundBetLog ?? []} />
          </div>
        </div>
      )}
    </>
  );
}
