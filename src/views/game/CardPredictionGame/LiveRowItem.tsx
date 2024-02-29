import { formatSink, formatWithLongText } from '@/utils/formatWithCommas';
import TruncateNumber from '@/utils/truncateNumber';
import { truncateFromMiddle } from '@/utils/util';
import BigNumber from 'bignumber.js';
import clsx from 'clsx';
import Image from 'next/image';

interface LiveRowItemProps {
  rank?: number;
  playerAddress?: string;
  playerName?: string;
  prd?: string;
  bet?: number;
  mul?: string;
  time?: string;
  isUp?: boolean;
}

export default function LiveRowItem({ rank, playerName, prd, bet, mul, time, isUp }: LiveRowItemProps) {
  const date = new Date(Number.parseInt(time?.toString() ?? '', 10));
  // Hours part from the timestamp
  const hours = date.getHours();
  // Minutes part from the timestamp
  const minutes = '0' + date.getMinutes();
  const showTime = hours + ':' + minutes.substring(-2);

  return (
    <div
      className={clsx(
        'w-full h-[40px] rounded-[6px] flex flex-row items-center justify-between px-2 py-0.5',
        Number(mul) > 10 && 'bg-gradient-rank-gold',
        Number(mul) === 10 && 'bg-gradient-rank-silver',
        Number(mul) === 5 && 'bg-gradient-rank-purple',
        Number(mul) === 3 && 'bg-gradient-rank-blue',
        Number(mul) === 2 && 'bg-gradient-rank-green',
        Number(mul) === 1 && 'bg-gradient-rank-black',
        !mul && 'bg-gradient-unranked'
      )}>
      <span
        className={
          'w-[30px] h-[30px] border border-[#8305A4] rounded-full bg-[#C428EC] text-white text-sm font-semibold font-poppins items-center flex justify-center'
        }>
        {rank && rank > 0 ? rank : '-'}
      </span>
      <span
        className={`${mul ? 'text-[#3A3541]' : 'text-white/50'
          } text-xs font-semibold font-poppins flex flex-row items-center ${Number(mul) === 1 && '!text-white'}`}>
        {isUp ? (
          <Image src={'/icons/up-icon.svg'} alt={'bet-up-icon'} height={30} width={33} className={'mr-1'} />
        ) : (
          <Image src={'/icons/down-icon.svg'} alt={'bet-up-icon'} height={30} width={33} className={'mr-1'} />
        )}

        {playerName ? truncateFromMiddle(playerName, 12) : ''}
      </span>
      <div className={'flex flex-col text-right justify-center'}>
        <span
          className={`${mul ? 'text-[#3A3541]' : 'text-white/50'}  text-sm font-semibold font-poppins !leading-0 ${Number(mul) === 1 && '!text-white'
            }`}>
          {Number(prd) < Number(0.001) ? (
            <>
              <span>0.00</span>
              {<sub className='vertical-align: sub;'>{formatSink(BigNumber(Number(prd)).toFormat(12, BigNumber.ROUND_DOWN))}</sub>}
              {<span>{formatWithLongText(BigNumber(Number(prd)).toFormat(12, BigNumber.ROUND_DOWN))}</span>}
            </>
          ) : (
            <>
              {Number(prd) === -1 ? '-' : `$${TruncateNumber(Number(prd))}`}
            </>
          )}
        </span>
        <span
          className={`${mul ? 'text-[#3A3541]' : 'text-white/50'}  text-[10px] font-semibold font-poppins ${Number(mul) === 1 && '!text-white'
            }`}>
          {showTime} UTC
        </span>
      </div>
      <span
        className={`${mul ? 'text-[#3A3541]' : 'text-white/50'} text-sm font-semibold font-poppins ${Number(mul) === 1 && '!text-white'
          }`}>
        ${bet}
      </span>
      <span
        className={`${mul ? 'text-[#3A3541]' : 'text-white/50'} text-[20px] font-semibold font-poppins ${Number(mul) === 1 && '!text-white'
          }`}>
        {mul ? Number(mul).toFixed(0) + 'X' : '--'}
      </span>
    </div>
  );
}
