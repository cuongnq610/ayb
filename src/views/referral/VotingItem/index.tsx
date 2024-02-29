import clsx from 'clsx';
import { useMemo, useState } from 'react';
import { TVotingItem } from '../index.definition';
import { useAppDispatch } from '@/redux/hook';
import { addSelectedVoting, removeSelectedVoting } from '@/redux/slices/votingSlice';

type VotingItemProps = {
  data: TVotingItem;
  isVoted?: boolean;
  totalVotes?: number;
  disabled?: boolean;
};

export default function VotingItem({ data, isVoted, totalVotes, disabled }: VotingItemProps) {
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const handleToggleChecked = () => {
    const newChecked = !isChecked;

    if (newChecked && disabled) {
      return;
    }

    setIsChecked(newChecked);
    if (newChecked) {
      dispatch(addSelectedVoting(data));
    } else {
      dispatch(removeSelectedVoting(data));
    }
  };

  const votedPercent = useMemo(() => {
    if (!totalVotes) return 0;
    return Number((data.count / totalVotes) * 100);
  }, [totalVotes, data]);

  return (
    <div className="bg-border-gradient-game-card rounded-2xl p-[3px]">
      <div className="flex gap-4 p-4 cursor-pointer rounded-2xl bg-[#080725]" onClick={handleToggleChecked}>
        <div className="flex items-center gap-3 flex-1">
          <div
            className={clsx(
              'w-[28px] h-[28px] rounded-full border-2 border-[#8a8099]',
              { 'bg-[#c900fc]': isChecked },
              { invisible: isVoted }
            )}></div>
          <div className="text-white">{data.name}</div>
        </div>

        <div className={clsx('flex-1', { invisible: !isVoted })}>
          <div className="flex justify-between text-white text-xs mb-1">
            <div>{data.count} votes</div>
            <div>{Number(votedPercent)}%</div>
          </div>
          <div className="w-full h-1 rounded-sm bg-[#493851] relative">
            <div
              style={{ width: `${votedPercent}%` }}
              className="absolute h-full top-0 left-0 rounded-sm z-[1] bg-[#ffca43] "
            />
          </div>
        </div>
      </div>
    </div>
  );
}
