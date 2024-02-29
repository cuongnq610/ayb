import { UseCheckDevice } from '@/hooks/useCheckDevice';
import VotingSubmitButton from '../SubmitButton';
import clsx from 'clsx';

export default function ReferralHeader() {
  const { isMobile } = UseCheckDevice();

  return (
    <div className="flex justify-between font-pressStart2P">
      <div className="flex flex-col gap-2">
        <div className={clsx('text-white', isMobile ? 'text-2xl' : 'text-4xl')}>VOTE FOR YOUR </div>
        <div className={clsx('text-[#C428EC]', isMobile ? 'text-2xl' : 'text-4xl')}>FAVORITE PROJECTS!</div>
      </div>
      {!isMobile && <VotingSubmitButton />}
    </div>
  );
}
