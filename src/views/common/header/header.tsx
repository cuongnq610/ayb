'use client';

import Image from 'next/image';
import { HEADER_MENU } from '@/constants/constants';
import Link from 'next/link';
import clsx from 'clsx';
import { Account } from '@/components/wagmi/Account';
import { useAccount, useContractWrite, useDisconnect, useNetwork } from 'wagmi';
import { UseCheckDevice } from '@/hooks/useCheckDevice';
import { useConnectModal, useChainModal } from '@rainbow-me/rainbowkit';
import { useEffect } from 'react';
import { CONTRACT_USDT_ADDRESS } from '@/config/config';
import usdtABI from '@/blockchain/usdt_abi.json';
import { toastErrorMintFn, toastSuccessMintFn } from '@/utils/toast';

export default function Header() {

  const { isMobile } = UseCheckDevice();
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { openConnectModal } = useConnectModal();
  const { openChainModal } = useChainModal();
  const { chain } = useNetwork();

  const {
    data: dataMint,
    isError,
    write: writeMint,
  } = useContractWrite({
    address: CONTRACT_USDT_ADDRESS as `0x${string}`,
    abi: usdtABI,
    functionName: 'mint',
  });

  // const getUserRound = async () => {
  //   const res = await getUserRounds(address, 1);
  //   setUserRounds(res);
  // }

  // useEffect(() => {
  //   // refetch get user when change address
  //   if (address) {
  //     refetchGetUserRound().then();
  //   }
  // }, [address]);

  useEffect(() => {
    if (dataMint?.hash) {
      toastSuccessMintFn(isMobile, dataMint?.hash);
    }
  }, [dataMint]);

  useEffect(() => {
    if (isError) {
      toastErrorMintFn(isMobile, '', 'Only once a day');
    }
  }, [isError]);

  return (
    <>
      <header className="h-header bg-common border-b border-b-primary fixed z-[200] w-screen ">
        <div className={'h-full w-full lg:px-10 xl:px-0'}>
          <div className="container mx-auto h-full text-center">
            <div className={clsx('flex justify-between items-center h-full', isMobile ? 'px-4' : '')}>
              <div className="flex items-center gap-16">
                <Image src={'/logo-new.png'} alt={'logo'} width={150} height={30} />
                <div className={clsx('flex items-center gap-12', isMobile ? 'hidden' : '')}>
                  {HEADER_MENU.map((item) => (
                    <Link
                      key={item.name}
                      href={item.path}
                      className={clsx('flex flex-row gap-3', item.children ? 'relative group' : '')}
                      onClick={(e) => {
                        if (item.isDisabled) e.preventDefault();
                      }}>
                      <Image src={item.icon} alt={`${item.name} icon`} width={20} height={20} />
                      <span
                        className={clsx(
                          'text-sm font-medium font-pressStart2P uppercase',
                          'Game' === item.name
                            ? 'text-transparent bg-clip-text bg-gradient-to-b from-pink to-purple uppercase'
                            : 'text-white hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-b hover:from-pink hover:to-purple',
                          'group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-b group-hover:from-pink group-hover:to-purple'
                        )}>
                        {item.name}
                      </span>
                      <div className={'hidden group-hover:flex absolute w-[200px] h-fit top-1 flex-col pt-9'}>
                        <div
                          className={
                            'flex flex-col justify-center items-start w-full h-fit bg-white text-white z-10 bg-button-pattern px-4 py-2 rounded-2xl shadow-2xl text-sm font-medium font-roboto'
                          }>
                          {item.children?.map((child) => (
                            <Link href={child.path} key={child.name}>
                              <span>{child.name}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="flex items-center">
                {chain?.unsupported ? (
                  <>
                    <button
                      className={
                        'w-[170px] h-[37px] flex text-center justify-center font-pressStart2P text-[10px] rounded-l-full font-semibold text-white text-sm px-5 py-2 rounded-r-full bg-button-pattern hover:scale-110 transition-all duration-500'
                      }
                      onClick={openChainModal}>
                      Change Network
                    </button>
                  </>
                ) : isConnected ? (
                  <>
                    <div
                      className={
                        'w-[170px] h-[37px] rounded-[20px] bg-border-gradient-button-faucet p-[1px] text-center mr-4'
                      }>
                      <a
                        className={
                          'bg-common w-full h-full rounded-[18px] font-pressStart2P  text-center justify-center items-center flex flex-col font-semibold text-white text-[10px]'
                        }
                        href="https://faucet.quicknode.com/arbitrum/sepolia"
                        target="_blank">
                        Get Faucet ETH
                      </a>
                    </div>
                    <div
                      className={
                        'w-[170px] h-[37px] rounded-[20px] bg-border-gradient-button-mint p-[1px] text-center mr-4'
                      }>
                      <button
                        className={
                          'bg-common w-full h-full rounded-[18px] text-center justify-center items-center flex flex-col font-semibold text-white font-pressStart2P text-[10px]'
                        }
                        onClick={() => {
                          writeMint?.();
                        }}>
                        Mint Test USDT
                      </button>
                    </div>
                    <div
                      className={
                        'w-[156px] h-[37px] group relative cursor-pointer flex text-center justify-between rounded-l-full font-semibold text-white text-sm px-3 py-2 rounded-r-full bg-button-pattern'
                      }>
                      <Image src={'/icons/wallet.svg'} alt={'wallet-icon'} width={20} height={20} className={'mr-2'} />
                      <Account className={'text-white'} />
                      <Image
                        src={'/icons/back-icon.svg'}
                        alt={'back-icon'}
                        width={24}
                        height={24}
                        className={'-rotate-90 w-[24px] h-[24px]'}
                      />
                      <div className={'hidden group-hover:flex absolute w-[126px] h-fit top-1 flex-col pt-10 left-0'}>
                        <div
                          className={
                            'flex flex-col justify-center items-start w-full h-[36px] bg-white text-white z-10 bg-button-pattern px-4 rounded-2xl shadow-2xl text-sm font-medium font-pressStart2P text-[10px]'
                          }
                          onClick={() => disconnect()}>
                          Logout
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <button
                    className={
                      'w-[200px] h-[37px] flex text-center justify-center font-pressStart2P text-[12px] rounded-l-full font-semibold text-white px-2 py-2 rounded-r-full bg-button-pattern hover:scale-110 transition-all duration-500'
                    }
                    onClick={openConnectModal}>
                    Connect Wallet
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
      {/*{isMobile && !isShowHistory && (*/}
      {/*  <div className="fixed bottom-0 left-0 h-[97px] w-full bg-quaternary z-[60] transition-transform duration-75">*/}
      {/*    <div className={'w-full h-full bg-secondary flex flex-row justify-around items-center'}>*/}
      {/*      {HEADER_MENU_MOBILE.map((item) => (*/}
      {/*        <Link*/}
      {/*          key={item.name}*/}
      {/*          href={item.path}*/}
      {/*          className={'flex flex-row gap-3'}*/}
      {/*          onClick={(e) => {*/}
      {/*            if (item.isDisabled) e.preventDefault();*/}
      {/*          }}>*/}
      {/*          <Image src={item.icon} alt={`${item.name} icon`} width={20} height={20} />*/}
      {/*        </Link>*/}
      {/*      ))}*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*)}*/}
    </>
  );
}
