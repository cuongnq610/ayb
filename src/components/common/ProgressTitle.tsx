import clsx from 'clsx';

interface ProgressTitleProps {
  title?: string;
  progress?: string;
  className?: string;
  closeTimestamp: number;
}

export default function ProgressTitle({
  title = 'LIVE',
  progress = '03:34',
  className = 'w-[125px]',
  closeTimestamp,
}: ProgressTitleProps) {
  return (
    <div className={clsx(className, 'flex flex-col justify-between h-[18px]')}>
      <div className={'flex flex-row justify-between text-[#FFCA43] text-[10px] leading-[10px] font-poppins'}>
        <span className={''}>{title}</span>
        <span className={''}>{progress}</span>
      </div>
      <div className={'w-full h-1 rounded-l-[20px] rounded-r-[20px] bg-[#311626]'}>
        <div
          className={clsx(
            'h-full rounded-l-[20px] rounded-r-[20px] bg-[#FFCA43]',
            'transition-all duration-1000 ease-in-out'
          )}
          style={{
            width: `${(closeTimestamp / 900) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}
