import Image from 'next/image';

interface Props {
  iconUrl: string;
  value: number | string;
  name: string;
}

export default function Achieve({ iconUrl, value, name }: Props) {
  return (
    <div className={'flex flex-row gap-1 items-center justify-center'}>
      <Image src={iconUrl} alt={name} width={44} height={44} className={'object-none'} />
      <span className={'text-[20px] font-medium font-poppins bg-gradient-text-stroke text-transparent bg-clip-text'}>
        {value}
      </span>
    </div>
  );
}
