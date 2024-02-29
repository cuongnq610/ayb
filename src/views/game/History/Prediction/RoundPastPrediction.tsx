/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from 'next/image';
import clsx from 'clsx';
import { useAccount, useContractWrite, useWaitForTransaction } from 'wagmi';
import predictionABI from '@/blockchain/predictionABI.json';

import { PREDICTION_ADDRESS } from '@/config/config';
import { toastErrorClaimFn, toastSuccessClaimFn } from '@/utils/toast';
import { Dialog } from '@headlessui/react';
import { useMemo, useState } from 'react';
import RoundPastItem from './RoundPastItem';
import useGetDecimalsUSDT from '@/hooks/useGetDecimalsUSDT';
import CreateNumberFromDecimal from '@/utils/createNumberFromDecimal';
import { UseCheckDevice } from '@/hooks/useCheckDevice';
import { updateClaimResult } from '@/services/PredictionApiService';

interface Props {
  history?: Array<any>;
  getHistoryPridict: () => void;
}

export default function RoundPastPrediction({ history, getHistoryPridict }: Props) {
  const { isMobile } = UseCheckDevice();
  const { address } = useAccount();

  const [isShowCollectPopup, setIsShowCollectPopup] = useState<boolean>(false);
  const [itemClaim, setItemClaim] = useState<any>();
  const { data: dataClaim, write } = useContractWrite({
    address: PREDICTION_ADDRESS as `0x${string}`,
    abi: predictionABI,
    functionName: 'claim',
    onError(error) {
      console.log(error);
    },
  });

  const { data: dataDecimalsUSDT } = useGetDecimalsUSDT();
  const showReward = useMemo(() => {
    return Number(itemClaim?.totalReward ?? 0).toFixed(2);
  }, [itemClaim]);

  useWaitForTransaction({
    hash: dataClaim?.hash,
    onSuccess: async () => {
      toastSuccessClaimFn(isMobile, dataClaim?.hash);
      setIsShowCollectPopup(false);
      await updateClaimBE();
    },
    onError() {
      toastErrorClaimFn(isMobile, dataClaim?.hash);
    },
  });

  const updateClaimBE = async () => {
    await updateClaimResult({
      userAddress: address,
      epoch: itemClaim?.yourHistory[0]?.round?.epoch,
      tokenId: itemClaim?.yourHistory[0]?.tokenId,
    });
    await getHistoryPridict();
  };
  return (
    <>
      {history?.map((item: any, index) => (
        <RoundPastItem
          key={index}
          item={item}
          decimalsUSDT={dataDecimalsUSDT || 0}
          setIsShowCollectPopup={setIsShowCollectPopup}
          setItemClaim={setItemClaim}
        />
      ))}
      {isShowCollectPopup && itemClaim && (
        <Dialog
          open={true}
          onClose={() => { }}
          as="div"
          className="fixed inset-0 z-[9999999] flex items-center justify-center h-screen w-screen backdrop-blur bg-black bg-opacity-50">
          <div className="w-[321px] h-[386px] rounded-[20px] bg-gradient-collect shadow-2xl px-5 pb-4 flex flex-col drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
            <div className={'flex flex-row justify-between items-center h-16 mt-2 border-b border-white/10'}>
              <span className={'text-white font-bold text-base'}>{'Collect Winnings'}</span>
              <button onClick={() => setIsShowCollectPopup(false)}>
                <Image src={'/icons/close-popup-icon.svg'} alt={'close-popup-icon'} width={24} height={24} />
              </button>
            </div>
            <div className={'pt-8 flex flex-col'}>
              <Image src={'/icons/win.svg'} alt={'win-icon'} width={103} height={103} className={'mx-auto'} />
              <p className={'text-white font-bold text-sm flex flex-row justify-between items-center mt-3'}>
                <span>Collecting</span>
                <span>{showReward} USDT</span>
              </p>
              <p className={'text-center text-xs font-medium text-white mt-10'}>
                From round {itemClaim?.yourHistory[0]?.round?.epoch} uncollected
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
                      itemClaim?.yourHistory[0].round?.epoch,
                      JSON.parse(itemClaim?.yourHistory[0]?.proof ?? `[]`),
                      BigInt(
                        Math.trunc(
                          Number(itemClaim?.totalReward) * CreateNumberFromDecimal(Number(dataDecimalsUSDT))
                        )
                      ),
                    ],
                  });
                setIsShowCollectPopup(false);
              }}>
              Confirm
            </button>
          </div>
        </Dialog>
      )}
    </>
  );
}
