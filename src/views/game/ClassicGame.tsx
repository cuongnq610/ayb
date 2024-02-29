import { AddressSupport, AddressToken, Symbols } from '@/constants/constants';
import { RoundEntity } from '@/entity/RoundEntity';
import { NewUserRoundEntity } from '@/entity/UserRound';
import { UseCheckDevice } from '@/hooks/useCheckDevice';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { changePricePool, changeShowLiveAll, gameSelector } from '@/redux/slices/gameSlice';
import { getAllRoundsClassic, getUserRounds } from '@/services/ClassicApiService';
import CardClassicGame from '@/views/game/CardClassicGame/CardClassicGame';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

export default function ClassicGame() {
  const { address } = useAccount();
  const dispatch = useAppDispatch();
  const [userRoundData, setUserRounds] = useState<Array<NewUserRoundEntity>>();

  const [dataClassic, setRoundsClassic] = useState<Array<RoundEntity> | []>();

   const getUserRound = async () => {
    if(!dataClassic?.length){
      return;
    }
    const res = await getUserRounds(address);
    setUserRounds(res);
  }

  const getRoundsClassic = async () => {
    const res = await getAllRoundsClassic();
    setRoundsClassic(res);
  }

  useEffect(() => {
    console.log(address)
    if (address) {
      getUserRound();
    }
  }, [address, dataClassic]);

  const { isShowHistory, isCalculate } = useAppSelector(gameSelector);
  const { isMobile } = UseCheckDevice();

  useEffect(() => {
    console.log(isCalculate);
    if (isCalculate) {
      dispatch(changeShowLiveAll(true));
      dispatch(changePricePool(Number(0)));
    } else {
      dispatch(changeShowLiveAll(false));
      setUserRounds([]);

    }
  }, [isCalculate]);

  useEffect(() => {
    const interval = setInterval(() => {
      getRoundsClassic();
      getUserRound();
    }, 8000);
    return () => clearInterval(interval);
  }, [isCalculate]);

  useEffect(() => {
    getRoundsClassic();
  }, [])
  return (
    <div
      className={clsx(
        'py-2 gap-6 grid grid-cols-1 mt-6 max-w-[1266px] mx-auto',
        'md:mt-0 md:py-20 md:gap-6 md:grid-cols-2',
        'lg:grid-cols-2 xl:grid-cols-3',
        isShowHistory && !isMobile ? 'min-w-[1266px]' : isMobile ? 'w-full' : 'w-fit'
      )}>
      {dataClassic && dataClassic!=undefined && AddressSupport?.map((el: AddressToken) => (
        <CardClassicGame
          symbol={el.toLowerCase() === AddressToken.BTC ? Symbols.BTC : Symbols.ETH}
          key={el}
          userRounds={userRoundData}
          classicRounds={dataClassic?.filter((item: RoundEntity) => item.tokenAddress === el)}
        />
      ))}
    </div>
  );
}
