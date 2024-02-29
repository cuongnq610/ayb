import { useContractWrite } from 'wagmi';
import usdtABI from '@/blockchain/usdt_abi.json';
import { CONTRACT_USDT_ADDRESS } from '@/config/config';

export default function useApprove() {
  const { data, isLoading, isError, write, writeAsync, error, isSuccess } = useContractWrite({
    address: CONTRACT_USDT_ADDRESS as `0x${string}`,
    abi: usdtABI,
    functionName: 'approve',
  });

  

  return { data, isLoading, isError, write, writeAsync, error, isSuccess };
}

