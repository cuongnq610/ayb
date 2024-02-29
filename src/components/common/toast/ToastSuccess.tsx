import Image from 'next/image';
import { UseCheckDevice } from '@/hooks/useCheckDevice';
import clsx from 'clsx';
import { PATH_HASH } from '@/config/config';
import { truncateFromMiddle } from '@/utils/util';

export default function ToastSuccess({
  hash,
  title = 'Bet Success',
  content = 'Congrats, your bet is entered',
}: {
  hash?: string;
  title?: string;
  content?: string;
}) {
  const { isMobile } = UseCheckDevice();
  return (
    <div
      className={clsx(
        'flex flex-row gap-2 h-[78px] px-2 rounded-s',
        isMobile ? 'w-[calc(100vw_-_50px)]' : 'w-[320px]'
      )}>
      <Image src={'/icons/toast-success.svg'} alt={'toast-success-icon'} width={24} height={24} />
      <div className="flex flex-col items-start justify-center w-full h-full px-2">
        <span className={'font-pressStart2P font-bold text-base text-[#3A3541]'}>{title}</span>
        <span className={'font-pressStart2P font-normal text-sm text-[#3A3541]'}>{content}</span>
        <a
          className={'font-poppins font-normal text-sm text-[#3C1AC7] underline'}
          href={`${PATH_HASH && hash ? PATH_HASH + hash: ""}`}
          target="_blank">
          View on EtherScan:{truncateFromMiddle(hash)}
        </a>
      </div>
      <Image src={'/icons/close.svg'} alt={'close-icon'} width={24} height={24} />
    </div>
  );
}
