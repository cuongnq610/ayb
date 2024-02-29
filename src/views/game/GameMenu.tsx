'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { GameBetEnum } from '@/constants/constants';
import { UseCheckDevice } from '@/hooks/useCheckDevice';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const GameItems = [
 {
  id: 1,
   title: '15-Min',
   path: '/classic',
   icon: '/icons/classic.png',
   type: GameBetEnum.CLASSIC,
 },
  {
    id: 2,
    title: 'Daily',
    path: '/prediction',
    icon: '/icons/prediction.png',
    type: GameBetEnum.PREDICTION,
  },
];

export default function GameMenu() {
  const { isMobile } = UseCheckDevice();
  const router = usePathname();

  return (
    <div
      className={clsx(
        'flex flex-row items-center justify-between rounded-l-full rounded-r-full',
        'text-white font-pressStart2P border border-border-pink bg-background-pink font-semibold',
        isMobile ? 'max-w-[320px] h-[53px] p-1.5 text-sm mx-auto' : 'max-w-[416px] h-[70px] p-1.5 text-base'
      )}>
      {GameItems.map((item) => (
        <Link
          key={item.id}
          className={clsx(
            'uppercase h-full rounded-l-full rounded-r-full cursor-pointer',
            'transition-all duration-300 ease-in-out',
            'flex items-center justify-center text-white',
            'hover:bg-bg-active hover:text-white',
            (router === '/' && item.type === GameBetEnum.CLASSIC) || router === item.path
              ? 'bg-bg-active'
              : 'bg-transparent',
            isMobile ? 'w-[160px] py-0.5' : 'w-[200px] '
          )}
          href={item.path}>
          <Image
            src={item.icon}
            alt={item.title}
            width={48}
            height={48}
            className={clsx(isMobile ? 'w-[36px] h-[36px] mr-0.5' : 'w-12 h-12 mr-2')}
          />
          {item.title}
        </Link>
      ))}
    </div>
  );
}
