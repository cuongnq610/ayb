import gql from 'graphql-tag';

export const GET_HISTORY_PNL_BY_USER_ID = gql`
  query GetHistoryPNLByUserId($id: MongoID!) {
    Users(filter: { _id: $id }) {
      address
      roundEntered
      roundLost
      roundWon
      totalBetAmount
      totalLostAmount
      totalWonAmount
      bestWon
      bestWonRate
    }
  }
`;
