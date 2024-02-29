'use client';

import { useAccount } from 'wagmi';
import clsx from 'clsx';
import getSpaceId from '@/utils/getSpaceId';
import { useEffect, useState } from 'react';
import { truncateFromMiddle } from '@/utils/util';

export function Account({ className }: { className?: string }) {
  const { address } = useAccount();
  const [spaceId, setSpaceId] = useState<string | undefined>(undefined);

  const accountName = spaceId ?? truncateFromMiddle(address);

  const getId = async (address: string) => {
    const response = await getSpaceId(address);
    setSpaceId(response.data.name);
  };
  useEffect(() => {
    if (address) {
      getId(address);
    }
  }, [address])

  return (
    <span className={clsx('w-fit flex flex-row', className)}>
      {accountName}
    </span>
  );
}
