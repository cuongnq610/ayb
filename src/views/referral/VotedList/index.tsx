import { getAllVotedList } from '@/services/VotingApiService';
import VotingItem from '../VotingItem';
import { useEffect, useMemo, useState } from 'react';
import { TVotingItem } from '../index.definition';
import { useAccount } from 'wagmi';
import { useAppDispatch } from '@/redux/hook';
import { setTotalVotes, votingSelector } from '@/redux/slices/votingSlice';
import { useSelector } from 'react-redux';

export default function VotedList() {
  const { address } = useAccount();

  const dispatch = useAppDispatch();
  const { totalVotes } = useSelector(votingSelector);

  const [votingListRecord, setVotingListRecord] = useState<Record<string, TVotingItem>>({});
  const [votedIdList, setVotedIdList] = useState<string[]>([]);

  const getVotedList = async () => {
    if (!address) return;

    const res = await getAllVotedList(address);
    const _votedIdList = res.voted?.[0]?.voteIdList ?? [];
    setVotedIdList(_votedIdList);

    const _votingList = (res.listVote ?? []) as TVotingItem[];
    const _votingListRecord: Record<string, TVotingItem> = {};
    _votingList.forEach((item) => {
      _votingListRecord[item._id] = item;
    });
    setVotingListRecord(_votingListRecord);

    dispatch(setTotalVotes(res.totalVote ?? 0));
  };

  const votedList = useMemo(() => {
    return votedIdList.map((item) => votingListRecord[item]);
  }, [votingListRecord, votedIdList]);

  useEffect(() => {
    getVotedList();
  }, []);

  return (
    <div className="mt-8 flex flex-col gap-4">
      {votedList.map((item) => (
        <VotingItem key={item._id} data={item} isVoted totalVotes={totalVotes} />
      ))}
    </div>
  );
}
