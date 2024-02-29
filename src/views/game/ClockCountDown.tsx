import Image from 'next/image';
import clsx from 'clsx';
import { UseCheckDevice } from '@/hooks/useCheckDevice';

interface Props {
  className?: string;
  time: string;
  type: '15m' | '24h';
}

export default function ClockCountDown({ className, time, type = '15m' }: Props) {
  const { isMobile } = UseCheckDevice();
  return (
    <div
      className={clsx(
        'h-[38px] rounded-l-full rounded-r-full bg-bg-coins flex items-center gap-2 relative',
        className,
        isMobile ? 'w-[80px] justify-end pr-8' : 'w-[135px]  justify-start pl-3'
      )}>
      <Image src={'/icons/clock.png'} alt={'coins'} width={54.81} height={60} className={'absolute -top-3 -right-6'} />
      <span
        className={clsx(
          isMobile ? 'flex flex-col items-center justify-end gap-0' : 'flex flex-row items-center justify-center gap-2'
        )}>
        <span className={clsx('font-semibold font-poppins text-pink-text', isMobile ? 'text-xs' : 'text-2xl w-[63px]')}>
          {time}
        </span>
        <span
          className={clsx(
            'font-poppins font-medium text-white opacity-50',
            isMobile ? 'text-[8px] w-full text-end' : 'text-xs'
          )}>
          {type}
        </span>
      </span>
    </div>
  );
}
