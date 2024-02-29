import gql from 'graphql-tag';

export const GET_INFO_TOKEN = gql`
  query GetInfoToken($address: String!) {
    Token(filter: { address: $address }) {
      address
      symbol
      oracleIndex
      oracledLatestRound
      supported
    }
  }
`;
