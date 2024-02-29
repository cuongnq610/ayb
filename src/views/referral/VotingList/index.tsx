import VotingItem from '../VotingItem';

export default function VotingList() {
  return (
    <div>
      <div className="text-white text-base mb-8">
        Get involved and have your say! Vote for your favorite projects to be listed on AYB. Token holders of the top 3
        voted projects will receive $AYB airdrops!
      </div>
      <div className="text-white text-base">
        Each address can cast 3 votes! <br />
        Voting period: 2/29 - 3/7
      </div>

      <div className="mt-8 flex flex-col gap-4">
        <VotingItem />
        <VotingItem />
        <VotingItem />
        <VotingItem />
        <VotingItem />
        <VotingItem />
      </div>
    </div>
  );
}
