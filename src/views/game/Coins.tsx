import Image from 'next/image';
import clsx from 'clsx';
import { UseCheckDevice } from '@/hooks/useCheckDevice';
import formatWithCommas from '@/utils/formatWithCommas';

interface Props {
  value: number | string;
  currency: string;
}

export default function Coins({ value, currency }: Props) {
  const { isMobile } = UseCheckDevice();
  return (
    <div
      className={clsx(
        'rounded-l-full rounded-r-full bg-bg-coins flex items-center gap-2 relative',
        isMobile
          ? 'h-[39px] min-w-[80px] justify-start pl-6 pr-1'
          : 'h-[57px] min-w-[147px] justify-end pl-14 pr-8 ml-10'
      )}>
      <Image
        src={'/icons/coins.png'}
        alt={'coins'}
        width={87}
        height={62}
        className={clsx(
          'absolute top-0 object-contain',
          isMobile ? 'w-[47.05px] h-[37px] -left-7' : 'w-[87px] h-[62px] -left-10'
        )}
      />
      <span
        className={clsx(
          isMobile
            ? 'flex flex-col items-center justify-center gap-0'
            : 'flex flex-row items-center justify-center gap-2'
        )}>
        <span className={clsx('font-semibold font-poppins text-pink-text', isMobile ? 'text-xs' : 'text-2xl')}>
          {formatWithCommas(Number(value.toString().replaceAll(',','')).toFixed(2))}
        </span>
        <span
          className={clsx(
            'font-poppins font-medium text-white opacity-50 uppercase',
            isMobile ? 'text-[8px]' : 'text-xs'
          )}>
          {currency}
        </span>
      </span>
    </div>
  );
}
