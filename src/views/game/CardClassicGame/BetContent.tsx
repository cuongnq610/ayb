/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from 'next/image';
import clsx from 'clsx';
import BetUpIcon from '@/components/images/BetUpIcon';
import BetDownIcon from '@/components/images/BetDownIcon';
import { BetStatusEnum, Symbols } from '@/constants/constants';
import CurrencyInput from 'react-currency-input-field';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Range from '@/components/common/Range';
import { toastErrorFn, toastSuccessFn } from '@/utils/toast';
import { UseCheckDevice } from '@/hooks/useCheckDevice';
import { useAccount, useContractRead, useContractWrite, useWaitForTransaction } from 'wagmi';
import contractABI from '@/blockchain/contractABI.json';
import { CLASSIC_ADDRESS, CONTRACT_USDT_ADDRESS } from '@/config/config';
import useApprove from '@/hooks/useApprove';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { NewUserRoundEntity } from '@/entity/UserRound';
import useGetDecimalsUSDT from '@/hooks/useGetDecimalsUSDT';
import CreateNumberFromDecimal from '@/utils/createNumberFromDecimal';
import { toast } from 'react-toastify';
import usdtABI from '@/blockchain/usdt_abi.json';
import { maxUint256 } from 'viem';
import { postUserBet } from '@/services/ClassicApiService';

interface Props {
  upValue?: number | string;
  downValue?: number | string;
  epoch: number;
  tokenAddress: string;
  symbol: string;
  roundBetLog?: NewUserRoundEntity;
  refetch: any;
  refreshPrizePool: any;
  setLoadingCard: (value: boolean) => void;
}

const minBet = 1;
const maxBet = 100;

