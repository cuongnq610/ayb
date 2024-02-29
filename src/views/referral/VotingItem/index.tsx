import clsx from 'clsx';
import { useState } from 'react';

export default function VotingItem() {
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isVoted, setIsVoted] = useState<boolean>(false);

  const handleToggleChecked = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div className="flex gap-4 rounded-2xl border-2 border-[#8a8099] p-4 cursor-pointer" onClick={handleToggleChecked}>
      <div className="flex items-center gap-3 flex-1">
        <div
          className={clsx(
            'w-[28px] h-[28px] rounded-full border-2 border-[#8a8099]',
            { 'bg-[#c900fc]': isChecked },
            { invisible: isVoted }
          )}></div>
        <div className="text-white">Voting Item</div>
      </div>

      <div className="flex-1">
        <div className="flex justify-between text-white text-xs mb-1">
          <div>50 votes</div>
          <div>24%</div>
        </div>
        <div className="w-full h-1 rounded-sm bg-[#493851] relative">
          <div className="absolute h-full top-0 left-0 rounded-sm z-[1] bg-[#ffca43] w-1/2" />
        </div>
      </div>
    </div>
  );
}
