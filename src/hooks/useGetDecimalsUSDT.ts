import { useContractRead } from 'wagmi';
import { CONTRACT_USDT_ADDRESS } from '@/config/config';
import usdtABI from '@/blockchain/usdt_abi.json';

export default function useGetDecimalsUSDT() {
  const { data, isLoading, isError } = useContractRead({
    address: CONTRACT_USDT_ADDRESS as `0x${string}`,
    abi: usdtABI,
    functionName: 'decimals',
  }) as { data: number; isLoading: boolean; isError: boolean };

  return { data, isLoading, isError };
}
