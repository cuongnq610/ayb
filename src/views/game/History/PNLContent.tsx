/* eslint-disable @typescript-eslint/no-explicit-any */

import { Cell, Label, Pie, PieChart, ResponsiveContainer } from 'recharts';
import clsx from 'clsx';
import Image from 'next/image';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { UseCheckDevice } from '@/hooks/useCheckDevice';
import { isEdge, isMobile as isMobileReact } from 'react-device-detect';
import { useAppSelector } from '@/redux/hook';
import { gameSelector } from '@/redux/slices/gameSlice';
import { useQuery } from '@apollo/client';
import { GET_HISTORY_PNL_BY_USER_ID } from '@/api/history';
import client from '@/config/api';
import { User } from '@/entity/UserRound';
import { useEffect, useMemo } from 'react';
import BigNumber from 'bignumber.js';
import formatWithCommas from '@/utils/formatWithCommas';

const color = ['#0CF574', '#FF1F40'];

export default function PNLContent() {
  const { isMobile } = UseCheckDevice();
  const { userId } = useAppSelector(gameSelector);
  const {
    data: historyData = {} as { Users: Array<User> },
    refetch: refetchHistory,
    loading,
  } = useQuery(GET_HISTORY_PNL_BY_USER_ID, {
    client,
    variables: { id: userId },
    skip: !userId,
  });

  useEffect(() => {
    if (userId) {
      refetchHistory().then();
    }
  }, [userId]);

  const roundWon = useMemo(() => {
    return historyData?.Users?.[0]?.roundWon || [];
  }, [historyData]);

  const roundLost = useMemo(() => {
    return historyData?.Users?.[0]?.roundLost || [];
  }, [historyData]);

  const dataPie = useMemo(() => {
    return [
      {
        name: 'won',
        value: historyData?.Users?.[0].roundWon.length || 0,
      },
      {
        name: 'lose',
        value: historyData?.Users?.[0].roundLost.length || 0,
      },
    ];
  }, [historyData]);

  const netResult = useMemo(() => {
    return BigNumber(historyData?.Users?.[0].totalWonAmount).minus(historyData?.Users?.[0].totalLostAmount);
  }, [historyData]);
  return (
    <Scrollbars
      autoHide
      className={clsx(
        'w-full',
        isMobileReact && isEdge
          ? 'max-h-[calc(100dvh_-_320px)]'
          : isMobile
          ? 'max-h-[calc(100dvh_-_320px)]'
          : 'max-h-[calc(100vh_-_226px)]'
      )}
      renderThumbHorizontal={(props) => (
        <div
          {...props}
          className="bg-[#B392BC] w-1.5 rounded-l-full rounded-r-full z-[99999]"
          style={{ background: '#B392BC' }}
        />
      )}
      renderThumbVertical={(props) => (
        <div
          {...props}
          className="bg-[#B392BC] w-1.5 rounded-t-full rounded-b-full z-[99999]"
          style={{ background: '#B392BC' }}
        />
      )}>
      {historyData?.Users?.[0] && (
        <div
          className={clsx(
            'bg-[#181039] rounded-t-[10px] p-6 overflow-y-auto h-fit relative',
            isMobile ? 'pb-8' : 'pb-4'
          )}>
          {loading && (
            <div className={'w-full h-full z-10 absolute top-0 left-0 backdrop-blur backdrop-opacity-75 bg-white/10'}>
              <div className={'flex flex-col items-center justify-center h-full'}>
                <Image src={'/spinner.svg'} alt={'spinner'} width={60} height={60} />
              </div>
            </div>
          )}
          <div className={'w-full h-fit flex flex-row justify-items-start items-center'}>
            <ResponsiveContainer width={101} height={101}>
              <PieChart width={102} height={102}>
                <Pie data={dataPie} innerRadius={28} outerRadius={49} dataKey="value" startAngle={90} endAngle={-270}>
                  {dataPie.map((entry, index: number) => (
                    <Cell
                      key={entry.name}
                      fill={color[index]}
                      stroke={color[index]}
                      className={'focus:outline-none text-center mt-2'}
                    />
                  ))}
                  <Label
                    width={30}
                    position="center"
                    content={
                      <CustomLabel value={`${roundWon.length}/${roundWon.length + roundLost.length}`} />
                    }></Label>
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className={'h-12 w-fit ml-10 flex flex-col justify-center items-start gap-2'}>
              <p className={'text-white font-bold text-[18px] font-pressStart2P capitalize'}>net results</p>
              <p
                className={clsx(
                  'font-bold text-[18px]',
                  netResult.isLessThan(0) ? 'text-[#FF1F40]' : 'text-[#0CF574]'
                )}>
                {netResult.toNumber()} USDT
              </p>
            </div>
          </div>
          <div className={'mt-8 flex flex-col pb-6 border-b border-white/10 h-fit'}>
            <p className={'text-white font-medium text-sm font-poppins'}>Average return / round</p>
            <p
              className={clsx(
                'font-bold text-[18px] font-poppins mt-2',
                netResult.isLessThan(0) ? 'text-[#FF1F40]' : 'text-[#0CF574]'
              )}>
              {netResult.div(BigNumber(historyData?.Users?.[0].roundEntered.length)).toNumber()} USDT
            </p>
            <p className={'text-white font-medium text-sm font-poppins mt-6'}>Best round:</p>
            {BigNumber(historyData?.Users?.[0]?.bestWon).isGreaterThan(0) ? (
              <p className={'text-[#FF1F40] font-bold text-[18px] font-poppins mt-2'}>
                {formatWithCommas(historyData?.Users?.[0]?.bestWon)} USDT (1.93X)
              </p>
            ) : (
              <p className={'text-[#0CF574] font-bold text-[18px] font-poppins mt-2'}>
                +{formatWithCommas(historyData?.Users?.[0]?.bestWon)} USDT (
                {+Number(historyData?.Users?.[0]?.bestWonRate).toFixed(2)}X)
              </p>
            )}
            <p className={'text-white font-medium text-sm font-poppins mt-6'}>Average bet entered / round</p>
            <p className={'text-white font-bold text-[18px] font-poppins mt-2'}>
              {formatWithCommas(
                +BigNumber(historyData?.Users?.[0].totalBetAmount)
                  .dividedBy(BigNumber(historyData?.Users?.[0].roundEntered.length))
                  .toFixed(2)
              )}{' '}
              USDT
            </p>
          </div>
          <div className={'mt-8 flex flex-col h-fit'}>
            <p className={'text-white font-medium text-sm font-poppins capitalize'}>won</p>
            <p
              className={
                'text-[#0CF574] font-bold text-[18px] font-poppins mt-2 max-w-[281px] flex flex-row justify-between items-center'
              }>
              <span>{historyData?.Users?.[0].roundWon.length} rounds</span>
              <span>+{formatWithCommas(historyData?.Users?.[0].totalWonAmount)} USDT</span>
            </p>
            <p className={'-mt-1 text-xs font-poppins font-medium text-white/50'}>
              {formatWithCommas(
                +(
                  (historyData?.Users?.[0].roundWon.length / historyData?.Users?.[0].roundEntered.length) *
                  100
                ).toFixed(2)
              )}
              %
            </p>
            <p className={'text-white font-medium text-sm font-poppins mt-4 capitalize'}>lost</p>
            <p
              className={
                'text-[#FF1F40] font-bold text-[18px] font-poppins mt-2 max-w-[281px] flex flex-row justify-between items-center'
              }>
              <span>{historyData?.Users?.[0].roundLost.length} rounds</span>
              <span>-{formatWithCommas(historyData?.Users?.[0].totalLostAmount)} USDT</span>
            </p>
            <p className={'-mt-1 text-xs font-poppins font-medium text-white/50'}>
              {formatWithCommas(
                +(
                  (historyData?.Users?.[0].roundLost.length / historyData?.Users?.[0].roundEntered.length) *
                  100
                ).toFixed(2)
              )}
              %
            </p>

            <p className={'text-white font-medium text-sm font-poppins mt-4 capitalize'}>entered</p>
            <p
              className={
                'text-white font-bold text-[18px] font-poppins mt-2 max-w-[281px] flex flex-row justify-between items-center'
              }>
              {' '}
              <span>{historyData?.Users?.[0].roundEntered.length} rounds</span>
              <span>+{formatWithCommas(historyData?.Users?.[0].totalBetAmount)} USDT</span>
            </p>
            <p className={'-mt-1 text-xs font-poppins font-medium text-white/50'}>100%</p>
          </div>

          <button
            className={clsx(
              'h-full rounded-l-full rounded-r-full cursor-pointer',
              'transition-all duration-300 ease-in-out',
              'flex items-center justify-center text-white',
              'bg-bg-active capitalize text-white font-poppins font-medium text-base',
              'w-[270px] h-[44px] mx-auto mt-6 py-2 max-h-[44px]'
            )}
            onClick={() => {}}>
            view reclaimed& won
            <Image src={'/icons/open-popup.svg'} alt={'open-popup'} width={24} height={24} className={'ml-2'} />
          </button>
        </div>
      )}
      {!loading && !historyData?.Users?.[0] && (
        <div className={'flex flex-col mt-20 max-w-[266px] mx-auto gap-3 font-poppins text-center'}>
          <p className={'text-white font-semibold text-base'}>PNL Feature Coming Soon</p>
          {/* <p className={'text-white/80 font-normal text-sm'}>
            If you are sure you should see history here, make sure you’re connected to the correct wallet and try again.
          </p>
          <p className={'text-white/80 font-normal text-sm'}>Otherwise, time to place your first bet!</p> */}
        </div>
      )}
    </Scrollbars>
  );
}

const CustomLabel = ({ viewBox, value }: any) => {
  const { cx, cy } = viewBox;
  return (
    <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central">
      <tspan fontSize="12" x={cx} y={cy - 8} fontWeight={600} fill={'#fff'}>
        Won
      </tspan>
      <tspan fontSize="10" x={cx} y={cy + 8} fontWeight={600} fill={'#fff'}>
        {value}
      </tspan>
    </text>
  );
};
