import { votingSelector } from '@/redux/slices/votingSlice';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import { SOCIAL_MEDIA_LINKS } from '@/constants/constants';
import { UseCheckDevice } from '@/hooks/useCheckDevice';
import clsx from 'clsx';

export function VotingSummary() {
  const { totalVotes } = useSelector(votingSelector);

  const { isMobile } = UseCheckDevice();

  return (
    <div className={clsx('p-8 rounded-2xl bg-[#201038]', isMobile ? ['flex'] : ['pb-16'])}>
      <TotalVotes totalVotes={totalVotes} />
      {!isMobile && <div className="w-full h-[2px] bg-[#493d5c] my-10" />}
      <ShareList />
    </div>
  );
}

const TotalVotes = ({ totalVotes }: { totalVotes: number }) => {
  const { isMobile } = UseCheckDevice();

  return (
    <div className={clsx(isMobile ? 'w-1/2' : 'w-full')}>
      <div className="text-white text-xl font-bold uppercase">Total Votes</div>
      <div className={clsx('text-white font-bold uppercase', isMobile ? ['mt-4', 'text-3xl'] : ['my-10', 'text-6xl'])}>
        {totalVotes}
      </div>
    </div>
  );
};

const ShareList = () => {
  const { isMobile } = UseCheckDevice();

  const shareList = [
    {
      label: 'X (Twitter)',
      imageUrl: '/referral/twitter-icon.svg',
      onClick: () => window.open(SOCIAL_MEDIA_LINKS.TWITTER, '_blank'),
    },
    {
      label: 'Telegram',
      imageUrl: '/referral/telegram-icon.svg',
      onClick: () => window.open(SOCIAL_MEDIA_LINKS.TELEGRAM, '_blank'),
    },
    {
      label: 'Copy Link',
      imageUrl: '/referral/copy-link-icon.svg',
      onClick: () => navigator.clipboard.writeText(window.location.href),
    },
  ];
  return (
    <div>
      <div className={clsx('text-white uppercase text-xl font-bold', isMobile ? 'mb-4' : 'mb-12')}>Share</div>
      <div className={clsx('flex gap-4', { 'flex-col': !isMobile })}>
        {shareList.map((item) => (
          <div key={item.label} className="flex items-center gap-3 cursor-pointer" onClick={item.onClick}>
            <Image alt={item.label} src={item.imageUrl} width={36} height={36} />
            {!isMobile && <div className="text-white text-sm font-medium">{item.label}</div>}
          </div>
        ))}
      </div>
    </div>
  );
};
