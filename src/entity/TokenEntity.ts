export interface TokenEntity {
  address: string;
  oracleIndex: number;
  oracleLatestRound: number;
  lastUpdatedPrice: string;
  name: string;
  supported: boolean;
  symbol: string;
  ticker: string;
  tokenId: string;
}

export interface TokenDTO {
  Token: TokenEntity;
}
