import Image from 'next/image';
import clsx from 'clsx';

export default function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        'w-full h-full z-10 absolute top-0 left-0 backdrop-blur backdrop-opacity-75 bg-white/10',
        className
      )}>
      <div className={'flex flex-col items-center justify-center h-full'}>
        <Image src={'/spinner.svg'} alt={'spinner'} width={60} height={60} />
      </div>
    </div>
  );
}
