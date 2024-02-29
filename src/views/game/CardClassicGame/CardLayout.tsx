import { ReactElement } from 'react';
import clsx from 'clsx';

interface Props {
  children: ReactElement;
  className?: string;
}

export default function CardClassicGame({ children, className = 'h-[300px]' }: Props) {
  return (
    <div
      className={clsx(
        'w-full absolute bottom-0 p-1 rounded-[20px] bg-border-gradient-game-card left-0 rounded-b-[20px]',
        className
      )}>
      <div className={'bg-card-content w-full h-full rounded-[18px] p-4 flex flex-col'}>{children}</div>
    </div>
  );
}
