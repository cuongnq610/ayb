// import GameIcon from '../../public/icon/'

export const HEADER_MENU = [
  {
    name: 'Game',
    path: '/',
    icon: '/headers/game-icon.svg',
    isDisabled: false,
  },
  // {
  //   name: 'Staking',
  //   path: '/staking',
  //   icon: '/headers/staking-icon.svg',
  //   isDisabled: true,
  // },
  // {
  //   name: 'AIRDROP',
  //   path: '/',
  //   icon: '/headers/airdrop.svg',
  //   isDisabled: false,
  //   children: [
  //     {
  //       name: 'Testnet Airdrop Details',
  //       path: 'https://medium.com/@AllYourBase_AYB/ayb-testnet-airdrop-10-billion-ayb-reward-pool-b0bbef37f2f9',
  //     },
  //     {
  //       name: 'Step-by-Step Guide',
  //       path: 'https://medium.com/@AllYourBase_AYB/ayb-testnet-step-by-step-guide-2ccec170ffbc',
  //     },
  //     {
  //       name: 'Video Tutorial',
  //       path: 'https://www.youtube.com/watch?v=E4kkV3cbEtU&themeRefresh=1',
  //     },
  //     {
  //       name: 'Refer to Earn',
  //       path: 'https://taskon.xyz/campaign/detail/35413',
  //     },
  //   ],
  // },
  {
    name: 'Community',
    path: '/community',
    icon: '/headers/community.svg',
    isDisabled: true,
    children: [
      {
        name: 'Discord',
        path: 'https://discord.com/invite/B3be9tjM4q',
      },
      {
        name: 'Telegram',
        path: 'https://t.me/AllYourBase_AYB',
      },
      {
        name: 'Twitter',
        path: 'https://twitter.com/AllYourBase_AYB',
      },
    ],
  },
  // {
  //   name: 'About',
  //   path: 'https://www.belongtous.xyz/',
  //   icon: '/headers/about.svg',
  //   isDisabled: false,
  // },
  // {
  //   name: 'Buy $AYB',
  //   path: 'https://www.sushi.com/swap?chainId=8453&token0=NATIVE&token1=0x7ED613AB8b2b4c6A781DDC97eA98a666c6437511&swapAmount=',
  //   icon: '/headers/buy.svg',
  //   isDisabled: false,
  // },
];

export const HEADER_MENU_MOBILE = [
  {
    name: 'Game',
    path: '/',
    icon: '/headers/game-mobile.svg',
    isDisabled: false,
  },
  {
    name: 'Staking',
    path: '/staking',
    icon: '/headers/finance.svg',
    isDisabled: true,
  },
  {
    name: 'Community',
    path: '/community',
    icon: '/headers/rank-mobile-icon.svg',
    isDisabled: true,
  },
];

export const NETWORK_TYPE = {
  MAINNET: 'mainnet',
  TESTNET: 'testnet',
};

export enum CoinNameEnum {
  BTC = 'BTC',
  ETH = 'ETH',
  AYB = 'AYB',
  TOSHI = 'TOSHI',
  MOCHI = 'MOCHI',
  TYBG = 'TYBG',
}
export const COIN_INFO = {
  [CoinNameEnum.BTC]: {
    name: 'Bitcoin',
    symbol: 'BTC',
    coingeckoId: 'bitcoin',
    icon: '/coins/bitcoin.png',
  },
  [CoinNameEnum.ETH]: {
    name: 'Ethereum',
    symbol: 'WETH',
    coingeckoId: 'ethereum',
    icon: '/coins/eth.svg',
  },
  [CoinNameEnum.AYB]: {
    name: 'AYB',
    symbol: 'AYB',
    coingeckoId: 'ayb',
    icon: '/coins/ayb.svg',
  },
  [CoinNameEnum.TOSHI]: {
    name: 'TOSHI',
    symbol: 'TOSHI',
    coingeckoId: 'toshi',
    icon: '/coins/toshi.png',
  },
  [CoinNameEnum.MOCHI]: {
    name: 'MOCHI',
    symbol: 'MOCHI',
    coingeckoId: 'mochi',
    icon: '/coins/mochi.svg',
  },
  [CoinNameEnum.TYBG]: {
    name: 'TYBG',
    symbol: 'TYBG',
    coingeckoId: 'tybg',
    icon: '/coins/tybg.png',
  },
};

