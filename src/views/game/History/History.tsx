import Image from 'next/image';
import { UseCheckDevice } from '@/hooks/useCheckDevice';
import clsx from 'clsx';
import { useAppDispatch } from '@/redux/hook';
import { changeShowHistory } from '@/redux/slices/gameSlice';
import { TypeHistoryEnum } from '@/constants/constants';
import { Fragment, useState } from 'react';
import RoundContent from '@/views/game/History/RoundContent';
import PNLContent from '@/views/game/History/PNLContent';
import { Dialog, Transition } from '@headlessui/react';

const menuItems = [
  {
    id: 1,
    title: 'Rounds',
    type: TypeHistoryEnum.ROUNDS,
  },
  {
    id: 2,
    title: 'PNL',
    type: TypeHistoryEnum.PNL,
  },
];

export default function History() {
  const { isMobile } = UseCheckDevice();
  const dispatch = useAppDispatch();
  const [type, setType] = useState<TypeHistoryEnum>(TypeHistoryEnum.ROUNDS);

  return (
    <Transition
      show={true}
      as={Fragment}
      enter="transition-transform duration-700"
      enterFrom={isMobile ? 'translate-y-[100vh]' : 'translate-x-[424px]'}
      enterTo={isMobile ? 'translate-y-0' : 'translate-x-0'}
      leave="transition-transform duration-700"
      leaveFrom={isMobile ? 'translate-y-0' : 'translate-x-0'}
      leaveTo={isMobile ? 'translate-y-[100vh]' : 'translate-x-[424px]'}
      appear={true}>
      <Dialog
        open={true}
        onClose={() => {
          dispatch(changeShowHistory(false));
        }}
        as="aside"
        className={clsx(
          isMobile ? 'z-[55]' : 'z-[102]',
          'fixed inset-0 left-auto transition-all duration-300 ease-in-out pt-4'
        )}>
        <div
          className={clsx(
            isMobile ? 'w-screen h-[calc(100vh_-_210px)] mt-[210px] pt-3 pb-3' : 'w-[424px] h-screen pt-28',
            'bg-[#140C34]'
          )}>
          <div className={'flex flex-row items-center justify-between px-6'}>
            <span className={'font-semibold text-base text-white font-pressStart2P'}>History</span>
            <button
              className={
                'bg-transparent border-transparent focus:outline-none active:outline-none text-white/60 font-normal text-xs flex flex-row items-center gap-1'
              }
              onClick={() => dispatch(changeShowHistory(false))}>
              Close
              <Image
                src={'/icons/close-history.svg'}
                alt={'close-history-icon'}
                width={24}
                height={24}
                className={'w-6 h-6 object-contain'}
              />
            </button>
          </div>
          <div
            className={clsx(
              'flex flex-row items-center justify-between rounded-l-full rounded-r-full mx-auto',
              'text-white font-poppins bg-white/10',
              isMobile
                ? 'max-w-[320px] h-[42px] p-1.5 text-sm mx-auto mt-4'
                : 'max-w-[383px] h-[52px] p-1.5 text-base mt-6'
            )}>
            {menuItems.map((item) => (
              <button
                key={item.id}
                className={clsx(
                  'uppercase h-full rounded-l-full rounded-r-full cursor-pointer',
                  'transition-all duration-300 ease-in-out',
                  'flex items-center justify-center text-white',
                  'hover:bg-bg-active hover:text-white',
                  type === item.type ? 'bg-bg-active font-medium font-pressStart2P' : 'bg-transparent font-normal font-pressStart2P',
                  isMobile ? 'w-[160px] py-0.5' : 'w-[200px] '
                )}
                onClick={() => {
                  setType(item.type);
                }}>
                {item.title}
              </button>
            ))}
          </div>
          {type === TypeHistoryEnum.ROUNDS && <RoundContent />}
          {type === TypeHistoryEnum.PNL && <PNLContent />}
        </div>
      </Dialog>
    </Transition>
  );
}
