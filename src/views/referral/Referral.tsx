import { useSelector } from 'react-redux';
import ReferralHeader from './Header';
import VotedList from './VotedList';
import VotingList from './VotingList';
import { VotingSummary } from './VotingSummary';
import { votingSelector } from '@/redux/slices/votingSlice';
import { UseCheckDevice } from '@/hooks/useCheckDevice';
import clsx from 'clsx';
import VotingSubmitButton from './SubmitButton';

export default function Referral() {
  const { isVoted } = useSelector(votingSelector);

  const { isMobile } = UseCheckDevice();

  return (
    <div>
      <ReferralHeader />
      <div className={clsx('justify-between gap-10 mt-8', isMobile ? 'block' : 'flex')}>
        <div className="flex-[3]">
          <div className="text-white text-base mb-8">
            Get involved and have your say! Vote for your favorite projects to be listed on AYB. Token holders of the
            top 3 voted projects will receive $AYB airdrops!
          </div>
          <div className="text-white text-base">
            Each address can cast 3 votes! <br />
            Voting period: 2/29 - 3/7
          </div>

          {isMobile && (
            <div className="my-6">
              <VotingSummary />
            </div>
          )}

          {isVoted ? <VotedList /> : <VotingList />}
        </div>
        <div className="flex-[2]">{!isMobile && <VotingSummary />}</div>

        {isMobile && (
          <div className="flex justify-center mt-6">
            <VotingSubmitButton />
          </div>
        )}
      </div>
    </div>
  );
}
