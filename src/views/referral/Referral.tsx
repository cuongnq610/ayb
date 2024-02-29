import ReferralHeader from './Header';
import VotingList from './VotingList';
import { VotingSummary } from './VotingSummary';

export default function Referral() {
  return (
    <div>
      <div>
        <ReferralHeader />
      </div>
      <div className="flex justify-between gap-5 mt-8">
        <div className="flex-[3]">
          <VotingList />
        </div>
        <div className="flex-[2]">
          <VotingSummary />
        </div>
      </div>
    </div>
  );
}
