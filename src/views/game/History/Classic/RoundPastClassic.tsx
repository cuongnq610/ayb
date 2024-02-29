/* eslint-disable @typescript-eslint/no-explicit-any */
import RoundPastItem from '@/views/game/History/Classic/RoundPastItem';
import useGetDecimalsUSDT from '@/hooks/useGetDecimalsUSDT';
import { Dialog } from '@headlessui/react';
import Image from 'next/image';
import clsx from 'clsx';
import { useContractWrite, useWaitForTransaction } from 'wagmi';
import { CLASSIC_ADDRESS } from '@/config/config';
import contractABI from '@/blockchain/contractABI.json';
import { toastErrorClaimFn, toastErrorFn, toastSuccessClaimFn } from '@/utils/toast';
import { useState } from 'react';
import { AddressToken, StatusRoundEnum } from '@/constants/constants';
import BigNumber from 'bignumber.js';
import { UseCheckDevice } from '@/hooks/useCheckDevice';
import { HistoryClassic } from '@/entity/History';
import { useAppDispatch } from '@/redux/hook';
import { changeShowHistory } from '@/redux/slices/gameSlice';

interface Props {
  history?: Array<HistoryClassic>;
  refetchHistory: any;
}

export default function RoundPastClassic({ history, refetchHistory }: Props) {
  const { data: dataDecimalsUSDT } = useGetDecimalsUSDT();
  const { isMobile } = UseCheckDevice();
  const dispatch = useAppDispatch();

  const [isShowCollectPopup, setIsShowCollectPopup] = useState<boolean>(false);
  const [isShowRefundPopup, setIsShowRefundPopup] = useState<boolean>(false);
  const { data: dataClaim, write } = useContractWrite({
    address: CLASSIC_ADDRESS as `0x${string}`,
    abi: contractABI,
    functionName: 'claim',
    onError(err) {
      console.log('err', err);
      toastErrorFn(isMobile, '', 'Claim failed');
    },
    onSuccess() { },
  });

  useWaitForTransaction({
    hash: dataClaim?.hash,
    onSuccess: async () => {
      setIsShowCollectPopup(false);
      setIsShowRefundPopup(false);
      toastSuccessClaimFn(isMobile, dataClaim?.hash);
      setTimeout(() => {
        refetchHistory();
      }, 3000);
    },
    onError() {
      toastErrorClaimFn(isMobile, dataClaim?.hash);
    },
  });

  const roundUncollectedWinning = history?.filter((item) => !item?.claimed && item?.isWinner).length || 0;
  const roundUncollectedRefund = history?.filter((item) => !item?.claimed && item?.isWinner).length || 0;

  const totalReward =
    history?.reduce((acc, item) => {
      if (!item?.claimed && item?.isWinner) {
        // const resultPay = getResult(
        //   item?.round.isUp ? item?.round.totalBetUpAmount : item?.round.totalBetDownAmount,
        //   item?.amount,
        //   item?.round.totalBetAmount
        // );
        return acc.plus(BigNumber(item?.reward));
      }
      return acc;
    }, BigNumber(0)) || BigNumber(0);

  const totalRefund =
    history?.reduce((acc, item) => {
      if (!item?.claimed && item?.status === StatusRoundEnum.REFUNDED) {
        return acc.plus(BigNumber(item?.amount));
      }
      return acc;
    }, BigNumber(0)) || BigNumber(0);

  return (
    <>
      {history &&
        history.map((item, index) => (
          <RoundPastItem
            key={index}
            item={item}
            decimalsUSDT={dataDecimalsUSDT || 0}
            setIsShowCollectPopup={setIsShowCollectPopup}
            setIsShowRefundPopup={setIsShowRefundPopup}
          />
        ))}
      {isShowCollectPopup && roundUncollectedWinning > 0 && (
        <Dialog
          open={true}
          onClose={() => { }}
          as="div"
          className="fixed inset-0 z-[9999999] flex items-center justify-center h-screen w-screen backdrop-blur bg-black bg-opacity-50">
          <div className="w-[321px] h-[386px] rounded-[20px] bg-gradient-collect shadow-2xl px-5 pb-4 flex flex-col drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
            <div className={'flex flex-row justify-between items-center h-16 mt-2 border-b border-white/10'}>
              <span className={'text-white font-bold text-base'}>Collect Winnings</span>
              <button onClick={() => setIsShowCollectPopup(false)}>
                <Image src={'/icons/close-popup-icon.svg'} alt={'close-popup-icon'} width={24} height={24} />
              </button>
            </div>
            <div className={'pt-8 flex flex-col'}>
              <Image src={'/icons/win.svg'} alt={'win-icon'} width={103} height={103} className={'mx-auto'} />
              <p className={'text-white font-bold text-sm flex flex-row justify-between items-center mt-3'}>
                <span>Collecting</span>
                <span>{totalReward.toNumber()} USDT</span>
              </p>
              <p className={'text-center text-xs font-medium text-white mt-10'}>
                From {roundUncollectedWinning} uncollected rounds
              </p>
            </div>
            <button
              className={clsx(
                'w-full h-[50px] rounded-l-lg rounded-r-lg bg-gradient-button',
                'text-white font-medium text-base font-poppins mt-auto'
              )}
              onClick={() => {
                history?.length &&
                  history.length > 0 &&
                  write?.({
                    args: [
                      Array.from(
                        history
                          .filter(
                            (item) => item?.isWinner && !item?.claimed && item?.status === StatusRoundEnum.FINALIZED
                          )
                          .map((item) => [item?.tokenAddress.toLowerCase() === AddressToken.BTC.toLowerCase() ? 0 : 1])
                      ),

                      history
                        .filter(
                          (item) => item?.isWinner && !item?.claimed && item?.status === StatusRoundEnum.FINALIZED
                        )
                        .map((item) => item.epoch),
                    ],
                  });
                dispatch(changeShowHistory(false));
                setIsShowCollectPopup(false);
              }}>
              Confirm
            </button>
          </div>
        </Dialog>
      )}
      {isShowRefundPopup && roundUncollectedRefund > 0 && (
        <Dialog
          open={true}
          onClose={() => { }}
          as="div"
          className="fixed inset-0 z-[9999999] flex items-center justify-center h-screen w-screen backdrop-blur bg-black bg-opacity-50">
          <div className="w-[321px] h-[386px] rounded-[20px] bg-gradient-collect shadow-2xl px-5 pb-4 flex flex-col drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
            <div className={'flex flex-row justify-between items-center h-16 mt-2 border-b border-white/10'}>
              <span className={'text-white font-bold text-base'}>Claim Refund</span>
              <button onClick={() => setIsShowRefundPopup(false)}>
                <Image src={'/icons/close-popup-icon.svg'} alt={'close-popup-icon'} width={24} height={24} />
              </button>
            </div>
            <div className={'pt-8 flex flex-col'}>
              <Image src={'/icons/win.svg'} alt={'win-icon'} width={103} height={103} className={'mx-auto'} />
              <p className={'text-white font-bold text-sm flex flex-row justify-between items-center mt-3'}>
                <span>Collecting</span>
                <span>{totalRefund.toNumber()} USDT</span>
              </p>
              <p className={'text-center text-xs font-medium text-white mt-10'}>
                From {roundUncollectedRefund} uncollected rounds
              </p>
            </div>
            <button
              className={clsx(
                'w-full h-[50px] rounded-l-lg rounded-r-lg bg-gradient-button',
                'text-white font-medium text-base font-poppins mt-auto'
              )}
              onClick={() => {
                history?.length &&
                  history.length > 0 &&
                  write?.({
                    args: [
                      Array.from(
                        history
                          .filter((item) => item?.status === StatusRoundEnum.REFUNDED && !item?.claimed)
                          .map((item) => [item?.tokenAddress])
                      ),
                      history
                        .filter((item) => item?.status === StatusRoundEnum.REFUNDED && !item?.claimed)
                        .map((item) => item?.epoch),
                    ],
                  });
                setIsShowRefundPopup(false);
                dispatch(changeShowHistory(false));
              }}>
              Confirm
            </button>
          </div>
        </Dialog>
      )}
    </>
  );
}
