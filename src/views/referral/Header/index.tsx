export default function ReferralHeader() {
  return (
    <div className="flex justify-between font-pressStart2P">
      <div className="flex flex-col gap-2">
        <div className="text-white text-4xl">VOTE FOR YOUR </div>
        <div className="text-[#C428EC] text-4xl">FAVORITE PROJECTS!</div>
      </div>
      <div>
        <button className="text-white text-base rounded-2xl bg-[#C428EC] px-2 py-5 w-[386px] uppercase hover:scale-110 transition-all duration-500">
          Submit Your Vote
        </button>
      </div>
    </div>
  );
}
