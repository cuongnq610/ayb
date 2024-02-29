import { useAppDispatch } from '@/redux/hook';
import { setIsVoted, votingSelector } from '@/redux/slices/votingSlice';
import { createVotes } from '@/services/VotingApiService';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useAccount } from 'wagmi';

export default function VotingSubmitButton() {
  const { address } = useAccount();

  const dispatch = useAppDispatch();
  const { selectedVotingList, isVoted } = useSelector(votingSelector);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSumit = async () => {
    if (selectedVotingList.length === 0 || isVoted || isLoading || !address) return;
    try {
      setIsLoading(true);
      const vote = selectedVotingList.map((item) => item._id);
      const res = await createVotes(address, vote);
      if (res) {
        dispatch(setIsVoted(true));
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <button
        onClick={handleSumit}
        className="text-white text-base font-pressStart2P rounded-2xl bg-[#C428EC] px-2 py-5 w-[386px] uppercase hover:scale-110 transition-all duration-500">
        {isVoted ? 'Vote Submited' : 'Submit Your Vote'}
      </button>
    </div>
  );
}
