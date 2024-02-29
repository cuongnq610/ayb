'use client';

import clsx from 'clsx';
import { UseCheckDevice } from '@/hooks/useCheckDevice';
import { useAppSelector } from '@/redux/hook';
import { gameSelector } from '@/redux/slices/gameSlice';
import PredictionGame from '@/views/game/PredictionGame';
import { Fragment } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import MobileHeader from '@/views/game/header/MobileHeader';
import DesktopHeader from '@/views/game/header/DesktopHeader';
import History from '@/views/game/History/History';
import { Transition } from '@headlessui/react';

export default function PredictionPage() {
  const { isMobile } = UseCheckDevice();
  const { isShowHistory } = useAppSelector(gameSelector);

  // const [gameType, setGameType] = useState<GameBetEnum>(GameBetEnum.CLASSIC);

  // const { loading, error, data } = useQuery(GET_USER_DATA, { client });

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
              <PredictionGame />
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