export default function BetContent({
  upValue = 50,
  downValue = 50,
  symbol,
  epoch,
  tokenAddress,
  roundBetLog,
  refetch,
  refreshPrizePool,
  setLoadingCard,
}: Props) {
  const { isMobile } = UseCheckDevice();
  const { address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { data: dataDecimalsUSDT } = useGetDecimalsUSDT();
  const [bet, setBet] = useState<BetStatusEnum | undefined>();
  const [isNextBet, setIsNextBet] = useState<boolean>(false);
  const [betValue, setBetValue] = useState<number | string>(1);
  const betNumber = useMemo(() => +betValue * CreateNumberFromDecimal(Number(dataDecimalsUSDT)), [betValue]);

  const {
    isError: isErrorApprove,
    isLoading: isLoadingApprove,
    writeAsync: writeAsyncApprove,
    data: dataApprove,
  } = useApprove();
  const {
    data: dataBetUp,
    isError,
    isLoading: isLoadingWriteBetUp,
    write: writeBetUp,
  } = useContractWrite({
    address: CLASSIC_ADDRESS as `0x${string}`,
    abi: contractABI,
    functionName: 'betUp',
    onSuccess: async (data) => {
      refetch().then();

      await postUserBet({
        userAddress: address,
        tokenAddress: tokenAddress,
        epoch : epoch,
        amount: Number(betNumber.toFixed(2)) / 1e6,
        betUp: true,
        isUp : false,
        transactionHash: data?.hash,
      });


      setTimeout(() => {
        setBet(undefined);
        setIsNextBet(true);
        refreshPrizePool().then();
        setLoadingCard(false);
        toastSuccessFn(isMobile, data?.hash);
      }, 5000);
    },
  });

  const { data: dataAllowance } = useContractRead({
    address: CONTRACT_USDT_ADDRESS as `0x${string}`,
    abi: usdtABI,
    args: [address, CLASSIC_ADDRESS],
    functionName: 'allowance',
    watch: true,
  });

  const {
    data: dataBetDown,
    isError: isErrorWriteBetDown,
    isLoading: isLoadingWriteBetDown,
    write: writeBetDown,
  } = useContractWrite({
    address: CLASSIC_ADDRESS as `0x${string}`,
    abi: contractABI,
    functionName: 'betDown',
    onSuccess: async (data) => {
      refetch().then();
      await postUserBet({
        userAddress: address,
        tokenAddress: tokenAddress,
        epoch : epoch,
        amount: Number(betNumber.toFixed(2)) / 1e6,
        betUp: false,
        isUp : false,
        transactionHash: data?.hash,
      });
      
      setTimeout(() => {
        setBet(undefined);
        setIsNextBet(true);
        refreshPrizePool().then();
        setLoadingCard(false);
        toastSuccessFn(isMobile, data?.hash);
      }, 5000);
    },
  });
  useWaitForTransaction({
    hash: dataApprove?.hash,
    onSuccess() {
      if (bet === BetStatusEnum.UP) {
        writeBetUp({
          args: [symbol === Symbols.ETH ? 1 : 0, Number(betNumber.toFixed(2))],
        });
      } else {
        writeBetDown({
          args: [symbol === Symbols.ETH ? 1 : 0, Number(betNumber.toFixed(2))],
        });
      }
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const onChangeInput = useCallback((value?: string) => {
    if (isLoadingWriteBetUp || isLoadingWriteBetDown) {
      return;
    }
    if (!value) {
      setBetValue(minBet);
      return;
    }
    if (Number(value) > maxBet) return;
    if (Number(value) <= minBet) return;
    setBetValue(value);
  }, []);

  useEffect(() => {
    if (isErrorWriteBetDown || isError) {
      setLoadingCard(false);
      if (dataBetDown?.hash ?? dataBetUp?.hash) {
        toastErrorFn(isMobile, dataBetDown?.hash ?? dataBetUp?.hash);
      } else {
        toastErrorFn(isMobile, '', 'Round not bettable');
      }
    }
  }, [isErrorWriteBetDown, isError]);

  useEffect(() => {
    if (isErrorApprove) {
      setLoadingCard(false);
      toastErrorFn(isMobile, '', 'User denied transaction signature.');
    }
  }, [isErrorApprove]);

  useEffect(() => {
    if (roundBetLog) {
      setIsNextBet(true);
    } else {
      setIsNextBet(false);
    }
  }, [roundBetLog]);

  const onSubmit = async () => {
    if (isLoadingWriteBetUp || isLoadingWriteBetDown || isLoadingApprove) {
      return;
    }

    if (betValue === 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    setLoadingCard(true);
    if (Number(dataAllowance?.toString()) / CreateNumberFromDecimal(Number(dataDecimalsUSDT)) < Number(betValue)) {
      // get approve USDT
      await writeAsyncApprove({
        args: [CLASSIC_ADDRESS, maxUint256],
      });
    } else {
      if (bet === BetStatusEnum.UP) {
        writeBetUp({
          args: [symbol === Symbols.ETH ? 1 : 0, Number(betNumber.toFixed(2))],
        });
      } else {
        writeBetDown({
          args: [symbol === Symbols.ETH ? 1 : 0, Number(betNumber.toFixed(2))],
        });
      }
    }
  };

  const onHandleBet = useCallback(
    (betStatus: BetStatusEnum) => {
      if (!address && openConnectModal) {
        openConnectModal();
        return;
      }
      setBet(betStatus);
    },
    [address, openConnectModal]
  );

  useEffect(() => {
    if (roundBetLog) {
      setBet(roundBetLog?.betUp ? BetStatusEnum.UP : BetStatusEnum.DOWN);
    }
  }, [roundBetLog]);

  return (
    <>
      <div className={'w-fit h-fit relative mx-auto'}>
        <div className={'absolute top-0 left-0.5 w-full h-full flex flex-col justify-center items-center'}>
          <span className={clsx('text-base font-pressStart2P font-bold uppercase', 'text-bet-up')}>up</span>
          <span className={clsx('text-sm font-medium font-pressStart2P uppercase', 'text-white opacity-50')}>
            +{upValue}%
          </span>
        </div>
        <BetUpIcon fill={isNextBet ? '#36363680' : undefined} />
      </div>
      {isNextBet || roundBetLog ? (
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
                width={100}
                className={'-ml-4'}
              />
            ) : (
              <Image src={'/images/bet-down-last.svg'} alt={'bet-down-last'} height={26} width={140.45} />
            )}
          </div>
          <div className={'flex flex-row justify-between items-center'}>
            <span className={'text-white text-sm opacity-60 font-medium font-roboto'}>Bet Amount</span>
            <span className={'text-white text-sm font-medium font-roboto'}>${roundBetLog?.amount || betValue}</span>
          </div>
        </div>
      ) : (
        <div className={'h-[120px] flex flex-col items-center gap-6'}>
          <button
            className={
              'w-full h-[50px] rounded-md bg-bet-up flex justify-center items-center border-2 border-bet-up-border group'
            }
            onClick={() => onHandleBet(BetStatusEnum.UP)}>
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
            onClick={() => onHandleBet(BetStatusEnum.DOWN)}>
            <Image
              src={'/icons/bet-down-icon.svg'}
              alt={'bet-down-icon'}
              height={26}
              width={115}
              className={'group-hover:scale-110 transition-all duration-500'}
            />
          </button>
        </div>
      )}
      <div className={'w-fit h-fit relative mx-auto'}>
        <BetDownIcon fill={isNextBet ? '#36363680' : undefined} />
        <div className={'absolute top-0 left-0.5 w-full h-full flex flex-col justify-center items-center'}>
          <span className={'text-white text-sm opacity-50 font-medium font-pressStart2P uppercase'}>-{downValue}%</span>
          <span className={clsx('text-base font-pressStart2P font-bold uppercase', 'text-bet-down')}>down</span>
        </div>
      </div>
      {bet && !isNextBet && (
        <div
          className={clsx(
            'w-full absolute bottom-0 p-1 rounded-[20px] bg-border-gradient-bet left-0 rounded-b-[20px]',
            'h-[360px] z-40 transition-all duration-500'
          )}>
          <div className={'bg-gradient-bet w-full h-full rounded-[18px] px-4 py-8 flex flex-col justify-between'}>
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
            <div className={'w-full h-[52px] flex flex-col justify-between'}>
              <Range values={betValue} onChange={(_value) => onChangeInput(_value + '')} min={minBet} max={maxBet} />
              <div
                className={
                  'flex flex-row justify-between text-white text-xs font-normal font-poppins opacity-80 px-0.5'
                }>
                <span>${minBet}</span>
                <span>${maxBet}</span>
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
                max={maxBet}
                prefix={'$'}
                onValueChange={onChangeInput}
                step={1}
                allowNegativeValue={false}
              />
            </div>
            <button
              className={clsx(
                'w-full h-[50px] rounded-l-lg rounded-r-lg bg-gradient-button',
                'text-white font-medium text-base font-pressStart2P'
              )}
              disabled={isLoadingWriteBetUp || isLoadingWriteBetDown}
              onClick={onSubmit}>
              Submit
            </button>
          </div>
        </div>
      )}
    </>
  );
}