export enum HistoryPredictionEnum {
  PAST,
  LIVE,
  BET,
}

export enum StatusRoundEnum {
  OPEN = 'OPEN',
  LOCKED = 'LOCKED',
  FINALIZED = 'FINALIZED',
  REFUNDED = 'REFUNDED',
}

export const HISTORY_GAME = {
  [StatusRoundEnum.FINALIZED]: {
    name: 'Finalized',
    icon: '/icons/up-icon.svg',
    icon2: '/icons/down-icon.svg',
    width: 30,
  },
  [StatusRoundEnum.LOCKED]: {
    name: 'Live',
    icon: '/icons/live-icon.svg',
    icon2: '/icons/live-selected-icon.svg',
    width: 60,
  },
  [StatusRoundEnum.REFUNDED]: {
    name: 'Live',
    icon: '/icons/live-icon.svg',
    icon2: '/icons/live-selected-icon.svg',
    width: 60,
  },
  [StatusRoundEnum.OPEN]: {
    name: 'Bet',
    icon: '/icons/bet-icon.svg',
    icon2: '/icons/bet-selected-icon.svg',
    width: 60,
  },
};

export const HISTORY_PREDICTION = {
  [HistoryPredictionEnum.PAST]: {
    name: 'Past',
    icon: '/prediction/past-prediction.svg',
    iconActive: '/prediction/past-prediction-active.svg',
    width: 110,
  },
  [HistoryPredictionEnum.LIVE]: {
    name: 'Live',
    icon: '/prediction/live-prediction.svg',
    iconActive: '/prediction/live-prediction-active.svg',
    width: 110,
  },
  [HistoryPredictionEnum.BET]: {
    name: 'Bet',
    icon: '/prediction/bet-prediction.svg',
    iconActive: '/prediction/bet-prediction-active.svg',
    width: 110,
  },
};

export enum BetStatusEnum {
  UP = 'up',
  DOWN = 'down',
}

export enum GameBetEnum {
  CLASSIC = 'classic',
  PREDICTION = 'prediction',
}

export enum TypeHistoryEnum {
  ROUNDS = 'rounds',
  PNL = 'pnl',
}

export enum TypeFilterHistoryEnum {
  ALL = 'all',
  COLLECTED = 'collected',
  UNCOLLECTED = 'uncollected',
}

// 1st place row is gold
// Top 1% rank is silver  (5x)
// 10%-1% rank is purple  (3x)
// 25%-10% rank is blue (2x)
// 50%-25% rank is green  (1x)
// 100%-50% rank is black  (0x)
// remaining to be calculated are gray
export enum RankEnum {
  GOLD = 'gold',
  SILVER = 'silver',
  PURPLE = 'purple',
  BLUE = 'blue',
  GREEN = 'green',
  BLACK = 'black',
  UNRANKED = 'unranked',
}

export enum Symbols{
  BTC = 'BTC',
  ETH = 'ETH'
}

export enum AddressToken {
  BTC = '0x1cd0fcbe15e4365c8d11513e0406ca00f02e61c8',
  ETH = '0x4f5003fd2234df46fb2ee1531c89b8bdcc372255'
}

export const AddressSupport = [
  AddressToken.BTC,
  AddressToken.ETH
]

export enum PAIR {
  BTC = '0xcbcdf9626bc03e24f779434178a73a0b4bad62ed',
  ETH = '0x531febfeb9a61d948c384acfbe6dcc51057aea7e',
  AYB = '0x7cb15019adfbce42bffba0958e9901d0cef5ef69',
  TOSHI = '0x4b0aaf3ebb163dd45f663b38b6d93f6093ebc2d3',
  MOCHI = '0xbe09692245268b607c3029469d14be06191a0566',
  TYBG = '0x798654e614866113b63bb081621b2f9b126eeb84'
}