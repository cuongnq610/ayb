import BigNumber from 'bignumber.js';

export function getResult(totalBet: string, amount: number | string, totalBetAmount: string) {
  return BigNumber(amount).div(BigNumber(totalBet)).multipliedBy(totalBetAmount);
}

export const truncateFromMiddle = (fullStr = '', strLen = 11, middleStr = '...') => {
  if (fullStr.length <= strLen) return fullStr;
  const midLen = middleStr.length;
  const charsToShow = strLen - midLen;
  const frontChars = Math.ceil(charsToShow / 2);
  const backChars = Math.floor(charsToShow / 2);
  return fullStr.substring(0, frontChars) + middleStr + fullStr.substring(fullStr.length - backChars);
};

export const mapToken = (token: string) => {
  switch (token) {
    case 'BTC':
      return 'bitcoin';
    case 'ETH':
      return 'ethereum';
    default:
      return 'bitcoin';
  }
};
