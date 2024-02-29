/* eslint-disable @typescript-eslint/ban-ts-comment */
import { PAIR } from '@/constants/constants';
import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function TradingViewPrediction({ symbol }: { symbol: string }) {
  let urlIframe = "";
  switch (symbol) {
    case "BTC":
      urlIframe = `https://www.dextools.io/widget-chart/en/ether/pe-light/${PAIR.BTC}?theme=dark&chartType=2&chartResolution=30&drawingToolbars=false`
      break;
    case "ETH":
      urlIframe = `https://www.dextools.io/widget-chart/en/bnb/pe-light/${PAIR.ETH}?theme=dark&chartType=2&chartResolution=30&drawingToolbars=false`
      break;
    case "AYB":
      urlIframe = `https://www.dextools.io/widget-chart/en/base/pe-light/${PAIR.AYB}?theme=dark&chartType=2&chartResolution=30&drawingToolbars=false`
      break;
    case "TOSHI":
      urlIframe = `https://www.dextools.io/widget-chart/en/base/pe-light/${PAIR.TOSHI}?theme=dark&chartType=2&chartResolution=30&drawingToolbars=false`
      break;
    case "MOCHI":
      urlIframe = `https://www.dextools.io/widget-chart/en/base/pe-light/${PAIR.MOCHI}?theme=dark&chartType=2&chartResolution=30&drawingToolbars=false`
      break;
    case "TYBG":
      urlIframe = `https://www.dextools.io/widget-chart/en/base/pe-light/${PAIR.TYBG}?theme=dark&chartType=2&chartResolution=30&drawingToolbars=false`
      break;
  }

  return (
    <div className="tradingview-widget-container w-full h-full z-[100] flex justify-center items-center">
      <iframe id="dextools-widget"
        title="DEXTools Trading Chart"
        width="100%" height="100%"
        src={urlIframe}></iframe>
    </div>
  );

}

export default React.memo(TradingViewPrediction)