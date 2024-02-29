import { getAllVotings } from '@/services/VotingApiService';
import VotingItem from '../VotingItem';
import { useEffect, useMemo, useState } from 'react';
import { TVotingItem } from '../index.definition';
import { useSelector } from 'react-redux';
import { votingSelector } from '@/redux/slices/votingSlice';

export default function VotingList() {
  const { selectedVotingList } = useSelector(votingSelector);

  const [votingList, setVotingList] = useState<TVotingItem[]>([]);

  const votingDisabled = useMemo(() => {
    return selectedVotingList.length >= 3;
  }, [selectedVotingList]);

  const getVotingList = async () => {
    const _votingList = await getAllVotings();
    setVotingList(_votingList);
  };

  useEffect(() => {
    getVotingList();
  }, []);

  return (
    <div className="mt-8 flex flex-col gap-4">
      {votingList.map((item) => (
        <VotingItem key={item._id} data={item} disabled={votingDisabled} />
      ))}
    </div>
  );
}
