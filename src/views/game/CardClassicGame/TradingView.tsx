/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import { AdvancedRealTimeChart } from 'react-ts-tradingview-widgets';
// @ts-ignore
// let tvScriptLoadingPromise;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function TradingViewWidget({ symbol }: { symbol: string }) {
  return (
    <div className="tradingview-widget-container w-full h-full z-[100] flex justify-center items-center">
      <AdvancedRealTimeChart width={"100%"} height={"100%"}
        theme="dark" symbol={symbol}></AdvancedRealTimeChart>
    </div>
  );
}

export default React.memo(TradingViewWidget)