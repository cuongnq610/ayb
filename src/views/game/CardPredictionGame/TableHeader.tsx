import Image from 'next/image';

export default function TableHeader() {
  return (
    <div
      className={'flex flex-row items-center justify-between text-white uppercase text-xs font-semibold font-poppins'}>
      <span>rank</span>
      <span className={'w-1/4'}>player</span>
      <span>prd</span>
      <span>bet</span>
      <span className={'flex flex-row items-center justify-center gap-1'}>
        mul
        <Image src={'/prediction/info.svg'} alt={'info14x14'} width={14} height={14} />
      </span>
    </div>
  );
}
