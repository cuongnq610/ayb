'use client';

import { UseCheckDevice } from "@/hooks/useCheckDevice";
import { useAppSelector } from "@/redux/hook";
import { gameSelector } from "@/redux/slices/gameSlice";
import History from "@/views/game/History/History";
import Referral from "@/views/referral/Referral";
import { Transition } from "@headlessui/react";
import clsx from "clsx";
import { Fragment } from "react";
import Scrollbars from "react-custom-scrollbars-2";

export default function PredictionPage() {
    const { isMobile } = UseCheckDevice();
  const { isShowHistory } = useAppSelector(gameSelector);

  console.log({isShowHistory})

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
          {!(isMobile && isShowHistory) && (
            <section className={clsx('w-full', isMobile ? 'pt-48 h-fit' : 'pt-28', isShowHistory && '-pl-[424px]')}>
              <Referral />
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