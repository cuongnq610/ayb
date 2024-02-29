import Image from 'next/image';
import { UseCheckDevice } from '@/hooks/useCheckDevice';
import clsx from 'clsx';
import { toast } from 'react-toastify';

export default function ToastCollectWinning() {
  const { isMobile } = UseCheckDevice();
  return (
    <div
      className={clsx(
        'flex flex-row gap-3 px-2 rounded-[42px] h-[118px] bg-[#C428EC] items-center justify-center z-[1000]',
        isMobile ? 'w-[calc(100vw_-_20px)]' : 'w-[400px]'
      )}>
      <div
        className={
          'w-[295px] h-[63px] rounded-l-full rounded-r-full bg-[#F4C8FF] flex flex-row justify-center items-center relative'
        }>
        <Image
          src={'/icons/cup-win.png'}
          alt={'cup-win'}
          width={119}
          height={119}
          className={'absolute -top-10 left-0'}
        />
        <span
          className={
            'capitalize font-semibold bg-clip-text text-transparent font-pressStart2P text-sm bg-gradient-to-r from-[#6F1BDA] to-[#E73558] ml-10'
          }>
          collect winnings
        </span>
      </div>
      <Image
        src={'/icons/close.svg'}
        alt={'close-icon'}
        width={24}
        height={24}
        className={'cursor-pointer'}
        onClick={() => {
          toast.clearWaitingQueue();
        }}
      />
    </div>
  );
}
