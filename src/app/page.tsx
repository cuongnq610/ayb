/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Fragment, useEffect } from 'react';
import ClassicGame from '@/views/game/ClassicGame';
import DesktopHeader from '@/views/game/header/DesktopHeader';
import { UseCheckDevice } from '@/hooks/useCheckDevice';
import MobileHeader from '@/views/game/header/MobileHeader';
import clsx from 'clsx';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { changeCloseTimestamp, countDownCloseTimestamp, gameSelector } from '@/redux/slices/gameSlice';
import History from '@/views/game/History/History';
import { Transition } from '@headlessui/react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import contractABI from '@/blockchain/contractABI.json';
import { CLASSIC_ADDRESS } from '@/config/config';
import { useContractRead } from 'wagmi';

export default function Game() {
  const { isMobile } = UseCheckDevice();

  const dispatch = useAppDispatch();
  const { isShowHistory, closeTimestamp } = useAppSelector(gameSelector);
  const { data: dataCurrentEpoch } = useContractRead({
    address: CLASSIC_ADDRESS as `0x${string}`,
    abi: contractABI,
    functionName: 'currentEpoch',
    watch: true,
  });
  const { data: dataCurrentRound } = useContractRead({
    address: CLASSIC_ADDRESS as `0x${string}`,
    abi: contractABI,
    functionName: 'rounds',
    args: [Number(dataCurrentEpoch)],
    watch: true,
  });

  useEffect(() => {
    dispatch(
      changeCloseTimestamp(
        Math.max(0, Number((dataCurrentRound as Array<any>)?.[2] ?? 0) - Math.floor(Date.now() / 1000))
      )
    );
    const interval = setInterval(() => {
      dispatch(countDownCloseTimestamp());
      closeTimestamp <= 0 && clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [dataCurrentRound, closeTimestamp]);

  return (
    <Scrollbars
      className={clsx('w-full', isMobile ? '!h-[100dvh]' : '!h-screen')}
      // className={clsx('w-full', isMobile ? 'max-h-[calc(100dvh_-_95px)] !h-screen' : '!h-screen')}
      autoHide={isShowHistory}
      renderThumbHorizontal={(props) => (
        <div {...props} className="bg-[#B392BC] w-1.5 rounded-l-full rounded-r-full z-[99999]" />
      )}
      renderThumbVertical={(props) => (
        <div {...props} className="bg-[#B392BC] w-1.5 rounded-t-full rounded-b-full z-[99999]" />
      )}>
      <main
        className={clsx(
          isShowHistory && !isMobile ? 'overflow-hidden flex flex-row justify-end' : '',
          isMobile && 'h-fit'
        )}>
        <section
          className={clsx(
            'container flex min-h-screen flex-col items-center justify-between',
            isMobile ? 'p-4' : 'p-10'
          )}>
          <section className={'container fixed h-fit pt-16 pb-6 z-[99] bg-menu'}>
            {isMobile ? <MobileHeader /> : <DesktopHeader />}
          </section>
          {!(isMobile && isShowHistory) && (
            <section className={clsx('w-full', isMobile ? 'pt-48 h-fit' : 'pt-28', isShowHistory && '-pl-[424px]')}>
              <ClassicGame />
            </section>
          )}
        </section>
        {isShowHistory && <History />}
        {isShowHistory && !isMobile && (
          <Transition
            show={isShowHistory && !isMobile}
            as={Fragment}
            enter="transition-all duration-700"
            enterFrom={'w-0'}
            enterTo={'w-[424px]'}
            leave="transition-all duration-700"
            leaveFrom={'w-[424px]'}
            leaveTo={'w-0'}
            appear={true}>
            <div className={'w-[424px] h-screen'} />
          </Transition>
        )}
      </main>
    </Scrollbars>
  );
}